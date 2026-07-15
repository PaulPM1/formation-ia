# Bloc B Projector Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Porter tout le texte visible du bloc B à un plancher lisible au vidéoprojecteur sans overflow ni perte de contenu.

**Architecture:** Des tokens typographiques B vivent dans `presentation.css` et servent de contrat commun. Les scènes partagées sont recomposées globalement ; chaque composant spécialisé remplace ses micro-tailles par le niveau sémantique adapté et récupère l’espace par le layout.

**Tech Stack:** Astro 7, CSS Grid/Flexbox, TypeScript, tests `node:test` via `tsx`.

## Global Constraints

- Labels/métadonnées visibles : `>= 0.70rem`.
- Contrôles/preuves/statuts : `>= 0.75rem`.
- Contenu courant : cible `>= 0.80rem`.
- Exceptions : texte SVG en pixels et légendes réellement visuellement masquées.
- Aucun contenu essentiel caché, aucun scroll à 1280×720, aucun overflow horizontal à 390×844.
- Aucun fichier du bloc C modifié.

---

### Task 1: Garde typographique

**Files:**
- Modify: `tests/presentation-visuals.test.ts`

**Interfaces:**
- Consumes: CSS brut de `src/styles/presentation.css` et `src/components/presentation/visuals/b/*.astro`.
- Produces: test qui refuse les tailles visibles sous les planchers et documente les exceptions.

- [ ] Écrire le test qui extrait les blocs de style B et échoue sur les tailles actuelles.
- [ ] Exécuter le test ciblé et vérifier RED sur missions/checkpoints et composants spécialisés.

### Task 2: Scènes partagées mission/checkpoint

**Files:**
- Modify: `src/styles/presentation.css`
- Test: `tests/presentation-visuals.test.ts`

**Interfaces:**
- Consumes: tokens `--b-font-meta`, `--b-font-control`, `--b-font-body`.
- Produces: missions/checkpoints lisibles et compacts pour toutes les routes B concernées.

- [ ] Définir les trois tokens sur `.presentation-stage[data-family="b"]`.
- [ ] Remplacer les micro-tailles par les tokens et récupérer la hauteur via gaps, colonnes et padding.
- [ ] Exécuter le test ciblé jusqu’au GREEN.

### Task 3: Six composants spécialisés

**Files:**
- Modify: `src/components/presentation/visuals/b/SetupDiagnostic.astro`
- Modify: `src/components/presentation/visuals/b/PromptBuilder.astro`
- Modify: `src/components/presentation/visuals/b/ArtifactTestLoop.astro`
- Modify: `src/components/presentation/visuals/b/PacteWorkspace.astro`
- Modify: `src/components/presentation/visuals/b/IpmtrLoop.astro`
- Modify: `src/components/presentation/visuals/b/WorkspaceTriptych.astro`
- Test: `tests/presentation-visuals.test.ts`

**Interfaces:**
- Consumes: tokens B hérités de la scène.
- Produces: labels `>= .70rem`, contrôles/preuves/statuts `>= .75rem`, contenu courant `>= .80rem`.

- [ ] Remplacer chaque taille visible sous le plancher par le token sémantique adapté.
- [ ] Réduire les espacements et redistribuer les colonnes sans changer l’ordre DOM ni le fallback.
- [ ] Documenter les tailles SVG en pixels comme exceptions de `viewBox`.
- [ ] Exécuter le test ciblé jusqu’au GREEN.

### Task 4: Vérification exhaustive

**Files:**
- Modify: `.superpowers/sdd/task-7-report.md`

**Interfaces:**
- Consumes: build statique et 33 routes B.
- Produces: preuve desktop/mobile et commit propre.

- [ ] Exécuter `npm test`, attendre 0 échec.
- [ ] Exécuter `npm run build`, attendre 104 pages.
- [ ] Exécuter `git diff --check`, attendre une sortie vide.
- [ ] Sweeper les 33 routes à 1280×720 et vérifier `scrollHeight <= clientHeight` et `scrollWidth <= clientWidth`.
- [ ] Sweeper les 33 routes à 390×844 et vérifier l’absence d’overflow horizontal.
- [ ] Compléter le rapport avec les exceptions et métriques.
- [ ] Committer avec `fix: rendre le bloc B lisible au projecteur`.

