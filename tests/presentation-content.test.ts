import assert from 'node:assert/strict';
import test from 'node:test';

import { PRESENTATION_DECKS, PRESENTATION_SLIDES } from '../src/presentation/manifests';
import { validatePresentation } from '../src/presentation/presentation-validation';

const expectedIds = [
  'a1', 'a2', 'a3', 'a4', 'a5', 'b0', 'b1', 'b2', 'b3', 'b4', 'b4-bis',
  'c1', 'c2', 'c3',
];

test('couvre toutes les briques A1 à C3 dans l’ordre pédagogique', () => {
  assert.deepEqual(PRESENTATION_DECKS.map((deck) => deck.brickId), expectedIds);
});

test('contient les 76 étapes de compréhension validées', () => {
  assert.equal(PRESENTATION_SLIDES.length, 76);
});

test('chaque slide possède une thèse, une description et une note formateur', () => {
  for (const slide of PRESENTATION_SLIDES) {
    assert.ok(slide.claim.trim(), slide.id);
    assert.ok(slide.accessibleDescription.trim(), slide.id);
    assert.ok(slide.speaker.notes.trim(), slide.id);
    assert.ok(slide.speaker.transition.trim(), slide.id);
  }
  assert.deepEqual(validatePresentation(PRESENTATION_DECKS), []);
});
