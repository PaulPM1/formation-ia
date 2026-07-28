import assert from 'node:assert/strict';
import test from 'node:test';

import { GUIDES, cheminGuide } from '../src/parcours/manifests';

test('chaque guide a une route stable', () => {
  assert.equal(cheminGuide('naissance-projet'), '/faq/naissance-projet/');
});

test('les identifiants de guide sont uniques', () => {
  const ids = GUIDES.map((guide) => guide.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('chaque étape a une ancre calculable et unique dans son guide', () => {
  for (const guide of GUIDES) {
    const ancres = guide.etapes.map((etape) => `etape-${etape.id}`);
    assert.equal(new Set(ancres).size, ancres.length, `ancres en double dans ${guide.id}`);
  }
});
