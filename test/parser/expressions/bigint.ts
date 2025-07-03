import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { pass } from '../../test-utils';

describe('Expressions - BigInt', () => {
  for (const arg of [
    '-1n',
    'const minus_one = BigInt(-1);',
    'x(30n, "foo", "bar");',
    '18757382984821n',
    '0b1111n',
    'a.b(c(0b1), 1n);',
    '340282366920938463463374607431768211456n',
    'a(3, 14n)',
    '431768211456n - 431768211456n',
    'class X { static async await(){} }',
    '(function x() { if (a === 0) return (1n / a) === (1n / b); })',
    '(function x() { for (var i = 0n; i < a.length; i++) { if (!x(a[i], b[i])) return false; } })',
    'var x = 2n ** 1000000000n;',
    '5n % 1n',
    '5n, 5n / 1n',
    'foo(5n, -5n / -1n);',
    '0n, 5n % 1n',
    '0n, -5n % -1n',
    '0n === 0n',
    'var x = 2n ** 31n - 1n;',
    'var x = kMaxInt - 32n - 2n;',
    'x = [2n ** 64n - 1n, 2n ** 64n - 2n, 4n, 3n, 2n, 1n, 0n]',
    'let x = 2n ** 30n - 1n;',
    'let x = 2n ** 30n;',
    '-4n',
    '-9007199254740992n',
    '(-9007199254740992n)',
    'a(-b.c - 3n) === -9007199254740994n',
    '1n + 1;',
    '1n + Object(1);',
    '1n + true;',
    '1 & Object(1n)',
    ' NaN | 1n;',
    'a(0b101n) << b(1n)',
    '0n << 128n === 0n',
    '0x246n << 127n === 0x12300000000000000000000000000000000n',
    '0b101n << 1n === 0b1010n',
    '0x246n << 0n === 0x246n',
    '0x123456789abcdef0fedcba9876543212345678n << -128n, 0x123456n',
    '-0x246n << 127n === -0x12300000000000000000000000000000000n',
    '-0x123456789abcdef0fedcba9876543212345678n << 64n, -0x123456789abcdef0fedcba98765432123456780000000000000000n',
    '-1n >>> -128n;',
    'a(1, 3n), -1n;',
    'a(async.await, 3n), -1n;',
    'a.b(BigInt(-9007199254740991), -9007199254740991n);',
    '(("0xf", 0), 0xfn);',
    'a(Number(0n), 0);',
    'let {} = 0n;',
    '() => 1n / 0n',
    'a(1n != false);',
    'a(1n != async);',
    '() => 1n ** -1n',
    '1n >= 1',
    'a(0n <= 1);',
    'a(1 <= 1n);',
    outdent`
      var data = [{
        a: 0x26ffcdbd233a53e7ca4612f2b02e1f2c1d885c3177e7n,
        r: 0x26ffcdbd233a53e7ca4612f2b02e1f2c1d885c3177e6n
      }, {
        a: 0xf2a29a35193377a223ef0d6d98db95eeb24a4165f288fd2b4an,
        r: 0xf2a29a35193377a223ef0d6d98db95eeb24a4165f288fd2b49n
      }, {
        a: 0x454d22e29e6104n,
        r: 0x454d22e29e6103n
      }, {
        a: -0xb00874640d30e6fce6bf79508378ed17e44dacb48a4200bce536cec462b3c2n,
        r: -0xb00874640d30e6fce6bf79508378ed17e44dacb48a4200bce536cec462b3c3n
      }, {
        a: 0x4c151a24d765249c2bab4a1915b24b80ae437417c5n,
        r: 0x4c151a24d765249c2bab4a1915b24b80ae437417c4n
      }, {
        a: -0xcbd476b1f9ca08ff820941n,
        r: -0xcbd476b1f9ca08ff820942n
      }, {
        a: -0xe848e5830fa1035322b39c2cdd031109ca8n,
        r: -0xe848e5830fa1035322b39c2cdd031109ca9n
      }, {
        a: -0x4d58c5e190f0ebac5bb36ca4d214069f69726c63a5n,
        r: -0x4d58c5e190f0ebac5bb36ca4d214069f69726c63a6n
      }, {
        a: 0x9b396n,
        r: 0x9b395n
      }, {
        a: 0x593921fe8b9d4906cn,
        r: 0x593921fe8b9d4906bn
      }, {
        a: -0xe127928c7cecd6e9ca94d98e858f9c76a0fccac62203aac7710cef1f9e352n,
        r: -0xe127928c7cecd6e9ca94d98e858f9c76a0fccac62203aac7710cef1f9e353n
      }, {
        a: 0xeb14cd952d06eb6fc613016f73b7339cbdd010n,
        r: 0xeb14cd952d06eb6fc613016f73b7339cbdd00fn
      }, {
        a: -0xfdeab6a3dbd603137f680413fecc9e1c80n,
        r: -0xfdeab6a3dbd603137f680413fecc9e1c81n
      }, {
        a: -0x7e9abbdfad170df2129dae8e15088a02b9ba99276a351a05n,
        r: -0x7e9abbdfad170df2129dae8e15088a02b9ba99276a351a06n
      }, {
        a: 0x7b98f57n,
        r: 0x7b98f56n
      }, {
        a: -0x919751deb470faa60d7c5c995c8bed72f9542d710fbbf1341n,
        r: -0x919751deb470faa60d7c5c995c8bed72f9542d710fbbf1342n
      }, {
        a: -0xc5541d89b118a88afdd187228440427c8a24f9d9bn,
        r: -0xc5541d89b118a88afdd187228440427c8a24f9d9cn
      }, {
        a: -0xe6c88a170595fn,
        r: -0xe6c88a1705960n
      }, {
        a: -0xa1ffbfa388c332804dc4dc973n,
        r: -0xa1ffbfa388c332804dc4dc974n
      }, {
        a: 0x67b768ce0c415127a77402861d1901dd7f60a8624ebea6ecafe03adc3cen,
        r: 0x67b768ce0c415127a77402861d1901dd7f60a8624ebea6ecafe03adc3cdn
      }];
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });
  }

  pass('Expressions - BigInt (pass)', [
    { code: '1n', options: { ranges: true } },
    { code: '1n + 2333333n', options: { ranges: true } },
    { code: '0xdead_BEEFn', options: { ranges: true, raw: true } },
  ]);
});
