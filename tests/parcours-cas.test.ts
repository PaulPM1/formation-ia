import assert from 'node:assert/strict';
import test from 'node:test';

import { collecterCas } from '../src/features/demarrer/cas';
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
  assert.equal(cas[0].href, '/demarrer/naissance-projet/#panne-fichier-au-lieu-du-dossier');
  assert.equal(cas[0].guideTitre, 'Créer un projet');
});

test('toutes les ancres de la grille livrée existent dans les manifestes', () => {
  const ancres = new Set(
    GUIDES.flatMap((g) =>
      g.etapes.flatMap((etape) =>
        etape.pannes.map((panne) => `/demarrer/${g.id}/#panne-${panne.id}`),
      ),
    ),
  );
  for (const cas of collecterCas(GUIDES)) {
    assert.ok(ancres.has(cas.href), `ancre orpheline : ${cas.href}`);
  }
});
