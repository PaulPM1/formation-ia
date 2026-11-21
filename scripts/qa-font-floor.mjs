import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { navigateAndWaitForFonts } from './qa-page-ready.mjs';

const FONT_FLOOR_PX = 11.99;
const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4379';
const routes = [];
let preview;

for (const brick of await readdir(new URL('../dist/presenter/', import.meta.url), { withFileTypes: true })) {
  if (!brick.isDirectory()) continue;
  for (const slide of await readdir(new URL(`../dist/presenter/${brick.name}/`, import.meta.url), { withFileTypes: true })) {
    if (slide.isDirectory()) routes.push(`/presenter/${brick.name}/${slide.name}/`);
  }
}
routes.sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
if (routes.length !== 62) throw new Error(`62 routes attendues, ${routes.length} trouvées.`);

const stopPreview = () => {
  if (preview && !preview.killed) preview.kill('SIGTERM');
};
process.once('exit', stopPreview);
process.once('SIGINT', () => { stopPreview(); process.exit(130); });

if (!process.env.QA_BASE_URL) {
  preview = spawn('node_modules/.bin/astro', ['preview', '--host', '127.0.0.1', '--port', '4379'], { stdio: 'ignore' });
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
    try { ready = (await fetch(baseURL)).ok; } catch {}
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview indisponible sur ${baseURL}. Lancez d'abord npm run build.`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const failures = [];
const modes = [
  { name: 'desktop', viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1, zoom: 1 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, zoom: 1 },
  { name: 'zoom-200', viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2, zoom: 2 },
];

try {
  for (const mode of modes) {
    const context = await browser.newContext({ viewport: mode.viewport, deviceScaleFactor: mode.deviceScaleFactor });
    const page = await context.newPage();
    for (const route of routes) {
      await navigateAndWaitForFonts(page, `${baseURL}${route}`);
      await page.evaluate((zoom) => {
        document.documentElement.style.zoom = String(zoom);
      }, mode.zoom);
      await page.locator('details').evaluateAll((details) => {
        for (const disclosure of details) disclosure.open = true;
      });
      const issues = await page.locator('.presentation-slide').evaluate((stage, floor) => {
        const hidden = (element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display === 'none'
            || style.visibility === 'hidden'
            || Number(style.opacity) === 0
            || rect.width <= 1
            || rect.height <= 1;
        };
        const name = (element) => {
          const className = typeof element.className === 'string'
            ? element.className.trim().replace(/\s+/g, '.')
            : element.className?.baseVal?.trim().replace(/\s+/g, '.') ?? '';
          return `${element.tagName.toLowerCase()}${className ? `.${className}` : ''}`;
        };
        const ownText = (element) => [...element.childNodes].some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
        );
        const found = [];
        const htmlText = [...stage.querySelectorAll('*')].filter(
          (element) => !element.closest('svg') && !hidden(element) && ownText(element),
        );
        const svgText = [...stage.querySelectorAll('svg text')].filter((element) => !hidden(element));

        for (const element of [...htmlText, ...svgText]) {
          const px = Number.parseFloat(getComputedStyle(element).fontSize);
          if (px < floor) found.push(`${name(element)}=${px}px`);
        }

        for (const element of [...stage.querySelectorAll('*')].filter((candidate) => !hidden(candidate))) {
          for (const pseudo of ['::before', '::after']) {
            const style = getComputedStyle(element, pseudo);
            if (!style.content || style.content === 'none' || style.content === '""') continue;
            const px = Number.parseFloat(style.fontSize);
            if (px < floor) found.push(`${name(element)}${pseudo}=${px}px`);
          }
        }
        return [...new Set(found)];
      }, FONT_FLOOR_PX);
      failures.push(...issues.map((issue) => `${mode.name} ${route} ${issue}`));
    }
    await context.close();
  }
} finally {
  await browser.close();
  stopPreview();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Plancher typographique : ${routes.length}/62 routes HTML, SVG et pseudo-contenus à au moins 12 px en desktop, mobile et zoom 200 %.`);
}
