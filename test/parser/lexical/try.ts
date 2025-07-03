import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Lexical - Try', () => {
  for (const declaration of ['var e', 'var f, e', 'let {} = 0', 'let {e:f} = 0', '{ function e(){} }']) {
    it(`try { throw 0; } catch(e) { ${declaration} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`try { throw 0; } catch(e) { ${declaration} }`, { webcompat: true, lexical: true });
      });
    });
  }

  for (const declaration of [
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
    'function* e(){}',
  ]) {
    it(`try { throw 0; } catch(e) { ${declaration} } `, () => {
      t.throws(() => {
        parseSource(`try { throw 0; } catch(e) { ${declaration} } `, { lexical: true });
      });
    });

    it(`try { throw 0; } catch({e}) { ${declaration} }`, () => {
      t.throws(() => {
        parseSource(`try { throw 0; } catch({e}) { ${declaration} }`, { lexical: true });
      });
    });

    it(`try { throw 0; } catch(e) { ${declaration} }`, () => {
      t.throws(() => {
        parseSource(`try { throw 0; } catch(e) { ${declaration} }`, { lexical: true });
      });
    });

    it(`try { throw 0; } catch(e) { (()=>{${declaration}})(); }`, () => {
      t.doesNotThrow(() => {
        parseSource(`try { throw 0; } catch(e) { (()=>{${declaration}})(); }`, { lexical: true });
      });
    });

    it(`try { throw 0; } catch(e) { (function(){${declaration}})(); }`, () => {
      t.doesNotThrow(() => {
        parseSource(`try { throw 0; } catch(e) { (function(){${declaration}})(); }`, { lexical: true });
      });
    });
  }

  fail('Lexical - Try (fail)', [
    { code: 'try {} catch (arguments) { }', options: { impliedStrict: true, lexical: true } },
    {
      code: 'try { throw "try"; } catch (x) { for (var x = y; x !== y; x++) {}}',
      options: { impliedStrict: true, lexical: true },
    },
    { code: 'try {} catch (arguments) { }', options: { impliedStrict: true } },
    { code: 'try {} catch (e) { for (var e in y) {} }', options: { lexical: true } },
    { code: 'try {} catch (e) { for (var e;;) {} }', options: { lexical: true } },
    { code: 'try {} catch (e) { var e = x; }', options: { lexical: true } },
    { code: 'try {} catch(e) { var e; }', options: { lexical: true } },
    { code: 'try { } catch (x) { for (var x of []) {} }', options: { impliedStrict: true, lexical: true } },
    { code: 'try { } catch (x) { let x; }', options: { impliedStrict: true, lexical: true } },
    { code: 'function f() { try {} catch (e) { function e(){} } }', options: { impliedStrict: true, lexical: true } },
    { code: 'try {} catch (a, a) { }', options: { lexical: true } },
    { code: 'try {} catch ([a,a]) { }', options: { lexical: true } },
    { code: 'try {} catch ([a] = b) { }', options: { lexical: true } },
    { code: 'try {} catch (a) { const a = 1; } ', options: { lexical: true } },
    { code: 'try { } catch (x) { for (var x of []) {} }', options: { lexical: true } },
    { code: 'try { } catch (x) { let x; }', options: { lexical: true } },
    { code: 'try { } catch (e) { async function f(){} async function f(){} }', options: { lexical: true } },
    { code: 'try {} catch (foo) { var foo; }', options: { lexical: true } },
    { code: 'try {} catch (foo) { let foo; }', options: { lexical: true } },
    { code: 'try {} catch (foo) { try {} catch (_) { var foo; } }', options: { lexical: true } },
    { code: 'try {} catch ([foo]) { var foo; }', options: { lexical: true } },
    { code: 'try {} catch ({ foo }) { var foo; }', options: { lexical: true } },
    { code: 'try { throw {}; } catch ({ f }) { if (true) function f() {  } }', options: { lexical: true } },
    { code: 'try {} catch ({ a: foo, b: { c: [foo] } }) {}', options: { lexical: true } },
    { code: 'try {} catch (foo) { function foo() {} }', options: { lexical: true } },
    { code: 'try {} catch (e) { for (var e;;) {} }', options: { lexical: true } },
    { code: 'try {} catch (e) { for (var e in y) {} }', options: { lexical: true } },
    { code: 'try { } catch ([x, x]) {}', options: { impliedStrict: true, lexical: true } },
    { code: 'try {} catch (foo) { var foo; }', options: { lexical: true } },
    { code: 'try {} catch (foo) { let foo = 1; }', options: { lexical: true } },
    { code: 'try {} catch (foo) { let foo; }', options: { lexical: true } },
    { code: 'try {} catch (foo) { function foo() {} }', options: { lexical: true } },
    { code: 'try { } catch ([x, x]) {}', options: { impliedStrict: true, lexical: true } },
    { code: 'try { } catch (x) { for (var x of []) {} }', options: { lexical: true } },
    { code: 'try { } catch (x) { let x; }', options: { lexical: true } },
    { code: 'try {} catch(e) { let e; }', options: { lexical: true } },
    { code: 'try {} catch(e) { for(var e of 0); }', options: { lexical: true } },
    { code: 'try {} catch ({a: e, b: e}) {}', options: { lexical: true } },
    { code: 'try {} catch ({a: e, b: e}) {}', options: { lexical: true } },
    { code: 'try {} catch ({e = 0, a: e}) {}', options: { lexical: true } },
    { code: 'try {} catch ({e, e}) {}', options: { lexical: true } },
    { code: 'function f() { try {} catch (e) { function e(){} } }', options: { lexical: true } },
    { code: 'try {} catch (e) { for (var e of y) {} }', options: { lexical: true } },
    { code: 'try {} catch (e) { let e = x; }', options: { webcompat: true, lexical: true } },
    { code: 'try {} catch (e) { const e = x; }', options: { webcompat: true, lexical: true } },
    { code: 'try {} catch (e) { var e = x; }', options: { lexical: true } },
    { code: 'try {} catch (e) { var e = x; }', options: { lexical: true } },
    { code: 'let foo; try {} catch (foo) {} let foo;', options: { lexical: true } },
    { code: 'try {} catch (foo) { function foo() {} }', options: { lexical: true } },
    { code: 'try {} catch (foo) {if (1) function foo() {}}', options: { lexical: true } },
    { code: 'try {} catch (foo) { let foo; }', options: { lexical: true } },
    { code: 'try {} catch (e) { let e = x; }', options: { lexical: true } },
    { code: 'try {} catch (e) { const e = x; }', options: { lexical: true } },
    { code: 'try {} catch (e) { for (var e;;) {} }', options: { lexical: true } },
    { code: 'try {} catch (e) { for (var e in y) {} }', options: { lexical: true } },
    { code: 'try {} catch ({ a: foo, b: { c: [foo] } }) {}', options: { lexical: true } },
    { code: 'try {} catch ([foo]) { var foo; }', options: { lexical: true } },
    { code: 'try {} catch ({ foo }) { var foo; }', options: { lexical: true } },
    { code: 'try {} catch (foo) { let foo; }', options: { lexical: true } },
    { code: 'try { async function *f(){} var f } catch (e) {}', options: { lexical: true } },
    { code: 'try { function f(){} var f } catch (e) {}', options: { lexical: true } },
    { code: 'try {} catch ([foo, foo]) {}', options: { lexical: true } },
    { code: 'try {} catch ([foo, foo]) {}', options: { webcompat: true, lexical: true } },
    { code: 'try { } catch (e) { function f(){} function f(){} }', options: { lexical: true } },
    { code: 'try { } catch (e) { function *f(){} function *f(){} }', options: { lexical: true } },
    { code: 'try { } catch (e) { function *f(){} function *f(){} }', options: { webcompat: true, lexical: true } },
    { code: 'try { function *f(){} var f } catch (e) {}', options: { lexical: true } },
    { code: 'try { function(){} var f } catch (e) {}', options: { lexical: true } },
    { code: 'try { async function f(){} var f } catch (e) {}', options: { lexical: true } },
    { code: 'try {} catch (e) { let e = x; }', options: { lexical: true } },
    { code: 'try { } catch (e) { function(){} function(){} }', options: { lexical: true } },
    { code: 'try { } catch (e) { function(){} function(){} }', options: { lexical: true } },
    { code: 'try { } finally { function(){} function(){} }', options: { lexical: true } },
    { code: 'try {} catch (e) { var e = x; }', options: { lexical: true } },
    { code: 'try { } finally { function *f(){} function *f(){} }', options: { lexical: true } },
    { code: 'try {} catch (e) { { var e = x; } }', options: { lexical: true } },
    { code: 'const a = 1, a = 2', options: { lexical: true } },
    { code: 'try { } finally { function f(){} function f(){} }', options: { lexical: true } },
    { code: 'try { } finally { async function *f(){} async function *f(){} }', options: { lexical: true } },
    { code: 'try { } finally { async function f(){} async function f(){} }', options: { lexical: true } },
    { code: 'try {} catch (x) { { let x } ', options: { lexical: true } },
    { code: 'try {} catch (x) { let x }', options: { lexical: true } },
    { code: 'let e; try {} catch (e) { let e; }', options: { lexical: true } },
    { code: 'try {} catch (x) { { let x } ', options: { webcompat: true, lexical: true } },
    { code: 'try {} catch (x) { let x }', options: { webcompat: true, lexical: true } },
    {
      code: outdent`
        try {} catch (foo) {}  let foo;
        try {} catch (foo) {}  let foo;
      `,
      options: { lexical: true },
    },
  ]);

  for (const arg of [
    'try {} catch ([a,b,c]) { }',
    'try {} catch (e) { { let e = x; } }',
    'try {} catch(e) { try {} catch (e) {} }',
    'try {} catch (foo) {} var foo;',
    'try {} catch (foo) {} let foo;',
    'try {} catch (foo) { { let foo; } }',
    outdent`
      try {} catch (foo) { { let foo; } }
      try {} catch (foo) { { let foo; } }
    `,
    'try {} catch (foo) { function x() { var foo; } }',
    'try {} catch (foo) { function x(foo) {} }',
    'try {} catch(x) { x = 0; }',
    'try {} catch(x) { with ({}) { x = 1; } }',
    outdent`
      try {} catch(x) { with ({}) { x = 1; } }
      try {} catch(x) { with ({}) { x = 1; } }
    `,
    'try {} catch (foo) {} var foo;',
    'try { } catch (a) { { const a = b; } }',
    'var foo; try {} catch (_) { const foo = 1; }',
    'try {} catch (foo) { { let foo; } }',
    outdent`
      try {} catch (foo) { { let foo; } }
      try {} catch (foo) { { let foo; } }
    `,
    'var foo; try {} catch (_) { let foo; }',
    'try {} catch (e) { { let e = x; } }',
    'try {} catch (foo) {} let foo;',
    'try {} catch (e) { let b = x; }',
    'try {} catch (e) { for (const e in y) {} }',
    'try {} catch (e) { for (let e of y) {} }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, lexical: true });
      });
    });
  }

  for (const arg of [
    'try {} catch (e) { var e = x; }',
    'try {} catch (e) { for (var e;;) {} }',
    'try {} catch (e) { for (var e in y) {} }',
    'try {} catch (x) { { var x } }',
    'try {} catch (e) { for (let e;;) {} }',
    outdent`
      try {} catch (e) { for (let e;;) {} }
      try {} catch (e) { for (let e;;) {} }
    `,
    outdent`
      try {} catch (e) { for (const e = y;;) {} }
      try {} catch (e) { for (const e = y;;) {} }
    `,
    'try {} catch (e) { for (const e = y;;) {} }',
    'try {} catch (e) { for (let e in y) {} }',
    'try {} catch (e) { for (const e in y) {} }',
    'try {} catch (e) { for (let e of y) {} }',
    'try {} catch (e) { for (const e of y) {} }',
    'try {} catch(e) { try {} catch (e) {} }',
    'try { f; } catch (exception) { err1 = exception; } switch (1) { case 1: function f() {  } } try { f; } catch (exception) { err2 = exception; }',
    'try { throw {}; } catch ({ f }) {  if (false) ; else function f() {  }  }',
    'try { throw {}; } catch ({ f }) { if (true) function f() {  } else function _f() {} }',
    outdent`
      try { throw {}; } catch ({ f }) { if (true) function f() {  } else function _f() {} }
      try { throw {}; } catch ({ f }) { if (true) function f() {  } else function _f() {} }
    `,
    'try {} catch (foo) {} var foo;',
    'try {} catch (foo) {} let foo;',
    'try {} catch (foo) { { let foo; } }',
    'try {} catch (foo) { function x() { var foo; } }',
    'try {} catch (foo) { function x(foo) {} }',
    'try {} catch (foo) { var foo = 1; }',
    'try {} catch (e) { for (var e of y) {} }',
    'try {try { let e; } catch { let e; } finally { let e; }} catch (e) { }',
    'try {} catch (e) { var e = x; }',
    outdent`
      try {} catch (e) { var e = x; }
      try {} catch (e) { var e = x; }
    `,
    'try {} catch(e) { var e; }',
    'try { } finally { function f(){} function f(){} }',
    'try { throw 0; } catch(e) { { function e(){} } }',
    'try {} catch (e) { for (let e = 1;;) {} }',
    'try {} catch (e) { for (var e = 1;;) {} }',
    'try {} catch (e) { for (const e of y) {} }',
    'try {} catch (e) { for (let e of y) {} }',
    'try {} catch (e) { { var e = x; } }',
    'try {} catch (foo) {if (1) function foo() {}}',
    'try {} catch (foo) {}  let foo;',
    'try { } catch (foo) { try { } catch (_) { var foo; } }',
    'try {} catch (foo) {} var foo;',
    'try { } catch (e) { function f(){} function f(){} }',
    'try {} catch (foo) { var foo; }',
    'try {} catch (e) { for (var e of y) {} }',
    'try { throw "try"; } catch (x) { for (var x = y; x !== y; x++) {}}',
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
