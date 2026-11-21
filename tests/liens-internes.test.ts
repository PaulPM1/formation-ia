import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFile(new URL(path, root), 'utf8');

async function listFiles(directory: string, extension: string) {
  const entries = await readdir(new URL(directory, root), { recursive: true });
  return entries
    .filter((entry) => entry.endsWith(extension))
    .map((entry) => `${directory}${entry}`);
}

const REMOVED_TARGETS =
  /\/briques\/(b0|b1|b2|b3|b4|b4-bis|e4)\b|\/atelier\/projets\/|\/presenter\/(b|e4)|bloc-b-assistant\.zip/;

test('aucun lien interne ne pointe vers une page supprimée', async () => {
  const files = (await Promise.all([
    listFiles('src/content/', '.mdx'),
    listFiles('src/presentation/manifests/', '.ts'),
    listFiles('src/parcours/manifests/', '.ts'),
    listFiles('src/pages/', '.astro'),
  ])).flat();

  assert.ok(files.length > 0);
  for (const file of files) {
    assert.doesNotMatch(await read(file), REMOVED_TARGETS, file);
  }
});

test('chaque script npm lance un fichier qui existe', async () => {
  const { scripts } = JSON.parse(await read('package.json')) as {
    scripts: Record<string, string>;
  };

  for (const [name, command] of Object.entries(scripts)) {
    const target = command.match(/^(?:node|tsx) (\S+)/)?.[1];
    if (!target || target.startsWith('-')) continue;
    assert.ok(existsSync(new URL(target, root)), `${name} → ${target}`);
  }
});
