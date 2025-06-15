import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Expressions - Group', () => {
  for (const arg of [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'null',
    'true',
    'false' /*'enum',*/,
  ]) {
    it(`should fail on '(${arg}) = foo'`, () => {
      t.throws(() => {
        parseSource(`(${arg}) = foo`, undefined, Context.None);
      });
    });
    it(`use strict"; '(${arg}) = foo'`, () => {
      t.throws(() => {
        parseSource(`use strict"; (${arg}) = foo`, undefined, Context.None);
      });
    });
    it(`foo = { get x(){  "use strict"; ( ${arg} = "sentinal 79845134");   }}`, () => {
      t.throws(() => {
        parseSource(`foo = { get x(){  "use strict"; ( ${arg} = "sentinal 79845134");   }}`, undefined, Context.None);
      });
    });

    it(`should fail on '(${arg} = foo )'`, () => {
      t.throws(() => {
        parseSource(`(${arg} = foo)`, undefined, Context.Strict);
      });
    });

    it(`should fail on '(${arg} = foo )'`, () => {
      t.throws(() => {
        parseSource(`(${arg} = foo)`, undefined, Context.OptionsWebCompat | Context.OptionsNext);
      });
    });
  }

  for (const arg of [
    '([...[]] = x);',
    '({...[].x} = x);',
    '({...[({...[].x} = x)].x} = x);',
    '({...a.x} = x);',
    '({...x.x, y})',
    '({...x.x = y, y})',
    '({...x = y, y})',
    '([x.y = a] = z)',
    '([x.y = a] = ([x.y = a] = ([x.y = a] = z)))',
    '({..."x".x} = x);',
    '({...{}.x} = x);',
    '([...[].x] = x);',
    '([...[([...[].x] = x)].x] = x);',
    '([...{}.x] = x);',
    '({..."x"[x]} = x);',
    '({...[][x]} = x);',
    '({...[][x]} = x = y);',
    '({...[][x]} = x = (y));',
    '({...[][x]} = (x) = (y));',
    '({...{}[x]} = x);',
    '({...{}[x = (y)[z]]} = x);',
    '([...[({...{}[x = (y)[z]]} = x)][x]] = x);',
    '([...[][x]] = x);',
    '([...{}[x]] = x);',
    '([...{}[x]] = "x");',
    '({...{b: 0}.x} = {});',
    '({...[0].x} = {});',
    '({...{b: 0}[x]} = {});',
    '({...[0][x]} = {});',
    '({...[1][2]} = {});',
    'foo({get [bar](){}, [zoo](){}});',
    'foo({[bar](){}, get [zoo](){}});',
    'foo({set [bar](c){}, [zoo](){}});',
    'foo({[bar](){}, set [zoo](e){}});',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.OptionsPreserveParens);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    'let',
    'implements',
    'package',
    'protected',
    'interface',
    'private',
    'public',
    'yield',
    // special non-keywords
    'static',
    'eval',
    'arguments',
  ]) {
    it(`should fail on '(${arg} = foo )'`, () => {
      t.throws(() => {
        parseSource(`(${arg} = foo)`, undefined, Context.Strict);
      });
    });
    it(`"use strict"; '(${arg} = foo )'`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (${arg} = foo)`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`x = { get x() { "use strict"; ${arg} = foo } }'`, () => {
      t.throws(() => {
        parseSource(`x = { get x() { "use strict"; (${arg} = foo} }`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'async ()=>x',
    'await foo',
    'class{}',
    'delete x.x',
    'false',
    'function(){}',
    'new x',
    'null',
    'super',
    'true',
    'this',
    'typeof x',
    'void x',
    'yield x',
    'x + y',
    '[].length',
    '[x].length',
    '{}.length',
    '{x}.length',
    '{x: y}.length',
  ]) {
    it(`should fail on '(${arg})=> y'`, () => {
      t.throws(() => {
        parseSource(`(${arg})=> y`, undefined, Context.None);
      });
    });

    it(`"use strict"; '(${arg})=> y'`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (${arg})=> y`, undefined, Context.None);
      });
    });

    it(`should fail on '(${arg})=> y'`, () => {
      t.throws(() => {
        parseSource(`(${arg})=> y`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`should fail on '(${arg})=> y'`, () => {
      t.throws(() => {
        parseSource(`(${arg})=> y`, undefined, Context.Module | Context.Strict);
      });
    });
  }

  for (const arg of [
    '(a,b+=2',
    '(a,b)+=2',
    '(a[b],c)+=2',
    '(a,b)=2',
    '(a=1)+=2',
    '(a=1)=2',
    '();',
    '()',
    '(...x);',
    '(...);',
    '([a + b] = x);',
    'async([].x) => x;',
    'async ({} + 1) => x;',
    '(a, b) = c',
    '(,,)',
    '(,) = x',
    '(,,) = x',
    '(a,) = x',
    '(a,b,) = x',
    '(a = b,) = x',
    '(...a,) = x',
    '([x],) = x',
    '({a},) = x',
    '(...a = x,) = x',
    '({a} = b,) = x',
    '(a, 1, "c", d, e, f) => x;',
    '((x)) => x;',
    '(x--, y) => x;',
    '(x--) => x;',
    '(++x, y) => x;',
    '(++x) => x;',
    '/i/ * ()=>j',
    '(a[b]) => x;',
    '(a.b) => x;',
    '((x)) => x;',
    '...x => x',
    'y, ...x => x',
    '(x, ...y, z) => x',
    '(...x, y) => x',
    '(...x = y) => x',
    '([...x.y]) => z',
    '([a + b] = x) => a;',
    '({ident: [foo, bar] + x} = y)',
    '(a=/i/) = /i/',
    '(/x/) => x',
    '(x, /x/g) => x',
    '(x, /x/g) => x',
    '({ident: {x}.join("")}) => x',
    '({ident: {x:y} += x})',
    '({ident: {x}/x/g}) => x',
    '(a,,) => {}',
    '(...a = x,) => {}',
    '(...a = x,) => {}',
  ]) {
    it(`should fail on '${arg}'`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`should fail on '${arg}'`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`"use strict"; '${arg}'`, () => {
      t.throws(() => {
        parseSource(`"use strict";${arg}`, undefined, Context.None);
      });
    });

    it(`"use strict"; '${arg}'`, () => {
      t.throws(() => {
        parseSource(`"use strict";${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`should fail on '${arg}'`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Module | Context.Strict);
      });
    });

    it(`function foo() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function foo() { ${arg} }`, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Group (fail)', [
    ['(1) = x', Context.None],
    ['("a") = "b"', Context.None],
    ['([a]) = x', Context.None],
    ['({a}) = 1', Context.None],
    ['{a, b} = {a: 1, b: 2}', Context.None],
    ['({a, b}) = {a: 1, b:2};', Context.None],
    ['({b}) = b;', Context.None],
    ['([b]) = b;', Context.None],
    ['({a}) = 2;', Context.None],
    ['([b]) = b;', Context.None],
    ['[(a = 0)] = 1', Context.None],
    ['[[1]] = [];', Context.None],
    ['x, {a: {a: 1} = []};', Context.None],
    ['({a: 1} = []);', Context.None],
    ['(...{a: b}.c = [])', Context.None],
    ['x, [foo + y, bar] = doo;', Context.None],
    ['([x, y]) = z;', Context.None],
    ['{x, y} = z;', Context.None],
    ['({x, y}) = z;', Context.None],
    [`(x={"y": await z}) => t`, Context.None],
    [`(x={200: await z}) => t`, Context.None],
    ['({[x](){}} = z);', Context.None],
    ['(a \n/b/);', Context.None],
    ['([a \n/b/]);', Context.None],
    ['( ({x: 1}) ) => {};', Context.None],
    ['( (x) ) => {}', Context.None],
    ['( ({x: 1}) = y ) => {}', Context.None],
    ['( (x) = y ) => {}', Context.None],
    ['let [({x: 1})] = [];', Context.None],
    ['let [({x: 1}) = y] = [];', Context.None],
    ['var [({x: 1})] = [];', Context.None],
    ['var [({x: 1}) = y] = [];', Context.None],
    ['[({x: 1}) = y] = [];', Context.None],
    ['({a,b}) = {a:2,b:3}', Context.None],
    ['(...);', Context.None],
    ['(...x);', Context.None],
    ['({x, y}) = {}', Context.None],
    ['({ obj:20 }) = 42', Context.None],
    ['( { get x() {} } = 0)', Context.None],
    ['(a, (b)) => 42', Context.None],
    ['([...{a = b} = c]) => d;', Context.None],
    ['([[].length]) => x;', Context.None],
    ['()', Context.None],
    ['();', Context.None],
    ['(...[a])', Context.None],
    ['(...[a],)', Context.None],
    ['(...[a]) => ', Context.None],
    ['a = (...[a])', Context.None],
    ['a = (...[a]) =', Context.None],
    ['a = (...[a]) =', Context.None],
    ['a = (...[a]) = a', Context.None],
    ['a (...[a]) = a', Context.None],
    ['(...[a]) = a', Context.None],
    ['(...[a]a) = a', Context.None],
    ['(...[a) = a', Context.None],
    ['(...a) = a', Context.None],
    ['(a,b)=(c,d);', Context.None],
    ['({a = 0});', Context.None],
    ['({a} += 0);', Context.None],
    ['({a,,} = 0)', Context.None],
    ['({,a,} = 0)', Context.None],
    ['({a, ...b, c} = {})', Context.None],
    ['({a = 5})', Context.None],
    ['({ ...{a} } = {})', Context.None],
    ['({b, c, d, ...{a} } = {})', Context.None],
    ['({a,,a} = 0)', Context.None],
    ['({function} = 0)', Context.None],
    ['({a:function} = 0)', Context.None],
    ['({a:for} = 0)', Context.None],
    ['({*=f(){}})', Context.None],
    ['({**f(){}})', Context.None],
    ['({**=f(){}})', Context.None],
    ['({async *=f(){}})', Context.None],
    ['({async **=f(){}})', Context.None],
    ['({a: b += 0} = {})', Context.None],
    ['[a += b] = []', Context.None],
    ['({"a"} = 0)', Context.None],
    ['"use strict"; (arguments = a)', Context.None],
    ['"use strict"; (arguments = a) => {}', Context.None],
    ['"use strict"; (arguments) => {}', Context.None],
    ['"use strict"; (a, arguments) => {}', Context.None],
    ['({var} = 0)', Context.None],
    ['({a.b} = 0)', Context.None],
    ['({0} = 0)', Context.None],
    ['(a=1)=2', Context.None],
    ['(a=1)+=2', Context.None],
    ['({x})=y', Context.None],
    ['(a,b)=2', Context.None],
    ['(a,b)+=2', Context.None],
    ['({ (x = yield) = {}; })', Context.None],
    ['([a + b] = x);', Context.None],
    ['async([].x) => x;', Context.None],
    ['async ({} + 1) => x;', Context.None],
    ['(a, b) = c', Context.None],
    ['(++x) => x;', Context.None],
    ['(++x, y) => x', Context.None],
    ['(x--) => x;', Context.None],
    ['({get p(...[]) {}})', Context.None],
    ['({set p(...[]) {}})', Context.None],
    ['(x--, y) => x;', Context.None],
    ['...x => x', Context.None],
    ['y, ...x => x', Context.None],
    ['({x:{1:y()=x},x:{7:3}})>x', Context.None],
    [`({[foo]() {}} = y)`, Context.None],
    ['0, {a = 0}) => 0', Context.None],
    ['({a = 0}, {a = 0}, 0) => 0', Context.None],
    ['(0, {a = 0}) = 0', Context.None],
    ['async (a, ...b=fail) => a;', Context.None],
    ['async (foo = yield x)', Context.None],
    ['async (foo = yield x) => foo', Context.None],
    ['(x = y) = z; ', Context.None],
    ['(x, ...y, z) => x', Context.None],
    ['(x, ...y, z) => x', Context.None],
    ['(...x, y) => x', Context.None],
    ['(...x = y) => x', Context.None],
    ['([...x.y]) => z', Context.None],
    ['([a + b] = x) => a;', Context.None],
    ['([...a.b]) => c', Context.None],
    ['({ident: [foo, bar].join("")}) => x', Context.None],
    ['({ident: [foo, bar]/x}) => x', Context.None],
    ['({ident: [foo, bar]/x/g}) => x', Context.None],
    ['({ident: {x}.join("")}) => x', Context.None],
    ['({ident: {x}/x}) => x', Context.None],
    ['({ident: {x}/x/g}) => x', Context.None],
    ['(/x/) => x', Context.None],
    ['(/x/) => x', Context.None],
    ['(x, /x/g) => x', Context.None],
    ['(x, /x/g) => x', Context.None],
    ['(a=/i/) = /i/', Context.None],
    ['(x => y) = {}', Context.None],
    ['({x = y})', Context.None],
    ['({x = y}.z)', Context.None],
    ['({x = y}.z = obj)', Context.None],
    ['({x = y}.z) => obj', Context.None],
    ['({x = y}).z', Context.None],
    ['([{x = y}])', Context.None],
    ['([{x = y}].z)', Context.None],
    ['([{x = y}].z = obj)', Context.None],
    ['([{x = y}.z])', Context.None],
    ['([{x = y}.z] = obj)', Context.None],
    ['([{x = y}].z) => obj', Context.None],
    ['([{x = y}]).z', Context.None],
    ['[{x = y}]', Context.None],
    ['([{x = y}.z])', Context.None],
    ['(([x])=y in z);', Context.None],
    ['[{x = y}] in z', Context.None],
    ['for (([x])=y in z);', Context.None],
    ['for ([{x = y}] ;;);', Context.None],
    ['[{x = y}].z', Context.None],
    ['[{x = y}].z = obj', Context.None],
    ['[{x = y}].z = "obj"', Context.None],
    ['[{"x" = y}].z = obj', Context.None],
    ['[{x = "y"}].z = obj', Context.None],
    ['[{x = y}.z] = obj', Context.None],
    ['[{x = y}].z => obj', Context.None],
    ['({a: {x = y}})', Context.None],
    ['({a: {x = y}}.z)', Context.None],
    ['({a: {x = y}.z})', Context.None],
    ['({a: {x = y}}.z = obj)', Context.None],
    ['({a: {x = y}}.z) => obj', Context.None],
    ['({a: {x = y}}).z', Context.None],
    ['({a: {x = "y"}}).z', Context.None],
    ['(async x => y) = {}', Context.None],
    ['((x, z) => y) = {}', Context.None],
    ['(async (x, z) => y) = {}', Context.None],
    ['async("foo".bar) => x', Context.None],
    ['(...rest - a) => b', Context.None],
    ['(a, ...b - 10) => b', Context.None],
    ["(c, a['b']) => {}", Context.None],
    ['([x.y = a] = (...z))', Context.None],
    ["'(...(...z))", Context.None],
    ['((...z))', Context.None],
    ["'(...(...1))", Context.None],
    ["((...'z'))", Context.None],
    ["'(...(...('z'))", Context.None],
    ['([...[[][][]] = x);', Context.None],
    ['([...a, ,] = [...a, ,])', Context.None],
    ["(c, a['b']) => {}", Context.None],
    ['(...a = b) => b', Context.None],
    ['(-a, b) => {}', Context.None],
    ['(a, -b) => {}', Context.None],
    ['(x) = (1) = z', Context.None],
    ['(1) = x', Context.None],
    ['y = (1) = x', Context.None],
    ['(y) = (1) = x', Context.None],
    ['(1) = y = x', Context.None],
    ['(1) = (y) = x', Context.None],
    ['({a: 1 = x })', Context.None],
    ['({a: (1) = x })', Context.None],
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
    ['(c, a.b) => {}', Context.None],
    ['(x = x) = x;', Context.None],
    ['([[[[[[[[[[[[[[[[[[[[{a:b[0]}]]]]]]]]]]]]]]]]]]]])=>0', Context.None],
    ['([{a:b[0]}])=>0', Context.None],
    ['({a:b[0]})=>0', Context.None],
    ['([x]++)', Context.None],
    ['(..., x)', Context.None],
    ['(x = (await) = f) => {}', Context.Strict | Context.Module],
    ['async (x = (await) = f) => {}', Context.None],
    // ['(x = delete ((await) = f)) => {}', Context.Strict],
    ['function *f(){ yield = 1; }', Context.None],
    ['(yield) = 1;', Context.Strict],
    ['function *f(){ (yield) = 1; }', Context.None],
    ['(x = (yield) = f) => {}', Context.Strict],
    ['function *f(x = (yield) = f) {}', Context.None],
    ['(x = delete ((yield) = f)) => {}', Context.Strict],
    ['function *f(x = delete ((yield) = f)) {}', Context.None],
    ['(x={a:await f})=>x', Context.None],
    ['({x: 15.foo} = x)', Context.None],
    ['({x: 15.foo()} = x)', Context.None],
    ['x = {x: 15.foo} = x', Context.None],
    ['x = {x: 15.foo()} = x', Context.None],
    ['((x={15: (await foo)}) => x', Context.None],
    ['(x, ...);', Context.None],
    ['({ident: [foo, bar] += x})', Context.None],
    ['({ident: [foo, bar] += x})', Context.None],
    ['({...{x} }) => {}', Context.None],
    ['({...(x) }) => {}', Context.None],
    ['({...[x] }) => {}', Context.None],
    ['(await) = 1', Context.Strict | Context.Module],
    ['x = ({}) = b', Context.None],
    ['32 => {}', Context.None],
    ['(32) => {}', Context.None],
    ['(a, 32) => {}', Context.None],
    ['if => {}', Context.None],
    ['(if) => {}', Context.None],
    ['(a, if) => {}', Context.None],
    ['a + b => {}', Context.None],
    ['(a + b) => {}', Context.None],
    ['(a + b, c) => {}', Context.None],
    ['=> 0', Context.None],
    ['=>', Context.None],
    ['=> {}', Context.None],
    [') => {}', Context.None],
    [', => {}', Context.None],
    ['(,) => {}', Context.None],
    ['(...x);', Context.None],
    ['return => {}', Context.None],
    [`({"foo": [x].foo()}=y);`, Context.None],
    [`({15: 15.foo()}=x)`, Context.None],
    [`({15: 15.foo}=x)`, Context.None],
    ['(()) => 0', Context.None],
    ['((x)) => 0', Context.None],
    ['((x, y)) => 0', Context.None],
    ['(x, (y)) => 0', Context.None],
    ['((x, y, z)) => 0', Context.None],
    ['(x, (y, z)) => 0', Context.None],
    ['((x, y), z) => 0', Context.None],
    ['({[foo]: bar()} = baz)', Context.None],
    ['({[foo]: a + b} = baz)', Context.None],
    ['({[foo]: bar()}) => baz', Context.None],
    ['({[foo]: a + b}) => baz', Context.None],
    ['async("foo".bar) => x', Context.None],
    ['({...x.y} = z) => z', Context.None],
    ['({...x.y}) => z', Context.None],
    ['((x, y), z) => 0', Context.None],
    ['({*set x(){}})', Context.None],
    ['({*ident: x})', Context.None],
    ['({*ident x(){}})', Context.None],
    ['var {(a)} = 0', Context.None],
    ['({(a)} = 0)', Context.None],
    ['({a:(b = 0)} = 1)', Context.None],
    ['var {a:(b)} = 0', Context.None],
    ['({ x: f() } = a);', Context.None],
    ['({ x: new f } = a);', Context.None],
    ['"use strict"; ({ arguments } = a);', Context.None],
    ['({ if } = a);', Context.None],
    ['({ x = 123 });', Context.None],
    ['({ x: x }) = a;', Context.None],
    ['()', Context.None],
    ['()\n', Context.None],
    ['()\n=>', Context.None],
    ['()\n=>a', Context.None],
    ['([x.y]=z) => z', Context.None],
    ['({ a: (a = d) } = {})', Context.None],
    ['([x]=await y)=>z', Context.None],
    ['(({x:y}) += x)', Context.None],
    ['({foo: {x:y} += x})', Context.None],
    ['({x:y} += x)', Context.None],
    ['([x]=await y)=>z', Context.None],
    ['({foo: {}.bar() + x} = x)', Context.None],
    ['({foo: {}.bar()} = x)', Context.None],
    ['({foo: {} += x})', Context.None],
    ['({a:(a,y) = 0} = 1)', Context.None],
    ['({a:this}=0)', Context.None],
    ['({a: this} = 0);', Context.None],
    ['({get a(){}})=0', Context.None],
    ['({x}) = {x: 1};', Context.None],
    ['([a]) = []', Context.None],
    ['([a.a]) => 42', Context.None],
    ['-(5) ** 6;', Context.None],
    ['([a]) = 0', Context.None],
    ['({a}) = 0', Context.None],
    ['(a = b)++;', Context.None],
    ['(a = b) = c;', Context.None],
    ['`a`++;', Context.None],
    ['`a` = b;', Context.None],
    ['(`a`) => b;', Context.None],
    ['for (`a` of b);', Context.None],
    ['for (new.target in b);', Context.None],
  ]);

  pass('Expressions - Group (pass)', [
    ['(1) + (2  ) + 3', Context.None],
    [
      '((((((((((((((((((((((((((((((((((((((((((((((((((0))))))))))))))))))))))))))))))))))))))))))))))))))',
      Context.None,
    ],
    ['({a: {x = y}} = z)', Context.None],
    ['({a: {x = y}}) => z', Context.None],
    ['4 + 5 << (6)', Context.None],
    ['(a) + (b)', Context.None],
    ['((a))()', Context.None],
    ['(x, /y/);', Context.None],
    ['((a))((a))', Context.None],
    ['((a)) = 0', Context.None],
    ['"use strict"; (await) = 1', Context.None],
    ['(a) = 0', Context.None],
    ['void (a)', Context.None],
    ['(a)++', Context.None],
    ['(a)--', Context.None],
    ['(a) ? (b) : (c)', Context.None],
    ['(a++)', Context.None],
    ['(void a)', Context.None],
    ['({Foo} = {});', Context.None],
    ['({foo, bar} = {foo: 0, bar: 1});', Context.None],
    ['({} = 0);', Context.None],
    ['({foo: true / false});', Context.None],
    ['({ x: x } = a);', Context.None],
    ['({ x } = a);', Context.None],
    ['({ x = 123 } = a);', Context.None],
    [
      `({
      a,
      a:a,
      a:a=a,
      [a]:{a},
      a:some_call()[a],
      a:this.a
  } = 0);`,
      Context.None,
    ],
    ['new c(x)(y)', Context.None],
    ['"use strict"; ({ x: a, x: b } = q);', Context.None],
    ['({ x: y.z } = a)', Context.None],
    ['({ x: (y) } = a);', Context.None],
    ['[((((a)))), b] = [];', Context.None],
    ['[...{a: b}.c] = []', Context.None],
    ['[(a), b] = [];', Context.None],
    ['(await = "foo")', Context.None],
    ['"use strict"; (await = "foo")', Context.None],
    ['({a:(b) = c})', Context.None],
    ['({a:(b) = 0} = 1)', Context.None],
    ['({a:(b) = c} = 1)', Context.None],
    ['(x, y, ...z) => foo', Context.None],
    ['({ a: (b) } = {})', Context.None],
    ['(async)=2', Context.None],
    ['({200:exp})', Context.None],
    ['({*ident(){}})', Context.None],
    ['({*[expr](){}})', Context.None],
    ['({[expr]:expr})', Context.None],
    ['({*20(){}})', Context.None],
    ['({[foo]: x} = y)', Context.None],
    ['({[x]: y}) => z;', Context.None],
    ['x=x=x', Context.None],
    ['({"a b c": bar})', Context.None],
    ['({[foo]: bar} = baz)', Context.OptionsLoc],
    ['(async ());', Context.None],
    ['( () => x )', Context.None],
    ['(x.foo = y)', Context.None],
    ['(typeof x)', Context.None],
    ['(true)', Context.None],
    ['(...[destruct]) => x', Context.None],
    ['(...{destruct}) => x', Context.None],
    ['async(...ident) => x', Context.None],
    [' async(...[destruct]) => x', Context.None],
    ['async(...{destruct}) => x', Context.None],
    ['([a]) => b;', Context.None],
    ['([a] = b) => c;', Context.None],
    ['([a=[b.c]=d]) => e;', Context.None],
    ['[{x: y.z}]', Context.None],
    ['[{x: y.z}] = a', Context.None],
    ['(x + foo)', Context.OptionsLoc],
    ['(delete /a/g.x);', Context.OptionsLoc],
    ['(delete /a/.x);', Context.None],
    ['(...x) => x', Context.None],
    ['async("foo".bar);', Context.None],
    ['(foo.x)', Context.None],
    ['async ({x=z}, y) => x;', Context.None],
    ['async (foo = yield) => foo', Context.None],
    ['async (foo = yield)', Context.None],
    ['function *f(){ async (foo = yield) }', Context.None],
    ['function *f(){ async (foo = yield x) }', Context.None],
    ['async (yield) => foo', Context.None],
    ['async(x) => y', Context.None],
    ['(foo[x])', Context.None],
    ['(foo) += 3', Context.None],
    ['async(a);', Context.None],
    ['async (...x) => x', Context.None],
    ['(x.foo)', Context.None],

    ['delete ((foo) => foo)', Context.None],
    ['({a} + foo)', Context.None],
    ['([a = b].foo = x)', Context.None],
    ['([x].foo) = x', Context.None],
    ['([x].foo)', Context.None],
    ['({[foo]: bar}) => baz', Context.None],
    ['({*"str"(){}})', Context.None],
    ['({*15(){}})', Context.None],
    ['({x, ...y}) => x', Context.None],
    ['({...x.y} = z) ', Context.None],
    ['(z = {...x.y}) => z', Context.None],
    ['({...x=y});', Context.None],
    ['({...x+=y});', Context.None],
    ['({...x+y});', Context.None],
    ['({...x, ...y});', Context.None],
    ['({...x, y});', Context.None],

    ['([...x]) => x', Context.None],
    ['([...x]);', Context.None],
    ['(z = [...x.y] = z) => z', Context.None],
    ['(z = [...x.y]) => z', Context.None],
    ['([...x+y]);', Context.None],
    ['([...x]);', Context.None],
    ['([...x=y]);', Context.None],
    ['(0, a)', Context.None],
    ['(a, 0)', Context.None],
    ['(a,a)', Context.None],
    ['((a,a),(a,a))', Context.None],
    ['((((((((((((((((((((((((((((((((((((((((a))))))))))))))))))))))))))))))))))))))))', Context.None],
    ['({ x : y } = z = {});', Context.None],

    ['({ x : foo()[y] } = z = {});', Context.None],
    ['({ x : { foo: foo().y } });', Context.None],
    ['({a} = b,) => {}', Context.None],
    ['([x] = y,) => {}', Context.None],
    ['({a},) => {}', Context.None],
    ['([x],) => {}', Context.None],
    ['({[x]:y} = z);', Context.None],
    ['(a) = 1;', Context.None],
    ['({x} = y);', Context.None],
    ['({[x]:y});', Context.None],
    ['([ foo()[x] = 10 ] = z = {});', Context.None],
    ['([ x.y = 10 ] = z = {});', Context.None],
    ['([ x[y] = 10 ] = z = {});', Context.None],
    ['([ [ foo().x = 10 ] = {} ] = z = {});', Context.None],
    ['([ foo()[x] = 10 ] = z = {});', Context.None],
    ['([ [ foo().x = 10 ] = {} ] = z = {});', Context.None],
    ['({x = 42, y = 15} = z = {});', Context.None],
    ['([(x),,(y)] = z = {});', Context.None],
    ['([(x)] = z = {});', Context.None],
    ['([...x, ...y]);', Context.None],
    ['([...x, y]);', Context.None],
    ['([...x+y]); ', Context.None],
    ['([...x+=y]);', Context.None],
    ['([...x=y]); ', Context.None],
    ['({[foo()] : z} = z = {});', Context.None],
    ['({[foo()] : (z)} = z = {});', Context.None],
    ['({[foo()] : foo().bar} = z = {});', Context.None],
    ['([x,,...z] = z = {});', Context.None],
    ['({x: ((y, z) => z)["x"]} = z = {});', Context.None],
    ['([(({ x } = { x: 1 }) => x).a] = z = {});', Context.None],
    ['([ ...(a) ] = z = {});', Context.None],
    ['([ (foo.bar) ] = z = {});', Context.None],
    ['(foo)', Context.None],

    ['(1)', Context.None],
    ['("a")', Context.None],
    ['("a","b","c","d","e","f")', Context.None],
    ['[(a)] = 0', Context.None],
    ['([...x.y] = z)', Context.None],
    ['async("foo".bar);', Context.OptionsRanges],
    ['(a = b)', Context.OptionsRanges],
    ['((x));', Context.OptionsRanges],
    ['((((((((((x))))))))));', Context.OptionsRanges],
    ['(a, b);', Context.OptionsRanges],
    ['(a = 1, b = 2);', Context.OptionsRanges],
    ['(a) = 1;', Context.OptionsRanges],
    ['(a.b) = 1;', Context.OptionsRanges],
    ['(a[b]) = 1;', Context.OptionsRanges],
    ['(a.b().c().d) = 1;', Context.OptionsRanges],
    ['(this.a) = 1;', Context.OptionsRanges],
    ['(this[b]) = 1;', Context.OptionsRanges],
    ['[x, y] = z;', Context.None],
    ['([x, y] = z);', Context.OptionsRanges],
    ['([[x, y] = z]);', Context.OptionsRanges],
    ['(a) += 1;', Context.None],
    ['(a.b) += 1;', Context.None],
    ['(a[b]) += 1;', Context.None],
    ['(a.b().c().d) += 1;', Context.OptionsRanges],
    ['(this.a) += 1;', Context.None],
    ['(this[b]) += 1;', Context.None],
    ['({});', Context.None],
    ['(a / b);', Context.None],
    ['([delete foo.bar]);', Context.None],
    ['([{}]);', Context.None],
    ['(++x);', Context.None],
    ['(++x, y);', Context.None],
    ['(x--);', Context.None],
    ['(x--, y);', Context.None],
    ['([].x);', Context.None],
    ['({} + 1);', Context.None],
    ['(x + y) >= z', Context.None],
    ['(x + y) <= z', Context.None],
    ['(x + y) != z', Context.None],
    ['(x + y) == z', Context.None],
    ['(x) / y', Context.None],
    ['([a.b] = x);', Context.OptionsRanges],
    ['([target()[targetKey()]] = x);', Context.OptionsRanges],
    ['([target()[targetKey(a=b)]] = x);', Context.OptionsRanges],
    ['([].length) = y', Context.OptionsRanges],
    ['([x].length) = y', Context.OptionsRanges],
    ['({}.length) = z', Context.OptionsRanges],
    ['({x: y}.length) = z', Context.OptionsRanges],
    ['({x});', Context.OptionsRanges],
    ['({x} = y);', Context.OptionsRanges],
    ['({[x]:y});', Context.OptionsRanges],
    [String.raw`(++/[^\x0f+-\x6d+$-)-]/giuy[(0[true] = {})])`, Context.None],
    ['({[x]:y} = z);', Context.OptionsRanges],
    ['({[x](){}});', Context.OptionsRanges],
    ['({ident: [foo, bar].join("")})', Context.OptionsRanges],
    ['({ident: [foo, bar] + x})', Context.OptionsRanges],
    ['({ident: {x: y}})', Context.OptionsRanges],
    ['({ident: {x}})', Context.OptionsRanges],
    ['({ident: {x: y}.join("")})', Context.OptionsRanges],
    ['({ident: {x:y}/x})', Context.OptionsRanges],
    ['({ident: {x:y}/x/g})', Context.OptionsRanges],
    ['(a / b);', Context.OptionsRanges],
    ['(delete foo.bar);', Context.OptionsRanges],
    ['([delete foo.bar]);', Context.OptionsRanges],
    ['([a / b]);', Context.OptionsRanges],
    ['(x--);', Context.OptionsRanges],
    ['(x--, y);', Context.OptionsRanges],
    ['(x + y) >= z', Context.OptionsRanges],
    ['(x + y) <= z', Context.OptionsRanges],
    ['(x + y) != z', Context.None],
    ['(x + y) == z', Context.OptionsRanges],
    ['(true)', Context.OptionsRanges],

    ['(foo + (bar + boo) + ding)', Context.OptionsRanges],
    ['[(a)] = 0', Context.OptionsRanges],
    ['[(a) = 0] = 1', Context.OptionsRanges],
    ['[(a.b)] = 0', Context.OptionsRanges],
    ['({a:(b)} = 0)', Context.OptionsRanges],
    ['({a:(b.c)} = 0)', Context.OptionsRanges],
    ['({a:(b = 0)})', Context.OptionsRanges],
    ['c = ({b} = b);', Context.OptionsRanges],
    ['({b} = b);', Context.OptionsRanges],
    ['([b] = b);', Context.OptionsRanges],
    ['({a, b} = {a: 1, b: 2});', Context.OptionsRanges],
    ['[a, b] = [1, 2]', Context.None],
    ['({ responseText: text } = res)', Context.OptionsRanges],
    ['(a) = {}', Context.OptionsRanges],
    ['(a.b) = {}', Context.None],
    ['test = { a: 1 }', Context.OptionsRanges],
    ['(f().a) = 1;', Context.OptionsRanges],
    ['(obj[0]) = 1;', Context.OptionsRanges],
    ['(obj.a) = 1;', Context.OptionsRanges],
    ['({a:((((a1))))} = {a:20})', Context.OptionsRanges],
    ['({a:a1 = r1 = 44} = {})', Context.OptionsRanges],
    ['({a:a1 = r1} = {})', Context.OptionsRanges],
    ['[...{a}] = [{}]', Context.OptionsRanges],
    ['({x:z = 1, x1:y = 20} = {});', Context.OptionsRanges],
    ['({ x } = { x: 3 });', Context.OptionsRanges],
    ['[{x:x, y:y}, [a,b,c]]', Context.OptionsRanges],

    ['[x.a=a] = 0', Context.OptionsRanges],

    ['({ x = 10 } = {});', Context.None],
    ['({ q } = { x = 10 } = {});', Context.OptionsRanges],
    ['(true ? { x = true } = {} : { x = false } = {})', Context.OptionsRanges],
    ['(q, { x = 10 } = {});', Context.None],
    ['function a(a = b += 1, c = d +=1) {}', Context.OptionsRanges],
    ['[...z = 1]', Context.OptionsRanges],
    /* ['[x, y, ...[z] = [1]]', Context.None, {
      "type": "Program",
      "sourceType": "script",
      "body": [
        {
          "type": "ExpressionStatement",
          "expression": {
            "type": "ArrayExpression",
            "elements": [
              {
                "type": "Identifier",
                "name": "x"
              },
              {
                "type": "Identifier",
                "name": "y"
              },
              {
                "type": "SpreadElement",
                "argument": {
                  "type": "AssignmentExpression",
                  "left": {
                    "type": "ArrayPattern",
                    "elements": [
                      {
                        "type": "Identifier",
                        "name": "z"
                      }
                    ]
                  },
                  "operator": "=",
                  "right": {
                    "type": "ArrayExpression",
                    "elements": [
                      {
                        "type": "Literal",
                        "value": 1
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      ]
    }],*/
    ['[x, {y = 1}] = [0, {}]', Context.OptionsRanges],
    ['[x, {y = 1}] = [0, {}]', Context.OptionsRanges],
    ['function x([ a, b ]){}', Context.None],
    ['a0({});', Context.OptionsRanges],
    ['(a) = 0', Context.None],
    ['({ a: 1 }).a === 1', Context.OptionsRanges],
    ['[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};', Context.OptionsRanges | Context.OptionsRaw],
    ['f = (argument1, [a,b,c])', Context.OptionsRanges],
    ['f = (argument1, { x : x, y : y = 42 })', Context.OptionsRanges],
    ['f = (argument1, [{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]])', Context.OptionsRanges | Context.OptionsRaw],
    ['(argument1, [a,b,...rest])', Context.OptionsRanges],
    ['f = ( {[x] : z} )', Context.OptionsRanges],
    ['f(argument1, [...rest])', Context.None],
    ['(0, "b", x);', Context.OptionsRanges],
    ['(a, b, c, 1, 2, 3);', Context.OptionsRanges],
    ['(a,1,3,b,c,3);', Context.None],
    ['(1, a, b);', Context.None],
    ['(a, 1, b);', Context.None],
    [
      `var a;
    (a) = {};
    (a.b) = {};
    (a['c']) = {};`,
      Context.OptionsRanges,
    ],
    ['(x)', Context.OptionsRanges | Context.OptionsLoc],
    ['(x)', Context.OptionsPreserveParens | Context.OptionsRanges | Context.OptionsLoc],
    ['(a,[b]=c)', Context.OptionsRanges | Context.OptionsLoc],
    ['(a,[b]=c)', Context.OptionsPreserveParens | Context.OptionsRanges | Context.OptionsLoc],
  ]);
});
