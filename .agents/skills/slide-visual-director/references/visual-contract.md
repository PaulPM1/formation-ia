# Contrat visuel

## Surface
- Fond ivoire `#fffaf1`, encre `#16221d`, surface `#fffdf8`.
- Accents : A `#ffbf3f`, B `#72c1e5`, C `#ed6a46`, D `#72af80`, E `#b79bca`, F `#ef9850`.
- Halos périphériques lents ; aucune grille ou mosaïque permanente.

## Hiérarchie
- Le visuel occupe 70 à 85 % de la slide.
- La thèse tient sur deux lignes courtes si possible.
- Le texte d'appui explique seulement ce que le visuel ne peut pas encoder.

## Interactions permises
- Révéler une étape, modifier un paramètre, comparer deux états, ouvrir une
  branche, rejouer une transformation ou vérifier un classement.
- Ne jamais cacher une information essentielle derrière le survol seul.

## Tests bloquants
1. Silencieux : la thèse est comprise sans commentaire.
2. Coup d'œil : le parcours visuel est évident en quelques secondes.
3. Nécessité : l'interaction clarifie réellement une relation.

## Accessibilité
- HTML natif avant ARIA ; boutons réels ; focus visible.
- SVG informatif avec `<title>` et description associée.
- État final lisible sans JavaScript.
- Aucun état indiqué par la couleur seule.
- `prefers-reduced-motion` supprime déplacements et transitions.
