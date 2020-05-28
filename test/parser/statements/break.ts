import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Break', () => {
  fail('Declarations - Break', [
    ['break;', Context.None],
    //    ['break foo;', Context.None],
    ['switch (x){ case z:    break y   }', Context.None],
    ['switch (x){ case z:    if (x) break y   }', Context.None],
    ['function f(){ switch (x){ case z:       break y   }}', Context.None],
    ['function f(){ switch (x){ case z:       if (x) break y   }}', Context.None],
    ['for (;;)    if (x) break y   }', Context.None],
    ['function f(){ while (true)       break y   }', Context.None],
    ['do     break y   ; while(true);', Context.None],
    ['do     if (x) break y   ; while(true);', Context.None],
    ['function f(){ do        if (x) break y   ; while(true);}', Context.None],
    ['x: foo; break x;', Context.None],
    ['loop1: function a() {}  while (true) { continue loop1; }', Context.None],
    ['{  break foo; var y=2; }', Context.None],
    ['loop1: while (true) { loop2: function a() { break loop2; } }', Context.None],
    [
      `(function(){
      OuterLabel : var x=0, y=0;
      LABEL_DO_LOOP : do {
          LABEL_IN : x++;
          if(x===10)
              return;
          break LABEL_ANOTHER_LOOP;
          LABEL_IN_2 : y++;
          function IN_DO_FUNC(){}
      } while(0);
      LABEL_ANOTHER_LOOP : do {
          ;
      } while(0);
      function OUT_FUNC(){}
  })();`,
      Context.None
    ],
    [
      `LABEL1 : do {
      x++;
      (function(){break LABEL1;})();
      y++;
  } while(0);`,
      Context.None
    ],
    [
      `(function(){
    OuterLabel : var x=0, y=0;
    LABEL_DO_LOOP : do {
        LABEL_IN : x++;
        if(x===10)
            return;
        break IN_DO_FUNC;
        LABEL_IN_2 : y++;
        function IN_DO_FUNC(){}
    } while(0);
    LABEL_ANOTHER_LOOP : do {
        ;
    } while(0);
    function OUT_FUNC(){}
  })();`,
      Context.None
    ],
    [
      `(function(){
    OuterLabel : var x=0, y=0;
    LABEL_DO_LOOP : do {
        LABEL_IN : x++;
        if(x===10)
            return;
        break LABEL_IN;
        LABEL_IN_2 : y++;
        function IN_DO_FUNC(){}
    } while(0);
    LABEL_ANOTHER_LOOP : do {
        ;
    } while(0);
    function OUT_FUNC(){}
  })();`,
      Context.None
    ],
    [
      `(function(){
    OuterLabel : var x=0, y=0;
    LABEL_DO_LOOP : do {
        LABEL_IN : x++;
        if(x===10)
            return;
        break LABEL_IN;
        LABEL_IN_2 : y++;
        function IN_DO_FUNC(){}
    } while(0);
    LABEL_ANOTHER_LOOP : do {
        ;
    } while(0);
    function OUT_FUNC(){}
  })();`,
      Context.None
    ],
    [
      `var x=0,y=0;
  try{
    LABEL1 : do {
      x++;
      throw "gonna leave it";
      y++;
    } while(0);
    $ERROR('#1: throw "gonna leave it" lead to throwing exception');
  } catch(e){
    break;
    LABEL2 : do {
      x++;
      y++;
    } while(0);
  }`,
      Context.None
    ],
    ['loop1: while (true) { loop2: function a() { break loop1; } }', Context.None],
    ['loop; while (true) { break loop1; }', Context.None],
    ['function f(){ for (;;)       break y   }', Context.None],
    ['break', Context.None],
    ['{ break }', Context.None],
    ['if (x) break', Context.None],
    ['function f(){    break    }', Context.None],
    ['function f(){    if (x) break   }', Context.None],
    ['function f(){    break y   }', Context.None],
    ['break; break;', Context.None],
    ['break\nbreak;', Context.None],
    ['{ break }', Context.None],
    ['if (x) break', Context.None],
    ['function f(){    break    }', Context.None],
    //    ['function f(){    break y   }', Context.None],
    ['() => {    break    }', Context.None],
    ['() => {    if (x) break   }', Context.None]
    //  ['() => {    if (x) break y   }', Context.None],
  ]);

  pass('Statements - Break (pass)', [
    [
      `a: if (true) b: { break a; break b; }
      else b: { break a; break b; }`,
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
              type: 'IfStatement',
              test: {
                type: 'Literal',
                value: true
              },
              consequent: {
                type: 'LabeledStatement',
                label: {
                  type: 'Identifier',
                  name: 'b'
                },
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'BreakStatement',
                      label: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    },
                    {
                      type: 'BreakStatement',
                      label: {
                        type: 'Identifier',
                        name: 'b'
                      }
                    }
                  ]
                }
              },
              alternate: {
                type: 'LabeledStatement',
                label: {
                  type: 'Identifier',
                  name: 'b'
                },
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'BreakStatement',
                      label: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    },
                    {
                      type: 'BreakStatement',
                      label: {
                        type: 'Identifier',
                        name: 'b'
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      'foo: while (true) if (x) break foo;',
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
                type: 'IfStatement',
                test: {
                  type: 'Identifier',
                  name: 'x'
                },
                consequent: {
                  type: 'BreakStatement',
                  label: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                },
                alternate: null
              }
            }
          }
        ]
      }
    ],
    [
      'foo: while(true)break foo;',
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
                type: 'BreakStatement',
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
      'function f(){ while (true)       if (x) break   }',
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
                  type: 'WhileStatement',
                  test: {
                    type: 'Literal',
                    value: true
                  },
                  body: {
                    type: 'IfStatement',
                    test: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    consequent: {
                      type: 'BreakStatement',
                      label: null
                    },
                    alternate: null
                  }
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
      'while (true)    { break }   ',
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
                  type: 'BreakStatement',
                  label: null
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function f(){ for (;;)       if (x) break   }',
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
                    type: 'IfStatement',
                    test: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    consequent: {
                      type: 'BreakStatement',
                      label: null
                    },
                    alternate: null
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
      'L: let\nx',
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                name: 'let',
                type: 'Identifier'
              },
              type: 'ExpressionStatement'
            },
            label: {
              name: 'L',
              type: 'Identifier'
            },
            type: 'LabeledStatement'
          },
          {
            expression: {
              name: 'x',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `switch (a) { case 10 /* StringLiteral */:
        if (lookAhead(function () { return nextToken() !== 57 /* ColonToken */; })) {
            statement.expression = parseLiteralNode();
            break;
        }
}`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'a'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Literal',
                  value: 10
                },
                consequent: [
                  {
                    type: 'IfStatement',
                    test: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'lookAhead'
                      },
                      arguments: [
                        {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ReturnStatement',
                                argument: {
                                  type: 'BinaryExpression',
                                  left: {
                                    type: 'CallExpression',
                                    callee: {
                                      type: 'Identifier',
                                      name: 'nextToken'
                                    },
                                    arguments: []
                                  },
                                  right: {
                                    type: 'Literal',
                                    value: 57
                                  },
                                  operator: '!=='
                                }
                              }
                            ]
                          },
                          async: false,
                          generator: false,
                          id: null
                        }
                      ]
                    },
                    consequent: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'statement'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'expression'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'parseLiteralNode'
                              },
                              arguments: []
                            }
                          }
                        },
                        {
                          type: 'BreakStatement',
                          label: null
                        }
                      ]
                    },
                    alternate: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (a) { case 123: { if (a) {} break } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 44,
        range: [0, 44],
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 44,
            range: [0, 44],
            discriminant: {
              type: 'Identifier',
              start: 8,
              end: 9,
              range: [8, 9],
              name: 'a'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 13,
                end: 42,
                range: [13, 42],
                consequent: [
                  {
                    type: 'BlockStatement',
                    start: 23,
                    end: 42,
                    range: [23, 42],
                    body: [
                      {
                        type: 'IfStatement',
                        start: 25,
                        end: 34,
                        range: [25, 34],
                        test: {
                          type: 'Identifier',
                          start: 29,
                          end: 30,
                          range: [29, 30],
                          name: 'a'
                        },
                        consequent: {
                          type: 'BlockStatement',
                          start: 32,
                          end: 34,
                          range: [32, 34],
                          body: []
                        },
                        alternate: null
                      },
                      {
                        type: 'BreakStatement',
                        start: 35,
                        end: 40,
                        range: [35, 40],
                        label: null
                      }
                    ]
                  }
                ],
                test: {
                  type: 'Literal',
                  start: 18,
                  end: 21,
                  range: [18, 21],
                  value: 123
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],

    [
      'ding: foo: bar: while (true) break foo;',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 39,
        range: [0, 39],
        body: [
          {
            type: 'LabeledStatement',
            start: 0,
            end: 39,
            range: [0, 39],
            body: {
              type: 'LabeledStatement',
              start: 6,
              end: 39,
              range: [6, 39],
              body: {
                type: 'LabeledStatement',
                start: 11,
                end: 39,
                range: [11, 39],
                body: {
                  type: 'WhileStatement',
                  start: 16,
                  end: 39,
                  range: [16, 39],
                  test: {
                    type: 'Literal',
                    start: 23,
                    end: 27,
                    range: [23, 27],
                    value: true,
                    raw: 'true'
                  },
                  body: {
                    type: 'BreakStatement',
                    start: 29,
                    end: 39,
                    range: [29, 39],
                    label: {
                      type: 'Identifier',
                      start: 35,
                      end: 38,
                      range: [35, 38],
                      name: 'foo'
                    }
                  }
                },
                label: {
                  type: 'Identifier',
                  start: 11,
                  end: 14,
                  range: [11, 14],
                  name: 'bar'
                }
              },
              label: {
                type: 'Identifier',
                start: 6,
                end: 9,
                range: [6, 9],
                name: 'foo'
              }
            },
            label: {
              type: 'Identifier',
              start: 0,
              end: 4,
              range: [0, 4],
              name: 'ding'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch (x) { default: break; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'x'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: [
                  {
                    type: 'BreakStatement',
                    label: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (x) { case x: if (foo) break; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'x'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'x'
                },
                consequent: [
                  {
                    type: 'IfStatement',
                    test: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    consequent: {
                      type: 'BreakStatement',
                      label: null
                    },
                    alternate: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (x) { case x: {break;} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'x'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'x'
                },
                consequent: [
                  {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'BreakStatement',
                        label: null
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
      'foo: switch (x) { case x: break foo; }',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 38,
        range: [0, 38],
        body: [
          {
            type: 'LabeledStatement',
            start: 0,
            end: 38,
            range: [0, 38],
            body: {
              type: 'SwitchStatement',
              start: 5,
              end: 38,
              range: [5, 38],
              discriminant: {
                type: 'Identifier',
                start: 13,
                end: 14,
                range: [13, 14],
                name: 'x'
              },
              cases: [
                {
                  type: 'SwitchCase',
                  start: 18,
                  end: 36,
                  range: [18, 36],
                  consequent: [
                    {
                      type: 'BreakStatement',
                      start: 26,
                      end: 36,
                      range: [26, 36],
                      label: {
                        type: 'Identifier',
                        start: 32,
                        end: 35,
                        range: [32, 35],
                        name: 'foo'
                      }
                    }
                  ],
                  test: {
                    type: 'Identifier',
                    start: 23,
                    end: 24,
                    range: [23, 24],
                    name: 'x'
                  }
                }
              ]
            },
            label: {
              type: 'Identifier',
              start: 0,
              end: 3,
              range: [0, 3],
              name: 'foo'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'this',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 4,
        range: [0, 4],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 4,
            range: [0, 4],
            expression: {
              type: 'ThisExpression',
              start: 0,
              end: 4,
              range: [0, 4]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo: switch (x) { case x: if (foo) {break foo;} }',
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
              type: 'SwitchStatement',
              discriminant: {
                type: 'Identifier',
                name: 'x'
              },
              cases: [
                {
                  type: 'SwitchCase',
                  test: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  consequent: [
                    {
                      type: 'IfStatement',
                      test: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      consequent: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'BreakStatement',
                            label: {
                              type: 'Identifier',
                              name: 'foo'
                            }
                          }
                        ]
                      },
                      alternate: null
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
      'switch (x) { case x: break; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 29,
        range: [0, 29],
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 29,
            range: [0, 29],
            discriminant: {
              type: 'Identifier',
              start: 8,
              end: 9,
              range: [8, 9],
              name: 'x'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 13,
                end: 27,
                range: [13, 27],
                consequent: [
                  {
                    type: 'BreakStatement',
                    start: 21,
                    end: 27,
                    range: [21, 27],
                    label: null
                  }
                ],
                test: {
                  type: 'Identifier',
                  start: 18,
                  end: 19,
                  range: [18, 19],
                  name: 'x'
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
