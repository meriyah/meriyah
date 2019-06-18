import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Try', () => {
  for (let declaration of [
    'var e',
    'var f, e',
    // 'var {e} = 0',
    'let {} = 0',
    'let {e:f} = 0',
    '{ function e(){} }'
  ]) {
    it(`try { throw 0; } catch(e) { ${declaration} }`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `try { throw 0; } catch(e) { ${declaration} }`,
          undefined,
          Context.OptionsLexical | Context.OptionsWebCompat
        );
      });
    });
  }

  for (let declaration of [
    'let e',
    'let f, g, e',
    'let [f] = [], [] = [], e = e, h',
    'let {e} = 0',
    'let {f, e} = 0',
    'let {f, g} = 0, {e} = 0',
    'let {f = 0, e = 1} = 0',
    'let [e] = 0',
    'let [f, e] = 0',
    'let {f:e} = 0',
    'let [[[], e]] = 0',
    'const e = 0',
    'const f = 0, g = 0, e = 0',
    'const {e} = 0',
    'const [e] = 0',
    'const {f:e} = 0',
    'const [[[], e]] = 0',
    'function e(){}',
    'function* e(){}'
  ]) {
    it(`try { throw 0; } catch(e) { ${declaration} } `, () => {
      t.throws(() => {
        parseSource(`try { throw 0; } catch(e) { ${declaration} } `, undefined, Context.OptionsLexical);
      });
    });

    it(`try { throw 0; } catch({e}) { ${declaration} }`, () => {
      t.throws(() => {
        parseSource(`try { throw 0; } catch({e}) { ${declaration} }`, undefined, Context.OptionsLexical);
      });
    });

    it(`try { throw 0; } catch(e) { ${declaration} }`, () => {
      t.throws(() => {
        parseSource(`try { throw 0; } catch(e) { ${declaration} }`, undefined, Context.OptionsLexical);
      });
    });

    it(`try { throw 0; } catch(e) { (()=>{${declaration}})(); }`, () => {
      t.doesNotThrow(() => {
        parseSource(`try { throw 0; } catch(e) { (()=>{${declaration}})(); }`, undefined, Context.OptionsLexical);
      });
    });

    it(`try { throw 0; } catch(e) { (function(){${declaration}})(); }`, () => {
      t.doesNotThrow(() => {
        parseSource(`try { throw 0; } catch(e) { (function(){${declaration}})(); }`, undefined, Context.OptionsLexical);
      });
    });
  }

  fail('Statements - Try (fail)', [
    ['try {} catch (e) { for (var e in y) {} }', Context.OptionsLexical],
    ['try {} catch (e) { for (var e;;) {} }', Context.OptionsLexical],
    ['try {} catch (e) { var e = x; }', Context.OptionsLexical],
    ['try {} catch(e) { var e; }', Context.OptionsLexical],
    ['try { } catch (x) { for (var x of []) {} }', Context.Strict | Context.OptionsLexical],
    ['try { } catch (x) { let x; }', Context.Strict | Context.OptionsLexical],
    ['function f() { try {} catch (e) { function e(){} } }', Context.Strict | Context.OptionsLexical],
    ['try {} catch (a, a) { }', Context.OptionsLexical],
    ['try {} catch ([a,a]) { }', Context.OptionsLexical],
    ['try {} catch ([a] = b) { }', Context.OptionsLexical],
    ['try {} catch (a) { const a = 1; } ', Context.OptionsLexical],
    ['try { } catch (x) { for (var x of []) {} }', Context.OptionsLexical],
    ['try { } catch (x) { let x; }', Context.OptionsLexical],
    ['try {} catch (foo) { var foo; }', Context.OptionsLexical],
    ['try {} catch (foo) { let foo; }', Context.OptionsLexical],
    ['try {} catch (foo) { try {} catch (_) { var foo; } }', Context.OptionsLexical],
    ['try {} catch ([foo]) { var foo; }', Context.OptionsLexical],
    ['try {} catch ({ foo }) { var foo; }', Context.OptionsLexical],
    ['try { throw {}; } catch ({ f }) { if (true) function f() {  } }', Context.OptionsLexical],
    ['try {} catch ({ a: foo, b: { c: [foo] } }) {}', Context.OptionsLexical],
    ['try {} catch (foo) { function foo() {} }', Context.OptionsLexical],
    ['try {} catch (e) { for (var e;;) {} }', Context.OptionsLexical],
    ['try {} catch (e) { for (var e in y) {} }', Context.OptionsLexical],
    ['try { } catch ([x, x]) {}', Context.Strict | Context.OptionsLexical],
    ['try {} catch (foo) { var foo; }', Context.OptionsLexical],
    ['try {} catch (foo) { let foo = 1; }', Context.OptionsLexical],
    ['try {} catch (foo) { let foo; }', Context.OptionsLexical],
    ['try {} catch (foo) { function foo() {} }', Context.OptionsLexical],
    ['try { } catch ([x, x]) {}', Context.Strict | Context.OptionsLexical],
    ['try { } catch (x) { for (var x of []) {} }', Context.OptionsLexical],
    ['try { } catch (x) { let x; }', Context.OptionsLexical],
    ['try {} catch(e) { let e; }', Context.OptionsLexical],
    ['try {} catch(e) { for(var e of 0); }', Context.OptionsLexical],
    ['try {} catch ({a: e, b: e}) {}', Context.OptionsLexical],
    ['try {} catch ({a: e, b: e}) {}', Context.OptionsLexical],
    ['try {} catch ({e = 0, a: e}) {}', Context.OptionsLexical],
    ['try {} catch ({e, e}) {}', Context.OptionsLexical],
    ['function f() { try {} catch (e) { function e(){} } }', Context.OptionsLexical],
    // ['try {} catch (e) { for (var e of y) {} }', Context.OptionsWebCompat | Context.OptionsLexical],
    ['try {} catch (e) { for (var e of y) {} }', Context.OptionsLexical],
    ['try {} catch (e) { let e = x; }', Context.OptionsWebCompat | Context.OptionsLexical],
    ['try {} catch (e) { const e = x; }', Context.OptionsWebCompat | Context.OptionsLexical],
    ['try {} catch (e) { var e = x; }', Context.OptionsLexical],
    ['try {} catch (e) { var e = x; }', Context.OptionsLexical],
    ['let foo; try {} catch (foo) {} let foo;', Context.OptionsLexical],
    ['try {} catch (foo) { function foo() {} }', Context.OptionsLexical],
    ['try {} catch (foo) {if (1) function foo() {}}', Context.OptionsLexical],
    ['try {} catch (foo) { let foo; }', Context.OptionsLexical],
    ['try {} catch (e) { let e = x; }', Context.OptionsLexical],
    ['try {} catch (e) { const e = x; }', Context.OptionsLexical],
    ['try {} catch (e) { for (var e;;) {} }', Context.OptionsLexical],
    ['try {} catch (e) { for (var e in y) {} }', Context.OptionsLexical],
    ['try {} catch ({ a: foo, b: { c: [foo] } }) {}', Context.OptionsLexical],
    ['try {} catch ([foo]) { var foo; }', Context.OptionsLexical],
    ['try {} catch ({ foo }) { var foo; }', Context.OptionsLexical],
    ['try {} catch (foo) { let foo; }', Context.OptionsLexical],
    ['try {} catch ([foo, foo]) {}', Context.OptionsLexical],
    ['try {} catch ([foo, foo]) {}', Context.OptionsWebCompat | Context.OptionsLexical]
  ]);

  for (const arg of [
    'try {} catch ([a,b,c]) { }',
    'try {} catch (e) { { let e = x; } }',
    'try {} catch(e) { try {} catch (e) {} }',
    'try {} catch (foo) {} var foo;',
    'try {} catch (foo) {} let foo;',
    'try {} catch (foo) { { let foo; } }',
    'try {} catch (foo) { function x() { var foo; } }',
    'try {} catch (foo) { function x(foo) {} }',
    'try {} catch(x) { x = 0; }',
    'try {} catch(x) { with ({}) { x = 1; } }',
    'try {} catch (foo) {} var foo;',
    'try { } catch (a) { { const a = b; } }',
    'var foo; try {} catch (_) { const foo = 1; }',
    'try {} catch (foo) { { let foo; } }',
    'var foo; try {} catch (_) { let foo; }',
    'try {} catch (e) { { let e = x; } }',
    'try {} catch (foo) {} let foo;',
    'try {} catch (e) { let b = x; }',
    'try {} catch (e) { for (const e in y) {} }',
    'try {} catch (e) { for (let e of y) {} }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    'try {} catch (e) { var e = x; }',
    'try {} catch (e) { for (var e;;) {} }',
    'try {} catch (e) { for (var e in y) {} }',
    'try {} catch (e) { for (let e;;) {} }',
    'try {} catch (e) { for (const e = y;;) {} }',
    'try {} catch (e) { for (let e in y) {} }',
    'try {} catch (e) { for (const e in y) {} }',
    'try {} catch (e) { for (let e of y) {} }',
    'try {} catch (e) { for (const e of y) {} }',
    'try {} catch(e) { try {} catch (e) {} }',
    'try { f; } catch (exception) { err1 = exception; } switch (1) { case 1: function f() {  } } try { f; } catch (exception) { err2 = exception; }',
    'try { throw {}; } catch ({ f }) {  if (false) ; else function f() {  }  }',
    'try { throw {}; } catch ({ f }) { if (true) function f() {  } else function _f() {} }',
    'try {} catch (foo) {} var foo;',
    'try {} catch (foo) {} let foo;',
    'try {} catch (foo) { { let foo; } }',
    'try {} catch (foo) { function x() { var foo; } }',
    'try {} catch (foo) { function x(foo) {} }',
    'try {} catch (foo) { var foo = 1; }',
    'try {} catch (e) { for (var e of y) {} }',
    'try {try { let e; } catch { let e; } finally { let e; }} catch (e) { }',
    'try {} catch (e) { var e = x; }',
    'try {} catch(e) { var e; }',
    'try { throw 0; } catch(e) { { function e(){} } }',
    'try {} catch (foo) {if (1) function foo() {}}',
    'try {} catch (foo) {}  let foo;',
    'try { } catch (foo) { try { } catch (_) { var foo; } }',
    'try {} catch (foo) {} var foo;',
    'try {} catch (foo) { var foo; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }
});
