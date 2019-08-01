import { Options } from './parser';
import * as ESTree from './estree';
export declare function parseScript(source: string, options?: Options): ESTree.Program;
export declare function parseModule(source: string, options?: Options): ESTree.Program;
export declare function parse(source: string, options?: Options): ESTree.Program;
export { ESTree, Options };
export declare const version = "1.5.0";
//# sourceMappingURL=meriyah.d.ts.map