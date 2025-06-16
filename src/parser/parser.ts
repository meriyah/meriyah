import { convertTokenType } from '../lexer';
import { Token } from '../token';
import type * as ESTree from '../estree';
import {
  Flags,
  type OnComment,
  type OnInsertedSemicolon,
  type OnToken,
  type Location,
  type AssignmentKind,
  type DestructuringKind,
} from '../common';

export type ParserOptions = {
  shouldAddLoc?: boolean;
  shouldAddRanges?: boolean;
  /**
   * Used together with source maps. File containing the code being parsed
   */
  sourceFile?: string;
  /**
   * Holds either a function or array used on every comment
   */
  onComment?: OnComment;
  /**
   * Function invoked with the character offset when automatic semicolon insertion occurs
   */
  onInsertedSemicolon?: OnInsertedSemicolon;
  /**
   * Holds either a function or array used on every token
   */
  onToken?: OnToken;
};

export class Parser {
  private lastOnToken: [string, number, number, ESTree.SourceLocation] | null = null;

  token = Token.EOF;
  /**
   * The mutable parser flags, in case any flags need passed by reference.
   */
  flags = Flags.None;
  /**
   * The current index
   */
  index = 0;
  /**
   * Beginning of current line
   */
  line = 1;

  /**
   * Beginning of current column
   */
  column = 0;

  /**
   * Start position of whitespace/comment before current token
   */
  startIndex = 0;

  /**
   * The end of the source code
   */
  end = 0;

  /**
   * Start position of text of current token
   */
  tokenIndex = 0;

  /**
   * Start position of the column before newline
   */
  startColumn = 0;

  /**
   * Position in the input code of the first character after the last newline
   */
  tokenColumn = 0;

  /**
   * The number of newlines
   */
  tokenLine = 1;

  /**
   * Start position of text of current token
   */
  startLine = 1;

  /**
   * Holds the scanned token value
   */
  tokenValue: any = '';

  /**
   * Holds the raw text that have been scanned by the lexer
   */
  tokenRaw = '';

  /**
   * Holds the regExp info text that have been collected by the lexer
   */
  tokenRegExp: void | {
    pattern: string;
    flags: string;
  } = void 0;

  /**
   * The code point at the current index
   */
  currentChar = 0;

  /**
   *  https://tc39.es/ecma262/#sec-module-semantics-static-semantics-exportednames
   */
  exportedNames: Record<string, number> = {};

  /**
   * https://tc39.es/ecma262/#sec-exports-static-semantics-exportedbindings
   */

  exportedBindings: Record<string, number> = {};

  /**
   * Assignable state
   */
  assignable: AssignmentKind | DestructuringKind = 1;

  /**
   * Destructuring state
   */
  destructible: AssignmentKind | DestructuringKind = 0;

  /**
   * Holds leading decorators before "export" or "class" keywords
   */
  leadingDecorators: {
    start?: Location;
    decorators: ESTree.Decorator[];
  } = { decorators: [] };

  constructor(
    /**
     * The source code to be parsed
     */
    public readonly source: string,
    public readonly options: ParserOptions = {},
  ) {
    this.end = source.length;
    this.currentChar = source.charCodeAt(0);
  }

  /**
   * Get the current token in the stream to consume
   * This function exists as workaround for TS issue
   * https://github.com/microsoft/TypeScript/issues/9998
   */
  getToken() {
    return this.token;
  }

  /**
   * Set the current token in the stream to consume
   * This function exists as workaround for TS issue
   * https://github.com/microsoft/TypeScript/issues/9998
   */
  setToken(value: Token, replaceLast = false) {
    this.token = value;

    const { onToken } = this.options;

    if (onToken) {
      if (value !== Token.EOF) {
        const loc = {
          start: {
            line: this.tokenLine,
            column: this.tokenColumn,
          },
          end: {
            line: this.line,
            column: this.column,
          },
        };

        if (!replaceLast && this.lastOnToken) {
          onToken(...this.lastOnToken);
        }
        this.lastOnToken = [convertTokenType(value), this.tokenIndex, this.index, loc];
      } else {
        if (this.lastOnToken) {
          onToken(...this.lastOnToken);
          this.lastOnToken = null;
        }
      }
    }
    return value;
  }

  get tokenStart(): Location {
    return {
      index: this.tokenIndex,
      line: this.tokenLine,
      column: this.tokenColumn,
    };
  }

  finishNode<T extends ESTree.Node>(node: T, start: Location): T {
    if (this.options.shouldAddRanges) {
      node.start = start.index;
      node.end = this.startIndex;
      node.range = [start.index, this.startIndex];
    }

    if (this.options.shouldAddLoc) {
      node.loc = {
        start: {
          line: start.line,
          column: start.column,
        },
        end: {
          line: this.startLine,
          column: this.startColumn,
        },
      };

      if (this.options.sourceFile) {
        node.loc.source = this.options.sourceFile;
      }
    }

    return node;
  }
}

export function pushComment(comments: ESTree.Comment[], options: ParserOptions): OnComment {
  return function (type: ESTree.CommentType, value: string, start: number, end: number, loc: ESTree.SourceLocation) {
    const comment: ESTree.Comment = {
      type,
      value,
    };

    if (options.shouldAddRanges) {
      comment.start = start;
      comment.end = end;
      comment.range = [start, end];
    }
    if (options.shouldAddLoc) {
      comment.loc = loc;
    }
    comments.push(comment);
  };
}

export function pushToken(tokens: any[], options: ParserOptions): OnToken {
  return function (type: string, start: number, end: number, loc: ESTree.SourceLocation) {
    const token: any = {
      token: type,
    };

    if (options.shouldAddRanges) {
      token.start = start;
      token.end = end;
      token.range = [start, end];
    }
    if (options.shouldAddLoc) {
      token.loc = loc;
    }
    tokens.push(token);
  };
}
