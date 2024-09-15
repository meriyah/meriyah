import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
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
    }`
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
    'class C extends yield { }'
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
    `async ({yield = 0}) => {};`
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
    `() => { const {yield = 0} = {}; };`
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
          Context.OptionsWebCompat | Context.OptionsNext
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
    'x = class extends (a ? null : yield) { }'
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
    'yield[100]'
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
    'function f() { class C { *yield() { } } }'
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
    ['async (yield) = f', Context.None]
    // [`(x = delete (async (yield) = f)) => {}`, Context.None]
  ]);

  pass('Expressions - Yield (pass)', [
    [
      'function* foo(a, b, c, d) { yield a; yield b; yield c; yield d; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'a',
                start: 14,
                end: 15,
                range: [14, 15]
              },
              {
                type: 'Identifier',
                name: 'b',
                start: 17,
                end: 18,
                range: [17, 18]
              },
              {
                type: 'Identifier',
                name: 'c',
                start: 20,
                end: 21,
                range: [20, 21]
              },
              {
                type: 'Identifier',
                name: 'd',
                start: 23,
                end: 24,
                range: [23, 24]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'a',
                      start: 34,
                      end: 35,
                      range: [34, 35]
                    },
                    delegate: false,
                    start: 28,
                    end: 35,
                    range: [28, 35]
                  },
                  start: 28,
                  end: 36,
                  range: [28, 36]
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'b',
                      start: 43,
                      end: 44,
                      range: [43, 44]
                    },
                    delegate: false,
                    start: 37,
                    end: 44,
                    range: [37, 44]
                  },
                  start: 37,
                  end: 45,
                  range: [37, 45]
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'c',
                      start: 52,
                      end: 53,
                      range: [52, 53]
                    },
                    delegate: false,
                    start: 46,
                    end: 53,
                    range: [46, 53]
                  },
                  start: 46,
                  end: 54,
                  range: [46, 54]
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'd',
                      start: 61,
                      end: 62,
                      range: [61, 62]
                    },
                    delegate: false,
                    start: 55,
                    end: 62,
                    range: [55, 62]
                  },
                  start: 55,
                  end: 63,
                  range: [55, 63]
                }
              ],
              start: 26,
              end: 65,
              range: [26, 65]
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'foo',
              start: 10,
              end: 13,
              range: [10, 13]
            },
            start: 0,
            end: 65,
            range: [0, 65]
          }
        ],
        start: 0,
        end: 65,
        range: [0, 65]
      }
    ],

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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'TryStatement',
                  block: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ThrowStatement',
                        argument: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'BinaryExpression',
                            left: {
                              type: 'BinaryExpression',
                              left: {
                                type: 'Literal',
                                value: 1,
                                start: 60,
                                end: 61,
                                range: [60, 61]
                              },
                              right: {
                                type: 'YieldExpression',
                                argument: {
                                  type: 'Literal',
                                  value: 2,
                                  start: 71,
                                  end: 72,
                                  range: [71, 72]
                                },
                                delegate: false,
                                start: 65,
                                end: 72,
                                range: [65, 72]
                              },
                              operator: '+',
                              start: 60,
                              end: 73,
                              range: [60, 73]
                            },
                            right: {
                              type: 'Literal',
                              value: 3,
                              start: 76,
                              end: 77,
                              range: [76, 77]
                            },
                            operator: '+',
                            start: 60,
                            end: 77,
                            range: [60, 77]
                          },
                          delegate: false,
                          start: 53,
                          end: 78,
                          range: [53, 78]
                        },
                        start: 46,
                        end: 79,
                        range: [46, 79]
                      }
                    ],
                    start: 32,
                    end: 91,
                    range: [32, 91]
                  },
                  handler: {
                    type: 'CatchClause',
                    param: {
                      type: 'Identifier',
                      name: 'e',
                      start: 99,
                      end: 100,
                      range: [99, 100]
                    },
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'IfStatement',
                          test: {
                            type: 'BinaryExpression',
                            left: {
                              type: 'UnaryExpression',
                              operator: 'typeof',
                              argument: {
                                type: 'Identifier',
                                name: 'e',
                                start: 127,
                                end: 128,
                                range: [127, 128]
                              },
                              prefix: true,
                              start: 120,
                              end: 128,
                              range: [120, 128]
                            },
                            right: {
                              type: 'Literal',
                              value: 'object',
                              start: 132,
                              end: 140,
                              range: [132, 140]
                            },
                            operator: '==',
                            start: 120,
                            end: 140,
                            range: [120, 140]
                          },
                          consequent: {
                            type: 'ThrowStatement',
                            argument: {
                              type: 'Identifier',
                              name: 'e',
                              start: 148,
                              end: 149,
                              range: [148, 149]
                            },
                            start: 142,
                            end: 150,
                            range: [142, 150]
                          },
                          alternate: null,
                          start: 116,
                          end: 150,
                          range: [116, 150]
                        },
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'BinaryExpression',
                            left: {
                              type: 'Identifier',
                              name: 'e',
                              start: 170,
                              end: 171,
                              range: [170, 171]
                            },
                            right: {
                              type: 'YieldExpression',
                              argument: {
                                type: 'BinaryExpression',
                                left: {
                                  type: 'BinaryExpression',
                                  left: {
                                    type: 'Literal',
                                    value: 4,
                                    start: 182,
                                    end: 183,
                                    range: [182, 183]
                                  },
                                  right: {
                                    type: 'YieldExpression',
                                    argument: {
                                      type: 'Literal',
                                      value: 5,
                                      start: 193,
                                      end: 194,
                                      range: [193, 194]
                                    },
                                    delegate: false,
                                    start: 187,
                                    end: 194,
                                    range: [187, 194]
                                  },
                                  operator: '+',
                                  start: 182,
                                  end: 195,
                                  range: [182, 195]
                                },
                                right: {
                                  type: 'Literal',
                                  value: 6,
                                  start: 198,
                                  end: 199,
                                  range: [198, 199]
                                },
                                operator: '+',
                                start: 182,
                                end: 199,
                                range: [182, 199]
                              },
                              delegate: false,
                              start: 175,
                              end: 200,
                              range: [175, 200]
                            },
                            operator: '+',
                            start: 170,
                            end: 201,
                            range: [170, 201]
                          },
                          start: 163,
                          end: 202,
                          range: [163, 202]
                        }
                      ],
                      start: 102,
                      end: 214,
                      range: [102, 214]
                    },
                    start: 92,
                    end: 214,
                    range: [92, 214]
                  },
                  finalizer: null,
                  start: 28,
                  end: 214,
                  range: [28, 214]
                }
              ],
              start: 16,
              end: 224,
              range: [16, 224]
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'g25',
              start: 10,
              end: 13,
              range: [10, 13]
            },
            start: 0,
            end: 224,
            range: [0, 224]
          }
        ],
        start: 0,
        end: 224,
        range: [0, 224]
      }
    ],

    [
      'function foo() { return ({ x: 42, g: function* (a) { yield this.x } }).g(0); }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'x',
                              start: 27,
                              end: 28,
                              range: [27, 28]
                            },
                            value: {
                              type: 'Literal',
                              value: 42,
                              start: 30,
                              end: 32,
                              range: [30, 32]
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false,
                            start: 27,
                            end: 32,
                            range: [27, 32]
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'g',
                              start: 34,
                              end: 35,
                              range: [34, 35]
                            },
                            value: {
                              type: 'FunctionExpression',
                              params: [
                                {
                                  type: 'Identifier',
                                  name: 'a',
                                  start: 48,
                                  end: 49,
                                  range: [48, 49]
                                }
                              ],
                              body: {
                                type: 'BlockStatement',
                                body: [
                                  {
                                    type: 'ExpressionStatement',
                                    expression: {
                                      type: 'YieldExpression',
                                      argument: {
                                        type: 'MemberExpression',
                                        object: {
                                          type: 'ThisExpression',
                                          start: 59,
                                          end: 63,
                                          range: [59, 63]
                                        },
                                        computed: false,
                                        property: {
                                          type: 'Identifier',
                                          name: 'x',
                                          start: 64,
                                          end: 65,
                                          range: [64, 65]
                                        },
                                        start: 59,
                                        end: 65,
                                        range: [59, 65]
                                      },
                                      delegate: false,
                                      start: 53,
                                      end: 65,
                                      range: [53, 65]
                                    },
                                    start: 53,
                                    end: 65,
                                    range: [53, 65]
                                  }
                                ],
                                start: 51,
                                end: 67,
                                range: [51, 67]
                              },
                              async: false,
                              generator: true,
                              id: null,
                              start: 37,
                              end: 67,
                              range: [37, 67]
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false,
                            start: 34,
                            end: 67,
                            range: [34, 67]
                          }
                        ],
                        start: 25,
                        end: 69,
                        range: [25, 69]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'g',
                        start: 71,
                        end: 72,
                        range: [71, 72]
                      },
                      start: 24,
                      end: 72,
                      range: [24, 72]
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: 0,
                        start: 73,
                        end: 74,
                        range: [73, 74]
                      }
                    ],
                    start: 24,
                    end: 75,
                    range: [24, 75]
                  },
                  start: 17,
                  end: 76,
                  range: [17, 76]
                }
              ],
              start: 15,
              end: 78,
              range: [15, 78]
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'foo',
              start: 9,
              end: 12,
              range: [9, 12]
            },
            start: 0,
            end: 78,
            range: [0, 78]
          }
        ],
        start: 0,
        end: 78,
        range: [0, 78]
      }
    ],

    [
      'yield *= x;',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'yield',
                start: 0,
                end: 5,
                range: [0, 5]
              },
              operator: '*=',
              right: {
                type: 'Identifier',
                name: 'x',
                start: 9,
                end: 10,
                range: [9, 10]
              },
              start: 0,
              end: 10,
              range: [0, 10]
            },
            start: 0,
            end: 11,
            range: [0, 11]
          }
        ],
        start: 0,
        end: 11,
        range: [0, 11]
      }
    ],
    [
      'function* g() { yield 1; try { yield 2; } catch (e) { yield e; } yield 3; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Literal',
                      value: 1,
                      start: 22,
                      end: 23,
                      range: [22, 23]
                    },
                    delegate: false,
                    start: 16,
                    end: 23,
                    range: [16, 23]
                  },
                  start: 16,
                  end: 24,
                  range: [16, 24]
                },
                {
                  type: 'TryStatement',
                  block: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Literal',
                            value: 2,
                            start: 37,
                            end: 38,
                            range: [37, 38]
                          },
                          delegate: false,
                          start: 31,
                          end: 38,
                          range: [31, 38]
                        },
                        start: 31,
                        end: 39,
                        range: [31, 39]
                      }
                    ],
                    start: 29,
                    end: 41,
                    range: [29, 41]
                  },
                  handler: {
                    type: 'CatchClause',
                    param: {
                      type: 'Identifier',
                      name: 'e',
                      start: 49,
                      end: 50,
                      range: [49, 50]
                    },
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'e',
                              start: 60,
                              end: 61,
                              range: [60, 61]
                            },
                            delegate: false,
                            start: 54,
                            end: 61,
                            range: [54, 61]
                          },
                          start: 54,
                          end: 62,
                          range: [54, 62]
                        }
                      ],
                      start: 52,
                      end: 64,
                      range: [52, 64]
                    },
                    start: 42,
                    end: 64,
                    range: [42, 64]
                  },
                  finalizer: null,
                  start: 25,
                  end: 64,
                  range: [25, 64]
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Literal',
                      value: 3,
                      start: 71,
                      end: 72,
                      range: [71, 72]
                    },
                    delegate: false,
                    start: 65,
                    end: 72,
                    range: [65, 72]
                  },
                  start: 65,
                  end: 73,
                  range: [65, 73]
                }
              ],
              start: 14,
              end: 75,
              range: [14, 75]
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'g',
              start: 10,
              end: 11,
              range: [10, 11]
            },
            start: 0,
            end: 75,
            range: [0, 75]
          }
        ],
        start: 0,
        end: 75,
        range: [0, 75]
      }
    ],

    [
      `let foo = function*() {
                yield* (function*() { yield 42; }());
                assertUnreachable();
              }`,
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'CallExpression',
                            callee: {
                              type: 'FunctionExpression',
                              params: [],
                              body: {
                                type: 'BlockStatement',
                                body: [
                                  {
                                    type: 'ExpressionStatement',
                                    expression: {
                                      type: 'YieldExpression',
                                      argument: {
                                        type: 'Literal',
                                        value: 42,
                                        start: 68,
                                        end: 70,
                                        range: [68, 70]
                                      },
                                      delegate: false,
                                      start: 62,
                                      end: 70,
                                      range: [62, 70]
                                    },
                                    start: 62,
                                    end: 71,
                                    range: [62, 71]
                                  }
                                ],
                                start: 60,
                                end: 73,
                                range: [60, 73]
                              },
                              async: false,
                              generator: true,
                              id: null,
                              start: 48,
                              end: 73,
                              range: [48, 73]
                            },
                            arguments: [],
                            start: 48,
                            end: 75,
                            range: [48, 75]
                          },
                          delegate: true,
                          start: 40,
                          end: 76,
                          range: [40, 76]
                        },
                        start: 40,
                        end: 77,
                        range: [40, 77]
                      },
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'assertUnreachable',
                            start: 94,
                            end: 111,
                            range: [94, 111]
                          },
                          arguments: [],
                          start: 94,
                          end: 113,
                          range: [94, 113]
                        },
                        start: 94,
                        end: 114,
                        range: [94, 114]
                      }
                    ],
                    start: 22,
                    end: 130,
                    range: [22, 130]
                  },
                  async: false,
                  generator: true,
                  id: null,
                  start: 10,
                  end: 130,
                  range: [10, 130]
                },
                id: {
                  type: 'Identifier',
                  name: 'foo',
                  start: 4,
                  end: 7,
                  range: [4, 7]
                },
                start: 4,
                end: 130,
                range: [4, 130]
              }
            ],
            start: 0,
            end: 130,
            range: [0, 130]
          }
        ],
        start: 0,
        end: 130,
        range: [0, 130]
      }
    ],

    [
      ' function* g22() { yield (1 + (yield 2) + 3); yield (4 + (yield 5) + 6); }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Literal',
                          value: 1,
                          start: 26,
                          end: 27,
                          range: [26, 27]
                        },
                        right: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Literal',
                            value: 2,
                            start: 37,
                            end: 38,
                            range: [37, 38]
                          },
                          delegate: false,
                          start: 31,
                          end: 38,
                          range: [31, 38]
                        },
                        operator: '+',
                        start: 26,
                        end: 39,
                        range: [26, 39]
                      },
                      right: {
                        type: 'Literal',
                        value: 3,
                        start: 42,
                        end: 43,
                        range: [42, 43]
                      },
                      operator: '+',
                      start: 26,
                      end: 43,
                      range: [26, 43]
                    },
                    delegate: false,
                    start: 19,
                    end: 44,
                    range: [19, 44]
                  },
                  start: 19,
                  end: 45,
                  range: [19, 45]
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Literal',
                          value: 4,
                          start: 53,
                          end: 54,
                          range: [53, 54]
                        },
                        right: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Literal',
                            value: 5,
                            start: 64,
                            end: 65,
                            range: [64, 65]
                          },
                          delegate: false,
                          start: 58,
                          end: 65,
                          range: [58, 65]
                        },
                        operator: '+',
                        start: 53,
                        end: 66,
                        range: [53, 66]
                      },
                      right: {
                        type: 'Literal',
                        value: 6,
                        start: 69,
                        end: 70,
                        range: [69, 70]
                      },
                      operator: '+',
                      start: 53,
                      end: 70,
                      range: [53, 70]
                    },
                    delegate: false,
                    start: 46,
                    end: 71,
                    range: [46, 71]
                  },
                  start: 46,
                  end: 72,
                  range: [46, 72]
                }
              ],
              start: 17,
              end: 74,
              range: [17, 74]
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'g22',
              start: 11,
              end: 14,
              range: [11, 14]
            },
            start: 1,
            end: 74,
            range: [1, 74]
          }
        ],
        start: 0,
        end: 74,
        range: [0, 74]
      }
    ],

    [
      'function* g19() { var x = 1; yield x; with({x:2}) { yield x; } yield x; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: 1,
                        start: 26,
                        end: 27,
                        range: [26, 27]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'x',
                        start: 22,
                        end: 23,
                        range: [22, 23]
                      },
                      start: 22,
                      end: 27,
                      range: [22, 27]
                    }
                  ],
                  start: 18,
                  end: 28,
                  range: [18, 28]
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'x',
                      start: 35,
                      end: 36,
                      range: [35, 36]
                    },
                    delegate: false,
                    start: 29,
                    end: 36,
                    range: [29, 36]
                  },
                  start: 29,
                  end: 37,
                  range: [29, 37]
                },
                {
                  type: 'WithStatement',
                  object: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x',
                          start: 44,
                          end: 45,
                          range: [44, 45]
                        },
                        value: {
                          type: 'Literal',
                          value: 2,
                          start: 46,
                          end: 47,
                          range: [46, 47]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false,
                        start: 44,
                        end: 47,
                        range: [44, 47]
                      }
                    ],
                    start: 43,
                    end: 48,
                    range: [43, 48]
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'x',
                            start: 58,
                            end: 59,
                            range: [58, 59]
                          },
                          delegate: false,
                          start: 52,
                          end: 59,
                          range: [52, 59]
                        },
                        start: 52,
                        end: 60,
                        range: [52, 60]
                      }
                    ],
                    start: 50,
                    end: 62,
                    range: [50, 62]
                  },
                  start: 38,
                  end: 62,
                  range: [38, 62]
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'x',
                      start: 69,
                      end: 70,
                      range: [69, 70]
                    },
                    delegate: false,
                    start: 63,
                    end: 70,
                    range: [63, 70]
                  },
                  start: 63,
                  end: 71,
                  range: [63, 71]
                }
              ],
              start: 16,
              end: 73,
              range: [16, 73]
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'g19',
              start: 10,
              end: 13,
              range: [10, 13]
            },
            start: 0,
            end: 73,
            range: [0, 73]
          }
        ],
        start: 0,
        end: 73,
        range: [0, 73]
      }
    ],
    [
      'function* g8() { for (var x = 0; x < 4; x++) { yield x; } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ForStatement',
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'x',
                            start: 53,
                            end: 54,
                            range: [53, 54]
                          },
                          delegate: false,
                          start: 47,
                          end: 54,
                          range: [47, 54]
                        },
                        start: 47,
                        end: 55,
                        range: [47, 55]
                      }
                    ],
                    start: 45,
                    end: 57,
                    range: [45, 57]
                  },
                  init: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: {
                          type: 'Literal',
                          value: 0,
                          start: 30,
                          end: 31,
                          range: [30, 31]
                        },
                        id: {
                          type: 'Identifier',
                          name: 'x',
                          start: 26,
                          end: 27,
                          range: [26, 27]
                        },
                        start: 26,
                        end: 31,
                        range: [26, 31]
                      }
                    ],
                    start: 22,
                    end: 31,
                    range: [22, 31]
                  },
                  test: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x',
                      start: 33,
                      end: 34,
                      range: [33, 34]
                    },
                    right: {
                      type: 'Literal',
                      value: 4,
                      start: 37,
                      end: 38,
                      range: [37, 38]
                    },
                    operator: '<',
                    start: 33,
                    end: 38,
                    range: [33, 38]
                  },
                  update: {
                    type: 'UpdateExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'x',
                      start: 40,
                      end: 41,
                      range: [40, 41]
                    },
                    operator: '++',
                    prefix: false,
                    start: 40,
                    end: 43,
                    range: [40, 43]
                  },
                  start: 17,
                  end: 57,
                  range: [17, 57]
                }
              ],
              start: 15,
              end: 59,
              range: [15, 59]
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'g8',
              start: 10,
              end: 12,
              range: [10, 12]
            },
            start: 0,
            end: 59,
            range: [0, 59]
          }
        ],
        start: 0,
        end: 59,
        range: [0, 59]
      }
    ],
    [
      'function *a(){yield void 0}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        range: [0, 27],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 27,
            range: [0, 27],
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'a'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 27,
              range: [13, 27],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 14,
                  end: 26,
                  range: [14, 26],
                  expression: {
                    type: 'YieldExpression',
                    start: 14,
                    end: 26,
                    range: [14, 26],
                    delegate: false,
                    argument: {
                      type: 'UnaryExpression',
                      start: 20,
                      end: 26,
                      range: [20, 26],
                      operator: 'void',
                      prefix: true,
                      argument: {
                        type: 'Literal',
                        start: 25,
                        end: 26,
                        range: [25, 26],
                        value: 0
                      }
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *a(){yield ~0}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 23,
            range: [0, 23],
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'a'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 23,
              range: [13, 23],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 14,
                  end: 22,
                  range: [14, 22],
                  expression: {
                    type: 'YieldExpression',
                    start: 14,
                    end: 22,
                    range: [14, 22],
                    delegate: false,
                    argument: {
                      type: 'UnaryExpression',
                      start: 20,
                      end: 22,
                      range: [20, 22],
                      operator: '~',
                      prefix: true,
                      argument: {
                        type: 'Literal',
                        start: 21,
                        end: 22,
                        range: [21, 22],
                        value: 0
                      }
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *a(){yield ++a;}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'UpdateExpression',
                      argument: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      operator: '++',
                      prefix: true
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function a(){({*[yield](){}})}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 30,
        range: [0, 30],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 30,
            range: [0, 30],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'a'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 12,
              end: 30,
              range: [12, 30],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 13,
                  end: 29,
                  range: [13, 29],
                  expression: {
                    type: 'ObjectExpression',
                    start: 14,
                    end: 28,
                    range: [14, 28],
                    properties: [
                      {
                        type: 'Property',
                        start: 15,
                        end: 27,
                        range: [15, 27],
                        method: true,
                        shorthand: false,
                        computed: true,
                        key: {
                          type: 'Identifier',
                          start: 17,
                          end: 22,
                          range: [17, 22],
                          name: 'yield'
                        },
                        kind: 'init',
                        value: {
                          type: 'FunctionExpression',
                          start: 23,
                          end: 27,
                          range: [23, 27],
                          id: null,
                          generator: true,
                          async: false,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            start: 25,
                            end: 27,
                            range: [25, 27],
                            body: []
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function*a(){yield\na}',
      Context.None,
      {
        body: [
          {
            async: false,
            body: {
              body: [
                {
                  expression: {
                    argument: null,
                    delegate: false,
                    type: 'YieldExpression'
                  },
                  type: 'ExpressionStatement'
                },
                {
                  expression: {
                    name: 'a',
                    type: 'Identifier'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },

            generator: true,
            id: {
              name: 'a',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '({yield} = x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '([x, {y: [yield]}]) => x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          value: {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'Identifier',
                                name: 'yield'
                              }
                            ]
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  ]
                }
              ],
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'function f(){ 5 + yield }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: 5
                    },
                    right: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    operator: '+'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '(x = yield = x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'yield'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '([yield])',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'yield'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([x, {y: [yield]}] = z)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        value: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'yield'
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      'function* a(b, c, d) { throw `_":${((yield* (6002.22)))}¿Z${null}UâÑ?${([])}â.Ò÷${((`m`))}`; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'b'
              },
              {
                type: 'Identifier',
                name: 'c'
              },
              {
                type: 'Identifier',
                name: 'd'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ThrowStatement',
                  argument: {
                    type: 'TemplateLiteral',
                    expressions: [
                      {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Literal',
                          value: 6002.22
                        },
                        delegate: true
                      },
                      {
                        type: 'Literal',
                        value: null
                      },
                      {
                        type: 'ArrayExpression',
                        elements: []
                      },
                      {
                        type: 'TemplateLiteral',
                        expressions: [],
                        quasis: [
                          {
                            type: 'TemplateElement',
                            value: {
                              cooked: 'm',
                              raw: 'm'
                            },
                            tail: true
                          }
                        ]
                      }
                    ],
                    quasis: [
                      {
                        type: 'TemplateElement',
                        value: {
                          cooked: '\u0005_":',
                          raw: '\u0005_":'
                        },
                        tail: false
                      },
                      {
                        type: 'TemplateElement',
                        value: {
                          cooked: '¿Z',
                          raw: '¿Z'
                        },
                        tail: false
                      },
                      {
                        type: 'TemplateElement',
                        value: {
                          cooked: 'UâÑ?',
                          raw: 'UâÑ?'
                        },
                        tail: false
                      },
                      {
                        type: 'TemplateElement',
                        value: {
                          cooked: 'â.Ò÷',
                          raw: 'â.Ò÷'
                        },
                        tail: false
                      },
                      {
                        type: 'TemplateElement',
                        value: {
                          cooked: '',
                          raw: ''
                        },
                        tail: true
                      }
                    ]
                  }
                }
              ]
            },

            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function* a(b, c, d) { "use strict"; if (yield null) for (const o in null()) throw this; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'b'
              },
              {
                type: 'Identifier',
                name: 'c'
              },
              {
                type: 'Identifier',
                name: 'd'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Literal',
                    value: 'use strict'
                  },
                  directive: 'use strict'
                },
                {
                  type: 'IfStatement',
                  test: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Literal',
                      value: null
                    },
                    delegate: false
                  },
                  consequent: {
                    type: 'ForInStatement',
                    body: {
                      type: 'ThrowStatement',
                      argument: {
                        type: 'ThisExpression'
                      }
                    },
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'const',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'o'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Literal',
                        value: null
                      },
                      arguments: []
                    }
                  },
                  alternate: null
                }
              ]
            },

            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      '([x, {y: [yield]}])',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'ArrayExpression',
              start: 1,
              end: 18,
              range: [1, 18],
              elements: [
                {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  range: [2, 3],
                  name: 'x'
                },
                {
                  type: 'ObjectExpression',
                  start: 5,
                  end: 17,
                  range: [5, 17],
                  properties: [
                    {
                      type: 'Property',
                      start: 6,
                      end: 16,
                      range: [6, 16],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'y'
                      },
                      value: {
                        type: 'ArrayExpression',
                        start: 9,
                        end: 16,
                        range: [9, 16],
                        elements: [
                          {
                            type: 'Identifier',
                            start: 10,
                            end: 15,
                            range: [10, 15],
                            name: 'yield'
                          }
                        ]
                      },
                      kind: 'init'
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],

    [
      'function *f(){ delete ("x"[(yield)]) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Literal',
                        value: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'YieldExpression',
                        argument: null,
                        delegate: false
                      }
                    },
                    prefix: true
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f() { (yield x ** y) }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 32,
        range: [0, 32],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 32,
            range: [0, 32],
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'f'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 14,
              end: 32,
              range: [14, 32],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 16,
                  end: 30,
                  range: [16, 30],
                  expression: {
                    type: 'YieldExpression',
                    start: 17,
                    end: 29,
                    range: [17, 29],
                    delegate: false,
                    argument: {
                      type: 'BinaryExpression',
                      start: 23,
                      end: 29,
                      range: [23, 29],
                      left: {
                        type: 'Identifier',
                        start: 23,
                        end: 24,
                        range: [23, 24],
                        name: 'x'
                      },
                      operator: '**',
                      right: {
                        type: 'Identifier',
                        start: 28,
                        end: 29,
                        range: [28, 29],
                        name: 'y'
                      }
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *f(){ delete (((((foo(yield)))))).bar }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: [
                          {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    },
                    prefix: true
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f({x: x}) { function f({x: yield}) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    method: false,
                    shorthand: false
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          kind: 'init',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          computed: false,
                          value: {
                            type: 'Identifier',
                            name: 'yield'
                          },
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '({ *g1() {   return {x: yield}  }})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'g1'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'Identifier',
                                  name: 'x'
                                },
                                value: {
                                  type: 'YieldExpression',
                                  argument: null,
                                  delegate: false
                                },
                                kind: 'init',
                                computed: false,
                                method: false,
                                shorthand: false
                              }
                            ]
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({ *g1() {   (yield 1)  }})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'g1'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Literal',
                              value: 1
                            },
                            delegate: false
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({ *g1() {   (yield)  }})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'g1'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function *f() { 1 ? 1 : yield ; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ConditionalExpression',
                    test: {
                      type: 'Literal',
                      value: 1
                    },
                    consequent: {
                      type: 'Literal',
                      value: 1
                    },
                    alternate: {
                      type: 'YieldExpression',
                      argument: null,
                      delegate: false
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f() { 1 ? yield : 1 ; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ConditionalExpression',
                    test: {
                      type: 'Literal',
                      value: 1
                    },
                    consequent: {
                      type: 'YieldExpression',
                      argument: null,
                      delegate: false
                    },
                    alternate: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f() { 1 ? 2 : yield 3; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ConditionalExpression',
                    test: {
                      type: 'Literal',
                      value: 1
                    },
                    consequent: {
                      type: 'Literal',
                      value: 2
                    },
                    alternate: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 3
                      },
                      delegate: false
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f() { 1 ? yield 2 : 3; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ConditionalExpression',
                    test: {
                      type: 'Literal',
                      value: 1
                    },
                    consequent: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 2
                      },
                      delegate: false
                    },
                    alternate: {
                      type: 'Literal',
                      value: 3
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f() { yield 1 ? 2 : 3; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'ConditionalExpression',
                      test: {
                        type: 'Literal',
                        value: 1
                      },
                      consequent: {
                        type: 'Literal',
                        value: 2
                      },
                      alternate: {
                        type: 'Literal',
                        value: 3
                      }
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f() { (yield 1) ? yield 2 : yield 3; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ConditionalExpression',
                    test: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 1
                      },
                      delegate: false
                    },
                    consequent: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 2
                      },
                      delegate: false
                    },
                    alternate: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 3
                      },
                      delegate: false
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '({  * yield() {}  })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function *g() { [...yield]; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'SpreadElement',
                        argument: {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Literal',
                      value: 10
                    },
                    delegate: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Literal',
                      value: 20
                    },
                    delegate: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Literal',
                      value: 30
                    },
                    delegate: false
                  }
                },
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                },
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'c'
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      arguments: []
                    },
                    delegate: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        arguments: []
                      },
                      right: {
                        type: 'YieldExpression',
                        argument: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'c'
                          },
                          arguments: []
                        },
                        delegate: false
                      },
                      operator: '+'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf1'
            }
          }
        ]
      }
    ],
    [
      'function f(){  return function(x=yield) {};  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){  x = {foo(a=yield){}}  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          value: {
                            type: 'FunctionExpression',
                            params: [
                              {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'a'
                                },
                                right: {
                                  type: 'Identifier',
                                  name: 'yield'
                                }
                              }
                            ],
                            body: {
                              type: 'BlockStatement',
                              body: []
                            },
                            async: false,
                            generator: false,
                            id: null
                          },
                          kind: 'init',
                          computed: false,
                          method: true,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){  return function(x=yield) {};  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){  return (x=yield) => x;  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        }
                      }
                    ],
                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){  return function(x=yield) {};  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *g() { function f(x = x + yield) {}; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        operator: '+'
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                },
                {
                  type: 'EmptyStatement'
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() { function f(x = yield) {}; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                },
                {
                  type: 'EmptyStatement'
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'async (x = z = yield)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'async'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'yield'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function *f(){ async (yield) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'YieldExpression',
                        argument: null,
                        delegate: false
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'async (x = z = yield) => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'yield'
                    }
                  }
                }
              ],
              async: true,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'async (x = (yield)) => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              ],
              async: true,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'async (x = yield)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'async'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async (yield)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'async'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'yield'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async (x = yield) => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              ],
              async: true,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'function *f({x: x}) { function f({x: yield}) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    method: false,
                    shorthand: false
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          kind: 'init',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          computed: false,
                          value: {
                            type: 'Identifier',
                            name: 'yield'
                          },
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *g(){ async (x = [yield y]) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'YieldExpression',
                              argument: {
                                type: 'Identifier',
                                name: 'y'
                              },
                              delegate: false
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g(){ async (x = [yield]) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'YieldExpression',
                              argument: null,
                              delegate: false
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g(){ async (x = {[yield y]: 1}) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'YieldExpression',
                                argument: {
                                  type: 'Identifier',
                                  name: 'y'
                                },
                                delegate: false
                              },
                              value: {
                                type: 'Literal',
                                value: 1
                              },
                              kind: 'init',
                              computed: true,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g(){ async (x = {[yield]: 1}) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'YieldExpression',
                                argument: null,
                                delegate: false
                              },
                              value: {
                                type: 'Literal',
                                value: 1
                              },
                              kind: 'init',
                              computed: true,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() { async (x = x + foo(a, yield y)); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            arguments: [
                              {
                                type: 'Identifier',
                                name: 'a'
                              },
                              {
                                type: 'YieldExpression',
                                argument: {
                                  type: 'Identifier',
                                  name: 'y'
                                },
                                delegate: false
                              }
                            ]
                          },
                          operator: '+'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() { async (x = yield); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      '{ (x = [yield]) => z }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'yield'
                          }
                        ]
                      }
                    }
                  ],
                  async: false,
                  expression: true
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ (x = [yield]) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    ]
                  }
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ (x = {[yield]: 1}) => z }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            value: {
                              type: 'Literal',
                              value: 1
                            },
                            kind: 'init',
                            computed: true,
                            method: false,
                            shorthand: false
                          }
                        ]
                      }
                    }
                  ],
                  async: false,
                  expression: true
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ (x = {[yield]: 1}) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        value: {
                          type: 'Literal',
                          value: 1
                        },
                        kind: 'init',
                        computed: true,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ (x = x + yield) => x; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        operator: '+'
                      }
                    }
                  ],
                  async: false,
                  expression: true
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ (x = x + yield); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    operator: '+'
                  }
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ (x = yield); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ (x = yield) => {}; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ],
                  async: false,
                  expression: false
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ yield => {}; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'yield'
                    }
                  ],
                  async: false,
                  expression: false
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ yield = {}; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'function *g(){ (x = [yield y]) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          delegate: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],

    [
      'function *g(){ (x = [yield]) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],

    [
      'function* f(){ call(yield x); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'call'
                    },
                    arguments: [
                      {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        delegate: false
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *g(){ (x = {[yield y]: 1}) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            delegate: false
                          },
                          value: {
                            type: 'Literal',
                            value: 1
                          },
                          kind: 'init',
                          computed: true,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],

    [
      'function *g(){ (x = {[yield]: 1}) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          },
                          value: {
                            type: 'Literal',
                            value: 1
                          },
                          kind: 'init',
                          computed: true,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() { function f(x = yield) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() { function f(x = x + yield) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        operator: '+'
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function f(){ (x=yield) => x;  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        }
                      }
                    ],
                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){ a = function(x=yield) {};  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    operator: '=',
                    right: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'yield'
                          }
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    }
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){  x = {foo(a=yield){}}  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          value: {
                            type: 'FunctionExpression',
                            params: [
                              {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'a'
                                },
                                right: {
                                  type: 'Identifier',
                                  name: 'yield'
                                }
                              }
                            ],
                            body: {
                              type: 'BlockStatement',
                              body: []
                            },
                            async: false,
                            generator: false,
                            id: null
                          },
                          kind: 'init',
                          computed: false,
                          method: true,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *g() { [...yield]; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'SpreadElement',
                        argument: {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      '({  * yield() {}  })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function *f() { (yield 1) ? yield 2 : yield 3; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ConditionalExpression',
                    test: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 1
                      },
                      delegate: false
                    },
                    consequent: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 2
                      },
                      delegate: false
                    },
                    alternate: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 3
                      },
                      delegate: false
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],

    [
      'function *g(){ x + f(yield f); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'f'
                      },
                      arguments: [
                        {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'f'
                          },
                          delegate: false
                        }
                      ]
                    },
                    operator: '+'
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'async function *f(x){ yield x; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'x'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: true,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *a() { (b) => b * yield; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'yield'
                      },
                      operator: '*'
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'b'
                      }
                    ],
                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function *g() { (x = x + foo(a, yield y)); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: [
                          {
                            type: 'Identifier',
                            name: 'a'
                          },
                          {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            delegate: false
                          }
                        ]
                      },
                      operator: '+'
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      '([x, {y: [yield]}] = z)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        value: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'yield'
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '([x, {y: [yield]}])',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      value: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'yield'
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function foo() { function *g() { yield ~x } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'UnaryExpression',
                            operator: '~',
                            argument: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            prefix: true
                          },
                          delegate: false
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'g'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function foo() { function a(){({*[yield](){}})} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'yield'
                              },
                              value: {
                                type: 'FunctionExpression',
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: []
                                },
                                async: false,
                                generator: true,
                                id: null
                              },
                              kind: 'init',
                              computed: true,
                              method: true,
                              shorthand: false
                            }
                          ]
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function foo() { function *a(){yield ++a;} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            operator: '++',
                            prefix: true
                          },
                          delegate: false
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function foo() { ({ get yield() { 1 } }) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        value: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'Literal',
                                  value: 1
                                }
                              }
                            ]
                          },
                          async: false,
                          generator: false,
                          id: null
                        },
                        kind: 'get',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function foo() {++yield; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    operator: '++',
                    prefix: true
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function foo() { function foo(yield) { } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [
                    {
                      type: 'Identifier',
                      name: 'yield'
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      '(function* f(){ yield })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      argument: null,
                      delegate: false
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function* f(){ yield x + y })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        operator: '+'
                      },
                      delegate: false
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      'function foo() { function *a(){yield delete 1}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'UnaryExpression',
                            operator: 'delete',
                            argument: {
                              type: 'Literal',
                              value: 1
                            },
                            prefix: true
                          },
                          delegate: false
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function foo() { function*a(){yield*a} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          delegate: true
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function foo() { function * gen() { (yield) ? yield : yield } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'ConditionalExpression',
                          test: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          },
                          consequent: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          },
                          alternate: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          }
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'gen'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],

    [
      'function* f(){ yield; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: null,
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '(function* f(){ yield x; })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      delegate: false
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function* f(){ yield x + y; })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        operator: '+'
                      },
                      delegate: false
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function* f(){ call(yield); })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'call'
                      },
                      arguments: [
                        {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        }
                      ]
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function* f(){ call(yield x + y); })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'call'
                      },
                      arguments: [
                        {
                          type: 'YieldExpression',
                          argument: {
                            type: 'BinaryExpression',
                            left: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            right: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            operator: '+'
                          },
                          delegate: false
                        }
                      ]
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f(){ 5 + yield })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Literal',
                        value: 5
                      },
                      right: {
                        type: 'Identifier',
                        name: 'yield'
                      },
                      operator: '+'
                    }
                  }
                ]
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function f(){ call(yield); })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'call'
                      },
                      arguments: [
                        {
                          type: 'Identifier',
                          name: 'yield'
                        }
                      ]
                    }
                  }
                ]
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      '(function* g() { x = yield 3; })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      operator: '=',
                      right: {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Literal',
                          value: 3
                        },
                        delegate: false
                      }
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'g'
              }
            }
          }
        ]
      }
    ],
    [
      '(function* g(x) { yield x = 3; })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'Literal',
                          value: 3
                        }
                      },
                      delegate: false
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'g'
              }
            }
          }
        ]
      }
    ],
    [
      '(function* g(x) { yield x = yield 3; })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Literal',
                            value: 3
                          },
                          delegate: false
                        }
                      },
                      delegate: false
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'g'
              }
            }
          }
        ]
      }
    ],
    [
      'async function *g() { (x = y = yield z) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      operator: '=',
                      right: {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        delegate: false
                      }
                    }
                  }
                }
              ]
            },
            async: true,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'async function *g() { (x = yield); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'YieldExpression',
                      argument: null,
                      delegate: false
                    }
                  }
                }
              ]
            },
            async: true,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      '(x = x + yield);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'yield'
                },
                operator: '+'
              }
            }
          }
        ]
      }
    ],
    [
      '(x = x + yield) => x;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    operator: '+'
                  }
                }
              ],
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '(x = {[yield]: 1})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    value: {
                      type: 'Literal',
                      value: 1
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(function *g(){ async (x = {[yield]: 1}) })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'async'
                      },
                      arguments: [
                        {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          operator: '=',
                          right: {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'YieldExpression',
                                  argument: null,
                                  delegate: false
                                },
                                value: {
                                  type: 'Literal',
                                  value: 1
                                },
                                kind: 'init',
                                computed: true,
                                method: false,
                                shorthand: false
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'g'
              }
            }
          }
        ]
      }
    ],
    [
      '(function *g(){ async (x = {[yield y]: 1}) })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'async'
                      },
                      arguments: [
                        {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          operator: '=',
                          right: {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'YieldExpression',
                                  argument: {
                                    type: 'Identifier',
                                    name: 'y'
                                  },
                                  delegate: false
                                },
                                value: {
                                  type: 'Literal',
                                  value: 1
                                },
                                kind: 'init',
                                computed: true,
                                method: false,
                                shorthand: false
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'g'
              }
            }
          }
        ]
      }
    ],
    [
      '(function *g(){ async (x = [yield y]) })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'async'
                      },
                      arguments: [
                        {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          operator: '=',
                          right: {
                            type: 'ArrayExpression',
                            elements: [
                              {
                                type: 'YieldExpression',
                                argument: {
                                  type: 'Identifier',
                                  name: 'y'
                                },
                                delegate: false
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'g'
              }
            }
          }
        ]
      }
    ],
    [
      'async (x = yield) => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              ],
              async: true,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'async (yield)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'async'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'yield'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async (x = yield)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'async'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async (x = (yield)) => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              ],
              async: true,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'async (x = z = yield) => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'yield'
                    }
                  }
                }
              ],
              async: true,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'async (x = z = yield)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'async'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'yield'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(function *f(){ async (x = yield) })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'async'
                      },
                      arguments: [
                        {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          operator: '=',
                          right: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],

    [
      '1,2,3',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Literal',
                  value: 2
                },
                {
                  type: 'Literal',
                  value: 3
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'yield',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'yield'
            }
          }
        ]
      }
    ],
    [
      'yield: foo  => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'yield'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'foo'
                  }
                ],
                async: false,
                expression: false
              }
            }
          }
        ]
      }
    ],
    [
      'yield  => {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'yield'
                }
              ],
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    // yield => yield => foo
    [
      'yield => yield ? foo : bar',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'yield'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'foo'
                },
                alternate: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'yield'
                }
              ],
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'await: yield',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'await'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'yield'
              }
            }
          }
        ]
      }
    ],
    [
      'function *foo() { () => {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    params: [],
                    async: false,
                    expression: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function foo() { function *b() {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],

    [
      'function foo() { function * gen() { yield * a; return } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          delegate: true
                        }
                      },
                      {
                        type: 'ReturnStatement',
                        argument: null
                      }
                    ]
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'gen'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function *foo() { function b() {} function *b() {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],

    [
      'function foo() { function * gen() { yield yield a; } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            delegate: false
                          },
                          delegate: false
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'gen'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'yield: foo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'yield'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'try { } catch (yield) { }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'yield'
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'var foo = yield = 1;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  operator: '=',
                  right: {
                    type: 'Literal',
                    value: 1
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'yield * 2;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'yield'
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '*'
            }
          }
        ]
      }
    ],
    [
      'yield: 34',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'yield'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Literal',
                value: 34
              }
            }
          }
        ]
      }
    ],
    [
      'function yield(yield) { yield: yield (yield + yield(0)); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'yield'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'LabeledStatement',
                  label: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  body: {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'yield'
                      },
                      arguments: [
                        {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'yield'
                          },
                          right: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            arguments: [
                              {
                                type: 'Literal',
                                value: 0
                              }
                            ]
                          },
                          operator: '+'
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'yield'
            }
          }
        ]
      }
    ],
    [
      'yield(100)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'yield'
              },
              arguments: [
                {
                  type: 'Literal',
                  value: 100
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'yield[100]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'yield'
              },
              computed: true,
              property: {
                type: 'Literal',
                value: 100
              }
            }
          }
        ]
      }
    ],
    [
      'function* gf() { yield "foo"; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'var o = { *gf() { switch (1) { case yield: break; } } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'gf'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'SwitchStatement',
                              discriminant: {
                                type: 'Literal',
                                value: 1
                              },
                              cases: [
                                {
                                  type: 'SwitchCase',
                                  test: {
                                    type: 'YieldExpression',
                                    argument: null,
                                    delegate: false
                                  },
                                  consequent: [
                                    {
                                      type: 'BreakStatement',
                                      label: null
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        async: false,
                        generator: true,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'o'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'function * yield() { }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 22,
            range: [0, 22],
            id: {
              type: 'Identifier',
              start: 11,
              end: 16,
              range: [11, 16],
              name: 'yield'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 19,
              end: 22,
              range: [19, 22],
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '++yield;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'yield'
              },
              operator: '++',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'function * gen() { yield a; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gen'
            }
          }
        ]
      }
    ],
    [
      'function * gen() { yield * a; return }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 38,
        range: [0, 38],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 38,
            range: [0, 38],
            id: {
              type: 'Identifier',
              start: 11,
              end: 14,
              range: [11, 14],
              name: 'gen'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 17,
              end: 38,
              range: [17, 38],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 19,
                  end: 29,
                  range: [19, 29],
                  expression: {
                    type: 'YieldExpression',
                    start: 19,
                    end: 28,
                    range: [19, 28],
                    delegate: true,
                    argument: {
                      type: 'Identifier',
                      start: 27,
                      end: 28,
                      range: [27, 28],
                      name: 'a'
                    }
                  }
                },
                {
                  type: 'ReturnStatement',
                  start: 30,
                  end: 36,
                  range: [30, 36],
                  argument: null
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *a(){yield delete 0}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'UnaryExpression',
                      operator: 'delete',
                      argument: {
                        type: 'Literal',
                        value: 0
                      },
                      prefix: true
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function *a(){({get b(){yield}})}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        value: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'Identifier',
                                  name: 'yield'
                                }
                              }
                            ]
                          },
                          async: false,
                          generator: false,
                          id: null
                        },
                        kind: 'get',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function *a(){yield ++a;}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'UpdateExpression',
                      argument: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      operator: '++',
                      prefix: true
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function * gen() { (yield * 3) + (yield * 4); }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 3
                      },
                      delegate: true
                    },
                    right: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 4
                      },
                      delegate: true
                    },
                    operator: '+'
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gen'
            }
          }
        ]
      }
    ],
    [
      '(function * () { x = class extends (yield) {} });',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      operator: '=',
                      right: {
                        type: 'ClassExpression',
                        id: null,
                        superClass: {
                          type: 'YieldExpression',
                          argument: null,
                          delegate: false
                        },
                        body: {
                          type: 'ClassBody',
                          body: []
                        }
                      }
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: null
            }
          }
        ]
      }
    ],
    [
      '(function * () { yield * 1; return 37; yield * "icefapper"; });',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 1
                      },
                      delegate: true
                    }
                  },
                  {
                    type: 'ReturnStatement',
                    argument: {
                      type: 'Literal',
                      value: 37
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 'icefapper'
                      },
                      delegate: true
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: null
            }
          }
        ]
      }
    ],
    [
      '(function * () { ({ [yield]: x } = { }) });',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'YieldExpression',
                              argument: null,
                              delegate: false
                            },
                            value: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            kind: 'init',
                            computed: true,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      operator: '=',
                      right: {
                        type: 'ObjectExpression',
                        properties: []
                      }
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: null
            }
          }
        ]
      }
    ],
    [
      'function *g() { yield ~x }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'UnaryExpression',
                      operator: '~',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      prefix: true
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() { yield class x {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'ClassExpression',
                      id: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      superClass: null,
                      body: {
                        type: 'ClassBody',
                        body: []
                      }
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() { yield yield }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'YieldExpression',
                      argument: null,
                      delegate: false
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function* g() { exprValue = yield * {}; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'exprValue'
                    },
                    operator: '=',
                    right: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'ObjectExpression',
                        properties: []
                      },
                      delegate: true
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function* g5() { (yield 1) ? yield 2 : yield 3; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ConditionalExpression',
                    test: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 1
                      },
                      delegate: false
                    },
                    consequent: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 2
                      },
                      delegate: false
                    },
                    alternate: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 3
                      },
                      delegate: false
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g5'
            }
          }
        ]
      }
    ],
    [
      'function f() { var yield = 10; var o = { yield }; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: 10
                      },
                      id: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ]
                },
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'o'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f() { class C { yield() { } } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'C'
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        kind: 'method',
                        static: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        value: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: []
                          },
                          async: false,
                          generator: false,
                          id: null
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '+function yield() {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '+',
              argument: {
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'yield'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      `function *f1() {
      function g() {
        return yield / 1;
      }
    }`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'yield'
                          },
                          right: {
                            type: 'Literal',
                            value: 1
                          },
                          operator: '/'
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'g'
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f1'
            }
          }
        ]
      }
    ],
    [
      `function* fn() {
      () => yield;
      () => { yield };
    } `,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    params: [],
                    async: false,
                    expression: true
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'Identifier',
                            name: 'yield'
                          }
                        }
                      ]
                    },
                    params: [],
                    async: false,
                    expression: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'fn'
            }
          }
        ]
      }
    ],
    [
      'function* f(){ () => yield; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    params: [],
                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *foo() { function b() {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function fn(x = yield* yield) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  operator: '*'
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'fn'
            }
          }
        ]
      }
    ],
    [
      'function * gen() { (yield * a) + (yield * b);; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      delegate: true
                    },
                    right: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      delegate: true
                    },
                    operator: '+'
                  }
                },
                {
                  type: 'EmptyStatement'
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gen'
            }
          }
        ]
      }
    ],
    [
      'function * gen() { yield, yield }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'YieldExpression',
                        argument: null,
                        delegate: false
                      },
                      {
                        type: 'YieldExpression',
                        argument: null,
                        delegate: false
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gen'
            }
          }
        ]
      }
    ],
    [
      'function fn(x = yield* yield) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'yield'
                  },
                  operator: '*'
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'fn'
            }
          }
        ]
      }
    ],
    [
      'function* a(){({[yield]:a}=0)}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          },
                          value: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          kind: 'init',
                          computed: true,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 0
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function* a(){yield a}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function* g(){(class extends (yield) {});}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ClassExpression',
                    id: null,
                    superClass: {
                      type: 'YieldExpression',
                      argument: null,
                      delegate: false
                    },
                    body: {
                      type: 'ClassBody',
                      body: []
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function* a(){(class {[yield](){}})};',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ClassExpression',
                    id: null,
                    superClass: null,
                    body: {
                      type: 'ClassBody',
                      body: [
                        {
                          type: 'MethodDefinition',
                          kind: 'method',
                          static: false,
                          computed: true,
                          key: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          },
                          value: {
                            type: 'FunctionExpression',
                            params: [],
                            body: {
                              type: 'BlockStatement',
                              body: []
                            },
                            async: false,
                            generator: false,
                            id: null
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          },
          {
            type: 'EmptyStatement'
          }
        ]
      }
    ],
    [
      'function * gen() { yield /* comment */ }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: null,
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gen'
            }
          }
        ]
      }
    ],
    [
      'function* g1() { (yield 1) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Literal',
                      value: 1
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g1'
            }
          }
        ]
      }
    ],
    [
      'function* g2() { [yield 1] }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Literal',
                          value: 1
                        },
                        delegate: false
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g2'
            }
          }
        ]
      }
    ],
    [
      'function* a() { yield; function b({} = c) {} (d) => { }  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: null,
                    delegate: false
                  }
                },
                {
                  type: 'FunctionDeclaration',
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ObjectPattern',
                        properties: []
                      },
                      right: {
                        type: 'Identifier',
                        name: 'c'
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'd'
                      }
                    ],
                    async: false,
                    expression: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function* g4() { yield 1, yield 2; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Literal',
                          value: 1
                        },
                        delegate: false
                      },
                      {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Literal',
                          value: 2
                        },
                        delegate: false
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g4'
            }
          }
        ]
      }
    ],
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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'a'
              },
              {
                type: 'Identifier',
                name: 'b'
              },
              {
                type: 'Identifier',
                name: 'c'
              },
              {
                type: 'Identifier',
                name: 'd'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'arguments'
                      },
                      computed: true,
                      property: {
                        type: 'Literal',
                        value: 0
                      }
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 32
                    }
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'arguments'
                      },
                      computed: true,
                      property: {
                        type: 'Literal',
                        value: 1
                      }
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 54
                    }
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'arguments'
                      },
                      computed: true,
                      property: {
                        type: 'Literal',
                        value: 2
                      }
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 333
                    }
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    delegate: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    delegate: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'c'
                    },
                    delegate: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function f() { function* yield() { } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: true,

                  id: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f() { var o = { *yield() { } } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            value: {
                              type: 'FunctionExpression',
                              params: [],
                              body: {
                                type: 'BlockStatement',
                                body: []
                              },
                              async: false,
                              generator: true,

                              id: null
                            },
                            kind: 'init',
                            computed: false,
                            method: true,
                            shorthand: false
                          }
                        ]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'o'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f() { var yield = 10; var o = { yield }; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: 10
                      },
                      id: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ]
                },
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'o'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f() { class C { yield() { } } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 40,
        range: [0, 40],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 40,
            range: [0, 40],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 40,
              range: [13, 40],
              body: [
                {
                  type: 'ClassDeclaration',
                  start: 15,
                  end: 38,
                  range: [15, 38],
                  id: {
                    type: 'Identifier',
                    start: 21,
                    end: 22,
                    range: [21, 22],
                    name: 'C'
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    start: 23,
                    end: 38,
                    range: [23, 38],
                    body: [
                      {
                        type: 'MethodDefinition',
                        start: 25,
                        end: 36,
                        range: [25, 36],
                        kind: 'method',
                        static: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 25,
                          end: 30,
                          range: [25, 30],
                          name: 'yield'
                        },
                        value: {
                          type: 'FunctionExpression',
                          start: 30,
                          end: 36,
                          range: [30, 36],
                          id: null,
                          generator: false,
                          async: false,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            start: 33,
                            end: 36,
                            range: [33, 36],
                            body: []
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f() { let yield; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: null,
                      id: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f() { const yield = 10; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: 10
                      },
                      id: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { var o = { yield: 10 } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            value: {
                              type: 'Literal',
                              value: 10
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'o'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function *g() { yield {...(x,y),}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'SequenceExpression',
                            expressions: [
                              {
                                type: 'Identifier',
                                name: 'x'
                              },
                              {
                                type: 'Identifier',
                                name: 'y'
                              }
                            ]
                          }
                        }
                      ]
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() {yield {     ...yield yield,    };}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'YieldExpression',
                              argument: null,
                              delegate: false
                            },
                            delegate: false
                          }
                        }
                      ]
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() {x={     ...yield yield,    };}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'YieldExpression',
                              argument: null,
                              delegate: false
                            },
                            delegate: false
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() {x={     ...yield x,    };}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            delegate: false
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() {x={     ...yield,    };}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() {x={     ...yield yield    };}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'YieldExpression',
                              argument: null,
                              delegate: false
                            },
                            delegate: false
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      'function *g() {yield {     ...yield yield    };}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'YieldExpression',
                              argument: null,
                              delegate: false
                            },
                            delegate: false
                          }
                        }
                      ]
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      '({ *g1() {   return {x: yield}  }})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'g1'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'Identifier',
                                  name: 'x'
                                },
                                value: {
                                  type: 'YieldExpression',
                                  argument: null,
                                  delegate: false
                                },
                                kind: 'init',
                                computed: false,
                                method: false,
                                shorthand: false
                              }
                            ]
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function *f(){  class x extends (yield y){}  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  superClass: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    delegate: false
                  },
                  body: {
                    type: 'ClassBody',
                    body: []
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){  class x{[yield foo](a){}}  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        kind: 'method',
                        static: false,
                        computed: true,
                        key: {
                          type: 'YieldExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          delegate: false
                        },
                        value: {
                          type: 'FunctionExpression',
                          params: [
                            {
                              type: 'Identifier',
                              name: 'a'
                            }
                          ],
                          body: {
                            type: 'BlockStatement',
                            body: []
                          },
                          async: false,
                          generator: false,
                          id: null
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { var a = yield; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'YieldExpression',
                        argument: null,
                        delegate: false
                      },
                      id: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { foo[yield]; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    property: {
                      type: 'YieldExpression',
                      argument: null,
                      delegate: false
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { yield, 10; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'YieldExpression',
                        argument: null,
                        delegate: false
                      },
                      {
                        type: 'Literal',
                        value: 10
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { switch (1) { case yield: break; } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'SwitchStatement',
                  discriminant: {
                    type: 'Literal',
                    value: 1
                  },
                  cases: [
                    {
                      type: 'SwitchCase',
                      test: {
                        type: 'YieldExpression',
                        argument: null,
                        delegate: false
                      },
                      consequent: [
                        {
                          type: 'BreakStatement',
                          label: null
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'var gfe = function* () { switch (1) { case yield: break; } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'SwitchStatement',
                        discriminant: {
                          type: 'Literal',
                          value: 1
                        },
                        cases: [
                          {
                            type: 'SwitchCase',
                            test: {
                              type: 'YieldExpression',
                              argument: null,
                              delegate: false
                            },
                            consequent: [
                              {
                                type: 'BreakStatement',
                                label: null
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  async: false,
                  generator: true,

                  id: null
                },
                id: {
                  type: 'Identifier',
                  name: 'gfe'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var o = { *gf() { switch (1) { case yield: break; } } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'gf'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'SwitchStatement',
                              discriminant: {
                                type: 'Literal',
                                value: 1
                              },
                              cases: [
                                {
                                  type: 'SwitchCase',
                                  test: {
                                    type: 'YieldExpression',
                                    argument: null,
                                    delegate: false
                                  },
                                  consequent: [
                                    {
                                      type: 'BreakStatement',
                                      label: null
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        async: false,
                        generator: true,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'o'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'class C { *gf() { switch (1) { case yield: break; } } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'C'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'gf'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'SwitchStatement',
                          discriminant: {
                            type: 'Literal',
                            value: 1
                          },
                          cases: [
                            {
                              type: 'SwitchCase',
                              test: {
                                type: 'YieldExpression',
                                argument: null,
                                delegate: false
                              },
                              consequent: [
                                {
                                  type: 'BreakStatement',
                                  label: null
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    async: false,
                    generator: true,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function* gf() { var a = yield "foo"; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Literal',
                          value: 'foo'
                        },
                        delegate: false
                      },
                      id: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { foo[yield "foo"]; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    property: {
                      type: 'YieldExpression',
                      argument: {
                        type: 'Literal',
                        value: 'foo'
                      },
                      delegate: false
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { switch (1) { case yield "foo": break; } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'SwitchStatement',
                  discriminant: {
                    type: 'Literal',
                    value: 1
                  },
                  cases: [
                    {
                      type: 'SwitchCase',
                      test: {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Literal',
                          value: 'foo'
                        },
                        delegate: false
                      },
                      consequent: [
                        {
                          type: 'BreakStatement',
                          label: null
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      "function* gf() { yield* 'foo'; }",
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    delegate: true
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      "function* gf() { var a = yield* 'foo'; }",
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Literal',
                          value: 'foo'
                        },
                        delegate: true
                      },
                      id: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      "class C { *gf() { switch (1) { case yield* 'foo': break; } } }",
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 62,
        range: [0, 62],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 62,
            range: [0, 62],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'C'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 62,
              range: [8, 62],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 10,
                  end: 60,
                  range: [10, 60],
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 11,
                    end: 13,
                    range: [11, 13],
                    name: 'gf'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 13,
                    end: 60,
                    range: [13, 60],
                    id: null,
                    generator: true,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 16,
                      end: 60,
                      range: [16, 60],
                      body: [
                        {
                          type: 'SwitchStatement',
                          start: 18,
                          end: 58,
                          range: [18, 58],
                          discriminant: {
                            type: 'Literal',
                            start: 26,
                            end: 27,
                            range: [26, 27],
                            value: 1
                          },
                          cases: [
                            {
                              type: 'SwitchCase',
                              start: 31,
                              end: 56,
                              range: [31, 56],
                              consequent: [
                                {
                                  type: 'BreakStatement',
                                  start: 50,
                                  end: 56,
                                  range: [50, 56],
                                  label: null
                                }
                              ],
                              test: {
                                type: 'YieldExpression',
                                start: 36,
                                end: 48,
                                range: [36, 48],
                                delegate: true,
                                argument: {
                                  type: 'Literal',
                                  start: 43,
                                  end: 48,
                                  range: [43, 48],
                                  value: 'foo'
                                }
                              }
                            }
                          ]
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function* gf() { var fe = function yield() { } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,

                        id: {
                          type: 'Identifier',
                          name: 'yield'
                        }
                      },
                      id: {
                        type: 'Identifier',
                        name: 'fe'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { var o = { yield: 10 } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            value: {
                              type: 'Literal',
                              value: 10
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'o'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { var o = { yield() { } } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            value: {
                              type: 'FunctionExpression',
                              params: [],
                              body: {
                                type: 'BlockStatement',
                                body: []
                              },
                              async: false,
                              generator: false,
                              id: null
                            },
                            kind: 'init',
                            computed: false,
                            method: true,
                            shorthand: false
                          }
                        ]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'o'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function* gf() { class C { *yield() { } } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'C'
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        kind: 'method',
                        static: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        value: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: []
                          },
                          async: false,
                          generator: true,
                          id: null
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
    [
      'function f() { const yield = 10; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: 10
                      },
                      id: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f() { var o = { yield: 10 } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            value: {
                              type: 'Literal',
                              value: 10
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'o'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f() { class C { *yield() { } } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'C'
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        kind: 'method',
                        static: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        value: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: []
                          },
                          async: false,
                          generator: true,
                          id: null
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    // ['function* gf() {for(var a = yield in {});}', Context.None, {}],
    [
      'function* gf() { var o = { *yield() { } } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'yield'
                            },
                            value: {
                              type: 'FunctionExpression',
                              params: [],
                              body: {
                                type: 'BlockStatement',
                                body: []
                              },
                              async: false,
                              generator: true,
                              id: null
                            },
                            kind: 'init',
                            computed: false,
                            method: true,
                            shorthand: false
                          }
                        ]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'o'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'gf'
            }
          }
        ]
      }
    ],
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
      {
        type: 'Program',
        start: 0,
        end: 514,
        range: [0, 514],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 359,
            range: [0, 359],
            id: {
              type: 'Identifier',
              start: 10,
              end: 23,
              range: [10, 23],
              name: 'testGenerator'
            },
            generator: true,
            async: false,
            params: [
              {
                type: 'Identifier',
                start: 24,
                end: 28,
                range: [24, 28],
                name: 'arg1'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 30,
              end: 359,
              range: [30, 359],
              body: [
                {
                  type: 'VariableDeclaration',
                  start: 40,
                  end: 52,
                  range: [40, 52],
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      start: 44,
                      end: 51,
                      range: [44, 51],
                      id: {
                        type: 'Identifier',
                        start: 44,
                        end: 45,
                        range: [44, 45],
                        name: 'i'
                      },
                      init: {
                        type: 'Literal',
                        start: 48,
                        end: 51,
                        range: [48, 51],
                        value: 100,
                        raw: '100'
                      }
                    }
                  ],
                  kind: 'var'
                },
                {
                  type: 'VariableDeclaration',
                  start: 61,
                  end: 74,
                  range: [61, 74],
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      start: 65,
                      end: 73,
                      range: [65, 73],
                      id: {
                        type: 'Identifier',
                        start: 65,
                        end: 66,
                        range: [65, 66],
                        name: 'j'
                      },
                      init: {
                        type: 'Literal',
                        start: 69,
                        end: 73,
                        range: [69, 73],
                        value: 1000,
                        raw: '1000'
                      }
                    }
                  ],
                  kind: 'var'
                },
                {
                  type: 'VariableDeclaration',
                  start: 83,
                  end: 97,
                  range: [83, 97],
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      start: 87,
                      end: 96,
                      range: [87, 96],
                      id: {
                        type: 'Identifier',
                        start: 87,
                        end: 88,
                        range: [87, 88],
                        name: 'k'
                      },
                      init: {
                        type: 'Literal',
                        start: 91,
                        end: 96,
                        range: [91, 96],
                        value: 10000,
                        raw: '10000'
                      }
                    }
                  ],
                  kind: 'var'
                },
                {
                  type: 'ExpressionStatement',
                  start: 106,
                  end: 161,
                  range: [106, 161],
                  expression: {
                    type: 'YieldExpression',
                    start: 106,
                    end: 160,
                    range: [106, 160],
                    delegate: false,
                    argument: {
                      type: 'ObjectExpression',
                      start: 112,
                      end: 160,
                      range: [112, 160],
                      properties: [
                        {
                          type: 'Property',
                          start: 114,
                          end: 126,
                          range: [114, 126],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 114,
                            end: 118,
                            range: [114, 118],
                            name: 'arg1'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 120,
                            end: 126,
                            range: [120, 126],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 120,
                              end: 124,
                              range: [120, 124],
                              name: 'arg1'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 128,
                          end: 134,
                          range: [128, 134],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 128,
                            end: 129,
                            range: [128, 129],
                            name: 'i'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 131,
                            end: 134,
                            range: [131, 134],
                            operator: '++',
                            prefix: true,
                            argument: {
                              type: 'Identifier',
                              start: 133,
                              end: 134,
                              range: [133, 134],
                              name: 'i'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 136,
                          end: 142,
                          range: [136, 142],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 136,
                            end: 137,
                            range: [136, 137],
                            name: 'j'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 139,
                            end: 142,
                            range: [139, 142],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 139,
                              end: 140,
                              range: [139, 140],
                              name: 'j'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 144,
                          end: 150,
                          range: [144, 150],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 144,
                            end: 145,
                            range: [144, 145],
                            name: 'k'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 147,
                            end: 150,
                            range: [147, 150],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 147,
                              end: 148,
                              range: [147, 148],
                              name: 'k'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 152,
                          end: 158,
                          range: [152, 158],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 152,
                            end: 153,
                            range: [152, 153],
                            name: 'p'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 155,
                            end: 158,
                            range: [155, 158],
                            operator: '++',
                            prefix: true,
                            argument: {
                              type: 'Identifier',
                              start: 157,
                              end: 158,
                              range: [157, 158],
                              name: 'p'
                            }
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  }
                },
                {
                  type: 'ExpressionStatement',
                  start: 170,
                  end: 225,
                  range: [170, 225],
                  expression: {
                    type: 'YieldExpression',
                    start: 170,
                    end: 224,
                    range: [170, 224],
                    delegate: false,
                    argument: {
                      type: 'ObjectExpression',
                      start: 176,
                      end: 224,
                      range: [176, 224],
                      properties: [
                        {
                          type: 'Property',
                          start: 178,
                          end: 190,
                          range: [178, 190],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 178,
                            end: 182,
                            range: [178, 182],
                            name: 'arg1'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 184,
                            end: 190,
                            range: [184, 190],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 184,
                              end: 188,
                              range: [184, 188],
                              name: 'arg1'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 192,
                          end: 198,
                          range: [192, 198],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 192,
                            end: 193,
                            range: [192, 193],
                            name: 'i'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 195,
                            end: 198,
                            range: [195, 198],
                            operator: '++',
                            prefix: true,
                            argument: {
                              type: 'Identifier',
                              start: 197,
                              end: 198,
                              range: [197, 198],
                              name: 'i'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 200,
                          end: 206,
                          range: [200, 206],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 200,
                            end: 201,
                            range: [200, 201],
                            name: 'j'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 203,
                            end: 206,
                            range: [203, 206],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 203,
                              end: 204,
                              range: [203, 204],
                              name: 'j'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 208,
                          end: 214,
                          range: [208, 214],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 208,
                            end: 209,
                            range: [208, 209],
                            name: 'k'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 211,
                            end: 214,
                            range: [211, 214],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 211,
                              end: 212,
                              range: [211, 212],
                              name: 'k'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 216,
                          end: 222,
                          range: [216, 222],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 216,
                            end: 217,
                            range: [216, 217],
                            name: 'p'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 219,
                            end: 222,
                            range: [219, 222],
                            operator: '++',
                            prefix: true,
                            argument: {
                              type: 'Identifier',
                              start: 221,
                              end: 222,
                              range: [221, 222],
                              name: 'p'
                            }
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  }
                },
                {
                  type: 'ExpressionStatement',
                  start: 234,
                  end: 289,
                  range: [234, 289],
                  expression: {
                    type: 'YieldExpression',
                    start: 234,
                    end: 288,
                    range: [234, 288],
                    delegate: false,
                    argument: {
                      type: 'ObjectExpression',
                      start: 240,
                      end: 288,
                      range: [240, 288],
                      properties: [
                        {
                          type: 'Property',
                          start: 242,
                          end: 254,
                          range: [242, 254],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 242,
                            end: 246,
                            range: [242, 246],
                            name: 'arg1'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 248,
                            end: 254,
                            range: [248, 254],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 248,
                              end: 252,
                              range: [248, 252],
                              name: 'arg1'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 256,
                          end: 262,
                          range: [256, 262],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 256,
                            end: 257,
                            range: [256, 257],
                            name: 'i'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 259,
                            end: 262,
                            range: [259, 262],
                            operator: '++',
                            prefix: true,
                            argument: {
                              type: 'Identifier',
                              start: 261,
                              end: 262,
                              range: [261, 262],
                              name: 'i'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 264,
                          end: 270,
                          range: [264, 270],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 264,
                            end: 265,
                            range: [264, 265],
                            name: 'j'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 267,
                            end: 270,
                            range: [267, 270],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 267,
                              end: 268,
                              range: [267, 268],
                              name: 'j'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 272,
                          end: 278,
                          range: [272, 278],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 272,
                            end: 273,
                            range: [272, 273],
                            name: 'k'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 275,
                            end: 278,
                            range: [275, 278],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 275,
                              end: 276,
                              range: [275, 276],
                              name: 'k'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 280,
                          end: 286,
                          range: [280, 286],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 280,
                            end: 281,
                            range: [280, 281],
                            name: 'p'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 283,
                            end: 286,
                            range: [283, 286],
                            operator: '++',
                            prefix: true,
                            argument: {
                              type: 'Identifier',
                              start: 285,
                              end: 286,
                              range: [285, 286],
                              name: 'p'
                            }
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  }
                },
                {
                  type: 'ExpressionStatement',
                  start: 298,
                  end: 353,
                  range: [298, 353],
                  expression: {
                    type: 'YieldExpression',
                    start: 298,
                    end: 352,
                    range: [298, 352],
                    delegate: false,
                    argument: {
                      type: 'ObjectExpression',
                      start: 304,
                      end: 352,
                      range: [304, 352],
                      properties: [
                        {
                          type: 'Property',
                          start: 306,
                          end: 318,
                          range: [306, 318],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 306,
                            end: 310,
                            range: [306, 310],
                            name: 'arg1'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 312,
                            end: 318,
                            range: [312, 318],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 312,
                              end: 316,
                              range: [312, 316],
                              name: 'arg1'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 320,
                          end: 326,
                          range: [320, 326],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 320,
                            end: 321,
                            range: [320, 321],
                            name: 'i'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 323,
                            end: 326,
                            range: [323, 326],
                            operator: '++',
                            prefix: true,
                            argument: {
                              type: 'Identifier',
                              start: 325,
                              end: 326,
                              range: [325, 326],
                              name: 'i'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 328,
                          end: 334,
                          range: [328, 334],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 328,
                            end: 329,
                            range: [328, 329],
                            name: 'j'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 331,
                            end: 334,
                            range: [331, 334],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 331,
                              end: 332,
                              range: [331, 332],
                              name: 'j'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 336,
                          end: 342,
                          range: [336, 342],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 336,
                            end: 337,
                            range: [336, 337],
                            name: 'k'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 339,
                            end: 342,
                            range: [339, 342],
                            operator: '++',
                            prefix: false,
                            argument: {
                              type: 'Identifier',
                              start: 339,
                              end: 340,
                              range: [339, 340],
                              name: 'k'
                            }
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 344,
                          end: 350,
                          range: [344, 350],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 344,
                            end: 345,
                            range: [344, 345],
                            name: 'p'
                          },
                          value: {
                            type: 'UpdateExpression',
                            start: 347,
                            end: 350,
                            range: [347, 350],
                            operator: '++',
                            prefix: true,
                            argument: {
                              type: 'Identifier',
                              start: 349,
                              end: 350,
                              range: [349, 350],
                              name: 'p'
                            }
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            type: 'VariableDeclaration',
            start: 365,
            end: 393,
            range: [365, 393],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 369,
                end: 392,
                range: [369, 392],
                id: {
                  type: 'Identifier',
                  start: 369,
                  end: 372,
                  range: [369, 372],
                  name: 'gen'
                },
                init: {
                  type: 'CallExpression',
                  start: 375,
                  end: 392,
                  range: [375, 392],
                  callee: {
                    type: 'Identifier',
                    start: 375,
                    end: 388,
                    range: [375, 388],
                    name: 'testGenerator'
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      start: 389,
                      end: 391,
                      range: [389, 391],
                      value: 10,
                      raw: '10'
                    }
                  ]
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'FunctionDeclaration',
            start: 399,
            end: 514,
            range: [399, 514],
            id: {
              type: 'Identifier',
              start: 408,
              end: 416,
              range: [408, 416],
              name: 'yieldOne'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 419,
              end: 514,
              range: [419, 514],
              body: [
                {
                  type: 'VariableDeclaration',
                  start: 429,
                  end: 449,
                  range: [429, 449],
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      start: 433,
                      end: 448,
                      range: [433, 448],
                      id: {
                        type: 'Identifier',
                        start: 433,
                        end: 435,
                        range: [433, 435],
                        name: 'v1'
                      },
                      init: {
                        type: 'CallExpression',
                        start: 438,
                        end: 448,
                        range: [438, 448],
                        callee: {
                          type: 'MemberExpression',
                          start: 438,
                          end: 446,
                          range: [438, 446],
                          object: {
                            type: 'Identifier',
                            start: 438,
                            end: 441,
                            range: [438, 441],
                            name: 'gen'
                          },
                          property: {
                            type: 'Identifier',
                            start: 442,
                            end: 446,
                            range: [442, 446],
                            name: 'next'
                          },
                          computed: false
                        },
                        arguments: []
                      }
                    }
                  ],
                  kind: 'var'
                },
                {
                  type: 'VariableDeclaration',
                  start: 458,
                  end: 508,
                  range: [458, 508],
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      start: 462,
                      end: 507,
                      range: [462, 507],
                      id: {
                        type: 'Identifier',
                        start: 462,
                        end: 465,
                        range: [462, 465],
                        name: 'val'
                      },
                      init: {
                        type: 'CallExpression',
                        start: 468,
                        end: 507,
                        range: [468, 507],
                        callee: {
                          type: 'MemberExpression',
                          start: 468,
                          end: 482,
                          range: [468, 482],
                          object: {
                            type: 'Identifier',
                            start: 468,
                            end: 472,
                            range: [468, 472],
                            name: 'JSON'
                          },
                          property: {
                            type: 'Identifier',
                            start: 473,
                            end: 482,
                            range: [473, 482],
                            name: 'stringify'
                          },
                          computed: false
                        },
                        arguments: [
                          {
                            type: 'MemberExpression',
                            start: 483,
                            end: 491,
                            range: [483, 491],
                            object: {
                              type: 'Identifier',
                              start: 483,
                              end: 485,
                              range: [483, 485],
                              name: 'v1'
                            },
                            property: {
                              type: 'Identifier',
                              start: 486,
                              end: 491,
                              range: [486, 491],
                              name: 'value'
                            },
                            computed: false
                          },
                          {
                            type: 'Identifier',
                            start: 493,
                            end: 502,
                            range: [493, 502],
                            name: 'undefined'
                          },
                          {
                            type: 'Literal',
                            start: 504,
                            end: 506,
                            range: [504, 506],
                            value: '',
                            raw: "''"
                          }
                        ]
                      }
                    }
                  ],
                  kind: 'var'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
