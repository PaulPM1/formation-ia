import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('expose une entrée publique et les repères du thème kit de construction', async () => {
  const [home, layout, index, detail, styles, favicon, notFound] =
    await Promise.all([
      read('src/pages/index.astro'),
      read('src/layouts/BaseLayout.astro'),
      read('src/pages/briques/index.astro'),
      read('src/pages/briques/[id].astro'),
      read('src/styles/global.css'),
      read('public/favicon.svg'),
      read('src/pages/404.astro'),
    ]);

  assert.match(home, /Les briques du Vibe Coding/);
  assert.match(home, /href="\/briques\//);
  assert.match(layout, /rel="icon"/);
  assert.match(layout, /og:title/);
  assert.match(index, /data-family=/);
  assert.match(detail, /data-family=/);
  assert.match(styles, /--brick-yellow:/);
  assert.match(styles, /--brick-blue:/);
  assert.match(styles, /--brick-coral:/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(favicon, /<svg/);
  assert.match(notFound, /Page introuvable/);
});

test('expose le mode présentation dans la navigation et le workflow de contribution', async () => {
  const [layout, presentationLayout, packageJson, readme] = await Promise.all([
    read('src/layouts/BaseLayout.astro'),
    read('src/layouts/PresentationLayout.astro'),
    read('package.json'),
    read('README.md'),
  ]);

  assert.match(layout, /href="\/presenter\//);
  assert.match(layout, /isPresentation/);
  assert.match(presentationLayout, /presentation-site-nav/);
  assert.match(packageJson, /presentation:check/);
  assert.match(packageJson, /"typecheck":\s*"astro check"/);
  assert.match(packageJson, /"qa:presenter":\s*"node scripts\/qa-presenter\.mjs"/);
  assert.match(packageJson, /"build":\s*"npm run content:check && npm run presentation:check && npm run typecheck && astro build"/);
  assert.match(readme, /slide-visual-director/);
  assert.match(readme, /npm run typecheck/);
  assert.match(readme, /nombre de slides/i);
});

test('signale les pistes facultative et rattrapage par du texte sans réduire leur opacité', async () => {
  const [brickIndex, presenterIndex, presenterShell, globalStyles, presentationStyles] = await Promise.all([
    read('src/pages/briques/index.astro'),
    read('src/pages/presenter/index.astro'),
    read('src/components/presentation/PresenterShell.astro'),
    read('src/styles/global.css'),
    read('src/styles/presentation.css'),
  ]);

  assert.match(brickIndex, /class="brick-card"[^>]*data-priority=/s);
  assert.match(presenterIndex, /data-track=/);
  assert.match(presenterIndex, /Facultatif/);
  assert.match(presenterIndex, /Rattrapage/);
  assert.match(presenterShell, /data-track=/);
  assert.match(presenterShell, /Facultatif/);
  assert.match(presenterShell, /Rattrapage/);
  assert.match(globalStyles, /\.brick-card\[data-priority="facultatif"\]/);
  assert.match(globalStyles, /\.brick-card\[data-priority="rattrapage"\]/);
  assert.match(presentationStyles, /\[data-track="optional"\]/);
  assert.match(presentationStyles, /\[data-track="recovery"\]/);
  assert.match(presentationStyles, /\.presentation-heading__track/);
  assert.doesNotMatch(
    globalStyles.match(/\.brick-card\[data-priority="facultatif"\][\s\S]*?\}/)?.[0] ?? '',
    /opacity/,
  );
});

test('la 404 distingue les URL du présentateur après chargement sans mentir sans JavaScript', async () => {
  const notFound = await read('src/pages/404.astro');
  assert.match(notFound, /data-presenter-recovery/);
  assert.match(notFound, /location\.pathname\.startsWith\(['"]\/presenter\//);
  assert.match(notFound, /href="\/presenter\/"/);
  assert.match(notFound, /aria-live="polite"/);
  assert.match(notFound, /Slide introuvable/);
  assert.ok(
    notFound.indexOf("location.pathname.startsWith('/presenter/')") < notFound.lastIndexOf('</BaseLayout>'),
    'le script de détection doit rester dans le document fourni par BaseLayout',
  );
  assert.doesNotMatch(notFound.slice(notFound.lastIndexOf('</BaseLayout>') + '</BaseLayout>'.length), /<script>/);
});

test('le Bloc B monte un sélecteur progressif sans supprimer le contenu MDX', async () => {
  const [detail, switcher] = await Promise.all([
    read('src/pages/briques/[id].astro'),
    read('src/components/block-b/EcosystemSwitch.astro'),
  ]);

  assert.match(detail, /MIRRORED_BLOCK_B_IDS/);
  assert.match(detail, /<EcosystemSwitch/);
  assert.match(switcher, /type="radio"/);
  assert.match(switcher, /aria-live="polite"/);
  assert.match(switcher, /localStorage\.setItem/);
  assert.match(switcher, /data-block-b-panel/);
  assert.doesNotMatch(switcher, /onclick=/);
});
