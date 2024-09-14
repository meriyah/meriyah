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
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
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

    it(`async ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`async ${arg};`, undefined, Context.OptionsWebCompat | Context.OptionsNext);
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

    it(`v = ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`v = ${arg};`, undefined, Context.OptionsNext);
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

    it(`var x = ()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`var x = ()${arg} =>{}`, undefined, Context.OptionsNext);
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
    ['"use strict"; let => {}', Context.OptionsLexical],
    ['let => {}', Context.Strict | Context.Module],
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
    ['() => { let [x] }', Context.None],
    ['() => { let [] }', Context.None],
    ['a = b\n=> c', Context.None],
    ['a = b\n=>\nc', Context.None],
    ['a\n= b\n=> c', Context.None],
    ['(p\\u0061ckage) => { }', Context.Strict],
    ['(p\\u0061ckage, a) => { }', Context.Strict],
    ['(a, p\\u0061ckage) => { }', Context.Strict],
    ['(p\\u0061ckage) => { "use strict"; }', Context.None],
    ['(p\\u0061ckage, a) => { "use strict"; }', Context.None],
    ['(a, p\\u0061ckage) => { "use strict"; }', Context.None],
    ['(p\\x61ckage) => { }', Context.None],
    ['(p\\x61ckage) => { "use strict"; }', Context.None],
    ['(p\\141ckage) => { "use strict"; }', Context.None],
    ['package => { "use strict"; }', Context.None],
    ['p\\u0061ckage => { }', Context.Strict],
    ['p\\u0061ckage => { "use strict"; }', Context.None],
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
    [`(...x,) => x`, Context.None],
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
    '([a,[b],...c])=>0',
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
    '(a, ...[{b = (c) - 2}]) => 1',
    '(x, ...[y = b = c = d]) => 1',
    '(x, ...[y = b = c = d => 1]) => 1',
    '(x, ...[]) => (y, ...[]) => 1',
    "(x)=>{'use strict';}",
    '(() => 5)() === 5;',
    '(() => 5)() === 5 ? a : b;',
    '(() => 5)() === 5 ? a : b => a + b - yield / 1;',
    '() => a + b - yield / 1',
    '(() => { try { Function("0 || () => 2")(); } catch(e) { return true; } })();',
    'var f = (function() { return z => arguments[0]; }(5));',
    'yield => { }',
    'interface => { }',
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
    '({ async foo(a, c, b){} });',
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
    'var f = (function() { return z => arguments[0]; }(5));',
    'async(...{x}) => x',
    'async(...[x]) => x',
    '(...{x}) => x'
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

  for (const arg of [
    'yield => { "use strict"; 0 }',
    'yield => { "lorem"; "use strict"; }',
    "interface => { 'use strict' }"
  ]) {
    it(`${arg};`, () => {
      t.throws(() => {
        parseSource(`${arg};`, undefined, Context.None);
      });
    });
    it(`${arg};`, () => {
      t.throws(() => {
        parseSource(`${arg};`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg};`, () => {
      t.throws(() => {
        parseSource(`${arg};`, undefined, Context.OptionsNext);
      });
    });

    it(`function x(){${arg} }`, () => {
      t.throws(() => {
        parseSource(`function x(){${arg} }`, undefined, Context.None);
      });
    });
  }
  pass('Expressions - Arrow (pass)', [
    [
      'async let => {}',
      Context.OptionsLexical,
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
                  name: 'let'
                }
              ],
              async: true,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'let => {}',
      Context.OptionsLexical,
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
                  name: 'let'
                }
              ],
              async: false,
              expression: false
            }
          }
        ]
      }
    ],

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

                async: false,
                expression: false
              }
            }
          }
        ]
      }
    ],

    [
      '() => { let x }',
      Context.OptionsWebCompat,
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
                    type: 'VariableDeclaration',
                    kind: 'let',
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
                  }
                ]
              },
              params: [],
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'let => a + b',
      Context.OptionsWebCompat,
      {
        body: [
          {
            expression: {
              async: false,
              body: {
                left: {
                  name: 'a',
                  type: 'Identifier'
                },
                operator: '+',
                right: {
                  name: 'b',
                  type: 'Identifier'
                },
                type: 'BinaryExpression'
              },
              expression: true,
              params: [
                {
                  name: 'let',
                  type: 'Identifier'
                }
              ],
              type: 'ArrowFunctionExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'async let => {}, let => {}',
      Context.OptionsWebCompat,
      {
        body: [
          {
            expression: {
              expressions: [
                {
                  async: true,
                  body: {
                    body: [],
                    type: 'BlockStatement'
                  },
                  expression: false,
                  params: [
                    {
                      name: 'let',
                      type: 'Identifier'
                    }
                  ],
                  type: 'ArrowFunctionExpression'
                },
                {
                  async: false,
                  body: {
                    body: [],
                    type: 'BlockStatement'
                  },
                  expression: false,
                  params: [
                    {
                      name: 'let',
                      type: 'Identifier'
                    }
                  ],
                  type: 'ArrowFunctionExpression'
                }
              ],
              type: 'SequenceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'let => {}, let => {}',
      Context.OptionsWebCompat,
      {
        body: [
          {
            expression: {
              expressions: [
                {
                  async: false,
                  body: {
                    body: [],
                    type: 'BlockStatement'
                  },
                  expression: false,
                  params: [
                    {
                      name: 'let',
                      type: 'Identifier'
                    }
                  ],
                  type: 'ArrowFunctionExpression'
                },
                {
                  async: false,
                  body: {
                    body: [],
                    type: 'BlockStatement'
                  },
                  expression: false,
                  params: [
                    {
                      name: 'let',
                      type: 'Identifier'
                    }
                  ],
                  type: 'ArrowFunctionExpression'
                }
              ],
              type: 'SequenceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'let => {}',
      Context.OptionsWebCompat,
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
                  name: 'let'
                }
              ],
              async: false,
              expression: false
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
                                                                                                          type: 'Identifier',
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

              async: false,

              expression: true
            }
          }
        ]
      }
    ],

    [
      'a => a + x',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 10,
              range: [0, 10],
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
                type: 'BinaryExpression',
                start: 5,
                end: 10,
                range: [5, 10],
                left: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'a'
                },
                operator: '+',
                right: {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  range: [9, 10],
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
      'a => a / x',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 10,
              range: [0, 10],
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
                type: 'BinaryExpression',
                start: 5,
                end: 10,
                range: [5, 10],
                left: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'a'
                },
                operator: '/',
                right: {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  range: [9, 10],
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
      'a => x.foo',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 10,
              range: [0, 10],
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
                type: 'MemberExpression',
                start: 5,
                end: 10,
                range: [5, 10],
                object: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'x'
                },
                property: {
                  type: 'Identifier',
                  start: 7,
                  end: 10,
                  range: [7, 10],
                  name: 'foo'
                },
                computed: false
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(() => {}) << x',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              left: {
                type: 'ArrowFunctionExpression',
                start: 1,
                end: 9,
                range: [1, 9],
                expression: false,
                async: false,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 7,
                  end: 9,
                  range: [7, 9],
                  body: []
                }
              },
              operator: '<<',
              right: {
                type: 'Identifier',
                start: 14,
                end: 15,
                range: [14, 15],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a => x[foo]',
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
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 11,
              range: [0, 11],
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
                type: 'MemberExpression',
                start: 5,
                end: 11,
                range: [5, 11],
                object: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'x'
                },
                property: {
                  type: 'Identifier',
                  start: 7,
                  end: 10,
                  range: [7, 10],
                  name: 'foo'
                },
                computed: true
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a => x()',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        range: [0, 8],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 8,
            range: [0, 8],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 8,
              range: [0, 8],
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
                type: 'CallExpression',
                start: 5,
                end: 8,
                range: [5, 8],
                callee: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'x'
                },
                arguments: []
              }
            }
          }
        ],
        sourceType: 'script'
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
                id: null,
                generator: false,
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
              type: 'AssignmentExpression',
              start: 0,
              end: 22,
              range: [0, 22],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 2,
                range: [0, 2],
                name: 'fn'
              },
              right: {
                type: 'ArrowFunctionExpression',
                start: 5,
                end: 22,
                range: [5, 22],
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    range: [6, 7],
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'b'
                  },
                  {
                    type: 'RestElement',
                    start: 12,
                    end: 16,
                    range: [12, 16],
                    argument: {
                      type: 'Identifier',
                      start: 15,
                      end: 16,
                      range: [15, 16],
                      name: 'c'
                    }
                  }
                ],
                body: {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
                  range: [21, 22],
                  name: 'c'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(interface)',
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
              type: 'Identifier',
              start: 1,
              end: 10,
              range: [1, 10],
              name: 'interface'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({}) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 10,
              range: [0, 10],
              expression: false,
              async: false,
              params: [
                {
                  type: 'ObjectPattern',
                  start: 1,
                  end: 3,
                  range: [1, 3],
                  properties: []
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 8,
                end: 10,
                range: [8, 10],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(x = yield = x) => x',
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
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 20,
              range: [0, 20],
              expression: true,
              async: false,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 1,
                  end: 14,
                  range: [1, 14],
                  left: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'x'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 5,
                    end: 14,
                    range: [5, 14],
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 5,
                      end: 10,
                      range: [5, 10],
                      name: 'yield'
                    },
                    right: {
                      type: 'Identifier',
                      start: 13,
                      end: 14,
                      range: [13, 14],
                      name: 'x'
                    }
                  }
                }
              ],
              body: {
                type: 'Identifier',
                start: 19,
                end: 20,
                range: [19, 20],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '([x = yield]) => x',
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
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              expression: true,
              async: false,
              params: [
                {
                  type: 'ArrayPattern',
                  start: 1,
                  end: 12,
                  range: [1, 12],
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      start: 2,
                      end: 11,
                      range: [2, 11],
                      left: {
                        type: 'Identifier',
                        start: 2,
                        end: 3,
                        range: [2, 3],
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        start: 6,
                        end: 11,
                        range: [6, 11],
                        name: 'yield'
                      }
                    }
                  ]
                }
              ],
              body: {
                type: 'Identifier',
                start: 17,
                end: 18,
                range: [17, 18],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '([x, {y: [yield]}])',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'ArrayExpression',
              start: 1,
              end: 18,
              range: [1, 18],
              elements: [
                {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  range: [2, 3],
                  name: 'x'
                },
                {
                  type: 'ObjectExpression',
                  start: 5,
                  end: 17,
                  range: [5, 17],
                  properties: [
                    {
                      type: 'Property',
                      start: 6,
                      end: 16,
                      range: [6, 16],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'y'
                      },
                      value: {
                        type: 'ArrayExpression',
                        start: 9,
                        end: 16,
                        range: [9, 16],
                        elements: [
                          {
                            type: 'Identifier',
                            start: 10,
                            end: 15,
                            range: [10, 15],
                            name: 'yield'
                          }
                        ]
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
      '([], a) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 13,
        range: [0, 13],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              expression: false,
              async: false,
              params: [
                {
                  type: 'ArrayPattern',
                  start: 1,
                  end: 3,
                  range: [1, 3],
                  elements: []
                },
                {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'a'
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 11,
                end: 13,
                range: [11, 13],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 522,
        range: [0, 522],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 522,
            range: [0, 522],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 522,
              range: [0, 522],
              expression: false,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 7,
                  range: [1, 7],
                  name: 'expect'
                },
                {
                  type: 'Identifier',
                  start: 9,
                  end: 16,
                  range: [9, 16],
                  name: 'subject'
                },
                {
                  type: 'Identifier',
                  start: 18,
                  end: 26,
                  range: [18, 26],
                  name: 'typeName'
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 31,
                end: 522,
                range: [31, 522],
                body: [
                  {
                    type: 'ExpressionStatement',
                    start: 43,
                    end: 147,
                    range: [43, 147],
                    expression: {
                      type: 'AssignmentExpression',
                      start: 43,
                      end: 146,
                      range: [43, 146],
                      operator: '=',
                      left: {
                        type: 'Identifier',
                        start: 43,
                        end: 51,
                        range: [43, 51],
                        name: 'typeName'
                      },
                      right: {
                        type: 'ConditionalExpression',
                        start: 54,
                        end: 146,
                        range: [54, 146],
                        test: {
                          type: 'CallExpression',
                          start: 54,
                          end: 100,
                          range: [54, 100],
                          callee: {
                            type: 'MemberExpression',
                            start: 54,
                            end: 90,
                            range: [54, 90],
                            object: {
                              type: 'Literal',
                              start: 54,
                              end: 85,
                              range: [54, 85],
                              value: /^reg(?:exp?|ular expression)$/,
                              regex: {
                                pattern: '^reg(?:exp?|ular expression)$',
                                flags: ''
                              }
                            },
                            property: {
                              type: 'Identifier',
                              start: 86,
                              end: 90,
                              range: [86, 90],
                              name: 'test'
                            },
                            computed: false
                          },
                          arguments: [
                            {
                              type: 'Identifier',
                              start: 91,
                              end: 99,
                              range: [91, 99],
                              name: 'typeName'
                            }
                          ]
                        },
                        consequent: {
                          type: 'Literal',
                          start: 115,
                          end: 123,
                          range: [115, 123],
                          value: 'regexp'
                        },
                        alternate: {
                          type: 'Identifier',
                          start: 138,
                          end: 146,
                          range: [138, 146],
                          name: 'typeName'
                        }
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    start: 158,
                    end: 244,
                    range: [158, 244],
                    expression: {
                      type: 'AssignmentExpression',
                      start: 158,
                      end: 243,
                      range: [158, 243],
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        start: 158,
                        end: 178,
                        range: [158, 178],
                        object: {
                          type: 'MemberExpression',
                          start: 158,
                          end: 175,
                          range: [158, 175],
                          object: {
                            type: 'Identifier',
                            start: 158,
                            end: 164,
                            range: [158, 164],
                            name: 'expect'
                          },
                          property: {
                            type: 'Identifier',
                            start: 165,
                            end: 175,
                            range: [165, 175],
                            name: 'argsOutput'
                          },
                          computed: false
                        },
                        property: {
                          type: 'Literal',
                          start: 176,
                          end: 177,
                          range: [176, 177],
                          value: 0
                        },
                        computed: true
                      },
                      right: {
                        type: 'ArrowFunctionExpression',
                        start: 181,
                        end: 243,
                        range: [181, 243],
                        expression: false,
                        async: false,
                        params: [
                          {
                            type: 'Identifier',
                            start: 181,
                            end: 187,
                            range: [181, 187],
                            name: 'output'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          start: 191,
                          end: 243,
                          range: [191, 243],
                          body: [
                            {
                              type: 'ExpressionStatement',
                              start: 205,
                              end: 231,
                              range: [205, 231],
                              expression: {
                                type: 'CallExpression',
                                start: 205,
                                end: 230,
                                range: [205, 230],
                                callee: {
                                  type: 'MemberExpression',
                                  start: 205,
                                  end: 220,
                                  range: [205, 220],
                                  object: {
                                    type: 'Identifier',
                                    start: 205,
                                    end: 211,
                                    range: [205, 211],
                                    name: 'output'
                                  },
                                  property: {
                                    type: 'Identifier',
                                    start: 212,
                                    end: 220,
                                    range: [212, 220],
                                    name: 'jsString'
                                  },
                                  computed: false
                                },
                                arguments: [
                                  {
                                    type: 'Identifier',
                                    start: 221,
                                    end: 229,
                                    range: [221, 229],
                                    name: 'typeName'
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    }
                  },
                  {
                    type: 'IfStatement',
                    start: 255,
                    end: 512,
                    range: [255, 512],
                    test: {
                      type: 'UnaryExpression',
                      start: 259,
                      end: 284,
                      range: [259, 284],
                      operator: '!',
                      prefix: true,
                      argument: {
                        type: 'CallExpression',
                        start: 260,
                        end: 284,
                        range: [260, 284],
                        callee: {
                          type: 'MemberExpression',
                          start: 260,
                          end: 274,
                          range: [260, 274],
                          object: {
                            type: 'Identifier',
                            start: 260,
                            end: 266,
                            range: [260, 266],
                            name: 'expect'
                          },
                          property: {
                            type: 'Identifier',
                            start: 267,
                            end: 274,
                            range: [267, 274],
                            name: 'getType'
                          },
                          computed: false
                        },
                        arguments: [
                          {
                            type: 'Identifier',
                            start: 275,
                            end: 283,
                            range: [275, 283],
                            name: 'typeName'
                          }
                        ]
                      }
                    },
                    consequent: {
                      type: 'BlockStatement',
                      start: 286,
                      end: 512,
                      range: [286, 512],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 300,
                          end: 328,
                          range: [300, 328],
                          expression: {
                            type: 'AssignmentExpression',
                            start: 300,
                            end: 327,
                            range: [300, 327],
                            operator: '=',
                            left: {
                              type: 'MemberExpression',
                              start: 300,
                              end: 316,
                              range: [300, 316],
                              object: {
                                type: 'Identifier',
                                start: 300,
                                end: 306,
                                range: [300, 306],
                                name: 'expect'
                              },
                              property: {
                                type: 'Identifier',
                                start: 307,
                                end: 316,
                                range: [307, 316],
                                name: 'errorMode'
                              },
                              computed: false
                            },
                            right: {
                              type: 'Literal',
                              start: 319,
                              end: 327,
                              range: [319, 327],
                              value: 'nested'
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          start: 341,
                          end: 500,
                          range: [341, 500],
                          expression: {
                            type: 'CallExpression',
                            start: 341,
                            end: 499,
                            range: [341, 499],
                            callee: {
                              type: 'MemberExpression',
                              start: 341,
                              end: 352,
                              range: [341, 352],
                              object: {
                                type: 'Identifier',
                                start: 341,
                                end: 347,
                                range: [341, 347],
                                name: 'expect'
                              },
                              property: {
                                type: 'Identifier',
                                start: 348,
                                end: 352,
                                range: [348, 352],
                                name: 'fail'
                              },
                              computed: false
                            },
                            arguments: [
                              {
                                type: 'ArrowFunctionExpression',
                                start: 353,
                                end: 498,
                                range: [353, 498],
                                expression: false,
                                async: false,
                                params: [
                                  {
                                    type: 'Identifier',
                                    start: 353,
                                    end: 359,
                                    range: [353, 359],
                                    name: 'output'
                                  }
                                ],
                                body: {
                                  type: 'BlockStatement',
                                  start: 363,
                                  end: 498,
                                  range: [363, 498],
                                  body: [
                                    {
                                      type: 'ExpressionStatement',
                                      start: 379,
                                      end: 484,
                                      range: [379, 484],
                                      expression: {
                                        type: 'CallExpression',
                                        start: 379,
                                        end: 483,
                                        range: [379, 483],
                                        callee: {
                                          type: 'MemberExpression',
                                          start: 379,
                                          end: 473,
                                          range: [379, 473],
                                          object: {
                                            type: 'CallExpression',
                                            start: 379,
                                            end: 447,
                                            range: [379, 447],
                                            callee: {
                                              type: 'MemberExpression',
                                              start: 379,
                                              end: 445,
                                              range: [379, 445],
                                              object: {
                                                type: 'CallExpression',
                                                start: 379,
                                                end: 425,
                                                range: [379, 425],
                                                callee: {
                                                  type: 'MemberExpression',
                                                  start: 379,
                                                  end: 408,
                                                  range: [379, 408],
                                                  object: {
                                                    type: 'Identifier',
                                                    start: 379,
                                                    end: 385,
                                                    range: [379, 385],
                                                    name: 'output'
                                                  },
                                                  property: {
                                                    type: 'Identifier',
                                                    start: 403,
                                                    end: 408,
                                                    range: [403, 408],
                                                    name: 'error'
                                                  },
                                                  computed: false
                                                },
                                                arguments: [
                                                  {
                                                    type: 'Literal',
                                                    start: 409,
                                                    end: 424,
                                                    range: [409, 424],
                                                    value: 'Unknown type:'
                                                  }
                                                ]
                                              },
                                              property: {
                                                type: 'Identifier',
                                                start: 443,
                                                end: 445,
                                                range: [443, 445],
                                                name: 'sp'
                                              },
                                              computed: false
                                            },
                                            arguments: []
                                          },
                                          property: {
                                            type: 'Identifier',
                                            start: 465,
                                            end: 473,
                                            range: [465, 473],
                                            name: 'jsString'
                                          },
                                          computed: false
                                        },
                                        arguments: [
                                          {
                                            type: 'Identifier',
                                            start: 474,
                                            end: 482,
                                            range: [474, 482],
                                            name: 'typeName'
                                          }
                                        ]
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
                    alternate: null
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a, b = c) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              expression: false,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'a'
                },
                {
                  type: 'AssignmentPattern',
                  start: 4,
                  end: 9,
                  range: [4, 9],
                  left: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    range: [4, 5],
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    range: [8, 9],
                    name: 'c'
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 14,
                end: 16,
                range: [14, 16],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(x, y = 9, z = 8) => {}',
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
              start: 0,
              end: 23,
              range: [0, 23],
              expression: false,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'x'
                },
                {
                  type: 'AssignmentPattern',
                  start: 4,
                  end: 9,
                  range: [4, 9],
                  left: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    range: [4, 5],
                    name: 'y'
                  },
                  right: {
                    type: 'Literal',
                    start: 8,
                    end: 9,
                    range: [8, 9],
                    value: 9
                  }
                },
                {
                  type: 'AssignmentPattern',
                  start: 11,
                  end: 16,
                  range: [11, 16],
                  left: {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    range: [11, 12],
                    name: 'z'
                  },
                  right: {
                    type: 'Literal',
                    start: 15,
                    end: 16,
                    range: [15, 16],
                    value: 8
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 21,
                end: 23,
                range: [21, 23],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({a} = {}) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              expression: false,
              async: false,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 1,
                  end: 9,
                  range: [1, 9],
                  left: {
                    type: 'ObjectPattern',
                    start: 1,
                    end: 4,
                    range: [1, 4],
                    properties: [
                      {
                        type: 'Property',
                        start: 2,
                        end: 3,
                        range: [2, 3],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'a'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ObjectExpression',
                    start: 7,
                    end: 9,
                    range: [7, 9],
                    properties: []
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 14,
                end: 16,
                range: [14, 16],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let x = ({y=z}=e) => d',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 22,
            range: [0, 22],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 22,
                range: [4, 22],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'x'
                },
                init: {
                  type: 'ArrowFunctionExpression',
                  start: 8,
                  end: 22,
                  range: [8, 22],
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'AssignmentPattern',
                      start: 9,
                      end: 16,
                      range: [9, 16],
                      left: {
                        type: 'ObjectPattern',
                        start: 9,
                        end: 14,
                        range: [9, 14],
                        properties: [
                          {
                            type: 'Property',
                            start: 10,
                            end: 13,
                            range: [10, 13],
                            method: false,
                            shorthand: true,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 10,
                              end: 11,
                              range: [10, 11],
                              name: 'y'
                            },
                            kind: 'init',
                            value: {
                              type: 'AssignmentPattern',
                              start: 10,
                              end: 13,
                              range: [10, 13],
                              left: {
                                type: 'Identifier',
                                start: 10,
                                end: 11,
                                range: [10, 11],
                                name: 'y'
                              },
                              right: {
                                type: 'Identifier',
                                start: 12,
                                end: 13,
                                range: [12, 13],
                                name: 'z'
                              }
                            }
                          }
                        ]
                      },
                      right: {
                        type: 'Identifier',
                        start: 15,
                        end: 16,
                        range: [15, 16],
                        name: 'e'
                      }
                    }
                  ],
                  body: {
                    type: 'Identifier',
                    start: 21,
                    end: 22,
                    range: [21, 22],
                    name: 'd'
                  }
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '([x] = []) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              expression: false,
              async: false,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 1,
                  end: 9,
                  range: [1, 9],
                  left: {
                    type: 'ArrayPattern',
                    start: 1,
                    end: 4,
                    range: [1, 4],
                    elements: [
                      {
                        type: 'Identifier',
                        start: 2,
                        end: 3,
                        range: [2, 3],
                        name: 'x'
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    start: 7,
                    end: 9,
                    range: [7, 9],
                    elements: []
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 14,
                end: 16,
                range: [14, 16],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
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

              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      'e => { label: 42 }',
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
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              expression: false,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  name: 'e'
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 5,
                end: 18,
                range: [5, 18],
                body: [
                  {
                    type: 'LabeledStatement',
                    start: 7,
                    end: 16,
                    range: [7, 16],
                    body: {
                      type: 'ExpressionStatement',
                      start: 14,
                      end: 16,
                      range: [14, 16],
                      expression: {
                        type: 'Literal',
                        start: 14,
                        end: 16,
                        range: [14, 16],
                        value: 42
                      }
                    },
                    label: {
                      type: 'Identifier',
                      start: 7,
                      end: 12,
                      range: [7, 12],
                      name: 'label'
                    }
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
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

              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(x=1) => x * x',
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
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              expression: true,
              async: false,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  left: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'x'
                  },
                  right: {
                    type: 'Literal',
                    start: 3,
                    end: 4,
                    range: [3, 4],
                    value: 1
                  }
                }
              ],
              body: {
                type: 'BinaryExpression',
                start: 9,
                end: 14,
                range: [9, 14],
                left: {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  range: [9, 10],
                  name: 'x'
                },
                operator: '*',
                right: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  range: [13, 14],
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

                async: false,

                expression: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],

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

              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '() => { let {} = y }',
      Context.None,
      {
        body: [
          {
            expression: {
              async: false,
              body: {
                body: [
                  {
                    declarations: [
                      {
                        id: {
                          properties: [],
                          type: 'ObjectPattern'
                        },
                        init: {
                          name: 'y',
                          type: 'Identifier'
                        },
                        type: 'VariableDeclarator'
                      }
                    ],
                    kind: 'let',
                    type: 'VariableDeclaration'
                  }
                ],
                type: 'BlockStatement'
              },
              expression: false,
              params: [],
              type: 'ArrowFunctionExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
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

              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '({a} = b,) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              expression: false,
              async: false,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 1,
                  end: 8,
                  range: [1, 8],
                  left: {
                    type: 'ObjectPattern',
                    start: 1,
                    end: 4,
                    range: [1, 4],
                    properties: [
                      {
                        type: 'Property',
                        start: 2,
                        end: 3,
                        range: [2, 3],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'a'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    range: [7, 8],
                    name: 'b'
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 14,
                end: 16,
                range: [14, 16],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a, b, (c, d) => 0)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'SequenceExpression',
              start: 1,
              end: 18,
              range: [1, 18],
              expressions: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'b'
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 7,
                  end: 18,
                  range: [7, 18],
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      name: 'c'
                    },
                    {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
                      name: 'd'
                    }
                  ],
                  body: {
                    type: 'Literal',
                    start: 17,
                    end: 18,
                    range: [17, 18],
                    value: 0
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
      '(a, b) => 0, (c, d) => 1',
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
              type: 'SequenceExpression',
              start: 0,
              end: 24,
              range: [0, 24],
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  start: 0,
                  end: 11,
                  range: [0, 11],
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 1,
                      end: 2,
                      range: [1, 2],
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      start: 4,
                      end: 5,
                      range: [4, 5],
                      name: 'b'
                    }
                  ],
                  body: {
                    type: 'Literal',
                    start: 10,
                    end: 11,
                    range: [10, 11],
                    value: 0
                  }
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 13,
                  end: 24,
                  range: [13, 24],
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      name: 'c'
                    },
                    {
                      type: 'Identifier',
                      start: 17,
                      end: 18,
                      range: [17, 18],
                      name: 'd'
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
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a, b => {}, a => a + 1)',
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
              type: 'SequenceExpression',
              start: 1,
              end: 23,
              range: [1, 23],
              expressions: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'a'
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 4,
                  end: 11,
                  range: [4, 11],
                  expression: false,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 4,
                      end: 5,
                      range: [4, 5],
                      name: 'b'
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    start: 9,
                    end: 11,
                    range: [9, 11],
                    body: []
                  }
                },
                {
                  type: 'ArrowFunctionExpression',
                  start: 13,
                  end: 23,
                  range: [13, 23],
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 13,
                      end: 14,
                      range: [13, 14],
                      name: 'a'
                    }
                  ],
                  body: {
                    type: 'BinaryExpression',
                    start: 18,
                    end: 23,
                    range: [18, 23],
                    left: {
                      type: 'Identifier',
                      start: 18,
                      end: 19,
                      range: [18, 19],
                      name: 'a'
                    },
                    operator: '+',
                    right: {
                      type: 'Literal',
                      start: 22,
                      end: 23,
                      range: [22, 23],
                      value: 1
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
      '() => a + b - yield / 1',
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
              start: 0,
              end: 23,
              range: [0, 23],
              expression: true,
              async: false,
              params: [],
              body: {
                type: 'BinaryExpression',
                start: 6,
                end: 23,
                range: [6, 23],
                left: {
                  type: 'BinaryExpression',
                  start: 6,
                  end: 11,
                  range: [6, 11],
                  left: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    range: [6, 7],
                    name: 'a'
                  },
                  operator: '+',
                  right: {
                    type: 'Identifier',
                    start: 10,
                    end: 11,
                    range: [10, 11],
                    name: 'b'
                  }
                },
                operator: '-',
                right: {
                  type: 'BinaryExpression',
                  start: 14,
                  end: 23,
                  range: [14, 23],
                  left: {
                    type: 'Identifier',
                    start: 14,
                    end: 19,
                    range: [14, 19],
                    name: 'yield'
                  },
                  operator: '/',
                  right: {
                    type: 'Literal',
                    start: 22,
                    end: 23,
                    range: [22, 23],
                    value: 1
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
      '({x = 10, y: { z = 10 }}) => [x, z]',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 35,
        range: [0, 35],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 35,
            range: [0, 35],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 35,
              range: [0, 35],
              expression: true,
              async: false,
              params: [
                {
                  type: 'ObjectPattern',
                  start: 1,
                  end: 24,
                  range: [1, 24],
                  properties: [
                    {
                      type: 'Property',
                      start: 2,
                      end: 8,
                      range: [2, 8],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 2,
                        end: 3,
                        range: [2, 3],
                        name: 'x'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 2,
                        end: 8,
                        range: [2, 8],
                        left: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'x'
                        },
                        right: {
                          type: 'Literal',
                          start: 6,
                          end: 8,
                          range: [6, 8],
                          value: 10,
                          raw: '10'
                        }
                      }
                    },
                    {
                      type: 'Property',
                      start: 10,
                      end: 23,
                      range: [10, 23],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 10,
                        end: 11,
                        range: [10, 11],
                        name: 'y'
                      },
                      value: {
                        type: 'ObjectPattern',
                        start: 13,
                        end: 23,
                        range: [13, 23],
                        properties: [
                          {
                            type: 'Property',
                            start: 15,
                            end: 21,
                            range: [15, 21],
                            method: false,
                            shorthand: true,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 15,
                              end: 16,
                              range: [15, 16],
                              name: 'z'
                            },
                            kind: 'init',
                            value: {
                              type: 'AssignmentPattern',
                              start: 15,
                              end: 21,
                              range: [15, 21],
                              left: {
                                type: 'Identifier',
                                start: 15,
                                end: 16,
                                range: [15, 16],
                                name: 'z'
                              },
                              right: {
                                type: 'Literal',
                                start: 19,
                                end: 21,
                                range: [19, 21],
                                value: 10,
                                raw: '10'
                              }
                            }
                          }
                        ]
                      },
                      kind: 'init'
                    }
                  ]
                }
              ],
              body: {
                type: 'ArrayExpression',
                start: 29,
                end: 35,
                range: [29, 35],
                elements: [
                  {
                    type: 'Identifier',
                    start: 30,
                    end: 31,
                    range: [30, 31],
                    name: 'x'
                  },
                  {
                    type: 'Identifier',
                    start: 33,
                    end: 34,
                    range: [33, 34],
                    name: 'z'
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({x = 10}) => x',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              expression: true,
              async: false,
              params: [
                {
                  type: 'ObjectPattern',
                  start: 1,
                  end: 9,
                  range: [1, 9],
                  properties: [
                    {
                      type: 'Property',
                      start: 2,
                      end: 8,
                      range: [2, 8],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 2,
                        end: 3,
                        range: [2, 3],
                        name: 'x'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 2,
                        end: 8,
                        range: [2, 8],
                        left: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'x'
                        },
                        right: {
                          type: 'Literal',
                          start: 6,
                          end: 8,
                          range: [6, 8],
                          value: 10
                        }
                      }
                    }
                  ]
                }
              ],
              body: {
                type: 'Identifier',
                start: 14,
                end: 15,
                range: [14, 15],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a, {}) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 13,
        range: [0, 13],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              expression: false,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'a'
                },
                {
                  type: 'ObjectPattern',
                  start: 4,
                  end: 6,
                  range: [4, 6],
                  properties: []
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 11,
                end: 13,
                range: [11, 13],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
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

              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(a = b, c) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              expression: false,
              async: false,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 1,
                  end: 6,
                  range: [1, 6],
                  left: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'b'
                  }
                },
                {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'c'
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 14,
                end: 16,
                range: [14, 16],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
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

              async: false,

              expression: false
            }
          }
        ]
      }
    ],
    [
      '(a) => 00;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 9,
              range: [0, 9],
              expression: true,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'a'
                }
              ],
              body: {
                type: 'Literal',
                start: 7,
                end: 9,
                range: [7, 9],
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
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

              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(x, y) => z => z * (x + y)',
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
              start: 0,
              end: 26,
              range: [0, 26],
              expression: true,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'y'
                }
              ],
              body: {
                type: 'ArrowFunctionExpression',
                start: 10,
                end: 26,
                range: [10, 26],
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 10,
                    end: 11,
                    range: [10, 11],
                    name: 'z'
                  }
                ],
                body: {
                  type: 'BinaryExpression',
                  start: 15,
                  end: 26,
                  range: [15, 26],
                  left: {
                    type: 'Identifier',
                    start: 15,
                    end: 16,
                    range: [15, 16],
                    name: 'z'
                  },
                  operator: '*',
                  right: {
                    type: 'BinaryExpression',
                    start: 20,
                    end: 25,
                    range: [20, 25],
                    left: {
                      type: 'Identifier',
                      start: 20,
                      end: 21,
                      range: [20, 21],
                      name: 'x'
                    },
                    operator: '+',
                    right: {
                      type: 'Identifier',
                      start: 24,
                      end: 25,
                      range: [24, 25],
                      name: 'y'
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

                async: false,

                expression: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],

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

                      async: false,

                      expression: true
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],

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

                        async: false,

                        expression: false
                      },
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],

                      async: false,

                      expression: true
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],

                    async: false,

                    expression: true
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  ],

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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 22,
            range: [0, 22],
            expression: {
              type: 'ConditionalExpression',
              start: 0,
              end: 21,
              range: [0, 21],
              test: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'foo'
              },
              consequent: {
                type: 'Identifier',
                start: 6,
                end: 9,
                range: [6, 9],
                name: 'bar'
              },
              alternate: {
                type: 'ArrowFunctionExpression',
                start: 12,
                end: 21,
                range: [12, 21],
                expression: false,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 12,
                    end: 15,
                    range: [12, 15],
                    name: 'baz'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  start: 19,
                  end: 21,
                  range: [19, 21],
                  body: []
                }
              }
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 297,
        range: [0, 297],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 9,
            range: [0, 9],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 8,
              range: [0, 8],
              expression: true,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'a'
                }
              ],
              body: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'b'
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 25,
            end: 37,
            range: [25, 37],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 25,
              end: 36,
              range: [25, 36],
              expression: true,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 26,
                  end: 27,
                  range: [26, 27],
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 29,
                  end: 30,
                  range: [29, 30],
                  name: 'b'
                }
              ],
              body: {
                type: 'Identifier',
                start: 35,
                end: 36,
                range: [35, 36],
                name: 'c'
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 53,
            end: 61,
            range: [53, 61],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 53,
              end: 60,
              range: [53, 60],
              expression: true,
              async: false,
              params: [],
              body: {
                type: 'Identifier',
                start: 59,
                end: 60,
                range: [59, 60],
                name: 'b'
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 77,
            end: 93,
            range: [77, 93],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 77,
              end: 92,
              range: [77, 92],
              expression: true,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 78,
                  end: 79,
                  range: [78, 79],
                  name: 'a'
                }
              ],
              body: {
                type: 'ArrowFunctionExpression',
                start: 84,
                end: 92,
                range: [84, 92],
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 85,
                    end: 86,
                    range: [85, 86],
                    name: 'b'
                  }
                ],
                body: {
                  type: 'Identifier',
                  start: 91,
                  end: 92,
                  range: [91, 92],
                  name: 'c'
                }
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 133,
            end: 151,
            range: [133, 151],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 133,
              end: 150,
              range: [133, 150],
              expression: true,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 134,
                  end: 135,
                  range: [134, 135],
                  name: 'a'
                }
              ],
              body: {
                type: 'ArrowFunctionExpression',
                start: 141,
                end: 149,
                range: [141, 149],
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 142,
                    end: 143,
                    range: [142, 143],
                    name: 'b'
                  }
                ],
                body: {
                  type: 'Identifier',
                  start: 148,
                  end: 149,
                  range: [148, 149],
                  name: 'c'
                }
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 188,
            end: 205,
            range: [188, 205],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 188,
              end: 204,
              range: [188, 204],
              expression: true,
              async: false,
              params: [],
              body: {
                type: 'ArrowFunctionExpression',
                start: 194,
                end: 204,
                range: [194, 204],
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 195,
                    end: 196,
                    range: [195, 196],
                    name: 'b'
                  },
                  {
                    type: 'Identifier',
                    start: 197,
                    end: 198,
                    range: [197, 198],
                    name: 'c'
                  }
                ],
                body: {
                  type: 'Identifier',
                  start: 203,
                  end: 204,
                  range: [203, 204],
                  name: 'd'
                }
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 245,
            end: 259,
            range: [245, 259],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 245,
              end: 259,
              range: [245, 259],
              expression: false,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 245,
                  end: 246,
                  range: [245, 246],
                  name: 'a'
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 248,
                end: 259,
                range: [248, 259],
                body: [
                  {
                    type: 'ReturnStatement',
                    start: 249,
                    end: 258,
                    range: [249, 258],
                    argument: {
                      type: 'Identifier',
                      start: 256,
                      end: 257,
                      range: [256, 257],
                      name: 'b'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 264,
            end: 273,
            range: [264, 273],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 264,
              end: 272,
              range: [264, 272],
              expression: true,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 264,
                  end: 265,
                  range: [264, 265],
                  name: 'a'
                }
              ],
              body: {
                type: 'Literal',
                start: 269,
                end: 272,
                range: [269, 272],
                value: 'e'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'const a = () => {return (3, 4);};',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 33,
        range: [0, 33],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 33,
            range: [0, 33],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 32,
                range: [6, 32],
                id: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'a'
                },
                init: {
                  type: 'ArrowFunctionExpression',
                  start: 10,
                  end: 32,
                  range: [10, 32],
                  expression: false,
                  async: false,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 16,
                    end: 32,
                    range: [16, 32],
                    body: [
                      {
                        type: 'ReturnStatement',
                        start: 17,
                        end: 31,
                        range: [17, 31],
                        argument: {
                          type: 'SequenceExpression',
                          start: 25,
                          end: 29,
                          range: [25, 29],
                          expressions: [
                            {
                              type: 'Literal',
                              start: 25,
                              end: 26,
                              range: [25, 26],
                              value: 3
                            },
                            {
                              type: 'Literal',
                              start: 28,
                              end: 29,
                              range: [28, 29],
                              value: 4
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            ],
            kind: 'const'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `(() => {}) || true;
    (() => {}) ? a : b;`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 43,
        range: [0, 43],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'LogicalExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              left: {
                type: 'ArrowFunctionExpression',
                start: 1,
                end: 9,
                range: [1, 9],
                expression: false,
                async: false,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 7,
                  end: 9,
                  range: [7, 9],
                  body: []
                }
              },
              operator: '||',
              right: {
                type: 'Literal',
                start: 14,
                end: 18,
                range: [14, 18],
                value: true
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 24,
            end: 43,
            range: [24, 43],
            expression: {
              type: 'ConditionalExpression',
              start: 24,
              end: 42,
              range: [24, 42],
              test: {
                type: 'ArrowFunctionExpression',
                start: 25,
                end: 33,
                range: [25, 33],
                expression: false,
                async: false,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 31,
                  end: 33,
                  range: [31, 33],
                  body: []
                }
              },
              consequent: {
                type: 'Identifier',
                start: 37,
                end: 38,
                range: [37, 38],
                name: 'a'
              },
              alternate: {
                type: 'Identifier',
                start: 41,
                end: 42,
                range: [41, 42],
                name: 'b'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(() => {}) + 2',
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
              type: 'BinaryExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              left: {
                type: 'ArrowFunctionExpression',
                start: 1,
                end: 9,
                range: [1, 9],
                expression: false,
                async: false,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 7,
                  end: 9,
                  range: [7, 9],
                  body: []
                }
              },
              operator: '+',
              right: {
                type: 'Literal',
                start: 13,
                end: 14,
                range: [13, 14],
                value: 2
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'bar ? ( (x, y) => (u, v) => x*u + y*v ) : baz;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 46,
        range: [0, 46],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 46,
            range: [0, 46],
            expression: {
              type: 'ConditionalExpression',
              start: 0,
              end: 45,
              range: [0, 45],
              test: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'bar'
              },
              consequent: {
                type: 'ArrowFunctionExpression',
                start: 8,
                end: 37,
                range: [8, 37],
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'x'
                  },
                  {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    range: [12, 13],
                    name: 'y'
                  }
                ],
                body: {
                  type: 'ArrowFunctionExpression',
                  start: 18,
                  end: 37,
                  range: [18, 37],
                  expression: true,
                  async: false,
                  params: [
                    {
                      type: 'Identifier',
                      start: 19,
                      end: 20,
                      range: [19, 20],
                      name: 'u'
                    },
                    {
                      type: 'Identifier',
                      start: 22,
                      end: 23,
                      range: [22, 23],
                      name: 'v'
                    }
                  ],
                  body: {
                    type: 'BinaryExpression',
                    start: 28,
                    end: 37,
                    range: [28, 37],
                    left: {
                      type: 'BinaryExpression',
                      start: 28,
                      end: 31,
                      range: [28, 31],
                      left: {
                        type: 'Identifier',
                        start: 28,
                        end: 29,
                        range: [28, 29],
                        name: 'x'
                      },
                      operator: '*',
                      right: {
                        type: 'Identifier',
                        start: 30,
                        end: 31,
                        range: [30, 31],
                        name: 'u'
                      }
                    },
                    operator: '+',
                    right: {
                      type: 'BinaryExpression',
                      start: 34,
                      end: 37,
                      range: [34, 37],
                      left: {
                        type: 'Identifier',
                        start: 34,
                        end: 35,
                        range: [34, 35],
                        name: 'y'
                      },
                      operator: '*',
                      right: {
                        type: 'Identifier',
                        start: 36,
                        end: 37,
                        range: [36, 37],
                        name: 'v'
                      }
                    }
                  }
                }
              },
              alternate: {
                type: 'Identifier',
                start: 42,
                end: 45,
                range: [42, 45],
                name: 'baz'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
