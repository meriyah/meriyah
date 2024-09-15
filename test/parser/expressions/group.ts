import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
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
    'false' /*'enum',*/
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
    'foo({[bar](){}, set [zoo](e){}});'
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
    'arguments'
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
    '{x: y}.length'
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
    '(...a = x,) => {}'
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
    ['for (new.target in b);', Context.None]
  ]);

  pass('Expressions - Group (pass)', [
    [
      '(1) + (2  ) + 3',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Literal',
                  value: 1
                },
                right: {
                  type: 'Literal',
                  value: 2
                },
                operator: '+'
              },
              right: {
                type: 'Literal',
                value: 3
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      '((((((((((((((((((((((((((((((((((((((((((((((((((0))))))))))))))))))))))))))))))))))))))))))))))))))',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 0
            }
          }
        ]
      }
    ],
    [
      '({a: {x = y}} = z)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
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
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            right: {
                              type: 'Identifier',
                              name: 'y'
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
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '({a: {x = y}}) => z',
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
                name: 'z'
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
                                type: 'Identifier',
                                name: 'y'
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
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '4 + 5 << (6)',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Literal',
                  value: 4
                },
                right: {
                  type: 'Literal',
                  value: 5
                },
                operator: '+'
              },
              right: {
                type: 'Literal',
                value: 6
              },
              operator: '<<'
            }
          }
        ]
      }
    ],
    [
      '(a) + (b)',
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
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'Identifier',
                name: 'b'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      '((a))()',
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
                name: 'a'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      '(x, /y/);',
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
                  name: 'x'
                },
                {
                  type: 'Literal',
                  value: /y/,
                  regex: {
                    pattern: 'y',
                    flags: ''
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '((a))((a))',
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
                name: 'a'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '((a)) = 0',
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
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '"use strict"; (await) = 1',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict'
            },
            directive: 'use strict'
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'await'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '(a) = 0',
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
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      'void (a)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'void',
              argument: {
                type: 'Identifier',
                name: 'a'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '(a)++',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '++',
              prefix: false
            }
          }
        ]
      }
    ],
    [
      '(a)--',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '--',
              prefix: false
            }
          }
        ]
      }
    ],
    [
      '(a) ? (b) : (c)',
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
                name: 'a'
              },
              consequent: {
                type: 'Identifier',
                name: 'b'
              },
              alternate: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ]
      }
    ],
    [
      '(a++)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '++',
              prefix: false
            }
          }
        ]
      }
    ],
    [
      '(void a)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'void',
              argument: {
                type: 'Identifier',
                name: 'a'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '({Foo} = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'Foo'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'Foo'
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
            }
          }
        ]
      }
    ],
    [
      '({foo, bar} = {foo: 0, bar: 1});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'foo'
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
                      name: 'bar'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'bar'
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
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'Literal',
                      value: 0
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'Literal',
                      value: 1
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({} = 0);',
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
                type: 'ObjectPattern',
                properties: []
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '({foo: true / false});',
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
                    name: 'foo'
                  },
                  value: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: true
                    },
                    right: {
                      type: 'Literal',
                      value: false
                    },
                    operator: '/'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({ x: x } = a);',
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
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'a'
              }
            }
          }
        ]
      }
    ],
    [
      '({ x } = a);',
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
                type: 'Identifier',
                name: 'a'
              }
            }
          }
        ]
      }
    ],
    [
      '({ x = 123 } = a);',
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
                        value: 123
                      }
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
                type: 'Identifier',
                name: 'a'
              }
            }
          }
        ]
      }
    ],
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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
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
                  },
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
                    shorthand: false
                  },
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
                        name: 'a'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
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
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'some_call'
                        },
                        arguments: []
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ThisExpression'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      'new c(x)(y)',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'c'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '"use strict"; ({ x: a, x: b } = q);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict'
            },
            directive: 'use strict'
          },
          {
            type: 'ExpressionStatement',
            expression: {
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
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'q'
              }
            }
          }
        ]
      }
    ],
    [
      '({ x: y.z } = a)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'z'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'a'
              }
            }
          }
        ]
      }
    ],
    [
      '({ x: (y) } = a);',
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
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'a'
              }
            }
          }
        ]
      }
    ],
    [
      '[((((a)))), b] = [];',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: []
              }
            }
          }
        ]
      }
    ],
    [
      '[...{a: b}.c] = []',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'b'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'c'
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: []
              }
            }
          }
        ]
      }
    ],
    [
      '[(a), b] = [];',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: []
              }
            }
          }
        ]
      }
    ],
    [
      '(await = "foo")',
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
                name: 'await'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '"use strict"; (await = "foo")',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict'
            },
            directive: 'use strict'
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'await'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '({a:(b) = c})',
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
                    name: 'a'
                  },
                  value: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'c'
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a:(b) = 0} = 1)',
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
                        name: 'b'
                      },
                      right: {
                        type: 'Literal',
                        value: 0
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '({a:(b) = c} = 1)',
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
                        name: 'b'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'c'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '(x, y, ...z) => foo',
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
                name: 'foo'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                },
                {
                  type: 'RestElement',
                  argument: {
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
      '({ a: (b) } = {})',
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
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '(async)=2',
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
                name: 'async'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 2
              }
            }
          }
        ]
      }
    ],
    [
      '({200:exp})',
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
                    type: 'Literal',
                    value: 200
                  },
                  value: {
                    type: 'Identifier',
                    name: 'exp'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({*ident(){}})',
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
                    name: 'ident'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({*[expr](){}})',
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
                    name: 'expr'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: true,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({[expr]:expr})',
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
                    name: 'expr'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'expr'
                  },
                  kind: 'init',
                  computed: true,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({*20(){}})',
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
                    type: 'Literal',
                    value: 20
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({[foo]: x} = y)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      '({[x]: y}) => z;',
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
                name: 'z'
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
                        type: 'Identifier',
                        name: 'y'
                      },
                      kind: 'init',
                      computed: true,
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
      'x=x=x',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                name: 'x',
                type: 'Identifier'
              },
              operator: '=',
              right: {
                left: {
                  name: 'x',
                  type: 'Identifier'
                },
                operator: '=',
                right: {
                  name: 'x',
                  type: 'Identifier'
                },
                type: 'AssignmentExpression'
              },
              type: 'AssignmentExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '({"a b c": bar})',
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
                    type: 'Literal',
                    value: 'a b c'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({[foo]: bar} = baz)',
      Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo',
                      loc: {
                        start: {
                          line: 1,
                          column: 3
                        },
                        end: {
                          line: 1,
                          column: 6
                        }
                      }
                    },
                    value: {
                      type: 'Identifier',
                      name: 'bar',
                      loc: {
                        start: {
                          line: 1,
                          column: 9
                        },
                        end: {
                          line: 1,
                          column: 12
                        }
                      }
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false,
                    loc: {
                      start: {
                        line: 1,
                        column: 2
                      },
                      end: {
                        line: 1,
                        column: 12
                      }
                    }
                  }
                ],
                loc: {
                  start: {
                    line: 1,
                    column: 1
                  },
                  end: {
                    line: 1,
                    column: 13
                  }
                }
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'baz',
                loc: {
                  start: {
                    line: 1,
                    column: 16
                  },
                  end: {
                    line: 1,
                    column: 19
                  }
                }
              },
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 19
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 20
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 20
          }
        }
      }
    ],
    [
      '(async ());',
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
                name: 'async'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      '( () => x )',
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
              params: [],
              async: false,

              expression: true
            }
          }
        ]
      }
    ],
    [
      '(x.foo = y)',
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
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      '(typeof x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'Identifier',
                name: 'x'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '(true)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: true
            }
          }
        ]
      }
    ],
    [
      '(...[destruct]) => x',
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
                  type: 'RestElement',
                  argument: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'destruct'
                      }
                    ]
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
      '(...{destruct}) => x',
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
                  type: 'RestElement',
                  argument: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'destruct'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'destruct'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
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
      'async(...ident) => x',
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
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'ident'
                  }
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
      ' async(...[destruct]) => x',
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
                  type: 'RestElement',
                  argument: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'destruct'
                      }
                    ]
                  }
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
      'async(...{destruct}) => x',
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
                  type: 'RestElement',
                  argument: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'destruct'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'destruct'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
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
      '([a]) => b;',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'a'
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
      '([a] = b) => c;',
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
                name: 'c'
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
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
      '([a=[b.c]=d]) => e;',
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
                name: 'e'
              },
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'b'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'c'
                              }
                            }
                          ]
                        },
                        operator: '=',
                        right: {
                          type: 'Identifier',
                          name: 'd'
                        }
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
      '[{x: y.z}]',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      value: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'z'
                        }
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
      '[{x: y.z}] = a',
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
                type: 'ArrayPattern',
                elements: [
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
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'z'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'a'
              }
            }
          }
        ]
      }
    ],
    [
      '(x + foo)',
      Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'x',
                loc: {
                  start: {
                    line: 1,
                    column: 1
                  },
                  end: {
                    line: 1,
                    column: 2
                  }
                }
              },
              right: {
                type: 'Identifier',
                name: 'foo',
                loc: {
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 8
                  }
                }
              },
              operator: '+',
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 8
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 9
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 9
          }
        }
      }
    ],
    [
      '(delete /a/g.x);',
      Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Literal',
                  value: /a/g,
                  regex: {
                    pattern: 'a',
                    flags: 'g'
                  },
                  loc: {
                    start: {
                      line: 1,
                      column: 8
                    },
                    end: {
                      line: 1,
                      column: 12
                    }
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x',
                  loc: {
                    start: {
                      line: 1,
                      column: 13
                    },
                    end: {
                      line: 1,
                      column: 14
                    }
                  }
                },
                loc: {
                  start: {
                    line: 1,
                    column: 8
                  },
                  end: {
                    line: 1,
                    column: 14
                  }
                }
              },
              prefix: true,
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 14
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 16
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 16
          }
        }
      }
    ],
    [
      '(delete /a/.x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Literal',
                  value: /a/,
                  regex: {
                    pattern: 'a',
                    flags: ''
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '(...x) => x',
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
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
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
      'async("foo".bar);',
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
                name: 'async'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: 'foo'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'bar'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(foo.x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      'async ({x=z}, y) => x;',
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
                {
                  type: 'Identifier',
                  name: 'y'
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
      'async (foo = yield) => foo',
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
                name: 'foo'
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  }
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
      'async (foo = yield)',
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
                name: 'async'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function *f(){ async (foo = yield) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        operator: '=',
                        right: {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){ async (foo = yield x) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        operator: '=',
                        right: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          delegate: false
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'async (yield) => foo',
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
                name: 'foo'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'yield'
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
      'async(x) => y',
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
                name: 'y'
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
      '(foo[x])',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: true,
              property: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '(foo) += 3',
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
                name: 'foo'
              },
              operator: '+=',
              right: {
                type: 'Literal',
                value: 3
              }
            }
          }
        ]
      }
    ],
    [
      'async(a);',
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
                name: 'async'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async (...x) => x',
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
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
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
      '(x.foo)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
            }
          }
        ]
      }
    ],

    [
      'delete ((foo) => foo)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'foo'
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
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '({a} + foo)',
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
                type: 'ObjectExpression',
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
                name: 'foo'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      '([a = b].foo = x)',
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
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      operator: '=',
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      }
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '([x].foo) = x',
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
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '([x].foo)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '({[foo]: bar}) => baz',
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
                name: 'baz'
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      kind: 'init',
                      computed: true,
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
      '({*"str"(){}})',
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
                    type: 'Literal',
                    value: 'str'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    id: null,
                    async: false,
                    generator: true
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({*15(){}})',
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
                    type: 'Literal',
                    value: 15
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    id: null,
                    async: false,
                    generator: true
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({x, ...y}) => x',
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
                        type: 'Identifier',
                        name: 'x'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
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
      '({...x.y} = z) ',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '(z = {...x.y}) => z',
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
                name: 'z'
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'SpreadElement',
                        argument: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        }
                      }
                    ]
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
      '({...x=y});',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...x+=y});',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '+=',
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...x+y});',
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
                  type: 'SpreadElement',
                  argument: {
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
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...x, ...y});',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'y'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...x, y});',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'y'
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
      '([...x]);',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(z = [...x.y] = z) => z',
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
                name: 'z'
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'y'
                            }
                          }
                        }
                      ]
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'z'
                    }
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
      '(z = [...x.y]) => z',
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
                name: 'z'
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'SpreadElement',
                        argument: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        }
                      }
                    ]
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
      '([...x+y]);',
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
                  type: 'SpreadElement',
                  argument: {
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
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([...x]);',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([...x=y]);',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(0, a)',
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
                  type: 'Literal',
                  value: 0
                },
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(a, 0)',
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
      '(a,a)',
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
                  name: 'a'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '((a,a),(a,a))',
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
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'a'
                    }
                  ]
                },
                {
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'a'
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
      '((((((((((((((((((((((((((((((((((((((((a))))))))))))))))))))))))))))))))))))))))',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      '({ x : y } = z = {});',
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
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],

    [
      '({ x : foo()[y] } = z = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: []
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '({ x : { foo: foo().y } });',
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
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        value: {
                          type: 'MemberExpression',
                          object: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            arguments: []
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'y'
                          }
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
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      '([x] = y,) => {}',
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
                    type: 'Identifier',
                    name: 'y'
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
      '({a},) => {}',
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
      '([x],) => {}',
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
                      type: 'Identifier',
                      name: 'x'
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
      '({[x]:y} = z);',
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
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '(a) = 1;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({x} = y);',
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
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      '({[x]:y});',
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
                    name: 'y'
                  },
                  kind: 'init',
                  computed: true,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([ foo()[x] = 10 ] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: []
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([ x.y = 10 ] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([ x[y] = 10 ] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([ [ foo().x = 10 ] = {} ] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'MemberExpression',
                            object: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'foo'
                              },
                              arguments: []
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'x'
                            }
                          },
                          right: {
                            type: 'Literal',
                            value: 10
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([ foo()[x] = 10 ] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: []
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([ [ foo().x = 10 ] = {} ] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'MemberExpression',
                            object: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'foo'
                              },
                              arguments: []
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'x'
                            }
                          },
                          right: {
                            type: 'Literal',
                            value: 10
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '({x = 42, y = 15} = z = {});',
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
                        value: 42
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
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      right: {
                        type: 'Literal',
                        value: 15
                      }
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
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([(x),,(y)] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  null,
                  {
                    type: 'Identifier',
                    name: 'y'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([(x)] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([...x, ...y]);',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'y'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([...x, y]);',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([...x+y]); ',
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
                  type: 'SpreadElement',
                  argument: {
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
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([...x+=y]);',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '+=',
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([...x=y]); ',
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
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({[foo()] : z} = z = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      arguments: []
                    },
                    value: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '({[foo()] : (z)} = z = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      arguments: []
                    },
                    value: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '({[foo()] : foo().bar} = z = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      arguments: []
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: []
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([x,,...z] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  null,
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'z'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '({x: ((y, z) => z)["x"]} = z = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'Identifier',
                          name: 'z'
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
                      computed: true,
                      property: {
                        type: 'Literal',
                        value: 'x'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([(({ x } = { x: 1 }) => x).a] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'Identifier',
                        name: 'x'
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
                          right: {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'Identifier',
                                  name: 'x'
                                },
                                value: {
                                  type: 'Literal',
                                  value: 1
                                },
                                kind: 'init',
                                computed: false,
                                method: false,
                                shorthand: false
                              }
                            ]
                          }
                        }
                      ],
                      async: false,
                      expression: true
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([ ...(a) ] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([ (foo.bar) ] = z = {});',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      '(foo)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],

    [
      '(1)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 1
            }
          }
        ]
      }
    ],
    [
      '("a")',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'a'
            }
          }
        ]
      }
    ],
    [
      '("a","b","c","d","e","f")',
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
                  type: 'Literal',
                  value: 'a'
                },
                {
                  type: 'Literal',
                  value: 'b'
                },
                {
                  type: 'Literal',
                  value: 'c'
                },
                {
                  type: 'Literal',
                  value: 'd'
                },
                {
                  type: 'Literal',
                  value: 'e'
                },
                {
                  type: 'Literal',
                  value: 'f'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[(a)] = 0',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '([...x.y] = z)',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      'async("foo".bar);',
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
              type: 'CallExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                range: [0, 5],
                name: 'async'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  start: 6,
                  end: 15,
                  range: [6, 15],
                  object: {
                    type: 'Literal',
                    start: 6,
                    end: 11,
                    range: [6, 11],
                    value: 'foo'
                  },
                  property: {
                    type: 'Identifier',
                    start: 12,
                    end: 15,
                    range: [12, 15],
                    name: 'bar'
                  },
                  computed: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a = b)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 7,
        range: [0, 7],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 7,
            range: [0, 7],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 6,
              range: [1, 6],
              operator: '=',
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
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '((x));',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 6,
        range: [0, 6],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 6,
            range: [0, 6],
            expression: {
              type: 'Identifier',
              start: 2,
              end: 3,
              range: [2, 3],
              name: 'x'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '((((((((((x))))))))));',
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
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'x'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a, b);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 7,
        range: [0, 7],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 7,
            range: [0, 7],
            expression: {
              type: 'SequenceExpression',
              start: 1,
              end: 5,
              range: [1, 5],
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
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a = 1, b = 2);',
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
              type: 'SequenceExpression',
              start: 1,
              end: 13,
              range: [1, 13],
              expressions: [
                {
                  type: 'AssignmentExpression',
                  start: 1,
                  end: 6,
                  range: [1, 6],
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'a'
                  },
                  right: {
                    type: 'Literal',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    value: 1
                  }
                },
                {
                  type: 'AssignmentExpression',
                  start: 8,
                  end: 13,
                  range: [8, 13],
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    range: [8, 9],
                    name: 'b'
                  },
                  right: {
                    type: 'Literal',
                    start: 12,
                    end: 13,
                    range: [12, 13],
                    value: 2
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
      '(a) = 1;',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 7,
              range: [0, 7],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 1,
                end: 2,
                range: [1, 2],
                name: 'a'
              },
              right: {
                type: 'Literal',
                start: 6,
                end: 7,
                range: [6, 7],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a.b) = 1;',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 9,
              range: [0, 9],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 4,
                range: [1, 4],
                object: {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'a'
                },
                property: {
                  type: 'Identifier',
                  start: 3,
                  end: 4,
                  range: [3, 4],
                  name: 'b'
                },
                computed: false
              },
              right: {
                type: 'Literal',
                start: 8,
                end: 9,
                range: [8, 9],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a[b]) = 1;',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 10,
              range: [0, 10],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 5,
                range: [1, 5],
                object: {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'a'
                },
                property: {
                  type: 'Identifier',
                  start: 3,
                  end: 4,
                  range: [3, 4],
                  name: 'b'
                },
                computed: true
              },
              right: {
                type: 'Literal',
                start: 9,
                end: 10,
                range: [9, 10],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a.b().c().d) = 1;',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 12,
                range: [1, 12],
                object: {
                  type: 'CallExpression',
                  start: 1,
                  end: 10,
                  range: [1, 10],
                  callee: {
                    type: 'MemberExpression',
                    start: 1,
                    end: 8,
                    range: [1, 8],
                    object: {
                      type: 'CallExpression',
                      start: 1,
                      end: 6,
                      range: [1, 6],
                      callee: {
                        type: 'MemberExpression',
                        start: 1,
                        end: 4,
                        range: [1, 4],
                        object: {
                          type: 'Identifier',
                          start: 1,
                          end: 2,
                          range: [1, 2],
                          name: 'a'
                        },
                        property: {
                          type: 'Identifier',
                          start: 3,
                          end: 4,
                          range: [3, 4],
                          name: 'b'
                        },
                        computed: false
                      },
                      arguments: []
                    },
                    property: {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'c'
                    },
                    computed: false
                  },
                  arguments: []
                },
                property: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'd'
                },
                computed: false
              },
              right: {
                type: 'Literal',
                start: 16,
                end: 17,
                range: [16, 17],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(this.a) = 1;',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 12,
              range: [0, 12],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 7,
                range: [1, 7],
                object: {
                  type: 'ThisExpression',
                  start: 1,
                  end: 5,
                  range: [1, 5]
                },
                property: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'a'
                },
                computed: false
              },
              right: {
                type: 'Literal',
                start: 11,
                end: 12,
                range: [11, 12],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(this[b]) = 1;',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 8,
                range: [1, 8],
                object: {
                  type: 'ThisExpression',
                  start: 1,
                  end: 5,
                  range: [1, 5]
                },
                property: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'b'
                },
                computed: true
              },
              right: {
                type: 'Literal',
                start: 12,
                end: 13,
                range: [12, 13],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[x, y] = z;',
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
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '([x, y] = z);',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 11,
              range: [1, 11],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 1,
                end: 7,
                range: [1, 7],
                elements: [
                  {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    name: 'x'
                  },
                  {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'y'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 10,
                end: 11,
                range: [10, 11],
                name: 'z'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '([[x, y] = z]);',
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
              type: 'ArrayExpression',
              start: 1,
              end: 13,
              range: [1, 13],
              elements: [
                {
                  type: 'AssignmentExpression',
                  start: 2,
                  end: 12,
                  range: [2, 12],
                  operator: '=',
                  left: {
                    type: 'ArrayPattern',
                    start: 2,
                    end: 8,
                    range: [2, 8],
                    elements: [
                      {
                        type: 'Identifier',
                        start: 3,
                        end: 4,
                        range: [3, 4],
                        name: 'x'
                      },
                      {
                        type: 'Identifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'y'
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    range: [11, 12],
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
      '(a) += 1;',
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
              operator: '+=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '(a.b) += 1;',
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
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              operator: '+=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '(a[b]) += 1;',
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
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a'
                },
                computed: true,
                property: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              operator: '+=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '(a.b().c().d) += 1;',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              operator: '+=',
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 12,
                range: [1, 12],
                object: {
                  type: 'CallExpression',
                  start: 1,
                  end: 10,
                  range: [1, 10],
                  callee: {
                    type: 'MemberExpression',
                    start: 1,
                    end: 8,
                    range: [1, 8],
                    object: {
                      type: 'CallExpression',
                      start: 1,
                      end: 6,
                      range: [1, 6],
                      callee: {
                        type: 'MemberExpression',
                        start: 1,
                        end: 4,
                        range: [1, 4],
                        object: {
                          type: 'Identifier',
                          start: 1,
                          end: 2,
                          range: [1, 2],
                          name: 'a'
                        },
                        property: {
                          type: 'Identifier',
                          start: 3,
                          end: 4,
                          range: [3, 4],
                          name: 'b'
                        },
                        computed: false
                      },
                      arguments: []
                    },
                    property: {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'c'
                    },
                    computed: false
                  },
                  arguments: []
                },
                property: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'd'
                },
                computed: false
              },
              right: {
                type: 'Literal',
                start: 17,
                end: 18,
                range: [17, 18],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(this.a) += 1;',
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
                type: 'MemberExpression',
                object: {
                  type: 'ThisExpression'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              operator: '+=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '(this[b]) += 1;',
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
                type: 'MemberExpression',
                object: {
                  type: 'ThisExpression'
                },
                computed: true,
                property: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              operator: '+=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '({});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: []
            }
          }
        ]
      }
    ],
    [
      '(a / b);',
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
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'Identifier',
                name: 'b'
              },
              operator: '/'
            }
          }
        ]
      }
    ],
    [
      '([delete foo.bar]);',
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
                  type: 'UnaryExpression',
                  operator: 'delete',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  },
                  prefix: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([{}]);',
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
                  type: 'ObjectExpression',
                  properties: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(++x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '++',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '(++x, y);',
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
                  type: 'UpdateExpression',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '++',
                  prefix: true
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(x--);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '--',
              prefix: false
            }
          }
        ]
      }
    ],
    [
      '(x--, y);',
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
                  type: 'UpdateExpression',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '--',
                  prefix: false
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([].x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'ArrayExpression',
                elements: []
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({} + 1);',
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
                type: 'ObjectExpression',
                properties: []
              },
              right: {
                type: 'Literal',
                value: 1
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      '(x + y) >= z',
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
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '>='
            }
          }
        ]
      }
    ],
    [
      '(x + y) <= z',
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
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '<='
            }
          }
        ]
      }
    ],
    [
      '(x + y) != z',
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
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '!='
            }
          }
        ]
      }
    ],
    [
      '(x + y) == z',
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
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '=='
            }
          }
        ]
      }
    ],
    [
      '(x) / y',
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
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'Identifier',
                name: 'y'
              },
              operator: '/'
            }
          }
        ]
      }
    ],
    [
      '([a.b] = x);',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'a',
                      start: 2,
                      end: 3,
                      range: [2, 3]
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'b',
                      start: 4,
                      end: 5,
                      range: [4, 5]
                    },
                    start: 2,
                    end: 5,
                    range: [2, 5]
                  }
                ],
                start: 1,
                end: 6,
                range: [1, 6]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x',
                start: 9,
                end: 10,
                range: [9, 10]
              },
              start: 1,
              end: 10,
              range: [1, 10]
            },
            start: 0,
            end: 12,
            range: [0, 12]
          }
        ],
        start: 0,
        end: 12,
        range: [0, 12]
      }
    ],
    [
      '([target()[targetKey()]] = x);',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'target',
                        start: 2,
                        end: 8,
                        range: [2, 8]
                      },
                      arguments: [],
                      start: 2,
                      end: 10,
                      range: [2, 10]
                    },
                    computed: true,
                    property: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'targetKey',
                        start: 11,
                        end: 20,
                        range: [11, 20]
                      },
                      arguments: [],
                      start: 11,
                      end: 22,
                      range: [11, 22]
                    },
                    start: 2,
                    end: 23,
                    range: [2, 23]
                  }
                ],
                start: 1,
                end: 24,
                range: [1, 24]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x',
                start: 27,
                end: 28,
                range: [27, 28]
              },
              start: 1,
              end: 28,
              range: [1, 28]
            },
            start: 0,
            end: 30,
            range: [0, 30]
          }
        ],
        start: 0,
        end: 30,
        range: [0, 30]
      }
    ],
    [
      '([target()[targetKey(a=b)]] = x);',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'target',
                        start: 2,
                        end: 8,
                        range: [2, 8]
                      },
                      arguments: [],
                      start: 2,
                      end: 10,
                      range: [2, 10]
                    },
                    computed: true,
                    property: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'targetKey',
                        start: 11,
                        end: 20,
                        range: [11, 20]
                      },
                      arguments: [
                        {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'a',
                            start: 21,
                            end: 22,
                            range: [21, 22]
                          },
                          operator: '=',
                          right: {
                            type: 'Identifier',
                            name: 'b',
                            start: 23,
                            end: 24,
                            range: [23, 24]
                          },
                          start: 21,
                          end: 24,
                          range: [21, 24]
                        }
                      ],
                      start: 11,
                      end: 25,
                      range: [11, 25]
                    },
                    start: 2,
                    end: 26,
                    range: [2, 26]
                  }
                ],
                start: 1,
                end: 27,
                range: [1, 27]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x',
                start: 30,
                end: 31,
                range: [30, 31]
              },
              start: 1,
              end: 31,
              range: [1, 31]
            },
            start: 0,
            end: 33,
            range: [0, 33]
          }
        ],
        start: 0,
        end: 33,
        range: [0, 33]
      }
    ],
    [
      '([].length) = y',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: [],
                  start: 1,
                  end: 3,
                  range: [1, 3]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'length',
                  start: 4,
                  end: 10,
                  range: [4, 10]
                },
                start: 1,
                end: 10,
                range: [1, 10]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y',
                start: 14,
                end: 15,
                range: [14, 15]
              },
              start: 0,
              end: 15,
              range: [0, 15]
            },
            start: 0,
            end: 15,
            range: [0, 15]
          }
        ],
        start: 0,
        end: 15,
        range: [0, 15]
      }
    ],
    [
      '([x].length) = y',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x',
                      start: 2,
                      end: 3,
                      range: [2, 3]
                    }
                  ],
                  start: 1,
                  end: 4,
                  range: [1, 4]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'length',
                  start: 5,
                  end: 11,
                  range: [5, 11]
                },
                start: 1,
                end: 11,
                range: [1, 11]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y',
                start: 15,
                end: 16,
                range: [15, 16]
              },
              start: 0,
              end: 16,
              range: [0, 16]
            },
            start: 0,
            end: 16,
            range: [0, 16]
          }
        ],
        start: 0,
        end: 16,
        range: [0, 16]
      }
    ],
    [
      '({}.length) = z',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ObjectExpression',
                  properties: [],
                  start: 1,
                  end: 3,
                  range: [1, 3]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'length',
                  start: 4,
                  end: 10,
                  range: [4, 10]
                },
                start: 1,
                end: 10,
                range: [1, 10]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z',
                start: 14,
                end: 15,
                range: [14, 15]
              },
              start: 0,
              end: 15,
              range: [0, 15]
            },
            start: 0,
            end: 15,
            range: [0, 15]
          }
        ],
        start: 0,
        end: 15,
        range: [0, 15]
      }
    ],
    [
      '({x: y}.length) = z',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x',
                        start: 2,
                        end: 3,
                        range: [2, 3]
                      },
                      value: {
                        type: 'Identifier',
                        name: 'y',
                        start: 5,
                        end: 6,
                        range: [5, 6]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false,
                      start: 2,
                      end: 6,
                      range: [2, 6]
                    }
                  ],
                  start: 1,
                  end: 7,
                  range: [1, 7]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'length',
                  start: 8,
                  end: 14,
                  range: [8, 14]
                },
                start: 1,
                end: 14,
                range: [1, 14]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z',
                start: 18,
                end: 19,
                range: [18, 19]
              },
              start: 0,
              end: 19,
              range: [0, 19]
            },
            start: 0,
            end: 19,
            range: [0, 19]
          }
        ],
        start: 0,
        end: 19,
        range: [0, 19]
      }
    ],
    [
      '({x});',
      Context.OptionsRanges,
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
                    name: 'x',
                    start: 2,
                    end: 3,
                    range: [2, 3]
                  },
                  value: {
                    type: 'Identifier',
                    name: 'x',
                    start: 2,
                    end: 3,
                    range: [2, 3]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true,
                  start: 2,
                  end: 3,
                  range: [2, 3]
                }
              ],
              start: 1,
              end: 4,
              range: [1, 4]
            },
            start: 0,
            end: 6,
            range: [0, 6]
          }
        ],
        start: 0,
        end: 6,
        range: [0, 6]
      }
    ],
    [
      '({x} = y);',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x',
                      start: 2,
                      end: 3,
                      range: [2, 3]
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x',
                      start: 2,
                      end: 3,
                      range: [2, 3]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true,
                    start: 2,
                    end: 3,
                    range: [2, 3]
                  }
                ],
                start: 1,
                end: 4,
                range: [1, 4]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y',
                start: 7,
                end: 8,
                range: [7, 8]
              },
              start: 1,
              end: 8,
              range: [1, 8]
            },
            start: 0,
            end: 10,
            range: [0, 10]
          }
        ],
        start: 0,
        end: 10,
        range: [0, 10]
      }
    ],
    [
      '({[x]:y});',
      Context.OptionsRanges,
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
                    name: 'x',
                    start: 3,
                    end: 4,
                    range: [3, 4]
                  },
                  value: {
                    type: 'Identifier',
                    name: 'y',
                    start: 6,
                    end: 7,
                    range: [6, 7]
                  },
                  kind: 'init',
                  computed: true,
                  method: false,
                  shorthand: false,
                  start: 2,
                  end: 7,
                  range: [2, 7]
                }
              ],
              start: 1,
              end: 8,
              range: [1, 8]
            },
            start: 0,
            end: 10,
            range: [0, 10]
          }
        ],
        start: 0,
        end: 10,
        range: [0, 10]
      }
    ],
    [
      '(++/[^\\x0f+-\\x6d+$-)-]/giuy[(0[true] = {})])',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Literal',
                  // eslint-disable-next-line no-control-regex
                  value: /[^\x0f+-\x6d+$-)-]/giuy,
                  regex: {
                    pattern: '[^\\x0f+-\\x6d+$-)-]',
                    flags: 'giuy'
                  }
                },
                computed: true,
                property: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: 0
                    },
                    computed: true,
                    property: {
                      type: 'Literal',
                      value: true
                    }
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              },
              operator: '++',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '({[x]:y} = z);',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x',
                      start: 3,
                      end: 4,
                      range: [3, 4]
                    },
                    value: {
                      type: 'Identifier',
                      name: 'y',
                      start: 6,
                      end: 7,
                      range: [6, 7]
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false,
                    start: 2,
                    end: 7,
                    range: [2, 7]
                  }
                ],
                start: 1,
                end: 8,
                range: [1, 8]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z',
                start: 11,
                end: 12,
                range: [11, 12]
              },
              start: 1,
              end: 12,
              range: [1, 12]
            },
            start: 0,
            end: 14,
            range: [0, 14]
          }
        ],
        start: 0,
        end: 14,
        range: [0, 14]
      }
    ],
    [
      '({[x](){}});',
      Context.OptionsRanges,
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
                    name: 'x',
                    start: 3,
                    end: 4,
                    range: [3, 4]
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                      start: 7,
                      end: 9,
                      range: [7, 9]
                    },
                    async: false,
                    generator: false,
                    id: null,
                    start: 5,
                    end: 9,
                    range: [5, 9]
                  },
                  kind: 'init',
                  computed: true,
                  method: true,
                  shorthand: false,
                  start: 2,
                  end: 9,
                  range: [2, 9]
                }
              ],
              start: 1,
              end: 10,
              range: [1, 10]
            },
            start: 0,
            end: 12,
            range: [0, 12]
          }
        ],
        start: 0,
        end: 12,
        range: [0, 12]
      }
    ],
    [
      '({ident: [foo, bar].join("")})',
      Context.OptionsRanges,
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
                    name: 'ident',
                    start: 2,
                    end: 7,
                    range: [2, 7]
                  },
                  value: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'foo',
                            start: 10,
                            end: 13,
                            range: [10, 13]
                          },
                          {
                            type: 'Identifier',
                            name: 'bar',
                            start: 15,
                            end: 18,
                            range: [15, 18]
                          }
                        ],
                        start: 9,
                        end: 19,
                        range: [9, 19]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'join',
                        start: 20,
                        end: 24,
                        range: [20, 24]
                      },
                      start: 9,
                      end: 24,
                      range: [9, 24]
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: '',
                        start: 25,
                        end: 27,
                        range: [25, 27]
                      }
                    ],
                    start: 9,
                    end: 28,
                    range: [9, 28]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false,
                  start: 2,
                  end: 28,
                  range: [2, 28]
                }
              ],
              start: 1,
              end: 29,
              range: [1, 29]
            },
            start: 0,
            end: 30,
            range: [0, 30]
          }
        ],
        start: 0,
        end: 30,
        range: [0, 30]
      }
    ],
    [
      '({ident: [foo, bar] + x})',
      Context.OptionsRanges,
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
                    name: 'ident',
                    start: 2,
                    end: 7,
                    range: [2, 7]
                  },
                  value: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo',
                          start: 10,
                          end: 13,
                          range: [10, 13]
                        },
                        {
                          type: 'Identifier',
                          name: 'bar',
                          start: 15,
                          end: 18,
                          range: [15, 18]
                        }
                      ],
                      start: 9,
                      end: 19,
                      range: [9, 19]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x',
                      start: 22,
                      end: 23,
                      range: [22, 23]
                    },
                    operator: '+',
                    start: 9,
                    end: 23,
                    range: [9, 23]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false,
                  start: 2,
                  end: 23,
                  range: [2, 23]
                }
              ],
              start: 1,
              end: 24,
              range: [1, 24]
            },
            start: 0,
            end: 25,
            range: [0, 25]
          }
        ],
        start: 0,
        end: 25,
        range: [0, 25]
      }
    ],
    [
      '({ident: {x: y}})',
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
              type: 'ObjectExpression',
              start: 1,
              end: 16,
              range: [1, 16],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 15,
                  range: [2, 15],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 7,
                    range: [2, 7],
                    name: 'ident'
                  },
                  value: {
                    type: 'ObjectExpression',
                    start: 9,
                    end: 15,
                    range: [9, 15],
                    properties: [
                      {
                        type: 'Property',
                        start: 10,
                        end: 14,
                        range: [10, 14],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'x'
                        },
                        value: {
                          type: 'Identifier',
                          start: 13,
                          end: 14,
                          range: [13, 14],
                          name: 'y'
                        },
                        kind: 'init'
                      }
                    ]
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
      '({ident: {x}})',
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
              type: 'ObjectExpression',
              start: 1,
              end: 13,
              range: [1, 13],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 12,
                  range: [2, 12],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 7,
                    range: [2, 7],
                    name: 'ident'
                  },
                  value: {
                    type: 'ObjectExpression',
                    start: 9,
                    end: 12,
                    range: [9, 12],
                    properties: [
                      {
                        type: 'Property',
                        start: 10,
                        end: 11,
                        range: [10, 11],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'x'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'x'
                        }
                      }
                    ]
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
      '({ident: {x: y}.join("")})',
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
              type: 'ObjectExpression',
              start: 1,
              end: 25,
              range: [1, 25],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 24,
                  range: [2, 24],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 7,
                    range: [2, 7],
                    name: 'ident'
                  },
                  value: {
                    type: 'CallExpression',
                    start: 9,
                    end: 24,
                    range: [9, 24],
                    callee: {
                      type: 'MemberExpression',
                      start: 9,
                      end: 20,
                      range: [9, 20],
                      object: {
                        type: 'ObjectExpression',
                        start: 9,
                        end: 15,
                        range: [9, 15],
                        properties: [
                          {
                            type: 'Property',
                            start: 10,
                            end: 14,
                            range: [10, 14],
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 10,
                              end: 11,
                              range: [10, 11],
                              name: 'x'
                            },
                            value: {
                              type: 'Identifier',
                              start: 13,
                              end: 14,
                              range: [13, 14],
                              name: 'y'
                            },
                            kind: 'init'
                          }
                        ]
                      },
                      property: {
                        type: 'Identifier',
                        start: 16,
                        end: 20,
                        range: [16, 20],
                        name: 'join'
                      },
                      computed: false
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        start: 21,
                        end: 23,
                        range: [21, 23],
                        value: ''
                      }
                    ]
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
      '({ident: {x:y}/x})',
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
              type: 'ObjectExpression',
              start: 1,
              end: 17,
              range: [1, 17],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 16,
                  range: [2, 16],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 7,
                    range: [2, 7],
                    name: 'ident'
                  },
                  value: {
                    type: 'BinaryExpression',
                    start: 9,
                    end: 16,
                    range: [9, 16],
                    left: {
                      type: 'ObjectExpression',
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
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 10,
                            end: 11,
                            range: [10, 11],
                            name: 'x'
                          },
                          value: {
                            type: 'Identifier',
                            start: 12,
                            end: 13,
                            range: [12, 13],
                            name: 'y'
                          },
                          kind: 'init'
                        }
                      ]
                    },
                    operator: '/',
                    right: {
                      type: 'Identifier',
                      start: 15,
                      end: 16,
                      range: [15, 16],
                      name: 'x'
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
      '({ident: {x:y}/x/g})',
      Context.OptionsRanges,
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
                    name: 'ident',
                    start: 2,
                    end: 7,
                    range: [2, 7]
                  },
                  value: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'x',
                              start: 10,
                              end: 11,
                              range: [10, 11]
                            },
                            value: {
                              type: 'Identifier',
                              name: 'y',
                              start: 12,
                              end: 13,
                              range: [12, 13]
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false,
                            start: 10,
                            end: 13,
                            range: [10, 13]
                          }
                        ],
                        start: 9,
                        end: 14,
                        range: [9, 14]
                      },
                      right: {
                        type: 'Identifier',
                        name: 'x',
                        start: 15,
                        end: 16,
                        range: [15, 16]
                      },
                      operator: '/',
                      start: 9,
                      end: 16,
                      range: [9, 16]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'g',
                      start: 17,
                      end: 18,
                      range: [17, 18]
                    },
                    operator: '/',
                    start: 9,
                    end: 18,
                    range: [9, 18]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false,
                  start: 2,
                  end: 18,
                  range: [2, 18]
                }
              ],
              start: 1,
              end: 19,
              range: [1, 19]
            },
            start: 0,
            end: 20,
            range: [0, 20]
          }
        ],
        start: 0,
        end: 20,
        range: [0, 20]
      }
    ],
    [
      '(a / b);',
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
              type: 'BinaryExpression',
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
              operator: '/',
              right: {
                type: 'Identifier',
                start: 5,
                end: 6,
                range: [5, 6],
                name: 'b'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(delete foo.bar);',
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
              type: 'UnaryExpression',
              start: 1,
              end: 15,
              range: [1, 15],
              operator: 'delete',
              prefix: true,
              argument: {
                type: 'MemberExpression',
                start: 8,
                end: 15,
                range: [8, 15],
                object: {
                  type: 'Identifier',
                  start: 8,
                  end: 11,
                  range: [8, 11],
                  name: 'foo'
                },
                property: {
                  type: 'Identifier',
                  start: 12,
                  end: 15,
                  range: [12, 15],
                  name: 'bar'
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
      '([delete foo.bar]);',
      Context.OptionsRanges,
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
                  type: 'UnaryExpression',
                  operator: 'delete',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'foo',
                      start: 9,
                      end: 12,
                      range: [9, 12]
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'bar',
                      start: 13,
                      end: 16,
                      range: [13, 16]
                    },
                    start: 9,
                    end: 16,
                    range: [9, 16]
                  },
                  prefix: true,
                  start: 2,
                  end: 16,
                  range: [2, 16]
                }
              ],
              start: 1,
              end: 17,
              range: [1, 17]
            },
            start: 0,
            end: 19,
            range: [0, 19]
          }
        ],
        start: 0,
        end: 19,
        range: [0, 19]
      }
    ],
    [
      '([a / b]);',
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
              type: 'ArrayExpression',
              start: 1,
              end: 8,
              range: [1, 8],
              elements: [
                {
                  type: 'BinaryExpression',
                  start: 2,
                  end: 7,
                  range: [2, 7],
                  left: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    name: 'a'
                  },
                  operator: '/',
                  right: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    range: [6, 7],
                    name: 'b'
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
      '(x--);',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'x',
                start: 1,
                end: 2,
                range: [1, 2]
              },
              operator: '--',
              prefix: false,
              start: 1,
              end: 4,
              range: [1, 4]
            },
            start: 0,
            end: 6,
            range: [0, 6]
          }
        ],
        start: 0,
        end: 6,
        range: [0, 6]
      }
    ],
    [
      '(x--, y);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 9,
        range: [0, 9],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 9,
            range: [0, 9],
            expression: {
              type: 'SequenceExpression',
              start: 1,
              end: 7,
              range: [1, 7],
              expressions: [
                {
                  type: 'UpdateExpression',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  operator: '--',
                  prefix: false,
                  argument: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'x'
                  }
                },
                {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'y'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(x + y) >= z',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 12,
              range: [0, 12],
              left: {
                type: 'BinaryExpression',
                start: 1,
                end: 6,
                range: [1, 6],
                left: {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'x'
                },
                operator: '+',
                right: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'y'
                }
              },
              operator: '>=',
              right: {
                type: 'Identifier',
                start: 11,
                end: 12,
                range: [11, 12],
                name: 'z'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(x + y) <= z',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 12,
              range: [0, 12],
              left: {
                type: 'BinaryExpression',
                start: 1,
                end: 6,
                range: [1, 6],
                left: {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'x'
                },
                operator: '+',
                right: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'y'
                }
              },
              operator: '<=',
              right: {
                type: 'Identifier',
                start: 11,
                end: 12,
                range: [11, 12],
                name: 'z'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(x + y) != z',
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
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '!='
            }
          }
        ]
      }
    ],
    [
      '(x + y) == z',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'x',
                  start: 1,
                  end: 2,
                  range: [1, 2]
                },
                right: {
                  type: 'Identifier',
                  name: 'y',
                  start: 5,
                  end: 6,
                  range: [5, 6]
                },
                operator: '+',
                start: 1,
                end: 6,
                range: [1, 6]
              },
              right: {
                type: 'Identifier',
                name: 'z',
                start: 11,
                end: 12,
                range: [11, 12]
              },
              operator: '==',
              start: 0,
              end: 12,
              range: [0, 12]
            },
            start: 0,
            end: 12,
            range: [0, 12]
          }
        ],
        start: 0,
        end: 12,
        range: [0, 12]
      }
    ],
    [
      '(true)',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: true,
              start: 1,
              end: 5,
              range: [1, 5]
            },
            start: 0,
            end: 6,
            range: [0, 6]
          }
        ],
        start: 0,
        end: 6,
        range: [0, 6]
      }
    ],

    [
      '(foo + (bar + boo) + ding)',
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
              type: 'BinaryExpression',
              start: 1,
              end: 25,
              range: [1, 25],
              left: {
                type: 'BinaryExpression',
                start: 1,
                end: 18,
                range: [1, 18],
                left: {
                  type: 'Identifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'foo'
                },
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  start: 8,
                  end: 17,
                  range: [8, 17],
                  left: {
                    type: 'Identifier',
                    start: 8,
                    end: 11,
                    range: [8, 11],
                    name: 'bar'
                  },
                  operator: '+',
                  right: {
                    type: 'Identifier',
                    start: 14,
                    end: 17,
                    range: [14, 17],
                    name: 'boo'
                  }
                }
              },
              operator: '+',
              right: {
                type: 'Identifier',
                start: 21,
                end: 25,
                range: [21, 25],
                name: 'ding'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[(a)] = 0',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 9,
        range: [0, 9],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 9,
            range: [0, 9],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 9,
              range: [0, 9],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 5,
                range: [0, 5],
                elements: [
                  {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    name: 'a'
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 8,
                end: 9,
                range: [8, 9],
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[(a) = 0] = 1',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 9,
                range: [0, 9],
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 1,
                    end: 8,
                    range: [1, 8],
                    left: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      value: 0
                    }
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 12,
                end: 13,
                range: [12, 13],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[(a.b)] = 0',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 7,
                range: [0, 7],
                elements: [
                  {
                    type: 'MemberExpression',
                    start: 2,
                    end: 5,
                    range: [2, 5],
                    object: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    property: {
                      type: 'Identifier',
                      start: 4,
                      end: 5,
                      range: [4, 5],
                      name: 'b'
                    },
                    computed: false
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 10,
                end: 11,
                range: [10, 11],
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({a:(b)} = 0)',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 12,
              range: [1, 12],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 8,
                range: [1, 8],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 7,
                    range: [2, 7],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'b'
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 11,
                end: 12,
                range: [11, 12],
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({a:(b.c)} = 0)',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 14,
              range: [1, 14],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 10,
                range: [1, 10],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 9,
                    range: [2, 9],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    value: {
                      type: 'MemberExpression',
                      start: 5,
                      end: 8,
                      range: [5, 8],
                      object: {
                        type: 'Identifier',
                        start: 5,
                        end: 6,
                        range: [5, 6],
                        name: 'b'
                      },
                      property: {
                        type: 'Identifier',
                        start: 7,
                        end: 8,
                        range: [7, 8],
                        name: 'c'
                      },
                      computed: false
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 13,
                end: 14,
                range: [13, 14],
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({a:(b = 0)})',
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
              type: 'ObjectExpression',
              start: 1,
              end: 12,
              range: [1, 12],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 11,
                  range: [2, 11],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    name: 'a'
                  },
                  value: {
                    type: 'AssignmentExpression',
                    start: 5,
                    end: 10,
                    range: [5, 10],
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'b'
                    },
                    right: {
                      type: 'Literal',
                      start: 9,
                      end: 10,
                      range: [9, 10],
                      value: 0
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
      'c = ({b} = b);',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'c'
              },
              right: {
                type: 'AssignmentExpression',
                start: 5,
                end: 12,
                range: [5, 12],
                operator: '=',
                left: {
                  type: 'ObjectPattern',
                  start: 5,
                  end: 8,
                  range: [5, 8],
                  properties: [
                    {
                      type: 'Property',
                      start: 6,
                      end: 7,
                      range: [6, 7],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'b'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'b'
                      }
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'b'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({b} = b);',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 8,
              range: [1, 8],
              operator: '=',
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
                      name: 'b'
                    },
                    kind: 'init',
                    value: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'b'
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
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '([b] = b);',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 8,
              range: [1, 8],
              operator: '=',
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
                    name: 'b'
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
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({a, b} = {a: 1, b: 2});',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 22,
              range: [1, 22],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 7,
                range: [1, 7],
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
                  },
                  {
                    type: 'Property',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'b'
                    },
                    kind: 'init',
                    value: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'b'
                    }
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 10,
                end: 22,
                range: [10, 22],
                properties: [
                  {
                    type: 'Property',
                    start: 11,
                    end: 15,
                    range: [11, 15],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
                      name: 'a'
                    },
                    value: {
                      type: 'Literal',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      value: 1
                    },
                    kind: 'init'
                  },
                  {
                    type: 'Property',
                    start: 17,
                    end: 21,
                    range: [17, 21],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 17,
                      end: 18,
                      range: [17, 18],
                      name: 'b'
                    },
                    value: {
                      type: 'Literal',
                      start: 20,
                      end: 21,
                      range: [20, 21],
                      value: 2
                    },
                    kind: 'init'
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
      '[a, b] = [1, 2]',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 1
                  },
                  {
                    type: 'Literal',
                    value: 2
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({ responseText: text } = res)',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 29,
              range: [1, 29],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 23,
                range: [1, 23],
                properties: [
                  {
                    type: 'Property',
                    start: 3,
                    end: 21,
                    range: [3, 21],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 3,
                      end: 15,
                      range: [3, 15],
                      name: 'responseText'
                    },
                    value: {
                      type: 'Identifier',
                      start: 17,
                      end: 21,
                      range: [17, 21],
                      name: 'text'
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 26,
                end: 29,
                range: [26, 29],
                name: 'res'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a) = {}',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 8,
              range: [0, 8],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 1,
                end: 2,
                range: [1, 2],
                name: 'a'
              },
              right: {
                type: 'ObjectExpression',
                start: 6,
                end: 8,
                range: [6, 8],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a.b) = {}',
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
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      'test = { a: 1 }',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 4,
                range: [0, 4],
                name: 'test'
              },
              right: {
                type: 'ObjectExpression',
                start: 7,
                end: 15,
                range: [7, 15],
                properties: [
                  {
                    type: 'Property',
                    start: 9,
                    end: 13,
                    range: [9, 13],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 9,
                      end: 10,
                      range: [9, 10],
                      name: 'a'
                    },
                    value: {
                      type: 'Literal',
                      start: 12,
                      end: 13,
                      range: [12, 13],
                      value: 1
                    },
                    kind: 'init'
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
      '(f().a) = 1;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 6,
                range: [1, 6],
                object: {
                  type: 'CallExpression',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  callee: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'f'
                  },
                  arguments: []
                },
                property: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'a'
                },
                computed: false
              },
              right: {
                type: 'Literal',
                start: 10,
                end: 11,
                range: [10, 11],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(obj[0]) = 1;',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 12,
              range: [0, 12],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 7,
                range: [1, 7],
                object: {
                  type: 'Identifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'obj'
                },
                property: {
                  type: 'Literal',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  value: 0
                },
                computed: true
              },
              right: {
                type: 'Literal',
                start: 11,
                end: 12,
                range: [11, 12],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(obj.a) = 1;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 6,
                range: [1, 6],
                object: {
                  type: 'Identifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'obj'
                },
                property: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'a'
                },
                computed: false
              },
              right: {
                type: 'Literal',
                start: 10,
                end: 11,
                range: [10, 11],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({a:((((a1))))} = {a:20})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 25,
            range: [0, 25],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 24,
              range: [1, 24],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 15,
                range: [1, 15],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 14,
                    range: [2, 14],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      start: 8,
                      end: 10,
                      range: [8, 10],
                      name: 'a1'
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 18,
                end: 24,
                range: [18, 24],
                properties: [
                  {
                    type: 'Property',
                    start: 19,
                    end: 23,
                    range: [19, 23],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 19,
                      end: 20,
                      range: [19, 20],
                      name: 'a'
                    },
                    value: {
                      type: 'Literal',
                      start: 21,
                      end: 23,
                      range: [21, 23],
                      value: 20
                    },
                    kind: 'init'
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
      '({a:a1 = r1 = 44} = {})',
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
              start: 1,
              end: 22,
              range: [1, 22],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 17,
                range: [1, 17],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 16,
                    range: [2, 16],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      start: 4,
                      end: 16,
                      range: [4, 16],
                      left: {
                        type: 'Identifier',
                        start: 4,
                        end: 6,
                        range: [4, 6],
                        name: 'a1'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        start: 9,
                        end: 16,
                        range: [9, 16],
                        operator: '=',
                        left: {
                          type: 'Identifier',
                          start: 9,
                          end: 11,
                          range: [9, 11],
                          name: 'r1'
                        },
                        right: {
                          type: 'Literal',
                          start: 14,
                          end: 16,
                          range: [14, 16],
                          value: 44
                        }
                      }
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 20,
                end: 22,
                range: [20, 22],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({a:a1 = r1} = {})',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 17,
              range: [1, 17],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 12,
                range: [1, 12],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 11,
                    range: [2, 11],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      start: 4,
                      end: 11,
                      range: [4, 11],
                      left: {
                        type: 'Identifier',
                        start: 4,
                        end: 6,
                        range: [4, 6],
                        name: 'a1'
                      },
                      right: {
                        type: 'Identifier',
                        start: 9,
                        end: 11,
                        range: [9, 11],
                        name: 'r1'
                      }
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 15,
                end: 17,
                range: [15, 17],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...{a}] = [{}]',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 8,
                range: [0, 8],
                elements: [
                  {
                    type: 'RestElement',
                    start: 1,
                    end: 7,
                    range: [1, 7],
                    argument: {
                      type: 'ObjectPattern',
                      start: 4,
                      end: 7,
                      range: [4, 7],
                      properties: [
                        {
                          type: 'Property',
                          start: 5,
                          end: 6,
                          range: [5, 6],
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 5,
                            end: 6,
                            range: [5, 6],
                            name: 'a'
                          },
                          kind: 'init',
                          value: {
                            type: 'Identifier',
                            start: 5,
                            end: 6,
                            range: [5, 6],
                            name: 'a'
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 11,
                end: 15,
                range: [11, 15],
                elements: [
                  {
                    type: 'ObjectExpression',
                    start: 12,
                    end: 14,
                    range: [12, 14],
                    properties: []
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
      '({x:z = 1, x1:y = 20} = {});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        range: [0, 28],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 28,
            range: [0, 28],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 26,
              range: [1, 26],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 21,
                range: [1, 21],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 9,
                    range: [2, 9],
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
                      type: 'AssignmentPattern',
                      start: 4,
                      end: 9,
                      range: [4, 9],
                      left: {
                        type: 'Identifier',
                        start: 4,
                        end: 5,
                        range: [4, 5],
                        name: 'z'
                      },
                      right: {
                        type: 'Literal',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        value: 1
                      }
                    },
                    kind: 'init'
                  },
                  {
                    type: 'Property',
                    start: 11,
                    end: 20,
                    range: [11, 20],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 11,
                      end: 13,
                      range: [11, 13],
                      name: 'x1'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      start: 14,
                      end: 20,
                      range: [14, 20],
                      left: {
                        type: 'Identifier',
                        start: 14,
                        end: 15,
                        range: [14, 15],
                        name: 'y'
                      },
                      right: {
                        type: 'Literal',
                        start: 18,
                        end: 20,
                        range: [18, 20],
                        value: 20
                      }
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 24,
                end: 26,
                range: [24, 26],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({ x } = { x: 3 });',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 17,
              range: [1, 17],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 6,
                range: [1, 6],
                properties: [
                  {
                    type: 'Property',
                    start: 3,
                    end: 4,
                    range: [3, 4],
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 3,
                      end: 4,
                      range: [3, 4],
                      name: 'x'
                    },
                    kind: 'init',
                    value: {
                      type: 'Identifier',
                      start: 3,
                      end: 4,
                      range: [3, 4],
                      name: 'x'
                    }
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 9,
                end: 17,
                range: [9, 17],
                properties: [
                  {
                    type: 'Property',
                    start: 11,
                    end: 15,
                    range: [11, 15],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
                      name: 'x'
                    },
                    value: {
                      type: 'Literal',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      value: 3
                    },
                    kind: 'init'
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
      '[{x:x, y:y}, [a,b,c]]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        range: [0, 21],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 21,
            range: [0, 21],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 21,
              range: [0, 21],
              elements: [
                {
                  type: 'ObjectExpression',
                  start: 1,
                  end: 11,
                  range: [1, 11],
                  properties: [
                    {
                      type: 'Property',
                      start: 2,
                      end: 5,
                      range: [2, 5],
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
                        type: 'Identifier',
                        start: 4,
                        end: 5,
                        range: [4, 5],
                        name: 'x'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 7,
                      end: 10,
                      range: [7, 10],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 7,
                        end: 8,
                        range: [7, 8],
                        name: 'y'
                      },
                      value: {
                        type: 'Identifier',
                        start: 9,
                        end: 10,
                        range: [9, 10],
                        name: 'y'
                      },
                      kind: 'init'
                    }
                  ]
                },
                {
                  type: 'ArrayExpression',
                  start: 13,
                  end: 20,
                  range: [13, 20],
                  elements: [
                    {
                      type: 'Identifier',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      start: 16,
                      end: 17,
                      range: [16, 17],
                      name: 'b'
                    },
                    {
                      type: 'Identifier',
                      start: 18,
                      end: 19,
                      range: [18, 19],
                      name: 'c'
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
      '[x.a=a] = 0',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 7,
                range: [0, 7],
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 1,
                    end: 6,
                    range: [1, 6],
                    left: {
                      type: 'MemberExpression',
                      start: 1,
                      end: 4,
                      range: [1, 4],
                      object: {
                        type: 'Identifier',
                        start: 1,
                        end: 2,
                        range: [1, 2],
                        name: 'x'
                      },
                      property: {
                        type: 'Identifier',
                        start: 3,
                        end: 4,
                        range: [3, 4],
                        name: 'a'
                      },
                      computed: false
                    },
                    right: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'a'
                    }
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 10,
                end: 11,
                range: [10, 11],
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],

    [
      '({ x = 10 } = {});',
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
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '({ q } = { x = 10 } = {});',
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
              type: 'AssignmentExpression',
              start: 1,
              end: 24,
              range: [1, 24],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 6,
                range: [1, 6],
                properties: [
                  {
                    type: 'Property',
                    start: 3,
                    end: 4,
                    range: [3, 4],
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 3,
                      end: 4,
                      range: [3, 4],
                      name: 'q'
                    },
                    kind: 'init',
                    value: {
                      type: 'Identifier',
                      start: 3,
                      end: 4,
                      range: [3, 4],
                      name: 'q'
                    }
                  }
                ]
              },
              right: {
                type: 'AssignmentExpression',
                start: 9,
                end: 24,
                range: [9, 24],
                operator: '=',
                left: {
                  type: 'ObjectPattern',
                  start: 9,
                  end: 19,
                  range: [9, 19],
                  properties: [
                    {
                      type: 'Property',
                      start: 11,
                      end: 17,
                      range: [11, 17],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 11,
                        end: 12,
                        range: [11, 12],
                        name: 'x'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 11,
                        end: 17,
                        range: [11, 17],
                        left: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          range: [11, 12],
                          name: 'x'
                        },
                        right: {
                          type: 'Literal',
                          start: 15,
                          end: 17,
                          range: [15, 17],
                          value: 10
                        }
                      }
                    }
                  ]
                },
                right: {
                  type: 'ObjectExpression',
                  start: 22,
                  end: 24,
                  range: [22, 24],
                  properties: []
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(true ? { x = true } = {} : { x = false } = {})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 47,
        range: [0, 47],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 47,
            range: [0, 47],
            expression: {
              type: 'ConditionalExpression',
              start: 1,
              end: 46,
              range: [1, 46],
              test: {
                type: 'Literal',
                start: 1,
                end: 5,
                range: [1, 5],
                value: true
              },
              consequent: {
                type: 'AssignmentExpression',
                start: 8,
                end: 25,
                range: [8, 25],
                operator: '=',
                left: {
                  type: 'ObjectPattern',
                  start: 8,
                  end: 20,
                  range: [8, 20],
                  properties: [
                    {
                      type: 'Property',
                      start: 10,
                      end: 18,
                      range: [10, 18],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 10,
                        end: 11,
                        range: [10, 11],
                        name: 'x'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 10,
                        end: 18,
                        range: [10, 18],
                        left: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'x'
                        },
                        right: {
                          type: 'Literal',
                          start: 14,
                          end: 18,
                          range: [14, 18],
                          value: true
                        }
                      }
                    }
                  ]
                },
                right: {
                  type: 'ObjectExpression',
                  start: 23,
                  end: 25,
                  range: [23, 25],
                  properties: []
                }
              },
              alternate: {
                type: 'AssignmentExpression',
                start: 28,
                end: 46,
                range: [28, 46],
                operator: '=',
                left: {
                  type: 'ObjectPattern',
                  start: 28,
                  end: 41,
                  range: [28, 41],
                  properties: [
                    {
                      type: 'Property',
                      start: 30,
                      end: 39,
                      range: [30, 39],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 30,
                        end: 31,
                        range: [30, 31],
                        name: 'x'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 30,
                        end: 39,
                        range: [30, 39],
                        left: {
                          type: 'Identifier',
                          start: 30,
                          end: 31,
                          range: [30, 31],
                          name: 'x'
                        },
                        right: {
                          type: 'Literal',
                          start: 34,
                          end: 39,
                          range: [34, 39],
                          value: false
                        }
                      }
                    }
                  ]
                },
                right: {
                  type: 'ObjectExpression',
                  start: 44,
                  end: 46,
                  range: [44, 46],
                  properties: []
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(q, { x = 10 } = {});',
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
                  name: 'q'
                },
                {
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
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function a(a = b += 1, c = d +=1) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        range: [0, 36],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 36,
            range: [0, 36],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'a'
            },
            generator: false,
            async: false,
            params: [
              {
                type: 'AssignmentPattern',
                start: 11,
                end: 21,
                range: [11, 21],
                left: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'a'
                },
                right: {
                  type: 'AssignmentExpression',
                  start: 15,
                  end: 21,
                  range: [15, 21],
                  operator: '+=',
                  left: {
                    type: 'Identifier',
                    start: 15,
                    end: 16,
                    range: [15, 16],
                    name: 'b'
                  },
                  right: {
                    type: 'Literal',
                    start: 20,
                    end: 21,
                    range: [20, 21],
                    value: 1
                  }
                }
              },
              {
                type: 'AssignmentPattern',
                start: 23,
                end: 32,
                range: [23, 32],
                left: {
                  type: 'Identifier',
                  start: 23,
                  end: 24,
                  range: [23, 24],
                  name: 'c'
                },
                right: {
                  type: 'AssignmentExpression',
                  start: 27,
                  end: 32,
                  range: [27, 32],
                  operator: '+=',
                  left: {
                    type: 'Identifier',
                    start: 27,
                    end: 28,
                    range: [27, 28],
                    name: 'd'
                  },
                  right: {
                    type: 'Literal',
                    start: 31,
                    end: 32,
                    range: [31, 32],
                    value: 1
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 34,
              end: 36,
              range: [34, 36],
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...z = 1]',
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
              type: 'ArrayExpression',
              start: 0,
              end: 10,
              range: [0, 10],
              elements: [
                {
                  type: 'SpreadElement',
                  start: 1,
                  end: 9,
                  range: [1, 9],
                  argument: {
                    type: 'AssignmentExpression',
                    start: 4,
                    end: 9,
                    range: [4, 9],
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 4,
                      end: 5,
                      range: [4, 5],
                      name: 'z'
                    },
                    right: {
                      type: 'Literal',
                      start: 8,
                      end: 9,
                      range: [8, 9],
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
    [
      '[x, {y = 1}] = [0, {}]',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 22,
              range: [0, 22],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 12,
                range: [0, 12],
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'x'
                  },
                  {
                    type: 'ObjectPattern',
                    start: 4,
                    end: 11,
                    range: [4, 11],
                    properties: [
                      {
                        type: 'Property',
                        start: 5,
                        end: 10,
                        range: [5, 10],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 5,
                          end: 6,
                          range: [5, 6],
                          name: 'y'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 5,
                          end: 10,
                          range: [5, 10],
                          left: {
                            type: 'Identifier',
                            start: 5,
                            end: 6,
                            range: [5, 6],
                            name: 'y'
                          },
                          right: {
                            type: 'Literal',
                            start: 9,
                            end: 10,
                            range: [9, 10],
                            value: 1
                          }
                        }
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 15,
                end: 22,
                range: [15, 22],
                elements: [
                  {
                    type: 'Literal',
                    start: 16,
                    end: 17,
                    range: [16, 17],
                    value: 0
                  },
                  {
                    type: 'ObjectExpression',
                    start: 19,
                    end: 21,
                    range: [19, 21],
                    properties: []
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
      '[x, {y = 1}] = [0, {}]',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 22,
              range: [0, 22],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 12,
                range: [0, 12],
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'x'
                  },
                  {
                    type: 'ObjectPattern',
                    start: 4,
                    end: 11,
                    range: [4, 11],
                    properties: [
                      {
                        type: 'Property',
                        start: 5,
                        end: 10,
                        range: [5, 10],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 5,
                          end: 6,
                          range: [5, 6],
                          name: 'y'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 5,
                          end: 10,
                          range: [5, 10],
                          left: {
                            type: 'Identifier',
                            start: 5,
                            end: 6,
                            range: [5, 6],
                            name: 'y'
                          },
                          right: {
                            type: 'Literal',
                            start: 9,
                            end: 10,
                            range: [9, 10],
                            value: 1
                          }
                        }
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 15,
                end: 22,
                range: [15, 22],
                elements: [
                  {
                    type: 'Literal',
                    start: 16,
                    end: 17,
                    range: [16, 17],
                    value: 0
                  },
                  {
                    type: 'ObjectExpression',
                    start: 19,
                    end: 21,
                    range: [19, 21],
                    properties: []
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
      'function x([ a, b ]){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ]
              }
            ],
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
      }
    ],
    [
      'a0({});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 7,
        range: [0, 7],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 7,
            range: [0, 7],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 6,
              range: [0, 6],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 2,
                range: [0, 2],
                name: 'a0'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 3,
                  end: 5,
                  range: [3, 5],
                  properties: []
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a) = 0',
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
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '({ a: 1 }).a === 1',
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
                type: 'MemberExpression',
                start: 0,
                end: 12,
                range: [0, 12],
                object: {
                  type: 'ObjectExpression',
                  start: 1,
                  end: 9,
                  range: [1, 9],
                  properties: [
                    {
                      type: 'Property',
                      start: 3,
                      end: 7,
                      range: [3, 7],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 3,
                        end: 4,
                        range: [3, 4],
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        value: 1
                      },
                      kind: 'init'
                    }
                  ]
                },
                property: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'a'
                },
                computed: false
              },
              operator: '===',
              right: {
                type: 'Literal',
                start: 17,
                end: 18,
                range: [17, 18],
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 49,
        range: [0, 49],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 49,
            range: [0, 49],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 48,
              range: [0, 48],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 43,
                range: [0, 43],
                elements: [
                  {
                    type: 'ObjectPattern',
                    start: 1,
                    end: 19,
                    range: [1, 19],
                    properties: [
                      {
                        type: 'Property',
                        start: 2,
                        end: 9,
                        range: [2, 9],
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
                          type: 'AssignmentPattern',
                          start: 4,
                          end: 9,
                          range: [4, 9],
                          left: {
                            type: 'Identifier',
                            start: 4,
                            end: 5,
                            range: [4, 5],
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            start: 8,
                            end: 9,
                            range: [8, 9],
                            value: 1,
                            raw: '1'
                          }
                        },
                        kind: 'init'
                      },
                      {
                        type: 'Property',
                        start: 11,
                        end: 18,
                        range: [11, 18],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          range: [11, 12],
                          name: 'y'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          start: 13,
                          end: 18,
                          range: [13, 18],
                          left: {
                            type: 'Identifier',
                            start: 13,
                            end: 14,
                            range: [13, 14],
                            name: 'y'
                          },
                          right: {
                            type: 'Literal',
                            start: 17,
                            end: 18,
                            range: [17, 18],
                            value: 2,
                            raw: '2'
                          }
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'ArrayPattern',
                    start: 21,
                    end: 42,
                    range: [21, 42],
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        start: 22,
                        end: 27,
                        range: [22, 27],
                        left: {
                          type: 'Identifier',
                          start: 22,
                          end: 23,
                          range: [22, 23],
                          name: 'a'
                        },
                        right: {
                          type: 'Literal',
                          start: 26,
                          end: 27,
                          range: [26, 27],
                          value: 3,
                          raw: '3'
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        start: 29,
                        end: 34,
                        range: [29, 34],
                        left: {
                          type: 'Identifier',
                          start: 29,
                          end: 30,
                          range: [29, 30],
                          name: 'b'
                        },
                        right: {
                          type: 'Literal',
                          start: 33,
                          end: 34,
                          range: [33, 34],
                          value: 4,
                          raw: '4'
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        start: 36,
                        end: 41,
                        range: [36, 41],
                        left: {
                          type: 'Identifier',
                          start: 36,
                          end: 37,
                          range: [36, 37],
                          name: 'c'
                        },
                        right: {
                          type: 'Literal',
                          start: 40,
                          end: 41,
                          range: [40, 41],
                          value: 5,
                          raw: '5'
                        }
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 46,
                end: 48,
                range: [46, 48],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f = (argument1, [a,b,c])',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 24,
              range: [0, 24],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              right: {
                type: 'SequenceExpression',
                start: 5,
                end: 23,
                range: [5, 23],
                expressions: [
                  {
                    type: 'Identifier',
                    start: 5,
                    end: 14,
                    range: [5, 14],
                    name: 'argument1'
                  },
                  {
                    type: 'ArrayExpression',
                    start: 16,
                    end: 23,
                    range: [16, 23],
                    elements: [
                      {
                        type: 'Identifier',
                        start: 17,
                        end: 18,
                        range: [17, 18],
                        name: 'a'
                      },
                      {
                        type: 'Identifier',
                        start: 19,
                        end: 20,
                        range: [19, 20],
                        name: 'b'
                      },
                      {
                        type: 'Identifier',
                        start: 21,
                        end: 22,
                        range: [21, 22],
                        name: 'c'
                      }
                    ]
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
      'f = (argument1, { x : x, y : y = 42 })',
      Context.OptionsRanges,
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
                name: 'f',
                start: 0,
                end: 1,
                range: [0, 1]
              },
              operator: '=',
              right: {
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'argument1',
                    start: 5,
                    end: 14,
                    range: [5, 14]
                  },
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x',
                          start: 18,
                          end: 19,
                          range: [18, 19]
                        },
                        value: {
                          type: 'Identifier',
                          name: 'x',
                          start: 22,
                          end: 23,
                          range: [22, 23]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false,
                        start: 18,
                        end: 23,
                        range: [18, 23]
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'y',
                          start: 25,
                          end: 26,
                          range: [25, 26]
                        },
                        value: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'y',
                            start: 29,
                            end: 30,
                            range: [29, 30]
                          },
                          operator: '=',
                          right: {
                            type: 'Literal',
                            value: 42,
                            start: 33,
                            end: 35,
                            range: [33, 35]
                          },
                          start: 29,
                          end: 35,
                          range: [29, 35]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false,
                        start: 25,
                        end: 35,
                        range: [25, 35]
                      }
                    ],
                    start: 16,
                    end: 37,
                    range: [16, 37]
                  }
                ],
                start: 5,
                end: 37,
                range: [5, 37]
              },
              start: 0,
              end: 38,
              range: [0, 38]
            },
            start: 0,
            end: 38,
            range: [0, 38]
          }
        ],
        start: 0,
        end: 38,
        range: [0, 38]
      }
    ],
    [
      'f = (argument1, [{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]])',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 60,
        range: [0, 60],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 60,
            range: [0, 60],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 60,
              range: [0, 60],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              right: {
                type: 'SequenceExpression',
                start: 5,
                end: 59,
                range: [5, 59],
                expressions: [
                  {
                    type: 'Identifier',
                    start: 5,
                    end: 14,
                    range: [5, 14],
                    name: 'argument1'
                  },
                  {
                    type: 'ArrayExpression',
                    start: 16,
                    end: 59,
                    range: [16, 59],
                    elements: [
                      {
                        type: 'ObjectExpression',
                        start: 17,
                        end: 35,
                        range: [17, 35],
                        properties: [
                          {
                            type: 'Property',
                            start: 18,
                            end: 25,
                            range: [18, 25],
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 18,
                              end: 19,
                              range: [18, 19],
                              name: 'x'
                            },
                            value: {
                              type: 'AssignmentExpression',
                              start: 20,
                              end: 25,
                              range: [20, 25],
                              operator: '=',
                              left: {
                                type: 'Identifier',
                                start: 20,
                                end: 21,
                                range: [20, 21],
                                name: 'x'
                              },
                              right: {
                                type: 'Literal',
                                start: 24,
                                end: 25,
                                range: [24, 25],
                                value: 1,
                                raw: '1'
                              }
                            },
                            kind: 'init'
                          },
                          {
                            type: 'Property',
                            start: 27,
                            end: 34,
                            range: [27, 34],
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 27,
                              end: 28,
                              range: [27, 28],
                              name: 'y'
                            },
                            value: {
                              type: 'AssignmentExpression',
                              start: 29,
                              end: 34,
                              range: [29, 34],
                              operator: '=',
                              left: {
                                type: 'Identifier',
                                start: 29,
                                end: 30,
                                range: [29, 30],
                                name: 'y'
                              },
                              right: {
                                type: 'Literal',
                                start: 33,
                                end: 34,
                                range: [33, 34],
                                value: 2,
                                raw: '2'
                              }
                            },
                            kind: 'init'
                          }
                        ]
                      },
                      {
                        type: 'ArrayExpression',
                        start: 37,
                        end: 58,
                        range: [37, 58],
                        elements: [
                          {
                            type: 'AssignmentExpression',
                            start: 38,
                            end: 43,
                            range: [38, 43],
                            operator: '=',
                            left: {
                              type: 'Identifier',
                              start: 38,
                              end: 39,
                              range: [38, 39],
                              name: 'a'
                            },
                            right: {
                              type: 'Literal',
                              start: 42,
                              end: 43,
                              range: [42, 43],
                              value: 3,
                              raw: '3'
                            }
                          },
                          {
                            type: 'AssignmentExpression',
                            start: 45,
                            end: 50,
                            range: [45, 50],
                            operator: '=',
                            left: {
                              type: 'Identifier',
                              start: 45,
                              end: 46,
                              range: [45, 46],
                              name: 'b'
                            },
                            right: {
                              type: 'Literal',
                              start: 49,
                              end: 50,
                              range: [49, 50],
                              value: 4,
                              raw: '4'
                            }
                          },
                          {
                            type: 'AssignmentExpression',
                            start: 52,
                            end: 57,
                            range: [52, 57],
                            operator: '=',
                            left: {
                              type: 'Identifier',
                              start: 52,
                              end: 53,
                              range: [52, 53],
                              name: 'c'
                            },
                            right: {
                              type: 'Literal',
                              start: 56,
                              end: 57,
                              range: [56, 57],
                              value: 5,
                              raw: '5'
                            }
                          }
                        ]
                      }
                    ]
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
      '(argument1, [a,b,...rest])',
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
              type: 'SequenceExpression',
              start: 1,
              end: 25,
              range: [1, 25],
              expressions: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 10,
                  range: [1, 10],
                  name: 'argument1'
                },
                {
                  type: 'ArrayExpression',
                  start: 12,
                  end: 25,
                  range: [12, 25],
                  elements: [
                    {
                      type: 'Identifier',
                      start: 13,
                      end: 14,
                      range: [13, 14],
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      start: 15,
                      end: 16,
                      range: [15, 16],
                      name: 'b'
                    },
                    {
                      type: 'SpreadElement',
                      start: 17,
                      end: 24,
                      range: [17, 24],
                      argument: {
                        type: 'Identifier',
                        start: 20,
                        end: 24,
                        range: [20, 24],
                        name: 'rest'
                      }
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
      'f = ( {[x] : z} )',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              right: {
                type: 'ObjectExpression',
                start: 6,
                end: 15,
                range: [6, 15],
                properties: [
                  {
                    type: 'Property',
                    start: 7,
                    end: 14,
                    range: [7, 14],
                    method: false,
                    shorthand: false,
                    computed: true,
                    key: {
                      type: 'Identifier',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      start: 13,
                      end: 14,
                      range: [13, 14],
                      name: 'z'
                    },
                    kind: 'init'
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
      'f(argument1, [...rest])',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'argument1'
                },
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'Identifier',
                        name: 'rest'
                      }
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
      '(0, "b", x);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'SequenceExpression',
              start: 1,
              end: 10,
              range: [1, 10],
              expressions: [
                {
                  type: 'Literal',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  value: 0
                },
                {
                  type: 'Literal',
                  start: 4,
                  end: 7,
                  range: [4, 7],
                  value: 'b'
                },
                {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  range: [9, 10],
                  name: 'x'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a, b, c, 1, 2, 3);',
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
              end: 17,
              range: [1, 17],
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
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  range: [7, 8],
                  name: 'c'
                },
                {
                  type: 'Literal',
                  start: 10,
                  end: 11,
                  range: [10, 11],
                  value: 1
                },
                {
                  type: 'Literal',
                  start: 13,
                  end: 14,
                  range: [13, 14],
                  value: 2
                },
                {
                  type: 'Literal',
                  start: 16,
                  end: 17,
                  range: [16, 17],
                  value: 3
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(a,1,3,b,c,3);',
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
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Literal',
                  value: 3
                },
                {
                  type: 'Identifier',
                  name: 'b'
                },
                {
                  type: 'Identifier',
                  name: 'c'
                },
                {
                  type: 'Literal',
                  value: 3
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(1, a, b);',
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
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(a, 1, b);',
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
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `var a;
    (a) = {};
    (a.b) = {};
    (a['c']) = {};`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 55,
        range: [0, 55],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 6,
            range: [0, 6],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 5,
                range: [4, 5],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'a'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExpressionStatement',
            start: 11,
            end: 20,
            range: [11, 20],
            expression: {
              type: 'AssignmentExpression',
              start: 11,
              end: 19,
              range: [11, 19],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 12,
                end: 13,
                range: [12, 13],
                name: 'a'
              },
              right: {
                type: 'ObjectExpression',
                start: 17,
                end: 19,
                range: [17, 19],
                properties: []
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 25,
            end: 36,
            range: [25, 36],
            expression: {
              type: 'AssignmentExpression',
              start: 25,
              end: 35,
              range: [25, 35],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 26,
                end: 29,
                range: [26, 29],
                object: {
                  type: 'Identifier',
                  start: 26,
                  end: 27,
                  range: [26, 27],
                  name: 'a'
                },
                property: {
                  type: 'Identifier',
                  start: 28,
                  end: 29,
                  range: [28, 29],
                  name: 'b'
                },
                computed: false
              },
              right: {
                type: 'ObjectExpression',
                start: 33,
                end: 35,
                range: [33, 35],
                properties: []
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 41,
            end: 55,
            range: [41, 55],
            expression: {
              type: 'AssignmentExpression',
              start: 41,
              end: 54,
              range: [41, 54],
              operator: '=',
              left: {
                type: 'MemberExpression',
                start: 42,
                end: 48,
                range: [42, 48],
                object: {
                  type: 'Identifier',
                  start: 42,
                  end: 43,
                  range: [42, 43],
                  name: 'a'
                },
                property: {
                  type: 'Literal',
                  start: 44,
                  end: 47,
                  range: [44, 47],
                  value: 'c'
                },
                computed: true
              },
              right: {
                type: 'ObjectExpression',
                start: 52,
                end: 54,
                range: [52, 54],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(x)',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'x',
              start: 1,
              end: 2,
              range: [1, 2],
              loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } }
            },
            start: 0,
            end: 3,
            range: [0, 3],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } }
          }
        ],
        start: 0,
        end: 3,
        range: [0, 3],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } }
      }
    ],
    [
      '(x)',
      Context.OptionsPreserveParens | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ParenthesizedExpression',
              expression: {
                type: 'Identifier',
                name: 'x',
                start: 1,
                end: 2,
                range: [1, 2],
                loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } }
              },
              start: 0,
              end: 3,
              range: [0, 3],
              loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } }
            },
            start: 0,
            end: 3,
            range: [0, 3],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } }
          }
        ],
        start: 0,
        end: 3,
        range: [0, 3],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } }
      }
    ],
    [
      '(a,[b]=c)',
      Context.OptionsRanges | Context.OptionsLoc,
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
                  name: 'a',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } }
                },
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'b',
                        start: 4,
                        end: 5,
                        range: [4, 5],
                        loc: { start: { line: 1, column: 4 }, end: { line: 1, column: 5 } }
                      }
                    ],
                    start: 3,
                    end: 6,
                    range: [3, 6],
                    loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 6 } }
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 7,
                    end: 8,
                    range: [7, 8],
                    loc: { start: { line: 1, column: 7 }, end: { line: 1, column: 8 } }
                  },
                  start: 3,
                  end: 8,
                  range: [3, 8],
                  loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 8 } }
                }
              ],
              start: 1,
              end: 8,
              range: [1, 8],
              loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 8 } }
            },
            start: 0,
            end: 9,
            range: [0, 9],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 9 } }
          }
        ],
        start: 0,
        end: 9,
        range: [0, 9],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 9 } }
      }
    ],
    [
      '(a,[b]=c)',
      Context.OptionsPreserveParens | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ParenthesizedExpression',
              expression: {
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'a',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } }
                  },
                  {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'b',
                          start: 4,
                          end: 5,
                          range: [4, 5],
                          loc: { start: { line: 1, column: 4 }, end: { line: 1, column: 5 } }
                        }
                      ],
                      start: 3,
                      end: 6,
                      range: [3, 6],
                      loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 6 } }
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'c',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      loc: { start: { line: 1, column: 7 }, end: { line: 1, column: 8 } }
                    },
                    start: 3,
                    end: 8,
                    range: [3, 8],
                    loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 8 } }
                  }
                ],
                start: 1,
                end: 8,
                range: [1, 8],
                loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 8 } }
              },
              start: 0,
              end: 9,
              range: [0, 9],
              loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 9 } }
            },
            start: 0,
            end: 9,
            range: [0, 9],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 9 } }
          }
        ],
        start: 0,
        end: 9,
        range: [0, 9],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 9 } }
      }
    ]
  ]);
});
