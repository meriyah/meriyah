import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Expressions - Generators', () => {
  fail('Expressions - Generators (pass)', ['foo\n++', 'if (foo\n++);']);

  for (const arg of [
    'var yield;',
    'var foo, yield;',
    'try { } catch (yield) { }',
    'function yield() { }',
    '(function * yield() { })',
    'function * foo(yield) { }',
    '(function * foo(yield) { })',
    'yield = 1;',
    'var foo = yield = 1;',
    '++yield;',
    'yield++;',
    'yield *',
    '(yield *)',
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
    it(`function * icefapper() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`function * icefapper() {${arg}}`);
      });
    });

    it(`"use strict"; function * icefapper() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; function * icefapper() {${arg}}`);
      });
    });
  }

  const invalidSyntax = [
    'f = function*([...{ x } = []]) {}',
    'f = function*([...{ x } = []] = []) {}',
    'f = function*([...x = []] = []) {}',
    'f = function*([...x, y] = [1, 2, 3]) {}',
    'f = function*([...{ x }, y] = [1, 2, 3]) {}',
    'f = function*([...{ x } = []]) {}',
    outdent`
      var gen = function *g() {
        var yield;
      };
    `,
    'var g = function*() { yield 3 + yield 4; };',
    "'use strict'; (function *g() { ( x, y=yield ) => {} });",
    '(function *g() { ( x, y=yield ) => {} });',
    '"use strict"; (function *g() { ( x = class { [(yield, 1)]() { }  ) => {} });',
    'var g = function*(yield) {};',
    'var gen = function *() { void yield; };',
    'let gfe = function* yield() { }',
  ];

  for (const arg of invalidSyntax) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });
  }

  const validYieldInGenerator = [
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
    'yield 1; return',
    'yield * 1; return',
    'yield 1; return 37',
    'yield * 1; return 37',
    "yield 1; return 37; yield 'dead';",
    "yield * 1; return 37; yield * 'dead';",
    '({ yield: 1 })',
    '({ get yield() { } })',
    '({ [yield]: x } = { })',
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
    'yield\nfor (;;) {}',
    'x = class extends (yield) {}',
    'x = class extends f(yield) {}',
    'x = class extends (null, yield) { }',
    'x = class extends (a ? null : yield) { }',
  ];

  for (const arg of validYieldInGenerator) {
    it(`function * icefapper() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function * icefapper() {${arg}}`);
      });
    });

    it(`(function * icefapper() {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function * icefapper() {${arg}})`);
      });
    });

    it(`(function *() {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function *() {${arg}})`);
      });
    });
  }

  const validSyntax = [
    outdent`
      var gen = function *() {
        yield [...yield yield];
      };
    `,
    '(function* () { yield\nv })',
    outdent`
      var gen = function *() {
        yield [...yield];
      };
    `,
    '(function* () { yield *v });',
    '(function* () { fn(yield); });',
    '(function* () { yield; });',
    '(function* () { yield yield 10 });',
    '(function* () { yield });',
    '(function* () { yield v });',
    '(function* () { yield; });',
    outdent`
      var g1 = function*() { yield; };
      var g2 = function*() { yield 1; };
    `,
    outdent`
      var g = function*() {
        ({  yield: 1 });
      };
    `,
    outdent`
      var gen = function *() {
        yield {
            ...yield,
            y: 1,
            ...yield yield,
          };
      };
    `,
    '(function* () { yield *v });',
    'var gfe = function* () { switch (1) { case yield: break; } }',
    "var gfe = function* () { switch (1) { case yield* 'foo': break; } }",
    "var o = { *gf() { yield* 'foo'; } }",
    'f = function*([[,] = g()]) {}',
    'f = function*([[x, y, z] = [4, 5, 6]]) {}',
    'f = function*([[] = function() { return  function*() {}(); }()]) {}',
    'f = function*([[] = function() {}()]) {}',
    'f = function*([x = 23]) {}',
    'f = function*([...[x, y, z]]) {}',
    'f = function*([...x]) {}',
    'f = function*([[,] = g()] = []) {}',
    'f = function*([,]) {}',
    'var f = function*([...x]) {};',
    'f = function*([...{ 0: v, 1: w, 2: x, 3: y, length: z }]) {}',
    'f = function*([[...x] = function() { initCount += 1; }()] = [[2, 1, 3]]) {}',
    'f = function*([x = 23] = [,]) {}',
    'f = function*([{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]) {}',
    'f = function*({ w: [x, y, z] = [4, 5, 6] } = {}) {}',
    'f = function*({ x, } = { x: 23 }) {}',
    'f = function*({ x: y = 33 } = { }) {}',
    'f = function*({a, b, ...rest} = {x: 1, y: 2, a: 5, b: 3}) {}',
    'var f = function*({}) {};',
    'f = function*({ w: [x, y, z] = [4, 5, 6] }) {}',
    'f = function*({ x: y }) {}',
    'var f = function *(a) { yield a+1; return; };',
    outdent`
      var gen = function *g() {
        yield [...yield];
      };
    `,
    outdent`
      var gen = function *g() {
        yield {
            ...yield,
            y: 1,
            ...yield yield,
          };
      };
    `,
    outdent`
      var gen = function *g() {
        yield [...yield];
      };
    `,
    'ref = function*(a,) {};',
    outdent`
      var g1 = function*() { yield; };
      var g2 = function*() { yield 1; };
    `,
    'var g = function*() { yield yield 1; };',
    outdent`
      var gen = function *() {
        yield {
            ...yield,
            y: 1,
            ...yield yield,
          };
      };
    `,
    outdent`
      var g = function*() {
        yield *
        g2();
      };
      var g2 = function*() {};
    `,
  ];

  for (const arg of validSyntax) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
  }
});
