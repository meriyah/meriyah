import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Statements - Return', () => {
  fail('Commonjs (fail)', [
    'return',
    'new.target',
    // https://github.com/acornjs/acorn/issues/1376#issuecomment-2960924476
    { code: 'class X { static { return; } }', options: { sourceType: 'commonjs' } },
    // The following should be allowed in CommonJS
    // https://github.com/acornjs/acorn/issues/1376#issuecomment-2960396571
    { code: 'using foo = null', options: { sourceType: 'commonjs', next: true } },
  ]);

  pass('Commonjs (pass)', [
    { code: 'return', options: { sourceType: 'commonjs' } },
    { code: 'new.target', options: { sourceType: 'commonjs' } },
  ]);
});
