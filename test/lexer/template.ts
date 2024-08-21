import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('Lexer - Template', () => {
  describe('Lexer - Template Tail', () => {
    const tokens: [Context, Token, string, string][] = [
      [Context.None, Token.TemplateSpan, '``', ''],
      [Context.None, Token.TemplateSpan, '`a`', 'a'],
      [Context.None, Token.TemplateSpan, '`foo `', 'foo '],
      [Context.None, Token.TemplateSpan, '`foo `', 'foo '],
      [Context.None, Token.TemplateSpan, '`f1o2o`', 'f1o2o'],
      [Context.None, Token.TemplateSpan, '`دیوانه`', 'دیوانه'],
      [Context.None, Token.TemplateSpan, '`a℮`', 'a℮'],
      [Context.None, Token.TemplateSpan, '`℘`', '℘'],
      [Context.None, Token.TemplateSpan, '`a᧚`', 'a᧚'],
      [Context.None, Token.TemplateSpan, '`foo\\tbar`', 'foo\tbar'],
      // [Context.None, Token.TemplateSpan, '`\\x55a`', 'U'],
      [Context.None, Token.TemplateSpan, '`a\\nb`', 'a\nb'],
      [Context.None, Token.TemplateSpan, '`;`', ';'],
      [Context.None, Token.TemplateSpan, '``', ''],
      [Context.None, Token.TemplateSpan, '`123`', '123'],
      [Context.None, Token.TemplateSpan, '`true`', 'true'],
      [Context.None, Token.TemplateSpan, '`\n\r`', '\n\r'],
      [Context.None, Token.TemplateSpan, '`\r\n`', '\r\n'],
      [Context.None, Token.TemplateSpan, '`$$$a}`', '$$$a}'],

      // Russian letters
      [Context.None, Token.TemplateSpan, '`\\б`', 'б']

      // Unicode escape sequence - classic

      //    [Context.None, Token.TemplateSpan, '`\\u1000`', 'က'],
      //[Context.None, Token.TemplateSpan, '`\\u0041`', 'A'],
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
  });

  describe('Lexer - Template Span', () => {
    const tokens: [Context, Token, string, string][] = [
      [Context.None, Token.TemplateContinuation, '`${`', ''],
      [Context.None, Token.TemplateContinuation, '`$$${`', '$$'],
      [Context.None, Token.TemplateContinuation, '`$$${a}`', '$$']
    ];

    for (const [ctx, token, op, value] of tokens) {
      it(`scans '${op}' at the end`, () => {
        const state = create(op, '', undefined);
        const found = scanSingleToken(state, ctx, 0);

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
      //[Context.TaggedTemplate, Token.TemplateSpan, '`\\u{70bc`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\7${', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\1${', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, "`'${", "'"],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`"${', '"'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\`${', '`'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\`${', '`'],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\r`', '\r'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\f${', '\f'],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\f`', '\f'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\v${', '\v'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\n${', '\n'],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\n`', '\n'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\b${', '\b'],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\t`', '\t'],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{11ffff}${', undefined],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{11ffff}`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{11ffff}${', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{110000}${', undefined],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{g0g}`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{0g}${', undefined],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{g0}`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{g}${', undefined],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{g}`', undefined],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{g}`', undefined],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\x0g`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\x0g${', undefined],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\xg0`', undefined],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\0`', '\u0000']
    ];

    for (const [ctx, token, op, value] of tokens) {
      it(`scans '${op}' at the end`, () => {
        const state = create(op, '', undefined);
        const found = scanSingleToken(state, ctx, 0);

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
      const state = create(source, '', undefined);
      t.throws(() => scanSingleToken(state, context, 0));
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
  fail('fails on `\\u{11ffff}${"', '`\\u{11ffff}${', Context.None);
  fail('fails on `\\u{110000}${"', '`\\u{110000}${', Context.None);
  fail('fails on `\\u{g}`', '`\\u{g}`', Context.None);
  fail('fails on `\\u{g}`', '`\\u11${', Context.None);
  fail('fails on `\\u{g}`', '`\\uAA`', Context.None);
  fail('fails on `\\u{g}`', '`\\ufffg${', Context.None);
  fail('fails on `\\u00g0`', '`\\u00g0`', Context.None);
  fail('fails on `\\u{g}`', '`\\xgg`', Context.None);
  fail('fails on `\\u{g}`', '`\\xg0`', Context.None);
  fail('fails on `\\u{g}`', '`\\x0g`', Context.None);
  fail('fails on `\\01`', '`\\01`', Context.None);
  fail('fails on `\\1`', '`\\1`', Context.None);
  fail('fails on `\\2`', '`\\2`', Context.None);
  fail('fails on `\\3`', '`\\3`', Context.None);
  fail('fails on `\\4`', '`\\4`', Context.None);
  fail('fails on `\\5`', '`\\5`', Context.None);
  fail('fails on `\\6`', '`\\6`', Context.None);
  fail('fails on `\\7`', '`\\7`', Context.None);
});
