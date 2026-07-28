# Design : la surface `/demarrer`, guides de gestes concrets

Date : 2026-07-26, révisé le 2026-07-27
Auteur : Matthieu, avec Claude
Statut : validé en brainstorming, prêt pour le plan d'implémentation

## Problème

La formation a été donnée. Le retour de terrain le plus net vient d'un
participant mentoré qui n'a pas réussi à enchaîner : créer un dossier, l'ouvrir
dans VS Code, y lancer Claude, créer un repo GitHub, relier le projet local au
repo et le mettre en ligne.

Le contenu couvrant ce sujet existe pourtant déjà, mais au mauvais niveau :

- `d2-bis-setup-github-vercel.mdx` décrit la chaîne sous forme de rituel
  conceptuel.
- `b4-bis-projet-local.mdx` est un rattrapage qui suppose un poste presque prêt
  et parle de terminal, de `pwd` et de `node --test`.
- `d4-securite.mdx` énonce la règle des secrets sans montrer un seul fichier,
  une seule ligne, un seul écran.

Il manque une couche « geste », pas une couche « savoir ». Le participant n'a
pas buté sur un concept. Il a buté sur l'enchaînement, et sur les coutures entre
deux applications.

## Le public, qui commande tout le reste

**Ces gens ne sont pas développeurs. Pas un peu : pas du tout.** Le mot
« terminal » les perd. Une commande à taper les perd. Un log de build les perd.
Il a fallu beaucoup de temps en formation pour faire passer ces notions, et ce
n'est pas ce que cette surface doit tenter de refaire.

Cette surface n'est ni un cours ni une fiche de révision. Quelqu'un arrive,
reconnaît son cas, clique, voit l'exemple en image, repart. En quelques
secondes. Ceux qui restent bloqués vont voir Matthieu, et c'est très bien : ce
n'est pas le travail de la page.

### Le principe, qui remplace celui du spec initial

> **Claude fait. Vous cliquez dans le navigateur, vous copiez, vous collez, et
> vous vérifiez avec vos yeux.**

La version précédente de ce spec posait l'inverse (« l'humain fait, Claude
explique »). C'est corrigé : la méthode réellement enseignée en mentorat, et
celle qui fonctionne, délègue toute la plomberie à Claude. Le travail humain se
réduit à quatre gestes : créer un compte, cliquer sur un bouton, copier un
bloc, regarder si c'est arrivé.

### Interdits, opposables en relecture

| Interdit | À la place |
|---|---|
| Le mot « terminal », « ligne de commande », « shell », « CLI » | Rien. On ne l'ouvre jamais. |
| Une commande à taper soi-même | Un bloc à copier et à coller **à Claude** |
| `git status`, `git log`, lire un log de build | Regarder la page GitHub ou Vercel dans le navigateur |
| Un `.env.example`, une convention de dev | Supprimé |
| Vérifier le framework ou le dossier racine sur Vercel | « Ne touchez à aucun réglage, cliquez sur Deploy » |
| « Preuve attendue », « objectif », « mission », « livrable », une durée | « Vous devez voir ça » |
| « Dépannage » | « Ça coince ? » |
| Un paragraphe explicatif au-dessus du geste | Une ligne repliée, que personne n'est obligé de déplier |

**Règle de composition : un écran par geste, dominé par le visuel.** Un visuel,
un bloc à copier, une ligne de confirmation. Si un geste demande un paragraphe,
il faut le couper en deux.

## La surface

`/demarrer` s'organise en trois niveaux, du plus général au plus précis.

### Niveau 0 : la carte des outils

En tête de `/demarrer`, avant les guides. Une rangée de vignettes avec logo,
nom, et **une ligne** disant à quoi sert l'outil. Pas un guide, pas d'étapes :
juste de quoi ne plus être perdu devant le vocabulaire.

| Outil | La ligne |
|---|---|
| Wispr Flow, Typeless | Pour parler à votre ordinateur au lieu de taper |
| VS Code | L'atelier : c'est là que votre projet vit et que Claude travaille |
| Claude Code | Celui qui fait le travail technique à votre place |
| GitHub | La copie en ligne de votre projet, qui garde tout l'historique |
| Vercel | Ce qui transforme votre projet en site que le monde peut ouvrir |

Wispr Flow et Typeless sont présentés, pas installés : leur mise en place ne
fait pas partie des guides.

Les logos vivent dans `public/demarrer/outils/*.svg`. Ils relèvent de l'usage
nominatif (identifier le produit dont on parle) : conserver les tracés
officiels sans les redessiner.

Provenance vérifiée au 2026-07-27 : GitHub, Vercel, VS Code et Claude sont
disponibles en SVG monochrome dans Simple Icons (licence CC0 pour les tracés,
marques appartenant à leurs propriétaires). Wispr Flow et Typeless n'y sont
pas : leurs marques se récupèrent depuis leur site officiel, sinon on les
représente par une pastille typographique dessinée dans le style du site.

Choix graphique qui découle de cette contrainte : **la rangée de vignettes est
monochrome**, teintée par la couleur du site. Cela évite six logos aux couleurs
et aux poids visuels incompatibles, cela absorbe sans rupture les deux marques
manquantes, et cela reste conforme à un usage nominatif.

### Niveau 1 : trois guides

Dans un ordre chronologique où chacun ne présuppose que le précédent.

### Niveau 2 : la grille « Ça coince ? »

Sous les guides, une liste de symptômes courts pointant droit sur l'ancre de
leur panne. Le chemin rapide pour quelqu'un qui sait déjà ce qui ne va pas.
Dérivée des manifestes, jamais saisie à la main.

## Guide 1 : créer un projet et le mettre sur GitHub

| # | Geste | Lieu | Vous devez voir |
|---|---|---|---|
| 1 | Créer un dossier pour votre projet | machine | Le dossier existe, vous savez où il est |
| 2 | L'ouvrir dans VS Code, comme **dossier** et pas comme fichier | vscode | Le nom du dossier en tête de la barre latérale |
| 3 | Activer l'extension Claude dans cet espace de travail | vscode | Le bouton affiche « Disable », donc c'est activé |
| 4 | Lancer Claude et lui demander ce qu'il voit | vscode | Claude cite le nom de **votre** dossier |
| 5 | Sur github.com, créer un dépôt **entièrement vide** | navigateur, GitHub | Une page de dépôt sans aucun fichier |
| 6 | Copier le bloc de commandes que GitHub affiche | navigateur, GitHub | Le bloc copié |
| 7 | Le coller à Claude et le laisser faire | vscode | Claude annonce que c'est envoyé |
| 8 | Rafraîchir la page GitHub | navigateur, GitHub | Vos fichiers sont là |

### Le geste 3, qui manquait et qui bloque vraiment

Sur un dossier neuf, l'extension Claude est fréquemment inactive : VS Code
n'autorise pas une extension dans un espace de travail qu'il ne connaît pas.
Le geste : ouvrir le panneau des extensions, chercher « Claude Code », cliquer
sur « Enable in this workspace ». Sans lui, tout le reste du guide échoue sans
message compréhensible. Ce geste mérite une capture d'écran réelle.

### Le geste 5, à marteler

Sur la page de création, **ne cocher aucune case** : ni README, ni `.gitignore`,
ni licence. Deux raisons, et la seconde est celle qui compte ici :

1. Un dépôt non vide fait échouer le premier envoi.
2. **Un dépôt vide affiche le bloc de commandes tout prêt.** C'est ce bloc qui
   est la matière première du geste suivant. Un dépôt avec README ne l'affiche
   pas, et le lecteur se retrouve sans rien à copier.

### Le geste 7, le cœur de la méthode

Le lecteur ne tape aucune commande. Il colle le bloc de GitHub à Claude, avec
une phrase autour :

```text
Voici les commandes que GitHub vient de me donner pour relier ce projet.
Exécute-les dans ce dossier, puis dis-moi quand c'est en ligne.

(collez ici le bloc copié sur GitHub)
```

Claude exécute, et la vérification se fait dans le navigateur au geste 8, pas
dans une sortie de commande. Le lecteur n'a jamais eu à savoir ce que faisaient
ces lignes. S'il veut savoir, il peut demander à Claude : c'est une ligne du
`pourquoi`, pas un passage obligé.

## Guide 2 : mettre votre site en ligne

| # | Geste | Lieu | Vous devez voir |
|---|---|---|---|
| 1 | Créer un compte Vercel avec « Continue with GitHub » | navigateur, Vercel | Votre pseudo GitHub affiché dans Vercel |
| 2 | « Add New », puis « Project », puis « Import » sur votre dépôt | navigateur, Vercel | Le nom de votre projet en haut de la page |
| 3 | Cliquer « Deploy » sans toucher à aucun réglage | navigateur, Vercel | Une page qui travaille, puis des confettis |
| 4 | Cliquer sur l'aperçu du site | navigateur | Votre site ouvert, avec une adresse en `.vercel.app` |
| 5 | Retrouver ce lien plus tard | navigateur, Vercel | Le lien en haut du tableau de bord du projet |
| 6 | Demander un changement à Claude, puis regarder le site | vscode puis navigateur | Le site change tout seul, sans rien faire de plus |

Le geste 3 dit explicitement de ne toucher à rien. Vercel devine le reste, et le
dépôt est forcément le bon puisqu'on l'a choisi par son nom. Toute la
configuration est retirée du guide.

Le geste 6 est le sommet de toute la surface. C'est le moment où « mon dossier »,
« GitHub » et « mon site » cessent d'être trois abstractions et deviennent une
mécanique visible. Il mérite le visuel le plus soigné des trois guides.

Aucune lecture de log de build dans ce guide. Un déploiement qui échoue renvoie
vers le mentorat, pas vers une page de diagnostic.

## Guide 3 : donner une clé API à votre projet

### À qui il s'adresse, dit dès la première ligne

Ce guide ne concerne pas tout le monde, et la page doit le dire tout de suite
plutôt que de laisser quelqu'un s'y engager pour rien :

> Ce guide est pour vous **si votre site doit poser des questions à Claude**,
> par exemple quand un visiteur écrit quelque chose et attend une réponse. Si
> votre site se contente d'afficher des pages, vous n'avez besoin de rien de
> tout ça.

Ce filtre vient d'une vérification faite sur le catalogue de projets : les cinq
projets de `src/content/projets/` produisent des pages qui **affichent des
fichiers** écrits pendant l'atelier (l'assistant lit une mémoire, le coach lit
des chapitres, le portfolio affiche des projets). Une fois en ligne, ils
n'appellent aucun service et fonctionnent sans aucune clé. Les clés n'y
apparaissent que comme point d'audit de sécurité, jamais comme condition de
fonctionnement.

Le besoin réel, confirmé par le terrain, vient des participants qui ont voulu
aller plus loin : faire répondre leur site en direct. C'est eux que ce guide
sert, et le service visé est bien l'API Anthropic (`ANTHROPIC_API_KEY`, console
Anthropic).

### Introduction, en trois phrases sans jargon

> Une clé API, c'est un mot de passe qui donne accès à un service payant. Elle
> doit se trouver sur votre ordinateur et chez Vercel, mais **jamais sur
> GitHub**, parce que GitHub est public et garde tout pour toujours. C'est
> Claude qui met en place la protection.

| # | Geste | Lieu | Vous devez voir |
|---|---|---|---|
| 1 | Créer la clé chez Anthropic et la copier tout de suite | navigateur, console Anthropic | La clé, affichée **une seule fois** |
| 2 | Demander à Claude de préparer le coffre | vscode | Un fichier `.env` créé, et `.gitignore` mis à jour |
| 3 | Coller votre clé dans le fichier `.env`, puis enregistrer | vscode | La ligne complétée, le fichier affiché en grisé |
| 4 | Vérifier sur GitHub que `.env` n'y est pas | navigateur, GitHub | Aucun fichier `.env` dans la liste |
| 5 | Coller la clé dans Vercel, dans « Environment Variables » | navigateur, Vercel | La variable listée, sa valeur masquée |
| 6 | Redéployer depuis Vercel | navigateur, Vercel | Le site en ligne fonctionne |

### La clé ne passe jamais par la conversation

Décision de sécurité, et elle produit un guide plus simple, pas plus compliqué.
Le geste 2 demande à Claude de préparer le fichier **avec la ligne vide** :

```text
Crée un fichier .env à la racine de ce projet, avec une ligne
ANTHROPIC_API_KEY= et rien après le signe égal.
Ajoute .env au fichier .gitignore pour qu'il ne parte jamais sur GitHub.
Puis explique-moi en une phrase simple ce que tu viens de faire.
```

Le lecteur colle ensuite sa clé lui-même dans le fichier. Trois bénéfices :

1. Le secret ne transite pas par l'IA, conformément à la règle posée dans
   D2-bis et D4.
2. Le lecteur garde le geste « créer et remplir son `.env` », qui est
   pédagogiquement le seul qui compte dans ce guide.
3. Le « explique-moi en une phrase simple » fait de Claude le professeur. La
   page n'a pas à écrire la leçon sur le `.gitignore`.

Le `.gitignore` n'est jamais écrit à la main. Il est décrit en une ligne dans le
`pourquoi` : « la liste des fichiers que GitHub doit ignorer ».

### Le geste 4 remplace `git status`

La vérification se fait à l'œil, dans le navigateur, sur la page GitHub du
dépôt. Un fichier présent ou absent d'une liste : c'est une preuve qu'un public
non technique sait lire. Aucune commande n'est proposée.

### Le geste 6 a son avertissement

Ajouter une variable dans Vercel ne met pas le site à jour. Sans redéploiement,
la panne persiste et le lecteur croit s'être trompé. C'est la panne numéro un de
ce guide.

### Le danger, avant le geste 1

« J'ai déjà envoyé ma clé sur GitHub » n'est pas une panne, c'est un `danger`.
Supprimer le fichier ne répare rien : l'historique garde tout. La seule réponse
est de révoquer la clé chez Anthropic, en un clic, et d'en créer une nouvelle.
Formulé en deux phrases, sans parler d'historique Git.

### Hors périmètre

`.env.example`, la distinction variables publiques et privées, la casse des
noms de fichiers, la lecture des logs, l'installation de VS Code, de Node ou de
Git. D'autres cas remonteront du terrain : le modèle et la grille sont conçus
pour en accueillir sans refonte.

## Modèle de contenu

Fichier : `src/parcours/parcours-model.ts`. Types et validateurs purs,
testables sans Astro.

```ts
// Pas de valeur 'terminal'. Le terminal n'existe pas sur cette surface.
type Lieu = 'machine' | 'vscode' | 'navigateur';

interface Geste {
  action: string;      // un impératif, une seule action
  ancre?: string;      // le repère stable, pas la position du bouton
}

interface Panne {
  id: string;          // kebab-case, sert d'ancre URL
  frequente: boolean;  // remonte dans la grille « Ça coince ? »
  symptome: string;    // ce que le lecteur voit, au mot près si c'est un message
  cause: string;       // une phrase, sans jargon
  reparation: Geste[];
  preuve: string;      // comment savoir que c'est reparti
}

interface Fichier {
  chemin: string;      // '.env'
  contenu: string;     // du contenu réel, copiable, jamais décrit
  commentaire?: string;
}

// Union discriminée : chaque composant de visuel déclare les données qu'il
// sait rendre. Le compilateur interdit un visuel mal formé ; le validateur
// vérifie en plus que la clé existe dans le registre de composants.
type Visuel =
  | { key: 'claude'; colle: string; reponse: string[] }
  | { key: 'arborescence'; avant: string[]; apres: string[]; ignores?: string[] }
  | { key: 'trois-lieux'; accent: 'projet' | 'ligne' | 'cle' }
  | {
      key: 'capture';
      fichier: string;      // 'demarrer/cle-api/console-anthropic.png'
      alt: string;          // obligatoire
      service: string;      // 'console Anthropic'
      verifieLe: string;    // 'AAAA-MM-JJ', date de dernière vérification
      reperes: { label: string; position: 'haut' | 'bas' | 'gauche' | 'droite' | 'centre' }[];
    };

interface Etape {
  id: string;          // kebab-case, sert d'ancre URL
  titre: string;
  lieu: Lieu;
  service?: string;    // 'console Anthropic', 'Vercel', 'GitHub'
  pourquoi?: string;   // une ligne, repliée par défaut, 160 caractères maximum
  gestes: Geste[];
  aClaude?: string;    // le bloc à copier et coller dans la conversation
  fichiers?: Fichier[];
  danger?: string;     // signalé avant le geste, pour l'irréversible
  preuve: { visible: string; sinon: string };
  visuel: Visuel;
  pannes: Panne[];
}

interface Guide {
  id: string;
  titre: string;
  promesse: string;    // une phrase, affichée sur la carte
  prerequis: string[];
  etapes: Etape[];
}

interface Outil {
  nom: string;
  logo: string;        // 'demarrer/outils/vscode.svg'
  role: string;        // une ligne, 100 caractères maximum
}
```

Ce qui a changé depuis la version précédente du spec, et pourquoi :

- **`Lieu` perd sa valeur `'terminal'`.** Le type rend structurellement
  impossible d'écrire une étape qui envoie le lecteur dans un terminal. C'est la
  traduction la plus directe de la contrainte de public.
- **`aClaude` remplace les commandes.** Champ de premier plan, rendu comme un
  bloc distinctif copiable en un clic. C'est le geste central de la méthode.
- **`VisuelTerminal` devient `VisuelClaude`.** On ne montre plus une invite de
  commande mais une conversation : ce qu'on colle, ce que Claude répond.
- **`systeme` est supprimé.** Sans terminal, la divergence Mac et Windows se
  réduit à la création d'un dossier. Un `pourquoi` suffit. Cela retire un
  composant, un module de state, un test et un sélecteur.
- **`preuve.visible` ne décrit jamais une sortie de commande.** Ce qu'on voit
  est une page web, une barre latérale, un fichier grisé.
- **`Panne.frequente`** alimente la grille « Ça coince ? » sans saisie
  manuelle.
- **`pourquoi` reste optionnel et bref.** Son caractère obligatoire dans la
  première version du spec était le premier symptôme de dérive scolaire.

Sont conservés : `preuve` non optionnel dans le type, les pannes locales à leur
geste, `fichiers` qui montre au lieu de décrire, `danger` distinct d'une panne,
et `verifieLe` sur les captures.

## Expérience de page

### Routes

- `/demarrer/` : la carte des outils, les trois cartes de guides, la grille
  « Ça coince ? ».
- `/demarrer/[guide]/` : le guide complet, une seule page longue, pour que le
  lecteur puisse faire défiler et que le formateur puisse envoyer un lien
  précis.

### Repérage dans un guide

- **Bandeau collant** : `4 / 8 · VS Code`. On sait toujours où on est et dans
  quelle application.
- **Marqueur de changement de lieu** entre deux gestes quand `lieu` change :
  « Vous changez d'application : repassez dans votre navigateur. » C'est le
  chaînon manquant du blocage observé, rendu impossible à rater. Le guide 1 en
  compte quatre.

### Pannes

`<details>` repliés sous leur geste, chacun avec une ancre stable
(`#panne-extension-inactive`). Le formateur envoie un lien direct, et le
symptôme devient trouvable par recherche.

### Visuels

| Composant | Ce qu'il rend | Utilisé par |
|---|---|---|
| `VisuelCapture` | Une capture réelle, ses repères annotés, sa date de vérification | Panneau des extensions VS Code, création de dépôt GitHub, import Vercel, console Anthropic |
| `VisuelClaude` | La conversation : ce qu'on colle, ce que Claude répond | Gestes 4 et 7 du guide 1, geste 2 du guide 3 |
| `VisuelArborescence` | État du dossier avant et après, `.env` en grisé | Création du dossier, du `.env` |
| `VisuelTroisLieux` | Dossier, GitHub et site en ligne, avec le flux animé | Ouverture des guides, geste 6 du guide 2 |

Les captures sont réservées aux écrans de service qu'il faut **reconnaître**.
Elles vivent dans `public/demarrer/<guide>/*.png`, avec `alt` obligatoire.

Les composants HTML sortent en `data-enhanced="false"` et le JavaScript bascule
à `true`, comme le reste du projet. L'animation est un bonus, jamais un
prérequis : le contenu textuel équivalent est la liste de gestes, déjà présente.

### Copie

Bouton de copie sur chaque bloc `aClaude` et chaque bloc `fichiers`. Non
négociable : la méthode entière repose sur du copier-coller fiable.

## Arborescence des fichiers

```
src/parcours/
  parcours-model.ts          types et validateurs purs
  outils.ts                  la carte des outils
  manifests/
    naissance-projet.ts
    mise-en-ligne.ts
    cle-api.ts
  index.ts                   registre des guides
src/features/demarrer/
  cas.ts                     dérive la grille « Ça coince ? » depuis les guides
src/components/demarrer/
  GuideShell.astro
  Etape.astro
  Panne.astro
  CarteOutils.astro
  visuels/
    VisuelCapture.astro
    VisuelClaude.astro
    VisuelArborescence.astro
    VisuelTroisLieux.astro
src/pages/demarrer/
  index.astro
  [guide].astro
public/demarrer/outils/*.svg
public/demarrer/<guide>/*.png
scripts/check-parcours.ts
```

## Validation

`npm run parcours:check`, branché dans le script `build` aux côtés de
`content:check` et `presentation:check`.

Ce que le validateur refuse, au-delà de ce que le compilateur attrape :

1. Un geste sans `preuve.visible` ou sans `preuve.sinon`.
2. Une panne sans symptôme, cause, réparation ou preuve de sortie.
3. Un identifiant de geste ou de panne non unique ou hors kebab-case : les
   ancres URL doivent rester stables et partageables.
4. Une clé de visuel absente du registre de composants.
5. Un `lieu: 'navigateur'` sans `service` renseigné.
6. Le caractère tiret cadratin dans n'importe quelle chaîne.
7. **Le vocabulaire interdit** dans toute chaîne visible par le lecteur :
   `terminal`, `ligne de commande`, `shell`, `CLI`, `git status`, `git log`,
   `npm run`. Cette règle est la traduction mécanique de la contrainte de
   public, et c'est celle qui protège la surface dans la durée.
8. Une capture dont le fichier est absent de `public/`, dont l'`alt` est vide,
   ou dont `verifieLe` remonte à plus de six mois. Les deux premiers cas
   échouent, le troisième avertit.
9. Un `pourquoi` de plus de 160 caractères, un `Outil.role` de plus de 100.

Les règles 7 et 9 sont inhabituelles et assumées. Le seul défaut que la
relecture humaine laisse passer sur ce type de contenu est son gonflement
progressif : chaque relecteur ajoute une précision utile, et six mois plus tard
c'est redevenu un cours. Des limites chiffrées et une liste de mots interdits
rendent la dérive visible en intégration continue.

## Tests

Style `node:test` via `tsx`, comme le reste du dépôt.

- `tests/parcours-model.test.ts` : chaque règle du validateur, une par test,
  sur des cas volontairement fautifs. La règle 7 mérite ses propres cas.
- `tests/parcours-cas.test.ts` : la dérivation de la grille « Ça coince ? ».
  Toute panne `frequente` remonte ; chaque entrée pointe vers une ancre qui
  existe.
- `tests/parcours-content.test.ts` : compteurs figés (trois guides, leurs
  gestes, leurs pannes, les outils de la carte).
- `scripts/qa-demarrer.mjs` : Playwright, sur le modèle des `qa-*.mjs`. Vérifie
  le seul point non testable en unitaire, à savoir que les pages restent
  entièrement lisibles avec JavaScript désactivé.

## Raccords avec l'existant

| Depuis | Vers | Formulation |
|---|---|---|
| D2-bis | `/demarrer/naissance-projet` | « Les gestes en images, écran par écran » |
| B4-bis | `/demarrer/naissance-projet` | Renvoi de rattrapage |
| D3 | `/demarrer/mise-en-ligne` | Le geste du déploiement |
| D4 | `/demarrer/cle-api` | « La règle est ici, le geste est là » |
| `/demarrer` | D4 | Retour vers la règle et les prompts d'audit |

Frontière avec D4 : **D4 garde la règle et les prompts d'audit, `/demarrer`
prend le geste.**

Ajouts d'interface : une entrée dans la navigation de
`src/layouts/BaseLayout.astro`, qui passe de quatre à cinq liens, et un appel
sur la page d'accueil.

## Mise à jour obligatoire de CLAUDE.md

CLAUDE.md annonce « les trois surfaces du site ». Il en aura quatre. Sans cette
modification, la prochaine session repart sur une carte fausse.

L'entrée à ajouter :

- `/demarrer` : la carte des outils et trois guides de gestes concrets, pilotés
  par les manifestes TypeScript (`src/parcours/manifests/`), validés par
  `npm run parcours:check`. Public non technique : aucun terminal, aucune
  commande à taper, Claude fait la plomberie. Registre non scolaire : pas de
  durée, pas d'objectif, pas de mission.

Le workflow gagne une étape : tout geste ou panne ajouté fait évoluer les
compteurs figés de `tests/parcours-content.test.ts`.

## Ordre d'implémentation

1. Le modèle et son validateur, en TDD. Fondation testable seule.
2. Un seul geste de bout en bout, du manifeste jusqu'au rendu. Tranche
   verticale : elle valide toute la chaîne technique avant qu'une ligne de
   contenu ne soit écrite.
3. Les quatre composants de visuel, puis la carte des outils.
4. Le contenu des trois guides, dans l'ordre : naissance, mise en ligne, clé.
5. La grille « Ça coince ? », les raccords, la navigation, CLAUDE.md.

Les captures d'écran sont produites en même temps que le contenu de leur guide,
pas en lot séparé : une capture sans son texte n'a pas de cadrage.

## Critères d'acceptation

- `npm test`, `npm run content:check`, `npm run parcours:check`,
  `npm run presentation:check` et `npm run build` passent.
- Les trois guides sont intégralement lisibles avec JavaScript désactivé.
- **Aucun mot du vocabulaire interdit n'apparaît sur la surface**, garanti par
  le validateur.
- Aucune commande n'est proposée à la saisie : tout bloc technique est un
  `aClaude` à copier.
- Chaque geste affiche son lieu, ce qu'on doit voir, et l'issue si on ne le voit
  pas.
- Chaque changement d'application entre deux gestes est signalé explicitement.
- Chaque panne est atteignable par une ancre URL stable, et toute panne
  fréquente apparaît dans la grille « Ça coince ? ».
- Toute capture possède un `alt`, un fichier présent et une date de
  vérification.
- Aucun tiret cadratin dans les manifestes.
- Les quatre briques listées dans les raccords pointent vers la nouvelle
  surface.
