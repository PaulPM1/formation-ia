import { flattenSlides } from '../presentation-validation';
import { A_DECKS } from './a';
import { B_DECKS } from './b';
import { C_DECKS } from './c';

export const PRESENTATION_DECKS = [...A_DECKS, ...B_DECKS, ...C_DECKS];
export const PRESENTATION_SLIDES = flattenSlides(PRESENTATION_DECKS);

export function getPresentationSlide(brickId: string, slideId: string) {
  return PRESENTATION_SLIDES.find(
    (slide) => slide.brickId === brickId && slide.id === slideId,
  );
}
