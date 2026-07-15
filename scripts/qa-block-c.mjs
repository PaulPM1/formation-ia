import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const routes = [
  '/presenter/c1/c1-repeat/', '/presenter/c1/c1-neighbors/', '/presenter/c1/c1-anatomy/', '/presenter/c1/c1-trigger/', '/presenter/c1/c1-tests/', '/presenter/c1/c1-mission/',
  '/presenter/c2/c2-api/', '/presenter/c2/c2-chain/', '/presenter/c2/c2-tools/', '/presenter/c2/c2-permissions/', '/presenter/c2/c2-readonly/', '/presenter/c2/c2-revoke/', '/presenter/c2/c2-mission/',
  '/presenter/c3/c3-trigger/', '/presenter/c3/c3-hook/', '/presenter/c3/c3-schedule/', '/presenter/c3/c3-guardrails/', '/presenter/c3/c3-pause/', '/presenter/c3/c3-mission/',
];
const specializedRoutes = routes.filter((route) => !route.includes('-mission/'));
const focusRoutes = [
  '/presenter/c1/c1-anatomy/',
  '/presenter/c2/c2-chain/',
  '/presenter/c3/c3-trigger/',
];
const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4378';
let preview;

const stopPreview = () => {
  if (preview && !preview.killed) preview.kill('SIGTERM');
};
process.once('exit', stopPreview);
process.once('SIGINT', () => { stopPreview(); process.exit(130); });

if (!process.env.QA_BASE_URL) {
  preview = spawn('node_modules/.bin/astro', ['preview', '--host', '127.0.0.1', '--port', '4378'], { stdio: 'ignore' });
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
    try { ready = (await fetch(baseURL)).ok; } catch {}
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview indisponible sur ${baseURL}. Lancez d'abord npm run build.`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const failures = [];

const inspectLayout = async (viewport, mode) => {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const issues = await page.locator('.presentation-visual').evaluate((visual, mode) => {
      const tolerance = 1;
      const hidden = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0 || rect.width <= 1 || rect.height <= 1;
      };
      const label = (element) => `${element.tagName.toLowerCase()}${typeof element.className === 'string' && element.className.trim() ? `.${element.className.trim().replace(/\s+/g, '.')}` : ''}`;
      const hasOwnText = (element) => [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      const found = [];
      const elements = [...visual.querySelectorAll('*')].filter((element) => !element.closest('svg') && !hidden(element));
      for (const element of elements) {
        const style = getComputedStyle(element);
        const horizontalOverflow = element.scrollWidth > element.clientWidth + tolerance;
        const verticalOverflow = mode === 'desktop' && element.scrollHeight > element.clientHeight + tolerance;
        const scrollable = ['auto', 'scroll'].includes(style.overflowX) || ['auto', 'scroll'].includes(style.overflowY);
        const accessibleScroller = scrollable && (element.tabIndex >= 0 || element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby'));
        if ((horizontalOverflow || verticalOverflow) && !accessibleScroller) found.push(`${label(element)} overflow ${element.clientWidth}×${element.clientHeight}/${element.scrollWidth}×${element.scrollHeight}`);
        const rect = element.getBoundingClientRect();
        for (let ancestor = element.parentElement; ancestor && visual.contains(ancestor); ancestor = ancestor.parentElement) {
          const ancestorStyle = getComputedStyle(ancestor);
          const clipsX = ['hidden', 'clip'].includes(ancestorStyle.overflowX);
          const clipsY = ['hidden', 'clip'].includes(ancestorStyle.overflowY);
          if (!clipsX && !clipsY) continue;
          const ancestorRect = ancestor.getBoundingClientRect();
          if ((clipsX && (rect.left < ancestorRect.left - tolerance || rect.right > ancestorRect.right + tolerance))
            || (mode === 'desktop' && clipsY && (rect.top < ancestorRect.top - tolerance || rect.bottom > ancestorRect.bottom + tolerance))) {
            found.push(`${label(element)} clipped by ${label(ancestor)}`);
            break;
          }
        }
        if (hasOwnText(element) && Number.parseFloat(style.fontSize) < 11.19) found.push(`${label(element)} fontSize=${style.fontSize}`);
      }
      if (!visual.querySelector('svg title') || !visual.querySelector('svg desc')) {
        const key = visual.dataset.visualKey;
        if (['skill-anatomy', 'mcp-connection-map', 'trigger-timeline'].includes(key)) found.push('SVG sans title/desc');
      }
      return found;
    }, mode);
    failures.push(...issues.map((issue) => `${mode} ${route} ${issue}`));
  }
  await context.close();
};

const inspectNoJs = async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of specializedRoutes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'load' });
    const result = await page.locator('.presentation-visual').evaluate((visual) => {
      const map = visual.querySelector('[data-mcp-map]');
      const boundaryLabel = visual.querySelector('[data-mcp-boundary-label]')?.textContent?.trim() ?? '';
      return {
        text: visual.textContent.replace(/\s+/g, ' ').trim().length,
        disabledControls: [...visual.querySelectorAll('button')].every((button) => button.disabled),
        enhanced: visual.querySelector('[data-enhanced="true"]') !== null,
        boundaryState: map?.getAttribute('data-boundary-state') ?? '',
        boundaryLabel,
        status: visual.querySelector('[data-mcp-status]')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      };
    });
    if (result.text < 120) failures.push(`no-js ${route} contenu statique trop pauvre (${result.text})`);
    if (!result.disabledControls) failures.push(`no-js ${route} contrôle actif sans JavaScript`);
    if (result.enhanced) failures.push(`no-js ${route} enhancement annoncé à tort`);
    if (route.endsWith('/c2-revoke/')) {
      if (result.boundaryState !== 'revoked') failures.push(`no-js ${route} frontière initiale=${result.boundaryState}`);
      if (!result.boundaryLabel.includes('FERMÉE') || !result.boundaryLabel.includes('RÉVOQUÉE')) failures.push(`no-js ${route} label=${result.boundaryLabel}`);
      if (!result.status.includes('Fermée') || !result.status.includes('Aucun accès')) failures.push(`no-js ${route} statut=${result.status}`);
      if (/Connexion active|Lecture seule/.test(result.status)) failures.push(`no-js ${route} contradiction=${result.status}`);
    }
  }
  await context.close();
};

const inspectReducedMotion = async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of focusRoutes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'load' });
    const moving = await page.locator('.presentation-visual').evaluate((visual) => [...visual.querySelectorAll('*')]
      .filter((element) => {
        const style = getComputedStyle(element);
        return style.animationName !== 'none' || style.transitionDuration.split(',').some(
          (duration) => Number.parseFloat(duration) > 0.001,
        );
      }).map((element) => element.tagName));
    if (moving.length) failures.push(`reduced-motion ${route} mouvement résiduel ${moving.join(',')}`);
  }
  await context.close();
};

const inspectKeyboard = async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const pressEnter = async (locator) => { await locator.focus(); await page.keyboard.press('Enter'); };

  await page.goto(`${baseURL}/presenter/c1/c1-tests/`, { waitUntil: 'load' });
  const positive = page.locator('[data-skill-case]').first();
  await pressEnter(positive);
  if (await positive.getAttribute('aria-pressed') !== 'true') failures.push('keyboard c1-tests cas positif non sélectionné');

  await page.goto(`${baseURL}/presenter/c2/c2-permissions/`, { waitUntil: 'load' });
  const boundary = page.locator('[data-mcp-boundary]');
  const geometry = () => boundary.evaluate((line) => {
    const style = getComputedStyle(line);
    return { strokeWidth: style.strokeWidth, strokeDasharray: style.strokeDasharray };
  });
  const minimalGeometry = await geometry();
  await pressEnter(page.locator('[data-mcp-scope="broad"]'));
  const broadGeometry = await geometry();
  const broadLabel = await page.locator('[data-mcp-boundary-label]').textContent();
  if (JSON.stringify(minimalGeometry) === JSON.stringify(broadGeometry)) failures.push('keyboard c2-permissions géométrie minimale/large identique');
  if (await page.locator('[data-mcp-map]').getAttribute('data-boundary-state') !== 'broad' || !broadLabel?.includes('PORTÉE LARGE')) failures.push(`keyboard c2-permissions portée large non annoncée: ${broadLabel}`);
  await pressEnter(page.locator('[data-mcp-scope="minimal"]'));
  if (!(await page.locator('[data-mcp-boundary-label]').textContent())?.includes('LECTURE SEULE')) failures.push('keyboard c2-permissions lecture seule non restaurée');

  await page.goto(`${baseURL}/presenter/c2/c2-revoke/`, { waitUntil: 'load' });
  if (await page.locator('[data-mcp-map]').getAttribute('data-boundary-state') !== 'revoked') failures.push('keyboard c2-revoke ne démarre pas révoqué');
  await pressEnter(page.locator('[data-mcp-connect]'));
  if (await page.locator('[data-mcp-map]').getAttribute('data-boundary-state') !== 'minimal') failures.push('keyboard c2-revoke reconnexion minimale absente');
  await pressEnter(page.locator('[data-mcp-revoke]'));
  if (await page.locator('[data-mcp-map]').getAttribute('data-boundary-state') !== 'revoked') failures.push('keyboard c2-revoke coupure absente');

  await page.goto(`${baseURL}/presenter/c3/c3-hook/`, { waitUntil: 'load' });
  await pressEnter(page.locator('[data-trigger-hook]'));
  if (await page.locator('[data-trigger-timeline]').getAttribute('data-hook-state') !== 'triggered' || !(await page.locator('[data-trigger-status]').textContent())?.includes('HOOK_DEMO_TERMINE')) failures.push('keyboard c3-hook exécution non prouvée');
  await pressEnter(page.locator('[data-trigger-disable]'));
  if (await page.locator('[data-trigger-timeline]').getAttribute('data-hook-state') !== 'disabled' || !(await page.locator('[data-trigger-status]').textContent())?.includes('silencieux')) failures.push('keyboard c3-hook désactivation non prouvée');

  await page.goto(`${baseURL}/presenter/c3/c3-schedule/`, { waitUntil: 'load' });
  const manual = page.locator('[data-trigger-choice]').filter({ hasText: 'Manuel' });
  const recurring = page.locator('[data-trigger-choice]').filter({ hasText: 'Récurrent' });
  await pressEnter(manual);
  if (await manual.getAttribute('aria-pressed') !== 'true' || !(await page.locator('[data-trigger-status]').textContent())?.includes('Run now')) failures.push('keyboard c3-schedule Manuel non prouvé');
  await pressEnter(recurring);
  if (await recurring.getAttribute('aria-pressed') !== 'true' || !(await page.locator('[data-trigger-status]').textContent())?.includes('Chaque vendredi')) failures.push('keyboard c3-schedule Récurrent non prouvé');

  await page.goto(`${baseURL}/presenter/c3/c3-pause/`, { waitUntil: 'load' });
  const lifecycleChecks = [
    ['Manuel', 'Manuel'], ['Surveillé', 'journal visible'], ['En pause', 'pause confirmée'], ['Supprimé', 'suppression confirmée'],
  ];
  for (const [controlName, proof] of lifecycleChecks) {
    await pressEnter(page.locator('[data-trigger-lifecycle]').filter({ hasText: controlName }));
    const state = await page.locator('[data-trigger-status]').textContent();
    if (!state?.includes(proof)) failures.push(`keyboard c3-pause ${controlName} sans preuve ${proof}: ${state}`);
  }
  await context.close();
};

try {
  await inspectLayout({ width: 1280, height: 720 }, 'desktop');
  await inspectLayout({ width: 390, height: 844 }, 'mobile');
  await inspectNoJs();
  await inspectReducedMotion();
  await inspectKeyboard();
} finally {
  await browser.close();
  stopPreview();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`QA bloc C : ${routes.length}/19 routes desktop et mobile, no-JS, reduced-motion et keyboard validés.`);
}
