import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { loadBrickDocuments } from '../src/content/brick-files';
import { PRESENTATION_DECKS } from '../src/presentation/manifests';
import { WIKI_BASE_URL } from '../src/presentation/presentation-links';
import type { PresentationDeck } from '../src/presentation/presentation-model';
import { validatePresentation } from '../src/presentation/presentation-validation';

type PresentationCheckResult = {
  issues: string[];
  slideCount: number;
};

type WikiTarget = {
  filePath: string;
  anchors: Set<string>;
};

type PresentationBrickDocument = {
  filePath: string;
  data: { id?: unknown };
  body: string;
};

async function getWikiTargets(
  documents: PresentationBrickDocument[],
  issues: string[],
): Promise<Map<string, WikiTarget>> {
  // Astro's own Markdown processor produces the same heading IDs as the public
  // brick pages, including accents and suffixes for duplicate headings.
  const markdown = await createMarkdownProcessor();
  const targets = new Map<string, WikiTarget>();

  for (const document of documents) {
    const brickId = String(document.data.id ?? '');
    if (!brickId) {
      issues.push(`[${document.filePath}] Impossible de contrôler les ancres : identifiant de brique absent.`);
      continue;
    }

    try {
      const rendered = await markdown.render(document.body);
      targets.set(brickId, {
        filePath: document.filePath,
        anchors: new Set(rendered.metadata.headings.map((heading) => heading.slug)),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      issues.push(`[${brickId}] Impossible d'analyser les ancres de ${document.filePath} : ${message}`);
    }
  }

  return targets;
}

export async function checkPresentation(
  decks: PresentationDeck[],
  documents: PresentationBrickDocument[],
): Promise<PresentationCheckResult> {
  const issues = validatePresentation(decks);
  const wikiTargets = await getWikiTargets(documents, issues);

  for (const deck of decks) {
    if (!wikiTargets.has(deck.brickId)) {
      issues.push(
        `[manifeste ${deck.brickId}] Brique source inconnue. `
        + 'Ajoutez la fiche MDX correspondante ou corrigez brickId.',
      );
    }

    for (const slide of deck.slides) {
      for (const link of slide.links.filter((candidate) => candidate.kind === 'wiki')) {
        let url: URL;
        try {
          url = new URL(link.href);
        } catch {
          // validatePresentation already reports the malformed URL.
          continue;
        }

        if (url.origin !== WIKI_BASE_URL) {
          // validatePresentation already reports the non-canonical origin.
          continue;
        }

        const pathMatch = url.pathname.match(/^\/briques\/([^/]+)\/?$/);
        if (!pathMatch) {
          issues.push(
            `[${slide.id}] Chemin wiki invalide : ${url.pathname}. `
            + 'Format attendu : /briques/<id>/.',
          );
          continue;
        }

        let brickId: string;
        try {
          brickId = decodeURIComponent(pathMatch[1]);
        } catch {
          issues.push(`[${slide.id}] Identifiant wiki mal encodé : ${pathMatch[1]}.`);
          continue;
        }
        const target = wikiTargets.get(brickId);
        if (!target) {
          issues.push(
            `[${slide.id}] Brique wiki inconnue : ${brickId} (${url.pathname}). `
            + 'Vérifiez l’identifiant dans src/content/briques/.',
          );
          continue;
        }

        if (!url.hash) continue;

        let anchor: string;
        try {
          anchor = decodeURIComponent(url.hash.slice(1));
        } catch {
          issues.push(`[${slide.id}] Ancre wiki mal encodée : ${url.hash}.`);
          continue;
        }

        if (!target.anchors.has(anchor)) {
          const available = [...target.anchors].join(', ') || 'aucune';
          issues.push(
            `[${slide.id}] Ancre wiki inconnue : #${anchor} dans ${target.filePath}. `
            + `Ancres disponibles : ${available}.`,
          );
        }
      }
    }
  }

  return {
    issues,
    slideCount: decks.reduce((sum, deck) => sum + deck.slides.length, 0),
  };
}

async function run(): Promise<void> {
  const contentDirectory = fileURLToPath(
    new URL('../src/content/briques', import.meta.url),
  );
  const documents = await loadBrickDocuments(contentDirectory);
  const result = await checkPresentation(PRESENTATION_DECKS, documents);

  if (result.issues.length > 0) {
    for (const issue of result.issues) console.error(issue);
    process.exitCode = 1;
    return;
  }

  console.log(`Présentation valide : ${result.slideCount} slides contrôlées.`);
}

const isDirectExecution = process.argv[1]
  ? fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
  : false;

if (isDirectExecution) await run();
