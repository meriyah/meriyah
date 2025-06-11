import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Miscellaneous - ranges', () => {
  pass('Miscellaneous - ranges (pass)', [
    [
      `let fun = () => {
        // one
        // two
        // three
        return (1);
    }`,
      Context.OptionsRanges,
      
    ],
    [
      'let',
      Context.OptionsRanges,
      
    ],
    [
      'let.bar[foo]',
      Context.OptionsRanges,
      
    ],
    [
      '({f({x} = {x: 10}) {}});',
      Context.OptionsRanges,
      
    ],
    [
      'var [x, , [, z]] = [1,2,[3,4]];',
      Context.OptionsRanges,
      
    ],
    [
      '({x,y,} = 0)',
      Context.OptionsRanges,
      
    ],
    [
      '({x: y = z = 0} = 1)',
      Context.OptionsRanges,
      
    ],
    [
      '[...[...a[x]]] = b',
      Context.OptionsRanges,
      
    ],
    [
      '[{a=0}, ...b] = 0',
      Context.OptionsRanges,
      
    ],
    [
      'var [{a = 0}] = 0;',
      Context.OptionsRanges,
      
    ],
    [
      `var x = {
      baz(a = 10) {},
      foo(a, b = 10) {},
      toast(a, b = 10, c) {}
    };`,
      Context.OptionsRanges,
      
    ],
    [
      '([,,])=>0',
      Context.OptionsRanges,
      
    ],
    [
      'for([a,b[a],{c,d=e,[f]:[g,h().a,(0).k,...i[0]]}] in 0);',
      Context.OptionsRanges,
      
    ],
    [
      '({x = 10, y: { z = 10 }}) => [x, z]',
      Context.OptionsRanges,
      
    ],
    [
      '(x, y = 9, ...a) => {}',
      Context.OptionsRanges,
      
    ],
    [
      '({ tyssjh = ((cspagh = 4) => a) } = 1) => { /*jjj*/ }; (function(a) { })()',
      Context.OptionsRanges,
      
    ],
    [
      '[...{a:a = 1}] = [{}];',
      Context.OptionsRanges,
      
    ],
    [
      '[[[...a]]] = [[[]]];',
      Context.OptionsRanges,
      
    ],
    [
      'bar1 = ( {abcdef  = (((((a1)) = (30))))} = (b1 = 40) ) => { try { throw a1; } catch(a1) { } };',
      Context.OptionsRanges,
      
    ],
    [
      'var e = 1; ( {tuvwxy  = (((  {}   =  1 )))} = (e)) => {  try{ } catch(e) {}}',
      Context.OptionsRanges,
      
    ],
    [
      'var a = [1], i = 0; ({x:a[i++]} = {});',
      Context.OptionsRanges,
      
    ],
    [
      'function foo() { return {x:1}; }; [...foo()["x"]] = [10];',
      Context.OptionsRanges,
      
    ],
    [
      'var [{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      Context.OptionsRanges,
      
    ],
    [
      `let {
      x:{
          y:{
              z:{
                  k:k2 = 31
                } = { k:21 }
            } = { z:{ k:20 } }
        } = { y: { z:{} } }
    } = { x:{ y:{ z:{} } } };`,
      Context.OptionsRanges,
      
    ],
    [
      'var x = (new Foo).x;',
      Context.OptionsRanges,
      
    ],
    [
      'var private = [["hello"]][0][0];',
      Context.OptionsRanges,
      
    ],
    [
      'if ((b === undefined && c === undefined) || (this.b === undefined && this.c === undefined)) {}',
      Context.OptionsRanges,
      
    ],
    [
      '[((((((x.y))))))] = obj',
      Context.OptionsRanges,
      
    ],
    [
      '({[(a)()]: {}})',
      Context.OptionsRanges,
      
    ],
    [
      '({a = [b]} = 1)',
      Context.OptionsRanges,
      
    ],
    [
      '({["a"]: [b]} = 1 / (d = (e)))',
      Context.OptionsRanges,
      
    ],
    [
      '({["a"]: [b]} = 1 / (d = ((a)) = a))',
      Context.OptionsRanges,
      
    ],
    [
      '({a: ("string") / a[3](a = b.c) })',
      Context.OptionsRanges,
      
    ],
    [
      '({a: ("string") / a[3](((((a = b.c))))) })',
      Context.OptionsRanges,
      
    ],
    [
      '({a: ("string") / a[3](((((a /= [b.c] = (x)))))) })',
      Context.OptionsRanges,
      
    ],
    [
      'try { throw {x:10, z:["this is z"]}; }  catch({x, y, z:[z]}) {x;}',
      Context.OptionsRanges,
      
    ],
    [
      'for (let x in { a: a[i++] = () => eval("x") }) { b[j++] = () => eval("x"); }',
      Context.OptionsRanges,
      
    ],
    [
      'bar2 = ( {abcdef  = (((((a2)) = (30))))} = (b2 = 40) ) => { try { throw a2; } catch(a2) { } };',
      Context.OptionsRanges,
      
    ],
    [
      '[[a]=[1]] = [];',
      Context.OptionsRanges,
      
    ],
    [
      '({a:a}=1)()',
      Context.OptionsRanges,
      
    ],
    [
      '([1 || 1].a = 1)',
      Context.OptionsRanges,
      
    ],
    [
      '({a: 1 || 1}.a = 1)',
      Context.OptionsRanges,
      
    ],
    [
      'function f() { ((((a))((b)()).l))() }',
      Context.OptionsRanges,
      
    ],
    [
      'for (/x/g + b;;);',
      Context.OptionsRanges,
      
    ],
    [
      '([...x+=y]);',
      Context.OptionsRanges,
      
    ],
    [
      '({...[].x} = x);',
      Context.OptionsRanges,
      
    ],
    [
      '(((x)))++;',
      Context.OptionsRanges,
      
    ],

    [
      `__str="";
     outer : for(index=0; index<4; index+=1) {
         nested : for(index_n=0; index_n<=index; index_n++) {
       if (index*index_n >= 4)break ;
       __str+=""+index+index_n;
         }
     }`,
      Context.OptionsRanges,
      
    ],
    [
      `var probeBefore = function() { return x; };
     var probeTest, probeIncr, probeBody;
     var run = true;
     for (
         var _ = eval('var x = 1;');
         run && (probeTest = function() { return x; });
         probeIncr = function() { return x; }
       )
       probeBody = function() { return x; }, run = false;
     var x = 2;`,
      Context.OptionsRanges,
      
    ],
    [
      'for ([x.y];;);',
      Context.OptionsRanges,
      
    ],
    [
      'for (let [{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] = [{ u: 777, w: 888, y: 999 }]; a < 1; ) {}',
      Context.OptionsRanges,
      
    ],
    [
      'for ((x)=>{};;);',
      Context.OptionsRanges,
      
    ],
    [
      'function z() { for (let c in new.target) for (let o in (--((b)).debugger)) debugger; }',
      Context.OptionsRanges,
      
    ],
    [
      'for (((x)=>{}).x of y);',
      Context.OptionsRanges,
      
    ],
    [
      '{}',
      Context.OptionsRanges,
      
    ],
    [
      '{debugger;}',
      Context.OptionsRanges,
      
    ],
    [
      'function f() {}',
      Context.OptionsRanges,
      
    ],
    [
      'var a',
      Context.OptionsRanges,
      
    ],
    [
      '{{}}',
      Context.OptionsRanges,
      
    ],
    [
      '{{{{}}}}',
      Context.OptionsRanges,
      
    ],
    [
      '{{a}}',
      Context.OptionsRanges,
      
    ],
    [
      '[a]',
      Context.OptionsRanges,
      
    ],
    [
      '"foo";',
      Context.OptionsRanges,
      
    ],
    [
      'foo; "bar"; 9;',
      Context.OptionsRanges,
      
    ],
    [
      'a, b',
      Context.OptionsRanges,
      
    ],
    [
      'a = 2',
      Context.OptionsRanges,
      
    ],
    [
      'a = b, c',
      Context.OptionsRanges,
      
    ],
    [
      'a, b = c',
      Context.OptionsRanges,
      
    ],
    [
      'a, b = c, d',
      Context.OptionsRanges,
      
    ],
    [
      'a, b, c = d',
      Context.OptionsRanges,
      
    ],
    [
      'a, b = 2',
      Context.OptionsRanges,
      
    ],
    [
      '{ 1; }',
      Context.OptionsRanges,
      
    ],
    [
      '{ a = 2; }',
      Context.OptionsRanges,
      
    ],
    [
      '1; 2;',
      Context.OptionsRanges,
      
    ],
    [
      '[ foo ]',
      Context.OptionsRanges,
      
    ],
    [
      '[foo]; [foo];',
      Context.OptionsRanges,
      
    ],
    [
      '[ foo ] = bar',
      Context.OptionsRanges,
      
    ],
    [
      '[[foo]]',
      Context.OptionsRanges,
      
    ],
    [
      '[[foo]] = []',
      Context.OptionsRanges,
      
    ],
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
    [
      '[a, b]',
      Context.OptionsRanges,
      
    ],
    [
      '[a = b, c = d]',
      Context.OptionsRanges,
      
    ],
    [
      '[[[a.b =[]]]]',
      Context.OptionsRanges,
      
    ],
    [
      '[[[[[[[a=b] = c] = c] = c] = c] = c] = c] = [[[[[[[a=b] = c]]] = c] = c] = c] = c;',
      Context.OptionsRanges,
      
    ],
    [
      'foo; bar;',
      Context.OptionsRanges,
      
    ],
    [
      'foo; bar; goo;',
      Context.OptionsRanges,
      
    ],
    [
      '{a}',
      Context.OptionsRanges,
      
    ],
    [
      '{if (false) {} else ;}',
      Context.OptionsRanges,
      
    ],
    [
      '{if (false) a }',
      Context.OptionsRanges,
      
    ],
    [
      'if (a) b',
      Context.OptionsRanges,
      
    ],
    [
      'if (false) {} else ;',
      Context.OptionsRanges,
      
    ],
    [
      'if(a)b;else c;',
      Context.OptionsRanges,
      
    ],
    [
      'if(a)b',
      Context.OptionsRanges,
      
    ],
    [
      'if (foo) a; if (bar) b; else c;',
      Context.OptionsRanges,
      
    ],
    [
      'if (a > 2) {b = c }',
      Context.OptionsRanges,
      
    ],
    [
      'while (x < 10) { x++; y--; }',
      Context.OptionsRanges,
      
    ],
    [
      'while (i-->1) {}',
      Context.OptionsRanges,
      
    ],
    [
      'try {} catch({e=x}){}',
      Context.OptionsRanges,
      
    ],
    [
      'try {} catch {}',
      Context.OptionsRanges,
      
    ],
    [
      'try { } catch (e) { say(e) }',
      Context.OptionsRanges,
      
    ],
    [
      'try { } catch ([a = 0]) { }',
      Context.OptionsRanges,
      
    ],
    [
      'throw foo;',
      Context.OptionsRanges,
      
    ],
    [
      'throw x * y',
      Context.OptionsRanges,
      
    ],
    [
      'switch(foo) {}',
      Context.OptionsRanges,
      
    ],
    [
      'switch (A) {default: D; case B: C; }',
      Context.OptionsRanges,
      
    ],
    [
      'switch(a){case 1:default:}',
      Context.OptionsRanges,
      
    ],
    [
      'for (a;;);',
      Context.OptionsRanges,
      
    ],
    [
      'for (let [...foo] = obj;;);',
      Context.OptionsRanges,
      
    ],
    [
      'for (let [foo=a] = arr;;);',
      Context.OptionsRanges,
      
    ],
    [
      'for (x.y of [23]) {}',
      Context.OptionsRanges,
      
    ],
    [
      'for ( let[x] of [[34]] ) {}',
      Context.OptionsRanges,
      
    ],
    [
      'for (yield[g]--;;);',
      Context.OptionsRanges,
      
    ],
    [
      'function fn4([[x, y, ...z]]) {}',
      Context.OptionsRanges,
      
    ],
    [
      '[x.a=a] = 0',
      Context.OptionsRanges,
      
    ],
    [
      '[{a=0},{a=0}] = 0',
      Context.OptionsRanges,
      
    ],
    [
      '[...[...a[x]]] = 1',
      Context.OptionsRanges,
      
    ],
    [
      'var {x: y, z: { a: b } } = { x: "3", z: { a: "b" } };',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      '[a,b=0,[c,...a[0]]={}]=0;',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      '({a,b=b,a:c,[a]:[d]})=>0;',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      '(x, y = 9, {b}, z = 8, ...a) => {}',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      '[...[{prop: 1}.prop]] = []',
      Context.OptionsRanges,
      
    ],
    [
      'f = ([cls = class {}]) => {}',
      Context.OptionsRanges,
      
    ],
    [
      'f = ([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) => {}',
      Context.OptionsRanges,
      
    ],
    [
      '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      `function bind_bindFunction0(fun, thisArg, boundArgs) {
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
    }`,
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      'a--',
      Context.OptionsRanges,
      
    ],
    [
      '--a',
      Context.OptionsRanges,
      
    ],
  ]);
});
