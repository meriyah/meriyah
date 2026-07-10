import packageJson from '../package.json' with { type: 'json' };
import { type Program } from './estree.ts';
import { type Options } from './options.ts';
import { parseSource } from './parser.ts';

export const { version } = packageJson;

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

export { type Options } from './options.ts';
export type * as ESTree from './estree.ts';
export { isParseError, type ParseError } from './errors.ts';
