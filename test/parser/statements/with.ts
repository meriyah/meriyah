import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - With', () => {
  fail('Statements - With (fail)', [
    ['with(1) b: function a(){}', Context.None],
    ['with ({}) async function f() {}', Context.None],
    ['with ({}) function f() {}', Context.None],
    ['with ({}) let x;', Context.None],
    ['with ({}) { }', Context.Strict],
    [`with (x) foo;`, Context.Strict],
    [`with ({}) let [a] = [42];`, Context.None],
    [`with ({}) let [a]`, Context.None],
    [`with ({}) let 1`, Context.None],
    [`with ({}) let []`, Context.None],
    [`while(true) let[a] = 0`, Context.None],
  ]);

  pass('Statements - With (pass)', [
    [
      'with ({}) let',
      Context.None,
      
    ],
    [
      'with ({}) { }',
      Context.None,
      
    ],
    [
      'with (x) foo;',
      Context.None,
      
    ],
    [
      'with (x) { foo }',
      Context.None,
      
    ],
    [
      'with (foo) bar;',
      Context.None,
      
    ],
  ]);
});
