import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { loadBrickDocuments } from '../src/content/brick-files';
import { PRESENTATION_DECKS, PRESENTATION_SLIDES } from '../src/presentation/manifests';
import { getSlideNeighbors } from '../src/presentation/presentation-validation';

const expectedRoutes = [
  'b0-layers', 'b0-test',
  'b1-vague', 'b1-four-blocks', 'b1-mission', 'b1-loop',
  'b2-object', 'b2-mvp', 'b2-mission', 'b2-correction',
  'b3-delegation', 'b3-pacte', 'b3-mission', 'b3-check',
  'b4-context', 'b4-ipmtr', 'b4-mission', 'b4-test',
  'b4bis-install', 'b4bis-workspace', 'b4bis-checkpoint',
];

const removedRoutes = [
  'b0-diagnostic', 'b0-fallback', 'b0-ready', 'b1-builder',
  'b2-anatomy', 'b2-tests', 'b3-permissions', 'b3-observe',
  'b4-permission', 'b4-transition', 'b4bis-triptych', 'b4bis-path',
];

const durationByDeck = {
  b0: 5,
  b1: 12,
  b2: 18,
  b3: 20,
  b4: 20,
  'b4-bis': 10,
};

const blockB = PRESENTATION_DECKS.filter((deck) => deck.family === 'b');
const blockBSlides = blockB.flatMap((deck) => deck.slides);

test('verrouille les 21 routes B et les 110 slides de la présentation', () => {
  assert.deepEqual(blockBSlides.map((slide) => slide.id), expectedRoutes);
  assert.equal(blockBSlides.length, 21);
  assert.equal(PRESENTATION_SLIDES.length, 110);
  assert.ok(removedRoutes.every((id) => !PRESENTATION_SLIDES.some((slide) => slide.id === id)));
});

test('verrouille 75 minutes de socle, aucune minute facultative et 10 de rattrapage', () => {
  for (const deck of blockB) {
    const duration = deck.slides.reduce(
      (sum, slide) => sum + slide.speaker.durationMinutes,
      0,
    );
    assert.equal(duration, durationByDeck[deck.brickId as keyof typeof durationByDeck]);
  }

  const coreBlockBMinutes = PRESENTATION_SLIDES
    .filter((slide) => slide.family === 'b' && slide.track === 'core')
    .reduce((sum, slide) => sum + slide.speaker.durationMinutes, 0);
  const optionalBlockBMinutes = PRESENTATION_SLIDES
    .filter((slide) => slide.family === 'b' && slide.track === 'optional')
    .reduce((sum, slide) => sum + slide.speaker.durationMinutes, 0);
  const recoveryBlockBMinutes = PRESENTATION_SLIDES
    .filter((slide) => slide.family === 'b' && slide.track === 'recovery')
    .reduce((sum, slide) => sum + slide.speaker.durationMinutes, 0);

  assert.equal(coreBlockBMinutes, 75);
  assert.equal(optionalBlockBMinutes, 0);
  assert.equal(recoveryBlockBMinutes, 10);
});

test('sépare le parcours principal et le rattrapage', () => {
  assert.deepEqual(
    blockB.map((deck) => [deck.brickId, deck.track ?? 'core']),
    [
      ['b0', 'core'], ['b1', 'core'], ['b2', 'core'], ['b3', 'core'],
      ['b4', 'core'], ['b4-bis', 'recovery'],
    ],
  );

  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b3-check').next?.id, 'b4-context');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4-context').previous?.id, 'b3-check');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4-test').next?.id, 'c1-repeat');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'c1-repeat').previous?.id, 'b4-test');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4bis-install').previous, null);
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4bis-checkpoint').next, null);
});

test('partage le même cas concret et ses garanties entre les quatre outils', () => {
  const byId = (id: string) => {
    const item = blockBSlides.find((slide) => slide.id === id);
    assert.ok(item, id);
    return item.visual.data;
  };

  const chat = byId('b1-mission');
  assert.equal(chat.instructionAnchor, 'pratique-guidee');
  assert.deepEqual(chat.surfaces, ['Claude Chat', 'ChatGPT Chat']);
  assert.deepEqual(chat.sections, ['Actions du jour', 'À confirmer', 'Plus tard']);
  assert.equal(chat.sourceRule, 'Une source par action');
  assert.match(String(chat.uncertaintyRule), /[ÀA] confirmer/);

  const artifact = byId('b2-mission');
  assert.equal(artifact.instructionAnchor, 'pratique-guidee');
  assert.deepEqual(artifact.surfaces, ['Claude Artifacts', 'ChatGPT Canvas']);
  assert.deepEqual(artifact.categories, ['Aujourd’hui', 'Plus tard', 'Archiver']);
  assert.deepEqual(artifact.requiredControls, ['Compteurs', 'Remise à zéro']);
  assert.equal(artifact.state, 'Six notes chargées dans Aujourd’hui');

  const cowork = byId('b3-mission');
  assert.equal(cowork.instructionAnchor, 'pratique-guidee');
  assert.deepEqual(cowork.surfaces, ['Claude Cowork', 'ChatGPT Work']);
  assert.equal(cowork.readScope, 'mission-agent/sources/');
  assert.equal(cowork.writeScope, 'mission-agent/sortie/');
  assert.equal(cowork.planApproval, true);
  assert.equal(cowork.keepOriginals, true);
  assert.match(String(cowork.conflictRule), /[ÀA] confirmer/);

  const code = byId('b4-mission');
  assert.equal(code.instructionAnchor, 'pratique-guidee');
  assert.deepEqual(code.surfaces, ['Claude Code', 'Codex']);
  assert.equal(code.onlyChange, 'Ajouter la source sous chaque carte');
  assert.equal(code.preserveSort, true);
  assert.equal(code.testCommand, 'node --test');
  assert.equal(code.reviewSurface, 'Diff du projet');

  assert.doesNotMatch(JSON.stringify([chat, artifact, cowork, code]), /promptPath/);
});

test('les notes formateur donnent une coupure, la pratique guidée et un repli aux missions', () => {
  for (const slideId of ['b1-mission', 'b2-mission', 'b3-mission', 'b4-mission']) {
    const slide = blockBSlides.find((candidate) => candidate.id === slideId);
    assert.ok(slide, slideId);
    assert.match(slide.speaker.notes, /Couper à/);
    assert.match(slide.speaker.notes, /Pratique guidée/);
    assert.match(slide.speaker.notes, /Repli/);
  }
});

test('les slides B pointent vers la pratique guidée et les ressources OpenAI autorisées', () => {
  const wikiLinks = blockBSlides.flatMap((item) => item.links)
    .filter((link) => link.kind === 'wiki');
  assert.ok(wikiLinks.length > 0);
  assert.ok(wikiLinks.every((link) => link.href.endsWith('#pratique-guidee')));

  const officialHrefs = new Set(blockBSlides.flatMap((item) => item.links)
    .filter((link) => link.kind === 'official')
    .map((link) => link.href));
  for (const href of [
    'https://openai.com/chatgpt/overview/',
    'https://help.openai.com/en/articles/9930697-what-is-the-canvas-feature-in-chatgpt-and-how-do-i-use-it',
    'https://help.openai.com/en/articles/20001275/',
    'https://openai.com/codex/get-started/',
  ]) assert.ok(officialHrefs.has(href), href);
});

test('les six fiches B reprennent l’inventaire, les durées, les coupures et les replis', async () => {
  const contentDirectory = fileURLToPath(new URL('../src/content/briques', import.meta.url));
  const documents = (await loadBrickDocuments(contentDirectory))
    .filter((document) => document.data.family === 'b');

  assert.equal(documents.length, 6);
  for (const document of documents) {
    const id = document.data.id as keyof typeof durationByDeck;
    assert.equal(document.data.durationMinutes, durationByDeck[id], id);
    assert.match(document.body, /Couper/);
    assert.match(document.body, /Repli/);
  }

  const recovery = documents.find((document) => document.data.id === 'b4-bis');
  assert.equal(recovery?.data.priority, 'rattrapage');
  assert.match(recovery?.body ?? '', /piste s’arrête au checkpoint/);

  for (const brickId of ['b1', 'b2', 'b3', 'b4', 'b4-bis']) {
    const body = documents.find((document) => document.data.id === brickId)?.body ?? '';
    assert.doesNotMatch(body, /^## Pratique avec Claude$/m, brickId);
    assert.doesNotMatch(body, /conserve temporairement l’ancre/, brickId);
    assert.equal(body.match(/^## Pratique guidée$/gm)?.length, 1, brickId);
  }
});

test('B0 à B4 suivent le parcours miroir', async () => {
  const contentDirectory = fileURLToPath(new URL('../src/content/briques', import.meta.url));
  const documents = (await loadBrickDocuments(contentDirectory))
    .filter((document) => document.data.family === 'b');

  for (const brickId of ['b0', 'b1', 'b2', 'b3', 'b4']) {
    const document = documents.find((candidate) => candidate.data.id === brickId);
    assert.ok(document, brickId);
    assert.match(document.body, /data-block-b-panel="claude"/);
    assert.match(document.body, /data-block-b-panel="openai"/);
  }

  for (const brickId of ['b1', 'b2', 'b3', 'b4']) {
    const body = documents.find((candidate) => candidate.data.id === brickId)?.body ?? '';
    for (const heading of [
      'Situation',
      'Pourquoi cette surface',
      'Fichiers à fournir',
      'Prompt à envoyer',
      'Manipulation à effectuer',
      'Tester mon résultat',
      'Corriger un échec',
    ]) assert.match(body, new RegExp(`### ${heading}`), `${brickId} ${heading}`);
  }

  assert.equal(documents.find((item) => item.data.id === 'b0')?.data.title, 'Choisir sa voie');
  assert.equal(documents.find((item) => item.data.id === 'b1')?.data.title, 'Chat');
  assert.equal(documents.find((item) => item.data.id === 'b2')?.data.title, 'Objet interactif');

  const b3 = documents.find((item) => item.data.id === 'b3');
  assert.equal(b3?.data.title, 'Travail multiétape');
  assert.match(b3?.body ?? '', /Claude Cowork/);
  assert.match(b3?.body ?? '', /ChatGPT Work/);
  assert.match(b3?.body ?? '', /mission-agent\/sources/);
  assert.match(b3?.body ?? '', /brief-du-jour\.md/);

  const b4 = documents.find((item) => item.data.id === 'b4');
  assert.equal(b4?.data.title, 'Agent de code');
  assert.equal(b4?.data.priority, 'socle');
  assert.match(b4?.body ?? '', /Claude Code/);
  assert.match(b4?.body ?? '', /Codex/);
  assert.match(b4?.body ?? '', /mini-application/);
  assert.match(b4?.body ?? '', /## Checkpoint final/);
});
