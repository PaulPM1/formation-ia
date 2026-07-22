import type { PresentationLink } from './presentation-model';

export const WIKI_BASE_URL = 'https://formation-ia-ruby.vercel.app';

export function wikiLink(brickId: string, anchor: string, label: string): PresentationLink {
  return {
    kind: 'wiki',
    label,
    href: `${WIKI_BASE_URL}/briques/${brickId}/#${anchor}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  };
}

export function kitLink(path: string, label: string): PresentationLink {
  const normalized = path.replace(/^\/+/, '');
  if (!normalized || normalized.includes('..') || /^https?:/i.test(normalized)) {
    throw new Error(`Chemin de kit invalide : ${path || '(vide)'}`);
  }
  const kitPath = normalized.startsWith('kits/') ? normalized : `kits/${normalized}`;
  return {
    kind: 'download',
    label,
    href: `${WIKI_BASE_URL}/${kitPath}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  };
}

export function externalLink(
  kind: Exclude<PresentationLink['kind'], 'wiki'>,
  label: string,
  href: string,
): PresentationLink {
  return { kind, label, href, target: '_blank', rel: 'noopener noreferrer' };
}
