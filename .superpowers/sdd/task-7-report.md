# Task 7 — Visuels interactifs du bloc B

## Résultat

- Commit : `b1e8133 feat: illustrer le bloc B en interactions`.
- 33 routes B vérifiées : 27 routes spécialisées distribuées selon leur payload réel, 6 routes conservées sur les scènes partagées mission/checkpoint.
- Registre exact : `setup-diagnostic`, `prompt-builder`, `artifact-test-loop`, `pacte-workspace`, `ipmtr-loop`, `workspace-triptych` pointent vers les six nouveaux composants.
- État HTML initial complet : les panneaux utiles et les deux états de comparaison restent lisibles sans JavaScript ; les contrôles d’enrichissement sont désactivés avant activation du script.
- Densité B ajustée uniquement pour cette famille afin que les 33 scènes tiennent dans le cadre 16:9 à 1280×720 sans scroll interne.

## Direction visuelle par famille

| Famille | Thèse silencieuse | Grammaire | Interaction | Repli accessible |
| --- | --- | --- | --- | --- |
| SetupDiagnostic | Un setup se diagnostique de Compte à Repli par des preuves observables. | Décision / diagnostic | Radios natifs pour plateformes et états ; panneaux de plateforme synchronisés. | Graphe complet, toutes les plateformes et toutes les étapes visibles ; contrôles désactivés. |
| PromptBuilder | Objectif, contexte, contraintes et forme s’assemblent en un brief relisible. | Construction | Quatre boutons-blocs activables, jamais du drag-only ; résultat recalculé. | Les quatre blocs et le brief final complet sont rendus dans le HTML. |
| ArtifactTestLoop | L’objet traverse trois tests puis une correction ciblée sur une boucle unique. | Boucle de test | Boutons d’étape qui isolent l’objet, chaque test et la correction. | Chemin SVG et tous les panneaux sont visibles simultanément. |
| PacteWorkspace | Sources, plan, permissions, sortie et originaux forment une frontière de travail. | Système / frontière | Checkbox native qui bascule du périmètre large au périmètre borné. | Les deux frontières et la prohibition sur les originaux sont rendues. |
| IpmtrLoop | Inspecter, Planifier, Modifier, Tester et Relire forment une boucle avec preuves bloquantes. | Séquence bouclée | Permission, test et diff arrêtent réellement la progression tant qu’ils ne sont pas cochés. | Les cinq étapes, leurs preuves et les trois portes validées restent visibles. |
| WorkspaceTriptych | Explorateur, éditeur et terminal sont trois vues du même chemin. | Système / comparaison | Boutons de panneau et boutons macOS/Windows mettent à jour commandes et suffixes attendus. | Les trois volets et les commandes des deux plateformes sont présents dans le HTML. |

## TDD et vérification

- RED observé : `npx tsx --test --test-name-pattern="bloc B" tests/**/*.test.ts` échouait sur le premier import `SetupDiagnostic`, les helpers absents et les six fichiers manquants.
- GREEN : tests sur les 27 variantes réelles de `B_DECKS`, l’assemblage de prompt, les commandes plateforme, la visibilité progressive et les portes I.P.M.T.R.
- Vérification finale : `npx tsx --test --test-name-pattern="bloc B|présentation" tests/**/*.test.ts` — 12/12 sous-tests réussis.
- Build final : `npm run build` — contenu valide, 104 pages générées.
- Browser QA locale :
  - 33/33 routes sans débordement interne à 1280×720 ;
  - 33/33 cadres visuels sans débordement horizontal à 390×844 ;
  - état sans JS complet et aucun contrôle d’enrichissement actif ;
  - comportements ciblés prompt, Artifact, permission, I.P.M.T.R. et triptyque réussis ;
  - navigation clavier opérable et mouvement réduit à `0s` / `0.01ms` ;
  - inspection visuelle desktop + mobile de B0, B1, B2, B3, B4 et B4-bis.

## Trois tests bloquants

- Silencieux : réussi — chaque claim est porté par une relation centrale (chaîne, assemblage, boucle ou frontière) et non par une série de cartes génériques.
- Coup d’œil : réussi — les chemins SVG continus et les états actifs donnent un parcours immédiat.
- Nécessité : réussi — chaque contrôle modifie une relation pédagogique observable ; aucun bouton ornemental ni flèche décorative.

## Auto-revue

- Aucun mapping statique B ne pointe encore vers `StaticConceptScene`.
- Aucun `onclick`, contrôle drag-only, chemin SVG fragmenté ou panneau essentiel dépendant du survol.
- `prefers-reduced-motion` est présent dans les six composants.
- `git diff --check` est propre.
- Préoccupation restante : aucune.

## Fix pass — boucle, routage Artifact et transition

- I.P.M.T.R. suit désormais strictement `I → P → M → T → R → I` : permission entre P et M, test entre T et R, diff entre R et I. Relire n’est plus terminal et le bouton, le statut ainsi que les repères SVG annoncent la prochaine porte.
- Les variantes Artifact `tests` et `correction` possèdent respectivement cinq et trois nœuds SVG adressables. Les boutons d’étape synchronisent nœud, panneau et état pressé ; « Vue d’ensemble » restaure tous les nœuds et panneaux sans empiler artificiellement les cartes.
- Les variantes `transfer`, `anatomy` et `mvp` ont chacune un visuel central distinct alimenté par leur payload réel ; la boucle générique n’est plus rendue sur ces routes.
- `b4-transition` affiche `atelier-ia/bonjour.txt` comme chemin partagé et « Setup VS Code » séparément comme transition suivante.

### Régressions et preuves

- Cycle RED observé sur quatre tests ciblés : ordre/portes I.P.M.T.R., sémantique du triptyque, routage/synchronisation Artifact et annonces des portes.
- Vérification finale fraîche : `npm test` — 52/52 sous-tests réussis.
- Build final frais : `npm run build` — contenu valide et 104 pages générées.
- Inspection des routes générées : aucune boucle sur `b2-object`, `b2-anatomy` et `b2-mvp` ; cinq nœuds sur `b2-tests`, trois sur `b2-correction` ; trois portes présentes sur `b4-ipmtr` ; aucune destination « Setup VS Code » utilisée comme chemin partagé.
- Le navigateur intégré requis pour la re-vérification visuelle ciblée n’était pas exposé dans cette session. La QA navigateur exhaustive du commit initial reste documentée plus haut ; ce fix pass a donc été contrôlé par tests, build et HTML statique généré, sans nouvelle affirmation de contrôle visuel interactif.

## Fix pass 2 — densité, fidélité du comparatif et portes rejouables

- Root cause Artifact : les cinq panneaux de `b2-tests` formaient trois rangées et « Vue d’ensemble » occupait seul une rangée de contrôles. La vue complète utilise désormais une rangée de contrôles et une rangée de panneaux dimensionnée par `--artifact-panel-count` ; l’état isolé conserve un panneau large, et le repli sans JavaScript conserve l’intégralité de la boucle, des contrôles et des preuves.
- Root cause Prompt : le renderer commun remplaçait l’output de la variante `comparison` par les questions actives. `promptOutputForVariant` traite maintenant le vrai `after` du manifeste comme cible immuable ; les boutons relient seulement les dimensions d’ambiguïté à ce brief final.
- Root cause I.P.M.T.R. : les cases cochées n’étaient jamais consommées. `advanceIpmtrCycle` remet à faux la porte franchie ; chaque nouveau tour rebloque donc successivement permission, test et diff.

### TDD et vérification

- RED observé sur trois régressions : helpers absents pour la conservation du `after` et la consommation du cycle, contrat CSS de densité absent.
- GREEN ciblé : 3/3 tests réussis, y compris le second tour complet de permission/test/diff.
- Vérification fraîche : `npm test` — 55/55 sous-tests réussis.
- Build frais : `npm run build` — contenu valide et 104 pages générées.
- `git diff --check` propre ; seuls quatre fichiers du bloc B et le test de présentation sont modifiés, aucun fichier du bloc C.
- HTML généré : le vrai brief final est présent comme contenu et cible de `b1-vague` ; les routes Artifact exposent respectivement `--artifact-panel-count: 5` et `3`.
- QA navigateur ciblée à 1280×720, exécutée par le thread principal sur le workspace partagé :
  - `b2-tests` : `clientHeight=140`, `scrollHeight=140`, `clientWidth=1045`, `scrollWidth=1045` ;
  - `b2-correction` : mêmes métriques `140/140` et `1045/1045` ;
  - `b1-vague` : l’output reste strictement égal à `data-prompt-target` à l’état initial et après chacun des quatre toggles, soit 5/5 états fidèles au manifeste ;
  - `b4-ipmtr` : le premier cycle bloque puis consomme permission, test et diff ; au second cycle, `I → P` rebloque permission et les trois checkboxes sont à `false`.
