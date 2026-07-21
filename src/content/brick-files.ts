import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import type { BrickDocumentInput } from './brick-model';

export const EXPECTED_IMPORTED_BRICK_IDS = [
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

async function findMdxFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findMdxFiles(entryPath);
      return entry.isFile() && entry.name.endsWith('.mdx') ? [entryPath] : [];
    }),
  );

  return nestedFiles.flat().toSorted();
}

export async function loadBrickDocuments(
  directory: string,
): Promise<BrickDocumentInput[]> {
  const files = await findMdxFiles(directory);

  return Promise.all(
    files.map(async (filePath) => {
      const source = await readFile(filePath, 'utf8');
      const parsed = matter(source);
      return {
        filePath: path.relative(directory, filePath),
        data: parsed.data as BrickDocumentInput['data'],
        body: parsed.content,
      };
    }),
  );
}

export function hasVisibleEditorialContent(body: string): boolean {
  const withoutComments = body
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const withoutHeadings = withoutComments.replace(/^##\s+.+$/gm, '');
  return withoutHeadings.trim().length > 0;
}
