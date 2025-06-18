import { describe } from 'vitest';
import { pass } from '../../test-utils';

describe('Expressions - This', () => {
  pass('Expressions - This (pass)', ['this._global = _global;', 'this\n/foo;', 'this\n/foo/g;']);
});
