import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { VOCABULAIRE_INTERDIT } from '../src/parcours/parcours-model';

/**
 * `scripts/qa-demarrer.mjs` tourne sous node nu : il ne peut pas importer le
 * module TypeScript du modèle et recopie donc la liste des mots interdits.
 * Ce script est pourtant le seul contrôle qui voie les libellés codés en dur
 * des composants. Une divergence silencieuse entre les deux listes ouvrirait
 * un trou dans le seul filet qui les couvre : elle échoue ici.
 */
test('la liste du contrôle sans JavaScript est celle du modèle', () => {
  const source = readFileSync(new URL('../scripts/qa-demarrer.mjs', import.meta.url), 'utf8');
  const bloc = source.match(/const VOCABULAIRE_INTERDIT = \[([^\]]*)\]/);
  assert.ok(bloc, 'tableau VOCABULAIRE_INTERDIT introuvable dans scripts/qa-demarrer.mjs');

  const mots = bloc[1]
    .split(',')
    .map((entree) => entree.trim())
    .filter((entree) => entree.length > 0)
    .map((entree) => entree.replace(/^'|'$/g, ''));

  assert.deepEqual(mots, [...VOCABULAIRE_INTERDIT]);
});
