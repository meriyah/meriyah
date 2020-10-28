import { Chars } from '../chars';
import { Token } from '../token';
import { ParserState, Context, Flags } from '../common';
import { report, Errors } from '../errors';
import { unicodeLookup } from '../unicode';
import {
  advanceChar,
  skipSingleLineComment,
  skipMultiLineComment,
  skipSingleHTMLComment,
  CommentType,
  LexerState,
  isExoticECMAScriptWhitespace,
  scanRegularExpression,
  scanTemplate,
  scanNumber,
  NumberKind,
  scanString,
  scanIdentifier,
  scanUnicodeIdentifier,
  scanIdentifierSlowCase,
  scanPrivateName,
  fromCodePoint,
  consumeLineFeed,
  scanNewLine,
  convertTokenType
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
  /*  97 - a                  */ Token.Keyword,
  /*  98 - b                  */ Token.Keyword,
  /*  99 - c                  */ Token.Keyword,
  /* 100 - d                  */ Token.Keyword,
  /* 101 - e                  */ Token.Keyword,
  /* 102 - f                  */ Token.Keyword,
  /* 103 - g                  */ Token.Keyword,
  /* 104 - h                  */ Token.Identifier,
  /* 105 - i                  */ Token.Keyword,
  /* 106 - j                  */ Token.Identifier,
  /* 107 - k                  */ Token.Identifier,
  /* 108 - l                  */ Token.Keyword,
  /* 109 - m                  */ Token.Identifier,
  /* 110 - n                  */ Token.Keyword,
  /* 111 - o                  */ Token.Identifier,
  /* 112 - p                  */ Token.Keyword,
  /* 113 - q                  */ Token.Identifier,
  /* 114 - r                  */ Token.Keyword,
  /* 115 - s                  */ Token.Keyword,
  /* 116 - t                  */ Token.Keyword,
  /* 117 - u                  */ Token.Identifier,
  /* 118 - v                  */ Token.Keyword,
  /* 119 - w                  */ Token.Keyword,
  /* 120 - x                  */ Token.Identifier,
  /* 121 - y                  */ Token.Keyword,
  /* 122 - z                  */ Token.Keyword,
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
  parser.flags = (parser.flags | Flags.NewLine) ^ Flags.NewLine;
  parser.startPos = parser.index;
  parser.startColumn = parser.column;
  parser.startLine = parser.line;
  parser.token = scanSingleToken(parser, context, LexerState.None);
  if (parser.onToken && parser.token !== Token.EOF) {
    const loc = {
      start: {
        line: parser.linePos,
        column: parser.colPos
      },
      end: {
        line: parser.line,
        column: parser.column
      }
    };
    parser.onToken(convertTokenType(parser.token), parser.tokenPos, parser.index, loc);
  }
}

export function scanSingleToken(parser: ParserState, context: Context, state: LexerState): Token {
  const isStartOfLine = parser.index === 0;

  const source = parser.source;

  // These three are only for HTMLClose comment
  let startPos = parser.index;
  let startLine = parser.line;
  let startColumn = parser.column;

  while (parser.index < parser.end) {
    parser.tokenPos = parser.index;
    parser.colPos = parser.column;
    parser.linePos = parser.line;

    let char = parser.currentChar;

    if (char <= 0x7e) {
      const token = TokenLookup[char];

      switch (token) {
        case Token.LeftParen:
        case Token.RightParen:
        case Token.LeftBrace:
        case Token.RightBrace:
        case Token.LeftBracket:
        case Token.RightBracket:
        case Token.Colon:
        case Token.Semicolon:
        case Token.Comma:
        case Token.Complement:
        case Token.Decorator:
        case Token.Illegal:
          advanceChar(parser);
          return token;

        // Look for an identifier
        case Token.Identifier:
          return scanIdentifier(parser, context, /* isValidAsKeyword */ 0);

        // Look for identifier or keyword
        case Token.Keyword:
          return scanIdentifier(parser, context, /* isValidAsKeyword */ 1);

        // Look for a decimal number.
        case Token.NumericLiteral:
          return scanNumber(parser, context, NumberKind.Decimal | NumberKind.ValidBigIntKind);

        // Look for a string literal
        case Token.StringLiteral:
          return scanString(parser, context, char);

        // Look for a template string
        case Token.Template:
          return scanTemplate(parser, context);

        // Look for a escaped identifier
        case Token.EscapedIdentifier:
          return scanUnicodeIdentifier(parser, context);

        // `#` (private name)
        case Token.PrivateField:
          return scanPrivateName(parser);

        case Token.WhiteSpace:
          advanceChar(parser);
          break;

        case Token.CarriageReturn:
          state |= LexerState.NewLine | LexerState.LastIsCR;
          scanNewLine(parser);
          break;

        case Token.LineFeed:
          consumeLineFeed(parser, state);
          state = (state & ~LexerState.LastIsCR) | LexerState.NewLine;
          break;

        // `<`, `<=`, `<<`, `<<=`, `</`, `<!--`
        case Token.LessThan:
          let ch = advanceChar(parser);
          if (parser.index < parser.end) {
            if (ch === Chars.LessThan) {
              if (parser.index < parser.end && advanceChar(parser) === Chars.EqualSign) {
                advanceChar(parser);
                return Token.ShiftLeftAssign;
              }
              return Token.ShiftLeft;
            } else if (ch === Chars.EqualSign) {
              advanceChar(parser);
              return Token.LessThanOrEqual;
            }
            if (ch === Chars.Exclamation) {
              // Treat HTML begin-comment as comment-till-end-of-line.
              const index = parser.index + 1;
              if (
                index + 1 < parser.end &&
                source.charCodeAt(index) === Chars.Hyphen &&
                source.charCodeAt(index + 1) == Chars.Hyphen
              ) {
                parser.column += 3;
                parser.currentChar = source.charCodeAt((parser.index += 3));
                state = skipSingleHTMLComment(
                  parser,
                  source,
                  state,
                  context,
                  CommentType.HTMLOpen,
                  parser.tokenPos,
                  parser.linePos,
                  parser.colPos
                );
                startPos = parser.tokenPos;
                startLine = parser.linePos;
                startColumn = parser.colPos;
                continue;
              }
              return Token.LessThan;
            }
            if (ch === Chars.Slash) {
              if ((context & Context.OptionsJSX) < 1) return Token.LessThan;
              const index = parser.index + 1;

              // Check that it's not a comment start.
              if (index < parser.end) {
                ch = source.charCodeAt(index);
                if (ch === Chars.Asterisk || ch === Chars.Slash) break;
              }
              advanceChar(parser);
              return Token.JSXClose;
            }
          }
          return Token.LessThan;

        // `=`, `==`, `===`, `=>`
        case Token.Assign: {
          advanceChar(parser);

          const ch = parser.currentChar;

          if (ch === Chars.EqualSign) {
            if (advanceChar(parser) === Chars.EqualSign) {
              advanceChar(parser);
              return Token.StrictEqual;
            }
            return Token.LooseEqual;
          }
          if (ch === Chars.GreaterThan) {
            advanceChar(parser);
            return Token.Arrow;
          }

          return Token.Assign;
        }

        // `!`, `!=`, `!==`
        case Token.Negate:
          if (advanceChar(parser) !== Chars.EqualSign) {
            return Token.Negate;
          }
          if (advanceChar(parser) !== Chars.EqualSign) {
            return Token.LooseNotEqual;
          }
          advanceChar(parser);
          return Token.StrictNotEqual;

        // `%`, `%=`
        case Token.Modulo:
          if (advanceChar(parser) !== Chars.EqualSign) return Token.Modulo;
          advanceChar(parser);
          return Token.ModuloAssign;

        // `*`, `**`, `*=`, `**=`
        case Token.Multiply: {
          advanceChar(parser);

          if (parser.index >= parser.end) return Token.Multiply;

          const ch = parser.currentChar;

          if (ch === Chars.EqualSign) {
            advanceChar(parser);
            return Token.MultiplyAssign;
          }

          if (ch !== Chars.Asterisk) return Token.Multiply;

          if (advanceChar(parser) !== Chars.EqualSign) return Token.Exponentiate;

          advanceChar(parser);

          return Token.ExponentiateAssign;
        }

        // `^`, `^=`
        case Token.BitwiseXor:
          if (advanceChar(parser) !== Chars.EqualSign) return Token.BitwiseXor;
          advanceChar(parser);
          return Token.BitwiseXorAssign;

        // `+`, `++`, `+=`
        case Token.Add: {
          advanceChar(parser);

          const ch = parser.currentChar;

          if (ch === Chars.Plus) {
            advanceChar(parser);
            return Token.Increment;
          }

          if (ch === Chars.EqualSign) {
            advanceChar(parser);
            return Token.AddAssign;
          }

          return Token.Add;
        }

        // `-`, `--`, `-=`, `-->`
        case Token.Subtract: {
          advanceChar(parser);

          const ch = parser.currentChar;

          if (ch === Chars.Hyphen) {
            advanceChar(parser);
            if ((state & LexerState.NewLine || isStartOfLine) && parser.currentChar === Chars.GreaterThan) {
              if ((context & Context.OptionsWebCompat) === 0) report(parser, Errors.HtmlCommentInWebCompat);
              advanceChar(parser);
              state = skipSingleHTMLComment(
                parser,
                source,
                state,
                context,
                CommentType.HTMLClose,
                startPos,
                startLine,
                startColumn
              );
              startPos = parser.tokenPos;
              startLine = parser.linePos;
              startColumn = parser.colPos;
              continue;
            }

            return Token.Decrement;
          }

          if (ch === Chars.EqualSign) {
            advanceChar(parser);
            return Token.SubtractAssign;
          }

          return Token.Subtract;
        }

        // `/`, `/=`, `/>`, '/*..*/'
        case Token.Divide: {
          advanceChar(parser);
          if (parser.index < parser.end) {
            const ch = parser.currentChar;
            if (ch === Chars.Slash) {
              advanceChar(parser);
              state = skipSingleLineComment(
                parser,
                source,
                state,
                CommentType.Single,
                parser.tokenPos,
                parser.linePos,
                parser.colPos
              );
              startPos = parser.tokenPos;
              startLine = parser.linePos;
              startColumn = parser.colPos;
              continue;
            }
            if (ch === Chars.Asterisk) {
              advanceChar(parser);
              state = skipMultiLineComment(parser, source, state) as LexerState;
              startPos = parser.tokenPos;
              startLine = parser.linePos;
              startColumn = parser.colPos;
              continue;
            }
            if (context & Context.AllowRegExp) {
              return scanRegularExpression(parser, context);
            }
            if (ch === Chars.EqualSign) {
              advanceChar(parser);
              return Token.DivideAssign;
            }
          }

          return Token.Divide;
        }

        // `.`, `...`, `.123` (numeric literal)
        case Token.Period:
          const next = advanceChar(parser);
          if (next >= Chars.Zero && next <= Chars.Nine)
            return scanNumber(parser, context, NumberKind.Float | NumberKind.Decimal);
          if (next === Chars.Period) {
            const index = parser.index + 1;
            if (index < parser.end && source.charCodeAt(index) === Chars.Period) {
              parser.column += 2;
              parser.currentChar = source.charCodeAt((parser.index += 2));
              return Token.Ellipsis;
            }
          }
          return Token.Period;

        // `|`, `||`, `|=`
        case Token.BitwiseOr: {
          advanceChar(parser);

          const ch = parser.currentChar;

          if (ch === Chars.VerticalBar) {
            advanceChar(parser);
            return Token.LogicalOr;
          }
          if (ch === Chars.EqualSign) {
            advanceChar(parser);
            return Token.BitwiseOrAssign;
          }

          return Token.BitwiseOr;
        }

        // `>`, `>=`, `>>`, `>>>`, `>>=`, `>>>=`
        case Token.GreaterThan: {
          advanceChar(parser);

          const ch = parser.currentChar;

          if (ch === Chars.EqualSign) {
            advanceChar(parser);
            return Token.GreaterThanOrEqual;
          }

          if (ch !== Chars.GreaterThan) return Token.GreaterThan;

          advanceChar(parser);

          if (parser.index < parser.end) {
            const ch = parser.currentChar;

            if (ch === Chars.GreaterThan) {
              if (advanceChar(parser) === Chars.EqualSign) {
                advanceChar(parser);
                return Token.LogicalShiftRightAssign;
              }
              return Token.LogicalShiftRight;
            }
            if (ch === Chars.EqualSign) {
              advanceChar(parser);
              return Token.ShiftRightAssign;
            }
          }

          return Token.ShiftRight;
        }

        // `&`, `&&`, `&=`
        case Token.BitwiseAnd: {
          advanceChar(parser);

          const ch = parser.currentChar;

          if (ch === Chars.Ampersand) {
            advanceChar(parser);
            return Token.LogicalAnd;
          }

          if (ch === Chars.EqualSign) {
            advanceChar(parser);
            return Token.BitwiseAndAssign;
          }

          return Token.BitwiseAnd;
        }

        // `?`, `??`, `?.`
        case Token.QuestionMark: {
          let ch = advanceChar(parser);
          if (ch === Chars.QuestionMark) {
            advanceChar(parser);
            return Token.Coalesce;
          }

          if (ch === Chars.Period) {
            const index = parser.index + 1;
            // Check that it's not followed by any numbers
            if (index < parser.end) {
              ch = source.charCodeAt(index);
              if (!(ch >= Chars.Zero && ch <= Chars.Nine)) {
                advanceChar(parser);
                return Token.QuestionMarkPeriod;
              }
            }
          }

          return Token.QuestionMark;
        }

        default:
        // unreachable
      }
    } else {
      if ((char ^ Chars.LineSeparator) <= 1) {
        state = (state & ~LexerState.LastIsCR) | LexerState.NewLine;
        scanNewLine(parser);
        continue;
      }

      if ((char & 0xfc00) === 0xd800 || ((unicodeLookup[(char >>> 5) + 34816] >>> char) & 31 & 1) !== 0) {
        if ((char & 0xfc00) === 0xdc00) {
          char = ((char & 0x3ff) << 10) | (char & 0x3ff) | 0x10000;
          if (((unicodeLookup[(char >>> 5) + 0] >>> char) & 31 & 1) === 0) {
            report(parser, Errors.IllegalCharacter, fromCodePoint(char));
          }
          parser.index++;
          parser.currentChar = char;
        }

        parser.column++;
        parser.tokenValue = '';
        return scanIdentifierSlowCase(parser, context, /* hasEscape */ 0, /* canBeKeyword */ 0);
      }

      if (isExoticECMAScriptWhitespace(char)) {
        advanceChar(parser);
        continue;
      }

      // Invalid ASCII code point/unit
      report(parser, Errors.IllegalCharacter, fromCodePoint(char));
    }
  }
  return Token.EOF;
}
