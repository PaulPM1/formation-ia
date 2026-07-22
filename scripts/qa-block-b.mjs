import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { navigateAndWaitForFonts } from './qa-page-ready.mjs';

const routes = [
  '/presenter/b0/b0-layers/', '/presenter/b0/b0-test/',
  '/presenter/b1/b1-vague/', '/presenter/b1/b1-four-blocks/', '/presenter/b1/b1-mission/', '/presenter/b1/b1-loop/',
  '/presenter/b2/b2-object/', '/presenter/b2/b2-mvp/', '/presenter/b2/b2-mission/', '/presenter/b2/b2-correction/',
  '/presenter/b3/b3-delegation/', '/presenter/b3/b3-pacte/', '/presenter/b3/b3-mission/', '/presenter/b3/b3-check/',
  '/presenter/b4/b4-context/', '/presenter/b4/b4-ipmtr/', '/presenter/b4/b4-mission/', '/presenter/b4/b4-test/',
  '/presenter/b4-bis/b4bis-install/', '/presenter/b4-bis/b4bis-workspace/', '/presenter/b4-bis/b4bis-checkpoint/',
];
const setupLabels = ['Chat', 'Artifact', 'Cowork', 'Kit', 'Départ'];
const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4377';
let preview;

const stopPreview = () => {
  if (preview && !preview.killed) preview.kill('SIGTERM');
};
process.once('exit', stopPreview);
process.once('SIGINT', () => { stopPreview(); process.exit(130); });

if (!process.env.QA_BASE_URL) {
  preview = spawn('node_modules/.bin/astro', ['preview', '--host', '127.0.0.1', '--port', '4377'], {
    stdio: 'ignore',
  });
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
    try {
      const response = await fetch(baseURL);
      ready = response.ok;
    } catch {}
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview indisponible sur ${baseURL}. Lancez d'abord npm run build.`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const failures = [];

const inspect = async (viewport, mode, zoom = 1) => {
  const context = await browser.newContext({ viewport, deviceScaleFactor: zoom });
  const page = await context.newPage();
  for (const route of routes) {
    const { response } = await navigateAndWaitForFonts(page, `${baseURL}${route}`);
    if (!response?.ok()) {
      failures.push(`${mode} ${route} HTTP ${response?.status() ?? 'absent'}`);
      continue;
    }
    await page.evaluate((value) => { document.documentElement.style.zoom = String(value); }, zoom);
    const expectedTrack = route.startsWith('/presenter/b4-bis/')
      ? 'Rattrapage'
      : route.startsWith('/presenter/b4/') ? 'Facultatif' : null;
    const trackMarker = page.locator('.presentation-heading__track');
    const trackMarkerVisible = await trackMarker.isVisible().catch(() => false);
    if (expectedTrack && (!trackMarkerVisible || (await trackMarker.textContent())?.trim() !== expectedTrack)) {
      failures.push(`${mode} ${route} repère ${expectedTrack} absent`);
    }
    if (!expectedTrack && trackMarkerVisible) {
      failures.push(`${mode} ${route} repère de piste inattendu`);
    }
    const result = await page.locator('.presentation-visual').evaluate((visual, { mode, setupLabels }) => {
      const tolerance = 1;
      const isHidden = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display === 'none'
          || style.visibility === 'hidden'
          || Number(style.opacity) === 0
          || style.clipPath === 'inset(50%)'
          || rect.width <= 1
          || rect.height <= 1;
      };
      const label = (element) => {
        const className = typeof element.className === 'string' ? element.className.trim().replace(/\s+/g, '.') : '';
        return `${element.tagName.toLowerCase()}${className ? `.${className}` : ''}`;
      };
      const hasOwnText = (element) => [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      );
      const issues = [];
      const elements = [...visual.querySelectorAll('*')].filter(
        (element) => !element.closest('svg') && !isHidden(element),
      );

      for (const element of elements) {
        const style = getComputedStyle(element);
        const horizontalOverflow = element.scrollWidth > element.clientWidth + tolerance;
        const verticalOverflow = mode !== 'mobile' && element.scrollHeight > element.clientHeight + tolerance;
        const scrollable = ['auto', 'scroll'].includes(style.overflowX)
          || ['auto', 'scroll'].includes(style.overflowY);
        const accessibleScroller = scrollable && (
          element.tabIndex >= 0
          || element.hasAttribute('aria-label')
          || element.hasAttribute('aria-labelledby')
        );
        if ((horizontalOverflow || verticalOverflow) && !accessibleScroller) {
          issues.push(`${label(element)} overflow ${element.clientWidth}×${element.clientHeight}/${element.scrollWidth}×${element.scrollHeight}`);
        }

        const rect = element.getBoundingClientRect();
        for (let ancestor = element.parentElement; ancestor && visual.contains(ancestor); ancestor = ancestor.parentElement) {
          const ancestorStyle = getComputedStyle(ancestor);
          const clipsX = ['hidden', 'clip'].includes(ancestorStyle.overflowX);
          const clipsY = ['hidden', 'clip'].includes(ancestorStyle.overflowY);
          if (!clipsX && !clipsY) continue;
          const ancestorRect = ancestor.getBoundingClientRect();
          if ((clipsX && (rect.left < ancestorRect.left - tolerance || rect.right > ancestorRect.right + tolerance))
            || (mode !== 'mobile' && clipsY && (rect.top < ancestorRect.top - tolerance || rect.bottom > ancestorRect.bottom + tolerance))) {
            issues.push(`${label(element)} clipped by ${label(ancestor)}`);
            break;
          }
        }

        if (hasOwnText(element)) {
          const fontSize = Number.parseFloat(style.fontSize);
          if (fontSize < 11.19) issues.push(`${label(element)} fontSize=${fontSize}px`);
        }
      }

      const labels = [...visual.querySelectorAll('.setup__route-label')];
      if (labels.length) {
        const visibleLabels = labels.filter((element) => !isHidden(element)).map((element) => element.textContent.trim());
        if (visibleLabels.length !== 5 || setupLabels.some((name) => !visibleLabels.includes(name))) {
          issues.push(`Setup labels visibles=${JSON.stringify(visibleLabels)}`);
        }
      }
      return issues;
    }, { mode, setupLabels });
    failures.push(...result.map((issue) => `${mode} ${route} ${issue}`));
  }
  await context.close();
};

try {
  await inspect({ width: 1280, height: 720 }, 'desktop');
  await inspect({ width: 390, height: 844 }, 'mobile');
  await inspect({ width: 1280, height: 720 }, 'zoom-200', 2);
  const noScript = await browser.newContext({ viewport: { width: 1280, height: 720 }, javaScriptEnabled: false });
  const noScriptPage = await noScript.newPage();
  for (const route of routes) {
    await navigateAndWaitForFonts(noScriptPage, `${baseURL}${route}`);
    if (!await noScriptPage.locator('.presentation-visual [data-enhanced="false"]').isVisible().catch(() => false)) {
      failures.push(`no-js ${route} état final absent`);
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
  console.log(`QA bloc B : ${routes.length}/21 routes à 1280×720, 390×844 et zoom 200 % sans texte sous le plancher, overflow descendant ni clipping.`);
}
