import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Context } from '../../src/common';
import { scanSingleToken } from '../../src/lexer/scan';
import { Parser } from '../../src/parser/parser';
import { Token } from '../../src/token';
import { type Options } from './../../src/options';

describe('Lexer - Identifiers', () => {
  const tokens: [Context, Token, string, string][] = [
    [Context.None, Token.Identifier, 'a', 'a'],
    [Context.None, Token.Identifier, 'A', 'A'],
    [Context.None, Token.Identifier, 'gy', 'gy'],
    [Context.None, Token.Identifier, 'M5', 'M5'],
    [Context.None, Token.Identifier, '$e', '$e'],
    [Context.None, Token.Identifier, '$A', '$A'],
    [Context.None, Token.Identifier, '_', '_'],
    [Context.None, Token.Identifier, '_$', '_$'],
    [Context.None, Token.Identifier, '__', '__'],
    [Context.None, Token.Identifier, '$x', '$x'],
    [Context.None, Token.Identifier, '$_', '$_'],
    [Context.None, Token.Identifier, '$$', '$$'],
    [Context.None, Token.Identifier, '$', '$'],
    [Context.None, Token.Identifier, '$i', '$i'],
    [Context.None, Token.Identifier, '_O', '_O'],
    [Context.None, Token.Identifier, '_r', '_r'],
    [Context.None, Token.Identifier, 'x_y', 'x_y'],
    [Context.None, Token.Identifier, 'xyz123', 'xyz123'],
    [Context.None, Token.Identifier, 'x1y1z1', 'x1y1z1'],
    [Context.None, Token.Identifier, 'a____123___b$', 'a____123___b$'],
    [Context.None, Token.Identifier, '_$$$$', '_$$$$'],
    [Context.None, Token.Identifier, '$$$$', '$$$$'],
    [Context.None, Token.Identifier, 'a1234', 'a1234'],
    [Context.None, Token.Identifier, 'a_______3333333', 'a_______3333333'],
    [Context.None, Token.Identifier, 'abc', 'abc'],
    [Context.None, Token.Identifier, '    $', '$'],
    [Context.None, Token.Identifier, '$8', '$8'],
    [Context.None, Token.Identifier, '/* skip */   $', '$'],
    [Context.None, Token.Identifier, 'CAN_NOT_BE_A_KEYWORD', 'CAN_NOT_BE_A_KEYWORD'],

    // IdentifierStart - Unicode 4.0

    [Context.None, Token.Identifier, '℘', '℘'],
    [Context.None, Token.Identifier, '℮', '℮'],
    [Context.None, Token.Identifier, '゛', '゛'],
    [Context.None, Token.Identifier, '゜', '゜'],

    // IdentifierStart - Unicode 9.0

    [Context.None, Token.Identifier, ' ᢅ', 'ᢅ'],
    [Context.None, Token.Identifier, ' ᢆ', 'ᢆ'],

    // Unicode escape sequence - classic

    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0070bc`, 'pbc'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`a\u0071c`, 'aqc'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`ab\u0072`, 'abr'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0024`, '$'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0078\u0078`, 'xx'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0024_`, '$_'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u005F\u005F`, '__'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u044D`, 'э'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0431`, 'б'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`ab\u0072`, 'abr'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`a\u2118`, 'a℘'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`a\u309C`, 'a゜'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u2118`, '℘'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u309C`, '゜'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u1886`, 'ᢆ'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`foo\u00d8bar`, 'fooØbar'], // Identifier With Unicode Escape Sequence (`\\uXXXX`)
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`f\u00d8\u00d8bar`, 'fØØbar'], // Identifier With Embedded Unicode Character

    // Long unicode escape

    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{70}bc`, 'pbc'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`$\u{32}`, '$2'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{70}bc\u{70}bc`, 'pbcpbc'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{070}bc`, 'pbc'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`ab\u{0072}`, 'abr'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`ab\u{00072}`, 'abr'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`ab\u{072}`, 'abr'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{4fff}`, '俿'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{222}`, 'Ȣ'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{1EE00}`, '𞸀'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`a\u{0000000000000000000071}c`, 'aqc'],

    // Keywords
    [Context.None, Token.BreakKeyword, 'break', 'break'],
    [Context.None, Token.Identifier, 'Yield', 'Yield'],
    [Context.None, Token.YieldKeyword, 'yield', 'yield'],
    [Context.None, Token.LetKeyword, 'let', 'let'],
    [Context.None, Token.PublicKeyword, 'public', 'public'],

    // Async is not reserved keyword
    [Context.None, Token.AnyIdentifier | Token.IsEscaped, String.raw`\u0061sync`, 'async'],
    [Context.Strict, Token.AnyIdentifier | Token.IsEscaped, String.raw`\u0061sync`, 'async'],

    // Escaped Keywords
    [Context.None, Token.EscapedReserved, String.raw`br\u0065ak`, 'break'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`Br\u0065ak`, 'Break'],
    [Context.Strict, Token.EscapedFutureReserved, String.raw`int\u0065rface`, 'interface'],
    [
      Context.None,
      Token.InterfaceKeyword | Token.Contextual | Token.IsEscaped,
      String.raw`int\u0065rface`,
      'interface',
    ],
    [Context.None, Token.YieldKeyword | Token.IsEscaped, String.raw`yi\u0065ld`, 'yield'],
    [Context.Strict, Token.EscapedReserved, String.raw`\u{64}ebugger`, 'debugger'],
    [Context.Strict, Token.EscapedReserved, String.raw`fina\u{6c}ly`, 'finally'],
    [Context.Strict, Token.EscapedReserved, String.raw`\u0069\u0066`, 'if'],
    [Context.None, Token.EscapedReserved, String.raw`\u{62}\u{72}\u{65}\u{61}\u{6b}`, 'break'],
    [Context.None, Token.EscapedReserved, String.raw`\u0063atch`, 'catch'],

    // Russian letters
    [Context.None, Token.Identifier, 'б', 'б'],
    [Context.None, Token.Identifier, 'е', 'е'],
    [Context.None, Token.Identifier, 'ц', 'ц'],

    // Escaped Russian letters
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0431`, 'б'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0434`, 'д'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u0447`, 'ч'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u004C`, 'L'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u004C`, 'L'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{413}`, 'Г'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{419}`, 'Й'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{424}`, 'Ф'],

    // Others

    [Context.None, Token.Identifier, 'a𐊧123', 'a𐊧123'],
    [Context.None, Token.Identifier, 'название', 'название'],
    [Context.None, Token.Identifier, 'دیوانه', 'دیوانه'],
    [Context.None, Token.Identifier, 'a℮', 'a℮'],
    [Context.None, Token.Identifier, 'aᢆ', 'aᢆ'],
    [Context.None, Token.Identifier, 'ᢆ', 'ᢆ'],
    [Context.None, Token.Identifier, 'a፰', 'a፰'],
    [Context.None, Token.Identifier, 'a℮', 'a℮'],
    [Context.None, Token.Identifier, '゛', '゛'],
    [Context.None, Token.Identifier, '℮', '℮'],
    [Context.None, Token.Identifier, '℘', '℘'],
    [Context.None, Token.Identifier, 'a᧚', 'a᧚'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`$00xxx\u0069\u0524\u{20BB7}`, '$00xxxiԤ𠮷'],

    // UTF-16 surrogate pairs.
    [Context.None, Token.Identifier, '𐌭', '𐌭'],
    [Context.None, Token.Identifier | Token.IsEscaped, String.raw`\u{1032d}`, '𐌭'],
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

  function fail(name: string, source: string, context: Context, options: Options = {}) {
    it(name, () => {
      const parser = new Parser(source, options);
      t.throws(() => scanSingleToken(parser, context, 0));
    });
  }

  fail(String.raw`fails on \{4fff}`, String.raw`\{4fff}`, Context.None);
  fail('fails on a🀒c', 'a🀒c', Context.None);
  fail('fails on a😍c', 'a😍c', Context.None);
  fail('fails on ፰', '፰', Context.None); // Invalid as IdentifierStart
  fail('fails on ᧚', '᧚', Context.None); // Invalid as IdentifierStart
  fail(String.raw`fails on \u007`, String.raw`\u007`, Context.Strict);
  fail(String.raw`fails on \u00`, String.raw`\u00`, Context.None);
  fail(String.raw`fails on \u044`, String.raw`\u044`, Context.None);
  fail(String.raw`fails on \u0`, String.raw`\u0`, Context.None);
  fail(String.raw`fails on \u`, String.raw`\u`, Context.None);
  fail('fails on \\', '\\', Context.None);
  fail('fails on \\', String.raw`\u2E2F`, Context.None);
  fail(String.raw`fails on \uD800`, String.raw`\uD800`, Context.None);
  fail(String.raw`fails on \uD83B\uDE00`, String.raw`\uD83B\uDE00`, Context.None);
  fail(String.raw`fails on \u007Xvwxyz`, String.raw`\u007Xvwxyz`, Context.None);
  fail(String.raw`fails on \u007Xvwxyz`, String.raw`\u007Xvwxyz`, Context.None);
  fail(String.raw`fails on \u00Xvwxyz`, String.raw`\u00Xvwxyz`, Context.None);
  fail(String.raw`fails on \u0Xvwxyz`, String.raw`\u0Xvwxyz`, Context.None);
  fail(String.raw`fails on \uXvwxyz`, String.raw`\uXvwxyz`, Context.None);
  fail(String.raw`fails on \Xvwxyz`, String.raw`\Xvwxyz`, Context.None);
  fail(String.raw`fails on abc\u007`, String.raw`abc\u007`, Context.None);
  fail(String.raw`fails on abc\u00`, String.raw`abc\u00`, Context.None);
  fail(String.raw`fails on abc\u0`, String.raw`abc\u0`, Context.Strict);
  fail(String.raw`fails on abc\u`, String.raw`abc\u`, Context.Strict);
  fail('fails on abc\\', 'abc\\', Context.Strict);
  fail(String.raw`fails on abc\u007Xvwxyz`, String.raw`abc\u007Xvwxyz;`, Context.Strict);
  fail(String.raw`fails on abc\u007Xvwxyz`, String.raw`abc\u007Xvwxyz`, Context.Strict);
  fail(String.raw`fails on abc\u00Xvwxyz`, String.raw`abc\u00Xvwxyz`, Context.Strict);
  fail(String.raw`fails on abc\u0Xvwxyz`, String.raw`abc\u0Xvwxyz`, Context.None, { next: true });
  fail(String.raw`fails on abc\uXvwxyz`, String.raw`abc\uXvwxyz`, Context.None, { next: true });
  fail('fails on `abc\\Xvwxyz', '`abc\\Xvwxyz', Context.None, { next: true });
  fail(String.raw`fails on \u00`, String.raw`\u00`, Context.None, { next: true });
  fail(String.raw`fails on \u007`, String.raw`\u007`, Context.None, { next: true });
  fail(String.raw`fails on \u007Xvwxyz`, String.raw`\u007Xvwxyz`, Context.None, { next: true });
  fail(String.raw`fails on abc\u{}`, String.raw`abc\u{}`, Context.None, { next: true });
  fail(String.raw`fails on abc\u{}`, String.raw`abc\u{}`, Context.None, { webcompat: true });
  fail(String.raw`fails on abc\u}`, String.raw`abc\u}`, Context.None, { next: true });
  fail(String.raw`fails on abc\u{`, String.raw`abc\u{`, Context.None, { next: true });
  fail(String.raw`fails on \u{70bc`, String.raw`\u{70bc`, Context.None, { next: true });
  fail(String.raw`fails on \u{70`, String.raw`\u{70`, Context.None, { next: true });
  fail(String.raw`fails on \u104`, String.raw`\u104`, Context.None);
  fail(String.raw`fails on \u{10401`, String.raw`\u{10401`, Context.None);
  fail(String.raw`fails on \u104`, String.raw`\u104`, Context.None);
  fail(String.raw`fails on \u{!`, String.raw`\u{!`, Context.None);
  fail(String.raw`fails on \u{}`, String.raw`\u{}`, Context.None);
  fail(String.raw`fails on \u}`, String.raw`\u}`, Context.None);
  fail(String.raw`fails on \}`, String.raw`\}`, Context.None);
  fail(String.raw`fails on \u`, String.raw`\u`, Context.None);
  fail(String.raw`fails on \u{4fff`, String.raw`\u{4fff`, Context.None);
  fail(String.raw`fails on \u{4ff`, String.raw`\u{4ff`, Context.None);
  fail(String.raw`fails on a\u{4fff`, String.raw`a\u{4fff`, Context.None);
  fail(String.raw`fails on a\u{4ff`, String.raw`a\u{4ff`, Context.None);
  fail(String.raw`fails on \u{!`, String.raw`\u{!`, Context.None);
  fail(String.raw`fails on \u{}`, String.raw`\u{}`, Context.None);
  fail(String.raw`fails on \u`, String.raw`\u`, Context.None);
  fail(String.raw`fails on \8`, String.raw`\8`, Context.None);
  fail(String.raw`fails on \9`, String.raw`\9`, Context.None);
  fail('fails on \\', '\\', Context.None);
  fail(String.raw`fails on \u0`, String.raw`\u0`, Context.None);
  fail(String.raw`fails on \u00`, String.raw`\u00`, Context.None);
  fail(String.raw`fails on \u00Xvwxyz`, String.raw`\u00Xvwxyz`, Context.None);
  fail(String.raw`fails on \u{10401`, String.raw`\u{10401`, Context.None);
  fail(String.raw`fails on \u{110000}`, String.raw`\u{110000}`, Context.None);
  fail(String.raw`fails on \u0x11ffff`, String.raw`\u0x11ffff`, Context.None);
  fail(String.raw`fails on \u{37}`, String.raw`\u{37}`, Context.None);
  fail(String.raw`fails on \ud800\udf2d`, String.raw`\ud800\udf2d`, Context.None);
});
