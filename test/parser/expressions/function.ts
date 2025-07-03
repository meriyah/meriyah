import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Expressions - Functions', () => {
  for (const arg of [
    '...x = []',
    '[...[ x ] = []]',
    '[...x = []]',
    '[...{ x } = []]',
    '[...[x], y]',
    '[...x, y]',
    '[...{ x }, y]',
    '[...[ x ] = []] = []',
    '[...x = []] = []',
    '[...{ x } = []] = []',
    '[...[x], y] = [1, 2, 3]',
    '[...x, y] = [1, 2, 3]',
    '[...{ x }, y] = [1, 2, 3]',
    '...a,',
  ]) {
    it(`(function (${arg}) {})`, () => {
      t.throws(() => {
        parseSource(`(function (${arg}) {})`);
      });

      t.throws(() => {
        parseSource(`const foo = (function (${arg}) {})`);
      });

      t.throws(() => {
        parseSource(`(function (${arg}) {})`, { sourceType: 'module' });
      });
    });
  }

  for (const arg of [
    '(function([...{ x }, y] = [1, 2, 3]) {})',
    '(function([...[ x ] = []] = []) {})',
    '(function([...[x], y]) {})',
    '(function([...[x], y]) {})',
    '(function([...[ x ] = []]) {})',
    '0, function(...x = []) {}',
    '0, function(...x = []) {};',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.throws(() => {
        parseSource(`function foo() { ${arg}}`);
      });
    });

    it(`(function foo() { ${arg}})`, () => {
      t.throws(() => {
        parseSource(`(function foo() { ${arg}})`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });
  }

  for (const arg of [
    '{...x}',
    '{ x: y }',
    '{ x, }',
    '{ x: y = 33 }',
    '{ fn = function () {}, xFn = function x() {} }',
    '{ cover = (function () {}), xCover = (0, function() {})  }',
    '{ arrow = () => {} }',
    '{}',
    '{ x: y } = { x: 23 }',
    '{ poisoned: x = ++initEvalCount } = poisonedProperty',
    '{ w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] }',
    '{ x, } = { x: 23 }',
    '[,] = g()',
    '[{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] = []',
    '[{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]',
    '[{ x, y, z } = { x: 44, y: 55, z: 66 }] = []',
    '[x = 23] = [,]',
    '[[...x] = [2, 1, 3]] = []',
    '[[x, y, z] = [4, 5, 6]] = []',
    '[ , , ...x]',
    '[, ...x]',
    '[,]',
    '[{ x }]',
    '[{ x }]',
    '[{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }]',
    '[ a = b ]',
    '[x = 23]',
    '[[] = function() { a += 1; }()]',
    'x = args = arguments',
  ]) {
    it(`(function(${arg}) {})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function(${arg}) {})`);
      });
    });
  }

  const validSyntax = [
    '(function([[,] = function* g() {}]) {})',
    '(function([cover = (function () {}), xCover = (0, function() {})]) {})',
    '(function([fn = function () {}, xFn = function x() {}]) {})',
    '(function([x = 23]) {})',
    '(function([...[x, y, z]]) {})',
    '(function([...[,]]) {})',
    '(function([...x]) {})',
    '(function([...{ length }]) {})',
    '(function([x = 23] = [undefined]) {})',
    'function a5({a3, b2: { ba1, ...ba2 }, ...c3}) {}',
    'function a6({a3, b2: { ba1, ...ba2 } }) {}',
    'function a7({a1 = 1, ...b1} = {}) {}',
    '(function a5({a3, b2: { ba1, ...ba2 }, ...c3}) {})',
    '(function a6({a3, b2: { ba1, ...ba2 } }) {})',
    '(function a7({a1 = 1, ...b1} = {}) {})',
    '(function a8([{...a1}]) {})',
    '(function a9([{a1, ...a2}]) {})',
    '(function a10([a1, {...a2}]) {})',
    '(function b2(a, ...b) {})',
    'f( ({...c}=o, c) )',
    '(function fn({a = 1, ...b} = {}) {   return {a, b}; })',
    'function iceFapper(idiot) {}',
    '(function([{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] = [{ u: 777, w: 888, y: 999 }]) {})',
    '(function({} = null) {})',
    'function f({foo}){}',
    'function f({foo:a}){}',
    'function f({foo:a=b}){}',
    'function f({foo}, bar){}',
    'function f(foo, {bar}){}',
    'function f({foo} = x, b){}',
    'function f({foo} = x, b = y){}',
    'function f(x, {foo} = y){}',
    'function f(x = y, {foo} = z){}',
    'function f({foo=a} = x){}',
    'function f([]){}',
    'function f([] = x){}',
    'function f([,]){}',
    'function f([,] = x){}',
    'function f([,,]){}',
    'function f([,,] = x){}',
    'function f([foo]){}',
    'function f([foo] = x){}',
    'function f([foo,]){}',
    'function f([foo,] = x){}',
    'function f([foo,,]){}',
    'function f([foo,,] = x){}',
    'function f([,foo]){}',
    'function f([,foo] = x){}',
    'function f([,,foo]){}',
    'function f([,,foo] = x){}',
    'function f([foo,bar]){}',
    'function f([foo,bar] = x){}',
    'function f([foo,,bar]){}',
    'function f([foo,,bar] = x){}',
    'function f([foo], [bar]){}',
    'function f([foo] = x, [bar] = y){}',
    'function f([foo], b){}',
    'function f([foo] = x, b){}',
    'function f([foo], b = y){}',
    'function f([foo] = x, b = y){}',
    'function f(x, [foo]){}',
    'function f(x, [foo] = y){}',
    'function f(x = y, [foo] = z){}',
    'function f(x = y, [foo]){}',
    'function f([foo=a]){}',
    'function a() {  function get(directory) { }  }',
    'function f([foo=a] = c){}',
    'function f([foo=a,bar]){}',
    'function f([foo=a,bar] = x){}',
    'function f([foo,bar=b]){}',
    'function f([foo,bar=b] = x){}',
    'function f([foo=a,bar=b]){}',
    'function f([foo=a,bar=b] = x){}',
    'function f([...bar] = obj){}',
    'function f([]){}',
    'function f([] = x){}',
    'function f([,]){}',
    'function f([,] = x){}',
    'function f([,,]){}',
    'function f([,,] = x){}',
    'function f([foo]){}',
    'function f([foo] = x){}',
    'function f([foo,]){}',
    'function f([foo,] = x){}',
    'function f([foo,,]){}',
    'function f([foo,,] = x){}',
    'function f([,foo]){}',
    'function f([,foo] = x){}',
    'function f([,,foo]){}',
    'function f([,,foo] = x){}',
    'function f([,,async] = x){}',
    'function f([foo,bar]){}',
    'function f(async,){}',
    'function f([,async]){}',
    'function f(async = 1){}',
    'function f(foo, async = 1){}',
    'function f([foo,bar] = x){}',
    'function f([foo,,bar]){}',
    'function f([foo,,bar] = x){}',
    'function f([foo], [bar]){}',
    'function f([foo], [async]){}',
    'function f([foo] = x, [bar] = y){}',
    'function f([foo], b){}',
    'function f([foo] = x, b){}',
    'function f([foo], b = y){}',
    '(function foo(y, z) {{ function x() {} } })(1);',
    // Complex parameter shouldn't be shadowed
    '(function foo(x = 0) { var x; { function x() {} } })(1);',
    // Nested complex parameter shouldn't be shadowed
    '(function foo([[x]]) {var x; {function x() {} } })([[1]]);',
    // Complex parameter shouldn't be shadowed
    '(function foo(x = 0) { var x; { function x() {}} })(1);',
    // Nested complex parameter shouldn't be shadowed
    '(function foo([[x]]) { var x;{ function x() {} }  })([[1]]);',
    // Rest parameter shouldn't be shadowed
    '(function foo(...x) { var x; {  function x() {}  } })(1);',
    // Don't shadow complex rest parameter
    '(function foo(...[x]) { var x; { function x() {} } })(1);',
    // Hoisting is not affected by other simple parameters
    '(function foo(y, z) {{function x() {}} })(1);',
    // Hoisting is not affected by other complex parameters
    ' (function foo([y] = [], z) {{function x() {} } })();',
    // Should allow shadowing function names
    '{(function foo() { { function foo() { return 0; } } })();}',
    '{(function foo(...r) { { function foo() { return 0; } } })(); }',
    '(function foo() { { let f = 0; (function () { { function f() { return 1; } } })(); } })();',
    '(function foo() { var y = 1; (function bar(x = y) { { function y() {} } })();  })();',
    '(function foo() { { function f() { return 4; } { function f() { return 5; } } }})()',
    '(function foo(a = 0) { { let y = 3; function f(b = 0) { y = 2; } f(); } })();',
    '(function conditional() {  if (true) { function f() { return 1; } } else {  function f() { return 2; }} if (false) { function g() { return 1; }}  L: {break L;function f() { return 3; } }})();',
    '(function foo() {function outer() { return f; } { f = 1; function f () {} f = ""; } })();',
    '(function foo(x) { {  function x() {} } })(1);',
    '(function foo([[x]]) { { function x() {}}})([[1]]);',
    // rest parameter shouldn't be shadowed
    '(function shadowingRestParameterDoesntBind(...x) { {  function x() {} } })(1);',
  ];

  for (const arg of validSyntax) {
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

  for (const arg of [
    '(function package() { (function gave_away_the_package() { "use strict"; }) })',
    '(function (eval) { (function () { "use strict"; })})',
  ]) {
    it(arg, () => {
      t.doesNotThrow(() => {
        parseSource(arg);
      });
    });
  }

  fail('Expressions - Functions (fail)', [
    '(function foo(007){ "use strict"; })',
    '(function foo(){ "use strict"; 007 })',
    '"use strict"; (function foo(){  007 })',
    '(function break(){})',
    '(function function(){})',
    'function f(1, async = 1){}',
    'function f("abc", async = 1){}',
    'function f(1, async = b){}',
    { code: '(function implements(){})', options: { impliedStrict: true } },
    { code: '(function public(){})', options: { impliedStrict: true } },
    { code: '(function let(){})', options: { impliedStrict: true } },
    '(async function await(){})',
    '(function f([...foo, bar] = obj){})',
    'function f([...foo,,] = obj){}',
    'function f([...[a, b],,] = obj){}',
    'function f([...bar = foo] = obj){}',
    'function f([... ...foo] = obj){}',
    'function f([...] = obj){} ',
    'function f([...,] = obj){}',
    'function f([.x] = obj){}',
    'function f([..x] = obj){}',
    'function f({,} = x){} ',
    'function f({,,} = x){}',
    'function f({foo,,} = x){}',
    'function f({,foo} = x){}',
    'function f({,,foo} = x){}',
    'function f({,,async} = await){}',
    'function f({foo,,bar} = x){}',
    'function f({...{a: b}}){}',
    'function f({...a.b}){}',
    String.raw`function p\u0061ckage() { "use strict"; }`,
    'function package() { "use strict"; }',
  ]);

  pass('Expressions - Functions (pass)', [
    'function f(async = await){}',
    'function f([async = await]){}',
    outdent`
      (function () {
        let q;
        let w;
        let e;
        if (true) [q, w, e] = [1, 2, 3].map(()=>123);
      })();
    `,

    outdent`
      function somethingAdvanced({topLeft: {x: x1, y: y1} = {}, bottomRight: {x: x2, y: y2} = {}}, p2, p3){

      }

      function unpackObject({title: title, author: author}) {
        return title + " " + author;
      }

      console.log(unpackObject({title: "title", author: "author"}));

      var unpackArray = function ([a, b, c], [x, y, z]) {
        return a+b+c;
      };

      console.log(unpackArray(["hello", ", ", "world"], [1, 2, 3]));
    `,
    'foo(function(){})',
    'foo(function f(){})',
    'foo(function*(){})',
    'foo(function* f(){})',
    'foo(async function(){})',
    '(function (x = yield) {})',
    'foo(async function f(){})',
    '(function f(...rest){})',
    '(function f(a, b, ...rest){})',
    'typeof async function f(){}',
    'x = function f(a = b,){}',
    'x = function f([x],){}',
    'x = function f({a},){}',
    'x = function f([x] = y,){}',
    'x = function f({a} = b,){}',
    'x = function f(a=b){}',
    'x = function f(a=b=c){}',
    'x = function f([]){}',
    'x = function f([] = x){}',
    'x = function f([,]){}',
    'x = function f([,] = x){}',
    'x = function f([,,]){}',
    'x = function f([,,] = x){}',
    'x = function f([foo]){}',
    'x = function f([foo] = x){}',
    'x = function f([foo,]){}',
    'x = function f([foo,] = x){}',
    'x = function f([foo,,]){}',
    'x = function f([foo,,] = x){}',
    'x = function f([,foo]){}',
    'x = function f([,foo] = x){}',
    'x = function f([,,foo]){}',
    'x = function f([,,foo] = x){}',
    'x = function f([foo,bar]){}',
    'x = function f([foo,bar] = x){}',
    'x = function f([foo,,bar]){}',
    'x = function f([foo,,bar] = x){}',
    'x = function f([foo], [bar]){}',
    'x = function f([foo] = x, [bar] = y){}',
    'x = function f([foo], b){}',
    'x = function f([foo] = x, b){}',
    'x = function f([foo], b = y){}',
    'x = function f([foo] = x, b = y){}',
    'x = function f(x, [foo]){}',
    'x = function f(x, [foo] = y){}',
    'x = function f(x = y, [foo] = z){}',
    'x = function f(x = y, [foo]){}',
    'x = function f([foo=a]){}',
    'x = function f([foo=a] = c){}',
    'x = function f([foo=a,bar]){}',
    'x = function f([foo=a,bar] = x){}',
    'x = function f([foo,bar=b]){}',
    'x = function f([foo,bar=b] = x){}',
    'x = function f([foo=a,bar=b]){}',
    'x = function f([foo=a,bar=b] = x){}',
    'x = function f([a=b=c]){}',
    'x = function f([a=b+=c]){}',
    'x = function f([a = b = c] = arr){}',
    'x = function f({b: []}) {}',
    'x = function f([{b}]) {}',
    'x = function f([a, {b: []}]) {}',
    'x = function fk({x: [a, {b: []}]}) {}',
    'x = function f([a, [b], c]) {}',
    'x = function f([...bar]){}',
    'x = function f([...bar] = obj){}',
    'x = function f([foo, ...bar]){}',
    'x = function f([foo, ...bar] = obj){}',
    'x = function f([...[a, b]]){}',
    'x = function f([...[a, b]] = obj){}',
    'x = function f([x, ...[a, b]]){}',
    'x = function f([x, ...[a, b]] = obj){}',
    'x = function f( [a=[...b], ...c]){}',
    'x = function f( [a=[...b], ...c] = obj){}',
    'f = ([[,] = g()]) => {};',
    'x = function *await() {}',
    ' f = function yield() {}',
    'f = function await() {}',
    'f = function *await() {}',
    'x = function f(yield) {}',
    'x = async function f(yield) {}',
    'x = function f(await) {}',
    'x = function *f(await) {}',

    '(function foo({x:x = 10}) {})',
    '(function foo([x1 = 1], [y1 = 2]) {})',
    '(function foo({x1:x1 = 1, x2:x2 = 2, x3:x3 = 3}) {})',
    '(function foo([x1 = 1, x2 = 2, x3 = 3]) {})',
    '(function foo({x1:x1 = 1}, [y1 = 2]) {})',
    '(function foo([x1 = 1], {y1:y1 = 2}) {})',
    '(function foo({x:x} = {x:1}) {})',

    outdent`
      function test() {
          let ID = "1|123456";
          return (([id, obj]) => ({[id = id.split('|')[1]]: {id: id}}))([ID, {}]);
      }
    `,
    '(function foo([x] = [1]) {})',
    '(function foo({x:x = 1} = {x:2}) {})',
    '(function foo([x = 1] = [2]) {})',
    '(function foo({x1:[y1 = 1]}) {})',
    '(function foo([x1, {y1:y1 = 1}]) {})',
    '(function foo({x1:[y1 = 1] = [2]} = {x1:[3]}) {})',
    '(function foo([{y1:y1 = 1} = {y1:2}] = [{y1:3}]) {})',
    '(function *fn( x1, {x2, x3}, [x4, x5], x6  ) {})',
    '(function *fn(  {x1:x1, x2:x2, x3:x3}, {y1:y1, y1:y2} ) {})',
    '(function *fn({x:x}, y  ) {})',
    '(function *fn( {x1:x1}, [y1]  ) {})',
    '(async function([,]) {})',
    '(async function({x:x}) {})',
    '(async function(y, {x:x}) {})',
    '( [x], [y], [z]) => x;',
    '( {x1:x1}, [y1]) => x;',
    '( {x}) => x;',

    outdent`
      if (a && b) {
        c.d(this.e, (ctx) => a.b(this, void 0, void 0, function* () {
          return a
        }));
      }
    `,
    '(function (eval) { function foo() { "use strict"; }})',
    '(function (eval) { (function () { "use strict"; })})',
    '(function package() { (function gave_away_the_package() { "use strict"; }) })',
    '(function([cover = (function () {}), xCover = (0, function() {})]) {})',
    '{{{ function g() {} }}}',
    '(function f({foo=a,bar} = x){})',
    '(function f({foo:a=b, bar:c=d} = x){})',
    'function f({foo:a=b}){}',
    '(function f({} = x){})',
    '(function f([...bar] = obj){})',
    '(function f([foo=a]){})',
    '(function f([foo], b = y){})',
    '(function f([foo,,]){})',

    '(function f(x = y, [foo]){})',
    '(function f([foo=a,bar=b] = x){})',
    '(function f([foo] = x, b = y){})',
    '(async function() {})',
    'x = function() {}',
    'x = function donna() {}',
    '(function () {})',
    '(function (a,b) {})',
    '(function (a = b) {})',
    '(function (love, you, donna) {})',
  ]);
});
