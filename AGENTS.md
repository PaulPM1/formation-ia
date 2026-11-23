# Contexte du projet formation-ia

Source canonique du curriculum « Les briques du Vibe Coding » : une formation
IA d'un week-end (samedi matin au dimanche) donnée par Matthieu et Paul à des
personnes non techniques, parfois totalement novices. But : comprendre l'IA
moderne, prendre Claude en main, et lancer son propre projet, de n'importe
quel type, qu'on continue ensuite chez soi.

## Les décisions de la session 2

- Un seul outil : l'application Claude de bureau, onglets Chat et Code,
  sessions locales par défaut. Ni VS Code, ni OpenAI, ni Codex, ni BMAD.
- Aucun projet imposé, aucun exercice imposé : chacun construit son idée. Le
  projet n'a pas à être fini pendant le week-end.
- La personne ne tape aucune commande : Claude installe Git, Node.js et
  GitHub CLI, relie GitHub et sauvegarde. Toute l'installation se fait sur
  place le samedi matin. Chez elle, elle n'a fait que trois choses :
  installer l'application, prendre l'abonnement, créer un compte GitHub.
- Le skill `setup-projet` (`kits/kit-projet/`) cadre l'idée par interview et
  écrit les fichiers de suivi. Il est servi en zip par le site
  (`scripts/skill-zip.mjs`, lancé avant chaque build).
- Fiche formateur de l'installation et des pannes :
  `docs/atelier/installation-depannage.md`.

## Les quatre surfaces du site (Astro 7)

- `/briques` : 18 fiches MDX (`src/content/briques/`, familles A à E), au
  format court : L'essentiel, À essayer, Comprendre, puis des sections
  repliées. Peu de texte, des visuels fidèles à l'application Claude
  (`src/components/briques/`). Validées par `npm run content:check`.
- `/presenter` : 95 slides, un deck par brique, dans l'ordre de la matinée
  (`src/presentation/manifests/`). Cinq formes de slide : titre, visuel, quiz,
  tri, démonstration. Les slides réutilisent les visuels des briques par leur
  nom de fichier, et chaque visuel s'ajuste seul à la taille de l'écran.
  Validées par `npm run presentation:check`.
- `/atelier` : une seule page, « C'est le moment de construire », cinq étapes
  illustrées par les visuels des briques (`src/pages/atelier/index.astro`).
- `/faq` : des questions courtes par thème (`src/parcours/questions.ts`), et
  deux guides écran par écran, mise en ligne et clé API
  (`src/parcours/manifests/`), validés par `npm run parcours:check`. Aucun
  terminal, aucune commande à taper. Registre non scolaire : pas de durée,
  pas d'objectif, pas de mission.

Les retours d'expérience des participants ne vivent pas ici : ils ont leur
propre dépôt, `retours-camp`, indépendant de ce site.

## Règles éditoriales (obligatoires)

- Jamais le caractère tiret cadratin : deux-points, virgules ou parenthèses.
- Peu de texte, beaucoup de visuel : une idée par écran, une phrase plutôt
  qu'un paragraphe, une phrase à copier plutôt qu'une explication.
- Le site parle au lecteur (vouvoiement), sans méta-commentaire (« ce n'est
  pas un cours », « cette brique sert à ») et sans supposition d'âge ou de
  profil. Les Notes formateur s'adressent à un formateur générique.
- Les maquettes ressemblent à la vraie application Claude, pas au style du
  site.
- Contenu durable : concepts et méthode, pas de prix ni de détails d'interface
  périssables. Liens vers la documentation officielle.
- Notion est abandonné comme source : ce repo fait foi.

## Workflow

1. Une brique se crée ou se réécrit avec le skill `creer-brique`
   (`.claude/skills/creer-brique/`), puis se vérifie sur captures :
   `node scripts/brique-shot.mjs <id> <dossier>`.
2. Toute brique ajoutée s'inscrit dans `EXPECTED_IMPORTED_BRICK_IDS`
   (`src/content/brick-files.ts`) et dans `DRAFTED_BRICK_IDS`
   (`tests/brick-inventory.test.ts`). Le total affiché sur le site suit seul
   (`BRICK_COUNT`).
3. Une slide se vérifie sur captures : `node scripts/slide-shot.mjs <brique>
   <dossier>`. Les règles de forme (titre court, trois puces au plus, un jeu
   par famille) sont dans `tests/presentation-decks.test.ts`.
4. Toute étape ou panne ajoutée à un guide `/faq` fait évoluer les compteurs
   figés de `tests/parcours-content.test.ts`. Une question courte respecte
   `tests/faq-questions.test.ts`.
5. Avant de fusionner : `npx tsx --test tests/*.test.ts`,
   `npm run content:check`, `npm run parcours:check`,
   `npm run presentation:check`, `npm run build`.

## Notes d'environnement

- Astro 7 demande une version récente de Node.js : avec une version trop
  ancienne, le build échoue dès le démarrage.
- Le test `presentation-built-navigation` échoue avec EPERM/EXDEV dans
  certains environnements sandbox (build vers un dossier temporaire sur un
  autre système de fichiers) : c'est un faux positif, il passe en local.
