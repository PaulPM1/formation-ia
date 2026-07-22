# Prompt 03 : Cowork

Ouvre ce dossier dans Cowork, puis copie le contrat complet ci-dessous.

## P.A.C.T.E.

**Périmètre**

- lire uniquement `inbox/` ;
- écrire uniquement dans `sortie/`.

**Action**

- créer `sortie/brief-du-jour.md` à partir des six notes ;
- conserver les trois sections `Actions du jour`, `À confirmer`, `Plus tard` ;
- citer le chemin du fichier source après chaque action.

**Contraintes**

- ne modifie ni ne supprime aucun fichier de `inbox/` ;
- ne tranche pas la contradiction entre le 18 et le 19 septembre ;
- conserve ce conflit sous `À confirmer` ;
- ne crée aucun autre fichier.

**Terminaison**

- le fichier de sortie existe ;
- les six notes citent leur fichier source sur la même action ;
- l’incertitude reste visible ;
- `node verify-cowork.mjs` passe avec quatre contrôles réussis.

**Exécution**

Présente d’abord un plan court avec les fichiers lus, le fichier écrit et les contrôles finaux. N’écris rien et attends mon approbation explicite. Après « J’approuve », exécute le plan, lance le vérificateur et rapporte son résultat exact.
