# Le prompt d'interview

Les rôles s'inversent : au lieu d'écrire votre `CLAUDE.md`, vous répondez à des
questions et Claude le rédige. Vous gardez la relecture, c'est là que se joue
la qualité.

## Mode d'emploi

1. Ouvrez Claude Code dans le dossier de votre projet.
2. Copiez le bloc ci-dessous en entier et collez-le dans la conversation.
3. Répondez aux questions une par une, sans raccourcir. Une réponse vague donne
   un fichier vague.
4. Quand Claude propose le `CLAUDE.md`, relisez chaque ligne et faites corriger
   tout ce qui sonne faux avant de valider l'écriture.
5. Ouvrez ensuite une conversation neuve et demandez : « que sais-tu de moi et
   de ce projet ? ». Si la réponse est exacte sans que vous ayez rien rappelé,
   le socle est posé.

Comptez vingt à trente minutes. Répondre à l'oral avec la dictée de votre
machine va plus vite que taper, et donne des réponses plus riches.

## Le prompt à copier

```text
Tu vas écrire le fichier CLAUDE.md de mon projet, celui que tu liras au début
de chaque conversation. Ne rédige rien, ne crée aucun fichier et ne propose
aucun plan avant d'avoir posé toutes tes questions et reçu toutes mes réponses.

Déroulé imposé.

Pose-moi les questions UNE PAR UNE. Après chaque question, arrête-toi et
attends ma réponse. Ne pose jamais deux questions dans le même message. Ne
réponds pas à ma place et ne me proposes pas de réponses toutes faites, sauf si
je te dis que je ne comprends pas la question : dans ce cas, reformule-la plus
simplement avec un exemple.

Si une réponse est trop vague pour être utile, pose une seule question de
relance avant de passer à la suivante.

Voici les dix questions à poser, dans cet ordre.

1. Qui es-tu ? Ton prénom, ta situation actuelle en une phrase, et ce à quoi
   ressemble une semaine type chez toi.
2. Lequel de ces cinq projets as-tu choisi : assistant à mémoire, coach de
   révisions, radar de veille, archiviste de fichiers, portfolio vivant ? Et
   pourquoi celui-là plutôt qu'un autre ?
3. En une phrase, que fera ce projet, concrètement ? Décris le geste que tu
   feras avec lui le plus souvent.
4. Quelle matière as-tu déjà sous la main pour l'alimenter, et où se
   trouve-t-elle aujourd'hui ?
5. Qui va utiliser ou lire le résultat ? Toi seul, un proche, un jury, des
   inconnus sur le web ? Que cherche cette personne en premier ?
6. À quoi ressemble une bonne journée avec ce projet dans six mois, s'il
   fonctionne comme tu l'espères ?
7. Qu'est-ce que ce projet ne doit surtout pas faire ? Liste ce qui te
   dérangerait, en particulier tout ce qui sort ou publie une information.
8. Comment veux-tu que je te réponde : niveau de détail, longueur, tutoiement
   ou vouvoiement, ton attendu ? Donne-moi aussi deux ou trois formulations que
   tu ne veux jamais lire.
9. Quelles contraintes as-tu : temps disponible, données que tu refuses de
   publier, matériel, niveau technique, dépôt public ou privé ?
10. Qu'est-ce qui te ferait dire, dimanche soir, que ce week-end a servi à
    quelque chose ?

Quand j'ai répondu aux dix questions, montre-moi une proposition de CLAUDE.md
dans la conversation, sans l'écrire sur le disque. Structure imposée, six
sections courtes, dans cet ordre :

- Qui je suis
- Ce que fait ce projet
- Pour qui
- Comment je veux que Claude me réponde
- Les règles du projet
- Où trouver quoi

Règles de rédaction.

N'invente rien. Chaque phrase du fichier doit venir d'une de mes réponses. Si
une section manque de matière, écris à la place « à compléter » suivi de la
question précise que je dois me poser, et signale-le moi. N'ajoute aucune
qualité, aucun objectif et aucune compétence que je ne t'ai pas donnés.

Écris à la première personne, en mon nom, avec mes mots quand c'est possible.
Va au concret : des faits et des exemples, pas des intentions générales.

Inclus obligatoirement, dans la section des règles, celle-ci : quand une
information n'est pas dans les fichiers de ce projet, tu le dis au lieu de la
deviner. Ajoute aussi qu'aucune clé ni donnée sensible ne doit entrer dans un
fichier suivi par git.

Dans la section « Où trouver quoi », décris les dossiers réellement présents
dans ce projet, en une ligne chacun. Regarde le dossier avant d'écrire cette
section.

Garde le fichier sous une centaine de lignes : c'est un fichier de repères, pas
une documentation.

Quand tu me montres la proposition, termine par la liste des points sur
lesquels tu as hésité ou manqué d'information. Attends ensuite ma validation
explicite avant d'écrire quoi que ce soit sur le disque.
```

## Après l'interview

Relisez le fichier obtenu avec trois questions en tête.

- Est-ce que quelqu'un qui ne vous connaît pas comprendrait votre projet en le
  lisant ?
- Y a-t-il une phrase que vous n'auriez jamais écrite vous-même ? Faites-la
  corriger.
- La règle « je le dis au lieu de le deviner » est-elle bien présente ?

Testez-la pour de vrai : dans une conversation neuve, posez une question dont
la réponse n'existe nulle part dans votre projet. Vous devez obtenir un « je ne
sais pas », pas une réponse plausible.

Ce fichier n'est pas figé. Rouvrez-le dès qu'une réponse de Claude vous
surprend : la plupart du temps, la correction se fait ici et pas dans la
conversation.
