import assert from 'node:assert/strict';
import test from 'node:test';

import { GUIDES, getGuide } from '../src/parcours/manifests';
import { OUTILS } from '../src/parcours/outils';
import { validateGuides, validateOutils } from '../src/parcours/parcours-validation';

test('les manifestes livrés passent le validateur', () => {
  assert.deepEqual(validateGuides(GUIDES), []);
  assert.deepEqual(validateOutils(OUTILS), []);
});

test('les compteurs figés du contenu', () => {
  assert.equal(GUIDES.length, 3);
  assert.equal(GUIDES.reduce((total, guide) => total + guide.etapes.length, 0), 21);
  assert.equal(
    GUIDES.reduce(
      (total, guide) => total + guide.etapes.reduce((sous, etape) => sous + etape.pannes.length, 0),
      0,
    ),
    13,
  );
});

test('getGuide retrouve un guide par son identifiant', () => {
  assert.equal(getGuide('naissance-projet')?.id, 'naissance-projet');
  assert.equal(getGuide('inconnu'), undefined);
});

test('la carte des outils est complète', () => {
  assert.deepEqual(
    OUTILS.map((outil) => outil.nom),
    ['Wispr Flow', 'Typeless', 'VS Code', 'Claude Code', 'GitHub', 'Vercel'],
  );
});
