# Fiche présentateur : blocs D et E

Antisèche pour animer les slides D et E sans relire les briques. Une entrée par
slide gardée : ce qu'elle dit, ce que vous racontez, ce qu'il ne faut PAS dire,
et la brique de référence si quelqu'un veut creuser.

Public : personnes non techniques (directeurs de projet, curieux) qui veulent
vibecoder. Objectif : clair et confiant, pas exhaustif. Le détail vit dans les
briques, vous n'avez pas à tout dire.

Règle d'or : une slide, une idée, une phrase, un exemple. Puis vous passez.

---

## Bloc D : l'écosystème du dev

### D1 : Lexique dev (1 slide, brique d1)

Le vocabulaire dev ne se présente pas d'entrée : il s'apprend en contexte quand
on le rencontre (le terminal au setup, le repo en D2, Vercel en D3, les clés en
D4). Une seule slide suffit, celle qui porte le message durable.

**Le réflexe.** L'idée : on ne mémorise pas le jargon, on le demande à Claude.
Montrez le prompt « explique-moi ce qu'est un repo comme si je n'avais jamais
codé, avec une analogie de cuisine ». Message : personne ne retient quinze
définitions, mais tout le monde sait quoi demander. Si un terme surgit (SDK,
framework), répondez en une phrase et renvoyez à ce réflexe.

### D2 : GitHub et versionnement (3 slides, brique d2)

**1. Le commit = sauvegarde de jeu vidéo.** Partez de la peur (« et si je casse
tout ? »), pas de l'outil. Analogie de secours : l'historique des versions de
Google Docs. Ne dites PAS commit/push/pull en détail : ils ne taperont jamais
ces commandes.

**2. Casser puis ressusciter (démo, moment fort).** Vous cassez quelque chose à
l'écran, puis vous demandez à Claude de revenir en arrière : le projet
ressuscite. Message : le filet de sécurité est réel. Répétez cette démo AVANT la
séance, un échec ici ruine tout. Tout se demande en français dans Claude Code.

**3. Confiance mais vérifie.** L'idée : faire confiance à l'IA, oui ; à
l'aveugle, non. Avant de laisser Claude pousser, lui demander de résumer ce
qu'il envoie. Ce qui part sur GitHub reste dans l'historique, erreur ou clé
comprise.

### D2-bis : Setup GitHub et Vercel (2 slides, brique d2-bis)

Rappel : cette brique est surtout FAITE en direct pendant le socle du vendredi,
pas vraiment enseignée. Deux slides suffisent.

**1. Le rituel en quatre temps.** Identité et autorisation vous appartiennent,
la création se délègue à l'IA, la preuve vous revient. Message martelé : l'IA
fait la plomberie, vous gardez les clés (vos mots de passe ne passent jamais par
elle).

**2. Le prompt qui fait naître le projet.** Un seul prompt crée le dossier,
l'initialise, le versionne et l'envoie en ligne. À conserver, il resservira à
chaque projet. Règle d'hygiène : un projet, un dossier, un repo.

### D3 : Front-end et déploiement (3 slides, brique d3)

**1. Déployer = une adresse pour tout le monde.** Le front-end est ce que le
visiteur voit ; localhost n'a qu'un visiteur, vous. Montrez la même app en local
et sur son URL publique côte à côte.

**2. La boucle en une minute (démo).** Import du repo, Deploy, l'URL sur un
téléphone, puis un changement demandé à Claude qui arrive tout seul en ligne. Le
moment fort : l'URL qui circule de téléphone en téléphone. Ne dites PAS noms de
domaine, DNS, offres payantes.

**3. Déployé = public.** Tout ce qui est en ligne est visible, code compris.
C'est le pont vers D4 : cette visibilité appelle les réflexes de sécurité.

### D4 : Sécurité (3 slides, brique d4)

**1. L'IA code juste, pas forcément sûr.** Elle sécurise quand on le lui
demande : votre travail est de poser l'exigence. Contrat annoncé : rien à
mémoriser, deux prompts, la page reste en ligne.

**2. Les deux prompts.** Un au démarrage du projet, un avant chaque mise en
ligne. Copier, coller, lire le rapport : l'essentiel tient dans ces deux gestes.
Faites-les copier tout de suite.

**3. L'audit qui trouve la clé (démo).** Lancez l'audit sur un projet préparé
qui cache une clé API : le rapport la trouve, ça marque plus que dix slides.
Retirer la clé du code ne suffit pas, l'historique la garde : révoquer puis
remplacer.

---

## Bloc E : la méthode

### E1 : Prompt et contexte (3 slides, brique e1)

**1. Les quatre leviers.** Contexte, spécificité, rôle, contraintes : ils
réduisent le flou. Un exemple par levier, pas de cours magistral. Mentionnez
zero/one/few-shot en une phrase : quelques exemples cohérents valent mieux que
beaucoup d'exemples redondants.

**2. Mauvais vs bon prompt (démo).** Deux résultats côte à côte sur la même
tâche. Message : aucun n'est magique, le bon dit juste ce que le modèle ne
pouvait pas deviner. Variante : faites réparer le mauvais prompt par la salle,
levier par levier.

**3. Repartir propre.** Quand ça dérape, reformuler bat l'empilement de
rustines. Sur un projet long, un fichier CLAUDE.md garde le cap d'une
conversation à l'autre. Ce réflexe resservira partout.

### E2 : Code design (3 slides, brique e2, BONUS)

**1. Un fichier, un rôle.** La séparation rend la modification possible. Un
fichier de 2000 lignes qui fait tout est un signal d'alarme. Restez au niveau de
la carte, pas de jargon MVC ou patterns.

**2. Interroger la carte (démo).** On demande à l'IA le rôle de chaque fichier,
sans lire le code. Si elle ne distingue pas les rôles clairement, c'est le
projet qui a un problème.

**3. Le test des trente secondes.** Si vous ne pouvez pas expliquer votre projet
en trente secondes, vous ne le contrôlez plus. Le vrai risque du vibe coding :
un projet qui marche mais que personne ne comprend.

### E3 : Cadrage et itération (3 slides, brique e3)

**1. Le MVP.** La plus petite version qui rend déjà service. La liste « plus
tard » est le carnet de route, pas une poubelle. Un MVP à cinq fonctionnalités
n'est pas un MVP.

**2. Des étapes testables.** Si une étape ne peut pas être vérifiée, elle est
trop grosse. « Gestion complète du budget » n'est pas testable ; « affiche mes
trois dernières dépenses » l'est.

**3. Détecter l'enlisement.** Trois signaux (l'IA casse en corrigeant, reformule
la même solution, le code enfle sans progrès), trois parades (revenir en
arrière, repartir propre, redécouper). Plus le timeboxing des décisions
cosmétiques.

### E4 : La méthode d'équipe (3 slides, brique e4, BONUS)

**1. Cadrer, architecturer, construire.** Faire jouer à l'IA les rôles d'une
équipe (analyste, chef de produit, architecte) avant de coder. Le plan est
écrit, donc corrigeable à froid. Seul face à l'IA, on saute ces rôles et on
récupère un tas de code incontrôlable.

**2. Le prompt de cadrage (démo).** Un prompt rejoue les trois rôles, un par
message, et sort un plan avant tout code. Contrainte forte : « ne code rien tant
que je n'ai pas validé les trois rôles ».

**3. BMAD.** L'outillage complet de cette idée, pour les projets ambitieux :
`npx bmad-method install`, puis `bmad-help` comme point d'entrée. Ne lancez PAS
l'installation en séance avec des débutants ; nommez-le, renvoyez au tutoriel
officiel.

---

## Ce qu'on a coupé (et pourquoi vous n'avez pas à en parler)

Ces slides existaient avant, elles sont retirées de la présentation mais leur
contenu reste dans les briques si quelqu'un veut le détail.

- **D1** : le voyage du code (l'ordre du bloc D le raconte déjà) ; le tour du
  poste de travail (déjà vu au setup VS Code) ; Git vs GitHub (c'est D2) ; la
  mission ; les ressources. Il ne reste que le réflexe.
- **D2** : commit/push/pull en détail ; la mission ; « petite victoire =
  checkpoint ».
- **D2-bis** : diagnostic initial ; l'écran d'autorisation détaillé ; la mission
  ; la preuve finale.
- **D3** : la slide « boucle » séparée (la démo la montre déjà) ; la mission ;
  les ressources.
- **D4** : l'énumération des quatre règles (les deux prompts les appliquent) ;
  la mission ; le checkpoint.
- **E1** : l'accroche ; la fenêtre de contexte détaillée ; la mission.
- **E2** : l'accroche ; la mission.
- **E3** : la slide « cycle » d'ouverture ; la mission.
- **E4** : les rôles détaillés ; la mission.

Si on vous pose une question sur un point coupé, la réponse est simple : « c'est
dans la fiche de référence, on la regarde ensemble à l'atelier ». Vous n'avez
jamais à improviser du contenu technique.
