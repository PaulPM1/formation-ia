import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CAPTURE_PEREMPTION_JOURS,
  KEBAB_PATTERN,
  LIEUX,
  POURQUOI_MAX,
  ROLE_MAX,
  VISUEL_KEYS,
  VOCABULAIRE_INTERDIT,
} from '../src/parcours/parcours-model';

test('le lieu terminal n\'existe pas dans le modèle', () => {
  assert.deepEqual([...LIEUX], ['machine', 'claude', 'navigateur']);
  assert.equal(LIEUX.includes('terminal' as never), false);
});

test('les quatre visuels sont déclarés', () => {
  assert.deepEqual([...VISUEL_KEYS], ['capture', 'claude', 'arborescence', 'trois-lieux']);
});

test('les garde-fous éditoriaux portent les valeurs du spec', () => {
  assert.equal(POURQUOI_MAX, 160);
  assert.equal(ROLE_MAX, 100);
  assert.equal(CAPTURE_PEREMPTION_JOURS, 183);
});

test('le vocabulaire interdit couvre le registre technique', () => {
  for (const mot of ['terminal', 'ligne de commande', 'shell', 'cli', 'git status', 'git log', 'npm run']) {
    assert.ok(VOCABULAIRE_INTERDIT.includes(mot), `${mot} doit être interdit`);
  }
});

test('le motif kebab accepte les identifiants d\'ancre et rejette le reste', () => {
  assert.ok(KEBAB_PATTERN.test('creer-le-dossier'));
  assert.ok(KEBAB_PATTERN.test('etape1'));
  assert.equal(KEBAB_PATTERN.test('Creer-Le-Dossier'), false);
  assert.equal(KEBAB_PATTERN.test('creer_le_dossier'), false);
  assert.equal(KEBAB_PATTERN.test('creer--le-dossier'), false);
});
