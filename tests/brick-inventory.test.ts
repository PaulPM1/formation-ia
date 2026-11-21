import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  BRICK_COUNT,
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
  'b1',
  'b2',
  'c1',
  'c2',
  'c3',
  'c4',
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

test('charge exactement les 18 briques fusionnées dans le bon ordre', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const ids = documents
    .toSorted((left, right) => Number(left.data.order) - Number(right.data.order))
    .map((document) => document.data.id);

  assert.equal(documents.length, 18);
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

// Depuis le retrait du bloc F, le catalogue ne contient plus de gabarit :
// l'invariant utile n'est plus « combien en reste-t-il » mais « aucune fiche
// publiée n'est vide ». Une brique ajoutée sans contenu fait échouer ce test.
test('le catalogue ne contient plus aucun gabarit à rédiger', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const remaining = documents.filter(
    (document) =>
      !DRAFTED_BRICK_IDS.includes(
        document.data.id as (typeof DRAFTED_BRICK_IDS)[number],
      ),
  );

  assert.deepEqual(
    remaining.map((document) => document.data.id),
    [],
  );
  for (const document of documents) {
    assert.notEqual(document.data.status, 'a-rediger', document.data.id);
    assert.equal(
      hasVisibleEditorialContent(document.body),
      true,
      document.data.id,
    );
  }
});

test('considère les commentaires MDX comme des indications éditoriales invisibles', () => {
  const body = '## Cap\n\n{/* Indication réservée aux auteurs. */}';

  assert.equal(hasVisibleEditorialContent(body), false);
});

test('les totaux affichés viennent de BRICK_COUNT', async () => {
  assert.equal(BRICK_COUNT, EXPECTED_IMPORTED_BRICK_IDS.length);
  for (const file of [
    'src/layouts/BaseLayout.astro',
    'src/pages/index.astro',
    'src/pages/404.astro',
    'src/pages/briques/index.astro',
  ]) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(source, /BRICK_COUNT/, file);
    assert.doesNotMatch(source, /\b\d+ briques\b/, file);
    assert.doesNotMatch(source, /KIT \/ \d+/, file);
  }
});

test('une fiche au format court est jugée sur ses trois rubriques', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const b2 = documents.find((document) => document.data.id === 'b2');
  assert.ok(b2);
  assert.deepEqual(validateBrickDocuments(documents), []);

  const sansEssai = { ...b2, body: b2.body.replace('## À essayer', '## Autre') };
  const issues = validateBrickDocuments(
    documents.map((document) => (document === b2 ? sansEssai : document)),
  );
  assert.deepEqual(issues.map((issue) => issue.message), [
    'Rubrique obligatoire manquante : À essayer',
  ]);
});
