import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { brickFrontmatterSchema } from './content/brick-model';
import { atelierFrontmatterSchema } from './content/atelier-model';
import { projetFrontmatterSchema } from './content/projet-model';

const briques = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/briques' }),
  schema: brickFrontmatterSchema,
});

const atelier = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/atelier' }),
  schema: atelierFrontmatterSchema,
});

const projets = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projets' }),
  schema: projetFrontmatterSchema,
});

export const collections = { briques, atelier, projets };
