import type { Guide } from '../parcours-model';
import { NAISSANCE_PROJET } from './naissance-projet';
import { MISE_EN_LIGNE } from './mise-en-ligne';
import { CLE_API } from './cle-api';

export const GUIDES: Guide[] = [NAISSANCE_PROJET, MISE_EN_LIGNE, CLE_API];

export function getGuide(id: string): Guide | undefined {
  return GUIDES.find((guide) => guide.id === id);
}

export function cheminGuide(id: string): string {
  return `/demarrer/${id}/`;
}
