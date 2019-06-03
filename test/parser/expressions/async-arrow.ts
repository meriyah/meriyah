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
    '(x = 9, y) => {}',
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
    ['a = (b = await/r/g) => {}) => {}', Context.None],
    ['async(a = (b = await/r/g) => {}) => {}', Context.None],
    ['(a = async(b = await/r/g) => {}) => {}', Context.None],
    ['async(a = async(b = await/r/g) => {}) => {}', Context.None],
    ['(...await) => {}', Context.Strict | Context.Module],
    ['async(...await) => {}', Context.None],
    ['async(a = async(b = await/r/g) => {}) => {}', Context.None],
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
    ['async (a = b => await (0)) => {}', Context.Strict | Context.Module],
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
    ['(class { async })', Context.None],
    ['(class { async\na(){} })', Context.None],
    ['(class { async get a(){} })', Context.None],
    ['async function x({await}) { return 1 }', Context.None],
    ['async function f() { return {await}; }', Context.None],
    ['async function f() { return {await = 0} = {}; }', Context.None],
    ['async (a = (await) => {}) => {}', Context.None],
    ['async (a = await => {}) => {}', Context.None],
    // ['async (a = await\\u{61}it => {}) => {}', Context.None],
    ['async (a = (b = await (0)) => {}) => {}', Context.None],
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
    ['async(await) => {  }', Context.None],
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
    ['async(a = await x);', Context.None],
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
    ['function* g() { async (yield) => X }', Context.None],
    ['function* g() { async ([yield]) => X }', Context.None],
    ['function* g() { async ({yield}) => X }', Context.None],
    ["'use strict'; async X => yield", Context.None],
    ["'use strict'; async yield => X", Context.None],
    ["'use strict'; async (yield) => X", Context.None],
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
    // ['async (a = b => await (0)) => {}', Context.None],
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
    'async a => { await a }',
    'async (y) => y',
    'async (x, ...y) => x',
    'async (x,y,) => x',
    'async ({a = b}) => a',
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
    'async (a = await => {})',
    //'async (a = aw\\u{61}it => {})',
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
    'async function a() { function b(c = await (0)) {} }',
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
    //'async(a = (await) => {}) => {};',
    'var f = cond ? x=>{x.foo } : x=>x + x + x + x + x + x + (x =>x)'
  ]) {
    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`, undefined, Context.None);
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
                end: 42
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                    start: 7,
                    end: 8
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
                              end: 32
                            },
                            start: 25,
                            end: 32
                          },
                          start: 25,
                          end: 33
                        }
                      ],
                      start: 23,
                      end: 35
                    },
                    params: [],
                    async: true,
                    expression: false,
                    start: 11,
                    end: 35
                  },
                  start: 7,
                  end: 35
                }
              ],
              async: true,
              expression: false,
              start: 0,
              end: 42
            },
            start: 0,
            end: 42
          }
        ],
        start: 0,
        end: 42
      }
    ],
    /*[
      'async(a = (await) => {}) => {};',
      Context.Strict | Context.OptionsRanges,
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
                start: 28,
                end: 30
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                    start: 6,
                    end: 7
                  },
                  right: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: [],
                      start: 21,
                      end: 23
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'await',
                        start: 11,
                        end: 16
                      }
                    ],
                    async: false,
                    expression: false,
                    start: 10,
                    end: 23
                  },
                  start: 6,
                  end: 23
                }
              ],
              async: true,
              expression: false,
              start: 0,
              end: 30
            },
            start: 0,
            end: 31
          }
        ],
        start: 0,
        end: 31
      }
    ], */
    [
      `async (() => 1)(), 1`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 20,
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 20,
              expressions: [
                {
                  type: 'CallExpression',
                  start: 0,
                  end: 17,
                  callee: {
                    type: 'CallExpression',
                    start: 0,
                    end: 15,
                    callee: {
                      type: 'Identifier',
                      start: 0,
                      end: 5,
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'ArrowFunctionExpression',
                        start: 7,
                        end: 14,
                        expression: true,
                        async: false,
                        params: [],
                        body: {
                          type: 'Literal',
                          start: 13,
                          end: 14,
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 34,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 34,
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 34,
              expression: true,
              async: true,
              params: [
                {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  name: 'x'
                }
              ],
              body: {
                type: 'UnaryExpression',
                start: 11,
                end: 34,
                operator: 'delete',
                prefix: true,
                argument: {
                  type: 'MemberExpression',
                  start: 19,
                  end: 33,
                  object: {
                    type: 'Literal',
                    start: 19,
                    end: 22,
                    value: 'x'
                  },
                  property: {
                    type: 'AwaitExpression',
                    start: 24,
                    end: 31,
                    argument: {
                      type: 'Identifier',
                      start: 30,
                      end: 31,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 108,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 108,
              callee: {
                type: 'CallExpression',
                start: 0,
                end: 85,
                callee: {
                  type: 'CallExpression',
                  start: 0,
                  end: 62,
                  callee: {
                    type: 'CallExpression',
                    start: 0,
                    end: 39,
                    callee: {
                      type: 'ArrowFunctionExpression',
                      start: 1,
                      end: 15,
                      expression: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 13,
                        end: 15,
                        body: []
                      }
                    },
                    arguments: [
                      {
                        type: 'ArrowFunctionExpression',
                        start: 24,
                        end: 38,
                        expression: false,
                        async: true,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          start: 36,
                          end: 38,
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
                      expression: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 59,
                        end: 61,
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
                    expression: false,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 82,
                      end: 84,
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
                  expression: false,
                  async: true,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 105,
                    end: 107,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 18,
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'x'
              },
              operator: '+',
              right: {
                type: 'ArrowFunctionExpression',
                start: 5,
                end: 17,
                expression: true,
                async: true,
                params: [
                  {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    name: 'y'
                  }
                ],
                body: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
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
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 69,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 69,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'f'
                },
                init: {
                  type: 'ConditionalExpression',
                  start: 8,
                  end: 69,
                  test: {
                    type: 'Identifier',
                    start: 8,
                    end: 12,
                    name: 'cond'
                  },
                  consequent: {
                    type: 'ArrowFunctionExpression',
                    start: 15,
                    end: 26,
                    expression: false,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 15,
                        end: 16,
                        name: 'x'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      start: 18,
                      end: 26,
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 19,
                          end: 24,
                          expression: {
                            type: 'MemberExpression',
                            start: 19,
                            end: 24,
                            object: {
                              type: 'Identifier',
                              start: 19,
                              end: 20,
                              name: 'x'
                            },
                            property: {
                              type: 'Identifier',
                              start: 21,
                              end: 24,
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
                    expression: true,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 29,
                        end: 30,
                        name: 'x'
                      }
                    ],
                    body: {
                      type: 'BinaryExpression',
                      start: 32,
                      end: 69,
                      left: {
                        type: 'BinaryExpression',
                        start: 32,
                        end: 53,
                        left: {
                          type: 'BinaryExpression',
                          start: 32,
                          end: 49,
                          left: {
                            type: 'BinaryExpression',
                            start: 32,
                            end: 45,
                            left: {
                              type: 'BinaryExpression',
                              start: 32,
                              end: 41,
                              left: {
                                type: 'BinaryExpression',
                                start: 32,
                                end: 37,
                                left: {
                                  type: 'Identifier',
                                  start: 32,
                                  end: 33,
                                  name: 'x'
                                },
                                operator: '+',
                                right: {
                                  type: 'Identifier',
                                  start: 36,
                                  end: 37,
                                  name: 'x'
                                }
                              },
                              operator: '+',
                              right: {
                                type: 'Identifier',
                                start: 40,
                                end: 41,
                                name: 'x'
                              }
                            },
                            operator: '+',
                            right: {
                              type: 'Identifier',
                              start: 44,
                              end: 45,
                              name: 'x'
                            }
                          },
                          operator: '+',
                          right: {
                            type: 'Identifier',
                            start: 48,
                            end: 49,
                            name: 'x'
                          }
                        },
                        operator: '+',
                        right: {
                          type: 'Identifier',
                          start: 52,
                          end: 53,
                          name: 'x'
                        }
                      },
                      operator: '+',
                      right: {
                        type: 'ArrowFunctionExpression',
                        start: 57,
                        end: 68,
                        expression: true,
                        async: true,
                        params: [
                          {
                            type: 'Identifier',
                            start: 63,
                            end: 64,
                            name: 'x'
                          }
                        ],
                        body: {
                          type: 'Identifier',
                          start: 67,
                          end: 68,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 17,
              elements: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 1,
                  end: 16,
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      start: 9,
                      end: 10,
                      name: 'y'
                    }
                  ],
                  body: {
                    type: 'Identifier',
                    start: 15,
                    end: 16,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 14,
              elements: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 1,
                  end: 13,
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      name: 'x'
                    }
                  ],
                  body: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 24,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 24,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'f'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'a'
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 5,
                  end: 23,
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      name: 'b'
                    }
                  ],
                  body: {
                    type: 'AwaitExpression',
                    start: 16,
                    end: 23,
                    argument: {
                      type: 'Identifier',
                      start: 22,
                      end: 23,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 22,
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 21,
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    name: 'x'
                  },
                  value: {
                    type: 'ArrowFunctionExpression',
                    start: 5,
                    end: 21,
                    expression: true,
                    async: true,
                    params: [
                      {
                        type: 'Identifier',
                        start: 12,
                        end: 13,
                        name: 'y'
                      },
                      {
                        type: 'Identifier',
                        start: 14,
                        end: 15,
                        name: 'w'
                      }
                    ],
                    body: {
                      type: 'Identifier',
                      start: 20,
                      end: 21,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 30,
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 30,
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 0,
                  end: 17,
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      start: 10,
                      end: 11,
                      name: 'b'
                    }
                  ],
                  body: {
                    type: 'Literal',
                    start: 16,
                    end: 17,
                    value: 0
                  }
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 19,
                  end: 30,
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 20,
                      end: 21,
                      name: 'c'
                    },
                    {
                      type: 'Identifier',
                      start: 23,
                      end: 24,
                      name: 'd'
                    }
                  ],
                  body: {
                    type: 'Literal',
                    start: 29,
                    end: 30,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            expression: {
              type: 'ArrowFunctionExpression',
              start: 1,
              end: 24,
              expression: true,
              async: true,
              params: [
                {
                  type: 'ObjectPattern',
                  start: 7,
                  end: 18,
                  properties: [
                    {
                      type: 'Property',
                      start: 8,
                      end: 17,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        name: 'x'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 8,
                        end: 17,
                        left: {
                          type: 'Identifier',
                          start: 8,
                          end: 9,
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          start: 12,
                          end: 17,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 27,
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 27,
              expression: true,
              async: true,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 7,
                  end: 21,
                  left: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    name: 'b'
                  },
                  right: {
                    type: 'ObjectExpression',
                    start: 11,
                    end: 21,
                    properties: [
                      {
                        type: 'Property',
                        start: 12,
                        end: 20,
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 12,
                          end: 17,
                          name: 'await'
                        },
                        value: {
                          type: 'Identifier',
                          start: 19,
                          end: 20,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            expression: {
              type: 'ArrowFunctionExpression',
              start: 1,
              end: 22,
              expression: false,
              async: true,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 8,
                  end: 13,
                  left: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    name: 'b'
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 18,
                end: 22,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 18,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                name: 'async'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 7,
                  end: 17,
                  properties: [
                    {
                      type: 'Property',
                      start: 8,
                      end: 16,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        name: 'a'
                      },
                      value: {
                        type: 'AssignmentExpression',
                        start: 11,
                        end: 16,
                        operator: '=',
                        left: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          name: 'b'
                        },
                        right: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
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
      'async (a = await => {})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 23,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                name: 'async'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  start: 7,
                  end: 22,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    name: 'a'
                  },
                  right: {
                    type: 'ArrowFunctionExpression',
                    start: 11,
                    end: 22,
                    expression: false,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 11,
                        end: 16,
                        name: 'await'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      start: 20,
                      end: 22,
                      body: []
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
      'new async()',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            expression: {
              type: 'NewExpression',
              start: 0,
              end: 11,
              callee: {
                type: 'Identifier',
                start: 4,
                end: 9,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 11,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                name: 'async'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 14,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'f'
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 2,
                  end: 13,
                  expression: true,
                  async: true,
                  params: [],
                  body: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 27,
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 27,
              expression: true,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                }
              ],
              body: {
                type: 'ArrowFunctionExpression',
                start: 5,
                end: 27,
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    name: 'a'
                  }
                ],
                body: {
                  type: 'ArrowFunctionExpression',
                  start: 10,
                  end: 27,
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 10,
                      end: 11,
                      name: 'a'
                    }
                  ],
                  body: {
                    type: 'ArrowFunctionExpression',
                    start: 15,
                    end: 27,
                    expression: true,
                    async: true,
                    params: [
                      {
                        type: 'Identifier',
                        start: 21,
                        end: 22,
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'Identifier',
                      start: 26,
                      end: 27,
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 37,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 37,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'f'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'a'
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 5,
                  end: 33,
                  expression: true,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 12,
                      end: 13,
                      name: 'b'
                    },
                    {
                      type: 'Identifier',
                      start: 15,
                      end: 16,
                      name: 'c'
                    }
                  ],
                  body: {
                    type: 'AwaitExpression',
                    start: 21,
                    end: 33,
                    argument: {
                      type: 'ArrayExpression',
                      start: 27,
                      end: 33,
                      elements: [
                        {
                          type: 'Identifier',
                          start: 28,
                          end: 29,
                          name: 'b'
                        },
                        {
                          type: 'Identifier',
                          start: 31,
                          end: 32,
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
