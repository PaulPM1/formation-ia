import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { navigateAndWaitForFonts } from './qa-page-ready.mjs';

const projectDirectory = fileURLToPath(new URL('..', import.meta.url));
const presenterDirectory = path.join(projectDirectory, 'dist/presenter');
const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4380';
const failures = [];
const removedBlockBRoutes = [
  '/presenter/b0/b0-diagnostic/', '/presenter/b0/b0-fallback/', '/presenter/b0/b0-ready/',
  '/presenter/b1/b1-builder/',
  '/presenter/b2/b2-anatomy/', '/presenter/b2/b2-tests/',
  '/presenter/b3/b3-permissions/', '/presenter/b3/b3-observe/',
  '/presenter/b4/b4-permission/', '/presenter/b4/b4-transition/',
  '/presenter/b4-bis/b4bis-triptych/', '/presenter/b4-bis/b4bis-path/',
];
let preview;

// The generated route inventory is the static-host equivalent of PRESENTATION_SLIDES.
async function collectPresenterPages(directory, relative = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const pages = [];
  for (const entry of entries) {
    const nextRelative = path.join(relative, entry.name);
    if (entry.isDirectory()) pages.push(...await collectPresenterPages(path.join(directory, entry.name), nextRelative));
    else if (entry.name === 'index.html') pages.push(nextRelative);
  }
  return pages;
}

const stopPreview = () => {
  if (preview && !preview.killed) preview.kill('SIGTERM');
};
process.once('exit', stopPreview);
process.once('SIGINT', () => { stopPreview(); process.exit(130); });

if (!process.env.QA_BASE_URL) {
  preview = spawn(
    path.join(projectDirectory, 'node_modules/.bin/astro'),
    ['preview', '--host', '127.0.0.1', '--port', '4380'],
    { cwd: projectDirectory, stdio: 'ignore' },
  );
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
    try { ready = (await fetch(`${baseURL}/presenter/`)).ok; } catch {}
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview indisponible sur ${baseURL}. Lancez d’abord npm run build.`);
}

const generatedPages = await collectPresenterPages(presenterDirectory);
const slideRoutes = generatedPages
  .filter((page) => page !== 'index.html')
  .map((page) => `/presenter/${page.replaceAll(path.sep, '/').replace(/\/index\.html$/, '')}`)
  .toSorted();

if (slideRoutes.length !== 110) failures.push(`inventaire slides ${slideRoutes.length}/110`);
if (generatedPages.length !== 111) failures.push(`inventaire présentateur ${generatedPages.length}/111`);
for (const route of removedBlockBRoutes) {
  const response = await fetch(`${baseURL}${route}`, { redirect: 'manual' });
  if (response.status !== 404 || response.headers.has('location')) {
    failures.push(`ancienne route ${route} : statut ${response.status}, redirection ${response.headers.get('location') ?? 'absente'}`);
  }
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });

const inspectHorizontalLayout = async (page) => page.evaluate(() => {
  const viewportWidth = window.innerWidth;
  const documentClientWidth = document.documentElement.clientWidth;
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
  };
  const offenders = [...document.body.querySelectorAll('*')]
    .filter((element) => visible(element) && !element.classList.contains('visually-hidden'))
    .map((element) => ({
      name: `${element.tagName.toLowerCase()}${typeof element.className === 'string' && element.className ? `.${element.className.trim().replace(/\s+/g, '.')}` : ''}`,
      left: element.getBoundingClientRect().left,
      right: element.getBoundingClientRect().right,
    }))
    .filter(({ left, right }) => left < -1 || right > viewportWidth + 1)
    .slice(0, 8);
  return {
    viewportWidth,
    documentClientWidth,
    documentWidth: document.documentElement.scrollWidth,
    offenders,
  };
});

try {
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  for (const route of slideRoutes) {
    const { response } = await navigateAndWaitForFonts(mobilePage, `${baseURL}${route}`);
    if (!response?.ok()) {
      failures.push(`${route} HTTP ${response?.status() ?? 'absent'}`);
      continue;
    }
    const layout = await inspectHorizontalLayout(mobilePage);
    if (layout.documentWidth > layout.documentClientWidth + 1 || layout.offenders.length) {
      failures.push(`${route} mobile ${layout.documentClientWidth}/${layout.documentWidth}px ${layout.offenders.map((item) => `${item.name}:${item.left.toFixed(1)}..${item.right.toFixed(1)}`).join(', ')}`);
    }
  }
  await mobileContext.close();

  const controllerContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const controllerPage = await controllerContext.newPage();
  const pageErrors = [];
  controllerPage.on('pageerror', (error) => pageErrors.push(error.message));

  await navigateAndWaitForFonts(controllerPage, `${baseURL}/presenter/`);
  const optionalLabels = controllerPage.locator('.presentation-family-list [data-track="optional"] .track-label');
  const recoveryLabels = controllerPage.locator('.presentation-family-list [data-track="recovery"] .track-label');
  if (await optionalLabels.count() !== 1 || (await optionalLabels.first().textContent())?.trim() !== 'Facultatif') {
    failures.push('sommaire présentateur : badge Facultatif unique attendu');
  }
  if (await recoveryLabels.count() !== 1 || (await recoveryLabels.first().textContent())?.trim() !== 'Rattrapage') {
    failures.push('sommaire présentateur : badge Rattrapage unique attendu');
  }

  await navigateAndWaitForFonts(controllerPage, `${baseURL}/presenter/b3/b3-check/`);
  const requiredNext = controllerPage.locator('[data-next]');
  if (await requiredNext.getAttribute('href') !== '/presenter/c1/c1-repeat/') {
    failures.push('parcours principal : B3 ne pointe pas directement vers C1');
  }
  await Promise.all([
    controllerPage.waitForURL('**/presenter/c1/c1-repeat/', { waitUntil: 'domcontentloaded' }),
    requiredNext.click({ noWaitAfter: true }),
  ]);
  const requiredPrevious = controllerPage.locator('[data-previous]');
  if (await requiredPrevious.getAttribute('href') !== '/presenter/b3/b3-check/') {
    failures.push('parcours principal : C1 ne revient pas directement vers B3');
  }

  await navigateAndWaitForFonts(controllerPage, `${baseURL}/presenter/b4/b4-context/`);
  const optionalHeading = controllerPage.locator('.presentation-heading__track');
  if (!await optionalHeading.isVisible() || (await optionalHeading.textContent())?.trim() !== 'Facultatif') {
    failures.push('branche facultative : repère de slide absent sur B4');
  }

  await navigateAndWaitForFonts(controllerPage, `${baseURL}/presenter/b4/b4-test/`);
  if (await controllerPage.locator('[data-next]').getAttribute('href') !== '/presenter/c1/c1-repeat/') {
    failures.push('branche facultative : B4 ne rejoint pas C1');
  }

  await navigateAndWaitForFonts(controllerPage, `${baseURL}/presenter/b4-bis/b4bis-install/`);
  const recoveryHeading = controllerPage.locator('.presentation-heading__track');
  if (!await recoveryHeading.isVisible() || (await recoveryHeading.textContent())?.trim() !== 'Rattrapage') {
    failures.push('rattrapage : repère de slide absent sur B4-bis');
  }
  if (await controllerPage.locator('[data-previous]').count()) failures.push('rattrapage : la première slide possède un précédent');
  await navigateAndWaitForFonts(controllerPage, `${baseURL}/presenter/b4-bis/b4bis-checkpoint/`);
  if (await controllerPage.locator('[data-next]').count()) failures.push('rattrapage : la dernière slide possède une suivante');

  await navigateAndWaitForFonts(controllerPage, `${baseURL}/presenter/a4/a4-mission/`);
  const summary = controllerPage.locator('.mission-board__correction summary');
  const details = controllerPage.locator('.mission-board__correction');
  const summaryURL = controllerPage.url();
  await summary.focus();
  await controllerPage.keyboard.press('Space');
  if (await details.getAttribute('open') === null) failures.push('summary Space n’ouvre pas details');
  if (controllerPage.url() !== summaryURL) failures.push('summary Space déclenche la navigation globale');
  await controllerPage.keyboard.press('Space');
  await controllerPage.keyboard.press('Enter');
  if (await details.getAttribute('open') === null) failures.push('summary Enter n’ouvre pas details');
  if (controllerPage.url() !== summaryURL) failures.push('summary Enter déclenche la navigation globale');

  await navigateAndWaitForFonts(controllerPage, `${baseURL}/presenter/a4/a4-risk/`);
  const riskURL = controllerPage.url();
  const radio = controllerPage.locator('input[type="radio"]').first();
  await radio.focus();
  await controllerPage.keyboard.press('ArrowRight');
  await controllerPage.keyboard.press('Space');
  if (controllerPage.url() !== riskURL) failures.push('touches radio déclenchent la navigation globale');
  const resourceLink = controllerPage.locator('.resource-rail a').first();
  await resourceLink.focus();
  await controllerPage.keyboard.press('Space');
  if (controllerPage.url() !== riskURL) failures.push('Space sur lien déclenche la navigation globale');

  const fullscreenButton = controllerPage.locator('[data-presenter-fullscreen]');
  if (await fullscreenButton.getAttribute('aria-pressed') !== 'false') failures.push('plein écran aria-pressed initial incorrect');
  await fullscreenButton.click();
  await controllerPage.waitForFunction(() => Boolean(document.fullscreenElement));
  if (await fullscreenButton.getAttribute('aria-pressed') !== 'true') failures.push('fullscreenchange ne met pas aria-pressed à true');
  if ((await fullscreenButton.textContent())?.trim() !== 'Quitter le plein écran') failures.push('libellé de sortie plein écran absent');
  await controllerPage.evaluate(async () => { await document.exitFullscreen(); });
  await controllerPage.waitForFunction(() => !document.fullscreenElement
    && document.querySelector('[data-presenter-fullscreen]')?.getAttribute('aria-pressed') === 'false');
  if (await fullscreenButton.getAttribute('aria-pressed') !== 'false') failures.push('fullscreenchange ne restaure pas aria-pressed');

  await controllerPage.evaluate(() => {
    document.documentElement.requestFullscreen = () => Promise.reject(new Error('refus simulé'));
  });
  await fullscreenButton.click();
  await controllerPage.waitForFunction(() => (document.querySelector('[data-presenter-announcer]')?.textContent ?? '').includes('n’a pas pu'));
  if (pageErrors.length) failures.push(`rejet plein écran non géré : ${pageErrors.join(', ')}`);

  for (const [pathname, expectedTitle] of [
    ['/presenter/a9/unknown-slide/', 'Slide introuvable'],
    ['/generic-unknown/', 'Page introuvable'],
  ]) {
    const { response } = await navigateAndWaitForFonts(controllerPage, `${baseURL}${pathname}`);
    if (response?.status() !== 404) failures.push(`${pathname} statut ${response?.status() ?? 'absent'} au lieu de 404`);
    if ((await controllerPage.locator('h1').textContent())?.trim() !== expectedTitle) failures.push(`${pathname} récupération 404 incorrecte`);
    if (!await controllerPage.locator('.error-copy a[href="/presenter/"]').isVisible()) failures.push(`${pathname} lien vers le sommaire absent`);
  }

  const noScriptContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    javaScriptEnabled: false,
  });
  const noScriptPage = await noScriptContext.newPage();
  for (const pathname of ['/presenter/a9/unknown-slide/', '/generic-unknown/']) {
    const { response } = await navigateAndWaitForFonts(noScriptPage, `${baseURL}${pathname}`);
    if (response?.status() !== 404) failures.push(`${pathname} no-JS statut ${response?.status() ?? 'absent'} au lieu de 404`);
    if ((await noScriptPage.locator('h1').textContent())?.trim() !== 'Page introuvable') failures.push(`${pathname} no-JS devrait conserver le message générique`);
    if (!await noScriptPage.locator('.error-copy a[href="/presenter/"]').isVisible()) failures.push(`${pathname} no-JS lien vers le présentateur absent`);
    if (await noScriptPage.locator('[data-presenter-recovery]').isVisible()) failures.push(`${pathname} no-JS affiche une détection non exécutée`);
  }
  await noScriptContext.close();

  for (const route of [
    '/presenter/a4/a4-risk/',
    '/presenter/b2/b2-mission/',
    '/presenter/c2/c2-permissions/',
  ]) {
    await navigateAndWaitForFonts(controllerPage, `${baseURL}${route}`);
    await controllerPage.evaluate(() => { document.documentElement.style.zoom = '2'; });
    const layout = await inspectHorizontalLayout(controllerPage);
    if (layout.documentWidth > layout.documentClientWidth + 1 || layout.offenders.length) failures.push(`${route} zoom 200 % déborde`);
    await controllerPage.evaluate(() => { document.documentElement.style.zoom = '1'; });
    await controllerPage.emulateMedia({ reducedMotion: 'reduce' });
    const animationName = await controllerPage.locator('.presentation-stage').evaluate((element) => getComputedStyle(element, '::before').animationName);
    if (animationName !== 'none') failures.push(`${route} mouvement réduit conserve ${animationName}`);
    await controllerPage.emulateMedia({ reducedMotion: 'no-preference', media: 'print' });
    if (await controllerPage.locator('.presentation-controls').evaluate((element) => getComputedStyle(element).display) !== 'none') failures.push(`${route} contrôles visibles à l’impression`);
    await controllerPage.emulateMedia({ media: 'screen' });
  }
  await controllerContext.close();
} finally {
  await browser.close();
  stopPreview();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('QA présentateur : 110/110 routes mobiles, trois pistes, 12 anciennes routes en 404 sans redirection, contrôleur natif, plein écran, zoom, mouvement réduit et impression validés ; 111 pages générées.');
}
