import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4377';
const checkpointURL = `${baseURL}/presenter/a1/a1-plausible/`;
let preview;

const stopPreview = () => {
  if (preview && !preview.killed) preview.kill('SIGTERM');
};
process.once('exit', stopPreview);
process.once('SIGINT', () => { stopPreview(); process.exit(130); });

if (!process.env.QA_BASE_URL) {
  preview = spawn(
    'node_modules/.bin/astro',
    ['preview', '--host', '127.0.0.1', '--port', '4377'],
    { stdio: 'ignore' },
  );
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
    try { ready = (await fetch(checkpointURL)).ok; } catch {}
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview indisponible sur ${baseURL}. Lancez d'abord npm run build.`);
}

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(checkpointURL, { waitUntil: 'load' });
  const scene = page.locator('[data-verification-audit][data-variant="classification-sequence"]');
  await scene.waitFor();
  await page.waitForFunction(() => document.querySelector('[data-verification-audit]')?.dataset.enhanced === 'true');

  assert.equal(
    await page.evaluate(() => document.activeElement?.matches('[data-sequence-choice]') ?? false),
    false,
    'le chargement initial ne doit pas voler le focus',
  );
  assert.equal(await scene.locator('[data-sequence-panel]').count(), 5);
  assert.equal(
    await scene.locator('[data-sequence-choice]').evaluateAll((choices) => new Set(choices.map((choice) => choice.name)).size),
    5,
    'chaque affirmation doit conserver son groupe radio isolé',
  );

  const expectedAnswers = ['Exacte', 'À vérifier', 'Exacte', 'Exacte', 'Exacte'];
  for (let statementIndex = 0; statementIndex < expectedAnswers.length; statementIndex += 1) {
    const panel = scene.locator(`[data-sequence-panel="${statementIndex}"]`);
    const reveal = panel.locator('[data-sequence-reveal]');
    const result = panel.locator('[data-sequence-result]');
    const next = scene.locator('[data-sequence-next]');

    assert.equal(await scene.locator('[data-sequence-panel]:visible').count(), 1);
    assert.equal(await scene.locator('[data-sequence-panel][hidden]').count(), 4);
    assert.equal(await panel.isVisible(), true);
    assert.equal(await scene.locator('[data-sequence-index]').textContent(), String(statementIndex + 1));
    assert.equal(await panel.locator('[data-sequence-choice]:checked').count(), 0, 'le panneau entrant doit être réinitialisé');
    assert.equal(await reveal.isDisabled(), true, 'la correction reste verrouillée avant le vote');
    assert.equal(await next.isDisabled(), true, 'la progression reste verrouillée avant la correction');
    assert.equal(await result.isHidden(), true);

    const choice = panel.locator(`[data-sequence-choice][value="${expectedAnswers[statementIndex]}"]`);
    await choice.click();
    assert.equal(await panel.locator('[data-sequence-choice]:checked').count(), 1);
    assert.equal(await reveal.isEnabled(), true, 'le vote doit déverrouiller la correction');
    assert.equal(await next.isDisabled(), true, 'le vote seul ne doit pas déverrouiller la progression');
    assert.equal(await result.isHidden(), true);

    await reveal.click();
    assert.equal(await result.isVisible(), true);
    assert.match((await result.textContent()) ?? '', new RegExp(expectedAnswers[statementIndex]));
    assert.equal(await next.isEnabled(), true, 'la correction doit déverrouiller la progression');
    assert.equal(
      await next.textContent(),
      statementIndex === expectedAnswers.length - 1 ? 'Rejouer le checkpoint' : 'Affirmation suivante',
    );

    await next.click();
    const nextIndex = statementIndex === expectedAnswers.length - 1 ? 0 : statementIndex + 1;
    const firstChoice = scene.locator(`[data-sequence-panel="${nextIndex}"] [data-sequence-choice]`).first();
    assert.equal(
      await firstChoice.evaluate((choice) => document.activeElement === choice),
      true,
      'la progression doit placer le focus sur le premier radio du panneau actif',
    );
  }

  assert.equal(await scene.locator('[data-sequence-index]').textContent(), '1');
  assert.equal(await scene.locator('[data-sequence-panel="0"]').isVisible(), true);
  assert.equal(await scene.locator('[data-sequence-panel="0"] [data-sequence-choice]:checked').count(), 0);
  assert.equal(await scene.locator('[data-sequence-panel="0"] [data-sequence-result]').isHidden(), true);
  assert.equal(await scene.locator('[data-sequence-panel="0"] [data-sequence-reveal]').isDisabled(), true);
  assert.equal(await scene.locator('[data-sequence-next]').isDisabled(), true);
  await context.close();

  const noScriptContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const noScriptPage = await noScriptContext.newPage();
  await noScriptPage.goto(checkpointURL, { waitUntil: 'load' });
  const noScriptScene = noScriptPage.locator('[data-verification-audit][data-variant="classification-sequence"]');
  assert.equal(await noScriptScene.getAttribute('data-enhanced'), null);
  assert.equal(await noScriptScene.locator('[data-sequence-panel]:visible').count(), 5);
  assert.equal(await noScriptScene.locator('[data-sequence-reveal]:disabled').count(), 5);
  assert.equal(await noScriptScene.locator('[data-sequence-next]').isDisabled(), true);

  const fallback = noScriptScene.locator('.audit__sequence-fallback');
  assert.equal(await fallback.isVisible(), true);
  await fallback.locator('summary').focus();
  assert.equal(await noScriptPage.evaluate(() => document.activeElement?.tagName), 'SUMMARY');
  await noScriptPage.keyboard.press('Enter');
  assert.equal(await fallback.getAttribute('open'), '');
  assert.equal(await fallback.locator('li:visible').count(), 5);
  assert.deepEqual(await fallback.locator('li strong').allTextContents(), expectedAnswers);
  await noScriptContext.close();
} finally {
  await browser.close();
  stopPreview();
}

console.log('QA checkpoint A1 : verrou vote/correction/suivante, focus, cinq étapes, replay et repli no-JS validés.');
