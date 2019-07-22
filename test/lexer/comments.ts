import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('Lexer - Comments', () => {
  const tokens: [Context, Token, string, string][] = [
    [Context.OptionsWebCompat, Token.EOF, '//', ''],
    [Context.OptionsWebCompat, Token.EOF, '// foo', ''],
    [Context.OptionsWebCompat, Token.EOF, '// foo\n', ''],
    [Context.OptionsWebCompat, Token.EOF, '// /', ''],
    [Context.OptionsWebCompat, Token.EOF, '// */', ''],
    [Context.OptionsWebCompat, Token.EOF, '// /* */ foo', ''],
    [Context.OptionsWebCompat, Token.EOF, '//\\n \\r \\x0a \\u000a foo bar', ''],
    [Context.OptionsWebCompat, Token.EOF, '//\\unope \\u{nope} \\xno ', ''],
    [Context.OptionsWebCompat, Token.EOF, '/**/', ''],
    [Context.OptionsWebCompat, Token.EOF, '/* comment */', ''],
    [Context.OptionsWebCompat, Token.EOF, '/*foo*/', ''],
    [Context.OptionsWebCompat, Token.EOF, '/*foo\nbar\nbaz*/', ''],
    [Context.OptionsWebCompat, Token.EOF, '/*\n*/', ''],
    [Context.OptionsWebCompat, Token.EOF, '/* \n */', ''],
    [Context.OptionsWebCompat, Token.EOF, '/* \n\n\n */', ''],
    [Context.OptionsWebCompat, Token.EOF, '/* \\n \\r \\x0a \\u000a */', ''],
    [Context.OptionsWebCompat, Token.EOF, '/* /* */', ''],
    [Context.OptionsWebCompat, Token.EOF, '/*\u000C multi line \u000C comment \u000C*/', ''],
    [Context.OptionsWebCompat, Token.EOF, '/*\u00A0 multi line \u00A0 comment \u00A0 x = 1;*/', ''],
    [Context.OptionsWebCompat, Token.EOF, '/*\u0020 multi line \u0020 comment \u0020 x = 1;*/', ''],
    [Context.OptionsWebCompat, Token.EOF, '//\u000B single line \u000B comment \u000B x = 1;', ''],
    [Context.OptionsWebCompat, Token.EOF, '// single line comment x = 1;', ''],
    [Context.OptionsWebCompat, Token.EOF, '// single line comment x = 1;', ''],
    [Context.OptionsWebCompat, Token.EOF, '/*/ try and confuse the lexer\n */\n', ''],
    [Context.OptionsWebCompat, Token.EOF, '/* comments can have embedded "strings" */', ''],
    [Context.OptionsWebCompat, Token.EOF, '/* " /* */', ''],
    [Context.OptionsWebCompat, Token.Identifier, '//foo!@#^&$1234\nbar', ''],
    [Context.OptionsWebCompat, Token.EOF, '/* abcd!@#@$* { } && null*/', ''],
    [Context.OptionsWebCompat, Token.EOF, '/*x*x*/', ''],
    [Context.OptionsWebCompat, Token.EOF, '/**/', ''],
    [Context.OptionsWebCompat, Token.EOF, '//\r', ''],
    [Context.OptionsWebCompat, Token.EOF, '//\n', ''],
    [Context.OptionsWebCompat, Token.EOF, '<!--', ''],
    [Context.OptionsWebCompat, Token.EOF, '\n--' + '>', '']
  ];

  for (const [ctx, token, op] of tokens) {
    it(`scans '${op}' at the end`, () => {
      const state = create(op, '', undefined);
      const found = scanSingleToken(state, ctx, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: state.index < state.source.length,
          index: state.index
        },
        {
          token: token,
          hasNext: false,
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
