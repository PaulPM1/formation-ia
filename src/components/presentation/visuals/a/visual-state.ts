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

type VisualData = Record<string, unknown>;

export type VerificationVariant = 'classification' | 'statements' | 'biases' | 'risk' | 'method';

export const getVerificationVariant = (data: VisualData): VerificationVariant => {
  if (Array.isArray(data.buckets)) return 'classification';
  if (Array.isArray(data.statements)) return 'statements';
  if (Array.isArray(data.biases)) return 'biases';
  if (Array.isArray(data.scale)) return 'risk';
  return 'method';
};

export type ContextBudgetVariant = 'layers' | 'meter' | 'comparison' | 'mission';

export const getContextBudgetVariant = (data: VisualData): ContextBudgetVariant => {
  if (Array.isArray(data.layers)) return 'layers';
  if (Array.isArray(data.meter)) return 'meter';
  if (Array.isArray(data.comparisons)) return 'comparison';
  return 'mission';
};

export const calculateContextSelection = (total: number, included: boolean[]) => ({
  included: included.slice(0, total).filter(Boolean).length,
  total,
});

export const resolvePanelVisibility = (count: number, active: number, enhanced: boolean) =>
  Array.from({ length: count }, (_, index) => !enhanced || index === active);

export const classificationState = () => ({
  selection: null as string | null,
  revealed: false,
});

export const tokenEnhancementState = (reducedMotion: boolean) => ({
  interactive: !reducedMotion,
  controlHidden: reducedMotion,
  finalVisible: reducedMotion,
});

export const verificationForRisk = (
  risk: string,
  scale: Array<{ risk: string; verification: string }>,
) => scale.find((level) => level.risk === risk)?.verification ?? scale[0]?.verification ?? '';
