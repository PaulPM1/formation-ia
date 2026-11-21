---
name: slide-visual-director
description: Conçoit, adapte et vérifie les visuels des slides Web de la formation Les briques du Vibe Coding. Utiliser lors de toute création, refonte ou modification d'une slide, d'une interaction pédagogique, d'un diagramme, d'une animation ou d'un composant sous /presenter.
---

# Directeur visuel des slides

## Le format (session 2)

Une slide montre, le formateur parle. Elle tient en un titre de 60 caractères
au plus, trois points de 45 caractères au plus, et une des cinq formes de
`src/presentation/presentation-model.ts` :

- `cover` : le titre seul, en grand, pour ouvrir un deck.
- `visual` : un visuel de `src/components/briques/`, désigné par son nom de
  fichier (`data.name`), avec `data.props` s'il en attend. `data.layout: 'side'`
  pose les points à gauche et le visuel à droite, pour un visuel étroit. Sans
  lui, le visuel occupe la largeur sous le titre (fenêtres d'application,
  animations à étapes). Pas de points sur une slide dont le visuel porte déjà
  ses étapes ou sa légende.
- `quiz` : une question, deux à quatre réponses, une seule bonne, un « pourquoi »
  chacune. `sort` : cinq à sept cartes à ranger dans deux cases. La salle vote,
  le formateur clique.
- `demo` : la consigne d'une démonstration en direct, trois ou quatre gestes.

Les visuels se créent avec le skill `creer-brique` (`.claude/skills/`) : une
brique et sa slide partagent le même visuel. Référence à imiter :
`src/presentation/manifests/b.ts`. Vérification obligatoire sur captures :
`node scripts/slide-shot.mjs <brique> <dossier>`.

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
