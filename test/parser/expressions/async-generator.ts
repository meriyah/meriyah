import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

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
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true });
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
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
    outdent`
      var gen = async function *g() {
        yield [...yield];
      };
    `,
    outdent`
      var gen = async function *() {
        yield {
            ...yield yield,
            ...(function(arg) {
              var yield = arg;
              return {...yield};
            }(yield)),
            ...yield,
          }
      };
    `,
    outdent`
      var gen = async function *g() {
        return (function(arg) {
            var yield = arg + 1;
            return yield;
          }(yield))
      };
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });
    it(`() => { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`() => { ${arg} }`);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg}}`);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg}}`, { next: true });
      });
    });
  }
  fail('Expressions - Async Generator (pass)', [
    '(async function*(a = super()) { });',
    '0, async function* g(...a,) {};',
    '(async function* yield() { });',
    '(async function* g() { var await; });',
    outdent`
      "use strict";
        async function *g() {
        return {
             ...(function() {
                var yield;
             }()),
          }
      };
    `,
    '(async function* g() { var yield; });',
    '(async function*(a = super()) { });',
    '(async function*() { } = 1);',
    '(async function *() { var await; })',
    '(async function*([...x, y] = [1, 2, 3]) {})',
    '(async function* h([...{ x } = []]) {})',
    '(async.foo6 => 1)',
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
    '(async function* yield() { });',
    '(async function* g() { var await; });',
    { code: '(async function* g() { void await; });', options: { sourceType: 'module' } },
    '(async function* g() { void yield; });',
    '0, async function* g(...x = []) {}',
    '(async function *foo([...{ x } = []])',
    '(async function *foo([...{ x } = []])',
    '(async function *foo([...{ x } = []])',
    '(async function *foo([...{ x } = []])',
  ]);

  pass('Expressions - Async Generator (pass)', [
    '(async function* h([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) { })',
    '(async function* h([fn = function () {}, xFn = function x() {}] = []) { })',
    '(async function* h([{ x, y, z } = { x: 44, y: 55, z: 66 }]) { })',
    '(async function *([{ x }]) { })',
    '(async function*({ w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined }) { })',
    '(async function *foo() { }.prototype)',
    '(async function *foo([...x] = 123) { })',
    '(async function *foo(x, y = x, z = y) { })',

    '(async function* h([]) { })',
  ]);
});
