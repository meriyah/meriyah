import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Expressions - Unary', () => {
  for (const arg of [
    'delete {}.x',
    'typeof x === "undefined"',
    'delete o["y"]',
    'delete Number(7)',
    'delete ((x) => x)',
    'delete ((x) => x).foo',
    'delete new Number(8)',
    'delete a[2]',
    'delete await;',
    'delete false;',
    'delete null;',
    'delete this;',
    'delete true;',
    'delete yield;',
    'delete o[Math.pow(2,30)]',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  fail('Expressions - Unary (fail)', [
    '(((x)))\n--;',
    '(x)\n--;',
    'if (a) a\n--;',
    'if (a\n--);',
    { code: 'let x = () => a\n--;', options: { impliedStrict: true } },
    'a\n--',
    'function f(){ return a\n--; }',
    'x.foo++.bar',
    '(((x)))\n++;',
    '(x)\n++;',
    'if (a) a\n++;',
    'function *f() { delete yield; }',
    'class X extends Y { constructor() { delete super; } }',
    'function f(){ return a\n++; }',
    'if (a\n++b);',
    'if (a\n++\nb);',
    { code: 'delete (x=await)', options: { sourceType: 'module' } },
    { code: 'delete (await=x)', options: { sourceType: 'module' } },
    { code: 'delete x = await', options: { sourceType: 'module' } },
    { code: 'delete ("x"[(await)])', options: { sourceType: 'module' } },
    { code: 'delete ("x"[(yield)])', options: { impliedStrict: true } },
    { code: 'delete (((((foo(yield)))))).bar', options: { impliedStrict: true } },
    { code: 'delete (((((foo(await)))))).bar', options: { sourceType: 'module' } },
    { code: 'delete yield.foo', options: { impliedStrict: true } },
    { code: 'delete async \n (...) => x', options: { impliedStrict: true } },
    { code: 'delete await.foo', options: { sourceType: 'module' } },
    { code: 'delete async; () => x;', options: { impliedStrict: true } },
    { code: '(delete (((x))) \n x)', options: { impliedStrict: true } },
    { code: 'delete (async \n () => x)', options: { impliedStrict: true } },
    { code: 'delete async (x) => y', options: { impliedStrict: true } },
    { code: 'delete ((a)) => b)', options: { impliedStrict: true } },
    { code: 'delete (((x)) => x)', options: { impliedStrict: true } },
    { code: 'delete ()=>bar', options: { impliedStrict: true } },
    'typeof async({a = 1}, {b = 2}, {c = 3} = {});',
    'typeof async({a = 1}, {b = 2} = {}, {c = 3} = {});',
    'typeof async({a = 1});',
    { code: 'delete x', options: { impliedStrict: true } },
    { code: 'delete foo[await x]', options: { impliedStrict: true } },
    { code: 'delete foo[yield x]', options: { impliedStrict: true } },
    { code: 'delete foo=>bar', options: { impliedStrict: true } },
    { code: 'delete (foo)=>bar', options: { impliedStrict: true } },
    { code: 'delete x\nfoo', options: { impliedStrict: true } },
    { code: 'delete (x)\n/f/', options: { impliedStrict: true } },
    { code: 'delete x\n/f/', options: { impliedStrict: true } },
    { code: 'delete x\nfoo', options: { impliedStrict: true } },
    { code: 'delete x', options: { impliedStrict: true } },
    { code: 'delete ((true)++)', options: { impliedStrict: true } },
    { code: '(async () \n ++)', options: { impliedStrict: true } },
    { code: 'delete ((foo) \n ++)', options: { impliedStrict: true } },
    { code: '(foo \n ++)', options: { impliedStrict: true } },
    { code: 'delete ((((true)))=x)', options: { impliedStrict: true } },
    { code: 'delete ((true)=x)', options: { impliedStrict: true } },
    { code: 'delete ()=b', options: { impliedStrict: true } },
    { code: 'delete ((()=b))', options: { impliedStrict: true } },
    { code: 'delete ([foo].bar)=>b)', options: { impliedStrict: true } },
    { code: 'delete ((a))=>b)', options: { impliedStrict: true } },
    { code: 'delete (a + b)=>b)', options: { impliedStrict: true } },
    { code: 'delete foo => x;', options: { impliedStrict: true } },
    { code: 'delete (foo) => x;', options: { impliedStrict: true } },
    { code: 'delete (((foo)));', options: { impliedStrict: true } },
    { code: 'delete foo', options: { impliedStrict: true } },
    { code: 'typeof async({a = 1});', options: { impliedStrict: true } },
    { code: 'typeof async({a = 1}, {b = 2}, {c = 3} = {});', options: { impliedStrict: true } },
    { code: 'typeof async({a = 1}, {b = 2} = {}, {c = 3} = {});', options: { impliedStrict: true } },
    { code: 'delete foo', options: { impliedStrict: true } },
  ]);

  pass('Expressions - Unary (pass)', [
    'typeof async',
    'typeof await',
    'typeof x',
    'delete true',
    'delete foo.bar',
    'typeof async({a});',
    'typeof x + y',
    'delete x.y',
    'delete foo()',
    'delete typeof true',
    'delete (foo.bar);',
    /* [
      'delete foo.bar, z;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'UnaryExpression',
                  operator: 'delete',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  },
                  prefix: true
                },
                {
                  type: 'Identifier',
                  name: 'z'
                }
              ]
            }
          }
        ]
      }
    ],*/
    'delete /foo/.bar;',
    { code: 'delete ((foo).x)', options: { ranges: true } },
    { code: 'delete ((((foo))).x)', options: { ranges: true } },
    /*[
      '(delete (((x))) \n x)',
      Context.None,
      {}], */
    'delete (a, b).c',
    { code: 'delete ((a)=>b)', options: { ranges: true } },
    { code: 'delete ((a, b, [c])=>b)', options: { ranges: true } },
    'delete (((a)=>b).x)',
    'delete ((()=>b))',
    'delete ((foo).x)',
    'delete ((((foo))).x)',
    'delete (a, b).c',
    'delete ((a)=>b)',
    'delete ((a, b, [c])=>b)',
    'delete ((()=>b))',
    'delete (((a)=b).x)',
    'delete true.__proto__.foo',
    'delete "x".y',
    'delete [].x',
    'delete ("foo", "bar")',
    'delete ("foo" + "bar")',
    'delete ("foo".bar = 20)',
    'delete ((foo)++)',
    'delete foo.bar',
    'delete foo[bar]',
    'delete ( \n () => x)',
    'delete ((foo).x)',
    'delete ((((foo))).x)',
    'delete (a, b).c',
    'delete ((a)=>b)',
    'delete ((a, b, [c])=>b)',
    'delete ((()=>b))',
    'delete (((a)=b).x)',
    'delete true.__proto__.foo',
    'delete "x".y',
    'delete [].x',
    'delete ("foo", "bar")',
    'delete ("foo" + "bar")',
    'delete ("foo".bar = 20)',
    'delete ((foo)++)',
    'delete foo.bar',
    'delete foo[bar]',
    'delete ( \n () => x)',
    'delete x.y',
    'delete x.y',
    'delete (((a)=b).x)',
    'delete true.__proto__.foo',
    'delete "x".y',
    { code: 'delete [].x', options: { ranges: true } },
    'delete ("foo" + "bar")',
    'delete ("foo".bar = 20)',
    { code: 'delete ((foo)++)', options: { ranges: true } },
    'delete foo.bar',
    'delete foo[bar]',
    { code: 'async x => delete (((((foo(await x)))))).bar', options: { ranges: true } },
    { code: 'function *f(){ delete (((((foo(yield)))))).bar }', options: { ranges: true } },
    'function *f(){ delete (((((foo(yield y)))))).bar }',
    'async x => delete ("x"[(await x)])',
    'function *f(){ delete ("x"[(yield)]) }',
    'typeof exports === "object"',

    '++this.x',
    '(++this.x)',
    '--this.x',
    '(this.x++)',
    'function f(){ return ++a; }',
    'let x = () => ++a;',
    'if (++a);',
    '++(x);',
    '++(((x)));',
    'if (a) --a;',
    '(x)++;',
    'a\n++b',
    'let x = () => ++\na;',
    '++\na',
    'a = typeof async (x)',
    { code: 'foo = !a', options: { ranges: true } },
    '(typeof async (x))',
    'a(void b)',
    '(delete a.b)',
    { code: 'foo = ~b', options: { ranges: true } },
    '+null',
    '-function(val){  return val }',
    'foo = !42',
    { code: 'a ? b : !c', options: { ranges: true } },
    '![]',
    'foo = (![])',
    'a = ++a',
    'a = +a',
    'y = x--',
    '~false',
    'typeof [1,2,3] ',
    'typeof {hi: "world"}',
    'delete lunch.beans;',
    'console.log(Math.PI);',
    'typeof void 0',
    'x == 5 || y == 5',
    'void x !== undefined',
    'void (x = 1) !== undefined',
    'isNaN(+(void 0)) !== true',
    'typeof async (x)',
    'let',
    '!love',
    '-a',
    'void love',
    'typeof love',
  ]);
});
