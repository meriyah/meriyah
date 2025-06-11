import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Expressions - Async arrow', () => {
  for (const arg of [
    '(a, b, (c, d) => 0)',
    '(a, b) => 0, (c, d) => 1',
    '(a, b => {}, a => a + 1)',
    '((a, b) => {}, (a => a + 1))',
    '({}) => {}',
    '(a, {}) => {}',
    '({}, a) => {}',
    '([]) => {}',
    '(a, []) => {}',
    '([], a) => {}',
    '(a = b) => {}',
    '(a = b, c) => {}',
    '(a, b = c) => {}',
    '({a}) => {}',
    '(x = 9) => {}',
    '(x, y = 9) => {}',
    'x => private = 1',
    'x => public = 1',
    'x => yield = 1',
    '(x, y = 9, z) => {}',
    '(x, y = 9, z = 8) => {}',
    '(...a) => {}',
    '(x, ...a) => {}',
    '(x = 9, ...a) => {}',
    '(x, y = 9, ...a) => {}',
    '(x, y = 9, {b}, z = 8, ...a) => {}',
    '({a} = {}) => {}',
    '([x] = []) => {}',
    '({a = 42}) => {}',
    '([x = 0]) => {}',
    '(a, (a, (b, c) => 0))',
    '() => {}',
    '() => { return 42 }',
    'x => { return x; }',
    '(x) => { return x; }',
    '(x, y) => { return x + y; }',
    '(x, y, z) => { return x + y + z; }',
    '(x, y) => { x.a = y; }',
    '() => 42',
    'x => x',
    'x => x * x',
    '(x) => x',
    '(x) => x * x',
    '(x, y) => x + y',
    '(x, y, z) => x, y, z',
    '(x, y) => x.a = y',
    "() => ({'value': 42})",
    'x => (interface) = 1',
    'x => (let) = 1',
    'x => y => x + y',
    '(x, y) => (u, v) => x*u + y*v',
    '(x, y) => z => z * (x + y)',
    'x => (y, z) => z * (x + y)',
    '([a]) => [0]',
    '([a,b])=>0',
    '({})=>0',
    '(eval) => eval',
    'eval => eval',
    'arguments => arguments',
    '(x) => { return x }',
    '(...x) => { return x.length; }',
    '(() => 1)(), 1',
    '(a => a + 1)(1), 2',
    '(() => { return 3; })(), 3',
    '(a => { return a + 3; })(1), 4',
    '() => f1({x: 1})',
    '() => f10({x: 6}, 2)',
    'x => (arguments) = 1',
    '((a, b) => a + b)(1, 4), 5',
    '((a, b) => { return a + b; })(1, 5), 6',
  ]) {
    it(`async ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async ${arg}`, undefined, Context.None);
      });
    });

    it(`async ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async ${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`async ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async ${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`bar, async ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar, async ${arg};`, undefined, Context.None);
      });
    });

    it(`bar ? async (${arg}) : baz;`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? async (${arg}) : baz;`, undefined, Context.None);
      });
    });

    it(`bar ? baz : async  (${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? baz : async  (${arg});`, undefined, Context.None);
      });
    });

    it(`async ${arg}, bar;`, () => {
      t.doesNotThrow(() => {
        parseSource(`async ${arg}, bar;`, undefined, Context.None);
      });
    });

    it(`async ${arg}, bar;`, () => {
      t.doesNotThrow(() => {
        parseSource(`async ${arg}, bar;`, undefined, Context.OptionsNext);
      });
    });
  }

  fail('Expressions - Async arrow (fail)', [
    ['function *a() { async yield => foo }', Context.None],
    ['async yield x => zoo', Context.None],
    ['async foo bar => zoo', Context.None],
    ['async ()c++=>{};', Context.None],
    ['async a?c:d=>{}=>{};', Context.None],
    ['async(...a)`template-head${c}`=>{}', Context.None],
    ['async(...a)?c:d=>{}=>{};', Context.None],
    ['interface => {}', Context.Strict | Context.Module],
    ['async (...a)?c:d=>{}=>{}', Context.None],
    ['async (...a)[1]=>{};', Context.None],
    ['async (a,...b)`template-head${c}`=>{}', Context.None],
    ['async (a,...b)`${c}template-tail`=>{};', Context.None],
    ['async (a,...b)`${c}template-tail`=>{}', Context.None],
    ['async (a,...b)[c]=>{};', Context.None],
    ['async 32 => {}', Context.None],
    ['async x => (await) = 1', Context.None],
    ['async x => (break) = 1', Context.None],
    ['async x => (case) = 1', Context.None],
    ['async x => (catch) = 1', Context.None],
    ['async x => (in) = 1', Context.None],
    ['async (32) => {}', Context.None],
    ['async (a, 32) => {}', Context.None],
    ['async if => {}', Context.None],
    ['async (if) => {}', Context.None],
    ['async (a, if) => {}', Context.None],
    ['async a + b => {}', Context.None],
    ['async (a + b) => {}', Context.None],
    ['async (a + b, c) => {}', Context.None],
    ['async (a, b - c) => {}', Context.None],
    ['async "a" => {}', Context.None],
    ['async ("a") => {}', Context.None],
    ['async ("a", b) => {}', Context.None],
    ['async (a, "b") => {}', Context.None],
    ['async -a => {}', Context.None],
    ['async (-a) => {}', Context.None],
    ['async (-a, b) => {}', Context.None],
    ['async (a, -b) => {}', Context.None],
    ['async {} => {}', Context.None],
    ['async a++ => {}', Context.None],
    ['async (a++) => {}', Context.None],
    ['async (a++, b) => {}', Context.None],
    ['async (a, b++) => {}', Context.None],
    ['async [] => {}', Context.None],
    ['async ({...[a, b]}) => x', Context.None],
    ['async ({...{a, b}}) => x', Context.None],
    ['async (foo ? bar : baz) => {}', Context.None],
    ['async (a, foo ? bar : baz) => {}', Context.None],
    ['async (foo ? bar : baz, a) => {}', Context.None],
    ['async (a.b, c) => {}', Context.None],
    ['async (c, a.b) => {}', Context.None],
    ["async (a['b'], c) => {}", Context.None],
    ["async (c, a['b']) => {}", Context.None],
    ['async (...a = b) => b', Context.None],
    ["async () => {'value': 42}", Context.None],
    ['async enum => 1;', Context.Strict],
    ['var af = package => 1;', Context.Strict],
    ['var af = arguments => 1;', Context.Strict],
    // ['async eval => 1;', Context.Strict],
    [`async left = (aSize.width/2) - ()`, Context.None],
    [`async (10) => 0;`, Context.None],
    [`async "use strict"; (a) => 00;`, Context.None],
    ['async ("a", b) => {}', Context.None],
    ['async (a, "b") => {}', Context.None],
    ['async ([...[ x ] = []] = []) => {};', Context.None],
    ['async ([...{ x }, y]) => {};', Context.None],
    ['async ([...{ x }, y]) => {};', Context.None],
    ['async 1 + ()', Context.None],
    ['async ((x)) => a', Context.None],
    ['async (c, a.b) => {}', Context.None],
    ["async (a['b'], c) => {}", Context.None],
    ["async (c, a['b']) => {}", Context.None],
    ['async (...a = b) => b', Context.None],
    ['async (...rest - a) => b', Context.None],
    ['async (a, ...b - 10) => b', Context.None],
    ['async {y=z} => d', Context.None],
    ['async {y=z}', Context.None],
    ['async (..a, ...b) => c', Context.None],
    ['async ([0])=>0;', Context.None],
    ['async ({0})=>0;', Context.None],
    ['async ({a:b[0]}) => x', Context.None],
    ['async ([{x: y.z}] = a) => b', Context.None],
    ['async ([{x: y.z} = a]) => b', Context.None],
    ['async ({x: y.z} = a) => b', Context.None],
    ['async ([{x: y.z}]) => b', Context.None],
    ['async ([{x: y.z}] = a) => b', Context.None],
    ['async ([{"foo": y.z} = a]) => b', Context.None],
    ['async ({"foo": y.z} = a) => b', Context.None],
    ['async ([{"foo": y.z}]) => b', Context.None],
    ['async ([x.y]=z) => z', Context.None],
    ['async ) => {}', Context.None],
    ['async (()) => 0', Context.None],
    ['async ((x)) => 0', Context.None],
    ['async ((x, y)) => 0', Context.None],
    ['async  ...x => x;', Context.None],
    ['async yield => 1;', Context.Strict],
    ['async (yield) => 1;', Context.Strict],
    ['async ([{x: y.z}]) => b', Context.None],
    ['async ([{x: y.z}] = a) => b', Context.None],
    ['async ([{x: y.z}] = a) => b', Context.None],
    ['async ([{x: y.z} = a]) => b', Context.None],
    ['async(foo = super()) => {}', Context.None],
    ['async(x = await) => {  }', Context.None],
    ['async (x = 1) => {"use strict"}', Context.None],
    ['async(await) => {  }', Context.None],
    ['async(foo) => { super() };', Context.None],
    ['async(foo) => { super.prop };', Context.None],
    [String.raw`\u0061sync () => {}`, Context.None],
    ['(async (...a,) => {}', Context.None],
    ['a + async () => {}', Context.None],
    ['async() => { (a = await/r/g) => {} };', Context.None],
    [`async ((x, y)) => 0`, Context.None],
    [`async(...x,b) => x`, Context.None],
    [`async(...x,) => x`, Context.None],
    ['a = (b = await/r/g) => {}) => {}', Context.None],
    ['async(a = (b = await/r/g) => {}) => {}', Context.None],
    ['(a = async(b = await/r/g) => {}) => {}', Context.None],
    ['(...await) => {}', Context.Strict | Context.Module],
    ['async(...await) => {}', Context.None],
    ['(a, ...await) => {}', Context.Strict | Context.Module],
    ['async(a, ...await) => {}', Context.None],
    ['(a = async(...await) => {}) => {}', Context.None],
    ['(a = (...await) => {}) => {}', Context.Strict | Context.Module],
    ['(a = async(...await) => {}) => {}', Context.None],
    ['async(a = (...await) => {}) => {}', Context.None],
    ['async(a = async(...await) => {}) => {}', Context.None],
    ['(a = (b, ...await) => {}) => {}', Context.Strict | Context.Module],
    ['(a = async(b, ...await) => {}) => {}', Context.None],
    ['async(a = (b, ...await) => {}) => {}', Context.None],
    ['async(a = async(b, ...await) => {}) => {}', Context.None],
    ['async(a = async(b = await/r/g) => {}) => {}', Context.None],
    ['async(foo) => { super.prop };', Context.None],
    ['async(foo = super()) => {}', Context.None],
    ['async (foo = super.foo) => { }', Context.None],
    ['async (x) => {}a', Context.None],
    ['async (x) => {} 1', Context.None],
    ['async (x) => {} a()', Context.None],
    ['async (x) => {} + 2', Context.None],
    ['async (x) => {} / 1', Context.None],
    ['async (()) => 0', Context.None],
    ['async (async ()  => a)  => a', Context.None],
    ['async("foo".bar) => x', Context.None],
    ['async("foo".bar) => x', Context.None],
    ['async(async() () => {})(async() () => {})(y)(n)(c)', Context.None],
    ['async(,)', Context.None],
    ['async (,) => b;', Context.None],
    ['async 1 => b;', Context.None],
    ['async 1 => ;', Context.None],
    ['async ({x: {x: y}.length})  => {}', Context.None],
    ['async ({x: x + y})  => {}', Context.None],
    ['async ({x: void x})  => {}', Context.None],
    ['async ({x: this})  => {}', Context.None],
    ['async ({x: function(){}})  => {}', Context.None],
    ['async ({x: async ()=>x})  => {}', Context.None],
    ['async => ;', Context.None],
    ['async (1) => {}', Context.None],
    ['async (1) => {}()', Context.None],
    ['async() => await', Context.None],
    ['(async function foo4() { } => 1)', Context.None],
    ['(async function() { } foo5 => 1)', Context.None],
    ['(async function() { } () => 1)', Context.None],
    ['(async function() { } => 1)', Context.None],
    ['async(...a,) => b', Context.None],
    ['async(...a, b) => b', Context.None],
    // ['async (a = b => await (0)) => {}', Context.Strict | Context.Module],
    ['async(...a,) => b', Context.None],
    ['async(...a, b) => b', Context.None],
    ["var asyncFn = async () => var await = 'test';", Context.None],
    ['async(...a = b) => b', Context.None],
    ['async (...x = []) => {}', Context.None],
    ['async(...a = b) => b', Context.None],
    ["var asyncFn = async await => await + 'test';", Context.None],
    ['function* g() { async yield => X }', Context.None],
    ['function* g() { async (yield) => X }', Context.None],
    ['function* g() { async ({yield}) => X }', Context.None],
    ['async function a(k = await 3) {}', Context.None],
    ['async function a() { async function b([k = await 3]) {} }', Context.None],
    ['async function a() { async function b({k = [await 3]}) {} }', Context.None],
    ['var f = async() => ((async(x = await 1) => x)();', Context.None],
    ['async() => ((async(x = await 1) => x)();', Context.None],
    ['async (await) => 1', Context.None],
    ['async (...await) => 1', Context.None],
    ['async ({await}) => 1', Context.None],
    ['async ({a: await}) => 1', Context.None],
    ['async ([await]) => 1', Context.None],
    ['async ([...await]) => 1', Context.None],
    ['f = async ((x)) => x', Context.None],
    ['async (b = {await}) => 1', Context.None],
    ['async (b = [...await]) => 1', Context.None],
    ['async (b = [await]) => 1', Context.None],
    ['async (b = {a: await}) => 1', Context.None],
    ['async (b = class await {}) => 1', Context.None],
    ['async (b = (await) => {}) => 1', Context.None],
    ['async (await, b = async()) => 2', Context.None],
    ['async (await, b = async () => {}) => 1', Context.None],
    ['({async foo() { var await }})', Context.None],
    ['({async foo(await) { }})', Context.None],
    ['({async foo() { return {await} }})', Context.None],
    ['async().foo13 () => 1', Context.None],
    ['async().foo10 => 1', Context.None],
    ['async(...a, b) => b', Context.None],
    ['async x => const = 1', Context.None],
    ['async x => do = 1', Context.None],
    ['async x => else = 1', Context.None],
    ['async x => for = 1', Context.None],
    ['async x => function = 1', Context.None],
    ['function* a(){ async (yield) => {}; }', Context.None],
    ['f(async\n()=>c)', Context.None],
    ['let f = a + b + async()=>d', Context.None],
    ['f = async\nfunction g(){await x}', Context.None],
    ['f = async\ng => await g', Context.None],
    ['f = async\n(g) => g', Context.None],
    ['async (a, ...b, ...c) => {}', Context.None],
    ['async\n(a, b) => {}', Context.None],
    ['new async() => {}', Context.None],
    ['({ async\nf(){} })', Context.None],
    ['async ((a)) => {}', Context.None],
    ['({ async get a(){} })', Context.None],
    ['async a => {} ()', Context.None],
    ['with({}) async function f(){};', Context.None],
    ['function* a(){ async yield => {}; }', Context.None],
    ['function* a(){ async (yield) => {}; }', Context.None],
    ['async await => 0', Context.None],
    ['(class { async get a(){} })', Context.None],
    ['async function x({await}) { return 1 }', Context.None],
    ['async function f() { return {await}; }', Context.None],
    ['async function f() { return {await = 0} = {}; }', Context.None],
    ['async (a = (await) => {}) => {}', Context.None],
    ['async (a = await => {}) => {}', Context.None],
    ['x = async \n () => x, y', Context.None],
    ['async \n () => {}', Context.None],
    ['async () \n => {}', Context.None],
    ['async \n () \n => {}', Context.None],
    ['async x \n => x', Context.None],
    ['async \n x \n => x', Context.None],
    ['async x \n => x', Context.None],
    ['async \n (x) => x', Context.None],
    ['async foo ? bar : baz => {}', Context.None],
    ['async (x) \n => x', Context.None],
    ['async (await, b = async () => {}) => 1', Context.None],
    ['break async \n () => x', Context.None],
    ['async await => {}', Context.None],
    ['async ({await}) => 1', Context.Strict | Context.Module],
    ['async \n => async', Context.None],
    ['(async \n => async)', Context.None],
    ['async function f() { f = await => 42; }', Context.None],
    ['async function f() { f = (await) => 42; }', Context.None],
    ['async function f() { f = (await, a) => 42; }', Context.None],
    ['async function f() { f = (...await) => 42; }', Context.None],
    ['async function f() { e = (await); }', Context.None],
    ['async function f() { e = (await, f); }', Context.None],
    ['async function f() { e = (await = 42) }', Context.None],
    ['async function f() { e = [await];  }', Context.None],
    ['async function f() { e = {await}; }', Context.None],
    ['async function f() { function await() {} }', Context.None],
    ['async function f() { O = { async [await](a, a) {} } }', Context.None],
    ['async function f() { [ await ] = 1; }', Context.None],
    ['async function f() { { await } = 1; }', Context.None],
    ['async function f() { await = 1; }', Context.None],
    ['async (a, ...b, ...c) => {}', Context.None],
    ['async ((a)) => {}', Context.None],
    ['({ async get a(){} })', Context.None],
    ['async a => {} ()', Context.None],
    ['a + async b => {}', Context.None],
    ['function* a(){ async (yield) => {}; }', Context.None],
    ['function* a(){ async yield => {}; }', Context.None],
    ['x[async \n () => x];', Context.None],
    ['x(async \n () => x);', Context.None],
    ['async (...a,) => {}', Context.None],
    ['async(...a, b) => b', Context.None],
    ['async (...a,) => {}', Context.None],
    ['async(async() () => {})(async() () => {})(async() () => {})(async() () => {})(async() () => {})', Context.None],
    ['async (...a,) => {}', Context.None],
    ['async(...a,) => b', Context.None],
    ['async(...a, b) => b', Context.None],
    ['async(...a,) => b', Context.None],
    ['async(...a, b) => b', Context.None],
    ['async(...a = b) => b', Context.None],
    ['async (...x = []) => {}', Context.None],
    ['async().foo10 => 1', Context.None],
    ['(...a, b) => { let a; }', Context.None],
    ['(async()["foo18"] => 1)', Context.None],
    ['async (1) => {}()', Context.None],
    ['async (1) => {}', Context.None],
    //['async (x) => {}  ? a : b', Context.None],
    ['async ((x, y), z) => 0', Context.None],
    ['async ((x, y, z)) => 0', Context.None],
    ['async(foo = super()) => {}', Context.None],
    ['async(foo) => { super.prop };', Context.None],
    ['async() => { (a = await/r/g) => {} };', Context.None],
    ['"use strict"; async(x = await) => {  }', Context.None],
    ['([x].foo) => x', Context.None],
    ['async ([x].foo) => x', Context.None],
    ["asyncFn = async await => await + 'test';", Context.None],
    ['(async function foo3() { } () => 1)', Context.None],
    ['(async function foo4() { } => 1)', Context.None],
    ['(async function() { } foo5 => 1)', Context.None],
    ['(async function() { } () => 1)', Context.None],
    //['(async(a, ...b) => x)', Context.None],
    ['(async(a, ...(b)) => x)', Context.None],
    ['(async((a), ...(b)) => x)', Context.None],
    ['(async.foo6 => 1)', Context.None],
    ['(async.foo7 foo8 => 1)', Context.None],
    ['(async.foo9 () => 1)', Context.None],
    ['(async().foo10 => 1)', Context.None],
    ['(async`foo22` => 1)', Context.None],
    ['(async`foo23` foo24 => 1)', Context.None],
    ['(async`foo25` () => 1)', Context.None],
    ['(async`foo26`.bar27 => 1)', Context.None],
    ['(async`foo28`.bar29 foo30 => 1)', Context.None],
    ['(async`foo31`.bar32 () => 1)', Context.None],
    ['(async["foo15"] foo16 => 1)', Context.None],
    ['(async().foo13 () => 1)', Context.None],
    ['(async["foo14"] => 1)', Context.None],
    ['(async["foo15"] foo16 => 1)', Context.None],
    ['(async["foo17"] () => 1)', Context.None],
    ['(async()["foo18"] => 1)', Context.None],
    ['(async()["foo19"] foo20 => 1)', Context.None],
    ['"(async()["foo21"] () => 1)', Context.None],
    ['(async`foo28`.bar29 foo30 => 1)', Context.None],
    ['(async`foo31`.bar32 () => 1)', Context.None],
    ['(async["foo15"] foo16 => 1)', Context.None],
    ['(async().foo13 () => 1)', Context.None],
    ['let f = async\n(g) => g', Context.None],
    ['let f = async\n(g) => g', Context.None],
    ['var aaf = async\n(x, y) => { };', Context.None],
    ['async (a, b = await 1) => {}', Context.None],
    ['async () => { await => { }; }', Context.None],
    ['async (a, b = await 1) => {}', Context.None],
    ['function () { a = async await => { } }', Context.None],
    ['async await => { }', Context.None],
    ['async (a, await) => { }', Context.None],
    ['async \n () => {}', Context.None],
    ['async () \n => {}', Context.None],
    ['async \n () \n => {}', Context.None],
    ['async (x) \n => x', Context.None],
    ['async \n (x) \n => x', Context.None],
    ['var x = async \n () => x, y', Context.None],
    ['x={x: async \n () => x}', Context.None],
    ['[async \n () => x]', Context.None],
    ['x(async \n () => x)', Context.None],
    ['(async (...x = []) => {});', Context.None],
    ['function f(x = async \n () => x){}', Context.None],
    ['for (async \n () => x;;) x', Context.None],
    ['for (;async \n () => x;) x', Context.None],
    ['for (x of async \n () => x) x', Context.None],
    ['try {} catch(e = async \n () => x) {}', Context.None],
    ['if (x) async \n () => x else y', Context.None],
    ['class x extends async \n () => x {}', Context.None],
    ['({async get foo() { }})', Context.None],
    ['({async set foo(value) { }})', Context.None],
    ['with (async \n () => x) {}', Context.None],
    ['async (a, async (1) => 0)', Context.None],
    ['async (a, async (async (a) => 0) => 0)', Context.None],
    ['(a, async (a) => 0) => 0', Context.None],
    ['async(a = await x) => x', Context.None],
    ['async (var x) => {};', Context.None],
    ['async (x, y)[7] => {}', Context.None],
    ['a.x => {};', Context.None],
    ['async(a = await/r/g) => {}', Context.None],
    ['async (x = (x) += await f) => {}', Context.None],
    ['var x = 1 y => y', Context.None],
    ['async(a, 1) => x', Context.None],
    ['async(1, a) => x', Context.None],
    ['function* g() { async yield => X }', Context.None],
    ['async () => {1} ? a : b', Context.None],
    ['() => {1} ? a : b', Context.None],
    ['function* g() { async (yield) => X }', Context.None],
    ['function* g() { async ([yield]) => X }', Context.None],
    ['function* g() { async ({yield}) => X }', Context.None],
    ["'use strict'; async X => yield", Context.None],
    ["'use strict'; async yield => X", Context.None],
    ["'use strict'; async (yield) => X", Context.None],
    ['(async((a), ...(b) = xxx) => x)', Context.None],
    ['(async((a), ...[b] = xxx) => x)', Context.None],
    ['(async((a), ...{b} = xxx) => x)', Context.None],
    ['(async(a, ...b = y) => x)', Context.None],
    ['(async(...b = y, d) => x)', Context.None],
    ['(async(...b = y, ...d) => x)', Context.None],
    ['(async((a), ...{b} = xxx))', Context.None],
    ['async a => await', Context.None],
    ['async a => await await', Context.None],
    ['async a => async function()', Context.None],
    ['async a => async function', Context.None],
    ['async a => async b', Context.None],
    ['async [a, b] => 1', Context.None],
    ['async [a] => 1', Context.None],
    ['async {a} => 1', Context.None],
    ['async {a: b} => 1', Context.None],
    ['async (a=await 1) => 1', Context.None],
    ['async ([a=await 1]) => 1', Context.None],
    ['async ({a=await 1}) => 1', Context.None],
    ['async(1,2,3) => x', Context.None],
    ['(async (x) => {}) /= 1', Context.None],
    ['async ({a=await}) => 1', Context.None],
    ['async ([a=await]) => 1', Context.None],
    ['async (a=await) => 1', Context.None],
    ['async ({await}) => 1', Context.None],
    ['async ([await]) => 1', Context.None],
    ['async (await) => 1', Context.None],
    ['async await => 1', Context.None],
    ['(async(...a, ...b) => x)', Context.None],
    ['async (/foo/) => bar', Context.None],
    ['async({a = 1}, {b = 2} = {}, {c = 3} = {})', Context.None],
  ]);

  for (const arg of [
    'async(async(async(async(async(async())))))',
    'async()(async() => {})',
    'async(a)(s)(y)(n)(c)',
    'x[async () => x]',
    '({async foo() { }})',
    '({async() { }})',
    'async () => {}',
    'async () => { return 42 }',
    '(async x => y)',
    '(async (x, z) => y)',
    '({x: async (y,w) => z})',
    'async({x = yield}) => 1; ',
    'async (icefapper = bad) => {  }',
    'async ({a: b = c})',
    'async ({a = b}) => a',
    'async (a, b) => a',
    'async () => a',
    'asyncFn = async({ foo = 1 }) => foo;',
    'asyncFn = async({ foo = 1 } = {}) => foo;',
    'foo = ({ async = true }) => {};',
    'foo = async ({ async: bar }) => { await baz; };',
    `async ({}) => 0`,
    'async(a,)',
    'async()()',
    'var x = async (a, b) => await a + b;',
    'var x = async a => await a;',
    'var x = async => async + 1;',
    'var x = async (a => a + 1);',
    'var x = async(x)',
    'var x = async (a, b) => await a + b;',
    'var x = async (a, b, c, d, e, f, g) => await a + await b + c + d + e + f + g;',
    'async (a,) => b;',
    '[async(x,y) => z]',
    '[async x => z]',
    'id = async x => x, square = async (y) => { y * y }',
    'f(a, async b => await b)',
    'async (x, y) => { x * y }',
    'async (x, y) => y',
    'async a => { await a }',
    'async (y) => y',
    'async (x, ...y) => x',
    'async (x,y,) => x',
    'async ({a = b}) => a',
    '(async (x) => {}) + 1',
    '(async (x) => {}) / 1',
    'async a => a',
    'async function foo(a = async () => await b) {}',
    '({async: 1})',
    'async yield => 1',
    'f(a, async (b, c) => await [b, c], d)',
    'f(a, async (b, c) => await [b, c], d)',
    'async()',
    'async(a, b)',
    'async(...a, ...b)',
    '({ ...async () => { }})',
    '(async x => y)',
    '(async (x, z) => y)',
    '({x: async (y,w) => z})',
    'async({x = yield}) => 1;',
    'async () => 42',
    'async(yield) => b',
    'async(foo, yield) => b',
    'async (yield) => {  };',
    'async (foo, bar, yield) => {  };',
    'f(a, async(x, y) => await [x, y], b)',
    'const foo = ({ async = true }) => {};',
    'const foo = async ({ async: bar }) => { await baz; };',
    `async ({}) => 0`,
    'async()()',
    'async (a,) => b;',
    '[async(x,y) => z]',
    '[async x => z]',
    'id = async x => x, square = async (y) => { y * y }',
    'f(a, async b => await b)',
    'async (x, y) => { x * y }',
    'async (x, y) => y',
    `async function test(){
      const someVar = null;
      const done = async foo => {}
    }`,
    `const a = {
      foo: () => {
      },
      bar: async event => {
      }
    }
    async function test(a = {
      foo: () => {
      },
      bar: async event => {
      }
    }) {
      const someVar = null;
      const done1 = async foo => {
        const a = {
          foo: () => {
          },
          bar: async event => {
          }
        }
      }
      async function test(){
        const someVar = null;
        const done2 = async foo => {}
        const finished = async foo => {}
      }
    }`,
    `async function test() {
      const someVar = null;
      const done1 = async foo => {}
      async function test(){
        const someVar = null;
        const done2 = async foo => {}
        const finished = async foo => {}
      }
    }`,
    `async function test(){
      const someVar = null;
      x = 123 / 1 - 3;
      const done1 = async foo => {
        x = 123 / 1 - 3;
        nchanged = null;
        async (foo) => {}
      }
      async function test(){
        const someVar = null;
        const done = async foo => {
          nchanged = null;
          const finished = async foo => {}
        }
        const finished = async foo => {}
      }
    }`,
    `const done1 = async foo => {}
    const someVar = null;
     const done2 = async foo => {}`,
    `someVar = null;
     someVar = 123;
     someVar = 'nchanged';
      async foo => {}`,
    `const done3 = async foo => { const done = async foo => { const done5 = async foo => {}} }`,
    `x in nchanged;
        const done4 = async foo => {}`,
    'async (y) => y',
    'async (x, ...y) => x',
    'async (x,y,) => x',
    'async ({a = b}) => a',
    '(async ({a = b}) => a)',
    'async ({a = b}) => a(async ({a = b}) => a)',
    'async ({a = b / 2}) => a',
    'async() => { try {} finally { return "promise-finally-return (func-expr)";  } }',
    'async() => { try { return new Promise(function() {}); } finally { return "promise-finally-return (arrow)"; } }',
    'async() => { try { return "early-return (arrow)"; } finally { return await resolveLater("await-finally-return (arrow)"); }}',
    'async ({a = (({b = {a = c} = { a: 0x1234 }}) => 1)({})}, c) => 1;',
    'async ({a = (async ({b = {a = c} = { a: 0x1234 }}) => 1)({})}, c) => a;',
    '(async() => {}).prototype',
    '(async() => {}).hasOwnProperty("prototype")',
    'async function x(a) { await 1; }',
    'async function x(a, b, ...c) { await 1; }',
    '(async(a) => await 1).length',
    '(async(a, b, ...c) => await 1).length',
    '(async(a, b = 2) => await 1).length',
    '({ async f(a, b, ...c) { await 1; } }).f.length',
    '({ async f(a, b = 2) { await 1; } }).f.length',
    '({ async f(a) { await 1; } }).f.length',
    '(new AsyncFunction("a", "await 1")).length',
    '(new AsyncFunction("a", "b = 2", "await 1")).length',
    '(new AsyncFunction("a", "b = 2", "await 1", async)).length',
    '(async x => { return x }).toString()',
    '() => ({ async f() { return "test4"; } }).f()',
    '() => ({ async f() { return "test4"; } }).f()',
    'async a => a',
    'async a => a',
    'async a => a',
    'async a => a',
    'async a => a',
    'async function foo(a = async () => await b) {}',
    '({async: 1})',
    'async yield => 1',
    'f(a, async (b, c) => await [b, c], d)',
    'f(a, async (b, c) => await [b, c], d)',
    'async()',
    'async(a, b)',
    'async(...a, ...b)',
    '({ ...async () => { }})',
    '(async x => y)',
    '(async (x, z) => y)',
    '({x: async (y,w) => z})',
    'async({x = yield}) => 1; ',
    'async (icefapper = bad) => {  }',
    'async ({a: b = c})',
    'async ({a = b}) => a',
    'async (a, b) => a',
    'async () => a',
    'async (a, ...b) => 0',
    'async a => {}',
    'async () => {}',
    '(async a => {})()',
    'a, async () => b, c',
    '({ async a(){} })',
    `async(a) => x`,
    '({ async get(){} })',
    'async function a() { await 0; }',
    '(async function a() { await 0; })',
    'async () => await 0',
    '({ async a(){ await 0; } })',
    'async;\n(a, b) => 0',
    'async\nfunction a(){}',
    'new async()',
    'async()``',
    'async ((a))',
    'async function a(){}(0)',
    '(async function a(){}(0))',
    '(async function() { (await y); })',
    'async function a(){}',
    '(async function a(){})',
    '({ async })',
    'async("foo".bar);',
    'var asyncFn = async({ foo = 1 }) => foo;',
    'var asyncFn = async({ foo = 1 } = {}) => foo;',
    'async (async) => 1',
    'async ([a]) => 1',
    'async ([a, b]) => 1',
    'async ({a}) => 1',
    'async ({a, b}) => 1',
    'async a => async b => c',
    'async a => async function() {}',
    'async a => async function b() {}',
    'async a => await 1',
    'async a => await await 1',
    'async a => await await await 1',
    'async X => yield',
    'async yield => X',
    'async yield => yield',
    'async X => {yield}',
    'async yield => {X}',
    'async yield => {yield}',
    'function* g() { async X => yield }',
    'async ([a])',
    'async ([a, b])',
    'async ({a})',
    'async ({a = 1}) => {};',
    'async ({a = 1}, {b = 2}) => {};',
    'async ({a = 1}, {b = 2}, {c = 3}) => {};',
    'async ({a = 1} = {}, {b = 2}, {c = 3}) => {};',
    'async ({a = 1} = {}, {b = 2} = {}, {c = 3}) => {};',
    'async ({a = 1} = {}, {b = 2} = {}, {c = 3} = {}) => {};',
    'async ({a, b})',
    'a ? async () => {1} : b',
    'a ? b : async () => {1}',
    'async ([{a = 0}]) => {};',
    'async ([...[{a = 0}]]) => {};',
    'async (a, (a, (b, c) => 0))',
    'async (a, (a) => 0)',
    'async (a, async (a) => 0)',
    'async (a, async (a = b => 0) => 0)',
    'async ({x}, [y], z) => x',
    'async ({x = 30}, [y], z) => x;',
    'async  (x = 20) => x;',
    'async ([x] = 20, y) => x;',
    'async ([x = 20] = 20) => x;',
    'async ([x = 25]) => x => x => ({x} = {});',
    'foo(async ({x}, [y], z) => x)',
    'foo(async ({x = 30}, [y], z) => x)',
    'foo(async foo => x)',
    'foo(async foo => x => (x = 20) => (x = 20) => x)',
    'foo(async foo => x => x => x => x)',
    'var f = cond ? async x=> x : async x=>2',
    'async () => await (5)',
    'async (a, b, c, d, e, f) => { return "" + a + b + c + d + e + f; };',
    'async x => () => x;',
    'async x => x => x;',
    'async (x, y, z) => x + y + z;',
    'async x => () => x;',
    'async (x, y) => { return x + y; };',
    'async () => { return () => { return this; } };',
    'async x => { return () => x; }',
    'async ({})[x => x]',
    'async () => () => 0',
    'async () => x => (a, b, c) => 0',
    'async y => () => (a) => 0',
    'async () => (("๏บบ"))',
    String.raw`() => ("\u{20ac}")`,
    '() => (() => (123))',
    'async() => a = ({});',
    'async () => a = (() => b = (123))',
    'async() => a = (async() => b = ("str"));',
    'async () => true ? 1 : (0)',
    'async () => true ? 1 : ("๏บบ")',
    'async() => true ? 1 : (() => false ? 1 : (0))',
    'async (argMath139 = (/a/ instanceof ((typeof Boolean == "function" ) ? Boolean : Object)),argMath140,argMath141) => {  return await ("valueOf" in i32);  }',
    'async x => { return x => x; }',
    'async (a = b => await (0)) => {}',
    '(async(a, b, ...c) => await 1)',
    '() => (async(foo, { a = NaN }) => foo + a)("1", { a: "0" })',
    '() => (async(foo, { a = "0" }) => foo + a)("2", { a: undefined })',
    `async x => {}
     async (x) =>  {}`,
    `async (x) =>  {}
     async x => {}`,
    'var f = cond ? x=>{x.foo } : x=>x + x + x + x + x + x + (x =>x)',
  ]) {
    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`, undefined, Context.None);
      });
    });

    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`, undefined, Context.OptionsLexical | Context.OptionsWebCompat);
      });
    });

    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`, undefined, Context.OptionsNext);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg}}`, undefined, Context.OptionsWebCompat);
      });
    });
  }
  pass('Expressions - Async arrow', [
    [
      `async (a = async () => { await 1; }) => {}`,
      Context.OptionsRanges,
      
    ],
    [
      `async (() => 1)(), 1`,
      Context.OptionsRanges,
      
    ],
    [
      `async x => delete ("x"[(await x)])`,
      Context.OptionsRanges | Context.OptionsLoc,
      
    ],
    [
      `(async () => {})
      (async () => {})
      (async () => {})
      (async () => {})
      (async () => {})`,
      Context.OptionsRanges,
      
    ],
    [
      '(async x =>x)',
      Context.None,
      
    ],
    [
      'x + (async y => x)',
      Context.OptionsRanges,
      
    ],
    [
      'var f = cond ? x=>{x.foo } : x=>x + x + x + x + x + x + (async x =>x)',
      Context.OptionsRanges,
      
    ],
    [
      '[async(x,y) => z]',
      Context.OptionsRanges,
      
    ],
    [
      '[async x => z]',
      Context.OptionsRanges,
      
    ],
    [
      'f(a, async b => await b)',
      Context.OptionsRanges,
      
    ],
    [
      '({x: async (y,w) => z})',
      Context.OptionsRanges,
      
    ],
    [
      'async (a, b) => 0, (c, d) => 1',
      Context.OptionsRanges,
      
    ],
    [
      '(async({x = yield}) => 1);',
      Context.OptionsRanges,
      
    ],
    [
      'async (b = {await: a}) => 1',
      Context.OptionsRanges,
      
    ],
    [
      '({async foo () \n {}})',
      Context.None,
      
    ],
    [
      '(async (a = b) => {  })',
      Context.OptionsRanges,
      
    ],
    [
      'async ({a: b = c})',
      Context.OptionsRanges,
      
    ],
    [
      '(async ({await: a}) => 1)',
      Context.None,
      
    ],
    [
      'id = async x => x, square = async (y) => {}',
      Context.None,
      
    ],
    [
      '(async a => {})()',
      Context.None,
      
    ],
    [
      'new async()',
      Context.OptionsRanges,
      
    ],
    [
      'async ((a))',
      Context.OptionsRanges,
      
    ],
    [
      '(async function a(){}(0))',
      Context.None,
      
    ],
    [
      '(async a => b => c)',
      Context.None,
      
    ],
    [
      'f(async ()=>c)',
      Context.OptionsRanges,
      
    ],
    [
      'a => a => a => async a => a',
      Context.OptionsRanges,
      
    ],
    [
      'f(a, async (b, c) => await [b, c], d)',
      Context.OptionsRanges,
      
    ],
  ]);
});
