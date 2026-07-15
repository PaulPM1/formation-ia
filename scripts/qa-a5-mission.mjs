import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4380';
const route = '/presenter/a5/a5-mission/';
const captureDirectory = new URL('../.context/qa-slides/', import.meta.url);
const categories = [
  'fait vérifiable',
  'inférence raisonnable',
  'affirmation sans source',
  'recommandation trop sûre',
];
const failures = [];
let preview;

const stopPreview = () => {
  if (preview && !preview.killed) preview.kill('SIGTERM');
};
process.once('exit', stopPreview);
process.once('SIGINT', () => { stopPreview(); process.exit(130); });

if (!process.env.QA_BASE_URL) {
  preview = spawn('node_modules/.bin/astro', ['preview', '--host', '127.0.0.1', '--port', '4380'], { stdio: 'ignore' });
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
    try { ready = (await fetch(baseURL)).ok; } catch {}
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview indisponible sur ${baseURL}. Lancez d'abord npm run build.`);
}

await mkdir(captureDirectory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });

const stabilize = async (page, waitForFonts = true) => {
  await page.evaluate(async (shouldWaitForFonts) => {
    if (shouldWaitForFonts) await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, waitForFonts);
};

const inspectLayout = async (page, label, { expectDocumentFlow, requireCorrection }) => {
  const result = await page.locator('.presentation-slide').evaluate((slide) => {
    const figure = slide.querySelector('.presentation-visual');
    const content = slide.querySelector('.scene-frame__content');
    const correction = slide.querySelector('.mission-board__correction-list');
    const hidden = (element) => {
      const closedDetails = element.closest('details:not([open])');
      if (closedDetails && !element.closest('summary')) return true;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display === 'none'
        || style.visibility === 'hidden'
        || Number(style.opacity) === 0
        || style.clipPath === 'inset(50%)'
        || rect.width <= 1
        || rect.height <= 1;
    };
    const name = (element) => {
      const className = typeof element.className === 'string'
        ? element.className.trim().replace(/\s+/g, '.')
        : '';
      return `${element.tagName.toLowerCase()}${className ? `.${className}` : ''}`;
    };
    const clipped = [];
    for (const element of [...slide.querySelectorAll('*')].filter((candidate) => !hidden(candidate))) {
      const rect = element.getBoundingClientRect();
      for (let ancestor = element.parentElement; ancestor && slide.contains(ancestor); ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        const ancestorRect = ancestor.getBoundingClientRect();
        const clipsX = ['hidden', 'clip'].includes(style.overflowX);
        const clipsY = ['hidden', 'clip'].includes(style.overflowY);
        if ((clipsX && (rect.left < ancestorRect.left - 1 || rect.right > ancestorRect.right + 1))
          || (clipsY && (rect.top < ancestorRect.top - 1 || rect.bottom > ancestorRect.bottom + 1))) {
          clipped.push(`${name(element)} par ${name(ancestor)}`);
          break;
        }
      }
    }
    const correctionText = correction?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const correctionFonts = correction
      ? [...correction.querySelectorAll('*')]
        .filter((element) => !hidden(element) && [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()))
        .map((element) => Number.parseFloat(getComputedStyle(element).fontSize))
      : [];
    return {
      figureHeight: figure?.getBoundingClientRect().height ?? 0,
      contentClientHeight: content?.clientHeight ?? 0,
      contentScrollHeight: content?.scrollHeight ?? 0,
      figureOverflow: figure ? `${getComputedStyle(figure).overflowX}/${getComputedStyle(figure).overflowY}` : 'absent',
      contentOverflow: content ? `${getComputedStyle(content).overflowX}/${getComputedStyle(content).overflowY}` : 'absent',
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      documentClientHeight: document.documentElement.clientHeight,
      documentScrollHeight: document.documentElement.scrollHeight,
      clipped: [...new Set(clipped)],
      correctionText,
      correctionMinFont: correctionFonts.length ? Math.min(...correctionFonts) : 0,
    };
  });

  if (result.figureHeight < 200) failures.push(`${label} figure repliée ${result.figureHeight}px`);
  if (result.contentClientHeight < 150) failures.push(`${label} contenu replié ${result.contentClientHeight}/${result.contentScrollHeight}px`);
  if (result.contentScrollHeight > result.contentClientHeight + 1) failures.push(`${label} scroll interne ${result.contentClientHeight}/${result.contentScrollHeight}px`);
  if (result.documentScrollWidth > result.documentClientWidth + 1) failures.push(`${label} overflow document horizontal ${result.documentClientWidth}/${result.documentScrollWidth}px`);
  if (expectDocumentFlow && result.documentScrollHeight <= result.documentClientHeight + 1) failures.push(`${label} document ne reflue pas verticalement ${result.documentClientHeight}/${result.documentScrollHeight}px`);
  if (result.clipped.length) failures.push(`${label} clipping ${result.clipped.join(', ')}`);
  if (requireCorrection && categories.some((category) => !result.correctionText.includes(category))) failures.push(`${label} correction incomplète`);
  if (requireCorrection && result.correctionMinFont < 11.99) failures.push(`${label} correction à ${result.correctionMinFont}px`);
  return result;
};

const exerciseDisclosure = async ({ javaScriptEnabled, zoom, label, capture }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, javaScriptEnabled });
  const page = await context.newPage();
  await page.goto(`${baseURL}${route}`, { waitUntil: 'load' });
  await page.evaluate((factor) => { document.documentElement.style.zoom = String(factor); }, zoom);
  if (javaScriptEnabled) await stabilize(page);
  else await page.waitForTimeout(50);
  const details = page.locator('.mission-board__correction');
  const summary = details.locator('summary');
  if (await details.getAttribute('open') !== null) failures.push(`${label} correction ouverte initialement`);
  const initialText = await page.locator('.mission-board__statements > dd > ol').innerText();
  if (categories.some((category) => initialText.includes(category))) failures.push(`${label} réponse visible dans l'état fermé`);
  const closedResult = await inspectLayout(page, `${label} fermé`, {
    expectDocumentFlow: zoom === 2,
    requireCorrection: false,
  });

  await summary.focus();
  await page.keyboard.press('Enter');
  if (javaScriptEnabled) await stabilize(page);
  else await page.waitForTimeout(50);
  if (await details.getAttribute('open') === null) failures.push(`${label} ouverture clavier absente`);
  const result = await inspectLayout(page, `${label} ouvert`, {
    expectDocumentFlow: zoom === 2,
    requireCorrection: true,
  });
  if (capture) {
    await page.screenshot({
      path: new URL('a5-mission-correction.png', captureDirectory).pathname,
      fullPage: true,
    });
  }
  await context.close();
  return { closed: closedResult, open: result };
};

let zoomResult;

try {
  await exerciseDisclosure({ javaScriptEnabled: true, zoom: 1, label: 'normal js', capture: false });
  zoomResult = await exerciseDisclosure({ javaScriptEnabled: true, zoom: 2, label: 'zoom 200 js', capture: true });
  await exerciseDisclosure({ javaScriptEnabled: false, zoom: 2, label: 'zoom 200 no-js', capture: false });

  const printContext = await browser.newContext({ viewport: { width: 1280, height: 720 }, javaScriptEnabled: false });
  const printPage = await printContext.newPage();
  await printPage.emulateMedia({ media: 'print' });
  await printPage.goto(`${baseURL}${route}`, { waitUntil: 'load' });
  await printPage.waitForTimeout(50);
  const printState = await printPage.evaluate(() => ({
    summary: getComputedStyle(document.querySelector('.mission-board__correction summary')).display,
    correction: getComputedStyle(document.querySelector('.mission-board__correction-list')).display,
  }));
  if (printState.summary !== 'none' || printState.correction === 'none') failures.push(`print ${JSON.stringify(printState)}`);
  await printContext.close();
} finally {
  await browser.close();
  stopPreview();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Mission A5 : fermé/ouvert, clavier, zoom 200 %, no-JS, impression, reflow, clipping et plancher 12 px validés. Figure zoom ${Math.round(zoomResult.open.figureHeight)} px ; contenu ${zoomResult.open.contentClientHeight}/${zoomResult.open.contentScrollHeight} px.`);
}
