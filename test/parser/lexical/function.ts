import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - Function', () => {
  fail('Lexical - Function (fail)', [
    ['function f(x) {let x}', Context.OptionsLexical],
    ['{  let f = 123;  if (false) ; else function f() {}}', Context.OptionsLexical],
    ['function f(x) { let x }', Context.OptionsLexical],
    ['function f(x) { const x = y }', Context.OptionsLexical],
    ['function f(a, a) {}', Context.Strict | Context.OptionsLexical],
    ['function f(a, b, a) {}', Context.Strict | Context.OptionsLexical],
    ['function f(b, a, a) {}', Context.Strict | Context.OptionsLexical],
    ['function f(a, a, b) {}', Context.Strict | Context.OptionsLexical],
    ['function f(b, a, b, a) {}', Context.Strict | Context.OptionsLexical],
    ['function f(b, a, b, a, [fine]) {}', Context.Strict | Context.OptionsLexical],
    ['function f(b, a, b, a = x) {}', Context.Strict | Context.OptionsLexical],
    ['function f(b, a, b, ...a) {}', Context.Strict | Context.OptionsLexical],
    ['function f(a, a) {"use strict"}', Context.OptionsLexical],
    ['function f(a, b, a) {"use strict"}', Context.OptionsLexical],
    ['function f(b, a, a) {"use strict"}', Context.OptionsLexical],
    ['function f(b, a, b, a) {"use strict"}', Context.OptionsLexical],
    ['function f(b, a, b, a, [fine]) {"use strict"}', Context.OptionsLexical],
    ['function f(b, a, b, a = x) {"use strict"}', Context.OptionsLexical],
    ['function f(b, a, b, ...a) {"use strict"}', Context.OptionsLexical],
    ['function x([public], public){}', Context.OptionsLexical],
    ['function f([a, a]) {}', Context.OptionsLexical],
    ['function f([a, b, a]) {}', Context.OptionsLexical],
    ['function f([b, a, a]) {}', Context.OptionsLexical],
    ['function f([a, a, b]) {}', Context.OptionsLexical],
    ['function f([b, a, b, a]) {}', Context.OptionsLexical],
    ['function f([b, a], b) {}', Context.OptionsLexical],
    ['function f([b, a], {b}) {}', Context.OptionsLexical],
    ['function f([b, a], b=x) {}', Context.OptionsLexical],
    ['function f([b, a], ...b) {}', Context.OptionsLexical],
    ['function f(){ let x; var x; }', Context.OptionsLexical],
    ['function f(){ var x; let x; }', Context.OptionsLexical],
    ['function f(){ const x = y; var x; }', Context.OptionsLexical],
    ['function f(){ var x; const x = y; }', Context.OptionsLexical],
    ['function f(){ let x; function x(){} }', Context.OptionsLexical],
    ['function f(){ function x(){} let x; }', Context.OptionsLexical],
    ['function f(){ const x = y; function x(){} }', Context.OptionsLexical],
    ['function f(){ function x(){} const x = y; }', Context.OptionsLexical],
    ['function f(){} function f(){}', Context.Module | Context.OptionsLexical],
    ['function a() { const x = 1; var x = 2; }', Context.OptionsLexical],
    ['function* f(a) { let a; }', Context.OptionsLexical],
    ['function* f([a]){ let a; }', Context.OptionsLexical],
    ['function* f({a}){ let a; }', Context.OptionsLexical],
    ['function a() { const x = 1; var x = 2; }', Context.OptionsLexical],
    ['function a() { const x = 1; var x = 2; }', Context.OptionsLexical],
    ['function a() { const x = 1; var x = 2; }', Context.OptionsLexical],
    ['{ function f(){} function f(){} }', Context.OptionsLexical],
    ['function f(){  for (var x;;); const x = 1  }', Context.OptionsLexical],
    ['function foo({x:x, x:x}) {}', Context.OptionsLexical],
    ['function foo({x:x}, {x:x}) {}', Context.OptionsLexical],
    ['function foo() { return {}; }; let {x:foo()} = {};', Context.OptionsLexical],
    ['function foo([x, x]) {}', Context.OptionsLexical],
    ['function foo([x], [x]) {}', Context.OptionsLexical],
    ['function foo([x], {x:x}) {}', Context.OptionsLexical],
    ['function foo([x, x]) {}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['function foo([x], [x]) {}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['function foo([x], {x:x}) {}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['function foo([x], x) {}', Context.OptionsLexical],
    ['function foo(x, [x]) {}', Context.OptionsLexical],
    ['function g() { { var x; let x; } }', Context.OptionsLexical],
    ['function f() { { { var x; } let x; } }', Context.OptionsLexical],
    ['function f() { { { var x; } let x; } }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['function f() { { var x; let x; } }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['function f() { { var x; let x; } }', Context.OptionsLexical],
    ['(function (e) { var e; const e = undefined; });', Context.OptionsLexical],
    ['function x() {}const y = 4, x = 5;', Context.OptionsLexical],
    ['function x() {}const y = 4, x = 5;', Context.OptionsLexical],
    ['function x() {}const x = function() {};', Context.OptionsLexical],
    ['function foo({x:{z:[z1]}}, z1) {}', Context.OptionsLexical],
    ['function foo([x]) { let x = 10;}', Context.OptionsLexical],
    ['function foo([x], [x]) {}', Context.OptionsLexical],
    ['(function() { "use strict"; { const f = 1; var f; } })', Context.OptionsLexical],
    ['function foo([x, x]) {}', Context.OptionsLexical],
    ['function x(x = class x {}) { const x = y; }', Context.OptionsLexical],
    ['async function af(x) { let x; }', Context.OptionsLexical],
    ['async function af(x) { const x = 1; }', Context.OptionsLexical],
    ['function foo([x]) { let x = 10;}', Context.OptionsLexical],
    ['async function af(x) { class x { } }', Context.OptionsLexical],
    ['function fooa(a = b, a) {}', Context.OptionsLexical],
    ['function f(x = 0, x) {}', Context.OptionsLexical],
    ['0, function(x = 0, x) {};', Context.OptionsLexical],
    ['function foo(a, a = b) {}', Context.OptionsLexical],
    ['function f(x = 0, x) {}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['0, function(x = 0, x) {};', Context.OptionsLexical | Context.Strict | Context.Module],
    ['function foo(a, a = b) {}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['function f([foo], [foo]){}', Context.OptionsLexical],
    ['function f([foo] = x, [foo] = y){}', Context.OptionsLexical],
    ['function f({foo} = x, {foo}){}', Context.OptionsLexical],
    ['function f([{foo}] = x, {foo}){}', Context.OptionsLexical],
    ['function f([{foo}] = x, [{foo}]){}', Context.OptionsLexical],
    ['function f([{foo}] = x, [{foo}]){}', Context.OptionsWebCompat | Context.OptionsLexical],
    ['function f(b, a, b, a = x) {}', Context.OptionsLexical],
    ['let x = a; function x(){};', Context.OptionsLexical],
    ['const x = a; function x(){};', Context.OptionsLexical],
    ['function f([b, a], b) {}', Context.Strict | Context.OptionsLexical],
    ['function f([b, a], {b}) {}', Context.Strict | Context.OptionsLexical],
    ['function f([b, a], b=x) {}', Context.Strict | Context.OptionsLexical],
    ['function f([b, a, b, a]) {}', Context.Strict | Context.OptionsLexical],
    ['function f([a, a, b]) {}', Context.Strict | Context.OptionsLexical],
    ['function f([b, a], ...b) {}', Context.Strict | Context.OptionsLexical],
    ['(function() { { function* foo() {} function* foo() {} } })()', Context.OptionsLexical],
    ['(function() { { function* foo() {} function foo() {} } })()', Context.OptionsLexical],
    ['(function() { { function foo() {} function* foo() {} } })()', Context.OptionsLexical],
    ['(function() { { function* foo() {} function* foo() {} } })()', Context.OptionsLexical | Context.OptionsWebCompat],
    ['(function() { { function* foo() {} function foo() {} } })()', Context.OptionsLexical | Context.OptionsWebCompat],
    ['(function() { { function foo() {} function* foo() {} } })()', Context.OptionsLexical | Context.OptionsWebCompat],
    ['(function() { { async function foo() {} async function foo() {} } })()', Context.OptionsLexical],
    ['function f(...rest, b){}', Context.OptionsLexical],
    ['let x; { var x; }', Context.OptionsLexical],
    ['{ var x; } let x;', Context.OptionsLexical],
    ['function f(...a,){}', Context.OptionsLexical],
    ['function f(...a = x,){}', Context.OptionsLexical],
    ['function f(...a = x,){}', Context.OptionsLexical],
    ['function f(...a,){}', Context.OptionsLexical],
    ['function f(...a,){}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['function f(...a = x,){}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['function f(...a = x,){}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['function f(...a,){}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['function f(...a = x,){}', Context.OptionsLexical],
    ['function f({a: x, b: x}) {}', Context.OptionsLexical],
    ['function f({x, x}) {}', Context.OptionsLexical],
    ['function f(x, {a: {b: x}}) {}', Context.OptionsLexical],
    ['function f(x, {a: {x}}) {}', Context.OptionsLexical],
    ['function f(x, {15: x}) {}', Context.OptionsLexical],
    ['function f({a: x, ...{x}}) {}', Context.OptionsLexical],
    ['function f({a: x, ...x}) {}', Context.OptionsLexical],
    ['function f(x, {a: x}) {}', Context.OptionsLexical],
    ['function f(x, {"foo": x}) {}', Context.OptionsLexical],
    ['"use strict"; function foo(bar, bar){}', Context.OptionsLexical],
    ['function foo(bar, bar){}', Context.OptionsLexical | Context.Module | Context.Strict],
    ['function f(x) { let x }', Context.OptionsLexical],
    ['function f(x) { let x }', Context.OptionsLexical | Context.OptionsWebCompat],
    ['function f(a, b, a, c = 10) { }', Context.OptionsLexical],
    ['function f(a, b = 10, a) { }', Context.OptionsLexical],
    ['function foo(a) { let a; }', Context.OptionsLexical],
    ['function foo(a, b = () => a) { const b = 1; };', Context.OptionsLexical],
    ['function foo(a, b = () => a) { let b; };', Context.OptionsLexical],
    ['function foo(arguments, b = () => arguments) { let arguments; };', Context.OptionsLexical],
    ['function foo(arguments, b = () => arguments) { const arguments = 1; };', Context.OptionsLexical],
    ['(a, b = () => a) => { let b; };', Context.OptionsLexical],
    ['(a, b = () => a) => { const b = 1; };', Context.OptionsLexical],
    ['(arguments, b = () => arguments) => { let arguments; };', Context.OptionsLexical],
    ['function foo({a, b = () => a}) { let b; };', Context.OptionsLexical],
    ['function foo([a], b = () => a) { const b = 1; };', Context.OptionsLexical],
    ['function foo([arguments, b = () => arguments]) { let arguments; };', Context.OptionsLexical],
    ['function foo() {try {} catch({x:x, x:x}) {} }', Context.OptionsLexical],
    ['function foo() {try {} catch([x, x]) {} }', Context.OptionsLexical],
    ['function foo() {try {} catch({z1, x:{z:[z1]}}) {} }', Context.OptionsLexical],
    ['function foo() {try {} catch([x]) { let x = 10;} }', Context.OptionsLexical],
    ['function foo() {try {} catch([x]) { function x() {} } }', Context.OptionsLexical],
    ['function foo() {try {} catch([x]) { var x = 10;} }', Context.OptionsLexical]
  ]);

  for (const arg of [
    '{ function* foo() {}; }; let foo;',
    'function f(x) { { let x } }',
    'function f(x) { { const x = y } }',
    'function f(x) { { var x } }',
    'function f(f) { }',
    'function f([f]) { }',
    'function f(x) { function x() {} }',
    'function f(x) { var x; }',
    'function f() {{let f}}',
    'function f(){ function x(){} var x = y; }',
    'function f(){ var x = y; function x(){} }',
    'function f(){ var f }',
    'function f(){ let f }',
    'x=function f(){ var f }',
    'x=function f(){ let f }',
    'x={f(){ var f }}',
    'x={f(){ let f }}',
    'function f(){} function f(){}',
    'function g() {  function f(){} function f(){} }',
    'async function f(){ var f }',
    'async function f(){ let f }',
    'x=async function f(){ var f }',
    'x=async function f(){ let f }',
    'x={async f(){ var f }}',
    'x={async f(){ let f }}',
    'function *f(){ var f }',
    'function *f(){ let f }',
    'x={*f(){ var f }}',
    'x={*f(){ let f }}',
    'async function *f(){ var f }',
    'x={async *f(){ var f }}',
    'x={async *f(){ let f }}',
    'function foo({x:x}, {y:y}, {z:z}) {}',
    'function f(a){ var a }',
    'function foo([x]) { var x = 10;}',
    `(function F1(x) {
      function F2(y) {
        var z = x + y;
        {
          var w =  5;
          var v = "Capybara";
          var F3 = function(a, b) {
            function F4(p) {
              debugger;
              return p + a + b + z + w + v.length;
            }
            return F4;
          }
          return F3(4, 5);
        }
      }
      return F2(17);
    })(5)();`,
    `(function() {
      var v1 = 3;
      var v2 = 4;
      let l0 = 0;
      {
        var v3 = 5;
        let l1 = 6;
        let l2 = 7;
        {
          var v4 = 8;
          let l3 = 9;
          {
            var v5 = "Cat";
            let l4 = 11;
            var v6 = l4;
            return function() {
              debugger;
              return l0 + v1 + v3 + l2 + l3 + v6;
            };
          }
        }
      }
    })()();`,
    'function g() { var x = 1; { let x = 2; function g() { x; } g(); } }',
    'function f(one) { class x { } { class x { } function g() { one; x; } g() } } f()',
    `function f(x) {
      var z;
      switch (x) {
        case 1:
          let y = 1;
        case 2:
          y = 2;
        case 3:
          z = y;
      }
      return z;
    }`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    '{  let f = 123;  if (false) ; else function f() {  }  }',
    'function f(a){ var a }',
    'function f(x) { { var x } }',
    // Lexical shadowing allowed, no hoisting
    `(function() {
    function* x() { yield 1; }
    { function* x() { yield 2 } }
  })();`,
    `function a() {}
function a() {}`,
    `(function() {
    var y;
    async function x() { y = 1; }
    { async function x() { y = 2; } }
    x();
  })();`,
    `(function () { { let x = 'let x'; } { let y = 'let y'; } })();`,
    'function foo({x:x}, {y:y}, {z:z}) {}',
    `(function () { { var x = 'var x'; } { var y = 'var y'; } })();`,
    'function foo([x]) { var x = 10;}',
    'async function af(x) { function x() { } }',
    'async function af(x) { var x; }',
    'function g() { var x = 1; { let x = 2; function g() { x; } g(); } }',
    'function f(one) { class x { } { class x { } function g() { one; x; } g() } } f()',
    'function *f(){} { function *f(){} }',
    'function f(x) { { let x } }',
    'async function *f(){} { async function *f(){} }',
    'async function f(){} { async function f(){} }',
    'function f(x) { var x }',
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
    // rest parameter shouldn't be shadowed
    '(function shadowingRestParameterDoesntBind(...x) { {  function x() {} } })(1);',
    `{(function foo(...r) { { function foo() { return 0; } } })(); }`,
    `(function foo() { { let f = 0; (function () { { function f() { return 1; } } })(); } })();`,
    `(function foo() { var y = 1; (function bar(x = y) { { function y() {} } })();  })();`,
    `(function foo() { { function f() { return 4; } { function f() { return 5; } } }})()`,
    '(function foo(a = 0) { { let y = 3; function f(b = 0) { y = 2; } f(); } })();',
    '(function conditional() {  if (true) { function f() { return 1; } } else {  function f() { return 2; }} if (false) { function g() { return 1; }}  L: {break L;function f() { return 3; } }})();',
    '(function foo() {function outer() { return f; } { f = 1; function f () {} f = ""; } })();',
    '(function foo(x) { {  function x() {} } })(1);',
    '(function foo([[x]]) { { function x() {}}})([[1]]);',
    'function f(one) { class x { } { class x { } function g() { one; x; } g() } } f()'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical | Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'function f(a, a) {}',
    'function f(a, b, a) {}',
    'function f(b, a, a) {}',
    'function f([{foo}] = x, {foo}){}',
    'function f([{foo}] = x, [{foo}]){}',
    'function f([{foo}] = x, [{foo}]){}',
    'function f(b, a, b, a = x) {}',
    'let x = a; function x(){};',
    'function f(x) { { let x } }',
    'const x = a; function x(){};',
    'function f([b, a], b) {}',
    'function f([b, a], {b}) {}',
    // rest parameter shouldn't be shadowed
    '(function shadowingRestParameterDoesntBind(...x) { {  function x() {} } })(1);',
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
    'function f(x) { var x }',
    `(function() {
      var x = 1;
      (() => x);
      var y = "y";
      var z = "z";
      (function() {
        var x = 2;
        (function() {
          y;
          debugger;
        })();
      })();
      return y;
    })();`,
    `(function() {
      var x = 1;
      (() => x);
      var y = "y";
      var z = "z";
      (function() {
        var x = 2;
        (() => {
          y;
          a;
          this;
          debugger;
        })();
      })();
      return y;
    })();`,
    `function f9() {
      let a1= "level1";
      try {
          throw "level2";

      } catch(e) {
          let a1= "level2";
              try {
              throw "level3";
          } catch(e1) {
              a1 += "level3";
          }
      }
    };`,
    `function f5()
    {
        var a1 = 10;
        let a2 = "a2";
        const a4 = "a4_const";
        let a5 = "a5_let";
        {
            let a1 = "level1";
            let a2 = 222;
            const a3 = "a3_const";
            let a4 = "a4_level1";
            a3;
        }

        return 10;
    }`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict);
      });
    });
  }
});
