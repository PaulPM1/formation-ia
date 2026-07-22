# Prompt 01 : Claude Chat

Joins les trois fichiers de `inbox/`, puis copie ce prompt dans une nouvelle conversation.

## Prompt principal

Tu prépares mon brief opérationnel du jour à partir des six notes fictives jointes.

Objectif : transformer les six notes en actions traçables sans ajouter d’information.

Contexte : les notes viennent de `inbox/01-demandes.md`, `inbox/02-reunion.md` et `inbox/03-messages.md`.

Contraintes :

- traite les six notes ;
- cite `[source: chemin-du-fichier]` après chaque action ;
- si deux notes se contredisent, ne tranche pas et place le point sous « À confirmer » ;
- n’invente ni responsable, ni date, ni priorité.

Forme : utilise exactement ces trois sections, dans cet ordre :

1. `Actions du jour`
2. `À confirmer`
3. `Plus tard`

Après le brief, indique seulement si ces trois contrôles passent : six notes couvertes, chaque action sourcée, conflit non résolu.

## Correction standard

Si les trois contrôles passent, envoie ensuite :

> Réduis maintenant le contenu à exactement six lignes, hors titres de sections. Conserve les trois sections, la source de chaque action et le conflit sous « À confirmer ». Ne fusionne deux notes que si chaque action garde sa propre source. Réponds uniquement avec le brief corrigé, sans commentaire ni tableau de contrôle.
