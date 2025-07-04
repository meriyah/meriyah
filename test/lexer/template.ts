import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Context } from '../../src/common';
import { scanSingleToken } from '../../src/lexer/scan';
import { Parser } from '../../src/parser/parser';
import { Token } from '../../src/token';
import { type Options } from './../../src/options';

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
      [Context.None, Token.TemplateSpan, '`\\б`', 'б'],

      // Unicode escape sequence - classic

      //    [Context.None, Token.TemplateSpan, '`\\u1000`', 'က'],
      //[Context.None, Token.TemplateSpan, '`\\u0041`', 'A'],
    ];

    for (const [ctx, token, op, value] of tokens) {
      it(`scans '${op}' at the end`, () => {
        const parser = new Parser(op);
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
        const parser = new Parser(`${op} `);
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
  });

  describe('Lexer - Template Span', () => {
    const tokens: [Context, Token, string, string][] = [
      [Context.None, Token.TemplateContinuation, '`${`', ''],
      [Context.None, Token.TemplateContinuation, '`$$${`', '$$'],
      [Context.None, Token.TemplateContinuation, '`$$${a}`', '$$'],
    ];

    for (const [ctx, token, op, value] of tokens) {
      it(`scans '${op}' at the end`, () => {
        const parser = new Parser(op);
        const found = scanSingleToken(parser, ctx, 0);

        t.deepEqual(
          {
            token: found,
            value: parser.tokenValue,
          },
          {
            token: token,
            value,
          },
        );
      });
    }
  });

  describe('Lexer - Tagged Template', () => {
    const tokens: [Context, Token, string, string | null][] = [
      //[Context.TaggedTemplate, Token.TemplateSpan, '`\\u{70bc`', undefined],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\7${', null],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\1${', null],
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
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{11ffff}${', null],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{11ffff}`', null],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{11ffff}${', null],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{110000}${', null],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{g0g}`', null],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{0g}${', null],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{g0}`', null],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\u{g}${', null],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{g}`', null],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\u{g}`', null],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\x0g`', null],
      [Context.TaggedTemplate, Token.TemplateContinuation, '`\\x0g${', null],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\xg0`', null],
      [Context.TaggedTemplate, Token.TemplateSpan, '`\\0`', '\u0000'],
    ];

    for (const [ctx, token, op, value] of tokens) {
      it(`scans '${op}' at the end`, () => {
        const parser = new Parser(op);
        const found = scanSingleToken(parser, ctx, 0);

        t.deepEqual(
          {
            token: found,
            value: parser.tokenValue,
          },
          {
            token: token,
            value,
          },
        );
      });
    }
  });

  function fail(name: string, source: string, context: Context, options: Options = {}) {
    it(name, () => {
      const parser = new Parser(source, options);
      t.throws(() => scanSingleToken(parser, context, 0));
    });
  }

  fail(String.raw`fails on "\9999"`, String.raw`"\9999"`, Context.None);
  fail('fails on "foo', '"foo', Context.None);
  fail(String.raw`fails on "\u007"`, String.raw`"\u007"`, Context.None, { next: true });
  fail(String.raw`fails on "\u007Xvwxyz"`, String.raw`"\u007Xvwxyz"`, Context.None, { next: true });
  // fail('fails on "abc\\u{}"', '"abc\\u{}"', Context.OptionsNext);
  // fail('fails on "abc\\u}"', '"abc\\u}"', Context.OptionsNext);
  // fail('fails on "abc\\u{', '"abc\\u{"', Context.OptionsNext);
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
  fail(String.raw`fails on "\xFq"`, String.raw`"\xFq"`, Context.None);
  fail(String.raw`fails on "\xFq"`, String.raw`"\xFq"`, Context.None);
  fail(String.raw`fails on "\xFq"`, String.raw`"\xFq"`, Context.None);
  fail(String.raw`fails on "\xFq"`, String.raw`"\xFq"`, Context.None);
  fail(String.raw`fails on "\xFq"`, String.raw`"\xFq"`, Context.None);
  fail(String.raw`fails on "\xFq"`, String.raw`"\xFq"`, Context.None);
  fail(String.raw`fails on "\xFq"`, String.raw`"\xFq"`, Context.None);
  fail(String.raw`fails on "\xFq"`, String.raw`"\xFq"`, Context.None);
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
