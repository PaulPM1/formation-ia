# A2 Paired Choices and Block A Renumbering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer les huit produits du prioriteur A2 par quatre paires équivalentes dans un ordre d’exercice non progressif, puis renommer les briques A4 et A5 en A3 et A4.

**Architecture:** Le manifeste porte les quatre valeurs pédagogiques `chat`, `object`, `work` et `code`, chacune associée à deux noms de produits. Le composant garde son moteur d’état générique mais rend une radio par paire. La renumérotation modifie les identifiants canoniques à la source afin que contenu, routes, liens wiki et QA restent alignés.

**Tech Stack:** Astro 7, TypeScript 6, HTML/CSS natifs, Node test runner via `tsx`, Playwright.

## Global Constraints

- Les situations suivent l’ordre fixe `code → chat → work → object`.
- Claude et OpenAI sont deux réponses équivalentes à l’intérieur de chaque paire.
- Le prioriteur affiche exactement quatre radios par situation.
- Les briques B0 à F2 conservent leurs identifiants et leurs ordres actuels.
- Les contrôles restent natifs, le focus visible, le feedback annoncé et les corrections lisibles sans JavaScript.
- Aucun état ne repose uniquement sur la couleur et `prefers-reduced-motion` neutralise le mouvement non essentiel.
- La navigation A2 rejoint directement `a3-three-costs` et aucune route `a5-*` ne subsiste.

---

### Task 1: Contractualiser les quatre paires et l’ordre non progressif

**Files:**
- Modify: `tests/presentation-content.test.ts`
- Modify: `tests/solution-prioritizer-state.test.ts`

**Interfaces:**
- Consumes: `PRESENTATION_SLIDES` et les fonctions d’état existantes.
- Produces: contrat de données `Option = { id, need, solutions }` et réponses `code`, `chat`, `work`, `object`.

- [ ] **Step 1: Écrire le test de contenu en échec**

Remplacer l’assertion A2 par un contrat qui vérifie les quatre paires et le mélange fixe :

```ts
test('A2 propose quatre paires équivalentes dans un ordre non progressif', () => {
  const exercise = PRESENTATION_SLIDES.find((slide) => slide.id === 'a2-prioritize');
  const options = exercise?.visual.data.options as Array<{
    id: string;
    need: string;
    solutions: string[];
  }>;
  const scenarios = exercise?.visual.data.scenarios as Array<{ answer: string }>;

  assert.deepEqual(options, [
    { id: 'chat', need: 'Réponse', solutions: ['Claude Chat', 'ChatGPT Chat'] },
    { id: 'object', need: 'Objet', solutions: ['Claude Artifacts', 'ChatGPT Canvas'] },
    { id: 'work', need: 'Livrable', solutions: ['Claude Cowork', 'ChatGPT Work'] },
    { id: 'code', need: 'Projet', solutions: ['Claude Code', 'Codex'] },
  ]);
  assert.deepEqual(scenarios.map((scenario) => scenario.answer), [
    'code', 'chat', 'work', 'object',
  ]);
});
```

- [ ] **Step 2: Adapter les tests d’état aux valeurs de paire**

Utiliser `chat`, `work` et `code` à la place des identifiants de produits :

```ts
const selected = chooseSolution(createPrioritizerState(), 'chat');
const revealed = revealPrioritizerAnswer(selected, 'chat');
assert.equal(revealed.score, 1);

const wrong = revealPrioritizerAnswer(
  chooseSolution(createPrioritizerState(), 'work'),
  'chat',
);
assert.equal(wrong.score, 0);
```

- [ ] **Step 3: Exécuter les tests et constater le RED**

Run:

```bash
npx tsx --test tests/presentation-content.test.ts tests/solution-prioritizer-state.test.ts
```

Expected: FAIL, car le manifeste expose encore huit options et les réponses individuelles `chatgpt-*` ou `claude-*`.

- [ ] **Step 4: Commit du contrat de test**

```bash
git add tests/presentation-content.test.ts tests/solution-prioritizer-state.test.ts
git commit -m "Tester les choix A2 par paires"
```

---

### Task 2: Rendre quatre paires dans le prioriteur

**Files:**
- Modify: `src/presentation/manifests/a.ts`
- Modify: `src/components/presentation/visuals/a/SolutionPrioritizer.astro`
- Modify: `scripts/qa-a2-prioritizer.mjs`
- Modify: `tests/presentation-visuals.test.ts`

**Interfaces:**
- Consumes: les valeurs `code`, `chat`, `work`, `object` définies par Task 1.
- Produces: quatre radios dont le libellé expose deux produits, et quatre corrections au niveau de la paire.

- [ ] **Step 1: Rechercher les recommandations Web actuelles avant le changement HTML**

Run:

```bash
npx -y modern-web-guidance@latest search "accessible radio group validation progressive enhancement" --skill-version 2026_05_16-c5e7870
```

Retrieve the closest radio/form guide returned by the search and preserve native `fieldset`, `legend`, `input[type="radio"]`, `label` and `required` behavior.

- [ ] **Step 2: Ajouter un test source en échec pour quatre radios par paire**

Dans `tests/presentation-visuals.test.ts`, vérifier la nouvelle forme de données rendue :

```ts
test('le prioriteur A2 rend une radio par paire de solutions', async () => {
  const source = await read('src/components/presentation/visuals/a/SolutionPrioritizer.astro');
  assert.match(source, /option\.solutions/);
  assert.match(source, /join\(['"] \/ ['"]\)/);
  assert.doesNotMatch(source, /option\.ecosystem/);
});
```

Run:

```bash
npx tsx --test tests/presentation-visuals.test.ts
```

Expected: FAIL sur `option.solutions`, absent du composant actuel.

- [ ] **Step 3: Remplacer les options et mélanger les situations dans le manifeste**

Définir les options dans cet ordre :

```ts
options: [
  { id: 'chat', need: 'Réponse', solutions: ['Claude Chat', 'ChatGPT Chat'] },
  { id: 'object', need: 'Objet', solutions: ['Claude Artifacts', 'ChatGPT Canvas'] },
  { id: 'work', need: 'Livrable', solutions: ['Claude Cowork', 'ChatGPT Work'] },
  { id: 'code', need: 'Projet', solutions: ['Claude Code', 'Codex'] },
],
```

Réordonner les situations en `code`, `chat`, `work`, `object`. Retirer les noms d’écosystème de leur contexte, utiliser une valeur de paire dans `answer` et `tempting`, et écrire les corrections ainsi :

```ts
{
  title: 'Corriger un formulaire',
  situation: 'Le dépôt local du site est ouvert dans votre agent de code avec ses consignes projet. Vous devez corriger le formulaire mobile, lancer les tests et présenter le diff.',
  answer: 'code',
  reason: 'Claude Code comme Codex peuvent travailler dans le dépôt, exécuter les tests et produire le diff attendu.',
  tempting: 'object',
  temptingReason: 'Artifacts ou Canvas peuvent montrer du code, mais ne remplacent pas les tests et le diff du dépôt réel.',
}
```

Appliquer le même principe aux trois autres situations. Mettre le critère de réussite au niveau des quatre paires.

- [ ] **Step 4: Adapter le composant à `solutions: string[]`**

Remplacer l’interface et le libellé :

```astro
interface Option {
  id: string;
  need: string;
  solutions: string[];
}

const optionName = (id: string) => options
  .find((option) => option.id === id)?.solutions.join(' / ') ?? id;
```

Rendre une radio par option :

```astro
{options.map((option, optionIndex) => (
  <label data-option-label={option.id}>
    <input
      type="radio"
      name={`${slide.id}-scenario-${scenarioIndex}`}
      value={option.id}
      required={optionIndex === 0}
    />
    <span>
      <small>{option.need}</small>
      {option.solutions.join(' / ')}
    </span>
  </label>
))}
```

Simplifier `.prioritizer__options` en grille de quatre choix et supprimer le groupement imbriqué par besoin devenu inutile.

- [ ] **Step 5: Adapter la QA A2 à l’ordre mélangé**

Utiliser une erreur volontaire au deuxième cas pour conserver un score 3/4 :

```js
const choices = ['code', 'work', 'work', 'object'];
```

Ajouter une assertion Playwright qui exige exactement quatre radios dans la situation visible :

```js
if (await page.locator('[data-prioritizer-scenario]:visible input[type="radio"]').count() !== 4) {
  failures.push('le prioriteur doit afficher quatre paires');
}
```

- [ ] **Step 6: Exécuter les tests ciblés et obtenir le GREEN**

Run:

```bash
npx tsx --test tests/presentation-content.test.ts tests/presentation-visuals.test.ts tests/solution-prioritizer-state.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit du prioriteur**

```bash
git add src/presentation/manifests/a.ts src/components/presentation/visuals/a/SolutionPrioritizer.astro scripts/qa-a2-prioritizer.mjs tests/presentation-content.test.ts tests/presentation-visuals.test.ts tests/solution-prioritizer-state.test.ts
git commit -m "Regrouper les solutions A2 par paires"
```

---

### Task 3: Renommer A4 en A3 et A5 en A4

**Files:**
- Rename: `src/content/briques/a-comprendre/a4-couts.mdx` → `src/content/briques/a-comprendre/a3-couts.mdx`
- Rename: `src/content/briques/a-comprendre/a5-biais-cognitifs.mdx` → `src/content/briques/a-comprendre/a4-biais-cognitifs.mdx`
- Rename: `scripts/qa-a5-mission.mjs` → `scripts/qa-a4-mission.mjs`
- Modify: `src/content/brick-files.ts`
- Modify: `src/content/briques/b-interfaces/b4-claude-code.mdx`
- Modify: `src/presentation/manifests/a.ts`
- Modify: `scripts/qa-presenter.mjs`
- Modify: `package.json`
- Modify: `tests/brick-inventory.test.ts`
- Modify: `tests/presentation-content.test.ts`
- Modify: `tests/presentation-routing.test.ts`
- Modify: `tests/presentation-scene-data.test.ts`
- Modify: `tests/presentation-visuals.test.ts`

**Interfaces:**
- Consumes: l’ordre pédagogique 3 pour les coûts et 4 pour les biais.
- Produces: identifiants canoniques `a3` et `a4`, routes `/presenter/a3/a3-*` et `/presenter/a4/a4-*`.

- [ ] **Step 1: Écrire les assertions de renommage en échec**

Dans `tests/presentation-content.test.ts`, remplacer les identifiants attendus :

```ts
const expectedIds = [
  'a1', 'a2', 'a3', 'a4', 'b0', 'b1', 'b2', 'b3', 'b4', 'b4-bis',
  'c1', 'c2', 'c3',
];
```

Remplacer `a4-three-costs` à `a4-checkpoint` par `a3-*`, puis `a5-convincing` à `a5-mission` par `a4-*`.

Dans `tests/presentation-routing.test.ts`, exiger :

```ts
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'a2-prioritize').next?.id, 'a3-three-costs');
assert.ok(PRESENTATION_SLIDES.every((slide) => !slide.id.startsWith('a5-')));
```

Mettre à jour l’inventaire des briques vers `a1`, `a2`, `a3`, `a4`.

- [ ] **Step 2: Exécuter les tests et constater le RED**

Run:

```bash
npx tsx --test tests/brick-inventory.test.ts tests/presentation-content.test.ts tests/presentation-routing.test.ts
```

Expected: FAIL, car les sources utilisent encore `a4` et `a5`.

- [ ] **Step 3: Renommer les sources de contenu**

Utiliser `apply_patch` avec `Move to` pour renommer les deux fichiers. Modifier leur frontmatter :

```yaml
# a3-couts.mdx
id: a3
order: 3

# a4-biais-cognitifs.mdx
id: a4
order: 4
```

Dans `src/content/briques/b-interfaces/b4-claude-code.mdx`, remplacer le prérequis `a5` par `a4`. Dans `src/content/brick-files.ts`, attendre `a3` et `a4`.

- [ ] **Step 4: Renommer les decks, slides et liens wiki**

Dans `src/presentation/manifests/a.ts` :

```ts
// Les coûts
brickId: 'a3'
id: 'a3-three-costs' // puis a3-context-meter, a3-agentic, a3-budget, a3-checkpoint
wikiLink('a3', ...)

// Biais cognitifs
brickId: 'a4'
id: 'a4-convincing' // puis a4-biases, a4-risk, a4-method, a4-mission
wikiLink('a4', ...)
```

Conserver les champs `order: 3` et `order: 4`.

- [ ] **Step 5: Renommer la QA des biais et ses consommateurs**

Renommer le script avec `apply_patch` et remplacer :

```js
const route = '/presenter/a4/a4-mission/';
```

Dans `package.json` :

```json
"qa:a4-mission": "node scripts/qa-a4-mission.mjs"
```

Mettre à jour `scripts/qa-presenter.mjs` vers `/presenter/a4/a4-mission/` et `/presenter/a4/a4-risk/`, ainsi que les assertions correspondantes de `tests/presentation-visuals.test.ts`.

- [ ] **Step 6: Mettre à jour les variantes et données de scène testées**

Dans `tests/presentation-visuals.test.ts`, utiliser `a3-*` pour `getContextBudgetVariant` et `a4-*` pour `getVerificationVariant`. Dans `tests/presentation-scene-data.test.ts`, vérifier `a3-checkpoint`.

- [ ] **Step 7: Exécuter les tests ciblés et obtenir le GREEN**

Run:

```bash
npx tsx --test tests/brick-inventory.test.ts tests/presentation-content.test.ts tests/presentation-routing.test.ts tests/presentation-scene-data.test.ts tests/presentation-visuals.test.ts
```

Expected: PASS.

- [ ] **Step 8: Vérifier l’absence de références actives obsolètes**

Run:

```bash
rg -n "a5-|/a5/|qa:a5-mission|scripts/qa-a5-mission" src tests scripts package.json
```

Expected: aucune sortie.

- [ ] **Step 9: Commit de la renumérotation**

```bash
git add src/content src/presentation scripts package.json tests
git commit -m "Renuméroter les briques A3 et A4"
```

---

### Task 4: Vérifier le rendu et publier la PR

**Files:**
- Modify if a verified defect requires it: `src/components/presentation/visuals/a/SolutionPrioritizer.astro`
- Modify if a verified defect requires it: `scripts/qa-a2-prioritizer.mjs`
- Modify: PR #10 body via GitHub after verification

**Interfaces:**
- Consumes: toutes les routes et interactions produites par Tasks 2 et 3.
- Produces: branche vérifiée, poussée et décrite dans la PR #10.

- [ ] **Step 1: Exécuter la suite complète et le build**

Run:

```bash
npm test
npm run build
```

Expected: tous les tests passent ; le build annonce 23 briques et 73 slides, sans erreur Astro ou TypeScript.

- [ ] **Step 2: Exécuter les QA navigateur**

Run:

```bash
npm run qa:a2-prioritizer
npm run qa:a4-mission
npm run qa:font-floor
npm run qa:presenter
```

Expected: les quatre commandes passent ; le présentateur valide 73 routes et 74 pages.

- [ ] **Step 3: Contrôler les routes générées**

Run:

```bash
find dist/presenter -type d -path '*/a5*' -print
npx tsx -e "import { PRESENTATION_DECKS, PRESENTATION_SLIDES } from './src/presentation/manifests/index.ts'; console.log(PRESENTATION_DECKS.length, PRESENTATION_SLIDES.length)"
```

Expected: aucune route A5 ; sortie `13 73`.

- [ ] **Step 4: Inspecter visuellement le prioriteur**

Capturer `a2-prioritize` en desktop, mobile et après correction. Vérifier :

- silencieux : chaque choix nomme deux produits et une sortie ;
- coup d’œil : quatre radios sont immédiatement repérables ;
- nécessité : l’erreur volontaire explique pourquoi une paire est trop faible ou trop large.

- [ ] **Step 5: Vérifier le diff et pousser**

Run:

```bash
git diff --check
git status -sb
git push
```

Expected: aucun défaut d’espace, worktree propre après commit, branche synchronisée avec `origin/creer-branche-commit-pr`.

- [ ] **Step 6: Mettre à jour la PR #10**

Compléter la description avec les changements réalisés et les résultats exacts de `npm test`, du build et des quatre QA. Conserver la PR en brouillon sauf demande explicite de passage en revue.
