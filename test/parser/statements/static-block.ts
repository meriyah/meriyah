import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Next - Class static initialization block', () => {
  fail('Next - Class static initialization block (fail)', [
    ['class A { static { super() } }', Context.None],
    ['class A {}; class B extends A { static { super() } }', Context.None],
    ['class A { static async {} }', Context.None],
    ['class A { async static {} }', Context.None],
    ['async function t() { class A { static { await 0 } } }', Context.None],
  ]);

  for (const arg of [
    `class C {
      static {
        async function t() { return await 0; }
      }
    }`,
    `class C {
      static {
        (async function t() { return await 0; })
      }
    }`,
    `class C {
      static {
        (async function() { return await 0; })
      }
    }`,
    `class C {
      static {
        (async t => { return await 0; })
      }
    }`,
    `class C {
      static {
        (async (t) => { return await 0; })
      }
    }`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  pass('Next - Class static initialization block (pass)', [
    [`class A { static {} }`, Context.None],
    [`class A { static { this.a } }`, Context.None],
    [`class A {}; class B extends A { static { super.a } }`, Context.None],
  ]);
});
