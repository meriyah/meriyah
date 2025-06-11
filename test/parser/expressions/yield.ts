import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

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
    `({get a(){}});
    yield;`,
    'function* foo() {  return ( yield* ( async ( j ) => {}) ) }',
    `function* foo() { switch ( y (yield) - ((a) => {})) { } }`,
    `function* foo() { switch ( y (yield) - (async (a) => {})) { } }`,
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
    `{
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
    }`,
    `{
      let a = 3;
      function* foo() {
        let b = 4;
        yield 1;
        { let c = 5; yield 2; yield a; yield b; yield c; }
      }
      g = foo();
    }`,
    `function YieldStar() {
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
    }`,
    `function get() {}
      function* getData() {
        return yield get();
      }
    `,
    `const f = async function * (source, block, opts) {
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
    }`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
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
        parseSource(`function *g() { ${arg}}`, undefined, Context.None);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.None);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`"use strict"; function foo() { ${arg}}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; function foo() { ${arg}}`, undefined, Context.None);
      });
    });

    it(`function foo() { "use strict"; ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function foo() { "use strict"; ${arg} }`, undefined, Context.None);
      });
    });

    it(`"use strict"; (function foo() {${arg}})`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (function foo() {${arg}})`, undefined, Context.None);
      });
    });

    it(`"use strict"; (function * gen() { function foo() { ${arg}} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (function * gen() { function foo() { ${arg}} }`, undefined, Context.None);
      });
    });

    it(`"use strict"; (function * gen() { (function foo() { ${arg}}) })`, () => {
      t.throws(() => {
        parseSource(`"use strict"; (function * gen() { (function foo() { ${arg}}) })`, undefined, Context.None);
      });
    });
  }

  const yieldInParameters = [
    `(a = yield) => {}`,
    `(a = yield /a/g) => {}`, // Should parse as division, not yield expression with regexp.
    `yield => {};`,
    `(yield) => {};`,
    `(yield = 0) => {};`,
    `([yield]) => {};`,
    `([yield = 0]) => {};`,
    `([...yield]) => {};`,
    `({a: yield}) => {};`,
    `({yield}) => {};`,
    `({yield = 0}) => {};`,
    `async (yield) => {};`,
    `async (yield = 0) => {};`,
    `async ([yield]) => {};`,
    `async ([yield = 0]) => {};`,
    `async ([...yield]) => {};`,
    `async ({a: yield}) => {};`,
    `async ({yield}) => {};`,
    `async ({yield = 0}) => {};`,
  ];

  const yieldInBody = [
    `() => { var x = yield; }`,
    `() => { var x = yield /a/g; }`,
    `() => { var yield; };`,
    `() => { var yield = 0; };`,
    `() => { var [yield] = []; };`,
    `() => { var [yield = 0] = []; };`,
    `() => { var [...yield] = []; };`,
    `() => { var {a: yield} = {}; };`,
    `() => { var {yield} = {}; };`,
    `() => { var {yield = 0} = {}; };`,
    `() => { let yield; };`,
    `() => { let yield = 0; };`,
    `() => { let [yield] = []; };`,
    `() => { let [yield = 0] = []; };`,
    `() => { let [...yield] = []; };`,
    `() => { let {a: yield} = {}; };`,
    `() => { let {yield} = {}; };`,
    `() => { let {yield = 0} = {}; };`,
    `() => { const yield = 0; };`,
    `() => { const [yield] = []; };`,
    `() => { const [yield = 0] = []; };`,
    `() => { const [...yield] = []; };`,
    `() => { const {a: yield} = {}; };`,
    `() => { const {yield} = {}; };`,
    `() => { const {yield = 0} = {}; };`,
  ];

  for (const test of [...yieldInParameters, ...yieldInBody]) {
    // Script context.
    it(`"use strict"; ${test}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${test}`, undefined, Context.None);
      });
    });

    // Function context.
    it(`"use strict"; function f() { ${test} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; function f() { ${test} }`, undefined, Context.None);
      });
    });

    // Function context.
    it(`"use strict"; function f() { ${test} }`, () => {
      t.throws(() => {
        parseSource(
          `"use strict"; function f() { ${test} }`,
          undefined,
          Context.OptionsWebCompat | Context.OptionsNext,
        );
      });
    });

    // Generator
    it(`"use strict"; function* g() { ${test} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; function* g() { ${test} }`, undefined, Context.None);
      });
    });
  }
  // Generator context.
  for (const test of yieldInParameters) {
    it(`function* g() { ${test} }`, () => {
      t.throws(() => {
        parseSource(`function* g() { ${test} }`, undefined, Context.None);
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
        parseSource(`function *foo() {${arg}}`, undefined, Context.None);
      });
    });
    it(`(function *foo() {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function *foo() {${arg}})`, undefined, Context.None);
      });
    });
    it(`(function *() {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function *() {${arg}})`, undefined, Context.None);
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
        parseSource(`function foo() {${arg}}`, undefined, Context.None);
      });
    });

    it(`(function foo() {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function foo() {${arg}})`, undefined, Context.None);
      });
    });

    it(`(() => {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(() => {${arg}})`, undefined, Context.None);
      });
    });

    it(`(() => {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(() => {${arg}})`, undefined, Context.OptionsLexical);
      });
    });

    it(`(async () => {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(async () => {${arg}})`, undefined, Context.None);
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
    `function* f() {
let result;
while (1) {
  result = yield result;
}
}`,
    `function* g() {
yield arguments[0];
yield arguments[1];
yield arguments[2];
yield arguments[3];
}`,

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
    `function* g() {
try {
yield * {};
} catch (err) {
caught = err;
}
}`,
    `function* g1() { (yield 1) }`,
    `function* g2() { [yield 1] }`,
    `function* g3() { {yield 1} }`,
    `function* g4() { yield 1, yield 2; }`,
    `function* g5() { (yield 1) ? yield 2 : yield 3; }`,
    `function* g(a, b, c, d) {
arguments[0] = 32;
arguments[1] = 54;
arguments[2] = 333;
yield a;
yield b;
yield c;
yield d;
}`,
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
        parseSource(`function not_gen() { ${arg}}`, undefined, Context.None);
      });
    });

    it(`function * gen() { function not_gen() { ${arg} }}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function * gen() { function not_gen() { ${arg} }}`, undefined, Context.None);
      });
    });

    it(`(function foo() { ${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function foo() { ${arg}})`, undefined, Context.None);
      });
    });

    it(`(function * gen() { function not_gen() { ${arg} }})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function * gen() { function not_gen() { ${arg} }})`, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Yield (fail)', [
    ['(a = yield 3) {}', Context.None],
    ['(a=yield) {}', Context.None],
    ['(yield 3) {}', Context.None],
    ['(yield = 1) {}', Context.None],
    ['({yield} = x)', Context.Strict],
    ['var obj = { *gf(b, a = yield) {} }', Context.None],
    ['function* gf() { yield++; }', Context.None],
    ['function* gf() { (yield) = 10; }', Context.None],
    ['function* gf() { (yield)++; }', Context.None],
    ['function *gf(){ function yield(){}; }', Context.None],
    ['function *gf({yield}){}', Context.None],
    ['function*g([yield]){}', Context.None],
    ['function*g(yield = 0){}', Context.None],
    ['function *f(x=yield){ }', Context.None],
    ['function *f(yield){ }', Context.None],
    ['({x} = yield) => {}', Context.Strict],
    ['function *f(){ ({x} = yield x) => {} }', Context.None],
    ['function *f(){ ([x] = yield x) => {} }', Context.None],
    ['function *g(a, b, c, ...yield){}', Context.None],
    ['(function *(x, ...yield){})', Context.None],
    ['function *a(){yield\n*a}', Context.None],
    ['function* gf() { var yield; }', Context.None],
    ['function* gf() { let yield; }', Context.None],
    ['function* gf() { +yield; }', Context.None],
    ['function* gf() { +yield 2; }', Context.None],
    ['yield x', Context.None],
    ['yield x + y', Context.None],
    ['5 + yield x', Context.None],
    ['function *a(){({yield} = {})}', Context.None],
    ['function *a(){yield*}', Context.None],
    ['function* gf() { 1 + yield; }', Context.None],
    ['function* gf() { 1 + yield 2; }', Context.None],
    ['function* gf() { 1 + yield* "foo"; }', Context.None],
    ['function* gf() { +yield; }', Context.None],
    ['function* gf() { yield++; }', Context.None],
    ['let gfe = function* yield() { }', Context.None],
    ['function* gf() { let yield; ', Context.None],
    ['function* gf() { const yield = 10; }', Context.None],
    ['function* gf() { function* yield() { } }', Context.None],
    ['function* gf() { var gfe = function* yield() { } }', Context.None],
    ['function* gf() { class yield { } }', Context.None],
    ['function* gf() { var o = { yield }; }', Context.None],
    ['"function *gf(b, a = 1 + yield) {', Context.None],
    ['gf = function* (b, a = yield) {}', Context.None],
    ['function* gf() { var a = (x, y = yield* 0, z = 0) => { }; }', Context.None],
    ['function* gf() { var a = (x, y, z = yield* 0) => { }; }', Context.None],
    ['function* gf() {var a = yield in {};}', Context.None],
    ['function* gf() {yield in {};}', Context.None],
    ['5 + yield x + y', Context.None],
    ['call(yield x)', Context.None],
    ['call(yield x + y)', Context.None],
    ['function* f(){ 5 + yield }', Context.None],
    ['function* f(){ 5 + yield x; }', Context.None],
    ['function* f(){ 5 + yield x + y; }', Context.None],
    ['function f(){ yield x; }', Context.None],
    ['function f(){ yield x + y; }', Context.None],
    ['function f(){ call(yield x + y); }', Context.None],
    ['function f(){ 5 + yield x + y; }', Context.None],
    ['function f(){ call(yield x); }', Context.None],
    ['function* g() { yield 3 + yield; }', Context.None],
    ['function* g() { yield 3 + yield 4; }', Context.None],
    ['async function f(){ yield a,b; }', Context.None],
    ['function *f(){ return function(x = yield y){}; }', Context.None],
    ['function *g() { yield = {}; }', Context.None],
    ['label: function* a(){}', Context.None],
    ['function*g(yield){}', Context.None],
    ['function*g({yield}){}', Context.None],
    ['function*g([yield]){}', Context.None],
    ['function*g({a: yield}){}', Context.None],
    ['function*g(yield = 0){}', Context.None],
    ['function*g(){ var yield; }', Context.None],
    ['function*g(){ var yield = 1; }', Context.None],
    ['function*g(){ function yield(){}; }', Context.None],
    ['function*g() { var yield; }', Context.None],
    ['function*g() { let yield; }', Context.None],
    ['function*g() { try {} catch (yield) {} }', Context.None],
    ['function*g() { ({yield}); }', Context.None],
    ['function*g() { ({yield} = 0); }', Context.None],
    ['function*g() { var {yield} = 0; }', Context.None],
    ['function*g() { for ({yield} in 0); }', Context.None],
    ['function*g() { for ({yield} in [{}]); }', Context.None],
    ['function*g() { for ({yield} of [{}]); }', Context.None],
    ['function*g() { ({yield = 0}); }', Context.None],
    ['function*g() { 0, {yield} = {}; }', Context.None],
    ['function*g() { for ({yield} of [{}]); }', Context.OptionsWebCompat],
    ['function*g() { ({yield = 0}); }', Context.OptionsWebCompat],
    ['function*g() { 0, {yield} = {}; }', Context.OptionsWebCompat],
    ['function*g() { ({yield = 0} = 0); }', Context.None],
    ['function*g() { var {yield = 0} = 0; }', Context.None],
    ['function*g() { for ({yield = 0} in 0); }', Context.None],
    ['function *g() { (x = yield) = {}; }', Context.None],
    ['function *g() { yield => {}; }', Context.None],
    ['function *g() { (x = yield) => {}; }', Context.None],
    ['function *g() { (x = y = yield z) => {}; }', Context.None],
    ['function *g() { (x = y + yield z) => {}; }', Context.None],
    ['function *g() { (x = y + yield); }', Context.None],
    ['function *g() { (x = y + yield y); }', Context.None],
    ['function *g() { (x = y + yield) => x; }', Context.None],
    ['function *g() { (x = y + yield y) => x; }', Context.None],
    ['function *g(){ (x = {[yield y]: 1}) => z }', Context.None],
    ['function *g(){ (x = {[yield]: 1}) => z }', Context.None],
    ['("string" = ({x} = (function* y(z) { (yield) }))) => (p);', Context.None],
    ['(x = x) = x;', Context.None],
    ['{ (x = yield) = {}; }', Context.None],
    ['{ (x = y = yield z) => {}; }', Context.None],
    ['{ (x = y = yield z); }', Context.None],
    ['{ (x = y + yield z) => {}; }', Context.None],
    ['{ (x = y + yield y); }', Context.None],
    ['{ (x = y + yield y) => x; }', Context.None],
    ['{ (x = y + foo(a, yield y)); }', Context.None],
    ['{ (x = y + foo(a, yield y)) => x; }', Context.None],
    ['{ (x = {[yield y]: 1}) }', Context.None],
    ['{ (x = {[yield y]: 1}) => z }', Context.None],
    ['{ (x = [yield y]) }', Context.None],
    ['{ (x = [yield y]) => z }', Context.None],
    ['function *g() { async yield = {}; }', Context.None],
    ['function *g() { async (x = yield) = {}; }', Context.None],
    ['function *g() { async yield => {}; }', Context.None],
    ['function *g() { async (x = yield) => {}; }', Context.None],
    ['function *g() { async (x = y = yield z) => {}; }', Context.None],
    ['function *g() { async (x = y + yield y); }', Context.None],
    ['function *g() { async (x = y + yield z) => {}; }', Context.None],
    ['function *g() { async (x = y + yield); }', Context.None],
    ['function *g() { async (x = y + yield) => x; }', Context.None],
    ['function *g() { async (x = y + yield y) => x; }', Context.None],
    ['function *g() { async (x = y + foo(a, yield y)) => x; }', Context.None],
    ['function *g(){ async (x = {[yield]: 1}) => z }', Context.None],
    ['function *g(){ async (x = {[yield y]: 1}) => z }', Context.None],
    ['function *g(){ async (x = [yield]) => z }', Context.None],
    ['function *g(){ async (x = [yield y]) => z }', Context.None],
    ['function *f(yield){}', Context.None],
    ['async (yield x)', Context.None],
    ['async (x = yield y)', Context.None],
    ['function *f(){ async (x = yield) => {} }', Context.None],
    ['function *f(){ async (x = yield y) => {} }', Context.None],
    ['function* foo() { class x extends (async yield* (e = "x") => {}) {} }', Context.None],
    ['function *f(){ async (x = (yield)) => {} }', Context.None],
    ['function *f(){ async (x = (yield y)) => {} }', Context.None],
    ['function *f(){ async (x = z = yield) => {} }', Context.None],
    ['function *f(){ async (x = z = yield y) => {} }', Context.None],
    ['function *g() { (x = u + yield z) => {}; }', Context.None],
    ['function *g() { function f(x = y = yield z) {}; }', Context.None],
    ['function *g() { function f(x = x + yield y) {}; }', Context.None],
    ['function *g() { function f(x = x + foo(a, yield y)) {}; }', Context.None],
    ['function *f(){  return function(x=yield y) {};  }', Context.None],
    ['function *f(){  class x{constructor(a=yield x){}}  }', Context.None],
    ['function *f(){  class x{foo(a=yield x){}}  }', Context.None],
    ['function *f(){  x = {foo(a=yield x){}}  }', Context.None],
    ['function *f(){  return *(x=yield y) => x;  }', Context.None],
    ['function *f(){ yield = 1; }', Context.None],
    ['(yield) = 1;', Context.Strict],
    ['function *f(){ (yield) = 1; }', Context.None],
    ['function *f(x = (yield) = f) {}', Context.None],
    ['(x = delete ((yield) = f)) => {}', Context.Strict],
    ['function *f(x = delete ((yield) = f)) {}', Context.None],
    ['function *f(){  return *(x=yield y) => x;  }', Context.None],
    ['function *f(){  return function*(x=yield y) {};  }', Context.None],
    ['function *f(){  class x{*foo(a=yield x){}}  }', Context.None],
    ['function *f(){  x = {*foo(a=yield x){}}  }', Context.None],
    ['function f(){  return *(x=yield y) => x;  }', Context.None],
    ['function f(){  return function*(x=yield y) {};  }', Context.None],
    ['function f(){  class x{*foo(a=yield x){}}  }', Context.None],
    ['function f(){  x = {*foo(a=yield x){}}  }', Context.None],
    ['function f(){  return (x=yield y) => x;  }', Context.None],
    ['function f(){  return function(x=yield y) {};  }', Context.None],
    ['function f(){  class x{foo(a=yield x){}}  }', Context.None],
    ['function f(){  x = {foo(a=yield x){}}  }', Context.None],
    ['function *f(){  return (x=yield) => x;  }', Context.None],
    ['function *f(){  class x{constructor(a=yield){}}  }', Context.None],
    ['function *f(){  x = {foo(a=yield x){}}  }', Context.None],
    ['function *f(){  return *(x=yield) => x;  }', Context.None],
    ['function *f(){  return function*(x=yield) {};  }', Context.None],
    ['function *f(){  class x{*foo(a=yield){}}  }', Context.None],
    ['function *f(){  x = {*foo(a=yield){}}  }', Context.None],
    ['function f(){  return *(x=yield) => x;  }', Context.None],
    ['function f(){  return function*(x=yield) {};  }', Context.None],
    ['function f(){  class x{*foo(a=yield){}}  }', Context.None],
    ['function f(){  x = {*foo(a=yield){}}  }', Context.None],
    ['function f(){  class x{foo(a=yield){}}  }', Context.None],
    ['function *f(){  class x extends yield y{}  }', Context.None],
    ['function *f() {  return delete yield;  }', Context.None],
    ['function *f() {  return void yield;  }', Context.None],
    ['function *f() {  return typeof yield;  }', Context.None],
    ['function *f() {  return +yield;  }', Context.None],
    ['function *f() {  return !yield;  }', Context.None],
    ['function *f() {  return --yield;  }', Context.None],
    ['function *f() {  return delete yield foo;  }', Context.None],
    ['function *f() {  return void yield foo;  }', Context.None],
    ['function *f() {  return typeof yield foo;  }', Context.None],
    ['fuction *f() {  return +yield foo;  }', Context.None],
    ['function *f() {  return await yield foo;  }', Context.None],
    ['function* g() { (function yield() {}) }', Context.Strict],
    ['var g = function* yield() {};', Context.None],
    ['(x = x + yield);', Context.Strict],
    ['function *f(){  ({*g(x=yield){}})  }', Context.None],
    ['(function *f(){  ({*g(x=yield){}})  })', Context.None],
    ['function *f() { yield ? yield : yield ; }', Context.None],
    ['function *f() { yield ? 1 : 1 ; }', Context.None],
    ['([yield] = x)', Context.Strict],
    ['([yield]) => x', Context.Strict],
    ['({yield}) => x', Context.Strict],
    ['({yield})', Context.Strict],
    ['({ *g1() {   return {yield}  }})', Context.None],
    ['function *g() { new yield foo}', Context.None],
    ['function *g() { new yield }', Context.None],
    ['function *gf() { (a = (yield) => {}) => {}; }', Context.None],
    ['function* gf() { var a = (x = yield* 0) => { }; }', Context.None],
    ['function* gf() { var a = (x = yield 0) => { }; }', Context.None],
    ['function* gf() { var a = (x, y = yield 0, z = 0) => { }; }', Context.None],
    ['function* gf() { var a = (x, y, z = yield 0) => { }; }', Context.None],
    ['function* gf() { var a = (x = yield) => { }; }', Context.None],
    ['function* gf() { var a = (x, y = yield, z = 0) => { }; }', Context.None],
    ['function* gf() { var a = (x, y, z = yield) => { }; }', Context.None],
    ['function* gf() { var a = (x, yield, y) => { }; }', Context.None],
    ['function* gf() { var a = (x, y, yield) => { }; }', Context.None],
    ['function* gf() { var a = yield => { }; }', Context.None],
    ['function* gf() { var a = (yield) => { }; }', Context.None],
    ['var obj = { *gf(b, yield) {} }', Context.None],
    ['gf = function* (b, yield) {}', Context.None],
    ['function *gf(b, yield) {}', Context.None],
    ['function *gf(b, a = 1 + yield) {}', Context.None],
    ['function *gf(a = (10, yield, 20)) {}', Context.None],
    ['function* gf() { var gfe = function* yield() { } }', Context.None],
    ['function* gf() { function yield() { } }', Context.None],
    ['function* gf() { const yield = 10; }', Context.None],
    ['async (yield) = f', Context.None],
    // [`(x = delete (async (yield) = f)) => {}`, Context.None]
  ]);

  pass('Expressions - Yield (pass)', [
    ['function* foo(a, b, c, d) { yield a; yield b; yield c; yield d; }', Context.OptionsRanges],

    [
      `function* g25() {
          try {
            throw (yield (1 + (yield 2) + 3))
          } catch (e) {
            if (typeof e == 'object') throw e;
            return e + (yield (4 + (yield 5) + 6));
          }
        }`,
      Context.OptionsRanges,
    ],

    ['function foo() { return ({ x: 42, g: function* (a) { yield this.x } }).g(0); }', Context.OptionsRanges],

    ['yield *= x;', Context.OptionsRanges],
    ['function* g() { yield 1; try { yield 2; } catch (e) { yield e; } yield 3; }', Context.OptionsRanges],

    [
      `let foo = function*() {
                yield* (function*() { yield 42; }());
                assertUnreachable();
              }`,
      Context.OptionsRanges,
    ],

    [' function* g22() { yield (1 + (yield 2) + 3); yield (4 + (yield 5) + 6); }', Context.OptionsRanges],

    ['function* g19() { var x = 1; yield x; with({x:2}) { yield x; } yield x; }', Context.OptionsRanges],
    ['function* g8() { for (var x = 0; x < 4; x++) { yield x; } }', Context.OptionsRanges],
    ['function *a(){yield void 0}', Context.OptionsRanges],
    ['function *a(){yield ~0}', Context.OptionsRanges],
    ['function *a(){yield ++a;}', Context.None],
    ['function a(){({*[yield](){}})}', Context.OptionsRanges],
    ['function*a(){yield\na}', Context.None],
    ['({yield} = x)', Context.None],
    ['([x, {y: [yield]}]) => x', Context.None],
    ['function f(){ 5 + yield }', Context.None],
    ['(x = yield = x)', Context.None],
    ['([yield])', Context.None],
    ['([x, {y: [yield]}] = z)', Context.None],
    ['function* a(b, c, d) { throw `_":${((yield* (6002.22)))}¿Z${null}UâÑ?${([])}â.Ò÷${((`m`))}`; }', Context.None],
    ['function* a(b, c, d) { "use strict"; if (yield null) for (const o in null()) throw this; }', Context.None],
    ['([x, {y: [yield]}])', Context.OptionsRanges],

    ['function *f(){ delete ("x"[(yield)]) }', Context.None],
    ['function *f() { (yield x ** y) }', Context.OptionsRanges],
    ['function *f(){ delete (((((foo(yield)))))).bar }', Context.None],
    ['function *f({x: x}) { function f({x: yield}) {} }', Context.None],
    ['({ *g1() {   return {x: yield}  }})', Context.None],
    ['({ *g1() {   (yield 1)  }})', Context.None],
    ['({ *g1() {   (yield)  }})', Context.None],
    ['function *f() { 1 ? 1 : yield ; }', Context.None],
    ['function *f() { 1 ? yield : 1 ; }', Context.None],
    ['function *f() { 1 ? 2 : yield 3; }', Context.None],
    ['function *f() { 1 ? yield 2 : 3; }', Context.None],
    ['function *f() { yield 1 ? 2 : 3; }', Context.None],
    ['function *f() { (yield 1) ? yield 2 : yield 3; }', Context.None],
    ['({  * yield() {}  })', Context.None],
    ['function *g() { [...yield]; }', Context.None],
    [
      `function* gf1 () {
        yield 10;
        yield 20;
        yield 30;

        function a() { }
        function b() { }
        function c() { }

        yield a();

        yield b() + (yield c());
    }`,
      Context.None,
    ],
    ['function f(){  return function(x=yield) {};  }', Context.None],
    ['function f(){  x = {foo(a=yield){}}  }', Context.None],
    ['function f(){  return function(x=yield) {};  }', Context.None],
    ['function f(){  return (x=yield) => x;  }', Context.None],
    ['function *f(){  return function(x=yield) {};  }', Context.None],
    ['function *g() { function f(x = x + yield) {}; }', Context.None],
    ['function *g() { function f(x = yield) {}; }', Context.None],
    ['async (x = z = yield)', Context.None],
    ['function *f(){ async (yield) }', Context.None],
    ['async (x = z = yield) => {}', Context.None],
    ['async (x = (yield)) => {}', Context.None],
    ['async (x = yield)', Context.None],
    ['async (yield)', Context.None],
    ['async (x = yield) => {}', Context.None],
    ['function *f({x: x}) { function f({x: yield}) {} }', Context.None],
    ['function *g(){ async (x = [yield y]) }', Context.None],
    ['function *g(){ async (x = [yield]) }', Context.None],
    ['function *g(){ async (x = {[yield y]: 1}) }', Context.None],
    ['function *g(){ async (x = {[yield]: 1}) }', Context.None],
    ['function *g() { async (x = x + foo(a, yield y)); }', Context.None],
    ['function *g() { async (x = yield); }', Context.None],
    ['{ (x = [yield]) => z }', Context.None],
    ['{ (x = [yield]) }', Context.None],
    ['{ (x = {[yield]: 1}) => z }', Context.None],
    ['{ (x = {[yield]: 1}) }', Context.None],
    ['{ (x = x + yield) => x; }', Context.None],
    ['{ (x = x + yield); }', Context.None],
    ['{ (x = yield); }', Context.None],
    ['{ (x = yield) => {}; }', Context.None],
    ['{ yield => {}; }', Context.None],
    ['{ yield = {}; }', Context.None],
    ['function *g(){ (x = [yield y]) }', Context.None],

    ['function *g(){ (x = [yield]) }', Context.None],

    ['function* f(){ call(yield x); }', Context.None],
    ['function *g(){ (x = {[yield y]: 1}) }', Context.None],

    ['function *g(){ (x = {[yield]: 1}) }', Context.None],
    ['function *g() { function f(x = yield) {} }', Context.None],
    ['function *g() { function f(x = x + yield) {} }', Context.None],
    ['function f(){ (x=yield) => x;  }', Context.None],
    ['function f(){ a = function(x=yield) {};  }', Context.None],
    ['function f(){  x = {foo(a=yield){}}  }', Context.None],
    ['function *g() { [...yield]; }', Context.None],
    ['({  * yield() {}  })', Context.None],
    ['function *f() { (yield 1) ? yield 2 : yield 3; }', Context.None],

    ['function *g(){ x + f(yield f); }', Context.None],
    ['async function *f(x){ yield x; }', Context.None],
    ['function *a() { (b) => b * yield; }', Context.None],
    ['function *g() { (x = x + foo(a, yield y)); }', Context.None],
    ['([x, {y: [yield]}] = z)', Context.None],
    ['([x, {y: [yield]}])', Context.None],
    ['function foo() { function *g() { yield ~x } }', Context.None],
    ['function foo() { function a(){({*[yield](){}})} }', Context.None],
    ['function foo() { function *a(){yield ++a;} }', Context.None],
    ['function foo() { ({ get yield() { 1 } }) }', Context.None],
    ['function foo() {++yield; }', Context.None],
    ['function foo() { function foo(yield) { } }', Context.None],
    ['(function* f(){ yield })', Context.None],
    ['(function* f(){ yield x + y })', Context.None],
    ['function foo() { function *a(){yield delete 1}}', Context.None],
    ['function foo() { function*a(){yield*a} }', Context.None],
    ['function foo() { function * gen() { (yield) ? yield : yield } }', Context.None],

    ['function* f(){ yield; }', Context.None],
    ['(function* f(){ yield x; })', Context.None],
    ['(function* f(){ yield x + y; })', Context.None],
    ['(function* f(){ call(yield); })', Context.None],
    ['(function* f(){ call(yield x + y); })', Context.None],
    ['(function f(){ 5 + yield })', Context.None],
    ['(function f(){ call(yield); })', Context.None],
    ['(function* g() { x = yield 3; })', Context.None],
    ['(function* g(x) { yield x = 3; })', Context.None],
    ['(function* g(x) { yield x = yield 3; })', Context.None],
    ['async function *g() { (x = y = yield z) }', Context.None],
    ['async function *g() { (x = yield); }', Context.None],
    ['(x = x + yield);', Context.None],
    ['(x = x + yield) => x;', Context.None],
    ['(x = {[yield]: 1})', Context.None],
    ['(function *g(){ async (x = {[yield]: 1}) })', Context.None],
    ['(function *g(){ async (x = {[yield y]: 1}) })', Context.None],
    ['(function *g(){ async (x = [yield y]) })', Context.None],
    ['async (x = yield) => {}', Context.None],
    ['async (yield)', Context.None],
    ['async (x = yield)', Context.None],
    ['async (x = (yield)) => {}', Context.None],
    ['async (x = z = yield) => {}', Context.None],
    ['async (x = z = yield)', Context.None],
    ['(function *f(){ async (x = yield) })', Context.None],

    ['1,2,3', Context.None],
    ['yield', Context.None],
    ['yield: foo  => {}', Context.None],
    ['yield  => {}', Context.None],
    // yield => yield => foo
    ['yield => yield ? foo : bar', Context.None],
    ['await: yield', Context.None],
    ['function *foo() { () => {} }', Context.None],
    ['function foo() { function *b() {} }', Context.None],

    ['function foo() { function * gen() { yield * a; return } }', Context.None],
    ['function *foo() { function b() {} function *b() {} }', Context.None],

    ['function foo() { function * gen() { yield yield a; } }', Context.None],
    ['yield: foo', Context.None],
    ['try { } catch (yield) { }', Context.None],
    ['var foo = yield = 1;', Context.None],
    ['yield * 2;', Context.None],
    ['yield: 34', Context.None],
    ['function yield(yield) { yield: yield (yield + yield(0)); }', Context.None],
    ['yield(100)', Context.None],
    ['yield[100]', Context.None],
    ['function* gf() { yield "foo"; }', Context.None],
    ['var o = { *gf() { switch (1) { case yield: break; } } }', Context.None],
    ['function * yield() { }', Context.OptionsRanges],
    ['++yield;', Context.None],
    ['function * gen() { yield a; }', Context.None],
    ['function * gen() { yield * a; return }', Context.OptionsRanges],
    ['function *a(){yield delete 0}', Context.None],
    ['function *a(){({get b(){yield}})}', Context.None],
    ['function *a(){yield ++a;}', Context.None],
    ['function * gen() { (yield * 3) + (yield * 4); }', Context.None],
    ['(function * () { x = class extends (yield) {} });', Context.None],
    ['(function * () { yield * 1; return 37; yield * "icefapper"; });', Context.None],
    ['(function * () { ({ [yield]: x } = { }) });', Context.None],
    ['function *g() { yield ~x }', Context.None],
    ['function *g() { yield class x {} }', Context.None],
    ['function *g() { yield yield }', Context.None],
    ['function* g() { exprValue = yield * {}; }', Context.None],
    ['function* g5() { (yield 1) ? yield 2 : yield 3; }', Context.None],
    ['function f() { var yield = 10; var o = { yield }; }', Context.None],
    ['function f() { class C { yield() { } } }', Context.None],
    ['+function yield() {}', Context.None],
    [
      `function *f1() {
      function g() {
        return yield / 1;
      }
    }`,
      Context.None,
    ],
    [
      `function* fn() {
      () => yield;
      () => { yield };
    } `,
      Context.None,
    ],
    ['function* f(){ () => yield; }', Context.None],
    ['function *foo() { function b() {} }', Context.None],
    ['function fn(x = yield* yield) {}', Context.None],
    ['function * gen() { (yield * a) + (yield * b);; }', Context.None],
    ['function * gen() { yield, yield }', Context.None],
    ['function fn(x = yield* yield) {}', Context.None],
    ['function* a(){({[yield]:a}=0)}', Context.None],
    ['function* a(){yield a}', Context.None],
    ['function* g(){(class extends (yield) {});}', Context.None],
    ['function* a(){(class {[yield](){}})};', Context.None],
    ['function * gen() { yield /* comment */ }', Context.None],
    ['function* g1() { (yield 1) }', Context.None],
    ['function* g2() { [yield 1] }', Context.None],
    ['function* a() { yield; function b({} = c) {} (d) => { }  }', Context.None],
    ['function* g4() { yield 1, yield 2; }', Context.None],
    [
      `function* g(a, b, c, d) {
      arguments[0] = 32;
      arguments[1] = 54;
      arguments[2] = 333;
      yield a;
      yield b;
      yield c;
      yield d;
    }`,
      Context.None,
    ],
    ['function f() { function* yield() { } }', Context.None],
    ['function f() { var o = { *yield() { } } }', Context.None],
    ['function f() { var yield = 10; var o = { yield }; }', Context.None],
    ['function f() { class C { yield() { } } }', Context.OptionsRanges],
    ['function f() { let yield; }', Context.None],
    ['function f() { const yield = 10; }', Context.None],
    ['function* gf() { var o = { yield: 10 } }', Context.None],
    ['function *g() { yield {...(x,y),}}', Context.None],
    ['function *g() {yield {     ...yield yield,    };}', Context.None],
    ['function *g() {x={     ...yield yield,    };}', Context.None],
    ['function *g() {x={     ...yield x,    };}', Context.None],
    ['function *g() {x={     ...yield,    };}', Context.None],
    ['function *g() {x={     ...yield yield    };}', Context.None],
    ['function *g() {yield {     ...yield yield    };}', Context.None],
    ['({ *g1() {   return {x: yield}  }})', Context.None],
    ['function *f(){  class x extends (yield y){}  }', Context.None],
    ['function *f(){  class x{[yield foo](a){}}  }', Context.None],
    ['function* gf() { var a = yield; }', Context.None],
    ['function* gf() { foo[yield]; }', Context.None],
    ['function* gf() { yield, 10; }', Context.None],
    ['function* gf() { switch (1) { case yield: break; } }', Context.None],
    ['var gfe = function* () { switch (1) { case yield: break; } }', Context.None],
    ['var o = { *gf() { switch (1) { case yield: break; } } }', Context.None],
    ['class C { *gf() { switch (1) { case yield: break; } } }', Context.None],
    ['function* gf() { var a = yield "foo"; }', Context.None],
    ['function* gf() { foo[yield "foo"]; }', Context.None],
    ['function* gf() { switch (1) { case yield "foo": break; } }', Context.None],
    ["function* gf() { yield* 'foo'; }", Context.None],
    ["function* gf() { var a = yield* 'foo'; }", Context.None],
    ["class C { *gf() { switch (1) { case yield* 'foo': break; } } }", Context.OptionsRanges],
    ['function* gf() { var fe = function yield() { } }', Context.None],
    ['function* gf() { var o = { yield: 10 } }', Context.None],
    ['function* gf() { var o = { yield() { } } }', Context.None],
    ['function* gf() { class C { *yield() { } } }', Context.None],
    ['function f() { const yield = 10; }', Context.None],
    ['function f() { var o = { yield: 10 } }', Context.None],
    ['function f() { class C { *yield() { } } }', Context.None],
    // ['function* gf() {for(var a = yield in {});}', Context.None, {}],
    ['function* gf() { var o = { *yield() { } } }', Context.None],
    [
      `function* testGenerator(arg1) {
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
    }`,
      Context.OptionsRanges | Context.OptionsRaw,
    ],
  ]);
});
