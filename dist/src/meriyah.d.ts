import { Options } from './parser';
import * as ESTree from './estree';
declare const version: string;
export declare function parseScript(source: string, options?: Options): ESTree.Program;
export declare function parseModule(source: string, options?: Options): ESTree.Program;
export declare function parse(source: string, options?: Options): ESTree.Program;
export { Options, ESTree, version };
//# sourceMappingURL=meriyah.d.ts.map