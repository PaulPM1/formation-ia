export interface TokenState {
  index: number;
  sentence: string;
  complete: boolean;
}

export const advanceTokenState = (current: number, tokens: string[]): TokenState => {
  const last = Math.max(0, tokens.length - 1);
  const index = Math.min(Math.max(0, current + 1), last);
  return {
    index,
    sentence: tokens.slice(0, index + 1).join(''),
    complete: index === last,
  };
};

const LOAD_WEIGHTS: Record<string, number> = {
  faible: 1,
  ciblé: 1,
  significative: 2,
  élevée: 3,
  inutile: 3,
};

export interface BudgetItem {
  load: string;
  useful: boolean;
}

export const calculateContextBudget = (items: BudgetItem[], included: boolean[]) => {
  const weights = items.map((item) => LOAD_WEIGHTS[item.load] ?? 1);
  const capacity = weights.reduce((sum, weight) => sum + weight, 0);
  const load = weights.reduce((sum, weight, index) => sum + (included[index] ? weight : 0), 0);
  const useful = items.reduce(
    (sum, item, index) => sum + (included[index] && item.useful ? 1 : 0),
    0,
  );

  return {
    load,
    capacity,
    percentage: capacity === 0 ? 0 : Math.round((load / capacity) * 100),
    useful,
  };
};

export const verificationForRisk = (
  risk: string,
  scale: Array<{ risk: string; verification: string }>,
) => scale.find((level) => level.risk === risk)?.verification ?? scale[0]?.verification ?? '';
