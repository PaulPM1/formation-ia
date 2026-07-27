import type { Etape, Guide, Lieu } from '../../parcours/parcours-model';

const LIEU_LABEL: Record<Lieu, string> = {
  machine: 'Votre ordinateur',
  vscode: 'VS Code',
  navigateur: 'Votre navigateur',
};

const LIEU_CIBLE: Record<Lieu, string> = {
  machine: 'votre ordinateur',
  vscode: 'VS Code',
  navigateur: 'votre navigateur',
};

export function libelleLieu(etape: Etape): string {
  const base = LIEU_LABEL[etape.lieu];
  return etape.service ? `${base} · ${etape.service}` : base;
}

/**
 * Retourne, pour chaque étape, la cible à annoncer quand on change
 * d'application, ou null quand on reste au même endroit.
 */
export function changementsDeLieu(guide: Guide): (string | null)[] {
  return guide.etapes.map((etape, index) => {
    if (index === 0) return null;
    return etape.lieu === guide.etapes[index - 1].lieu ? null : LIEU_CIBLE[etape.lieu];
  });
}
