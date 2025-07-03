import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

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
        parseSource(`(${arg}) = foo`);
      });
    });
    it(`use strict"; '(${arg}) = foo'`, () => {
      t.throws(() => {
        parseSource(`use strict"; (${arg}) = foo`);
      });
    });
    it(`foo = { get x(){  "use strict"; ( ${arg} = "sentinal 79845134");   }}`, () => {
      t.throws(() => {
        parseSource(`foo = { get x(){  "use strict"; ( ${arg} = "sentinal 79845134");   }}`);
      });
    });

    it(`should fail on '(${arg} = foo )'`, () => {
      t.throws(() => {
        parseSource(`(${arg} = foo)`, { impliedStrict: true });
      });
    });

    it(`should fail on '(${arg} = foo )'`, () => {
      t.throws(() => {
        parseSource(`(${arg} = foo)`, { next: true, webcompat: true });
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
        parseSource(`${arg}`, { preserveParens: true }, Context.Strict);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { preserveParens: true }, Context.Strict);
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
        parseSource(`(${arg} = foo)`, { impliedStrict: true });
      });
    });
    it(`"use strict"; '(${arg} = foo )'`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (${arg} = foo)`, { webcompat: true });
      });
    });

    it(`x = { get x() { "use strict"; ${arg} = foo } }'`, () => {
      t.throws(() => {
        parseSource(`x = { get x() { "use strict"; (${arg} = foo} }`, { webcompat: true });
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
        parseSource(`(${arg})=> y`);
      });
    });

    it(`"use strict"; '(${arg})=> y'`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (${arg})=> y`);
      });
    });

    it(`should fail on '(${arg})=> y'`, () => {
      t.throws(() => {
        parseSource(`(${arg})=> y`, { webcompat: true });
      });
    });

    it(`should fail on '(${arg})=> y'`, () => {
      t.throws(() => {
        parseSource(`(${arg})=> y`, { sourceType: 'module' });
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
        parseSource(`${arg}`);
      });
    });

    it(`should fail on '${arg}'`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`"use strict"; '${arg}'`, () => {
      t.throws(() => {
        parseSource(`"use strict";${arg}`);
      });
    });

    it(`"use strict"; '${arg}'`, () => {
      t.throws(() => {
        parseSource(`"use strict";${arg}`, { lexical: true });
      });
    });

    it(`should fail on '${arg}'`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });

    it(`function foo() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function foo() { ${arg} }`);
      });
    });
  }

  fail('Expressions - Group (fail)', [
    '(1) = x',
    '("a") = "b"',
    '([a]) = x',
    '({a}) = 1',
    '{a, b} = {a: 1, b: 2}',
    '({a, b}) = {a: 1, b:2};',
    '({b}) = b;',
    '([b]) = b;',
    '({a}) = 2;',
    '([b]) = b;',
    '[(a = 0)] = 1',
    '[[1]] = [];',
    'x, {a: {a: 1} = []};',
    '({a: 1} = []);',
    '(...{a: b}.c = [])',
    'x, [foo + y, bar] = doo;',
    '([x, y]) = z;',
    '{x, y} = z;',
    '({x, y}) = z;',
    '(x={"y": await z}) => t',
    '(x={200: await z}) => t',
    '({[x](){}} = z);',
    '(a \n/b/);',
    '([a \n/b/]);',
    '( ({x: 1}) ) => {};',
    '( (x) ) => {}',
    '( ({x: 1}) = y ) => {}',
    '( (x) = y ) => {}',
    'let [({x: 1})] = [];',
    'let [({x: 1}) = y] = [];',
    'var [({x: 1})] = [];',
    'var [({x: 1}) = y] = [];',
    '[({x: 1}) = y] = [];',
    '({a,b}) = {a:2,b:3}',
    '(...);',
    '(...x);',
    '({x, y}) = {}',
    '({ obj:20 }) = 42',
    '( { get x() {} } = 0)',
    '(a, (b)) => 42',
    '([...{a = b} = c]) => d;',
    '([[].length]) => x;',
    '()',
    '();',
    '(...[a])',
    '(...[a],)',
    '(...[a]) => ',
    'a = (...[a])',
    'a = (...[a]) =',
    'a = (...[a]) =',
    'a = (...[a]) = a',
    'a (...[a]) = a',
    '(...[a]) = a',
    '(...[a]a) = a',
    '(...[a) = a',
    '(...a) = a',
    '(a,b)=(c,d);',
    '({a = 0});',
    '({a} += 0);',
    '({a,,} = 0)',
    '({,a,} = 0)',
    '({a, ...b, c} = {})',
    '({a = 5})',
    '({ ...{a} } = {})',
    '({b, c, d, ...{a} } = {})',
    '({a,,a} = 0)',
    '({function} = 0)',
    '({a:function} = 0)',
    '({a:for} = 0)',
    '({*=f(){}})',
    '({**f(){}})',
    '({**=f(){}})',
    '({async *=f(){}})',
    '({async **=f(){}})',
    '({a: b += 0} = {})',
    '[a += b] = []',
    '({"a"} = 0)',
    '"use strict"; (arguments = a)',
    '"use strict"; (arguments = a) => {}',
    '"use strict"; (arguments) => {}',
    '"use strict"; (a, arguments) => {}',
    '({var} = 0)',
    '({a.b} = 0)',
    '({0} = 0)',
    '(a=1)=2',
    '(a=1)+=2',
    '({x})=y',
    '(a,b)=2',
    '(a,b)+=2',
    '({ (x = yield) = {}; })',
    '([a + b] = x);',
    'async([].x) => x;',
    'async ({} + 1) => x;',
    '(a, b) = c',
    '(++x) => x;',
    '(++x, y) => x',
    '(x--) => x;',
    '({get p(...[]) {}})',
    '({set p(...[]) {}})',
    '(x--, y) => x;',
    '...x => x',
    'y, ...x => x',
    '({x:{1:y()=x},x:{7:3}})>x',
    '({[foo]() {}} = y)',
    '0, {a = 0}) => 0',
    '({a = 0}, {a = 0}, 0) => 0',
    '(0, {a = 0}) = 0',
    'async (a, ...b=fail) => a;',
    'async (foo = yield x)',
    'async (foo = yield x) => foo',
    '(x = y) = z; ',
    '(x, ...y, z) => x',
    '(x, ...y, z) => x',
    '(...x, y) => x',
    '(...x = y) => x',
    '([...x.y]) => z',
    '([a + b] = x) => a;',
    '([...a.b]) => c',
    '({ident: [foo, bar].join("")}) => x',
    '({ident: [foo, bar]/x}) => x',
    '({ident: [foo, bar]/x/g}) => x',
    '({ident: {x}.join("")}) => x',
    '({ident: {x}/x}) => x',
    '({ident: {x}/x/g}) => x',
    '(/x/) => x',
    '(/x/) => x',
    '(x, /x/g) => x',
    '(x, /x/g) => x',
    '(a=/i/) = /i/',
    '(x => y) = {}',
    '({x = y})',
    '({x = y}.z)',
    '({x = y}.z = obj)',
    '({x = y}.z) => obj',
    '({x = y}).z',
    '([{x = y}])',
    '([{x = y}].z)',
    '([{x = y}].z = obj)',
    '([{x = y}.z])',
    '([{x = y}.z] = obj)',
    '([{x = y}].z) => obj',
    '([{x = y}]).z',
    '[{x = y}]',
    '([{x = y}.z])',
    '(([x])=y in z);',
    '[{x = y}] in z',
    'for (([x])=y in z);',
    'for ([{x = y}] ;;);',
    '[{x = y}].z',
    '[{x = y}].z = obj',
    '[{x = y}].z = "obj"',
    '[{"x" = y}].z = obj',
    '[{x = "y"}].z = obj',
    '[{x = y}.z] = obj',
    '[{x = y}].z => obj',
    '({a: {x = y}})',
    '({a: {x = y}}.z)',
    '({a: {x = y}.z})',
    '({a: {x = y}}.z = obj)',
    '({a: {x = y}}.z) => obj',
    '({a: {x = y}}).z',
    '({a: {x = "y"}}).z',
    '(async x => y) = {}',
    '((x, z) => y) = {}',
    '(async (x, z) => y) = {}',
    'async("foo".bar) => x',
    '(...rest - a) => b',
    '(a, ...b - 10) => b',
    "(c, a['b']) => {}",
    '([x.y = a] = (...z))',
    "'(...(...z))",
    '((...z))',
    "'(...(...1))",
    "((...'z'))",
    "'(...(...('z'))",
    '([...[[][][]] = x);',
    '([...a, ,] = [...a, ,])',
    "(c, a['b']) => {}",
    '(...a = b) => b',
    '(-a, b) => {}',
    '(a, -b) => {}',
    '(x) = (1) = z',
    '(1) = x',
    'y = (1) = x',
    '(y) = (1) = x',
    '(1) = y = x',
    '(1) = (y) = x',
    '({a: 1 = x })',
    '({a: (1) = x })',
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
    '(c, a.b) => {}',
    '(x = x) = x;',
    '([[[[[[[[[[[[[[[[[[[[{a:b[0]}]]]]]]]]]]]]]]]]]]]])=>0',
    '([{a:b[0]}])=>0',
    '({a:b[0]})=>0',
    '([x]++)',
    '(..., x)',
    { code: '(x = (await) = f) => {}', options: { sourceType: 'module' } },
    'async (x = (await) = f) => {}',
    // ['(x = delete ((await) = f)) => {}', Context.Strict],
    'function *f(){ yield = 1; }',
    { code: '(yield) = 1;', options: { impliedStrict: true } },
    'function *f(){ (yield) = 1; }',
    { code: '(x = (yield) = f) => {}', options: { impliedStrict: true } },
    'function *f(x = (yield) = f) {}',
    { code: '(x = delete ((yield) = f)) => {}', options: { impliedStrict: true } },
    'function *f(x = delete ((yield) = f)) {}',
    '(x={a:await f})=>x',
    '({x: 15.foo} = x)',
    '({x: 15.foo()} = x)',
    'x = {x: 15.foo} = x',
    'x = {x: 15.foo()} = x',
    '((x={15: (await foo)}) => x',
    '(x, ...);',
    '({ident: [foo, bar] += x})',
    '({ident: [foo, bar] += x})',
    '({...{x} }) => {}',
    '({...(x) }) => {}',
    '({...[x] }) => {}',
    { code: '(await) = 1', options: { sourceType: 'module' } },
    'x = ({}) = b',
    '32 => {}',
    '(32) => {}',
    '(a, 32) => {}',
    'if => {}',
    '(if) => {}',
    '(a, if) => {}',
    'a + b => {}',
    '(a + b) => {}',
    '(a + b, c) => {}',
    '=> 0',
    '=>',
    '=> {}',
    ') => {}',
    ', => {}',
    '(,) => {}',
    '(...x);',
    'return => {}',
    '({"foo": [x].foo()}=y);',
    '({15: 15.foo()}=x)',
    '({15: 15.foo}=x)',
    '(()) => 0',
    '((x)) => 0',
    '((x, y)) => 0',
    '(x, (y)) => 0',
    '((x, y, z)) => 0',
    '(x, (y, z)) => 0',
    '((x, y), z) => 0',
    '({[foo]: bar()} = baz)',
    '({[foo]: a + b} = baz)',
    '({[foo]: bar()}) => baz',
    '({[foo]: a + b}) => baz',
    'async("foo".bar) => x',
    '({...x.y} = z) => z',
    '({...x.y}) => z',
    '((x, y), z) => 0',
    '({*set x(){}})',
    '({*ident: x})',
    '({*ident x(){}})',
    'var {(a)} = 0',
    '({(a)} = 0)',
    '({a:(b = 0)} = 1)',
    'var {a:(b)} = 0',
    '({ x: f() } = a);',
    '({ x: new f } = a);',
    '"use strict"; ({ arguments } = a);',
    '({ if } = a);',
    '({ x = 123 });',
    '({ x: x }) = a;',
    '()',
    '()\n',
    '()\n=>',
    '()\n=>a',
    '([x.y]=z) => z',
    '({ a: (a = d) } = {})',
    '([x]=await y)=>z',
    '(({x:y}) += x)',
    '({foo: {x:y} += x})',
    '({x:y} += x)',
    '([x]=await y)=>z',
    '({foo: {}.bar() + x} = x)',
    '({foo: {}.bar()} = x)',
    '({foo: {} += x})',
    '({a:(a,y) = 0} = 1)',
    '({a:this}=0)',
    '({a: this} = 0);',
    '({get a(){}})=0',
    '({x}) = {x: 1};',
    '([a]) = []',
    '([a.a]) => 42',
    '-(5) ** 6;',
    '([a]) = 0',
    '({a}) = 0',
    '(a = b)++;',
    '(a = b) = c;',
    '`a`++;',
    '`a` = b;',
    '(`a`) => b;',
    'for (`a` of b);',
    'for (new.target in b);',
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
    outdent`
      ({
          a,
          a:a,
          a:a=a,
          [a]:{a},
          a:some_call()[a],
          a:this.a
      } = 0);
    `,
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
      code: outdent`
        var a;
        (a) = {};
        (a.b) = {};
        (a['c']) = {};
      `,
      options: { ranges: true },
    },
    { code: '(x)', options: { ranges: true, loc: true } },
    { code: '(x)', options: { preserveParens: true, ranges: true, loc: true } },
    { code: '(a,[b]=c)', options: { ranges: true, loc: true } },
    { code: '(a,[b]=c)', options: { preserveParens: true, ranges: true, loc: true } },
  ]);
});
