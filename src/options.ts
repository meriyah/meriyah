import type * as ESTree from './estree.ts';
import { Features, nextFeatures } from './features.ts';
import { type Token } from './token.ts';

/**
 * Function calls when semicolon inserted.
 */
type OnInsertedSemicolon = (pos: number) => any;

type SourceType = 'script' | 'module' | 'commonjs';

/**
 * Token process function.
 */
export type OnToken = (token: string, start: number, end: number, loc: ESTree.SourceLocation) => any;

/**
 * Comment process function.
 */
export type OnComment = (
  type: ESTree.CommentType,
  value: string,
  start: number,
  end: number,
  loc: ESTree.SourceLocation,
) => any;

/**
 * The parser options.
 */
export interface Options {
  // Indicate the mode the code should be parsed in 'script', 'module', or 'commonjs' mode
  sourceType?: SourceType;
  // Enable stage 3 support (ESNext)
  next?: boolean;
  // Enable start and end offsets to each node.
  // true: emit start, end, and range: [start, end] (backwards compatible)
  // object: selectively enable { start, end, range } — e.g. { start: true, end: true } skips range array
  ranges?: boolean | { start?: boolean; end?: boolean; range?: boolean };
  // Enable web compatibility
  webcompat?: boolean;
  // Enable line/column location information to each node
  loc?: boolean;
  // Attach raw property to each literal and identifier node
  raw?: boolean;
  // Enable implied strict mode
  impliedStrict?: boolean;
  // Enable non-standard parenthesized expression node
  preserveParens?: boolean;
  // Enable lexical binding and scope tracking
  lexical?: boolean;
  // Adds a source attribute in every node’s loc object when the locations option is `true`
  source?: string;
  // Enable React JSX parsing
  jsx?: boolean;
  // Allows comment extraction. Accepts either a callback function or an array
  onComment?: ESTree.Comment[] | OnComment;
  // Allows detection of automatic semicolon insertion. Accepts a callback function that will be passed the character offset where the semicolon was inserted
  onInsertedSemicolon?: OnInsertedSemicolon;
  // Allows token extraction. Accepts either a callback function or an array
  onToken?: Token[] | OnToken;
  // Throw errors for invalid regexps
  validateRegex?: boolean;

  // Allow module code
  /** @deprecated Use `sourceType` instead. */
  module?: boolean;
  // Allow return in the global scope
  /** @deprecated Use `sourceType: 'commonjs'` instead. */
  globalReturn?: boolean;
}

interface NormalizedRanges {
  start: boolean;
  end: boolean;
  range: boolean;
}

export type InternalOptions = Options & { features?: number };

export type NormalizedOptions = Omit<
  Options,
  'validateRegex' | 'onComment' | 'onToken' | 'ranges' | 'next' | 'module' | 'globalReturn'
> & {
  validateRegex: boolean;
  ranges?: NormalizedRanges;
  onComment?: OnComment;
  onToken?: OnToken;
  features: number;
};

function normalizeRanges(ranges: Options['ranges']): NormalizedRanges | undefined {
  if (!ranges) return undefined;
  if (ranges === true) return { start: true, end: true, range: true };
  return {
    start: ranges.start ?? false,
    end: ranges.end ?? false,
    range: ranges.range ?? false,
  };
}

export function normalizeOptions(rawOptions: InternalOptions): NormalizedOptions {
  let {
    features = Features.None,
    next,
    ranges,
    module,
    sourceType,
    globalReturn,
    ...restOptions
  } = {
    validateRegex: true,
    ...rawOptions,
  };

  if (next) {
    features |= nextFeatures;
  }

  ranges = normalizeRanges(ranges);

  if (module && !sourceType) {
    sourceType = 'module';
  }

  if (globalReturn && (!sourceType || sourceType === 'script')) {
    sourceType = 'commonjs';
  }

  const options = {
    ...restOptions,
    ranges,
    features,
    sourceType,
  } as NormalizedOptions;

  return options;
}
