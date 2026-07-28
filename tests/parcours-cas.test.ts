import assert from 'node:assert/strict';
import test from 'node:test';

import { collecterCas } from '../src/features/faq/cas';
import { GUIDES } from '../src/parcours/manifests';
import type { Guide } from '../src/parcours/parcours-model';

const guide: Guide = {
  id: 'naissance-projet',
  titre: 'Créer un projet',
  promesse: 'P',
  prerequis: [],
  etapes: [
    {
      id: 'ouvrir-dans-vscode',
      titre: 'Ouvrir le dossier',
      lieu: 'vscode',
      gestes: [{ action: 'Ouvrez le dossier.' }],
      preuve: { visible: 'Le nom apparaît.', sinon: 'Recommencez.' },
      visuel: { key: 'trois-lieux', accent: 'projet' },
      pannes: [
        {
          id: 'fichier-au-lieu-du-dossier',
          frequente: true,
          symptome: 'Je vois un seul fichier, pas mon dossier',
          cause: 'Le fichier a été ouvert seul, pas le dossier qui le contient.',
          reparation: [{ action: 'Refermez, puis ouvrez le dossier.' }],
          preuve: 'Le nom du dossier apparaît en haut de la barre latérale.',
        },
        {
          id: 'panne-rare',
          frequente: false,
          symptome: 'Un cas rare',
          cause: 'Rare.',
          reparation: [{ action: 'Faites ceci.' }],
          preuve: 'C’est réglé.',
        },
      ],
    },
  ],
};

test('seules les pannes fréquentes remontent dans la grille', () => {
  const cas = collecterCas([guide]);
  assert.equal(cas.length, 1);
  assert.equal(cas[0].panneId, 'fichier-au-lieu-du-dossier');
});

test('chaque entrée pointe vers une ancre complète', () => {
  const cas = collecterCas([guide]);
  assert.equal(cas[0].href, '/faq/naissance-projet/#panne-fichier-au-lieu-du-dossier');
  assert.equal(cas[0].guideTitre, 'Créer un projet');
});

/**
 * La liste est écrite à la main, volontairement : c'est le seul moyen qu'une
 * panne qui perdrait son drapeau `frequente`, ou un symptôme reformulé sans
 * qu'on s'en aperçoive, fasse échouer la vérification. Toute évolution
 * assumée de la grille se répercute ici, en connaissance de cause.
 */
const SYMPTOMES_FREQUENTS = [
  'Je vois un seul fichier, pas mon dossier',
  'Je ne trouve pas Claude Code',
  'Claude parle d’un dossier que je ne reconnais pas',
  'GitHub ne m’affiche aucun bloc d’instructions',
  'Ma page GitHub reste vide',
  'Vercel n’affiche aucun de mes projets',
  'Vercel dit que le déploiement a échoué',
  'Mon site reste identique',
  'J’ai fermé la fenêtre sans copier ma clé',
  'Je vois un fichier .env sur GitHub',
  'J’ai ajouté la variable mais mon site ne marche pas',
];

test('la grille livrée est exactement la liste attendue, dans l’ordre', () => {
  assert.deepEqual(
    collecterCas(GUIDES).map((cas) => cas.symptome),
    SYMPTOMES_FREQUENTS,
  );
});
