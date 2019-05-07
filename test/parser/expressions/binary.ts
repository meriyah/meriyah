import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';
describe('Expressions - Binary', () => {
  for (const arg of [
    '(-1) = a',
    '(- 0) = a',
    '1 = a',
    '(-1) *= a',
    '(- 0) *= a',
    '1 *= a',
    '(-1) /= a',
    '++(a + b)',
    '(a = b) <<= c',
    'a + b %= c',
    '(a = b) /= c',
    '(- 0) /= a',
    '1 /= a',
    '(-1) %= a',
    '(- 0) %= a',
    '1 %= a',
    '(-1) += a',
    '(- 0) += a',
    '1 += a',
    '(-1) -= a',
    '(- 0) -= a',
    '1 -= a',
    '(-1) <<= a',
    '(- 0) <<= a',
    '1 <<= a',
    '(-1) >>= a',
    '(- 0) >>= a',
    '1 >>= a',
    '(-1) >>>= a',
    '(- 0) >>>= a',
    '1 >>>= a',
    '(-1) &= a',
    '(- 0) &= a',
    '1 &= a',
    '(-1) ^= a',
    '(- 0) ^= a',
    '1 ^= a',
    '(-1) |= a',
    '(- 0) |= a',
    '1 |= a'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    '(a * b * c)',
    '(a * b) * c',
    'a * (b * c)',
    'a * b + c',
    '(a * b) + c',
    'a * (b + c)',
    'a * b - c',
    '(a * b) - c',
    'a * (b - c)',
    'a / b / c',
    '(a / b) / c',
    'a / (b / c)',
    'a * b / c',
    '(a * b) / c',
    'a * (b / c)',
    'a / b + c',
    '(a / b) + c',
    'a / (b + c)',
    'a % b % c',
    '(a % b) % c',
    'a % (b % c)',
    'a * b % c',
    '(a * b) % c',
    'a * (b % c)',
    'a % b + c',
    '(a % b) + c',
    'a % (b + c)',
    'a + b + c',
    '(a + b) + c',
    'a + (b + c)',
    'a + b << c',
    '(a + b) << c',
    'a + (b << c)',
    'a + b >> c',
    '(a + b) >> c',
    'a + (b >> c)',
    'a + b >>> c',
    '(a + b) >>> c',
    'a + (b >>> c)',
    'a - b - c',
    '(a - b) - c',
    'a - (b - c)',
    'a + b - c',
    'a << (b << c)',
    'a << b instanceof c',
    '(a << b) instanceof c',
    'a << (b instanceof c)',
    'a << b in c',
    '(a << b) in c',
    'a << (b in c)',
    'a >> b >> c',
    '(a >> b) >> c',
    'a >> (b >> c)',
    'a << b >> c',
    '(a << b) >> c',
    'a << (b >> c)',
    'a >> b < c',
    '(a >> b) < c',
    'a >> (b < c)',
    'a >>> b >>> c',
    '(a >>> b) >>> c',
    'a >>> (b >>> c)',
    'a << b >>> c',
    '(a << b) >>> c',
    'a << (b >>> c)',
    'a >>> b < c',
    '(a >>> b) < c',
    'a >>> (b < c)',
    'a < b < c',
    '(a < b) < c',
    'a < (b < c)',
    'a < b == c',
    '(a < b) == c',
    'a < (b == c)',
    'a < b != c',
    '(a < b) != c',
    'a < (b != c)',
    'a < b === c',
    '(a < b) === c',
    'a < (b === c)',
    'a < b !== c',
    '(a < b) !== c',
    'a < (b !== c)',
    'a > b > c',
    'a in (b == c)',
    'a == b == c',
    '(a == b) == c',
    'a == (b == c)',
    'a == b & c',
    '(a == b) & c',
    'a == (b & c)',
    'a != b != c',
    '(a != b) != c',
    'a != (b != c)',
    'a == b != c',
    '(a == b) != c',
    'a == (b != c)',
    'a != b & c',
    '(a != b) & c',
    'a != (b & c)',
    'a === b === c',
    '(a === b) === c',
    'a === (b === c)',
    'a == b === c',
    'a & b & c',
    '(a & b) & c',
    'a & (b & c)',
    'a & b ^ c',
    '(a & b) ^ c',
    'a & (b ^ c)',
    'a ^ b ^ c',
    '(a ^ b) ^ c',
    'a ^ (b ^ c)',
    'a ^ b | c',
    '(a ^ b) | c',
    'a ^ (b | c)',
    'a | b | c',
    'a + (b /= c)',
    'a %= b %= c',
    'a << b < c',
    '(a << b) < c',
    'a << (b < c)',
    'a << b > c',
    '(a << b) > c',
    'a << (b > c)',
    'a >>= b + c',
    '(a >>= b) + c',
    'a >>= (b + c)',
    'a &= b + c',
    '(a &= b) + c',
    'a &= (b + c)',
    'a + (b |= c)',
    'delete (a + b)',
    'void a + b',
    '(void a) + b',
    'void (a + b)',
    '!void a',
    '!(void a)',
    'typeof a + b',
    '(typeof a) + b',
    'typeof (a + b)',
    '!typeof a',
    '!(typeof a)',
    '++a + b',
    '(++a) + b',
    '(-1).a',
    '(-1).a = b',
    '(-1).a += b',
    '(-1).a++',
    '++(-1).a',
    '(-1).a()',
    '(- 0)[a]',
    '(- 0)[a] = b',
    '(- 0)[a] += b',
    '(- 0)[a]++',
    '++(- 0)[a]',
    '(- 0)[a]()',
    'new (- 0)()',
    '(- 0).a',
    '(- 0).a = b',
    '(- 0).a += b',
    '(- 0).a++',
    '++(- 0).a',
    '(- 0).a()',
    '(1)[a]',
    '(1)[a] = b',
    '(1)[a] += b',
    '(1)[a]++',
    '++(1)[a]',
    '(1)[a]()',
    'new (1)()',
    '(1).a',
    '(1).a = b',
    '(1).a += b',
    '(1).a++',
    '++(1).a',
    '(1).a()',
    '({ }).x',
    'x = { }',
    '(function () { })()',
    'x = function () { }',
    'var a',
    'var a = 1',
    'var a, b',
    'var a = 1, b = 2',
    'var a, b, c',
    'var a = 1, b = 2, c = 3',
    'const a = 1',
    'const a = (1, 2)'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  pass('Expressions - Binary (pass)', [
    [
      '1+2;',
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
                type: 'Literal',
                value: 1
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'x - y + z',
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
                operator: '-'
              },
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'x + y * z',
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
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'y'
                },
                right: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '*'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'x * y % z',
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
                operator: '*'
              },
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '%'
            }
          }
        ]
      }
    ],
    [
      '++x ** y',
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
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '++',
                prefix: true
              },
              right: {
                type: 'Identifier',
                name: 'y'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      '-(x ** y)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '-',
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
                operator: '**'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'x in y',
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
              operator: 'in'
            }
          }
        ]
      }
    ],
    [
      'b && c == d',
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
                type: 'Identifier',
                name: 'b'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '=='
              },
              operator: '&&'
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
      'a|=b^=c&=d>>>=e>>=f<<=g%=h/=i*=j**=k-=l+=m=n',
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
              operator: '|=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '^=',
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  operator: '&=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    operator: '>>>=',
                    right: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'e'
                      },
                      operator: '>>=',
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'f'
                        },
                        operator: '<<=',
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
                            operator: '/=',
                            right: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'i'
                              },
                              operator: '*=',
                              right: {
                                type: 'AssignmentExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'j'
                                },
                                operator: '**=',
                                right: {
                                  type: 'AssignmentExpression',
                                  left: {
                                    type: 'Identifier',
                                    name: 'k'
                                  },
                                  operator: '-=',
                                  right: {
                                    type: 'AssignmentExpression',
                                    left: {
                                      type: 'Identifier',
                                      name: 'l'
                                    },
                                    operator: '+=',
                                    right: {
                                      type: 'AssignmentExpression',
                                      left: {
                                        type: 'Identifier',
                                        name: 'm'
                                      },
                                      operator: '=',
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
      'a || b || c',
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
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '||'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '||'
            }
          }
        ]
      }
    ],
    [
      'a && b && c',
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
      'a && b || c',
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
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '||'
            }
          }
        ]
      }
    ],
    [
      'a || b && c',
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
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '&&'
              },
              operator: '||'
            }
          }
        ]
      }
    ],
    [
      'a ^ b | c',
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
                operator: '^'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '|'
            }
          }
        ]
      }
    ],
    [
      'a == b != c === d !== e',
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
                    operator: '=='
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  operator: '!='
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '==='
              },
              right: {
                type: 'Identifier',
                name: 'e'
              },
              operator: '!=='
            }
          }
        ]
      }
    ]
  ]);
});
