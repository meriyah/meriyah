import { describe } from 'vitest';
import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - None', () => {
  fail('Statements - If (fail)', [
    // Esprima issue: https://github.com/jquery/esprima/issues/1866
    ['if (true) class C {} else class D {}', Context.None],
    ['if true;', Context.None],
    ['if(!(1))', Context.None],
    ['if(!(true))', Context.None],
    ['if(!("A"))', Context.None],
    ['if (x); else foo: bar: function f(){}', Context.None],
    ['if (false) ; else function* g() {  }', Context.None],
    ['if (true) let x; else let y;', Context.None],
    ['if (false) ; else class C {}', Context.None],
    ['"use strict"; if (true) function f() {  } else function _f() {}', Context.None],
    ['"use strict"; if (true) function f() {  } else function _f() {}', Context.OptionsWebCompat],
    ['if (true) const x = null;', Context.None],
    ['if();', Context.None],
    ['if (1) let x = 10;', Context.None],
    [
      `if({1})
    {
      ;
    }else
    {
      ;
    }`,
      Context.None,
    ],
    ['if (a) function(){}', Context.None],
    ['if (a) class A {}', Context.None],
    ['if (true) function* g() {  } else function* _g() {}', Context.None],
    ['if (true) function* g() {  } else ;', Context.None],
    ['if (true) function* g() {  }', Context.None],
    ['if (false) ; else function* g() {  }', Context.None],
  ]);

  pass('Statements - If (pass)', [
    { code: 'if (yield === void 0) { async = false; }', options: { webcompat: true } },
    { code: 'if (await === void 0) { async = false; }', options: { webcompat: true } },
    { code: 'if (async === void 0) { async = false; }', options: { webcompat: true } },
    { code: 'if (a) b()', options: { webcompat: true } },
    'if(a)b;else c;',
    'function f() { if (1) { return () => { while (true) hi(); } } }',
    'if (1) { eval(42) }',
    'if (true) if (false) {} else ; else {}',
    'if (true) try {} finally {} else {}',
    'if(a)b',
    { code: 'if(1)/  foo/', options: { webcompat: true } },
    'if (foo) bar;',
    'if (foo) a; if (bar) b; else c;',
    'if (a > 2) {b = c }',
    'if(foo) a = b;',
    { code: 'if(1)/  foo/', options: { webcompat: true } },

    // Should only pass with AnnexB
    { code: 'if (a) function a(){}', options: { webcompat: true } },
    'if (foo) bar;',
    'if (foo) bar; else doo;',
  ]);
});
