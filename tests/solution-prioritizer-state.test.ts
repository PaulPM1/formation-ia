import assert from 'node:assert/strict';
import test from 'node:test';

import {
  advancePrioritizer,
  chooseSolution,
  createPrioritizerState,
  revealPrioritizerAnswer,
} from '../src/components/presentation/visuals/a/solution-prioritizer-state';

test('le prioriteur refuse de révéler une réponse sans choix', () => {
  const initial = createPrioritizerState();

  assert.deepEqual(revealPrioritizerAnswer(initial, 'chat'), initial);
});

test('le prioriteur compte une bonne réponse une seule fois', () => {
  const selected = chooseSolution(createPrioritizerState(), 'chat');
  const revealed = revealPrioritizerAnswer(selected, 'chat');

  assert.deepEqual(revealed, {
    index: 0,
    selection: 'chat',
    revealed: true,
    score: 1,
    complete: false,
  });
  assert.deepEqual(revealPrioritizerAnswer(revealed, 'chat'), revealed);
});

test('le prioriteur conserve une erreur puis passe à la situation suivante', () => {
  const wrong = revealPrioritizerAnswer(
    chooseSolution(createPrioritizerState(), 'work'),
    'chat',
  );

  assert.equal(wrong.score, 0);
  assert.deepEqual(advancePrioritizer(wrong, 4), {
    index: 1,
    selection: null,
    revealed: false,
    score: 0,
    complete: false,
  });
});

test('le prioriteur termine la quatrième situation et peut être recréé', () => {
  const last = {
    index: 3,
    selection: 'code',
    revealed: true,
    score: 4,
    complete: false,
  };

  assert.deepEqual(advancePrioritizer(last, 4), { ...last, complete: true });
  assert.deepEqual(createPrioritizerState(), {
    index: 0,
    selection: null,
    revealed: false,
    score: 0,
    complete: false,
  });
});
