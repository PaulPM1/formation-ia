import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FAMILY_LABELS,
  getStructureCompletion,
  groupBricksByFamily,
} from '../src/content/brick-view';

test('regroupe les briques par famille et conserve l’ordre pédagogique', () => {
  const grouped = groupBricksByFamily([
    { data: { family: 'b', order: 3 } },
    { data: { family: 'a', order: 2 } },
    { data: { family: 'a', order: 1 } },
  ]);

  assert.deepEqual(grouped.map((group) => group.family), ['a', 'b']);
  assert.equal(grouped[0].label, FAMILY_LABELS.a);
  assert.deepEqual(grouped[0].entries.map((entry) => entry.data.order), [1, 2]);
});

test('calcule la complétude de la structure attendue pour un atelier', () => {
  const headings = [
    'Cap',
    'Concept durable',
    'Pratique avec Claude',
    'Mission commune',
    'Livrable',
    'Notes formateur',
    'Défis avancés',
    'Variantes',
    'Dépannage',
    'Ressources',
    'Ouverture',
    'Étapes',
  ];
  const body = headings.map((heading) => `## ${heading}`).join('\n');

  assert.deepEqual(getStructureCompletion(body, 'workshop'), {
    complete: 12,
    total: 13,
    percentage: 92,
  });
});
