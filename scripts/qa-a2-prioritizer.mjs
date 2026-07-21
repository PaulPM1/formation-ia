import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4382';
const route = '/presenter/a2/a2-prioritize/';
const failures = [];
let preview;

const stopPreview = () => {
  if (preview && !preview.killed) preview.kill('SIGTERM');
};
process.once('exit', stopPreview);
process.once('SIGINT', () => { stopPreview(); process.exit(130); });

if (!process.env.QA_BASE_URL) {
  preview = spawn('node_modules/.bin/astro', ['preview', '--host', '127.0.0.1', '--port', '4382'], { stdio: 'ignore' });
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
    try { ready = (await fetch(`${baseURL}${route}`)).ok; } catch {}
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview indisponible sur ${baseURL}. Lancez d’abord npm run build.`);
}

const inspectOverflow = (page) => page.evaluate(() => ({
  clientWidth: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
  stageClientWidth: document.querySelector('.presentation-slide')?.clientWidth ?? 0,
  stageScrollWidth: document.querySelector('.presentation-slide')?.scrollWidth ?? 0,
}));

const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const desktop = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    reducedMotion: 'reduce',
  });
  const page = await desktop.newPage();
  await page.goto(`${baseURL}${route}`, { waitUntil: 'load' });

  const form = page.locator('[data-solution-prioritizer]');
  if (await form.getAttribute('data-enhanced') !== 'true') failures.push('prioriteur non amélioré par JavaScript');
  if (await page.locator('[data-prioritizer-scenario]:visible').count() !== 1) failures.push('plus d’une situation visible au départ');

  await page.locator('[data-prioritizer-validate]:visible').click();
  if (await page.locator('[data-prioritizer-correction]:visible').count() !== 0) failures.push('correction révélée sans choix');

  const choices = ['chatgpt-chat', 'claude-code', 'chatgpt-work', 'claude-code'];
  for (let index = 0; index < choices.length; index += 1) {
    const scenario = page.locator('[data-prioritizer-scenario]:visible');
    const radio = scenario.locator(`input[value="${choices[index]}"]`);
    await radio.focus();
    await page.keyboard.press('Space');
    if (!await radio.isChecked()) failures.push(`situation ${index + 1} non sélectionnable au clavier`);
    await scenario.locator('[data-prioritizer-validate]').click();
    if (!await scenario.locator('[data-prioritizer-correction]').isVisible()) failures.push(`correction ${index + 1} absente`);
    const status = await page.locator('[data-prioritizer-status]').textContent();
    if (!status?.trim()) failures.push(`feedback annoncé absent à l’étape ${index + 1}`);
    await scenario.locator('[data-prioritizer-next]').click();
  }

  const summary = page.locator('[data-prioritizer-summary]');
  if (!await summary.isVisible()) failures.push('bilan final absent');
  if ((await page.locator('[data-prioritizer-score]').textContent())?.trim() !== '3') failures.push('score final attendu 3/4 absent');
  await page.locator('[data-prioritizer-replay]').click();
  if (await summary.isVisible()) failures.push('replay ne masque pas le bilan');
  if (await page.locator('[data-prioritizer-scenario]:visible').getAttribute('data-prioritizer-scenario') !== '0') failures.push('replay ne revient pas au premier cas');

  const reducedDurations = await form.evaluate((element) => [...element.querySelectorAll('*')]
    .map((child) => getComputedStyle(child).animationDuration)
    .filter((duration) => duration && !['0s', '0.001ms', '1e-06s'].includes(duration)));
  if (reducedDurations.length) failures.push(`mouvement réduit conserve ${[...new Set(reducedDurations)].join(', ')}`);

  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  const zoomLayout = await inspectOverflow(page);
  if (zoomLayout.scrollWidth > zoomLayout.clientWidth + 1 || zoomLayout.stageScrollWidth > zoomLayout.stageClientWidth + 1) failures.push('zoom 200 % provoque un débordement horizontal');
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${baseURL}${route}`, { waitUntil: 'load' });
  const mobileLayout = await inspectOverflow(mobilePage);
  if (mobileLayout.scrollWidth > mobileLayout.clientWidth + 1 || mobileLayout.stageScrollWidth > mobileLayout.stageClientWidth + 1) failures.push('mobile 390 px provoque un débordement horizontal');
  await mobile.close();

  const noScript = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    javaScriptEnabled: false,
  });
  const noScriptPage = await noScript.newPage();
  await noScriptPage.goto(`${baseURL}${route}`, { waitUntil: 'load' });
  if (await noScriptPage.locator('[data-prioritizer-scenario]:visible').count() !== 4) failures.push('les quatre situations ne sont pas visibles sans JavaScript');
  if (await noScriptPage.locator('[data-prioritizer-correction]:visible').count() !== 4) failures.push('les quatre corrections ne sont pas lisibles sans JavaScript');
  await noScript.close();
} finally {
  await browser.close();
  stopPreview();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('QA A2 : clavier, absence de choix, erreur, progression, score, replay, mobile, zoom 200 %, mouvement réduit et repli sans JavaScript validés.');
}
