import { outdent } from 'outdent';
import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Statements - None', () => {
  fail('Statements - If (fail)', [
    // Esprima issue: https://github.com/jquery/esprima/issues/1866
    'if (true) class C {} else class D {}',
    'if true;',
    'if(!(1))',
    'if(!(true))',
    'if(!("A"))',
    'if (x); else foo: bar: function f(){}',
    'if (false) ; else function* g() {  }',
    'if (true) let x; else let y;',
    'if (false) ; else class C {}',
    '"use strict"; if (true) function f() {  } else function _f() {}',
    { code: '"use strict"; if (true) function f() {  } else function _f() {}', options: { webcompat: true } },
    'if (true) const x = null;',
    'if();',
    'if (1) let x = 10;',
    outdent`
      if({1})
      {
        ;
      }else
      {
        ;
      }
    `,
    'if (a) function(){}',
    'if (a) class A {}',
    'if (true) function* g() {  } else function* _g() {}',
    'if (true) function* g() {  } else ;',
    'if (true) function* g() {  }',
    'if (false) ; else function* g() {  }',
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
