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
    'var p1;/* block comment 1 */ /* block comment 2 */',
    '42 /*The*/ /*Answer*/',
    '// one\n',
    '//',
    'if (x) { doThat() /* Some comment */ }',
    'switch (answer) { case 42: /* perfect */ bingo() }',
    'switch (answer) { case 42: bingo() /* perfect */ }',
    '(function(){ var version = 1; /* sync */ }).call(this)',
    '<!-- foo',
    'var x = 1<!--foo',
    '<!-- comment',
    ' 	 --> comment',
    `/**
    * @type {number}
    */
   var a = 5;`,
    `(/* comment */{
      /* comment 2 */
      p1: null
  })`,
    '/**/ function a() {function o() {}}',
    `while (true) {
      /**
       * comments in empty block
       */
    }`,
    `/*
    Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
    For licensing, see LICENSE.md or http://ckeditor.com/license
   */`,
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
    '{ x\n++y }',
    '{ x\n--y }',
    '{ throw error\nerror; }',
    '{ throw error// Comment\nerror; }',
    '{ throw error/* Multiline\nComment */error; }',
    'a(/* inner */); b(e, /* inner */)',
    'while (true) { continue /* Multiline\nComment */there; }',
    'while (true) { break /* Multiline\nComment */there; }',
    'while (true) { continue // Comment\nthere; }',
    'while (true) { continue\nthere; }',
    'let g = /* before */GeneratorFunction("a", " /* a */ b, c /* b */ //", "/* c */ yield yield; /* d */ //")/* after */;',
    '/* before */async function /* a */ f /* b */ ( /* c */ x /* d */ , /* e */ y /* f */ ) /* g */ { /* h */ ; /* i */ ; /* j */ }/* after */',
    'class H { /* before */async /* a */ [ /* b */ x /* c */ ] /* d */ ( /* e */ ) /* f */ { /* g */ }/* after */ }',
    'class G { /* before */async /* a */ [ /* b */ "g" /* c */ ] /* d */ ( /* e */ ) /* f */ { /* g */ }/* after */ }',
    'class F { /* before */async f /* a */ ( /* b */ ) /* c */ { /* d */ }/* after */ }',
    '/* before */class /* a */ A /* b */ extends /* c */ class /* d */ B /* e */ { /* f */ } /* g */ { /* h */ }/* after */',
    'let g = /* before */function /* a */ ( /* b */ x /* c */ , /* d */ y /* e */ ) /* f */ { /* g */ ; /* h */ ; /* i */ }/* after */;',
    '({ /* before */set /* a */ [ /* b */ x /* c */ ] /* d */ ( /* e */ a /* f */ ) /* g */ { /* h */ }/* after */ })',
    `/*
    */-->`,
    `/*
    */-->the comment extends to these characters`,
    `/* optional FirstCommentLine
    */-->the comment extends to these characters`,
    `/*
    optional
    MultiLineCommentChars */-->the comment extends to these characters`,
    `/*
    */ /* optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters`,
    `/*
    */ /**/ /* second optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters`,
    `0/*
    */-->`,
    `0/*
    */ /**/ /* second optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters`,
    '<!-- -->'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.OptionsWebCompat);
      });
    });
  }

  pass('Miscellaneous - Comments (pass)', [
    [
      '/**/ --> comment',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        body: [],
        end: 16,
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'var x = 42;/*\n*/-->is eol-comment\nvar y = 37;\n',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        body: [
          {
            declarations: [
              {
                end: 10,
                id: {
                  end: 5,
                  name: 'x',
                  start: 4,
                  type: 'Identifier'
                },
                init: {
                  end: 10,
                  start: 8,
                  type: 'Literal',
                  value: 42
                },
                start: 4,
                type: 'VariableDeclarator'
              }
            ],
            end: 11,
            kind: 'var',
            start: 0,
            type: 'VariableDeclaration'
          },
          {
            declarations: [
              {
                end: 44,
                id: {
                  end: 39,
                  name: 'y',
                  start: 38,
                  type: 'Identifier'
                },
                init: {
                  end: 44,
                  start: 42,
                  type: 'Literal',
                  value: 37
                },
                start: 38,
                type: 'VariableDeclarator'
              }
            ],
            end: 45,
            kind: 'var',
            start: 34,
            type: 'VariableDeclaration'
          }
        ],
        end: 46,
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      '/* MLC1 \n */ /* SLDC1 */ /* MLC2 \n */ /* SLDC2 */ --> is eol-comment\n',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        body: [],
        end: 69,
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      '/* before */async function /* a */ f /* b */ ( /* c */ x /* d */ , /* e */ y /* f */ ) /* g */ { /* h */ ; /* i */ ; /* j */ }/* after */',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 137,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 12,
            end: 126,
            id: {
              type: 'Identifier',
              start: 35,
              end: 36,
              name: 'f'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'Identifier',
                start: 55,
                end: 56,
                name: 'x'
              },
              {
                type: 'Identifier',
                start: 75,
                end: 76,
                name: 'y'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 95,
              end: 126,
              body: [
                {
                  type: 'EmptyStatement',
                  start: 105,
                  end: 106
                },
                {
                  type: 'EmptyStatement',
                  start: 115,
                  end: 116
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
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
      Context.OptionsRanges,
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
                    value: true,
                    start: 37,
                    end: 41
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [],
                    start: 43,
                    end: 46
                  },
                  start: 30,
                  end: 46
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
                        name: 'each',
                        start: 61,
                        end: 65
                      },
                      start: 61,
                      end: 65
                    }
                  ],
                  start: 57,
                  end: 66
                }
              ],
              start: 13,
              end: 68
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'f',
              start: 9,
              end: 10
            },
            start: 0,
            end: 68
          }
        ],
        start: 0,
        end: 68
      }
    ],
    [
      'while (i-->0) {}',
      Context.OptionsRanges,
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
                  name: 'i',
                  start: 7,
                  end: 8
                },
                operator: '--',
                prefix: false,
                start: 7,
                end: 10
              },
              right: {
                type: 'Literal',
                value: 0,
                start: 11,
                end: 12
              },
              operator: '>',
              start: 7,
              end: 12
            },
            body: {
              type: 'BlockStatement',
              body: [],
              start: 14,
              end: 16
            },
            start: 0,
            end: 16
          }
        ],
        start: 0,
        end: 16
      }
    ],
    [
      'function x(){ /*Jupiter*/ return; /*Saturn*/}',
      Context.OptionsRanges,
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
                  argument: null,
                  start: 26,
                  end: 33
                }
              ],
              start: 12,
              end: 45
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'x',
              start: 9,
              end: 10
            },
            start: 0,
            end: 45
          }
        ],
        start: 0,
        end: 45
      }
    ],
    [
      'function a() {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [],
              start: 13,
              end: 15
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'a',
              start: 9,
              end: 10
            },
            start: 0,
            end: 15
          }
        ],
        start: 0,
        end: 15
      }
    ],
    [
      '/**/ function a() {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [],
              start: 18,
              end: 20
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'a',
              start: 14,
              end: 15
            },
            start: 5,
            end: 20
          }
        ],
        start: 0,
        end: 20
      }
    ],
    [
      `while (true) {
        /**
         * comments in empty block
         */
      }`,
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'WhileStatement',
            test: {
              type: 'Literal',
              value: true,
              start: 7,
              end: 11
            },
            body: {
              type: 'BlockStatement',
              body: [],
              start: 13,
              end: 81
            },
            start: 0,
            end: 81
          }
        ],
        start: 0,
        end: 81
      }
    ]
  ]);
});
