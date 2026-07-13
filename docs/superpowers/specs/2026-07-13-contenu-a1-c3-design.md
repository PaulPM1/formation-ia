# Contenu pédagogique A1 à C3 — Spécification de conception

Date : 13 juillet 2026  
Statut : conception validée par Paul

## 1. Objectif

Rédiger intégralement les 14 briques pédagogiques comprises entre A1 et C3 :

- A1 à A5 ;
- B0 à B4, y compris B4-bis ;
- C1 à C3.

Le résultat doit être prêt à animer pendant la formation et rester utile comme
bibliothèque publique après celle-ci. Le contenu s'adresse à des adultes
débutants, tout en proposant des prolongements séparés pour les participants
plus rapides.

## 2. Livrable éditorial

Chaque fichier MDX conserve sa structure actuelle et renseigne toutes ses
rubriques. Le contenu commun comprend :

- un cap indiquant l'objectif, la durée, les prérequis et le résultat observable ;
- un concept durable, expliqué indépendamment d'une interface particulière ;
- une pratique reproductible avec Claude ;
- une mission commune liée à un cas d'usage personnel ou professionnel ;
- un livrable concret que le participant peut conserver ou montrer ;
- des notes formateur avec minutage, messages clés, pièges et transition ;
- des défis avancés qui ne ralentissent pas le socle commun ;
- des variantes, du dépannage, des ressources officielles et une ouverture.

Les briques de démonstration comprennent également un scénario et un déroulé
étape par étape. Les setups commencent par un diagnostic initial et se terminent
par un test final visible, avec des solutions adaptées à macOS et Windows.

Après rédaction, les 14 fichiers passent au statut `a-relire`. Les champs
`learningObjective` et `expectedOutcome` sont renseignés. Le champ
`owner` reste à `a-attribuer` afin de ne pas attribuer arbitrairement la relecture.

## 3. Progression pédagogique

### A — Comprendre l'IA

- A1 explique la prédiction de texte, les tokens et le contexte sans assimiler
  le modèle à une base de connaissances.
- A2 distingue un LLM d'un agent capable d'utiliser des outils et d'enchaîner
  des actions sous contrôle humain.
- A3 explique les raisons pédagogiques du choix de Claude pour le code, sans
  discours commercial ni comparaison absolue.
- A4 rend concrets les facteurs de coût, les limites d'usage et les pratiques
  permettant d'éviter le gaspillage.
- A5 installe une méthode de vérification face aux biais, hallucinations et
  réponses formulées avec une confiance trompeuse.

### B — Utiliser les interfaces

- B0 vérifie l'accès à Claude, les réglages utiles et la capacité à démarrer une
  conversation.
- B1 apprend à dialoguer, fournir du contexte, demander un format et itérer.
- B2 transforme une demande en petit outil interactif avec Artifacts.
- B3 montre comment agir sur un dossier de fichiers avec Cowork, dans un
  périmètre explicite et avec validation humaine.
- B4 introduit Claude Code dans un projet local et montre la boucle inspection,
  modification, vérification.
- B4-bis installe VS Code et valide l'ouverture d'un dossier, du terminal et
  d'un fichier.

### C — Étendre et personnaliser

- C1 encapsule une méthode réutilisable dans un Skill simple.
- C2 distingue une API de MCP, puis montre comment une connexion outillée met
  des données ou actions à disposition de Claude.
- C3 distingue hooks et tâches planifiées, puis montre des automatisations
  bornées, observables et réversibles.

## 4. Fil rouge et autonomie des briques

Chaque participant choisit un besoin simple, personnel ou professionnel :
organisation, budget, révision, voyage, habitudes ou un autre cas compatible.
Les missions font progresser ce même besoin vers un assistant ou un mini-outil.

Chaque brique reste néanmoins autonome. Un participant qui rejoint une étape en
cours peut réaliser la mission avec un exemple fourni sans dépendre des
livrables précédents.

## 5. Ton et niveau de détail

Le texte emploie des phrases courtes, définit le jargon au premier usage et ne
suppose aucune connaissance du développement. Les analogies servent à expliquer
un mécanisme mais sont suivies de sa formulation exacte.

Les manipulations sont courtes, copiables et accompagnées d'un résultat attendu.
Les notes formateur sont opérationnelles sans devenir un script mot à mot. Les
défis avancés sont clairement identifiés comme facultatifs.

Les fonctionnalités susceptibles d'évoluer sont vérifiées avant rédaction dans
les documentations officielles d'Anthropic, de Claude Code, de MCP et des outils
concernés. Le contenu évite toute promesse durable sur les offres, quotas, prix
ou emplacements exacts de l'interface lorsque ceux-ci peuvent changer.

## 6. Sécurité et garde-fous

Les exercices appliquent les règles suivantes :

- ne jamais transmettre de secret, jeton, donnée sensible ou information client ;
- lire et comprendre les actions proposées avant de les autoriser ;
- distinguer les faits sourcés, les hypothèses et le contenu généré ;
- limiter les permissions et le périmètre des dossiers accessibles ;
- privilégier les actions réversibles et conserver une copie des fichiers utiles ;
- proposer une alternative lorsqu'une fonction dépend d'une offre, d'une
  plateforme ou d'une interface indisponible.

## 7. Validation

La rédaction est terminée lorsque :

- les 14 fichiers ne contiennent plus de commentaires de gabarit ;
- chaque objectif et chaque résultat attendu est observable ;
- chaque mission indique une consigne, une progression et un critère de réussite ;
- les liens et affirmations liés aux produits ont été vérifiés auprès de sources
  officielles ;
- le contrôle éditorial et les tests automatisés passent ;
- le build Astro réussit ;
- les 14 pages sont générées et leur contenu principal est vérifié dans le rendu.

La vérification visuelle porte sur la lisibilité et l'intégrité du contenu
existant. Elle n'inclut aucune refonte du design ou modification fonctionnelle du
site.

## 8. Hors périmètre

- les briques D1 à F2 ;
- une refonte du modèle de contenu ou des pages Astro ;
- la création de comptes, d'un suivi serveur ou d'un backend ;
- l'attribution de la propriété éditoriale à Paul ou Matthieu ;
- la publication externe ou la fusion de la branche.
