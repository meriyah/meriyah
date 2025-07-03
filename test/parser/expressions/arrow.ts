import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

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
        parseSource(`${arg}`);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`async ${arg}`, () => {
      t.throws(() => {
        parseSource(`async ${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`);
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
        parseSource(`${arg};`);
      });
    });

    it(`async ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`async ${arg};`);
      });
    });

    it(`async ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`async ${arg};`, { next: true, webcompat: true });
      });
    });

    it(`bar ? (${arg}) : baz;`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? (${arg}) : baz;`);
      });
    });

    it(`bar ? baz : (${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? baz : (${arg});`);
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
        parseSource(`(function *g(z = ( ${arg} ) => {}) { });`);
      });
    });

    it(`(function *g(async ( ${arg} ) => {}) { });`, () => {
      t.throws(() => {
        parseSource(`(function *g(async ( ${arg} ) => {}) { });`);
      });
    });

    it(`"use strict"; (function *g(z = ( ${arg} ) => {}) { });`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (function *g(z = ( ${arg} ) => {}) { });`);
      });
    });

    it(`(function *g(z = ( ${arg} ) => {}) { });`, () => {
      t.throws(() => {
        parseSource(`(function *g(z = ( ${arg} ) => {}) { });`, { sourceType: 'module' });
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
        parseSource(`${arg} `);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} `, { webcompat: true });
      });
    });
    it(`x = ${arg};`, () => {
      t.throws(() => {
        parseSource(`x = ${arg};`);
      });
    });
    it(`x = ${arg};`, () => {
      t.throws(() => {
        parseSource(`x = ${arg};`, { next: true });
      });
    });
    it(`bar,  ${arg};`, () => {
      t.throws(() => {
        parseSource(`bar,  ${arg};`);
      });
    });

    it(`bar,  ${arg};`, () => {
      t.throws(() => {
        parseSource(`bar,  ${arg};`, { webcompat: true });
      });
    });

    it(`bar,  ${arg};`, () => {
      t.throws(() => {
        parseSource(`bar,  ${arg};`, { sourceType: 'module' });
      });
    });

    it(`bar ? (${arg}) : baz;`, () => {
      t.throws(() => {
        parseSource(`bar ? (${arg}) : baz;`);
      });
    });

    it(`bar ? baz : (${arg});`, () => {
      t.throws(() => {
        parseSource(`bar ? baz : (${arg});`);
      });
    });

    it(`${arg}, bar;`, () => {
      t.throws(() => {
        parseSource(`${arg}, bar;`);
      });
    });

    it(`bar[${arg}];`, () => {
      t.throws(() => {
        parseSource(`bar[${arg}];`);
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
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`v = ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`v = ${arg};`);
      });
    });

    it(`v = ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`v = ${arg};`, { next: true });
      });
    });

    it(`bar,  ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar,  ${arg};`);
      });
    });

    it(`bar ? (${arg}) : baz;`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? (${arg}) : baz;`);
      });
    });

    it(`bar ? baz : (${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar ? baz : (${arg});`);
      });
    });

    it(`${arg}, bar;`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}, bar;`);
      });
    });

    it(`${arg}, bar;`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}, bar;`, { next: true });
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
        parseSource(`()${arg} =>{}`);
      });
    });

    it(`async ()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`async ()${arg} =>{}`);
      });
    });

    it(`()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`()${arg} =>{}`, { webcompat: true });
      });
    });
    it(`()${arg} =>{}:`, () => {
      t.throws(() => {
        parseSource(`()${arg} =>{};`);
      });
    });

    it(`var x = ()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`var x = ()${arg} =>{}`);
      });
    });

    it(`var x = ()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`var x = ()${arg} =>{}`, { next: true });
      });
    });

    it(`"use strict"; var x = ()${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; var x = ()${arg} =>{}`);
      });
    });

    it(`(...a)${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`(...a)${arg} =>{}`);
      });
    });

    it(`var x = (...a)${arg};`, () => {
      t.throws(() => {
        parseSource(`var x = (...a)${arg} =>{}`);
      });
    });

    it(`(a,b)${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`(a,b)${arg} =>{}`);
      });
    });

    it(`var x = (a,b)${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`var x = (a,b)${arg} =>{}`);
      });
    });

    it(`async (a,b)${arg} =>{}`, () => {
      t.throws(() => {
        parseSource(`async (a,b)${arg} =>{}`);
      });
    });

    it(`(a,...b)${arg};`, () => {
      t.throws(() => {
        parseSource(`(a,...b)${arg} =>{}`);
      });
    });

    it(`var x = (a,...b)${arg};`, () => {
      t.throws(() => {
        parseSource(`var x = (a,...b)${arg} =>{}`);
      });
    });
  }

  fail('Expressions - Array (fail)', [
    { code: '"use strict"; let => {}', options: { lexical: true } },
    { code: 'let => {}', options: { sourceType: 'module' } },
    'function *a() { yield => foo }',
    'yield x => zoo',
    'foo bar => zoo',
    '([{x: y.z}]) => b',
    '([{x: y.z}] = a) => b',
    '([{x: y.z}] = a) => b',
    '([{x: y.z} = a]) => b',
    'async(foo = super()) => {}',
    'async (x = 1) => {"use strict"}',
    'async(foo) => { super() };',
    'async(foo) => { super.prop };',
    String.raw`\u0061sync () => {}`,
    '(async (...a,) => {}',
    String.raw`x = (y = "foo\003bar") => { "use strict"; }`,
    { code: String.raw`x = (y = "foo\003bar") => { }`, options: { impliedStrict: true } },
    { code: 'function foo(package) { }', options: { impliedStrict: true } },
    '()?c:d=>{}=>{}',
    '()=c=>{}=>{};',
    'x = ()+c=>{}',
    'x = ()c++=>{};',
    '() => { let [x] }',
    '() => { let [] }',
    'a = b\n=> c',
    'a = b\n=>\nc',
    'a\n= b\n=> c',
    { code: String.raw`(p\u0061ckage) => { }`, options: { impliedStrict: true } },
    { code: String.raw`(p\u0061ckage, a) => { }`, options: { impliedStrict: true } },
    { code: String.raw`(a, p\u0061ckage) => { }`, options: { impliedStrict: true } },
    String.raw`(p\u0061ckage) => { "use strict"; }`,
    String.raw`(p\u0061ckage, a) => { "use strict"; }`,
    String.raw`(a, p\u0061ckage) => { "use strict"; }`,
    String.raw`(p\x61ckage) => { }`,
    String.raw`(p\x61ckage) => { "use strict"; }`,
    String.raw`(p\141ckage) => { "use strict"; }`,
    'package => { "use strict"; }',
    { code: String.raw`p\u0061ckage => { }`, options: { impliedStrict: true } },
    String.raw`p\u0061ckage => { "use strict"; }`,
    String.raw`p\141ckage => { }`,
    String.raw`p\141ckage => { "use strict"; }`,
    '()=>{}+a',
    '()=>{}++',
    '()=>{}--',
    '()=>{}\n++x',
    '()=>{}\n--x',
    'a?c:d=>{}=>{};',
    '(...a)`template-head${c}`=>{}',
    '(...a)?c:d=>{}=>{};',
    { code: 'interface => {}', options: { sourceType: 'module' } },
    'x = (...a)?c:d=>{}=>{}',
    'x = (...a)[1]=>{};',
    '(a,...b)`template-head${c}`=>{}',
    '(a,...b)`${c}template-tail`=>{};',
    'x = (a,...b)`${c}template-tail`=>{}',
    'x = (a,...b)[c]=>{};',
    '()`template-head${c}template-tail`=>{}',
    '()?c:d=>{}=>{};',
    'x = ()[1]=>{}',
    'x = ()[c]=>{};',
    'x = (a,b)+c=>{};',
    'x = a`template-head${c}template-tail`=>{}',
    'x = ac++=>{};',
    '(a)`${c}template-tail`=>{}',
    '(a)`template-head${c}template-tail`=>{};',
    'x = (a)?c:d=>{}=>{}',
    'x = (a)`${c}template-tail`=>{};',
    'a`${c}template-tail`=>{}',
    'a`template-head${c}template-tail`=>{};',
    '({x: {x: y}.length})  => {}',
    '({x: x + y})  => {}',
    '({x: void x})  => {}',
    '({x: this})  => {}',
    '({x: function(){}})  => {}',
    '({x: async ()=>x})  => {}',
    { code: '({x: this})  => {}', options: { webcompat: true } },
    { code: '({x: function(){}})  => {}', options: { webcompat: true } },
    { code: '({x: async ()=>x})  => {}', options: { webcompat: true } },
    '0 || () => 0',
    '0 || x => 0',
    '0 || (x) => 0',
    '0 || (x,y) => 0',
    '!()=>{}',
    '(x, y)[7] => {}',
    "eval => { 'use strict'; return eval + 1; }",
    "arguments => { 'use strict'; return arguments + 2; }",
    "(e, arguments) => { 'use strict'; return e + arguments; }",
    'x \n => d;',
    '(x) \n => d;',
    'var a = () \n => d;',
    'var a = (x) \n => { return d };',
    'var a = {}; a\n.x => d;',
    'var a = {}; a.x \n => d;',
    'x = a`c`=>{}',
    '([(a)]) => {};',
    '(x, /x/g) => x',
    '(x, /x/g) => x',
    '(a=/i/) = /i/',
    '(x => y) = {}',
    '(x => y) = {}',
    '(async x => y) = {}',
    '((x, z) => y) = {}',
    '(async (x, z) => y) = {}',
    'async("foo".bar) => x',
    'function x(){([(a)]) => {} }',
    '(a)[1]=>{}',
    '(a)[c]=>{};',
    'x = (a)`c`=>{}',
    'x = (a)-c=>{};',
    '(...a)`c`=>{}',
    '(...a)-c=>{};',
    'x = (...a)+c=>{}',
    'x = (...a)-c=>{};',
    '(a,b)+c=>{}',
    'x = (a,b)", "=>{}',
    '(a()=0)=>0',
    'x = (a,b)-c=>{};',
    '(a,...b)+c=>{}',
    '(a,...b)+c=>{}',
    '(a=1 => 42)',
    '([a, b] => 42)',
    '({a, b} => 42)',
    '([a, b] = [] => 42)',
    '({a, b} = {} => 42)',
    '(...a => 42)',
    '32 => {}',
    '(32) => {}',
    '(a, 32) => {}',
    'if => {}',
    '(if) => {}',
    '(a, if) => {}',
    'a + b => {}',
    '(a + b) => {}',
    '(a + b, c) => {}',
    '(a, b - c) => {}',
    '"a" => {}',
    '("a") => {}',
    '("a", b) => {}',
    '(a, "b") => {}',
    '-a => {}',
    '(-a) => {}',
    '(-a, b) => {}',
    '(a, -b) => {}',
    '{} => {}',
    'a++ => {}',
    '(a++) => {}',
    '(a++, b) => {}',
    '(a, b++) => {}',
    '[] => {}',
    '({...[a, b]}) => x',
    '({...{a, b}}) => x',
    '(foo ? bar : baz) => {}',
    '(a, foo ? bar : baz) => {}',
    '(foo ? bar : baz, a) => {}',
    '(a.b, c) => {}',
    '(c, a.b) => {}',
    "(a['b'], c) => {}",
    "(c, a['b']) => {}",
    '(...a = b) => b',
    "() => {'value': 42}",
    { code: 'enum => 1;', options: { impliedStrict: true } },
    { code: 'var af = enum => 1;', options: { impliedStrict: true } },
    { code: 'var af = package => 1;', options: { impliedStrict: true } },
    { code: 'var af = arguments => 1;', options: { impliedStrict: true } },
    { code: 'var af = eval => 1;', options: { impliedStrict: true } },
    'var af = ...x => x;',
    { code: 'var af = yield => 1;', options: { impliedStrict: true } },
    { code: 'var af = (yield) => 1;', options: { impliedStrict: true } },
    outdent`
      var af = x
      => {};
    `,
    'var f = (a = 0) => { "use strict"; };',
    ')',
    ') => 0',
    '=> 0',
    '=>',
    '=> {}',
    '([x.y]=z) => z',
    ') => {}',
    '(()) => 0',
    '((x)) => 0',
    '((x, y)) => 0',
    '(x, (y)) => 0',
    '((x, y, z)) => 0',
    '([...x.y]) => z',
    '([...(x), y] = z) => 0',
    '((x, y, z)) => 0',
    '((x, y, z)) => 0',
    '((x, y, z)) => 0',
    '([...x.y] = z) => z',
    '(x, (y, z)) => 0',
    '((x, y), z) => 0',
    '(a => a) +',
    'eval => { "use strict"; 0 }',
    'arguments => { "use strict"; 0 }',
    'a => (b => (a + b)',
    '([[[[[[[[[[[[[[[[[[[[{a:b[0]}]]]]]]]]]]]]]]]]]]]])=>0;',
    'bar ? (=> 0) : baz;',
    '() => {} 1',
    '() => {} a',
    '(...a, ...b) => {}',
    '(...a, ...b) => {}',
    '(a, ...b,) => {}',
    '(...x,) => x',
    '(async (...a, b) => {})',
    '(async (...a, ...b) => {})',
    '() => {} a()',
    '() => {} 1',
    '((x, y)) => 0',
    '(b = (a,)) => {}',
    '32 => {}',
    '(32) => {}',
    'if => {}',
    'a++ => {}',
    '(a, b++) => {}',
    '(a, foo ? bar : baz) => {}',
    '(a.b, c) => {}',
    "(a['b'], c) => {}",
    '(a, (b)) => 42;',
    '({get a(){}}) => 0;',
    '([a,...b,])=>0;',
    '({a:b[0]})=>0',
    '({}=>0)',
    '({a:b[0]})=>0',
    '({}=>0)',
    "(a['b'], c) => {}",
    '(...a = b) => b',
    '(-a) => {}',
    '(...rest - a) => b',
    '(a, ...b - 10) => b',
    '((x, y), z) => 0',
    '(a\n=> a)(1)',
    '(a/*\n*/=> a)(1)',
    '((a)\n=> a)(1)',
    '((a)/*\n*/=> a)(1)',
    '((a, b)\n=> a + b)(1, 2)',
    '((a, b)/*\n*/=> a + b)(1, 2)',
    '[]=>0',
    '() ? 0',
    '(a)\n=> 0',
    '1 + ()',
    '(a,...a)/*\u2028*/ => 0',
    '(a,...a)\n',
    '() <= 0',
    '(a,...a)/*\u202a*/',
    '(a,...a)/*\n*/ => 0',
    'left = (aSize.width/2) - ()',
    '(10) => 0;',
    '"use strict"; (a) => 00;',
    '("a", b) => {}',
    '(a, "b") => {}',
    '-a => {}',
    '(-a) => {}',
    '(-a, b) => {}',
    '(a, -b) => {}',
    '{} => {}',
    'a++ => {}',
    '(a++) => {}',
    '(a++, b) => {}',
    '(a, b++) => {}',
    '[] => {}',
    '(foo ? bar : baz) => {}',
    '(a, foo ? bar : baz) => {}',
    '(foo ? bar : baz, a) => {}',
    '(a.b, c) => {}',
    "(a['b'], c) => {}",
    "(c, a['b']) => {}",
    '(...a = b) => b',
    '(...rest - a) => b',
    '(a, ...b - 10) => b',
    'let x = {y=z} => d',
    'let x = {y=z}',
    '(..a, ...b) => c',
    '([0])=>0;',
    '({0})=>0;',
    '({a:b[0]}) => x',
    'f = ([...[x], y] = [1, 2, 3]) => {};',
    'f = ([...[ x ] = []] = []) => {};',
    'f = ([...{ x }, y]) => {};',
    'f = ([...{ x }, y]) => {};',
    '1 + ()',
    '((x)) => a',
    '(function *g(z = ( [x=(yield)]) => {}) { });',
    '(function *g(z = ( x=yield) => {}) { });',
    '(x, (y, z)) => a',
    '((x, y), z) =>  a',
    'f = ([...{ x } = []]) => {};',
    '(function *g([x = class extends (a ? null : yield) { }] = [null]) { });',
    '(function *g(x = class { [y = (yield, 1)]() { } }) { });',
    '(function *g(x = class extends (yield) { }) { });',
    '()=c=>{}=>{}',
    '()[1]=>{}',
    '()c++=>{}',
    '()-c=>{}',
    '(a,b)(c)=>{}',
    '(a,...b)[c]=>{}',
    '=> 0',
    '() =>',
    '=> {}',
    ', => {}',
    '() => {"value": 42}',
    '(()) => 0',
    '((x, y)) => 0',
    '(x, (y)) => 0',
    '(localVar |= defaultValue) => {}',
    '([{x: y.z}]) => b',
    '([{x: y.z}] = a) => b',
    '([{x: y.z} = a]) => b',
    '({x: y.z} = a) => b',
    '([{x: y.z}]) => b',
    '([{x: y.z}] = a) => b',
    '([{"foo": y.z} = a]) => b',
    '({"foo": y.z} = a) => b',
    '([{"foo": y.z}]) => b',
    '([{"foo": y.z}] = a) => b',
    '([{1: y.z} = a]) => b',
    '({333: y.z} = a) => b',
  ]);

  for (const arg of [
    'function foo() { }; foo(() => "abc"); foo(() => "abc", 123);',
    '({})[x => x]',
    '() => () => 0',
    '() => x => (a, b, c) => 0',
    'y => () => (a) => 0',
    'function * foo() { yield ()=>{}; }',
    'function foo() { }; foo((x, y) => "abc"); foo(b => "abc", 123);',
    '(a, b) => { return a * b; }',
    'a = () => {return (3, 4);};',
    outdent`
      "use strict";
      ((one, two) => {});
    `,
    '([])=>0;',
    '(function (x) { return x => x; })(20)(10)',
    '(function () { return x => x; })()(10)',
    ' (function () {  return x => x; })()(10)',
    '() => true ? 1 : (() => false ? 1 : (0))',
    'l = async() => true ? 1 : (() => false ? 1 : (0))',
    '([,,])=>0',
    '([a,...b])=>0;',
    '([a,b])=>0;',
    '([a]) => [0];',
    '({a,b=b,a:c,[a]:[d]})=>0;',
    outdent`
      (() => {}) || true;
      (() => {}) ? a : b;
    `,
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
    'a => 0',
    '() => () => 0',
    '() => 0, 1',
    '() => 0 + 1',
    '(a,b) => 0 + 1',
    '(a,b,...c) => 0 + 1',
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
    '([y]) => x;',
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
    outdent`
      'use strict';
      setTimeout( () => console.log( this ) );
        function foo () {
        'use strict';
        setTimeout( () => console.log( this ) );
      }
    `,
    'new (() => {});',
    'bar ? ( (x) => x ) : baz;',
    '(x = 9) => {}',
    '([x = 0]) => {}',
    '(a, (a, (b, c) => 0))',
    'a => 0',
    '() => () => 0',
    '() => 0, 1',
    '() => 0 + 1',
    '(a,b) => 0 + 1',
    '(a,b,...c) => 0 + 1',
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
    '([y]) => x;',
    '([y]) => ([y]) => x;',
    '(x=1) => x * x;',
    '(x=1) => x * (x = y);',
    '(eval = 10) => 42;',
    '(a, b=(c)=>{}) => {}',
    'var double = (x) => x * 2',
    'let Y = F => (x=>F(y=>(x(x))(y)))(x=>F(y=>(x(x))(y)))',
    outdent`
      'use strict';
        setTimeout( () => console.log( this ) );
        function foo () {
        'use strict';
        setTimeout( () => console.log( this ) );
      }
    `,
    'var x = a =>{}',
    'async foo => bar',
    '(async foo => bar)',
    '() => {}',
    '() => {(async foo => bar)}',
    'a => {}',
    'a => {a => {a => {a => {a => {a => {}}}}}}',
    'async () => {}',
    'async () => {async () => {async () => {async () => {async () => {}}}}}',
    'async => {}',
    '({ async foo(a, c, b){} });',
    outdent`
      async => {}
      async => {}
    `,
    '() => () => () => {}',
    '() => () => ({a = b} = c) => b * c',
    '() => () => () => { async(a-vb) }',
    outdent`
      () => {}
      async()
      async => {}
      async => {}
      a => {}
      a => {}
    `,
    '() => {}',
    outdent`
      () => {}
      async()
      async => {}
      async => {}
      a => {}
      a => {}
    `,
    '() => {}',
    outdent`
      () => {}
      async()
      async => {}
      async => {}
      a => {}
      a => {}
    `,
    '() => {}',
    outdent`
      () => {}
      async()
      async => {}
      async => {}
      a => {}
      a => {}
    `,
    '(async => async)',
    outdent`
      () => {}
      a()
      async()
    `,
    '(z = [...x.y]) => z',
    'a => a => a => async a => a',
    'a => a => a => a => a => a => a => a => a => a => a => a => a => a => a => async a => a',
    'var f = (function() { return z => arguments[0]; }(5));',
    'async(...{x}) => x',
    'async(...[x]) => x',
    '(...{x}) => x',
  ]) {
    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`);
      });
    });
    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`, { webcompat: true });
      });
    });
    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg};`, { next: true });
      });
    });

    it(`function x(){${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function x(){${arg} }`);
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
        parseSource(`${arg};`);
      });
    });
    it(`${arg};`, () => {
      t.throws(() => {
        parseSource(`${arg};`, { webcompat: true });
      });
    });
    it(`${arg};`, () => {
      t.throws(() => {
        parseSource(`${arg};`, { next: true });
      });
    });

    it(`function x(){${arg} }`, () => {
      t.throws(() => {
        parseSource(`function x(){${arg} }`);
      });
    });
  }
  pass('Expressions - Arrow (pass)', [
    { code: 'async let => {}', options: { lexical: true } },
    { code: 'let => {}', options: { lexical: true } },

    'f = ([[,] = g()]) => {}',

    { code: '() => { let x }', options: { webcompat: true } },
    { code: 'let => a + b', options: { webcompat: true } },
    { code: 'async let => {}, let => {}', options: { webcompat: true } },
    { code: 'let => {}, let => {}', options: { webcompat: true } },
    { code: 'let => {}', options: { webcompat: true } },
    { code: 'f = ([[,] = g()]) => {}', options: { webcompat: true } },
    '([[[[[[[[[[[[[[[[[[[[{a=b}]]]]]]]]]]]]]]]]]]]])=>0;',

    { code: 'a => a + x', options: { ranges: true } },
    { code: 'a => a / x', options: { ranges: true } },
    { code: 'a => x.foo', options: { ranges: true } },
    { code: '(() => {}) << x', options: { ranges: true } },
    { code: 'a => x[foo]', options: { ranges: true } },
    { code: 'a => x()', options: { ranges: true } },
    '() => {}\n+function(){}',
    { code: 'fn = (a, b, ...c) => c;', options: { ranges: true } },
    { code: '(interface)', options: { ranges: true } },
    { code: '({}) => {}', options: { ranges: true } },
    { code: '(x = yield = x) => x', options: { ranges: true } },
    { code: '([x = yield]) => x', options: { ranges: true } },
    { code: '([x, {y: [yield]}])', options: { ranges: true } },
    { code: '([], a) => {}', options: { ranges: true } },
    '(a = b) => {}',
    {
      code: outdent`
        (expect, subject, typeName) => {
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
        }
      `,
      options: { ranges: true },
    },
    { code: '(a, b = c) => {}', options: { ranges: true } },
    { code: '(x, y = 9, z = 8) => {}', options: { ranges: true } },
    { code: '({a} = {}) => {}', options: { ranges: true } },
    { code: 'let x = ({y=z}=e) => d', options: { ranges: true } },
    { code: '([x] = []) => {}', options: { ranges: true } },
    '(...a) => 0',
    'e => "test"',
    { code: 'e => { label: 42 }', options: { ranges: true } },
    '(a, b) => { 42; }',
    { code: '(x=1) => x * x', options: { ranges: true } },
    'arguments => 42',
    '(eval = 10) => 42',
    '(x) => ((y, z) => (x, y, z))',
    'foo(() => {})',
    'foo((x, y) => {})',
    'x => { function x() {} }',
    '(a, ...b) => {}',
    '(...a) => {}',
    '(a = 1) => {}',
    'async (eval) => "use strict";',
    '(x) => { function x() {} }',
    '([x, y] = z) => x;',
    '([...x]) => x',
    '([x, ...y]) => x',
    '([[x, y] = z]) => x;',
    '() => { let {} = y }',
    '(x, y)=>x;',
    '(a = 1, b = 2) => x;',
    'a = (b) => c;',
    '({x});',
    '({ident: {x: y}}) => x',
    '({ident: {x}}) => x',
    { code: '({a} = b,) => {}', options: { ranges: true } },
    { code: '(a, b, (c, d) => 0)', options: { ranges: true } },
    { code: '(a, b) => 0, (c, d) => 1', options: { ranges: true } },
    { code: '(a, b => {}, a => a + 1)', options: { ranges: true } },
    { code: '() => a + b - yield / 1', options: { ranges: true } },
    { code: '({x = 10, y: { z = 10 }}) => [x, z]', options: { ranges: true, raw: true } },
    { code: '({x = 10}) => x', options: { ranges: true } },
    { code: '(a, {}) => {}', options: { ranges: true } },
    '({}, a) => {}',
    '(eval = 10) => 42;',
    { code: '(a = b, c) => {}', options: { ranges: true } },
    '(x = 9) => {}',
    { code: '(a) => 00;', options: { ranges: true } },
    '(x, y) => x + y',
    { code: '(x, y) => z => z * (x + y)', options: { ranges: true } },
    '({a} = {}) => {}',
    '() => bar',
    '(( [x]=f(yield) )=>{});',
    '(( {x=f(yield)} )=>{});',
    'for ( f => ( "key" in {}) ; 0;);',
    '(x, y) => z => z * (x + y);',
    'x => (y, z) => z * (x + y)',
    'a, b => 0;',
    'a, b, (c, d) => 0;',
    'var x = ({x = 30}, [y], z) => x',
    'var x = ([x = 25]) => x => x => ({x} = {})',
    'var x = foo => x => x => x => {x}',
    '(a, b) => 0, (c, d) => 1;',
    '(a, b => {}, a => a + 1);',
    '((a, b) => {}, (a => a + 1));',
    '(a, (a, (b, c) => 0));',
    { code: 'foo ? bar : baz => {};', options: { ranges: true } },
    '(a, {}) => {};',
    '({}, a) => {};',
    '({a}) => {};',
    '(x = 9) => {};',
    '(x, y = 9) => {};',
    '(x = 9, y) => {};',
    '(x, y = 9, z = 8) => {};',
    '({a} = {}) => {};',
    '([x] = []) => {};',
    '([x = 0]) => {};',
    {
      code: outdent`
        (a) => b;  // 1 args
        (a, b) => c;  // n args
        () => b;  // 0 args
        (a) => (b) => c;  // func returns func returns func
        (a) => ((b) => c);  // So these parens are dropped
        () => (b,c) => d;  // func returns func returns func
        a=>{return b;}
        a => 'e';  // Dropping the parens
      `,
      options: { ranges: true },
    },
    { code: 'const a = () => {return (3, 4);};', options: { ranges: true } },
    {
      code: outdent`
        (() => {}) || true;
        (() => {}) ? a : b;
      `,
      options: { ranges: true },
    },
    { code: '(() => {}) + 2', options: { ranges: true } },
    { code: 'bar ? ( (x, y) => (u, v) => x*u + y*v ) : baz;', options: { ranges: true } },
  ]);
});
