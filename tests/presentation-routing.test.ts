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

test('la séquence relie la première slide à la deuxième', () => {
  const neighbors = getSlideNeighbors(PRESENTATION_SLIDES, 'a1-opening');
  assert.equal(neighbors.previous, null);
  assert.equal(neighbors.next?.id, 'a1-token-loop');
});

test('le contrôleur ignore les raccourcis lorsque le focus est dans un contrôle', async () => {
  const source = await readFile(
    new URL('../src/scripts/presentation-controller.ts', import.meta.url),
    'utf8',
  );
  assert.match(source, /a, button, input, textarea, select/);
  assert.match(source, /closest\(interactiveSelector\)/);
  assert.match(source, /requestFullscreen/);
  assert.match(source, /showModal/);
});
