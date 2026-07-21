# Contexte du projet

> Tout ce qui suit est un exemple complet, écrit pour le projet « assistant à
> mémoire ». Il est là pour vous montrer le niveau de détail attendu, pas pour
> être gardé tel quel. Remplacez chaque marqueur `[À REMPLACER : ...]`, puis
> corrigez les phrases d'exemple pour qu'elles décrivent votre projet à vous.
> Le plus simple reste de laisser Claude réécrire ce fichier à partir de vos
> réponses : voir `prompts/interview.md`.
>
> Si vous avez choisi un autre projet (coach de révisions, radar de veille,
> archiviste de fichiers, portfolio vivant), gardez les six sections dans le
> même ordre et changez uniquement leur contenu : la structure vaut pour les
> cinq.

## Qui je suis

Je m'appelle [À REMPLACER : votre prénom]. Je suis [À REMPLACER : votre
situation en une ligne, par exemple « en première année d'études d'ingénieur »
ou « responsable d'une petite équipe commerciale »].

Ma semaine ressemble à ceci : [À REMPLACER : deux ou trois phrases sur votre
quotidien réel, les jours chargés, les moments creux, ce qui revient chaque
semaine].

Ce qui me fait perdre du temps aujourd'hui : je note des choses à trois
endroits différents et je ne les retrouve pas. [À REMPLACER : votre vraie
difficulté, celle que ce projet doit réduire.]

## Ce que fait ce projet

Ce projet est un assistant à mémoire. Il retient ce que je lui confie et me le
ressort au bon moment.

Concrètement :

- Je lui donne des notes, des documents et des phrases en vrac.
- Il les range dans une arborescence de fichiers que je possède, selon des
  règles écrites.
- Chaque matin, il me produit un brief : ce qui m'attend aujourd'hui, ce qui
  traîne, ce que j'ai promis, et ce qu'il n'a pas trouvé.

Ce que ce projet ne fait pas : il ne prend aucune décision à ma place, il
n'envoie rien à personne, et il ne complète jamais une information manquante
par une supposition.

[À REMPLACER : reprenez ces trois blocs avec votre projet. Un coach de
révisions transforme des cours en questions et suit ce que vous maîtrisez ; un
radar de veille surveille des sources et rend un point régulier ; un archiviste
range et retrouve des fichiers ; un portfolio vivant tient à jour la trace de
ce que vous faites et la met en page.]

## Pour qui

L'utilisateur principal, c'est moi. [À REMPLACER : dites qui d'autre lira ou
utilisera le résultat. Personne ? Un jury ? Des visiteurs qui ne vous
connaissent pas ? Cette réponse change tout le ton du projet.]

Ce que cette personne cherche en premier : [À REMPLACER : une information
précise, une vue d'ensemble, une preuve de ce que vous savez faire].

## Comment je veux que Claude me réponde

- Répondez-moi en français, en vouvoyant, sans emphase ni superlatifs.
- Allez droit au fait : la réponse d'abord, les explications ensuite, et
  seulement si je les demande.
- Quand une information n'est pas dans les fichiers de ce projet, dites-le au
  lieu de la deviner. C'est la règle la plus importante de ce fichier.
- Citez le chemin du fichier d'où vient chaque affirmation.
- Quand deux options se défendent, posez-moi la question au lieu de trancher
  seul.
- Ne me félicitez pas, ne commencez pas vos réponses par une reformulation de
  ma demande.

Mots et tournures que je ne veux pas lire : [À REMPLACER : trois ou quatre
formulations qui vous agacent, par exemple « n'hésitez pas à », « il est
important de noter que »].

## Les règles du projet

1. Aucune clé, aucun mot de passe, aucune donnée sensible dans le code ou dans
   un fichier suivi par git. Les secrets vivent dans un fichier `.env`, qui est
   listé dans le `.gitignore`.
2. Avant de créer ou de modifier plusieurs fichiers d'un coup, annoncez ce que
   vous allez faire et attendez ma validation.
3. Ne supprimez jamais un fichier sans me le demander.
4. Toute nouvelle information rangée respecte les règles de nommage décrites
   dans `notes/`.
5. Les commits sont courts et décrivent ce qui change, pas comment.
6. [À REMPLACER : une règle qui vient de votre projet. Par exemple, pour un
   portfolio : « n'écrivez jamais une affirmation sur moi dont je ne vous ai
   pas donné la matière ».]

## Où trouver quoi

- `matiere/` : la matière première que je fournis au projet (notes, documents,
  cours, sources, fichiers à ranger).
- `sorties/` : ce que le projet produit et que je consulte (briefs, fiches,
  pages, rapports).
- `notes/` : mes décisions et mes règles (arborescence retenue, conventions de
  nommage, choix que je ne veux pas réexpliquer).
- `prompts/` : les prompts fournis avec le kit, à recopier dans une
  conversation.
- `README.md` : la présentation du projet, pour quelqu'un qui arrive dessus
  sans rien savoir.

[À REMPLACER : ajoutez ici les dossiers que vous créerez pendant le week-end,
avec une ligne chacun.]
