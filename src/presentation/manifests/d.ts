import { externalLink, wikiLink } from '../presentation-links';
import type { PresentationDeck, PresentationSlide } from '../presentation-model';

const slide = (value: PresentationSlide) => value;

const links = {
  githubHello: externalLink('digression', 'Hello World : premiers pas GitHub', 'https://docs.github.com/fr/get-started/start-your-journey/hello-world'),
  aboutGit: externalLink('digression', 'À propos de Git (GitHub Docs)', 'https://docs.github.com/fr/get-started/using-git/about-git'),
  githubAccount: externalLink('digression', 'Créer un compte GitHub', 'https://docs.github.com/fr/get-started/start-your-journey/creating-an-account-on-github'),
  githubSensitive: externalLink('digression', 'Retirer des données sensibles d’un repo', 'https://docs.github.com/fr/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository'),
  vercelDocs: externalLink('digression', 'Documentation Vercel', 'https://vercel.com/docs'),
  vercelStart: externalLink('digression', 'Débuter avec Vercel', 'https://vercel.com/docs/getting-started-with-vercel'),
  vercelDeployments: externalLink('digression', 'Les déploiements sur Vercel', 'https://vercel.com/docs/deployments'),
  vercelEnv: externalLink('digression', 'Variables d’environnement sur Vercel', 'https://vercel.com/docs/environment-variables'),
};

export const D_DECKS = [
  {
    brickId: 'd1', family: 'd', order: 14, title: 'Lexique dev', slides: [
      slide({
        id: 'd1-journey', role: 'opening',
        claim: 'Tous les termes du dev racontent une seule histoire : le voyage du code.',
        support: 'Écrire, sauvegarder, mettre en ligne, protéger : quatre étapes de votre machine jusqu’aux utilisateurs.',
        visual: { key: 'mcp-connection-map', data: {
          interaction: 'Suivre le voyage du code.',
          nodes: [
            { name: 'Écrire', sends: 'IDE et terminal' },
            { name: 'Sauvegarder', sends: 'Repo, Git et GitHub' },
            { name: 'Mettre en ligne', sends: 'Serveur, déploiement, Vercel' },
            { name: 'Protéger', sends: 'Clé API et variable d’environnement' },
          ],
          returnPath: ['Sauvegarder : brique D2', 'Mettre en ligne : brique D3', 'Protéger : brique D4'],
        } },
        links: [wikiLink('d1', 'concept-durable', 'Le voyage du code')],
        speaker: { durationMinutes: 2, notes: 'Annoncer le contrat : dix minutes de vocabulaire pour ne plus jamais être perdu ensuite. Relier chaque étape à un élément visible du poste de travail.', transition: 'Chaque terme mérite une image : allons la chercher sur le poste de travail.' },
        accessibleDescription: 'Quatre nœuds enchaînent écrire, sauvegarder, mettre en ligne et protéger, avec les termes associés à chaque étape et le plan des briques suivantes.',
      }),
      slide({
        id: 'd1-workspace', role: 'demonstration',
        claim: 'Le tour du poste de travail donne une image à chaque terme.',
        support: 'L’IDE est la fenêtre entière, le terminal le panneau du bas, le repo l’arborescence à gauche.',
        visual: { key: 'workspace-triptych', data: {
          interaction: 'Mettre en évidence chaque zone.',
          sharedContext: 'Un seul projet, trois vues',
          panes: [
            { name: 'IDE', role: 'La fenêtre entière : l’atelier où l’on écrit et organise le code' },
            { name: 'Terminal', role: 'Le panneau du bas : parler à l’ordinateur en lignes de commande' },
            { name: 'Repo', role: 'L’arborescence à gauche : le dossier du projet et son historique' },
          ],
          destination: 'Le même repo s’ouvre ensuite sur github.com, puis une app déployée sur une vraie URL',
        } },
        links: [wikiLink('d1', 'pratique-avec-claude', 'Tour du poste de travail')],
        speaker: { durationMinutes: 2, notes: 'Tout pointer à l’écran : VS Code ouvert, puis le même repo sur github.com et une app déployée. Préciser que Claude Code vit dans le terminal mais s’utilise aussi depuis l’application Claude.', transition: 'Deux de ces termes se ressemblent trop pour rester côte à côte sans vérification.' },
        accessibleDescription: 'Trois panneaux montrent l’explorateur, l’éditeur et le terminal du même projet, avec le rôle de chaque zone à l’écran.',
      }),
      slide({
        id: 'd1-reflex', role: 'explanation',
        claim: 'Le lexique ne se mémorise pas : il se demande.',
        support: 'Quand un terme bloque, une analogie demandée à Claude vaut mieux qu’une définition apprise.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Assembler la demande d’analogie.',
          objective: 'Comprendre un terme qui bloque, par exemple « repo »',
          context: 'Je n’ai jamais codé',
          constraints: ['Une analogie tirée de la cuisine', 'Aucun jargon'],
          form: 'Une explication en quelques phrases',
          preview: ['Le terme reçoit une image concrète', 'La définition se reformule ensuite avec vos mots'],
        } },
        links: [wikiLink('d1', 'pratique-avec-claude', 'Le réflexe analogie')],
        speaker: { durationMinutes: 1, notes: 'Montrer le prompt « Explique-moi ce qu’est un repo comme si je n’avais jamais codé, avec une analogie tirée de la cuisine ». Si un terme absent surgit (SDK, framework), répondre en une phrase et renvoyer à ce réflexe.', transition: 'À vous de fabriquer vos propres définitions.' },
        accessibleDescription: 'Quatre blocs assemblent une demande d’analogie : objectif, contexte, contraintes et forme attendue, avec l’aperçu du résultat.',
      }),
    ],
  },
  {
    brickId: 'd2', family: 'd', order: 15, title: 'GitHub et versionnement', slides: [
      slide({
        id: 'd2-fear', role: 'opening',
        claim: 'Un commit est un point de sauvegarde de jeu vidéo.',
        support: 'Le versionnement répond à la peur universelle : « et si je casse tout ? ».',
        visual: { key: 'context-comparison', data: {
          interaction: 'Basculer entre les deux situations.',
          sharedPrompt: 'Et si je casse tout ?',
          contexts: [
            { audience: 'Sans point de sauvegarde', constraints: 'Tout casser signifie tout recommencer', vocabulary: 'peur, prudence excessive, projet figé' },
            { audience: 'Avec points de sauvegarde', constraints: 'Recharger la dernière version qui marchait', vocabulary: 'commit, checkpoint, confiance' },
          ],
          observation: 'Le même incident, deux issues opposées',
        } },
        links: [wikiLink('d2', 'concept-durable', 'Le point de sauvegarde'), links.aboutGit],
        speaker: { durationMinutes: 2, notes: 'Partir de la peur de casser, pas de l’outil. Analogie de secours : l’historique des versions de Google Docs.', transition: 'Trois mots suffisent pour faire vivre ces sauvegardes.' },
        accessibleDescription: 'Deux panneaux comparent un projet sans sauvegarde et un projet à checkpoints face au même incident.',
      }),
      slide({
        id: 'd2-demo', role: 'demonstration',
        claim: 'Casser puis ressusciter : le filet de sécurité est réel.',
        support: 'La casse n’était pas sauvegardée : revenir en arrière jette les modifications en cours.',
        visual: { key: 'ipmtr-loop', data: {
          interaction: 'Rejouer la démonstration.',
          steps: [
            { letter: 'S', name: 'Sauvegarder', evidence: 'Un commit au message clair' },
            { letter: 'C', name: 'Casser', evidence: 'Un morceau d’interface supprimé volontairement' },
            { letter: 'O', name: 'Observer', evidence: 'Le dégât est réel, rien n’est sauvegardé' },
            { letter: 'R', name: 'Revenir', evidence: '« Reviens à la dernière version qui marchait »' },
            { letter: 'V', name: 'Vérifier', evidence: 'Le projet ressuscite tel qu’au dernier commit' },
          ],
          loopBack: 'Une casse déjà sauvegardée s’annule aussi : il suffit de dire à Claude quelle sauvegarde annuler.',
        } },
        links: [wikiLink('d2', 'pratique-avec-claude', 'Casse et résurrection')],
        speaker: { durationMinutes: 4, notes: 'C’est le moment fort de la brique : répéter la démonstration avant la séance, un échec ici ruine le message de confiance. Tout se demande en français dans Claude Code.', transition: 'Laisser faire ne veut pas dire laisser passer n’importe quoi.' },
        accessibleDescription: 'Une boucle en cinq étapes va de la sauvegarde à la casse volontaire, puis au retour arrière et à la résurrection vérifiée du projet.',
      }),
      slide({
        id: 'd2-verify', role: 'explanation',
        claim: 'Faire confiance, oui ; à l’aveugle, non.',
        support: 'Ce qui part sur GitHub reste dans l’historique, y compris une erreur ou une clé.',
        visual: { key: 'verification-audit', data: {
          interaction: 'Dérouler le réflexe avant push.',
          steps: [
            { name: 'Demander le résumé', action: '« Résume ce que tu t’apprêtes à envoyer en ligne. »' },
            { name: 'Lire', action: 'Comprendre chaque changement listé, sans survoler.' },
            { name: 'Décider', action: 'Valider le push, ou refuser et corriger d’abord.' },
          ],
          output: 'L’historique GitHub garde tout : une clé qui fuit se révoque, elle ne s’efface pas (D4 y revient).',
        } },
        links: [wikiLink('d2', 'concept-durable', 'Le réflexe de vérification')],
        speaker: { durationMinutes: 2, notes: 'Certains agents committent d’office : rappeler qu’on peut exiger une validation avant chaque commit.', transition: 'À vous : sauvegarder, casser, revenir.' },
        accessibleDescription: 'Trois étapes déroulent le réflexe avant push : demander un résumé, le lire, puis décider, avec le rappel que l’historique garde tout.',
      }),
    ],
  },
  {
    brickId: 'd2-bis', family: 'd', order: 16, title: 'Setup GitHub et Vercel', slides: [
      slide({
        id: 'd2bis-ritual', role: 'opening',
        claim: 'Faire naître un projet suit un rituel en quatre temps, chacun avec son propriétaire.',
        support: 'Identité et autorisation vous appartiennent ; la création se délègue ; la preuve vous revient.',
        visual: { key: 'setup-diagnostic', data: {
          interaction: 'Parcourir les quatre temps.',
          layers: [
            { name: 'Identité (vous)', check: 'Comptes GitHub et Vercel créés par vous', fallback: 'Aucun mot de passe ne transite par l’IA' },
            { name: 'Autorisation (vous, guidé)', check: 'La machine est reliée au compte GitHub', fallback: 'C’est vous qui cliquez sur « Autoriser »' },
            { name: 'Création (l’IA)', check: 'Projet créé, versionné et envoyé en ligne', fallback: 'La plomberie se délègue en langage naturel' },
            { name: 'Preuve visible (vous)', check: 'Le repo s’affiche sur github.com', fallback: 'Pas de preuve à l’écran, pas d’étape suivante' },
          ],
        } },
        links: [wikiLink('d2-bis', 'concept-durable', 'Le rituel en quatre temps')],
        speaker: { durationMinutes: 3, notes: 'Marteler le message : l’IA fait la plomberie, vous gardez les clés. Faire créer les comptes dès le début de séance, la vérification d’email tourne pendant ce temps.', transition: 'Avant de créer quoi que ce soit, un état des lieux.' },
        accessibleDescription: 'Quatre couches détaillent identité, autorisation, création et preuve, avec l’observation attendue et la règle de chaque temps.',
      }),
      slide({
        id: 'd2bis-birth', role: 'demonstration',
        claim: 'Le prompt rituel fait naître le projet : créé, versionné, en ligne.',
        support: 'À conserver précieusement : il resservira à chaque nouveau projet.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Relire le prompt rituel bloc par bloc.',
          objective: 'Créer un projet vide nommé mon-assistant dans le dossier atelier-ia',
          context: 'Machine autorisée, compte GitHub prêt',
          constraints: [
            'Initialiser le versionnement',
            'Faire une première sauvegarde',
            'Créer le repo sur mon compte GitHub et tout envoyer en ligne',
          ],
          form: 'Chaque étape annoncée avant d’être faite, avec sa vérification',
          preview: ['Dossier du projet créé', 'Première sauvegarde faite', 'Repo créé sur votre compte', 'Tout est envoyé en ligne'],
        } },
        links: [wikiLink('d2-bis', 'pratique-avec-claude', 'Le prompt rituel')],
        speaker: { durationMinutes: 4, notes: 'Règle d’hygiène à répéter : un projet, un dossier, un repo. Travailler en binômes : un qui fait, un qui lit les étapes à voix haute.', transition: 'Reste à prouver que tout existe vraiment.' },
        accessibleDescription: 'Le prompt rituel est décomposé en objectif, contexte, contraintes et forme, avec l’aperçu des quatre résultats attendus.',
      }),
    ],
  },
  {
    brickId: 'd3', family: 'd', order: 17, title: 'Front-end et déploiement', slides: [
      slide({
        id: 'd3-public', role: 'opening',
        claim: 'Le déploiement fait passer le projet de « chez moi » à une adresse pour tout le monde.',
        support: 'Le front-end est ce que le visiteur voit ; localhost n’a qu’un seul visiteur : vous.',
        visual: { key: 'context-comparison', data: {
          interaction: 'Comparer les deux visibilités.',
          sharedPrompt: 'Le même projet, au même instant.',
          contexts: [
            { audience: 'Localhost', constraints: 'Tourne uniquement sur votre machine', vocabulary: 'ça marche chez moi, localhost:4321' },
            { audience: 'Déployé', constraints: 'Un serveur allumé en permanence le sert au monde', vocabulary: 'URL publique, Vercel, visiteurs' },
          ],
          observation: 'Même code, publics radicalement différents',
        } },
        links: [wikiLink('d3', 'concept-durable', 'Front-end, localhost et déploiement')],
        speaker: { durationMinutes: 2, notes: 'Montrer la même app sur localhost et sur son URL publique, côte à côte : la différence devient physique. Rappel express des termes posés en D1.', transition: 'La mise en ligne ne se refait pas à la main : une boucle s’en charge.' },
        accessibleDescription: 'Deux panneaux opposent le projet en localhost, visible de vous seul, et le projet déployé sur une URL publique ouverte à tous.',
      }),
      slide({
        id: 'd3-demo', role: 'demonstration',
        claim: 'Toute la boucle du déploiement continu, vécue en une minute.',
        support: 'Import du repo, Deploy, l’URL sur un téléphone, puis un changement qui arrive tout seul en ligne.',
        visual: { key: 'setup-diagnostic', data: {
          interaction: 'Dérouler la démonstration.',
          prompt: 'Change le titre de la page d’accueil, sauvegarde et envoie en ligne.',
          steps: [
            'Dans Vercel : Add New Project, choisir le repo, Deploy',
            'Ouvrir l’URL fournie sur le poste, puis sur un téléphone',
            'Demander le changement à Claude et le laisser pousser',
            'Recharger la page publique : le nouveau titre est là',
          ],
          expected: 'Le site en ligne se met à jour sans toucher à Vercel',
          evidence: 'Le déploiement se déclenche seul dans Vercel après le push',
          caution: 'Un build qui échoue se lit avec la salle, puis se donne à corriger à Claude : c’est le vrai flux de travail.',
        } },
        links: [wikiLink('d3', 'pratique-avec-claude', 'La boucle vécue en direct'), links.vercelStart],
        speaker: { durationMinutes: 4, notes: 'Ne pas dériver vers les noms de domaine, les DNS ou les offres payantes : hors périmètre.', transition: 'À vos téléphones.' },
        accessibleDescription: 'Un prompt et quatre étapes déroulent l’import dans Vercel, l’ouverture de l’URL sur téléphone et la mise à jour automatique du site.',
      }),
      slide({
        id: 'd3-checkpoint', role: 'checkpoint',
        claim: 'Ce qui est déployé est public, code compris.',
        support: 'Tout ce que contient le front-end est visible par n’importe qui.',
        visual: { key: 'checkpoint', data: {
          interaction: 'Valider les acquis D3.',
          checks: [
            'Le site est en ligne et l’URL a circulé',
            'Chaque push met le site à jour automatiquement',
            'Vous savez que tout le front-end est lisible par n’importe qui',
          ],
          warning: 'Une clé API n’a jamais sa place dans un front-end.',
          successCriterion: 'La boucle fonctionne et la conséquence « déployé = public » est comprise.',
        } },
        links: [wikiLink('d3', 'concept-durable', 'Déployé, donc public')],
        speaker: { durationMinutes: 2, notes: 'C’est le pont vers D4 : la visibilité obtenue appelle les réflexes de sécurité.', transition: 'Deux ressources, puis les règles qui évitent que cette visibilité se retourne contre vous.' },
        accessibleDescription: 'Trois cases valident la boucle en ligne, avec l’avertissement : jamais de clé API dans le front-end.',
      }),
    ],
  },
  {
    brickId: 'd4', family: 'd', order: 18, title: 'Sécurité et bonnes pratiques', slides: [
      slide({
        id: 'd4-exigence', role: 'opening',
        claim: 'L’IA écrit du code qui marche, pas forcément du code sûr.',
        support: 'Elle sécurise quand on le lui demande : votre travail est de poser l’exigence.',
        visual: { key: 'verification-audit', data: {
          interaction: 'Classer l’affirmation.',
          statement: 'Si le code marche, c’est qu’il est sûr.',
          buckets: ['Exacte', 'Simplifiée', 'Fausse'],
          answer: 'Fausse',
          reason: 'Un code peut fonctionner et exposer une clé, accepter n’importe quelle entrée ou servir des données sensibles.',
        } },
        links: [wikiLink('d4', 'concept-durable', 'Faire appliquer plutôt qu’appliquer')],
        speaker: { durationMinutes: 2, notes: 'Annoncer le contrat : rien à mémoriser, quatre règles et deux prompts, la page reste en ligne pour chaque nouveau projet.', transition: 'Quatre règles couvrent l’essentiel des dégâts évitables.' },
        accessibleDescription: 'Une affirmation sur le code qui marche doit être classée ; la correction sépare fonctionner et être sûr.',
      }),
      slide({
        id: 'd4-prompts', role: 'demonstration',
        claim: 'Deux prompts prêts à l’emploi : au démarrage, et avant chaque mise en ligne.',
        support: 'Copier, coller, lire le rapport : l’essentiel de la brique tient dans ces deux gestes.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Assembler l’exigence de sécurité.',
          objective: 'Faire appliquer les quatre règles par Claude sur tout le projet',
          context: 'Deux moments : au démarrage du projet, puis avant chaque mise en ligne',
          constraints: [
            'Prompt de démarrage : règles permanentes et signalement de tout écart',
            'Prompt d’audit : « comme si tu étais un attaquant », résultats classés par gravité',
          ],
          form: 'Un rapport lisible, avec la correction la plus simple pour chaque point',
          preview: [
            'Secrets dans le code ou dans l’historique',
            'Entrées utilisateur non validées',
            'Données sensibles exposées côté front',
            'Routes sans limite de requêtes',
          ],
        } },
        links: [wikiLink('d4', 'pratique-avec-claude', 'Les deux prompts complets')],
        speaker: { durationMinutes: 4, notes: 'Montrer les deux prompts en entier depuis le wiki et faire copier immédiatement : le réflexe compte plus que la théorie.', transition: 'La preuve par la démonstration : un audit qui trouve.' },
        accessibleDescription: 'L’exigence de sécurité est décomposée en objectif, moments d’usage, contraintes et forme, avec les quatre cibles de l’audit en aperçu.',
      }),
      slide({
        id: 'd4-audit', role: 'demonstration',
        claim: 'Le rapport qui trouve la clé fait plus d’effet que dix slides.',
        support: 'L’audit classe ce qu’il trouve par gravité et propose la correction la plus simple.',
        visual: { key: 'verification-audit', data: {
          interaction: 'Parcourir les niveaux de gravité.',
          question: 'Que trouve l’audit sur un projet préparé ?',
          scale: [
            { risk: 'Grave', example: 'Une clé API dans le code', verification: 'Révoquer la clé chez le fournisseur, la remplacer, mettre le .env en place' },
            { risk: 'Moyen', example: 'Un formulaire sans validation', verification: 'Valider type, taille et contenu côté serveur' },
            { risk: 'À surveiller', example: 'Une route qui appelle un service payant sans limite', verification: 'Poser une limite de requêtes par utilisateur et par période' },
          ],
        } },
        links: [wikiLink('d4', 'pratique-avec-claude', 'La démonstration d’audit'), links.githubSensitive],
        speaker: { durationMinutes: 3, notes: 'Préparer le projet troué à l’avance et répéter la démonstration. Retirer la clé du code ne suffit pas : l’historique la garde, révoquer puis remplacer.', transition: 'À vos audits.' },
        accessibleDescription: 'Trois niveaux de gravité associent une trouvaille d’audit à sa correction, de la clé exposée à la route sans limite.',
      }),
    ],
  },
] satisfies PresentationDeck[];
