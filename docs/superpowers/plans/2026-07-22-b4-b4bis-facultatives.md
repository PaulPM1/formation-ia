# B4 and B4-bis Optional Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep B4 and B4-bis available as clearly marked optional material while the required presenter path moves directly from B3 to C1.

**Architecture:** Add one `optional` flag to presentation decks and propagate it to routed slides. Required slides compute neighbors from the required-only sequence, while optional slides use the complete authored sequence. Reuse a dedicated `facultatif` priority in brick frontmatter and render the state as text plus a muted visual treatment in catalogs, presenter summaries, and slide headings.

**Tech Stack:** Astro 7, TypeScript 6, native HTML/CSS, Node test runner, Playwright browser QA.

## Global Constraints

- Preserve all B4 and B4-bis content, eleven slides, routes, and shared visual components.
- The required path is `B3 → C1`; the optional branch remains `B3 → B4 → B4-bis → C1`.
- Never rely on gray color alone: render the literal label `Facultatif`.
- Do not reduce whole-card or whole-slide opacity.
- Keep the existing A3 working-tree changes intact.
- Do not add dependencies or rename the current branch.

---

### Task 1: Optional deck model and routed navigation

**Files:**
- Modify: `tests/presentation-validation.test.ts`
- Modify: `tests/presentation-routing.test.ts`
- Modify: `src/presentation/presentation-model.ts`
- Modify: `src/presentation/presentation-validation.ts`
- Modify: `src/presentation/manifests/b.ts`

**Interfaces:**
- Consumes: the authored `PresentationDeck[]` order.
- Produces: `PresentationDeck.optional?: boolean`, `RoutedSlide.optional: boolean`, and context-sensitive `getSlideNeighbors` behavior.

- [ ] **Step 1: Write failing model and navigation tests**

Add a three-deck fixture whose middle deck has `optional: true`. Assert that `flattenSlides` propagates the flag, a required first slide skips the optional deck, a required last slide returns to the previous required deck, and an optional slide still sees its authored neighbors. In the real routing test assert:

```ts
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b3-mission').next?.id, 'c1-repeat');
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'c1-repeat').previous?.id, 'b3-mission');
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4-context').next?.id, 'b4-ipmtr');
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4bis-checkpoint').next?.id, 'c1-repeat');
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `node --import tsx --test tests/presentation-validation.test.ts tests/presentation-routing.test.ts`

Expected: failures because the model does not expose `optional` and B3 still points to B4.

- [ ] **Step 3: Implement the minimal optional-path model**

Add `optional?: boolean` to `PresentationDeck`, add `optional: boolean` to `RoutedSlide`, propagate `Boolean(deck.optional)` in `flattenSlides`, and update `getSlideNeighbors`:

```ts
const current = slides.find((slide) => slide.id === slideId);
if (!current) throw new Error(`Slide inconnue : ${slideId}`);
const sequence = current.optional ? slides : slides.filter((slide) => !slide.optional);
const index = sequence.findIndex((slide) => slide.id === slideId);
return { previous: sequence[index - 1] ?? null, next: sequence[index + 1] ?? null };
```

Set `optional: true` on the B4 and B4-bis deck objects only.

- [ ] **Step 4: Run the focused tests and confirm GREEN**

Run: `node --import tsx --test tests/presentation-validation.test.ts tests/presentation-routing.test.ts`

Expected: all focused tests pass.

---

### Task 2: Accessible optional state in catalogs and slides

**Files:**
- Modify: `tests/brick-view.test.ts`
- Modify: `tests/site-theme.test.ts`
- Modify: `tests/presentation-visuals.test.ts`
- Modify: `src/content/brick-model.ts`
- Modify: `src/content/brick-view.ts`
- Modify: `src/content/briques/b-interfaces/b4-claude-code.mdx`
- Modify: `src/content/briques/b-interfaces/b4-bis-setup-vscode.mdx`
- Modify: `src/pages/briques/index.astro`
- Modify: `src/pages/presenter/index.astro`
- Modify: `src/components/presentation/PresenterShell.astro`
- Modify: `src/styles/global.css`
- Modify: `src/styles/presentation.css`

**Interfaces:**
- Consumes: `brick.data.priority === 'facultatif'` and `deck.optional`/`slide.optional`.
- Produces: visible `Facultatif` text and `data-optional="true"` styling hooks.

- [ ] **Step 1: Write failing label and source-contract tests**

Assert `PRIORITY_LABELS.facultatif === 'Facultatif'`. Assert the brick catalog, presenter index, and presenter shell render `data-optional` and the literal `Facultatif`. Assert CSS targets optional cards and presenter entries without `opacity`.

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `node --import tsx --test tests/brick-view.test.ts tests/site-theme.test.ts tests/presentation-visuals.test.ts`

Expected: failures because `facultatif` and optional rendering hooks do not exist.

- [ ] **Step 3: Implement semantic labels and muted styling**

Add `facultatif` to `BRICK_PRIORITIES`, map it to `Facultatif`, and set both B4 frontmatters to `priority: facultatif`. Put `data-priority={brick.data.priority}` on catalog cards. In both presenter summaries render:

```astro
<li data-optional={deck.optional ? 'true' : undefined}>
  <a href={...}>...</a>
  {deck.optional && <span class="optional-label">Facultatif</span>}
</li>
```

On slide headings render a `Facultatif` marker when `slide.optional` is true. Style optional entries with gray surfaces, muted borders, and unchanged text contrast; keep focus and hover states visible.

- [ ] **Step 4: Run the focused tests and confirm GREEN**

Run: `node --import tsx --test tests/brick-view.test.ts tests/site-theme.test.ts tests/presentation-visuals.test.ts`

Expected: all focused tests pass.

---

### Task 3: Remove optional prerequisites from required material

**Files:**
- Modify: `tests/brick-inventory.test.ts`
- Modify: `src/content/briques/c-etendre/c1-skills.mdx`
- Modify: `src/content/briques/d-ecosysteme/d1-lexique-dev.mdx`
- Modify: `src/content/briques/d-ecosysteme/d2-bis-setup-github-vercel.mdx`
- Modify: `src/content/atelier/p1-naissance.mdx`
- Modify: `src/presentation/manifests/d.ts`
- Modify: `src/presentation/manifests/e.ts`

**Interfaces:**
- Consumes: brick frontmatter priority and prerequisites.
- Produces: a required curriculum with no formal dependency on B4/B4-bis.

- [ ] **Step 1: Write a failing invariant test**

Load all brick documents and assert that every `socle` document has neither `b4` nor `b4-bis` in `prerequisites`. Read P1 and assert its frontmatter list does not include `b4-bis`.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --import tsx --test tests/brick-inventory.test.ts`

Expected: C1, D1, D2-bis, and P1 violate the new invariant.

- [ ] **Step 3: Make required content autonomous**

Remove B4/B4-bis from the three required prerequisite lists. Replace their prerequisite prose with a generic working project or prepared demonstration. Remove B4-bis from P1's required brick list and describe it as the optional recovery guide when the editor or terminal is not ready. Rephrase required D1/E3 speaker notes so they explain the concept directly instead of claiming B4 was completed.

- [ ] **Step 4: Run content checks and confirm GREEN**

Run: `node --import tsx --test tests/brick-inventory.test.ts && npm run content:check && npm run presentation:check`

Expected: the focused invariant and both content validators pass.

---

### Task 4: Browser regression and complete verification

**Files:**
- Modify: `tests/presentation-visuals.test.ts`
- Modify: `scripts/qa-presenter.mjs`
- Modify: `scripts/qa-block-b.mjs`

**Interfaces:**
- Consumes: built presenter routes and semantic optional markers.
- Produces: durable browser assertions for the optional branch and required path.

- [ ] **Step 1: Add failing QA source expectations**

Require the presenter QA to visit B3, activate `Suivante`, and observe `c1-repeat`; require it to find visible `Facultatif` labels for B4 and B4-bis. Require the block B QA to keep all eleven optional routes in its route sweep.

- [ ] **Step 2: Run the source-contract test and confirm RED**

Run: `node --import tsx --test --test-name-pattern="présentateur|bloc B|facultatif" tests/presentation-visuals.test.ts tests/presentation-routing.test.ts`

Expected: failure because browser QA does not yet assert the optional path and labels.

- [ ] **Step 3: Implement the browser assertions**

Update the existing Playwright scripts without changing their server lifecycle. Check the literal labels and navigation targets; do not remove the B4/B4-bis route list from block B coverage.

- [ ] **Step 4: Run complete verification**

Run: `npm test && npm run build && npm run qa:presenter && npm run qa:block-b && git diff --check`

Expected: all tests and QA pass, the build produces all existing B4/B4-bis routes, and the diff has no whitespace errors.
