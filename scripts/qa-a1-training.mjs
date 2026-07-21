import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4376';
const failures = [];
let preview;

const stopPreview = () => {
  if (preview && !preview.killed) preview.kill('SIGTERM');
};
process.once('exit', stopPreview);
process.once('SIGINT', () => { stopPreview(); process.exit(130); });

if (!process.env.QA_BASE_URL) {
  preview = spawn(
    'node_modules/.bin/astro',
    ['preview', '--host', '127.0.0.1', '--port', '4376'],
    { stdio: 'ignore' },
  );
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
    try { ready = (await fetch(`${baseURL}/presenter/a1/a1-opening/`)).ok; } catch {}
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview indisponible sur ${baseURL}. Lancez d'abord npm run build.`);
}

const browser = await chromium.launch({ headless: true });

try {
  const motionContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await motionContext.addInitScript(() => {
    const tracked = new Set();
    const nativeSetTimeout = window.setTimeout.bind(window);
    const nativeClearTimeout = window.clearTimeout.bind(window);

    window.setTimeout = (handler, delay = 0, ...args) => {
      let timer;
      const wrapped = (...callbackArgs) => {
        tracked.delete(timer);
        if (typeof handler === 'function') handler(...callbackArgs);
      };
      timer = nativeSetTimeout(wrapped, delay, ...args);
      if (delay === 1200 || delay === 2200) tracked.add(timer);
      return timer;
    };
    window.clearTimeout = (timer) => {
      tracked.delete(timer);
      nativeClearTimeout(timer);
    };
    Object.defineProperty(window, 'trainingTimerCount', {
      get: () => tracked.size,
      configurable: true,
    });
  });

  const page = await motionContext.newPage();
  await page.goto(`${baseURL}/presenter/a1/a1-opening/`, { waitUntil: 'load' });
  const scene = page.locator('[data-training-playback]');
  const status = page.locator('[data-training-status]');
  const toggle = page.locator('[data-training-toggle]');

  const futureTokenStyles = await scene.locator('[data-training-token][data-revealed="false"]').evaluateAll((tokens) =>
    tokens.map((token) => {
      const style = getComputedStyle(token);
      return { color: style.color, transitionProperty: style.transitionProperty };
    }),
  );
  if (!futureTokenStyles.length) failures.push('aucun token futur mesurable avant autoplay');
  if (futureTokenStyles.some(({ color }) => color !== 'rgba(0, 0, 0, 0)')) {
    failures.push(`token futur lisible immédiatement : ${JSON.stringify(futureTokenStyles)}`);
  }
  if (futureTokenStyles.some(({ transitionProperty }) => /(?:^|,\s*)(?:all|color)(?:,|$)/.test(transitionProperty))) {
    failures.push(`transition anti-fuite invalide : ${JSON.stringify(futureTokenStyles)}`);
  }

  const initialStatus = (await status.textContent())?.trim();
  await page.waitForFunction(
    (initial) => document.querySelector('[data-training-status]')?.textContent?.trim() !== initial,
    initialStatus,
    { timeout: 2500 },
  );
  const autoplayStatus = (await status.textContent())?.trim();
  if (!autoplayStatus || autoplayStatus === initialStatus) failures.push('autoplay ne fait pas avancer la phase');

  await toggle.click();
  const pausedStatus = (await status.textContent())?.trim();
  await page.waitForTimeout(1350);
  if ((await status.textContent())?.trim() !== pausedStatus) failures.push('pause ne fige pas la démonstration');
  if ((await toggle.textContent())?.trim() !== 'Rejouer la démonstration') failures.push('libellé de reprise absent');

  await toggle.click();
  await page.waitForTimeout(1350);
  if ((await status.textContent())?.trim() === pausedStatus) failures.push('reprise ne relance pas la démonstration');

  if (await page.evaluate(() => window.trainingTimerCount) !== 1) failures.push('autoplay doit conserver exactement un timeout');
  await page.keyboard.press('Tab');
  await toggle.focus();
  const focus = await toggle.evaluate((button) => {
    const style = getComputedStyle(button);
    return { outlineColor: style.outlineColor, outlineStyle: style.outlineStyle };
  });
  if (focus.outlineColor !== 'rgb(159, 53, 29)' || focus.outlineStyle !== 'solid') {
    failures.push(`focus insuffisamment contrasté : ${focus.outlineColor} ${focus.outlineStyle}`);
  }

  for (let visit = 0; visit < 2; visit += 1) {
    await page.locator('[data-next]').click();
    await page.waitForURL('**/presenter/a1/a1-context/');
    if (await page.evaluate(() => window.trainingTimerCount) !== 0) failures.push(`timeout conservé après sortie ${visit + 1}`);
    await page.locator('[data-previous]').click();
    await page.waitForURL('**/presenter/a1/a1-opening/');
    await page.locator('[data-training-playback]').waitFor();
    if (await page.evaluate(() => window.trainingTimerCount) !== 1) failures.push(`timeouts multipliés à la revisite ${visit + 1}`);
  }
  if (!await scene.isVisible()) failures.push('scène absente après revisite');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(80);
  if (await scene.getAttribute('data-complete') !== 'true') failures.push('basculement dynamique reduce sans état final');
  if (await page.locator('[data-training-token][data-revealed="true"]').count() !== 7) failures.push('basculement dynamique reduce ne révèle pas les 7 tokens');
  if (!await toggle.isHidden()) failures.push('basculement dynamique reduce conserve le bouton');
  if (await page.evaluate(() => window.trainingTimerCount) !== 0) failures.push('basculement dynamique reduce conserve un timeout');
  await motionContext.close();

  const reducedContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${baseURL}/presenter/a1/a1-opening/`, { waitUntil: 'load' });
  const reducedScene = reducedPage.locator('[data-training-playback]');
  if (!await reducedScene.locator('.training-playback__sentence').isVisible()) failures.push('mouvement réduit masque la phrase');
  if (!await reducedScene.locator('.training-playback__cycle').isVisible()) failures.push('mouvement réduit masque le cycle');
  if (await reducedScene.locator('[data-training-phase]:visible').count() !== 3) failures.push('mouvement réduit masque des étapes');
  if (await reducedScene.getAttribute('data-complete') !== 'true') failures.push('mouvement réduit sans état final');
  if (await reducedPage.locator('[data-training-token][data-revealed="true"]').count() !== 7) failures.push('mouvement réduit ne révèle pas les 7 tokens');
  if (!await reducedPage.locator('[data-training-toggle]').isHidden()) failures.push('mouvement réduit conserve le bouton');
  await reducedContext.close();

  const noScriptContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    javaScriptEnabled: false,
  });
  const noScriptPage = await noScriptContext.newPage();
  await noScriptPage.goto(`${baseURL}/presenter/a1/a1-opening/`, { waitUntil: 'load' });
  const noScriptScene = noScriptPage.locator('[data-training-playback]');
  if (!await noScriptScene.locator('.training-playback__sentence').isVisible()) failures.push('no-JS masque la phrase');
  if (!await noScriptScene.locator('.training-playback__cycle').isVisible()) failures.push('no-JS masque le cycle');
  if (await noScriptScene.locator('[data-training-phase]:visible').count() !== 3) failures.push('no-JS masque des étapes');
  const sentence = (await noScriptScene.locator('.training-playback__sentence').textContent())?.replaceAll(/\s+/g, '');
  if (sentence !== 'Lesoleilréchauffedoucementlapierre.') failures.push(`phrase no-JS incomplète : ${sentence}`);
  if (!await noScriptPage.locator('[data-training-toggle]').isDisabled()) failures.push('bouton no-JS non désactivé');
  if (await noScriptScene.getAttribute('data-enhanced') !== null) failures.push('no-JS marqué comme enrichi');
  await noScriptContext.close();
} finally {
  await browser.close();
  stopPreview();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('QA A1 entraînement : autoplay, pause/reprise, focus, cleanup/revisites, mouvement réduit et no-JS validés.');
}
