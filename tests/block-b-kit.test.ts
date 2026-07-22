import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';

import {
  buildKitArchive,
  checkKitArchive,
  participantKitDirectory,
} from '../scripts/block-b-kit.mjs';
import { verifyCowork } from '../kits/bloc-b-assistant/verify-cowork.mjs';

const projectDirectory = fileURLToPath(new URL('..', import.meta.url));

const readKit = (relativePath: string) => readFile(
  path.join(participantKitDirectory, relativePath),
  'utf8',
);

test('le kit partage trois fichiers, six notes et quatre prompts cohérents', async () => {
  const inbox = await Promise.all([
    'inbox/01-demandes.md',
    'inbox/02-reunion.md',
    'inbox/03-messages.md',
  ].map(readKit));
  const noteIds = inbox.flatMap((content) => [...content.matchAll(/\[N\d{2}\]/g)].map(([id]) => id));
  assert.deepEqual(noteIds, ['[N01]', '[N02]', '[N03]', '[N04]', '[N05]', '[N06]']);
  assert.match(inbox.join('\n'), /18 septembre/);
  assert.match(inbox.join('\n'), /19 septembre/);

  const [chat, artifact, cowork, code] = await Promise.all([
    'prompts/01-chat.md', 'prompts/02-artifact.md',
    'prompts/03-cowork.md', 'prompts/04-claude-code.md',
  ].map(readKit));

  assert.match(chat, /Actions du jour/);
  assert.match(chat, /À confirmer/);
  assert.match(chat, /Plus tard/);
  assert.match(chat, /source.*action/is);
  assert.match(chat, /six lignes/is);

  for (const category of ['Aujourd’hui', 'Plus tard', 'Archiver']) assert.match(artifact, new RegExp(category));
  assert.match(artifact, /compteurs/i);
  assert.match(artifact, /remise à zéro/i);
  assert.match(artifact, /six cartes dans `Aujourd’hui`/i);
  assert.match(artifact, /confirmation.*archiv/is);

  assert.match(cowork, /P\.A\.C\.T\.E\./);
  assert.match(cowork, /lire uniquement `inbox\/`/i);
  assert.match(cowork, /écrire uniquement dans `sortie\/`/i);
  assert.match(cowork, /attends mon approbation/i);
  assert.match(cowork, /ne modifie ni ne supprime/i);
  assert.match(cowork, /À confirmer/);

  assert.match(code, /source sous chaque carte/i);
  assert.match(code, /préserve le tri/i);
  assert.match(code, /node --test/);
  assert.match(code, /diff.*VS Code/is);
});

test('le vérificateur Cowork accepte le cas conforme et refuse les sorties adversariales', async (t) => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'bloc-b-cowork-'));
  await cp(participantKitDirectory, temp, { recursive: true });
  t.after(() => rm(temp, { recursive: true, force: true }));

  const validBrief = [
    '# Brief du jour',
    '## Actions du jour',
    '- [N01] Envoyer l’agenda. [source: inbox/01-demandes.md]',
    '- [N06] Transmettre le nombre. [source: inbox/03-messages.md]',
    '## À confirmer',
    '- [N03, N05] Confirmer le 18 ou le 19 septembre. [sources: inbox/02-reunion.md ; inbox/03-messages.md]',
    '## Plus tard',
    '- [N02] Préparer les icônes. [source: inbox/01-demandes.md]',
    '- [N04] Archiver après validation. [source: inbox/02-reunion.md]',
  ].join('\n');
  await writeFile(path.join(temp, 'sortie/brief-du-jour.md'), `${validBrief}\n`);

  const valid = await verifyCowork({ rootDirectory: temp, log: false });
  assert.equal(valid.ok, true);
  assert.deepEqual(valid.checks.map((check) => check.ok), [true, true, true, true]);

  const instructorBrief = await readFile(
    path.join(projectDirectory, 'kits/bloc-b-assistant-formateur/corriges/brief-cowork.md'),
    'utf8',
  );
  await writeFile(path.join(temp, 'sortie/brief-du-jour.md'), instructorBrief);
  assert.equal((await verifyCowork({ rootDirectory: temp, log: false })).ok, true);

  await writeFile(
    path.join(temp, 'sortie/brief-du-jour.md'),
    `${validBrief.replaceAll('inbox/02-reunion.md', 'source-absente.md')}\n`,
  );
  const missingSource = await verifyCowork({ rootDirectory: temp, log: false });
  assert.equal(missingSource.ok, false);
  assert.equal(missingSource.checks.find((check) => check.id === 'sources')?.ok, false);

  const sourceDump = validBrief.replace(/ \[sources?:[^\]]+\]/g, '')
    + '\n\nSources consultées : inbox/01-demandes.md, inbox/02-reunion.md, inbox/03-messages.md';
  await writeFile(path.join(temp, 'sortie/brief-du-jour.md'), `${sourceDump}\n`);
  const unassociatedSources = await verifyCowork({ rootDirectory: temp, log: false });
  assert.equal(unassociatedSources.ok, false);
  assert.equal(unassociatedSources.checks.find((check) => check.id === 'sources')?.ok, false);

  await writeFile(path.join(temp, 'sortie/brief-du-jour.md'), `${validBrief.replace('À confirmer', 'Décision prise')}\n`);
  const missingUncertainty = await verifyCowork({ rootDirectory: temp, log: false });
  assert.equal(missingUncertainty.ok, false);
  assert.equal(missingUncertainty.checks.find((check) => check.id === 'uncertainty')?.ok, false);

  const decidedElsewhere = [
    '# Brief du jour',
    '## Actions du jour',
    '- [N01] Envoyer l’agenda. [source: inbox/01-demandes.md]',
    '- [N06] Transmettre le nombre. [source: inbox/03-messages.md]',
    '- [N03] Retenir le 18 septembre. [source: inbox/02-reunion.md]',
    '- [N05] Écarter le 19 septembre. [source: inbox/03-messages.md]',
    '## À confirmer',
    '## Plus tard',
    '- [N02] Préparer les icônes. [source: inbox/01-demandes.md]',
    '- [N04] Archiver après validation. [source: inbox/02-reunion.md]',
  ].join('\n');
  await writeFile(path.join(temp, 'sortie/brief-du-jour.md'), `${decidedElsewhere}\n`);
  const emptyUncertainty = await verifyCowork({ rootDirectory: temp, log: false });
  assert.equal(emptyUncertainty.ok, false);
  assert.equal(emptyUncertainty.checks.find((check) => check.id === 'sources')?.ok, true);
  assert.equal(emptyUncertainty.checks.find((check) => check.id === 'uncertainty')?.ok, false);

  await writeFile(path.join(temp, 'sortie/brief-du-jour.md'), `${validBrief}\n`);
  await writeFile(path.join(temp, 'sortie/extra.md'), 'sortie non autorisée\n');
  const extraOutput = await verifyCowork({ rootDirectory: temp, log: false });
  assert.equal(extraOutput.ok, false);
  assert.equal(extraOutput.checks.find((check) => check.id === 'output')?.ok, false);
  await rm(path.join(temp, 'sortie/extra.md'), { force: true });

  await writeFile(path.join(temp, 'sortie/brief-du-jour.md'), `${validBrief}\n`);
  await writeFile(path.join(temp, 'inbox/01-demandes.md'), 'original modifié\n');
  const changedOriginal = await verifyCowork({ rootDirectory: temp, log: false });
  assert.equal(changedOriginal.ok, false);
  assert.equal(changedOriginal.checks.find((check) => check.id === 'fingerprints')?.ok, false);
});

test('la mini-page démarre avec un test passant et un test source à compléter', async () => {
  const codeDirectory = path.join(participantKitDirectory, 'code');
  const result = spawnSync(process.execPath, ['--test'], {
    cwd: codeDirectory,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const app = await readKit('code/app.mjs');
  const sourceTest = await readKit('code/brief.test.mjs');
  assert.doesNotMatch(app, /note\.source/);
  assert.match(app, /sortNotes/);
  assert.match(sourceTest, /test\.todo\('affiche la source sous chaque carte'\)/);
});

test('les corrigés formateur conservent les garanties des quatre outils', async () => {
  const correctionDirectory = path.join(
    projectDirectory,
    'kits/bloc-b-assistant-formateur/corriges',
  );
  const [chat, artifact, cowork, code] = await Promise.all([
    'brief-chat-6-lignes.md', 'artifact-correction.md',
    'brief-cowork.md', 'claude-code.patch',
  ].map((file) => readFile(path.join(correctionDirectory, file), 'utf8')));

  const chatLines = chat.split('\n').filter((line) => line.startsWith('- '));
  assert.equal(chatLines.length, 6);
  assert.ok(chatLines.every((line) => /\[source: inbox\//.test(line)));
  assert.match(chat, /## À confirmer/);
  assert.match(chat, /18 ou le 19 septembre/);

  assert.match(artifact, /confirmation/i);
  assert.match(artifact, /quatre tests/i);
  assert.match(artifact, /six cartes commencent dans `Aujourd’hui`/i);
  assert.match(cowork, /## À confirmer/);
  assert.match(cowork, /inbox\/01-demandes\.md/);
  assert.match(cowork, /inbox\/02-reunion\.md/);
  assert.match(cowork, /inbox\/03-messages\.md/);

  assert.match(code, /note\.source/);
  assert.match(code, /test TODO/i);
  assert.match(code, /Ne modifier ni sortNotes/i);
});

test('le ZIP public est déterministe, synchronisé et sans corrigé formateur', async () => {
  const first = await buildKitArchive();
  const second = await buildKitArchive();
  assert.deepEqual(first, second);

  const entries = Object.keys(unzipSync(first)).toSorted();
  assert.ok(entries.every((entry) => entry.startsWith('bloc-b-assistant/')));
  assert.ok(entries.some((entry) => entry.endsWith('/prompts/04-claude-code.md')));
  assert.ok(entries.some((entry) => entry.endsWith('/verify-cowork.mjs')));
  assert.ok(entries.some((entry) => entry.endsWith('/code/brief.test.mjs')));
  assert.ok(entries.every((entry) => !/formateur|corrig/i.test(entry)));

  const result = await checkKitArchive(path.join(projectDirectory, 'public/kits/bloc-b-assistant.zip'));
  assert.deepEqual(result, { ok: true, message: 'Kit Bloc B synchronisé.' });
});

test('le ZIP garde la même empreinte dans plusieurs fuseaux horaires', () => {
  const hashes = ['UTC', 'Europe/Paris', 'America/Los_Angeles'].map((timezone) => {
    const result = spawnSync(process.execPath, ['scripts/block-b-kit.mjs', '--hash'], {
      cwd: projectDirectory,
      encoding: 'utf8',
      env: { ...process.env, TZ: timezone },
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout.trim(), /^[a-f0-9]{64}$/);
    return result.stdout.trim();
  });

  assert.equal(new Set(hashes).size, 1, hashes.join('\n'));
});
