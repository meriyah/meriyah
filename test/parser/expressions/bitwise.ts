import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Expressions - Conditional', () => {
  pass('Expressions - Conditional (pass)', [
    ['a&b', Context.OptionsRanges],
    ['a^b', Context.OptionsLoc],
    ['~a', Context.OptionsLoc],
    ['a>>b', Context.OptionsRanges],
    ['a|b', Context.None],

    ['a>>>b', Context.None],
    ['x != y', Context.None],
    ['x <= y', Context.None],
    ['x << y', Context.None],
  ]);
});
