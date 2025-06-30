import { Context } from './common';
import { parseSource } from './parser';
import { type Program } from './estree';
// Current version
import { version as pkgVersion } from '../package.json';
import { type Options } from './options';

// This bypass troublesome package.json in generated d.ts file.
const version: string = pkgVersion;

/**
 * Parse a script, optionally with various options.
 */
export function parseScript(source: string, options?: Options): Program {
  return parseSource(source, options);
}

/**
 * Parse a module, optionally with various options.
 */
export function parseModule(source: string, options?: Options): Program {
  return parseSource(source, options, Context.Strict | Context.Module);
}

/**
 * Parse a module or a script, optionally with various options.
 */
export function parse(source: string, options?: Options): Program {
  return parseSource(source, options);
}

export { type Options, version };
export type * as ESTree from './estree';
