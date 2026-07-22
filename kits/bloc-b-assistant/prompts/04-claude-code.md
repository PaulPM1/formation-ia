# Prompt 04 : Claude Code dans VS Code

Ouvre `code/` dans VS Code, vérifie que `node --test` passe, puis copie ce prompt dans Claude Code.

## Prompt

Inspecte ce mini-projet sans le modifier, puis présente un plan de trois étapes maximum.

Objectif unique : ajouter la source sous chaque carte de la page.

Contraintes :

- utilise la propriété `source` déjà présente dans `brief.mjs` ;
- préserve le tri existant et son ordre ;
- ne change ni le contenu des notes, ni le style général, ni le serveur ;
- complète le test marqué TODO pour prouver que la source est rendue ;
- exécute `node --test` après la modification ;
- arrête-toi si un changement hors de ce périmètre semble nécessaire.

Attends mon approbation du plan avant de modifier. À la fin, ouvre ou présente le diff inline dans VS Code et résume séparément : fichiers modifiés, résultat du test, points à relire.
