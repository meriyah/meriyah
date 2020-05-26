import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Web compability (AnnexB)', () => {
  describe('HTML Comments', () => {
    for (const arg of [
      // Before first real token.
      '-->',
      '--> is eol-comment',
      '--> is eol-comment\nvar y = 37;\n',
      '\n --> is eol-comment\nvar y = 37;\n',
      '\n-->is eol-comment\nvar y = 37;\n',
      '\n-->\nvar y = 37;\n',
      '/* precomment */ --> is eol-comment\nvar y = 37;\n',
      '/* precomment */-->eol-comment\nvar y = 37;\n',
      '\n/* precomment */ --> is eol-comment\nvar y = 37;\n',
      '\n/*precomment*/-->eol-comment\nvar y = 37;\n',
      // After first real token.
      'var x = 42;\n--> is eol-comment\nvar y = 37;\n',
      'var x = 42;\n/* precomment */ --> is eol-comment\nvar y = 37;\n',
      'x/* precomment\n */ --> is eol-comment\nvar y = 37;\n',
      'var x = 42; /* precomment\n */ --> is eol-comment\nvar y = 37;\n',
      'var x = 42;/*\n*/-->is eol-comment\nvar y = 37;\n',
      // With multiple comments preceding HTMLEndComment
      '/* MLC \n */ /* SLDC */ --> is eol-comment\nvar y = 37;\n',
      '/* MLC \n */ /* SLDC1 */ /* SLDC2 */ --> is eol-comment\nvar y = 37;\n',
      '/* MLC1 \n */ /* MLC2 \n */ --> is eol-comment\nvar y = 37;\n',
      '/* SLDC */ /* MLC \n */ --> is eol-comment\nvar y = 37;\n'
    ]) {
      it(`${arg}`, () => {
        t.doesNotThrow(() => {
          parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
        });
      });

      it(`${arg}`, () => {
        t.throws(() => {
          parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.Strict | Context.Module);
        });
      });
    }

    for (const arg of [
      'x --> is eol-comment\nvar y = 37;\n',
      '"\\n" --> is eol-comment\nvar y = 37;\n',
      'x/* precomment */ --> is eol-comment\nvar y = 37;\n',
      'var x = 42; --> is eol-comment\nvar y = 37;\n'
    ]) {
      it(`${arg}`, () => {
        t.throws(() => {
          parseSource(`${arg}`, undefined, Context.None);
        });
      });
      it(`${arg}`, () => {
        t.throws(() => {
          parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
        });
      });
      it(`${arg}`, () => {
        t.throws(() => {
          parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsWebCompat);
        });
      });
    }
  });

  for (const arg of [
    `"use strict"; if (0) function f(){}`,
    `"use strict";  if (0) function f(){} else;`,
    `"use strict"; if (0); else function f(){}`,
    `"use strict"; label foo: function f(){}`,
    `while(true) function a(){}`,
    `with(true) function a(){}`,
    'for (let a = 0 in {});',
    '"use strict"; for (var a = 0 in {});',
    'for (var {a} = 0 in {});',
    'for (var [a] = 0 in {});',
    'for (const a = 0 in {});',
    // "'use strict'; { function f() {} function f() {} }",
    // Esprima issue:  https://github.com/jquery/esprima/issues/1719
    `if (false) L: async function l() {}`
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    `/\\}?/u;`,
    `/\\{*/u;`,
    `/.{.}/;`,
    `/[\\w-\\s]/;`,
    `/[\\s-\\w]/;`,
    `/(?!.){0,}?/;`,
    `/{/;`,
    `004`,
    `076`,
    `02`,
    'if (x) function f() { return 23; } else function f() { return 42; }',
    'if (x) function f() {}',
    'x = -1 <!--x;',
    'if (true) function f() {  } else function _f() {}',
    'if (true) function f() { return "foo"; } else function _f() {}',
    'for (let f of [0]) {}',
    'for (let f; ; ) {}',
    'for (let f; ; ) {}',
    'for (let f in { key: 0 }) {}',
    `(function(f) {
                      init = f;
                      switch (1) {
                        case 1:
                          function f() {  }
                      }
                      after = f;
                    }(123));`,
    ` try {
                      throw {};
                    } catch ({ f }) {
                    switch (1) {
                      default:
                        function f() {  }
                    }
                    }
                  `,
    `{
                      function f() {
                        return 'first declaration';
                      }
                    }`,
    `{
                      function f() { return 'declaration'; }
                    }`,
    'if (true) function f() {} else function _f() {}',
    'if (false) function _f() {} else function f() { }',
    `for (let f; ; ) {
                      if (false) ; else function f() {  }
                        break;
                      }`,
    `try {
throw {};
} catch ({ f }) {
switch (1) {
case 1:
  function f() {  }
}
}`,
    'if (true) function f() {  } else function _f() {}',
    'if (true) function f() {  } else function _f() {}',
    `switch (1) {
                      default:
                        function f() {  }
                    }`,
    `try {
                      throw {};
                    } catch ({ f }) {
                    switch (1) {
                      case 1:
                        function f() {  }
                    }
                    }`,
    `{
                      let f = 123;
                      switch (1) {
                        case 1:
                          function f() {  }
                      }
                      }`,
    `
                      for (let f in { key: 0 }) {
                      switch (1) {
                        case 1:
                          function f() {  }
                      }
                      }`,
    `var x = 0;
                        x = -1 <!--x;`,
    'if (true) function f() {} else function _f() {}',
    'if (false) function _f() {} else function f() { }',
    'if (x) function f() {}',
    'if (x) function f() { return 23; } else function f() { return 42; }',
    'if (true) function f() {  } else function _f() {}',
    'if (true) function f() { return "foo"; } else function _f() {}',
    'if (true) function f() {  } else function _f() {}',
    'if (true) function f() {  } else function _f() {}',
    '{ if (x) function f() {} ; function f() {} }',
    'var f; function f() {}',
    'function f() {} var f;',
    'function* f() {} function* f() {}',
    'var f; function* f() {}',
    'function* f() {} var f;',
    'function f() {} function* f() {}',
    'if (true) function foo() {}',
    'if (false) {} else function f() { };',
    'label: function f() { }',
    'label: if (true) function f() { }',
    'label: if (true) {} else function f() { }',
    'label: label2: function f() { }',
    'function* f() {} function f() {}',
    'for (let f in { key: 0 }) { switch (1) { case 1: function f() {  } } }',
    'var f = 123;  switch (1) { case 1: function f() {  } }',
    'label: if (true) function f() { }',
    'try { f; } catch (exception) { err1 = exception; } switch (1) { case 1: function f() {  } } try { f; } catch (exception) { err2 = exception; }',
    'try { throw {}; } catch ({ f }) {  if (false) ; else function f() {  }  }',
    'for (let f in { key: 0 }) { if (false) ; else function f() {  } }',
    'if (false) ; else function f() {  }',
    'switch (0) { default: let f; if (true) function f() {  } }',
    '{ function f() {} } if (true) function f() {  }',
    'for (let f of [0]) { if (true) function f() {  } else ; }',
    'let f = 123; if (false) function _f() {} else function f() {  }',
    'for (let f in { key: 0 }) { if (false) function _f() {} else function f() {  } }',
    ' try { throw {}; } catch ({ f }) { if (true) function f() {  } else function _f() {} }',
    'let f = 123; { function f() {  } }',
    'for (let f of [0]) {{ function f() {  } } }',
    '{ let f = 123; { function f() {  } } }',
    '{ function f() {} } { function f() {  }}',
    'label: if (true) {} else function f() { }',
    'label: label2: function f() { }',
    'if (true) function f() { initialBV = f; f = 123; currentBV = f; return "decl"; } else function _f() {}',
    `(function() { { function f() { initialBV = f; f = 123; currentBV = f; return 'decl'; } } }());`,
    `(function() {      {        function f() { return 'inner declaration'; }
    }
    function f() {
      return 'outer declaration';
    }
  }());
  `,
    ` init = f;
  f = 123;
  changed = f;
  {
    function f() {  }
  }`,
    `let f = 123;
  init = f;
  {
    function f() {  }
  }`,
    `  try {
    f;
  } catch (exception) {
    err1 = exception;
  }
  {
    function f() {  }
  }
  try {
    f;
  } catch (exception) {
    err2 = exception;
  }`,
    ` for (let f of [0]) {
    if (true) function f() {  } else function _f() {}
    }`,
    ` for (let f in { key: 0 }) {
    if (true) function f() {  } else function _f() {}
    }`,
    `  {
    function f() {
      return 'first declaration';
    }
  }
  if (false) function _f() {} else function f() { return 'second declaration'; }`,
    ` for (let f in { key: 0 }) {
    if (false) function _f() {} else function f() {  }
    }`,
    ` init = f;
  if (false) function _f() {} else function f() {  }
`,
    `init = f;
  f = 123;
  changed = f;
  if (true) function f() {  } else ;
`,
    ` for (let f of [0]) {
    if (true) function f() {  } else ;
    }`,

    'try {  throw {}; } catch ({ f }) { if (true) function f() {  } else ; }',

    'if (false) ; else function f() {  }',
    'switch (1) { case 1: function f() { initialBV = f; f = 123; currentBV = f; return "decl"; }}',
    'switch (1) { case 1: function f() {} }  function f() {}',
    'try { throw {}; } catch ({ f }) { switch (1) { case 1: function f() {  }  } }',
    'switch (0) { default: let f;  switch (1) { case 1: function f() {  }  } }',
    'let f = 123; switch (1) { case 1: function f() {  } }',
    'for (let f; ; ) { switch (1) { default: function f() {  } } break; }',
    'switch (1) { default: function f() {  } }',
    'function *f() {} function *f() {}',
    '{ function f() {} function f() {} }',
    'if (true) function f() { initialBV = f; f = 123; currentBV = f; return "decl"; } else function _f() {}',
    'if (true) function f() { initialBV = f; f = 123; currentBV = f; return "decl"; } else function _f() {}',
    'switch (0) { default: let f; {function f() {  } }}',
    '{ let f = 123; { function f() {  }} }',
    'try { throw {}; } catch ({ f }) { { function f() {  } } }',
    '{ function f() { return 1; } { function f() { return 2; } }  }',
    '{ if (x) function f() {} ; function f() {} }',
    'var f = 123; if (true) function f() {  } else function _f() {}',
    'if (true) function f() {  } else function _f() {}',
    ' try { throw null;} catch (f) {if (true) function f() { return 123; } else ; }',
    'for (let f in { key: 0 }) {if (true) function f() {  } else ; }',
    '{ if (x) function f() {} ; function f() {} }',
    'for (let f of [0]) { if (true) function f() {  } else ; }',
    '{ function f() {} } if (true) function f() {}',
    'for (let f; ; ) { if (true) function f() {  } break; }',
    'if (true) function f() {  } else function _f() {}',
    'switch (0) { default: let f; if (false) ; else function f() {  } }',
    'switch (0) { default: let f; if (false) ; else function f() {  } }',
    `/*
  */-->
  counter += 1;`,
    `/*
  */-->the comment extends to these characters`,
    `0/*
  */-->`,
    `0/* optional FirstCommentLine
  */-->the comment extends to these characters`,
    `0/*
  optional
  MultiLineCommentChars */-->the comment extends to these characters`,
    `0/*
  */ /* optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters`,
    `0/*
  */ /**/ /* second optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }
});
