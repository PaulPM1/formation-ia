import assert from 'node:assert/strict';
import test from 'node:test';

import {
  brickFrontmatterSchema,
  validateBrickDocuments,
  type BrickDocumentInput,
} from '../src/content/brick-model';

const conceptBody = `
## Cap
<!-- À rédiger. -->
## Concept durable
<!-- À rédiger. -->
## Pratique avec Claude
<!-- À rédiger. -->
## Mission commune
<!-- À rédiger. -->
## Livrable
<!-- À rédiger. -->
## Notes formateur
<!-- À rédiger. -->
## Défis avancés
<!-- À rédiger. -->
## Variantes
<!-- À rédiger. -->
## Dépannage
<!-- À rédiger. -->
## Ressources
<!-- À rédiger. -->
## Ouverture
<!-- À rédiger. -->
`;

function makeBrick(
  overrides: Partial<BrickDocumentInput['data']> = {},
  body = conceptBody,
): BrickDocumentInput {
  return {
    filePath: 'a-comprendre/a1-llm.mdx',
    data: {
      id: 'a1',
      title: "C'est quoi un LLM",
      family: 'a',
      order: 1,
      priority: 'socle',
      durationMinutes: 10,
      type: 'concept',
      platforms: ['commun'],
      prerequisites: [],
      status: 'a-rediger',
      owner: 'a-attribuer',
      learningObjective: null,
      expectedOutcome: null,
      ...overrides,
    },
    body,
  };
}

test('accepte une brique vide tant qu’elle reste à rédiger', () => {
  const result = brickFrontmatterSchema.safeParse(makeBrick().data);

  assert.equal(result.success, true);
  assert.deepEqual(validateBrickDocuments([makeBrick()]), []);
});

test('accepte Pratique guidée comme rubrique commune', () => {
  const guidedBody = conceptBody.replace(
    '## Pratique avec Claude',
    '## Pratique guidée',
  );

  assert.deepEqual(validateBrickDocuments([makeBrick({}, guidedBody)]), []);
});

test('rejette une brique sans aucune rubrique de pratique', () => {
  const withoutPractice = conceptBody.replace(
    '## Pratique avec Claude',
    '## Démonstration libre',
  );

  const issues = validateBrickDocuments([makeBrick({}, withoutPractice)]);

  assert.ok(issues.some((issue) => issue.message.includes('Pratique guidée')));
});

test('rejette une rubrique obligatoire absente', () => {
  const bodyWithoutCap = conceptBody.replace('## Cap', '## Introduction');

  const issues = validateBrickDocuments([makeBrick({}, bodyWithoutCap)]);

  assert.ok(issues.some((issue) => issue.message.includes('Cap')));
});

test('rejette deux identifiants identiques', () => {
  const issues = validateBrickDocuments([
    makeBrick(),
    {
      ...makeBrick({ order: 2 }),
      filePath: 'a-comprendre/a1-copie.mdx',
    },
  ]);

  assert.ok(issues.some((issue) => issue.message.includes('dupliqué')));
});

test('exige un objectif et un résultat à partir de la relecture', () => {
  const issues = validateBrickDocuments([makeBrick({ status: 'a-relire' })]);

  assert.ok(issues.some((issue) => issue.message.includes('learningObjective')));
  assert.ok(issues.some((issue) => issue.message.includes('expectedOutcome')));
});

test('valide les rubriques propres à chaque type', () => {
  const setup = makeBrick(
    { id: 'd2-bis', family: 'd', type: 'setup' },
    `${conceptBody}\n## Diagnostic initial\n<!-- À rédiger. -->`,
  );

  const issues = validateBrickDocuments([setup]);

  assert.ok(issues.some((issue) => issue.message.includes('Test final')));
  assert.ok(issues.some((issue) => issue.message.includes('Dépannage Mac')));
  assert.ok(issues.some((issue) => issue.message.includes('Dépannage Windows')));
});

test('rejette un trou dans l’ordre pédagogique', () => {
  const issues = validateBrickDocuments([
    makeBrick(),
    {
      ...makeBrick({ id: 'a2', order: 3 }),
      filePath: 'a-comprendre/a2-agent.mdx',
    },
  ]);

  assert.ok(issues.some((issue) => issue.message.includes('Ordre attendu 2')));
});
