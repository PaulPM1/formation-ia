import assert from 'node:assert/strict';
import test from 'node:test';

import type { Etape, Guide } from '../src/parcours/parcours-model';
import { validateGuides } from '../src/parcours/parcours-validation';

const etape = (patch: Partial<Etape> = {}): Etape => ({
  id: 'creer-le-dossier',
  titre: 'Créer un dossier pour votre projet',
  lieu: 'machine',
  gestes: [{ action: 'Créez un dossier nommé mon-projet.' }],
  preuve: { visible: 'Le dossier existe.', sinon: 'Recommencez dans votre dossier personnel.' },
  visuel: { key: 'arborescence', avant: [], apres: ['mon-projet/'] },
  pannes: [],
  ...patch,
});

const guide = (patch: Partial<Guide> = {}): Guide => ({
  id: 'naissance-projet',
  titre: 'Créer un projet et le mettre sur GitHub',
  promesse: 'De rien du tout à un projet sauvegardé en ligne.',
  prerequis: [],
  etapes: [etape()],
  ...patch,
});

test('un guide correct ne remonte aucun problème', () => {
  assert.deepEqual(validateGuides([guide()]), []);
});

test('une preuve vide est refusée', () => {
  const issues = validateGuides([
    guide({ etapes: [etape({ preuve: { visible: '', sinon: 'Reprenez.' } })] }),
  ]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /preuve\.visible/);
});

test('une issue de secours vide est refusée', () => {
  const issues = validateGuides([
    guide({ etapes: [etape({ preuve: { visible: 'Le dossier existe.', sinon: '  ' } })] }),
  ]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /preuve\.sinon/);
});

test('un identifiant d’étape hors kebab est refusé', () => {
  const issues = validateGuides([guide({ etapes: [etape({ id: 'Creer_Le_Dossier' })] })]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /kebab/);
});

test('deux étapes du même guide ne peuvent pas partager un identifiant', () => {
  const issues = validateGuides([guide({ etapes: [etape(), etape()] })]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /identifiant d’étape en double/);
});

test('deux guides différents peuvent réutiliser le même identifiant d’étape', () => {
  const autre = guide({ id: 'cle-api', titre: 'Donner une clé API', promesse: 'Une clé rangée.' });
  assert.deepEqual(validateGuides([guide(), autre]), []);
});

test('une étape dans le navigateur doit nommer son service', () => {
  const issues = validateGuides([guide({ etapes: [etape({ lieu: 'navigateur' })] })]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /service/);
});

test('une panne incomplète est refusée', () => {
  const issues = validateGuides([
    guide({
      etapes: [
        etape({
          pannes: [
            { id: 'panne-vide', frequente: true, symptome: '', cause: 'Rien', reparation: [], preuve: 'OK' },
          ],
        }),
      ],
    }),
  ]);
  assert.equal(issues.length, 2);
  assert.ok(issues.some((issue) => /symptome/.test(issue)));
  assert.ok(issues.some((issue) => /reparation/.test(issue)));
});

test('un visuel claude sans bloc à coller est refusé', () => {
  const issues = validateGuides([
    guide({
      etapes: [etape({ visuel: { key: 'claude', reponse: ['C’est fait.'] } })],
    }),
  ]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /visuel claude sans bloc aClaude/);
});

test('un visuel claude accompagné de son bloc à coller passe', () => {
  const issues = validateGuides([
    guide({
      etapes: [
        etape({
          aClaude: 'Dans quel dossier travailles-tu ?',
          visuel: { key: 'claude', reponse: ['Je travaille dans mon-projet.'] },
        }),
      ],
    }),
  ]);
  assert.deepEqual(issues, []);
});

test('une clé de visuel inconnue est refusée', () => {
  const issues = validateGuides([
    guide({ etapes: [etape({ visuel: { key: 'video' } as never })] }),
  ]);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /visuel inconnu/);
});
