import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';

describe('Miscellaneous - Simple parameter list', () => {
  for (const text of [
    // Array destructuring.
    '[]',
    '[]',
    '[a]',
    'x, [a]',
    '[a, b]',
    '[a], x',
    // Array destructuring with defaults.
    '[a = 0]',
    '[a, b] = []',
    'x, [a = 0]',
    '[a = 0], x',

    // Array destructuring with rest binding identifier.
    '[...a]',
    'x, [...a]',
    '[...a], x',
    // Array destructuring with rest binding pattern.
    '[...[a]]',
    'x, [...[a]]',
    '[...[a]], x',

    // Object destructuring.
    '{}',
    '{p: o}',
    'x, {p: o}',
    '{p: o}, x',

    // Object destructuring with defaults.
    '{p: o = 0}',
    'x, {p: o = 0}',
    '{p: o = 0}, x',
    '{ p, o } = {}',
    // Object destructuring with shorthand identifier form.
    '{o}',
    'x, {o}',
    '{o}, x',

    // Object destructuring with CoverInitName.
    '{o = 0}',
    'x, {o = 0}',
    '{o = 0}, x',

    // Object setter
    '{ set f(a = 1) }, x',

    // Default parameter.
    'd = 0',
    'x, d = 0',
    'd = 0, x',

    // Rest parameter.
    '...rest',
    'x, ...rest',
    '...x',

    // Rest parameter with array destructuring.
    '...[]',
    '...[a]',
    'x, ...[]',
    'x, ...[a]',
    // Rest parameter with object destructuring.
    '...{}',
    '...{p: o}',
    'x, ...{}',
    'x, ...{p: o}',

    // All non-simple cases combined.
    'x, d = 123, [a], {p: 0}, ...rest',

    // Misc
    'a, {b}',
    '{}',
    '[]',
    '[{}]',
    '{a}',
    'a, {b}',
    'a, b, {c, d, e}',
    'a = b',
    'a, b, c = 1',
    '...args',
    'a, b, ...rest',
    '[a, b, ...rest]',
    '{ a = {} }',
    '{ a } = { b: true }',
  ]) {
    it(`function f(${text}) { "use strict"; }`, () => {
      t.throws(() => {
        parseSource(`function f(${text}) { "use strict"; }`);
      });
    });

    it(`function f(${text}) { "use strict"; }`, () => {
      t.throws(() => {
        parseSource(`function f(${text}) { "use strict"; }`, { sourceType: 'module' });
      });
    });

    it(`async function *f(${text}) { "use strict"; }`, () => {
      t.throws(() => {
        parseSource(`async function *f(${text}) { "use strict"; }`);
      });
    });

    it(`async function *f(${text}) { "use strict"; }`, () => {
      t.throws(() => {
        parseSource(`async function *f(${text}) { "use strict"; }`, { sourceType: 'module' });
      });
    });

    it(`void function(${text}) { "use strict"; };`, () => {
      t.throws(() => {
        parseSource(`void function(${text}) { "use strict"; };`);
      });
    });

    it(`function* g(${text}) { "use strict"; }`, () => {
      t.throws(() => {
        parseSource(`function* g(${text}) { "use strict"; }`);
      });
    });

    it(`async function g(${text}) { "use strict"; }`, () => {
      t.throws(() => {
        parseSource(`async function g(${text}) { "use strict"; }`);
      });
    });

    it(`(class { constructor(${text}) { "use strict"; } });`, () => {
      t.throws(() => {
        parseSource(`(class { constructor(${text}) { "use strict"; } });`);
      });
    });

    it(`(${text}) => { "use strict"; };`, () => {
      t.throws(() => {
        parseSource(`(${text}) => { "use strict"; };`);
      });
    });

    it(`(${text}) => { "use strict"; };`, () => {
      t.throws(() => {
        parseSource(`(${text}) => { "use strict"; };`, { webcompat: true });
      });
    });

    it(`async (${text}) => { "use strict"; };`, () => {
      t.throws(() => {
        parseSource(`async (${text}) => { "use strict"; };`);
      });
    });

    it(`async (${text}) => { "use strict"; };`, () => {
      t.throws(() => {
        parseSource(`async (${text}) => { "use strict"; };`, { sourceType: 'module' });
      });
    });

    it(`({ get m(${text}) { "use strict"; } });`, () => {
      t.throws(() => {
        parseSource(`({ get m(${text}) { "use strict"; } });`);
      });
    });

    it(`({ async set m(${text}) { "use strict"; } });`, () => {
      t.throws(() => {
        parseSource(`({ async set m(${text}) { "use strict"; } });`);
      });
    });

    it(`({ async set m(${text}) { "use strict"; } });`, () => {
      t.throws(() => {
        parseSource(`({ async set m(${text}) { "use strict"; } });`, { webcompat: true });
      });
    });

    it(`({ set m(${text}) { "use strict"; } });`, () => {
      t.throws(() => {
        parseSource(`({ set m(${text}) { "use strict"; } });`);
      });
    });

    it(`class C { async m(${text}) { "use strict"; } }`, () => {
      t.throws(() => {
        parseSource(`class C { async m(${text}) { "use strict"; } }`);
      });
    });

    it(`class C { async m(${text}) { "use strict"; } }`, () => {
      t.throws(() => {
        parseSource(`class C { async m(${text}) { "use strict"; } }`, { sourceType: 'module' });
      });
    });

    it(`class C { *m(${text}) { "use strict"; } }`, () => {
      t.throws(() => {
        parseSource(`class C { *m(${text}) { "use strict"; } }`);
      });
    });

    it(`class C { *m(${text}) { "use strict"; } }`, () => {
      t.throws(() => {
        parseSource(`class C { *m(${text}) { "use strict"; } }`, { webcompat: true });
      });
    });
  }
});
