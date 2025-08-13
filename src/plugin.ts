import type * as ESTree from './estree';

export type PluginOnNode = (node: ESTree.Node, parent: ESTree.Node | null) => void;
export type PluginInit = (source: string, options: any) => void;
export type PluginFinalize = (ast: ESTree.Program) => void;

export interface Plugin {
  name: string;
  onNode?: PluginOnNode;
  init?: PluginInit;
  finalize?: PluginFinalize;
}
