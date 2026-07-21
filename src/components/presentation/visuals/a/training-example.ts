export interface TrainingCandidate {
  token: string;
  probability: number;
}

export interface TrainingStep {
  target: string;
  candidates: TrainingCandidate[];
}

export interface TrainingExample {
  tokens: string[];
  steps: TrainingStep[];
}

export const isTrainingExample = (value: unknown): value is TrainingExample => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<TrainingExample>;
  return Array.isArray(candidate.tokens)
    && candidate.tokens.every((token) => typeof token === 'string')
    && Array.isArray(candidate.steps)
    && candidate.steps.length === candidate.tokens.length
    && candidate.steps.every((step) =>
      typeof step?.target === 'string'
      && Array.isArray(step.candidates)
      && step.candidates.every((option) =>
        typeof option?.token === 'string' && typeof option.probability === 'number'));
};
