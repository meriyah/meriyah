import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - JSX', () => {
  for (const arg of [
    '<Component {...x}></Component>;',
    '<Component.Test />;',
    '<div>{...this.props.children}</div>;',
    '{foo && <Something foo={foo} /> }',
    '<Component:Test />;',
    '<Component.Test />;',
    `<></>;

    <
    >
      text
    </>;`,
    '<div>{this.props.children}</div>;',
    '<a>{}</a>;',
    '<p>{1/2}</p>',
    '<p>{/w/.test(s)}</p>'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsJSX);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsJSX);
      });
    });
  }

  fail('Miscellaneous - JSX (fail)', [
    ['<', Context.None],
    ['<foo', Context.None],
    ['>', Context.None],
    ['<>', Context.None],
    ['< >', Context.None],
    ['</>', Context.None],
    ['<><//>', Context.None],
    ['<', Context.OptionsJSX],
    ['>', Context.OptionsJSX],
    ['<>', Context.OptionsJSX],
    ['< >', Context.OptionsJSX],
    ['</>', Context.OptionsJSX],
    ['<><//>', Context.OptionsJSX],
    ['<p>', Context.OptionsJSX],
    ['<p></q>', Context.OptionsJSX],
    ['<p></>', Context.OptionsJSX],
    ['<p><q></p>', Context.OptionsJSX],
    ['<1/>', Context.OptionsJSX],
    [`<div id={}></div>`, Context.OptionsJSX],
    ['<div>one</div><div>two</div>', Context.OptionsJSX],
    ['</>', Context.OptionsJSX],
    ['<a/!', Context.OptionsJSX],
    ['<img src={}>', Context.OptionsJSX],
    ['<a b=: />', Context.OptionsJSX],
    ['<xyz. />', Context.OptionsJSX],
    ['<.abc />', Context.OptionsJSX],
    ['<Foo></Bar>', Context.OptionsJSX],
    ['<dd><e></e></dddd>;', Context.OptionsJSX],
    ['<{...b} {...a }>{...b}</{...b}>', Context.OptionsJSX],
    ['<f><g/></ff>;', Context.OptionsJSX],
    ['<:path />', Context.OptionsJSX],
    ['<path></svg:path>', Context.OptionsJSX],
    ['<foo.bar></foo.baz>', Context.OptionsJSX],
    ['<chinese:alladinfoo.bar></foo.baz>', Context.OptionsJSX],
    ['<foo:bar></foo.baz>', Context.OptionsJSX],
    ['<foo:bar.baz></foo.baz:bar>', Context.OptionsJSX],
    ['<foo.bar></foo.baz>', Context.OptionsJSX],
    ['var x = <div>one</div> /* intervening comment */ <div>two</div>;', Context.OptionsJSX],
    ['<tag className=></tag>', Context.OptionsJSX],
    ['<tag ${"className"}="tag"></tag>', Context.OptionsJSX],
    ['<a: />;', Context.OptionsJSX],
    ['<:a />;', Context.OptionsJSX],
    ['<a></b>', Context.OptionsJSX],
    ['<a foo="bar;', Context.OptionsJSX],
    ['<a:b></b>;', Context.OptionsJSX],
    ['<a.b:c></a.b:c>;', Context.OptionsJSX],
    ['<a[foo]></a[foo]>;', Context.OptionsJSX],
    ['<a["foo"]></a["foo"]>;', Context.OptionsJSX],
    ['<a b={}>;', Context.OptionsJSX],
    ['var x = <div>one</div><div>two</div>;', Context.OptionsJSX],
    ['<div {props} />;', Context.OptionsJSX],
    ['<div {...props}>stuff</div {...props}>;', Context.OptionsJSX],
    ['<a>></a>;', Context.OptionsJSX],
    ['<a b=}>;', Context.OptionsJSX],
    [' > ;', Context.OptionsJSX],
    ['<a>;</>;', Context.OptionsJSX],
    ['<a b></b>;', Context.OptionsJSX],
    ['<a.b.c></a>;', Context.OptionsJSX],
    [' < .a > ;', Context.OptionsJSX],
    ['a > ;', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['<.a></.a>', Context.OptionsJSX],
    ['<a.></a.>', Context.OptionsJSX],
    ['<div className"app">', Context.OptionsJSX],
    ['<div {props} />', Context.OptionsJSX],
    ['<a>></a>', Context.OptionsJSX],
    ['<div {...props}>stuff</div {...props}>', Context.OptionsJSX],
    ['<a><</a>', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['var x = <div>one</div>, <div>two</div>;', Context.OptionsJSX],
    ['<p>{/}</p>', Context.OptionsJSX],
    ['<div=""></div>', Context.OptionsJSX],
    ['<div =""></div>', Context.OptionsJSX],
    ['<div=1></div>', Context.OptionsJSX],
    ['<div=div></div>', Context.OptionsJSX],
    ['<div=/>', Context.OptionsJSX],
    ['<div=-/>', Context.OptionsJSX],
    ['<div=/>', Context.OptionsJSX],
    ['<div =/>', Context.OptionsJSX],
    ['<div=+-%&([)]}.../>', Context.OptionsJSX]
  ]);

  pass('Miscellaneous - JSX (pass)', [
    [
      `<!--ccc-->`,
      Context.OptionsJSX,
      {
        body: [],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class Columns extends React.Component {
        render() {
          return (
            <>
              <td>Hello</td>
              <td>World</td>
            </>
          );
        }
      }`,
      Context.OptionsJSX | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Columns',
              start: 6,
              end: 13,
              range: [6, 13],
              loc: {
                start: {
                  column: 6,
                  line: 1
                },
                end: {
                  column: 13,
                  line: 1
                }
              }
            },
            superClass: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'React',
                start: 22,
                end: 27,
                range: [22, 27],
                loc: {
                  start: {
                    column: 22,
                    line: 1
                  },
                  end: {
                    column: 27,
                    line: 1
                  }
                }
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'Component',
                start: 28,
                end: 37,
                range: [28, 37],
                loc: {
                  start: {
                    column: 28,
                    line: 1
                  },
                  end: {
                    column: 37,
                    line: 1
                  }
                }
              },
              start: 22,
              end: 37,
              range: [22, 37],
              loc: {
                start: {
                  column: 22,
                  line: 1
                },
                end: {
                  column: 37,
                  line: 1
                }
              }
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'render',
                    start: 48,
                    end: 54,
                    range: [48, 54],
                    loc: {
                      start: {
                        column: 8,
                        line: 2
                      },
                      end: {
                        column: 14,
                        line: 2
                      }
                    }
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'JSXFragment',
                            children: [
                              {
                                type: 'JSXText',
                                value: '\n              ',
                                start: 92,
                                end: 107,
                                range: [92, 107],
                                loc: {
                                  start: {
                                    column: 14,
                                    line: 4
                                  },
                                  end: {
                                    column: 14,
                                    line: 5
                                  }
                                }
                              },
                              {
                                type: 'JSXElement',
                                children: [
                                  {
                                    type: 'JSXText',
                                    value: 'Hello',
                                    start: 111,
                                    end: 116,
                                    range: [111, 116],
                                    loc: {
                                      start: {
                                        column: 18,
                                        line: 5
                                      },
                                      end: {
                                        column: 23,
                                        line: 5
                                      }
                                    }
                                  }
                                ],
                                openingElement: {
                                  type: 'JSXOpeningElement',
                                  name: {
                                    type: 'JSXIdentifier',
                                    name: 'td',
                                    start: 108,
                                    end: 110,
                                    range: [108, 110],
                                    loc: {
                                      start: {
                                        column: 15,
                                        line: 5
                                      },
                                      end: {
                                        column: 17,
                                        line: 5
                                      }
                                    }
                                  },
                                  attributes: [],
                                  selfClosing: false,
                                  start: 107,
                                  end: 111,
                                  range: [107, 111],
                                  loc: {
                                    start: {
                                      column: 14,
                                      line: 5
                                    },
                                    end: {
                                      column: 18,
                                      line: 5
                                    }
                                  }
                                },
                                closingElement: {
                                  type: 'JSXClosingElement',
                                  name: {
                                    type: 'JSXIdentifier',
                                    name: 'td',
                                    start: 118,
                                    end: 120,
                                    range: [118, 120],
                                    loc: {
                                      start: {
                                        column: 25,
                                        line: 5
                                      },
                                      end: {
                                        column: 27,
                                        line: 5
                                      }
                                    }
                                  },
                                  start: 116,
                                  end: 121,
                                  range: [116, 121],
                                  loc: {
                                    start: {
                                      column: 23,
                                      line: 5
                                    },
                                    end: {
                                      column: 28,
                                      line: 5
                                    }
                                  }
                                },
                                start: 107,
                                end: 121,
                                range: [107, 121],
                                loc: {
                                  start: {
                                    column: 14,
                                    line: 5
                                  },
                                  end: {
                                    column: 28,
                                    line: 5
                                  }
                                }
                              },
                              {
                                type: 'JSXText',
                                value: '\n              ',
                                start: 121,
                                end: 136,
                                range: [121, 136],
                                loc: {
                                  start: {
                                    column: 28,
                                    line: 5
                                  },
                                  end: {
                                    column: 14,
                                    line: 6
                                  }
                                }
                              },
                              {
                                type: 'JSXElement',
                                children: [
                                  {
                                    type: 'JSXText',
                                    value: 'World',
                                    start: 140,
                                    end: 145,
                                    range: [140, 145],
                                    loc: {
                                      start: {
                                        column: 18,
                                        line: 6
                                      },
                                      end: {
                                        column: 23,
                                        line: 6
                                      }
                                    }
                                  }
                                ],
                                openingElement: {
                                  type: 'JSXOpeningElement',
                                  name: {
                                    type: 'JSXIdentifier',
                                    name: 'td',
                                    start: 137,
                                    end: 139,
                                    range: [137, 139],
                                    loc: {
                                      start: {
                                        column: 15,
                                        line: 6
                                      },
                                      end: {
                                        column: 17,
                                        line: 6
                                      }
                                    }
                                  },
                                  attributes: [],
                                  selfClosing: false,
                                  start: 136,
                                  end: 140,
                                  range: [136, 140],
                                  loc: {
                                    start: {
                                      column: 14,
                                      line: 6
                                    },
                                    end: {
                                      column: 18,
                                      line: 6
                                    }
                                  }
                                },
                                closingElement: {
                                  type: 'JSXClosingElement',
                                  name: {
                                    type: 'JSXIdentifier',
                                    name: 'td',
                                    start: 147,
                                    end: 149,
                                    range: [147, 149],
                                    loc: {
                                      start: {
                                        column: 25,
                                        line: 6
                                      },
                                      end: {
                                        column: 27,
                                        line: 6
                                      }
                                    }
                                  },
                                  start: 145,
                                  end: 150,
                                  range: [145, 150],
                                  loc: {
                                    start: {
                                      column: 23,
                                      line: 6
                                    },
                                    end: {
                                      column: 28,
                                      line: 6
                                    }
                                  }
                                },
                                start: 136,
                                end: 150,
                                range: [136, 150],
                                loc: {
                                  start: {
                                    column: 14,
                                    line: 6
                                  },
                                  end: {
                                    column: 28,
                                    line: 6
                                  }
                                }
                              },
                              {
                                type: 'JSXText',
                                value: '\n            ',
                                start: 150,
                                end: 163,
                                range: [150, 163],
                                loc: {
                                  start: {
                                    column: 28,
                                    line: 6
                                  },
                                  end: {
                                    column: 12,
                                    line: 7
                                  }
                                }
                              }
                            ],
                            openingFragment: {
                              type: 'JSXOpeningFragment',
                              start: 90,
                              end: 92,
                              range: [90, 92],
                              loc: {
                                start: {
                                  column: 12,
                                  line: 4
                                },
                                end: {
                                  column: 14,
                                  line: 4
                                }
                              }
                            },
                            closingFragment: {
                              type: 'JSXClosingFragment',
                              start: 163,
                              end: 166,
                              range: [163, 166],
                              loc: {
                                start: {
                                  column: 12,
                                  line: 7
                                },
                                end: {
                                  column: 15,
                                  line: 7
                                }
                              }
                            },
                            start: 90,
                            end: 166,
                            range: [90, 166],
                            loc: {
                              start: {
                                column: 12,
                                line: 4
                              },
                              end: {
                                column: 15,
                                line: 7
                              }
                            }
                          },
                          start: 69,
                          end: 179,
                          range: [69, 179],
                          loc: {
                            start: {
                              column: 10,
                              line: 3
                            },
                            end: {
                              column: 12,
                              line: 8
                            }
                          }
                        }
                      ],
                      start: 57,
                      end: 189,
                      range: [57, 189],
                      loc: {
                        start: {
                          column: 17,
                          line: 2
                        },
                        end: {
                          column: 9,
                          line: 9
                        }
                      }
                    },
                    async: false,
                    generator: false,
                    id: null,
                    start: 54,
                    end: 189,
                    range: [54, 189],
                    loc: {
                      start: {
                        column: 14,
                        line: 2
                      },
                      end: {
                        column: 9,
                        line: 9
                      }
                    }
                  },
                  start: 48,
                  end: 189,
                  range: [48, 189],
                  loc: {
                    start: {
                      column: 8,
                      line: 2
                    },
                    end: {
                      column: 9,
                      line: 9
                    }
                  }
                }
              ],
              start: 38,
              end: 197,
              range: [38, 197],
              loc: {
                start: {
                  column: 38,
                  line: 1
                },
                end: {
                  column: 7,
                  line: 10
                }
              }
            },
            start: 0,
            end: 197,
            range: [0, 197],
            loc: {
              start: {
                column: 0,
                line: 1
              },
              end: {
                column: 7,
                line: 10
              }
            }
          }
        ],
        start: 0,
        end: 197,
        range: [0, 197],
        loc: {
          start: {
            column: 0,
            line: 1
          },
          end: {
            column: 7,
            line: 10
          }
        }
      }
    ],
    [
      `<div>{111}</div>`,
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 16,
              range: [0, 16],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 5,
                range: [0, 5],
                attributes: [],
                name: {
                  type: 'JSXIdentifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'div'
                },
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                start: 10,
                end: 16,
                range: [10, 16],
                name: {
                  type: 'JSXIdentifier',
                  start: 12,
                  end: 15,
                  range: [12, 15],
                  name: 'div'
                }
              },
              children: [
                {
                  type: 'JSXExpressionContainer',
                  start: 5,
                  end: 10,
                  range: [5, 10],
                  expression: {
                    type: 'Literal',
                    start: 6,
                    end: 9,
                    range: [6, 9],
                    value: 111
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
      `<div></div>`,
      Context.OptionsJSX | Context.OptionsRanges,
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
              type: 'JSXElement',
              start: 0,
              end: 11,
              range: [0, 11],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 5,
                range: [0, 5],
                attributes: [],
                name: {
                  type: 'JSXIdentifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'div'
                },
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                start: 5,
                end: 11,
                range: [5, 11],
                name: {
                  type: 'JSXIdentifier',
                  start: 7,
                  end: 10,
                  range: [7, 10],
                  name: 'div'
                }
              },
              children: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `<div {...[<div/>]} />`,
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        range: [0, 21],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 21,
            range: [0, 21],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 21,
              range: [0, 21],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 21,
                range: [0, 21],
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    start: 5,
                    end: 18,
                    range: [5, 18],
                    argument: {
                      type: 'ArrayExpression',
                      start: 9,
                      end: 17,
                      range: [9, 17],
                      elements: [
                        {
                          type: 'JSXElement',
                          start: 10,
                          end: 16,
                          range: [10, 16],
                          openingElement: {
                            type: 'JSXOpeningElement',
                            start: 10,
                            end: 16,
                            range: [10, 16],
                            attributes: [],
                            name: {
                              type: 'JSXIdentifier',
                              start: 11,
                              end: 14,
                              range: [11, 14],
                              name: 'div'
                            },
                            selfClosing: true
                          },
                          closingElement: null,
                          children: []
                        }
                      ]
                    }
                  }
                ],
                name: {
                  type: 'JSXIdentifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'div'
                },
                selfClosing: true
              },
              closingElement: null,
              children: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `<div >{111}</div>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Literal',
                    value: 111
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<div >xxx{111}xxx{222}</div>`,
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        range: [0, 28],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 28,
            range: [0, 28],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 28,
              range: [0, 28],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 6,
                range: [0, 6],
                attributes: [],
                name: {
                  type: 'JSXIdentifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'div'
                },
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                start: 22,
                end: 28,
                range: [22, 28],
                name: {
                  type: 'JSXIdentifier',
                  start: 24,
                  end: 27,
                  range: [24, 27],
                  name: 'div'
                }
              },
              children: [
                {
                  type: 'JSXText',
                  start: 6,
                  end: 9,
                  range: [6, 9],
                  value: 'xxx'
                },
                {
                  type: 'JSXExpressionContainer',
                  start: 9,
                  end: 14,
                  range: [9, 14],
                  expression: {
                    type: 'Literal',
                    start: 10,
                    end: 13,
                    range: [10, 13],
                    value: 111
                  }
                },
                {
                  type: 'JSXText',
                  start: 14,
                  end: 17,
                  range: [14, 17],
                  value: 'xxx'
                },
                {
                  type: 'JSXExpressionContainer',
                  start: 17,
                  end: 22,
                  range: [17, 22],
                  expression: {
                    type: 'Literal',
                    start: 18,
                    end: 21,
                    range: [18, 21],
                    value: 222
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
      `<div >xxx{function(){return <div id={aaa}>111</div>}}xxx{222}</div>`,
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 67,
        range: [0, 67],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 67,
            range: [0, 67],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 67,
              range: [0, 67],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 6,
                range: [0, 6],
                attributes: [],
                name: {
                  type: 'JSXIdentifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'div'
                },
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                start: 61,
                end: 67,
                range: [61, 67],
                name: {
                  type: 'JSXIdentifier',
                  start: 63,
                  end: 66,
                  range: [63, 66],
                  name: 'div'
                }
              },
              children: [
                {
                  type: 'JSXText',
                  start: 6,
                  end: 9,
                  range: [6, 9],
                  value: 'xxx'
                },
                {
                  type: 'JSXExpressionContainer',
                  start: 9,
                  end: 53,
                  range: [9, 53],
                  expression: {
                    type: 'FunctionExpression',
                    start: 10,
                    end: 52,
                    range: [10, 52],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 20,
                      end: 52,
                      range: [20, 52],
                      body: [
                        {
                          type: 'ReturnStatement',
                          start: 21,
                          end: 51,
                          range: [21, 51],
                          argument: {
                            type: 'JSXElement',
                            start: 28,
                            end: 51,
                            range: [28, 51],
                            openingElement: {
                              type: 'JSXOpeningElement',
                              start: 28,
                              end: 42,
                              range: [28, 42],
                              attributes: [
                                {
                                  type: 'JSXAttribute',
                                  start: 33,
                                  end: 41,
                                  range: [33, 41],
                                  name: {
                                    type: 'JSXIdentifier',
                                    start: 33,
                                    end: 35,
                                    range: [33, 35],
                                    name: 'id'
                                  },
                                  value: {
                                    type: 'JSXExpressionContainer',
                                    start: 36,
                                    end: 41,
                                    range: [36, 41],
                                    expression: {
                                      type: 'Identifier',
                                      start: 37,
                                      end: 40,
                                      range: [37, 40],
                                      name: 'aaa'
                                    }
                                  }
                                }
                              ],
                              name: {
                                type: 'JSXIdentifier',
                                start: 29,
                                end: 32,
                                range: [29, 32],
                                name: 'div'
                              },
                              selfClosing: false
                            },
                            closingElement: {
                              type: 'JSXClosingElement',
                              start: 45,
                              end: 51,
                              range: [45, 51],
                              name: {
                                type: 'JSXIdentifier',
                                start: 47,
                                end: 50,
                                range: [47, 50],
                                name: 'div'
                              }
                            },
                            children: [
                              {
                                type: 'JSXText',
                                start: 42,
                                end: 45,
                                range: [42, 45],
                                value: '111'
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  type: 'JSXText',
                  start: 53,
                  end: 56,
                  range: [53, 56],
                  value: 'xxx'
                },
                {
                  type: 'JSXExpressionContainer',
                  start: 56,
                  end: 61,
                  range: [56, 61],
                  expression: {
                    type: 'Literal',
                    start: 57,
                    end: 60,
                    range: [57, 60],
                    value: 222
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
      `<ul><li>111</li><li>222</li><li>333</li><li>444</li></ul>`,
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 57,
        range: [0, 57],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 57,
            range: [0, 57],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 57,
              range: [0, 57],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 4,
                range: [0, 4],
                attributes: [],
                name: {
                  type: 'JSXIdentifier',
                  start: 1,
                  end: 3,
                  range: [1, 3],
                  name: 'ul'
                },
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                start: 52,
                end: 57,
                range: [52, 57],
                name: {
                  type: 'JSXIdentifier',
                  start: 54,
                  end: 56,
                  range: [54, 56],
                  name: 'ul'
                }
              },
              children: [
                {
                  type: 'JSXElement',
                  start: 4,
                  end: 16,
                  range: [4, 16],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    start: 4,
                    end: 8,
                    range: [4, 8],
                    attributes: [],
                    name: {
                      type: 'JSXIdentifier',
                      start: 5,
                      end: 7,
                      range: [5, 7],
                      name: 'li'
                    },
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    start: 11,
                    end: 16,
                    range: [11, 16],
                    name: {
                      type: 'JSXIdentifier',
                      start: 13,
                      end: 15,
                      range: [13, 15],
                      name: 'li'
                    }
                  },
                  children: [
                    {
                      type: 'JSXText',
                      start: 8,
                      end: 11,
                      range: [8, 11],
                      value: '111'
                    }
                  ]
                },
                {
                  type: 'JSXElement',
                  start: 16,
                  end: 28,
                  range: [16, 28],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    start: 16,
                    end: 20,
                    range: [16, 20],
                    attributes: [],
                    name: {
                      type: 'JSXIdentifier',
                      start: 17,
                      end: 19,
                      range: [17, 19],
                      name: 'li'
                    },
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    start: 23,
                    end: 28,
                    range: [23, 28],
                    name: {
                      type: 'JSXIdentifier',
                      start: 25,
                      end: 27,
                      range: [25, 27],
                      name: 'li'
                    }
                  },
                  children: [
                    {
                      type: 'JSXText',
                      start: 20,
                      end: 23,
                      range: [20, 23],
                      value: '222'
                    }
                  ]
                },
                {
                  type: 'JSXElement',
                  start: 28,
                  end: 40,
                  range: [28, 40],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    start: 28,
                    end: 32,
                    range: [28, 32],
                    attributes: [],
                    name: {
                      type: 'JSXIdentifier',
                      start: 29,
                      end: 31,
                      range: [29, 31],
                      name: 'li'
                    },
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    start: 35,
                    end: 40,
                    range: [35, 40],
                    name: {
                      type: 'JSXIdentifier',
                      start: 37,
                      end: 39,
                      range: [37, 39],
                      name: 'li'
                    }
                  },
                  children: [
                    {
                      type: 'JSXText',
                      start: 32,
                      end: 35,
                      range: [32, 35],
                      value: '333'
                    }
                  ]
                },
                {
                  type: 'JSXElement',
                  start: 40,
                  end: 52,
                  range: [40, 52],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    start: 40,
                    end: 44,
                    range: [40, 44],
                    attributes: [],
                    name: {
                      type: 'JSXIdentifier',
                      start: 41,
                      end: 43,
                      range: [41, 43],
                      name: 'li'
                    },
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    start: 47,
                    end: 52,
                    range: [47, 52],
                    name: {
                      type: 'JSXIdentifier',
                      start: 49,
                      end: 51,
                      range: [49, 51],
                      name: 'li'
                    }
                  },
                  children: [
                    {
                      type: 'JSXText',
                      start: 44,
                      end: 47,
                      range: [44, 47],
                      value: '444'
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
      `<div id="复杂结构">xxx{function(){return <div id={aaa}>111</div>}}xxx{222}</div>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: 'xxx'
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'JSXElement',
                            children: [
                              {
                                type: 'JSXText',
                                value: '111'
                              }
                            ],
                            openingElement: {
                              type: 'JSXOpeningElement',
                              name: {
                                type: 'JSXIdentifier',
                                name: 'div'
                              },
                              attributes: [
                                {
                                  type: 'JSXAttribute',
                                  value: {
                                    type: 'JSXExpressionContainer',
                                    expression: {
                                      type: 'Identifier',
                                      name: 'aaa'
                                    }
                                  },
                                  name: {
                                    type: 'JSXIdentifier',
                                    name: 'id'
                                  }
                                }
                              ],
                              selfClosing: false
                            },
                            closingElement: {
                              type: 'JSXClosingElement',
                              name: {
                                type: 'JSXIdentifier',
                                name: 'div'
                              }
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'JSXText',
                  value: 'xxx'
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Literal',
                    value: 222
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: '复杂结构'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'id'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<ul>  <li>  </li> <li>x</li> </ul>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '  '
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '  '
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'li'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'li'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: ' '
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'x'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'li'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'li'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: ' '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'ul'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'ul'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<option><b>dddd</b><script>333</script><xmp>eee</xmp><template>eeeee</template></option>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'dddd'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'b'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'b'
                    }
                  }
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '333'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'script'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'script'
                    }
                  }
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'eee'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'xmp'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'xmp'
                    }
                  }
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'eeeee'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'template'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'template'
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'option'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'option'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<div id={aa} class="className" > t </div>`,
      Context.OptionsJSX | Context.OptionsRanges | Context.OptionsLoc | Context.OptionsRaw,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: ' t ',
                  raw: ' t ',
                  start: 32,
                  end: 35,
                  range: [32, 35],
                  loc: {
                    start: {
                      line: 1,
                      column: 32
                    },
                    end: {
                      line: 1,
                      column: 35
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div',
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
                  }
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Identifier',
                        name: 'aa',
                        start: 9,
                        end: 11,
                        range: [9, 11],
                        loc: {
                          start: {
                            line: 1,
                            column: 9
                          },
                          end: {
                            line: 1,
                            column: 11
                          }
                        }
                      },
                      start: 8,
                      end: 12,
                      range: [8, 12],
                      loc: {
                        start: {
                          line: 1,
                          column: 8
                        },
                        end: {
                          line: 1,
                          column: 12
                        }
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'id',
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
                      }
                    },
                    start: 5,
                    end: 12,
                    range: [5, 12],
                    loc: {
                      start: {
                        line: 1,
                        column: 5
                      },
                      end: {
                        line: 1,
                        column: 12
                      }
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: 'className',
                      raw: '"className"',
                      start: 19,
                      end: 30,
                      range: [19, 30],
                      loc: {
                        start: {
                          line: 1,
                          column: 19
                        },
                        end: {
                          line: 1,
                          column: 30
                        }
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'class',
                      start: 13,
                      end: 18,
                      range: [13, 18],
                      loc: {
                        start: {
                          line: 1,
                          column: 13
                        },
                        end: {
                          line: 1,
                          column: 18
                        }
                      }
                    },
                    start: 13,
                    end: 30,
                    range: [13, 30],
                    loc: {
                      start: {
                        line: 1,
                        column: 13
                      },
                      end: {
                        line: 1,
                        column: 30
                      }
                    }
                  }
                ],
                selfClosing: false,
                start: 0,
                end: 32,
                range: [0, 32],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 32
                  }
                }
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div',
                  start: 37,
                  end: 40,
                  range: [37, 40],
                  loc: {
                    start: {
                      line: 1,
                      column: 37
                    },
                    end: {
                      line: 1,
                      column: 40
                    }
                  }
                },
                start: 35,
                end: 41,
                range: [35, 41],
                loc: {
                  start: {
                    line: 1,
                    column: 35
                  },
                  end: {
                    line: 1,
                    column: 41
                  }
                }
              },
              start: 0,
              end: 41,
              range: [0, 41],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 41
                }
              }
            },
            start: 0,
            end: 41,
            range: [0, 41],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 41
              }
            }
          }
        ],
        start: 0,
        end: 41,
        range: [0, 41],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 41
          }
        }
      }
    ],
    [
      `<div id={function(){ return <div/> }} class="className"><p>xxx</p></div>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'xxx'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'p'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'p'
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'JSXElement',
                                children: [],
                                openingElement: {
                                  type: 'JSXOpeningElement',
                                  name: {
                                    type: 'JSXIdentifier',
                                    name: 'div'
                                  },
                                  attributes: [],
                                  selfClosing: true
                                },
                                closingElement: null
                              }
                            }
                          ]
                        },
                        async: false,
                        generator: false,
                        id: null
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'id'
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: 'className'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'class'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<div id={aa} title={ bb } {...{a:1}} class="className" ></div>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Identifier',
                        name: 'aa'
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'id'
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Identifier',
                        name: 'bb'
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'title'
                    }
                  },
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          value: {
                            type: 'Literal',
                            value: 1
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: 'className'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'class'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<X prop="2"><Y /><Z /></X>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'Y'
                    },
                    attributes: [],
                    selfClosing: true
                  },
                  closingElement: null
                },
                {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'Z'
                    },
                    attributes: [],
                    selfClosing: true
                  },
                  closingElement: null
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'X'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: '2'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'prop'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'X'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<X>{a} {b}</X>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Identifier',
                    name: 'a'
                  }
                },
                {
                  type: 'JSXText',
                  value: ' '
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'X'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'X'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<X data-prop={x ? <Y prop={2} /> : <Z>\n</Z>}></X>`,
      Context.OptionsJSX,
      {
        body: [
          {
            expression: {
              children: [],
              closingElement: {
                name: {
                  name: 'X',
                  type: 'JSXIdentifier'
                },
                type: 'JSXClosingElement'
              },
              openingElement: {
                attributes: [
                  {
                    name: {
                      name: 'data-prop',
                      type: 'JSXIdentifier'
                    },
                    type: 'JSXAttribute',
                    value: {
                      expression: {
                        alternate: {
                          children: [
                            {
                              type: 'JSXText',
                              value: '\n'
                            }
                          ],
                          closingElement: {
                            name: {
                              name: 'Z',
                              type: 'JSXIdentifier'
                            },
                            type: 'JSXClosingElement'
                          },
                          openingElement: {
                            attributes: [],
                            name: {
                              name: 'Z',
                              type: 'JSXIdentifier'
                            },
                            selfClosing: false,
                            type: 'JSXOpeningElement'
                          },
                          type: 'JSXElement'
                        },
                        consequent: {
                          children: [],
                          closingElement: null,
                          openingElement: {
                            attributes: [
                              {
                                name: {
                                  name: 'prop',
                                  type: 'JSXIdentifier'
                                },
                                type: 'JSXAttribute',
                                value: {
                                  expression: {
                                    type: 'Literal',
                                    value: 2
                                  },
                                  type: 'JSXExpressionContainer'
                                }
                              }
                            ],
                            name: {
                              name: 'Y',
                              type: 'JSXIdentifier'
                            },
                            selfClosing: true,
                            type: 'JSXOpeningElement'
                          },
                          type: 'JSXElement'
                        },
                        test: {
                          name: 'x',
                          type: 'Identifier'
                        },
                        type: 'ConditionalExpression'
                      },
                      type: 'JSXExpressionContainer'
                    }
                  }
                ],
                name: {
                  name: 'X',
                  type: 'JSXIdentifier'
                },
                selfClosing: false,
                type: 'JSXOpeningElement'
              },
              type: 'JSXElement'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `/** @jsx CUSTOM_DOM */<a></a>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `import React from 'react'
     const Component = () => (
       <div>Hello, World</div>
     )`,
      Context.OptionsJSX | Context.Module | Context.Strict,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'React'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'react'
            }
          },
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'JSXElement',
                    children: [
                      {
                        type: 'JSXText',
                        value: 'Hello, World'
                      }
                    ],
                    openingElement: {
                      type: 'JSXOpeningElement',
                      name: {
                        type: 'JSXIdentifier',
                        name: 'div'
                      },
                      attributes: [],
                      selfClosing: false
                    },
                    closingElement: {
                      type: 'JSXClosingElement',
                      name: {
                        type: 'JSXIdentifier',
                        name: 'div'
                      }
                    }
                  },
                  params: [],
                  async: false,
                  expression: true
                },
                id: {
                  type: 'Identifier',
                  name: 'Component'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `<Basic>
       <BasicChild>
         <BasicChild>
           <BasicChild>
             Title 2
           </BasicChild>
         </BasicChild>
       </BasicChild>
     </Basic>`,
      Context.OptionsJSX | Context.Module | Context.Strict,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '\n       '
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '\n         '
                    },
                    {
                      type: 'JSXElement',
                      children: [
                        {
                          type: 'JSXText',
                          value: '\n           '
                        },
                        {
                          type: 'JSXElement',
                          children: [
                            {
                              type: 'JSXText',
                              value: '\n             Title 2\n           '
                            }
                          ],
                          openingElement: {
                            type: 'JSXOpeningElement',
                            name: {
                              type: 'JSXIdentifier',
                              name: 'BasicChild'
                            },
                            attributes: [],
                            selfClosing: false
                          },
                          closingElement: {
                            type: 'JSXClosingElement',
                            name: {
                              type: 'JSXIdentifier',
                              name: 'BasicChild'
                            }
                          }
                        },
                        {
                          type: 'JSXText',
                          value: '\n         '
                        }
                      ],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'BasicChild'
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'BasicChild'
                        }
                      }
                    },
                    {
                      type: 'JSXText',
                      value: '\n       '
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'BasicChild'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'BasicChild'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: '\n     '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Basic'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Basic'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<div>
     one
     <div>
       two
       <span>
         three
       </span>
     </div>
   </div>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '\n     one\n     '
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '\n       two\n       '
                    },
                    {
                      type: 'JSXElement',
                      children: [
                        {
                          type: 'JSXText',
                          value: '\n         three\n       '
                        }
                      ],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'span'
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'span'
                        }
                      }
                    },
                    {
                      type: 'JSXText',
                      value: '\n     '
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: '\n   '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<>Fragment</>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              children: [
                {
                  type: 'JSXText',
                  value: 'Fragment'
                }
              ],
              openingFragment: {
                type: 'JSXOpeningFragment'
              },
              closingFragment: {
                type: 'JSXClosingFragment'
              }
            }
          }
        ]
      }
    ],
    [
      `<p>hello,world</p>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: 'hello,world'
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'p'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'p'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<></>`,
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 5,
        range: [0, 5],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 5,
            range: [0, 5],
            expression: {
              type: 'JSXFragment',
              start: 0,
              end: 5,
              range: [0, 5],
              openingFragment: {
                type: 'JSXOpeningFragment',
                start: 0,
                end: 2,
                range: [0, 2]
              },
              closingFragment: {
                type: 'JSXClosingFragment',
                start: 2,
                end: 5,
                range: [2, 5]
              },
              children: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `<    ></   >`,
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'JSXFragment',
              start: 0,
              end: 12,
              range: [0, 12],
              openingFragment: {
                type: 'JSXOpeningFragment',
                start: 0,
                end: 6,
                range: [0, 6]
              },
              closingFragment: {
                type: 'JSXClosingFragment',
                start: 6,
                end: 12,
                range: [6, 12]
              },
              children: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `< /*starting wrap*/ ></ /*ending wrap*/>;`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              children: [],
              openingFragment: {
                type: 'JSXOpeningFragment'
              },
              closingFragment: {
                type: 'JSXClosingFragment'
              }
            }
          }
        ]
      }
    ],
    [
      `<>hi</>;`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              children: [
                {
                  type: 'JSXText',
                  value: 'hi'
                }
              ],
              openingFragment: {
                type: 'JSXOpeningFragment'
              },
              closingFragment: {
                type: 'JSXClosingFragment'
              }
            }
          }
        ]
      }
    ],
    [
      `<><div>JSXElement</div>JSXText{'JSXExpressionContainer'}</>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              children: [
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'JSXElement'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: 'JSXText'
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Literal',
                    value: 'JSXExpressionContainer'
                  }
                }
              ],
              openingFragment: {
                type: 'JSXOpeningFragment'
              },
              closingFragment: {
                type: 'JSXClosingFragment'
              }
            }
          }
        ]
      }
    ],
    [
      `<><span>hi</span><div>bye</div></>;`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              children: [
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'hi'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    }
                  }
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'bye'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                }
              ],
              openingFragment: {
                type: 'JSXOpeningFragment'
              },
              closingFragment: {
                type: 'JSXClosingFragment'
              }
            }
          }
        ]
      }
    ],
    [
      `<><span>1</span><><span>2.1</span><span>2.2</span></><span>3</span></>;`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              children: [
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '1'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    }
                  }
                },
                {
                  type: 'JSXFragment',
                  children: [
                    {
                      type: 'JSXElement',
                      children: [
                        {
                          type: 'JSXText',
                          value: '2.1'
                        }
                      ],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'span'
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'span'
                        }
                      }
                    },
                    {
                      type: 'JSXElement',
                      children: [
                        {
                          type: 'JSXText',
                          value: '2.2'
                        }
                      ],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'span'
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'span'
                        }
                      }
                    }
                  ],
                  openingFragment: {
                    type: 'JSXOpeningFragment'
                  },
                  closingFragment: {
                    type: 'JSXClosingFragment'
                  }
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '3'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    }
                  }
                }
              ],
              openingFragment: {
                type: 'JSXOpeningFragment'
              },
              closingFragment: {
                type: 'JSXClosingFragment'
              }
            }
          }
        ]
      }
    ],
    [
      `<><span> hi </span> <div>bye</div> </>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              children: [
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: ' hi '
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: ' '
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'bye'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: ' '
                }
              ],
              openingFragment: {
                type: 'JSXOpeningFragment'
              },
              closingFragment: {
                type: 'JSXClosingFragment'
              }
            }
          }
        ]
      }
    ],
    [
      `<>
     <>
       <>
        Ghost!
       </>
     </>
   </>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              children: [
                {
                  type: 'JSXText',
                  value: '\n     '
                },
                {
                  type: 'JSXFragment',
                  children: [
                    {
                      type: 'JSXText',
                      value: '\n       '
                    },
                    {
                      type: 'JSXFragment',
                      children: [
                        {
                          type: 'JSXText',
                          value: '\n        Ghost!\n       '
                        }
                      ],
                      openingFragment: {
                        type: 'JSXOpeningFragment'
                      },
                      closingFragment: {
                        type: 'JSXClosingFragment'
                      }
                    },
                    {
                      type: 'JSXText',
                      value: '\n     '
                    }
                  ],
                  openingFragment: {
                    type: 'JSXOpeningFragment'
                  },
                  closingFragment: {
                    type: 'JSXClosingFragment'
                  }
                },
                {
                  type: 'JSXText',
                  value: '\n   '
                }
              ],
              openingFragment: {
                type: 'JSXOpeningFragment'
              },
              closingFragment: {
                type: 'JSXClosingFragment'
              }
            }
          }
        ]
      }
    ],
    [
      `<>
     <>
       <>
         super deep
       </>
     </>
   </>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              children: [
                {
                  type: 'JSXText',
                  value: '\n     '
                },
                {
                  type: 'JSXFragment',
                  children: [
                    {
                      type: 'JSXText',
                      value: '\n       '
                    },
                    {
                      type: 'JSXFragment',
                      children: [
                        {
                          type: 'JSXText',
                          value: '\n         super deep\n       '
                        }
                      ],
                      openingFragment: {
                        type: 'JSXOpeningFragment'
                      },
                      closingFragment: {
                        type: 'JSXClosingFragment'
                      }
                    },
                    {
                      type: 'JSXText',
                      value: '\n     '
                    }
                  ],
                  openingFragment: {
                    type: 'JSXOpeningFragment'
                  },
                  closingFragment: {
                    type: 'JSXClosingFragment'
                  }
                },
                {
                  type: 'JSXText',
                  value: '\n   '
                }
              ],
              openingFragment: {
                type: 'JSXOpeningFragment'
              },
              closingFragment: {
                type: 'JSXClosingFragment'
              }
            }
          }
        ]
      }
    ],
    [
      `<dl>
     {props.items.map(item => (
       <React.Fragment key={item.id}>
         <dt>{item.term}</dt>
         <dd>{item.description}</dd>
       </React.Fragment>
     ))}
   </dl>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '\n     '
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'props'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'items'
                        }
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'map'
                      }
                    },
                    arguments: [
                      {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'JSXElement',
                          children: [
                            {
                              type: 'JSXText',
                              value: '\n         '
                            },
                            {
                              type: 'JSXElement',
                              children: [
                                {
                                  type: 'JSXExpressionContainer',
                                  expression: {
                                    type: 'MemberExpression',
                                    object: {
                                      type: 'Identifier',
                                      name: 'item'
                                    },
                                    computed: false,
                                    property: {
                                      type: 'Identifier',
                                      name: 'term'
                                    }
                                  }
                                }
                              ],
                              openingElement: {
                                type: 'JSXOpeningElement',
                                name: {
                                  type: 'JSXIdentifier',
                                  name: 'dt'
                                },
                                attributes: [],
                                selfClosing: false
                              },
                              closingElement: {
                                type: 'JSXClosingElement',
                                name: {
                                  type: 'JSXIdentifier',
                                  name: 'dt'
                                }
                              }
                            },
                            {
                              type: 'JSXText',
                              value: '\n         '
                            },
                            {
                              type: 'JSXElement',
                              children: [
                                {
                                  type: 'JSXExpressionContainer',
                                  expression: {
                                    type: 'MemberExpression',
                                    object: {
                                      type: 'Identifier',
                                      name: 'item'
                                    },
                                    computed: false,
                                    property: {
                                      type: 'Identifier',
                                      name: 'description'
                                    }
                                  }
                                }
                              ],
                              openingElement: {
                                type: 'JSXOpeningElement',
                                name: {
                                  type: 'JSXIdentifier',
                                  name: 'dd'
                                },
                                attributes: [],
                                selfClosing: false
                              },
                              closingElement: {
                                type: 'JSXClosingElement',
                                name: {
                                  type: 'JSXIdentifier',
                                  name: 'dd'
                                }
                              }
                            },
                            {
                              type: 'JSXText',
                              value: '\n       '
                            }
                          ],
                          openingElement: {
                            type: 'JSXOpeningElement',
                            name: {
                              type: 'JSXMemberExpression',
                              object: {
                                type: 'JSXIdentifier',
                                name: 'React'
                              },
                              property: {
                                type: 'JSXIdentifier',
                                name: 'Fragment'
                              }
                            },
                            attributes: [
                              {
                                type: 'JSXAttribute',
                                value: {
                                  type: 'JSXExpressionContainer',
                                  expression: {
                                    type: 'MemberExpression',
                                    object: {
                                      type: 'Identifier',
                                      name: 'item'
                                    },
                                    computed: false,
                                    property: {
                                      type: 'Identifier',
                                      name: 'id'
                                    }
                                  }
                                },
                                name: {
                                  type: 'JSXIdentifier',
                                  name: 'key'
                                }
                              }
                            ],
                            selfClosing: false
                          },
                          closingElement: {
                            type: 'JSXClosingElement',
                            name: {
                              type: 'JSXMemberExpression',
                              object: {
                                type: 'JSXIdentifier',
                                name: 'React'
                              },
                              property: {
                                type: 'JSXIdentifier',
                                name: 'Fragment'
                              }
                            }
                          }
                        },
                        params: [
                          {
                            type: 'Identifier',
                            name: 'item'
                          }
                        ],
                        async: false,
                        expression: true
                      }
                    ]
                  }
                },
                {
                  type: 'JSXText',
                  value: '\n   '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'dl'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'dl'
                }
              }
            }
          }
        ]
      }
    ],

    [
      `<em>
     One
     Two
     Three
     </em>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '\n     One\n     Two\n     Three\n     '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'em'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'em'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<SolarSystem.Earth.America.USA.California.mountain-view></SolarSystem.Earth.America.USA.California.mountain-view>',
      Context.OptionsJSX | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXMemberExpression',
                  object: {
                    type: 'JSXMemberExpression',
                    object: {
                      type: 'JSXMemberExpression',
                      object: {
                        type: 'JSXMemberExpression',
                        object: {
                          type: 'JSXMemberExpression',
                          object: {
                            type: 'JSXIdentifier',
                            name: 'SolarSystem'
                          },
                          property: {
                            type: 'JSXIdentifier',
                            name: 'Earth'
                          }
                        },
                        property: {
                          type: 'JSXIdentifier',
                          name: 'America'
                        }
                      },
                      property: {
                        type: 'JSXIdentifier',
                        name: 'USA'
                      }
                    },
                    property: {
                      type: 'JSXIdentifier',
                      name: 'California'
                    }
                  },
                  property: {
                    type: 'JSXIdentifier',
                    name: 'mountain-view'
                  }
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXMemberExpression',
                  object: {
                    type: 'JSXMemberExpression',
                    object: {
                      type: 'JSXMemberExpression',
                      object: {
                        type: 'JSXMemberExpression',
                        object: {
                          type: 'JSXMemberExpression',
                          object: {
                            type: 'JSXIdentifier',
                            name: 'SolarSystem'
                          },
                          property: {
                            type: 'JSXIdentifier',
                            name: 'Earth'
                          }
                        },
                        property: {
                          type: 'JSXIdentifier',
                          name: 'America'
                        }
                      },
                      property: {
                        type: 'JSXIdentifier',
                        name: 'USA'
                      }
                    },
                    property: {
                      type: 'JSXIdentifier',
                      name: 'California'
                    }
                  },
                  property: {
                    type: 'JSXIdentifier',
                    name: 'mountain-view'
                  }
                }
              }
            }
          }
        ]
      }
    ],
    [
      'function *g() { yield <h1>Hello</h1> }',
      Context.OptionsJSX | Context.OptionsNext,
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'JSXElement',
                      children: [
                        {
                          type: 'JSXText',
                          value: 'Hello'
                        }
                      ],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'h1'
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'h1'
                        }
                      }
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      '<a>{`${1}`}</a>',
      Context.OptionsJSX | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'TemplateLiteral',
                    expressions: [
                      {
                        type: 'Literal',
                        value: 1
                      }
                    ],
                    quasis: [
                      {
                        type: 'TemplateElement',
                        value: {
                          cooked: '',
                          raw: ''
                        },
                        tail: false
                      },
                      {
                        type: 'TemplateElement',
                        value: {
                          cooked: '',
                          raw: ''
                        },
                        tail: true
                      }
                    ]
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<strong><em><a href="{link}"><test/></a></em></strong>',
      Context.OptionsJSX | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXElement',
                      children: [
                        {
                          type: 'JSXElement',
                          children: [],
                          openingElement: {
                            type: 'JSXOpeningElement',
                            name: {
                              type: 'JSXIdentifier',
                              name: 'test'
                            },
                            attributes: [],
                            selfClosing: true
                          },
                          closingElement: null
                        }
                      ],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'a'
                        },
                        attributes: [
                          {
                            type: 'JSXAttribute',
                            value: {
                              type: 'Literal',
                              value: '{link}'
                            },
                            name: {
                              type: 'JSXIdentifier',
                              name: 'href'
                            }
                          }
                        ],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'a'
                        }
                      }
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'em'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'em'
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'strong'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'strong'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<x y="&#123abc &#123;" />',
      Context.OptionsJSX | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'x'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: '&#123abc &#123;'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'y'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<a b="&#xA2; &#x00A3;"/>',
      Context.OptionsJSX | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: '&#xA2; &#x00A3;'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'b'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<p q="Just my &#xA2;2" />',
      Context.OptionsJSX | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'p'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: 'Just my &#xA2;2'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'q'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      'class C {  static a = <C.z></C.z> }',
      Context.OptionsJSX | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
            id: {
              type: 'Identifier',
              name: 'C'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'JSXElement',
                    children: [],
                    openingElement: {
                      type: 'JSXOpeningElement',
                      name: {
                        type: 'JSXMemberExpression',
                        object: {
                          type: 'JSXIdentifier',
                          name: 'C'
                        },
                        property: {
                          type: 'JSXIdentifier',
                          name: 'z'
                        }
                      },
                      attributes: [],
                      selfClosing: false
                    },
                    closingElement: {
                      type: 'JSXClosingElement',
                      name: {
                        type: 'JSXMemberExpression',
                        object: {
                          type: 'JSXIdentifier',
                          name: 'C'
                        },
                        property: {
                          type: 'JSXIdentifier',
                          name: 'z'
                        }
                      }
                    }
                  },
                  computed: false,
                  static: true
                }
              ]
            }
          }
        ]
      }
    ],

    [
      '<n:a n:v />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXNamespacedName',
                  namespace: {
                    type: 'JSXIdentifier',
                    name: 'n'
                  },
                  name: {
                    type: 'JSXIdentifier',
                    name: 'a'
                  }
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: null,
                    name: {
                      type: 'JSXNamespacedName',
                      namespace: {
                        type: 'JSXIdentifier',
                        name: 'n'
                      },
                      name: {
                        type: 'JSXIdentifier',
                        name: 'v'
                      }
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],

    [
      '<n:a />',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 7,
        range: [0, 7],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 7,
            range: [0, 7],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 7,
              range: [0, 7],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 7,
                range: [0, 7],
                attributes: [],
                name: {
                  type: 'JSXNamespacedName',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  namespace: {
                    type: 'JSXIdentifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'n'
                  },
                  name: {
                    type: 'JSXIdentifier',
                    start: 3,
                    end: 4,
                    range: [3, 4],
                    name: 'a'
                  }
                },
                selfClosing: true
              },
              closingElement: null,
              children: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '<a:b><a:b></a:b></a:b>;',
      Context.OptionsJSX | Context.OptionsRanges,
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
              type: 'JSXElement',
              start: 0,
              end: 22,
              range: [0, 22],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 5,
                range: [0, 5],
                attributes: [],
                name: {
                  type: 'JSXNamespacedName',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  namespace: {
                    type: 'JSXIdentifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'a'
                  },
                  name: {
                    type: 'JSXIdentifier',
                    start: 3,
                    end: 4,
                    range: [3, 4],
                    name: 'b'
                  }
                },
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                start: 16,
                end: 22,
                range: [16, 22],
                name: {
                  type: 'JSXNamespacedName',
                  start: 18,
                  end: 21,
                  range: [18, 21],
                  namespace: {
                    type: 'JSXIdentifier',
                    start: 18,
                    end: 19,
                    range: [18, 19],
                    name: 'a'
                  },
                  name: {
                    type: 'JSXIdentifier',
                    start: 20,
                    end: 21,
                    range: [20, 21],
                    name: 'b'
                  }
                }
              },
              children: [
                {
                  type: 'JSXElement',
                  start: 5,
                  end: 16,
                  range: [5, 16],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    start: 5,
                    end: 10,
                    range: [5, 10],
                    attributes: [],
                    name: {
                      type: 'JSXNamespacedName',
                      start: 6,
                      end: 9,
                      range: [6, 9],
                      namespace: {
                        type: 'JSXIdentifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'a'
                      },
                      name: {
                        type: 'JSXIdentifier',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        name: 'b'
                      }
                    },
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    start: 10,
                    end: 16,
                    range: [10, 16],
                    name: {
                      type: 'JSXNamespacedName',
                      start: 12,
                      end: 15,
                      range: [12, 15],
                      namespace: {
                        type: 'JSXIdentifier',
                        start: 12,
                        end: 13,
                        range: [12, 13],
                        name: 'a'
                      },
                      name: {
                        type: 'JSXIdentifier',
                        start: 14,
                        end: 15,
                        range: [14, 15],
                        name: 'b'
                      }
                    }
                  },
                  children: []
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '<A aa={aa.bb.cc} bb={bb.cc.dd}><div>{aa.b}</div></A>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'aa'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      }
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'A'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'aa'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'cc'
                        }
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'aa'
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'bb'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'cc'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'dd'
                        }
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'bb'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'A'
                }
              }
            }
          }
        ]
      }
    ],

    [
      'var component = <Component {...props} />;',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'Component'
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'Identifier',
                          name: 'props'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'component'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `class SayHello extends React.Component {
      constructor(props) {
        super(props);
        this.state = {message: 'Hello!'};
        // This line is important!
        this.handleClick = this.handleClick.bind(this);
      }
      handleClick() {
        alert(this.state.message);
      }
      render() {
        // Because "this.handleClick" is bound, we can use it as an event handler.
        return (
          <button onClick={this.handleClick}>
            Say hello
          </button>
        );
      }
    }`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'SayHello'
            },
            superClass: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'React'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'Component'
              }
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'props'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Super'
                            },
                            arguments: [
                              {
                                type: 'Identifier',
                                name: 'props'
                              }
                            ]
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'state'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'message'
                                  },
                                  value: {
                                    type: 'Literal',
                                    value: 'Hello!'
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false
                                }
                              ]
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'handleClick'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'CallExpression',
                              callee: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'ThisExpression'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'Identifier',
                                    name: 'handleClick'
                                  }
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  name: 'bind'
                                }
                              },
                              arguments: [
                                {
                                  type: 'ThisExpression'
                                }
                              ]
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'handleClick'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'alert'
                            },
                            arguments: [
                              {
                                type: 'MemberExpression',
                                object: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'ThisExpression'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'Identifier',
                                    name: 'state'
                                  }
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  name: 'message'
                                }
                              }
                            ]
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'render'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'JSXElement',
                            children: [
                              {
                                type: 'JSXText',
                                value: '\n            Say hello\n          '
                              }
                            ],
                            openingElement: {
                              type: 'JSXOpeningElement',
                              name: {
                                type: 'JSXIdentifier',
                                name: 'button'
                              },
                              attributes: [
                                {
                                  type: 'JSXAttribute',
                                  value: {
                                    type: 'JSXExpressionContainer',
                                    expression: {
                                      type: 'MemberExpression',
                                      object: {
                                        type: 'ThisExpression'
                                      },
                                      computed: false,
                                      property: {
                                        type: 'Identifier',
                                        name: 'handleClick'
                                      }
                                    }
                                  },
                                  name: {
                                    type: 'JSXIdentifier',
                                    name: 'onClick'
                                  }
                                }
                              ],
                              selfClosing: false
                            },
                            closingElement: {
                              type: 'JSXClosingElement',
                              name: {
                                type: 'JSXIdentifier',
                                name: 'button'
                              }
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '<a>{\r\n}</a>',
      Context.OptionsJSX,
      {
        body: [
          {
            expression: {
              children: [
                {
                  expression: {
                    type: 'JSXEmptyExpression'
                  },
                  type: 'JSXExpressionContainer'
                }
              ],
              closingElement: {
                name: {
                  name: 'a',
                  type: 'JSXIdentifier'
                },
                type: 'JSXClosingElement'
              },
              openingElement: {
                attributes: [],
                name: {
                  name: 'a',
                  type: 'JSXIdentifier'
                },
                selfClosing: false,
                type: 'JSXOpeningElement'
              },
              type: 'JSXElement'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '<a>{/* this\nis\na\nmulti-line\ncomment */}</a>',
      Context.OptionsJSX,
      {
        body: [
          {
            expression: {
              children: [
                {
                  expression: {
                    type: 'JSXEmptyExpression'
                  },
                  type: 'JSXExpressionContainer'
                }
              ],
              closingElement: {
                name: {
                  name: 'a',
                  type: 'JSXIdentifier'
                },
                type: 'JSXClosingElement'
              },
              openingElement: {
                attributes: [],
                name: {
                  name: 'a',
                  type: 'JSXIdentifier'
                },
                selfClosing: false,
                type: 'JSXOpeningElement'
              },
              type: 'JSXElement'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    /*[
      '<a>= == =</a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '= == ='
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],*/
    [
      '<this />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'this'
                },
                attributes: [],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<Switch checkedChildren="开" unCheckedChildren={"关"} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Switch'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: '开'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'checkedChildren'
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Literal',
                        value: '关'
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'unCheckedChildren'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<a b="&notanentity;" />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: '&notanentity;'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'b'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      'let child = <img src={url} key="img" />;',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'img'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Identifier',
                            name: 'url'
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'src'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'img'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'key'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'child'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '<img src="/cat.jpg" style={{ position: "absolute", left: mouse.x, top: mouse.y }} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'img'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: '/cat.jpg'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'src'
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'position'
                            },
                            value: {
                              type: 'Literal',
                              value: 'absolute'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'left'
                            },
                            value: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'mouse'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'x'
                              }
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'top'
                            },
                            value: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'mouse'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'y'
                              }
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'style'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<Component {...{...props, y: 1 }} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Component'
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'Identifier',
                            name: 'props'
                          }
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          value: {
                            type: 'Literal',
                            value: 1
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<Component {...props} y={1} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Component'
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'Identifier',
                      name: 'props'
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Literal',
                        value: 1
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'y'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      `var div = (
      <div className='foo'>
        <img src='foo.gif'/>
        <img src='bar.gif'/>
      </div>
    );`,
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '\n        '
                    },
                    {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'img'
                        },
                        attributes: [
                          {
                            type: 'JSXAttribute',
                            value: {
                              type: 'Literal',
                              value: 'foo.gif'
                            },
                            name: {
                              type: 'JSXIdentifier',
                              name: 'src'
                            }
                          }
                        ],
                        selfClosing: true
                      },
                      closingElement: null
                    },
                    {
                      type: 'JSXText',
                      value: '\n        '
                    },
                    {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'img'
                        },
                        attributes: [
                          {
                            type: 'JSXAttribute',
                            value: {
                              type: 'Literal',
                              value: 'bar.gif'
                            },
                            name: {
                              type: 'JSXIdentifier',
                              name: 'src'
                            }
                          }
                        ],
                        selfClosing: true
                      },
                      closingElement: null
                    },
                    {
                      type: 'JSXText',
                      value: '\n      '
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'foo'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'className'
                        }
                      }
                    ],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'div'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `<h1>
     Hello {name}
     !
   </h1>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '\n     Hello '
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Identifier',
                    name: 'name'
                  }
                },
                {
                  type: 'JSXText',
                  value: '\n     !\n   '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'h1'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'h1'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `var div = (
      <div>
        { images.map( src => <img src={src}/> ) }
      </div>
    );`,
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '\n        '
                    },
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'images'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'map'
                          }
                        },
                        arguments: [
                          {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'JSXElement',
                              children: [],
                              openingElement: {
                                type: 'JSXOpeningElement',
                                name: {
                                  type: 'JSXIdentifier',
                                  name: 'img'
                                },
                                attributes: [
                                  {
                                    type: 'JSXAttribute',
                                    value: {
                                      type: 'JSXExpressionContainer',
                                      expression: {
                                        type: 'Identifier',
                                        name: 'src'
                                      }
                                    },
                                    name: {
                                      type: 'JSXIdentifier',
                                      name: 'src'
                                    }
                                  }
                                ],
                                selfClosing: true
                              },
                              closingElement: null
                            },
                            params: [
                              {
                                type: 'Identifier',
                                name: 'src'
                              }
                            ],
                            async: false,
                            expression: true
                          }
                        ]
                      }
                    },
                    {
                      type: 'JSXText',
                      value: '\n      '
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'div'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '<div {...c}> {...children}{a}{...b}</div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: ' '
                },
                {
                  type: 'JSXSpreadChild',
                  expression: {
                    type: 'Identifier',
                    name: 'children'
                  }
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Identifier',
                    name: 'a'
                  }
                },
                {
                  type: 'JSXSpreadChild',
                  expression: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'Identifier',
                      name: 'c'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'function* test() { yield <Hey />;    }',
      Context.OptionsJSX,
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'Hey'
                        },
                        attributes: [],
                        selfClosing: true
                      },
                      closingElement: null
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'test'
            }
          }
        ]
      }
    ],
    [
      'function* test() { yield (<Hey />); }',
      Context.OptionsJSX,
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'Hey'
                        },
                        attributes: [],
                        selfClosing: true
                      },
                      closingElement: null
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'test'
            }
          }
        ]
      }
    ],
    [
      '<div {...c}> {...children}{a}{...b}</div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: ' '
                },
                {
                  type: 'JSXSpreadChild',
                  expression: {
                    type: 'Identifier',
                    name: 'children'
                  }
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Identifier',
                    name: 'a'
                  }
                },
                {
                  type: 'JSXSpreadChild',
                  expression: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'Identifier',
                      name: 'c'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'function Meet({name = "world"}) { return <div>Hello, {name}</div>; }',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'name'
                    },
                    computed: false,
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'name'
                      },
                      right: {
                        type: 'Literal',
                        value: 'world'
                      }
                    },
                    method: false,
                    shorthand: true
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'JSXElement',
                    children: [
                      {
                        type: 'JSXText',
                        value: 'Hello, '
                      },
                      {
                        type: 'JSXExpressionContainer',
                        expression: {
                          type: 'Identifier',
                          name: 'name'
                        }
                      }
                    ],
                    openingElement: {
                      type: 'JSXOpeningElement',
                      name: {
                        type: 'JSXIdentifier',
                        name: 'div'
                      },
                      attributes: [],
                      selfClosing: false
                    },
                    closingElement: {
                      type: 'JSXClosingElement',
                      name: {
                        type: 'JSXIdentifier',
                        name: 'div'
                      }
                    }
                  }
                }
              ]
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'Meet'
            }
          }
        ]
      }
    ],
    [
      'const d1 = <TestingOneThing y1 extra-data />;',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOneThing'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y1'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'extra-data'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'd1'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const d2 = <TestingOneThing extra-data="hello" />;',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOneThing'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hello'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'extra-data'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'd2'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '<a b={x ? <c /> : <d />} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'ConditionalExpression',
                        test: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        consequent: {
                          type: 'JSXElement',
                          children: [],
                          openingElement: {
                            type: 'JSXOpeningElement',
                            name: {
                              type: 'JSXIdentifier',
                              name: 'c'
                            },
                            attributes: [],
                            selfClosing: true
                          },
                          closingElement: null
                        },
                        alternate: {
                          type: 'JSXElement',
                          children: [],
                          openingElement: {
                            type: 'JSXOpeningElement',
                            name: {
                              type: 'JSXIdentifier',
                              name: 'd'
                            },
                            attributes: [],
                            selfClosing: true
                          },
                          closingElement: null
                        }
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'b'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<Test {...{a: "foo"}} {...{b: 123}} />;',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Test'
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          value: {
                            type: 'Literal',
                            value: 'foo'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  },
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          value: {
                            type: 'Literal',
                            value: 123
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      `ReactDOM.render(
        <CommentBox url="/api/comments" pollInterval={2000} />,
        document.getElementById('content')
      );`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'ReactDOM'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'render'
                }
              },
              arguments: [
                {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'CommentBox'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: '/api/comments'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'url'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Literal',
                            value: 2000
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'pollInterval'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'document'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'getElementById'
                    }
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      value: 'content'
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
      '<div>{0}</div>;',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Literal',
                    value: 0
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '(<div />) < x;',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'JSXElement',
                children: [],
                openingElement: {
                  type: 'JSXOpeningElement',
                  name: {
                    type: 'JSXIdentifier',
                    name: 'div'
                  },
                  attributes: [],
                  selfClosing: true
                },
                closingElement: null
              },
              right: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '<'
            }
          }
        ]
      }
    ],
    [
      '<div>{() => (<div text="wat" />)}</div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'div'
                        },
                        attributes: [
                          {
                            type: 'JSXAttribute',
                            value: {
                              type: 'Literal',
                              value: 'wat'
                            },
                            name: {
                              type: 'JSXIdentifier',
                              name: 'text'
                            }
                          }
                        ],
                        selfClosing: true
                      },
                      closingElement: null
                    },
                    params: [],
                    async: false,
                    expression: true
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<a />;',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      'const c2 = <OneThing yy={100}  yy1="hello"/>;',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'OneThing'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Literal',
                            value: 100
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'yy'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hello'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'yy1'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'c2'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const c3 = <OneThing yxx="hello" ignore-prop />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'OneThing'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hello'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'yxx'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'ignore-prop'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'c3'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const d3 = <TestingOneThing extra-data="hello" yy="hihi" />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOneThing'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hello'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'extra-data'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hihi'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'yy'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'd3'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const d4 = <TestingOneThing extra-data="hello" yy={9} direction={10} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOneThing'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hello'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'extra-data'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Literal',
                            value: 9
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'yy'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Literal',
                            value: 10
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'direction'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'd4'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const d5 = <TestingOneThing extra-data="hello" yy="hello" name="Bob" />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOneThing'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hello'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'extra-data'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hello'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'yy'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'Bob'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'name'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'd5'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const e3 = <TestingOptional y1="hello"/>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOptional'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hello'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y1'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'e3'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const e4 = <TestingOptional y1="hello" y2={1000} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOptional'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hello'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y1'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Literal',
                            value: 1000
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y2'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'e4'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const e5 = <TestingOptional y1 y3/>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOptional'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y1'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y3'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'e5'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const e6 = <TestingOptional y1 y3 y2={10} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOptional'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y1'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y3'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Literal',
                            value: 10
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y2'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'e6'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const e2 = <TestingOptional y1 y3 extra-prop/>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'TestingOptional'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y1'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y3'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'extra-prop'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'e2'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let k3 = <Comp a={10} b="hi"><Button /><AnotherButton /></Comp>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'Button'
                        },
                        attributes: [],
                        selfClosing: true
                      },
                      closingElement: null
                    },
                    {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'AnotherButton'
                        },
                        attributes: [],
                        selfClosing: true
                      },
                      closingElement: null
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'Comp'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Literal',
                            value: 10
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'a'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hi'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'b'
                        }
                      }
                    ],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'Comp'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'k3'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var selfClosed2 = <div x="1" />',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: '1'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'x'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'selfClosed2'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var selfClosed5 = <div x={0} y="0" />',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Literal',
                            value: 0
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'x'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: '0'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'selfClosed5'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var selfClosed6 = <div x={"1"} y="0" />',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Literal',
                            value: '1'
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'x'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: '0'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'selfClosed6'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var selfClosed7 = <div x={p} y="p" b />',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Identifier',
                            name: 'p'
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'x'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'p'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'y'
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'b'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'selfClosed7'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var openClosed4 = <div n="m">{p < p}</div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'p'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'p'
                        },
                        operator: '<'
                      }
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'm'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'n'
                        }
                      }
                    ],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'openClosed4'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var rewrites1 = <div>{() => this}</div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'ThisExpression'
                        },
                        params: [],
                        async: false,
                        expression: true
                      }
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'rewrites1'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var rewrites2 = <div>{[p, ...p, p]}</div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'p'
                          },
                          {
                            type: 'SpreadElement',
                            argument: {
                              type: 'Identifier',
                              name: 'p'
                            }
                          },
                          {
                            type: 'Identifier',
                            name: 'p'
                          }
                        ]
                      }
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'rewrites2'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var rewrites3 = <div>{{p}}</div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'p'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'p'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      }
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'rewrites3'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var rewrites4 = <div a={() => this}></div>',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 42,
        range: [0, 42],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 42,
            range: [0, 42],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 42,
                range: [4, 42],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 13,
                  range: [4, 13],
                  name: 'rewrites4'
                },
                init: {
                  type: 'JSXElement',
                  start: 16,
                  end: 42,
                  range: [16, 42],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    start: 16,
                    end: 36,
                    range: [16, 36],
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        start: 21,
                        end: 35,
                        range: [21, 35],
                        name: {
                          type: 'JSXIdentifier',
                          start: 21,
                          end: 22,
                          range: [21, 22],
                          name: 'a'
                        },
                        value: {
                          type: 'JSXExpressionContainer',
                          start: 23,
                          end: 35,
                          range: [23, 35],
                          expression: {
                            type: 'ArrowFunctionExpression',
                            start: 24,
                            end: 34,
                            range: [24, 34],
                            expression: true,
                            async: false,
                            params: [],
                            body: {
                              type: 'ThisExpression',
                              start: 30,
                              end: 34,
                              range: [30, 34]
                            }
                          }
                        }
                      }
                    ],
                    name: {
                      type: 'JSXIdentifier',
                      start: 17,
                      end: 20,
                      range: [17, 20],
                      name: 'div'
                    },
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    start: 36,
                    end: 42,
                    range: [36, 42],
                    name: {
                      type: 'JSXIdentifier',
                      start: 38,
                      end: 41,
                      range: [38, 41],
                      name: 'div'
                    }
                  },
                  children: []
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
      'var rewrites5 = <div a={[p, ...p, p]}></div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'ArrayExpression',
                            elements: [
                              {
                                type: 'Identifier',
                                name: 'p'
                              },
                              {
                                type: 'SpreadElement',
                                argument: {
                                  type: 'Identifier',
                                  name: 'p'
                                }
                              },
                              {
                                type: 'Identifier',
                                name: 'p'
                              }
                            ]
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'a'
                        }
                      }
                    ],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'rewrites5'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var rewrites6 = <div a={{p}}></div>',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 35,
        range: [0, 35],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 35,
            range: [0, 35],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 35,
                range: [4, 35],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 13,
                  range: [4, 13],
                  name: 'rewrites6'
                },
                init: {
                  type: 'JSXElement',
                  start: 16,
                  end: 35,
                  range: [16, 35],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    start: 16,
                    end: 29,
                    range: [16, 29],
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        start: 21,
                        end: 28,
                        range: [21, 28],
                        name: {
                          type: 'JSXIdentifier',
                          start: 21,
                          end: 22,
                          range: [21, 22],
                          name: 'a'
                        },
                        value: {
                          type: 'JSXExpressionContainer',
                          start: 23,
                          end: 28,
                          range: [23, 28],
                          expression: {
                            type: 'ObjectExpression',
                            start: 24,
                            end: 27,
                            range: [24, 27],
                            properties: [
                              {
                                type: 'Property',
                                start: 25,
                                end: 26,
                                range: [25, 26],
                                method: false,
                                shorthand: true,
                                computed: false,
                                key: {
                                  type: 'Identifier',
                                  start: 25,
                                  end: 26,
                                  range: [25, 26],
                                  name: 'p'
                                },
                                kind: 'init',
                                value: {
                                  type: 'Identifier',
                                  start: 25,
                                  end: 26,
                                  range: [25, 26],
                                  name: 'p'
                                }
                              }
                            ]
                          }
                        }
                      }
                    ],
                    name: {
                      type: 'JSXIdentifier',
                      start: 17,
                      end: 20,
                      range: [17, 20],
                      name: 'div'
                    },
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    start: 29,
                    end: 35,
                    range: [29, 35],
                    name: {
                      type: 'JSXIdentifier',
                      start: 31,
                      end: 34,
                      range: [31, 34],
                      name: 'div'
                    }
                  },
                  children: []
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
      'var whitespace1 = <div>      </div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '      '
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'whitespace1'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var whitespace2 = <div>  {p}    </div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: '  '
                    },
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Identifier',
                        name: 'p'
                      }
                    },
                    {
                      type: 'JSXText',
                      value: '    '
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'whitespace2'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const Tag = (x) => <div></div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'JSXElement',
                    children: [],
                    openingElement: {
                      type: 'JSXOpeningElement',
                      name: {
                        type: 'JSXIdentifier',
                        name: 'div'
                      },
                      attributes: [],
                      selfClosing: false
                    },
                    closingElement: {
                      type: 'JSXClosingElement',
                      name: {
                        type: 'JSXIdentifier',
                        name: 'div'
                      }
                    }
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    }
                  ],
                  async: false,
                  expression: true
                },
                id: {
                  type: 'Identifier',
                  name: 'Tag'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '<div>hi hi hi!</div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: 'hi hi hi!'
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'var m = <div x-y="val"></div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'val'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'x-y'
                        }
                      }
                    ],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'm'
                }
              }
            ]
          }
        ]
      }
    ],

    [
      'var o = <div x-yy="val"></div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'val'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'x-yy'
                        }
                      }
                    ],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'o'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var p = <div xx-yy="val"></div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'val'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'xx-yy'
                        }
                      }
                    ],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'p'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var e = <div xxxxx="val"></div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'val'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'xxxxx'
                        }
                      }
                    ],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'e'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const b3 = <MainButton {...{goTo:"home"}} extra />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'MainButton'
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'goTo'
                              },
                              value: {
                                type: 'Literal',
                                value: 'home'
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'extra'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'b3'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const c1 = <NoOverload  {...{onClick: (k) => {console.log(k)}}} extra />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'NoOverload'
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'onClick'
                              },
                              value: {
                                type: 'ArrowFunctionExpression',
                                body: {
                                  type: 'BlockStatement',
                                  body: [
                                    {
                                      type: 'ExpressionStatement',
                                      expression: {
                                        type: 'CallExpression',
                                        callee: {
                                          type: 'MemberExpression',
                                          object: {
                                            type: 'Identifier',
                                            name: 'console'
                                          },
                                          computed: false,
                                          property: {
                                            type: 'Identifier',
                                            name: 'log'
                                          }
                                        },
                                        arguments: [
                                          {
                                            type: 'Identifier',
                                            name: 'k'
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                },
                                params: [
                                  {
                                    type: 'Identifier',
                                    name: 'k'
                                  }
                                ],
                                async: false,
                                expression: false
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'extra'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'c1'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const d1 = <NoOverload1 {...{goTo:"home"}} extra  />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'NoOverload1'
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'goTo'
                              },
                              value: {
                                type: 'Literal',
                                value: 'home'
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'extra'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'd1'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: ' '
                    },
                    {
                      type: 'JSXElement',
                      children: [
                        {
                          type: 'JSXText',
                          value: ' Hello '
                        }
                      ],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'h2'
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'h2'
                        }
                      }
                    },
                    {
                      type: 'JSXText',
                      value: ' '
                    },
                    {
                      type: 'JSXElement',
                      children: [
                        {
                          type: 'JSXText',
                          value: ' world '
                        }
                      ],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'h1'
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'h1'
                        }
                      }
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'k1'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let k3 = <div> {1} {"That is a number"} </div>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: ' '
                    },
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Literal',
                        value: 1
                      }
                    },
                    {
                      type: 'JSXText',
                      value: ' '
                    },
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Literal',
                        value: 'That is a number'
                      }
                    },
                    {
                      type: 'JSXText',
                      value: ' '
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    }
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'k3'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '<LeftRight left=<a /> right=<b>monkeys</b> />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'LeftRight'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'a'
                        },
                        attributes: [],
                        selfClosing: true
                      },
                      closingElement: null
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'left'
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXElement',
                      children: [
                        {
                          type: 'JSXText',
                          value: 'monkeys'
                        }
                      ],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'b'
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'b'
                        }
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'right'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<america state=<usa.california></usa.california> />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'america'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXMemberExpression',
                          object: {
                            type: 'JSXIdentifier',
                            name: 'usa'
                          },
                          property: {
                            type: 'JSXIdentifier',
                            name: 'california'
                          }
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXMemberExpression',
                          object: {
                            type: 'JSXIdentifier',
                            name: 'usa'
                          },
                          property: {
                            type: 'JSXIdentifier',
                            name: 'california'
                          }
                        }
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'state'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<america state=<a/> />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'america'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'a'
                        },
                        attributes: [],
                        selfClosing: true
                      },
                      closingElement: null
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'state'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<div {...children}></div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'Identifier',
                      name: 'children'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<div {...a }>{...b}</div>',
      Context.OptionsJSX | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXSpreadChild',
                  expression: {
                    type: 'Identifier',
                    name: 'b',
                    loc: {
                      start: {
                        line: 1,
                        column: 17
                      },
                      end: {
                        line: 1,
                        column: 18
                      }
                    }
                  },
                  loc: {
                    start: {
                      line: 1,
                      column: 13
                    },
                    end: {
                      line: 1,
                      column: 19
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div',
                  loc: {
                    start: {
                      line: 1,
                      column: 1
                    },
                    end: {
                      line: 1,
                      column: 4
                    }
                  }
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'Identifier',
                      name: 'a',
                      loc: {
                        start: {
                          line: 1,
                          column: 9
                        },
                        end: {
                          line: 1,
                          column: 10
                        }
                      }
                    },
                    loc: {
                      start: {
                        line: 1,
                        column: 5
                      },
                      end: {
                        line: 1,
                        column: 12
                      }
                    }
                  }
                ],
                selfClosing: false,
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 13
                  }
                }
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div',
                  loc: {
                    start: {
                      line: 1,
                      column: 21
                    },
                    end: {
                      line: 1,
                      column: 24
                    }
                  }
                },
                loc: {
                  start: {
                    line: 1,
                    column: 19
                  },
                  end: {
                    line: 1,
                    column: 25
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
                  column: 25
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
                column: 25
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
            column: 25
          }
        }
      }
    ],
    [
      'let e1 = <EmptyProp {...{}} />',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'EmptyProp'
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'ObjectExpression',
                          properties: []
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'e1'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let e2 = <EmptyProp {...j} />',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'EmptyProp'
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'Identifier',
                          name: 'j'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'e2'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let e5 = <EmptyProp {...{ "data-prop": true}} />',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'EmptyProp'
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Literal',
                                value: 'data-prop'
                              },
                              value: {
                                type: 'Literal',
                                value: true
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'e5'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '<div>{() => <div text="wat" />}</div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'div'
                        },
                        attributes: [
                          {
                            type: 'JSXAttribute',
                            value: {
                              type: 'Literal',
                              value: 'wat'
                            },
                            name: {
                              type: 'JSXIdentifier',
                              name: 'text'
                            }
                          }
                        ],
                        selfClosing: true
                      },
                      closingElement: null
                    },
                    params: [],
                    async: false,
                    expression: true
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<Poisoned {...{x: "ok", y: "2"}} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Poisoned'
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'Literal',
                            value: 'ok'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          value: {
                            type: 'Literal',
                            value: '2'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      'let w = <Poisoned {...{x: 5, y: "2"}}/>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'Poisoned'
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              value: {
                                type: 'Literal',
                                value: 5
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            },
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'y'
                              },
                              value: {
                                type: 'Literal',
                                value: '2'
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'w'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let w1 = <Poisoned {...{x: 5, y: "2"}} X="hi" />',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'Poisoned'
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              value: {
                                type: 'Literal',
                                value: 5
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            },
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'y'
                              },
                              value: {
                                type: 'Literal',
                                value: '2'
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      },
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'Literal',
                          value: 'hi'
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'X'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'w1'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '<div>\n</div>',
      Context.OptionsJSX,
      {
        body: [
          {
            expression: {
              children: [
                {
                  type: 'JSXText',
                  value: '\n'
                }
              ],
              closingElement: {
                name: {
                  name: 'div',
                  type: 'JSXIdentifier'
                },
                type: 'JSXClosingElement'
              },
              openingElement: {
                attributes: [],
                name: {
                  name: 'div',
                  type: 'JSXIdentifier'
                },
                selfClosing: false,
                type: 'JSXOpeningElement'
              },
              type: 'JSXElement'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '<div attr="&#0123;&hellip;&#x7D;"></div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: '&#0123;&hellip;&#x7D;'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'attr'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<div attr='"'></div>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'Literal',
                      value: '"'
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'attr'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<foo bar=<baz.zoo></baz.zoo> />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'foo'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXMemberExpression',
                          object: {
                            type: 'JSXIdentifier',
                            name: 'baz'
                          },
                          property: {
                            type: 'JSXIdentifier',
                            name: 'zoo'
                          }
                        },
                        attributes: [],
                        selfClosing: false
                      },
                      closingElement: {
                        type: 'JSXClosingElement',
                        name: {
                          type: 'JSXMemberExpression',
                          object: {
                            type: 'JSXIdentifier',
                            name: 'baz'
                          },
                          property: {
                            type: 'JSXIdentifier',
                            name: 'zoo'
                          }
                        }
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'bar'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<a href={link}></a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Identifier',
                        name: 'link'
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'href'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<img width={320}/>',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 18,
              range: [0, 18],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 18,
                range: [0, 18],
                attributes: [
                  {
                    type: 'JSXAttribute',
                    start: 5,
                    end: 16,
                    range: [5, 16],
                    name: {
                      type: 'JSXIdentifier',
                      start: 5,
                      end: 10,
                      range: [5, 10],
                      name: 'width'
                    },
                    value: {
                      type: 'JSXExpressionContainer',
                      start: 11,
                      end: 16,
                      range: [11, 16],
                      expression: {
                        type: 'Literal',
                        start: 12,
                        end: 15,
                        range: [12, 15],
                        value: 320
                      }
                    }
                  }
                ],
                name: {
                  type: 'JSXIdentifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'img'
                },
                selfClosing: true
              },
              closingElement: null,
              children: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '<日本語></日本語>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: '日本語'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: '日本語'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<em>
     One
     Two
     Three
     </em>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '\n     One\n     Two\n     Three\n     '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'em'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'em'
                }
              }
            }
          }
        ]
      }
    ],

    [
      '<SolarSystem.Earth.America.USA.California.mountain-view />',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 58,
        range: [0, 58],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 58,
            range: [0, 58],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 58,
              range: [0, 58],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 58,
                range: [0, 58],
                attributes: [],
                name: {
                  type: 'JSXMemberExpression',
                  start: 1,
                  end: 55,
                  range: [1, 55],
                  object: {
                    type: 'JSXMemberExpression',
                    start: 1,
                    end: 41,
                    range: [1, 41],
                    object: {
                      type: 'JSXMemberExpression',
                      start: 1,
                      end: 30,
                      range: [1, 30],
                      object: {
                        type: 'JSXMemberExpression',
                        start: 1,
                        end: 26,
                        range: [1, 26],
                        object: {
                          type: 'JSXMemberExpression',
                          start: 1,
                          end: 18,
                          range: [1, 18],
                          object: {
                            type: 'JSXIdentifier',
                            start: 1,
                            end: 12,
                            range: [1, 12],
                            name: 'SolarSystem'
                          },
                          property: {
                            type: 'JSXIdentifier',
                            start: 13,
                            end: 18,
                            range: [13, 18],
                            name: 'Earth'
                          }
                        },
                        property: {
                          type: 'JSXIdentifier',
                          start: 19,
                          end: 26,
                          range: [19, 26],
                          name: 'America'
                        }
                      },
                      property: {
                        type: 'JSXIdentifier',
                        start: 27,
                        end: 30,
                        range: [27, 30],
                        name: 'USA'
                      }
                    },
                    property: {
                      type: 'JSXIdentifier',
                      start: 31,
                      end: 41,
                      range: [31, 41],
                      name: 'California'
                    }
                  },
                  property: {
                    type: 'JSXIdentifier',
                    start: 42,
                    end: 55,
                    range: [42, 55],
                    name: 'mountain-view'
                  }
                },
                selfClosing: true
              },
              closingElement: null,
              children: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '<div> foo:bar</div>',
      Context.OptionsJSX | Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 19,
              range: [0, 19],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 5,
                range: [0, 5],
                attributes: [],
                name: {
                  type: 'JSXIdentifier',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  name: 'div'
                },
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                start: 13,
                end: 19,
                range: [13, 19],
                name: {
                  type: 'JSXIdentifier',
                  start: 15,
                  end: 18,
                  range: [15, 18],
                  name: 'div'
                }
              },
              children: [
                {
                  type: 'JSXText',
                  start: 5,
                  end: 13,
                  range: [5, 13],
                  value: ' foo:bar',
                  raw: ' foo:bar'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '<div><li>Item 1</li><li>Item 1</li></div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'Item 1'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'li'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'li'
                    }
                  }
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'Item 1'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'li'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'li'
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<div style={{color: 'red', fontWeight: 'bold'}} />`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'color'
                            },
                            value: {
                              type: 'Literal',
                              value: 'red'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'fontWeight'
                            },
                            value: {
                              type: 'Literal',
                              value: 'bold'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'style'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<h1>Hello {data.target}</h1>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: 'Hello '
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'data'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'target'
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'h1'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'h1'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `<div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
     <h1>Move the mouse around!</h1>
     <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
   </div>`,
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '\n     '
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'Move the mouse around!'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'h1'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'h1'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: '\n     '
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'The current mouse position is ('
                    },
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'state'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    },
                    {
                      type: 'JSXText',
                      value: ', '
                    },
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'state'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'y'
                        }
                      }
                    },
                    {
                      type: 'JSXText',
                      value: ')'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'p'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'p'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: '\n   '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'height'
                            },
                            value: {
                              type: 'Literal',
                              value: '100%'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'style'
                    }
                  },
                  {
                    type: 'JSXAttribute',
                    value: {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'handleMouseMove'
                        }
                      }
                    },
                    name: {
                      type: 'JSXIdentifier',
                      name: 'onMouseMove'
                    }
                  }
                ],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'var element = <Hello name={name}/>',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'Hello'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Identifier',
                            name: 'name'
                          }
                        },
                        name: {
                          type: 'JSXIdentifier',
                          name: 'name'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'element'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var div = <div contentEditable />',
      Context.OptionsJSX,
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
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'div'
                    },
                    attributes: [
                      {
                        type: 'JSXAttribute',
                        value: null,
                        name: {
                          type: 'JSXIdentifier',
                          name: 'contentEditable'
                        }
                      }
                    ],
                    selfClosing: true
                  },
                  closingElement: null
                },
                id: {
                  type: 'Identifier',
                  name: 'div'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '<div {...this.props}/>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ThisExpression'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'props'
                      }
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<Foo> <h1>Hello {name}!</h1>   </Foo>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: ' '
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXText',
                      value: 'Hello '
                    },
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'Identifier',
                        name: 'name'
                      }
                    },
                    {
                      type: 'JSXText',
                      value: '!'
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'h1'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'h1'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: '   '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Foo'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Foo'
                }
              }
            }
          }
        ]
      }
    ],

    [
      '<Foo> {true} </Foo>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: ' '
                },
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Literal',
                    value: true
                  }
                },
                {
                  type: 'JSXText',
                  value: ' '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Foo'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'Foo'
                }
              }
            }
          }
        ]
      }
    ],

    [
      '<a>{ }</a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'JSXEmptyExpression'
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<a>{b}</a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<input disabled />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'input'
                },
                attributes: [
                  {
                    type: 'JSXAttribute',
                    value: null,
                    name: {
                      type: 'JSXIdentifier',
                      name: 'disabled'
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<a>{/* this is a comment */}</a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'JSXEmptyExpression'
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<div>@test content</div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '@test content'
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<div><br />7x invalid-js-identifier</div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'br'
                    },
                    attributes: [],
                    selfClosing: true
                  },
                  closingElement: null
                },
                {
                  type: 'JSXText',
                  value: '7x invalid-js-identifier'
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<a.b></a.b>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXMemberExpression',
                  object: {
                    type: 'JSXIdentifier',
                    name: 'a'
                  },
                  property: {
                    type: 'JSXIdentifier',
                    name: 'b'
                  }
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXMemberExpression',
                  object: {
                    type: 'JSXIdentifier',
                    name: 'a'
                  },
                  property: {
                    type: 'JSXIdentifier',
                    name: 'b'
                  }
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<a>    </a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '    '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<title>{ {caption} }</title>',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        range: [0, 28],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 28,
            range: [0, 28],
            expression: {
              type: 'JSXElement',
              start: 0,
              end: 28,
              range: [0, 28],
              openingElement: {
                type: 'JSXOpeningElement',
                start: 0,
                end: 7,
                range: [0, 7],
                attributes: [],
                name: {
                  type: 'JSXIdentifier',
                  start: 1,
                  end: 6,
                  range: [1, 6],
                  name: 'title'
                },
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                start: 20,
                end: 28,
                range: [20, 28],
                name: {
                  type: 'JSXIdentifier',
                  start: 22,
                  end: 27,
                  range: [22, 27],
                  name: 'title'
                }
              },
              children: [
                {
                  type: 'JSXExpressionContainer',
                  start: 7,
                  end: 20,
                  range: [7, 20],
                  expression: {
                    type: 'ObjectExpression',
                    start: 9,
                    end: 18,
                    range: [9, 18],
                    properties: [
                      {
                        type: 'Property',
                        start: 10,
                        end: 17,
                        range: [10, 17],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 10,
                          end: 17,
                          range: [10, 17],
                          name: 'caption'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 10,
                          end: 17,
                          range: [10, 17],
                          name: 'caption'
                        }
                      }
                    ]
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
      '"use strict"; <async />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict'
            },
            directive: 'use strict'
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'async'
                },
                attributes: [],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<A.B.C.D.E.foo-bar />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXMemberExpression',
                  object: {
                    type: 'JSXMemberExpression',
                    object: {
                      type: 'JSXMemberExpression',
                      object: {
                        type: 'JSXMemberExpression',
                        object: {
                          type: 'JSXMemberExpression',
                          object: {
                            type: 'JSXIdentifier',
                            name: 'A'
                          },
                          property: {
                            type: 'JSXIdentifier',
                            name: 'B'
                          }
                        },
                        property: {
                          type: 'JSXIdentifier',
                          name: 'C'
                        }
                      },
                      property: {
                        type: 'JSXIdentifier',
                        name: 'D'
                      }
                    },
                    property: {
                      type: 'JSXIdentifier',
                      name: 'E'
                    }
                  },
                  property: {
                    type: 'JSXIdentifier',
                    name: 'foo-bar'
                  }
                },
                attributes: [],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<a>  <b><c/></b> </a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '  '
                },
                {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXElement',
                      children: [],
                      openingElement: {
                        type: 'JSXOpeningElement',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'c'
                        },
                        attributes: [],
                        selfClosing: true
                      },
                      closingElement: null
                    }
                  ],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'b'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'b'
                    }
                  }
                },
                {
                  type: 'JSXText',
                  value: ' '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],

    [
      '<Test.X></Test.X>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXMemberExpression',
                  object: {
                    type: 'JSXIdentifier',
                    name: 'Test'
                  },
                  property: {
                    type: 'JSXIdentifier',
                    name: 'X'
                  }
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXMemberExpression',
                  object: {
                    type: 'JSXIdentifier',
                    name: 'Test'
                  },
                  property: {
                    type: 'JSXIdentifier',
                    name: 'X'
                  }
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<View {...this.props} {...this.state} />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'View'
                },
                attributes: [
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ThisExpression'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'props'
                      }
                    }
                  },
                  {
                    type: 'JSXSpreadAttribute',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ThisExpression'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'state'
                      }
                    }
                  }
                ],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<div />',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],

    [
      '<a>{}</a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'JSXEmptyExpression'
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<a> a </a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: ' a '
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<a/>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: true
              },
              closingElement: null
            }
          }
        ]
      }
    ],
    [
      '<div><span></span></div>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXElement',
                  children: [],
                  openingElement: {
                    type: 'JSXOpeningElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    },
                    attributes: [],
                    selfClosing: false
                  },
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: 'span'
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '<div>{ }</div>',
      Context.OptionsJSX | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXExpressionContainer',
                  expression: {
                    type: 'JSXEmptyExpression',
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
                    }
                  },
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
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div',
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
                  }
                },
                attributes: [],
                selfClosing: false,
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
                }
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div',
                  start: 10,
                  end: 13,
                  range: [10, 13],
                  loc: {
                    start: {
                      line: 1,
                      column: 10
                    },
                    end: {
                      line: 1,
                      column: 13
                    }
                  }
                },
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
                }
              },
              start: 0,
              end: 14,
              range: [0, 14],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 14
                }
              }
            },
            start: 0,
            end: 14,
            range: [0, 14],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 14
              }
            }
          }
        ],
        start: 0,
        end: 14,
        range: [0, 14],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 14
          }
        }
      }
    ],
    [
      '<div>&nbsp;&amp;</div>',
      Context.OptionsJSX | Context.OptionsRanges | Context.OptionsLoc | Context.OptionsRaw,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '\u00a0&',
                  raw: '&nbsp;&amp;',
                  start: 5,
                  end: 16,
                  range: [5, 16],
                  loc: {
                    start: {
                      line: 1,
                      column: 5
                    },
                    end: {
                      line: 1,
                      column: 16
                    }
                  }
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div',
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
                  }
                },
                attributes: [],
                selfClosing: false,
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
                }
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'div',
                  start: 18,
                  end: 21,
                  range: [18, 21],
                  loc: {
                    start: {
                      line: 1,
                      column: 18
                    },
                    end: {
                      line: 1,
                      column: 21
                    }
                  }
                },
                start: 16,
                end: 22,
                range: [16, 22],
                loc: {
                  start: {
                    line: 1,
                    column: 16
                  },
                  end: {
                    line: 1,
                    column: 22
                  }
                }
              },
              start: 0,
              end: 22,
              range: [0, 22],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 22
                }
              }
            },
            start: 0,
            end: 22,
            range: [0, 22],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 22
              }
            }
          }
        ],
        start: 0,
        end: 22,
        range: [0, 22],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 22
          }
        }
      }
    ],
    [
      '<a><// line\n/a>;',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a',
                  start: 1,
                  end: 2,
                  range: [1, 2]
                },
                attributes: [],
                selfClosing: false,
                start: 0,
                end: 3,
                range: [0, 3]
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a',
                  start: 13,
                  end: 14,
                  range: [13, 14]
                },
                start: 3,
                end: 15,
                range: [3, 15]
              },
              start: 0,
              end: 15,
              range: [0, 15]
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
      '<// line\na\n><\n/\na\n>;',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a',
                  start: 9,
                  end: 10,
                  range: [9, 10]
                },
                attributes: [],
                selfClosing: false,
                start: 0,
                end: 12,
                range: [0, 12]
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a',
                  start: 16,
                  end: 17,
                  range: [16, 17]
                },
                start: 12,
                end: 19,
                range: [12, 19]
              },
              start: 0,
              end: 19,
              range: [0, 19]
            },
            start: 0,
            end: 20,
            range: [0, 20]
          }
        ],
        start: 0,
        end: 20,
        range: [0, 20]
      }
    ],
    [
      '<a></* block */\n/a>;',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '</* open fragment */>\n</ /* close fragment */>;',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXFragment',
              openingFragment: {
                type: 'JSXOpeningFragment',
                start: 0,
                end: 21,
                range: [0, 21]
              },
              children: [
                {
                  type: 'JSXText',
                  value: '\n',
                  start: 21,
                  end: 22,
                  range: [21, 22]
                }
              ],
              closingFragment: {
                type: 'JSXClosingFragment',
                start: 22,
                end: 46,
                range: [22, 46]
              },
              start: 0,
              end: 46,
              range: [0, 46]
            },
            start: 0,
            end: 47,
            range: [0, 47]
          }
        ],
        start: 0,
        end: 47,
        range: [0, 47]
      }
    ],
    [
      '<a><  /a>',
      Context.OptionsJSX | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a',
                  start: 1,
                  end: 2,
                  range: [1, 2]
                },
                attributes: [],
                selfClosing: false,
                start: 0,
                end: 3,
                range: [0, 3]
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a',
                  start: 7,
                  end: 8,
                  range: [7, 8]
                },
                start: 3,
                end: 9,
                range: [3, 9]
              },
              start: 0,
              end: 9,
              range: [0, 9]
            },
            start: 0,
            end: 9,
            range: [0, 9]
          }
        ],
        start: 0,
        end: 9,
        range: [0, 9]
      }
    ]
  ]);
});
