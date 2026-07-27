import {
  KEBAB_PATTERN,
  VISUEL_KEYS,
  type Guide,
  type Panne,
} from './parcours-model';

const visuelKeys = new Set<string>(VISUEL_KEYS);

const vide = (value: unknown): boolean =>
  typeof value !== 'string' || value.trim().length === 0;

function validatePanne(panne: Panne, prefixe: string, issues: string[]): void {
  if (!KEBAB_PATTERN.test(panne.id)) {
    issues.push(`${prefixe} : identifiant de panne « ${panne.id} » hors kebab-case.`);
  }
  if (vide(panne.symptome)) issues.push(`${prefixe} : symptome vide.`);
  if (vide(panne.cause)) issues.push(`${prefixe} : cause vide.`);
  if (vide(panne.preuve)) issues.push(`${prefixe} : preuve de sortie vide.`);
  if (panne.reparation.length === 0) issues.push(`${prefixe} : reparation vide.`);
}

export function validateGuides(guides: Guide[]): string[] {
  const issues: string[] = [];

  for (const guide of guides) {
    if (!KEBAB_PATTERN.test(guide.id)) {
      issues.push(`Guide « ${guide.id} » : identifiant hors kebab-case.`);
    }

    // Les ancres vivent dans l'URL d'un guide : l'unicité se joue par guide,
    // pas globalement. Deux guides peuvent donc avoir une étape homonyme.
    const etapeIds = new Set<string>();
    const panneIds = new Set<string>();

    for (const etape of guide.etapes) {
      const prefixe = `${guide.id}/${etape.id}`;

      if (!KEBAB_PATTERN.test(etape.id)) {
        issues.push(`${prefixe} : identifiant d\'étape hors kebab-case.`);
      } else if (etapeIds.has(etape.id)) {
        issues.push(`${prefixe} : identifiant d\'étape en double.`);
      } else {
        etapeIds.add(etape.id);
      }

      if (vide(etape.preuve?.visible)) issues.push(`${prefixe} : preuve.visible vide.`);
      if (vide(etape.preuve?.sinon)) issues.push(`${prefixe} : preuve.sinon vide.`);

      if (etape.lieu === 'navigateur' && vide(etape.service)) {
        issues.push(`${prefixe} : lieu navigateur sans service renseigné.`);
      }

      if (!visuelKeys.has(etape.visuel?.key)) {
        issues.push(`${prefixe} : visuel inconnu « ${etape.visuel?.key} ».`);
      }

      for (const panne of etape.pannes) {
        if (panneIds.has(panne.id)) {
          issues.push(`${prefixe} : identifiant de panne « ${panne.id} » en double.`);
        } else {
          panneIds.add(panne.id);
        }
        validatePanne(panne, `${prefixe}#${panne.id}`, issues);
      }
    }
  }

  return issues;
}
