import { readFileSync } from 'node:fs';

export type DimensionsPng = { largeur: number; hauteur: number };

// Signature fixe qui ouvre tout fichier PNG (huit octets, RFC 2083).
const SIGNATURE_PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Lit les dimensions d'un PNG dans son en-tete IHDR, sans dependance.
 * Appelee au moment de la construction uniquement.
 */
export function dimensionsPng(cheminAbsolu: string): DimensionsPng {
  // Les 8 octets de signature, puis le chunk IHDR : longueur (4 octets),
  // type "IHDR" (4 octets), largeur (4 octets), hauteur (4 octets). Vingt-
  // quatre octets suffisent donc a tout lire.
  const entete = readFileSync(cheminAbsolu).subarray(0, 24);

  const estPng =
    entete.length >= 24 && SIGNATURE_PNG.every((octet, index) => entete[index] === octet);
  if (!estPng) {
    throw new Error(`Fichier PNG invalide : ${cheminAbsolu}`);
  }

  const largeur = entete.readUInt32BE(16);
  const hauteur = entete.readUInt32BE(20);
  return { largeur, hauteur };
}
