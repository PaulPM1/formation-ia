# Contexte du projet formation-ia

Source canonique du curriculum « Les briques du Vibe Coding » : une formation
IA de 2,5 jours (vendredi après-midi au dimanche 17 h) donnée par Matthieu et
Paul à des élèves entrant en études supérieures (18-19 ans) et des adultes.
But : repartir avec une vue d'ensemble de l'IA moderne, les briques pour mener
ses propres projets, et un assistant personnel construit pendant l'atelier.

## Les quatre surfaces du site (Astro 7)

- `/briques` : 24 fiches pédagogiques MDX (`src/content/briques/`, familles A
  à F), documentation canonique. Frontmatter strict validé par
  `npm run content:check`.
- `/presenter` : 105 slides pilotées par les manifestes TypeScript
  (`src/presentation/manifests/`), scènes réutilisables, validées par
  `npm run presentation:check`.
- `/atelier` : le TP fil rouge « Construis ton assistant personnel », 5
  plateaux chronologiques (`src/content/atelier/`).
- `/demarrer` : la carte des outils et trois guides de gestes concrets, pilotés
  par les manifestes TypeScript (`src/parcours/manifests/`), validés par
  `npm run parcours:check`. Public non technique : aucun terminal, aucune
  commande à taper, Claude fait la plomberie. Registre non scolaire : pas de
  durée, pas d'objectif, pas de mission.

## État d'avancement

- Briques A1 à C3 : rédigées par Paul, statut `a-relire`.
- Briques D1 à E3 : rédigées par Matthieu, statut `a-relire`.
- F1 et F2 : gabarits vides ; F1 sera dérivée de l'onglet Atelier une fois le
  prototype validé.
- Slides : blocs A à E complets (105). Aucune slide F.
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
2. Toute brique rédigée s'ajoute à `DRAFTED_BRICK_IDS` dans
   `tests/brick-inventory.test.ts` (et le compteur de gabarits restants baisse).
3. Toute slide ajoutée fait évoluer les compteurs figés (tests
   `presentation-*` et scripts `qa-*`).
4. Toute étape ou panne ajoutée à un guide `/demarrer` fait évoluer les
   compteurs figés de `tests/parcours-content.test.ts`.
5. Avant de fusionner : `npm test`, `npm run content:check`,
   `npm run parcours:check`, `npm run presentation:check`, `npm run build`.
6. Les slides suivent le skill `.agents/skills/slide-visual-director/`.

## Notes d'environnement

Le test `presentation-built-navigation` échoue avec EPERM/EXDEV dans certains
environnements sandbox (build vers un dossier temporaire sur un autre
système de fichiers) : c'est un faux positif, il passe en local.
