import { describe } from 'vitest';
import { fail } from '../../test-utils';

describe('Expressions - Global code', () => {
  fail('Expressions - Yield (fail)', [
    '() => { super.foo; };',
    '() => { super(); };',
    'super.property;',
    'return;',
    'export default null;',
    '() => { new.target; };',
  ]);
});
