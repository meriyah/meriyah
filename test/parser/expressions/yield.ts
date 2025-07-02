import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Expressions - Yield', () => {
  for (const arg of [
    'let foo = function*() { try {yield 42} finally {yield 43; return 13} };',
    'let foo = function*() { try {yield 42} finally {yield 43; 13} };',
    'let foo = function*() { try {yield 42} finally {yield 43; return 13} };',
    'let foo = function*() { yield 1; yield yield* h(); };',
    'let foo = function*() { try {yield 42} finally {yield 43; 13} };',
    '{ function* inner() { yield 2; } function* g() { yield 1; return yield* inner(); } { let x = g(); } }',
    'function* foo() { (yield* (c = d) => { })  }',
    'function *foo() { do try {} catch (q) {} while ((yield* 810048018773152)); }',
    'function *foo() {  do try {} catch (q) {} while ((yield* 810048018773152));  (x) => {} }',
    'function *foo() {  do try {} catch (q) {} while ((yield* 810048018773152));  (x = y) => {} }',
    'function *foo() { do try {} catch (q) {} while ((yield* 810048018773152)); }',
    'function *foo() {  do try {} catch (q) {} while ((yield* 810048018773152));  async (x) => {} }',
    'function *foo() {  do try {} catch (q) {} while ((yield* 810048018773152)); async  (x = y) => {} }',
    'function* foo() { class x extends (yield* (e = "x") => {}) {} }',
    'function* foo() {  return ( yield* ( ( j ) => {}) ) }',
    outdent`
      ({get a(){}});
      yield;
    `,
    'function* foo() {  return ( yield* ( async ( j ) => {}) ) }',
    'function* foo() { switch ( y (yield) - ((a) => {})) { } }',
    'function* foo() { switch ( y (yield) - (async (a) => {})) { } }',
    'function* foo() { a(yield* function t(k) {}, ...(c) => {}) }',
    'function* foo() { yield 2; yield 3; yield 4 }',
    'function* foo() { yield 2; if (true) { yield 3 }; yield 4 }',
    'function* foo() { yield 2; if (true) { yield 3; yield 4 } }',
    'function* foo() { yield 2; if (false) { yield 3 }; yield 4 }',
    'countArgs(...(function*(){ yield 1; yield 2; yield 3; })())',
    'function* foo(l) { "use strict"; yield 1; for (let x in l) { yield x; } }',
    'function* foo() { var x = 10; yield 1; return x; }',
    'function* foo(a, b, c) { yield 1; return [a, b, c]; }',
    '({} = ({x} = (function* y(z) { (yield) }))) => (p);',
    '({} = ([x] = (function* y(z) { (yield) }))) => (p);',
    '([] = ({x} = (function* y(z) { (yield) }))) => (p);',
    '({} = ({x} = (function* y(z) { async (yield) }))) => (p);',
    '({} = ([x] = (function* y(z) { async (yield) }))) => (p);',
    '([] = ({x} = (function* y(z) { async (yield) }))) => (p);',
    '(a = ({x} = (function* y(z) { async (yield) }))) => (p);',
    '(a = ({x} = (function* y(z) { async (yield) }))) => (await);',
    '(a = ({x} = (function* y(z) { async (yield) }))) => (async);',
    '(a = ({async} = (function* y(z) { async (yield) }))) => (p);',
    '(x = (function* () { (yield) }), {[x]: a} ) => 7',
    '(a = ({x} = (function* y(z) { async (yield) }))) => (p);',
    '(x = (function* () { async (yield) }), {[x]: a} ) => 7',
    'function* foo() { return {["a"]: yield} }',
    'bar(...(function*(){ yield 1; yield 2; yield 3; })());',
    '(function*() { yield* {} })().next()',
    '(function*() { yield* undefined })().next()',
    'function* foo() { yield; }',
    outdent`
      {
        let x = 42;
        function* foo() {
          yield x;
          for (let x in {a: 1, b: 2}) {
            let i = 2;
            yield x;
            yield i;
            do {
              yield i;
            } while (i-- > 0);
          }
          yield x;
          return 5;
        }
        g = foo();
      }
    `,
    outdent`
      {
        let a = 3;
        function* foo() {
          let b = 4;
          yield 1;
          { let c = 5; yield 2; yield a; yield b; yield c; }
        }
        g = foo();
      }
    `,
    outdent`
      function YieldStar() {
        let tree = new Node(1,
            new Node(2,
                new Node(3,
                    new Node(4,
                        new Node(16,
                            new Node(5,
                                new Node(23,
                                    new Node(0),
                                    new Node(17)),
                                new Node(44, new Node(20)))),
                        new Node(7,
                            undefined,
                            new Node(23,
                                new Node(0),
                                new Node(41, undefined, new Node(11))))),
                    new Node(8)),
                new Node(5)),
            new Node(6, undefined, new Node(7)));
        let labels = [...(infix(tree))];
        // 0,23,17,5,20,44,16,4,7,0,23,41,11,3,8,2,5,1,6,7
        if (labels[0] != 0) throw "wrong";
      }
    `,
    outdent`
      function get() {}
      function* getData() {
        return yield get();
      }
    `,
    outdent`
      const f = async function * (source, block, opts) {
        for await (const entry of source) {
          yield async function () {
            const cid = await persist(entry.content.serialize(), block, opts)

            return {
              cid,
              path: entry.path,
              unixfs: UnixFS.unmarshal(entry.content.Data),
              node: entry.content
            }
          }
        }
      }
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true });
      });
    });
  }

  for (const arg of [
    'var yield;',
    'var foo, yield;',
    'try { } catch (yield) { }',
    'function yield() { }',
    'function * yield() { }',
    '(function * yield() { })',
    'yield = 1;',
    'var foo = yield = 1;',
    '++yield;',
    'yield *',
    '(yield *)',
    'yield++;',
    'yield: 34;',
    'yield 3 + yield 4;',
    'yield: 34',
    'yield ? 1 : 2',
    'yield / yield',
    '+ yield',
    '+ yield 3',
    'yield\n{yield: 42}',
    'yield /* comment */\n {yield: 42}',
    'yield //comment\n {yield: 42}',
    'var [yield] = [42];',
    'var {foo: yield} = {a: 42};',
    '[yield] = [42];',
    '({a: yield} = {a: 42});',
    'var [yield 24] = [42];',
    'var {foo: yield 24} = {a: 42};',
    '[yield 24] = [42];',
    '({a: yield 24} = {a: 42});',
    "for (yield 'x' in {});",
    "for (yield 'x' of {});",
    "for (yield 'x' in {} in {});",
    "for (yield 'x' in {} of {});",
    'class C extends yield { }',
  ]) {
    it(`function *g() { ${arg}}`, () => {
      t.throws(() => {
        parseSource(`function *g() { ${arg}}`);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`, { webcompat: true });
      });
    });

    it(`"use strict"; function foo() { ${arg}}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; function foo() { ${arg}}`);
      });
    });

    it(`function foo() { "use strict"; ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function foo() { "use strict"; ${arg} }`);
      });
    });

    it(`"use strict"; (function foo() {${arg}})`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (function foo() {${arg}})`);
      });
    });

    it(`"use strict"; (function * gen() { function foo() { ${arg}} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (function * gen() { function foo() { ${arg}} }`);
      });
    });

    it(`"use strict"; (function * gen() { (function foo() { ${arg}}) })`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (function * gen() { (function foo() { ${arg}}) })`);
      });
    });
  }

  const yieldInParameters = [
    '(a = yield) => {}',
    '(a = yield /a/g) => {}', // Should parse as division, not yield expression with regexp.
    'yield => {};',
    '(yield) => {};',
    '(yield = 0) => {};',
    '([yield]) => {};',
    '([yield = 0]) => {};',
    '([...yield]) => {};',
    '({a: yield}) => {};',
    '({yield}) => {};',
    '({yield = 0}) => {};',
    'async (yield) => {};',
    'async (yield = 0) => {};',
    'async ([yield]) => {};',
    'async ([yield = 0]) => {};',
    'async ([...yield]) => {};',
    'async ({a: yield}) => {};',
    'async ({yield}) => {};',
    'async ({yield = 0}) => {};',
  ];

  const yieldInBody = [
    '() => { var x = yield; }',
    '() => { var x = yield /a/g; }',
    '() => { var yield; };',
    '() => { var yield = 0; };',
    '() => { var [yield] = []; };',
    '() => { var [yield = 0] = []; };',
    '() => { var [...yield] = []; };',
    '() => { var {a: yield} = {}; };',
    '() => { var {yield} = {}; };',
    '() => { var {yield = 0} = {}; };',
    '() => { let yield; };',
    '() => { let yield = 0; };',
    '() => { let [yield] = []; };',
    '() => { let [yield = 0] = []; };',
    '() => { let [...yield] = []; };',
    '() => { let {a: yield} = {}; };',
    '() => { let {yield} = {}; };',
    '() => { let {yield = 0} = {}; };',
    '() => { const yield = 0; };',
    '() => { const [yield] = []; };',
    '() => { const [yield = 0] = []; };',
    '() => { const [...yield] = []; };',
    '() => { const {a: yield} = {}; };',
    '() => { const {yield} = {}; };',
    '() => { const {yield = 0} = {}; };',
  ];

  for (const test of [...yieldInParameters, ...yieldInBody]) {
    // Script context.
    it(`"use strict"; ${test}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${test}`);
      });
    });

    // Function context.
    it(`"use strict"; function f() { ${test} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; function f() { ${test} }`);
      });
    });

    // Function context.
    it(`"use strict"; function f() { ${test} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; function f() { ${test} }`, { next: true, webcompat: true });
      });
    });

    // Generator
    it(`"use strict"; function* g() { ${test} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; function* g() { ${test} }`);
      });
    });
  }
  // Generator context.
  for (const test of yieldInParameters) {
    it(`function* g() { ${test} }`, () => {
      t.throws(() => {
        parseSource(`function* g() { ${test} }`);
      });
    });
  }

  for (const arg of [
    // A generator without a body is valid.
    '',
    // Valid yield expressions inside generators.
    'yield 2;',
    'yield * 2;',
    'yield * \n 2;',
    'yield yield 1;',
    'yield * yield * 1;',
    'yield 3 + (yield 4);',
    'yield * 3 + (yield * 4);',
    '(yield * 3) + (yield * 4);',
    'yield 3; yield 4;',
    'yield * 3; yield * 4;',
    '(function (yield) { })',
    '(function yield() { })',
    'yield { yield: 12 }',
    'yield /* comment */ { yield: 12 }',
    'yield * \n { yield: 12 }',
    'yield /* comment */ * \n { yield: 12 }',
    // You can return in a generator.
    'yield 1; return',
    'yield * 1; return',
    'yield 1; return 37',
    'yield * 1; return 37',
    "yield 1; return 37; yield 'dead';",
    "yield * 1; return 37; yield * 'dead';",
    // Yield is still a valid key in object literals.
    '({ yield: 1 })',
    '({ get yield() { } })',
    // And in assignment pattern computed properties
    '({ [yield]: x } = { })',
    // Yield without RHS.
    'yield;',
    'yield',
    'yield\n',
    'yield /* comment */',
    'yield // comment\n',
    '(yield)',
    '[yield]',
    '{yield}',
    'yield, yield',
    'yield; yield',
    '(yield) ? yield : yield',
    '(yield) \n ? yield : yield',
    // If there is a newline before the next token, we don't look for RHS.
    'yield\nfor (;;) {}',
    'x = class extends (yield) {}',
    'x = class extends f(yield) {}',
    'x = class extends (null, yield) { }',
    'x = class extends (a ? null : yield) { }',
  ]) {
    it(`function *foo() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function *foo() {${arg}}`);
      });
    });
    it(`(function *foo() {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function *foo() {${arg}})`);
      });
    });
    it(`(function *() {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function *() {${arg}})`);
      });
    });
  }

  for (const arg of [
    'var yield;',
    'var foo, yield;',
    'try { } catch (yield) { }',
    'function yield() { }',
    '(function yield() { })',
    'function foo(yield) { }',
    'function foo(bar, yield) { }',
    'class C { *gf() { switch (1) { case yield: break; } } }',
    'yield = 1;',
    'var foo = yield = 1;',
    'yield * 2;',
    '++yield;',
    'yield++;',
    'yield: 34',
    'function yield(yield) { yield: yield (yield + yield(0)); }',
    '({ yield: 1 })',
    '({ get yield() { 1 } })',
    'yield(100)',
    'yield[100]',
  ]) {
    it(`function foo() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() {${arg}}`);
      });
    });

    it(`(function foo() {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function foo() {${arg}})`);
      });
    });

    it(`(() => {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(() => {${arg}})`);
      });
    });

    it(`(() => {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(() => {${arg}})`, { lexical: true });
      });
    });

    it(`(async () => {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(async () => {${arg}})`);
      });
    });
  }

  for (const arg of [
    'var yield;',
    'var foo, yield;',
    'try { } catch (yield) { }',
    'function yield() { }',
    '(function yield() { })',
    'function foo(yield) { }',
    'function foo(bar, yield) { }',
    'function* gf() { yield "foo"; }',
    "function* gf() { yield 'foo' }",
    "function* gf() { var a = yield 'foo'; }",
    "function* gf() { foo(yield 'foo'); }",
    "function* gf() { yield 'foo', 10; }",
    "class C { *gf() { switch (1) { case yield 'foo': break; } } }",
    "function* gf() { yield* 'foo'; }",
    "function* gf() { foo[yield* 'foo']; }",
    "function* gf() { yield* 'foo', 10; }",
    "function* gf() { switch (1) { case yield* 'foo': break; } }",
    "var gfe = function* rgfe() { switch (1) { case yield* 'foo': break; } }",
    "var o = { *gf() { yield* 'foo'; } }",
    "class C { *gf() { switch (1) { case yield* 'foo': break; } } }",
    'function* gf() { switch (1) { case yield: break; } }',
    'function* gf() { var a = yield; }',
    'function* gf() { foo[yield]; }',
    'function* gf() { yield, 10; }',
    'function *f(){ () => yield; }',
    'var o = { *gf() { switch (1) { case yield: break; } } }',
    'function * yield() { }',
    'function yield() {}',
    '(function yield() {});',
    'yield = 1;',
    'var foo = yield = 1;',
    'yield * 2;',
    '++yield;',
    'yield++;',
    'yield: 34',
    'function yield(yield) { yield: yield (yield + yield(0)); }',
    '({ yield: 1 })',
    '({ get yield() { 1 } })',
    'yield(100)',
    'yield[100]',
    outdent`
      function* f() {
      let result;
      while (1) {
        result = yield result;
      }
      }
    `,
    outdent`
      function* g() {
      yield arguments[0];
      yield arguments[1];
      yield arguments[2];
      yield arguments[3];
      }
    `,

    '(function * gen() { (function not_gen() { try { } catch (yield) { } }) })',
    'function *a(){yield 0}',
    '(function yield() { })',
    'function foo(yield) { }',
    'function foo(bar, yield) { }',
    'function * gen() { yield a; }',
    'function * gen() { yield * \n a; }',
    'function * gen() { yield yield a; }',
    'function * gen() { (yield * a) + (yield * b);; }',
    'function * gen() { yield * a; return }',
    'function * gen() { yield, yield }',
    'function * gen() { (yield) ? yield : yield }',
    'function * gen() { yield /* comment */ }',
    'function * gen() { (yield) \n ? yield : yield }',
    'x = class extends (a) {}',
    'function * gen() { (yield) }',
    'function *a(){yield null}',
    'function *a(){yield+0}',
    'function *a(){yield "a"}',
    'function *a(){yield delete 0}',
    'function *a(){yield typeof 0}',
    'function *a(){yield 2e308}',
    'function*a(){yield*a}',
    'function a(){yield*a}',
    'function *a(){({get b(){yield}})}',
    'function a(){({*[yield](){}})}',
    'function *a(){({*[yield](){}})}',
    'function *a(){({set b(yield){}})}',
    'function *a(){yield delete 0}',
    'function *a(){yield ++a;}',
    'function * gen() { yield * 2; }',
    'function * gen() { (yield * 3) + (yield * 4); }',
    'function * gen() { ({ yield: 1 }) }',
    '(function * () { x = class extends (yield) {} });',
    '(function * () { x = class extends (a ? null : yield) { } });',
    '(function * () { yield * 1; return 37; yield * "string"; });',
    '(function * () { ({ [yield]: x } = { }) });',
    'function* g(){ x ? yield : y }',
    // YieldExpression is legal in class expression heritage
    'function* g(){(class extends (yield) {});}',
    // YieldExpression is legal in class expression body
    'function* a(){(class {[yield](){}})};',
    'function *g() { yield ~x }',
    'function *g() { yield class x {} }',
    'function *g() { yield --x }',
    'function *g() { yield !x }',
    'function *g() { yield void x }',

    '"use strict"; ({ yield() {} })',
    'function *g() { yield yield }',
    'function* g() {  yield* [1, 2, 3]; }',
    'function* g() { exprValue = yield * {}; }',
    'function* g() { yield* "abc"; }',
    outdent`
      function* g() {
      try {
      yield * {};
      } catch (err) {
      caught = err;
      }
      }
    `,
    'function* g1() { (yield 1) }',
    'function* g2() { [yield 1] }',
    'function* g3() { {yield 1} }',
    'function* g4() { yield 1, yield 2; }',
    'function* g5() { (yield 1) ? yield 2 : yield 3; }',
    outdent`
      function* g(a, b, c, d) {
      arguments[0] = 32;
      arguments[1] = 54;
      arguments[2] = 333;
      yield a;
      yield b;
      yield c;
      yield d;
      }
    `,
    'function* gf() { var fe = function yield() { } }',
    'function* gf() { var o = { yield: 10 } }',
    'function* gf() { var o = { *yield() { } } }',
    'function* gf() { class C { *yield() { } } }',
    // 'yield' can be used as a BindingIdentifier for declarations in non-strict, non-generator bodies
    'function f() { var yield; }',
    'function f() { let yield; }',
    'function f() { const yield = 10; }',
    'function f() { function* yield() { } }',
    'function f() { var o = { *yield() { } } }',
    'function f() { var yield = 10; var o = { yield }; }',
    'function f() { class C { yield() { } } }',
    'function f() { class C { *yield() { } } }',
  ]) {
    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function not_gen() { ${arg}}`);
      });
    });

    it(`function * gen() { function not_gen() { ${arg} }}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function * gen() { function not_gen() { ${arg} }}`);
      });
    });

    it(`(function foo() { ${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function foo() { ${arg}})`);
      });
    });

    it(`(function * gen() { function not_gen() { ${arg} }})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function * gen() { function not_gen() { ${arg} }})`);
      });
    });
  }

  fail('Expressions - Yield (fail)', [
    '(a = yield 3) {}',
    '(a=yield) {}',
    '(yield 3) {}',
    '(yield = 1) {}',
    { code: '({yield} = x)', options: { impliedStrict: true } },
    'var obj = { *gf(b, a = yield) {} }',
    'function* gf() { yield++; }',
    'function* gf() { (yield) = 10; }',
    'function* gf() { (yield)++; }',
    'function *gf(){ function yield(){}; }',
    'function *gf({yield}){}',
    'function*g([yield]){}',
    'function*g(yield = 0){}',
    'function *f(x=yield){ }',
    'function *f(yield){ }',
    { code: '({x} = yield) => {}', options: { impliedStrict: true } },
    'function *f(){ ({x} = yield x) => {} }',
    'function *f(){ ([x] = yield x) => {} }',
    'function *g(a, b, c, ...yield){}',
    '(function *(x, ...yield){})',
    'function *a(){yield\n*a}',
    'function* gf() { var yield; }',
    'function* gf() { let yield; }',
    'function* gf() { +yield; }',
    'function* gf() { +yield 2; }',
    'yield x',
    'yield x + y',
    '5 + yield x',
    'function *a(){({yield} = {})}',
    'function *a(){yield*}',
    'function* gf() { 1 + yield; }',
    'function* gf() { 1 + yield 2; }',
    'function* gf() { 1 + yield* "foo"; }',
    'function* gf() { +yield; }',
    'function* gf() { yield++; }',
    'let gfe = function* yield() { }',
    'function* gf() { let yield; ',
    'function* gf() { const yield = 10; }',
    'function* gf() { function* yield() { } }',
    'function* gf() { var gfe = function* yield() { } }',
    'function* gf() { class yield { } }',
    'function* gf() { var o = { yield }; }',
    '"function *gf(b, a = 1 + yield) {',
    'gf = function* (b, a = yield) {}',
    'function* gf() { var a = (x, y = yield* 0, z = 0) => { }; }',
    'function* gf() { var a = (x, y, z = yield* 0) => { }; }',
    'function* gf() {var a = yield in {};}',
    'function* gf() {yield in {};}',
    '5 + yield x + y',
    'call(yield x)',
    'call(yield x + y)',
    'function* f(){ 5 + yield }',
    'function* f(){ 5 + yield x; }',
    'function* f(){ 5 + yield x + y; }',
    'function f(){ yield x; }',
    'function f(){ yield x + y; }',
    'function f(){ call(yield x + y); }',
    'function f(){ 5 + yield x + y; }',
    'function f(){ call(yield x); }',
    'function* g() { yield 3 + yield; }',
    'function* g() { yield 3 + yield 4; }',
    'async function f(){ yield a,b; }',
    'function *f(){ return function(x = yield y){}; }',
    'function *g() { yield = {}; }',
    'label: function* a(){}',
    'function*g(yield){}',
    'function*g({yield}){}',
    'function*g([yield]){}',
    'function*g({a: yield}){}',
    'function*g(yield = 0){}',
    'function*g(){ var yield; }',
    'function*g(){ var yield = 1; }',
    'function*g(){ function yield(){}; }',
    'function*g() { var yield; }',
    'function*g() { let yield; }',
    'function*g() { try {} catch (yield) {} }',
    'function*g() { ({yield}); }',
    'function*g() { ({yield} = 0); }',
    'function*g() { var {yield} = 0; }',
    'function*g() { for ({yield} in 0); }',
    'function*g() { for ({yield} in [{}]); }',
    'function*g() { for ({yield} of [{}]); }',
    'function*g() { ({yield = 0}); }',
    'function*g() { 0, {yield} = {}; }',
    { code: 'function*g() { for ({yield} of [{}]); }', options: { webcompat: true } },
    { code: 'function*g() { ({yield = 0}); }', options: { webcompat: true } },
    { code: 'function*g() { 0, {yield} = {}; }', options: { webcompat: true } },
    'function*g() { ({yield = 0} = 0); }',
    'function*g() { var {yield = 0} = 0; }',
    'function*g() { for ({yield = 0} in 0); }',
    'function *g() { (x = yield) = {}; }',
    'function *g() { yield => {}; }',
    'function *g() { (x = yield) => {}; }',
    'function *g() { (x = y = yield z) => {}; }',
    'function *g() { (x = y + yield z) => {}; }',
    'function *g() { (x = y + yield); }',
    'function *g() { (x = y + yield y); }',
    'function *g() { (x = y + yield) => x; }',
    'function *g() { (x = y + yield y) => x; }',
    'function *g(){ (x = {[yield y]: 1}) => z }',
    'function *g(){ (x = {[yield]: 1}) => z }',
    '("string" = ({x} = (function* y(z) { (yield) }))) => (p);',
    '(x = x) = x;',
    '{ (x = yield) = {}; }',
    '{ (x = y = yield z) => {}; }',
    '{ (x = y = yield z); }',
    '{ (x = y + yield z) => {}; }',
    '{ (x = y + yield y); }',
    '{ (x = y + yield y) => x; }',
    '{ (x = y + foo(a, yield y)); }',
    '{ (x = y + foo(a, yield y)) => x; }',
    '{ (x = {[yield y]: 1}) }',
    '{ (x = {[yield y]: 1}) => z }',
    '{ (x = [yield y]) }',
    '{ (x = [yield y]) => z }',
    'function *g() { async yield = {}; }',
    'function *g() { async (x = yield) = {}; }',
    'function *g() { async yield => {}; }',
    'function *g() { async (x = yield) => {}; }',
    'function *g() { async (x = y = yield z) => {}; }',
    'function *g() { async (x = y + yield y); }',
    'function *g() { async (x = y + yield z) => {}; }',
    'function *g() { async (x = y + yield); }',
    'function *g() { async (x = y + yield) => x; }',
    'function *g() { async (x = y + yield y) => x; }',
    'function *g() { async (x = y + foo(a, yield y)) => x; }',
    'function *g(){ async (x = {[yield]: 1}) => z }',
    'function *g(){ async (x = {[yield y]: 1}) => z }',
    'function *g(){ async (x = [yield]) => z }',
    'function *g(){ async (x = [yield y]) => z }',
    'function *f(yield){}',
    'async (yield x)',
    'async (x = yield y)',
    'function *f(){ async (x = yield) => {} }',
    'function *f(){ async (x = yield y) => {} }',
    'function* foo() { class x extends (async yield* (e = "x") => {}) {} }',
    'function *f(){ async (x = (yield)) => {} }',
    'function *f(){ async (x = (yield y)) => {} }',
    'function *f(){ async (x = z = yield) => {} }',
    'function *f(){ async (x = z = yield y) => {} }',
    'function *g() { (x = u + yield z) => {}; }',
    'function *g() { function f(x = y = yield z) {}; }',
    'function *g() { function f(x = x + yield y) {}; }',
    'function *g() { function f(x = x + foo(a, yield y)) {}; }',
    'function *f(){  return function(x=yield y) {};  }',
    'function *f(){  class x{constructor(a=yield x){}}  }',
    'function *f(){  class x{foo(a=yield x){}}  }',
    'function *f(){  x = {foo(a=yield x){}}  }',
    'function *f(){  return *(x=yield y) => x;  }',
    'function *f(){ yield = 1; }',
    { code: '(yield) = 1;', options: { impliedStrict: true } },
    'function *f(){ (yield) = 1; }',
    'function *f(x = (yield) = f) {}',
    { code: '(x = delete ((yield) = f)) => {}', options: { impliedStrict: true } },
    'function *f(x = delete ((yield) = f)) {}',
    'function *f(){  return *(x=yield y) => x;  }',
    'function *f(){  return function*(x=yield y) {};  }',
    'function *f(){  class x{*foo(a=yield x){}}  }',
    'function *f(){  x = {*foo(a=yield x){}}  }',
    'function f(){  return *(x=yield y) => x;  }',
    'function f(){  return function*(x=yield y) {};  }',
    'function f(){  class x{*foo(a=yield x){}}  }',
    'function f(){  x = {*foo(a=yield x){}}  }',
    'function f(){  return (x=yield y) => x;  }',
    'function f(){  return function(x=yield y) {};  }',
    'function f(){  class x{foo(a=yield x){}}  }',
    'function f(){  x = {foo(a=yield x){}}  }',
    'function *f(){  return (x=yield) => x;  }',
    'function *f(){  class x{constructor(a=yield){}}  }',
    'function *f(){  x = {foo(a=yield x){}}  }',
    'function *f(){  return *(x=yield) => x;  }',
    'function *f(){  return function*(x=yield) {};  }',
    'function *f(){  class x{*foo(a=yield){}}  }',
    'function *f(){  x = {*foo(a=yield){}}  }',
    'function f(){  return *(x=yield) => x;  }',
    'function f(){  return function*(x=yield) {};  }',
    'function f(){  class x{*foo(a=yield){}}  }',
    'function f(){  x = {*foo(a=yield){}}  }',
    'function f(){  class x{foo(a=yield){}}  }',
    'function *f(){  class x extends yield y{}  }',
    'function *f() {  return delete yield;  }',
    'function *f() {  return void yield;  }',
    'function *f() {  return typeof yield;  }',
    'function *f() {  return +yield;  }',
    'function *f() {  return !yield;  }',
    'function *f() {  return --yield;  }',
    'function *f() {  return delete yield foo;  }',
    'function *f() {  return void yield foo;  }',
    'function *f() {  return typeof yield foo;  }',
    'fuction *f() {  return +yield foo;  }',
    'function *f() {  return await yield foo;  }',
    { code: 'function* g() { (function yield() {}) }', options: { impliedStrict: true } },
    'var g = function* yield() {};',
    { code: '(x = x + yield);', options: { impliedStrict: true } },
    'function *f(){  ({*g(x=yield){}})  }',
    '(function *f(){  ({*g(x=yield){}})  })',
    'function *f() { yield ? yield : yield ; }',
    'function *f() { yield ? 1 : 1 ; }',
    { code: '([yield] = x)', options: { impliedStrict: true } },
    { code: '([yield]) => x', options: { impliedStrict: true } },
    { code: '({yield}) => x', options: { impliedStrict: true } },
    { code: '({yield})', options: { impliedStrict: true } },
    '({ *g1() {   return {yield}  }})',
    'function *g() { new yield foo}',
    'function *g() { new yield }',
    'function *gf() { (a = (yield) => {}) => {}; }',
    'function* gf() { var a = (x = yield* 0) => { }; }',
    'function* gf() { var a = (x = yield 0) => { }; }',
    'function* gf() { var a = (x, y = yield 0, z = 0) => { }; }',
    'function* gf() { var a = (x, y, z = yield 0) => { }; }',
    'function* gf() { var a = (x = yield) => { }; }',
    'function* gf() { var a = (x, y = yield, z = 0) => { }; }',
    'function* gf() { var a = (x, y, z = yield) => { }; }',
    'function* gf() { var a = (x, yield, y) => { }; }',
    'function* gf() { var a = (x, y, yield) => { }; }',
    'function* gf() { var a = yield => { }; }',
    'function* gf() { var a = (yield) => { }; }',
    'var obj = { *gf(b, yield) {} }',
    'gf = function* (b, yield) {}',
    'function *gf(b, yield) {}',
    'function *gf(b, a = 1 + yield) {}',
    'function *gf(a = (10, yield, 20)) {}',
    'function* gf() { var gfe = function* yield() { } }',
    'function* gf() { function yield() { } }',
    'function* gf() { const yield = 10; }',
    'async (yield) = f',
    // [`(x = delete (async (yield) = f)) => {}`, Context.None]
  ]);

  pass('Expressions - Yield (pass)', [
    { code: 'function* foo(a, b, c, d) { yield a; yield b; yield c; yield d; }', options: { ranges: true } },

    {
      code: outdent`
        function* g25() {
          try {
            throw (yield (1 + (yield 2) + 3))
          } catch (e) {
            if (typeof e == 'object') throw e;
            return e + (yield (4 + (yield 5) + 6));
          }
        }
      `,
      options: { ranges: true },
    },

    {
      code: 'function foo() { return ({ x: 42, g: function* (a) { yield this.x } }).g(0); }',
      options: { ranges: true },
    },

    { code: 'yield *= x;', options: { ranges: true } },
    { code: 'function* g() { yield 1; try { yield 2; } catch (e) { yield e; } yield 3; }', options: { ranges: true } },

    {
      code: outdent`
        let foo = function*() {
          yield* (function*() { yield 42; }());
          assertUnreachable();
        }
      `,
      options: { ranges: true },
    },

    { code: ' function* g22() { yield (1 + (yield 2) + 3); yield (4 + (yield 5) + 6); }', options: { ranges: true } },

    { code: 'function* g19() { var x = 1; yield x; with({x:2}) { yield x; } yield x; }', options: { ranges: true } },
    { code: 'function* g8() { for (var x = 0; x < 4; x++) { yield x; } }', options: { ranges: true } },
    { code: 'function *a(){yield void 0}', options: { ranges: true } },
    { code: 'function *a(){yield ~0}', options: { ranges: true } },
    'function *a(){yield ++a;}',
    { code: 'function a(){({*[yield](){}})}', options: { ranges: true } },
    'function*a(){yield\na}',
    '({yield} = x)',
    '([x, {y: [yield]}]) => x',
    'function f(){ 5 + yield }',
    '(x = yield = x)',
    '([yield])',
    '([x, {y: [yield]}] = z)',
    'function* a(b, c, d) { throw `_":${((yield* (6002.22)))}¿Z${null}UâÑ?${([])}â.Ò÷${((`m`))}`; }',
    'function* a(b, c, d) { "use strict"; if (yield null) for (const o in null()) throw this; }',
    { code: '([x, {y: [yield]}])', options: { ranges: true } },

    'function *f(){ delete ("x"[(yield)]) }',
    { code: 'function *f() { (yield x ** y) }', options: { ranges: true } },
    'function *f(){ delete (((((foo(yield)))))).bar }',
    'function *f({x: x}) { function f({x: yield}) {} }',
    '({ *g1() {   return {x: yield}  }})',
    '({ *g1() {   (yield 1)  }})',
    '({ *g1() {   (yield)  }})',
    'function *f() { 1 ? 1 : yield ; }',
    'function *f() { 1 ? yield : 1 ; }',
    'function *f() { 1 ? 2 : yield 3; }',
    'function *f() { 1 ? yield 2 : 3; }',
    'function *f() { yield 1 ? 2 : 3; }',
    'function *f() { (yield 1) ? yield 2 : yield 3; }',
    '({  * yield() {}  })',
    'function *g() { [...yield]; }',
    outdent`
      function* gf1 () {
          yield 10;
          yield 20;
          yield 30;

          function a() { }
          function b() { }
          function c() { }

          yield a();

          yield b() + (yield c());
      }
    `,
    'function f(){  return function(x=yield) {};  }',
    'function f(){  x = {foo(a=yield){}}  }',
    'function f(){  return function(x=yield) {};  }',
    'function f(){  return (x=yield) => x;  }',
    'function *f(){  return function(x=yield) {};  }',
    'function *g() { function f(x = x + yield) {}; }',
    'function *g() { function f(x = yield) {}; }',
    'async (x = z = yield)',
    'function *f(){ async (yield) }',
    'async (x = z = yield) => {}',
    'async (x = (yield)) => {}',
    'async (x = yield)',
    'async (yield)',
    'async (x = yield) => {}',
    'function *f({x: x}) { function f({x: yield}) {} }',
    'function *g(){ async (x = [yield y]) }',
    'function *g(){ async (x = [yield]) }',
    'function *g(){ async (x = {[yield y]: 1}) }',
    'function *g(){ async (x = {[yield]: 1}) }',
    'function *g() { async (x = x + foo(a, yield y)); }',
    'function *g() { async (x = yield); }',
    '{ (x = [yield]) => z }',
    '{ (x = [yield]) }',
    '{ (x = {[yield]: 1}) => z }',
    '{ (x = {[yield]: 1}) }',
    '{ (x = x + yield) => x; }',
    '{ (x = x + yield); }',
    '{ (x = yield); }',
    '{ (x = yield) => {}; }',
    '{ yield => {}; }',
    '{ yield = {}; }',
    'function *g(){ (x = [yield y]) }',

    'function *g(){ (x = [yield]) }',

    'function* f(){ call(yield x); }',
    'function *g(){ (x = {[yield y]: 1}) }',

    'function *g(){ (x = {[yield]: 1}) }',
    'function *g() { function f(x = yield) {} }',
    'function *g() { function f(x = x + yield) {} }',
    'function f(){ (x=yield) => x;  }',
    'function f(){ a = function(x=yield) {};  }',
    'function f(){  x = {foo(a=yield){}}  }',
    'function *g() { [...yield]; }',
    '({  * yield() {}  })',
    'function *f() { (yield 1) ? yield 2 : yield 3; }',

    'function *g(){ x + f(yield f); }',
    'async function *f(x){ yield x; }',
    'function *a() { (b) => b * yield; }',
    'function *g() { (x = x + foo(a, yield y)); }',
    '([x, {y: [yield]}] = z)',
    '([x, {y: [yield]}])',
    'function foo() { function *g() { yield ~x } }',
    'function foo() { function a(){({*[yield](){}})} }',
    'function foo() { function *a(){yield ++a;} }',
    'function foo() { ({ get yield() { 1 } }) }',
    'function foo() {++yield; }',
    'function foo() { function foo(yield) { } }',
    '(function* f(){ yield })',
    '(function* f(){ yield x + y })',
    'function foo() { function *a(){yield delete 1}}',
    'function foo() { function*a(){yield*a} }',
    'function foo() { function * gen() { (yield) ? yield : yield } }',

    'function* f(){ yield; }',
    '(function* f(){ yield x; })',
    '(function* f(){ yield x + y; })',
    '(function* f(){ call(yield); })',
    '(function* f(){ call(yield x + y); })',
    '(function f(){ 5 + yield })',
    '(function f(){ call(yield); })',
    '(function* g() { x = yield 3; })',
    '(function* g(x) { yield x = 3; })',
    '(function* g(x) { yield x = yield 3; })',
    'async function *g() { (x = y = yield z) }',
    'async function *g() { (x = yield); }',
    '(x = x + yield);',
    '(x = x + yield) => x;',
    '(x = {[yield]: 1})',
    '(function *g(){ async (x = {[yield]: 1}) })',
    '(function *g(){ async (x = {[yield y]: 1}) })',
    '(function *g(){ async (x = [yield y]) })',
    'async (x = yield) => {}',
    'async (yield)',
    'async (x = yield)',
    'async (x = (yield)) => {}',
    'async (x = z = yield) => {}',
    'async (x = z = yield)',
    '(function *f(){ async (x = yield) })',

    '1,2,3',
    'yield',
    'yield: foo  => {}',
    'yield  => {}',
    // yield => yield => foo
    'yield => yield ? foo : bar',
    'await: yield',
    'function *foo() { () => {} }',
    'function foo() { function *b() {} }',

    'function foo() { function * gen() { yield * a; return } }',
    'function *foo() { function b() {} function *b() {} }',

    'function foo() { function * gen() { yield yield a; } }',
    'yield: foo',
    'try { } catch (yield) { }',
    'var foo = yield = 1;',
    'yield * 2;',
    'yield: 34',
    'function yield(yield) { yield: yield (yield + yield(0)); }',
    'yield(100)',
    'yield[100]',
    'function* gf() { yield "foo"; }',
    'var o = { *gf() { switch (1) { case yield: break; } } }',
    { code: 'function * yield() { }', options: { ranges: true } },
    '++yield;',
    'function * gen() { yield a; }',
    { code: 'function * gen() { yield * a; return }', options: { ranges: true } },
    'function *a(){yield delete 0}',
    'function *a(){({get b(){yield}})}',
    'function *a(){yield ++a;}',
    'function * gen() { (yield * 3) + (yield * 4); }',
    '(function * () { x = class extends (yield) {} });',
    '(function * () { yield * 1; return 37; yield * "icefapper"; });',
    '(function * () { ({ [yield]: x } = { }) });',
    'function *g() { yield ~x }',
    'function *g() { yield class x {} }',
    'function *g() { yield yield }',
    'function* g() { exprValue = yield * {}; }',
    'function* g5() { (yield 1) ? yield 2 : yield 3; }',
    'function f() { var yield = 10; var o = { yield }; }',
    'function f() { class C { yield() { } } }',
    '+function yield() {}',
    outdent`
      function *f1() {
        function g() {
          return yield / 1;
        }
      }
    `,
    outdent`
      function* fn() {
        () => yield;
        () => { yield };
      }
    `,
    'function* f(){ () => yield; }',
    'function *foo() { function b() {} }',
    'function fn(x = yield* yield) {}',
    'function * gen() { (yield * a) + (yield * b);; }',
    'function * gen() { yield, yield }',
    'function fn(x = yield* yield) {}',
    'function* a(){({[yield]:a}=0)}',
    'function* a(){yield a}',
    'function* g(){(class extends (yield) {});}',
    'function* a(){(class {[yield](){}})};',
    'function * gen() { yield /* comment */ }',
    'function* g1() { (yield 1) }',
    'function* g2() { [yield 1] }',
    'function* a() { yield; function b({} = c) {} (d) => { }  }',
    'function* g4() { yield 1, yield 2; }',
    outdent`
      function* g(a, b, c, d) {
        arguments[0] = 32;
        arguments[1] = 54;
        arguments[2] = 333;
        yield a;
        yield b;
        yield c;
        yield d;
      }
    `,
    'function f() { function* yield() { } }',
    'function f() { var o = { *yield() { } } }',
    'function f() { var yield = 10; var o = { yield }; }',
    { code: 'function f() { class C { yield() { } } }', options: { ranges: true } },
    'function f() { let yield; }',
    'function f() { const yield = 10; }',
    'function* gf() { var o = { yield: 10 } }',
    'function *g() { yield {...(x,y),}}',
    'function *g() {yield {     ...yield yield,    };}',
    'function *g() {x={     ...yield yield,    };}',
    'function *g() {x={     ...yield x,    };}',
    'function *g() {x={     ...yield,    };}',
    'function *g() {x={     ...yield yield    };}',
    'function *g() {yield {     ...yield yield    };}',
    '({ *g1() {   return {x: yield}  }})',
    'function *f(){  class x extends (yield y){}  }',
    'function *f(){  class x{[yield foo](a){}}  }',
    'function* gf() { var a = yield; }',
    'function* gf() { foo[yield]; }',
    'function* gf() { yield, 10; }',
    'function* gf() { switch (1) { case yield: break; } }',
    'var gfe = function* () { switch (1) { case yield: break; } }',
    'var o = { *gf() { switch (1) { case yield: break; } } }',
    'class C { *gf() { switch (1) { case yield: break; } } }',
    'function* gf() { var a = yield "foo"; }',
    'function* gf() { foo[yield "foo"]; }',
    'function* gf() { switch (1) { case yield "foo": break; } }',
    "function* gf() { yield* 'foo'; }",
    "function* gf() { var a = yield* 'foo'; }",
    { code: "class C { *gf() { switch (1) { case yield* 'foo': break; } } }", options: { ranges: true } },
    'function* gf() { var fe = function yield() { } }',
    'function* gf() { var o = { yield: 10 } }',
    'function* gf() { var o = { yield() { } } }',
    'function* gf() { class C { *yield() { } } }',
    'function f() { const yield = 10; }',
    'function f() { var o = { yield: 10 } }',
    'function f() { class C { *yield() { } } }',
    // ['function* gf() {for(var a = yield in {});}', Context.None, {}],
    'function* gf() { var o = { *yield() { } } }',
    {
      code: outdent`
        function* testGenerator(arg1) {
            var i = 100;
            var j = 1000;
            var k = 10000;
            yield { arg1: arg1++, i: ++i, j: j++, k: k++, p: ++p };
            yield { arg1: arg1++, i: ++i, j: j++, k: k++, p: ++p };
            yield { arg1: arg1++, i: ++i, j: j++, k: k++, p: ++p };
            yield { arg1: arg1++, i: ++i, j: j++, k: k++, p: ++p };
        }

        var gen = testGenerator(10);

        function yieldOne() {
            var v1 = gen.next();
            var val = JSON.stringify(v1.value, undefined, '');
        }
      `,
      options: { ranges: true, raw: true },
    },
  ]);
});
