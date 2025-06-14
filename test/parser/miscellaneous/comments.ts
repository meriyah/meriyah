import { Context } from '../../../src/common';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';

import { parseSource } from '../../../src/parser';
import { pass, fail } from '../../test-utils';

describe('Miscellaneous - Comments', () => {
  fail('Miscellaneous - Comments (fail)', [
    ['a /* */ b;', Context.None],
    [';-->', Context.None],
    [
      `// var /*
    x*/`,
      Context.None,
    ],
    [`<!-`, Context.None],
    [`</`, Context.None],
    [`</`, Context.OptionsJSX],
    [`</*`, Context.OptionsJSX],
    //[`<// single`, Context.OptionsJSX],
    [`</*`, Context.None],
    [`</*`, Context.OptionsJSX],
    [`<!-`, Context.OptionsJSX],
    [`</`, Context.None],
    [`<*`, Context.None],
    [`<!-`, Context.None],
    [`<!`, Context.None],
    [
      `/* x */
    = 1;
    */`,
      Context.None,
    ],
    [
      `/*
    */ the comment should not include these characters, regardless of AnnexB extensions -->`,
      Context.None,
    ],
    [`/*FOO/`, Context.None],
    [`<!-- HTML comment`, Context.Strict | Context.Module],
    ['x/* precomment */ --> is eol-comment\nvar y = 37;\n', Context.None],
    ['var x = a; --> is eol-comment\nvar y = b;\n', Context.None],
    [`</`, Context.None],
    [`</`, Context.None],
  ]);

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
            x*/`,
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
    `a /*
    */ b;`,
    '<!-- console.log("foo") -->',
    String.raw`//\u00A0 single line \u00A0 comment \u00A0`,
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
    '<!-- -->',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.OptionsWebCompat);
      });
    });
  }

  pass('Miscellaneous - Comments (pass)', [
    [
      `// Single line comment
      // Single line comment
      // Single line comment
      // Single line comment
      /**/
      /* MLC on one line */
      /*
      MLC
      on
      multiple
      lines
      */`,
      Context.OptionsNext | Context.OptionsLoc,
    ],
    ['/**/ --> comment', Context.OptionsRanges | Context.OptionsWebCompat],
    ['var x = 42;/*\n*/-->is eol-comment\nvar y = 37;\n', Context.OptionsRanges | Context.OptionsWebCompat],
    [
      '/* MLC1 \n */ /* SLDC1 */ /* MLC2 \n */ /* SLDC2 */ --> is eol-comment\n',
      Context.OptionsRanges | Context.OptionsWebCompat,
    ],
    [
      '/* before */async function /* a */ f /* b */ ( /* c */ x /* d */ , /* e */ y /* f */ ) /* g */ { /* h */ ; /* i */ ; /* j */ }/* after */',
      Context.OptionsRanges,
    ],
    ['var x = 42;/*\n*/-->is eol-comment\nvar y = 37;\n', Context.OptionsWebCompat],
    ['\n/*precomment*/-->eol-comment\nvar y = 37;\n', Context.OptionsWebCompat],
    ['\n-->is eol-comment\nvar y = 37;\n', Context.OptionsWebCompat],
    ['-->', Context.OptionsWebCompat | Context.OptionsRanges],
    ['42 /* block comment 1 */ /* block comment 2 */', Context.OptionsRanges],
    [
      `/* multiline
      comment
      should
      be
      ignored */ 42`,
      Context.None,
    ],
    [
      `// line comment
      42`,
      Context.None,
    ],
    ['//', Context.None],
    ['if (x) { /* Some comment */ doThat() }', Context.OptionsRanges],
    ['function f() { /* infinite */ while (true) { } /* bar */ var each; }', Context.OptionsRanges],
    ['while (i-->0) {}', Context.OptionsRanges],
    ['function x(){ /*Jupiter*/ return; /*Saturn*/}', Context.OptionsRanges],
    ['function a() {}', Context.OptionsRanges],
    ['/**/ function a() {}', Context.OptionsRanges],
    [
      `while (true) {
        /**
         * comments in empty block
         */
      }`,
      Context.OptionsRanges,
    ],
  ]);
});
