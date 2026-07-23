# Bloc B : parcours miroir Claude et OpenAI

Date : 23 juillet 2026
Statut : design validé

## 1. Problème

Le Bloc B actuel mélange trois objets sans expliciter leur relation :

- le site de formation ;
- le kit fictif du Bloc B ;
- le projet personnel construit pendant l’atelier.

B0 est présenté comme un préflight technique exigeant Chat, Artifacts, Cowork
et le kit avant le départ. B1 à B4 suivent ensuite une chaîne presque
exclusivement Claude, alors que le Bloc A présente Claude et OpenAI comme deux
écosystèmes possibles.

Les preuves de réussite décrivent souvent un résultat final sans rendre le test
opérationnel. Le participant ne sait pas toujours où travailler, quel fichier
ouvrir, quel prompt envoyer, quelle action effectuer ni comment décider si son
résultat passe.

## 2. Thèse pédagogique

Le Bloc B est un laboratoire guidé. Chaque participant choisit Claude ou OpenAI,
puis teste quatre niveaux d’action sur des cas d’usage fictifs fournis :

1. obtenir une réponse ;
2. créer un objet manipulable ;
3. produire un livrable multiétape ;
4. modifier et vérifier un projet existant.

Le choix d’un outil découle de la sortie attendue, du contexte nécessaire, de
l’action autorisée et de la preuve de réussite.

## 3. Objectifs

- Permettre à chaque participant de suivre une voie complète dans un seul
  écosystème.
- Faire manipuler réellement les quatre niveaux, pas seulement les présenter.
- Conserver les mêmes objectifs et les mêmes critères de réussite dans les deux
  voies.
- Distinguer explicitement le kit d’entraînement du projet personnel.
- Rendre chaque test binaire, observable et corrigeable.
- Terminer par un transfert : choisir la bonne surface sur des situations
  nouvelles.

## 4. Hors périmètre

- Comparer la qualité générale des modèles Claude et OpenAI.
- Former à tous les boutons ou réglages de chaque interface.
- Utiliser des données personnelles ou professionnelles.
- Faire dépendre B2, B3 ou B4 de la réussite de la brique précédente.
- Transformer le kit d’entraînement en projet personnel.

## 5. Architecture miroir

| Besoin | Voie Claude | Voie OpenAI | Preuve |
|---|---|---|---|
| Réponse conversationnelle | Claude Chat | ChatGPT Chat | Réponse sourcée et relue |
| Objet éditable et testable | Artifacts | Canvas | Interactions exécutées |
| Livrable multiétape | Cowork | Work | Fichier produit et contrôlé |
| Changement dans un projet | Claude Code | Codex | Test réussi et modifications relues |

Les quatre expériences appartiennent au socle obligatoire. B4 n’est plus un
prolongement facultatif. Les durées existantes sont conservées :

- B0 : 5 minutes ;
- B1 : 12 minutes ;
- B2 : 18 minutes ;
- B3 : 20 minutes ;
- B4 : 20 minutes.

Le Bloc B représente donc 75 minutes de pratique, auxquelles peut s’ajouter la
marge de transition existante.

B4-bis reste un rattrapage technique pour le poste de travail. Il ne constitue
ni un cinquième niveau d’action ni une étape automatique du parcours.

## 6. Déroulement

### B0 : Choisir sa voie

B0 remplace « Préflight Bloc B » par « Choisir sa voie ».

Le participant :

1. choisit Claude ou OpenAI ;
2. télécharge le Kit d’entraînement du Bloc B ;
3. ouvre les trois notes fictives ;
4. repère les quatre sorties à produire ;
5. comprend qu’il ne travaille pas encore sur son projet personnel.

Le test passe lorsque le participant peut nommer sa voie, ouvrir les sources et
expliquer la différence entre réponse, objet, livrable et projet modifié.

### B1 : Obtenir une réponse

Situation : transformer six notes fictives en brief du jour.

Chat est la surface minimale suffisante, car la sortie attendue est un texte
court à relire. Aucun fichier final ni action autonome n’est nécessaire.

Le test passe si :

- les six notes sont représentées ;
- les sections « Actions du jour », « À confirmer » et « Plus tard » sont
  présentes ;
- chaque action cite son fichier source ;
- les dates contradictoires restent sous « À confirmer ».

Chaque échec mène à une correction ciblée : restaurer une note, une source, une
section ou le conflit sans réécrire le reste.

### B2 : Créer un objet manipulable

Situation : transformer les mêmes notes en tableau interactif.

Artifacts ou Canvas devient nécessaire parce que le participant doit agir sur
le résultat et vérifier ses états.

Le test passe si :

1. les six cartes sont visibles ;
2. une carte peut changer de colonne ;
3. une carte peut être archivée ;
4. le total reste égal à six ;
5. la réinitialisation restaure l’état initial.

Le participant exécute lui-même les cinq gestes dans l’objet généré.

### B3 : Produire un livrable multiétape

Situation : analyser plusieurs fichiers, présenter un plan puis créer un brief
terminé.

Cowork ou Work devient nécessaire parce que la tâche combine plusieurs sources,
plusieurs étapes et un livrable final sous contrôle humain.

Le test passe si :

- le plan est présenté avant l’exécution ;
- un seul fichier final est produit ;
- les trois sections attendues sont présentes ;
- les six notes conservent leur source ;
- la contradiction n’est pas tranchée ;
- les fichiers d’entrée restent inchangés.

Le participant peut déposer le fichier final dans un vérificateur intégré au
site. Le vérificateur affiche chaque critère séparément et ne transmet aucun
contenu.

### B4 : Modifier un projet existant

Situation : une mini-application trie déjà les cartes mais n’affiche pas leurs
sources.

Claude Code ou Codex devient nécessaire parce que la tâche exige d’inspecter un
projet, de modifier du code, de lancer un test et de relire les changements.

Le test passe si :

- la source apparaît sous chaque carte ;
- le tri existant fonctionne encore ;
- `node --test` réussit ;
- les modifications restent limitées à la demande ;
- le participant relit les changements avant de les accepter.

### Checkpoint final

Quatre situations inédites demandent de choisir un niveau :

- Chat ;
- objet avec Artifacts ou Canvas ;
- travail multiétape avec Cowork ou Work ;
- projet logiciel avec Claude Code ou Codex.

Chaque décision est justifiée par la sortie, le contexte, l’action et la preuve.
Le checkpoint valide la capacité de transfert, pas la mémorisation des noms de
produits.

## 7. Rôle et structure du kit

Le libellé visible devient « Kit d’entraînement du Bloc B ». Le dossier source
`kits/bloc-b-assistant/` et l’URL publique du ZIP sont conservés pour ne pas
casser les liens existants. Le kit constitue un jeu de données et un banc de
test commun. Il ne contient pas le mode d’emploi principal du parcours, qui
reste dans les fiches du site.

Structure logique cible à l’intérieur de `kits/bloc-b-assistant/` :

```text
kit-bloc-b/
├── notes/
│   ├── demandes.md
│   ├── reunion.md
│   └── messages.md
├── mission-agent/
│   ├── sources/
│   └── sortie/
└── mini-application/
    ├── code
    └── tests
```

B1 et B2 utilisent uniquement les trois fichiers de `notes/`. B3 utilise
`mission-agent/`, dont `sources/` contient une copie indépendante des trois
notes afin que B3 puisse démarrer sans B1 ni B2. B4 ouvre
`mini-application/`, qui contient son propre état initial et ses tests.

Le kit peut contenir un court fichier `LIRE-EN-PREMIER.md` qui précise seulement
qu’il s’agit de données fictives et renvoie vers la fiche du Bloc B. Les prompts,
les procédures et les corrections restent sur le site pour éviter une double
source de vérité.

## 8. Interface des fiches

B0 à B4 proposent un sélecteur persistant :

- « Je suis la voie Claude » ;
- « Je suis la voie OpenAI ».

Le choix fait dans B0 reste actif pendant tout le Bloc B. Les deux voies
partagent la situation, l’objectif et le test. Seules les instructions
d’exécution propres au produit changent.

Le choix est conservé localement dans le navigateur sous la clé
`bloc-b-ecosystem`. Il ne crée pas de nouvelles routes et peut être modifié
depuis chaque fiche.

Sans JavaScript, les deux voies restent visibles l’une sous l’autre. Le contenu
essentiel n’est jamais caché derrière un survol.

Chaque mission reprend le même ordre :

1. Situation
2. Pourquoi cette surface
3. Fichiers à fournir
4. Prompt à envoyer
5. Manipulation à effectuer
6. Tester mon résultat
7. Corriger un échec

## 9. Slides du présentateur

Les slides enseignent les relations génériques et nomment les deux équivalents.
Elles ne montrent pas deux tutoriels d’interface concurrents.

Grammaires visuelles :

- B0 : décision, choisir une voie et voir les quatre niveaux ;
- B1 : transformation, notes vers réponse vérifiable ;
- B2 : simulation, manipuler et tester les états d’un objet ;
- B3 : séquence, sources vers plan puis livrable contrôlé ;
- B4 : checkpoint, projet vers test et revue des changements ;
- fin du Bloc B : décision, classer quatre situations inédites.

Le détail des clics, fichiers et prompts reste sur la fiche participant.

## 10. Robustesse

- Chaque brique repart directement des fichiers du kit.
- Un échec dans une brique ne bloque pas la suivante.
- Chaque test comporte un état réussi et des échecs nommés.
- Une correction modifie uniquement le critère en échec.
- Les données sont entièrement fictives.
- Le vérificateur B3 travaille localement dans le navigateur.
- Le choix de voie peut être changé explicitement sans perdre l’accès à l’autre
  contenu.

## 11. Accessibilité

- Le sélecteur utilise des contrôles HTML natifs avec un focus visible.
- Les deux voies restent lisibles sans JavaScript.
- Les états réussi et échoué ne reposent pas sur la couleur seule.
- Les interactions B2 sont décrites sous forme de liste de tests.
- Les slides fournissent un nom accessible, une description complexe et un état
  final compréhensible sans mouvement.
- `prefers-reduced-motion` désactive les mouvements non essentiels.

## 12. Vérification

La livraison est terminée lorsque :

- B0 à B4 nomment les deux voies et les quatre niveaux de façon cohérente ;
- B4 appartient au socle obligatoire ;
- le kit ne se présente jamais comme le projet personnel ;
- chaque mission suit les sept rubriques communes ;
- les prompts et fichiers à utiliser sont explicitement nommés ;
- chaque test est binaire et observable ;
- le checkpoint final couvre quatre situations inédites ;
- le choix de voie persiste entre les fiches ;
- les deux voies restent accessibles sans JavaScript ;
- le vérificateur B3 ne transmet aucun fichier ;
- le ZIP public correspond à la structure source ;
- les tests de contenu, de présentation, du kit et du build passent ;
- les slides passent les tests silencieux, du coup d’œil et de nécessité ;
- les vues sont relues en 16:9, sur écran étroit et sur mobile.

## 13. Sources produit

- OpenAI, « ChatGPT Work and Codex » :
  <https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex>
- OpenAI, « Using Canvas in ChatGPT » :
  <https://help.openai.com/en/articles/9930697-using-canvas-in-chatgpt>
- Anthropic, « What are artifacts and how do I use them? » :
  <https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them>
- Anthropic, collection « Claude Cowork » :
  <https://support.claude.com/en/collections/19667525-claude-cowork>
