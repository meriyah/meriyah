import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Miscellaneous - ranges', () => {
  pass('Miscellaneous - ranges (pass)', [
    [
      `let fun = () => {
        // one
        // two
        // three
        return (1);
    }`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 90,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 6,
            column: 5
          }
        },
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 90,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 6,
                column: 5
              }
            },
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 90,
                loc: {
                  start: {
                    line: 1,
                    column: 4
                  },
                  end: {
                    line: 6,
                    column: 5
                  }
                },
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 7,
                  loc: {
                    start: {
                      line: 1,
                      column: 4
                    },
                    end: {
                      line: 1,
                      column: 7
                    }
                  },
                  name: 'fun'
                },
                init: {
                  type: 'ArrowFunctionExpression',
                  start: 10,
                  end: 90,
                  loc: {
                    start: {
                      line: 1,
                      column: 10
                    },
                    end: {
                      line: 6,
                      column: 5
                    }
                  },
                  expression: false,
                  async: false,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 16,
                    end: 90,
                    loc: {
                      start: {
                        line: 1,
                        column: 16
                      },
                      end: {
                        line: 6,
                        column: 5
                      }
                    },
                    body: [
                      {
                        type: 'ReturnStatement',
                        start: 73,
                        end: 84,
                        loc: {
                          start: {
                            line: 5,
                            column: 8
                          },
                          end: {
                            line: 5,
                            column: 19
                          }
                        },
                        argument: {
                          type: 'Literal',
                          start: 81,
                          end: 82,
                          loc: {
                            start: {
                              line: 5,
                              column: 16
                            },
                            end: {
                              line: 5,
                              column: 17
                            }
                          },
                          value: 1
                        }
                      }
                    ]
                  }
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 3,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 3
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 3,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 3
              }
            },
            expression: {
              type: 'Identifier',
              start: 0,
              end: 3,
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 3
                }
              },
              name: 'let'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let.bar[foo]',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 12,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 12
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 12
              }
            },
            expression: {
              type: 'MemberExpression',
              start: 0,
              end: 12,
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 12
                }
              },
              object: {
                type: 'MemberExpression',
                start: 0,
                end: 7,
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 7
                  }
                },
                object: {
                  type: 'Identifier',
                  start: 0,
                  end: 3,
                  loc: {
                    start: {
                      line: 1,
                      column: 0
                    },
                    end: {
                      line: 1,
                      column: 3
                    }
                  },
                  name: 'let'
                },
                property: {
                  type: 'Identifier',
                  start: 4,
                  end: 7,
                  loc: {
                    start: {
                      line: 1,
                      column: 4
                    },
                    end: {
                      line: 1,
                      column: 7
                    }
                  },
                  name: 'bar'
                },
                computed: false
              },
              property: {
                type: 'Identifier',
                start: 8,
                end: 11,
                loc: {
                  start: {
                    line: 1,
                    column: 8
                  },
                  end: {
                    line: 1,
                    column: 11
                  }
                },
                name: 'foo'
              },
              computed: true
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({f({x} = {x: 10}) {}});',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 24,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 24
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 24,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 24
              }
            },
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 22,
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 22
                }
              },
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 21,
                  loc: {
                    start: {
                      line: 1,
                      column: 2
                    },
                    end: {
                      line: 1,
                      column: 21
                    }
                  },
                  method: true,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    loc: {
                      start: {
                        line: 1,
                        column: 2
                      },
                      end: {
                        line: 1,
                        column: 3
                      }
                    },
                    name: 'f'
                  },
                  kind: 'init',
                  value: {
                    type: 'FunctionExpression',
                    start: 3,
                    end: 21,
                    loc: {
                      start: {
                        line: 1,
                        column: 3
                      },
                      end: {
                        line: 1,
                        column: 21
                      }
                    },
                    id: null,
                    generator: false,
                    async: false,
                    params: [
                      {
                        type: 'AssignmentPattern',
                        start: 4,
                        end: 17,
                        loc: {
                          start: {
                            line: 1,
                            column: 4
                          },
                          end: {
                            line: 1,
                            column: 17
                          }
                        },
                        left: {
                          type: 'ObjectPattern',
                          start: 4,
                          end: 7,
                          loc: {
                            start: {
                              line: 1,
                              column: 4
                            },
                            end: {
                              line: 1,
                              column: 7
                            }
                          },
                          properties: [
                            {
                              type: 'Property',
                              start: 5,
                              end: 6,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 5
                                },
                                end: {
                                  line: 1,
                                  column: 6
                                }
                              },
                              method: false,
                              shorthand: true,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                start: 5,
                                end: 6,
                                loc: {
                                  start: {
                                    line: 1,
                                    column: 5
                                  },
                                  end: {
                                    line: 1,
                                    column: 6
                                  }
                                },
                                name: 'x'
                              },
                              kind: 'init',
                              value: {
                                type: 'Identifier',
                                start: 5,
                                end: 6,
                                loc: {
                                  start: {
                                    line: 1,
                                    column: 5
                                  },
                                  end: {
                                    line: 1,
                                    column: 6
                                  }
                                },
                                name: 'x'
                              }
                            }
                          ]
                        },
                        right: {
                          type: 'ObjectExpression',
                          start: 10,
                          end: 17,
                          loc: {
                            start: {
                              line: 1,
                              column: 10
                            },
                            end: {
                              line: 1,
                              column: 17
                            }
                          },
                          properties: [
                            {
                              type: 'Property',
                              start: 11,
                              end: 16,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 11
                                },
                                end: {
                                  line: 1,
                                  column: 16
                                }
                              },
                              method: false,
                              shorthand: false,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                start: 11,
                                end: 12,
                                loc: {
                                  start: {
                                    line: 1,
                                    column: 11
                                  },
                                  end: {
                                    line: 1,
                                    column: 12
                                  }
                                },
                                name: 'x'
                              },
                              value: {
                                type: 'Literal',
                                start: 14,
                                end: 16,
                                loc: {
                                  start: {
                                    line: 1,
                                    column: 14
                                  },
                                  end: {
                                    line: 1,
                                    column: 16
                                  }
                                },
                                value: 10
                              },
                              kind: 'init'
                            }
                          ]
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      start: 19,
                      end: 21,
                      loc: {
                        start: {
                          line: 1,
                          column: 19
                        },
                        end: {
                          line: 1,
                          column: 21
                        }
                      },
                      body: []
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
      'var [x, , [, z]] = [1,2,[3,4]];',
      Context.OptionsRanges,
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
                init: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1,
                      start: 20,
                      end: 21
                    },
                    {
                      type: 'Literal',
                      value: 2,
                      start: 22,
                      end: 23
                    },
                    {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'Literal',
                          value: 3,
                          start: 25,
                          end: 26
                        },
                        {
                          type: 'Literal',
                          value: 4,
                          start: 27,
                          end: 28
                        }
                      ],
                      start: 24,
                      end: 29
                    }
                  ],
                  start: 19,
                  end: 30
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x',
                      start: 5,
                      end: 6
                    },
                    null,
                    {
                      type: 'ArrayPattern',
                      elements: [
                        null,
                        {
                          type: 'Identifier',
                          name: 'z',
                          start: 13,
                          end: 14
                        }
                      ],
                      start: 10,
                      end: 15
                    }
                  ],
                  start: 4,
                  end: 16
                },
                start: 4,
                end: 30
              }
            ],
            start: 0,
            end: 31
          }
        ],
        start: 0,
        end: 31
      }
    ],
    [
      '({x,y,} = 0)',
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
                      end: 3
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x',
                      start: 2,
                      end: 3
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true,
                    start: 2,
                    end: 3
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                      start: 4,
                      end: 5
                    },
                    value: {
                      type: 'Identifier',
                      name: 'y',
                      start: 4,
                      end: 5
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true,
                    start: 4,
                    end: 5
                  }
                ],
                start: 1,
                end: 7
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0,
                start: 10,
                end: 11
              },
              start: 1,
              end: 11
            },
            start: 0,
            end: 12
          }
        ],
        start: 0,
        end: 12
      }
    ],
    [
      '({x: y = z = 0} = 1)',
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
                      end: 3
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'y',
                        start: 5,
                        end: 6
                      },
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'z',
                          start: 9,
                          end: 10
                        },
                        operator: '=',
                        right: {
                          type: 'Literal',
                          value: 0,
                          start: 13,
                          end: 14
                        },
                        start: 9,
                        end: 14
                      },
                      start: 5,
                      end: 14
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false,
                    start: 2,
                    end: 14
                  }
                ],
                start: 1,
                end: 15
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 1,
                start: 18,
                end: 19
              },
              start: 1,
              end: 19
            },
            start: 0,
            end: 20
          }
        ],
        start: 0,
        end: 20
      }
    ],
    [
      '[...[...a[x]]] = b',
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
                    type: 'RestElement',
                    argument: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Identifier',
                              name: 'a',
                              start: 8,
                              end: 9
                            },
                            computed: true,
                            property: {
                              type: 'Identifier',
                              name: 'x',
                              start: 10,
                              end: 11
                            },
                            start: 8,
                            end: 12
                          },
                          start: 5,
                          end: 12
                        }
                      ],
                      start: 4,
                      end: 13
                    },
                    start: 1,
                    end: 13
                  }
                ],
                start: 0,
                end: 14
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'b',
                start: 17,
                end: 18
              },
              start: 0,
              end: 18
            },
            start: 0,
            end: 18
          }
        ],
        start: 0,
        end: 18
      }
    ],
    [
      '[{a=0}, ...b] = 0',
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
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a',
                          start: 2,
                          end: 3
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a',
                            start: 2,
                            end: 3
                          },
                          right: {
                            type: 'Literal',
                            value: 0,
                            start: 4,
                            end: 5
                          },
                          start: 2,
                          end: 5
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true,
                        start: 2,
                        end: 5
                      }
                    ],
                    start: 1,
                    end: 6
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'b',
                      start: 11,
                      end: 12
                    },
                    start: 8,
                    end: 12
                  }
                ],
                start: 0,
                end: 13
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0,
                start: 16,
                end: 17
              },
              start: 0,
              end: 17
            },
            start: 0,
            end: 17
          }
        ],
        start: 0,
        end: 17
      }
    ],
    [
      'var [{a = 0}] = 0;',
      Context.OptionsRanges,
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
                init: {
                  type: 'Literal',
                  value: 0,
                  start: 16,
                  end: 17
                },
                id: {
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
                            name: 'a',
                            start: 6,
                            end: 7
                          },
                          computed: false,
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'a',
                              start: 6,
                              end: 7
                            },
                            right: {
                              type: 'Literal',
                              value: 0,
                              start: 10,
                              end: 11
                            },
                            start: 6,
                            end: 11
                          },
                          method: false,
                          shorthand: true,
                          start: 6,
                          end: 11
                        }
                      ],
                      start: 5,
                      end: 12
                    }
                  ],
                  start: 4,
                  end: 13
                },
                start: 4,
                end: 17
              }
            ],
            start: 0,
            end: 18
          }
        ],
        start: 0,
        end: 18
      }
    ],
    [
      `var x = {
      baz(a = 10) {},
      foo(a, b = 10) {},
      toast(a, b = 10, c) {}
    };`,
      Context.OptionsRanges,
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
                init: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'baz',
                        start: 16,
                        end: 19
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'a',
                              start: 20,
                              end: 21
                            },
                            right: {
                              type: 'Literal',
                              value: 10,
                              start: 24,
                              end: 26
                            },
                            start: 20,
                            end: 26
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: [],
                          start: 28,
                          end: 30
                        },
                        async: false,
                        generator: false,
                        id: null,
                        start: 19,
                        end: 30
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false,
                      start: 16,
                      end: 30
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo',
                        start: 38,
                        end: 41
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'a',
                            start: 42,
                            end: 43
                          },
                          {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'b',
                              start: 45,
                              end: 46
                            },
                            right: {
                              type: 'Literal',
                              value: 10,
                              start: 49,
                              end: 51
                            },
                            start: 45,
                            end: 51
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: [],
                          start: 53,
                          end: 55
                        },
                        async: false,
                        generator: false,
                        id: null,
                        start: 41,
                        end: 55
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false,
                      start: 38,
                      end: 55
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'toast',
                        start: 63,
                        end: 68
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'a',
                            start: 69,
                            end: 70
                          },
                          {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'b',
                              start: 72,
                              end: 73
                            },
                            right: {
                              type: 'Literal',
                              value: 10,
                              start: 76,
                              end: 78
                            },
                            start: 72,
                            end: 78
                          },
                          {
                            type: 'Identifier',
                            name: 'c',
                            start: 80,
                            end: 81
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: [],
                          start: 83,
                          end: 85
                        },
                        async: false,
                        generator: false,
                        id: null,
                        start: 68,
                        end: 85
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false,
                      start: 63,
                      end: 85
                    }
                  ],
                  start: 8,
                  end: 91
                },
                id: {
                  type: 'Identifier',
                  name: 'x',
                  start: 4,
                  end: 5
                },
                start: 4,
                end: 91
              }
            ],
            start: 0,
            end: 92
          }
        ],
        start: 0,
        end: 92
      }
    ],
    [
      '([,,])=>0',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Literal',
                value: 0,
                start: 8,
                end: 9
              },
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [null, null],
                  start: 1,
                  end: 5
                }
              ],
              async: false,
              expression: true,
              start: 0,
              end: 9
            },
            start: 0,
            end: 9
          }
        ],
        start: 0,
        end: 9
      }
    ],
    [
      'for([a,b[a],{c,d=e,[f]:[g,h().a,(0).k,...i[0]]}] in 0);',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement',
              start: 54,
              end: 55
            },
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'Identifier',
                  name: 'a',
                  start: 5,
                  end: 6
                },
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'b',
                    start: 7,
                    end: 8
                  },
                  computed: true,
                  property: {
                    type: 'Identifier',
                    name: 'a',
                    start: 9,
                    end: 10
                  },
                  start: 7,
                  end: 11
                },
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'c',
                        start: 13,
                        end: 14
                      },
                      value: {
                        type: 'Identifier',
                        name: 'c',
                        start: 13,
                        end: 14
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true,
                      start: 13,
                      end: 14
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'd',
                        start: 15,
                        end: 16
                      },
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'd',
                          start: 15,
                          end: 16
                        },
                        right: {
                          type: 'Identifier',
                          name: 'e',
                          start: 17,
                          end: 18
                        },
                        start: 15,
                        end: 18
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true,
                      start: 15,
                      end: 18
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'f',
                        start: 20,
                        end: 21
                      },
                      value: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'g',
                            start: 24,
                            end: 25
                          },
                          {
                            type: 'MemberExpression',
                            object: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'h',
                                start: 26,
                                end: 27
                              },
                              arguments: [],
                              start: 26,
                              end: 29
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'a',
                              start: 30,
                              end: 31
                            },
                            start: 26,
                            end: 31
                          },
                          {
                            type: 'MemberExpression',
                            object: {
                              type: 'Literal',
                              value: 0,
                              start: 33,
                              end: 34
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'k',
                              start: 36,
                              end: 37
                            },
                            start: 32,
                            end: 37
                          },
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'i',
                                start: 41,
                                end: 42
                              },
                              computed: true,
                              property: {
                                type: 'Literal',
                                value: 0,
                                start: 43,
                                end: 44
                              },
                              start: 41,
                              end: 45
                            },
                            start: 38,
                            end: 45
                          }
                        ],
                        start: 23,
                        end: 46
                      },
                      kind: 'init',
                      computed: true,
                      method: false,
                      shorthand: false,
                      start: 19,
                      end: 46
                    }
                  ],
                  start: 12,
                  end: 47
                }
              ],
              start: 4,
              end: 48
            },
            right: {
              type: 'Literal',
              value: 0,
              start: 52,
              end: 53
            },
            start: 0,
            end: 55
          }
        ],
        start: 0,
        end: 55
      }
    ],
    [
      '({x = 10, y: { z = 10 }}) => [x, z]',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x',
                    start: 30,
                    end: 31
                  },
                  {
                    type: 'Identifier',
                    name: 'z',
                    start: 33,
                    end: 34
                  }
                ],
                start: 29,
                end: 35
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x',
                        start: 2,
                        end: 3
                      },
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x',
                          start: 2,
                          end: 3
                        },
                        right: {
                          type: 'Literal',
                          value: 10,
                          start: 6,
                          end: 8
                        },
                        start: 2,
                        end: 8
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true,
                      start: 2,
                      end: 8
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'y',
                        start: 10,
                        end: 11
                      },
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'z',
                              start: 15,
                              end: 16
                            },
                            value: {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'z',
                                start: 15,
                                end: 16
                              },
                              right: {
                                type: 'Literal',
                                value: 10,
                                start: 19,
                                end: 21
                              },
                              start: 15,
                              end: 21
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true,
                            start: 15,
                            end: 21
                          }
                        ],
                        start: 13,
                        end: 23
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false,
                      start: 10,
                      end: 23
                    }
                  ],
                  start: 1,
                  end: 24
                }
              ],
              async: false,
              expression: true,
              start: 0,
              end: 35
            },
            start: 0,
            end: 35
          }
        ],
        start: 0,
        end: 35
      }
    ],
    [
      '(x, y = 9, ...a) => {}',
      Context.OptionsRanges,
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
                body: [],
                start: 20,
                end: 22
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x',
                  start: 1,
                  end: 2
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'y',
                    start: 4,
                    end: 5
                  },
                  right: {
                    type: 'Literal',
                    value: 9,
                    start: 8,
                    end: 9
                  },
                  start: 4,
                  end: 9
                },
                {
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'a',
                    start: 14,
                    end: 15
                  },
                  start: 11,
                  end: 15
                }
              ],
              async: false,
              expression: false,
              start: 0,
              end: 22
            },
            start: 0,
            end: 22
          }
        ],
        start: 0,
        end: 22
      }
    ],
    [
      '({ tyssjh = ((cspagh = 4) => a) } = 1) => { /*jjj*/ }; (function(a) { })()',
      Context.OptionsRanges,
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
                body: [],
                start: 42,
                end: 53
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
                          name: 'tyssjh',
                          start: 3,
                          end: 9
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'tyssjh',
                            start: 3,
                            end: 9
                          },
                          right: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'Identifier',
                              name: 'a',
                              start: 29,
                              end: 30
                            },
                            params: [
                              {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'cspagh',
                                  start: 14,
                                  end: 20
                                },
                                right: {
                                  type: 'Literal',
                                  value: 4,
                                  start: 23,
                                  end: 24
                                },
                                start: 14,
                                end: 24
                              }
                            ],
                            async: false,
                            expression: true,
                            start: 13,
                            end: 30
                          },
                          start: 3,
                          end: 31
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true,
                        start: 3,
                        end: 31
                      }
                    ],
                    start: 1,
                    end: 33
                  },
                  right: {
                    type: 'Literal',
                    value: 1,
                    start: 36,
                    end: 37
                  },
                  start: 1,
                  end: 37
                }
              ],
              async: false,
              expression: false,
              start: 0,
              end: 53
            },
            start: 0,
            end: 54
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'a',
                    start: 65,
                    end: 66
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  body: [],
                  start: 68,
                  end: 71
                },
                async: false,
                generator: false,
                id: null,
                start: 56,
                end: 71
              },
              arguments: [],
              start: 55,
              end: 74
            },
            start: 55,
            end: 74
          }
        ],
        start: 0,
        end: 74
      }
    ],
    [
      '[...{a:a = 1}] = [{}];',
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
                    type: 'RestElement',
                    argument: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a',
                            start: 5,
                            end: 6
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'a',
                              start: 7,
                              end: 8
                            },
                            right: {
                              type: 'Literal',
                              value: 1,
                              start: 11,
                              end: 12
                            },
                            start: 7,
                            end: 12
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false,
                          start: 5,
                          end: 12
                        }
                      ],
                      start: 4,
                      end: 13
                    },
                    start: 1,
                    end: 13
                  }
                ],
                start: 0,
                end: 14
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ObjectExpression',
                    properties: [],
                    start: 18,
                    end: 20
                  }
                ],
                start: 17,
                end: 21
              },
              start: 0,
              end: 21
            },
            start: 0,
            end: 22
          }
        ],
        start: 0,
        end: 22
      }
    ],
    [
      '[[[...a]]] = [[[]]];',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'a',
                              start: 6,
                              end: 7
                            },
                            start: 3,
                            end: 7
                          }
                        ],
                        start: 2,
                        end: 8
                      }
                    ],
                    start: 1,
                    end: 9
                  }
                ],
                start: 0,
                end: 10
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'ArrayExpression',
                        elements: [],
                        start: 15,
                        end: 17
                      }
                    ],
                    start: 14,
                    end: 18
                  }
                ],
                start: 13,
                end: 19
              },
              start: 0,
              end: 19
            },
            start: 0,
            end: 20
          }
        ],
        start: 0,
        end: 20
      }
    ],
    [
      'bar1 = ( {abcdef  = (((((a1)) = (30))))} = (b1 = 40) ) => { try { throw a1; } catch(a1) { } };',
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
                name: 'bar1',
                start: 0,
                end: 4
              },
              operator: '=',
              right: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'TryStatement',
                      block: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ThrowStatement',
                            argument: {
                              type: 'Identifier',
                              name: 'a1',
                              start: 72,
                              end: 74
                            },
                            start: 66,
                            end: 75
                          }
                        ],
                        start: 64,
                        end: 77
                      },
                      handler: {
                        type: 'CatchClause',
                        param: {
                          type: 'Identifier',
                          name: 'a1',
                          start: 84,
                          end: 86
                        },
                        body: {
                          type: 'BlockStatement',
                          body: [],
                          start: 88,
                          end: 91
                        },
                        start: 78,
                        end: 91
                      },
                      finalizer: null,
                      start: 60,
                      end: 91
                    }
                  ],
                  start: 58,
                  end: 93
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
                            name: 'abcdef',
                            start: 10,
                            end: 16
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'abcdef',
                              start: 10,
                              end: 16
                            },
                            right: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'a1',
                                start: 25,
                                end: 27
                              },
                              operator: '=',
                              right: {
                                type: 'Literal',
                                value: 30,
                                start: 33,
                                end: 35
                              },
                              start: 23,
                              end: 36
                            },
                            start: 10,
                            end: 39
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true,
                          start: 10,
                          end: 39
                        }
                      ],
                      start: 9,
                      end: 40
                    },
                    right: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'b1',
                        start: 44,
                        end: 46
                      },
                      operator: '=',
                      right: {
                        type: 'Literal',
                        value: 40,
                        start: 49,
                        end: 51
                      },
                      start: 44,
                      end: 51
                    },
                    start: 9,
                    end: 52
                  }
                ],
                async: false,
                expression: false,
                start: 7,
                end: 93
              },
              start: 0,
              end: 93
            },
            start: 0,
            end: 94
          }
        ],
        start: 0,
        end: 94
      }
    ],
    [
      'var e = 1; ( {tuvwxy  = (((  {}   =  1 )))} = (e)) => {  try{ } catch(e) {}}',
      Context.OptionsRanges,
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
                init: {
                  type: 'Literal',
                  value: 1,
                  start: 8,
                  end: 9
                },
                id: {
                  type: 'Identifier',
                  name: 'e',
                  start: 4,
                  end: 5
                },
                start: 4,
                end: 9
              }
            ],
            start: 0,
            end: 10
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'TryStatement',
                    block: {
                      type: 'BlockStatement',
                      body: [],
                      start: 60,
                      end: 63
                    },
                    handler: {
                      type: 'CatchClause',
                      param: {
                        type: 'Identifier',
                        name: 'e',
                        start: 70,
                        end: 71
                      },
                      body: {
                        type: 'BlockStatement',
                        body: [],
                        start: 73,
                        end: 75
                      },
                      start: 64,
                      end: 75
                    },
                    finalizer: null,
                    start: 57,
                    end: 75
                  }
                ],
                start: 54,
                end: 76
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
                          name: 'tuvwxy',
                          start: 14,
                          end: 20
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'tuvwxy',
                            start: 14,
                            end: 20
                          },
                          right: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'ObjectPattern',
                              properties: [],
                              start: 29,
                              end: 31
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 1,
                              start: 37,
                              end: 38
                            },
                            start: 29,
                            end: 38
                          },
                          start: 14,
                          end: 42
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true,
                        start: 14,
                        end: 42
                      }
                    ],
                    start: 13,
                    end: 43
                  },
                  right: {
                    type: 'Identifier',
                    name: 'e',
                    start: 47,
                    end: 48
                  },
                  start: 13,
                  end: 49
                }
              ],
              async: false,
              expression: false,
              start: 11,
              end: 76
            },
            start: 11,
            end: 76
          }
        ],
        start: 0,
        end: 76
      }
    ],
    [
      'var a = [1], i = 0; ({x:a[i++]} = {});',
      Context.OptionsRanges,
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
                init: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1,
                      start: 9,
                      end: 10
                    }
                  ],
                  start: 8,
                  end: 11
                },
                id: {
                  type: 'Identifier',
                  name: 'a',
                  start: 4,
                  end: 5
                },
                start: 4,
                end: 11
              },
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Literal',
                  value: 0,
                  start: 17,
                  end: 18
                },
                id: {
                  type: 'Identifier',
                  name: 'i',
                  start: 13,
                  end: 14
                },
                start: 13,
                end: 18
              }
            ],
            start: 0,
            end: 19
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
                      name: 'x',
                      start: 22,
                      end: 23
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'a',
                        start: 24,
                        end: 25
                      },
                      computed: true,
                      property: {
                        type: 'UpdateExpression',
                        argument: {
                          type: 'Identifier',
                          name: 'i',
                          start: 26,
                          end: 27
                        },
                        operator: '++',
                        prefix: false,
                        start: 26,
                        end: 29
                      },
                      start: 24,
                      end: 30
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false,
                    start: 22,
                    end: 30
                  }
                ],
                start: 21,
                end: 31
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [],
                start: 34,
                end: 36
              },
              start: 21,
              end: 36
            },
            start: 20,
            end: 38
          }
        ],
        start: 0,
        end: 38
      }
    ],
    [
      'function foo() { return {x:1}; }; [...foo()["x"]] = [10];',
      Context.OptionsRanges,
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
                  type: 'ReturnStatement',
                  argument: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x',
                          start: 25,
                          end: 26
                        },
                        value: {
                          type: 'Literal',
                          value: 1,
                          start: 27,
                          end: 28
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false,
                        start: 25,
                        end: 28
                      }
                    ],
                    start: 24,
                    end: 29
                  },
                  start: 17,
                  end: 30
                }
              ],
              start: 15,
              end: 32
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'foo',
              start: 9,
              end: 12
            },
            start: 0,
            end: 32
          },
          {
            type: 'EmptyStatement',
            start: 32,
            end: 33
          },
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
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo',
                          start: 38,
                          end: 41
                        },
                        arguments: [],
                        start: 38,
                        end: 43
                      },
                      computed: true,
                      property: {
                        type: 'Literal',
                        value: 'x',
                        start: 44,
                        end: 47
                      },
                      start: 38,
                      end: 48
                    },
                    start: 35,
                    end: 48
                  }
                ],
                start: 34,
                end: 49
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 10,
                    start: 53,
                    end: 55
                  }
                ],
                start: 52,
                end: 56
              },
              start: 34,
              end: 56
            },
            start: 34,
            end: 57
          }
        ],
        start: 0,
        end: 57
      }
    ],
    [
      'var [{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      Context.OptionsRanges,
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
                init: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x',
                            start: 74,
                            end: 75
                          },
                          value: {
                            type: 'ArrayExpression',
                            elements: [
                              {
                                type: 'ObjectExpression',
                                properties: [
                                  {
                                    type: 'Property',
                                    key: {
                                      type: 'Identifier',
                                      name: 'y',
                                      start: 78,
                                      end: 79
                                    },
                                    value: {
                                      type: 'ObjectExpression',
                                      properties: [],
                                      start: 80,
                                      end: 82
                                    },
                                    kind: 'init',
                                    computed: false,
                                    method: false,
                                    shorthand: false,
                                    start: 78,
                                    end: 82
                                  }
                                ],
                                start: 77,
                                end: 83
                              }
                            ],
                            start: 76,
                            end: 84
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false,
                          start: 74,
                          end: 84
                        }
                      ],
                      start: 73,
                      end: 85
                    },
                    {
                      type: 'ObjectExpression',
                      properties: [],
                      start: 87,
                      end: 89
                    },
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x3',
                            start: 92,
                            end: 94
                          },
                          value: {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'Identifier',
                                  name: 'y3',
                                  start: 96,
                                  end: 98
                                },
                                value: {
                                  type: 'ArrayExpression',
                                  elements: [
                                    {
                                      type: 'ObjectExpression',
                                      properties: [],
                                      start: 100,
                                      end: 102
                                    }
                                  ],
                                  start: 99,
                                  end: 103
                                },
                                kind: 'init',
                                computed: false,
                                method: false,
                                shorthand: false,
                                start: 96,
                                end: 103
                              }
                            ],
                            start: 95,
                            end: 104
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false,
                          start: 92,
                          end: 104
                        }
                      ],
                      start: 91,
                      end: 105
                    }
                  ],
                  start: 72,
                  end: 106
                },
                id: {
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
                            name: 'x',
                            start: 6,
                            end: 7
                          },
                          computed: false,
                          value: {
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
                                      name: 'y',
                                      start: 12,
                                      end: 13
                                    },
                                    computed: false,
                                    value: {
                                      type: 'ObjectPattern',
                                      properties: [
                                        {
                                          type: 'Property',
                                          kind: 'init',
                                          key: {
                                            type: 'Identifier',
                                            name: 'z',
                                            start: 15,
                                            end: 16
                                          },
                                          computed: false,
                                          value: {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'z',
                                              start: 15,
                                              end: 16
                                            },
                                            right: {
                                              type: 'Literal',
                                              value: 1,
                                              start: 19,
                                              end: 20
                                            },
                                            start: 15,
                                            end: 20
                                          },
                                          method: false,
                                          shorthand: true,
                                          start: 15,
                                          end: 20
                                        }
                                      ],
                                      start: 14,
                                      end: 21
                                    },
                                    method: false,
                                    shorthand: false,
                                    start: 12,
                                    end: 21
                                  },
                                  {
                                    type: 'Property',
                                    kind: 'init',
                                    key: {
                                      type: 'Identifier',
                                      name: 'z1',
                                      start: 23,
                                      end: 25
                                    },
                                    computed: false,
                                    value: {
                                      type: 'AssignmentPattern',
                                      left: {
                                        type: 'Identifier',
                                        name: 'z1',
                                        start: 23,
                                        end: 25
                                      },
                                      right: {
                                        type: 'Literal',
                                        value: 2,
                                        start: 28,
                                        end: 29
                                      },
                                      start: 23,
                                      end: 29
                                    },
                                    method: false,
                                    shorthand: true,
                                    start: 23,
                                    end: 29
                                  }
                                ],
                                start: 11,
                                end: 30
                              }
                            ],
                            start: 10,
                            end: 31
                          },
                          method: false,
                          shorthand: false,
                          start: 6,
                          end: 31
                        }
                      ],
                      start: 5,
                      end: 33
                    },
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          kind: 'init',
                          key: {
                            type: 'Identifier',
                            name: 'x2',
                            start: 36,
                            end: 38
                          },
                          computed: false,
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'x2',
                              start: 36,
                              end: 38
                            },
                            right: {
                              type: 'Literal',
                              value: 3,
                              start: 41,
                              end: 42
                            },
                            start: 36,
                            end: 42
                          },
                          method: false,
                          shorthand: true,
                          start: 36,
                          end: 42
                        }
                      ],
                      start: 35,
                      end: 43
                    },
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          kind: 'init',
                          key: {
                            type: 'Identifier',
                            name: 'x3',
                            start: 46,
                            end: 48
                          },
                          computed: false,
                          value: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                kind: 'init',
                                key: {
                                  type: 'Identifier',
                                  name: 'y3',
                                  start: 52,
                                  end: 54
                                },
                                computed: false,
                                value: {
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
                                            name: 'z3',
                                            start: 57,
                                            end: 59
                                          },
                                          computed: false,
                                          value: {
                                            type: 'AssignmentPattern',
                                            left: {
                                              type: 'Identifier',
                                              name: 'z3',
                                              start: 57,
                                              end: 59
                                            },
                                            right: {
                                              type: 'Literal',
                                              value: 4,
                                              start: 62,
                                              end: 63
                                            },
                                            start: 57,
                                            end: 63
                                          },
                                          method: false,
                                          shorthand: true,
                                          start: 57,
                                          end: 63
                                        }
                                      ],
                                      start: 56,
                                      end: 64
                                    }
                                  ],
                                  start: 55,
                                  end: 65
                                },
                                method: false,
                                shorthand: false,
                                start: 52,
                                end: 65
                              }
                            ],
                            start: 51,
                            end: 66
                          },
                          method: false,
                          shorthand: false,
                          start: 46,
                          end: 66
                        }
                      ],
                      start: 45,
                      end: 67
                    }
                  ],
                  start: 4,
                  end: 69
                },
                start: 4,
                end: 106
              }
            ],
            start: 0,
            end: 107
          }
        ],
        start: 0,
        end: 107
      }
    ],
    [
      `let {
      x:{
          y:{
              z:{
                  k:k2 = 31
                } = { k:21 }
            } = { z:{ k:20 } }
        } = { y: { z:{} } }
    } = { x:{ y:{ z:{} } } };`,
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x',
                        start: 174,
                        end: 175
                      },
                      value: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'y',
                              start: 178,
                              end: 179
                            },
                            value: {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'z',
                                    start: 182,
                                    end: 183
                                  },
                                  value: {
                                    type: 'ObjectExpression',
                                    properties: [],
                                    start: 184,
                                    end: 186
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false,
                                  start: 182,
                                  end: 186
                                }
                              ],
                              start: 180,
                              end: 188
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false,
                            start: 178,
                            end: 188
                          }
                        ],
                        start: 176,
                        end: 190
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false,
                      start: 174,
                      end: 190
                    }
                  ],
                  start: 172,
                  end: 192
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x',
                        start: 12,
                        end: 13
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
                                name: 'y',
                                start: 26,
                                end: 27
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
                                        name: 'z',
                                        start: 44,
                                        end: 45
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
                                                name: 'k',
                                                start: 66,
                                                end: 67
                                              },
                                              computed: false,
                                              value: {
                                                type: 'AssignmentPattern',
                                                left: {
                                                  type: 'Identifier',
                                                  name: 'k2',
                                                  start: 68,
                                                  end: 70
                                                },
                                                right: {
                                                  type: 'Literal',
                                                  value: 31,
                                                  start: 73,
                                                  end: 75
                                                },
                                                start: 68,
                                                end: 75
                                              },
                                              method: false,
                                              shorthand: false,
                                              start: 66,
                                              end: 75
                                            }
                                          ],
                                          start: 46,
                                          end: 93
                                        },
                                        right: {
                                          type: 'ObjectExpression',
                                          properties: [
                                            {
                                              type: 'Property',
                                              key: {
                                                type: 'Identifier',
                                                name: 'k',
                                                start: 98,
                                                end: 99
                                              },
                                              value: {
                                                type: 'Literal',
                                                value: 21,
                                                start: 100,
                                                end: 102
                                              },
                                              kind: 'init',
                                              computed: false,
                                              method: false,
                                              shorthand: false,
                                              start: 98,
                                              end: 102
                                            }
                                          ],
                                          start: 96,
                                          end: 104
                                        },
                                        start: 46,
                                        end: 104
                                      },
                                      method: false,
                                      shorthand: false,
                                      start: 44,
                                      end: 104
                                    }
                                  ],
                                  start: 28,
                                  end: 118
                                },
                                right: {
                                  type: 'ObjectExpression',
                                  properties: [
                                    {
                                      type: 'Property',
                                      key: {
                                        type: 'Identifier',
                                        name: 'z',
                                        start: 123,
                                        end: 124
                                      },
                                      value: {
                                        type: 'ObjectExpression',
                                        properties: [
                                          {
                                            type: 'Property',
                                            key: {
                                              type: 'Identifier',
                                              name: 'k',
                                              start: 127,
                                              end: 128
                                            },
                                            value: {
                                              type: 'Literal',
                                              value: 20,
                                              start: 129,
                                              end: 131
                                            },
                                            kind: 'init',
                                            computed: false,
                                            method: false,
                                            shorthand: false,
                                            start: 127,
                                            end: 131
                                          }
                                        ],
                                        start: 125,
                                        end: 133
                                      },
                                      kind: 'init',
                                      computed: false,
                                      method: false,
                                      shorthand: false,
                                      start: 123,
                                      end: 133
                                    }
                                  ],
                                  start: 121,
                                  end: 135
                                },
                                start: 28,
                                end: 135
                              },
                              method: false,
                              shorthand: false,
                              start: 26,
                              end: 135
                            }
                          ],
                          start: 14,
                          end: 145
                        },
                        right: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'y',
                                start: 150,
                                end: 151
                              },
                              value: {
                                type: 'ObjectExpression',
                                properties: [
                                  {
                                    type: 'Property',
                                    key: {
                                      type: 'Identifier',
                                      name: 'z',
                                      start: 155,
                                      end: 156
                                    },
                                    value: {
                                      type: 'ObjectExpression',
                                      properties: [],
                                      start: 157,
                                      end: 159
                                    },
                                    kind: 'init',
                                    computed: false,
                                    method: false,
                                    shorthand: false,
                                    start: 155,
                                    end: 159
                                  }
                                ],
                                start: 153,
                                end: 161
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false,
                              start: 150,
                              end: 161
                            }
                          ],
                          start: 148,
                          end: 163
                        },
                        start: 14,
                        end: 163
                      },
                      method: false,
                      shorthand: false,
                      start: 12,
                      end: 163
                    }
                  ],
                  start: 4,
                  end: 169
                },
                start: 4,
                end: 192
              }
            ],
            start: 0,
            end: 193
          }
        ],
        start: 0,
        end: 193
      }
    ],
    [
      'var x = (new Foo).x;',
      Context.OptionsRanges,
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
                init: {
                  type: 'MemberExpression',
                  object: {
                    type: 'NewExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'Foo',
                      start: 13,
                      end: 16
                    },
                    arguments: [],
                    start: 9,
                    end: 16
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'x',
                    start: 18,
                    end: 19
                  },
                  start: 8,
                  end: 19
                },
                id: {
                  type: 'Identifier',
                  name: 'x',
                  start: 4,
                  end: 5
                },
                start: 4,
                end: 19
              }
            ],
            start: 0,
            end: 20
          }
        ],
        start: 0,
        end: 20
      }
    ],
    [
      'var private = [["hello"]][0][0];',
      Context.OptionsRanges,
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
                init: {
                  type: 'MemberExpression',
                  object: {
                    type: 'MemberExpression',
                    object: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'Literal',
                              value: 'hello',
                              start: 16,
                              end: 23
                            }
                          ],
                          start: 15,
                          end: 24
                        }
                      ],
                      start: 14,
                      end: 25
                    },
                    computed: true,
                    property: {
                      type: 'Literal',
                      value: 0,
                      start: 26,
                      end: 27
                    },
                    start: 14,
                    end: 28
                  },
                  computed: true,
                  property: {
                    type: 'Literal',
                    value: 0,
                    start: 29,
                    end: 30
                  },
                  start: 14,
                  end: 31
                },
                id: {
                  type: 'Identifier',
                  name: 'private',
                  start: 4,
                  end: 11
                },
                start: 4,
                end: 31
              }
            ],
            start: 0,
            end: 32
          }
        ],
        start: 0,
        end: 32
      }
    ],
    [
      'if ((b === undefined && c === undefined) || (this.b === undefined && this.c === undefined)) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'LogicalExpression',
              left: {
                type: 'LogicalExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b',
                    start: 5,
                    end: 6
                  },
                  right: {
                    type: 'Identifier',
                    name: 'undefined',
                    start: 11,
                    end: 20
                  },
                  operator: '===',
                  start: 5,
                  end: 20
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c',
                    start: 24,
                    end: 25
                  },
                  right: {
                    type: 'Identifier',
                    name: 'undefined',
                    start: 30,
                    end: 39
                  },
                  operator: '===',
                  start: 24,
                  end: 39
                },
                operator: '&&',
                start: 5,
                end: 39
              },
              right: {
                type: 'LogicalExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'MemberExpression',
                    object: {
                      type: 'ThisExpression',
                      start: 45,
                      end: 49
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'b',
                      start: 50,
                      end: 51
                    },
                    start: 45,
                    end: 51
                  },
                  right: {
                    type: 'Identifier',
                    name: 'undefined',
                    start: 56,
                    end: 65
                  },
                  operator: '===',
                  start: 45,
                  end: 65
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'MemberExpression',
                    object: {
                      type: 'ThisExpression',
                      start: 69,
                      end: 73
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'c',
                      start: 74,
                      end: 75
                    },
                    start: 69,
                    end: 75
                  },
                  right: {
                    type: 'Identifier',
                    name: 'undefined',
                    start: 80,
                    end: 89
                  },
                  operator: '===',
                  start: 69,
                  end: 89
                },
                operator: '&&',
                start: 45,
                end: 89
              },
              operator: '||',
              start: 4,
              end: 90
            },
            consequent: {
              type: 'BlockStatement',
              body: [],
              start: 92,
              end: 94
            },
            alternate: null,
            start: 0,
            end: 94
          }
        ],
        start: 0,
        end: 94
      }
    ],
    [
      '[((((((x.y))))))] = obj',
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
                      name: 'x',
                      start: 7,
                      end: 8
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'y',
                      start: 9,
                      end: 10
                    },
                    start: 7,
                    end: 10
                  }
                ],
                start: 0,
                end: 17
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'obj',
                start: 20,
                end: 23
              },
              start: 0,
              end: 23
            },
            start: 0,
            end: 23
          }
        ],
        start: 0,
        end: 23
      }
    ],
    [
      '({[(a)()]: {}})',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 15,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 15
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 15
              }
            },
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 14,
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 14
                }
              },
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 13,
                  loc: {
                    start: {
                      line: 1,
                      column: 2
                    },
                    end: {
                      line: 1,
                      column: 13
                    }
                  },
                  method: false,
                  shorthand: false,
                  computed: true,
                  key: {
                    type: 'CallExpression',
                    start: 3,
                    end: 8,
                    loc: {
                      start: {
                        line: 1,
                        column: 3
                      },
                      end: {
                        line: 1,
                        column: 8
                      }
                    },
                    callee: {
                      type: 'Identifier',
                      start: 4,
                      end: 5,
                      loc: {
                        start: {
                          line: 1,
                          column: 4
                        },
                        end: {
                          line: 1,
                          column: 5
                        }
                      },
                      name: 'a'
                    },
                    arguments: []
                  },
                  value: {
                    type: 'ObjectExpression',
                    start: 11,
                    end: 13,
                    loc: {
                      start: {
                        line: 1,
                        column: 11
                      },
                      end: {
                        line: 1,
                        column: 13
                      }
                    },
                    properties: []
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
      '({a = [b]} = 1)',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 15,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 15
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 15
              }
            },
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 14,
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 14
                }
              },
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 10,
                loc: {
                  start: {
                    line: 1,
                    column: 1
                  },
                  end: {
                    line: 1,
                    column: 10
                  }
                },
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 9,
                    loc: {
                      start: {
                        line: 1,
                        column: 2
                      },
                      end: {
                        line: 1,
                        column: 9
                      }
                    },
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      loc: {
                        start: {
                          line: 1,
                          column: 2
                        },
                        end: {
                          line: 1,
                          column: 3
                        }
                      },
                      name: 'a'
                    },
                    kind: 'init',
                    value: {
                      type: 'AssignmentPattern',
                      start: 2,
                      end: 9,
                      loc: {
                        start: {
                          line: 1,
                          column: 2
                        },
                        end: {
                          line: 1,
                          column: 9
                        }
                      },
                      left: {
                        type: 'Identifier',
                        start: 2,
                        end: 3,
                        loc: {
                          start: {
                            line: 1,
                            column: 2
                          },
                          end: {
                            line: 1,
                            column: 3
                          }
                        },
                        name: 'a'
                      },
                      right: {
                        type: 'ArrayExpression',
                        start: 6,
                        end: 9,
                        loc: {
                          start: {
                            line: 1,
                            column: 6
                          },
                          end: {
                            line: 1,
                            column: 9
                          }
                        },
                        elements: [
                          {
                            type: 'Identifier',
                            start: 7,
                            end: 8,
                            loc: {
                              start: {
                                line: 1,
                                column: 7
                              },
                              end: {
                                line: 1,
                                column: 8
                              }
                            },
                            name: 'b'
                          }
                        ]
                      }
                    }
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 13,
                end: 14,
                loc: {
                  start: {
                    line: 1,
                    column: 13
                  },
                  end: {
                    line: 1,
                    column: 14
                  }
                },
                value: 1
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({["a"]: [b]} = 1 / (d = (e)))',
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
                      type: 'Literal',
                      value: 'a',
                      start: 3,
                      end: 6
                    },
                    value: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'b',
                          start: 10,
                          end: 11
                        }
                      ],
                      start: 9,
                      end: 12
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false,
                    start: 2,
                    end: 12
                  }
                ],
                start: 1,
                end: 13
              },
              operator: '=',
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Literal',
                  value: 1,
                  start: 16,
                  end: 17
                },
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'd',
                    start: 21,
                    end: 22
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'e',
                    start: 26,
                    end: 27
                  },
                  start: 21,
                  end: 28
                },
                operator: '/',
                start: 16,
                end: 29
              },
              start: 1,
              end: 29
            },
            start: 0,
            end: 30
          }
        ],
        start: 0,
        end: 30
      }
    ],
    [
      '({["a"]: [b]} = 1 / (d = ((a)) = a))',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 36,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 36
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 36,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 36
              }
            },
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 35,
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 35
                }
              },
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 13,
                loc: {
                  start: {
                    line: 1,
                    column: 1
                  },
                  end: {
                    line: 1,
                    column: 13
                  }
                },
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 12,
                    loc: {
                      start: {
                        line: 1,
                        column: 2
                      },
                      end: {
                        line: 1,
                        column: 12
                      }
                    },
                    method: false,
                    shorthand: false,
                    computed: true,
                    key: {
                      type: 'Literal',
                      start: 3,
                      end: 6,
                      loc: {
                        start: {
                          line: 1,
                          column: 3
                        },
                        end: {
                          line: 1,
                          column: 6
                        }
                      },
                      value: 'a'
                    },
                    value: {
                      type: 'ArrayPattern',
                      start: 9,
                      end: 12,
                      loc: {
                        start: {
                          line: 1,
                          column: 9
                        },
                        end: {
                          line: 1,
                          column: 12
                        }
                      },
                      elements: [
                        {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          loc: {
                            start: {
                              line: 1,
                              column: 10
                            },
                            end: {
                              line: 1,
                              column: 11
                            }
                          },
                          name: 'b'
                        }
                      ]
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'BinaryExpression',
                start: 16,
                end: 35,
                loc: {
                  start: {
                    line: 1,
                    column: 16
                  },
                  end: {
                    line: 1,
                    column: 35
                  }
                },
                left: {
                  type: 'Literal',
                  start: 16,
                  end: 17,
                  loc: {
                    start: {
                      line: 1,
                      column: 16
                    },
                    end: {
                      line: 1,
                      column: 17
                    }
                  },
                  value: 1
                },
                operator: '/',
                right: {
                  type: 'AssignmentExpression',
                  start: 21,
                  end: 34,
                  loc: {
                    start: {
                      line: 1,
                      column: 21
                    },
                    end: {
                      line: 1,
                      column: 34
                    }
                  },
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 21,
                    end: 22,
                    loc: {
                      start: {
                        line: 1,
                        column: 21
                      },
                      end: {
                        line: 1,
                        column: 22
                      }
                    },
                    name: 'd'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 25,
                    end: 34,
                    loc: {
                      start: {
                        line: 1,
                        column: 25
                      },
                      end: {
                        line: 1,
                        column: 34
                      }
                    },
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 27,
                      end: 28,
                      loc: {
                        start: {
                          line: 1,
                          column: 27
                        },
                        end: {
                          line: 1,
                          column: 28
                        }
                      },
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      start: 33,
                      end: 34,
                      loc: {
                        start: {
                          line: 1,
                          column: 33
                        },
                        end: {
                          line: 1,
                          column: 34
                        }
                      },
                      name: 'a'
                    }
                  }
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({a: ("string") / a[3](a = b.c) })',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 34,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 34
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 34,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 34
              }
            },
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 33,
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 33
                }
              },
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 31,
                  loc: {
                    start: {
                      line: 1,
                      column: 2
                    },
                    end: {
                      line: 1,
                      column: 31
                    }
                  },
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    loc: {
                      start: {
                        line: 1,
                        column: 2
                      },
                      end: {
                        line: 1,
                        column: 3
                      }
                    },
                    name: 'a'
                  },
                  value: {
                    type: 'BinaryExpression',
                    start: 5,
                    end: 31,
                    loc: {
                      start: {
                        line: 1,
                        column: 5
                      },
                      end: {
                        line: 1,
                        column: 31
                      }
                    },
                    left: {
                      type: 'Literal',
                      start: 6,
                      end: 14,
                      loc: {
                        start: {
                          line: 1,
                          column: 6
                        },
                        end: {
                          line: 1,
                          column: 14
                        }
                      },
                      value: 'string'
                    },
                    operator: '/',
                    right: {
                      type: 'CallExpression',
                      start: 18,
                      end: 31,
                      loc: {
                        start: {
                          line: 1,
                          column: 18
                        },
                        end: {
                          line: 1,
                          column: 31
                        }
                      },
                      callee: {
                        type: 'MemberExpression',
                        start: 18,
                        end: 22,
                        loc: {
                          start: {
                            line: 1,
                            column: 18
                          },
                          end: {
                            line: 1,
                            column: 22
                          }
                        },
                        object: {
                          type: 'Identifier',
                          start: 18,
                          end: 19,
                          loc: {
                            start: {
                              line: 1,
                              column: 18
                            },
                            end: {
                              line: 1,
                              column: 19
                            }
                          },
                          name: 'a'
                        },
                        property: {
                          type: 'Literal',
                          start: 20,
                          end: 21,
                          loc: {
                            start: {
                              line: 1,
                              column: 20
                            },
                            end: {
                              line: 1,
                              column: 21
                            }
                          },
                          value: 3
                        },
                        computed: true
                      },
                      arguments: [
                        {
                          type: 'AssignmentExpression',
                          start: 23,
                          end: 30,
                          loc: {
                            start: {
                              line: 1,
                              column: 23
                            },
                            end: {
                              line: 1,
                              column: 30
                            }
                          },
                          operator: '=',
                          left: {
                            type: 'Identifier',
                            start: 23,
                            end: 24,
                            loc: {
                              start: {
                                line: 1,
                                column: 23
                              },
                              end: {
                                line: 1,
                                column: 24
                              }
                            },
                            name: 'a'
                          },
                          right: {
                            type: 'MemberExpression',
                            start: 27,
                            end: 30,
                            loc: {
                              start: {
                                line: 1,
                                column: 27
                              },
                              end: {
                                line: 1,
                                column: 30
                              }
                            },
                            object: {
                              type: 'Identifier',
                              start: 27,
                              end: 28,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 27
                                },
                                end: {
                                  line: 1,
                                  column: 28
                                }
                              },
                              name: 'b'
                            },
                            property: {
                              type: 'Identifier',
                              start: 29,
                              end: 30,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 29
                                },
                                end: {
                                  line: 1,
                                  column: 30
                                }
                              },
                              name: 'c'
                            },
                            computed: false
                          }
                        }
                      ]
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
      '({a: ("string") / a[3](((((a = b.c))))) })',
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
                    name: 'a',
                    start: 2,
                    end: 3
                  },
                  value: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: 'string',
                      start: 6,
                      end: 14
                    },
                    right: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'a',
                          start: 18,
                          end: 19
                        },
                        computed: true,
                        property: {
                          type: 'Literal',
                          value: 3,
                          start: 20,
                          end: 21
                        },
                        start: 18,
                        end: 22
                      },
                      arguments: [
                        {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'a',
                            start: 27,
                            end: 28
                          },
                          operator: '=',
                          right: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Identifier',
                              name: 'b',
                              start: 31,
                              end: 32
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'c',
                              start: 33,
                              end: 34
                            },
                            start: 31,
                            end: 34
                          },
                          start: 27,
                          end: 34
                        }
                      ],
                      start: 18,
                      end: 39
                    },
                    operator: '/',
                    start: 5,
                    end: 39
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false,
                  start: 2,
                  end: 39
                }
              ],
              start: 1,
              end: 41
            },
            start: 0,
            end: 42
          }
        ],
        start: 0,
        end: 42
      }
    ],
    [
      '({a: ("string") / a[3](((((a /= [b.c] = (x)))))) })',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 51,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 51
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 51,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 51
              }
            },
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 50,
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 50
                }
              },
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 48,
                  loc: {
                    start: {
                      line: 1,
                      column: 2
                    },
                    end: {
                      line: 1,
                      column: 48
                    }
                  },
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    loc: {
                      start: {
                        line: 1,
                        column: 2
                      },
                      end: {
                        line: 1,
                        column: 3
                      }
                    },
                    name: 'a'
                  },
                  value: {
                    type: 'BinaryExpression',
                    start: 5,
                    end: 48,
                    loc: {
                      start: {
                        line: 1,
                        column: 5
                      },
                      end: {
                        line: 1,
                        column: 48
                      }
                    },
                    left: {
                      type: 'Literal',
                      start: 6,
                      end: 14,
                      loc: {
                        start: {
                          line: 1,
                          column: 6
                        },
                        end: {
                          line: 1,
                          column: 14
                        }
                      },
                      value: 'string'
                    },
                    operator: '/',
                    right: {
                      type: 'CallExpression',
                      start: 18,
                      end: 48,
                      loc: {
                        start: {
                          line: 1,
                          column: 18
                        },
                        end: {
                          line: 1,
                          column: 48
                        }
                      },
                      callee: {
                        type: 'MemberExpression',
                        start: 18,
                        end: 22,
                        loc: {
                          start: {
                            line: 1,
                            column: 18
                          },
                          end: {
                            line: 1,
                            column: 22
                          }
                        },
                        object: {
                          type: 'Identifier',
                          start: 18,
                          end: 19,
                          loc: {
                            start: {
                              line: 1,
                              column: 18
                            },
                            end: {
                              line: 1,
                              column: 19
                            }
                          },
                          name: 'a'
                        },
                        property: {
                          type: 'Literal',
                          start: 20,
                          end: 21,
                          loc: {
                            start: {
                              line: 1,
                              column: 20
                            },
                            end: {
                              line: 1,
                              column: 21
                            }
                          },
                          value: 3
                        },
                        computed: true
                      },
                      arguments: [
                        {
                          type: 'AssignmentExpression',
                          start: 27,
                          end: 43,
                          loc: {
                            start: {
                              line: 1,
                              column: 27
                            },
                            end: {
                              line: 1,
                              column: 43
                            }
                          },
                          operator: '/=',
                          left: {
                            type: 'Identifier',
                            start: 27,
                            end: 28,
                            loc: {
                              start: {
                                line: 1,
                                column: 27
                              },
                              end: {
                                line: 1,
                                column: 28
                              }
                            },
                            name: 'a'
                          },
                          right: {
                            type: 'AssignmentExpression',
                            start: 32,
                            end: 43,
                            loc: {
                              start: {
                                line: 1,
                                column: 32
                              },
                              end: {
                                line: 1,
                                column: 43
                              }
                            },
                            operator: '=',
                            left: {
                              type: 'ArrayPattern',
                              start: 32,
                              end: 37,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 32
                                },
                                end: {
                                  line: 1,
                                  column: 37
                                }
                              },
                              elements: [
                                {
                                  type: 'MemberExpression',
                                  start: 33,
                                  end: 36,
                                  loc: {
                                    start: {
                                      line: 1,
                                      column: 33
                                    },
                                    end: {
                                      line: 1,
                                      column: 36
                                    }
                                  },
                                  object: {
                                    type: 'Identifier',
                                    start: 33,
                                    end: 34,
                                    loc: {
                                      start: {
                                        line: 1,
                                        column: 33
                                      },
                                      end: {
                                        line: 1,
                                        column: 34
                                      }
                                    },
                                    name: 'b'
                                  },
                                  property: {
                                    type: 'Identifier',
                                    start: 35,
                                    end: 36,
                                    loc: {
                                      start: {
                                        line: 1,
                                        column: 35
                                      },
                                      end: {
                                        line: 1,
                                        column: 36
                                      }
                                    },
                                    name: 'c'
                                  },
                                  computed: false
                                }
                              ]
                            },
                            right: {
                              type: 'Identifier',
                              start: 41,
                              end: 42,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 41
                                },
                                end: {
                                  line: 1,
                                  column: 42
                                }
                              },
                              name: 'x'
                            }
                          }
                        }
                      ]
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
      'try { throw {x:10, z:["this is z"]}; }  catch({x, y, z:[z]}) {x;}',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ThrowStatement',
                  argument: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x',
                          start: 13,
                          end: 14
                        },
                        value: {
                          type: 'Literal',
                          value: 10,
                          start: 15,
                          end: 17
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false,
                        start: 13,
                        end: 17
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'z',
                          start: 19,
                          end: 20
                        },
                        value: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'Literal',
                              value: 'this is z',
                              start: 22,
                              end: 33
                            }
                          ],
                          start: 21,
                          end: 34
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false,
                        start: 19,
                        end: 34
                      }
                    ],
                    start: 12,
                    end: 35
                  },
                  start: 6,
                  end: 36
                }
              ],
              start: 4,
              end: 38
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'x',
                      start: 47,
                      end: 48
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'x',
                      start: 47,
                      end: 48
                    },
                    method: false,
                    shorthand: true,
                    start: 47,
                    end: 48
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'y',
                      start: 50,
                      end: 51
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'y',
                      start: 50,
                      end: 51
                    },
                    method: false,
                    shorthand: true,
                    start: 50,
                    end: 51
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'z',
                      start: 53,
                      end: 54
                    },
                    computed: false,
                    value: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'z',
                          start: 56,
                          end: 57
                        }
                      ],
                      start: 55,
                      end: 58
                    },
                    method: false,
                    shorthand: false,
                    start: 53,
                    end: 58
                  }
                ],
                start: 46,
                end: 59
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'x',
                      start: 62,
                      end: 63
                    },
                    start: 62,
                    end: 64
                  }
                ],
                start: 61,
                end: 65
              },
              start: 40,
              end: 65
            },
            finalizer: null,
            start: 0,
            end: 65
          }
        ],
        start: 0,
        end: 65
      }
    ],
    [
      'for (let x in { a: a[i++] = () => eval("x") }) { b[j++] = () => eval("x"); }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
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
                        name: 'b',
                        start: 49,
                        end: 50
                      },
                      computed: true,
                      property: {
                        type: 'UpdateExpression',
                        argument: {
                          type: 'Identifier',
                          name: 'j',
                          start: 51,
                          end: 52
                        },
                        operator: '++',
                        prefix: false,
                        start: 51,
                        end: 54
                      },
                      start: 49,
                      end: 55
                    },
                    operator: '=',
                    right: {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'eval',
                          start: 64,
                          end: 68
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: 'x',
                            start: 69,
                            end: 72
                          }
                        ],
                        start: 64,
                        end: 73
                      },
                      params: [],
                      async: false,
                      expression: true,
                      start: 58,
                      end: 73
                    },
                    start: 49,
                    end: 73
                  },
                  start: 49,
                  end: 74
                }
              ],
              start: 47,
              end: 76
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
                    name: 'x',
                    start: 9,
                    end: 10
                  },
                  start: 9,
                  end: 10
                }
              ],
              start: 5,
              end: 10
            },
            right: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a',
                    start: 16,
                    end: 17
                  },
                  value: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'a',
                        start: 19,
                        end: 20
                      },
                      computed: true,
                      property: {
                        type: 'UpdateExpression',
                        argument: {
                          type: 'Identifier',
                          name: 'i',
                          start: 21,
                          end: 22
                        },
                        operator: '++',
                        prefix: false,
                        start: 21,
                        end: 24
                      },
                      start: 19,
                      end: 25
                    },
                    operator: '=',
                    right: {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'eval',
                          start: 34,
                          end: 38
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: 'x',
                            start: 39,
                            end: 42
                          }
                        ],
                        start: 34,
                        end: 43
                      },
                      params: [],
                      async: false,
                      expression: true,
                      start: 28,
                      end: 43
                    },
                    start: 19,
                    end: 43
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false,
                  start: 16,
                  end: 43
                }
              ],
              start: 14,
              end: 45
            },
            start: 0,
            end: 76
          }
        ],
        start: 0,
        end: 76
      }
    ],
    [
      'bar2 = ( {abcdef  = (((((a2)) = (30))))} = (b2 = 40) ) => { try { throw a2; } catch(a2) { } };',
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
                name: 'bar2',
                start: 0,
                end: 4
              },
              operator: '=',
              right: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'TryStatement',
                      block: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ThrowStatement',
                            argument: {
                              type: 'Identifier',
                              name: 'a2',
                              start: 72,
                              end: 74
                            },
                            start: 66,
                            end: 75
                          }
                        ],
                        start: 64,
                        end: 77
                      },
                      handler: {
                        type: 'CatchClause',
                        param: {
                          type: 'Identifier',
                          name: 'a2',
                          start: 84,
                          end: 86
                        },
                        body: {
                          type: 'BlockStatement',
                          body: [],
                          start: 88,
                          end: 91
                        },
                        start: 78,
                        end: 91
                      },
                      finalizer: null,
                      start: 60,
                      end: 91
                    }
                  ],
                  start: 58,
                  end: 93
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
                            name: 'abcdef',
                            start: 10,
                            end: 16
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'abcdef',
                              start: 10,
                              end: 16
                            },
                            right: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'a2',
                                start: 25,
                                end: 27
                              },
                              operator: '=',
                              right: {
                                type: 'Literal',
                                value: 30,
                                start: 33,
                                end: 35
                              },
                              start: 23,
                              end: 36
                            },
                            start: 10,
                            end: 39
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true,
                          start: 10,
                          end: 39
                        }
                      ],
                      start: 9,
                      end: 40
                    },
                    right: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'b2',
                        start: 44,
                        end: 46
                      },
                      operator: '=',
                      right: {
                        type: 'Literal',
                        value: 40,
                        start: 49,
                        end: 51
                      },
                      start: 44,
                      end: 51
                    },
                    start: 9,
                    end: 52
                  }
                ],
                async: false,
                expression: false,
                start: 7,
                end: 93
              },
              start: 0,
              end: 93
            },
            start: 0,
            end: 94
          }
        ],
        start: 0,
        end: 94
      }
    ]
  ]);
});
