export const FONT_WAIT_TIMEOUT_MS = 1500;

export async function navigateAndWaitForFonts(page, url, {
  navigationTimeout = 15000,
  fontTimeout = FONT_WAIT_TIMEOUT_MS,
} = {}) {
  const response = await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: navigationTimeout,
  });
  const fontStatus = await page.evaluate(async (timeout) => {
    if (!document.fonts?.ready) return 'unsupported';
    return Promise.race([
      document.fonts.ready.then(() => 'ready'),
      new Promise((resolve) => setTimeout(() => resolve('timeout'), timeout)),
    ]);
  }, fontTimeout);
  return { response, fontStatus };
}
