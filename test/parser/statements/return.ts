import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Return', () => {
  fail('Statements - Return (fail)', [
    ['return', Context.None],
    ['() => return', Context.None],
    ['*() => {return}', Context.None],
  ]);

  pass('Statements - Return (pass)', [
    [
      'function a() { return a, b, c; }',
      Context.OptionsRanges,
      
    ],
    [
      'x => {return}',
      Context.None,
      
    ],
    [
      '(a, b) => {return}',
      Context.None,
      
    ],
    [
      'function *f() { return }',
      Context.None,
      
    ],
    [
      '{return}',
      Context.InReturnContext,
      
    ],
    [
      'function f(){   {return}    }',
      Context.None,
      
    ],
    [
      'function f(){   return 15;    }',
      Context.None,
      
    ],
    [
      'function *f() { return }',
      Context.None,
      
    ],
    [
      'async function f(){ return; }',
      Context.None,
      
    ],
    [
      'class x { constructor(){ return }}',
      Context.None,
      
    ],
    [
      'class x {foo(){ return }}',
      Context.None,
      
    ],
    [
      '() => {return}',
      Context.None,
      
    ],
    [
      'function f(){   return;return    };',
      Context.None,
      
    ],
    [
      'function f(){   return\nreturn   }',
      Context.None,
      
    ],
    [
      `//
      function a() {
          return;
      };`,
      Context.None,
      
    ],
    [
      'function a(x) { return x+y; }',
      Context.OptionsLoc | Context.OptionsRanges,
      
    ],
  ]);
});
