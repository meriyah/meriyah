import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

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
    'for(([a]) of 0);'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
  }

  fail('Statements - For of (fail)', [
    ['for (let of x) y', Context.None],
    ['for (let x of a,b) c', Context.None],
    ['for (x in y of) ;', Context.None],
    ['for (x in y of z) ;', Context.None],
    ['for (let[a+b] of x);', Context.None],
    ['for (let() of x);', Context.None],
    ['for (let().foo of x);', Context.None],
    ['for (let.foo of x);', Context.None],
    ['for (let of x);', Context.None],
    ['for (const i, j = void 0 of [1, 2, 3]) {}', Context.None],
    ['for(const x of [], []) {}', Context.None],
    ['for(x of [], []) {}', Context.None],
    ['for(var x of [], []) {}', Context.None],
    ['for(let x of [], []) {}', Context.None],
    ['for (var i, j of {}) {}', Context.None],
    ['for(let {} = 0 of {});', Context.None],
    ['for(let {p: x} = 0 of {});', Context.None],
    ['for(let {p: x = 0} = 0 of {});', Context.None],
    ['for(let {x} = 0 of {});', Context.None],
    ['for(let {x = 0} = 0 of {});', Context.None],
    ['for (let of x) y', Context.None],
    ['for (var i, j of [1, 2, 3]) {}', Context.None],
    ['for (var i, j = 1 of {}) {}', Context.None],
    ['for (var i, j = void 0 of [1, 2, 3]) {}', Context.None],
    ['for (let i, j of {}) {}', Context.None],
    ['for (let i, j of [1, 2, 3]) {}', Context.None],
    ['for (let i, j = 1 of {}) {}', Context.None],
    ['for (let i, j = void 0 of [1, 2, 3]) {}', Context.None],
    ['for (const i, j of {}) {}', Context.None],
    ['for (const i, j of [1, 2, 3]) {}', Context.None],
    ['for (const i, j = 1 of {}) {}', Context.None],
    ['for(const [,] = 0 of {});', Context.None],
    ['for(const [a] = 0 of {});', Context.None],
    ['for(const [a = 0] = 0 of {});', Context.None],
    ['for(const [...a] = 0 of {});', Context.None],
    ['for(const [...[]] = 0 of {});', Context.None],
    ['for(const [...[a]] = 0 of {});', Context.None],
    ['for(const {} = 0 of {});', Context.None],
    ['for (this of []);', Context.None],
    ['for (this of []; ;);', Context.None],
    ['for (({x}) of [{x:1}]) {}', Context.None],
    ['for (var ({x}) of [{x:1}]) {}', Context.None],
    ['for await (({x}) of [{x:1}]) {}', Context.None],
    ['for(const {p: x} = 0 of {});', Context.None],
    ['for(const {p: x = 0} = 0 of {});', Context.None],
    ['for(const {x} = 0 of {});', Context.None],
    ['for(const {x = 0} = 0 of {});', Context.None],
    ['for(x = 0 of {});', Context.None],
    ['for ({...rest, b} of [{}]) ;', Context.None],
    ['for(o.p = 0 of {});', Context.None],
    ['for(o[0] = 0 of {});', Context.None],
    ['for(f() = 0 of {});', Context.None],
    ['for(({a}) of 0);', Context.None],
    ['for(([a]) of 0);', Context.None],
    ['for(var [] = 0 of {});', Context.None],
    ['for(var [,] = 0 of {});', Context.None],
    ['for(var [a] = 0 of {});', Context.None],
    ['for(var [a = 0] = 0 of {});', Context.None],
    ['for(var [...a] = 0 of {});', Context.None],
    ['for(var [...[]] = 0 of {});', Context.None],
    ['for(var [...[a]] = 0 of {});', Context.None],
    ['for(var {} = 0 of {});', Context.None],
    ['for(var {p: x} = 0 of {});', Context.None],
    ['for(var {p: x = 0} = 0 of {});', Context.None],
    ['for(var {x} = 0 of {});', Context.None],
    ['for(var {x = 0} = 0 of {});', Context.None],
    ['for(let x = 0 of {});', Context.None],
    ['for (let x of y, z) {}', Context.None],
    ['for(let [] = 0 of {});', Context.None],
    ['for (var [x] = 1 of []) {}', Context.None],
    ['for (let x = 1 of []) {}', Context.None],
    ['for (let [x] = 1 of []) {}', Context.None],
    ['for (let {x} = 1 of []) {}', Context.None],
    ['for (const x = 1 of []) {}', Context.None],
    ['for (const [x] = 1 of []) {}', Context.None],
    ['for (const {x} = 1 of []) {}', Context.None],
    ['for ((this) of []) {}', Context.None],
    ['for (var [x]   of 1, 2) {}', Context.None],
    ['for (var x     of 1, 2) {}', Context.None],
    ['for (var x = 1 of []) {}', Context.None],
    ['for (this of []) {}', Context.None],
    ['for(let [,] = 0 of {});', Context.None],
    ['for(let [a] = 0 of {});', Context.None],
    ['for(let [a = 0] = 0 of {});', Context.None],
    ['for(let [...a] = 0 of {});', Context.None],
    ['for(let [...[]] = 0 of {});', Context.None],
    ['for(let [...[a]] = 0 of {});', Context.None],
    ['for({x} = 0 of {});', Context.None],
    ['for ({p: x = 0} = 0 of {});', Context.None],
    ['for ({x} = 0 of {});', Context.None],
    ['for(o.p = 0 of {});', Context.None],
    ['for(([a]) of 0);', Context.None],
    ['for(let of 0);', Context.None],
    ['for(this of 0); ', Context.None],
    ['for(var a = 0 of b);', Context.None],
    ['for(let a = 0 of b);', Context.None],
    ['for(const a = 0 of b);', Context.None],
    ['for(({a}) of 0);', Context.None],
    ['for(([a]) of 0);', Context.None],
    ['for(var a of b, c);', Context.None],
    ['for(a of b, c);', Context.None],
    ['for(a of b, c);', Context.None],
    ['for(a of b, c);', Context.None],
    ['for(a of b, c);', Context.None],
    ['for(a of b, c);', Context.None],
    ['for (function(){} of x);', Context.None],
    ['for ([...[a]] = 0 of {});', Context.None],
    ['for ([] = 0 of {});', Context.None],
    ['for (let [...{ x } = []] of [[]]) {}', Context.None]
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
    `for (x.y of [23]) {}
    for (x.y of [23]) {}
    for (x.y of [23]) {}
    for (x.y of [23]) {}`,
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
    `for ( let[x] of [[34]] ) {}`,
    `for (var { x, } of [{ x: 23 }]) {}`,
    `for (var [...[,]] of [g()]) {}`,
    'for (function(){ }[foo] of x);',
    'for (function(){ }[x in y] of x);',
    'for (function(){ if (a in b); }.prop of x);',
    'for (function(){ a in b; }.prop of x);',
    `for (var { cover = (function () {}), a = (0, function() {})  } of [{}]) {}`,
    'for(x of ~y);',
    'for(x of~y);'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg} ${arg}`, undefined, Context.None);
      });
    });

    it(`async(); ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async(); ${arg}`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg} }`, undefined, Context.None);
      });
    });
  }

  pass('Statements - For of (pass)', [
    [
      'for (a of b);',
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
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'Identifier',
              name: 'b'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (var a of b);',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
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
    ],
    [
      'for (let a of b);',
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
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
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
    ],
    [
      'for (const a of b);',
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
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
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
    ],
    [
      'for (a of b=c);',
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
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'b'
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'c'
              }
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ([a.b] of c) d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'd'
              }
            },
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'c'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (const {f = x in /([--])|[--]|=+|[-\x1c$-\x9a+-\xad-]/y} of []) {}',
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
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'f'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'f'
                          },
                          right: {
                            type: 'BinaryExpression',
                            left: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            right: {
                              type: 'Literal',
                              // eslint-disable-next-line no-control-regex
                              value: /([--])|[--]|=+|[-$-+-­-]/y,
                              regex: {
                                pattern: '([--])|[--]|=+|[-\u001c$-+-­-]',
                                flags: 'y'
                              }
                            },
                            operator: 'in'
                          }
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ([a.b].foo of c) d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'd'
              }
            },
            left: {
              type: 'MemberExpression',
              object: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  }
                ]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'foo'
              }
            },
            right: {
              type: 'Identifier',
              name: 'c'
            },
            await: false
          }
        ]
      }
    ],

    [
      `for (const puxdlkurdxjjhtxg of [, new (({a: () => {
      }, d}))(..."ªZW", (((this))), ((this)), ...(() => () => 2646) || function* () {
        "¡";
      })]) {}`,
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
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'puxdlkurdxjjhtxg'
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                null,
                {
                  type: 'NewExpression',
                  callee: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'ArrowFunctionExpression',
                          body: {
                            type: 'BlockStatement',
                            body: []
                          },
                          params: [],

                          async: false,
                          expression: false
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
                          name: 'd'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'd'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  arguments: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'Literal',
                        value: 'ªZW'
                      }
                    },
                    {
                      type: 'ThisExpression'
                    },
                    {
                      type: 'ThisExpression'
                    },
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'LogicalExpression',
                        left: {
                          type: 'ArrowFunctionExpression',
                          body: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'Literal',
                              value: 2646
                            },
                            params: [],

                            async: false,
                            expression: true
                          },
                          params: [],

                          async: false,
                          expression: true
                        },
                        right: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'Literal',
                                  value: '¡\u0015\u0001'
                                },
                                directive: '¡\u0015\u0001'
                              }
                            ]
                          },
                          async: false,
                          generator: true,

                          id: null
                        },
                        operator: '||'
                      }
                    }
                  ]
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ({a: b.c} of d) e',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'e'
              }
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
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'c'
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
              type: 'Identifier',
              name: 'd'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ({a: b.c}.foo of d) e',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'e'
              }
            },
            left: {
              type: 'MemberExpression',
              object: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'c'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'foo'
              }
            },
            right: {
              type: 'Identifier',
              name: 'd'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (foo=10;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'foo'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 10
              }
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (let=10;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'let'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 10
              }
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for ({x, y} of [{x: 1, y: 2}]) {}',
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
                    type: 'Identifier',
                    name: 'x'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
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
                        name: 'x'
                      },
                      value: {
                        type: 'Literal',
                        value: 1
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
                        name: 'y'
                      },
                      value: {
                        type: 'Literal',
                        value: 2
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
    ],
    [
      'for (let {j} of x) { foo = j }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'j'
                    }
                  }
                }
              ]
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'j'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'j'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ([] of [{ next: function() {return { done: true }; },return: function() {return {}; }}]) {}',
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
              type: 'ArrayPattern',
              elements: []
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
                        name: 'next'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'ObjectExpression',
                                properties: [
                                  {
                                    type: 'Property',
                                    key: {
                                      type: 'Identifier',
                                      name: 'done'
                                    },
                                    value: {
                                      type: 'Literal',
                                      value: true
                                    },
                                    kind: 'init',
                                    computed: false,
                                    method: false,
                                    shorthand: false
                                  }
                                ]
                              }
                            }
                          ]
                        },
                        async: false,
                        generator: false,

                        id: null
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
                        name: 'return'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'ObjectExpression',
                                properties: []
                              }
                            }
                          ]
                        },
                        async: false,
                        generator: false,

                        id: null
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
    ],
    [
      'for (const {j} of x) { var [foo] = [j] }',
      Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'j',
                            loc: {
                              start: {
                                line: 1,
                                column: 36
                              },
                              end: {
                                line: 1,
                                column: 37
                              }
                            }
                          }
                        ],
                        loc: {
                          start: {
                            line: 1,
                            column: 35
                          },
                          end: {
                            line: 1,
                            column: 38
                          }
                        }
                      },
                      id: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'foo',
                            loc: {
                              start: {
                                line: 1,
                                column: 28
                              },
                              end: {
                                line: 1,
                                column: 31
                              }
                            }
                          }
                        ],
                        loc: {
                          start: {
                            line: 1,
                            column: 27
                          },
                          end: {
                            line: 1,
                            column: 32
                          }
                        }
                      },
                      loc: {
                        start: {
                          line: 1,
                          column: 27
                        },
                        end: {
                          line: 1,
                          column: 38
                        }
                      }
                    }
                  ],
                  loc: {
                    start: {
                      line: 1,
                      column: 23
                    },
                    end: {
                      line: 1,
                      column: 38
                    }
                  }
                }
              ],
              loc: {
                start: {
                  line: 1,
                  column: 21
                },
                end: {
                  line: 1,
                  column: 40
                }
              }
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'j',
                          loc: {
                            start: {
                              line: 1,
                              column: 12
                            },
                            end: {
                              line: 1,
                              column: 13
                            }
                          }
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'j',
                          loc: {
                            start: {
                              line: 1,
                              column: 12
                            },
                            end: {
                              line: 1,
                              column: 13
                            }
                          }
                        },
                        method: false,
                        shorthand: true,
                        loc: {
                          start: {
                            line: 1,
                            column: 12
                          },
                          end: {
                            line: 1,
                            column: 13
                          }
                        }
                      }
                    ],
                    loc: {
                      start: {
                        line: 1,
                        column: 11
                      },
                      end: {
                        line: 1,
                        column: 14
                      }
                    }
                  },
                  loc: {
                    start: {
                      line: 1,
                      column: 11
                    },
                    end: {
                      line: 1,
                      column: 14
                    }
                  }
                }
              ],
              loc: {
                start: {
                  line: 1,
                  column: 5
                },
                end: {
                  line: 1,
                  column: 14
                }
              }
            },
            right: {
              type: 'Identifier',
              name: 'x',
              loc: {
                start: {
                  line: 1,
                  column: 18
                },
                end: {
                  line: 1,
                  column: 19
                }
              }
            },
            await: false,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 40
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 40
          }
        }
      }
    ],
    [
      'for([{a=0}] of b);',
      Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement',
              loc: {
                start: {
                  line: 1,
                  column: 17
                },
                end: {
                  line: 1,
                  column: 18
                }
              }
            },
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a',
                        loc: {
                          start: {
                            line: 1,
                            column: 6
                          },
                          end: {
                            line: 1,
                            column: 7
                          }
                        }
                      },
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'a',
                          loc: {
                            start: {
                              line: 1,
                              column: 6
                            },
                            end: {
                              line: 1,
                              column: 7
                            }
                          }
                        },
                        right: {
                          type: 'Literal',
                          value: 0,
                          loc: {
                            start: {
                              line: 1,
                              column: 8
                            },
                            end: {
                              line: 1,
                              column: 9
                            }
                          }
                        },
                        loc: {
                          start: {
                            line: 1,
                            column: 6
                          },
                          end: {
                            line: 1,
                            column: 9
                          }
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true,
                      loc: {
                        start: {
                          line: 1,
                          column: 6
                        },
                        end: {
                          line: 1,
                          column: 9
                        }
                      }
                    }
                  ],
                  loc: {
                    start: {
                      line: 1,
                      column: 5
                    },
                    end: {
                      line: 1,
                      column: 10
                    }
                  }
                }
              ],
              loc: {
                start: {
                  line: 1,
                  column: 4
                },
                end: {
                  line: 1,
                  column: 11
                }
              }
            },
            right: {
              type: 'Identifier',
              name: 'b',
              loc: {
                start: {
                  line: 1,
                  column: 15
                },
                end: {
                  line: 1,
                  column: 16
                }
              }
            },
            await: false,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 18
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 18
          }
        }
      }
    ],
    [
      'for (var { cover = (function () {}), a = (0, function() {})  } of [{}]) {}',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'cover'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'cover'
                          },
                          right: {
                            type: 'FunctionExpression',
                            params: [],
                            body: {
                              type: 'BlockStatement',
                              body: []
                            },
                            async: false,
                            generator: false,

                            id: null
                          }
                        },
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'SequenceExpression',
                            expressions: [
                              {
                                type: 'Literal',
                                value: 0
                              },
                              {
                                type: 'FunctionExpression',
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: []
                                },
                                async: false,
                                generator: false,

                                id: null
                              }
                            ]
                          }
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
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
      'for (var [...{ length }] of [[1, 2, 3]]) {}',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              kind: 'init',
                              key: {
                                type: 'Identifier',
                                name: 'length'
                              },
                              computed: false,
                              value: {
                                type: 'Identifier',
                                name: 'length'
                              },
                              method: false,
                              shorthand: true
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1
                    },
                    {
                      type: 'Literal',
                      value: 2
                    },
                    {
                      type: 'Literal',
                      value: 3
                    }
                  ]
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (var [...[...x]] of [[1, 2, 3]]) {}',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'RestElement',
                              argument: {
                                type: 'Identifier',
                                name: 'x'
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1
                    },
                    {
                      type: 'Literal',
                      value: 2
                    },
                    {
                      type: 'Literal',
                      value: 3
                    }
                  ]
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (const [{ x, y, z } = { x: 44, y: 55, z: 66 }] of [[]]) {}',
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
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              kind: 'init',
                              key: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              computed: false,
                              value: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              method: false,
                              shorthand: true
                            },
                            {
                              type: 'Property',
                              kind: 'init',
                              key: {
                                type: 'Identifier',
                                name: 'y'
                              },
                              computed: false,
                              value: {
                                type: 'Identifier',
                                name: 'y'
                              },
                              method: false,
                              shorthand: true
                            },
                            {
                              type: 'Property',
                              kind: 'init',
                              key: {
                                type: 'Identifier',
                                name: 'z'
                              },
                              computed: false,
                              value: {
                                type: 'Identifier',
                                name: 'z'
                              },
                              method: false,
                              shorthand: true
                            }
                          ]
                        },
                        right: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              value: {
                                type: 'Literal',
                                value: 44
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
                                name: 'y'
                              },
                              value: {
                                type: 'Literal',
                                value: 55
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
                                name: 'z'
                              },
                              value: {
                                type: 'Literal',
                                value: 66
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: []
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ([] of [[]]) {}',
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
              type: 'ArrayPattern',
              elements: []
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: []
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ([...{ 0: x, length }] of [[null]]) {}',
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
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'RestElement',
                  argument: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Literal',
                          value: 0
                        },
                        value: {
                          type: 'Identifier',
                          name: 'x'
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
                          name: 'length'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'length'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: null
                    }
                  ]
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ({x, y} of z);',
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
                    name: 'x'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'y'
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
              name: 'z'
            },
            await: false
          }
        ]
      }
    ],
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
    [
      'for (j of x) { foo = j }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'j'
                    }
                  }
                }
              ]
            },
            left: {
              type: 'Identifier',
              name: 'j'
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (j of x) { function foo() {return j} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: {
                          type: 'Identifier',
                          name: 'j'
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            },
            left: {
              type: 'Identifier',
              name: 'j'
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (j of x) { const [foo] = [j] }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'j'
                          }
                        ]
                      },
                      id: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'foo'
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            },
            left: {
              type: 'Identifier',
              name: 'j'
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            await: false
          }
        ]
      }
    ],
    [
      'function* g() { for(x of yield) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ForOfStatement',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'YieldExpression',
                    argument: null,
                    delegate: false
                  },
                  await: false
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'for (let {j} of x) { [foo] = [j] }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    operator: '=',
                    right: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'j'
                        }
                      ]
                    }
                  }
                }
              ]
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'j'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'j'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ({x, y} of [{x: 1, y: 2}]) {}',
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
                    type: 'Identifier',
                    name: 'x'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
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
                        name: 'x'
                      },
                      value: {
                        type: 'Literal',
                        value: 1
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
                        name: 'y'
                      },
                      value: {
                        type: 'Literal',
                        value: 2
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
    ],
    [
      `for ( var i = 0, list = items; i < list.length; i += 1 ) {
      var item = list[i];
        if ( item.foo ) { continue; }
    }`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'list'
                        },
                        computed: true,
                        property: {
                          type: 'Identifier',
                          name: 'i'
                        }
                      },
                      id: {
                        type: 'Identifier',
                        name: 'item'
                      }
                    }
                  ]
                },
                {
                  type: 'IfStatement',
                  test: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'item'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  },
                  consequent: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ContinueStatement',
                        label: null
                      }
                    ]
                  },
                  alternate: null
                }
              ]
            },
            init: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Literal',
                    value: 0
                  },
                  id: {
                    type: 'Identifier',
                    name: 'i'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Identifier',
                    name: 'items'
                  },
                  id: {
                    type: 'Identifier',
                    name: 'list'
                  }
                }
              ]
            },
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'i'
              },
              right: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'list'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'length'
                }
              },
              operator: '<'
            },
            update: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'i'
              },
              operator: '+=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      `for ( let member of [ 'a', 'b', 'c' ] ) {
      setTimeout( function () {
      doSomething( member );
      });
     }`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'setTimeout'
                    },
                    arguments: [
                      {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {
                                  type: 'Identifier',
                                  name: 'doSomething'
                                },
                                arguments: [
                                  {
                                    type: 'Identifier',
                                    name: 'member'
                                  }
                                ]
                              }
                            }
                          ]
                        },
                        async: false,
                        generator: false,

                        id: null
                      }
                    ]
                  }
                }
              ]
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'member'
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 'a'
                },
                {
                  type: 'Literal',
                  value: 'b'
                },
                {
                  type: 'Literal',
                  value: 'c'
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ([] of [{ next: function() {return { done: true }; },return: function() {return {}; }}]) {}',
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
              type: 'ArrayPattern',
              elements: []
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
                        name: 'next'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'ObjectExpression',
                                properties: [
                                  {
                                    type: 'Property',
                                    key: {
                                      type: 'Identifier',
                                      name: 'done'
                                    },
                                    value: {
                                      type: 'Literal',
                                      value: true
                                    },
                                    kind: 'init',
                                    computed: false,
                                    method: false,
                                    shorthand: false
                                  }
                                ]
                              }
                            }
                          ]
                        },
                        async: false,
                        generator: false,

                        id: null
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
                        name: 'return'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'ObjectExpression',
                                properties: []
                              }
                            }
                          ]
                        },
                        async: false,
                        generator: false,

                        id: null
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
    ],
    [
      'function* g() { for(var x of yield) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ForOfStatement',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: null,
                        id: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'YieldExpression',
                    argument: null,
                    delegate: false
                  },
                  await: false
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'for(let [a] of b);',
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
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ]
                  }
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
    ],
    [
      'for (var { cover = (function () {}), a = (0, function() {})  } of [{}]) {}',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'cover'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'cover'
                          },
                          right: {
                            type: 'FunctionExpression',
                            params: [],
                            body: {
                              type: 'BlockStatement',
                              body: []
                            },
                            async: false,
                            generator: false,

                            id: null
                          }
                        },
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'SequenceExpression',
                            expressions: [
                              {
                                type: 'Literal',
                                value: 0
                              },
                              {
                                type: 'FunctionExpression',
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: []
                                },
                                async: false,
                                generator: false,

                                id: null
                              }
                            ]
                          }
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
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
    [
      'for ( let[x] of [[34]] ) {}',
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
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 34
                    }
                  ]
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (var [...{ length }] of [[1, 2, 3]]) {}',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              kind: 'init',
                              key: {
                                type: 'Identifier',
                                name: 'length'
                              },
                              computed: false,
                              value: {
                                type: 'Identifier',
                                name: 'length'
                              },
                              method: false,
                              shorthand: true
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1
                    },
                    {
                      type: 'Literal',
                      value: 2
                    },
                    {
                      type: 'Literal',
                      value: 3
                    }
                  ]
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (var a of b);',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
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
    ],
    [
      'for (let a of b);',
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
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
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
    ],
    [
      'for (const a of b);',
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
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
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
    ],
    [
      'for (a of b);',
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
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'Identifier',
              name: 'b'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (var a of b);',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
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
    ],
    [
      'for ({ x: [ x ] } of [{}]) {}',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
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
      'for ({ x: [x = yield] } of [{ x: [] }]) {}',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        }
                      }
                    ]
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
                        name: 'x'
                      },
                      value: {
                        type: 'ArrayExpression',
                        elements: []
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
    ],
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
    [
      'for ({ x = y } of [{}]) {}',
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
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
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
      'for ([...x.y] of [[4, 3, 2]]) {}',
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
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'RestElement',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 4
                    },
                    {
                      type: 'Literal',
                      value: 3
                    },
                    {
                      type: 'Literal',
                      value: 2
                    }
                  ]
                }
              ]
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (x of let) {}',
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
              type: 'Identifier',
              name: 'x'
            },
            right: {
              type: 'Identifier',
              name: 'let'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (var {x, y} of z);',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'z'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (const y of list);',
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
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'y'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'list'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for(const x = 1; ; ) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            init: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Literal',
                    value: 1
                  },
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (let [p, q] of r);',
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
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'p'
                      },
                      {
                        type: 'Identifier',
                        name: 'q'
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'r'
            },
            await: false
          }
        ]
      }
    ]
  ]);
});
