import { z } from 'astro/zod';

export const PROJET_IDS = [
  'assistant',
  'coach',
  'radar',
  'archiviste',
  'portfolio',
  'chasseur',
  'memoire',
] as const;

export const PROJET_DIFFICULTIES = [
  'accessible',
  'intermediaire',
  'ambitieux',
] as const;

/** Les 23 briques du curriculum, après renumérotation. */
export const VALID_BRICK_IDS = [
  'a1',
  'a2',
  'a3',
  'a4',
  'b0',
  'b1',
  'b2',
  'b3',
  'b4',
  'b4-bis',
  'c1',
  'c2',
  'c3',
  'd1',
  'd2',
  'd2-bis',
  'd3',
  'd4',
  'e1',
  'e2',
  'e3',
  'f1',
  'f2',
] as const;

export const projetFrontmatterSchema = z
  .object({
    id: z.enum(PROJET_IDS),
    order: z.number().int().positive(),
    title: z.string().trim().min(1),
    /** Une phrase d'accroche. */
    tagline: z.string().trim().min(1),
    /** Ce que vous montrez dimanche. */
    deliverable: z.string().trim().min(1),
    /** À quoi ça sert après le week-end. */
    afterwards: z.string().trim().min(1),
    difficulty: z.enum(PROJET_DIFFICULTIES),
    /** Retiré du catalogue et du site, mais conservé dans le dépôt. */
    hidden: z.boolean().default(false),
    /** Format d'équipe conseillé, par exemple « Seul ou à deux ». */
    teamHint: z.string().trim().min(1),
    bricks: z.array(z.enum(VALID_BRICK_IDS)).min(1),
  })
  .strict();

export type ProjetFrontmatter = z.infer<typeof projetFrontmatterSchema>;
export type ProjetId = (typeof PROJET_IDS)[number];
export type ProjetDifficulty = (typeof PROJET_DIFFICULTIES)[number];

const DIFFICULTY_LABELS: Record<ProjetDifficulty, string> = {
  accessible: 'Accessible',
  intermediaire: 'Intermédiaire',
  ambitieux: 'Ambitieux',
};

export function formatDifficulty(difficulty: ProjetDifficulty): string {
  return DIFFICULTY_LABELS[difficulty];
}
