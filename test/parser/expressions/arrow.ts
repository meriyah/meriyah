import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Expressions - Arrow', () => {
  for (const arg of [
    '(a\n=> a)(1)',
    '(a/*\n*/=> a)(1)',
    '((a)\n=> a)(1)',
    '((a)/*\n*/=> a)(1)',
    '((a, b)\n=> a + b)(1, 2)',
    '((a, b)/*\n*/=> a + b)(1, 2)',
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
    '(arguments, interface) => {}',
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
    '[x]=f(yield)',
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
    '({ ...[x] }) => {}',
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
    '((a, b) => { return a + b; })(1, 5), 6',
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
    '`${c}template-tail`',
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
    [String.raw`\u0061sync () => {}`, Context.None],
    ['(async (...a,) => {}', Context.None],
    [String.raw`x = (y = "foo\003bar") => { "use strict"; }`, Context.None],
    [String.raw`x = (y = "foo\003bar") => { }`, Context.Strict],
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
    [String.raw`(p\u0061ckage) => { }`, Context.Strict],
    [String.raw`(p\u0061ckage, a) => { }`, Context.Strict],
    [String.raw`(a, p\u0061ckage) => { }`, Context.Strict],
    [String.raw`(p\u0061ckage) => { "use strict"; }`, Context.None],
    [String.raw`(p\u0061ckage, a) => { "use strict"; }`, Context.None],
    [String.raw`(a, p\u0061ckage) => { "use strict"; }`, Context.None],
    [String.raw`(p\x61ckage) => { }`, Context.None],
    [String.raw`(p\x61ckage) => { "use strict"; }`, Context.None],
    [String.raw`(p\141ckage) => { "use strict"; }`, Context.None],
    ['package => { "use strict"; }', Context.None],
    [String.raw`p\u0061ckage => { }`, Context.Strict],
    [String.raw`p\u0061ckage => { "use strict"; }`, Context.None],
    [String.raw`p\141ckage => { }`, Context.None],
    [String.raw`p\141ckage => { "use strict"; }`, Context.None],
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
      Context.None,
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
    ['({333: y.z} = a) => b', Context.None],
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
    '(...{x}) => x',
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
    "interface => { 'use strict' }",
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
    ['async let => {}', Context.OptionsLexical],
    ['let => {}', Context.OptionsLexical],

    ['f = ([[,] = g()]) => {}', Context.None],

    ['() => { let x }', Context.OptionsWebCompat],
    ['let => a + b', Context.OptionsWebCompat],
    ['async let => {}, let => {}', Context.OptionsWebCompat],
    ['let => {}, let => {}', Context.OptionsWebCompat],
    ['let => {}', Context.OptionsWebCompat],
    ['f = ([[,] = g()]) => {}', Context.OptionsWebCompat],
    ['([[[[[[[[[[[[[[[[[[[[{a=b}]]]]]]]]]]]]]]]]]]]])=>0;', Context.None],

    ['a => a + x', Context.OptionsRanges],
    ['a => a / x', Context.OptionsRanges],
    ['a => x.foo', Context.OptionsRanges],
    ['(() => {}) << x', Context.OptionsRanges],
    ['a => x[foo]', Context.OptionsRanges],
    ['a => x()', Context.OptionsRanges],
    ['() => {}\n+function(){}', Context.None],
    ['fn = (a, b, ...c) => c;', Context.OptionsRanges],
    ['(interface)', Context.OptionsRanges],
    ['({}) => {}', Context.OptionsRanges],
    ['(x = yield = x) => x', Context.OptionsRanges],
    ['([x = yield]) => x', Context.OptionsRanges],
    ['([x, {y: [yield]}])', Context.OptionsRanges],
    ['([], a) => {}', Context.OptionsRanges],
    ['(a = b) => {}', Context.None],
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
    ],
    ['(a, b = c) => {}', Context.OptionsRanges],
    ['(x, y = 9, z = 8) => {}', Context.OptionsRanges],
    ['({a} = {}) => {}', Context.OptionsRanges],
    ['let x = ({y=z}=e) => d', Context.OptionsRanges],
    ['([x] = []) => {}', Context.OptionsRanges],
    ['(...a) => 0', Context.None],
    ['e => "test"', Context.None],
    ['e => { label: 42 }', Context.OptionsRanges],
    ['(a, b) => { 42; }', Context.None],
    ['(x=1) => x * x', Context.OptionsRanges],
    ['arguments => 42', Context.None],
    ['(eval = 10) => 42', Context.None],
    ['(x) => ((y, z) => (x, y, z))', Context.None],
    ['foo(() => {})', Context.None],
    ['foo((x, y) => {})', Context.None],
    ['x => { function x() {} }', Context.None],
    ['(a, ...b) => {}', Context.None],
    ['(...a) => {}', Context.None],
    ['(a = 1) => {}', Context.None],
    [`async (eval) => "use strict";`, Context.None],
    ['(x) => { function x() {} }', Context.None],
    ['([x, y] = z) => x;', Context.None],
    ['([...x]) => x', Context.None],
    ['([x, ...y]) => x', Context.None],
    ['([[x, y] = z]) => x;', Context.None],
    ['() => { let {} = y }', Context.None],
    ['(x, y)=>x;', Context.None],
    ['(a = 1, b = 2) => x;', Context.None],
    ['a = (b) => c;', Context.None],
    ['({x});', Context.None],
    ['({ident: {x: y}}) => x', Context.None],
    ['({ident: {x}}) => x', Context.None],
    ['({a} = b,) => {}', Context.OptionsRanges],
    ['(a, b, (c, d) => 0)', Context.OptionsRanges],
    ['(a, b) => 0, (c, d) => 1', Context.OptionsRanges],
    ['(a, b => {}, a => a + 1)', Context.OptionsRanges],
    ['() => a + b - yield / 1', Context.OptionsRanges],
    ['({x = 10, y: { z = 10 }}) => [x, z]', Context.OptionsRanges | Context.OptionsRaw],
    ['({x = 10}) => x', Context.OptionsRanges],
    ['(a, {}) => {}', Context.OptionsRanges],
    ['({}, a) => {}', Context.None],
    ['(eval = 10) => 42;', Context.None],
    ['(a = b, c) => {}', Context.OptionsRanges],
    ['(x = 9) => {}', Context.None],
    ['(a) => 00;', Context.OptionsRanges],
    ['(x, y) => x + y', Context.None],
    ['(x, y) => z => z * (x + y)', Context.OptionsRanges],
    ['({a} = {}) => {}', Context.None],
    ['() => bar', Context.None],
    ['(( [x]=f(yield) )=>{});', Context.None],
    ['(( {x=f(yield)} )=>{});', Context.None],
    ['for ( f => ( "key" in {}) ; 0;);', Context.None],
    ['(x, y) => z => z * (x + y);', Context.None],
    ['x => (y, z) => z * (x + y)', Context.None],
    ['a, b => 0;', Context.None],
    ['a, b, (c, d) => 0;', Context.None],
    ['var x = ({x = 30}, [y], z) => x', Context.None],
    ['var x = ([x = 25]) => x => x => ({x} = {})', Context.None],
    ['var x = foo => x => x => x => {x}', Context.None],
    ['(a, b) => 0, (c, d) => 1;', Context.None],
    ['(a, b => {}, a => a + 1);', Context.None],
    ['((a, b) => {}, (a => a + 1));', Context.None],
    ['(a, (a, (b, c) => 0));', Context.None],
    ['foo ? bar : baz => {};', Context.OptionsRanges],
    ['(a, {}) => {};', Context.None],
    ['({}, a) => {};', Context.None],
    ['({a}) => {};', Context.None],
    ['(x = 9) => {};', Context.None],
    ['(x, y = 9) => {};', Context.None],
    ['(x = 9, y) => {};', Context.None],
    ['(x, y = 9, z = 8) => {};', Context.None],
    ['({a} = {}) => {};', Context.None],
    ['([x] = []) => {};', Context.None],
    ['([x = 0]) => {};', Context.None],
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
    ],
    ['const a = () => {return (3, 4);};', Context.OptionsRanges],
    [
      `(() => {}) || true;
    (() => {}) ? a : b;`,
      Context.OptionsRanges,
    ],
    ['(() => {}) + 2', Context.OptionsRanges],
    ['bar ? ( (x, y) => (u, v) => x*u + y*v ) : baz;', Context.OptionsRanges],
  ]);
});
