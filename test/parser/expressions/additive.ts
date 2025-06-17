import { describe } from 'vitest';
import { pass } from '../../test-utils';

describe('Expressions - Additive', () => {
  pass('Expressions - Additive (pass)', [
    { code: 'async = a + await;  a = async++;', options: { webcompat: true } },
    { code: 'd = a + b;  a = b;', options: { ranges: true } },
    '--a',
  ]);
});
