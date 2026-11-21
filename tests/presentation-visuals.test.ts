import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

import { A_DECKS } from '../src/presentation/manifests/a';
import { C_DECKS } from '../src/presentation/manifests/c';
import { E_DECKS } from '../src/presentation/manifests/e';
import { SLIDE_VISUAL_KEYS } from '../src/presentation/presentation-model';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('utilise un champ lumineux sans grille permanente', async () => {
  const css = await read('src/styles/presentation.css');
  assert.match(css, /radial-gradient/);
  assert.doesNotMatch(css, /background-size:\s*\d+px\s+\d+px/);
  assert.match(css, /prefers-reduced-motion/);
});

test('les pistes et scènes fluides se contractent sans masquer un débordement mobile', async () => {
  const css = await read('src/styles/presentation.css');
  const bodyRule = css.match(/body\s*\{([^}]*)\}/s)?.[1] ?? '';
  assert.doesNotMatch(bodyRule, /overflow-x:\s*(?:hidden|clip)/);
  assert.match(css, /#slide-content[^{}]*\.presentation-controls[^{}]*\{[^}]*min-inline-size:\s*0/s);
  assert.match(css, /\.presentation-slide > \*[^{}]*\{[^}]*max-inline-size:\s*100%/s);
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

test('le rail de ressources replie trois liens ou plus sans les masquer', async () => {
  const css = await read('src/styles/presentation.css');
  const railList = css.match(/\.resource-rail ul\s*\{([^}]*)\}/s)?.[1] ?? '';
  const railItem = css.match(/\.resource-rail li\s*\{([^}]*)\}/s)?.[1] ?? '';
  const railLink = css.match(/\.resource-rail a\s*\{([^}]*)\}/s)?.[1] ?? '';

  assert.match(railList, /flex-wrap:\s*wrap/);
  assert.match(railList, /overflow(?:-x)?:\s*visible/);
  assert.match(railItem, /min-inline-size:\s*0/);
  assert.match(railLink, /min-inline-size:\s*0/);
});

test('un rail dense conserve le libellé et distingue les liens externes sans métadonnée haute', async () => {
  const [rail, css] = await Promise.all([
    read('src/components/presentation/scenes/ResourceRail.astro'),
    read('src/styles/presentation.css'),
  ]);

  assert.match(rail, /data-link-kind/);
  assert.match(rail, /resource-rail__external/);
  assert.match(css, /\.resource-rail ul:has\(li:nth-child\(3\)\) \.resource-rail__meta/);
  assert.match(css, /\.resource-rail__external/);
});

test('les missions denses du bloc A compactent les énoncés au lieu de les faire défiler', async () => {
  const [mission, css] = await Promise.all([
    read('src/components/presentation/scenes/MissionBoard.astro'),
    read('src/styles/presentation.css'),
  ]);

  assert.match(mission, /data\.statements/);
  assert.match(mission, /mission-board--statements/);
  assert.match(mission, /mission-board__statements/);
  assert.match(css, /\.presentation-stage\[data-family="a"\] \.mission-board \.scene-frame__content/);
  assert.match(css, /\.mission-board--statements \.mission-board__statements/);
});

test('la mission A4 sépare les affirmations de leur correction native', async () => {
  const mission = await read('src/components/presentation/scenes/MissionBoard.astro');

  assert.match(mission, /<details class="mission-board__correction">/);
  assert.match(mission, /<summary>Afficher la correction<\/summary>/);
  assert.match(mission, /mission-board__correction-list/);
  const initialStatements = mission
    .slice(mission.indexOf('<div class="mission-board__statements">'))
    .split('<details class="mission-board__correction">')[0];
  assert.doesNotMatch(
    initialStatements,
    /statement\.category/,
  );
});

test('les tokens typographiques des slides gardent un plancher de 0,75 rem', async () => {
  const visualRoot = new URL('../src/components/presentation/visuals/', import.meta.url);
  const visualFiles = (await Promise.all((await readdir(visualRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map(async (family) => (await readdir(new URL(`${family.name}/`, visualRoot)))
      .filter((name) => name.endsWith('.astro'))
      .map((name) => `src/components/presentation/visuals/${family.name}/${name}`))))
    .flat();
  const files = ['src/styles/presentation.css', ...visualFiles];
  const sources = await Promise.all(files.map(async (path) => ({ path, source: await read(path) })));

  for (const { path, source } of sources) {
    for (const match of source.matchAll(/font-size:\s*(?:clamp\()?\s*(0?\.\d+)rem/g)) {
      assert.ok(Number(match[1]) >= 0.75, `${path}: font-size ${match[1]}rem sous le plancher`);
    }
  }
});

test('la QA durable mesure les textes HTML et SVG à 12 px sur 62 routes et au zoom 200 %', async () => {
  const [qa, ready, packageJson] = await Promise.all([
    read('scripts/qa-font-floor.mjs'),
    read('scripts/qa-page-ready.mjs'),
    read('package.json'),
  ]);

  assert.match(packageJson, /"qa:font-floor":\s*"node scripts\/qa-font-floor\.mjs"/);
  assert.match(qa, /const FONT_FLOOR_PX = 11\.99/);
  assert.match(qa, /querySelectorAll\(['"]svg text['"]\)/);
  assert.match(qa, /deviceScaleFactor:\s*2/);
  assert.match(qa, /routes\.length[^\n]*62|62[^\n]*routes\.length/);
  assert.match(qa, /navigateAndWaitForFonts/);
  assert.match(ready, /waitUntil:\s*'domcontentloaded'/);
  assert.match(ready, /Promise\.race/);
  assert.match(ready, /FONT_WAIT_TIMEOUT_MS\s*=\s*1500/);
});

test('la QA A2 couvre clavier, progression, score, replay, mobile, zoom et repli sans JavaScript', async () => {
  const [qa, packageJson] = await Promise.all([
    read('scripts/qa-a2-prioritizer.mjs'),
    read('package.json'),
  ]);

  assert.match(packageJson, /"qa:a2-prioritizer":\s*"node scripts\/qa-a2-prioritizer\.mjs"/);
  assert.match(qa, /a2-prioritize/);
  assert.match(qa, /keyboard\.press\(['"]Space['"]\)/);
  assert.match(qa, /data-prioritizer-next/);
  assert.match(qa, /data-prioritizer-score/);
  assert.match(qa, /data-prioritizer-replay/);
  assert.match(qa, /javaScriptEnabled:\s*false/);
  assert.match(qa, /data-prioritizer-correction/);
  assert.match(qa, /viewport:\s*\{ width: 390, height: 844 \}/);
  assert.match(qa, /style\.zoom = ['"]2['"]/);
  assert.match(qa, /reducedMotion:\s*['"]reduce['"]/);
});

test('la QA A3 couvre niveaux, volumes, mobile, zoom, mouvement réduit et repli sans JavaScript', async () => {
  const [qa, packageJson] = await Promise.all([
    read('scripts/qa-a3-model-costs.mjs'),
    read('package.json'),
  ]);

  assert.match(packageJson, /"qa:a3-model-costs":\s*"node scripts\/qa-a3-model-costs\.mjs"/);
  assert.match(qa, /a3-model-fit/);
  assert.match(qa, /a3-api-cost/);
  assert.match(qa, /a3-access/);
  assert.match(qa, /input\[type="radio"\]\[data-tier-choice\]/);
  assert.match(qa, /data-cost-output/);
  assert.match(qa, /descendantOverflow/);
  assert.match(qa, /outsideGuide/);
  assert.match(qa, /getComputedStyle\(element, pseudo\)/);
  assert.match(qa, /\['', '::before', '::after'\]/);
  assert.match(qa, /unitCell\.isVisible\(\)/);
  assert.match(qa, /hundredCell\.isVisible\(\)/);
  assert.match(qa, /inspectLayout\(noScriptPage\)/);
  assert.match(qa, /javaScriptEnabled:\s*false/);
  assert.match(qa, /viewport:\s*\{ width: 390, height: 844 \}/);
  assert.match(qa, /style\.zoom = ['"]2['"]/);
  assert.match(qa, /reducedMotion:\s*['"]reduce['"]/);
});

test('la QA durable A4 ouvre la correction au clavier et exige un reflow au zoom 200 %', async () => {
  const [qa, packageJson] = await Promise.all([
    read('scripts/qa-a4-mission.mjs'),
    read('package.json'),
  ]);

  assert.match(packageJson, /"qa:a4-mission":\s*"node scripts\/qa-a4-mission\.mjs"/);
  assert.match(qa, /document\.documentElement\.style\.zoom = String\(factor\)/);
  assert.match(qa, /page\.keyboard\.press\('Enter'\)/);
  assert.match(qa, /contentScrollHeight > result\.contentClientHeight/);
  assert.match(qa, /documentScrollHeight <= result\.documentClientHeight/);
  assert.match(qa, /\.presentation-site-nav a/);
  assert.match(qa, /\.presentation-controls :is\(a, button\)/);
  assert.match(qa, /navigationIntersections\.length/);
  assert.match(qa, /viewport:\s*\{ width: 390, height: 844 \}/);
  assert.match(qa, /requestAnimationFrame\(\(\) => requestAnimationFrame/);
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
  const [registry, model] = await Promise.all([
    read('src/components/presentation/VisualRegistry.astro'),
    read('src/presentation/presentation-model.ts'),
  ]);
  for (const name of [
    'TokenPredictor', 'ContextComparison', 'SolutionComparison',
    'SolutionPrioritizer', 'ModelCostGuide', 'ContextBudget', 'VerificationAudit',
  ]) assert.match(registry, new RegExp(name));
  assert.match(registry, /'context-budget': ContextBudget/);
  assert.match(model, /'context-budget'/);
  assert.doesNotMatch(registry, /ResponseWorkflowAgent|InterfaceContinuum/);
});

test('A3 utilise des contrôles natifs et conserve ses données sans JavaScript', async () => {
  const visual = await read('src/components/presentation/visuals/a/ModelCostGuide.astro');

  assert.match(visual, /<fieldset class="model-guide__tier-controls" data-enhancement-control>/);
  assert.match(visual, /type="radio"[^>]*data-tier-choice/);
  assert.match(visual, /<table class="model-guide__cost-table">/);
  assert.match(visual, /<caption>/);
  assert.match(visual, /scope="col"/);
  assert.match(visual, /data-cost-output/);
  assert.match(visual, /:focus-visible/);
  assert.match(visual, /min-block-size:\s*3rem/);
  assert.match(visual, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(visual, /onclick=/);
});

test('A3 valide localement chaque branche de données avant son rendu', async () => {
  const visual = await read('src/components/presentation/visuals/a/ModelCostGuide.astro');

  assert.match(visual, /type ModelCostGuideData\s*=/);
  assert.match(visual, /variant:\s*'models'/);
  assert.match(visual, /variant:\s*'costs'/);
  assert.match(visual, /variant:\s*'access'/);
  assert.match(visual, /assertModelCostGuideData/);
  assert.match(visual, /data\.variant === 'models'/);
  assert.match(visual, /data\.variant === 'costs'/);
  assert.match(visual, /data\.variant === 'access'/);
  for (const requiredString of [
    'interaction', 'rule', 'snapshot', 'caseLabel', 'caveat',
    'subscriptionTitle', 'apiTitle', 'hybrid', 'conclusion',
    'reference', 'intensivePlans',
  ]) {
    assert.match(visual, new RegExp(`isString\\(data\\.${requiredString}\\)`), requiredString);
  }
  assert.match(visual, /isWorkload\(data\.workload\)/);
  assert.match(visual, /data\.tiers\.every\(isTier\)/);
  assert.match(visual, /data\.prices\.every\(isPrice\)/);
  assert.match(visual, /isStringArray\(data\.subscriptionPoints\)/);
  assert.match(visual, /isStringArray\(data\.apiPoints\)/);
  assert.doesNotMatch(visual, /String\(data\.variant/);
  assert.doesNotMatch(visual, /as string\[\]|as Tier\[\]|as Price\[\]|as \{ inputTokens/);
});

test('A3 réserve les sélecteurs à la version améliorée et annonce le volume de coûts', async () => {
  const visual = await read('src/components/presentation/visuals/a/ModelCostGuide.astro');

  assert.match(visual, /data-enhancement-control/);
  assert.match(visual, /\[data-enhanced='true'\] \[data-enhancement-control\]/);
  assert.match(visual, /data-cost-summary/);
  assert.match(visual, /aria-live="polite"/);
  assert.match(visual, /aria-atomic="true"/);
  assert.match(visual, /unitCosts/);
});

test('A3 rend les repères tarifaires et la comparaison API de la slide accès', async () => {
  const visual = await read('src/components/presentation/visuals/a/ModelCostGuide.astro');

  assert.match(visual, /data\.intensivePlans/);
  assert.match(visual, /data\.reference/);
  assert.match(visual, /data\.snapshot/);
});

test('A3 conserve des libellés visibles pour chaque coût au format mobile', async () => {
  const visual = await read('src/components/presentation/visuals/a/ModelCostGuide.astro');

  assert.match(visual, /<td data-label="Entrée \/ MTok">/);
  assert.match(visual, /<td data-label="Sortie \/ MTok">/);
  assert.match(visual, /<td data-label="1 dossier">/);
  assert.match(visual, /<td data-label="100 dossiers" data-volume-cost>/);
  assert.match(visual, /content:\s*attr\(data-label\)/);
  assert.match(visual, /volumeCost\.dataset\.label\s*=\s*volumeLabel/);
});

test('A3 autorise les colonnes d’accès à se contracter au zoom 200 %', async () => {
  const visual = await read('src/components/presentation/visuals/a/ModelCostGuide.astro');

  assert.match(visual, /grid-template-columns:\s*minmax\(0, 1fr\) minmax\(12rem, \.55fr\) minmax\(0, 1fr\)/);
  assert.match(visual, /\.model-guide__access > \*\s*\{[^}]*min-inline-size:\s*0/s);
  assert.match(visual, /\.model-guide__access article > \*\s*\{[^}]*min-inline-size:\s*0;[^}]*overflow-wrap:\s*anywhere/s);
});

test('A3 cible son propre nœud racine lorsque le mouvement est réduit', async () => {
  const visual = await read('src/components/presentation/visuals/a/ModelCostGuide.astro');

  assert.match(visual, /\.model-guide__scene,\s*\.model-guide__scene \*,\s*\.model-guide__scene::before,\s*\.model-guide__scene::after,\s*\.model-guide__scene \*::before,\s*\.model-guide__scene \*::after\s*\{[^}]*transition:\s*none !important;[^}]*animation:\s*none !important;/s);
});

test('le registre expose la scène modèles et coûts', async () => {
  const [model, registry] = await Promise.all([
    read('src/presentation/presentation-model.ts'),
    read('src/components/presentation/VisualRegistry.astro'),
  ]);

  assert.match(model, /'model-cost-guide'/);
  assert.match(registry, /ModelCostGuide/);
  assert.match(registry, /'model-cost-guide': ModelCostGuide/);
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

test("la démonstration d'entraînement parcourt prédiction, comparaison et ajustement", async () => {
  const state = await import('../src/components/presentation/visuals/a/visual-state');

  assert.deepEqual(
    state.advanceTrainingPlayback({ tokenIndex: 0, phase: 'predict', complete: false }, 3),
    { tokenIndex: 0, phase: 'compare', complete: false },
  );
  assert.deepEqual(
    state.advanceTrainingPlayback({ tokenIndex: 0, phase: 'compare', complete: false }, 3),
    { tokenIndex: 0, phase: 'adjust', complete: false },
  );
  assert.deepEqual(
    state.advanceTrainingPlayback({ tokenIndex: 0, phase: 'adjust', complete: false }, 3),
    { tokenIndex: 1, phase: 'predict', complete: false },
  );
  assert.deepEqual(
    state.advanceTrainingPlayback({ tokenIndex: 2, phase: 'adjust', complete: false }, 3),
    { tokenIndex: 2, phase: 'adjust', complete: true },
  );
  assert.deepEqual(
    state.advanceTrainingPlayback({ tokenIndex: 2, phase: 'adjust', complete: true }, 3),
    { tokenIndex: 0, phase: 'predict', complete: false },
  );
});

test("l'ouverture A1 annonce une simulation et conserve son état final sans JavaScript", async () => {
  const [token, training] = await Promise.all([
    read('src/components/presentation/visuals/a/TokenPredictor.astro'),
    read('src/components/presentation/visuals/a/TrainingPlayback.astro'),
  ]);

  assert.match(token, /trainingExample/);
  assert.match(training, /Simulation pédagogique/);
  assert.match(training, /data-training-playback/);
  assert.match(training, /data-training-toggle/);
  assert.match(training, /<ol class="training-playback__cycle"/);
  assert.match(training, /prefers-reduced-motion/);
  assert.match(training, /Prédire/);
  assert.match(training, /Comparer/);
  assert.match(training, /Ajuster/);
  assert.doesNotMatch(training, /candidates\.innerHTML/);
});

test("l'ouverture A1 masque les tokens futurs sans transition lisible", async () => {
  const training = await read('src/components/presentation/visuals/a/TrainingPlayback.astro');
  const tokenRule = training.match(/\.training-playback__sentence span\s*\{([^}]*)\}/s)?.[1] ?? '';
  const transitions = tokenRule.match(/transition:\s*([^;]*)/)?.[1] ?? '';
  const transitionProperties = tokenRule.match(/transition-property:\s*([^;]*)/)?.[1] ?? '';

  assert.doesNotMatch(transitions, /(?:^|,)\s*(?:all|color)(?:\s|$)/);
  assert.doesNotMatch(transitionProperties, /(?:^|,)\s*(?:all|color)\s*(?:,|$)/);
  assert.match(
    training,
    /\[data-enhanced='true'\][^{]*span:not\(\[data-revealed='true'\]\)\s*\{[^}]*color:\s*transparent/s,
  );
});

test("l'ouverture A1 partage un contrat validé pour son exemple d'entraînement", async () => {
  const contract = await import('../src/components/presentation/visuals/a/training-example').catch(() => null);
  assert.ok(contract, "le contrat d'entraînement partagé doit exister");
  const opening = A_DECKS.flatMap((deck) => deck.slides).find((slide) => slide.id === 'a1-opening');
  assert.equal(contract.isTrainingExample(opening?.visual.data.trainingExample), true);

  const [token, training] = await Promise.all([
    read('src/components/presentation/visuals/a/TokenPredictor.astro'),
    read('src/components/presentation/visuals/a/TrainingPlayback.astro'),
  ]);
  assert.match(token, /isTrainingExample/);
  assert.match(training, /TrainingExample/);
  assert.match(training, /isTrainingExample\(trainingExample\)/);
  assert.doesNotMatch(training, /trainingExample\s+as\s+\{/);
  assert.doesNotMatch(training, /JSON\.parse\([^\n]+\)\s+as\s+/);
});

test('la comparaison A1 relie contexte, interprétation et suite sans JavaScript', async () => {
  const context = await read('src/components/presentation/visuals/a/ContextComparison.astro');

  assert.match(context, /context\.leadIn/);
  assert.match(context, /context\.interpretation/);
  assert.match(context, /context\.completion/);
  assert.match(context, /data-context-panel/);
  assert.match(context, /aria-pressed/);
});

test("l'entraînement annule son timeout et son écouteur de mouvement avant chaque transition Astro", async () => {
  const training = await read('src/components/presentation/visuals/a/TrainingPlayback.astro');

  assert.match(training, /const cleanup = \(\) => \{[\s\S]*?window\.clearTimeout\(timer\)/);
  assert.match(training, /motionPreference\.removeEventListener\('change', handleMotionPreference\)/);
  assert.match(training, /document\.addEventListener\('astro:before-swap', cleanup, \{ once: true \}\)/);
});

test("le bouton d'entraînement utilise le focus contrasté de la présentation", async () => {
  const training = await read('src/components/presentation/visuals/a/TrainingPlayback.astro');

  assert.match(
    training,
    /\.training-playback button:focus-visible\s*{[^}]*var\(--presentation-focus\)/s,
  );
  assert.doesNotMatch(
    training,
    /\.training-playback button:focus-visible\s*{[^}]*var\(--family-accent\)/s,
  );
});

test("la QA durable A1 couvre autoplay, pause, repli et nettoyage des timers", async () => {
  const [qa, packageJson] = await Promise.all([
    read('scripts/qa-a1-training.mjs'),
    read('package.json'),
  ]);

  assert.match(packageJson, /"qa:a1-training":\s*"node scripts\/qa-a1-training\.mjs"/);
  assert.match(qa, /javaScriptEnabled:\s*false/);
  assert.match(qa, /reducedMotion:\s*'reduce'/);
  assert.match(qa, /data-training-status/);
  assert.match(qa, /data-training-toggle/);
  assert.match(qa, /data-training-playback/);
  assert.match(qa, /data-next/);
  assert.match(qa, /data-previous/);
  assert.match(qa, /trainingTimerCount/);
  assert.match(qa, /outlineColor/);
  assert.match(qa, /emulateMedia\(\{ reducedMotion: 'reduce' \}\)/);
  assert.match(qa, /training-playback__sentence[\s\S]*isVisible/);
  assert.match(qa, /training-playback__cycle[\s\S]*isVisible/);
  assert.match(qa, /transitionProperty/);
});

test('les visuels polymorphes choisissent une scène propre à chaque forme de données', async () => {
  const state = await import('../src/components/presentation/visuals/a/visual-state').catch(() => null);
  assert.ok(state, 'les helpers d’état du bloc A doivent exister');
  const slides = A_DECKS.flatMap((deck) => deck.slides);
  const data = (id: string) => slides.find((candidate) => candidate.id === id)?.visual.data ?? {};

  assert.equal(state.getVerificationVariant(data('a1-plausible')), 'classification-sequence');
  assert.equal(state.getVerificationVariant(data('a4-convincing')), 'statements');
  assert.equal(state.getVerificationVariant(data('a4-biases')), 'biases');
  assert.equal(state.getVerificationVariant(data('a4-risk')), 'risk');
  assert.equal(state.getVerificationVariant(data('a4-method')), 'method');

  const eSlides = E_DECKS.flatMap((deck) => deck.slides);
  const contextData = (id: string) => eSlides.find((candidate) => candidate.id === id)?.visual.data ?? {};
  assert.equal(state.getContextBudgetVariant(contextData('e2-roles')), 'comparison');
  assert.equal(state.getContextBudgetVariant(contextData('e3-mvp')), 'meter');
});

test('le checkpoint A1 avance sans dépasser la cinquième affirmation', async () => {
  const state = await import('../src/components/presentation/visuals/a/visual-state');
  assert.equal(state.advanceClassificationSequence(0, 5), 1);
  assert.equal(state.advanceClassificationSequence(4, 5), 4);
  assert.equal(state.advanceClassificationSequence(0, 0), 0);
});

test('le checkpoint A1 expose cinq corrections natives hors JavaScript', async () => {
  const audit = await read('src/components/presentation/visuals/a/VerificationAudit.astro');
  assert.match(audit, /classification-sequence/);
  assert.match(audit, /data-sequence-panel/);
  assert.match(audit, /data-sequence-next/);
  assert.match(audit, /<details class="audit__sequence-fallback"/);
  assert.match(audit, /statement\.reason/);
});

test('le checkpoint A1 transfère le focus seulement après une progression demandée', async () => {
  const audit = await read('src/components/presentation/visuals/a/VerificationAudit.astro');
  assert.match(audit, /const renderPanel = \(focusChoice = false\)/);
  assert.match(audit, /if \(focusChoice\) choices\[0\]\?\.focus\(\)/);
  assert.match(audit, /renderPanel\(true\)/);
  assert.match(audit, /renderPanel\(\);\s*return;/);
});

test('la QA durable du checkpoint A1 protège son verrou, son focus, son replay et son repli', async () => {
  const [qa, packageJson] = await Promise.all([
    read('scripts/qa-a1-checkpoint.mjs'),
    read('package.json'),
  ]);

  assert.match(packageJson, /"qa:a1-checkpoint":\s*"node scripts\/qa-a1-checkpoint\.mjs"/);
  assert.match(qa, /a1-plausible/);
  assert.match(qa, /document\.activeElement/);
  assert.match(qa, /data-sequence-choice/);
  assert.match(qa, /data-sequence-reveal/);
  assert.match(qa, /data-sequence-next/);
  assert.match(qa, /Rejouer le checkpoint/);
  assert.match(qa, /javaScriptEnabled:\s*false/);
  assert.match(qa, /audit__sequence-fallback/);
  assert.match(qa, /outlineColor/);
  assert.match(qa, /outlineStyle/);
  assert.match(qa, /outlineWidth/);
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
  const [token, context, comparison, prioritizer, audit] = await Promise.all([
    read('src/components/presentation/visuals/a/TokenPredictor.astro'),
    read('src/components/presentation/visuals/a/ContextComparison.astro'),
    read('src/components/presentation/visuals/a/SolutionComparison.astro'),
    read('src/components/presentation/visuals/a/SolutionPrioritizer.astro'),
    read('src/components/presentation/visuals/a/VerificationAudit.astro'),
  ]).catch(() => [] as string[]);

  assert.match(token ?? '', /<button[^>]+type="button"/);
  assert.match(context ?? '', /aria-pressed/);
  assert.match(comparison ?? '', /type="radio"/);
  assert.match(prioritizer ?? '', /<form[^>]+data-solution-prioritizer/);
  assert.match(prioritizer ?? '', /type="radio"/);
  assert.match(prioritizer ?? '', /aria-live="polite"/);
  assert.match(audit ?? '', /type="radio"/);
});

test('A2 conserve ses comparatifs et corrections sans JavaScript', async () => {
  const [comparison, prioritizer] = await Promise.all([
    read('src/components/presentation/visuals/a/SolutionComparison.astro'),
    read('src/components/presentation/visuals/a/SolutionPrioritizer.astro'),
  ]);

  assert.match(comparison, /data-solution-panel/);
  assert.match(comparison, /data-enhanced/);
  assert.match(prioritizer, /data-prioritizer-correction/);
  assert.match(prioritizer, /data-prioritizer-summary/);
  assert.match(prioritizer, /prefers-reduced-motion/);
  assert.match(prioritizer, /:focus-visible/);
});

test('le prioriteur A2 rend une radio par paire de solutions', async () => {
  const source = await read('src/components/presentation/visuals/a/SolutionPrioritizer.astro');
  assert.match(source, /option\.solutions/);
  assert.match(source, /join\(['"] \/ ['"]\)/);
  assert.doesNotMatch(source, /option\.ecosystem/);
});

test('le prédicteur laisse réellement disparaître les tokens futurs', async () => {
  const token = await read('src/components/presentation/visuals/a/TokenPredictor.astro');
  assert.match(token, /\[data-token\]\[hidden\]\s*{[^}]*display:\s*none/s);
});

test('enregistre les visuels conservés du dossier b', async () => {
  const registry = await read('src/components/presentation/VisualRegistry.astro');
  for (const name of [
    'SetupDiagnostic', 'PromptBuilder', 'IpmtrLoop',
  ]) assert.match(registry, new RegExp(name));
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
});

test('I.P.M.T.R. consomme les portes et rebloque au second tour', async () => {
  const state = await import('../src/components/presentation/visuals/b/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc B doivent exister");
  let cycle = {
    index: 0,
    gates: { permission: true, test: true, diff: true },
    blockedBy: null as null | string,
  };

  for (let step = 0; step < 5; step += 1) cycle = state.advanceIpmtrCycle(cycle.index, cycle.gates);
  assert.deepEqual(cycle, {
    index: 0,
    gates: { permission: false, test: false, diff: false },
    blockedBy: null,
  });

  cycle = state.advanceIpmtrCycle(cycle.index, cycle.gates);
  assert.equal(cycle.index, 1);
  assert.deepEqual(state.advanceIpmtrCycle(cycle.index, cycle.gates), {
    index: 1,
    gates: { permission: false, test: false, diff: false },
    blockedBy: 'permission',
  });
  cycle = state.advanceIpmtrCycle(cycle.index, { ...cycle.gates, permission: true });
  cycle = state.advanceIpmtrCycle(cycle.index, cycle.gates);
  assert.deepEqual(state.advanceIpmtrCycle(cycle.index, cycle.gates), {
    index: 3,
    gates: { permission: false, test: false, diff: false },
    blockedBy: 'test',
  });
  cycle = state.advanceIpmtrCycle(cycle.index, { ...cycle.gates, test: true });
  assert.deepEqual(state.advanceIpmtrCycle(cycle.index, cycle.gates), {
    index: 4,
    gates: { permission: false, test: false, diff: false },
    blockedBy: 'diff',
  });
});

test('le comparatif de prompt conserve toujours le vrai état après du manifeste', async () => {
  const state = await import('../src/components/presentation/visuals/b/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc B doivent exister");
  const target = 'Prompt cible complet';
  const questions = ['Qui ?', 'Quoi ?', 'Où ?', 'Quand ?'];

  assert.equal(state.promptOutputForVariant('comparison', target, questions, [false, false, false, false]), target);
  assert.equal(state.promptOutputForVariant('comparison', target, questions, [true, false, true, false]), target);
  assert.notEqual(target, questions.join(' · '));
  assert.doesNotMatch(target, /Sélectionnez/);
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
    'SetupDiagnostic', 'PromptBuilder', 'IpmtrLoop',
  ].map((name) => read(`src/components/presentation/visuals/b/${name}.astro`))).catch(() => [] as string[]);

  assert.equal(files.length, 3);
  assert.match(files[0] ?? '', /type="radio"/);
  assert.match(files[1] ?? '', /<button[^>]+type="button"/);
  assert.match(files[2] ?? '', /<path[^>]+data-ipmtr-path/);
  for (const file of files) {
    assert.match(file, /data-enhanced/);
    assert.match(file, /prefers-reduced-motion/);
    assert.doesNotMatch(file, /onclick=/);
  }
});

test('le bloc B impose un plancher typographique lisible au vidéoprojecteur', async () => {
  const componentNames = [
    'SetupDiagnostic', 'PromptBuilder', 'IpmtrLoop',
  ];
  const components = await Promise.all(componentNames.map(async (name) => ({
    name,
    source: await read(`src/components/presentation/visuals/b/${name}.astro`),
  })));
  const presentation = await read('src/styles/presentation.css');
  const global = await read('src/styles/global.css');
  const familyBStart = presentation.indexOf('.presentation-stage[data-family="b"]');
  const familyB = presentation.slice(
    familyBStart,
    presentation.indexOf('.resource-rail {', familyBStart),
  );

  const undersized = (name: string, source: string) => source.split('\n').flatMap((line, index) => {
    if (!/\bfont(?:-size)?\s*:/.test(line)) return [];
    const declarations = Array.from(line.matchAll(/\bfont(?:-size)?\s*:\s*([^;}]+)/g));
    return declarations.flatMap((declaration) => Array.from(
      declaration[1].matchAll(/(?<![-\w])(0?\.\d+|\d+(?:\.\d+)?)rem\b/g),
    )
      .filter((match) => Number(match[1]) < 0.75)
      .map((match) => `${name}:${index + 1}:${match[0]}:${line.trim()}`));
  });

  assert.deepEqual([
    ...undersized('presentation.css#family-b', familyB),
    ...components.flatMap(({ name, source }) => undersized(name, source)),
  ], [], 'aucun texte HTML visible du bloc B ne doit descendre sous .75rem');

  assert.match(familyB, /--b-font-meta:\s*0\.8rem/);
  assert.match(familyB, /--b-font-control:\s*0\.82rem/);
  assert.match(familyB, /--b-font-body:\s*0\.92rem/);

  const source = Object.fromEntries(components.map((component) => [component.name, component.source]));
  const definedFontTokens = new Set(
    Array.from(`${global}\n${presentation}`.matchAll(/(--[\w-]+)\s*:/g), (match) => match[1]),
  );
  for (const { name, source: component } of components) {
    for (const declaration of component.matchAll(/\bfont\s*:\s*([^;}]+)/g)) {
      for (const token of declaration[1].matchAll(/var\((--[\w-]+)\)/g)) {
        assert.ok(definedFontTokens.has(token[1]), `${name}: token de font inconnu ${token[1]}`);
      }
    }
  }
  assert.match(familyB, /\.mission-board__steps li\s*{[^}]*font-size:\s*1rem/s);
  assert.match(familyB, /\.checkpoint-scene__checklist li\s*{[^}]*font-size:\s*var\(--b-font-body\)/s);
  assert.match(source.SetupDiagnostic, /\.setup__checklist label\s*{[^}]*var\(--b-font-control\)/s);
  assert.match(source.IpmtrLoop, /\.ipmtr__gates label\s*{[^}]*var\(--b-font-control\)/s);

  const allowedSvgPxSelectors = /(?:route|map|workspace|orbit|diagram|loop|gate-marker|transfer|anatomy|scope)/;
  for (const { name, source: component } of components) {
    for (const match of component.matchAll(/([^{}]+)\{([^{}]*\bfont\s*:[^;}]*\b\d+px\b[^{}]*)\}/g)) {
      assert.match(match[1], allowedSvgPxSelectors, `${name}: les tailles px sont réservées au texte SVG`);
    }
  }
});

test('Prompt et Setup restent intrinsèquement fluides', async () => {
  const [prompt, setup] = await Promise.all([
    read('src/components/presentation/visuals/b/PromptBuilder.astro'),
    read('src/components/presentation/visuals/b/SetupDiagnostic.astro'),
  ]);

  assert.match(prompt, /data-variant='blocks'[^}]*\.prompt__construction[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(prompt, /data-variant='builder'[^}]*\.prompt__construction[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(prompt, /\.prompt__blocks\s*{[^}]*repeat\(4,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(prompt, /\.prompt__blocks button\s*{[^}]*min-inline-size:\s*0/s);

  assert.match(setup, /<ol class="setup__route"/);
  assert.match(setup, /class="setup__route-label"/);
  assert.doesNotMatch(setup, /\.setup__route-label\s*{[^}]*display:\s*none/s);

});

test('les contenus longs du nouveau parcours B se contractent à 200 %', async () => {
  const [comparison, prioritizer, presentation] = await Promise.all([
    read('src/components/presentation/visuals/a/SolutionComparison.astro'),
    read('src/components/presentation/visuals/a/SolutionPrioritizer.astro'),
    read('src/styles/presentation.css'),
  ]);

  assert.match(
    comparison,
    /\.comparison__levels li\s*{[^}]*grid-template-columns:\s*2\.5rem minmax\(0,\s*\.75fr\) minmax\(0,\s*1\.1fr\) minmax\(0,\s*1fr\)/s,
  );
  assert.match(
    comparison,
    /\.comparison__need,\s*\.comparison__workflow,\s*\.comparison__ecosystems\s*{[^}]*min-inline-size:\s*0[^}]*overflow-wrap:\s*anywhere/s,
  );
  assert.match(
    prioritizer,
    /\.prioritizer__progress small\s*{[^}]*min-inline-size:\s*0[^}]*overflow-wrap:\s*anywhere/s,
  );
  assert.doesNotMatch(
    prioritizer,
    /\.prioritizer__progress small\s*{[^}]*(?:text-overflow:\s*ellipsis|white-space:\s*nowrap)/s,
  );
  assert.match(
    prioritizer,
    /\[data-solution-prioritizer\]:not\(\[data-enhanced='true'\]\)\s*{[^}]*display:\s*block[^}]*min-block-size:\s*0/s,
  );
  assert.match(
    prioritizer,
    /\[data-solution-prioritizer\]:not\(\[data-enhanced='true'\]\) \.prioritizer__scenario\s*{[^}]*align-content:\s*start[^}]*min-block-size:\s*0/s,
  );
  assert.match(
    presentation,
    /\.presentation-stage\[data-family="b"\] \.mission-board__outcome dt\s*{[^}]*line-height:\s*1\.25/s,
  );
});

test('enregistre tous les visuels du bloc C', async () => {
  const registry = await read('src/components/presentation/VisualRegistry.astro');
  for (const name of ['SkillAnatomy', 'McpConnectionMap', 'TriggerTimeline']) {
    assert.match(registry, new RegExp(name));
  }
});

test('les 16 routes spécialisées du bloc C choisissent leur vraie variante', async () => {
  const state = await import('../src/components/presentation/visuals/c/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc C doivent exister");

  const specialized = C_DECKS.flatMap((deck) => deck.slides)
    .filter((slide) => !['mission-board', 'checkpoint'].includes(slide.visual.key));
  assert.equal(specialized.length, 16);

  const expected = new Map<string, string>([
    ['c1-repeat', 'repeat'], ['c1-neighbors', 'neighbors'], ['c1-anatomy', 'anatomy'],
    ['c1-trigger', 'trigger'], ['c1-tests', 'tests'],
    ['c2-api', 'api'], ['c2-chain', 'chain'], ['c2-tools', 'tools'],
    ['c2-permissions', 'permissions'], ['c2-readonly', 'readonly'], ['c2-revoke', 'revoke'],
    ['c3-trigger', 'modes'], ['c3-hook', 'hook'], ['c3-schedule', 'schedule'],
    ['c3-guardrails', 'guardrails'], ['c3-pause', 'lifecycle'],
  ]);
  const resolvers = {
    'skill-anatomy': state.getSkillVariant,
    'mcp-connection-map': state.getMcpVariant,
    'trigger-timeline': state.getTriggerVariant,
  } as const;

  for (const slide of specialized) {
    const resolver = resolvers[slide.visual.key as keyof typeof resolvers];
    assert.equal(resolver?.(slide.visual.data), expected.get(slide.id), slide.id);
  }
});

test('les tests de Skill distinguent le bon déclenchement du silence attendu', async () => {
  const state = await import('../src/components/presentation/visuals/c/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc C doivent exister");
  const tests = C_DECKS.flatMap((deck) => deck.slides).find((slide) => slide.id === 'c1-tests');
  assert.ok(tests);
  const cases = tests.visual.data.cases as Array<{ type: string; expected: string }>;

  assert.deepEqual(state.skillCaseOutcome(cases[0]), {
    shouldTrigger: true,
    state: 'Déclenché',
    correct: true,
  });
  assert.deepEqual(state.skillCaseOutcome(cases[1]), {
    shouldTrigger: false,
    state: 'Silencieux',
    correct: true,
  });
});

test('la frontière MCP se ferme explicitement après révocation', async () => {
  const state = await import('../src/components/presentation/visuals/c/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc C doivent exister");

  assert.deepEqual(state.mcpBoundaryState(false, true), {
    connected: true,
    permission: 'Lecture seule',
    boundary: 'Ouverte avec permission minimale',
  });
  assert.deepEqual(state.mcpBoundaryState(true, true), {
    connected: false,
    permission: 'Aucun accès',
    boundary: 'Fermée · connexion révoquée',
  });
  assert.deepEqual(state.mcpInitialBoundary('revoke'), {
    connected: false,
    permission: 'Aucun accès',
    boundary: 'Fermée · connexion révoquée',
  });
  assert.deepEqual(state.mcpInitialBoundary('permissions'), {
    connected: true,
    permission: 'Lecture seule',
    boundary: 'Ouverte avec permission minimale',
  });
});

test('la portée MCP change la géométrie de frontière, pas seulement sa couleur', async () => {
  const mcp = await read('src/components/presentation/visuals/c/McpConnectionMap.astro');
  const minimal = mcp.match(/\[data-boundary-state='minimal'\]\s+\[data-mcp-boundary\]\s*\{([^}]*)\}/s)?.[1] ?? '';
  const broad = mcp.match(/\[data-boundary-state='broad'\]\s+\[data-mcp-boundary\]\s*\{([^}]*)\}/s)?.[1] ?? '';

  assert.match(minimal, /stroke-width/);
  assert.match(minimal, /stroke-dasharray/);
  assert.match(broad, /stroke-width/);
  assert.match(broad, /stroke-dasharray/);
  assert.notEqual(minimal.replace(/\s+/g, ' '), broad.replace(/\s+/g, ' '));
  assert.match(mcp, /FRONTIÈRE FERMÉE · RÉVOQUÉE/);
  assert.match(mcp, /Rétablir une connexion minimale/);
  assert.doesNotMatch(mcp, /variant === 'revoke'[\s\S]{0,200}Connexion active/);
});

test('chaque ligne Trigger utilise le payload réel ou un état non applicable', async () => {
  const state = await import('../src/components/presentation/visuals/c/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc C doivent exister");
  const slides = C_DECKS.flatMap((deck) => deck.slides);
  const data = (id: string) => slides.find((slide) => slide.id === id)?.visual.data ?? {};

  assert.deepEqual(state.triggerLaneLabels(data('c3-trigger')), {
    event: 'Fin d’une tâche', calendar: 'Vendredi 16 h',
  });
  assert.deepEqual(state.triggerLaneLabels(data('c3-hook')), {
    event: 'Stop', calendar: 'Non applicable',
  });
  assert.deepEqual(state.triggerLaneLabels(data('c3-schedule')), {
    event: 'Non applicable', calendar: 'Récurrent',
  });
  assert.deepEqual(state.triggerLaneLabels(data('c3-guardrails')), {
    event: 'Non applicable', calendar: 'Non applicable',
  });
  assert.deepEqual(state.triggerLaneLabels(data('c3-pause')), {
    event: 'Non applicable', calendar: 'Non applicable',
  });

  const trigger = await read('src/components/presentation/visuals/c/TriggerTimeline.astro');
  assert.doesNotMatch(trigger, /Événement Stop|Cadence validée|Vendredi 16 h/);
});

test('le cycle d’automatisation rend journal, pause et suppression observables', async () => {
  const state = await import('../src/components/presentation/visuals/c/visual-state').catch(() => null);
  assert.ok(state, "les helpers d’état du bloc C doivent exister");
  const lifecycle = ['Manuel', 'Actif', 'Surveillé', 'En pause', 'Supprimé'];

  assert.deepEqual(state.triggerLifecycleState(lifecycle, 0), {
    index: 0, state: 'Manuel', logVisible: false, paused: false, deleted: false,
  });
  assert.deepEqual(state.triggerLifecycleState(lifecycle, 2), {
    index: 2, state: 'Surveillé', logVisible: true, paused: false, deleted: false,
  });
  assert.deepEqual(state.triggerLifecycleState(lifecycle, 4), {
    index: 4, state: 'Supprimé', logVisible: true, paused: true, deleted: true,
  });
});

test('les visuels du bloc C sont progressifs, accessibles et décrivent leurs SVG', async () => {
  const files = await Promise.all([
    'SkillAnatomy', 'McpConnectionMap', 'TriggerTimeline',
  ].map((name) => read(`src/components/presentation/visuals/c/${name}.astro`))).catch(() => [] as string[]);

  assert.equal(files.length, 3);
  for (const file of files) {
    assert.match(file, /data-enhanced/);
    assert.match(file, /<button[^>]+type="button"[^>]+disabled/);
    assert.match(file, /<title[^>]*>/);
    assert.match(file, /<desc[^>]*>/);
    assert.match(file, /prefers-reduced-motion/);
    assert.doesNotMatch(file, /onclick=/);
  }
  assert.match(files[0], /Frontmatter|Description/);
  assert.match(files[0], /Procédure/);
  assert.match(files[0], /Sortie/);
  assert.match(files[1], /data-mcp-request-path/);
  assert.match(files[1], /data-mcp-response-path/);
  assert.match(files[1], /data-mcp-boundary/);
  assert.match(files[2], /data-trigger-lane="event"/);
  assert.match(files[2], /data-trigger-lane="calendar"/);
});

test('le sweep QA C couvre les 19 routes, le no-JS, le clavier et le mouvement réduit', async () => {
  const qa = await read('scripts/qa-block-c.mjs').catch(() => '');
  assert.match(qa, /routes\.length.*19|19\/19/s);
  assert.match(qa, /javaScriptEnabled:\s*false/);
  assert.match(qa, /reducedMotion:\s*'reduce'/);
  assert.match(qa, /keyboard|press\('Tab'\)|\.press\(/);
  assert.match(qa, /getBoundingClientRect/);
  assert.match(qa, /scrollWidth/);
  assert.match(qa, /fontSize/);
  assert.match(qa, /specializedRoutes/);
  assert.match(qa, /data-mcp-scope/);
  assert.match(qa, /strokeDasharray/);
  assert.match(qa, /data-trigger-hook/);
  assert.match(qa, /data-trigger-disable/);
  assert.match(qa, /Manuel/);
  assert.match(qa, /Récurrent/);
  assert.match(qa, /Surveillé/);
  assert.match(qa, /En pause/);
  assert.match(qa, /Supprimé/);
});
