type VisualData = Record<string, unknown>;

export type SetupVariant = 'layers' | 'checks' | 'test' | 'fallback' | 'platforms';
export const getSetupVariant = (data: VisualData): SetupVariant => {
  if (Array.isArray(data.layers)) return 'layers';
  if (Array.isArray(data.checks)) return 'checks';
  if (Array.isArray(data.steps)) return 'test';
  if (Array.isArray(data.situations)) return 'fallback';
  return 'platforms';
};

export type PromptVariant = 'comparison' | 'blocks' | 'builder' | 'loop';
export const getPromptVariant = (data: VisualData): PromptVariant => {
  if (typeof data.before === 'string') return 'comparison';
  if (Array.isArray(data.blocks)) return 'blocks';
  if (typeof data.objective === 'string') return 'builder';
  return 'loop';
};

export type ArtifactVariant = 'transfer' | 'anatomy' | 'mvp' | 'tests' | 'correction';
export const getArtifactVariant = (data: VisualData): ArtifactVariant => {
  if (data.before && data.after && Array.isArray(data.affordances)) return 'transfer';
  if (Array.isArray(data.zones)) return 'anatomy';
  if (typeof data.idea === 'string') return 'mvp';
  if (Array.isArray(data.tests)) return 'tests';
  return 'correction';
};

export type PacteVariant = 'delegation' | 'pacte' | 'permissions' | 'timeline' | 'check';
export const getPacteVariant = (data: VisualData): PacteVariant => {
  if (data.workspace) return 'delegation';
  if (Array.isArray(data.pacte)) return 'pacte';
  if (data.before && data.after) return 'permissions';
  if (Array.isArray(data.timeline)) return 'timeline';
  return 'check';
};

export type IpmtrVariant = 'context' | 'process' | 'permission' | 'proof';
export const getIpmtrVariant = (data: VisualData): IpmtrVariant => {
  if (Array.isArray(data.context)) return 'context';
  if (Array.isArray(data.steps)) return 'process';
  if (Array.isArray(data.questions)) return 'permission';
  return 'proof';
};

export type WorkspaceVariant = 'panes' | 'workspace' | 'path';
export const getWorkspaceVariant = (data: VisualData): WorkspaceVariant => {
  if (typeof data.folder === 'string') return 'workspace';
  if (Array.isArray(data.commands)) return 'path';
  return 'panes';
};

export const resolvePanelVisibility = (count: number, active: number, enhanced: boolean) =>
  Array.from({ length: count }, (_, index) => !enhanced || index === active);

export const assemblePrompt = (blocks: string[], active: boolean[]) =>
  blocks.filter((_, index) => active[index]).join(' · ');

export const promptOutputForVariant = (
  variant: PromptVariant,
  target: string,
  blocks: string[],
  active: boolean[],
) => {
  if (variant === 'comparison') return target;
  return assemblePrompt(blocks, active) || 'Sélectionnez un bloc pour commencer le brief.';
};

export const commandForPlatform = (
  platform: 'mac' | 'windows',
  commands: { mac: string; windows: string },
) => commands[platform];

export interface IpmtrGates { permission: boolean; test: boolean; diff: boolean; }
export type IpmtrGate = keyof IpmtrGates;

export const ipmtrGateAfter = (index: number): IpmtrGate | null => {
  const current = ((index % 5) + 5) % 5;
  return ([null, 'permission', null, 'test', 'diff'] as const)[current];
};

export const advanceIpmtrCycle = (index: number, gates: IpmtrGates) => {
  const current = ((index % 5) + 5) % 5;
  const nextGates = { ...gates };
  const blockedBy = ipmtrGateAfter(current);
  if (blockedBy && !nextGates[blockedBy]) return { index: current, gates: nextGates, blockedBy };
  if (blockedBy) nextGates[blockedBy] = false;
  return { index: (current + 1) % 5, gates: nextGates, blockedBy: null };
};

export const advanceIpmtr = (index: number, gates: IpmtrGates) => {
  const next = advanceIpmtrCycle(index, gates);
  return { index: next.index, blockedBy: next.blockedBy };
};

export const artifactViewState = (count: number, active: number | null) => ({
  active,
  panels: Array.from({ length: count }, (_, index) => active === null || index === active),
  nodes: Array.from({ length: count }, (_, index) => active === null || index === active),
});

export const workspaceSharedPath = (data: VisualData) => {
  if (typeof data.sharedContext === 'string') return data.sharedContext;
  if (typeof data.explorerPath === 'string') return data.explorerPath;
  if (typeof data.folder === 'string') return data.folder;
  return 'atelier-ia/bonjour.txt';
};

export const workspaceFolderLabel = (data: VisualData) => {
  for (const field of ['folderLabel', 'folder', 'explorerPath'] as const) {
    if (typeof data[field] !== 'string') continue;
    const normalized = data[field].trim().replaceAll('\\', '/').replace(/\/+$/, '');
    const label = normalized.split('/').filter(Boolean).at(-1);
    if (label) return label;
  }
  return 'projet';
};
