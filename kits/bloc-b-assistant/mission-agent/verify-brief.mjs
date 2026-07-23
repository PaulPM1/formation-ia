import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultRoot = path.dirname(fileURLToPath(import.meta.url));
const requiredSectionNames = ['Actions du jour', 'À confirmer', 'Plus tard'];
const expectedNoteSources = {
  N01: 'demandes.md',
  N02: 'demandes.md',
  N03: 'reunion.md',
  N04: 'reunion.md',
  N05: 'messages.md',
  N06: 'messages.md',
};
const allowedOutputNames = new Set(['README.md', 'brief-du-jour.md', '.DS_Store']);

const parseSections = (markdown) => {
  const sections = new Map();
  let currentSection = null;
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      currentSection = heading[1].trim();
      if (!sections.has(currentSection)) sections.set(currentSection, []);
    } else if (currentSection) {
      sections.get(currentSection).push(line);
    }
  }
  return sections;
};

const sha256 = async (filePath) => createHash('sha256')
  .update(await readFile(filePath))
  .digest('hex');

export async function verifyMissionAgent({ rootDirectory = defaultRoot, log = true } = {}) {
  const outputPath = path.join(rootDirectory, 'sortie/brief-du-jour.md');
  let output = '';
  let outputExists = true;
  try {
    output = await readFile(outputPath, 'utf8');
  } catch {
    outputExists = false;
  }

  const fingerprintPath = path.join(rootDirectory, 'sources-sha256.json');
  const expectedFingerprints = JSON.parse(await readFile(fingerprintPath, 'utf8'));
  const fingerprintResults = await Promise.all(
    Object.entries(expectedFingerprints).map(async ([relativePath, expected]) => ({
      relativePath,
      expected,
      actual: await sha256(path.join(rootDirectory, relativePath)).catch(() => 'absent'),
    })),
  );

  const requiredSources = [...new Set(Object.values(expectedNoteSources))];
  const sections = parseSections(output);
  const authoredSectionNames = [...output.matchAll(/^##\s+(.+?)\s*$/gm)]
    .map(([, name]) => name.trim());
  const exactSections = authoredSectionNames.length === requiredSectionNames.length
    && authoredSectionNames.every((name, index) => name === requiredSectionNames[index]);
  const actionLines = requiredSectionNames.flatMap((sectionName) => (
    sections.get(sectionName) ?? []
  )).map((line) => line.trim()).filter((line) => line.startsWith('- '));
  const noteCounts = Object.fromEntries(Object.keys(expectedNoteSources).map((noteId) => [noteId, 0]));
  const actionSourcesAreAssociated = actionLines.length > 0 && actionLines.every((line) => {
    const noteIds = [...line.matchAll(/\bN\d{2}\b/g)].map(([noteId]) => noteId);
    for (const noteId of noteIds) {
      if (noteId in noteCounts) noteCounts[noteId] += 1;
    }
    return noteIds.length > 0 && noteIds.every((noteId) => (
      noteId in expectedNoteSources && line.includes(expectedNoteSources[noteId])
    ));
  });
  const sixNotesCoveredOnce = Object.values(noteCounts).every((count) => count === 1);
  const uncertainty = (sections.get('À confirmer') ?? []).join('\n');
  const uncertaintyKeepsBothNotes = /\bN03\b/.test(uncertainty) && /\bN05\b/.test(uncertainty);
  const uncertaintyKeepsAlternativeDates = (
    /\b18\b[^\n]{0,120}\bou\b[^\n]{0,120}\b19\b/i.test(uncertainty)
    || /\b19\b[^\n]{0,120}\bou\b[^\n]{0,120}\b18\b/i.test(uncertainty)
  ) && /septembre/i.test(uncertainty);
  let outputDirectoryReadable = true;
  let unexpectedOutputs = [];
  try {
    const outputEntries = await readdir(path.join(rootDirectory, 'sortie'), { withFileTypes: true });
    unexpectedOutputs = outputEntries.filter((entry) => (
      !allowedOutputNames.has(entry.name) || !entry.isFile()
    )).map((entry) => entry.name);
  } catch {
    outputDirectoryReadable = false;
  }
  const checks = [
    {
      id: 'output',
      label: 'la sortie contient uniquement un brief avec les trois sections attendues',
      ok: outputExists
        && output.trim().length > 0
        && exactSections
        && outputDirectoryReadable
        && unexpectedOutputs.length === 0,
    },
    {
      id: 'sources',
      label: 'les six notes citent leur fichier source sur la même action',
      ok: outputExists
        && requiredSources.every((source) => output.includes(source))
        && actionSourcesAreAssociated
        && sixNotesCoveredOnce,
    },
    {
      id: 'uncertainty',
      label: 'le conflit reste sous « À confirmer »',
      ok: outputExists
        && uncertaintyKeepsBothNotes
        && uncertaintyKeepsAlternativeDates,
    },
    {
      id: 'fingerprints',
      label: 'les empreintes SHA-256 de sources/ sont intactes',
      ok: fingerprintResults.every(({ actual, expected }) => actual === expected),
    },
  ];

  if (log) {
    for (const check of checks) console.log(`${check.ok ? 'OK' : 'ÉCHEC'} : ${check.label}`);
    if (!checks.every((check) => check.ok)) {
      for (const outputName of unexpectedOutputs) console.log(`Sortie inattendue : sortie/${outputName}`);
      for (const item of fingerprintResults.filter(({ actual, expected }) => actual !== expected)) {
        console.log(`Empreinte différente : ${item.relativePath}`);
      }
    }
  }

  return { ok: checks.every((check) => check.ok), checks };
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  const result = await verifyMissionAgent();
  if (!result.ok) process.exitCode = 1;
}
