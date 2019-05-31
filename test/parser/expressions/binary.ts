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
              type: 'BinaryExpression',
              start: 0,
              end: 8,
              left: {
                type: 'UpdateExpression',
                start: 0,
                end: 3,
                operator: '++',
                prefix: true,
                argument: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'x'
                }
              },
              operator: '**',
              right: {
                type: 'Identifier',
                start: 7,
                end: 8,
                name: 'y'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '-(x ** y)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 9,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 9,
            expression: {
              type: 'UnaryExpression',
              start: 0,
              end: 9,
              operator: '-',
              prefix: true,
              argument: {
                type: 'BinaryExpression',
                start: 2,
                end: 8,
                left: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'x'
                },
                operator: '**',
                right: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  name: 'y'
                }
              }
            }
          }
        ],
        sourceType: 'script'
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
              type: 'LogicalExpression',
              start: 0,
              end: 11,
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'b'
              },
              operator: '&&',
              right: {
                type: 'BinaryExpression',
                start: 5,
                end: 11,
                left: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  name: 'c'
                },
                operator: '==',
                right: {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  name: 'd'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],

    [
      'a=b+=c-=d**=e*=f/=g%=h<<=i>>=j>>>=k&=l^=m|=n',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 44,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 44,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 44,
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'a'
              },
              right: {
                type: 'AssignmentExpression',
                start: 2,
                end: 44,
                operator: '+=',
                left: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'b'
                },
                right: {
                  type: 'AssignmentExpression',
                  start: 5,
                  end: 44,
                  operator: '-=',
                  left: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    name: 'c'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 8,
                    end: 44,
                    operator: '**=',
                    left: {
                      type: 'Identifier',
                      start: 8,
                      end: 9,
                      name: 'd'
                    },
                    right: {
                      type: 'AssignmentExpression',
                      start: 12,
                      end: 44,
                      operator: '*=',
                      left: {
                        type: 'Identifier',
                        start: 12,
                        end: 13,
                        name: 'e'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        start: 15,
                        end: 44,
                        operator: '/=',
                        left: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
                          name: 'f'
                        },
                        right: {
                          type: 'AssignmentExpression',
                          start: 18,
                          end: 44,
                          operator: '%=',
                          left: {
                            type: 'Identifier',
                            start: 18,
                            end: 19,
                            name: 'g'
                          },
                          right: {
                            type: 'AssignmentExpression',
                            start: 21,
                            end: 44,
                            operator: '<<=',
                            left: {
                              type: 'Identifier',
                              start: 21,
                              end: 22,
                              name: 'h'
                            },
                            right: {
                              type: 'AssignmentExpression',
                              start: 25,
                              end: 44,
                              operator: '>>=',
                              left: {
                                type: 'Identifier',
                                start: 25,
                                end: 26,
                                name: 'i'
                              },
                              right: {
                                type: 'AssignmentExpression',
                                start: 29,
                                end: 44,
                                operator: '>>>=',
                                left: {
                                  type: 'Identifier',
                                  start: 29,
                                  end: 30,
                                  name: 'j'
                                },
                                right: {
                                  type: 'AssignmentExpression',
                                  start: 34,
                                  end: 44,
                                  operator: '&=',
                                  left: {
                                    type: 'Identifier',
                                    start: 34,
                                    end: 35,
                                    name: 'k'
                                  },
                                  right: {
                                    type: 'AssignmentExpression',
                                    start: 37,
                                    end: 44,
                                    operator: '^=',
                                    left: {
                                      type: 'Identifier',
                                      start: 37,
                                      end: 38,
                                      name: 'l'
                                    },
                                    right: {
                                      type: 'AssignmentExpression',
                                      start: 40,
                                      end: 44,
                                      operator: '|=',
                                      left: {
                                        type: 'Identifier',
                                        start: 40,
                                        end: 41,
                                        name: 'm'
                                      },
                                      right: {
                                        type: 'Identifier',
                                        start: 43,
                                        end: 44,
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
        ],
        sourceType: 'script'
      }
    ],
    [
      'a|=b^=c&=d>>>=e>>=f<<=g%=h/=i*=j**=k-=l+=m=n',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 44,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 44,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 44,
              operator: '|=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'a'
              },
              right: {
                type: 'AssignmentExpression',
                start: 3,
                end: 44,
                operator: '^=',
                left: {
                  type: 'Identifier',
                  start: 3,
                  end: 4,
                  name: 'b'
                },
                right: {
                  type: 'AssignmentExpression',
                  start: 6,
                  end: 44,
                  operator: '&=',
                  left: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    name: 'c'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 9,
                    end: 44,
                    operator: '>>>=',
                    left: {
                      type: 'Identifier',
                      start: 9,
                      end: 10,
                      name: 'd'
                    },
                    right: {
                      type: 'AssignmentExpression',
                      start: 14,
                      end: 44,
                      operator: '>>=',
                      left: {
                        type: 'Identifier',
                        start: 14,
                        end: 15,
                        name: 'e'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        start: 18,
                        end: 44,
                        operator: '<<=',
                        left: {
                          type: 'Identifier',
                          start: 18,
                          end: 19,
                          name: 'f'
                        },
                        right: {
                          type: 'AssignmentExpression',
                          start: 22,
                          end: 44,
                          operator: '%=',
                          left: {
                            type: 'Identifier',
                            start: 22,
                            end: 23,
                            name: 'g'
                          },
                          right: {
                            type: 'AssignmentExpression',
                            start: 25,
                            end: 44,
                            operator: '/=',
                            left: {
                              type: 'Identifier',
                              start: 25,
                              end: 26,
                              name: 'h'
                            },
                            right: {
                              type: 'AssignmentExpression',
                              start: 28,
                              end: 44,
                              operator: '*=',
                              left: {
                                type: 'Identifier',
                                start: 28,
                                end: 29,
                                name: 'i'
                              },
                              right: {
                                type: 'AssignmentExpression',
                                start: 31,
                                end: 44,
                                operator: '**=',
                                left: {
                                  type: 'Identifier',
                                  start: 31,
                                  end: 32,
                                  name: 'j'
                                },
                                right: {
                                  type: 'AssignmentExpression',
                                  start: 35,
                                  end: 44,
                                  operator: '-=',
                                  left: {
                                    type: 'Identifier',
                                    start: 35,
                                    end: 36,
                                    name: 'k'
                                  },
                                  right: {
                                    type: 'AssignmentExpression',
                                    start: 38,
                                    end: 44,
                                    operator: '+=',
                                    left: {
                                      type: 'Identifier',
                                      start: 38,
                                      end: 39,
                                      name: 'l'
                                    },
                                    right: {
                                      type: 'AssignmentExpression',
                                      start: 41,
                                      end: 44,
                                      operator: '=',
                                      left: {
                                        type: 'Identifier',
                                        start: 41,
                                        end: 42,
                                        name: 'm'
                                      },
                                      right: {
                                        type: 'Identifier',
                                        start: 43,
                                        end: 44,
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
        ],
        sourceType: 'script'
      }
    ],
    [
      'a || b || c',
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
              type: 'LogicalExpression',
              start: 0,
              end: 11,
              left: {
                type: 'LogicalExpression',
                start: 0,
                end: 6,
                left: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                operator: '||',
                right: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  name: 'b'
                }
              },
              operator: '||',
              right: {
                type: 'Identifier',
                start: 10,
                end: 11,
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a && b && c',
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
              type: 'LogicalExpression',
              start: 0,
              end: 11,
              left: {
                type: 'LogicalExpression',
                start: 0,
                end: 6,
                left: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                operator: '&&',
                right: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  name: 'b'
                }
              },
              operator: '&&',
              right: {
                type: 'Identifier',
                start: 10,
                end: 11,
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 23,
              left: {
                type: 'BinaryExpression',
                start: 0,
                end: 17,
                left: {
                  type: 'BinaryExpression',
                  start: 0,
                  end: 11,
                  left: {
                    type: 'BinaryExpression',
                    start: 0,
                    end: 6,
                    left: {
                      type: 'Identifier',
                      start: 0,
                      end: 1,
                      name: 'a'
                    },
                    operator: '==',
                    right: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      name: 'b'
                    }
                  },
                  operator: '!=',
                  right: {
                    type: 'Identifier',
                    start: 10,
                    end: 11,
                    name: 'c'
                  }
                },
                operator: '===',
                right: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  name: 'd'
                }
              },
              operator: '!==',
              right: {
                type: 'Identifier',
                start: 22,
                end: 23,
                name: 'e'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
