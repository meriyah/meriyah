import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Statements - Try', () => {
  fail('Statements - Try (fail)', [
    'function f() { try {}  }',
    'try {} catch(x, f){}',
    'try {} catch(x = b){}',
    'try {} catch(x,){}',
    'try {} catch({x},){}',
    'try {} catch({x}=x){}',
    'try {} catch([x],){}',
    'try {} catch(e=x){}',
    'try {} catch([e]=x){}',
    'try { }',
    'try { } foo();',
    'try { } catch (e) foo();',
    'try { } finally foo();',
    'try { throw []; } catch ([...[ x ] = []]) {}',
    'try { throw []; } catch ([...x = []]) {}',
    'try { throw [1, 2, 3]; } catch ([...{ x }, y]) {}',
    'try { throw [1, 2, 3]; } catch ([...[x], y]) { }',
    'try {} catch ({foo = "bar"} = {}) {}',
    'try {} catch [] {}',
    'try {} catch foo {}',
    'try {} catch({e},){}',
    'try {} catch(){}',
  ]);

  for (const binding of ['var e', 'var {e}', 'var {f, e}', 'var [e]', 'var {f:e}', 'var [[[], e]]']) {
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
        try {
          throw 0;
        } catch (x) {
          for (${binding} of []);
        }
      `,
          { impliedStrict: true },
        );
      });
    });
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          outdent`
            try {
              throw 0;
            } catch (x) {
              for (${binding} of []);
            }
          `,
          { webcompat: true },
        );
      });
    });
  }

  // Check that the above applies even for nested catches.
  for (const binding of ['var e', 'var {e}', 'var {g, e}', 'var [e]', 'var {g:e}', 'var [[[], e]]']) {
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
      try {
        throw 0;
      } catch (x) {
        try {
          throw 1;
        } catch (f) {
          try {
            throw 2;
          } catch ({}) {
            for (${binding} of []);
          }
        }
      }
    `,
          { webcompat: true },
        );
      });
    });
  }

  // Check that the above applies if a declaration scope is between the
  // catch and the loop.
  for (const binding of ['var e', 'var {e}', 'var {f, e}', 'var [e]', 'var {f:e}', 'var [[[], e]]']) {
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
      try {
        throw 0;
      } catch (x) {
        (()=>{for (${binding} of []);})();
      }
    `,
          { webcompat: true },
        );
      });
    });

    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
    try {
      throw 0;
    } catch (x) {
      (function() {
        for (${binding} of []);
      })();
    }
  `,
          { webcompat: true },
        );
      });
    });
  }

  // Check that there is no error when not declaring a var named e.
  for (const binding of [
    'var f',
    'var {}',
    'var {x:f}',
    'x',
    '{x}',
    'let x',
    'const x',
    'let {x}',
    'const {x}',
    'let [x]',
    'const [x]',
    'let {x:y}',
    'const {x:y}',
  ]) {
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
      try {
        throw 0;
      } catch (e) {
        for (${binding} of []);
      }
    `,
          { webcompat: true },
        );
      });
    });
  }

  pass('Statements - Try (pass)', [
    { code: 'try {} catch(e){}', options: { webcompat: true } },
    { code: 'try { } catch (e) { foo: bar: third: function f(){} }', options: { webcompat: true } },
    { code: 'try {} catch({e}){}', options: { webcompat: true } },
    { code: 'try {} catch([e]){}', options: { webcompat: true } },
    { code: 'try {} catch({e=x}){}', options: { webcompat: true } },
    { code: 'try {} catch([e=x]){}', options: { webcompat: true } },
    { code: 'try {} catch {}', options: { webcompat: true } },
    { code: 'try {} catch {} finally {}', options: { webcompat: true } },
    { code: 'try {} catch \n {}', options: { webcompat: true } },
    { code: 'try { } catch (e) { var x; for (var y of []) {} }', options: { webcompat: true } },
    {
      code: 'function __f_3() { try { __f_3(); } catch(e) { eval("let fun = ({a} = {a: 30}) => {"); } }',
      options: { webcompat: true },
    },
    {
      code: 'try { throw null; } catch (f) {if (false) ; else function f() { return 123; }}',
      options: { webcompat: true },
    },
    'try{}catch(a){}',
    'try { } catch (eval) { }',
    'try { } catch (e) { say(e) }',
    'try { } catch ([a = 0]) { }',
    'try { } catch (e) { let a; }',
    'try { } catch ([]) {}',
    'try { throw [1, 2, 3]; } catch ([...x]) {}',
    'try {} catch([e=x]){}',
    'try {} catch({e=x}){}',
    'try {} catch([e]){}',
    'try {} finally {}',
    'try {} finally {}\n/foo/g',
    'try {try { let e; } catch { let e; } finally { let e; }} catch (e) { }',
    { code: 'try {try { } catch { } finally { }} catch ({e}) { }', options: { ranges: true, loc: true } },
    'try {} catch(x) { x = 0; }',
    'try {} catch(x) { with ({}) { x = 1; } }',
    'try {} catch ([a,b,c]) { }',
    'try {} catch (foo) {} var foo;',
    'try { throw null; } catch ({}) {}',
    'try { } catch (a) { { const a = b; } }',
    'try {} catch(e) { try {} catch (e) {} }',
    'try {} catch (foo) { { let foo; } }',
    'var foo; try {} catch (_) { let foo; }',
    'try {} catch (e) { { let e = x; } }',
    'try {} catch (foo) {} let foo;',
    'try {} catch (e) { let b = x; }',
    { code: 'try {} catch (e) { var e = x; }', options: { webcompat: true } },
    'try {} catch (a) { }',
    'try {} catch (e) { for (const e in y) {} }',
    'try {} catch (e) { for (let e of y) {} }',
    'try {} catch (e) { for (const e of y) {} }',
    { code: 'try {} catch (e) { for (var e in y) {} }', options: { webcompat: true } },
    'try {} catch (e) { for (let e of y) {} }',
    'try {} catch (e) { for (const e of y) {} }',
    'var foo; try {} catch (_) { const foo = 1; }',
    outdent`
      try {
        var x = 2;
        probeTry = function() { return x; };
        throw [];
      } catch ([_ = (eval('var x = 3;'), probeParam = function() { return x; })]) {
        var x = 4;
        probeBlock = function() { return x; };
      }
    `,
    'try {} catch(e) {}',
  ]);
});
