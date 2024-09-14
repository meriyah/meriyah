import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
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
    '((a, b) => { return a + b; })(1, 5), 6'
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
    ['\\u0061sync () => {}', Context.None],
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
    ['async({a = 1}, {b = 2} = {}, {c = 3} = {})', Context.None]
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
    '() => ("\\u{20ac}")',
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
    'var f = cond ? x=>{x.foo } : x=>x + x + x + x + x + x + (x =>x)'
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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: [],
                start: 40,
                end: 42,
                range: [40, 42]
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                    start: 7,
                    end: 8,
                    range: [7, 8]
                  },
                  right: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AwaitExpression',
                            argument: {
                              type: 'Literal',
                              value: 1,
                              start: 31,
                              end: 32,
                              range: [31, 32]
                            },
                            start: 25,
                            end: 32,
                            range: [25, 32]
                          },
                          start: 25,
                          end: 33,
                          range: [25, 33]
                        }
                      ],
                      start: 23,
                      end: 35,
                      range: [23, 35]
                    },
                    params: [],
                    async: true,
                    expression: false,
                    start: 11,
                    end: 35,
                    range: [11, 35]
                  },
                  start: 7,
                  end: 35,
                  range: [7, 35]
                }
              ],
              async: true,
              expression: false,
              start: 0,
              end: 42,
              range: [0, 42]
            },
            start: 0,
            end: 42,
            range: [0, 42]
          }
        ],
        start: 0,
        end: 42,
        range: [0, 42]
      }
    ],
    [
      `async (() => 1)(), 1`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        range: [0, 20],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 20,
            range: [0, 20],
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 20,
              range: [0, 20],
              expressions: [
                {
                  type: 'CallExpression',
                  start: 0,
                  end: 17,
                  range: [0, 17],
                  callee: {
                    type: 'CallExpression',
                    start: 0,
                    end: 15,
                    range: [0, 15],
                    callee: {
                      type: 'Identifier',
                      start: 0,
                      end: 5,
                      range: [0, 5],
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'ArrowFunctionExpression',
                        start: 7,
                        end: 14,
                        range: [7, 14],
                        expression: true,
                        async: false,
                        params: [],
                        body: {
                          type: 'Literal',
                          start: 13,
                          end: 14,
                          range: [13, 14],
                          value: 1
                        }
                      }
                    ]
                  },
                  arguments: []
                },
                {
                  type: 'Literal',
                  start: 19,
                  end: 20,
                  range: [19, 20],
                  value: 1
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `async x => delete ("x"[(await x)])`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 34,
        range: [0, 34],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 34
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 34,
            range: [0, 34],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 34
              }
            },
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 34,
              range: [0, 34],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 34
                }
              },
              expression: true,
              async: true,
              params: [
                {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  loc: {
                    start: {
                      line: 1,
                      column: 6
                    },
                    end: {
                      line: 1,
                      column: 7
                    }
                  },
                  name: 'x'
                }
              ],
              body: {
                type: 'UnaryExpression',
                start: 11,
                end: 34,
                range: [11, 34],
                loc: {
                  start: {
                    line: 1,
                    column: 11
                  },
                  end: {
                    line: 1,
                    column: 34
                  }
                },
                operator: 'delete',
                prefix: true,
                argument: {
                  type: 'MemberExpression',
                  start: 19,
                  end: 33,
                  range: [19, 33],
                  loc: {
                    start: {
                      line: 1,
                      column: 19
                    },
                    end: {
                      line: 1,
                      column: 33
                    }
                  },
                  object: {
                    type: 'Literal',
                    start: 19,
                    end: 22,
                    range: [19, 22],
                    loc: {
                      start: {
                        line: 1,
                        column: 19
                      },
                      end: {
                        line: 1,
                        column: 22
                      }
                    },
                    value: 'x'
                  },
                  property: {
                    type: 'AwaitExpression',
                    start: 24,
                    end: 31,
                    range: [24, 31],
                    loc: {
                      start: {
                        line: 1,
                        column: 24
                      },
                      end: {
                        line: 1,
                        column: 31
                      }
                    },
                    argument: {
                      type: 'Identifier',
                      start: 30,
                      end: 31,
                      range: [30, 31],
                      loc: {
                        start: {
                          line: 1,
                          column: 30
                        },
                        end: {
                          line: 1,
                          column: 31
                        }
                      },
                      name: 'x'
                    }
                  },
                  computed: true
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `(async () => {})
      (async () => {})
      (async () => {})
      (async () => {})
      (async () => {})`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 108,
        range: [0, 108],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 108,
            range: [0, 108],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 108,
              range: [0, 108],
              callee: {
                type: 'CallExpression',
                start: 0,
                end: 85,
                range: [0, 85],
                callee: {
                  type: 'CallExpression',
                  start: 0,
                  end: 62,
                  range: [0, 62],
                  callee: {
                    type: 'CallExpression',
                    start: 0,
                    end: 39,
                    range: [0, 39],
                    callee: {
                      type: 'ArrowFunctionExpression',
                      start: 1,
                      end: 15,
                      range: [1, 15],
                      expression: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 13,
                        end: 15,
                        range: [13, 15],
                        body: []
                      }
                    },
                    arguments: [
                      {
                        type: 'ArrowFunctionExpression',
                        start: 24,
                        end: 38,
                        range: [24, 38],
                        expression: false,
                        async: true,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          start: 36,
                          end: 38,
                          range: [36, 38],
                          body: []
                        }
                      }
                    ]
                  },
                  arguments: [
                    {
                      type: 'ArrowFunctionExpression',
                      start: 47,
                      end: 61,
                      range: [47, 61],
                      expression: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 59,
                        end: 61,
                        range: [59, 61],
                        body: []
                      }
                    }
                  ]
                },
                arguments: [
                  {
                    type: 'ArrowFunctionExpression',
                    start: 70,
                    end: 84,
                    range: [70, 84],
                    expression: false,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 82,
                      end: 84,
                      range: [82, 84],
                      body: []
                    }
                  }
                ]
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 93,
                  end: 107,
                  range: [93, 107],
                  expression: false,
                  async: true,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 105,
                    end: 107,
                    range: [105, 107],
                    body: []
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async x =>x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],

              async: true,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'x + (async y => x)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              operator: '+',
              right: {
                type: 'ArrowFunctionExpression',
                start: 5,
                end: 17,
                range: [5, 17],
                expression: true,
                async: true,
                params: [
                  {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    range: [11, 12],
                    name: 'y'
                  }
                ],
                body: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  range: [16, 17],
                  name: 'x'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'var f = cond ? x=>{x.foo } : x=>x + x + x + x + x + x + (async x =>x)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 69,
        range: [0, 69],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 69,
            range: [0, 69],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 69,
                range: [4, 69],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'f'
                },
                init: {
                  type: 'ConditionalExpression',
                  start: 8,
                  end: 69,
                  range: [8, 69],
                  test: {
                    type: 'Identifier',
                    start: 8,
                    end: 12,
                    range: [8, 12],
                    name: 'cond'
                  },
                  consequent: {
                    type: 'ArrowFunctionExpression',
                    start: 15,
                    end: 26,
                    range: [15, 26],
                    expression: false,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 15,
                        end: 16,
                        range: [15, 16],
                        name: 'x'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      start: 18,
                      end: 26,
                      range: [18, 26],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 19,
                          end: 24,
                          range: [19, 24],
                          expression: {
                            type: 'MemberExpression',
                            start: 19,
                            end: 24,
                            range: [19, 24],
                            object: {
                              type: 'Identifier',
                              start: 19,
                              end: 20,
                              range: [19, 20],
                              name: 'x'
                            },
                            property: {
                              type: 'Identifier',
                              start: 21,
                              end: 24,
                              range: [21, 24],
                              name: 'foo'
                            },
                            computed: false
                          }
                        }
                      ]
                    }
                  },
                  alternate: {
                    type: 'ArrowFunctionExpression',
                    start: 29,
                    end: 69,
                    range: [29, 69],
                    expression: true,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 29,
                        end: 30,
                        range: [29, 30],
                        name: 'x'
                      }
                    ],
                    body: {
                      type: 'BinaryExpression',
                      start: 32,
                      end: 69,
                      range: [32, 69],
                      left: {
                        type: 'BinaryExpression',
                        start: 32,
                        end: 53,
                        range: [32, 53],
                        left: {
                          type: 'BinaryExpression',
                          start: 32,
                          end: 49,
                          range: [32, 49],
                          left: {
                            type: 'BinaryExpression',
                            start: 32,
                            end: 45,
                            range: [32, 45],
                            left: {
                              type: 'BinaryExpression',
                              start: 32,
                              end: 41,
                              range: [32, 41],
                              left: {
                                type: 'BinaryExpression',
                                start: 32,
                                end: 37,
                                range: [32, 37],
                                left: {
                                  type: 'Identifier',
                                  start: 32,
                                  end: 33,
                                  range: [32, 33],
                                  name: 'x'
                                },
                                operator: '+',
                                right: {
                                  type: 'Identifier',
                                  start: 36,
                                  end: 37,
                                  range: [36, 37],
                                  name: 'x'
                                }
                              },
                              operator: '+',
                              right: {
                                type: 'Identifier',
                                start: 40,
                                end: 41,
                                range: [40, 41],
                                name: 'x'
                              }
                            },
                            operator: '+',
                            right: {
                              type: 'Identifier',
                              start: 44,
                              end: 45,
                              range: [44, 45],
                              name: 'x'
                            }
                          },
                          operator: '+',
                          right: {
                            type: 'Identifier',
                            start: 48,
                            end: 49,
                            range: [48, 49],
                            name: 'x'
                          }
                        },
                        operator: '+',
                        right: {
                          type: 'Identifier',
                          start: 52,
                          end: 53,
                          range: [52, 53],
                          name: 'x'
                        }
                      },
                      operator: '+',
                      right: {
                        type: 'ArrowFunctionExpression',
                        start: 57,
                        end: 68,
                        range: [57, 68],
                        expression: true,
                        async: true,
                        params: [
                          {
                            type: 'Identifier',
                            start: 63,
                            end: 64,
                            range: [63, 64],
                            name: 'x'
                          }
                        ],
                        body: {
                          type: 'Identifier',
                          start: 67,
                          end: 68,
                          range: [67, 68],
                          name: 'x'
                        }
                      }
                    }
                  }
                }
              }
            ],
            kind: 'var'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[async(x,y) => z]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              elements: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 1,
                  end: 16,
                  range: [1, 16],
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      start: 9,
                      end: 10,
                      range: [9, 10],
                      name: 'y'
                    }
                  ],
                  body: {
                    type: 'Identifier',
                    start: 15,
                    end: 16,
                    range: [15, 16],
                    name: 'z'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[async x => z]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              elements: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 1,
                  end: 13,
                  range: [1, 13],
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'x'
                    }
                  ],
                  body: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    range: [12, 13],
                    name: 'z'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f(a, async b => await b)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        range: [0, 24],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 24,
            range: [0, 24],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 24,
              range: [0, 24],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  range: [2, 3],
                  name: 'a'
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 5,
                  end: 23,
                  range: [5, 23],
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
                      name: 'b'
                    }
                  ],
                  body: {
                    type: 'AwaitExpression',
                    start: 16,
                    end: 23,
                    range: [16, 23],
                    argument: {
                      type: 'Identifier',
                      start: 22,
                      end: 23,
                      range: [22, 23],
                      name: 'b'
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({x: async (y,w) => z})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            range: [0, 23],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 22,
              range: [1, 22],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 21,
                  range: [2, 21],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    name: 'x'
                  },
                  value: {
                    type: 'ArrowFunctionExpression',
                    start: 5,
                    end: 21,
                    range: [5, 21],
                    expression: true,
                    async: true,
                    params: [
                      {
                        type: 'Identifier',
                        start: 12,
                        end: 13,
                        range: [12, 13],
                        name: 'y'
                      },
                      {
                        type: 'Identifier',
                        start: 14,
                        end: 15,
                        range: [14, 15],
                        name: 'w'
                      }
                    ],
                    body: {
                      type: 'Identifier',
                      start: 20,
                      end: 21,
                      range: [20, 21],
                      name: 'z'
                    }
                  },
                  kind: 'init'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async (a, b) => 0, (c, d) => 1',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 30,
        range: [0, 30],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 30,
            range: [0, 30],
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 30,
              range: [0, 30],
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 0,
                  end: 17,
                  range: [0, 17],
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      start: 10,
                      end: 11,
                      range: [10, 11],
                      name: 'b'
                    }
                  ],
                  body: {
                    type: 'Literal',
                    start: 16,
                    end: 17,
                    range: [16, 17],
                    value: 0
                  }
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 19,
                  end: 30,
                  range: [19, 30],
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 20,
                      end: 21,
                      range: [20, 21],
                      name: 'c'
                    },
                    {
                      type: 'Identifier',
                      start: 23,
                      end: 24,
                      range: [23, 24],
                      name: 'd'
                    }
                  ],
                  body: {
                    type: 'Literal',
                    start: 29,
                    end: 30,
                    range: [29, 30],
                    value: 1
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async({x = yield}) => 1);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            range: [0, 26],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 1,
              end: 24,
              range: [1, 24],
              expression: true,
              async: true,
              params: [
                {
                  type: 'ObjectPattern',
                  start: 7,
                  end: 18,
                  range: [7, 18],
                  properties: [
                    {
                      type: 'Property',
                      start: 8,
                      end: 17,
                      range: [8, 17],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        name: 'x'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 8,
                        end: 17,
                        range: [8, 17],
                        left: {
                          type: 'Identifier',
                          start: 8,
                          end: 9,
                          range: [8, 9],
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          start: 12,
                          end: 17,
                          range: [12, 17],
                          name: 'yield'
                        }
                      }
                    }
                  ]
                }
              ],
              body: {
                type: 'Literal',
                start: 23,
                end: 24,
                range: [23, 24],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async (b = {await: a}) => 1',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        range: [0, 27],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 27,
            range: [0, 27],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 27,
              range: [0, 27],
              expression: true,
              async: true,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 7,
                  end: 21,
                  range: [7, 21],
                  left: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    range: [7, 8],
                    name: 'b'
                  },
                  right: {
                    type: 'ObjectExpression',
                    start: 11,
                    end: 21,
                    range: [11, 21],
                    properties: [
                      {
                        type: 'Property',
                        start: 12,
                        end: 20,
                        range: [12, 20],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 12,
                          end: 17,
                          range: [12, 17],
                          name: 'await'
                        },
                        value: {
                          type: 'Identifier',
                          start: 19,
                          end: 20,
                          range: [19, 20],
                          name: 'a'
                        },
                        kind: 'init'
                      }
                    ]
                  }
                }
              ],
              body: {
                type: 'Literal',
                start: 26,
                end: 27,
                range: [26, 27],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({async foo () \n {}})',
      Context.None,
      {
        body: [
          {
            expression: {
              properties: [
                {
                  computed: false,
                  key: {
                    name: 'foo',
                    type: 'Identifier'
                  },
                  kind: 'init',
                  method: true,
                  shorthand: false,
                  type: 'Property',
                  value: {
                    async: true,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ObjectExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '(async (a = b) => {  })',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            range: [0, 23],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 1,
              end: 22,
              range: [1, 22],
              expression: false,
              async: true,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 8,
                  end: 13,
                  range: [8, 13],
                  left: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    range: [8, 9],
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    range: [12, 13],
                    name: 'b'
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 18,
                end: 22,
                range: [18, 22],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async ({a: b = c})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                range: [0, 5],
                name: 'async'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 7,
                  end: 17,
                  range: [7, 17],
                  properties: [
                    {
                      type: 'Property',
                      start: 8,
                      end: 16,
                      range: [8, 16],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        name: 'a'
                      },
                      value: {
                        type: 'AssignmentExpression',
                        start: 11,
                        end: 16,
                        range: [11, 16],
                        operator: '=',
                        left: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          range: [11, 12],
                          name: 'b'
                        },
                        right: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
                          range: [15, 16],
                          name: 'c'
                        }
                      },
                      kind: 'init'
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async ({await: a}) => 1)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Literal',
                value: 1
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'await'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],

              async: true,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'id = async x => x, square = async (y) => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'id'
                  },
                  operator: '=',
                  right: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],

                    async: true,

                    expression: true
                  }
                },
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'square'
                  },
                  operator: '=',
                  right: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'y'
                      }
                    ],

                    async: true,

                    expression: false
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(async a => {})()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ],

                async: true,

                expression: false
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new async()',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'NewExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              callee: {
                type: 'Identifier',
                start: 4,
                end: 9,
                range: [4, 9],
                name: 'async'
              },
              arguments: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async ((a))',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                range: [0, 5],
                name: 'async'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'a'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async function a(){}(0))',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: true,
                generator: false,
                id: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              arguments: [
                {
                  type: 'Literal',
                  value: 0
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(async a => b => c)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'c'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ],

                async: false,

                expression: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],

              async: true,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'f(async ()=>c)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 2,
                  end: 13,
                  range: [2, 13],
                  expression: true,
                  async: true,
                  params: [],
                  body: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    range: [12, 13],
                    name: 'c'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a => a => a => async a => a',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        range: [0, 27],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 27,
            range: [0, 27],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 27,
              range: [0, 27],
              expression: true,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  name: 'a'
                }
              ],
              body: {
                type: 'ArrowFunctionExpression',
                start: 5,
                end: 27,
                range: [5, 27],
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'a'
                  }
                ],
                body: {
                  type: 'ArrowFunctionExpression',
                  start: 10,
                  end: 27,
                  range: [10, 27],
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 10,
                      end: 11,
                      range: [10, 11],
                      name: 'a'
                    }
                  ],
                  body: {
                    type: 'ArrowFunctionExpression',
                    start: 15,
                    end: 27,
                    range: [15, 27],
                    expression: true,
                    async: true,
                    params: [
                      {
                        type: 'Identifier',
                        start: 21,
                        end: 22,
                        range: [21, 22],
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'Identifier',
                      start: 26,
                      end: 27,
                      range: [26, 27],
                      name: 'a'
                    }
                  }
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f(a, async (b, c) => await [b, c], d)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 37,
        range: [0, 37],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 37,
            range: [0, 37],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 37,
              range: [0, 37],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  range: [2, 3],
                  name: 'a'
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 5,
                  end: 33,
                  range: [5, 33],
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 12,
                      end: 13,
                      range: [12, 13],
                      name: 'b'
                    },
                    {
                      type: 'Identifier',
                      start: 15,
                      end: 16,
                      range: [15, 16],
                      name: 'c'
                    }
                  ],
                  body: {
                    type: 'AwaitExpression',
                    start: 21,
                    end: 33,
                    range: [21, 33],
                    argument: {
                      type: 'ArrayExpression',
                      start: 27,
                      end: 33,
                      range: [27, 33],
                      elements: [
                        {
                          type: 'Identifier',
                          start: 28,
                          end: 29,
                          range: [28, 29],
                          name: 'b'
                        },
                        {
                          type: 'Identifier',
                          start: 31,
                          end: 32,
                          range: [31, 32],
                          name: 'c'
                        }
                      ]
                    }
                  }
                },
                {
                  type: 'Identifier',
                  start: 35,
                  end: 36,
                  range: [35, 36],
                  name: 'd'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
