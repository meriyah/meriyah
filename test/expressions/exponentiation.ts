import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';
import * as t from 'assert';
import { parseSource } from '../../src/parser';

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
    it(`var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, () => {
      t.throws(() => {
        parseSource(
          `var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`,
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
    //'(delete x) ** 10',
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
    '++O.p ** 10',
    '++x ** 10',
    '--O.p ** 10',
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
      '2 ** 4',
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
      'new x ** 2;',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '**'
            }
          }
        ]
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '**'
            }
          }
        ]
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
