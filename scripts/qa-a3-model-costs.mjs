import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4383';
const routes = {
  models: '/presenter/a3/a3-model-fit/',
  costs: '/presenter/a3/a3-api-cost/',
  access: '/presenter/a3/a3-access/',
};
const hybridConclusion = 'Aujourd’hui, l’abonnement peut donner une capacité qui coûterait davantage au tarif API. Ce rapport peut changer.';
const accessReference = '100 dossiers via API : environ 22,50 à 150 $ selon le modèle';
const intensivePlans = 'Offres intensives : 100 à 250 $/mois · quotas non équivalents';
const accessSnapshot = 'Ordres de grandeur au 21 juillet 2026';
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
  const isIntentionallyHidden = (element) => {
    for (let current = element; current && guide?.contains(current); current = current.parentElement) {
      const style = getComputedStyle(current);
      if (style.display === 'none'
        || style.visibility === 'hidden'
        || Number(style.opacity) === 0) return true;
      const isVisuallyHidden = current.matches('.visually-hidden')
        && style.position === 'absolute'
        && current.clientWidth <= 1
        && current.clientHeight <= 1
        && style.clipPath !== 'none'
        && ['hidden', 'clip'].includes(style.overflowX)
        && ['hidden', 'clip'].includes(style.overflowY);
      if (isVisuallyHidden) return true;
      const isMobileTableHead = current.matches('.model-guide__cost-table thead')
        && style.position === 'absolute'
        && style.clipPath === 'inset(50%)'
        && ['hidden', 'clip'].includes(style.overflowX)
        && ['hidden', 'clip'].includes(style.overflowY);
      if (isMobileTableHead) return true;
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
  const descendantOverflow = [];
  const outsideGuide = [];
  const outsideViewport = [];

  if (guide && slide) {
    const guideRect = guide.getBoundingClientRect();
    const visibleDescendants = [...guide.querySelectorAll('*')]
      .filter((element) => !isIntentionallyHidden(element));

    for (const element of visibleDescendants) {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;
      if (element.scrollWidth > element.clientWidth + tolerance) {
        descendantOverflow.push(`${label(element)} ${element.clientWidth}/${element.scrollWidth}px`);
      }
      if (rect.left < guideRect.left - tolerance || rect.right > guideRect.right + tolerance) {
        outsideGuide.push(`${label(element)} ${Math.round(rect.left - guideRect.left)}/${Math.round(rect.right - guideRect.right)}px`);
      }
      if (rect.left < -tolerance || rect.right > window.innerWidth + tolerance) {
        outsideViewport.push(`${label(element)} ${Math.round(rect.left)}/${Math.round(rect.right)}px`);
      }
    }

    const walker = document.createTreeWalker(guide, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent?.trim()) continue;
      const parent = node.parentElement;
      if (!parent || isIntentionallyHidden(parent)) continue;
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
    descendantOverflow: [...new Set(descendantOverflow)],
    outsideGuide: [...new Set(outsideGuide)],
    outsideViewport: [...new Set(outsideViewport)],
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
  if (layout.descendantOverflow.length) {
    failures.push(`${label} : descendants en débordement (${layout.descendantOverflow.join(', ')})`);
  }
  if (layout.outsideGuide.length) {
    failures.push(`${label} : descendants hors du guide (${layout.outsideGuide.join(', ')})`);
  }
  if (layout.outsideViewport.length) {
    failures.push(`${label} : descendants hors du viewport (${layout.outsideViewport.join(', ')})`);
  }
};

try {
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await desktop.newPage();

  await page.goto(`${baseURL}${routes.models}`, { waitUntil: 'load' });
  await stabilize(page);
  const tierChoices = page.locator('input[type="radio"][data-tier-choice]');
  const tierRows = page.locator('[data-tier-row]');
  if (await tierChoices.count() !== 3) failures.push('modèles desktop : trois niveaux de contrôle attendus');
  if (!await page.locator('.model-guide__tier-controls').isVisible()) failures.push('modèles desktop : sélecteur amélioré invisible');
  if (await tierRows.count() !== 3) failures.push('modèles desktop : trois lignes de niveau attendues');
  const exigenceRadio = page.locator('input[type="radio"][data-tier-choice][value="exigence"]');
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
  if (!await page.locator('.model-guide__volume-controls').isVisible()) failures.push('coûts desktop : sélecteur amélioré invisible');
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
    const expectedSummary = {
      '1': '1 dossier : coûts de 0,225 à 1,50 dollars',
      '10': '10 dossiers : coûts de 2,25 à 15 dollars',
      '100': '100 dossiers : coûts de 22,50 à 150 dollars',
    }[expectation.volume];
    const summary = page.locator('[data-cost-summary]');
    if (await summary.count() !== 1
      || await summary.getAttribute('aria-live') !== 'polite'
      || await summary.getAttribute('aria-atomic') !== 'true'
      || await normalizedText(summary) !== expectedSummary) {
      failures.push(`coûts desktop : résumé vocal incorrect pour ${expectation.volume} dossiers`);
    }
  }
  const costCollision = await page.evaluate(() => {
    const controlsTop = document.querySelector('.presentation-controls')?.getBoundingClientRect().top ?? window.innerHeight;
    const lastRow = document.querySelector('.model-guide__cost-table tbody tr:last-child')?.getBoundingClientRect();
    const caveat = document.querySelector('.model-guide__caveat')?.getBoundingClientRect();
    return {
      controlsTop,
      lastRowBottom: lastRow?.bottom ?? Number.POSITIVE_INFINITY,
      caveatTop: caveat?.top ?? Number.NEGATIVE_INFINITY,
      caveatBottom: caveat?.bottom ?? Number.POSITIVE_INFINITY,
    };
  });
  if (costCollision.lastRowBottom > costCollision.controlsTop - 1
    || costCollision.caveatBottom > costCollision.controlsTop - 1
    || costCollision.caveatTop < costCollision.lastRowBottom - 1) {
    failures.push(`coûts desktop 1280 × 720 : tableau ou réserve chevauche les contrôles (${JSON.stringify(costCollision)})`);
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
  for (const exactText of [accessReference, intensivePlans, accessSnapshot]) {
    const locator = page.getByText(exactText, { exact: true });
    if (await locator.count() !== 1 || !await locator.isVisible()) {
      failures.push(`accès desktop : repère absent ${JSON.stringify(exactText)}`);
    }
  }
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobile.newPage();
  for (const [name, route] of Object.entries(routes)) {
    await mobilePage.goto(`${baseURL}${route}`, { waitUntil: 'load' });
    await stabilize(mobilePage);
    if (name === 'models') {
      for (const tier of ['balance', 'volume', 'exigence']) {
        await mobilePage.locator(`[data-tier-choice][value="${tier}"]`).check();
        const hierarchy = await mobilePage.evaluate(() => {
          const checkedTier = document.querySelector('[data-tier-choice]:checked')?.value ?? '';
          const visibleRows = [...document.querySelectorAll('[data-tier-row]')]
            .filter((row) => {
              const style = getComputedStyle(row);
              const rect = row.getBoundingClientRect();
              return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
            });
          const visuallyFirstTier = visibleRows
            .map((row) => ({ tier: row.dataset.tierRow ?? '', top: row.getBoundingClientRect().top }))
            .sort((left, right) => left.top - right.top)[0]?.tier ?? '';
          const activeHeading = visibleRows
            .find((row) => row.dataset.tierRow === checkedTier)
            ?.querySelector('h3');
          const controlsTop = document.querySelector('.presentation-controls')?.getBoundingClientRect().top
            ?? window.innerHeight;
          return {
            checkedTier,
            visibleTierCount: visibleRows.length,
            visuallyFirstTier,
            activeHeadingBottom: activeHeading?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY,
            effectiveViewportBottom: Math.min(window.innerHeight, controlsTop),
          };
        });
        if (hierarchy.visibleTierCount !== 3
          || hierarchy.visuallyFirstTier !== hierarchy.checkedTier
          || hierarchy.activeHeadingBottom > hierarchy.effectiveViewportBottom + 1) {
          failures.push(`modèles mobile 390 px : les trois niveaux doivent rester visibles et ${hierarchy.checkedTier || 'absent'} doit être géométriquement premier`);
        }
      }
      await mobilePage.locator('[data-tier-choice][value="balance"]').check();
    }
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
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reduced.newPage();
  for (const [name, route] of Object.entries(routes)) {
    await reducedPage.goto(`${baseURL}${route}`, { waitUntil: 'load' });
    await stabilize(reducedPage);
    const motion = await reducedPage.locator('[data-model-cost-guide]').evaluate((guide) => {
      const isIntentionallyHidden = (element) => {
        for (let current = element; current && guide.contains(current); current = current.parentElement) {
          const style = getComputedStyle(current);
          if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return true;
          const isVisuallyHidden = current.matches('.visually-hidden')
            && style.position === 'absolute'
            && current.clientWidth <= 1
            && current.clientHeight <= 1
            && style.clipPath !== 'none'
            && ['hidden', 'clip'].includes(style.overflowX)
            && ['hidden', 'clip'].includes(style.overflowY);
          if (isVisuallyHidden) return true;
          const isMobileTableHead = current.matches('.model-guide__cost-table thead')
            && style.position === 'absolute'
            && style.clipPath === 'inset(50%)'
            && ['hidden', 'clip'].includes(style.overflowX)
            && ['hidden', 'clip'].includes(style.overflowY);
          if (isMobileTableHead) return true;
        }
        return false;
      };
      const elements = [guide, ...guide.querySelectorAll('*')]
        .filter((element) => !isIntentionallyHidden(element));
      const nonZeroDuration = (value) => value.split(',').some((duration) => Number.parseFloat(duration) > 0);
      return elements.flatMap((element) => {
        return ['', '::before', '::after'].flatMap((pseudo) => {
          const style = getComputedStyle(element, pseudo);
          if (pseudo && ['none', 'normal'].includes(style.content)) return [];
          const target = `${element.tagName.toLowerCase()}${pseudo}`;
          const issues = [];
          if (style.animationName.split(',').some((animation) => animation.trim() !== 'none')
            || nonZeroDuration(style.animationDuration)) issues.push(`${target} animation ${style.animationName}/${style.animationDuration}`);
          if (nonZeroDuration(style.transitionDuration)) issues.push(`${target} transition ${style.transitionDuration}`);
          return issues;
        });
      });
    });
    if (motion.length) failures.push(`${name} mouvement réduit : ${[...new Set(motion)].join(', ')}`);
  }
  await reduced.close();

  const noScript = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  });
  const noScriptPage = await noScript.newPage();

  await noScriptPage.goto(`${baseURL}${routes.models}`, { waitUntil: 'load' });
  await noScriptPage.waitForTimeout(100);
  if (await noScriptPage.locator('[data-tier-row]:visible').count() !== 3) {
    failures.push('modèles sans JavaScript : les trois niveaux ne sont pas visibles');
  }
  if (await noScriptPage.locator('.model-guide__tier-controls:visible').count() !== 0
    || await noScriptPage.locator('[data-tier-choice]:visible').count() !== 0) {
    failures.push('modèles sans JavaScript : le sélecteur inopérant reste visible');
  }
  const noScriptModelsLayout = await inspectLayout(noScriptPage);
  checkHorizontalOverflow(noScriptModelsLayout, 'modèles sans JavaScript');
  if (noScriptModelsLayout.clippedText.length) failures.push(`modèles sans JavaScript : texte visible rogné (${noScriptModelsLayout.clippedText.join(', ')})`);

  await noScriptPage.goto(`${baseURL}${routes.costs}`, { waitUntil: 'load' });
  await noScriptPage.waitForTimeout(100);
  const noScriptCostRows = noScriptPage.locator('.model-guide__cost-table tbody tr:visible');
  if (await noScriptCostRows.count() !== 6) failures.push('coûts sans JavaScript : six lignes attendues');
  if (await noScriptPage.locator('.model-guide__volume-controls:visible').count() !== 0
    || await noScriptPage.locator('[data-volume-choice]:visible').count() !== 0) {
    failures.push('coûts sans JavaScript : le sélecteur inopérant reste visible');
  }
  for (let index = 0; index < await noScriptCostRows.count(); index += 1) {
    const row = noScriptCostRows.nth(index);
    const unitCell = row.locator('[data-label="1 dossier"]');
    const hundredCell = row.locator('[data-label="100 dossiers"][data-volume-cost]');
    const unit = await normalizedText(unitCell);
    const hundred = await normalizedText(hundredCell);
    if (await unitCell.count() !== 1 || !await unitCell.isVisible() || !unit
      || await hundredCell.count() !== 1 || !await hundredCell.isVisible() || !hundred) {
      failures.push(`coûts sans JavaScript : cellules 1 et 100 dossiers illisibles ligne ${index + 1}`);
    }
  }
  const noScriptCostsLayout = await inspectLayout(noScriptPage);
  checkHorizontalOverflow(noScriptCostsLayout, 'coûts sans JavaScript');
  if (noScriptCostsLayout.clippedText.length) failures.push(`coûts sans JavaScript : texte visible rogné (${noScriptCostsLayout.clippedText.join(', ')})`);

  await noScriptPage.goto(`${baseURL}${routes.access}`, { waitUntil: 'load' });
  await noScriptPage.waitForTimeout(100);
  if (await noScriptPage.locator('.model-guide__access article:visible').count() !== 2) {
    failures.push('accès sans JavaScript : les deux colonnes ne sont pas visibles');
  }
  for (const heading of ['Abonnement', 'API']) {
    if (!await noScriptPage.getByText(heading, { exact: true }).isVisible()) {
      failures.push(`accès sans JavaScript : colonne ${heading} absente`);
    }
  }
  const noScriptAccessLayout = await inspectLayout(noScriptPage);
  checkHorizontalOverflow(noScriptAccessLayout, 'accès sans JavaScript');
  if (noScriptAccessLayout.clippedText.length) failures.push(`accès sans JavaScript : texte visible rogné (${noScriptAccessLayout.clippedText.join(', ')})`);
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
