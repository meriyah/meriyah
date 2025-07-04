import { outdent } from 'outdent';
import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Statements - Return', () => {
  fail('Statements - Return (fail)', ['return', '() => return', '*() => {return}']);

  pass('Statements - Return (pass)', [
    { code: 'function a() { return a, b, c; }', options: { ranges: true } },
    'x => {return}',
    '(a, b) => {return}',
    'function *f() { return }',
    { code: '{return}', options: { sourceType: 'commonjs' } },
    'function f(){   {return}    }',
    'function f(){   return 15;    }',
    'function *f() { return }',
    'async function f(){ return; }',
    'class x { constructor(){ return }}',
    'class x {foo(){ return }}',
    '() => {return}',
    'function f(){   return;return    };',
    'function f(){   return\nreturn   }',
    outdent`
      //
      function a() {
          return;
      };
    `,
    { code: 'function a(x) { return x+y; }', options: { loc: true, ranges: true } },
  ]);
});
