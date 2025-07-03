import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Lexical - Block', () => {
  fail('Lexical - Block (fail)', [
    { code: '{ function f(){} function f(){} }', options: { lexical: true } },
    { code: '{ async function f(){} function f(){} }', options: { lexical: true } },
    { code: '{ async function f(){} async function f(){} }', options: { lexical: true } },
    { code: '{ function f(){} async function f(){} }', options: { lexical: true } },
    { code: 'var x = a; function x(){};', options: { lexical: true, sourceType: 'module' } },
    { code: 'let x; { var x; }', options: { lexical: true } },
    { code: '{ var x; } let x;', options: { lexical: true } },
    { code: 'let x; var x;', options: { lexical: true } },
    { code: 'var x; let x;', options: { lexical: true } },
    { code: '{ async function f() {} async function f() {} }', options: { lexical: true } },
    { code: '{ { var f; } function* f() {}; }', options: { lexical: true } },

    { code: '{ async function f() {} async function f() {} }', options: { lexical: true } },
    { code: '{ async function f() {} class f {} }', options: { lexical: true } },
    { code: '{ async function f() {} function f() {} }', options: { lexical: true } },
    { code: '{ async function f() {} function f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ async function f() {} function* f() {} }', options: { lexical: true } },
    { code: '{ async function f() {} function* f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ const f = 0; function* f() {} }', options: { lexical: true } },
    { code: 'function x() { { async function* f() {}; var f; } }', options: { lexical: true } },
    { code: 'function x() { { const f = 0; var f; } }', options: { lexical: true } },
    { code: '{ { var f; } let f; }', options: { webcompat: true, lexical: true } },
    { code: '{ let f; { var f; } }', options: { webcompat: true, lexical: true } },
    { code: '{ let f; function* f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ async function f() {} let f }', options: { webcompat: true, lexical: true } },
    { code: '{ async function f() {} var f }', options: { webcompat: true, lexical: true } },
    { code: '{ async function* f() {} const f = 0 }', options: { webcompat: true, lexical: true } },
    { code: '{ { var f; } async function f() {}; }', options: { webcompat: true, lexical: true } },
    { code: '{ { var f; } class f {}; }', options: { impliedStrict: true, webcompat: true, lexical: true } },
    { code: '{ { var f; } let f; }', options: { lexical: true } },
    { code: '{ let f; { var f; } }', options: { lexical: true } },
    { code: '{ let f; function* f() {} }', options: { lexical: true } },
    { code: '{ async function f() {} let f }', options: { lexical: true } },
    { code: '{ async function f() {} var f }', options: { lexical: true } },
    { code: '{ function a(){} function a(){} }', options: { lexical: true } },
    { code: '{ function f() {} async function* f() {} }', options: { lexical: true } },
    { code: '{ function f() {} async function* f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ async function* f() {} async function* f() {} }', options: { lexical: true } },
    { code: '{ async function* f() {} const f = 0 }', options: { lexical: true } },
    { code: '{ { var f; } async function f() {}; }', options: { lexical: true } },
    { code: '{ { var f; } class f {}; }', options: { lexical: true } },
    { code: '{ class f {} async function f() {} }', options: { lexical: true } },
    { code: '{ const f = 0; { var f; } }', options: { lexical: true } },
    { code: '{ const f = 0; const f = 0 }', options: { lexical: true } },
    { code: '{ const f = 0; { var f; } }', options: { impliedStrict: true, webcompat: true, lexical: true } },
    { code: '{ const f = 0; const f = 0 }', options: { impliedStrict: true, webcompat: true, lexical: true } },
    { code: '{ class f {} function f() {} }', options: { lexical: true } },
    { code: '{ class f {} var f }', options: { lexical: true } },
    { code: '{ const f = 0; async function* f() {} }', options: { lexical: true } },
    { code: '{ const f = 0; async function* f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ const f = 0; class f {} }', options: { lexical: true } },
    { code: '{ const f = 0; let f }', options: { lexical: true } },
    { code: '{ const f = 0; var f }', options: { lexical: true } },
    { code: '{ function f() {} async function f() {} }', options: { lexical: true } },
    { code: '{ function f() {} function f() {} }', options: { impliedStrict: true, lexical: true } },
    { code: '{ function f() {} let f }', options: { lexical: true } },
    { code: '{ { var f; } function f() {} }', options: { lexical: true } },
    { code: '{ { var f; } async function* f() {}; }', options: { lexical: true } },
    { code: '{ { var f; } const f = 0; }', options: { lexical: true } },
    { code: '{ let f; class f {} }', options: { lexical: true } },
    { code: '{ let f; function f() {} }', options: { lexical: true } },
    { code: '{ let f; let f }', options: { lexical: true } },
    { code: '{ var f; async function* f() {} }', options: { lexical: true } },
    { code: '{ var f; const f = 0 }', options: { lexical: true } },
    { code: '{ var f; function* f() {} }', options: { lexical: true } },
    { code: '{ async function f() {}; var f; }', options: { lexical: true } },
    { code: '{ class f {}; var f; }', options: { lexical: true } },
    { code: '{ function* f() {}; var f; }', options: { lexical: true } },
    { code: '{ let f; var f; }', options: { lexical: true } },
    { code: '{ class f {}; var f; }', options: { webcompat: true, lexical: true } },
    { code: '{ function* f() {}; var f; }', options: { webcompat: true, lexical: true } },
    { code: '{ let f; var f; }', options: { webcompat: true, lexical: true } },
    { code: 'for (const x in {}) { var x; }', options: { lexical: true } },
    { code: '{ async function f() {} let f }', options: { lexical: true } },
    { code: '{ async function* f() {} async function f() {} }', options: { lexical: true } },
    { code: '{ async function* f() {} async function f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ async function* f() {} var f }', options: { lexical: true } },
    { code: '{ class f {} const f = 0 }', options: { lexical: true } },
    { code: '{ const f = 0; async function f() {} }', options: { lexical: true } },
    { code: '{ function* f() {} let f }', options: { lexical: true } },
    { code: '{ function* f() {} class f {} }', options: { lexical: true } },
    { code: '{ for (var x;;); const x = 1 }', options: { lexical: true } },
    { code: '{ function* f() {} async function f() {} }', options: { lexical: true } },
    { code: '{ function* f() {} async function f() {} }', options: { webcompat: true, lexical: true } },
    { code: 'function g() { { function f() {} { var f; } }}', options: { lexical: true } },
    { code: 'function x() { { function* f() {}; var f; } }', options: { lexical: true } },
    { code: 'function x() { { async function* f() {}; var f; } }', options: { lexical: true } },
    { code: 'function x() { { async function f() {}; var f; } }', options: { lexical: true } },
    { code: '{ const f = 0; function f() {} }', options: { lexical: true } },
    { code: '{ function foo() {} var foo = 1; }', options: { lexical: true } },
    { code: '{ function foo() {} function foo() {} }', options: { lexical: true } },
    { code: '{ let a; { var a; } }', options: { lexical: true } },
    { code: '{ async function f() {} async function* f() {} }', options: { lexical: true } },
    { code: '{ async function f() {} async function* f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ async function f() {} const f = 0 }', options: { lexical: true } },
    { code: '{ async function* f() {} function f() {} }', options: { lexical: true } },
    { code: '{ async function* f() {} function f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ async function* f() {} let f }', options: { lexical: true } },
    { code: '{ async function* f() {} let f }', options: { webcompat: true, lexical: true } },
    { code: '{ async function* f() {}; var f; }', options: { lexical: true } },
    { code: '{ let f; var f }', options: { lexical: true } },
    { code: ' { function a() {} } { let a; function a() {}; }', options: { lexical: true } },
    { code: 'function f(){ var f = 123; if (true) function f(){} }', options: { lexical: true } },
    { code: '{ var f = 123; if (true) function f(){} }', options: { lexical: true } },
    { code: '{ if (x) function f() {} ; function f() {} }', options: { lexical: true } },
    { code: '{ function f() {} ; function f() {} }', options: { lexical: true } },
    { code: '{ let a; class a {} }', options: { lexical: true } },
    { code: '{ async function a() {} async function a() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function* a() {} break; default: var a; }', options: { lexical: true } },
    { code: 'for (let x; false; ) { var x; }', options: { lexical: true } },
    { code: '{ async function f() {} const f = 0; }', options: { lexical: true } },
    { code: '{ async function f() {} const f = 0; }', options: { lexical: true } },
    { code: '{ async function f() {} var f; }', options: { lexical: true } },
    { code: '{ async function* f() {} async function f() {} }', options: { lexical: true } },
    { code: '{ async function* f() {} function* f() {} }', options: { lexical: true } },
    { code: '{ class f {} class f {}; }', options: { lexical: true } },
    { code: '{ class f {} const f = 0; }', options: { lexical: true } },
    { code: '{ class f {} function* f() {} }', options: { lexical: true } },
    { code: '{ class f {} let f; }', options: { lexical: true } },
    { code: '{ class f {} var f; }', options: { lexical: true } },
    { code: '{ function* f() {} class f {}; }', options: { lexical: true } },
    { code: '{ function* f() {} function f() {} }', options: { lexical: true } },
    { code: '{ function* f() {} function f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ function *foo() {}; function *foo() {}; }', options: { lexical: true } },
    { code: '{ function *foo() {}; function *bar() {}; function *foo() {}; }', options: { lexical: true } },
    { code: '{ function* f() {} function* f() {} }', options: { lexical: true } },
    { code: '{ function* f() {} function* f() {} }', options: { impliedStrict: true, lexical: true } },
    { code: '{ function* f() {} function* f() {} }', options: { webcompat: true, lexical: true } },
    { code: '{ function* f() {} let f; }', options: { lexical: true } },
    { code: '{ function* f() {} var f; }', options: { lexical: true } },
    { code: '{ function f(){} function f(){} }', options: { lexical: true } },
    { code: 'for (let x of []) { var x;  }', options: { lexical: true } },
    { code: 'for (const x in {}) { var x; }', options: { lexical: true } },
    { code: '{ let a; function a() {}; }', options: { lexical: true } },
    { code: '{ let f = 123; if (false) ; else function f() {} }', options: { lexical: true } },
    { code: '{ let f = 123; if (false) ; else function f() {  }}', options: { lexical: true } },
    {
      code: 'try { throw null; } catch (f) { if (false) ; else function f() { return 123; } }',
      options: { lexical: true },
    },
    { code: '{ async function* f() {}; { var f; } }', options: { lexical: true } },
    { code: '{ async function f() {}; { var f; } }', options: { lexical: true } },
    { code: '{ class f {}; { var f; } }', options: { lexical: true } },
    { code: '{ function f() {} var f; }', options: { lexical: true } },
    { code: '{ const a = 1; function a(){} }', options: { lexical: true } },
    { code: '{ async function *f(){} class f {} }', options: { lexical: true } },
    { code: '{ function f(){} class f {} }', options: { lexical: true } },
    { code: '{ function *f(){} class f {} }', options: { lexical: true } },
    { code: '{ async function *f(){} const f = x }', options: { lexical: true } },
    { code: '{ class f {} async function f(){} }', options: { lexical: true } },
    { code: '{ class f {} function *f(){} }', options: { lexical: true } },
    { code: '{ const f = x; async function f(){} }', options: { lexical: true } },
    { code: '{ const f = x; async function *f(){} }', options: { lexical: true } },
    { code: '{ const f = x; function *f(){} }', options: { lexical: true } },
    { code: 'async function *f(){} async function *f(){} }', options: { lexical: true } },
    { code: '{ let f; async function f(){} }', options: { lexical: true } },
    { code: '{ let f; async function *f(){} }', options: { lexical: true } },
    { code: '{ let f; function f(){} }', options: { lexical: true } },
    { code: '{ var f; async function f(){} }', options: { lexical: true } },
    { code: '{ var f; function *f(){} }', options: { lexical: true } },
    { code: '{ const a = 1; function a(){} }', options: { webcompat: true, lexical: true } },
    { code: '{ class async {}; { var async; } }', options: { webcompat: true, lexical: true } },
    {
      code: outdent`
        {
          for (var x;;);
          const x = 1
        }
      `,
      options: { webcompat: true, lexical: true },
    },
    {
      code: outdent`
        function f(){
          for (var x;;);
          const x = 1
        }
      `,
      options: { webcompat: true, lexical: true },
    },
    { code: '# { # }', options: { webcompat: true, lexical: true } },
    { code: '{ # } #', options: { webcompat: true, lexical: true } },
    { code: 'try { # var f } catch (e) {}', options: { webcompat: true, lexical: true } },
    { code: '{ class async {}; { var async; } }', options: { webcompat: true, lexical: true } },
    { code: 'try { } catch (e) { # # }', options: { webcompat: true, lexical: true } },
    { code: '{ async function *f(){} let f }', options: { webcompat: true, lexical: true } },
    { code: '{ class async {}; { var async; } }', options: { webcompat: true, lexical: true } },
  ]);

  for (const arg of [
    'function x() { { var f; var f } }',
    'function f() {} var f;',
    '{ let x; } var x',
    'var f; function f() {}',
    '{ var f; var f }',
    'function x() { { var f; var f } }',
    '{ { var f; } var f }',
    'function f() {} ; function f() {}',
    'function g(){ function f() {} ; function f() {} }',
    '{ var f; var f; }',
    '{ let foo = 1; { let foo = 2; } }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });
  }

  for (const arg of [
    'function x() { { var f; var f } }',
    '{ { var f; } var f }',
    '{ function f() {} ; function f() {} }',
    '{ if (x) function f() {} ; function f() {} }',
    '{ var f = 123; if (true) function f(){} }',
    '{ async function f(){} } async function f(){}',
    '{ async function *f(){} } async function *f(){}',
    outdent`
      { function f(){} } function f(){}
      { function f(){} } function f(){}
    `,
    outdent`
      { let foo = 1; { let foo = 2; } }
      { let foo = 1; { let foo = 2; } }
    `,
    '{ function f(){} } function f(){}',
    '{ function *f(){} } function *f(){}',
    '{ async function f(){} } async function f(){}',
    '{ async function f(){} } async function f(){}',
    '{ async function f(){} } async function f(){}',
    '{ let foo = 1; { let foo = 2; } }',
    outdent`
      function f() {}  var f;
      function f() {}  var f;
    `,
    '{ function f() { a = f; f = 123; b = f; return x; } }',
    '{ let f = 123; { function f() {  } } }',
    '{ let f = 123; if (false) ; else function f() {  } }',
    'try { throw null; } catch (f) { if (false) ; else function f() { return 123; } }',
    'try { throw {}; } catch ({ f }) { switch (1) { default: function f() {  }} }',
    outdent`
      try { throw {}; } catch ({ f }) { switch (1) { default: function f() {  }} }
      try { throw {}; } catch ({ f }) { switch (1) { default: function f() {  }} }
    `,
    'let f = 123; switch (1) { default: function f() {  }  }',
    '{ let x; } var x',
    '{ var f; var f; }',
    outdent`
      { var f; var f; }
      { var f; var f; }
    `,
    'function f() {}  var f;',
    '{ function a(){} function a(){} }',
    '{ var a; { let a; } }',
    outdent`
      {
        let result;
        let x = 1;
        switch (x) {
          case 1:
            let x = 2;
            result = x;
            break;
          default:
            result = 0;
            break;
        }
      }
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, webcompat: true, lexical: true });
      });
    });
  }
});
