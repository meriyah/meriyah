import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Miscellaneous - CRLF', () => {
  pass('Miscellaneous - CRLF (pass)', [
    [
      `
      // Single line comment
      // Single line comment
      function handleAutocomplete() {}`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        body: [
          {
            async: false,
            body: {
              body: [],
              end: 97,
              loc: {
                end: {
                  column: 38,
                  line: 4
                },
                start: {
                  column: 36,
                  line: 4
                }
              },
              start: 95,
              type: 'BlockStatement'
            },
            end: 97,
            generator: false,
            id: {
              end: 92,
              loc: {
                end: {
                  column: 33,
                  line: 4
                },
                start: {
                  column: 15,
                  line: 4
                }
              },
              name: 'handleAutocomplete',
              start: 74,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 38,
                line: 4
              },
              start: {
                column: 6,
                line: 4
              }
            },
            params: [],
            start: 65,
            type: 'FunctionDeclaration'
          }
        ],
        end: 97,
        loc: {
          end: {
            column: 38,
            line: 4
          },
          start: {
            column: 0,
            line: 1
          }
        },
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      `// Single line comment
    // Single line comment
    // Single line comment
    // Single line comment
    // Single line comment
    // Single line comment
    // Single line comment
    // Single line comment
    // Single line comment
    // Single line comment`,
      Context.OptionsRanges | Context.OptionsLoc,
      {
        body: [],
        end: 265,
        loc: {
          end: {
            column: 26,
            line: 10
          },
          start: {
            column: 0,
            line: 1
          }
        },
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      '\nx =\n\r\n\r this\r\r\n\n\n\r',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        body: [
          {
            end: 13,
            expression: {
              end: 13,
              left: {
                end: 2,
                loc: {
                  end: {
                    column: 1,
                    line: 2
                  },
                  start: {
                    column: 0,
                    line: 2
                  }
                },
                name: 'x',
                start: 1,
                type: 'Identifier'
              },
              loc: {
                end: {
                  column: 5,
                  line: 5
                },
                start: {
                  column: 0,
                  line: 2
                }
              },
              operator: '=',
              right: {
                end: 13,
                loc: {
                  end: {
                    column: 5,
                    line: 5
                  },
                  start: {
                    column: 1,
                    line: 5
                  }
                },
                start: 9,
                type: 'ThisExpression'
              },
              start: 1,
              type: 'AssignmentExpression'
            },
            loc: {
              end: {
                column: 5,
                line: 5
              },
              start: {
                column: 0,
                line: 2
              }
            },
            start: 1,
            type: 'ExpressionStatement'
          }
        ],
        end: 19,
        loc: {
          end: {
            column: 0,
            line: 10
          },
          start: {
            column: 0,
            line: 1
          }
        },
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      '\n\r\r\n\n\nline\n\n\r\n\r\r\n\r\r\rthis\n\n\t\t\n\v\n\n\r\r\r\r\r\r\r\r',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        body: [
          {
            end: 10,
            expression: {
              end: 10,
              loc: {
                end: {
                  column: 4,
                  line: 6
                },
                start: {
                  column: 0,
                  line: 6
                }
              },
              name: 'line',
              start: 6,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 4,
                line: 6
              },
              start: {
                column: 0,
                line: 6
              }
            },
            start: 6,
            type: 'ExpressionStatement'
          },
          {
            end: 24,
            expression: {
              end: 24,
              loc: {
                end: {
                  column: 4,
                  line: 14
                },
                start: {
                  column: 0,
                  line: 14
                }
              },
              start: 20,
              type: 'ThisExpression'
            },
            loc: {
              end: {
                column: 4,
                line: 14
              },
              start: {
                column: 0,
                line: 14
              }
            },
            start: 20,
            type: 'ExpressionStatement'
          }
        ],
        end: 40,
        loc: {
          end: {
            column: 0,
            line: 27
          },
          start: {
            column: 0,
            line: 1
          }
        },
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      '\n\n\n\n\n\n\n\n\r\r\r\r\r\r\r\rthis\n\n\n\n\n\n\n\n\r\r\r\r\r\r\r\r',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        body: [
          {
            end: 20,
            expression: {
              end: 20,
              loc: {
                end: {
                  column: 4,
                  line: 17
                },
                start: {
                  column: 0,
                  line: 17
                }
              },
              start: 16,
              type: 'ThisExpression'
            },
            loc: {
              end: {
                column: 4,
                line: 17
              },
              start: {
                column: 0,
                line: 17
              }
            },
            start: 16,
            type: 'ExpressionStatement'
          }
        ],
        end: 36,
        loc: {
          end: {
            column: 0,
            line: 33
          },
          start: {
            column: 0,
            line: 1
          }
        },
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'this\n\n\r\r;\n\nf\r\ro\r\no',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        body: [
          {
            end: 9,
            expression: {
              end: 4,
              loc: {
                end: {
                  column: 4,
                  line: 1
                },
                start: {
                  column: 0,
                  line: 1
                }
              },
              start: 0,
              type: 'ThisExpression'
            },
            loc: {
              end: {
                column: 1,
                line: 5
              },
              start: {
                column: 0,
                line: 1
              }
            },
            start: 0,
            type: 'ExpressionStatement'
          },
          {
            end: 12,
            expression: {
              end: 12,
              loc: {
                end: {
                  column: 1,
                  line: 7
                },
                start: {
                  column: 0,
                  line: 7
                }
              },
              name: 'f',
              start: 11,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 1,
                line: 7
              },
              start: {
                column: 0,
                line: 7
              }
            },
            start: 11,
            type: 'ExpressionStatement'
          },
          {
            end: 15,
            expression: {
              end: 15,
              loc: {
                end: {
                  column: 1,
                  line: 9
                },
                start: {
                  column: 0,
                  line: 9
                }
              },
              name: 'o',
              start: 14,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 1,
                line: 9
              },
              start: {
                column: 0,
                line: 9
              }
            },
            start: 14,
            type: 'ExpressionStatement'
          },
          {
            end: 18,
            expression: {
              end: 18,
              loc: {
                end: {
                  column: 1,
                  line: 10
                },
                start: {
                  column: 0,
                  line: 10
                }
              },
              name: 'o',
              start: 17,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 1,
                line: 10
              },
              start: {
                column: 0,
                line: 10
              }
            },
            start: 17,
            type: 'ExpressionStatement'
          }
        ],
        end: 18,
        loc: {
          end: {
            column: 1,
            line: 10
          },
          start: {
            column: 0,
            line: 1
          }
        },
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'a\n\n\r\rb\n\nc\r\re\r\n',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        body: [
          {
            end: 1,
            expression: {
              end: 1,
              loc: {
                end: {
                  column: 1,
                  line: 1
                },
                start: {
                  column: 0,
                  line: 1
                }
              },
              name: 'a',
              start: 0,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 1,
                line: 1
              },
              start: {
                column: 0,
                line: 1
              }
            },
            start: 0,
            type: 'ExpressionStatement'
          },
          {
            end: 6,
            expression: {
              end: 6,
              loc: {
                end: {
                  column: 1,
                  line: 5
                },
                start: {
                  column: 0,
                  line: 5
                }
              },
              name: 'b',
              start: 5,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 1,
                line: 5
              },
              start: {
                column: 0,
                line: 5
              }
            },
            start: 5,
            type: 'ExpressionStatement'
          },
          {
            end: 9,
            expression: {
              end: 9,
              loc: {
                end: {
                  column: 1,
                  line: 7
                },
                start: {
                  column: 0,
                  line: 7
                }
              },
              name: 'c',
              start: 8,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 1,
                line: 7
              },
              start: {
                column: 0,
                line: 7
              }
            },
            start: 8,
            type: 'ExpressionStatement'
          },
          {
            end: 12,
            expression: {
              end: 12,
              loc: {
                end: {
                  column: 1,
                  line: 9
                },
                start: {
                  column: 0,
                  line: 9
                }
              },
              name: 'e',
              start: 11,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 1,
                line: 9
              },
              start: {
                column: 0,
                line: 9
              }
            },
            start: 11,
            type: 'ExpressionStatement'
          }
        ],
        end: 14,
        loc: {
          end: {
            column: 0,
            line: 10
          },
          start: {
            column: 0,
            line: 1
          }
        },
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ]
    /*[
      "a\n\n\r\rb\n\nc\r\re\r\n",
      Context.None,
      {
      }
    ],*/
  ]);
});
