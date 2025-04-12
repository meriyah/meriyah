import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import { describe } from 'bun:test';

describe('Expressions - Global code', () => {
  fail('Expressions - Yield (fail)', [
    ['() => { super.foo; };', Context.None],
    ['() => { super(); };', Context.None],
    ['super.property;', Context.None],
    ['return;', Context.None],
    ['export default null;', Context.None],
    ['() => { new.target; };', Context.None]
  ]);
});
