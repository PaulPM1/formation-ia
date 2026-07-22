# B4 et B4-bis facultatives

**Date :** 22 juillet 2026

**Statut :** design validé

## Intention

B4 « Claude Code » et B4-bis « Setup VS Code » restent disponibles comme approfondissements, mais ne bloquent plus le parcours principal. Le public doit comprendre sans commentaire que ces deux briques peuvent être ouvertes à la demande et que le parcours obligatoire relie directement B3 à C1.

La suppression des contenus, routes et composants est exclue. Les onze slides restent accessibles par leur URL actuelle et depuis les sommaires.

## Contrat pédagogique

**Thèse silencieuse :** B4 et B4-bis sont utiles, mais facultatives.

**Grammaire :** séquence avec branche optionnelle.

Le parcours principal suit :

`B3 → C1`

La branche facultative suit :

`B3 → B4 → B4-bis → C1`

Le bouton « Suivante » de la dernière slide B3 ouvre directement la première slide C1. Le bouton « Précédente » de cette première slide C1 revient à la dernière slide B3. Lorsqu'une personne ouvre B4 ou B4-bis depuis un sommaire, les boutons précédent et suivant parcourent normalement les onze slides facultatives, puis rejoignent C1.

## Représentation visuelle

B4 et B4-bis portent un état explicite `optional` dans le modèle de présentation et une priorité `facultatif` dans leurs fiches MDX.

Cet état est visible à trois endroits :

1. les cartes du catalogue `/briques` ;
2. le sommaire `/presenter` ;
3. le sommaire ouvert depuis une slide.

Le traitement utilise une surface et une bordure grisées, avec un badge textuel « Facultatif ». La couleur grise ne constitue jamais l'unique indication. Les titres et liens conservent un contraste lisible, un focus visible et leur comportement normal. L'opacité de la carte ou de la slide entière n'est pas réduite.

Une slide facultative affiche également le mot « Facultatif » dans son repère supérieur. Son contenu pédagogique et son accent de famille restent lisibles ; aucun visuel interne n'est redessiné.

## Modèle et navigation

`PresentationDeck` reçoit un booléen optionnel `optional`. `flattenSlides` le propage à chaque `RoutedSlide`.

`getSlideNeighbors` applique deux règles :

- pour une slide obligatoire, les voisins sont cherchés parmi les slides obligatoires seulement ;
- pour une slide facultative, les voisins sont cherchés dans la séquence complète.

Cette règle conserve les routes directes, la navigation interne des deux briques et les compteurs actuels, tout en faisant de B4 et B4-bis une branche réellement contournable.

## Dépendances éditoriales

Aucune brique obligatoire ne doit déclarer B4 ou B4-bis comme prérequis. Les formulations qui affirment que le public les a déjà suivies sont remplacées par des formulations autonomes.

En particulier :

- C1 ne dépend plus formellement de B4 ;
- D1 ne dépend plus formellement de B4 et introduit directement IDE, terminal et dossier de projet ;
- D2-bis ne dépend plus formellement de B4-bis ;
- le socle commun de l'atelier ne compte plus B4-bis comme brique obligatoire et la présente comme guide de rattrapage si le poste n'est pas prêt ;
- les mentions de B4 dans les contenus obligatoires E3 et dans les notes de slides obligatoires sont reformulées autour de la boucle de petites étapes vérifiées.

Les briques déjà facultatives peuvent continuer à proposer B4 ou B4-bis comme approfondissements liés.

## Accessibilité et repli

Le statut est rendu en texte dans le HTML. Sans CSS, les mots « Facultatif » restent visibles dans les cartes et sommaires. Sans JavaScript, les routes directes et les liens de sommaire restent utilisables. La navigation principale calculée côté serveur conserve le saut B3 vers C1.

Le traitement grisé respecte les contrastes existants et ne change ni l'ordre du DOM ni l'ordre de tabulation.

## Vérification

La livraison doit vérifier :

1. B4 et B4-bis existent toujours dans les fiches, manifestes et routes ;
2. leurs onze slides restent accessibles ;
3. B3 mène à C1 et C1 revient à B3 ;
4. une route B4 parcourt B4 puis B4-bis avant C1 ;
5. les trois sommaires visuels affichent « Facultatif » sans dépendre de la couleur ;
6. aucune brique obligatoire ne déclare B4 ou B4-bis comme prérequis ;
7. le socle de l'atelier ne compte plus B4-bis comme étape requise ;
8. les tests silencieux, coup d'œil et nécessité passent : la branche facultative se comprend sans commentaire, se repère immédiatement et le saut de navigation clarifie réellement le parcours ;
9. `npm test`, `npm run content:check`, `npm run presentation:check`, `npm run typecheck` et `npm run build` réussissent ;
10. les QA navigateur du présentateur et du bloc B réussissent.

## Hors périmètre

- supprimer ou renuméroter B4 et B4-bis ;
- déplacer leurs slides à la fin de la présentation ;
- réécrire leurs contenus pédagogiques ;
- supprimer les composants visuels partagés avec les blocs D et E ;
- modifier A3, A4 ou les autres choix de priorité existants.
