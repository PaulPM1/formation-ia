import type { BrickFrontmatter } from '../content/brick-model';

export const SLIDE_ROLES = [
  'opening', 'claim', 'explanation', 'demonstration', 'mission',
  'checkpoint', 'resources', 'transition',
] as const;

export const SLIDE_VISUAL_KEYS = [
  'mission-board', 'checkpoint', 'resource-rail',
  'token-predictor', 'context-comparison', 'solution-comparison',
  'solution-prioritizer', 'model-cost-guide', 'context-budget', 'verification-audit',
  'setup-diagnostic', 'prompt-builder', 'artifact-test-loop',
  'pacte-workspace', 'ipmtr-loop', 'workspace-triptych',
  'skill-anatomy', 'mcp-connection-map', 'trigger-timeline',
] as const;

export type SlideRole = (typeof SLIDE_ROLES)[number];
export type SlideVisualKey = (typeof SLIDE_VISUAL_KEYS)[number];
export type PresentationFamily = BrickFrontmatter['family'];

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
  claim: string;
  support?: string;
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
  slides: PresentationSlide[];
};

export type RoutedSlide = PresentationSlide & {
  brickId: string;
  family: PresentationFamily;
  brickTitle: string;
  route: string;
  absoluteIndex: number;
  total: number;
};
