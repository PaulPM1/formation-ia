import type { Guide } from '../parcours-model';

export const CLE_API: Guide = {
  id: 'cle-api',
  titre: 'Donner une clé à votre projet',
  promesse: 'Pour que votre site puisse poser des questions à Claude, sans jamais laisser fuiter votre clé.',
  pourQui:
    'Ce guide est pour vous si votre site doit poser des questions à Claude, par exemple quand un visiteur écrit quelque chose et attend une réponse. Si votre site se contente d’afficher des pages, vous n’avez besoin de rien de tout ça.',
  prerequis: ['Votre site est en ligne sur Vercel'],
  etapes: [
    {
      id: 'creer-la-cle',
      titre: 'Créer votre clé chez Anthropic',
      lieu: 'navigateur',
      service: 'console Anthropic',
      danger: 'Cette clé donne accès à un service payant. Elle ne s’affiche qu’une seule fois : copiez-la immédiatement. Si vous la perdez, vous en créerez une autre, ce n’est pas grave.',
      pourquoi: 'Une clé, c’est un mot de passe. Celui qui l’a peut dépenser votre argent, d’où toutes les précautions qui suivent.',
      gestes: [
        { action: 'Connectez-vous sur la console Anthropic.' },
        { action: 'Créez une nouvelle clé et donnez-lui le nom de votre projet.' },
        { action: 'Copiez-la tout de suite et gardez l’onglet ouvert.' },
      ],
      preuve: {
        visible: 'Une longue suite de caractères s’affiche, et elle commence par sk-ant.',
        sinon: 'Vous avez fermé la fenêtre trop tôt : créez simplement une nouvelle clé.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/create-key-claude-console.png',
        alt: 'L’écran de création d’une clé dans la console Anthropic, la valeur étant masquée.',
        service: 'console Anthropic',
        verifieLe: '2026-01-01',
        reperes: [
          { label: 'Le bouton de création d’une clé', position: 'haut' },
          { label: 'La clé, affichée une seule fois', position: 'centre' },
        ],
      },
      pannes: [
        {
          id: 'cle-perdue',
          frequente: true,
          symptome: 'J’ai fermé la fenêtre sans copier ma clé',
          cause: 'Une clé ne s’affiche qu’une fois, par sécurité. Personne ne peut la retrouver, pas même Anthropic.',
          reparation: [
            { action: 'Supprimez la clé que vous ne pouvez plus lire.' },
            { action: 'Créez-en une nouvelle et copiez-la immédiatement.' },
          ],
          preuve: 'Une nouvelle clé est affichée et copiée.',
        },
      ],
    },
    {
      id: 'preparer-le-coffre',
      titre: 'Demander à Claude de préparer le coffre',
      lieu: 'vscode',
      pourquoi: 'Le coffre se prépare avant d’y mettre la clé. Dans l’autre ordre, la clé pourrait partir en ligne entre-temps.',
      gestes: [
        { action: 'Ouvrez Claude dans VS Code.' },
        { action: 'Copiez le message encadré plus haut et envoyez-le, sans y mettre votre clé.' },
      ],
      aClaude:
        'Crée un fichier .env à la racine de ce projet, avec une ligne ANTHROPIC_API_KEY= et rien après le signe égal. Ajoute .env au fichier .gitignore pour qu’il ne parte jamais sur GitHub. Puis explique-moi en une phrase simple ce que tu viens de faire.',
      preuve: {
        visible: 'Un fichier .env apparaît dans la barre latérale, et Claude explique ce qu’il a fait.',
        sinon: 'Renvoyez le même message à Claude en lui demandant de vérifier son travail.',
      },
      visuel: {
        key: 'arborescence',
        avant: ['mon-projet/', '  index.html'],
        apres: ['mon-projet/', '  index.html', '  .gitignore', '  .env'],
        ignores: ['.env'],
      },
      pannes: [],
    },
    {
      id: 'coller-la-cle',
      titre: 'Coller votre clé dans le fichier',
      lieu: 'vscode',
      danger: 'Ne collez jamais votre clé dans la conversation avec Claude. Elle se met dans le fichier, et nulle part ailleurs.',
      pourquoi: 'C’est le seul geste de ce guide que personne ne peut faire à votre place : la clé n’appartient qu’à vous.',
      gestes: [
        { action: 'Ouvrez le fichier .env dans la barre latérale.' },
        { action: 'Collez votre clé juste après le signe égal, sans espace.' },
        { action: 'Enregistrez le fichier.' },
      ],
      fichiers: [
        {
          chemin: '.env',
          contenu: 'ANTHROPIC_API_KEY=sk-ant-collez-votre-cle-ici',
          commentaire: 'Remplacez tout ce qui suit le signe égal par votre propre clé.',
        },
      ],
      preuve: {
        visible: 'La ligne est complète, et le nom du fichier .env s’affiche en grisé dans la barre latérale.',
        sinon: 'Le nom n’est pas grisé : le fichier n’est pas protégé. Reprenez l’étape précédente avant d’aller plus loin.',
      },
      visuel: {
        key: 'arborescence',
        avant: ['mon-projet/', '  .env', '    ANTHROPIC_API_KEY='],
        apres: ['mon-projet/', '  .env', '    ANTHROPIC_API_KEY=sk-ant-votre-cle'],
        ignores: ['.env'],
      },
      pannes: [],
    },
    {
      id: 'verifier-absence-env',
      titre: 'Vérifier de vos yeux que la clé n’est pas en ligne',
      lieu: 'navigateur',
      service: 'GitHub',
      pourquoi: 'On ne croit personne sur parole, pas même Claude. Une liste de fichiers se lit en trois secondes.',
      gestes: [
        { action: 'Ouvrez la page de votre dépôt sur github.com.' },
        { action: 'Parcourez la liste des fichiers.' },
      ],
      preuve: {
        visible: 'Aucun fichier nommé .env dans la liste.',
        sinon: 'Vous voyez un fichier .env : lisez la panne ci-dessous tout de suite, sans attendre.',
      },
      visuel: { key: 'trois-lieux', accent: 'cle' },
      pannes: [
        {
          id: 'env-visible-sur-github',
          frequente: true,
          symptome: 'Je vois un fichier .env sur GitHub',
          cause: 'Votre clé est partie en ligne. La supprimer ne suffit pas : GitHub garde une trace de tout ce qui a été envoyé.',
          reparation: [
            { action: 'Retournez sur la console Anthropic et supprimez cette clé immédiatement.' },
            { action: 'Créez-en une nouvelle.' },
            { action: 'Demandez à Claude de retirer le fichier de GitHub et de le protéger.' },
            { action: 'Recollez la nouvelle clé dans le fichier .env.' },
          ],
          preuve: 'La page GitHub n’affiche plus de fichier .env, et l’ancienne clé n’existe plus chez Anthropic.',
        },
      ],
    },
    {
      id: 'cle-dans-vercel',
      titre: 'Donner la clé à Vercel',
      lieu: 'navigateur',
      service: 'Vercel',
      pourquoi: 'Votre clé n’est pas partie sur GitHub, donc Vercel ne l’a pas. C’est normal, et c’est à vous de la lui donner.',
      gestes: [
        { action: 'Ouvrez votre projet sur vercel.com, puis ses réglages.', ancre: 'Settings' },
        { action: 'Allez dans les variables d’environnement.', ancre: 'Environment Variables' },
        { action: 'Créez une variable nommée exactement ANTHROPIC_API_KEY.' },
        { action: 'Collez votre clé comme valeur, puis enregistrez.' },
      ],
      preuve: {
        visible: 'La variable apparaît dans la liste, sa valeur masquée par des points.',
        sinon: 'Vérifiez le nom : la moindre différence de casse ou d’espace empêche votre site de la trouver.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/add-env-variable-values-vercel.png',
        alt: 'L’écran des variables d’environnement d’un projet Vercel.',
        service: 'Vercel',
        verifieLe: '2026-01-01',
        reperes: [
          { label: 'Le champ du nom de la variable', position: 'gauche' },
          { label: 'Le champ de la valeur, masquée après enregistrement', position: 'droite' },
        ],
      },
      pannes: [],
    },
    {
      id: 'redeployer',
      titre: 'Redéployer pour que votre site voie la clé',
      lieu: 'navigateur',
      service: 'Vercel',
      danger: 'Ajouter la variable ne suffit pas. Sans ce redéploiement, votre site continuera de ne pas fonctionner et vous croirez vous être trompé.',
      pourquoi: 'Un site en ligne ne relit ses réglages qu’au moment où il est reconstruit.',
      gestes: [
        { action: 'Ouvrez l’onglet des déploiements de votre projet.', ancre: 'Deployments' },
        { action: 'Sur le déploiement le plus récent, choisissez de le refaire.', ancre: 'Redeploy' },
      ],
      preuve: {
        visible: 'Un nouveau déploiement réussit, et votre site répond aux questions.',
        sinon: 'Vérifiez le nom de la variable dans Vercel, caractère par caractère, puis redéployez à nouveau.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/vercel-settings-button.png',
        alt: 'Le menu d’un déploiement Vercel, avec l’option de le refaire.',
        service: 'Vercel',
        verifieLe: '2026-01-01',
        reperes: [{ label: 'L’option de redéploiement, dans le menu du déploiement', position: 'droite' }],
      },
      pannes: [
        {
          id: 'variable-ajoutee-mais-site-casse',
          frequente: true,
          symptome: 'J’ai ajouté la variable mais mon site ne marche toujours pas',
          cause: 'Le site tourne encore sur sa version précédente, construite avant l’ajout de la variable.',
          reparation: [
            { action: 'Ouvrez l’onglet des déploiements.', ancre: 'Deployments' },
            { action: 'Refaites le dernier déploiement.', ancre: 'Redeploy' },
          ],
          preuve: 'Le nouveau déploiement réussit et votre site répond.',
        },
      ],
    },
  ],
};
