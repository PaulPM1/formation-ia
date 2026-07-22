import {
  BRICK_FAMILIES,
  COMMON_HEADINGS,
  TYPE_HEADINGS,
  type BrickFrontmatter,
} from './brick-model';

export const FAMILY_LABELS = {
  a: "Comprendre l’IA",
  b: 'Les interfaces',
  c: 'Étendre et personnaliser',
  d: 'L’écosystème du développement',
  e: 'La méthode',
  f: 'Pratique et restitution',
} as const;

export const PRIORITY_LABELS = {
  socle: 'Socle',
  bonus: 'Bonus',
  facultatif: 'Facultatif',
  'a-trancher': 'À trancher',
} as const;

export const STATUS_LABELS = {
  'a-rediger': 'À rédiger',
  'en-cours': 'En cours',
  'a-relire': 'À relire',
  validee: 'Validée',
} as const;

export const OWNER_LABELS = {
  paul: 'Paul',
  matthieu: 'Matthieu',
  'a-attribuer': 'À attribuer',
} as const;

export const TYPE_LABELS = {
  concept: 'Concept',
  demonstration: 'Démonstration',
  workshop: 'Atelier',
  setup: 'Setup',
  restitution: 'Restitution',
} as const;

type GroupableEntry = {
  data: Pick<BrickFrontmatter, 'family' | 'order'>;
};

export function groupBricksByFamily<T extends GroupableEntry>(entries: T[]) {
  return BRICK_FAMILIES.map((family) => ({
    family,
    label: FAMILY_LABELS[family],
    entries: entries
      .filter((entry) => entry.data.family === family)
      .toSorted((left, right) => left.data.order - right.data.order),
  })).filter((group) => group.entries.length > 0);
}

export function getStructureCompletion(
  body: string,
  type: BrickFrontmatter['type'],
) {
  const presentHeadings = new Set(
    Array.from(body.matchAll(/^##\s+(.+?)\s*$/gm), (match) => match[1]),
  );
  const requiredHeadings = [...COMMON_HEADINGS, ...TYPE_HEADINGS[type]];
  const complete = requiredHeadings.filter((heading) =>
    presentHeadings.has(heading),
  ).length;

  return {
    complete,
    total: requiredHeadings.length,
    percentage: Math.round((complete / requiredHeadings.length) * 100),
  };
}
