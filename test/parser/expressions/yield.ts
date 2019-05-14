import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Yield', () => {
  for (const arg of [
    'let g = function*() { try {yield 42} finally {yield 43; return 13} };',
    'let g = function*() { try {yield 42} finally {yield 43; 13} };',
    'let h = function*() { try {yield 42} finally {yield 43; return 13} };',
    'let g = function*() { yield 1; yield yield* h(); };',
    'let h = function*() { try {yield 42} finally {yield 43; 13} };',
    '{ function* inner() { yield 2; } function* g() { yield 1; return yield* inner(); } { let x = g(); } }',
    'function* foo() { yield 2; yield 3; yield 4 }',
    'function* foo() { yield 2; if (true) { yield 3 }; yield 4 }',
    'function* foo() { yield 2; if (true) { yield 3; yield 4 } }',
    'function* foo() { yield 2; if (false) { yield 3 }; yield 4 }',
    'countArgs(...(function*(){ yield 1; yield 2; yield 3; })())',
    'function* g5(l) { "use strict"; yield 1; for (let x in l) { yield x; } }',
    'function* g4() { var x = 10; yield 1; return x; }',
    ' function* g1(a, b, c) { yield 1; return [a, b, c]; }',
    'function* f2() { return {["a"]: yield} }',
    'bar(...(function*(){ yield 1; yield 2; yield 3; })());',
    '(function*() { yield* {} })().next()',
    '(function*() { yield* undefined })().next()',
    'function* g() { yield; }',
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
    }`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
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
    'yield\n*3',
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
    `({yield = 0}) => {};`
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
    '(function * () { yield * 1; return 37; yield * "icefapper"; });',
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
    ,
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
    ['function *a(){yield\n*a}', Context.None],
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
    ['function* f(){ yield\n/foo }', Context.None],
    //['function* f(){ yield\n/foo/ }', Context.None],
    // ['function* f(){ yield\n/foo/g }', Context.None],
    // ['yield\n/foo', Context.None],
    ['function *g() { yield = {}; }  ', Context.None],
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
    ['function *g() { (x = u + yield z) => {}; }', Context.None],
    ['function *g() { (x = x + yield); }', Context.None],
    ['function *g() { (x = x + yield y); }', Context.None],
    ['function *g() { (x = x + yield) => x; }', Context.None],
    ['function *g() { (x = x + yield y) => x; }', Context.None],
    ['function *g(){ (x = {[yield y]: 1}) => z }', Context.None],
    ['function *g(){ (x = {[yield]: 1}) => z }', Context.None],
    ['function *g(){ (x = {[yield y]: 1}) => z }', Context.None],
    ['(x = x) = x;', Context.None],
    ['{ (x = yield) = {}; }', Context.None],
    ['{ (x = y = yield z) => {}; }', Context.None],
    ['{ (x = y = yield z); }', Context.None],
    ['{ (x = u + yield z) => {}; }', Context.None],
    ['{ (x = x + yield y); }', Context.None],
    ['{ (x = x + yield y) => x; }', Context.None],
    ['{ (x = x + foo(a, yield y)); }', Context.None],
    ['{ (x = x + foo(a, yield y)) => x; }', Context.None],
    ['{ (x = {[yield y]: 1}) }', Context.None],
    ['{ (x = {[yield y]: 1}) => z }', Context.None],
    ['{ (x = [yield y]) }', Context.None],
    ['{ (x = [yield y]) => z }', Context.None],
    ['function *g() { async yield = {}; }', Context.None],
    ['function *g() { async (x = yield) = {}; }', Context.None],
    ['function *g() { async yield => {}; }', Context.None],
    ['function *g() { async (x = yield) => {}; }', Context.None],
    ['function *g() { async (x = y = yield z) => {}; }', Context.None],
    ['function *g() { async (x = x + yield y); }', Context.None],
    ['function *g() { async (x = u + yield z) => {}; }', Context.None],
    ['function *g() { async (x = x + yield); }', Context.None],
    ['function *g() { async (x = x + yield) => x; }', Context.None],
    ['function *g() { async (x = x + yield y) => x; }', Context.None],
    ['function *g() { async (x = x + foo(a, yield y)) => x; }', Context.None],
    ['function *g(){ async (x = {[yield]: 1}) => z }', Context.None],
    ['function *g(){ async (x = {[yield y]: 1}) => z }', Context.None],
    ['function *g(){ async (x = [yield]) => z }', Context.None],
    ['function *g(){ async (x = [yield y]) => z }', Context.None],
    ['function *f(yield){}', Context.None],
    ['async (yield x)', Context.None],
    ['async (x = yield y)', Context.None],
    ['function *f(){ async (x = yield) => {} }', Context.None],
    ['function *f(){ async (x = yield y) => {} }', Context.None],
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
    ['function* gf() { const yield = 10; }', Context.None]
  ]);

  pass('Expressions - Yield (pass)', [
    [
      'function *a(){yield void 0}',
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
                      operator: 'void',
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
            expression: false,
            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'function *a(){yield ~0}',
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
            expression: false,
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
            expression: false,
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
            expression: false,
            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
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
            expression: false,
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
              id: null,
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
            expression: false,
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
            expression: false,
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
                  }
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
            expression: false,
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
            expression: false,
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
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      operator: '**'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
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
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
                  expression: false,
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
                  expression: false,
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
                  expression: false,
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
            expression: false,
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
                    expression: false,
                    id: null
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
            expression: false,
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
                    expression: false,
                    id: null
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
                    id: null,
                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
                    expression: false,
                    id: null
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
                  expression: false,
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
            expression: false,
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
                  expression: false,
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
            expression: false,
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
            expression: false,
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
              id: null,
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
              id: null,
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
              id: null,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
                  id: null,
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
                  id: null,
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
                  id: null,
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
                  id: null,
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
                  id: null,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
                    id: null,
                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
                      expression: false,
                      id: null
                    }
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
                    id: null,
                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'g'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
            expression: false,
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
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
              expression: false,
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
              expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'gen'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
            expression: false,
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
              expression: false,
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
              expression: false,
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
              expression: false,
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
              expression: false,
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
              expression: false,
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
              expression: false,
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
              expression: false,
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
              expression: false,
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
              expression: false,
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
            expression: false,
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
            expression: false,
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
              id: null,
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
              expression: false,
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
              expression: false,
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
              expression: false,
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
              id: null,
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
              id: null,
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
              id: null,
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
              expression: false,
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
                id: null,
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
              id: null,
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
              id: null,
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
                    id: null,
                    async: false,
                    expression: false
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'gen'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
                  expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'gen'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
            expression: false,
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
            expression: false,
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
              body: []
            },
            async: false,
            generator: true,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'yield'
            }
          }
        ]
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
            expression: false,
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
            expression: false,
            id: {
              type: 'Identifier',
              name: 'gen'
            }
          }
        ]
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
              expression: false,
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
              expression: false,
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
              expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
                expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'g'
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
                    id: null,
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
                    id: null,
                    async: false,
                    expression: false
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
                    id: null,
                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
            id: {
              type: 'Identifier',
              name: 'g2'
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
            expression: false,
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
            expression: false,
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
                  expression: false,
                  id: {
                    type: 'Identifier',
                    name: 'yield'
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
                  expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
                                argument: {
                                  type: 'Literal',
                                  value: 'foo'
                                },
                                delegate: true
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
                        expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
    }
    `,
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
                name: 'arg1'
              }
            ],
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
                        value: 100
                      },
                      id: {
                        type: 'Identifier',
                        name: 'i'
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
                        type: 'Literal',
                        value: 1000
                      },
                      id: {
                        type: 'Identifier',
                        name: 'j'
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
                        type: 'Literal',
                        value: 10000
                      },
                      id: {
                        type: 'Identifier',
                        name: 'k'
                      }
                    }
                  ]
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'arg1'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'arg1'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'i'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'i'
                            },
                            operator: '++',
                            prefix: true
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'j'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'j'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'k'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'k'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'p'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'p'
                            },
                            operator: '++',
                            prefix: true
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    delegate: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'arg1'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'arg1'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'i'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'i'
                            },
                            operator: '++',
                            prefix: true
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'j'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'j'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'k'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'k'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'p'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'p'
                            },
                            operator: '++',
                            prefix: true
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    delegate: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'arg1'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'arg1'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'i'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'i'
                            },
                            operator: '++',
                            prefix: true
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'j'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'j'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'k'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'k'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'p'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'p'
                            },
                            operator: '++',
                            prefix: true
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    delegate: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'arg1'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'arg1'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'i'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'i'
                            },
                            operator: '++',
                            prefix: true
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'j'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'j'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'k'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'k'
                            },
                            operator: '++',
                            prefix: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'p'
                          },
                          value: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'p'
                            },
                            operator: '++',
                            prefix: true
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
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
            expression: false,
            id: {
              type: 'Identifier',
              name: 'testGenerator'
            }
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'testGenerator'
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      value: 10
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'gen'
                }
              }
            ]
          },
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
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'gen'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'next'
                          }
                        },
                        arguments: []
                      },
                      id: {
                        type: 'Identifier',
                        name: 'v1'
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
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'JSON'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'stringify'
                          }
                        },
                        arguments: [
                          {
                            type: 'MemberExpression',
                            object: {
                              type: 'Identifier',
                              name: 'v1'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'value'
                            }
                          },
                          {
                            type: 'Identifier',
                            name: 'undefined'
                          },
                          {
                            type: 'Literal',
                            value: ''
                          }
                        ]
                      },
                      id: {
                        type: 'Identifier',
                        name: 'val'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'yieldOne'
            }
          }
        ]
      }
    ]
  ]);
});
