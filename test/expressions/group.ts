import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';
import * as t from 'assert';
import { parseSource } from '../../src/parser';

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
    '({...a.x} = x);',
    '({...x.x, y})',
    '({...x.x = y, y})',
    '({...x = y, y})',
    '[x.y = a] = z',
    '({..."x".x} = x);',
    '({...{}.x} = x);',
    '([...[].x] = x);',
    '([...{}.x] = x);',
    '({..."x"[x]} = x);',
    '({...[][x]} = x);',
    '({...{}[x]} = x);',
    '([...[][x]] = x);',
    '([...{}[x]] = x);',
    '({...{b: 0}.x} = {});',
    '({...[0].x} = {});',
    '({...{b: 0}[x]} = {});',
    '({...[0][x]} = {});'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict);
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
    '(a,b)+=2',
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
    ['(a,b)=(c,d);', Context.None],
    ['({a = 0});', Context.None],
    ['({a} += 0);', Context.None],
    ['({a,,} = 0)', Context.None],
    ['({,a,} = 0)', Context.None],
    ['({a,,a} = 0)', Context.None],
    ['({function} = 0)', Context.None],
    ['({a:function} = 0)', Context.None],
    ['({a:for} = 0)', Context.None],
    ['({a: b += 0} = {})', Context.None],
    ['[a += b] = []', Context.None],
    ["({'a'} = 0)", Context.None],
    ['({var} = 0)', Context.None],
    ['({a.b} = 0)', Context.None],
    ['({0} = 0)', Context.None],
    ['(a=1)=2', Context.None],
    ['(a=1)+=2', Context.None],
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
    ['async(a = await x);', Context.None],
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
    // ['for ([{x = y}] ;;);', Context.None],
    ['[{x = y}].z', Context.None],
    ['[{x = y}].z = obj', Context.None],
    ['[{x = y}.z] = obj', Context.None],
    ['[{x = y}].z => obj', Context.None],
    ['({a: {x = y}})', Context.None],
    ['({a: {x = y}}.z)', Context.None],
    ['({a: {x = y}.z})', Context.None],
    ['({a: {x = y}}.z = obj)', Context.None],
    ['({a: {x = y}}.z) => obj', Context.None],
    ['({a: {x = y}}).z', Context.None],
    ['(async x => y) = {}', Context.None],
    ['((x, z) => y) = {}', Context.None],
    ['(async (x, z) => y) = {}', Context.None],
    ['async("foo".bar) => x', Context.None],
    ['(...rest - a) => b', Context.None],
    ['(a, ...b - 10) => b', Context.None],
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
    //['(x = (await) = f) => {}', Context.Strict],
    ['async (x = (await) = f) => {}', Context.None],
    //['(x = delete ((await) = f)) => {}', Context.Strict],
    ['async (x = delete ((await) = f)) => {}', Context.None],
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
    ['({xxxx:await}) => null', Context.None],
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
              id: null,
              async: false,
              generator: false,
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
            }
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
            }
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
            }
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
                      name: 'bar'
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
                name: 'baz'
              }
            }
          }
        ]
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: true,
              generator: false,
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
              id: null,
              async: true,
              generator: false,
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
              id: null,
              async: true,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
                name: 'foo'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      '(delete /a/g.x);',
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
                  value: /a/g,
                  regex: {
                    pattern: 'a',
                    flags: 'g'
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: true,
              generator: false,
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
              id: null,
              async: true,
              generator: false,
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
            expression: false,
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
            expression: false,
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
              id: null,
              async: true,
              generator: false,
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
              id: null,
              async: true,
              generator: false,
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
              id: null,
              async: true,
              generator: false,
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
                id: null,
                async: false,
                generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
              id: null,
              async: false,
              generator: false,
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
                        id: null,
                        async: false,
                        generator: false,
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
                      id: null,
                      async: false,
                      generator: false,
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
      '(a = b)',
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
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      '((x));',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      '((((((((((x))))))))));',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      '(a, b);',
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(a = 1, b = 2);',
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
                    name: 'a'
                  },
                  operator: '=',
                  right: {
                    type: 'Literal',
                    value: 1
                  }
                },
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '=',
                  right: {
                    type: 'Literal',
                    value: 2
                  }
                }
              ]
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
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '(a.b) = 1;',
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
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '(a[b]) = 1;',
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
      '(a.b().c().d) = 1;',
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
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {
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
                      arguments: []
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'c'
                    }
                  },
                  arguments: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'd'
                }
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
      '(this.a) = 1;',
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
      '(this[b]) = 1;',
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
      '([[x, y] = z]);',
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
              ]
            }
          }
        ]
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
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {
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
                      arguments: []
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'c'
                    }
                  },
                  arguments: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'd'
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
                      name: 'a'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  }
                ]
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
      '([target()[targetKey()]] = x);',
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
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'target'
                      },
                      arguments: []
                    },
                    computed: true,
                    property: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'targetKey'
                      },
                      arguments: []
                    }
                  }
                ]
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
      '([target()[targetKey(a=b)]] = x);',
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
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'target'
                      },
                      arguments: []
                    },
                    computed: true,
                    property: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'targetKey'
                      },
                      arguments: [
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
                    }
                  }
                ]
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
      '([].length) = y',
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
                  elements: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'length'
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
      '([x].length) = y',
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
                  name: 'length'
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
      '({}.length) = z',
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
                  type: 'ObjectExpression',
                  properties: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'length'
                }
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
      '({x: y}.length) = z',
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
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'length'
                }
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
    // ['(true)', Context.None, {}],
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
      '(++/[^\x0f+-\x6d+$-)-]/giuy[(0[true] = {})])',
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
                  value: /[^+-m+$-)-]/giuy,
                  regex: {
                    pattern: '[^\u000f+-m+$-)-]',
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
      '({[x](){}});',
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
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
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
      '({ident: [foo, bar].join("")})',
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
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          {
                            type: 'Identifier',
                            name: 'bar'
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'join'
                      }
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: ''
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
      '({ident: [foo, bar] + x})',
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
                    type: 'BinaryExpression',
                    left: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        {
                          type: 'Identifier',
                          name: 'bar'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '+'
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
      '({ident: {x: y}})',
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
      '({ident: {x}})',
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
      '({ident: {x: y}.join("")})',
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
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
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
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'join'
                      }
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: ''
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
      '({ident: {x:y}/x})',
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
                    type: 'BinaryExpression',
                    left: {
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
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
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
      '({ident: {x:y}/x/g})',
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
                      right: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      operator: '/'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'g'
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
      '(delete foo.bar);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                computed: false,
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ],
        sourceType: 'script'
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
      '([a / b]);',
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
      '(foo + (bar + boo) + ding)',
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
                  name: 'foo'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'boo'
                  },
                  operator: '+'
                },
                operator: '+'
              },
              right: {
                type: 'Identifier',
                name: 'ding'
              },
              operator: '+'
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
      '[(a) = 0] = 1',
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
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      value: 0
                    }
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
      '[(a.b)] = 0',
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
                      name: 'a'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'b'
                    }
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
      '({a:(b)} = 0)',
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
                type: 'Literal',
                value: 0
              }
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
      '({a:(b.c)} = 0)',
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
      '({a:(b = 0)})',
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
            }
          }
        ]
      }
    ],
    [
      'c = ({b} = b);',
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
                name: 'c'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
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
                  name: 'b'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '({b} = b);',
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
                      name: 'b'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
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
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      '([b] = b);',
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
                    name: 'b'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      '({a, b} = {a: 1, b: 2});',
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
                      name: 'b'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
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
                      name: 'a'
                    },
                    value: {
                      type: 'Literal',
                      value: 1
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
                      name: 'b'
                    },
                    value: {
                      type: 'Literal',
                      value: 2
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
                      name: 'responseText'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'text'
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
                name: 'res'
              }
            }
          }
        ]
      }
    ],
    [
      '(a) = {}',
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
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
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
                name: 'test'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
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
      '(f().a) = 1;',
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
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'f'
                  },
                  arguments: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'a'
                }
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
      '(obj[0]) = 1;',
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
                  name: 'obj'
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 0
                }
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
      '(obj.a) = 1;',
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
                  name: 'obj'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'a'
                }
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
      '({a:((((a1))))} = {a:20})',
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
                      name: 'a1'
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
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Literal',
                      value: 20
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
      '({a:a1 = r1 = 44} = {})',
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
                        name: 'a1'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'r1'
                        },
                        operator: '=',
                        right: {
                          type: 'Literal',
                          value: 44
                        }
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
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '({a:a1 = r1} = {})',
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
                        name: 'a1'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'r1'
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
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '[...{a}] = [{}]',
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
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ObjectExpression',
                    properties: []
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({x:z = 1, x1:y = 20} = {});',
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
                        name: 'z'
                      },
                      right: {
                        type: 'Literal',
                        value: 1
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
                      name: 'x1'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      right: {
                        type: 'Literal',
                        value: 20
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
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '({ x } = { x: 3 });',
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
                      value: 3
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
      '[{x:x, y:y}, [a,b,c]]',
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
                        type: 'Identifier',
                        name: 'x'
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
                        name: 'y'
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
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    },
                    {
                      type: 'Identifier',
                      name: 'c'
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
      '[x.a=a] = 0',
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
                        name: 'a'
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'a'
                    }
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
                      name: 'q'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'q'
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
          }
        ]
      }
    ],
    [
      ' (true ? { x = true } = {} : { x = false } = {})',
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
                type: 'Literal',
                value: true
              },
              consequent: {
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
                          value: true
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
              },
              alternate: {
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
                          value: false
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
          }
        ]
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
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '+=',
                  right: {
                    type: 'Literal',
                    value: 1
                  }
                }
              },
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'd'
                  },
                  operator: '+=',
                  right: {
                    type: 'Literal',
                    value: 1
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      '[...z = 1]',
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
                      name: 'z'
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
          }
        ]
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
                            type: 'Literal',
                            value: 1
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
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 0
                  },
                  {
                    type: 'ObjectExpression',
                    properties: []
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[x, {y = 1}] = [0, {}]',
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
                            type: 'Literal',
                            value: 1
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
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 0
                  },
                  {
                    type: 'ObjectExpression',
                    properties: []
                  }
                ]
              }
            }
          }
        ]
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
            expression: false,
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
                name: 'a0'
              },
              arguments: [
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
                        type: 'Literal',
                        value: 1
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
                  name: 'a'
                }
              },
              right: {
                type: 'Literal',
                value: 1
              },
              operator: '==='
            }
          }
        ]
      }
    ],
    [
      '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};',
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
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            value: 1
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
                            value: 2
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
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
                          type: 'Literal',
                          value: 3
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
                          value: 4
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        right: {
                          type: 'Literal',
                          value: 5
                        }
                      }
                    ]
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
      'f = (argument1, [a,b,c])',
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
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'argument1'
                  },
                  {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      },
                      {
                        type: 'Identifier',
                        name: 'b'
                      },
                      {
                        type: 'Identifier',
                        name: 'c'
                      }
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'f = (argument1, { x : x, y : y = 42 })',
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
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'argument1'
                  },
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
                          type: 'Identifier',
                          name: 'x'
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
                          name: 'y'
                        },
                        value: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          operator: '=',
                          right: {
                            type: 'Literal',
                            value: 42
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
          }
        ]
      }
    ],
    [
      'f = (argument1, [{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]])',
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
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'argument1'
                  },
                  {
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
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              operator: '=',
                              right: {
                                type: 'Literal',
                                value: 1
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
                              name: 'y'
                            },
                            value: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'y'
                              },
                              operator: '=',
                              right: {
                                type: 'Literal',
                                value: 2
                              }
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      {
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
                              type: 'Literal',
                              value: 3
                            }
                          },
                          {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'b'
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 4
                            }
                          },
                          {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'c'
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 5
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
        ]
      }
    ],
    [
      '(argument1, [a,b,...rest])',
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
                  name: 'argument1'
                },
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    },
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
      'f = ( {[x] : z} )',
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
                      name: 'z'
                    },
                    kind: 'init',
                    computed: true,
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
                  type: 'Literal',
                  value: 'b'
                },
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(a, b, c, 1, 2, 3);',
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
                  type: 'Identifier',
                  name: 'c'
                },
                {
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Literal',
                  value: 2
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
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'a'
                }
              }
            ]
          },
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
                type: 'ObjectExpression',
                properties: []
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
          },
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
                  type: 'Literal',
                  value: 'c'
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
    ]
  ]);
});
