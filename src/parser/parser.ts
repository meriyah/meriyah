import { type AssignmentKind, type DestructuringKind, Flags, type Location } from '../common';
import { Errors, ParseError } from '../errors';
import type * as ESTree from '../estree';
import { convertTokenType } from '../lexer';
import { type NormalizedOptions, type OnComment, type OnToken } from '../options';
import { Token } from '../token';
import { PrivateScope } from './private-scope';
import { Scope, type ScopeKind } from './scope';

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
  exportedNames = new Set<string>();

  /**
   * https://tc39.es/ecma262/#sec-exports-static-semantics-exportedbindings
   */

  exportedBindings = new Set<string>();

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
    public readonly options: NormalizedOptions = {},
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

  get currentLocation(): Location {
    return { index: this.index, line: this.line, column: this.column };
  }

  finishNode<T extends ESTree.Node>(node: T, start: Location, end: Location | void): T {
    if (this.options.ranges) {
      node.start = start.index;
      const endIndex = end ? end.index : this.startIndex;
      node.end = endIndex;
      node.range = [start.index, endIndex];
    }

    if (this.options.loc) {
      node.loc = {
        start: {
          line: start.line,
          column: start.column,
        },
        end: end ? { line: end.line, column: end.column } : { line: this.startLine, column: this.startColumn },
      };

      if (this.options.source) {
        node.loc.source = this.options.source;
      }
    }

    return node;
  }

  /**
   * Appends a name to the `ExportedBindings` of the `ExportsList`,
   *
   * @see [Link](https://tc39.es/ecma262/$sec-exports-static-semantics-exportedbindings)
   *
   * @param name Exported binding name
   */
  addBindingToExports(name: string): void {
    this.exportedBindings.add(name);
  }

  /**
   * Appends a name to the `ExportedNames` of the `ExportsList`, and checks
   * for duplicates
   *
   * @see [Link](https://tc39.github.io/ecma262/$sec-exports-static-semantics-exportednames)
   *
   * @param name Exported name
   */
  declareUnboundVariable(name: string): void {
    const { exportedNames } = this;

    if (exportedNames.has(name)) {
      this.report(Errors.DuplicateExportBinding, name);
    }

    exportedNames.add(name);
  }

  /**
   * Throws an error
   *
   * @export
   * @param {Errors} type
   * @param {...string[]} params
   * @returns {never}
   */
  report(type: Errors, ...params: string[]): never {
    throw new ParseError(this.tokenStart, this.currentLocation, type, ...params);
  }

  createScopeIfLexical(type?: ScopeKind, parent?: Scope) {
    if (this.options.lexical) {
      return this.createScope(type, parent);
    }

    return undefined;
  }

  createScope(type?: ScopeKind, parent?: Scope) {
    return new Scope(this, type, parent);
  }

  createPrivateScopeIfLexical(parent?: PrivateScope) {
    if (this.options.lexical) {
      return new PrivateScope(this, parent);
    }

    return undefined;
  }

  cloneIdentifier(original: ESTree.Identifier): ESTree.Identifier {
    return this.cloneLocationInformation({ ...original }, original);
  }

  cloneStringLiteral(original: ESTree.StringLiteral): ESTree.StringLiteral {
    return this.cloneLocationInformation({ ...original }, original);
  }

  private cloneLocationInformation<T extends ESTree.Node>(node: T, original: T) {
    if (this.options.ranges) {
      node.range = [...original.range!];
    }

    if (this.options.loc) {
      node.loc = {
        ...original.loc,
        start: { ...original.loc!.start },
        end: { ...original.loc!.end },
      };
    }

    return node;
  }
}

export function pushComment(comments: ESTree.Comment[], options: NormalizedOptions): OnComment {
  return function (type: ESTree.CommentType, value: string, start: number, end: number, loc: ESTree.SourceLocation) {
    const comment: ESTree.Comment = {
      type,
      value,
    };

    if (options.ranges) {
      comment.start = start;
      comment.end = end;
      comment.range = [start, end];
    }
    if (options.loc) {
      comment.loc = loc;
    }
    comments.push(comment);
  };
}

export function pushToken(tokens: Token[], options: NormalizedOptions): OnToken {
  return function (type: string, start: number, end: number, loc: ESTree.SourceLocation) {
    const token: any = {
      token: type,
    };

    if (options.ranges) {
      token.start = start;
      token.end = end;
      token.range = [start, end];
    }

    if (options.loc) {
      token.loc = loc;
    }
    tokens.push(token);
  };
}
