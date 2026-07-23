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
import { verifyMissionAgent } from '../kits/bloc-b-assistant/mission-agent/verify-brief.mjs';
import { briefContractCases } from './helpers/block-b-brief-cases';

const projectDirectory = fileURLToPath(new URL('..', import.meta.url));

const readKit = (relativePath: string) => readFile(
  path.join(participantKitDirectory, relativePath),
  'utf8',
);

test('le kit partage trois notes et une mission agent autonome sans prompts', async () => {
  const notes = await Promise.all([
    'notes/demandes.md',
    'notes/reunion.md',
    'notes/messages.md',
  ].map(readKit));
  const agentSources = await Promise.all([
    'mission-agent/sources/demandes.md',
    'mission-agent/sources/reunion.md',
    'mission-agent/sources/messages.md',
  ].map(readKit));

  assert.deepEqual(agentSources, notes);
  assert.match(await readKit('LIRE-EN-PREMIER.md'), /Kit d’entraînement du Bloc B/);
  const contract = await readKit('mission-agent/brief-contract.mjs');
  const verifier = await readKit('mission-agent/verify-brief.mjs');
  const browserValidator = await readFile(
    path.join(projectDirectory, 'src/features/block-b/brief-validator.ts'),
    'utf8',
  );
  assert.doesNotMatch(contract, /node:/);
  assert.match(verifier, /from '.\/brief-contract\.mjs'/);
  assert.match(browserValidator, /brief-contract\.mjs/);
  await assert.rejects(readKit('prompts/01-chat.md'));

  const noteIds = notes.flatMap((content) => [...content.matchAll(/\[N\d{2}\]/g)].map(([id]) => id));
  assert.deepEqual(noteIds, ['[N01]', '[N02]', '[N03]', '[N04]', '[N05]', '[N06]']);
  assert.match(notes.join('\n'), /18 septembre/);
  assert.match(notes.join('\n'), /19 septembre/);
});

test('le vérificateur de mission agent accepte le cas conforme et refuse les sorties adversariales', async (t) => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'bloc-b-cowork-'));
  await cp(participantKitDirectory, temp, { recursive: true });
  t.after(() => rm(temp, { recursive: true, force: true }));

  const validBrief = [
    '# Brief du jour',
    '## Actions du jour',
    '- [N01] Envoyer l’agenda. [source: demandes.md]',
    '- [N06] Transmettre le nombre. [source: messages.md]',
    '## À confirmer',
    '- [N03, N05] Confirmer le 18 ou le 19 septembre. [sources: reunion.md ; messages.md]',
    '## Plus tard',
    '- [N02] Préparer les icônes. [source: demandes.md]',
    '- [N04] Archiver après validation. [source: reunion.md]',
  ].join('\n');
  await writeFile(path.join(temp, 'mission-agent/sortie/brief-du-jour.md'), `${validBrief}\n`);

  const valid = await verifyMissionAgent({
    rootDirectory: path.join(temp, 'mission-agent'),
    log: false,
  });
  assert.equal(valid.ok, true);
  assert.deepEqual(valid.checks.map((check) => check.ok), [true, true, true, true]);

  for (const briefCase of briefContractCases) {
    await writeFile(
      path.join(temp, 'mission-agent/sortie/brief-du-jour.md'),
      briefCase.markdown,
    );
    const result = await verifyMissionAgent({
      rootDirectory: path.join(temp, 'mission-agent'),
      log: false,
    });
    assert.equal(
      result.checks.find((check) => check.id === 'output')?.ok,
      briefCase.expected.structure,
      `${briefCase.name} : structure`,
    );
    assert.equal(
      result.checks.find((check) => check.id === 'sources')?.ok,
      briefCase.expected.sources,
      `${briefCase.name} : sources`,
    );
    assert.equal(
      result.checks.find((check) => check.id === 'uncertainty')?.ok,
      briefCase.expected.uncertainty,
      `${briefCase.name} : uncertainty`,
    );
  }

  const instructorBrief = await readFile(
    path.join(projectDirectory, 'kits/bloc-b-assistant-formateur/corriges/brief-agent.md'),
    'utf8',
  );
  await writeFile(path.join(temp, 'mission-agent/sortie/brief-du-jour.md'), instructorBrief);
  assert.equal((await verifyMissionAgent({
    rootDirectory: path.join(temp, 'mission-agent'),
    log: false,
  })).ok, true);

  await writeFile(
    path.join(temp, 'mission-agent/sortie/brief-du-jour.md'),
    `${validBrief.replaceAll('reunion.md', 'source-absente.md')}\n`,
  );
  const missingSource = await verifyMissionAgent({
    rootDirectory: path.join(temp, 'mission-agent'),
    log: false,
  });
  assert.equal(missingSource.ok, false);
  assert.equal(missingSource.checks.find((check) => check.id === 'sources')?.ok, false);

  const sourceDump = validBrief.replace(/ \[sources?:[^\]]+\]/g, '')
    + '\n\nSources consultées : demandes.md, reunion.md, messages.md';
  await writeFile(path.join(temp, 'mission-agent/sortie/brief-du-jour.md'), `${sourceDump}\n`);
  const unassociatedSources = await verifyMissionAgent({
    rootDirectory: path.join(temp, 'mission-agent'),
    log: false,
  });
  assert.equal(unassociatedSources.ok, false);
  assert.equal(unassociatedSources.checks.find((check) => check.id === 'sources')?.ok, false);

  await writeFile(
    path.join(temp, 'mission-agent/sortie/brief-du-jour.md'),
    `${validBrief.replace('À confirmer', 'Décision prise')}\n`,
  );
  const missingUncertainty = await verifyMissionAgent({
    rootDirectory: path.join(temp, 'mission-agent'),
    log: false,
  });
  assert.equal(missingUncertainty.ok, false);
  assert.equal(missingUncertainty.checks.find((check) => check.id === 'uncertainty')?.ok, false);

  const decidedElsewhere = [
    '# Brief du jour',
    '## Actions du jour',
    '- [N01] Envoyer l’agenda. [source: demandes.md]',
    '- [N06] Transmettre le nombre. [source: messages.md]',
    '- [N03] Retenir le 18 septembre. [source: reunion.md]',
    '- [N05] Écarter le 19 septembre. [source: messages.md]',
    '## À confirmer',
    '## Plus tard',
    '- [N02] Préparer les icônes. [source: demandes.md]',
    '- [N04] Archiver après validation. [source: reunion.md]',
  ].join('\n');
  await writeFile(
    path.join(temp, 'mission-agent/sortie/brief-du-jour.md'),
    `${decidedElsewhere}\n`,
  );
  const emptyUncertainty = await verifyMissionAgent({
    rootDirectory: path.join(temp, 'mission-agent'),
    log: false,
  });
  assert.equal(emptyUncertainty.ok, false);
  assert.equal(emptyUncertainty.checks.find((check) => check.id === 'sources')?.ok, true);
  assert.equal(emptyUncertainty.checks.find((check) => check.id === 'uncertainty')?.ok, false);

  await writeFile(path.join(temp, 'mission-agent/sortie/brief-du-jour.md'), `${validBrief}\n`);
  await writeFile(path.join(temp, 'mission-agent/sortie/extra.md'), 'sortie non autorisée\n');
  const extraOutput = await verifyMissionAgent({
    rootDirectory: path.join(temp, 'mission-agent'),
    log: false,
  });
  assert.equal(extraOutput.ok, false);
  assert.equal(extraOutput.checks.find((check) => check.id === 'output')?.ok, false);
  await rm(path.join(temp, 'mission-agent/sortie/extra.md'), { force: true });

  await writeFile(path.join(temp, 'mission-agent/sortie/brief-du-jour.md'), `${validBrief}\n`);
  await writeFile(path.join(temp, 'mission-agent/sources/demandes.md'), 'original modifié\n');
  const changedOriginal = await verifyMissionAgent({
    rootDirectory: path.join(temp, 'mission-agent'),
    log: false,
  });
  assert.equal(changedOriginal.ok, false);
  assert.equal(changedOriginal.checks.find((check) => check.id === 'fingerprints')?.ok, false);
});

test('la mini-page démarre avec un test passant et un test source à compléter', async () => {
  const codeDirectory = path.join(participantKitDirectory, 'mini-application');
  const result = spawnSync(process.execPath, ['--test'], {
    cwd: codeDirectory,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const app = await readKit('mini-application/app.mjs');
  const sourceTest = await readKit('mini-application/brief.test.mjs');
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
    'brief-chat.md', 'objet-correction.md',
    'brief-agent.md', 'agent-code.patch',
  ].map((file) => readFile(path.join(correctionDirectory, file), 'utf8')));

  const chatLines = chat.split('\n').filter((line) => line.startsWith('- '));
  const chatNoteIds = chatLines.flatMap((line) => (
    [...line.matchAll(/\bN\d{2}\b/g)].map(([noteId]) => noteId)
  ));
  assert.deepEqual(chatNoteIds.toSorted(), ['N01', 'N02', 'N03', 'N04', 'N05', 'N06']);
  assert.ok(chatLines.every((line) =>
    /\[sources?: (?:demandes|reunion|messages)\.md/.test(line)));
  assert.doesNotMatch(chat, /inbox\//);
  assert.match(chat, /## À confirmer/);
  assert.match(chat, /18 ou le 19 septembre/);

  assert.match(artifact, /confirmation/i);
  assert.match(artifact, /cinq tests/i);
  assert.match(artifact, /six cartes commencent dans `Aujourd’hui`/i);
  for (const gesture of [
    /six cartes visibles/i,
    /déplacement vers `Plus tard`/i,
    /archivage/i,
    /total toujours égal à six/i,
    /remise à zéro avec six cartes dans `Aujourd’hui`/i,
  ]) assert.match(artifact, gesture);
  assert.match(cowork, /## À confirmer/);
  assert.match(cowork, /demandes\.md/);
  assert.match(cowork, /reunion\.md/);
  assert.match(cowork, /messages\.md/);
  assert.doesNotMatch(cowork, /inbox\//);

  assert.match(code, /note\.source/);
  assert.match(code, /test TODO/i);
  assert.match(code, /Ne modifier ni sortNotes/i);
});

test('le repli B2 fait rejouer explicitement les cinq tests de la fiche', async () => {
  const fallback = await readFile(
    path.join(projectDirectory, 'kits/bloc-b-assistant-formateur/replis.md'),
    'utf8',
  );
  const b2Fallback = fallback.match(/## B2\s+([\s\S]*?)(?=\n## B3)/)?.[1] ?? '';

  assert.match(b2Fallback, /cinq tests/i);
  for (const gesture of [
    /six cartes visibles/i,
    /déplacement vers `Plus tard`/i,
    /archivage/i,
    /total toujours égal à six/i,
    /remise à zéro avec six cartes dans `Aujourd’hui`/i,
  ]) assert.match(b2Fallback, gesture);
});

test('le ZIP public est déterministe, synchronisé et sans corrigé formateur', async () => {
  const first = await buildKitArchive();
  const second = await buildKitArchive();
  assert.deepEqual(first, second);

  const entries = Object.keys(unzipSync(first)).toSorted();
  assert.ok(entries.every((entry) => entry.startsWith('bloc-b-assistant/')));
  assert.ok(entries.some((entry) => entry.endsWith('/notes/demandes.md')));
  assert.ok(entries.some((entry) => entry.endsWith('/mission-agent/brief-contract.mjs')));
  assert.ok(entries.some((entry) => entry.endsWith('/mission-agent/verify-brief.mjs')));
  assert.ok(entries.some((entry) => entry.endsWith('/mini-application/brief.test.mjs')));
  assert.ok(entries.every((entry) => !entry.includes('/prompts/')));
  assert.ok(entries.every((entry) => !/formateur|corrig/i.test(entry)));

  const result = await checkKitArchive(path.join(projectDirectory, 'public/kits/bloc-b-assistant.zip'));
  assert.deepEqual(result, { ok: true, message: 'Kit d’entraînement du Bloc B synchronisé.' });
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
