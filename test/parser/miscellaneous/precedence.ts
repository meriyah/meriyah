import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Miscellaneous - Precedence', () => {
  pass('Miscellaneous - Precedence (pass)', [
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
                    end: 2
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b',
                    start: 5,
                    end: 6
                  },
                  operator: '*',
                  start: 1,
                  end: 6
                },
                right: {
                  type: 'Identifier',
                  name: 'c',
                  start: 9,
                  end: 10
                },
                operator: '+',
                start: 1,
                end: 10
              },
              right: {
                type: 'Identifier',
                name: 'd',
                start: 14,
                end: 15
              },
              operator: '*',
              start: 0,
              end: 15
            },
            start: 0,
            end: 15
          }
        ],
        start: 0,
        end: 15
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
                end: 1
              },
              operator: '|=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b',
                  start: 3,
                  end: 4
                },
                operator: '^=',
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c',
                    start: 6,
                    end: 7
                  },
                  operator: '&=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'd',
                      start: 9,
                      end: 10
                    },
                    operator: '>>>=',
                    right: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'e',
                        start: 14,
                        end: 15
                      },
                      operator: '>>=',
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'f',
                          start: 18,
                          end: 19
                        },
                        operator: '<<=',
                        right: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'g',
                            start: 22,
                            end: 23
                          },
                          operator: '%=',
                          right: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'h',
                              start: 25,
                              end: 26
                            },
                            operator: '/=',
                            right: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'Identifier',
                                name: 'i',
                                start: 28,
                                end: 29
                              },
                              operator: '*=',
                              right: {
                                type: 'AssignmentExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'j',
                                  start: 31,
                                  end: 32
                                },
                                operator: '**=',
                                right: {
                                  type: 'AssignmentExpression',
                                  left: {
                                    type: 'Identifier',
                                    name: 'k',
                                    start: 35,
                                    end: 36
                                  },
                                  operator: '-=',
                                  right: {
                                    type: 'AssignmentExpression',
                                    left: {
                                      type: 'Identifier',
                                      name: 'l',
                                      start: 38,
                                      end: 39
                                    },
                                    operator: '+=',
                                    right: {
                                      type: 'AssignmentExpression',
                                      left: {
                                        type: 'Identifier',
                                        name: 'm',
                                        start: 41,
                                        end: 42
                                      },
                                      operator: '=',
                                      right: {
                                        type: 'Identifier',
                                        name: 'n',
                                        start: 43,
                                        end: 44
                                      },
                                      start: 41,
                                      end: 44
                                    },
                                    start: 38,
                                    end: 44
                                  },
                                  start: 35,
                                  end: 44
                                },
                                start: 31,
                                end: 44
                              },
                              start: 28,
                              end: 44
                            },
                            start: 25,
                            end: 44
                          },
                          start: 22,
                          end: 44
                        },
                        start: 18,
                        end: 44
                      },
                      start: 14,
                      end: 44
                    },
                    start: 9,
                    end: 44
                  },
                  start: 6,
                  end: 44
                },
                start: 3,
                end: 44
              },
              start: 0,
              end: 44
            },
            start: 0,
            end: 44
          }
        ],
        start: 0,
        end: 44
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
                end: 1
              },
              consequent: {
                type: 'Identifier',
                name: 'b',
                start: 4,
                end: 5
              },
              alternate: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'c',
                  start: 8,
                  end: 9
                },
                consequent: {
                  type: 'Identifier',
                  name: 'd',
                  start: 12,
                  end: 13
                },
                alternate: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'e',
                    start: 16,
                    end: 17
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x',
                    start: 20,
                    end: 21
                  },
                  operator: '*',
                  start: 16,
                  end: 21
                },
                start: 8,
                end: 21
              },
              start: 0,
              end: 21
            },
            start: 0,
            end: 21
          }
        ],
        start: 0,
        end: 21
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
                end: 1
              },
              consequent: {
                type: 'Identifier',
                name: 'b',
                start: 4,
                end: 5
              },
              alternate: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'c',
                  start: 8,
                  end: 9
                },
                consequent: {
                  type: 'Identifier',
                  name: 'd',
                  start: 12,
                  end: 13
                },
                alternate: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'e',
                    start: 16,
                    end: 17
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x',
                    start: 21,
                    end: 22
                  },
                  operator: '**',
                  start: 16,
                  end: 22
                },
                start: 8,
                end: 22
              },
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
                  end: 1
                },
                right: {
                  type: 'Identifier',
                  name: 'x',
                  start: 5,
                  end: 6
                },
                operator: '**',
                start: 0,
                end: 6
              },
              consequent: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b',
                  start: 9,
                  end: 10
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c',
                  start: 13,
                  end: 14
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd',
                  start: 17,
                  end: 18
                },
                start: 9,
                end: 18
              },
              alternate: {
                type: 'Identifier',
                name: 'e',
                start: 21,
                end: 22
              },
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
                end: 1
              },
              consequent: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b',
                  start: 4,
                  end: 5
                },
                consequent: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c',
                    start: 8,
                    end: 9
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x',
                    start: 13,
                    end: 14
                  },
                  operator: '**',
                  start: 8,
                  end: 14
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd',
                  start: 17,
                  end: 18
                },
                start: 4,
                end: 18
              },
              alternate: {
                type: 'Identifier',
                name: 'e',
                start: 21,
                end: 22
              },
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
