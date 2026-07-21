export interface TokenWorkload {
  inputTokens: number;
  outputTokens: number;
}

export interface ApiTokenRate {
  inputPerMTok: number;
  outputPerMTok: number;
}

export const SUPPORTED_VOLUMES = [1, 10, 100] as const;

export const calculateApiCost = (
  rate: ApiTokenRate,
  workload: TokenWorkload,
  volume: number,
): number => (
  ((workload.inputTokens * rate.inputPerMTok)
  + (workload.outputTokens * rate.outputPerMTok)) / 1_000_000
) * volume;

export const formatUsd = (amount: number): string => {
  const fractionDigits = Number.isInteger(amount) ? 0 : amount < 0.3 ? 3 : 2;
  return `${amount.toLocaleString('fr-FR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })} $`;
};
