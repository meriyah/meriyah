import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';

import { parseSource } from '../../../src/parser';
describe('Expressions - Member', () => {
  fail('Expressions - Member (fail)', [
    ['abc.123', Context.None],
    ['a.[b].c().d.toString()', Context.None],
    ['abc.£', Context.None],
    ['abc???.£', Context.None],
  ]);

  for (const arg of [
    'let f = () => { import("foo"); };',
    'foo["bar"];',
    'foo.bar;',
    'foo.bar.foo;',
    'foo.bar["foo"];',
    'foo["foo"]["bar"];',
    'foo[test()][bar()];',
    '0..toString();',
    '0.5.toString();',
    '1.0.toString();',
    '1.000.toString();',
    'x.void',
    String.raw`x.voi\u0064`,
    'x.protected',
    String.raw`x.prot\u0065cted`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, void 0, Context.OptionsNext | Context.Module | Context.Strict);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, void 0, Context.OptionsNext);
      });
    });
  }

  pass('Expressions - Member (pass)', [
    ['abc.package', Context.None],
    ['abc.package', Context.Module | Context.Strict],
    ['x[a, b]', Context.OptionsRanges],
    ['(2[x,x],x)>x', Context.OptionsRanges],
    ['foo.bar', Context.None],
    ['(a[b]||(c[d]=e))', Context.OptionsRanges],
    ['a&&(b=c)&&(d=e)', Context.None],
    ['a.$._.B0', Context.OptionsRanges],
    ['a.if', Context.None],
    ['a().b', Context.OptionsRanges],
    ['x.y / z', Context.None],
    ['a[b, c]', Context.None],
    ['a[b]||(c[d]=e)', Context.OptionsRanges],
    ['a&&(b=c)', Context.None],
  ]);
});
