import type { PresentationLink } from './presentation-model';

export type SceneField = {
  key: string;
  label: string;
  values: string[];
};

type FieldGroups = Record<string, readonly string[]>;

const FIELD_LABELS: Record<string, string> = {
  activeStep: 'Étape active',
  answer: 'Réponse',
  candidates: 'Possibilités',
  choices: 'Choix proposés',
  cleanup: 'Nettoyage',
  columns: 'Colonnes attendues',
  context: 'Contexte',
  contexts: 'Contextes comparés',
  deliverable: 'Livrable',
  deliverables: 'Livrables',
  evidence: 'Preuve',
  example: 'Exemple',
  exerciseNotice: 'Contexte de l’exercice',
  expected: 'Résultat attendu',
  fields: 'Champs à renseigner',
  forbidden: 'Actions interdites',
  input: 'Point de départ',
  instruction: 'Consigne',
  interaction: 'Action proposée',
  legend: 'Repères de lecture',
  loop: 'Boucle',
  mission: 'Mission',
  modes: 'Modes comparés',
  objective: 'Objectif',
  observation: 'Observation',
  output: 'Sortie',
  prohibition: 'Interdit',
  prompt: 'Consigne',
  proof: 'Preuve de réussite',
  reason: 'Raison',
  rule: 'Règle',
  rules: 'Règles',
  safety: 'Garde-fou',
  statement: 'Affirmation',
  statements: 'Énoncés à traiter',
  steps: 'Étapes',
  successCriterion: 'Critère de réussite',
  warning: 'Attention',
};

export const MISSION_FIELD_GROUPS = {
  interaction: ['interaction'],
  instruction: ['instruction'],
  steps: ['mission', 'rules', 'checks'],
  deliverables: ['deliverables', 'deliverable', 'evidence', 'proof', 'columns'],
  success: ['successCriterion'],
} as const;

export const CHECKPOINT_FIELD_GROUPS = {
  interaction: ['interaction'],
  checklist: ['checks', 'rules', 'commands', 'mission'],
  criterion: ['successCriterion'],
} as const;

export const humanizeSceneKey = (key: string) => FIELD_LABELS[key] ?? key
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/^./, (letter) => letter.toUpperCase());

const formatScalar = (value: string | number | boolean | null | undefined) => {
  if (value === true) return 'Oui';
  if (value === false) return 'Non';
  if (value === null || value === undefined) return 'Non renseigné';
  return String(value);
};

export const normalizeSceneValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    if (value.length === 0) return ['Aucun élément'];
    return value.flatMap((item) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return [Object.entries(item)
          .flatMap(([key, nested]) => normalizeSceneValue(nested)
            .map((line) => `${humanizeSceneKey(key)} : ${line}`))
          .join(' · ')];
      }
      return normalizeSceneValue(item);
    });
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return ['Aucune donnée'];
    return entries.flatMap(([key, nested]) => normalizeSceneValue(nested)
      .map((line) => `${humanizeSceneKey(key)} : ${line}`));
  }

  return [formatScalar(value as string | number | boolean | null | undefined)];
};

export const normalizeSceneFields = (data: Record<string, unknown>): SceneField[] => Object
  .entries(data)
  .map(([key, value]) => ({
    key,
    label: humanizeSceneKey(key),
    values: normalizeSceneValue(value),
  }));

export const partitionSceneFields = (data: Record<string, unknown>, fieldGroups: FieldGroups) => {
  const fields = normalizeSceneFields(data);
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]));
  const consumed = new Set<string>();
  const groups: Record<string, SceneField[]> = {};

  for (const [group, keys] of Object.entries(fieldGroups)) {
    groups[group] = keys.flatMap((key) => {
      const field = fieldsByKey.get(key);
      if (!field || consumed.has(key)) return [];
      consumed.add(key);
      return [field];
    });
  }

  return {
    groups,
    details: fields.filter((field) => !consumed.has(field.key)),
  };
};

export const getResourceEmptyState = (
  links: PresentationLink[],
  accessibleDescription?: string,
) => {
  if (links.length > 0) return null;
  return accessibleDescription?.trim() || 'Aucune ressource complémentaire pour cette slide.';
};
