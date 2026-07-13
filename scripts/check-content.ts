import { fileURLToPath } from 'node:url';

import { loadBrickDocuments } from '../src/content/brick-files';
import { validateBrickDocuments } from '../src/content/brick-model';

const contentDirectory = fileURLToPath(
  new URL('../src/content/briques', import.meta.url),
);
const documents = await loadBrickDocuments(contentDirectory);
const issues = validateBrickDocuments(documents);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.filePath}: ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Contenu valide : ${documents.length} briques contrôlées.`);
}
