import assert from 'node:assert/strict';
import test from 'node:test';

import { externalLink, wikiLink } from '../src/presentation/presentation-links';
import {
  flattenSlides,
  getSlideNeighbors,
  validatePresentation,
} from '../src/presentation/presentation-validation';
import type { PresentationDeck } from '../src/presentation/presentation-model';

const deck: PresentationDeck = {
  brickId: 'a1',
  family: 'a',
  order: 1,
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

const invalidDeck = (change: Record<string, unknown>): PresentationDeck => ({
  ...deck,
  ...change,
} as PresentationDeck);

const invalidSlide = (change: Record<string, unknown>): PresentationDeck => ({
  ...deck,
  slides: [{ ...deck.slides[0], ...change } as PresentationDeck['slides'][number]],
});

test('valide un deck complet', () => {
  assert.deepEqual(validatePresentation([deck]), []);
});

test('rejette les identifiants de slides dupliqués', () => {
  const duplicate = { ...deck, brickId: 'a2', family: 'a' as const, order: 2, slides: deck.slides };
  assert.ok(validatePresentation([deck, duplicate]).some((issue) => issue.includes('dupliqué')));
});

test('rejette les familles, identifiants et ordres incohérents à l’exécution', () => {
  assert.ok(validatePresentation([invalidDeck({ family: 'z' })]).some((issue) => issue.includes('Famille invalide')));
  assert.ok(validatePresentation([invalidDeck({ brickId: '' })]).some((issue) => issue.includes('Identifiant de brique invalide')));
  assert.ok(validatePresentation([invalidDeck({ brickId: 'b1', family: 'a' })]).some((issue) => issue.includes('Famille incohérente')));
  assert.ok(validatePresentation([invalidDeck({ order: 0 })]).some((issue) => issue.includes('Ordre invalide')));
  assert.ok(validatePresentation([deck, { ...deck, brickId: 'a2', order: 1 }]).some((issue) => issue.includes('Ordre de brique dupliqué')));
});

test('rejette un trou dans la séquence des decks avec la position attendue', () => {
  const second = { ...deck, brickId: 'a2', order: 99, slides: [{ ...deck.slides[0], id: 'a2-opening' }] };
  const third = { ...deck, brickId: 'a3', order: 3, slides: [{ ...deck.slides[0], id: 'a3-opening' }] };
  const issues = validatePresentation([deck, second, third]);
  assert.ok(issues.some((issue) => issue.includes('a2') && issue.includes('position 2') && issue.includes('99')));
});

test('rejette des decks valides fournis dans l’ordre inverse', () => {
  const first = { ...deck, order: 2 };
  const second = { ...deck, brickId: 'a2', order: 1, slides: [{ ...deck.slides[0], id: 'a2-opening' }] };
  const issues = validatePresentation([first, second]);
  assert.ok(issues.some((issue) => issue.includes('a1') && issue.includes('position 1') && issue.includes('2')));
  assert.ok(issues.some((issue) => issue.includes('a2') && issue.includes('position 2') && issue.includes('1')));
});

test('rejette une slide dont l’identité, le rôle ou le contrat visuel sont invalides', () => {
  assert.ok(validatePresentation([invalidSlide({ id: 'b1-opening' })]).some((issue) => issue.includes('n’appartient pas')));
  assert.ok(validatePresentation([invalidSlide({ role: 'quiz' })]).some((issue) => issue.includes('Rôle invalide')));
  assert.ok(validatePresentation([invalidSlide({ visual: { key: 'token-predictor', data: null } })]).some((issue) => issue.includes('Données visuelles invalides')));
  assert.ok(validatePresentation([invalidSlide({ visual: { key: '', data: {} } })]).some((issue) => issue.includes('Visuel inconnu')));
});

test('rejette les notes formateur et les liens incomplets', () => {
  assert.ok(validatePresentation([invalidSlide({ speaker: { durationMinutes: 0, notes: 'Note', transition: 'Suite' } })]).some((issue) => issue.includes('Durée formateur invalide')));
  assert.ok(validatePresentation([invalidSlide({ speaker: { durationMinutes: 1, notes: ' ', transition: 'Suite' } })]).some((issue) => issue.includes('Notes formateur vides')));
  assert.ok(validatePresentation([invalidSlide({ speaker: { durationMinutes: 1, notes: 'Note', transition: ' ' } })]).some((issue) => issue.includes('Transition formateur vide')));
  assert.ok(validatePresentation([invalidSlide({ links: [{ ...wikiLink('a1', 'concept-durable', 'Approfondir'), label: ' ' }] })]).some((issue) => issue.includes('Libellé de lien vide')));
  assert.ok(validatePresentation([invalidSlide({ links: [{ ...wikiLink('a1', 'concept-durable', 'Approfondir'), target: '_self' }] })]).some((issue) => issue.includes('Cible de lien invalide')));
  assert.ok(validatePresentation([invalidSlide({ links: [{ ...wikiLink('a1', 'concept-durable', 'Approfondir'), rel: 'noopener' }] })]).some((issue) => issue.includes('Relation de lien invalide')));
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

test('accepte les deux hôtes Google officiels utilisés par A3', () => {
  const googleSources = invalidSlide({
    links: [
      externalLink('official', 'Tarification Gemini API', 'https://ai.google.dev/gemini-api/docs/pricing'),
      externalLink('official', 'Forfaits Google AI', 'https://one.google.com/intl/fr_fr/about/google-ai-plans/'),
    ],
  });

  assert.deepEqual(validatePresentation([googleSources]), []);
});

test('aplatit la séquence et calcule ses voisins', () => {
  const slides = flattenSlides([deck]);
  assert.equal(slides[0].route, '/presenter/a1/a1-opening/');
  assert.deepEqual(getSlideNeighbors(slides, 'a1-opening'), {
    previous: null,
    next: null,
  });
});
