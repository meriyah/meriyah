export const enum Token {
  Type = 0xFF,

  /* Precedence for binary operators (always positive) */
  PrecedenceStart         = 8,
  Precedence              = 15 << PrecedenceStart, // 8-11

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
  IsCoalesce               = 1 << 28,
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
  ExponentiationAssign    = 31 | IsAssignOp, // **=
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
  Add                = 48 | IsUnaryOp | IsBinaryOp | IsExpressionStart | 10 << PrecedenceStart, // +
  Subtract           = 49 | IsUnaryOp | IsBinaryOp | IsExpressionStart | 10 << PrecedenceStart, // -
  InKeyword          = 50 | IsBinaryOp | 8 << PrecedenceStart | Reserved | IsInOrOf,
  InstanceofKeyword  = 51 | IsBinaryOp | 8 << PrecedenceStart | Reserved,
  Multiply           = 52 | IsBinaryOp | 11 << PrecedenceStart, // *
  Modulo             = 53 | IsBinaryOp | 11 << PrecedenceStart, // %
  Divide             = 54 | IsBinaryOp | IsExpressionStart | 11 << PrecedenceStart, // /
  Exponentiation     = 55 | IsBinaryOp | 12 << PrecedenceStart, // **
  LogicalAnd         = 56 | IsBinaryOp | IsLogical | 3 << PrecedenceStart, // &&
  LogicalOr          = 57 | IsBinaryOp | IsLogical | 2 << PrecedenceStart, // ||
  StrictEqual        = 58 | IsBinaryOp | 7 << PrecedenceStart, // ===
  StrictNotEqual     = 59 | IsBinaryOp | 7 << PrecedenceStart, // !==
  LooseEqual         = 60 | IsBinaryOp | 7 << PrecedenceStart, // ==
  LooseNotEqual      = 61 | IsBinaryOp | 7 << PrecedenceStart, // !=
  LessThanOrEqual    = 62 | IsBinaryOp | 8 << PrecedenceStart, // <=
  GreaterThanOrEqual = 63 | IsBinaryOp | 8 << PrecedenceStart, // >=
  LessThan           = 64 | IsBinaryOp | IsExpressionStart | 8 << PrecedenceStart, // <
  GreaterThan        = 65 | IsBinaryOp | 8 << PrecedenceStart, // >
  ShiftLeft          = 66 | IsBinaryOp | 9 << PrecedenceStart, // <<
  ShiftRight         = 67 | IsBinaryOp | 9 << PrecedenceStart, // >>
  LogicalShiftRight  = 68 | IsBinaryOp | 9 << PrecedenceStart, // >>>
  BitwiseAnd         = 69 | IsBinaryOp | 6 << PrecedenceStart, // &
  BitwiseOr          = 70 | IsBinaryOp | 4 << PrecedenceStart, // |
  BitwiseXor         = 71 | IsBinaryOp | 5 << PrecedenceStart, // ^

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
  GetKeyword         = 112 | Contextual | IsExpressionStart | IsIdentifier,
  SetKeyword         = 113 | Contextual | IsExpressionStart | IsIdentifier,
  AccessorKeyword    = 114 | Contextual,
  FromKeyword        = 115 | Contextual | IsExpressionStart | IsIdentifier,
  OfKeyword          = 116 | Contextual | IsInOrOf | IsExpressionStart | IsIdentifier,
  EnumKeyword        = 117 | Reserved | IsExpressionStart,

  Eval               = 118 | IsEvalOrArguments,
  Arguments          = 119 | IsEvalOrArguments,

  EscapedReserved       = 120 | IsEscaped,
  EscapedFutureReserved = 121 | IsEscaped,
  AnyIdentifier      = 122 | IsExpressionStart | IsIdentifier,

  PrivateIdentifier  = 123,
  BigIntLiteral      = 124 | IsExpressionStart | IsStringOrNumber,
  Coalesce           = 125 | IsBinaryOp | IsCoalesce | 1 << PrecedenceStart, // ??
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

export const descKeywordTable: { [key: string]: Token } =  {
  this: Token.ThisKeyword,
  function: Token.FunctionKeyword,
  if: Token.IfKeyword,
  return: Token.ReturnKeyword,
  var: Token.VarKeyword,
  else: Token.ElseKeyword,
  for: Token.ForKeyword,
  new: Token.NewKeyword,
  in: Token.InKeyword,
  typeof: Token.TypeofKeyword,
  while: Token.WhileKeyword,
  case: Token.CaseKeyword,
  break: Token.BreakKeyword,
  try: Token.TryKeyword,
  catch: Token.CatchKeyword,
  delete: Token.DeleteKeyword,
  throw: Token.ThrowKeyword,
  switch: Token.SwitchKeyword,
  continue: Token.ContinueKeyword,
  default: Token.DefaultKeyword,
  instanceof: Token.InstanceofKeyword,
  do: Token.DoKeyword,
  void: Token.VoidKeyword,
  finally: Token.FinallyKeyword,
  async: Token.AsyncKeyword,
  await: Token.AwaitKeyword,
  class: Token.ClassKeyword,
  const: Token.ConstKeyword,
  constructor: Token.ConstructorKeyword,
  debugger: Token.DebuggerKeyword,
  export: Token.ExportKeyword,
  extends: Token.ExtendsKeyword,
  false: Token.FalseKeyword,
  from: Token.FromKeyword,
  get: Token.GetKeyword,
  implements: Token.ImplementsKeyword,
  import: Token.ImportKeyword,
  interface: Token.InterfaceKeyword,
  let: Token.LetKeyword,
  null: Token.NullKeyword,
  of: Token.OfKeyword,
  package: Token.PackageKeyword,
  private: Token.PrivateKeyword,
  protected: Token.ProtectedKeyword,
  public: Token.PublicKeyword,
  set: Token.SetKeyword,
  static: Token.StaticKeyword,
  super: Token.SuperKeyword,
  true: Token.TrueKeyword,
  with: Token.WithKeyword,
  yield: Token.YieldKeyword,
  enum: Token.EnumKeyword,
  eval: Token.Eval,
  as: Token.AsKeyword,
  arguments: Token.Arguments,
  target: Token.Target,
  meta: Token.Meta,
  accessor: Token.AccessorKeyword,
}
