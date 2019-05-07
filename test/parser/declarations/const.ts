import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Declarations - const', () => {
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
  }
  for (const arg of [
    '[1 <= 0]',
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
    'const [foo] = x, [foo] = y;',
    'for (const {x,} of obj);',
    'const [foo] = x, b = y;',
    'for (const {x} of obj);',
    'const x = y, [foo] = z;',
    'const [foo=a] = c;',
    'const [foo=a,bar] = x;',
    'const [foo,bar=b] = x;',
    'const [foo=a,bar=b] = x;',
    'const [...bar] = obj;',
    'const [foo, ...bar] = obj;',
    'const {foo,} = x;',
    'const {foo} = x, {foo} = y;',
    'for (const {} of obj);',
    'const {foo} = x, b = y;',
    'for (const [a=[...b], ...c] of obj);',
    'for (const [x, ...[foo, bar]] of obj);',
    'for (const [...[foo, bar]] of obj);',
    'for (const [foo, ...bar] of obj);',
    'for (const [...foo] of obj);',
    'for (const [foo=a, bar=b] of arr);',
    'for (const [foo, bar=b] of arr);',
    'for (const [foo=a, bar] of arr);',
    'for (const [foo=a] of arr);',
    'for (const [foo,,bar] of arr);',
    'for (const [foo,bar] of arr);',
    'for (const [,,foo] of arr);',
    'for (const [,foo] of arr);',
    'for (const [foo,,] of arr);',
    'for (const [foo] of arr);',
    'for (const {x = y, z = a} = obj;;);',
    'for (const {x, y = z} = obj;;);',
    'for (const {x = y, z} = obj;;);',
    'for (const {x} = a, {y} = obj;;);',
    'for (const {x, y} = obj;;);',
    'for (const {x,} = obj;;);',
    'for (const {x} = obj;;);',
    'for (const [foo, ...bar] = obj;;);',
    'for (const [foo=a, bar=b] = arr;;);',
    'for (const [foo=a, bar] = arr;;);',
    'for (const [foo=a] = arr;;);',
    'for (const foo = arr, [bar] = arr2;;);',
    'for (const [foo] = arr, bar = arr2;;);',
    'for (const [foo,bar] = arr;;);',
    'for (const [,foo] = arr;;);',
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
    'for (const [,,] of x);',
    'for (const [,] of x);',
    'for (const {a, [x]: y} in obj);',
    'for (const {[x]: y = z} in obj);',
    'for (const {[x]: y} in obj);',
    'for (const {x : y, z, a : b = c} in obj);',
    'for (const [foo,] in arr);',
    'for (const [] in x);',
    'for (const {a, [x]: y} = a;;);',
    'for (const {[x]: y = z} = a;;);',
    'for (const {[x]: y} = z;;);',
    'for (const {x : y, z, a : b = c} = obj;;);',
    'for (const {x : y = z} = obj;;);',
    'for (const {x, y : z} = obj;;);',
    'for (const {x : y, z} = obj;;);',
    'for (const {x : y} = obj;;);',
    'for (const {x : y = z} in obj);',
    'for (const {x : y, z : a} in obj);',
    'for (const {x, y : z} in obj);',
    'for (const {x : y, z} in obj);',
    'for (const {x : y} in obj);',
    'for (const {x = y, z = a} in obj);',
    'for (const {x, y = z} in obj);',
    'for (const {x = y, z} in obj);',
    'for (const {x = y} in obj);',
    'for (const [a=[...b], ...c] in obj);',
    'for (const [...[foo, bar]] in obj);',
    'for (const [foo, ...bar] in obj);',
    'for (const [...foo] in obj);',
    'for (const [foo=a, bar=b] in arr);',
    'for (const [foo, bar=b] in arr);',
    'for (const [foo=a, bar] in arr);',
    'for (const [foo=a] in arr);',
    'for (const [foo,,bar] in arr);',
    'for (const [,,foo] in arr);',
    'for (const [,foo] in arr);',
    'for (const [foo,,] in arr);',
    'for (const {x,} in obj);',
    'for (const {x, y} in obj);',
    `for (const {} in obj);`,
    'const x = y, {foo} = z;',
    'const {foo=a} = x;',
    'const {foo=a,bar} = x;',
    'const {foo,bar=b} = x;',
    'const {foo=a,bar=b} = x;',
    'const {foo:a} = x;',
    'const {foo:a,bar} = x;',
    'const {foo,bar:b} = x;',
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
    ['const {x=y};', Context.None],
    ['const {x:y=z};', Context.None],
    ['const {x:y=z} = obj, {a:b=c};', Context.None],
    ['const {a:=c} = z;', Context.None],
    ['const {[x] = y} = z;', Context.None],
    ['const {[x]: y};', Context.None],
    ['const {[x]} = z;', Context.None],
    ['const {[x] = y} = z;', Context.None],
    ['const {[x]: y = z};', Context.None],
    ['for (const foo;;);', Context.None],
    ['for (const\nfoo();;);', Context.None],
    ['for (const foo);', Context.None],
    ['for (const foo, bar);', Context.None],
    ['for (const foo = bar, zoo = boo);', Context.None],
    ['for (const\nfoo);', Context.None],
    ['for (const foo = bar in x);', Context.None],
    ['for (const foo = bar, zoo = boo in x);', Context.None],
    ['for (const foo, bar of x);', Context.None],
    ['for (const foo = bar of x);', Context.None],
    ['for (const foo = bar, zoo = boo of x);', Context.None],
    ['for (const foo, zoo of x);', Context.None],
    ['for (const foo, [bar] = arr2;;);', Context.None],
    ['for (const [foo];;);', Context.None],
    ['for (const [foo = x];;);', Context.None],
    ['for (const [foo], bar;;);', Context.None],
    ['for (const foo, [bar];;);', Context.None],
    ['for (const [...foo, bar] = obj;;);', Context.None],
    ['for (const [...foo,] = obj;;);', Context.None],
    ['for (const [...[foo, bar],,] = obj;;);', Context.None],
    ['for (const [...[foo, bar],] = obj;;);', Context.None],
    ['for (const [...bar = foo] = obj;;);', Context.None],
    ['for (const [... ...foo] = obj;;);', Context.None],
    ['for (const [...] = obj;;);', Context.None],
    ['for (const [...,] = obj;;);', Context.None],
    ['const {...[a]} = x', Context.None],
    ['const {...{a}} = x', Context.None],
    ['const {...a=b} = x', Context.None],
    ['for (const [...,] = obj;;);', Context.None],
    ['const {...a+b} = x', Context.None],
    ['let {...{a,b}} = foo', Context.None],
    ['for (const [.x] = obj;;);', Context.None],
    ['for (const [..x] = obj;;);', Context.None],
    ['for (const {,} = obj;;);', Context.None],
    ['for (const {,,} = obj;;);', Context.None],
    ['for (const {x,,} = obj;;);', Context.None],
    ['for (const {,x} = obj;;);', Context.None],
    ['for (const {,,x} = obj;;);', Context.None],
    ['for (const {x,, y} = obj;;);', Context.None],
    ['for (const {x} = a, obj;;);', Context.None],
    ['for (const x, {y} = obj;;);', Context.None],
    ['for (const {x}, {y} = z;;);', Context.None],
    ['for (const x, {y};;);', Context.None],
    ['for (const {x}, y;;);', Context.None],
    ['for (const x = y, {z};;);', Context.None],
    ['for (const {x:y};;);', Context.None],
    ['for (const {x:y=z};;);', Context.None],
    ['for (const {x:y=z} = obj, {a:b=c};;);', Context.None],
    ['for (const {x:y=z}, {a:b=c} = obj;;);', Context.None],
    ['for (const {a:=c} = z;;);', Context.None],
    ['for (const {[x]} = z;;);', Context.None],
    ['for (const {[x]};;);', Context.None],
    ['for (const {[x]: y};;);', Context.None],
    ['for (const {[x] = y} = z;;);', Context.None],
    ['for (const {[x]: y = z};;);', Context.None],
    ['for (const [,,] = x);', Context.None],
    ['for (const [foo,,] = arr);', Context.None],
    ['for (const [,foo] = arr);', Context.None],
    ['for (const [foo,bar] = arr);', Context.None],
    ['for (const [foo] = arr, bar);', Context.None],
    ['for (const foo, [bar] = arr2);', Context.None],
    ['for (const foo = arr, [bar] = arr2);', Context.None],
    ['for (const [foo=a, bar] = arr);', Context.None],
    ['for (const [foo = x]);', Context.None],
    ['for (const [foo]);', Context.None],
    ['const [(x)] = []', Context.None],
    ['for (const [...foo] = obj);', Context.None],
    ['for (const [foo, ...bar] = obj);', Context.None],
    ['for (const [...foo, bar] = obj);', Context.None],
    ['for (const [...foo,,] = obj);', Context.None],
    ['const a, [...x] = y', Context.None],
    ['const foo;', Context.Module],
    ['const foo, bar = x;', Context.None],
    ['const foo =x, bar;', Context.None],
    ['const foo, bar;', Context.Module],
    ['for (const [...[foo, bar],,] = obj);', Context.None],
    ['for (const [... ...foo] = obj);', Context.Module],
    ['for (const [...] = obj);', Context.None],
    ['for (const [...,] = obj);', Context.None],
    ['for (const [..x] = obj);', Context.None],
    ['for (const [a=[...b], ...c] = obj);', Context.None],
    ['for (const {,} = obj);', Context.None],
    ['for (const {x} = obj);', Context.None],
    ['for (const {,x} = obj);', Context.None],
    ['for (const {x,, y} = obj);', Context.None],
    ['for (const {x, y} = obj);', Context.None],
    ['for (const {x} = a, y = obj);', Context.None],
    ['for (const {x} = a, obj);', Context.None],
    ['for (const {x = y} = obj);', Context.None],
    ['for (const x, {y} = obj);', Context.None],
    ['for (const {x = y, z = a} = obj);', Context.None],
    ['for (const {x : y} = obj);', Context.None],
    ['for (const {x : y, z : a} = obj);', Context.None],
    ['for (const {x : y = z} = obj);', Context.None],
    ['for (const {x : y, z, a : b = c} = obj);', Context.None],
    ['for (const {x});', Context.None],
    ['for (const {x}, {y} = z);', Context.None],
    ['for (const {x}, y);', Context.None],
    ['for (const {x}, y);', Context.None],
    ['for (const {x=y});', Context.None],
    ['for (const {x:y=z} = obj, {a:b=c});', Context.None],
    ['for (const {x:y=z}, {a:b=c} = obj);', Context.None],
    ['for (const {a:=c} = z);', Context.None],
    ['for (const {[x]: y} = z);', Context.None],
    ['for (const {[x]} = z);', Context.None],
    ['for (const {[x] = y} = z);', Context.None],
    ['for (const {[x]: y = z});', Context.None],
    ['for (const [foo], bar in arr);', Context.None],
    ['or (const foo, [bar] in arr);', Context.None],
    ['for (const [foo]);', Context.None],
    ['for (const [foo = x]);', Context.None],
    ['for (const [foo], bar);', Context.None],
    ['for (const foo, [bar]);', Context.None],
    ['for (const [...foo, bar] in obj);', Context.None],
    ['for (const [...foo,] in obj);', Context.None],
    ['for (const [...foo,,] in obj);', Context.None],
    ['for (const [...[foo, bar],] in obj);', Context.None],
    ['for (const [...[foo, bar],,] in obj);', Context.None],
    ['for (const [...] in obj);', Context.None],
    ['for (const [...,] in obj);', Context.None],
    ['for (const [.x] in obj);', Context.None],
    ['for (const [..x] in obj);', Context.None],
    ['for (const {,} in obj);', Context.None],
    ['for (const {,,} in obj);', Context.None],
    ['for (const {x,,} in obj);', Context.None],
    ['for (const {,x} in obj);', Context.None],
    ['for (const {x,, y} in obj);', Context.None],
    ['for (const x, {y} in obj);', Context.None],
    ['for (const {x}, y);', Context.None],
    ['for (const x = y, {z});', Context.None],
    ['for (const {x:y});', Context.None],
    ['for (const {x:y=z});', Context.None],
    ['for (const {x:y=z} = obj, {a:b=c});', Context.None],
    ['for (const {x:y=z}, {a:b=c} in obj);', Context.None],
    ['for (const {[x] = y} in obj);', Context.None],
    ['for (const foo, [bar] of arr);', Context.None],
    ['for (const [foo = x]);', Context.None],
    ['for (const [..x] of obj);', Context.None],
    ['for (const [.x] of obj);', Context.None],
    ['for (const {,,} of obj);', Context.None],
    ['for (const {,} of obj);', Context.None],
    ['for (const {,,x} of obj);', Context.None],
    ['for (const {x,, y} of obj);', Context.None],
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
      'const [foo] = x, [foo] = y;',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  ]
                }
              },
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'y'
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
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
      'const x = y, [foo] = z;',
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
                  name: 'y'
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'z'
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
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
      'const [foo=a,bar=b] = x;',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      right: {
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
      }
    ],
    [
      'const [...bar] = obj;',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'bar'
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
      'const x = y, {foo} = z;',
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
                  name: 'y'
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'z'
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
                        name: 'foo'
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
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        method: false,
                        shorthand: false
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        method: false,
                        shorthand: true
                      },
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
                            name: 'b'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'c'
                          }
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
                        generator: false,
                        id: null,
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
                          id: null,
                          async: false,
                          generator: false,
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
      Context.None,
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
                  type: 'ObjectExpression',
                  properties: []
                },
                id: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'z'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
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
                        type: 'Literal',
                        value: 1
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
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  arguments: []
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'z'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'y1'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'x1'
              },
              operator: '++',
              prefix: false
            }
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'z'
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
                      computed: true,
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'c'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'z'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x1'
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'y1'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'z'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x2'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x2'
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'y2'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'y2'
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'z2'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'z'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'w3'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'w3'
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x3'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x3'
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'y3'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'y3'
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'z4'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'complex'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      value: {
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
                              name: 'xa'
                            },
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'd'
                            },
                            computed: true,
                            value: {
                              type: 'Identifier',
                              name: 'f'
                            },
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'asdf'
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
                        name: 'y'
                      },
                      computed: false,
                      value: {
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
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'g'
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'z'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x4'
                      },
                      computed: false,
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'y4'
                            }
                          }
                        ]
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
                          expression: false,
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
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
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
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            },
            await: false
          },
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            },
            await: false
          },
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ForOfStatement',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    elements: []
                  },
                  await: true
                }
              ]
            },
            async: true,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'a'
            }
          },
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            },
            right: {
              type: 'ObjectExpression',
              properties: []
            }
          },
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            },
            await: false
          },
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ForOfStatement',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  right: {
                    type: 'ArrayExpression',
                    elements: []
                  },
                  await: true
                }
              ]
            },
            async: true,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'a'
            }
          },
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'ObjectExpression',
              properties: []
            }
          },
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            },
            await: false
          },
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ForOfStatement',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'ArrayExpression',
                    elements: []
                  },
                  await: true
                }
              ]
            },
            async: true,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
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
