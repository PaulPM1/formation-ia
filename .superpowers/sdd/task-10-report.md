# Task 10 — Revue finale du présentateur

Date : 15 juillet 2026

Base des corrections : `5e3ef69`

Périmètre : revue globale du mode `/presenter`, 76 slides A1 à C3

## Corrections livrées

- Le contrôleur exclut désormais `summary` et les autres contrôles natifs des
  raccourcis globaux. La recette ouvre et ferme la correction A5 avec Espace et
  Entrée sans changer de slide ni d’URL ; les flèches et Espace dans les radios,
  liens et boutons restent locaux au contrôle.
- Les pistes grid, scènes et descendants flexibles ont des contraintes
  intrinsèques sûres. Le masquage horizontal du `body` a été supprimé. Les halos
  cessent leur mouvement et leur flou seulement lorsque la largeur effective est
  très réduite. Les 76 routes tiennent dans 390 × 844, y compris `a5-risk`, et la
  mission A5 reste fluide à 200 %.
- La 404 statique conserve un message générique exact sans JavaScript et propose
  toujours un retour vers le présentateur. Après chargement, une URL inconnue sous
  `/presenter/` affiche « Slide introuvable » et un chemin de reprise explicite ;
  une URL générique conserve « Page introuvable ».
- `astro check` fait partie du build. Le modèle et la validation d’exécution
  contrôlent familles A–F, identifiants, cohérence famille/brique/slide, rôles,
  ordre exact des decks — contigu à partir de 1 et cohérent avec leur position
  dans le tableau —, notes et durées formateur, contrats de liens, clé et données
  visuelles, et unicité des decks/slides. Les 76 slides restent valides ; les
  trous et les tableaux inversés disposent de messages actionnables.
- Le bouton plein écran expose `aria-pressed="false"` dès le HTML, met à jour son
  état et son libellé sur `fullscreenchange`, puis annonce un refus de l’API dans
  la zone `aria-live` sans rejet non géré.
- `scripts/qa-presenter.mjs` pérennise la recette navigateur : 76 mobiles,
  contrôles natifs, plein écran et rejet, 404, zoom A/B/C, mouvement réduit,
  impression et inventaire des 77 pages du présentateur. La 404 est aussi
  contrôlée sans JavaScript, avec son repli générique exact.

## Preuves fraîches

Toutes les commandes ci-dessous ont été exécutées après les dernières
corrections et ont quitté avec le code 0 :

| Commande | Résultat |
|---|---|
| `npm test` | 92/92 tests |
| `npm run content:check` | 24 briques valides |
| `npm run presentation:check` | 76 slides valides |
| `npm run typecheck` | 0 erreur, 0 warning, 0 hint |
| `npm run build` | 104 pages statiques générées |
| `npm run qa:a5-mission` | clavier, mobile, zoom 200 %, no-JS, plein écran, impression et reflow valides |
| `npm run qa:font-floor` | 76/76 routes à au moins 12 px |
| `npm run qa:block-b` | 33/33 routes desktop et mobile |
| `npm run qa:block-c` | 19/19 routes desktop/mobile, no-JS, reduced-motion et clavier |
| `npm run qa:presenter` | 76/76 mobiles, contrôleur, 404, plein écran, zoom, reduced-motion et print ; 77 pages |
| `find dist/presenter -name index.html \| wc -l` | 77 |
| `git diff --check` | aucune erreur d’espacement avant commit |

## Résultat

Les cinq findings de la revue globale sont couverts par des tests de régression
durables. Aucun accès réseau tiers, clic externe ou effet de bord distant n’est
utilisé par la recette.
