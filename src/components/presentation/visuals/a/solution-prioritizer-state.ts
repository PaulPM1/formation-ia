export type SolutionPrioritizerState = {
  index: number;
  selection: string | null;
  revealed: boolean;
  score: number;
  complete: boolean;
};

export function createPrioritizerState(): SolutionPrioritizerState {
  return {
    index: 0,
    selection: null,
    revealed: false,
    score: 0,
    complete: false,
  };
}

export function chooseSolution(
  state: SolutionPrioritizerState,
  selection: string,
): SolutionPrioritizerState {
  if (state.revealed || state.complete) return state;
  return { ...state, selection };
}

export function revealPrioritizerAnswer(
  state: SolutionPrioritizerState,
  answer: string,
): SolutionPrioritizerState {
  if (!state.selection || state.revealed || state.complete) return state;
  return {
    ...state,
    revealed: true,
    score: state.score + Number(state.selection === answer),
  };
}

export function advancePrioritizer(
  state: SolutionPrioritizerState,
  total: number,
): SolutionPrioritizerState {
  if (!state.revealed || state.complete) return state;
  if (state.index >= total - 1) return { ...state, complete: true };
  return {
    ...state,
    index: state.index + 1,
    selection: null,
    revealed: false,
  };
}
