import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

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

    'const y = 4, x = 5;'
  ];
  const varbinds = ['var x;', 'var x = 0;', 'var x = undefined;', 'var x = function() {};', 'var x, y;', 'var y, x;'];

  for (let l = 0; l < letbinds.length; ++l) {
    // Test conflicting let/var bindings.
    for (let v = 0; v < varbinds.length; ++v) {
      const case1 = letbinds[l] + varbinds[v];
      it(case1, () => {
        t.throws(() => {
          parseSource(case1, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });

      const case2 = letbinds[l] + varbinds[v];

      it(case2, () => {
        t.throws(() => {
          parseSource(case2, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });

      const case3 = letbinds[l] + '{' + varbinds[v] + '}';

      it(case3, () => {
        t.throws(() => {
          parseSource(
            letbinds[l] + '{' + varbinds[v] + '}',
            undefined,
            Context.OptionsWebCompat | Context.OptionsLexical
          );
        });
      });

      const case4 = '{' + varbinds[v] + '}' + letbinds[l];

      it(case4, () => {
        t.throws(() => {
          parseSource(case4, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });

      const case5 = '{' + varbinds[v] + '}' + letbinds[l];

      it(case5, () => {
        t.throws(() => {
          parseSource(case5, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });
    }

    // Test conflicting let/let bindings.
    for (let k = 0; k < letbinds.length; ++k) {
      const case6 = letbinds[l] + letbinds[k];

      it(case6, () => {
        t.throws(() => {
          parseSource(case6, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });

      it(case6, () => {
        t.doesNotThrow(() => {
          parseSource(case6, undefined, Context.OptionsWebCompat);
        });
      });

      const case7 = letbinds[k] + letbinds[l];

      it(case7, () => {
        t.throws(() => {
          parseSource(case7, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });
    }
  }

  fail('Lexical - Lexical (fail)', [
    ['let x; var x;', Context.OptionsLexical],
    [
      `var x; let x;
    var x; let x;`,
      Context.OptionsLexical
    ],
    [
      `let x; { var x }
    let x; { var x }`,
      Context.OptionsLexical
    ],
    ['var x; let x;', Context.OptionsLexical],
    ['let x; { var x }', Context.OptionsLexical | Context.Module | Context.Strict],
    ['var x; let x;', Context.OptionsLexical | Context.Module | Context.Strict],
    ['let x; { var x }', Context.OptionsLexical | Context.Module | Context.Strict],
    ['{ var x } let x;', Context.OptionsLexical],
    ['for (let x;;) { var x; }', Context.OptionsLexical],
    ['let x; for (;;) { var x; }', Context.OptionsLexical],
    ['for (;;) { var x; } let x;', Context.OptionsLexical],
    ['function f(){let i; class i{}}', Context.OptionsLexical],
    ['let a, a', Context.OptionsLexical],
    ['let a; let a;', Context.OptionsLexical],
    [
      `let a; let a;
    let a; let a;`,
      Context.OptionsLexical
    ],
    ['const a = 1, a = 2', Context.OptionsLexical],
    ['const a = 1; const a = 2', Context.OptionsLexical],
    ['let a = 1; const a = 2', Context.OptionsLexical],
    ['const a = 1; let a = 2', Context.OptionsLexical],
    ['let a; export function a(){};', Context.OptionsLexical | Context.Module | Context.Strict],
    ['let foo = 1; { var foo = 1; } ', Context.OptionsLexical],
    ['let foo = 1; function x(foo) {} { var foo = 1; }', Context.OptionsLexical],
    ['var foo = 1; function x() {} let foo = 1;', Context.OptionsLexical],
    ['var foo = 1; let foo = 1;', Context.OptionsLexical],
    ['let foo = 1; var foo = 1;', Context.OptionsLexical],
    ['var [foo] = [1]; let foo = 1;', Context.OptionsLexical],
    ['var [{ bar: [foo] }] = x; let {foo} = 1;', Context.OptionsLexical],
    ['let test = 2, let = 1;', Context.OptionsLexical],
    ['let {a:a, a:a} = {};', Context.OptionsLexical],
    ['const {a:a, a:a} = {};', Context.OptionsLexical],
    ['let {...(a,b)} = foo', Context.OptionsLexical],
    ['let {...(a,b)} = foo', Context.OptionsLexical],
    ['let {...[a,b]} = foo', Context.OptionsLexical],
    ['let {...{a,b}} = foo', Context.OptionsLexical],
    ['let {...{a,b}} = foo', Context.OptionsLexical | Context.OptionsWebCompat],
    ['let {...(obj)} = foo', Context.OptionsLexical],
    ['let {...(a,b)} = foo', Context.OptionsLexical],
    ['let {...[a,b]} = foo', Context.OptionsLexical],
    ['let {...{a,b}} = foo', Context.OptionsLexical],
    ['let {...(obj)} = foo', Context.OptionsLexical],
    ['let {...(a,b)} = foo', Context.OptionsLexical | Context.OptionsNext],
    ['let {...(a,b)} = foo', Context.OptionsLexical | Context.OptionsWebCompat],
    ['let {...[a,b]} = foo', Context.OptionsLexical | Context.OptionsWebCompat],
    ['let {...{a,b}} = foo', Context.OptionsLexical | Context.OptionsWebCompat | Context.OptionsNext],
    ['let {...(obj)} = foo', Context.OptionsLexical | Context.OptionsWebCompat],
    ['let {...(a,b)} = foo', Context.OptionsLexical | Context.OptionsWebCompat | Context.OptionsNext],
    ['let {...[a,b]} = foo', Context.OptionsLexical | Context.OptionsWebCompat],
    ['let {...{a,b}} = foo', Context.OptionsLexical | Context.OptionsWebCompat | Context.OptionsNext],
    ['let {...(obj)} = foo', Context.OptionsLexical | Context.OptionsWebCompat],
    ['var x; let x;', Context.OptionsLexical],
    ['{ var f; let f; }', Context.OptionsLexical],
    ['{ var f; function f() {} }', Context.OptionsLexical],
    ['let {[a]: x, b: x} = obj', Context.OptionsLexical],
    ['let {[a]: x, [b]: x} = obj', Context.OptionsLexical],
    ['let {a: x, b: x} = obj', Context.OptionsLexical],
    ['let {a: x, b: x} = obj', Context.OptionsLexical],
    ['let {x, x} = obj', Context.OptionsLexical],
    ['let {a: x, c: {b: x}} = obj', Context.OptionsLexical],
    ['let x, {a: {b: x}} = obj', Context.OptionsLexical],
    ['let x, {a: {x}} = obj', Context.OptionsLexical],
    ['let {a: x, ...{x}} = obj', Context.OptionsLexical],
    ['let {a: x, ...x} = obj', Context.OptionsLexical],
    ['let x, {x} = obj', Context.OptionsLexical],
    ['let x, {a: x} = obj', Context.OptionsLexical],
    ['let {a: x, ...{x}} = obj', Context.OptionsLexical | Context.Strict | Context.Module],
    ['let {a: x, ...x} = obj', Context.OptionsLexical | Context.Strict | Context.Module],
    ['let x, {x} = obj', Context.OptionsLexical | Context.Strict | Context.Module],
    ['let x, {a: x} = obj', Context.OptionsLexical | Context.Strict | Context.Module],
    ['let {b, b} = {};', Context.OptionsLexical],
    ['const a = 0, a = 1;', Context.OptionsLexical],
    ['let a, [a];', Context.OptionsLexical],
    ['let [a, ...a];', Context.OptionsLexical],
    ['{ let a; { var a; } }', Context.OptionsLexical],
    ['{ let a; let a; }', Context.OptionsLexical],
    ['let {x:c, y:c} = {};', Context.OptionsLexical],
    ['const {x:c, y:c} = {};', Context.OptionsLexical],
    ['const [a, let, b] = [1, 2, 3];', Context.OptionsLexical],
    ['for(let let in { }) { };', Context.OptionsLexical],
    ['let [a, a] = [];', Context.OptionsLexical],
    ['const a = 1; let a = 2', Context.OptionsLexical],
    ['const a = 1; let a = 2', Context.OptionsLexical],
    ['(function() { let a; var a; })();', Context.OptionsLexical],
    ['const a = b, a = c', Context.OptionsLexical],
    ['const a = b; const a = c', Context.OptionsLexical],
    ['const a = b; const a = c', Context.OptionsLexical | Context.Strict | Context.Module],
    ['let a = b; const a = c', Context.OptionsLexical | Context.OptionsWebCompat],
    ['const x = x, x = y;', Context.OptionsLexical | Context.OptionsWebCompat],
    ['const [x, x] = c', Context.OptionsLexical | Context.OptionsWebCompat],
    ['const [x, {x}] = y', Context.OptionsLexical | Context.OptionsWebCompat],
    ['const {x:x, x:x} = c', Context.OptionsLexical | Context.OptionsWebCompat],
    ['const a = b; let a = c', Context.OptionsLexical | Context.OptionsWebCompat],
    ['const x = a; const x = b;', Context.OptionsLexical | Context.OptionsWebCompat],
    ['let x = a; const x = b;', Context.OptionsLexical | Context.OptionsWebCompat],
    ['var x = a; const x = b;', Context.OptionsLexical | Context.OptionsWebCompat],
    ['const x; { let x; var y; }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['var x = a; let x = b;', Context.OptionsLexical | Context.OptionsWebCompat],
    ['var x = a; const x = b;', Context.OptionsLexical | Context.OptionsWebCompat],
    ['let a = b; const a = c', Context.OptionsLexical],
    ['const x = x, x = y;', Context.OptionsLexical],
    ['const [x, x] = c', Context.OptionsLexical],
    ['const [x, {x}] = y', Context.OptionsLexical],
    ['const {x:x, x:x} = c', Context.OptionsLexical],
    ['const a = b; let a = c', Context.OptionsLexical],
    ['const x = a; const x = b;', Context.OptionsLexical],
    ['let x = a; const x = b;', Context.OptionsLexical],
    ['var x = a; const x = b;', Context.OptionsLexical],
    ['const x; { let x; var y; }', Context.OptionsLexical],
    ['var x = a; let x = b;', Context.OptionsLexical],
    ['var x = a; const x = b;', Context.OptionsLexical],
    ['let x = a; let x = b;', Context.OptionsLexical],
    ['let x = a; const x = b;', Context.OptionsLexical],
    ['var x; let x;', Context.OptionsLexical],
    ['let x; var x;', Context.OptionsLexical],
    ['let x; { var x; }', Context.OptionsLexical],
    ['let x; {var x}', Context.OptionsLexical],
    ['let x; {var x}', Context.OptionsWebCompat | Context.OptionsLexical],
    ['let foo = 1; function x(foo) {} { var foo = 1; }', Context.OptionsLexical],
    ['var foo = 1; function x() {} let foo = 1;', Context.OptionsLexical],
    ['var foo = 1; function x(a) { let a; } ', Context.OptionsLexical],
    ['var x = a; let x = b;', Context.OptionsLexical],
    ['var x = a; const x = b;', Context.OptionsLexical],
    ['var x = a; function x(){};', Context.Module | Context.OptionsLexical],
    ['let x = a; let x = b;', Context.OptionsLexical],
    ['let x = a; const x = b;', Context.OptionsLexical],
    ['let x = a; function x(){};', Context.OptionsLexical],
    ['const x = a; const x = b;', Context.OptionsLexical],
    ['const x = a; function x(){};', Context.OptionsLexical],
    ['let x; { var x }', Context.OptionsLexical],
    ['{ var x; } let x', Context.OptionsLexical]
  ]);

  for (const arg of [
    'var x; for (;;) { let x; }',
    `var x; for (;;) { let x; }
    var x; for (;;) { let x; }`,
    `for (;;) { let x; } var x;
    for (;;) { let x; } var x;`,
    `for (var x;;) { let x; }
    for (var x;;) { let x; }`,
    'for (;;) { let x; } var x;',
    'for (var x;;) { let x; }',
    '{ let x } var x;',
    'var foo, foo;',
    'let x = 1; x = 2;',
    `{ var {foo} = {foo: a}; };
    { var {foo} = {foo: a}; };`,
    `{ var {foo=a} = {}; };`,
    `{ var foo = a; };`,
    `{ var {foo} = {foo: a}; };`,
    `try{
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
  };`,
    'var __v_10 = one + 1; { let __v_10 = one + 3; function __f_6() { one; __v_10; } __f_6(); }',
    'let foo = 1; function lazy() { foo = 2; } lazy(); my_global = foo;'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'var x; for (;;) { let x; }',
    'for (;;) { let x; } var x;',
    'for (var x;;) { let x; }',
    '{ let x } var x;',
    `{ var {foo=a} = {}; };`,
    `{ var foo = a; };`,
    `{ var {foo} = {foo: a}; };`,
    'let a; ({a:a, a:a} = {});',
    'var [a, a] = [];',
    'var foo, foo;',
    'let a; [a, a] = [];',
    'var a; [a, a] = [];',
    'let x = 1; x = 2;',
    `try{
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
  };`,
    'let { x : x0 = 0, y : { z : z1 = 1 }, x : x1 = 5} = o;',
    'var __v_10 = one + 1; { let __v_10 = one + 3; function __f_6() { one; __v_10; } __f_6(); }',
    'let foo = 1; function lazy() { foo = 2; } lazy(); my_global = foo;',
    'var x; { let x }',
    '{ let x } var x;'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical | Context.OptionsNext);
      });
    });
  }
});
