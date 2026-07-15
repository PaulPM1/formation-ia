import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { SLIDE_VISUAL_KEYS } from '../src/presentation/presentation-model';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('utilise un champ lumineux sans grille permanente', async () => {
  const css = await read('src/styles/presentation.css');
  assert.match(css, /radial-gradient/);
  assert.doesNotMatch(css, /background-size:\s*\d+px\s+\d+px/);
  assert.match(css, /prefers-reduced-motion/);
});

test('conserve un état compréhensible sans JavaScript', async () => {
  const mission = await read('src/components/presentation/scenes/MissionBoard.astro');
  assert.match(mission, /<ol|<dl/);
  assert.doesNotMatch(mission, /onclick=/);
});

test('nomme les liens par leur destination', async () => {
  const rail = await read('src/components/presentation/scenes/ResourceRail.astro');
  assert.match(rail, /target="_blank"/);
  assert.match(rail, /rel="[^"]*noreferrer/);
});

test('registre statiquement toutes les clés et refuse les inconnues', async () => {
  const registry = await read('src/components/presentation/VisualRegistry.astro');
  for (const key of SLIDE_VISUAL_KEYS) assert.match(registry, new RegExp(`['"]?${key}['"]?\\s*:`));
  assert.doesNotMatch(registry, /import\s*\(/);
  assert.match(registry, /throw new Error/);
  assert.match(registry, /ResourceRail/);
});

test('le shell délègue le visuel et les ressources aux scènes', async () => {
  const shell = await read('src/components/presentation/PresenterShell.astro');
  assert.match(shell, /<VisualRegistry slide=\{slide\}/);
  assert.match(shell, /<ResourceRail links=\{slide\.links\}/);
  assert.doesNotMatch(shell, /<figure class="presentation-visual"/);
});

test('la sortie imprimée laisse les scènes denses s’écouler', async () => {
  const css = await read('src/styles/presentation.css');
  const print = css.slice(css.indexOf('@media print'));

  assert.doesNotMatch(print, /block-size:\s*9in/);
  assert.doesNotMatch(print, /overflow:\s*hidden/);
  assert.doesNotMatch(print, /break-after:\s*page/);
});

test('les repères secondaires restent lisibles au projecteur', async () => {
  const css = await read('src/styles/presentation.css');

  assert.match(css, /\.resource-rail a span\s*{[^}]*font-size:\s*clamp\(0\.9rem/s);
  assert.match(css, /\.resource-rail a strong\s*{[^}]*font-size:\s*clamp\(1rem/s);
  assert.match(css, /\.checkpoint-scene__status\s*{[^}]*font-size:\s*1rem/s);
});
