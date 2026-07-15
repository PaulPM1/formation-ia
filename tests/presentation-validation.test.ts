import assert from 'node:assert/strict';
import test from 'node:test';

import { wikiLink } from '../src/presentation/presentation-links';
import {
  flattenSlides,
  getSlideNeighbors,
  validatePresentation,
} from '../src/presentation/presentation-validation';
import type { PresentationDeck } from '../src/presentation/presentation-model';

const deck: PresentationDeck = {
  brickId: 'a1',
  family: 'a',
  title: "C'est quoi un LLM",
  slides: [
    {
      id: 'a1-opening',
      role: 'opening',
      claim: 'Une réponse fluide n’est pas une preuve.',
      visual: { key: 'token-predictor', data: {} },
      links: [wikiLink('a1', 'concept-durable', 'Approfondir')],
      speaker: { durationMinutes: 2, notes: 'Faire observer.', transition: 'Montrer le contexte.' },
      accessibleDescription: 'Le contexte alimente une prédiction token par token.',
    },
  ],
};

test('valide un deck complet', () => {
  assert.deepEqual(validatePresentation([deck]), []);
});

test('rejette les identifiants de slides dupliqués', () => {
  const duplicate = { ...deck, brickId: 'a2', slides: deck.slides };
  assert.ok(validatePresentation([deck, duplicate]).some((issue) => issue.includes('dupliqué')));
});

test('construit uniquement des liens wiki canoniques', () => {
  assert.equal(
    wikiLink('c2', 'ressources', 'Voir les ressources').href,
    'https://formation-ia-ruby.vercel.app/briques/c2/#ressources',
  );
});

test('rejette les domaines qui imitent le wiki canonique', () => {
  const lookalike = {
    ...deck,
    slides: deck.slides.map((slide) => ({
      ...slide,
      links: [{
        kind: 'wiki' as const,
        label: 'Wiki ressemblant',
        href: 'https://formation-ia-ruby.vercel.app.evil.example/briques/a1/',
      }],
    })),
  };

  const issue = validatePresentation([lookalike]).find((candidate) =>
    candidate.includes('non canonique'));

  assert.ok(issue);
  assert.match(issue, /formation-ia-ruby\.vercel\.app\.evil\.example/);
  assert.match(issue, /attendue.*formation-ia-ruby\.vercel\.app/i);
});

test('aplatit la séquence et calcule ses voisins', () => {
  const slides = flattenSlides([deck]);
  assert.equal(slides[0].route, '/presenter/a1/a1-opening/');
  assert.deepEqual(getSlideNeighbors(slides, 'a1-opening'), {
    previous: null,
    next: null,
  });
});
