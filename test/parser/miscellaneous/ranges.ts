import { outdent } from 'outdent';
import { describe } from 'vitest';
import { pass } from '../../test-utils';

describe('Miscellaneous - ranges', () => {
  pass('Miscellaneous - ranges (pass)', [
    {
      code: outdent`
        let fun = () => {
            // one
            // two
            // three
            return (1);
        }
      `,
      options: { ranges: true },
    },
    { code: 'let', options: { ranges: true } },
    { code: 'let.bar[foo]', options: { ranges: true } },
    { code: '({f({x} = {x: 10}) {}});', options: { ranges: true } },
    { code: 'var [x, , [, z]] = [1,2,[3,4]];', options: { ranges: true } },
    { code: '({x,y,} = 0)', options: { ranges: true } },
    { code: '({x: y = z = 0} = 1)', options: { ranges: true } },
    { code: '[...[...a[x]]] = b', options: { ranges: true } },
    { code: '[{a=0}, ...b] = 0', options: { ranges: true } },
    { code: 'var [{a = 0}] = 0;', options: { ranges: true } },
    {
      code: outdent`
        var x = {
          baz(a = 10) {},
          foo(a, b = 10) {},
          toast(a, b = 10, c) {}
        };
      `,
      options: { ranges: true },
    },
    { code: '([,,])=>0', options: { ranges: true } },
    { code: 'for([a,b[a],{c,d=e,[f]:[g,h().a,(0).k,...i[0]]}] in 0);', options: { ranges: true } },
    { code: '({x = 10, y: { z = 10 }}) => [x, z]', options: { ranges: true } },
    { code: '(x, y = 9, ...a) => {}', options: { ranges: true } },
    { code: '({ tyssjh = ((cspagh = 4) => a) } = 1) => { /*jjj*/ }; (function(a) { })()', options: { ranges: true } },
    { code: '[...{a:a = 1}] = [{}];', options: { ranges: true } },
    { code: '[[[...a]]] = [[[]]];', options: { ranges: true } },
    {
      code: 'bar1 = ( {abcdef  = (((((a1)) = (30))))} = (b1 = 40) ) => { try { throw a1; } catch(a1) { } };',

      options: { ranges: true },
    },
    { code: 'var e = 1; ( {tuvwxy  = (((  {}   =  1 )))} = (e)) => {  try{ } catch(e) {}}', options: { ranges: true } },
    { code: 'var a = [1], i = 0; ({x:a[i++]} = {});', options: { ranges: true } },
    { code: 'function foo() { return {x:1}; }; [...foo()["x"]] = [10];', options: { ranges: true } },
    {
      code: 'var [{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      options: { ranges: true },
    },
    {
      code: outdent`
        let {
          x:{
              y:{
                  z:{
                      k:k2 = 31
                    } = { k:21 }
                } = { z:{ k:20 } }
            } = { y: { z:{} } }
        } = { x:{ y:{ z:{} } } };
      `,
      options: { ranges: true },
    },
    { code: 'var x = (new Foo).x;', options: { ranges: true } },
    { code: 'var private = [["hello"]][0][0];', options: { ranges: true } },
    {
      code: 'if ((b === undefined && c === undefined) || (this.b === undefined && this.c === undefined)) {}',
      options: { ranges: true },
    },
    { code: '[((((((x.y))))))] = obj', options: { ranges: true } },
    { code: '({[(a)()]: {}})', options: { ranges: true } },
    { code: '({a = [b]} = 1)', options: { ranges: true } },
    { code: '({["a"]: [b]} = 1 / (d = (e)))', options: { ranges: true } },
    { code: '({["a"]: [b]} = 1 / (d = ((a)) = a))', options: { ranges: true } },
    { code: '({a: ("string") / a[3](a = b.c) })', options: { ranges: true } },
    { code: '({a: ("string") / a[3](((((a = b.c))))) })', options: { ranges: true } },
    { code: '({a: ("string") / a[3](((((a /= [b.c] = (x)))))) })', options: { ranges: true } },
    { code: 'try { throw {x:10, z:["this is z"]}; }  catch({x, y, z:[z]}) {x;}', options: { ranges: true } },
    { code: 'for (let x in { a: a[i++] = () => eval("x") }) { b[j++] = () => eval("x"); }', options: { ranges: true } },
    {
      code: 'bar2 = ( {abcdef  = (((((a2)) = (30))))} = (b2 = 40) ) => { try { throw a2; } catch(a2) { } };',
      options: { ranges: true },
    },
    { code: '[[a]=[1]] = [];', options: { ranges: true } },
    { code: '({a:a}=1)()', options: { ranges: true } },
    { code: '([1 || 1].a = 1)', options: { ranges: true } },
    { code: '({a: 1 || 1}.a = 1)', options: { ranges: true } },
    { code: 'function f() { ((((a))((b)()).l))() }', options: { ranges: true } },
    { code: 'for (/x/g + b;;);', options: { ranges: true } },
    { code: '([...x+=y]);', options: { ranges: true } },
    { code: '({...[].x} = x);', options: { ranges: true } },
    { code: '(((x)))++;', options: { ranges: true } },

    {
      code: outdent`
        __str="";
        outer : for(index=0; index<4; index+=1) {
            nested : for(index_n=0; index_n<=index; index_n++) {
          if (index*index_n >= 4)break ;
          __str+=""+index+index_n;
            }
        }
      `,
      options: { ranges: true },
    },
    {
      code: outdent`
        var probeBefore = function() { return x; };
        var probeTest, probeIncr, probeBody;
        var run = true;
        for (
            var _ = eval('var x = 1;');
            run && (probeTest = function() { return x; });
            probeIncr = function() { return x; }
          )
          probeBody = function() { return x; }, run = false;
        var x = 2;
      `,
      options: { ranges: true },
    },
    { code: 'for ([x.y];;);', options: { ranges: true } },
    {
      code: 'for (let [{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] = [{ u: 777, w: 888, y: 999 }]; a < 1; ) {}',
      options: { ranges: true },
    },
    { code: 'for ((x)=>{};;);', options: { ranges: true } },
    {
      code: 'function z() { for (let c in new.target) for (let o in (--((b)).debugger)) debugger; }',
      options: { ranges: true },
    },
    { code: 'for (((x)=>{}).x of y);', options: { ranges: true } },
    { code: '{}', options: { ranges: true } },
    { code: '{debugger;}', options: { ranges: true } },
    { code: 'function f() {}', options: { ranges: true } },
    { code: 'var a', options: { ranges: true } },
    { code: '{{}}', options: { ranges: true } },
    { code: '{{{{}}}}', options: { ranges: true } },
    { code: '{{a}}', options: { ranges: true } },
    { code: '[a]', options: { ranges: true } },
    { code: '"foo";', options: { ranges: true } },
    { code: 'foo; "bar"; 9;', options: { ranges: true } },
    { code: 'a, b', options: { ranges: true } },
    { code: 'a = 2', options: { ranges: true } },
    { code: 'a = b, c', options: { ranges: true } },
    { code: 'a, b = c', options: { ranges: true } },
    { code: 'a, b = c, d', options: { ranges: true } },
    { code: 'a, b, c = d', options: { ranges: true } },
    { code: 'a, b = 2', options: { ranges: true } },
    { code: '{ 1; }', options: { ranges: true } },
    { code: '{ a = 2; }', options: { ranges: true } },
    { code: '1; 2;', options: { ranges: true } },
    { code: '[ foo ]', options: { ranges: true } },
    { code: '[foo]; [foo];', options: { ranges: true } },
    { code: '[ foo ] = bar', options: { ranges: true } },
    { code: '[[foo]]', options: { ranges: true } },
    { code: '[[foo]] = []', options: { ranges: true } },
    /*   ['[[foo]] = [bar = nchanged]', Context.OptionsRanges, {
      "type": "Program",
      "start": 0,
      "end": 26,
      "body": [
        {
          "type": "ExpressionStatement",
          "start": 0,
          "end": 26,
          "expression": {
            "type": "AssignmentExpression",
            "start": 0,
            "end": 26,
            "operator": "=",
            "left": {
              "type": "ArrayPattern",
              "start": 0,
              "end": 7,
              "elements": [
                {
                  "type": "ArrayPattern",
                  "start": 1,
                  "end": 6,
                  "elements": [
                    {
                      "type": "Identifier",
                      "start": 2,
                      "end": 5,
                      "name": "foo"
                    }
                  ]
                }
              ]
            },
            "right": {
              "type": "ArrayExpression",
              "start": 10,
              "end": 26,
              "elements": [
                {
                  "type": "AssignmentExpression",
                  "start": 11,
                  "end": 25,
                  "operator": "=",
                  "left": {
                    "type": "Identifier",
                    "start": 11,
                    "end": 14,
                    "name": "bar"
                  },
                  "right": {
                    "type": "Identifier",
                    "start": 17,
                    "end": 25,
                    "name": "nchanged"
                  }
                }
              ]
            }
          }
        }
      ],
      "sourceType": "script"
    }],*/
    { code: '[a, b]', options: { ranges: true } },
    { code: '[a = b, c = d]', options: { ranges: true } },
    { code: '[[[a.b =[]]]]', options: { ranges: true } },
    {
      code: '[[[[[[[a=b] = c] = c] = c] = c] = c] = c] = [[[[[[[a=b] = c]]] = c] = c] = c] = c;',
      options: { ranges: true },
    },
    { code: 'foo; bar;', options: { ranges: true } },
    { code: 'foo; bar; goo;', options: { ranges: true } },
    { code: '{a}', options: { ranges: true } },
    { code: '{if (false) {} else ;}', options: { ranges: true } },
    { code: '{if (false) a }', options: { ranges: true } },
    { code: 'if (a) b', options: { ranges: true } },
    { code: 'if (false) {} else ;', options: { ranges: true } },
    { code: 'if(a)b;else c;', options: { ranges: true } },
    { code: 'if(a)b', options: { ranges: true } },
    { code: 'if (foo) a; if (bar) b; else c;', options: { ranges: true } },
    { code: 'if (a > 2) {b = c }', options: { ranges: true } },
    { code: 'while (x < 10) { x++; y--; }', options: { ranges: true } },
    { code: 'while (i-->1) {}', options: { ranges: true } },
    { code: 'try {} catch({e=x}){}', options: { ranges: true } },
    { code: 'try {} catch {}', options: { ranges: true } },
    { code: 'try { } catch (e) { say(e) }', options: { ranges: true } },
    { code: 'try { } catch ([a = 0]) { }', options: { ranges: true } },
    { code: 'throw foo;', options: { ranges: true } },
    { code: 'throw x * y', options: { ranges: true } },
    { code: 'switch(foo) {}', options: { ranges: true } },
    { code: 'switch (A) {default: D; case B: C; }', options: { ranges: true } },
    { code: 'switch(a){case 1:default:}', options: { ranges: true } },
    { code: 'for (a;;);', options: { ranges: true } },
    { code: 'for (let [...foo] = obj;;);', options: { ranges: true } },
    { code: 'for (let [foo=a] = arr;;);', options: { ranges: true } },
    { code: 'for (x.y of [23]) {}', options: { ranges: true } },
    { code: 'for ( let[x] of [[34]] ) {}', options: { ranges: true } },
    { code: 'for (yield[g]--;;);', options: { ranges: true } },
    { code: 'function fn4([[x, y, ...z]]) {}', options: { ranges: true } },
    { code: '[x.a=a] = 0', options: { ranges: true } },
    { code: '[{a=0},{a=0}] = 0', options: { ranges: true } },
    { code: '[...[...a[x]]] = 1', options: { ranges: true } },
    { code: 'var {x: y, z: { a: b } } = { x: "3", z: { a: "b" } };', options: { ranges: true, raw: true } },
    { code: '[a,b=0,[c,...a[0]]={}]=0;', options: { ranges: true, raw: true } },
    { code: '({a,b=b,a:c,[a]:[d]})=>0;', options: { ranges: true, raw: true } },
    { code: '(x, y = 9, {b}, z = 8, ...a) => {}', options: { ranges: true, raw: true } },
    { code: '[...[{prop: 1}.prop]] = []', options: { ranges: true } },
    { code: 'f = ([cls = class {}]) => {}', options: { ranges: true } },
    {
      code: 'f = ([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) => {}',
      options: { ranges: true },
    },
    {
      code: '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      options: { ranges: true, raw: true },
    },
    {
      code: outdent`
        function bind_bindFunction0(fun, thisArg, boundArgs) {
          return function bound() {
              // Ensure we allocate a call-object slot for |boundArgs|, so the
              // debugger can access this value.
              if (false) void boundArgs;

              var newTarget;
              if (_IsConstructing()) {
                  newTarget = new.target;
                  if (newTarget === bound)
                      newTarget = fun;
                  switch (arguments.length) {
                    case 0:
                      return constructContentFunction(fun, newTarget);
                    case 1:
                      return constructContentFunction(fun, newTarget, SPREAD(arguments, 1));
                    case 2:
                      return constructContentFunction(fun, newTarget, SPREAD(arguments, 2));
                    case 3:
                      return constructContentFunction(fun, newTarget, SPREAD(arguments, 3));
                    case 4:
                      return constructContentFunction(fun, newTarget, SPREAD(arguments, 4));
                    case 5:
                      return constructContentFunction(fun, newTarget, SPREAD(arguments, 5));
                    default:
                      var args = FUN_APPLY(bind_mapArguments, null, arguments);
                      return bind_constructFunctionN(fun, newTarget, args);
                  }
              } else {
                  switch (arguments.length) {
                    case 0:
                      return callContentFunction(fun, thisArg);
                    case 1:
                      return callContentFunction(fun, thisArg, SPREAD(arguments, 1));
                    case 2:
                      return callContentFunction(fun, thisArg, SPREAD(arguments, 2));
                    case 3:
                      return callContentFunction(fun, thisArg, SPREAD(arguments, 3));
                    case 4:
                      return callContentFunction(fun, thisArg, SPREAD(arguments, 4));
                    case 5:
                      return callContentFunction(fun, thisArg, SPREAD(arguments, 5));
                    default:
                      return FUN_APPLY(fun, thisArg, arguments);
                  }
              }
          };
        }
      `,
      options: { ranges: true, raw: true },
    },
    { code: 'a--', options: { ranges: true } },
    { code: '--a', options: { ranges: true } },
    { code: 'for (\n[x][0];;);', options: { ranges: true, loc: true } },
    { code: 'for (\n[x][0] in y);', options: { ranges: true, loc: true } },
    { code: 'for (\n[x][0] of y);', options: { ranges: true, loc: true } },
  ]);
});
