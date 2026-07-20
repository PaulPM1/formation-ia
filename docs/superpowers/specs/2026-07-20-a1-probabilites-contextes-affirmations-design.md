# A1 — Probabilités, contexte et affirmations nuancées

Date : 20 juillet 2026  
Statut : conception validée par Paul

## 1. Objectif

Rendre les trois idées centrales de la brique A1 visibles sans commentaire :

1. l'entraînement d'un LLM génératif repose sur la prédiction répétée du
   prochain fragment à partir du contexte précédent ;
2. un même début de phrase peut recevoir des suites différentes lorsque le
   contexte change réellement ;
3. plausibilité locale, explication produite et vérité factuelle restent des
   propriétés distinctes.

Le public reste composé d'adultes débutants. La représentation évite les
mathématiques détaillées, mais ne doit pas laisser croire qu'un LLM génératif
retrouve arbitrairement un mot caché au milieu d'une phrase.

## 2. Périmètre

La modification concerne uniquement les slides A1 suivantes et les composants
ou tests directement nécessaires :

- `a1-opening` : démonstration automatique de l'entraînement par prédiction ;
- `a1-context` : comparaison de deux contextes réellement divergents ;
- `a1-plausible` : cinq affirmations nuancées à classer et expliquer.

La slide `a1-token-loop` reste la décomposition explicite de la génération
token après token. Elle prolonge l'ouverture sans la répéter : l'ouverture
montre l'entraînement, la deuxième slide montre la génération.

## 3. Ouverture — phrase cible progressive

### Thèse

**À l'entraînement, le modèle apprend à prédire la suite.**

Le visuel adopte une grammaire de séquence. Une phrase cible complète est
représentée par une ligne de mots masqués. L'animation révèle progressivement
le préfixe déjà connu et met en évidence le prochain emplacement à prédire.

Pour chaque étape :

1. le contexte déjà révélé est présenté au modèle ;
2. trois suites plausibles et des probabilités explicitement illustratives
   apparaissent brièvement ;
3. le mot attendu dans l'exemple d'entraînement est comparé à la prédiction ;
4. ce mot rejoint le contexte et l'animation avance automatiquement ;
5. en fin de phrase, la boucle « prédire → comparer → ajuster » est résumée,
   puis la démonstration peut recommencer après une pause.

Les probabilités ne prétendent pas provenir d'un modèle réel. Leur somme vaut
100 % à chaque étape et un libellé visible les présente comme une simulation
pédagogique. L'exemple emploie une phrase courte, concrète et lisible sur un
vidéoprojecteur.

La démonstration ne requiert aucun clic. Un bouton permet seulement de mettre
en pause ou de rejouer. Avec `prefers-reduced-motion`, la phrase finale et les
trois étapes « prédire, comparer, ajuster » sont immédiatement visibles. Sans
JavaScript, le même état final reste lisible dans le HTML.

## 4. Contexte — une ambiguïté résolue de deux façons

### Thèse

**Le contexte change le sens avant de changer les mots.**

Le visuel adopte une grammaire de comparaison synchronisée. Le même début de
phrase occupe le centre :

> Le navigateur a ouvert…

Deux contextes préparatoires produisent deux suites plausibles :

- contexte maritime : « Le vent se lève, l'équipage quitte le port. » →
  « les voiles » ;
- contexte informatique : « La page ne répond plus, il relance Chrome. » →
  « un nouvel onglet ».

Le contrôle existant permet de basculer entre les deux contextes. La relation
doit être lisible comme une transformation `contexte → interprétation → suite`,
et non comme une simple différence de public ou de format. Sans JavaScript,
les deux branches restent affichées côte à côte.

## 5. Checkpoint — cinq affirmations nuancées

### Thèse

**Probable, cohérent et vrai ne désignent pas la même chose.**

Le checkpoint présente successivement cinq affirmations :

1. « Une erreur souvent répétée peut être plus probable qu'une vérité rarement
   formulée. »
2. « Le mot généré n'est pas nécessairement celui qui avait la probabilité la
   plus élevée. »
3. « Répéter une information dans le contexte peut renforcer son influence
   sans la rendre plus vraie. »
4. « Quand un LLM justifie sa réponse, il ne restitue pas forcément le calcul
   qui l'a réellement produite. »
5. « Des mots plausibles pris un par un ne garantissent pas une réponse
   cohérente dans son ensemble. »

Pour chaque affirmation, le participant choisit parmi `Exacte`, `Simplifiée`
et `À vérifier`, puis obtient une correction courte. La correction doit préciser
la nuance utile plutôt que se limiter à afficher une catégorie. Les cinq
affirmations sont accessibles depuis le même checkpoint, une par une, afin de
préserver la lisibilité projetée.

Les corrections attendues sont les suivantes :

| N° | Catégorie | Explication |
| --- | --- | --- |
| 1 | Exacte | La fréquence des formulations influence la plausibilité statistique ; elle ne constitue pas une preuve. |
| 2 | À vérifier | Cela dépend de la stratégie de décodage : un échantillonnage peut retenir un token moins probable, tandis qu'un décodage glouton choisit le premier. |
| 3 | Exacte | La répétition renforce le signal présent dans le contexte, sans modifier la réalité extérieure. |
| 4 | Exacte | Une justification générée peut être utile, mais elle n'est pas une lecture garantie des opérations internes du modèle. |
| 5 | Exacte | La prédiction est locale ; la cohérence globale doit encore être construite et contrôlée sur toute la réponse. |

La majorité de réponses `Exacte` est volontaire : le checkpoint révèle des
propriétés contre-intuitives plutôt qu'un quiz équilibré artificiellement. Le
formateur ne dévoile pas cette distribution avant la correction.

Sans JavaScript, la liste complète des affirmations, leurs catégories et leurs
explications est disponible dans des éléments natifs `details`. La catégorie
n'est jamais indiquée par la couleur seule.

## 6. Continuité narrative

La séquence A1 devient :

1. entraînement : prédire, comparer, ajuster sur une phrase cible ;
2. génération : réutiliser la prédiction token après token pour produire ;
3. contexte : faire varier le sens d'un même début de phrase ;
4. checkpoint : séparer probabilité, cohérence, justification et vérité ;
5. mission : améliorer une consigne et vérifier une réponse.

Les notes formateur et descriptions accessibles sont réécrites pour conserver
ces distinctions. Le terme « mot » peut être utilisé dans l'animation pour la
lisibilité, accompagné d'un rappel indiquant qu'en pratique le modèle manipule
des tokens, qui peuvent aussi être des fragments ou des signes.

## 7. Vérification

La modification est terminée lorsque :

- l'ouverture progresse automatiquement et reste contrôlable au clavier ;
- aucun masque ne suggère une prédiction arbitraire au milieu de la phrase ;
- les probabilités sont annoncées comme illustratives ;
- les deux contextes maritime et informatique sont compréhensibles sans oral ;
- les cinq affirmations possèdent chacune une catégorie et une explication ;
- les états finaux restent lisibles sans JavaScript et avec mouvement réduit ;
- les tests de contenu, de rendu des visuels et le build Astro passent ;
- les trois tests du contrat visuel passent : silencieux, coup d'œil et
  nécessité.

## 8. Hors périmètre

- brancher un modèle réel ou calculer de vraies probabilités ;
- expliquer les architectures neuronales ou la rétropropagation ;
- modifier la mission A1 ou les autres briques ;
- ajouter une interaction obligatoire à la démonstration automatique.
