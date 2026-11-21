# Refonte session 2, chantier 1 : le ménage : Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retirer du dépôt le bloc B, la brique E4, les projets prédéterminés et les documents du fil rouge abandonné, en laissant un site qui se construit et des tests verts, avec 15 briques et 59 slides.

**Architecture:** Suppressions uniquement, sur une branche `refonte-session-2`. Aucun contenu n'est réécrit ici : les briques et decks conservés gardent leur texte actuel, même daté, jusqu'aux chantiers 2 à 4. Chaque tâche supprime un ensemble cohérent, répare ce qui en dépendait, et se termine sur des contrôles verts.

**Tech Stack:** Astro 7, MDX, TypeScript, tests `node:test` lancés par `tsx`.

**Spec:** `docs/superpowers/specs/2026-11-20-refonte-session-2-design.md` (section « 1. Le ménage »).

## Global Constraints

- Node 22.12 ou plus pour toutes les commandes : sur cette machine, préfixer par `PATH=/opt/homebrew/bin:$PATH` (Node 23.1) ; le `node` par défaut est en 20 et fait échouer Astro.
- `npm test` ne trouve pas ses fichiers sous certains shells : lancer `npx tsx --test tests/*.test.ts`.
- Jamais le caractère tiret cadratin dans un fichier du dépôt.
- Ne rien réécrire : pas de nouveau contenu pédagogique, pas de nouveau visuel. Une phrase devenue fausse dans un fichier conservé se corrige au minimum ou se laisse pour le chantier concerné.
- Ne pas toucher à `docs/superpowers/` (historique), ni à `kits/kit-projet/`, ni à `scripts/skill-zip.mjs`.
- Ne jamais pousser la branche ni la fusionner : commits locaux uniquement.
- Contrôles de fin de tâche, tous verts :
  `npx tsx --test tests/*.test.ts`, `npm run content:check`, `npm run parcours:check`, `npm run presentation:check`, `npm run build`.

## Review Focus

Suppressions pures : les risques sont des références orphelines, pas des entrées utilisateur.

1. Un lien interne vers une page supprimée (`/briques/b0/` à `/briques/b4-bis/`, `/briques/e4/`, `/atelier/projets/…`, `/presenter/b…`, `/kits/bloc-b-assistant.zip`) qui survit dans une brique, un deck, l'atelier ou la FAQ : la tâche 5 ajoute le test qui le détecte.
2. Un prérequis de brique pointant vers une brique supprimée (`e2` exige `b4`) : couvert par `content:check`, vérifié en tâche 2.
3. Un visuel de slide retiré du registre mais encore référencé par un deck D ou E : couvert par `presentation:check`, vérifié en tâche 2.
4. Un total affiché (accueil, navigation, catalogue, 404) resté à 22 : la tâche 1 le rend impossible.
5. Un script npm ou une ligne du README qui lance un fichier supprimé : test en tâche 5.

---

### Task 0 : la branche et l'état de départ

**Files:** aucun fichier modifié.

- [ ] **Step 1 :** `git switch -c refonte-session-2`.
- [ ] **Step 2 :** Commiter le travail déjà présent dans le dossier de travail (le kit `kits/kit-projet/`, `scripts/skill-zip.mjs`, `package.json`, `.gitignore`, la suppression de `kits/socle-starter/` et de `docs/atelier/prompt-depot-modele.md`, la spec et ce plan). Message : `feat: kit setup-projet et cadrage de la refonte session 2`.
- [ ] **Step 3 :** Lancer les cinq contrôles et noter le résultat de référence. Attendu : tout vert avec Node 23.

### Task 1 : les totaux de briques affichés ne sont plus écrits en dur

Le nombre de briques change à chaque chantier (22, puis 15, puis 18). Il est écrit en dur dans quatre pages.

**Files:**
- Modify: `src/content/brick-files.ts` (ajouter l'export)
- Modify: `src/layouts/BaseLayout.astro:56`, `src/pages/index.astro` (lignes 11, 18, 34, 67), `src/pages/404.astro:20`, `src/pages/briques/index.astro` (lignes 18 à 31)
- Test: `tests/brick-inventory.test.ts`

**Interfaces:**
- Produces: `export const BRICK_COUNT: number` dans `src/content/brick-files.ts`, égal à `EXPECTED_IMPORTED_BRICK_IDS.length`.

- [ ] **Step 1 : test qui échoue.** Dans `tests/brick-inventory.test.ts`, ajouter `les totaux affichés viennent de BRICK_COUNT` : pour chacun des quatre fichiers ci-dessus, le source contient `BRICK_COUNT` et ne contient aucune correspondance de `/\b\d+ briques\b/` ni de `KIT \/ \d+`. Ajouter aussi `assert.equal(BRICK_COUNT, EXPECTED_IMPORTED_BRICK_IDS.length)`.
- [ ] **Step 2 :** Lancer le test, vérifier qu'il échoue.
- [ ] **Step 3 :** Ajouter l'export et remplacer chaque « 22 » lié aux briques par `{BRICK_COUNT}` dans les quatre pages (y compris les attributs `title`, `description` et `aria-label`).
- [ ] **Step 4 :** Les cinq contrôles. Attendu : verts, le site affiche toujours 22.
- [ ] **Step 5 :** Commit : `refactor: les totaux de briques affichés dérivent de l'inventaire`.

### Task 2 : retirer le bloc B

**Files:**
- Delete: `src/content/briques/b-interfaces/` (6 fichiers), `kits/bloc-b-assistant/`, `kits/bloc-b-assistant-formateur/`, `public/kits/bloc-b-assistant.zip`, `scripts/block-b-kit.mjs`, `scripts/qa-block-b.mjs`, `scripts/qa-block-b-wiki.mjs`, `src/components/block-b/`, `src/features/block-b/`, `src/presentation/manifests/b.ts`, `tests/block-b-brief-validator.test.ts`, `tests/block-b-curriculum.test.ts`, `tests/block-b-ecosystem.test.ts`, `tests/block-b-kit.test.ts`, `tests/helpers/block-b-brief-cases.ts`
- Delete: `src/components/presentation/visuals/b/ArtifactTestLoop.astro`, `PacteWorkspace.astro`, `WorkspaceTriptych.astro`. **Garder** `PromptBuilder.astro`, `IpmtrLoop.astro`, `SetupDiagnostic.astro` et `visual-state.ts` à leur place : les decks D et E s'en servent sur onze slides. Retirer de `visual-state.ts` ce que seuls les trois visuels supprimés utilisaient.
- Modify: `src/presentation/manifests/index.ts` (retirer `B_DECKS`), `src/presentation/presentation-model.ts` (retirer de `SLIDE_VISUAL_KEYS` les clés `artifact-test-loop`, `pacte-workspace`, `workspace-triptych`), `src/components/presentation/VisualRegistry.astro`, `src/pages/briques/[id].astro` (imports `BriefValidator`, `EcosystemSwitch`, `MIRRORED_BLOCK_B_IDS` et tout le rendu associé), `src/content/brick-files.ts` (retirer b0, b1, b2, b3, b4, b4-bis de `EXPECTED_IMPORTED_BRICK_IDS`), `src/content/projet-model.ts` (retirer les mêmes de `VALID_BRICK_IDS`), `src/content/briques/e-methode/e2-code-design.mdx` (prérequis `b4` retiré), `src/content/atelier/p1-naissance.mdx` (retirer b0 et b1 de `bricks:`), `src/styles/global.css` (les deux règles propres au bloc B), `package.json` (scripts `kit:block-b`, `kit:block-b:check`, `qa:block-b`, `qa:block-b-wiki`), `scripts/qa-presenter.mjs`
- Modify (tests) : `tests/brick-inventory.test.ts` (`DRAFTED_BRICK_IDS`, total 16), `tests/site-theme.test.ts`, `tests/presentation-content.test.ts`, `tests/presentation-visuals.test.ts`, `tests/presentation-validation.test.ts`, `tests/presentation-routing.test.ts`, `tests/presentation-check.test.ts`, `tests/brick-validation.test.ts`, `scripts/qa-font-floor.mjs`

Valeurs fixées : 16 briques, 62 slides (83 moins les 21 du bloc B). Partout où un test ou un script fige `83`, écrire `62`. Les contenus de la famille B dans les projets prédéterminés (`src/content/projets/*.mdx`) ne se corrigent pas ici : la tâche 3 supprime ces fichiers ; pour que les contrôles passent entre-temps, retirer seulement les identifiants b de leur champ `bricks:`.

- [ ] **Step 1 :** Dans les tests listés, supprimer les cas qui ne portent que sur le bloc B, et dans les cas mixtes retirer les assertions b ; passer les totaux à 16 et 62. Dans `tests/presentation-validation.test.ts`, le cas `kitLink('bloc-b-assistant.zip', …)` vérifie la fonction `kitLink` : garder le cas en remplaçant le nom du fichier par `setup-projet.zip`.
- [ ] **Step 2 :** Lancer les tests : ils échouent (totaux encore à 22 et 83).
- [ ] **Step 3 :** Faire les suppressions et modifications listées.
- [ ] **Step 4 :** `grep -rnE "block-b|bloc-b|BLOCK_B|B_DECKS|b-interfaces" src tests scripts package.json` ne renvoie rien.
- [ ] **Step 5 :** Les cinq contrôles. Attendu : verts ; `presentation:check` annonce 62 slides.
- [ ] **Step 6 :** Commit : `chore: retire le bloc B, son kit, ses tests et ses slides`.

### Task 3 : retirer les projets prédéterminés

**Files:**
- Delete: `src/content/projets/` (7 fichiers), `src/pages/atelier/projets/`, `src/components/ProjetCard.astro`, `src/content/projet-model.ts`
- Modify: `src/content.config.ts` (collection `projets` et son import), `src/pages/atelier/index.astro` (import, chargement de la collection et section qui liste les projets, environ dix lignes), `src/styles/global.css` (styles des cartes projet), `src/content/atelier/p1-naissance.mdx` (lignes 154 à 159 : remplacer la liste des six projets liés par une phrase, « Vous construisez votre propre idée. », sans lien)
- Modify (tests) : les cas de `tests/presentation-content.test.ts`, `tests/presentation-visuals.test.ts`, `tests/parcours-cas.test.ts` et `tests/brick-inventory.test.ts` qui lisent la collection `projets` ou `projet-model`

`VALID_BRICK_IDS` n'a aucun autre usage que le schéma des projets : il disparaît avec le fichier. La source unique de l'inventaire reste `EXPECTED_IMPORTED_BRICK_IDS`.

- [ ] **Step 1 :** Adapter les tests (retirer les assertions sur les projets).
- [ ] **Step 2 :** Supprimer et modifier les fichiers listés.
- [ ] **Step 3 :** `grep -rnE "projet-model|ProjetCard|PROJET_IDS|atelier/projets" src tests scripts` ne renvoie rien.
- [ ] **Step 4 :** Les cinq contrôles, verts.
- [ ] **Step 5 :** Commit : `chore: retire les projets prédéterminés de l'atelier`.

### Task 4 : retirer E4 et les documents du fil rouge abandonné

**Files:**
- Delete: `src/content/briques/e-methode/e4-methode-equipe-agents.mdx`, `docs/atelier/prototype-second-brain.md`, `docs/atelier/a-completer.md`
- Modify: `src/presentation/manifests/e.ts` (le deck `brickId: 'e4'`, à partir de la ligne 181, 3 slides), `src/content/brick-files.ts`, `docs/presentation/fiche-presentateur-D-E.md` (les trois passages sur E4 et BMAD)
- Modify (tests) : `tests/brick-inventory.test.ts`, `tests/presentation-content.test.ts`, et tous les `62` figés à la tâche 2

Valeurs fixées : 15 briques, 59 slides.

- [ ] **Step 1 :** Tests : totaux à 15 et 59, assertions e4 retirées. Lancer : échec.
- [ ] **Step 2 :** Suppressions et modifications.
- [ ] **Step 3 :** `grep -rniE "\be4\b|bmad" src tests scripts docs/presentation` ne renvoie rien.
- [ ] **Step 4 :** Les cinq contrôles, verts ; 59 slides.
- [ ] **Step 5 :** Commit : `chore: retire la brique E4 et le fil rouge de l'assistant`.

### Task 5 : garde-fou contre les liens orphelins, puis la documentation du dépôt

**Files:**
- Create: `tests/liens-internes.test.ts`
- Modify: `CLAUDE.md`, `AGENTS.md`, `README.md`, `src/pages/index.astro` (ligne 7 : retirer « et OpenAI » ; ligne 11 : « 2,5 jours » devient « un week-end »)

- [ ] **Step 1 : test.** `tests/liens-internes.test.ts`, deux cas :
  - `aucun lien interne ne pointe vers une page supprimée` : parcourir `src/content/**/*.mdx`, `src/presentation/manifests/*.ts`, `src/parcours/manifests/*.ts` et `src/pages/**/*.astro` ; aucune correspondance de `/\/briques\/(b0|b1|b2|b3|b4|b4-bis|e4)\b|\/atelier\/projets\/|\/presenter\/(b|e4)|bloc-b-assistant\.zip/`.
  - `chaque script npm lance un fichier qui existe` : pour chaque valeur de `scripts` dans `package.json` de la forme `node <chemin>` ou `tsx <chemin>`, le chemin existe.
- [ ] **Step 2 :** Lancer. S'il échoue, corriger les liens trouvés au minimum (retirer le lien, garder le texte), relancer jusqu'au vert.
- [ ] **Step 3 :** `CLAUDE.md` et `AGENTS.md` : mettre à jour le contexte (formation sur un week-end, du samedi matin au dimanche, un seul outil : l'application Claude), les quatre surfaces (15 briques et 59 slides à ce stade, `/atelier` en deux pages), l'état d'avancement (refonte en cours, renvoi à la spec), retirer la section « Fil rouge : l'assistant à cinq organes », retirer `VALID_BRICK_IDS` de l'étape 2 du workflow et y mentionner `BRICK_COUNT`. `README.md` : retirer les lignes 85, 86 et 94 sur `qa:block-b`.
- [ ] **Step 4 :** Les cinq contrôles, verts.
- [ ] **Step 5 :** Commit : `docs: aligne le dépôt sur la refonte session 2 après le ménage`.

## État attendu à la fin

- 15 briques (a1 à a4, c1 à c3, d1, d2, d2-bis, d3, d4, e1 à e3), 59 slides, famille B vide.
- Plus aucune trace exécutable du bloc B, de E4, des projets prédéterminés ni de l'ancien kit.
- Le texte des briques, decks, pages d'atelier et guides conservés parle encore de VS Code, d'OpenAI et de l'ancien parcours : c'est attendu, les chantiers 2 à 4 les réécrivent. Le site ne doit pas être publié depuis cette branche à ce stade.
