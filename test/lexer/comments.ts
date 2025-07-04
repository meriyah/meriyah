import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Context } from '../../src/common';
import { scanSingleToken } from '../../src/lexer/scan';
import { Parser } from '../../src/parser/parser';
import { Token } from '../../src/token';
import { type Options } from './../../src/options';

describe('Lexer - Comments', () => {
  const tokens: [Options, Token, string, string][] = [
    [{ webcompat: true }, Token.EOF, '//', ''],
    [{ webcompat: true }, Token.EOF, '// foo', ''],
    [{ webcompat: true }, Token.EOF, '// foo\n', ''],
    [{ webcompat: true }, Token.EOF, '// /', ''],
    [{ webcompat: true }, Token.EOF, '// */', ''],
    [{ webcompat: true }, Token.EOF, '// /* */ foo', ''],
    [{ webcompat: true }, Token.EOF, String.raw`//\n \r \x0a \u000a foo bar`, ''],
    [{ webcompat: true }, Token.EOF, String.raw`//\unope \u{nope} \xno `, ''],
    [{ webcompat: true }, Token.EOF, '/**/', ''],
    [{ webcompat: true }, Token.EOF, '/* comment */', ''],
    [{ webcompat: true }, Token.EOF, '/*foo*/', ''],
    [{ webcompat: true }, Token.EOF, '/*foo\nbar\nbaz*/', ''],
    [{ webcompat: true }, Token.EOF, '/*\n*/', ''],
    [{ webcompat: true }, Token.EOF, '/* \n */', ''],
    [{ webcompat: true }, Token.EOF, '/* \n\n\n */', ''],
    [{ webcompat: true }, Token.EOF, String.raw`/* \n \r \x0a \u000a */`, ''],
    [{ webcompat: true }, Token.EOF, '/* /* */', ''],
    [{ webcompat: true }, Token.EOF, '/*\u000C multi line \u000C comment \u000C*/', ''],
    [{ webcompat: true }, Token.EOF, '/*\u00A0 multi line \u00A0 comment \u00A0 x = 1;*/', ''],
    [{ webcompat: true }, Token.EOF, '/*\u0020 multi line \u0020 comment \u0020 x = 1;*/', ''],
    [{ webcompat: true }, Token.EOF, '//\u000B single line \u000B comment \u000B x = 1;', ''],
    [{ webcompat: true }, Token.EOF, '// single line comment x = 1;', ''],
    [{ webcompat: true }, Token.EOF, '// single line comment x = 1;', ''],
    [{ webcompat: true }, Token.EOF, '/*/ try and confuse the lexer\n */\n', ''],
    [{ webcompat: true }, Token.EOF, '/* comments can have embedded "strings" */', ''],
    [{ webcompat: true }, Token.EOF, '/* " /* */', ''],
    [{ webcompat: true }, Token.Identifier, '//foo!@#^&$1234\nbar', ''],
    [{ webcompat: true }, Token.EOF, '/* abcd!@#@$* { } && null*/', ''],
    [{ webcompat: true }, Token.EOF, '/*x*x*/', ''],
    [{ webcompat: true }, Token.EOF, '/**/', ''],
    [{ webcompat: true }, Token.EOF, '//\r', ''],
    [{ webcompat: true }, Token.EOF, '//\n', ''],
    [{ webcompat: true }, Token.EOF, '<!--', ''],
    [{ webcompat: true }, Token.EOF, '\n--' + '>', ''],
  ];

  for (const [options, token, op] of tokens) {
    it(`scans '${op}' at the end`, () => {
      const parser = new Parser(op, options);
      const found = scanSingleToken(parser, Context.None, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: parser.index < parser.source.length,
          index: parser.index,
        },
        {
          token: token,
          hasNext: false,
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
