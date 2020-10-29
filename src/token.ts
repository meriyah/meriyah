export const enum Token {
  Type = 0xFF,

  /* Precedence for binary operators (always positive) */
  PrecStart               = 8,
  Precedence              = 15 << PrecStart, // 8-11

  /* Attribute names */
  Keyword                 = 1 << 12,
  Contextual              = 1 << 13 | Keyword,
  Reserved                = 1 << 14 | Keyword,
  FutureReserved          = 1 << 15 | Keyword,

  IsExpressionStart        = 1 << 16,
  IsIdentifier             = 1 << 17 | Contextual,
  IsInOrOf                 = 1 << 18, // 'in' or 'of'
  IsLogical                = 1 << 19,
  IsAutoSemicolon          = 1 << 20,
  IsPatternStart           = 1 << 21, // Start of pattern, '[' or '{'
  IsAssignOp               = 1 << 22,
  IsBinaryOp               = 1 << 23 | IsExpressionStart,
  IsUnaryOp                = 1 << 24 | IsExpressionStart,
  IsUpdateOp               = 1 << 25 | IsExpressionStart,
  IsMemberOrCallExpression = 1 << 26,
  IsStringOrNumber         = 1 << 27,
  IsCoalesc                = 1 << 28,
  IsEvalOrArguments        = 1 << 29 | IsExpressionStart | IsIdentifier,
  IsClassField             = 1 << 30,

  // Note: 1 << 31... turns to negative

  /* Node types */
  EOF = 0 | IsAutoSemicolon,

  /* Constants/Bindings */
  Identifier        = 1 | IsExpressionStart | IsIdentifier,
  NumericLiteral    = 2 | IsExpressionStart | IsStringOrNumber,
  StringLiteral     = 3 | IsExpressionStart | IsStringOrNumber,
  RegularExpression = 4 | IsExpressionStart,
  FalseKeyword      = 5 | Reserved | IsExpressionStart,
  TrueKeyword       = 6 | Reserved | IsExpressionStart,
  NullKeyword       = 7 | Reserved | IsExpressionStart,

  /* Template nodes */
  TemplateContinuation = 8 | IsExpressionStart | IsMemberOrCallExpression,
  TemplateSpan = 9 | IsExpressionStart | IsMemberOrCallExpression,

  /* Punctuators */
  Arrow        = 10, // =>
  LeftParen    = 11 | IsExpressionStart | IsMemberOrCallExpression, // (
  LeftBrace    = 12 | IsExpressionStart | IsPatternStart, // {
  Period       = 13 | IsMemberOrCallExpression, // .
  Ellipsis     = 14, // ...
  RightBrace   = 15 | IsAutoSemicolon | IsClassField, // }
  RightParen   = 16, // )
  Semicolon    = 17 | IsAutoSemicolon | IsClassField, // ;
  Comma        = 18, // ,
  LeftBracket  = 19 | IsExpressionStart | IsPatternStart | IsMemberOrCallExpression, // [
  RightBracket = 20, // ]
  Colon        = 21, // :
  QuestionMark = 22, // ?
  SingleQuote  = 23, // '
  DoubleQuote  = 24, // "
  JSXClose     = 25, // </
  JSXAutoClose = 26, // />

  /* Update operators */
  Increment = 27 | IsUpdateOp, // ++
  Decrement = 28 | IsUpdateOp, // --

  /* Assign operators */
  Assign                  = 29 | IsAssignOp | IsClassField, // =
  ShiftLeftAssign         = 30 | IsAssignOp, // <<=
  ShiftRightAssign        = 31 | IsAssignOp, // >>=
  LogicalShiftRightAssign = 32 | IsAssignOp, // >>>=
  ExponentiateAssign      = 33 | IsAssignOp, // **=
  AddAssign               = 34 | IsAssignOp, // +=
  SubtractAssign          = 35 | IsAssignOp, // -=
  MultiplyAssign          = 36 | IsAssignOp, // *=
  DivideAssign            = 37 | IsAssignOp | IsExpressionStart, // /=
  ModuloAssign            = 38 | IsAssignOp, // %=
  BitwiseXorAssign        = 39 | IsAssignOp, // ^=
  BitwiseOrAssign         = 40 | IsAssignOp, // |=
  BitwiseAndAssign        = 41 | IsAssignOp, // &=

  /* Unary/binary operators */
  TypeofKeyword      = 42 | IsUnaryOp | Reserved,
  DeleteKeyword      = 43 | IsUnaryOp | Reserved,
  VoidKeyword        = 44 | IsUnaryOp | Reserved,
  Negate             = 45 | IsUnaryOp, // !
  Complement         = 46 | IsUnaryOp, // ~
  Add                = 47 | IsUnaryOp | IsBinaryOp | 10 << PrecStart, // +
  Subtract           = 48 | IsUnaryOp | IsBinaryOp | 10 << PrecStart, // -
  InKeyword          = 49 | IsBinaryOp | 8 << PrecStart | Reserved | IsInOrOf,
  InstanceofKeyword  = 50 | IsBinaryOp | 8 << PrecStart | Reserved,
  Multiply           = 51 | IsBinaryOp | 11 << PrecStart, // *
  Modulo             = 52 | IsBinaryOp | 11 << PrecStart, // %
  Divide             = 53 | IsBinaryOp | IsExpressionStart | 11 << PrecStart, // /
  Exponentiate       = 54 | IsBinaryOp | 12 << PrecStart, // **
  LogicalAnd         = 55 | IsBinaryOp | IsLogical | 3 << PrecStart, // &&
  LogicalOr          = 56 | IsBinaryOp | IsLogical | 2 << PrecStart, // ||
  StrictEqual        = 57 | IsBinaryOp | 7 << PrecStart, // ===
  StrictNotEqual     = 58 | IsBinaryOp | 7 << PrecStart, // !==
  LooseEqual         = 59 | IsBinaryOp | 7 << PrecStart, // ==
  LooseNotEqual      = 60 | IsBinaryOp | 7 << PrecStart, // !=
  LessThanOrEqual    = 61 | IsBinaryOp | 7 << PrecStart, // <=
  GreaterThanOrEqual = 62 | IsBinaryOp | 7 << PrecStart, // >=
  LessThan           = 63 | IsBinaryOp | IsExpressionStart | 8 << PrecStart, // <
  GreaterThan        = 64 | IsBinaryOp | 8 << PrecStart, // >
  ShiftLeft          = 65 | IsBinaryOp | 9 << PrecStart, // <<
  ShiftRight         = 66 | IsBinaryOp | 9 << PrecStart, // >>
  LogicalShiftRight  = 67 | IsBinaryOp | 9 << PrecStart, // >>>
  BitwiseAnd         = 68 | IsBinaryOp | 6 << PrecStart, // &
  BitwiseOr          = 69 | IsBinaryOp | 4 << PrecStart, // |
  BitwiseXor         = 70 | IsBinaryOp | 5 << PrecStart, // ^

  /* Variable declaration kinds */
  VarKeyword   = 71 | IsExpressionStart | Reserved,
  LetKeyword   = 72 | IsExpressionStart | FutureReserved | IsIdentifier,
  ConstKeyword = 73 | IsExpressionStart | Reserved,

  /* Other reserved words */
  BreakKeyword    = 74 | Reserved,
  CaseKeyword     = 75 | Reserved,
  CatchKeyword    = 76 | Reserved,
  ClassKeyword    = 77 | IsExpressionStart | Reserved,
  ContinueKeyword = 78 | Reserved,
  DebuggerKeyword = 79 | Reserved,
  DefaultKeyword  = 80 | Reserved,
  DoKeyword       = 81 | Reserved,
  ElseKeyword     = 82 | Reserved,
  ExportKeyword   = 83 | Reserved,
  ExtendsKeyword  = 84 | Reserved,
  FinallyKeyword  = 85 | Reserved,
  ForKeyword      = 86 | Reserved,
  FunctionKeyword = 87 | IsExpressionStart | Reserved,
  IfKeyword       = 88 | Reserved,
  ImportKeyword   = 89 | IsExpressionStart | Reserved,
  NewKeyword      = 90 | IsExpressionStart | Reserved,
  ReturnKeyword   = 91 | Reserved,
  SuperKeyword    = 92 | IsExpressionStart | Reserved,
  SwitchKeyword   = 93 | IsExpressionStart | Reserved,
  ThisKeyword     = 94 | IsExpressionStart | Reserved,
  ThrowKeyword    = 95 | IsExpressionStart | Reserved,
  TryKeyword      = 96 | Reserved,
  WhileKeyword    = 97 | Reserved,
  WithKeyword     = 98 | Reserved,

  /* Strict mode reserved words */
  ImplementsKeyword = 99 | FutureReserved,
  InterfaceKeyword  = 100 | FutureReserved,
  PackageKeyword    = 101 | FutureReserved,
  PrivateKeyword    = 102 | FutureReserved,
  ProtectedKeyword  = 103 | FutureReserved,
  PublicKeyword     = 104 | FutureReserved,
  StaticKeyword     = 105 | FutureReserved,
  YieldKeyword      = 106 | FutureReserved | IsExpressionStart | IsIdentifier,

  /* Contextual keywords */
  AsKeyword          = 107 | Contextual,
  AsyncKeyword       = 108 | Contextual | IsIdentifier,
  AwaitKeyword       = 109 | Contextual | IsExpressionStart | IsIdentifier,
  ConstructorKeyword = 110 | Contextual,
  GetKeyword         = 111 | Contextual,
  SetKeyword         = 112 | Contextual,
  FromKeyword        = 113 | Contextual,
  OfKeyword          = 114 | Contextual | IsInOrOf,
  EnumKeyword        = 115 | Reserved,

  Eval               = 116 | IsEvalOrArguments,
  Arguments          = 117 | IsEvalOrArguments,

  EscapedReserved       = 118,
  EscapedFutureReserved = 119,
  AnyIdentifier      = 120 | IsIdentifier,

  // Stage #3 proposals
  PrivateName        = 121,
  BigIntLiteral      = 122 | IsExpressionStart | IsStringOrNumber,
  Coalesce           = 123 | IsBinaryOp | IsCoalesc | 1 << PrecStart, // ??
  QuestionMarkPeriod = 124 | IsMemberOrCallExpression, // ?.

  // Others
  WhiteSpace        = 125,
  Illegal           = 126,
  CarriageReturn    = 127,
  PrivateField      = 128,
  Template          = 129,
  Decorator         = 130,
  Target            = 131 | IsIdentifier,
  Meta              = 132 | IsIdentifier,
  LineFeed          = 133,
  EscapedIdentifier = 134,

  // JSX
  JSXText           = 135,
}

export const KeywordDescTable = [
  'end of source',

  /* Constants/Bindings */
  'identifier', 'number', 'string', 'regular expression',
  'false', 'true', 'null',

  /* Template nodes */
  'template continuation', 'template tail',

  /* Punctuators */
  '=>', '(', '{', '.', '...', '}', ')', ';', ',', '[', ']', ':', '?', '\'', '"', '</', '/>',

  /* Update operators */
  '++', '--',

  /* Assign operators */
  '=', '<<=', '>>=', '>>>=', '**=', '+=', '-=', '*=', '/=', '%=', '^=', '|=',
  '&=',

  /* Unary/binary operators */
  'typeof', 'delete', 'void', '!', '~', '+', '-', 'in', 'instanceof', '*', '%', '/', '**', '&&',
  '||', '===', '!==', '==', '!=', '<=', '>=', '<', '>', '<<', '>>', '>>>', '&', '|', '^',

  /* Variable declaration kinds */
  'var', 'let', 'const',

  /* Other reserved words */
  'break', 'case', 'catch', 'class', 'continue', 'debugger', 'default', 'do', 'else', 'export',
  'extends', 'finally', 'for', 'function', 'if', 'import', 'new', 'return', 'super', 'switch',
  'this', 'throw', 'try', 'while', 'with',

  /* Strict mode reserved words */
  'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'yield',

  /* Contextual keywords */
  'as', 'async', 'await', 'constructor', 'get', 'set', 'from', 'of',

  /* Others */
  'enum', 'eval', 'arguments', 'escaped keyword', 'escaped future reserved keyword', 'reserved if strict', '#',

  'BigIntLiteral', '??', '?.', 'WhiteSpace', 'Illegal', 'LineTerminator', 'PrivateField',

  'Template', '@', 'target', 'meta', 'LineFeed', 'Escaped', 'JSXText'
];

// Normal object is much faster than Object.create(null), even with typeof check to avoid Object.prototype interference
export const descKeywordTable: { [key: string]: Token } = Object.create(null, {
  this: { value: Token.ThisKeyword },
  function: { value: Token.FunctionKeyword },
  if: { value: Token.IfKeyword },
  return: { value: Token.ReturnKeyword },
  var: { value: Token.VarKeyword },
  else: { value: Token.ElseKeyword },
  for: { value: Token.ForKeyword },
  new: { value: Token.NewKeyword },
  in: { value: Token.InKeyword },
  typeof: { value: Token.TypeofKeyword },
  while: { value: Token.WhileKeyword },
  case: { value: Token.CaseKeyword },
  break: { value: Token.BreakKeyword },
  try: { value: Token.TryKeyword },
  catch: { value: Token.CatchKeyword },
  delete: { value: Token.DeleteKeyword },
  throw: { value: Token.ThrowKeyword },
  switch: { value: Token.SwitchKeyword },
  continue: { value: Token.ContinueKeyword },
  default: { value: Token.DefaultKeyword },
  instanceof: { value: Token.InstanceofKeyword },
  do: { value: Token.DoKeyword },
  void: { value: Token.VoidKeyword },
  finally: { value: Token.FinallyKeyword },
  async: { value: Token.AsyncKeyword },
  await: { value: Token.AwaitKeyword },
  class: { value: Token.ClassKeyword },
  const: { value: Token.ConstKeyword },
  constructor: { value: Token.ConstructorKeyword },
  debugger: { value: Token.DebuggerKeyword },
  export: { value: Token.ExportKeyword },
  extends: { value: Token.ExtendsKeyword },
  false: { value: Token.FalseKeyword },
  from: { value: Token.FromKeyword },
  get: { value: Token.GetKeyword },
  implements: { value: Token.ImplementsKeyword },
  import: { value: Token.ImportKeyword },
  interface: { value: Token.InterfaceKeyword },
  let: { value: Token.LetKeyword },
  null: { value: Token.NullKeyword },
  of: { value: Token.OfKeyword },
  package: { value: Token.PackageKeyword },
  private: { value: Token.PrivateKeyword },
  protected: { value: Token.ProtectedKeyword },
  public: { value: Token.PublicKeyword },
  set: { value: Token.SetKeyword },
  static: { value: Token.StaticKeyword },
  super: { value: Token.SuperKeyword },
  true: { value: Token.TrueKeyword },
  with: { value: Token.WithKeyword },
  yield: { value: Token.YieldKeyword },
  enum: { value: Token.EnumKeyword },
  eval: { value: Token.Eval },
  as: { value: Token.AsKeyword },
  arguments: { value: Token.Arguments },
  target: { value: Token.Target },
  meta: { value: Token.Meta },
});
