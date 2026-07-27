import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };

const server = createServer(async (request, response) => {
  let cible = path.join(distDir, decodeURI(request.url.split('?')[0]));
  try {
    if ((await stat(cible)).isDirectory()) cible = path.join(cible, 'index.html');
  } catch {
    response.writeHead(404).end();
    return;
  }
  try {
    const corps = await readFile(cible);
    response.writeHead(200, { 'content-type': TYPES[path.extname(cible)] ?? 'application/octet-stream' });
    response.end(corps);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const navigateur = await chromium.launch();
const contexte = await navigateur.newContext({ javaScriptEnabled: false });
const page = await contexte.newPage();

const echecs = [];
const attendu = async (condition, message) => {
  if (!(await condition)) echecs.push(message);
};

for (const chemin of ['/demarrer/', '/demarrer/naissance-projet/', '/demarrer/mise-en-ligne/', '/demarrer/cle-api/']) {
  await page.goto(`${base}${chemin}`);
  await attendu(page.locator('h1').isVisible(), `${chemin} : aucun titre principal visible sans JavaScript.`);
  const texte = await page.locator('main').innerText();
  if (texte.trim().length < 400) {
    echecs.push(`${chemin} : contenu trop court sans JavaScript (${texte.trim().length} caractères).`);
  }
  for (const mot of ['terminal', 'ligne de commande']) {
    if (texte.toLowerCase().includes(mot)) echecs.push(`${chemin} : vocabulaire interdit « ${mot} » rendu à l’écran.`);
  }
}

await page.goto(`${base}/demarrer/naissance-projet/`);
const gestes = await page.locator('.etape-gestes li').count();
await attendu(Promise.resolve(gestes >= 16), `Les gestes ne sont pas rendus sans JavaScript (${gestes} trouvés).`);
const pannes = await page.locator('details.panne').count();
await attendu(Promise.resolve(pannes === 7), `Les pannes du guide 1 ne sont pas toutes rendues (${pannes} trouvées).`);

await navigateur.close();
server.close();

if (echecs.length > 0) {
  for (const echec of echecs) console.error(echec);
  process.exit(1);
}
console.log('QA demarrer : les quatre pages sont lisibles sans JavaScript.');
