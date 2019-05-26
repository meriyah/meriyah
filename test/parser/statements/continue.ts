import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Continue', () => {
  fail('Declarations - Continue', [
    ['continue;', Context.None],
    ['{ continue }', Context.None],
    ['if (x) continue;', Context.None],
    ['continue y', Context.None],
    ['if (x) continue y', Context.None],
    ['function f(){    continue    }', Context.None],
    ['function f(){   { continue }   }', Context.None],
    ['function f(){    if (x) continue   }', Context.None],
    ['function f(){    continue y   }', Context.None],
    ['function f(){    if (x) continue y   }', Context.None],
    ['() =>     continue', Context.None],
    ['() => {    continue    }', Context.None],
    ['() => {   { continue }   }', Context.None],
    ['() => {    continue y   }', Context.None],
    ['() => {    if (x) continue y   }', Context.None],
    ['continue', Context.None],
    ['while (true) continue x;', Context.None],
    ['function f(){ do        if (x) continue y   ; while(true);}', Context.None],
    ['do     continue y   ; while(true);', Context.None],
    ['do     if (x) continue y   ; while(true);', Context.None],
    ['function f(){ while (true)       if (x) continue y   }', Context.None],
    ['function f(){ for (;;)       if (x) continue y   }', Context.None],
    ['for (;;)    continue y ', Context.None],
    ['function f(){    if (x) continue   }', Context.None],
    ['function f(){    continue y   }', Context.None],
    ['function f(){    if (x) continue y   }', Context.None],
    ['switch (x) { case x: continue foo; }', Context.None],
    ['switch (x) { default: continue foo; }', Context.None],
    ['switch (x) { case x: if (foo) {continue foo;} }', Context.None],
    ['function f(){ for (;;)       if (x) continue y   }}', Context.None],
    ['while (true)    if (x) continue y   }', Context.None],
    ['function f(){ while (true)       if (x) continue y   }}', Context.None],
    ['do     if (x) continue y   ; while(true);', Context.None],
    ['function f(){ do        if (x) continue y   ; while(true);}', Context.None],
    ['continue foo', Context.None],
    ['continue; continue;', Context.None],
    ['continue\ncontinue;', Context.None],
    ['continue foo;continue;', Context.None],
    ['continue foo\ncontinue;', Context.None],
    ['do {  test262: {  continue test262; } } while (a)', Context.None],
    ['ce: while(true) { continue fapper; }', Context.None],
    ['oop1: while (true) { loop2: function a() { continue loop2; } }', Context.None],
    ['loop1: while (true) { loop2: function a() { continue loop1; } }', Context.None],
    ['loop1: while (true) { loop1: function a() { continue loop1; } }', Context.None],
    ['oop1: while (true) { loop2: function a() { continue loop2; } }', Context.None],
    ['oop1: while (true) { loop2: function a() { continue loop2; } }', Context.None],
    ['oop1: while (true) { loop2: function a() { continue loop2; } }', Context.None],
    [
      `LABEL1 : do {
      x++;
      (function(){continue LABEL1;})();
      y++;
      } while(0);`,
      Context.None
    ],
    [
      `try{
      LABEL1 : do {
        x++;
        throw "gonna leave it";
        y++;
      } while(0);
      $ERROR('#1: throw "gonna leave it" lead to throwing exception');
      } catch(e){
      continue LABEL2;
      LABEL2 : do {
        x++;
        y++;
      } while(0);
      };`,
      Context.None
    ],
    [
      `try{
      LABEL1 : do {
        x++;
        throw "gonna leave it";
        y++;
      } while(0);
      $ERROR('#1: throw "gonna leave it" lead to throwing exception');
      } catch(e){
      continue;
      LABEL2 : do {
        x++;
        y++;
      } while(0);
      };`,
      Context.None
    ],
    ['switch (x){ case z:    continue   }', Context.None],
    ['switch (x){ case z:    { continue }  }', Context.None],
    ['switch (x){ case z:    if (x) continue   }', Context.None],
    ['switch (x){ case z:    continue y   }', Context.None],
    ['switch (x){ case z:    if (x) continue y   }', Context.None]
  ]);

  pass('Statements - Continue', [
    [
      'while (x) continue',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'WhileStatement',
            test: {
              type: 'Identifier',
              name: 'x'
            },
            body: {
              type: 'ContinueStatement',
              label: null
            }
          }
        ]
      }
    ],
    [
      'do continue; while(foo);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ContinueStatement',
              label: null
            },
            test: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'foo: do continue foo; while(foo);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'foo'
            },
            body: {
              type: 'DoWhileStatement',
              body: {
                type: 'ContinueStatement',
                label: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              test: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '__proto__: while (true) { continue __proto__; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: '__proto__'
            },
            body: {
              type: 'WhileStatement',
              test: {
                type: 'Literal',
                value: true
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ContinueStatement',
                    label: {
                      type: 'Identifier',
                      name: '__proto__'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'a: do continue a; while(1);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'a'
            },
            body: {
              type: 'DoWhileStatement',
              body: {
                type: 'ContinueStatement',
                label: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              test: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      'a: while (0) { continue \r b; }',
      Context.None,
      {
        body: [
          {
            body: {
              body: {
                body: [
                  {
                    label: null,
                    type: 'ContinueStatement'
                  },
                  {
                    expression: {
                      name: 'b',
                      type: 'Identifier'
                    },
                    type: 'ExpressionStatement'
                  }
                ],
                type: 'BlockStatement'
              },
              test: {
                type: 'Literal',
                value: 0
              },
              type: 'WhileStatement'
            },
            label: {
              name: 'a',
              type: 'Identifier'
            },
            type: 'LabeledStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'a: while (0) { continue /*\n*/ b; }',
      Context.None,
      {
        body: [
          {
            body: {
              body: {
                body: [
                  {
                    label: null,
                    type: 'ContinueStatement'
                  },
                  {
                    expression: {
                      name: 'b',
                      type: 'Identifier'
                    },
                    type: 'ExpressionStatement'
                  }
                ],
                type: 'BlockStatement'
              },
              test: {
                type: 'Literal',
                value: 0
              },
              type: 'WhileStatement'
            },
            label: {
              name: 'a',
              type: 'Identifier'
            },
            type: 'LabeledStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'a: while (0) { continue /*\u2029*/ b; }',
      Context.None,
      {
        body: [
          {
            body: {
              body: {
                body: [
                  {
                    label: null,
                    type: 'ContinueStatement'
                  },
                  {
                    expression: {
                      name: 'b',
                      type: 'Identifier'
                    },
                    type: 'ExpressionStatement'
                  }
                ],
                type: 'BlockStatement'
              },
              test: {
                type: 'Literal',
                value: 0
              },
              type: 'WhileStatement'
            },
            label: {
              name: 'a',
              type: 'Identifier'
            },
            type: 'LabeledStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '() => { do        if (x) continue   ; while(true);}',
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
                    type: 'DoWhileStatement',
                    body: {
                      type: 'IfStatement',
                      test: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      consequent: {
                        type: 'ContinueStatement',
                        label: null
                      },
                      alternate: null
                    },
                    test: {
                      type: 'Literal',
                      value: true
                    }
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
      'for (;;)  {  continue   }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ContinueStatement',
                  label: null
                }
              ]
            },
            init: null,
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (;;)  { if (x) continue   }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'IfStatement',
                  test: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  consequent: {
                    type: 'ContinueStatement',
                    label: null
                  },
                  alternate: null
                }
              ]
            },
            init: null,
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'function f(){ for (;;)  {     continue    }}',
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
                  type: 'ForStatement',
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ContinueStatement',
                        label: null
                      }
                    ]
                  },
                  init: null,
                  test: null,
                  update: null
                }
              ]
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
      'while (true) {  continue   }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'WhileStatement',
            test: {
              type: 'Literal',
              value: true
            },
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ContinueStatement',
                  label: null
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo: while(true)continue foo;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'foo'
            },
            body: {
              type: 'WhileStatement',
              test: {
                type: 'Literal',
                value: true
              },
              body: {
                type: 'ContinueStatement',
                label: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'foo: while (true) { if (x) continue foo; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'foo'
            },
            body: {
              type: 'WhileStatement',
              test: {
                type: 'Literal',
                value: true
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'IfStatement',
                    test: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    consequent: {
                      type: 'ContinueStatement',
                      label: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    },
                    alternate: null
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  ]);
});
