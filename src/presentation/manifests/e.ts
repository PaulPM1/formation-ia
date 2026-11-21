import { externalLink, wikiLink } from '../presentation-links';
import type { PresentationDeck, PresentationSlide } from '../presentation-model';

const slide = (value: PresentationSlide) => value;

const links = {
  memory: externalLink('official', 'La mémoire de Claude Code', 'https://code.claude.com/docs/en/memory'),
  desktop: externalLink('official', "Claude Code dans l'application de bureau", 'https://code.claude.com/docs/en/desktop'),
  skills: externalLink('official', 'Les skills dans Claude Code', 'https://code.claude.com/docs/en/skills'),
};

export const E_DECKS = [
  {
    brickId: 'e1', family: 'e', order: 16, title: 'Demande et contexte', slides: [
      slide({
        id: 'e1-ouverture', role: 'opening',
        claim: 'Claude ne lit pas dans vos pensées',
        support: 'Trois phrases changent tout : le but, le contexte, le résultat attendu.',
        visual: { key: 'cover', data: {} },
        links: [wikiLink('e1', 'lessentiel', 'La brique E1')],
        speaker: { durationMinutes: 1, notes: "Partir d'un vécu de la salle : qui a déjà reçu de Claude un résultat correct mais à côté de ce qu'il voulait ? C'est presque toujours la demande, pas Claude.", transition: 'Regardez la même envie, demandée de deux façons.' },
        accessibleDescription: 'Slide de titre de la brique E1, Demande et contexte.',
      }),
      slide({
        id: 'e1-floue-claire', role: 'claim',
        claim: 'La même envie, deux demandes, deux résultats',
        visual: { key: 'visual', data: { name: 'VagueVsClear' } },
        links: [wikiLink('e1', 'lessentiel', 'Demande floue, demande claire')],
        speaker: { durationMinutes: 2, notes: "Faire lire les deux demandes à voix haute. Montrer les trois couleurs : le but, le contexte, à quoi ressemble « réussi ». Une demande claire n'est pas une demande longue : trois phrases.", transition: 'À vous de juger : trois demandes, une seule est bonne.' },
        accessibleDescription: "Deux fenêtres côte à côte : une demande floue donne une page passe-partout, une demande en trois phrases donne la page attendue. Une légende nomme le but, le contexte et le critère de réussite.",
      }),
      slide({
        id: 'e1-jeu', role: 'checkpoint',
        claim: 'Laquelle donnera le meilleur résultat ?',
        visual: { key: 'quiz', data: { options: [
          { label: 'Fais-moi une appli pour réviser.', why: 'Réviser quoi, pour qui, comment ? Claude devine tout.' },
          { label: "Fais-moi une appli de révision pour le code de la route, avec des questions.", why: "Le but est là, mais ni la personne ni ce qui compte comme réussi." },
          { label: "Je veux réviser le code de la route. C'est pour moi, dix minutes par jour dans le bus. Réussi si je revois d'abord mes erreurs.", correct: true, why: 'Le but, le contexte, et à quoi ressemble « réussi ».' },
        ] } },
        links: [wikiLink('e1', 'à-essayer', 'La demande en trois phrases')],
        speaker: { durationMinutes: 3, notes: "Faire voter à main levée avant de cliquer. S'arrêter sur la deuxième : elle paraît précise, mais il lui manque la personne et le critère de réussite. Demander à la salle ce que Claude devrait inventer.", transition: 'Pourquoi faut-il tout lui écrire ? Parce qu’il voit très peu de choses.' },
        accessibleDescription: 'Un quiz : trois demandes pour une application de révision, une floue, une moyenne et une claire, avec une explication pour chacune.',
      }),
      slide({
        id: 'e1-voit', role: 'explanation',
        claim: "Il ne voit que ce qu'on lui donne",
        bullets: ['La conversation et le dossier, rien de plus', "L'évident pour vous doit être écrit", 'Une capture jointe vaut une description'],
        visual: { key: 'visual', data: { name: 'WhatClaudeSees', layout: 'side' } },
        links: [wikiLink('e1', 'comprendre', 'Ce que Claude voit')],
        speaker: { durationMinutes: 1, notes: "Dire : il ne se souvient pas de la conversation d'hier, il ne relit que les fichiers. La phrase utile quand on ne sait pas quoi préciser : « pose-moi les questions dont tu as besoin ».", transition: 'Et même ce qu’il voit, il peut finir par le perdre.' },
        accessibleDescription: 'Deux colonnes : Claude voit la conversation, les fichiers du dossier et CLAUDE.md ; il ne voit pas ce que vous avez en tête, vos autres conversations ni ce qui vous paraît évident.',
      }),
      slide({
        id: 'e1-jauge', role: 'explanation',
        claim: 'Trop long, Claude perd le fil',
        visual: { key: 'visual', data: { name: 'ContextGauge' } },
        links: [wikiLink('e1', 'comprendre', 'Ouvrir une nouvelle conversation'), links.memory],
        speaker: { durationMinutes: 3, notes: "Jouer les quatre étapes en cliquant. À la troisième, faire trouver l'erreur par la salle : le nom de famille interdit au début est revenu. Raconter un cas vécu, puis donner le geste : faire noter l'avancement dans CLAUDE.md, nouvelle conversation, « on continue ».", transition: 'On vérifie tout de suite que trois phrases suffisent.' },
        accessibleDescription: "Une conversation en quatre étapes : une consigne donnée au début, la conversation s'allonge, Claude oublie la consigne, puis une nouvelle conversation relit CLAUDE.md et repart juste. Une jauge se remplit puis se vide.",
      }),
      slide({
        id: 'e1-demo', role: 'demonstration',
        claim: 'En direct : la même idée, floue puis claire',
        visual: { key: 'demo', data: { steps: ['Un dossier vide, deux conversations', 'La demande floue dans la première', 'Trois phrases dictées par la salle', 'Les deux aperçus côte à côte'] } },
        links: [wikiLink('e1', 'à-essayer', 'Les phrases à copier')],
        speaker: { durationMinutes: 5, notes: "Prendre une idée de la salle. Lancer la demande floue, puis faire dicter les trois phrases : le but, pour qui, réussi si. Afficher les deux aperçus et laisser le groupe dire ce qui a changé, sans commenter à sa place.", transition: 'Ces trois phrases, on va les appliquer à votre projet entier : cette fois, c’est Claude qui pose les questions.' },
        accessibleDescription: 'Quatre gestes numérotés : ouvrir deux conversations sur un dossier vide, envoyer une demande floue, envoyer une demande en trois phrases, comparer les deux aperçus.',
      }),
    ],
  },
  {
    brickId: 'e2', family: 'e', order: 17, title: "Donner de l'allure à son projet", slides: [
      slide({
        id: 'e2-ouverture', role: 'opening',
        claim: 'Ça marche, mais vous le voulez plus beau',
        support: "L'allure se demande comme le reste : décrire, montrer, choisir.",
        visual: { key: 'cover', data: {} },
        links: [wikiLink('e2', 'lessentiel', 'La brique E2')],
        speaker: { durationMinutes: 1, notes: "Fiche bonus, à sortir pendant la construction. Poser la règle d'emblée : l'allure vient après une première fonctionnalité qui marche, pas avant.", transition: 'Voici la demande qui donne une allure, en trois ingrédients.' },
        accessibleDescription: "Slide de titre de la brique E2, Donner de l'allure à son projet.",
      }),
      slide({
        id: 'e2-versions', role: 'explanation',
        claim: 'Un exemple, des mots simples, trois versions',
        visual: { key: 'visual', data: { name: 'StyleBrief' } },
        links: [wikiLink('e2', 'lessentiel', "Décrire l'allure voulue"), links.desktop],
        speaker: { durationMinutes: 4, notes: "Suivre les trois repères. Insister sur le troisième : choisir entre trois versions est bien plus facile que décrire ce qu'on veut. Si le temps le permet, le faire sur un projet de la salle avec la capture d'un site aimé, puis vote à main levée.", transition: 'Quels mots utiliser quand on n’est pas graphiste ?' },
        accessibleDescription: "L'onglet Code avec trois repères : une capture jointe, une demande décrivant l'allure d'un carnet de cuisine, et trois versions de la page dans l'aperçu.",
      }),
      slide({
        id: 'e2-mots', role: 'explanation',
        claim: 'Des mots de tous les jours',
        bullets: ['Une ambiance, des couleurs', 'Une comparaison : « comme un magazine »', 'Aucun vocabulaire de graphiste'],
        visual: { key: 'visual', data: { name: 'LookWords', layout: 'side' } },
        links: [wikiLink('e2', 'comprendre', "Les mots de l'allure")],
        speaker: { durationMinutes: 2, notes: "Faire décrire par deux personnes l'allure qu'elles veulent avec un mot de chaque ligne. À qui répond « je ne sais pas ce que je veux » : chercher deux sites aimés, la capture fera le reste.", transition: 'Une fois la version choisie, on corrige en regardant.' },
        accessibleDescription: "La demande « fais quelque chose de joli » barrée, remplacée par quatre familles de mots : une ambiance, des couleurs, une comparaison, de la place.",
      }),
      slide({
        id: 'e2-corriger', role: 'claim',
        claim: 'Dites ce que vous voyez',
        visual: { key: 'visual', data: { name: 'PointAndFix', layout: 'side' } },
        links: [wikiLink('e2', 'comprendre', "Corriger en regardant l'aperçu")],
        speaker: { durationMinutes: 3, notes: "Lire les trois corrections : chacune nomme un endroit visible et un seul changement. Dix changements demandés d'un coup, c'est le piège : un à la fois, en regardant l'aperçu.", transition: 'L’allure attendra : il vous faut d’abord un projet. On le lance.' },
        accessibleDescription: "Un aperçu de page avec trois repères, chacun relié à une correction : le titre plus grand, plus d'espace entre les photos, un texte plus foncé.",
      }),
    ],
  },
  {
    brickId: 'e3', family: 'e', order: 18, title: 'Lancer son projet', slides: [
      slide({
        id: 'e3-ouverture', role: 'opening',
        claim: 'Avant de construire, Claude vous interroge',
        support: 'Un dossier vide, une idée, et des questions pour bien comprendre.',
        visual: { key: 'cover', data: {} },
        links: [wikiLink('e3', 'lessentiel', 'La brique E3')],
        speaker: { durationMinutes: 1, notes: "Dernière brique de la matinée : tout ce qu'on a vu sert ici. Annoncer que dans un quart d'heure, chacun aura lancé son propre projet.", transition: 'Tout part d’une phrase : lance setup-projet.' },
        accessibleDescription: 'Slide de titre de la brique E3, Lancer son projet.',
      }),
      slide({
        id: 'e3-interview', role: 'explanation',
        claim: 'Il questionne, il reformule',
        visual: { key: 'visual', data: { name: 'SetupInterviewSlide' } },
        links: [wikiLink('e3', 'lessentiel', "L'interview, pas à pas"), links.skills],
        speaker: { durationMinutes: 3, notes: "Jouer les quatre étapes en cliquant. S'arrêter sur la quatrième : dire « presque, pas tout à fait » est le geste attendu, pas une impolitesse. Les questions portent sur l'idée, jamais sur la technique.", transition: 'Au bout de l’interview, votre idée a changé de forme.' },
        accessibleDescription: "L'onglet Code en quatre étapes : Claude pose une question sur l'idée, la personne répond, Claude reformule, la personne corrige. À côté, les trois temps de l'interview.",
      }),
      slide({
        id: 'e3-liste', role: 'explanation',
        claim: 'Votre idée devient une liste',
        bullets: ['Claude la découpe avec vous', "Vous triez : garder, ajouter, l'ordre", 'La première ligne, et rien d’autre'],
        visual: { key: 'visual', data: { name: 'IdeaToFeatures', layout: 'side' } },
        links: [wikiLink('e3', 'comprendre', "De l'idée à la liste")],
        speaker: { durationMinutes: 1, notes: "Rien n'est retiré de l'idée : tout est rangé dans l'ordre. La première fonctionnalité doit se voir fonctionner en moins d'une heure ; sinon on la redécoupe.", transition: 'Cette liste, on la descend toujours de la même façon.' },
        accessibleDescription: "Une idée, un site pour les recettes de la famille, devient une liste de cinq fonctionnalités numérotées ; la première est marquée « on commence ici ».",
      }),
      slide({
        id: 'e3-boucle', role: 'claim',
        claim: 'Une fonctionnalité à la fois',
        bullets: ['Regardez l’aperçu, pas le code', 'Faites corriger jusqu’à ce que ça vous aille', 'Ensuite seulement, la suivante'],
        visual: { key: 'visual', data: { name: 'FeatureLoop', layout: 'side' } },
        links: [wikiLink('e3', 'comprendre', 'La boucle de construction')],
        speaker: { durationMinutes: 1, notes: "C'est la boucle de Claude Code vue ce matin, appliquée ligne par ligne. Vouloir tout construire d'un coup est le piège : ramener à la première ligne de la liste.", transition: 'Et l’idée géniale qui arrive au milieu ?' },
        accessibleDescription: 'Une boucle en quatre étapes : Claude construit une fonctionnalité, vous regardez, vous faites corriger, Claude sauvegarde, puis la fonctionnalité suivante.',
      }),
      slide({
        id: 'e3-idee', role: 'claim',
        claim: 'Une idée en route ? Dans la liste',
        bullets: ['Dites-la tout de suite', 'Claude la note', 'Il finit d’abord ce qui est commencé'],
        visual: { key: 'visual', data: { name: 'ParkedIdea', layout: 'side' } },
        links: [wikiLink('e3', 'comprendre', 'Ranger une idée nouvelle')],
        speaker: { durationMinutes: 1, notes: "Aucune idée n'est perdue, aucune ne coupe le travail en cours. Les fichiers de notes sont ceux de Claude : personne n'a à les lire ni à les tenir.", transition: 'Je vous le montre sur une idée de la salle.' },
        accessibleDescription: "Une conversation : la personne propose d'imprimer une recette, Claude note l'idée dans la liste et annonce qu'il termine d'abord la fonctionnalité en cours.",
      }),
      slide({
        id: 'e3-demo', role: 'demonstration',
        claim: "En direct : setup-projet sur une idée de la salle",
        visual: { key: 'demo', data: { steps: ['Un dossier vide, ouvert dans Code', '« lance setup-projet »', 'Une question, une réponse, une reformulation', 'On corrige la reformulation'] } },
        links: [wikiLink('e3', 'à-essayer', 'Les phrases à copier')],
        speaker: { durationMinutes: 7, notes: "Demander une idée à la salle et jouer un seul temps en entier. Corriger volontairement la reformulation une fois, même si elle est juste. Montrer ensuite une liste de fonctionnalités déjà préparée et la phrase « construis la première fonctionnalité ».", transition: 'Vous avez vu le geste. Il ne reste qu’à le faire.' },
        accessibleDescription: 'Quatre gestes numérotés : ouvrir un dossier vide, écrire lance setup-projet, suivre un temps de l’interview, corriger la reformulation.',
      }),
      slide({
        id: 'e3-a-vous', role: 'transition',
        claim: 'À vous : lancez votre projet',
        support: 'Un dossier vide, une idée, et la phrase : lance setup-projet.',
        visual: { key: 'cover', data: {} },
        links: [wikiLink('e3', 'à-essayer', 'Les cinq gestes pour démarrer')],
        speaker: { durationMinutes: 1, notes: "Pas de résumé : faire ouvrir les dossiers tout de suite. Rappeler que le projet n'a pas à être fini ce week-end : une première fonctionnalité qui marche suffit, la suite se poursuit chacun à son rythme. L'interview prend une dizaine de minutes par personne.", transition: 'La matinée est finie : cet après-midi, vous construisez.' },
        accessibleDescription: "Slide de clôture : à vous, lancez votre projet, avec un dossier vide, une idée et la phrase lance setup-projet.",
      }),
    ],
  },
] satisfies PresentationDeck[];
