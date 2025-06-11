import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Expressions - Conditional', () => {
  fail('Expressions - Conditional (fail)', [
    ['a ? await x : c', Context.None],
    ['a ? b : await c', Context.None],
    ['a ? b : yield c', Context.None],
  ]);

  pass('Expressions - Conditional (pass)', [
    ['foo?.3:0', Context.OptionsNext],
    ['foo?.3:0', Context.None],
    ['foo ? .3 : 0', Context.None],
    ['a ? b : c = d', Context.None],
    ['a ? b = d : c', Context.OptionsRanges],
    ['x = (0) ? 1 : 2', Context.OptionsRanges],
    ['(y ? y : true)', Context.OptionsRanges],
    ['"1" ? y : ""', Context.None],
    ['("1" ? "" : "1")', Context.None],
    ['Symbol() ? 1 : 2, 1', Context.OptionsRanges],
    ['(false ? false : true)', Context.None],
    ['foo => bar ? zoo : doo', Context.None],

    ['true ? foo : bar', Context.None],
    ['a?b:c', Context.None],
    ['a === b ? c : d % e', Context.OptionsRanges],
    ['a=b?c:d', Context.None],
    ['a?b:c=d', Context.None],
    ['x && y ? a : b', Context.None],
    ['a === b ? c : d % e', Context.OptionsRanges],
    ['true ? y : false', Context.None],
    ['"1" ? "" : "1"', Context.None],
    ['true ? y : z', Context.None],
    ['Symbol() ? 1 : 2, 1', Context.None],
    ['x && y ? 1 : 2', Context.None],
    ['a ? !b : !c', Context.None],

    ['a?b=c:d', Context.None],
    ['a === b ? c : d % e;', Context.None],
    ['a=b?c:d', Context.None],
    ['a?b=c:d', Context.None],
    ['a ? !b : !c;', Context.OptionsRanges],
  ]);
});
