import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - BigInt', () => {
  fail('Next - BigInt', [
    ['2017.8n;', Context.OptionsNext],
    ['.0000000001n;', Context.OptionsNext],
    ['(0b2n);', Context.OptionsNext],
    ['x = 0e0n;', Context.OptionsNext]
  ]);

  for (const arg of [
    'let x = 2n ** 30n - 1n;',
    'let x = 2n ** 30n;',
    '-4n',
    '-9007199254740992n',
    '(-9007199254740992n)',
    'a(-b.c - 3n) === -9007199254740994n',
    '1n + 1;',
    '1n + Object(1);',
    '1n + true;',
    '1 & Object(1n)',
    ' NaN | 1n;',
    'a(0b101n) << b(1n)',
    '0n << 128n === 0n',
    '0x246n << 127n === 0x12300000000000000000000000000000000n',
    '0b101n << 1n === 0b1010n',
    '0x246n << 0n === 0x246n',
    '0x123456789abcdef0fedcba9876543212345678n << -128n, 0x123456n',
    '-0x246n << 127n === -0x12300000000000000000000000000000000n',
    '-0x123456789abcdef0fedcba9876543212345678n << 64n, -0x123456789abcdef0fedcba98765432123456780000000000000000n',
    '-1n >>> -128n;',
    'a(1, 3n), -1n;',
    'a.b(BigInt(-9007199254740991), -9007199254740991n);',
    '(("0xf", 0), 0xfn);',
    'a(Number(0n), 0);',
    'let {} = 0n;',
    '() => 1n / 0n',
    'a(1n != false);',
    '() => 1n ** -1n',
    '1n >= 1',
    'a(0n <= 1);',
    'a(1 <= 1n);'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Strict | Context.Module);
      });
    });
  }
});
