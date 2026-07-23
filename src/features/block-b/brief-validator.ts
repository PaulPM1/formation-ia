import { validateBriefContract } from '../../../kits/bloc-b-assistant/mission-agent/brief-contract.mjs';

export type BriefCheck = {
  id: 'structure' | 'sources' | 'uncertainty';
  label: string;
  ok: boolean;
};

export function validateBlockBBrief(markdown: string): BriefCheck[] {
  const result = validateBriefContract(markdown);

  return [
    { id: 'structure', label: 'Les trois sections sont présentes dans le bon ordre.', ok: result.structure },
    { id: 'sources', label: 'Les six notes citent le bon fichier sur la même action.', ok: result.sources },
    { id: 'uncertainty', label: 'Le conflit du 18 et du 19 septembre reste à confirmer.', ok: result.uncertainty },
  ];
}
