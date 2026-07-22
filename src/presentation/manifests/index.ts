import { flattenSlides } from '../presentation-validation';
import type { PresentationDeck } from '../presentation-model';
import { A_DECKS } from './a';
import { B_DECKS } from './b';
import { C_DECKS } from './c';
import { D_DECKS } from './d';
import { E_DECKS } from './e';

export const PRESENTATION_DECKS: PresentationDeck[] = [
  ...A_DECKS,
  ...B_DECKS,
  ...C_DECKS,
  ...D_DECKS,
  ...E_DECKS,
];
export const PRESENTATION_SLIDES = flattenSlides(PRESENTATION_DECKS);

export function getPresentationSlide(brickId: string, slideId: string) {
  return PRESENTATION_SLIDES.find(
    (slide) => slide.brickId === brickId && slide.id === slideId,
  );
}
