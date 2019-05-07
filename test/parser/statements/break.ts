import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Break', () => {
  fail('Declarations - Break', [
    ['break;', Context.None],
    //    ['break foo;', Context.None],
    ['break; break;', Context.None],
    ['break\nbreak;', Context.None],
    ['{ break }', Context.None],
    ['if (x) break', Context.None],
    ['function f(){    break    }', Context.None],
    //    ['function f(){    break y   }', Context.None],
    ['() => {    break    }', Context.None],
    ['() => {    if (x) break   }', Context.None]
    //  ['() => {    if (x) break y   }', Context.None],
  ]);

  pass('Statements - Break (pass)', [
    [
      'switch (x) { default: break; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'x'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: [
                  {
                    type: 'BreakStatement',
                    label: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (x) { case x: if (foo) break; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'x'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'x'
                },
                consequent: [
                  {
                    type: 'IfStatement',
                    test: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    consequent: {
                      type: 'BreakStatement',
                      label: null
                    },
                    alternate: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (x) { case x: {break;} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'x'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'x'
                },
                consequent: [
                  {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'BreakStatement',
                        label: null
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'foo: switch (x) { case x: break foo; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'foo'
            },
            body: {
              type: 'SwitchStatement',
              discriminant: {
                type: 'Identifier',
                name: 'x'
              },
              cases: [
                {
                  type: 'SwitchCase',
                  test: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  consequent: [
                    {
                      type: 'BreakStatement',
                      label: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'this',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ThisExpression'
            }
          }
        ]
      }
    ],
    [
      'foo: switch (x) { case x: if (foo) {break foo;} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'foo'
            },
            body: {
              type: 'SwitchStatement',
              discriminant: {
                type: 'Identifier',
                name: 'x'
              },
              cases: [
                {
                  type: 'SwitchCase',
                  test: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  consequent: [
                    {
                      type: 'IfStatement',
                      test: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      consequent: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'BreakStatement',
                            label: {
                              type: 'Identifier',
                              name: 'foo'
                            }
                          }
                        ]
                      },
                      alternate: null
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'switch (x) { case x: break; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'x'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'x'
                },
                consequent: [
                  {
                    type: 'BreakStatement',
                    label: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  ]);
});
