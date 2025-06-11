import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Statements - Try', () => {
  fail('Statements - Try (fail)', [
    ['function f() { try {}  }', Context.None],
    ['try {} catch(x, f){}', Context.None],
    ['try {} catch(x = b){}', Context.None],
    ['try {} catch(x,){}', Context.None],
    ['try {} catch({x},){}', Context.None],
    ['try {} catch({x}=x){}', Context.None],
    ['try {} catch([x],){}', Context.None],
    ['try {} catch(e=x){}', Context.None],
    ['try {} catch([e]=x){}', Context.None],
    ['try { }', Context.None],
    ['try { } foo();', Context.None],
    ['try { } catch (e) foo();', Context.None],
    ['try { } finally foo();', Context.None],
    ['try { throw []; } catch ([...[ x ] = []]) {}', Context.None],
    ['try { throw []; } catch ([...x = []]) {}', Context.None],
    ['try { throw [1, 2, 3]; } catch ([...{ x }, y]) {}', Context.None],
    ['try { throw [1, 2, 3]; } catch ([...[x], y]) { }', Context.None],
    ['try {} catch ({foo = "bar"} = {}) {}', Context.None],
    ['try {} catch [] {}', Context.None],
    ['try {} catch foo {}', Context.None],
    ['try {} catch({e},){}', Context.None],
    ['try {} catch(){}', Context.None],
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
          undefined,
          Context.Strict,
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
            for (${binding} of []);
          }
        `,
          undefined,
          Context.OptionsWebCompat,
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
          undefined,
          Context.OptionsWebCompat,
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
          undefined,
          Context.OptionsWebCompat,
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
          undefined,
          Context.OptionsWebCompat,
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
          undefined,
          Context.OptionsWebCompat,
        );
      });
    });
  }

  pass('Statements - Try (pass)', [
    [
      'try {} catch(e){}',
      Context.OptionsWebCompat,
      
    ],
    [
      'try { } catch (e) { foo: bar: third: function f(){} }',
      Context.OptionsWebCompat,
      
    ],
    [
      'try {} catch({e}){}',
      Context.OptionsWebCompat,
      
    ],
    [
      'try {} catch([e]){}',
      Context.OptionsWebCompat,
      
    ],
    [
      'try {} catch({e=x}){}',
      Context.OptionsWebCompat,
      
    ],
    [
      'try {} catch([e=x]){}',
      Context.OptionsWebCompat,
      
    ],
    [
      'try {} catch {}',
      Context.OptionsWebCompat,
      
    ],
    [
      'try {} catch {} finally {}',
      Context.OptionsWebCompat,
      
    ],
    [
      'try {} catch \n {}',
      Context.OptionsWebCompat,
      
    ],
    [
      'try { } catch (e) { var x; for (var y of []) {} }',
      Context.OptionsWebCompat,
      
    ],
    [
      'function __f_3() { try { __f_3(); } catch(e) { eval("let fun = ({a} = {a: 30}) => {"); } }',
      Context.OptionsWebCompat,
      
    ],
    [
      'try { throw null; } catch (f) {if (false) ; else function f() { return 123; }}',
      Context.OptionsWebCompat,
      
    ],
    [
      'try{}catch(a){}',
      Context.None,
      
    ],
    [
      'try { } catch (eval) { }',
      Context.None,
      
    ],
    [
      'try { } catch (e) { say(e) }',
      Context.None,
      
    ],
    [
      'try { } catch ([a = 0]) { }',
      Context.None,
      
    ],
    [
      'try { } catch (e) { let a; }',
      Context.None,
      
    ],
    [
      'try { } catch ([]) {}',
      Context.None,
      
    ],
    [
      'try { throw [1, 2, 3]; } catch ([...x]) {}',
      Context.None,
      
    ],
    [
      'try {} catch([e=x]){}',
      Context.None,
      
    ],
    [
      'try {} catch({e=x}){}',
      Context.None,
      
    ],
    [
      'try {} catch([e]){}',
      Context.None,
      
    ],
    [
      'try {} finally {}',
      Context.None,
      
    ],
    [
      'try {} finally {}\n/foo/g',
      Context.None,
      
    ],
    [
      'try {try { let e; } catch { let e; } finally { let e; }} catch (e) { }',
      Context.None,
      
    ],
    [
      'try {try { } catch { } finally { }} catch ({e}) { }',
      Context.None | Context.OptionsRanges | Context.OptionsLoc,
      
    ],
    [
      'try {} catch(x) { x = 0; }',
      Context.None,
      
    ],
    [
      'try {} catch(x) { with ({}) { x = 1; } }',
      Context.None,
      
    ],
    [
      'try {} catch ([a,b,c]) { }',
      Context.None,
      
    ],
    [
      'try {} catch (foo) {} var foo;',
      Context.None,
      
    ],
    [
      'try { throw null; } catch ({}) {}',
      Context.None,
      
    ],
    [
      'try { } catch (a) { { const a = b; } }',
      Context.None,
      
    ],
    [
      'try {} catch(e) { try {} catch (e) {} }',
      Context.None,
      
    ],
    [
      'try {} catch (foo) { { let foo; } }',
      Context.None,
      
    ],
    [
      'var foo; try {} catch (_) { let foo; }',
      Context.None,
      
    ],
    [
      'try {} catch (e) { { let e = x; } }',
      Context.None,
      
    ],
    [
      'try {} catch (foo) {} let foo;',
      Context.None,
      
    ],
    [
      'try {} catch (e) { let b = x; }',
      Context.None,
      
    ],
    [
      'try {} catch (e) { var e = x; }',
      Context.OptionsWebCompat,
      
    ],
    [
      'try {} catch (a) { }',
      Context.None,
      
    ],
    [
      'try {} catch (e) { for (const e in y) {} }',
      Context.None,
      
    ],
    [
      'try {} catch (e) { for (let e of y) {} }',
      Context.None,
      
    ],
    [
      'try {} catch (e) { for (const e of y) {} }',
      Context.None,
      
    ],
    [
      'try {} catch (e) { for (var e in y) {} }',
      Context.OptionsWebCompat,
      
    ],
    [
      'try {} catch (e) { for (let e of y) {} }',
      Context.None,
      
    ],
    [
      'try {} catch (e) { for (const e of y) {} }',
      Context.None,
      
    ],
    [
      'var foo; try {} catch (_) { const foo = 1; }',
      Context.None,
      
    ],
    [
      `try {
      var x = 2;
      probeTry = function() { return x; };
      throw [];
    } catch ([_ = (eval('var x = 3;'), probeParam = function() { return x; })]) {
      var x = 4;
      probeBlock = function() { return x; };
    }`,
      Context.None,
      
    ],
    [
      'try {} catch(e) {}',
      Context.None,
      
    ],
  ]);
});
