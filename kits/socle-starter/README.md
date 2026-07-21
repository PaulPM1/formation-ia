# Kit de départ : le socle

Vous avez deux heures pour passer d'une machine vide à un projet prêt à être
développé. Ce dossier contient tout ce que vous n'avez pas à taper vous-même :
la structure du projet, les fichiers de base, et les prompts à coller dans
Claude Code.

Le principe est le même partout dans la formation : on prémâche la saisie, on
garde la décision. Les dossiers et les fichiers existent déjà, vous les
remplissez de vos choix.

## Ce que le kit contient

Deux variantes complètes et indépendantes. Vous n'en prenez qu'une.

| Variante | Pour qui | Ce que vous y trouvez |
| --- | --- | --- |
| `debutant/` | Vous découvrez Claude Code et git | Tout est déjà rédigé, avec des marqueurs `[À REMPLACER]` aux endroits à personnaliser |
| `avance/` | Vous avez déjà versionné un projet | Les mêmes fichiers, réduits aux titres de sections et aux consignes : le contenu est à écrire |

Dans les deux variantes, le `.gitignore` et les prompts de `prompts/` sont
identiques et complets. La sécurité et l'interview ne sont pas des exercices.

## Récupérer le kit

Trois chemins, choisissez le plus simple pour vous.

1. **Bouton « Use this template » sur GitHub.** Sur la page du dépôt, cliquez
   sur « Use this template », puis « Create a new repository ». Donnez un nom
   court à votre projet, choisissez « Private » si votre matière est
   personnelle, puis clonez le dépôt obtenu sur votre machine.
2. **Téléchargement direct.** Sur la page du dépôt, bouton « Code », puis
   « Download ZIP ». Décompressez l'archive dans le dossier où vous travaillez.
3. **Clone classique.** `git clone` sur l'adresse du dépôt, puis supprimez le
   dossier `.git` pour repartir d'un historique vierge.

## Choisir votre variante et la mettre en place

Le kit contient les deux variantes côte à côte. Vous gardez celle qui vous
correspond et vous supprimez l'autre, pour que la racine de votre projet ne
contienne que vos fichiers.

1. Ouvrez le dossier récupéré.
2. Remontez le contenu de `debutant/` (ou de `avance/`) à la racine du projet.
3. Supprimez les deux dossiers de variantes et ce fichier.

Si cette manipulation vous ralentit, demandez-la à Claude Code : « remonte le
contenu du dossier debutant à la racine, supprime les dossiers debutant et
avance, et supprime le README du kit ».

## Ouvrir le projet dans Claude Code

1. Ouvrez un terminal (ou le terminal intégré de VS Code).
2. Placez-vous dans le dossier de votre projet avec la commande `cd`, suivie du
   chemin du dossier.
3. Lancez `claude`.
4. Vérifiez qu'il répond en lui demandant : « quels fichiers y a-t-il dans ce
   dossier ? ».

Claude lit le `CLAUDE.md` au début de chaque conversation. Tant que ce fichier
contient encore les marqueurs `[À REMPLACER]`, il travaille à l'aveugle.

## L'ordre de travail conseillé

1. Faire initialiser git par Claude Code, et vérifier que le `.gitignore` est
   bien en place avant d'ajouter quoi que ce soit.
2. Ouvrir `prompts/securite.md` et coller le premier prompt (celui de démarrage
   de projet) dans votre conversation.
3. Ouvrir `prompts/interview.md`, coller le prompt entier, répondre aux
   questions, laisser Claude rédiger votre `CLAUDE.md`, puis le relire ligne à
   ligne.
4. Adapter le `README.md` du projet et la description des dossiers.
5. Faire un premier commit nommé « socle » et le pousser sur GitHub.

## Les cinq projets

Le kit fonctionne pour les cinq directions proposées : assistant à mémoire,
coach de révisions, radar de veille, archiviste de fichiers, portfolio vivant.
Les dossiers de départ sont volontairement génériques : `matiere/` pour ce que
vous donnez au projet, `sorties/` pour ce qu'il produit, `notes/` pour vos
décisions. Le fichier `DOSSIERS.md` de chaque variante indique ce que ces trois
dossiers deviennent selon le projet choisi.
