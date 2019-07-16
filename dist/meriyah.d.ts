import { Options } from './parser';
import * as ESTree from './estree';
export declare function parseScript(source: string, options: Options | void): ESTree.Program;
export declare function parseModule(source: string, options: Options | void): ESTree.Program;
export declare function parse(source: string, options: Options | void): ESTree.Program;
export declare const version = "1.3.2";
//# sourceMappingURL=meriyah.d.ts.map