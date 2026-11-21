// Captures des slides d'un deck pour relecture visuelle, au format d'un
// vidéoprojecteur (1440 x 810), plus une capture téléphone de chaque slide.
// Usage : node scripts/slide-shot.mjs <brique> <dossier> [port]
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const [brick, out, port = '4392'] = process.argv.slice(2);
if (!brick || !out) throw new Error('Usage : node scripts/slide-shot.mjs <brique> <dossier> [port]');
await mkdir(out, { recursive: true });
const base = `http://localhost:${port}`;

const browser = await chromium.launch();
const index = await browser.newPage();
await index.goto(`${base}/presenter/`);
const first = await index.locator(`a[href^="/presenter/${brick}/"]`).first().getAttribute('href');
if (!first) throw new Error(`Aucune slide pour ${brick}`);
await index.close();

for (const [name, width, height] of [['ecran', 1440, 810], ['tel', 390, 800]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
  await page.goto(base + first);
  for (let number = 1; ; number += 1) {
    await page.waitForLoadState('networkidle');
    const id = new URL(page.url()).pathname.split('/').filter(Boolean).pop();
    await page.screenshot({ path: `${out}/${String(number).padStart(2, '0')}-${id}-${name}.png` });
    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const overflowY = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    if (overflowX > 0) console.log(`ATTENTION ${id} ${name} : déborde en largeur de ${overflowX}px`);
    if (name === 'ecran' && overflowY > 0) console.log(`ATTENTION ${id} : dépasse l'écran en hauteur de ${overflowY}px`);
    const next = await page.locator('[data-next]').getAttribute('href').catch(() => null);
    if (!next || !next.startsWith(`/presenter/${brick}/`)) break;
    await page.goto(base + next);
  }
  await page.close();
}
await browser.close();
console.log(`Captures du deck ${brick} dans ${out}`);
