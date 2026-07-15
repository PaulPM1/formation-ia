---
name: slide-visual-director
description: Conçoit, adapte et vérifie les visuels des slides Web de la formation Les briques du Vibe Coding. Utiliser lors de toute création, refonte ou modification d'une slide, d'une interaction pédagogique, d'un diagramme, d'une animation ou d'un composant sous /presenter.
---

# Directeur visuel des slides

## Entrées obligatoires

Lire la thèse, l'objectif pédagogique, la slide précédente, la slide suivante,
les données disponibles et les contraintes du public. Lire
`references/visual-contract.md` avant de modifier un visuel.

## Workflow

1. Reformuler en une phrase ce que le public doit comprendre sans commentaire.
2. Choisir une grammaire : transformation, séquence, comparaison, système,
   décision, simulation, construction, mission ou checkpoint.
3. Définir les objets, relations, états et contrôles avant le style.
4. Choisir Astro/HTML pour la structure, SVG pour les relations spatiales, CSS
   pour les états simples et Canvas seulement pour une simulation dense.
5. Construire le visuel de façon responsive et progressivement améliorée.
6. Fournir un nom accessible, une description complexe et un état sans JS.
7. Désactiver le mouvement non essentiel avec `prefers-reduced-motion`.
8. Exécuter les tests silencieux, coup d'œil et nécessité.
9. Refuser tout effet, carte, flèche ou interaction qui n'encode aucune relation.

## Sortie

Indiquer la thèse, la grammaire choisie, l'interaction, le repli accessible et
le résultat des trois tests. Modifier uniquement les fichiers nécessaires.
