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
  assert.equal(neighbors.next?.id, 'a1-context');
});

test('la fusion A2 rejoint directement A3 et ne conserve aucune route A5', () => {
  const neighbors = getSlideNeighbors(PRESENTATION_SLIDES, 'a2-prioritize');
  const obsoletePrefix = ['a', '5-'].join('');
  assert.equal(neighbors.next?.id, 'a3-model-fit');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'a3-access').next?.id, 'a4-convincing');
  assert.ok(PRESENTATION_SLIDES.every((slide) => !slide.id.startsWith(obsoletePrefix)));
});

test('relie le socle et le rattrapage', () => {
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b3-check').next?.id, 'b4-context');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4-context').previous?.id, 'b3-check');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4-context').next?.id, 'b4-ipmtr');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4-test').next?.id, 'c1-repeat');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'c1-repeat').previous?.id, 'b4-test');
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4bis-install').previous, null);
  assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4bis-checkpoint').next, null);
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

test('la QA navigateur durable couvre navigation native, 404, plein écran et les 110 mobiles', async () => {
  const source = await readFile(
    new URL('../scripts/qa-presenter.mjs', import.meta.url),
    'utf8',
  );
  assert.match(source, /PRESENTATION_SLIDES/);
  assert.match(source, /width:\s*390,\s*height:\s*844/);
  assert.match(source, /a4-risk/);
  assert.match(source, /summary/);
  assert.match(source, /keyboard\.press\('Space'\)/);
  assert.match(source, /keyboard\.press\('Enter'\)/);
  assert.match(source, /unknown-slide/);
  assert.match(source, /generic-unknown/);
  assert.match(source, /javaScriptEnabled:\s*false/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /fullscreenchange/);
  assert.match(source, /b3-check/);
  assert.match(source, /c1-repeat/);
  assert.match(source, /track-label/);
  assert.match(source, /Rattrapage/);
  assert.match(source, /removedBlockBRoutes/);
  assert.match(source, /slideRoutes\.length[^\n]*110|110[^\n]*slideRoutes\.length/);
});
