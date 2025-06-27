import { describe } from 'vitest';
import { pass, fail } from '../../test-utils';

describe('Statements - Return', () => {
  fail('Statements - Return (fail)', [
    'return',
    '() => return',
    '*() => {return}',
    // https://github.com/acornjs/acorn/issues/1376#issuecomment-2960924476
    { code: 'class X { static { return; } }', options: { globalReturn: true } },
    // The following should be allowed in CommonJS
    // https://github.com/acornjs/acorn/issues/1376#issuecomment-2960396571
    { code: 'new.target', options: { globalReturn: true } },
    { code: 'using foo = null', options: { globalReturn: true, next: true } },
  ]);

  pass('Statements - Return (pass)', [
    { code: 'function a() { return a, b, c; }', options: { ranges: true } },
    'x => {return}',
    '(a, b) => {return}',
    'function *f() { return }',
    { code: '{return}', options: { globalReturn: true } },
    'function f(){   {return}    }',
    'function f(){   return 15;    }',
    'function *f() { return }',
    'async function f(){ return; }',
    'class x { constructor(){ return }}',
    'class x {foo(){ return }}',
    '() => {return}',
    'function f(){   return;return    };',
    'function f(){   return\nreturn   }',
    `//
      function a() {
          return;
      };`,
    { code: 'function a(x) { return x+y; }', options: { loc: true, ranges: true } },
  ]);
});
