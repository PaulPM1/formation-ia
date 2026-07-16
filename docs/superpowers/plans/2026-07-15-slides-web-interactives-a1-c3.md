# Slides Web interactives A1 à C3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire un mode présentation Web Astro complet pour les briques A1 à C3, avec 76 slides visuelles et interactives, des liens contextuels, un shell accessible et un skill partagé permettant à Mathieu de prolonger D à F.

**Architecture:** Les briques MDX restent la documentation canonique. Des manifestes TypeScript décrivent la narration condensée ; un registre associe chaque slide à une scène Astro interactive ; un shell statique gère routes, navigation, sommaire, plein écran et notes. Les visuels sont construits avec HTML sémantique, SVG, CSS et JavaScript natif, sans framework client ni bibliothèque d'animation.

**Tech Stack:** Astro 7, TypeScript strict, composants `.astro`, SVG/CSS/DOM natifs, tests `node:test` via `tsx`, build statique Vercel.

## Global Constraints

- Le livrable est Web uniquement : aucun PowerPoint ou export PPTX.
- Le domaine canonique du wiki est `https://formation-ia-ruby.vercel.app`.
- Les briques MDX restent la source détaillée ; les manifestes ne contiennent que la narration projetée.
- Aucun quota automatique : les 76 slides listées ci-dessous résultent du découpage validé et peuvent être fusionnées ou divisées uniquement si le test de compréhension le justifie.
- Chaque slide porte une thèse et un objet visuel dominant occupant généralement 70 à 85 % de la composition.
- Une interaction doit révéler une cause, une transformation, une comparaison, une séquence ou un changement d'état.
- Le fond principal est le « champ lumineux vivant » : ivoire, halos lents par famille, aucune mosaïque ni grille permanente.
- Toute animation respecte `prefers-reduced-motion`; le contenu essentiel reste visible sans animation et sans JavaScript.
- Utiliser des éléments HTML natifs, notamment `<button>` et `<dialog>`, avant d'ajouter de l'ARIA.
- Tous les contrôles fonctionnent au clavier avec un focus visible ; aucune couleur ne porte seule une information.
- Les liens « Approfondir », « Ressource officielle », « Télécharger » et « Digression » sont nommés et ouvrent un nouvel onglet lorsque la présentation doit rester affichée.
- Ne pas ajouter React, Vue, Svelte, GSAP, Framer Motion, une bibliothèque d'icônes ou un moteur de slides.
- Node.js reste `>=22.12.0`; conserver `npm` et le lockfile existant.
- Avant chaque tâche visuelle, invoquer le skill local `$slide-visual-director`.

---

## File Map

### Skill partagé

- `.agents/skills/slide-visual-director/SKILL.md` — workflow obligatoire de conception et de QA visuelle.
- `.agents/skills/slide-visual-director/agents/openai.yaml` — métadonnées d'invocation.
- `.agents/skills/slide-visual-director/references/visual-contract.md` — palette, grammaires, tests silencieux et accessibilité.

### Modèle et contenu

- `src/presentation/presentation-model.ts` — types publics et clés de scènes.
- `src/presentation/presentation-validation.ts` — validation, aplatissement et voisinage.
- `src/presentation/presentation-links.ts` — construction des liens canoniques.
- `src/presentation/manifests/a.ts` — slides A1 à A5.
- `src/presentation/manifests/b.ts` — slides B0 à B4-bis.
- `src/presentation/manifests/c.ts` — slides C1 à C3.
- `src/presentation/manifests/index.ts` — ordre A1 à C3 et API de lecture.

### Shell et scènes

- `src/layouts/PresentationLayout.astro` — document plein écran sans chrome du site.
- `src/pages/presenter/index.astro` — sommaire et démarrage.
- `src/pages/presenter/[brick]/[slide].astro` — route statique de chaque slide.
- `src/components/presentation/PresenterShell.astro` — slide, contrôles, progression et dialogues.
- `src/components/presentation/VisualRegistry.astro` — résolution de la scène visuelle.
- `src/components/presentation/scenes/SceneFrame.astro` — cadre sémantique commun.
- `src/components/presentation/scenes/MissionBoard.astro` — mission, durée, livrable et réussite.
- `src/components/presentation/scenes/CheckpointScene.astro` — validation observable.
- `src/components/presentation/scenes/ResourceRail.astro` — liens contextuels.
- `src/components/presentation/visuals/a/*.astro` — scènes A1 à A5.
- `src/components/presentation/visuals/b/*.astro` — scènes B0 à B4-bis.
- `src/components/presentation/visuals/c/*.astro` — scènes C1 à C3.
- `src/scripts/presentation-controller.ts` — clavier, plein écran et dialogues natifs.
- `src/styles/presentation.css` — champ lumineux, typographie, responsive et mouvement réduit.

### Validation et tests

- `scripts/check-presentation.ts` — validation du manifeste et des liens internes.
- `tests/presentation-validation.test.ts` — erreurs de structure et de liens.
- `tests/presentation-content.test.ts` — inventaire des 76 slides et couverture A1 à C3.
- `tests/presentation-routing.test.ts` — routes et voisinage.
- `tests/presentation-visuals.test.ts` — couverture du registre visuel et contraintes de source.
- `tests/site-theme.test.ts` — présence du mode présentation dans la navigation publique.

---

### Task 1: Créer le skill `slide-visual-director`

**Files:**
- Create: `.agents/skills/slide-visual-director/SKILL.md`
- Create: `.agents/skills/slide-visual-director/agents/openai.yaml`
- Create: `.agents/skills/slide-visual-director/references/visual-contract.md`

**Interfaces:**
- Consumes: thèse, objectif d'apprentissage, contexte précédent/suivant, public, données de la slide.
- Produces: une décision de représentation, un composant visuel accessible et un compte rendu des trois tests visuels.

- [ ] **Step 1: Initialiser le skill avec l'outil officiel**

Run:

```bash
python3 /Users/paulperrin/.codex/skills/.system/skill-creator/scripts/init_skill.py \
  slide-visual-director \
  --path .agents/skills \
  --resources references \
  --interface 'display_name=Directeur visuel des slides' \
  --interface 'short_description=Conçoit des slides visuelles et interactives' \
  --interface 'default_prompt=Use $slide-visual-director to create or adapt the visual for this training slide.'
```

Expected: le dossier `.agents/skills/slide-visual-director/` contient `SKILL.md`, `agents/openai.yaml` et `references/`.

- [ ] **Step 2: Remplacer le gabarit par le workflow définitif**

Write `.agents/skills/slide-visual-director/SKILL.md` with this exact structure:

```markdown
---
name: slide-visual-director
description: Conçoit, adapte et vérifie les visuels des slides Web de la formation Les briques du Vibe Coding. Utiliser lors de toute création, refonte ou modification d'une slide, d'une interaction pédagogique, d'un diagramme, d'une animation ou d'un composant sous /presenter.
---

# Directeur visuel des slides

## Entrées obligatoires

Lire la thèse, l'objectif pédagogique, la slide précédente, la slide suivante,
les données disponibles et les contraintes du public. Lire
`references/visual-contract.md` avant de modifier un visuel.

## Workflow

1. Reformuler en une phrase ce que le public doit comprendre sans commentaire.
2. Choisir une grammaire : transformation, séquence, comparaison, système,
   décision, simulation, construction, mission ou checkpoint.
3. Définir les objets, relations, états et contrôles avant le style.
4. Choisir Astro/HTML pour la structure, SVG pour les relations spatiales, CSS
   pour les états simples et Canvas seulement pour une simulation dense.
5. Construire le visuel de façon responsive et progressivement améliorée.
6. Fournir un nom accessible, une description complexe et un état sans JS.
7. Désactiver le mouvement non essentiel avec `prefers-reduced-motion`.
8. Exécuter les tests silencieux, coup d'œil et nécessité.
9. Refuser tout effet, carte, flèche ou interaction qui n'encode aucune relation.

## Sortie

Indiquer la thèse, la grammaire choisie, l'interaction, le repli accessible et
le résultat des trois tests. Modifier uniquement les fichiers nécessaires.
```

- [ ] **Step 3: Écrire le contrat visuel de référence**

Write `references/visual-contract.md` with these sections and rules:

```markdown
# Contrat visuel

## Surface
- Fond ivoire `#fffaf1`, encre `#16221d`, surface `#fffdf8`.
- Accents : A `#ffbf3f`, B `#72c1e5`, C `#ed6a46`, D `#72af80`, E `#b79bca`, F `#ef9850`.
- Halos périphériques lents ; aucune grille ou mosaïque permanente.

## Hiérarchie
- Le visuel occupe 70 à 85 % de la slide.
- La thèse tient sur deux lignes courtes si possible.
- Le texte d'appui explique seulement ce que le visuel ne peut pas encoder.

## Interactions permises
- Révéler une étape, modifier un paramètre, comparer deux états, ouvrir une
  branche, rejouer une transformation ou vérifier un classement.
- Ne jamais cacher une information essentielle derrière le survol seul.

## Tests bloquants
1. Silencieux : la thèse est comprise sans commentaire.
2. Coup d'œil : le parcours visuel est évident en quelques secondes.
3. Nécessité : l'interaction clarifie réellement une relation.

## Accessibilité
- HTML natif avant ARIA ; boutons réels ; focus visible.
- SVG informatif avec `<title>` et description associée.
- État final lisible sans JavaScript.
- Aucun état indiqué par la couleur seule.
- `prefers-reduced-motion` supprime déplacements et transitions.
```

- [ ] **Step 4: Valider le skill**

Run:

```bash
python3 /Users/paulperrin/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/slide-visual-director
```

Expected: `Skill is valid!`

- [ ] **Step 5: Commit**

```bash
git add .agents/skills/slide-visual-director
git commit -m "feat: ajouter le directeur visuel des slides"
```

---

### Task 2: Définir le modèle de présentation et sa validation

**Files:**
- Create: `src/presentation/presentation-model.ts`
- Create: `src/presentation/presentation-links.ts`
- Create: `src/presentation/presentation-validation.ts`
- Create: `tests/presentation-validation.test.ts`

**Interfaces:**
- Produces: `PresentationDeck`, `PresentationSlide`, `SlideVisualKey`, `validatePresentation`, `flattenSlides`, `getSlideNeighbors`, `wikiLink`.
- Consumed by: manifestes, routes, registre visuel et script de validation.

- [ ] **Step 1: Écrire les tests en échec**

Create `tests/presentation-validation.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { wikiLink } from '../src/presentation/presentation-links';
import {
  flattenSlides,
  getSlideNeighbors,
  validatePresentation,
} from '../src/presentation/presentation-validation';
import type { PresentationDeck } from '../src/presentation/presentation-model';

const deck: PresentationDeck = {
  brickId: 'a1',
  family: 'a',
  title: "C'est quoi un LLM",
  slides: [
    {
      id: 'a1-opening',
      role: 'opening',
      claim: 'Une réponse fluide n’est pas une preuve.',
      visual: { key: 'token-predictor', data: {} },
      links: [wikiLink('a1', 'concept-durable', 'Approfondir')],
      speaker: { durationMinutes: 2, notes: 'Faire observer.', transition: 'Montrer le contexte.' },
      accessibleDescription: 'Le contexte alimente une prédiction token par token.',
    },
  ],
};

test('valide un deck complet', () => {
  assert.deepEqual(validatePresentation([deck]), []);
});

test('rejette les identifiants de slides dupliqués', () => {
  const duplicate = { ...deck, brickId: 'a2', slides: deck.slides };
  assert.ok(validatePresentation([deck, duplicate]).some((issue) => issue.includes('dupliqué')));
});

test('construit uniquement des liens wiki canoniques', () => {
  assert.equal(
    wikiLink('c2', 'ressources', 'Voir les ressources').href,
    'https://formation-ia-ruby.vercel.app/briques/c2/#ressources',
  );
});

test('aplatit la séquence et calcule ses voisins', () => {
  const slides = flattenSlides([deck]);
  assert.equal(slides[0].route, '/presenter/a1/a1-opening/');
  assert.deepEqual(getSlideNeighbors(slides, 'a1-opening'), {
    previous: null,
    next: null,
  });
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test --test-name-pattern="présentation|deck|wiki|aplatit" tests/**/*.test.ts`

Expected: FAIL because the presentation modules do not exist.

- [ ] **Step 3: Écrire les types publics**

Create `src/presentation/presentation-model.ts`:

```ts
import type { BrickFrontmatter } from '../content/brick-model';

export const SLIDE_ROLES = [
  'opening', 'claim', 'explanation', 'demonstration', 'mission',
  'checkpoint', 'resources', 'transition',
] as const;

export const SLIDE_VISUAL_KEYS = [
  'mission-board', 'checkpoint', 'resource-rail',
  'token-predictor', 'context-comparison', 'response-workflow-agent',
  'interface-continuum', 'context-budget', 'verification-audit',
  'setup-diagnostic', 'prompt-builder', 'artifact-test-loop',
  'pacte-workspace', 'ipmtr-loop', 'workspace-triptych',
  'skill-anatomy', 'mcp-connection-map', 'trigger-timeline',
] as const;

export type SlideRole = (typeof SLIDE_ROLES)[number];
export type SlideVisualKey = (typeof SLIDE_VISUAL_KEYS)[number];
export type PresentationFamily = BrickFrontmatter['family'];

export type PresentationLink = {
  kind: 'wiki' | 'official' | 'download' | 'digression';
  label: string;
  href: string;
};

export type PresentationSlide = {
  id: string;
  role: SlideRole;
  claim: string;
  support?: string;
  visual: { key: SlideVisualKey; data: Record<string, unknown> };
  links: PresentationLink[];
  speaker: { durationMinutes: number; notes: string; transition: string };
  accessibleDescription: string;
};

export type PresentationDeck = {
  brickId: string;
  family: PresentationFamily;
  title: string;
  slides: PresentationSlide[];
};

export type RoutedSlide = PresentationSlide & {
  brickId: string;
  family: PresentationFamily;
  brickTitle: string;
  route: string;
  absoluteIndex: number;
  total: number;
};
```

- [ ] **Step 4: Construire les liens canoniques**

Create `src/presentation/presentation-links.ts`:

```ts
import type { PresentationLink } from './presentation-model';

export const WIKI_BASE_URL = 'https://formation-ia-ruby.vercel.app';

export function wikiLink(brickId: string, anchor: string, label: string): PresentationLink {
  return {
    kind: 'wiki',
    label,
    href: `${WIKI_BASE_URL}/briques/${brickId}/#${anchor}`,
  };
}

export function externalLink(
  kind: Exclude<PresentationLink['kind'], 'wiki'>,
  label: string,
  href: string,
): PresentationLink {
  return { kind, label, href };
}
```

- [ ] **Step 5: Implémenter validation, aplatissement et voisinage**

Create `src/presentation/presentation-validation.ts`:

```ts
import { SLIDE_VISUAL_KEYS, type PresentationDeck, type RoutedSlide } from './presentation-model';
import { WIKI_BASE_URL } from './presentation-links';

const allowedDownloadHosts = new Set(['claude.com', 'code.visualstudio.com']);
const allowedOfficialHosts = new Set([
  'agentskills.io', 'anthropic.com', 'www.anthropic.com', 'claude.ai',
  'claude.com', 'code.claude.com', 'code.visualstudio.com',
  'docs.anthropic.com', 'modelcontextprotocol.io', 'status.anthropic.com',
  'support.anthropic.com', 'support.claude.com',
]);
const visualKeys = new Set<string>(SLIDE_VISUAL_KEYS);

export function validatePresentation(decks: PresentationDeck[]): string[] {
  const issues: string[] = [];
  const deckIds = new Set<string>();
  const slideIds = new Set<string>();

  for (const deck of decks) {
    if (deckIds.has(deck.brickId)) issues.push(`Brique dupliquée : ${deck.brickId}`);
    deckIds.add(deck.brickId);
    if (deck.slides.length === 0) issues.push(`Brique sans slide : ${deck.brickId}`);

    for (const slide of deck.slides) {
      if (slideIds.has(slide.id)) issues.push(`Identifiant de slide dupliqué : ${slide.id}`);
      slideIds.add(slide.id);
      if (!visualKeys.has(slide.visual.key)) issues.push(`Visuel inconnu : ${slide.visual.key}`);
      if (!slide.claim.trim()) issues.push(`Thèse vide : ${slide.id}`);
      if (!slide.accessibleDescription.trim()) issues.push(`Description accessible vide : ${slide.id}`);
      for (const link of slide.links) {
        let url: URL;
        try {
          url = new URL(link.href);
        } catch {
          issues.push(`URL invalide : ${slide.id}`);
          continue;
        }
        if (url.protocol !== 'https:') issues.push(`Lien non HTTPS : ${slide.id}`);
        if (link.kind === 'wiki' && !link.href.startsWith(WIKI_BASE_URL)) {
          issues.push(`Lien wiki non canonique : ${slide.id}`);
        }
        if (link.kind === 'download' && !allowedDownloadHosts.has(url.hostname)) {
          issues.push(`Téléchargement non officiel : ${slide.id}`);
        }
        if (link.kind === 'official' && !allowedOfficialHosts.has(url.hostname)) {
          issues.push(`Source officielle non approuvée : ${slide.id}`);
        }
      }
    }
  }
  return issues;
}

export function flattenSlides(decks: PresentationDeck[]): RoutedSlide[] {
  const total = decks.reduce((sum, deck) => sum + deck.slides.length, 0);
  return decks.flatMap((deck) => deck.slides).map((slide, absoluteIndex) => {
    const deck = decks.find((candidate) => candidate.slides.includes(slide));
    if (!deck) throw new Error(`Brique introuvable pour ${slide.id}`);
    return {
      ...slide,
      brickId: deck.brickId,
      family: deck.family,
      brickTitle: deck.title,
      route: `/presenter/${deck.brickId}/${slide.id}/`,
      absoluteIndex,
      total,
    };
  });
}

export function getSlideNeighbors(slides: RoutedSlide[], slideId: string) {
  const index = slides.findIndex((slide) => slide.id === slideId);
  if (index < 0) throw new Error(`Slide inconnue : ${slideId}`);
  return {
    previous: slides[index - 1] ?? null,
    next: slides[index + 1] ?? null,
  };
}
```

- [ ] **Step 6: Exécuter les tests**

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/presentation tests/presentation-validation.test.ts
git commit -m "feat: définir le modèle des slides interactives"
```

---

### Task 3: Rédiger les 76 slides dans les manifestes

**Files:**
- Create: `src/presentation/manifests/a.ts`
- Create: `src/presentation/manifests/b.ts`
- Create: `src/presentation/manifests/c.ts`
- Create: `src/presentation/manifests/index.ts`
- Create: `tests/presentation-content.test.ts`

**Interfaces:**
- Consumes: `PresentationDeck`, `wikiLink`, `externalLink`.
- Produces: `PRESENTATION_DECKS`, `PRESENTATION_SLIDES`, `getPresentationSlide`.

- [ ] **Step 1: Écrire le test d'inventaire en échec**

Create `tests/presentation-content.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { PRESENTATION_DECKS, PRESENTATION_SLIDES } from '../src/presentation/manifests';
import { validatePresentation } from '../src/presentation/presentation-validation';

const expectedIds = [
  'a1', 'a2', 'a3', 'a4', 'a5', 'b0', 'b1', 'b2', 'b3', 'b4', 'b4-bis',
  'c1', 'c2', 'c3',
];

test('couvre toutes les briques A1 à C3 dans l’ordre pédagogique', () => {
  assert.deepEqual(PRESENTATION_DECKS.map((deck) => deck.brickId), expectedIds);
});

test('contient les 76 étapes de compréhension validées', () => {
  assert.equal(PRESENTATION_SLIDES.length, 76);
});

test('chaque slide possède une thèse, une description et une note formateur', () => {
  for (const slide of PRESENTATION_SLIDES) {
    assert.ok(slide.claim.trim(), slide.id);
    assert.ok(slide.accessibleDescription.trim(), slide.id);
    assert.ok(slide.speaker.notes.trim(), slide.id);
    assert.ok(slide.speaker.transition.trim(), slide.id);
  }
  assert.deepEqual(validatePresentation(PRESENTATION_DECKS), []);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test --test-name-pattern="briques A1|76 étapes|note formateur" tests/**/*.test.ts`

Expected: FAIL because the manifest modules do not exist.

- [ ] **Step 3: Créer le manifeste A avec exactement ces 24 slides**

Use `satisfies PresentationDeck[]`. Each entry must copy its mission, success
criterion, speaker note and official URLs from the corresponding MDX. Use this
binding inventory:

| ID | Claim | Visual key | Interaction |
|---|---|---|---|
| a1-opening | Une réponse fluide n'est pas une preuve. | token-predictor | Lancer la prédiction. |
| a1-token-loop | Une réponse se construit token après token. | token-predictor | Avancer d'un token. |
| a1-context | Changer le contexte change la suite plausible. | context-comparison | Basculer entre deux contextes. |
| a1-plausible | Plausible et vrai sont deux questions différentes. | verification-audit | Classer une affirmation. |
| a1-mission | Expliquez, repérez, puis améliorez la consigne. | mission-board | Ouvrir la mission A1. |
| a2-three-modes | Réponse, workflow et agent ne délèguent pas la même chose. | response-workflow-agent | Comparer les trois modes. |
| a2-response | Une réponse transforme du contexte en texte. | response-workflow-agent | Isoler le mode réponse. |
| a2-workflow | Un workflow suit un chemin décidé à l'avance. | response-workflow-agent | Parcourir les étapes fixes. |
| a2-agent-loop | Un agent choisit la prochaine action selon ce qu'il observe. | response-workflow-agent | Rejouer la boucle. |
| a2-classify | La variabilité du chemin détermine le bon mode. | mission-board | Classer quatre situations. |
| a3-right-surface | Le bon outil donne juste assez de contexte et d'action. | interface-continuum | Déplacer le besoin sur le continuum. |
| a3-continuum | Chat, Artifacts, Cowork et Claude Code augmentent progressivement la capacité d'action. | interface-continuum | Explorer chaque surface. |
| a3-choice | Toute tâche n'a pas besoin de devenir agentique. | interface-continuum | Choisir l'interface minimale. |
| a3-mission | Associez chaque prochaine action à la surface la plus simple. | mission-board | Ouvrir la mission A3. |
| a4-three-costs | Abonnement, limite d'usage et API sont trois réalités différentes. | context-budget | Sélectionner les trois couches. |
| a4-context-meter | Chaque élément de contexte a un coût et une utilité. | context-budget | Ajouter ou retirer du contexte. |
| a4-agentic | Lire, agir et se corriger multiplie les étapes consommées. | context-budget | Comparer question et tâche agentique. |
| a4-budget | Optimiser consiste à fournir le contexte utile une fois. | context-budget | Construire une fiche budget. |
| a4-checkpoint | Un point d'arrêt évite de relancer sans preuve. | checkpoint | Valider les cinq règles. |
| a5-convincing | Une erreur bien formulée reste une erreur. | verification-audit | Révéler les affirmations douteuses. |
| a5-biases | Nos biais transforment la fluidité en confiance excessive. | verification-audit | Explorer les cinq biais. |
| a5-risk | L'effort de vérification doit suivre le niveau de risque. | verification-audit | Déplacer une décision sur l'échelle. |
| a5-method | Stop — Source — Test — Décision rend l'incertitude visible. | verification-audit | Parcourir les quatre étapes. |
| a5-mission | Auditez une réponse avant de décider. | mission-board | Ouvrir la mission A5. |

- [ ] **Step 4: Créer le manifeste B avec exactement ces 33 slides**

| ID | Claim | Visual key | Interaction |
|---|---|---|---|
| b0-layers | Compte, surface, fonctionnalités et API sont quatre couches distinctes. | setup-diagnostic | Explorer les couches. |
| b0-diagnostic | Le setup commence par un état observable. | setup-diagnostic | Cocher les diagnostics. |
| b0-test | « Atelier prêt » prouve que la conversation fonctionne. | setup-diagnostic | Exécuter le test. |
| b0-fallback | Une fonction absente appelle un chemin de repli, pas un blocage. | setup-diagnostic | Choisir le repli. |
| b0-ready | Le groupe est prêt lorsque chacun peut agir sans donnée sensible. | checkpoint | Valider le setup. |
| b1-vague | Une demande vague force Claude à inventer le brief. | prompt-builder | Comparer avant/après. |
| b1-four-blocks | Objectif, contexte, contraintes et forme réduisent l'ambiguïté. | prompt-builder | Assembler les quatre blocs. |
| b1-builder | Un prompt utile est un brief lisible par une autre personne. | prompt-builder | Modifier un bloc. |
| b1-loop | La première réponse ouvre une boucle d'évaluation. | prompt-builder | Signaler puis corriger un écart. |
| b1-mission | Écrivez, évaluez et corrigez une seule fois. | mission-board | Ouvrir la mission B1. |
| b2-object | Un Artifact fait sortir le résultat du fil de discussion. | artifact-test-loop | Déplacer la sortie vers l'objet. |
| b2-anatomy | Conversation, objet et versions ont des rôles distincts. | artifact-test-loop | Explorer les trois zones. |
| b2-mvp | Une action principale suffit pour rendre le prototype testable. | artifact-test-loop | Réduire le périmètre. |
| b2-tests | Définir trois tests avant de construire donne une preuve de fin. | artifact-test-loop | Ajouter les tests. |
| b2-correction | Corriger l'écart principal vaut mieux que tout réécrire. | artifact-test-loop | Comparer deux itérations. |
| b2-mission | Construisez un mini-outil que quelqu'un utilise sans explication. | mission-board | Ouvrir la mission B2. |
| b3-delegation | Cowork délègue le travail, jamais la responsabilité. | pacte-workspace | Montrer sources, plan et sortie. |
| b3-pacte | P.A.C.T.E. borne la tâche avant l'exécution. | pacte-workspace | Déplier les cinq garde-fous. |
| b3-permissions | Une permission trop large agrandit la surface de risque. | pacte-workspace | Réduire le périmètre. |
| b3-observe | Un agent doit rester observable et interruptible. | pacte-workspace | Interrompre puis rediriger. |
| b3-check | Le résumé de Claude ne remplace pas une vérification indépendante. | pacte-workspace | Comparer fichiers et résumé. |
| b3-mission | Produisez une sortie vérifiée sans toucher aux originaux. | mission-board | Ouvrir la mission B3. |
| b4-context | Claude Code agit dans le contexte réel d'un dossier. | ipmtr-loop | Explorer fichiers, commandes et diff. |
| b4-ipmtr | Inspecter, planifier, modifier, tester et relire forme une boucle. | ipmtr-loop | Avancer dans I.P.M.T.R. |
| b4-permission | Comprendre une commande précède son autorisation. | ipmtr-loop | Accepter, refuser ou demander une alternative. |
| b4-test | Le test et le diff sont les preuves du changement. | ipmtr-loop | Comparer résumé et preuve. |
| b4-mission | Réalisez une modification limitée et vérifiée. | mission-board | Ouvrir la mission B4. |
| b4-transition | Voir le dossier, le fichier et le terminal prépare l'étape suivante. | workspace-triptych | Passer vers VS Code. |
| b4bis-workspace | Un workspace est un dossier ouvert avec son contexte. | workspace-triptych | Ouvrir le dossier. |
| b4bis-install | Mac et Windows arrivent au même test par des chemins différents. | setup-diagnostic | Choisir la plateforme. |
| b4bis-triptych | Explorateur, éditeur et terminal montrent trois vues du même projet. | workspace-triptych | Mettre en évidence chaque zone. |
| b4bis-path | Le terminal doit pointer vers le dossier affiché. | workspace-triptych | Comparer `pwd` et `Get-Location`. |
| b4bis-checkpoint | Le setup est fini lorsque fichier et terminal concordent. | checkpoint | Valider le test final. |

- [ ] **Step 5: Créer le manifeste C avec exactement ces 19 slides**

| ID | Claim | Visual key | Interaction |
|---|---|---|---|
| c1-repeat | Une méthode répétée trois fois mérite peut-être un Skill. | skill-anatomy | Comparer prompt et méthode réutilisable. |
| c1-neighbors | Skill, contexte, outil et hook ne répondent pas au même besoin. | skill-anatomy | Classer les quatre notions. |
| c1-anatomy | Description, procédure et sortie rendent le Skill découvrable et testable. | skill-anatomy | Explorer le `SKILL.md`. |
| c1-trigger | Une description précise décide quand le Skill intervient. | skill-anatomy | Tester deux descriptions. |
| c1-tests | Un cas positif et un cas négatif révèlent les mauvais déclenchements. | skill-anatomy | Lancer les deux cas. |
| c1-mission | Encodez une procédure de cinq étapes maximum. | mission-board | Ouvrir la mission C1. |
| c2-api | Une API est le contrat d'un service ; MCP standardise la connexion à l'IA. | mcp-connection-map | Basculer API/MCP. |
| c2-chain | Utilisateur, client, serveur MCP et ressource forment une chaîne. | mcp-connection-map | Suivre la requête. |
| c2-tools | Commencer par l'inventaire des outils rend la portée visible. | mcp-connection-map | Inspecter les outils exposés. |
| c2-permissions | La connexion augmente capacité et surface de risque ensemble. | mcp-connection-map | Réduire les permissions. |
| c2-readonly | Une première requête en lecture seule limite le coût d'une erreur. | mcp-connection-map | Exécuter le test fictif. |
| c2-revoke | Une intégration sûre inclut sa propre révocation. | mcp-connection-map | Couper la connexion. |
| c2-mission | Cartographiez données, action, preuve et révocation. | mission-board | Ouvrir la mission C2. |
| c3-trigger | Un hook répond à un événement ; une tâche planifiée répond au temps. | trigger-timeline | Basculer événement/cadence. |
| c3-hook | Un hook exécute une règle immédiate dans le cycle de l'outil. | trigger-timeline | Déclencher puis désactiver. |
| c3-schedule | Une tâche planifiée ouvre une nouvelle exécution avec des outils autorisés. | trigger-timeline | Passer de manuel à récurrent. |
| c3-guardrails | Bornée, observable et réversible : sinon l'automatisation amplifie l'erreur. | trigger-timeline | Ajouter les garde-fous. |
| c3-pause | Tester, surveiller, mettre en pause et supprimer font partie du système. | trigger-timeline | Parcourir le cycle de vie. |
| c3-mission | Concevez une automatisation que quelqu'un d'autre peut arrêter. | mission-board | Ouvrir la mission C3. |

- [ ] **Step 6: Exporter l'API de lecture**

Create `src/presentation/manifests/index.ts`:

```ts
import { A_DECKS } from './a';
import { B_DECKS } from './b';
import { C_DECKS } from './c';
import { flattenSlides } from '../presentation-validation';

export const PRESENTATION_DECKS = [...A_DECKS, ...B_DECKS, ...C_DECKS];
export const PRESENTATION_SLIDES = flattenSlides(PRESENTATION_DECKS);

export function getPresentationSlide(brickId: string, slideId: string) {
  return PRESENTATION_SLIDES.find(
    (slide) => slide.brickId === brickId && slide.id === slideId,
  );
}
```

- [ ] **Step 7: Exécuter les tests et le contrôle éditorial**

Run: `npm test && npm run content:check`

Expected: all tests PASS and `Contenu valide : 24 briques contrôlées.`

- [ ] **Step 8: Commit**

```bash
git add src/presentation/manifests tests/presentation-content.test.ts
git commit -m "content: structurer les slides A1 à C3"
```

---

### Task 4: Construire les routes et le shell accessible

**Files:**
- Create: `src/layouts/PresentationLayout.astro`
- Create: `src/pages/presenter/index.astro`
- Create: `src/pages/presenter/[brick]/[slide].astro`
- Create: `src/components/presentation/PresenterShell.astro`
- Create: `src/scripts/presentation-controller.ts`
- Create: `src/styles/presentation.css`
- Create: `tests/presentation-routing.test.ts`

**Interfaces:**
- Consumes: `PRESENTATION_DECKS`, `PRESENTATION_SLIDES`, `getSlideNeighbors`.
- Produces: routes statiques, contrôles `data-presenter-*`, dialogues `#presentation-toc` et `#speaker-notes`.

- [ ] **Step 1: Écrire les tests de routage en échec**

Create `tests/presentation-routing.test.ts`:

```ts
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { PRESENTATION_SLIDES } from '../src/presentation/manifests';
import { getSlideNeighbors } from '../src/presentation/presentation-validation';

test('chaque slide possède une route unique', () => {
  const routes = PRESENTATION_SLIDES.map((slide) => slide.route);
  assert.equal(new Set(routes).size, routes.length);
  assert.ok(routes.every((route) => route.startsWith('/presenter/')));
});

test('la séquence relie la première slide à la deuxième', () => {
  const neighbors = getSlideNeighbors(PRESENTATION_SLIDES, 'a1-opening');
  assert.equal(neighbors.previous, null);
  assert.equal(neighbors.next?.id, 'a1-token-loop');
});

test('le contrôleur ignore les raccourcis lorsque le focus est dans un contrôle', async () => {
  const source = await readFile(
    new URL('../src/scripts/presentation-controller.ts', import.meta.url),
    'utf8',
  );
  assert.match(source, /a, button, input, textarea, select/);
  assert.match(source, /closest\(interactiveSelector\)/);
  assert.match(source, /requestFullscreen/);
  assert.match(source, /showModal/);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test --test-name-pattern="route unique|séquence|contrôleur" tests/**/*.test.ts`

Expected: FAIL because the shell and controller do not exist.

- [ ] **Step 3: Créer le layout plein écran**

`PresentationLayout.astro` must set `<html lang="fr">`, a unique title, the
existing Google Fonts, `presentation.css`, a skip link, and `<main id="slide-content" tabindex="-1">`.
It must not render `BaseLayout`, the site header or the site footer.

Create a working first version of `presentation.css` with an ivory body,
full-height stage, fluid type, visible focus and responsive controls. Task 5
will add the validated luminous field and scene styling.

- [ ] **Step 4: Créer le sommaire**

`/presenter` renders one ordered list grouped by family, links the first slide of
each brick, and offers a primary link to `/presenter/a1/a1-opening/`.

- [ ] **Step 5: Créer les routes statiques**

Use this `getStaticPaths` contract in `[brick]/[slide].astro`:

```ts
export function getStaticPaths() {
  return PRESENTATION_SLIDES.map((slide) => ({
    params: { brick: slide.brickId, slide: slide.id },
    props: { slide },
  }));
}
```

Calculate neighbors and render `PresenterShell` inside `PresentationLayout`.

- [ ] **Step 6: Construire le shell avec des éléments natifs**

`PresenterShell.astro` must render:

```astro
<article class="presentation-slide" data-family={slide.family} aria-labelledby="slide-title">
  <header class="presentation-heading">
    <p>{slide.brickId.toUpperCase()} · {slide.brickTitle}</p>
    <h1 id="slide-title" tabindex="-1">{slide.claim}</h1>
  </header>
  <figure class="presentation-visual" data-visual-key={slide.visual.key}>
    <figcaption>{slide.accessibleDescription}</figcaption>
  </figure>
  <nav aria-label="Approfondissements">
    {slide.links.map((link) => <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
  </nav>
</article>
<nav class="presentation-controls" aria-label="Navigation des slides">
  {previous
    ? <a href={previous.route} data-previous>Précédente</a>
    : <span aria-disabled="true">Précédente</span>}
  <button type="button" data-dialog-target="#presentation-toc">Sommaire</button>
  <button type="button" data-dialog-target="#speaker-notes">Notes</button>
  <button type="button" data-presenter-fullscreen>Plein écran</button>
  {next
    ? <a href={next.route} data-next>Suivante</a>
    : <span aria-disabled="true">Suivante</span>}
</nav>
<dialog id="presentation-toc" aria-labelledby="toc-title">
  <h2 id="toc-title">Sommaire</h2>
  <nav aria-label="Toutes les slides">
    <ol>
      {PRESENTATION_DECKS.map((deck) => (
        <li><a href={`/presenter/${deck.brickId}/${deck.slides[0].id}/`}>{deck.brickId.toUpperCase()} · {deck.title}</a></li>
      ))}
    </ol>
  </nav>
  <button type="button" data-dialog-close>Fermer</button>
</dialog>
<dialog id="speaker-notes" aria-labelledby="notes-title">
  <h2 id="notes-title">Notes formateur</h2>
  <p>{slide.speaker.notes}</p>
  <p><strong>Transition :</strong> {slide.speaker.transition}</p>
  <button type="button" data-dialog-close>Fermer</button>
</dialog>
<p class="visually-hidden" aria-live="polite" data-presenter-announcer></p>
```

Disabled endpoints must render `<span aria-disabled="true">` instead of an
anchor without an `href`.

- [ ] **Step 7: Implémenter le contrôleur**

`presentation-controller.ts` must:

```ts
const interactiveSelector =
  'a, button, input, textarea, select, [contenteditable="true"], dialog';

document.addEventListener('keydown', (event) => {
  const target = event.target as Element | null;
  if (target?.closest(interactiveSelector)) return;
  const previous = document.querySelector<HTMLAnchorElement>('[data-previous]');
  const next = document.querySelector<HTMLAnchorElement>('[data-next]');
  if (event.key === 'ArrowLeft' && previous) location.assign(previous.href);
  if ((event.key === 'ArrowRight' || event.key === ' ') && next) {
    event.preventDefault();
    location.assign(next.href);
  }
});

document.querySelectorAll<HTMLElement>('[data-dialog-target]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const dialog = document.querySelector<HTMLDialogElement>(trigger.dataset.dialogTarget!);
    dialog?.showModal();
  });
});

document.querySelector<HTMLElement>('[data-presenter-fullscreen]')?.addEventListener('click', async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
});
```

Add close buttons using `dialog.close()` and return focus to the trigger after
the `close` event.

- [ ] **Step 8: Exécuter les tests et le build**

Run: `npm test && npm run build`

Expected: all tests PASS and Astro generates one nested `index.html` under
`dist/presenter/<brick>/<slide>/` for each of the 76 slides.

- [ ] **Step 9: Commit**

```bash
git add src/layouts/PresentationLayout.astro src/pages/presenter src/components/presentation/PresenterShell.astro src/scripts/presentation-controller.ts src/styles/presentation.css tests/presentation-routing.test.ts
git commit -m "feat: ajouter le shell de présentation accessible"
```

---

### Task 5: Verrouiller le champ lumineux et les scènes communes

**Files:**
- Modify: `src/styles/presentation.css`
- Create: `src/components/presentation/VisualRegistry.astro`
- Create: `src/components/presentation/scenes/SceneFrame.astro`
- Create: `src/components/presentation/scenes/StaticConceptScene.astro`
- Create: `src/components/presentation/scenes/MissionBoard.astro`
- Create: `src/components/presentation/scenes/CheckpointScene.astro`
- Create: `src/components/presentation/scenes/ResourceRail.astro`
- Create: `tests/presentation-visuals.test.ts`

**Interfaces:**
- Consumes: `RoutedSlide`, `SlideVisualKey`.
- Produces: cadre 16:9 responsive, halos familiaux, missions et liens communs.

- [ ] **Step 1: Écrire les contraintes visuelles en échec**

Create `tests/presentation-visuals.test.ts`:

```ts
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

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
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test --test-name-pattern="champ lumineux|sans JavaScript|destination" tests/**/*.test.ts`

Expected: FAIL because the visual files do not exist.

- [ ] **Step 3: Créer le champ lumineux**

`presentation.css` must define these tokens and base rules:

```css
:root {
  --presentation-ivory: #fffaf1;
  --presentation-surface: #fffdf8;
  --presentation-ink: #16221d;
  --presentation-muted: #59645e;
  --family-accent: #ffbf3f;
}

[data-family="a"] { --family-accent: #ffbf3f; }
[data-family="b"] { --family-accent: #72c1e5; }
[data-family="c"] { --family-accent: #ed6a46; }
[data-family="d"] { --family-accent: #72af80; }
[data-family="e"] { --family-accent: #b79bca; }
[data-family="f"] { --family-accent: #ef9850; }

.presentation-stage {
  position: relative;
  isolation: isolate;
  min-block-size: 100dvh;
  overflow: clip;
  background: var(--presentation-ivory);
}

.presentation-stage::before,
.presentation-stage::after {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  content: "";
  filter: blur(4rem);
  opacity: 0.28;
  background: radial-gradient(circle, var(--family-accent), transparent 68%);
  animation: presentation-light 12s ease-in-out infinite alternate;
}

@keyframes presentation-light {
  from { transform: translate3d(-3%, -2%, 0) scale(0.96); }
  to { transform: translate3d(4%, 3%, 0) scale(1.06); }
}

@media (prefers-reduced-motion: reduce) {
  .presentation-stage::before,
  .presentation-stage::after { animation: none; }
}
```

Add fluid typography with `clamp()`, visible `:focus-visible`, 16:9 stage logic,
mobile stacking, print-safe output and optional View Transitions guarded by
`@media (prefers-reduced-motion: no-preference)`.

- [ ] **Step 4: Créer les scènes communes**

- `SceneFrame` renders `<figure>` with an accessible heading or `<figcaption>`.
- `StaticConceptScene` renders the claim support and accessible description for
  every specialized key until its family task replaces that mapping; it is a
  complete static rendering.
- `MissionBoard` renders an ordered list, duration, deliverable and success
  criterion visible before hydration.
- `CheckpointScene` renders a native checklist with text markers in addition to color.
- `ResourceRail` renders each link with its kind, visible destination wording,
  `target="_blank"` and `rel="noreferrer"`.

- [ ] **Step 5: Créer le registre sans chargement dynamique client**

`VisualRegistry.astro` imports every available scene statically and selects by
`slide.visual.key`. At this stage, specialized keys resolve to
`StaticConceptScene`; Tasks 6–8 replace each mapping with its interactive scene.
Unknown keys throw during the build; no blank fallback is allowed. Modify
`PresenterShell.astro` to replace the inline `<figure>` and links with
`VisualRegistry` and `ResourceRail`.

- [ ] **Step 6: Exécuter les tests et le build**

Run: `npm test && npm run build`

Expected: all tests PASS; all presentation pages render with the ivory field.

- [ ] **Step 7: Commit**

```bash
git add src/styles/presentation.css src/components/presentation tests/presentation-visuals.test.ts
git commit -m "feat: définir le système visuel des présentations"
```

---

### Task 6: Construire les visuels interactifs du bloc A

**Files:**
- Create: `src/components/presentation/visuals/a/TokenPredictor.astro`
- Create: `src/components/presentation/visuals/a/ContextComparison.astro`
- Create: `src/components/presentation/visuals/a/ResponseWorkflowAgent.astro`
- Create: `src/components/presentation/visuals/a/InterfaceContinuum.astro`
- Create: `src/components/presentation/visuals/a/ContextBudget.astro`
- Create: `src/components/presentation/visuals/a/VerificationAudit.astro`
- Modify: `src/components/presentation/VisualRegistry.astro`
- Modify: `tests/presentation-visuals.test.ts`

**Interfaces:**
- Consumes: `slide.visual.data` from `a.ts`.
- Produces: six scenes, each with native controls and an accessible final state.

- [ ] **Step 1: Ajouter un test de couverture en échec**

Append:

```ts
test('enregistre tous les visuels du bloc A', async () => {
  const registry = await read('src/components/presentation/VisualRegistry.astro');
  for (const name of [
    'TokenPredictor', 'ContextComparison', 'ResponseWorkflowAgent',
    'InterfaceContinuum', 'ContextBudget', 'VerificationAudit',
  ]) assert.match(registry, new RegExp(name));
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test --test-name-pattern="visuels du bloc A" tests/**/*.test.ts`

Expected: FAIL with the first missing visual import.

- [ ] **Step 3: Invoquer `$slide-visual-director` et implémenter les six scènes**

Exact behavior:

- `TokenPredictor`: a sentence assembles token by token; a real button advances;
  the full sentence is present in a visually hidden description.
- `ContextComparison`: two context buttons update the same prediction lane; the
  active state uses `aria-pressed` and shape plus color.
- `ResponseWorkflowAgent`: three selectable lanes show text-only response,
  fixed steps and observation/action loop; arrows are SVG paths with markers.
- `InterfaceContinuum`: a keyboard-operable range-like set of four radio buttons
  moves from Chat to Claude Code and updates context/action/control labels.
- `ContextBudget`: context items can be included/excluded with checkboxes; the
  visual meter changes but the utility statement stays textually available.
- `VerificationAudit`: four-step audit with a risk slider implemented as native
  radio choices; each decision reveals the proportionate verification.

Do not use hover as the only interaction. Do not animate more than one central
relationship at a time.

- [ ] **Step 4: Run the focused tests and build**

Run: `npx tsx --test --test-name-pattern="bloc A|présentation" tests/**/*.test.ts && npm run build`

Expected: PASS and generated A routes contain no build errors.

- [ ] **Step 5: Browser review of A1, A2 and A5**

Run: `npm run dev -- --host 127.0.0.1 --port 4321`

Using the browser skill, inspect at 1280×720 and 390×844:

- `/presenter/a1/a1-token-loop/`
- `/presenter/a2/a2-agent-loop/`
- `/presenter/a5/a5-method/`

Expected: the claim is understood without notes, all controls work by keyboard,
and reduced motion leaves the final state visible.

- [ ] **Step 6: Commit**

```bash
git add src/components/presentation/visuals/a src/components/presentation/VisualRegistry.astro tests/presentation-visuals.test.ts
git commit -m "feat: illustrer le bloc A en interactions"
```

---

### Task 7: Construire les visuels interactifs du bloc B

**Files:**
- Create: `src/components/presentation/visuals/b/SetupDiagnostic.astro`
- Create: `src/components/presentation/visuals/b/PromptBuilder.astro`
- Create: `src/components/presentation/visuals/b/ArtifactTestLoop.astro`
- Create: `src/components/presentation/visuals/b/PacteWorkspace.astro`
- Create: `src/components/presentation/visuals/b/IpmtrLoop.astro`
- Create: `src/components/presentation/visuals/b/WorkspaceTriptych.astro`
- Modify: `src/components/presentation/VisualRegistry.astro`
- Modify: `tests/presentation-visuals.test.ts`

**Interfaces:**
- Consumes: `slide.visual.data` from `b.ts`.
- Produces: six scenes couvrant setup, prompt, prototype, fichiers et code.

- [ ] **Step 1: Ajouter le test de couverture en échec**

```ts
test('enregistre tous les visuels du bloc B', async () => {
  const registry = await read('src/components/presentation/VisualRegistry.astro');
  for (const name of [
    'SetupDiagnostic', 'PromptBuilder', 'ArtifactTestLoop',
    'PacteWorkspace', 'IpmtrLoop', 'WorkspaceTriptych',
  ]) assert.match(registry, new RegExp(name));
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test --test-name-pattern="visuels du bloc B" tests/**/*.test.ts`

Expected: FAIL with the first missing visual import.

- [ ] **Step 3: Invoquer `$slide-visual-director` et implémenter les scènes**

Exact behavior:

- `SetupDiagnostic`: platform tabs use native radio buttons; the diagnostic
  graph always exposes account, surface, features, test and fallback.
- `PromptBuilder`: four draggable-looking blocks are implemented as buttons,
  not drag-only UI; clicking assembles the brief and updates the result.
- `ArtifactTestLoop`: object, three tests and correction form a circular SVG
  path; buttons focus each stage and the final state shows all stages.
- `PacteWorkspace`: source, plan, permissions, output and originals form a file
  map; toggling permission scope visibly changes the risk boundary.
- `IpmtrLoop`: the five stages run along one continuous SVG loop; permission,
  test and diff gates stop progression until explicitly activated.
- `WorkspaceTriptych`: Explorer, editor and terminal share one highlighted path;
  Mac/Windows buttons update commands without changing the concept.

- [ ] **Step 4: Run tests and build**

Run: `npx tsx --test --test-name-pattern="bloc B|présentation" tests/**/*.test.ts && npm run build`

Expected: PASS.

- [ ] **Step 5: Browser review of B0, B2, B3, B4 and B4-bis**

Inspect at 1280×720 and mobile:

- `/presenter/b0/b0-diagnostic/`
- `/presenter/b2/b2-tests/`
- `/presenter/b3/b3-permissions/`
- `/presenter/b4/b4-ipmtr/`
- `/presenter/b4-bis/b4bis-triptych/`

Expected: interactions are understandable without spoken instructions and do
not rely on precise pointer movement.

- [ ] **Step 6: Commit**

```bash
git add src/components/presentation/visuals/b src/components/presentation/VisualRegistry.astro tests/presentation-visuals.test.ts
git commit -m "feat: illustrer le bloc B en interactions"
```

---

### Task 8: Construire les visuels interactifs du bloc C

**Files:**
- Create: `src/components/presentation/visuals/c/SkillAnatomy.astro`
- Create: `src/components/presentation/visuals/c/McpConnectionMap.astro`
- Create: `src/components/presentation/visuals/c/TriggerTimeline.astro`
- Modify: `src/components/presentation/VisualRegistry.astro`
- Modify: `tests/presentation-visuals.test.ts`

**Interfaces:**
- Consumes: `slide.visual.data` from `c.ts`.
- Produces: trois scènes couvrant méthode, connexion et automatisation.

- [ ] **Step 1: Ajouter le test de couverture en échec**

```ts
test('enregistre tous les visuels du bloc C', async () => {
  const registry = await read('src/components/presentation/VisualRegistry.astro');
  for (const name of ['SkillAnatomy', 'McpConnectionMap', 'TriggerTimeline']) {
    assert.match(registry, new RegExp(name));
  }
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test --test-name-pattern="visuels du bloc C" tests/**/*.test.ts`

Expected: FAIL with the first missing visual import.

- [ ] **Step 3: Invoquer `$slide-visual-director` et implémenter les scènes**

Exact behavior:

- `SkillAnatomy`: a `SKILL.md` cutaway connects description, procedure and
  output; positive and negative test buttons show correct and incorrect trigger.
- `McpConnectionMap`: one continuous request/response path connects user,
  Claude client, MCP server and API/resource; permission toggles affect the
  boundary and the revoke action visibly closes it.
- `TriggerTimeline`: event and calendar lanes stay vertically aligned; hook,
  manual task, recurring task, log, pause and deletion are all reachable by
  keyboard and shown in the final state.

- [ ] **Step 4: Run tests and build**

Run: `npx tsx --test --test-name-pattern="bloc C|présentation" tests/**/*.test.ts && npm run build`

Expected: PASS.

- [ ] **Step 5: Browser review of C1, C2 and C3**

Inspect:

- `/presenter/c1/c1-anatomy/`
- `/presenter/c2/c2-chain/`
- `/presenter/c3/c3-trigger/`

Expected: every connector attaches to its intended object, the direction is
unambiguous, and revoke/pause states remain visible without color alone.

- [ ] **Step 6: Commit**

```bash
git add src/components/presentation/visuals/c src/components/presentation/VisualRegistry.astro tests/presentation-visuals.test.ts
git commit -m "feat: illustrer le bloc C en interactions"
```

---

### Task 9: Intégrer les liens, le contrôle de build et l'entrée publique

**Files:**
- Create: `scripts/check-presentation.ts`
- Modify: `package.json`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `tests/site-theme.test.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: `PRESENTATION_DECKS`, `validatePresentation`.
- Produces: `npm run presentation:check`, navigation publique et documentation de contribution D à F.

- [ ] **Step 1: Écrire les assertions en échec**

Append to `tests/site-theme.test.ts`:

```ts
test('expose le mode présentation dans la navigation', async () => {
  const [layout, packageJson, readme] = await Promise.all([
    read('src/layouts/BaseLayout.astro'),
    read('package.json'),
    read('README.md'),
  ]);
  assert.match(layout, /href="\/presenter\//);
  assert.match(packageJson, /presentation:check/);
  assert.match(readme, /slide-visual-director/);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test --test-name-pattern="mode présentation" tests/**/*.test.ts`

Expected: FAIL.

- [ ] **Step 3: Ajouter le contrôle de présentation**

Create `scripts/check-presentation.ts`:

```ts
import { fileURLToPath } from 'node:url';

import { loadBrickDocuments } from '../src/content/brick-files';
import { PRESENTATION_DECKS } from '../src/presentation/manifests';
import { validatePresentation } from '../src/presentation/presentation-validation';

const issues = validatePresentation(PRESENTATION_DECKS);
const contentDirectory = fileURLToPath(new URL('../src/content/briques', import.meta.url));
const documents = await loadBrickDocuments(contentDirectory);
const anchorsByBrick = new Map(
  documents.map((document) => [
    String(document.data.id),
    new Set(
      Array.from(document.body.matchAll(/^#{2,3}\s+(.+?)\s*$/gm), ([, heading]) =>
        heading
          .trim()
          .toLocaleLowerCase('fr')
          .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
          .replace(/\s+/g, '-'),
      ),
    ),
  ]),
);

for (const deck of PRESENTATION_DECKS) {
  for (const slide of deck.slides) {
    for (const link of slide.links.filter((candidate) => candidate.kind === 'wiki')) {
      const url = new URL(link.href);
      const brickId = url.pathname.split('/').filter(Boolean).at(-1);
      const anchor = decodeURIComponent(url.hash.slice(1));
      if (!brickId || !anchorsByBrick.get(brickId)?.has(anchor)) {
        issues.push(`Ancre wiki inconnue : ${slide.id} → ${url.pathname}${url.hash}`);
      }
    }
  }
}

if (issues.length > 0) {
  for (const issue of issues) console.error(issue);
  process.exitCode = 1;
} else {
  const count = PRESENTATION_DECKS.reduce((sum, deck) => sum + deck.slides.length, 0);
  console.log(`Présentation valide : ${count} slides contrôlées.`);
}
```

Update `package.json`:

```json
{
  "scripts": {
    "build": "npm run content:check && npm run presentation:check && astro build",
    "presentation:check": "tsx scripts/check-presentation.ts"
  }
}
```

Preserve every existing script while inserting these values.

- [ ] **Step 4: Ajouter l'entrée publique**

Add `Présentation` to `BaseLayout.astro`, set `isPresentation`, and use
`aria-current="page"` only under `/presenter`.

- [ ] **Step 5: Documenter le workflow de Mathieu**

Add to `README.md`:

1. invoke `$slide-visual-director`;
2. add or edit the family manifest;
3. reuse or create the visual component selected by the skill;
4. add only meaningful states and interactions;
5. run `npm test`, `npm run presentation:check` and `npm run build`;
6. inspect the slide in presenter mode with keyboard and reduced motion.

- [ ] **Step 6: Run the full checks**

Run: `npm test && npm run presentation:check && npm run build`

Expected:

```text
Présentation valide : 76 slides contrôlées.
```

and a successful Astro build.

- [ ] **Step 7: Commit**

```bash
git add scripts/check-presentation.ts package.json src/layouts/BaseLayout.astro tests/site-theme.test.ts README.md
git commit -m "feat: intégrer le mode présentation au site"
```

---

### Task 10: Vérification complète et corrections visuelles

**Files:**
- Modify on a failing check only: `src/presentation/manifests/a.ts`
- Modify on a failing check only: `src/presentation/manifests/b.ts`
- Modify on a failing check only: `src/presentation/manifests/c.ts`
- Modify on a failing check only: `src/components/presentation/scenes/*.astro`
- Modify on a failing check only: `src/components/presentation/visuals/{a,b,c}/*.astro`
- Modify on a failing check only: `src/styles/presentation.css`

**Interfaces:**
- Consumes: the complete presentation build.
- Produces: a verified A1–C3 delivery and a reusable D–F authoring path.

- [ ] **Step 1: Run all mechanical checks from a clean process**

Run:

```bash
npm test
npm run content:check
npm run presentation:check
npm run build
```

Expected: all commands exit 0; the presentation checker reports 76 slides.

- [ ] **Step 2: Confirm every generated route exists**

Run:

```bash
find dist/presenter -name index.html | wc -l
```

Expected: `77` — one presenter index plus 76 slide routes.

- [ ] **Step 3: Start the production preview**

Run: `npm run preview -- --host 127.0.0.1 --port 4321`

Expected: server responds at `http://127.0.0.1:4321/presenter/`.

- [ ] **Step 4: Perform a full route sweep**

Open every route from `PRESENTATION_SLIDES` and verify HTTP 200, one `<h1>`, a
visual figure, speaker notes, previous/next state and no console error. Fix every
failure before continuing.

- [ ] **Step 5: Perform the silent contact-sheet review**

Capture every slide at 1280×720 and inspect all thumbnails grouped A, B and C.
For each slide, record pass/fail for:

- one obvious claim;
- one dominant proof object;
- no repeated generic card grid;
- no clipped labels or ambiguous connectors;
- family color and luminous field coherence;
- no slide whose meaning depends on the formateur's notes.

Fix failed slides by reinvoking `$slide-visual-director`; do not fix them by
adding paragraphs.

- [ ] **Step 6: Perform keyboard and accessibility review**

Using only Tab, Shift+Tab, arrows, Enter, Space and Escape:

- navigate slides;
- open and close the sommaire and notes dialogs;
- enter and exit fullscreen;
- operate every custom visual family;
- confirm focus is never trapped or lost;
- confirm the navigation handler does not fire inside controls.

Repeat representative slides with reduced motion and at 200% zoom.

- [ ] **Step 7: Verify links before publication**

Check every unique HTTPS link once. Internal wiki anchors must resolve on the
canonical domain. Download links must resolve only to `claude.com` or
`code.visualstudio.com`. Fix redirects to obsolete support domains in the
manifest and, when the MDX source is obsolete too, update both together.

- [ ] **Step 8: Forward-test the visual skill with a D slide**

Give a fresh agent only the local skill and the D1 MDX, with this request:

```text
Use $slide-visual-director to propose one interactive slide explaining the
difference between a file, a folder and a repository for adult beginners.
Do not modify the presentation engine.
```

Expected: the output states the thesis, selects a meaningful grammar, provides
an accessible fallback and uses the existing visual contract without inventing
a new design system. Do not merge the D1 prototype; use its findings only to
tighten the skill if required.

- [ ] **Step 9: Re-run checks after all corrections**

Run: `npm test && npm run presentation:check && npm run build`

Expected: all commands exit 0.

- [ ] **Step 10: Commit final QA fixes**

```bash
git add src/presentation/manifests/a.ts src/presentation/manifests/b.ts src/presentation/manifests/c.ts src/components/presentation/scenes src/components/presentation/visuals src/styles/presentation.css .agents/skills/slide-visual-director
git commit -m "fix: finaliser la présentation A1 à C3"
```

Do not create an empty commit when no QA fix was necessary.
