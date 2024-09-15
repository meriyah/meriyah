import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Functions', () => {
  for (const arg of [
    '...x = []',
    '[...[ x ] = []]',
    '[...x = []]',
    '[...{ x } = []]',
    '[...[x], y]',
    '[...x, y]',
    '[...{ x }, y]',
    '[...[ x ] = []] = []',
    '[...x = []] = []',
    '[...{ x } = []] = []',
    '[...[x], y] = [1, 2, 3]',
    '[...x, y] = [1, 2, 3]',
    '[...{ x }, y] = [1, 2, 3]',
    '...a,'
  ]) {
    it(`(function (${arg}) {})`, () => {
      t.throws(() => {
        parseSource(`(function (${arg}) {})`, undefined, Context.None);
      });

      t.throws(() => {
        parseSource(`const foo = (function (${arg}) {})`, undefined, Context.None);
      });

      it(`(function (${arg}) {})`, () => {
        t.throws(() => {
          parseSource(`(function (${arg}) {})`, undefined, Context.Strict | Context.Module);
        });
      });
    });
  }

  for (const arg of [
    '(function([...{ x }, y] = [1, 2, 3]) {})',
    '(function([...[ x ] = []] = []) {})',
    '(function([...[x], y]) {})',
    '(function([...[x], y]) {})',
    '(function([...[ x ] = []]) {})',
    '0, function(...x = []) {}',
    '0, function(...x = []) {};'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.throws(() => {
        parseSource(`function foo() { ${arg}}`, undefined, Context.None);
      });
    });

    it(`(function foo() { ${arg}})`, () => {
      t.throws(() => {
        parseSource(`(function foo() { ${arg}})`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  for (const arg of [
    '{...x}',
    '{ x: y }',
    '{ x, }',
    '{ x: y = 33 }',
    '{ fn = function () {}, xFn = function x() {} }',
    '{ cover = (function () {}), xCover = (0, function() {})  }',
    '{ arrow = () => {} }',
    '{}',
    '{ x: y } = { x: 23 }',
    '{ poisoned: x = ++initEvalCount } = poisonedProperty',
    '{ w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] }',
    '{ x, } = { x: 23 }',
    '[,] = g()',
    '[{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] = []',
    '[{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]',
    '[{ x, y, z } = { x: 44, y: 55, z: 66 }] = []',
    '[x = 23] = [,]',
    '[[...x] = [2, 1, 3]] = []',
    '[[x, y, z] = [4, 5, 6]] = []',
    '[ , , ...x]',
    '[, ...x]',
    '[,]',
    '[{ x }]',
    '[{ x }]',
    '[{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }]',
    '[ a = b ]',
    '[x = 23]',
    '[[] = function() { a += 1; }()]',
    'x = args = arguments'
  ]) {
    it(`(function(${arg}) {})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function(${arg}) {})`, undefined, Context.None);
      });
    });
  }

  const validSyntax = [
    '(function([[,] = function* g() {}]) {})',
    '(function([cover = (function () {}), xCover = (0, function() {})]) {})',
    '(function([fn = function () {}, xFn = function x() {}]) {})',
    '(function([x = 23]) {})',
    '(function([...[x, y, z]]) {})',
    '(function([...[,]]) {})',
    '(function([...x]) {})',
    '(function([...{ length }]) {})',
    '(function([x = 23] = [undefined]) {})',
    'function a5({a3, b2: { ba1, ...ba2 }, ...c3}) {}',
    'function a6({a3, b2: { ba1, ...ba2 } }) {}',
    'function a7({a1 = 1, ...b1} = {}) {}',
    '(function a5({a3, b2: { ba1, ...ba2 }, ...c3}) {})',
    '(function a6({a3, b2: { ba1, ...ba2 } }) {})',
    '(function a7({a1 = 1, ...b1} = {}) {})',
    '(function a8([{...a1}]) {})',
    '(function a9([{a1, ...a2}]) {})',
    '(function a10([a1, {...a2}]) {})',
    '(function b2(a, ...b) {})',
    'f( ({...c}=o, c) )',
    '(function fn({a = 1, ...b} = {}) {   return {a, b}; })',
    `function iceFapper(idiot) {}`,
    '(function([{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] = [{ u: 777, w: 888, y: 999 }]) {})',
    '(function({} = null) {})',
    'function f({foo}){}',
    'function f({foo:a}){}',
    'function f({foo:a=b}){}',
    'function f({foo}, bar){}',
    'function f(foo, {bar}){}',
    'function f({foo} = x, b){}',
    'function f({foo} = x, b = y){}',
    'function f(x, {foo} = y){}',
    'function f(x = y, {foo} = z){}',
    'function f({foo=a} = x){}',
    'function f([]){}',
    'function f([] = x){}',
    'function f([,]){}',
    'function f([,] = x){}',
    'function f([,,]){}',
    'function f([,,] = x){}',
    'function f([foo]){}',
    'function f([foo] = x){}',
    'function f([foo,]){}',
    'function f([foo,] = x){}',
    'function f([foo,,]){}',
    'function f([foo,,] = x){}',
    'function f([,foo]){}',
    'function f([,foo] = x){}',
    'function f([,,foo]){}',
    'function f([,,foo] = x){}',
    'function f([foo,bar]){}',
    'function f([foo,bar] = x){}',
    'function f([foo,,bar]){}',
    'function f([foo,,bar] = x){}',
    'function f([foo], [bar]){}',
    'function f([foo] = x, [bar] = y){}',
    'function f([foo], b){}',
    'function f([foo] = x, b){}',
    'function f([foo], b = y){}',
    'function f([foo] = x, b = y){}',
    'function f(x, [foo]){}',
    'function f(x, [foo] = y){}',
    'function f(x = y, [foo] = z){}',
    'function f(x = y, [foo]){}',
    'function f([foo=a]){}',
    'function a() {  function get(directory) { }  }',
    'function f([foo=a] = c){}',
    'function f([foo=a,bar]){}',
    'function f([foo=a,bar] = x){}',
    'function f([foo,bar=b]){}',
    'function f([foo,bar=b] = x){}',
    'function f([foo=a,bar=b]){}',
    'function f([foo=a,bar=b] = x){}',
    'function f([...bar] = obj){}',
    'function f([]){}',
    'function f([] = x){}',
    'function f([,]){}',
    'function f([,] = x){}',
    'function f([,,]){}',
    'function f([,,] = x){}',
    'function f([foo]){}',
    'function f([foo] = x){}',
    'function f([foo,]){}',
    'function f([foo,] = x){}',
    'function f([foo,,]){}',
    'function f([foo,,] = x){}',
    'function f([,foo]){}',
    'function f([,foo] = x){}',
    'function f([,,foo]){}',
    'function f([,,foo] = x){}',
    'function f([,,async] = x){}',
    'function f([foo,bar]){}',
    'function f(async,){}',
    'function f([,async]){}',
    'function f(async = 1){}',
    'function f(foo, async = 1){}',
    'function f([foo,bar] = x){}',
    'function f([foo,,bar]){}',
    'function f([foo,,bar] = x){}',
    'function f([foo], [bar]){}',
    'function f([foo], [async]){}',
    'function f([foo] = x, [bar] = y){}',
    'function f([foo], b){}',
    'function f([foo] = x, b){}',
    'function f([foo], b = y){}',
    `(function foo(y, z) {{ function x() {} } })(1);`,
    // Complex parameter shouldn't be shadowed
    `(function foo(x = 0) { var x; { function x() {} } })(1);`,
    // Nested complex parameter shouldn't be shadowed
    `(function foo([[x]]) {var x; {function x() {} } })([[1]]);`,
    // Complex parameter shouldn't be shadowed
    `(function foo(x = 0) { var x; { function x() {}} })(1);`,
    // Nested complex parameter shouldn't be shadowed
    `(function foo([[x]]) { var x;{ function x() {} }  })([[1]]);`,
    // Rest parameter shouldn't be shadowed
    `(function foo(...x) { var x; {  function x() {}  } })(1);`,
    // Don't shadow complex rest parameter
    `(function foo(...[x]) { var x; { function x() {} } })(1);`,
    // Hoisting is not affected by other simple parameters
    `(function foo(y, z) {{function x() {}} })(1);`,
    // Hoisting is not affected by other complex parameters
    ` (function foo([y] = [], z) {{function x() {} } })();`,
    // Should allow shadowing function names
    `{(function foo() { { function foo() { return 0; } } })();}`,
    `{(function foo(...r) { { function foo() { return 0; } } })(); }`,
    `(function foo() { { let f = 0; (function () { { function f() { return 1; } } })(); } })();`,
    `(function foo() { var y = 1; (function bar(x = y) { { function y() {} } })();  })();`,
    `(function foo() { { function f() { return 4; } { function f() { return 5; } } }})()`,
    '(function foo(a = 0) { { let y = 3; function f(b = 0) { y = 2; } f(); } })();',
    '(function conditional() {  if (true) { function f() { return 1; } } else {  function f() { return 2; }} if (false) { function g() { return 1; }}  L: {break L;function f() { return 3; } }})();',
    '(function foo() {function outer() { return f; } { f = 1; function f () {} f = ""; } })();',
    '(function foo(x) { {  function x() {} } })(1);',
    '(function foo([[x]]) { { function x() {}}})([[1]]);',
    // rest parameter shouldn't be shadowed
    '(function shadowingRestParameterDoesntBind(...x) { {  function x() {} } })(1);'
  ];

  for (const arg of validSyntax) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  for (const arg of [
    `(function package() { (function gave_away_the_package() { "use strict"; }) })`,
    `(function (eval) { (function () { "use strict"; })})`
  ]) {
    it(arg, () => {
      t.doesNotThrow(() => {
        parseSource(arg, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Functions (fail)', [
    ['(function foo(007){ "use strict"; })', Context.None],
    ['(function foo(){ "use strict"; 007 })', Context.None],
    ['"use strict"; (function foo(){  007 })', Context.None],
    ['(function break(){})', Context.None],
    ['(function function(){})', Context.None],
    ['function f(1, async = 1){}', Context.None],
    ['function f("abc", async = 1){}', Context.None],
    ['function f(1, async = b){}', Context.None],
    ['(function implements(){})', Context.Strict],
    ['(function public(){})', Context.Strict],
    ['(function let(){})', Context.Strict],
    ['(async function await(){})', Context.None],
    ['(function f([...foo, bar] = obj){})', Context.None],
    ['function f([...foo,,] = obj){}', Context.None],
    ['function f([...[a, b],,] = obj){}', Context.None],
    ['function f([...bar = foo] = obj){}', Context.None],
    ['function f([... ...foo] = obj){}', Context.None],
    ['function f([...] = obj){} ', Context.None],
    ['function f([...,] = obj){}', Context.None],
    ['function f([.x] = obj){}', Context.None],
    ['function f([..x] = obj){}', Context.None],
    ['function f({,} = x){} ', Context.None],
    ['function f({,,} = x){}', Context.None],
    ['function f({foo,,} = x){}', Context.None],
    ['function f({,foo} = x){}', Context.None],
    ['function f({,,foo} = x){}', Context.None],
    ['function f({,,async} = await){}', Context.None],
    ['function f({foo,,bar} = x){}', Context.None],
    ['function f({...{a: b}}){}', Context.None],
    ['function f({...a.b}){}', Context.None],
    ['function p\\u0061ckage() { "use strict"; }', Context.None],
    ['function package() { "use strict"; }', Context.None]
  ]);

  pass('Expressions - Functions (pass)', [
    [
      `function f(async = await){}`,
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
                  name: 'async'
                },
                right: {
                  type: 'Identifier',
                  name: 'await'
                }
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
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      `function f([async = await]){}`,
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
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'await'
                    }
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
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      `(function () {
        let q;
        let w;
        let e;
        if (true) [q, w, e] = [1, 2, 3].map(()=>123);
      })();`,
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
                type: 'FunctionExpression',
                params: [],
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
                            name: 'q'
                          }
                        }
                      ]
                    },
                    {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'w'
                          }
                        }
                      ]
                    },
                    {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'e'
                          }
                        }
                      ]
                    },
                    {
                      type: 'IfStatement',
                      test: {
                        type: 'Literal',
                        value: true
                      },
                      consequent: {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'Identifier',
                                name: 'q'
                              },
                              {
                                type: 'Identifier',
                                name: 'w'
                              },
                              {
                                type: 'Identifier',
                                name: 'e'
                              }
                            ]
                          },
                          operator: '=',
                          right: {
                            type: 'CallExpression',
                            callee: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ArrayExpression',
                                elements: [
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
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'map'
                              }
                            },
                            arguments: [
                              {
                                type: 'ArrowFunctionExpression',
                                body: {
                                  type: 'Literal',
                                  value: 123
                                },
                                params: [],

                                async: false,
                                expression: true
                              }
                            ]
                          }
                        }
                      },
                      alternate: null
                    }
                  ]
                },
                async: false,
                generator: false,

                id: null
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      `function somethingAdvanced({topLeft: {x: x1, y: y1} = {}, bottomRight: {x: x2, y: y2} = {}}, p2, p3){

        }

        function unpackObject({title: title, author: author}) {
          return title + " " + author;
        }

        console.log(unpackObject({title: "title", author: "author"}));

        var unpackArray = function ([a, b, c], [x, y, z]) {
          return a+b+c;
        };

        console.log(unpackArray(["hello", ", ", "world"], [1, 2, 3]));`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'topLeft'
                    },
                    computed: false,
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'x1'
                            },
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'y1'
                            },
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      right: {
                        type: 'ObjectExpression',
                        properties: []
                      }
                    },
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'bottomRight'
                    },
                    computed: false,
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'x2'
                            },
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'y2'
                            },
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      right: {
                        type: 'ObjectExpression',
                        properties: []
                      }
                    },
                    method: false,
                    shorthand: false
                  }
                ]
              },
              {
                type: 'Identifier',
                name: 'p2'
              },
              {
                type: 'Identifier',
                name: 'p3'
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
              name: 'somethingAdvanced'
            }
          },
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'title'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'title'
                    },
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'author'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'author'
                    },
                    method: false,
                    shorthand: false
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'title'
                      },
                      right: {
                        type: 'Literal',
                        value: ' '
                      },
                      operator: '+'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'author'
                    },
                    operator: '+'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'unpackObject'
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
                  name: 'console'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'log'
                }
              },
              arguments: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'unpackObject'
                  },
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'title'
                          },
                          value: {
                            type: 'Literal',
                            value: 'title'
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
                            name: 'author'
                          },
                          value: {
                            type: 'Literal',
                            value: 'author'
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
              ]
            }
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'FunctionExpression',
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
                        },
                        {
                          type: 'Identifier',
                          name: 'c'
                        }
                      ]
                    },
                    {
                      type: 'ArrayPattern',
                      elements: [
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
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: {
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
                            type: 'Identifier',
                            name: 'c'
                          },
                          operator: '+'
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,

                  id: null
                },
                id: {
                  type: 'Identifier',
                  name: 'unpackArray'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'console'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'log'
                }
              },
              arguments: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'unpackArray'
                  },
                  arguments: [
                    {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'Literal',
                          value: 'hello'
                        },
                        {
                          type: 'Literal',
                          value: ', '
                        },
                        {
                          type: 'Literal',
                          value: 'world'
                        }
                      ]
                    },
                    {
                      type: 'ArrayExpression',
                      elements: [
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
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(function(){})',
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
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: null
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(function f(){})',
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
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(function*(){})',
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
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: true,

                  id: null
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(function* f(){})',
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
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
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
          }
        ]
      }
    ],
    [
      'foo(async function(){})',
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
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: true,
                  generator: false,

                  id: null
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(function (x = yield) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
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
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      'foo(async function f(){})',
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
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: true,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(function f(...rest){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'rest'
                  }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f(a, b, ...rest){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
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
                    name: 'rest'
                  }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      'typeof async function f(){}',
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
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: true,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'x = function f(a = b,){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([x],){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f({a},){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        method: false,
                        shorthand: true
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([x] = y,){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f({a} = b,){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          kind: 'init',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          computed: false,
                          value: {
                            type: 'Identifier',
                            name: 'a'
                          },
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
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f(a=b){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f(a=b=c){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                      operator: '=',
                      right: {
                        type: 'Identifier',
                        name: 'c'
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

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: []
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: []
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([,]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [null]
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([,] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [null]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([,,]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [null, null]
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([,,] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [null, null]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,,]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      null
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,,] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        null
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([,foo]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      null,
                      {
                        type: 'Identifier',
                        name: 'foo'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([,foo] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        null,
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([,,foo]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      null,
                      null,
                      {
                        type: 'Identifier',
                        name: 'foo'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([,,foo] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        null,
                        null,
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,bar]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,bar] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
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
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,,bar]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      null,
                      {
                        type: 'Identifier',
                        name: 'bar'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,,bar] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        null,
                        {
                          type: 'Identifier',
                          name: 'bar'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo], [bar]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    ]
                  },
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'bar'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo] = x, [bar] = y){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'bar'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo], b){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    ]
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo] = x, b){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo], b = y){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    ]
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo] = x, b = y){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f(x, [foo]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f(x, [foo] = y){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f(x = y, [foo] = z){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
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
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'z'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f(x = y, [foo]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
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
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo=a]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'a'
                        }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo=a] = c){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'a'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'c'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo=a,bar]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      {
                        type: 'Identifier',
                        name: 'bar'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo=a,bar] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'a'
                          }
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
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,bar=b]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'b'
                        }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo,bar=b] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'bar'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'b'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo=a,bar=b]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'b'
                        }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo=a,bar=b] = x){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'a'
                          }
                        },
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'bar'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'b'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([a=b=c]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                            type: 'Identifier',
                            name: 'b'
                          },
                          operator: '=',
                          right: {
                            type: 'Identifier',
                            name: 'c'
                          }
                        }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([a=b+=c]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                            type: 'Identifier',
                            name: 'b'
                          },
                          operator: '+=',
                          right: {
                            type: 'Identifier',
                            name: 'c'
                          }
                        }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([a = b = c] = arr){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
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
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'arr'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f({b: []}) {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        computed: false,
                        value: {
                          type: 'ArrayPattern',
                          elements: []
                        },
                        method: false,
                        shorthand: false
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([{b}]) {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'b'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'b'
                            },
                            method: false,
                            shorthand: true
                          }
                        ]
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([a, {b: []}]) {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      },
                      {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'b'
                            },
                            computed: false,
                            value: {
                              type: 'ArrayPattern',
                              elements: []
                            },
                            method: false,
                            shorthand: false
                          }
                        ]
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function fk({x: [a, {b: []}]}) {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'a'
                            },
                            {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  kind: 'init',
                                  key: {
                                    type: 'Identifier',
                                    name: 'b'
                                  },
                                  computed: false,
                                  value: {
                                    type: 'ArrayPattern',
                                    elements: []
                                  },
                                  method: false,
                                  shorthand: false
                                }
                              ]
                            }
                          ]
                        },
                        method: false,
                        shorthand: false
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
                  name: 'fk'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([a, [b], c]) {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      },
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'b'
                          }
                        ]
                      },
                      {
                        type: 'Identifier',
                        name: 'c'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([...bar]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'bar'
                        }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([...bar] = obj){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'Identifier',
                            name: 'bar'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'obj'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo, ...bar]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'bar'
                        }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([foo, ...bar] = obj){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'Identifier',
                            name: 'bar'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'obj'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([...[a, b]]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([...[a, b]] = obj){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {
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
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'obj'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([x, ...[a, b]]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f([x, ...[a, b]] = obj){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                          type: 'RestElement',
                          argument: {
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
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'obj'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f( [a=[...b], ...c]){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
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
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'SpreadElement',
                              argument: {
                                type: 'Identifier',
                                name: 'b'
                              }
                            }
                          ]
                        }
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'c'
                        }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f( [a=[...b], ...c] = obj){}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
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
                            type: 'ArrayExpression',
                            elements: [
                              {
                                type: 'SpreadElement',
                                argument: {
                                  type: 'Identifier',
                                  name: 'b'
                                }
                              }
                            ]
                          }
                        },
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'Identifier',
                            name: 'c'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'obj'
                    }
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'f = ([[,] = g()]) => {};',
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
      'x = function *await() {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: true,

                id: {
                  type: 'Identifier',
                  name: 'await'
                }
              }
            }
          }
        ]
      }
    ],
    [
      ' f = function yield() {}',
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
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'yield'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'f = function await() {}',
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
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'await'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'f = function *await() {}',
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
                  body: []
                },
                async: false,
                generator: true,

                id: {
                  type: 'Identifier',
                  name: 'await'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f(yield) {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'yield'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = async function f(yield) {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'yield'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: true,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f(await) {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'await'
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
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = function *f(await) {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'await'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: true,

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],

    [
      '(function foo({x:x = 10}) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
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
                      method: false,
                      shorthand: false
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo([x1 = 1], [y1 = 2]) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      right: {
                        type: 'Literal',
                        value: 1
                      }
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
                        name: 'y1'
                      },
                      right: {
                        type: 'Literal',
                        value: 2
                      }
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo({x1:x1 = 1, x2:x2 = 2, x3:x3 = 3}) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x1'
                        },
                        right: {
                          type: 'Literal',
                          value: 1
                        }
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x2'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x2'
                        },
                        right: {
                          type: 'Literal',
                          value: 2
                        }
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x3'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x3'
                        },
                        right: {
                          type: 'Literal',
                          value: 3
                        }
                      },
                      method: false,
                      shorthand: false
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo([x1 = 1, x2 = 2, x3 = 3]) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x1'
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
                        name: 'x2'
                      },
                      right: {
                        type: 'Literal',
                        value: 2
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x3'
                      },
                      right: {
                        type: 'Literal',
                        value: 3
                      }
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo({x1:x1 = 1}, [y1 = 2]) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x1'
                        },
                        right: {
                          type: 'Literal',
                          value: 1
                        }
                      },
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
                        name: 'y1'
                      },
                      right: {
                        type: 'Literal',
                        value: 2
                      }
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo([x1 = 1], {y1:y1 = 2}) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      right: {
                        type: 'Literal',
                        value: 1
                      }
                    }
                  ]
                },
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'y1'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'y1'
                        },
                        right: {
                          type: 'Literal',
                          value: 2
                        }
                      },
                      method: false,
                      shorthand: false
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo({x:x} = {x:1}) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        method: false,
                        shorthand: false
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
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      `function test() {
        let ID = "1|123456";
        return (([id, obj]) => ({[id = id.split('|')[1]]: {id: id}}))([ID, {}]);
    }`,
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
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: '1|123456'
                      },
                      id: {
                        type: 'Identifier',
                        name: 'ID'
                      }
                    }
                  ]
                },
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'CallExpression',
                    callee: {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'id'
                              },
                              operator: '=',
                              right: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'CallExpression',
                                  callee: {
                                    type: 'MemberExpression',
                                    object: {
                                      type: 'Identifier',
                                      name: 'id'
                                    },
                                    computed: false,
                                    property: {
                                      type: 'Identifier',
                                      name: 'split'
                                    }
                                  },
                                  arguments: [
                                    {
                                      type: 'Literal',
                                      value: '|'
                                    }
                                  ]
                                },
                                computed: true,
                                property: {
                                  type: 'Literal',
                                  value: 1
                                }
                              }
                            },
                            value: {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'id'
                                  },
                                  value: {
                                    type: 'Identifier',
                                    name: 'id'
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false
                                }
                              ]
                            },
                            kind: 'init',
                            computed: true,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      params: [
                        {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'id'
                            },
                            {
                              type: 'Identifier',
                              name: 'obj'
                            }
                          ]
                        }
                      ],

                      async: false,
                      expression: true
                    },
                    arguments: [
                      {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'ID'
                          },
                          {
                            type: 'ObjectExpression',
                            properties: []
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'test'
            }
          }
        ]
      }
    ],
    [
      '(function foo([x] = [1]) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
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
                    elements: [
                      {
                        type: 'Literal',
                        value: 1
                      }
                    ]
                  }
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo({x:x = 1} = {x:2}) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
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
                        method: false,
                        shorthand: false
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
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo([x = 1] = [2]) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
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
                          value: 1
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Literal',
                        value: 2
                      }
                    ]
                  }
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo({x1:[y1 = 1]}) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      computed: false,
                      value: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'y1'
                            },
                            right: {
                              type: 'Literal',
                              value: 1
                            }
                          }
                        ]
                      },
                      method: false,
                      shorthand: false
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo([x1, {y1:y1 = 1}]) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x1'
                    },
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          kind: 'init',
                          key: {
                            type: 'Identifier',
                            name: 'y1'
                          },
                          computed: false,
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'y1'
                            },
                            right: {
                              type: 'Literal',
                              value: 1
                            }
                          },
                          method: false,
                          shorthand: false
                        }
                      ]
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo({x1:[y1 = 1] = [2]} = {x1:[3]}) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x1'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'y1'
                                },
                                right: {
                                  type: 'Literal',
                                  value: 1
                                }
                              }
                            ]
                          },
                          right: {
                            type: 'ArrayExpression',
                            elements: [
                              {
                                type: 'Literal',
                                value: 2
                              }
                            ]
                          }
                        },
                        method: false,
                        shorthand: false
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
                          name: 'x1'
                        },
                        value: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'Literal',
                              value: 3
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
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function foo([{y1:y1 = 1} = {y1:2}] = [{y1:3}]) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              kind: 'init',
                              key: {
                                type: 'Identifier',
                                name: 'y1'
                              },
                              computed: false,
                              value: {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'y1'
                                },
                                right: {
                                  type: 'Literal',
                                  value: 1
                                }
                              },
                              method: false,
                              shorthand: false
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
                                name: 'y1'
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
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'y1'
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
                    ]
                  }
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(function *fn( x1, {x2, x3}, [x4, x5], x6  ) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'x1'
                },
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x2'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x2'
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x3'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x3'
                      },
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
                      name: 'x4'
                    },
                    {
                      type: 'Identifier',
                      name: 'x5'
                    }
                  ]
                },
                {
                  type: 'Identifier',
                  name: 'x6'
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'fn'
              }
            }
          }
        ]
      }
    ],
    [
      '(function *fn(  {x1:x1, x2:x2, x3:x3}, {y1:y1, y1:y2} ) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x2'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x2'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x3'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x3'
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'y1'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'y1'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'y1'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'y2'
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'fn'
              }
            }
          }
        ]
      }
    ],
    [
      '(function *fn({x:x}, y  ) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'fn'
              }
            }
          }
        ]
      }
    ],
    [
      '(function *fn( {x1:x1}, [y1]  ) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'y1'
                    }
                  ]
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'fn'
              }
            }
          }
        ]
      }
    ],
    [
      '(async function([,]) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [null]
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: true,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      '(async function({x:x}) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: true,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      '(async function(y, {x:x}) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'y'
                },
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: true,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      '( [x], [y], [z]) => x;',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'z'
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
      '( {x1:x1}, [y1]) => x;',
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
                        name: 'x1'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'x1'
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
                      type: 'Identifier',
                      name: 'y1'
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
      '( {x}) => x;',
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
      `if (a && b) {
      c.d(this.e, (ctx) => a.b(this, void 0, void 0, function* () {
        return a
      }));
    }`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'Identifier',
                name: 'b'
              },
              operator: '&&'
            },
            consequent: {
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
                        name: 'c'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'd'
                      }
                    },
                    arguments: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'e'
                        }
                      },
                      {
                        type: 'ArrowFunctionExpression',
                        body: {
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
                          arguments: [
                            {
                              type: 'ThisExpression'
                            },
                            {
                              type: 'UnaryExpression',
                              operator: 'void',
                              argument: {
                                type: 'Literal',
                                value: 0
                              },
                              prefix: true
                            },
                            {
                              type: 'UnaryExpression',
                              operator: 'void',
                              argument: {
                                type: 'Literal',
                                value: 0
                              },
                              prefix: true
                            },
                            {
                              type: 'FunctionExpression',
                              params: [],
                              body: {
                                type: 'BlockStatement',
                                body: [
                                  {
                                    type: 'ReturnStatement',
                                    argument: {
                                      type: 'Identifier',
                                      name: 'a'
                                    }
                                  }
                                ]
                              },
                              async: false,
                              generator: true,

                              id: null
                            }
                          ]
                        },
                        params: [
                          {
                            type: 'Identifier',
                            name: 'ctx'
                          }
                        ],

                        async: false,
                        expression: true
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
    ],
    [
      '(function (eval) { function foo() { "use strict"; }})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'eval'
                }
              ],
              body: {
                type: 'BlockStatement',
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
                            type: 'Literal',
                            value: 'use strict'
                          },
                          directive: 'use strict'
                        }
                      ]
                    },
                    async: false,
                    generator: false,

                    id: {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  }
                ]
              },
              async: false,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      '(function (eval) { (function () { "use strict"; })})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'eval'
                }
              ],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'Literal',
                              value: 'use strict'
                            },
                            directive: 'use strict'
                          }
                        ]
                      },
                      async: false,
                      generator: false,

                      id: null
                    }
                  }
                ]
              },
              async: false,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      '(function package() { (function gave_away_the_package() { "use strict"; }) })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'Literal',
                              value: 'use strict'
                            },
                            directive: 'use strict'
                          }
                        ]
                      },
                      async: false,
                      generator: false,

                      id: {
                        type: 'Identifier',
                        name: 'gave_away_the_package'
                      }
                    }
                  }
                ]
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'package'
              }
            }
          }
        ]
      }
    ],
    [
      '(function([cover = (function () {}), xCover = (0, function() {})]) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'cover'
                      },
                      right: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,

                        id: null
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'xCover'
                      },
                      right: {
                        type: 'SequenceExpression',
                        expressions: [
                          {
                            type: 'Literal',
                            value: 0
                          },
                          {
                            type: 'FunctionExpression',
                            params: [],
                            body: {
                              type: 'BlockStatement',
                              body: []
                            },
                            async: false,
                            generator: false,

                            id: null
                          }
                        ]
                      }
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

              id: null
            }
          }
        ]
      }
    ],
    [
      '{{{ function g() {} }}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'BlockStatement',
                body: [
                  {
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
                          name: 'g'
                        }
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
    [
      '(function f({foo=a,bar} = x){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'a'
                          }
                        },
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f({foo:a=b, bar:c=d} = x){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        computed: false,
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
                        method: false,
                        shorthand: false
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'c'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'd'
                          }
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      'function f({foo:a=b}){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
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
                    method: false,
                    shorthand: false
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
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '(function f({} = x){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ObjectPattern',
                    properties: []
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f([...bar] = obj){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'bar'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f([foo=a]){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'a'
                      }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f([foo], b = y){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  ]
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'y'
                  }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f([foo,,]){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    null
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],

    [
      '(function f(x = y, [foo]){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
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
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f([foo=a,bar=b] = x){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f([foo] = x, b = y){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'y'
                  }
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
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(async function() {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: true,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      'x = function() {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,

                id: null
              }
            }
          }
        ]
      }
    ],
    [
      'x = function donna() {}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'donna'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '(function () {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      '(function (a,b) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
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
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      '(function (a = b) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
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
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      '(function (love, you, donna) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'love'
                },
                {
                  type: 'Identifier',
                  name: 'you'
                },
                {
                  type: 'Identifier',
                  name: 'donna'
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: null
            }
          }
        ]
      }
    ]
  ]);
});
