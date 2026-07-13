# Formation IA interactive — Spécification de conception

Date : 13 juillet 2026
Statut : conception validée par Paul

## 1. Contexte

La formation « Les briques du Vibe Coding » se déroule sur environ deux jours et demi, du vendredi au dimanche. Elle accueille 11 à 25 participants de niveaux variés, équipés de Mac et de PC Windows. Aucun environnement technique n'est préparé à l'avance. Le seul prérequis demandé est un abonnement Claude Max suffisant pour éviter les limitations d'usage pendant le week-end.

Le dépôt GitHub public devient l'unique source canonique. Notion ne fait plus partie du processus éditorial. Le site doit être à la fois le support utilisé par les formateurs pendant la session et la ressource durable que les participants consultent, révisent et partagent ensuite.

## 2. Objectifs

Le produit doit permettre de :

- présenter la formation en plein écran sans maintenir un deck séparé ;
- guider les participants à travers un parcours progressif ;
- documenter les concepts, exercices et ressources dans une bibliothèque pérenne ;
- adapter les exercices à un public mixte grâce à un socle commun et des défis optionnels ;
- conserver la progression sur l'appareil du participant sans compte ni collecte de données ;
- versionner, relire et publier tout le contenu depuis GitHub ;
- isoler les concepts durables des manipulations spécifiques à l'écosystème Claude.

Le résultat pédagogique attendu est un ensemble de petits livrables indépendants qui converge vers une mini-application personnalisée. Celle-ci doit être versionnée sur GitHub et, lorsque le cas d'usage et le poste le permettent, publiée sur Vercel. Une application locale fonctionnelle reste une sortie acceptable lorsqu'un déploiement n'est pas pertinent.

## 3. Principes directeurs

### 3.1 Une seule source, plusieurs profondeurs

Chaque notion est rédigée une seule fois sous la forme d'une brique MDX. Cette brique alimente trois vues : parcours, bibliothèque et présentation. Les vues sélectionnent la profondeur utile, mais ne possèdent pas de copies éditoriales divergentes.

### 3.2 Concepts universels, pratique avec Claude

Les explications de fond portent sur des notions durables : contexte, tokens, agents, outils, itération, architecture, versionnement et sécurité. Les démonstrations et exercices utilisent Claude Chat, Artifacts, Cowork et Claude Code comme environnement pratique cohérent.

### 3.3 Théorie juste à temps

Une notion théorique est placée au moment où elle débloque l'action suivante. Le prompt et la gestion du contexte arrivent avant les premiers ateliers. Le cadrage précède Claude Code. Le code design est abordé lorsqu'un projet existe réellement.

### 3.4 Progression commune, personnalisation réelle

Tous les participants suivent les mêmes étapes et critères de réussite, mais choisissent leur cas d'usage : budget, révisions, organisation, voyage, habitudes ou autre besoin personnel compatible. Les plus rapides disposent de défis optionnels sans ralentir le socle commun.

## 4. Architecture de l'information

### 4.1 Accueil

L'accueil propose deux entrées :

- « Continuer le parcours », action principale pendant la formation ;
- « Explorer la bibliothèque », accès secondaire disponible à tout moment.

La bibliothèque reste discrète au début du camp. Les formateurs l'annoncent explicitement en milieu ou en fin de formation comme la ressource complète pour réviser et prolonger l'apprentissage.

### 4.2 Parcours

Le parcours présente les briques dans l'ordre pédagogique. Il affiche l'étape courante, les étapes terminées, les livrables produits et les défis optionnels. Il reste la porte d'entrée principale pendant la formation.

Routes conceptuelles :

- `/parcours` : vue d'ensemble et reprise de progression ;
- `/parcours/<brique>` : mission détaillée d'une brique ;
- `/parcours/<brique>#defis` : accès direct aux extensions optionnelles.

### 4.3 Bibliothèque

La bibliothèque réorganise les mêmes briques par thèmes, formats et niveaux. Elle permet une consultation libre et une recherche transversale.

Routes conceptuelles :

- `/bibliotheque` : index, recherche et filtres ;
- `/bibliotheque/<brique>` : fiche de référence complète ;
- `/bibliotheque/ressources` : commandes, liens et prolongements.

### 4.4 Présentation

Le mode présentation rend une version condensée de la brique en plein écran. Il est pilotable au clavier, au tactile et avec des contrôles visibles. Chaque slide possède une URL stable.

Routes conceptuelles :

- `/presenter` : ordre complet de la session ;
- `/presenter/<brique>/<slide>` : lien stable vers une slide ;
- une vue formateur, ouverte dans un onglet ou une fenêtre distincte, affiche notes, minutage, prochaine transition et liens de démonstration.

Les notes formateur restent publiques et ne contiennent aucun secret.

## 5. Modèle d'une brique pédagogique

Chaque brique est autonome et possède une responsabilité pédagogique claire.

### 5.1 Métadonnées obligatoires

- identifiant stable et slug ;
- titre et famille ;
- ordre dans le parcours ;
- priorité : socle ou bonus ;
- type : concept, démonstration, atelier, setup ou restitution ;
- durée cible ;
- prérequis ;
- objectif d'apprentissage ;
- résultat observable attendu ;
- plateformes concernées : commun, Mac, Windows ou navigateur.

### 5.2 Contenu obligatoire

1. **Cap** : objectif, prérequis, durée et résultat attendu.
2. **Concept durable** : explication indépendante de l'outil.
3. **Pratique avec Claude** : démonstration ou manipulation guidée.
4. **Mission commune** : consigne, étapes et critère de réussite.
5. **Livrable** : preuve concrète produite par le participant.
6. **Notes formateur** : déroulé, messages essentiels, pièges et transition.

### 5.3 Contenu optionnel

- défis avancés ;
- variantes par cas d'usage ;
- dépannage Mac et Windows ;
- ressources complémentaires ;
- ouverture vers un sujet avancé.

Une séquence de setup utilise le même modèle, avec un diagnostic initial et un test final obligatoires.

## 6. Progression pédagogique sur 2,5 jours

### Jour 1 — Comprendre et créer

Objectif : passer de « l'IA répond » à « je fabrique un outil ».

1. Accueil, vérification de l'abonnement Claude et setup commun Mac/Windows.
2. LLM, contexte, hallucinations et distinction LLM/agent.
3. Prompt et gestion du contexte.
4. Claude Chat puis Artifacts.

Livrables : un prompt réellement utile et un Artifact personnalisé.

### Jour 2 — Agir et construire

Objectif : passer d'un outil isolé à une mini-application versionnée.

1. Cowork et mission courte sur des fichiers.
2. Cadrage, MVP et petites étapes testables.
3. IDE, terminal, dépôt, setup VS Code et GitHub juste à temps.
4. Claude Code et création de la mini-application.
5. Lecture de l'architecture du projet et sécurité essentielle.

Livrables : une mini-application locale personnalisée et un dépôt GitHub.

### Jour 3 — Connecter et livrer

Objectif : rendre le projet partageable et ouvrir les prolongements possibles.

1. Skills et MCP.
2. Déploiement Vercel lorsque pertinent.
3. Hooks, tâches planifiées et embeddings en démonstration ou défi.
4. Restitution des projets.
5. Présentation explicite de la bibliothèque.

Livrable cible : URL Vercel et dépôt GitHub. La validation locale constitue le repli prévu.

## 7. Fonctionnement pendant la formation

Le formateur avance dans le mode présentation. Lorsqu'un atelier commence, la slide affiche un QR code et une URL lisible vers la mission correspondante. Les deux pointent directement vers la route stable du site ; aucun service de raccourcissement externe n'est requis.

Le participant accède directement à :

- la consigne ;
- le résultat attendu ;
- les étapes adaptées à sa plateforme ;
- les commandes copiables ;
- l'aide au dépannage ;
- la validation de fin ;
- les défis optionnels.

Les écrans des participants ne sont pas synchronisés avec celui du formateur. Chacun peut avancer, revenir en arrière ou consulter la bibliothèque librement. Cette décision évite un backend, supprime les problèmes de reconnexion et respecte le rythme individuel.

Pour un groupe de 11 à 25 personnes, les étapes sont courtes et possèdent une validation visible. Les participants bloqués peuvent le signaler, tandis que les participants rapides avancent sur les défis. Les binômes servent de solution de secours pour les problèmes de setup individuels.

## 8. État local et confidentialité

Le site est public et ne requiert aucun compte. Il ne collecte aucune donnée personnelle.

Le navigateur conserve uniquement :

- les briques marquées comme terminées ;
- les défis terminés ;
- le cas d'usage choisi ;
- la dernière position dans le parcours.

Ces données sont stockées dans `localStorage`. Un bouton permet de réinitialiser la progression. Si le stockage local est indisponible, le site continue à fonctionner sans persistance et affiche une information non bloquante. La progression n'est pas synchronisée entre appareils.

## 9. Architecture technique

### 9.1 Fondation

Le site utilise Astro, ses collections de contenu et l'intégration MDX. Le build génère un site statique déployé sur Vercel.

Les composants interactifs sont limités aux besoins réels :

- progression locale ;
- navigation des slides ;
- copie de commandes ;
- QR codes ;
- recherche et filtres ;
- panneau formateur.

Il n'existe ni API applicative, ni base de données, ni serveur requis à l'exécution.

### 9.2 Composants logiques

- **Collection de briques** : charge et valide les fichiers MDX.
- **Index pédagogique** : trie les briques et construit le parcours.
- **Index documentaire** : construit au moment du build les thèmes, filtres, relations et l'index de recherche utilisé côté navigateur.
- **Rendu apprenant** : affiche mission, progression, livrable et défis.
- **Rendu bibliothèque** : affiche la fiche complète et les ressources.
- **Rendu présentation** : transforme les segments de slides en écran plein format.
- **Store local** : encapsule lecture, écriture, migration et réinitialisation de la progression.
- **Validation de contenu** : contrôle les métadonnées, liens et ressources au build.

Chaque composant dépend du modèle public de la brique, et non des détails internes des autres rendus.

### 9.3 Flux de données

```text
Briques MDX versionnées
        ↓
Validation des métadonnées et références
        ↓
Collections Astro
        ├── Index pédagogique → Parcours → progression locale
        ├── Index documentaire → Bibliothèque → recherche et filtres
        └── Segments de slides → Présentation → notes formateur
        ↓
Build statique → Preview Vercel → Production Vercel
```

## 10. Direction visuelle — Kit de construction

L'identité reprend littéralement l'idée de briques sans adopter un ton enfantin.

Principes :

- formes géométriques franches et contours nets ;
- couleur d'accent propre à chaque famille pédagogique ;
- compositions modulaires qui montrent l'empilement et les relations ;
- typographie forte, très lisible sur vidéoprojecteur ;
- peu de texte par slide ;
- absence de gradients « IA », de verre translucide et d'imitation des interfaces Claude ;
- déclinaison plus calme pour la lecture longue dans la bibliothèque.

Le mode présentation peut employer des compositions plus expressives. Le parcours et la bibliothèque conservent la même grammaire visuelle avec une densité et un contraste adaptés à la lecture.

## 11. Robustesse et erreurs

Le système doit échouer tôt pendant l'édition et rester utilisable pendant la formation.

Le build est bloqué si :

- une métadonnée obligatoire manque ;
- deux briques partagent le même identifiant ;
- l'ordre pédagogique est incohérent ;
- un lien interne, une image ou un fichier requis manque ;
- une mission ne possède pas de critère de réussite ;
- une séquence présentée ne possède pas de notes formateur.

Un élément optionnel absent est masqué sans faire échouer le build.

Dans le navigateur :

- une erreur de `localStorage` désactive uniquement la persistance ;
- une erreur d'un composant interactif ne masque pas le texte essentiel ;
- les commandes restent sélectionnables si le bouton de copie échoue ;
- les slides sont pilotables au clavier, au tactile et avec des boutons ;
- les contenus principaux ne dépendent pas d'une ressource externe chargée en direct ;
- une page inconnue propose un retour vers le parcours et la recherche.

## 12. Publication et workflow éditorial

La livraison suit des incréments verticaux afin que le support reste présentable à chaque étape :

1. une brique représentative rendue dans les trois vues, avec navigation et validation de contenu ;
2. le parcours SOCLE complet, la progression locale et le mode présentation utilisable ;
3. la bibliothèque, la recherche et les ressources Mac/Windows ;
4. les briques BONUS, les défis avancés et la finition visuelle ;
5. la répétition générale et les corrections issues du chronométrage.

Cette séquence fait partie d'un seul plan d'implémentation, mais interdit de remplir tout le curriculum avant d'avoir validé le flux complet sur une première brique.

1. Créer ou modifier une brique MDX dans le dépôt.
2. Lancer les validations de contenu et le build local.
3. Ouvrir une pull request.
4. Consulter la preview Vercel.
5. Relire simultanément les trois rendus de la brique.
6. Fusionner après validation.
7. Déployer automatiquement la branche principale.

Le dépôt public conserve l'historique des décisions et permet aux participants de proposer ultérieurement des corrections.

## 13. Stratégie de test

### Automatisée

- validation du schéma des briques ;
- unicité des identifiants et cohérence de l'ordre ;
- détection des liens internes et ressources manquants ;
- build Astro complet ;
- génération de toutes les routes statiques ;
- tests du store de progression, y compris stockage indisponible et réinitialisation ;
- tests de navigation entre parcours, bibliothèque et présentation ;
- contrôle des liens profonds et QR codes ;
- contrôles d'accessibilité sur les pages essentielles.

### Manuelle

- navigation clavier et tactile du mode présentation ;
- lecture sur ordinateur et mobile ;
- répétition sur le vidéoprojecteur utilisé pendant la formation ;
- test des consignes de setup sur au moins un Mac et un PC Windows ;
- répétition chronométrée du parcours complet ;
- vérification d'un atelier avec un participant débutant et un participant initié si possible.

## 14. Hors périmètre de la première version

- authentification et comptes participants ;
- collecte ou centralisation de progression ;
- soumission et correction de livrables ;
- synchronisation en direct avec le formateur ;
- espace d'administration ou CMS ;
- synchronisation Notion ;
- backend ou base de données ;
- collaboration en temps réel ;
- fonctionnement hors ligne garanti ;
- application mobile native ;
- comparaison pratique de plusieurs fournisseurs d'IA.

## 15. Critères de réussite

La première version est réussie si :

- les formateurs peuvent présenter toute la formation sans deck externe ;
- un participant accède à chaque atelier en un scan ou un lien ;
- un même fichier de contenu alimente correctement les trois vues ;
- la progression locale fonctionne sans créer de compte ;
- le parcours commun reste réalisable par un débutant ;
- les participants avancés disposent de défis sans bloquer le groupe ;
- chaque participant produit plusieurs petits livrables et une mini-application versionnée ;
- la bibliothèque reste compréhensible et utile sans avoir assisté à la session ;
- une nouvelle brique peut être ajoutée sans modifier les trois systèmes de rendu séparément ;
- les formateurs peuvent répéter le parcours complet sans erreur bloquante.
