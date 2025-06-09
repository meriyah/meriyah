export interface _Node {
  start?: number;
  end?: number;
  range?: [number, number];
  loc?: SourceLocation | null;
}

export interface SourceLocation {
  source?: string | null;
  start: Position;
  end: Position;
}

export interface Position {
  /** >= 1 */
  line: number;
  /** >= 0 */
  column: number;
}

export type Labels = any;

export type IdentifierOrExpression = Identifier | Expression | ArrowFunctionExpression;

export type ArgumentExpression =
  | ArrayExpression
  | AssignmentExpression
  | ConditionalExpression
  | Literal
  | SpreadElement
  | BinaryExpression
  | LogicalExpression
  | SequenceExpression;

export type CommentType = 'SingleLine' | 'MultiLine' | 'HTMLOpen' | 'HTMLClose' | 'HashbangComment';

export interface Comment {
  type: CommentType;
  value: string;
  start?: number;
  end?: number;
  loc?: SourceLocation | null;
}

export type Node =
  | ArrayExpression
  | ArrayPattern
  | ArrowFunctionExpression
  | AssignmentExpression
  | AssignmentPattern
  | AwaitExpression
  | BigIntLiteral
  | BinaryExpression
  | BlockStatement
  | BreakStatement
  | CallExpression
  | ChainExpression
  | ImportExpression
  | CatchClause
  | ClassBody
  | ClassDeclaration
  | ClassExpression
  | ConditionalExpression
  | ContinueStatement
  | DebuggerStatement
  | Decorator
  | DoWhileStatement
  | EmptyStatement
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ExportSpecifier
  | ExpressionStatement
  | PropertyDefinition
  | ForInStatement
  | ForOfStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Identifier
  | IfStatement
  | Import
  | ImportDeclaration
  | ImportDefaultSpecifier
  | ImportAttribute
  | ImportNamespaceSpecifier
  | ImportSpecifier
  | JSXNamespacedName
  | JSXAttribute
  | JSXClosingElement
  | JSXClosingFragment
  | JSXElement
  | JSXEmptyExpression
  | JSXExpressionContainer
  | JSXFragment
  | JSXIdentifier
  | JSXOpeningElement
  | JSXOpeningFragment
  | JSXSpreadAttribute
  | JSXSpreadChild
  | JSXMemberExpression
  | JSXText
  | LabeledStatement
  | Literal
  | LogicalExpression
  | MemberExpression
  | MetaProperty
  | MethodDefinition
  | NewExpression
  | ObjectExpression
  | ObjectPattern
  | ParenthesizedExpression
  | PrivateIdentifier
  | Program
  | Property
  | RegExpLiteral
  | RestElement
  | ReturnStatement
  | SequenceExpression
  | SpreadElement
  | StaticBlock
  | Super
  | SwitchCase
  | SwitchStatement
  | TaggedTemplateExpression
  | TemplateElement
  | TemplateLiteral
  | ThisExpression
  | ThrowStatement
  | TryStatement
  | UpdateExpression
  | UnaryExpression
  | VariableDeclaration
  | VariableDeclarator
  | WhileStatement
  | WithStatement
  | YieldExpression;
export type BindingPattern = ArrayPattern | ObjectPattern | Identifier;
export type ClassElement = FunctionExpression | MethodDefinition;
export type DeclarationStatement =
  | ClassDeclaration
  | ClassExpression
  | ExportDefaultDeclaration
  | ExportAllDeclaration
  | ExportNamedDeclaration
  | FunctionDeclaration;
export type EntityName = Identifier;
export type ExportDeclaration = ClassDeclaration | ClassExpression | FunctionDeclaration | VariableDeclaration;
export type Expression =
  | ArrowFunctionExpression
  | AssignmentExpression
  | BinaryExpression
  | ConditionalExpression
  | MetaProperty
  | ChainExpression
  | JSXClosingElement
  | JSXClosingFragment
  | JSXExpressionContainer
  | JSXOpeningElement
  | JSXOpeningFragment
  | JSXSpreadChild
  | LogicalExpression
  | NewExpression
  | RestElement
  | SequenceExpression
  | SpreadElement
  | AwaitExpression
  | LeftHandSideExpression
  | UnaryExpression
  | UpdateExpression
  | YieldExpression;
export type ForInitializer = Expression | VariableDeclaration;
// TODO: Misspelled, remove this in v7
// spellchecker: disable-next-line
export { ForInitializer as ForInitialiser };
export type ImportClause = ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier;
export type IterationStatement = DoWhileStatement | ForInStatement | ForOfStatement | ForStatement | WhileStatement;
export type JSXChild = JSXElement | JSXExpression | JSXFragment | JSXText;
export type JSXExpression = JSXEmptyExpression | JSXSpreadChild | JSXExpressionContainer;
export type JSXTagNameExpression = JSXIdentifier | JSXMemberExpression | JSXNamespacedName;
export type LeftHandSideExpression =
  | CallExpression
  | ChainExpression
  | ImportExpression
  | ClassExpression
  | ClassDeclaration
  | FunctionExpression
  | LiteralExpression
  | MemberExpression
  | PrimaryExpression
  | TaggedTemplateExpression;
export type LiteralExpression = Literal | TemplateLiteral;
export type ObjectLiteralElementLike = MethodDefinition | Property | RestElement | SpreadElement;
export type Parameter = AssignmentPattern | RestElement | ArrayPattern | ObjectPattern | Identifier;
export type PrimaryExpression =
  | ArrayExpression
  | ArrayPattern
  | ClassExpression
  | FunctionExpression
  | Identifier
  | Import
  | JSXElement
  | JSXFragment
  | JSXOpeningElement
  | Literal
  | LiteralExpression
  | MetaProperty
  | ObjectExpression
  | ObjectPattern
  | Super
  | TemplateLiteral
  | ThisExpression;
export type PrimaryExpressionExtended =
  | ArrayExpression
  | ArrowFunctionExpression
  | ArrayPattern
  | AwaitExpression
  | Expression
  | ClassExpression
  | FunctionExpression
  | Identifier
  | Import
  | JSXElement
  | JSXFragment
  | JSXOpeningElement
  | Literal
  | LiteralExpression
  | MetaProperty
  | ObjectExpression
  | ObjectPattern
  | PrivateIdentifier
  | NewExpression
  | Super
  | TemplateLiteral
  | ThisExpression
  | UnaryExpression
  | UpdateExpression;
export type PropertyName = Identifier | Literal;
export type Statement =
  | BlockStatement
  | BreakStatement
  | ContinueStatement
  | DebuggerStatement
  | DeclarationStatement
  | EmptyStatement
  | ExpressionStatement
  | IfStatement
  | IterationStatement
  | ImportDeclaration
  | LabeledStatement
  | ReturnStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | VariableDeclaration
  | WithStatement;

interface ClassDeclarationBase extends _Node {
  id: Identifier | null;
  body: ClassBody;
  superClass: Expression | null;
  decorators?: Decorator[];
}

interface FunctionDeclarationBase extends _Node {
  id: Identifier | null;
  generator: boolean;
  async: boolean;
  params: Parameter[];
  body?: BlockStatement | null;
}

export interface BlockStatementBase extends _Node {
  body: Statement[];
}

export interface ArrayExpression extends _Node {
  type: 'ArrayExpression';
  elements: (Expression | SpreadElement | null)[];
}

export interface ArrayPattern extends _Node {
  type: 'ArrayPattern';
  elements: Expression[];
}

export interface ArrowFunctionExpression extends _Node {
  type: 'ArrowFunctionExpression';
  params: Parameter[];
  body: Expression | BlockStatement;
  async: boolean;
  expression: boolean;
  generator: false;
}

export interface AssignmentExpression extends _Node {
  type: 'AssignmentExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface AssignmentPattern extends _Node {
  type: 'AssignmentPattern';
  left: BindingPattern | Identifier;
  right?: Expression;
}

export interface AwaitExpression extends _Node {
  type: 'AwaitExpression';
  argument: Expression;
}

export interface BigIntLiteral extends Literal {
  bigint: string;
}

export interface BinaryExpression extends _Node {
  type: 'BinaryExpression';
  operator: string;
  left: Expression | PrivateIdentifier;
  right: Expression;
}

export interface BlockStatement extends BlockStatementBase {
  type: 'BlockStatement';
}

export interface BreakStatement extends _Node {
  type: 'BreakStatement';
  label: Identifier | null;
}

export interface ImportExpression extends _Node {
  type: 'ImportExpression';
  source: Expression;
  options?: Expression | null;
}

export interface ChainExpression extends _Node {
  type: 'ChainExpression';
  expression: CallExpression | MemberExpression;
}

export interface CallExpression extends _Node {
  type: 'CallExpression';
  callee: any; //Expression | Super;
  arguments: (Expression | SpreadElement)[];
  optional?: boolean;
}

export interface CatchClause extends _Node {
  type: 'CatchClause';
  param: BindingPattern | Identifier | null;
  body: BlockStatement;
}

export interface StaticBlock extends BlockStatementBase {
  type: 'StaticBlock';
}

export interface ClassBody extends _Node {
  type: 'ClassBody';
  body: (ClassElement | PropertyDefinition | AccessorProperty | StaticBlock)[];
}

export interface AccessorProperty extends _Node {
  type: 'AccessorProperty';
  key: PrivateIdentifier | Expression;
  value: any;
  decorators?: Decorator[];
  computed: boolean;
  static: boolean;
}

export interface PropertyDefinition extends _Node {
  type: 'PropertyDefinition';
  key: PrivateIdentifier | Expression;
  value: any;
  decorators?: Decorator[];
  computed: boolean;
  static: boolean;
}

export interface PrivateIdentifier extends _Node {
  type: 'PrivateIdentifier';
  name: string;
}

export interface ClassDeclaration extends ClassDeclarationBase {
  type: 'ClassDeclaration';
}

export interface ClassExpression extends ClassDeclarationBase {
  type: 'ClassExpression';
}

export interface ConditionalExpression extends _Node {
  type: 'ConditionalExpression';
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface ContinueStatement extends _Node {
  type: 'ContinueStatement';
  label: Identifier | null;
}

export interface DebuggerStatement extends _Node {
  type: 'DebuggerStatement';
}

export interface Decorator extends _Node {
  type: 'Decorator';
  expression: LeftHandSideExpression;
}

export interface DoWhileStatement extends _Node {
  type: 'DoWhileStatement';
  test: Expression;
  body: Statement;
}

export interface EmptyStatement extends _Node {
  type: 'EmptyStatement';
}

export interface ExportAllDeclaration extends _Node {
  type: 'ExportAllDeclaration';
  source: Literal;
  exported: Identifier | Literal | null;
  attributes?: ImportAttribute[];
}

export interface ExportDefaultDeclaration extends _Node {
  type: 'ExportDefaultDeclaration';
  declaration: ExportDeclaration | Expression;
}

export interface ExportNamedDeclaration extends _Node {
  type: 'ExportNamedDeclaration';
  declaration: ExportDeclaration | null;
  specifiers: ExportSpecifier[];
  source: Literal | null;
  attributes?: ImportAttribute[];
}

export interface ExportSpecifier extends _Node {
  type: 'ExportSpecifier';
  local: Identifier | Literal;
  exported: Identifier | Literal;
}

export interface ExpressionStatement extends _Node {
  type: 'ExpressionStatement';
  expression: Expression;
}

export interface ForInStatement extends _Node {
  type: 'ForInStatement';
  left: ForInitializer;
  right: Expression;
  body: Statement;
}

export interface ForOfStatement extends _Node {
  type: 'ForOfStatement';
  left: ForInitializer;
  right: Expression;
  body: Statement;
  await: boolean;
}

export interface ForStatement extends _Node {
  type: 'ForStatement';
  init: Expression | ForInitializer | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
}

export interface FunctionDeclaration extends FunctionDeclarationBase {
  type: 'FunctionDeclaration';
}

export interface FunctionExpression extends FunctionDeclarationBase {
  type: 'FunctionExpression';
}

export interface Identifier extends _Node {
  type: 'Identifier';
  name: string;
}

export interface IfStatement extends _Node {
  type: 'IfStatement';
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

export interface Import extends _Node {
  type: 'Import';
}

export interface ImportDeclaration extends _Node {
  type: 'ImportDeclaration';
  source: Literal;
  specifiers: ImportClause[];
  attributes?: ImportAttribute[];
}

export interface ImportAttribute extends _Node {
  type: 'ImportAttribute';
  key: Identifier | Literal;
  value: Literal;
}

export interface ImportDefaultSpecifier extends _Node {
  type: 'ImportDefaultSpecifier';
  local: Identifier;
}

export interface ImportNamespaceSpecifier extends _Node {
  type: 'ImportNamespaceSpecifier';
  local: Identifier;
}

export interface ImportSpecifier extends _Node {
  type: 'ImportSpecifier';
  local: Identifier;
  imported: Identifier | Literal;
}

export interface JSXNamespacedName extends _Node {
  type: 'JSXNamespacedName';
  namespace: JSXIdentifier | JSXMemberExpression;
  name: JSXIdentifier;
}

export type JSXAttributeValue =
  | JSXIdentifier
  | Literal
  | JSXElement
  | JSXFragment
  | JSXExpressionContainer
  | JSXSpreadChild
  | null;

export interface JSXAttribute extends _Node {
  type: 'JSXAttribute';
  name: JSXNamespacedName | JSXIdentifier;
  value: JSXAttributeValue;
}

export interface JSXClosingElement extends _Node {
  type: 'JSXClosingElement';
  name: JSXTagNameExpression;
}

export interface JSXClosingFragment extends _Node {
  type: 'JSXClosingFragment';
}

export interface JSXElement extends _Node {
  type: 'JSXElement';
  openingElement: JSXOpeningElement;
  closingElement: JSXClosingElement | null;
  children: JSXChild[];
}

export interface JSXEmptyExpression extends _Node {
  type: 'JSXEmptyExpression';
}

export interface JSXExpressionContainer extends _Node {
  type: 'JSXExpressionContainer';
  expression: Expression | JSXEmptyExpression;
}

export interface JSXFragment extends _Node {
  type: 'JSXFragment';
  openingFragment: JSXOpeningFragment;
  closingFragment: JSXClosingFragment;
  children: JSXChild[];
}

export interface JSXIdentifier extends _Node {
  type: 'JSXIdentifier';
  name: string;
}

export interface JSXMemberExpression extends _Node {
  type: 'JSXMemberExpression';
  object: JSXTagNameExpression;
  property: JSXIdentifier;
}

export interface JSXOpeningElement extends _Node {
  type: 'JSXOpeningElement';
  selfClosing: boolean;
  name: JSXTagNameExpression;
  attributes: (JSXAttribute | JSXSpreadAttribute)[];
}

export interface JSXOpeningFragment extends _Node {
  type: 'JSXOpeningFragment';
}

export interface JSXSpreadAttribute extends _Node {
  type: 'JSXSpreadAttribute';
  argument: Expression;
}

export interface JSXSpreadChild extends _Node {
  type: 'JSXSpreadChild';
  expression: Expression | JSXEmptyExpression;
}

export interface JSXText extends _Node {
  type: 'JSXText';
  value: string;
  raw?: string;
}

export interface LabeledStatement extends _Node {
  type: 'LabeledStatement';
  label: Identifier;
  body: Statement;
}

export interface Literal extends _Node {
  type: 'Literal';
  value: boolean | number | string | null | RegExp | bigint;
  raw?: string;
}

export interface LogicalExpression extends _Node {
  type: 'LogicalExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface MemberExpression extends _Node {
  type: 'MemberExpression';
  object: Expression | Super;
  property: Expression | PrivateIdentifier;
  computed?: boolean;
  optional?: boolean;
}

export type Pattern = Identifier | ObjectPattern | ArrayPattern | RestElement | AssignmentPattern | MemberExpression;

export interface MetaProperty extends _Node {
  type: 'MetaProperty';
  meta: Identifier;
  property: Identifier;
}

export interface MethodDefinition extends _Node {
  type: 'MethodDefinition';
  key: Expression | PrivateIdentifier | null;
  value: FunctionExpression;
  computed: boolean;
  static: boolean;
  kind: 'method' | 'get' | 'set' | 'constructor';
  decorators?: Decorator[];
}

export interface NewExpression extends _Node {
  type: 'NewExpression';
  callee: LeftHandSideExpression;
  arguments: Expression[];
}

export interface ObjectExpression extends _Node {
  type: 'ObjectExpression';
  properties: ObjectLiteralElementLike[];
}

export interface ObjectPattern extends _Node {
  type: 'ObjectPattern';
  properties: ObjectLiteralElementLike[];
}

export interface Program extends _Node {
  type: 'Program';
  body: Statement[];
  sourceType: 'module' | 'script';
}

export interface ParenthesizedExpression extends _Node {
  type: 'ParenthesizedExpression';
  expression: Expression;
}

export interface Property extends _Node {
  type: 'Property';
  key: Expression;
  value: Expression | AssignmentPattern | BindingPattern | Identifier;
  computed: boolean;
  method: boolean;
  shorthand: boolean;
  kind: 'init' | 'get' | 'set';
}

export interface RegExpLiteral extends Literal {
  regex: {
    pattern: string;
    flags: string;
  };
}

export interface RestElement extends _Node {
  type: 'RestElement';
  argument: BindingPattern | Identifier | Expression | PropertyName;
  value?: AssignmentPattern;
}

export interface ReturnStatement extends _Node {
  type: 'ReturnStatement';
  argument: Expression | null;
}

export interface SequenceExpression extends _Node {
  type: 'SequenceExpression';
  expressions: Expression[];
}

export type SpreadArgument = BindingPattern | Identifier | Expression | PropertyName | SpreadElement;

export interface SpreadElement extends _Node {
  type: 'SpreadElement';
  argument: SpreadArgument;
}

export interface Super extends _Node {
  type: 'Super';
}

export interface SwitchCase extends _Node {
  type: 'SwitchCase';
  test: Expression | null;
  consequent: Statement[];
}

export interface SwitchStatement extends _Node {
  type: 'SwitchStatement';
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface TaggedTemplateExpression extends _Node {
  type: 'TaggedTemplateExpression';
  tag: Expression;
  quasi: TemplateLiteral;
}

export interface TemplateElement extends _Node {
  type: 'TemplateElement';
  value: {
    raw: string;
    cooked: string | null;
  };
  tail: boolean;
}

export interface TemplateLiteral extends _Node {
  type: 'TemplateLiteral';
  quasis: TemplateElement[];
  expressions: Expression[];
}

export interface ThisExpression extends _Node {
  type: 'ThisExpression';
}

export interface ThrowStatement extends _Node {
  type: 'ThrowStatement';
  argument: Expression;
}

export interface TryStatement extends _Node {
  type: 'TryStatement';
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
}

export type UnaryOperator = '-' | '+' | '!' | '~' | 'typeof' | 'void' | 'delete';
export type UpdateOperator = '++' | '--';

export interface UpdateExpression extends _Node {
  type: 'UpdateExpression';
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
}

export interface UnaryExpression extends _Node {
  type: 'UnaryExpression';
  operator: UnaryOperator;
  prefix: true;
  argument: Expression;
}

export interface VariableDeclaration extends _Node {
  type: 'VariableDeclaration';
  declarations: VariableDeclarator[];
  kind: 'let' | 'const' | 'var';
}

export interface VariableDeclarator extends _Node {
  type: 'VariableDeclarator';
  id: Expression | BindingPattern | Identifier;
  init: Expression | null;
  definite?: boolean;
}

export interface WhileStatement extends _Node {
  type: 'WhileStatement';
  test: Expression;
  body: Statement;
}

export interface WithStatement extends _Node {
  type: 'WithStatement';
  object: Expression;
  body: Statement;
}

export interface YieldExpression extends _Node {
  type: 'YieldExpression';
  delegate: boolean;
  argument?: Expression | null;
}
