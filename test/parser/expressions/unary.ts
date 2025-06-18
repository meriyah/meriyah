import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Expressions - Unary (fail)', [
    ['(((x)))\n--;', Context.None],
    ['(x)\n--;', Context.None],
    ['if (a) a\n--;', Context.None],
    ['if (a\n--);', Context.None],
    ['let x = () => a\n--;', Context.Strict],
    ['a\n--', Context.None],
    ['function f(){ return a\n--; }', Context.None],
    ['x.foo++.bar', Context.None],
    ['(((x)))\n++;', Context.None],
    ['(x)\n++;', Context.None],
    ['if (a) a\n++;', Context.None],
    ['function *f() { delete yield; }', Context.None],
    ['class X extends Y { constructor() { delete super; } }', Context.None],
    ['function f(){ return a\n++; }', Context.None],
    ['if (a\n++b);', Context.None],
    ['if (a\n++\nb);', Context.None],
    ['delete (x=await)', Context.Strict | Context.Module],
    ['delete (await=x)', Context.Strict | Context.Module],
    ['delete x = await', Context.Strict | Context.Module],
    ['delete ("x"[(await)])', Context.Strict | Context.Module],
    ['delete ("x"[(yield)])', Context.Strict],
    ['delete (((((foo(yield)))))).bar', Context.Strict],
    ['delete (((((foo(await)))))).bar', Context.Strict | Context.Module],
    ['delete yield.foo', Context.Strict],
    ['delete async \n (...) => x', Context.Strict],
    ['delete await.foo', Context.Strict | Context.Module],
    ['delete async; () => x;', Context.Strict],
    ['(delete (((x))) \n x)', Context.Strict],
    ['delete (async \n () => x)', Context.Strict],
    ['delete async (x) => y', Context.Strict],
    ['delete ((a)) => b)', Context.Strict],
    ['delete (((x)) => x)', Context.Strict],
    ['delete ()=>bar', Context.Strict],
    ['typeof async({a = 1}, {b = 2}, {c = 3} = {});', Context.None],
    ['typeof async({a = 1}, {b = 2} = {}, {c = 3} = {});', Context.None],
    ['typeof async({a = 1});', Context.None],
    ['delete x', Context.Strict],
    ['delete foo[await x]', Context.Strict],
    ['delete foo[yield x]', Context.Strict],
    ['delete foo=>bar', Context.Strict],
    ['delete (foo)=>bar', Context.Strict],
    ['delete x\nfoo', Context.Strict],
    ['delete (x)\n/f/', Context.Strict],
    ['delete x\n/f/', Context.Strict],
    ['delete x\nfoo', Context.Strict],
    ['delete x', Context.Strict],
    ['delete ((true)++)', Context.Strict],
    ['(async () \n ++)', Context.Strict],
    ['delete ((foo) \n ++)', Context.Strict],
    ['(foo \n ++)', Context.Strict],
    ['delete ((((true)))=x)', Context.Strict],
    ['delete ((true)=x)', Context.Strict],
    ['delete ()=b', Context.Strict],
    ['delete ((()=b))', Context.Strict],
    ['delete ([foo].bar)=>b)', Context.Strict],
    ['delete ((a))=>b)', Context.Strict],
    ['delete (a + b)=>b)', Context.Strict],
    ['delete foo => x;', Context.Strict],
    ['delete (foo) => x;', Context.Strict],
    ['delete (((foo)));', Context.Strict],
    ['delete foo', Context.Strict],
    ['typeof async({a = 1});', Context.Strict],
    ['typeof async({a = 1}, {b = 2}, {c = 3} = {});', Context.Strict],
    ['typeof async({a = 1}, {b = 2} = {}, {c = 3} = {});', Context.Strict],
    ['delete foo', Context.Strict],
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
