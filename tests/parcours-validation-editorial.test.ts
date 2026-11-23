import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import type { Etape, Guide, Outil } from '../src/parcours/parcours-model';
import { validateCaptures, validateGuides, validateOutils } from '../src/parcours/parcours-validation';

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

test('le tiret cadratin est refusé', () => {
  const issues = validateGuides([guide({ promesse: 'De rien — à tout.' })], '2026-07-27');
  assert.equal(issues.length, 1);
  assert.match(issues[0], /tiret cadratin/);
});

test('le vocabulaire interdit est refusé dans un texte lisible', () => {
  const issues = validateGuides(
    [guide({ etapes: [etape({ gestes: [{ action: 'Ouvrez le terminal.' }] })] })],
    '2026-07-27',
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0], /terminal/);
});

test('les mots interdits sont comparés sur des frontières de mot', () => {
  const issues = validateGuides(
    [guide({ etapes: [etape({ gestes: [{ action: 'Un clic suffit, le client répond.' }] })] })],
    '2026-07-27',
  );
  assert.deepEqual(issues, []);
});

test('un tiret cadratin dans une ligne d’arborescence est refusé', () => {
  const issues = validateGuides(
    [
      guide({
        etapes: [
          etape({
            visuel: { key: 'arborescence', avant: [], apres: ['mon-projet/ — le dossier'] },
          }),
        ],
      }),
    ],
    '2026-07-27',
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0], /visuel\.apres\[0\] : tiret cadratin/);
});

test('la réponse de Claude et le commentaire d’un fichier sont balayés', () => {
  const issues = validateGuides(
    [
      guide({
        etapes: [
          etape({
            aClaude: 'Crée le fichier.',
            visuel: { key: 'claude', reponse: ['Ouvrez le terminal pour voir.'] },
            fichiers: [
              { chemin: '.env', contenu: 'CLE=', commentaire: 'Repris du git log.' },
            ],
          }),
        ],
      }),
    ],
    '2026-07-27',
  );
  assert.equal(issues.length, 2);
  assert.ok(issues.some((issue) => /visuel\.reponse\[0\] : vocabulaire interdit « terminal »/.test(issue)));
  assert.ok(issues.some((issue) => /commentaire : vocabulaire interdit « git log »/.test(issue)));
});

test('le contenu d’un fichier échappe au vocabulaire interdit', () => {
  const issues = validateGuides(
    [guide({ etapes: [etape({ fichiers: [{ chemin: '.gitignore', contenu: '.env\nnpm run build' }] })] })],
    '2026-07-27',
  );
  assert.deepEqual(issues, []);
});

test('un pourquoi de plus de 160 caractères est refusé', () => {
  const issues = validateGuides([guide({ etapes: [etape({ pourquoi: 'a'.repeat(161) })] })], '2026-07-27');
  assert.equal(issues.length, 1);
  assert.match(issues[0], /160/);
});

test('une capture sans alt est refusée', () => {
  const issues = validateGuides(
    [
      guide({
        etapes: [
          etape({
            lieu: 'navigateur',
            service: 'GitHub',
            visuel: {
              key: 'capture',
              fichier: 'faq/naissance-projet/depot-vide.png',
              alt: '',
              service: 'GitHub',
              verifieLe: '2026-07-27',
              reperes: [],
            },
          }),
        ],
      }),
    ],
    '2026-07-27',
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0], /alt/);
});

test('une capture vérifiée il y a plus de six mois est signalée en avertissement, pas en erreur', () => {
  const capture = (verifieLe: string) =>
    guide({
      etapes: [
        etape({
          lieu: 'navigateur',
          service: 'GitHub',
          visuel: {
            key: 'capture',
            fichier: 'faq/naissance-projet/depot-vide.png',
            alt: 'La page d’un dépôt vide sur GitHub.',
            service: 'GitHub',
            verifieLe,
            reperes: [],
          },
        }),
      ],
    });

  assert.deepEqual(validateGuides([capture('2026-03-01')], '2026-07-27'), []);
  assert.deepEqual(validateCaptures([capture('2026-03-01')], '2026-07-27'), []);

  const perimee = capture('2025-11-01');
  assert.deepEqual(validateGuides([perimee], '2026-07-27'), []);
  const avertissements = validateCaptures([perimee], '2026-07-27');
  assert.equal(avertissements.length, 1);
  assert.match(avertissements[0], /vérifiée le/);
});

test('une date de vérification mal formée est refusée, et une seule fois', () => {
  const malFormee = [
    guide({
      etapes: [
        etape({
          lieu: 'navigateur',
          service: 'GitHub',
          visuel: {
            key: 'capture',
            fichier: 'faq/x.png',
            alt: 'Une capture.',
            service: 'GitHub',
            verifieLe: '27/07/2026',
            reperes: [],
          },
        }),
      ],
    }),
  ];

  const issues = validateGuides(malFormee, '2026-07-27');
  assert.equal(issues.length, 1);
  assert.match(issues[0], /AAAA-MM-JJ/);

  // Le format fautif est déjà une erreur : le compter en plus comme une
  // capture à recontrôler ferait dire deux choses différentes du même défaut.
  assert.deepEqual(validateCaptures(malFormee, '2026-07-27'), []);
});

test('une clé API dans un bloc destiné à Claude est refusée', () => {
  const issues = validateGuides(
    [guide({ etapes: [etape({ aClaude: 'Crée un .env avec sk-ant-api03-abcdef' })] })],
    '2026-07-27',
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0], /clé/);
});

test('le bloc à coller contrôlé est bien celui qui est rendu', () => {
  // Sans cette garde, le garde-fou anti-fuite ci-dessus certifierait un champ
  // mort : c'est exactement ce qui est arrivé quand le texte collé vivait en
  // double dans le visuel.
  const etapeSource = readFileSync(
    new URL('../src/components/faq/Etape.astro', import.meta.url),
    'utf8',
  );
  assert.match(etapeSource, /<pre data-copiable>\{etape\.aClaude\}<\/pre>/);

  const visuelSource = readFileSync(
    new URL('../src/components/faq/visuels/VisuelClaude.astro', import.meta.url),
    'utf8',
  );
  assert.ok(!visuelSource.includes('data-copiable'));
  assert.ok(!visuelSource.includes('visuel.colle'));
});

test('le role d’un outil est plafonné à 100 caractères', () => {
  const outils: Outil[] = [
    { nom: 'GitHub', logo: 'faq/outils/github.svg', role: 'a'.repeat(101) },
  ];
  const issues = validateOutils(outils);
  assert.equal(issues.length, 1);
  assert.match(issues[0], /100/);
});

test('une carte d’outils correcte ne remonte rien', () => {
  const outils: Outil[] = [
    { nom: 'GitHub', logo: 'faq/outils/github.svg', role: 'L’atelier : c’est là que votre projet vit.' },
  ];
  assert.deepEqual(validateOutils(outils), []);
});
