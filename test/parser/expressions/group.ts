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
    '(1) + (2  ) + 3',
    '((((((((((((((((((((((((((((((((((((((((((((((((((0))))))))))))))))))))))))))))))))))))))))))))))))))',
    '({a: {x = y}} = z)',
    '({a: {x = y}}) => z',
    '4 + 5 << (6)',
    '(a) + (b)',
    '((a))()',
    '(x, /y/);',
    '((a))((a))',
    '((a)) = 0',
    '"use strict"; (await) = 1',
    '(a) = 0',
    'void (a)',
    '(a)++',
    '(a)--',
    '(a) ? (b) : (c)',
    '(a++)',
    '(void a)',
    '({Foo} = {});',
    '({foo, bar} = {foo: 0, bar: 1});',
    '({} = 0);',
    '({foo: true / false});',
    '({ x: x } = a);',
    '({ x } = a);',
    '({ x = 123 } = a);',
    `({
      a,
      a:a,
      a:a=a,
      [a]:{a},
      a:some_call()[a],
      a:this.a
  } = 0);`,
    'new c(x)(y)',
    '"use strict"; ({ x: a, x: b } = q);',
    '({ x: y.z } = a)',
    '({ x: (y) } = a);',
    '[((((a)))), b] = [];',
    '[...{a: b}.c] = []',
    '[(a), b] = [];',
    '(await = "foo")',
    '"use strict"; (await = "foo")',
    '({a:(b) = c})',
    '({a:(b) = 0} = 1)',
    '({a:(b) = c} = 1)',
    '(x, y, ...z) => foo',
    '({ a: (b) } = {})',
    '(async)=2',
    '({200:exp})',
    '({*ident(){}})',
    '({*[expr](){}})',
    '({[expr]:expr})',
    '({*20(){}})',
    '({[foo]: x} = y)',
    '({[x]: y}) => z;',
    'x=x=x',
    '({"a b c": bar})',
    { code: '({[foo]: bar} = baz)', options: { loc: true } },
    '(async ());',
    '( () => x )',
    '(x.foo = y)',
    '(typeof x)',
    '(true)',
    '(...[destruct]) => x',
    '(...{destruct}) => x',
    'async(...ident) => x',
    ' async(...[destruct]) => x',
    'async(...{destruct}) => x',
    '([a]) => b;',
    '([a] = b) => c;',
    '([a=[b.c]=d]) => e;',
    '[{x: y.z}]',
    '[{x: y.z}] = a',
    { code: '(x + foo)', options: { loc: true } },
    { code: '(delete /a/g.x);', options: { loc: true } },
    '(delete /a/.x);',
    '(...x) => x',
    'async("foo".bar);',
    '(foo.x)',
    'async ({x=z}, y) => x;',
    'async (foo = yield) => foo',
    'async (foo = yield)',
    'function *f(){ async (foo = yield) }',
    'function *f(){ async (foo = yield x) }',
    'async (yield) => foo',
    'async(x) => y',
    '(foo[x])',
    '(foo) += 3',
    'async(a);',
    'async (...x) => x',
    '(x.foo)',

    'delete ((foo) => foo)',
    '({a} + foo)',
    '([a = b].foo = x)',
    '([x].foo) = x',
    '([x].foo)',
    '({[foo]: bar}) => baz',
    '({*"str"(){}})',
    '({*15(){}})',
    '({x, ...y}) => x',
    '({...x.y} = z) ',
    '(z = {...x.y}) => z',
    '({...x=y});',
    '({...x+=y});',
    '({...x+y});',
    '({...x, ...y});',
    '({...x, y});',

    '([...x]) => x',
    '([...x]);',
    '(z = [...x.y] = z) => z',
    '(z = [...x.y]) => z',
    '([...x+y]);',
    '([...x]);',
    '([...x=y]);',
    '(0, a)',
    '(a, 0)',
    '(a,a)',
    '((a,a),(a,a))',
    '((((((((((((((((((((((((((((((((((((((((a))))))))))))))))))))))))))))))))))))))))',
    '({ x : y } = z = {});',

    '({ x : foo()[y] } = z = {});',
    '({ x : { foo: foo().y } });',
    '({a} = b,) => {}',
    '([x] = y,) => {}',
    '({a},) => {}',
    '([x],) => {}',
    '({[x]:y} = z);',
    '(a) = 1;',
    '({x} = y);',
    '({[x]:y});',
    '([ foo()[x] = 10 ] = z = {});',
    '([ x.y = 10 ] = z = {});',
    '([ x[y] = 10 ] = z = {});',
    '([ [ foo().x = 10 ] = {} ] = z = {});',
    '([ foo()[x] = 10 ] = z = {});',
    '([ [ foo().x = 10 ] = {} ] = z = {});',
    '({x = 42, y = 15} = z = {});',
    '([(x),,(y)] = z = {});',
    '([(x)] = z = {});',
    '([...x, ...y]);',
    '([...x, y]);',
    '([...x+y]); ',
    '([...x+=y]);',
    '([...x=y]); ',
    '({[foo()] : z} = z = {});',
    '({[foo()] : (z)} = z = {});',
    '({[foo()] : foo().bar} = z = {});',
    '([x,,...z] = z = {});',
    '({x: ((y, z) => z)["x"]} = z = {});',
    '([(({ x } = { x: 1 }) => x).a] = z = {});',
    '([ ...(a) ] = z = {});',
    '([ (foo.bar) ] = z = {});',
    '(foo)',

    '(1)',
    '("a")',
    '("a","b","c","d","e","f")',
    '[(a)] = 0',
    '([...x.y] = z)',
    { code: 'async("foo".bar);', options: { ranges: true } },
    { code: '(a = b)', options: { ranges: true } },
    { code: '((x));', options: { ranges: true } },
    { code: '((((((((((x))))))))));', options: { ranges: true } },
    { code: '(a, b);', options: { ranges: true } },
    { code: '(a = 1, b = 2);', options: { ranges: true } },
    { code: '(a) = 1;', options: { ranges: true } },
    { code: '(a.b) = 1;', options: { ranges: true } },
    { code: '(a[b]) = 1;', options: { ranges: true } },
    { code: '(a.b().c().d) = 1;', options: { ranges: true } },
    { code: '(this.a) = 1;', options: { ranges: true } },
    { code: '(this[b]) = 1;', options: { ranges: true } },
    '[x, y] = z;',
    { code: '([x, y] = z);', options: { ranges: true } },
    { code: '([[x, y] = z]);', options: { ranges: true } },
    '(a) += 1;',
    '(a.b) += 1;',
    '(a[b]) += 1;',
    { code: '(a.b().c().d) += 1;', options: { ranges: true } },
    '(this.a) += 1;',
    '(this[b]) += 1;',
    '({});',
    '(a / b);',
    '([delete foo.bar]);',
    '([{}]);',
    '(++x);',
    '(++x, y);',
    '(x--);',
    '(x--, y);',
    '([].x);',
    '({} + 1);',
    '(x + y) >= z',
    '(x + y) <= z',
    '(x + y) != z',
    '(x + y) == z',
    '(x) / y',
    { code: '([a.b] = x);', options: { ranges: true } },
    { code: '([target()[targetKey()]] = x);', options: { ranges: true } },
    { code: '([target()[targetKey(a=b)]] = x);', options: { ranges: true } },
    { code: '([].length) = y', options: { ranges: true } },
    { code: '([x].length) = y', options: { ranges: true } },
    { code: '({}.length) = z', options: { ranges: true } },
    { code: '({x: y}.length) = z', options: { ranges: true } },
    { code: '({x});', options: { ranges: true } },
    { code: '({x} = y);', options: { ranges: true } },
    { code: '({[x]:y});', options: { ranges: true } },
    String.raw`(++/[^\x0f+-\x6d+$-)-]/giuy[(0[true] = {})])`,
    { code: '({[x]:y} = z);', options: { ranges: true } },
    { code: '({[x](){}});', options: { ranges: true } },
    { code: '({ident: [foo, bar].join("")})', options: { ranges: true } },
    { code: '({ident: [foo, bar] + x})', options: { ranges: true } },
    { code: '({ident: {x: y}})', options: { ranges: true } },
    { code: '({ident: {x}})', options: { ranges: true } },
    { code: '({ident: {x: y}.join("")})', options: { ranges: true } },
    { code: '({ident: {x:y}/x})', options: { ranges: true } },
    { code: '({ident: {x:y}/x/g})', options: { ranges: true } },
    { code: '(a / b);', options: { ranges: true } },
    { code: '(delete foo.bar);', options: { ranges: true } },
    { code: '([delete foo.bar]);', options: { ranges: true } },
    { code: '([a / b]);', options: { ranges: true } },
    { code: '(x--);', options: { ranges: true } },
    { code: '(x--, y);', options: { ranges: true } },
    { code: '(x + y) >= z', options: { ranges: true } },
    { code: '(x + y) <= z', options: { ranges: true } },
    '(x + y) != z',
    { code: '(x + y) == z', options: { ranges: true } },
    { code: '(true)', options: { ranges: true } },

    { code: '(foo + (bar + boo) + ding)', options: { ranges: true } },
    { code: '[(a)] = 0', options: { ranges: true } },
    { code: '[(a) = 0] = 1', options: { ranges: true } },
    { code: '[(a.b)] = 0', options: { ranges: true } },
    { code: '({a:(b)} = 0)', options: { ranges: true } },
    { code: '({a:(b.c)} = 0)', options: { ranges: true } },
    { code: '({a:(b = 0)})', options: { ranges: true } },
    { code: 'c = ({b} = b);', options: { ranges: true } },
    { code: '({b} = b);', options: { ranges: true } },
    { code: '([b] = b);', options: { ranges: true } },
    { code: '({a, b} = {a: 1, b: 2});', options: { ranges: true } },
    '[a, b] = [1, 2]',
    { code: '({ responseText: text } = res)', options: { ranges: true } },
    { code: '(a) = {}', options: { ranges: true } },
    '(a.b) = {}',
    { code: 'test = { a: 1 }', options: { ranges: true } },
    { code: '(f().a) = 1;', options: { ranges: true } },
    { code: '(obj[0]) = 1;', options: { ranges: true } },
    { code: '(obj.a) = 1;', options: { ranges: true } },
    { code: '({a:((((a1))))} = {a:20})', options: { ranges: true } },
    { code: '({a:a1 = r1 = 44} = {})', options: { ranges: true } },
    { code: '({a:a1 = r1} = {})', options: { ranges: true } },
    { code: '[...{a}] = [{}]', options: { ranges: true } },
    { code: '({x:z = 1, x1:y = 20} = {});', options: { ranges: true } },
    { code: '({ x } = { x: 3 });', options: { ranges: true } },
    { code: '[{x:x, y:y}, [a,b,c]]', options: { ranges: true } },

    { code: '[x.a=a] = 0', options: { ranges: true } },

    '({ x = 10 } = {});',
    { code: '({ q } = { x = 10 } = {});', options: { ranges: true } },
    { code: '(true ? { x = true } = {} : { x = false } = {})', options: { ranges: true } },
    '(q, { x = 10 } = {});',
    { code: 'function a(a = b += 1, c = d +=1) {}', options: { ranges: true } },
    { code: '[...z = 1]', options: { ranges: true } },
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
    { code: '[x, {y = 1}] = [0, {}]', options: { ranges: true } },
    { code: '[x, {y = 1}] = [0, {}]', options: { ranges: true } },
    'function x([ a, b ]){}',
    { code: 'a0({});', options: { ranges: true } },
    '(a) = 0',
    { code: '({ a: 1 }).a === 1', options: { ranges: true } },
    { code: '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};', options: { ranges: true, raw: true } },
    { code: 'f = (argument1, [a,b,c])', options: { ranges: true } },
    { code: 'f = (argument1, { x : x, y : y = 42 })', options: { ranges: true } },
    { code: 'f = (argument1, [{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]])', options: { ranges: true, raw: true } },
    { code: '(argument1, [a,b,...rest])', options: { ranges: true } },
    { code: 'f = ( {[x] : z} )', options: { ranges: true } },
    'f(argument1, [...rest])',
    { code: '(0, "b", x);', options: { ranges: true } },
    { code: '(a, b, c, 1, 2, 3);', options: { ranges: true } },
    '(a,1,3,b,c,3);',
    '(1, a, b);',
    '(a, 1, b);',
    {
      code: `var a;
    (a) = {};
    (a.b) = {};
    (a['c']) = {};`,
      options: { ranges: true },
    },
    { code: '(x)', options: { ranges: true, loc: true } },
    { code: '(x)', options: { preserveParens: true, ranges: true, loc: true } },
    { code: '(a,[b]=c)', options: { ranges: true, loc: true } },
    { code: '(a,[b]=c)', options: { preserveParens: true, ranges: true, loc: true } },
  ]);
});
