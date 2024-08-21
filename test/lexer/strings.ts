import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('Lexer - String', () => {
  const tokens: [Context, Token, string, string][] = [
    [Context.None, Token.StringLiteral, '"foo"', 'foo'],
    [Context.None, Token.StringLiteral, '"foo "', 'foo '],
    [Context.None, Token.StringLiteral, '"foo "', 'foo '],
    [Context.None, Token.StringLiteral, '"f1o2o"', 'f1o2o'],
    [Context.None, Token.StringLiteral, '"دیوانه"', 'دیوانه'],
    [Context.None, Token.StringLiteral, '"a℮"', 'a℮'],
    [Context.None, Token.StringLiteral, '"℘"', '℘'],
    [Context.None, Token.StringLiteral, '"a᧚"', 'a᧚'],
    [Context.None, Token.StringLiteral, '"a\\n"', 'a\n'],
    [Context.None, Token.StringLiteral, '"foo\\tbar"', 'foo\tbar'],
    [Context.None, Token.StringLiteral, '"\\u0001"', '\u0001'],
    [Context.None, Token.StringLiteral, '"\\x55"', 'U'],
    [Context.None, Token.StringLiteral, '"\\x55a"', 'Ua'],
    [Context.None, Token.StringLiteral, '"a\\nb"', 'a\nb'],
    [Context.None, Token.StringLiteral, '";"', ';'],
    [Context.None, Token.StringLiteral, '"\\r"', '\r'],
    [Context.None, Token.StringLiteral, '""', ''],
    [Context.None, Token.StringLiteral, '"123"', '123'],
    [Context.None, Token.StringLiteral, '"true"', 'true'],
    [
      Context.None,
      Token.StringLiteral,
      '"\
    "',
      '    '
    ],

    // Russian letters
    [Context.None, Token.StringLiteral, '"\\б"', 'б'],
    [Context.None, Token.StringLiteral, '"\\И"', 'И'],
    [Context.None, Token.StringLiteral, '"\\Й"', 'Й'],
    [Context.None, Token.StringLiteral, '"\\К"', 'К'],
    [Context.None, Token.StringLiteral, '"\\Л"', 'Л'],
    [Context.None, Token.StringLiteral, '"\\О"', 'О'],
    [Context.None, Token.StringLiteral, '"\\Ф"', 'Ф'],
    [Context.None, Token.StringLiteral, '"\\Ц"', 'Ц'],
    [Context.None, Token.StringLiteral, '"\\Ш"', 'Ш'],
    [Context.None, Token.StringLiteral, '"\\Э"', 'Э'],
    [Context.None, Token.StringLiteral, '"\\ж"', 'ж'],
    [Context.None, Token.StringLiteral, '"\\з"', 'з'],

    // Escaped letters
    [Context.None, Token.StringLiteral, '"\\b"', '\b'],
    [Context.None, Token.StringLiteral, '"\\v"', '\v'],
    [Context.None, Token.StringLiteral, '"\\t"', '\t'],
    [Context.None, Token.StringLiteral, '"\\f"', '\f'],
    [Context.None, Token.StringLiteral, '"\\j"', 'j'],
    [Context.None, Token.StringLiteral, '"\\A"', 'A'],
    [Context.None, Token.StringLiteral, '"\\t"', '\t'],
    [Context.None, Token.StringLiteral, '"\\fsuffix"', '\fsuffix'],
    [Context.None, Token.StringLiteral, '"\\Rsuffix"', 'Rsuffix'],
    [Context.None, Token.StringLiteral, '"prefix\\r\\n"', 'prefix\r\n'],

    // Unicode escape sequence

    [Context.None, Token.StringLiteral, '"\\u1000"', 'က'],
    [Context.None, Token.StringLiteral, '"\\uf2ff"', ''],
    [Context.None, Token.StringLiteral, '"\\u0041"', 'A'],
    [Context.None, Token.StringLiteral, '"\\uf2ff"', ''],
    [Context.None, Token.StringLiteral, '"\\u0123"', 'ģ'],
    [Context.None, Token.StringLiteral, '"\\u0123 postfix"', 'ģ postfix'],
    [Context.None, Token.StringLiteral, '"\\u{89abc}"', '򉪼'],
    [Context.None, Token.StringLiteral, '"\\u{CDEF}"', '췯'],
    [Context.None, Token.StringLiteral, '"\\u{0000000000000000000010ffff}"', '􏿿'],
    [Context.None, Token.StringLiteral, '"\\u{10ffff}"', '􏿿'],
    [Context.None, Token.StringLiteral, '"\\u0062"', 'b'],
    [Context.None, Token.StringLiteral, '"\\u0410"', 'А'],
    [Context.None, Token.StringLiteral, '"\\u0412"', 'В'],
    [Context.None, Token.StringLiteral, '"\\u0419"', 'Й'],
    [Context.None, Token.StringLiteral, '"\\u042E"', 'Ю'],
    [Context.None, Token.StringLiteral, '"\\u0432"', 'в'],
    [Context.None, Token.StringLiteral, '"\\u0030"', '0'],
    [Context.None, Token.StringLiteral, '"\\u0035"', '5'],
    [Context.None, Token.StringLiteral, '"\\u0003"', '\u0003'],
    [Context.None, Token.StringLiteral, '"\\u180E"', '᠎'],

    // Escaped hex

    [Context.None, Token.StringLiteral, '"\\x01F"', '\u0001F'],
    [Context.None, Token.StringLiteral, '"\\x05B"', '\u0005B'],
    [Context.None, Token.StringLiteral, '"\\x0D3"', '\r3'],
    [Context.None, Token.StringLiteral, '"\\x088"', '\b8'],
    [Context.None, Token.StringLiteral, '"\\x34"', '4'],
    [Context.None, Token.StringLiteral, '"\\xCd"', 'Í'],
    [Context.None, Token.StringLiteral, '"\\xF0"', 'ð'],
    [
      Context.None,
      Token.StringLiteral,
      '"\\xF000111FEEEDDAAAB77777999344BBBCCD0"',
      'ð00111FEEEDDAAAB77777999344BBBCCD0'
    ],
    [Context.None, Token.StringLiteral, '"\\x128"', '\u00128'],
    [Context.None, Token.StringLiteral, '"\\xCd#"', 'Í#'],
    [Context.None, Token.StringLiteral, '"\\xDe\\x00"', 'Þ\u0000'],
    [Context.None, Token.StringLiteral, '"\\0x0061"', '\u0000x0061'],
    [Context.None, Token.StringLiteral, '"\\x41"', 'A'],
    [Context.None, Token.StringLiteral, '"\\x4A"', 'J'],
    [Context.None, Token.StringLiteral, '"\\x4F"', 'O'],
    [Context.None, Token.StringLiteral, '"\\x69"', 'i'],

    // Escaped octals
    [Context.None, Token.StringLiteral, '"\\01"', '\u0001'],
    [Context.None, Token.StringLiteral, '"\\023"', '\u0013'],
    [Context.None, Token.StringLiteral, '"\\04"', '\u0004'],
    [Context.None, Token.StringLiteral, '"\\44444444444"', '$444444444'],
    [Context.None, Token.StringLiteral, '"\\777777"', '?7777'],
    [Context.None, Token.StringLiteral, '"\\052"', '*'],
    [Context.None, Token.StringLiteral, '"\\08"', '\u00008'],
    [Context.None, Token.StringLiteral, '"\\7"', '\u0007'],
    [Context.None, Token.StringLiteral, '"\\052"', '*'],
    [Context.None, Token.StringLiteral, '"Hello\\nworld"', 'Hello\nworld'],
    [Context.None, Token.StringLiteral, '"Hello\\312World"', 'HelloÊWorld'],
    [Context.None, Token.StringLiteral, '"Hello\\712World"', 'Hello92World'],
    [Context.None, Token.StringLiteral, '"Hello\\1World"', 'Hello\u0001World'],
    [Context.None, Token.StringLiteral, '"Hello\\02World"', 'Hello\u0002World'],
    [Context.None, Token.StringLiteral, '"\\46"', '&'],
    [Context.None, Token.StringLiteral, '"\\5*"', '\u0005*'],
    [Context.None, Token.StringLiteral, '"\\10"', '\b'],
    [Context.None, Token.StringLiteral, '"\\02"', '\u0002'],
    [Context.None, Token.StringLiteral, '"\\02a"', '\u0002a'],
    [Context.None, Token.StringLiteral, '"\\02a"', '\u0002a'],
    [Context.None, Token.StringLiteral, '"\\73"', ';'],
    [Context.None, Token.StringLiteral, '"\\62a"', '2a'],
    [Context.None, Token.StringLiteral, '"\\023"', '\u0013'],
    [Context.None, Token.StringLiteral, '"\\7"', '\u0007'],
    [Context.None, Token.StringLiteral, '"\\012"', '\n'],
    [Context.None, Token.StringLiteral, '"\\126"', 'V'],
    [Context.None, Token.StringLiteral, '"\\302"', 'Â'],
    [Context.None, Token.StringLiteral, '"\\000"', '\u0000'],
    [Context.None, Token.StringLiteral, '"\\104"', 'D'],
    [Context.None, Token.StringLiteral, '"\\221"', ''],

    // \8 \9 are acceptable in web compatibility mode
    [Context.OptionsWebCompat, Token.StringLiteral, '"\\8"', '8'],
    [Context.OptionsWebCompat, Token.StringLiteral, '"\\9"', '9'],
    [Context.OptionsWebCompat, Token.StringLiteral, '"a\\9999"', 'a9999'],

    // Line continuation
    [Context.None, Token.StringLiteral, '"a\\\nb"', 'ab'],
    [Context.None, Token.StringLiteral, '"a\\\rb"', 'ab'],
    [Context.None, Token.StringLiteral, '"a\\\r\nb"', 'ab'],
    [Context.None, Token.StringLiteral, '"a\\\u2028b"', 'ab'], // unicode LineSeparator
    [Context.None, Token.StringLiteral, '"a\\\u2029b"', 'ab'], // unicode ParagraphSeparator
    [Context.None, Token.StringLiteral, '"\\\n"', ''],
    [Context.None, Token.StringLiteral, '"a\\\r"', 'a'],
    [Context.None, Token.StringLiteral, '"\\\r\nb"', 'b'],
    [Context.None, Token.StringLiteral, '"\\\r\n"', '']
  ];

  for (const [ctx, token, op, value] of tokens) {
    it(`scans '${op}' at the end`, () => {
      const state = create(op, '', undefined);
      const found = scanSingleToken(state, ctx, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: state.index < state.source.length,
          value: state.tokenValue,
          index: state.index
        },
        {
          token: token,
          hasNext: false,
          value,
          index: op.length
        }
      );
    });

    it(`scans '${op}' with more to go`, () => {
      const state = create(`${op} `, '', undefined);
      const found = scanSingleToken(state, ctx, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: state.index < state.source.length,
          value: state.tokenValue,
          index: state.index
        },
        {
          token: token,
          hasNext: true,
          value,
          index: op.length
        }
      );
    });
  }

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const state = create(source, '', undefined);
      t.throws(() => scanSingleToken(state, context, 0));
    });
  }

  fail('fails on "\\9999"', '"\\9999"', Context.None);
  // fail('fails on "\\08"', '"\\08"', Context.Strict);
  fail('fails on "\\1"', '"\\1"', Context.Strict);
  fail('fails on "foo', '"foo', Context.None);
  fail('fails on "foo', '"foo', Context.None);
  fail('fails on "\\u{1F_639}"', '"\\u{1F_639}"', Context.OptionsNext);
  fail('fails on "\\u007Xvwxyz"', '"\\u007Xvwxyz"', Context.OptionsNext);
  //fail('fails on "abc\\u{}"', '"abc\\u{}"', Context.OptionsNext);
  fail('fails on "abc\\u}"', '"abc\\u}"', Context.OptionsNext);
  fail('fails on "abc\\u{', '"abc\\u{"', Context.OptionsNext);
  fail('fails on "\\u{70bc"', '"\\u{70bc"', Context.OptionsNext);
  fail('fails on "\\u{70"', '"\\u{70"', Context.OptionsNext);
  fail('fails on "\\u{!"', '"\\u{!"', Context.None);
  fail('fails on "\\u"', '"\\u"', Context.None);
  fail('fails on "\\8"', '"\\8"', Context.None);
  fail('fails on "\\9', '"\\9"', Context.None);
  fail('fails on "\\"', '"\\"', Context.None);
  fail('fails on "\\u{10401"', '"\\u{10401"', Context.None);
  fail('fails on "\\u{110000}"', '"\\u{110000}"', Context.None);
  fail('fails on "\\u0x11ffff"', '"\\u0x11ffff"', Context.None);
  fail('fails on "\\xCq"', '"\\xCq"', Context.None);
  fail('fails on "\\x"', '"\\x"', Context.None);
  fail('fails on "\\xb"', '"\\xb"', Context.None);
  fail('fails on "\\uxxxxλ"', '"\\uxxxxλ"', Context.None);
  fail('fails on "\\u0fail"', '"\\u0fail"', Context.None);
  fail('fails on "\\uab"', '"\\uab"', Context.None);
  fail('fails on "\\uab"', '"\\uab"', Context.None);
  fail('fails on "\\u{0fail}"', '"\\u{0fail}"', Context.None);
  fail('fails on "\\u{xxxx}"', '"\\u{xxxx}"', Context.None);
  fail('fails on "\\u{12345"', '"\\u{12345"', Context.None);
  fail('fails on "\\u{123"', '"\\u{123"', Context.None);
  fail('fails on "\\u{110000}"', '"\\u{110000}"', Context.None);
  fail('fails on "\\u{00000000000000000000110000}"', '"\\u{00000000000000000000110000}"', Context.None);
  fail('fails on "\\7"', '"\\7"', Context.Strict);
  fail('fails on "\\7\\\n"', '"\\7\\\n"', Context.Strict);
  fail('fails on "\\008"', '"\\008"', Context.Strict);
  fail('fails on "\\012"', '"\\012"', Context.Strict);
  fail('fails on "\\x4"', '"\\x4"', Context.None);
  fail('fails on "\\6"', '"\\6"', Context.Strict);
  fail('fails on "\\8"', '"\\8"', Context.Strict);
  fail('fails on "\\9b"', '"\\9b"', Context.Strict);
  fail('fails on "\\9b"', '"\\9b"', Context.None);
  fail('fails on "\\1"', '"\\1"', Context.Strict);
  fail('fails on "\\01"', '"\\01"', Context.Strict);
  fail('fails on "\\21"', '"\\21"', Context.Strict);
  fail('fails on "\\10r"', '"\\10r"', Context.Strict);
  fail('fails on "\\21e"', '"\\21e"', Context.Strict);
  fail('fails on "\\10"', '"\\10"', Context.Strict);
  fail('fails on "\\012"', '"\\012"', Context.Strict);
  fail('fails on "\\126"', '"\\126"', Context.Strict);
  fail('fails on "\\324"', '"\\324"', Context.Strict);
  fail('fails on "\\x9"', '"\\x9"', Context.None);
  fail('fails on "\\xb"', '"\\xb"', Context.None);
  fail('fails on "\\xf"', '"\\xf"', Context.None);
  fail('fails on "\\x0"', '"\\x0"', Context.None);
  fail('fails on "\\x1"', '"\\x1"', Context.None);
  fail('fails on "\\xb"', '"\\xb"', Context.None);
  fail('fails on "\\xF"', '"\\xF"', Context.None);
  fail('fails on "\\x"', '"\\x"', Context.None);
  fail('fails on "\\x"', '"\\x"', Context.None);
  fail('fails on "\\x"', '"\\x"', Context.None);
  fail('fails on "\\x"', '"\\x"', Context.None);
  fail('fails on "\\xq7"', '"\\xq7"', Context.None);
  fail('fails on "\\xqf"', '"\\xqf"', Context.None);
  fail('fails on "\\xbq"', '"\\xbq"', Context.None);
  fail('fails on "\\xAq"', '"\\xAq"', Context.None);
  fail('fails on "\\xFq"', '"\\xFq"', Context.None);
});
