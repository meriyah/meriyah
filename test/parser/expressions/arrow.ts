import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Arrow', () => {
  for (const arg of [
    '(a\n=> a)(1)',
    '(a/*\n*/=> a)(1)',
    '((a)\n=> a)(1)',
    '((a)/*\n*/=> a)(1)',
    '((a, b)\n=> a + b)(1, 2)',
    '((a, b)/*\n*/=> a + b)(1, 2)'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`async ${arg}`, () => {
      t.throws(() => {
        parseSource(`async ${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'eval => {}',
    'arguments => {}',
    '(eval) => {}',
    '(arguments) => {}',
    '(yield) => {}',
    '(interface) => {}',
    '(eval, bar) => {}',
    '(bar, eval) => {}',
    '(bar, arguments) => {}',
    '(bar, yield) => {}',
    '(bar, interface) => {}',
    '(interface, eval) => {}',
    '(interface, arguments) => {}',
    '(eval, interface) => {}',
    '(arguments, interface) => {}'
  ]) {
    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`, undefined, Context.None);
      });
    });

    it(`async ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`async ${arg};`, undefined, Context.None);
      });
    });

    it(`bar ? (${arg}) : baz;`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? (${arg}) : baz;`, undefined, Context.None);
      });
    });

    it(`bar ? baz : (${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? baz : (${arg});`, undefined, Context.None);
      });
    });
  }

  // Testing yield in arrow formal list
  for (const arg of [
    'x=yield',
    'x, y=yield',
    '{x=yield}',
    '[x=yield]',
    'x=(yield)',
    'x, y=(yield)',
    '{x=(yield)}',
    '[x=(yield)]',
    'x=f(yield)',
    'x, y=f(yield)',
    '{x=f(yield)}',
    '[x=f(yield)]',
    '{x}=yield',
    '[x]=yield',
    '{x}=(yield)',
    '[x]=(yield)',
    '{x}=f(yield)',
    '[x]=f(yield)'
  ]) {
    it(`(function *g(z = ( ${arg} ) => {}) { });`, () => {
      t.throws(() => {
        parseSource(`(function *g(z = ( ${arg} ) => {}) { });`, undefined, Context.None);
      });
    });

    it(`(function *g(async ( ${arg} ) => {}) { });`, () => {
      t.throws(() => {
        parseSource(`(function *g(async ( ${arg} ) => {}) { });`, undefined, Context.None);
      });
    });

    it(`"use strict"; (function *g(z = ( ${arg} ) => {}) { });`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (function *g(z = ( ${arg} ) => {}) { });`, undefined, Context.None);
      });
    });

    it(`(function *g(z = ( ${arg} ) => {}) { });`, () => {
      t.throws(() => {
        parseSource(`(function *g(z = ( ${arg} ) => {}) { });`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  for (const arg of [
    '=> 0',
    '=>',
    '() =>',
    '=> {}',
    ') => {}',
    ', => {}',
    '(,) => {}',
    'return => {}',
    "() => {'value': 42}",
    'if => {}',
    '(if) => {}',
    '(a, if) => {}',
    'a + b => {}',
    '(a + b) => {}',
    ')',
    ') => 0',
    'foo[()]',
    '(-a) => {}',
    '(-a, b) => {}',
    '(a, -b) => {}',
    '(a + b, c) => {}',
    '(a, b - c) => {}',
    '"a" => {}',
    '("a") => {}',
    '("a", b) => {}',
    '(a, "b") => {}',
    '-a => {}',
    '{} => {}',
    'a++ => {}',
    '(a++) => {}',
    '(a++, b) => {}',
    '(a, b++) => {}',
    '[] => {}',
    '(foo ? bar : baz) => {}',
    '()',
    '(()) => 0',
    '((x)) => 0',
    '((x, y)) => 0',
    '(x, (y)) => 0',
    '((x, y, z)) => 0',
    '(x, (y, z)) => 0',
    '((x, y), z) => 0',
    '32 => {}',
    '(32) => {}',
    '(a, 32) => {}',
    'if => {}',
    '[] => {}',
    '(foo ? bar : baz) => {}',
    '(a, foo ? bar : baz) => {}',
    '(foo ? bar : baz, a) => {}',
    '(a.b, c) => {}',
    'foo(x = x ==> x)',
    'foo(foo => x => x => {x} => x)',
    'foo({x} = 20 => x)',
    'foo([x] = 20 => x)',
    'foo([x = 25] = 20 => x)',
    'foo(([x = 25]) =>)',
    'foo(([x = 25]) => x =>)',
    'foo(([x = 25]) => x => x =>)',
    'foo(([x = 25]) => x => x => {)',
    'foo(x ==> x)',
    'foo(x = x ==> x)',
    'var x = {x} = 20 => x;',
    'var x = [x] = 20 => x;',
    'var x = [x = 25] = 20 => x;',
    'var x = ([x = 25]) =>;',
    'var x = ([x = 25]) => x =>;',
    'var x = ([x = 25]) => x => x =>;',
    'var x = ([x = 25]) => x => x => {;',
    'var f = cond ? x=>{x.foo } => : x=>x + x + x + x + x + x + x',
    'var f = cond ? x=>{x.foo :} : x=>x + x + x + x + x + x + x',
    'var f = cond ? x=>x.foo : : x=>x + x + x + x + x + x + x',
    'var f = cond ? x=>x.foo; : x=>x + x + x + x + x + x + x',
    'let x = (a)\n=>a;',
    '(...rest - a) => b',
    '(a, ...b - 10) => b',
    '()=>{}++',
    '()=>{}--',
    '()=>{}\n++x',
    '()=>{}\n--x',
    '(a.b, c) => {}',
    "(a['b'], c) => {}",
    "(c, a['b']) => {}",
    '(...a = b) => b',
    '({ ...[x] }) => {}'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} `, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} `, undefined, Context.OptionsWebCompat);
      });
    });
    it(`x = ${arg};`, () => {
      t.throws(() => {
        parseSource(`x = ${arg};`, undefined, Context.None);
      });
    });
    it(`x = ${arg};`, () => {
      t.throws(() => {
        parseSource(`x = ${arg};`, undefined, Context.OptionsNext);
      });
    });
    it(`bar,  ${arg};`, () => {
      t.throws(() => {
        parseSource(`bar,  ${arg};`, undefined, Context.None);
      });
    });

    it(`bar,  ${arg};`, () => {
      t.throws(() => {
        parseSource(`bar,  ${arg};`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`bar,  ${arg};`, () => {
      t.throws(() => {
        parseSource(`bar,  ${arg};`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`bar ? (${arg}) : baz;`, () => {
      t.throws(() => {
        parseSource(`bar ? (${arg}) : baz;`, undefined, Context.None);
      });
    });

    it(`bar ? baz : (${arg});`, () => {
      t.throws(() => {
        parseSource(`bar ? baz : (${arg});`, undefined, Context.None);
      });
    });

    it(`${arg}, bar;`, () => {
      t.throws(() => {
        parseSource(`${arg}, bar;`, undefined, Context.None);
      });
    });

    it(`bar[${arg}];`, () => {
      t.throws(() => {
        parseSource(`bar[${arg}];`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'a, b => 0',
    'a, b, (c, d) => 0',
    '(a, b, (c, d) => 0)',
    '(a, b) => 0, (c, d) => 1',
    '(a, b => {}, a => a + 1)',
    '((a, b) => {}, (a => a + 1))',
    'foo ? bar : baz => {}',
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
    'foo = (eval) => eval',
    'af = eval => eval',
    'af = arguments => arguments',
    '(x) => { return x }',
    'af = (...x) => { return x.length; }',
    '(() => 1)(), 1',
    '(a => a + 1)(1), 2',
    '(() => { return 3; })(), 3',
    '(a => { return a + 3; })(1), 4',
    '() => f1({x: 1})',
    '() => f10({x: 6}, 2)',
    '((a, b) => a + b)(1, 4), 5',
    'foo(({x}, [y], z) => x)',
    'foo(({x = 30}, [y], z) => x)',
    'foo(([x] = 20, y) => x)',
    'foo(foo => x => (x = 20) => (x = 20) => x)',
    'foo(foo => x => x => x => {x})',
    '((a, b) => { return a + b; })(1, 5), 6'
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

    it(`v = ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`v = ${arg};`, undefined, Context.None);
      });
    });

    it(`bar,  ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar,  ${arg};`, undefined, Context.None);
      });
    });

    it(`bar ? (${arg}) : baz;`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? (${arg}) : baz;`, undefined, Context.None);
      });
    });

    it(`bar ? baz : (${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? baz : (${arg});`, undefined, Context.None);
      });
    });

    it(`${arg}, bar;`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}, bar;`, undefined, Context.None);
      });
    });

    it(`${arg}, bar;`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}, bar;`, undefined, Context.OptionsNext);
      });
    });
  }

  for (const arg of [
    '?c:d=>{}',
    '=c=>{}',
    '()',
    '(c)',
    '[1]',
    '[c]',
    '.c',
    '-c',
    '+c',
    'c++',
    '`c`',
    '`${c}`',
    '`template-head${c}`',
    '`${c}template-tail`',
    '`template-head${c}template-tail`',
    '`${c}template-tail`'
  ]) {
    it(`()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`()${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`async ()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`async ()${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`()${arg} =>{}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`()${arg} =>{}:`, () => {
      t.throws(() => {
        parseSource(`()${arg} =>{};`, undefined, Context.None);
      });
    });

    it(`var x = ()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`var x = ()${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`"use strict"; var x = ()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; var x = ()${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`(...a)${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`(...a)${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`var x = (...a)${arg};`, () => {
      t.throws(() => {
        parseSource(`var x = (...a)${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`(a,b)${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`(a,b)${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`var x = (a,b)${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`var x = (a,b)${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`async (a,b)${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`async (a,b)${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`(a,...b)${arg};`, () => {
      t.throws(() => {
        parseSource(`(a,...b)${arg} =>{}`, undefined, Context.None);
      });
    });

    it(`var x = (a,...b)${arg};`, () => {
      t.throws(() => {
        parseSource(`var x = (a,...b)${arg} =>{}`, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Array (fail)', [
    ['function *a() { yield => foo }', Context.None],
    ['yield x => zoo', Context.None],
    ['foo bar => zoo', Context.None],
    ['([{x: y.z}]) => b', Context.None],
    ['([{x: y.z}] = a) => b', Context.None],
    ['([{x: y.z}] = a) => b', Context.None],
    ['([{x: y.z} = a]) => b', Context.None],
    ['async(foo = super()) => {}', Context.None],
    ['async (x = 1) => {"use strict"}', Context.None],
    ['async(foo) => { super() };', Context.None],
    ['async(foo) => { super.prop };', Context.None],
    ['\\u0061sync () => {}', Context.None],
    ['(async (...a,) => {}', Context.None],
    ['x = (y = "foo\\003bar") => { "use strict"; }', Context.None],
    ['x = (y = "foo\\003bar") => { }', Context.Strict],
    ['function foo(package) { }', Context.Strict],
    ['()?c:d=>{}=>{}', Context.None],
    ['()=c=>{}=>{};', Context.None],
    ['x = ()+c=>{}', Context.None],
    ['x = ()c++=>{};', Context.None],
    ['a = b\n=> c', Context.None],
    ['a = b\n=>\nc', Context.None],
    ['a\n= b\n=> c', Context.None],
    //['(p\\u0061ckage) => { }', Context.Strict],
    ['(p\\u0061ckage) => { "use strict"; }', Context.None],
    ['(p\\x61ckage) => { }', Context.None],
    ['(p\\x61ckage) => { "use strict"; }', Context.None],
    ['(p\\141ckage) => { "use strict"; }', Context.None],
    // ['package => { "use strict"; }', Context.None],
    // ['p\\u0061ckage => { }', Context.None],
    // ['p\\u0061ckage => { "use strict"; }', Context.None],
    ['p\\141ckage => { }', Context.None],
    ['p\\141ckage => { "use strict"; }', Context.None],
    ['()=>{}+a', Context.None],
    ['()=>{}++', Context.None],
    ['()=>{}--', Context.None],
    ['()=>{}\n++x', Context.None],
    ['()=>{}\n--x', Context.None],
    ['a?c:d=>{}=>{};', Context.None],
    ['(...a)`template-head${c}`=>{}', Context.None],
    ['(...a)?c:d=>{}=>{};', Context.None],
    ['interface => {}', Context.Strict | Context.Module],
    ['x = (...a)?c:d=>{}=>{}', Context.None],
    ['x = (...a)[1]=>{};', Context.None],
    ['(a,...b)`template-head${c}`=>{}', Context.None],
    ['(a,...b)`${c}template-tail`=>{};', Context.None],
    ['x = (a,...b)`${c}template-tail`=>{}', Context.None],
    ['x = (a,...b)[c]=>{};', Context.None],
    ['()`template-head${c}template-tail`=>{}', Context.None],
    ['()?c:d=>{}=>{};', Context.None],
    ['x = ()[1]=>{}', Context.None],
    ['x = ()[c]=>{};', Context.None],
    ['x = (a,b)+c=>{};', Context.None],
    ['x = a`template-head${c}template-tail`=>{}', Context.None],
    ['x = ac++=>{};', Context.None],
    ['(a)`${c}template-tail`=>{}', Context.None],
    ['(a)`template-head${c}template-tail`=>{};', Context.None],
    ['x = (a)?c:d=>{}=>{}', Context.None],
    ['x = (a)`${c}template-tail`=>{};', Context.None],
    ['a`${c}template-tail`=>{}', Context.None],
    ['a`template-head${c}template-tail`=>{};', Context.None],
    ['({x: {x: y}.length})  => {}', Context.None],
    ['({x: x + y})  => {}', Context.None],
    ['({x: void x})  => {}', Context.None],
    ['({x: this})  => {}', Context.None],
    ['({x: function(){}})  => {}', Context.None],
    ['({x: async ()=>x})  => {}', Context.None],
    ['({x: this})  => {}', Context.OptionsWebCompat],
    ['({x: function(){}})  => {}', Context.OptionsWebCompat],
    ['({x: async ()=>x})  => {}', Context.OptionsWebCompat],
    ['0 || () => 0', Context.None],
    ['0 || x => 0', Context.None],
    ['0 || (x) => 0', Context.None],
    ['0 || (x,y) => 0', Context.None],
    ['!()=>{}', Context.None],
    ['(x, y)[7] => {}', Context.None],
    ["eval => { 'use strict'; return eval + 1; }", Context.None],
    ["arguments => { 'use strict'; return arguments + 2; }", Context.None],
    ["(e, arguments) => { 'use strict'; return e + arguments; }", Context.None],
    ['x \n => d;', Context.None],
    ['(x) \n => d;', Context.None],
    ['var a = () \n => d;', Context.None],
    ['var a = (x) \n => { return d };', Context.None],
    ['var a = {}; a\n.x => d;', Context.None],
    ['var a = {}; a.x \n => d;', Context.None],
    ['x = a`c`=>{}', Context.None],
    ['([(a)]) => {};', Context.None],
    ['(x, /x/g) => x', Context.None],
    ['(x, /x/g) => x', Context.None],
    ['(a=/i/) = /i/', Context.None],
    ['(x => y) = {}', Context.None],
    ['(x => y) = {}', Context.None],
    ['(async x => y) = {}', Context.None],
    ['((x, z) => y) = {}', Context.None],
    ['(async (x, z) => y) = {}', Context.None],
    ['async("foo".bar) => x', Context.None],
    ['function x(){([(a)]) => {} }', Context.None],
    ['(a)[1]=>{}', Context.None],
    ['(a)[c]=>{};', Context.None],
    ['x = (a)`c`=>{}', Context.None],
    ['x = (a)-c=>{};', Context.None],
    ['(...a)`c`=>{}', Context.None],
    ['(...a)-c=>{};', Context.None],
    ['x = (...a)+c=>{}', Context.None],
    ['x = (...a)-c=>{};', Context.None],
    ['(a,b)+c=>{}', Context.None],
    ['x = (a,b)", "=>{}', Context.None],
    ['(a()=0)=>0', Context.None],
    ['x = (a,b)-c=>{};', Context.None],
    ['(a,...b)+c=>{}', Context.None],
    ['(a,...b)+c=>{}', Context.None],
    ['(a=1 => 42)', Context.None],
    ['([a, b] => 42)', Context.None],
    ['({a, b} => 42)', Context.None],
    ['([a, b] = [] => 42)', Context.None],
    ['({a, b} = {} => 42)', Context.None],
    ['(...a => 42)', Context.None],
    ['32 => {}', Context.None],
    ['(32) => {}', Context.None],
    ['(a, 32) => {}', Context.None],
    ['if => {}', Context.None],
    ['(if) => {}', Context.None],
    ['(a, if) => {}', Context.None],
    ['a + b => {}', Context.None],
    ['(a + b) => {}', Context.None],
    ['(a + b, c) => {}', Context.None],
    ['(a, b - c) => {}', Context.None],
    ['"a" => {}', Context.None],
    ['("a") => {}', Context.None],
    ['("a", b) => {}', Context.None],
    ['(a, "b") => {}', Context.None],
    ['-a => {}', Context.None],
    ['(-a) => {}', Context.None],
    ['(-a, b) => {}', Context.None],
    ['(a, -b) => {}', Context.None],
    ['{} => {}', Context.None],
    ['a++ => {}', Context.None],
    ['(a++) => {}', Context.None],
    ['(a++, b) => {}', Context.None],
    ['(a, b++) => {}', Context.None],
    ['[] => {}', Context.None],
    ['({...[a, b]}) => x', Context.None],
    ['({...{a, b}}) => x', Context.None],
    ['(foo ? bar : baz) => {}', Context.None],
    ['(a, foo ? bar : baz) => {}', Context.None],
    ['(foo ? bar : baz, a) => {}', Context.None],
    ['(a.b, c) => {}', Context.None],
    ['(c, a.b) => {}', Context.None],
    ["(a['b'], c) => {}", Context.None],
    ["(c, a['b']) => {}", Context.None],
    ['(...a = b) => b', Context.None],
    ["() => {'value': 42}", Context.None],
    ['enum => 1;', Context.Strict],
    ['var af = enum => 1;', Context.Strict],
    ['var af = package => 1;', Context.Strict],
    ['var af = arguments => 1;', Context.Strict],
    ['var af = eval => 1;', Context.Strict],
    ['var af = ...x => x;', Context.None],
    ['var af = yield => 1;', Context.Strict],
    ['var af = (yield) => 1;', Context.Strict],
    [
      `var af = x
    => {};`,
      Context.None
    ],
    ['var f = (a = 0) => { "use strict"; };', Context.None],
    [')', Context.None],
    [') => 0', Context.None],
    ['=> 0', Context.None],
    ['=>', Context.None],
    ['=> {}', Context.None],
    ['([x.y]=z) => z', Context.None],
    [') => {}', Context.None],
    ['(()) => 0', Context.None],
    ['((x)) => 0', Context.None],
    ['((x, y)) => 0', Context.None],
    ['(x, (y)) => 0', Context.None],
    ['((x, y, z)) => 0', Context.None],
    ['([...x.y]) => z', Context.None],
    ['([...(x), y] = z) => 0', Context.None],
    ['((x, y, z)) => 0', Context.None],
    ['((x, y, z)) => 0', Context.None],
    ['((x, y, z)) => 0', Context.None],
    ['([...x.y] = z) => z', Context.None],
    ['(x, (y, z)) => 0', Context.None],
    ['((x, y), z) => 0', Context.None],
    ['(a => a) +', Context.None],
    ['eval => { "use strict"; 0 }', Context.None],
    ['arguments => { "use strict"; 0 }', Context.None],
    ['a => (b => (a + b)', Context.None],
    [`([[[[[[[[[[[[[[[[[[[[{a:b[0]}]]]]]]]]]]]]]]]]]]]])=>0;`, Context.None],
    [`bar ? (=> 0) : baz;`, Context.None],
    [`() => {} 1`, Context.None],
    [`() => {} a`, Context.None],
    [`(...a, ...b) => {}`, Context.None],
    [`(...a, ...b) => {}`, Context.None],
    [`(a, ...b,) => {}`, Context.None],
    [`(async (...a, b) => {})`, Context.None],
    [`(async (...a, ...b) => {})`, Context.None],
    [`() => {} a()`, Context.None],
    [`() => {} 1`, Context.None],
    [`((x, y)) => 0`, Context.None],
    ['(b = (a,)) => {}', Context.None],
    [`32 => {}`, Context.None],
    [`(32) => {}`, Context.None],
    [`if => {}`, Context.None],
    [`a++ => {}`, Context.None],
    [`(a, b++) => {}`, Context.None],
    [`(a, foo ? bar : baz) => {}`, Context.None],
    [`(a.b, c) => {}`, Context.None],
    [`(a['b'], c) => {}`, Context.None],
    [`(a, (b)) => 42;`, Context.None],
    [`({get a(){}}) => 0;`, Context.None],
    [`([a,...b,])=>0;`, Context.None],
    [`({a:b[0]})=>0`, Context.None],
    [`({}=>0)`, Context.None],
    [`({a:b[0]})=>0`, Context.None],
    [`({}=>0)`, Context.None],
    [`(a['b'], c) => {}`, Context.None],
    [`(...a = b) => b`, Context.None],
    [`(-a) => {}`, Context.None],
    [`(...rest - a) => b`, Context.None],
    [`(a, ...b - 10) => b`, Context.None],
    [`((x, y), z) => 0`, Context.None],
    ['(a\n=> a)(1)', Context.None],
    ['(a/*\n*/=> a)(1)', Context.None],
    ['((a)\n=> a)(1)', Context.None],
    ['((a)/*\n*/=> a)(1)', Context.None],
    ['((a, b)\n=> a + b)(1, 2)', Context.None],
    ['((a, b)/*\n*/=> a + b)(1, 2)', Context.None],
    [`[]=>0`, Context.None],
    [`() ? 0`, Context.None],
    [`(a)\n=> 0`, Context.None],
    [`1 + ()`, Context.None],
    [`(a,...a)/*\u2028*/ => 0`, Context.None],
    [`(a,...a)\n`, Context.None],
    [`() <= 0`, Context.None],
    [`(a,...a)/*\u202a*/`, Context.None],
    [`(a,...a)/*\n*/ => 0`, Context.None],
    [`left = (aSize.width/2) - ()`, Context.None],
    [`(10) => 0;`, Context.None],
    [`"use strict"; (a) => 00;`, Context.None],
    ['("a", b) => {}', Context.None],
    ['(a, "b") => {}', Context.None],
    ['-a => {}', Context.None],
    ['(-a) => {}', Context.None],
    ['(-a, b) => {}', Context.None],
    ['(a, -b) => {}', Context.None],
    ['{} => {}', Context.None],
    ['a++ => {}', Context.None],
    ['(a++) => {}', Context.None],
    ['(a++, b) => {}', Context.None],
    ['(a, b++) => {}', Context.None],
    ['[] => {}', Context.None],
    ['(foo ? bar : baz) => {}', Context.None],
    ['(a, foo ? bar : baz) => {}', Context.None],
    ['(foo ? bar : baz, a) => {}', Context.None],
    ['(a.b, c) => {}', Context.None],
    ["(a['b'], c) => {}", Context.None],
    ["(c, a['b']) => {}", Context.None],
    ['(...a = b) => b', Context.None],
    ['(...rest - a) => b', Context.None],
    ['(a, ...b - 10) => b', Context.None],
    ['let x = {y=z} => d', Context.None],
    ['let x = {y=z}', Context.None],
    ['(..a, ...b) => c', Context.None],
    ['([0])=>0;', Context.None],
    ['({0})=>0;', Context.None],
    ['({a:b[0]}) => x', Context.None],
    ['f = ([...[x], y] = [1, 2, 3]) => {};', Context.None],
    ['f = ([...[ x ] = []] = []) => {};', Context.None],
    ['f = ([...{ x }, y]) => {};', Context.None],
    ['f = ([...{ x }, y]) => {};', Context.None],
    ['1 + ()', Context.None],
    ['((x)) => a', Context.None],
    ['(function *g(z = ( [x=(yield)]) => {}) { });', Context.None],
    ['(function *g(z = ( x=yield) => {}) { });', Context.None],
    ['(x, (y, z)) => a', Context.None],
    ['((x, y), z) =>  a', Context.None],
    ['f = ([...{ x } = []]) => {};', Context.None],
    ['(function *g([x = class extends (a ? null : yield) { }] = [null]) { });', Context.None],
    ['(function *g(x = class { [y = (yield, 1)]() { } }) { });', Context.None],
    ['(function *g(x = class extends (yield) { }) { });', Context.None],
    ['()=c=>{}=>{}', Context.None],
    ['()[1]=>{}', Context.None],
    ['()c++=>{}', Context.None],
    ['()-c=>{}', Context.None],
    ['(a,b)(c)=>{}', Context.None],
    ['(a,...b)[c]=>{}', Context.None],
    ['=> 0', Context.None],
    ['() =>', Context.None],
    ['=> {}', Context.None],
    [', => {}', Context.None],
    ['() => {"value": 42}', Context.None],
    ['(()) => 0', Context.None],
    ['((x, y)) => 0', Context.None],
    ['(x, (y)) => 0', Context.None],
    ['(localVar |= defaultValue) => {}', Context.None],
    ['([{x: y.z}]) => b', Context.None],
    ['([{x: y.z}] = a) => b', Context.None],
    ['([{x: y.z} = a]) => b', Context.None],
    ['({x: y.z} = a) => b', Context.None],
    ['([{x: y.z}]) => b', Context.None],
    ['([{x: y.z}] = a) => b', Context.None],
    ['([{"foo": y.z} = a]) => b', Context.None],
    ['({"foo": y.z} = a) => b', Context.None],
    ['([{"foo": y.z}]) => b', Context.None],
    ['([{"foo": y.z}] = a) => b', Context.None],
    ['([{1: y.z} = a]) => b', Context.None],
    ['({333: y.z} = a) => b', Context.None]
  ]);

  for (const arg of [
    `function foo() { }; foo(() => "abc"); foo(() => "abc", 123);`,
    `({})[x => x]`,
    `() => () => 0`,
    `() => x => (a, b, c) => 0`,
    `y => () => (a) => 0`,
    `function * foo() { yield ()=>{}; }`,
    `function foo() { }; foo((x, y) => "abc"); foo(b => "abc", 123);`,
    `(a, b) => { return a * b; }`,
    `a = () => {return (3, 4);};`,
    `"use strict";
((one, two) => {});`,
    `([])=>0;`,
    `(function (x) { return x => x; })(20)(10)`,
    `(function () { return x => x; })()(10)`,
    ` (function () {  return x => x; })()(10)`,
    `() => true ? 1 : (() => false ? 1 : (0))`,
    `l = async() => true ? 1 : (() => false ? 1 : (0))`,
    `([,,])=>0`,
    `([a,...b])=>0;`,
    `([a,b])=>0;`,
    `([a]) => [0];`,
    `({a,b=b,a:c,[a]:[d]})=>0;`,
    `(() => {}) || true;
    (() => {}) ? a : b;`,
    '(() => {}) + 2',
    'new (() => {});',
    'bar ? ( (x) => x ) : baz;',
    'bar ? ( (x, y) => (u, v) => x*u + y*v ) : baz;',
    'bar ? ( (a, b) => 0, (c, d) => 1 ) : baz;',
    'bar ? ( (a, (a, (b, c) => 0)) ) : baz;',
    'bar ? ( foo ? bar : baz => {} ) : baz;',
    'bar ? ( (a, {}) => {} ) : baz;',
    'bar ? ( (x, y = 9) => {} ) : baz;',
    'bar ? ( (...a) => {} ) : baz;',
    'bar ? ( ([x] = []) => {} ) : baz;',
    'bar ? ( (x = 9, ...a) => {} ) : baz;',
    '(x, y = 9, {b}, z = 8, ...a) => {}',
    '(x = 9) => {}',
    '([x = 0]) => {}',
    '(a, (a, (b, c) => 0))',
    `a => 0`,
    `() => () => 0`,
    '() => 0, 1',
    '() => 0 + 1',
    '(a,b) => 0 + 1',
    `(a,b,...c) => 0 + 1`,
    '() => (a) = 0',
    'a => b => c => 0',
    '(e) => "test"',
    '(a, ...[]) => 1',
    "(x)=>{'use strict';}",
    '(() => 5)() === 5;',
    'a, b => 0',
    'a, b, (c, d) => 0',
    '(a, b, (c, d) => 0)',
    '(a, b) => 0, (c, d) => 1',
    '(a, b => {}, a => a + 1)',
    '((a, b) => {}, (a => a + 1))',
    '(x, y = 9, ...a) => {}',
    '(x, y = 9, {b}, z = 8, ...a) => {}',
    '({a} = {}) => {}',
    '([x] = []) => {}',
    '({a = 42}) => {}',
    '([x = 0]) => {}',
    '(a, (a, (b, c) => 0))',
    '() => a + b - yield / 1',
    'f = (function() { return z => arguments[0]; }(5));',
    '({y}) => x;',
    '([x = 10]) => x',
    '({x = 10, y: { z = 10 }}) => [x, z]',
    '({x = 10}) => x',
    `([y]) => x;`,
    '1 ? 0 : a => {}, 17, 42;',
    '17, 42, 1 ? 0 : a => {};',
    '({ ...0 ? 1 : a => {} })',
    'function f1(x = 0 ? 1 : a => {}) { return x; }',
    '(x=1) => x * x;',
    '(eval = 10) => 42;',
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
    '(a, b=(c)=>{}) => {}',
    '(async function foo(a) { await a });',
    '(a,b) =>{}',
    'x = (a,b) =>{}',
    '(a,...b) =>{}',
    'x = (a,...b) =>{}',
    'foo((x, y) => {});',
    'e => { 42; };',
    'e => ({ property: 42 });',
    '(a, b) => { 42; };',
    '(x) => ((y, z) => (x, y, z));',
    '(a) => 00;',
    'e => "test";',
    'e => t => "test";',
    'a =>{}',
    '(...a) =>{}',
    'x = a =>{}',
    '(a,b) => [a]',
    '() => { value: b}',
    '(x, y) => { x.a = y; }',
    '(x, y) => x.a = y',
    'x => (y, z) => z * (x + y)',
    '(a = b, c) => {}',
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
    '(x, ...a) => {}',
    '({a} = {}) => {}',
    '({a} = {}) => {}',
    '(interface, eval) => {}',
    'yield => {}',
    'arguments => {}',
    '(...[]) => 0',
    '(()=>0)',
    '((a)=>0)',
    '() => 0',
    '(...a) => 0',
    '([a]) => 0',
    'eval => {}',
    'arguments => {}',
    'yield => {}',
    '([a,[b],...b])=>0',
    'foo(([a,b]) => 42)',
    'foo((a=1) => 42)',
    '(...a) => 42',
    '([a, b], ...c) => 42',
    '({a, b}, ...c) => 42',
    '({a, b}) => (([a, b]) => 42)',
    'foo(([a, b]) => 42);',
    '(a, b, ...c) => 42',
    'interface => {}',
    '(eval) => {}',
    '(arguments) => {}',
    '(yield) => {}',
    '(interface) => {}',
    '(eval, bar) => {}',
    '(bar, eval) => {}',
    '(bar, arguments) => {}',
    '(bar, yield) => {}',
    '(bar, interface) => {}',
    '_ => {}\n/foo/',
    '_ => {}\n/foo/g',
    'f(new /z/())',
    'f(new /z/.foo)',
    '(arguments, interface) => {}',
    '(() => null)();',
    '(() => {})()',
    '() => { [a, b] = [1, 2] }',
    '() => [a, b] = [1, 2]',
    '(...args) => console.log( args );',
    'double = (x) => x * 2',
    'Y = F => (x=>F(y=>(x(x))(y)))(x=>F(y=>(x(x))(y)))',
    'factorial = x =>  x < 1 ? 1 : x * factorial(x-1)',
    'a => (a + 1)',
    'sum = ( ...nums ) => nums.reduce( ( t, n ) => t + n, 0 );',
    `'use strict';
     setTimeout( () => console.log( this ) );
      function foo () {
      'use strict';
      setTimeout( () => console.log( this ) );
    }`,
    'new (() => {});',
    'bar ? ( (x) => x ) : baz;',
    '(x = 9) => {}',
    '([x = 0]) => {}',
    '(a, (a, (b, c) => 0))',
    `a => 0`,
    `() => () => 0`,
    '() => 0, 1',
    '() => 0 + 1',
    '(a,b) => 0 + 1',
    `(a,b,...c) => 0 + 1`,
    '() => (a) = 0',
    'a => b => c => 0',
    '(e) => "test"',
    '(a, ...[]) => 1',
    '(a, ...[{a = (b) - 2}]) => 1',
    '(a, ...[a = b = c = d]) => 1',
    '(a, ...[a = b = c = d => 1]) => 1',
    '(a, ...[]) => (a, ...[]) => 1',
    "(x)=>{'use strict';}",
    '(() => 5)() === 5;',
    '(() => 5)() === 5 ? a : b;',
    '(() => 5)() === 5 ? a : b => a + b - yield / 1;',
    '() => a + b - yield / 1',
    '(() => { try { Function("0 || () => 2")(); } catch(e) { return true; } })();',
    'var f = (function() { return z => arguments[0]; }(5));',
    'yield => { "use strict"; 0 }',
    "interface => { 'use strict'; 0 }",
    '({y}) => x;',
    '([x = 10]) => x',
    '([x = 10]) => x = ([x = 10]) => x',
    '({x = 10, y: { z = 10 }}) => [x, z]',
    '({x = 10}) => x',
    `([y]) => x;`,
    `([y]) => ([y]) => x;`,
    '(x=1) => x * x;',
    '(x=1) => x * (x = y);',
    '(eval = 10) => 42;',
    '(a, b=(c)=>{}) => {}',
    'var double = (x) => x * 2',
    'let Y = F => (x=>F(y=>(x(x))(y)))(x=>F(y=>(x(x))(y)))',
    `'use strict';
    setTimeout( () => console.log( this ) );
     function foo () {
     'use strict';
     setTimeout( () => console.log( this ) );
   }`,
    'var x = a =>{}',
    'async foo => bar',
    '(async foo => bar)',
    `() => {}`,
    `() => {(async foo => bar)}`,
    `a => {}`,
    `a => {a => {a => {a => {a => {a => {}}}}}}`,
    `async () => {}`,
    `async () => {async () => {async () => {async () => {async () => {}}}}}`,
    `async => {}`,
    '({ async foo(b, c, b){} });',
    `async => {}
   async => {}`,
    `() => () => () => {}`,
    `() => () => ({a = b} = c) => b * c`,
    `() => () => () => { async(a-vb) }`,
    `() => {}
    async()
    async => {}
    async => {}
    a => {}
    a => {}`,
    `() => {}`,
    `() => {}
    async()
    async => {}
    async => {}
    a => {}
    a => {}`,
    `() => {}`,
    `() => {}
   async()
   async => {}
   async => {}
   a => {}
   a => {}`,
    `() => {}`,
    `() => {}
  async()
  async => {}
  async => {}
  a => {}
  a => {}`,
    '(async => async)',
    `() => {}
  a()
  async()`,
    `(z = [...x.y]) => z`,
    `a => a => a => async a => a`,
    `a => a => a => a => a => a => a => a => a => a => a => a => a => a => a => async a => a`,
    'var f = (function() { return z => arguments[0]; }(5));'
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

    it(`function x(){${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function x(){${arg} }`, undefined, Context.None);
      });
    });
  }

  pass('Expressions - Arrow (pass)', [
    [
      'f = ([[,] = g()]) => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'f'
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [null]
                        },
                        right: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'g'
                          },
                          arguments: []
                        }
                      }
                    ]
                  }
                ],
                id: null,
                async: false,
                expression: false
              }
            }
          }
        ]
      }
    ],
    [
      'f = ([[,] = g()]) => {}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'f'
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [null]
                        },
                        right: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'g'
                          },
                          arguments: []
                        }
                      }
                    ]
                  }
                ],
                id: null,
                async: false,
                expression: false
              }
            }
          }
        ]
      }
    ],
    [
      '([[[[[[[[[[[[[[[[[[[[{a=b}]]]]]]]]]]]]]]]]]]]])=>0;',
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
                value: 0
              },
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'ArrayPattern',
                                  elements: [
                                    {
                                      type: 'ArrayPattern',
                                      elements: [
                                        {
                                          type: 'ArrayPattern',
                                          elements: [
                                            {
                                              type: 'ArrayPattern',
                                              elements: [
                                                {
                                                  type: 'ArrayPattern',
                                                  elements: [
                                                    {
                                                      type: 'ArrayPattern',
                                                      elements: [
                                                        {
                                                          type: 'ArrayPattern',
                                                          elements: [
                                                            {
                                                              type: 'ArrayPattern',
                                                              elements: [
                                                                {
                                                                  type: 'ArrayPattern',
                                                                  elements: [
                                                                    {
                                                                      type: 'ArrayPattern',
                                                                      elements: [
                                                                        {
                                                                          type: 'ArrayPattern',
                                                                          elements: [
                                                                            {
                                                                              type: 'ArrayPattern',
                                                                              elements: [
                                                                                {
                                                                                  type: 'ArrayPattern',
                                                                                  elements: [
                                                                                    {
                                                                                      type: 'ArrayPattern',
                                                                                      elements: [
                                                                                        {
                                                                                          type: 'ArrayPattern',
                                                                                          elements: [
                                                                                            {
                                                                                              type: 'ArrayPattern',
                                                                                              elements: [
                                                                                                {
                                                                                                  type: 'ObjectPattern',
                                                                                                  properties: [
                                                                                                    {
                                                                                                      type: 'Property',
                                                                                                      key: {
                                                                                                        type:
                                                                                                          'Identifier',
                                                                                                        name: 'a'
                                                                                                      },
                                                                                                      value: {
                                                                                                        type:
                                                                                                          'AssignmentPattern',
                                                                                                        left: {
                                                                                                          type:
                                                                                                            'Identifier',
                                                                                                          name: 'a'
                                                                                                        },
                                                                                                        right: {
                                                                                                          type:
                                                                                                            'Identifier',
                                                                                                          name: 'b'
                                                                                                        }
                                                                                                      },
                                                                                                      kind: 'init',
                                                                                                      computed: false,
                                                                                                      method: false,
                                                                                                      shorthand: true
                                                                                                    }
                                                                                                  ]
                                                                                                }
                                                                                              ]
                                                                                            }
                                                                                          ]
                                                                                        }
                                                                                      ]
                                                                                    }
                                                                                  ]
                                                                                }
                                                                              ]
                                                                            }
                                                                          ]
                                                                        }
                                                                      ]
                                                                    }
                                                                  ]
                                                                }
                                                              ]
                                                            }
                                                          ]
                                                        }
                                                      ]
                                                    }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],

    [
      'a => a + x',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '+'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'a => a / x',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '/'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'a => x.foo',
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
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'x'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(() => {}) << x',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                async: false,
                body: {
                  body: [],
                  type: 'BlockStatement'
                },
                expression: false,
                id: null,
                params: [],
                type: 'ArrowFunctionExpression'
              },
              operator: '<<',
              right: {
                name: 'x',
                type: 'Identifier'
              },
              type: 'BinaryExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'a => x[foo]',
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
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'x'
                },
                computed: true,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'a => x()',
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
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '() => {}\n+function(){}',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                async: false,
                body: {
                  body: [],
                  type: 'BlockStatement'
                },
                expression: false,
                id: null,
                params: [],
                type: 'ArrowFunctionExpression'
              },
              operator: '+',
              right: {
                async: false,
                body: {
                  body: [],
                  type: 'BlockStatement'
                },
                expression: false,
                generator: false,
                id: null,
                params: [],
                type: 'FunctionExpression'
              },
              type: 'BinaryExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'fn = (a, b, ...c) => c;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'fn'
              },
              operator: '=',
              right: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'c'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'c'
                    }
                  }
                ],
                id: null,
                async: false,

                expression: true
              }
            }
          }
        ]
      }
    ],
    [
      '(interface)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'interface'
            }
          }
        ]
      }
    ],
    [
      '({}) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: []
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(x = yield = x) => x',
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
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '([x = yield]) => x',
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
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '([x, {y: [yield]}])',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
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
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'yield'
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([], a) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'ArrayPattern',
                  elements: []
                },
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(a = b) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      `(expect, subject, typeName) => {
          typeName = /^reg(?:exp?|ular expression)$/.test(typeName)
            ? 'regexp'
            : typeName;
          expect.argsOutput[0] = output => {
            output.jsString(typeName);
          };
          if (!expect.getType(typeName)) {
            expect.errorMode = 'nested';
            expect.fail(output => {
              output
                .error('Unknown type:')
                .sp()
                .jsString(typeName);
            });
          }
        }`,
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
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'typeName'
                      },
                      operator: '=',
                      right: {
                        type: 'ConditionalExpression',
                        test: {
                          type: 'CallExpression',
                          callee: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Literal',
                              value: /^reg(?:exp?|ular expression)$/,
                              regex: {
                                pattern: '^reg(?:exp?|ular expression)$',
                                flags: ''
                              }
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'test'
                            }
                          },
                          arguments: [
                            {
                              type: 'Identifier',
                              name: 'typeName'
                            }
                          ]
                        },
                        consequent: {
                          type: 'Literal',
                          value: 'regexp'
                        },
                        alternate: {
                          type: 'Identifier',
                          name: 'typeName'
                        }
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'expect'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'argsOutput'
                          }
                        },
                        computed: true,
                        property: {
                          type: 'Literal',
                          value: 0
                        }
                      },
                      operator: '=',
                      right: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Identifier',
                                    name: 'output'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'Identifier',
                                    name: 'jsString'
                                  }
                                },
                                arguments: [
                                  {
                                    type: 'Identifier',
                                    name: 'typeName'
                                  }
                                ]
                              }
                            }
                          ]
                        },
                        params: [
                          {
                            type: 'Identifier',
                            name: 'output'
                          }
                        ],
                        id: null,
                        async: false,

                        expression: false
                      }
                    }
                  },
                  {
                    type: 'IfStatement',
                    test: {
                      type: 'UnaryExpression',
                      operator: '!',
                      argument: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'expect'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'getType'
                          }
                        },
                        arguments: [
                          {
                            type: 'Identifier',
                            name: 'typeName'
                          }
                        ]
                      },
                      prefix: true
                    },
                    consequent: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'expect'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'errorMode'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 'nested'
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'expect'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'fail'
                              }
                            },
                            arguments: [
                              {
                                type: 'ArrowFunctionExpression',
                                body: {
                                  type: 'BlockStatement',
                                  body: [
                                    {
                                      type: 'ExpressionStatement',
                                      expression: {
                                        type: 'CallExpression',
                                        callee: {
                                          type: 'MemberExpression',
                                          object: {
                                            type: 'CallExpression',
                                            callee: {
                                              type: 'MemberExpression',
                                              object: {
                                                type: 'CallExpression',
                                                callee: {
                                                  type: 'MemberExpression',
                                                  object: {
                                                    type: 'Identifier',
                                                    name: 'output'
                                                  },
                                                  computed: false,
                                                  property: {
                                                    type: 'Identifier',
                                                    name: 'error'
                                                  }
                                                },
                                                arguments: [
                                                  {
                                                    type: 'Literal',
                                                    value: 'Unknown type:'
                                                  }
                                                ]
                                              },
                                              computed: false,
                                              property: {
                                                type: 'Identifier',
                                                name: 'sp'
                                              }
                                            },
                                            arguments: []
                                          },
                                          computed: false,
                                          property: {
                                            type: 'Identifier',
                                            name: 'jsString'
                                          }
                                        },
                                        arguments: [
                                          {
                                            type: 'Identifier',
                                            name: 'typeName'
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                },
                                params: [
                                  {
                                    type: 'Identifier',
                                    name: 'output'
                                  }
                                ],
                                id: null,
                                async: false,

                                expression: false
                              }
                            ]
                          }
                        }
                      ]
                    },
                    alternate: null
                  }
                ]
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'expect'
                },
                {
                  type: 'Identifier',
                  name: 'subject'
                },
                {
                  type: 'Identifier',
                  name: 'typeName'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(a, b = c) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(x, y = 9, z = 8) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  right: {
                    type: 'Literal',
                    value: 9
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'Literal',
                    value: 8
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '({a} = {}) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
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
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      'let x = ({y=z}=e) => d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Identifier',
                    name: 'd'
                  },
                  params: [
                    {
                      type: 'AssignmentPattern',
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
                                name: 'y'
                              },
                              right: {
                                type: 'Identifier',
                                name: 'z'
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
                        name: 'e'
                      }
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '([x] = []) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    elements: []
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(...a) => 0',
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
                value: 0
              },
              params: [
                {
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'e => "test"',
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
                value: 'test'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'e'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'e => { label: 42 }',
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
                type: 'BlockStatement',
                body: [
                  {
                    type: 'LabeledStatement',
                    label: {
                      type: 'Identifier',
                      name: 'label'
                    },
                    body: {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'Literal',
                        value: 42
                      }
                    }
                  }
                ]
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'e'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(a, b) => { 42; }',
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
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Literal',
                      value: 42
                    }
                  }
                ]
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(x=1) => x * x',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '*'
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Literal',
                    value: 1
                  }
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'arguments => 42',
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
                value: 42
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'arguments'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(eval = 10) => 42',
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
                value: 42
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'eval'
                  },
                  right: {
                    type: 'Literal',
                    value: 10
                  }
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(x) => ((y, z) => (x, y, z))',
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
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      name: 'y'
                    },
                    {
                      type: 'Identifier',
                      name: 'z'
                    }
                  ]
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'y'
                  },
                  {
                    type: 'Identifier',
                    name: 'z'
                  }
                ],
                id: null,
                async: false,

                expression: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'foo(() => {})',
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
                type: 'Identifier',
                name: 'foo'
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [],
                  id: null,
                  async: false,

                  expression: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo((x, y) => {})',
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
                type: 'Identifier',
                name: 'foo'
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      name: 'y'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x => { function x() {} }',
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
                type: 'BlockStatement',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    expression: false,
                    id: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(a, ...b) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(...a) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(a = 1) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Literal',
                    value: 1
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      `async (eval) => "use strict";`,
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              id: null,
              expression: true,

              async: true,
              params: [
                {
                  type: 'Identifier',
                  name: 'eval'
                }
              ],
              body: {
                type: 'Literal',
                value: 'use strict'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(x) => { function x() {} }',
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
                type: 'BlockStatement',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    expression: false,
                    id: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '([x, y] = z) => x;',
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
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      },
                      {
                        type: 'Identifier',
                        name: 'y'
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'z'
                  }
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '([...x]) => x',
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
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '([x, ...y]) => x',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '([[x, y] = z]) => x;',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'x'
                          },
                          {
                            type: 'Identifier',
                            name: 'y'
                          }
                        ]
                      },
                      right: {
                        type: 'Identifier',
                        name: 'z'
                      }
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(x, y)=>x;',
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
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(a = 1, b = 2) => x;',
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
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Literal',
                    value: 1
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Literal',
                    value: 2
                  }
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'a = (b) => c;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
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
                id: null,
                async: false,

                expression: true
              }
            }
          }
        ]
      }
    ],
    [
      '({x});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({ident: {x: y}}) => x',
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
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'ident'
                      },
                      value: {
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
                              name: 'y'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '({ident: {x}}) => x',
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
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'ident'
                      },
                      value: {
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
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '({a} = b,) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
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
                          type: 'Identifier',
                          name: 'a'
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
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(a, b, (c, d) => 0)',
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
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Literal',
                    value: 0
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'c'
                    },
                    {
                      type: 'Identifier',
                      name: 'd'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(a, b) => 0, (c, d) => 1',
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
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Literal',
                    value: 0
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Literal',
                    value: 1
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'c'
                    },
                    {
                      type: 'Identifier',
                      name: 'd'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(a, b => {}, a => a + 1)',
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
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: false
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    operator: '+'
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '() => a + b - yield / 1',
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
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '+'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  right: {
                    type: 'Literal',
                    value: 1
                  },
                  operator: '/'
                },
                operator: '-'
              },
              params: [],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '({x = 10, y: { z = 10 }}) => [x, z]',
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
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'Identifier',
                    name: 'z'
                  }
                ]
              },
              params: [
                {
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
                          type: 'Literal',
                          value: 10
                        }
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
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            value: {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'z'
                              },
                              right: {
                                type: 'Literal',
                                value: 10
                              }
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '({x = 10}) => x',
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
                          type: 'Literal',
                          value: 10
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(a, {}) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'ObjectPattern',
                  properties: []
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '({}, a) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: []
                },
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(eval = 10) => 42;',
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
                value: 42
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'eval'
                  },
                  right: {
                    type: 'Literal',
                    value: 10
                  }
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(a = b, c) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                {
                  type: 'Identifier',
                  name: 'c'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(x = 9) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Literal',
                    value: 9
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(a) => 00;',
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
                value: 0
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(x, y) => x + y',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'y'
                },
                operator: '+'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(x, y) => z => z * (x + y)',
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
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    operator: '+'
                  },
                  operator: '*'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'z'
                  }
                ],
                id: null,
                async: false,

                expression: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '({a} = {}) => {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
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
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '() => bar',
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
                name: 'bar'
              },
              params: [],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(( [x]=f(yield) )=>{});',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  },
                  right: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'f'
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    ]
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(( {x=f(yield)} )=>{});',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
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
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'f'
                          },
                          arguments: [
                            {
                              type: 'Identifier',
                              name: 'yield'
                            }
                          ]
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      'for ( f => ( "key" in {}) ; 0;);',
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
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BinaryExpression',
                left: {
                  type: 'Literal',
                  value: 'key'
                },
                right: {
                  type: 'ObjectExpression',
                  properties: []
                },
                operator: 'in'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'f'
                }
              ],
              id: null,
              async: false,

              expression: true
            },
            test: {
              type: 'Literal',
              value: 0
            },
            update: null
          }
        ]
      }
    ],
    [
      '(x, y) => z => z * (x + y);',
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
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    operator: '+'
                  },
                  operator: '*'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'z'
                  }
                ],
                id: null,
                async: false,

                expression: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'x => (y, z) => z * (x + y)',
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
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    operator: '+'
                  },
                  operator: '*'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'y'
                  },
                  {
                    type: 'Identifier',
                    name: 'z'
                  }
                ],
                id: null,
                async: false,

                expression: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'a, b => 0;',
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
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Literal',
                    value: 0
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'a, b, (c, d) => 0;',
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
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Literal',
                    value: 0
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'c'
                    },
                    {
                      type: 'Identifier',
                      name: 'd'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'var x = ({x = 30}, [y], z) => x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  params: [
                    {
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
                              type: 'Literal',
                              value: 30
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'y'
                        }
                      ]
                    },
                    {
                      type: 'Identifier',
                      name: 'z'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var x = ([x = 25]) => x => x => ({x} = {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'AssignmentExpression',
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
                            }
                          ]
                        },
                        operator: '=',
                        right: {
                          type: 'ObjectExpression',
                          properties: []
                        }
                      },
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      id: null,
                      async: false,

                      expression: true
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],
                    id: null,
                    async: false,

                    expression: true
                  },
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            value: 25
                          }
                        }
                      ]
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var x = foo => x => x => x => {x}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'Identifier',
                                name: 'x'
                              }
                            }
                          ]
                        },
                        params: [
                          {
                            type: 'Identifier',
                            name: 'x'
                          }
                        ],
                        id: null,
                        async: false,

                        expression: false
                      },
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      id: null,
                      async: false,

                      expression: true
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],
                    id: null,
                    async: false,

                    expression: true
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '(a, b) => 0, (c, d) => 1;',
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
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Literal',
                    value: 0
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Literal',
                    value: 1
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'c'
                    },
                    {
                      type: 'Identifier',
                      name: 'd'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(a, b => {}, a => a + 1);',
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
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: false
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    operator: '+'
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '((a, b) => {}, (a => a + 1));',
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
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: false
                },
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    operator: '+'
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(a, (a, (b, c) => 0));',
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
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'Literal',
                        value: 0
                      },
                      params: [
                        {
                          type: 'Identifier',
                          name: 'b'
                        },
                        {
                          type: 'Identifier',
                          name: 'c'
                        }
                      ],
                      id: null,
                      async: false,

                      expression: true
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo ? bar : baz => {};',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'foo'
              },
              consequent: {
                type: 'Identifier',
                name: 'bar'
              },
              alternate: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'baz'
                  }
                ],
                id: null,
                async: false,

                expression: false
              }
            }
          }
        ]
      }
    ],
    [
      '(a, {}) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'ObjectPattern',
                  properties: []
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '({}, a) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: []
                },
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '({a}) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(x = 9) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Literal',
                    value: 9
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(x, y = 9) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  right: {
                    type: 'Literal',
                    value: 9
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(x = 9, y) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Literal',
                    value: 9
                  }
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(x, y = 9, z = 8) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  right: {
                    type: 'Literal',
                    value: 9
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'Literal',
                    value: 8
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '({a} = {}) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
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
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '([x] = []) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    elements: []
                  }
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '([x = 0]) => {};',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Literal',
                        value: 0
                      }
                    }
                  ]
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      `(a) => b;  // 1 args
    (a, b) => c;  // n args
    () => b;  // 0 args
    (a) => (b) => c;  // func returns func returns func
    (a) => ((b) => c);  // So these parens are dropped
    () => (b,c) => d;  // func returns func returns func
    a=>{return b;}
    a => 'e';  // Dropping the parens`,
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
                name: 'b'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Identifier',
                name: 'c'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Identifier',
                name: 'b'
              },
              params: [],
              id: null,
              async: false,

              expression: true
            }
          },
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
                id: null,
                async: false,

                expression: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          },
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
                id: null,
                async: false,

                expression: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'd'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'b'
                  },
                  {
                    type: 'Identifier',
                    name: 'c'
                  }
                ],
                id: null,
                async: false,

                expression: true
              },
              params: [],
              id: null,
              async: false,

              expression: true
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ReturnStatement',
                    argument: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  }
                ]
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: false
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Literal',
                value: 'e'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              id: null,
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'const a = () => {return (3, 4);};',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: {
                          type: 'SequenceExpression',
                          expressions: [
                            {
                              type: 'Literal',
                              value: 3
                            },
                            {
                              type: 'Literal',
                              value: 4
                            }
                          ]
                        }
                      }
                    ]
                  },
                  params: [],
                  id: null,
                  async: false,

                  expression: false
                },
                id: {
                  type: 'Identifier',
                  name: 'a'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `(() => {}) || true;
    (() => {}) ? a : b;`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                params: [],
                id: null,
                async: false,

                expression: false
              },
              right: {
                type: 'Literal',
                value: true
              },
              operator: '||'
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                params: [],
                id: null,
                async: false,

                expression: false
              },
              consequent: {
                type: 'Identifier',
                name: 'a'
              },
              alternate: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      '(() => {}) + 2',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                params: [],
                id: null,
                async: false,

                expression: false
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'bar ? ( (x, y) => (u, v) => x*u + y*v ) : baz;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'bar'
              },
              consequent: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'u'
                      },
                      operator: '*'
                    },
                    right: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'v'
                      },
                      operator: '*'
                    },
                    operator: '+'
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'u'
                    },
                    {
                      type: 'Identifier',
                      name: 'v'
                    }
                  ],
                  id: null,
                  async: false,

                  expression: true
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'Identifier',
                    name: 'y'
                  }
                ],
                id: null,
                async: false,

                expression: true
              },
              alternate: {
                type: 'Identifier',
                name: 'baz'
              }
            }
          }
        ]
      }
    ]
  ]);
});
