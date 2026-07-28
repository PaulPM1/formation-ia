import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { dimensionsPng } from '../src/features/faq/dimensions-png';

const dossierPublic = new URL('../public/', import.meta.url);

test('lit les vraies dimensions de deux captures aux formats différents', () => {
  const paysage = dimensionsPng(
    fileURLToPath(new URL('faq/cle-api/create-key-claude-console.png', dossierPublic)),
  );
  assert.deepEqual(paysage, { largeur: 1760, hauteur: 992 });

  const portrait = dimensionsPng(
    fileURLToPath(new URL('faq/cle-api/add-env-variable-values-vercel.png', dossierPublic)),
  );
  assert.deepEqual(portrait, { largeur: 1214, hauteur: 1348 });
});

test('lève une erreur explicite sur un fichier qui n\'est pas un PNG', () => {
  const svg = fileURLToPath(new URL('faq/outils/claude.svg', dossierPublic));
  assert.throws(() => dimensionsPng(svg), /PNG invalide/);
});
