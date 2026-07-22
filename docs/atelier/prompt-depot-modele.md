# Prompt : fabriquer le dépôt modèle du socle

À coller dans Claude, depuis un dossier vide ouvert dans VS Code. Le résultat
est destiné à devenir un dépôt GitHub coché « Template repository ».

Raccourci possible : le kit existe déjà dans `kits/socle-starter/` de ce repo.
Copier ce dossier évite de tout régénérer ; le prompt ci-dessous sert à le
refaire de zéro ou à le faire évoluer.

---

```text
Contexte. J'anime une formation IA de deux jours et demi appelée « Les briques
du Vibe Coding », pour des personnes qui débutent complètement : elles n'ont
jamais utilisé GitHub, ni un terminal, ni un éditeur de code. Le vendredi
après-midi, elles font un socle commun de deux heures qui doit suffire à
décoller : outils installés, dépôt récupéré, comptes GitHub et Vercel prêts,
projet choisi, identité du projet écrite, premier commit poussé. Tout le reste
du week-end, elles développent le projet de leur choix parmi cinq : un
assistant à mémoire, un coach de révisions, un radar de veille, un archiviste
de fichiers, un portfolio vivant.

Ta mission. Dans le dossier courant, fabrique le dépôt modèle que ces
personnes récupéreront avec le bouton « Use this template » de GitHub, puis
cloneront sur leur machine. Il ne contient aucun code : c'est un squelette de
projet et des prompts.

Principe directeur. On prémâche la saisie, on garde la décision. Tout ce qui
est dactylographie fastidieuse doit être déjà écrit ; tout ce qui demande un
choix reste à faire par la personne.

Structure attendue :

README.md à la racine : ce qu'est ce dépôt, comment le récupérer, comment
choisir entre les deux variantes ci-dessous, comment l'ouvrir dans VS Code, et
dans quel ordre travailler pendant les deux heures.

Deux dossiers, debutant/ et avance/, contenant chacun les mêmes fichiers :
- CLAUDE.md : l'identité du projet, en sections (qui je suis, ce que fait ce
  projet, pour qui, comment je veux que Claude me réponde, les règles du
  projet, où trouver quoi).
- README.md : le README du projet de la personne.
- DOSSIERS.md : à quoi sert chaque dossier, avec une ligne par projet parmi
  les cinq.
- .gitignore : commenté en français, couvrant secrets et fichiers .env,
  dépendances, fichiers système macOS et Windows.
- matiere/, sorties/, notes/ : chacun avec un fichier .gitkeep.
- prompts/interview.md et prompts/securite.md.

Différence entre les deux variantes : dans debutant/, CLAUDE.md, README.md et
DOSSIERS.md sont entièrement rédigés avec un exemple crédible (prends
l'assistant à mémoire comme exemple) et des marqueurs très visibles du type
[À REMPLACER : ...] partout où il faut personnaliser. Dans avance/, ces trois
fichiers ne contiennent que les titres de sections et, sous chacun, une
consigne d'une ligne expliquant quoi écrire. Le .gitignore et les deux
prompts sont identiques dans les deux variantes : la sécurité et l'interview
ne sont pas des exercices.

Contenu de prompts/interview.md : le prompt à copier pour que Claude
interviewe la personne et rédige lui-même son CLAUDE.md. Il doit poser une
dizaine de questions couvrant l'identité, le projet choisi parmi les cinq, la
matière disponible, le public visé, le ton de réponse attendu, les interdits
et les contraintes. Consignes explicites dans le prompt : poser les questions
une par une en attendant chaque réponse, ne rien inventer, dire « je ne sais
pas » plutôt que deviner, et faire valider le contenu avant d'écrire le
fichier.

Contenu de prompts/securite.md : deux prompts prêts à copier, l'un pour le
démarrage de projet, l'autre pour l'audit avant mise en ligne. Reprends
exactement ces deux textes :

Au démarrage de chaque projet :
Pour tout le code de ce projet, applique ces règles en permanence : jamais de
clé ni de secret dans le code (fichier .env listé dans le .gitignore) ; toute
entrée utilisateur validée côté serveur ; aucune donnée sensible dans les URL
ou les réponses du front ; une limite de requêtes sur les routes qui coûtent.
Signale-moi tout point du projet qui ne respecte pas ces règles.

Avant chaque mise en ligne :
Fais un audit de sécurité de ce projet comme si tu étais un attaquant.
Cherche en priorité : des secrets dans le code ou dans l'historique, des
entrées utilisateur non validées, des données sensibles exposées côté front,
des routes sans limite de requêtes. Classe ce que tu trouves par gravité et
propose la correction la plus simple pour chaque point.

Règles de rédaction, à respecter strictement :
- n'utilise jamais le caractère tiret cadratin, remplace-le par deux-points,
  une virgule ou des parenthèses ;
- vouvoiement, ton direct et concret ;
- pas de méta-commentaire du type « ce fichier sert à » en tête de page ;
- aucune supposition sur l'âge ou le profil des personnes ;
- markdown pur, lisible directement sur GitHub, sans HTML ;
- aucune dépendance, aucun package.json, aucun outil à installer ;
- aucune vraie clé, aucun secret, aucune donnée personnelle.

Procède ainsi : propose-moi d'abord l'arborescence complète et attends ma
validation, puis crée les fichiers. Termine en affichant l'arborescence
obtenue et en me signalant tout choix que tu as dû faire à ma place.
```
