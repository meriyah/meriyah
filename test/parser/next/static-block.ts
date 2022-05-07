import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Next - Class static initialization block', () => {
  fail('Next - Class static initialization block (fail)', [
    ['class A { static {} }', Context.OptionsWebCompat],
    ['class A { static {} }', Context.None],
    ['class A { static { super() } }', Context.OptionsNext],
    ['class A {}; class B extends A { static { super() } }', Context.OptionsNext],
    ['class A { static async {} }', Context.OptionsNext],
    ['class A { async static {} }', Context.OptionsNext]
  ]);

  pass('Next - Class static initialization block (pass)', [
    [
      `class A { static {} }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  body: [],
                  type: 'StaticBlock'
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { static { this.a } }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  body: [
                    {
                      expression: {
                        computed: false,
                        object: {
                          type: 'ThisExpression'
                        },
                        property: {
                          name: 'a',
                          type: 'Identifier'
                        },
                        type: 'MemberExpression'
                      },
                      type: 'ExpressionStatement'
                    }
                  ],
                  type: 'StaticBlock'
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A {}; class B extends A { static { super.a } }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          },
          {
            type: 'EmptyStatement'
          },
          {
            body: {
              body: [
                {
                  body: [
                    {
                      expression: {
                        computed: false,
                        object: {
                          type: 'Super'
                        },
                        property: {
                          name: 'a',
                          type: 'Identifier'
                        },
                        type: 'MemberExpression'
                      },
                      type: 'ExpressionStatement'
                    }
                  ],
                  type: 'StaticBlock'
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'B',
              type: 'Identifier'
            },
            superClass: {
              name: 'A',
              type: 'Identifier'
            },
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
