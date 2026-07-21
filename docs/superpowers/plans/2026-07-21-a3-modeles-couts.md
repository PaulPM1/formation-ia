# A3 Models and Costs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five dense A3 slides with three accessible, responsive slides that help participants choose a model tier, calculate a concrete API cost, and decide between subscription and API access.

**Architecture:** Add one A-family visual, `ModelCostGuide.astro`, with three explicit variants selected by `visual.data.variant`: model decision, API cost simulation, and access comparison. Keep all durable calculations in a small pure TypeScript module so prices and volume totals are testable independently of Astro; keep every essential row and amount in server-rendered HTML, then use native radios as progressive enhancement.

**Tech Stack:** Astro 7, TypeScript 6, native HTML/CSS/JavaScript, Node test runner, Playwright, existing presentation manifest and scene registry.

## Global Constraints

- A3 contains exactly three slides and no mission or checkpoint.
- Treat Anthropic, OpenAI, and Google at the same level; do not rank vendors absolutely.
- Date model names and prices as a snapshot from July 21, 2026.
- Use USD prices excluding taxes; do not convert to euros.
- The reference workload is exactly 100,000 input tokens plus 10,000 output tokens per dossier.
- Keep all essential content readable with JavaScript disabled.
- Use native radio inputs for the three-option selectors, explicit labels, visible focus, and at least 48 px pointer targets.
- Never encode active state or meaning with color alone.
- Keep every visible text size at or above 0.75 rem / 12 px.
- Honor `prefers-reduced-motion: reduce` by removing nonessential transitions.
- Preserve the presentation palette, typography, SceneFrame structure, and family A accent.
- Do not add dependencies, vendor logos, decorative cards, continuous animation, or a generic abstraction beyond A3.
- The responsive layout must not create horizontal overflow at 390 × 844 or at 200% zoom.
- Source spec: `docs/superpowers/specs/2026-07-21-a3-modeles-couts-design.md`.
- Modern Web Guidance applied: visible native radios for fewer than six exclusive choices, semantic data tables with captions and scoped headers, explicit `:focus-visible`, and static-first progressive enhancement.

---

## File map

- Create `src/components/presentation/visuals/a/model-cost-state.ts`: pure workload and price calculations shared by Astro frontmatter and client enhancement.
- Create `src/components/presentation/visuals/a/ModelCostGuide.astro`: the only A3 renderer; owns semantic markup, enhancement hooks, responsive layout, and reduced-motion styles.
- Create `tests/model-cost-state.test.ts`: exact unit tests for all six price examples and supported volumes.
- Create `scripts/qa-a3-model-costs.mjs`: browser checks for native controls, recalculation, no-JS fallback, mobile, zoom, and reduced motion.
- Modify `src/presentation/presentation-model.ts`: add `model-cost-guide`, then remove obsolete `context-budget` after the manifest migration.
- Modify `src/components/presentation/VisualRegistry.astro`: register `ModelCostGuide`, then remove `ContextBudget` after the manifest migration.
- Modify `src/presentation/manifests/a.ts`: replace the five A3 slides and add official Anthropic, OpenAI, and Google links.
- Modify `src/content/briques/a-comprendre/a3-couts.mdx`: rewrite the editorial source around model choice, the fixed workload, and subscription versus API.
- Modify `src/components/presentation/visuals/a/visual-state.ts`: remove state used only by the deleted context-budget visual while preserving `resolvePanelVisibility` for `VerificationAudit.astro`.
- Delete `src/components/presentation/visuals/a/ContextBudget.astro`: it has no remaining consumer after the A3 replacement.
- Modify `tests/presentation-content.test.ts`: assert the three new slides and their canonical data.
- Modify `tests/presentation-visuals.test.ts`: assert the new component’s semantic/progressive-enhancement contract and remove obsolete context-budget assertions.
- Modify `tests/presentation-scene-data.test.ts`: replace the deleted A3 checkpoint assertion with model/cost data integrity checks.
- Modify `tests/presentation-routing.test.ts`: update A2 → A3 and A3 → A4 neighbors and browser-QA copy.
- Modify `tests/presentation-check.test.ts`: update the total from 73 to 71 slides.
- Modify `scripts/qa-presenter.mjs`: update totals from 73/74 to 71/72.
- Modify `scripts/qa-font-floor.mjs`: update the expected route total from 73 to 71.
- Modify `package.json`: add `qa:a3-model-costs`.

---

### Task 1: Build and test the pure API cost model

**Files:**

- Create: `tests/model-cost-state.test.ts`
- Create: `src/components/presentation/visuals/a/model-cost-state.ts`

**Interfaces:**

- Produces: `TokenWorkload`, `ApiTokenRate`, `SUPPORTED_VOLUMES`, `calculateApiCost(rate, workload, volume): number`, and `formatUsd(amount): string`.
- Consumers: `ModelCostGuide.astro`, its client script, and the A3 browser QA.

- [ ] **Step 1: Write the failing calculation tests**

Create `tests/model-cost-state.test.ts` with exact arithmetic for the six manifest models and all supported volume choices:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SUPPORTED_VOLUMES,
  calculateApiCost,
  formatUsd,
} from '../src/components/presentation/visuals/a/model-cost-state';

const workload = { inputTokens: 100_000, outputTokens: 10_000 };

test('calcule le dossier A3 à partir des prix par million de tokens', () => {
  assert.equal(calculateApiCost({ inputPerMTok: 2, outputPerMTok: 10 }, workload, 1), 0.3);
  assert.equal(calculateApiCost({ inputPerMTok: 2.5, outputPerMTok: 15 }, workload, 1), 0.4);
  assert.equal(calculateApiCost({ inputPerMTok: 1.5, outputPerMTok: 7.5 }, workload, 1), 0.225);
  assert.equal(calculateApiCost({ inputPerMTok: 10, outputPerMTok: 50 }, workload, 1), 1.5);
  assert.equal(calculateApiCost({ inputPerMTok: 5, outputPerMTok: 30 }, workload, 1), 0.8);
  assert.equal(calculateApiCost({ inputPerMTok: 2, outputPerMTok: 12 }, workload, 1), 0.32);
});

test('multiplie le même coût unitaire par les trois volumes proposés', () => {
  assert.deepEqual(SUPPORTED_VOLUMES, [1, 10, 100]);
  assert.deepEqual(
    SUPPORTED_VOLUMES.map((volume) => calculateApiCost(
      { inputPerMTok: 10, outputPerMTok: 50 }, workload, volume,
    )),
    [1.5, 15, 150],
  );
});

test('formate les montants en dollars sans masquer les fractions utiles', () => {
  assert.equal(formatUsd(0.225), '0,225 $');
  assert.equal(formatUsd(0.3), '0,30 $');
  assert.equal(formatUsd(22.5), '22,50 $');
  assert.equal(formatUsd(150), '150 $');
});
```

- [ ] **Step 2: Run the focused test and confirm the missing module failure**

Run: `node --import tsx --test tests/model-cost-state.test.ts`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `model-cost-state`.

- [ ] **Step 3: Implement the minimal pure module**

Create `src/components/presentation/visuals/a/model-cost-state.ts`:

```ts
export interface TokenWorkload {
  inputTokens: number;
  outputTokens: number;
}

export interface ApiTokenRate {
  inputPerMTok: number;
  outputPerMTok: number;
}

export const SUPPORTED_VOLUMES = [1, 10, 100] as const;

export const calculateApiCost = (
  rate: ApiTokenRate,
  workload: TokenWorkload,
  volume: number,
): number => (
  ((workload.inputTokens / 1_000_000) * rate.inputPerMTok)
  + ((workload.outputTokens / 1_000_000) * rate.outputPerMTok)
) * volume;

export const formatUsd = (amount: number): string => {
  const fractionDigits = Number.isInteger(amount) ? 0 : amount < 0.3 ? 3 : 2;
  return `${amount.toLocaleString('fr-FR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })} $`;
};
```

- [ ] **Step 4: Run the focused test and the full unit suite**

Run: `node --import tsx --test tests/model-cost-state.test.ts && npm test`

Expected: the three focused tests PASS; the existing suite remains green.

- [ ] **Step 5: Commit the calculation boundary**

```bash
git add tests/model-cost-state.test.ts src/components/presentation/visuals/a/model-cost-state.ts
git commit -m "test: cadrer le calcul des coûts API A3"
```

---

### Task 2: Add the accessible three-variant A3 visual

**Files:**

- Create: `src/components/presentation/visuals/a/ModelCostGuide.astro`
- Modify: `src/presentation/presentation-model.ts`
- Modify: `src/components/presentation/VisualRegistry.astro`
- Modify: `tests/presentation-visuals.test.ts`

**Interfaces:**

- Consumes: `calculateApiCost`, `formatUsd`, and `SUPPORTED_VOLUMES` from Task 1.
- Consumes manifest data with `variant: 'models' | 'costs' | 'access'`.
- Produces: registry key `model-cost-guide` and stable hooks `[data-model-cost-guide]`, `[data-tier-choice]`, `[data-tier-row]`, `[data-volume-choice]`, `[data-volume-heading]`, and `[data-cost-output]`.

- [ ] **Step 1: Write failing source-contract tests**

In `tests/presentation-visuals.test.ts`, add:

```ts
test('A3 utilise des contrôles natifs et conserve ses données sans JavaScript', async () => {
  const visual = await read('src/components/presentation/visuals/a/ModelCostGuide.astro');

  assert.match(visual, /<fieldset class="model-guide__tier-controls">/);
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

test('le registre expose la scène modèles et coûts', async () => {
  const [model, registry] = await Promise.all([
    read('src/presentation/presentation-model.ts'),
    read('src/components/presentation/VisualRegistry.astro'),
  ]);

  assert.match(model, /'model-cost-guide'/);
  assert.match(registry, /ModelCostGuide/);
  assert.match(registry, /'model-cost-guide': ModelCostGuide/);
});
```

- [ ] **Step 2: Run the focused source-contract tests**

Run: `node --import tsx --test --test-name-pattern="A3 utilise|registre expose" tests/presentation-visuals.test.ts`

Expected: FAIL because `ModelCostGuide.astro` and `model-cost-guide` do not exist.

- [ ] **Step 3: Register the new visual key**

In `src/presentation/presentation-model.ts`, add `'model-cost-guide'` immediately after `'context-budget'` in `SLIDE_VISUAL_KEYS`. Keep both keys until Task 4 so the existing A3 manifest remains valid during this task.

In `src/components/presentation/VisualRegistry.astro`, add:

```astro
import ModelCostGuide from './visuals/a/ModelCostGuide.astro';
```

```ts
'model-cost-guide': ModelCostGuide,
```

Keep the `ContextBudget` import and `'context-budget'` registry entry until Task 4.

- [ ] **Step 4: Implement all three semantic variants**

Create `ModelCostGuide.astro` with these exact boundaries:

```astro
---
import type { RoutedSlide } from '../../../../presentation/presentation-model';
import SceneFrame from '../../scenes/SceneFrame.astro';
import { SUPPORTED_VOLUMES, calculateApiCost, formatUsd } from './model-cost-state';

interface Props { slide: RoutedSlide; }
interface Tier { id: string; label: string; signal: string; models: Array<{ vendor: string; name: string; note?: string }>; }
interface Price { tier: string; vendor: string; model: string; inputPerMTok: number; outputPerMTok: number; note?: string; }

const { slide } = Astro.props;
const data = slide.visual.data;
const variant = String(data.variant ?? 'models');
const tiers = Array.isArray(data.tiers) ? data.tiers as Tier[] : [];
const prices = Array.isArray(data.prices) ? data.prices as Price[] : [];
const workload = data.workload as { inputTokens: number; outputTokens: number } | undefined;
const defaultVolume = 100;
---

<SceneFrame title={slide.claim} description={slide.accessibleDescription} visualKey={slide.visual.key} class="model-guide">
  <div class="model-guide__scene" data-model-cost-guide data-variant={variant}>
    {variant === 'models' && (
      <section class="model-guide__models" aria-labelledby={`${slide.id}-models-title`}>
        <fieldset class="model-guide__tier-controls">
          <legend id={`${slide.id}-models-title`}>{String(data.interaction)}</legend>
          {tiers.map((tier, index) => (
            <label for={`${slide.id}-${tier.id}`}>
              <input id={`${slide.id}-${tier.id}`} name={`${slide.id}-tier`} type="radio" value={tier.id} checked={index === 1} data-tier-choice />
              <span>{tier.label}</span>
            </label>
          ))}
        </fieldset>
        <div class="model-guide__tier-grid" role="list">
          {tiers.map((tier) => (
            <article role="listitem" data-tier-row={tier.id} data-active={tier.id === 'balance' ? 'true' : 'false'}>
              <header><h3>{tier.label}</h3><p>{tier.signal}</p></header>
              <ul role="list">{tier.models.map((model) => <li><small>{model.vendor}</small><strong>{model.name}</strong>{model.note && <span>{model.note}</span>}</li>)}</ul>
            </article>
          ))}
        </div>
        <p class="model-guide__rule">{String(data.rule)}</p>
      </section>
    )}

    {variant === 'costs' && workload && (
      <section class="model-guide__costs" aria-labelledby={`${slide.id}-cost-title`}>
        <header><p id={`${slide.id}-cost-title`}>{String(data.caseLabel)}</p><strong>{workload.inputTokens.toLocaleString('fr-FR')} tokens lus + {workload.outputTokens.toLocaleString('fr-FR')} produits</strong></header>
        <fieldset class="model-guide__volume-controls">
          <legend>{String(data.interaction)}</legend>
          {SUPPORTED_VOLUMES.map((volume) => <label for={`${slide.id}-volume-${volume}`}><input id={`${slide.id}-volume-${volume}`} name={`${slide.id}-volume`} type="radio" value={volume} checked={volume === defaultVolume} data-volume-choice />{volume} dossier{volume > 1 ? 's' : ''}</label>)}
        </fieldset>
        <div class="model-guide__table-wrap">
          <table class="model-guide__cost-table">
            <caption>Coût API du cas de référence, relevé le 21 juillet 2026</caption>
            <thead><tr><th scope="col">Niveau</th><th scope="col">Modèle</th><th scope="col">Entrée / MTok</th><th scope="col">Sortie / MTok</th><th scope="col">1 dossier</th><th scope="col"><span data-volume-heading>100 dossiers</span></th></tr></thead>
            <tbody>{prices.map((price) => {
              const unit = calculateApiCost(price, workload, 1);
              return <tr><td>{price.tier}</td><th scope="row"><strong>{price.model}</strong><small>{price.vendor}{price.note ? ` · ${price.note}` : ''}</small></th><td>{formatUsd(price.inputPerMTok)}</td><td>{formatUsd(price.outputPerMTok)}</td><td>{formatUsd(unit)}</td><td><output data-cost-output data-unit-cost={unit}>{formatUsd(unit * defaultVolume)}</output></td></tr>;
            })}</tbody>
          </table>
        </div>
        <p class="model-guide__caveat">{String(data.caveat)}</p>
      </section>
    )}

    {variant === 'access' && (
      <section class="model-guide__access" aria-label="Comparer abonnement, API et usage hybride">
        <article><p class="scene-label">Abonnement</p><h3>{String(data.subscriptionTitle)}</h3><ul role="list">{(data.subscriptionPoints as string[]).map((point) => <li>{point}</li>)}</ul></article>
        <div class="model-guide__hybrid"><span>≈ 20 $ / mois</span><strong>{String(data.hybrid)}</strong><p>{String(data.conclusion)}</p></div>
        <article><p class="scene-label">API</p><h3>{String(data.apiTitle)}</h3><ul role="list">{(data.apiPoints as string[]).map((point) => <li>{point}</li>)}</ul></article>
      </section>
    )}
  </div>
</SceneFrame>
```

Add a module script using `onPresenterPage`. It must set `data-enhanced="true"`, update `data-active` on tier rows after a radio `change`, update `[data-volume-heading]` to `1 dossier`, `10 dossiers`, or `100 dossiers`, and update every `[data-cost-output]` from its numeric `data-unit-cost` after a volume `change`. Use `formatUsd`; do not hide nonactive rows. Final review intentionally strengthens the accessibility contract with one polite atomic summary for the selected volume and the minimum/maximum costs; individual cells must not become live regions.

Add component-scoped CSS with these concrete layout rules:

```css
.model-guide__scene { display: grid; min-block-size: 100%; }
.model-guide__tier-controls, .model-guide__volume-controls { display: flex; flex-wrap: wrap; gap: .5rem; margin: 0; padding: 0; border: 0; }
.model-guide__tier-controls label, .model-guide__volume-controls label { min-block-size: 3rem; display: flex; align-items: center; gap: .45rem; padding: .45rem .8rem; border: 2px solid var(--presentation-line); border-radius: 999px; cursor: pointer; }
.model-guide__tier-controls label:has(input:checked), .model-guide__volume-controls label:has(input:checked) { border-color: var(--presentation-ink); background: color-mix(in srgb, var(--family-accent), transparent 78%); }
.model-guide input:focus-visible + span, .model-guide label:has(input:focus-visible) { outline: 3px solid var(--presentation-focus); outline-offset: 3px; }
.model-guide__tier-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .8rem; }
.model-guide__tier-grid article { border-block-start: .3rem solid var(--presentation-line); padding: .7rem; opacity: .68; }
.model-guide__tier-grid article[data-active='true'] { border-color: var(--family-accent); opacity: 1; }
.model-guide__tier-grid ul { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .45rem; margin: .6rem 0 0; padding: 0; list-style: none; }
.model-guide__tier-grid li, .model-guide__access article { background: var(--presentation-surface); border: 1px solid var(--presentation-line); }
.model-guide__table-wrap { overflow-x: auto; }
.model-guide__cost-table { inline-size: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.model-guide__cost-table :is(th, td) { padding: .42rem .5rem; border-block-end: 1px solid var(--presentation-line); text-align: start; }
.model-guide__access { display: grid; grid-template-columns: 1fr minmax(12rem, .55fr) 1fr; gap: 1rem; align-items: stretch; }
.model-guide__hybrid { display: grid; place-content: center; text-align: center; border-block: .3rem solid var(--family-accent); }
@media (max-width: 52rem) {
  .model-guide__tier-grid, .model-guide__access { grid-template-columns: 1fr; }
  .model-guide__tier-grid ul { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .model-guide__table-wrap { overflow-x: visible; }
  .model-guide__cost-table thead { position: absolute; clip-path: inset(50%); inline-size: 1px; block-size: 1px; overflow: hidden; }
  .model-guide__cost-table tr { display: grid; grid-template-columns: 1fr 1fr; }
  .model-guide__cost-table :is(th, td) { min-inline-size: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .model-guide * { transition: none !important; animation: none !important; }
}
```

Adjust spacing and font sizes only within the constraints after browser inspection; never reduce text below `0.75rem`.

- [ ] **Step 5: Run the focused tests and type checker**

Run: `node --import tsx --test --test-name-pattern="A3 utilise|registre expose" tests/presentation-visuals.test.ts && npm run typecheck`

Expected: focused tests PASS and Astro reports zero errors.

- [ ] **Step 6: Commit the visual shell**

```bash
git add src/components/presentation/visuals/a/ModelCostGuide.astro src/presentation/presentation-model.ts src/components/presentation/VisualRegistry.astro tests/presentation-visuals.test.ts
git commit -m "feat: ajouter le guide visuel modèles et coûts"
```

---

### Task 3: Replace A3 content and manifest data

**Files:**

- Modify: `src/presentation/manifests/a.ts`
- Modify: `src/content/briques/a-comprendre/a3-couts.mdx`
- Modify: `tests/presentation-content.test.ts`
- Modify: `tests/presentation-scene-data.test.ts`
- Modify: `tests/presentation-routing.test.ts`

**Interfaces:**

- Consumes: `model-cost-guide` and the three `variant` values from Task 2.
- Produces slide IDs: `a3-model-fit`, `a3-api-cost`, and `a3-access`.
- Produces navigation: `a2-prioritize → a3-model-fit → a3-api-cost → a3-access → a4-convincing`.

- [ ] **Step 1: Replace the expected A3 inventory before implementation**

In `tests/presentation-content.test.ts`, replace the five old A3 entries with:

```ts
{ id: 'a3-model-fit', claim: 'Le bon modèle dépend du niveau d’exigence.', visualKey: 'model-cost-guide' },
{ id: 'a3-api-cost', claim: 'Le même dossier coûte de 0,23 à 1,50 $ selon le modèle.', visualKey: 'model-cost-guide' },
{ id: 'a3-access', claim: 'L’abonnement achète une capacité privilégiée, pas des tokens.', visualKey: 'model-cost-guide' },
```

Rename the inventory test to `contient les 71 étapes de compréhension validées`. Remove the obsolete qualitative-context test and add assertions that A3 has exactly three slides, has no `mission` or `checkpoint` role, includes three vendors in every tier, and contains the exact six unit prices from the spec.

In `tests/presentation-routing.test.ts`, replace the old A2 neighbor assertion and add the A3 exit assertion:

```ts
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'a2-prioritize').next?.id, 'a3-model-fit');
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'a3-access').next?.id, 'a4-convincing');
```

In `tests/presentation-scene-data.test.ts`, delete `conserve la preuve A3 dans les détails du checkpoint` and add a test that finds `a3-api-cost`, asserts `{ inputTokens: 100_000, outputTokens: 10_000 }`, and asserts six price rows.

- [ ] **Step 2: Run the focused content tests and observe the old deck failure**

Run: `node --import tsx --test tests/presentation-content.test.ts tests/presentation-scene-data.test.ts tests/presentation-routing.test.ts`

Expected: FAIL because the manifest still exposes five old A3 slides and `a3-three-costs`.

- [ ] **Step 3: Add official links and replace the A3 manifest block**

In `src/presentation/manifests/a.ts`, replace A3-only `planGuide` and `apiPricing` constants with nine official links grouped three per slide: Anthropic models/pricing/plans, OpenAI models/pricing/plans, and Google models/pricing/plans. Keep `usageLimits` because A1 still consumes it. Change the A3 deck title from `Les coûts` to `Choisir son modèle et son mode de paiement`.

Replace the complete A3 `slides` array with three slides using these data contracts:

```ts
// a3-model-fit
{
  variant: 'models',
  interaction: 'Choisir le niveau d’exigence.',
  tiers: [
    { id: 'volume', label: 'Cadré et volumineux', signal: 'Extraction, classement, reformulation et sous-tâches répétables', models: [
      { vendor: 'Anthropic', name: 'Claude Haiku 4.5' },
      { vendor: 'OpenAI', name: 'GPT-5.6 Luna' },
      { vendor: 'Google', name: 'Gemini 3.5 Flash-Lite' },
    ] },
    { id: 'balance', label: 'Professionnel courant', signal: 'Rédaction nuancée, analyse, code et agents ordinaires', models: [
      { vendor: 'Anthropic', name: 'Claude Sonnet 5' },
      { vendor: 'OpenAI', name: 'GPT-5.6 Terra' },
      { vendor: 'Google', name: 'Gemini 3.6 Flash' },
    ] },
    { id: 'exigence', label: 'Très exigeant', signal: 'Problème difficile, forte précision attendue ou agent long', models: [
      { vendor: 'Anthropic', name: 'Claude Opus 4.8 / Fable 5', note: 'Opus : code complexe · Fable : agents longs' },
      { vendor: 'OpenAI', name: 'GPT-5.6 Sol' },
      { vendor: 'Google', name: 'Gemini 3.1 Pro Preview' },
    ] },
  ],
  rule: 'Commencer à l’équilibre, descendre pour le volume, monter seulement après un test insuffisant.',
  snapshot: 'Relevé du 21 juillet 2026',
}
```

```ts
// a3-api-cost
{
  variant: 'costs',
  interaction: 'Comparer 1, 10 ou 100 dossiers.',
  caseLabel: 'Cas de référence',
  workload: { inputTokens: 100_000, outputTokens: 10_000 },
  prices: [
    { tier: 'Équilibre', vendor: 'Anthropic', model: 'Claude Sonnet 5', inputPerMTok: 2, outputPerMTok: 10, note: 'tarif de lancement jusqu’au 31 août 2026' },
    { tier: 'Équilibre', vendor: 'OpenAI', model: 'GPT-5.6 Terra', inputPerMTok: 2.5, outputPerMTok: 15 },
    { tier: 'Équilibre', vendor: 'Google', model: 'Gemini 3.6 Flash', inputPerMTok: 1.5, outputPerMTok: 7.5 },
    { tier: 'Exigence', vendor: 'Anthropic', model: 'Claude Fable 5', inputPerMTok: 10, outputPerMTok: 50 },
    { tier: 'Exigence', vendor: 'OpenAI', model: 'GPT-5.6 Sol', inputPerMTok: 5, outputPerMTok: 30 },
    { tier: 'Exigence', vendor: 'Google', model: 'Gemini 3.1 Pro Preview', inputPerMTok: 2, outputPerMTok: 12, note: 'contexte ≤ 200k' },
  ],
  caveat: 'USD hors taxes. Outils, recherche, cache, images, stockage et long contexte non inclus. Prix et modèles évolutifs.',
  snapshot: 'Relevé du 21 juillet 2026',
}
```

```ts
// a3-access
{
  variant: 'access',
  subscriptionTitle: 'Capacité dans un produit',
  subscriptionPoints: ['≈ 20 $/mois pour les offres individuelles courantes', 'Fonctions et modèles inclus selon le forfait', 'Limites variables et partagées'],
  apiTitle: 'Consommation mesurée',
  apiPoints: ['Paiement exact à l’usage', 'Automatisation et choix explicite du modèle', 'Dépense ouverte à plafonner'],
  hybrid: 'Abonnement pour le quotidien · API pour les workflows mesurés',
  conclusion: 'Aujourd’hui, l’abonnement peut donner une capacité qui coûterait davantage au tarif API. Ce rapport peut changer.',
  reference: '100 dossiers via API : environ 22,50 à 150 $ selon le modèle',
  snapshot: 'Ordres de grandeur au 21 juillet 2026',
}
```

Use the claims, supports, descriptions, durations, notes, transitions, and links exactly as approved in the design spec. Total duration is 8 minutes: 3 + 3 + 2.

- [ ] **Step 4: Rewrite the A3 MDX without removing required headings**

Set `title` to `"Choisir son modèle et son mode de paiement"`, `durationMinutes` to `8`, the learning objective to choosing a model tier and access mode, and the expected outcome to a justified model/access decision plus one reproducible API estimate.

Keep every heading required by `COMMON_HEADINGS`. Under `Pratique avec Claude`, explain the 100k/10k formula. Under `Mission commune` and `Livrable`, state explicitly that no exercise or participant deliverable is planned for this short conceptual brick. Replace the old context-budget guidance in `Notes formateur`, `Défis avancés`, `Variantes`, `Dépannage`, `Ressources`, and `Ouverture` with the approved three-slide content and official links.

- [ ] **Step 5: Run content, routing, and presentation checks**

Run: `node --import tsx --test tests/presentation-content.test.ts tests/presentation-scene-data.test.ts tests/presentation-routing.test.ts && npm run content:check && npm run presentation:check`

Expected: focused tests PASS; content reports 23 valid bricks; presentation reports 71 valid slides.

- [ ] **Step 6: Commit the canonical A3 content**

```bash
git add src/presentation/manifests/a.ts src/content/briques/a-comprendre/a3-couts.mdx tests/presentation-content.test.ts tests/presentation-scene-data.test.ts tests/presentation-routing.test.ts
git commit -m "feat: recentrer A3 sur les modèles et les coûts"
```

---

### Task 4: Remove obsolete context-budget code and update global inventory counts

**Files:**

- Delete: `src/components/presentation/visuals/a/ContextBudget.astro`
- Modify: `src/presentation/presentation-model.ts`
- Modify: `src/components/presentation/VisualRegistry.astro`
- Modify: `src/components/presentation/visuals/a/visual-state.ts`
- Modify: `tests/presentation-visuals.test.ts`
- Modify: `tests/presentation-check.test.ts`
- Modify: `scripts/qa-presenter.mjs`
- Modify: `scripts/qa-font-floor.mjs`

**Interfaces:**

- Preserves: `resolvePanelVisibility` because `VerificationAudit.astro` still imports it.
- Removes: `ContextBudgetVariant`, `getContextBudgetVariant`, and `calculateContextSelection`.
- Establishes global inventory: 71 slide routes and 72 presenter pages including the presenter index.

- [ ] **Step 1: Update tests to reject obsolete A3 state and expect 71 slides**

In `tests/presentation-visuals.test.ts`, remove assertions for `getContextBudgetVariant` and `calculateContextSelection`; retain both `resolvePanelVisibility` tests used by A1/A4 visual behavior. Add a source assertion that `VisualRegistry.astro` does not contain `ContextBudget` or `'context-budget'`, and that `presentation-model.ts` no longer contains the `'context-budget'` key.

In `tests/presentation-check.test.ts`, rename the first test to `contrôle les 71 slides...` and set `assert.equal(result.slideCount, 71)`.

Update hard-coded browser inventory assertions in `tests/presentation-visuals.test.ts` and `tests/presentation-routing.test.ts` from 73 routes to 71 routes.

- [ ] **Step 2: Run the focused tests and confirm obsolete code/count failures**

Run: `node --import tsx --test tests/presentation-visuals.test.ts tests/presentation-check.test.ts tests/presentation-routing.test.ts`

Expected: FAIL until obsolete symbols are removed and QA scripts use 71/72.

- [ ] **Step 3: Delete the unused visual and state**

Delete `ContextBudget.astro`. Remove its import and registry entry from `VisualRegistry.astro`, and remove `'context-budget'` from `SLIDE_VISUAL_KEYS` in `presentation-model.ts`. In `visual-state.ts`, delete the `ContextBudgetVariant` type, the complete `getContextBudgetVariant` function on lines 59–66 of the current file, and the complete `calculateContextSelection` function on lines 68–71. Do not remove `resolvePanelVisibility`, which immediately follows them and is still imported by `VerificationAudit.astro`.

- [ ] **Step 4: Update generated-page inventory expectations**

In `scripts/qa-presenter.mjs`, change slide routes `73 → 71`, generated pages `74 → 72`, and the success copy accordingly.

In `scripts/qa-font-floor.mjs`, change both route assertions and success copy from `73` to `71`.

- [ ] **Step 5: Run the focused tests and type checker**

Run: `node --import tsx --test tests/presentation-visuals.test.ts tests/presentation-check.test.ts tests/presentation-routing.test.ts && npm run typecheck`

Expected: all focused tests PASS and Astro reports zero errors.

- [ ] **Step 6: Commit the cleanup and count changes**

```bash
git add src/components/presentation/visuals/a/ContextBudget.astro src/components/presentation/visuals/a/visual-state.ts src/presentation/presentation-model.ts src/components/presentation/VisualRegistry.astro tests/presentation-visuals.test.ts tests/presentation-check.test.ts tests/presentation-routing.test.ts scripts/qa-presenter.mjs scripts/qa-font-floor.mjs
git commit -m "refactor: retirer l'ancien budget de contexte A3"
```

---

### Task 5: Add durable browser QA for A3 interactions and fallbacks

**Files:**

- Create: `scripts/qa-a3-model-costs.mjs`
- Modify: `package.json`
- Modify: `tests/presentation-visuals.test.ts`

**Interfaces:**

- Consumes stable DOM hooks from Task 2.
- Produces npm command `npm run qa:a3-model-costs`.

- [ ] **Step 1: Write the failing QA source-contract test**

Add this test to `tests/presentation-visuals.test.ts`:

```ts
test('la QA A3 couvre niveaux, volumes, mobile, zoom, mouvement réduit et repli sans JavaScript', async () => {
  const [qa, packageJson] = await Promise.all([
    read('scripts/qa-a3-model-costs.mjs'),
    read('package.json'),
  ]);

  assert.match(packageJson, /"qa:a3-model-costs":\s*"node scripts\/qa-a3-model-costs\.mjs"/);
  assert.match(qa, /a3-model-fit/);
  assert.match(qa, /a3-api-cost/);
  assert.match(qa, /a3-access/);
  assert.match(qa, /data-tier-choice/);
  assert.match(qa, /data-cost-output/);
  assert.match(qa, /javaScriptEnabled:\s*false/);
  assert.match(qa, /viewport:\s*\{ width: 390, height: 844 \}/);
  assert.match(qa, /style\.zoom = ['"]2['"]/);
  assert.match(qa, /reducedMotion:\s*['"]reduce['"]/);
});
```

- [ ] **Step 2: Run the source-contract test and confirm missing QA failure**

Run: `node --import tsx --test --test-name-pattern="QA A3" tests/presentation-visuals.test.ts`

Expected: FAIL because the QA file and package script do not exist.

- [ ] **Step 3: Implement the Playwright QA**

Create `scripts/qa-a3-model-costs.mjs` following the existing preview lifecycle in `qa-a2-prioritizer.mjs`. It must perform these exact checks:

1. open `/presenter/a3/a3-model-fit/` at 1280 × 720;
2. assert three `[data-tier-choice]` radios and three `[data-tier-row]` rows;
3. select `exigence`, assert its row has `data-active="true"`, and assert all three rows remain visible;
4. open `/presenter/a3/a3-api-cost/`, select volume `1`, `10`, then `100`, assert `[data-volume-heading]` matches the selected volume, and assert the Fable output is `1,50 $`, `15 $`, then `150 $`;
5. open `/presenter/a3/a3-access/` and assert both `Abonnement` and `API` headings plus the hybrid conclusion are visible;
6. repeat all three routes at 390 × 844 and fail on horizontal overflow or clipped visible text;
7. set `document.documentElement.style.zoom = '2'` on all three routes and fail on horizontal overflow;
8. emulate `reducedMotion: 'reduce'` and assert the model guide has no animation and no nonzero transition duration;
9. create a no-JS context, open all three routes, assert three tier rows, six cost rows with both 1- and 100-dossier values, and both access columns are visible.

Use a `failures: string[]`, close the browser in `finally`, stop the preview, print each failure, and exit nonzero exactly like the existing QA scripts.

Add to `package.json`:

```json
"qa:a3-model-costs": "node scripts/qa-a3-model-costs.mjs"
```

- [ ] **Step 4: Build and run the dedicated browser QA**

Run: `npm run build && npm run qa:a3-model-costs`

Expected: build succeeds with 71 slides; QA prints that all three A3 routes, controls, fallback modes, and layouts are valid.

- [ ] **Step 5: Run the existing global presenter and font-floor QA**

Run: `npm run qa:presenter && npm run qa:font-floor`

Expected: presenter reports 71/71 routes and 72 generated pages; font-floor reports 71/71 routes at 12 px or more.

- [ ] **Step 6: Commit durable browser coverage**

```bash
git add scripts/qa-a3-model-costs.mjs package.json tests/presentation-visuals.test.ts
git commit -m "test: couvrir les interactions et replis A3"
```

---

### Task 6: Perform visual review and final verification

**Files:**

- Modify only files already listed if review exposes a concrete defect.

**Interfaces:**

- Verifies the public presentation routes and the three visual-contract tests.
- Produces no new abstraction or feature.

- [ ] **Step 1: Run the complete automated verification**

Run:

```bash
npm test
npm run content:check
npm run presentation:check
npm run typecheck
npm run build
npm run qa:a3-model-costs
npm run qa:presenter
npm run qa:font-floor
```

Expected: every command exits 0; presentation count is 71; presenter page count is 72.

- [ ] **Step 2: Inspect the three slides visually at presentation size**

Start `npm run preview -- --host 127.0.0.1 --port 4381`. Capture each A3 route at 1280 × 720 and 390 × 844. Check:

- Slide 1: the middle tier is the obvious default, all three vendors align, and Opus/Fable specialization is readable without crowding.
- Slide 2: the workload precedes the prices, columns remain scannable, and 0.23–1.50 $ is visible within a few seconds.
- Slide 3: subscription and API read as distinct regimes, the hybrid conclusion is central, and no quota is implied.

- [ ] **Step 3: Run the visual-director tests manually**

For each slide record PASS only when:

- Silent test: the claim is understandable without speaker notes.
- Glance test: the eye path is obvious within a few seconds.
- Necessity test: tier and volume controls clarify a relationship; slide 3 remains static because interaction adds no value.

If any test fails, adjust only component spacing, hierarchy, or support copy; rerun Task 6 Step 1 after every change.

- [ ] **Step 4: Inspect the final diff and repository state**

Run:

```bash
git diff --check origin/main...
git diff --stat origin/main...
git status --short
```

Expected: no whitespace errors; only the approved spec, plan, A3 implementation, tests, and QA files differ from `origin/main`; working tree is clean after the final commit.

- [ ] **Step 5: Commit any review-only corrections**

If Step 2 required changes:

```bash
git add src/components/presentation/visuals/a/ModelCostGuide.astro src/presentation/manifests/a.ts src/content/briques/a-comprendre/a3-couts.mdx
git commit -m "fix: affiner la lisibilité des slides A3"
```

If no correction was required, do not create an empty commit.
