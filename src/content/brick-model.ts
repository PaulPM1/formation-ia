import { z } from 'astro/zod';

export const BRICK_FAMILIES = ['a', 'b', 'c', 'd', 'e', 'f'] as const;
export const BRICK_PRIORITIES = ['socle', 'bonus', 'a-trancher'] as const;
export const BRICK_TYPES = [
  'concept',
  'demonstration',
  'workshop',
  'setup',
  'restitution',
] as const;
export const BRICK_PLATFORMS = ['commun', 'mac', 'windows', 'navigateur'] as const;
export const BRICK_STATUSES = ['a-rediger', 'en-cours', 'a-relire', 'validee'] as const;
export const BRICK_OWNERS = ['paul', 'matthieu', 'a-attribuer'] as const;

export const COMMON_HEADINGS = [
  'Cap',
  'Concept durable',
  'Pratique avec Claude',
  'Mission commune',
  'Livrable',
  'Notes formateur',
  'Défis avancés',
  'Variantes',
  'Dépannage',
  'Ressources',
  'Ouverture',
] as const;

export const TYPE_HEADINGS = {
  concept: [],
  demonstration: ['Scénario de démonstration', 'Déroulé de démonstration'],
  workshop: ['Étapes', 'Critères de réussite'],
  setup: ['Diagnostic initial', 'Test final', 'Dépannage Mac', 'Dépannage Windows'],
  restitution: ['Consigne de restitution', 'Grille de feedback'],
} as const satisfies Record<(typeof BRICK_TYPES)[number], readonly string[]>;

const nullableEditorialText = z.string().trim().min(1).nullable();

export const brickFrontmatterSchema = z.object({
  id: z.string().regex(/^[a-f]\d+(?:-bis)?$/),
  title: z.string().trim().min(1),
  family: z.enum(BRICK_FAMILIES),
  order: z.number().int().positive(),
  priority: z.enum(BRICK_PRIORITIES),
  durationMinutes: z.number().int().positive().nullable(),
  type: z.enum(BRICK_TYPES),
  platforms: z.array(z.enum(BRICK_PLATFORMS)).min(1),
  prerequisites: z.array(z.string().regex(/^[a-f]\d+(?:-bis)?$/)),
  status: z.enum(BRICK_STATUSES),
  owner: z.enum(BRICK_OWNERS),
  learningObjective: nullableEditorialText,
  expectedOutcome: nullableEditorialText,
});

export type BrickFrontmatter = z.infer<typeof brickFrontmatterSchema>;
export type BrickDocumentInput = {
  filePath: string;
  data: z.input<typeof brickFrontmatterSchema>;
  body: string;
};
export type BrickValidationIssue = {
  filePath: string;
  message: string;
};

function findLevelTwoHeadings(body: string): Set<string> {
  return new Set(
    Array.from(body.matchAll(/^##\s+(.+?)\s*$/gm), (match) => match[1]),
  );
}

export function validateBrickDocuments(
  documents: BrickDocumentInput[],
): BrickValidationIssue[] {
  const issues: BrickValidationIssue[] = [];
  const validDocuments: Array<BrickDocumentInput & { data: BrickFrontmatter }> = [];

  for (const document of documents) {
    const parsed = brickFrontmatterSchema.safeParse(document.data);
    if (!parsed.success) {
      for (const error of parsed.error.issues) {
        issues.push({
          filePath: document.filePath,
          message: `${error.path.join('.') || 'frontmatter'}: ${error.message}`,
        });
      }
      continue;
    }

    validDocuments.push({ ...document, data: parsed.data });
    const headings = findLevelTwoHeadings(document.body);
    const requiredHeadings = [
      ...COMMON_HEADINGS,
      ...TYPE_HEADINGS[parsed.data.type],
    ];

    for (const heading of requiredHeadings) {
      if (!headings.has(heading)) {
        issues.push({
          filePath: document.filePath,
          message: `Rubrique obligatoire manquante : ${heading}`,
        });
      }
    }

    if (parsed.data.status === 'a-relire' || parsed.data.status === 'validee') {
      if (!parsed.data.learningObjective) {
        issues.push({
          filePath: document.filePath,
          message: 'learningObjective est obligatoire à partir du statut a-relire',
        });
      }
      if (!parsed.data.expectedOutcome) {
        issues.push({
          filePath: document.filePath,
          message: 'expectedOutcome est obligatoire à partir du statut a-relire',
        });
      }
    }
  }

  const ids = new Map<string, string>();
  const orders = new Map<number, string>();
  const knownIds = new Set(validDocuments.map((document) => document.data.id));

  for (const document of validDocuments) {
    const previousIdFile = ids.get(document.data.id);
    if (previousIdFile) {
      issues.push({
        filePath: document.filePath,
        message: `Identifiant dupliqué ${document.data.id} (déjà utilisé dans ${previousIdFile})`,
      });
    } else {
      ids.set(document.data.id, document.filePath);
    }

    const previousOrderFile = orders.get(document.data.order);
    if (previousOrderFile) {
      issues.push({
        filePath: document.filePath,
        message: `Ordre dupliqué ${document.data.order} (déjà utilisé dans ${previousOrderFile})`,
      });
    } else {
      orders.set(document.data.order, document.filePath);
    }

    for (const prerequisite of document.data.prerequisites) {
      if (!knownIds.has(prerequisite)) {
        issues.push({
          filePath: document.filePath,
          message: `Prérequis inconnu : ${prerequisite}`,
        });
      }
    }
  }

  const sortedOrders = [...orders.keys()].toSorted((left, right) => left - right);
  for (const [index, actualOrder] of sortedOrders.entries()) {
    const expectedOrder = index + 1;
    if (actualOrder !== expectedOrder) {
      issues.push({
        filePath: orders.get(actualOrder) ?? 'collection',
        message: `Ordre attendu ${expectedOrder}, reçu ${actualOrder}`,
      });
      break;
    }
  }

  return issues;
}
