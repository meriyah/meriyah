import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { type Context } from '../../src/common';
import { CharFlags, CharTypes } from '../../src/lexer/charClassifier';

describe('Lexer - charClassifier', () => {
  const tokens: [Context, number][] = [
    [CharFlags.LineTerminator, 10],
    [CharFlags.LineTerminator, 10],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 36],
    [CharFlags.IdentifierPart | CharFlags.Decimal, 48],
    [CharFlags.IdentifierPart | CharFlags.Decimal, 55],
    [CharFlags.None, 64],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 70],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 71],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 72],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 74],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 75],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 77],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 78],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 103],
    [CharFlags.IdentifierStart | CharFlags.IdentifierPart, 122],
  ];

  for (const [ctx, cp] of tokens) {
    it(`should recognise codepoint ${cp}`, () => {
      const found = CharTypes[cp];
      t.deepEqual(
        {
          char: true,
        },
        {
          char: (found & ctx) === ctx,
        },
      );
    });
  }
});
