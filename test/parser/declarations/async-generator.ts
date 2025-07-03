import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Declarations - Async Generator', () => {
  for (const arg of [
    'yield 2;',
    'yield * 2;',
    'yield * \n 2;',
    'yield * \r 2;',
    'yield * \t 2;',
    'yield * \n\f\r 2;',
    'yield * \f\n\r 2;',
    'yield yield 1;',
    'yield * yield * 1;',
    'yield 3 + (yield 4);',
    'yield 3 + (yield 4) + 4;',
    'yield * 3 + (yield * 4);',
    '(yield * 3) + (yield * 4);',
    'yield 3; yield 4;',
    'yield * 3; yield * 4;',
    '(function (yield) { })',
    '(function yield() { })',
    '(function (await) { })',
    '(function await() { })',
    'yield { yield: 12 }',
    'yield /* comment */ { yield: 12 }',
    'x = class extends (await 10) {}',
    'x = class extends f(await 10) {}',
    'x = class extends (null, await 10) { }',
    'x = class extends (a ? null : await 10) { }',
    'yield * \n { yield: 12 }',
    'yield /* comment */ * \n { yield: 12 }',
    'yield 1; return',
    'yield 1; return;',
    'yield * 1; return',
    'yield * 1; return;',
    'yield 1; return 7',
    'yield * 1; return 7',
    "yield 1; return 7; yield 'foo';",
    "yield * 1; return 3; yield * 'foo';",
    '({ yield: 1 })',
    '({ get yield() { } })',
    '({ await: 1 })',
    '({ get await() { } })',
    '({ [yield]: x } = { })',
    '({ [await 1]: x } = { })',
    'yield',
    'yield\n',
    'yield /* comment */',
    'yield // comment\n',
    'yield // comment\n\r\f',
    '(yield)',
    '[yield]',
    '{yield}',
    'yield, yield',
    'yield; yield',
    'yield; yield; yield; yield;',
    '(yield) ? yield : yield',
    '(yield) \n ? yield : yield',
    'yield\nfor (;;) {}',
    'await 10',
    'await 10; return',
    'await 10; return 20',
    "await 10; return 20; yield 'foo'",
    'await (yield 10)',
    'await (  yield     10  ) ',
    'await (yield 10); return',
    'await (yield 10); return 80',
    "await (yield 10); return 50; yield 'foo'",
    'yield await 10',
    'yield await 10; return',
    'yield await 10; return;',
    'yield await 10; return 10',
    "yield await 10; return 10; yield 'foo'",
    'await /* comment */ 10',
    'await // comment\n 10',
    'yield await /* comment\n */ 10',
    'yield await // comment\n 10',
    'await (yield /* comment */)',
    'await (yield // comment\n)',
    'for await (x of xs);',
    'for await (let x of xs);',
    'await a; yield b;',
    'class A { async f() { for await (x of xs); } }',
  ]) {
    it(`async function * gen() { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * gen() { ${arg} }`);
      });
    });

    it(`(async function * () { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(async function * () { ${arg} })`);
      });
    });

    it(`(async function * () { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(async function * () { ${arg} })`, { webcompat: true });
      });
    });

    it(`(async function * gen() { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(async function * gen() { ${arg} })`);
      });
    });

    it(`({ async * gen () { ${arg} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ async * gen () { ${arg} } })`);
      });
    });

    it(`(async function * () {${arg} }) `, () => {
      t.doesNotThrow(() => {
        parseSource(`(async function * () {${arg} }) `);
      });
    });

    it(`({ async * gen () {${arg} } }) `, () => {
      t.doesNotThrow(() => {
        parseSource(`({ async * gen () {${arg} } }) `);
      });
    });

    it(`({ async * gen () {${arg} } }) `, () => {
      t.doesNotThrow(() => {
        parseSource(`({ async * gen () {${arg} } }) `, { webcompat: true });
      });
    });
  }

  for (const arg of [
    'var yield;',
    'var await;',
    'var foo, yield;',
    'var foo, await;',
    'try { } catch (yield) { }',
    'try { } catch (await) { }',
    'function yield() { }',
    '(async function * yield() { })',
    '(async function * await() { })',
    'async function * foo(yield) { }',
    '(async function * foo(yield) { })',
    'async function * foo(await) { }',
    '(async function * foo(await) { })',
    '(async function * foo(await) { })',
    'yield = 1;',
    'await = 1;',
    'var foo = yield = 1;',
    'var foo = await = 1;',
    '++yield;',
    'yield++;',
    'await++;',
    'yield *',
    '(yield *)',
    'yield 3 + yield 4;',
    'yield: 34',
    'yield ? 1 : 2',
    'yield / yield',
    '+ yield',
    '+ yield 3',
    'var [yield] = [42];',
    'var [await] = [42];',
    'var {foo: yield} = {a: 42};',
    'yield\n{yield: 42}',
    'yield /* comment */\n {yield: 42}',
    'yield //comment\n {yield: 42}',
    'var {foo: await} = {a: 42};',
    '[yield] = [42];',
    '[await] = [42];',
    '({a: yield} = {a: 42});',
    '({a: await} = {a: 42});',
    'var [yield 24] = [42];',
    'var [await 24] = [42];',
    'var {foo: yield 24} = {a: 42};',
    'var {foo: await 24} = {a: 42};',
    '[yield 24] = [42];',
    '[await 24] = [42];',
    '({a: yield 24} = {a: 42});',
    '({a: await 24} = {a: 42});',
    '({ await })',
    'yield --> comment ',
    '(yield --> comment)',
    'yield /* comment */ --> comment ',
    'class C extends yield { }',
    '[yield 24] = [42];',
    '[await 24] = [42];',
    '({a: yield 24} = {a: 42});',
    '({a: await 24} = {a: 42});',
    "for (yield 'x' in {});",
    "for (await 'x' in {});",
    "for (yield 'x' of {});",
    "for (await 'x' of {});",
    "for (yield 'x' in {} in {});",
    "for (await 'x' in {} in {});",
    "for (yield 'x' in {} of {});",
    "for (await 'x' in {} of {});",
    'class C extends yield { }',
    'class C extends await { }',
  ]) {
    it(`async function * gen() { ${arg} } `, () => {
      t.throws(() => {
        parseSource(`async function * gen() { ${arg} } `);
      });
    });

    it(`"use strict"; async function * gen() { ${arg} } `, () => {
      t.throws(() => {
        parseSource(`"use strict"; async function * gen() { ${arg} } `);
      });
    });

    it(`async function * gen() { ${arg} } `, () => {
      t.throws(() => {
        parseSource(`async function * gen() { ${arg} } `, { sourceType: 'module' });
      });
    });

    it(`async function * gen() { ${arg} } `, () => {
      t.throws(() => {
        parseSource(`async function * gen() { ${arg} } `, { sourceType: 'module' });
      });
    });

    it(`(async function * () {${arg} }) `, () => {
      t.throws(() => {
        parseSource(`(async function * () {${arg} }) `);
      });
    });

    it(`({ async * gen () {${arg} } }) `, () => {
      t.throws(() => {
        parseSource(`({ async * gen () {${arg} } }) `);
      });
    });
  }

  fail('Declarations - const (fail)', [
    { code: '({ yield })', options: { impliedStrict: true } },
    '({async\n    foo() { }})',
    String.raw`void \u0061sync function* f(){};`,
    'for ( ; false; ) async function* g() {}',
    'class A { async* f() { () => await a; } }',
    'class A { async* f() { () => yield a; } }',
    'class A { *async f() {} }',
    'obj = { *async f() {}',
    'obj = { *async* f() {}',
    'obj = { async* f() { () => await a; } }',
    'obj = { async* f() { () => yield a; } }',
    'f = async function*() { () => yield a; }',
    'f = async function*() { () => await a; }',
    'async function* f([...x = []]) {  }',
    'async function* f([...x, y]) {}',
    'async function* f([...{ x }, y]) {}',
    'async function* f([...[x], y]) {}',
    'f = async function*() { () => await a; }',
  ]);

  pass('Declarations - const (pass)', [
    'async function* f([[] = function() {}()]) { }',
    'async function* f([[x]]) {  }',
    {
      code: 'var gen = async function *() { yield { ...yield, y: 1, ...yield yield, }; };',
      options: { impliedStrict: true, ranges: true },
    },
    'async function* f([arrow = () => {}]) {  }',
    { code: 'async function* f([fn = function () {}, xFn = function x() {}]) {  }', options: { ranges: true } },
    { code: 'async function* f([{ x, y, z } = { x: 44, y: 55, z: 66 }]) {  }', options: { ranges: true } },
    { code: 'async function* f([{ x }]) {  }', options: { ranges: true } },
    { code: 'async function* f([ , , ...x]) {  }', options: { ranges: true } },
    'async function* f([arrow = () => {}] = []) {}',
    { code: 'async function* f([[x]] = [null]) {}', options: { ranges: true } },
    {
      code: 'async function* f([{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]) {}',
      options: { ranges: true, raw: true },
    },
    { code: 'async function* f({ fn = function () {}, xFn = function x() {} } = {}) {}', options: { ranges: true } },
    { code: 'async function* f({ x: y = 33 } = { }) {}', options: { ranges: true } },
    'async function* f({ x: y }) {}',
    { code: 'async function* f({ w: { x, y, z } = { x: 4, y: 5, z: 6 } }) {}', options: { ranges: true, raw: true } },
    { code: 'async function* f({...x}) {}', options: { ranges: true } },
    'async function* f({a, b, ...rest}) {}',
    'async function* f() { await a; yield b; }',
    'f = async function*() { await a; yield b; }',
    { code: 'obj = { async* f() { await a; yield b; } }', options: { ranges: true } },
    { code: 'class A { async* f() { await a; yield b; } }', options: { ranges: true } },
    { code: 'class A { static async* f() { await a; yield b; } }', options: { ranges: true } },
    'async function* x() {}',
    '(async function*() {})',
    'var gen = { async *method() {} }',
  ]);
});
