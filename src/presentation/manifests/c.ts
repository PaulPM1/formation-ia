import { externalLink, wikiLink } from '../presentation-links';
import type { PresentationDeck, PresentationSlide } from '../presentation-model';

const slide = (value: PresentationSlide) => value;

const links = {
  skills: externalLink('official', 'Utiliser les skills dans Claude', 'https://support.claude.com/en/articles/12512180-using-skills-in-claude'),
  connectors: externalLink('official', 'Utiliser les connecteurs', 'https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities'),
  mcp: externalLink('official', 'Introduction à MCP', 'https://modelcontextprotocol.io/docs/getting-started/intro'),
  design: externalLink('official', 'Bien démarrer avec Claude Design', 'https://support.claude.com/en/articles/14604416-get-started-with-claude-design'),
  scheduled: externalLink('official', "Les tâches planifiées dans l'application", 'https://code.claude.com/docs/en/desktop-scheduled-tasks'),
};

export const C_DECKS = [
  {
    brickId: 'c1', family: 'c', order: 8, title: 'Skills', slides: [
      slide({
        id: 'c1-ouverture', role: 'opening',
        claim: 'Skills : apprendre un savoir-faire à Claude',
        support: 'Une méthode rangée dans un dossier, ressortie au bon moment.',
        visual: { key: 'cover', data: {} },
        links: [wikiLink('c1', 'lessentiel', 'La brique C1')],
        speaker: { durationMinutes: 1, notes: "Partir d'une situation vécue : qui a déjà réexpliqué trois fois la même chose à Claude ? Un skill, c'est cette explication écrite une fois pour toutes.", transition: 'Voyons ce qui se passe quand Claude en utilise un.' },
        accessibleDescription: 'Slide de titre de la brique C1, Skills.',
      }),
      slide({
        id: 'c1-charge', role: 'explanation',
        claim: 'Claude ouvre le skill quand il en a besoin',
        visual: { key: 'visual', data: { name: 'SkillLoads' } },
        links: [wikiLink('c1', 'lessentiel', 'Le skill, pas à pas'), links.skills],
        speaker: { durationMinutes: 2, notes: "Jouer l'animation en cliquant les étapes. S'arrêter sur l'étape 2 : Claude ne connaît d'abord que la description, il n'ouvre la méthode que si la demande s'y prête.", transition: 'Je vous le montre avec un vrai skill : setup-projet.' },
        accessibleDescription: "L'application en trois étapes : une demande, Claude reconnaît le skill à sa description, puis il ouvre le fichier et suit la méthode.",
      }),
      slide({
        id: 'c1-demo', role: 'demonstration',
        claim: 'En direct : « lance setup-projet »',
        visual: { key: 'demo', data: { steps: ['Un dossier vide, ouvert dans Code', 'Écrire « lance setup-projet »', 'La première question arrive : le skill parle', 'Ouvrir SKILL.md : ce n’est que du texte'] } },
        links: [wikiLink('c1', 'à-essayer', 'Les phrases à copier')],
        speaker: { durationMinutes: 4, notes: "S'arrêter à la première question : le cadrage complet vient plus tard, avec la brique E3. Ouvrir SKILL.md une seule fois pour montrer une description, puis une méthode. Personne n'aura à écrire ce fichier.", transition: 'Ce skill, vous allez l’ajouter chez vous. Voici où cliquer.' },
        accessibleDescription: 'Quatre gestes numérotés : ouvrir un dossier vide, écrire lance setup-projet, voir la première question, ouvrir le fichier SKILL.md.',
      }),
      slide({
        id: 'c1-ajouter', role: 'explanation',
        claim: 'Ajouter un skill : Plugins, Skills, Add',
        visual: { key: 'visual', data: { name: 'CustomizePanel', props: {
          tab: 'Skills',
          menu: 'Upload a skill',
          rows: [
            { name: 'setup-projet', about: 'Cadre un projet à partir d’une simple idée.', state: 'on', pin: 4 },
            { name: 'skill-creator', about: 'Écrit de nouveaux skills avec vous.', state: 'on' },
            { name: 'pdf', about: 'Lit et fabrique des fichiers PDF.', state: 'on' },
          ],
          legend: [
            'Dans l’onglet Chat, ouvrez <b>Plugins</b>.',
            'Restez sur <b>Skills</b>.',
            'Cliquez sur <b>Add</b>, puis déposez le fichier du skill.',
            'Il apparaît dans la liste, allumé : Claude peut s’en servir.',
          ],
        } } },
        links: [wikiLink('c1', 'à-essayer', 'Ajouter setup-projet')],
        speaker: { durationMinutes: 2, notes: "Refaire le geste sur votre écran avec le fichier setup-projet.zip, puis laisser chacun le faire. Un skill absent de la liste : vérifier dans les réglages que la création de fichiers et l'exécution de code sont activées.", transition: 'Une question revient toujours : quelle différence avec CLAUDE.md ?' },
        accessibleDescription: "La page Plugins de l'onglet Chat, onglet Skills, avec quatre repères : Plugins, Skills, le bouton Add, puis le skill setup-projet allumé dans la liste.",
      }),
      slide({
        id: 'c1-memoire', role: 'claim',
        claim: 'CLAUDE.md ou skill ?',
        bullets: ['CLAUDE.md : relu à chaque conversation', 'Skill : ouvert seulement quand il sert', 'Troisième explication ? Faites-en un skill'],
        visual: { key: 'visual', data: { name: 'SkillVsMemory', layout: 'side' } },
        links: [wikiLink('c1', 'comprendre', 'Ni un prompt, ni CLAUDE.md')],
        speaker: { durationMinutes: 1, notes: "Donner la phrase à copier : « je te réexplique souvent la même chose, écris un skill pour le faire toujours de cette façon ». C'est Claude qui écrit le fichier, jamais vous.", transition: 'Claude a des savoir-faire. Il lui manque encore l’accès à vos outils.' },
        accessibleDescription: 'Un schéma en deux colonnes : CLAUDE.md est relu à chaque conversation, le skill n’est ouvert que lorsque la demande s’y prête.',
      }),
    ],
  },
  {
    brickId: 'c2', family: 'c', order: 9, title: 'Connecteurs, MCP et API', slides: [
      slide({
        id: 'c2-ouverture', role: 'opening',
        claim: 'Brancher Claude sur vos outils',
        support: 'Agenda, messagerie, documents : il y lit quand vous le demandez.',
        visual: { key: 'cover', data: {} },
        links: [wikiLink('c2', 'lessentiel', 'La brique C2')],
        speaker: { durationMinutes: 1, notes: "Poser la question à la salle : Claude sait-il ce que vous faites mardi ? Non, sauf si on le branche sur votre agenda.", transition: 'Suivons une question, de votre clavier à votre agenda.' },
        accessibleDescription: 'Slide de titre de la brique C2, Connecteurs, MCP et API.',
      }),
      slide({
        id: 'c2-trajet', role: 'explanation',
        claim: 'Claude répond avec vos vraies données',
        visual: { key: 'visual', data: { name: 'ConnectorFlow' } },
        links: [wikiLink('c2', 'lessentiel', 'Le trajet, pas à pas'), links.connectors],
        speaker: { durationMinutes: 2, notes: "Jouer l'animation en cliquant les étapes. À l'étape 2, insister : il passe avec votre accord et avec vos droits, il voit ce que vous voyez. Glisser que la documentation appelle cela un serveur MCP : c'est la même chose.", transition: 'On le fait en vrai, avant et après le branchement.' },
        accessibleDescription: "Une question sur l'agenda posée dans Chat, Claude passe par le connecteur, puis répond avec les rendez-vous réels.",
      }),
      slide({
        id: 'c2-demo', role: 'demonstration',
        claim: 'En direct : la même question, avant et après',
        visual: { key: 'demo', data: { steps: ['Sans connecteur : Claude ne peut pas répondre', 'Brancher l’agenda, lire la demande d’accord', 'Reposer la question : la réponse est là', 'Débrancher : elle échoue de nouveau'] } },
        links: [wikiLink('c2', 'à-essayer', 'La question à copier')],
        speaker: { durationMinutes: 3, notes: "Utiliser un compte de démonstration aux données fictives. Lire la demande d'accord à voix haute avec la salle. Faire vérifier une réponse dans l'agenda lui-même : branché ne veut pas dire exact.", transition: 'Pour brancher le vôtre, c’est la même page que pour les skills.' },
        accessibleDescription: "Quatre gestes numérotés : poser la question sans connecteur, brancher l'agenda, reposer la question, débrancher.",
      }),
      slide({
        id: 'c2-brancher', role: 'explanation',
        claim: 'Brancher un outil : Plugins, Connectors, Add',
        visual: { key: 'visual', data: { name: 'CustomizePanel', props: {
          tab: 'Connectors',
          rows: [
            { name: 'Google Calendar', about: 'Votre agenda.', state: 'connected', pin: 4 },
            { name: 'Gmail', about: 'Votre messagerie.', state: 'connect' },
            { name: 'Google Drive', about: 'Vos documents.', state: 'connect' },
          ],
          legend: [
            'Dans l’onglet Chat, ouvrez <b>Plugins</b>.',
            'Passez sur <b>Connectors</b>.',
            'Cliquez sur <b>Add</b>, choisissez votre outil, puis <b>Connect</b>.',
            'Connectez-vous à votre compte dans la page qui s’ouvre : l’outil est branché.',
          ],
        } } },
        links: [wikiLink('c2', 'à-essayer', 'Brancher un outil')],
        speaker: { durationMinutes: 1, notes: "La connexion passe toujours par la page officielle de l'outil : personne ne colle un mot de passe ou une clé dans la conversation. Compte professionnel bloqué par son administrateur : regarder la démonstration.", transition: 'Un autre mot circule : API. Ce n’est pas la même chose.' },
        accessibleDescription: "La page Plugins de l'onglet Chat, onglet Connectors, avec quatre repères : Plugins, Connectors, le bouton Add, puis Google Calendar connecté.",
      }),
      slide({
        id: 'c2-api', role: 'claim',
        claim: 'Connecteur ou API ?',
        bullets: ['Connecteur : Claude lit vos outils', 'API : votre projet parle à un service', 'C’est l’API qui demande une clé'],
        visual: { key: 'visual', data: { name: 'ConnectorVsApi', layout: 'side' } },
        links: [wikiLink('c2', 'comprendre', 'Connecteur ou API ?'), links.mcp],
        speaker: { durationMinutes: 1, notes: "La question à se poser : qui a besoin de parler au service, Claude pendant que je lui parle, ou mon site quand je ne suis pas là ? La clé API se garde secrète, on y revient avec la sécurité.", transition: 'Vérifions sur six situations.' },
        accessibleDescription: 'Un schéma en deux lignes : le connecteur relie Claude à vos outils, l’API relie votre projet à un service et demande une clé.',
      }),
      slide({
        id: 'c2-jeu', role: 'checkpoint',
        claim: 'À vous : connecteur ou clé API ?',
        visual: { key: 'sort', data: { buckets: ['Connecteur', 'Clé API'], items: [
          { label: 'Claude lit mon agenda de la semaine', bucket: 0, why: 'C’est Claude qui va lire votre outil.' },
          { label: 'Mon site affiche la météo du jour', bucket: 1, why: 'Le site interroge un service tout seul.' },
          { label: 'Claude résume mes derniers e-mails', bucket: 0, why: 'Claude, votre messagerie, vos droits.' },
          { label: 'Mon appli envoie un SMS de rappel', bucket: 1, why: 'L’appli parle au service, sans Claude.' },
          { label: 'Claude retrouve un document partagé', bucket: 0, why: 'Il passe par le connecteur de vos documents.' },
          { label: 'Mon quiz en ligne interroge une IA', bucket: 1, why: 'Le projet appelle l’IA lui-même : il lui faut une clé.' },
        ] } },
        links: [wikiLink('c2', 'comprendre', 'Connecteur ou API ?')],
        speaker: { durationMinutes: 2, notes: "La salle crie la réponse, vous cliquez. Le repère : « Claude fait » va à gauche, « mon site fait » va à droite. Si une carte divise, demander pourquoi avant de révéler.", transition: 'Claude a des savoir-faire et des accès. Reste à lui donner un coup de crayon.' },
        accessibleDescription: 'Un jeu de six cartes à ranger entre Connecteur et Clé API, avec l’explication de chaque réponse et un score final.',
      }),
    ],
  },
  {
    brickId: 'c4', family: 'c', order: 10, title: 'Claude Design', slides: [
      slide({
        id: 'c4-ouverture', role: 'opening',
        claim: 'Design : voir avant de construire',
        support: 'Vous choisissez l’allure, puis Claude Code construit.',
        visual: { key: 'cover', data: {} },
        links: [wikiLink('c4', 'lessentiel', 'La brique C4')],
        speaker: { durationMinutes: 1, notes: "Changer d'avis sur un dessin prend une phrase ; sur une page déjà construite, c'est plus long. D'où l'ordre : on dessine, on choisit, on construit.", transition: 'Que peut-on lui faire dessiner ? Quatre choses.' },
        accessibleDescription: 'Slide de titre de la brique C4, Claude Design.',
      }),
      slide({
        id: 'c4-usages', role: 'claim',
        claim: 'Un site, un logo, une présentation, une appli',
        visual: { key: 'visual', data: { name: 'DesignUses' } },
        links: [wikiLink('c4', 'comprendre', 'Quatre choses à lui faire dessiner')],
        speaker: { durationMinutes: 2, notes: "Demander à la salle : laquelle des quatre vous servirait ce week-end ? Noter une ou deux réponses, l'une d'elles servira de sujet à la démonstration.", transition: 'Voici comment se passe une séance de dessin.' },
        accessibleDescription: 'Quatre tuiles avec un croquis chacune : un site, un logo, une présentation, une application mobile.',
      }),
      slide({
        id: 'c4-flux', role: 'explanation',
        claim: 'Décrire, comparer, passer à Code',
        visual: { key: 'visual', data: { name: 'DesignFlow' } },
        links: [wikiLink('c4', 'lessentiel', 'Le design, pas à pas'), links.design],
        speaker: { durationMinutes: 3, notes: "Jouer l'animation étape par étape. À l'étape 3, insister : demandez toujours des variantes, on choisit mieux en comparant. À l'étape 4 : le dessin n'est pas la page, c'est Claude Code qui la construit.", transition: 'Par où entre-t-on dans Design ?' },
        accessibleDescription: 'Design en quatre étapes : une description, une proposition sur le canevas, des variantes côte à côte, puis le design envoyé à Claude Code.',
      }),
      slide({
        id: 'c4-accueil', role: 'explanation',
        claim: 'Ouvrir Design et choisir quoi créer',
        visual: { key: 'visual', data: { name: 'DesignHome' } },
        links: [wikiLink('c4', 'à-essayer', 'Ouvrir Design')],
        speaker: { durationMinutes: 1, notes: "Montrer le vrai écran en parallèle. Ne détailler que les tuiles Slides et Design ; les autres sont dans la brique. Demander un design dans une conversation ordinaire marche aussi.", transition: 'Assez de maquettes : on dessine le projet de quelqu’un.' },
        accessibleDescription: "La page d'accueil de Design : le menu de l'onglet Chat, les tuiles pour créer un nouveau design, puis les designs déjà faits.",
      }),
      slide({
        id: 'c4-demo', role: 'demonstration',
        claim: 'En direct : la page d’accueil de votre projet',
        visual: { key: 'demo', data: { steps: ['Décrire la page d’un projet de la salle', 'Demander deux variantes, la salle vote', 'Corriger : phrase, commentaire, à la main', 'Envoyer à Claude Code, qui construit'] } },
        links: [wikiLink('c4', 'à-essayer', 'Les phrases à copier')],
        speaker: { durationMinutes: 8, notes: "Prendre l'idée d'une personne de la salle et décrire sa page à voix haute. Faire voter entre les variantes, corriger une fois de chaque façon, puis aller jusqu'à la vraie page dans l'aperçu de Code. Prévenir : Design consomme le même abonnement, et le dessin sert à décider, pas à finir.", transition: 'Dernière extension : faire travailler Claude à heure fixe.' },
        accessibleDescription: 'Quatre gestes numérotés : décrire une page, demander deux variantes, corriger de trois façons, envoyer le design à Claude Code.',
      }),
    ],
  },
  {
    brickId: 'c3', family: 'c', order: 11, title: 'Tâches planifiées', slides: [
      slide({
        id: 'c3-ouverture', role: 'opening',
        claim: 'Claude travaille à heure fixe',
        support: 'Une demande qu’il refait tout seul, quand vous le décidez.',
        visual: { key: 'cover', data: {} },
        links: [wikiLink('c3', 'lessentiel', 'La brique C3')],
        speaker: { durationMinutes: 1, notes: "Brique courte, en bonus. L'idée tient en une phrase : ce que vous demandez chaque matin, Claude peut le faire sans qu'on le lui demande.", transition: 'Une phrase suffit pour en créer une.' },
        accessibleDescription: 'Slide de titre de la brique C3, Tâches planifiées.',
      }),
      slide({
        id: 'c3-tache', role: 'explanation',
        claim: 'Vous le dites une fois, il le refait chaque jour',
        visual: { key: 'visual', data: { name: 'ScheduledRun' } },
        links: [wikiLink('c3', 'lessentiel', 'La tâche, pas à pas'), links.scheduled],
        speaker: { durationMinutes: 2, notes: "Deux limites à dire : l'application doit être ouverte et l'ordinateur allumé, et personne ne regarde pendant que la tâche tourne. Donc de quoi lire et résumer, jamais de quoi envoyer ou supprimer.", transition: 'Je la crée devant vous, puis je l’arrête.' },
        accessibleDescription: 'Une demande à heure fixe écrite dans la conversation, puis la tâche qui se lance seule et dépose son résultat.',
      }),
      slide({
        id: 'c3-demo', role: 'demonstration',
        claim: 'En direct : créer, lancer, mettre en pause',
        visual: { key: 'demo', data: { steps: ['« Tous les matins à 9 h, dis-moi où en est mon projet »', 'Ouvrir Scheduled, cliquer sur Run now', 'Lire le résultat : une conversation ordinaire', 'Mettre la tâche en pause'] } },
        links: [wikiLink('c3', 'à-essayer', 'La phrase à copier')],
        speaker: { durationMinutes: 2, notes: "Le premier Run now sert aussi à donner les permissions, sinon la tâche attendra sans que personne le voie. Mettre en pause devant tout le monde : une tâche oubliée consomme l'abonnement chaque jour. Selon la version, le menu s'appelle encore Routines.", transition: 'Claude est équipé. Passons à ce que vous mettez en ligne, et à la sécurité.' },
        accessibleDescription: 'Quatre gestes numérotés : écrire la demande à heure fixe, lancer la tâche depuis Scheduled, lire le résultat, mettre en pause.',
      }),
    ],
  },
] satisfies PresentationDeck[];
