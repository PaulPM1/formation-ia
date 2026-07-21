# Les dossiers de départ

Trois dossiers, volontairement génériques, qui servent aux cinq projets.

- `matiere/` : ce que vous donnez au projet, la matière première dont il se
  nourrit.
- `sorties/` : ce que le projet produit et que vous consultez.
- `notes/` : vos décisions et vos règles, écrites une fois pour ne plus les
  réexpliquer.
- `prompts/` : les prompts fournis avec le kit, à recopier dans une
  conversation Claude Code.

Chaque dossier contient un fichier `.gitkeep`. Il est vide et n'a qu'un rôle :
git ignore les dossiers vides, ce fichier les rend visibles dans l'historique
et sur GitHub. Vous pouvez le supprimer dès que le dossier contient autre chose.

## Ce que ces dossiers deviennent selon le projet

| Projet | `matiere/` | `sorties/` |
| --- | --- | --- |
| Assistant à mémoire | Notes, documents, journal, fiches sur les personnes | Les briefs quotidiens |
| Coach de révisions | Vos cours, vos fiches, vos annales | Les séries de questions et le suivi de ce que vous maîtrisez |
| Radar de veille | La liste des sources et les articles collectés | Les points de veille datés |
| Archiviste de fichiers | Les fichiers en désordre à traiter | L'arborescence rangée et les rapports de rangement |
| Portfolio vivant | Vos fiches projet, expériences, compétences | Les pages publiables du site |

Le contenu de `notes/` est le même pour tous : l'arborescence retenue, la
convention de nommage, les règles de routage (quelle information va où, sous
quel nom), et les décisions que vous ne voulez pas reprendre deux fois.

## Renommer les dossiers

Rien ne vous oblige à garder ces noms. Si `sources/` et `rapports/` parlent
mieux de votre projet, renommez-les, puis mettez à jour la section « Où trouver
quoi » de votre `CLAUDE.md` et la liste du `README.md`. Ce qui compte est que
Claude sache où va quoi, pas le nom lui-même.
