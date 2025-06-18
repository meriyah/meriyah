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
    'foo\n++\nbar',
    '++\nfoo;',
    'foo\n++bar',
    '++\nfoo;',
    '"foo"\n++bar',
    '+a++ / 1',
    'a=b\n++c',
    'a,b\n++c',
    'a++\nb',
    'a\n++\nb',
    'a.a--',
    '++a.a',
    'foo\n++bar',
    '--a.a',
    '++foo',
    'bar++',
  ]);
});
