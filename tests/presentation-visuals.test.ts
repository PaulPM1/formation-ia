import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { A_DECKS } from '../src/presentation/manifests/a';
import { B_DECKS } from '../src/presentation/manifests/b';
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

  assert.deepEqual(state.calculateContextSelection(5, [true, false, true, false, true]), {
    included: 3,
    total: 5,
  });

  assert.equal(state.verificationForRisk('Moyen', [
    { risk: 'Faible', verification: 'Relecture rapide' },
    { risk: 'Moyen', verification: 'Source + contre-lecture' },
  ]), 'Source + contre-lecture');
});

test('les visuels polymorphes choisissent une scène propre à chaque forme de données', async () => {
  const state = await import('../src/components/presentation/visuals/a/visual-state').catch(() => null);
  assert.ok(state, 'les helpers d’état du bloc A doivent exister');
  const slides = A_DECKS.flatMap((deck) => deck.slides);
  const data = (id: string) => slides.find((candidate) => candidate.id === id)?.visual.data ?? {};

  assert.equal(state.getVerificationVariant(data('a1-plausible')), 'classification');
  assert.equal(state.getVerificationVariant(data('a5-convincing')), 'statements');
  assert.equal(state.getVerificationVariant(data('a5-biases')), 'biases');
  assert.equal(state.getVerificationVariant(data('a5-risk')), 'risk');
  assert.equal(state.getVerificationVariant(data('a5-method')), 'method');

  assert.equal(state.getContextBudgetVariant(data('a4-three-costs')), 'layers');
  assert.equal(state.getContextBudgetVariant(data('a4-context-meter')), 'meter');
  assert.equal(state.getContextBudgetVariant(data('a4-agentic')), 'comparison');
  assert.equal(state.getContextBudgetVariant(data('a4-budget')), 'mission');
});

test('la progression conserve tout le contenu sans JavaScript puis isole le panneau actif', async () => {
  const state = await import('../src/components/presentation/visuals/a/visual-state').catch(() => null);
  assert.ok(state, 'les helpers d’état du bloc A doivent exister');

  assert.deepEqual(state.resolvePanelVisibility(4, 2, false), [true, true, true, true]);
  assert.deepEqual(state.resolvePanelVisibility(4, 2, true), [false, false, true, false]);
  assert.deepEqual(state.classificationState(), { selection: null, revealed: false });
  assert.deepEqual(state.tokenEnhancementState(true), {
    interactive: false,
    controlHidden: true,
    finalVisible: true,
  });
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

test('enregistre tous les visuels du bloc B', async () => {
  const registry = await read('src/components/presentation/VisualRegistry.astro');
  for (const name of [
    'SetupDiagnostic', 'PromptBuilder', 'ArtifactTestLoop',
    'PacteWorkspace', 'IpmtrLoop', 'WorkspaceTriptych',
  ]) assert.match(registry, new RegExp(name));
});

test('les 27 routes spécialisées du bloc B choisissent leur variante réelle', async () => {
  const state = await import('../src/components/presentation/visuals/b/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc B doivent exister");

  const specialized = B_DECKS.flatMap((deck) => deck.slides)
    .filter((slide) => !['mission-board', 'checkpoint'].includes(slide.visual.key));
  assert.equal(specialized.length, 27);

  const expected = new Map<string, string>([
    ['b0-layers', 'layers'], ['b0-diagnostic', 'checks'], ['b0-test', 'test'],
    ['b0-fallback', 'fallback'], ['b4bis-install', 'platforms'],
    ['b1-vague', 'comparison'], ['b1-four-blocks', 'blocks'], ['b1-builder', 'builder'], ['b1-loop', 'loop'],
    ['b2-object', 'transfer'], ['b2-anatomy', 'anatomy'], ['b2-mvp', 'mvp'],
    ['b2-tests', 'tests'], ['b2-correction', 'correction'],
    ['b3-delegation', 'delegation'], ['b3-pacte', 'pacte'], ['b3-permissions', 'permissions'],
    ['b3-observe', 'timeline'], ['b3-check', 'check'],
    ['b4-context', 'context'], ['b4-ipmtr', 'process'], ['b4-permission', 'permission'], ['b4-test', 'proof'],
    ['b4-transition', 'panes'], ['b4bis-workspace', 'workspace'],
    ['b4bis-triptych', 'panes'], ['b4bis-path', 'path'],
  ]);

  const resolverByKey = {
    'setup-diagnostic': state.getSetupVariant,
    'prompt-builder': state.getPromptVariant,
    'artifact-test-loop': state.getArtifactVariant,
    'pacte-workspace': state.getPacteVariant,
    'ipmtr-loop': state.getIpmtrVariant,
    'workspace-triptych': state.getWorkspaceVariant,
  } as const;

  for (const slide of specialized) {
    const resolver = resolverByKey[slide.visual.key as keyof typeof resolverByKey];
    assert.equal(resolver?.(slide.visual.data), expected.get(slide.id), slide.id);
  }
});

test('les états interactifs du bloc B restent déterministes et bloquent les portes', async () => {
  const state = await import('../src/components/presentation/visuals/b/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc B doivent exister");

  assert.deepEqual(state.resolvePanelVisibility(4, 1, false), [true, true, true, true]);
  assert.deepEqual(state.resolvePanelVisibility(4, 1, true), [false, true, false, false]);
  assert.equal(state.assemblePrompt(['Objectif', 'Contexte'], [true, false]), 'Objectif');
  assert.equal(state.commandForPlatform('windows', { mac: 'pwd', windows: 'Get-Location' }), 'Get-Location');

  const closed = { permission: false, test: false, diff: false };
  assert.deepEqual(state.advanceIpmtr(0, closed), { index: 1, blockedBy: null });
  assert.deepEqual(state.advanceIpmtr(1, closed), { index: 1, blockedBy: 'permission' });
  assert.deepEqual(state.advanceIpmtr(1, { ...closed, permission: true }), { index: 2, blockedBy: null });
  assert.deepEqual(state.advanceIpmtr(2, closed), { index: 3, blockedBy: null });
  assert.deepEqual(state.advanceIpmtr(3, { ...closed, permission: true }), { index: 3, blockedBy: 'test' });
  assert.deepEqual(state.advanceIpmtr(3, { ...closed, test: true }), { index: 4, blockedBy: null });
  assert.deepEqual(state.advanceIpmtr(4, { ...closed, test: true }), { index: 4, blockedBy: 'diff' });
  assert.deepEqual(state.advanceIpmtr(4, { permission: true, test: true, diff: true }), { index: 0, blockedBy: null });

  assert.equal(state.ipmtrGateAfter(1), 'permission');
  assert.equal(state.ipmtrGateAfter(2), null);
  assert.equal(state.ipmtrGateAfter(3), 'test');
  assert.equal(state.ipmtrGateAfter(4), 'diff');
  let loopIndex = 0;
  for (const expected of [1, 2, 3, 4, 0, 1]) {
    loopIndex = state.advanceIpmtr(loopIndex, { permission: true, test: true, diff: true }).index;
    assert.equal(loopIndex, expected);
  }

  assert.deepEqual(state.artifactViewState(3, null), {
    active: null,
    panels: [true, true, true],
    nodes: [true, true, true],
  });
  assert.deepEqual(state.artifactViewState(3, 1), {
    active: 1,
    panels: [false, true, false],
    nodes: [false, true, false],
  });
});

test('le triptyque sépare la destination de transition du chemin partagé', async () => {
  const state = await import('../src/components/presentation/visuals/b/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc B doivent exister");
  const slides = B_DECKS.flatMap((deck) => deck.slides);
  const data = (id: string) => slides.find((slide) => slide.id === id)?.visual.data ?? {};

  assert.equal(state.workspaceSharedPath(data('b4-transition')), 'atelier-ia/bonjour.txt');
  assert.equal(state.workspaceSharedPath(data('b4bis-triptych')), 'atelier-ia');
  assert.notEqual(state.workspaceSharedPath(data('b4-transition')), data('b4-transition').destination);
});

test('Artifact route chaque claim vers un visuel central distinct et synchronisable', async () => {
  const artifact = await read('src/components/presentation/visuals/b/ArtifactTestLoop.astro');
  assert.match(artifact, /variant === 'transfer'/);
  assert.match(artifact, /variant === 'anatomy'/);
  assert.match(artifact, /variant === 'mvp'/);
  assert.match(artifact, /isLoopVariant/);
  assert.match(artifact, /data-artifact-node/);
  assert.match(artifact, /data-artifact-overview/);
  assert.match(artifact, /Vue d’ensemble/);
  assert.match(artifact, /node\.classList\.toggle/);
  assert.match(artifact, /document\.querySelectorAll<HTMLElement>\('\[data-artifact-loop\]'\)/);
  assert.match(artifact, /scene\.querySelectorAll<HTMLButtonElement>\('\[data-artifact-stage\]'\)/);
});

test('I.P.M.T.R. annonce les trois portes sur une boucle non terminale', async () => {
  const ipmtr = await read('src/components/presentation/visuals/b/IpmtrLoop.astro');
  assert.match(ipmtr, /data-ipmtr-gate-label="permission"/);
  assert.match(ipmtr, /data-ipmtr-gate-label="test"/);
  assert.match(ipmtr, /data-ipmtr-gate-label="diff"/);
  assert.doesNotMatch(ipmtr, /index === panels\.length - 1/);
  assert.match(ipmtr, /Vers \$\{nextName\}/);
});

test('les visuels du bloc B gardent un état final sans JS et des contrôles natifs', async () => {
  const files = await Promise.all([
    'SetupDiagnostic', 'PromptBuilder', 'ArtifactTestLoop',
    'PacteWorkspace', 'IpmtrLoop', 'WorkspaceTriptych',
  ].map((name) => read(`src/components/presentation/visuals/b/${name}.astro`))).catch(() => [] as string[]);

  assert.equal(files.length, 6);
  assert.match(files[0] ?? '', /type="radio"/);
  assert.match(files[1] ?? '', /<button[^>]+type="button"/);
  assert.match(files[2] ?? '', /<path[^>]+data-loop-path/);
  assert.match(files[3] ?? '', /type="checkbox"/);
  assert.match(files[4] ?? '', /<path[^>]+data-ipmtr-path/);
  assert.match(files[5] ?? '', /data-command-mac/);
  for (const file of files) {
    assert.match(file, /data-enhanced/);
    assert.match(file, /prefers-reduced-motion/);
    assert.doesNotMatch(file, /onclick=/);
  }
});
