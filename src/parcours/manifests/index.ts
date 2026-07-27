import type { Guide } from '../parcours-model';
import { NAISSANCE_PROJET } from './naissance-projet';

export const GUIDES: Guide[] = [NAISSANCE_PROJET];

export function getGuide(id: string): Guide | undefined {
  return GUIDES.find((guide) => guide.id === id);
}
