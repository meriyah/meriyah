// Current version
import { version as pkgVersion } from '../package.json';
import { type Program } from './estree';
import { type Options } from './options';
import { parseSource } from './parser';

// This bypass troublesome package.json in generated d.ts file.
const version: string = pkgVersion;

/**
 * @deprecated Use `parser()` with `sourceType: 'script'` instead.
 *
 * Parse a script, optionally with various options.
 */
export function parseScript(source: string, options?: Omit<Options, 'sourceType'>): Program {
  return parseSource(source, { ...options, sourceType: 'script' });
}

/**
 * @deprecated Use `parser()` with `sourceType: 'module'` instead.
 *
 * Parse a module, optionally with various options.
 */
export function parseModule(source: string, options?: Omit<Options, 'sourceType'>): Program {
  return parseSource(source, { ...options, sourceType: 'module' });
}

/**
 * Parse a module or a script, optionally with various options.
 */
export function parse(source: string, options?: Options): Program {
  return parseSource(source, options);
}

export { type Options, version };
export type * as ESTree from './estree';
