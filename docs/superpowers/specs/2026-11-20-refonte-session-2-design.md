# Refonte pour la deuxième session : droit au build

Date : 2026-11-20. Auteur de la demande : Matthieu. Statut : validé par Matthieu le 2026-11-20.

## Pourquoi

La première session a montré cinq problèmes, rapportés par Matthieu :

1. Beaucoup de temps perdu à installer les machines (Mac, Windows, un iPad,
   des ordinateurs de travail sans droits d'installation, Node et npm).
2. La méthode BMAD était trop longue (35 à 40 minutes de questions) et trop
   complexe à installer : les participants répondaient à des questions au lieu
   de construire.
3. Les projets prédéterminés ne servaient à rien : chacun veut construire sa
   propre idée.
4. Les exercices pratiques du début (bloc B) ont laissé tout le monde confus :
   on ne voyait ni leur intérêt ni leur lien avec le développement.
5. La présentation et les briques étaient difficiles à suivre : trop de texte,
   pas assez de visuels.

Le public de la deuxième session a le même niveau : très novice, non
technique.

## Intention

Donner les bases en une matinée, puis construire. Samedi matin : théorie
essentielle. Samedi après-midi et dimanche entier : chacun construit son propre
projet avec Claude Code, dans l'application Claude.

## Décisions prises par Matthieu

- **Un seul outil : l'application Claude de bureau.** Plus de VS Code, plus de
  ChatGPT ni de Codex, plus de voie « Claude ou OpenAI ». Abonnement Claude
  payant imposé (celui à 20 euros suffit).
- **Les participants arrivent prêts** : ordinateur personnel de préférence (Mac
  ou Windows, pas de tablette), application installée et testée, compte GitHub
  créé. Un message de préparation leur est envoyé (déjà rédigé, hors dépôt).
  À l'arrivée, chacun a donc : l'application installée et un premier message
  envoyé, un abonnement actif, un compte GitHub, une idée de projet. Chacun
  n'a pas : de compte Vercel, de lien entre GitHub et Claude, ni Git ou Node
  installés. Ces trois points se règlent sur place et doivent être guidés.
- **Projets personnels uniquement.** Les projets prédéterminés disparaissent.
- **BMAD disparaît.** Il est remplacé par le skill `setup-projet` (déjà écrit,
  voir plus bas), qui cadre l'idée en une dizaine de minutes.
- **Les exercices du bloc B disparaissent**, remplacés par une prise en main de
  Claude où chacun obtient un résultat concret et visible.
- **Claude Code est le cœur de la formation** : c'est là que se passe tout le
  build.
- **Le déploiement est conservé** (GitHub et Vercel). Les participants n'ont
  pas besoin de comprendre Git en profondeur.
- **Le nombre de briques n'est pas un objectif** : seul l'intérêt du contenu
  compte.
- **Briques et slides moins textuelles** : visuels, animations, démonstrations.
  Les formateurs font des démonstrations en direct par-dessus. Matthieu délègue
  entièrement la production des visuels.
- **Les mods de Claude Code ne sont pas enseignés.**

## Le programme du samedi matin

L'ordre suit le menu de l'application Claude tel qu'il existe au 2026-11-20 :
deux onglets (Chat et Code), et dans Chat : New, Projects, Artifacts,
Scheduled, Design, Customize. Customize contient Skills, Connectors et Plugins.
La participante qui rouvre l'application chez elle retrouve le cours dans le
menu.

| Bloc | Contenu | Durée |
|---|---|---|
| 1. Comprendre | Ce qu'est un LLM ; ses erreurs et nos biais ; modèle et abonnement en version courte | 45 min |
| 2. Prendre Claude en main | Chat : un message, un fichier, une tâche (15 min) ; Artifacts : chacun obtient un petit visuel qui marche (10 min) ; Projects, en démonstration (5 min) ; onglet Code : ouvrir un dossier, demander, voir le résultat, le CLAUDE.md (30 min) | 60 min |
| 3. Étendre | Customize : skills et connecteurs MCP (20 min) ; Design, en démonstration (15 min) ; Scheduled, juste montré (5 min) | 40 min |
| 4. Le minimum pour construire | Dépôt, GitHub, mise en ligne, quatre règles de sécurité | 30 min |
| 5. La méthode | Gestion du contexte, puis cadrage : on enchaîne sur `setup-projet` | 30 min |

Total : environ 3 h 25 hors pauses. Si la théorie déborde, ce n'est pas grave.

## Ce que deviennent les 22 briques

Les lettres de famille sont conservées pour limiter les changements dans les
manifestes et les tests (choix de Claude, voir plus bas). Résultat : 18
briques.

| Famille | Brique | Sort |
|---|---|---|
| A Comprendre | a1 C'est quoi un LLM | gardée |
| | a2 Choisir la bonne solution IA | réécrite : les modes de Claude (conversation, artefact, Code, Design) au lieu de Claude contre OpenAI |
| | a3 Modèle et mode de paiement | gardée, raccourcie ; garde la distinction abonnement et clé API |
| | a4 Biais cognitifs | gardée |
| B Prendre Claude en main | b0, b1, b2, b3, b4, b4-bis | supprimées |
| | b1 (nouvelle) La conversation | message, fichier, tâche, artefact, Projects |
| | b2 (nouvelle) Claude Code | ouvrir un dossier, demander, voir, CLAUDE.md, session cloud ou locale |
| C Étendre | c1 Skills | gardée ; ajoute l'installation depuis Customize |
| | c2 MCP et API | gardée ; « connecteurs » comme mot d'entrée |
| | c3 Hooks et tâches planifiées | recentrée sur les tâches planifiées ; hooks en complément repliable ; hors matinée sauf 5 minutes |
| | c4 (nouvelle) Claude Design | démonstration |
| D Écosystème | d1 Lexique | réécrite sans IDE ni terminal |
| | d2 GitHub et versionnement | gardée |
| | d2-bis Setup GitHub et Vercel | réécrite : comptes créés avant de venir, Vercel relié en un clic |
| | d3 Front-end et déploiement | gardée |
| | d4 Sécurité | gardée ; les prompts à copier deviennent des règles déjà inscrites par `setup-projet` |
| E Méthode | e1 Prompt et contexte | gardée |
| | e2 Code design | gardée comme fiche à consulter, hors matinée |
| | e3 Cadrage et itération | réécrite autour de `setup-projet` |
| | e4 Méthode d'équipe (BMAD) | supprimée |

Toute mention de ChatGPT, Codex, OpenAI, VS Code et BMAD disparaît des briques
conservées.

## Ce qui existe déjà (fait pendant le cadrage)

- `kits/kit-projet/` : le dépôt modèle. Il contient
  `.claude/skills/setup-projet/SKILL.md`, un `README.md` et un `.gitignore`.
- `setup-projet` : interview en trois temps (l'idée ; les personnes et le
  geste ; les limites et la réussite), chaque temps suivi d'une reformulation
  que la personne corrige ; découpage en fonctionnalités avec sa propre boucle ;
  écriture de `CLAUDE.md`, `backlog.md`, `progress.md`. Il ne construit rien.
  Les fichiers de suivi sont les notes de Claude, pas celles de la personne.
  Les choix techniques sont faits par Claude, projet par projet, sans être
  présentés (voir les réponses de Matthieu plus bas).
- `scripts/skill-zip.mjs` (hook `prebuild`) : fabrique
  `public/kits/setup-projet.zip`, la version du skill téléchargeable seule,
  à ajouter depuis Customize.
- Supprimés : `kits/socle-starter/` et `docs/atelier/prompt-depot-modele.md`.

Rien de cela n'est commité ni testé sur une vraie idée.

## Les chantiers, dans l'ordre

Chaque chantier fait l'objet de son propre plan. Après chacun, `npm test`,
`content:check`, `parcours:check`, `presentation:check` et `build` passent.

### 1. Le ménage

Supprimer ce qui ne sert plus, sans rien réécrire encore :

- Bloc B : les six briques, `kits/bloc-b-assistant/`,
  `kits/bloc-b-assistant-formateur/`, `public/kits/bloc-b-assistant.zip`,
  `scripts/block-b-kit.mjs`, `scripts/qa-block-b*.mjs`,
  `src/components/block-b/`, `src/features/block-b/`, les tests `block-b-*` et
  leur helper, le deck `src/presentation/manifests/b.ts`, les imports
  correspondants dans `src/pages/briques/[id].astro`, les scripts npm associés.
- `src/components/presentation/visuals/b/` ne peut pas être supprimé en bloc :
  les decks D et E utilisent `prompt-builder`, `ipmtr-loop` et
  `setup-diagnostic` sur onze slides, et `VisualRegistry.astro` comme
  `SlideVisualKey` en dépendent. Ces trois visuels restent en place (le nom du
  dossier est sans conséquence, et le chantier 3 réécrit tous les decks) ; les
  trois autres sont supprimés.
- E4 : la brique et son bloc dans `src/presentation/manifests/e.ts` (elle n'a
  pas de fichier de deck à elle).
- Projets prédéterminés : `src/content/projets/`, `src/pages/atelier/projets/`,
  le modèle associé. Attention : `VALID_BRICK_IDS` vit dans
  `src/content/projet-model.ts` et doit survivre ailleurs.
- `docs/atelier/prototype-second-brain.md` et `docs/atelier/a-completer.md`
  (fil rouge « assistant à cinq organes », abandonné).
- Dépendances à traiter dans le même chantier : `src/content.config.ts`
  (collection `projets`), `src/pages/atelier/index.astro`,
  `src/components/ProjetCard.astro` et les styles projets de `global.css` ;
  `p1-naissance.mdx` (cite b0 et b1, et son champ `kit` décrit l'ancien kit) ;
  le prérequis `b4` de e2 ; `tests/site-theme.test.ts`,
  `tests/presentation-content.test.ts`, `tests/presentation-visuals.test.ts` ;
  `README.md` ; `docs/presentation/fiche-presentateur-D-E.md` ; `AGENTS.md`
  (jumeau non suivi de `CLAUDE.md`).
- Mettre à jour les inventaires et compteurs figés (liste dans le `CLAUDE.md`
  du dépôt, section Workflow) et le `CLAUDE.md` lui-même.

Un visuel du bloc B qui servirait encore à une nouvelle brique (par exemple
celui sur les artefacts) peut être déplacé plutôt que supprimé : au constructeur
de juger.

### 2. Les briques : nouveau format, moins de texte

Constat : une brique fait aujourd'hui 100 à 220 lignes de texte, onze sections
(« Cap », « Concept durable », « Pratique avec Claude », « Mission commune »,
« Livrable »…), et n'embarque aucun visuel. Les visuels existent, mais seulement
dans les slides (`src/components/presentation/visuals/`).

Nouveau format (choix de Claude, à ajuster au premier essai) :

1. **L'essentiel** : trois points au maximum, une phrase chacun.
2. **Le visuel principal**, tout de suite après, avant tout paragraphe.
3. **Comprendre** : le texte utile, court, coupé par un deuxième visuel quand
   il y a un mécanisme à montrer.
4. **À essayer** : un seul geste concret, quand la brique s'y prête.
5. **Pour aller plus loin** : replié par défaut. Y vont le détail, les
   variantes, le dépannage, les ressources officielles.
6. **Notes formateur** : repliées, avec la démonstration à faire en direct.

Cible : moins de 300 mots visibles sans déplier. Les sections « Mission
commune », « Livrable » et « Défis avancés » disparaissent (registre scolaire,
liées aux exercices). Les titres exigés par `src/content/brick-model.ts`
(`TYPE_HEADINGS`) et les champs de frontmatter évoluent en conséquence.

Les visuels, par ordre de préférence :

- **Réutiliser** un visuel de slide existant dans la brique correspondante.
- **Schéma animé** nouveau (composant Astro, SVG et CSS), pour un mécanisme :
  la boucle demander, regarder, corriger ; le trajet du code de l'ordinateur à
  GitHub puis à Vercel ; ce que Claude relit au début d'une conversation.
- **Maquette animée d'un geste** dans l'application (envoyer un message, ouvrir
  un dossier dans Code, ajouter un skill) : stylisée, pas une capture réelle.
  Cela respecte la règle éditoriale du dépôt (pas de détails d'interface
  périssables) et reste juste quand Anthropic déplace un bouton.

Les vraies vidéos d'écran ne sont pas produites ici : les démonstrations en
direct des formateurs en tiennent lieu (voir les questions ouvertes).

Toutes les animations respectent `prefers-reduced-motion` et restent lisibles à
l'arrêt.

Ordre de travail : une brique pilote d'abord (b2 Claude Code, la plus
importante et entièrement nouvelle), validée par Matthieu, puis les autres
famille par famille.

### 3. Les slides

Tous les decks sont réécrits de zéro, un par brique, pour les 18 briques. Règle
demandée par Matthieu : de gros points, des visuels, des
animations simples, et les formateurs parlent par-dessus. Concrètement : une
idée par slide, trois points au maximum, un visuel sur presque chaque slide,
aucun paragraphe. Les decks suivent le skill
`.agents/skills/slide-visual-director/`. Les compteurs figés des tests
`presentation-*` et des scripts `qa-*` évoluent.

### 4. L'atelier et la FAQ

- `/atelier` : le fil rouge « Construis ton assistant personnel » (deux pages
  aujourd'hui, `p1-naissance.mdx` et `restitution.mdx`, le `CLAUDE.md` du dépôt
  en annonce cinq à tort) est remplacé par le parcours du projet personnel : cadrer avec
  `setup-projet` ; la première fonctionnalité ; la mise en ligne ; agrandir, une
  fonctionnalité à la fois ; la restitution.
- `/faq` : la carte des outils perd VS Code et le terminal ; le guide
  « naissance d'un projet » est refait pour l'application Claude (ses captures
  montrent l'extension VS Code) ; les guides « mise en ligne » et « clé API »
  sont relus. Un lien de téléchargement vers `setup-projet.zip` est ajouté.

## Ce qui n'est pas dans le périmètre

- Le message de préparation aux participants (déjà rédigé, envoyé hors dépôt).
- La création du dépôt modèle sur GitHub : à faire par Matthieu depuis
  `kits/kit-projet/`.
- Le dépôt `retours-camp`.
- Les anciens documents de `docs/superpowers/` : conservés comme historique.

## Ce qui ferait échouer la refonte même si tout « marche »

- Une matinée qui redevient un cours : des slides lues, des briques récitées.
- Une participante bloquée sur une installation le samedi.
- Des briques raccourcies en texte mais sans visuel qui apprenne quelque chose :
  un visuel décoratif ne compte pas.
- Un vocabulaire technique qui revient par la fenêtre (terminal, commit, npm)
  dans les pages destinées aux participants.

## Hypothèses non vérifiées

- **L'installation de Node et de Git à la maison** par des personnes non
  techniques, en particulier sur Windows et sur des ordinateurs de travail sans
  droits d'administration : c'est ce qui a échoué à la première session, et
  rien ne prouve encore que la nouvelle consigne suffit.
- Les limites d'usage de l'abonnement à 20 euros sur un jour et demi de build
  ne sont pas documentées.
- La fusion de Chat et Cowork est en cours de déploiement : certains comptes
  peuvent encore afficher deux boutons.

## Choix faits par Claude (à vérifier à la relecture)

- Conserver les lettres de famille A à E et réutiliser les identifiants `b1` et
  `b2` pour les nouvelles briques.
- Scinder la prise en main en deux briques (conversation, Claude Code) plutôt
  qu'une : 18 briques au total.
- Le nouveau format de brique en six parties et la cible de 300 mots visibles.
- Des maquettes animées stylisées plutôt que des captures ou des vidéos réelles.
- L'ordre des chantiers : ménage, briques, slides, atelier et FAQ.
- Toute la refonte se fait sur une branche `refonte-session-2`, fusionnée dans
  `main` à la fin : entre deux chantiers le site est incohérent (famille B
  vide, accueil qui parle encore d'OpenAI) et ne doit pas être publié.
- Chemin enseigné pour obtenir `setup-projet` (révisé le 2026-11-21, avec le
  passage en session locale) : le skill est installé dans les skills
  personnels par le prompt de préparation, puis on ouvre un dossier vide et on
  écrit « lance setup-projet ». Claude crée lui-même le dépôt GitHub avec
  GitHub CLI à la première sauvegarde. Le dépôt modèle (« Use this template »)
  n'est plus nécessaire : il imposait de créer le dépôt en ligne puis de le
  ramener sur l'ordinateur. Le zip ajouté depuis Customize reste montré dans
  la brique c1 comme exemple d'ajout d'un skill.
- La brique pilote : b2 Claude Code.

## Réponses de Matthieu aux questions ouvertes (2026-11-20)

- **Session locale par défaut** (décision révisée par Matthieu après son essai
  du cloud). Raisons : voir le résultat de ce qu'on construit, tout de suite,
  sur son ordinateur, est ce qui compte le plus ; et les projets sont ouverts,
  certains ont besoin de la machine elle-même. Le contenu enseigne donc : un
  dossier sur l'ordinateur, relié à un dépôt GitHub, Claude lance le projet et
  l'affiche dans l'aperçu, puis sauvegarde sur GitHub. La session cloud (essayée
  par Matthieu sur Mac : simple et fluide) n'est mentionnée que comme
  possibilité, dans un encart de la brique b2.
  Conséquence : Node et Git doivent être sur chaque machine. L'installation se
  fait **avant de venir**, pas sur place : le message de préparation et la
  brique d2-bis la couvrent, pour Mac et pour Windows, et la matinée commence
  par une vérification de cinq minutes. Le moyen le plus simple reste à
  éprouver sur un Windows vierge : demander à Claude, dans l'onglet Code, de
  vérifier l'ordinateur et d'installer ce qui manque.
- **Les projets sont ouverts à tout** : site, petite application en ligne,
  agent, outil du quotidien, automatisation. `setup-projet` n'impose aucun type
  de projet ni aucune pile ; Claude choisit la technologie qui sert le mieux
  l'idée, sans la présenter à la personne. La mise en ligne sur Vercel ne
  concerne que les projets faits pour être en ligne.
- **Le temps ne manque pas** : viser la meilleure finition, pas la plus rapide.
- **La formation commence le samedi matin.** Il n'y a plus de vendredi.
- **Visuels : les deux, au choix de Claude selon le cas.** Règle retenue :
  - *Schémas et maquettes animés, fabriqués en code* : dans les briques et les
    slides, pour les concepts et pour l'allure générale d'un geste. Durables.
  - *Vraies captures d'écran* : dans les guides de la FAQ, où l'emplacement
    exact d'un bouton compte. Fournies par Matthieu à partir d'une liste
    précise établie au chantier 4.
  - *Vraies vidéos d'écran courtes (20 à 40 secondes)* : dans les slides, pour
    les démonstrations clés (premier message, premier artefact, première page
    construite dans Code, ajout d'un skill, mise en ligne). Enregistrées par
    les formateurs à partir d'une liste de plans établie au chantier 3 ; les
    slides prévoient l'emplacement et restent lisibles sans la vidéo.
- **Les slides sont toutes refaites**, pas retouchées : des points courts avec
  un peu de détail, peu de texte, surtout des animations, des visuels et des
  vidéos.

## Précisions du 2026-11-21

- **Un projet n'a pas à être fini pendant le week-end.** La session donne les
  bases et la méthode, chacun poursuit chez soi. Conséquence : `setup-projet`
  ordonne les fonctionnalités au lieu de réduire l'idée, et la restitution du
  dimanche montre une première fonctionnalité qui marche et la suite prévue,
  pas un produit terminé.
- **Git, Node et GitHub CLI sont installés par Claude**, pas par la personne :
  une phrase à coller chez soi, qui se termine par un tableau « prêt ou pas
  prêt » à renvoyer aux formateurs. Lien GitHub par `gh auth login` (un code à
  coller, ni jeton ni clé). Guides manuels Mac et Windows, table des pannes
  classiques et plan B (session cloud) : `docs/atelier/installation-depannage.md`,
  fiche formateur. La brique d2-bis et la FAQ en tireront la version
  participant aux chantiers 2 et 4.
- Vérifié dans la documentation officielle : l'onglet Code n'a besoin ni de
  Node ni de Git pour démarrer (sur Windows sans Git, Claude passe par
  PowerShell) ; après une installation, il faut quitter et rouvrir
  l'application pour qu'elle voie les nouveaux outils ; les sessions locales
  chargent les skills personnels de `~/.claude/skills/`. Non documenté :
  cloner un dépôt GitHub depuis l'interface pour une session locale.
