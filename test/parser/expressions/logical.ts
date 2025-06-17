import { describe } from 'vitest';
import { pass } from '../../test-utils';

describe('Expressions - Logical', () => {
  pass('Expressions - Logical (pass)', [
    'a&&b',

    { code: 'a == b != c === d !== e', options: { ranges: true } },
    'a & b == c',
    'a == b != c === d !== e',
    'a !== b === c != d == e',
    'a == b & c',
    'a & b == c',

    'x / z',
    'a||b',
    'a < b == c',
    'a == b <= c',
    'a == b >= c',
    'a >= b !== c >= d',
    'a << b < c',
    'a < b << c',
    'a << b >> c >>> d',
    'a >>> b >> c << d',
    'a << b + c',
    'a + b - c',
    'a - b + c',
    'a * b / c % d',
    'a % b / c * d',
    'a ** b * c',
    'a ** b ** c',
    'a ** b ** c + d',
    'a ** b + c ** d',
    'a + b ** c ** d',
    'a + b ** c ** d',

    'a ** b',
    'x() ** b',
    'a + b + c',
    'a + b * c * d',
    'a * b + c * d',
    'a && b || c',
    'a || b && c',
    'a | b && c',
    'a && b | c',
    'x ? g / f : f * g',
    'x * y / z ? a : b',
    'a ^ b | c',
    'a | b ^ c',

    'x.y / z',
    'a[b, c]',
    'a[b]||(c[d]=e)',
    'a&&(b=c)',
  ]);
});
