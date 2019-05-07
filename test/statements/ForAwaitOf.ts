import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';
import * as t from 'assert';
import { parseSource } from '../../src/parser';

describe('Statements - For Await Of', () => {
  for (const arg of [
    'for await (x of []) function d() {};',
    'for await (x of []) function d() {}; return d;',
    'for await (x of []) function* g() {};',
    'for await (x of []) function* g() {}; return g;'
    //'for await (x of []) async function a() {};',
    //'for await (x of []) async function a() {}; return a;'
  ]) {
    it(`async function f() {${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`async function f() {${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`async function f() { 'use strict'; ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { 'use strict'; ${arg} }`, undefined, Context.None);
      });
    });
  }

  for (var decl of ['', 'var', 'let', 'const']) {
    for (var head of ['a', 'a = 0', 'a, b', '[a]', '[a] = 0', '{a}', '{a} = 0']) {
      // Ends with C-style for loop syntax.
      it(`for await (${decl} ${head} ;;) ;`, () => {
        t.throws(() => {
          parseSource(`for await (${decl} ${head} ;;) ;`, undefined, Context.None);
        });
      });

      it(`for await (${decl} ${head} ;;) ;`, () => {
        t.throws(() => {
          parseSource(`for await (${decl} ${head} ;;) ;`, undefined, Context.OptionsWebCompat);
        });
      });

      // Ends with for-in loop syntax.
      it(`for await (${decl} ${head} in null) ;`, () => {
        t.throws(() => {
          parseSource(`for await (${decl} ${head} in null) ;`, undefined, Context.None);
        });
      });
    }
  }

  for (const arg of [
    '(a = 1 of [])',
    '(a = 1) of [])',
    '(a.b = 1 of [])',
    //'((a.b = 1) of [])',
    // "([a] = 1 of [])",
    '(([a] = 1) of [])',
    //"([a = 1] = 1 of [])",
    '(([a = 1] = 1) of [])',
    '([a = 1 = 1, ...b] = 1 of [])',
    '(([a = 1 = 1, ...b] = 1) of [])',
    //   "({a} = 1 of [])",
    '({a} = 1 in [])',
    '(({a} = 1) of [])',
    //"({a: a} = 1 of [])",
    // "({'a': a} = 1 of [])",
    "(({'a': a} = 1) of [])",
    // "({[Symbol.iterator]: a} = 1 of [])",
    '(({[Symbol.iterator]: a} = 1) of [])',
    //"({0: a} = 1 of [])",
    '(({0: a} = 1) of [])',
    // "({a = 1} = 1 of [])",
    '(({a = 1} = 1) of [])',
    // "({a: a = 1} = 1 of [])",
    '(({a: a = 1} = 1) of [])',
    //"({'a': a = 1} = 1 of [])",
    "(({'a': a = 1} = 1) of [])",
    // "({[Symbol.iterator]: a = 1} = 1 of [])",
    '(({[Symbol.iterator]: a = 1} = 1) of [])',
    // "({0: a = 1} = 1 of [])",
    '(({0: a = 1} = 1) of [])',
    '(function a() {} of [])',
    '([1] of [])',
    '({a: 1} of [])',
    '(var a = 1 of [])',
    '(var a, b of [])',
    '(var [a] = 1 of [])',
    '(var [a], b of [])',
    '(var [a = 1] = 1 of [])',
    '(var [a = 1], b of [])',
    '(var [a = 1 = 1, ...b] of [])',
    '(var [a = 1, ...b], c of [])',
    '(var {a} = 1 of [])',
    '(var {a}, b of [])',
    '(var {a: a} = 1 of [])',
    '(var {a: a}, b of [])',
    "(var {'a': a} = 1 of [])",
    "(var {'a': a}, b of [])",
    '(var {"a": a} = 1 of [])',
    '(var {"a": a}, b of [])',
    '(var {[Symbol.iterator]: a} = 1 of [])',
    '(var {[Symbol.iterator]: a}, b of [])',
    '(var {0: a} = 1 of [])',
    '(var {0: a}, b of [])',
    '(var {a = 1} = 1 of [])',
    '(var {a = 1}, b of [])',
    '(var {a: a = 1} = 1 of [])',
    '(var {a: a = 1}, b of [])',
    "(var {'a': a = 1} = 1 of [])",
    "(var {'a': a = 1}, b of [])",
    '(var {"a": a = 1} = 1 of [])',
    '(var {"a": a = 1}, b of [])',
    '(var {[Symbol.iterator]: a = 1} = 1 of [])',
    '(var {[Symbol.iterator]: a = 1}, b of [])',
    '(var {0: a = 1} = 1 of [])',
    '(var {0: a = 1}, b of [])',
    '(let a = 1 of [])',
    '(let a, b of [])',
    '(let [a] = 1 of [])',
    '(let [a], b of [])',
    '(let [a = 1] = 1 of [])',
    '(let [a = 1], b of [])',
    '(let [a = 1, ...b] = 1 of [])',
    '(let [a = 1, ...b], c of [])',
    '(let {a} = 1 of [])',
    '(let {a}, b of [])',
    '(let {a: a} = 1 of [])',
    '(let {a: a}, b of [])',
    "(let {'a': a} = 1 of [])",
    "(let {'a': a}, b of [])",
    '(let {"a": a} = 1 of [])',
    '(let {"a": a}, b of [])',
    '(let {[Symbol.iterator]: a} = 1 of [])',
    '(let {[Symbol.iterator]: a}, b of [])',
    '(let {0: a} = 1 of [])',
    '(let {0: a}, b of [])',
    '(let {a = 1} = 1 of [])',
    '(let {a = 1}, b of [])',
    '(let {a: a = 1} = 1 of [])',
    '(let {a: a = 1}, b of [])',
    "(let {'a': a = 1} = 1 of [])",
    "(let {'a': a = 1}, b of [])",
    '(let {"a": a = 1} = 1 of [])',
    '(let {"a": a = 1}, b of [])',
    '(let {[Symbol.iterator]: a = 1} = 1 of [])',
    '(let {[Symbol.iterator]: a = 1}, b of [])',
    '(let {0: a = 1} = 1 of [])',
    '(let {0: a = 1}, b of [])',
    '(const a = 1 of [])',
    '(const a, b of [])',
    '(const [a] = 1 of [])',
    '(const [a], b of [])',
    '(const [a = 1] = 1 of [])',
    '(const [a = 1], b of [])',
    '(const [a = 1, ...b] = 1 of [])',
    '(const [a = 1, ...b], b of [])',
    '(const {a} = 1 of [])',
    '(const {a}, b of [])',
    '(const {a: a} = 1 of [])',
    '(const {a: a}, b of [])',
    "(const {'a': a} = 1 of [])",
    "(const {'a': a}, b of [])",
    '(const {"a": a} = 1 of [])',
    '(const {"a": a}, b of [])',
    '(const {[Symbol.iterator]: a} = 1 of [])',
    '(const {[Symbol.iterator]: a}, b of [])',
    '(const {0: a} = 1 of [])',
    '(const {0: a}, b of [])',
    '(const {a = 1} = 1 of [])',
    '(const {a = 1}, b of [])',
    '(const {a: a = 1} = 1 of [])',
    '(const {a: a = 1}, b of [])',
    "(const {'a': a = 1} = 1 of [])",
    "(const {'a': a = 1}, b of [])",
    '(const {"a": a = 1} = 1 of [])',
    '(const {"a": a = 1}, b of [])',
    '(const {[Symbol.iterator]: a = 1} = 1 of [])',
    '(const {[Symbol.iterator]: a = 1}, b of [])',
    '(const {0: a = 1} = 1 of [])',
    '(const {0: a = 1}, b of [])',
    '(const a = 0 of b)',
    '(({a}) of 0)',
    '(([a]) of 0)',
    '(var a of b, c)',
    '(a of b, c)',
    '(a in b)',
    '(;;)',
    '(var a of b, c)',
    '(a in b)'
  ]) {
    it(`async function f() { for await ${arg} ; }`, () => {
      t.throws(() => {
        parseSource(`async function f() { for await ${arg} ; }`, undefined, Context.None);
      });
    });

    it(`async function f() { for await ${arg} { } }`, () => {
      t.throws(() => {
        parseSource(`async function f() { for await ${arg} { } }`, undefined, Context.None);
      });
    });

    it(`async function * f() { for await${arg}{ } }`, () => {
      t.throws(() => {
        parseSource(`async function * f() { for await ${arg}{ } }`, undefined, Context.None);
      });
    });
  }

  fail('Statements - For Await (fail)', [
    ['async function fn() { for await ([[x[yield]]] of [[[]]]) }', Context.None],
    ['async function fn() { for await ([ x[yield] ] of [[]]) }', Context.None],
    ['async function fn() { for await ([ x[yield] ] of [[]])', Context.None],
    ['for await (x of xs);', Context.None],
    ['function f() { for await (x of xs); }', Context.None],
    ['f = function() { for await (x of xs); }', Context.None],
    ['f = () => { for await (x of xs); }', Context.None],
    ['async function f() { () => { for await (x of xs); } }', Context.None],
    ['async function f() { for await (x in xs); }', Context.None],
    ['async function f() { for await (;;); }', Context.None],
    ['async function f() { for await (x;;); }', Context.None],
    ['async function f() { for await (let x = 0;;); }', Context.None],
    ['for await ([ x[yield] ] of [[]]) }', Context.None],
    ['for await ([ x[yield] ] in [[]]) }', Context.None],
    ['for await (let [...{ x } = []] = []; a < 1; ) {}', Context.InAwaitContext],
    ['for await (let [...{ x } = []] = []; a < 1; ) {}', Context.Strict],
    ['for await (const line of readLines(filePath)) {\n  console.log(line);\n}', Context.Strict]
  ]);

  for (const arg of [
    '(const [[] = function() {}()] of [[[23]]])',
    '(const [[...x] = [2, 1, 3]] of [[]])',
    '(const [x = 23] of [[undefined]])',
    '(const [{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] of [[]])',
    '(const [...{ 0: v, 1: w, 2: x, 3: y, length: z }] of [[7, 8, 9]])',
    '(const [[,] = g()] of (async function*() { yield* [[[]]]; })())',
    '(const [x = 23] of (async function*() { yield* [[,]]; })())',
    '(const {a, b, ...rest} of (async function*() { yield* [{x: 1, y: 2, a: 5, b: 3}]; })())',
    '(const [x = 23]  of (async function*() { yield* [[,]]; })())',
    '(const { w: { x, y, z } = { x: 4, y: 5, z: 6 } } of [{ w: undefined }])',
    '(const {} of [null])',
    '(let [x] of [{}])',
    '(let [[] = function() {}()] of [[[23]]])',
    '(let [x = 23] of [[]])',
    "(let [w = a(), x = b(), y = c(), z = d()] of [[null, 0, false, '']])",
    '(let [{ x, y, z } = { x: 44, y: 55, z: 66 }] of [[]])',
    '(let [...[,]] of [g()])',
    '(let [, ...x] of [(function*() {})()])',
    '(let [[x, y, z] = [4, 5, 6]] of (async function*() {  yield* [[]]; })())',
    '(let [...{ 0: v, 1: w, 2: x, 3: y, length: z }] of (async function*() {yield* [[7, 8, 9]]; })())',
    '(let [[x, y, z] = [4, 5, 6]] of (async function*() {  yield* [[]]; })())',
    '(let { a } of [b])',
    '(let { x: y = function() {} } of [{}])',
    '(let { w: { x, y, z } = { x: 4, y: 5, z: 6 } } of [{ w: undefined }])',
    '(var [[x, y, z] = [4, 5, 6]] of [[[7, 8, 9]]])',
    '(var [x = 23] of [[,]])',
    '(var [x = 23] of [[undefined]])',
    '({ a: x, y } of [{ a: 3 }])',
    '({ x: { y } } of [{ x: { y: 2 } }])',
    '({...src.y} of [{ x: 1, y: 2}])',
    '(const [arrow = () => {}] of [[]])',
    '(a of [])',
    '(a.b of [])',
    '([a] of [])',
    '([a = 1] of [])',
    '([a = 1, ...b] of [])',
    '({a} of [])',
    '({a: a} of [])',
    "({'a': a} of [])",
    '({"a": a} of [])',
    '({[Symbol.iterator]: a} of [])',
    '({0: a} of [])',
    '({a = 1} of [])',
    '({a: a = 1} of [])',
    "({'a': a = 1} of [])",
    '({"a": a = 1} of [])',
    '({[Symbol.iterator]: a = 1} of [])',
    '({0: a = 1} of [])',
    '(var a of [])',
    '(var [a] of [])',
    '(var [a = 1] of [])',
    '(var [a = 1, ...b] of [])',
    '(var {a} of [])',
    '(var {a: a} of [])',
    "(var {'a': a} of [])",
    '(var {"a": a} of [])',
    '(var {[Symbol.iterator]: a} of [])',
    '(var {0: a} of [])',
    '(var {a = 1} of [])',
    '(var {a: a = 1} of [])',
    "(var {'a': a = 1} of [])",
    '(var {"a": a = 1} of [])',
    '(var {[Symbol.iterator]: a = 1} of [])',
    '(var {0: a = 1} of [])',
    '(let a of [])',
    '(let [a] of [])',
    '(let [a = 1] of [])',
    '(let [a = 1, ...b] of [])',
    '(let {a} of [])',
    '(let {a: a} of [])',
    "(let {'a': a} of [])",
    '(let {"a": a} of [])',
    '(let {[Symbol.iterator]: a} of [])',
    '(let {0: a} of [])',
    '(let {a = 1} of [])',
    '(let {a: a = 1} of [])',
    "(let {'a': a = 1} of [])",
    '(let {"a": a = 1} of [])',
    '(let {[Symbol.iterator]: a = 1} of [])',
    '(let {0: a = 1} of [])',
    '(const a of [])',
    '(const [a] of [])',
    '(const [a = 1] of [])',
    '(const [a = 1, ...b] of [])',
    '(const {a} of [])',
    '(const {a: a} of [])',
    "(const {'a': a} of [])",
    '(const {"a": a} of [])',
    '(const {[Symbol.iterator]: a} of [])',
    '(const {0: a} of [])',
    '(const {a = 1} of [])',
    '(const {a: a = 1} of [])',
    "(const {'a': a = 1} of [])",
    '(const {"a": a = 1} of [])',
    '(const {[Symbol.iterator]: a = 1} of [])',
    '(const {0: a = 1} of [])',
    '([...[x]] of [[ , ]])',
    '([...[x]] of [[undefined]])',
    '([...[x]] of [[]])',
    '([...[x[yield]]] of [[86]])',
    '([...{ 0: x, length }] of [[null]])',
    '([...{ 0: x, length }] of [[ , ]])',
    '([ ...a ] of [[]])',
    '({} of [false])',
    `({} of [0
    ])`,
    '({ x } of [{ x: 1 }])',
    '({ x = 1 } of [{ x: null }])',
    '({ x = 1 } of [{ x: 2 }])',
    '({ a } of [{}])',
    '({ x: x[yield] } of [{ x: 23 }])',
    '({ a: x } of [{ a: 1 }])',
    '({ a: x, } of [{ a: 2 }])',
    '({ xy: x.y } of [{ xy: 4 }])',
    '({...rest} of [{}])',
    '([ _ = flag1 = true, _ = flag2 = true ] of [[14]])',
    '([ xFnexp = function x() {}, fnexp = function() {} ] of [[]])',
    //'([arguments = 4, eval = 5] of [[]])',
    '([[ _ ]] of [[null]])',
    '([[ _ ]] of [[ , ]])',
    '([{ x }] of [[null]])',
    '([{ x }] of [[undefined]])',
    '([{ x }] of [[{ x: 2 }]])',
    '([x.y] of [[23]])',
    `([,] of ['string literal'
])`
  ]) {
    it(`async function f() { for await ${arg} ; }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { for await ${arg} ; }`, undefined, Context.None);
      });
    });

    it(`async function f() { for await ${arg} { } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { for await ${arg} { } }`, undefined, Context.None);
      });
    });

    it(`async function * f() { for await${arg}{ } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { for await ${arg}{ } }`, undefined, Context.None);
      });
    });

    it(`async function f() { for\nawait${arg} { } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { for\nawait${arg} { } }`, undefined, Context.None);
      });
    });

    it(`async function * f() { 'use strict'; for await\n ${arg}{ } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { 'use strict'; for await\n ${arg}{ } }`, undefined, Context.None);
      });
    });

    it(`async function * f() { for\nawait${arg}{ } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { for\nawait${arg}{ } }`, undefined, Context.None);
      });
    });

    it(`async function f() { let a; for await${arg}; }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { let a; for await${arg}; }`, undefined, Context.None);
      });
    });

    it(`async function f() { let a; for await\n ${arg}; }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { let a; for await\n ${arg}; }`, undefined, Context.None);
      });
    });

    it(`async function *f() { let a; for await${arg}; }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function *f() { let a; for await${arg}; }`, undefined, Context.None);
      });
    });

    it(`async function * f() { for await ${arg}; }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { for await ${arg}; }`, undefined, Context.None);
      });
    });

    it(`async function f() { for\nawait ${arg}; }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function f() { for\nawait ${arg}; }`, undefined, Context.None);
      });
    });

    it(`async function * f() { 'use strict'; for await ${arg}; }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { 'use strict'; for await ${arg}; }`, undefined, Context.None);
      });
    });

    it(`async function * f() { 'use strict'; for\nawait ${arg}; }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * f() { 'use strict'; for\nawait ${arg}; }`, undefined, Context.None);
      });
    });
  }

  pass('Statements - For await of (pass)', [
    [
      'async function f() { for await (x of xs); }',
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
                  type: 'ForOfStatement',
                  body: {
                    type: 'EmptyStatement'
                  },
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'xs'
                  },
                  await: true
                }
              ]
            },
            async: true,
            generator: false,
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
      'async function f() { for await (var x of xs); }',
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
                  type: 'ForOfStatement',
                  body: {
                    type: 'EmptyStatement'
                  },
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
                  },
                  right: {
                    type: 'Identifier',
                    name: 'xs'
                  },
                  await: true
                }
              ]
            },
            async: true,
            generator: false,
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
      'async function f() { for await (let x of xs); }',
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
                  type: 'ForOfStatement',
                  body: {
                    type: 'EmptyStatement'
                  },
                  left: {
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
                  },
                  right: {
                    type: 'Identifier',
                    name: 'xs'
                  },
                  await: true
                }
              ]
            },
            async: true,
            generator: false,
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
      'async function f() { for\nawait (x of xs); }',
      Context.None,
      {
        body: [
          {
            async: true,
            body: {
              body: [
                {
                  await: true,
                  body: {
                    type: 'EmptyStatement'
                  },
                  left: {
                    name: 'x',
                    type: 'Identifier'
                  },
                  right: {
                    name: 'xs',
                    type: 'Identifier'
                  },
                  type: 'ForOfStatement'
                }
              ],
              type: 'BlockStatement'
            },
            expression: false,
            generator: false,
            id: {
              name: 'f',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'f = async function() { for await (x of xs); }',
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
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ForOfStatement',
                      body: {
                        type: 'EmptyStatement'
                      },
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'xs'
                      },
                      await: true
                    }
                  ]
                },
                async: true,
                generator: false,
                expression: false,
                id: null
              }
            }
          }
        ]
      }
    ],
    [
      'f = async() => { for await (x of xs); }',
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
                  body: [
                    {
                      type: 'ForOfStatement',
                      body: {
                        type: 'EmptyStatement'
                      },
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'xs'
                      },
                      await: true
                    }
                  ]
                },
                params: [],
                id: null,
                async: true,
                generator: false,
                expression: false
              }
            }
          }
        ]
      }
    ],
    [
      'obj = { async f() { for await (x of xs); } }',
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
                name: 'obj'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'f'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ForOfStatement',
                            body: {
                              type: 'EmptyStatement'
                            },
                            left: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            right: {
                              type: 'Identifier',
                              name: 'xs'
                            },
                            await: true
                          }
                        ]
                      },
                      async: true,
                      generator: false,
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
          }
        ]
      }
    ],
    [
      'class A { async f() { for await (x of xs); } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'f'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ForOfStatement',
                          body: {
                            type: 'EmptyStatement'
                          },
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'xs'
                          },
                          await: true
                        }
                      ]
                    },
                    async: true,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'for (x of xs);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'Identifier',
              name: 'x'
            },
            right: {
              type: 'Identifier',
              name: 'xs'
            },
            await: false
          }
        ]
      }
    ]
  ]);
});
