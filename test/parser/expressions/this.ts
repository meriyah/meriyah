import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Expressions - This', () => {
  pass('Expressions - This (pass)', [
    [
      'this._global = _global;',
      Context.None,
      
    ],
    [
      'this\n/foo;',
      Context.None,
      
    ],
    [
      'this\n/foo/g;',
      Context.None,
      
    ],
  ]);
});
