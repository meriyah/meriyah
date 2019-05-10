import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('Lexer - Template', () => {
  describe('Lexer - Template Tail', () => {
    const tokens: [Context, Token, string, string][] = [
      [Context.None, Token.TemplateTail, '``', ''],
      [Context.None, Token.TemplateTail, '`a`', 'a'],
      [Context.None, Token.TemplateTail, '`foo `', 'foo '],
      [Context.None, Token.TemplateTail, '`foo `', 'foo '],
      [Context.None, Token.TemplateTail, '`f1o2o`', 'f1o2o'],
      [Context.None, Token.TemplateTail, '`دیوانه`', 'دیوانه'],
      [Context.None, Token.TemplateTail, '`a℮`', 'a℮'],
      [Context.None, Token.TemplateTail, '`℘`', '℘'],
      [Context.None, Token.TemplateTail, '`a᧚`', 'a᧚'],
      [Context.None, Token.TemplateTail, '`foo\\tbar`', 'foo\tbar'],
      // [Context.None, Token.TemplateTail, '`\\x55a`', 'U'],
      [Context.None, Token.TemplateTail, '`a\\nb`', 'a\nb'],
      [Context.None, Token.TemplateTail, '`;`', ';'],
      [Context.None, Token.TemplateTail, '``', ''],
      [Context.None, Token.TemplateTail, '`123`', '123'],
      [Context.None, Token.TemplateTail, '`true`', 'true'],
      [Context.None, Token.TemplateTail, '`\n\r`', '\n\r'],
      [Context.None, Token.TemplateTail, '`\r\n`', '\r\n'],
      [Context.None, Token.TemplateTail, '`$$$a}`', '$$$a}'],

      // Russian letters
      [Context.None, Token.TemplateTail, '`\\б`', 'б']

      // Unicode escape sequence - classic

      //    [Context.None, Token.TemplateTail, '`\\u1000`', 'က'],
      //[Context.None, Token.TemplateTail, '`\\u0041`', 'A'],
    ];

    for (const [ctx, token, op, value] of tokens) {
      it(`scans '${op}' at the end`, () => {
        const state = create(op);
        const found = scanSingleToken(state, ctx);

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
        const state = create(`${op} `);
        const found = scanSingleToken(state, ctx);

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
  });

  describe('Lexer - Template Span', () => {
    const tokens: [Context, Token, string, string][] = [
      [Context.None, Token.TemplateContinuation, '`${`', ''],
      [Context.None, Token.TemplateContinuation, '`$$${`', '$$'],
      [Context.None, Token.TemplateContinuation, '`$$${a}`', '$$']
    ];

    for (const [ctx, token, op, value] of tokens) {
      it(`scans '${op}' at the end`, () => {
        const state = create(op);
        const found = scanSingleToken(state, ctx);

        t.deepEqual(
          {
            token: found,
            value: state.tokenValue
          },
          {
            token: token,
            value
          }
        );
      });
    }
  });

  describe('Lexer - Tagged Template', () => {
    const tokens: [Context, Token, string, string | void][] = [
      //[Context.TaggedTemplate, Token.TemplateTail, '`\\u{70bc`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\7${', '\u0007'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\1${', '\u0001'],
      [Context.TaggedTemplate, Token.TemplateContinuation, "`'${", "'"],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`"${', '"'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\`${', '`'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\`${', '`'],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\r`', '\r'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\f${', '\f'],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\f`', '\f'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\v${', '\v'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\n${', '\n'],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\n`', '\n'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\b${', '\b'],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\t`', '\t'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{11ffff}${', undefined],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\u{11ffff}`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{11ffff}${', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{110000}${', undefined],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\u{g0g}`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{0g}${', undefined],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\u{g0}`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{g}${', undefined],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\u{g}`', undefined],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\u{g}`', undefined],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\x0g`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\x0g${', undefined],
      [Context.TaggedTemplate, Token.TemplateTail, '`\\xg0`', undefined]
    ];

    for (const [ctx, token, op, value] of tokens) {
      it(`scans '${op}' at the end`, () => {
        const state = create(op);
        const found = scanSingleToken(state, ctx);

        t.deepEqual(
          {
            token: found,
            value: state.tokenValue
          },
          {
            token: token,
            value
          }
        );
      });
    }
  });

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const state = create(source);
      t.throws(() => scanSingleToken(state, context));
    });
  }

  fail('fails on "\\9999"', '"\\9999"', Context.None);
  fail('fails on "foo', '"foo', Context.None);
  fail('fails on "\\u007"', '"\\u007"', Context.OptionsNext);
  fail('fails on "\\u007Xvwxyz"', '"\\u007Xvwxyz"', Context.OptionsNext);
  // fail('fails on "abc\\u{}"', '"abc\\u{}"', Context.OptionsNext);
  // fail('fails on "abc\\u}"', '"abc\\u}"', Context.OptionsNext);
  // fail('fails on "abc\\u{', '"abc\\u{"', Context.OptionsNext);
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
  fail('fails on "\\xFq"', '"\\xFq"', Context.None);
  fail('fails on "\\xFq"', '"\\xFq"', Context.None);
  fail('fails on "\\xFq"', '"\\xFq"', Context.None);
  fail('fails on "\\xFq"', '"\\xFq"', Context.None);
  fail('fails on "\\xFq"', '"\\xFq"', Context.None);
  fail('fails on "\\xFq"', '"\\xFq"', Context.None);
  fail('fails on "\\xFq"', '"\\xFq"', Context.None);
  fail('fails on "\\xFq"', '"\\xFq"', Context.None);
  fail('fails on "`\\u{11ffff}${"', '`\\u{11ffff}${', Context.None);
  fail('fails on "`\\u{110000}${"', '`\\u{110000}${', Context.None);
  fail('fails on "`\\u{g}`"', '`\\u{g}`', Context.None);
  fail('fails on "`\\u{g}`"', '`\\u11${', Context.None);
  fail('fails on "`\\u{g}`"', '`\\uAA`', Context.None);
  fail('fails on "`\\u{g}`"', '`\\ufffg${', Context.None);
  fail('fails on "\\u00g0"', '`\\u00g0`', Context.None);
  fail('fails on "`\\u{g}`"', '`\\xgg`', Context.None);
  fail('fails on "`\\u{g}`"', '`\\xg0`', Context.None);
  fail('fails on "`\\u{g}`"', '`\\x0g`', Context.None);
});
