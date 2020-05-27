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
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
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
        range: [0, 8],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 8,
            range: [0, 8],
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 8,
              range: [0, 8],
              left: {
                type: 'UpdateExpression',
                start: 0,
                end: 3,
                range: [0, 3],
                operator: '++',
                prefix: true,
                argument: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  range: [2, 3],
                  name: 'x'
                }
              },
              operator: '**',
              right: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
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
        range: [0, 9],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 9,
            range: [0, 9],
            expression: {
              type: 'UnaryExpression',
              start: 0,
              end: 9,
              range: [0, 9],
              operator: '-',
              prefix: true,
              argument: {
                type: 'BinaryExpression',
                start: 2,
                end: 8,
                range: [2, 8],
                left: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  range: [2, 3],
                  name: 'x'
                },
                operator: '**',
                right: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  range: [7, 8],
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
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'LogicalExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'b'
              },
              operator: '&&',
              right: {
                type: 'BinaryExpression',
                start: 5,
                end: 11,
                range: [5, 11],
                left: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'c'
                },
                operator: '==',
                right: {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  range: [10, 11],
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
        range: [0, 44],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 44,
            range: [0, 44],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 44,
              range: [0, 44],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'a'
              },
              right: {
                type: 'AssignmentExpression',
                start: 2,
                end: 44,
                range: [2, 44],
                operator: '+=',
                left: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  range: [2, 3],
                  name: 'b'
                },
                right: {
                  type: 'AssignmentExpression',
                  start: 5,
                  end: 44,
                  range: [5, 44],
                  operator: '-=',
                  left: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'c'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 8,
                    end: 44,
                    range: [8, 44],
                    operator: '**=',
                    left: {
                      type: 'Identifier',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      name: 'd'
                    },
                    right: {
                      type: 'AssignmentExpression',
                      start: 12,
                      end: 44,
                      range: [12, 44],
                      operator: '*=',
                      left: {
                        type: 'Identifier',
                        start: 12,
                        end: 13,
                        range: [12, 13],
                        name: 'e'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        start: 15,
                        end: 44,
                        range: [15, 44],
                        operator: '/=',
                        left: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
                          range: [15, 16],
                          name: 'f'
                        },
                        right: {
                          type: 'AssignmentExpression',
                          start: 18,
                          end: 44,
                          range: [18, 44],
                          operator: '%=',
                          left: {
                            type: 'Identifier',
                            start: 18,
                            end: 19,
                            range: [18, 19],
                            name: 'g'
                          },
                          right: {
                            type: 'AssignmentExpression',
                            start: 21,
                            end: 44,
                            range: [21, 44],
                            operator: '<<=',
                            left: {
                              type: 'Identifier',
                              start: 21,
                              end: 22,
                              range: [21, 22],
                              name: 'h'
                            },
                            right: {
                              type: 'AssignmentExpression',
                              start: 25,
                              end: 44,
                              range: [25, 44],
                              operator: '>>=',
                              left: {
                                type: 'Identifier',
                                start: 25,
                                end: 26,
                                range: [25, 26],
                                name: 'i'
                              },
                              right: {
                                type: 'AssignmentExpression',
                                start: 29,
                                end: 44,
                                range: [29, 44],
                                operator: '>>>=',
                                left: {
                                  type: 'Identifier',
                                  start: 29,
                                  end: 30,
                                  range: [29, 30],
                                  name: 'j'
                                },
                                right: {
                                  type: 'AssignmentExpression',
                                  start: 34,
                                  end: 44,
                                  range: [34, 44],
                                  operator: '&=',
                                  left: {
                                    type: 'Identifier',
                                    start: 34,
                                    end: 35,
                                    range: [34, 35],
                                    name: 'k'
                                  },
                                  right: {
                                    type: 'AssignmentExpression',
                                    start: 37,
                                    end: 44,
                                    range: [37, 44],
                                    operator: '^=',
                                    left: {
                                      type: 'Identifier',
                                      start: 37,
                                      end: 38,
                                      range: [37, 38],
                                      name: 'l'
                                    },
                                    right: {
                                      type: 'AssignmentExpression',
                                      start: 40,
                                      end: 44,
                                      range: [40, 44],
                                      operator: '|=',
                                      left: {
                                        type: 'Identifier',
                                        start: 40,
                                        end: 41,
                                        range: [40, 41],
                                        name: 'm'
                                      },
                                      right: {
                                        type: 'Identifier',
                                        start: 43,
                                        end: 44,
                                        range: [43, 44],
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
        range: [0, 44],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 44,
            range: [0, 44],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 44,
              range: [0, 44],
              operator: '|=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'a'
              },
              right: {
                type: 'AssignmentExpression',
                start: 3,
                end: 44,
                range: [3, 44],
                operator: '^=',
                left: {
                  type: 'Identifier',
                  start: 3,
                  end: 4,
                  range: [3, 4],
                  name: 'b'
                },
                right: {
                  type: 'AssignmentExpression',
                  start: 6,
                  end: 44,
                  range: [6, 44],
                  operator: '&=',
                  left: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    range: [6, 7],
                    name: 'c'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 9,
                    end: 44,
                    range: [9, 44],
                    operator: '>>>=',
                    left: {
                      type: 'Identifier',
                      start: 9,
                      end: 10,
                      range: [9, 10],
                      name: 'd'
                    },
                    right: {
                      type: 'AssignmentExpression',
                      start: 14,
                      end: 44,
                      range: [14, 44],
                      operator: '>>=',
                      left: {
                        type: 'Identifier',
                        start: 14,
                        end: 15,
                        range: [14, 15],
                        name: 'e'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        start: 18,
                        end: 44,
                        range: [18, 44],
                        operator: '<<=',
                        left: {
                          type: 'Identifier',
                          start: 18,
                          end: 19,
                          range: [18, 19],
                          name: 'f'
                        },
                        right: {
                          type: 'AssignmentExpression',
                          start: 22,
                          end: 44,
                          range: [22, 44],
                          operator: '%=',
                          left: {
                            type: 'Identifier',
                            start: 22,
                            end: 23,
                            range: [22, 23],
                            name: 'g'
                          },
                          right: {
                            type: 'AssignmentExpression',
                            start: 25,
                            end: 44,
                            range: [25, 44],
                            operator: '/=',
                            left: {
                              type: 'Identifier',
                              start: 25,
                              end: 26,
                              range: [25, 26],
                              name: 'h'
                            },
                            right: {
                              type: 'AssignmentExpression',
                              start: 28,
                              end: 44,
                              range: [28, 44],
                              operator: '*=',
                              left: {
                                type: 'Identifier',
                                start: 28,
                                end: 29,
                                range: [28, 29],
                                name: 'i'
                              },
                              right: {
                                type: 'AssignmentExpression',
                                start: 31,
                                end: 44,
                                range: [31, 44],
                                operator: '**=',
                                left: {
                                  type: 'Identifier',
                                  start: 31,
                                  end: 32,
                                  range: [31, 32],
                                  name: 'j'
                                },
                                right: {
                                  type: 'AssignmentExpression',
                                  start: 35,
                                  end: 44,
                                  range: [35, 44],
                                  operator: '-=',
                                  left: {
                                    type: 'Identifier',
                                    start: 35,
                                    end: 36,
                                    range: [35, 36],
                                    name: 'k'
                                  },
                                  right: {
                                    type: 'AssignmentExpression',
                                    start: 38,
                                    end: 44,
                                    range: [38, 44],
                                    operator: '+=',
                                    left: {
                                      type: 'Identifier',
                                      start: 38,
                                      end: 39,
                                      range: [38, 39],
                                      name: 'l'
                                    },
                                    right: {
                                      type: 'AssignmentExpression',
                                      start: 41,
                                      end: 44,
                                      range: [41, 44],
                                      operator: '=',
                                      left: {
                                        type: 'Identifier',
                                        start: 41,
                                        end: 42,
                                        range: [41, 42],
                                        name: 'm'
                                      },
                                      right: {
                                        type: 'Identifier',
                                        start: 43,
                                        end: 44,
                                        range: [43, 44],
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
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'LogicalExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              left: {
                type: 'LogicalExpression',
                start: 0,
                end: 6,
                range: [0, 6],
                left: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  name: 'a'
                },
                operator: '||',
                right: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'b'
                }
              },
              operator: '||',
              right: {
                type: 'Identifier',
                start: 10,
                end: 11,
                range: [10, 11],
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
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'LogicalExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              left: {
                type: 'LogicalExpression',
                start: 0,
                end: 6,
                range: [0, 6],
                left: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  name: 'a'
                },
                operator: '&&',
                right: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'b'
                }
              },
              operator: '&&',
              right: {
                type: 'Identifier',
                start: 10,
                end: 11,
                range: [10, 11],
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
      Context.OptionsLoc,
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
                name: 'a',
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 1
                  }
                }
              },
              right: {
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: 'b',
                  loc: {
                    start: {
                      line: 1,
                      column: 5
                    },
                    end: {
                      line: 1,
                      column: 6
                    }
                  }
                },
                right: {
                  type: 'Identifier',
                  name: 'c',
                  loc: {
                    start: {
                      line: 1,
                      column: 10
                    },
                    end: {
                      line: 1,
                      column: 11
                    }
                  }
                },
                operator: '&&',
                loc: {
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 11
                  }
                }
              },
              operator: '||',
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 11
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 11
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 11
          }
        }
      }
    ],
    [
      'a ^ b | c',
      Context.OptionsLoc,
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
                  name: 'a',
                  loc: {
                    start: {
                      line: 1,
                      column: 0
                    },
                    end: {
                      line: 1,
                      column: 1
                    }
                  }
                },
                right: {
                  type: 'Identifier',
                  name: 'b',
                  loc: {
                    start: {
                      line: 1,
                      column: 4
                    },
                    end: {
                      line: 1,
                      column: 5
                    }
                  }
                },
                operator: '^',
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 5
                  }
                }
              },
              right: {
                type: 'Identifier',
                name: 'c',
                loc: {
                  start: {
                    line: 1,
                    column: 8
                  },
                  end: {
                    line: 1,
                    column: 9
                  }
                }
              },
              operator: '|',
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 9
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 9
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 9
          }
        }
      }
    ],
    [
      'a == b != c === d !== e',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            range: [0, 23],
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              left: {
                type: 'BinaryExpression',
                start: 0,
                end: 17,
                range: [0, 17],
                left: {
                  type: 'BinaryExpression',
                  start: 0,
                  end: 11,
                  range: [0, 11],
                  left: {
                    type: 'BinaryExpression',
                    start: 0,
                    end: 6,
                    range: [0, 6],
                    left: {
                      type: 'Identifier',
                      start: 0,
                      end: 1,
                      range: [0, 1],
                      name: 'a'
                    },
                    operator: '==',
                    right: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'b'
                    }
                  },
                  operator: '!=',
                  right: {
                    type: 'Identifier',
                    start: 10,
                    end: 11,
                    range: [10, 11],
                    name: 'c'
                  }
                },
                operator: '===',
                right: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  range: [16, 17],
                  name: 'd'
                }
              },
              operator: '!==',
              right: {
                type: 'Identifier',
                start: 22,
                end: 23,
                range: [22, 23],
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
