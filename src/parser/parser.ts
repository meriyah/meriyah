import { type AssignmentKind, type DestructuringKind, Flags, type Location } from '../common';
import { Errors, ParseError } from '../errors';
import type * as ESTree from '../estree';
import { convertTokenType } from '../lexer';
import { type NormalizedOptions, normalizeOptions, type OnComment, type OnToken, type Options } from '../options';
import { type Plugin } from '../plugin';
import { Token } from '../token';
import { PrivateScope } from './private-scope';
import { Scope, type ScopeKind } from './scope';

export class Parser {
  private lastOnToken: [string, number, number, ESTree.SourceLocation] | null = null;
  private plugins: Plugin[] = [];
  private nodeStack: ESTree.Node[] = [];

  options: NormalizedOptions;

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
    rawOptions: Options = {},
  ) {
    this.end = source.length;
    this.currentChar = source.charCodeAt(0);
    this.options = normalizeOptions(rawOptions);

    // Accepts either a callback function to be invoked or an array to collect comments (as the node is constructed)
    if (Array.isArray(this.options.onComment)) {
      this.options.onComment = pushComment(this.options.onComment, this.options);
    }

    // Accepts either a callback function to be invoked or an array to collect tokens
    if (Array.isArray(this.options.onToken)) {
      this.options.onToken = pushToken(this.options.onToken, this.options);
    }

    if (this.options.plugins) {
      this.plugins = this.options.plugins;
      for (let i = 0; i < this.plugins.length; ++i) {
        const plugin = this.plugins[i];
        if (plugin.init) {
          plugin.init(source, rawOptions);
        }
      }
    }
  }

  traverseNode(node: any, parent: ESTree.Node | null = null): void {
    if (!node || typeof node !== 'object' || !node.type) return;

    switch (node.type) {
      case 'Program':
        if (node.body) this.traverseArray(node.body, node);
        break;
      case 'BlockStatement':
      case 'StaticBlock':
        if (node.body) this.traverseArray(node.body, node);
        break;
      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        if (node.params) this.traverseArray(node.params, node);
        if (node.body) this.traverseNode(node.body, node);
        break;
      case 'VariableDeclaration':
        if (node.declarations) this.traverseArray(node.declarations, node);
        break;
      case 'VariableDeclarator':
        if (node.id) this.traverseNode(node.id, node);
        if (node.init) this.traverseNode(node.init, node);
        break;
      case 'ObjectExpression':
        if (node.properties) this.traverseArray(node.properties, node);
        break;
      case 'ArrayExpression':
        if (node.elements) this.traverseArray(node.elements, node);
        break;
      case 'Property':
        if (node.key) this.traverseNode(node.key, node);
        if (node.value) this.traverseNode(node.value, node);
        break;
      case 'BinaryExpression':
      case 'LogicalExpression':
      case 'AssignmentExpression':
        if (node.left) this.traverseNode(node.left, node);
        if (node.right) this.traverseNode(node.right, node);
        break;
      case 'UnaryExpression':
      case 'UpdateExpression':
        if (node.argument) this.traverseNode(node.argument, node);
        break;
      case 'CallExpression':
      case 'NewExpression':
        if (node.callee) this.traverseNode(node.callee, node);
        if (node.arguments) this.traverseArray(node.arguments, node);
        break;
      case 'MemberExpression':
        if (node.object) this.traverseNode(node.object, node);
        if (node.property) this.traverseNode(node.property, node);
        break;
      case 'ConditionalExpression':
        if (node.test) this.traverseNode(node.test, node);
        if (node.consequent) this.traverseNode(node.consequent, node);
        if (node.alternate) this.traverseNode(node.alternate, node);
        break;
      case 'IfStatement':
        if (node.test) this.traverseNode(node.test, node);
        if (node.consequent) this.traverseNode(node.consequent, node);
        if (node.alternate) this.traverseNode(node.alternate, node);
        break;
      case 'ForStatement':
        if (node.init) this.traverseNode(node.init, node);
        if (node.test) this.traverseNode(node.test, node);
        if (node.update) this.traverseNode(node.update, node);
        if (node.body) this.traverseNode(node.body, node);
        break;
      case 'WhileStatement':
      case 'DoWhileStatement':
        if (node.test) this.traverseNode(node.test, node);
        if (node.body) this.traverseNode(node.body, node);
        break;
      case 'ReturnStatement':
      case 'ThrowStatement':
        if (node.argument) this.traverseNode(node.argument, node);
        break;
      case 'ExpressionStatement':
        if (node.expression) this.traverseNode(node.expression, node);
        break;
      case 'ImportDeclaration':
        if (node.specifiers) this.traverseArray(node.specifiers, node);
        break;
      case 'ExportNamedDeclaration':
        if (node.declaration) this.traverseNode(node.declaration, node);
        if (node.specifiers) this.traverseArray(node.specifiers, node);
        break;
      case 'ExportDefaultDeclaration':
        if (node.declaration) this.traverseNode(node.declaration, node);
        break;
      case 'ClassDeclaration':
      case 'ClassExpression':
        if (node.superClass) this.traverseNode(node.superClass, node);
        if (node.body) this.traverseNode(node.body, node);
        break;
      case 'ClassBody':
        if (node.body) this.traverseArray(node.body, node);
        break;
      case 'MethodDefinition':
        if (node.key) this.traverseNode(node.key, node);
        if (node.value) this.traverseNode(node.value, node);
        break;
      case 'SwitchStatement':
        if (node.discriminant) this.traverseNode(node.discriminant, node);
        if (node.cases) this.traverseArray(node.cases, node);
        break;
      case 'SwitchCase':
        if (node.test) this.traverseNode(node.test, node);
        if (node.consequent) this.traverseArray(node.consequent, node);
        break;
      case 'TryStatement':
        if (node.block) this.traverseNode(node.block, node);
        if (node.handler) this.traverseNode(node.handler, node);
        if (node.finalizer) this.traverseNode(node.finalizer, node);
        break;
      case 'CatchClause':
        if (node.param) this.traverseNode(node.param, node);
        if (node.body) this.traverseNode(node.body, node);
        break;
      case 'TemplateLiteral':
        if (node.expressions) this.traverseArray(node.expressions, node);
        break;
      case 'SpreadElement':
      case 'RestElement':
        if (node.argument) this.traverseNode(node.argument, node);
        break;
      case 'ForInStatement':
      case 'ForOfStatement':
        if (node.left) this.traverseNode(node.left, node);
        if (node.right) this.traverseNode(node.right, node);
        if (node.body) this.traverseNode(node.body, node);
        break;
      case 'JSXElement':
        if (node.openingElement) this.traverseNode(node.openingElement, node);
        if (node.children) this.traverseArray(node.children, node);
        break;
      case 'JSXOpeningElement':
        if (node.attributes) this.traverseArray(node.attributes, node);
        break;
      case 'JSXAttribute':
        if (node.value) this.traverseNode(node.value, node);
        break;
      case 'JSXExpressionContainer':
        if (node.expression) this.traverseNode(node.expression, node);
        break;
    }

    for (let i = 0; i < this.plugins.length; ++i) {
      const plugin = this.plugins[i];
      if (plugin.onNode) {
        try {
          plugin.onNode(node, parent);
        } catch (error) {
          const start: Location = {
            line: node.loc ? node.loc.start.line : 1,
            column: node.loc ? node.loc.start.column : 0,
            index: node.start || 0,
          };
          const end: Location = {
            line: node.loc ? node.loc.end.line : 1,
            column: node.loc ? node.loc.end.column : 0,
            index: node.end || 0,
          };
          throw new ParseError(start, end, Errors.PluginError, error instanceof Error ? error.message : String(error));
        }
      }
    }
  }

  private traverseArray(nodes: any[], parent: ESTree.Node): void {
    for (let i = 0; i < nodes.length; ++i) {
      if (nodes[i]) this.traverseNode(nodes[i], parent);
    }
  }

  callPluginVisitors(ast: ESTree.Program): void {
    if (this.plugins.length === 0) return;

    let hasOnNode = false;
    for (let i = 0; i < this.plugins.length; ++i) {
      if (this.plugins[i].onNode) {
        hasOnNode = true;
        break;
      }
    }

    if (hasOnNode) {
      this.traverseNode(ast, null);
    }
  }

  callPluginFinalize(ast: ESTree.Program): void {
    for (let i = 0; i < this.plugins.length; ++i) {
      const plugin = this.plugins[i];
      if (plugin.finalize) {
        plugin.finalize(ast);
      }
    }
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

function pushComment(comments: ESTree.Comment[], options: NormalizedOptions): OnComment {
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

function pushToken(tokens: Token[], options: NormalizedOptions): OnToken {
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
