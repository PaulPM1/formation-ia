import assert from 'node:assert/strict';
import test from 'node:test';

import { PRESENTATION_SLIDES } from '../src/presentation/manifests';
import {
  MISSION_FIELD_GROUPS,
  getResourceEmptyState,
  normalizeSceneFields,
  partitionSceneFields,
} from '../src/presentation/scene-data';

const slide = (id: string) => {
  const found = PRESENTATION_SLIDES.find((candidate) => candidate.id === id);
  assert.ok(found, `slide ${id} absente`);
  return found;
};

const partitionKeys = (partition: ReturnType<typeof partitionSceneFields>) => [
  ...Object.values(partition.groups).flat().map((field) => field.key),
  ...partition.details.map((field) => field.key),
];

test('préserve un tableau vide avec un état textuel explicite', () => {
  const fields = normalizeSceneFields({ tools: [] });
  const tools = fields.find((field) => field.key === 'tools');

  assert.deepEqual(tools?.values, ['Aucun élément']);
});

test('normalise chaque champ structuré des manifestes exactement une fois', () => {
  for (const current of PRESENTATION_SLIDES) {
    const sourceKeys = Object.keys(current.visual.data);
    const fields = normalizeSceneFields(current.visual.data);

    assert.deepEqual(fields.map((field) => field.key), sourceKeys, current.id);
    assert.equal(new Set(fields.map((field) => field.key)).size, sourceKeys.length, current.id);
    assert.ok(fields.every((field) => field.values.length > 0), current.id);
  }
});

test('conserve la charge de référence et les six tarifs API A3', () => {
  const current = slide('a3-api-cost');

  assert.deepEqual(current.visual.data.workload, {
    inputTokens: 100_000,
    outputTokens: 10_000,
  });
  assert.equal((current.visual.data.prices as unknown[]).length, 6);
});

test('conserve interaction et instruction de mission sans doublon', () => {
  const data = {
    interaction: 'Ouvrir la mission.',
    instruction: 'Pour chaque action, notez :',
    mission: ['Choisir', 'Justifier'],
    successCriterion: 'Une décision argumentée.',
  };
  const partition = partitionSceneFields(data, MISSION_FIELD_GROUPS);

  assert.deepEqual(partition.groups.interaction[0]?.values, ['Ouvrir la mission.']);
  assert.deepEqual(partition.groups.instruction[0]?.values, ['Pour chaque action, notez :']);
  assert.deepEqual(partitionKeys(partition).sort(), Object.keys(data).sort());
  assert.equal(new Set(partitionKeys(partition)).size, Object.keys(data).length);
});

test('décrit explicitement un rail de ressources vide', () => {
  const current = slide('a1-opening');

  assert.equal(getResourceEmptyState([], current.accessibleDescription), current.accessibleDescription);
  assert.equal(getResourceEmptyState([], ''), 'Aucune ressource complémentaire pour cette slide.');
  assert.equal(getResourceEmptyState(current.links, current.accessibleDescription), null);
});
