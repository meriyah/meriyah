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
  IsBinaryOp               = 1 << 23,
  IsUnaryOp                = 1 << 24 | IsExpressionStart,
  IsUpdateOp               = 1 << 25 | IsExpressionStart,
  IsMemberOrCallExpression = 1 << 26,
  IsStringOrNumber         = 1 << 27,
  IsCoalesc                = 1 << 28,
  IsEvalOrArguments        = 1 << 29 | IsExpressionStart | IsIdentifier,
  IsClassField             = 1 << 30,
  IsEscaped                = 1 << 31, // Note 1 << 31 is negative integer

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

  /* Update operators */
  Increment = 25 | IsUpdateOp, // ++
  Decrement = 26 | IsUpdateOp, // --

  /* Assign operators */
  Assign                  = 27 | IsAssignOp | IsClassField, // =
  ShiftLeftAssign         = 28 | IsAssignOp, // <<=
  ShiftRightAssign        = 29 | IsAssignOp, // >>=
  LogicalShiftRightAssign = 30 | IsAssignOp, // >>>=
  ExponentiateAssign      = 31 | IsAssignOp, // **=
  AddAssign               = 32 | IsAssignOp, // +=
  SubtractAssign          = 33 | IsAssignOp, // -=
  MultiplyAssign          = 34 | IsAssignOp, // *=
  DivideAssign            = 35 | IsAssignOp | IsExpressionStart, // /=
  ModuloAssign            = 36 | IsAssignOp, // %=
  BitwiseXorAssign        = 37 | IsAssignOp, // ^=
  BitwiseOrAssign         = 38 | IsAssignOp, // |=
  BitwiseAndAssign        = 39 | IsAssignOp, // &=
  LogicalOrAssign         = 40 | IsAssignOp, // ||=
  LogicalAndAssign        = 41 | IsAssignOp, // &&=
  CoalesceAssign          = 42 | IsAssignOp, // ??=

  /* Unary/binary operators */
  TypeofKeyword      = 43 | IsUnaryOp | Reserved,
  DeleteKeyword      = 44 | IsUnaryOp | Reserved,
  VoidKeyword        = 45 | IsUnaryOp | Reserved,
  Negate             = 46 | IsUnaryOp, // !
  Complement         = 47 | IsUnaryOp, // ~
  Add                = 48 | IsUnaryOp | IsBinaryOp | IsExpressionStart | 10 << PrecStart, // +
  Subtract           = 49 | IsUnaryOp | IsBinaryOp | IsExpressionStart | 10 << PrecStart, // -
  InKeyword          = 50 | IsBinaryOp | 8 << PrecStart | Reserved | IsInOrOf,
  InstanceofKeyword  = 51 | IsBinaryOp | 8 << PrecStart | Reserved,
  Multiply           = 52 | IsBinaryOp | 11 << PrecStart, // *
  Modulo             = 53 | IsBinaryOp | 11 << PrecStart, // %
  Divide             = 54 | IsBinaryOp | IsExpressionStart | 11 << PrecStart, // /
  Exponentiate       = 55 | IsBinaryOp | 12 << PrecStart, // **
  LogicalAnd         = 56 | IsBinaryOp | IsLogical | 3 << PrecStart, // &&
  LogicalOr          = 57 | IsBinaryOp | IsLogical | 2 << PrecStart, // ||
  StrictEqual        = 58 | IsBinaryOp | 7 << PrecStart, // ===
  StrictNotEqual     = 59 | IsBinaryOp | 7 << PrecStart, // !==
  LooseEqual         = 60 | IsBinaryOp | 7 << PrecStart, // ==
  LooseNotEqual      = 61 | IsBinaryOp | 7 << PrecStart, // !=
  LessThanOrEqual    = 62 | IsBinaryOp | 8 << PrecStart, // <=
  GreaterThanOrEqual = 63 | IsBinaryOp | 8 << PrecStart, // >=
  LessThan           = 64 | IsBinaryOp | IsExpressionStart | 8 << PrecStart, // <
  GreaterThan        = 65 | IsBinaryOp | 8 << PrecStart, // >
  ShiftLeft          = 66 | IsBinaryOp | 9 << PrecStart, // <<
  ShiftRight         = 67 | IsBinaryOp | 9 << PrecStart, // >>
  LogicalShiftRight  = 68 | IsBinaryOp | 9 << PrecStart, // >>>
  BitwiseAnd         = 69 | IsBinaryOp | 6 << PrecStart, // &
  BitwiseOr          = 70 | IsBinaryOp | 4 << PrecStart, // |
  BitwiseXor         = 71 | IsBinaryOp | 5 << PrecStart, // ^

  /* Variable declaration kinds */
  VarKeyword   = 72 | IsExpressionStart | Reserved,
  LetKeyword   = 73 | IsExpressionStart | FutureReserved | IsIdentifier,
  ConstKeyword = 74 | IsExpressionStart | Reserved,

  /* Other reserved words */
  BreakKeyword    = 75 | Reserved,
  CaseKeyword     = 76 | Reserved,
  CatchKeyword    = 77 | Reserved,
  ClassKeyword    = 78 | IsExpressionStart | Reserved,
  ContinueKeyword = 79 | Reserved,
  DebuggerKeyword = 80 | Reserved,
  DefaultKeyword  = 81 | Reserved,
  DoKeyword       = 82 | Reserved,
  ElseKeyword     = 83 | Reserved,
  ExportKeyword   = 84 | Reserved,
  ExtendsKeyword  = 85 | Reserved,
  FinallyKeyword  = 86 | Reserved,
  ForKeyword      = 87 | Reserved,
  FunctionKeyword = 88 | IsExpressionStart | Reserved,
  IfKeyword       = 89 | Reserved,
  ImportKeyword   = 90 | IsExpressionStart | Reserved,
  NewKeyword      = 91 | IsExpressionStart | Reserved,
  ReturnKeyword   = 92 | Reserved,
  SuperKeyword    = 93 | IsExpressionStart | Reserved,
  SwitchKeyword   = 94 | IsExpressionStart | Reserved,
  ThisKeyword     = 95 | IsExpressionStart | Reserved,
  ThrowKeyword    = 96 | IsExpressionStart | Reserved,
  TryKeyword      = 97 | Reserved,
  WhileKeyword    = 98 | Reserved,
  WithKeyword     = 99 | Reserved,

  /* Strict mode reserved words */
  ImplementsKeyword = 100 | FutureReserved,
  InterfaceKeyword  = 101 | FutureReserved,
  PackageKeyword    = 102 | FutureReserved,
  PrivateKeyword    = 103 | FutureReserved,
  ProtectedKeyword  = 104 | FutureReserved,
  PublicKeyword     = 105 | FutureReserved,
  StaticKeyword     = 106 | FutureReserved,
  YieldKeyword      = 107 | FutureReserved | IsExpressionStart | IsIdentifier,

  /* Contextual keywords */
  AsKeyword          = 108 | Contextual | IsExpressionStart,
  AsyncKeyword       = 109 | Contextual | IsExpressionStart | IsIdentifier,
  AwaitKeyword       = 110 | Contextual | IsExpressionStart | IsIdentifier, // await is only reserved word in async functions or modules
  ConstructorKeyword = 111 | Contextual,
  GetKeyword         = 112 | Contextual,
  SetKeyword         = 113 | Contextual,
  AccessorKeyword    = 114 | Contextual,
  FromKeyword        = 115 | Contextual,
  OfKeyword          = 116 | Contextual | IsInOrOf,
  EnumKeyword        = 117 | Reserved | IsExpressionStart,

  Eval               = 118 | IsEvalOrArguments,
  Arguments          = 119 | IsEvalOrArguments,

  EscapedReserved       = 120 | IsEscaped,
  EscapedFutureReserved = 121 | IsEscaped,
  AnyIdentifier      = 122 | IsExpressionStart | IsIdentifier,

  PrivateIdentifier  = 123,
  BigIntLiteral      = 124 | IsExpressionStart | IsStringOrNumber,
  Coalesce           = 125 | IsBinaryOp | IsCoalesc | 1 << PrecStart, // ??
  QuestionMarkPeriod = 126 | IsMemberOrCallExpression, // ?.

  // Others
  WhiteSpace        = 127,
  Illegal           = 128,
  CarriageReturn    = 129,
  PrivateField      = 130,
  Template          = 131,
  Decorator         = 132,
  Target            = 133 | IsExpressionStart | IsIdentifier,
  Meta              = 134 | IsExpressionStart | IsIdentifier,
  LineFeed          = 135,
  EscapeStart       = 136,

  // JSX
  JSXText           = 137,
}

export const KeywordDescTable = [
  'end of source',

  /* Constants/Bindings */
  'identifier', 'number', 'string', 'regular expression',
  'false', 'true', 'null',

  /* Template nodes */
  'template continuation', 'template tail',

  /* Punctuators */
  '=>', '(', '{', '.', '...', '}', ')', ';', ',', '[', ']', ':', '?', '\'', '"',

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
  'as', 'async', 'await', 'constructor', 'get', 'set', 'accessor', 'from', 'of',

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
  accessor: { value: Token.AccessorKeyword },
});
