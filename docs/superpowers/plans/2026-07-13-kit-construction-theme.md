# Kit de construction Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved “Kit de construction” visual identity to the current Astro site, add a useful root page and branded 404, then publish and verify the result on Vercel.

**Architecture:** Keep the existing static Astro and MDX architecture. Extend the shared layout and stylesheet, add only static pages/assets, and annotate existing catalogue/detail markup with stable family data attributes so CSS can provide family accents without duplicating content or adding client JavaScript.

**Tech Stack:** Astro 7, MDX, TypeScript tests with `node:test`, vanilla CSS, static Vercel deployment.

## Global Constraints

- Preserve all 24 MDX bricks and the existing editorial workflow.
- Use the approved construction language: warm ivory paper, strong ink outlines, modular blocks, yellow/blue/coral family accents, offset shadows, and dense display type.
- Do not use gradients, glassmorphism, Claude UI imitation, external runtime assets, or a new dependency.
- Keep body copy comfortable for long reading and headings legible on a projector.
- Preserve keyboard focus, the skip link, semantic HTML, responsive layout, print behavior, and reduced-motion behavior.
- Keep every public route statically generated.

---

### Task 1: Lock the public theme and route contract

**Files:**
- Create: `tests/site-theme.test.ts`
- Test: `tests/site-theme.test.ts`

**Interfaces:**
- Consumes: the source files in `src/pages`, `src/layouts`, `src/styles`, and `public`.
- Produces: an automated contract for the root route, construction-theme tokens, family annotations, metadata, favicon, and 404 page.

- [ ] **Step 1: Write the failing source-contract test**

```ts
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('expose une entrée publique et les repères du thème kit de construction', async () => {
  const [home, layout, index, detail, styles, favicon, notFound] = await Promise.all([
    read('src/pages/index.astro'),
    read('src/layouts/BaseLayout.astro'),
    read('src/pages/briques/index.astro'),
    read('src/pages/briques/[id].astro'),
    read('src/styles/global.css'),
    read('public/favicon.svg'),
    read('src/pages/404.astro'),
  ]);

  assert.match(home, /Les briques du Vibe Coding/);
  assert.match(home, /href="\/briques\//);
  assert.match(layout, /rel="icon"/);
  assert.match(layout, /og:title/);
  assert.match(index, /data-family=/);
  assert.match(detail, /data-family=/);
  assert.match(styles, /--brick-yellow:/);
  assert.match(styles, /--brick-blue:/);
  assert.match(styles, /--brick-coral:/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(favicon, /<svg/);
  assert.match(notFound, /Page introuvable/);
});
```

- [ ] **Step 2: Run the test and verify the missing root route fails it**

Run: `npm test -- tests/site-theme.test.ts`

Expected: FAIL with `ENOENT` for `src/pages/index.astro`.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/site-theme.test.ts
git commit -m "test: define construction theme contract"
```

---

### Task 2: Build the shared construction identity and public entry points

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/404.astro`
- Create: `public/favicon.svg`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Test: `tests/site-theme.test.ts`

**Interfaces:**
- Consumes: `BaseLayout` with `title` and optional `description`.
- Produces: `/`, `/404.html`, shared navigation/metadata, `.home-*`, `.error-*`, `.construction-mark`, and global theme token classes.

- [ ] **Step 1: Add the root page**

Create a semantic `BaseLayout` page with a `.home-hero`, the exact title “Les briques du Vibe Coding”, a primary link to `/briques/`, a short explanation of the 24-brick curriculum, and a CSS-only `.hero-construction` illustration made of three labeled blocks: `COMPRENDRE`, `CONSTRUIRE`, `LIVRER`.

- [ ] **Step 2: Add a branded 404 page**

Create a `BaseLayout` page whose visible heading is “Page introuvable”, explains that the brick may have moved, and links to `/` and `/briques/`.

- [ ] **Step 3: Upgrade the shared layout**

Add `/favicon.svg`, canonical social metadata (`og:title`, `og:description`, `og:type`, `og:locale`), a compact geometric brand mark, `/` and `/briques/` navigation links, and a small footer stating that the public site is the source for the training curriculum.

- [ ] **Step 4: Replace the generic visual layer**

Define exact palette tokens `--paper: #f7f4ed`, `--ink: #16221d`, `--surface: #fffdf8`, `--brick-yellow: #ffbf3f`, `--brick-blue: #72c1e5`, `--brick-coral: #ed6a46`, and `--brick-green: #65a97b`. Use 2px ink borders, square-to-small radii, 4px offset ink shadows, an ivory grid texture, compressed display headings, visible focus rings, transform-only hover/press feedback, responsive grids, print cleanup, and a `prefers-reduced-motion: reduce` override.

- [ ] **Step 5: Add the favicon**

Create a dependency-free SVG with an ivory canvas and three overlapping yellow, blue, and coral geometric blocks outlined in `#16221d`.

- [ ] **Step 6: Run the contract test**

Run: `npm test -- tests/site-theme.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit the shared theme**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css src/pages/index.astro src/pages/404.astro public/favicon.svg tests/site-theme.test.ts
git commit -m "feat: add construction theme shell"
```

---

### Task 3: Apply family-aware styling to the catalogue and detail pages

**Files:**
- Modify: `src/pages/briques/index.astro`
- Modify: `src/pages/briques/[id].astro`
- Modify: `src/styles/global.css`
- Test: `tests/site-theme.test.ts`

**Interfaces:**
- Consumes: the existing `family` values `a` through `f` and all current brick-view labels.
- Produces: `data-family` hooks on family sections/cards/detail shells and construction-style catalogue/detail layouts.

- [ ] **Step 1: Annotate the catalogue without changing data flow**

Add a `.catalog-hero` header with a modular visual counter, place `data-family={group.family}` on each family section, and `data-family={brick.data.family}` on every card. Preserve the same groups, links, status labels, owner labels, duration, and structure counts.

- [ ] **Step 2: Annotate and compose the detail view**

Wrap the detail page in `.detail-page` with `data-family={brick.data.family}`, keep the back link, make metadata a construction-panel grid, and keep the native progress element and rendered MDX unchanged.

- [ ] **Step 3: Add family color mappings and component states**

Map families A/F to yellow, B to blue, C/E to coral, and D to green through `[data-family]` custom properties. Give cards an ink border and offset shadow, vary their top color block, add hover/active/focus states, and keep the reading column within 65 characters.

- [ ] **Step 4: Run focused and full validation**

Run: `npm test -- tests/site-theme.test.ts && npm test && npm run content:check && npm run build`

Expected: 13 tests pass, content reports 24 valid bricks, and Astro generates 27 public pages including `/` and `/404.html`.

- [ ] **Step 5: Commit the themed catalogue and details**

```bash
git add src/pages/briques/index.astro 'src/pages/briques/[id].astro' src/styles/global.css
git commit -m "feat: theme brick catalogue and details"
```

---

### Task 4: Inspect, deploy, and verify production

**Files:**
- Modify: `.gitignore`
- Verify: `dist/`, local browser, Vercel production URLs.

**Interfaces:**
- Consumes: the successful static build and linked Vercel project `paulpm1s-projects/formation-ia`.
- Produces: a READY production deployment and HTTP 200 responses for `/`, `/briques/`, a representative detail page, and `/404.html`.

- [ ] **Step 1: Keep only local Vercel state ignored**

Replace the broad generated `.env*` rule with `.env.local` so a future `.env.example` can still be committed, while preserving `.vercel` as ignored.

- [ ] **Step 2: Inspect desktop and mobile locally**

Run `npm run dev -- --host 127.0.0.1 --port 4321`, then inspect `/`, `/briques/`, and `/briques/a2/` at desktop and narrow viewport widths. Verify layout, navigation, focus, overflow, family accents, and console errors.

- [ ] **Step 3: Deploy the verified workspace to production**

Run: `npx --yes vercel@latest deploy --prod --yes --scope paulpm1s-projects`

Expected: deployment target `production`, state `READY`, alias `https://formation-ia-ruby.vercel.app`.

- [ ] **Step 4: Verify public responses and content**

Run:

```bash
curl -fsSIL https://formation-ia-ruby.vercel.app/
curl -fsSIL https://formation-ia-ruby.vercel.app/briques/
curl -fsSIL https://formation-ia-ruby.vercel.app/briques/a2/
curl -fsS https://formation-ia-ruby.vercel.app/ | rg 'Les briques du Vibe Coding'
```

Expected: every header request returns HTTP 200 and the production root contains the approved title.

- [ ] **Step 5: Commit deployment hygiene**

```bash
git add .gitignore docs/superpowers/plans/2026-07-13-kit-construction-theme.md
git commit -m "chore: document themed Vercel delivery"
```
