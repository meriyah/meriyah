import { Options } from './parser';
import * as ESTree from './estree';
export declare function parseScript(source: string, options?: Options): ESTree.Program;
export declare function parseModule(source: string, options?: Options): ESTree.Program;
export declare function parse(source: string, options?: Options): ESTree.Program;
export { Options, ESTree };
export declare const version = "1.9.15";
//# sourceMappingURL=meriyah.d.ts.map