import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Context } from '../../src/common';
import { scanSingleToken } from '../../src/lexer/scan';
import { Parser } from '../../src/parser/parser';
import { Token } from '../../src/token';
import { type Options } from './../../src/options';

describe('Lexer - String', () => {
  const tokens: ([Context, Token, string, string] | [Context, Token, string, string, Options])[] = [
    [Context.None, Token.StringLiteral, '"foo"', 'foo'],
    [Context.None, Token.StringLiteral, '"foo "', 'foo '],
    [Context.None, Token.StringLiteral, '"foo "', 'foo '],
    [Context.None, Token.StringLiteral, '"f1o2o"', 'f1o2o'],
    [Context.None, Token.StringLiteral, '"دیوانه"', 'دیوانه'],
    [Context.None, Token.StringLiteral, '"a℮"', 'a℮'],
    [Context.None, Token.StringLiteral, '"℘"', '℘'],
    [Context.None, Token.StringLiteral, '"a᧚"', 'a᧚'],
    [Context.None, Token.StringLiteral, String.raw`"a\n"`, 'a\n'],
    [Context.None, Token.StringLiteral, String.raw`"foo\tbar"`, 'foo\tbar'],
    [Context.None, Token.StringLiteral, String.raw`"\u0001"`, '\u0001'],
    [Context.None, Token.StringLiteral, String.raw`"\x55"`, 'U'],
    [Context.None, Token.StringLiteral, String.raw`"\x55a"`, 'Ua'],
    [Context.None, Token.StringLiteral, String.raw`"a\nb"`, 'a\nb'],
    [Context.None, Token.StringLiteral, '";"', ';'],
    [Context.None, Token.StringLiteral, String.raw`"\r"`, '\r'],
    [Context.None, Token.StringLiteral, '""', ''],
    [Context.None, Token.StringLiteral, '"123"', '123'],
    [Context.None, Token.StringLiteral, '"true"', 'true'],
    [
      Context.None,
      Token.StringLiteral,
      '"\
    "',
      '    ',
    ],

    // Russian letters
    [Context.None, Token.StringLiteral, String.raw`"\б"`, 'б'],
    [Context.None, Token.StringLiteral, String.raw`"\И"`, 'И'],
    [Context.None, Token.StringLiteral, String.raw`"\Й"`, 'Й'],
    [Context.None, Token.StringLiteral, String.raw`"\К"`, 'К'],
    [Context.None, Token.StringLiteral, String.raw`"\Л"`, 'Л'],
    [Context.None, Token.StringLiteral, String.raw`"\О"`, 'О'],
    [Context.None, Token.StringLiteral, String.raw`"\Ф"`, 'Ф'],
    [Context.None, Token.StringLiteral, String.raw`"\Ц"`, 'Ц'],
    [Context.None, Token.StringLiteral, String.raw`"\Ш"`, 'Ш'],
    [Context.None, Token.StringLiteral, String.raw`"\Э"`, 'Э'],
    [Context.None, Token.StringLiteral, String.raw`"\ж"`, 'ж'],
    [Context.None, Token.StringLiteral, String.raw`"\з"`, 'з'],

    // Escaped letters
    [Context.None, Token.StringLiteral, String.raw`"\b"`, '\b'],
    [Context.None, Token.StringLiteral, String.raw`"\v"`, '\v'],
    [Context.None, Token.StringLiteral, String.raw`"\t"`, '\t'],
    [Context.None, Token.StringLiteral, String.raw`"\f"`, '\f'],
    [Context.None, Token.StringLiteral, String.raw`"\j"`, 'j'],
    [Context.None, Token.StringLiteral, String.raw`"\A"`, 'A'],
    [Context.None, Token.StringLiteral, String.raw`"\t"`, '\t'],
    [Context.None, Token.StringLiteral, String.raw`"\fsuffix"`, '\fsuffix'],
    [Context.None, Token.StringLiteral, String.raw`"\Rsuffix"`, 'Rsuffix'],
    [Context.None, Token.StringLiteral, String.raw`"prefix\r\n"`, 'prefix\r\n'],

    // Unicode escape sequence

    [Context.None, Token.StringLiteral, String.raw`"\u1000"`, 'က'],
    [Context.None, Token.StringLiteral, String.raw`"\uf2ff"`, ''],
    [Context.None, Token.StringLiteral, String.raw`"\u0041"`, 'A'],
    [Context.None, Token.StringLiteral, String.raw`"\uf2ff"`, ''],
    [Context.None, Token.StringLiteral, String.raw`"\u0123"`, 'ģ'],
    [Context.None, Token.StringLiteral, String.raw`"\u0123 postfix"`, 'ģ postfix'],
    [Context.None, Token.StringLiteral, String.raw`"\u{89abc}"`, '򉪼'],
    [Context.None, Token.StringLiteral, String.raw`"\u{CDEF}"`, '췯'],
    [Context.None, Token.StringLiteral, String.raw`"\u{0000000000000000000010ffff}"`, '􏿿'],
    [Context.None, Token.StringLiteral, String.raw`"\u{10ffff}"`, '􏿿'],
    [Context.None, Token.StringLiteral, String.raw`"\u0062"`, 'b'],
    [Context.None, Token.StringLiteral, String.raw`"\u0410"`, 'А'],
    [Context.None, Token.StringLiteral, String.raw`"\u0412"`, 'В'],
    [Context.None, Token.StringLiteral, String.raw`"\u0419"`, 'Й'],
    [Context.None, Token.StringLiteral, String.raw`"\u042E"`, 'Ю'],
    [Context.None, Token.StringLiteral, String.raw`"\u0432"`, 'в'],
    [Context.None, Token.StringLiteral, String.raw`"\u0030"`, '0'],
    [Context.None, Token.StringLiteral, String.raw`"\u0035"`, '5'],
    [Context.None, Token.StringLiteral, String.raw`"\u0003"`, '\u0003'],
    [Context.None, Token.StringLiteral, String.raw`"\u180E"`, '᠎'],

    // Escaped hex

    [Context.None, Token.StringLiteral, String.raw`"\x01F"`, '\u0001F'],
    [Context.None, Token.StringLiteral, String.raw`"\x05B"`, '\u0005B'],
    [Context.None, Token.StringLiteral, String.raw`"\x0D3"`, '\r3'],
    [Context.None, Token.StringLiteral, String.raw`"\x088"`, '\b8'],
    [Context.None, Token.StringLiteral, String.raw`"\x34"`, '4'],
    [Context.None, Token.StringLiteral, String.raw`"\xCd"`, 'Í'],
    [Context.None, Token.StringLiteral, String.raw`"\xF0"`, 'ð'],
    [
      Context.None,
      Token.StringLiteral,
      String.raw`"\xF000111FEEEDDAAAB77777999344BBBCCD0"`,
      'ð00111FEEEDDAAAB77777999344BBBCCD0',
    ],
    [Context.None, Token.StringLiteral, String.raw`"\x128"`, '\u00128'],
    [Context.None, Token.StringLiteral, String.raw`"\xCd#"`, 'Í#'],
    [Context.None, Token.StringLiteral, String.raw`"\xDe\x00"`, 'Þ\u0000'],
    [Context.None, Token.StringLiteral, String.raw`"\0x0061"`, '\u0000x0061'],
    [Context.None, Token.StringLiteral, String.raw`"\x41"`, 'A'],
    [Context.None, Token.StringLiteral, String.raw`"\x4A"`, 'J'],
    [Context.None, Token.StringLiteral, String.raw`"\x4F"`, 'O'],
    [Context.None, Token.StringLiteral, String.raw`"\x69"`, 'i'],

    // Escaped octal
    [Context.None, Token.StringLiteral, String.raw`"\01"`, '\u0001'],
    [Context.None, Token.StringLiteral, String.raw`"\023"`, '\u0013'],
    [Context.None, Token.StringLiteral, String.raw`"\04"`, '\u0004'],
    [Context.None, Token.StringLiteral, String.raw`"\44444444444"`, '$444444444'],
    [Context.None, Token.StringLiteral, String.raw`"\777777"`, '?7777'],
    [Context.None, Token.StringLiteral, String.raw`"\052"`, '*'],
    [Context.None, Token.StringLiteral, String.raw`"\08"`, '\u00008'],
    [Context.None, Token.StringLiteral, String.raw`"\7"`, '\u0007'],
    [Context.None, Token.StringLiteral, String.raw`"\052"`, '*'],
    [Context.None, Token.StringLiteral, String.raw`"Hello\nworld"`, 'Hello\nworld'],
    [Context.None, Token.StringLiteral, String.raw`"Hello\312World"`, 'HelloÊWorld'],
    [Context.None, Token.StringLiteral, String.raw`"Hello\712World"`, 'Hello92World'],
    [Context.None, Token.StringLiteral, String.raw`"Hello\1World"`, 'Hello\u0001World'],
    [Context.None, Token.StringLiteral, String.raw`"Hello\02World"`, 'Hello\u0002World'],
    [Context.None, Token.StringLiteral, String.raw`"\46"`, '&'],
    [Context.None, Token.StringLiteral, String.raw`"\5*"`, '\u0005*'],
    [Context.None, Token.StringLiteral, String.raw`"\10"`, '\b'],
    [Context.None, Token.StringLiteral, String.raw`"\02"`, '\u0002'],
    [Context.None, Token.StringLiteral, String.raw`"\02a"`, '\u0002a'],
    [Context.None, Token.StringLiteral, String.raw`"\02a"`, '\u0002a'],
    [Context.None, Token.StringLiteral, String.raw`"\73"`, ';'],
    [Context.None, Token.StringLiteral, String.raw`"\62a"`, '2a'],
    [Context.None, Token.StringLiteral, String.raw`"\023"`, '\u0013'],
    [Context.None, Token.StringLiteral, String.raw`"\7"`, '\u0007'],
    [Context.None, Token.StringLiteral, String.raw`"\012"`, '\n'],
    [Context.None, Token.StringLiteral, String.raw`"\126"`, 'V'],
    [Context.None, Token.StringLiteral, String.raw`"\302"`, 'Â'],
    [Context.None, Token.StringLiteral, String.raw`"\000"`, '\u0000'],
    [Context.None, Token.StringLiteral, String.raw`"\104"`, 'D'],
    [Context.None, Token.StringLiteral, String.raw`"\221"`, ''],

    // \8 \9 are acceptable in web compatibility mode
    [Context.None, Token.StringLiteral, String.raw`"\8"`, '8', { webcompat: true }],
    [Context.None, Token.StringLiteral, String.raw`"\9"`, '9', { webcompat: true }],
    [Context.None, Token.StringLiteral, String.raw`"a\9999"`, 'a9999', { webcompat: true }],

    // Line continuation
    [Context.None, Token.StringLiteral, '"a\\\nb"', 'ab'],
    [Context.None, Token.StringLiteral, '"a\\\rb"', 'ab'],
    [Context.None, Token.StringLiteral, '"a\\\r\nb"', 'ab'],
    [Context.None, Token.StringLiteral, '"a\\\u2028b"', 'ab'], // unicode LineSeparator
    [Context.None, Token.StringLiteral, '"a\\\u2029b"', 'ab'], // unicode ParagraphSeparator
    [Context.None, Token.StringLiteral, '"\\\n"', ''],
    [Context.None, Token.StringLiteral, '"a\\\r"', 'a'],
    [Context.None, Token.StringLiteral, '"\\\r\nb"', 'b'],
    [Context.None, Token.StringLiteral, '"\\\r\n"', ''],
  ];

  for (const [ctx, token, op, value, options] of tokens) {
    it(`scans '${op}' at the end`, () => {
      const parser = new Parser(op, options);
      const found = scanSingleToken(parser, ctx, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: parser.index < parser.source.length,
          value: parser.tokenValue,
          index: parser.index,
        },
        {
          token: token,
          hasNext: false,
          value,
          index: op.length,
        },
      );
    });

    it(`scans '${op}' with more to go`, () => {
      const parser = new Parser(`${op} `, options);
      const found = scanSingleToken(parser, ctx, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: parser.index < parser.source.length,
          value: parser.tokenValue,
          index: parser.index,
        },
        {
          token: token,
          hasNext: true,
          value,
          index: op.length,
        },
      );
    });
  }

  function fail(name: string, source: string, context: Context, options: Options = {}) {
    it(name, () => {
      const parser = new Parser(source, options);
      t.throws(() => scanSingleToken(parser, context, 0));
    });
  }

  fail(String.raw`fails on "\9999"`, String.raw`"\9999"`, Context.None);
  // fail('fails on "\\08"', '"\\08"', Context.Strict);
  fail(String.raw`fails on "\1"`, String.raw`"\1"`, Context.Strict);
  fail('fails on "foo', '"foo', Context.None);
  fail('fails on "foo', '"foo', Context.None);
  fail(String.raw`fails on "\u{1F_639}"`, String.raw`"\u{1F_639}"`, Context.None, { next: true });
  fail(String.raw`fails on "\u007Xvwxyz"`, String.raw`"\u007Xvwxyz"`, Context.None, { next: true });
  //fail('fails on "abc\\u{}"', '"abc\\u{}"', Context.None, { next: true });
  fail(String.raw`fails on "abc\u}"`, String.raw`"abc\u}"`, Context.None, { next: true });
  fail(String.raw`fails on "abc\u{`, String.raw`"abc\u{"`, Context.None, { next: true });
  fail(String.raw`fails on "\u{70bc"`, String.raw`"\u{70bc"`, Context.None, { next: true });
  fail(String.raw`fails on "\u{70"`, String.raw`"\u{70"`, Context.None, { next: true });
  fail(String.raw`fails on "\u{!"`, String.raw`"\u{!"`, Context.None);
  fail(String.raw`fails on "\u"`, String.raw`"\u"`, Context.None);
  fail(String.raw`fails on "\8"`, String.raw`"\8"`, Context.None);
  fail(String.raw`fails on "\9`, String.raw`"\9"`, Context.None);
  fail(String.raw`fails on "\"`, String.raw`"\"`, Context.None);
  fail(String.raw`fails on "\u{10401"`, String.raw`"\u{10401"`, Context.None);
  fail(String.raw`fails on "\u{110000}"`, String.raw`"\u{110000}"`, Context.None);
  fail(String.raw`fails on "\u0x11ffff"`, String.raw`"\u0x11ffff"`, Context.None);
  fail(String.raw`fails on "\xCq"`, String.raw`"\xCq"`, Context.None);
  fail(String.raw`fails on "\x"`, String.raw`"\x"`, Context.None);
  fail(String.raw`fails on "\xb"`, String.raw`"\xb"`, Context.None);
  fail(String.raw`fails on "\uxxxxλ"`, String.raw`"\uxxxxλ"`, Context.None);
  fail(String.raw`fails on "\u0fail"`, String.raw`"\u0fail"`, Context.None);
  fail(String.raw`fails on "\uab"`, String.raw`"\uab"`, Context.None);
  fail(String.raw`fails on "\uab"`, String.raw`"\uab"`, Context.None);
  fail(String.raw`fails on "\u{0fail}"`, String.raw`"\u{0fail}"`, Context.None);
  fail(String.raw`fails on "\u{xxxx}"`, String.raw`"\u{xxxx}"`, Context.None);
  fail(String.raw`fails on "\u{12345"`, String.raw`"\u{12345"`, Context.None);
  fail(String.raw`fails on "\u{123"`, String.raw`"\u{123"`, Context.None);
  fail(String.raw`fails on "\u{110000}"`, String.raw`"\u{110000}"`, Context.None);
  fail(
    String.raw`fails on "\u{00000000000000000000110000}"`,
    String.raw`"\u{00000000000000000000110000}"`,
    Context.None,
  );
  fail(String.raw`fails on "\7"`, String.raw`"\7"`, Context.Strict);
  fail('fails on "\\7\\\n"', '"\\7\\\n"', Context.Strict);
  fail(String.raw`fails on "\008"`, String.raw`"\008"`, Context.Strict);
  fail(String.raw`fails on "\012"`, String.raw`"\012"`, Context.Strict);
  fail(String.raw`fails on "\x4"`, String.raw`"\x4"`, Context.None);
  fail(String.raw`fails on "\6"`, String.raw`"\6"`, Context.Strict);
  fail(String.raw`fails on "\8"`, String.raw`"\8"`, Context.Strict);
  fail(String.raw`fails on "\9b"`, String.raw`"\9b"`, Context.Strict);
  fail(String.raw`fails on "\9b"`, String.raw`"\9b"`, Context.None);
  fail(String.raw`fails on "\1"`, String.raw`"\1"`, Context.Strict);
  fail(String.raw`fails on "\01"`, String.raw`"\01"`, Context.Strict);
  fail(String.raw`fails on "\21"`, String.raw`"\21"`, Context.Strict);
  fail(String.raw`fails on "\10r"`, String.raw`"\10r"`, Context.Strict);
  fail(String.raw`fails on "\21e"`, String.raw`"\21e"`, Context.Strict);
  fail(String.raw`fails on "\10"`, String.raw`"\10"`, Context.Strict);
  fail(String.raw`fails on "\012"`, String.raw`"\012"`, Context.Strict);
  fail(String.raw`fails on "\126"`, String.raw`"\126"`, Context.Strict);
  fail(String.raw`fails on "\324"`, String.raw`"\324"`, Context.Strict);
  fail(String.raw`fails on "\x9"`, String.raw`"\x9"`, Context.None);
  fail(String.raw`fails on "\xb"`, String.raw`"\xb"`, Context.None);
  fail(String.raw`fails on "\xf"`, String.raw`"\xf"`, Context.None);
  fail(String.raw`fails on "\x0"`, String.raw`"\x0"`, Context.None);
  fail(String.raw`fails on "\x1"`, String.raw`"\x1"`, Context.None);
  fail(String.raw`fails on "\xb"`, String.raw`"\xb"`, Context.None);
  fail(String.raw`fails on "\xF"`, String.raw`"\xF"`, Context.None);
  fail(String.raw`fails on "\x"`, String.raw`"\x"`, Context.None);
  fail(String.raw`fails on "\x"`, String.raw`"\x"`, Context.None);
  fail(String.raw`fails on "\x"`, String.raw`"\x"`, Context.None);
  fail(String.raw`fails on "\x"`, String.raw`"\x"`, Context.None);
  fail(String.raw`fails on "\xq7"`, String.raw`"\xq7"`, Context.None);
  fail(String.raw`fails on "\xqf"`, String.raw`"\xqf"`, Context.None);
  fail(String.raw`fails on "\xbq"`, String.raw`"\xbq"`, Context.None);
  fail(String.raw`fails on "\xAq"`, String.raw`"\xAq"`, Context.None);
  fail(String.raw`fails on "\xFq"`, String.raw`"\xFq"`, Context.None);
});
