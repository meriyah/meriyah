import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Statements - With', () => {
  fail('Statements - With (fail)', [
    'with(1) b: function a(){}',
    'with ({}) async function f() {}',
    'with ({}) function f() {}',
    'with ({}) let x;',
    { code: 'with ({}) { }', options: { impliedStrict: true } },
    { code: 'with (x) foo;', options: { impliedStrict: true } },
    'with ({}) let [a] = [42];',
    'with ({}) let [a]',
    'with ({}) let 1',
    'with ({}) let []',
    'while(true) let[a] = 0',
  ]);

  pass('Statements - With (pass)', [
    'with ({}) let',
    'with ({}) { }',
    'with (x) foo;',
    'with (x) { foo }',
    'with (foo) bar;',
  ]);
});
