---
name: creer-brique
description: Écrit ou réécrit une brique pédagogique du site (fichier MDX sous src/content/briques/) au format court de la session 2, avec ses visuels fidèles à l'application Codex. À utiliser pour toute création, refonte ou relecture d'une brique, ou d'un visuel de brique sous src/components/briques/.
---

# Créer une brique

Une brique est une page que des débutants complets regardent pendant qu'un
formateur parle et fait une démonstration. Elle doit se comprendre en la
regardant, pas en la lisant. La référence à imiter est
`src/content/briques/b-prendre-en-main/b2-Codex.mdx` : lisez-la, ainsi que
ses composants, avant d'écrire quoi que ce soit.

## À qui la page parle

- Des personnes qui n'ont jamais codé. Elles ne connaissent ni le terminal, ni
  Git, ni le nom des technologies.
- Un seul outil : l'application Codex de bureau, onglets Chat et Code, en
  session locale. Jamais VS Code, jamais ChatGPT ni Codex, jamais de commande à
  taper : Codex fait la plomberie.
- Chacun construit son propre projet, de n'importe quel type, et le poursuivra
  chez lui. Pas d'exercice imposé, pas de projet prédéterminé, pas de livrable.

## Le format

Trois rubriques de niveau 2, dans cet ordre, exigées par la validation
(`SHORT_FORMAT_HEADINGS` dans `src/content/brick-model.ts`) :

1. `## L'essentiel` : une à trois phrases, puis **le visuel principal tout de
   suite**. Si une phrase répète ce que le visuel montre, supprimez la phrase.
2. `## À essayer` : les gestes concrets, numérotés en gras. Toute phrase à
   donner à Codex passe par `<PromptCopy>`. Une brique purement conceptuelle
   peut n'avoir qu'un geste, mais elle en a un.
3. `## Comprendre` : les idées, une par vignette `<div class="idea">` (titre
   `h3`, deux phrases au plus, un visuel à côté). Une idée sans image possible
   tient en un paragraphe de deux phrases.

Puis, repliés (`<details class="hint">`, balises sur leurs propres lignes,
contenu en `<p>` indentés) :

- « Pour aller plus loin » : le détail utile et le lien vers la documentation
  officielle.
- « Notes formateur » : la démonstration à faire en direct, ce qu'il faut
  montrer, les pièges fréquents.

L'action passe avant l'explication : « À essayer » vient avant « Comprendre ».

Cibles : moins de 250 mots visibles sans déplier, trois à cinq visuels, deux
visuels animés au plus par page (au-delà ils se font concurrence).

Les anciennes rubriques disparaissent : Cap, Concept durable, Pratique guidée,
Mission commune, Livrable, Défis avancés, Variantes, Dépannage, Ressources,
Ouverture. Ce qui y était utile va dans une vignette, dans un geste, ou dans un
bloc replié. Le reste est supprimé sans regret.

## Trier le contenu existant

Pour chaque passage de l'ancienne brique, une seule question : qu'est-ce que
la personne en fera samedi, devant son projet ?

- Rien : supprimer.
- Elle doit le reconnaître à l'écran : maquette de l'application.
- Elle doit comprendre un mécanisme : schéma ou animation à étapes.
- Elle doit le faire : geste dans « À essayer », avec sa phrase à copier.
- Seul le formateur en a besoin : « Notes formateur ».

Le périmètre de chaque brique (gardée, réécrite, recentrée) est fixé par le
tableau du document `docs/superpowers/specs/2026-11-20-refonte-session-2-design.md`.

## Les visuels

Règle de Matthieu : les visuels qui montrent l'application doivent ressembler à
la vraie application Codex. Les schémas de concepts suivent le style du site
(papier, encre, blocs à ombre décalée, couleur de famille `--family-accent`).

Pièces communes, dans `src/components/briques/` :

| Pièce | Rôle |
| --- | --- |
| `ClaudeApp.astro` | La fenêtre de l'application (thème sombre). Props : `mode` (`chat` ou `code`), `title`, `sidebar`, `folder`, `session`. Le contenu se glisse dedans. |
| `Composer.astro` | La zone de saisie de l'onglet Code avec sa ligne de réglages. Props : `placeholder`, `folder`. |
| `Icon.astro` | Icônes au trait. Pour en ajouter une, ajouter une ligne à `SHAPES`. |
| `StepRail.astro` | Boutons d'étape, phrase par étape, bouton Rejouer. Prop : `steps` (`label`, `text`). Deux à quatre étapes. |
| `PromptCopy.astro` | Une phrase à donner à Codex, avec son bouton Copier. |
| `claude-app.css` | Toutes les classes `ca-*` : conversation (`ca-thread`, `ca-you`, `ca-Codex`, `ca-say`, `ca-tool`), permission (`ca-ask`), panneau de droite (`ca-split`, `ca-pane`, `ca-pane-bar`), repères (`ca-pin`, `ca-legend`), vignette (`idea`). |

Modèles à copier selon le besoin :

- Animation à étapes dans l'application : `ClaudeCodeLoop.astro`,
  `ClaudeMemory.astro`. La figure porte `data-stepper` et `data-step` (valeur
  initiale : la dernière étape, pour que la page soit complète sans
  JavaScript). Le contenu apparaît avec les classes `from-2`, `from-3`,
  `from-4`, `only-1`, `only-2`, `until-2`.
- « Où cliquer » : `OpenFolder.astro` (maquette fixe, repères numérotés
  `ca-pin` posés dessus, légende `ca-legend`). Le texte de chaque `li` de la
  légende est enveloppé dans un `span`.
- Comparaison : `ChatVsCode.astro` (deux petites fenêtres côte à côte).
- Gros plan sur un élément : `PermissionCard.astro`.

Règles de fabrication :

- Un visuel nouveau est un composant Astro dans `src/components/briques/`, avec
  un `<style>` local et un préfixe de classe qui lui est propre. Ne pas
  modifier `claude-app.css` pour un besoin d'un seul visuel.
- Une figure est `<figure class="ca-figure …">`. Ajouter `is-narrow` quand elle
  vit dans une vignette ou doit rester à la largeur du texte.
- La maquette porte `aria-hidden="true"` : le sens passe par la légende, les
  phrases d'étape ou le texte de la vignette.
- Les libellés de l'application restent en anglais, comme dans l'application
  des formateurs (New, Search, Artifacts, Scheduled, Plugins, Local, Preview,
  Allow once). Ce que la personne écrit et ce que Codex répond est en
  français.
- Ne montrer que ce qui a été vu sur une capture ou lu dans la documentation
  officielle. Ce qui est reconstitué se signale dans le compte rendu, pas dans
  la page.
- Les styles du site débordent dans les maquettes (`.brick-content p`, `li`,
  `code`) : préfixer assez les sélecteurs, puis vérifier sur capture.
- Animations : uniquement pour montrer ce qui change. Elles démarrent à
  l'entrée dans l'écran (c'est `stepper.ts` qui s'en charge) et respectent
  `prefers-reduced-motion`.
- Exemple fil rouge quand il en faut un : le site « Recettes de famille », dans
  le dossier `mes-recettes`.
- Avant de créer un visuel, regarder si un visuel de slide existe déjà pour la
  même idée (`src/components/presentation/visuals/`) : son idée se reprend,
  son code rarement (il est taillé pour une slide plein écran).

## Règles d'écriture

- Jamais le caractère tiret cadratin : deux-points, virgule ou parenthèses.
- Vouvoiement. Phrases courtes. Aucun jargon non expliqué par l'image voisine.
- Pas de méta-commentaire (« cette brique sert à »), pas de supposition d'âge
  ou de profil, pas de registre scolaire (objectif, mission, livrable).
- Guillemets français avec espaces insécables. Dans `<PromptCopy>`, pas de
  guillemets : la phrase seule.
- Contenu durable : pas de prix, pas de numéro de version. Les liens pointent
  vers la documentation officielle.
- Le frontmatter garde son schéma : mettre à jour `title`, `durationMinutes`,
  `learningObjective`, `expectedOutcome`, `prerequisites` ; `status: a-relire`.

## Vérifier avant de dire que c'est fait

Toutes les commandes avec `PATH=/opt/homebrew/bin:$PATH` (Node 22.12 minimum).

1. `npm run content:check` : la brique est valide.
2. Captures, sur un serveur déjà lancé (`npx astro dev --port 4392`, ou
   `npx astro preview` après un build) :
   `node scripts/brique-shot.mjs <id> <dossier-de-sortie> [port]`
   produit la page entière sur ordinateur et sur téléphone, plus chaque étape
   de chaque visuel animé.
3. **Regarder les captures.** Chercher : texte invisible ou mal contrasté dans
   une maquette, légende cassée en colonnes, repère qui ne pointe pas sur le
   bon élément, débordement horizontal sur téléphone, visuel vide à une étape.
4. Chercher le tiret cadratin (U+2014) dans chaque fichier touché : zéro.
5. Compter les mots visibles : moins de 250 hors blocs repliés.
6. Si un test fige l'ancien contenu de la brique, le mettre à jour ou le
   retirer, par une modification ciblée.
7. `npx tsx --test tests/*.test.ts` et `npm run build` avant de fusionner.

## Ajouter une brique

Elle s'inscrit dans `EXPECTED_IMPORTED_BRICK_IDS` (`src/content/brick-files.ts`)
et dans `DRAFTED_BRICK_IDS` (`tests/brick-inventory.test.ts`). Les champs
`order` de toutes les briques restent une suite sans trou. Les totaux affichés
sur le site dérivent de `BRICK_COUNT`.
