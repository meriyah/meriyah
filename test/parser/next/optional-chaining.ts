import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Optional chaining', () => {
  pass('Next - Optional chaining (pass)', [
    [
      `a?.func?.()`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              arguments: [],
              callee: {
                computed: false,
                object: {
                  name: 'a',
                  type: 'Identifier'
                },
                optional: true,
                property: {
                  name: 'func',
                  type: 'Identifier'
                },
                type: 'OptionalMemberExpression'
              },
              optional: true,
              type: 'OptionalCallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `func?.()`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              arguments: [],
              callee: {
                name: 'func',
                type: 'Identifier'
              },
              optional: true,
              type: 'OptionalCallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `obj.a?.[true]`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              computed: true,
              object: {
                computed: false,
                object: {
                  name: 'obj',
                  type: 'Identifier'
                },
                property: {
                  name: 'a',
                  type: 'Identifier'
                },
                type: 'MemberExpression'
              },
              optional: true,
              property: {
                type: 'Literal',
                value: true
              },
              type: 'OptionalMemberExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `obj?.[expr]?.[other]`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              computed: true,
              object: {
                computed: true,
                object: {
                  name: 'obj',
                  type: 'Identifier'
                },
                optional: true,
                property: {
                  name: 'expr',
                  type: 'Identifier'
                },
                type: 'OptionalMemberExpression'
              },
              optional: true,
              property: {
                name: 'other',
                type: 'Identifier'
              },
              type: 'OptionalMemberExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `a.b.c?.d.e.f`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              computed: false,
              object: {
                computed: false,
                object: {
                  computed: false,
                  object: {
                    computed: false,
                    object: {
                      computed: false,
                      object: {
                        name: 'a',
                        type: 'Identifier'
                      },
                      property: {
                        name: 'b',
                        type: 'Identifier'
                      },
                      type: 'MemberExpression'
                    },
                    property: {
                      name: 'c',
                      type: 'Identifier'
                    },
                    type: 'MemberExpression'
                  },
                  optional: true,
                  property: {
                    name: 'd',
                    type: 'Identifier'
                  },
                  type: 'OptionalMemberExpression'
                },
                property: {
                  name: 'e',
                  type: 'Identifier'
                },
                type: 'MemberExpression'
              },
              property: {
                name: 'f',
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
      `foo?.bar`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              computed: false,
              object: {
                name: 'foo',
                type: 'Identifier'
              },
              optional: true,
              property: {
                name: 'bar',
                type: 'Identifier'
              },
              type: 'OptionalMemberExpression'
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
