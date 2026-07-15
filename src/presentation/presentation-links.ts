import type { PresentationLink } from './presentation-model';

export const WIKI_BASE_URL = 'https://formation-ia-ruby.vercel.app';

export function wikiLink(brickId: string, anchor: string, label: string): PresentationLink {
  return {
    kind: 'wiki',
    label,
    href: `${WIKI_BASE_URL}/briques/${brickId}/#${anchor}`,
  };
}

export function externalLink(
  kind: Exclude<PresentationLink['kind'], 'wiki'>,
  label: string,
  href: string,
): PresentationLink {
  return { kind, label, href };
}
