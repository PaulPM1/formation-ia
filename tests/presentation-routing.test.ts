import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { PRESENTATION_SLIDES } from '../src/presentation/manifests';
import { getSlideNeighbors } from '../src/presentation/presentation-validation';

test('chaque slide possède une route unique', () => {
  const routes = PRESENTATION_SLIDES.map((slide) => slide.route);
  assert.equal(new Set(routes).size, routes.length);
  assert.ok(routes.every((route) => route.startsWith('/presenter/')));
});

test('la séquence suit la matinée : préparation, puis A à E, sans trou', () => {
  const first = PRESENTATION_SLIDES[0];
  assert.equal(first.brickId, 'd2-bis');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, first.id).previous, null);

  const last = PRESENTATION_SLIDES.at(-1)!;
  assert.equal(last.brickId, 'e3');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, last.id).next, null);

  for (const [index, slide] of PRESENTATION_SLIDES.entries()) {
    const { next } = getSlideNeighbors(PRESENTATION_SLIDES, slide.id);
    assert.equal(next?.id, PRESENTATION_SLIDES[index + 1]?.id, slide.id);
  }
});

test('le contrôleur ignore les raccourcis lorsque le focus est dans un contrôle', async () => {
  const source = await readFile(
    new URL('../src/scripts/presentation-controller.ts', import.meta.url),
    'utf8',
  );
  assert.match(source, /a, button, input, textarea, select, summary/);
  assert.match(source, /closest\(interactiveSelector\)/);
  assert.match(source, /requestFullscreen/);
  assert.match(source, /showModal/);
  assert.match(source, /fullscreenchange/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /catch/);
});

test('le shell expose un état plein écran initial et une zone d’annonce', async () => {
  const source = await readFile(
    new URL('../src/components/presentation/PresenterShell.astro', import.meta.url),
    'utf8',
  );
  assert.match(source, /data-presenter-fullscreen[^>]*aria-pressed="false"/s);
  assert.match(source, /data-presenter-announcer/);
});
