import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4383';
const routes = {
  models: '/presenter/a3/a3-model-fit/',
  costs: '/presenter/a3/a3-api-cost/',
  access: '/presenter/a3/a3-access/',
};
const hybridConclusion = 'Aujourd’hui, l’abonnement peut donner une capacité qui coûterait davantage au tarif API. Ce rapport peut changer.';
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
    ['preview', '--host', '127.0.0.1', '--port', '4383'],
    { stdio: 'ignore' },
  );
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
    try { ready = (await fetch(`${baseURL}${routes.models}`)).ok; } catch {}
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview indisponible sur ${baseURL}. Lancez d'abord npm run build.`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });

const stabilize = async (page) => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
};

const normalizedText = async (locator) => (await locator.textContent())?.replace(/\s+/g, ' ').trim() ?? '';

const inspectLayout = (page) => page.evaluate(() => {
  const tolerance = 1;
  const slide = document.querySelector('.presentation-slide');
  const guide = document.querySelector('[data-model-cost-guide]');
  const isHidden = (element) => {
    for (let current = element; current && guide?.contains(current); current = current.parentElement) {
      const style = getComputedStyle(current);
      const rect = current.getBoundingClientRect();
      if (style.display === 'none'
        || style.visibility === 'hidden'
        || Number(style.opacity) === 0
        || style.clipPath === 'inset(50%)'
        || rect.width <= 1
        || rect.height <= 1) return true;
    }
    return false;
  };
  const label = (element) => {
    const className = typeof element.className === 'string'
      ? element.className.trim().replace(/\s+/g, '.')
      : '';
    return `${element.tagName.toLowerCase()}${className ? `.${className}` : ''}`;
  };
  const clippedText = [];

  if (guide && slide) {
    const walker = document.createTreeWalker(guide, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent?.trim()) continue;
      const parent = node.parentElement;
      if (!parent || isHidden(parent)) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const textRects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);

      for (let ancestor = parent; ancestor && slide.contains(ancestor); ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        const clipsX = ['hidden', 'clip'].includes(style.overflowX);
        const clipsY = ['hidden', 'clip'].includes(style.overflowY);
        if (!clipsX && !clipsY) continue;
        const ancestorRect = ancestor.getBoundingClientRect();
        const clipped = textRects.some((rect) => (
          (clipsX && (rect.left < ancestorRect.left - tolerance || rect.right > ancestorRect.right + tolerance))
          || (clipsY && (rect.top < ancestorRect.top - tolerance || rect.bottom > ancestorRect.bottom + tolerance))
        ));
        if (clipped) {
          clippedText.push(`${node.textContent.trim().slice(0, 48)} par ${label(ancestor)}`);
          break;
        }
      }
    }
  }

  return {
    documentClientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    slideClientWidth: slide?.clientWidth ?? 0,
    slideScrollWidth: slide?.scrollWidth ?? 0,
    guideClientWidth: guide?.clientWidth ?? 0,
    guideScrollWidth: guide?.scrollWidth ?? 0,
    clippedText: [...new Set(clippedText)],
  };
});

const checkHorizontalOverflow = (layout, label) => {
  if (layout.documentScrollWidth > layout.documentClientWidth + 1) {
    failures.push(`${label} : débordement horizontal du document ${layout.documentClientWidth}/${layout.documentScrollWidth}px`);
  }
  if (layout.slideScrollWidth > layout.slideClientWidth + 1) {
    failures.push(`${label} : débordement horizontal de la slide ${layout.slideClientWidth}/${layout.slideScrollWidth}px`);
  }
  if (layout.guideScrollWidth > layout.guideClientWidth + 1) {
    failures.push(`${label} : débordement horizontal du guide ${layout.guideClientWidth}/${layout.guideScrollWidth}px`);
  }
};

try {
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await desktop.newPage();

  await page.goto(`${baseURL}${routes.models}`, { waitUntil: 'load' });
  await stabilize(page);
  const tierChoices = page.locator('[data-tier-choice]');
  const tierRows = page.locator('[data-tier-row]');
  if (await tierChoices.count() !== 3) failures.push('modèles desktop : trois niveaux de contrôle attendus');
  if (await tierRows.count() !== 3) failures.push('modèles desktop : trois lignes de niveau attendues');
  const exigenceRadio = page.locator('[data-tier-choice][value="exigence"]');
  if (await exigenceRadio.count() !== 1) {
    failures.push('modèles desktop : choix exigence absent');
  } else {
    await exigenceRadio.check();
    if (await page.locator('[data-tier-row="exigence"]').getAttribute('data-active') !== 'true') {
      failures.push('modèles desktop : le niveau exigence ne devient pas actif');
    }
  }
  if (await page.locator('[data-tier-row]:visible').count() !== 3) {
    failures.push('modèles desktop : les trois niveaux ne restent pas visibles');
  }

  await page.goto(`${baseURL}${routes.costs}`, { waitUntil: 'load' });
  await stabilize(page);
  const fableRow = page.locator('tbody tr').filter({ hasText: 'Claude Fable 5' });
  if (await fableRow.count() !== 1) failures.push('coûts desktop : ligne Claude Fable 5 absente');
  const volumeExpectations = [
    { volume: '1', heading: '1 dossier', cost: '1,50 $' },
    { volume: '10', heading: '10 dossiers', cost: '15 $' },
    { volume: '100', heading: '100 dossiers', cost: '150 $' },
  ];
  for (const expectation of volumeExpectations) {
    const choice = page.locator(`[data-volume-choice][value="${expectation.volume}"]`);
    if (await choice.count() !== 1) {
      failures.push(`coûts desktop : volume ${expectation.volume} absent`);
      continue;
    }
    await choice.check();
    const heading = await normalizedText(page.locator('[data-volume-heading]'));
    if (heading !== expectation.heading) {
      failures.push(`coûts desktop : volume ${expectation.volume}, en-tête ${JSON.stringify(heading)} au lieu de ${JSON.stringify(expectation.heading)}`);
    }
    if (await fableRow.count() === 1) {
      const fableCost = await fableRow.locator('[data-cost-output]').evaluate((output) => output.value.trim());
      if (fableCost !== expectation.cost) {
        failures.push(`coûts desktop : volume ${expectation.volume}, Fable ${JSON.stringify(fableCost)} au lieu de ${JSON.stringify(expectation.cost)}`);
      }
    }
  }

  await page.goto(`${baseURL}${routes.access}`, { waitUntil: 'load' });
  await stabilize(page);
  for (const heading of ['Abonnement', 'API']) {
    const headingLocator = page.getByText(heading, { exact: true });
    if (await headingLocator.count() !== 1 || !await headingLocator.isVisible()) {
      failures.push(`accès desktop : en-tête ${heading} absent`);
    }
  }
  const conclusion = page.locator('.model-guide__hybrid p');
  if (!await conclusion.isVisible() || await normalizedText(conclusion) !== hybridConclusion) {
    failures.push('accès desktop : conclusion hybride absente ou incomplète');
  }
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobile.newPage();
  for (const [name, route] of Object.entries(routes)) {
    await mobilePage.goto(`${baseURL}${route}`, { waitUntil: 'load' });
    await stabilize(mobilePage);
    const layout = await inspectLayout(mobilePage);
    checkHorizontalOverflow(layout, `${name} mobile 390 px`);
    if (layout.clippedText.length) {
      failures.push(`${name} mobile 390 px : texte visible rogné (${layout.clippedText.join(', ')})`);
    }
  }
  await mobile.close();

  const zoom = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const zoomPage = await zoom.newPage();
  for (const [name, route] of Object.entries(routes)) {
    await zoomPage.goto(`${baseURL}${route}`, { waitUntil: 'load' });
    await zoomPage.evaluate(() => { document.documentElement.style.zoom = '2'; });
    await stabilize(zoomPage);
    checkHorizontalOverflow(await inspectLayout(zoomPage), `${name} zoom 200 %`);
  }
  await zoom.close();

  const reduced = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reduced.newPage();
  for (const [name, route] of Object.entries(routes)) {
    await reducedPage.goto(`${baseURL}${route}`, { waitUntil: 'load' });
    await stabilize(reducedPage);
    const motion = await reducedPage.locator('[data-model-cost-guide]').evaluate((guide) => {
      const elements = [guide, ...guide.querySelectorAll('*')];
      const nonZeroDuration = (value) => value.split(',').some((duration) => Number.parseFloat(duration) > 0);
      return elements.flatMap((element) => {
        const style = getComputedStyle(element);
        const issues = [];
        if (style.animationName.split(',').some((animation) => animation.trim() !== 'none')
          || nonZeroDuration(style.animationDuration)) issues.push(`animation ${style.animationName}/${style.animationDuration}`);
        if (nonZeroDuration(style.transitionDuration)) issues.push(`transition ${style.transitionDuration}`);
        return issues;
      });
    });
    if (motion.length) failures.push(`${name} mouvement réduit : ${[...new Set(motion)].join(', ')}`);
  }
  await reduced.close();

  const noScript = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    javaScriptEnabled: false,
  });
  const noScriptPage = await noScript.newPage();

  await noScriptPage.goto(`${baseURL}${routes.models}`, { waitUntil: 'load' });
  if (await noScriptPage.locator('[data-tier-row]:visible').count() !== 3) {
    failures.push('modèles sans JavaScript : les trois niveaux ne sont pas visibles');
  }

  await noScriptPage.goto(`${baseURL}${routes.costs}`, { waitUntil: 'load' });
  const noScriptCostRows = noScriptPage.locator('.model-guide__cost-table tbody tr:visible');
  if (await noScriptCostRows.count() !== 6) failures.push('coûts sans JavaScript : six lignes attendues');
  for (let index = 0; index < await noScriptCostRows.count(); index += 1) {
    const row = noScriptCostRows.nth(index);
    const unit = await normalizedText(row.locator('[data-label="1 dossier"]'));
    const hundred = await normalizedText(row.locator('[data-label="100 dossiers"][data-volume-cost]'));
    if (!unit || !hundred) failures.push(`coûts sans JavaScript : valeurs 1 et 100 dossiers absentes ligne ${index + 1}`);
  }

  await noScriptPage.goto(`${baseURL}${routes.access}`, { waitUntil: 'load' });
  if (await noScriptPage.locator('.model-guide__access article:visible').count() !== 2) {
    failures.push('accès sans JavaScript : les deux colonnes ne sont pas visibles');
  }
  for (const heading of ['Abonnement', 'API']) {
    if (!await noScriptPage.getByText(heading, { exact: true }).isVisible()) {
      failures.push(`accès sans JavaScript : colonne ${heading} absente`);
    }
  }
  await noScript.close();
} finally {
  await browser.close();
  stopPreview();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('QA A3 : trois routes, niveaux, volumes et coûts Fable, accès hybride, mobile, zoom 200 %, mouvement réduit et replis sans JavaScript validés.');
}
