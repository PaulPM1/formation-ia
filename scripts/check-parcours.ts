import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { GUIDES } from '../src/parcours/manifests';
import { OUTILS } from '../src/parcours/outils';
import { validateGuides, validateOutils } from '../src/parcours/parcours-validation';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));

const issues = [...validateGuides(GUIDES), ...validateOutils(OUTILS)];

// Contrôles disque : hors du validateur pur, qui doit rester testable sans
// système de fichiers.
const attendus: string[] = [
  ...OUTILS.map((outil) => outil.logo),
  ...GUIDES.flatMap((guide) =>
    guide.etapes.flatMap((etape) => (etape.visuel.key === 'capture' ? [etape.visuel.fichier] : [])),
  ),
];

for (const chemin of attendus) {
  try {
    await access(new URL(chemin, `file://${publicDir}`));
  } catch {
    issues.push(`Fichier absent de public/ : ${chemin}`);
  }
}

const etapes = GUIDES.reduce((total, guide) => total + guide.etapes.length, 0);
const pannes = GUIDES.reduce(
  (total, guide) => total + guide.etapes.reduce((sous, etape) => sous + etape.pannes.length, 0),
  0,
);

if (issues.length > 0) {
  for (const issue of issues) console.error(issue);
  process.exitCode = 1;
} else {
  console.log(
    `Guides valides : ${GUIDES.length} guides, ${etapes} étapes, ${pannes} pannes, ${OUTILS.length} outils.`,
  );
}
