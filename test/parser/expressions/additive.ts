import { describe } from 'vitest';
import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Expressions - Additive', () => {
  pass('Expressions - Additive (pass)', [
    ['async = a + await;  a = async++;', Context.OptionsWebCompat],
    ['d = a + b;  a = b;', Context.OptionsRanges],
    ['--a', Context.None],
  ]);
});
