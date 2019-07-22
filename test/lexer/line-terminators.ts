import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

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
    [Context.None, Token.Identifier, '\u000Ax', 'x']
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
  }

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const state = create(source, '', undefined);
      t.throws(() => scanSingleToken(state, context, 0));
    });
  }

  fail('fails on /**', '/**', Context.None);
});
