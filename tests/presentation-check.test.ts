import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { loadBrickDocuments } from '../src/content/brick-files';
import { PRESENTATION_DECKS } from '../src/presentation/manifests';
import type {
  PresentationDeck,
  PresentationLink,
} from '../src/presentation/presentation-model';
import { checkPresentation } from '../scripts/check-presentation';

const contentDirectory = fileURLToPath(
  new URL('../src/content/briques', import.meta.url),
);

function deckWithWikiLink(link: PresentationLink): PresentationDeck[] {
  const sourceDeck = PRESENTATION_DECKS[0];
  const sourceSlide = sourceDeck.slides[0];

  return [{
    ...sourceDeck,
    slides: [{ ...sourceSlide, links: [link] }],
  }];
}

function wikiLink(href: string): PresentationLink {
  return {
    kind: 'wiki',
    label: 'Ressource',
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
  };
}

test('contrôle les 76 slides et leurs cibles wiki sans accès réseau', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const result = await checkPresentation(PRESENTATION_DECKS, documents);

  assert.equal(result.slideCount, 76);
  assert.deepEqual(result.issues, []);
});

test('accepte une page de brique wiki sans ancre', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const result = await checkPresentation(
    deckWithWikiLink(wikiLink('https://formation-ia-ruby.vercel.app/briques/a1/')),
    documents,
  );

  assert.deepEqual(result.issues, []);
});

test('signale une brique wiki inconnue avec la slide et la cible', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const result = await checkPresentation(
    deckWithWikiLink(wikiLink('https://formation-ia-ruby.vercel.app/briques/z9/')),
    documents,
  );

  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0], /a1-opening/);
  assert.match(result.issues[0], /brique wiki inconnue/i);
  assert.match(result.issues[0], /z9/);
});

test('signale un manifeste rattaché à une brique source inconnue', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const sourceDeck = PRESENTATION_DECKS[0];
  const result = await checkPresentation(
    [{
      ...sourceDeck,
      brickId: 'f9',
      family: 'f',
      slides: [{ ...sourceDeck.slides[0], id: 'f9-opening', links: [] }],
    }],
    documents,
  );

  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0], /manifeste f9/i);
  assert.match(result.issues[0], /brique source inconnue/i);
});

test('utilise les ancres produites par le moteur Markdown du site, doublons compris', async () => {
  const documents = [{
    filePath: 'fixture.mdx',
    data: { id: 'a1' },
    body: '## Défis avancés\n\nPremier.\n\n## Défis avancés\n\nSecond.',
  }];
  const result = await checkPresentation(
    deckWithWikiLink(wikiLink(
      'https://formation-ia-ruby.vercel.app/briques/a1/#d%C3%A9fis-avanc%C3%A9s-1',
    )),
    documents,
  );

  assert.deepEqual(result.issues, []);
});

test('signale une ancre wiki absente avec une correction actionnable', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const result = await checkPresentation(
    deckWithWikiLink(wikiLink(
      'https://formation-ia-ruby.vercel.app/briques/a1/#concept-inexistant',
    )),
    documents,
  );

  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0], /ancre wiki inconnue/i);
  assert.match(result.issues[0], /concept-inexistant/);
  assert.match(result.issues[0], /Ancres disponibles/i);
});

test('refuse un chemin canonique qui ne cible pas une fiche brique', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const result = await checkPresentation(
    deckWithWikiLink(wikiLink('https://formation-ia-ruby.vercel.app/programme/a1/')),
    documents,
  );

  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0], /chemin wiki invalide/i);
  assert.match(result.issues[0], /\/briques\/<id>\//);
});

test('signale proprement un identifiant wiki mal encodé', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const result = await checkPresentation(
    deckWithWikiLink(wikiLink('https://formation-ia-ruby.vercel.app/briques/%E0/')),
    documents,
  );

  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0], /identifiant wiki mal encodé/i);
});
