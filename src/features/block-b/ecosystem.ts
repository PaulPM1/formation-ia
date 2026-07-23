export const BLOCK_B_ECOSYSTEM_STORAGE_KEY = 'bloc-b-ecosystem';

export const BLOCK_B_ECOSYSTEMS = ['claude', 'openai'] as const;
export type BlockBEcosystem = (typeof BLOCK_B_ECOSYSTEMS)[number];

export const parseBlockBEcosystem = (
  value: string | null | undefined,
): BlockBEcosystem | null => (
  value === 'claude' || value === 'openai' ? value : null
);

export const blockBPanelVisibility = (
  selected: BlockBEcosystem | null,
  panelValues: string[],
) => panelValues.map((value) => selected === null || value === selected);
