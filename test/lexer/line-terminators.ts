import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Context } from '../../src/common';
import { scanSingleToken } from '../../src/lexer/scan';
import { Parser } from '../../src/parser/parser';
import { Token } from '../../src/token';

describe('Lexer - Line terminators', () => {
  const tokens: [Context, Token, string, string][] = [
    [Context.None, Token.EOF, '\n', ''],
    [Context.None, Token.EOF, '\r\n', ''],
    [Context.None, Token.EOF, '\r', ''],
    [Context.None, Token.EOF, '\r\n\n\u2028\u2029\r', ''],
    [Context.None, Token.EOF, '\u2028', ''],
    [Context.None, Token.EOF, '\u2029', ''],
    [Context.None, Token.EOF, '/*\u2029 multi line \u2029 comment \u2029 x = 1;*/', ''],
    [Context.None, Token.Identifier, '\u000Dx', 'x'],
    [Context.None, Token.Identifier, '\nx', 'x'],
    [Context.None, Token.Identifier, '\rx', 'x'],
    [Context.None, Token.Identifier, '\u2028x', 'x'],
    [Context.None, Token.Identifier, '\u2029x', 'x'],
    [Context.None, Token.Identifier, '\u000Ax', 'x'],
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
  }

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const parser = new Parser(source);
      t.throws(() => scanSingleToken(parser, context, 0));
    });
  }

  fail('fails on /**', '/**', Context.None);
});
