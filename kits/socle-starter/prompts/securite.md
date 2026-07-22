# Les deux prompts de sécurité

Quatre règles couvrent l'essentiel des dégâts évitables.

1. **Les secrets restent hors du code.** Une clé API est un mot de passe. Elle
   vit dans un fichier `.env`, jamais dans le code, et ce fichier ne part jamais
   en ligne : il est listé dans le `.gitignore`. Une clé qui a fui ne se
   supprime pas, l'historique git garde tout : elle se révoque et se remplace.
2. **Le front-end est public, le back-end est le garde.** Les vérifications qui
   comptent se font côté serveur. Aucune donnée sensible dans les URL ni dans
   les réponses envoyées au navigateur.
3. **Ne jamais faire confiance à ce qui entre.** Toute entrée utilisateur est
   validée côté serveur : type, taille, contenu.
4. **Poser des limites.** Une limite de requêtes par utilisateur et par période
   bloque les robots et protège votre budget.

Vous n'avez pas à appliquer ces règles vous-même, vous devez les faire
appliquer. L'IA écrit du code qui marche, pas forcément du code sûr : elle
sécurise quand on le lui demande.

## Au démarrage de chaque projet

Collez ce prompt dans votre toute première conversation, avant d'écrire la
moindre ligne de code.

```text
Pour tout le code de ce projet, applique ces règles en permanence :
jamais de clé ni de secret dans le code (fichier .env listé dans le
.gitignore) ; toute entrée utilisateur validée côté serveur ; aucune
donnée sensible dans les URL ou les réponses du front ; une limite de
requêtes sur les routes qui coûtent. Signale-moi tout point du projet
qui ne respecte pas ces règles.
```

## Avant chaque mise en ligne

Collez ce prompt avant chaque déploiement, et avant de rendre un dépôt public.

```text
Fais un audit de sécurité de ce projet comme si tu étais un attaquant.
Cherche en priorité : des secrets dans le code ou dans l'historique,
des entrées utilisateur non validées, des données sensibles exposées
côté front, des routes sans limite de requêtes. Classe ce que tu
trouves par gravité et propose la correction la plus simple pour
chaque point.
```

Lisez le rapport, identifiez le point le plus grave, faites-le corriger, puis
relancez l'audit pour vérifier qu'il a disparu.

## Si le rapport est trop technique

Demandez : « réexplique chaque point comme à quelqu'un qui n'a jamais codé,
avec le risque concret pour moi ».

## Si l'audit ne trouve rien

C'est possible sur un petit projet. Vérifiez que vous avez collé le prompt
complet, puis demandez : « quels risques apparaîtraient si le projet
grossissait ou s'il stockait des données d'autres personnes ? ».
