import assert from 'node:assert/strict';
import test from 'node:test';

import { renderBrief, sortNotes } from './app.mjs';
import { notes } from './brief.mjs';

test('préserve le tri par priorité puis par identifiant', () => {
  assert.deepEqual(sortNotes(notes).map((note) => note.id), [
    'N01', 'N06', 'N03', 'N05', 'N02', 'N04',
  ]);
  const html = renderBrief(notes);
  assert.ok(html.indexOf('N01') < html.indexOf('N02'));
});

test.todo('affiche la source sous chaque carte');
