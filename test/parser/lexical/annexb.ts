import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - AnnexB', () => {
  fail('Lexical - AnnexB (fail)', [
    ['function f() {} ; function f() {}', Context.Module | Context.OptionsLexical],
    ['function f(){ var f = 123; if (true) function f(){} }', Context.Module | Context.OptionsLexical],
    ['{ var f = 123; if (true) function f(){} }', Context.Module | Context.OptionsLexical],
    ['function f() {} ; function f() {}', Context.Module | Context.OptionsLexical],
    ['{ if (x) function f() {} ; function f() {} }', Context.None | Context.OptionsLexical],
    ['let x; var x;', Context.None | Context.OptionsLexical],
    ['var x; let x;', Context.None | Context.OptionsLexical],
    ['var x; let x;', Context.None | Context.OptionsLexical | Context.OptionsNext],
    ['var x; let x;', Context.None | Context.OptionsLexical | Context.OptionsNext]
  ]);

  for (const arg of [
    '{ function f() {} ; function f() {} }',
    '{ if (x) function f() {} ; function f() {} }',
    'function f() {} ; function f() {}',
    'function g(){ function f() {} ; function f() {} }',
    'function f(){ var f = 123; if (true) function f(){} }',
    '{ var f = 123; if (true) function f(){} }',
    'try { throw {}; } catch ({ f }) { if (false) function _f() {} else function f() {  } }',
    'for (let f in { key: 0 }) { { function f() {  } } }',
    'switch (0) { default: let f; if (true) function f() {  } }',
    '{ function f() {} } if (true) function f() {  }',
    'try {  throw {}; } catch ({ f }) { if (true) function f() {  } else ; }',
    'switch (1) { case 1: function f() { initialBV = f; f = 123; currentBV = f; return "decl"; }}',
    'switch (1) { case 1: function f() {} }  function f() {}',
    'try { throw {}; } catch ({ f }) { switch (1) { case 1: function f() {  }  } }',
    'switch (0) { default: let f;  switch (1) { case 1: function f() {  }  } }',
    'let f = 123; switch (1) { case 1: function f() {  } }',
    'for (let f; ; ) { switch (1) { default: function f() {  } } break; }',
    'switch (1) { default: function f() {  } }',
    '{ let f = 123; { function f() {  }} }',
    'try { throw {}; } catch ({ f }) { { function f() {  } } }',
    '{ function f() { return 1; } { function f() { return 2; } }  }',
    '{ if (x) function f() {} ; function f() {} }',
    'var f = 123; if (true) function f() {  } else function _f() {}',
    'for (let f in { key: 0 }) {if (true) function f() {  } else ; }',
    'try { throw {}; } catch ({ f }) { if (true) function f() {  } }',
    '{ if (x) function f() {} ; function f() {} }',
    'for (let f of [0]) { if (true) function f() {  } else ; }',
    '{ function f() {} } if (true) function f() {}',
    'for (let f; ; ) { if (true) function f() {  } break; }',
    'if (true) function f() {  } else function _f() {}',
    'switch (0) { default: let f; if (false) ; else function f() {  } }',
    'for (let f of [0]) { if (true) function f() {  } else ; }',
    'let f = 123; if (false) function _f() {} else function f() {  }',
    '{ let f = 123; { function f() {  } } }',
    '{ function f() {} } { function f() {  }}',
    'if (true) function f() { initialBV = f; f = 123; currentBV = f; return x; }',
    'try { throw {}; } catch ({ f }) { if (true) function f() {  } else function _f() {} }',
    'for (let f in { key: 0 }) { if (false) function _f() {} else function f() {  } }',
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
      }`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical | Context.OptionsNext);
      });
    });
  }
});
