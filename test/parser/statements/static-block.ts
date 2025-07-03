import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Next - Class static initialization block', () => {
  fail('Next - Class static initialization block (fail)', [
    'class A { static { super() } }',
    'class A {}; class B extends A { static { super() } }',
    'class A { static async {} }',
    'class A { async static {} }',
    'async function t() { class A { static { await 0 } } }',
  ]);

  for (const arg of [
    outdent`
      class C {
        static {
          async function t() { return await 0; }
        }
      }
    `,
    outdent`
      class C {
        static {
          (async function t() { return await 0; })
        }
      }
    `,
    outdent`
      class C {
        static {
          (async function() { return await 0; })
        }
      }
    `,
    outdent`
      class C {
        static {
          (async t => { return await 0; })
        }
      }
    `,
    outdent`
      class C {
        static {
          (async (t) => { return await 0; })
        }
      }
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
  }

  pass('Next - Class static initialization block (pass)', [
    { code: 'class A { static {} }', options: { loc: true, ranges: true } },
    'class A { static { this.a } }',
    'class A {}; class B extends A { static { super.a } }',
  ]);
});
