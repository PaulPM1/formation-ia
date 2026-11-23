import type { Guide } from '../parcours-model';

export const MISE_EN_LIGNE: Guide = {
  id: 'mise-en-ligne',
  titre: 'Mettre votre site en ligne',
  promesse: 'De votre dépôt GitHub à une adresse que vous pouvez envoyer à n’importe qui.',
  prerequis: ['Votre projet est sauvegardé sur GitHub'],
  etapes: [
    {
      id: 'compte-vercel',
      titre: 'Créer votre compte Vercel',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Ouvrez vercel.com.' },
        { action: 'Cliquez sur Continue with GitHub.' },
        { action: 'Acceptez l’accès à vos dépôts.' },
      ],
      preuve: {
        visible: 'Votre pseudo GitHub apparaît dans Vercel.',
        sinon: 'Déconnectez-vous et recommencez en acceptant l’accès.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/mise-en-ligne/login-with-github-vercel.png',
        alt: 'L’écran de connexion Vercel, avec le bouton Continue with GitHub.',
        service: 'Vercel',
        verifieLe: '2026-07-28',
        reperes: [{ label: 'Continue with GitHub', position: 'centre' }],
      },
      pannes: [
        {
          id: 'vercel-ne-voit-pas-mes-depots',
          frequente: true,
          symptome: 'Vercel n’affiche aucun de mes projets',
          cause: 'L’accès aux dépôts n’a pas été accordé.',
          reparation: [
            { action: 'Déconnectez-vous de Vercel.' },
            { action: 'Reconnectez-vous avec GitHub en acceptant l’accès.' },
          ],
          preuve: 'Vos projets apparaissent dans la liste.',
        },
      ],
    },
    {
      id: 'nouveau-projet',
      titre: 'Ajouter un nouveau projet',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Cliquez sur Add New, en haut à droite.' },
        { action: 'Choisissez Project.' },
      ],
      preuve: {
        visible: 'La page d’import s’ouvre.',
        sinon: 'Allez directement sur vercel.com/new.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/mise-en-ligne/add-new-vercel-project.png',
        alt: 'Le tableau de bord Vercel, menu Add New ouvert sur Project.',
        service: 'Vercel',
        verifieLe: '2026-07-28',
        reperes: [{ label: 'Add New, puis Project', position: 'droite' }],
      },
      pannes: [],
    },
    {
      id: 'importer-le-depot',
      titre: 'Importer votre dépôt',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Trouvez votre projet dans la liste de gauche.' },
        { action: 'Cliquez sur Import.' },
      ],
      preuve: {
        visible: 'L’écran de configuration s’ouvre avec le nom de votre projet.',
        sinon: 'Votre projet n’est pas listé : voyez la panne de l’étape 1.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/mise-en-ligne/import-github-repo-on-vercel.png',
        alt: 'La liste Import Git Repository dans Vercel, avec le bouton Import.',
        service: 'Vercel',
        verifieLe: '2026-07-28',
        reperes: [
          { label: 'Import Git Repository', position: 'gauche' },
          { label: 'Le bouton Import', position: 'droite' },
        ],
      },
      pannes: [],
    },
    {
      id: 'deployer',
      titre: 'Déployer votre site',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Ne changez aucun réglage.' },
        { action: 'Cliquez sur Deploy.' },
        { action: 'Patientez moins d’une minute.' },
      ],
      preuve: {
        visible: 'Des confettis, puis un aperçu de votre site.',
        sinon: 'Un message d’échec : notez-le et montrez-le à votre formateur.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/mise-en-ligne/deploy-button-vercel.png',
        alt: 'L’écran de configuration Vercel, avec le bouton Deploy.',
        service: 'Vercel',
        verifieLe: '2026-07-28',
        reperes: [{ label: 'Le bouton Deploy', position: 'bas' }],
      },
      pannes: [
        {
          id: 'deploiement-echoue',
          frequente: true,
          symptome: 'Vercel dit que le déploiement a échoué',
          cause: 'Quelque chose empêche la construction du site.',
          reparation: [
            { action: 'Ne cherchez pas à comprendre le message.' },
            { action: 'Faites une capture et montrez-la à votre formateur.' },
          ],
          preuve: 'Un déploiement réussi, avec l’aperçu du site.',
        },
      ],
    },
    {
      id: 'ouvrir-le-site',
      titre: 'Ouvrir votre site',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [{ action: 'Cliquez sur l’adresse en point vercel point app, sous Domains.' }],
      preuve: {
        visible: 'Votre site s’ouvre dans un nouvel onglet.',
        sinon: 'Rafraîchissez le tableau de bord et réessayez.',
      },
      visuel: {
        key: 'capture',
        fichier: 'faq/mise-en-ligne/domain-vercel.png',
        alt: 'Le tableau de bord d’un projet Vercel, avec les adresses sous Domains.',
        service: 'Vercel',
        verifieLe: '2026-07-28',
        reperes: [{ label: 'Vos adresses, sous Domains', position: 'centre' }],
      },
      pannes: [],
    },
    {
      id: 'le-lien-permanent',
      titre: 'Voir le site se mettre à jour',
      lieu: 'claude',
      gestes: [
        { action: 'Envoyez l’encadré plus haut à Claude.' },
        { action: 'Attendez une minute, rouvrez votre site, rafraîchissez.' },
      ],
      aClaude: 'Change le titre de la page d’accueil, puis envoie la modification sur GitHub.',
      preuve: {
        visible: 'Le titre a changé, sans que vous touchiez à Vercel.',
        sinon: 'Attendez encore une minute et rafraîchissez.',
      },
      visuel: { key: 'trois-lieux', accent: 'ligne' },
      pannes: [
        {
          id: 'le-site-ne-change-pas',
          frequente: true,
          symptome: 'Mon site reste identique',
          cause: 'La modification n’est pas partie, ou la mise à jour est en cours.',
          reparation: [
            { action: 'Vérifiez sur GitHub que la modification y figure.' },
            { action: 'Sinon, demandez à Claude d’envoyer la modification.' },
          ],
          preuve: 'Le site affiche le changement après rafraîchissement.',
        },
      ],
    },
  ],
};
