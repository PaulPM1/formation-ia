import type { BrickFrontmatter } from '../content/brick-model';

export const SLIDE_ROLES = [
  'opening', 'claim', 'explanation', 'demonstration', 'mission',
  'checkpoint', 'resources', 'transition',
] as const;

/**
 * Cinq formes de slide, pas une de plus :
 * - `cover` : un titre seul, en grand ;
 * - `visual` : un visuel de brique (`data.name`, fichier de
 *   `src/components/briques/`), avec `data.props` et `data.layout` (`side`
 *   pour un visuel étroit posé à droite des points) ;
 * - `quiz` : une question, des réponses, une seule bonne ;
 * - `sort` : des cartes à ranger dans deux cases ;
 * - `demo` : la consigne d'une démonstration en direct.
 */
export const SLIDE_VISUAL_KEYS = ['cover', 'visual', 'quiz', 'sort', 'demo'] as const;

export const MAX_BULLETS = 3;

export type SlideRole = (typeof SLIDE_ROLES)[number];
export type SlideVisualKey = (typeof SLIDE_VISUAL_KEYS)[number];
export type PresentationFamily = BrickFrontmatter['family'];
export type PresentationTrack = 'core' | 'optional' | 'recovery';

export type PresentationLink = {
  kind: 'wiki' | 'official' | 'download' | 'digression';
  label: string;
  href: string;
  target: '_blank';
  rel: 'noopener noreferrer';
};

export type PresentationSlide = {
  id: string;
  role: SlideRole;
  /** Le titre de la slide : une phrase courte, lue en deux secondes. */
  claim: string;
  support?: string;
  /** Trois points au plus, quelques mots chacun. */
  bullets?: string[];
  visual: { key: SlideVisualKey; data: Record<string, unknown> };
  links: PresentationLink[];
  speaker: { durationMinutes: number; notes: string; transition: string };
  accessibleDescription: string;
};

export type PresentationDeck = {
  brickId: string;
  family: PresentationFamily;
  /** Position pédagogique, contiguë à partir de 1 et identique à l'index du tableau + 1. */
  order: number;
  title: string;
  track?: PresentationTrack;
  slides: PresentationSlide[];
};

export type RoutedSlide = PresentationSlide & {
  brickId: string;
  family: PresentationFamily;
  brickTitle: string;
  track: PresentationTrack;
  route: string;
  absoluteIndex: number;
  total: number;
};
