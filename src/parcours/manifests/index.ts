import type { Guide } from '../parcours-model';
import { MISE_EN_LIGNE } from './mise-en-ligne';
import { CLE_API } from './cle-api';

export const GUIDES: Guide[] = [MISE_EN_LIGNE, CLE_API];

export function getGuide(id: string): Guide | undefined {
  return GUIDES.find((guide) => guide.id === id);
}

export function cheminGuide(id: string): string {
  return `/faq/${id}/`;
}
