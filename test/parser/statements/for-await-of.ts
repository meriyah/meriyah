import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Statements - For await of', () => {
  const wrappers = [
    { start: 'var a1 = async function*asyncGenWithName1(){', finish: '}' },
    { start: 'async function*asyncGenWithName2(){ ', finish: '}' },
    { start: 'async function asyncWithName2(){ ', finish: '}' },
    { start: 'class A { async * method() { ', finish: ' } }' },
    { start: 'var a1 = async () => {', finish: '}' },
    { start: 'var a1 = async () => { try {   ', finish: ' } catch (e) {} }' },
    { start: 'var a1 = async () => { {   ', finish: ' } }' },
    { start: 'var a1 = async () => { if (true) {   ', finish: ' } }' },
    { start: 'var a1 = async () => { if (true) ', finish: ' }' },
    {
      start: 'var a1 = async () => { if (true) foo(); else { ',
      finish: ' } }',
    },
    { start: 'var a1 = async () => { while (true) { ', finish: ' } }' },
    { start: 'var a1 = async () => { for(;;) { ', finish: ' } }' },
    { start: "var a1 = async () => { switch(e) { case '1' :  ", finish: ' } }' },
  ];

  const expressions = [
    'for await(const value of foo()) {}',
    'for await(let value of foo()) {}',
    'for await(var value of foo()) {}',
    'for await(var [a, b] of foo()) {}',
    'for await(let {a, b} of foo()) {}',
    'for await(const [... b] of foo()) {}',
    'for await(const [,,, b] of foo()) {}',
    'for await(const value of boo) {}',
    'for await(let value of boo) {}',
    'for await(const value of foo().boo()) {}',
    'for await(let value of foo.boo()) {}',
    'for await(let value of foo.boo(value)) {}',
    'for await(let value of [1,2,3]) {}',
    'for await(value of [1,2,3]) {}',
    'for await(value of x + x) {}',
    'for await(value of f()) {}',
    'for await(value of (x + x)) {}',
  ];

  wrappers.forEach((wrapper) => {
    expressions.forEach((exp) => {
      it(wrapper.start + exp + wrapper.finish, () => {
        t.doesNotThrow(() => {
          parseSource(wrapper.start + exp + wrapper.finish);
        });
      });
      it(wrapper.start + exp + wrapper.finish, () => {
        t.doesNotThrow(() => {
          parseSource(wrapper.start + exp + wrapper.finish, { lexical: true });
        });
      });
    });
  });

  for (const arg of [
    'for await (x of []) function d() {};',
    'for await (x of []) function d() {}; return d;',
    'for await (x of []) function* g() {};',
    'for await (x of []) function* g() {}; return g;',
    'for await (x of []) async function a() {};',
    'for await (x of []) async function a() {}; return a;',
  ]) {
    it(`async function f() {${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`);
      });
    });

    it(`async function f() {${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`, { webcompat: true });
      });
    });

    it(`async function f() { 'use strict'; ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { 'use strict'; ${arg} }`);
      });
    });
  }

  for (const arg of [
    '(a = 1 of [])',
    '(a = 1) of [])',
    '(a.b = 1 of [])',
    '([a] = 1 of [])',
    '(([a] = 1) of [])',
    '([a = 1] = 1 of [])',
    '(([a = 1] = 1) of [])',
    '([a = 1 = 1, ...b] = 1 of [])',
    '(([a = 1 = 1, ...b] = 1) of [])',
    '({a} = 1 of [])',
    '(({a} = 1) of [])',
    '({a: a} = 1 of [])',
    '(({a: a} = 1) of [])',
    "({'a': a} = 1 of [])",
    "(({'a': a} = 1) of [])",
    '({"a": a} = 1 of [])',
    '(({"a": a} = 1) of [])',
    '({[Symbol.iterator]: a} = 1 of [])',
    '(({[Symbol.iterator]: a} = 1) of [])',
    '({0: a} = 1 of [])',
    '({0: a = 1} = 1 of [])',
    '(({0: a = 1} = 1) of [])',
    '(function a() {} of [])',
    '([1] of [])',
    '({a: 1} of [])',
    '(var a = 1 of [])',
    '(var a, b of [])',
    '(var [a] = 1 of [])',
    '(var [a], b of [])',
    '(var [a = 1] = 1 of [])',
    '(var [a = 1], b of [])',
    '(var [a = 1 = 1, ...b] of [])',
    '(var [a = 1, ...b], c of [])',
    '(var {a} = 1 of [])',
    '(var {a}, b of [])',
    '(var {a: a} = 1 of [])',
    '(var {a: a}, b of [])',
    "(var {'a': a} = 1 of [])",
    "(var {'a': a}, b of [])",
    '(var {"a": a} = 1 of [])',
    '(var {"a": a}, b of [])',
    '(var {[Symbol.iterator]: a} = 1 of [])',
    '(var {[Symbol.iterator]: a}, b of [])',
    '(var {0: a} = 1 of [])',
    '(var {0: a}, b of [])',
    '(var {a = 1} = 1 of [])',
    '(var {a = 1}, b of [])',
    '(var {a: a = 1} = 1 of [])',
    '(var {a: a = 1}, b of [])',
    "(var {'a': a = 1} = 1 of [])",
    "(var {'a': a = 1}, b of [])",
    '(var {"a": a = 1} = 1 of [])',
    '(var {"a": a = 1}, b of [])',
    '(var {[Symbol.iterator]: a = 1} = 1 of [])',
    '(var {[Symbol.iterator]: a = 1}, b of [])',
    '(var {0: a = 1} = 1 of [])',
    '(var {0: a = 1}, b of [])',
    '(let a = 1 of [])',
    '(let a, b of [])',
    '(let [a] = 1 of [])',
    '(let [a], b of [])',
    '(let [a = 1] = 1 of [])',
    '(let [a = 1], b of [])',
    '(let [a = 1, ...b] = 1 of [])',
    '(let [a = 1, ...b], c of [])',
    '(let {a} = 1 of [])',
    '(let {a}, b of [])',
    '(let {a: a} = 1 of [])',
    '(let {a: a}, b of [])',
    "(let {'a': a} = 1 of [])",
    "(let {'a': a}, b of [])",
    '(let {"a": a} = 1 of [])',
    '(let {"a": a}, b of [])',
    '(let {[Symbol.iterator]: a} = 1 of [])',
    '(let {[Symbol.iterator]: a}, b of [])',
    '(let {0: a} = 1 of [])',
    '(let {0: a}, b of [])',
    '(let {a = 1} = 1 of [])',
    '(let {a = 1}, b of [])',
    '(let {a: a = 1} = 1 of [])',
    '(let {a: a = 1}, b of [])',
    "(let {'a': a = 1} = 1 of [])",
    "(let {'a': a = 1}, b of [])",
    '(let {"a": a = 1} = 1 of [])',
    '(let {"a": a = 1}, b of [])',
    '(let {[Symbol.iterator]: a = 1} = 1 of [])',
    '(let {[Symbol.iterator]: a = 1}, b of [])',
    '(let {0: a = 1} = 1 of [])',
    '(let {0: a = 1}, b of [])',
    '(const a = 1 of [])',
    '(const a, b of [])',
    '(const [a] = 1 of [])',
    '(const [a], b of [])',
    '(const [a = 1] = 1 of [])',
    '(const [a = 1], b of [])',
    '(const [a = 1, ...b] = 1 of [])',
    '(const [a = 1, ...b], b of [])',
    '(const {a} = 1 of [])',
    '(const {a}, b of [])',
    '(const {a: a} = 1 of [])',
    '(const {a: a}, b of [])',
    "(const {'a': a} = 1 of [])",
    "(const {'a': a}, b of [])",
    '(const {"a": a} = 1 of [])',
    '(const {"a": a}, b of [])',
    '(const {[Symbol.iterator]: a} = 1 of [])',
    '(const {[Symbol.iterator]: a}, b of [])',
    '(const {0: a} = 1 of [])',
    '(const {0: a}, b of [])',
    '(const {a = 1} = 1 of [])',
    '(const {a = 1}, b of [])',
    '(const {a: a = 1} = 1 of [])',
    '(const {a: a = 1}, b of [])',
    "(const {'a': a = 1} = 1 of [])",
    "(const {'a': a = 1}, b of [])",
    '(const {"a": a = 1} = 1 of [])',
    '(const {"a": a = 1}, b of [])',
    '(const {[Symbol.iterator]: a = 1} = 1 of [])',
    '(const {[Symbol.iterator]: a = 1}, b of [])',
    '(const {0: a = 1} = 1 of [])',
    '(const {0: a = 1}, b of [])',
    '(;;)',
    '(x;y;z)',
    '(const x in y)',
    '(let x in y)',
    '(var x in y)',
    '([x] in y)',
    '({x} in y)',
    '("foo".x in y)',
    'for await (a in b) {}',
    'for await (;;) {}',
  ]) {
    it(`async function f() { for await ${arg}; }`, () => {
      t.throws(() => {
        parseSource(`async function f() { for await ${arg}; }`);
      });
    });
    it(`async function f() { for await ${arg}; }`, () => {
      t.throws(() => {
        parseSource(`async function f() { for await ${arg}; }`, { lexical: true });
      });
    });
    it(`async function f() { for await ${arg}; }`, () => {
      t.throws(() => {
        parseSource(`async function f() { for await ${arg}; }`, { webcompat: true, lexical: true });
      });
    });
    it(`async function f() { 'use strict'; for await ${arg}; }`, () => {
      t.throws(() => {
        parseSource(`async function f() { 'use strict'; for await ${arg}; }`);
      });
    });

    it(`async function f() { for await  ${arg}  {} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { for await  ${arg} {} }`);
      });
    });

    it(`async function * f() { 'use strict'; for await ${arg}; }`, () => {
      t.throws(() => {
        parseSource(`async function * f() { 'use strict'; for await ${arg}; }`);
      });
    });

    it(`async function * f() { for await ${arg}; }`, () => {
      t.throws(() => {
        parseSource(`async function * f() { for await ${arg}; }`);
      });
    });
  }

  for (const arg of [
    '(a of [])',
    '(a.b of [])',
    '([a] of [])',
    '([a = 1] of [])',
    '([a = 1, ...b] of [])',
    '({a} of [])',
    '({a: a} of [])',
    "({'a': a} of [])",
    '({"a": a} of [])',
    '({[Symbol.iterator]: a} of [])',
    '({0: a} of [])',
    '({a = 1} of [])',
    '({a: a = 1} of [])',
    "({'a': a = 1} of [])",
    '({"a": a = 1} of [])',
    '({[Symbol.iterator]: a = 1} of [])',
    '({0: a = 1} of [])',
    '(var x of [])',
    '(var [a] of [])',
    '(var [a = 1] of [])',
    '(var [a = 1, ...b] of [])',
    '(var {a} of [])',
    '(var {a: a} of [])',
    "(var {'a': a} of [])",
    '(var {"a": a} of [])',
    '(var {[Symbol.iterator]: a} of [])',
    '(var {0: a} of [])',
    '(var {a = 1} of [])',
    '(var {a: a = 1} of [])',
    "(var {'a': a = 1} of [])",
    '(var {"a": a = 1} of [])',
    '(var {[Symbol.iterator]: a = 1} of [])',
    '(var {0: a = 1} of [])',
    '(let a of [])',
    '(let [a] of [])',
    '(let [a = 1] of [])',
    '(let [a = 1, ...b] of [])',
    '(let {a} of [])',
    '(let {a: a} of [])',
    "(let {'a': a} of [])",
    '(let {"a": a} of [])',
    '(let {[Symbol.iterator]: a} of [])',
    '(let {0: a} of [])',
    '(let {a = 1} of [])',
    '(let {a: a = 1} of [])',
    "(let {'a': a = 1} of [])",
    '(let {"a": a = 1} of [])',
    '(let {[Symbol.iterator]: a = 1} of [])',
    '(let {0: a = 1} of [])',
    '(/foo/g[x] of c)',
    '(/foo/g.x of c)',
    '(const a of [])',
    '(const [a] of [])',
    '(const [a = 1] of [])',
    '(const [a = 1, ...b] of [])',
    '(const {a} of [])',
    '(const {a: a} of [])',
    "(const {'a': a} of [])",
    '(const {"a": a} of [])',
    '(const {[Symbol.iterator]: a} of [])',
    '(const {0: a} of [])',
    '(const {a = 1} of [])',
    '(const {a: a = 1} of [])',
    "(const {'a': a = 1} of [])",
    '(const {"a": a = 1} of [])',
    '(const {[Symbol.iterator]: a = 1} of [])',
    '(const {0: a = 1} of [])',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { let y; for await  ${arg}; }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { 'use strict'; for await\n ${arg}; }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { 'use strict'; for await ${arg}  { } }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { 'use strict'; for await ${arg}  { } }`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { 'use strict'; for await  ${arg}  { } }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { for\nawait  ${arg}  { } }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { 'use strict'; for\nawait  ${arg}  { } }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { for await ${arg}; }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { for await ${arg}; }`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { let y; for await  ${arg}; }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { 'use strict'; let y; for\nawait ${arg}{ } }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { 'use strict'; let y; for\nawait ${arg}; }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { 'use strict'; let y; for await ${arg}; }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { 'use strict'; let y; for await\n ${arg}; }`);
      });
    });
  }

  fail('Statements - For await of (fail)', [
    {
      code: 'async function fn() { for await (var [...[ x ] = []] of (async function*() { yield* [[]]; })()) {}}',
      options: { impliedStrict: true },
    },
  ]);

  for (const arg of [
    'for await ([v2 = 10, vNull = 11, vHole = 12, vUndefined = 13, vOob = 14] of [[2, null, , undefined]]) {}',
    'for await ([ a = x += 1, b = x *= 2 ] of [[]]) {}',
    'for await ([ a = x += 1, b = x *= 2 ] of [[]]) {}',
    'for await ([[ _ ]] of [[ , ]]) {}',
    'for await ([[ x ]] of [[]]) {}',
    'for await ([{ x }] of [[null]]) {}',
    'for await ([{ x }] of [[ , ]]) {}',
    'for await ([{ x = yield }] of [[{}]]) {}',
    'for await ([{ x }] of [[{ x: 2 }]]) {}',
    outdent`
      for await ([] of ["foo"
      ]) {}
    `,
    'for await ({ xCls = class x {}, cls = class {}, xCls2 = class { static name() {} } } of [{}]) {}',
    'for await ([...{ 0: x, length }] of [[]]) {}',
    'for await ({} of [false]) {}',
    'for await ({ w, x, y } of [{ x: 5 }]) {}',
    'for await ({ xCover = (0, function() {}), cover = (function() {}) } of [{}]) {}',
    'for await ({ eval = 3, arguments = 4 } of [{}]) {}',
    'for await ({ unresolvable } of [{}]) {}',
    'for await ({ eval = 3, arguments = 4 } of [{}]) {}',
    'for await ({ x = yield } of [{}]) {}',
    'for await ({ y: x = 1 } of [{ y: null }]) {}',
    'for await ({ x: x[yield] } of [{ x: 23 }]) {}',
    'for await ({ x: { x = yield } } of [{ x: {} }]) {}',
    'for await ({...src.y} of [{ x: 1, y: 2}]) {}',
    'for await (const [x] of [iter]) {}',
    'for await (const [[x]] of [[null]]) {}',
    'for await (const [x = 23] of [[,]]) {}',
    'for await (const [{ x, y, z } = { x: 44, y: 55, z: 66 }] of [[{ x: 11, y: 22, z: 33 }]]) {}',
    'for await (const [...[,]] of [g()]) {}',
    'for await (const [...x] of [[1, 2, 3]]) {}',
    'for await (const [x] of (async function*() { yield* [[]]; })()) {}',
    'for await (const [{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] of (async function*() { yield* [[{ u: 777, w: 888, y: 999 }]]; })()) {}',
    'for await (const { cover = (function () {}), xCover = (0, function() {})  } of (async function*() { yield* [{}]; })()) {}',
    'for await (const { w: [x, y, z] = [4, 5, 6] } of (async function*() { yield* [{ w: [7, undefined, ] }]; })()) {}',
    'for await (let [[...x] = function() {}()] of [[[2, 1, 3]]]) {}',
    'for await (let [x = 23] of [[]]) {}',
    'for await (let [...[]] of [function*() {}()]) {}',
    outdent`
      for await (let [x] of (async function*() {
        yield* [{}];
      })()) {}
    `,
    'for await (let [x = 23] of (async function*() { yield* [[undefined]]; })()) {}',
    'for await (let [{ x, y, z } = { x: 44, y: 55, z: 66 }] of (async function*() { yield* [[{ x: 11, y: 22, z: 33 }]]; })()) {}',
    'for await (let { w: { x, y, z } = { x: 4, y: 5, z: 6 } } of [{ w: { x: undefined, z: 7 } }]) {}',
    'for await (var [cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }] of [[]]) {}',
    'for await (var [x] of [[]]) {}',
    'for await (var { w: { x, y, z } = undefined } of [{ }]) { return; }',
    'for await ([ xGen = function* x() {}, gen = function*() {} ] of [[]]) {}',
    'for await ({} of [false]) {}',
    'for await ({ x, y } of [{ x: 3 }]) {}',
    'for await ({ xCover = (0, function() {}), cover = (function() {}) } of [{}]) {}',
    'for await ({ y: x = 1 } of [{ y: 2 }]) {}',
    'for await ({ x: { x = yield } } of [{ x: {} }]) {}',
    'for await (const [cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }] of [[]]) {}',
    'for await (const [{ x }] of [[null]]) {}',
    'for await (const [...{ 0: v, 1: w, 2: x, 3: y, length: z }] of [[7, 8, 9]]) {}',
    'for await (const {} of [undefined]) {}',
    'for await (x of y) {}',
    'for await ([x] of y) {}',
    'for await ({x} of y) {}',
    'for await ("foo".x of y) {}',
    'for await (var x of y) {}',
    'for await (var x of y) {}',
    'for ([].x in y);',
    'for await (let x of y) {}',
    'for await (const x of y) {}',
    'for await ((x) of y) {}',
    'for await (let [[x, y, z] = [4, 5, 6]] of [[]]) {}',
    'for await (let [[] = function() {}()] of [[]]) {}',
    'for await (let [cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }] of [[]]) {}',
    'for await (let [fn = function () {}, xFn = function x() {}] of [[]]) {}',
    'for await (const [{ x, y, z } = { x: 44, y: 55, z: 66 }] of (async function*() { yield* [[]]; })()) {}',
    'for await (const [{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] of (async function*() { yield* [[{ u: 777, w: 888, y: 999 }]];})()) {}',
    'for await (const [...x] of [function*() {}()]) {}',
    'for (var { w: { x, y, z } = { x: 4, y: 5, z: 6 } } of [{ w: null }]) {}',
    'for ([x] of [[0]]) {}',
    'for await (a of b) {}',
    'for await ("foo"[x] of c) d;',
    'for await (456..x of c) d;',
    'for await (456[x] of c) d;',
    'for await (((x)=>{}).x of y);',
    'for await (let a of b) {} for (let c of d) {}',
    'for await ([...[x[yield]]] of [[86]]) {}',
    'for await ([...{ 0: x, length }] of [[null]]) {}',
    'for (var { w: [x, y, z] = [4, 5, 6] } of [{ w: null }]) {}',
    'for await (const { x, } of [{ x: 23 }]) {}',
    'for await (const { w: { x, y, z } = { x: 4, y: 5, z: 6 } } of [{ w: { x: undefined, z: 7 } }]) {}',
    'for await (let [{ x, y, z } = { x: 44, y: 55, z: 66 }] of (async function*() { yield* [[{ x: 11, y: 22, z: 33 }]]; })()) {}',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function fn() { ${arg} }`);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function *fn() { ${arg} }`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async () => { ${arg} }`);
      });
    });
  }

  it('accepts top level for await in module context', () => {
    t.doesNotThrow(() => {
      parseSource('for await (const a of b) {}', { sourceType: 'module' });
    });

    t.throws(() => {
      parseSource('for await (const a of b) {}');
    });

    t.throws(() => {
      parseSource('function c() { for await (const a of b) {} }', { sourceType: 'module' });
    });
  });
});
