export interface TokenState {
  index: number;
  sentence: string;
  complete: boolean;
}

export type TrainingPhase = 'predict' | 'compare' | 'adjust';

export interface TrainingPlaybackState {
  tokenIndex: number;
  phase: TrainingPhase;
  complete: boolean;
}

export const advanceTrainingPlayback = (
  current: TrainingPlaybackState,
  tokenCount: number,
): TrainingPlaybackState => {
  if (tokenCount <= 0) return { tokenIndex: 0, phase: 'predict', complete: true };
  if (current.complete) return { tokenIndex: 0, phase: 'predict', complete: false };
  if (current.phase === 'predict') return { ...current, phase: 'compare' };
  if (current.phase === 'compare') return { ...current, phase: 'adjust' };
  if (current.tokenIndex >= tokenCount - 1) return { ...current, complete: true };
  return { tokenIndex: current.tokenIndex + 1, phase: 'predict', complete: false };
};

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

export type VerificationVariant =
  | 'classification'
  | 'classification-sequence'
  | 'statements'
  | 'biases'
  | 'risk'
  | 'method';

export const getVerificationVariant = (data: VisualData): VerificationVariant => {
  if (Array.isArray(data.buckets) && Array.isArray(data.statements)) return 'classification-sequence';
  if (Array.isArray(data.buckets)) return 'classification';
  if (Array.isArray(data.statements)) return 'statements';
  if (Array.isArray(data.biases)) return 'biases';
  if (Array.isArray(data.scale)) return 'risk';
  return 'method';
};

export const advanceClassificationSequence = (current: number, count: number) =>
  count <= 0 ? 0 : Math.min(Math.max(0, current + 1), count - 1);

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
