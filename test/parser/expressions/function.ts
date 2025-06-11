import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

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
        parseSource(`(function (${arg}) {})`, undefined, Context.None);
      });

      t.throws(() => {
        parseSource(`const foo = (function (${arg}) {})`, undefined, Context.None);
      });

      t.throws(() => {
        parseSource(`(function (${arg}) {})`, undefined, Context.Strict | Context.Module);
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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.throws(() => {
        parseSource(`function foo() { ${arg}}`, undefined, Context.None);
      });
    });

    it(`(function foo() { ${arg}})`, () => {
      t.throws(() => {
        parseSource(`(function foo() { ${arg}})`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
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
        parseSource(`(function(${arg}) {})`, undefined, Context.None);
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
    `function iceFapper(idiot) {}`,
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
    `(function foo(y, z) {{ function x() {} } })(1);`,
    // Complex parameter shouldn't be shadowed
    `(function foo(x = 0) { var x; { function x() {} } })(1);`,
    // Nested complex parameter shouldn't be shadowed
    `(function foo([[x]]) {var x; {function x() {} } })([[1]]);`,
    // Complex parameter shouldn't be shadowed
    `(function foo(x = 0) { var x; { function x() {}} })(1);`,
    // Nested complex parameter shouldn't be shadowed
    `(function foo([[x]]) { var x;{ function x() {} }  })([[1]]);`,
    // Rest parameter shouldn't be shadowed
    `(function foo(...x) { var x; {  function x() {}  } })(1);`,
    // Don't shadow complex rest parameter
    `(function foo(...[x]) { var x; { function x() {} } })(1);`,
    // Hoisting is not affected by other simple parameters
    `(function foo(y, z) {{function x() {}} })(1);`,
    // Hoisting is not affected by other complex parameters
    ` (function foo([y] = [], z) {{function x() {} } })();`,
    // Should allow shadowing function names
    `{(function foo() { { function foo() { return 0; } } })();}`,
    `{(function foo(...r) { { function foo() { return 0; } } })(); }`,
    `(function foo() { { let f = 0; (function () { { function f() { return 1; } } })(); } })();`,
    `(function foo() { var y = 1; (function bar(x = y) { { function y() {} } })();  })();`,
    `(function foo() { { function f() { return 4; } { function f() { return 5; } } }})()`,
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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  for (const arg of [
    `(function package() { (function gave_away_the_package() { "use strict"; }) })`,
    `(function (eval) { (function () { "use strict"; })})`,
  ]) {
    it(arg, () => {
      t.doesNotThrow(() => {
        parseSource(arg, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Functions (fail)', [
    ['(function foo(007){ "use strict"; })', Context.None],
    ['(function foo(){ "use strict"; 007 })', Context.None],
    ['"use strict"; (function foo(){  007 })', Context.None],
    ['(function break(){})', Context.None],
    ['(function function(){})', Context.None],
    ['function f(1, async = 1){}', Context.None],
    ['function f("abc", async = 1){}', Context.None],
    ['function f(1, async = b){}', Context.None],
    ['(function implements(){})', Context.Strict],
    ['(function public(){})', Context.Strict],
    ['(function let(){})', Context.Strict],
    ['(async function await(){})', Context.None],
    ['(function f([...foo, bar] = obj){})', Context.None],
    ['function f([...foo,,] = obj){}', Context.None],
    ['function f([...[a, b],,] = obj){}', Context.None],
    ['function f([...bar = foo] = obj){}', Context.None],
    ['function f([... ...foo] = obj){}', Context.None],
    ['function f([...] = obj){} ', Context.None],
    ['function f([...,] = obj){}', Context.None],
    ['function f([.x] = obj){}', Context.None],
    ['function f([..x] = obj){}', Context.None],
    ['function f({,} = x){} ', Context.None],
    ['function f({,,} = x){}', Context.None],
    ['function f({foo,,} = x){}', Context.None],
    ['function f({,foo} = x){}', Context.None],
    ['function f({,,foo} = x){}', Context.None],
    ['function f({,,async} = await){}', Context.None],
    ['function f({foo,,bar} = x){}', Context.None],
    ['function f({...{a: b}}){}', Context.None],
    ['function f({...a.b}){}', Context.None],
    [String.raw`function p\u0061ckage() { "use strict"; }`, Context.None],
    ['function package() { "use strict"; }', Context.None],
  ]);

  pass('Expressions - Functions (pass)', [
    [
      `function f(async = await){}`,
      Context.None,
      
    ],
    [
      `function f([async = await]){}`,
      Context.None,
      
    ],
    [
      `(function () {
        let q;
        let w;
        let e;
        if (true) [q, w, e] = [1, 2, 3].map(()=>123);
      })();`,
      Context.None,
      
    ],
    [
      `function somethingAdvanced({topLeft: {x: x1, y: y1} = {}, bottomRight: {x: x2, y: y2} = {}}, p2, p3){

        }

        function unpackObject({title: title, author: author}) {
          return title + " " + author;
        }

        console.log(unpackObject({title: "title", author: "author"}));

        var unpackArray = function ([a, b, c], [x, y, z]) {
          return a+b+c;
        };

        console.log(unpackArray(["hello", ", ", "world"], [1, 2, 3]));`,
      Context.None,
      
    ],
    [
      'foo(function(){})',
      Context.None,
      
    ],
    [
      'foo(function f(){})',
      Context.None,
      
    ],
    [
      'foo(function*(){})',
      Context.None,
      
    ],
    [
      'foo(function* f(){})',
      Context.None,
      
    ],
    [
      'foo(async function(){})',
      Context.None,
      
    ],
    [
      '(function (x = yield) {})',
      Context.None,
      
    ],
    [
      'foo(async function f(){})',
      Context.None,
      
    ],
    [
      '(function f(...rest){})',
      Context.None,
      
    ],
    [
      '(function f(a, b, ...rest){})',
      Context.None,
      
    ],
    [
      'typeof async function f(){}',
      Context.None,
      
    ],
    [
      'x = function f(a = b,){}',
      Context.None,
      
    ],
    [
      'x = function f([x],){}',
      Context.None,
      
    ],
    [
      'x = function f({a},){}',
      Context.None,
      
    ],
    [
      'x = function f([x] = y,){}',
      Context.None,
      
    ],
    [
      'x = function f({a} = b,){}',
      Context.None,
      
    ],
    [
      'x = function f(a=b){}',
      Context.None,
      
    ],
    [
      'x = function f(a=b=c){}',
      Context.None,
      
    ],
    [
      'x = function f([]){}',
      Context.None,
      
    ],
    [
      'x = function f([] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([,]){}',
      Context.None,
      
    ],
    [
      'x = function f([,] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([,,]){}',
      Context.None,
      
    ],
    [
      'x = function f([,,] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([foo]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,,]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,,] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([,foo]){}',
      Context.None,
      
    ],
    [
      'x = function f([,foo] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([,,foo]){}',
      Context.None,
      
    ],
    [
      'x = function f([,,foo] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,bar]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,bar] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,,bar]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,,bar] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([foo], [bar]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo] = x, [bar] = y){}',
      Context.None,
      
    ],
    [
      'x = function f([foo], b){}',
      Context.None,
      
    ],
    [
      'x = function f([foo] = x, b){}',
      Context.None,
      
    ],
    [
      'x = function f([foo], b = y){}',
      Context.None,
      
    ],
    [
      'x = function f([foo] = x, b = y){}',
      Context.None,
      
    ],
    [
      'x = function f(x, [foo]){}',
      Context.None,
      
    ],
    [
      'x = function f(x, [foo] = y){}',
      Context.None,
      
    ],
    [
      'x = function f(x = y, [foo] = z){}',
      Context.None,
      
    ],
    [
      'x = function f(x = y, [foo]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo=a]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo=a] = c){}',
      Context.None,
      
    ],
    [
      'x = function f([foo=a,bar]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo=a,bar] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,bar=b]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo,bar=b] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([foo=a,bar=b]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo=a,bar=b] = x){}',
      Context.None,
      
    ],
    [
      'x = function f([a=b=c]){}',
      Context.None,
      
    ],
    [
      'x = function f([a=b+=c]){}',
      Context.None,
      
    ],
    [
      'x = function f([a = b = c] = arr){}',
      Context.None,
      
    ],
    [
      'x = function f({b: []}) {}',
      Context.None,
      
    ],
    [
      'x = function f([{b}]) {}',
      Context.None,
      
    ],
    [
      'x = function f([a, {b: []}]) {}',
      Context.None,
      
    ],
    [
      'x = function fk({x: [a, {b: []}]}) {}',
      Context.None,
      
    ],
    [
      'x = function f([a, [b], c]) {}',
      Context.None,
      
    ],
    [
      'x = function f([...bar]){}',
      Context.None,
      
    ],
    [
      'x = function f([...bar] = obj){}',
      Context.None,
      
    ],
    [
      'x = function f([foo, ...bar]){}',
      Context.None,
      
    ],
    [
      'x = function f([foo, ...bar] = obj){}',
      Context.None,
      
    ],
    [
      'x = function f([...[a, b]]){}',
      Context.None,
      
    ],
    [
      'x = function f([...[a, b]] = obj){}',
      Context.None,
      
    ],
    [
      'x = function f([x, ...[a, b]]){}',
      Context.None,
      
    ],
    [
      'x = function f([x, ...[a, b]] = obj){}',
      Context.None,
      
    ],
    [
      'x = function f( [a=[...b], ...c]){}',
      Context.None,
      
    ],
    [
      'x = function f( [a=[...b], ...c] = obj){}',
      Context.None,
      
    ],
    [
      'f = ([[,] = g()]) => {};',
      Context.None,
      
    ],
    [
      'x = function *await() {}',
      Context.None,
      
    ],
    [
      ' f = function yield() {}',
      Context.None,
      
    ],
    [
      'f = function await() {}',
      Context.None,
      
    ],
    [
      'f = function *await() {}',
      Context.None,
      
    ],
    [
      'x = function f(yield) {}',
      Context.None,
      
    ],
    [
      'x = async function f(yield) {}',
      Context.None,
      
    ],
    [
      'x = function f(await) {}',
      Context.None,
      
    ],
    [
      'x = function *f(await) {}',
      Context.None,
      
    ],

    [
      '(function foo({x:x = 10}) {})',
      Context.None,
      
    ],
    [
      '(function foo([x1 = 1], [y1 = 2]) {})',
      Context.None,
      
    ],
    [
      '(function foo({x1:x1 = 1, x2:x2 = 2, x3:x3 = 3}) {})',
      Context.None,
      
    ],
    [
      '(function foo([x1 = 1, x2 = 2, x3 = 3]) {})',
      Context.None,
      
    ],
    [
      '(function foo({x1:x1 = 1}, [y1 = 2]) {})',
      Context.None,
      
    ],
    [
      '(function foo([x1 = 1], {y1:y1 = 2}) {})',
      Context.None,
      
    ],
    [
      '(function foo({x:x} = {x:1}) {})',
      Context.None,
      
    ],
    [
      `function test() {
        let ID = "1|123456";
        return (([id, obj]) => ({[id = id.split('|')[1]]: {id: id}}))([ID, {}]);
    }`,
      Context.None,
      
    ],
    [
      '(function foo([x] = [1]) {})',
      Context.None,
      
    ],
    [
      '(function foo({x:x = 1} = {x:2}) {})',
      Context.None,
      
    ],
    [
      '(function foo([x = 1] = [2]) {})',
      Context.None,
      
    ],
    [
      '(function foo({x1:[y1 = 1]}) {})',
      Context.None,
      
    ],
    [
      '(function foo([x1, {y1:y1 = 1}]) {})',
      Context.None,
      
    ],
    [
      '(function foo({x1:[y1 = 1] = [2]} = {x1:[3]}) {})',
      Context.None,
      
    ],
    [
      '(function foo([{y1:y1 = 1} = {y1:2}] = [{y1:3}]) {})',
      Context.None,
      
    ],
    [
      '(function *fn( x1, {x2, x3}, [x4, x5], x6  ) {})',
      Context.None,
      
    ],
    [
      '(function *fn(  {x1:x1, x2:x2, x3:x3}, {y1:y1, y1:y2} ) {})',
      Context.None,
      
    ],
    [
      '(function *fn({x:x}, y  ) {})',
      Context.None,
      
    ],
    [
      '(function *fn( {x1:x1}, [y1]  ) {})',
      Context.None,
      
    ],
    [
      '(async function([,]) {})',
      Context.None,
      
    ],
    [
      '(async function({x:x}) {})',
      Context.None,
      
    ],
    [
      '(async function(y, {x:x}) {})',
      Context.None,
      
    ],
    [
      '( [x], [y], [z]) => x;',
      Context.None,
      
    ],
    [
      '( {x1:x1}, [y1]) => x;',
      Context.None,
      
    ],
    [
      '( {x}) => x;',
      Context.None,
      
    ],

    [
      `if (a && b) {
      c.d(this.e, (ctx) => a.b(this, void 0, void 0, function* () {
        return a
      }));
    }`,
      Context.None,
      
    ],
    [
      '(function (eval) { function foo() { "use strict"; }})',
      Context.None,
      
    ],
    [
      '(function (eval) { (function () { "use strict"; })})',
      Context.None,
      
    ],
    [
      '(function package() { (function gave_away_the_package() { "use strict"; }) })',
      Context.None,
      
    ],
    [
      '(function([cover = (function () {}), xCover = (0, function() {})]) {})',
      Context.None,
      
    ],
    [
      '{{{ function g() {} }}}',
      Context.None,
      
    ],
    [
      '(function f({foo=a,bar} = x){})',
      Context.None,
      
    ],
    [
      '(function f({foo:a=b, bar:c=d} = x){})',
      Context.None,
      
    ],
    [
      'function f({foo:a=b}){}',
      Context.None,
      
    ],
    [
      '(function f({} = x){})',
      Context.None,
      
    ],
    [
      '(function f([...bar] = obj){})',
      Context.None,
      
    ],
    [
      '(function f([foo=a]){})',
      Context.None,
      
    ],
    [
      '(function f([foo], b = y){})',
      Context.None,
      
    ],
    [
      '(function f([foo,,]){})',
      Context.None,
      
    ],

    [
      '(function f(x = y, [foo]){})',
      Context.None,
      
    ],
    [
      '(function f([foo=a,bar=b] = x){})',
      Context.None,
      
    ],
    [
      '(function f([foo] = x, b = y){})',
      Context.None,
      
    ],
    [
      '(async function() {})',
      Context.None,
      
    ],
    [
      'x = function() {}',
      Context.None,
      
    ],
    [
      'x = function donna() {}',
      Context.None,
      
    ],
    [
      '(function () {})',
      Context.None,
      
    ],
    [
      '(function (a,b) {})',
      Context.None,
      
    ],
    [
      '(function (a = b) {})',
      Context.None,
      
    ],
    [
      '(function (love, you, donna) {})',
      Context.None,
      
    ],
  ]);
});
