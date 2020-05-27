import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Miscellaneous - Precedence', () => {
  pass('Miscellaneous - Precedence (pass)', [
    [
      'x = a > b instanceof c',
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
                name: 'x',
                start: 0,
                end: 1,
                range: [0, 1]
              },
              operator: '=',
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                    start: 4,
                    end: 5,
                    range: [4, 5]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b',
                    start: 8,
                    end: 9,
                    range: [8, 9]
                  },
                  operator: '>',
                  start: 4,
                  end: 9,
                  range: [4, 9]
                },
                right: {
                  type: 'Identifier',
                  name: 'c',
                  start: 21,
                  end: 22,
                  range: [21, 22]
                },
                operator: 'instanceof',
                start: 4,
                end: 22,
                range: [4, 22]
              },
              start: 0,
              end: 22,
              range: [0, 22]
            },
            start: 0,
            end: 22,
            range: [0, 22]
          }
        ],
        start: 0,
        end: 22,
        range: [0, 22]
      }
    ],
    [
      'foo( a instanceof b + c )',
      Context.OptionsRanges,
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
                name: 'foo',
                start: 0,
                end: 3,
                range: [0, 3]
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                    start: 5,
                    end: 6,
                    range: [5, 6]
                  },
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'b',
                      start: 18,
                      end: 19,
                      range: [18, 19]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'c',
                      start: 22,
                      end: 23,
                      range: [22, 23]
                    },
                    operator: '+',
                    start: 18,
                    end: 23,
                    range: [18, 23]
                  },
                  operator: 'instanceof',
                  start: 5,
                  end: 23,
                  range: [5, 23]
                }
              ],
              start: 0,
              end: 25,
              range: [0, 25]
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
      'foo( a instanceof b > c )',
      Context.OptionsRanges,
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
                name: 'foo',
                start: 0,
                end: 3,
                range: [0, 3]
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a',
                      start: 5,
                      end: 6,
                      range: [5, 6]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b',
                      start: 18,
                      end: 19,
                      range: [18, 19]
                    },
                    operator: 'instanceof',
                    start: 5,
                    end: 19,
                    range: [5, 19]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 22,
                    end: 23,
                    range: [22, 23]
                  },
                  operator: '>',
                  start: 5,
                  end: 23,
                  range: [5, 23]
                }
              ],
              start: 0,
              end: 25,
              range: [0, 25]
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
      'foo( a + b instanceof c )',
      Context.OptionsRanges,
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
                name: 'foo',
                start: 0,
                end: 3,
                range: [0, 3]
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a',
                      start: 5,
                      end: 6,
                      range: [5, 6]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b',
                      start: 9,
                      end: 10,
                      range: [9, 10]
                    },
                    operator: '+',
                    start: 5,
                    end: 10,
                    range: [5, 10]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 22,
                    end: 23,
                    range: [22, 23]
                  },
                  operator: 'instanceof',
                  start: 5,
                  end: 23,
                  range: [5, 23]
                }
              ],
              start: 0,
              end: 25,
              range: [0, 25]
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
      'foo( a + b ** c )',
      Context.OptionsRanges,
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
                name: 'foo',
                start: 0,
                end: 3,
                range: [0, 3]
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                    start: 5,
                    end: 6,
                    range: [5, 6]
                  },
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'b',
                      start: 9,
                      end: 10,
                      range: [9, 10]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'c',
                      start: 14,
                      end: 15,
                      range: [14, 15]
                    },
                    operator: '**',
                    start: 9,
                    end: 15,
                    range: [9, 15]
                  },
                  operator: '+',
                  start: 5,
                  end: 15,
                  range: [5, 15]
                }
              ],
              start: 0,
              end: 17,
              range: [0, 17]
            },
            start: 0,
            end: 17,
            range: [0, 17]
          }
        ],
        start: 0,
        end: 17,
        range: [0, 17]
      }
    ],
    [
      'foo( a / b + c )',
      Context.OptionsRanges,
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
                name: 'foo',
                start: 0,
                end: 3,
                range: [0, 3]
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a',
                      start: 5,
                      end: 6,
                      range: [5, 6]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b',
                      start: 9,
                      end: 10,
                      range: [9, 10]
                    },
                    operator: '/',
                    start: 5,
                    end: 10,
                    range: [5, 10]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 13,
                    end: 14,
                    range: [13, 14]
                  },
                  operator: '+',
                  start: 5,
                  end: 14,
                  range: [5, 14]
                }
              ],
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
      'foo( a > b instanceof c )',
      Context.OptionsRanges,
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
                name: 'foo',
                start: 0,
                end: 3,
                range: [0, 3]
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a',
                      start: 5,
                      end: 6,
                      range: [5, 6]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b',
                      start: 9,
                      end: 10,
                      range: [9, 10]
                    },
                    operator: '>',
                    start: 5,
                    end: 10,
                    range: [5, 10]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 22,
                    end: 23,
                    range: [22, 23]
                  },
                  operator: 'instanceof',
                  start: 5,
                  end: 23,
                  range: [5, 23]
                }
              ],
              start: 0,
              end: 25,
              range: [0, 25]
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
      'x, a instanceof b + c',
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
                  name: 'x',
                  start: 0,
                  end: 1,
                  range: [0, 1]
                },
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                    start: 3,
                    end: 4,
                    range: [3, 4]
                  },
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'b',
                      start: 16,
                      end: 17,
                      range: [16, 17]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'c',
                      start: 20,
                      end: 21,
                      range: [20, 21]
                    },
                    operator: '+',
                    start: 16,
                    end: 21,
                    range: [16, 21]
                  },
                  operator: 'instanceof',
                  start: 3,
                  end: 21,
                  range: [3, 21]
                }
              ],
              start: 0,
              end: 21,
              range: [0, 21]
            },
            start: 0,
            end: 21,
            range: [0, 21]
          }
        ],
        start: 0,
        end: 21,
        range: [0, 21]
      }
    ],
    [
      'x, a ** b + c',
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
                  name: 'x',
                  start: 0,
                  end: 1,
                  range: [0, 1]
                },
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a',
                      start: 3,
                      end: 4,
                      range: [3, 4]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b',
                      start: 8,
                      end: 9,
                      range: [8, 9]
                    },
                    operator: '**',
                    start: 3,
                    end: 9,
                    range: [3, 9]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 12,
                    end: 13,
                    range: [12, 13]
                  },
                  operator: '+',
                  start: 3,
                  end: 13,
                  range: [3, 13]
                }
              ],
              start: 0,
              end: 13,
              range: [0, 13]
            },
            start: 0,
            end: 13,
            range: [0, 13]
          }
        ],
        start: 0,
        end: 13,
        range: [0, 13]
      }
    ],
    [
      'x, a + b instanceof c',
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
                  name: 'x',
                  start: 0,
                  end: 1,
                  range: [0, 1]
                },
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a',
                      start: 3,
                      end: 4,
                      range: [3, 4]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b',
                      start: 7,
                      end: 8,
                      range: [7, 8]
                    },
                    operator: '+',
                    start: 3,
                    end: 8,
                    range: [3, 8]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 20,
                    end: 21,
                    range: [20, 21]
                  },
                  operator: 'instanceof',
                  start: 3,
                  end: 21,
                  range: [3, 21]
                }
              ],
              start: 0,
              end: 21,
              range: [0, 21]
            },
            start: 0,
            end: 21,
            range: [0, 21]
          }
        ],
        start: 0,
        end: 21,
        range: [0, 21]
      }
    ],
    [
      'x, a + b ** c',
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
                  name: 'x',
                  start: 0,
                  end: 1,
                  range: [0, 1]
                },
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                    start: 3,
                    end: 4,
                    range: [3, 4]
                  },
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'b',
                      start: 7,
                      end: 8,
                      range: [7, 8]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'c',
                      start: 12,
                      end: 13,
                      range: [12, 13]
                    },
                    operator: '**',
                    start: 7,
                    end: 13,
                    range: [7, 13]
                  },
                  operator: '+',
                  start: 3,
                  end: 13,
                  range: [3, 13]
                }
              ],
              start: 0,
              end: 13,
              range: [0, 13]
            },
            start: 0,
            end: 13,
            range: [0, 13]
          }
        ],
        start: 0,
        end: 13,
        range: [0, 13]
      }
    ],
    [
      'x, a / b + c',
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
                  name: 'x',
                  start: 0,
                  end: 1,
                  range: [0, 1]
                },
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a',
                      start: 3,
                      end: 4,
                      range: [3, 4]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b',
                      start: 7,
                      end: 8,
                      range: [7, 8]
                    },
                    operator: '/',
                    start: 3,
                    end: 8,
                    range: [3, 8]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 11,
                    end: 12,
                    range: [11, 12]
                  },
                  operator: '+',
                  start: 3,
                  end: 12,
                  range: [3, 12]
                }
              ],
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
      'foo[ a + b ** c ]',
      Context.OptionsRanges,
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
                name: 'foo',
                start: 0,
                end: 3,
                range: [0, 3]
              },
              computed: true,
              property: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a',
                  start: 5,
                  end: 6,
                  range: [5, 6]
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b',
                    start: 9,
                    end: 10,
                    range: [9, 10]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 14,
                    end: 15,
                    range: [14, 15]
                  },
                  operator: '**',
                  start: 9,
                  end: 15,
                  range: [9, 15]
                },
                operator: '+',
                start: 5,
                end: 15,
                range: [5, 15]
              },
              start: 0,
              end: 17,
              range: [0, 17]
            },
            start: 0,
            end: 17,
            range: [0, 17]
          }
        ],
        start: 0,
        end: 17,
        range: [0, 17]
      }
    ],
    [
      'foo[ a + b / c ]',
      Context.OptionsRanges,
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
                name: 'foo',
                start: 0,
                end: 3,
                range: [0, 3]
              },
              computed: true,
              property: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a',
                  start: 5,
                  end: 6,
                  range: [5, 6]
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b',
                    start: 9,
                    end: 10,
                    range: [9, 10]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                    start: 13,
                    end: 14,
                    range: [13, 14]
                  },
                  operator: '/',
                  start: 9,
                  end: 14,
                  range: [9, 14]
                },
                operator: '+',
                start: 5,
                end: 14,
                range: [5, 14]
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
      '(a * b + c) * d',
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
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                    start: 1,
                    end: 2,
                    range: [1, 2]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b',
                    start: 5,
                    end: 6,
                    range: [5, 6]
                  },
                  operator: '*',
                  start: 1,
                  end: 6,
                  range: [1, 6]
                },
                right: {
                  type: 'Identifier',
                  name: 'c',
                  start: 9,
                  end: 10,
                  range: [9, 10]
                },
                operator: '+',
                start: 1,
                end: 10,
                range: [1, 10]
              },
              right: {
                type: 'Identifier',
                name: 'd',
                start: 14,
                end: 15,
                range: [14, 15]
              },
              operator: '*',
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
      'a|=b^=c&=d>>>=e>>=f<<=g%=h/=i*=j**=k-=l+=m=n',
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
                name: 'a',
                start: 0,
                end: 1,
                range: [0, 1]
              },
              operator: '|=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b',
                  start: 3,
                  end: 4,
                  range: [3, 4]
                },
                operator: '^=',
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c',
                    start: 6,
                    end: 7,
                    range: [6, 7]
                  },
                  operator: '&=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'd',
                      start: 9,
                      end: 10,
                      range: [9, 10]
                    },
                    operator: '>>>=',
                    right: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'e',
                        start: 14,
                        end: 15,
                        range: [14, 15]
                      },
                      operator: '>>=',
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'f',
                          start: 18,
                          end: 19,
                          range: [18, 19]
                        },
                        operator: '<<=',
                        right: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'g',
                            start: 22,
                            end: 23,
                            range: [22, 23]
                          },
                          operator: '%=',
                          right: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'h',
                              start: 25,
                              end: 26,
                              range: [25, 26]
                            },
                            operator: '/=',
                            right: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'i',
                                start: 28,
                                end: 29,
                                range: [28, 29]
                              },
                              operator: '*=',
                              right: {
                                type: 'AssignmentExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'j',
                                  start: 31,
                                  end: 32,
                                  range: [31, 32]
                                },
                                operator: '**=',
                                right: {
                                  type: 'AssignmentExpression',
                                  left: {
                                    type: 'Identifier',
                                    name: 'k',
                                    start: 35,
                                    end: 36,
                                    range: [35, 36]
                                  },
                                  operator: '-=',
                                  right: {
                                    type: 'AssignmentExpression',
                                    left: {
                                      type: 'Identifier',
                                      name: 'l',
                                      start: 38,
                                      end: 39,
                                      range: [38, 39]
                                    },
                                    operator: '+=',
                                    right: {
                                      type: 'AssignmentExpression',
                                      left: {
                                        type: 'Identifier',
                                        name: 'm',
                                        start: 41,
                                        end: 42,
                                        range: [41, 42]
                                      },
                                      operator: '=',
                                      right: {
                                        type: 'Identifier',
                                        name: 'n',
                                        start: 43,
                                        end: 44,
                                        range: [43, 44]
                                      },
                                      start: 41,
                                      end: 44,
                                      range: [41, 44]
                                    },
                                    start: 38,
                                    end: 44,
                                    range: [38, 44]
                                  },
                                  start: 35,
                                  end: 44,
                                  range: [35, 44]
                                },
                                start: 31,
                                end: 44,
                                range: [31, 44]
                              },
                              start: 28,
                              end: 44,
                              range: [28, 44]
                            },
                            start: 25,
                            end: 44,
                            range: [25, 44]
                          },
                          start: 22,
                          end: 44,
                          range: [22, 44]
                        },
                        start: 18,
                        end: 44,
                        range: [18, 44]
                      },
                      start: 14,
                      end: 44,
                      range: [14, 44]
                    },
                    start: 9,
                    end: 44,
                    range: [9, 44]
                  },
                  start: 6,
                  end: 44,
                  range: [6, 44]
                },
                start: 3,
                end: 44,
                range: [3, 44]
              },
              start: 0,
              end: 44,
              range: [0, 44]
            },
            start: 0,
            end: 44,
            range: [0, 44]
          }
        ],
        start: 0,
        end: 44,
        range: [0, 44]
      }
    ],
    [
      'a || b || c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              operator: '||',
              left: {
                type: 'LogicalExpression',
                operator: '||',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a && b || c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              operator: '||',
              left: {
                type: 'LogicalExpression',
                operator: '&&',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a | b && c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
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
                operator: '|'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '&&'
            }
          }
        ]
      }
    ],
    [
      'a && b | c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              operator: '&&',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                operator: '|',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
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
      'a ^ b & c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '^',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                operator: '&',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
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
      'a == b & c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '&',
              left: {
                type: 'BinaryExpression',
                operator: '==',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a !== b === c != d == e',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '==',
              left: {
                type: 'BinaryExpression',
                operator: '!=',
                left: {
                  type: 'BinaryExpression',
                  operator: '===',
                  left: {
                    type: 'BinaryExpression',
                    operator: '!==',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  }
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                }
              },
              right: {
                type: 'Identifier',
                name: 'e'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a & b == c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '&',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                operator: '==',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
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
      'a << b < c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '<',
              left: {
                type: 'BinaryExpression',
                operator: '<<',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo[ a > b instanceof c ]',
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
                  operator: '>'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: 'instanceof'
              }
            }
          }
        ]
      }
    ],
    [
      'for ( a instanceof b + c ;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '+'
              },
              operator: 'instanceof'
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for ( a instanceof b > c ;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                operator: 'instanceof'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '>'
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for ( a ** b + c ;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                operator: '**'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '+'
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for ( a + b ** c ;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '**'
              },
              operator: '+'
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      '( a + b instanceof c )',
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
              operator: 'instanceof'
            }
          }
        ]
      }
    ],
    [
      '( a + b ** c )',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '**'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      '( a + b / c )',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '/'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      '( a / b + c )',
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
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '/'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'if ( a instanceof b + c ) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '+'
              },
              operator: 'instanceof'
            },
            consequent: {
              type: 'EmptyStatement'
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if ( a instanceof b > c ) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
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
                operator: 'instanceof'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '>'
            },
            consequent: {
              type: 'EmptyStatement'
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if ( a ** b + c ) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
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
                operator: '**'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '+'
            },
            consequent: {
              type: 'EmptyStatement'
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if ( a + b instanceof c ) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
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
              operator: 'instanceof'
            },
            consequent: {
              type: 'EmptyStatement'
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if ( a + b ** c ) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '**'
              },
              operator: '+'
            },
            consequent: {
              type: 'EmptyStatement'
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if ( a / b + c ) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
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
                operator: '/'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '+'
            },
            consequent: {
              type: 'EmptyStatement'
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'a + b << c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '<<',
              left: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a << b + c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '<<',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
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
      'a ** b * c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '*',
              left: {
                type: 'BinaryExpression',
                operator: '**',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a ** b ** c + d',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'BinaryExpression',
                operator: '**',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'BinaryExpression',
                  operator: '**',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  }
                }
              },
              right: {
                type: 'Identifier',
                name: 'd'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a * x ? b : c ? d : e',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '*'
              },
              consequent: {
                type: 'Identifier',
                name: 'b'
              },
              alternate: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'c'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'd'
                },
                alternate: {
                  type: 'Identifier',
                  name: 'e'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a=b+=c-=d**=e*=f/=g%=h<<=i>>=j>>>=k&=l^=m|=n',
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
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '+=',
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  operator: '-=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    operator: '**=',
                    right: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'e'
                      },
                      operator: '*=',
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'f'
                        },
                        operator: '/=',
                        right: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'g'
                          },
                          operator: '%=',
                          right: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'h'
                            },
                            operator: '<<=',
                            right: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'i'
                              },
                              operator: '>>=',
                              right: {
                                type: 'AssignmentExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'j'
                                },
                                operator: '>>>=',
                                right: {
                                  type: 'AssignmentExpression',
                                  left: {
                                    type: 'Identifier',
                                    name: 'k'
                                  },
                                  operator: '&=',
                                  right: {
                                    type: 'AssignmentExpression',
                                    left: {
                                      type: 'Identifier',
                                      name: 'l'
                                    },
                                    operator: '^=',
                                    right: {
                                      type: 'AssignmentExpression',
                                      left: {
                                        type: 'Identifier',
                                        name: 'm'
                                      },
                                      operator: '|=',
                                      right: {
                                        type: 'Identifier',
                                        name: 'n'
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a ? b : c ? d : e * x',
      Context.OptionsRanges,
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
                name: 'a',
                start: 0,
                end: 1,
                range: [0, 1]
              },
              consequent: {
                type: 'Identifier',
                name: 'b',
                start: 4,
                end: 5,
                range: [4, 5]
              },
              alternate: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'c',
                  start: 8,
                  end: 9,
                  range: [8, 9]
                },
                consequent: {
                  type: 'Identifier',
                  name: 'd',
                  start: 12,
                  end: 13,
                  range: [12, 13]
                },
                alternate: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'e',
                    start: 16,
                    end: 17,
                    range: [16, 17]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x',
                    start: 20,
                    end: 21,
                    range: [20, 21]
                  },
                  operator: '*',
                  start: 16,
                  end: 21,
                  range: [16, 21]
                },
                start: 8,
                end: 21,
                range: [8, 21]
              },
              start: 0,
              end: 21,
              range: [0, 21]
            },
            start: 0,
            end: 21,
            range: [0, 21]
          }
        ],
        start: 0,
        end: 21,
        range: [0, 21]
      }
    ],
    [
      'a ? b : c ? d : e ** x',
      Context.OptionsRanges,
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
                name: 'a',
                start: 0,
                end: 1,
                range: [0, 1]
              },
              consequent: {
                type: 'Identifier',
                name: 'b',
                start: 4,
                end: 5,
                range: [4, 5]
              },
              alternate: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'c',
                  start: 8,
                  end: 9,
                  range: [8, 9]
                },
                consequent: {
                  type: 'Identifier',
                  name: 'd',
                  start: 12,
                  end: 13,
                  range: [12, 13]
                },
                alternate: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'e',
                    start: 16,
                    end: 17,
                    range: [16, 17]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x',
                    start: 21,
                    end: 22,
                    range: [21, 22]
                  },
                  operator: '**',
                  start: 16,
                  end: 22,
                  range: [16, 22]
                },
                start: 8,
                end: 22,
                range: [8, 22]
              },
              start: 0,
              end: 22,
              range: [0, 22]
            },
            start: 0,
            end: 22,
            range: [0, 22]
          }
        ],
        start: 0,
        end: 22,
        range: [0, 22]
      }
    ],
    [
      'a ? b ? c : d : e',
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
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c'
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd'
                }
              },
              alternate: {
                type: 'Identifier',
                name: 'e'
              }
            }
          }
        ]
      }
    ],
    [
      'a ** x ? b ? c : d : e',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a',
                  start: 0,
                  end: 1,
                  range: [0, 1]
                },
                right: {
                  type: 'Identifier',
                  name: 'x',
                  start: 5,
                  end: 6,
                  range: [5, 6]
                },
                operator: '**',
                start: 0,
                end: 6,
                range: [0, 6]
              },
              consequent: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b',
                  start: 9,
                  end: 10,
                  range: [9, 10]
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c',
                  start: 13,
                  end: 14,
                  range: [13, 14]
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd',
                  start: 17,
                  end: 18,
                  range: [17, 18]
                },
                start: 9,
                end: 18,
                range: [9, 18]
              },
              alternate: {
                type: 'Identifier',
                name: 'e',
                start: 21,
                end: 22,
                range: [21, 22]
              },
              start: 0,
              end: 22,
              range: [0, 22]
            },
            start: 0,
            end: 22,
            range: [0, 22]
          }
        ],
        start: 0,
        end: 22,
        range: [0, 22]
      }
    ],
    [
      'x || y || z',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '||',
                right: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              operator: '||',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a ? b ? c ** x : d : e',
      Context.OptionsRanges,
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
                name: 'a',
                start: 0,
                end: 1,
                range: [0, 1]
              },
              consequent: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b',
                  start: 4,
                  end: 5,
                  range: [4, 5]
                },
                consequent: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c',
                    start: 8,
                    end: 9,
                    range: [8, 9]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x',
                    start: 13,
                    end: 14,
                    range: [13, 14]
                  },
                  operator: '**',
                  start: 8,
                  end: 14,
                  range: [8, 14]
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd',
                  start: 17,
                  end: 18,
                  range: [17, 18]
                },
                start: 4,
                end: 18,
                range: [4, 18]
              },
              alternate: {
                type: 'Identifier',
                name: 'e',
                start: 21,
                end: 22,
                range: [21, 22]
              },
              start: 0,
              end: 22,
              range: [0, 22]
            },
            start: 0,
            end: 22,
            range: [0, 22]
          }
        ],
        start: 0,
        end: 22,
        range: [0, 22]
      }
    ],
    [
      'a ? b ? c : d ** x : e',
      Context.None,
      {
        type: 'Program',
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
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c'
                },
                alternate: {
                  type: 'BinaryExpression',
                  operator: '**',
                  left: {
                    type: 'Identifier',
                    name: 'd'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              },
              alternate: {
                type: 'Identifier',
                name: 'e'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a ? b ? c : d : e ** x',
      Context.None,
      {
        type: 'Program',
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
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c'
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd'
                }
              },
              alternate: {
                type: 'BinaryExpression',
                operator: '**',
                left: {
                  type: 'Identifier',
                  name: 'e'
                },
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a ? b : c * x ? d : e',
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
                type: 'ConditionalExpression',
                test: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '*'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'd'
                },
                alternate: {
                  type: 'Identifier',
                  name: 'e'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a=b+=c-=d**=e*=f/=g%=h<<=i>>=j>>>=k&=l^=m|=n',
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
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '+=',
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  operator: '-=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    operator: '**=',
                    right: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'e'
                      },
                      operator: '*=',
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'f'
                        },
                        operator: '/=',
                        right: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'g'
                          },
                          operator: '%=',
                          right: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'h'
                            },
                            operator: '<<=',
                            right: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'i'
                              },
                              operator: '>>=',
                              right: {
                                type: 'AssignmentExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'j'
                                },
                                operator: '>>>=',
                                right: {
                                  type: 'AssignmentExpression',
                                  left: {
                                    type: 'Identifier',
                                    name: 'k'
                                  },
                                  operator: '&=',
                                  right: {
                                    type: 'AssignmentExpression',
                                    left: {
                                      type: 'Identifier',
                                      name: 'l'
                                    },
                                    operator: '^=',
                                    right: {
                                      type: 'AssignmentExpression',
                                      left: {
                                        type: 'Identifier',
                                        name: 'm'
                                      },
                                      operator: '|=',
                                      right: {
                                        type: 'Identifier',
                                        name: 'n'
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    ]
  ]);
});
