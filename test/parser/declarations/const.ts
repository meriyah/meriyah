import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';

import { parseSource } from '../../../src/parser';

describe('Declarations - const', () => {
  // Test keywords

  for (const arg of [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'null',
    'true',
    'false',
    'enum',
  ]) {
    it(`const ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`var ${arg} = x`, undefined, Context.None);
      });
    });

    it(`let ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`var ${arg} = x`, undefined, Context.None);
      });
    });

    it(`let ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`var ${arg} = x`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`for (const  ${arg}  = x;;);`, () => {
      t.throws(() => {
        parseSource(`for (const  ${arg}  = x;;);`, undefined, Context.None);
      });
    });
  }

  for (const arg of ['break', 'implements', 'package', 'protected', 'interface', 'private', 'public', 'static']) {
    it(`const ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`const ${arg} = x`, undefined, Context.Strict);
      });
    });
    it(`for (const  ${arg}  = x;;);`, () => {
      t.throws(() => {
        parseSource(`for (const  ${arg}  = x;;);`, undefined, Context.Strict);
      });
    });

    it(`for (const  ${arg}  = x;;);`, () => {
      t.throws(() => {
        parseSource(
          `for (const  ${arg}  = x;;);`,
          undefined,
          Context.Strict | Context.Module | Context.OptionsWebCompat,
        );
      });
    });
  }

  for (const arg of [
    'const a = Infinity;',
    'const b = -Infinity;',
    'const c = +Infinity;',
    'const d = /abc/;',
    'const e = /abc/g;',
    'const f = /abc/gi;',
    'const [] = x;',
    'const [,] = x;',
    'const [,,] = x;',
    'const key = 2;',
    'const state = { [key]: "foo", bar: "baz" };',
    'const { [a]: b, ...c } = d;',
    'const { [String(a)]: b, ...c } = d;',
    'const [foo] = x;',
    'const [foo,] = x;',
    'const [foo,,] = x;',
    'const [,foo] = x;',
    'const [,,foo] = x;',
    'const [foo,bar] = x;',
    'const { [i]: val, ...rest } = a',
    'const { ["1"]: number2, ...rest2 } = obj',
    'const { 1: value } = obj;',
    'const a = { 1: 0, 2: 1, 3: 2 }',
    'const i = 1',
    'const obj = { 0: true, 1: "hi", 2: true,  }',
    'const { 1: a } = b, c = d(e, ["1"]);',
    'const { [1]: number1, ...rest1 } = obj',
    'const { ["1"]: number2, ...rest2 } = obj',
    'const b = ({ x, ...rest } = {}) => {};',
    'const source = { 1: "one", 2: "two" };',
    'const { [1+0]: _, ...rest } = source;',
    'const { 1e0: _, ...rest } = source;',
    'const { 1.: _, ...rest } = source;',
    'const { 1.: _, ...rest } = source;',
    'const [foo,,bar] = x;',
    'const [foo] = x, [bar] = y;',
    'const [foo] = x, b = y;',
    'const x = y, [foo] = z;',
    'const [foo=a] = c;',
    'const [foo=a,bar] = x;',
    'const [foo,bar=b] = x;',
    'const [foo=a,bar=b] = x;',
    'const [...bar] = obj;',
    'const [foo, ...bar] = obj;',
    'const {foo,} = x;',
    'const {foo} = x, {bar} = y;',
    'const {foo} = x, b = y;',
    'const [foo, bar=b] = arr;',
    'const a = {b: {c: Function()}}',
    'const {c} = a.b',
    'const [foo=a, bar] = arr;',
    'const [foo=a] = arr;',
    'const [foo] = arr;',
    'const oo = {c: 23, ...o}',
    'const o = {a: 1, b: 2, e: 4}',
    '({a, b, ...other} = oo)',
    'const oo = {c: 23, ...o}({a, b, ...other} = oo)',
    'const o = {a: 1, b: 2, e: 4}',
    'const {a, b, ...other} = oo;',
    'const [] = x;',
    'const { data: { courses: oldCourses = [] } = {} } = getState();',
    'const { [(() => 1)()]: a, ...rest } = { 1: "a" };',
    'const [foo,bar] = arr;',
    'const [,foo] = arr;',
    'const x = y, {foo} = z;',
    'const {foo=a} = x;',
    'const {foo=a,bar} = x;',
    'const {foo,bar=b} = x;',
    'const {foo=a,bar=b} = x;',
    'const {foo:a} = x;',
    'const [a = 1] = [];',
    'const [[a]] = [[]];',
    'const {foo:a,bar} = x;',
    'const {foo,bar:b} = x;',
    'const foo = () => { return bar, baz; };',
    'const val = (function f(a, b = (() => a)) {})',
    'const { a, b, ...c } = { a: 1, b: 2, c: 3 };',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Declarations - const (fail)', [
    ['const {foo,,} = x;', Context.None],
    ['const [.x] = obj;', Context.None],
    ['const [..x] = obj;', Context.None],
    ['const [...] = obj;', Context.None],
    ['const [... ...foo] = obj;', Context.None],
    ['const [...[a, b],,] = obj;', Context.None],
    ['const [...foo,] = obj;', Context.None],
    ['for (const {};;);', Context.None],
    ['const {};', Context.None],
    ['const foo;', Context.None],
    [`do const x = 1; while (false)`, Context.None],
    ['while (false) const x = 1;', Context.None],
    ['label: const x;', Context.None],
    ['while (false) const x;', Context.None],
    ['const [...x = []] = [];', Context.None],
    ['const [...[x], y] = [1, 2, 3];', Context.None],
    ['const x, y = 1;', Context.None],
    ['do const x = 1; while (false)', Context.None],
    ['const [...{ x }, y] = [1, 2, 3];', Context.None],
    ['const [...x, y] = [1, 2, 3];', Context.None],
    // Babylon PR: https://github.com/babel/babylon/pull/195
    ['const { foo: enum } = bar();', Context.None],
    ['function foo({ bar: enum }) {}', Context.None],
    ['const foo', Context.None],
    ['const foo, bar;', Context.None],
    ['const foo, bar', Context.None],
    ['const\nfoo', Context.None],
    ['const\nfoo()', Context.None],
    ['const [foo] = arr, bar;', Context.None],
    ['const foo, [bar] = arr2;', Context.None],
    ['const [foo];', Context.None],
    ['const [foo = x];', Context.None],
    ['const [foo], bar;', Context.None],
    ['const foo, [bar];', Context.None],
    ['const [foo:bar] = obj;', Context.None],
    ['const [...foo, bar] = obj;', Context.None],
    ['const [...foo,] = obj;', Context.None],
    ['const [...foo,,] = obj;', Context.None],
    ['const [...[foo + bar]] = obj;', Context.None],
    ['const [...[foo, bar],] = obj;', Context.None],
    ['const [...[foo, bar],,] = obj;', Context.None],
    ['const [...bar = foo] = obj;', Context.None],
    ['const [... ...foo] = obj;', Context.None],
    ['const [...] = obj;', Context.None],
    ['const const', Context.None],
    ['const', Context.None],
    ['const a = 2,', Context.None],
    ['const [...,] = obj;', Context.None],
    ['const [.x] = obj;', Context.None],
    ['const [..x] = obj;', Context.None],
    ['const {,} = obj;', Context.None],
    ['const {,,} = obj;', Context.None],
    ['const {x,,} = obj;', Context.None],
    ['const {,x} = obj;', Context.None],
    ['const {,,x} = obj;', Context.None],
    ['const {x,, y} = obj;', Context.None],
    ['const {x} = a, obj;', Context.None],
    ['const x, {y} = obj;', Context.None],
    ['const {x};', Context.None],
    ['const {x}, {y} = z;', Context.None],
    ['const x, {y};', Context.None],
    ['const {x}, y;', Context.None],
    ['const x = y, {z};', Context.None],
    ['const let = 1;', Context.Strict],
    ['let let = 1;', Context.Strict],
    ['const {x=y};', Context.None],
    ['const {x:y=z};', Context.None],
    ['const {x:y=z} = obj, {a:b=c};', Context.None],
    ['const {a:=c} = z;', Context.None],
    ['const {[x] = y} = z;', Context.None],
    ['const {[x]: y};', Context.None],
    ['const {[x]} = z;', Context.None],
    ['const {[x] = y} = z;', Context.None],
    ['const {[x]: y = z};', Context.None],
    ['const {...[a]} = x', Context.OptionsWebCompat],
    ['const {...{a}} = x', Context.OptionsWebCompat],
    ['const {...[a]} = x', Context.None],
    ['const {...{a}} = x', Context.None],
    ['const {...a=b} = x', Context.None],
    ['const {...a+b} = x', Context.None],
    ['const [(x)] = []', Context.None],
    ['const a, [...x] = y', Context.None],
    ['const foo;', Context.Module],
    ['const foo, bar = x;', Context.None],
    ['const [a)] = [];', Context.None],
    ['const [[(a)], ((((((([b])))))))] = [[],[]];', Context.None],
    ['const [a--] = [];', Context.None],
    ['const [++a] = [];', Context.None],
    ['const [1, a] = [];', Context.None],
    ['const [...a, b] = [];', Context.None],
    ['const foo =x, bar;', Context.None],
    ['const foo, bar;', Context.Module],
    ['const [a, let, b] = [1, 2, 3];', Context.None],
    ['const {let} = 1;', Context.None],
  ]);

  pass('Declarations - const (pass)', [
    ['"use strict"; const { [eval]: []} = a;', Context.None],
    ['const { [eval]: []} = a;', Context.None],
    ['const [foo] = x, [bar] = y;', Context.OptionsRanges],
    ['const x = y, [foo] = z;', Context.OptionsRanges],
    ['const [foo=a,bar=b] = x;', Context.OptionsRanges],
    ['const [...bar] = obj;', Context.OptionsRanges],
    ['const x = y, {foo} = z;', Context.OptionsRanges],
    ['const {foo:a,bar:b} = x;', Context.OptionsLoc | Context.OptionsRanges],
    ['const a = b', Context.None],
    ['for (const [,,] of x);', Context.None],
    ['for (const [,] of x);', Context.None],
    ['for (const {a, [x]: y} in obj);', Context.None],
    ['for (const {x : y, z, a : b = c} in obj);', Context.OptionsRanges],
    [
      `const {
        [({ ...rest }) => {
          let { ...b } = {};
        }]: a,
        [({ ...d } = {})]: c,
      } = {};`,
      Context.None,
    ],
    [
      `const {
          a = ({ ...rest }) => {
            let { ...b } = {};
          },
          c = ({ ...d } = {}),
        } = {};`,
      Context.None,
    ],
    ['const { a: { ...bar }, b: { ...baz }, ...foo } = obj;', Context.None],
    [
      `var z = {};
            var { ...x } = z;
            var { ...a } = { a: 1 };
            var { ...x } = a.b;
            var { ...x } = a();
            var {x1, ...y1} = z;
            x1++;
            var { [a]: b, ...c } = z;
            var {x1, ...y1} = z;
            let {x2, y2, ...z2} = z;
            const {w3, x3, y3, ...z4} = z;

            let {
              x: { a: xa, [d]: f, ...asdf },
              y: { ...d },
              ...g
            } = complex;

            let { x4: { ...y4 } } = z;`,
      Context.OptionsRanges,
    ],
    [
      `let {
                a: [b, ...arrayRest],
                c = function(...functionRest){},
                ...objectRest
              } = {
                a: [1, 2, 3, 4],
                d: "oyez"
              };`,
      Context.None,
    ],
    [
      `// ForXStatement
                for (var {a, ...b} of []) {}
                for ({a, ...b} of []) {}
                async function a() {
                  for await ({a, ...b} of []) {}
                }

                // skip
                for ({a} in {}) {}
                for ({a} of []) {}
                async function a() {
                  for await ({a} of []) {}
                }

                for (a in {}) {}
                for (a of []) {}
                async function a() {
                  for await (a of []) {}
                }`,
      Context.OptionsRanges,
    ],
    ['const foo = bar;', Context.None],
  ]);
});
