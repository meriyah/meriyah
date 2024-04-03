import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Template', () => {
  for (const arg of [
    '`${"a"}`',
    '`${1}`',
    'example3 = 1 + `${foo}${bar}${baz}`',
    '`${""}`',
    'y`${y,0}`',
    '`${y,0}`',
    'foo = `${1}${f}oo${true}${b}ar${0}${baz}`',
    'bar = bar`wow\naB${ 42 } ${_.baz()}`',
    'bar`wow\na${ 42 }b ${_.foobar()}`',
    ' bar`wow\naB${ 42 } ${_.baz()}`',
    'function z() {}; `z`;',
    'function z() {}; `${z}`;',
    'function z() {}; `${z}${z}`;',
    'function z() {}; `${z}${z}${z}`;',
    "function z() {}; `${'z'}${z}${z}`;",
    "function z() {}; `${'z'}${'z'}${z}`;",
    "function z() {}; `${'z'}${'z'}${async}`;",
    "function z() {}; '' + z + '';",
    'function z() {}; z`${`${z}`}`;',
    'function z() {}; z``;',
    'function z() {}; ``;',
    '(`${function(id) { return id }}`);',
    "function y() {} y`${`${'z'}${`${function(id) { return id }})${ /x/g >= 'c'}`}`}`;",
    'tag`foo\\n`',
    't`foo\\n`;',
    'foo`\r\\\n${0}`',
    '`a\\u{062}c`',
    '`a\\u{000000062}c`',
    'tag`foo\\n`',
    't`foo\\n`;',
    '`a\\u{d}c`',
    '`a\\u{062}c`',
    '`a\\u{000000062}c`',
    'async`\n${0}`',
    'foo`\n${0}`',
    'foo`\\\n${0}`',
    'foo`\\r${0}`',
    'foo`\r\n${0}`',
    'foo`\\\r\\\n${0}`',
    'foo`\\\r\n${0}`',
    'foo`\r\\\n${0}`',
    'foo`\\r\\n${0}`',
    'foo`\u2029${0}`',
    'foo`\\\u2029${0}`',
    'foo`\\n${0}`',
    'foo`\\r${0}`',
    'foo`\\\r\\\n${0}`',
    'foo`\r\\n${0}`',
    'foo`\\\u2029${0}`',
    '`\r\n\t\n`',
    'sampleTag`\\01`',
    'sampleTag`left${0}\\u{\\u{0}`',
    'sampleTag`left${0}\\u{-0}${1}right`',
    'sampleTag`left${0}\\u{g}${1}right`',
    'sampleTag`left${0}\\u000g${1}right`',
    'tag`template-head${a}`',
    'tag `no-subst-template`',
    'tag\t`foo\n\nbar\r\nbaz`',
    'tag`foo${a /* comment */}`',
    '`outer${{x: {y: 10}}}bar${`nested${function(){return 1;}}endnest`}end`',
    'foo`T\\u200C`',
    'foo`\\u{00000000034}`',
    '`\\ю`',
    '`\\б`',
    'a\r\nb`\n\r\nb\\u{g`;',
    '`a\\r\\nb`',
    '`a\r\nb`',
    '`${ {class: 1} }`',
    '`${ {enum: 1} }`',
    '`${ {function: 1} }`',
    '`foo`',
    '`foo\\u25a0`',
    'foo`\\unicode`',
    // 'foo`\\u`',
    'foo`\\u\\n\\r`',
    'foo`\\uaa\\n\\r`',
    'raw`hello ${name}`',
    '`$`',
    '`\\n\\r\\b\\v\\t\\f\\\n\\\r\n`',
    '`\n\r\n\r`',
    '`outer${{x: {y: 10}}}bar${`nested${function(){return 1;}}endnest`}end`',
    'tag`\\08`',
    'tag`\\01`',
    'tag`\\01${0}right`',
    'tag`left${0}\\01`',
    'tag`left${0}\\01${1}right`',
    'tag`\\1${0}right`',
    'tag`left${0}\\1`',
    'tag`left${0}\\1${1}right`',
    'tag`\\xg`',
    'tag`\\xg${0}right`',
    'tag`left${0}\\xg`',
    'tag`left${0}\\xg${1}right`',
    'tag`\\xAg`',
    'tag`\\xAg${0}right`',
    'tag`left${0}\\xAg`',
    'tag`left${0}\\xAg${1}right`',
    'tag`\\u0`',
    'tag`\\u0${0}right`',
    'tag`left${0}\\u0`',
    'tag`left${0}\\u0${1}right`',
    'tag`\\u0g`',
    'tag`\\u0g${0}right`',
    'tag`left${0}\\u0g`',
    'tag`left${0}\\u0g${1}right`',
    'tag`\\u00g`',
    'tag`\\u00g${0}right`',
    'tag`left${0}\\u00g`',
    'tag`left${0}\\u00g${1}right`',
    'tag`\\u000g`',
    'tag`\\u000g${0}right`',
    'tag`left${0}\\u000g`',
    'tag`left${0}\\u000g${1}right`',
    'tag`\\u{}`',
    'tag`left${0}\\u{-0}`',
    'tag`left${0}\\u{-0}${1}right`',
    'tag`\\u{g}`',
    'tag`\\u{g}${0}right`',
    'tag`left${0}\\u{g}`',
    'tag`left${0}\\u{g}${1}right`',
    'tag`\\u{0${0}right`',
    'tag`left${0}\\u{0${1}right`',
    'tag`\\u{\\u{0}`',
    'tag`\\u{\\u{0}${0}right`',
    'tag`left${0}\\u{\\u{0}`',
    'tag`left${0}\\u{\\u{0}${1}right`',
    'tag`\\u{110000}`',
    'tag`\\u{110000}${0}right`',
    'tag`left${0}\\u{110000}`',
    'tag`left${0}\\u{110000}${1}right`',
    'tag`\\u{}${0}right`',
    'tag`left${0}\\u{}`',
    'tag`left${0}\\u{}${1}right`',
    'tag`\\u{-0}`',
    'tag`\\u{-0}${0}right`',
    'tag`\\1`',
    'tag ``',
    'tag`foo${a \r\n}`',
    'tag`foo${a \r}`',
    'tag`foo${// comment\na}`',
    'tag`foo${\n a}`',
    'tag`foo${\n async}`',
    'tag`async${\n a}`',
    '`a${b}`',
    "'use strict'; `no-subst-template`",
    "function foo(){ 'use strict';`template-head${a}`}",
    "function foo(){ 'use strict';`${a}`}",
    "function foo(){ 'use strict';`${a}template-tail`}",
    "'use strict'; `template-head${a}template-tail`",
    "'use strict'; `${a}${b}${c}`",
    "function foo(){ 'use strict';`a${a}b${b}c${c}`}",
    `\`\\\${a}\``,
    `\`$a\``,
    `\`\${a}\${b}\``,
    `\`a\${a}\${b}\``,
    `\`\${a}a\${b}\``,
    `\`a\${a}a\${b}\``,
    'a`\\${a}`',
    `\`\${a}\${b}a\``,
    `\`\${a}a\${b}a\``,
    `\`a\${a}a\${b}a\``,
    `\`\${\`\${a}\`}\``,
    `\`\${\`a\${a}\`}\``,
    `\`\${\`\${a}a\`}\``,
    `\`\${\`a\${a}a\`}\``,
    `\`\${\`\${\`\${a}\`}\`}\``,
    'tag`\\xg`',
    'tag`\\xg${0}right`',
    'tag`left${0}\\xg`',
    'tag`left${0}\\xg${1}right`',
    'tag`\\xAg`',
    'tag`\\xAg${0}right`',
    'tag`left${0}\\xAg`',
    'tag`left${0}\\xAg${1}right`',
    'tag`\\u0`',
    'tag`\\u0${0}right`',
    'tag`left${0}\\u0`',
    'tag`left${0}\\u0${1}right`',
    'tag`\\u0g`',
    'tag`\\u0g${0}right`',
    'tag`left${0}\\u0g`',
    'tag`left${0}\\u0g${1}right`',
    'tag`\\u00g`',
    'tag`\\u00g${0}right`',
    'tag`left${0}\\u00g`',
    'tag`left${0}\\u00g${1}right`',
    'tag`\\u000g`',
    'tag`\\u000g${0}right`',
    'tag`left${0}\\u000g`',
    'tag`left${0}\\u000g${1}right`',
    'tag`\\u{}`',
    'tag`\\u{}${0}right`',
    'tag`left${0}\\u{}`',
    'tag`left${0}\\u{}${1}right`',
    'tag`\\u{-0}`',
    'tag`\\u{-0}${0}right`',
    'tag`left${0}\\u{-0}`',
    'tag`left${0}\\u{-0}${1}right`',
    'tag`\\u{g}`',
    'tag`\\u{g}${0}right`',
    'tag`left${0}\\u{g}`',
    'tag`left${0}\\u{g}${1}right`',
    'tag`left${0}\\u{0${1}right`',
    'tag`\\u{\\u{0}`',
    'tag`\\u{\\u{0}${0}right`',
    'tag`left${0}\\u{\\u{0}`',
    'tag`left${0}\\u{\\u{0}${1}right`',
    'tag`\\u{110000}`',
    'tag`\\u{110000}${0}right`',
    'tag    `${a}a${b}b${c}c`',
    'tag\t`foo\n\nbar\r\nbaz`',
    'tag\r`foo\n\n${  bar  }\r\nbaz`',
    'tag`foo${a /* comment */}`',
    'tag`foo${a // comment\n}`',
    'tag`foo${a \n}`',
    'tag`foo${a \r\n}`',
    'tag`foo${a \r}`',
    'tag`foo${/* comment */ a}`',
    'tag`foo${// comment\na}`',
    'tag`foo${\n a}`',
    'tag`foo${\r\n a}`',
    'tag`foo${\r a}`',
    "tag`foo${'a' in a}`",
    "'use strict'; tag\r\n`a${a}b${b}c${c}`",
    "'use strict'; tag    `${a}a${b}b${c}c`",
    'function cherow() { var a, b, c; return tag\t`foo\n\nbar\r\nbaz`}',
    'function cherow() { var a, b, c; return tag\r`foo\n\n${  bar  }\r\nbaz`}',
    'function cherow() { var a, b, c; return tag`foo${a /* comment */}`}',
    'function cherow() { var a, b, c; return tag`foo${a // comment\n}`}',
    '`no-subst-template`',
    '`template-head${a}`',
    'f`\\xg ${x}`;',
    '`${a}`',
    '`${a}template-tail`',
    '`template-head${a}template-tail`',
    '`${a}${b}${c}`',
    '`a${a}b${b}c${c}`',
    '`${a}a${b}b${c}c`',
    '`foo\n\nbar\r\nbaz`',
    '`foo\n\n${  bar  }\r\nbaz`',
    '`foo${a /* comment */}`',
    '`foo${a // comment\n}`',
    '`foo${a \n}`',
    '`foo${a \r\n}`',
    '`async${a \r\n}`',
    '`foo${a \r}`',
    '`foo${/* comment */ a}`',
    '`foo${// comment\na}`',
    '`foo${\n a}`',
    '`foo${\r\n a}`',
    '`foo${\r a}`',
    "`foo${'a' in a}`",
    'a``',
    'let a;',
    'var foo = `simple template`;',
    'var async = `simple template`;',
    'let foo = f`template with function`;',
    'const foo = f`template with ${some} ${variables}`;',
    'var foo = f`template with ${some}${variables}${attached}`;',
    'let foo = f()`template with function call before`;',
    'const foo = f().g`template with more complex function call`;',
    '`${z}${z}`',
    '`${z}${z}${z}`',
    '`${"z"}${z}${z}`',
    '`${"z"}${"z"}${z}`',
    'z`${`${z}`}`',
    '`\n\r`',
    '`\r\n`',
    '`$$$a}`',
    '`a℮`',
    '`دیوانه`',
    '`℘`',
    '`foo\\tbar`',
    '`\\x55a`',
    '`f1o2o`',
    '`a\\u{d}c`',
    'x`a\\u{d}c${0}`',
    '`a\\u{0062}c`',
    '`a\\{000062}c`',
    '`a\\u{00000062}c`',
    '`a\\u{000000062}c`',
    '`\\\0${0}`',
    'x`\0${0}`',
    'x`\\\0${0}`',
    'x`\\r${0}`',
    'x`\\\r\\\n${0}`',
    'x`\\\r\n${0}`',
    'x`\r\\\n${0}`',
    'x`\\r\\n${0}`',
    'x`\\r\n${0}`',
    'x`\r\\n${0}`',
    'x`\\\r\\n${0}`',
    'x`\\\u2028${0}`',
    'x`\u2029${0}`',
    'x`\\\u2029${0}`',
    'x`\r${0}`',
    'x`\r\n${0}`',
    'x`\\r\n${0}`',
    'x`\\\r\\n${0}`',
    'f`${x} \\xg ${x}`;',
    'x`\\\u2028${0}`',
    'x`\\0`',
    'x`\\08`',
    'x`\\0\\0`',
    '() => tagged`template literal`',
    'var str = `x${y}`.toUpperCase();',
    'var str = `x`.toUpperCase();',
    'var str = `x${y}` + z; var str2 = `x${y}` * z;',
    'var a = `a`, b = c`b`;',
    'var str = `${a}${b}`',
    'var str = `${a + b}${c}`;',
    'var str = x`y${(() => 42)()}`;',
    'var str = `foo${ bar }baz`;',
    'var str = `foo${bar}baz`;',
    'var string = `foo${`${bar}`}`',
    "simpleTag`str1 ${'str2'} str3 ${'str4'} str5 ${'str6'} str7 ${'str8'} str9`",
    'x`\\ua48c`',
    'x`\\h`',
    'x`\\h`',
    'x`bunch of escape chars \\v\\t\\n\\b\\a`',
    'x`$ $ $ {} } { }} {{`',
    'x`\\xF8`',
    'x`\r\n`',
    'x`\r\n\r\n`',
    'x`\n\n\n\n\n\n\n\n\n\n`',
    '`$$${a}`',
    'z``',
    '``',
    'test`\\uG`;',
    'test`\\xG`;',
    'test`\\18`;',
    '(`\n`)',
    '(`\r`)',
    'new nestedNewOperatorFunction`1``2``3``array`',
    "tag()`'\\00a0'`;",
    "(tag = () => {})`'\\00a0'`",
    "(() => {})`'\\00a0'`",
    "(function tag() { return () => {}; })()`'\\00a0'`",
    "(function() { return () => {}; })()`'\\00a0'`",
    "(function tag() {})`'\\00a0'`",
    "(function() {})`'\\00a0'`",
    'String.raw`{\rtf1adeflang1025ansiansicpg1252\\uc1`;'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.TaggedTemplate);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.TaggedTemplate | Context.OptionsWebCompat);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.TaggedTemplate | Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.TaggedTemplate | Context.OptionsNext | Context.OptionsLexical);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.TaggedTemplate);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.TaggedTemplate);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.TaggedTemplate);
      });
    });
  }

  fail('Expressions - Template (fail)', [
    ['`', Context.Strict],
    ['x = `1 ${ yield } 2`', Context.Strict],
    ['x = `1 ${ yield } 2 ${ 3 } 4`', Context.Strict],
    ['x = `1 ${ yield } 2`', Context.Strict],
    ['x = `1 ${ yield x } 2`', Context.Strict],
    ['x = `1 ${ yield x } 2 ${ 3 } 4`', Context.Strict],
    ['`foo ${a b} bar`', Context.Strict],
    ['x`foo ${a b} bar`', Context.Strict],
    ['[`${""}`] = {}', Context.None],
    //['`a\\u{d}c`', Context.None],
    ['[`${""}`] = {}', Context.None],
    ['[`${""}`] = {}', Context.None],
    ['[z``] = {}', Context.None],
    ['[`${"a"}`] = {}', Context.None],
    ['[`${""}`] = {}', Context.None],
    ['`\\7`', Context.None],
    ['`\\10`', Context.None],
    ['`\\01`', Context.None],
    ['`\\30`', Context.None],
    ['`\\001`', Context.None],

    ['`\\xg`;', Context.None],
    ['`\\xg ${x}`;', Context.None],
    ['`${x} \\xg ${x}`;', Context.None],
    ['`${x} \\xg`;', Context.None],
    ['`\\001`', Context.None],
    ['`\\001`', Context.None],
    ['`\\001`', Context.None],
    ['`\\001`', Context.None],
    ['`a${await foo}d`', Context.None],
    ['`\\u{g}`', Context.None],
    ['`\\u00g0`', Context.None],
    ['`\\ufffg${', Context.None],
    ['`\\uAA`', Context.None],
    ['`\\u11${', Context.None],
    ['`\\u{g}`', Context.None],
    ['`\\u{110000}${', Context.None],
    ['`\\u{11ffff}${', Context.None]
  ]);
  pass('Expressions - Template (pass)', [
    [
      'var await = `simple template`;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'simple template',
                        raw: 'simple template'
                      },
                      tail: true
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'await'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '`${y, x`)`}`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'y'
                    },
                    {
                      type: 'TaggedTemplateExpression',
                      tag: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      quasi: {
                        type: 'TemplateLiteral',
                        expressions: [],
                        quasis: [
                          {
                            type: 'TemplateElement',
                            value: {
                              cooked: ')',
                              raw: ')'
                            },
                            tail: true
                          }
                        ]
                      }
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`${x`)`, y}`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'TaggedTemplateExpression',
                      tag: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      quasi: {
                        type: 'TemplateLiteral',
                        expressions: [],
                        quasis: [
                          {
                            type: 'TemplateElement',
                            value: {
                              cooked: ')',
                              raw: ')'
                            },
                            tail: true
                          }
                        ]
                      }
                    },
                    {
                      type: 'Identifier',
                      name: 'y'
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`a${b=c}d`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  }
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'a',
                    raw: 'a'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'd',
                    raw: 'd'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f`x${/foo/}y`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {
                type: 'Identifier',
                name: 'f'
              },
              quasi: {
                type: 'TemplateLiteral',
                expressions: [
                  {
                    type: 'Literal',
                    value: /foo/,
                    regex: {
                      pattern: 'foo',
                      flags: ''
                    }
                  }
                ],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: 'x',
                      raw: 'x'
                    },
                    tail: false
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: 'y',
                      raw: 'y'
                    },
                    tail: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '`foo ${a} and ${b} and ${c} baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                },
                {
                  type: 'Identifier',
                  name: 'c'
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo ',
                    raw: 'foo '
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: ' and ',
                    raw: ' and '
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: ' and ',
                    raw: ' and '
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: ' baz',
                    raw: ' baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '{`foo baz`}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo baz',
                        raw: 'foo baz'
                      },
                      tail: true
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{`foo ${a} baz`}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        raw: 'foo ',
                        cooked: 'foo '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        raw: ' baz',
                        cooked: ' baz'
                      },
                      tail: true
                    }
                  ],
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    }
                  ]
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{`foo ${a} and ${b} and ${c} baz`}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    },
                    {
                      type: 'Identifier',
                      name: 'c'
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo ',
                        raw: 'foo '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' and ',
                        raw: ' and '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' and ',
                        raw: ' and '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' baz',
                        raw: ' baz'
                      },
                      tail: true
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '`foo${{}}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: []
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`foo${{a,b}}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`foo${`foo`}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo',
                        raw: 'foo'
                      },
                      tail: true
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`foo${`foo${bar}baz`}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo',
                        raw: 'foo'
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'baz',
                        raw: 'baz'
                      },
                      tail: true
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '{`foo ${a} and ${b} and ${`w ${d} x ${e} y ${f} z`} baz`}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    },
                    {
                      type: 'TemplateLiteral',
                      expressions: [
                        {
                          type: 'Identifier',
                          name: 'd'
                        },
                        {
                          type: 'Identifier',
                          name: 'e'
                        },
                        {
                          type: 'Identifier',
                          name: 'f'
                        }
                      ],
                      quasis: [
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: 'w ',
                            raw: 'w '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' x ',
                            raw: ' x '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' y ',
                            raw: ' y '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' z',
                            raw: ' z'
                          },
                          tail: true
                        }
                      ]
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo ',
                        raw: 'foo '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' and ',
                        raw: ' and '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' and ',
                        raw: ' and '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' baz',
                        raw: ' baz'
                      },
                      tail: true
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '`a ${function(){}} b`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: null
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'a ',
                    raw: 'a '
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: ' b',
                    raw: ' b'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],

    [
      'function *f(){   x = `1 ${ yield } 2`   }',
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'TemplateLiteral',
                      expressions: [
                        {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        }
                      ],
                      quasis: [
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: '1 ',
                            raw: '1 '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' 2',
                            raw: ' 2'
                          },
                          tail: true
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],

    [
      '`foo${bar}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'bar'
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`foo${{a,b} = x}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`${ {function: 1} }`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'function'
                      },
                      value: {
                        type: 'Literal',
                        value: 1
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`${ {class: 1} }`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'class'
                      },
                      value: {
                        type: 'Literal',
                        value: 1
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`${ foo({class: 1}) }`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'class'
                          },
                          value: {
                            type: 'Literal',
                            value: 1
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'var y = `{${x}}`;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: '{',
                        raw: '{'
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: '}',
                        raw: '}'
                      },
                      tail: true
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '`${x} + ${y} = ${x + y}` === "5 + 10 = 15"',
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
                type: 'TemplateLiteral',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'Identifier',
                    name: 'y'
                  },
                  {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    operator: '+'
                  }
                ],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: '',
                      raw: ''
                    },
                    tail: false
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: ' + ',
                      raw: ' + '
                    },
                    tail: false
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: ' = ',
                      raw: ' = '
                    },
                    tail: false
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: '',
                      raw: ''
                    },
                    tail: true
                  }
                ]
              },
              right: {
                type: 'Literal',
                value: '5 + 10 = 15'
              },
              operator: '==='
            }
          }
        ]
      }
    ],
    [
      '`outer${{x: {y: 10}}}bar${`nested${function(){return 1;}}endnest`}end`;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      value: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            value: {
                              type: 'Literal',
                              value: 10
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ReturnStatement',
                            argument: {
                              type: 'Literal',
                              value: 1
                            }
                          }
                        ]
                      },
                      async: false,
                      generator: false,

                      id: null
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'nested',
                        raw: 'nested'
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'endnest',
                        raw: 'endnest'
                      },
                      tail: true
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'outer',
                    raw: 'outer'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'bar',
                    raw: 'bar'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'end',
                    raw: 'end'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'var y = `{ ${x} }`;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: '{ ',
                        raw: '{ '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' }',
                        raw: ' }'
                      },
                      tail: true
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '`${/\\d/.exec("1")[0]}`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Literal',
                        value: /\d/,
                        regex: {
                          pattern: '\\d',
                          flags: ''
                        }
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'exec'
                      }
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: '1'
                      }
                    ]
                  },
                  computed: true,
                  property: {
                    type: 'Literal',
                    value: 0
                  }
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`${ {delete: 1} }`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'delete'
                      },
                      value: {
                        type: 'Literal',
                        value: 1
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`${ {enum: 1} }`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'enum'
                      },
                      value: {
                        type: 'Literal',
                        value: 1
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo`x${a}y${b}z`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {
                type: 'Identifier',
                name: 'foo'
              },
              quasi: {
                type: 'TemplateLiteral',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: 'x',
                      raw: 'x'
                    },
                    tail: false
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: 'y',
                      raw: 'y'
                    },
                    tail: false
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: 'z',
                      raw: 'z'
                    },
                    tail: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'a.foo`bar`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              quasi: {
                type: 'TemplateLiteral',
                expressions: [],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: 'bar',
                      raw: 'bar'
                    },
                    tail: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'abc`bar`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {
                type: 'Identifier',
                name: 'abc'
              },
              quasi: {
                type: 'TemplateLiteral',
                expressions: [],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: 'bar',
                      raw: 'bar'
                    },
                    tail: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '`bar`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'bar',
                    raw: 'bar'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`foo ${a} and ${b} and ${c} baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                },
                {
                  type: 'Identifier',
                  name: 'c'
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo ',
                    raw: 'foo '
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: ' and ',
                    raw: ' and '
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: ' and ',
                    raw: ' and '
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: ' baz',
                    raw: ' baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '{`foo baz`}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo baz',
                        raw: 'foo baz'
                      },
                      tail: true
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{`foo ${a} baz`}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo ',
                        raw: 'foo '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' baz',
                        raw: ' baz'
                      },
                      tail: true
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{`foo ${a} and ${b} and ${c} baz`}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    },
                    {
                      type: 'Identifier',
                      name: 'c'
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo ',
                        raw: 'foo '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' and ',
                        raw: ' and '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' and ',
                        raw: ' and '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' baz',
                        raw: ' baz'
                      },
                      tail: true
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '`foo${{}}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: []
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`foo${{a,b}}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`foo${{a,b} = x}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`foo${`foo`}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo',
                        raw: 'foo'
                      },
                      tail: true
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '`foo${`foo${bar}baz`}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo',
                        raw: 'foo'
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'baz',
                        raw: 'baz'
                      },
                      tail: true
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '{`foo ${a} and ${b} and ${`w ${d} x ${e} y ${f} z`} baz`}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    },
                    {
                      type: 'TemplateLiteral',
                      expressions: [
                        {
                          type: 'Identifier',
                          name: 'd'
                        },
                        {
                          type: 'Identifier',
                          name: 'e'
                        },
                        {
                          type: 'Identifier',
                          name: 'f'
                        }
                      ],
                      quasis: [
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: 'w ',
                            raw: 'w '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' x ',
                            raw: ' x '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' y ',
                            raw: ' y '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' z',
                            raw: ' z'
                          },
                          tail: true
                        }
                      ]
                    }
                  ],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: 'foo ',
                        raw: 'foo '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' and ',
                        raw: ' and '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' and ',
                        raw: ' and '
                      },
                      tail: false
                    },
                    {
                      type: 'TemplateElement',
                      value: {
                        cooked: ' baz',
                        raw: ' baz'
                      },
                      tail: true
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '`a ${()=>{}} b`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [],
                  async: false,
                  expression: false
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'a ',
                    raw: 'a '
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: ' b',
                    raw: ' b'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],

    [
      '`a ${(k)=>{x}} b`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'k'
                    }
                  ],

                  async: false,
                  expression: false
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'a ',
                    raw: 'a '
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: ' b',
                    raw: ' b'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x = `1 ${ yield } 2`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'TemplateLiteral',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'yield'
                  }
                ],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: '1 ',
                      raw: '1 '
                    },
                    tail: false
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: ' 2',
                      raw: ' 2'
                    },
                    tail: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = `1 ${ yield } 2 ${ 3 } 4`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'TemplateLiteral',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  {
                    type: 'Literal',
                    value: 3
                  }
                ],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: '1 ',
                      raw: '1 '
                    },
                    tail: false
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: ' 2 ',
                      raw: ' 2 '
                    },
                    tail: false
                  },
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: ' 4',
                      raw: ' 4'
                    },
                    tail: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'function *f(){   x = `1 ${ yield } 2`   }',
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'TemplateLiteral',
                      expressions: [
                        {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        }
                      ],
                      quasis: [
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: '1 ',
                            raw: '1 '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' 2',
                            raw: ' 2'
                          },
                          tail: true
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){   x = `1 ${ yield } 2 ${ 3 } 4`   }',
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'TemplateLiteral',
                      expressions: [
                        {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        },
                        {
                          type: 'Literal',
                          value: 3
                        }
                      ],
                      quasis: [
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: '1 ',
                            raw: '1 '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' 2 ',
                            raw: ' 2 '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' 4',
                            raw: ' 4'
                          },
                          tail: true
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){   x = `1 ${ yield x } 2`   }',
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'TemplateLiteral',
                      expressions: [
                        {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          delegate: false
                        }
                      ],
                      quasis: [
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: '1 ',
                            raw: '1 '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' 2',
                            raw: ' 2'
                          },
                          tail: true
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){   x = `1 ${ yield x } 2 ${ 3 } 4`   }',
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'TemplateLiteral',
                      expressions: [
                        {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          delegate: false
                        },
                        {
                          type: 'Literal',
                          value: 3
                        }
                      ],
                      quasis: [
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: '1 ',
                            raw: '1 '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' 2 ',
                            raw: ' 2 '
                          },
                          tail: false
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            cooked: ' 4',
                            raw: ' 4'
                          },
                          tail: true
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '`foo${bar}baz`',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'bar'
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'foo',
                    raw: 'foo'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: 'baz',
                    raw: 'baz'
                  },
                  tail: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'tagA`a`\ntagB`b`',
      Context.None | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {
                type: 'Identifier',
                name: 'tagA',
                start: 0,
                end: 4,
                range: [0, 4],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 4
                  }
                }
              },
              quasi: {
                type: 'TemplateLiteral',
                expressions: [],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: 'a',
                      raw: 'a'
                    },
                    tail: true,
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    loc: {
                      start: {
                        line: 1,
                        column: 5
                      },
                      end: {
                        line: 1,
                        column: 6
                      }
                    }
                  }
                ],
                start: 4,
                end: 7,
                range: [4, 7],
                loc: {
                  start: {
                    line: 1,
                    column: 4
                  },
                  end: {
                    line: 1,
                    column: 7
                  }
                }
              },
              start: 0,
              end: 7,
              range: [0, 7],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 7
                }
              }
            },
            start: 0,
            end: 7,
            range: [0, 7],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 7
              }
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {
                type: 'Identifier',
                name: 'tagB',
                start: 8,
                end: 12,
                range: [8, 12],
                loc: {
                  start: {
                    line: 2,
                    column: 0
                  },
                  end: {
                    line: 2,
                    column: 4
                  }
                }
              },
              quasi: {
                type: 'TemplateLiteral',
                expressions: [],
                quasis: [
                  {
                    type: 'TemplateElement',
                    value: {
                      cooked: 'b',
                      raw: 'b'
                    },
                    tail: true,
                    start: 13,
                    end: 14,
                    range: [13, 14],
                    loc: {
                      start: {
                        line: 2,
                        column: 5
                      },
                      end: {
                        line: 2,
                        column: 6
                      }
                    }
                  }
                ],
                start: 12,
                end: 15,
                range: [12, 15],
                loc: {
                  start: {
                    line: 2,
                    column: 4
                  },
                  end: {
                    line: 2,
                    column: 7
                  }
                }
              },
              start: 8,
              end: 15,
              range: [8, 15],
              loc: {
                start: {
                  line: 2,
                  column: 0
                },
                end: {
                  line: 2,
                  column: 7
                }
              }
            },
            start: 8,
            end: 15,
            range: [8, 15],
            loc: {
              start: {
                line: 2,
                column: 0
              },
              end: {
                line: 2,
                column: 7
              }
            }
          }
        ],
        start: 0,
        end: 15,
        range: [0, 15],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 2,
            column: 7
          }
        }
      }
    ],
    [
      '`${b()}${c()}`',
      Context.None | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'b',
                    start: 3,
                    end: 4,
                    range: [3, 4],
                    loc: {
                      start: {
                        line: 1,
                        column: 3
                      },
                      end: {
                        line: 1,
                        column: 4
                      }
                    }
                  },
                  arguments: [],
                  start: 3,
                  end: 6,
                  range: [3, 6],
                  loc: {
                    start: {
                      line: 1,
                      column: 3
                    },
                    end: {
                      line: 1,
                      column: 6
                    }
                  }
                },
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'c',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    loc: {
                      start: {
                        line: 1,
                        column: 9
                      },
                      end: {
                        line: 1,
                        column: 10
                      }
                    }
                  },
                  arguments: [],
                  start: 9,
                  end: 12,
                  range: [9, 12],
                  loc: {
                    start: {
                      line: 1,
                      column: 9
                    },
                    end: {
                      line: 1,
                      column: 12
                    }
                  }
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false,
                  start: 1,
                  end: 1,
                  range: [1, 1],
                  loc: {
                    start: {
                      line: 1,
                      column: 1
                    },
                    end: {
                      line: 1,
                      column: 1
                    }
                  }
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: false,
                  start: 7,
                  end: 7,
                  range: [7, 7],
                  loc: {
                    start: {
                      line: 1,
                      column: 7
                    },
                    end: {
                      line: 1,
                      column: 7
                    }
                  }
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true,
                  start: 13,
                  end: 13,
                  range: [13, 13],
                  loc: {
                    start: {
                      line: 1,
                      column: 13
                    },
                    end: {
                      line: 1,
                      column: 13
                    }
                  }
                }
              ],
              start: 0,
              end: 14,
              range: [0, 14],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 14
                }
              }
            },
            start: 0,
            end: 14,
            range: [0, 14],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 14
              }
            }
          }
        ],
        start: 0,
        end: 14,
        range: [0, 14],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 14
          }
        }
      }
    ],
    [
      'function a() {\nreturn `1234${b}`;\n}\n',
      Context.None | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            id: {
              type: 'Identifier',
              name: 'a',
              start: 9,
              end: 10,
              range: [9, 10],
              loc: {
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 10
                }
              }
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'TemplateLiteral',
                    expressions: [
                      {
                        type: 'Identifier',
                        name: 'b',
                        start: 29,
                        end: 30,
                        range: [29, 30],
                        loc: {
                          start: {
                            line: 2,
                            column: 14
                          },
                          end: {
                            line: 2,
                            column: 15
                          }
                        }
                      }
                    ],
                    quasis: [
                      {
                        type: 'TemplateElement',
                        value: {
                          cooked: '1234',
                          raw: '1234'
                        },
                        tail: false,
                        start: 23,
                        end: 27,
                        range: [23, 27],
                        loc: {
                          start: {
                            line: 2,
                            column: 8
                          },
                          end: {
                            line: 2,
                            column: 12
                          }
                        }
                      },
                      {
                        type: 'TemplateElement',
                        value: {
                          cooked: '',
                          raw: ''
                        },
                        tail: true,
                        start: 31,
                        end: 31,
                        range: [31, 31],
                        loc: {
                          start: {
                            line: 2,
                            column: 16
                          },
                          end: {
                            line: 2,
                            column: 16
                          }
                        }
                      }
                    ],
                    start: 22,
                    end: 32,
                    range: [22, 32],
                    loc: {
                      start: {
                        line: 2,
                        column: 7
                      },
                      end: {
                        line: 2,
                        column: 17
                      }
                    }
                  },
                  start: 15,
                  end: 33,
                  range: [15, 33],
                  loc: {
                    start: {
                      line: 2,
                      column: 0
                    },
                    end: {
                      line: 2,
                      column: 18
                    }
                  }
                }
              ],
              start: 13,
              end: 35,
              range: [13, 35],
              loc: {
                start: {
                  line: 1,
                  column: 13
                },
                end: {
                  line: 3,
                  column: 1
                }
              }
            },
            async: false,
            generator: false,
            start: 0,
            end: 35,
            range: [0, 35],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 3,
                column: 1
              }
            }
          }
        ],
        start: 0,
        end: 36,
        range: [0, 36],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 4,
            column: 0
          }
        }
      }
    ],
    [
      "tag()`'\\00a0'`;",
      Context.None,
      {
        body: [
          {
            expression: {
              quasi: {
                expressions: [],
                quasis: [
                  {
                    tail: true,
                    type: 'TemplateElement',
                    value: {
                      cooked: undefined,
                      raw: "'\\00a0'"
                    }
                  }
                ],
                type: 'TemplateLiteral'
              },
              tag: {
                arguments: [],
                callee: {
                  name: 'tag',
                  type: 'Identifier'
                },
                type: 'CallExpression'
              },
              type: 'TaggedTemplateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      "(tag = () => {})`'\\00a0'`",
      Context.None,
      {
        body: [
          {
            expression: {
              quasi: {
                expressions: [],
                quasis: [
                  {
                    tail: true,
                    type: 'TemplateElement',
                    value: {
                      cooked: undefined,
                      raw: "'\\00a0'"
                    }
                  }
                ],
                type: 'TemplateLiteral'
              },
              tag: {
                left: {
                  name: 'tag',
                  type: 'Identifier'
                },
                operator: '=',
                right: {
                  async: false,
                  body: {
                    body: [],
                    type: 'BlockStatement'
                  },
                  expression: false,
                  params: [],
                  type: 'ArrowFunctionExpression'
                },
                type: 'AssignmentExpression'
              },
              type: 'TaggedTemplateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'String.raw`{\rtf1adeflang1025ansiansicpg1252\\uc1`;',
      Context.None,
      {
        body: [
          {
            expression: {
              quasi: {
                expressions: [],
                quasis: [
                  {
                    tail: true,
                    type: 'TemplateElement',
                    value: {
                      cooked: undefined,
                      raw: '{\rtf1adeflang1025ansiansicpg1252\\uc1'
                    }
                  }
                ],
                type: 'TemplateLiteral'
              },
              tag: {
                computed: false,
                object: {
                  name: 'String',
                  type: 'Identifier'
                },
                property: {
                  name: 'raw',
                  type: 'Identifier'
                },
                type: 'MemberExpression'
              },
              type: 'TaggedTemplateExpression'
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
