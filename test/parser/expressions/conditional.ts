import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Expressions - Conditional', () => {
  fail('Expressions - Conditional (fail)', ['a ? await x : c', 'a ? b : await c', 'a ? b : yield c']);

  pass('Expressions - Conditional (pass)', [
    { code: 'foo?.3:0', options: { next: true } },
    'foo?.3:0',
    'foo ? .3 : 0',
    'a ? b : c = d',
    { code: 'a ? b = d : c', options: { ranges: true } },
    { code: 'x = (0) ? 1 : 2', options: { ranges: true } },
    { code: '(y ? y : true)', options: { ranges: true } },
    '"1" ? y : ""',
    '("1" ? "" : "1")',
    { code: 'Symbol() ? 1 : 2, 1', options: { ranges: true } },
    '(false ? false : true)',
    'foo => bar ? zoo : doo',

    'true ? foo : bar',
    'a?b:c',
    { code: 'a === b ? c : d % e', options: { ranges: true } },
    'a=b?c:d',
    'a?b:c=d',
    'x && y ? a : b',
    { code: 'a === b ? c : d % e', options: { ranges: true } },
    'true ? y : false',
    '"1" ? "" : "1"',
    'true ? y : z',
    'Symbol() ? 1 : 2, 1',
    'x && y ? 1 : 2',
    'a ? !b : !c',

    'a?b=c:d',
    'a === b ? c : d % e;',
    'a=b?c:d',
    'a?b=c:d',
    { code: 'a ? !b : !c;', options: { ranges: true } },
  ]);
});
