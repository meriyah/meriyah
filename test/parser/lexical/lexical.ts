import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
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

  for (var l = 0; l < letbinds.length; ++l) {
    // Test conflicting let/var bindings.
    for (var v = 0; v < varbinds.length; ++v) {
      it(letbinds[l] + varbinds[v], () => {
        t.throws(() => {
          parseSource(letbinds[l] + varbinds[v], undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });

      it(varbinds[v] + letbinds[l], () => {
        t.throws(() => {
          parseSource(varbinds[v] + letbinds[l], undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });

      it(letbinds[l] + '{' + varbinds[v] + '}', () => {
        t.throws(() => {
          parseSource(
            letbinds[l] + '{' + varbinds[v] + '}',
            undefined,
            Context.OptionsWebCompat | Context.OptionsLexical
          );
        });
      });

      it('{' + varbinds[v] + '}' + letbinds[l], () => {
        t.doesNotThrow(() => {
          parseSource(
            '{' + varbinds[v] + '}' + letbinds[l],
            undefined,
            Context.OptionsWebCompat | Context.OptionsLexical
          );
        });
      });

      it('{' + varbinds[v] + '}' + letbinds[l], () => {
        t.doesNotThrow(() => {
          parseSource(
            '{' + varbinds[v] + '}' + letbinds[l],
            undefined,
            Context.OptionsWebCompat | Context.OptionsLexical
          );
        });
      });
    }

    // Test conflicting let/let bindings.
    for (var k = 0; k < letbinds.length; ++k) {
      it(letbinds[l] + letbinds[k], () => {
        t.throws(() => {
          parseSource(letbinds[l] + letbinds[k], undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });

      it(letbinds[k] + letbinds[l], () => {
        t.throws(() => {
          parseSource(letbinds[k] + letbinds[l], undefined, Context.OptionsWebCompat | Context.OptionsLexical);
        });
      });
    }
  }

  fail('Lexical - Lexical (fail)', [
    ['let x; var x;', Context.OptionsLexical],
    ['var x; let x;', Context.OptionsLexical],
    ['let x; { var x }', Context.OptionsLexical],
    ['{ var x } let x;', Context.OptionsLexical],
    ['for (let x;;) { var x; }', Context.OptionsLexical],
    ['let x; for (;;) { var x; }', Context.OptionsLexical],
    ['for (;;) { var x; } let x;', Context.OptionsLexical],
    ['function f(){let i; class i{}}', Context.OptionsLexical],
    ['let a, a', Context.OptionsLexical],
    ['let a; let a;', Context.OptionsLexical],
    ['const a = 1, a = 2', Context.OptionsLexical],
    ['const a = 1; const a = 2', Context.OptionsLexical],
    ['let a = 1; const a = 2', Context.OptionsLexical],
    ['const a = 1; let a = 2', Context.OptionsLexical],
    ['let a; export function a(){};', Context.OptionsLexical | Context.Module],
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
    ['const x = a; function x(){};', Context.OptionsLexical]
  ]);

  for (const arg of [
    'var x; for (;;) { let x; }',
    'for (;;) { let x; } var x;',
    'for (var x;;) { let x; }',
    '{ let x } var x;',
    'var foo, foo;',
    'let x = 1; x = 2;',
    'var __v_10 = one + 1; { let __v_10 = one + 3; function __f_6() { one; __v_10; } __f_6(); }',
    'let foo = 1; function lazy() { foo = 2; } lazy(); my_global = foo;'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    'var x; for (;;) { let x; }',
    'for (;;) { let x; } var x;',
    'for (var x;;) { let x; }',
    '{ let x } var x;',
    'let a; ({a:a, a:a} = {});',
    'var [a, a] = [];',
    'var foo, foo;',
    'let a; [a, a] = [];',
    'var a; [a, a] = [];',
    'let x = 1; x = 2;',
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
  }
});
