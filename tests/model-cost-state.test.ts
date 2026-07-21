import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SUPPORTED_VOLUMES,
  calculateApiCost,
  formatUsd,
} from '../src/components/presentation/visuals/a/model-cost-state';

const workload = { inputTokens: 100_000, outputTokens: 10_000 };

test('calcule le dossier A3 à partir des prix par million de tokens', () => {
  assert.equal(calculateApiCost({ inputPerMTok: 2, outputPerMTok: 10 }, workload, 1), 0.3);
  assert.equal(calculateApiCost({ inputPerMTok: 2.5, outputPerMTok: 15 }, workload, 1), 0.4);
  assert.equal(calculateApiCost({ inputPerMTok: 1.5, outputPerMTok: 7.5 }, workload, 1), 0.225);
  assert.equal(calculateApiCost({ inputPerMTok: 10, outputPerMTok: 50 }, workload, 1), 1.5);
  assert.equal(calculateApiCost({ inputPerMTok: 5, outputPerMTok: 30 }, workload, 1), 0.8);
  assert.equal(calculateApiCost({ inputPerMTok: 2, outputPerMTok: 12 }, workload, 1), 0.32);
});

test('multiplie le même coût unitaire par les trois volumes proposés', () => {
  assert.deepEqual(SUPPORTED_VOLUMES, [1, 10, 100]);
  assert.deepEqual(
    SUPPORTED_VOLUMES.map((volume) => calculateApiCost(
      { inputPerMTok: 10, outputPerMTok: 50 }, workload, volume,
    )),
    [1.5, 15, 150],
  );
});

test('formate les montants en dollars sans masquer les fractions utiles', () => {
  assert.equal(formatUsd(0.225), '0,225 $');
  assert.equal(formatUsd(0.3), '0,30 $');
  assert.equal(formatUsd(22.5), '22,50 $');
  assert.equal(formatUsd(150), '150 $');
});
