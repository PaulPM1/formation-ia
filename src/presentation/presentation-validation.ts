import { SLIDE_VISUAL_KEYS, type PresentationDeck, type RoutedSlide } from './presentation-model';
import { WIKI_BASE_URL } from './presentation-links';

const allowedDownloadHosts = new Set(['claude.com', 'code.visualstudio.com']);
const allowedOfficialHosts = new Set([
  'agentskills.io', 'anthropic.com', 'www.anthropic.com', 'claude.ai',
  'claude.com', 'code.claude.com', 'code.visualstudio.com',
  'docs.anthropic.com', 'modelcontextprotocol.io', 'status.anthropic.com',
  'support.anthropic.com', 'support.claude.com',
]);
const visualKeys = new Set<string>(SLIDE_VISUAL_KEYS);

export function validatePresentation(decks: PresentationDeck[]): string[] {
  const issues: string[] = [];
  const deckIds = new Set<string>();
  const slideIds = new Set<string>();

  for (const deck of decks) {
    if (deckIds.has(deck.brickId)) issues.push(`Brique dupliquée : ${deck.brickId}`);
    deckIds.add(deck.brickId);
    if (deck.slides.length === 0) issues.push(`Brique sans slide : ${deck.brickId}`);

    for (const slide of deck.slides) {
      if (slideIds.has(slide.id)) issues.push(`Identifiant de slide dupliqué : ${slide.id}`);
      slideIds.add(slide.id);
      if (!visualKeys.has(slide.visual.key)) issues.push(`Visuel inconnu : ${slide.visual.key}`);
      if (!slide.claim.trim()) issues.push(`Thèse vide : ${slide.id}`);
      if (!slide.accessibleDescription.trim()) issues.push(`Description accessible vide : ${slide.id}`);
      for (const link of slide.links) {
        let url: URL;
        try {
          url = new URL(link.href);
        } catch {
          issues.push(`URL invalide : ${slide.id}`);
          continue;
        }
        if (url.protocol !== 'https:') issues.push(`Lien non HTTPS : ${slide.id}`);
        if (link.kind === 'wiki' && url.origin !== WIKI_BASE_URL) {
          issues.push(`Lien wiki non canonique : ${slide.id}`);
        }
        if (link.kind === 'download' && !allowedDownloadHosts.has(url.hostname)) {
          issues.push(`Téléchargement non officiel : ${slide.id}`);
        }
        if (link.kind === 'official' && !allowedOfficialHosts.has(url.hostname)) {
          issues.push(`Source officielle non approuvée : ${slide.id}`);
        }
      }
    }
  }
  return issues;
}

export function flattenSlides(decks: PresentationDeck[]): RoutedSlide[] {
  const total = decks.reduce((sum, deck) => sum + deck.slides.length, 0);
  let absoluteIndex = 0;

  return decks.flatMap((deck) => deck.slides.map((slide) => ({
    ...slide,
    brickId: deck.brickId,
    family: deck.family,
    brickTitle: deck.title,
    route: `/presenter/${deck.brickId}/${slide.id}/`,
    absoluteIndex: absoluteIndex++,
    total,
  })));
}

export function getSlideNeighbors(slides: RoutedSlide[], slideId: string) {
  const index = slides.findIndex((slide) => slide.id === slideId);
  if (index < 0) throw new Error(`Slide inconnue : ${slideId}`);
  return {
    previous: slides[index - 1] ?? null,
    next: slides[index + 1] ?? null,
  };
}
