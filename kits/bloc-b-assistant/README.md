# Bloc B : assistant à mémoire

Ce kit contient une mission individuelle continue. Les mêmes six notes fictives passent par Chat, Artifacts, Cowork puis, en option, Claude Code.

## Avant le chrono

1. Décompressez le kit dans un dossier local.
2. Vérifiez que Chat répond, que la création d’Artifacts est activée et que Claude Desktop est connecté pour Cowork.
3. Pour la partie facultative, ouvrez `code/` dans VS Code et exécutez `node --test`.
4. N’utilisez aucune donnée réelle ou sensible.

Une installation complète de Claude Desktop, VS Code, Node ou Claude Code reste hors chrono.

## Parcours

| Étape | Outil | Fichier à ouvrir | Preuve |
|---|---|---|---|
| B1 | Chat | `prompts/01-chat.md` | Brief sourcé, conflit à confirmer |
| B2 | Artifact | `prompts/02-artifact.md` | Tri testé puis corrigé |
| B3 | Cowork | `prompts/03-cowork.md` | Sortie vérifiée, originaux intacts |
| B4 | Claude Code | `prompts/04-claude-code.md` | Page, test et diff relus |

Les données sources sont dans `inbox/`. Cowork doit écrire uniquement dans `sortie/`.

## Vérification Cowork

Depuis la racine de ce kit :

```sh
node verify-cowork.mjs
```

Le contrôle réussit seulement si `sortie/brief-du-jour.md` est l’unique livrable, conserve les trois sections, associe chaque note à sa source sur la même action, garde le choix entre le 18 et le 19 septembre sous « À confirmer » et laisse les empreintes de `inbox/` intactes.

## Mini-page facultative

Depuis `code/` :

```sh
node --test
node server.mjs
```

Ouvrez ensuite `http://127.0.0.1:4174`. La page trie déjà les cartes mais n’affiche pas leurs sources : c’est l’unique modification demandée dans B4.
