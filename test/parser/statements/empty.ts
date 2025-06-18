import { describe } from 'vitest';
import { pass } from '../../test-utils';

describe('Statements - Empty', () => {
  pass('Statements - Empty (pass)', [{ code: ';;;;;;;;', options: { ranges: true } }]);
});
