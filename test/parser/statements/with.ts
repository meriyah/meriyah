import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - With', () => {
  fail('Statements - With (fail)', [
    ['with(1) b: function a(){}', Context.None],
    ['with ({}) async function f() {}', Context.None],
    ['with ({}) function f() {}', Context.None],
    ['with ({}) let x;', Context.None],
    ['with ({}) { }', Context.Strict],
    [`with (x) foo;`, Context.Strict]
  ]);

  pass('Statements - With (pass)', [
    [
      'with ({}) { }',
      Context.None,
      {
        body: [
          {
            body: {
              body: [],
              type: 'BlockStatement'
            },
            object: {
              properties: [],
              type: 'ObjectExpression'
            },
            type: 'WithStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'with (x) foo;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'WithStatement',
            object: {
              type: 'Identifier',
              name: 'x'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'with (x) { foo }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'WithStatement',
            object: {
              type: 'Identifier',
              name: 'x'
            },
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'with (foo) bar;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'WithStatement',
            object: {
              type: 'Identifier',
              name: 'foo'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'bar'
              }
            }
          }
        ]
      }
    ]
  ]);
});
