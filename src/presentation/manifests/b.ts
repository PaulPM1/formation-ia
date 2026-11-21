import { externalLink, wikiLink } from '../presentation-links';
import type { PresentationDeck, PresentationSlide } from '../presentation-model';

const slide = (value: PresentationSlide) => value;

const links = {
  artifacts: externalLink('official', 'Les artefacts dans Claude', 'https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them'),
  desktop: externalLink('official', "Claude Code dans l'application de bureau", 'https://code.claude.com/docs/en/desktop'),
};

export const B_DECKS = [
  {
    brickId: 'b1', family: 'b', order: 6, title: 'La conversation', slides: [
      slide({
        id: 'b1-ouverture', role: 'opening',
        claim: 'Parler à Claude, et le voir fabriquer',
        support: "L'onglet Chat, en trente minutes.",
        visual: { key: 'cover', data: {} },
        links: [wikiLink('b1', 'lessentiel', 'La brique B1')],
        speaker: { durationMinutes: 1, notes: "Annoncer le but : chacun repart de cette demi-heure avec un objet qu'il a fait fabriquer et fait changer.", transition: 'On commence par le geste de base : demander, puis répondre.' },
        accessibleDescription: 'Slide de titre de la brique B1, La conversation.',
      }),
      slide({
        id: 'b1-artefact', role: 'explanation',
        claim: "Vous parlez, l'objet apparaît à côté",
        bullets: ['On répond, on ne recommence pas', 'Un fichier joint devient sa matière', "L'artefact change sous vos yeux"],
        visual: { key: 'visual', data: { name: 'ChatArtifactLoop' } },
        links: [wikiLink('b1', 'lessentiel', "L'artefact, pas à pas"), links.artifacts],
        speaker: { durationMinutes: 4, notes: "Laisser l'animation se jouer une fois sans parler, puis la rejouer en cliquant les étapes. Insister sur l'étape 4 : on ne refait pas la demande, on répond.", transition: 'Assez regardé : on le fait pour de vrai.' },
        accessibleDescription: "Une conversation dans l'onglet Chat : un fichier est joint, Claude fabrique un quiz affiché à droite, puis le modifie après une réponse.",
      }),
      slide({
        id: 'b1-demo', role: 'demonstration',
        claim: 'À vous : un artefact en trois messages',
        visual: { key: 'demo', data: { tag: 'Tout le monde le fait', steps: ['Demandez un quiz sur un sujet que vous aimez', 'Répondez pour le faire changer', 'Joignez un fichier et faites-le résumer'] } },
        links: [wikiLink('b1', 'à-essayer', 'Les trois phrases à copier')],
        speaker: { durationMinutes: 10, notes: "Faire la première demande en direct sur un sujet proposé par la salle, puis laisser cinq minutes. Passer voir les écrans : celui qui retape toute sa demande au lieu de répondre est le cas à montrer.", transition: 'Vous avez vu le menu à gauche : quatre repères suffisent.' },
        accessibleDescription: 'Trois gestes numérotés : demander un quiz, répondre pour le faire changer, joindre un fichier.',
      }),
      slide({
        id: 'b1-menu', role: 'explanation',
        claim: 'Le menu de Chat, en quatre repères',
        visual: { key: 'visual', data: { name: 'ChatMenu' } },
        links: [wikiLink('b1', 'comprendre', 'Le menu de Chat')],
        speaker: { durationMinutes: 3, notes: "Montrer le vrai menu sur votre écran en parallèle. Ne pas détailler Scheduled, Design et Plugins : ils ont leurs briques.", transition: 'Un mot du menu prête à confusion : Projects.' },
        accessibleDescription: "La fenêtre de l'onglet Chat avec quatre repères sur le menu : New et Search, Projects, Artifacts, puis Scheduled, Design et Plugins.",
      }),
      slide({
        id: 'b1-projet', role: 'claim',
        claim: '« Projet » : un mot, trois sens',
        bullets: ['Un Project range vos conversations', "Votre projet, c'est votre idée", 'Elle se construit dans un dossier, côté Code'],
        visual: { key: 'visual', data: { name: 'TroisProjets', layout: 'side' } },
        links: [wikiLink('b1', 'comprendre', 'Les trois sens du mot')],
        speaker: { durationMinutes: 2, notes: "Lever la confusion maintenant évite dix questions cet après-midi. Dire : quand je dis « votre projet » ce week-end, je parle de votre idée.", transition: 'Pour construire cette idée sur votre ordinateur, on change d’onglet.' },
        accessibleDescription: 'Trois cartes : un Project dans Chat, votre projet dans votre tête, un dossier dans Code.',
      }),
    ],
  },
  {
    brickId: 'b2', family: 'b', order: 7, title: 'Claude Code', slides: [
      slide({
        id: 'b2-ouverture', role: 'opening',
        claim: 'Claude Code : il ne répond plus, il construit',
        support: "L'onglet où vous passerez votre week-end.",
        visual: { key: 'cover', data: {} },
        links: [wikiLink('b2', 'lessentiel', 'La brique B2')],
        speaker: { durationMinutes: 1, notes: "C'est la brique centrale : tout le projet de chacun se construit ici. Le dire tel quel.", transition: 'La différence avec Chat se voit sur une seule demande.' },
        accessibleDescription: 'Slide de titre de la brique B2, Claude Code.',
      }),
      slide({
        id: 'b2-chat-code', role: 'claim',
        claim: 'Chat répond, Code construit',
        bullets: ['La même demande, deux résultats', 'Dans Code, les fichiers existent vraiment', 'Ils sont dans votre dossier'],
        visual: { key: 'visual', data: { name: 'ChatVsCode', layout: 'side' } },
        links: [wikiLink('b2', 'comprendre', 'Chat contre Code')],
        speaker: { durationMinutes: 2, notes: "Faire lire les deux fenêtres à voix haute par quelqu'un. La phrase à retenir : dans Chat, le reste est à vous ; dans Code, c'est fait.", transition: 'Voici à quoi ressemble une séance de travail dans Code.' },
        accessibleDescription: 'Deux fenêtres côte à côte : dans Chat, Claude donne du code à copier ; dans Code, il crée trois fichiers dans le dossier.',
      }),
      slide({
        id: 'b2-boucle', role: 'explanation',
        claim: 'Demander, regarder, corriger',
        visual: { key: 'visual', data: { name: 'ClaudeCodeLoop' } },
        links: [wikiLink('b2', 'lessentiel', 'La boucle en quatre temps'), links.desktop],
        speaker: { durationMinutes: 4, notes: "Jouer l'animation étape par étape en cliquant. À l'étape 2, s'arrêter sur la demande de permission. À l'étape 3 : personne ne lit de code, on regarde l'aperçu.", transition: 'Par où entre-t-on ? Quatre clics.' },
        accessibleDescription: "L'onglet Code en quatre étapes : une demande, Claude écrit les fichiers et demande la permission, la page s'affiche dans l'aperçu, puis une correction la modifie.",
      }),
      slide({
        id: 'b2-ouvrir', role: 'explanation',
        claim: 'Ouvrir son dossier : quatre clics',
        visual: { key: 'visual', data: { name: 'OpenFolder' } },
        links: [wikiLink('b2', 'à-essayer', 'Le geste, repère par repère')],
        speaker: { durationMinutes: 2, notes: 'Refaire le geste sur votre écran juste après la slide. Vérifier que tout le monde est bien sur Local.', transition: 'Je vous le montre en vrai, puis vous le faites.' },
        accessibleDescription: "L'écran New session de l'onglet Code avec quatre repères : l'onglet Code, Local, Open folder, la zone de saisie.",
      }),
      slide({
        id: 'b2-demo', role: 'demonstration',
        claim: 'En direct : une page en trois demandes',
        visual: { key: 'demo', data: { steps: ['Un dossier vide, ouvert dans Code', 'Une page sur le plat préféré de la salle', 'Une correction qui se voit', 'Une note dans CLAUDE.md'] } },
        links: [wikiLink('b2', 'à-essayer', 'Les phrases à copier')],
        speaker: { durationMinutes: 10, notes: "Dire la demande à voix haute avant de l'écrire. Lire la permission avec la salle. Laisser la salle dicter la correction. Puis chacun refait la séquence chez soi sur son sujet.", transition: 'Vous avez vu une fenêtre vous demander la permission : parlons-en.' },
        accessibleDescription: 'Quatre gestes numérotés : ouvrir un dossier vide, demander une page, demander une correction visible, faire écrire CLAUDE.md.',
      }),
      slide({
        id: 'b2-permission', role: 'claim',
        claim: "Il demande avant d'agir",
        bullets: ['Lisez ce que Claude veut faire', "Acceptez si c'est votre demande", 'Sinon refusez, et demandez pourquoi'],
        visual: { key: 'visual', data: { name: 'PermissionCard', layout: 'side' } },
        links: [wikiLink('b2', 'comprendre', 'La demande de permission')],
        speaker: { durationMinutes: 2, notes: "C'est le seul moment où la personne décide seule. Une permission acceptée sans être lue : la relire ensemble une fois.", transition: 'Dernière pièce : comment il se souvient de votre projet demain.' },
        accessibleDescription: 'La carte de permission en gros plan, avec deux repères : la phrase à lire, puis les boutons.',
      }),
      slide({
        id: 'b2-memoire', role: 'explanation',
        claim: 'CLAUDE.md, la mémoire du projet',
        visual: { key: 'visual', data: { name: 'ClaudeMemory' } },
        links: [wikiLink('b2', 'comprendre', 'CLAUDE.md')],
        speaker: { durationMinutes: 3, notes: "Montrer en vrai une nouvelle conversation qui relit le fichier. Ce qui doit durer s'écrit dans CLAUDE.md, le reste s'oublie.", transition: 'Petit jeu pour vérifier que Chat et Code sont clairs.' },
        accessibleDescription: 'Une nouvelle conversation part de zéro, Claude relit CLAUDE.md, puis il sait où en est le projet.',
      }),
      slide({
        id: 'b2-jeu', role: 'checkpoint',
        claim: 'Chat ou Code ?',
        visual: { key: 'sort', data: { buckets: ['Chat', 'Code'], items: [
          { label: 'Trouver des idées de projet', bucket: 0, why: 'On réfléchit, on ne construit rien encore.' },
          { label: 'Construire mon site de recettes', bucket: 1, why: 'Des fichiers à créer dans un dossier : Code.' },
          { label: 'Résumer un PDF de trente pages', bucket: 0, why: 'Un fichier joint, une réponse : Chat.' },
          { label: 'Corriger le titre trop petit de ma page', bucket: 1, why: 'La page vit dans le dossier du projet.' },
          { label: 'Un petit quiz pour ce soir', bucket: 0, why: 'Un artefact suffit, sans rien installer.' },
          { label: 'Mettre mon projet en ligne', bucket: 1, why: 'Claude agit sur votre projet et sur GitHub.' },
        ] } },
        links: [wikiLink('a2', 'comprendre', 'Répondre ou agir')],
        speaker: { durationMinutes: 3, notes: 'La salle crie la réponse, vous cliquez. Si une carte divise, demandez pourquoi avant de révéler.', transition: 'Claude sait construire. Voyons comment lui donner des savoir-faire en plus.' },
        accessibleDescription: "Un jeu de six cartes à ranger entre Chat et Code, avec l'explication de chaque réponse et un score final.",
      }),
    ],
  },
] satisfies PresentationDeck[];
