import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
};

createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  const target = path.resolve(directory, relative);
  if (!target.startsWith(`${directory}${path.sep}`) && target !== path.join(directory, 'index.html')) {
    response.writeHead(403).end('Interdit');
    return;
  }
  try {
    if (!(await stat(target)).isFile()) throw new Error('not-file');
    response.writeHead(200, { 'content-type': contentTypes[path.extname(target)] ?? 'application/octet-stream' });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404).end('Introuvable');
  }
}).listen(4174, '127.0.0.1', () => {
  console.log('Mini-page ouverte sur http://127.0.0.1:4174');
});
