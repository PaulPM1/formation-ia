# Bloc B parcours miroir Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer le Bloc B en laboratoire obligatoire où chaque participant choisit Claude ou OpenAI, puis teste Chat, objet interactif, travail multiétape et agent de code avec les mêmes situations et les mêmes preuves.

**Architecture:** Les fiches B0 à B4 partagent un sélecteur d’écosystème amélioré progressivement et conservent les consignes comme source de vérité. Le ZIP public devient un jeu de données indépendant par exercice. Les slides restent génériques, réutilisent `solution-comparison` et `solution-prioritizer`, et B4 rejoint le parcours principal.

**Tech Stack:** Astro 7, MDX, TypeScript 6, JavaScript navigateur sans dépendance, Node.js 22, `node:test`, Playwright, `fflate`.

## Global Constraints

- Le Bloc B contient 75 minutes de socle : B0 5, B1 12, B2 18, B3 20 et B4 20 minutes.
- B4-bis reste un rattrapage isolé de 10 minutes.
- Le choix persistant utilise uniquement la clé locale `bloc-b-ecosystem`.
- Sans JavaScript, les deux voies Claude et OpenAI restent visibles.
- Les fichiers analysés par le vérificateur B3 ne quittent jamais le navigateur.
- Le dossier source `kits/bloc-b-assistant/` et l’URL publique `public/kits/bloc-b-assistant.zip` restent stables.
- Les prompts et procédures vivent dans les fiches MDX, pas dans le ZIP.
- Chaque exercice B1 à B4 expose dans cet ordre : Situation, Pourquoi cette surface, Fichiers à fournir, Prompt à envoyer, Manipulation à effectuer, Tester mon résultat, Corriger un échec.
- Les données restent fictives et chaque exercice redémarre directement depuis le kit.
- Le tiret cadratin Unicode U+2014 reste interdit par `CLAUDE.md`.
- Les visuels suivent `.agents/skills/slide-visual-director/references/visual-contract.md`.
- Aucun nouveau paquet runtime n’est ajouté.

---

### Task 1: Accepter la rubrique générique « Pratique guidée »

**Files:**
- Modify: `src/content/brick-model.ts`
- Modify: `src/content/brick-view.ts`
- Modify: `tests/brick-validation.test.ts`
- Modify: `tests/brick-view.test.ts`

**Interfaces:**
- Consumes: les titres `##` extraits des fichiers MDX.
- Produces: `COMMON_HEADING_REQUIREMENTS`, une liste de groupes de titres alternatifs utilisée par la validation et la jauge de structure.

- [ ] **Step 1: Écrire les tests d’acceptation du nouveau titre**

Ajouter dans `tests/brick-validation.test.ts` :

```ts
test('accepte Pratique guidée comme rubrique commune', () => {
  const guidedBody = conceptBody.replace(
    '## Pratique avec Claude',
    '## Pratique guidée',
  );

  assert.deepEqual(validateBrickDocuments([makeBrick({}, guidedBody)]), []);
});

test('rejette une brique sans aucune rubrique de pratique', () => {
  const withoutPractice = conceptBody.replace(
    '## Pratique avec Claude',
    '## Démonstration libre',
  );

  const issues = validateBrickDocuments([makeBrick({}, withoutPractice)]);

  assert.ok(issues.some((issue) => issue.message.includes('Pratique guidée')));
});
```

Dans `tests/brick-view.test.ts`, remplacer `Pratique avec Claude` par
`Pratique guidée` dans le test de complétude et conserver le résultat
`12/13`.

- [ ] **Step 2: Vérifier que le nouveau titre échoue**

Run:

```bash
npm test -- --test-name-pattern="Pratique guidée|complétude"
```

Expected: FAIL, car `Pratique guidée` n’est pas encore un titre reconnu.

- [ ] **Step 3: Remplacer la liste plate par des groupes de titres**

Dans `src/content/brick-model.ts`, remplacer `COMMON_HEADINGS` par :

```ts
export const COMMON_HEADING_REQUIREMENTS = [
  ['Cap'],
  ['Concept durable'],
  ['Pratique guidée', 'Pratique avec Claude'],
  ['Mission commune'],
  ['Livrable'],
  ['Notes formateur'],
  ['Défis avancés'],
  ['Variantes'],
  ['Dépannage'],
  ['Ressources'],
  ['Ouverture'],
] as const;

export const headingRequirementIsMet = (
  headings: Set<string>,
  alternatives: readonly string[],
) => alternatives.some((heading) => headings.has(heading));
```

Dans `validateBrickDocuments`, construire les exigences ainsi :

```ts
const requiredHeadingGroups = [
  ...COMMON_HEADING_REQUIREMENTS,
  ...TYPE_HEADINGS[parsed.data.type].map((heading) => [heading] as const),
];

for (const alternatives of requiredHeadingGroups) {
  if (!headingRequirementIsMet(headings, alternatives)) {
    issues.push({
      filePath: document.filePath,
      message: `Rubrique obligatoire manquante : ${alternatives[0]}`,
    });
  }
}
```

Dans `src/content/brick-view.ts`, importer
`COMMON_HEADING_REQUIREMENTS` et `headingRequirementIsMet`, puis calculer :

```ts
const requiredHeadingGroups = [
  ...COMMON_HEADING_REQUIREMENTS,
  ...TYPE_HEADINGS[type].map((heading) => [heading] as const),
];
const complete = requiredHeadingGroups.filter((alternatives) =>
  headingRequirementIsMet(presentHeadings, alternatives)
).length;

return {
  complete,
  total: requiredHeadingGroups.length,
  percentage: Math.round((complete / requiredHeadingGroups.length) * 100),
};
```

- [ ] **Step 4: Vérifier la compatibilité ancienne et nouvelle**

Run:

```bash
npm test -- --test-name-pattern="Pratique guidée|brique vide|complétude"
npm run content:check
```

Expected: PASS. Les fiches existantes avec `Pratique avec Claude` restent
valides et les nouvelles fiches peuvent utiliser `Pratique guidée`.

- [ ] **Step 5: Commit**

```bash
git add src/content/brick-model.ts src/content/brick-view.ts tests/brick-validation.test.ts tests/brick-view.test.ts
git commit -m "content: accepter une pratique guidée multi-écosystème"
```

---

### Task 2: Ajouter le sélecteur persistant Claude ou OpenAI

**Files:**
- Create: `src/features/block-b/ecosystem.ts`
- Create: `src/components/block-b/EcosystemSwitch.astro`
- Create: `tests/block-b-ecosystem.test.ts`
- Modify: `src/pages/briques/[id].astro`
- Modify: `tests/site-theme.test.ts`

**Interfaces:**
- Consumes: panneaux MDX portant `data-block-b-panel="claude"` ou
  `data-block-b-panel="openai"`.
- Produces:
  - `type BlockBEcosystem = 'claude' | 'openai'`
  - `BLOCK_B_ECOSYSTEM_STORAGE_KEY`
  - `parseBlockBEcosystem(value): BlockBEcosystem | null`
  - `blockBPanelVisibility(selected, panelValues): boolean[]`
  - le composant `EcosystemSwitch` rendu uniquement pour B0 à B4.

- [ ] **Step 1: Écrire les tests d’état**

Créer `tests/block-b-ecosystem.test.ts` :

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BLOCK_B_ECOSYSTEM_STORAGE_KEY,
  blockBPanelVisibility,
  parseBlockBEcosystem,
} from '../src/features/block-b/ecosystem';

test('n’accepte que claude et openai', () => {
  assert.equal(parseBlockBEcosystem('claude'), 'claude');
  assert.equal(parseBlockBEcosystem('openai'), 'openai');
  assert.equal(parseBlockBEcosystem('autre'), null);
  assert.equal(parseBlockBEcosystem(null), null);
  assert.equal(BLOCK_B_ECOSYSTEM_STORAGE_KEY, 'bloc-b-ecosystem');
});

test('montre les deux voies avant le choix puis une seule après le choix', () => {
  const panels = ['claude', 'openai', 'claude', 'openai'];
  assert.deepEqual(blockBPanelVisibility(null, panels), [true, true, true, true]);
  assert.deepEqual(blockBPanelVisibility('claude', panels), [true, false, true, false]);
  assert.deepEqual(blockBPanelVisibility('openai', panels), [false, true, false, true]);
});
```

- [ ] **Step 2: Vérifier l’échec initial**

Run:

```bash
npm test -- --test-name-pattern="claude et openai|deux voies"
```

Expected: FAIL avec `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implémenter l’état pur**

Créer `src/features/block-b/ecosystem.ts` :

```ts
export const BLOCK_B_ECOSYSTEM_STORAGE_KEY = 'bloc-b-ecosystem';

export const BLOCK_B_ECOSYSTEMS = ['claude', 'openai'] as const;
export type BlockBEcosystem = (typeof BLOCK_B_ECOSYSTEMS)[number];

export const parseBlockBEcosystem = (
  value: string | null | undefined,
): BlockBEcosystem | null => (
  value === 'claude' || value === 'openai' ? value : null
);

export const blockBPanelVisibility = (
  selected: BlockBEcosystem | null,
  panelValues: string[],
) => panelValues.map((value) => selected === null || value === selected);
```

- [ ] **Step 4: Créer le composant accessible**

Créer `src/components/block-b/EcosystemSwitch.astro` avec ce contrat :

```astro
---
interface Props { brickId: string; }
const { brickId } = Astro.props;
---

<aside class="ecosystem-switch" data-block-b-ecosystem-switch>
  <fieldset>
    <legend>Choisissez votre voie pour tout le Bloc B</legend>
    <label>
      <input type="radio" name={`ecosystem-${brickId}`} value="claude" />
      <span>Voie Claude</span>
    </label>
    <label>
      <input type="radio" name={`ecosystem-${brickId}`} value="openai" />
      <span>Voie OpenAI</span>
    </label>
  </fieldset>
  <p data-block-b-ecosystem-status aria-live="polite">
    Aucun choix enregistré : les deux voies restent visibles.
  </p>
</aside>

<script>
  import {
    BLOCK_B_ECOSYSTEM_STORAGE_KEY,
    blockBPanelVisibility,
    parseBlockBEcosystem,
    type BlockBEcosystem,
  } from '../../features/block-b/ecosystem';

  document.querySelectorAll<HTMLElement>('[data-block-b-ecosystem-switch]').forEach((switcher) => {
    const page = switcher.closest<HTMLElement>('[data-block-b-experience]');
    const controls = Array.from(switcher.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    const status = switcher.querySelector<HTMLElement>('[data-block-b-ecosystem-status]');
    if (!page || !status) return;

    const render = (selected: BlockBEcosystem | null) => {
      const panels = Array.from(page.querySelectorAll<HTMLElement>('[data-block-b-panel]'));
      const visibility = blockBPanelVisibility(
        selected,
        panels.map((panel) => panel.dataset.blockBPanel ?? ''),
      );
      panels.forEach((panel, index) => { panel.hidden = !visibility[index]; });
      controls.forEach((control) => { control.checked = control.value === selected; });
      page.dataset.blockBEcosystem = selected ?? 'unselected';
      status.textContent = selected === null
        ? 'Aucun choix enregistré : les deux voies restent visibles.'
        : `Voie ${selected === 'claude' ? 'Claude' : 'OpenAI'} active pour le Bloc B.`;
    };

    let initial: BlockBEcosystem | null = null;
    try {
      initial = parseBlockBEcosystem(localStorage.getItem(BLOCK_B_ECOSYSTEM_STORAGE_KEY));
    } catch {}
    render(initial);

    controls.forEach((control) => {
      control.addEventListener('change', () => {
        const selected = parseBlockBEcosystem(control.value);
        if (!selected) return;
        try { localStorage.setItem(BLOCK_B_ECOSYSTEM_STORAGE_KEY, selected); } catch {}
        render(selected);
      });
    });
  });
</script>
```

Ajouter dans le même composant des styles locaux pour :

- un `fieldset` sans bordure externe superflue ;
- deux labels d’au moins `2.75rem` de hauteur ;
- un état sélectionné avec bordure, fond et texte, pas la couleur seule ;
- `:focus-visible` ;
- `:global(.block-b-path)` avec marge, padding, bordure et fond pour séparer
  clairement la procédure produit du prompt commun ;
- `:global(.block-b-path h3)` avec une marge haute réduite à l’intérieur du
  panneau ;
- `[data-block-b-panel][hidden] { display: none; }` via `:global(...)` ;
- aucune transition indispensable.

- [ ] **Step 5: Monter le composant uniquement sur B0 à B4**

Dans `src/pages/briques/[id].astro`, importer le composant puis définir :

```ts
import EcosystemSwitch from '../../components/block-b/EcosystemSwitch.astro';

const MIRRORED_BLOCK_B_IDS = new Set(['b0', 'b1', 'b2', 'b3', 'b4']);
const isMirroredBlockB = MIRRORED_BLOCK_B_IDS.has(brick.data.id);
```

Modifier le conteneur et insérer le composant avant l’article :

```astro
<div
  class="detail-page"
  data-family={brick.data.family}
  data-block-b-experience={isMirroredBlockB ? '' : undefined}
>
  <!-- en-tête et fiche existants -->
  {isMirroredBlockB && <EcosystemSwitch brickId={brick.data.id} />}
  <article class="brick-content">
    <Content />
  </article>
</div>
```

- [ ] **Step 6: Verrouiller le repli sans JavaScript dans les tests source**

Dans `tests/site-theme.test.ts`, ajouter :

```ts
test('le Bloc B monte un sélecteur progressif sans supprimer le contenu MDX', async () => {
  const [detail, switcher] = await Promise.all([
    read('src/pages/briques/[id].astro'),
    read('src/components/block-b/EcosystemSwitch.astro'),
  ]);

  assert.match(detail, /MIRRORED_BLOCK_B_IDS/);
  assert.match(detail, /<EcosystemSwitch/);
  assert.match(switcher, /type="radio"/);
  assert.match(switcher, /aria-live="polite"/);
  assert.match(switcher, /localStorage\.setItem/);
  assert.match(switcher, /data-block-b-panel/);
  assert.doesNotMatch(switcher, /onclick=/);
});
```

- [ ] **Step 7: Vérifier et commit**

Run:

```bash
npm test -- --test-name-pattern="claude et openai|deux voies|sélecteur progressif"
npm run typecheck
```

Expected: PASS.

```bash
git add src/features/block-b/ecosystem.ts src/components/block-b/EcosystemSwitch.astro 'src/pages/briques/[id].astro' tests/block-b-ecosystem.test.ts tests/site-theme.test.ts
git commit -m "feat: mémoriser la voie Claude ou OpenAI"
```

---

### Task 3: Ajouter le vérificateur local du brief B3

**Files:**
- Create: `src/features/block-b/brief-validator.ts`
- Create: `src/components/block-b/BriefValidator.astro`
- Create: `tests/block-b-brief-validator.test.ts`
- Modify: `src/pages/briques/[id].astro`
- Modify: `tests/site-theme.test.ts`

**Interfaces:**
- Consumes: le texte d’un `brief-du-jour.md` et une confirmation humaine que
  les fichiers sources sont restés inchangés.
- Produces:
  - `BriefCheck`
  - `validateBlockBBrief(markdown): BriefCheck[]`
  - un formulaire sans réseau monté uniquement sur B3.

- [ ] **Step 1: Écrire les tests du parseur**

Créer `tests/block-b-brief-validator.test.ts` :

```ts
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { validateBlockBBrief } from '../src/features/block-b/brief-validator';

const validBrief = `# Brief du jour
## Actions du jour
- [N01] Envoyer l’agenda. [source: demandes.md]
- [N06] Transmettre le nombre. [source: messages.md]
## À confirmer
- [N03, N05] Confirmer le 18 ou le 19 septembre. [sources: reunion.md ; messages.md]
## Plus tard
- [N02] Préparer les icônes. [source: demandes.md]
- [N04] Archiver après validation. [source: reunion.md]
`;

test('accepte un brief structuré, sourcé et incertain', () => {
  const checks = validateBlockBBrief(validBrief);
  assert.deepEqual(checks.map((check) => check.id), [
    'structure', 'sources', 'uncertainty',
  ]);
  assert.ok(checks.every((check) => check.ok));
});

test('nomme séparément chaque échec', () => {
  const checks = validateBlockBBrief(
    validBrief
      .replace('## À confirmer', '## Décision')
      .replace('[source: demandes.md]', '[source: inconnue.md]'),
  );
  assert.equal(checks.find((check) => check.id === 'structure')?.ok, false);
  assert.equal(checks.find((check) => check.id === 'sources')?.ok, false);
  assert.equal(checks.find((check) => check.id === 'uncertainty')?.ok, false);
});

test('le composant lit le fichier local sans requête réseau', async () => {
  const source = await readFile(
    new URL('../src/components/block-b/BriefValidator.astro', import.meta.url),
    'utf8',
  ).catch(() => '');
  assert.match(source, /type="file"/);
  assert.match(source, /file\.text\(\)/);
  assert.match(source, /aria-live="polite"/);
  assert.doesNotMatch(source, /\bfetch\(/);
  assert.doesNotMatch(source, /XMLHttpRequest/);
});
```

- [ ] **Step 2: Vérifier les échecs initiaux**

Run:

```bash
npm test -- --test-name-pattern="brief structuré|chaque échec|requête réseau"
```

Expected: FAIL avec le module et le composant absents.

- [ ] **Step 3: Implémenter le parseur pur**

Créer `src/features/block-b/brief-validator.ts` avec :

```ts
export type BriefCheck = {
  id: 'structure' | 'sources' | 'uncertainty';
  label: string;
  ok: boolean;
};

const REQUIRED_SECTIONS = ['Actions du jour', 'À confirmer', 'Plus tard'];
const EXPECTED_NOTE_SOURCES = {
  N01: 'demandes.md',
  N02: 'demandes.md',
  N03: 'reunion.md',
  N04: 'reunion.md',
  N05: 'messages.md',
  N06: 'messages.md',
} as const;

const parseSections = (markdown: string) => {
  const sections = new Map<string, string[]>();
  let current: string | null = null;
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = heading[1].trim();
      if (!sections.has(current)) sections.set(current, []);
    } else if (current) {
      sections.get(current)?.push(line);
    }
  }
  return sections;
};

export function validateBlockBBrief(markdown: string): BriefCheck[] {
  const sections = parseSections(markdown);
  const authoredSections = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)]
    .map(([, heading]) => heading.trim());
  const structure = authoredSections.length === REQUIRED_SECTIONS.length
    && authoredSections.every((heading, index) => heading === REQUIRED_SECTIONS[index]);
  const actionLines = REQUIRED_SECTIONS.flatMap((heading) => sections.get(heading) ?? [])
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '));
  const counts = Object.fromEntries(
    Object.keys(EXPECTED_NOTE_SOURCES).map((noteId) => [noteId, 0]),
  ) as Record<string, number>;
  const associated = actionLines.length > 0 && actionLines.every((line) => {
    const noteIds = [...line.matchAll(/\bN\d{2}\b/g)].map(([noteId]) => noteId);
    const sourceBlock = line.match(/\[sources?:\s*([^\]]+)\]/i)?.[1] ?? '';
    const citedSources = sourceBlock.match(/[a-z0-9._-]+\.md/gi) ?? [];
    const expectedSources: string[] = [...new Set(noteIds.flatMap((noteId) => (
      noteId in EXPECTED_NOTE_SOURCES
        ? [EXPECTED_NOTE_SOURCES[noteId as keyof typeof EXPECTED_NOTE_SOURCES]]
        : []
    )))];
    for (const noteId of noteIds) if (noteId in counts) counts[noteId] += 1;
    return noteIds.length > 0
      && noteIds.every((noteId) => noteId in EXPECTED_NOTE_SOURCES)
      && citedSources.length === expectedSources.length
      && citedSources.every((source) => expectedSources.includes(source));
  });
  const sources = associated && Object.values(counts).every((count) => count === 1);
  const uncertaintyText = (sections.get('À confirmer') ?? []).join('\n');
  const uncertainty = /\bN03\b/.test(uncertaintyText)
    && /\bN05\b/.test(uncertaintyText)
    && (
      /\b18\b[^\n]{0,120}\bou\b[^\n]{0,120}\b19\b/i.test(uncertaintyText)
      || /\b19\b[^\n]{0,120}\bou\b[^\n]{0,120}\b18\b/i.test(uncertaintyText)
    )
    && /septembre/i.test(uncertaintyText);

  return [
    { id: 'structure', label: 'Les trois sections sont présentes dans le bon ordre.', ok: structure },
    { id: 'sources', label: 'Les six notes citent le bon fichier sur la même action.', ok: sources },
    { id: 'uncertainty', label: 'Le conflit du 18 et du 19 septembre reste à confirmer.', ok: uncertainty },
  ];
}
```

- [ ] **Step 4: Créer le formulaire local**

Créer `src/components/block-b/BriefValidator.astro`. Le HTML initial doit
afficher quatre lignes neutres, dont la quatrième est une confirmation humaine :

```astro
<section class="brief-validator" aria-labelledby="brief-validator-title">
  <h2 id="brief-validator-title">Vérificateur local du brief</h2>
  <p id="brief-validator-privacy">
    Le fichier est lu uniquement dans ce navigateur et n’est jamais envoyé.
  </p>
  <form data-block-b-brief-validator>
    <label for="block-b-brief-file">Fichier brief-du-jour.md</label>
    <input
      id="block-b-brief-file"
      name="brief"
      type="file"
      accept=".md,text/markdown,text/plain"
      required
      aria-describedby="brief-validator-privacy"
    />
    <label>
      <input type="checkbox" name="originals" required />
      <span>J’ai vérifié que les trois fichiers sources sont inchangés.</span>
    </label>
    <button type="submit">Tester mon résultat</button>
  </form>
  <ul data-block-b-brief-results aria-live="polite" aria-atomic="true">
    <li data-check="structure" data-state="pending">Structure : à vérifier</li>
    <li data-check="sources" data-state="pending">Sources : à vérifier</li>
    <li data-check="uncertainty" data-state="pending">Incertitude : à vérifier</li>
    <li data-check="originals" data-state="pending">Originaux : à confirmer</li>
  </ul>
</section>
```

Le script doit appeler `file.text()`, passer le texte à
`validateBlockBBrief`, puis écrire `Réussi : …` ou `Échec : …` dans chaque
ligne. Pour chaque contrôle, il doit aussi fixer
`item.dataset.state = check.ok ? 'pass' : 'fail'`. Le quatrième résultat vaut
réussi uniquement si la case `originals` est cochée. Aucun contenu du fichier
ne doit être placé dans le DOM, les logs ou `localStorage`.

Les styles doivent utiliser texte, symbole `✓` ou `×`, bordure et couleur pour
les états. Le bouton et les entrées conservent un focus visible.

- [ ] **Step 5: Monter le vérificateur après la fiche B3**

Dans `src/pages/briques/[id].astro` :

```astro
---
import BriefValidator from '../../components/block-b/BriefValidator.astro';
---

<article class="brick-content">
  <Content />
  {brick.data.id === 'b3' && <BriefValidator />}
</article>
```

Dans `tests/site-theme.test.ts`, étendre le test Bloc B avec :

```ts
assert.match(detail, /brick\.data\.id === 'b3'/);
assert.match(detail, /<BriefValidator/);
```

- [ ] **Step 6: Vérifier et commit**

Run:

```bash
npm test -- --test-name-pattern="brief structuré|chaque échec|requête réseau|sélecteur progressif"
npm run typecheck
```

Expected: PASS.

```bash
git add src/features/block-b/brief-validator.ts src/components/block-b/BriefValidator.astro 'src/pages/briques/[id].astro' tests/block-b-brief-validator.test.ts tests/site-theme.test.ts
git commit -m "feat: vérifier le brief B3 dans le navigateur"
```

---

### Task 4: Transformer le ZIP en kit d’entraînement

**Files:**
- Move: `kits/bloc-b-assistant/README.md` to `kits/bloc-b-assistant/LIRE-EN-PREMIER.md`
- Move: `kits/bloc-b-assistant/inbox/01-demandes.md` to `kits/bloc-b-assistant/notes/demandes.md`
- Move: `kits/bloc-b-assistant/inbox/02-reunion.md` to `kits/bloc-b-assistant/notes/reunion.md`
- Move: `kits/bloc-b-assistant/inbox/03-messages.md` to `kits/bloc-b-assistant/notes/messages.md`
- Create: `kits/bloc-b-assistant/mission-agent/sources/demandes.md`
- Create: `kits/bloc-b-assistant/mission-agent/sources/reunion.md`
- Create: `kits/bloc-b-assistant/mission-agent/sources/messages.md`
- Move: `kits/bloc-b-assistant/sortie/README.md` to `kits/bloc-b-assistant/mission-agent/sortie/README.md`
- Move: `kits/bloc-b-assistant/inbox-sha256.json` to `kits/bloc-b-assistant/mission-agent/sources-sha256.json`
- Move: `kits/bloc-b-assistant/verify-cowork.mjs` to `kits/bloc-b-assistant/mission-agent/verify-brief.mjs`
- Move: `kits/bloc-b-assistant/code/README.md` to `kits/bloc-b-assistant/mini-application/README.md`
- Move: `kits/bloc-b-assistant/code/app.mjs` to `kits/bloc-b-assistant/mini-application/app.mjs`
- Move: `kits/bloc-b-assistant/code/brief.mjs` to `kits/bloc-b-assistant/mini-application/brief.mjs`
- Move: `kits/bloc-b-assistant/code/brief.test.mjs` to `kits/bloc-b-assistant/mini-application/brief.test.mjs`
- Move: `kits/bloc-b-assistant/code/index.html` to `kits/bloc-b-assistant/mini-application/index.html`
- Move: `kits/bloc-b-assistant/code/server.mjs` to `kits/bloc-b-assistant/mini-application/server.mjs`
- Move: `kits/bloc-b-assistant/code/styles.css` to `kits/bloc-b-assistant/mini-application/styles.css`
- Delete: `kits/bloc-b-assistant/prompts/`
- Modify: `kits/bloc-b-assistant-formateur/corriges/brief-cowork.md`
- Modify: `tests/block-b-kit.test.ts`
- Modify: `scripts/block-b-kit.mjs`
- Regenerate: `public/kits/bloc-b-assistant.zip`

**Interfaces:**
- Consumes: la même matière fictive N01 à N06.
- Produces:
  - `notes/` pour B1 et B2 ;
  - `mission-agent/` autonome pour B3 ;
  - `mini-application/` autonome pour B4 ;
  - `verifyMissionAgent({ rootDirectory, log })`.

- [ ] **Step 1: Réécrire d’abord le test d’inventaire du kit**

Remplacer le premier test de `tests/block-b-kit.test.ts` par des assertions sur :

```ts
const notes = await Promise.all([
  'notes/demandes.md',
  'notes/reunion.md',
  'notes/messages.md',
].map(readKit));

const agentSources = await Promise.all([
  'mission-agent/sources/demandes.md',
  'mission-agent/sources/reunion.md',
  'mission-agent/sources/messages.md',
].map(readKit));

assert.deepEqual(agentSources, notes);
assert.match(await readKit('LIRE-EN-PREMIER.md'), /Kit d’entraînement du Bloc B/);
await assert.rejects(readKit('prompts/01-chat.md'));
```

Mettre à jour les autres chemins du test :

```ts
import { verifyMissionAgent } from '../kits/bloc-b-assistant/mission-agent/verify-brief.mjs';

const codeDirectory = path.join(participantKitDirectory, 'mini-application');
const app = await readKit('mini-application/app.mjs');
const sourceTest = await readKit('mini-application/brief.test.mjs');
```

Les entrées ZIP obligatoires deviennent :

```ts
assert.ok(entries.some((entry) => entry.endsWith('/notes/demandes.md')));
assert.ok(entries.some((entry) => entry.endsWith('/mission-agent/verify-brief.mjs')));
assert.ok(entries.some((entry) => entry.endsWith('/mini-application/brief.test.mjs')));
assert.ok(entries.every((entry) => !entry.includes('/prompts/')));
```

- [ ] **Step 2: Vérifier que l’ancien kit échoue au nouveau contrat**

Run:

```bash
npm test -- --test-name-pattern="kit partage|vérificateur|mini-page|ZIP public"
```

Expected: FAIL sur les nouveaux chemins et l’export `verifyMissionAgent`.

- [ ] **Step 3: Réorganiser les fichiers sans changer les six notes**

Utiliser `apply_patch` avec `*** Move to:` pour les déplacements. Les trois
copies dans `mission-agent/sources/` doivent être strictement identiques aux
trois fichiers de `notes/`.

Remplacer le contenu de `LIRE-EN-PREMIER.md` par :

```md
# Kit d’entraînement du Bloc B

Ce dossier contient uniquement des données fictives et des états de départ.
Les consignes, prompts et tests à suivre se trouvent sur les fiches B0 à B4 du
site de formation.

- `notes/` : fichiers à joindre dans B1 et B2 ;
- `mission-agent/` : sources et dossier de sortie de B3 ;
- `mini-application/` : projet local et tests de B4.

Ce kit n’est pas votre projet personnel. Vous pouvez le supprimer après le
Bloc B.
```

Le fichier `mission-agent/sources-sha256.json` doit contenir :

```json
{
  "sources/demandes.md": "e7d9bcda3a262989a008ba32c8f299817c3a74049f093d20f4ba01d1b5f770d7",
  "sources/reunion.md": "4fadae98a793ff3aef5364c881129405fa1419271bda2ac386611eda361fb6e2",
  "sources/messages.md": "04bcf91b4495e154a7feefdb89f5e10fd6aa29978de913cc538becdded0d11e4"
}
```

- [ ] **Step 4: Généraliser le vérificateur Node**

Dans `mission-agent/verify-brief.mjs` :

- fixer `defaultRoot` au dossier `mission-agent/` ;
- lire `sortie/brief-du-jour.md` ;
- lire `sources-sha256.json` ;
- remplacer les chemins `inbox/01-demandes.md`, `inbox/02-reunion.md`,
  `inbox/03-messages.md` par `demandes.md`, `reunion.md`, `messages.md` dans
  `expectedNoteSources` ;
- conserver le contrôle des fichiers source via les clés
  `sources/demandes.md`, `sources/reunion.md`, `sources/messages.md` ;
- exporter `verifyMissionAgent` ;
- invoquer `verifyMissionAgent()` en exécution directe.

Le tableau de contrôles garde les identifiants `output`, `sources`,
`uncertainty`, `fingerprints`.

- [ ] **Step 5: Rendre la mini-application autonome**

Dans `mini-application/README.md`, supprimer toute référence à
`../prompts/04-claude-code.md` et écrire :

```md
# Mini-application du brief

La page trie déjà six cartes. La propriété `source` existe dans les données
mais n’est pas rendue. La consigne B4 se trouve sur le site de formation.

```sh
node --test
node server.mjs
```

Ouvrez ensuite `http://127.0.0.1:4174`.
```

Dans `mini-application/brief.mjs`, conserver les objets et remplacer chaque
source par son nom de fichier : `demandes.md`, `reunion.md` ou `messages.md`.

- [ ] **Step 6: Supprimer les prompts du ZIP et adapter le script**

Supprimer les quatre fichiers de `kits/bloc-b-assistant/prompts/`. Le script
`scripts/block-b-kit.mjs` conserve les mêmes exports et la même racine ZIP.
Changer uniquement les messages visibles :

```js
return { ok: true, message: 'Kit d’entraînement du Bloc B synchronisé.' };
```

et :

```js
console.log(`Kit d’entraînement du Bloc B généré : ${path.relative(projectDirectory, publicArchivePath)} (${archive.byteLength} octets).`);
```

- [ ] **Step 7: Adapter les cas adversariaux puis faire passer les tests**

Dans les briefs de `tests/block-b-kit.test.ts`, utiliser les sources
`demandes.md`, `reunion.md`, `messages.md`, écrire dans
`mission-agent/sortie/`, modifier le fichier
`mission-agent/sources/demandes.md` pour le test d’empreinte, puis appeler
`verifyMissionAgent`. Mettre aussi à jour les trois noms de sources dans
`kits/bloc-b-assistant-formateur/corriges/brief-cowork.md`, car ce corrigé est
exécuté par le même test du vérificateur. Son renommage en `brief-agent.md`
reste réservé à Task 6.

Run:

```bash
npm test -- --test-name-pattern="kit partage|vérificateur|mini-page|ZIP public"
```

Expected: tous les tests ciblés passent, sauf le contrôle du ZIP public avant
sa régénération.

- [ ] **Step 8: Régénérer et contrôler le ZIP**

Run:

```bash
npm run kit:block-b
npm run kit:block-b:check
```

Expected:

```text
Kit d’entraînement du Bloc B synchronisé.
```

- [ ] **Step 9: Commit**

```bash
git add kits/bloc-b-assistant kits/bloc-b-assistant-formateur/corriges/brief-cowork.md scripts/block-b-kit.mjs tests/block-b-kit.test.ts public/kits/bloc-b-assistant.zip
git commit -m "content: simplifier le kit d'entraînement du bloc B"
```

---

### Task 5: Réécrire B0, B1 et B2 comme parcours miroir

**Files:**
- Move: `src/content/briques/b-interfaces/b0-setup-claude.mdx` to `src/content/briques/b-interfaces/b0-choisir-voie.mdx`
- Move: `src/content/briques/b-interfaces/b1-claude-chat.mdx` to `src/content/briques/b-interfaces/b1-chat.mdx`
- Move: `src/content/briques/b-interfaces/b2-artifacts.mdx` to `src/content/briques/b-interfaces/b2-objet-interactif.mdx`
- Modify: `tests/block-b-curriculum.test.ts`

**Interfaces:**
- Consumes: `data-block-b-panel` du sélecteur et `notes/*.md` du kit.
- Produces: trois fiches où les objectifs et tests sont communs, les gestes
  propres au produit étant isolés dans deux panneaux.

- [ ] **Step 1: Remplacer les assertions Claude-only par le contrat miroir**

Dans `tests/block-b-curriculum.test.ts`, conserver dans le test existant des
six fiches uniquement l’inventaire, les durées, les coupures et les replis.
Supprimer son objet `promptByBrick` et toutes les assertions sur les anciens
fichiers `prompts/`. Ajouter ensuite un test nommé
`B0 à B2 suivent le parcours miroir` :

```ts
for (const brickId of ['b0', 'b1', 'b2']) {
  const document = documents.find((candidate) => candidate.data.id === brickId);
  assert.ok(document, brickId);
  assert.match(document.body, /data-block-b-panel="claude"/);
  assert.match(document.body, /data-block-b-panel="openai"/);
}

for (const brickId of ['b1', 'b2']) {
  const body = documents.find((candidate) => candidate.data.id === brickId)?.body ?? '';
  for (const heading of [
    'Situation',
    'Pourquoi cette surface',
    'Fichiers à fournir',
    'Prompt à envoyer',
    'Manipulation à effectuer',
    'Tester mon résultat',
    'Corriger un échec',
  ]) assert.match(body, new RegExp(`### ${heading}`), `${brickId} ${heading}`);
}
```

Ajouter les assertions de noms :

```ts
assert.equal(documents.find((item) => item.data.id === 'b0')?.data.title, 'Choisir sa voie');
assert.equal(documents.find((item) => item.data.id === 'b1')?.data.title, 'Chat');
assert.equal(documents.find((item) => item.data.id === 'b2')?.data.title, 'Objet interactif');
```

- [ ] **Step 2: Vérifier l’échec éditorial**

Run:

```bash
npm test -- --test-name-pattern="six fiches B|B0 à B2 suivent le parcours miroir"
```

Expected: FAIL sur les titres, les panneaux et les sept sous-rubriques.

- [ ] **Step 3: Réécrire B0 « Choisir sa voie »**

Utiliser ce frontmatter :

```yaml
id: b0
title: "Choisir sa voie"
family: b
order: 5
priority: socle
durationMinutes: 5
type: setup
platforms:
  - commun
prerequisites: []
status: a-relire
owner: a-attribuer
learningObjective: "Choisir Claude ou OpenAI pour tout le Bloc B, distinguer quatre niveaux d’action et repérer les fichiers fictifs du kit."
expectedOutcome: "Le participant active une voie, ouvre les trois notes et distingue réponse, objet, livrable et projet modifié."
```

Le corps doit dire explicitement :

- `75 minutes de socle`, plus la marge de transition ;
- `Kit d’entraînement du Bloc B`, jamais projet personnel ;
- B1 réponse, B2 objet, B3 livrable, B4 projet modifié ;
- B4-bis est uniquement un rattrapage technique.

Ajouter les deux panneaux :

```mdx
<section className="block-b-path" data-block-b-panel="claude">
  <h3>Voie Claude</h3>
  <ol>
    <li>B1 dans Claude Chat.</li>
    <li>B2 dans Artifacts.</li>
    <li>B3 dans Cowork.</li>
    <li>B4 dans Claude Code.</li>
  </ol>
</section>

<section className="block-b-path" data-block-b-panel="openai">
  <h3>Voie OpenAI</h3>
  <ol>
    <li>B1 dans ChatGPT Chat.</li>
    <li>B2 dans Canvas.</li>
    <li>B3 dans Work.</li>
    <li>B4 dans Codex.</li>
  </ol>
</section>
```

Le test final de B0 doit exiger exactement :

1. une voie sélectionnée ;
2. `notes/demandes.md`, `notes/reunion.md` et `notes/messages.md` ouverts ;
3. les quatre sorties reformulées ;
4. la phrase « ce kit n’est pas mon projet personnel » comprise.

- [ ] **Step 4: Réécrire B1 « Chat »**

Utiliser :

```yaml
title: "Chat"
learningObjective: "Transformer six notes en réponse traçable dans Claude Chat ou ChatGPT Chat, puis corriger un seul écart sans changer de surface."
expectedOutcome: "Le participant obtient trois sections, six notes sourcées et un conflit conservé sous À confirmer."
```

Sous `## Pratique guidée`, écrire les sept sous-rubriques dans l’ordre. Les
panneaux ne contiennent que le geste produit :

```mdx
<section className="block-b-path" data-block-b-panel="claude">
  <h3>Voie Claude : démarrer dans Chat</h3>
  <p>Ouvrez une nouvelle conversation Claude et joignez les trois fichiers de <code>notes/</code>.</p>
</section>

<section className="block-b-path" data-block-b-panel="openai">
  <h3>Voie OpenAI : démarrer dans ChatGPT</h3>
  <p>Ouvrez un nouveau chat ChatGPT et joignez les trois fichiers de <code>notes/</code>.</p>
</section>
```

Le prompt commun affiché en entier sur la fiche est :

```text
Prépare un brief opérationnel du jour à partir des six notes fictives jointes.

Traite les six notes sans inventer d’information. Après chaque action, cite
[source: nom-du-fichier]. Si deux notes se contredisent, ne tranche pas et
place le point sous « À confirmer ».

Utilise exactement ces trois sections, dans cet ordre :
1. Actions du jour
2. À confirmer
3. Plus tard

Réponds uniquement avec le brief.
```

Le test binaire demande : six identifiants N01 à N06 une seule fois, les trois
sections dans l’ordre, le bon fichier sur chaque action, N03 et N05 avec les
deux dates sous `À confirmer`. Les corrections ciblées nomment ces quatre
échecs séparément.

- [ ] **Step 5: Réécrire B2 « Objet interactif »**

Utiliser :

```yaml
title: "Objet interactif"
learningObjective: "Transformer les six notes en objet manipulable avec Artifacts ou Canvas, exécuter cinq tests et corriger sans régression."
expectedOutcome: "Le participant obtient six cartes, trois états, trois compteurs, un archivage et une remise à zéro qui passent cinq tests."
```

Les panneaux indiquent :

```mdx
<section className="block-b-path" data-block-b-panel="claude">
  <h3>Voie Claude : créer un Artifact</h3>
  <p>Joignez les trois fichiers de <code>notes/</code> puis demandez explicitement un Artifact interactif.</p>
</section>

<section className="block-b-path" data-block-b-panel="openai">
  <h3>Voie OpenAI : ouvrir Canvas</h3>
  <p>Joignez les trois fichiers de <code>notes/</code> puis demandez explicitement d’utiliser Canvas.</p>
</section>
```

Le prompt commun est :

```text
Crée un objet interactif nommé « Boîte de tri du jour » à partir des six notes.

Affiche six cartes et exactement trois états : Aujourd’hui, Plus tard,
Archiver. Place les six cartes dans Aujourd’hui au départ. Permets de déplacer
chaque carte, affiche un compteur par état et conserve toujours un total de six.
Ajoute un bouton « Remise à zéro » qui restaure l’état initial.

N’ajoute ni compte, ni notification, ni stockage distant.
```

Le test contient cinq gestes exacts :

1. voir six cartes ;
2. déplacer une carte vers `Plus tard` ;
3. archiver une carte ;
4. vérifier que le total reste six ;
5. remettre à zéro et retrouver six cartes dans `Aujourd’hui`.

La correction ciblée ajoute une confirmation d’archivage puis fait rejouer les
cinq tests.

- [ ] **Step 6: Vérifier le contenu et commit**

Run:

```bash
npm test -- --test-name-pattern="six fiches B|B0 à B2 suivent le parcours miroir"
npm run content:check
```

Expected: PASS. Le test miroir porte volontairement sur B0 à B2 dans cette
tâche ; Task 6 l’étend à B3 et B4 dans son premier cycle rouge puis vert.

```bash
git add src/content/briques/b-interfaces tests/block-b-curriculum.test.ts
git commit -m "content: ouvrir le bloc B à Claude et OpenAI"
```

---

### Task 6: Réécrire B3, B4, B4-bis et le kit formateur

**Files:**
- Move: `src/content/briques/b-interfaces/b3-cowork.mdx` to `src/content/briques/b-interfaces/b3-travail-multietape.mdx`
- Move: `src/content/briques/b-interfaces/b4-claude-code.mdx` to `src/content/briques/b-interfaces/b4-agent-code.mdx`
- Move: `src/content/briques/b-interfaces/b4-bis-setup-vscode.mdx` to `src/content/briques/b-interfaces/b4-bis-projet-local.mdx`
- Modify: `src/content/atelier/p1-naissance.mdx`
- Modify: `kits/bloc-b-assistant-formateur/README.md`
- Modify: `kits/bloc-b-assistant-formateur/replis.md`
- Move: `kits/bloc-b-assistant-formateur/corriges/artifact-correction.md` to `kits/bloc-b-assistant-formateur/corriges/objet-correction.md`
- Move: `kits/bloc-b-assistant-formateur/corriges/brief-cowork.md` to `kits/bloc-b-assistant-formateur/corriges/brief-agent.md`
- Move: `kits/bloc-b-assistant-formateur/corriges/claude-code.patch` to `kits/bloc-b-assistant-formateur/corriges/agent-code.patch`
- Modify: `kits/bloc-b-assistant-formateur/corriges/brief-chat-6-lignes.md`
- Modify: `tests/block-b-curriculum.test.ts`
- Modify: `tests/block-b-kit.test.ts`
- Modify: `tests/brick-inventory.test.ts`

**Interfaces:**
- Consumes: `mission-agent/`, `mini-application/`, le sélecteur et le
  vérificateur des tâches précédentes.
- Produces: B3 et B4 obligatoires dans les deux voies, plus un B4-bis
  strictement technique.

- [ ] **Step 1: Étendre les tests miroir à B3 et B4**

Dans `tests/block-b-curriculum.test.ts`, renommer le test de Task 5 en
`B0 à B4 suivent le parcours miroir`, étendre ses boucles à B3 et B4, puis
ajouter :

```ts
const b3 = documents.find((item) => item.data.id === 'b3');
assert.equal(b3?.data.title, 'Travail multiétape');
assert.match(b3?.body ?? '', /Claude Cowork/);
assert.match(b3?.body ?? '', /ChatGPT Work/);
assert.match(b3?.body ?? '', /mission-agent\/sources/);
assert.match(b3?.body ?? '', /brief-du-jour\.md/);

const b4 = documents.find((item) => item.data.id === 'b4');
assert.equal(b4?.data.title, 'Agent de code');
assert.equal(b4?.data.priority, 'socle');
assert.match(b4?.body ?? '', /Claude Code/);
assert.match(b4?.body ?? '', /Codex/);
assert.match(b4?.body ?? '', /mini-application/);
assert.match(b4?.body ?? '', /## Checkpoint final/);
```

Dans `tests/brick-inventory.test.ts`, remplacer le test des identifiants
facultatifs par :

```ts
test('aucune brique du socle ne dépend du rattrapage B4-bis', async () => {
  const documents = await loadBrickDocuments(contentDirectory);
  const requiredWithRecoveryPrerequisite = documents
    .filter((document) => document.data.priority === 'socle')
    .filter((document) => document.data.prerequisites.includes('b4-bis'))
    .map((document) => document.data.id);

  assert.deepEqual(requiredWithRecoveryPrerequisite, []);
});
```

- [ ] **Step 2: Vérifier l’échec initial**

Run:

```bash
npm test -- --test-name-pattern="B0 à B4 suivent le parcours miroir|rattrapage B4-bis"
```

Expected: FAIL sur les anciens titres, chemins et priorité.

- [ ] **Step 3: Réécrire B3 « Travail multiétape »**

Utiliser :

```yaml
title: "Travail multiétape"
priority: socle
learningObjective: "Faire produire un livrable à partir de plusieurs fichiers dans Cowork ou Work, avec plan approuvé et preuve indépendante."
expectedOutcome: "Le participant obtient un unique brief-du-jour.md, sourcé, incertain et contrôlé sans modification silencieuse des sources."
```

Sous les sept sous-rubriques, les panneaux portent des procédures complètes et
différentes.

Voie Claude :

```text
Travaille uniquement dans le dossier mission-agent.

Périmètre : lis uniquement sources/ et écris uniquement
sortie/brief-du-jour.md.

Action : transforme les six notes en un brief contenant exactement Actions du
jour, À confirmer et Plus tard. Cite le nom du fichier source sur chaque action.

Contraintes : ne modifie ni ne supprime les sources, ne tranche pas le conflit
du 18 et du 19 septembre et ne crée aucun autre fichier.

Exécution : présente d’abord un plan court et attends mon approbation avant
d’écrire. À la fin, lance node verify-brief.mjs et rapporte les quatre contrôles.
```

Voie OpenAI :

```text
Utilise uniquement les trois fichiers joints comme sources.

Crée un seul livrable téléchargeable nommé brief-du-jour.md. Il contient
exactement Actions du jour, À confirmer et Plus tard. Cite le nom du fichier
source sur chaque action.

Ne modifie pas les sources, ne tranche pas le conflit du 18 et du 19 septembre
et ne crée aucun autre livrable.

Présente d’abord un plan court et attends mon approbation. Après approbation,
produis le fichier puis rapporte séparément la couverture des six notes, les
sources et l’incertitude conservée.
```

Le test final associe les trois contrôles automatiques du composant
`BriefValidator` à la confirmation humaine des sources inchangées. Le repli
formateur utilise `corriges/brief-agent.md`.

- [ ] **Step 4: Réécrire B4 « Agent de code »**

Utiliser :

```yaml
title: "Agent de code"
priority: socle
learningObjective: "Faire ajouter uniquement la source sous chaque carte avec Claude Code ou Codex, puis vérifier le test et les modifications."
expectedOutcome: "La mini-application affiche les sources, conserve le tri, complète le test source volontairement ignoré et présente des modifications limitées."
```

Les panneaux indiquent où ouvrir le même dossier :

```mdx
<section className="block-b-path" data-block-b-panel="claude">
  <h3>Voie Claude : ouvrir Claude Code</h3>
  <p>Dans l’application Claude, ouvrez Claude Code puis le dossier <code>mini-application/</code>.</p>
</section>

<section className="block-b-path" data-block-b-panel="openai">
  <h3>Voie OpenAI : ouvrir Codex</h3>
  <p>Dans l’application ChatGPT, ouvrez Codex puis le dossier <code>mini-application/</code>.</p>
</section>
```

Le prompt commun est :

```text
Inspecte ce mini-projet sans le modifier, puis présente un plan de trois étapes
maximum.

Objectif unique : afficher la propriété source sous chaque carte.

Préserve le tri existant. Ne change ni le contenu des notes, ni le style
général, ni le serveur. Remplace le test source volontairement ignoré par une assertion qui prouve que
les trois noms de fichiers sont rendus. Exécute node --test après la
modification. Arrête-toi si une modification hors de ce périmètre semble
nécessaire.

Attends mon approbation avant de modifier. À la fin, présente les fichiers
modifiés, le résultat du test et les changements à relire.
```

Le test conserve les cinq critères du design. Ajouter `## Checkpoint final`
avec quatre situations inédites :

1. répondre en cinq lignes à un email déjà fourni : Chat ;
2. créer un calculateur manipulable sans projet : Artifact ou Canvas ;
3. analyser douze entretiens et livrer un rapport : Cowork ou Work ;
4. corriger le tri d’un projet et lancer ses tests : Claude Code ou Codex.

Chaque réponse doit citer sortie, contexte, action et preuve.

Dans `Tester mon résultat`, les cinq critères B4 sont écrits explicitement :

1. le plan a été présenté avant toute écriture ;
2. seuls le rendu de la source et son test ont changé ;
3. les trois noms `demandes.md`, `reunion.md` et `messages.md` sont visibles ;
4. `node --test` passe ;
5. les fichiers modifiés et le diff ont été relus.

- [ ] **Step 5: Recentrer B4-bis sur le projet local**

Renommer la fiche « Rattrapage projet local ». Conserver `priority:
rattrapage`, 10 minutes et les rubriques du type setup. Remplacer toutes les
références `code/` par `mini-application/`.

Les trois preuves deviennent :

1. le dossier `mini-application/` est ouvert ;
2. `node --test` passe dans ce dossier ;
3. Claude Code ou Codex peut ouvrir ce même dossier.

VS Code peut rester une variante de dépannage, jamais un prérequis de B4.

- [ ] **Step 6: Corriger la transition avec l’atelier**

Dans `src/content/atelier/p1-naissance.mdx`, remplacer la phrase affirmant que
B0 couvre la connexion par :

```md
Le Bloc B vous aura déjà fait choisir Claude ou OpenAI et manipuler quatre
niveaux sur un kit fictif. Ici, vous quittez ce kit d’entraînement pour créer
votre projet personnel.
```

Ne réécrire aucune autre étape de P1 dans cette tâche.

- [ ] **Step 7: Généraliser le kit formateur**

Mettre à jour les titres et chemins :

- `B2 Artifact / Canvas` vers `corriges/objet-correction.md` ;
- `B3 Cowork / Work` vers `corriges/brief-agent.md` ;
- `B4 Claude Code / Codex` vers `corriges/agent-code.patch` ;
- `mission-agent/sortie/brief-du-jour.md` et
  `node mission-agent/verify-brief.mjs` ;
- sources `demandes.md`, `reunion.md`, `messages.md`.

Le contenu des corrigés garde exactement les mêmes garanties. Remplacer
`inbox/01-demandes.md` par `demandes.md`, `inbox/02-reunion.md` par
`reunion.md` et `inbox/03-messages.md` par `messages.md`.

- [ ] **Step 8: Vérifier et commit**

Run:

```bash
npm test -- --test-name-pattern="B0 à B4 suivent le parcours miroir|rattrapage B4-bis|corrigés formateur"
npm run content:check
```

Expected: PASS.

```bash
git add src/content/briques/b-interfaces src/content/atelier/p1-naissance.mdx kits/bloc-b-assistant-formateur tests/block-b-curriculum.test.ts tests/block-b-kit.test.ts tests/brick-inventory.test.ts
git commit -m "content: rendre les quatre expériences du bloc B obligatoires"
```

---

### Task 7: Recomposer les slides B0 à B4 sans tutoriels concurrents

**Files:**
- Modify: `src/presentation/manifests/b.ts`
- Modify: `tests/block-b-curriculum.test.ts`
- Modify: `tests/presentation-content.test.ts`
- Modify: `tests/presentation-routing.test.ts`
- Modify: `tests/presentation-visuals.test.ts`
- Modify: `scripts/qa-block-b.mjs`
- Modify: `scripts/qa-presenter.mjs`

**Interfaces:**
- Consumes: les visuels existants `solution-comparison`,
  `solution-prioritizer`, `prompt-builder`, `artifact-test-loop`,
  `pacte-workspace`, `ipmtr-loop` et `workspace-triptych`.
- Produces: 21 routes B inchangées, 110 slides totales inchangées, mais une
  seule piste principale B0 à B4 et le rattrapage B4-bis.

- [ ] **Step 1: Verrouiller la nouvelle narration avant le manifeste**

Dans `tests/presentation-content.test.ts`, remplacer les entrées B par :

```ts
{ id: 'b0-layers', claim: 'Une voie, quatre niveaux d’action à tester.', visualKey: 'solution-comparison' },
{ id: 'b0-test', claim: 'Le kit est un banc d’essai, pas votre projet personnel.', visualKey: 'mission-board' },
{ id: 'b1-vague', claim: 'Chat suffit lorsque la sortie est une réponse à relire.', visualKey: 'prompt-builder' },
{ id: 'b1-four-blocks', claim: 'Objectif, contexte, contraintes et forme rendent cette réponse testable.', visualKey: 'prompt-builder' },
{ id: 'b1-mission', claim: 'Transformez six notes en brief sourcé dans Claude Chat ou ChatGPT.', visualKey: 'prompt-builder' },
{ id: 'b1-loop', claim: 'Un test binaire nomme l’écart avant la correction.', visualKey: 'prompt-builder' },
{ id: 'b2-object', claim: 'Artifacts et Canvas transforment la réponse en objet manipulable.', visualKey: 'artifact-test-loop' },
{ id: 'b2-mvp', claim: 'Une boîte de tri à trois états suffit pour tester l’idée.', visualKey: 'artifact-test-loop' },
{ id: 'b2-mission', claim: 'Construisez puis exécutez cinq tests sur les six notes.', visualKey: 'artifact-test-loop' },
{ id: 'b2-correction', claim: 'Une correction ciblée ne vaut que si les cinq tests repassent.', visualKey: 'artifact-test-loop' },
{ id: 'b3-delegation', claim: 'Cowork et Work prennent plusieurs étapes en charge ; vous gardez le périmètre.', visualKey: 'pacte-workspace' },
{ id: 'b3-pacte', claim: 'P.A.C.T.E. transforme une délégation en contrat observable.', visualKey: 'pacte-workspace' },
{ id: 'b3-mission', claim: 'Faites produire un brief fini dans Cowork ou Work.', visualKey: 'pacte-workspace' },
{ id: 'b3-check', claim: 'Le livrable n’est fini que si sources et incertitude passent le test.', visualKey: 'pacte-workspace' },
{ id: 'b4-context', claim: 'Claude Code et Codex travaillent dans le contexte réel d’un projet.', visualKey: 'ipmtr-loop' },
{ id: 'b4-ipmtr', claim: 'Inspecter, planifier, modifier, tester et relire borne le changement.', visualKey: 'ipmtr-loop' },
{ id: 'b4-mission', claim: 'Ajoutez les sources aux cartes sans modifier le tri.', visualKey: 'ipmtr-loop' },
{ id: 'b4-test', claim: 'Après quatre essais, choisissez la plus petite surface suffisante.', visualKey: 'solution-prioritizer' },
{ id: 'b4bis-install', claim: 'Le rattrapage ne corrige que le maillon local qui manque.', visualKey: 'workspace-triptych' },
{ id: 'b4bis-workspace', claim: 'Explorateur, fichier et terminal doivent pointer vers le même kit.', visualKey: 'workspace-triptych' },
{ id: 'b4bis-checkpoint', claim: 'Le poste est prêt lorsque le test passe et l’agent de code ouvre le bon dossier.', visualKey: 'workspace-triptych' },
```

Dans `tests/block-b-curriculum.test.ts`, fixer :

```ts
assert.equal(blockBSlides.length, 21);
assert.equal(PRESENTATION_SLIDES.length, 110);
assert.equal(coreBlockBMinutes, 75);
assert.equal(optionalBlockBMinutes, 0);
assert.equal(recoveryBlockBMinutes, 10);
```

et les pistes :

```ts
[
  ['b0', 'core'], ['b1', 'core'], ['b2', 'core'], ['b3', 'core'],
  ['b4', 'core'], ['b4-bis', 'recovery'],
]
```

Les voisins deviennent :

```ts
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b3-check').next?.id, 'b4-context');
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4-context').previous?.id, 'b3-check');
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'b4-test').next?.id, 'c1-repeat');
assert.equal(getSlideNeighbors(PRESENTATION_SLIDES, 'c1-repeat').previous?.id, 'b4-test');
```

- [ ] **Step 2: Vérifier les échecs narratifs et de routage**

Run:

```bash
npm test -- --test-name-pattern="21 routes B|pistes|110 étapes|trois pistes"
```

Expected: FAIL sur les claims, B4 facultatif et B3 qui saute B4.

- [ ] **Step 3: Remplacer B0 par la carte des deux voies**

Dans `src/presentation/manifests/b.ts`, garder les identifiants
`b0-layers` et `b0-test`.

`b0-layers` utilise `solution-comparison` avec :

```ts
visual: { key: 'solution-comparison', data: {
  variant: 'landscape',
  levels: [
    { need: 'Réponse', output: 'Brief sourcé à relire', workflow: 'Joindre → demander → relire', solutions: ['Claude Chat', 'ChatGPT Chat'] },
    { need: 'Objet', output: 'Boîte de tri manipulable', workflow: 'Décrire → générer → cliquer → corriger', solutions: ['Claude Artifacts', 'ChatGPT Canvas'] },
    { need: 'Livrable', output: 'brief-du-jour.md terminé', workflow: 'Sources → plan → accord → livrable', solutions: ['Claude Cowork', 'ChatGPT Work'] },
    { need: 'Projet', output: 'Code modifié, testé et relu', workflow: 'Inspecter → modifier → tester → relire', solutions: ['Claude Code', 'Codex'] },
  ],
  warning: 'Choisissez une seule voie dans B0 et gardez-la jusqu’au checkpoint final.',
} }
```

`b0-test` utilise `mission-board` avec :

```ts
visual: { key: 'mission-board', data: {
  interaction: 'Préparer le laboratoire.',
  mission: [
    'Choisir Claude ou OpenAI.',
    'Télécharger le Kit d’entraînement du Bloc B.',
    'Ouvrir les trois fichiers de notes/.',
    'Nommer les quatre sorties à produire.',
  ],
  successCriterion: 'Une voie choisie, trois notes ouvertes et aucune confusion avec le projet personnel.',
  evidence: ['Choix visible', 'Trois fichiers lisibles', 'Quatre niveaux reformulés'],
} }
```

- [ ] **Step 4: Généraliser B1 à B4**

Conserver les identifiants et les composants spécialisés, mais :

- remplacer chaque `promptPath` par `instructionAnchor: 'pratique-guidee'` ;
- ajouter `surfaces` à chaque mission :
  - B1 `['Claude Chat', 'ChatGPT Chat']`
  - B2 `['Claude Artifacts', 'ChatGPT Canvas']`
  - B3 `['Claude Cowork', 'ChatGPT Work']`
  - B4 `['Claude Code', 'Codex']`
- remplacer les chemins `inbox/`, `sortie/`, `code/` par les chemins du
  nouveau kit ;
- nommer les preuves génériques, sans capture de boutons d’interface ;
- changer les liens wiki vers `#pratique-guidee` ;
- compléter la table `links` avec les ressources officielles OpenAI déjà
  autorisées par la validation :

```ts
chatgpt: externalLink(
  'official',
  'Découvrir ChatGPT',
  'https://openai.com/chatgpt/overview/',
),
canvas: externalLink(
  'official',
  'Utiliser Canvas dans ChatGPT',
  'https://help.openai.com/en/articles/9930697-what-is-the-canvas-feature-in-chatgpt-and-how-do-i-use-it',
),
work: externalLink(
  'official',
  'Choisir entre Chat, Work et Codex',
  'https://help.openai.com/en/articles/20001275/',
),
codex: externalLink(
  'official',
  'Bien démarrer avec Codex',
  'https://openai.com/codex/get-started/',
),
```

- ajouter les liens Claude et OpenAI pertinents à B0, puis la paire
  correspondante à B2, B3 et B4 ;
- supprimer `track: 'optional'` du deck B4 ;
- renommer les decks B1 `Chat`, B2 `Objet interactif`, B3
  `Travail multiétape`, B4 `Agent de code`.

Les durées B4 restent `2 + 4 + 10 + 4 = 20`.

- [ ] **Step 5: Transformer b4-test en checkpoint de transfert**

Utiliser `solution-prioritizer` avec les options :

```ts
options: [
  { id: 'chat', need: 'Réponse', solutions: ['Claude Chat', 'ChatGPT Chat'] },
  { id: 'object', need: 'Objet', solutions: ['Claude Artifacts', 'ChatGPT Canvas'] },
  { id: 'work', need: 'Livrable', solutions: ['Claude Cowork', 'ChatGPT Work'] },
  { id: 'code', need: 'Projet', solutions: ['Claude Code', 'Codex'] },
],
```

et ces quatre scénarios complets, dans l’ordre pédagogique de la fiche :

```ts
scenarios: [
  {
    title: 'Répondre à un email',
    situation: 'Un email client est déjà fourni dans la conversation. Vous devez proposer une réponse de cinq lignes, sans créer ni modifier de fichier.',
    signals: ['Sortie : texte court', 'Contexte : conversation', 'Action : aucune', 'Preuve : relecture'],
    answer: 'chat',
    reason: 'Claude Chat comme ChatGPT Chat produisent directement la réponse courte à relire dans la conversation.',
    tempting: 'work',
    temptingReason: 'Cowork ou Work ajouteraient un plan, des étapes et des accès inutiles pour une réponse de cinq lignes.',
  },
  {
    title: 'Créer un calculateur',
    situation: 'Vous voulez créer un calculateur interactif de budget formation, le tester puis partager son aperçu. Aucun projet existant ne doit être modifié.',
    signals: ['Sortie : mini-outil', 'Contexte : conversation', 'Action : créer un objet', 'Preuve : aperçu testé'],
    answer: 'object',
    reason: 'Claude Artifacts comme ChatGPT Canvas permettent de créer, tester et partager cet objet interactif dans un environnement borné.',
    tempting: 'code',
    temptingReason: 'Claude Code ou Codex demanderaient un dépôt et un environnement de développement sans nécessité ici.',
  },
  {
    title: 'Analyser douze entretiens',
    situation: 'Votre espace de travail contient douze entretiens clients. Vous devez les analyser et livrer une synthèse ainsi qu’un tableau de priorités.',
    signals: ['Sortie : deux livrables', 'Contexte : douze fichiers', 'Action : travail multiétape', 'Preuve : sources et priorités relues'],
    answer: 'work',
    reason: 'Claude Cowork comme ChatGPT Work peuvent mener le travail multiétape sur les douze fichiers et produire les deux livrables finis.',
    tempting: 'chat',
    temptingReason: 'Claude Chat ou ChatGPT Chat peuvent aider, mais laissent davantage d’orchestration manuelle pour douze sources et deux livrables.',
  },
  {
    title: 'Corriger un tri existant',
    situation: 'Le projet local contient une page de tri déjà fonctionnelle. Vous devez corriger son rendu, lancer les tests et présenter les modifications.',
    signals: ['Sortie : changement de code', 'Contexte : projet local', 'Action : modifier et exécuter', 'Preuve : tests et diff'],
    answer: 'code',
    reason: 'Claude Code comme Codex peuvent travailler dans le projet, exécuter les tests et produire le diff attendu.',
    tempting: 'object',
    temptingReason: 'Artifacts ou Canvas peuvent montrer du code, mais ne remplacent pas les tests et le diff du projet réel.',
  },
],
```

Le critère final est :

```ts
successCriterion: '4 décisions sur 4 justifiées par la sortie, le contexte, l’action et la preuve.',
```

- [ ] **Step 6: Mettre à jour les tests de variantes**

Dans `tests/presentation-visuals.test.ts`, ne passer au résolveur B que les
slides dont la clé existe dans `resolverByKey`. Les 18 slides spécialisées
restantes doivent garder ces variantes :

```ts
[
  ['b1-vague', 'comparison'], ['b1-four-blocks', 'blocks'],
  ['b1-mission', 'builder'], ['b1-loop', 'loop'],
  ['b2-object', 'transfer'], ['b2-mvp', 'mvp'],
  ['b2-mission', 'tests'], ['b2-correction', 'correction'],
  ['b3-delegation', 'delegation'], ['b3-pacte', 'pacte'],
  ['b3-mission', 'timeline'], ['b3-check', 'check'],
  ['b4-context', 'context'], ['b4-ipmtr', 'process'],
  ['b4-mission', 'permission'],
  ['b4bis-install', 'panes'], ['b4bis-workspace', 'workspace'],
  ['b4bis-checkpoint', 'path'],
]
```

Ajouter une assertion séparée :

```ts
assert.equal(B_DECKS.flatMap((deck) => deck.slides)
  .find((slide) => slide.id === 'b4-test')?.visual.key, 'solution-prioritizer');
```

- [ ] **Step 7: Rebrancher la navigation principale**

Dans `tests/presentation-routing.test.ts`, renommer le test
`relie le socle et le rattrapage` et appliquer les voisins du Step 1.

Dans `scripts/qa-presenter.mjs` :

- attendre `0` badge `optional` et `1` badge `recovery` ;
- contrôler que B3 pointe vers `/presenter/b4/b4-context/` ;
- contrôler que B4 ne montre aucun repère de piste ;
- contrôler que `/presenter/b4/b4-test/` pointe vers C1 ;
- contrôler que C1 revient vers B4 test ;
- conserver B4-bis isolé ;
- remplacer « trois pistes » par « parcours principal et rattrapage » dans le
  message final.

- [ ] **Step 8: Adapter le sweep visuel B**

Dans `scripts/qa-block-b.mjs` :

- garder les 21 routes ;
- remplacer les cinq labels du préflight par :
  `['Réponse', 'Objet', 'Livrable', 'Projet']` ;
- lire `.comparison__need strong` sur `b0-layers` ;
- attendre un repère `Rattrapage` uniquement pour B4-bis ;
- refuser tout repère de piste sur B0 à B4 ;
- conserver desktop, mobile, zoom 200 % et sans JavaScript ;
- remplacer le contrôle sans JavaScript uniforme par des preuves propres aux
  deux visuels génériques : `.comparison__levels` visible sur `b0-layers`,
  `.mission-board` visible sur `b0-test`, et les quatre
  `.prioritizer__correction` visibles sur `b4-test` ;
- conserver le contrôle `[data-enhanced="false"]` pour les 18 visuels B
  spécialisés qui exposent cet état.

Dans `tests/presentation-visuals.test.ts`, remplacer le test de sweep par des
assertions sur les quatre labels, `b4-test`, absence de `Facultatif` dans le
script et présence de `Rattrapage`.

- [ ] **Step 9: Vérifier les trois tests visuels**

Run:

```bash
npm test -- --test-name-pattern="21 routes B|110 étapes|variantes réelle|sweep QA B|pistes"
npm run presentation:check
npm run typecheck
```

Expected: PASS.

Après `npm run build`, lancer :

```bash
npm run qa:block-b
npm run qa:presenter
```

Expected:

- test silencieux : B0 se comprend comme un choix de voie et B4 test comme un
  classement sans notes orales ;
- test coup d’œil : quatre niveaux lisibles en quelques secondes et parcours
  visuel évident ;
- test de nécessité : les interactions B2 et b4-test modifient ou vérifient un
  état utile.

- [ ] **Step 10: Commit**

```bash
git add src/presentation/manifests/b.ts tests/block-b-curriculum.test.ts tests/presentation-content.test.ts tests/presentation-routing.test.ts tests/presentation-visuals.test.ts scripts/qa-block-b.mjs scripts/qa-presenter.mjs
git commit -m "slides: présenter le bloc B comme parcours miroir"
```

---

### Task 8: Ajouter la QA des fiches et exécuter la vérification finale

**Files:**
- Create: `scripts/qa-block-b-wiki.mjs`
- Modify: `package.json`
- Modify: `tests/site-theme.test.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: le build Astro, le sélecteur, les panneaux B1 à B4 et le
  vérificateur B3.
- Produces: `npm run qa:block-b-wiki`, preuve navigateur des deux voies, du
  repli sans JavaScript et du traitement local.

- [ ] **Step 1: Verrouiller le nouveau script dans les tests source**

Dans `tests/site-theme.test.ts`, ajouter :

```ts
test('la QA wiki B couvre persistance, repli sans JavaScript et vérificateur local', async () => {
  const [qa, packageJson] = await Promise.all([
    read('scripts/qa-block-b-wiki.mjs').catch(() => ''),
    read('package.json'),
  ]);

  assert.match(packageJson, /"qa:block-b-wiki":\s*"node scripts\/qa-block-b-wiki\.mjs"/);
  assert.match(qa, /bloc-b-ecosystem/);
  assert.match(qa, /javaScriptEnabled:\s*false/);
  assert.match(qa, /setInputFiles/);
  assert.match(qa, /brief-du-jour\.md/);
  assert.match(qa, /data-block-b-panel/);
  assert.match(qa, /width:\s*390/);
});
```

- [ ] **Step 2: Vérifier l’échec initial**

Run:

```bash
npm test -- --test-name-pattern="QA wiki B"
```

Expected: FAIL, script et commande absents.

- [ ] **Step 3: Créer le scénario Playwright**

Créer `scripts/qa-block-b-wiki.mjs` sur le modèle de `qa-block-b.mjs`.
Utiliser le port `4376` et ces étapes exactes :

1. ouvrir `/briques/b0/` ;
2. choisir `openai` ;
3. ouvrir `/briques/b1/` et vérifier que seul le panneau OpenAI est visible ;
4. choisir `claude`, ouvrir `/briques/b2/` et vérifier la persistance ;
5. ouvrir `/briques/b3/`, charger avec `setInputFiles` un
   `brief-du-jour.md` conforme et cocher la confirmation des originaux ;
6. soumettre et attendre quatre éléments `data-state="pass"` ;
7. charger un brief sans `À confirmer` et attendre au moins un
   `data-state="fail"` ;
8. créer un contexte `javaScriptEnabled: false`, ouvrir B1 et vérifier que les
   deux panneaux sont visibles ;
9. répéter B0 à B4 en viewport `390 × 844` et refuser tout débordement
   horizontal.

Le brief conforme injecté par Playwright est le même que celui de
`tests/block-b-brief-validator.test.ts`.

Le script doit écouter `pageerror` et `request`. Pour B3, après l’ouverture de
la page, mémoriser les requêtes réseau, vider la liste, soumettre le fichier,
puis exiger qu’aucune nouvelle requête ne soit émise par la validation.

- [ ] **Step 4: Ajouter la commande et la documentation**

Dans `package.json` :

```json
"qa:block-b-wiki": "node scripts/qa-block-b-wiki.mjs"
```

Dans `README.md`, ajouter la commande à la liste de vérification du Bloc B et
préciser qu’elle vérifie les deux voies et le traitement local du brief.

- [ ] **Step 5: Exécuter toute la suite**

Run dans cet ordre :

```bash
npm run kit:block-b:check
npm test
npm run content:check
npm run presentation:check
npm run typecheck
npm run build
npm run qa:block-b-wiki
npm run qa:block-b
npm run qa:presenter
npm run qa:font-floor
```

Expected:

- tous les tests unitaires passent ;
- 110 slides sont contrôlées ;
- le kit public est synchronisé ;
- les deux voies sont visibles sans JavaScript ;
- le choix persiste d’une fiche à l’autre ;
- le vérificateur passe sur le brief conforme, échoue sur le cas sans
  incertitude et ne produit aucune requête ;
- B4 se trouve entre B3 et C1 ;
- B4-bis reste sans précédent ni suivant ;
- aucun débordement, texte sous 12 px ou mouvement essentiel ne subsiste.

- [ ] **Step 6: Contrôler le diff de périmètre**

Run:

```bash
git status --short
git diff --check
git diff --stat origin/main...
rg -n "Préflight Bloc B|prompt(s)?/0[1-4]|kits/bloc-b-assistant/(inbox|code)|Socle B0 à B3|Parcours facultatif B4" src tests scripts kits --glob '!docs/**'
```

Expected:

- aucun espace final ni conflit ;
- aucune ancienne consigne B0 à B4 ;
- les seules mentions `inbox` ou `code` restantes sont hors du Bloc B ou
  explicitement historiques ;
- aucune donnée réelle dans le kit.

- [ ] **Step 7: Commit final**

```bash
git add scripts/qa-block-b-wiki.mjs package.json README.md tests/site-theme.test.ts
git commit -m "test: couvrir les deux voies du bloc B"
```
