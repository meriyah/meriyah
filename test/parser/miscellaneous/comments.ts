import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';
import { pass } from '../../test-utils';

describe('Miscellaneous - Comments', () => {
  for (const arg of [
    'x/* precomment */ --> is eol-comment\nvar y = 37;\n',
    'var x = a; --> is eol-comment\nvar y = b;\n',
    'x --> is eol-comment\nvar y = b;\n',
    `/*CHECK#1/`,
    '#\n/*\n\n*/',
    `
    /* var*/
    x*/`,
    `/*
    var
    /* x */
    = 1;
    */`,
    `// var /*
    x*/`,
    `;-->`,
    `</`,
    `/* x */
            = 1;
            */`,
    `// var /*
            x*/`
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict);
      });
    });
  }

  for (const arg of [
    // Babylon issue: https://github.com/babel/babel/issues/7802
    `<!-- test --->`,
    '<!-- console.log("foo") -->',
    '//\\u00A0 single line \\u00A0 comment \\u00A0',
    '// foo',
    '// foo /* bar */',
    '/* foo */ // bar',
    '/* multiline */',
    '/** multiline */',
    '\n/*\n^\n*/',
    '""\n/*\n^\n*/',
    '     \n/*\n^\n*/',
    '    /* */      /*   /*  /*    */  \n/*\n^\n*/',
    '\r\r\n/*\n^\n*/',
    '\r\n/*\n^\n*/',
    '\n\r/*\n^\n*/',
    '\r/*\n^\n*/',
    '\n/**/',
    '\n/*\n*/',
    '\n/*\n\n*/',
    '\n/**/\n',
    '\n/*\n\n*/\n',
    '\n/*\nfuse.box\n*/\n',
    'foo\n/*\n\n*/',
    '/*a\r\nb*/ 0',
    '/*a\rb*/ 0',
    '/*a\nb*/ 0',
    '/*a\nc*/ 0',
    'let a = () => /* = */ { return "b" }',
    'let a = () => { /* = */ return "b" }',
    'let a = () /* = */ => { return "b" }',
    '(/* className: string */) => {}',
    '0 // line comment',
    '// Hello, Icefapper!\n1220',
    '//',
    '0/**/',
    '/* not comment*/; i-->0',
    '// Hello, Icefapper!\n',
    '// line comment\n0',
    '// foo',
    '// /* foo */',
    '\t\t\t\t\t\t\t\t',
    '\t // foo bar${lt}  ',
    `\t // foo bar\n // baz \n //`,
    `\t /* foo * /* bar \u2028 */  `,
    `\t // foo bar\r // baz \r //`,
    `\t /* foo * /* bar \u2029 */  `,
    `\t /* foo bar\r *//* baz*/ \r /**/`,
    `\t <!-- foo bar\t <!-- baz \r <!--`,
    `\t <!-- foo bar\u2029  `,
    '// foo',
    '/**/ // ',
    '// a /* bcd */ ',
    `  \t <!-- foo bar\n\r  `,
    `function x(){ /*Jupiter*/ return; /*Saturn*/}`,
    `var a; // a`,
    '/**/42',
    '/**/42',
    '//42',
    '42/**/',
    'function x(){ /*foo*/ return; /*bar*/}',
    '0 /*The*/ /*Answer*/',
    'if (x) { // Some comment\ndoThat(); }',
    `var a; // a`,
    // 'var x = 42;/*\n*/-->is eol-comment\nvar y = 37;\n',
    // '/* MLC1 \n */ /* SLDC1 */ /* MLC2 \n */ /* SLDC2 */ --> is eol-comment\n',
    '{ x\n++y }',
    '{ x\n--y }',
    '{ throw error\nerror; }',
    '{ throw error// Comment\nerror; }',
    '{ throw error/* Multiline\nComment */error; }',
    'a(/* inner */); b(e, /* inner */)',
    'while (true) { continue /* Multiline\nComment */there; }',
    'while (true) { break /* Multiline\nComment */there; }',
    'while (true) { continue // Comment\nthere; }',
    'while (true) { continue\nthere; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict);
      });
    });
  }

  pass('Miscellaneous - Comments (pass)', [
    [
      'var x = 42;/*\n*/-->is eol-comment\nvar y = 37;\n',
      Context.OptionsWebCompat,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'x',
                  type: 'Identifier'
                },
                init: {
                  type: 'Literal',
                  value: 42
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          },
          {
            declarations: [
              {
                id: {
                  name: 'y',
                  type: 'Identifier'
                },
                init: {
                  type: 'Literal',
                  value: 37
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '\n/*precomment*/-->eol-comment\nvar y = 37;\n',
      Context.OptionsWebCompat,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'y',
                  type: 'Identifier'
                },
                init: {
                  type: 'Literal',
                  value: 37
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '\n-->is eol-comment\nvar y = 37;\n',
      Context.OptionsWebCompat,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'y',
                  type: 'Identifier'
                },
                init: {
                  type: 'Literal',
                  value: 37
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '-->',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [],
        start: 0,
        end: 3
      }
    ],
    [
      '42 /* block comment 1 */ /* block comment 2 */',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 42,
              start: 0,
              end: 2
            },
            start: 0,
            end: 2
          }
        ],
        start: 0,
        end: 46
      }
    ],
    [
      `/* multiline
      comment
      should
      be
      ignored */ 42`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 42
            }
          }
        ]
      }
    ],
    [
      `// line comment
      42`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 42
            }
          }
        ]
      }
    ],
    [
      '//',
      Context.None,
      {
        body: [],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'if (x) { /* Some comment */ doThat() }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'x',
              start: 4,
              end: 5
            },
            consequent: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'doThat',
                      start: 28,
                      end: 34
                    },
                    arguments: [],
                    start: 28,
                    end: 36
                  },
                  start: 28,
                  end: 36
                }
              ],
              start: 7,
              end: 38
            },
            alternate: null,
            start: 0,
            end: 38
          }
        ],
        start: 0,
        end: 38
      }
    ],
    [
      'function f() { /* infinite */ while (true) { } /* bar */ var each; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'WhileStatement',
                  test: {
                    type: 'Literal',
                    value: true
                  },
                  body: {
                    type: 'BlockStatement',
                    body: []
                  }
                },
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: null,
                      id: {
                        type: 'Identifier',
                        name: 'each'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'while (i-->0) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'WhileStatement',
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'i'
                },
                operator: '--',
                prefix: false
              },
              right: {
                type: 'Literal',
                value: 0
              },
              operator: '>'
            },
            body: {
              type: 'BlockStatement',
              body: []
            }
          }
        ]
      }
    ],
    [
      'function x(){ /*Jupiter*/ return; /*Saturn*/}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: null
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      '/**/ function a() {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      `while (true) {
        /**
         * comments in empty block
         */
      }`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'WhileStatement',
            test: {
              type: 'Literal',
              value: true
            },
            body: {
              type: 'BlockStatement',
              body: []
            }
          }
        ]
      }
    ]
  ]);
});
