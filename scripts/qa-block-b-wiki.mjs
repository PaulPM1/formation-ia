import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { navigateAndWaitForFonts } from './qa-page-ready.mjs';

const projectDirectory = fileURLToPath(new URL('..', import.meta.url));
const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4376';
const mobileRoutes = ['/briques/b0/', '/briques/b1/', '/briques/b2/', '/briques/b3/', '/briques/b4/'];
const validBrief = `# Brief du jour
## Actions du jour
- [N01] Envoyer l’agenda. [source: demandes.md]
- [N06] Transmettre le nombre. [source: messages.md]
## À confirmer
- [N03, N05] Confirmer le 18 ou le 19 septembre. [sources: reunion.md ; messages.md]
## Plus tard
- [N02] Préparer les icônes. [source: demandes.md]
- [N04] Archiver après validation. [source: reunion.md]
`;
const invalidBrief = validBrief.replace('## À confirmer', '## Décision');
const failures = [];
let browser;
let preview;
let cleanupPromise;

const waitForChildExit = (child, timeoutMs) => new Promise((resolve) => {
  if (child.exitCode !== null || child.signalCode !== null) {
    resolve(true);
    return;
  }
  const onExit = () => {
    clearTimeout(timer);
    resolve(true);
  };
  const timer = setTimeout(() => {
    child.off('exit', onExit);
    resolve(false);
  }, timeoutMs);
  child.once('exit', onExit);
});

const stopPreviewImmediately = () => {
  if (preview && preview.exitCode === null && preview.signalCode === null) {
    preview.kill('SIGTERM');
  }
};

const stopPreview = async () => {
  if (!preview || preview.exitCode !== null || preview.signalCode !== null) return;
  preview.kill('SIGTERM');
  if (await waitForChildExit(preview, 2000)) return;
  preview.kill('SIGKILL');
  await waitForChildExit(preview, 2000);
};

const cleanup = () => {
  if (!cleanupPromise) {
    cleanupPromise = (async () => {
      if (browser) {
        await browser.close().catch((error) => {
          failures.push(`fermeture navigateur : ${error.message}`);
        });
        browser = undefined;
      }
      await stopPreview();
    })();
  }
  return cleanupPromise;
};

const handleSignal = () => {
  void cleanup().finally(() => process.exit(130));
};

process.once('exit', stopPreviewImmediately);
process.once('SIGINT', handleSignal);
process.once('SIGTERM', handleSignal);

const openRoute = async (page, route) => {
  const { response } = await navigateAndWaitForFonts(page, `${baseURL}${route}`);
  if (!response?.ok()) {
    throw new Error(`${route} HTTP ${response?.status() ?? 'absent'}`);
  }
};

const listenForPageErrors = (page) => {
  page.on('pageerror', (error) => {
    failures.push(`pageerror ${new URL(page.url()).pathname} : ${error.message}`);
  });
};

const assertOnlyPanel = async (page, selected) => {
  const other = selected === 'openai' ? 'claude' : 'openai';
  const selectedPanels = page.locator(`[data-block-b-panel="${selected}"]`);
  const otherPanels = page.locator(`[data-block-b-panel="${other}"]`);
  const selectedCount = await selectedPanels.count();
  const otherCount = await otherPanels.count();
  if (selectedCount === 0 || otherCount === 0) {
    throw new Error(`${page.url()} panneaux ${selected}=${selectedCount}, ${other}=${otherCount}`);
  }
  for (let index = 0; index < selectedCount; index += 1) {
    if (!await selectedPanels.nth(index).isVisible()) {
      throw new Error(`${page.url()} panneau ${selected} ${index + 1} masqué`);
    }
  }
  for (let index = 0; index < otherCount; index += 1) {
    if (await otherPanels.nth(index).isVisible()) {
      throw new Error(`${page.url()} panneau ${other} ${index + 1} visible`);
    }
  }
};

const assertBothPanelsVisible = async (page) => {
  for (const ecosystem of ['claude', 'openai']) {
    const panels = page.locator(`[data-block-b-panel="${ecosystem}"]`);
    const count = await panels.count();
    if (count === 0) throw new Error(`no-js B1 : aucun panneau ${ecosystem}`);
    for (let index = 0; index < count; index += 1) {
      if (!await panels.nth(index).isVisible()) {
        throw new Error(`no-js B1 : panneau ${ecosystem} ${index + 1} masqué`);
      }
    }
  }
};

const inspectHorizontalLayout = async (page) => page.evaluate(() => {
  const viewportWidth = window.innerWidth;
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && rect.width > 1
      && rect.height > 1;
  };
  const offenders = [...document.body.querySelectorAll('*')]
    .filter((element) => visible(element) && !element.classList.contains('visually-hidden'))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      let horizontalScroller = null;
      for (
        let ancestor = element.parentElement;
        ancestor && ancestor !== document.body;
        ancestor = ancestor.parentElement
      ) {
        const overflowX = getComputedStyle(ancestor).overflowX;
        if (['auto', 'scroll'].includes(overflowX)) {
          horizontalScroller = `${ancestor.tagName.toLowerCase()}:${overflowX}`;
          break;
        }
      }
      return {
        name: `${element.tagName.toLowerCase()}${typeof element.className === 'string' && element.className ? `.${element.className.trim().replace(/\s+/g, '.')}` : ''}`,
        left: rect.left,
        right: rect.right,
        horizontalScroller,
      };
    })
    .filter(({ left, right, horizontalScroller }) => (
      !horizontalScroller && (left < -1 || right > viewportWidth + 1)
    ))
    .slice(0, 8);
  return {
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    offenders,
  };
});

try {
  if (!process.env.QA_BASE_URL) {
    preview = spawn(
      path.join(projectDirectory, 'node_modules/.bin/astro'),
      ['preview', '--host', '127.0.0.1', '--port', '4376'],
      { cwd: projectDirectory, stdio: 'ignore' },
    );
    let ready = false;
    for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
      if (preview.exitCode !== null || preview.signalCode !== null) break;
      try {
        ready = (await fetch(`${baseURL}/briques/b0/`)).ok;
      } catch {}
      if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
    }
    if (!ready) {
      throw new Error(`Preview indisponible sur ${baseURL}. Lancez d’abord npm run build.`);
    }
  }

  browser = await chromium.launch({ channel: 'chrome', headless: true });

  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const desktopPage = await desktopContext.newPage();
  listenForPageErrors(desktopPage);
  const requests = [];
  desktopPage.on('request', (request) => {
    requests.push({
      method: request.method(),
      resourceType: request.resourceType(),
      url: request.url(),
    });
  });

  await openRoute(desktopPage, '/briques/b0/');
  await desktopPage.locator('input[value="openai"]').check();
  await desktopPage.waitForFunction(() => (
    localStorage.getItem('bloc-b-ecosystem') === 'openai'
  ));

  await openRoute(desktopPage, '/briques/b1/');
  await assertOnlyPanel(desktopPage, 'openai');
  await desktopPage.locator('input[value="claude"]').check();
  await desktopPage.waitForFunction(() => (
    localStorage.getItem('bloc-b-ecosystem') === 'claude'
  ));

  await openRoute(desktopPage, '/briques/b2/');
  await assertOnlyPanel(desktopPage, 'claude');

  await openRoute(desktopPage, '/briques/b3/');
  const b3NavigationRequests = [...requests];
  requests.length = 0;

  const fileInput = desktopPage.locator('input[name="brief"]');
  const originalsInput = desktopPage.locator('input[name="originals"]');
  const submitButton = desktopPage.locator('[data-block-b-brief-validator] button[type="submit"]');
  await fileInput.setInputFiles({
    name: 'brief-du-jour.md',
    mimeType: 'text/markdown',
    buffer: Buffer.from(validBrief),
  });
  await originalsInput.check();
  await submitButton.click();
  await desktopPage.waitForFunction(() => (
    document.querySelectorAll('[data-block-b-brief-results] [data-state="pass"]').length === 4
  ));
  if (requests.length !== 0) {
    failures.push(`validation conforme B3 : ${requests.length} requête(s) après vidage (${requests.map(({ method, url }) => `${method} ${url}`).join(', ')})`);
  }

  await fileInput.setInputFiles({
    name: 'brief-du-jour.md',
    mimeType: 'text/markdown',
    buffer: Buffer.from(invalidBrief),
  });
  await submitButton.click();
  await desktopPage.waitForFunction(() => (
    document.querySelectorAll('[data-block-b-brief-results] [data-state="fail"]').length >= 1
  ));
  if (requests.length !== 0) {
    failures.push(`validation invalide B3 : ${requests.length} requête(s) après vidage (${requests.map(({ method, url }) => `${method} ${url}`).join(', ')})`);
  }
  await desktopContext.close();

  const noScriptContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    javaScriptEnabled: false,
  });
  const noScriptPage = await noScriptContext.newPage();
  listenForPageErrors(noScriptPage);
  await openRoute(noScriptPage, '/briques/b1/');
  await assertBothPanelsVisible(noScriptPage);
  await noScriptContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  listenForPageErrors(mobilePage);
  for (const route of mobileRoutes) {
    await openRoute(mobilePage, route);
    const layout = await inspectHorizontalLayout(mobilePage);
    if (layout.scrollWidth > layout.clientWidth + 1 || layout.offenders.length) {
      failures.push(`${route} mobile ${layout.clientWidth}/${layout.scrollWidth}px ${layout.offenders.map(({ name, left, right, horizontalScroller }) => `${name}:${left.toFixed(1)}..${right.toFixed(1)} in ${horizontalScroller ?? 'document'}`).join(', ')}`);
    }
  }
  await mobileContext.close();

  if (b3NavigationRequests.length === 0) {
    failures.push('B3 : aucune requête de navigation mémorisée avant vidage');
  }
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  await cleanup();
  process.removeListener('exit', stopPreviewImmediately);
  process.removeListener('SIGINT', handleSignal);
  process.removeListener('SIGTERM', handleSignal);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('QA wiki Bloc B : voie OpenAI puis Claude persistées de B0 à B2, 4/4 contrôles conformes et échec sans À confirmer sur B3 avec 0 requête, deux voies no-JS sur B1 et B0 à B4 sans débordement à 390×844.');
}
