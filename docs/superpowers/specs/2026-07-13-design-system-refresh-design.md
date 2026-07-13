# Design System « Kit de construction » — Refonte du socle

**Date :** 2026-07-13
**Statut :** validé en maquette (Paper), à porter dans le code
**Fichier Paper :** FormationIA — artboards `Fondations`, `Lecture · A/B/C`, `Catalogue`
**Cible du portage :** `src/styles/global.css` (Astro statique, vanilla CSS)

## Contexte et objectif

Le thème « Kit de construction » existe déjà et est déployé (`src/styles/global.css`).
Il est cohérent mais souffre de deux défauts identifiés par le propriétaire :

1. **Titres trop gros, gras mal utilisé.** Une seule police display (Arial Black) →
   toute la hiérarchie est fabriquée par la taille (h1 jusqu'à `7.5rem` ≈ 120px) et le
   gras est posé partout (poids 800–850 sur titres, nav, labels, méta). Quand tout est
   gras, plus rien ne ressort.
2. **Présentation des blocs condensée.** Bordure 2px + ombre portée dure sur *chaque*
   élément → saturation visuelle ; cartes tassées, manque d'air.

Paper a servi de brouillon (approche « fondations d'abord, puis validation sur l'écran
le plus dur »). **Le code reste la seule source de vérité** : ce spec transcrit les
décisions validées visuellement pour les appliquer à `global.css`. Rien n'est ajouté au
runtime (pas de JS, pas de dépendance, pas d'asset externe).

## Ce qui NE change pas

- Le système pédagogique **couleur par famille** (A→F) — c'est un atout, conservé tel quel.
- L'architecture Astro/MDX statique, les 24 briques, le workflow éditorial.
- Focus clavier, skip link, HTML sémantique, responsive, comportement print, `prefers-reduced-motion`.
- Le vocabulaire « chantier » : contours encre, blocs modulaires, ombre décalée — mais **dosés**.

## Décisions — Fondations

### Typographie

Abandon des polices système. Duo validé :

- **Display : Archivo** (variable, poids 100→900 + axe de largeur `wdth` 62→125).
  Remplace Arial Black. L'axe de largeur permet des titres « signalétique » compressés
  **sans** surenchère de taille.
- **Texte : Inter** (poids 100→900). Lecture dense, ultra-lisible.
- **Code : mono** — **à trancher** entre Geist Mono et IBM Plex Mono (les deux dispo).
  Défaut retenu en maquette : Geist Mono.

Fallbacks web-safe à conserver dans la stack CSS (`Archivo, "Arial Narrow", sans-serif` /
`Inter, "Segoe UI", sans-serif`). Les polices doivent être auto-hébergées ou chargées
sans dépendance runtime bloquante (à valider à l'implémentation ; sinon garder un fallback
propre).

### La règle de poids (le vrai correctif)

> Seuls les **titres display (Archivo)** sont gras (700–800). L'UI — nav, labels, méta,
> boutons — plafonne à **SemiBold 600**. Le **corps de texte est Regular 400**. L'emphase
> dans le texte se fait en **600**, avec parcimonie.

C'est cette discipline qui règle « le gras mal utilisé ». Elle remplace les poids 800–850
actuellement disséminés sur des éléments non-titres.

### Échelle typographique

| Rôle | Police / poids | Taille | Interligne / tracking |
|---|---|---|---|
| Display XL (héros) | Archivo 800, `font-stretch:88%` | 60–64px | 1.0 / -0.02em |
| Display L (titre page) | Archivo 800 | 44px | 1.05 / -0.02em |
| H2 | Archivo 700 | 32px | 1.15 / -0.02em |
| H3 | Archivo 600 | 22px | 1.2 / -0.01em |
| Lede / chapô | Inter 400 | 20px | 30px |
| Corps | Inter 400 | 17px | 28px |
| Méta / small | Inter 500 | 14px | 20px |
| Label / eyebrow | Inter 600, MAJ | 12px | 0.08em |
| Code | Mono 400 | 14–15px | 22px |

`h1` passe donc de `clamp(..., 7.5rem)` à ~60–64px max. Réduction franche mais l'impact est
préservé par le poids + la compression Archivo.

### Espacement

Grille 8px formalisée : `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`. Remplace les `clamp()`
ad hoc. Les `clamp()` restent autorisés pour les respirations de section responsive, mais
calés sur ces paliers.

### Rayons

`--radius-sm: 4px` (badges, petits éléments), `--radius-md: 8px` (cartes, panneaux, blocs).

### Traitement des blocs — 3 principes

1. **L'ombre décalée est un accent réservé, pas un réflexe.** Réservée aux moments forts
   (en-tête de page, carte au survol, compteur héros). Le reste vit sur la surface papier
   avec un simple filet. Fini l'ombre sur chaque élément.
2. **De l'air.** Padding interne 24–28px, rythme vertical explicite (titre → méta → pied).
3. **Un seul niveau d'accent famille par bloc** — un bandeau en tête, pas un empilement.

## Décisions — Composants

### En-tête de site
Barre 72px, filet encre bas, marque géométrique (3 blocs jaune/bleu/corail), wordmark
Archivo 800 MAJ, liens nav Inter 600 14px (soulignement corail sur actif).

### Carte-brique (catalogue) — validé artboard `Catalogue`
- Conteneur : surface, bordure 2px encre, `radius-md`, **sans** ombre au repos.
- Bandeau d'accent famille 8px en tête (bordure basse encre).
- Padding 24px, `gap` interne 16px.
- Kicker : badge-lettre (30px, `radius-sm`, accent famille) + statut mono 11px.
- Titre : Archivo 600, 20px.
- Pied : poussé en bas (`margin-top:auto`), filet haut, durée (Inter 500 13px) + flèche.
- **État survol (à porter) :** apparition de l'ombre décalée `6px 6px 0 ink` + léger
  translate — l'ombre comme récompense d'interaction, pas au repos.

### En-tête de famille (catalogue)
Bloc-index carré (64px, accent famille, ombre `5px 5px 0 ink`) + eyebrow + H2 + badge
compteur mono. Filet encre en base.

### Page de lecture / détail — parti pris **C « Hybride »** (validé, artboards A/B/C comparés)
- **En-tête marqué** pleine largeur : bordure 2px, `radius-md`, bandeau famille 12px,
  bloc-numéro incliné (`A2`, 96px, ombre), titre Display L, chapô. Ombre décalée assumée
  ici (moment fort). *Dial optionnel :* ombre simple encre plutôt que double jaune+encre.
- **Fiche brique en bandeau horizontal** sous l'en-tête : 5 cellules modulaires
  (Durée / Responsable / Statut / Prérequis / Structure+jauge), séparées par filets.
  Remplace la sidebar : ne vole pas de largeur à la lecture.
- **Colonne de lecture unique** centrée, `max-width: ~760px` (≈ 65–70 caractères).
- Contenu MDX : H2/H3 selon l'échelle, corps 17px/28px, listes à slot de numéro/puce à
  largeur fixe (34px, `flex-shrink:0`) pour éviter les retours à la ligne cassés.
- **Bloc de code :** bordure 2px, `radius-md`, ombre décalée `6px 6px 0 ink` (accent),
  label de fichier mono en tête.

Rejeté : B « Chantier » (sidebar 300px) — dégradait la largeur de lecture (~490px, lignes
de 40 caractères, code et listes cassés). A « Document » — trop neutre, peu d'identité.
C combine la personnalité de B et la lisibilité de A.

## Tokens (créés dans Paper, à répliquer en CSS `:root`)

Namespaces Tailwind v4 : `--color-*`, `--font-*`, `--text-*`, `--font-weight-*`,
`--tracking-*`, `--leading-*`, `--radius-*`, `--space-*`, `--breakpoint-*`, `--container-*`.

Couleurs (inchangées) : `paper #f7f4ed`, `surface #fffdf8`, `ink #16221d`, `muted #59645e`,
`brick-yellow #ffbf3f`, `brick-blue #72c1e5`, `brick-coral #ed6a46`, `brick-green #72af80`,
`brick-violet #b79bca`, `brick-orange #ef9850`.

Mapping famille (conforme à `global.css` actuel) : A→yellow, B→blue, C→coral, D→green,
E→violet, F→orange.

## Impact sur `global.css` (résumé du portage)

- **Remplacer** `--font-display` (Arial Black) → Archivo ; `--font-body` (Avenir Next) → Inter.
- **Réécrire l'échelle des titres** `h1/h2/h3` selon le tableau (baisse de `h1` ~120px→64px).
- **Introduire la discipline de poids** : retirer les `font-weight: 800/850` des éléments
  non-titres (nav, `.eyebrow`, `.meta-line`, `.badge`, boutons → 600 max) ; corps → 400.
- **Rationaliser les ombres** : `--shadow-block` réservé aux moments forts + états `:hover`.
  Retirer les ombres au repos sur cartes/panneaux (les remettre au survol).
- **Aérer** `.brick-card`, `.method-grid`, `.detail-header`, `.metadata` (padding, gap).
- **Refondre le détail** vers le modèle C : métadonnées en bandeau horizontal + colonne
  de lecture unique (au lieu de `.brick-content` collé à un filet latéral).
- **Ajouter** les tokens `--space-*`, `--text-*`, `--font-weight-*`, `--tracking-*`,
  `--leading-*` en `:root` et les consommer.
- Conserver responsive, print, reduced-motion, focus, skip link.

## Hors périmètre

- Accueil et 404 : repris **au fil du portage** selon le même système (pas de maquette
  Paper dédiée — cosmétique, aucune décision système nouvelle).
- Choix final Geist Mono vs IBM Plex Mono : à trancher à l'implémentation (défaut Geist Mono).
- Chargement/auto-hébergement des polices : à cadrer dans le plan d'implémentation.
