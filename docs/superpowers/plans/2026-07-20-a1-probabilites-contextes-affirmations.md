# A1 Probabilités, Contextes et Affirmations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refaire trois slides A1 pour montrer automatiquement l'entraînement par prédiction, rendre l'effet du contexte non trivial et faire auditer cinq affirmations nuancées.

**Architecture:** Le manifeste A reste la source de toutes les données pédagogiques. `TokenPredictor.astro` conserve sa variante de génération actuelle et délègue la nouvelle variante d'entraînement à un composant `TrainingPlayback.astro` ciblé ; `ContextComparison.astro` et `VerificationAudit.astro` adaptent leurs variantes existantes sans créer de nouvelle clé dans le registre. Les transitions déterministes restent dans `visual-state.ts` afin d'être testées sans navigateur.

**Tech Stack:** Astro 7, TypeScript 6, HTML natif, CSS scoped, Node Test via `tsx --test`, Playwright pour la QA du présentateur.

## Global Constraints

- Le public est composé d'adultes débutants ; aucun détail sur les architectures neuronales ou la rétropropagation n'est ajouté.
- L'ouverture prédit uniquement le prochain token à partir du préfixe déjà révélé ; aucun masque ne suggère une prédiction arbitraire au milieu de la phrase.
- Les probabilités sont illustratives, leur somme vaut exactement 100 % à chaque étape et leur statut de simulation est visible.
- L'ouverture avance automatiquement ; un bouton natif permet seulement de mettre en pause ou de rejouer.
- Avec `prefers-reduced-motion` ou sans JavaScript, l'état final reste immédiatement lisible.
- La slide de contexte encode la relation `contexte → interprétation → suite` avec les branches maritime et informatique.
- Le checkpoint contient exactement cinq affirmations, chacune avec une catégorie et une explication.
- Aucun état ne dépend seulement de la couleur ; tous les contrôles ont un focus visible et les libellés secondaires restent à `0.75rem` minimum.
- Le fond, les couleurs et la hiérarchie continuent à respecter `.agents/skills/slide-visual-director/references/visual-contract.md`.

---

## File Map

- Create: `src/components/presentation/visuals/a/TrainingPlayback.astro` — rendu, lecture automatique, pause/rejeu et repli accessible de la démonstration d'entraînement.
- Modify: `src/components/presentation/visuals/a/TokenPredictor.astro` — détecter `trainingExample` et déléguer cette seule variante.
- Modify: `src/components/presentation/visuals/a/ContextComparison.astro` — afficher un contexte préparatoire, une interprétation et une suite concrète.
- Modify: `src/components/presentation/visuals/a/VerificationAudit.astro` — ajouter la variante `classification-sequence` sans modifier les variantes A5.
- Modify: `src/components/presentation/visuals/a/visual-state.ts` — exposer les transitions pures des deux nouvelles séquences.
- Modify: `src/presentation/manifests/a.ts` — remplacer les données, thèses, notes et descriptions des slides `a1-opening`, `a1-context` et `a1-plausible`.
- Modify: `tests/presentation-visuals.test.ts` — tester les états, contrôles natifs et replis statiques.
- Modify: `tests/presentation-content.test.ts` — verrouiller les nouvelles thèses A1 et le contenu des exemples.

---

### Task 1: Démonstration automatique de l'entraînement

**Files:**
- Create: `src/components/presentation/visuals/a/TrainingPlayback.astro`
- Modify: `src/components/presentation/visuals/a/TokenPredictor.astro:1-92`
- Modify: `src/components/presentation/visuals/a/visual-state.ts:1-13,44-48`
- Modify: `src/presentation/manifests/a.ts:64-91`
- Test: `tests/presentation-visuals.test.ts:143-265`
- Test: `tests/presentation-content.test.ts:11-18`

**Interfaces:**
- Consumes: `RoutedSlide`, `SceneFrame`, `onPresenterPage`, les variables CSS du mode présentation.
- Produces: `TrainingStep`, `TrainingPlaybackState`, `advanceTrainingPlayback(current, tokenCount)` et la donnée manifeste `trainingExample: { tokens, steps }`.

- [ ] **Step 1: écrire les tests d'état et de structure qui échouent**

Ajouter dans `tests/presentation-visuals.test.ts` :

```ts
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
});
```

Dans `tests/presentation-content.test.ts`, remplacer l'attente de `a1-opening` et ajouter les assertions de données :

```ts
{ id: 'a1-opening', claim: "À l'entraînement, le modèle apprend à prédire la suite.", visualKey: 'token-predictor' },
```

```ts
test("l'ouverture A1 fournit une distribution illustrative valide pour chaque token", () => {
  const opening = PRESENTATION_SLIDES.find((slide) => slide.id === 'a1-opening');
  const training = opening?.visual.data.trainingExample as {
    tokens: string[];
    steps: Array<{ target: string; candidates: Array<{ token: string; probability: number }> }>;
  };

  assert.equal(training.tokens.length, training.steps.length);
  training.steps.forEach((step, index) => {
    assert.equal(step.target, training.tokens[index]);
    assert.equal(step.candidates.reduce((sum, candidate) => sum + candidate.probability, 0), 100);
  });
});
```

- [ ] **Step 2: exécuter les tests ciblés et confirmer l'échec attendu**

Run: `npx tsx --test --test-name-pattern="démonstration d'entraînement|ouverture A1" tests/**/*.test.ts`

Expected: FAIL parce que `advanceTrainingPlayback`, `TrainingPlayback.astro` et `trainingExample` n'existent pas encore.

- [ ] **Step 3: ajouter la machine d'état minimale**

Ajouter dans `src/components/presentation/visuals/a/visual-state.ts` :

```ts
export type TrainingPhase = 'predict' | 'compare' | 'adjust';

export interface TrainingPlaybackState {
  tokenIndex: number;
  phase: TrainingPhase;
  complete: boolean;
}

export const advanceTrainingPlayback = (
  current: TrainingPlaybackState,
  tokenCount: number,
): TrainingPlaybackState => {
  if (tokenCount <= 0) return { tokenIndex: 0, phase: 'predict', complete: true };
  if (current.complete) return { tokenIndex: 0, phase: 'predict', complete: false };
  if (current.phase === 'predict') return { ...current, phase: 'compare' };
  if (current.phase === 'compare') return { ...current, phase: 'adjust' };
  if (current.tokenIndex >= tokenCount - 1) return { ...current, complete: true };
  return { tokenIndex: current.tokenIndex + 1, phase: 'predict', complete: false };
};
```

- [ ] **Step 4: remplacer les données de l'ouverture dans le manifeste**

Remplacer l'objet `a1-opening` dans `src/presentation/manifests/a.ts` par une slide dont les données centrales sont exactement :

```ts
claim: "À l'entraînement, le modèle apprend à prédire la suite.",
support: 'Il prédit un fragment, compare avec le texte attendu, puis ajuste ses paramètres.',
visual: {
  key: 'token-predictor',
  data: {
    interaction: 'Mettre en pause ou rejouer la démonstration.',
    trainingExample: {
      tokens: ['Le', ' soleil', ' réchauffe', ' doucement', ' la', ' pierre', '.'],
      steps: [
        { target: 'Le', candidates: [{ token: 'Le', probability: 52 }, { token: 'Un', probability: 31 }, { token: 'Cette', probability: 17 }] },
        { target: ' soleil', candidates: [{ token: ' soleil', probability: 64 }, { token: ' vent', probability: 23 }, { token: ' chat', probability: 13 }] },
        { target: ' réchauffe', candidates: [{ token: ' réchauffe', probability: 61 }, { token: ' éclaire', probability: 25 }, { token: ' frappe', probability: 14 }] },
        { target: ' doucement', candidates: [{ token: ' doucement', probability: 44 }, { token: ' encore', probability: 33 }, { token: ' lentement', probability: 23 }] },
        { target: ' la', candidates: [{ token: ' la', probability: 70 }, { token: ' une', probability: 20 }, { token: ' cette', probability: 10 }] },
        { target: ' pierre', candidates: [{ token: ' pierre', probability: 58 }, { token: ' pièce', probability: 27 }, { token: ' terre', probability: 15 }] },
        { target: '.', candidates: [{ token: '.', probability: 76 }, { token: ' chaude', probability: 14 }, { token: ' grise', probability: 10 }] },
      ],
    },
  },
},
speaker: {
  durationMinutes: 2,
  notes: "Laisser jouer une boucle complète. Préciser que les scores sont illustratifs et qu'en pratique un token peut être un fragment ou un signe.",
  transition: 'À la génération, la même prédiction est réutilisée sans phrase cible fournie.',
},
accessibleDescription: "Une phrase cible se révèle automatiquement. À chaque étape, le modèle simule trois suites, compare sa prédiction au token attendu, puis ajuste ses paramètres.",
```

Conserver les liens existants vers le concept durable et la présentation de Claude.

- [ ] **Step 5: créer le rendu Astro complet de la variante d'entraînement**

Créer `TrainingPlayback.astro` avec ces contrats précis :

```astro
---
import type { RoutedSlide } from '../../../../presentation/presentation-model';

interface Candidate { token: string; probability: number; }
interface TrainingStep { target: string; candidates: Candidate[]; }
interface Props { slide: RoutedSlide; }

const { slide } = Astro.props;
const training = slide.visual.data.trainingExample as { tokens: string[]; steps: TrainingStep[] };
const descriptionId = `${slide.id}-training-description`;
---

<div
  class="training-playback"
  data-training-playback
  data-tokens={JSON.stringify(training.tokens)}
  data-steps={JSON.stringify(training.steps)}
  aria-describedby={descriptionId}
>
  <p id={descriptionId} class="visually-hidden">
    Phrase cible : {training.tokens.join('')}. Les probabilités affichées sont une simulation pédagogique.
  </p>

  <div class="training-playback__target">
    <p class="scene-label">Phrase cible de l'exemple d'entraînement</p>
    <p class="training-playback__sentence" aria-hidden="true">
      {training.tokens.map((token, index) => (
        <span data-training-token data-token-index={index}>{token}</span>
      ))}
    </p>
  </div>

  <section class="training-playback__prediction" aria-live="polite">
    <p class="scene-label">Simulation pédagogique · probabilités illustratives</p>
    <p data-training-context>Contexte : début de phrase</p>
    <ol data-training-candidates>
      {training.steps[0]?.candidates.map((candidate) => (
        <li><strong>{candidate.token}</strong><span>{candidate.probability} %</span></li>
      ))}
    </ol>
    <output data-training-status>Prédire le prochain token</output>
  </section>

  <ol class="training-playback__cycle" aria-label="Cycle d'entraînement">
    <li data-training-phase="predict"><span>01</span><strong>Prédire</strong></li>
    <li data-training-phase="compare"><span>02</span><strong>Comparer</strong></li>
    <li data-training-phase="adjust"><span>03</span><strong>Ajuster</strong></li>
  </ol>

  <button type="button" data-training-toggle disabled>Mettre en pause</button>
</div>

<script>
  import { advanceTrainingPlayback, type TrainingPlaybackState } from './visual-state';
  import { onPresenterPage } from '../../../../scripts/on-presenter-page';

  onPresenterPage(() => {
    document.querySelectorAll<HTMLElement>('[data-training-playback]').forEach((scene) => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tokens = JSON.parse(scene.dataset.tokens ?? '[]') as string[];
      const steps = JSON.parse(scene.dataset.steps ?? '[]') as Array<{
        target: string;
        candidates: Array<{ token: string; probability: number }>;
      }>;
      const tokenNodes = Array.from(scene.querySelectorAll<HTMLElement>('[data-training-token]'));
      const phaseNodes = Array.from(scene.querySelectorAll<HTMLElement>('[data-training-phase]'));
      const candidates = scene.querySelector<HTMLOListElement>('[data-training-candidates]');
      const context = scene.querySelector<HTMLElement>('[data-training-context]');
      const status = scene.querySelector<HTMLOutputElement>('[data-training-status]');
      const toggle = scene.querySelector<HTMLButtonElement>('[data-training-toggle]');
      if (!tokens.length || !steps.length || !candidates || !context || !status || !toggle) return;

      if (reducedMotion) {
        scene.dataset.complete = 'true';
        tokenNodes.forEach((node) => { node.dataset.revealed = 'true'; });
        phaseNodes.forEach((node) => { node.dataset.active = 'true'; });
        status.textContent = 'Phrase complète · prédire → comparer → ajuster';
        toggle.hidden = true;
        return;
      }

      scene.dataset.enhanced = 'true';
      let state: TrainingPlaybackState = { tokenIndex: 0, phase: 'predict', complete: false };
      let paused = false;
      let timer = 0;

      const render = () => {
        tokenNodes.forEach((node, index) => {
          node.dataset.revealed = String(state.complete || index < state.tokenIndex || state.phase === 'adjust' && index === state.tokenIndex);
          node.dataset.active = String(!state.complete && index === state.tokenIndex);
        });
        phaseNodes.forEach((node) => { node.dataset.active = String(state.complete || node.dataset.trainingPhase === state.phase); });
        const step = steps[state.tokenIndex];
        context.textContent = state.tokenIndex === 0
          ? 'Contexte : début de phrase'
          : `Contexte : ${tokens.slice(0, state.tokenIndex).join('')}`;
        candidates.innerHTML = step.candidates
          .map((candidate) => `<li><strong>${candidate.token}</strong><span>${candidate.probability} %</span></li>`)
          .join('');
        status.textContent = state.complete
          ? 'Phrase complète · le cycle ajuste le modèle'
          : state.phase === 'predict'
            ? 'Prédire le prochain token'
            : state.phase === 'compare'
              ? `Comparer avec le token attendu : ${step.target}`
              : `Ajuster à partir de l'écart`;
        scene.dataset.complete = String(state.complete);
      };

      const schedule = () => {
        window.clearTimeout(timer);
        if (paused) return;
        timer = window.setTimeout(() => {
          state = advanceTrainingPlayback(state, tokens.length);
          render();
          schedule();
        }, state.complete ? 2200 : 1200);
      };

      toggle.disabled = false;
      toggle.addEventListener('click', () => {
        paused = !paused;
        toggle.textContent = paused ? 'Rejouer la démonstration' : 'Mettre en pause';
        if (!paused) schedule();
        else window.clearTimeout(timer);
      });
      render();
      schedule();
    });
  });
</script>
```

Ajouter le CSS scoped suivant ; le masque ne s'active qu'après `data-enhanced`, donc l'état HTML sans JavaScript reste complet :

```css
.training-playback {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(15rem, .85fr);
  gap: clamp(.8rem, 2vw, 1.6rem);
  align-items: center;
  min-block-size: 100%;
}

.training-playback__target { grid-column: 1 / -1; }
.training-playback__sentence {
  display: flex;
  flex-wrap: wrap;
  margin: .35rem 0 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 1.45rem + 2vw, 3.8rem);
  font-weight: 760;
  letter-spacing: -.045em;
  line-height: 1;
}

.training-playback__sentence span {
  position: relative;
  padding: .06em .03em;
  transition: color 180ms ease, background-color 180ms ease;
}

[data-enhanced='true'] .training-playback__sentence span:not([data-revealed='true']) {
  border-radius: .12em;
  background: color-mix(in srgb, var(--presentation-ink), transparent 86%);
  color: transparent;
}

.training-playback__sentence span[data-active='true'] {
  outline: .12em solid var(--family-accent);
  outline-offset: .05em;
}

.training-playback__prediction {
  display: grid;
  gap: .45rem;
  padding: .8rem;
  border-inline-start: .35rem solid var(--family-accent);
  background: var(--presentation-surface);
}

.training-playback__prediction p,
.training-playback__prediction output { margin: 0; }
.training-playback__prediction ol { display: grid; margin: 0; padding: 0; list-style: none; }
.training-playback__prediction li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: .3rem;
  border-block-start: 1px solid var(--presentation-line);
}
.training-playback__prediction span,
.training-playback__prediction output { font-family: var(--font-mono); font-size: .82rem; }

.training-playback__cycle {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}
.training-playback__cycle li {
  display: grid;
  gap: .2rem;
  padding: .55rem;
  border-block-start: .18rem solid var(--presentation-line);
}
.training-playback__cycle li[data-active='true'] {
  border-block-start-width: .38rem;
  border-color: var(--family-accent);
  background: color-mix(in srgb, var(--family-accent), transparent 84%);
}
.training-playback__cycle span { font-family: var(--font-mono); font-size: .78rem; }

.training-playback button {
  grid-column: 1 / -1;
  justify-self: start;
  min-block-size: 2.75rem;
  padding: .45rem .95rem;
  border: 2px solid var(--presentation-ink);
  background: var(--presentation-ink);
  color: var(--presentation-surface);
  font-weight: 750;
}
.training-playback button:focus-visible { outline: .25rem solid var(--family-accent); outline-offset: .18rem; }

@media (max-width: 52rem) {
  .training-playback { grid-template-columns: 1fr; }
  .training-playback__target,
  .training-playback button { grid-column: 1; }
  .training-playback__cycle { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .training-playback *, .training-playback *::before, .training-playback *::after { transition: none !important; }
}
```

- [ ] **Step 6: déléguer depuis `TokenPredictor.astro` sans casser la variante existante**

Importer `TrainingPlayback`, calculer `const hasTrainingExample = typeof data.trainingExample === 'object' && data.trainingExample !== null`, puis insérer cette ouverture juste avant l'actuel `<div class="token-predictor__scene">` :

```astro
{hasTrainingExample ? (
  <TrainingPlayback slide={slide} />
) : (
```

Insérer ensuite cette fermeture immédiatement après la fermeture de l'actuel `div.token-predictor__scene` :

```astro
)}
```

Le contenu génération actuellement compris entre les lignes 38 et 89 reste inchangé à l'intérieur de la branche `else`.

Ne pas déplacer ni modifier le script existant `[data-token-predictor]` : il doit simplement ignorer la nouvelle scène, qui utilise `[data-training-playback]`.

- [ ] **Step 7: exécuter les tests ciblés et le typecheck**

Run: `npx tsx --test --test-name-pattern="démonstration d'entraînement|ouverture A1|interactions du bloc A" tests/**/*.test.ts`

Expected: PASS pour tous les tests sélectionnés.

Run: `npm run typecheck`

Expected: `0 errors`.

- [ ] **Step 8: committer le livrable entraînement**

```bash
git add src/components/presentation/visuals/a/TrainingPlayback.astro src/components/presentation/visuals/a/TokenPredictor.astro src/components/presentation/visuals/a/visual-state.ts src/presentation/manifests/a.ts tests/presentation-visuals.test.ts tests/presentation-content.test.ts
git commit -m "feat: illustrer l entraînement probabiliste dans A1"
```

---

### Task 2: Comparaison de contextes sémantiques

**Files:**
- Modify: `src/components/presentation/visuals/a/ContextComparison.astro:1-213`
- Modify: `src/presentation/manifests/a.ts:113-138`
- Test: `tests/presentation-visuals.test.ts:235-266`
- Test: `tests/presentation-content.test.ts:11-18`

**Interfaces:**
- Consumes: `contexts` depuis le manifeste et le comportement existant `aria-pressed` / panneaux.
- Produces: `ContextOption { label, leadIn, interpretation, completion }` et le rendu `contexte → interprétation → suite`.

- [ ] **Step 1: écrire les tests de contenu et de repli statique qui échouent**

Ajouter à `tests/presentation-visuals.test.ts` :

```ts
test('la comparaison A1 relie contexte, interprétation et suite sans JavaScript', async () => {
  const context = await read('src/components/presentation/visuals/a/ContextComparison.astro');

  assert.match(context, /context\.leadIn/);
  assert.match(context, /context\.interpretation/);
  assert.match(context, /context\.completion/);
  assert.match(context, /data-context-panel/);
  assert.match(context, /aria-pressed/);
});
```

Dans `tests/presentation-content.test.ts`, remplacer l'attente de thèse :

```ts
{ id: 'a1-context', claim: 'Le contexte change le sens avant de changer les mots.', visualKey: 'context-comparison' },
```

Puis ajouter :

```ts
test('A1 résout la même amorce dans deux univers sémantiques', () => {
  const contextSlide = PRESENTATION_SLIDES.find((slide) => slide.id === 'a1-context');
  assert.equal(contextSlide?.visual.data.sharedPrompt, 'Le navigateur a ouvert…');
  assert.deepEqual(contextSlide?.visual.data.contexts, [
    {
      label: 'En mer',
      leadIn: "Le vent se lève, l'équipage quitte le port.",
      interpretation: 'Un membre de l’équipage',
      completion: 'les voiles',
    },
    {
      label: 'Sur ordinateur',
      leadIn: 'La page ne répond plus, il relance Chrome.',
      interpretation: 'Le logiciel de navigation',
      completion: 'un nouvel onglet',
    },
  ]);
});
```

- [ ] **Step 2: lancer les tests ciblés et confirmer l'échec**

Run: `npx tsx --test --test-name-pattern="comparaison A1|univers sémantiques" tests/**/*.test.ts`

Expected: FAIL sur les anciens champs `audience`, `constraints` et `vocabulary`.

- [ ] **Step 3: remplacer les données `a1-context`**

Dans `src/presentation/manifests/a.ts`, utiliser exactement :

```ts
claim: 'Le contexte change le sens avant de changer les mots.',
support: 'Le même début de phrase active une interprétation différente selon ce qui le précède.',
visual: {
  key: 'context-comparison',
  data: {
    interaction: 'Basculer entre les deux contextes.',
    sharedPrompt: 'Le navigateur a ouvert…',
    contexts: [
      {
        label: 'En mer',
        leadIn: "Le vent se lève, l'équipage quitte le port.",
        interpretation: 'Un membre de l’équipage',
        completion: 'les voiles',
      },
      {
        label: 'Sur ordinateur',
        leadIn: 'La page ne répond plus, il relance Chrome.',
        interpretation: 'Le logiciel de navigation',
        completion: 'un nouvel onglet',
      },
    ],
    observation: 'Même amorce, deux sens, deux suites plausibles',
  },
},
speaker: {
  durationMinutes: 2,
  notes: 'Afficher les deux branches et faire nommer le sens du mot « navigateur » avant de révéler chaque suite.',
  transition: 'Une suite adaptée au contexte peut encore être fausse ou incohérente.',
},
accessibleDescription: 'Le début « Le navigateur a ouvert… » devient « les voiles » après un contexte maritime et « un nouvel onglet » après un contexte informatique.',
```

- [ ] **Step 4: réécrire le modèle de panneau dans `ContextComparison.astro`**

Remplacer l'interface et le contenu de chaque panneau par :

```astro
interface ContextOption {
  label: string;
  leadIn: string;
  interpretation: string;
  completion: string;
}
```

```astro
<section id={`${laneId}-${index}`} class="context-comparison__lane" data-context-panel={index}>
  <p class="scene-label">Contexte précédent</p>
  <p class="context-comparison__lead-in">{context.leadIn}</p>
  <p class="context-comparison__meaning">
    <span>Interprétation</span>
    <strong>{context.interpretation}</strong>
  </p>
  <p class="context-comparison__prediction">
    <span>{String(data.sharedPrompt ?? '')}</span>
    <mark>{context.completion}</mark>
  </p>
</section>
```

Les boutons utilisent `context.label`. Remplacer les règles propres aux anciens `dl`, `dt` et `dd` par les règles suivantes :

Dans la source, remplacer aussi le libellé `Même demande` par `Même amorce` :

```astro
<p class="scene-label">Même amorce</p>
```

```css
.context-comparison__lanes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .7rem;
  min-inline-size: 0;
}
[data-enhanced='true'] .context-comparison__lanes { grid-template-columns: 1fr; }
.context-comparison__lane[hidden] { display: none; }

.context-comparison__lane {
  display: grid;
  gap: .65rem;
  align-content: center;
  min-inline-size: 0;
  padding: clamp(.8rem, 1.8vw, 1.4rem);
  border-inline-start: .35rem solid var(--family-accent);
  background: color-mix(in srgb, var(--family-accent), transparent 86%);
}
.context-comparison__lead-in { margin: 0; font-size: clamp(.95rem, .88rem + .25vw, 1.1rem); }
.context-comparison__meaning {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: .5rem;
  margin: 0;
  padding-block: .45rem;
  border-block: 1px solid var(--presentation-line);
}
.context-comparison__meaning span {
  color: var(--presentation-muted);
  font-family: var(--font-mono);
  font-size: .78rem;
  text-transform: uppercase;
}
.context-comparison__prediction {
  display: flex;
  flex-wrap: wrap;
  gap: .35rem;
  align-items: baseline;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 1rem + .5vw, 1.55rem);
  font-weight: 720;
}
.context-comparison__prediction mark {
  padding: .08em .2em;
  background: var(--family-accent);
  color: var(--presentation-ink);
}

@media (max-width: 52rem) {
  .context-comparison__scene { grid-template-columns: 1fr; grid-template-rows: auto; }
  .context-comparison__lanes { grid-template-columns: 1fr; }
  .context-comparison__meaning { grid-template-columns: 1fr; }
}
```

Conserver les styles de la source, du connecteur, des boutons et de l'observation qui ne ciblent pas les anciens champs.

- [ ] **Step 5: exécuter les tests ciblés et vérifier le typecheck**

Run: `npx tsx --test --test-name-pattern="comparaison A1|univers sémantiques|contrôles natifs" tests/**/*.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: `0 errors`.

- [ ] **Step 6: committer le livrable contexte**

```bash
git add src/components/presentation/visuals/a/ContextComparison.astro src/presentation/manifests/a.ts tests/presentation-visuals.test.ts tests/presentation-content.test.ts
git commit -m "feat: rendre l effet du contexte visible dans A1"
```

---

### Task 3: Checkpoint séquentiel à cinq affirmations

**Files:**
- Modify: `src/components/presentation/visuals/a/VerificationAudit.astro:6-194`
- Modify: `src/components/presentation/visuals/a/visual-state.ts:15-27,49-52`
- Modify: `src/presentation/manifests/a.ts:139-161`
- Test: `tests/presentation-visuals.test.ts:143-265`
- Test: `tests/presentation-content.test.ts:11-18`

**Interfaces:**
- Consumes: les variantes existantes `classification`, `statements`, `biases`, `risk`, `method` sans en modifier le comportement.
- Produces: la variante `classification-sequence`, `ClassificationStatement { text, answer, reason }` et `advanceClassificationSequence(current, count)`.

- [ ] **Step 1: écrire les tests de variante, progression et accessibilité qui échouent**

Dans `tests/presentation-visuals.test.ts`, mettre à jour l'attente de variante A1 et ajouter les tests :

```ts
assert.equal(state.getVerificationVariant(data('a1-plausible')), 'classification-sequence');
```

```ts
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
```

Dans `tests/presentation-content.test.ts`, remplacer la thèse attendue et ajouter l'inventaire :

```ts
{ id: 'a1-plausible', claim: 'Probable, cohérent et vrai ne désignent pas la même chose.', visualKey: 'verification-audit' },
```

```ts
test('le checkpoint A1 contient les cinq affirmations nuancées validées', () => {
  const checkpoint = PRESENTATION_SLIDES.find((slide) => slide.id === 'a1-plausible');
  const statements = checkpoint?.visual.data.statements as Array<{ text: string; answer: string; reason: string }>;
  assert.equal(statements.length, 5);
  assert.deepEqual(statements.map(({ answer }) => answer), ['Exacte', 'À vérifier', 'Exacte', 'Exacte', 'Exacte']);
  statements.forEach(({ text, reason }) => {
    assert.ok(text.length > 40);
    assert.ok(reason.length > 60);
  });
});
```

- [ ] **Step 2: exécuter les tests ciblés et confirmer l'échec**

Run: `npx tsx --test --test-name-pattern="checkpoint A1|visuels polymorphes" tests/**/*.test.ts`

Expected: FAIL parce que la variante et sa progression n'existent pas.

- [ ] **Step 3: ajouter la variante et son état pur**

Dans `visual-state.ts`, modifier le type et la détection :

```ts
export type VerificationVariant =
  | 'classification'
  | 'classification-sequence'
  | 'statements'
  | 'biases'
  | 'risk'
  | 'method';

export const getVerificationVariant = (data: VisualData): VerificationVariant => {
  if (Array.isArray(data.buckets) && Array.isArray(data.statements)) return 'classification-sequence';
  if (Array.isArray(data.buckets)) return 'classification';
  if (Array.isArray(data.statements)) return 'statements';
  if (Array.isArray(data.biases)) return 'biases';
  if (Array.isArray(data.scale)) return 'risk';
  return 'method';
};

export const advanceClassificationSequence = (current: number, count: number) =>
  count <= 0 ? 0 : Math.min(Math.max(0, current + 1), count - 1);
```

- [ ] **Step 4: remplacer les données du checkpoint dans le manifeste**

Utiliser les catégories et explications exactes suivantes :

```ts
claim: 'Probable, cohérent et vrai ne désignent pas la même chose.',
support: 'Cinq propriétés contre-intuitives séparent la génération linguistique de la preuve.',
visual: {
  key: 'verification-audit',
  data: {
    interaction: 'Classer chaque affirmation puis afficher sa nuance.',
    buckets: ['Exacte', 'Simplifiée', 'À vérifier'],
    statements: [
      {
        text: "Une erreur souvent répétée peut être plus probable qu'une vérité rarement formulée.",
        answer: 'Exacte',
        reason: 'La fréquence des formulations influence la plausibilité statistique ; elle ne constitue pas une preuve.',
      },
      {
        text: "Le mot généré n'est pas nécessairement celui qui avait la probabilité la plus élevée.",
        answer: 'À vérifier',
        reason: "Cela dépend du décodage : l'échantillonnage peut retenir un token moins probable ; le décodage glouton choisit le premier.",
      },
      {
        text: 'Répéter une information dans le contexte peut renforcer son influence sans la rendre plus vraie.',
        answer: 'Exacte',
        reason: 'La répétition renforce le signal présent dans le contexte, sans modifier la réalité extérieure.',
      },
      {
        text: "Quand un LLM justifie sa réponse, il ne restitue pas forcément le calcul qui l'a réellement produite.",
        answer: 'Exacte',
        reason: "Une justification générée peut être utile, mais elle n'est pas une lecture garantie des opérations internes du modèle.",
      },
      {
        text: 'Des mots plausibles pris un par un ne garantissent pas une réponse cohérente dans son ensemble.',
        answer: 'Exacte',
        reason: 'La prédiction est locale ; la cohérence globale doit encore être construite et contrôlée sur toute la réponse.',
      },
    ],
  },
},
speaker: {
  durationMinutes: 3,
  notes: 'Faire voter avant chaque correction. Ne pas annoncer que quatre affirmations sur cinq sont exactes : le déséquilibre est volontairement contre-intuitif.',
  transition: 'Mettons ces distinctions en pratique sur une réponse produite par Claude.',
},
accessibleDescription: 'Cinq affirmations sur fréquence, échantillonnage, répétition, justification et cohérence sont classées puis expliquées une par une.',
```

- [ ] **Step 5: ajouter la branche `classification-sequence` dans `VerificationAudit.astro`**

Étendre le type local :

```ts
interface ClassificationStatement {
  text: string;
  answer: string;
  reason: string;
}

const classificationStatements = Array.isArray(data.statements)
  ? data.statements as ClassificationStatement[]
  : [];
```

Ajouter avant la branche `classification` :

```astro
{variant === 'classification-sequence' && (
  <section class="audit__classification-sequence">
    <p class="scene-label">Affirmation <span data-sequence-index>1</span> / {classificationStatements.length}</p>
    <div class="audit__sequence-panels">
      {classificationStatements.map((statement, statementIndex) => (
        <article data-sequence-panel={statementIndex}>
          <blockquote>{statement.text}</blockquote>
          <fieldset aria-describedby={`${resultId}-${statementIndex}`}>
            <legend>{String(data.interaction ?? 'Choisir une catégorie')}</legend>
            <div class="audit__choices">
              {buckets.map((bucket, bucketIndex) => (
                <label>
                  <input type="radio" name={`${slide.id}-${statementIndex}`} value={bucket} data-sequence-choice />
                  <span>{String(bucketIndex + 1).padStart(2, '0')}</span>
                  <strong>{bucket}</strong>
                </label>
              ))}
            </div>
            <button type="button" disabled data-sequence-reveal>Afficher la correction</button>
            <output
              id={`${resultId}-${statementIndex}`}
              hidden
              data-sequence-result
              data-answer={statement.answer}
              data-reason={statement.reason}
              aria-live="polite"
            ></output>
          </fieldset>
        </article>
      ))}
    </div>
    <button type="button" disabled data-sequence-next>Affirmation suivante</button>
    <details class="audit__sequence-fallback">
      <summary>Afficher les cinq corrections</summary>
      <ol>
        {classificationStatements.map((statement) => (
          <li><strong>{statement.answer}</strong><span>{statement.text}</span><p>{statement.reason}</p></li>
        ))}
      </ol>
    </details>
  </section>
)}
```

Remplacer l'import du helper d'état par :

```ts
import { advanceClassificationSequence, resolvePanelVisibility } from './visual-state';
```

Puis insérer cette branche avant la branche `classification` existante du script :

```ts
if (variant === 'classification-sequence') {
  const panels = Array.from(scene.querySelectorAll<HTMLElement>('[data-sequence-panel]'));
  const next = scene.querySelector<HTMLButtonElement>('[data-sequence-next]');
  const indexLabel = scene.querySelector<HTMLElement>('[data-sequence-index]');
  const fallback = scene.querySelector<HTMLDetailsElement>('.audit__sequence-fallback');
  if (!panels.length || !next || !indexLabel) return;

  scene.dataset.enhanced = 'true';
  if (fallback) fallback.hidden = true;
  let active = 0;

  const renderPanel = () => {
    panels.forEach((panel, index) => { panel.hidden = index !== active; });
    indexLabel.textContent = String(active + 1);
    next.disabled = true;
    next.textContent = active === panels.length - 1
      ? 'Rejouer le checkpoint'
      : 'Affirmation suivante';

    const panel = panels[active];
    const choices = Array.from(panel.querySelectorAll<HTMLInputElement>('[data-sequence-choice]'));
    const reveal = panel.querySelector<HTMLButtonElement>('[data-sequence-reveal]');
    const result = panel.querySelector<HTMLOutputElement>('[data-sequence-result]');
    choices.forEach((choice) => { choice.checked = false; });
    if (reveal) reveal.disabled = true;
    if (result) result.hidden = true;
  };

  panels.forEach((panel) => {
    const choices = Array.from(panel.querySelectorAll<HTMLInputElement>('[data-sequence-choice]'));
    const reveal = panel.querySelector<HTMLButtonElement>('[data-sequence-reveal]');
    const result = panel.querySelector<HTMLOutputElement>('[data-sequence-result]');
    if (!reveal || !result) return;

    choices.forEach((choice) => choice.addEventListener('change', () => {
      reveal.disabled = false;
      result.hidden = true;
      next.disabled = true;
    }));

    reveal.addEventListener('click', () => {
      const selected = choices.find((choice) => choice.checked)?.value;
      if (!selected) return;
      const answer = result.dataset.answer ?? '';
      const reason = result.dataset.reason ?? '';
      result.textContent = selected === answer
        ? `Correct · ${answer}. ${reason}`
        : `À revoir · la réponse attendue est « ${answer} ». ${reason}`;
      result.hidden = false;
      next.disabled = false;
    });
  });

  next.addEventListener('click', () => {
    active = active === panels.length - 1
      ? 0
      : advanceClassificationSequence(active, panels.length);
    renderPanel();
  });

  renderPanel();
  return;
}
```

Ajouter les règles scoped suivantes :

```css
.audit__classification-sequence {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .65rem 1rem;
  align-content: center;
  min-block-size: 0;
}
.audit__classification-sequence > .scene-label,
.audit__sequence-panels { grid-column: 1 / -1; }
.audit__sequence-panels article { display: grid; grid-template-columns: minmax(0, .9fr) minmax(18rem, 1.1fr); gap: clamp(1rem, 3vw, 3rem); align-items: center; }
.audit__sequence-panels blockquote {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 1rem + .75vw, 1.8rem);
  font-weight: 720;
  line-height: 1.08;
}
.audit__sequence-panels fieldset { display: grid; gap: .45rem; margin: 0; padding: 0; border: 0; }
.audit__classification-sequence button {
  justify-self: start;
  min-block-size: 2.75rem;
  padding: .45rem .95rem;
  border: 2px solid var(--presentation-ink);
  background: var(--presentation-ink);
  color: var(--presentation-surface);
  font: 700 .95rem var(--font-display);
}
.audit__classification-sequence button:disabled { opacity: .45; cursor: not-allowed; }
.audit__classification-sequence button:focus-visible,
.audit__classification-sequence input:focus-visible { outline: .25rem solid var(--family-accent); outline-offset: .18rem; }
.audit__classification-sequence output {
  padding: .55rem .7rem;
  border-inline-start: .3rem solid var(--family-accent);
  background: var(--presentation-surface);
  font-size: .85rem;
  font-weight: 680;
}
.audit__sequence-fallback { grid-column: 1 / -1; font-size: .82rem; }
.audit__sequence-fallback li { margin-block: .5rem; }
.audit__sequence-fallback span { display: block; font-weight: 700; }
.audit__sequence-fallback p { margin: .2rem 0 0; }
[data-sequence-panel][hidden], [data-sequence-result][hidden] { display: none !important; }

@media (max-width: 52rem) {
  .audit__sequence-panels article { grid-template-columns: 1fr; }
  .audit__choices { grid-template-columns: 1fr; }
}
```

- [ ] **Step 6: exécuter les tests ciblés, la suite A et le typecheck**

Run: `npx tsx --test --test-name-pattern="checkpoint A1|visuels polymorphes|progression conserve|contrôles natifs" tests/**/*.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: `0 errors`.

- [ ] **Step 7: committer le checkpoint**

```bash
git add src/components/presentation/visuals/a/VerificationAudit.astro src/components/presentation/visuals/a/visual-state.ts src/presentation/manifests/a.ts tests/presentation-visuals.test.ts tests/presentation-content.test.ts
git commit -m "feat: enrichir le checkpoint probabiliste A1"
```

---

### Task 4: Vérification intégrée, responsive et accessible

**Files:**
- Modify if a defect is found: `src/components/presentation/visuals/a/TrainingPlayback.astro`
- Modify if a defect is found: `src/components/presentation/visuals/a/ContextComparison.astro`
- Modify if a defect is found: `src/components/presentation/visuals/a/VerificationAudit.astro`
- Modify if a regression is found: `tests/presentation-visuals.test.ts`
- Modify if a regression is found: `tests/presentation-content.test.ts`

**Interfaces:**
- Consumes: les trois livrables A1 terminés et les scripts de QA existants.
- Produces: un build vert et un résultat documenté pour les tests silencieux, coup d'œil et nécessité.

- [ ] **Step 1: exécuter tous les tests automatisés**

Run: `npm test`

Expected: tous les tests passent, aucun test A2–C3 ne régresse.

- [ ] **Step 2: exécuter les contrôles de contenu et de présentation**

Run: `npm run content:check && npm run presentation:check`

Expected: les deux commandes terminent avec le code `0` et ne signalent aucune route, ancre ou donnée de slide invalide.

- [ ] **Step 3: construire le site**

Run: `npm run build`

Expected: `astro build` termine avec succès après le typecheck.

- [ ] **Step 4: vérifier le présentateur dans les trois conditions visuelles**

Lancer `npm run dev -- --host 127.0.0.1`, puis ouvrir successivement :

```text
http://127.0.0.1:4321/presenter/a1/a1-opening
http://127.0.0.1:4321/presenter/a1/a1-context
http://127.0.0.1:4321/presenter/a1/a1-plausible
```

Vérifier à `1440 × 900`, puis `390 × 844`, puis avec mouvement réduit :

- ouverture : l'ordre visuel est phrase cible → probabilités → cycle ; aucun mot futur n'est lisible avant révélation ; pause/rejeu fonctionne au clavier ; mouvement réduit montre immédiatement la phrase entière ;
- contexte : l'amorce commune reste stable ; chaque bouton change simultanément contexte, interprétation et suite ; les deux branches sont lisibles dans le HTML sans amélioration ;
- checkpoint : une seule affirmation domine à la fois ; choix, correction et passage à la suivante sont possibles au clavier ; les cinq corrections restent accessibles dans `details` sans JavaScript ;
- aucune scène ne déborde, aucun texte informatif n'est sous 12 px au zoom 100 %, les halos restent périphériques.

Expected: les tests silencieux, coup d'œil et nécessité passent pour chacune des trois slides.

- [ ] **Step 5: lancer les QA durables existantes**

Run: `npm run qa:presenter && npm run qa:font-floor`

Expected: aucune collision de navigation, aucun débordement bloquant et aucun texte sous le plancher défini.

- [ ] **Step 6: corriger uniquement les défauts observés et relancer la vérification concernée**

Pour chaque défaut, ajouter d'abord une assertion reproductible dans `tests/presentation-visuals.test.ts` ou `tests/presentation-content.test.ts`, vérifier qu'elle échoue, appliquer le correctif minimal dans le composant concerné, puis relancer le test ciblé et `npm run build`.

- [ ] **Step 7: committer les ajustements de QA, seulement s'il y en a**

```bash
git add src/components/presentation/visuals/a/TrainingPlayback.astro src/components/presentation/visuals/a/ContextComparison.astro src/components/presentation/visuals/a/VerificationAudit.astro tests/presentation-visuals.test.ts tests/presentation-content.test.ts
git commit -m "fix: finaliser la lisibilité des slides A1"
```

Si aucune correction n'est nécessaire, ne créer aucun commit vide.
