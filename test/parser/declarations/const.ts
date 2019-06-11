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
            }
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
                  end: 15
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo',
                      start: 7,
                      end: 10
                    }
                  ],
                  start: 6,
                  end: 11
                },
                start: 6,
                end: 15
              },
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'y',
                  start: 25,
                  end: 26
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'bar',
                      start: 18,
                      end: 21
                    }
                  ],
                  start: 17,
                  end: 22
                },
                start: 17,
                end: 26
              }
            ],
            start: 0,
            end: 27
          }
        ],
        start: 0,
        end: 27
      }
    ],
    [
      'const x = y, [foo] = z;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 23,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 11,
                id: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  name: 'x'
                },
                init: {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  name: 'y'
                }
              },
              {
                type: 'VariableDeclarator',
                start: 13,
                end: 22,
                id: {
                  type: 'ArrayPattern',
                  start: 13,
                  end: 18,
                  elements: [
                    {
                      type: 'Identifier',
                      start: 14,
                      end: 17,
                      name: 'foo'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
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
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 24,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 23,
                id: {
                  type: 'ArrayPattern',
                  start: 6,
                  end: 19,
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      start: 7,
                      end: 12,
                      left: {
                        type: 'Identifier',
                        start: 7,
                        end: 10,
                        name: 'foo'
                      },
                      right: {
                        type: 'Identifier',
                        start: 11,
                        end: 12,
                        name: 'a'
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      start: 13,
                      end: 18,
                      left: {
                        type: 'Identifier',
                        start: 13,
                        end: 16,
                        name: 'bar'
                      },
                      right: {
                        type: 'Identifier',
                        start: 17,
                        end: 18,
                        name: 'b'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 22,
                  end: 23,
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
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 21,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 20,
                id: {
                  type: 'ArrayPattern',
                  start: 6,
                  end: 14,
                  elements: [
                    {
                      type: 'RestElement',
                      start: 7,
                      end: 13,
                      argument: {
                        type: 'Identifier',
                        start: 10,
                        end: 13,
                        name: 'bar'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 17,
                  end: 20,
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
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 23,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 11,
                id: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  name: 'x'
                },
                init: {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  name: 'y'
                }
              },
              {
                type: 'VariableDeclarator',
                start: 13,
                end: 22,
                id: {
                  type: 'ObjectPattern',
                  start: 13,
                  end: 18,
                  properties: [
                    {
                      type: 'Property',
                      start: 14,
                      end: 17,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 14,
                        end: 17,
                        name: 'foo'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 14,
                        end: 17,
                        name: 'foo'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
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
                  name: 'x'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'b'
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
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 41,
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 32,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 11,
                  end: 32,
                  id: {
                    type: 'ObjectPattern',
                    start: 11,
                    end: 32,
                    properties: [
                      {
                        type: 'Property',
                        start: 12,
                        end: 17,
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 12,
                          end: 13,
                          name: 'x'
                        },
                        value: {
                          type: 'Identifier',
                          start: 16,
                          end: 17,
                          name: 'y'
                        },
                        kind: 'init'
                      },
                      {
                        type: 'Property',
                        start: 19,
                        end: 20,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 19,
                          end: 20,
                          name: 'z'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 19,
                          end: 20,
                          name: 'z'
                        }
                      },
                      {
                        type: 'Property',
                        start: 22,
                        end: 31,
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 22,
                          end: 23,
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          start: 26,
                          end: 31,
                          left: {
                            type: 'Identifier',
                            start: 26,
                            end: 27,
                            name: 'b'
                          },
                          right: {
                            type: 'Identifier',
                            start: 30,
                            end: 31,
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
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement',
              start: 40,
              end: 41
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
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 11,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 10,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'z'
                },
                init: {
                  type: 'ObjectExpression',
                  start: 8,
                  end: 10,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 28,
                end: 40,
                id: {
                  type: 'ObjectPattern',
                  start: 28,
                  end: 36,
                  properties: [
                    {
                      type: 'RestElement',
                      start: 30,
                      end: 34,
                      argument: {
                        type: 'Identifier',
                        start: 33,
                        end: 34,
                        name: 'x'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 39,
                  end: 40,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 58,
                end: 77,
                id: {
                  type: 'ObjectPattern',
                  start: 58,
                  end: 66,
                  properties: [
                    {
                      type: 'RestElement',
                      start: 60,
                      end: 64,
                      argument: {
                        type: 'Identifier',
                        start: 63,
                        end: 64,
                        name: 'a'
                      }
                    }
                  ]
                },
                init: {
                  type: 'ObjectExpression',
                  start: 69,
                  end: 77,
                  properties: [
                    {
                      type: 'Property',
                      start: 71,
                      end: 75,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 71,
                        end: 72,
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        start: 74,
                        end: 75,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 95,
                end: 109,
                id: {
                  type: 'ObjectPattern',
                  start: 95,
                  end: 103,
                  properties: [
                    {
                      type: 'RestElement',
                      start: 97,
                      end: 101,
                      argument: {
                        type: 'Identifier',
                        start: 100,
                        end: 101,
                        name: 'x'
                      }
                    }
                  ]
                },
                init: {
                  type: 'MemberExpression',
                  start: 106,
                  end: 109,
                  object: {
                    type: 'Identifier',
                    start: 106,
                    end: 107,
                    name: 'a'
                  },
                  property: {
                    type: 'Identifier',
                    start: 108,
                    end: 109,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 127,
                end: 141,
                id: {
                  type: 'ObjectPattern',
                  start: 127,
                  end: 135,
                  properties: [
                    {
                      type: 'RestElement',
                      start: 129,
                      end: 133,
                      argument: {
                        type: 'Identifier',
                        start: 132,
                        end: 133,
                        name: 'x'
                      }
                    }
                  ]
                },
                init: {
                  type: 'CallExpression',
                  start: 138,
                  end: 141,
                  callee: {
                    type: 'Identifier',
                    start: 138,
                    end: 139,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 159,
                end: 174,
                id: {
                  type: 'ObjectPattern',
                  start: 159,
                  end: 170,
                  properties: [
                    {
                      type: 'Property',
                      start: 160,
                      end: 162,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 160,
                        end: 162,
                        name: 'x1'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 160,
                        end: 162,
                        name: 'x1'
                      }
                    },
                    {
                      type: 'RestElement',
                      start: 164,
                      end: 169,
                      argument: {
                        type: 'Identifier',
                        start: 167,
                        end: 169,
                        name: 'y1'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 173,
                  end: 174,
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
            expression: {
              type: 'UpdateExpression',
              start: 188,
              end: 192,
              operator: '++',
              prefix: false,
              argument: {
                type: 'Identifier',
                start: 188,
                end: 190,
                name: 'x1'
              }
            }
          },
          {
            type: 'VariableDeclaration',
            start: 206,
            end: 231,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 210,
                end: 230,
                id: {
                  type: 'ObjectPattern',
                  start: 210,
                  end: 226,
                  properties: [
                    {
                      type: 'Property',
                      start: 212,
                      end: 218,
                      method: false,
                      shorthand: false,
                      computed: true,
                      key: {
                        type: 'Identifier',
                        start: 213,
                        end: 214,
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        start: 217,
                        end: 218,
                        name: 'b'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'RestElement',
                      start: 220,
                      end: 224,
                      argument: {
                        type: 'Identifier',
                        start: 223,
                        end: 224,
                        name: 'c'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 229,
                  end: 230,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 248,
                end: 263,
                id: {
                  type: 'ObjectPattern',
                  start: 248,
                  end: 259,
                  properties: [
                    {
                      type: 'Property',
                      start: 249,
                      end: 251,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 249,
                        end: 251,
                        name: 'x1'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 249,
                        end: 251,
                        name: 'x1'
                      }
                    },
                    {
                      type: 'RestElement',
                      start: 253,
                      end: 258,
                      argument: {
                        type: 'Identifier',
                        start: 256,
                        end: 258,
                        name: 'y1'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 262,
                  end: 263,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 281,
                end: 300,
                id: {
                  type: 'ObjectPattern',
                  start: 281,
                  end: 296,
                  properties: [
                    {
                      type: 'Property',
                      start: 282,
                      end: 284,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 282,
                        end: 284,
                        name: 'x2'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 282,
                        end: 284,
                        name: 'x2'
                      }
                    },
                    {
                      type: 'Property',
                      start: 286,
                      end: 288,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 286,
                        end: 288,
                        name: 'y2'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 286,
                        end: 288,
                        name: 'y2'
                      }
                    },
                    {
                      type: 'RestElement',
                      start: 290,
                      end: 295,
                      argument: {
                        type: 'Identifier',
                        start: 293,
                        end: 295,
                        name: 'z2'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 299,
                  end: 300,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 320,
                end: 343,
                id: {
                  type: 'ObjectPattern',
                  start: 320,
                  end: 339,
                  properties: [
                    {
                      type: 'Property',
                      start: 321,
                      end: 323,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 321,
                        end: 323,
                        name: 'w3'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 321,
                        end: 323,
                        name: 'w3'
                      }
                    },
                    {
                      type: 'Property',
                      start: 325,
                      end: 327,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 325,
                        end: 327,
                        name: 'x3'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 325,
                        end: 327,
                        name: 'x3'
                      }
                    },
                    {
                      type: 'Property',
                      start: 329,
                      end: 331,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 329,
                        end: 331,
                        name: 'y3'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 329,
                        end: 331,
                        name: 'y3'
                      }
                    },
                    {
                      type: 'RestElement',
                      start: 333,
                      end: 338,
                      argument: {
                        type: 'Identifier',
                        start: 336,
                        end: 338,
                        name: 'z4'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 342,
                  end: 343,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 362,
                end: 478,
                id: {
                  type: 'ObjectPattern',
                  start: 362,
                  end: 468,
                  properties: [
                    {
                      type: 'Property',
                      start: 378,
                      end: 407,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 378,
                        end: 379,
                        name: 'x'
                      },
                      value: {
                        type: 'ObjectPattern',
                        start: 381,
                        end: 407,
                        properties: [
                          {
                            type: 'Property',
                            start: 383,
                            end: 388,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 383,
                              end: 384,
                              name: 'a'
                            },
                            value: {
                              type: 'Identifier',
                              start: 386,
                              end: 388,
                              name: 'xa'
                            },
                            kind: 'init'
                          },
                          {
                            type: 'Property',
                            start: 390,
                            end: 396,
                            method: false,
                            shorthand: false,
                            computed: true,
                            key: {
                              type: 'Identifier',
                              start: 391,
                              end: 392,
                              name: 'd'
                            },
                            value: {
                              type: 'Identifier',
                              start: 395,
                              end: 396,
                              name: 'f'
                            },
                            kind: 'init'
                          },
                          {
                            type: 'RestElement',
                            start: 398,
                            end: 405,
                            argument: {
                              type: 'Identifier',
                              start: 401,
                              end: 405,
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
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 423,
                        end: 424,
                        name: 'y'
                      },
                      value: {
                        type: 'ObjectPattern',
                        start: 426,
                        end: 434,
                        properties: [
                          {
                            type: 'RestElement',
                            start: 428,
                            end: 432,
                            argument: {
                              type: 'Identifier',
                              start: 431,
                              end: 432,
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
                      argument: {
                        type: 'Identifier',
                        start: 453,
                        end: 454,
                        name: 'g'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 471,
                  end: 478,
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
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 497,
                end: 518,
                id: {
                  type: 'ObjectPattern',
                  start: 497,
                  end: 514,
                  properties: [
                    {
                      type: 'Property',
                      start: 499,
                      end: 512,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 499,
                        end: 501,
                        name: 'x4'
                      },
                      value: {
                        type: 'ObjectPattern',
                        start: 503,
                        end: 512,
                        properties: [
                          {
                            type: 'RestElement',
                            start: 505,
                            end: 510,
                            argument: {
                              type: 'Identifier',
                              start: 508,
                              end: 510,
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
        body: [
          {
            type: 'ForOfStatement',
            start: 33,
            end: 61,
            await: false,
            left: {
              type: 'VariableDeclaration',
              start: 38,
              end: 51,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 42,
                  end: 51,
                  id: {
                    type: 'ObjectPattern',
                    start: 42,
                    end: 51,
                    properties: [
                      {
                        type: 'Property',
                        start: 43,
                        end: 44,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 43,
                          end: 44,
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 43,
                          end: 44,
                          name: 'a'
                        }
                      },
                      {
                        type: 'RestElement',
                        start: 46,
                        end: 50,
                        argument: {
                          type: 'Identifier',
                          start: 49,
                          end: 50,
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
              elements: []
            },
            body: {
              type: 'BlockStatement',
              start: 59,
              end: 61,
              body: []
            }
          },
          {
            type: 'ForOfStatement',
            start: 78,
            end: 102,
            await: false,
            left: {
              type: 'ObjectPattern',
              start: 83,
              end: 92,
              properties: [
                {
                  type: 'Property',
                  start: 84,
                  end: 85,
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 84,
                    end: 85,
                    name: 'a'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 84,
                    end: 85,
                    name: 'a'
                  }
                },
                {
                  type: 'RestElement',
                  start: 87,
                  end: 91,
                  argument: {
                    type: 'Identifier',
                    start: 90,
                    end: 91,
                    name: 'b'
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              start: 96,
              end: 98,
              elements: []
            },
            body: {
              type: 'BlockStatement',
              start: 100,
              end: 102,
              body: []
            }
          },
          {
            type: 'FunctionDeclaration',
            start: 119,
            end: 206,
            id: {
              type: 'Identifier',
              start: 134,
              end: 135,
              name: 'a'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 138,
              end: 206,
              body: [
                {
                  type: 'ForOfStatement',
                  start: 158,
                  end: 188,
                  await: true,
                  left: {
                    type: 'ObjectPattern',
                    start: 169,
                    end: 178,
                    properties: [
                      {
                        type: 'Property',
                        start: 170,
                        end: 171,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 170,
                          end: 171,
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 170,
                          end: 171,
                          name: 'a'
                        }
                      },
                      {
                        type: 'RestElement',
                        start: 173,
                        end: 177,
                        argument: {
                          type: 'Identifier',
                          start: 176,
                          end: 177,
                          name: 'b'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    start: 182,
                    end: 184,
                    elements: []
                  },
                  body: {
                    type: 'BlockStatement',
                    start: 186,
                    end: 188,
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
            left: {
              type: 'ObjectPattern',
              start: 253,
              end: 256,
              properties: [
                {
                  type: 'Property',
                  start: 254,
                  end: 255,
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 254,
                    end: 255,
                    name: 'a'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 254,
                    end: 255,
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'ObjectExpression',
              start: 260,
              end: 262,
              properties: []
            },
            body: {
              type: 'BlockStatement',
              start: 264,
              end: 266,
              body: []
            }
          },
          {
            type: 'ForOfStatement',
            start: 283,
            end: 301,
            await: false,
            left: {
              type: 'ObjectPattern',
              start: 288,
              end: 291,
              properties: [
                {
                  type: 'Property',
                  start: 289,
                  end: 290,
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 289,
                    end: 290,
                    name: 'a'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 289,
                    end: 290,
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              start: 295,
              end: 297,
              elements: []
            },
            body: {
              type: 'BlockStatement',
              start: 299,
              end: 301,
              body: []
            }
          },
          {
            type: 'FunctionDeclaration',
            start: 318,
            end: 399,
            id: {
              type: 'Identifier',
              start: 333,
              end: 334,
              name: 'a'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 337,
              end: 399,
              body: [
                {
                  type: 'ForOfStatement',
                  start: 357,
                  end: 381,
                  await: true,
                  left: {
                    type: 'ObjectPattern',
                    start: 368,
                    end: 371,
                    properties: [
                      {
                        type: 'Property',
                        start: 369,
                        end: 370,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 369,
                          end: 370,
                          name: 'a'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 369,
                          end: 370,
                          name: 'a'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    start: 375,
                    end: 377,
                    elements: []
                  },
                  body: {
                    type: 'BlockStatement',
                    start: 379,
                    end: 381,
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
            left: {
              type: 'Identifier',
              start: 422,
              end: 423,
              name: 'a'
            },
            right: {
              type: 'ObjectExpression',
              start: 427,
              end: 429,
              properties: []
            },
            body: {
              type: 'BlockStatement',
              start: 431,
              end: 433,
              body: []
            }
          },
          {
            type: 'ForOfStatement',
            start: 450,
            end: 466,
            await: false,
            left: {
              type: 'Identifier',
              start: 455,
              end: 456,
              name: 'a'
            },
            right: {
              type: 'ArrayExpression',
              start: 460,
              end: 462,
              elements: []
            },
            body: {
              type: 'BlockStatement',
              start: 464,
              end: 466,
              body: []
            }
          },
          {
            type: 'FunctionDeclaration',
            start: 483,
            end: 562,
            id: {
              type: 'Identifier',
              start: 498,
              end: 499,
              name: 'a'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 502,
              end: 562,
              body: [
                {
                  type: 'ForOfStatement',
                  start: 522,
                  end: 544,
                  await: true,
                  left: {
                    type: 'Identifier',
                    start: 533,
                    end: 534,
                    name: 'a'
                  },
                  right: {
                    type: 'ArrayExpression',
                    start: 538,
                    end: 540,
                    elements: []
                  },
                  body: {
                    type: 'BlockStatement',
                    start: 542,
                    end: 544,
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
