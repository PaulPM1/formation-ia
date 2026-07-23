import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BLOCK_B_ECOSYSTEM_STORAGE_KEY,
  blockBPanelVisibility,
  parseBlockBEcosystem,
} from '../src/features/block-b/ecosystem';

test('n’accepte que claude et openai', () => {
  assert.equal(parseBlockBEcosystem('claude'), 'claude');
  assert.equal(parseBlockBEcosystem('openai'), 'openai');
  assert.equal(parseBlockBEcosystem('autre'), null);
  assert.equal(parseBlockBEcosystem(null), null);
  assert.equal(BLOCK_B_ECOSYSTEM_STORAGE_KEY, 'bloc-b-ecosystem');
});

test('montre les deux voies avant le choix puis une seule après le choix', () => {
  const panels = ['claude', 'openai', 'claude', 'openai'];
  assert.deepEqual(blockBPanelVisibility(null, panels), [true, true, true, true]);
  assert.deepEqual(blockBPanelVisibility('claude', panels), [true, false, true, false]);
  assert.deepEqual(blockBPanelVisibility('openai', panels), [false, true, false, true]);
});
