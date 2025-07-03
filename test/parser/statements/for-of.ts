import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Statements - For of', () => {
  for (const arg of [
    'for(var [] = 0 of {});',
    'for(var [,] = 0 of {});',
    'for(var [a] = 0 of {});',
    'for(var [a = 0] = 0 of {});',
    'for(var [...a] = 0 of {});',
    'for(var [...[]] = 0 of {});',
    'for(var [...[a]] = 0 of {});',
    'for(var {} = 0 of {});',
    'for(var {p: x} = 0 of {});',
    'for(var {p: x = 0} = 0 of {});',
    'for(var {x} = 0 of {});',
    'for(var {x = 0} = 0 of {});',
    'for(let x = 0 of {});',
    'for(let [] = 0 of {});',
    'for(let [,] = 0 of {});',
    'for(let [a] = 0 of {});',
    'for(let [a = 0] = 0 of {});',
    'for(let [...a] = 0 of {});',
    'for(let [...[]] = 0 of {});',
    'for(let [...[a]] = 0 of {});',
    'for(let {} = 0 of {});',
    'for(let {p: x} = 0 of {});',
    'for(let {p: x = 0} = 0 of {});',
    'for(let {x} = 0 of {});',
    'for(let {x = 0} = 0 of {});',
    'for(const x = 0 of {});',
    'for(const [] = 0 of {});',
    'for(const [,] = 0 of {});',
    'for(const [a] = 0 of {});',
    'for(const [a = 0] = 0 of {});',
    'for(const [...a] = 0 of {});',
    'for(const [...[]] = 0 of {});',
    'for(const [...[a]] = 0 of {});',
    'for(const {} = 0 of {});',
    'for(const {p: x} = 0 of {});',
    'for(const {p: x = 0} = 0 of {});',
    'for(const {x} = 0 of {});',
    'for(const {x = 0} = 0 of {});',
    'for ([...x,] of [[]]);',
    'for (x = 0 of {});',
    'for(o[0] = 0 of {});',
    'for ((a++) of c);',
    'for (+a().b of c);',
    'for (void a.b of c);',
    'for (/foo/ of {});',
    'for(x = 0 of {});',
    'function f() { for (of y) { } }',
    'function f() { for (of of) { } }',
    'function f() { for (var of y) { } }',
    'function f() { for (var of y) { } }',
    'function f() { for (let of of) { } }',
    'function f() { for (var x = 3 of y) { } }',
    'function f() { for (x of y;) { } }',
    'for (let x = 3 of y) { } }',
    'for([] = 0 of {});',
    'for([,] = 0 of {});',
    'for([a] = 0 of {});',
    'for([a = 0] = 0 of {});',
    'for([...a] = 0 of {});',
    'for([...[]] = 0 of {});',
    'for([...[a]] = 0 of {});',
    'for({} = 0 of {});',
    'for({p: x} = 0 of {});',
    'for({p: x = 0} = 0 of {});',
    'for({x} = 0 of {});',
    'for({x = 0} = 0 of {});',
    'for(o.p = 0 of {});',
    'for(o[0] = 0 of {});',
    'for(f() = 0 of {});',
    'for(({a}) of 0);',
    'for(([a]) of 0);',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });
  }

  fail('Statements - For of (fail)', [
    'for (let of x) y',
    'for (let x of a,b) c',
    'for (x in y of) ;',
    'for (x in y of z) ;',
    'for (let[a+b] of x);',
    'for (let() of x);',
    'for (let().foo of x);',
    'for (let.foo of x);',
    'for (let of x);',
    'for (const i, j = void 0 of [1, 2, 3]) {}',
    'for(const x of [], []) {}',
    'for(x of [], []) {}',
    'for(var x of [], []) {}',
    'for(let x of [], []) {}',
    'for (var i, j of {}) {}',
    'for(let {} = 0 of {});',
    'for(let {p: x} = 0 of {});',
    'for(let {p: x = 0} = 0 of {});',
    'for(let {x} = 0 of {});',
    'for(let {x = 0} = 0 of {});',
    'for (let of x) y',
    'for (var i, j of [1, 2, 3]) {}',
    'for (var i, j = 1 of {}) {}',
    'for (var i, j = void 0 of [1, 2, 3]) {}',
    'for (let i, j of {}) {}',
    'for (let i, j of [1, 2, 3]) {}',
    'for (let i, j = 1 of {}) {}',
    'for (let i, j = void 0 of [1, 2, 3]) {}',
    'for (const i, j of {}) {}',
    'for (const i, j of [1, 2, 3]) {}',
    'for (const i, j = 1 of {}) {}',
    'for(const [,] = 0 of {});',
    'for(const [a] = 0 of {});',
    'for(const [a = 0] = 0 of {});',
    'for(const [...a] = 0 of {});',
    'for(const [...[]] = 0 of {});',
    'for(const [...[a]] = 0 of {});',
    'for(const {} = 0 of {});',
    'for (this of []);',
    'for (this of []; ;);',
    'for (({x}) of [{x:1}]) {}',
    'for (var ({x}) of [{x:1}]) {}',
    'for await (({x}) of [{x:1}]) {}',
    'for(const {p: x} = 0 of {});',
    'for(const {p: x = 0} = 0 of {});',
    'for(const {x} = 0 of {});',
    'for(const {x = 0} = 0 of {});',
    'for(x = 0 of {});',
    'for ({...rest, b} of [{}]) ;',
    'for(o.p = 0 of {});',
    'for(o[0] = 0 of {});',
    'for(f() = 0 of {});',
    'for(({a}) of 0);',
    'for(([a]) of 0);',
    'for(var [] = 0 of {});',
    'for(var [,] = 0 of {});',
    'for(var [a] = 0 of {});',
    'for(var [a = 0] = 0 of {});',
    'for(var [...a] = 0 of {});',
    'for(var [...[]] = 0 of {});',
    'for(var [...[a]] = 0 of {});',
    'for(var {} = 0 of {});',
    'for(var {p: x} = 0 of {});',
    'for(var {p: x = 0} = 0 of {});',
    'for(var {x} = 0 of {});',
    'for(var {x = 0} = 0 of {});',
    'for(let x = 0 of {});',
    'for (let x of y, z) {}',
    'for(let [] = 0 of {});',
    'for (var [x] = 1 of []) {}',
    'for (let x = 1 of []) {}',
    'for (let [x] = 1 of []) {}',
    'for (let {x} = 1 of []) {}',
    'for (const x = 1 of []) {}',
    'for (const [x] = 1 of []) {}',
    'for (const {x} = 1 of []) {}',
    'for ((this) of []) {}',
    'for (var [x]   of 1, 2) {}',
    'for (var x     of 1, 2) {}',
    'for (var x = 1 of []) {}',
    'for (this of []) {}',
    'for(let [,] = 0 of {});',
    'for(let [a] = 0 of {});',
    'for(let [a = 0] = 0 of {});',
    'for(let [...a] = 0 of {});',
    'for(let [...[]] = 0 of {});',
    'for(let [...[a]] = 0 of {});',
    'for({x} = 0 of {});',
    'for ({p: x = 0} = 0 of {});',
    'for ({x} = 0 of {});',
    'for(o.p = 0 of {});',
    'for(([a]) of 0);',
    'for(let of 0);',
    'for(this of 0); ',
    'for(var a = 0 of b);',
    'for(let a = 0 of b);',
    'for(const a = 0 of b);',
    'for(({a}) of 0);',
    'for(([a]) of 0);',
    'for(var a of b, c);',
    'for(a of b, c);',
    'for(a of b, c);',
    'for(a of b, c);',
    'for(a of b, c);',
    'for(a of b, c);',
    'for (function(){} of x);',
    'for ([...[a]] = 0 of {});',
    'for ([] = 0 of {});',
    'for (let [...{ x } = []] of [[]]) {}',
  ]);

  for (const arg of [
    'for({a=0} of b);',
    'for ({[a]: ""[b]} of c) {}',
    'for ({[a]: ""[b] = c} of d) {}',
    'for (let of of ([0])) { }',
    'for (let of of [0]) { }',
    'for (let of; false; ) { }',
    'for (let of, bar; false; ) { }',
    'for (let of = 10; false; ) { }',
    'for (j of x) { foo = j }',
    'for (j of x) { [foo] = [j] }',
    'for (j of x) { var foo = j }',
    'for (j of x) { var [foo] = [j] }',
    'for (j of x) { const [foo] = [j] }',
    'for (j of x) { foo = j }',
    'for (j of x) { [foo] = [j] }',
    'for (j of x) { [[foo]=[42]] = [] }',
    'for (j of x) { var foo = j }',
    'for (j of x) { var [foo] = [j] }',
    'for (j of x) { var [[foo]=[42]] = [] }',
    'for (j of x) { var foo; foo = j }',
    'for (j of x) { var foo; [foo] = [j] }',
    'for (j of x) { var foo; [[foo]=[42]] = [] }',
    'for (j of x) { let foo; foo = j }',
    'for (j of x) { let foo; [foo] = [j] }',
    'for (j of x) { let foo; [[foo]=[42]] = [] }',
    'for (j of x) { let foo = j }',
    'for ([ a = b = c ] of d) ;',
    'for (j of x) { let [foo] = [j] }',
    'for ([ x = y ] of [[]]) {}',
    'for ([ x = y ] of [[]]) {}',
    'for ([ x = yield ] of [[]]) {}',
    'for ([ _ ] of [iterable]) {}',
    'for([{a=0}] of b);',
    'for ([[ _ ]] of [[null]]) {}',
    'for ([[x[yield]]] of [[[22]]]) {}',
    'for ([{ x }] of [[null]]) {}',
    'for ([{ x }] of [[{ x: 2 }]]) {}',
    'for ([ x[yield] ] of [[33]]) {}',
    'for ([,] of [[]]) {}',
    'for ([] of [1]) {}',
    'for ([, , x, , ...y] of [[1, 2, 3, 4, 5, 6]]) {}',
    'for ([...{ x = yield }] of [[{}]]) {}',
    'for ([...x[yield]] of [[33, 44, 55]]) {}',
    'for (const [[x]] of [[null]]) {}',
    'for (const [x = 23] of [[,]]) {}',
    'for (const [{ x, y, z } = { x: 44, y: 55, z: 66 }] of [[]]) {}',
    'for (const [,] of [g()]) {}',
    'for (const [[...x] = [2, 1, 3]] of [[]]) {}',
    'for (const [{ x, y, z } = { x: 44, y: 55, z: 66 }] of [[{ x: 11, y: 22, z: 33 }]]) {}',
    'for (const [...[x, y, z]] of [[3, 4, 5]]) {}',
    'for (const [...x] of [[1, 2, 3]]) {}',
    'for (j of x) { const foo = j }',
    'for (const {} of [null]) {}',
    'for (const {x = y} of [null]) {}',
    'for (const { x, } of [{ x: 23 }]) {}',
    'for (const { w: [x, y, z] = [4, 5, 6] } of [{}]) {}',
    'for (const { x: y = 33 } of [{ }]) {}',
    'for (const { x: y } of [{ x: 23 }]) {}',
    'for (/foo/g[x] of c) d;',
    'for (/foo/g.x of c) d;',
    'for (456[x] of c) d;',
    'for ("foo"[x] of c) d;',
    'for ("foo".x of c) d;',
    'for (const {...x} of [{ get v() { count++; return 2; } }]) {}',
    'for (let [[] = function() { initCount += 1; return iter; }()] of [[]]) {}',
    'for (let [{ x, y, z } = { x: 44, y: 55, z: 66 }] of [[{ x: 11, y: 22, z: 33 }]]) {}',
    'for (let {} of [obj]) {}',
    'for (let { w: [x, y, z] = [4, 5, 6] } of [{ w: [7, undefined, ] }]) {}',
    'for ({} of [false]) {}',
    'for ({} of [null]) {}',
    'for ({} of [undefined]) {}',
    'for ({ x = 1 } of [{}]) {}',
    'for ({ prop = "x" in {} } of [{}]) {}',
    'for ({ prop = "x" in {"a": function() { async(a,) }} } of [{}]) {}',
    'for ({ x = yield } of [{}]) {}',
    'for ({ x = yield * 1} of [{}]) {}',
    'for ({ y: x = 1 } of [{ y: 2 }]) {}',
    'for ({ x: x = yield } of [{}]) {}',
    'for ({ w, a: x } of [{ a: 4 }]) {}',
    'for ({ x: [ x ] } of [{ x: null }]) {}',
    'for ({ x: [y] } of [{ x: [321] }]) {}',
    'for ({ x: { y } } of [{ x: { y: 2 } }]) {}',
    'for ({...rest} of [{ get z() { calls.push("z") }, get a() { calls.push("a") } }]) {}',
    'for (var [[x, y, z] = [4, 5, 6]] of [[]]) {}',
    'for (var [[...x] = [2, 1, 3]] of [[]]) {}',
    'for (var [{ x }] of [[null]]) {}',
    'for (var [{ x }] of [[null]]) {}',
    'for (var {} of [obj]) {}',
    'for (var { x: y = 33 } of [{ }]) {}',
    'for (var { w: { x, y, z } = { x: 4, y: 5, z: 6 } } of [{ w: null }]) {}',
    'for (var {a, b, ...rest} of [{x: 1, y: 2, a: 5, b: 3}]) {}',
    'for (j of x) { const foo = j }',
    'for (j of x) { const [foo] = [j] }',
    'for (j of x) { function foo() {return j} }',
    'for ({j} of x) { foo = j }',
    'for ({j} of x) { [foo] = [j] }',
    'for ({j} of x) { [[foo]=[42]] = [] }',
    'for (of of y) { }',
    'for (let x of y) { }',
    'for (x of y) { }',
    'for (var x of g()) { break; }',
    'for (let of of y) { }',
    'for (var of of y) { }',
    'for (of in y) { }',
    'for (var of in y) { }',
    'for (let of in y) { }',
    'for ({j} of x) { var foo = j }',
    'for ({j} of x) { var [foo] = [j] }',
    'for ({j} of x) { var [[foo]=[42]] = [] }',
    'for ({j} of x) { var foo; foo = j }',
    'for ({j} of x) { var foo; [foo] = [j] }',
    'for ({j} of x) { var foo; [[foo]=[42]] = [] }',
    'for ({j} of x) { let foo; foo = j }',
    'for ({j} of x) { let foo; [foo] = [j] }',
    'for ({j} of x) { let foo; [[foo]=[42]] = [] }',
    'for ({j} of x) { let foo = j }',
    'for ({j} of x) { let [foo] = [j] }',
    'for ({j} of x) { const foo = j }',
    'for ({j} of x) { const [foo] = [j] }',
    'for ({j} of x) { function foo() {return j} }',
    'for (var j of x) { foo = j }',
    'for (var j of x) { [foo] = [j] }',
    'for (var j of x) { [[foo]=[42]] = [] }',
    'for (var j of x) { var foo = j }',
    'for (var j of x) { var [foo] = [j] }',
    'for (var j of x) { var [[foo]=[42]] = [] }',
    'for (var j of x) { var foo; foo = j }',
    'for (var j of x) { var foo; [foo] = [j] }',
    'for (var j of x) { var foo; [[foo]=[42]] = [] }',
    'for (var j of x) { let foo; foo = j }',
    'for (var j of x) { let foo; [foo] = [j] }',
    'for (var j of x) { let foo; [[foo]=[42]] = [] }',
    'for (var j of x) { let foo = j }',
    'for (var j of x) { let [foo] = [j] }',
    'for (var j of x) { const foo = j }',
    'for (var j of x) { const [foo] = [j] }',
    'for (var j of x) { function foo() {return j} }',
    'for (var {j} of x) { foo = j }',
    'for (var {j} of x) { [foo] = [j] }',
    'for (var {j} of x) { [[foo]=[42]] = [] }',
    'for (var {j} of x) { var foo = j }',
    'for (var {j} of x) { var [foo] = [j] }',
    'for (var {j} of x) { var [[foo]=[42]] = [] }',
    'for (var {j} of x) { var foo; foo = j }',
    'for (var {j} of x) { var foo; [foo] = [j] }',
    'for (var {j} of x) { var foo; [[foo]=[42]] = [] }',
    'for (var {j} of x) { let foo; foo = j }',
    'for (var {j} of x) { let foo; [foo] = [j] }',
    'for (var {j} of x) { let foo; [[foo]=[42]] = [] }',
    'for (var {j} of x) { let foo = j }',
    'for (var {j} of x) { let [foo] = [j] }',
    'for (var {j} of x) { const foo = j }',
    'for (var {j} of x) { const [foo] = [j] }',
    'for (var {j} of x) { function foo() {return j} }',
    'for (let j of x) { foo = j }',
    'for (let j of x) { [foo] = [j] }',
    'for (let j of x) { [[foo]=[42]] = [] }',
    'for (let j of x) { var foo = j }',
    'for (let j of x) { var [foo] = [j] }',
    'for (let j of x) { var [[foo]=[42]] = [] }',
    'for (let j of x) { var foo; foo = j }',
    'for (let j of x) { var foo; [foo] = [j] }',
    'for (let j of x) { var foo; [[foo]=[42]] = [] }',
    'for (let j of x) { let foo; foo = j }',
    'for (let j of x) { let foo; [foo] = [j] }',
    'for (let j of x) { let foo; [[foo]=[42]] = [] }',
    'for (let j of x) { let foo = j }',
    'for (let j of x) { let [foo] = [j] }',
    'for (let j of x) { const foo = j }',
    'for (let j of x) { const [foo] = [j] }',
    'for (let j of x) { function foo() {return j} }',
    'for (let {j} of x) { foo = j }',
    'for (let {j} of x) { [foo] = [j] }',
    'for (let {j} of x) { [[foo]=[42]] = [] }',
    'for (let {j} of x) { var foo = j }',
    'for (let {j} of x) { var [foo] = [j] }',
    'for (let {j} of x) { var [[foo]=[42]] = [] }',
    'for (let {j} of x) { var foo; foo = j }',
    'for (let {j} of x) { var foo; [foo] = [j] }',
    'for (let {j} of x) { var foo; [[foo]=[42]] = [] }',
    'for (let {j} of x) { let foo; foo = j }',
    'for (let {j} of x) { let foo; [foo] = [j] }',
    'for (let {j} of x) { let foo; [[foo]=[42]] = [] }',
    'for (let {j} of x) { let foo = j }',
    'for (let {j} of x) { let [foo] = [j] }',
    'for (let {j} of x) { const foo = j }',
    'for (let {j} of x) { const [foo] = [j] }',
    'for (let {j} of x) { function foo() {return j} }',
    'for (j=x; j<10; ++j) { function foo() {return j} }',
    'for ({j}=x; j<10; ++j) { function foo() {return j} }',
    'for (var j=x; j<10; ++j) { function foo() {return j} }',
    'for (var {j}=x; j<10; ++j) { function foo() {return j} }',
    'for (let j=x; j<10; ++j) { function foo() {return j} }',
    'for (let {j}=x; j<10; ++j) { function foo() {return j} }',
    'for (j of x) { function foo() {return j} }',
    'for ({j} of x) { function foo() {return j} }',
    'for (var j of x) { function foo() {return j} }',
    'for (var {j} of x) { function foo() {return j} }',
    'for (let j of x) { function foo() {return j} }',
    'for (let {j} of x) { function foo() {return j} }',
    'for (const j of x) { function foo() {return j} }',
    'for (x.y of [23]) {}',
    'for ((x.y) of [23]) {}',
    'for ([x.y] of [23]) {}',
    'for ([(x), y] of [x = y]) {}',
    'for ([z, (y), z] of [x = y]) {}',
    'for ([z, (y), z.y] of [x = y]) {}',
    outdent`
      for (x.y of [23]) {}
      for (x.y of [23]) {}
      for (x.y of [23]) {}
      for (x.y of [23]) {}
    `,
    'for ((a in b).x of {});',
    'for (x--;;);',
    'for (const [...[...x]] of [[1, 2, 3]]) {}',
    'for (const [...{ length }] of [[1, 2, 3]]) {}',
    'for (const { arrow = () => {} } of [{}]) {}',
    'for (var {} of [obj]) {}',
    'for (var { x: y = foo() } of [{}]) {}',
    'for (var { x: (y) = foo() } of [{}]) {}',
    'for (var { x: (y.z) = foo() } of [{}]) {}',
    'for (var { x: y = foo(1 / 2) } of [{}]) {}',
    'for (var { x: y = foo(() => a) } of [{}]) {}',
    'for (var { 1: y = foo(() => a) } of [{}]) {}',
    'for (var { "string": y = foo(() => a) } of [{}]) {}',
    'for (var [[...x] = [2, 1, 3]] of [[]]) {}',
    'for (let { w: { x, y, z } = { x: 4, y: 5, z: 6 } } of [{ w: null }]) {}',
    'for (let [, , ...x] of [[1, 2]]) {}',
    'for (yield[g]--;;);',
    'for ( let[x] of [[34]] ) {}',
    'for (var { x, } of [{ x: 23 }]) {}',
    'for (var [...[,]] of [g()]) {}',
    'for (function(){ }[foo] of x);',
    'for (function(){ }[x in y] of x);',
    'for (function(){ if (a in b); }.prop of x);',
    'for (function(){ a in b; }.prop of x);',
    'for (var { cover = (function () {}), a = (0, function() {})  } of [{}]) {}',
    'for(x of ~y);',
    'for(x of~y);',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg} ${arg}`);
      });
    });

    it(`async(); ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async(); ${arg}`);
      });
    });

    it(`function foo() { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg} }`);
      });
    });
  }

  pass('Statements - For of (pass)', [
    'for (a of b);',
    'for (var a of b);',
    'for (let a of b);',
    'for (const a of b);',
    'for (a of b=c);',
    'for ([a.b] of c) d',
    'for (const {f = x in /([--])|[--]|=+|[-\x1c$-\x9a+-\xad-]/y} of []) {}',
    'for ([a.b].foo of c) d',

    outdent`
      for (const puxdlkurdxjjhtxg of [, new (({a: () => {
      }, d}))(..."ªZW", (((this))), ((this)), ...(() => () => 2646) || function* () {
        "¡";
      })]) {}
    `,
    'for ({a: b.c} of d) e',
    'for ({a: b.c}.foo of d) e',
    'for (foo=10;;);',
    'for (let=10;;);',
    'for ({x, y} of [{x: 1, y: 2}]) {}',
    'for (let {j} of x) { foo = j }',
    'for ([] of [{ next: function() {return { done: true }; },return: function() {return {}; }}]) {}',
    { code: 'for (const {j} of x) { var [foo] = [j] }', options: { loc: true } },
    { code: 'for([{a=0}] of b);', options: { loc: true } },
    'for (var { cover = (function () {}), a = (0, function() {})  } of [{}]) {}',
    'for (var [...{ length }] of [[1, 2, 3]]) {}',
    'for (var [...[...x]] of [[1, 2, 3]]) {}',
    'for (const [{ x, y, z } = { x: 44, y: 55, z: 66 }] of [[]]) {}',
    'for ([] of [[]]) {}',
    'for ([...{ 0: x, length }] of [[null]]) {}',
    'for ({x, y} of z);',
    /*['for (let of, bar; false; ) { }', Context.None, {
      "type": "Program",
      "sourceType": "script",
      "body": [
        {
          "type": "ForStatement",
          "body": {
            "type": "BlockStatement",
            "body": []
          },
          "init": {
            "type": "VariableDeclaration",
            "kind": "let",
            "declarations": [
              {
                "type": "VariableDeclarator",
                "init": null,
                "id": {
                  "type": "Identifier",
                  "name": "of"
                }
              },
              {
                "type": "VariableDeclarator",
                "init": null,
                "id": {
                  "type": "Identifier",
                  "name": "bar"
                }
              }
            ]
          },
          "test": {
            "type": "Literal",
            "value": false
          },
          "update": null
        }
      ]
    }],
    ['for (let of = 10; false; ) { }', Context.None,     {
      "type": "Program",
      "sourceType": "script",
      "body": [
        {
          "type": "ForStatement",
          "body": {
            "type": "BlockStatement",
            "body": []
          },
          "init": {
            "type": "VariableDeclaration",
            "kind": "let",
            "declarations": [
              {
                "type": "VariableDeclarator",
                "init": {
                  "type": "Literal",
                  "value": 10
                },
                "id": {
                  "type": "Identifier",
                  "name": "of"
                }
              }
            ]
          },
          "test": {
            "type": "Literal",
            "value": false
          },
          "update": null
        }
      ]
    }],*/
    'for (j of x) { foo = j }',
    'for (j of x) { function foo() {return j} }',
    'for (j of x) { const [foo] = [j] }',
    'function* g() { for(x of yield) {} }',
    'for (let {j} of x) { [foo] = [j] }',
    'for ({x, y} of [{x: 1, y: 2}]) {}',
    outdent`
      for ( var i = 0, list = items; i < list.length; i += 1 ) {
        var item = list[i];
          if ( item.foo ) { continue; }
      }
    `,
    outdent`
      for ( let member of [ 'a', 'b', 'c' ] ) {
        setTimeout( function () {
        doSomething( member );
        });
      }
    `,
    'for ([] of [{ next: function() {return { done: true }; },return: function() {return {}; }}]) {}',
    'function* g() { for(var x of yield) {} }',
    'for(let [a] of b);',
    'for (var { cover = (function () {}), a = (0, function() {})  } of [{}]) {}',
    /**[
      'for({a=0} of b);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      value: 0
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            },
            await: false
          }
        ]
      }
    ], */
    'for ( let[x] of [[34]] ) {}',
    'for (var [...{ length }] of [[1, 2, 3]]) {}',
    'for (var a of b);',
    'for (let a of b);',
    'for (const a of b);',
    'for (a of b);',
    'for (var a of b);',
    'for ({ x: [ x ] } of [{}]) {}',
    'for ({ x: [x = yield] } of [{ x: [] }]) {}',
    /*  [
      'for ({ x: prop = "x" in {} } of [{}]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'prop'
                    },
                    right: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Literal',
                        value: 'x'
                      },
                      right: {
                        type: 'ObjectExpression',
                        properties: []
                      },
                      operator: 'in'
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ObjectExpression',
                  properties: []
                }
              ]
            },
            await: false
          }
        ]
      }
    ],*/
    /* [
      'for ({ x: xGen = function* x() {}, x: gen = function*() {} } of [{}]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'xGen'
                    },
                    right: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'gen'
                    },
                    right: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ObjectExpression',
                  properties: []
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ({ y: x = 1 } of [{ y: undefined }]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  value: {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'undefined'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            },
            await: false
          }
        ]
      }
    ],*/
    'for ({ x = y } of [{}]) {}',
    'for ([...x.y] of [[4, 3, 2]]) {}',
    'for (x of let) {}',
    'for (var {x, y} of z);',
    'for (const y of list);',
    'for(const x = 1; ; ) {}',
    'for (let [p, q] of r);',
  ]);
});
