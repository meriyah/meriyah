import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Declarations - const', () => {
  // Test keywords

  for (const arg of [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'null',
    'true',
    'false',
    'enum'
  ]) {
    it(`const ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`var ${arg} = x`, undefined, Context.None);
      });
    });

    it(`let ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`var ${arg} = x`, undefined, Context.None);
      });
    });

    it(`let ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`var ${arg} = x`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`for (const  ${arg}  = x;;);`, () => {
      t.throws(() => {
        parseSource(`for (const  ${arg}  = x;;);`, undefined, Context.None);
      });
    });
  }

  for (const arg of ['break', 'implements', 'package', 'protected', 'interface', 'private', 'public', 'static']) {
    it(`const ${arg} = x`, () => {
      t.throws(() => {
        parseSource(`const ${arg} = x`, undefined, Context.Strict);
      });
    });
    it(`for (const  ${arg}  = x;;);`, () => {
      t.throws(() => {
        parseSource(`for (const  ${arg}  = x;;);`, undefined, Context.Strict);
      });
    });

    it(`for (const  ${arg}  = x;;);`, () => {
      t.throws(() => {
        parseSource(
          `for (const  ${arg}  = x;;);`,
          undefined,
          Context.Strict | Context.Module | Context.OptionsWebCompat
        );
      });
    });
  }

  for (const arg of [
    'const a = Infinity;',
    'const b = -Infinity;',
    'const c = +Infinity;',
    'const d = /abc/;',
    'const e = /abc/g;',
    'const f = /abc/gi;',
    'const [] = x;',
    'const [,] = x;',
    'const [,,] = x;',
    'const key = 2;',
    'const state = { [key]: "foo", bar: "baz" };',
    'const { [a]: b, ...c } = d;',
    'const { [String(a)]: b, ...c } = d;',
    'const [foo] = x;',
    'const [foo,] = x;',
    'const [foo,,] = x;',
    'const [,foo] = x;',
    'const [,,foo] = x;',
    'const [foo,bar] = x;',
    'const { [i]: val, ...rest } = a',
    'const { ["1"]: number2, ...rest2 } = obj',
    'const { 1: value } = obj;',
    'const a = { 1: 0, 2: 1, 3: 2 }',
    'const i = 1',
    'const obj = { 0: true, 1: "hi", 2: true,  }',
    'const { 1: a } = b, c = d(e, ["1"]);',
    'const { [1]: number1, ...rest1 } = obj',
    'const { ["1"]: number2, ...rest2 } = obj',
    'const b = ({ x, ...rest } = {}) => {};',
    'const source = { 1: "one", 2: "two" };',
    'const { [1+0]: _, ...rest } = source;',
    'const { 1e0: _, ...rest } = source;',
    'const { 1.: _, ...rest } = source;',
    'const { 1.: _, ...rest } = source;',
    'const [foo,,bar] = x;',
    'const [foo] = x, [bar] = y;',
    'const [foo] = x, b = y;',
    'const x = y, [foo] = z;',
    'const [foo=a] = c;',
    'const [foo=a,bar] = x;',
    'const [foo,bar=b] = x;',
    'const [foo=a,bar=b] = x;',
    'const [...bar] = obj;',
    'const [foo, ...bar] = obj;',
    'const {foo,} = x;',
    'const {foo} = x, {bar} = y;',
    'const {foo} = x, b = y;',
    'const [foo, bar=b] = arr;',
    'const a = {b: {c: Function()}}',
    'const {c} = a.b',
    'const [foo=a, bar] = arr;',
    'const [foo=a] = arr;',
    'const [foo] = arr;',
    'const oo = {c: 23, ...o}',
    'const o = {a: 1, b: 2, e: 4}',
    '({a, b, ...other} = oo)',
    'const oo = {c: 23, ...o}({a, b, ...other} = oo)',
    'const o = {a: 1, b: 2, e: 4}',
    'const {a, b, ...other} = oo;',
    'const [] = x;',
    'const { data: { courses: oldCourses = [] } = {} } = getState();',
    'const { [(() => 1)()]: a, ...rest } = { 1: "a" };',
    'const [foo,bar] = arr;',
    'const [,foo] = arr;',
    'const x = y, {foo} = z;',
    'const {foo=a} = x;',
    'const {foo=a,bar} = x;',
    'const {foo,bar=b} = x;',
    'const {foo=a,bar=b} = x;',
    'const {foo:a} = x;',
    'const [a = 1] = [];',
    'const [[a]] = [[]];',
    'const {foo:a,bar} = x;',
    'const {foo,bar:b} = x;',
    'const foo = () => { return bar, baz; };',
    'const val = (function f(a, b = (() => a)) {})',
    'const { a, b, ...c } = { a: 1, b: 2, c: 3 };'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Declarations - const (fail)', [
    ['const {foo,,} = x;', Context.None],
    ['const [.x] = obj;', Context.None],
    ['const [..x] = obj;', Context.None],
    ['const [...] = obj;', Context.None],
    ['const [... ...foo] = obj;', Context.None],
    ['const [...[a, b],,] = obj;', Context.None],
    ['const [...foo,] = obj;', Context.None],
    ['for (const {};;);', Context.None],
    ['const {};', Context.None],
    ['const foo;', Context.None],
    [`do const x = 1; while (false)`, Context.None],
    ['while (false) const x = 1;', Context.None],
    ['label: const x;', Context.None],
    ['while (false) const x;', Context.None],
    ['const [...x = []] = [];', Context.None],
    ['const [...[x], y] = [1, 2, 3];', Context.None],
    ['const x, y = 1;', Context.None],
    ['do const x = 1; while (false)', Context.None],
    ['const [...{ x }, y] = [1, 2, 3];', Context.None],
    ['const [...x, y] = [1, 2, 3];', Context.None],
    // Babylon PR: https://github.com/babel/babylon/pull/195
    ['const { foo: enum } = bar();', Context.None],
    ['function foo({ bar: enum }) {}', Context.None],
    ['const foo', Context.None],
    ['const foo, bar;', Context.None],
    ['const foo, bar', Context.None],
    ['const\nfoo', Context.None],
    ['const\nfoo()', Context.None],
    ['const [foo] = arr, bar;', Context.None],
    ['const foo, [bar] = arr2;', Context.None],
    ['const [foo];', Context.None],
    ['const [foo = x];', Context.None],
    ['const [foo], bar;', Context.None],
    ['const foo, [bar];', Context.None],
    ['const [foo:bar] = obj;', Context.None],
    ['const [...foo, bar] = obj;', Context.None],
    ['const [...foo,] = obj;', Context.None],
    ['const [...foo,,] = obj;', Context.None],
    ['const [...[foo + bar]] = obj;', Context.None],
    ['const [...[foo, bar],] = obj;', Context.None],
    ['const [...[foo, bar],,] = obj;', Context.None],
    ['const [...bar = foo] = obj;', Context.None],
    ['const [... ...foo] = obj;', Context.None],
    ['const [...] = obj;', Context.None],
    ['const const', Context.None],
    ['const', Context.None],
    ['const a = 2,', Context.None],
    ['const [...,] = obj;', Context.None],
    ['const [.x] = obj;', Context.None],
    ['const [..x] = obj;', Context.None],
    ['const {,} = obj;', Context.None],
    ['const {,,} = obj;', Context.None],
    ['const {x,,} = obj;', Context.None],
    ['const {,x} = obj;', Context.None],
    ['const {,,x} = obj;', Context.None],
    ['const {x,, y} = obj;', Context.None],
    ['const {x} = a, obj;', Context.None],
    ['const x, {y} = obj;', Context.None],
    ['const {x};', Context.None],
    ['const {x}, {y} = z;', Context.None],
    ['const x, {y};', Context.None],
    ['const {x}, y;', Context.None],
    ['const x = y, {z};', Context.None],
    ['const let = 1;', Context.Strict],
    ['let let = 1;', Context.Strict],
    ['const {x=y};', Context.None],
    ['const {x:y=z};', Context.None],
    ['const {x:y=z} = obj, {a:b=c};', Context.None],
    ['const {a:=c} = z;', Context.None],
    ['const {[x] = y} = z;', Context.None],
    ['const {[x]: y};', Context.None],
    ['const {[x]} = z;', Context.None],
    ['const {[x] = y} = z;', Context.None],
    ['const {[x]: y = z};', Context.None],
    ['const {...[a]} = x', Context.OptionsWebCompat],
    ['const {...{a}} = x', Context.OptionsWebCompat],
    ['const {...[a]} = x', Context.None],
    ['const {...{a}} = x', Context.None],
    ['const {...a=b} = x', Context.None],
    ['const {...a+b} = x', Context.None],
    ['const [(x)] = []', Context.None],
    ['const a, [...x] = y', Context.None],
    ['const foo;', Context.Module],
    ['const foo, bar = x;', Context.None],
    ['const [a)] = [];', Context.None],
    ['const [[(a)], ((((((([b])))))))] = [[],[]];', Context.None],
    ['const [a--] = [];', Context.None],
    ['const [++a] = [];', Context.None],
    ['const [1, a] = [];', Context.None],
    ['const [...a, b] = [];', Context.None],
    ['const foo =x, bar;', Context.None],
    ['const foo, bar;', Context.Module],
    ['const [a, let, b] = [1, 2, 3];', Context.None],
    ['const {let} = 1;', Context.None]
  ]);

  pass('Declarations - const (pass)', [
    [
      '"use strict"; const { [eval]: []} = a;',
      Context.None,
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
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'a'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'eval'
                      },
                      computed: true,
                      value: {
                        type: 'ArrayPattern',
                        elements: []
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const { [eval]: []} = a;',
      Context.None,
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
                  type: 'Identifier',
                  name: 'a'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'eval'
                      },
                      computed: true,
                      value: {
                        type: 'ArrayPattern',
                        elements: []
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const [foo] = x, [bar] = y;',
      Context.OptionsRanges,
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
                  type: 'Identifier',
                  name: 'x',
                  start: 14,
                  end: 15,
                  range: [14, 15]
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo',
                      start: 7,
                      end: 10,
                      range: [7, 10]
                    }
                  ],
                  start: 6,
                  end: 11,
                  range: [6, 11]
                },
                start: 6,
                end: 15,
                range: [6, 15]
              },
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'y',
                  start: 25,
                  end: 26,
                  range: [25, 26]
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'bar',
                      start: 18,
                      end: 21,
                      range: [18, 21]
                    }
                  ],
                  start: 17,
                  end: 22,
                  range: [17, 22]
                },
                start: 17,
                end: 26,
                range: [17, 26]
              }
            ],
            start: 0,
            end: 27,
            range: [0, 27]
          }
        ],
        start: 0,
        end: 27,
        range: [0, 27]
      }
    ],
    [
      'const x = y, [foo] = z;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 23,
            range: [0, 23],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 11,
                range: [6, 11],
                id: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'x'
                },
                init: {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  range: [10, 11],
                  name: 'y'
                }
              },
              {
                type: 'VariableDeclarator',
                start: 13,
                end: 22,
                range: [13, 22],
                id: {
                  type: 'ArrayPattern',
                  start: 13,
                  end: 18,
                  range: [13, 18],
                  elements: [
                    {
                      type: 'Identifier',
                      start: 14,
                      end: 17,
                      range: [14, 17],
                      name: 'foo'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
                  range: [21, 22],
                  name: 'z'
                }
              }
            ],
            kind: 'const'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'const [foo=a,bar=b] = x;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        range: [0, 24],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 24,
            range: [0, 24],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 23,
                range: [6, 23],
                id: {
                  type: 'ArrayPattern',
                  start: 6,
                  end: 19,
                  range: [6, 19],
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      start: 7,
                      end: 12,
                      range: [7, 12],
                      left: {
                        type: 'Identifier',
                        start: 7,
                        end: 10,
                        range: [7, 10],
                        name: 'foo'
                      },
                      right: {
                        type: 'Identifier',
                        start: 11,
                        end: 12,
                        range: [11, 12],
                        name: 'a'
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      start: 13,
                      end: 18,
                      range: [13, 18],
                      left: {
                        type: 'Identifier',
                        start: 13,
                        end: 16,
                        range: [13, 16],
                        name: 'bar'
                      },
                      right: {
                        type: 'Identifier',
                        start: 17,
                        end: 18,
                        range: [17, 18],
                        name: 'b'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 22,
                  end: 23,
                  range: [22, 23],
                  name: 'x'
                }
              }
            ],
            kind: 'const'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'const [...bar] = obj;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        range: [0, 21],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 21,
            range: [0, 21],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 20,
                range: [6, 20],
                id: {
                  type: 'ArrayPattern',
                  start: 6,
                  end: 14,
                  range: [6, 14],
                  elements: [
                    {
                      type: 'RestElement',
                      start: 7,
                      end: 13,
                      range: [7, 13],
                      argument: {
                        type: 'Identifier',
                        start: 10,
                        end: 13,
                        range: [10, 13],
                        name: 'bar'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 17,
                  end: 20,
                  range: [17, 20],
                  name: 'obj'
                }
              }
            ],
            kind: 'const'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'const x = y, {foo} = z;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 23,
            range: [0, 23],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 11,
                range: [6, 11],
                id: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'x'
                },
                init: {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  range: [10, 11],
                  name: 'y'
                }
              },
              {
                type: 'VariableDeclarator',
                start: 13,
                end: 22,
                range: [13, 22],
                id: {
                  type: 'ObjectPattern',
                  start: 13,
                  end: 18,
                  range: [13, 18],
                  properties: [
                    {
                      type: 'Property',
                      start: 14,
                      end: 17,
                      range: [14, 17],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 14,
                        end: 17,
                        range: [14, 17],
                        name: 'foo'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 14,
                        end: 17,
                        range: [14, 17],
                        name: 'foo'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
                  range: [21, 22],
                  name: 'z'
                }
              }
            ],
            kind: 'const'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'const {foo:a,bar:b} = x;',
      Context.OptionsLoc | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        range: [0, 24],
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
            type: 'VariableDeclaration',
            start: 0,
            end: 24,
            range: [0, 24],
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 23,
                range: [6, 23],
                loc: {
                  start: {
                    line: 1,
                    column: 6
                  },
                  end: {
                    line: 1,
                    column: 23
                  }
                },
                id: {
                  type: 'ObjectPattern',
                  start: 6,
                  end: 19,
                  range: [6, 19],
                  loc: {
                    start: {
                      line: 1,
                      column: 6
                    },
                    end: {
                      line: 1,
                      column: 19
                    }
                  },
                  properties: [
                    {
                      type: 'Property',
                      start: 7,
                      end: 12,
                      range: [7, 12],
                      loc: {
                        start: {
                          line: 1,
                          column: 7
                        },
                        end: {
                          line: 1,
                          column: 12
                        }
                      },
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
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
                        name: 'foo'
                      },
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
                        name: 'a'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
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
                      },
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 13,
                        end: 16,
                        range: [13, 16],
                        loc: {
                          start: {
                            line: 1,
                            column: 13
                          },
                          end: {
                            line: 1,
                            column: 16
                          }
                        },
                        name: 'bar'
                      },
                      value: {
                        type: 'Identifier',
                        start: 17,
                        end: 18,
                        range: [17, 18],
                        loc: {
                          start: {
                            line: 1,
                            column: 17
                          },
                          end: {
                            line: 1,
                            column: 18
                          }
                        },
                        name: 'b'
                      },
                      kind: 'init'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 22,
                  end: 23,
                  range: [22, 23],
                  loc: {
                    start: {
                      line: 1,
                      column: 22
                    },
                    end: {
                      line: 1,
                      column: 23
                    }
                  },
                  name: 'x'
                }
              }
            ],
            kind: 'const'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'const a = b',
      Context.None,
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
                  type: 'Identifier',
                  name: 'b'
                },
                id: {
                  type: 'Identifier',
                  name: 'a'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'for (const [,,] of x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [null, null]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (const [,] of x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [null]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (const {a, [x]: y} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: true,
                        value: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (const {x : y, z, a : b = c} in obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 41,
        range: [0, 41],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 41,
            range: [0, 41],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 32,
              range: [5, 32],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 11,
                  end: 32,
                  range: [11, 32],
                  id: {
                    type: 'ObjectPattern',
                    start: 11,
                    end: 32,
                    range: [11, 32],
                    properties: [
                      {
                        type: 'Property',
                        start: 12,
                        end: 17,
                        range: [12, 17],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 12,
                          end: 13,
                          range: [12, 13],
                          name: 'x'
                        },
                        value: {
                          type: 'Identifier',
                          start: 16,
                          end: 17,
                          range: [16, 17],
                          name: 'y'
                        },
                        kind: 'init'
                      },
                      {
                        type: 'Property',
                        start: 19,
                        end: 20,
                        range: [19, 20],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 19,
                          end: 20,
                          range: [19, 20],
                          name: 'z'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 19,
                          end: 20,
                          range: [19, 20],
                          name: 'z'
                        }
                      },
                      {
                        type: 'Property',
                        start: 22,
                        end: 31,
                        range: [22, 31],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 22,
                          end: 23,
                          range: [22, 23],
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          start: 26,
                          end: 31,
                          range: [26, 31],
                          left: {
                            type: 'Identifier',
                            start: 26,
                            end: 27,
                            range: [26, 27],
                            name: 'b'
                          },
                          right: {
                            type: 'Identifier',
                            start: 30,
                            end: 31,
                            range: [30, 31],
                            name: 'c'
                          }
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'const'
            },
            right: {
              type: 'Identifier',
              start: 36,
              end: 39,
              range: [36, 39],
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement',
              start: 40,
              end: 41,
              range: [40, 41]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `const {
        [({ ...rest }) => {
          let { ...b } = {};
        }]: a,
        [({ ...d } = {})]: c,
      } = {};`,
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  properties: [
                    {
                      computed: true,
                      key: {
                        async: false,
                        body: {
                          body: [
                            {
                              declarations: [
                                {
                                  id: {
                                    properties: [
                                      {
                                        argument: {
                                          name: 'b',
                                          type: 'Identifier'
                                        },
                                        type: 'RestElement'
                                      }
                                    ],
                                    type: 'ObjectPattern'
                                  },
                                  init: {
                                    properties: [],
                                    type: 'ObjectExpression'
                                  },
                                  type: 'VariableDeclarator'
                                }
                              ],
                              kind: 'let',
                              type: 'VariableDeclaration'
                            }
                          ],
                          type: 'BlockStatement'
                        },
                        expression: false,

                        params: [
                          {
                            properties: [
                              {
                                argument: {
                                  name: 'rest',
                                  type: 'Identifier'
                                },
                                type: 'RestElement'
                              }
                            ],
                            type: 'ObjectPattern'
                          }
                        ],
                        type: 'ArrowFunctionExpression'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        name: 'a',
                        type: 'Identifier'
                      }
                    },
                    {
                      computed: true,
                      key: {
                        left: {
                          properties: [
                            {
                              argument: {
                                name: 'd',
                                type: 'Identifier'
                              },
                              type: 'RestElement'
                            }
                          ],
                          type: 'ObjectPattern'
                        },
                        operator: '=',
                        right: {
                          properties: [],
                          type: 'ObjectExpression'
                        },
                        type: 'AssignmentExpression'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        name: 'c',
                        type: 'Identifier'
                      }
                    }
                  ],
                  type: 'ObjectPattern'
                },
                init: {
                  properties: [],
                  type: 'ObjectExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'const',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `const {
          a = ({ ...rest }) => {
            let { ...b } = {};
          },
          c = ({ ...d } = {}),
        } = {};`,
      Context.None,
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
                  type: 'ObjectExpression',
                  properties: []
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        right: {
                          type: 'ArrowFunctionExpression',
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'VariableDeclaration',
                                kind: 'let',
                                declarations: [
                                  {
                                    type: 'VariableDeclarator',
                                    init: {
                                      type: 'ObjectExpression',
                                      properties: []
                                    },
                                    id: {
                                      type: 'ObjectPattern',
                                      properties: [
                                        {
                                          type: 'RestElement',
                                          argument: {
                                            type: 'Identifier',
                                            name: 'b'
                                          }
                                        }
                                      ]
                                    }
                                  }
                                ]
                              }
                            ]
                          },
                          params: [
                            {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'RestElement',
                                  argument: {
                                    type: 'Identifier',
                                    name: 'rest'
                                  }
                                }
                              ]
                            }
                          ],
                          async: false,
                          expression: false
                        }
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        right: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'RestElement',
                                argument: {
                                  type: 'Identifier',
                                  name: 'd'
                                }
                              }
                            ]
                          },
                          operator: '=',
                          right: {
                            type: 'ObjectExpression',
                            properties: []
                          }
                        }
                      },
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'const { a: { ...bar }, b: { ...baz }, ...foo } = obj;',
      Context.None,
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
                  type: 'Identifier',
                  name: 'obj'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: false,
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'bar'
                            }
                          }
                        ]
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      computed: false,
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'baz'
                            }
                          }
                        ]
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `var z = {};
            var { ...x } = z;
            var { ...a } = { a: 1 };
            var { ...x } = a.b;
            var { ...x } = a();
            var {x1, ...y1} = z;
            x1++;
            var { [a]: b, ...c } = z;
            var {x1, ...y1} = z;
            let {x2, y2, ...z2} = z;
            const {w3, x3, y3, ...z4} = z;

            let {
              x: { a: xa, [d]: f, ...asdf },
              y: { ...d },
              ...g
            } = complex;

            let { x4: { ...y4 } } = z;`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 519,
        range: [0, 519],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 11,
            range: [0, 11],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 10,
                range: [4, 10],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'z'
                },
                init: {
                  type: 'ObjectExpression',
                  start: 8,
                  end: 10,
                  range: [8, 10],
                  properties: []
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'VariableDeclaration',
            start: 24,
            end: 41,
            range: [24, 41],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 28,
                end: 40,
                range: [28, 40],
                id: {
                  type: 'ObjectPattern',
                  start: 28,
                  end: 36,
                  range: [28, 36],
                  properties: [
                    {
                      type: 'RestElement',
                      start: 30,
                      end: 34,
                      range: [30, 34],
                      argument: {
                        type: 'Identifier',
                        start: 33,
                        end: 34,
                        range: [33, 34],
                        name: 'x'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 39,
                  end: 40,
                  range: [39, 40],
                  name: 'z'
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'VariableDeclaration',
            start: 54,
            end: 78,
            range: [54, 78],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 58,
                end: 77,
                range: [58, 77],
                id: {
                  type: 'ObjectPattern',
                  start: 58,
                  end: 66,
                  range: [58, 66],
                  properties: [
                    {
                      type: 'RestElement',
                      start: 60,
                      end: 64,
                      range: [60, 64],
                      argument: {
                        type: 'Identifier',
                        start: 63,
                        end: 64,
                        range: [63, 64],
                        name: 'a'
                      }
                    }
                  ]
                },
                init: {
                  type: 'ObjectExpression',
                  start: 69,
                  end: 77,
                  range: [69, 77],
                  properties: [
                    {
                      type: 'Property',
                      start: 71,
                      end: 75,
                      range: [71, 75],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 71,
                        end: 72,
                        range: [71, 72],
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        start: 74,
                        end: 75,
                        range: [74, 75],
                        value: 1
                      },
                      kind: 'init'
                    }
                  ]
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'VariableDeclaration',
            start: 91,
            end: 110,
            range: [91, 110],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 95,
                end: 109,
                range: [95, 109],
                id: {
                  type: 'ObjectPattern',
                  start: 95,
                  end: 103,
                  range: [95, 103],
                  properties: [
                    {
                      type: 'RestElement',
                      start: 97,
                      end: 101,
                      range: [97, 101],
                      argument: {
                        type: 'Identifier',
                        start: 100,
                        end: 101,
                        range: [100, 101],
                        name: 'x'
                      }
                    }
                  ]
                },
                init: {
                  type: 'MemberExpression',
                  start: 106,
                  end: 109,
                  range: [106, 109],
                  object: {
                    type: 'Identifier',
                    start: 106,
                    end: 107,
                    range: [106, 107],
                    name: 'a'
                  },
                  property: {
                    type: 'Identifier',
                    start: 108,
                    end: 109,
                    range: [108, 109],
                    name: 'b'
                  },
                  computed: false
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'VariableDeclaration',
            start: 123,
            end: 142,
            range: [123, 142],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 127,
                end: 141,
                range: [127, 141],
                id: {
                  type: 'ObjectPattern',
                  start: 127,
                  end: 135,
                  range: [127, 135],
                  properties: [
                    {
                      type: 'RestElement',
                      start: 129,
                      end: 133,
                      range: [129, 133],
                      argument: {
                        type: 'Identifier',
                        start: 132,
                        end: 133,
                        range: [132, 133],
                        name: 'x'
                      }
                    }
                  ]
                },
                init: {
                  type: 'CallExpression',
                  start: 138,
                  end: 141,
                  range: [138, 141],
                  callee: {
                    type: 'Identifier',
                    start: 138,
                    end: 139,
                    range: [138, 139],
                    name: 'a'
                  },
                  arguments: []
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'VariableDeclaration',
            start: 155,
            end: 175,
            range: [155, 175],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 159,
                end: 174,
                range: [159, 174],
                id: {
                  type: 'ObjectPattern',
                  start: 159,
                  end: 170,
                  range: [159, 170],
                  properties: [
                    {
                      type: 'Property',
                      start: 160,
                      end: 162,
                      range: [160, 162],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 160,
                        end: 162,
                        range: [160, 162],
                        name: 'x1'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 160,
                        end: 162,
                        range: [160, 162],
                        name: 'x1'
                      }
                    },
                    {
                      type: 'RestElement',
                      start: 164,
                      end: 169,
                      range: [164, 169],
                      argument: {
                        type: 'Identifier',
                        start: 167,
                        end: 169,
                        range: [167, 169],
                        name: 'y1'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 173,
                  end: 174,
                  range: [173, 174],
                  name: 'z'
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExpressionStatement',
            start: 188,
            end: 193,
            range: [188, 193],
            expression: {
              type: 'UpdateExpression',
              start: 188,
              end: 192,
              range: [188, 192],
              operator: '++',
              prefix: false,
              argument: {
                type: 'Identifier',
                start: 188,
                end: 190,
                range: [188, 190],
                name: 'x1'
              }
            }
          },
          {
            type: 'VariableDeclaration',
            start: 206,
            end: 231,
            range: [206, 231],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 210,
                end: 230,
                range: [210, 230],
                id: {
                  type: 'ObjectPattern',
                  start: 210,
                  end: 226,
                  range: [210, 226],
                  properties: [
                    {
                      type: 'Property',
                      start: 212,
                      end: 218,
                      range: [212, 218],
                      method: false,
                      shorthand: false,
                      computed: true,
                      key: {
                        type: 'Identifier',
                        start: 213,
                        end: 214,
                        range: [213, 214],
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        start: 217,
                        end: 218,
                        range: [217, 218],
                        name: 'b'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'RestElement',
                      start: 220,
                      end: 224,
                      range: [220, 224],
                      argument: {
                        type: 'Identifier',
                        start: 223,
                        end: 224,
                        range: [223, 224],
                        name: 'c'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 229,
                  end: 230,
                  range: [229, 230],
                  name: 'z'
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'VariableDeclaration',
            start: 244,
            end: 264,
            range: [244, 264],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 248,
                end: 263,
                range: [248, 263],
                id: {
                  type: 'ObjectPattern',
                  start: 248,
                  end: 259,
                  range: [248, 259],
                  properties: [
                    {
                      type: 'Property',
                      start: 249,
                      end: 251,
                      range: [249, 251],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 249,
                        end: 251,
                        range: [249, 251],
                        name: 'x1'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 249,
                        end: 251,
                        range: [249, 251],
                        name: 'x1'
                      }
                    },
                    {
                      type: 'RestElement',
                      start: 253,
                      end: 258,
                      range: [253, 258],
                      argument: {
                        type: 'Identifier',
                        start: 256,
                        end: 258,
                        range: [256, 258],
                        name: 'y1'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 262,
                  end: 263,
                  range: [262, 263],
                  name: 'z'
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'VariableDeclaration',
            start: 277,
            end: 301,
            range: [277, 301],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 281,
                end: 300,
                range: [281, 300],
                id: {
                  type: 'ObjectPattern',
                  start: 281,
                  end: 296,
                  range: [281, 296],
                  properties: [
                    {
                      type: 'Property',
                      start: 282,
                      end: 284,
                      range: [282, 284],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 282,
                        end: 284,
                        range: [282, 284],
                        name: 'x2'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 282,
                        end: 284,
                        range: [282, 284],
                        name: 'x2'
                      }
                    },
                    {
                      type: 'Property',
                      start: 286,
                      end: 288,
                      range: [286, 288],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 286,
                        end: 288,
                        range: [286, 288],
                        name: 'y2'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 286,
                        end: 288,
                        range: [286, 288],
                        name: 'y2'
                      }
                    },
                    {
                      type: 'RestElement',
                      start: 290,
                      end: 295,
                      range: [290, 295],
                      argument: {
                        type: 'Identifier',
                        start: 293,
                        end: 295,
                        range: [293, 295],
                        name: 'z2'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 299,
                  end: 300,
                  range: [299, 300],
                  name: 'z'
                }
              }
            ],
            kind: 'let'
          },
          {
            type: 'VariableDeclaration',
            start: 314,
            end: 344,
            range: [314, 344],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 320,
                end: 343,
                range: [320, 343],
                id: {
                  type: 'ObjectPattern',
                  start: 320,
                  end: 339,
                  range: [320, 339],
                  properties: [
                    {
                      type: 'Property',
                      start: 321,
                      end: 323,
                      range: [321, 323],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 321,
                        end: 323,
                        range: [321, 323],
                        name: 'w3'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 321,
                        end: 323,
                        range: [321, 323],
                        name: 'w3'
                      }
                    },
                    {
                      type: 'Property',
                      start: 325,
                      end: 327,
                      range: [325, 327],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 325,
                        end: 327,
                        range: [325, 327],
                        name: 'x3'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 325,
                        end: 327,
                        range: [325, 327],
                        name: 'x3'
                      }
                    },
                    {
                      type: 'Property',
                      start: 329,
                      end: 331,
                      range: [329, 331],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 329,
                        end: 331,
                        range: [329, 331],
                        name: 'y3'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 329,
                        end: 331,
                        range: [329, 331],
                        name: 'y3'
                      }
                    },
                    {
                      type: 'RestElement',
                      start: 333,
                      end: 338,
                      range: [333, 338],
                      argument: {
                        type: 'Identifier',
                        start: 336,
                        end: 338,
                        range: [336, 338],
                        name: 'z4'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 342,
                  end: 343,
                  range: [342, 343],
                  name: 'z'
                }
              }
            ],
            kind: 'const'
          },
          {
            type: 'VariableDeclaration',
            start: 358,
            end: 479,
            range: [358, 479],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 362,
                end: 478,
                range: [362, 478],
                id: {
                  type: 'ObjectPattern',
                  start: 362,
                  end: 468,
                  range: [362, 468],
                  properties: [
                    {
                      type: 'Property',
                      start: 378,
                      end: 407,
                      range: [378, 407],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 378,
                        end: 379,
                        range: [378, 379],
                        name: 'x'
                      },
                      value: {
                        type: 'ObjectPattern',
                        start: 381,
                        end: 407,
                        range: [381, 407],
                        properties: [
                          {
                            type: 'Property',
                            start: 383,
                            end: 388,
                            range: [383, 388],
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 383,
                              end: 384,
                              range: [383, 384],
                              name: 'a'
                            },
                            value: {
                              type: 'Identifier',
                              start: 386,
                              end: 388,
                              range: [386, 388],
                              name: 'xa'
                            },
                            kind: 'init'
                          },
                          {
                            type: 'Property',
                            start: 390,
                            end: 396,
                            range: [390, 396],
                            method: false,
                            shorthand: false,
                            computed: true,
                            key: {
                              type: 'Identifier',
                              start: 391,
                              end: 392,
                              range: [391, 392],
                              name: 'd'
                            },
                            value: {
                              type: 'Identifier',
                              start: 395,
                              end: 396,
                              range: [395, 396],
                              name: 'f'
                            },
                            kind: 'init'
                          },
                          {
                            type: 'RestElement',
                            start: 398,
                            end: 405,
                            range: [398, 405],
                            argument: {
                              type: 'Identifier',
                              start: 401,
                              end: 405,
                              range: [401, 405],
                              name: 'asdf'
                            }
                          }
                        ]
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 423,
                      end: 434,
                      range: [423, 434],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 423,
                        end: 424,
                        range: [423, 424],
                        name: 'y'
                      },
                      value: {
                        type: 'ObjectPattern',
                        start: 426,
                        end: 434,
                        range: [426, 434],
                        properties: [
                          {
                            type: 'RestElement',
                            start: 428,
                            end: 432,
                            range: [428, 432],
                            argument: {
                              type: 'Identifier',
                              start: 431,
                              end: 432,
                              range: [431, 432],
                              name: 'd'
                            }
                          }
                        ]
                      },
                      kind: 'init'
                    },
                    {
                      type: 'RestElement',
                      start: 450,
                      end: 454,
                      range: [450, 454],
                      argument: {
                        type: 'Identifier',
                        start: 453,
                        end: 454,
                        range: [453, 454],
                        name: 'g'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 471,
                  end: 478,
                  range: [471, 478],
                  name: 'complex'
                }
              }
            ],
            kind: 'let'
          },
          {
            type: 'VariableDeclaration',
            start: 493,
            end: 519,
            range: [493, 519],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 497,
                end: 518,
                range: [497, 518],
                id: {
                  type: 'ObjectPattern',
                  start: 497,
                  end: 514,
                  range: [497, 514],
                  properties: [
                    {
                      type: 'Property',
                      start: 499,
                      end: 512,
                      range: [499, 512],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 499,
                        end: 501,
                        range: [499, 501],
                        name: 'x4'
                      },
                      value: {
                        type: 'ObjectPattern',
                        start: 503,
                        end: 512,
                        range: [503, 512],
                        properties: [
                          {
                            type: 'RestElement',
                            start: 505,
                            end: 510,
                            range: [505, 510],
                            argument: {
                              type: 'Identifier',
                              start: 508,
                              end: 510,
                              range: [508, 510],
                              name: 'y4'
                            }
                          }
                        ]
                      },
                      kind: 'init'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 517,
                  end: 518,
                  range: [517, 518],
                  name: 'z'
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
      `let {
                a: [b, ...arrayRest],
                c = function(...functionRest){},
                ...objectRest
              } = {
                a: [1, 2, 3, 4],
                d: "oyez"
              };`,
      Context.None,
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
                        name: 'a'
                      },
                      value: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Literal',
                            value: 1
                          },
                          {
                            type: 'Literal',
                            value: 2
                          },
                          {
                            type: 'Literal',
                            value: 3
                          },
                          {
                            type: 'Literal',
                            value: 4
                          }
                        ]
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
                        name: 'd'
                      },
                      value: {
                        type: 'Literal',
                        value: 'oyez'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: false,
                      value: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'b'
                          },
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'arrayRest'
                            }
                          }
                        ]
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        right: {
                          type: 'FunctionExpression',
                          params: [
                            {
                              type: 'RestElement',
                              argument: {
                                type: 'Identifier',
                                name: 'functionRest'
                              }
                            }
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: []
                          },
                          async: false,
                          generator: false,

                          id: null
                        }
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'objectRest'
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `// ForXStatement
                for (var {a, ...b} of []) {}
                for ({a, ...b} of []) {}
                async function a() {
                  for await ({a, ...b} of []) {}
                }

                // skip
                for ({a} in {}) {}
                for ({a} of []) {}
                async function a() {
                  for await ({a} of []) {}
                }

                for (a in {}) {}
                for (a of []) {}
                async function a() {
                  for await (a of []) {}
                }`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 562,
        range: [0, 562],
        body: [
          {
            type: 'ForOfStatement',
            start: 33,
            end: 61,
            range: [33, 61],
            await: false,
            left: {
              type: 'VariableDeclaration',
              start: 38,
              end: 51,
              range: [38, 51],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 42,
                  end: 51,
                  range: [42, 51],
                  id: {
                    type: 'ObjectPattern',
                    start: 42,
                    end: 51,
                    range: [42, 51],
                    properties: [
                      {
                        type: 'Property',
                        start: 43,
                        end: 44,
                        range: [43, 44],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 43,
                          end: 44,
                          range: [43, 44],
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 43,
                          end: 44,
                          range: [43, 44],
                          name: 'a'
                        }
                      },
                      {
                        type: 'RestElement',
                        start: 46,
                        end: 50,
                        range: [46, 50],
                        argument: {
                          type: 'Identifier',
                          start: 49,
                          end: 50,
                          range: [49, 50],
                          name: 'b'
                        }
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'ArrayExpression',
              start: 55,
              end: 57,
              range: [55, 57],
              elements: []
            },
            body: {
              type: 'BlockStatement',
              start: 59,
              end: 61,
              range: [59, 61],
              body: []
            }
          },
          {
            type: 'ForOfStatement',
            start: 78,
            end: 102,
            range: [78, 102],
            await: false,
            left: {
              type: 'ObjectPattern',
              start: 83,
              end: 92,
              range: [83, 92],
              properties: [
                {
                  type: 'Property',
                  start: 84,
                  end: 85,
                  range: [84, 85],
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 84,
                    end: 85,
                    range: [84, 85],
                    name: 'a'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 84,
                    end: 85,
                    range: [84, 85],
                    name: 'a'
                  }
                },
                {
                  type: 'RestElement',
                  start: 87,
                  end: 91,
                  range: [87, 91],
                  argument: {
                    type: 'Identifier',
                    start: 90,
                    end: 91,
                    range: [90, 91],
                    name: 'b'
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              start: 96,
              end: 98,
              range: [96, 98],
              elements: []
            },
            body: {
              type: 'BlockStatement',
              start: 100,
              end: 102,
              range: [100, 102],
              body: []
            }
          },
          {
            type: 'FunctionDeclaration',
            start: 119,
            end: 206,
            range: [119, 206],
            id: {
              type: 'Identifier',
              start: 134,
              end: 135,
              range: [134, 135],
              name: 'a'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 138,
              end: 206,
              range: [138, 206],
              body: [
                {
                  type: 'ForOfStatement',
                  start: 158,
                  end: 188,
                  range: [158, 188],
                  await: true,
                  left: {
                    type: 'ObjectPattern',
                    start: 169,
                    end: 178,
                    range: [169, 178],
                    properties: [
                      {
                        type: 'Property',
                        start: 170,
                        end: 171,
                        range: [170, 171],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 170,
                          end: 171,
                          range: [170, 171],
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 170,
                          end: 171,
                          range: [170, 171],
                          name: 'a'
                        }
                      },
                      {
                        type: 'RestElement',
                        start: 173,
                        end: 177,
                        range: [173, 177],
                        argument: {
                          type: 'Identifier',
                          start: 176,
                          end: 177,
                          range: [176, 177],
                          name: 'b'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    start: 182,
                    end: 184,
                    range: [182, 184],
                    elements: []
                  },
                  body: {
                    type: 'BlockStatement',
                    start: 186,
                    end: 188,
                    range: [186, 188],
                    body: []
                  }
                }
              ]
            }
          },
          {
            type: 'ForInStatement',
            start: 248,
            end: 266,
            range: [248, 266],
            left: {
              type: 'ObjectPattern',
              start: 253,
              end: 256,
              range: [253, 256],
              properties: [
                {
                  type: 'Property',
                  start: 254,
                  end: 255,
                  range: [254, 255],
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 254,
                    end: 255,
                    range: [254, 255],
                    name: 'a'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 254,
                    end: 255,
                    range: [254, 255],
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'ObjectExpression',
              start: 260,
              end: 262,
              range: [260, 262],
              properties: []
            },
            body: {
              type: 'BlockStatement',
              start: 264,
              end: 266,
              range: [264, 266],
              body: []
            }
          },
          {
            type: 'ForOfStatement',
            start: 283,
            end: 301,
            range: [283, 301],
            await: false,
            left: {
              type: 'ObjectPattern',
              start: 288,
              end: 291,
              range: [288, 291],
              properties: [
                {
                  type: 'Property',
                  start: 289,
                  end: 290,
                  range: [289, 290],
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 289,
                    end: 290,
                    range: [289, 290],
                    name: 'a'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 289,
                    end: 290,
                    range: [289, 290],
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              start: 295,
              end: 297,
              range: [295, 297],
              elements: []
            },
            body: {
              type: 'BlockStatement',
              start: 299,
              end: 301,
              range: [299, 301],
              body: []
            }
          },
          {
            type: 'FunctionDeclaration',
            start: 318,
            end: 399,
            range: [318, 399],
            id: {
              type: 'Identifier',
              start: 333,
              end: 334,
              range: [333, 334],
              name: 'a'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 337,
              end: 399,
              range: [337, 399],
              body: [
                {
                  type: 'ForOfStatement',
                  start: 357,
                  end: 381,
                  range: [357, 381],
                  await: true,
                  left: {
                    type: 'ObjectPattern',
                    start: 368,
                    end: 371,
                    range: [368, 371],
                    properties: [
                      {
                        type: 'Property',
                        start: 369,
                        end: 370,
                        range: [369, 370],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 369,
                          end: 370,
                          range: [369, 370],
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 369,
                          end: 370,
                          range: [369, 370],
                          name: 'a'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    start: 375,
                    end: 377,
                    range: [375, 377],
                    elements: []
                  },
                  body: {
                    type: 'BlockStatement',
                    start: 379,
                    end: 381,
                    range: [379, 381],
                    body: []
                  }
                }
              ]
            }
          },
          {
            type: 'ForInStatement',
            start: 417,
            end: 433,
            range: [417, 433],
            left: {
              type: 'Identifier',
              start: 422,
              end: 423,
              range: [422, 423],
              name: 'a'
            },
            right: {
              type: 'ObjectExpression',
              start: 427,
              end: 429,
              range: [427, 429],
              properties: []
            },
            body: {
              type: 'BlockStatement',
              start: 431,
              end: 433,
              range: [431, 433],
              body: []
            }
          },
          {
            type: 'ForOfStatement',
            start: 450,
            end: 466,
            range: [450, 466],
            await: false,
            left: {
              type: 'Identifier',
              start: 455,
              end: 456,
              range: [455, 456],
              name: 'a'
            },
            right: {
              type: 'ArrayExpression',
              start: 460,
              end: 462,
              range: [460, 462],
              elements: []
            },
            body: {
              type: 'BlockStatement',
              start: 464,
              end: 466,
              range: [464, 466],
              body: []
            }
          },
          {
            type: 'FunctionDeclaration',
            start: 483,
            end: 562,
            range: [483, 562],
            id: {
              type: 'Identifier',
              start: 498,
              end: 499,
              range: [498, 499],
              name: 'a'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 502,
              end: 562,
              range: [502, 562],
              body: [
                {
                  type: 'ForOfStatement',
                  start: 522,
                  end: 544,
                  range: [522, 544],
                  await: true,
                  left: {
                    type: 'Identifier',
                    start: 533,
                    end: 534,
                    range: [533, 534],
                    name: 'a'
                  },
                  right: {
                    type: 'ArrayExpression',
                    start: 538,
                    end: 540,
                    range: [538, 540],
                    elements: []
                  },
                  body: {
                    type: 'BlockStatement',
                    start: 542,
                    end: 544,
                    range: [542, 544],
                    body: []
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
      'const foo = bar;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'foo'
                },
                init: {
                  type: 'Identifier',
                  name: 'bar'
                }
              }
            ],
            kind: 'const'
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
