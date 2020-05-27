import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Exponentiation', () => {
  for (const arg of [
    'delete O.p ** 10',
    'delete x ** 10',
    '~O.p ** 10',
    '~x ** 10',
    '!O.p ** 10',
    '!x ** 10',
    '+O.p ** 10',
    '+x ** 10',
    '-O.p ** 10',
    '-x ** 10',
    '!1 ** 2',
    'void 1 ** 2;',
    'typeof 1 ** 2;',
    'typeof O.p ** 10',
    'typeof x ** 10',
    'void ** 10',
    'void O.p ** 10',
    'void x ** 10',
    '-x ** y',
    '++delete O.p ** 10',
    '--delete O.p ** 10',
    '++~O.p ** 10',
    '++~x ** 10',
    '--!O.p ** 10',
    '--!x ** 10',
    '++-O.p ** 10',
    '++-x ** 10',
    '--+O.p ** 10',
    '--+x ** 10',
    '[ x ] **= [ 2 ]',
    '[ x **= 2 ] = [ 2 ]',
    '{ x } **= { x: 2 }',
    '{ x: x **= 2 ] = { x: 2 }'
  ]) {
    it(`let O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, () => {
      t.throws(() => {
        parseSource(
          `let O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`,
          undefined,
          Context.OptionsNext | Context.Module
        );
      });
    });

    it(`var O = { p: 1 }, x = 10; ; (${arg})`, () => {
      t.throws(() => {
        parseSource(`var O = { p: 1 }, x = 10; ; (${arg})`, undefined, Context.OptionsNext | Context.Strict);
      });
    });

    it(`var O = { p: 1 }, x = 10; foo(${arg})`, () => {
      t.throws(() => {
        parseSource(`var O = { p: 1 }, x = 10; foo(${arg})`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Expressions - Exponentiation (fail)', [
    ['+1 ** 2;', Context.None],
    ['-3 ** 2;', Context.None],
    ['!1 ** 2;', Context.None],
    ['delete o.p ** 2;', Context.None],
    ['~3 ** 2;', Context.None],
    ['(a * +a ** a ** 3)', Context.None],
    ['typeof 3 ** 2;', Context.None],
    ['delete 3 ** 2;', Context.None],
    ['!3 ** 2;', Context.None],
    ['-x ** 2;', Context.None],
    ['+x ** 2;', Context.None],
    ['(~3 ** 2)', Context.None],
    ['(typeof 3 ** 2)', Context.None],
    ['(delete 3 ** 2)', Context.None],
    ['(!3 ** 2)', Context.None],
    ['(+x ** 2)', Context.None],
    ['(a * +a ** a ** 3)', Context.None],
    ['for (var import.meta of [1]) {}', Context.None]
  ]);

  for (const arg of [
    '(delete O.p) ** 10',
    '(~O.p) ** 10',
    '(~x) ** 10',
    '(!O.p) ** 10',
    '(!x) ** 10',
    '(+O.p) ** 10',
    '(+x) ** 10',
    '(-O.p) ** 10',
    'x ** y ** z',
    '++x ** y',
    '(-x) ** y',
    '-(x ** y)',
    '(-x) ** 10',
    '(typeof O.p) ** 10',
    '(typeof x) ** 10',
    '(void 0) ** 10',
    '(void O.p) ** 10',
    '(void x) ** 10',
    '2 ** ++exponent, 8',
    '2 ** -1 * 2, 1',
    '2 ** (3 ** 2)',
    '2 ** 3 ** 2, 512',
    '16 / 2 ** 2, 4',
    '++O.p ** 10',
    '++x ** 10',
    '--O.p ** 10',
    '--base ** 2',
    '2 ** !s',
    '2 ** +n',
    '!(3 ** 2)',
    '-(3 ** 2)',
    '--x ** 10',
    'O.p++ ** 10',
    'x++ ** 10',
    'O.p-- ** 10',
    'x-- ** 10'
  ]) {
    it(`var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`,
          undefined,
          Context.OptionsNext | Context.Module
        );
      });
    });

    it(`var O = { p: 1 }, x = 10; ; (${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`var O = { p: 1 }, x = 10; ; (${arg})`, undefined, Context.OptionsNext | Context.Strict);
      });
    });

    it(`var O = { p: 1 }, x = 10; foo(${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`var O = { p: 1 }, x = 10; foo(${arg})`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  pass('Expressions - Exponentiation (pass)', [
    [
      '(base **= 3) === -27',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'base',
                  start: 1,
                  end: 5,
                  range: [1, 5]
                },
                operator: '**=',
                right: {
                  type: 'Literal',
                  value: 3,
                  start: 10,
                  end: 11,
                  range: [10, 11]
                },
                start: 1,
                end: 11,
                range: [1, 11]
              },
              right: {
                type: 'UnaryExpression',
                operator: '-',
                argument: {
                  type: 'Literal',
                  value: 27,
                  start: 18,
                  end: 20,
                  range: [18, 20]
                },
                prefix: true,
                start: 17,
                end: 20,
                range: [17, 20]
              },
              operator: '===',
              start: 0,
              end: 20,
              range: [0, 20]
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
      '2 ** 4',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 6,
        range: [0, 6],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 6,
            range: [0, 6],
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 6,
              range: [0, 6],
              left: {
                type: 'Literal',
                start: 0,
                end: 1,
                range: [0, 1],
                value: 2
              },
              operator: '**',
              right: {
                type: 'Literal',
                start: 5,
                end: 6,
                range: [5, 6],
                value: 4
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'new x ** 2;',
      Context.OptionsRanges,
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
              type: 'BinaryExpression',
              start: 0,
              end: 10,
              range: [0, 10],
              left: {
                type: 'NewExpression',
                start: 0,
                end: 5,
                range: [0, 5],
                callee: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'x'
                },
                arguments: []
              },
              operator: '**',
              right: {
                type: 'Literal',
                start: 9,
                end: 10,
                range: [9, 10],
                value: 2
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'true ** a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Literal',
                value: true
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      '++x ** a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '++',
                prefix: true
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      '--x ** a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '--',
                prefix: true
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      'x++ ** a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '++',
                prefix: false
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      'x-- ** a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '--',
                prefix: false
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      '+a * b ** c ** 3',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UnaryExpression',
                operator: '+',
                argument: {
                  type: 'Identifier',
                  name: 'a'
                },
                prefix: true
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  right: {
                    type: 'Literal',
                    value: 3
                  },
                  operator: '**'
                },
                operator: '**'
              },
              operator: '*'
            }
          }
        ]
      }
    ],
    [
      '(2 ** 4)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Literal',
                value: 2
              },
              right: {
                type: 'Literal',
                value: 4
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      '(new x ** 2)',
      Context.OptionsRanges,
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
              type: 'BinaryExpression',
              start: 1,
              end: 11,
              range: [1, 11],
              left: {
                type: 'NewExpression',
                start: 1,
                end: 6,
                range: [1, 6],
                callee: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'x'
                },
                arguments: []
              },
              operator: '**',
              right: {
                type: 'Literal',
                start: 10,
                end: 11,
                range: [10, 11],
                value: 2
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(true ** a)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Literal',
                value: true
              },
              right: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      '(++x ** a)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'BinaryExpression',
              start: 1,
              end: 9,
              range: [1, 9],
              left: {
                type: 'UpdateExpression',
                start: 1,
                end: 4,
                range: [1, 4],
                operator: '++',
                prefix: true,
                argument: {
                  type: 'Identifier',
                  start: 3,
                  end: 4,
                  range: [3, 4],
                  name: 'x'
                }
              },
              operator: '**',
              right: {
                type: 'Identifier',
                start: 8,
                end: 9,
                range: [8, 9],
                name: 'a'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(+c * b ** a ** 3)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UnaryExpression',
                operator: '+',
                argument: {
                  type: 'Identifier',
                  name: 'c'
                },
                prefix: true
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Literal',
                    value: 3
                  },
                  operator: '**'
                },
                operator: '**'
              },
              operator: '*'
            }
          }
        ]
      }
    ]
  ]);
});
