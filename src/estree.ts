// Note:
//
// Union types have an identially named, non-exported interface whose name is preceded with an
// underscore.
//
// Reverse mappings are in `T_Node` and friends, and are for testing.
/* tslint:disable class-name no-empty-interface */

interface _Node<T extends string> {
  type: T;
  loc?: SourceLocation | null;
  start?: number;
  end?: number;
  leadingComments?: Comment[];
  trailingComments?: Comment[];
}

export interface T_Node extends T_Statement, T_Expression, T_Pattern, T_ModuleDeclaration, T_ModuleSpecifier {
  Program: Program;
  SwitchCase: SwitchCase;
  CatchClause: CatchClause;
  Property: Property | AssignmentProperty;
  Super: Super;
  SpreadElement: SpreadElement;
  TemplateElement: TemplateElement;
  ClassBody: ClassBody;
  Decorator: Decorator;
  MethodDefinition: MethodDefinition;
  VariableDeclarator: VariableDeclarator;
  JSXIdentifier: JSXIdentifier;
  JSXMemberExpression: JSXMemberExpression;
  JSXNamespacedName: JSXNamespacedName;
  JSXEmptyExpression: JSXEmptyExpression;
  JSXExpressionContainer: JSXExpressionContainer;
  JSXSpreadChild: JSXSpreadChild;
  JSXText: JSXText;
  JSXOpeningElement: JSXOpeningElement;
  JSXClosingElement: JSXClosingElement;
  JSXAttribute: JSXAttribute;
  JSXSpreadAttribute: JSXSpreadAttribute;
}

export type Node =
  | Program
  | SwitchCase
  | CatchClause
  | Statement
  | Expression
  | Property
  | AssignmentProperty
  | Super
  | SpreadElement
  | TemplateElement
  | ClassBody
  | Decorator
  | MethodDefinition
  | ModuleDeclaration
  | ModuleSpecifier
  | Pattern
  | VariableDeclarator
  | JSXIdentifier
  | JSXMemberExpression
  | JSXNamespacedName
  | JSXEmptyExpression
  | JSXExpressionContainer
  | JSXSpreadChild
  | JSXText
  | JSXOpeningElement
  | JSXClosingElement
  | JSXAttribute
  | JSXSpreadAttribute;

interface _Statement<T extends string> extends _Node<T> {}

interface T_Statement extends T_Declaration {
  ExpressionStatement: ExpressionStatement;
  BlockStatement: BlockStatement;
  EmptyStatement: EmptyStatement;
  DebuggerStatement: DebuggerStatement;
  WithStatement: WithStatement;
  ReturnStatement: ReturnStatement;
  LabeledStatement: LabeledStatement;
  BreakStatement: BreakStatement;
  ContinueStatement: ContinueStatement;
  IfStatement: IfStatement;
  SwitchStatement: SwitchStatement;
  ThrowStatement: ThrowStatement;
  TryStatement: TryStatement;
  WhileStatement: WhileStatement;
  DoWhileStatement: DoWhileStatement;
  ForStatement: ForStatement;
  ForInStatement: ForInStatement;
  ForOfStatement: ForOfStatement;
}

export type Statement =
  | ExpressionStatement
  | BlockStatement
  | EmptyStatement
  | DebuggerStatement
  | WithStatement
  | ReturnStatement
  | LabeledStatement
  | BreakStatement
  | ContinueStatement
  | IfStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | WhileStatement
  | DoWhileStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | Declaration;

interface _Expression<T extends string> extends _Node<T> {}

interface T_Expression {
  Identifier: Identifier;
  Literal: Literal | RegExpLiteral;
  ThisExpression: ThisExpression;
  ArrayExpression: ArrayExpression;
  ObjectExpression: ObjectExpression;
  FunctionExpression: FunctionExpression;
  UnaryExpression: UnaryExpression;
  UpdateExpression: UpdateExpression;
  BinaryExpression: BinaryExpression;
  AssignmentExpression: AssignmentExpression;
  LogicalExpression: LogicalExpression;
  MemberExpression: MemberExpression;
  ConditionalExpression: ConditionalExpression;
  CallExpression: CallExpression;
  NewExpression: NewExpression;
  SequenceExpression: SequenceExpression;
  ArrowFunctionExpression: ArrowFunctionExpression;
  YieldExpression: YieldExpression;
  TemplateLiteral: TemplateLiteral;
  TaggedTemplateExpression: TaggedTemplateExpression;
  ClassExpression: ClassExpression;
  MetaProperty: MetaProperty;
  AwaitExpression: AwaitExpression;
  JSXElement: JSXElement;
}

export type Expression =
  | Identifier
  | Literal
  | RegExpLiteral
  | ThisExpression
  | ArrayExpression
  | ObjectExpression
  | FunctionExpression
  | UnaryExpression
  | UpdateExpression
  | BinaryExpression
  | AssignmentExpression
  | LogicalExpression
  | MemberExpression
  | ConditionalExpression
  | CallExpression
  | NewExpression
  | SequenceExpression
  | ArrowFunctionExpression
  | YieldExpression
  | TemplateLiteral
  | TaggedTemplateExpression
  | ClassExpression
  | MetaProperty
  | AwaitExpression
  | JSXElement;

interface _Pattern<T extends string> extends _Node<T> {}

interface T_Pattern {
  Identifier: Identifier;
  ObjectPattern: ObjectPattern;
  ArrayPattern: ArrayPattern;
  MemberExpression: MemberExpression;
  AssignmentPattern: AssignmentPattern;
  RestElement: RestElement;
}

export type PatternTop = Identifier | ObjectPattern | ArrayPattern | MemberExpression;
export type PatternNoRest = PatternTop | AssignmentPattern;
export type Pattern = PatternTop | AssignmentPattern | RestElement;

interface _Declaration<T extends string> extends _Statement<T> {}

interface T_Declaration {
  FunctionDeclaration: FunctionDeclaration;
  VariableDeclaration: VariableDeclaration;
  ClassDeclaration: ClassDeclaration;
}

export type Declaration = FunctionDeclaration | VariableDeclaration | ClassDeclaration;

interface _ModuleDeclaration<T extends string> extends _Node<T> {}

interface T_ModuleDeclaration {
  ImportDeclaration: ImportDeclaration;
  ExportNamedDeclaration: ExportNamedDeclaration;
  ExportDefaultDeclaration: ExportDefaultDeclaration;
  ExportAllDeclaration: ExportAllDeclaration;
}

export type ModuleDeclaration =
  | ImportDeclaration
  | ExportNamedDeclaration
  | ExportDefaultDeclaration
  | ExportAllDeclaration;

interface _ModuleSpecifier<T extends string> extends _Node<T> {
  local: Identifier;
}

interface T_ModuleSpecifier {
  ImportSpecifier: ImportSpecifier;
  ImportDefaultSpecifier: ImportDefaultSpecifier;
  ImportNamespaceSpecifier: ImportNamespaceSpecifier;
  ExportSpecifier: ExportSpecifier;
}

export type ModuleSpecifier = ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier | ExportSpecifier;

export interface SourceLocation {
  source: string | null;
  start: Position;
  end: Position;
}

export interface Position {
  /** >= 1 */
  line: number;
  /** >= 0 */
  column: number;
}

export type CommentType = 'SingleLineComment' | 'MultiLineComment';

export interface Comment {
  type: CommentType;
  value: string;
  start?: number;
  end?: number;
  loc?: SourceLocation | null;
}

/**
 * Core types
 */

export interface Program extends _Node<'Program'> {
  sourceType: 'script' | 'module';
  body: (Statement | ModuleDeclaration)[];
}

export interface ArrayExpression extends _Expression<'ArrayExpression'> {
  elements: (Expression | SpreadElement | null)[];
}

export interface ArrayPattern extends _Pattern<'ArrayPattern'> {
  elements: (Pattern | null)[];
}

export type AssignmentOperator =
  | '='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '<<='
  | '>>='
  | '>>>='
  | '|='
  | '^='
  | '&='
  | '**=';

export interface AssignmentExpression extends _Expression<'AssignmentExpression'> {
  operator: AssignmentOperator;
  left: Expression | PatternTop;
  right: Expression;
}

export interface AssignmentPattern extends _Pattern<'AssignmentPattern'> {
  left: PatternTop;
  right: Expression;
}

export interface ArrowFunctionExpression extends _Expression<'ArrowFunctionExpression'> {
  id: Identifier | null;
  params: Pattern[];
  body: BlockStatement | Expression;
  expression: boolean;
  async: boolean;
  generator: false;
}

export interface AwaitExpression extends _Expression<'AwaitExpression'> {
  argument: Expression;
}

export type BinaryOperator =
  | '=='
  | '!='
  | '==='
  | '!=='
  | '<'
  | '<='
  | '>'
  | '>='
  | '<<'
  | '>>'
  | '>>>'
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '|'
  | '^'
  | '&'
  | 'in'
  | '**'
  | 'instanceof';

export interface BinaryExpression extends _Expression<'BinaryExpression'> {
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}

export interface BlockStatement extends _Statement<'BlockStatement'> {
  body: Statement[];
}

export interface BreakStatement extends _Statement<'BreakStatement'> {
  label: Identifier | null;
}

export interface CallExpression extends _Expression<'CallExpression'> {
  callee: Expression | Import | Super;
  arguments: (Expression | SpreadElement)[];
}

export interface CatchClause extends _Node<'CatchClause'> {
  param: PatternTop;
  body: BlockStatement;
}

export interface ClassBody extends _Node<'ClassBody'> {
  body: MethodDefinition[];
}

export interface ClassDeclaration extends _Declaration<'ClassDeclaration'> {
  id: Identifier | null;
  superClass: Expression | null;
  body: ClassBody;
}

export interface ClassExpression extends _Expression<'ClassExpression'> {
  id: Identifier | null;
  superClass: Expression | null;
  body: ClassBody;
}

export interface MemberExpression extends _Expression<'MemberExpression'> {
  computed: boolean;
  object: Expression | Super;
  property: Expression;
}

export interface ConditionalExpression extends _Expression<'ConditionalExpression'> {
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface ContinueStatement extends _Statement<'ContinueStatement'> {
  label: Identifier | null;
}

export interface DebuggerStatement extends _Statement<'DebuggerStatement'> {}

export interface DoWhileStatement extends _Statement<'DoWhileStatement'> {
  body: Statement;
  test: Expression;
}

export interface EmptyStatement extends _Statement<'EmptyStatement'> {}

export interface ExportAllDeclaration extends _ModuleDeclaration<'ExportAllDeclaration'> {
  source: Literal;
}

export interface ExportDefaultDeclaration extends _ModuleDeclaration<'ExportDefaultDeclaration'> {
  declaration: Declaration | Expression;
}

export interface ExportNamedDeclaration extends _ModuleDeclaration<'ExportNamedDeclaration'> {
  declaration: Declaration | null;
  specifiers: ExportSpecifier[];
  source: Literal | null;
}

export interface ExportSpecifier extends _ModuleSpecifier<'ExportSpecifier'> {
  exported: Identifier;
}

export interface ExpressionStatement extends _Statement<'ExpressionStatement'> {
  expression: Expression;
  directive?: string;
}

export interface ForInStatement extends _Statement<'ForInStatement'> {
  left: VariableDeclaration | Expression | PatternNoRest;
  right: Expression;
  body: Statement;
}

export interface ForOfStatement extends _Statement<'ForOfStatement'> {
  left: VariableDeclaration | Expression | PatternNoRest;
  right: Expression;
  body: Statement;
  await: boolean;
}

export interface ForStatement extends _Statement<'ForStatement'> {
  init: VariableDeclaration | Expression | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
}

export interface FunctionDeclaration extends _Declaration<'FunctionDeclaration'> {
  id: Identifier | null;
  params: Pattern[];
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  expression: false;
}

export interface FunctionExpression extends _Expression<'FunctionExpression'> {
  id: Identifier | null;
  params: Pattern[];
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  expression: false;
}

export interface Identifier extends _Expression<'Identifier'>, _Pattern<'Identifier'> {
  name: string;
  raw?: string;
}

export interface IfStatement extends _Statement<'IfStatement'> {
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

export interface Import extends _Node<'Import'> {}

export interface ImportDeclaration extends _ModuleDeclaration<'ImportDeclaration'> {
  specifiers: (ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier)[];
  source: Literal;
}

export interface ImportDefaultSpecifier extends _ModuleSpecifier<'ImportDefaultSpecifier'> {}

export interface ImportNamespaceSpecifier extends _ModuleSpecifier<'ImportNamespaceSpecifier'> {}

export interface ImportSpecifier extends _ModuleSpecifier<'ImportSpecifier'> {
  imported: Identifier;
}

export interface LabeledStatement extends _Statement<'LabeledStatement'> {
  label: Identifier;
  body: Statement;
}

export interface Literal extends _Expression<'Literal'> {
  value: boolean | number | string | null;
  raw?: string;
  bigint?: string;
}

export type LogicalOperator = '&&' | '||';

export interface Decorator extends _Node<'Decorator'> {
  expression: Expression;
}

export interface LogicalExpression extends _Expression<'LogicalExpression'> {
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}

export interface MetaProperty extends _Expression<'MetaProperty'> {
  meta: Identifier;
  property: Identifier;
}

export interface MethodDefinition extends _Node<'MethodDefinition'> {
  key: Expression | null;
  value: FunctionExpression | null;
  kind: 'constructor' | 'method' | 'get' | 'set';
  computed: boolean;
  static: boolean;
}

export interface NewExpression extends _Expression<'NewExpression'> {
  callee: Expression;
  arguments: (Expression | SpreadElement)[];
}

export interface Property extends _Node<'Property'> {
  key: Expression;
  computed: boolean;
  value: Expression | null;
  kind: 'init' | 'get' | 'set';
  method: boolean;
  shorthand: boolean;
}

export interface ObjectExpression extends _Expression<'ObjectExpression'> {
  properties: (Property | SpreadElement)[];
}

export interface AssignmentProperty extends _Node<'Property'> {
  key: Expression;
  value: PatternNoRest;
  computed: boolean;
  kind: 'init';
  method: false;
  shorthand: boolean;
}

export interface ObjectPattern extends _Pattern<'ObjectPattern'> {
  properties: (AssignmentProperty | RestElement)[];
}

export interface RegExpLiteral extends _Expression<'Literal'> {
  value: RegExp | null;
  raw?: string;
  regex: { pattern: string; flags: string };
}

export interface RestElement extends _Pattern<'RestElement'> {
  argument: PatternTop;
}

export interface ReturnStatement extends _Statement<'ReturnStatement'> {
  argument: Expression | null;
}

export interface SequenceExpression extends _Expression<'SequenceExpression'> {
  expressions: Expression[];
}

export interface SpreadElement extends _Node<'SpreadElement'> {
  argument: Expression;
}

export interface Super extends _Node<'Super'> {}

export interface SwitchCase extends _Node<'SwitchCase'> {
  test: Expression | null;
  consequent: Statement[];
}

export interface SwitchStatement extends _Statement<'SwitchStatement'> {
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface TaggedTemplateExpression extends _Expression<'TaggedTemplateExpression'> {
  tag: Expression;
  quasi: TemplateLiteral;
}

export interface TemplateElement extends _Node<'TemplateElement'> {
  value: { cooked: string | null; raw: string };
  tail: boolean;
}

export interface TemplateLiteral extends _Expression<'TemplateLiteral'> {
  quasis: TemplateElement[];
  expressions: Expression[];
}

export interface ThisExpression extends _Expression<'ThisExpression'> {}

export interface ThrowStatement extends _Statement<'ThrowStatement'> {
  argument: Expression;
}

export interface TryStatement extends _Statement<'TryStatement'> {
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
}

export type UnaryOperator = '-' | '+' | '!' | '~' | 'typeof' | 'void' | 'delete';
export interface UnaryExpression extends _Expression<'UnaryExpression'> {
  operator: UnaryOperator;
  argument: Expression;
  prefix: boolean;
}

export type UpdateOperator = '++' | '--';
export interface UpdateExpression extends _Expression<'UpdateExpression'> {
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
}

export interface VariableDeclaration extends _Declaration<'VariableDeclaration'> {
  declarations: VariableDeclarator[];
  kind: 'var' | 'let' | 'const';
}

export interface VariableDeclarator extends _Node<'VariableDeclarator'> {
  id: PatternTop;
  init: Expression | null;
}

export interface WhileStatement extends _Statement<'WhileStatement'> {
  test: Expression;
  body: Statement;
}

export interface WithStatement extends _Statement<'WithStatement'> {
  object: Expression;
  body: Statement;
}

export interface YieldExpression extends _Expression<'YieldExpression'> {
  argument: Expression | null;
  delegate: boolean;
}

/**
 * JSX types
 *
 * Reference: https://github.com/facebook/jsx/blob/master/AST.md
 */

export interface JSXIdentifier extends _Node<'JSXIdentifier'> {
  name: string;
}

export interface JSXMemberExpression extends _Node<'JSXMemberExpression'> {
  object: JSXMemberExpression | JSXIdentifier;
  property: JSXIdentifier;
}

export interface JSXNamespacedName extends _Node<'JSXNamespacedName'> {
  namespace: JSXIdentifier;
  name: JSXIdentifier;
}

export interface JSXEmptyExpression extends _Node<'JSXEmptyExpression'> {}

export interface JSXExpressionContainer extends _Node<'JSXExpressionContainer'> {
  expression: Expression | JSXEmptyExpression;
}

export interface JSXSpreadChild extends _Node<'JSXSpreadChild'> {
  expression: Expression;
}

interface _JSXBoundaryElement<T extends string> extends _Node<T> {
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName;
}
type JSXBoundaryElement = JSXOpeningElement | JSXClosingElement;

export interface JSXOpeningElement extends _JSXBoundaryElement<'JSXOpeningElement'> {
  selfClosing: boolean;
  attributes: (JSXAttribute | JSXSpreadAttribute)[];
}

export interface JSXText extends _Node<'JSXText'> {
  value: string;
  raw: string;
}

export interface JSXClosingElement extends _JSXBoundaryElement<'JSXClosingElement'> {}

export interface JSXAttribute extends _Node<'JSXAttribute'> {
  name: JSXIdentifier | JSXNamespacedName;
  value: Literal | JSXElement | JSXSpreadAttribute | JSXExpressionContainer | null;
}

export interface JSXSpreadAttribute extends _Node<'JSXSpreadAttribute'> {
  argument: Expression;
}

export interface JSXElement extends _Expression<'JSXElement'> {
  openingElement: JSXOpeningElement;
  children: (JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement)[];
  closingElement: JSXClosingElement | null;
}
