import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Lexical - Lexical', () => {
  const letbinds = [
    'let x;',
    'let x = 0;',
    'let x = undefined;',
    'let x = function() {};',
    'let x, y;',
    'let y, x;',
    'const x = 0;',
    'const x = undefined;',
    'const x = function() {};',
    'const x = 2, y = 3;',

    'const y = 4, x = 5;',
  ];
  const varbinds = ['var x;', 'var x = 0;', 'var x = undefined;', 'var x = function() {};', 'var x, y;', 'var y, x;'];

  for (let l = 0; l < letbinds.length; ++l) {
    // Test conflicting let/var bindings.
    for (let v = 0; v < varbinds.length; ++v) {
      const case1 = letbinds[l] + varbinds[v];
      it(case1, () => {
        t.throws(() => {
          parseSource(case1, { webcompat: true, lexical: true });
        });
      });

      const case2 = letbinds[l] + varbinds[v];

      it(case2, () => {
        t.throws(() => {
          parseSource(case2, { webcompat: true, lexical: true });
        });
      });

      const case3 = letbinds[l] + '{' + varbinds[v] + '}';

      it(case3, () => {
        t.throws(() => {
          parseSource(letbinds[l] + '{' + varbinds[v] + '}', { webcompat: true, lexical: true });
        });
      });

      const case4 = '{' + varbinds[v] + '}' + letbinds[l];

      it(case4, () => {
        t.throws(() => {
          parseSource(case4, { webcompat: true, lexical: true });
        });
      });

      const case5 = '{' + varbinds[v] + '}' + letbinds[l];

      it(case5, () => {
        t.throws(() => {
          parseSource(case5, { webcompat: true, lexical: true });
        });
      });
    }

    // Test conflicting let/let bindings.
    for (let k = 0; k < letbinds.length; ++k) {
      const case6 = letbinds[l] + letbinds[k];

      it(case6, () => {
        t.throws(() => {
          parseSource(case6, { webcompat: true, lexical: true });
        });
      });

      it(case6, () => {
        t.doesNotThrow(() => {
          parseSource(case6, { webcompat: true });
        });
      });

      const case7 = letbinds[k] + letbinds[l];

      it(case7, () => {
        t.throws(() => {
          parseSource(case7, { webcompat: true, lexical: true });
        });
      });
    }
  }

  fail('Lexical - Lexical (fail)', [
    { code: 'let x; var x;', options: { lexical: true } },
    {
      code: outdent`
        var x; let x;
        var x; let x;
      `,
      options: { lexical: true },
    },
    {
      code: outdent`
        let x; { var x }
        let x; { var x }
      `,
      options: { lexical: true },
    },
    { code: 'var x; let x;', options: { lexical: true } },
    { code: 'let x; { var x }', options: { sourceType: 'module', lexical: true } },
    { code: 'var x; let x;', options: { sourceType: 'module', lexical: true } },
    { code: 'let x; { var x }', options: { sourceType: 'module', lexical: true } },
    { code: '{ var x } let x;', options: { lexical: true } },
    { code: 'for (let x;;) { var x; }', options: { lexical: true } },
    { code: 'let x; for (;;) { var x; }', options: { lexical: true } },
    { code: 'for (;;) { var x; } let x;', options: { lexical: true } },
    { code: 'function f(){let i; class i{}}', options: { lexical: true } },
    { code: 'let a, a', options: { lexical: true } },
    { code: 'let a; let a;', options: { lexical: true } },
    {
      code: outdent`
        let a; let a;
        let a; let a;
      `,
      options: { lexical: true },
    },
    { code: 'const a = 1, a = 2', options: { lexical: true } },
    { code: 'const a = 1; const a = 2', options: { lexical: true } },
    { code: 'let a = 1; const a = 2', options: { lexical: true } },
    { code: 'const a = 1; let a = 2', options: { lexical: true } },
    { code: 'let a; export function a(){};', options: { sourceType: 'module', lexical: true } },
    { code: 'let foo = 1; { var foo = 1; } ', options: { lexical: true } },
    { code: 'let foo = 1; function x(foo) {} { var foo = 1; }', options: { lexical: true } },
    { code: 'var foo = 1; function x() {} let foo = 1;', options: { lexical: true } },
    { code: 'var foo = 1; let foo = 1;', options: { lexical: true } },
    { code: 'let foo = 1; var foo = 1;', options: { lexical: true } },
    { code: 'var [foo] = [1]; let foo = 1;', options: { lexical: true } },
    { code: 'var [{ bar: [foo] }] = x; let {foo} = 1;', options: { lexical: true } },
    { code: 'let test = 2, let = 1;', options: { lexical: true } },
    { code: 'let {a:a, a:a} = {};', options: { lexical: true } },
    { code: 'const {a:a, a:a} = {};', options: { lexical: true } },
    { code: 'let {...(a,b)} = foo', options: { lexical: true } },
    { code: 'let {...(a,b)} = foo', options: { lexical: true } },
    { code: 'let {...[a,b]} = foo', options: { lexical: true } },
    { code: 'let {...{a,b}} = foo', options: { lexical: true } },
    { code: 'let {...{a,b}} = foo', options: { webcompat: true, lexical: true } },
    { code: 'let {...(obj)} = foo', options: { lexical: true } },
    { code: 'let {...(a,b)} = foo', options: { lexical: true } },
    { code: 'let {...[a,b]} = foo', options: { lexical: true } },
    { code: 'let {...{a,b}} = foo', options: { lexical: true } },
    { code: 'let {...(obj)} = foo', options: { lexical: true } },
    { code: 'let {...(a,b)} = foo', options: { next: true, lexical: true } },
    { code: 'let {...(a,b)} = foo', options: { webcompat: true, lexical: true } },
    { code: 'let {...[a,b]} = foo', options: { webcompat: true, lexical: true } },
    { code: 'let {...{a,b}} = foo', options: { webcompat: true, next: true, lexical: true } },
    { code: 'let {...(obj)} = foo', options: { webcompat: true, lexical: true } },
    { code: 'let {...(a,b)} = foo', options: { webcompat: true, next: true, lexical: true } },
    { code: 'let {...[a,b]} = foo', options: { webcompat: true, lexical: true } },
    { code: 'let {...{a,b}} = foo', options: { webcompat: true, next: true, lexical: true } },
    { code: 'let {...(obj)} = foo', options: { webcompat: true, lexical: true } },
    { code: 'var x; let x;', options: { lexical: true } },
    { code: '{ var f; let f; }', options: { lexical: true } },
    { code: '{ var f; function f() {} }', options: { lexical: true } },
    { code: 'let {[a]: x, b: x} = obj', options: { lexical: true } },
    { code: 'let {[a]: x, [b]: x} = obj', options: { lexical: true } },
    { code: 'let {a: x, b: x} = obj', options: { lexical: true } },
    { code: 'let {a: x, b: x} = obj', options: { lexical: true } },
    { code: 'let {x, x} = obj', options: { lexical: true } },
    { code: 'let {a: x, c: {b: x}} = obj', options: { lexical: true } },
    { code: 'let x, {a: {b: x}} = obj', options: { lexical: true } },
    { code: 'let x, {a: {x}} = obj', options: { lexical: true } },
    { code: 'let {a: x, ...{x}} = obj', options: { lexical: true } },
    { code: 'let {a: x, ...x} = obj', options: { lexical: true } },
    { code: 'let x, {x} = obj', options: { lexical: true } },
    { code: 'let x, {a: x} = obj', options: { lexical: true } },
    { code: 'let {a: x, ...{x}} = obj', options: { sourceType: 'module', lexical: true } },
    { code: 'let {a: x, ...x} = obj', options: { sourceType: 'module', lexical: true } },
    { code: 'let x, {x} = obj', options: { sourceType: 'module', lexical: true } },
    { code: 'let x, {a: x} = obj', options: { sourceType: 'module', lexical: true } },
    { code: 'let {b, b} = {};', options: { lexical: true } },
    { code: 'const a = 0, a = 1;', options: { lexical: true } },
    { code: 'let a, [a];', options: { lexical: true } },
    { code: 'let [a, ...a];', options: { lexical: true } },
    { code: '{ let a; { var a; } }', options: { lexical: true } },
    { code: '{ let a; let a; }', options: { lexical: true } },
    { code: 'let {x:c, y:c} = {};', options: { lexical: true } },
    { code: 'const {x:c, y:c} = {};', options: { lexical: true } },
    { code: 'const [a, let, b] = [1, 2, 3];', options: { lexical: true } },
    { code: 'for(let let in { }) { };', options: { lexical: true } },
    { code: 'let [a, a] = [];', options: { lexical: true } },
    { code: 'const a = 1; let a = 2', options: { lexical: true } },
    { code: 'const a = 1; let a = 2', options: { lexical: true } },
    { code: '(function() { let a; var a; })();', options: { lexical: true } },
    { code: 'const a = b, a = c', options: { lexical: true } },
    { code: 'const a = b; const a = c', options: { lexical: true } },
    { code: 'const a = b; const a = c', options: { sourceType: 'module', lexical: true } },
    { code: 'let a = b; const a = c', options: { webcompat: true, lexical: true } },
    { code: 'const x = x, x = y;', options: { webcompat: true, lexical: true } },
    { code: 'const [x, x] = c', options: { webcompat: true, lexical: true } },
    { code: 'const [x, {x}] = y', options: { webcompat: true, lexical: true } },
    { code: 'const {x:x, x:x} = c', options: { webcompat: true, lexical: true } },
    { code: 'const a = b; let a = c', options: { webcompat: true, lexical: true } },
    { code: 'const x = a; const x = b;', options: { webcompat: true, lexical: true } },
    { code: 'let x = a; const x = b;', options: { webcompat: true, lexical: true } },
    { code: 'var x = a; const x = b;', options: { webcompat: true, lexical: true } },
    { code: 'const x; { let x; var y; }', options: { webcompat: true, lexical: true } },
    { code: 'var x = a; let x = b;', options: { webcompat: true, lexical: true } },
    { code: 'var x = a; const x = b;', options: { webcompat: true, lexical: true } },
    { code: 'let a = b; const a = c', options: { lexical: true } },
    { code: 'const x = x, x = y;', options: { lexical: true } },
    { code: 'const [x, x] = c', options: { lexical: true } },
    { code: 'const [x, {x}] = y', options: { lexical: true } },
    { code: 'const {x:x, x:x} = c', options: { lexical: true } },
    { code: 'const a = b; let a = c', options: { lexical: true } },
    { code: 'const x = a; const x = b;', options: { lexical: true } },
    { code: 'let x = a; const x = b;', options: { lexical: true } },
    { code: 'var x = a; const x = b;', options: { lexical: true } },
    { code: 'const x; { let x; var y; }', options: { lexical: true } },
    { code: 'var x = a; let x = b;', options: { lexical: true } },
    { code: 'var x = a; const x = b;', options: { lexical: true } },
    { code: 'let x = a; let x = b;', options: { lexical: true } },
    { code: 'let x = a; const x = b;', options: { lexical: true } },
    { code: 'var x; let x;', options: { lexical: true } },
    { code: 'let x; var x;', options: { lexical: true } },
    { code: 'let x; { var x; }', options: { lexical: true } },
    { code: 'let x; {var x}', options: { lexical: true } },
    { code: 'let x; {var x}', options: { webcompat: true, lexical: true } },
    { code: 'let foo = 1; function x(foo) {} { var foo = 1; }', options: { lexical: true } },
    { code: 'var foo = 1; function x() {} let foo = 1;', options: { lexical: true } },
    { code: 'var foo = 1; function x(a) { let a; } ', options: { lexical: true } },
    { code: 'var x = a; let x = b;', options: { lexical: true } },
    { code: 'var x = a; const x = b;', options: { lexical: true } },
    { code: 'var x = a; function x(){};', options: { lexical: true, sourceType: 'module' } },
    { code: 'let x = a; let x = b;', options: { lexical: true } },
    { code: 'let x = a; const x = b;', options: { lexical: true } },
    { code: 'let x = a; function x(){};', options: { lexical: true } },
    { code: 'const x = a; const x = b;', options: { lexical: true } },
    { code: 'const x = a; function x(){};', options: { lexical: true } },
    { code: 'let x; { var x }', options: { lexical: true } },
    { code: '{ var x; } let x', options: { lexical: true } },
  ]);

  for (const arg of [
    'var x; for (;;) { let x; }',
    outdent`
      var x; for (;;) { let x; }
      var x; for (;;) { let x; }
    `,
    outdent`
      for (;;) { let x; } var x;
      for (;;) { let x; } var x;
    `,
    outdent`
      for (var x;;) { let x; }
      for (var x;;) { let x; }
    `,
    'for (;;) { let x; } var x;',
    'for (var x;;) { let x; }',
    '{ let x } var x;',
    'var foo, foo;',
    'let x = 1; x = 2;',
    outdent`
      { var {foo} = {foo: a}; };
      { var {foo} = {foo: a}; };
    `,
    '{ var {foo=a} = {}; };',
    '{ var foo = a; };',
    '{ var {foo} = {foo: a}; };',
    outdent`
      try{
          try {
            var intry__intry__var;
          } catch (e) {
            var intry__incatch__var;
          }
      }catch(e){
          try {
            var incatch__intry__var;
          } catch (e) {
              var incatch__incatch__var;
          }
      };
    `,
    'var __v_10 = one + 1; { let __v_10 = one + 3; function __f_6() { one; __v_10; } __f_6(); }',
    'let foo = 1; function lazy() { foo = 2; } lazy(); my_global = foo;',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
  }

  for (const arg of [
    'var x; for (;;) { let x; }',
    'for (;;) { let x; } var x;',
    'for (var x;;) { let x; }',
    '{ let x } var x;',
    '{ var {foo=a} = {}; };',
    '{ var foo = a; };',
    '{ var {foo} = {foo: a}; };',
    'let a; ({a:a, a:a} = {});',
    'var [a, a] = [];',
    'var foo, foo;',
    'let a; [a, a] = [];',
    'var a; [a, a] = [];',
    'let x = 1; x = 2;',
    outdent`
      try{
          try {
            var intry__intry__var;
          } catch (e) {
            var intry__incatch__var;
          }
      }catch(e){
          try {
            var incatch__intry__var;
          } catch (e) {
              var incatch__incatch__var;
          }
      };
    `,
    'let { x : x0 = 0, y : { z : z1 = 1 }, x : x1 = 5} = o;',
    'var __v_10 = one + 1; { let __v_10 = one + 3; function __f_6() { one; __v_10; } __f_6(); }',
    'let foo = 1; function lazy() { foo = 2; } lazy(); my_global = foo;',
    'var x; { let x }',
    '{ let x } var x;',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, webcompat: true, lexical: true });
      });
    });
  }
});
