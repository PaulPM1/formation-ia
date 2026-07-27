import type { Guide } from '../parcours-model';

export const MISE_EN_LIGNE: Guide = {
  id: 'mise-en-ligne',
  titre: 'Mettre votre site en ligne',
  promesse: 'De votre dépôt GitHub à une adresse que vous pouvez envoyer à n’importe qui.',
  prerequis: ['Votre projet est sur GitHub'],
  etapes: [
    {
      id: 'compte-vercel',
      titre: 'Créer votre compte Vercel avec GitHub',
      lieu: 'navigateur',
      service: 'Vercel',
      pourquoi: 'En passant par GitHub, vous n’avez aucun mot de passe supplémentaire à retenir, et Vercel voit vos projets.',
      gestes: [
        { action: 'Sur vercel.com, choisissez de continuer avec GitHub.', ancre: 'Continue with GitHub' },
        { action: 'Acceptez de donner à Vercel l’accès à vos dépôts.' },
      ],
      preuve: {
        visible: 'Votre pseudo GitHub s’affiche dans Vercel.',
        sinon: 'Déconnectez-vous de Vercel et recommencez en acceptant l’accès aux dépôts.',
      },
      visuel: { key: 'trois-lieux', accent: 'projet' },
      pannes: [
        {
          id: 'vercel-ne-voit-pas-mes-depots',
          frequente: true,
          symptome: 'Vercel n’affiche aucun de mes projets',
          cause: 'L’accès aux dépôts n’a pas été accordé au moment de la connexion.',
          reparation: [
            { action: 'Déconnectez-vous de Vercel.' },
            { action: 'Reconnectez-vous avec GitHub en acceptant l’accès à vos dépôts.' },
          ],
          preuve: 'Vos projets apparaissent dans la liste.',
        },
      ],
    },
    {
      id: 'importer-le-depot',
      titre: 'Importer votre projet',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [
        { action: 'Cliquez sur ajouter un nouveau projet.', ancre: 'Add New' },
        { action: 'Trouvez votre projet dans la liste, reconnaissable à son nom.' },
        { action: 'Cliquez sur importer.', ancre: 'Import' },
      ],
      preuve: {
        visible: 'Le nom de votre projet s’affiche en haut de la page.',
        sinon: 'Votre projet n’est pas dans la liste : voyez la panne juste au-dessus, à l’étape précédente.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/mise-en-ligne/import-depot.png',
        alt: 'La liste des projets GitHub dans Vercel, avec le bouton d’import.',
        service: 'Vercel',
        verifieLe: '2026-01-01',
        reperes: [{ label: 'Le bouton d’import, à droite du nom de votre projet', position: 'droite' }],
      },
      pannes: [],
    },
    {
      id: 'deployer',
      titre: 'Cliquer sur déployer, sans toucher à rien',
      lieu: 'navigateur',
      service: 'Vercel',
      pourquoi: 'Vercel devine tout seul comment construire votre projet. Modifier ces réglages est le meilleur moyen de casser quelque chose.',
      gestes: [
        { action: 'Ne changez aucun réglage de la page.' },
        { action: 'Cliquez sur déployer.', ancre: 'Deploy' },
        { action: 'Patientez : cela prend souvent moins d’une minute.' },
      ],
      preuve: {
        visible: 'Une page de félicitations, avec un aperçu de votre site.',
        sinon: 'Un message d’échec s’affiche : notez-le et montrez-le à votre formateur, ne cherchez pas à le corriger seul.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/mise-en-ligne/bouton-deployer.png',
        alt: 'L’écran de configuration de Vercel, avec le bouton de déploiement.',
        service: 'Vercel',
        verifieLe: '2026-01-01',
        reperes: [{ label: 'Le bouton de déploiement, en bas de la page', position: 'bas' }],
      },
      pannes: [
        {
          id: 'deploiement-echoue',
          frequente: true,
          symptome: 'Vercel affiche que le déploiement a échoué',
          cause: 'Quelque chose empêche la construction du site. La cause est technique et varie d’un projet à l’autre.',
          reparation: [
            { action: 'Ne cherchez pas à comprendre le message.' },
            { action: 'Faites une capture de l’écran et montrez-la à votre formateur.' },
          ],
          preuve: 'Un déploiement réussi, avec l’aperçu de votre site.',
        },
      ],
    },
    {
      id: 'ouvrir-le-site',
      titre: 'Ouvrir votre site',
      lieu: 'navigateur',
      service: 'Vercel',
      gestes: [{ action: 'Cliquez sur l’aperçu de votre site.' }],
      preuve: {
        visible: 'Votre site s’ouvre, et son adresse se termine par vercel point app.',
        sinon: 'Rafraîchissez la page du tableau de bord et réessayez.',
      },
      visuel: {
        key: 'capture',
        fichier: 'demarrer/mise-en-ligne/lien-du-site.png',
        alt: 'Le tableau de bord d’un projet Vercel, avec l’adresse du site en évidence.',
        service: 'Vercel',
        verifieLe: '2026-01-01',
        reperes: [{ label: 'L’adresse de votre site, en haut du tableau de bord', position: 'haut' }],
      },
      pannes: [],
    },
    {
      id: 'retrouver-le-lien',
      titre: 'Savoir où retrouver ce lien plus tard',
      lieu: 'navigateur',
      service: 'Vercel',
      pourquoi: 'C’est la question qui revient le lendemain. Le lien est toujours au même endroit.',
      gestes: [
        { action: 'Ouvrez vercel.com et connectez-vous.' },
        { action: 'Cliquez sur votre projet : l’adresse est affichée en haut.' },
      ],
      preuve: {
        visible: 'L’adresse de votre site, en haut du tableau de bord du projet.',
        sinon: 'Vérifiez que vous êtes connecté au bon compte Vercel.',
      },
      visuel: { key: 'trois-lieux', accent: 'ligne' },
      pannes: [],
    },
    {
      id: 'le-lien-permanent',
      titre: 'Changer quelque chose et regarder le site se mettre à jour',
      lieu: 'vscode',
      pourquoi: 'C’est le moment le plus important : votre dossier, GitHub et votre site ne font plus qu’une seule mécanique.',
      gestes: [
        { action: 'Dans Claude, demandez un petit changement visible avec le message ci-dessous.' },
        { action: 'Attendez une minute, puis rouvrez votre site et rafraîchissez.' },
      ],
      aClaude: 'Change le titre de la page d’accueil, puis envoie la modification sur GitHub.',
      preuve: {
        visible: 'Votre site affiche le nouveau titre, sans que vous ayez rien fait sur Vercel.',
        sinon: 'Attendez encore une minute et rafraîchissez : la mise à jour prend parfois un peu de temps.',
      },
      visuel: { key: 'trois-lieux', accent: 'ligne' },
      pannes: [
        {
          id: 'le-site-ne-change-pas',
          frequente: true,
          symptome: 'J’ai fait la modification mais mon site reste identique',
          cause: 'La modification n’est pas partie sur GitHub, ou la mise à jour est encore en cours.',
          reparation: [
            { action: 'Ouvrez votre dépôt GitHub et vérifiez que la modification y figure.' },
            { action: 'Si elle n’y est pas, demandez à Claude : envoie la modification sur GitHub.' },
          ],
          preuve: 'Votre site affiche le changement après rafraîchissement.',
        },
      ],
    },
  ],
};
