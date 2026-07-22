# Les dossiers de départ

| Dossier | Rôle | À y mettre |
| --- | --- | --- |
| `matiere/` | Ce que vous donnez au projet | > à décrire |
| `sorties/` | Ce que le projet produit | > à décrire |
| `notes/` | Vos décisions et vos règles | > à décrire |
| `prompts/` | Les prompts réutilisables | Fourni : interview, sécurité |

Le `.gitkeep` de chaque dossier ne sert qu'à le rendre visible dans
l'historique, git ignorant les dossiers vides. Supprimez-le dès que le dossier
contient autre chose.

## Ce qui reste à décider

- L'arborescence sous `matiere/` et la convention de nommage des fichiers.
- Les règles de routage : quelle information va dans quel dossier, sous quel
  nom, avec quels champs obligatoires en tête de fichier. Écrivez-les dans
  `notes/` avant de créer les sous-dossiers.
- Le format des fichiers produits dans `sorties/` et la manière dont ils citent
  leurs sources.

Renommez librement ces dossiers si d'autres noms parlent mieux de votre projet,
puis répercutez le changement dans la section « Où trouver quoi » de votre
`CLAUDE.md` et dans le `README.md`.
