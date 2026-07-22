import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  EXPECTED_IMPORTED_BRICK_IDS,
  hasVisibleEditorialContent,
  loadBrickDocuments,
} from '../src/content/brick-files';
import { validateBrickDocuments } from '../src/content/brick-model';

const contentDirectory = fileURLToPath(
  new URL('../src/content/briques', import.meta.url),
);

const DRAFTED_BRICK_IDS = [
  'a1',
  'a2',
  'a3',
  'a4',
  'b0',
  'b1',
  'b2',
  'b3',
  'b4',
  'b4-bis',
  'c1',
  'c2',
  'c3',
  'd1',
  'd2',
  'd2-bis',
  'd3',
  'd4',
  'e1',
  'e2',
  'e3',
] as const;

const DRAFTED_BRICK_OWNERS = new Set(['paul', 'matthieu', 'a-attribuer']);

test('charge exactement les 23 briques fusionnées dans le bon ordre', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const ids = documents
    .toSorted((left, right) => Number(left.data.order) - Number(right.data.order))
    .map((document) => document.data.id);

  assert.equal(documents.length, 23);
  assert.deepEqual(ids, EXPECTED_IMPORTED_BRICK_IDS);
});

test('tous les squelettes importés respectent leur structure', async () => {
  const documents = await loadBrickDocuments(contentDirectory);

  assert.deepEqual(validateBrickDocuments(documents), []);
});

test('les briques rédigées sont complètes et prêtes à relire', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const drafted = documents.filter((document) =>
    DRAFTED_BRICK_IDS.includes(
      document.data.id as (typeof DRAFTED_BRICK_IDS)[number],
    ),
  );

  assert.equal(drafted.length, DRAFTED_BRICK_IDS.length);
  for (const document of drafted) {
    assert.equal(document.data.status, 'a-relire', document.data.id);
    assert.ok(DRAFTED_BRICK_OWNERS.has(document.data.owner), document.data.id);
    assert.ok(document.data.learningObjective, document.data.id);
    assert.ok(document.data.expectedOutcome, document.data.id);
    assert.equal(hasVisibleEditorialContent(document.body), true, document.data.id);
    assert.doesNotMatch(document.body, /\{\/\*[\s\S]*?\*\/\}/, document.data.id);
  }
});

test('aucune brique du socle ni le socle atelier ne dépend de B4 ou B4-bis', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const optionalIds = new Set(['b4', 'b4-bis']);
  const requiredWithOptionalPrerequisite = documents
    .filter((document) => document.data.priority === 'socle')
    .filter((document) => document.data.prerequisites.some((id) => optionalIds.has(id)))
    .map((document) => document.data.id);

  assert.deepEqual(requiredWithOptionalPrerequisite, []);

  const p1 = await readFile(
    new URL('../src/content/atelier/p1-naissance.mdx', import.meta.url),
    'utf8',
  );
  const p1Frontmatter = p1.split('---')[1] ?? '';
  assert.doesNotMatch(p1Frontmatter, /^\s+- b4-bis\s*$/m);
});

test('la mission A2 propose quatre paires dans l’ordre Code, Chat, Work, Object', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const a2 = documents.find((document) => document.data.id === 'a2');
  assert.ok(a2);

  const mission = a2.body.match(/## Mission commune([\s\S]*?)## Livrable/)?.[1];
  assert.ok(mission);

  const pairChoices = mission
    .split('\n')
    .filter((line) => line.startsWith('- **'));
  assert.deepEqual(pairChoices, [
    '- **Réponse :** Claude Chat / ChatGPT Chat',
    '- **Objet :** Claude Artifacts / ChatGPT Canvas',
    '- **Livrable :** Claude Cowork / ChatGPT Work',
    '- **Projet :** Claude Code / Codex',
  ]);

  const scenarios = mission
    .split('\n')
    .filter((line) => /^\d+\./.test(line));
  assert.deepEqual(scenarios, [
    '1. Le dépôt local du site est ouvert dans votre agent de code avec ses consignes. Corrigez le formulaire mobile, lancez les tests et présentez le diff.',
    '2. Un email client est déjà fourni dans la conversation. Proposez une réponse de cinq lignes sans créer ni modifier de fichier.',
    "3. Votre espace de travail contient douze entretiens clients. Analysez-les et livrez une synthèse ainsi qu'un tableau de priorités.",
    '4. Créez un calculateur interactif de budget formation, testez-le puis partagez son aperçu, sans modifier de projet existant.',
  ]);
  assert.match(mission, /une seule paire prioritaire/);
  assert.doesNotMatch(mission, /parmi Claude Chat, ChatGPT Chat/);
});

test('les briques restantes demeurent des gabarits à rédiger', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const remaining = documents.filter(
    (document) =>
      !DRAFTED_BRICK_IDS.includes(
        document.data.id as (typeof DRAFTED_BRICK_IDS)[number],
      ),
  );

  assert.equal(remaining.length, 2);
  assert.equal(
    remaining.some((document) => hasVisibleEditorialContent(document.body)),
    false,
  );
});

test('considère les commentaires MDX comme des indications éditoriales invisibles', () => {
  const body = '## Cap\n\n{/* Indication réservée aux auteurs. */}';

  assert.equal(hasVisibleEditorialContent(body), false);
});
