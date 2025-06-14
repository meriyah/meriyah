import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';

import { parseSource } from '../../../src/parser';

describe('Expressions - Async Generator', () => {
  for (const arg of [
    '(async function *foo() { var await; });',
    '(async function *foo() { void await; });',
    '(async function *foo() { await: ; });',
    '(async function *foo(x = 1) {"use strict"})',
    '(async function *foo(foo) { super() })',
    '(async function *foo(foo) { super.prop });',
    '(async function *foo(foo = super()) { var bar; });',
    '(async function*([...x, y]) {})',
    '(async function*([...x, y] = [1, 2, 3]) {})',
    '(async function* h([...{ x } = []]) {})',
    '(async function* h([...{ x } = []] = []) {})',
    '(async function*(x = await 1) { });',
    '(async function*() { await: 1; });',
    '(async function *foo(...a,) {})',
    '(async function *foo([...[ x ] = []])',
    '(async function *foo([...{ x } = []]) {})',
    '(async function *foo([...{ x } = []] = []) {})',
    '(async function *foo([...x, y]) {})',
    '(async function *foo([...x = []] = []) {})',
    '(async function *foo(...a,) {})',
    '(async function *foo([...[x], y] = [1, 2, 3]) {})',
    '(async function *foo([...{ x }, y] = [1, 2, 3])',
    '(async function *foo([...{ x }, y])',
    '(async function *foo([...{ x } = []] = [])',
    '(async function *foo([...{ x } = []])',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    '(async function *foo() { }.prototype)',
    '(async function *foo(x, y = x, z = y) { })',
    '(async function *foo(x = y, y) { })',
    '(async function *foo(a, b = 39,) { })',
    '(async function *foo(a, b,) { })',
    '(async function *foo(_ = (function() {}())) { })',
    '(async function *([x = 23]) { })',
    '(async function *([{ x }]) { })',
    '(async function *(x = x) { })',
    '(async function*([...[...x]]) { })',
    '(async function *foo([...x] = 123) { })',
    '(async function *foo({ cls = class {}, xCls = class X {}, xCls2 = class { static name() {} } } = {}) {})',
    '(async function*({ w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] }) { })',
    '(async function*({ w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined }) { })',
    '(async function* h([[,] = g()]) { })',
    '(async function* g([[x]]) { })',
    '(async function* h([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) { })',
    '(async function* h([fn = function () {}, xFn = function x() {}]) { })',
    '(async function* h([{ x, y, z } = { x: 44, y: 55, z: 66 }]) { })',
    '(async function* h([]) { })',
    '(async function* h([...[,]]) { })',
    '(async function* g([...x]) { })',
    '(async function* h([fn = function () {}, xFn = function x() {}] = []) { })',
    '(async function* h([x] = []) { })',
    '(async function* h({} = null) { })',
    'var gen = async function *() { yield [...yield]; };',
    '(async function* h({a, b, ...rest} = {x: 1, y: 2, a: 5, b: 3}) { })',
    '(async function* h({ x, }) { })',
    '(async function* h({ w: [x, y, z] = [4, 5, 6] }) { })',
    '(async function*({}) { })',
    '(async function*({ x, }) { })',
    '(async function*({ x: y = 33 }) { })',
    `var gen = async function *g() {
      yield [...yield];
    };`,
    `var gen = async function *() {
      yield {
           ...yield yield,
           ...(function(arg) {
              var yield = arg;
              return {...yield};
           }(yield)),
           ...yield,
        }
    };`,
    `var gen = async function *g() {
      return (function(arg) {
          var yield = arg + 1;
          return yield;
        }(yield))
    };
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
    it(`() => { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`() => { ${arg} }`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg}}`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg}}`, undefined, Context.OptionsNext);
      });
    });
  }
  fail('Expressions - Async Generator (pass)', [
    ['(async function*(a = super()) { });', Context.None],
    ['0, async function* g(...a,) {};', Context.None],
    ['(async function* yield() { });', Context.None],
    ['(async function* g() { var await; });', Context.None],
    [
      `"use strict";
    async function *g() {
    return {
         ...(function() {
            var yield;
         }()),
      }
  };`,
      Context.None,
    ],
    ['(async function* g() { var yield; });', Context.None],
    ['(async function*(a = super()) { });', Context.None],
    ['(async function*() { } = 1);', Context.None],
    ['(async function *() { var await; })', Context.None],
    ['(async function*([...x, y] = [1, 2, 3]) {})', Context.None],
    ['(async function* h([...{ x } = []]) {})', Context.None],
    ['(async.foo6 => 1)', Context.None],
    ['(async function* h([...{ x } = []] = []) {})', Context.None],
    ['(async function*(x = await 1) { });', Context.None],
    ['(async function*() { await: 1; });', Context.None],
    ['(async function *foo(...a,) {})', Context.None],
    ['(async function *foo([...[ x ] = []])', Context.None],
    ['(async function *foo([...{ x } = []]) {})', Context.None],
    ['(async function *foo([...{ x } = []] = []) {})', Context.None],
    ['(async function *foo([...x, y]) {})', Context.None],
    ['(async function *foo([...x = []] = []) {})', Context.None],
    ['(async function *foo(...a,) {})', Context.None],
    ['(async function *foo([...[x], y] = [1, 2, 3]) {})', Context.None],
    ['(async function *foo([...{ x }, y] = [1, 2, 3])', Context.None],
    ['(async function *foo([...{ x }, y])', Context.None],
    ['(async function *foo([...{ x } = []] = [])', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None],
    ['(async function* yield() { });', Context.None],
    ['(async function* g() { var await; });', Context.None],
    ['(async function* g() { void await; });', Context.Module | Context.Strict],
    ['(async function* g() { void yield; });', Context.None],
    ['0, async function* g(...x = []) {}', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None],
  ]);

  pass('Expressions - Async Generator (pass)', [
    ['(async function* h([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) { })', Context.None],
    ['(async function* h([fn = function () {}, xFn = function x() {}] = []) { })', Context.None],
    ['(async function* h([{ x, y, z } = { x: 44, y: 55, z: 66 }]) { })', Context.None],
    ['(async function *([{ x }]) { })', Context.None],
    ['(async function*({ w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined }) { })', Context.None],
    ['(async function *foo() { }.prototype)', Context.None],
    ['(async function *foo([...x] = 123) { })', Context.None],
    ['(async function *foo(x, y = x, z = y) { })', Context.None],

    ['(async function* h([]) { })', Context.None],
  ]);
});
