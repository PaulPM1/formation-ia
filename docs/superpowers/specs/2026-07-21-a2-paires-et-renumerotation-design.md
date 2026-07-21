# A2 — Choix par paires et renumérotation du bloc A

## Objectif

L’exercice A2 doit évaluer le niveau de solution nécessaire, sans demander aux participants de départager Claude et OpenAI lorsque les deux écosystèmes fournissent une surface équivalente.

La suppression d’A3 doit aussi être reflétée dans les identifiants visibles : la brique actuelle A4 devient A3 et la brique actuelle A5 devient A4.

## Prioriteur A2

Le prioriteur affiche quatre choix radio. Chaque choix représente une paire de solutions partageant la même valeur pédagogique :

| Valeur | Choix affiché | Sortie évaluée |
| --- | --- | --- |
| `chat` | Claude Chat / ChatGPT Chat | Réponse à relire |
| `object` | Claude Artifacts / ChatGPT Canvas | Objet éditable ou interactif |
| `work` | Claude Cowork / ChatGPT Work | Livrable professionnel multiétape |
| `code` | Claude Code / Codex | Changement vérifié dans un projet |

La correction cite les deux produits comme réponses valides. Elle explique le signal décisif et compare le choix à une autre paire trop faible ou trop large. Aucun écosystème n’est présenté comme prioritaire.

Les situations utilisent un ordre fixe volontairement non progressif :

1. corriger et tester un formulaire dans un dépôt ;
2. répondre brièvement à un email déjà fourni ;
3. analyser douze entretiens et produire deux livrables ;
4. créer et tester un calculateur interactif.

Le score reste calculé sur quatre décisions. Le replay revient au même ordre afin de faciliter l’animation et la correction collective.

## Interaction et accessibilité

La grammaire visuelle reste une décision : situation et signaux à gauche, quatre paires comparables à droite, validation puis correction.

- Radios et boutons HTML natifs.
- Un seul groupe de quatre radios par situation.
- Focus visible et feedback annoncé dans une région `aria-live`.
- Réponse correcte identifiable par du texte et une forme, pas uniquement par la couleur.
- Sans JavaScript, les quatre situations et leurs corrections restent lisibles.
- Les mouvements non essentiels restent neutralisés avec `prefers-reduced-motion`.

## Renumérotation

La migration renomme réellement les deux briques restantes du bloc A :

- `a4` « Les coûts » devient `a3` ;
- `a5` « Biais cognitifs des IA » devient `a4`.

La migration couvre les fichiers MDX, le frontmatter, les identifiants de decks et de slides, les routes du présentateur, les liens wiki, les prérequis, les scripts QA, les tests et les références éditoriales. Les briques B0 à F2 conservent leurs identifiants et leurs ordres actuels.

La navigation attendue devient `a2-prioritize → a3-three-costs`. Aucune route active `a4-*` ne doit encore désigner l’ancienne brique « Les coûts », et aucune route `a5-*` ne doit subsister.

## Vérification

- Tests de contenu : quatre valeurs de réponses uniques dans l’ordre `code`, `chat`, `work`, `object` et quatre choix affichant chacun deux produits.
- Tests d’état : erreur, bonne réponse, score, progression et replay.
- Tests de routage et d’inventaire : `a1`, `a2`, `a3`, `a4`, puis B0 à C3 ; absence de routes A5.
- QA A2 : clavier, mobile, zoom 200 %, mouvement réduit et état sans JavaScript.
- QA A4 renommée : la mission sur les biais reste accessible au clavier et au zoom 200 %.
- Suite complète, build, validation éditoriale et QA du présentateur.

## Tests visuels bloquants

- **Silencieux :** chaque paire exprime immédiatement le type de sortie qu’elle permet.
- **Coup d’œil :** quatre choix, et non huit produits concurrents, sont visibles sans balayage complexe.
- **Nécessité :** la validation vérifie le niveau de solution ; elle ne récompense plus un écosystème arbitraire.
