import { describe } from 'vitest';
import { pass } from '../../test-utils';

describe('Expressions - Conditional', () => {
  pass('Expressions - Conditional (pass)', [
    { code: 'a&b', options: { ranges: true } },
    { code: 'a^b', options: { loc: true } },
    { code: '~a', options: { loc: true } },
    { code: 'a>>b', options: { ranges: true } },
    'a|b',

    'a>>>b',
    'x != y',
    'x <= y',
    'x << y',
  ]);
});
