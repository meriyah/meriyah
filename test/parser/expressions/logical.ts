import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Expressions - Logical', () => {
  pass('Expressions - Logical (pass)', [
    [
      'a&&b',
      Context.None,
      
    ],

    [
      'a == b != c === d !== e',
      Context.OptionsRanges,
      
    ],
    [
      'a & b == c',
      Context.None,
      
    ],
    [
      'a == b != c === d !== e',
      Context.None,
      
    ],
    [
      'a !== b === c != d == e',
      Context.None,
      
    ],
    [
      'a == b & c',
      Context.None,
      
    ],
    [
      'a & b == c',
      Context.None,
      
    ],

    [
      'x / z',
      Context.None,
      
    ],
    [
      'a||b',
      Context.None,
      
    ],
    [
      'a < b == c',
      Context.None,
      
    ],
    [
      'a == b <= c',
      Context.None,
      
    ],
    [
      'a == b >= c',
      Context.None,
      
    ],
    [
      'a >= b !== c >= d',
      Context.None,
      
    ],
    [
      'a << b < c',
      Context.None,
      
    ],
    [
      'a < b << c',
      Context.None,
      
    ],
    [
      'a << b >> c >>> d',
      Context.None,
      
    ],
    [
      'a >>> b >> c << d',
      Context.None,
      
    ],
    [
      'a << b + c',
      Context.None,
      
    ],
    [
      'a + b - c',
      Context.None,
      
    ],
    [
      'a - b + c',
      Context.None,
      
    ],
    [
      'a * b / c % d',
      Context.None,
      
    ],
    [
      'a % b / c * d',
      Context.None,
      
    ],
    [
      'a ** b * c',
      Context.None,
      
    ],
    [
      'a ** b ** c',
      Context.None,
      
    ],
    [
      'a ** b ** c + d',
      Context.None,
      
    ],
    [
      'a ** b + c ** d',
      Context.None,
      
    ],
    [
      'a + b ** c ** d',
      Context.None,
      
    ],
    [
      'a + b ** c ** d',
      Context.None,
      
    ],

    [
      'a ** b',
      Context.None,
      
    ],
    [
      'x() ** b',
      Context.None,
      
    ],
    [
      'a + b + c',
      Context.None,
      
    ],
    [
      'a + b * c * d',
      Context.None,
      
    ],
    [
      'a * b + c * d',
      Context.None,
      
    ],
    [
      'a && b || c',
      Context.None,
      
    ],
    [
      'a || b && c',
      Context.None,
      
    ],
    [
      'a | b && c',
      Context.None,
      
    ],
    [
      'a && b | c',
      Context.None,
      
    ],
    [
      'x ? g / f : f * g',
      Context.None,
      
    ],
    [
      'x * y / z ? a : b',
      Context.None,
      
    ],
    [
      'a ^ b | c',
      Context.None,
      
    ],
    [
      'a | b ^ c',
      Context.None,
      
    ],

    [
      'x.y / z',
      Context.None,
      
    ],
    [
      'a[b, c]',
      Context.None,
      
    ],
    [
      'a[b]||(c[d]=e)',
      Context.None,
      
    ],
    [
      'a&&(b=c)',
      Context.None,
      
    ],
  ]);
});
