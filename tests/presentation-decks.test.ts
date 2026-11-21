import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import test from 'node:test';

import { EXPECTED_IMPORTED_BRICK_IDS } from '../src/content/brick-files';
import { PRESENTATION_DECKS, PRESENTATION_SLIDES } from '../src/presentation/manifests';
import { MAX_BULLETS } from '../src/presentation/presentation-model';

const visuals = new Set(
  readdirSync(new URL('../src/components/briques', import.meta.url))
    .filter((file) => file.endsWith('.astro'))
    .map((file) => file.replace('.astro', '')),
);

test('chaque brique a son deck, et chaque deck sa brique', () => {
  assert.deepEqual(
    PRESENTATION_DECKS.map((deck) => deck.brickId).toSorted(),
    [...EXPECTED_IMPORTED_BRICK_IDS].toSorted(),
  );
});

test('une slide reste légère : titre court, trois points au plus', () => {
  for (const slide of PRESENTATION_SLIDES) {
    assert.ok(slide.claim.length <= 60, `${slide.id} : titre de ${slide.claim.length} caractères`);
    assert.ok((slide.bullets?.length ?? 0) <= MAX_BULLETS, `${slide.id} : trop de points`);
    for (const bullet of slide.bullets ?? []) {
      assert.ok(bullet.length <= 45, `${slide.id} : point trop long (« ${bullet} »)`);
    }
    assert.ok(!JSON.stringify(slide).includes(String.fromCharCode(0x2014)), `${slide.id} : tiret cadratin`);
  }
});

test('chaque visuel de slide existe dans les briques', () => {
  for (const slide of PRESENTATION_SLIDES) {
    if (slide.visual.key !== 'visual') continue;
    assert.ok(visuals.has(String(slide.visual.data.name)), `${slide.id} : visuel inconnu ${String(slide.visual.data.name)}`);
  }
});

test('les jeux sont jouables : une seule bonne réponse, deux cases', () => {
  for (const slide of PRESENTATION_SLIDES) {
    const data = slide.visual.data as {
      options?: { correct?: boolean; why?: string }[];
      buckets?: string[];
      items?: { bucket: number; why?: string }[];
      steps?: string[];
    };
    if (slide.visual.key === 'quiz') {
      assert.ok(data.options && data.options.length >= 2 && data.options.length <= 4, slide.id);
      assert.equal(data.options.filter((option) => option.correct).length, 1, `${slide.id} : une seule bonne réponse`);
      assert.ok(data.options.every((option) => option.why), `${slide.id} : chaque réponse s'explique`);
    }
    if (slide.visual.key === 'sort') {
      assert.equal(data.buckets?.length, 2, slide.id);
      assert.ok(data.items && data.items.length >= 4, slide.id);
      assert.ok(data.items.every((item) => item.bucket === 0 || item.bucket === 1), slide.id);
      assert.ok(new Set(data.items.map((item) => item.bucket)).size === 2, `${slide.id} : les deux cases servent`);
    }
    if (slide.visual.key === 'demo') {
      assert.ok(data.steps && data.steps.length >= 2 && data.steps.length <= 4, slide.id);
    }
  }
});

test('chaque deck ouvre sur son titre, et la présentation joue au moins un jeu par famille', () => {
  for (const deck of PRESENTATION_DECKS) {
    assert.equal(deck.slides[0].visual.key, 'cover', `${deck.brickId} : première slide`);
  }
  const families = new Set(PRESENTATION_DECKS.map((deck) => deck.family));
  for (const family of families) {
    const games = PRESENTATION_SLIDES.filter(
      (slide) => slide.family === family && (slide.visual.key === 'quiz' || slide.visual.key === 'sort'),
    );
    assert.ok(games.length >= 1, `famille ${family} : aucun jeu`);
  }
});
