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
      pourquoi: 'Un projet vit dans un dossier. Un projet, un dossier : c’est la règle qui vous évitera des heures de confusion.',
      gestes: [
        { action: 'Créez un dossier dans votre dossier personnel, pas sur le Bureau.', ancre: 'Documents' },
        { action: 'Nommez-le avec des lettres minuscules et des tirets, sans espace ni accent.' },
      ],
      preuve: {
        visible: 'Le dossier apparaît, il est vide, et vous savez le retrouver.',
        sinon: 'Recommencez depuis votre dossier personnel : un dossier créé ailleurs se retrouve mal.',
      },
      visuel: {
        key: 'arborescence',
        avant: ['Documents/'],
        apres: ['Documents/', '  mon-projet/'],
      },
      pannes: [],
    },
  ],
};
