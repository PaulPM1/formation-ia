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

const historicalBrief = validBrief
  .replaceAll('demandes.md', 'inbox/01-demandes.md')
  .replaceAll('reunion.md', 'inbox/02-reunion.md')
  .replaceAll('messages.md', 'inbox/03-messages.md');

test('accepte un brief structuré, sourcé et incertain', () => {
  const checks = validateBlockBBrief(validBrief);
  assert.deepEqual(checks.map((check) => check.id), [
    'structure', 'sources', 'uncertainty',
  ]);
  assert.ok(checks.every((check) => check.ok));
});

test('accepte les trois chemins historiques précis', async () => {
  const trainerBrief = await readFile(
    new URL(
      '../kits/bloc-b-assistant-formateur/corriges/brief-cowork.md',
      import.meta.url,
    ),
    'utf8',
  );
  const checks = validateBlockBBrief(trainerBrief);
  assert.ok(checks.every((check) => check.ok));
});

test('borne la compatibilité aux chemins historiques précis', () => {
  const checks = validateBlockBBrief(
    historicalBrief.replace('inbox/01-demandes.md', 'archive/01-demandes.md'),
  );
  assert.equal(checks.find((check) => check.id === 'sources')?.ok, false);
});

test('rejette un suffixe historique', () => {
  const checks = validateBlockBBrief(
    historicalBrief.replace(
      'inbox/01-demandes.md',
      'inbox/01-demandes.md.bak',
    ),
  );
  assert.equal(checks.find((check) => check.id === 'sources')?.ok, false);
});

test('rejette un conflit dispersé sur plusieurs lignes', () => {
  const checks = validateBlockBBrief(
    validBrief.replace(
      '- [N03, N05] Confirmer le 18 ou le 19 septembre. [sources: reunion.md ; messages.md]',
      [
        '- [N03] Confirmer le 18 ou le 19. [source: reunion.md]',
        '- [N05] Attendre septembre. [source: messages.md]',
      ].join('\n'),
    ),
  );
  assert.equal(checks.find((check) => check.id === 'sources')?.ok, true);
  assert.equal(checks.find((check) => check.id === 'uncertainty')?.ok, false);
});

test('rejette une source supplémentaire incorrecte', () => {
  const checks = validateBlockBBrief(
    validBrief.replace(
      '[source: demandes.md]',
      '[source: demandes.md] [source: inconnue.md]',
    ),
  );
  assert.equal(checks.find((check) => check.id === 'sources')?.ok, false);
});

test('rejette un bloc source invalide', () => {
  const checks = validateBlockBBrief(
    validBrief.replace(
      '[source: demandes.md]',
      '[source: demandes.md] [source: inconnue]',
    ),
  );
  assert.equal(checks.find((check) => check.id === 'sources')?.ok, false);
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
