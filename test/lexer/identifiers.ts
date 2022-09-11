import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

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

    [Context.None, Token.Identifier, '\\u0070bc', 'pbc'],
    [Context.None, Token.Identifier, 'a\\u0071c', 'aqc'],
    [Context.None, Token.Identifier, 'ab\\u0072', 'abr'],
    [Context.None, Token.Identifier, '\\u0024', '$'],
    [Context.None, Token.Identifier, '\\u0078\\u0078', 'xx'],
    [Context.None, Token.Identifier, '\\u0024_', '$_'],
    [Context.None, Token.Identifier, '\\u005F\\u005F', '__'],
    [Context.None, Token.Identifier, '\\u044D', 'э'],
    [Context.None, Token.Identifier, '\\u0431', 'б'],
    [Context.None, Token.Identifier, 'ab\\u0072', 'abr'],
    [Context.None, Token.Identifier, 'a\\u2118', 'a℘'],
    [Context.None, Token.Identifier, 'a\\u309C', 'a゜'],
    [Context.None, Token.Identifier, '\\u2118', '℘'],
    [Context.None, Token.Identifier, '\\u309C', '゜'],
    [Context.None, Token.Identifier, '\\u1886', 'ᢆ'],
    [Context.None, Token.Identifier, 'foo\\u00d8bar', 'fooØbar'], // Identifier With Unicode Escape Sequence (`\\uXXXX`)
    [Context.None, Token.Identifier, 'f\u00d8\u00d8bar', 'fØØbar'], // Identifier With Embedded Unicode Character

    // Long unicode escape

    [Context.None, Token.Identifier, '\\u{70}bc', 'pbc'],
    [Context.None, Token.Identifier, '$\\u{32}', '$2'],
    [Context.None, Token.Identifier, '\\u{37}', '7'],
    [Context.None, Token.Identifier, '\\u{70}bc\\u{70}bc', 'pbcpbc'],
    [Context.None, Token.Identifier, '\\u{070}bc', 'pbc'],
    [Context.None, Token.Identifier, 'ab\\u{0072}', 'abr'],
    [Context.None, Token.Identifier, 'ab\\u{00072}', 'abr'],
    [Context.None, Token.Identifier, 'ab\\u{072}', 'abr'],
    [Context.None, Token.Identifier, '\\u{4fff}', '俿'],
    [Context.None, Token.Identifier, '\\u{222}', 'Ȣ'],
    [Context.None, Token.Identifier, '\\u{1EE00}', '{Ȁ'],
    [Context.None, Token.Identifier, 'a\\u{0000000000000000000071}c', 'aqc'],

    // Keywords
    [Context.None, Token.BreakKeyword, 'break', 'break'],
    [Context.None, Token.Identifier, 'Yield', 'Yield'],
    [Context.None, Token.YieldKeyword, 'yield', 'yield'],
    [Context.None, Token.LetKeyword, 'let', 'let'],
    [Context.None, Token.PublicKeyword, 'public', 'public'],

    // Async is not reserved keyword
    [Context.None, Token.AnyIdentifier, '\\u0061sync', 'async'],
    [Context.Strict, Token.AnyIdentifier, '\\u0061sync', 'async'],

    // Escaped Keywords
    [Context.None, Token.EscapedReserved, 'br\\u0065ak', 'break'],
    [Context.None, Token.Identifier, 'Br\\u0065ak', 'Break'],
    [Context.Strict, Token.EscapedFutureReserved, 'int\\u0065rface', 'interface'],
    [Context.None, Token.InterfaceKeyword, 'int\\u0065rface', 'interface'],
    [Context.None, Token.YieldKeyword, 'yi\\u0065ld', 'yield'],
    [Context.Strict, Token.EscapedReserved, '\\u{64}ebugger', 'debugger'],
    [Context.Strict, Token.EscapedReserved, 'fina\\u{6c}ly', 'finally'],
    [Context.Strict, Token.EscapedReserved, '\\u0069\\u0066', 'if'],
    [Context.None, Token.EscapedReserved, '\\u{62}\\u{72}\\u{65}\\u{61}\\u{6b}', 'break'],
    [Context.None, Token.EscapedReserved, '\\u0063atch', 'catch'],

    // Russian letters
    [Context.None, Token.Identifier, 'б', 'б'],
    [Context.None, Token.Identifier, 'е', 'е'],
    [Context.None, Token.Identifier, 'ц', 'ц'],

    // Escaped Russian letters
    [Context.None, Token.Identifier, '\\u0431', 'б'],
    [Context.None, Token.Identifier, '\\u0434', 'д'],
    [Context.None, Token.Identifier, '\\u0447', 'ч'],
    [Context.None, Token.Identifier, '\\u004C', 'L'],
    [Context.None, Token.Identifier, '\\u004C', 'L'],
    [Context.None, Token.Identifier, '\\u{413}', 'Г'],
    [Context.None, Token.Identifier, '\\u{419}', 'Й'],
    [Context.None, Token.Identifier, '\\u{424}', 'Ф'],

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
    [Context.None, Token.Identifier, '$00xxx\\u0069\\u0524\\u{20BB7}', '$00xxxiԤη']
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

  fail('fails on \\{4fff}', '\\{4fff}', Context.None);
  fail('fails on a🀒c', 'a🀒c', Context.None);
  fail('fails on a😍c', 'a😍c', Context.None);
  fail('fails on ፰', '፰', Context.None); // Invalid as IdentifierStart
  fail('fails on ᧚', '᧚', Context.None); // Invalid as IdentifierStart
  fail('fails on \\u007', '\\u007', Context.Strict);
  fail('fails on \\u00', '\\u00', Context.None);
  fail('fails on \\u044', '\\u044', Context.None);
  fail('fails on \\u0', '\\u0', Context.None);
  fail('fails on \\u', '\\u', Context.None);
  fail('fails on \\', '\\', Context.None);
  fail('fails on \\', '\\u2E2F', Context.None);
  fail('fails on \\uD800', '\\uD800', Context.None);
  fail('fails on \\uD83B\\uDE00', '\\uD83B\\uDE00', Context.None);
  fail('fails on \\u007Xvwxyz', '\\u007Xvwxyz', Context.None);
  fail('fails on \\u007Xvwxyz', '\\u007Xvwxyz', Context.None);
  fail('fails on \\u00Xvwxyz', '\\u00Xvwxyz', Context.None);
  fail('fails on \\u0Xvwxyz', '\\u0Xvwxyz', Context.None);
  fail('fails on \\uXvwxyz', '\\uXvwxyz', Context.None);
  fail('fails on \\Xvwxyz', '\\Xvwxyz', Context.None);
  fail('fails on abc\\u007', 'abc\\u007', Context.None);
  fail('fails on abc\\u00', 'abc\\u00', Context.None);
  fail('fails on abc\\u0', 'abc\\u0', Context.Strict);
  fail('fails on abc\\u', 'abc\\u', Context.Strict);
  fail('fails on abc\\', 'abc\\', Context.Strict);
  fail('fails on abc\\u007Xvwxyz', 'abc\\u007Xvwxyz;', Context.Strict);
  fail('fails on abc\\u007Xvwxyz', 'abc\\u007Xvwxyz', Context.Strict);
  fail('fails on abc\\u00Xvwxyz', 'abc\\u00Xvwxyz', Context.Strict);
  fail('fails on abc\\u0Xvwxyz', 'abc\\u0Xvwxyz', Context.OptionsNext);
  fail('fails on abc\\uXvwxyz', 'abc\\uXvwxyz', Context.OptionsNext);
  fail('fails on `abc\\Xvwxyz', '`abc\\Xvwxyz', Context.OptionsNext);
  fail('fails on \\u00', '\\u00', Context.OptionsNext);
  fail('fails on \\u007', '\\u007', Context.OptionsNext);
  fail('fails on \\u007Xvwxyz', '\\u007Xvwxyz', Context.OptionsNext);
  fail('fails on abc\\u{}', 'abc\\u{}', Context.OptionsNext);
  fail('fails on abc\\u{}', 'abc\\u{}', Context.OptionsWebCompat);
  fail('fails on abc\\u}', 'abc\\u}', Context.OptionsNext);
  fail('fails on abc\\u{', 'abc\\u{', Context.OptionsNext);
  fail('fails on \\u{70bc', '\\u{70bc', Context.OptionsNext);
  fail('fails on \\u{70', '\\u{70', Context.OptionsNext);
  fail('fails on \\u104', '\\u104', Context.None);
  fail('fails on \\u{10401', '\\u{10401', Context.None);
  fail('fails on \\u104', '\\u104', Context.None);
  fail('fails on \\u{!', '\\u{!', Context.None);
  fail('fails on \\u{}', '\\u{}', Context.None);
  fail('fails on \\u}', '\\u}', Context.None);
  fail('fails on \\}', '\\}', Context.None);
  fail('fails on \\u', '\\u', Context.None);
  fail('fails on \\u{4fff', '\\u{4fff', Context.None);
  fail('fails on \\u{4ff', '\\u{4ff', Context.None);
  fail('fails on a\\u{4fff', 'a\\u{4fff', Context.None);
  fail('fails on a\\u{4ff', 'a\\u{4ff', Context.None);
  fail('fails on \\u{!', '\\u{!', Context.None);
  fail('fails on \\u{}', '\\u{}', Context.None);
  fail('fails on \\u', '\\u', Context.None);
  fail('fails on \\8', '\\8', Context.None);
  fail('fails on \\9', '\\9', Context.None);
  fail('fails on \\', '\\', Context.None);
  fail('fails on \\u0', '\\u0', Context.None);
  fail('fails on \\u00', '\\u00', Context.None);
  fail('fails on \\u00Xvwxyz', '\\u00Xvwxyz', Context.None);
  fail('fails on \\u{10401', '\\u{10401', Context.None);
  fail('fails on \\u{110000}', '\\u{110000}', Context.None);
  fail('fails on \\u0x11ffff', '\\u0x11ffff', Context.None);
});
