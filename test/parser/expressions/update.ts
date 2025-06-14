import { describe } from 'vitest';
import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Expressions - Update', () => {
  fail('Expressions - Update (fail)', [
    ['foo\n++', Context.None],
    ['if (foo\n++);', Context.None],
    /*['++[]', Context.None],
    ['++([])', Context.None],
    ['(++[])', Context.None],
    ['++[a]', Context.None],
    ['[a]++', Context.None],
    ['[]++', Context.None]*/
  ]);
  pass('Expressions - Update (pass)', [
    ['foo\n++\nbar', Context.None],
    ['++\nfoo;', Context.None],
    ['foo\n++bar', Context.None],
    ['++\nfoo;', Context.None],
    ['"foo"\n++bar', Context.None],
    ['+a++ / 1', Context.None],
    ['a=b\n++c', Context.None],
    ['a,b\n++c', Context.None],
    ['a++\nb', Context.None],
    ['a\n++\nb', Context.None],
    ['a.a--', Context.None],
    ['++a.a', Context.None],
    ['foo\n++bar', Context.None],
    ['--a.a', Context.None],
    ['++foo', Context.None],
    ['bar++', Context.None],
  ]);
});
