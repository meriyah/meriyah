interface _Node<T extends string> {
  type: T;
  start?: number;
  end?: number;
  loc?: SourceLocation | null;
  range?: [number, number];
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
  FieldDefinition: FieldDefinition;
  PrivateName: PrivateName;
  Decorator: Decorator;
  MethodDefinition: MethodDefinition;
  VariableDeclarator: VariableDeclarator;
}
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
  ImportExpression: ImportExpression;
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
}
interface T_ModuleSpecifier {
  ImportSpecifier: ImportSpecifier;
  ImportDefaultSpecifier: ImportDefaultSpecifier;
  ImportNamespaceSpecifier: ImportNamespaceSpecifier;
  ExportSpecifier: ExportSpecifier;
}
interface T_ModuleDeclaration {
  ImportDeclaration: ImportDeclaration;
  ExportNamedDeclaration: ExportNamedDeclaration;
  ExportDefaultDeclaration: ExportDefaultDeclaration;
  ExportAllDeclaration: ExportAllDeclaration;
}

interface T_Pattern {
  Identifier: Identifier;
  ObjectPattern: ObjectPattern;
  ArrayPattern: ArrayPattern;
  MemberExpression: MemberExpression;
  AssignmentPattern: AssignmentPattern;
  RestElement: RestElement;
}
export type Node =
  | Identifier
  | Literal
  | Program
  | Function
  | SwitchCase
  | CatchClause
  | VariableDeclarator
  | Statement
  | Expression
  | Property
  | AssignmentProperty
  | Super
  | TemplateElement
  | SpreadElement
  | Pattern
  | ClassBody
  | Decorator
  | MethodDefinition
  | ModuleDeclaration
  | ModuleSpecifier;

export type CommentType = 'Line' | 'Block' | 'HTMLOpen' | 'HTMLClose';

export interface Comment {
  type: CommentType;
  value: string;
  start?: number;
  end?: number;
  loc?: SourceLocation | null;
}

interface SourceLocation {
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
/**
 * Core types
 */
export interface Program extends _Node<'Program'> {
  sourceType: 'script' | 'module';
  body: Array<Statement | ModuleDeclaration>;
  comments?: Array<Comment>;
}

interface BaseFunction extends _Node<'Function'> {
  params: Array<Pattern>;
  generator?: boolean;
  async?: boolean;
  body: BlockStatement | Expression;
}

export type Function = FunctionDeclaration | FunctionExpression | ArrowFunctionExpression;

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
  | Decorator
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
  | PrivateName
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
  | AwaitExpression;

export interface EmptyStatement extends _Node<'EmptyStatement'> {}

export interface BlockStatement extends _Node<'BlockStatement'> {
  body: Array<Statement>;
  innerComments?: Array<Comment>;
}

export interface ExpressionStatement extends _Node<'ExpressionStatement'> {
  expression: Expression;
  directive?: string;
}

export interface IfStatement extends _Node<'IfStatement'> {
  test: Expression;
  consequent: Statement;
  alternate?: Statement | null;
}

export interface LabeledStatement extends _Node<'LabeledStatement'> {
  label: Identifier;
  body: Statement;
}

export interface BreakStatement extends _Node<'BreakStatement'> {
  label?: Identifier | null;
}

export interface ContinueStatement extends _Node<'ContinueStatement'> {
  label?: Identifier | null;
}

export interface WithStatement extends _Node<'WithStatement'> {
  object: Expression;
  body: Statement;
}

export interface SwitchStatement extends _Node<'SwitchStatement'> {
  discriminant: Expression;
  cases: Array<SwitchCase>;
}

export interface ReturnStatement extends _Node<'ReturnStatement'> {
  argument?: Expression | null;
}

export interface ThrowStatement extends _Node<'ThrowStatement'> {
  argument: Expression;
}

export interface TryStatement extends _Node<'TryStatement'> {
  block: BlockStatement;
  handler?: CatchClause | null;
  finalizer?: BlockStatement | null;
}

export interface WhileStatement extends _Node<'WhileStatement'> {
  test: Expression;
  body: Statement;
}

export interface DoWhileStatement extends _Node<'DoWhileStatement'> {
  body: Statement;
  test: Expression;
}

export interface ForStatement extends _Node<'ForStatement'> {
  init?: VariableDeclaration | Expression | null;
  test?: Expression | null;
  update?: Expression | null;
  body: Statement;
}
export interface ForInStatement extends _Statement<'ForInStatement'> {
  left: VariableDeclaration | Pattern;
  right: Expression;
  body: Statement;
}

export interface ForOfStatement extends _Statement<'ForOfStatement'> {
  left: VariableDeclaration | Pattern;
  right: Expression;
  body: Statement;
  await: boolean;
}

export interface ForStatement extends _Statement<'ForStatement'> {
  init?: VariableDeclaration | Expression | null;
  test?: Expression | null;
  update?: Expression | null;
  body: Statement;
}

interface _Statement<T extends string> extends _Node<T> {}
interface T_Declaration {
  FunctionDeclaration: FunctionDeclaration;
  VariableDeclaration: VariableDeclaration;
  ClassDeclaration: ClassDeclaration;
}
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
  Decorator: Decorator;
}
export interface ForInStatement extends _Statement<'ForInStatement'> {
  left:
    | Identifier
    | MemberExpression
    | ObjectPattern
    | ArrayPattern
    | AssignmentPattern
    | RestElement
    | VariableDeclaration;
  right: Expression;
  body: Statement;
}

export interface DebuggerStatement extends _Node<'DebuggerStatement'> {}

export type Declaration = FunctionDeclaration | VariableDeclaration | ClassDeclaration;
interface _Declaration<T extends string> extends _Statement<T> {}
interface BaseDeclaration extends _Node<'ExpressionStatement'> {}

export interface FunctionDeclaration extends _Declaration<'FunctionDeclaration'> {
  id: Identifier | null;
  params: Pattern[];
  body: BlockStatement;
  generator: boolean;
  async: boolean;
}

export interface VariableDeclaration extends _Declaration<'VariableDeclaration'> {
  declarations: VariableDeclarator[];
  kind: 'var' | 'let' | 'const';
}

export interface VariableDeclarator extends _Node<'VariableDeclarator'> {
  id: Pattern;
  init?: Expression | null;
}
type Expression =
  | ThisExpression
  | ArrayExpression
  | ObjectExpression
  | FunctionExpression
  | ArrowFunctionExpression
  | YieldExpression
  | Literal
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
  | TemplateLiteral
  | TaggedTemplateExpression
  | ClassExpression
  | MetaProperty
  | Identifier
  | AwaitExpression;

export interface ThisExpression extends _Expression<'ThisExpression'> {}

export interface ArrayExpression extends _Expression<'ArrayExpression'> {
  elements: Array<Expression | SpreadElement>;
}

export interface ObjectExpression extends _Expression<'ObjectExpression'> {
  properties: Array<Property>;
}

export interface Property extends _Node<'Property'> {
  key: Expression;
  computed: boolean;
  value: Expression | null;
  kind: 'init' | 'get' | 'set';
  method: boolean;
  shorthand: boolean;
}
export interface FunctionExpression extends _Expression<'FunctionExpression'> {
  id?: Identifier | null;
  body: BlockStatement;
  params: Pattern[];
  async: boolean;
  generator: boolean;
}

export interface SequenceExpression extends _Expression<'SequenceExpression'> {
  expressions: Array<Expression>;
}

export interface UnaryExpression extends _Expression<'UnaryExpression'> {
  operator: UnaryOperator;
  prefix: true;
  argument: Expression;
}

export interface BinaryExpression extends _Expression<'BinaryExpression'> {
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}

export interface AssignmentExpression extends _Expression<'AssignmentExpression'> {
  operator: AssignmentOperator;
  left: Pattern | MemberExpression;
  right: Expression;
}

export interface UpdateExpression extends _Expression<'UpdateExpression'> {
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
}

export interface LogicalExpression extends _Expression<'LogicalExpression'> {
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}

export interface ConditionalExpression extends _Expression<'ConditionalExpression'> {
  test: Expression;
  alternate: Expression;
  consequent: Expression;
}

export interface CallExpression extends _Expression<'CallExpression'> {
  callee: Expression | Import | Super;
  arguments: (Expression | SpreadElement)[];
}

export interface Import extends _Node<'Import'> {}

export interface ImportExpression extends _Expression<'Import'> {}

export interface NewExpression extends _Expression<'NewExpression'> {
  callee: Expression;
  arguments: (Expression | SpreadElement)[];
}
export interface MemberExpression extends _Expression<'MemberExpression'> {
  computed: boolean;
  object: Expression | Super;
  property: Expression | PrivateName;
}

export type Pattern = Identifier | ObjectPattern | ArrayPattern | RestElement | AssignmentPattern | MemberExpression;

export interface SwitchCase extends _Node<'SwitchCase'> {
  test: Expression | null;
  consequent: Statement[];
}
export interface CatchClause extends _Node<'CatchClause'> {
  param: Pattern;
  body: BlockStatement;
}
interface _Pattern<T extends string> extends _Node<T> {}

interface T_Pattern {
  Identifier: Identifier;
  ObjectPattern: ObjectPattern;
  ArrayPattern: ArrayPattern;
  MemberExpression: MemberExpression;
  AssignmentPattern: AssignmentPattern;
  RestElement: RestElement;
}
export interface Identifier extends _Expression<'Identifier'>, _Pattern<'Identifier'> {
  name: string;
  raw?: string;
}

export interface Literal extends _Expression<'Literal'> {
  value: boolean | number | string | null;
  raw?: string;
  bigint?: string;
}

export interface RegExpLiteral extends _Expression<'Literal'> {
  value: RegExp | null;
  raw?: string;
  regex: { pattern: string; flags: string };
}

export type UnaryOperator = '-' | '+' | '!' | '~' | 'typeof' | 'void' | 'delete';

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
  | '**'
  | '|'
  | '^'
  | '&'
  | 'in'
  | 'instanceof';

export type LogicalOperator = '||' | '&&';

export type AssignmentOperator =
  | '='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '**='
  | '<<='
  | '>>='
  | '>>>='
  | '|='
  | '^='
  | '&=';

export type UpdateOperator = '++' | '--';

export interface Super extends _Node<'Super'> {}

export interface SpreadElement extends _Node<'SpreadElement'> {
  argument: Expression;
}

export interface ArrowFunctionExpression extends _Expression<'ArrowFunctionExpression'> {
  expression: boolean;
  body: BlockStatement | Expression;
  params: Pattern[];
  async: boolean;
}

export interface YieldExpression extends _Expression<'YieldExpression'> {
  argument?: Expression | null;
  delegate: boolean;
}

export interface TemplateLiteral extends _Expression<'TemplateLiteral'> {
  quasis: Array<TemplateElement>;
  expressions: Array<Expression>;
}

export interface TaggedTemplateExpression extends _Expression<'TaggedTemplateExpression'> {
  tag: Expression;
  quasi: TemplateLiteral;
}

export interface TemplateElement extends _Node<'TemplateElement'> {
  value: { cooked: string | null; raw: string };
  tail: boolean;
}

export interface AssignmentProperty extends _Node<'Property'> {
  value: Pattern;
  kind: 'init';
  method: boolean; // false
}

export interface ObjectPattern extends _Pattern<'ObjectPattern'> {
  properties: Array<AssignmentProperty>;
}

export interface ArrayPattern extends _Pattern<'ArrayPattern'> {
  elements: Array<Pattern>;
}

export interface RestElement extends _Pattern<'RestElement'> {
  argument: Pattern;
}

export interface AssignmentPattern extends _Pattern<'AssignmentPattern'> {
  left: Pattern;
  right: Expression;
}

export interface ClassBody extends _Node<'ClassBody'> {
  body: Array<MethodDefinition>;
  decorators?: Decorator[] | null;
}
export interface PrivateMemberExpression extends _Node<'FieldDefinition'> {
  object: Expression;
  property: PrivateName;
}
export interface Decorator extends _Node<'Decorator'> {
  expression: Expression;
}
export interface PrivateName extends _Node<'PrivateName'> {
  name: string;
}
export interface FieldDefinition extends _Node<'FieldDefinition'> {
  key: PrivateName | Expression;
  value: any;
  decorators?: Decorator[] | null;
  computed: boolean;
  static: boolean;
}
export interface MethodDefinition extends _Node<'MethodDefinition'> {
  key: Expression;
  value: FunctionExpression;
  kind: 'constructor' | 'method' | 'get' | 'set';
  computed: boolean;
  static: boolean;
  decorators?: Decorator[] | null;
}

export interface ClassDeclaration extends _Declaration<'ClassDeclaration'> {
  id: Identifier | null;
  superClass: Expression | null;
  body: ClassBody;
  decorators?: Decorator[] | null;
}

export interface ClassExpression extends _Expression<'ClassExpression'> {
  id: Identifier | null;
  superClass: Expression | null;
  body: ClassBody;
  decorators?: Decorator[] | null;
}
export interface MetaProperty extends _Expression<'MetaProperty'> {
  meta: Identifier;
  property: Identifier;
}

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

export type ModuleSpecifier = ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier | ExportSpecifier;

interface _ModuleDeclaration<T extends string> extends _Node<T> {}
export interface ImportDeclaration extends _ModuleDeclaration<'ImportDeclaration'> {
  specifiers: (ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier)[];
  source: Literal;
}
export interface ImportSpecifier extends _ModuleSpecifier<'ImportSpecifier'> {
  imported: Identifier;
}
export interface ImportDefaultSpecifier extends _ModuleSpecifier<'ImportDefaultSpecifier'> {}

export interface ImportNamespaceSpecifier extends _ModuleSpecifier<'ImportNamespaceSpecifier'> {}

export interface ExportNamedDeclaration extends _ModuleDeclaration<'ExportNamedDeclaration'> {
  declaration: Declaration | null;
  specifiers: ExportSpecifier[];
  source: Literal | null;
}

export interface ExportSpecifier extends _ModuleSpecifier<'ExportSpecifier'> {
  exported: Identifier;
}
export interface ExportDefaultDeclaration extends _ModuleDeclaration<'ExportDefaultDeclaration'> {
  declaration: Declaration | Expression;
}

export interface ExportAllDeclaration extends _ModuleDeclaration<'ExportAllDeclaration'> {
  source: Literal;
}

export interface AwaitExpression extends _Expression<'AwaitExpression'> {
  argument: Expression;
}
