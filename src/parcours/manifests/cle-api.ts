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
      titre: 'Créer une clé chez Anthropic',
      lieu: 'navigateur',
      service: 'console Anthropic',
      gestes: [
        { action: 'Ouvrez console.anthropic.com et connectez-vous.' },
        { action: 'Cliquez sur API keys, dans le menu de gauche.' },
        { action: 'Cliquez sur Create key, en haut à droite.' },
      ],
      preuve: {
        visible: 'Une fenêtre Create API key s’ouvre.',
        sinon: 'Allez directement sur console.anthropic.com/settings/keys.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/create-key-claude-console.png',
        alt: 'La console Anthropic, page API keys, avec le bouton Create key.',
        service: 'console Anthropic',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'API keys, dans le menu', position: 'gauche' },
          { label: 'Create key', position: 'droite' },
        ],
      },
      pannes: [],
    },
    {
      id: 'nommer-la-cle',
      titre: 'Nommer la clé',
      lieu: 'navigateur',
      service: 'console Anthropic',
      gestes: [
        { action: 'Donnez-lui un nom, par exemple celui de votre projet.' },
        { action: 'Laissez Expires sur Never.' },
        { action: 'Cliquez sur Add.' },
      ],
      preuve: {
        visible: 'Une fenêtre Save your API key s’affiche.',
        sinon: 'Refermez et recommencez.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/create-api-key-settings-anthropic-console.png',
        alt: 'La fenêtre Create API key, avec le champ Name et le bouton Add.',
        service: 'console Anthropic',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'Le nom de la clé', position: 'centre' },
          { label: 'Le bouton Add', position: 'bas' },
        ],
      },
      pannes: [],
    },
    {
      id: 'copier-la-cle',
      titre: 'Copier la clé, tout de suite',
      lieu: 'navigateur',
      service: 'console Anthropic',
      danger:
        'Elle ne s’affiche qu’une seule fois. C’est un mot de passe : ne la montrez à personne et ne la collez jamais dans une conversation.',
      gestes: [
        { action: 'Cliquez sur Copy key.' },
        { action: 'Gardez cet onglet ouvert.' },
      ],
      preuve: {
        visible: 'La clé commence par sk-ant.',
        sinon: 'Fenêtre fermée trop tôt ? Supprimez cette clé et refaites-en une.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/save-claude-console-api-key-value.png',
        alt: 'La fenêtre Save your API key, la valeur de la clé étant masquée sur cette image.',
        service: 'console Anthropic',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'La clé, affichée une seule fois', position: 'centre' },
          { label: 'Copy key', position: 'droite' },
        ],
      },
      pannes: [
        {
          id: 'cle-perdue',
          frequente: true,
          symptome: 'J’ai fermé la fenêtre sans copier ma clé',
          cause: 'Une clé ne s’affiche qu’une fois, personne ne peut la retrouver.',
          reparation: [
            { action: 'Supprimez la clé que vous ne pouvez plus lire.' },
            { action: 'Créez-en une nouvelle et copiez-la tout de suite.' },
            { action: 'Vous pouvez en refaire autant que vous voulez, sans limite.' },
          ],
          preuve: 'Une nouvelle clé est affichée et copiée.',
        },
      ],
    },
    {
      id: 'preparer-le-coffre',
      titre: 'Demander à Claude de préparer le coffre',
      lieu: 'vscode',
      gestes: [
        { action: 'Ouvrez Claude dans VS Code.' },
        { action: 'Envoyez-lui l’encadré plus haut, sans y mettre votre clé.' },
      ],
      aClaude:
        'Crée un fichier .env à la racine de ce projet, avec une ligne ANTHROPIC_API_KEY= et rien après le signe égal. Ajoute .env au fichier .gitignore.',
      preuve: {
        visible: 'Un fichier .env apparaît dans la barre latérale.',
        sinon: 'Redemandez à Claude de vérifier son travail.',
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
      titre: 'Coller la clé dans le fichier',
      lieu: 'vscode',
      danger: 'Ne collez jamais votre clé dans la conversation avec Claude.',
      gestes: [
        { action: 'Ouvrez le fichier .env.' },
        { action: 'Collez votre clé juste après le signe égal, sans espace.' },
        { action: 'Enregistrez.' },
      ],
      fichiers: [
        {
          chemin: '.env',
          contenu: 'ANTHROPIC_API_KEY=sk-ant-collez-votre-cle-ici',
          commentaire: 'Remplacez tout ce qui suit le signe égal par votre clé.',
        },
      ],
      preuve: {
        visible: 'Le nom .env s’affiche en grisé dans la barre latérale.',
        sinon: 'Il n’est pas grisé : reprenez l’étape précédente avant d’aller plus loin.',
      },
      visuel: {
        key: 'arborescence',
        avant: ['mon-projet/', '  .env'],
        apres: ['mon-projet/', '  .env'],
        ignores: ['.env'],
      },
      pannes: [],
    },
    {
      id: 'verifier-absence-env',
      titre: 'Vérifier que la clé n’est pas en ligne',
      lieu: 'navigateur',
      service: 'GitHub',
      gestes: [
        { action: 'Ouvrez la page de votre dépôt sur github.com.' },
        { action: 'Parcourez la liste des fichiers.' },
      ],
      preuve: {
        visible: 'Aucun fichier .env dans la liste.',
        sinon: 'Vous en voyez un : lisez la panne ci-dessous tout de suite.',
      },
      visuel: { key: 'trois-lieux', accent: 'cle' },
      pannes: [
        {
          id: 'env-visible-sur-github',
          frequente: true,
          symptome: 'Je vois un fichier .env sur GitHub',
          cause: 'Votre clé est partie en ligne. La supprimer ne suffit pas, GitHub garde une trace.',
          reparation: [
            { action: 'Supprimez cette clé sur console.anthropic.com, tout de suite.' },
            { action: 'Créez-en une nouvelle.' },
            { action: 'Demandez à Claude de retirer le fichier de GitHub et de le protéger.' },
            { action: 'Recollez la nouvelle clé dans le .env.' },
          ],
          preuve: 'Plus de fichier .env sur GitHub, et l’ancienne clé n’existe plus.',
        },
      ],
    },
    {
      id: 'ouvrir-les-reglages',
      titre: 'Ouvrir les réglages du projet',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Ouvrez votre projet sur vercel.com.' },
        { action: 'Cliquez sur Settings, en bas du menu de gauche.' },
      ],
      preuve: {
        visible: 'La page Project Settings s’ouvre.',
        sinon: 'Vérifiez que vous êtes sur le bon projet.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/vercel-settings-button.png',
        alt: 'Le tableau de bord d’un projet Vercel, avec Settings en bas du menu de gauche.',
        service: 'Vercel',
        verifieLe: '2026-07-28',
        reperes: [{ label: 'Settings, en bas du menu', position: 'gauche' }],
      },
      pannes: [],
    },
    {
      id: 'choisir-production',
      titre: 'Choisir l’environnement Production',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Cliquez sur Environments.' },
        { action: 'Cliquez sur Production.' },
      ],
      preuve: {
        visible: 'La page Production s’ouvre.',
        sinon: 'Revenez dans Settings et recommencez.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/choose-environment-vercel.png',
        alt: 'La page Environments d’un projet Vercel, avec la ligne Production.',
        service: 'Vercel',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'Environments', position: 'gauche' },
          { label: 'Production', position: 'centre' },
        ],
      },
      pannes: [],
    },
    {
      id: 'ajouter-la-variable',
      titre: 'Ajouter une variable d’environnement',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Descendez jusqu’à Environment Variables.' },
        { action: 'Cliquez sur Add Environment Variable.' },
      ],
      preuve: {
        visible: 'Une fenêtre Add Environment Variable s’ouvre.',
        sinon: 'Le bouton est à droite du titre de la section.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/add-env-variable-button.png',
        alt: 'La section Environment Variables d’un projet Vercel, avec le bouton Add Environment Variable.',
        service: 'Vercel',
        verifieLe: '2026-07-28',
        reperes: [{ label: 'Add Environment Variable', position: 'droite' }],
      },
      pannes: [],
    },
    {
      id: 'remplir-la-variable',
      titre: 'Remplir la variable',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Dans Key, mettez le nom exact attendu par votre projet, par exemple ANTHROPIC_API_KEY.' },
        { action: 'Dans Value, collez votre clé.' },
        { action: 'Laissez Sensitive activé, choisissez Production, puis Save.' },
      ],
      preuve: {
        visible: 'La variable apparaît dans la liste, sa valeur masquée par des points.',
        sinon: 'Vérifiez le nom, caractère par caractère.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/cle-api/add-env-variable-values-vercel.png',
        alt: 'La fenêtre Add Environment Variable de Vercel, remplie avec un nom d’exemple, la valeur étant masquée sur cette image.',
        service: 'Vercel',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'Le nom de la variable', position: 'haut' },
          { label: 'La valeur, masquée sur cette image', position: 'centre' },
        ],
      },
      pannes: [],
    },
    {
      id: 'redeployer',
      titre: 'Redéployer pour que votre site voie la clé',
      lieu: 'navigateur',
      service: 'Vercel',
      danger: 'Ajouter la variable ne suffit pas. Sans ce redéploiement, votre site ne verra pas la clé.',
      gestes: [
        { action: 'Ouvrez l’onglet Deployments.' },
        { action: 'Sur le dernier déploiement, ouvrez le menu des trois points, puis Redeploy.' },
      ],
      preuve: {
        visible: 'Un nouveau déploiement réussit.',
        sinon: 'Vérifiez le nom de la variable, puis redéployez à nouveau.',
      },
      visuel: { key: 'trois-lieux', accent: 'ligne' },
      pannes: [
        {
          id: 'variable-ajoutee-mais-site-casse',
          frequente: true,
          symptome: 'J’ai ajouté la variable mais mon site ne marche pas',
          cause: 'Le site tourne encore sur sa version précédente.',
          reparation: [
            { action: 'Ouvrez l’onglet Deployments.' },
            { action: 'Refaites le dernier déploiement avec Redeploy.' },
          ],
          preuve: 'Le nouveau déploiement réussit et le site répond.',
        },
      ],
    },
  ],
};
