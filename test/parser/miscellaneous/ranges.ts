import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Miscellaneous - ranges', () => {
  pass('Miscellaneous - ranges (pass)', [
    [
      '{}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 2,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 2,
            body: []
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{debugger;}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 11,
            body: [
              {
                type: 'DebuggerStatement',
                start: 1,
                end: 10
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f() {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 15,
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              name: 'f'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 15,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'var a',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 5,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 5,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 5,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'a'
                },
                init: null
              }
            ],
            kind: 'var'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{{}}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 4,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 4,
            body: [
              {
                type: 'BlockStatement',
                start: 1,
                end: 3,
                body: []
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{{{{}}}}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 8,
            body: [
              {
                type: 'BlockStatement',
                start: 1,
                end: 7,
                body: [
                  {
                    type: 'BlockStatement',
                    start: 2,
                    end: 6,
                    body: [
                      {
                        type: 'BlockStatement',
                        start: 3,
                        end: 5,
                        body: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{{a}}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 5,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 5,
            body: [
              {
                type: 'BlockStatement',
                start: 1,
                end: 4,
                body: [
                  {
                    type: 'ExpressionStatement',
                    start: 2,
                    end: 3,
                    expression: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      name: 'a'
                    }
                  }
                ]
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[a]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 3,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 3,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 3,
              elements: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  name: 'a'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '"foo";',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 6,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 6,
            expression: {
              type: 'Literal',
              start: 0,
              end: 5,
              value: 'foo'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo; "bar"; 9;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 4,
            expression: {
              type: 'Identifier',
              start: 0,
              end: 3,
              name: 'foo'
            }
          },
          {
            type: 'ExpressionStatement',
            start: 5,
            end: 11,
            expression: {
              type: 'Literal',
              start: 5,
              end: 10,
              value: 'bar'
            }
          },
          {
            type: 'ExpressionStatement',
            start: 12,
            end: 14,
            expression: {
              type: 'Literal',
              start: 12,
              end: 13,
              value: 9
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a, b',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 4,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 4,
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 4,
              expressions: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 3,
                  end: 4,
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
      'a = 2',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 5,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 5,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 5,
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'a'
              },
              right: {
                type: 'Literal',
                start: 4,
                end: 5,
                value: 2
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a = b, c',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 8,
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 8,
              expressions: [
                {
                  type: 'AssignmentExpression',
                  start: 0,
                  end: 5,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 0,
                    end: 1,
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    name: 'b'
                  }
                },
                {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  name: 'c'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a, b = c',
      Context.OptionsRanges,
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
                  start: 0,
                  end: 1
                },
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b',
                    start: 3,
                    end: 4
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 7,
                    end: 8
                  },
                  start: 3,
                  end: 8
                }
              ],
              start: 0,
              end: 8
            },
            start: 0,
            end: 8
          }
        ],
        start: 0,
        end: 8
      }
    ],
    [
      'a, b = c, d',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 11,
              expressions: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                {
                  type: 'AssignmentExpression',
                  start: 3,
                  end: 8,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 3,
                    end: 4,
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    name: 'c'
                  }
                },
                {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  name: 'd'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a, b, c = d',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 11,
              expressions: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 3,
                  end: 4,
                  name: 'b'
                },
                {
                  type: 'AssignmentExpression',
                  start: 6,
                  end: 11,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    name: 'c'
                  },
                  right: {
                    type: 'Identifier',
                    start: 10,
                    end: 11,
                    name: 'd'
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
      'a, b = 2',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 8,
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 8,
              expressions: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                {
                  type: 'AssignmentExpression',
                  start: 3,
                  end: 8,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 3,
                    end: 4,
                    name: 'b'
                  },
                  right: {
                    type: 'Literal',
                    start: 7,
                    end: 8,
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
      '{ 1; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 6,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 6,
            body: [
              {
                type: 'ExpressionStatement',
                start: 2,
                end: 4,
                expression: {
                  type: 'Literal',
                  start: 2,
                  end: 3,
                  value: 1
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{ a = 2; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 10,
            body: [
              {
                type: 'ExpressionStatement',
                start: 2,
                end: 8,
                expression: {
                  type: 'AssignmentExpression',
                  start: 2,
                  end: 7,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    name: 'a'
                  },
                  right: {
                    type: 'Literal',
                    start: 6,
                    end: 7,
                    value: 2
                  }
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '1; 2;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 5,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 2,
            expression: {
              type: 'Literal',
              start: 0,
              end: 1,
              value: 1
            }
          },
          {
            type: 'ExpressionStatement',
            start: 3,
            end: 5,
            expression: {
              type: 'Literal',
              start: 3,
              end: 4,
              value: 2
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[ foo ]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 7,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 7,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 7,
              elements: [
                {
                  type: 'Identifier',
                  start: 2,
                  end: 5,
                  name: 'foo'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[foo]; [foo];',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 13,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 6,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 5,
              elements: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 4,
                  name: 'foo'
                }
              ]
            }
          },
          {
            type: 'ExpressionStatement',
            start: 7,
            end: 13,
            expression: {
              type: 'ArrayExpression',
              start: 7,
              end: 12,
              elements: [
                {
                  type: 'Identifier',
                  start: 8,
                  end: 11,
                  name: 'foo'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[ foo ] = bar',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 13,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 13,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 7,
                elements: [
                  {
                    type: 'Identifier',
                    start: 2,
                    end: 5,
                    name: 'foo'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 10,
                end: 13,
                name: 'bar'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[[foo]]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 7,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 7,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 7,
              elements: [
                {
                  type: 'ArrayExpression',
                  start: 1,
                  end: 6,
                  elements: [
                    {
                      type: 'Identifier',
                      start: 2,
                      end: 5,
                      name: 'foo'
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
      '[[foo]] = []',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 12,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 7,
                elements: [
                  {
                    type: 'ArrayPattern',
                    start: 1,
                    end: 6,
                    elements: [
                      {
                        type: 'Identifier',
                        start: 2,
                        end: 5,
                        name: 'foo'
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 10,
                end: 12,
                elements: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    /*   ['[[foo]] = [bar = nchanged]', Context.OptionsRanges, {
      "type": "Program",
      "start": 0,
      "end": 26,
      "body": [
        {
          "type": "ExpressionStatement",
          "start": 0,
          "end": 26,
          "expression": {
            "type": "AssignmentExpression",
            "start": 0,
            "end": 26,
            "operator": "=",
            "left": {
              "type": "ArrayPattern",
              "start": 0,
              "end": 7,
              "elements": [
                {
                  "type": "ArrayPattern",
                  "start": 1,
                  "end": 6,
                  "elements": [
                    {
                      "type": "Identifier",
                      "start": 2,
                      "end": 5,
                      "name": "foo"
                    }
                  ]
                }
              ]
            },
            "right": {
              "type": "ArrayExpression",
              "start": 10,
              "end": 26,
              "elements": [
                {
                  "type": "AssignmentExpression",
                  "start": 11,
                  "end": 25,
                  "operator": "=",
                  "left": {
                    "type": "Identifier",
                    "start": 11,
                    "end": 14,
                    "name": "bar"
                  },
                  "right": {
                    "type": "Identifier",
                    "start": 17,
                    "end": 25,
                    "name": "nchanged"
                  }
                }
              ]
            }
          }
        }
      ],
      "sourceType": "script"
    }],*/
    [
      '[a, b]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 6,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 6,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 6,
              elements: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
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
      '[a = b, c = d]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 14,
              elements: [
                {
                  type: 'AssignmentExpression',
                  start: 1,
                  end: 6,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    name: 'b'
                  }
                },
                {
                  type: 'AssignmentExpression',
                  start: 8,
                  end: 13,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    name: 'c'
                  },
                  right: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    name: 'd'
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
      '[[[a.b =[]]]]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 13,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 13,
              elements: [
                {
                  type: 'ArrayExpression',
                  start: 1,
                  end: 12,
                  elements: [
                    {
                      type: 'ArrayExpression',
                      start: 2,
                      end: 11,
                      elements: [
                        {
                          type: 'AssignmentExpression',
                          start: 3,
                          end: 10,
                          operator: '=',
                          left: {
                            type: 'MemberExpression',
                            start: 3,
                            end: 6,
                            object: {
                              type: 'Identifier',
                              start: 3,
                              end: 4,
                              name: 'a'
                            },
                            property: {
                              type: 'Identifier',
                              start: 5,
                              end: 6,
                              name: 'b'
                            },
                            computed: false
                          },
                          right: {
                            type: 'ArrayExpression',
                            start: 8,
                            end: 10,
                            elements: []
                          }
                        }
                      ]
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
      '[[[[[[[a=b] = c] = c] = c] = c] = c] = c] = [[[[[[[a=b] = c]]] = c] = c] = c] = c;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 82,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 82,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 81,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 41,
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 1,
                    end: 40,
                    left: {
                      type: 'ArrayPattern',
                      start: 1,
                      end: 36,
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          start: 2,
                          end: 35,
                          left: {
                            type: 'ArrayPattern',
                            start: 2,
                            end: 31,
                            elements: [
                              {
                                type: 'AssignmentPattern',
                                start: 3,
                                end: 30,
                                left: {
                                  type: 'ArrayPattern',
                                  start: 3,
                                  end: 26,
                                  elements: [
                                    {
                                      type: 'AssignmentPattern',
                                      start: 4,
                                      end: 25,
                                      left: {
                                        type: 'ArrayPattern',
                                        start: 4,
                                        end: 21,
                                        elements: [
                                          {
                                            type: 'AssignmentPattern',
                                            start: 5,
                                            end: 20,
                                            left: {
                                              type: 'ArrayPattern',
                                              start: 5,
                                              end: 16,
                                              elements: [
                                                {
                                                  type: 'AssignmentPattern',
                                                  start: 6,
                                                  end: 15,
                                                  left: {
                                                    type: 'ArrayPattern',
                                                    start: 6,
                                                    end: 11,
                                                    elements: [
                                                      {
                                                        type: 'AssignmentPattern',
                                                        start: 7,
                                                        end: 10,
                                                        left: {
                                                          type: 'Identifier',
                                                          start: 7,
                                                          end: 8,
                                                          name: 'a'
                                                        },
                                                        right: {
                                                          type: 'Identifier',
                                                          start: 9,
                                                          end: 10,
                                                          name: 'b'
                                                        }
                                                      }
                                                    ]
                                                  },
                                                  right: {
                                                    type: 'Identifier',
                                                    start: 14,
                                                    end: 15,
                                                    name: 'c'
                                                  }
                                                }
                                              ]
                                            },
                                            right: {
                                              type: 'Identifier',
                                              start: 19,
                                              end: 20,
                                              name: 'c'
                                            }
                                          }
                                        ]
                                      },
                                      right: {
                                        type: 'Identifier',
                                        start: 24,
                                        end: 25,
                                        name: 'c'
                                      }
                                    }
                                  ]
                                },
                                right: {
                                  type: 'Identifier',
                                  start: 29,
                                  end: 30,
                                  name: 'c'
                                }
                              }
                            ]
                          },
                          right: {
                            type: 'Identifier',
                            start: 34,
                            end: 35,
                            name: 'c'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      start: 39,
                      end: 40,
                      name: 'c'
                    }
                  }
                ]
              },
              right: {
                type: 'AssignmentExpression',
                start: 44,
                end: 81,
                operator: '=',
                left: {
                  type: 'ArrayPattern',
                  start: 44,
                  end: 77,
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      start: 45,
                      end: 76,
                      left: {
                        type: 'ArrayPattern',
                        start: 45,
                        end: 72,
                        elements: [
                          {
                            type: 'AssignmentPattern',
                            start: 46,
                            end: 71,
                            left: {
                              type: 'ArrayPattern',
                              start: 46,
                              end: 67,
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  start: 47,
                                  end: 66,
                                  left: {
                                    type: 'ArrayPattern',
                                    start: 47,
                                    end: 62,
                                    elements: [
                                      {
                                        type: 'ArrayPattern',
                                        start: 48,
                                        end: 61,
                                        elements: [
                                          {
                                            type: 'ArrayPattern',
                                            start: 49,
                                            end: 60,
                                            elements: [
                                              {
                                                type: 'AssignmentPattern',
                                                start: 50,
                                                end: 59,
                                                left: {
                                                  type: 'ArrayPattern',
                                                  start: 50,
                                                  end: 55,
                                                  elements: [
                                                    {
                                                      type: 'AssignmentPattern',
                                                      start: 51,
                                                      end: 54,
                                                      left: {
                                                        type: 'Identifier',
                                                        start: 51,
                                                        end: 52,
                                                        name: 'a'
                                                      },
                                                      right: {
                                                        type: 'Identifier',
                                                        start: 53,
                                                        end: 54,
                                                        name: 'b'
                                                      }
                                                    }
                                                  ]
                                                },
                                                right: {
                                                  type: 'Identifier',
                                                  start: 58,
                                                  end: 59,
                                                  name: 'c'
                                                }
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  right: {
                                    type: 'Identifier',
                                    start: 65,
                                    end: 66,
                                    name: 'c'
                                  }
                                }
                              ]
                            },
                            right: {
                              type: 'Identifier',
                              start: 70,
                              end: 71,
                              name: 'c'
                            }
                          }
                        ]
                      },
                      right: {
                        type: 'Identifier',
                        start: 75,
                        end: 76,
                        name: 'c'
                      }
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  start: 80,
                  end: 81,
                  name: 'c'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo; bar;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 9,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 4,
            expression: {
              type: 'Identifier',
              start: 0,
              end: 3,
              name: 'foo'
            }
          },
          {
            type: 'ExpressionStatement',
            start: 5,
            end: 9,
            expression: {
              type: 'Identifier',
              start: 5,
              end: 8,
              name: 'bar'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo; bar; goo;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 4,
            expression: {
              type: 'Identifier',
              start: 0,
              end: 3,
              name: 'foo'
            }
          },
          {
            type: 'ExpressionStatement',
            start: 5,
            end: 9,
            expression: {
              type: 'Identifier',
              start: 5,
              end: 8,
              name: 'bar'
            }
          },
          {
            type: 'ExpressionStatement',
            start: 10,
            end: 14,
            expression: {
              type: 'Identifier',
              start: 10,
              end: 13,
              name: 'goo'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{a}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 3,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 3,
            body: [
              {
                type: 'ExpressionStatement',
                start: 1,
                end: 2,
                expression: {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  name: 'a'
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{if (false) {} else ;}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 22,
            body: [
              {
                type: 'IfStatement',
                start: 1,
                end: 21,
                test: {
                  type: 'Literal',
                  start: 5,
                  end: 10,
                  value: false
                },
                consequent: {
                  type: 'BlockStatement',
                  start: 12,
                  end: 14,
                  body: []
                },
                alternate: {
                  type: 'EmptyStatement',
                  start: 20,
                  end: 21
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{if (false) a }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 15,
            body: [
              {
                type: 'IfStatement',
                start: 1,
                end: 13,
                test: {
                  type: 'Literal',
                  start: 5,
                  end: 10,
                  value: false
                },
                consequent: {
                  type: 'ExpressionStatement',
                  start: 12,
                  end: 13,
                  expression: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    name: 'a'
                  }
                },
                alternate: null
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'if (a) b',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        body: [
          {
            type: 'IfStatement',
            start: 0,
            end: 8,
            test: {
              type: 'Identifier',
              start: 4,
              end: 5,
              name: 'a'
            },
            consequent: {
              type: 'ExpressionStatement',
              start: 7,
              end: 8,
              expression: {
                type: 'Identifier',
                start: 7,
                end: 8,
                name: 'b'
              }
            },
            alternate: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'if (false) {} else ;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        body: [
          {
            type: 'IfStatement',
            start: 0,
            end: 20,
            test: {
              type: 'Literal',
              start: 4,
              end: 9,
              value: false
            },
            consequent: {
              type: 'BlockStatement',
              start: 11,
              end: 13,
              body: []
            },
            alternate: {
              type: 'EmptyStatement',
              start: 19,
              end: 20
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'if(a)b;else c;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'IfStatement',
            start: 0,
            end: 14,
            test: {
              type: 'Identifier',
              start: 3,
              end: 4,
              name: 'a'
            },
            consequent: {
              type: 'ExpressionStatement',
              start: 5,
              end: 7,
              expression: {
                type: 'Identifier',
                start: 5,
                end: 6,
                name: 'b'
              }
            },
            alternate: {
              type: 'ExpressionStatement',
              start: 12,
              end: 14,
              expression: {
                type: 'Identifier',
                start: 12,
                end: 13,
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'if(a)b',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 6,
        body: [
          {
            type: 'IfStatement',
            start: 0,
            end: 6,
            test: {
              type: 'Identifier',
              start: 3,
              end: 4,
              name: 'a'
            },
            consequent: {
              type: 'ExpressionStatement',
              start: 5,
              end: 6,
              expression: {
                type: 'Identifier',
                start: 5,
                end: 6,
                name: 'b'
              }
            },
            alternate: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'if (foo) a; if (bar) b; else c;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 31,
        body: [
          {
            type: 'IfStatement',
            start: 0,
            end: 11,
            test: {
              type: 'Identifier',
              start: 4,
              end: 7,
              name: 'foo'
            },
            consequent: {
              type: 'ExpressionStatement',
              start: 9,
              end: 11,
              expression: {
                type: 'Identifier',
                start: 9,
                end: 10,
                name: 'a'
              }
            },
            alternate: null
          },
          {
            type: 'IfStatement',
            start: 12,
            end: 31,
            test: {
              type: 'Identifier',
              start: 16,
              end: 19,
              name: 'bar'
            },
            consequent: {
              type: 'ExpressionStatement',
              start: 21,
              end: 23,
              expression: {
                type: 'Identifier',
                start: 21,
                end: 22,
                name: 'b'
              }
            },
            alternate: {
              type: 'ExpressionStatement',
              start: 29,
              end: 31,
              expression: {
                type: 'Identifier',
                start: 29,
                end: 30,
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'if (a > 2) {b = c }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        body: [
          {
            type: 'IfStatement',
            start: 0,
            end: 19,
            test: {
              type: 'BinaryExpression',
              start: 4,
              end: 9,
              left: {
                type: 'Identifier',
                start: 4,
                end: 5,
                name: 'a'
              },
              operator: '>',
              right: {
                type: 'Literal',
                start: 8,
                end: 9,
                value: 2
              }
            },
            consequent: {
              type: 'BlockStatement',
              start: 11,
              end: 19,
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 12,
                  end: 17,
                  expression: {
                    type: 'AssignmentExpression',
                    start: 12,
                    end: 17,
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 12,
                      end: 13,
                      name: 'b'
                    },
                    right: {
                      type: 'Identifier',
                      start: 16,
                      end: 17,
                      name: 'c'
                    }
                  }
                }
              ]
            },
            alternate: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'while (x < 10) { x++; y--; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        body: [
          {
            type: 'WhileStatement',
            start: 0,
            end: 28,
            test: {
              type: 'BinaryExpression',
              start: 7,
              end: 13,
              left: {
                type: 'Identifier',
                start: 7,
                end: 8,
                name: 'x'
              },
              operator: '<',
              right: {
                type: 'Literal',
                start: 11,
                end: 13,
                value: 10
              }
            },
            body: {
              type: 'BlockStatement',
              start: 15,
              end: 28,
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 17,
                  end: 21,
                  expression: {
                    type: 'UpdateExpression',
                    start: 17,
                    end: 20,
                    operator: '++',
                    prefix: false,
                    argument: {
                      type: 'Identifier',
                      start: 17,
                      end: 18,
                      name: 'x'
                    }
                  }
                },
                {
                  type: 'ExpressionStatement',
                  start: 22,
                  end: 26,
                  expression: {
                    type: 'UpdateExpression',
                    start: 22,
                    end: 25,
                    operator: '--',
                    prefix: false,
                    argument: {
                      type: 'Identifier',
                      start: 22,
                      end: 23,
                      name: 'y'
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
    [
      'while (i-->1) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        body: [
          {
            type: 'WhileStatement',
            start: 0,
            end: 16,
            test: {
              type: 'BinaryExpression',
              start: 7,
              end: 12,
              left: {
                type: 'UpdateExpression',
                start: 7,
                end: 10,
                operator: '--',
                prefix: false,
                argument: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  name: 'i'
                }
              },
              operator: '>',
              right: {
                type: 'Literal',
                start: 11,
                end: 12,
                value: 1
              }
            },
            body: {
              type: 'BlockStatement',
              start: 14,
              end: 16,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try {} catch({e=x}){}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        body: [
          {
            type: 'TryStatement',
            start: 0,
            end: 21,
            block: {
              type: 'BlockStatement',
              start: 4,
              end: 6,
              body: []
            },
            handler: {
              type: 'CatchClause',
              start: 7,
              end: 21,
              param: {
                type: 'ObjectPattern',
                start: 13,
                end: 18,
                properties: [
                  {
                    type: 'Property',
                    start: 14,
                    end: 17,
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 14,
                      end: 15,
                      name: 'e'
                    },
                    kind: 'init',
                    value: {
                      type: 'AssignmentPattern',
                      start: 14,
                      end: 17,
                      left: {
                        type: 'Identifier',
                        start: 14,
                        end: 15,
                        name: 'e'
                      },
                      right: {
                        type: 'Identifier',
                        start: 16,
                        end: 17,
                        name: 'x'
                      }
                    }
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                start: 19,
                end: 21,
                body: []
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try {} catch {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        body: [
          {
            type: 'TryStatement',
            start: 0,
            end: 15,
            block: {
              type: 'BlockStatement',
              start: 4,
              end: 6,
              body: []
            },
            handler: {
              type: 'CatchClause',
              start: 7,
              end: 15,
              param: null,
              body: {
                type: 'BlockStatement',
                start: 13,
                end: 15,
                body: []
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try { } catch (e) { say(e) }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        body: [
          {
            type: 'TryStatement',
            start: 0,
            end: 28,
            block: {
              type: 'BlockStatement',
              start: 4,
              end: 7,
              body: []
            },
            handler: {
              type: 'CatchClause',
              start: 8,
              end: 28,
              param: {
                type: 'Identifier',
                start: 15,
                end: 16,
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                start: 18,
                end: 28,
                body: [
                  {
                    type: 'ExpressionStatement',
                    start: 20,
                    end: 26,
                    expression: {
                      type: 'CallExpression',
                      start: 20,
                      end: 26,
                      callee: {
                        type: 'Identifier',
                        start: 20,
                        end: 23,
                        name: 'say'
                      },
                      arguments: [
                        {
                          type: 'Identifier',
                          start: 24,
                          end: 25,
                          name: 'e'
                        }
                      ]
                    }
                  }
                ]
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try { } catch ([a = 0]) { }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        body: [
          {
            type: 'TryStatement',
            start: 0,
            end: 27,
            block: {
              type: 'BlockStatement',
              start: 4,
              end: 7,
              body: []
            },
            handler: {
              type: 'CatchClause',
              start: 8,
              end: 27,
              param: {
                type: 'ArrayPattern',
                start: 15,
                end: 22,
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 16,
                    end: 21,
                    left: {
                      type: 'Identifier',
                      start: 16,
                      end: 17,
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      start: 20,
                      end: 21,
                      value: 0
                    }
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                start: 24,
                end: 27,
                body: []
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'throw foo;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        body: [
          {
            type: 'ThrowStatement',
            start: 0,
            end: 10,
            argument: {
              type: 'Identifier',
              start: 6,
              end: 9,
              name: 'foo'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'throw x * y',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        body: [
          {
            type: 'ThrowStatement',
            start: 0,
            end: 11,
            argument: {
              type: 'BinaryExpression',
              start: 6,
              end: 11,
              left: {
                type: 'Identifier',
                start: 6,
                end: 7,
                name: 'x'
              },
              operator: '*',
              right: {
                type: 'Identifier',
                start: 10,
                end: 11,
                name: 'y'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch(foo) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 14,
            discriminant: {
              type: 'Identifier',
              start: 7,
              end: 10,
              name: 'foo'
            },
            cases: []
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch (A) {default: D; case B: C; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 36,
            discriminant: {
              type: 'Identifier',
              start: 8,
              end: 9,
              name: 'A'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 12,
                end: 23,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    start: 21,
                    end: 23,
                    expression: {
                      type: 'Identifier',
                      start: 21,
                      end: 22,
                      name: 'D'
                    }
                  }
                ],
                test: null
              },
              {
                type: 'SwitchCase',
                start: 24,
                end: 34,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    start: 32,
                    end: 34,
                    expression: {
                      type: 'Identifier',
                      start: 32,
                      end: 33,
                      name: 'C'
                    }
                  }
                ],
                test: {
                  type: 'Identifier',
                  start: 29,
                  end: 30,
                  name: 'B'
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch(a){case 1:default:}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 26,
            discriminant: {
              type: 'Identifier',
              start: 7,
              end: 8,
              name: 'a'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 10,
                end: 17,
                consequent: [],
                test: {
                  type: 'Literal',
                  start: 15,
                  end: 16,
                  value: 1
                }
              },
              {
                type: 'SwitchCase',
                start: 17,
                end: 25,
                consequent: [],
                test: null
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (a;;);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        body: [
          {
            type: 'ForStatement',
            start: 0,
            end: 10,
            init: {
              type: 'Identifier',
              start: 5,
              end: 6,
              name: 'a'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement',
              start: 9,
              end: 10
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let [...foo] = obj;;);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        body: [
          {
            type: 'ForStatement',
            start: 0,
            end: 27,
            init: {
              type: 'VariableDeclaration',
              start: 5,
              end: 23,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 23,
                  id: {
                    type: 'ArrayPattern',
                    start: 9,
                    end: 17,
                    elements: [
                      {
                        type: 'RestElement',
                        start: 10,
                        end: 16,
                        argument: {
                          type: 'Identifier',
                          start: 13,
                          end: 16,
                          name: 'foo'
                        }
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    start: 20,
                    end: 23,
                    name: 'obj'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement',
              start: 26,
              end: 27
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let [foo=a] = arr;;);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        body: [
          {
            type: 'ForStatement',
            start: 0,
            end: 26,
            init: {
              type: 'VariableDeclaration',
              start: 5,
              end: 22,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 22,
                  id: {
                    type: 'ArrayPattern',
                    start: 9,
                    end: 16,
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        start: 10,
                        end: 15,
                        left: {
                          type: 'Identifier',
                          start: 10,
                          end: 13,
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          start: 14,
                          end: 15,
                          name: 'a'
                        }
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    start: 19,
                    end: 22,
                    name: 'arr'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement',
              start: 25,
              end: 26
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (x.y of [23]) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        body: [
          {
            type: 'ForOfStatement',
            start: 0,
            end: 20,
            await: false,
            left: {
              type: 'MemberExpression',
              start: 5,
              end: 8,
              object: {
                type: 'Identifier',
                start: 5,
                end: 6,
                name: 'x'
              },
              property: {
                type: 'Identifier',
                start: 7,
                end: 8,
                name: 'y'
              },
              computed: false
            },
            right: {
              type: 'ArrayExpression',
              start: 12,
              end: 16,
              elements: [
                {
                  type: 'Literal',
                  start: 13,
                  end: 15,
                  value: 23
                }
              ]
            },
            body: {
              type: 'BlockStatement',
              start: 18,
              end: 20,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for ( let[x] of [[34]] ) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        body: [
          {
            type: 'ForOfStatement',
            start: 0,
            end: 27,
            await: false,
            left: {
              type: 'VariableDeclaration',
              start: 6,
              end: 12,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 12,
                  id: {
                    type: 'ArrayPattern',
                    start: 9,
                    end: 12,
                    elements: [
                      {
                        type: 'Identifier',
                        start: 10,
                        end: 11,
                        name: 'x'
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            right: {
              type: 'ArrayExpression',
              start: 16,
              end: 22,
              elements: [
                {
                  type: 'ArrayExpression',
                  start: 17,
                  end: 21,
                  elements: [
                    {
                      type: 'Literal',
                      start: 18,
                      end: 20,
                      value: 34
                    }
                  ]
                }
              ]
            },
            body: {
              type: 'BlockStatement',
              start: 25,
              end: 27,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (yield[g]--;;);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        body: [
          {
            type: 'ForStatement',
            start: 0,
            end: 19,
            init: {
              type: 'UpdateExpression',
              start: 5,
              end: 15,
              operator: '--',
              prefix: false,
              argument: {
                type: 'MemberExpression',
                start: 5,
                end: 13,
                object: {
                  type: 'Identifier',
                  start: 5,
                  end: 10,
                  name: 'yield'
                },
                property: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  name: 'g'
                },
                computed: true
              }
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement',
              start: 18,
              end: 19
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function fn4([[x, y, ...z]]) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 31,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 31,
            id: {
              type: 'Identifier',
              start: 9,
              end: 12,
              name: 'fn4'
            },
            generator: false,
            async: false,
            params: [
              {
                type: 'ArrayPattern',
                start: 13,
                end: 27,
                elements: [
                  {
                    type: 'ArrayPattern',
                    start: 14,
                    end: 26,
                    elements: [
                      {
                        type: 'Identifier',
                        start: 15,
                        end: 16,
                        name: 'x'
                      },
                      {
                        type: 'Identifier',
                        start: 18,
                        end: 19,
                        name: 'y'
                      },
                      {
                        type: 'RestElement',
                        start: 21,
                        end: 25,
                        argument: {
                          type: 'Identifier',
                          start: 24,
                          end: 25,
                          name: 'z'
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 29,
              end: 31,
              body: []
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 7,
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 1,
                    end: 6,
                    left: {
                      type: 'MemberExpression',
                      start: 1,
                      end: 4,
                      object: {
                        type: 'Identifier',
                        start: 1,
                        end: 2,
                        name: 'x'
                      },
                      property: {
                        type: 'Identifier',
                        start: 3,
                        end: 4,
                        name: 'a'
                      },
                      computed: false
                    },
                    right: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      name: 'a'
                    }
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 10,
                end: 11,
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[{a=0},{a=0}] = 0',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 17,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 13,
                elements: [
                  {
                    type: 'ObjectPattern',
                    start: 1,
                    end: 6,
                    properties: [
                      {
                        type: 'Property',
                        start: 2,
                        end: 5,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 2,
                          end: 5,
                          left: {
                            type: 'Identifier',
                            start: 2,
                            end: 3,
                            name: 'a'
                          },
                          right: {
                            type: 'Literal',
                            start: 4,
                            end: 5,
                            value: 0
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    start: 7,
                    end: 12,
                    properties: [
                      {
                        type: 'Property',
                        start: 8,
                        end: 11,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 8,
                          end: 9,
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 8,
                          end: 11,
                          left: {
                            type: 'Identifier',
                            start: 8,
                            end: 9,
                            name: 'a'
                          },
                          right: {
                            type: 'Literal',
                            start: 10,
                            end: 11,
                            value: 0
                          }
                        }
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 16,
                end: 17,
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...[...a[x]]] = 1',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 18,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 14,
                elements: [
                  {
                    type: 'RestElement',
                    start: 1,
                    end: 13,
                    argument: {
                      type: 'ArrayPattern',
                      start: 4,
                      end: 13,
                      elements: [
                        {
                          type: 'RestElement',
                          start: 5,
                          end: 12,
                          argument: {
                            type: 'MemberExpression',
                            start: 8,
                            end: 12,
                            object: {
                              type: 'Identifier',
                              start: 8,
                              end: 9,
                              name: 'a'
                            },
                            property: {
                              type: 'Identifier',
                              start: 10,
                              end: 11,
                              name: 'x'
                            },
                            computed: true
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 17,
                end: 18,
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'var {x: y, z: { a: b } } = { x: "3", z: { a: "b" } };',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 53,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 53,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 52,
                id: {
                  type: 'ObjectPattern',
                  start: 4,
                  end: 24,
                  properties: [
                    {
                      type: 'Property',
                      start: 5,
                      end: 9,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 5,
                        end: 6,
                        name: 'x'
                      },
                      value: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        name: 'y'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 11,
                      end: 22,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 11,
                        end: 12,
                        name: 'z'
                      },
                      value: {
                        type: 'ObjectPattern',
                        start: 14,
                        end: 22,
                        properties: [
                          {
                            type: 'Property',
                            start: 16,
                            end: 20,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 16,
                              end: 17,
                              name: 'a'
                            },
                            value: {
                              type: 'Identifier',
                              start: 19,
                              end: 20,
                              name: 'b'
                            },
                            kind: 'init'
                          }
                        ]
                      },
                      kind: 'init'
                    }
                  ]
                },
                init: {
                  type: 'ObjectExpression',
                  start: 27,
                  end: 52,
                  properties: [
                    {
                      type: 'Property',
                      start: 29,
                      end: 35,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 29,
                        end: 30,
                        name: 'x'
                      },
                      value: {
                        type: 'Literal',
                        start: 32,
                        end: 35,
                        value: '3',
                        raw: '"3"'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 37,
                      end: 50,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 37,
                        end: 38,
                        name: 'z'
                      },
                      value: {
                        type: 'ObjectExpression',
                        start: 40,
                        end: 50,
                        properties: [
                          {
                            type: 'Property',
                            start: 42,
                            end: 48,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 42,
                              end: 43,
                              name: 'a'
                            },
                            value: {
                              type: 'Literal',
                              start: 45,
                              end: 48,
                              value: 'b',
                              raw: '"b"'
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
            kind: 'var'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[a,b=0,[c,...a[0]]={}]=0;',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 25,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 25,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 24,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 22,
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    name: 'a'
                  },
                  {
                    type: 'AssignmentPattern',
                    start: 3,
                    end: 6,
                    left: {
                      type: 'Identifier',
                      start: 3,
                      end: 4,
                      name: 'b'
                    },
                    right: {
                      type: 'Literal',
                      start: 5,
                      end: 6,
                      value: 0,
                      raw: '0'
                    }
                  },
                  {
                    type: 'AssignmentPattern',
                    start: 7,
                    end: 21,
                    left: {
                      type: 'ArrayPattern',
                      start: 7,
                      end: 18,
                      elements: [
                        {
                          type: 'Identifier',
                          start: 8,
                          end: 9,
                          name: 'c'
                        },
                        {
                          type: 'RestElement',
                          start: 10,
                          end: 17,
                          argument: {
                            type: 'MemberExpression',
                            start: 13,
                            end: 17,
                            object: {
                              type: 'Identifier',
                              start: 13,
                              end: 14,
                              name: 'a'
                            },
                            property: {
                              type: 'Literal',
                              start: 15,
                              end: 16,
                              value: 0,
                              raw: '0'
                            },
                            computed: true
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      start: 19,
                      end: 21,
                      properties: []
                    }
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 23,
                end: 24,
                value: 0,
                raw: '0'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({a,b=b,a:c,[a]:[d]})=>0;',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 25,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 25,
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 24,
              expression: true,
              async: false,
              params: [
                {
                  type: 'ObjectPattern',
                  start: 1,
                  end: 20,
                  properties: [
                    {
                      type: 'Property',
                      start: 2,
                      end: 3,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 2,
                        end: 3,
                        name: 'a'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 2,
                        end: 3,
                        name: 'a'
                      }
                    },
                    {
                      type: 'Property',
                      start: 4,
                      end: 7,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 4,
                        end: 5,
                        name: 'b'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 4,
                        end: 7,
                        left: {
                          type: 'Identifier',
                          start: 4,
                          end: 5,
                          name: 'b'
                        },
                        right: {
                          type: 'Identifier',
                          start: 6,
                          end: 7,
                          name: 'b'
                        }
                      }
                    },
                    {
                      type: 'Property',
                      start: 8,
                      end: 11,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        start: 10,
                        end: 11,
                        name: 'c'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 12,
                      end: 19,
                      method: false,
                      shorthand: false,
                      computed: true,
                      key: {
                        type: 'Identifier',
                        start: 13,
                        end: 14,
                        name: 'a'
                      },
                      value: {
                        type: 'ArrayPattern',
                        start: 16,
                        end: 19,
                        elements: [
                          {
                            type: 'Identifier',
                            start: 17,
                            end: 18,
                            name: 'd'
                          }
                        ]
                      },
                      kind: 'init'
                    }
                  ]
                }
              ],
              body: {
                type: 'Literal',
                start: 23,
                end: 24,
                value: 0,
                raw: '0'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(x, y = 9, {b}, z = 8, ...a) => {}',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 34,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 34,
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 34,
              expression: false,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  name: 'x'
                },
                {
                  type: 'AssignmentPattern',
                  start: 4,
                  end: 9,
                  left: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    name: 'y'
                  },
                  right: {
                    type: 'Literal',
                    start: 8,
                    end: 9,
                    value: 9,
                    raw: '9'
                  }
                },
                {
                  type: 'ObjectPattern',
                  start: 11,
                  end: 14,
                  properties: [
                    {
                      type: 'Property',
                      start: 12,
                      end: 13,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 12,
                        end: 13,
                        name: 'b'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 12,
                        end: 13,
                        name: 'b'
                      }
                    }
                  ]
                },
                {
                  type: 'AssignmentPattern',
                  start: 16,
                  end: 21,
                  left: {
                    type: 'Identifier',
                    start: 16,
                    end: 17,
                    name: 'z'
                  },
                  right: {
                    type: 'Literal',
                    start: 20,
                    end: 21,
                    value: 8,
                    raw: '8'
                  }
                },
                {
                  type: 'RestElement',
                  start: 23,
                  end: 27,
                  argument: {
                    type: 'Identifier',
                    start: 26,
                    end: 27,
                    name: 'a'
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 32,
                end: 34,
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...[{prop: 1}.prop]] = []',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 26,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 21,
                elements: [
                  {
                    type: 'RestElement',
                    start: 1,
                    end: 20,
                    argument: {
                      type: 'ArrayPattern',
                      start: 4,
                      end: 20,
                      elements: [
                        {
                          type: 'MemberExpression',
                          start: 5,
                          end: 19,
                          object: {
                            type: 'ObjectExpression',
                            start: 5,
                            end: 14,
                            properties: [
                              {
                                type: 'Property',
                                start: 6,
                                end: 13,
                                method: false,
                                shorthand: false,
                                computed: false,
                                key: {
                                  type: 'Identifier',
                                  start: 6,
                                  end: 10,
                                  name: 'prop'
                                },
                                value: {
                                  type: 'Literal',
                                  start: 12,
                                  end: 13,
                                  value: 1
                                },
                                kind: 'init'
                              }
                            ]
                          },
                          property: {
                            type: 'Identifier',
                            start: 15,
                            end: 19,
                            name: 'prop'
                          },
                          computed: false
                        }
                      ]
                    }
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 24,
                end: 26,
                elements: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f = ([cls = class {}]) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 28,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 28,
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'f'
              },
              right: {
                type: 'ArrowFunctionExpression',
                start: 4,
                end: 28,
                expression: false,
                async: false,
                params: [
                  {
                    type: 'ArrayPattern',
                    start: 5,
                    end: 21,
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        start: 6,
                        end: 20,
                        left: {
                          type: 'Identifier',
                          start: 6,
                          end: 9,
                          name: 'cls'
                        },
                        right: {
                          type: 'ClassExpression',
                          start: 12,
                          end: 20,
                          id: null,
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            start: 18,
                            end: 20,
                            body: []
                          }
                        }
                      }
                    ]
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  start: 26,
                  end: 28,
                  body: []
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f = ([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) => {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 83,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 83,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 83,
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'f'
              },
              right: {
                type: 'ArrowFunctionExpression',
                start: 4,
                end: 83,
                expression: false,
                async: false,
                params: [
                  {
                    type: 'ArrayPattern',
                    start: 5,
                    end: 76,
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        start: 6,
                        end: 20,
                        left: {
                          type: 'Identifier',
                          start: 6,
                          end: 9,
                          name: 'cls'
                        },
                        right: {
                          type: 'ClassExpression',
                          start: 12,
                          end: 20,
                          id: null,
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            start: 18,
                            end: 20,
                            body: []
                          }
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        start: 22,
                        end: 39,
                        left: {
                          type: 'Identifier',
                          start: 22,
                          end: 26,
                          name: 'xCls'
                        },
                        right: {
                          type: 'ClassExpression',
                          start: 29,
                          end: 39,
                          id: {
                            type: 'Identifier',
                            start: 35,
                            end: 36,
                            name: 'X'
                          },
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            start: 37,
                            end: 39,
                            body: []
                          }
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        start: 41,
                        end: 75,
                        left: {
                          type: 'Identifier',
                          start: 41,
                          end: 46,
                          name: 'xCls2'
                        },
                        right: {
                          type: 'ClassExpression',
                          start: 49,
                          end: 75,
                          id: null,
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            start: 55,
                            end: 75,
                            body: [
                              {
                                type: 'MethodDefinition',
                                start: 57,
                                end: 73,
                                kind: 'method',
                                static: true,
                                computed: false,
                                key: {
                                  type: 'Identifier',
                                  start: 64,
                                  end: 68,
                                  name: 'name'
                                },
                                value: {
                                  type: 'FunctionExpression',
                                  start: 68,
                                  end: 73,
                                  generator: false,
                                  id: null,
                                  async: false,
                                  params: [],
                                  body: {
                                    type: 'BlockStatement',
                                    start: 71,
                                    end: 73,
                                    body: []
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  start: 81,
                  end: 83,
                  body: []
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 103,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 103,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 102,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 65,
                elements: [
                  {
                    type: 'ObjectPattern',
                    start: 1,
                    end: 29,
                    properties: [
                      {
                        type: 'Property',
                        start: 2,
                        end: 27,
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayPattern',
                          start: 6,
                          end: 27,
                          elements: [
                            {
                              type: 'ObjectPattern',
                              start: 7,
                              end: 26,
                              properties: [
                                {
                                  type: 'Property',
                                  start: 8,
                                  end: 17,
                                  method: false,
                                  shorthand: false,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 8,
                                    end: 9,
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectPattern',
                                    start: 10,
                                    end: 17,
                                    properties: [
                                      {
                                        type: 'Property',
                                        start: 11,
                                        end: 16,
                                        method: false,
                                        shorthand: true,
                                        computed: false,
                                        key: {
                                          type: 'Identifier',
                                          start: 11,
                                          end: 12,
                                          name: 'z'
                                        },
                                        kind: 'init',
                                        value: {
                                          type: 'AssignmentPattern',
                                          start: 11,
                                          end: 16,
                                          left: {
                                            type: 'Identifier',
                                            start: 11,
                                            end: 12,
                                            name: 'z'
                                          },
                                          right: {
                                            type: 'Literal',
                                            start: 15,
                                            end: 16,
                                            value: 1,
                                            raw: '1'
                                          }
                                        }
                                      }
                                    ]
                                  },
                                  kind: 'init'
                                },
                                {
                                  type: 'Property',
                                  start: 19,
                                  end: 25,
                                  method: false,
                                  shorthand: true,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 19,
                                    end: 21,
                                    name: 'z1'
                                  },
                                  kind: 'init',
                                  value: {
                                    type: 'AssignmentPattern',
                                    start: 19,
                                    end: 25,
                                    left: {
                                      type: 'Identifier',
                                      start: 19,
                                      end: 21,
                                      name: 'z1'
                                    },
                                    right: {
                                      type: 'Literal',
                                      start: 24,
                                      end: 25,
                                      value: 2,
                                      raw: '2'
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    start: 31,
                    end: 39,
                    properties: [
                      {
                        type: 'Property',
                        start: 32,
                        end: 38,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 32,
                          end: 34,
                          name: 'x2'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 32,
                          end: 38,
                          left: {
                            type: 'Identifier',
                            start: 32,
                            end: 34,
                            name: 'x2'
                          },
                          right: {
                            type: 'Literal',
                            start: 37,
                            end: 38,
                            value: 3,
                            raw: '3'
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    start: 41,
                    end: 63,
                    properties: [
                      {
                        type: 'Property',
                        start: 42,
                        end: 62,
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 42,
                          end: 44,
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectPattern',
                          start: 47,
                          end: 62,
                          properties: [
                            {
                              type: 'Property',
                              start: 48,
                              end: 61,
                              method: false,
                              shorthand: false,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                start: 48,
                                end: 50,
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayPattern',
                                start: 51,
                                end: 61,
                                elements: [
                                  {
                                    type: 'ObjectPattern',
                                    start: 52,
                                    end: 60,
                                    properties: [
                                      {
                                        type: 'Property',
                                        start: 53,
                                        end: 59,
                                        method: false,
                                        shorthand: true,
                                        computed: false,
                                        key: {
                                          type: 'Identifier',
                                          start: 53,
                                          end: 55,
                                          name: 'z3'
                                        },
                                        kind: 'init',
                                        value: {
                                          type: 'AssignmentPattern',
                                          start: 53,
                                          end: 59,
                                          left: {
                                            type: 'Identifier',
                                            start: 53,
                                            end: 55,
                                            name: 'z3'
                                          },
                                          right: {
                                            type: 'Literal',
                                            start: 58,
                                            end: 59,
                                            value: 4,
                                            raw: '4'
                                          }
                                        }
                                      }
                                    ]
                                  }
                                ]
                              },
                              kind: 'init'
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 68,
                end: 102,
                elements: [
                  {
                    type: 'ObjectExpression',
                    start: 69,
                    end: 81,
                    properties: [
                      {
                        type: 'Property',
                        start: 70,
                        end: 80,
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 70,
                          end: 71,
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayExpression',
                          start: 72,
                          end: 80,
                          elements: [
                            {
                              type: 'ObjectExpression',
                              start: 73,
                              end: 79,
                              properties: [
                                {
                                  type: 'Property',
                                  start: 74,
                                  end: 78,
                                  method: false,
                                  shorthand: false,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 74,
                                    end: 75,
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectExpression',
                                    start: 76,
                                    end: 78,
                                    properties: []
                                  },
                                  kind: 'init'
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'ObjectExpression',
                    start: 83,
                    end: 85,
                    properties: []
                  },
                  {
                    type: 'ObjectExpression',
                    start: 87,
                    end: 101,
                    properties: [
                      {
                        type: 'Property',
                        start: 88,
                        end: 100,
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 88,
                          end: 90,
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectExpression',
                          start: 91,
                          end: 100,
                          properties: [
                            {
                              type: 'Property',
                              start: 92,
                              end: 99,
                              method: false,
                              shorthand: false,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                start: 92,
                                end: 94,
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayExpression',
                                start: 95,
                                end: 99,
                                elements: [
                                  {
                                    type: 'ObjectExpression',
                                    start: 96,
                                    end: 98,
                                    properties: []
                                  }
                                ]
                              },
                              kind: 'init'
                            }
                          ]
                        },
                        kind: 'init'
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
      `function bind_bindFunction0(fun, thisArg, boundArgs) {
      return function bound() {
          // Ensure we allocate a call-object slot for |boundArgs|, so the
          // debugger can access this value.
          if (false) void boundArgs;

          var newTarget;
          if (_IsConstructing()) {
              newTarget = new.target;
              if (newTarget === bound)
                  newTarget = fun;
              switch (arguments.length) {
                case 0:
                  return constructContentFunction(fun, newTarget);
                case 1:
                  return constructContentFunction(fun, newTarget, SPREAD(arguments, 1));
                case 2:
                  return constructContentFunction(fun, newTarget, SPREAD(arguments, 2));
                case 3:
                  return constructContentFunction(fun, newTarget, SPREAD(arguments, 3));
                case 4:
                  return constructContentFunction(fun, newTarget, SPREAD(arguments, 4));
                case 5:
                  return constructContentFunction(fun, newTarget, SPREAD(arguments, 5));
                default:
                  var args = FUN_APPLY(bind_mapArguments, null, arguments);
                  return bind_constructFunctionN(fun, newTarget, args);
              }
          } else {
              switch (arguments.length) {
                case 0:
                  return callContentFunction(fun, thisArg);
                case 1:
                  return callContentFunction(fun, thisArg, SPREAD(arguments, 1));
                case 2:
                  return callContentFunction(fun, thisArg, SPREAD(arguments, 2));
                case 3:
                  return callContentFunction(fun, thisArg, SPREAD(arguments, 3));
                case 4:
                  return callContentFunction(fun, thisArg, SPREAD(arguments, 4));
                case 5:
                  return callContentFunction(fun, thisArg, SPREAD(arguments, 5));
                default:
                  return FUN_APPLY(fun, thisArg, arguments);
              }
          }
      };
    }`,
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 2107,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 2107,
            id: {
              type: 'Identifier',
              start: 9,
              end: 27,
              name: 'bind_bindFunction0'
            },
            generator: false,
            async: false,
            params: [
              {
                type: 'Identifier',
                start: 28,
                end: 31,
                name: 'fun'
              },
              {
                type: 'Identifier',
                start: 33,
                end: 40,
                name: 'thisArg'
              },
              {
                type: 'Identifier',
                start: 42,
                end: 51,
                name: 'boundArgs'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 53,
              end: 2107,
              body: [
                {
                  type: 'ReturnStatement',
                  start: 61,
                  end: 2101,
                  argument: {
                    type: 'FunctionExpression',
                    start: 68,
                    end: 2100,
                    id: {
                      type: 'Identifier',
                      start: 77,
                      end: 82,
                      name: 'bound'
                    },
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 85,
                      end: 2100,
                      body: [
                        {
                          type: 'IfStatement',
                          start: 217,
                          end: 243,
                          test: {
                            type: 'Literal',
                            start: 221,
                            end: 226,
                            value: false,
                            raw: 'false'
                          },
                          consequent: {
                            type: 'ExpressionStatement',
                            start: 228,
                            end: 243,
                            expression: {
                              type: 'UnaryExpression',
                              start: 228,
                              end: 242,
                              operator: 'void',
                              prefix: true,
                              argument: {
                                type: 'Identifier',
                                start: 233,
                                end: 242,
                                name: 'boundArgs'
                              }
                            }
                          },
                          alternate: null
                        },
                        {
                          type: 'VariableDeclaration',
                          start: 255,
                          end: 269,
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              start: 259,
                              end: 268,
                              id: {
                                type: 'Identifier',
                                start: 259,
                                end: 268,
                                name: 'newTarget'
                              },
                              init: null
                            }
                          ],
                          kind: 'var'
                        },
                        {
                          type: 'IfStatement',
                          start: 280,
                          end: 2092,
                          test: {
                            type: 'CallExpression',
                            start: 284,
                            end: 301,
                            callee: {
                              type: 'Identifier',
                              start: 284,
                              end: 299,
                              name: '_IsConstructing'
                            },
                            arguments: []
                          },
                          consequent: {
                            type: 'BlockStatement',
                            start: 303,
                            end: 1315,
                            body: [
                              {
                                type: 'ExpressionStatement',
                                start: 319,
                                end: 342,
                                expression: {
                                  type: 'AssignmentExpression',
                                  start: 319,
                                  end: 341,
                                  operator: '=',
                                  left: {
                                    type: 'Identifier',
                                    start: 319,
                                    end: 328,
                                    name: 'newTarget'
                                  },
                                  right: {
                                    type: 'MetaProperty',
                                    start: 331,
                                    end: 341,
                                    meta: {
                                      type: 'Identifier',
                                      start: 331,
                                      end: 334,
                                      name: 'new'
                                    },
                                    property: {
                                      type: 'Identifier',
                                      start: 335,
                                      end: 341,
                                      name: 'target'
                                    }
                                  }
                                }
                              },
                              {
                                type: 'IfStatement',
                                start: 357,
                                end: 416,
                                test: {
                                  type: 'BinaryExpression',
                                  start: 361,
                                  end: 380,
                                  left: {
                                    type: 'Identifier',
                                    start: 361,
                                    end: 370,
                                    name: 'newTarget'
                                  },
                                  operator: '===',
                                  right: {
                                    type: 'Identifier',
                                    start: 375,
                                    end: 380,
                                    name: 'bound'
                                  }
                                },
                                consequent: {
                                  type: 'ExpressionStatement',
                                  start: 400,
                                  end: 416,
                                  expression: {
                                    type: 'AssignmentExpression',
                                    start: 400,
                                    end: 415,
                                    operator: '=',
                                    left: {
                                      type: 'Identifier',
                                      start: 400,
                                      end: 409,
                                      name: 'newTarget'
                                    },
                                    right: {
                                      type: 'Identifier',
                                      start: 412,
                                      end: 415,
                                      name: 'fun'
                                    }
                                  }
                                },
                                alternate: null
                              },
                              {
                                type: 'SwitchStatement',
                                start: 431,
                                end: 1303,
                                discriminant: {
                                  type: 'MemberExpression',
                                  start: 439,
                                  end: 455,
                                  object: {
                                    type: 'Identifier',
                                    start: 439,
                                    end: 448,
                                    name: 'arguments'
                                  },
                                  property: {
                                    type: 'Identifier',
                                    start: 449,
                                    end: 455,
                                    name: 'length'
                                  },
                                  computed: false
                                },
                                cases: [
                                  {
                                    type: 'SwitchCase',
                                    start: 475,
                                    end: 549,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 501,
                                        end: 549,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 508,
                                          end: 548,
                                          callee: {
                                            type: 'Identifier',
                                            start: 508,
                                            end: 532,
                                            name: 'constructContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 533,
                                              end: 536,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 538,
                                              end: 547,
                                              name: 'newTarget'
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 480,
                                      end: 481,
                                      value: 0,
                                      raw: '0'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 566,
                                    end: 662,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 592,
                                        end: 662,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 599,
                                          end: 661,
                                          callee: {
                                            type: 'Identifier',
                                            start: 599,
                                            end: 623,
                                            name: 'constructContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 624,
                                              end: 627,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 629,
                                              end: 638,
                                              name: 'newTarget'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 640,
                                              end: 660,
                                              callee: {
                                                type: 'Identifier',
                                                start: 640,
                                                end: 646,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 647,
                                                  end: 656,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 658,
                                                  end: 659,
                                                  value: 1,
                                                  raw: '1'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 571,
                                      end: 572,
                                      value: 1,
                                      raw: '1'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 679,
                                    end: 775,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 705,
                                        end: 775,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 712,
                                          end: 774,
                                          callee: {
                                            type: 'Identifier',
                                            start: 712,
                                            end: 736,
                                            name: 'constructContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 737,
                                              end: 740,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 742,
                                              end: 751,
                                              name: 'newTarget'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 753,
                                              end: 773,
                                              callee: {
                                                type: 'Identifier',
                                                start: 753,
                                                end: 759,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 760,
                                                  end: 769,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 771,
                                                  end: 772,
                                                  value: 2,
                                                  raw: '2'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 684,
                                      end: 685,
                                      value: 2,
                                      raw: '2'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 792,
                                    end: 888,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 818,
                                        end: 888,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 825,
                                          end: 887,
                                          callee: {
                                            type: 'Identifier',
                                            start: 825,
                                            end: 849,
                                            name: 'constructContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 850,
                                              end: 853,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 855,
                                              end: 864,
                                              name: 'newTarget'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 866,
                                              end: 886,
                                              callee: {
                                                type: 'Identifier',
                                                start: 866,
                                                end: 872,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 873,
                                                  end: 882,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 884,
                                                  end: 885,
                                                  value: 3,
                                                  raw: '3'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 797,
                                      end: 798,
                                      value: 3,
                                      raw: '3'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 905,
                                    end: 1001,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 931,
                                        end: 1001,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 938,
                                          end: 1000,
                                          callee: {
                                            type: 'Identifier',
                                            start: 938,
                                            end: 962,
                                            name: 'constructContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 963,
                                              end: 966,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 968,
                                              end: 977,
                                              name: 'newTarget'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 979,
                                              end: 999,
                                              callee: {
                                                type: 'Identifier',
                                                start: 979,
                                                end: 985,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 986,
                                                  end: 995,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 997,
                                                  end: 998,
                                                  value: 4,
                                                  raw: '4'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 910,
                                      end: 911,
                                      value: 4,
                                      raw: '4'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 1018,
                                    end: 1114,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 1044,
                                        end: 1114,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 1051,
                                          end: 1113,
                                          callee: {
                                            type: 'Identifier',
                                            start: 1051,
                                            end: 1075,
                                            name: 'constructContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 1076,
                                              end: 1079,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 1081,
                                              end: 1090,
                                              name: 'newTarget'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 1092,
                                              end: 1112,
                                              callee: {
                                                type: 'Identifier',
                                                start: 1092,
                                                end: 1098,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 1099,
                                                  end: 1108,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 1110,
                                                  end: 1111,
                                                  value: 5,
                                                  raw: '5'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 1023,
                                      end: 1024,
                                      value: 5,
                                      raw: '5'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 1131,
                                    end: 1287,
                                    consequent: [
                                      {
                                        type: 'VariableDeclaration',
                                        start: 1158,
                                        end: 1215,
                                        declarations: [
                                          {
                                            type: 'VariableDeclarator',
                                            start: 1162,
                                            end: 1214,
                                            id: {
                                              type: 'Identifier',
                                              start: 1162,
                                              end: 1166,
                                              name: 'args'
                                            },
                                            init: {
                                              type: 'CallExpression',
                                              start: 1169,
                                              end: 1214,
                                              callee: {
                                                type: 'Identifier',
                                                start: 1169,
                                                end: 1178,
                                                name: 'FUN_APPLY'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 1179,
                                                  end: 1196,
                                                  name: 'bind_mapArguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 1198,
                                                  end: 1202,
                                                  value: null,
                                                  raw: 'null'
                                                },
                                                {
                                                  type: 'Identifier',
                                                  start: 1204,
                                                  end: 1213,
                                                  name: 'arguments'
                                                }
                                              ]
                                            }
                                          }
                                        ],
                                        kind: 'var'
                                      },
                                      {
                                        type: 'ReturnStatement',
                                        start: 1234,
                                        end: 1287,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 1241,
                                          end: 1286,
                                          callee: {
                                            type: 'Identifier',
                                            start: 1241,
                                            end: 1264,
                                            name: 'bind_constructFunctionN'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 1265,
                                              end: 1268,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 1270,
                                              end: 1279,
                                              name: 'newTarget'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 1281,
                                              end: 1285,
                                              name: 'args'
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: null
                                  }
                                ]
                              }
                            ]
                          },
                          alternate: {
                            type: 'BlockStatement',
                            start: 1321,
                            end: 2092,
                            body: [
                              {
                                type: 'SwitchStatement',
                                start: 1337,
                                end: 2080,
                                discriminant: {
                                  type: 'MemberExpression',
                                  start: 1345,
                                  end: 1361,
                                  object: {
                                    type: 'Identifier',
                                    start: 1345,
                                    end: 1354,
                                    name: 'arguments'
                                  },
                                  property: {
                                    type: 'Identifier',
                                    start: 1355,
                                    end: 1361,
                                    name: 'length'
                                  },
                                  computed: false
                                },
                                cases: [
                                  {
                                    type: 'SwitchCase',
                                    start: 1381,
                                    end: 1448,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 1407,
                                        end: 1448,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 1414,
                                          end: 1447,
                                          callee: {
                                            type: 'Identifier',
                                            start: 1414,
                                            end: 1433,
                                            name: 'callContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 1434,
                                              end: 1437,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 1439,
                                              end: 1446,
                                              name: 'thisArg'
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 1386,
                                      end: 1387,
                                      value: 0,
                                      raw: '0'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 1465,
                                    end: 1554,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 1491,
                                        end: 1554,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 1498,
                                          end: 1553,
                                          callee: {
                                            type: 'Identifier',
                                            start: 1498,
                                            end: 1517,
                                            name: 'callContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 1518,
                                              end: 1521,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 1523,
                                              end: 1530,
                                              name: 'thisArg'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 1532,
                                              end: 1552,
                                              callee: {
                                                type: 'Identifier',
                                                start: 1532,
                                                end: 1538,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 1539,
                                                  end: 1548,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 1550,
                                                  end: 1551,
                                                  value: 1,
                                                  raw: '1'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 1470,
                                      end: 1471,
                                      value: 1,
                                      raw: '1'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 1571,
                                    end: 1660,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 1597,
                                        end: 1660,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 1604,
                                          end: 1659,
                                          callee: {
                                            type: 'Identifier',
                                            start: 1604,
                                            end: 1623,
                                            name: 'callContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 1624,
                                              end: 1627,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 1629,
                                              end: 1636,
                                              name: 'thisArg'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 1638,
                                              end: 1658,
                                              callee: {
                                                type: 'Identifier',
                                                start: 1638,
                                                end: 1644,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 1645,
                                                  end: 1654,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 1656,
                                                  end: 1657,
                                                  value: 2,
                                                  raw: '2'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 1576,
                                      end: 1577,
                                      value: 2,
                                      raw: '2'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 1677,
                                    end: 1766,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 1703,
                                        end: 1766,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 1710,
                                          end: 1765,
                                          callee: {
                                            type: 'Identifier',
                                            start: 1710,
                                            end: 1729,
                                            name: 'callContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 1730,
                                              end: 1733,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 1735,
                                              end: 1742,
                                              name: 'thisArg'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 1744,
                                              end: 1764,
                                              callee: {
                                                type: 'Identifier',
                                                start: 1744,
                                                end: 1750,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 1751,
                                                  end: 1760,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 1762,
                                                  end: 1763,
                                                  value: 3,
                                                  raw: '3'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 1682,
                                      end: 1683,
                                      value: 3,
                                      raw: '3'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 1783,
                                    end: 1872,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 1809,
                                        end: 1872,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 1816,
                                          end: 1871,
                                          callee: {
                                            type: 'Identifier',
                                            start: 1816,
                                            end: 1835,
                                            name: 'callContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 1836,
                                              end: 1839,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 1841,
                                              end: 1848,
                                              name: 'thisArg'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 1850,
                                              end: 1870,
                                              callee: {
                                                type: 'Identifier',
                                                start: 1850,
                                                end: 1856,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 1857,
                                                  end: 1866,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 1868,
                                                  end: 1869,
                                                  value: 4,
                                                  raw: '4'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 1788,
                                      end: 1789,
                                      value: 4,
                                      raw: '4'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 1889,
                                    end: 1978,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 1915,
                                        end: 1978,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 1922,
                                          end: 1977,
                                          callee: {
                                            type: 'Identifier',
                                            start: 1922,
                                            end: 1941,
                                            name: 'callContentFunction'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 1942,
                                              end: 1945,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 1947,
                                              end: 1954,
                                              name: 'thisArg'
                                            },
                                            {
                                              type: 'CallExpression',
                                              start: 1956,
                                              end: 1976,
                                              callee: {
                                                type: 'Identifier',
                                                start: 1956,
                                                end: 1962,
                                                name: 'SPREAD'
                                              },
                                              arguments: [
                                                {
                                                  type: 'Identifier',
                                                  start: 1963,
                                                  end: 1972,
                                                  name: 'arguments'
                                                },
                                                {
                                                  type: 'Literal',
                                                  start: 1974,
                                                  end: 1975,
                                                  value: 5,
                                                  raw: '5'
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: {
                                      type: 'Literal',
                                      start: 1894,
                                      end: 1895,
                                      value: 5,
                                      raw: '5'
                                    }
                                  },
                                  {
                                    type: 'SwitchCase',
                                    start: 1995,
                                    end: 2064,
                                    consequent: [
                                      {
                                        type: 'ReturnStatement',
                                        start: 2022,
                                        end: 2064,
                                        argument: {
                                          type: 'CallExpression',
                                          start: 2029,
                                          end: 2063,
                                          callee: {
                                            type: 'Identifier',
                                            start: 2029,
                                            end: 2038,
                                            name: 'FUN_APPLY'
                                          },
                                          arguments: [
                                            {
                                              type: 'Identifier',
                                              start: 2039,
                                              end: 2042,
                                              name: 'fun'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 2044,
                                              end: 2051,
                                              name: 'thisArg'
                                            },
                                            {
                                              type: 'Identifier',
                                              start: 2053,
                                              end: 2062,
                                              name: 'arguments'
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    test: null
                                  }
                                ]
                              }
                            ]
                          }
                        }
                      ]
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
    [
      'a--',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 3,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 3,
            expression: {
              type: 'UpdateExpression',
              start: 0,
              end: 3,
              operator: '--',
              prefix: false,
              argument: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'a'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '--a',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 3,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 3,
            expression: {
              type: 'UpdateExpression',
              start: 0,
              end: 3,
              operator: '--',
              prefix: true,
              argument: {
                type: 'Identifier',
                start: 2,
                end: 3,
                name: 'a'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
