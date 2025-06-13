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
    ['if (yield === void 0) { async = false; }', Context.OptionsWebCompat],
    ['if (await === void 0) { async = false; }', Context.OptionsWebCompat],
    ['if (async === void 0) { async = false; }', Context.OptionsWebCompat],
    ['if (a) b()', Context.OptionsWebCompat],
    ['if(a)b;else c;', Context.None],
    ['function f() { if (1) { return () => { while (true) hi(); } } }', Context.None],
    ['if (1) { eval(42) }', Context.None],
    ['if (true) if (false) {} else ; else {}', Context.None],
    ['if (true) try {} finally {} else {}', Context.None],
    ['if(a)b', Context.None],
    ['if(1)/  foo/', Context.OptionsWebCompat],
    ['if (foo) bar;', Context.None],
    ['if (foo) a; if (bar) b; else c;', Context.None],
    ['if (a > 2) {b = c }', Context.None],
    ['if(foo) a = b;', Context.None],
    ['if(1)/  foo/', Context.OptionsWebCompat],

    // Should only pass with AnnexB
    ['if (a) function a(){}', Context.OptionsWebCompat],
    ['if (foo) bar;', Context.None],
    ['if (foo) bar; else doo;', Context.None],
  ]);
});
