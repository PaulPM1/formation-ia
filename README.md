# Formation IA — briques pédagogiques

Ce dépôt est la source canonique du curriculum « Les briques du Vibe Coding ».
La page Notion d’origine a uniquement servi à initialiser l’inventaire : les
explications pédagogiques n’ont pas été importées.

## Démarrer

Prérequis : Node.js 22.12 ou supérieur.

```bash
npm install
npm run dev
```

L’inventaire éditorial est disponible sur `http://localhost:4321/briques`.

Commandes utiles :

```bash
npm test               # tests du modèle, de l’inventaire et des vues
npm run content:check  # validation éditoriale des fichiers MDX
npm run presentation:check # validation des slides et de leurs liens wiki
npm run typecheck          # contrat TypeScript et composants Astro
npm run build          # validations puis génération du site statique
```

## Organisation du contenu

Chaque brique possède son propre fichier dans `src/content/briques/`, regroupé
par famille A à F. Le frontmatter contient l’identité, l’ordre, la priorité, la
durée, le type, le suivi éditorial et les prérequis de la brique.

Le corps MDX fournit les rubriques à compléter. Les commentaires `{/* … */}`
sont des indications réservées aux auteurs et ne sont pas visibles sur le site.
Il ne faut pas supprimer un titre de rubrique : `npm run content:check` vérifie
la structure commune et les rubriques propres aux setups, démonstrations,
ateliers et restitutions.

### Workflow Paul / Matthieu

1. Choisir une brique depuis `/briques`.
2. Remplacer `owner: a-attribuer` par `paul` ou `matthieu`.
3. Passer le statut à `en-cours` et rédiger dans le fichier MDX correspondant.
4. Renseigner `learningObjective` et `expectedOutcome` avant de passer à
   `a-relire`.
5. Faire relire la brique, corriger les retours, puis utiliser `validee`.
6. Exécuter `npm run content:check` et `npm run build` avant de fusionner.

Statuts autorisés : `a-rediger`, `en-cours`, `a-relire`, `validee`.

## Prolonger les slides — blocs D à F

Le mode formateur est disponible sur `/presenter/`. Pour conserver la même
structure et le même langage visuel quand Mathieu ajoute les blocs D, E et F :

1. Invoquer `$slide-visual-director` avant de concevoir ou de modifier une
   slide. Le nombre de slides est dicté par la compréhension du concept, jamais
   par un quota automatique ; chaque slide doit rester claire à survoler.
2. Ajouter ou modifier le manifeste de la famille dans
   `src/presentation/manifests/`. Une slide déclare sa thèse, son support, son
   visuel, ses liens, ses notes formateur et sa description accessible.
3. Réutiliser un composant visuel existant ou créer celui retenu avec le skill
   dans `src/components/presentation/visuals/`, puis l’enregistrer dans
   `VisualRegistry.astro`. Le visuel porte l’explication ; le texte la complète.
4. Ajouter seulement des états et interactions qui rendent le concept plus
   compréhensible. Le premier état doit déjà expliquer la slide sans JavaScript.
5. Construire les liens avec `wikiLink` ou `externalLink` depuis
   `src/presentation/presentation-links.ts`. Les liens wiki doivent cibler la
   brique et, si utile, son ancre exacte. Les ressources et téléchargements
   pointent vers les sites officiels ; le composant commun les ouvre dans un
   nouvel onglet avec `target="_blank"` et `rel="noopener noreferrer"`.
6. Contrôler au clavier les boutons, le sommaire, les notes, les liens et les
   états finaux. Vérifier aussi `prefers-reduced-motion`, le rendu sans
   JavaScript et l’absence de débordement sur mobile et au projecteur.
7. Exécuter les contrôles avant de fusionner :

   ```bash
   npm test
   npm run presentation:check
   npm run typecheck
   npm run build
   npm run qa:presenter
   npm run qa:block-b
   npm run qa:block-b-wiki
   npm run qa:block-c
   ```

`presentation:check` reste local : il valide les 110 slides actuellement,
ainsi que l’origine canonique du wiki, les identifiants de briques
et les ancres produites par le moteur Markdown du site, sans requête réseau.

`qa:block-b-wiki` vérifie les deux voies des fiches du Bloc B, leur persistance
et leur repli sans JavaScript. Il contrôle aussi que le brief B3 est traité
localement dans le navigateur, sans requête réseau après son chargement.

## Ajouter une brique

1. Copier un fichier du même `type` dans le bon dossier de famille.
2. Choisir un identifiant stable au format `a1` ou `b4-bis` et un `order`
   unique. Les ordres doivent former une suite continue à partir de 1.
3. Conserver toutes les rubriques du gabarit et adapter le frontmatter.
4. Ajouter l’identifiant au test d’inventaire si la nouvelle brique fait partie
   du curriculum retenu.
5. Lancer `npm test`, `npm run content:check` et `npm run build`.

Le rendu de `/briques` et des fiches `/briques/<id>` est généré depuis la
collection : aucune page Astro ne doit être ajoutée pour une nouvelle brique.
