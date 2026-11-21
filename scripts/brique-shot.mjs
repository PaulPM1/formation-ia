// Captures d'une brique pour relecture visuelle : page entière sur ordinateur
// et sur téléphone, puis chaque étape de chaque visuel animé.
// Usage : node scripts/brique-shot.mjs <id> <dossier> [port]
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const [id, out, port = '4392'] = process.argv.slice(2);
if (!id || !out) throw new Error('Usage : node scripts/brique-shot.mjs <id> <dossier> [port]');
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
for (const [name, width] of [['ordi', 1280], ['tel', 390]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(`http://localhost:${port}/briques/${id}/`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${out}/${id}-${name}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) console.log(`ATTENTION ${name} : débordement horizontal de ${overflow}px`);

  const steppers = page.locator('[data-stepper]');
  for (let index = 0; index < (await steppers.count()); index += 1) {
    const stepper = steppers.nth(index);
    const buttons = stepper.locator('[data-step-to]');
    for (let step = 0; step < (await buttons.count()); step += 1) {
      await buttons.nth(step).click();
      await stepper.screenshot({ path: `${out}/${id}-${name}-visuel${index + 1}-etape${step + 1}.png` });
    }
  }
  await page.close();
}
await browser.close();
console.log(`Captures de ${id} dans ${out}`);
