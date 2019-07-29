import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('V8 - Intrinsic', () => {
  fail('V8 - Intrinsic (fail)', [
    ['%foo.bar', Context.OptionsV8],
    ['%DebugPrint?.(null)', Context.OptionsV8],
    ['const i = %DebugPrint;', Context.OptionsV8],
    ['%DebugPrint(foo)', Context.None],
    ['%foo.bar', Context.None]
  ]);

  pass('V8 - Intrinsic (pass)', [
    [
      `foo%bar()`,
      Context.OptionsV8 | Context.OptionsRanges,
      {
        body: [
          {
            end: 9,
            expression: {
              end: 9,
              left: {
                end: 3,
                name: 'foo',
                start: 0,
                type: 'Identifier'
              },
              operator: '%',
              right: {
                arguments: [],
                callee: {
                  end: 7,
                  name: 'bar',
                  start: 4,
                  type: 'Identifier'
                },
                end: 9,
                start: 4,
                type: 'CallExpression'
              },
              start: 0,
              type: 'BinaryExpression'
            },
            start: 0,
            type: 'ExpressionStatement'
          }
        ],
        end: 9,
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      `function *foo() {
        yield %StringParseInt("42", 10)
      }`,
      Context.OptionsV8 | Context.OptionsRanges,
      {
        body: [
          {
            async: false,
            body: {
              body: [
                {
                  end: 57,
                  expression: {
                    argument: {
                      arguments: [
                        {
                          end: 52,
                          start: 48,
                          type: 'Literal',
                          value: '42'
                        },
                        {
                          end: 56,
                          start: 54,
                          type: 'Literal',
                          value: 10
                        }
                      ],
                      callee: {
                        end: 47,
                        name: 'StringParseInt',
                        start: 33,
                        type: 'V8IntrinsicIdentifier'
                      },
                      end: 57,
                      start: 32,
                      type: 'CallExpression'
                    },
                    delegate: false,
                    end: 57,
                    start: 26,
                    type: 'YieldExpression'
                  },
                  start: 26,
                  type: 'ExpressionStatement'
                }
              ],
              end: 65,
              start: 16,
              type: 'BlockStatement'
            },
            end: 65,
            generator: true,
            id: {
              end: 13,
              name: 'foo',
              start: 10,
              type: 'Identifier'
            },
            params: [],
            start: 0,
            type: 'FunctionDeclaration'
          }
        ],
        end: 65,
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      `%StringParseInt("42", 10);`,
      Context.OptionsV8,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  type: 'Literal',
                  value: '42'
                },
                {
                  type: 'Literal',
                  value: 10
                }
              ],
              callee: {
                name: 'StringParseInt',
                type: 'V8IntrinsicIdentifier'
              },
              type: 'CallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `new %DebugPrint(null);`,
      Context.OptionsV8,
      {
        body: [
          {
            expression: {
              arguments: [],
              callee: {
                arguments: [
                  {
                    type: 'Literal',
                    value: null
                  }
                ],
                callee: {
                  name: 'DebugPrint',
                  type: 'V8IntrinsicIdentifier'
                },
                type: 'CallExpression'
              },
              type: 'NewExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `async () => { await %StringParseInt("42", 10) }`,
      Context.OptionsV8,
      {
        body: [
          {
            expression: {
              async: true,
              body: {
                body: [
                  {
                    expression: {
                      argument: {
                        arguments: [
                          {
                            type: 'Literal',
                            value: '42'
                          },
                          {
                            type: 'Literal',
                            value: 10
                          }
                        ],
                        callee: {
                          name: 'StringParseInt',
                          type: 'V8IntrinsicIdentifier'
                        },
                        type: 'CallExpression'
                      },
                      type: 'AwaitExpression'
                    },
                    type: 'ExpressionStatement'
                  }
                ],
                type: 'BlockStatement'
              },
              expression: false,
              params: [],
              type: 'ArrowFunctionExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `%DebugPrint(foo)`,
      Context.OptionsV8,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  name: 'foo',
                  type: 'Identifier'
                }
              ],
              callee: {
                name: 'DebugPrint',
                type: 'V8IntrinsicIdentifier'
              },
              type: 'CallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
