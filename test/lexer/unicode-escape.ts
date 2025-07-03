import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Context } from '../../src/common';
import { scanSingleToken } from '../../src/lexer/scan';
import { Parser } from '../../src/parser/parser';
import { Token } from '../../src/token';

describe('Lexer - Unicode Escape', () => {
  const tokens: [Context, Token, string, string][] = [
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0049`, 'I'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0627\u0644\u0642\u0637`, 'القط'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0066`, 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0066`, 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0061`, 'a'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{61}`, 'a'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{0000061}`, 'a'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{0066}`, 'f'],
    [Context.None, Token.LetKeyword | Token.IsEscaped, String.raw`l\u0065t`, 'let'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{0000000066}`, 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{000000000000000066}`, 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{00000000000000000000000066}`, 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0062\u0066`, 'bf'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0067`, 'g'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u01F602`, 'Ƕ02'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{41}`, 'A'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{0041}`, 'A'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{03BB}`, 'λ'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{6728}`, '木'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{7800}`, '砀'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{4b00}`, '䬀'],
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

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const parser = new Parser(source);
      t.throws(() => scanSingleToken(parser, context, 0));
    });
  }

  fail(String.raw`fails on \u{1F4A9}`, String.raw`\u{1F4A9}`, Context.None);
  fail(String.raw`fails on \u162P`, String.raw`\u162P`, Context.None);
  fail(String.raw`fails on \u{FFYZ}`, String.raw`\u{FFYZ}`, Context.None);
  fail(String.raw`fails on \u41`, String.raw`\u41`, Context.None);
  fail(String.raw`fails on "\u41"`, String.raw`"\u41"`, Context.None);
  fail(String.raw`fails on \u123`, String.raw`\u123`, Context.None);
  fail(String.raw`fails on \u\u\u`, String.raw`\u\u\u`, Context.None);
  fail(String.raw`fails on \u005Cuc548`, String.raw`\u005Cuc548`, Context.None);
  fail(String.raw`fails on \u{000006100000000}`, String.raw`\u{000006100000000}`, Context.None);
  fail(String.raw`fails on "\u{000006100000000}"`, String.raw`"\u{000006100000000}"`, Context.None);
});
