import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { unzipSync, zipSync } from 'fflate';

const projectDirectory = fileURLToPath(new URL('..', import.meta.url));
export const participantKitDirectory = path.join(projectDirectory, 'kits/bloc-b-assistant');
export const publicArchivePath = path.join(projectDirectory, 'public/kits/bloc-b-assistant.zip');
// fflate writes ZIP date fields with local-calendar getters. Constructing the
// same local date in every process keeps the archive stable across TZ values.
const fixedMtime = new Date(2000, 0, 1, 0, 0, 0);

async function listFiles(directory, relative = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name, 'en'))) {
    if (entry.name === '.DS_Store') continue;
    const relativePath = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path.join(directory, entry.name), relativePath));
    if (entry.isFile()) files.push(relativePath);
  }
  return files;
}

export async function buildKitArchive() {
  const files = await listFiles(participantKitDirectory);
  const input = {};
  for (const relativePath of files) {
    const archivePath = path.posix.join('bloc-b-assistant', relativePath.split(path.sep).join('/'));
    input[archivePath] = [
      new Uint8Array(await readFile(path.join(participantKitDirectory, relativePath))),
      { mtime: fixedMtime },
    ];
  }
  return zipSync(input, { level: 9 });
}

export async function writeKitArchive(archivePath = publicArchivePath) {
  const archive = await buildKitArchive();
  await mkdir(path.dirname(archivePath), { recursive: true });
  await writeFile(archivePath, archive);
  return archive;
}

export async function checkKitArchive(archivePath = publicArchivePath) {
  let actual;
  try {
    actual = new Uint8Array(await readFile(archivePath));
  } catch {
    return { ok: false, message: `Archive absente : ${path.relative(projectDirectory, archivePath)}` };
  }
  const expected = await buildKitArchive();
  if (!Buffer.from(actual).equals(Buffer.from(expected))) {
    return { ok: false, message: 'Le ZIP public ne correspond pas au kit participant. Lancez npm run kit:block-b.' };
  }

  const entries = Object.keys(unzipSync(actual));
  const forbidden = entries.find((entry) => /formateur|corrig/i.test(entry));
  if (forbidden) return { ok: false, message: `Fichier formateur interdit dans le ZIP : ${forbidden}` };
  if (!entries.length || entries.some((entry) => !entry.startsWith('bloc-b-assistant/'))) {
    return { ok: false, message: 'Structure du ZIP Bloc B invalide.' };
  }
  return { ok: true, message: 'Kit Bloc B synchronisé.' };
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  if (process.argv.includes('--hash')) {
    const archive = await buildKitArchive();
    console.log(createHash('sha256').update(archive).digest('hex'));
  } else if (process.argv.includes('--check')) {
    const result = await checkKitArchive();
    console.log(result.message);
    if (!result.ok) process.exitCode = 1;
  } else {
    const archive = await writeKitArchive();
    console.log(`Kit Bloc B généré : ${path.relative(projectDirectory, publicArchivePath)} (${archive.byteLength} octets).`);
  }
}
