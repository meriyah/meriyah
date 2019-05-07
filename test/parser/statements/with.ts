import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - With', () => {
  fail('Statements - With (fail)', [
    ['with(1) b: function a(){}', Context.None],
    ['with ({}) async function f() {}', Context.None],
    ['with ({}) function f() {}', Context.None],
    ['with ({}) let x;', Context.None],
    ['while 1 break;', Context.None],
    [`while '' break;`, Context.None],
    [`with (x) foo;`, Context.Strict],
    ['while (false) label1: label2: function f() {}', Context.None],
    [
      `while({1}){
      break ;
   };`,
      Context.Module
    ]
  ]);

  pass('Statements - With (pass)', [
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
