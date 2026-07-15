import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const projectDirectory = fileURLToPath(new URL('..', import.meta.url));

function currentPageHrefs(html: string): string[] {
  return Array.from(
    html.matchAll(/<a\b(?=[^>]*\baria-current="page")(?=[^>]*\bhref="([^"]+)")[^>]*>/g),
    ([, href]) => href,
  );
}

test('le HTML généré expose la navigation active sur l’index et une slide', async () => {
  const outputDirectory = await mkdtemp(path.join(tmpdir(), 'formation-ia-presenter-'));

  try {
    await execFileAsync(
      path.join(projectDirectory, 'node_modules/.bin/astro'),
      ['build', '--outDir', outputDirectory],
      { cwd: projectDirectory },
    );

    const [home, bricks, presenter, slide] = await Promise.all([
      readFile(path.join(outputDirectory, 'index.html'), 'utf8'),
      readFile(path.join(outputDirectory, 'briques/index.html'), 'utf8'),
      readFile(path.join(outputDirectory, 'presenter/index.html'), 'utf8'),
      readFile(path.join(
        outputDirectory,
        'presenter/a1/a1-opening/index.html',
      ), 'utf8'),
    ]);

    for (const html of [presenter, slide]) {
      assert.match(html, /class="presentation-site-nav"/);
      assert.match(html, /href="\/presenter\/"/);
      assert.match(html, /Retour au site<\/a>/);
      assert.deepEqual(currentPageHrefs(html), ['/presenter/']);
    }

    assert.deepEqual(currentPageHrefs(home), ['/']);
    assert.deepEqual(currentPageHrefs(bricks), ['/briques/']);
    assert.doesNotMatch(
      home,
      /href="\/presenter\/"[^>]*aria-current="page"/,
    );
    assert.doesNotMatch(
      bricks,
      /href="\/presenter\/"[^>]*aria-current="page"/,
    );
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
});
