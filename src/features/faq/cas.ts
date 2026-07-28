import { cheminGuide } from '../../parcours/manifests';
import type { Guide } from '../../parcours/parcours-model';

export type Cas = {
  symptome: string;
  guideId: string;
  guideTitre: string;
  etapeId: string;
  panneId: string;
  href: string;
};

/**
 * La grille d'accueil est dérivée des manifestes et jamais saisie à la main :
 * elle ne peut donc pas diverger du contenu des guides.
 */
export function collecterCas(guides: Guide[]): Cas[] {
  return guides.flatMap((guide) =>
    guide.etapes.flatMap((etape) =>
      etape.pannes
        .filter((panne) => panne.frequente)
        .map((panne) => ({
          symptome: panne.symptome,
          guideId: guide.id,
          guideTitre: guide.titre,
          etapeId: etape.id,
          panneId: panne.id,
          href: `${cheminGuide(guide.id)}#panne-${panne.id}`,
        })),
    ),
  );
}
