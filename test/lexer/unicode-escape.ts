import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('Lexer - Unicode Escape', () => {
  const tokens: [Context, Token, string, string][] = [
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u0049', 'I'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u0627\\u0644\\u0642\\u0637', 'القط'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u0066', 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u0066', 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u0061', 'a'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{61}', 'a'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{0000061}', 'a'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{0066}', 'f'],
    [Context.None, Token.LetKeyword | Token.IsEscaped, 'l\\u0065t', 'let'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{0000000066}', 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{000000000000000066}', 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{00000000000000000000000066}', 'f'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u0062\\u0066', 'bf'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u0067', 'g'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u01F602', 'Ƕ02'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{41}', 'A'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{0041}', 'A'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{03BB}', 'λ'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{6728}', '木'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{7800}', '砀'],
    [Context.None, Token.Identifier | Token.IsEscaped, '\\u{4b00}', '䬀']
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

  fail('fails on \\u{1F4A9}', '\\u{1F4A9}', Context.None);
  fail('fails on \\u162P', '\\u162P', Context.None);
  fail('fails on \\u{FFYZ}', '\\u{FFYZ}', Context.None);
  fail('fails on \\u41', '\\u41', Context.None);
  fail('fails on "\\u41"', '"\\u41"', Context.None);
  fail('fails on \\u123', '\\u123', Context.None);
  fail('fails on \\u\\u\\u', '\\u\\u\\u', Context.None);
  fail('fails on \\u005Cuc548', '\\u005Cuc548', Context.None);
  fail('fails on \\u{000006100000000}', '\\u{000006100000000}', Context.None);
  fail('fails on "\\u{000006100000000}"', '"\\u{000006100000000}"', Context.None);
});
