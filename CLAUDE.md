# Contexte du projet formation-ia

Source canonique du curriculum « Les briques du Vibe Coding » : une formation
IA de 2,5 jours (vendredi après-midi au dimanche 17 h) donnée par Matthieu et
Paul à des élèves entrant en études supérieures (18-19 ans) et des adultes.
But : repartir avec une vue d'ensemble de l'IA moderne, les briques pour mener
ses propres projets, et un assistant personnel construit pendant l'atelier.

## Les quatre surfaces du site (Astro 7)

- `/briques` : 22 fiches pédagogiques MDX (`src/content/briques/`, familles A
  à E), documentation canonique. Frontmatter strict validé par
  `npm run content:check`.
- `/presenter` : 83 slides pilotées par les manifestes TypeScript
  (`src/presentation/manifests/`), scènes réutilisables, validées par
  `npm run presentation:check`.
- `/atelier` : le TP fil rouge « Construis ton assistant personnel », 5
  plateaux chronologiques (`src/content/atelier/`).
- `/faq` : « Questions fréquentes », la carte des outils et trois guides de
  gestes concrets, pilotés par les manifestes TypeScript
  (`src/parcours/manifests/`), validés par `npm run parcours:check`. Public
  non technique : aucun terminal, aucune commande à taper, Claude fait la
  plomberie. Registre non scolaire : pas de durée, pas d'objectif, pas de
  mission.

Les retours d'expérience des participants ne vivent pas ici : ils ont leur
propre dépôt, `retours-camp`, indépendant de ce site.

## État d'avancement

- Briques A1 à C3 : rédigées par Paul, statut `a-relire`.
- Briques D1 à E4 : rédigées par Matthieu, statut `a-relire`.
- Bloc F retiré : les gabarits vides F1 et F2 ont été supprimés, leur contenu
  vivant désormais dans `/atelier`. Les 22 briques sont toutes rédigées.
- Slides : blocs A à E complets, 22 decks et 83 slides, un deck par brique.
- Prototype fil rouge : plan dans `docs/atelier/prototype-second-brain.md`,
  à construire par Matthieu (produit aussi les kits du TP : prompt
  d'interview, inbox de tri, skill capture, template dashboard).

## Fil rouge : l'assistant à cinq organes

Identité (CLAUDE.md, P1) → Cerveau (mémoire structurée, P2) → Savoir-faire
(skills, P3) → Sens (MCP, démo) → Visage (dashboard déployé, P4). Niveau
socle : P1+P2. Principe du TP : on prémâche la saisie, on garde la décision.

## Règles éditoriales (obligatoires)

- Jamais le caractère « — » (tiret cadratin) : deux-points, virgules ou
  parenthèses.
- Le corps des briques et de l'atelier parle au lecteur (vouvoiement), sans
  méta-commentaire (« ce n'est pas un cours », « cette brique sert à ») et
  sans supposition d'âge ou de profil. Les Notes formateur s'adressent à un
  formateur générique.
- Contenu durable : concepts et méthode, pas de prix ni de détails d'interface
  périssables. Liens vers la documentation officielle.
- Notion est abandonné comme source : ce repo fait foi.

## Workflow

1. Prendre une brique : `owner`, `status: en-cours`, rédiger, renseigner
   `learningObjective` et `expectedOutcome`, passer `a-relire`.
2. Toute brique ajoutée s'inscrit dans `EXPECTED_IMPORTED_BRICK_IDS`
   (`src/content/brick-files.ts`), dans `VALID_BRICK_IDS`
   (`src/content/projet-model.ts`) et dans `DRAFTED_BRICK_IDS`
   (`tests/brick-inventory.test.ts`), et fait évoluer le total affiché sur
   l'accueil, le catalogue, la navigation et la page 404.
3. Toute slide ajoutée fait évoluer les compteurs figés (tests
   `presentation-*` et scripts `qa-*`).
4. Toute étape ou panne ajoutée à un guide `/faq` fait évoluer les
   compteurs figés de `tests/parcours-content.test.ts`.
5. Avant de fusionner : `npm test`, `npm run content:check`,
   `npm run parcours:check`, `npm run presentation:check`, `npm run build`.
6. Les slides suivent le skill `.agents/skills/slide-visual-director/`.

## Notes d'environnement

Le test `presentation-built-navigation` échoue avec EPERM/EXDEV dans certains
environnements sandbox (build vers un dossier temporaire sur un autre
système de fichiers) : c'est un faux positif, il passe en local.
