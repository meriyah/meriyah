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
  LogicalOrAssign         = 42 | IsAssignOp, // ||=
  LogicalAndAssign        = 43 | IsAssignOp, // &&=
  CoalesceAssign          = 44 | IsAssignOp, // ??=

  /* Unary/binary operators */
  TypeofKeyword      = 45 | IsUnaryOp | Reserved,
  DeleteKeyword      = 46 | IsUnaryOp | Reserved,
  VoidKeyword        = 47 | IsUnaryOp | Reserved,
  Negate             = 48 | IsUnaryOp, // !
  Complement         = 49 | IsUnaryOp, // ~
  Add                = 50 | IsUnaryOp | IsBinaryOp | 10 << PrecStart, // +
  Subtract           = 51 | IsUnaryOp | IsBinaryOp | 10 << PrecStart, // -
  InKeyword          = 52 | IsBinaryOp | 8 << PrecStart | Reserved | IsInOrOf,
  InstanceofKeyword  = 53 | IsBinaryOp | 8 << PrecStart | Reserved,
  Multiply           = 54 | IsBinaryOp | 11 << PrecStart, // *
  Modulo             = 55 | IsBinaryOp | 11 << PrecStart, // %
  Divide             = 56 | IsBinaryOp | IsExpressionStart | 11 << PrecStart, // /
  Exponentiate       = 57 | IsBinaryOp | 12 << PrecStart, // **
  LogicalAnd         = 58 | IsBinaryOp | IsLogical | 3 << PrecStart, // &&
  LogicalOr          = 59 | IsBinaryOp | IsLogical | 2 << PrecStart, // ||
  StrictEqual        = 60 | IsBinaryOp | 7 << PrecStart, // ===
  StrictNotEqual     = 61 | IsBinaryOp | 7 << PrecStart, // !==
  LooseEqual         = 62 | IsBinaryOp | 7 << PrecStart, // ==
  LooseNotEqual      = 63 | IsBinaryOp | 7 << PrecStart, // !=
  LessThanOrEqual    = 64 | IsBinaryOp | 7 << PrecStart, // <=
  GreaterThanOrEqual = 65 | IsBinaryOp | 7 << PrecStart, // >=
  LessThan           = 66 | IsBinaryOp | IsExpressionStart | 8 << PrecStart, // <
  GreaterThan        = 67 | IsBinaryOp | 8 << PrecStart, // >
  ShiftLeft          = 68 | IsBinaryOp | 9 << PrecStart, // <<
  ShiftRight         = 69 | IsBinaryOp | 9 << PrecStart, // >>
  LogicalShiftRight  = 70 | IsBinaryOp | 9 << PrecStart, // >>>
  BitwiseAnd         = 71 | IsBinaryOp | 6 << PrecStart, // &
  BitwiseOr          = 72 | IsBinaryOp | 4 << PrecStart, // |
  BitwiseXor         = 73 | IsBinaryOp | 5 << PrecStart, // ^

  /* Variable declaration kinds */
  VarKeyword   = 74 | IsExpressionStart | Reserved,
  LetKeyword   = 75 | IsExpressionStart | FutureReserved | IsIdentifier,
  ConstKeyword = 76 | IsExpressionStart | Reserved,

  /* Other reserved words */
  BreakKeyword    = 77 | Reserved,
  CaseKeyword     = 78 | Reserved,
  CatchKeyword    = 79 | Reserved,
  ClassKeyword    = 80 | IsExpressionStart | Reserved,
  ContinueKeyword = 81 | Reserved,
  DebuggerKeyword = 82 | Reserved,
  DefaultKeyword  = 83 | Reserved,
  DoKeyword       = 84 | Reserved,
  ElseKeyword     = 85 | Reserved,
  ExportKeyword   = 86 | Reserved,
  ExtendsKeyword  = 87 | Reserved,
  FinallyKeyword  = 88 | Reserved,
  ForKeyword      = 89 | Reserved,
  FunctionKeyword = 90 | IsExpressionStart | Reserved,
  IfKeyword       = 91 | Reserved,
  ImportKeyword   = 92 | IsExpressionStart | Reserved,
  NewKeyword      = 93 | IsExpressionStart | Reserved,
  ReturnKeyword   = 94 | Reserved,
  SuperKeyword    = 95 | IsExpressionStart | Reserved,
  SwitchKeyword   = 96 | IsExpressionStart | Reserved,
  ThisKeyword     = 97 | IsExpressionStart | Reserved,
  ThrowKeyword    = 98 | IsExpressionStart | Reserved,
  TryKeyword      = 99 | Reserved,
  WhileKeyword    = 100 | Reserved,
  WithKeyword     = 101 | Reserved,

  /* Strict mode reserved words */
  ImplementsKeyword = 102 | FutureReserved,
  InterfaceKeyword  = 103 | FutureReserved,
  PackageKeyword    = 104 | FutureReserved,
  PrivateKeyword    = 105 | FutureReserved,
  ProtectedKeyword  = 106 | FutureReserved,
  PublicKeyword     = 107 | FutureReserved,
  StaticKeyword     = 108 | FutureReserved,
  YieldKeyword      = 109 | FutureReserved | IsExpressionStart | IsIdentifier,

  /* Contextual keywords */
  AsKeyword          = 110 | Contextual | IsExpressionStart,
  AsyncKeyword       = 111 | Contextual | IsIdentifier | IsExpressionStart,
  AwaitKeyword       = 112 | Contextual | IsExpressionStart | IsIdentifier,
  ConstructorKeyword = 113 | Contextual,
  GetKeyword         = 114 | Contextual,
  SetKeyword         = 115 | Contextual,
  FromKeyword        = 116 | Contextual,
  OfKeyword          = 117 | Contextual | IsInOrOf,
  EnumKeyword        = 118 | Reserved | IsExpressionStart,

  Eval               = 119 | IsEvalOrArguments,
  Arguments          = 120 | IsEvalOrArguments,

  EscapedReserved       = 121,
  EscapedFutureReserved = 122,
  AnyIdentifier      = 123 | IsIdentifier,

  // Stage #3 proposals
  PrivateIdentifier  = 124,
  BigIntLiteral      = 125 | IsExpressionStart | IsStringOrNumber,
  Coalesce           = 126 | IsBinaryOp | IsCoalesc | 1 << PrecStart, // ??
  QuestionMarkPeriod = 127 | IsMemberOrCallExpression, // ?.

  // Others
  WhiteSpace        = 128,
  Illegal           = 129,
  CarriageReturn    = 130,
  PrivateField      = 131,
  Template          = 132,
  Decorator         = 133,
  Target            = 134 | IsIdentifier,
  Meta              = 135 | IsIdentifier,
  LineFeed          = 136,
  EscapedIdentifier = 137,

  // JSX
  JSXText           = 138,
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
  '&=', '||=', '&&=', '??=',

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
