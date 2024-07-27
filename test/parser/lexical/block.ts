import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - Block', () => {
  fail('Lexical - Block (fail)', [
    ['{ function f(){} function f(){} }', Context.OptionsLexical],
    ['{ async function f(){} function f(){} }', Context.OptionsLexical],
    ['{ async function f(){} async function f(){} }', Context.OptionsLexical],
    ['{ function f(){} async function f(){} }', Context.OptionsLexical],
    ['var x = a; function x(){};', Context.Module | Context.OptionsLexical],
    ['let x; { var x; }', Context.OptionsLexical],
    ['{ var x; } let x;', Context.OptionsLexical],
    ['let x; var x;', Context.OptionsLexical],
    ['var x; let x;', Context.OptionsLexical],
    ['{ async function f() {} async function f() {} }', Context.OptionsLexical],
    ['{ { var f; } function* f() {}; }', Context.OptionsLexical],

    ['{ async function f() {} async function f() {} }', Context.OptionsLexical],
    ['{ async function f() {} class f {} }', Context.OptionsLexical],
    ['{ async function f() {} function f() {} }', Context.OptionsLexical],
    ['{ async function f() {} function f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ async function f() {} function* f() {} }', Context.OptionsLexical],
    ['{ async function f() {} function* f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ const f = 0; function* f() {} }', Context.OptionsLexical],
    ['function x() { { async function* f() {}; var f; } }', Context.OptionsLexical],
    ['function x() { { const f = 0; var f; } }', Context.OptionsLexical],
    ['{ { var f; } let f; }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ let f; { var f; } }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ let f; function* f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ async function f() {} let f }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ async function f() {} var f }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ async function* f() {} const f = 0 }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ { var f; } async function f() {}; }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ { var f; } class f {}; }', Context.OptionsLexical | Context.OptionsWebCompat | Context.Strict],
    ['{ { var f; } let f; }', Context.OptionsLexical],
    ['{ let f; { var f; } }', Context.OptionsLexical],
    ['{ let f; function* f() {} }', Context.OptionsLexical],
    ['{ async function f() {} let f }', Context.OptionsLexical],
    ['{ async function f() {} var f }', Context.OptionsLexical],
    ['{ function a(){} function a(){} }', Context.OptionsLexical],
    ['{ function f() {} async function* f() {} }', Context.OptionsLexical],
    ['{ function f() {} async function* f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ async function* f() {} async function* f() {} }', Context.OptionsLexical],
    ['{ async function* f() {} const f = 0 }', Context.OptionsLexical],
    ['{ { var f; } async function f() {}; }', Context.OptionsLexical],
    ['{ { var f; } class f {}; }', Context.OptionsLexical],
    ['{ class f {} async function f() {} }', Context.OptionsLexical],
    ['{ const f = 0; { var f; } }', Context.OptionsLexical],
    ['{ const f = 0; const f = 0 }', Context.OptionsLexical],
    ['{ const f = 0; { var f; } }', Context.OptionsLexical | Context.OptionsWebCompat | Context.Strict],
    ['{ const f = 0; const f = 0 }', Context.OptionsLexical | Context.OptionsWebCompat | Context.Strict],
    ['{ class f {} function f() {} }', Context.OptionsLexical],
    ['{ class f {} var f }', Context.OptionsLexical],
    ['{ const f = 0; async function* f() {} }', Context.OptionsLexical],
    ['{ const f = 0; async function* f() {} }', Context.OptionsWebCompat | Context.OptionsLexical],
    ['{ const f = 0; class f {} }', Context.OptionsLexical],
    ['{ const f = 0; let f }', Context.OptionsLexical],
    ['{ const f = 0; var f }', Context.OptionsLexical],
    ['{ function f() {} async function f() {} }', Context.OptionsLexical],
    ['{ function f() {} function f() {} }', Context.Strict | Context.OptionsLexical],
    ['{ function f() {} let f }', Context.OptionsLexical],
    ['{ { var f; } function f() {} }', Context.OptionsLexical],
    ['{ { var f; } async function* f() {}; }', Context.OptionsLexical],
    ['{ { var f; } const f = 0; }', Context.OptionsLexical],
    ['{ let f; class f {} }', Context.OptionsLexical],
    ['{ let f; function f() {} }', Context.OptionsLexical],
    ['{ let f; let f }', Context.OptionsLexical],
    ['{ var f; async function* f() {} }', Context.OptionsLexical],
    ['{ var f; const f = 0 }', Context.OptionsLexical],
    ['{ var f; function* f() {} }', Context.OptionsLexical],
    ['{ async function f() {}; var f; }', Context.OptionsLexical],
    ['{ class f {}; var f; }', Context.OptionsLexical],
    ['{ function* f() {}; var f; }', Context.OptionsLexical],
    ['{ let f; var f; }', Context.OptionsLexical],
    ['{ class f {}; var f; }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ function* f() {}; var f; }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ let f; var f; }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['for (const x in {}) { var x; }', Context.OptionsLexical],
    ['{ async function f() {} let f }', Context.OptionsLexical],
    ['{ async function* f() {} async function f() {} }', Context.OptionsLexical],
    ['{ async function* f() {} async function f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ async function* f() {} var f }', Context.OptionsLexical],
    ['{ class f {} const f = 0 }', Context.OptionsLexical],
    ['{ const f = 0; async function f() {} }', Context.OptionsLexical],
    ['{ function* f() {} let f }', Context.OptionsLexical],
    ['{ function* f() {} class f {} }', Context.OptionsLexical],
    ['{ for (var x;;); const x = 1 }', Context.OptionsLexical],
    ['{ function* f() {} async function f() {} }', Context.OptionsLexical],
    ['{ function* f() {} async function f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['function g() { { function f() {} { var f; } }}', Context.OptionsLexical],
    ['function x() { { function* f() {}; var f; } }', Context.OptionsLexical],
    ['function x() { { async function* f() {}; var f; } }', Context.OptionsLexical],
    ['function x() { { async function f() {}; var f; } }', Context.OptionsLexical],
    ['{ const f = 0; function f() {} }', Context.OptionsLexical],
    ['{ function foo() {} var foo = 1; }', Context.OptionsLexical],
    ['{ function foo() {} function foo() {} }', Context.OptionsLexical],
    ['{ let a; { var a; } }', Context.OptionsLexical],
    ['{ async function f() {} async function* f() {} }', Context.OptionsLexical],
    ['{ async function f() {} async function* f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ async function f() {} const f = 0 }', Context.OptionsLexical],
    ['{ async function* f() {} function f() {} }', Context.OptionsLexical],
    ['{ async function* f() {} function f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ async function* f() {} let f }', Context.OptionsLexical],
    ['{ async function* f() {} let f }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ async function* f() {}; var f; }', Context.OptionsLexical],
    ['{ let f; var f }', Context.OptionsLexical],
    [' { function a() {} } { let a; function a() {}; }', Context.OptionsLexical],
    ['function f(){ var f = 123; if (true) function f(){} }', Context.OptionsLexical],
    ['{ var f = 123; if (true) function f(){} }', Context.OptionsLexical],
    ['{ if (x) function f() {} ; function f() {} }', Context.OptionsLexical],
    ['{ function f() {} ; function f() {} }', Context.OptionsLexical],
    ['{ let a; class a {} }', Context.OptionsLexical],
    ['{ async function a() {} async function a() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: function* a() {} break; default: var a; }', Context.OptionsLexical],
    ['for (let x; false; ) { var x; }', Context.OptionsLexical],
    ['{ async function f() {} const f = 0; }', Context.OptionsLexical],
    ['{ async function f() {} const f = 0; }', Context.OptionsLexical],
    ['{ async function f() {} var f; }', Context.OptionsLexical],
    ['{ async function* f() {} async function f() {} }', Context.OptionsLexical],
    ['{ async function* f() {} function* f() {} }', Context.OptionsLexical],
    ['{ class f {} class f {}; }', Context.OptionsLexical],
    ['{ class f {} const f = 0; }', Context.OptionsLexical],
    ['{ class f {} function* f() {} }', Context.OptionsLexical],
    ['{ class f {} let f; }', Context.OptionsLexical],
    ['{ class f {} var f; }', Context.OptionsLexical],
    ['{ function* f() {} class f {}; }', Context.OptionsLexical],
    ['{ function* f() {} function f() {} }', Context.OptionsLexical],
    ['{ function* f() {} function f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ function *foo() {}; function *foo() {}; }', Context.OptionsLexical],
    ['{ function *foo() {}; function *bar() {}; function *foo() {}; }', Context.OptionsLexical],
    ['{ function* f() {} function* f() {} }', Context.OptionsLexical],
    ['{ function* f() {} function* f() {} }', Context.OptionsLexical | Context.Strict],
    ['{ function* f() {} function* f() {} }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['{ function* f() {} let f; }', Context.OptionsLexical],
    ['{ function* f() {} var f; }', Context.OptionsLexical],
    ['{ function f(){} function f(){} }', Context.OptionsLexical],
    ['for (let x of []) { var x;  }', Context.OptionsLexical],
    ['for (const x in {}) { var x; }', Context.OptionsLexical],
    ['{ let a; function a() {}; }', Context.OptionsLexical],
    ['{ let f = 123; if (false) ; else function f() {} }', Context.OptionsLexical],
    ['{ let f = 123; if (false) ; else function f() {  }}', Context.OptionsLexical],
    ['try { throw null; } catch (f) { if (false) ; else function f() { return 123; } }', Context.OptionsLexical],
    ['{ async function* f() {}; { var f; } }', Context.OptionsLexical],
    ['{ async function f() {}; { var f; } }', Context.OptionsLexical],
    ['{ class f {}; { var f; } }', Context.OptionsLexical],
    ['{ function f() {} var f; }', Context.OptionsLexical],
    ['{ const a = 1; function a(){} }', Context.OptionsLexical],
    ['{ async function *f(){} class f {} }', Context.OptionsLexical],
    ['{ function f(){} class f {} }', Context.OptionsLexical],
    ['{ function *f(){} class f {} }', Context.OptionsLexical],
    ['{ async function *f(){} const f = x }', Context.OptionsLexical],
    ['{ class f {} async function f(){} }', Context.OptionsLexical],
    ['{ class f {} function *f(){} }', Context.OptionsLexical],
    ['{ const f = x; async function f(){} }', Context.OptionsLexical],
    ['{ const f = x; async function *f(){} }', Context.OptionsLexical],
    ['{ const f = x; function *f(){} }', Context.OptionsLexical],
    ['async function *f(){} async function *f(){} }', Context.OptionsLexical],
    ['{ let f; async function f(){} }', Context.OptionsLexical],
    ['{ let f; async function *f(){} }', Context.OptionsLexical],
    ['{ let f; function f(){} }', Context.OptionsLexical],
    ['{ var f; async function f(){} }', Context.OptionsLexical],
    ['{ var f; function *f(){} }', Context.OptionsLexical],
    ['{ const a = 1; function a(){} }', Context.OptionsWebCompat | Context.OptionsLexical],
    ['{ class async {}; { var async; } }', Context.OptionsWebCompat | Context.OptionsLexical],
    [
      `{
      for (var x;;);
      const x = 1
    }`,
      Context.OptionsWebCompat | Context.OptionsLexical
    ],
    [
      `function f(){
      for (var x;;);
      const x = 1
    }`,
      Context.OptionsWebCompat | Context.OptionsLexical
    ],
    [`# { # }`, Context.OptionsWebCompat | Context.OptionsLexical],
    ['{ # } #', Context.OptionsWebCompat | Context.OptionsLexical],
    ['try { # var f } catch (e) {}', Context.OptionsWebCompat | Context.OptionsLexical],
    ['{ class async {}; { var async; } }', Context.OptionsWebCompat | Context.OptionsLexical],
    ['try { } catch (e) { # # }', Context.OptionsWebCompat | Context.OptionsLexical],
    ['{ async function *f(){} let f }', Context.OptionsWebCompat | Context.OptionsLexical],
    ['{ class async {}; { var async; } }', Context.OptionsWebCompat | Context.OptionsLexical]
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
    '{ let foo = 1; { let foo = 2; } }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
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
    `{ function f(){} } function f(){}
    { function f(){} } function f(){}`,
    `{ let foo = 1; { let foo = 2; } }
    { let foo = 1; { let foo = 2; } }`,
    '{ function f(){} } function f(){}',
    '{ function *f(){} } function *f(){}',
    '{ async function f(){} } async function f(){}',
    '{ async function f(){} } async function f(){}',
    '{ async function f(){} } async function f(){}',
    '{ let foo = 1; { let foo = 2; } }',
    `function f() {}  var f;
    function f() {}  var f;`,
    '{ function f() { a = f; f = 123; b = f; return x; } }',
    '{ let f = 123; { function f() {  } } }',
    '{ let f = 123; if (false) ; else function f() {  } }',
    'try { throw null; } catch (f) { if (false) ; else function f() { return 123; } }',
    'try { throw {}; } catch ({ f }) { switch (1) { default: function f() {  }} }',
    `try { throw {}; } catch ({ f }) { switch (1) { default: function f() {  }} }
    try { throw {}; } catch ({ f }) { switch (1) { default: function f() {  }} }`,
    'let f = 123; switch (1) { default: function f() {  }  }',
    '{ let x; } var x',
    '{ var f; var f; }',
    `{ var f; var f; }
    { var f; var f; }`,
    'function f() {}  var f;',
    '{ function a(){} function a(){} }',
    '{ var a; { let a; } }',
    `{
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
    }`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical | Context.OptionsNext);
      });
    });
  }
});
