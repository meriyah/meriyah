import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';
describe('Expressions - Member', () => {
  fail('Expressions - Member (fail)', ['abc.123', 'a.[b].c().d.toString()', 'abc.£', 'abc???.£']);

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
        parseSource(`${arg}`, { next: true, sourceType: 'module' });
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true });
      });
    });
  }

  pass('Expressions - Member (pass)', [
    'abc.package',
    { code: 'abc.package', options: { sourceType: 'module' } },
    { code: 'x[a, b]', options: { ranges: true } },
    { code: '(2[x,x],x)>x', options: { ranges: true } },
    'foo.bar',
    { code: '(a[b]||(c[d]=e))', options: { ranges: true } },
    'a&&(b=c)&&(d=e)',
    { code: 'a.$._.B0', options: { ranges: true } },
    'a.if',
    { code: 'a().b', options: { ranges: true } },
    'x.y / z',
    'a[b, c]',
    { code: 'a[b]||(c[d]=e)', options: { ranges: true } },
    'a&&(b=c)',
  ]);
});
