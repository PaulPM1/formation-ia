import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { validateBlockBBrief } from '../src/features/block-b/brief-validator';

const validBrief = `# Brief du jour
## Actions du jour
- [N01] Envoyer l’agenda. [source: demandes.md]
- [N06] Transmettre le nombre. [source: messages.md]
## À confirmer
- [N03, N05] Confirmer le 18 ou le 19 septembre. [sources: reunion.md ; messages.md]
## Plus tard
- [N02] Préparer les icônes. [source: demandes.md]
- [N04] Archiver après validation. [source: reunion.md]
`;

test('accepte un brief structuré, sourcé et incertain', () => {
  const checks = validateBlockBBrief(validBrief);
  assert.deepEqual(checks.map((check) => check.id), [
    'structure', 'sources', 'uncertainty',
  ]);
  assert.ok(checks.every((check) => check.ok));
});

test('nomme séparément chaque échec', () => {
  const checks = validateBlockBBrief(
    validBrief
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
