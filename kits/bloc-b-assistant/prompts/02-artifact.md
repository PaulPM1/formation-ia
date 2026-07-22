# Prompt 02 : Artifact

Copie ce prompt dans la conversation qui contient le brief Chat.

## Construction

Crée un Artifact interactif nommé « Boîte de tri du jour » à partir des six notes.

L’interface doit :

- afficher les six notes sous forme de cartes ;
- proposer exactement trois états : `Aujourd’hui`, `Plus tard`, `Archiver` ;
- placer initialement les six cartes dans `Aujourd’hui` ;
- permettre de déplacer chaque carte entre les trois états ;
- afficher un compteur visible pour chaque état et conserver un total de six ;
- proposer un bouton `Remise à zéro` qui replace les six cartes dans `Aujourd’hui` ;
- rester compréhensible au clavier et sans explication orale.

Ne crée ni connexion, ni notification, ni stockage distant.

## Tests à exécuter

1. Déplace une note vers `Plus tard` et contrôle les deux compteurs concernés.
2. Déplace une note vers `Archiver`.
3. Fais deux déplacements et vérifie que le total reste égal à six.
4. Clique `Remise à zéro` et vérifie que les six cartes reviennent dans `Aujourd’hui`.

## Correction standard

Après le premier test d’archivage, envoie :

> Ajoute une confirmation explicite avant tout déplacement vers `Archiver`. Ne change rien au tri, aux compteurs ni à la remise à zéro. Rejoue ensuite les quatre tests et résume leur résultat.
