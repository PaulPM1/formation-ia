type VisualData = Record<string, unknown>;

export type SkillVariant = 'repeat' | 'neighbors' | 'anatomy' | 'trigger' | 'tests';
export const getSkillVariant = (data: VisualData): SkillVariant => {
  if (Array.isArray(data.repeatedPrompts)) return 'repeat';
  if (Array.isArray(data.concepts)) return 'neighbors';
  if (Array.isArray(data.sections)) return 'anatomy';
  if (Array.isArray(data.descriptions)) return 'trigger';
  return 'tests';
};

export type McpVariant = 'api' | 'chain' | 'tools' | 'permissions' | 'readonly' | 'revoke';
export const getMcpVariant = (data: VisualData): McpVariant => {
  if (data.api && data.mcp) return 'api';
  if (Array.isArray(data.nodes)) return 'chain';
  if (Array.isArray(data.commands)) return 'tools';
  if (Array.isArray(data.riskMap)) return 'permissions';
  if (typeof data.request === 'string') return 'readonly';
  return 'revoke';
};

export type TriggerVariant = 'modes' | 'hook' | 'schedule' | 'guardrails' | 'lifecycle';
export const getTriggerVariant = (data: VisualData): TriggerVariant => {
  if (Array.isArray(data.modes)) return 'modes';
  if (typeof data.event === 'string') return 'hook';
  if (data.task && Array.isArray(data.states)) return 'schedule';
  if (Array.isArray(data.guardrails)) return 'guardrails';
  return 'lifecycle';
};

interface SkillCase { type?: string; expected?: string; }
export const skillCaseOutcome = (testCase: SkillCase) => {
  const shouldTrigger = !String(testCase.expected ?? '').toLocaleLowerCase('fr').includes('silencieux')
    && String(testCase.type ?? '').toLocaleLowerCase('fr') !== 'négatif';
  return {
    shouldTrigger,
    state: shouldTrigger ? 'Déclenché' : 'Silencieux',
    correct: true,
  };
};

export const mcpBoundaryState = (revoked: boolean, minimal: boolean) => revoked
  ? { connected: false, permission: 'Aucun accès', boundary: 'Fermée · connexion révoquée' }
  : {
      connected: true,
      permission: minimal ? 'Lecture seule' : 'Portée large',
      boundary: minimal ? 'Ouverte avec permission minimale' : 'Ouverte avec permission large',
    };

export const mcpInitialBoundary = (variant: McpVariant) => {
  if (variant === 'revoke') return mcpBoundaryState(true, true);
  if (variant === 'permissions' || variant === 'readonly') return mcpBoundaryState(false, true);
  return { connected: true, permission: 'Permission non précisée', boundary: 'Frontière à vérifier' };
};

export const triggerLaneLabels = (data: VisualData) => {
  const variant = getTriggerVariant(data);
  if (variant === 'modes') {
    const modes = data.modes as Array<{ example?: unknown }>;
    return { event: String(modes[0]?.example ?? 'Non applicable'), calendar: String(modes[1]?.example ?? 'Non applicable') };
  }
  if (variant === 'hook') return { event: String(data.event), calendar: 'Non applicable' };
  if (variant === 'schedule') {
    const states = data.states as Array<{ name?: unknown; action?: unknown }>;
    const recurring = states.at(-1);
    return {
      event: 'Non applicable',
      calendar: recurring ? String(recurring.name) : 'Non applicable',
    };
  }
  return { event: 'Non applicable', calendar: 'Non applicable' };
};

export const triggerLifecycleState = (states: string[], index: number) => {
  const safeIndex = Math.max(0, Math.min(index, Math.max(states.length - 1, 0)));
  const state = states[safeIndex] ?? '';
  return {
    index: safeIndex,
    state,
    logVisible: safeIndex >= 2,
    paused: safeIndex >= 3,
    deleted: safeIndex >= 4,
  };
};
