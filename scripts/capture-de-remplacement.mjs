// Genere un PNG de remplacement, raye en diagonale, impossible a confondre
// avec une vraie capture d'ecran. Usage : node scripts/capture-de-remplacement.mjs <chemin>
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const LARGEUR = 1200;
const HAUTEUR = 675;

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

const crc32 = (buffer) => {
  let c = 0xffffffff;
  for (const octet of buffer) c = crcTable[(c ^ octet) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const longueur = Buffer.alloc(4);
  longueur.writeUInt32BE(data.length);
  const corps = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const somme = Buffer.alloc(4);
  somme.writeUInt32BE(crc32(corps));
  return Buffer.concat([longueur, corps, somme]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(LARGEUR, 0);
ihdr.writeUInt32BE(HAUTEUR, 4);
ihdr[8] = 8;
ihdr[9] = 2;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

// Rayures diagonales jaune et gris, la signature visuelle d'un contenu absent.
const lignes = [];
for (let y = 0; y < HAUTEUR; y += 1) {
  const ligne = Buffer.alloc(1 + LARGEUR * 3);
  ligne[0] = 0;
  for (let x = 0; x < LARGEUR; x += 1) {
    const bande = Math.floor((x + y) / 48) % 2 === 0;
    const i = 1 + x * 3;
    ligne[i] = bande ? 0xff : 0x59;
    ligne[i + 1] = bande ? 0xbf : 0x64;
    ligne[i + 2] = bande ? 0x3f : 0x5e;
  }
  lignes.push(ligne);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(Buffer.concat(lignes), { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

const cible = process.argv[2];
if (!cible) {
  console.error('Usage : node scripts/capture-de-remplacement.mjs <chemin>');
  process.exit(1);
}
mkdirSync(path.dirname(cible), { recursive: true });
writeFileSync(cible, png);
console.log(`${cible} : ${png.length} octets, ${LARGEUR}x${HAUTEUR}`);
