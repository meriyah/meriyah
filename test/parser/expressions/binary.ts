import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';
describe('Expressions - Binary', () => {
  for (const arg of [
    '(-1) = a',
    '(- 0) = a',
    '1 = a',
    '(-1) *= a',
    '(- 0) *= a',
    '1 *= a',
    '(-1) /= a',
    '++(a + b)',
    '(a = b) <<= c',
    'a + b %= c',
    '(a = b) /= c',
    '(- 0) /= a',
    '1 /= a',
    '(-1) %= a',
    '(- 0) %= a',
    '1 %= a',
    '(-1) += a',
    '(- 0) += a',
    '1 += a',
    '(-1) -= a',
    '(- 0) -= a',
    '1 -= a',
    '(-1) <<= a',
    '(- 0) <<= a',
    '1 <<= a',
    '(-1) >>= a',
    '(- 0) >>= a',
    '1 >>= a',
    '(-1) >>>= a',
    '(- 0) >>>= a',
    '1 >>>= a',
    '(-1) &= a',
    '(- 0) &= a',
    '1 &= a',
    '(-1) ^= a',
    '(- 0) ^= a',
    '1 ^= a',
    '(-1) |= a',
    '(- 0) |= a',
    '1 |= a',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    '(a * b * c)',
    '(a * b) * c',
    'a * (b * c)',
    'a * b + c',
    '(a * b) + c',
    'a * (b + c)',
    'a * b - c',
    '(a * b) - c',
    'a * (b - c)',
    'a / b / c',
    '(a / b) / c',
    'a / (b / c)',
    'a * b / c',
    '(a * b) / c',
    'a * (b / c)',
    'a / b + c',
    '(a / b) + c',
    'a / (b + c)',
    'a % b % c',
    '(a % b) % c',
    'a % (b % c)',
    'a * b % c',
    '(a * b) % c',
    'a * (b % c)',
    'a % b + c',
    '(a % b) + c',
    'a % (b + c)',
    'a + b + c',
    '(a + b) + c',
    'a + (b + c)',
    'a + b << c',
    '(a + b) << c',
    'a + (b << c)',
    'a + b >> c',
    '(a + b) >> c',
    'a + (b >> c)',
    'a + b >>> c',
    '(a + b) >>> c',
    'a + (b >>> c)',
    'a - b - c',
    '(a - b) - c',
    'a - (b - c)',
    'a + b - c',
    'a << (b << c)',
    'a << b instanceof c',
    '(a << b) instanceof c',
    'a << (b instanceof c)',
    'a << b in c',
    '(a << b) in c',
    'a << (b in c)',
    'a >> b >> c',
    '(a >> b) >> c',
    'a >> (b >> c)',
    'a << b >> c',
    '(a << b) >> c',
    'a << (b >> c)',
    'a >> b < c',
    '(a >> b) < c',
    'a >> (b < c)',
    'a >>> b >>> c',
    '(a >>> b) >>> c',
    'a >>> (b >>> c)',
    'a << b >>> c',
    '(a << b) >>> c',
    'a << (b >>> c)',
    'a >>> b < c',
    '(a >>> b) < c',
    'a >>> (b < c)',
    'a < b < c',
    '(a < b) < c',
    'a < (b < c)',
    'a < b == c',
    '(a < b) == c',
    'a < (b == c)',
    'a < b != c',
    '(a < b) != c',
    'a < (b != c)',
    'a < b === c',
    '(a < b) === c',
    'a < (b === c)',
    'a < b !== c',
    '(a < b) !== c',
    'a < (b !== c)',
    'a > b > c',
    'a in (b == c)',
    'a == b == c',
    '(a == b) == c',
    'a == (b == c)',
    'a == b & c',
    '(a == b) & c',
    'a == (b & c)',
    'a != b != c',
    '(a != b) != c',
    'a != (b != c)',
    'a == b != c',
    '(a == b) != c',
    'a == (b != c)',
    'a != b & c',
    '(a != b) & c',
    'a != (b & c)',
    'a === b === c',
    '(a === b) === c',
    'a === (b === c)',
    'a == b === c',
    'a & b & c',
    '(a & b) & c',
    'a & (b & c)',
    'a & b ^ c',
    '(a & b) ^ c',
    'a & (b ^ c)',
    'a ^ b ^ c',
    '(a ^ b) ^ c',
    'a ^ (b ^ c)',
    'a ^ b | c',
    '(a ^ b) | c',
    'a ^ (b | c)',
    'a | b | c',
    'a + (b /= c)',
    'a %= b %= c',
    'a << b < c',
    '(a << b) < c',
    'a << (b < c)',
    'a << b > c',
    '(a << b) > c',
    'a << (b > c)',
    'a >>= b + c',
    '(a >>= b) + c',
    'a >>= (b + c)',
    'a &= b + c',
    '(a &= b) + c',
    'a &= (b + c)',
    'a + (b |= c)',
    'delete (a + b)',
    'void a + b',
    '(void a) + b',
    'void (a + b)',
    '!void a',
    '!(void a)',
    'typeof a + b',
    '(typeof a) + b',
    'typeof (a + b)',
    '!typeof a',
    '!(typeof a)',
    '++a + b',
    '(++a) + b',
    '(-1).a',
    '(-1).a = b',
    '(-1).a += b',
    '(-1).a++',
    '++(-1).a',
    '(-1).a()',
    '(- 0)[a]',
    '(- 0)[a] = b',
    '(- 0)[a] += b',
    '(- 0)[a]++',
    '++(- 0)[a]',
    '(- 0)[a]()',
    'new (- 0)()',
    '(- 0).a',
    '(- 0).a = b',
    '(- 0).a += b',
    '(- 0).a++',
    '++(- 0).a',
    '(- 0).a()',
    '(1)[a]',
    '(1)[a] = b',
    '(1)[a] += b',
    '(1)[a]++',
    '++(1)[a]',
    '(1)[a]()',
    'new (1)()',
    '(1).a',
    '(1).a = b',
    '(1).a += b',
    '(1).a++',
    '++(1).a',
    '(1).a()',
    '({ }).x',
    'x = { }',
    '(function () { })()',
    'x = function () { }',
    'var a',
    'var a = 1',
    'var a, b',
    'var a = 1, b = 2',
    'var a, b, c',
    'var a = 1, b = 2, c = 3',
    'const a = 1',
    'const a = (1, 2)',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  pass('Expressions - Binary (pass)', [
    [
      '1+2;',
      Context.None,
      
    ],
    [
      'x - y + z',
      Context.None,
      
    ],
    [
      'x + y * z',
      Context.None,
      
    ],
    [
      'x * y % z',
      Context.None,
      
    ],
    [
      '++x ** y',
      Context.OptionsRanges,
      
    ],
    [
      '-(x ** y)',
      Context.OptionsRanges,
      
    ],
    [
      'x in y',
      Context.None,
      
    ],
    [
      'b && c == d',
      Context.OptionsRanges,
      
    ],

    [
      'a=b+=c-=d**=e*=f/=g%=h<<=i>>=j>>>=k&=l^=m|=n',
      Context.OptionsRanges,
      
    ],
    [
      'a|=b^=c&=d>>>=e>>=f<<=g%=h/=i*=j**=k-=l+=m=n',
      Context.OptionsRanges,
      
    ],
    [
      'a || b || c',
      Context.OptionsRanges,
      
    ],
    [
      'a && b && c',
      Context.OptionsRanges,
      
    ],
    [
      'a && b || c',
      Context.None,
      
    ],
    [
      'a || b && c',
      Context.OptionsLoc,
      
    ],
    [
      'a ^ b | c',
      Context.OptionsLoc,
      
    ],
    [
      'a == b != c === d !== e',
      Context.OptionsRanges,
      
    ],
    [
      `var a = {b: 'u' + 1 }`,
      Context.None | Context.OptionsRanges | Context.OptionsLoc,
      
    ],
  ]);
});
