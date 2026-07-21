import { z } from 'astro/zod';

export const ATELIER_STAGE_IDS = ['p1', 'restitution'] as const;

export const atelierFrontmatterSchema = z.object({
  id: z.enum(ATELIER_STAGE_IDS),
  order: z.number().int().positive(),
  title: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  durationLabel: z.string().trim().min(1),
  budgetMinutes: z.number().int().positive(),
  organe: z.string().trim().min(1),
  bricks: z.array(z.string().regex(/^[a-f]\d+(?:-bis)?$/)).min(1),
  goal: z.string().trim().min(1),
  outcome: z.string().trim().min(1),
  prideCriterion: z.string().trim().min(1),
  kit: z.string().trim().min(1),
});

export type AtelierFrontmatter = z.infer<typeof atelierFrontmatterSchema>;

export function formatBudgetMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${String(rest).padStart(2, '0')}`;
}
