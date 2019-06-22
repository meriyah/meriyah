import { skipSingleLineComment, skipMultiLineComment, ScannerState } from './';
import { CharTypes, CharFlags } from './charClassifier';
import { Chars } from '../chars';
import { Token } from '../token';
import { ParserState, Context, Flags } from '../common';
import { report, Errors } from '../errors';
import { isIDStart } from '../unicode';
import {
  nextCodePoint,
  consumeMultiUnitCodePoint,
  isExoticECMAScriptWhitespace,
  scanRegularExpression,
  scanTemplate,
  scanNumber,
  scanString,
  scanIdentifier,
  scanUnicodeIdentifier,
  scanIdentifierSlowCase,
  scanPrivateName,
  fromCodePoint,
  consumeLineFeed,
  advanceNewline
} from './';

/*
 * OneChar:          40,  41,  44,  58,  59,  63,  91,  93,  123, 125, 126:
 *                  '(', ')', ',', ':', ';', '?', '[', ']', '{', '}', '~'
 * PrivateField:     35: '#',
 * Identifier:       36, 65..90, 92, 95, 97..122: '$', 'A'..'Z', '_', '\'', 'a'..'z'
 * Period:           46: '.'
 * StringLiteral:    34, 39: '"', `'`
 * NumericLiteral:   48, 49..57: '0'..'9'
 * WhiteSpace:       9, 11, 12, 32: '\t', '\v', '\f', ' '
 * LineFeed:         10: '\n'
 * CarriageReturn:   13: '\r'
 * Template:         96: '`'
 */

export const TokenLookup = [
  /*   0 - Null               */ Token.Illegal,
  /*   1 - Start of Heading   */ Token.Illegal,
  /*   2 - Start of Text      */ Token.Illegal,
  /*   3 - End of Text        */ Token.Illegal,
  /*   4 - End of Transm.     */ Token.Illegal,
  /*   5 - Enquiry            */ Token.Illegal,
  /*   6 - Acknowledgment     */ Token.Illegal,
  /*   7 - Bell               */ Token.Illegal,
  /*   8 - Backspace          */ Token.Illegal,
  /*   9 - Horizontal Tab     */ Token.WhiteSpace,
  /*  10 - Line Feed          */ Token.LineFeed,
  /*  11 - Vertical Tab       */ Token.WhiteSpace,
  /*  12 - Form Feed          */ Token.WhiteSpace,
  /*  13 - Carriage Return    */ Token.CarriageReturn,
  /*  14 - Shift Out          */ Token.Illegal,
  /*  15 - Shift In           */ Token.Illegal,
  /*  16 - Data Line Escape   */ Token.Illegal,
  /*  17 - Device Control 1   */ Token.Illegal,
  /*  18 - Device Control 2   */ Token.Illegal,
  /*  19 - Device Control 3   */ Token.Illegal,
  /*  20 - Device Control 4   */ Token.Illegal,
  /*  21 - Negative Ack.      */ Token.Illegal,
  /*  22 - Synchronous Idle   */ Token.Illegal,
  /*  23 - End of Transmit    */ Token.Illegal,
  /*  24 - Cancel             */ Token.Illegal,
  /*  25 - End of Medium      */ Token.Illegal,
  /*  26 - Substitute         */ Token.Illegal,
  /*  27 - Escape             */ Token.Illegal,
  /*  28 - File Separator     */ Token.Illegal,
  /*  29 - Group Separator    */ Token.Illegal,
  /*  30 - Record Separator   */ Token.Illegal,
  /*  31 - Unit Separator     */ Token.Illegal,
  /*  32 - Space              */ Token.WhiteSpace,
  /*  33 - !                  */ Token.Negate,
  /*  34 - "                  */ Token.StringLiteral,
  /*  35 - #                  */ Token.PrivateField,
  /*  36 - $                  */ Token.Identifier,
  /*  37 - %                  */ Token.Modulo,
  /*  38 - &                  */ Token.BitwiseAnd,
  /*  39 - '                  */ Token.StringLiteral,
  /*  40 - (                  */ Token.LeftParen,
  /*  41 - )                  */ Token.RightParen,
  /*  42 - *                  */ Token.Multiply,
  /*  43 - +                  */ Token.Add,
  /*  44 - ,                  */ Token.Comma,
  /*  45 - -                  */ Token.Subtract,
  /*  46 - .                  */ Token.Period,
  /*  47 - /                  */ Token.Divide,
  /*  48 - 0                  */ Token.NumericLiteral,
  /*  49 - 1                  */ Token.NumericLiteral,
  /*  50 - 2                  */ Token.NumericLiteral,
  /*  51 - 3                  */ Token.NumericLiteral,
  /*  52 - 4                  */ Token.NumericLiteral,
  /*  53 - 5                  */ Token.NumericLiteral,
  /*  54 - 6                  */ Token.NumericLiteral,
  /*  55 - 7                  */ Token.NumericLiteral,
  /*  56 - 8                  */ Token.NumericLiteral,
  /*  57 - 9                  */ Token.NumericLiteral,
  /*  58 - :                  */ Token.Colon,
  /*  59 - ;                  */ Token.Semicolon,
  /*  60 - <                  */ Token.LessThan,
  /*  61 - =                  */ Token.Assign,
  /*  62 - >                  */ Token.GreaterThan,
  /*  63 - ?                  */ Token.QuestionMark,
  /*  64 - @                  */ Token.Decorator,
  /*  65 - A                  */ Token.Identifier,
  /*  66 - B                  */ Token.Identifier,
  /*  67 - C                  */ Token.Identifier,
  /*  68 - D                  */ Token.Identifier,
  /*  69 - E                  */ Token.Identifier,
  /*  70 - F                  */ Token.Identifier,
  /*  71 - G                  */ Token.Identifier,
  /*  72 - H                  */ Token.Identifier,
  /*  73 - I                  */ Token.Identifier,
  /*  74 - J                  */ Token.Identifier,
  /*  75 - K                  */ Token.Identifier,
  /*  76 - L                  */ Token.Identifier,
  /*  77 - M                  */ Token.Identifier,
  /*  78 - N                  */ Token.Identifier,
  /*  79 - O                  */ Token.Identifier,
  /*  80 - P                  */ Token.Identifier,
  /*  81 - Q                  */ Token.Identifier,
  /*  82 - R                  */ Token.Identifier,
  /*  83 - S                  */ Token.Identifier,
  /*  84 - T                  */ Token.Identifier,
  /*  85 - U                  */ Token.Identifier,
  /*  86 - V                  */ Token.Identifier,
  /*  87 - W                  */ Token.Identifier,
  /*  88 - X                  */ Token.Identifier,
  /*  89 - Y                  */ Token.Identifier,
  /*  90 - Z                  */ Token.Identifier,
  /*  91 - [                  */ Token.LeftBracket,
  /*  92 - \                  */ Token.EscapedIdentifier,
  /*  93 - ]                  */ Token.RightBracket,
  /*  94 - ^                  */ Token.BitwiseXor,
  /*  95 - _                  */ Token.Identifier,
  /*  96 - `                  */ Token.Template,
  /*  97 - a                  */ Token.Identifier,
  /*  98 - b                  */ Token.Identifier,
  /*  99 - c                  */ Token.Identifier,
  /* 100 - d                  */ Token.Identifier,
  /* 101 - e                  */ Token.Identifier,
  /* 102 - f                  */ Token.Identifier,
  /* 103 - g                  */ Token.Identifier,
  /* 104 - h                  */ Token.Identifier,
  /* 105 - i                  */ Token.Identifier,
  /* 106 - j                  */ Token.Identifier,
  /* 107 - k                  */ Token.Identifier,
  /* 108 - l                  */ Token.Identifier,
  /* 109 - m                  */ Token.Identifier,
  /* 110 - n                  */ Token.Identifier,
  /* 111 - o                  */ Token.Identifier,
  /* 112 - p                  */ Token.Identifier,
  /* 113 - q                  */ Token.Identifier,
  /* 114 - r                  */ Token.Identifier,
  /* 115 - s                  */ Token.Identifier,
  /* 116 - t                  */ Token.Identifier,
  /* 117 - u                  */ Token.Identifier,
  /* 118 - v                  */ Token.Identifier,
  /* 119 - w                  */ Token.Identifier,
  /* 120 - x                  */ Token.Identifier,
  /* 121 - y                  */ Token.Identifier,
  /* 122 - z                  */ Token.Identifier,
  /* 123 - {                  */ Token.LeftBrace,
  /* 124 - |                  */ Token.BitwiseOr,
  /* 125 - }                  */ Token.RightBrace,
  /* 126 - ~                  */ Token.Complement,
  /* 127 - Delete             */ Token.Illegal
];

/**
 * Scans next token in the stream
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function nextToken(parser: ParserState, context: Context): void {
  parser.flags &= ~Flags.NewLine;
  parser.startIndex = parser.index;
  parser.token = scanSingleToken(parser, context, ScannerState.None);
}

export function scanSingleToken(parser: ParserState, context: Context, state: ScannerState): Token {
  const isStartOfLine = parser.index === 0;

  while (parser.index < parser.end) {
    parser.tokenIndex = parser.index;

    const first = parser.nextCP;

    if (first <= 0x7e) {
      const token = TokenLookup[first];

      switch (token) {
        // Look for an unambiguous single-char token
        case Token.LeftParen:
        case Token.RightParen:
        case Token.LeftBrace:
        case Token.RightBrace:
        case Token.LeftBracket:
        case Token.RightBracket:
        case Token.QuestionMark:
        case Token.Colon:
        case Token.Semicolon:
        case Token.Comma:
        case Token.Complement:
        case Token.Decorator:
        case Token.Illegal:
          nextCodePoint(parser);
          return token;

        // Skip over non-EOL whitespace chars.
        case Token.WhiteSpace:
          nextCodePoint(parser);
          break;

        case Token.CarriageReturn:
          state |= ScannerState.NewLine | ScannerState.LastIsCR;
          advanceNewline(parser);
          break;

        case Token.LineFeed:
          consumeLineFeed(parser, (state & ScannerState.LastIsCR) !== 0);
          state = (state | ScannerState.LastIsCR | ScannerState.NewLine) ^ ScannerState.LastIsCR;
          parser.flags |= Flags.NewLine;
          break;

        // Look for an identifier.
        case Token.Identifier:
          return scanIdentifier(parser, context);

        // Look for a decimal number.
        case Token.NumericLiteral:
          return scanNumber(parser, context, false);

        // Look for a string or a template string.
        case Token.StringLiteral:
          return scanString(parser, context) as Token;

        case Token.Template:
          return scanTemplate(parser, context) as Token;

        case Token.EscapedIdentifier:
          return scanUnicodeIdentifier(parser, context);

        // `#`
        case Token.PrivateField:
          return scanPrivateName(parser);

        // `!`, `!=`, `!==`
        case Token.Negate:
          if (nextCodePoint(parser) !== Chars.EqualSign) {
            return Token.Negate;
          }
          if (nextCodePoint(parser) !== Chars.EqualSign) {
            return Token.LooseNotEqual;
          }
          nextCodePoint(parser);
          return Token.StrictNotEqual;

        // `%`, `%=`
        case Token.Modulo:
          if (nextCodePoint(parser) !== Chars.EqualSign) return Token.Modulo;
          nextCodePoint(parser);
          return Token.ModuloAssign;

        // `*`, `**`, `*=`, `**=`
        case Token.Multiply: {
          nextCodePoint(parser);
          if (parser.index >= parser.end) return Token.Multiply;
          const next = parser.nextCP;

          if (next === Chars.EqualSign) {
            nextCodePoint(parser);
            return Token.MultiplyAssign;
          }

          if (next !== Chars.Asterisk) return Token.Multiply;
          nextCodePoint(parser);
          if (parser.nextCP !== Chars.EqualSign) return Token.Exponentiate;
          nextCodePoint(parser);
          return Token.ExponentiateAssign;
        }

        // `^`, `^=`
        case Token.BitwiseXor:
          if (nextCodePoint(parser) !== Chars.EqualSign) return Token.BitwiseXor;
          nextCodePoint(parser);
          return Token.BitwiseXorAssign;

        // `+`, `++`, `+=`
        case Token.Add: {
          nextCodePoint(parser);
          if (parser.index >= parser.end) return Token.Add;

          if (parser.nextCP === Chars.Plus) {
            nextCodePoint(parser);
            return Token.Increment;
          }

          if (parser.nextCP === Chars.EqualSign) {
            nextCodePoint(parser);
            return Token.AddAssign;
          }

          return Token.Add;
        }

        // `-`, `--`, `-=`, `-->`
        case Token.Subtract: {
          nextCodePoint(parser);
          if (parser.index >= parser.end) return Token.Subtract;
          const next = parser.nextCP;

          if (next === Chars.Hyphen) {
            nextCodePoint(parser);
            if (
              (context & Context.Module) === 0 &&
              (state & ScannerState.NewLine || isStartOfLine) &&
              parser.nextCP === Chars.GreaterThan
            ) {
              if ((context & Context.OptionsWebCompat) === 0) report(parser, Errors.HtmlCommentInWebCompat);
              state = skipSingleLineComment(parser, state);
              continue;
            }

            return Token.Decrement;
          }

          if (next === Chars.EqualSign) {
            nextCodePoint(parser);
            return Token.SubtractAssign;
          }

          return Token.Subtract;
        }

        case Token.Divide: {
          nextCodePoint(parser);
          if (parser.index < parser.end) {
            const ch = parser.nextCP;
            if (ch === Chars.Slash) {
              nextCodePoint(parser);
              state = skipSingleLineComment(parser, state);
              continue;
            } else if (ch === Chars.Asterisk) {
              nextCodePoint(parser);
              state = skipMultiLineComment(parser, state);
              continue;
            } else if (context & Context.AllowRegExp) {
              return scanRegularExpression(parser, context);
            } else if (ch === Chars.EqualSign) {
              nextCodePoint(parser);
              return Token.DivideAssign;
            }
          }

          return Token.Divide;
        }

        // `<`, `<=`, `<<`, `<<=`, `</`, `<!--`
        case Token.LessThan:
          nextCodePoint(parser);
          if (parser.index >= parser.end) return Token.LessThan;

          switch (parser.nextCP) {
            case Chars.LessThan:
              nextCodePoint(parser);
              if ((parser.nextCP as number) === Chars.EqualSign) {
                nextCodePoint(parser);
                return Token.ShiftLeftAssign;
              } else {
                return Token.ShiftLeft;
              }

            case Chars.EqualSign:
              nextCodePoint(parser);
              return Token.LessThanOrEqual;

            case Chars.Exclamation:
              // Treat HTML begin-comment as comment-till-end-of-line.
              if (
                (context & Context.Module) === 0 &&
                parser.source.charCodeAt(parser.index + 1) === Chars.Hyphen &&
                parser.source.charCodeAt(parser.index + 2) === Chars.Hyphen
              ) {
                state = skipSingleLineComment(parser, state);
                continue;
              }

            default:
              // ignore
              return Token.LessThan;
          }

        // `=`, `==`, `===`, `=>`
        case Token.Assign: {
          nextCodePoint(parser);
          if (parser.index >= parser.end) return Token.Assign;
          const next = parser.nextCP;

          if (next === Chars.EqualSign) {
            nextCodePoint(parser);
            if (parser.nextCP === Chars.EqualSign) {
              nextCodePoint(parser);
              return Token.StrictEqual;
            } else {
              return Token.LooseEqual;
            }
          } else if (next === Chars.GreaterThan) {
            nextCodePoint(parser);
            return Token.Arrow;
          }

          return Token.Assign;
        }

        // `|`, `||`, `|=`
        case Token.BitwiseOr: {
          nextCodePoint(parser);
          if (parser.index >= parser.end) return Token.BitwiseOr;
          const next = parser.nextCP;

          if (next === Chars.VerticalBar) {
            nextCodePoint(parser);
            return Token.LogicalOr;
          } else if (next === Chars.EqualSign) {
            nextCodePoint(parser);
            return Token.BitwiseOrAssign;
          }

          return Token.BitwiseOr;
        }

        // `>`, `>=`, `>>`, `>>>`, `>>=`, `>>>=`
        case Token.GreaterThan: {
          nextCodePoint(parser);
          if (parser.index >= parser.end) return Token.GreaterThan;
          const next = parser.nextCP;

          if (next === Chars.EqualSign) {
            nextCodePoint(parser);
            return Token.GreaterThanOrEqual;
          }

          if (next !== Chars.GreaterThan) return Token.GreaterThan;
          nextCodePoint(parser);

          if (parser.index < parser.end) {
            const next = parser.nextCP;

            if (next === Chars.GreaterThan) {
              nextCodePoint(parser);
              if (parser.nextCP === Chars.EqualSign) {
                nextCodePoint(parser);
                return Token.LogicalShiftRightAssign;
              } else {
                return Token.LogicalShiftRight;
              }
            } else if (next === Chars.EqualSign) {
              nextCodePoint(parser);
              return Token.ShiftRightAssign;
            }
          }

          return Token.ShiftRight;
        }

        // `&`, `&&`, `&=`
        case Token.BitwiseAnd: {
          nextCodePoint(parser);
          if (parser.index >= parser.end) return Token.BitwiseAnd;
          const next = parser.nextCP;

          if (next === Chars.Ampersand) {
            nextCodePoint(parser);
            return Token.LogicalAnd;
          }

          if (next === Chars.EqualSign) {
            nextCodePoint(parser);
            return Token.BitwiseAndAssign;
          }

          return Token.BitwiseAnd;
        }
        // `.`, `...`, `.123` (numeric literal)
        case Token.Period:
          nextCodePoint(parser);
          if ((CharTypes[parser.nextCP] & CharFlags.Decimal) !== 0) return scanNumber(parser, context, true);
          if (parser.nextCP === Chars.Period) {
            nextCodePoint(parser);
            if (parser.nextCP === Chars.Period) {
              nextCodePoint(parser);
              return Token.Ellipsis;
            }
          }
          return Token.Period;

        default:
        // unreachable
      }
    } else {
      if ((first ^ Chars.LineSeparator) <= 1) {
        state = (state | ScannerState.LastIsCR | ScannerState.NewLine) ^ ScannerState.LastIsCR;
        advanceNewline(parser);
        continue;
      }

      if (isIDStart(first) || consumeMultiUnitCodePoint(parser, first)) {
        parser.tokenValue = '';
        return scanIdentifierSlowCase(parser, context, /* hasEscape */ 0, /* canBeKeyword */ 0);
      }

      if (isExoticECMAScriptWhitespace(first)) {
        nextCodePoint(parser);
        continue;
      }

      // Invalid ASCII code point/unit
      report(parser, Errors.IllegalCaracter, fromCodePoint(first));
    }
  }
  return Token.EOF;
}
