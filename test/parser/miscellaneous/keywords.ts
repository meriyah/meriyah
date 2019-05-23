import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';
import { pass } from '../../test-utils';

describe('Miscellaneous - Keywords', () => {
  for (const arg of [
    'break = 1;',
    'case = 1;',
    'continue = 1;',
    'default = 1;',
    'function = 1;',
    'this = 1;',
    'var = 1;',
    'void = 1;',
    'with = 1;',
    'in = 1;',
    'var = 1;',
    'class',
    'if',
    'do = 1;',
    'continue',
    'for',
    'switch',
    'while = 1;',
    'try = 1;'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`var ${arg}`, () => {
      t.throws(() => {
        parseSource(`var ${arg}`, undefined, Context.None);
      });
    });

    it(`function () { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function () { ${arg} }`, undefined, Context.None);
      });
    });
  }

  pass('Miscellaneous - Keywords (pass)', [
    [
      `var foo = {}; foo.if;`,
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
                  name: 'foo'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'if'
              }
            }
          }
        ]
      }
    ],
    [
      `var foo = {}; foo.super;`,
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
                  name: 'foo'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'super'
              }
            }
          }
        ]
      }
    ],
    [
      `var foo = {}; foo.arguments;`,
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
                  name: 'foo'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'arguments'
              }
            }
          }
        ]
      }
    ],
    [
      `var foo = {}; foo.interface;`,
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
                  name: 'foo'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'interface'
              }
            }
          }
        ]
      }
    ],
    [
      `function *a(){({yi\\u0065ld: 0})}`,
      Context.None,
      {
        body: [
          {
            async: false,
            body: {
              body: [
                {
                  expression: {
                    properties: [
                      {
                        computed: false,
                        key: {
                          name: 'yield',
                          type: 'Identifier'
                        },
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        type: 'Property',
                        value: {
                          type: 'Literal',
                          value: 0
                        }
                      }
                    ],
                    type: 'ObjectExpression'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },

            generator: true,
            id: {
              name: 'a',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
