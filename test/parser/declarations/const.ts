import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

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
        parseSource(`var ${arg} = x`);
      });
    });

    it(`let ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`var ${arg} = x`);
      });
    });

    it(`let ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`var ${arg} = x`, { webcompat: true });
      });
    });

    it(`for (const  ${arg}  = x;;);`, () => {
      t.throws(() => {
        parseSource(`for (const  ${arg}  = x;;);`);
      });
    });
  }

  for (const arg of ['break', 'implements', 'package', 'protected', 'interface', 'private', 'public', 'static']) {
    it(`const ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`const ${arg} = x`, { impliedStrict: true });
      });
    });
    it(`for (const  ${arg}  = x;;);`, () => {
      t.throws(() => {
        parseSource(`for (const  ${arg}  = x;;);`, { impliedStrict: true });
      });
    });

    it(`for (const  ${arg}  = x;;);`, () => {
      t.throws(() => {
        parseSource(`for (const  ${arg}  = x;;);`, { sourceType: 'module', webcompat: true });
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
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  fail('Declarations - const (fail)', [
    'const {foo,,} = x;',
    'const [.x] = obj;',
    'const [..x] = obj;',
    'const [...] = obj;',
    'const [... ...foo] = obj;',
    'const [...[a, b],,] = obj;',
    'const [...foo,] = obj;',
    'for (const {};;);',
    'const {};',
    'const foo;',
    'do const x = 1; while (false)',
    'while (false) const x = 1;',
    'label: const x;',
    'while (false) const x;',
    'const [...x = []] = [];',
    'const [...[x], y] = [1, 2, 3];',
    'const x, y = 1;',
    'do const x = 1; while (false)',
    'const [...{ x }, y] = [1, 2, 3];',
    'const [...x, y] = [1, 2, 3];',
    // Babylon PR: https://github.com/babel/babylon/pull/195
    'const { foo: enum } = bar();',
    'function foo({ bar: enum }) {}',
    'const foo',
    'const foo, bar;',
    'const foo, bar',
    'const\nfoo',
    'const\nfoo()',
    'const [foo] = arr, bar;',
    'const foo, [bar] = arr2;',
    'const [foo];',
    'const [foo = x];',
    'const [foo], bar;',
    'const foo, [bar];',
    'const [foo:bar] = obj;',
    'const [...foo, bar] = obj;',
    'const [...foo,] = obj;',
    'const [...foo,,] = obj;',
    'const [...[foo + bar]] = obj;',
    'const [...[foo, bar],] = obj;',
    'const [...[foo, bar],,] = obj;',
    'const [...bar = foo] = obj;',
    'const [... ...foo] = obj;',
    'const [...] = obj;',
    'const const',
    'const',
    'const a = 2,',
    'const [...,] = obj;',
    'const [.x] = obj;',
    'const [..x] = obj;',
    'const {,} = obj;',
    'const {,,} = obj;',
    'const {x,,} = obj;',
    'const {,x} = obj;',
    'const {,,x} = obj;',
    'const {x,, y} = obj;',
    'const {x} = a, obj;',
    'const x, {y} = obj;',
    'const {x};',
    'const {x}, {y} = z;',
    'const x, {y};',
    'const {x}, y;',
    'const x = y, {z};',
    { code: 'const let = 1;', options: { impliedStrict: true } },
    { code: 'let let = 1;', options: { impliedStrict: true } },
    'const {x=y};',
    'const {x:y=z};',
    'const {x:y=z} = obj, {a:b=c};',
    'const {a:=c} = z;',
    'const {[x] = y} = z;',
    'const {[x]: y};',
    'const {[x]} = z;',
    'const {[x] = y} = z;',
    'const {[x]: y = z};',
    { code: 'const {...[a]} = x', options: { webcompat: true } },
    { code: 'const {...{a}} = x', options: { webcompat: true } },
    'const {...[a]} = x',
    'const {...{a}} = x',
    'const {...a=b} = x',
    'const {...a+b} = x',
    'const [(x)] = []',
    'const a, [...x] = y',
    { code: 'const foo;', options: { sourceType: 'module' } },
    'const foo, bar = x;',
    'const [a)] = [];',
    'const [[(a)], ((((((([b])))))))] = [[],[]];',
    'const [a--] = [];',
    'const [++a] = [];',
    'const [1, a] = [];',
    'const [...a, b] = [];',
    'const foo =x, bar;',
    { code: 'const foo, bar;', options: { sourceType: 'module' } },
    'const [a, let, b] = [1, 2, 3];',
    'const {let} = 1;',
  ]);

  pass('Declarations - const (pass)', [
    '"use strict"; const { [eval]: []} = a;',
    'const { [eval]: []} = a;',
    { code: 'const [foo] = x, [bar] = y;', options: { ranges: true } },
    { code: 'const x = y, [foo] = z;', options: { ranges: true } },
    { code: 'const [foo=a,bar=b] = x;', options: { ranges: true } },
    { code: 'const [...bar] = obj;', options: { ranges: true } },
    { code: 'const x = y, {foo} = z;', options: { ranges: true } },
    { code: 'const {foo:a,bar:b} = x;', options: { ranges: true, loc: true } },
    'const a = b',
    'for (const [,,] of x);',
    'for (const [,] of x);',
    'for (const {a, [x]: y} in obj);',
    { code: 'for (const {x : y, z, a : b = c} in obj);', options: { ranges: true } },
    outdent`
      const {
        [({ ...rest }) => {
          let { ...b } = {};
        }]: a,
        [({ ...d } = {})]: c,
      } = {};
    `,
    outdent`
      const {
        a = ({ ...rest }) => {
          let { ...b } = {};
        },
        c = ({ ...d } = {}),
      } = {};
    `,
    'const { a: { ...bar }, b: { ...baz }, ...foo } = obj;',
    {
      code: outdent`
        var z = {};
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

        let { x4: { ...y4 } } = z;
      `,
      options: { ranges: true },
    },
    outdent`
      let {
        a: [b, ...arrayRest],
        c = function(...functionRest){},
        ...objectRest
      } = {
        a: [1, 2, 3, 4],
        d: "oyez"
      };
    `,
    {
      code: outdent`
        // ForXStatement
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
        }
      `,
      options: { ranges: true },
    },
    'const foo = bar;',
  ]);
});
