// Fabrique public/kits/setup-projet.zip : le skill seul, à téléverser dans
// Claude sans passer par le dépôt modèle. Régénéré à chaque build, donc jamais
// désynchronisé de sa source dans kits/kit-projet.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { zipSync } from 'fflate';

const source = new URL('../kits/kit-projet/.claude/skills/setup-projet/SKILL.md', import.meta.url);
const target = new URL('../public/kits/setup-projet.zip', import.meta.url);

await mkdir(new URL('.', target), { recursive: true });
await writeFile(target, zipSync({ 'setup-projet/SKILL.md': new Uint8Array(await readFile(source)) }));
console.log('Skill setup-projet généré : public/kits/setup-projet.zip');
