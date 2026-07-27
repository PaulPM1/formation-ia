import type { Guide } from '../parcours-model';

export const NAISSANCE_PROJET: Guide = {
  id: 'naissance-projet',
  titre: 'Créer un projet et le mettre sur GitHub',
  promesse: 'De rien du tout à un projet sauvegardé en ligne, sans rien taper.',
  prerequis: ['VS Code installé', 'Claude Code installé'],
  etapes: [
    {
      id: 'creer-le-dossier',
      titre: 'Créer un dossier pour votre projet',
      lieu: 'machine',
      pourquoi: 'Un projet vit dans un dossier. Un projet, un dossier : la règle qui vous évitera des heures de confusion.',
      gestes: [
        { action: 'Créez un dossier dans votre dossier personnel, pas sur le Bureau.', ancre: 'Documents' },
        { action: 'Nommez-le en minuscules avec des tirets, sans espace ni accent.' },
      ],
      preuve: {
        visible: 'Le dossier apparaît, il est vide, et vous savez le retrouver.',
        sinon: 'Recommencez depuis votre dossier personnel : un dossier créé ailleurs se retrouve mal.',
      },
      visuel: { key: 'arborescence', avant: ['Documents/'], apres: ['Documents/', '  mon-projet/'] },
      pannes: [],
    },
    {
      id: 'ouvrir-dans-vscode',
      titre: 'Ouvrir ce dossier dans VS Code',
      lieu: 'vscode',
      pourquoi: 'Claude ne voit que le dossier ouvert. Ouvrir un fichier seul ne suffit pas : il faut ouvrir le dossier entier.',
      gestes: [
        { action: 'Dans VS Code, choisissez Ouvrir le dossier.', ancre: 'Fichier' },
        { action: 'Sélectionnez le dossier que vous venez de créer, puis validez.' },
      ],
      preuve: {
        visible: 'Le nom de votre dossier s’affiche en haut de la barre latérale de gauche.',
        sinon: 'Vous avez sans doute ouvert un fichier. Refermez tout et recommencez avec Ouvrir le dossier.',
      },
      visuel: { key: 'arborescence', avant: [], apres: ['mon-projet/'] },
      pannes: [
        {
          id: 'fichier-au-lieu-du-dossier',
          frequente: true,
          symptome: 'Je vois un seul fichier, pas le nom de mon dossier',
          cause: 'VS Code a ouvert un fichier isolé au lieu du dossier qui le contient.',
          reparation: [
            { action: 'Refermez la fenêtre.' },
            { action: 'Reprenez avec Ouvrir le dossier, jamais Ouvrir le fichier.', ancre: 'Fichier' },
          ],
          preuve: 'Le nom du dossier apparaît en haut de la barre latérale.',
        },
      ],
    },
    {
      id: 'activer-extension-claude',
      titre: 'Autoriser Claude dans ce dossier',
      lieu: 'vscode',
      pourquoi: 'VS Code désactive les extensions dans un dossier qu’il ne connaît pas encore. Sans cette autorisation, rien ne marchera.',
      gestes: [
        { action: 'Ouvrez le panneau des extensions dans la barre de gauche.', ancre: 'Extensions' },
        { action: 'Cherchez Claude Code.' },
        { action: 'Cliquez sur Enable in this workspace, ou Activer dans cet espace de travail.' },
      ],
      preuve: {
        visible: 'Le bouton affiche maintenant Disable, ou Désactiver : l’extension est donc active.',
        sinon: 'Fermez complètement VS Code, rouvrez votre dossier, et recommencez.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/naissance-projet/extension-claude.png',
        alt: 'Le panneau des extensions de VS Code, avec Claude Code sélectionné et le bouton d’activation.',
        service: 'VS Code',
        verifieLe: '2026-01-01',
        reperes: [
          { label: 'Le panneau des extensions, dans la barre de gauche', position: 'gauche' },
          { label: 'Le bouton d’activation pour cet espace de travail', position: 'centre' },
        ],
      },
      pannes: [
        {
          id: 'extension-introuvable',
          frequente: true,
          symptome: 'Je ne trouve pas Claude Code dans la liste',
          cause: 'L’extension n’est pas installée sur cette machine, seulement cherchée.',
          reparation: [
            { action: 'Tapez Claude Code dans la barre de recherche des extensions.' },
            { action: 'Cliquez sur Install, puis sur Enable in this workspace.' },
          ],
          preuve: 'Claude Code apparaît dans vos extensions installées avec un bouton Disable.',
        },
      ],
    },
    {
      id: 'lancer-claude',
      titre: 'Lancer Claude et vérifier qu’il voit votre dossier',
      lieu: 'vscode',
      pourquoi: 'Une minute de vérification ici évite une heure de confusion plus tard : Claude travaille parfois dans un autre dossier.',
      gestes: [
        { action: 'Ouvrez Claude dans VS Code.' },
        { action: 'Copiez le message ci-dessous et envoyez-le.' },
      ],
      aClaude: 'Dans quel dossier es-tu en train de travailler ? Donne-moi son nom et liste ce qu’il contient.',
      preuve: {
        visible: 'Claude cite le nom de votre dossier, et dit qu’il est vide.',
        sinon: 'Claude nomme un autre dossier : refermez tout et rouvrez le bon dossier avant de continuer.',
      },
      visuel: {
        key: 'claude',
        reponse: [
          'Je travaille dans mon-projet.',
          'Le dossier est vide pour le moment.',
        ],
      },
      pannes: [
        {
          id: 'claude-voit-autre-dossier',
          frequente: true,
          symptome: 'Claude parle d’un dossier que je ne reconnais pas',
          cause: 'Claude est resté attaché au projet précédemment ouvert.',
          reparation: [
            { action: 'Refermez la fenêtre de VS Code.' },
            { action: 'Rouvrez votre dossier avec Ouvrir le dossier, puis relancez Claude.', ancre: 'Fichier' },
          ],
          preuve: 'Claude cite le nom de votre dossier.',
        },
      ],
    },
    {
      id: 'creer-depot-vide',
      titre: 'Créer un dépôt entièrement vide sur GitHub',
      lieu: 'navigateur',
      service: 'GitHub',
      danger: 'Ne cochez aucune case d’initialisation. Un dépôt vide vous donne les instructions toutes prêtes ; un dépôt prérempli ne vous donne rien et bloque la suite.',
      pourquoi: 'GitHub affiche des instructions prêtes à l’emploi uniquement quand le dépôt est vide. C’est cette matière que vous copierez.',
      gestes: [
        { action: 'Sur github.com, créez un nouveau dépôt.', ancre: 'New repository' },
        { action: 'Donnez-lui le même nom que votre dossier.' },
        { action: 'Laissez les trois cases d’initialisation décochées : pas de README, pas de fichier d’exclusions, pas de licence.' },
        { action: 'Validez la création.', ancre: 'Create repository' },
      ],
      preuve: {
        visible: 'Une page de dépôt sans aucun fichier, avec plusieurs blocs d’instructions.',
        sinon: 'Vous voyez un fichier README : supprimez ce dépôt et recréez-le sans cocher aucune case.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/naissance-projet/depot-vide.png',
        alt: 'Le formulaire de création GitHub, les trois cases d’initialisation laissées décochées.',
        service: 'GitHub',
        verifieLe: '2026-01-01',
        reperes: [
          { label: 'Le champ du nom, identique au nom de votre dossier', position: 'haut' },
          { label: 'Les trois cases à laisser décochées', position: 'bas' },
        ],
      },
      pannes: [
        {
          id: 'nom-depot-deja-pris',
          frequente: false,
          symptome: 'GitHub dit que ce nom existe déjà',
          cause: 'Vous avez déjà un dépôt portant ce nom.',
          reparation: [{ action: 'Ajoutez un mot au nom, par exemple mon-projet-2, et validez.' }],
          preuve: 'La page du nouveau dépôt s’affiche.',
        },
        {
          id: 'depot-cree-avec-readme',
          frequente: true,
          symptome: 'GitHub ne m’affiche aucun bloc d’instructions',
          cause: 'Le dépôt a été créé avec un README, donc GitHub le considère comme déjà rempli.',
          reparation: [
            { action: 'Ouvrez les réglages du dépôt et supprimez-le.', ancre: 'Settings' },
            { action: 'Recréez-le sans cocher aucune case.' },
          ],
          preuve: 'La page du dépôt vide affiche les blocs d’instructions.',
        },
      ],
    },
    {
      id: 'copier-le-bloc',
      titre: 'Copier les instructions que GitHub vous donne',
      lieu: 'navigateur',
      service: 'GitHub',
      pourquoi: 'Ces lignes relient votre dossier à votre dépôt. Vous n’avez pas à les comprendre : vous allez les confier à Claude.',
      gestes: [
        { action: 'Repérez le bloc intitulé push an existing repository.' },
        { action: 'Cliquez sur l’icône de copie à droite de ce bloc.' },
      ],
      preuve: {
        visible: 'L’icône de copie confirme que le bloc est copié.',
        sinon: 'Sélectionnez les lignes à la souris et copiez-les avec le raccourci habituel.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/naissance-projet/bloc-commandes.png',
        alt: 'La page d’un dépôt GitHub vide, avec le bloc d’instructions et son bouton de copie.',
        service: 'GitHub',
        verifieLe: '2026-01-01',
        reperes: [
          { label: 'Le bloc push an existing repository', position: 'centre' },
          { label: 'Le bouton de copie, à droite du bloc', position: 'droite' },
        ],
      },
      pannes: [],
    },
    {
      id: 'coller-a-claude',
      titre: 'Coller le tout à Claude et le laisser faire',
      lieu: 'vscode',
      pourquoi: 'C’est le cœur de la méthode : GitHub écrit les instructions, Claude les exécute, vous vérifiez le résultat.',
      gestes: [
        { action: 'Revenez dans Claude, dans VS Code.' },
        { action: 'Écrivez la phrase ci-dessous, puis collez le bloc copié juste en dessous.' },
        { action: 'Envoyez, et autorisez Claude s’il vous demande la permission d’agir.' },
      ],
      aClaude: 'Voici les instructions que GitHub vient de me donner pour relier ce projet. Exécute-les dans ce dossier, puis dis-moi quand c’est en ligne.',
      preuve: {
        visible: 'Claude annonce que le projet est envoyé sur GitHub.',
        sinon: 'Claude signale une erreur : copiez sa réponse entière et redemandez-lui de la corriger.',
      },
      visuel: {
        key: 'claude',
        reponse: [
          'J’ai relié votre dossier au dépôt.',
          'La première sauvegarde est envoyée.',
          'Rafraîchissez la page GitHub pour la voir.',
        ],
      },
      pannes: [
        {
          id: 'claude-demande-autorisation',
          frequente: false,
          symptome: 'Claude demande la permission avant d’agir',
          cause: 'C’est normal : Claude demande votre accord avant de modifier quoi que ce soit.',
          reparation: [{ action: 'Lisez ce qu’il propose, puis acceptez.' }],
          preuve: 'Claude poursuit et annonce que c’est envoyé.',
        },
      ],
    },
    {
      id: 'verifier-sur-github',
      titre: 'Rafraîchir GitHub et voir votre projet',
      lieu: 'navigateur',
      service: 'GitHub',
      pourquoi: 'On n’avance jamais sur la parole de l’IA : on regarde. C’est le réflexe qui vous servira toute votre vie.',
      gestes: [
        { action: 'Revenez sur la page de votre dépôt.' },
        { action: 'Rafraîchissez la page.' },
      ],
      preuve: {
        visible: 'Vos fichiers apparaissent dans la liste, avec la date du jour.',
        sinon: 'La page reste vide : retournez voir Claude et demandez-lui pourquoi rien n’est arrivé.',
      },
      visuel: { key: 'trois-lieux', accent: 'projet' },
      pannes: [
        {
          id: 'page-github-vide',
          frequente: true,
          symptome: 'Ma page GitHub reste vide après rafraîchissement',
          cause: 'L’envoi n’est pas allé au bout, souvent parce qu’une autorisation manquait.',
          reparation: [
            { action: 'Retournez dans Claude.' },
            { action: 'Écrivez : vérifie que tout est bien envoyé sur GitHub, et corrige si ce n’est pas le cas.' },
          ],
          preuve: 'Vos fichiers apparaissent après un nouveau rafraîchissement.',
        },
      ],
    },
  ],
};
