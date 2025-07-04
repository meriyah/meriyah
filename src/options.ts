import type * as ESTree from './estree';
import { pushComment, pushToken } from './parser/parser';
import { type Token } from './token';

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
  // Enable start and end offsets to each node
  ranges?: boolean;
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

export type NormalizedOptions = Omit<Options, 'validateRegex' | 'onComment' | 'onToken'> & {
  validateRegex: boolean;
  onComment?: OnComment;
  onToken?: OnToken;
};

export function normalizeOptions(rawOptions: Options): NormalizedOptions {
  const options = {
    validateRegex: true,
    ...rawOptions,
  } as NormalizedOptions;

  if (options.module && !options.sourceType) {
    options.sourceType = 'module';
  }

  if (options.globalReturn && (!options.sourceType || options.sourceType === 'script')) {
    options.sourceType = 'commonjs';
  }

  // Accepts either a callback function to be invoked or an array to collect comments (as the node is constructed)
  if (options.onComment) {
    options.onComment = Array.isArray(options.onComment) ? pushComment(options.onComment, options) : options.onComment;
  }

  // Accepts either a callback function to be invoked or an array to collect tokens
  if (options.onToken) {
    options.onToken = Array.isArray(options.onToken) ? pushToken(options.onToken, options) : options.onToken;
  }

  return options;
}
