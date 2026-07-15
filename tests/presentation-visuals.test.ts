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

test('enregistre tous les visuels du bloc A', async () => {
  const registry = await read('src/components/presentation/VisualRegistry.astro');
  for (const name of [
    'TokenPredictor', 'ContextComparison', 'ResponseWorkflowAgent',
    'InterfaceContinuum', 'ContextBudget', 'VerificationAudit',
  ]) assert.match(registry, new RegExp(name));
});

test('les interactions du bloc A produisent des états pédagogiques déterministes', async () => {
  const state = await import('../src/components/presentation/visuals/a/visual-state').catch(() => null);
  assert.ok(state, 'les helpers d’état du bloc A doivent exister');

  assert.deepEqual(state.advanceTokenState(0, ['Le', ' chat', ' dort', '.']), {
    index: 1,
    sentence: 'Le chat',
    complete: false,
  });
  assert.deepEqual(state.advanceTokenState(3, ['Le', ' chat', ' dort', '.']), {
    index: 3,
    sentence: 'Le chat dort.',
    complete: true,
  });

  const budgetItems = [
    { load: 'faible', useful: true },
    { load: 'élevée', useful: false },
    { load: 'significative', useful: true },
  ];
  assert.deepEqual(state.calculateContextBudget(budgetItems, [true, false, true]), {
    load: 3,
    capacity: 6,
    percentage: 50,
    useful: 2,
  });

  assert.equal(state.verificationForRisk('Moyen', [
    { risk: 'Faible', verification: 'Relecture rapide' },
    { risk: 'Moyen', verification: 'Source + contre-lecture' },
  ]), 'Source + contre-lecture');
});

test('les visuels du bloc A utilisent des contrôles natifs et des relations continues', async () => {
  const [token, context, workflow, continuum, budget, audit] = await Promise.all([
    read('src/components/presentation/visuals/a/TokenPredictor.astro'),
    read('src/components/presentation/visuals/a/ContextComparison.astro'),
    read('src/components/presentation/visuals/a/ResponseWorkflowAgent.astro'),
    read('src/components/presentation/visuals/a/InterfaceContinuum.astro'),
    read('src/components/presentation/visuals/a/ContextBudget.astro'),
    read('src/components/presentation/visuals/a/VerificationAudit.astro'),
  ]).catch(() => [] as string[]);

  assert.match(token ?? '', /<button[^>]+type="button"/);
  assert.match(context ?? '', /aria-pressed/);
  assert.match(workflow ?? '', /<path[^>]+marker-end/);
  assert.match(continuum ?? '', /type="radio"/);
  assert.match(budget ?? '', /type="checkbox"/);
  assert.match(audit ?? '', /type="radio"/);
});

test('le prédicteur laisse réellement disparaître les tokens futurs', async () => {
  const token = await read('src/components/presentation/visuals/a/TokenPredictor.astro');
  assert.match(token, /\[data-token\]\[hidden\]\s*{[^}]*display:\s*none/s);
});
