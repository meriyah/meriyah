import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Miscellaneous - Comments', () => {
  fail('Miscellaneous - Comments (fail)', [
    'a /* */ b;',
    ';-->',
    outdent`
      // var /*
      x*/
    `,
    '<!-',
    '</',
    { code: '</', options: { jsx: true } },
    { code: '</*', options: { jsx: true } },
    //[`<// single`, Context.OptionsJSX],
    '</*',
    { code: '</*', options: { jsx: true } },
    { code: '<!-', options: { jsx: true } },
    '</',
    '<*',
    '<!-',
    '<!',
    outdent`
      /* x */
      = 1;
      */
    `,
    outdent`
      /*
      */ the comment should not include these characters, regardless of AnnexB extensions -->
    `,
    '/*FOO/',
    { code: '<!-- HTML comment', options: { sourceType: 'module' } },
    'x/* precomment */ --> is eol-comment\nvar y = 37;\n',
    'var x = a; --> is eol-comment\nvar y = b;\n',
    '</',
    '</',
  ]);

  for (const arg of [
    'x/* precomment */ --> is eol-comment\nvar y = 37;\n',
    'var x = a; --> is eol-comment\nvar y = b;\n',
    'x --> is eol-comment\nvar y = b;\n',
    '/*CHECK#1/',
    '#\n/*\n\n*/',
    outdent`
      /* var*/
      x*/
    `,
    outdent`
      /*
      var
      /* x */
      = 1;
      */
    `,
    outdent`
      // var /*
      x*/
    `,
    ';-->',
    '</',
    outdent`
      /* x */
      = 1;
      */
    `,
    outdent`
      // var /*
      x*/
    `,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { impliedStrict: true });
      });
    });
  }

  for (const arg of [
    // Babylon issue: https://github.com/babel/babel/issues/7802
    '<!-- test --->',
    outdent`
      a /*
      */ b;
    `,
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
    outdent`
      /**
       * @type {number}
       */
      var a = 5;
    `,
    outdent`
      (/* comment */{
          /* comment 2 */
          p1: null
      })
    `,
    '/**/ function a() {function o() {}}',
    outdent`
      while (true) {
        /**
         * comments in empty block
         */
      }
    `,
    outdent`
      /*
        Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
        For licensing, see LICENSE.md or http://ckeditor.com/license
       */
    `,
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
    '\t // foo bar\n // baz \n //',
    '\t /* foo * /* bar \u2028 */  ',
    '\t // foo bar\r // baz \r //',
    '\t /* foo * /* bar \u2029 */  ',
    '\t /* foo bar\r *//* baz*/ \r /**/',
    '\t <!-- foo bar\t <!-- baz \r <!--',
    '\t <!-- foo bar\u2029  ',
    '// foo',
    '/**/ // ',
    '// a /* bcd */ ',
    '  \t <!-- foo bar\n\r  ',
    'function x(){ /*Jupiter*/ return; /*Saturn*/}',
    'var a; // a',
    '/**/42',
    '/**/42',
    '//42',
    '42/**/',
    'function x(){ /*foo*/ return; /*bar*/}',
    '0 /*The*/ /*Answer*/',
    'if (x) { // Some comment\ndoThat(); }',
    'var a; // a',
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
    outdent`
      /*
      */-->
    `,
    outdent`
      /*
      */-->the comment extends to these characters
    `,
    outdent`
      /* optional FirstCommentLine
      */-->the comment extends to these characters
    `,
    outdent`
      /*
      optional
      MultiLineCommentChars */-->the comment extends to these characters
    `,
    outdent`
      /*
      */ /* optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters
    `,
    outdent`
      /*
      */ /**/ /* second optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters
    `,
    outdent`
      0/*
      */-->
    `,
    outdent`
      0/*
      */ /**/ /* second optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters
    `,
    '<!-- -->',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, impliedStrict: true });
      });
    });
  }

  pass('Miscellaneous - Comments (pass)', [
    {
      code: outdent`
        // Single line comment
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
        */
      `,
      options: { next: true, loc: true },
    },
    { code: '/**/ --> comment', options: { ranges: true, webcompat: true } },
    { code: 'var x = 42;/*\n*/-->is eol-comment\nvar y = 37;\n', options: { ranges: true, webcompat: true } },
    {
      code: '/* MLC1 \n */ /* SLDC1 */ /* MLC2 \n */ /* SLDC2 */ --> is eol-comment\n',
      options: { ranges: true, webcompat: true },
    },
    {
      code: '/* before */async function /* a */ f /* b */ ( /* c */ x /* d */ , /* e */ y /* f */ ) /* g */ { /* h */ ; /* i */ ; /* j */ }/* after */',
      options: { ranges: true },
    },
    { code: 'var x = 42;/*\n*/-->is eol-comment\nvar y = 37;\n', options: { webcompat: true } },
    { code: '\n/*precomment*/-->eol-comment\nvar y = 37;\n', options: { webcompat: true } },
    { code: '\n-->is eol-comment\nvar y = 37;\n', options: { webcompat: true } },
    { code: '-->', options: { webcompat: true, ranges: true } },
    { code: '42 /* block comment 1 */ /* block comment 2 */', options: { ranges: true } },
    outdent`
      /* multiline
      comment
      should
      be
      ignored */ 42
    `,
    outdent`
      // line comment
      42
    `,
    '//',
    { code: 'if (x) { /* Some comment */ doThat() }', options: { ranges: true } },
    { code: 'function f() { /* infinite */ while (true) { } /* bar */ var each; }', options: { ranges: true } },
    { code: 'while (i-->0) {}', options: { ranges: true } },
    { code: 'function x(){ /*Jupiter*/ return; /*Saturn*/}', options: { ranges: true } },
    { code: 'function a() {}', options: { ranges: true } },
    { code: '/**/ function a() {}', options: { ranges: true } },
    {
      code: outdent`
        while (true) {
          /**
           * comments in empty block
           */
        }
      `,
      options: { ranges: true },
    },
  ]);
});
