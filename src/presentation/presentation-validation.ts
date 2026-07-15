import { BRICK_FAMILIES } from '../content/brick-model';
import {
  SLIDE_ROLES,
  SLIDE_VISUAL_KEYS,
  type PresentationDeck,
  type RoutedSlide,
} from './presentation-model';
import { WIKI_BASE_URL } from './presentation-links';

const allowedDownloadHosts = new Set(['claude.com', 'code.visualstudio.com']);
const allowedOfficialHosts = new Set([
  'agentskills.io', 'anthropic.com', 'www.anthropic.com', 'claude.ai',
  'claude.com', 'code.claude.com', 'code.visualstudio.com',
  'modelcontextprotocol.io', 'platform.claude.com', 'status.claude.com',
  'support.claude.com',
]);
const visualKeys = new Set<string>(SLIDE_VISUAL_KEYS);
const slideRoles = new Set<string>(SLIDE_ROLES);
const families = new Set<string>(BRICK_FAMILIES);
const linkKinds = new Set(['wiki', 'official', 'download', 'digression']);
const brickIdPattern = /^[a-f]\d+(?:-bis)?$/;
const slideIdPattern = /^[a-f]\d+(?:bis)?-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export function validatePresentation(decks: PresentationDeck[]): string[] {
  const issues: string[] = [];
  const deckIds = new Set<string>();
  const slideIds = new Set<string>();
  const deckOrders = new Set<number>();

  for (const deck of decks) {
    if (!brickIdPattern.test(deck.brickId)) {
      issues.push(`Identifiant de brique invalide : ${deck.brickId || '(vide)'}`);
    }
    if (!families.has(deck.family)) issues.push(`Famille invalide : ${String(deck.family)}`);
    if (brickIdPattern.test(deck.brickId) && deck.family !== deck.brickId[0]) {
      issues.push(`Famille incohérente : ${deck.brickId} appartient à ${deck.brickId[0].toUpperCase()}`);
    }
    if (!Number.isInteger(deck.order) || deck.order <= 0) {
      issues.push(`Ordre invalide : ${deck.brickId} utilise ${String(deck.order)}`);
    } else if (deckOrders.has(deck.order)) {
      issues.push(`Ordre de brique dupliqué : ${deck.order}`);
    }
    deckOrders.add(deck.order);
    if (deckIds.has(deck.brickId)) issues.push(`Brique dupliquée : ${deck.brickId}`);
    deckIds.add(deck.brickId);
    if (!deck.title?.trim()) issues.push(`Titre de brique vide : ${deck.brickId}`);
    if (deck.slides.length === 0) issues.push(`Brique sans slide : ${deck.brickId}`);

    for (const slide of deck.slides) {
      if (!slideIdPattern.test(slide.id)) issues.push(`Identifiant de slide invalide : ${slide.id || '(vide)'}`);
      const slidePrefix = deck.brickId.replace('-bis', 'bis');
      if (!slide.id.startsWith(`${slidePrefix}-`)) {
        issues.push(`La slide ${slide.id} n’appartient pas à la brique ${deck.brickId}`);
      }
      if (slideIds.has(slide.id)) issues.push(`Identifiant de slide dupliqué : ${slide.id}`);
      slideIds.add(slide.id);
      if (!slideRoles.has(slide.role)) issues.push(`Rôle invalide : ${String(slide.role)} (${slide.id})`);
      if (!isRecord(slide.visual)) {
        issues.push(`Contrat visuel invalide : ${slide.id}`);
      } else {
        if (!visualKeys.has(String(slide.visual.key))) issues.push(`Visuel inconnu : ${String(slide.visual.key)}`);
        if (!isRecord(slide.visual.data)) issues.push(`Données visuelles invalides : ${slide.id}`);
      }
      if (!slide.claim.trim()) issues.push(`Thèse vide : ${slide.id}`);
      if (!slide.accessibleDescription.trim()) issues.push(`Description accessible vide : ${slide.id}`);
      if (!isRecord(slide.speaker)) {
        issues.push(`Notes formateur invalides : ${slide.id}`);
      } else {
        if (typeof slide.speaker.durationMinutes !== 'number'
          || !Number.isFinite(slide.speaker.durationMinutes)
          || slide.speaker.durationMinutes <= 0) {
          issues.push(`Durée formateur invalide : ${slide.id}`);
        }
        if (typeof slide.speaker.notes !== 'string' || !slide.speaker.notes.trim()) {
          issues.push(`Notes formateur vides : ${slide.id}`);
        }
        if (typeof slide.speaker.transition !== 'string' || !slide.speaker.transition.trim()) {
          issues.push(`Transition formateur vide : ${slide.id}`);
        }
      }
      if (!Array.isArray(slide.links)) {
        issues.push(`Liste de liens invalide : ${slide.id}`);
        continue;
      }
      for (const link of slide.links) {
        if (!isRecord(link)) {
          issues.push(`Lien invalide : ${slide.id}`);
          continue;
        }
        if (!linkKinds.has(String(link.kind))) issues.push(`Type de lien invalide : ${slide.id}`);
        if (typeof link.label !== 'string' || !link.label.trim()) issues.push(`Libellé de lien vide : ${slide.id}`);
        if (link.target !== '_blank') issues.push(`Cible de lien invalide : ${slide.id}`);
        if (link.rel !== 'noopener noreferrer') issues.push(`Relation de lien invalide : ${slide.id}`);
        let url: URL;
        try {
          url = new URL(String(link.href));
        } catch {
          issues.push(`URL invalide : ${slide.id}`);
          continue;
        }
        if (url.protocol !== 'https:') issues.push(`Lien non HTTPS : ${slide.id}`);
        if (link.kind === 'wiki' && url.origin !== WIKI_BASE_URL) {
          issues.push(
            `Lien wiki non canonique : ${slide.id} utilise ${url.origin}; `
            + `origine attendue : ${WIKI_BASE_URL}.`,
          );
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
