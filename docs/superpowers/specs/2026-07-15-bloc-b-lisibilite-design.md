# Bloc B — lisibilité vidéoprojecteur

## Objectif

Rendre les 33 slides du bloc B lisibles à 1280×720 sans scroll interne, sans
masquer de contenu et sans modifier le bloc C. Le repli sans JavaScript reste
complet et les interactions existantes conservent leur sens pédagogique.

## Système typographique

- Les métadonnées et labels HTML réellement secondaires ont un plancher de
  `0.70rem`.
- Les contrôles, preuves et statuts ont un plancher de `0.75rem`.
- Le contenu pédagogique courant vise `0.80rem` ou plus.
- Les titres gardent une différence nette, généralement `0.90rem` ou plus.
- Les textes SVG exprimés en pixels sont les seules exceptions typographiques :
  leur taille appartient au `viewBox` et reste comprise entre 12 et 19 unités.
- Les légendes visuellement masquées peuvent conserver leur technique de
  masquage, mais ne doivent pas introduire de petit texte visible.

## Recomposition

Les scènes mission et checkpoint du bloc B retrouvent des tailles lisibles via
des colonnes plus équilibrées, des espacements plus courts et des listes plus
compactes. Les six visuels spécialisés suivent les mêmes planchers : les
petites tailles ne sont pas compensées par du scroll ou du contenu caché. Les
zones denses utilisent davantage la largeur disponible, réduisent les marges
et regroupent les métadonnées sans modifier leur ordre DOM.

## Vérification

Une garde de test analyse `presentation.css` et les six composants B. Elle
refuse les déclarations de police visibles inférieures aux planchers et exige
les tokens B. Le contrôle final comprend tests, build, `git diff --check`, puis
un sweep des 33 routes à 1280×720 et 390×844 avec comparaison des dimensions
client/scroll.

