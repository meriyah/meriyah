import * as t from 'assert';
import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import { parse } from '../../../src/meriyah';

describe('Miscellaneous - loc', () => {
  pass('Miscellaneous - loc (pass)', [
    [
      `[,,x]`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 5,
        range: [0, 5],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 5
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 5,
            range: [0, 5],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 5
              }
            },
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 5,
              range: [0, 5],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 5
                }
              },
              elements: [
                null,
                null,
                {
                  type: 'Identifier',
                  start: 3,
                  end: 4,
                  range: [3, 4],
                  loc: {
                    start: {
                      line: 1,
                      column: 3
                    },
                    end: {
                      line: 1,
                      column: 4
                    }
                  },
                  name: 'x'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `[50..foo] = x`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 13,
        range: [0, 13],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 13
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 13
              }
            },
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 13
                }
              },
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 9,
                range: [0, 9],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 9
                  }
                },
                elements: [
                  {
                    type: 'MemberExpression',
                    start: 1,
                    end: 8,
                    range: [1, 8],
                    loc: {
                      start: {
                        line: 1,
                        column: 1
                      },
                      end: {
                        line: 1,
                        column: 8
                      }
                    },
                    object: {
                      type: 'Literal',
                      start: 1,
                      end: 4,
                      range: [1, 4],
                      loc: {
                        start: {
                          line: 1,
                          column: 1
                        },
                        end: {
                          line: 1,
                          column: 4
                        }
                      },
                      value: 50
                    },
                    property: {
                      type: 'Identifier',
                      start: 5,
                      end: 8,
                      range: [5, 8],
                      loc: {
                        start: {
                          line: 1,
                          column: 5
                        },
                        end: {
                          line: 1,
                          column: 8
                        }
                      },
                      name: 'foo'
                    },
                    computed: false
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 12,
                end: 13,
                range: [12, 13],
                loc: {
                  start: {
                    line: 1,
                    column: 12
                  },
                  end: {
                    line: 1,
                    column: 13
                  }
                },
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `a={"b":c=d}`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 11
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 11
              }
            },
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 11
                }
              },
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 1
                  }
                },
                name: 'a'
              },
              right: {
                type: 'ObjectExpression',
                start: 2,
                end: 11,
                range: [2, 11],
                loc: {
                  start: {
                    line: 1,
                    column: 2
                  },
                  end: {
                    line: 1,
                    column: 11
                  }
                },
                properties: [
                  {
                    type: 'Property',
                    start: 3,
                    end: 10,
                    range: [3, 10],
                    loc: {
                      start: {
                        line: 1,
                        column: 3
                      },
                      end: {
                        line: 1,
                        column: 10
                      }
                    },
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 3,
                      end: 6,
                      range: [3, 6],
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
                      value: 'b'
                    },
                    value: {
                      type: 'AssignmentExpression',
                      start: 7,
                      end: 10,
                      range: [7, 10],
                      loc: {
                        start: {
                          line: 1,
                          column: 7
                        },
                        end: {
                          line: 1,
                          column: 10
                        }
                      },
                      operator: '=',
                      left: {
                        type: 'Identifier',
                        start: 7,
                        end: 8,
                        range: [7, 8],
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
                        name: 'c'
                      },
                      right: {
                        type: 'Identifier',
                        start: 9,
                        end: 10,
                        range: [9, 10],
                        loc: {
                          start: {
                            line: 1,
                            column: 9
                          },
                          end: {
                            line: 1,
                            column: 10
                          }
                        },
                        name: 'd'
                      }
                    },
                    kind: 'init'
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    /*  [
            `1 -2 / 4`,
            Context.OptionsRanges | Context.OptionsLoc,
            {
              "type": "Program",
              "start": 0,
              "end": 8,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0
                },
                "end": {
                  "line": 1,
                  "column": 8
                }
              },
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 0,
                  "end": 8,
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 8
                    }
                  },
                  "expression": {
                    "type": "BinaryExpression",
                    "start": 0,
                    "end": 8,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 8
                      }
                    },
                    "left": {
                      "type": "Literal",
                      "start": 0,
                      "end": 1,
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 1
                        }
                      },
                      "value": 1
                    },
                    "operator": "-",
                    "right": {
                      "type": "BinaryExpression",
                      "start": 3,
                      "end": 8,
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 3
                        },
                        "end": {
                          "line": 1,
                          "column": 8
                        }
                      },
                      "left": {
                        "type": "Literal",
                        "start": 3,
                        "end": 4,
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 3
                          },
                          "end": {
                            "line": 1,
                            "column": 4
                          }
                        },
                        "value": 2
                      },
                      "operator": "/",
                      "right": {
                        "type": "Literal",
                        "start": 7,
                        "end": 8,
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 7
                          },
                          "end": {
                            "line": 1,
                            "column": 8
                          }
                        },
                        "value": 4
                      }
                    }
                  }
                }
              ],
              "sourceType": "script"
            }], */
    [
      `x = {y}`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 7,
        range: [0, 7],
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 7,
            range: [0, 7],
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
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 7,
              range: [0, 7],
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
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 1
                  }
                },
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 7,
                range: [4, 7],
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
                    range: [5, 6],
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
                      range: [5, 6],
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
                      name: 'y'
                    },
                    kind: 'init',
                    value: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
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
                      name: 'y'
                    }
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
      `0, [ x = y ] = [];`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 18
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 18
              }
            },
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 17
                }
              },
              expressions: [
                {
                  type: 'Literal',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  loc: {
                    start: {
                      line: 1,
                      column: 0
                    },
                    end: {
                      line: 1,
                      column: 1
                    }
                  },
                  value: 0
                },
                {
                  type: 'AssignmentExpression',
                  start: 3,
                  end: 17,
                  range: [3, 17],
                  loc: {
                    start: {
                      line: 1,
                      column: 3
                    },
                    end: {
                      line: 1,
                      column: 17
                    }
                  },
                  operator: '=',
                  left: {
                    type: 'ArrayPattern',
                    start: 3,
                    end: 12,
                    range: [3, 12],
                    loc: {
                      start: {
                        line: 1,
                        column: 3
                      },
                      end: {
                        line: 1,
                        column: 12
                      }
                    },
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        start: 5,
                        end: 10,
                        range: [5, 10],
                        loc: {
                          start: {
                            line: 1,
                            column: 5
                          },
                          end: {
                            line: 1,
                            column: 10
                          }
                        },
                        left: {
                          type: 'Identifier',
                          start: 5,
                          end: 6,
                          range: [5, 6],
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
                        right: {
                          type: 'Identifier',
                          start: 9,
                          end: 10,
                          range: [9, 10],
                          loc: {
                            start: {
                              line: 1,
                              column: 9
                            },
                            end: {
                              line: 1,
                              column: 10
                            }
                          },
                          name: 'y'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    start: 15,
                    end: 17,
                    range: [15, 17],
                    loc: {
                      start: {
                        line: 1,
                        column: 15
                      },
                      end: {
                        line: 1,
                        column: 17
                      }
                    },
                    elements: []
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
      `of = 42`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 7,
        range: [0, 7],
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
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 7,
            range: [0, 7],
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
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 7,
              range: [0, 7],
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
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 2,
                range: [0, 2],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 2
                  }
                },
                name: 'of'
              },
              right: {
                type: 'Literal',
                start: 5,
                end: 7,
                range: [5, 7],
                loc: {
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 7
                  }
                },
                value: 42
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `a *= b`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 6,
        range: [0, 6],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 6
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 6,
            range: [0, 6],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 6
              }
            },
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 6,
              range: [0, 6],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 6
                }
              },
              operator: '*=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 1
                  }
                },
                name: 'a'
              },
              right: {
                type: 'Identifier',
                start: 5,
                end: 6,
                range: [5, 6],
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
                name: 'b'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `(2[x,x],x)>x`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
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
            range: [0, 12],
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
              type: 'BinaryExpression',
              start: 0,
              end: 12,
              range: [0, 12],
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
              left: {
                type: 'SequenceExpression',
                start: 1,
                end: 9,
                range: [1, 9],
                loc: {
                  start: {
                    line: 1,
                    column: 1
                  },
                  end: {
                    line: 1,
                    column: 9
                  }
                },
                expressions: [
                  {
                    type: 'MemberExpression',
                    start: 1,
                    end: 7,
                    range: [1, 7],
                    loc: {
                      start: {
                        line: 1,
                        column: 1
                      },
                      end: {
                        line: 1,
                        column: 7
                      }
                    },
                    object: {
                      type: 'Literal',
                      start: 1,
                      end: 2,
                      range: [1, 2],
                      loc: {
                        start: {
                          line: 1,
                          column: 1
                        },
                        end: {
                          line: 1,
                          column: 2
                        }
                      },
                      value: 2
                    },
                    property: {
                      type: 'SequenceExpression',
                      start: 3,
                      end: 6,
                      range: [3, 6],
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
                      expressions: [
                        {
                          type: 'Identifier',
                          start: 3,
                          end: 4,
                          range: [3, 4],
                          loc: {
                            start: {
                              line: 1,
                              column: 3
                            },
                            end: {
                              line: 1,
                              column: 4
                            }
                          },
                          name: 'x'
                        },
                        {
                          type: 'Identifier',
                          start: 5,
                          end: 6,
                          range: [5, 6],
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
                      ]
                    },
                    computed: true
                  },
                  {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    range: [8, 9],
                    loc: {
                      start: {
                        line: 1,
                        column: 8
                      },
                      end: {
                        line: 1,
                        column: 9
                      }
                    },
                    name: 'x'
                  }
                ]
              },
              operator: '>',
              right: {
                type: 'Identifier',
                start: 11,
                end: 12,
                range: [11, 12],
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
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `a&&(b=c)&&(d=e)`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
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
            range: [0, 15],
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
              type: 'LogicalExpression',
              start: 0,
              end: 15,
              range: [0, 15],
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
              left: {
                type: 'LogicalExpression',
                start: 0,
                end: 8,
                range: [0, 8],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 8
                  }
                },
                left: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  loc: {
                    start: {
                      line: 1,
                      column: 0
                    },
                    end: {
                      line: 1,
                      column: 1
                    }
                  },
                  name: 'a'
                },
                operator: '&&',
                right: {
                  type: 'AssignmentExpression',
                  start: 4,
                  end: 7,
                  range: [4, 7],
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
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    range: [4, 5],
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
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    range: [6, 7],
                    loc: {
                      start: {
                        line: 1,
                        column: 6
                      },
                      end: {
                        line: 1,
                        column: 7
                      }
                    },
                    name: 'c'
                  }
                }
              },
              operator: '&&',
              right: {
                type: 'AssignmentExpression',
                start: 11,
                end: 14,
                range: [11, 14],
                loc: {
                  start: {
                    line: 1,
                    column: 11
                  },
                  end: {
                    line: 1,
                    column: 14
                  }
                },
                operator: '=',
                left: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
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
                  name: 'd'
                },
                right: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  range: [13, 14],
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
                  name: 'e'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `x = {...y, b}`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 13,
        range: [0, 13],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 13
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 13
              }
            },
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 13
                }
              },
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 1
                  }
                },
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 13,
                range: [4, 13],
                loc: {
                  start: {
                    line: 1,
                    column: 4
                  },
                  end: {
                    line: 1,
                    column: 13
                  }
                },
                properties: [
                  {
                    type: 'SpreadElement',
                    start: 5,
                    end: 9,
                    range: [5, 9],
                    loc: {
                      start: {
                        line: 1,
                        column: 5
                      },
                      end: {
                        line: 1,
                        column: 9
                      }
                    },
                    argument: {
                      type: 'Identifier',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      loc: {
                        start: {
                          line: 1,
                          column: 8
                        },
                        end: {
                          line: 1,
                          column: 9
                        }
                      },
                      name: 'y'
                    }
                  },
                  {
                    type: 'Property',
                    start: 11,
                    end: 12,
                    range: [11, 12],
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
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
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
                      name: 'b'
                    },
                    kind: 'init',
                    value: {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
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
                      name: 'b'
                    }
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
      `x = {...[a, b]}`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
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
            range: [0, 15],
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
              start: 0,
              end: 15,
              range: [0, 15],
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
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 1
                  }
                },
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 15,
                range: [4, 15],
                loc: {
                  start: {
                    line: 1,
                    column: 4
                  },
                  end: {
                    line: 1,
                    column: 15
                  }
                },
                properties: [
                  {
                    type: 'SpreadElement',
                    start: 5,
                    end: 14,
                    range: [5, 14],
                    loc: {
                      start: {
                        line: 1,
                        column: 5
                      },
                      end: {
                        line: 1,
                        column: 14
                      }
                    },
                    argument: {
                      type: 'ArrayExpression',
                      start: 8,
                      end: 14,
                      range: [8, 14],
                      loc: {
                        start: {
                          line: 1,
                          column: 8
                        },
                        end: {
                          line: 1,
                          column: 14
                        }
                      },
                      elements: [
                        {
                          type: 'Identifier',
                          start: 9,
                          end: 10,
                          range: [9, 10],
                          loc: {
                            start: {
                              line: 1,
                              column: 9
                            },
                            end: {
                              line: 1,
                              column: 10
                            }
                          },
                          name: 'a'
                        },
                        {
                          type: 'Identifier',
                          start: 12,
                          end: 13,
                          range: [12, 13],
                          loc: {
                            start: {
                              line: 1,
                              column: 12
                            },
                            end: {
                              line: 1,
                              column: 13
                            }
                          },
                          name: 'b'
                        }
                      ]
                    }
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
      `[,]`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 3,
        range: [0, 3],
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
            range: [0, 3],
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
              type: 'ArrayExpression',
              start: 0,
              end: 3,
              range: [0, 3],
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
              elements: [null]
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);

  it('Miscellaneous - loc (different line endings)', () => {
    const sourceLF =
      '// Single line comment\n// Single line comment\n// Single line comment\n// Single line comment\nfunction handleAutocomplete() {\n   var prp = this.props; // some error here\n\n   for(let xa=0; xa<100; xa++) {;}\n   }';
    const sourceCRLF = sourceLF.replace(/\n/g, '\r\n');
    t.deepEqual(
      parse(sourceLF, {
        loc: true
      }),
      parse(sourceCRLF, {
        loc: true
      })
    );
  });
});
