# Surface `/demarrer` : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer une quatrième surface du site, `/demarrer`, qui montre en images les gestes concrets que les participants non techniques n'ont pas réussi à enchaîner : créer un projet et le mettre sur GitHub, mettre le site en ligne, donner une clé API.

**Architecture:** Trois guides déclarés dans des manifestes TypeScript typés (`src/parcours/manifests/`), sur le modèle de `src/presentation/manifests/`. Un validateur pur (`parcours-validation.ts`) testé unitairement, appelé par un script `check-parcours.ts` branché dans `build`. Le rendu Astro consomme les manifestes ; les composants sortent en `data-enhanced="false"` et le JavaScript bascule à `true`, donc tout reste lisible sans JS.

**Tech Stack:** Astro 7, TypeScript, MDX (non utilisé ici), `node:test` via `tsx`, Playwright pour la QA.

## Global Constraints

Ces contraintes s'appliquent à **toutes** les tâches.

- Node `>=22.12.0`. Tests : `npx tsx --test tests/<fichier>.test.ts`.
- **Jamais le caractère tiret cadratin `—` (U+2014)** dans le code, les manifestes ou le contenu. Deux-points, virgules ou parenthèses.
- **Vocabulaire interdit dans tout texte lu par le participant** : `terminal`, `ligne de commande`, `shell`, `CLI`, `git status`, `git log`, `npm run`. Le public est non technique.
- Le contenu vouvoie le lecteur. Aucun méta-commentaire, aucune supposition d'âge ou de profil.
- Aucun vocabulaire des briques sur cette surface : pas de `Cap`, `Concept durable`, `Mission commune`, `Livrable`, `Défis avancés`, pas de durée annoncée, pas d'objectif pédagogique.
- Le type `Lieu` n'a **que** trois valeurs : `machine`, `vscode`, `navigateur`. Aucune étape n'envoie le lecteur dans un terminal.
- Aucune commande n'est proposée à la saisie. Tout bloc technique est un `aClaude` à copier-coller dans la conversation Claude.
- Longueurs maximales : `pourquoi` 160 caractères, `Outil.role` 100 caractères.
- Une clé API ne figure jamais dans un `aClaude`.
- Commits en français, format `feat:`, `test:`, `content:`, `refactor:`, `docs:` comme dans l'historique du dépôt.
- Ne jamais pousser. Les commits restent locaux jusqu'à demande explicite.

**Référence :** `docs/superpowers/specs/2026-07-26-demarrer-parcours-guides-design.md`

## Structure des fichiers

| Fichier | Responsabilité |
|---|---|
| `src/parcours/parcours-model.ts` | Types et constantes. Aucune logique. |
| `src/parcours/parcours-validation.ts` | Validateur pur. Reçoit les guides, retourne des messages. |
| `src/parcours/outils.ts` | La carte des outils (données). |
| `src/parcours/manifests/naissance-projet.ts` | Guide 1. |
| `src/parcours/manifests/mise-en-ligne.ts` | Guide 2. |
| `src/parcours/manifests/cle-api.ts` | Guide 3. |
| `src/parcours/manifests/index.ts` | Registre `GUIDES` et accesseurs. |
| `src/features/demarrer/cas.ts` | Dérive la grille « Ça coince ? ». |
| `src/components/demarrer/GuideShell.astro` | Coquille d'un guide : bandeau, liste des étapes. |
| `src/components/demarrer/Etape.astro` | Une étape : gestes, `aClaude`, fichiers, preuve, visuel, pannes. |
| `src/components/demarrer/Panne.astro` | Un `<details>` avec ancre stable. |
| `src/components/demarrer/CarteOutils.astro` | La rangée de vignettes. |
| `src/components/demarrer/visuels/Visuel.astro` | Aiguillage vers le bon composant selon `key`. |
| `src/components/demarrer/visuels/VisuelCapture.astro` | Capture réelle annotée. |
| `src/components/demarrer/visuels/VisuelClaude.astro` | La conversation Claude. |
| `src/components/demarrer/visuels/VisuelArborescence.astro` | Dossier avant / après. |
| `src/components/demarrer/visuels/VisuelTroisLieux.astro` | Dossier, GitHub, site en ligne. |
| `src/pages/demarrer/index.astro` | Carte des outils, cartes de guides, grille « Ça coince ? ». |
| `src/pages/demarrer/[guide].astro` | Un guide complet. |
| `scripts/check-parcours.ts` | Lance le validateur, plus les contrôles disque (captures, logos). |
| `scripts/qa-demarrer.mjs` | Playwright : lisibilité sans JavaScript. |

---

### Task 1: Types et constantes du modèle

**Files:**
- Create: `src/parcours/parcours-model.ts`
- Test: `tests/parcours-model.test.ts`

**Interfaces:**
- Consumes: rien.
- Produces: `LIEUX`, `Lieu`, `VISUEL_KEYS`, `VisuelKey`, `Geste`, `Panne`, `Fichier`, `Repere`, `Visuel`, `Etape`, `Guide`, `Outil`, `POURQUOI_MAX`, `ROLE_MAX`, `CAPTURE_PEREMPTION_JOURS`, `VOCABULAIRE_INTERDIT`, `KEBAB_PATTERN`.

- [ ] **Step 1: Write the failing test**

`tests/parcours-model.test.ts` :

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CAPTURE_PEREMPTION_JOURS,
  KEBAB_PATTERN,
  LIEUX,
  POURQUOI_MAX,
  ROLE_MAX,
  VISUEL_KEYS,
  VOCABULAIRE_INTERDIT,
} from '../src/parcours/parcours-model';

test('le lieu terminal n’existe pas dans le modèle', () => {
  assert.deepEqual([...LIEUX], ['machine', 'vscode', 'navigateur']);
  assert.equal(LIEUX.includes('terminal' as never), false);
});

test('les quatre visuels sont déclarés', () => {
  assert.deepEqual([...VISUEL_KEYS], ['capture', 'claude', 'arborescence', 'trois-lieux']);
});

test('les garde-fous éditoriaux portent les valeurs du spec', () => {
  assert.equal(POURQUOI_MAX, 160);
  assert.equal(ROLE_MAX, 100);
  assert.equal(CAPTURE_PEREMPTION_JOURS, 183);
});

test('le vocabulaire interdit couvre le registre technique', () => {
  for (const mot of ['terminal', 'ligne de commande', 'shell', 'cli', 'git status', 'git log', 'npm run']) {
    assert.ok(VOCABULAIRE_INTERDIT.includes(mot), `${mot} doit être interdit`);
  }
});

test('le motif kebab accepte les identifiants d’ancre et rejette le reste', () => {
  assert.ok(KEBAB_PATTERN.test('creer-le-dossier'));
  assert.ok(KEBAB_PATTERN.test('etape1'));
  assert.equal(KEBAB_PATTERN.test('Creer-Le-Dossier'), false);
  assert.equal(KEBAB_PATTERN.test('creer_le_dossier'), false);
  assert.equal(KEBAB_PATTERN.test('creer--le-dossier'), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/parcours-model.test.ts`
Expected: FAIL, `Cannot find module '../src/parcours/parcours-model'`

- [ ] **Step 3: Write minimal implementation**

`src/parcours/parcours-model.ts` :

```ts
export const LIEUX = ['machine', 'vscode', 'navigateur'] as const;
export type Lieu = (typeof LIEUX)[number];

export const VISUEL_KEYS = ['capture', 'claude', 'arborescence', 'trois-lieux'] as const;
export type VisuelKey = (typeof VISUEL_KEYS)[number];

/** Longueur maximale d'un `pourquoi` : garde-fou contre le retour du registre scolaire. */
export const POURQUOI_MAX = 160;
/** Longueur maximale de la ligne d'un outil sur la carte d'accueil. */
export const ROLE_MAX = 100;
/** Six mois : au-delà, une capture d'écran est réputée suspecte. */
export const CAPTURE_PEREMPTION_JOURS = 183;

/**
 * Mots que le participant ne doit jamais lire : il n'est pas développeur.
 * Comparés avec des frontières de mot, donc « clic » ne déclenche pas « cli ».
 */
export const VOCABULAIRE_INTERDIT = [
  'terminal',
  'ligne de commande',
  'shell',
  'cli',
  'git status',
  'git log',
  'npm run',
] as const;

export const KEBAB_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type Geste = {
  /** Un impératif, une seule action. */
  action: string;
  /** Le repère stable dans l'interface, jamais la position du bouton. */
  ancre?: string;
};

export type Panne = {
  id: string;
  /** Si vrai, la panne remonte dans la grille « Ça coince ? » de l'accueil. */
  frequente: boolean;
  /** Ce que le lecteur voit, au mot près si c'est un message affiché. */
  symptome: string;
  cause: string;
  reparation: Geste[];
  preuve: string;
};

export type Fichier = {
  chemin: string;
  /** Du contenu réel, copiable. Jamais une description de contenu. */
  contenu: string;
  commentaire?: string;
};

export type Repere = {
  label: string;
  position: 'haut' | 'bas' | 'gauche' | 'droite' | 'centre';
};

export type Visuel =
  | { key: 'claude'; colle: string; reponse: string[] }
  | { key: 'arborescence'; avant: string[]; apres: string[]; ignores?: string[] }
  | { key: 'trois-lieux'; accent: 'projet' | 'ligne' | 'cle' }
  | {
      key: 'capture';
      /** Chemin sous `public/`, sans barre oblique initiale. */
      fichier: string;
      alt: string;
      service: string;
      /** Date de dernière vérification humaine, au format AAAA-MM-JJ. */
      verifieLe: string;
      reperes: Repere[];
    };

export type Etape = {
  id: string;
  titre: string;
  lieu: Lieu;
  /** Obligatoire quand `lieu` vaut `navigateur` : alimente le bandeau. */
  service?: string;
  /** Une ligne, repliée par défaut. Jamais un paragraphe. */
  pourquoi?: string;
  gestes: Geste[];
  /** Le bloc à copier et coller dans la conversation Claude. */
  aClaude?: string;
  fichiers?: Fichier[];
  /** Signalé avant le geste, pour ce qui est irréversible. */
  danger?: string;
  preuve: { visible: string; sinon: string };
  visuel: Visuel;
  pannes: Panne[];
};

export type Guide = {
  id: string;
  titre: string;
  /** Une phrase, affichée sur la carte de l'accueil. */
  promesse: string;
  /** Filtre d'entrée : dit tout de suite à qui le guide ne s'adresse pas. */
  pourQui?: string;
  prerequis: string[];
  etapes: Etape[];
};

export type Outil = {
  nom: string;
  /** Chemin sous `public/`, sans barre oblique initiale. */
  logo: string;
  role: string;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test tests/parcours-model.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 5: Commit**

```bash
git add src/parcours/parcours-model.ts tests/parcours-model.test.ts
git commit -m "feat: modele de la surface demarrer"
```

---

### Task 2: Validateur, règles de structure

**Files:**
- Create: `src/parcours/parcours-validation.ts`
- Create: `tests/parcours-validation-structure.test.ts`

**Interfaces:**
- Consumes: tous les types de `parcours-model.ts`.
- Produces: `validateGuides(guides: Guide[]): string[]` (retourne un tableau de messages, vide si tout va bien).

Règles couvertes ici : identifiants kebab et uniques **dans un guide**, `preuve.visible` et `preuve.sinon` non vides, pannes complètes, `service` obligatoire si `lieu === 'navigateur'`, clé de visuel connue.

- [ ] **Step 1: Write the failing test**

`tests/parcours-validation-structure.test.ts` :

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import type { Etape, Guide } from '../src/parcours/parcours-model';
import { validateGuides } from '../src/parcours/parcours-validation';

const etape = (patch: Partial<Etape> = {}): Etape => ({
  id: 'creer-le-dossier',
  titre: 'Créer un dossier pour votre projet',
  lieu: 'machine',
  gestes: [{ action: 'Créez un dossier nommé mon-projet.' }],
  preuve: { visible: 'Le dossier existe.', sinon: 'Recommencez dans votre dossier personnel.' },
  visuel: { key: 'arborescence', avant: [], apres: ['mon-projet/'] },
  pannes: [],
  ...patch,
});

const guide = (patch: Partial<Guide> = {}): Guide => ({
  id: 'naissance-projet',
  titre: 'Créer un projet et le mettre sur GitHub',
  promesse: 'De rien du tout à un projet sauvegardé en ligne.',
  prerequis: [],
  etapes: [etape()],
  ...patch,
});

test('un guide correct ne remonte aucun problème', () => {
  assert.deepEqual(validateGuides([guide()]), []);
});

test('une preuve vide est refusée', () => {
  const issues = validateGuides([
    guide({ etapes: [etape({ preuve: { visible: '', sinon: 'Reprenez.' } })] }),
  ]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /preuve\.visible/);
});

test('une issue de secours vide est refusée', () => {
  const issues = validateGuides([
    guide({ etapes: [etape({ preuve: { visible: 'Le dossier existe.', sinon: '  ' } })] }),
  ]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /preuve\.sinon/);
});

test('un identifiant d’étape hors kebab est refusé', () => {
  const issues = validateGuides([guide({ etapes: [etape({ id: 'Creer_Le_Dossier' })] })]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /kebab/);
});

test('deux étapes du même guide ne peuvent pas partager un identifiant', () => {
  const issues = validateGuides([guide({ etapes: [etape(), etape()] })]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /identifiant d’étape en double/);
});

test('deux guides différents peuvent réutiliser le même identifiant d’étape', () => {
  const autre = guide({ id: 'cle-api', titre: 'Donner une clé API', promesse: 'Une clé rangée.' });
  assert.deepEqual(validateGuides([guide(), autre]), []);
});

test('une étape dans le navigateur doit nommer son service', () => {
  const issues = validateGuides([guide({ etapes: [etape({ lieu: 'navigateur' })] })]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /service/);
});

test('une panne incomplète est refusée', () => {
  const issues = validateGuides([
    guide({
      etapes: [
        etape({
          pannes: [
            { id: 'panne-vide', frequente: true, symptome: '', cause: 'Rien', reparation: [], preuve: 'OK' },
          ],
        }),
      ],
    }),
  ]);
  assert.equal(issues.length, 2);
  assert.ok(issues.some((issue) => /symptome/.test(issue)));
  assert.ok(issues.some((issue) => /reparation/.test(issue)));
});

test('une clé de visuel inconnue est refusée', () => {
  const issues = validateGuides([
    guide({ etapes: [etape({ visuel: { key: 'video' } as never })] }),
  ]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /visuel inconnu/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/parcours-validation-structure.test.ts`
Expected: FAIL, `Cannot find module '../src/parcours/parcours-validation'`

- [ ] **Step 3: Write minimal implementation**

`src/parcours/parcours-validation.ts` :

```ts
import {
  KEBAB_PATTERN,
  VISUEL_KEYS,
  type Guide,
  type Panne,
} from './parcours-model';

const visuelKeys = new Set<string>(VISUEL_KEYS);

const vide = (value: unknown): boolean =>
  typeof value !== 'string' || value.trim().length === 0;

function validatePanne(panne: Panne, prefixe: string, issues: string[]): void {
  if (!KEBAB_PATTERN.test(panne.id)) {
    issues.push(`${prefixe} : identifiant de panne « ${panne.id} » hors kebab-case.`);
  }
  if (vide(panne.symptome)) issues.push(`${prefixe} : symptome vide.`);
  if (vide(panne.cause)) issues.push(`${prefixe} : cause vide.`);
  if (vide(panne.preuve)) issues.push(`${prefixe} : preuve de sortie vide.`);
  if (panne.reparation.length === 0) issues.push(`${prefixe} : reparation vide.`);
}

export function validateGuides(guides: Guide[]): string[] {
  const issues: string[] = [];

  for (const guide of guides) {
    if (!KEBAB_PATTERN.test(guide.id)) {
      issues.push(`Guide « ${guide.id} » : identifiant hors kebab-case.`);
    }

    // Les ancres vivent dans l'URL d'un guide : l'unicité se joue par guide,
    // pas globalement. Deux guides peuvent donc avoir une étape homonyme.
    const etapeIds = new Set<string>();
    const panneIds = new Set<string>();

    for (const etape of guide.etapes) {
      const prefixe = `${guide.id}/${etape.id}`;

      if (!KEBAB_PATTERN.test(etape.id)) {
        issues.push(`${prefixe} : identifiant d’étape hors kebab-case.`);
      } else if (etapeIds.has(etape.id)) {
        issues.push(`${prefixe} : identifiant d’étape en double.`);
      } else {
        etapeIds.add(etape.id);
      }

      if (vide(etape.preuve?.visible)) issues.push(`${prefixe} : preuve.visible vide.`);
      if (vide(etape.preuve?.sinon)) issues.push(`${prefixe} : preuve.sinon vide.`);

      if (etape.lieu === 'navigateur' && vide(etape.service)) {
        issues.push(`${prefixe} : lieu navigateur sans service renseigné.`);
      }

      if (!visuelKeys.has(etape.visuel?.key)) {
        issues.push(`${prefixe} : visuel inconnu « ${etape.visuel?.key} ».`);
      }

      for (const panne of etape.pannes) {
        if (panneIds.has(panne.id)) {
          issues.push(`${prefixe} : identifiant de panne « ${panne.id} » en double.`);
        } else {
          panneIds.add(panne.id);
        }
        validatePanne(panne, `${prefixe}#${panne.id}`, issues);
      }
    }
  }

  return issues;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test tests/parcours-validation-structure.test.ts`
Expected: PASS, 9 tests

- [ ] **Step 5: Commit**

```bash
git add src/parcours/parcours-validation.ts tests/parcours-validation-structure.test.ts
git commit -m "feat: validateur de structure des guides demarrer"
```

---

### Task 3: Validateur, règles éditoriales

**Files:**
- Modify: `src/parcours/parcours-validation.ts`
- Create: `tests/parcours-validation-editorial.test.ts`

**Interfaces:**
- Consumes: `validateGuides` de la Task 2.
- Produces: `validateGuides(guides: Guide[], aujourdHui?: string): string[]` (nouveau second paramètre, format `AAAA-MM-JJ`, défaut : la date du jour). Plus `validateOutils(outils: Outil[]): string[]`. Plus `collecterTextesLisibles(guide: Guide): string[]`, exportée pour test.

La date est un paramètre et non `Date.now()` : le validateur reste pur et le test des captures périmées est déterministe.

- [ ] **Step 1: Write the failing test**

`tests/parcours-validation-editorial.test.ts` :

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import type { Etape, Guide, Outil } from '../src/parcours/parcours-model';
import { validateGuides, validateOutils } from '../src/parcours/parcours-validation';

const etape = (patch: Partial<Etape> = {}): Etape => ({
  id: 'creer-le-dossier',
  titre: 'Créer un dossier pour votre projet',
  lieu: 'machine',
  gestes: [{ action: 'Créez un dossier nommé mon-projet.' }],
  preuve: { visible: 'Le dossier existe.', sinon: 'Recommencez dans votre dossier personnel.' },
  visuel: { key: 'arborescence', avant: [], apres: ['mon-projet/'] },
  pannes: [],
  ...patch,
});

const guide = (patch: Partial<Guide> = {}): Guide => ({
  id: 'naissance-projet',
  titre: 'Créer un projet et le mettre sur GitHub',
  promesse: 'De rien du tout à un projet sauvegardé en ligne.',
  prerequis: [],
  etapes: [etape()],
  ...patch,
});

test('le tiret cadratin est refusé', () => {
  const issues = validateGuides([guide({ promesse: 'De rien — à tout.' })], '2026-07-27');
  assert.equal(issues.length, 1);
  assert.match(issues[0], /tiret cadratin/);
});

test('le vocabulaire interdit est refusé dans un texte lisible', () => {
  const issues = validateGuides(
    [guide({ etapes: [etape({ gestes: [{ action: 'Ouvrez le terminal.' }] })] })],
    '2026-07-27',
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0], /terminal/);
});

test('les mots interdits sont comparés sur des frontières de mot', () => {
  const issues = validateGuides(
    [guide({ etapes: [etape({ gestes: [{ action: 'Un clic suffit, le client répond.' }] })] })],
    '2026-07-27',
  );
  assert.deepEqual(issues, []);
});

test('le contenu d’un fichier échappe au vocabulaire interdit', () => {
  const issues = validateGuides(
    [guide({ etapes: [etape({ fichiers: [{ chemin: '.gitignore', contenu: '.env\nnpm run build' }] })] })],
    '2026-07-27',
  );
  assert.deepEqual(issues, []);
});

test('un pourquoi de plus de 160 caractères est refusé', () => {
  const issues = validateGuides([guide({ etapes: [etape({ pourquoi: 'a'.repeat(161) })] })], '2026-07-27');
  assert.equal(issues.length, 1);
  assert.match(issues[0], /160/);
});

test('une capture sans alt est refusée', () => {
  const issues = validateGuides(
    [
      guide({
        etapes: [
          etape({
            lieu: 'navigateur',
            service: 'GitHub',
            visuel: {
              key: 'capture',
              fichier: 'demarrer/naissance-projet/depot-vide.png',
              alt: '',
              service: 'GitHub',
              verifieLe: '2026-07-27',
              reperes: [],
            },
          }),
        ],
      }),
    ],
    '2026-07-27',
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0], /alt/);
});

test('une capture vérifiée il y a plus de six mois est signalée', () => {
  const capture = (verifieLe: string) =>
    guide({
      etapes: [
        etape({
          lieu: 'navigateur',
          service: 'GitHub',
          visuel: {
            key: 'capture',
            fichier: 'demarrer/naissance-projet/depot-vide.png',
            alt: 'La page d’un dépôt vide sur GitHub.',
            service: 'GitHub',
            verifieLe,
            reperes: [],
          },
        }),
      ],
    });

  assert.deepEqual(validateGuides([capture('2026-03-01')], '2026-07-27'), []);
  const perimee = validateGuides([capture('2025-11-01')], '2026-07-27');
  assert.equal(perimee.length, 1);
  assert.match(perimee[0], /vérifiée le/);
});

test('une date de vérification mal formée est refusée', () => {
  const issues = validateGuides(
    [
      guide({
        etapes: [
          etape({
            lieu: 'navigateur',
            service: 'GitHub',
            visuel: {
              key: 'capture',
              fichier: 'demarrer/x.png',
              alt: 'Une capture.',
              service: 'GitHub',
              verifieLe: '27/07/2026',
              reperes: [],
            },
          }),
        ],
      }),
    ],
    '2026-07-27',
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0], /AAAA-MM-JJ/);
});

test('une clé API dans un bloc destiné à Claude est refusée', () => {
  const issues = validateGuides(
    [guide({ etapes: [etape({ aClaude: 'Crée un .env avec sk-ant-api03-abcdef' })] })],
    '2026-07-27',
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0], /clé/);
});

test('le role d’un outil est plafonné à 100 caractères', () => {
  const outils: Outil[] = [
    { nom: 'VS Code', logo: 'demarrer/outils/vscode.svg', role: 'a'.repeat(101) },
  ];
  const issues = validateOutils(outils);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /100/);
});

test('une carte d’outils correcte ne remonte rien', () => {
  const outils: Outil[] = [
    { nom: 'VS Code', logo: 'demarrer/outils/vscode.svg', role: 'L’atelier : c’est là que votre projet vit.' },
  ];
  assert.deepEqual(validateOutils(outils), []);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/parcours-validation-editorial.test.ts`
Expected: FAIL, `validateOutils is not a function` et assertions non satisfaites

- [ ] **Step 3: Write minimal implementation**

Remplacer l'en-tête d'import de `src/parcours/parcours-validation.ts` par :

```ts
import {
  CAPTURE_PEREMPTION_JOURS,
  KEBAB_PATTERN,
  POURQUOI_MAX,
  ROLE_MAX,
  VISUEL_KEYS,
  VOCABULAIRE_INTERDIT,
  type Guide,
  type Outil,
  type Panne,
} from './parcours-model';
```

Ajouter avant `validateGuides` :

```ts
// Échappé en Unicode pour que le validateur ne se signale pas lui-même
// lors d'une recherche du caractère dans le dépôt.
const TIRET_CADRATIN = '\u2014';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
/** Préfixe d'une clé Anthropic : ne doit jamais figurer dans un bloc envoyé à Claude. */
const CLE_PATTERN = /sk-[a-z]{2,}-/i;

const motifsInterdits = VOCABULAIRE_INTERDIT.map((mot) => ({
  mot,
  motif: new RegExp(`(^|[^\\p{L}\\p{N}])${mot.replace(/ /g, '\\s+')}($|[^\\p{L}\\p{N}])`, 'iu'),
}));

/**
 * Les textes que le participant lit vraiment. Volontairement hors périmètre :
 * `fichiers[].contenu` (du contenu technique authentique, qu'on montre tel
 * quel) et les chemins de fichiers.
 */
export function collecterTextesLisibles(guide: Guide): { chemin: string; texte: string }[] {
  const textes: { chemin: string; texte: string }[] = [
    { chemin: `${guide.id}.titre`, texte: guide.titre },
    { chemin: `${guide.id}.promesse`, texte: guide.promesse },
  ];
  if (guide.pourQui) textes.push({ chemin: `${guide.id}.pourQui`, texte: guide.pourQui });

  for (const etape of guide.etapes) {
    const base = `${guide.id}/${etape.id}`;
    textes.push({ chemin: `${base}.titre`, texte: etape.titre });
    if (etape.pourquoi) textes.push({ chemin: `${base}.pourquoi`, texte: etape.pourquoi });
    if (etape.danger) textes.push({ chemin: `${base}.danger`, texte: etape.danger });
    if (etape.aClaude) textes.push({ chemin: `${base}.aClaude`, texte: etape.aClaude });
    textes.push({ chemin: `${base}.preuve.visible`, texte: etape.preuve.visible });
    textes.push({ chemin: `${base}.preuve.sinon`, texte: etape.preuve.sinon });
    for (const [index, geste] of etape.gestes.entries()) {
      textes.push({ chemin: `${base}.gestes[${index}]`, texte: geste.action });
      if (geste.ancre) textes.push({ chemin: `${base}.gestes[${index}].ancre`, texte: geste.ancre });
    }
    if (etape.visuel.key === 'capture') {
      textes.push({ chemin: `${base}.visuel.alt`, texte: etape.visuel.alt });
      for (const repere of etape.visuel.reperes) {
        textes.push({ chemin: `${base}.visuel.repere`, texte: repere.label });
      }
    }
    for (const panne of etape.pannes) {
      const p = `${base}#${panne.id}`;
      textes.push({ chemin: `${p}.symptome`, texte: panne.symptome });
      textes.push({ chemin: `${p}.cause`, texte: panne.cause });
      textes.push({ chemin: `${p}.preuve`, texte: panne.preuve });
      for (const [index, geste] of panne.reparation.entries()) {
        textes.push({ chemin: `${p}.reparation[${index}]`, texte: geste.action });
      }
    }
  }

  return textes;
}

const joursEcoules = (depuis: string, jusqu: string): number =>
  Math.round((Date.parse(jusqu) - Date.parse(depuis)) / 86_400_000);

function validateEditorial(guide: Guide, aujourdHui: string, issues: string[]): void {
  for (const { chemin, texte } of collecterTextesLisibles(guide)) {
    if (texte.includes(TIRET_CADRATIN)) {
      issues.push(`${chemin} : tiret cadratin interdit.`);
    }
    for (const { mot, motif } of motifsInterdits) {
      if (motif.test(texte)) {
        issues.push(`${chemin} : vocabulaire interdit « ${mot} ».`);
      }
    }
  }

  for (const etape of guide.etapes) {
    const prefixe = `${guide.id}/${etape.id}`;

    if (etape.pourquoi && etape.pourquoi.length > POURQUOI_MAX) {
      issues.push(`${prefixe} : pourquoi de ${etape.pourquoi.length} caractères, maximum ${POURQUOI_MAX}.`);
    }

    if (etape.aClaude && CLE_PATTERN.test(etape.aClaude)) {
      issues.push(`${prefixe} : une clé ne doit jamais figurer dans un bloc envoyé à Claude.`);
    }

    if (etape.visuel.key === 'capture') {
      if (vide(etape.visuel.alt)) {
        issues.push(`${prefixe} : capture sans alt.`);
      }
      if (!DATE_PATTERN.test(etape.visuel.verifieLe)) {
        issues.push(`${prefixe} : verifieLe « ${etape.visuel.verifieLe} » doit être au format AAAA-MM-JJ.`);
      } else if (joursEcoules(etape.visuel.verifieLe, aujourdHui) > CAPTURE_PEREMPTION_JOURS) {
        issues.push(
          `${prefixe} : capture vérifiée le ${etape.visuel.verifieLe}, à recontrôler.`,
        );
      }
    }
  }
}
```

Modifier la signature et la boucle de `validateGuides` :

```ts
export function validateGuides(
  guides: Guide[],
  aujourdHui: string = new Date().toISOString().slice(0, 10),
): string[] {
  const issues: string[] = [];

  for (const guide of guides) {
    // ... corps existant de la Task 2, inchangé ...
    validateEditorial(guide, aujourdHui, issues);
  }

  return issues;
}
```

L'appel à `validateEditorial` se place **après** la boucle sur les étapes, à l'intérieur de la boucle sur les guides.

Ajouter en fin de fichier :

```ts
export function validateOutils(outils: Outil[]): string[] {
  const issues: string[] = [];
  const noms = new Set<string>();

  for (const outil of outils) {
    if (vide(outil.nom)) issues.push('Un outil de la carte n’a pas de nom.');
    if (noms.has(outil.nom)) issues.push(`Outil « ${outil.nom} » en double.`);
    noms.add(outil.nom);

    if (vide(outil.role)) issues.push(`Outil « ${outil.nom} » : role vide.`);
    if (outil.role.length > ROLE_MAX) {
      issues.push(`Outil « ${outil.nom} » : role de ${outil.role.length} caractères, maximum ${ROLE_MAX}.`);
    }
    if (outil.role.includes(TIRET_CADRATIN)) {
      issues.push(`Outil « ${outil.nom} » : tiret cadratin interdit.`);
    }
    if (!outil.logo.endsWith('.svg')) {
      issues.push(`Outil « ${outil.nom} » : le logo doit être un SVG.`);
    }
  }

  return issues;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx tsx --test tests/parcours-validation-editorial.test.ts tests/parcours-validation-structure.test.ts`
Expected: PASS, 20 tests

- [ ] **Step 5: Commit**

```bash
git add src/parcours/parcours-validation.ts tests/parcours-validation-editorial.test.ts
git commit -m "feat: regles editoriales du validateur demarrer"
```

---

### Task 4: Registre des guides, carte des outils, script de contrôle

**Files:**
- Create: `src/parcours/manifests/naissance-projet.ts` (une seule étape à ce stade)
- Create: `src/parcours/manifests/index.ts`
- Create: `src/parcours/outils.ts`
- Create: `scripts/check-parcours.ts`
- Modify: `package.json`
- Create: `tests/parcours-content.test.ts`

**Interfaces:**
- Consumes: `validateGuides`, `validateOutils`.
- Produces: `GUIDES: Guide[]`, `getGuide(id: string): Guide | undefined`, `OUTILS: Outil[]`, script `npm run parcours:check`.

Les compteurs figés de `tests/parcours-content.test.ts` valent **1 guide, 1 étape, 0 panne** à ce stade. Les tâches 12 à 14 les feront monter.

- [ ] **Step 1: Write the failing test**

`tests/parcours-content.test.ts` :

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { GUIDES, getGuide } from '../src/parcours/manifests';
import { OUTILS } from '../src/parcours/outils';
import { validateGuides, validateOutils } from '../src/parcours/parcours-validation';

test('les manifestes livrés passent le validateur', () => {
  assert.deepEqual(validateGuides(GUIDES), []);
  assert.deepEqual(validateOutils(OUTILS), []);
});

test('les compteurs figés du contenu', () => {
  assert.equal(GUIDES.length, 1);
  assert.equal(GUIDES.reduce((total, guide) => total + guide.etapes.length, 0), 1);
  assert.equal(
    GUIDES.reduce(
      (total, guide) => total + guide.etapes.reduce((sous, etape) => sous + etape.pannes.length, 0),
      0,
    ),
    0,
  );
});

test('getGuide retrouve un guide par son identifiant', () => {
  assert.equal(getGuide('naissance-projet')?.id, 'naissance-projet');
  assert.equal(getGuide('inconnu'), undefined);
});

test('la carte des outils est complète', () => {
  assert.deepEqual(
    OUTILS.map((outil) => outil.nom),
    ['Wispr Flow', 'Typeless', 'VS Code', 'Claude Code', 'GitHub', 'Vercel'],
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/parcours-content.test.ts`
Expected: FAIL, `Cannot find module '../src/parcours/manifests'`

- [ ] **Step 3: Write minimal implementation**

`src/parcours/manifests/naissance-projet.ts` :

```ts
import type { Guide } from '../parcours-model';

export const NAISSANCE_PROJET: Guide = {
  id: 'naissance-projet',
  titre: 'Créer un projet et le mettre sur GitHub',
  promesse: 'De rien du tout à un projet sauvegardé en ligne, sans rien taper.',
  prerequis: ['VS Code installé', 'Claude Code installé'],
  etapes: [
    {
      id: 'creer-le-dossier',
      titre: 'Créer un dossier pour votre projet',
      lieu: 'machine',
      pourquoi: 'Un projet vit dans un dossier. Un projet, un dossier : c’est la règle qui vous évitera des heures de confusion.',
      gestes: [
        { action: 'Créez un dossier dans votre dossier personnel, pas sur le Bureau.', ancre: 'Documents' },
        { action: 'Nommez-le avec des lettres minuscules et des tirets, sans espace ni accent.' },
      ],
      preuve: {
        visible: 'Le dossier apparaît, il est vide, et vous savez le retrouver.',
        sinon: 'Recommencez depuis votre dossier personnel : un dossier créé ailleurs se retrouve mal.',
      },
      visuel: {
        key: 'arborescence',
        avant: ['Documents/'],
        apres: ['Documents/', '  mon-projet/'],
      },
      pannes: [],
    },
  ],
};
```

`src/parcours/manifests/index.ts` :

```ts
import type { Guide } from '../parcours-model';
import { NAISSANCE_PROJET } from './naissance-projet';

export const GUIDES: Guide[] = [NAISSANCE_PROJET];

export function getGuide(id: string): Guide | undefined {
  return GUIDES.find((guide) => guide.id === id);
}
```

`src/parcours/outils.ts` :

```ts
import type { Outil } from './parcours-model';

export const OUTILS: Outil[] = [
  {
    nom: 'Wispr Flow',
    logo: 'demarrer/outils/wispr-flow.svg',
    role: 'Pour parler à votre ordinateur au lieu de taper',
  },
  {
    nom: 'Typeless',
    logo: 'demarrer/outils/typeless.svg',
    role: 'La même chose, une autre option',
  },
  {
    nom: 'VS Code',
    logo: 'demarrer/outils/vscode.svg',
    role: 'L’atelier : votre projet y vit et Claude y travaille',
  },
  {
    nom: 'Claude Code',
    logo: 'demarrer/outils/claude.svg',
    role: 'Celui qui fait le travail technique à votre place',
  },
  {
    nom: 'GitHub',
    logo: 'demarrer/outils/github.svg',
    role: 'La copie en ligne de votre projet, qui garde tout l’historique',
  },
  {
    nom: 'Vercel',
    logo: 'demarrer/outils/vercel.svg',
    role: 'Ce qui transforme votre projet en site que le monde peut ouvrir',
  },
];
```

`scripts/check-parcours.ts` :

```ts
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { GUIDES } from '../src/parcours/manifests';
import { OUTILS } from '../src/parcours/outils';
import { validateGuides, validateOutils } from '../src/parcours/parcours-validation';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));

const issues = [...validateGuides(GUIDES), ...validateOutils(OUTILS)];

// Contrôles disque : hors du validateur pur, qui doit rester testable sans
// système de fichiers.
const attendus: string[] = [
  ...OUTILS.map((outil) => outil.logo),
  ...GUIDES.flatMap((guide) =>
    guide.etapes.flatMap((etape) => (etape.visuel.key === 'capture' ? [etape.visuel.fichier] : [])),
  ),
];

for (const chemin of attendus) {
  try {
    await access(new URL(chemin, `file://${publicDir}`));
  } catch {
    issues.push(`Fichier absent de public/ : ${chemin}`);
  }
}

const etapes = GUIDES.reduce((total, guide) => total + guide.etapes.length, 0);
const pannes = GUIDES.reduce(
  (total, guide) => total + guide.etapes.reduce((sous, etape) => sous + etape.pannes.length, 0),
  0,
);

if (issues.length > 0) {
  for (const issue of issues) console.error(issue);
  process.exitCode = 1;
} else {
  console.log(
    `Guides valides : ${GUIDES.length} guides, ${etapes} étapes, ${pannes} pannes, ${OUTILS.length} outils.`,
  );
}
```

Dans `package.json`, ajouter le script et le brancher dans `build` :

```json
"build": "npm run content:check && npm run presentation:check && npm run parcours:check && npm run typecheck && astro build",
"parcours:check": "tsx scripts/check-parcours.ts",
```

- [ ] **Step 4: Créer les logos et vérifier**

Les quatre logos disponibles publiquement :

```bash
mkdir -p public/demarrer/outils
for pair in "github:github" "vercel:vercel" "vscode:visualstudiocode" "claude:claude"; do
  nom="${pair%%:*}"; source="${pair##*:}"
  curl -sS -o "public/demarrer/outils/${nom}.svg" "https://api.iconify.design/simple-icons/${source}.svg"
done
```

Wispr Flow et Typeless ne sont pas dans Simple Icons. Créer deux pastilles typographiques, `public/demarrer/outils/wispr-flow.svg` :

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true">
  <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="12" y="16" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="currentColor">W</text>
</svg>
```

`public/demarrer/outils/typeless.svg` : identique, avec `T` à la place de `W`.

Run: `npx tsx --test tests/parcours-content.test.ts && npm run parcours:check`
Expected: PASS 4 tests, puis `Guides valides : 1 guides, 1 étapes, 0 pannes, 6 outils.`

- [ ] **Step 5: Commit**

```bash
git add src/parcours/manifests src/parcours/outils.ts scripts/check-parcours.ts package.json tests/parcours-content.test.ts public/demarrer/outils
git commit -m "feat: registre des guides, carte des outils et controle parcours"
```

---

### Task 5: Tranche verticale, une étape rendue à l'écran

**Files:**
- Create: `src/components/demarrer/Etape.astro`
- Create: `src/components/demarrer/GuideShell.astro`
- Create: `src/components/demarrer/visuels/Visuel.astro`
- Create: `src/components/demarrer/visuels/VisuelArborescence.astro`
- Create: `src/pages/demarrer/[guide].astro`
- Create: `tests/parcours-routing.test.ts`

**Interfaces:**
- Consumes: `GUIDES`, `getGuide`, types du modèle.
- Produces: `cheminGuide(id: string): string` exportée depuis `src/parcours/manifests/index.ts`, la route `/demarrer/<id>/`, et les composants ci-dessus.

Cette tâche valide toute la chaîne technique avant qu'une ligne de contenu ne soit écrite.

- [ ] **Step 1: Write the failing test**

`tests/parcours-routing.test.ts` :

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { GUIDES, cheminGuide } from '../src/parcours/manifests';

test('chaque guide a une route stable', () => {
  assert.equal(cheminGuide('naissance-projet'), '/demarrer/naissance-projet/');
});

test('les identifiants de guide sont uniques', () => {
  const ids = GUIDES.map((guide) => guide.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('chaque étape a une ancre calculable et unique dans son guide', () => {
  for (const guide of GUIDES) {
    const ancres = guide.etapes.map((etape) => `etape-${etape.id}`);
    assert.equal(new Set(ancres).size, ancres.length, `ancres en double dans ${guide.id}`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/parcours-routing.test.ts`
Expected: FAIL, `cheminGuide is not a function`

- [ ] **Step 3: Write minimal implementation**

Ajouter à `src/parcours/manifests/index.ts` :

```ts
export function cheminGuide(id: string): string {
  return `/demarrer/${id}/`;
}
```

`src/components/demarrer/visuels/VisuelArborescence.astro` :

```astro
---
import type { Visuel } from '../../../parcours/parcours-model';

interface Props { visuel: Extract<Visuel, { key: 'arborescence' }>; }
const { visuel } = Astro.props;
const ignores = new Set(visuel.ignores ?? []);
---

<figure class="visuel visuel-arborescence" data-enhanced="false">
  <div class="arborescence-colonne">
    <figcaption>Avant</figcaption>
    <ul role="list">
      {visuel.avant.map((ligne) => <li>{ligne}</li>)}
    </ul>
  </div>
  <div class="arborescence-colonne">
    <figcaption>Après</figcaption>
    <ul role="list">
      {visuel.apres.map((ligne) => (
        <li class={ignores.has(ligne.trim()) ? 'est-ignore' : undefined}>
          {ligne}
          {ignores.has(ligne.trim()) && <span class="mention"> (ignoré, ne part jamais en ligne)</span>}
        </li>
      ))}
    </ul>
  </div>
</figure>
```

`src/components/demarrer/visuels/Visuel.astro` :

```astro
---
import type { Visuel } from '../../../parcours/parcours-model';
import VisuelArborescence from './VisuelArborescence.astro';

interface Props { visuel: Visuel; }
const { visuel } = Astro.props;
---

{visuel.key === 'arborescence' && <VisuelArborescence visuel={visuel} />}
```

`src/components/demarrer/Etape.astro` :

```astro
---
import type { Etape } from '../../parcours/parcours-model';
import Visuel from './visuels/Visuel.astro';

interface Props { etape: Etape; index: number; total: number; changementDeLieu: string | null; }
const { etape, index, total, changementDeLieu } = Astro.props;

const LIEU_LABEL: Record<string, string> = {
  machine: 'Votre ordinateur',
  vscode: 'VS Code',
  navigateur: 'Votre navigateur',
};
const lieuLabel = etape.service
  ? `${LIEU_LABEL[etape.lieu]} · ${etape.service}`
  : LIEU_LABEL[etape.lieu];
---

{changementDeLieu && (
  <p class="changement-de-lieu" role="note">
    Vous changez d’application : passez dans {changementDeLieu}.
  </p>
)}

<section class="etape" id={`etape-${etape.id}`} aria-labelledby={`titre-${etape.id}`}>
  <header class="etape-entete">
    <span class="etape-rang">{index + 1} / {total}</span>
    <span class="etape-lieu">{lieuLabel}</span>
    <h2 id={`titre-${etape.id}`}>{etape.titre}</h2>
  </header>

  {etape.danger && <p class="etape-danger" role="alert">{etape.danger}</p>}

  <Visuel visuel={etape.visuel} />

  <ol class="etape-gestes">
    {etape.gestes.map((geste) => (
      <li>
        {geste.action}
        {geste.ancre && <span class="geste-ancre"> ({geste.ancre})</span>}
      </li>
    ))}
  </ol>

  <p class="etape-preuve"><strong>Vous devez voir ça :</strong> {etape.preuve.visible}</p>
  <details class="etape-sinon">
    <summary>Ça n’apparaît pas ?</summary>
    <p>{etape.preuve.sinon}</p>
  </details>

  {etape.pourquoi && (
    <details class="etape-pourquoi">
      <summary>À quoi ça sert</summary>
      <p>{etape.pourquoi}</p>
    </details>
  )}
</section>
```

`src/components/demarrer/GuideShell.astro` :

```astro
---
import type { Guide } from '../../parcours/parcours-model';
import Etape from './Etape.astro';

interface Props { guide: Guide; }
const { guide } = Astro.props;

const LIEU_CIBLE: Record<string, string> = {
  machine: 'votre ordinateur',
  vscode: 'VS Code',
  navigateur: 'votre navigateur',
};

// Le marqueur ne s'affiche que sur une vraie rupture d'application : c'est la
// couture sur laquelle les participants se perdaient.
const changements = guide.etapes.map((etape, index) => {
  if (index === 0) return null;
  const precedent = guide.etapes[index - 1];
  return etape.lieu === precedent.lieu ? null : LIEU_CIBLE[etape.lieu];
});
---

<article class="guide" data-guide={guide.id}>
  <header class="guide-entete">
    <h1>{guide.titre}</h1>
    <p class="guide-promesse">{guide.promesse}</p>
    {guide.pourQui && <p class="guide-pour-qui">{guide.pourQui}</p>}
  </header>

  {guide.etapes.map((etape, index) => (
    <Etape
      etape={etape}
      index={index}
      total={guide.etapes.length}
      changementDeLieu={changements[index]}
    />
  ))}
</article>
```

`src/pages/demarrer/[guide].astro` :

```astro
---
import GuideShell from '../../components/demarrer/GuideShell.astro';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { GUIDES } from '../../parcours/manifests';

export function getStaticPaths() {
  return GUIDES.map((guide) => ({ params: { guide: guide.id }, props: { guide } }));
}

const { guide } = Astro.props;
---

<BaseLayout title={guide.titre} description={guide.promesse}>
  <GuideShell guide={guide} />
</BaseLayout>
```

- [ ] **Step 4: Run tests and build**

Run: `npx tsx --test tests/parcours-routing.test.ts && npm run typecheck && npm run build`
Expected: PASS 3 tests, typecheck sans erreur, build qui produit `dist/demarrer/naissance-projet/index.html`

Vérifier à l'œil : `npm run dev`, ouvrir `http://localhost:4321/demarrer/naissance-projet/`.

- [ ] **Step 5: Commit**

```bash
git add src/components/demarrer src/pages/demarrer src/parcours/manifests/index.ts tests/parcours-routing.test.ts
git commit -m "feat: tranche verticale d une etape de guide"
```

---

### Task 6: Visuel de conversation Claude

**Files:**
- Create: `src/components/demarrer/visuels/VisuelClaude.astro`
- Modify: `src/components/demarrer/visuels/Visuel.astro`

**Interfaces:**
- Consumes: `Extract<Visuel, { key: 'claude' }>` avec `colle: string` et `reponse: string[]`.
- Produces: le composant, plus le bouton de copie, réutilisé par la Task 7.

- [ ] **Step 1: Écrire le composant**

`src/components/demarrer/visuels/VisuelClaude.astro` :

```astro
---
import type { Visuel } from '../../../parcours/parcours-model';

interface Props { visuel: Extract<Visuel, { key: 'claude' }>; }
const { visuel } = Astro.props;
---

<figure class="visuel visuel-claude" data-enhanced="false">
  <figcaption>Dans la conversation Claude</figcaption>

  <div class="claude-bulle claude-bulle-vous">
    <span class="claude-role">Vous collez</span>
    <pre data-copiable>{visuel.colle}</pre>
    <button type="button" class="bouton-copier" data-copier hidden>Copier</button>
  </div>

  <div class="claude-bulle claude-bulle-claude">
    <span class="claude-role">Claude répond</span>
    <ul role="list">
      {visuel.reponse.map((ligne) => <li>{ligne}</li>)}
    </ul>
  </div>
</figure>

<script>
  // Progressive enhancement : sans JavaScript, le bloc reste lisible et
  // sélectionnable à la main, et le bouton n'apparaît jamais.
  document.querySelectorAll<HTMLElement>('.visuel-claude').forEach((figure) => {
    const bouton = figure.querySelector<HTMLButtonElement>('[data-copier]');
    const source = figure.querySelector<HTMLElement>('[data-copiable]');
    if (!bouton || !source) return;

    bouton.hidden = false;
    figure.dataset.enhanced = 'true';
    bouton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(source.textContent ?? '');
      bouton.textContent = 'Copié';
      window.setTimeout(() => { bouton.textContent = 'Copier'; }, 2000);
    });
  });
</script>
```

- [ ] **Step 2: Brancher l'aiguillage**

Dans `src/components/demarrer/visuels/Visuel.astro`, ajouter l'import et la branche :

```astro
import VisuelClaude from './VisuelClaude.astro';
```

```astro
{visuel.key === 'claude' && <VisuelClaude visuel={visuel} />}
```

- [ ] **Step 3: Vérifier**

Ajouter temporairement à l'étape `creer-le-dossier` du manifeste un visuel `claude` pour l'afficher, lancer `npm run dev`, contrôler l'affichage et la copie, puis remettre le visuel `arborescence`.

Run: `npm run typecheck`
Expected: aucune erreur

- [ ] **Step 4: Commit**

```bash
git add src/components/demarrer/visuels
git commit -m "feat: visuel de conversation claude"
```

---

### Task 7: Visuel de capture annotée

**Files:**
- Create: `src/components/demarrer/visuels/VisuelCapture.astro`
- Modify: `src/components/demarrer/visuels/Visuel.astro`

**Interfaces:**
- Consumes: `Extract<Visuel, { key: 'capture' }>`.
- Produces: le composant. Les repères sont rendus en légende numérotée sous l'image, pas en surimpression : une légende reste lisible quand l'interface du service bouge.

- [ ] **Step 1: Écrire le composant**

`src/components/demarrer/visuels/VisuelCapture.astro` :

```astro
---
import type { Visuel } from '../../../parcours/parcours-model';

interface Props { visuel: Extract<Visuel, { key: 'capture' }>; }
const { visuel } = Astro.props;
---

<figure class="visuel visuel-capture" data-enhanced="false">
  <img src={`/${visuel.fichier}`} alt={visuel.alt} loading="lazy" decoding="async" />
  {visuel.reperes.length > 0 && (
    <ol class="capture-reperes">
      {visuel.reperes.map((repere) => (
        <li data-position={repere.position}>{repere.label}</li>
      ))}
    </ol>
  )}
  <figcaption class="capture-source">
    {visuel.service}, écran vérifié le {visuel.verifieLe}. Si votre écran diffère, cherchez le même libellé.
  </figcaption>
</figure>
```

La dernière phrase de la légende est délibérée : elle apprend au lecteur à chercher un **libellé** plutôt qu'une position, ce qui rend la page robuste aux refontes d'interface.

- [ ] **Step 2: Brancher l'aiguillage**

```astro
import VisuelCapture from './VisuelCapture.astro';
```

```astro
{visuel.key === 'capture' && <VisuelCapture visuel={visuel} />}
```

- [ ] **Step 3: Vérifier**

Run: `npm run typecheck`
Expected: aucune erreur

- [ ] **Step 4: Commit**

```bash
git add src/components/demarrer/visuels
git commit -m "feat: visuel de capture annotee"
```

---

### Task 8: Visuel des trois lieux

**Files:**
- Create: `src/components/demarrer/visuels/VisuelTroisLieux.astro`
- Modify: `src/components/demarrer/visuels/Visuel.astro`

**Interfaces:**
- Consumes: `Extract<Visuel, { key: 'trois-lieux' }>` avec `accent: 'projet' | 'ligne' | 'cle'`.
- Produces: le composant. C'est le visuel le plus important de la surface : il porte le modèle mental « mon dossier, GitHub, mon site ».

- [ ] **Step 1: Écrire le composant**

`src/components/demarrer/visuels/VisuelTroisLieux.astro` :

```astro
---
import type { Visuel } from '../../../parcours/parcours-model';

interface Props { visuel: Extract<Visuel, { key: 'trois-lieux' }>; }
const { visuel } = Astro.props;

const LIEUX = [
  { id: 'dossier', nom: 'Votre dossier', detail: 'Sur votre ordinateur' },
  { id: 'github', nom: 'GitHub', detail: 'La copie en ligne' },
  { id: 'site', nom: 'Votre site', detail: 'Ce que le monde ouvre' },
] as const;

const DESCRIPTION: Record<string, string> = {
  projet: 'Votre dossier envoie une copie vers GitHub.',
  ligne: 'Chaque envoi vers GitHub met votre site à jour, tout seul.',
  cle: 'Votre clé va sur votre ordinateur et chez Vercel, jamais sur GitHub.',
};
---

<figure class="visuel visuel-trois-lieux" data-accent={visuel.accent} data-enhanced="false">
  <ol class="trois-lieux-rangee" role="list">
    {LIEUX.map((lieu) => (
      <li data-lieu={lieu.id}>
        <strong>{lieu.nom}</strong>
        <span>{lieu.detail}</span>
      </li>
    ))}
  </ol>
  {visuel.accent === 'cle' && (
    <p class="trois-lieux-interdit">La clé ne franchit jamais la flèche vers GitHub.</p>
  )}
  <figcaption>{DESCRIPTION[visuel.accent]}</figcaption>
</figure>
```

- [ ] **Step 2: Brancher l'aiguillage**

```astro
import VisuelTroisLieux from './VisuelTroisLieux.astro';
```

```astro
{visuel.key === 'trois-lieux' && <VisuelTroisLieux visuel={visuel} />}
```

- [ ] **Step 3: Vérifier**

Run: `npm run typecheck`
Expected: aucune erreur. Les quatre branches de `Visuel.astro` sont désormais couvertes.

- [ ] **Step 4: Commit**

```bash
git add src/components/demarrer/visuels
git commit -m "feat: visuel des trois lieux"
```

---

### Task 9: Pannes avec ancres stables

**Files:**
- Create: `src/components/demarrer/Panne.astro`
- Modify: `src/components/demarrer/Etape.astro`

**Interfaces:**
- Consumes: le type `Panne`.
- Produces: un `<details id="panne-<id>">`, ouvert automatiquement quand l'URL cible son ancre.

- [ ] **Step 1: Écrire le composant**

`src/components/demarrer/Panne.astro` :

```astro
---
import type { Panne } from '../../parcours/parcours-model';

interface Props { panne: Panne; }
const { panne } = Astro.props;
---

<details class="panne" id={`panne-${panne.id}`}>
  <summary>{panne.symptome}</summary>
  <p class="panne-cause">{panne.cause}</p>
  <ol class="panne-reparation">
    {panne.reparation.map((geste) => (
      <li>
        {geste.action}
        {geste.ancre && <span class="geste-ancre"> ({geste.ancre})</span>}
      </li>
    ))}
  </ol>
  <p class="panne-preuve"><strong>C’est réparé quand :</strong> {panne.preuve}</p>
</details>
```

- [ ] **Step 2: Afficher les pannes dans l'étape**

Dans `src/components/demarrer/Etape.astro`, ajouter l'import :

```astro
import Panne from './Panne.astro';
```

Puis, avant la fermeture de `</section>` :

```astro
{etape.pannes.length > 0 && (
  <div class="etape-pannes">
    <h3>Ça coince ?</h3>
    {etape.pannes.map((panne) => <Panne panne={panne} />)}
  </div>
)}
```

- [ ] **Step 3: Ouvrir la panne ciblée par l'URL**

Ajouter à la fin de `src/components/demarrer/GuideShell.astro` :

```astro
<script>
  // Une panne partagée par lien doit être ouverte à l'arrivée, sinon le
  // destinataire atterrit sur un titre replié et croit s'être trompé de lien.
  const ouvrirCible = () => {
    const cible = document.querySelector<HTMLDetailsElement>(
      window.location.hash ? `details${window.location.hash}` : '',
    );
    if (!cible) return;
    cible.open = true;
    cible.scrollIntoView({ block: 'start' });
  };

  ouvrirCible();
  window.addEventListener('hashchange', ouvrirCible);
</script>
```

- [ ] **Step 4: Vérifier**

Run: `npm run typecheck && npm run build`
Expected: aucune erreur

- [ ] **Step 5: Commit**

```bash
git add src/components/demarrer
git commit -m "feat: pannes avec ancres partageables"
```

---

### Task 10: Bandeau collant de repérage

**Files:**
- Modify: `src/components/demarrer/GuideShell.astro`
- Create: `tests/parcours-reperage.test.ts`
- Create: `src/features/demarrer/reperage.ts`

**Interfaces:**
- Consumes: le type `Guide`.
- Produces: `libelleLieu(etape: Etape): string` et `changementsDeLieu(guide: Guide): (string | null)[]`, déplacés hors du composant pour être testables.

- [ ] **Step 1: Write the failing test**

`tests/parcours-reperage.test.ts` :

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { changementsDeLieu, libelleLieu } from '../src/features/demarrer/reperage';
import type { Etape, Guide } from '../src/parcours/parcours-model';

const etape = (id: string, lieu: Etape['lieu'], service?: string): Etape => ({
  id,
  titre: id,
  lieu,
  service,
  gestes: [{ action: 'Faites ceci.' }],
  preuve: { visible: 'Ceci apparaît.', sinon: 'Recommencez.' },
  visuel: { key: 'trois-lieux', accent: 'projet' },
  pannes: [],
});

test('le libellé combine le lieu et le service', () => {
  assert.equal(libelleLieu(etape('a', 'machine')), 'Votre ordinateur');
  assert.equal(libelleLieu(etape('b', 'vscode')), 'VS Code');
  assert.equal(libelleLieu(etape('c', 'navigateur', 'GitHub')), 'Votre navigateur · GitHub');
});

test('le marqueur ne s’affiche qu’à la rupture d’application', () => {
  const guide: Guide = {
    id: 'g',
    titre: 'G',
    promesse: 'P',
    prerequis: [],
    etapes: [
      etape('a', 'machine'),
      etape('b', 'vscode'),
      etape('c', 'vscode'),
      etape('d', 'navigateur', 'GitHub'),
    ],
  };
  assert.deepEqual(changementsDeLieu(guide), [null, 'VS Code', null, 'votre navigateur']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/parcours-reperage.test.ts`
Expected: FAIL, `Cannot find module '../src/features/demarrer/reperage'`

- [ ] **Step 3: Write minimal implementation**

`src/features/demarrer/reperage.ts` :

```ts
import type { Etape, Guide, Lieu } from '../../parcours/parcours-model';

const LIEU_LABEL: Record<Lieu, string> = {
  machine: 'Votre ordinateur',
  vscode: 'VS Code',
  navigateur: 'Votre navigateur',
};

const LIEU_CIBLE: Record<Lieu, string> = {
  machine: 'votre ordinateur',
  vscode: 'VS Code',
  navigateur: 'votre navigateur',
};

export function libelleLieu(etape: Etape): string {
  const base = LIEU_LABEL[etape.lieu];
  return etape.service ? `${base} · ${etape.service}` : base;
}

/**
 * Retourne, pour chaque étape, la cible à annoncer quand on change
 * d'application, ou null quand on reste au même endroit.
 */
export function changementsDeLieu(guide: Guide): (string | null)[] {
  return guide.etapes.map((etape, index) => {
    if (index === 0) return null;
    return etape.lieu === guide.etapes[index - 1].lieu ? null : LIEU_CIBLE[etape.lieu];
  });
}
```

- [ ] **Step 4: Réutiliser le module dans les composants**

Dans `GuideShell.astro`, supprimer la constante `LIEU_CIBLE` et le calcul local, puis :

```astro
import { changementsDeLieu } from '../../features/demarrer/reperage';
const changements = changementsDeLieu(guide);
```

Dans `Etape.astro`, supprimer `LIEU_LABEL` et le calcul local, puis :

```astro
import { libelleLieu } from '../../features/demarrer/reperage';
const lieuLabel = libelleLieu(etape);
```

Ajouter le bandeau collant dans `GuideShell.astro`, juste après `<header class="guide-entete">` :

```astro
<div class="guide-bandeau" data-guide-bandeau aria-live="polite">
  <span data-bandeau-rang>1 / {guide.etapes.length}</span>
  <span data-bandeau-lieu>{libelleLieu(guide.etapes[0])}</span>
</div>

<script>
  import { libelleLieu } from '../../features/demarrer/reperage';

  const bandeau = document.querySelector<HTMLElement>('[data-guide-bandeau]');
  const sections = Array.from(document.querySelectorAll<HTMLElement>('.etape'));
  if (bandeau && sections.length > 0) {
    const rang = bandeau.querySelector<HTMLElement>('[data-bandeau-rang]');
    const lieu = bandeau.querySelector<HTMLElement>('[data-bandeau-lieu]');
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).at(0);
        if (!visible || !rang || !lieu) return;
        const index = sections.indexOf(visible.target as HTMLElement);
        rang.textContent = `${index + 1} / ${sections.length}`;
        lieu.textContent = visible.target.querySelector('.etape-lieu')?.textContent ?? '';
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    bandeau.dataset.enhanced = 'true';
  }
</script>
```

Le bandeau affiche l'étape 1 par défaut : sans JavaScript, il reste juste et n'induit personne en erreur.

Ajouter l'import de `libelleLieu` dans le frontmatter de `GuideShell.astro`.

- [ ] **Step 5: Run tests**

Run: `npx tsx --test tests/parcours-reperage.test.ts && npm run typecheck && npm run build`
Expected: PASS 2 tests, aucune erreur

- [ ] **Step 6: Commit**

```bash
git add src/features/demarrer src/components/demarrer tests/parcours-reperage.test.ts
git commit -m "feat: bandeau de reperage et marqueur de changement de lieu"
```

---

### Task 11: Grille « Ça coince ? » et page d'accueil de la surface

**Files:**
- Create: `src/features/demarrer/cas.ts`
- Create: `src/components/demarrer/CarteOutils.astro`
- Create: `src/pages/demarrer/index.astro`
- Create: `tests/parcours-cas.test.ts`

**Interfaces:**
- Consumes: `GUIDES`, `OUTILS`, `cheminGuide`.
- Produces: `type Cas` et `collecterCas(guides: Guide[]): Cas[]`.

- [ ] **Step 1: Write the failing test**

`tests/parcours-cas.test.ts` :

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { collecterCas } from '../src/features/demarrer/cas';
import { GUIDES } from '../src/parcours/manifests';
import type { Guide } from '../src/parcours/parcours-model';

const guide: Guide = {
  id: 'naissance-projet',
  titre: 'Créer un projet',
  promesse: 'P',
  prerequis: [],
  etapes: [
    {
      id: 'ouvrir-dans-vscode',
      titre: 'Ouvrir le dossier',
      lieu: 'vscode',
      gestes: [{ action: 'Ouvrez le dossier.' }],
      preuve: { visible: 'Le nom apparaît.', sinon: 'Recommencez.' },
      visuel: { key: 'trois-lieux', accent: 'projet' },
      pannes: [
        {
          id: 'fichier-au-lieu-du-dossier',
          frequente: true,
          symptome: 'Je vois un seul fichier, pas mon dossier',
          cause: 'Le fichier a été ouvert seul, pas le dossier qui le contient.',
          reparation: [{ action: 'Refermez, puis ouvrez le dossier.' }],
          preuve: 'Le nom du dossier apparaît en haut de la barre latérale.',
        },
        {
          id: 'panne-rare',
          frequente: false,
          symptome: 'Un cas rare',
          cause: 'Rare.',
          reparation: [{ action: 'Faites ceci.' }],
          preuve: 'C’est réglé.',
        },
      ],
    },
  ],
};

test('seules les pannes fréquentes remontent dans la grille', () => {
  const cas = collecterCas([guide]);
  assert.equal(cas.length, 1);
  assert.equal(cas[0].panneId, 'fichier-au-lieu-du-dossier');
});

test('chaque entrée pointe vers une ancre complète', () => {
  const cas = collecterCas([guide]);
  assert.equal(cas[0].href, '/demarrer/naissance-projet/#panne-fichier-au-lieu-du-dossier');
  assert.equal(cas[0].guideTitre, 'Créer un projet');
});

test('toutes les ancres de la grille livrée existent dans les manifestes', () => {
  const ancres = new Set(
    GUIDES.flatMap((g) =>
      g.etapes.flatMap((etape) =>
        etape.pannes.map((panne) => `/demarrer/${g.id}/#panne-${panne.id}`),
      ),
    ),
  );
  for (const cas of collecterCas(GUIDES)) {
    assert.ok(ancres.has(cas.href), `ancre orpheline : ${cas.href}`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/parcours-cas.test.ts`
Expected: FAIL, `Cannot find module '../src/features/demarrer/cas'`

- [ ] **Step 3: Write minimal implementation**

`src/features/demarrer/cas.ts` :

```ts
import { cheminGuide } from '../../parcours/manifests';
import type { Guide } from '../../parcours/parcours-model';

export type Cas = {
  symptome: string;
  guideId: string;
  guideTitre: string;
  etapeId: string;
  panneId: string;
  href: string;
};

/**
 * La grille d'accueil est dérivée des manifestes et jamais saisie à la main :
 * elle ne peut donc pas diverger du contenu des guides.
 */
export function collecterCas(guides: Guide[]): Cas[] {
  return guides.flatMap((guide) =>
    guide.etapes.flatMap((etape) =>
      etape.pannes
        .filter((panne) => panne.frequente)
        .map((panne) => ({
          symptome: panne.symptome,
          guideId: guide.id,
          guideTitre: guide.titre,
          etapeId: etape.id,
          panneId: panne.id,
          href: `${cheminGuide(guide.id)}#panne-${panne.id}`,
        })),
    ),
  );
}
```

`src/components/demarrer/CarteOutils.astro` :

```astro
---
import type { Outil } from '../../parcours/parcours-model';

interface Props { outils: Outil[]; }
const { outils } = Astro.props;
---

<section class="carte-outils" aria-labelledby="titre-outils">
  <h2 id="titre-outils">Vos outils</h2>
  <ul class="outils-rangee" role="list">
    {outils.map((outil) => (
      <li>
        <img src={`/${outil.logo}`} alt="" aria-hidden="true" width="32" height="32" />
        <strong>{outil.nom}</strong>
        <span>{outil.role}</span>
      </li>
    ))}
  </ul>
</section>
```

Les logos sont décoratifs : le nom est écrit juste à côté, donc `alt=""` évite une répétition au lecteur d'écran.

`src/pages/demarrer/index.astro` :

```astro
---
import CarteOutils from '../../components/demarrer/CarteOutils.astro';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { collecterCas } from '../../features/demarrer/cas';
import { GUIDES, cheminGuide } from '../../parcours/manifests';
import { OUTILS } from '../../parcours/outils';

const cas = collecterCas(GUIDES);
---

<BaseLayout
  title="Démarrer"
  description="Les gestes en images pour créer votre projet, le mettre en ligne et lui donner une clé."
>
  <CarteOutils outils={OUTILS} />

  <section class="guides-grille" aria-labelledby="titre-guides">
    <h2 id="titre-guides">Je veux…</h2>
    <ul role="list">
      {GUIDES.map((guide) => (
        <li>
          <a href={cheminGuide(guide.id)}>
            <strong>{guide.titre}</strong>
            <span>{guide.promesse}</span>
          </a>
        </li>
      ))}
    </ul>
  </section>

  {cas.length > 0 && (
    <section class="cas-grille" aria-labelledby="titre-cas">
      <h2 id="titre-cas">Ça coince ?</h2>
      <ul role="list">
        {cas.map((entree) => (
          <li>
            <a href={entree.href}>{entree.symptome}</a>
            <span class="cas-guide">{entree.guideTitre}</span>
          </li>
        ))}
      </ul>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 4: Run tests**

Run: `npx tsx --test tests/parcours-cas.test.ts && npm run build`
Expected: PASS 3 tests, `dist/demarrer/index.html` produit

- [ ] **Step 5: Commit**

```bash
git add src/features/demarrer/cas.ts src/components/demarrer/CarteOutils.astro src/pages/demarrer/index.astro tests/parcours-cas.test.ts
git commit -m "feat: accueil de la surface demarrer et grille des cas"
```

---

### Task 12: Contenu du guide 1, créer un projet et le mettre sur GitHub

**Files:**
- Modify: `src/parcours/manifests/naissance-projet.ts`
- Modify: `tests/parcours-content.test.ts`
- Create: `public/demarrer/naissance-projet/*.png`

**Interfaces:**
- Consumes: tous les types du modèle.
- Produces: un guide de 8 étapes et 7 pannes.

Captures à produire, chacune prise à l'écran puis rognée sur la zone utile :

| Fichier | Écran |
|---|---|
| `extension-claude.png` | Panneau des extensions de VS Code, Claude Code sélectionné, bouton « Enable in this workspace » visible |
| `depot-vide.png` | Formulaire de création GitHub, les trois cases d'initialisation décochées |
| `bloc-commandes.png` | Page du dépôt vide, bloc « push an existing repository », bouton de copie visible |

- [ ] **Step 1: Écrire le manifeste complet**

Remplacer le tableau `etapes` de `src/parcours/manifests/naissance-projet.ts` par :

```ts
  etapes: [
    {
      id: 'creer-le-dossier',
      titre: 'Créer un dossier pour votre projet',
      lieu: 'machine',
      pourquoi: 'Un projet vit dans un dossier. Un projet, un dossier : la règle qui vous évitera des heures de confusion.',
      gestes: [
        { action: 'Créez un dossier dans votre dossier personnel, pas sur le Bureau.', ancre: 'Documents' },
        { action: 'Nommez-le en minuscules avec des tirets, sans espace ni accent.' },
      ],
      preuve: {
        visible: 'Le dossier apparaît, il est vide, et vous savez le retrouver.',
        sinon: 'Recommencez depuis votre dossier personnel : un dossier créé ailleurs se retrouve mal.',
      },
      visuel: { key: 'arborescence', avant: ['Documents/'], apres: ['Documents/', '  mon-projet/'] },
      pannes: [],
    },
    {
      id: 'ouvrir-dans-vscode',
      titre: 'Ouvrir ce dossier dans VS Code',
      lieu: 'vscode',
      pourquoi: 'Claude ne voit que le dossier ouvert. Ouvrir un fichier seul ne suffit pas : il faut ouvrir le dossier entier.',
      gestes: [
        { action: 'Dans VS Code, choisissez Ouvrir le dossier.', ancre: 'Fichier' },
        { action: 'Sélectionnez le dossier que vous venez de créer, puis validez.' },
      ],
      preuve: {
        visible: 'Le nom de votre dossier s’affiche en haut de la barre latérale de gauche.',
        sinon: 'Vous avez sans doute ouvert un fichier. Refermez tout et recommencez avec Ouvrir le dossier.',
      },
      visuel: { key: 'arborescence', avant: [], apres: ['mon-projet/'] },
      pannes: [
        {
          id: 'fichier-au-lieu-du-dossier',
          frequente: true,
          symptome: 'Je vois un seul fichier, pas le nom de mon dossier',
          cause: 'VS Code a ouvert un fichier isolé au lieu du dossier qui le contient.',
          reparation: [
            { action: 'Refermez la fenêtre.' },
            { action: 'Reprenez avec Ouvrir le dossier, jamais Ouvrir le fichier.', ancre: 'Fichier' },
          ],
          preuve: 'Le nom du dossier apparaît en haut de la barre latérale.',
        },
      ],
    },
    {
      id: 'activer-extension-claude',
      titre: 'Autoriser Claude dans ce dossier',
      lieu: 'vscode',
      pourquoi: 'VS Code désactive les extensions dans un dossier qu’il ne connaît pas encore. Sans cette autorisation, rien ne marchera.',
      gestes: [
        { action: 'Ouvrez le panneau des extensions dans la barre de gauche.', ancre: 'Extensions' },
        { action: 'Cherchez Claude Code.' },
        { action: 'Cliquez sur Enable in this workspace, ou Activer dans cet espace de travail.' },
      ],
      preuve: {
        visible: 'Le bouton affiche maintenant Disable, ou Désactiver : l’extension est donc active.',
        sinon: 'Fermez complètement VS Code, rouvrez votre dossier, et recommencez.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/naissance-projet/extension-claude.png',
        alt: 'Le panneau des extensions de VS Code, avec Claude Code sélectionné et le bouton d’activation.',
        service: 'VS Code',
        verifieLe: '2026-07-27',
        reperes: [
          { label: 'Le panneau des extensions, dans la barre de gauche', position: 'gauche' },
          { label: 'Le bouton d’activation pour cet espace de travail', position: 'centre' },
        ],
      },
      pannes: [
        {
          id: 'extension-introuvable',
          frequente: true,
          symptome: 'Je ne trouve pas Claude Code dans la liste',
          cause: 'L’extension n’est pas installée sur cette machine, seulement cherchée.',
          reparation: [
            { action: 'Tapez Claude Code dans la barre de recherche des extensions.' },
            { action: 'Cliquez sur Install, puis sur Enable in this workspace.' },
          ],
          preuve: 'Claude Code apparaît dans vos extensions installées avec un bouton Disable.',
        },
      ],
    },
    {
      id: 'lancer-claude',
      titre: 'Lancer Claude et vérifier qu’il voit votre dossier',
      lieu: 'vscode',
      pourquoi: 'Une minute de vérification ici évite une heure de confusion plus tard : Claude travaille parfois dans un autre dossier.',
      gestes: [
        { action: 'Ouvrez Claude dans VS Code.' },
        { action: 'Copiez le message ci-dessous et envoyez-le.' },
      ],
      aClaude: 'Dans quel dossier es-tu en train de travailler ? Donne-moi son nom et liste ce qu’il contient.',
      preuve: {
        visible: 'Claude cite le nom de votre dossier, et dit qu’il est vide.',
        sinon: 'Claude nomme un autre dossier : refermez tout et rouvrez le bon dossier avant de continuer.',
      },
      visuel: {
        key: 'claude',
        colle: 'Dans quel dossier es-tu en train de travailler ? Donne-moi son nom et liste ce qu’il contient.',
        reponse: [
          'Je travaille dans mon-projet.',
          'Le dossier est vide pour le moment.',
        ],
      },
      pannes: [
        {
          id: 'claude-voit-autre-dossier',
          frequente: true,
          symptome: 'Claude parle d’un dossier que je ne reconnais pas',
          cause: 'Claude est resté attaché au projet précédemment ouvert.',
          reparation: [
            { action: 'Refermez la fenêtre de VS Code.' },
            { action: 'Rouvrez votre dossier avec Ouvrir le dossier, puis relancez Claude.', ancre: 'Fichier' },
          ],
          preuve: 'Claude cite le nom de votre dossier.',
        },
      ],
    },
    {
      id: 'creer-depot-vide',
      titre: 'Créer un dépôt entièrement vide sur GitHub',
      lieu: 'navigateur',
      service: 'GitHub',
      danger: 'Ne cochez aucune case d’initialisation. Un dépôt vide vous donne les instructions toutes prêtes ; un dépôt prérempli ne vous donne rien et bloque la suite.',
      pourquoi: 'GitHub affiche des instructions prêtes à l’emploi uniquement quand le dépôt est vide. C’est cette matière que vous copierez.',
      gestes: [
        { action: 'Sur github.com, créez un nouveau dépôt.', ancre: 'New repository' },
        { action: 'Donnez-lui le même nom que votre dossier.' },
        { action: 'Laissez les trois cases d’initialisation décochées : pas de README, pas de fichier d’exclusions, pas de licence.' },
        { action: 'Validez la création.', ancre: 'Create repository' },
      ],
      preuve: {
        visible: 'Une page de dépôt sans aucun fichier, avec plusieurs blocs d’instructions.',
        sinon: 'Vous voyez un fichier README : supprimez ce dépôt et recréez-le sans cocher aucune case.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/naissance-projet/depot-vide.png',
        alt: 'Le formulaire de création GitHub, les trois cases d’initialisation laissées décochées.',
        service: 'GitHub',
        verifieLe: '2026-07-27',
        reperes: [
          { label: 'Le champ du nom, identique au nom de votre dossier', position: 'haut' },
          { label: 'Les trois cases à laisser décochées', position: 'bas' },
        ],
      },
      pannes: [
        {
          id: 'nom-depot-deja-pris',
          frequente: false,
          symptome: 'GitHub dit que ce nom existe déjà',
          cause: 'Vous avez déjà un dépôt portant ce nom.',
          reparation: [{ action: 'Ajoutez un mot au nom, par exemple mon-projet-2, et validez.' }],
          preuve: 'La page du nouveau dépôt s’affiche.',
        },
        {
          id: 'depot-cree-avec-readme',
          frequente: true,
          symptome: 'GitHub ne m’affiche aucun bloc d’instructions',
          cause: 'Le dépôt a été créé avec un README, donc GitHub le considère comme déjà rempli.',
          reparation: [
            { action: 'Ouvrez les réglages du dépôt et supprimez-le.', ancre: 'Settings' },
            { action: 'Recréez-le sans cocher aucune case.' },
          ],
          preuve: 'La page du dépôt vide affiche les blocs d’instructions.',
        },
      ],
    },
    {
      id: 'copier-le-bloc',
      titre: 'Copier les instructions que GitHub vous donne',
      lieu: 'navigateur',
      service: 'GitHub',
      pourquoi: 'Ces lignes relient votre dossier à votre dépôt. Vous n’avez pas à les comprendre : vous allez les confier à Claude.',
      gestes: [
        { action: 'Repérez le bloc intitulé push an existing repository.' },
        { action: 'Cliquez sur l’icône de copie à droite de ce bloc.' },
      ],
      preuve: {
        visible: 'L’icône de copie confirme que le bloc est copié.',
        sinon: 'Sélectionnez les lignes à la souris et copiez-les avec le raccourci habituel.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/naissance-projet/bloc-commandes.png',
        alt: 'La page d’un dépôt GitHub vide, avec le bloc d’instructions et son bouton de copie.',
        service: 'GitHub',
        verifieLe: '2026-07-27',
        reperes: [
          { label: 'Le bloc push an existing repository', position: 'centre' },
          { label: 'Le bouton de copie, à droite du bloc', position: 'droite' },
        ],
      },
      pannes: [],
    },
    {
      id: 'coller-a-claude',
      titre: 'Coller le tout à Claude et le laisser faire',
      lieu: 'vscode',
      pourquoi: 'C’est le cœur de la méthode : GitHub écrit les instructions, Claude les exécute, vous vérifiez le résultat.',
      gestes: [
        { action: 'Revenez dans Claude, dans VS Code.' },
        { action: 'Écrivez la phrase ci-dessous, puis collez le bloc copié juste en dessous.' },
        { action: 'Envoyez, et autorisez Claude s’il vous demande la permission d’agir.' },
      ],
      aClaude: 'Voici les instructions que GitHub vient de me donner pour relier ce projet. Exécute-les dans ce dossier, puis dis-moi quand c’est en ligne.',
      preuve: {
        visible: 'Claude annonce que le projet est envoyé sur GitHub.',
        sinon: 'Claude signale une erreur : copiez sa réponse entière et redemandez-lui de la corriger.',
      },
      visuel: {
        key: 'claude',
        colle: 'Voici les instructions que GitHub vient de me donner pour relier ce projet. Exécute-les dans ce dossier, puis dis-moi quand c’est en ligne.',
        reponse: [
          'J’ai relié votre dossier au dépôt.',
          'La première sauvegarde est envoyée.',
          'Rafraîchissez la page GitHub pour la voir.',
        ],
      },
      pannes: [
        {
          id: 'claude-demande-autorisation',
          frequente: false,
          symptome: 'Claude demande la permission avant d’agir',
          cause: 'C’est normal : Claude demande votre accord avant de modifier quoi que ce soit.',
          reparation: [{ action: 'Lisez ce qu’il propose, puis acceptez.' }],
          preuve: 'Claude poursuit et annonce que c’est envoyé.',
        },
      ],
    },
    {
      id: 'verifier-sur-github',
      titre: 'Rafraîchir GitHub et voir votre projet',
      lieu: 'navigateur',
      service: 'GitHub',
      pourquoi: 'On n’avance jamais sur la parole de l’IA : on regarde. C’est le réflexe qui vous servira toute votre vie.',
      gestes: [
        { action: 'Revenez sur la page de votre dépôt.' },
        { action: 'Rafraîchissez la page.' },
      ],
      preuve: {
        visible: 'Vos fichiers apparaissent dans la liste, avec la date du jour.',
        sinon: 'La page reste vide : retournez voir Claude et demandez-lui pourquoi rien n’est arrivé.',
      },
      visuel: { key: 'trois-lieux', accent: 'projet' },
      pannes: [
        {
          id: 'page-github-vide',
          frequente: true,
          symptome: 'Ma page GitHub reste vide après rafraîchissement',
          cause: 'L’envoi n’est pas allé au bout, souvent parce qu’une autorisation manquait.',
          reparation: [
            { action: 'Retournez dans Claude.' },
            { action: 'Écrivez : vérifie que tout est bien envoyé sur GitHub, et corrige si ce n’est pas le cas.' },
          ],
          preuve: 'Vos fichiers apparaissent après un nouveau rafraîchissement.',
        },
      ],
    },
  ],
```

- [ ] **Step 2: Mettre à jour les compteurs figés**

Dans `tests/parcours-content.test.ts`, remplacer le test des compteurs par :

```ts
test('les compteurs figés du contenu', () => {
  assert.equal(GUIDES.length, 1);
  assert.equal(GUIDES.reduce((total, guide) => total + guide.etapes.length, 0), 8);
  assert.equal(
    GUIDES.reduce(
      (total, guide) => total + guide.etapes.reduce((sous, etape) => sous + etape.pannes.length, 0),
      0,
    ),
    7,
  );
});
```

- [ ] **Step 3: Produire les trois captures**

Prendre les trois captures listées plus haut, les rogner sur la zone utile, les enregistrer dans `public/demarrer/naissance-projet/`. Largeur cible 1200 pixels, format PNG.

- [ ] **Step 4: Vérifier**

Run: `npm run parcours:check && npx tsx --test tests/parcours-content.test.ts && npm run build`
Expected: `Guides valides : 1 guides, 8 étapes, 7 pannes, 6 outils.`, tests au vert, build sans erreur

- [ ] **Step 5: Commit**

```bash
git add src/parcours/manifests/naissance-projet.ts tests/parcours-content.test.ts public/demarrer/naissance-projet
git commit -m "content: guide creer un projet et le mettre sur github"
```

---

### Task 13: Contenu du guide 2, mettre votre site en ligne

**Files:**
- Create: `src/parcours/manifests/mise-en-ligne.ts`
- Modify: `src/parcours/manifests/index.ts`
- Modify: `tests/parcours-content.test.ts`
- Create: `public/demarrer/mise-en-ligne/*.png`

**Interfaces:**
- Consumes: le type `Guide`.
- Produces: `MISE_EN_LIGNE`, ajouté à `GUIDES` en deuxième position.

Captures : `import-depot.png` (la liste des dépôts avec le bouton d'import), `bouton-deployer.png` (l'écran de configuration avec le bouton de déploiement), `lien-du-site.png` (le tableau de bord du projet avec son adresse).

- [ ] **Step 1: Écrire le manifeste**

`src/parcours/manifests/mise-en-ligne.ts` :

```ts
import type { Guide } from '../parcours-model';

export const MISE_EN_LIGNE: Guide = {
  id: 'mise-en-ligne',
  titre: 'Mettre votre site en ligne',
  promesse: 'De votre dépôt GitHub à une adresse que vous pouvez envoyer à n’importe qui.',
  prerequis: ['Votre projet est sur GitHub'],
  etapes: [
    {
      id: 'compte-vercel',
      titre: 'Créer votre compte Vercel avec GitHub',
      lieu: 'navigateur',
      service: 'Vercel',
      pourquoi: 'En passant par GitHub, vous n’avez aucun mot de passe supplémentaire à retenir, et Vercel voit vos projets.',
      gestes: [
        { action: 'Sur vercel.com, choisissez de continuer avec GitHub.', ancre: 'Continue with GitHub' },
        { action: 'Acceptez de donner à Vercel l’accès à vos dépôts.' },
      ],
      preuve: {
        visible: 'Votre pseudo GitHub s’affiche dans Vercel.',
        sinon: 'Déconnectez-vous de Vercel et recommencez en acceptant l’accès aux dépôts.',
      },
      visuel: { key: 'trois-lieux', accent: 'ligne' },
      pannes: [
        {
          id: 'vercel-ne-voit-pas-mes-depots',
          frequente: true,
          symptome: 'Vercel n’affiche aucun de mes projets',
          cause: 'L’accès aux dépôts n’a pas été accordé au moment de la connexion.',
          reparation: [
            { action: 'Déconnectez-vous de Vercel.' },
            { action: 'Reconnectez-vous avec GitHub en acceptant l’accès à vos dépôts.' },
          ],
          preuve: 'Vos projets apparaissent dans la liste.',
        },
      ],
    },
    {
      id: 'importer-le-depot',
      titre: 'Importer votre projet',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Cliquez sur ajouter un nouveau projet.', ancre: 'Add New' },
        { action: 'Trouvez votre projet dans la liste, reconnaissable à son nom.' },
        { action: 'Cliquez sur importer.', ancre: 'Import' },
      ],
      preuve: {
        visible: 'Le nom de votre projet s’affiche en haut de la page.',
        sinon: 'Votre projet n’est pas dans la liste : voyez la panne juste au-dessus, à l’étape précédente.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/mise-en-ligne/import-depot.png',
        alt: 'La liste des projets GitHub dans Vercel, avec le bouton d’import.',
        service: 'Vercel',
        verifieLe: '2026-07-27',
        reperes: [{ label: 'Le bouton d’import, à droite du nom de votre projet', position: 'droite' }],
      },
      pannes: [],
    },
    {
      id: 'deployer',
      titre: 'Cliquer sur déployer, sans toucher à rien',
      lieu: 'navigateur',
      service: 'Vercel',
      pourquoi: 'Vercel devine tout seul comment construire votre projet. Modifier ces réglages est le meilleur moyen de casser quelque chose.',
      gestes: [
        { action: 'Ne changez aucun réglage de la page.' },
        { action: 'Cliquez sur déployer.', ancre: 'Deploy' },
        { action: 'Patientez : cela prend souvent moins d’une minute.' },
      ],
      preuve: {
        visible: 'Une page de félicitations, avec un aperçu de votre site.',
        sinon: 'Un message d’échec s’affiche : notez-le et montrez-le à votre formateur, ne cherchez pas à le corriger seul.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/mise-en-ligne/bouton-deployer.png',
        alt: 'L’écran de configuration de Vercel, avec le bouton de déploiement.',
        service: 'Vercel',
        verifieLe: '2026-07-27',
        reperes: [{ label: 'Le bouton de déploiement, en bas de la page', position: 'bas' }],
      },
      pannes: [
        {
          id: 'deploiement-echoue',
          frequente: true,
          symptome: 'Vercel affiche que le déploiement a échoué',
          cause: 'Quelque chose empêche la construction du site. La cause est technique et varie d’un projet à l’autre.',
          reparation: [
            { action: 'Ne cherchez pas à comprendre le message.' },
            { action: 'Faites une capture de l’écran et montrez-la à votre formateur.' },
          ],
          preuve: 'Un déploiement réussi, avec l’aperçu de votre site.',
        },
      ],
    },
    {
      id: 'ouvrir-le-site',
      titre: 'Ouvrir votre site',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [{ action: 'Cliquez sur l’aperçu de votre site.' }],
      preuve: {
        visible: 'Votre site s’ouvre, et son adresse se termine par vercel point app.',
        sinon: 'Rafraîchissez la page du tableau de bord et réessayez.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/mise-en-ligne/lien-du-site.png',
        alt: 'Le tableau de bord d’un projet Vercel, avec l’adresse du site en évidence.',
        service: 'Vercel',
        verifieLe: '2026-07-27',
        reperes: [{ label: 'L’adresse de votre site, en haut du tableau de bord', position: 'haut' }],
      },
      pannes: [],
    },
    {
      id: 'retrouver-le-lien',
      titre: 'Savoir où retrouver ce lien plus tard',
      lieu: 'navigateur',
      service: 'Vercel',
      pourquoi: 'C’est la question qui revient le lendemain. Le lien est toujours au même endroit.',
      gestes: [
        { action: 'Ouvrez vercel.com et connectez-vous.' },
        { action: 'Cliquez sur votre projet : l’adresse est affichée en haut.' },
      ],
      preuve: {
        visible: 'L’adresse de votre site, en haut du tableau de bord du projet.',
        sinon: 'Vérifiez que vous êtes connecté au bon compte Vercel.',
      },
      visuel: { key: 'trois-lieux', accent: 'ligne' },
      pannes: [],
    },
    {
      id: 'le-lien-permanent',
      titre: 'Changer quelque chose et regarder le site se mettre à jour',
      lieu: 'vscode',
      pourquoi: 'C’est le moment le plus important : votre dossier, GitHub et votre site ne font plus qu’une seule mécanique.',
      gestes: [
        { action: 'Dans Claude, demandez un petit changement visible avec le message ci-dessous.' },
        { action: 'Attendez une minute, puis rouvrez votre site et rafraîchissez.' },
      ],
      aClaude: 'Change le titre de la page d’accueil, puis envoie la modification sur GitHub.',
      preuve: {
        visible: 'Votre site affiche le nouveau titre, sans que vous ayez rien fait sur Vercel.',
        sinon: 'Attendez encore une minute et rafraîchissez : la mise à jour prend parfois un peu de temps.',
      },
      visuel: { key: 'trois-lieux', accent: 'ligne' },
      pannes: [
        {
          id: 'le-site-ne-change-pas',
          frequente: true,
          symptome: 'J’ai fait la modification mais mon site reste identique',
          cause: 'La modification n’est pas partie sur GitHub, ou la mise à jour est encore en cours.',
          reparation: [
            { action: 'Ouvrez votre dépôt GitHub et vérifiez que la modification y figure.' },
            { action: 'Si elle n’y est pas, demandez à Claude : envoie la modification sur GitHub.' },
          ],
          preuve: 'Votre site affiche le changement après rafraîchissement.',
        },
      ],
    },
  ],
};
```

- [ ] **Step 2: Enregistrer le guide**

Dans `src/parcours/manifests/index.ts` :

```ts
import { MISE_EN_LIGNE } from './mise-en-ligne';

export const GUIDES: Guide[] = [NAISSANCE_PROJET, MISE_EN_LIGNE];
```

- [ ] **Step 3: Mettre à jour les compteurs**

Dans `tests/parcours-content.test.ts` : `GUIDES.length` vaut `2`, le total d'étapes `14`, le total de pannes `10`.

- [ ] **Step 4: Vérifier**

Run: `npm run parcours:check && npx tsx --test tests/parcours-content.test.ts && npm run build`
Expected: `Guides valides : 2 guides, 14 étapes, 10 pannes, 6 outils.`

- [ ] **Step 5: Commit**

```bash
git add src/parcours/manifests tests/parcours-content.test.ts public/demarrer/mise-en-ligne
git commit -m "content: guide mettre votre site en ligne"
```

---

### Task 14: Contenu du guide 3, donner une clé API

**Files:**
- Create: `src/parcours/manifests/cle-api.ts`
- Modify: `src/parcours/manifests/index.ts`
- Modify: `tests/parcours-content.test.ts`
- Create: `public/demarrer/cle-api/*.png`

**Interfaces:**
- Consumes: le type `Guide`.
- Produces: `CLE_API`, ajouté à `GUIDES` en troisième position.

Captures : `console-anthropic.png` (l'écran de création de clé, valeur masquée), `variables-vercel.png` (l'écran des variables d'environnement), `redeployer.png` (le menu de redéploiement).

- [ ] **Step 1: Écrire le manifeste**

`src/parcours/manifests/cle-api.ts` :

```ts
import type { Guide } from '../parcours-model';

export const CLE_API: Guide = {
  id: 'cle-api',
  titre: 'Donner une clé à votre projet',
  promesse: 'Pour que votre site puisse poser des questions à Claude, sans jamais laisser fuiter votre clé.',
  pourQui:
    'Ce guide est pour vous si votre site doit poser des questions à Claude, par exemple quand un visiteur écrit quelque chose et attend une réponse. Si votre site se contente d’afficher des pages, vous n’avez besoin de rien de tout ça.',
  prerequis: ['Votre site est en ligne sur Vercel'],
  etapes: [
    {
      id: 'creer-la-cle',
      titre: 'Créer votre clé chez Anthropic',
      lieu: 'navigateur',
      service: 'console Anthropic',
      danger: 'Cette clé donne accès à un service payant. Elle ne s’affiche qu’une seule fois : copiez-la immédiatement. Si vous la perdez, vous en créerez une autre, ce n’est pas grave.',
      pourquoi: 'Une clé, c’est un mot de passe. Celui qui l’a peut dépenser votre argent, d’où toutes les précautions qui suivent.',
      gestes: [
        { action: 'Connectez-vous sur la console Anthropic.' },
        { action: 'Créez une nouvelle clé et donnez-lui le nom de votre projet.' },
        { action: 'Copiez-la tout de suite et gardez l’onglet ouvert.' },
      ],
      preuve: {
        visible: 'Une longue suite de caractères s’affiche, et elle commence par sk-ant.',
        sinon: 'Vous avez fermé la fenêtre trop tôt : créez simplement une nouvelle clé.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/cle-api/console-anthropic.png',
        alt: 'L’écran de création d’une clé dans la console Anthropic, la valeur étant masquée.',
        service: 'console Anthropic',
        verifieLe: '2026-07-27',
        reperes: [
          { label: 'Le bouton de création d’une clé', position: 'haut' },
          { label: 'La clé, affichée une seule fois', position: 'centre' },
        ],
      },
      pannes: [
        {
          id: 'cle-perdue',
          frequente: true,
          symptome: 'J’ai fermé la fenêtre sans copier ma clé',
          cause: 'Une clé ne s’affiche qu’une fois, par sécurité. Personne ne peut la retrouver, pas même Anthropic.',
          reparation: [
            { action: 'Supprimez la clé que vous ne pouvez plus lire.' },
            { action: 'Créez-en une nouvelle et copiez-la immédiatement.' },
          ],
          preuve: 'Une nouvelle clé est affichée et copiée.',
        },
      ],
    },
    {
      id: 'preparer-le-coffre',
      titre: 'Demander à Claude de préparer le coffre',
      lieu: 'vscode',
      pourquoi: 'Le coffre se prépare avant d’y mettre la clé. Dans l’autre ordre, la clé pourrait partir en ligne entre-temps.',
      gestes: [
        { action: 'Ouvrez Claude dans VS Code.' },
        { action: 'Copiez le message ci-dessous et envoyez-le, sans y mettre votre clé.' },
      ],
      aClaude:
        'Crée un fichier .env à la racine de ce projet, avec une ligne ANTHROPIC_API_KEY= et rien après le signe égal. Ajoute .env au fichier .gitignore pour qu’il ne parte jamais sur GitHub. Puis explique-moi en une phrase simple ce que tu viens de faire.',
      preuve: {
        visible: 'Un fichier .env apparaît dans la barre latérale, et Claude explique ce qu’il a fait.',
        sinon: 'Renvoyez le même message à Claude en lui demandant de vérifier son travail.',
      },
      visuel: {
        key: 'arborescence',
        avant: ['mon-projet/', '  index.html'],
        apres: ['mon-projet/', '  index.html', '  .gitignore', '  .env'],
        ignores: ['.env'],
      },
      pannes: [],
    },
    {
      id: 'coller-la-cle',
      titre: 'Coller votre clé dans le fichier',
      lieu: 'vscode',
      danger: 'Ne collez jamais votre clé dans la conversation avec Claude. Elle se met dans le fichier, et nulle part ailleurs.',
      pourquoi: 'C’est le seul geste de ce guide que personne ne peut faire à votre place : la clé n’appartient qu’à vous.',
      gestes: [
        { action: 'Ouvrez le fichier .env dans la barre latérale.' },
        { action: 'Collez votre clé juste après le signe égal, sans espace.' },
        { action: 'Enregistrez le fichier.' },
      ],
      fichiers: [
        {
          chemin: '.env',
          contenu: 'ANTHROPIC_API_KEY=sk-ant-collez-votre-cle-ici',
          commentaire: 'Remplacez tout ce qui suit le signe égal par votre propre clé.',
        },
      ],
      preuve: {
        visible: 'La ligne est complète, et le nom du fichier .env s’affiche en grisé dans la barre latérale.',
        sinon: 'Le nom n’est pas grisé : le fichier n’est pas protégé. Reprenez l’étape précédente avant d’aller plus loin.',
      },
      visuel: {
        key: 'arborescence',
        avant: ['mon-projet/', '  .env'],
        apres: ['mon-projet/', '  .env'],
        ignores: ['.env'],
      },
      pannes: [],
    },
    {
      id: 'verifier-absence-env',
      titre: 'Vérifier de vos yeux que la clé n’est pas en ligne',
      lieu: 'navigateur',
      service: 'GitHub',
      pourquoi: 'On ne croit personne sur parole, pas même Claude. Une liste de fichiers se lit en trois secondes.',
      gestes: [
        { action: 'Ouvrez la page de votre dépôt sur github.com.' },
        { action: 'Parcourez la liste des fichiers.' },
      ],
      preuve: {
        visible: 'Aucun fichier nommé .env dans la liste.',
        sinon: 'Vous voyez un fichier .env : lisez la panne ci-dessous tout de suite, sans attendre.',
      },
      visuel: { key: 'trois-lieux', accent: 'cle' },
      pannes: [
        {
          id: 'env-visible-sur-github',
          frequente: true,
          symptome: 'Je vois un fichier .env sur GitHub',
          cause: 'Votre clé est partie en ligne. La supprimer ne suffit pas : GitHub garde une trace de tout ce qui a été envoyé.',
          reparation: [
            { action: 'Retournez sur la console Anthropic et supprimez cette clé immédiatement.' },
            { action: 'Créez-en une nouvelle.' },
            { action: 'Demandez à Claude de retirer le fichier de GitHub et de le protéger.' },
            { action: 'Recollez la nouvelle clé dans le fichier .env.' },
          ],
          preuve: 'La page GitHub n’affiche plus de fichier .env, et l’ancienne clé n’existe plus chez Anthropic.',
        },
      ],
    },
    {
      id: 'cle-dans-vercel',
      titre: 'Donner la clé à Vercel',
      lieu: 'navigateur',
      service: 'Vercel',
      pourquoi: 'Votre clé n’est pas partie sur GitHub, donc Vercel ne l’a pas. C’est normal, et c’est à vous de la lui donner.',
      gestes: [
        { action: 'Ouvrez votre projet sur vercel.com, puis ses réglages.', ancre: 'Settings' },
        { action: 'Allez dans les variables d’environnement.', ancre: 'Environment Variables' },
        { action: 'Créez une variable nommée exactement ANTHROPIC_API_KEY.' },
        { action: 'Collez votre clé comme valeur, puis enregistrez.' },
      ],
      preuve: {
        visible: 'La variable apparaît dans la liste, sa valeur masquée par des points.',
        sinon: 'Vérifiez le nom : la moindre différence de casse ou d’espace empêche votre site de la trouver.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/cle-api/variables-vercel.png',
        alt: 'L’écran des variables d’environnement d’un projet Vercel.',
        service: 'Vercel',
        verifieLe: '2026-07-27',
        reperes: [
          { label: 'Le champ du nom de la variable', position: 'gauche' },
          { label: 'Le champ de la valeur, masquée après enregistrement', position: 'droite' },
        ],
      },
      pannes: [],
    },
    {
      id: 'redeployer',
      titre: 'Redéployer pour que votre site voie la clé',
      lieu: 'navigateur',
      service: 'Vercel',
      danger: 'Ajouter la variable ne suffit pas. Sans ce redéploiement, votre site continuera de ne pas fonctionner et vous croirez vous être trompé.',
      pourquoi: 'Un site en ligne ne relit ses réglages qu’au moment où il est reconstruit.',
      gestes: [
        { action: 'Ouvrez l’onglet des déploiements de votre projet.', ancre: 'Deployments' },
        { action: 'Sur le déploiement le plus récent, choisissez de le refaire.', ancre: 'Redeploy' },
      ],
      preuve: {
        visible: 'Un nouveau déploiement réussit, et votre site répond aux questions.',
        sinon: 'Vérifiez le nom de la variable dans Vercel, caractère par caractère, puis redéployez à nouveau.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/cle-api/redeployer.png',
        alt: 'Le menu d’un déploiement Vercel, avec l’option de le refaire.',
        service: 'Vercel',
        verifieLe: '2026-07-27',
        reperes: [{ label: 'L’option de redéploiement, dans le menu du déploiement', position: 'droite' }],
      },
      pannes: [
        {
          id: 'variable-ajoutee-mais-site-casse',
          frequente: true,
          symptome: 'J’ai ajouté la variable mais mon site ne marche toujours pas',
          cause: 'Le site tourne encore sur sa version précédente, construite avant l’ajout de la variable.',
          reparation: [
            { action: 'Ouvrez l’onglet des déploiements.', ancre: 'Deployments' },
            { action: 'Refaites le dernier déploiement.', ancre: 'Redeploy' },
          ],
          preuve: 'Le nouveau déploiement réussit et votre site répond.',
        },
      ],
    },
  ],
};
```

- [ ] **Step 2: Enregistrer le guide et afficher le filtre**

Dans `src/parcours/manifests/index.ts` :

```ts
import { CLE_API } from './cle-api';

export const GUIDES: Guide[] = [NAISSANCE_PROJET, MISE_EN_LIGNE, CLE_API];
```

`GuideShell.astro` affiche déjà `guide.pourQui` : vérifier à l'écran que le filtre apparaît bien en tête du guide 3.

- [ ] **Step 3: Afficher les blocs `fichiers`**

Dans `src/components/demarrer/Etape.astro`, ajouter avant le bloc des preuves :

```astro
{etape.fichiers && (
  <div class="etape-fichiers">
    {etape.fichiers.map((fichier) => (
      <figure class="fichier">
        <figcaption>{fichier.chemin}</figcaption>
        <pre data-copiable>{fichier.contenu}</pre>
        {fichier.commentaire && <p class="fichier-commentaire">{fichier.commentaire}</p>}
      </figure>
    ))}
  </div>
)}
```

- [ ] **Step 4: Mettre à jour les compteurs**

Dans `tests/parcours-content.test.ts` : `GUIDES.length` vaut `3`, le total d'étapes `20`, le total de pannes `13`.

- [ ] **Step 5: Vérifier**

Run: `npm run parcours:check && npx tsx --test tests/parcours-content.test.ts && npm run build`
Expected: `Guides valides : 3 guides, 20 étapes, 13 pannes, 6 outils.`

Vérifier en particulier que le validateur ne signale **aucune** clé dans un `aClaude` : le message de l'étape `preparer-le-coffre` doit passer, puisqu'il ne contient que le nom de la variable.

- [ ] **Step 6: Commit**

```bash
git add src/parcours/manifests src/components/demarrer/Etape.astro tests/parcours-content.test.ts public/demarrer/cle-api
git commit -m "content: guide donner une cle api a votre projet"
```

---

### Task 15: Contrôle Playwright de lisibilité sans JavaScript

**Files:**
- Create: `scripts/qa-demarrer.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: le site construit dans `dist/`.
- Produces: `npm run qa:demarrer`.

C'est le seul point non testable en unitaire, et c'est le plus important : un participant sur un réseau lent ou un navigateur restrictif doit pouvoir lire la page entière.

- [ ] **Step 1: Écrire le script**

`scripts/qa-demarrer.mjs` :

```js
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };

const server = createServer(async (request, response) => {
  let cible = path.join(distDir, decodeURI(request.url.split('?')[0]));
  try {
    if ((await stat(cible)).isDirectory()) cible = path.join(cible, 'index.html');
  } catch {
    response.writeHead(404).end();
    return;
  }
  try {
    const corps = await readFile(cible);
    response.writeHead(200, { 'content-type': TYPES[path.extname(cible)] ?? 'application/octet-stream' });
    response.end(corps);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const navigateur = await chromium.launch();
const contexte = await navigateur.newContext({ javaScriptEnabled: false });
const page = await contexte.newPage();

const echecs = [];
const attendu = async (condition, message) => {
  if (!(await condition)) echecs.push(message);
};

for (const chemin of ['/demarrer/', '/demarrer/naissance-projet/', '/demarrer/mise-en-ligne/', '/demarrer/cle-api/']) {
  await page.goto(`${base}${chemin}`);
  await attendu(page.locator('h1').isVisible(), `${chemin} : aucun titre principal visible sans JavaScript.`);
  const texte = await page.locator('main').innerText();
  if (texte.trim().length < 400) {
    echecs.push(`${chemin} : contenu trop court sans JavaScript (${texte.trim().length} caractères).`);
  }
  for (const mot of ['terminal', 'ligne de commande']) {
    if (texte.toLowerCase().includes(mot)) echecs.push(`${chemin} : vocabulaire interdit « ${mot} » rendu à l’écran.`);
  }
}

await page.goto(`${base}/demarrer/naissance-projet/`);
const gestes = await page.locator('.etape-gestes li').count();
await attendu(Promise.resolve(gestes >= 16), `Les gestes ne sont pas rendus sans JavaScript (${gestes} trouvés).`);
const pannes = await page.locator('details.panne').count();
await attendu(Promise.resolve(pannes === 7), `Les pannes du guide 1 ne sont pas toutes rendues (${pannes} trouvées).`);

await navigateur.close();
server.close();

if (echecs.length > 0) {
  for (const echec of echecs) console.error(echec);
  process.exit(1);
}
console.log('QA demarrer : les quatre pages sont lisibles sans JavaScript.');
```

- [ ] **Step 2: Ajouter le script npm**

```json
"qa:demarrer": "node scripts/qa-demarrer.mjs",
```

- [ ] **Step 3: Vérifier**

Run: `npm run build && npm run qa:demarrer`
Expected: `QA demarrer : les quatre pages sont lisibles sans JavaScript.`

- [ ] **Step 4: Commit**

```bash
git add scripts/qa-demarrer.mjs package.json
git commit -m "test: qa de lisibilite sans javascript sur demarrer"
```

---

### Task 16: Raccords, navigation et documentation

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/content/briques/d-ecosysteme/d2-bis-setup-github-vercel.mdx`
- Modify: `src/content/briques/b-interfaces/b4-bis-projet-local.mdx`
- Modify: `src/content/briques/d-ecosysteme/d3-frontend-deploiement.mdx`
- Modify: `src/content/briques/d-ecosysteme/d4-securite.mdx`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: les routes `/demarrer/`, `/demarrer/naissance-projet/`, `/demarrer/mise-en-ligne/`, `/demarrer/cle-api/`.
- Produces: rien de programmatique.

- [ ] **Step 1: Ajouter l'entrée de navigation**

Dans `src/layouts/BaseLayout.astro`, le frontmatter calcule déjà `isHome`, `isBricks`, `isAtelier`, `isPresentation`. Ajouter sur le même modèle :

```astro
const isDemarrer = pathname.startsWith('/demarrer');
```

(Reprendre exactement la forme des variables voisines dans le fichier.)

Puis dans la liste de navigation, après l'entrée Accueil :

```astro
<li><a href="/demarrer/" aria-current={isDemarrer ? 'page' : undefined}>Démarrer</a></li>
```

- [ ] **Step 2: Appeler la surface depuis l'accueil**

Dans `src/pages/index.astro`, ajouter un lien secondaire dans `.hero-actions`, après le bouton principal :

```astro
<a class="text-link" href="/demarrer/">Bloqué sur une manipulation ? Les gestes en images</a>
```

- [ ] **Step 3: Ajouter les quatre raccords dans les briques**

Dans `d2-bis-setup-github-vercel.mdx`, à la fin de la section `## Cap` :

```markdown
Les gestes en images, écran par écran : [Démarrer, créer un projet et le mettre sur GitHub](/demarrer/naissance-projet/).
```

Dans `b4-bis-projet-local.mdx`, à la fin de la section `## Cap` :

```markdown
Si le poste n'est pas prêt du tout, reprenez depuis le début : [Démarrer, créer un projet et le mettre sur GitHub](/demarrer/naissance-projet/).
```

Dans `d3-frontend-deploiement.mdx`, à la fin de la section `## Cap` :

```markdown
Le déploiement geste par geste, en images : [Démarrer, mettre votre site en ligne](/demarrer/mise-en-ligne/).
```

Dans `d4-securite.mdx`, juste après la règle 1 du `## Concept durable` :

```markdown
La règle est ici, le geste est là : [Démarrer, donner une clé à votre projet](/demarrer/cle-api/).
```

- [ ] **Step 4: Mettre à jour CLAUDE.md**

Dans la section « Les trois surfaces du site (Astro 7) », remplacer le titre par « Les quatre surfaces du site (Astro 7) » et ajouter en fin de liste :

```markdown
- `/demarrer` : la carte des outils et trois guides de gestes concrets, pilotés
  par les manifestes TypeScript (`src/parcours/manifests/`), validés par
  `npm run parcours:check`. Public non technique : aucun terminal, aucune
  commande à taper, Claude fait la plomberie. Registre non scolaire : pas de
  durée, pas d'objectif, pas de mission.
```

Dans la section « Workflow », ajouter après le point 3 :

```markdown
4. Toute étape ou panne ajoutée à un guide `/demarrer` fait évoluer les
   compteurs figés de `tests/parcours-content.test.ts`.
```

Renuméroter les points suivants, et ajouter `npm run parcours:check` à la liste des commandes du point « Avant de fusionner ».

- [ ] **Step 5: Vérifier l'ensemble**

Run: `npm test && npm run content:check && npm run parcours:check && npm run presentation:check && npm run build && npm run qa:demarrer`
Expected: tout au vert. Le test `presentation-built-navigation` peut échouer en EPERM/EXDEV dans un environnement sandbox : faux positif documenté dans CLAUDE.md.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro src/content/briques CLAUDE.md
git commit -m "content: raccords des briques vers la surface demarrer"
```

---

## Auto-revue du plan

**Couverture du spec.** Les sections du spec et leur tâche : registre non scolaire (contraintes globales et règle 9 en Task 3), principe « Claude fait » (Task 12, champ `aClaude`), carte des outils (Tasks 4 et 11), guide 1 (Task 12), guide 2 (Task 13), guide 3 (Task 14), modèle (Task 1), validation (Tasks 2 et 3, plus les contrôles disque en Task 4), routes (Tasks 5 et 11), repérage (Task 10), pannes et ancres (Task 9), visuels (Tasks 5 à 8), copie (Task 6 pour `aClaude`, Task 14 pour `fichiers`), tests (répartis), raccords et CLAUDE.md (Task 16).

**Écarts assumés par rapport au spec.**

1. Le spec évoquait un composant `Visuel.astro` implicite ; le plan l'explicite comme aiguillage, ce qui évite quatre conditions dans `Etape.astro`.
2. Le spec plaçait la vérification d'existence des fichiers dans le validateur ; le plan la déplace dans `check-parcours.ts`, pour que le validateur reste pur et testable sans disque.
3. Le spec ne mentionnait pas `CLE_PATTERN` ; le plan ajoute cette règle, conséquence directe de la décision « la clé ne passe jamais par la conversation ».
4. Les repères de capture sont rendus en légende numérotée et non en surimpression. Une surimpression positionnée en pourcentage devient fausse dès que la capture est reprise, ce qui contredirait la robustesse recherchée.

**Cohérence des types.** `Guide`, `Etape`, `Panne`, `Visuel`, `Outil`, `Cas` portent les mêmes noms de propriétés de la Task 1 à la Task 16. `validateGuides` prend `(guides, aujourdHui?)` partout après la Task 3. `cheminGuide` est utilisée par les Tasks 5, 11 et 12. `libelleLieu` et `changementsDeLieu` sont introduites en Task 10 et remplacent les calculs locaux de la Task 5, avec la suppression explicite du code dupliqué.

**Compteurs figés, progression :** Task 4 (1 / 1 / 0), Task 12 (1 / 8 / 7), Task 13 (2 / 14 / 10), Task 14 (3 / 20 / 13).
