import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
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
    [
      'typeof async',
      Context.None,
      
    ],
    [
      'typeof await',
      Context.None,
      
    ],
    [
      'typeof x',
      Context.None,
      
    ],
    [
      'delete true',
      Context.None,
      
    ],
    [
      'delete foo.bar',
      Context.None,
      
    ],
    [
      'typeof async({a});',
      Context.None,
      
    ],
    [
      'typeof x + y',
      Context.None,
      
    ],
    [
      'delete x.y',
      Context.None,
      
    ],
    [
      'delete foo()',
      Context.None,
      
    ],
    [
      'delete typeof true',
      Context.None,
      
    ],
    [
      'delete (foo.bar);',
      Context.None,
      
    ],
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
    [
      'delete /foo/.bar;',
      Context.None,
      
    ],
    [
      'delete ((foo).x)',
      Context.OptionsRanges,
      
    ],
    [
      'delete ((((foo))).x)',
      Context.OptionsRanges,
      
    ],
    /*[
      '(delete (((x))) \n x)',
      Context.None,
      {}], */
    [
      'delete (a, b).c',
      Context.None,
      
    ],
    [
      'delete ((a)=>b)',
      Context.OptionsRanges,
      
    ],
    [
      'delete ((a, b, [c])=>b)',
      Context.OptionsRanges,
      
    ],
    [
      'delete (((a)=>b).x)',
      Context.None,
      
    ],
    [
      'delete ((()=>b))',
      Context.None,
      
    ],
    [
      'delete ((foo).x)',
      Context.None,
      
    ],
    [
      'delete ((((foo))).x)',
      Context.None,
      
    ],
    [
      'delete (a, b).c',
      Context.None,
      
    ],
    [
      'delete ((a)=>b)',
      Context.None,
      
    ],
    [
      'delete ((a, b, [c])=>b)',
      Context.None,
      
    ],
    [
      'delete ((()=>b))',
      Context.None,
      
    ],
    [
      'delete (((a)=b).x)',
      Context.None,
      
    ],
    [
      'delete true.__proto__.foo',
      Context.None,
      
    ],
    [
      'delete "x".y',
      Context.None,
      
    ],
    [
      'delete [].x',
      Context.None,
      
    ],
    [
      'delete ("foo", "bar")',
      Context.None,
      
    ],
    [
      'delete ("foo" + "bar")',
      Context.None,
      
    ],
    [
      'delete ("foo".bar = 20)',
      Context.None,
      
    ],
    [
      'delete ((foo)++)',
      Context.None,
      
    ],
    [
      'delete foo.bar',
      Context.None,
      
    ],
    [
      'delete foo[bar]',
      Context.None,
      
    ],
    [
      'delete ( \n () => x)',
      Context.None,
      
    ],
    [
      'delete ((foo).x)',
      Context.None,
      
    ],
    [
      'delete ((((foo))).x)',
      Context.None,
      
    ],
    [
      'delete (a, b).c',
      Context.None,
      
    ],
    [
      'delete ((a)=>b)',
      Context.None,
      
    ],
    [
      'delete ((a, b, [c])=>b)',
      Context.None,
      
    ],
    [
      'delete ((()=>b))',
      Context.None,
      
    ],
    [
      'delete (((a)=b).x)',
      Context.None,
      
    ],
    [
      'delete true.__proto__.foo',
      Context.None,
      
    ],
    [
      'delete "x".y',
      Context.None,
      
    ],
    [
      'delete [].x',
      Context.None,
      
    ],
    [
      'delete ("foo", "bar")',
      Context.None,
      
    ],
    [
      'delete ("foo" + "bar")',
      Context.None,
      
    ],
    [
      'delete ("foo".bar = 20)',
      Context.None,
      
    ],
    [
      'delete ((foo)++)',
      Context.None,
      
    ],
    [
      'delete foo.bar',
      Context.None,
      
    ],
    [
      'delete foo[bar]',
      Context.None,
      
    ],
    [
      'delete ( \n () => x)',
      Context.None,
      
    ],
    [
      'delete x.y',
      Context.None,
      
    ],
    [
      'delete x.y',
      Context.None,
      
    ],
    [
      'delete (((a)=b).x)',
      Context.None,
      
    ],
    [
      'delete true.__proto__.foo',
      Context.None,
      
    ],
    [
      'delete "x".y',
      Context.None,
      
    ],
    [
      'delete [].x',
      Context.OptionsRanges,
      
    ],
    [
      'delete ("foo" + "bar")',
      Context.None,
      
    ],
    [
      'delete ("foo".bar = 20)',
      Context.None,
      
    ],
    [
      'delete ((foo)++)',
      Context.OptionsRanges,
      
    ],
    [
      'delete foo.bar',
      Context.None,
      
    ],
    [
      'delete foo[bar]',
      Context.None,
      
    ],
    [
      'async x => delete (((((foo(await x)))))).bar',
      Context.OptionsRanges,
      
    ],
    [
      'function *f(){ delete (((((foo(yield)))))).bar }',
      Context.OptionsRanges,
      
    ],
    [
      'function *f(){ delete (((((foo(yield y)))))).bar }',
      Context.None,
      
    ],
    [
      'async x => delete ("x"[(await x)])',
      Context.None,
      
    ],
    [
      'function *f(){ delete ("x"[(yield)]) }',
      Context.None,
      
    ],
    [
      'typeof exports === "object"',
      Context.None,
      
    ],

    [
      '++this.x',
      Context.None,
      
    ],
    [
      '(++this.x)',
      Context.None,
      
    ],
    [
      '--this.x',
      Context.None,
      
    ],
    [
      '(this.x++)',
      Context.None,
      
    ],
    [
      'function f(){ return ++a; }',
      Context.None,
      
    ],
    [
      'let x = () => ++a;',
      Context.None,
      
    ],
    [
      'if (++a);',
      Context.None,
      
    ],
    [
      '++(x);',
      Context.None,
      
    ],
    [
      '++(((x)));',
      Context.None,
      
    ],
    [
      'if (a) --a;',
      Context.None,
      
    ],
    [
      '(x)++;',
      Context.None,
      
    ],
    [
      'a\n++b',
      Context.None,
      
    ],
    [
      'let x = () => ++\na;',
      Context.None,
      
    ],
    [
      '++\na',
      Context.None,
      
    ],
    [
      'a = typeof async (x)',
      Context.None,
      
    ],
    [
      'foo = !a',
      Context.OptionsRanges,
      
    ],
    [
      '(typeof async (x))',
      Context.None,
      
    ],
    [
      'a(void b)',
      Context.None,
      
    ],
    [
      '(delete a.b)',
      Context.None,
      
    ],
    [
      'foo = ~b',
      Context.OptionsRanges,
      
    ],
    [
      '+null',
      Context.None,
      
    ],
    [
      '-function(val){  return val }',
      Context.None,
      
    ],
    [
      'foo = !42',
      Context.None,
      
    ],
    [
      'a ? b : !c',
      Context.OptionsRanges,
      
    ],
    [
      '![]',
      Context.None,
      
    ],
    [
      'foo = (![])',
      Context.None,
      
    ],
    [
      'a = ++a',
      Context.None,
      
    ],
    [
      'a = +a',
      Context.None,
      
    ],
    [
      'y = x--',
      Context.None,
      
    ],
    [
      '~false',
      Context.None,
      
    ],
    [
      'typeof [1,2,3] ',
      Context.None,
      
    ],
    [
      'typeof {hi: "world"}',
      Context.None,
      
    ],
    [
      'delete lunch.beans;',
      Context.None,
      
    ],
    [
      'console.log(Math.PI);',
      Context.None,
      
    ],
    [
      'typeof void 0',
      Context.None,
      
    ],
    [
      'x == 5 || y == 5',
      Context.None,
      
    ],
    [
      'void x !== undefined',
      Context.None,
      
    ],
    [
      'void (x = 1) !== undefined',
      Context.None,
      
    ],
    [
      'isNaN(+(void 0)) !== true',
      Context.None,
      
    ],
    [
      'typeof async (x)',
      Context.None,
      
    ],
    [
      'let',
      Context.None,
      
    ],
    [
      '!love',
      Context.None,
      
    ],
    [
      '-a',
      Context.None,
      
    ],
    [
      'void love',
      Context.None,
      
    ],
    [
      'typeof love',
      Context.None,
      
    ],
  ]);
});
