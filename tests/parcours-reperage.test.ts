import assert from 'node:assert/strict';
import test from 'node:test';

import { changementsDeLieu, libelleLieu } from '../src/features/faq/reperage';
import type { Etape, Guide } from '../src/parcours/parcours-model';

const etape = (id: string, lieu: Etape['lieu'], service?: string): Etape => ({
  id,
  titre: id,
  lieu,
  service,
  gestes: [{ action: 'Faites ceci.' }],
  preuve: { visible: 'Ceci apparaît.', sinon: 'Recommencez.' },
  visuel: { key: 'trois-lieux', accent: 'projet' },
  pannes: [],
});

test('le libellé combine le lieu et le service', () => {
  assert.equal(libelleLieu(etape('a', 'machine')), 'Votre ordinateur');
  assert.equal(libelleLieu(etape('b', 'vscode')), 'VS Code');
  assert.equal(libelleLieu(etape('c', 'navigateur', 'GitHub')), 'Votre navigateur · GitHub');
});

test('le marqueur ne s’affiche qu’à la rupture d’application', () => {
  const guide: Guide = {
    id: 'g',
    titre: 'G',
    promesse: 'P',
    prerequis: [],
    etapes: [
      etape('a', 'machine'),
      etape('b', 'vscode'),
      etape('c', 'vscode'),
      etape('d', 'navigateur', 'GitHub'),
    ],
  };
  assert.deepEqual(changementsDeLieu(guide), [null, 'VS Code', null, 'votre navigateur']);
});
