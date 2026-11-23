import assert from 'node:assert/strict';
import test from 'node:test';

import { loadBrickDocuments } from '../src/content/brick-files';
import { GUIDES } from '../src/parcours/manifests';
import { VOCABULAIRE_INTERDIT } from '../src/parcours/parcours-model';
import { QUESTIONS, REPONSE_MAX } from '../src/parcours/questions';

const entrees = QUESTIONS.flatMap((groupe) => groupe.questions);

test('chaque réponse reste courte, sans jargon ni tiret cadratin', () => {
  for (const entree of entrees) {
    const texte = `${entree.question} ${entree.reponse} ${entree.aClaude ?? ''}`;
    assert.ok(entree.reponse.length <= REPONSE_MAX, `Réponse trop longue : ${entree.question}`);
    assert.ok(!texte.includes('\u2014'), `Tiret cadratin : ${entree.question}`);
    for (const mot of VOCABULAIRE_INTERDIT) {
      assert.doesNotMatch(texte, new RegExp(`(^|[^\\p{L}])${mot}($|[^\\p{L}])`, 'iu'), `${mot} : ${entree.question}`);
    }
  }
});

test('les liens des réponses mènent à une brique ou à un guide qui existe', async () => {
  const briques = await loadBrickDocuments(new URL('../src/content/briques', import.meta.url).pathname);
  const cibles = new Set([
    ...briques.map((brique) => `/briques/${brique.data.id}/`),
    ...GUIDES.map((guide) => `/faq/${guide.id}/`),
  ]);
  for (const entree of entrees) {
    if (entree.lien) assert.ok(cibles.has(entree.lien.href), `Lien cassé : ${entree.lien.href}`);
  }
});

test('cinq thèmes au plus, sans question en double', () => {
  assert.ok(QUESTIONS.length <= 5);
  assert.equal(new Set(entrees.map((entree) => entree.question)).size, entrees.length);
});
