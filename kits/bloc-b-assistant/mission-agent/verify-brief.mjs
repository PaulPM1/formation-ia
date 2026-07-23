import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateBriefContract } from './brief-contract.mjs';

const defaultRoot = path.dirname(fileURLToPath(import.meta.url));
const allowedOutputNames = new Set(['README.md', 'brief-du-jour.md', '.DS_Store']);

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

  const briefContract = validateBriefContract(output);
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
        && briefContract.structure
        && outputDirectoryReadable
        && unexpectedOutputs.length === 0,
    },
    {
      id: 'sources',
      label: 'les six notes citent leur fichier source sur la même action',
      ok: outputExists
        && briefContract.sources,
    },
    {
      id: 'uncertainty',
      label: 'le conflit reste sous « À confirmer »',
      ok: outputExists
        && briefContract.uncertainty,
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
