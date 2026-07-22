# [À REMPLACER : le nom de votre projet]

[À REMPLACER : une phrase qui dit ce que fait le projet et pour qui. Exemple
pour un assistant à mémoire : « Un assistant qui range mes notes et me sert un
brief chaque matin, à partir de fichiers que je possède. »]

## Ce que ça fait

[À REMPLACER : trois à cinq puces concrètes. Exemple :]

- Range les notes et documents que je lui donne, selon des règles écrites.
- Produit un brief quotidien en quatre sections, avec la source de chaque ligne.
- Signale ce qu'il n'a pas trouvé au lieu de le deviner.

## Ce que ça ne fait pas

[À REMPLACER : les limites que vous assumez. Les dire évite les malentendus, y
compris avec vous-même dans trois semaines. Exemple :]

- Il ne décide rien à ma place.
- Il n'envoie aucun message et ne publie rien automatiquement.

## Comment l'utiliser

1. Ouvrir un terminal dans ce dossier.
2. Lancer `claude`.
3. [À REMPLACER : la commande ou la demande type qui déclenche le résultat
   principal. Exemple : « Demander : produis le brief du jour. »]

## Organisation des fichiers

- `CLAUDE.md` : l'identité du projet, lue par Claude au début de chaque
  conversation.
- `matiere/` : ce que je fournis au projet.
- `sorties/` : ce que le projet produit.
- `notes/` : mes décisions et mes règles.
- `prompts/` : les prompts réutilisables.

Le détail est dans `DOSSIERS.md`.

## État d'avancement

- [ ] Socle : dossier versionné, `CLAUDE.md` rédigé, premier commit poussé.
- [ ] Matière : arborescence décidée, règles de routage écrites, contenu chargé.
- [ ] Savoir-faire : le résultat principal se produit en une commande.
- [ ] Visage : une page consultable, en local puis en ligne.
- [ ] Sécurité : audit passé, aucun secret dans le dépôt.

## Sécurité

Les secrets vivent dans un fichier `.env`, ignoré par git. Avant toute mise en
ligne, lancez le prompt d'audit de `prompts/securite.md`.

## Auteur

[À REMPLACER : votre prénom, et le lien que vous voulez donner. N'y mettez
aucune coordonnée que vous ne voulez pas voir publique.]
