import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { brickFrontmatterSchema } from './content/brick-model';

const briques = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/briques' }),
  schema: brickFrontmatterSchema,
});

export const collections = { briques };
