export type BriefCheck = {
  id: 'structure' | 'sources' | 'uncertainty';
  label: string;
  ok: boolean;
};

const REQUIRED_SECTIONS = ['Actions du jour', 'À confirmer', 'Plus tard'];
const EXPECTED_NOTE_SOURCES = {
  N01: 'demandes.md',
  N02: 'demandes.md',
  N03: 'reunion.md',
  N04: 'reunion.md',
  N05: 'messages.md',
  N06: 'messages.md',
} as const;
const HISTORICAL_SOURCE_ALIASES = {
  'inbox/01-demandes.md': 'demandes.md',
  'inbox/02-reunion.md': 'reunion.md',
  'inbox/03-messages.md': 'messages.md',
} as const;
const CANONICAL_SOURCES: ReadonlySet<string> = new Set(
  Object.values(EXPECTED_NOTE_SOURCES),
);

const normalizeSource = (source: string): string | null => {
  if (source in HISTORICAL_SOURCE_ALIASES) {
    return HISTORICAL_SOURCE_ALIASES[
      source as keyof typeof HISTORICAL_SOURCE_ALIASES
    ];
  }
  return CANONICAL_SOURCES.has(source) ? source : null;
};

const parseSections = (markdown: string) => {
  const sections = new Map<string, string[]>();
  let current: string | null = null;
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = heading[1].trim();
      if (!sections.has(current)) sections.set(current, []);
    } else if (current) {
      sections.get(current)?.push(line);
    }
  }
  return sections;
};

export function validateBlockBBrief(markdown: string): BriefCheck[] {
  const sections = parseSections(markdown);
  const authoredSections = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)]
    .map(([, heading]) => heading.trim());
  const structure = authoredSections.length === REQUIRED_SECTIONS.length
    && authoredSections.every((heading, index) => heading === REQUIRED_SECTIONS[index]);
  const actionLines = REQUIRED_SECTIONS.flatMap((heading) => sections.get(heading) ?? [])
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '));
  const counts = Object.fromEntries(
    Object.keys(EXPECTED_NOTE_SOURCES).map((noteId) => [noteId, 0]),
  ) as Record<string, number>;
  const associated = actionLines.length > 0 && actionLines.every((line) => {
    const noteIds = [...line.matchAll(/\bN\d{2}\b/g)].map(([noteId]) => noteId);
    const sourceBlocks = [...line.matchAll(/\[sources?:\s*([^\]]*)\]/gi)]
      .map(([, sourceBlock]) => sourceBlock);
    const sourceEntries = sourceBlocks.flatMap((sourceBlock) => (
      sourceBlock.split(';').map((source) => source.trim())
    ));
    const citedSources = sourceEntries.map(normalizeSource);
    const sourceBlocksValid = sourceBlocks.length > 0
      && citedSources.every((source) => source !== null);
    const expectedSources: string[] = [...new Set(noteIds.flatMap((noteId) => (
      noteId in EXPECTED_NOTE_SOURCES
        ? [EXPECTED_NOTE_SOURCES[noteId as keyof typeof EXPECTED_NOTE_SOURCES]]
        : []
    )))];
    for (const noteId of noteIds) if (noteId in counts) counts[noteId] += 1;
    return noteIds.length > 0
      && noteIds.every((noteId) => noteId in EXPECTED_NOTE_SOURCES)
      && sourceBlocksValid
      && citedSources.length === expectedSources.length
      && citedSources.every((source) => (
        source !== null && expectedSources.includes(source)
      ));
  });
  const sources = associated && Object.values(counts).every((count) => count === 1);
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
    ));

  return [
    { id: 'structure', label: 'Les trois sections sont présentes dans le bon ordre.', ok: structure },
    { id: 'sources', label: 'Les six notes citent le bon fichier sur la même action.', ok: sources },
    { id: 'uncertainty', label: 'Le conflit du 18 et du 19 septembre reste à confirmer.', ok: uncertainty },
  ];
}
