export const REQUIRED_BRIEF_SECTIONS = [
  'Actions du jour',
  'À confirmer',
  'Plus tard',
];

export const EXPECTED_NOTE_SOURCES = {
  N01: 'demandes.md',
  N02: 'demandes.md',
  N03: 'reunion.md',
  N04: 'reunion.md',
  N05: 'messages.md',
  N06: 'messages.md',
};

const CANONICAL_SOURCES = new Set(Object.values(EXPECTED_NOTE_SOURCES));
const SOURCE_TOKEN_PRESENT = /\[sources?\s*:/i;
const SOURCE_TOKEN = /\[sources?\s*:/gi;
const SOURCE_BLOCK = /\[sources?:\s*([^\]]*)\]/gi;
const DECISION_WORD = /\b(?:décision prise|décidé|décider|retenir|retenu|choisir|choisi|trancher|tranché|fixer|fixé|écarter|écarté)\b/i;

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

const parseSourceAnnotations = (line) => {
  const tokens = [...line.matchAll(SOURCE_TOKEN)];
  const blocks = [...line.matchAll(SOURCE_BLOCK)];
  const entries = blocks.flatMap(([, content]) => content
    .split(/[;,]/)
    .map((entry) => entry.trim()));
  return {
    blocks: blocks.length,
    entries,
    valid: tokens.length === blocks.length
      && blocks.length > 0
      && entries.length > 0
      && entries.every((entry) => (
        entry.length > 0 && CANONICAL_SOURCES.has(entry)
      )),
  };
};

export const validateBriefContract = (markdown) => {
  const sections = parseSections(markdown);
  const authoredSections = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)]
    .map(([, heading]) => heading.trim());
  const structure = authoredSections.length === REQUIRED_BRIEF_SECTIONS.length
    && authoredSections.every((
      heading,
      index,
    ) => heading === REQUIRED_BRIEF_SECTIONS[index]);

  const actionLines = REQUIRED_BRIEF_SECTIONS
    .flatMap((heading) => sections.get(heading) ?? [])
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '));
  const noteCounts = Object.fromEntries(
    Object.keys(EXPECTED_NOTE_SOURCES).map((noteId) => [noteId, 0]),
  );
  let actionSourceBlocks = 0;
  const actionSourcesAreExact = actionLines.length > 0 && actionLines.every((line) => {
    const noteIds = [...line.matchAll(/\bN\d{2}\b/g)].map(([noteId]) => noteId);
    for (const noteId of noteIds) {
      if (noteId in noteCounts) noteCounts[noteId] += 1;
    }

    const annotations = parseSourceAnnotations(line);
    actionSourceBlocks += annotations.blocks;
    const expectedSources = [...new Set(noteIds.flatMap((noteId) => (
      noteId in EXPECTED_NOTE_SOURCES
        ? [EXPECTED_NOTE_SOURCES[noteId]]
        : []
    )))];
    return noteIds.length > 0
      && noteIds.every((noteId) => noteId in EXPECTED_NOTE_SOURCES)
      && annotations.valid
      && annotations.entries.length === expectedSources.length
      && new Set(annotations.entries).size === annotations.entries.length
      && annotations.entries.every((source) => expectedSources.includes(source));
  });

  const annotatedLines = markdown.split(/\r?\n/)
    .filter((line) => SOURCE_TOKEN_PRESENT.test(line));
  const allAnnotationsAreCanonical = annotatedLines.length > 0
    && annotatedLines.every((line) => parseSourceAnnotations(line).valid);
  const allSourceBlocks = annotatedLines.reduce(
    (count, line) => count + parseSourceAnnotations(line).blocks,
    0,
  );
  const sources = actionSourcesAreExact
    && allAnnotationsAreCanonical
    && allSourceBlocks === actionSourceBlocks
    && Object.values(noteCounts).every((count) => count === 1);

  const uncertainty = (sections.get('À confirmer') ?? [])
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .some((line) => (
      /\bN03\b/.test(line)
      && /\bN05\b/.test(line)
      && (
        /\b18\b.{0,120}\bou\b.{0,120}\b19\b/i.test(line)
        || /\b19\b.{0,120}\bou\b.{0,120}\b18\b/i.test(line)
      )
      && /septembre/i.test(line)
      && !DECISION_WORD.test(line)
    ));

  return { structure, sources, uncertainty };
};
