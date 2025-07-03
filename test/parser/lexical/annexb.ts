import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Lexical - AnnexB', () => {
  fail('Lexical - AnnexB (fail)', [
    { code: 'function f() {} ; function f() {}', options: { lexical: true, sourceType: 'module' } },
    { code: 'function f(){ var f = 123; if (true) function f(){} }', options: { lexical: true } },
    {
      code: 'function f(){ var f = 123; if (true) function f2(){} }',
      options: { lexical: true, sourceType: 'module' },
    },
    { code: '{ var f = 123; if (true) function f(){} }', options: { lexical: true } },
    { code: '{ var f = 123; if (true) function f2(){} }', options: { lexical: true, sourceType: 'module' } },
    { code: 'function f() {} ; function f() {}', options: { lexical: true, sourceType: 'module' } },
    { code: '{ if (x) function f() {} ; function f() {} }', options: { lexical: true } },
    { code: 'let x; var x;', options: { lexical: true } },
    { code: 'var x; let x;', options: { lexical: true } },
    { code: 'var x; let x;', options: { next: true, lexical: true } },
    { code: 'var x; let x;', options: { next: true, lexical: true } },
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
    "(function() { { function f() { initialBV = f; f = 123; currentBV = f; return 'decl'; } } }());",
    outdent`
      (function() {      {        function f() { return 'inner declaration'; }
        }
        function f() {
          return 'outer declaration';
        }
      }());
    `,
    outdent`
      init = f;
      f = 123;
      changed = f;
      {
        function f() {  }
      }
    `,
    outdent`
      let f = 123;
      init = f;
      {
        function f() {  }
      }
    `,
    outdent`
      try {
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
      }
    `,
    outdent`
      for (let f of [0]) {
      if (true) function f() {  } else function _f() {}
      }
    `,
    outdent`
      for (let f in { key: 0 }) {
      if (true) function f() {  } else function _f() {}
      }
    `,
    outdent`
      {
        function f() {
          return 'first declaration';
        }
      }
      if (false) function _f() {} else function f() { return 'second declaration'; }
    `,
    outdent`
      for (let f in { key: 0 }) {
      if (false) function _f() {} else function f() {  }
      }
    `,
    outdent`
      init = f;
      if (false) function _f() {} else function f() {  }
    `,
    outdent`
      init = f;
      f = 123;
      changed = f;
      if (true) function f() {  } else ;
    `,
    outdent`
      for (let f of [0]) {
      if (true) function f() {  } else ;
      }
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, webcompat: true, lexical: true });
      });
    });
  }
});
