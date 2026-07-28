import type { Guide } from '../parcours-model';

export const NAISSANCE_PROJET: Guide = {
  id: 'naissance-projet',
  titre: 'Créer un projet et le mettre sur GitHub',
  promesse: 'De rien du tout à un projet sauvegardé en ligne, sans rien taper.',
  prerequis: ['VS Code installé', 'Claude Code installé'],
  etapes: [
    {
      id: 'creer-le-dossier',
      titre: 'Créer le dossier',
      lieu: 'machine',
      gestes: [{ action: 'Créez un dossier sur votre ordinateur, où vous voulez et sous le nom que vous voulez.' }],
      preuve: {
        visible: 'Le dossier est là, vide.',
        sinon: 'Recommencez : un simple dossier vide suffit.',
      },
      visuel: { key: 'arborescence', avant: [], apres: ['mon-projet/'] },
      pannes: [],
    },
    {
      id: 'ouvrir-dans-vscode',
      titre: 'Ouvrir le dossier dans VS Code',
      lieu: 'vscode',
      gestes: [
        { action: 'Cliquez sur l’explorateur, en haut de la barre de gauche.' },
        { action: 'Cliquez sur Open Folder.' },
        { action: 'Choisissez le dossier que vous venez de créer.' },
      ],
      preuve: {
        visible: 'Le nom de votre dossier s’affiche en haut à gauche.',
        sinon: 'Vous avez ouvert un fichier. Recommencez avec Open Folder.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/naissance-projet/open-folder-in-vscode.png',
        alt: 'VS Code sans dossier ouvert, avec l’explorateur et le bouton Open Folder.',
        service: 'VS Code',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'L’explorateur, en haut de la barre de gauche', position: 'gauche' },
          { label: 'Le bouton Open Folder', position: 'centre' },
        ],
      },
      pannes: [
        {
          id: 'fichier-au-lieu-du-dossier',
          frequente: true,
          symptome: 'Je vois un seul fichier, pas mon dossier',
          cause: 'VS Code a ouvert un fichier isolé.',
          reparation: [{ action: 'Refermez, puis reprenez avec Open Folder.' }],
          preuve: 'Le nom du dossier apparaît en haut à gauche.',
        },
      ],
    },
    {
      id: 'activer-claude',
      titre: 'Activer Claude dans le dossier',
      lieu: 'vscode',
      gestes: [
        { action: 'Ouvrez les extensions, dans la barre de gauche.' },
        { action: 'Cherchez Claude Code.' },
        { action: 'Cliquez sur Enable (Workspace).' },
      ],
      preuve: {
        visible: 'Le bouton affiche maintenant Disable.',
        sinon: 'Fermez VS Code, rouvrez votre dossier, recommencez.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/naissance-projet/enable-claude-in-workspace.png',
        alt: 'Le panneau des extensions de VS Code, Claude Code sélectionné, bouton Enable (Workspace).',
        service: 'VS Code',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'Les extensions, dans la barre de gauche', position: 'gauche' },
          { label: 'Enable (Workspace)', position: 'centre' },
        ],
      },
      pannes: [
        {
          id: 'extension-introuvable',
          frequente: true,
          symptome: 'Je ne trouve pas Claude Code',
          cause: 'L’extension n’est pas installée sur cette machine.',
          reparation: [
            { action: 'Tapez Claude Code dans la recherche des extensions.' },
            { action: 'Cliquez sur Install, puis sur Enable (Workspace).' },
          ],
          preuve: 'Claude Code apparaît avec un bouton Disable.',
        },
      ],
    },
    {
      id: 'ouvrir-claude',
      titre: 'Ouvrir Claude',
      lieu: 'vscode',
      gestes: [{ action: 'Cliquez sur l’icône de Claude, en haut à droite.' }],
      preuve: {
        visible: 'Le panneau de Claude s’ouvre sur la droite.',
        sinon: 'Vous ne voyez pas l’icône : reprenez l’étape précédente.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/naissance-projet/open-claude-extension.png',
        alt: 'VS Code avec un dossier ouvert, et l’icône de Claude en haut à droite.',
        service: 'VS Code',
        verifieLe: '2026-07-28',
        reperes: [{ label: 'L’icône de Claude, en haut à droite', position: 'droite' }],
      },
      pannes: [],
    },
    {
      id: 'nouveau-depot',
      titre: 'Créer un nouveau dépôt',
      lieu: 'navigateur',
      service: 'GitHub',
      gestes: [
        { action: 'Ouvrez github.com.' },
        { action: 'Cliquez sur New, en haut à gauche.' },
      ],
      preuve: {
        visible: 'Le formulaire Create a new repository s’ouvre.',
        sinon: 'Allez directement sur github.com/new.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/naissance-projet/new-repo-button.png',
        alt: 'Le tableau de bord GitHub, avec le bouton New au-dessus de la liste des dépôts.',
        service: 'GitHub',
        verifieLe: '2026-07-28',
        reperes: [{ label: 'Le bouton New', position: 'gauche' }],
      },
      pannes: [],
    },
    {
      id: 'creer-depot-vide',
      titre: 'Créer le dépôt vide',
      lieu: 'navigateur',
      service: 'GitHub',
      danger: 'Ne cochez rien. Un dépôt vide vous donne les instructions toutes prêtes ; un dépôt prérempli ne vous donne rien.',
      gestes: [
        { action: 'Donnez-lui le même nom que votre dossier.' },
        { action: 'Laissez Add README sur Off, No .gitignore et No license.' },
        { action: 'Cliquez sur Create repository.' },
      ],
      preuve: {
        visible: 'Une page de dépôt sans aucun fichier.',
        sinon: 'Vous voyez un README : supprimez le dépôt et recommencez sans rien cocher.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/naissance-projet/create-new-repo.png',
        alt: 'Le formulaire de création GitHub, sans README, sans .gitignore, sans licence.',
        service: 'GitHub',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'Le nom, identique à votre dossier', position: 'haut' },
          { label: 'Les trois réglages à ne pas toucher', position: 'bas' },
        ],
      },
      pannes: [
        {
          id: 'nom-depot-deja-pris',
          frequente: false,
          symptome: 'GitHub dit que ce nom existe déjà',
          cause: 'Vous avez déjà un dépôt de ce nom.',
          reparation: [{ action: 'Ajoutez un mot au nom, puis validez.' }],
          preuve: 'La page du dépôt s’affiche.',
        },
        {
          id: 'depot-cree-avec-readme',
          frequente: true,
          symptome: 'GitHub ne m’affiche aucun bloc d’instructions',
          cause: 'Le dépôt a été créé avec un README.',
          reparation: [
            { action: 'Ouvrez Settings et supprimez le dépôt.' },
            { action: 'Recréez-le sans rien cocher.' },
          ],
          preuve: 'La page du dépôt vide affiche les blocs d’instructions.',
        },
      ],
    },
    {
      id: 'copier-le-bloc',
      titre: 'Copier le bloc GitHub',
      lieu: 'navigateur',
      service: 'GitHub',
      gestes: [
        { action: 'Repérez le bloc create a new repository on the command line.' },
        { action: 'Cliquez sur l’icône de copie, à droite.' },
      ],
      preuve: {
        visible: 'L’icône confirme que c’est copié.',
        sinon: 'Sélectionnez les lignes à la souris et copiez-les.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/naissance-projet/github-commands-init-repo.png',
        alt: 'La page d’un dépôt GitHub vide, avec le bloc create a new repository on the command line encadré.',
        service: 'GitHub',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'Le bloc create a new repository on the command line', position: 'centre' },
          { label: 'L’icône de copie', position: 'droite' },
        ],
      },
      pannes: [],
    },
    {
      id: 'coller-a-claude',
      titre: 'Coller le bloc à Claude',
      lieu: 'vscode',
      gestes: [
        { action: 'Retournez dans Claude.' },
        { action: 'Écrivez l’encadré plus haut, puis collez le bloc copié juste en dessous.' },
        { action: 'Envoyez, et acceptez s’il demande la permission.' },
      ],
      aClaude: 'Voici les instructions que GitHub me donne pour relier ce projet. Exécute-les, puis dis-moi quand c’est en ligne.',
      preuve: {
        visible: 'Claude annonce que c’est envoyé.',
        sinon: 'Il signale une erreur : copiez sa réponse entière et redemandez-lui de corriger.',
      },
      visuel: {
        key: 'claude',
        reponse: ['J’ai relié votre dossier au dépôt.', 'Tout est envoyé.', 'Rafraîchissez la page GitHub.'],
      },
      pannes: [
        {
          id: 'claude-demande-autorisation',
          frequente: false,
          symptome: 'Claude demande la permission avant d’agir',
          cause: 'C’est normal, il demande votre accord.',
          reparation: [{ action: 'Lisez ce qu’il propose, puis acceptez.' }],
          preuve: 'Claude poursuit et annonce que c’est envoyé.',
        },
      ],
    },
    {
      id: 'verifier-sur-github',
      titre: 'Vérifier sur GitHub',
      lieu: 'navigateur',
      service: 'GitHub',
      gestes: [
        { action: 'Revenez sur la page de votre dépôt.' },
        { action: 'Rafraîchissez.' },
      ],
      preuve: {
        visible: 'Vos fichiers sont là.',
        sinon: 'La page reste vide : demandez à Claude pourquoi rien n’est arrivé.',
      },
      visuel: { key: 'trois-lieux', accent: 'projet' },
      pannes: [
        {
          id: 'page-github-vide',
          frequente: true,
          symptome: 'Ma page GitHub reste vide',
          cause: 'L’envoi n’est pas allé au bout.',
          reparation: [
            { action: 'Retournez dans Claude.' },
            { action: 'Écrivez : vérifie que tout est bien envoyé sur GitHub, et corrige si besoin.' },
          ],
          preuve: 'Vos fichiers apparaissent après rafraîchissement.',
        },
      ],
    },
  ],
};
