import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { validateBlockBBrief } from '../src/features/block-b/brief-validator';
import {
  briefContractCases,
  canonicalBrief,
} from './helpers/block-b-brief-cases';

test('accepte un brief structuré, sourcé et incertain', () => {
  const checks = validateBlockBBrief(canonicalBrief);
  assert.deepEqual(checks.map((check) => check.id), [
    'structure', 'sources', 'uncertainty',
  ]);
  assert.ok(checks.every((check) => check.ok));
});

for (const briefCase of briefContractCases) {
  test(`le validateur navigateur applique le contrat partagé : ${briefCase.name}`, () => {
    const checks = validateBlockBBrief(briefCase.markdown);
    assert.deepEqual(
      Object.fromEntries(checks.map((check) => [check.id, check.ok])),
      briefCase.expected,
    );
  });
}

test('nomme séparément chaque échec', () => {
  const checks = validateBlockBBrief(
    canonicalBrief
      .replace('## À confirmer', '## Décision')
      .replace('[source: demandes.md]', '[source: inconnue.md]'),
  );
  assert.equal(checks.find((check) => check.id === 'structure')?.ok, false);
  assert.equal(checks.find((check) => check.id === 'sources')?.ok, false);
  assert.equal(checks.find((check) => check.id === 'uncertainty')?.ok, false);
});

test('le composant lit le fichier local sans requête réseau', async () => {
  const source = await readFile(
    new URL('../src/components/block-b/BriefValidator.astro', import.meta.url),
    'utf8',
  ).catch(() => '');
  assert.match(source, /type="file"/);
  assert.match(source, /file\.text\(\)/);
  assert.match(source, /aria-live="polite"/);
  assert.doesNotMatch(source, /\bfetch\(/);
  assert.doesNotMatch(source, /XMLHttpRequest/);
});
