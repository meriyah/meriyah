import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Null Coalescing', () => {
  for (const arg of [
    'undefined ?? 3',
    'null ?? 3',
    'true ?? 3',
    'false ?? 3',
    `0 ?? 3`,
    '1 ?? 3',
    `({} ?? 3) instanceof Object`,
    `([] ?? 3) instanceof Array`,
    `(['hi'] ?? 3)[0]`,
    `(makeMasquerader() ?? 3) == null`,
    '1 | null ?? 3',
    `1 ^ null ?? 3`,
    `1 & null ?? 3`,
    `3 != null ?? 3`,
    '1 > null ?? 3',
    '1 <= null ?? 3',
    '1 >> null ?? 3',
    `isNaN(1 % null ?? 3)`,
    `1 ** null ?? 3`,
    `(0 || 1) ?? 2`,
    `(0 && 1) ?? 2`,
    `0 && (1 ?? 2)`,
    `(0 ?? 1) || 2`,
    `(0 ?? 1) || 2`,
    `(0 ?? 1) && 2`,
    `0 ?? (1 && 2)`,
    `0 || 1 && 2 | 3 ^ 4 & 5 == 6 != 7 === 8 !== 9 < 0 > 1 <= 2 >= 3 << 4 >> 5 >>> 6 + 7 - 8 * 9 / 0 % 1 ** 2`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });
  }

  fail('Expressions - Null Coalescing (fail)', [
    ['c && d ?? e', Context.OptionsNext],
    ['c && d ?? e', Context.OptionsWebCompat],
    ['0 && 1 ?? 2', Context.OptionsNext | Context.Module | Context.Strict],
    ['0 && 1 ?? 2', Context.OptionsNext | Context.OptionsWebCompat],
    ['0 ?? 1 || 2', Context.OptionsNext | Context.Module | Context.Strict],
    ['0 ?? 1 && 2', Context.OptionsNext | Context.Module | Context.Strict],
    [
      '3 ?? 2 ** 1 % 0 / 9 * 8 - 7 + 6 >>> 5 >> 4 << 3 >= 2 <= 1 > 0 < 9 !== 8 === 7 != 6 == 5 & 4 ^ 3 | 2 && 1 || 0',
      Context.OptionsNext
    ],
    ['e ?? f ?? g || h;', Context.OptionsNext | Context.Module | Context.Strict],
    ['c && d ?? e', Context.OptionsNext | Context.Module | Context.Strict]
  ]);

  pass('Next - Null Coalescing (pass)', [
    [
      `({ x: 'hi' } ?? 3).x`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              computed: false,
              object: {
                left: {
                  properties: [
                    {
                      computed: false,
                      key: {
                        name: 'x',
                        type: 'Identifier'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        type: 'Literal',
                        value: 'hi'
                      }
                    }
                  ],
                  type: 'ObjectExpression'
                },
                operator: '??',
                right: {
                  type: 'Literal',
                  value: 3
                },
                type: 'CoalesceExpression'
              },
              property: {
                name: 'x',
                type: 'Identifier'
              },
              type: 'MemberExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `'hi' ?? 3`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                type: 'Literal',
                value: 'hi'
              },
              operator: '??',
              right: {
                type: 'Literal',
                value: 3
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `undefined ?? 3`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                name: 'undefined',
                type: 'Identifier'
              },
              operator: '??',
              right: {
                type: 'Literal',
                value: 3
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `1 << null ?? 3`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  type: 'Literal',
                  value: 1
                },
                operator: '<<',
                right: {
                  type: 'Literal',
                  value: null
                },
                type: 'BinaryExpression'
              },
              operator: '??',
              right: {
                type: 'Literal',
                value: 3
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `1 / null ?? 3`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  type: 'Literal',
                  value: 1
                },
                operator: '/',
                right: {
                  type: 'Literal',
                  value: null
                },
                type: 'BinaryExpression'
              },
              operator: '??',
              right: {
                type: 'Literal',
                value: 3
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `a ?? (b && c);`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                name: 'a',
                type: 'Identifier'
              },
              operator: '??',
              right: {
                left: {
                  name: 'b',
                  type: 'Identifier'
                },
                operator: '&&',
                right: {
                  name: 'c',
                  type: 'Identifier'
                },
                type: 'LogicalExpression'
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `a
        ?? b
        ?? c;`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  name: 'a',
                  type: 'Identifier'
                },
                operator: '??',
                right: {
                  name: 'b',
                  type: 'Identifier'
                },
                type: 'CoalesceExpression'
              },
              operator: '??',
              right: {
                name: 'c',
                type: 'Identifier'
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `foo ?? 1;`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                name: 'foo',
                type: 'Identifier'
              },
              operator: '??',
              right: {
                type: 'Literal',
                value: 1
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `a ?? b ?? c;`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  name: 'a',
                  type: 'Identifier'
                },
                operator: '??',
                right: {
                  name: 'b',
                  type: 'Identifier'
                },
                type: 'CoalesceExpression'
              },
              operator: '??',
              right: {
                name: 'c',
                type: 'Identifier'
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `a ?? (b || c);`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                name: 'a',
                type: 'Identifier'
              },
              operator: '??',
              right: {
                left: {
                  name: 'b',
                  type: 'Identifier'
                },
                operator: '||',
                right: {
                  name: 'c',
                  type: 'Identifier'
                },
                type: 'LogicalExpression'
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `(a || b) ?? c;`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  name: 'a',
                  type: 'Identifier'
                },
                operator: '||',
                right: {
                  name: 'b',
                  type: 'Identifier'
                },
                type: 'LogicalExpression'
              },
              operator: '??',
              right: {
                name: 'c',
                type: 'Identifier'
              },
              type: 'CoalesceExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `(a && b) ?? c`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  name: 'a',
                  type: 'Identifier'
                },
                operator: '&&',
                right: {
                  name: 'b',
                  type: 'Identifier'
                },
                type: 'LogicalExpression'
              },
              operator: '??',
              right: {
                name: 'c',
                type: 'Identifier'
              },
              type: 'CoalesceExpression'
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
