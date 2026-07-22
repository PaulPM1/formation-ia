# Prototype de référence : l'assistant à mémoire

Plan de build du prototype construit par Matthieu avant la formation.

Triple objectif : valider que le socle tient en deux heures, mesurer les temps
réels des étapes de projet pour calibrer le cahier des charges, et produire la
démonstration montrée aux participants.

Projet choisi : **l'assistant à mémoire**. Le kit de départ à tester se trouve
dans `kits/socle-starter/`.

Méthode : celle de E3. Chaque étape a un test de vérification, et le temps réel
est noté. Une étape qui dépasse le double de son budget est redécoupée.
Règle de calibrage : budget participant = double du temps Matthieu.

## Conditions du test

À respecter, sinon les mesures ne valent rien :

- chronomètre lancé, sans interruption, en une seule session par bloc ;
- aucun raccourci qu'un participant ne pourrait pas prendre (pas de fichier
  recyclé d'un autre projet, pas de commande tapée de mémoire sans passer par
  Claude) ;
- noter les frustrations autant que les durées : chaque blocage vécu devient
  une entrée « Si vous bloquez » du cahier des charges ;
- si le build se fait en fin de journée, le noter : les temps deviennent une
  borne haute.

## Bloc 1 : le socle commun (budget : 2 h)

Le vendredi des participants. À faire depuis le kit `debutant`, puis à
retester rapidement depuis `avance` pour vérifier que les deux tiennent.

| Étape | Budget | Test de vérification | Temps réel |
| --- | --- | --- | --- |
| Outils : Claude, VS Code, Claude Code qui répond | 20 min | Une question posée depuis le terminal obtient une réponse | |
| Récupérer le kit, ouvrir le dossier, git initialisé, `.gitignore` en place | 15 min | `git status` répond, le `.gitignore` protège déjà les secrets | |
| Comptes GitHub et Vercel, machine autorisée | 30 min | Le repo est visible sur github.com, Vercel voit le compte GitHub | |
| Choix du projet | 5 min | Le sujet est écrit noir sur blanc | |
| Interview par Claude (`prompts/interview.md`), CLAUDE.md rédigé | 30 min | Conversation neuve : Claude sait sur quoi vous travaillez | |
| Premier commit poussé | 10 min | Le commit apparaît sur GitHub | |
| Contre-test avec le kit `avance` | 10 min | Le squelette guide sans bloquer | |

**Critère de fin :** une conversation neuve connaît le projet, et le dépôt est
en ligne.

**Question à trancher à la fin du bloc :** est-ce que 2 h suffisent vraiment,
ou faut-il déplacer la création des comptes avant le week-end ?

## Bloc 2 : les étapes du projet (budget : 6 h)

Le samedi et le dimanche matin des participants. Suivre le cahier des charges
de `/atelier/projets/assistant` étape par étape, sans sauter les preuves.

| Étape | Budget | Test de vérification | Temps réel |
| --- | --- | --- | --- |
| 2. La matière : structure de dossiers, règles de routage, ingestion de 8 à 10 vrais documents | 1 h 30 | Trois questions sur trois dossiers différents, trois réponses sourcées | |
| 3. Le savoir-faire : le skill de capture, puis le skill de briefing | 2 h | Trois captures de sources différentes rangées au même format ; un brief de dix lignes qui cite ses sources | |
| 4. Le visage : page qui affiche le brief, déploiement, audit de sécurité | 1 h 30 | L'URL s'ouvre sur le téléphone, l'audit ne trouve plus rien de grave | |
| 5. L'extension : la capture automatique | 45 min | Une information brute arrive rangée sans consigne supplémentaire | |
| 6. L'autonomie : brief quotidien planifié ou MCP agenda | 45 min | Le brief se produit sans intervention | |

**Critère de fin :** vous ne donnez plus de consignes, vous dites « capture »
ou « brief », et le résultat tombe.

## Kits à produire pendant le build

Le prototype n'est pas qu'un projet : il fabrique le matériel du week-end.

- [ ] valider `prompts/interview.md` sur soi et corriger les questions qui
      tombent à plat ;
- [ ] écrire le **skill exemple** (`capture`) au propre, commenté, prêt à être
      distribué ;
- [ ] produire le **jeu de documents d'exercice** : 8 documents variés dont un
      cas ambigu, pour l'étape « la matière » ;
- [ ] produire le **template d'interface** pré-stylé avec ses zones « à
      brancher » ;
- [ ] capturer les captures d'écran ou la vidéo de démonstration.

## Relevé final

À remplir une fois le build terminé :

- temps total du socle, et verdict sur les 2 h ;
- temps total des étapes de projet, et budget participant qui en découle ;
- étape la plus longue, étape la plus frustrante ;
- ce qui doit être prémâché en plus dans le kit ;
- les aides « Si vous bloquez » à corriger dans le cahier des charges, en
  particulier celles dont le prompt de secours n'a pas suffi.
