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
    const sourceBlock = line.match(/\[sources?:\s*([^\]]+)\]/i)?.[1] ?? '';
    const citedSources = sourceBlock.match(/[a-z0-9._-]+\.md/gi) ?? [];
    const expectedSources: string[] = [...new Set(noteIds.flatMap((noteId) => (
      noteId in EXPECTED_NOTE_SOURCES
        ? [EXPECTED_NOTE_SOURCES[noteId as keyof typeof EXPECTED_NOTE_SOURCES]]
        : []
    )))];
    for (const noteId of noteIds) if (noteId in counts) counts[noteId] += 1;
    return noteIds.length > 0
      && noteIds.every((noteId) => noteId in EXPECTED_NOTE_SOURCES)
      && citedSources.length === expectedSources.length
      && citedSources.every((source) => expectedSources.includes(source));
  });
  const sources = associated && Object.values(counts).every((count) => count === 1);
  const uncertaintyText = (sections.get('À confirmer') ?? []).join('\n');
  const uncertainty = /\bN03\b/.test(uncertaintyText)
    && /\bN05\b/.test(uncertaintyText)
    && (
      /\b18\b[^\n]{0,120}\bou\b[^\n]{0,120}\b19\b/i.test(uncertaintyText)
      || /\b19\b[^\n]{0,120}\bou\b[^\n]{0,120}\b18\b/i.test(uncertaintyText)
    )
    && /septembre/i.test(uncertaintyText);

  return [
    { id: 'structure', label: 'Les trois sections sont présentes dans le bon ordre.', ok: structure },
    { id: 'sources', label: 'Les six notes citent le bon fichier sur la même action.', ok: sources },
    { id: 'uncertainty', label: 'Le conflit du 18 et du 19 septembre reste à confirmer.', ok: uncertainty },
  ];
}
