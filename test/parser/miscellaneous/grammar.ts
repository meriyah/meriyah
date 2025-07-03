import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Cover grammar', () => {
  const destructuringForms = [
    (a: any) => `${a} = [];`,
    (a: any) => `var ${a} = [];`,
    (a: any) => `let ${a} = [];`,
    (a: any) => `const ${a} = [];`,
    (a: any) => `(${a}) => {};`,
    (a: any) => `async (${a}) => {};`,
    (a: any) => `(${a} = []) => {};`,
    (a: any) => `function f(${a}) {}`,
    (a: any) => `function *f(${a}) {}`,
    (a: any) => `async function f(${a}) {}`,
    (a: any) => `(function f(${a}) {})`,
    (a: any) => `(async function *f(${a}) {})`,
  ];

  for (const arg of [
    '[...r, ]',
    '[a, ...r, ]',
    '[a = 0, ...r, ]',
    '[[], ...r, ]',
    '[[...r,]]',
    '[[...r,], ]',
    '[[...r,], a]',
  ]) {
    for (const fn of destructuringForms) {
      it(fn(`${arg}`), () => {
        t.throws(() => {
          parseSource(fn(`${arg}`));
        });
      });

      it(fn(`${arg}`), () => {
        t.throws(() => {
          parseSource(fn(`${arg}`), { webcompat: true });
        });
      });
    }
  }

  for (const arg of ['[, ]', '[a, ]', '[[], ]']) {
    for (const fn of destructuringForms) {
      it(fn(`${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`${arg}`));
        });
      });
    }
  }

  const functions = [
    (p: any) => `function f(${p}) {}`,
    (p: any) => `function* g(${p}) {}`,
    (p: any) => `async function* g(${p}) {}`,
    (p: any) => `(function* g(${p}) {})`,
    (p: any) => `(async function* g(${p}) {})`,
    (p: any) => `({m(${p}) {}});`,
    (p: any) => `(class {m(${p}) {}});`,
    (p: any) => `(${p}) => {};`,
    (p: any) => `((${p}) => {});`,
    (p: any) => `async (${p}) => {};`,
    (p: any) => `(async (${p}) => {});`,
  ];

  for (const arg of [
    '[]',
    '[a]',
    '[a, b]',
    '[a, ...b]',
    '[...a]',
    '[...[]]',
    '{}',
    '{p: a}',
    '{p: a = 0}',
    '{p: {}}',
    '{p: a, q: b}',
    '{a}',
    '{a, b}',
    '{a = 0}',
  ]) {
    for (const fn of functions) {
      it(fn(`${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`${arg}`));
        });
      });

      it(fn(`x, ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`x, ...${arg}`));
        });
      });

      it(fn(`x = 0, ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`x = 0, ...${arg}`));
        });
      });

      it(fn(`x = 0, ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`x = 0, ...${arg}`), { webcompat: true });
        });
      });

      it(fn(`x = 0, y = 0, ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`x = 0, y = 0, ...${arg}`));
        });
      });

      it(fn(`[], ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`[], ...${arg}`));
        });
      });

      it(fn(`[x], ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`[x], ...${arg}`));
        });
      });

      it(fn(`[x = 0], ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`[x = 0], ...${arg}`));
        });
      });

      it(fn(`{}, ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`{}, ...${arg}`));
        });
      });

      it(fn(`{p: x}, ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`{p: x}, ...${arg}`));
        });
      });

      it(fn(`{x}, ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`{x}, ...${arg}`));
        });
      });

      it(fn(`{x = 0}, ...${arg}`), () => {
        t.doesNotThrow(() => {
          parseSource(fn(`{x = 0}, ...${arg}`));
        });
      });
    }
    for (const fn of functions) {
      it(fn('...'), () => {
        t.throws(() => {
          parseSource(fn('...'), { webcompat: true });
        });
      });

      it(fn('...['), () => {
        t.throws(() => {
          parseSource(fn('...['), { webcompat: true });
        });
      });

      it(fn('...{'), () => {
        t.throws(() => {
          parseSource(fn('...{'), { webcompat: true });
        });
      });
      /*
      it(fn(`...[p.q]`), () => {
        t.throws(() => {
          parseSource(fn(`...[p.q]`), undefined, Context.OptionsWebCompat);
        });
      });
      */

      it(fn('...[0]'), () => {
        t.throws(() => {
          parseSource(fn('...[0]'), { webcompat: true });
        });
      });
    }
  }

  for (const arg of [
    '[x] += 0',
    '[...x, ] = 0;',
    '[, x, ...y,] = 0',
    '[...x, ...y] = 0',
    '[...x, y] = 0',
    '[0,{a=0}] = 0',
    'f({x = 0})',
    '[...x,,] = 0',
    '[{a=0},{b=0},0] = 0',
    '[{a=0},...0]',
    '[...0,a]=0',
    '[...0,{a=0}]=0',
    '[...0,...{a=0}]=0',
    '[...{a=0},]',
    '[...{a=0},]=0',
    '[0] = 0',
    '[a, ...b, {c=0}]',
    '{a = [...b, c]} = 0',
    '[a, ...(b = c)] = 0',
    '([a]) = 0',
    '((x,x)) = 5',
    '(((x,x))) = 5',
    '({a = 0});',
    '({a} += 0);',
    '[a, ...b, {c=0}]',
    '{a = [...b, c]} = 0',
    '[{a=0},...0]',
    '({a,,} = 0)',
    '({,a,} = 0)',
    '({a,,a} = 0)',
    '({function} = 0)',
    '({a:function} = 0)',
    '({a:for} = 0)',
    '({ x: { get x() {} } } = { x: {} });',
    "({'a'} = 0)",
    '({var} = 0)',
    '({a.b} = 0)',
    '({0} = 0)',
    '{ x : ++y }',
    '{ x : y * 2 }',

    'var x, y, z; for (x in [(function() {})] = {});',
    'var x, y, z; for (x in [(foo())] = {});',
    'var x, y, z; for (x in { x: function() {} } = {});',
    'var x, y, z; for (x in [x, y] = "str" = {});',
    'var x, y, z; for (x in {x: (y) => z} = {});',
    'var x, y, z; for (x in {x: async (y) => z} = {});',
    'var x, y, z; for (x in [...++x] = {});',
    'var x, y, z; for (x in [...x--] = {});',
    'var x, y, z; for (x in [...!x] = {});',
    'var x, y, z; for (x in [...x + y] = {});',
    'var x, y, z; for (x in ([a] = []) = {});',
    'var x, y, z; for (x in ([a] = []) = {});',
    'var x, y, z; for (x in [ ...([a] = []) = {});',
    'var x, y, z; for (x in [ (++y) ] = {});',
    'var x, y, z; for (x in [ ...[ ( [ a ] ) ] ] = {});',
    'var x, y, z; for (x in [ ([a]) ] = {});',
    'var x, y, z; for (x in [ (...[a]) ] = {});',
    'var x, y, z; for (x in [ x += x ] = {});',
    'var x, y, z; for (x in { foo: x += x } = {});',
    'var x, y, z; for (x in ({ x: x4, x: (x+=1e4) } = {}) = {});',
    'var x, y, z; for (x in (({ x: x4, x: (x+=1e4) } = {})) = {});',
    'var x, y, z; for (x in (({ x: y } = {})) = {});',
    'var x, y, z; for (x in (({ x: y }) = {}) = {});',
    'var x, y, z; for (x in ([a]) = {});',
    'var x, y, z; for (x in (([a] = [])) = {});',
    'var x, y, z; for (x in {x: async (y) => z} = {});',
    'var x, y, z; ([(50)] = {});',
    'var x, y, z; ({ x: (50) } = {});',
    'var x, y, z; ([(x,y) => z] = {});',
    'var x, y, z; ([...z = 1] = {});',
    'var x, y, z; ([...++x] = {});',
    'var x, y, z; ([...x--] = {});',
    'var x, y, z; ([ ...([a]) ] = {});',
    'var x, y, z; ([ (++y) ] = {});',
    'var x, y, z; ([ ([a]) ] = {});',
    'var x, y, z; ([ ...(++y) ] = {});',
    'var x, y, z; ([x()] = {});',
    'var x, y, z; ({ new.target } = {});',
    'var x, y, z; ({ x : ++y } = {});',
    'let x, y, z; ([ ...(++y) ] = {});',
    'const x, y, z; ([x()] = {});',
    'let x, y, z; ({ new.target } = {});',
    'const x, y, z; ({ x : ++y } = {});',
    'var x, y, z; ( { x : ++y } = {});',
    'var x, y, z; ( { get x() {} } = {});',
    'var x, y, z; ( { set x() {} } = {});',
    'var x, y, z; ( { x: y() } = {});',
    'var x, y, z; ( { x: this = 1 } = {});',
    'var x, y, z; ( { x: super } = {});',
    'var x, y, z; ( [--x = 1] = {});',
    'var x, y, z; ( [x--] = {});',
    'var x, y, z; ( [new.target = 1] = {});',
    'var x, y, z; ( [(50)] = {});',
    'var x, y, z; ( [(function() {})] = {});',
    '({a: {d = 1,c = 1}.c = 2} = {});',
    '{ get x() {} }',
    '{ set x() {} }',
    '{ x: y() }',
    '{ this }',
    '{ x: this }',
    '{ x: this = 1 }',
    '{ super }',
    'var ([x]) = 0',
    'try { } catch ([a] = []) { }',
    '({set a([a.b]){}})',
    '({set a([a.b]){}})',
    'function* a([a.b]) {}',
    '{ x: super }',
    '{ x: super = 1 }',
    '{ new.target }',
    '{ x: new.target }',
    '{ x: new.target = 1 }',
    '{ import.meta }',
    '{ x: import.meta }',
    '{ x: import.meta = 1 }',
    '[x--]',
    '[--x = 1]',
    '({ x: [(x, y)] } = { x: [] });',
    '[x()]',
    '(y, x) = "string";',
    '((x)) = 8',
    '(a + b) = c',
    'a + b *= c',
    '(a + b) *= c',
    'a /= (b + c)',
    '(a + b) /= c',
    'a /= (b + c)',
    '(a %= b) %= c',
    '(a += b) + c',
    '(a -= b) -= c',
    '(a + b) ^= c',
    '(-1) = a',
    '(- 0) = a',
    '(-1) *= a',
    '(- 0) *= a',
    '1 *= a',
    '(-1) /= a',
    '(- 0) /= a',
    '1 /= a',
    '(-1) %= a',
    '[...{ get x() {} }] = [[]];',
    '(- 0) += a',
    '(-1) += a',
    '(-1) <<= a',
    '(- 0) |= a',
    '1 |= a',
    '(a.x++)++',
    'a: b: c: (1 + null) = 3',
    'a: ((typeof (a))) >>>= a || b.l && c',
    'function f() { a: ((typeof (a))) >>>= a || b.l && c }',
    's: l: a[2](4 == 6, 5 = 6)(f[4], 6)',
    'const x_x = 6 /= 7 ? e : f',
    'for (var a = 5 += 6 in b) break',
    '((window.x)) = 9;',
    '((window["x"])) = 10;',
    '(true ? x : y) = "FAIL"; ',
    'x++ = "FAIL";',
    'window.x = 2;',
    'window["x"] = 3;',
    '(x) = 4;',
    'y, x = 7;',
    '[this]',
    '[this = 1]',
    'var {a};',
    '[new.target]',
    '({"x": [y].z(0)})',
    '({"x": [y].z(0)} = x)',
    '({"x": [y].z(0)}) => x',
    '[new.target = 1]',
    '[import.meta]',
    'var [a.b] = 0',
    '(function() { [a] = [...new.target] = []; })',
    '(function() { [new.target] = []; })',
    '(function() { [a] = [new.target] = []; })',
    '(function() { ({ a: new.target] = {a: 0}); })',
    '(function() { ({ a } = { a: new.target } = {}); })',
    '({ new: super() } = {})',
    '({ new: x } = { new: super() } = {})',
    '[super()] = []',
    '[x] = [super()] = []',
    '[...super()] = []',
    '[x] = [...super()] = []',
    'let x, y; [y] = [x = super()] = []',
    'let x, y; ({ x: y } = { x } = { x: super() })',
    'var ([x]) = 0',
    '[import.meta = 1]',
    'var [a--] = [];',
    'var [++a] = [];',
    'const [a];',
    'var [1, a] = [];',
    '[super]',
    '[super = 1]',
    '[function f() {}]',
    '[async function f() {}]',
    '[function* f() {}]',
    '([arguments] = []);',
    '({a: {a=b}.x}) => x',
    '([{a=b}.x]) => x',
    'var a, b; ({a:({a}), b:((({b})))} = {a:{}, b:{}} );',
    'var a, b; [({a}), (((({b}))))] = [{}, {}];',
    'var a, b; [([a]), (((([b]))))] = [[], []];',
    'var a; [([a])] = [[]];',
    'const [[(a)], ((((((([b])))))))] = [[],[]];',
    'var [[(a)], ((((((([b])))))))] = [[],[]];',
    '[{ get x() {} }] = [{}];',
    '[...x, y] = [];',
    '({ident: {x}.join("")}) => x',
    '[...[(x, y)]] = [[]];',
    '"use strict"; ({ eval } = {});',
    'a = { x: x = yield } = value;',
    '"use strict";  ({ x: unresolvable } = {});',
    'class foo { method() { [super["x"]] = []; } }',
    'class foo { method() { [super.x] = []; } }',
    '[ c ] = [1];',
    '"use strict";  [ x ] = [];',
    '[50]',
    'var {...rest, ...rest2} = a;',
    'var {...rest,} = obj;',
    'var {...rest, a} = b;',
    '[(50)]',
    '[(function() {})]',
    '[(async function() {})]',
    '[(function*() {})]',
    '[(foo())]',
    '{ x: 50 }',
    '{ x: (50) }',
    '[{a=0},{b=0},0] = 0',
    '[{a=0},...0]',
    '[2] = 42',
    '{a = [...b, c]} = 0',
    '({a({e: a.b}){}})',
    '[...{a=0},]=0',
    '[a, ...b, {c=0}]',
    "['str']",
    "{ x: 'str' }",
    "{ x: ('str') }",
    '{ x: (foo()) }',
    '{ x: function() {} }',
    '{ x: async function() {} }',
    '{ x: function*() {} }',
    '{ x: (function() {}) }',
    '{ x: (async function() {}) }',
    '{ x: (function*() {}) }',
    "{ x: y } = 'str'",
    "[x, y] = 'str'",
    '[(x,y) => z]',
    '[async(x,y) => z]',
    '[async x => z]',
    'var [a)] = [];',
    'var [((a)] = [];',
    'const [((a)] = [];',
    'const [((((a)))), b] = [];',
    'const [...a = 1] = [];',
    'let a, b; [...a, b] = [];',
    '{x: (y) => z}',
    '{x: (y,w) => z}',
    '{x: async (y) => z}',
    '{x: async (y,w) => z}',
    '[x, ...y, z]',
    '[...x,]',
    '[...++x]',
    '[...x--]',
    'var x; [x => 1] = [1]',
    '[x => 1] = [1]',
    '({a: b => []} = [2])',
    'for([a => {}] in []);',
    '[...!x]',
    '[...x + y]',
    '({ x: x4, x: (x+=1e4) })',
    '(({ x: x4, x: (x+=1e4) }))',
    '({ x: x4, x: (x+=1e4) } = {})',
    '(({ x: x4, x: (x+=1e4) } = {}))',
    '(({ x: x4, x: (x+=1e4) }) = {})',
    '({ x: y } = {})',
    '(({ x: y } = {}))',
    '(({ x: y }) = {})',
    '([a])',
    '(([a]))',
    '([a] = [])',
    '(([a] = []))',
    '(([a]) = [])',
    '({a:this}=0)',
    '({a:this}=0)',
    '({a: this} = 0);',
    '{ x: ([y]) }',
    '{ x: ([y] = []) }',
    '{ x: ({y}) }',
    '{ x: ({y} = {}) }',
    '{ x: (++y) }',
    '[ (...[a]) ]',
    '[ ...([a]) ]',
    '[ ...([a] = [])',
    '[ ...[ ( [ a ] ) ] ]',
    '[ ([a]) ]',
    '[ (...[a]) ]',
    '[ ([a] = []) ]',
    '[ (++y) ]',
    '[ ...(++y) ]',
    '[ x += x ]',
    '[x[yield]]] = value;',
    '{ foo: x += x }',
    '([arguments] = []);',
    '"use strict"; [ x = yield ] = [];',
    '[[(x, y)]] = [[]];',
    '[[ x ]] = [null];',
    '[[ x ]] = [ , ];',
    '[[ x ]] = [undefined];',
    '[[ x ]] = [];',
    '"use strict"; [[x[yield]]] = 123;',
    '[...x,] = [];',
    'let {x:o.f=1}={x:1}',
    '(o.f=1)=>0',
    'for (({x}) of [{x:1}]) {}',
    'for (var ({x}) of [{x:1}]) {}',
    'for await (({x}) of [{x:1}]) {}',
    '[...x, ...y] = [];',
    '"use strict"; [...{ x = yield }] = [{}];',
    'let [{a, ...[]}] = [{/*...*/}]; // invalid;',
    'let {a, ...[]} = {/*...*/}; // invalid;',
    'let {a, ...[b]} = {/*...*/}; // invalid;',
    'let {a, ...{}} = {/*...*/}; // invalid;',
    'let {a, ...{b}} = {/*...*/}; // invalid;',
  ]) {
    it(`function fn() { 'use strict';} fn(${arg});`, () => {
      t.throws(() => {
        parseSource(`'use strict'; let x, y, z; (${arg} = {});`);
      });
    });

    it(`'use strict'; let x, y, z; for (x in ${arg} = z = {});`, () => {
      t.throws(() => {
        parseSource(`'use strict'; let x, y, z; for (x in ${arg} = z = {});`);
      });
    });

    it(`'use strict'; let x, y, z; for (x in ${arg} = z = {});`, () => {
      t.throws(() => {
        parseSource(`'use strict'; let x, y, z; for (x in ${arg} = z = {});`, { webcompat: true, lexical: true });
      });
    });

    it(`'use strict'; let x, y, z; for (x in ${arg} = z = {});`, () => {
      t.throws(() => {
        parseSource(`'use strict'; let x, y, z; for (x in ${arg} = z = {});`, { lexical: true });
      });
    });

    it(`'use strict'; let x, y, z; for (x in x =  ${arg} = z = {});`, () => {
      t.throws(() => {
        parseSource(`'use strict'; let x, y, z; for (x in x = ${arg} = z = {});`);
      });
    });

    it(`'use strict'; let x, y, z; for (x of ${arg} = z = {});`, () => {
      t.throws(() => {
        parseSource(`'use strict'; let x, y, z; for (x of ${arg} = z = {});`);
      });
    });

    it(`'use strict'; let x, y, z; for (x of x =  ${arg} = z = {});`, () => {
      t.throws(() => {
        parseSource(`'use strict'; let x, y, z; for (x of x = ${arg} = z = {});`);
      });
    });

    it(`var x, y, z; for (x of x = ${arg} = z = {});`, () => {
      t.throws(() => {
        parseSource(`var x, y, z; for (x of x = ${arg} = z = {});`);
      });
    });

    it(`var x, y, z; (x = ${arg} = z = {});`, () => {
      t.throws(() => {
        parseSource(`var x, y, z; (x = ${arg} = z = {});`);
      });
    });

    it(`'use strict'; let x, y, z; for (x of ${arg}= z = {});`, () => {
      t.throws(() => {
        parseSource(`'use strict'; let x, y, z; for (x of ${arg} = z = {});`);
      });
    });

    it(`var x, y, z; for (x in ${arg} = z = {});`, () => {
      t.throws(() => {
        parseSource(`var x, y, z; for (x in ${arg} = z = {});`);
      });
    });

    it(`var x, y, z; for (x in x = ${arg}  = z = {});`, () => {
      t.throws(() => {
        parseSource(`var x, y, z; for (x in x = ${arg}  = z = {});`);
      });
    });
  }

  for (const arg of [
    'let [foo] = [1]; ',
    'let {foo} = {foo: 2}; ',
    'let {foo=3} = {}; ',
    'var foo; ',
    'var foo = 0; ',
    'var [foo] = [1]; ',
    'var {foo} = {foo: 2}; ',
    'var {foo=3} = {}; ',
    '{ var foo; }; ',
    '{ var foo = 0; }; ',
    '{ var [foo] = [1]; }; ',
    '{ var {foo} = {foo: 2}; }; ',
    '{ var {foo=3} = {}; }; ',
    'function foo() {}; ',
    'async function foo() {}; ',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true });
      });
    });
    it(`{ function foo() {}; }; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`{ function foo() {}; }; ${arg}`, { next: true });
      });
    });
    it(`{  function* foo() {}; }; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`{  function* foo() {}; }; ${arg}`, { next: true });
      });
    });
    it(`{ async function foo() {};  }; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`{ async function foo() {};  }; ${arg}`, { next: true });
      });
    });
  }

  // Failures

  for (const arg of [
    '({[a / b = c]: {}})',
    '({a: ({x = (y)})})',
    '({a = {}})',
    '({a = []})',
    '({a: ({1})})',
    '({a: ({x = (y)})})',
    '({a = [b]} = 1 / d = a)',
    '({(a) = [b]} = 1 / (d = (a)))',
    '({"a" = [b]} = 1 / (d = (a)))',
    '({["a"]: [b]} = 1 / (d = ((a))  => a))',
    '({1: [b.c = x]} = 2 / (3 = ((a)) = a))',
    '({1: [b.c = x]} = 2 / (dd = ((3)) = a))',
    'function () { for (let x in { a: x }) { } }',
    'function () { for (const x in { a: x }) { } }',
    'function () { for (const x of [ x ]) { } }',
    'function () { for (let x in { a: (() => x)() }) { } }',
    'function () { for (const x in { a: (() => x)() }) { } }',
    'function () { for (let x of [ (() => x)() ]) { } }',
    'function () { for (const x of [ (() => x)() ]) { } }',
    'function () { for (const x of [ eval("x") ]) { } }',
    '({a: ({1})})',
    '({a = {}})',
    '({a: ("string") / a[3](((((a /= [b.c] = ({x)}))))) })',
    '({a: ("string") / a[3](((((a /= [b.c] = ([x / 2]()=> a)))))) })',
    '({a: ("string") / a[3](((((a /= [b.c] = ([x / 2]())))))=>) })',
    '({a: ("string") / a[3](((((a /= [b.c] => ([x / 2]())))))) })',
    '({a: ("string") / a[3](((((a /= [b.c => a] = ([x / 2]())))))) })',
    '({a: ("string") / a[3](((((a /= [b.(c) => a] = ([x / 2]())))))) })',
    '({a: ("string") / a[3](((((a /= [(b.c) => a] = ([x / 2]())))))) })',
    '({a: ("string") / a[3](((((a /= [(c) => a] = ([x / 2]())))))) })',
    '(({a: ("string") / a[3](((((a /= [b.c ] = ([x / 2]())))))) }))=> a',
    '((({a: ("string") / a[3](((((a /= [b.c ] = ([x / 2]())))))) })) = a',
    'var {(a)} = 0',
    'var {a:(b)} = 0',
    '({(a)} = 0)',
    '({a:(b = 0)} = 1)',
    '(new.target) = 1',
    '([a += a] = a)',
    'for (`a` of b);',
    '(`a`) => b;',
    '({ x }) = { x: 5 };',
    '({a}) = 1;',
    '(var {a:b} = {})',
    '({start, stop}) = othernode;',
    '{a, b} = {a: 1, b: 2}',
    '({a, b}) = {a: 1, b:2};',
    '({b}) = b;',
    '([b]) = b;',
    '({a}) = 2;',
    '([b]) = b;',
    '[(a = 0)] = 1',
    '({[a]: {...[a[]]}})',
    '({[a]: {x = [a]}})',
    '({{x}: "b"})',
    '({a: {x = y}, "b"})',
    '({a: {x = y}, "b": a})',
    '([{constructor(){}}] = b);',
    // doesn't fail in Acorn / Esprima / Espree and Babylon
    '({ src: ([dest]) } = obj)',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true, lexical: true });
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    '[(a)] = 0',
    '[(a) = 0] = 1',
    '[(a.b)] = 0',
    '({a:(b)} = 0)',
    '({a:(b.c)} = 0)',
    '({a:(b = 0)})',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });
  }

  for (const arg of [
    '({y: a.g(...[])} = 1)',
    '({y: eval(...["1"])} = 1)',
    '({y: g(...[])} = 1)',
    '[eval(...["1"])] = []',
    '[a.g(...[])] = []',
    '[g(...[])] = []',
    'eval(...["1"]) ++',
    'a.g(...[]) ++',
    'g(...[]) ++',
    'a.g(...[]) = 1',
    'g(...[]) = 1',
    'a.g(...[])++',
    'a.g(...[]) ++',
    'a.g(...[]) ++',
    'function f1() { var a = 10; [a+2] = []; }; f1();',
    'function f2() { var a = 10; ({x:a+2} = {x:2}); }; f2();',
    'function f3() { var a = 10; for ([a+2] in []) { } }; f3();',
    "(function () { 'use strict'; [eval] = []; })();",
    'for (let []; ;) { }',
    'for (let a = 1, []; ;) { }',
    'for (let [[a] = []]; ;) { }',
    'for (var {a: ...a1} = {}; ; ) { } ',
    'for (var {a: ...[]} = {}; ; ) { } ',
    "for (var {a: ...[]} of '' ) { } ",
    'for (var a of {b: foo()} = {}) { }',
    'for ([{b: foo()} = {}] of {}) { }',
    'var {x :  , } = {};',
    'var {x :  } = {};',
    'var {x :  , y} = {};',
    '({x : , y} = {});',
    'let {};',
    'const {};',
    'const {a};',
    '({,} = {});',
    'var {x:y--} = {};',
    'var {x:y+1} = {};',
    'var y; ({x:y--} = {});',
    'var y; ({x:y+1} = {});',
    'class foo { method() { let {x:super()} = {}; } }',
    'class foo { method() { ({x:super()} = {}); } }',
    'let [...[a+1] = [{}];',
    'let a; [...1+a] = [{}];',
    'let a; [...[a+1] = [{}];',
    'let [...[a] = []] = [[]];',
    'let x; ([...{x} = {}] = [{}]);',
    'for (var [x] = [] of []) {}',
    'function foo() {for (let {x} = {} of []) {}; }; foo();',
    "let {set ['foo'](a) {}} = {};",
    '({foo() {}} = {});',
    '({get foo() {}} = {});',
    '({set foo(a) {}} = {});',
    'for(var [z] = function ([a]) { } in []) {}',
    'var a = 1; ({x, y = 1, z = 2} = {a = 2});',
    'var a = 1; ({x, y = {a = 1}} = {});',
    'function foo() {try {} catch({,}) {} }',
    'function foo() {try {} catch(([])) {} }',
    'function foo() {try {} catch({x:abc+1}) {} }',
    'function foo() {try {} catch([abc.d]) {} }',
    'function foo() {try {} catch([x], [y]) {} }',
    "function foo() {'use strict'; try {} catch([arguments]) {} }",
    "function foo() {'use strict'; try {} catch([eval]) {} }",
    'let {...rest1, ...rest2} = {a:1, b:2};',
    'let {...{a, b}} = {a:1, b:2};',
    'let {...{a, ...rest}} = {a:1, b:2};',
    '([a,...b,])=>0;',
    '({a:b[0]})=>0',
    '({get a(){}}) => 0;',
    '([[[[[[[[[[[[[[[[[[[[{a:b[0]}]]]]]]]]]]]]]]]]]]]])=>0;',
    '(a,b)=(c,d);',
    '({a:this}=0)',
    '({}=>0)',
    '({}=>0)',
    '({}=>0)',
    '({}=>0)',
    '({}=>0)',
    '({}=>0)',
    'let {...rest, a} = {a:1, b:2};',
    '...(rest)',
    'let {...(rest)} = {a:1, b:2};',
    'let {...++rest} = {a: 1, b: 2};',
    'let {...rest++} = {a: 1, b: 2};',
    'let {...rest+1} = {a: 1, b: 2};',
    'let {... ...rest} = {};',
    'let {...} = {};',
    'let [await b] = [];',
    '...x => 10',
    '[(x = y)] = obj',
    '[((((((x = y))))))] = obj',
    'var f = (...x = 10) => x;',
    '(w, ...x, y) => 10',
    '(...x, y) => 10',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    // Generators
    it(`function fn(${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`function *fn(${arg}) {}`);
      });
    });

    // Generator expression - no name
    it(`(function *(${arg}) {})`, () => {
      t.throws(() => {
        parseSource(`(function *(${arg}) {})`);
      });
    });
    // Async function
    it(`async function fn(${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`async function fn(${arg}) {}`);
      });
    });
  }

  for (const arg of [
    '{,}',
    '({})',
    '([])',
    '[x}',
    // Object destructuring pattern
    '{x:abc+1}',
    '{x:abc.d}',
    '{x:super}',
    '{x:super()}',
    // Array destructuring pattern
    '[abc.d]',
    '[super]',
    '[super()]',
  ]) {
    // Plain function
    it(`function fn(${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`function fn(${arg}) {}`);
      });
    });

    // Generators
    it(`function fn(${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`function *fn(${arg}) {}`);
      });
    });

    // Generator expression - no name
    it(`(function *(${arg}) {})`, () => {
      t.throws(() => {
        parseSource(`(function *(${arg}) {})`);
      });
    });
    // Async function
    it(`async function fn(${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`async function fn(${arg}) {}`);
      });
    });

    // Async Generator
    it(`async function *fn(${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`async function *fn(${arg}) {}`);
      });
    });
    // Arrows
    it(`(${arg}) => x;`, () => {
      t.throws(() => {
        parseSource(`(${arg}) => x;`);
      });
    });

    // Async arrows
    it(`(${arg}) => x;`, () => {
      t.throws(() => {
        parseSource(`(${arg}) => x;`);
      });
    });
  }

  for (const arg of [
    '{x:x}',
    '{x}',
    '{x:x}, y',
    '[x], y',
    'y, {x:x}',
    'y, [x]',
    '{x:x}, {y:y}, {z:z}',
    '[x], [y], [z]',
    // Two params as object pattern, and each pattern has more than one matching name is valid syntax
    '{x1:x1, x2:x2, x3:x3}, {y1:y1, y1:y2}',
    '[x1, x2, x3], [y1, y2, y3]',
    '{x1:x1}, [y1]',
    'x1, {x2, x3}, [x4, x5], x6',
    '{x1:[y1]}',
    '{}',
    '[,]',
  ]) {
    // Plain function
    it(`function fn(${arg}) {}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn(${arg}) {}`);
      });
    });

    // Generators
    it(`function fn(${arg}) {}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function *fn(${arg}) {}`);
      });
    });

    // Generator expression - no name
    it(`(function *(${arg}) {})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function *(${arg}) {})`);
      });
    });
    // Async function
    it(`async function fn(${arg}) {}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function fn(${arg}) {}`);
      });
    });

    // Async Generator
    it(`async function *fn(${arg}) {}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function *fn(${arg}) {}`);
      });
    });
    // Arrows
    it(`(${arg}) => x;`, () => {
      t.doesNotThrow(() => {
        parseSource(`(${arg}) => x;`);
      });
    });

    // Async arrows
    it(`(${arg}) => x;`, () => {
      t.doesNotThrow(() => {
        parseSource(`(${arg}) => x;`);
      });
    });
  }

  for (const arg of [
    'class foo { constructor({x1}){} }',
    'class foo { constructor([x1]){} }',
    'class foo { method({x1}){ }; set prop({x1}){} }',
    'class foo { method([x1]){ }; set prop([x1]){} }',
    'let foo = function ({x1}, [x2]){};',
    '(function({x1}, [x2]){})',
    'let bar = function foo({x1}, [x2]){};',
    "new Function('{x}', '[y]', 'return x + y');",
    'let obj = { foo({x}) {}, set prop([x]) {} }',
    'function foo({x:x = 10}) {}',
    'function foo({x1:x1 = 1}, {y1:y1 = 2}) {}',
    'function foo([x1 = 1], [y1 = 2]) {}',
    'function foo({x1:x1 = 1, x2:x2 = 2, x3:x3 = 3}) {}',
    'function foo([x1 = 1, x2 = 2, x3 = 3]) {}',
    'function foo({x1:x1 = 1}, [y1 = 2]) {}',
    'function foo([x1 = 1], {y1:y1 = 2}) {}',
    'function foo({x:x} = {x:1}) {}',
    'function foo([x] = [1]) {}',
    'function foo({x:x = 1} = {x:2}) {}',
    'function foo([x = 1] = [2]) {}',
    'function foo({x1:[y1 = 1]}) {}',
    'function foo([x1, {y1:y1 = 1}]) {}',
    'function foo({x1:[y1 = 1] = [2]} = {x1:[3]}) {}',
    'function foo([{y1:y1 = 1} = {y1:2}] = [{y1:3}]) {}',
    'function foo([x]) { var x = 10;}',
    'function a(a = b += 1, c = d +=1) {}',
    '[...z = 1]',
    '[x, y, ...[z] = [1]]',
    '[...[z] = [1]]',
    '[x, {y = 1}] = [0, {}]',
    '[x, {y = 1}] = [0, {}]',
    'for ({a = 0} of [{}]) {}',
    '({x = 1, y = 2} = {})',
    'var {x: x = 10, y: y = 10, z: z = 10} = a;',
    'function x({a}) { try { var {b} = a; }  catch({stack}) { }  };',
    'var {x: y, z: { a: b } } = { x: "3", z: { a: "b" } };',
    'function x([ a, b ]){};',
    'function a([x, , [, z]]) {};',
    '[a,,b] = array;',
    'var [x = 10, y, z] = a;',
    '[ok.v] = 20;',
    'x = { f: function(a=1) {} }',
    'var foo = function(a, b = 42, c) {};',
    '([y]) => x;',
    '({y}) => x;',
    '({x = 10}) => x',
    'function f([x] = [1]) {};',
    'f = function({x} = {x: 10}) {};',
    'function f({ [e]: {}}) {}',
    '[{a = 0}] = [{}];',
    'var [{a = 0}] = [{}];',
    '{ let [{a = 0}] = [{}]; }',
    'function f([...[{a = 0}]]) {}',
    'var h = ([...[{a = 0}]]) => {};',
    'function f1({a} = {a:1}, b, [c] = [2]) {}',
    '({})(a = b);',
    'function foo({x}) {}',
    'try {} catch({}) {}',
    'let {a:b} = {};',
    'var [...{x}] = y',
    'let [...a] = 0;',
    'var [let] = answer;',
    'function a([a=0]) {}',
    'function fn1([a, b = 42]) {}',
    'function fn2([a = 42, b,]) {}',
  ]) {
    // Plain function
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, lexical: true });
      });
    });
  }
  for (const arg of [
    'a',
    '{ x : y }',
    '{ x : y = 1 }',
    '{ get, set }',
    '{ get = 1, set = 2 }',
    '[a]',
    '[a = 1]',
    '[a,b,c]',
    '[a, b = 42, c]',
    '{ x : x, y : y }',
    '{ x : x = 1, y : y }',
    '{ x : x, y : y = 42 }',
    '[]',
    '{}',
    '[{x:x, y:y}, [a,b,c]]',
    '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]]',
    '{x}',
    '{x, y}',
    '{x = 42, y = 15}',
    '[a,,b]',
    '{42 : x}',
    '{42 : x = 42}',
    '{42e-2 : x}',
    '{42e-2 : x = 42}',
    '{x : y, x : z}',
    "{'hi' : x}",
    "{'hi' : x = 42}",
    '{var: x}',
    '{var: x = 42}',
    '{[x] : z}',
    '{[1+1] : z}',
    '{[foo()] : z}',
    '{}',
    '[...rest]',
    '[a,b,...rest]',
    '[a,,...rest]',
    '{ __proto__: x, __proto__: y}',
    '{arguments: x}',
    '{eval: x}',
    '{ x : y, ...z }',
    '{ x : y = 1, ...z }',
    '{ x : x, y : y, ...z }',
    '{ x : x = 1, y : y, ...z }',
    '{ x : x, y : y = 42, ...z }',
    '[{x:x, y:y, ...z}, [a,b,c]]',
    '[{x:x = 1, y:y = 2, ...z}, [a = 3, b = 4, c = 5]]',
    '{...x}',
    '{x, ...y}',
    '{x = 42, y = 15, ...z}',
    '{42 : x = 42, ...y}',
    "{'hi' : x, ...z}",
    "{'hi' : x = 42, ...z}",
    '{var: x = 42, ...z}',
    '{[x] : z, ...y}',
    '{[1+1] : z, ...x}',
    '{arguments: x, ...z}',
    '{ __proto__: x, __proto__: y, ...z}',
  ]) {
    it(`var ${arg}= {};`, () => {
      t.doesNotThrow(() => {
        parseSource(`var  ${arg} = {}`, { next: true, lexical: true });
      });
    });
    it(`"use strict"; let ${arg} = {};`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; let ${arg} = {}`, { next: true });
      });
    });
    it(`function f(${arg}) {}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function f(${arg}) {}`, { next: true });
      });
    });
    it(`try {} catch(${arg}) {}`, () => {
      t.doesNotThrow(() => {
        parseSource(`try {} catch(${arg}) {}`, { next: true });
      });
    });
    it(`try {} catch(${arg}) {}`, () => {
      t.doesNotThrow(() => {
        parseSource(`try {} catch(${arg}) {}`, { next: true, lexical: true });
      });
    });
    it(`function f(arg1, ${arg}) {}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function f(arg1, ${arg}) {}`, { next: true });
      });
    });
    it(`var f = (${arg}) => {};`, () => {
      t.doesNotThrow(() => {
        parseSource(`var f = (${arg}) => {};`, { next: true });
      });
    });
    it(`var f = (arg1, ${arg}) => {};`, () => {
      t.doesNotThrow(() => {
        parseSource(`var f = (arg1, ${arg}) => {};`, { next: true, lexical: true });
      });
    });
  }

  // Failures
  for (const arg of [
    '{ x : y * 2 }',
    '{ get x() {} }',
    '{ set x() {} }',
    '{ x: y() }',
    '{ this }',
    '{ x: this }',
    '{ x: this = 1 }',
    '{ super }',
    '{ x: super }',
    '{ x: super = 1 }',
    '{ new.target }',
    '{ x: new.target }',
    '{ import.meta }',
    '{ x: import.meta }',
    '{ x: import.meta = 1 }',
    '[x--]',
    '[--x = 1]',
    'a = b + c = d',
    '[x()]',
    '[this]',
    '[this = 1]',
    '[new.target]',
    '[new.target = 1]',
    '[import.meta]',
    '[import.meta = 1]',
    '[super]',
    '[super = 1]',
    '[function f() {}]',
    '[function* f() {}]',
    'a = ({name = "foo"}, 1) = {}',
    '{ ([((iydvhw)), gpvpgk]) => { }; } var iydvhw=function(){return this};',
    '{} = null  ',
    'c = 10; ({c} = {c:11});',
    '({x :  } = {})',
    '({x :  , } = {};)',
    '( {x :  , y} = {};)',
    '({x : , y} = {});',
    'function test5(){ ggnzrk=function(){ }; ({ggnzrk, namespace: {}, w: [(inmgdv)]}) => { };};',
    'function test5(){ ggnzrk=function(){ }; ({ggnzrk, namespace: {}, w: ([inmgdv])}) => { };};',
    '(nmlwii, [((yycokb) = (1))] = (nmlwii)) => { };',
    '({ggnzrk, w: (ggnzrk)}) => { };',
    '"([x, ...((yArgs))]) => {}',
    '([x, ...(([yArgs, zArgs]))]) => {}',
    'function test5(){ ggnzrk=function(){ }; ({ggnzrk, namespace: {}, w: [(inmgdv)]}) => { };};',
    '[50]',
    '[(50)]',
    '[{eval}.x] = [];',
    '[...{eval}.x] = [];',
    '({a: {eval}.x} = {});',
    '({...{eval}.x} = {});',
    '[{arguments}.x] = [];',
    '[...{arguments}.x] = [];',
    '({a: {arguments}.x} = {});',
    '({...{arguments}.x} = {});',
    '({...[0].x} = {});',
    '( {a, ...{b}} = {/*...*/})',
    '( {a, ...{}} = {/*...*/})',
    '( {a, ...[b]} = {/*...*/})',
    '( {a, ...[]} = {/*...*/})',
    '( [{a, ...[]}] = [{/*...*/}])',
    '[(async function() {})]',
    '{ x: 50 }',
    '{ x: (50) }',
    "['str']",
    "{ x: 'str' }",
    "{ x: ('str') }",
    '{ x: (foo()) }',
    '{ x: function() {} }',
    '{ x: async function() {} }',
    '{ x: function*() {} }',
    '{ x: (function() {}) }',
    '{ x: (async function() {}) }',
    '{ x: (function*() {}) }',
    "{ x: y } = 'str'",
    "[x, y] = 'str'",
    '[(x,y) => z]',
    '[async(x,y) => z]',
    '[async x => z]',
    '{x: (y) => z}',
    '{x: (y,w) => z}',
    '{x: async (y) => z}',
    '{x: async (y,w) => z}',
    '[x, ...y, z]',
    '[...x,]',
    '[...++x]',
    '[...x--]',
    '[...!x]',
    '[...x + y]',
    '({ x: x4, x: (x+=1e4) })',
    '(({ x: x4, x: (x+=1e4) }))',
    '({ x: x4, x: (x+=1e4) } = {})',
    '(({ x: x4, x: (x+=1e4) } = {}))',
    '(({ x: x4, x: (x+=1e4) }) = {})',
    '({ x: y } = {})',
    '(({ x: y }) = {})',
    '([a])',
    '(([a]))',
    '([a] = [])',
    '(([a] = []))',
    '[ ...([a]) ]',
    '{ x: ([y]) }',
    '{ x: ([y] = []) }',
    '{ x: ({y}) }',
    '{ x: ({y} = {}) }',
    '[ ...[ ( [ a ] ) ] ]',
    '(([a]) = [])',
    '{ x: (++y) }',
    '[ (...[a]) ]',
    '[ ...([a] = [])',
    '[ (...[a]) ]',
    '[ (++y) ]',
    '[ ...(++y) ]',
    '[ x += x ]',
    '[x[yield]]] = value',
    '{ foo: x += x }',
    '([arguments] = [])',
    '"use strict"; [ x = yield ] = []',
    '[ x += x ]',
    '{ foo: x += x }',
    'a++',
    '++a',
    'delete a',
    'void a',
    'typeof a',
    '(a = b) = c;',
    '~a',
    '!a',
    '{ x : y++ }',
    '[a++]',
    '(x => y)',
    '(async x => y)',
    '((x, z) => y)',
    '(async (x, z) => y)',
    'a()',
    '--a',
    '+a',
    '-a',
    '(a = b)++;',
    'new a',
    'a + a',
    'a - a',
    'a * a',
    'a / a',
    'a == a',
    'a != a',
    'a > a',
    'a < a',
    'a <<< a',
    'a >>> a',
    'a`bcd`',
    'this',
    'null',
    'true',
    'false',
    '/abc/',
    '`abc`',
    'class {}',
    'var',
    '[var]',
    '{x : {y : var}}',
    '{[1+1]}',
    '[...rest, x]',
    '[a,b,...rest, x]',
    '[a,,...rest, x]',
    '[...rest,]',
    '[a,b,...rest,]',
    '[a,,...rest,]',
    '[...rest,...rest1]',
    '[a,b,...rest,...rest1]',
    '[a,,..rest,...rest1]',
    '[x, y, ...z = 1]',
    '[...z = 1]',
    '[x, y, ...[z] = [1]]',
    '[...[z] = [1]]',
    '{ x : 3 }',
    "{ x : 'foo' }",
    '{ x : /foo/ }',
    '{ x : `foo` }',
    '{ get a() {} }',
    '{ set a() {} }',
    '{x : x += a}',
    '{m() {} = 0}',
    '{+2 : x}',
    '{-2 : x}',
    '1',
    "'abc'",
    '{ method() {} }',
    '{ *method() {} }',
    '...a++',
    '[this = 1]',
    '[new.target]',
    '[new.target = 1]',
    '[import.meta]',
    '[import.meta = 1]',
    '{ x: 50 }',
    '{ x: (50) }',
    "['str']",
    "{ x: 'str' }",
    "{ x: ('str') }",
    '{ x: (foo()) }',
    '{ x: function() {} }',
    '{ x: async function() {} }',
    '{ x: function*() {} }',
    '{ x: (function() {}) }',
    '{ x: (async function() {}) }',
    '{ x: (function*() {}) }',
    "{ x: y } = 'str'",
    "[x, y] = 'str'",
    '[(x,y) => z]',
    '[async(x,y) => z]',
    '...++a',
    '...typeof a',
    '...[a++]',
    '...(x => y)',
    '{ ...x, }',
    '{ ...x, y }',
    '{ y, ...x, y }',
    '{ ...x, ...y }',
    '{ ...x, ...x }',
    '{ ...x, ...x = {} }',
    '{ ...x, ...x = ...x }',
    '{ ...x, ...x = ...{ x } }',
    '{ ,, ...x }',
    '{ ...get a() {} }',
    '{ ...set a() {} }',
    '{ ...method() {} }',
    '{ ...function() {} }',
    '{ ...*method() {} }',
    '(true ? { x = true } : { x = false })',
    '({foo() {}} = {});',
    '({get foo() {}} = {});',
    '({set foo(a) {}} = {});',
    "({get ['foo']() {}} = {});",
    "({set ['foo'](a) {}} = {});",
    '({e: a.b}) => 0',
    'function a({e: a.b}) {}',
    'function* a({e: a.b}) {}',
    '(function ({e: a.b}) {})',
    '(function* ({e: a.b}) {})',
    '(function* ([a.b]) {})',
    '({a([a.b]){}})',
    '({*a([a.b]){}})',
    '({set a([a.b]){}})',
    '([a.b]) => 0',
    '({*a({e: a.b}){}})',
    '({set a({e: a.b}){}})',
    '({a:for} = 0)',
    '({a = 0});',
    '({a} += 0);',
    '({get a(){}})=0',
    '({a:this}=0)',
    '({var} = 0)',
    '({,a,} = 0)',
    '({a,,a} = 0)',
    '({function} = 0)',
    '({a:function} = 0)',
    '({a:for} = 0)',
    "({'a'} = 0)",
    '({var} = 0)',
    '({a.b} = 0)',
    '{ x: ([y]) }',
    '{ x: ([y] = []) }',
    '{ x: ({y}) }',
    '{ x: ({y} = {}) }',
    '{ x: (++y) }',
    '[ (...[a]) ]',
    '[ ...([a]) ]',
    '[ (++y) ]',
    '[ ...(++y) ]',
    '{a = [...b, c]} = 0',
    '[a, ...b, {c=0}]',
    '[async x => z]',
    '{x: (y) => z}',
    '{x: (y,w) => z}',
    '{x: async (y) => z}',
    '{x: async (y,w) => z}',
    '[x, ...y, z]',
    '[...x,]',
    '[x, y, ...z = 1]',
    '[...z = 1]',
    '[x, y, ...[z] = [1]]',
    '[...[z] = [1]]',
    '[...++x]',
    '[...x--]',
    '[...!x]',
    '[...x + y]',
    '({ x: x4, x: (x+=1e4) })',
    '(({ x: x4, x: (x+=1e4) }))',
    '({ x: x4, x: (x+=1e4) } = {})',
    '(({ x: x4, x: (x+=1e4) } = {}))',
    '(({ x: x4, x: (x+=1e4) }) = {})',
    '({ x: y } = {})',
    '(({ x: y } = {}))',
    '(({ x: y }) = {})',
    '([a])',
    '(([a]))',
    '([a] = [])',
    '(([a] = []))',
    '(([a]) = [])',
    '({0} = 0)',
    '{...{x} }',
    '{...[x] }',
    '{ x : /foo/ }',
    '...typeof a',
    'a.g(...[]) = 1',
    'eval(...["1"]) = 1',
    'g(...[]) ++',
    'a.g(...[]) ++',
    '[g(...[])] = []',
    '[a.g(...[])] = []',
    '[eval(...["1"])] = []',
    '({y: g(...[])} = 1)',
    '({y: a.g(...[])} = 1)',
    '({y: eval(...["1"])} = 1)',
    '[{a = 0}.x] = [];',
    '[{a = 0}.x] = [];',
    '[...{a = 0}.x] = [];',
    '({a: {b = 0}.x} = {});',
    '({...{b = 0}.x} = {});',
  ]) {
    it(`(${arg}= {});`, () => {
      t.throws(() => {
        parseSource(`(${arg}= {});`, { next: true, lexical: true });
      });
    });
    it(`var ${arg}= {};`, () => {
      t.throws(() => {
        parseSource(`var  ${arg} = {}`, { next: true });
      });
    });
    it(`"use strict"; let ${arg} = {};`, () => {
      t.throws(() => {
        parseSource(`"use strict"; let ${arg} = {}`, { next: true });
      });
    });
    it(`try {} catch(${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`try {} catch(${arg}) {}`, { next: true });
      });
    });
  }

  for (const arg of [
    'x',
    '[x,] = 0',
    '[x,,] = 0',
    '[[x]] = 0',
    '[, x,,] = 0',
    '[...[x]] = 0',
    '[...{x = 1}] = [{}]',
    '[...[x]] = 0',
    '[x, ...{0: y}] = 0',
    '[x, x] = 0',
    '[x, ...x] = 0',
    '[(a)] = 0',
    '({x} = 0)',
    'let {a, ...b} = {/*...*/}; // valid;',
    "[ x = 'x' in {} ] = value;",
    'a = [ a = x += 1, b = x *= 2 ] = value;',
    ' [[ x ]] = [null]',
    '[{ x }] = [null];',
    '[{ x }] = [];',
    '[{ x }] = [ , ];',
    'a = [{ x = yield }] = value;',
    'a = [[x[yield]]] = 123;',
    '[{ x }] = [null];',
    ' [{ x }] = [];',
    'a = [{ x }] =  [{ x: 2 }];',
    'a = [x.y] = [123];',
    '[x, ...y] = [1, 2, 3];',
    '[, ...x] = [1, 2, 3];',
    'a = [x.y] = value;',
    'a = [ x[yield] ] = [33];',
    'a = [...[x, y]] = [null];',
    'a = [...[x]] = [ , ];',
    'a = [...{ 0: x, length }] = [undefined];',
    'a = [...{ 1: x }] =  [1, 2, 3];',
    'a = [...x.y] = [4, 3, 2];',
    'a = [...[x[yield]]] = [2018];',
    'a = [...{ 0: x, length }] = value;',
    'a = [...{ 1: x }] = [1, 2, 3];',
    ' [,] = undefined;',
    ' [,] = null;',
    ' [,] = 1;',
    " [,] = 'icefapper';",
    ' [,] = []',
    ' [,] = undefined;',
    "a = { prop = 'x' in {} } = value;",
    'a = { x = 1 } = value;',
    '({ x = y } = {});',
    'a = { x: x = yield } = { a: 1 };',
    'a = { x: [x = yield] } =  { x: [321] };',
    'a = { x: [y] } =  { x: [321] };',
    'a = { x: { y } } =  { x: { y: 2 } };',
    'a = { xy: x.y } = { xy: 4 };',
    'a = [, , x, , ...y] = [1, 2, 3, 4, 5, 6];',
    '[[x]] = [[1]];',
    '[[ x ]] = [null];',
    'a = [ x = yield ] = [];',
    '[ x = y ] = [];',
    'result = [, x, , y, ,] = [1, 2, 3, 4, 5, 6];',
    'x = [ x = 14 ] = [,];',
    'a = [ x = flag = true ] = [];',
    ' [ x = y ] = [];',
    'a = [ a = x += 1, b = x *= 2 ] = [];',
    'a = [arguments = 4, eval = 5] = value;',
    '({x=0, y:z} = 0)',
    '({x,} = 0)',
    '({x,y} = 0)',
    '({x,y,} = 0)',
    '({[a]: a} = 1)',
    '({x = 0} = 1)',
    '({ test = 1 } = {})',
    '({x = 0,} = 1)',
    '({x: y} = 0)',
    '({x: y,} = 0)',
    '({var: x} = 0)',
    "({'x': y} = 0)",
    '({0: y} = 0)',
    '({0: x, 1: x} = 0)',
    '({x: y = 0} = 1)',
    '({x: y = z = 0} = 1)',
    '({x: [y] = 0} = 1)',
    '({a:let} = 0);',
    '({let} = 0);',
    '({a:yield} = 0);',
    '({yield} = 0);',
    '({yield = 0} = 0);',
    'let {a:b=c} = 0;',
    '(function*() { [...{ x = yield }] = 0; })',
    '({d=0,f:h().a} = 0)',
    '[a,b=0,[c,...a[0]]={}]=0',
    '[a] = 0;',
    '[a,a,,...a]=0;',
    '[,,]=0',
    '[...a[0]] = 0;',
    '[{a=b}=0]',
    '[{a=0}, ...b] = 0',
    '[a = 0, ...{b = 0}] = 0',
    '[[x]] = 0',
    '[x.a=a] = 0',
    '[x[a]=a] = 0',
    'function f({x = f}) { let f; return x; }',
    'function f1({a = x}, x) { return a }',
    'function f5({a = () => x}, x) { return a() }',
    'function f11({a = b}, {b}) { return a }',
    'function f15({a = () => b}, {b}) { return a() }',
    'function f30({x = a}, ...a) { return x[0] }',
    'function f34({x = function() { return a }}, ...a) { return x()[0] }',
    'function f35({x = () => a}, ...a) { return x()[0] }',
    'var g30 = ({x = a}, ...a) => {};',
    'var g35 = ({x = () => a}, ...a) => { return x()[0] };',
    'function f1({x}) { var x = 2; return x }',
    'function f10({x}, y) { var y; return y }',
    '(function([ x = y = 1 ]) {}([]));',
    '[{a=0},{a=0}] = 0',
    '[] = 0',
    '[...[...a[x]]] = 1',
    'const {x,y} = {z:1};',
    'let {x = (function() { x = 2; }())} = {};',
    'for (const {x, z} = { x : 0, z : 3 }; z != 3 || x != 0;) {}',
    'for (let {x, z} = { x : 0, z : 3 }; z != 0; z--) {}',
    'var g1 = ({x}) => { var x = 2; return x };',
    'var g7 = ({x}) => { var g = () => x; var x = 2; return g(); };',
    'var g10 = ({x}, y) => { var y; return y };',
    'function f7({a: x}) { x = 2; return arguments[0].a }',
    '(function({x}, {y} = {}, {z}, {v} = {}, ...a) {})',
    '(function({x}, {}, {z} = {}, ...a) {})',
    '(function({x}, {y} = {}, ...a) {})',
    '(function({x}, {y} = {}) {})',
    '(function({x}, {y} = {}, {z}, ...a) {})',
    '(function(x, {y}, {z} = {}) {})',
    'try {throw {foo: 1, bar: 2}} catch({foo}) {}',
    'try {throw [1, 2, 3]} catch([x]) {}',
    '[[[[[[[[[[[[[[[[[[[[{a=b[0]}]]]]]]]]]]]]]]]]]]]]=0;',
    outdent`
      ({
          a,
          a:a,
          a:a=a,
          [a]:{a},
          a:some_call()[a],
          a:this.a
      } = 0);
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });
  }

  for (const arg of [
    'var foo = { x = 10 } = {};',
    'var foo = { q } = { x = 10 } = {};',
    'var foo; foo = { x = 10 } = {};',
    'var foo; foo = { q } = { x = 10 } = {};',
    'var x; ({ x = 10 } = {});',
    'var q, x; ({ q } = { x = 10 } = {});',
    'var x; [{ x = 10 } = {}]',
    'var x; (true ? { x = true } = {} : { x = false } = {})',
    'var q, x; (q, { x = 10 } = {});',
    'var { x = 10 } = { x = 20 } = {};',
    'var { __proto__: x, __proto__: y } = {}',
    '({ __proto__: x, __proto__: y } = {})',
    'var { x = 10 } = (o = { x = 20 } = {});',
    'var x; (({ x = 10 } = { x = 20 } = {}) => x)({})',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, { lexical: true });
      });
    });
  }

  for (const arg of [
    'x',
    '[x,]',
    '[x,,]',
    '[[x]]',
    '{ x : y.z }',
    '{ x : y[z] }',
    '{ x : y }',
    '{ x : foo().y }',
    '{ x : foo()[y] }',
    '{ x : y.z }',
    '{ x : y[z] }',
    '{ x : y }',
    '{ x : foo().y }',
    '{ x : foo()[y] }',
    '{ x : y.z }',
    '{ x : y[z] }',
    '{ x : { y } }',
    '{ x : { foo: y } }',
    '{ x : { foo: foo().y } }',
    '{ x : { foo: foo()[y] } }',
    '{ x : { foo: y.z } }',
    '{ x : { foo: y[z] } }',
    '{ x : [ y ] }',
    '{ x : [ foo().y ] }',
    '{ x : [ foo()[y] ] }',
    '{ x : [ y.z ] }',
    '{ x : [ y[z] ] }',
    '{ x : y = 10 }',
    '{ x : foo().y = 10 }',
    '{ x : foo()[y] = 10 }',
    '{ x : y.z = 10 }',
    '{ x : y[z] = 10 }',
    '{ x : { y = 10 } = {} }',
    '{ x : { foo: y = 10 } = {} }',
    '{ x : { foo: foo().y = 10 } = {} }',
    '{ x : { foo: foo()[y] = 10 } = {} }',
    '{ x : { foo: y.z = 10 } = {} }',
    '{ x : { foo: y[z] = 10 } = {} }',
    '{ x : [ y = 10 ] = {} }',
    '{ x : [ foo().y = 10 ] = {} }',
    '{ x : [ foo()[y] = 10 ] = {} }',
    '{ x : [ y.z = 10 ] = {} }',
    '{ x : [ y[z] = 10 ] = {} }',
    '{ z : { __proto__: x, __proto__: y } = z }',
    '[ x ]',
    '[ foo().x ]',
    '[ foo()[x] ]',
    '[ x.y ]',
    '[ x[y] ]',
    '[ { x } ]',
    '[ { x : y } ]',
    '[ { x : foo().y } ]',
    '[ { x : foo()[y] } ]',
    '[ { x : x.y } ]',
    '[ { x : x[y] } ]',
    '[ [ x ] ]',
    '[ [ foo().x ] ]',
    '[ [ foo()[x] ] ]',
    '[ [ x.y ] ]',
    '[ [ x[y] ] ]',
    '[ x = 10 ]',
    '[ foo().x = 10 ]',
    '[ foo()[x] = 10 ]',
    '[ x.y = 10 ]',
    '[ x[y] = 10 ]',
    '[ { x = 10 } = {} ]',
    '[ { x : y = 10 } = {} ]',
    '[ { x : foo().y = 10 } = {} ]',
    '[ { x : foo()[y] = 10 } = {} ]',
    '[ { x : x.y = 10 } = {} ]',
    '[ { x : x[y] = 10 } = {} ]',
    '[ [ x = 10 ] = {} ]',
    '[ [ foo().x = 10 ] = {} ]',
    '[ [ foo()[x] = 10 ] = {} ]',
    '[ [ x.y = 10 ] = {} ]',
    '[ [ x[y] = 10 ] = {} ]',
    '{ x : y = 1 }',
    '{ x }',
    '{ x, y, z }',
    '{ x = 1, y: z, z: y }',
    '{x = 42, y = 15}',
    '[x]',
    '[x = 1]',
    '[x,y,z]',
    '[x, y = 42, z]',
    '{ x : x, y : y }',
    '{ x : x = 1, y : y }',
    '{ x : x, y : y = 42 }',
    '[]',
    '{}',
    '[{x:x, y:y}, [,x,z,]]',
    '[{x:x = 1, y:y = 2}, [z = 3, z = 4, z = 5]]',
    '[x,,y]',
    '[(x),,(y)]',
    '[(x)]',
    '{42 : x}',
    '{42 : x = 42}',
    '{42e-2 : x}',
    '{42e-2 : x = 42}',
    "{'hi' : x}",
    "{'hi' : x = 42}",
    '{var: x}',
    '{var: x = 42}',
    '{var: (x) = 42}',
    '{[x] : z}',
    '{[foo()] : z}',
    '{[foo()] : (z)}',
    '{[foo()] : foo().bar}',
    "{[foo()] : foo()['bar']}",
    '{[foo()] : this.bar}',
    "{[foo()] : this['bar']}",
    "{[foo()] : 'foo'.bar}",
    "{[foo()] : 'foo'['bar']}",
    '[...x]',
    '[x,y,...z]',
    '[x,,...z]',
    '{ x: y }',
    '[x, y]',
    '[((x, y) => z).x]',
    '{x: ((y, z) => z).x}',
    "[((x, y) => z)['x']]",
    "{x: ((y, z) => z)['x']}",
    '{x: { y = 10 } }',
    '[(({ x } = { x: 1 }) => x).a]',
    '{ ...d.x }',
    '{ ...c[0]}',
    '{ x: (y) }',
    '{ x: (y) = [] }',
    '{ x: (foo.bar) }',
    "{ x: (foo['bar']) }",
    '[ ...(a) ]',
    "[ ...(foo['bar']) ]",
    '[ ...(foo.bar) ]',
    '[ (y) ]',
    '[ (foo.bar) ]',
    "[ (foo['bar']) ]",
    'a',
    '{ x : y }',
    '{ x : y = 1 }',
    '[a = 1]',
    '{x = 42, y = 15}',
    '{42e-2 : x}',
    '{42e-2 : x = 42}',
  ]) {
    it(`function fn() { 'use strict';} fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; let x, y, z; (${arg} = {});`, { lexical: true });
      });
    });

    it(`'use strict'; let x, y, z; for (x in ${arg} = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; let x, y, z; for (x in ${arg} = z = {});`);
      });
    });

    it(`'use strict'; let x, y, z; for (x in x =  ${arg} = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; let x, y, z; for (x in x = ${arg} = z = {});`);
      });
    });

    it(`'use strict'; let x, y, z; for (x of ${arg} = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; let x, y, z; for (x of ${arg} = z = {});`, { lexical: true });
      });
    });

    it(`'use strict'; let x, y, z; for (x of x =  ${arg} = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; let x, y, z; for (x of x = ${arg} = z = {});`);
      });
    });

    it(`var x, y, z; for (x of x = ${arg} = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x of x = ${arg} = z = {});`);
      });
    });

    it(`var x, y, z; (x = ${arg} = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (x = ${arg} = z = {});`);
      });
    });

    it(`'use strict'; let x, y, z; for (x of ${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; let x, y, z; for (x of ${arg} = z = {});`);
      });
    });

    it(`var x, y, z; for (x in ${arg} = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x in ${arg} = z = {});`);
      });
    });

    it(`var x, y, z; for (x in x = ${arg}  = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x in x = ${arg}  = z = {});`);
      });
    });

    it(`var x, y, z; for (x of x = ${arg}  = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x of x = ${arg}  = z = {});`, { lexical: true });
      });
    });
  }

  // Failures
  for (const arg of [
    'for(let()of t)x',
    '([a.b]) => 0',
    'function foo() {for (let {x} = {} of []) {}; }; foo();',
    '({set a([a.b]){}})',
    '({a([a.b]){}})',
    '({*a([a.b]){}})',
    'function a([a.b]) {}',
    '(function ([a.b]) {})',
    '({e: a.b}) => 0',
    'function a({e: a.b}) {}',
    'function* a({e: a.b}) {}',
    '(function ({e: a.b}) {})',
    '(function* ({e: a.b}) {})',
    '(function* ([a.b]) {})',
    '({a([a.b]){}})',
    '({*a([a.b]){}})',
    '({set a([a.b]){}})',
    'function a([a.b]) {}',
    '({,} = {});',
    '({x:y+1} = {});',
    '([a.b]) => 0',
    '({*a({e: a.b}){}})',
    '({set a({e: a.b}){}})',
    '({a:for} = 0)',
    '({a = 0});',
    '({a} += 0);',
    '({a,,} = 0)',
    '({,a,} = 0)',
    '({a,,a} = 0)',
    '({function} = 0)',
    '({a:function} = 0)',
    '({a:for} = 0)',
    "({'a'} = 0)",
    '({var} = 0)',
    '({a.b} = 0)',
    '({0} = 0)',
    'function foo([x}) {}',
    'function f1() { a = 10; [a+2] = []; }; f1();',
    'function f2() { a = 10; ({x:a+2} = {x:2}); }; f2();',
    'function foo([abc.d]) {}',
    'function foo([super]) {}',
    '[...[a+1] = [{}];',
    '[...[a] = []] = [[]];',
    '([...[a] = []] = [[]]);',
    '[...{x} = {}] = [{}];',
    '([...[a] = []] = [[]]);',
    'r1; ({a:(a1 = r1) = 44} = {})',
    '({foo() {}} = {});',
    '({get foo() {}} = {});',
    '({set foo(a) {}} = {});',
    '({set ["foo"](a) {}} = {})',
    '({a: ({d = 1,c = 1}.c) = 2} = {});',
    'function f1() { a = 10; [a+2] = []; }; f1();',
    'function f1() { a = 10; [a+2] = []; }; f1();',
    'function f1() { a = 10; [a+2] = []; }; f1();',
    'function f1() { a = 10; [a+2] = []; }; f1();',
    '[++a] = [];',
    '[a + 1] = [];',
    '([a + 1] = []);',
    '({a: [a + 1] = []});',
    '[1, a] = [];',
    '([1, a] = []);',
    '[1, a] = [];',
    '[...a, ...b] = [];',
    ' [...a, b] = [];',
    ' [...a = 1] = [];',
    '[((a)] = [];',
    '[a)] = [];',
    '[...c = 1] = []',
    '[...c, d] = []',
    '[123] = []',
    "['string'] = []",
    '[false] = []',
    '[null] = []',
    '[a, ...b, c] = 20',
    '[a, ...b,] = 20',
    '[a, ...b,,] = 20',
    '[a, ...b = 20] = 20',
    '(function ([a, ...b,]) { })',
    '(function ([a, ...b,,]) { })',
    '(function ([a, ...b = 20,,]) { })',
    '[null] = []',
    String.raw`[n\u{75}ll] = []`,
    '({a: 1} = []);',
    '[[(a)], ((((((([b])))))))] = [[],[]];',
    '({a:({a}), b:((({b})))} = {a:{}, b:{}} );',
    'function foo() { return {}; }; [foo()] = [];',
    '({...this}) => x;',
    '([...this]) => x;',
    'var a = 1; (delete [a] = [2]);',
    'var x, b; for ([x] = [((b) = 1)] of " ") { }',
    'for (let []; ;) { }',
    '({x : , y} = {});',
    'var {x :  , y} = {};',
    'var {x :  } = {};',
    'x=5=y',
    '({a}=1)=1',
    '({a:a}=1)=1',
    '({a}=1=1)',
    '({a:a}=1=1)',
    'function f() { ({a:a}=1=1) }',
    '(a.x++)++',
    '++((a))--',
    'function f(){ a() = 0; }',
    'function f(){ ++a(); }',
    '++ new new a ++',
    'a: b: c: (1 + null) = 3',
    'a: ((typeof (a))) >>>= a || b.l && c',
    's: l: a[2](4 == 6, 5 = 6)(f[4], 6)',
    'for (var a = 7, b = c < d >= d ; f()[6]++ ; --i()[1]++ ) {}',
    'if (0) new a(b+c) = 5',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true });
      });
    });

    it(`var x, y, z; for (x of ${arg} = {});`, () => {
      t.throws(() => {
        parseSource(`var x, y, z; for (x of ${arg} = {});`, { next: true, lexical: true });
      });
    });
    it(`var x, y, z; for (x in ${arg} = {});`, () => {
      t.throws(() => {
        parseSource(`var x, y, z; for (x in ${arg} = {});`, { next: true });
      });
    });
    it(`var x, y, z; for (x in ${arg} = {});`, () => {
      t.throws(() => {
        parseSource(`var x, y, z; for (x in ${arg} = {});`, { webcompat: true });
      });
    });
  }

  // Valid
  for (const arg of [
    '[((((a)))), b] = [];',
    '[x, y, ...z = 1]',
    '[...z = 1]',
    '[x, y, ...[z] = [1]]',
    '[...[z] = [1]]',
    '(a.b) = 0',
    'a0({});',
    '(a) = 0',
    'x=y',
    ' x=y=z',
    'x=5',
    '(a) = 2;',
    '((a)) = b;',
    '({ a: 1 }).a === 1',
    '({ responseText: text } = res)',
    '(({a = {b} = {b: 42}}) => a.b)({})',
    ' [{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};',
    '([{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {});',
    '([{x:x, y:y}, [a,b,c]])',
    '({ x : [ y[z] = 10 ] = {} })',
    '({ x : [ y = 10 ] = {} })',
    '({ x : [ foo().y = 10 ] = {} })',
    '({ x : [ foo()[y] = 10 ] = {} })',
    '({ x : [ y.z = 10 ] = {} })',
    '({ x : [ y[z] = 10 ] = {} })',
    '[{eval}.x] = [];',
    '[...{eval}.x] = [];',
    '({a: {eval}.x} = {});',
    '({...{eval}.x} = {});',
    '[{arguments}.x] = [];',
    '({ z : { __proto__: x, __proto__: y } = z })',
    '({ x : [ y[z] = 10 ] = {} })',
    '([ x ])',
    '([ foo().x ])',
    '([ foo()[x] ])',
    '([ x.y ])',
    '([ x[y] ])',
    '([ { x } ])',
    '([ { x : y } ])',
    '([ { x : foo().y } ])',
    '([ { x : foo()[y] } ])',
    '([ { x : x.y } ])',
    '([ { x : x[y] } ])',
    '[ { x = 10 } = {} ]',
    '[ { x : y = 10 } = {} ]',
    '[ { x : foo().y = 10 } = {} ]',
    '[ { x : foo()[y] = 10 } = {} ]',
    '[ { x : x.y = 10 } = {} ]',
    '[ { x : x[y] = 10 } = {} ]',
    '[ [ x = 10 ] = {} ]',
    '[ [ foo().x = 10 ] = {} ]',
    '[ [ foo()[x] = 10 ] = {} ]',
    '([ { x = 10 } = {} ])',
    '([ { x : y = 10 } = {} ])',
    '([ { x : foo().y = 10 } = {} ])',
    '([ { x : foo()[y] = 10 } = {} ])',
    '([ { x : x.y = 10 } = {} ])',
    '([ { x : x[y] = 10 } = {} ])',
    '([ [ x = 10 ] = {} ])',
    '([ [ foo().x = 10 ] = {} ])',
    '([ [ foo()[x] = 10 ] = {} ])',
    '({42 : x = 42})',
    '({[1+1] : z})',
    '({[foo()] : z})',
    '({ x : x, y : y })',
    '({x})',
    '({ x : y, ...z })',
    '({ x : y = 1, ...z })',
    '({...x})',
    '({x, ...y})',
    '({[x] : z, ...y})',
    '([{x:x, y:y}, [a,b,c]])',
    '([{x:x, y:y}, [a,b,c]])',
    '([{x:x, y:y, ...z}, [a,b,c]] = {})',
    '({x, ...y} = {})',
    '({[x] : z, ...y} = {})',
    '({[1+1] : z, ...x} = {})',
    '({arguments: x, ...z} = {});',
    'function f( { __proto__: x, __proto__: y, ...z} ) {}',
    'function f( {eval: x} ) {}',
    'function f( {var: x = 42} ) {}',
    'function f( {"isiah" : x = 42} ) {}',
    'function f( {[foo()] : z}) {}',
    'f = (argument1, [a,b,c]) => {};',
    'f = (argument1, { x : x, y : y = 42 }) => {};',
    'f = (argument1, [{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]]) => {};',
    'f = (argument1, [a,b,...rest]) => {};',
    'f = (argument1, {x = 42, y = 15, ...z}) => {};',
    '({arguments: x} = {})',
    '({"hi" : x} = {})',
    '({42 : x} = {})',
    '([a,,...rest] = {})',
    '({var: x = 42} = {})',
    'f = ( {[x] : z} ) => {};',
    'function f(argument1, [...rest]) {}',
    'function f(argument1, { x : y = 1, ...z }) {}',
    'function f(argument1, { x : x, y : y = 42, ...z }) {}',
    '({...arguments} = {})',
    '({x:y} = {});',
    'function foo() { return {x:1}; }; [...foo().x] = [10];',
    // Object destructuring with shorthand initializer
    '({x = 1} = {});',
    '({x, y = 1, z = 2} = {});',
    '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
    '({x} = 0)',
    '({x,} = 0)',
    '({x,y} = 0)',
    '({x,y,} = 0)',
    '({[a]: a} = 1)',
    '({x = 0} = 1)',
    '({x = 0,} = 1)',
    '({x: y} = 0)',
    '({x: y,} = 0)',
    '({var: x} = 0)',
    '({"x": y} = 0)',
    "({'x': y} = 0)",
    '({0: y} = 0)',
    '({0: x, 1: x} = 0)',
    '({x: y = 0} = 1)',
    '({x: y = z = 0} = 1)',
    '({x: [y] = 0} = 1)',
    '({a:let} = 0);',
    '({let} = 0);',
    '({a:yield} = 0);',
    '({yield} = 0);',
    '({yield = 0} = 0);',
    '(function*() { [...{ x = yield }] = 0; })',
    '({x, y = 1, z = 2} = {});',
    '[[...x] = [2, 1, 3]]',
    '[{ x, y, z } = { x: 44, y: 55, z: 66 }]',
    '[{ x: 11, y: 22, z: 33 }]',
    '[...[]]',
    'f = ([x]) => {}',
    'function fn2([{} = 42]) {}',
    'function fn3([a, {b: c}]) {}',
    'function fn4([a, {b: []}]) {}',
    'function fn1([a, b]) {}',
    'function fn2([a, b,]) {}',
    'function fn3([a,, b,]) {}',
    'function fn1([,]) {}',
    'function fn2([,,]) {}',
    'function fn1([...args]) {}',
    'function fn2([,,,,,,,...args]) {}',
    'function fn3([x, {y}, ...z]) {}',
    'function fn4([,x, {y}, , ...z]) {}',
    'function fn5({x: [...y]}) {}',
    'function fna({x: y}) {}',
    'function fnb({x: y = 42}) {}',
    'function fnc({x: {}}) {}',
    'function fnd({x: {y}}) {}',
    'function fne({x: {} = 42}) {}',
    'function fnf({x: {y} = 42}) {}',
    'function fn1({x,}) {}',
    'function fn2({a: {p: q, }, }) {}',
    'function fn3({x,}) {}',
    'function fna({x}) {}',
    'function fnb({x, y}) {}',
    'function fnc({x = 42}) {}',
    'function fnd({x, y = 42}) {} ',
    'function fn1({a: {p: q}, b: {r}, c: {s = 0}, d: {}}) {}',
    'function fn2(x, {a: r, b: s, c: t}, y) {}',
    'function fn3({x: {y: {z: {} = 42}}}) {}',
    'function fn1([{}]) {}',
    'function fn2([{a: [{}]}]) {}',
    'function fn3({a: [,,,] = 42}) {}',
    'function fn4([], [[]], [[[[[[[[[x]]]]]]]]]) {}',
    'function fn4([[x, y, ...z]]) {}',
    '([a,,b]=0)',
    '([[]]=0)',
    '([...{x}] = y)',
    '([...a] = 0)',
    '([let] = answer);',
    'function a([a=0]) {}',
    'function fn1([a, b = 42]) {}',
    'function fn2([a = 42, b,]) {}',
    'function fn3([a,, b = a, c = 42]) {}',
    'function fn2([{} = 42]) {}',
    'function fn3([a, {b: c}]) {}',
    'function fn4([a, {b: []}]) {}',
    'function fn1([a, b]) {}',
    'function fn2([a, b,]) {}',
    'function fn3([a,, b,]) {}',
    'function fn1([,]) {}',
    'function fn2([,,]) {}',
    'function fn1([...args]) {}',
    'function fn2([,,,,,,,...args]) {}',
    'function fn3([x, {y}, ...z]) {}',
    'function fn4([,x, {y}, , ...z]) {}',
    'function fn5({x: [...y]}) {}',
    'function fn({}) {}',
    'function fna({x: y}) {}',
    'function fnb({x: y = 42}) {}',
    'function fnc({x: {}}) {}',
    'function fnd({x: {y}}) {}',
    'function fne({x: {} = 42}) {}',
    'function fnf({x: {y} = 42}) {}',
    'function fn2({a: {p: q, }, }) {}',
    'function fn1({x,}) {}',
    'function fn3({x,}) {}',
    'function fna({x}) {}',
    'function fnb({x, y}) {}',
    'function fnc({x = 42}) {}',
    'function fnd({x, y = 42}) {}',
    'function fn1({a: {p: q}, b: {r}, c: {s = 0}, d: {}}) {}',
    'function fn2(x, {a: r, b: s, c: t}, y) {}',
    'function fn3({x: {y: {z: {} = 42}}}) {}',
    'function fn4([], [[]], [[[[[[[[[x]]]]]]]]]) {}',
    'function fn2([{a: [{}]}]) {}',
    'function fn3({a: [,,,] = 42}) {}',
    'function fn4([[x, y, ...z]]) {}',
    '({b} = b);',
    '([b] = b);',
    '({a, b} = {a: 1, b: 2});',
    '[a, b] = [1, 2]',
    'let {start, stop} = node;',
    '(a) = {}',
    '(a["b"]) = {}',
    '(a.b) = {}',
    'test = { a: 1 }',
    '(new f()[0]) = 1;',
    '(new f().a) = 1;',
    '(f().a) = 1;',
    '(obj[0]) = 1;',
    '(obj.a) = 1;',
    '({x} = {}, {y} = {})',
    '[{a=b}=0]',
    '[{a=0}, ...b] = 0',
    '[a = 0, ...{b = 0}] = 0',
    '[[x]] = 0',
    '[x.a=a] = 0',
    '[x[a]=a] = 0',
    '(function([ x = y = 1 ]) {}([]));',
    '[{a=0},{a=0}] = 0',
    '[] = 0',
    '[...[...a[x]]] = 1',
    'function f7({a: x}) { x = 2; return arguments[0].a }',
    '(function({x}, {y} = {}, {z}, {v} = {}, ...a) {})',
    '(function(x, {y} = {}, {z}, {v} = {}) {})',
    '(function({x}, {y} = {}, {z}, ...a) {})',
    '(function(x, {y}, {z} = {}) {})',
    'function f1({a = x}, x) { return a }',
    'function f5({a = () => x}, x) { return a() }',
    'function f11({a = b}, {b}) { return a }',
    'function f15({a = () => b}, {b}) { return a() }',
    'function f30({x = a}, ...a) { return x[0] }',
    'function f34({x = function() { return a }}, ...a) { return x()[0] }',
    'function f35({x = () => a}, ...a) { return x()[0] }',
    '([((x, y) => z).x])',
    '({x: ((y, z) => z).x})',
    "([((x, y) => z)['x']])",
    "({x: ((y, z) => z)['x']})",
    '([(({ x } = { x: 1 }) => x).a])',
    '({ ...d.x })',
    '({ ...c[0]})',
    '({ x: (y) })',
    '({ x: (y) = [] })',
    '({ x: (foo.bar) })',
    '() => 42',
    'x => x',
    'x => x * x',
    '(x) => x',
    '(x) => x * x',
    '(x, y) => x + y',
    '(x, y, z) => x, y, z',
    '(x, y) => x.a = y',
    "() => ({'value': 42})",
    'a, b => 0',
    'a, b, (c, d) => 0',
    '(a, b, (c, d) => 0)',
    '(a, b) => 0, (c, d) => 1',
    '(a, b => {}, a => a + 1)',
    '((a, b) => {}, (a => a + 1))',
    '(a, (a, (b, c) => 0))',
    '([a = 1])',
    '({42e-2 : x})',
    '({42e-2 : x = 42})',
    '({}) => {}',
    '(a, {}) => {}',
    '({}, a) => {}',
    '([]) => {}',
    '(a, []) => {}',
    '([], a) => {}',
    '(a = b) => {}',
    '(a = b, c) => {}',
    '(a, b = c) => {}',
    '([y]) => x;',
    '([y, [x]]) => x;',
    '({foo: y, a:{bar: x}}) => x; ',
    '({y, a:{x}}) => x; ',
    '({y}) => x; ',
    'const [a] = []; ',
    'let [a] = []; ',
    'const {a:b} = {}; ',
    'const {a} = {}; ',
    'let {a:b} = {}; ',
    'let {a} = {}; ',
    'function f([x] = [1]) {}; ',
    '({f({x} = {x: 10}) {}}); ',
    '({f: function({x} = {x: 10}) {}}); ',
    'f = function({x} = {x: 10}) {}; ',
    '({ x([ a, b ]){} });',
    '[ok.v] = 20; ',
    'var {x: y, z: { a: b } } = { x: "3", z: { a: "b" } }; ',
    'var [x, , [, z]] = [1,2,[3,4]]; ',
    '(function x([ a, b ]){}); ',
    'function x([ a, b ]){}; ',
    'function x(a, { b }){}; ',
    'function a([x, , [, z]]) {}; ',
    'function a({x: y, z: { a: b } }) {}; ',
    '(function x({ a, b }){}); ',
    '({x,y,} = 0)',
    '({[a]: a} = 1)',
    '({x = 0} = 1)',
    '({x = 0,} = 1)',
    '({x: y} = 0)',
    '({x: y,} = 0)',
    '({var: x} = 0)',
    '({"x": y} = 0)',
    '({0: x, 1: x} = 0)',
    '({x: y = 0} = 1)',
    '({x: y = z = 0} = 1)',
    '({x: [y] = 0} = 1)',
    '({let} = 0);',
    '(function*() { [...{ x = yield }] = 0; })',
    '({} = 0);',
    '[a,a,,...a]=0;',
    '[a] = 0;',
    '[x,] = 0',
    '[x, y, ...z] = 0',
    '[...a[0]] = 0;',
    '[x, ...{0: y}] = 0',
    '[x, ...x] = 0',
    '[x.a=a] = b',
    '[x[a]=a] = b',
    '[...[...a[x]]] = b',
    '[{a=0},{a=0}] = 0',
    '[a = 0, ...{b = 0}] = 0',
    '[{a=0}, ...b] = 0',
    'var [{a = 0}] = 0;',
    'var [{__proto__:a, __proto__:b}] = 0;',
    'var {a, x: {y: a}} = 0;',
    'var a, {x: {y: a}} = 0;',
    'var {let, yield} = 0;',
    'try {} catch ({e}) {}',
    'let [a,,]=0',
    'let {} = 0',
    'for (let {} in 0);',
    'let {a,} = 0',
    'try { } catch ({}) {}',
    '({yield} = 0);',
    outdent`
      var x = {
        baz(a = 10) {},
        foo(a, b = 10) {},
        toast(a, b = 10, c) {}
      };
    `,
    'function f(a = 1) {} ',
    'x = function(y = 1) {} ',
    'x = { f: function(a=1) {} } ',
    'var foo = function(a, b = 42, c) {}; ',
    '([])=>0;',
    '([,,])=>0',
    '({a,b=b,a:c,[a]:[d]})=>0;',
    '({x = 10, y: { z = 10 }}) => [x,y]',
    '[a=10] = 0',
    'var {a = 10} = {}',
    '([a]) => [0];',
    '([a,b])=>0;',
    '([a,...b])=>0;',
    '({})=>0;',
    '[,,]=0',
    '({a = 5} = {})',
    '({b, c, d, ...{a} })',
    '({...b} = {})',
    '({a, ...b} = {})',
    '(function*() { [...{ x = yield }] = 0; })',
    '({x: y = z = 0} = 1)',
    '({x: [y] = 0} = 1)',
    '({a:let} = 0);',
    '({let} = 0);',
    '({a:yield} = 0);',
    'let {a:b=c} = 0;',
    '({[a]: a} = 1)',
    '({x,y,} = 0)',
    '({x,y} = 0)',
    '({x=0, y:z} = 0)',
    '({x} = 0)',
    '[...a[0]] = 0;',
    '[a,b=0,[c,...a[0]]={}]=0;',
    '[{a=b}=0]',
    'for([a,b[a],{c,d=e,[f]:[g,h().a,(0).k,...i[0]]}] in 0);',
    '([a,...b])=>0;',
    'for(a,b,c;;);',
    '({x = 10, y: { z = 10 }}) => [x, z] ',
    '({x = 10}) => x ',
    'var [x = 10, y = 5, z = 1] = a; ',
    'var {x: x, y: y, z: { a: a = 10} } = b; ',
    'var [x = 10, y, z] = a; ',
    'var [x = 10, [ z = 10]] = a; ',
    'var [x = 10, [ z ]] = a; ',
    '[x=10] = x ',
    'var {x = 10, y = 5, z = 1} = a; ',
    'var {x: x = 10, y: y = 10, z: z = 10} = a; ',
    'var {x: x, y: y = 10, z: z} = a; ',
    'var { x: x = 10 } = x; ',
    'var {x, y: y = 10, z} = a; ',
    'var {x = 10, y, z} = a; ',
    'var {x = 10, y: { z = 10}} = a; ',
    'var {x = 10, y: { z }} = a; ',
    'var {x = 10} = x ',
    'function a([x = 10]) {} ',
    'function a({x = 10, y: { z = 10 }}) {}; ',
    'function a({x = 10}) {} ',
    '({a}) => {}',
    '(x = 9) => {}',
    '(x, y = 9) => {}',
    '(x = 9, y) => {}',
    '(x, y = 9, z) => {}',
    '(x, y = 9, z = 8) => {}',
    '({a} = {}) => {}',
    '([x = 10]) => x ',
    '(a, b=(c)=>{}) => {} ',
    '([x] = []) => {}',
    '({a = 42}) => {}',
    '([x = 0]) => {}',
    '(x, y = 9, {b}, z = 8, ...a) => {}',
    '(...a) => {}',
    '(x, ...a) => {}',
    '(x = 9, ...a) => {}',
    '(x, y = 9, ...a) => {}',
    '[a] = {};',
    '[a] = {};',
    '[(async function() {})]',
    '[(function*() {})]',
    '[(foo())]',
    '[[[] = [function () { }] ] = []]',
    'a = ({x = 1}) => x;',
    'a = (b, {x = 1}) => x',
    'a = ({x = 1}, b) => x',
    'function foo({arguments}) { arguments; }; foo({arguments:1});',
    'function foo() { [this.x] = []; }',
    'function foo() { ({x:this.x} = {}); }',
    '[...((a))] = [1, 2, 3]',
    '({ tyssjh = ((cspagh = 4) => a) } = 1) => { /*jjj*/ }; (function(a) { })()',
    'function foo([arguments]) { arguments; }; foo([1]);',
    'function foo() { function bar([a]) { a = 1; } }',
    'function foo(y, [x]) {}',
    'function foo(y, {x:x}) {}',
    'function foo({x:x}) {}',
    'function foo([x]) {}',
    'function foo({}) {}',
    'function foo({x1:x1, x2:x2, x3:x3}, {y1:y1, y1:y2}) {}',
    'function foo([x1, x2, x3], [y1, y2, y3]) {}',
    'function foo({x1:x1}, [y1]) {}',
    'function foo([x1], {y1:y1}) {}',
    'function foo(x1, {x2, x3}, [x4, x5], x6) {}',
    'function foo({x1:[y1]}) {}',
    'function foo([x1, {y1:y1}]) {}',
    'bar = function foo({x1}, [x2]){};',
    'obj = { foo({x}) {}, set prop([x]) {} }',
    'function foo([x = 20]) {}',
    'function foo({x:x = 10}) {}',
    'function foo({x1:x1 = 1}, {y1:y1 = 2}) {}',
    'function foo({x1:x1 = 1, x2:x2 = 2, x3:x3 = 3}) {}',
    'function foo([x1 = 1], {y1:y1 = 2}) {}',
    'function foo({x:x = 1} = {x:2}) {}',
    'function foo([x = 1] = [2]) {}',
    'function foo({x1:[y1 = 1]}) {}',
    'function foo([x1, {y1:y1 = 1}]) {}',
    'function foo([{y1:y1 = 1} = {y1:2}] = [{y1:3}]) {}',
    'function foo({x1:[y1 = 1] = [2]} = {x1:[3]}) {}',
    '({a: [b = 1, c = 2][1]} = {a:[]});',
    '({a: [b = 1, c = 2].b} = {a:[]});',
    '[...[...[...a]]] = [[[]]];',
    'obj = {x:1}; [...obj["x"]] = [10];',
    'obj = {x:1}; [...obj.x] = [10];',
    '[...{a:a = 1}] = [{}];',
    ' [...[a = 1]] = [[]];',
    '([...{a}] = [{}]);',
    '[...{a}] = [{}];',
    'zee = "x"; ({[zee +"foo"]:x1} = {})',
    'a = {}; ({x:a["x"]} = {});',
    'function foo() { return {}; }; ({x:foo()["x"]} = {});',
    ' a = {}; ({x:a.x} = {});',
    '({x:z = 1, x1:y = 20} = {});',
    '({x, x1:y = 20} = {});',
    '[a] = [];',
    '( [a] = []);',
    '[a] = [2];',
    '[a, b] = [1];',
    '[a] = [1, 2];',
    'function foo() { return {}; }; [foo().x] = [];',
    'a = {}; [a.x] = [];',
    '[[...a], ...b] = [[],];',
    '[[[...a]]] = [[[]]];',
    '[a, [b]] = [1, []];',
    '[[a]] = [[]];',
    '[a = 1, b] = [];',
    '[a = 1] = [];',
    '[...a] = [];',
    '[a] = [,,];',
    ' [,,a] = [];',
    'a = [1], i = 0; [a[(() => 1 + i)()]] = [];',
    '[a, b] = [1];',
    '[a] = [2];',
    '({a:a} = {a:10.5})',
    'obj2 = {__proto__ : p};',
    'function f1({a} = {a:1}, b, [c] = [2]) {}',
    '({ a: this.a } = {})',
    "({ a: this['a'] } = {})",
    '[this.a ] = []',
    '[...this[0]] = []',
    '[...[function f() {}.prop]] = []',
    '[...[{prop: 1}.prop]] = []',
    '[...[this[0], ...this[1]]] = []',
    '({ a: obj.a } = {})',
    "({ a: obj['a'] } = {})",
    '({ a: obj["a"] } = {})',
    "({ a: function() {}['prop'] } = {})",
    '({ a: {prop: 1}.prop } = {})',
    '[obj.a ] = []',
    "[obj['a']] = []",
    '[obj[0]] = []',
    '[function(){}.prop] = []',
    'a[i]',
    '(a.b = {});',
    '(a[i] = {});',
    'f = ([cls = class {}]) => {}',
    'f = ([xCls = class X {}]) => {}',
    'f = ([xCls2 = class { name() {} }]) => {}',
    'f = ([xCls2 = class { static name() {} }]) => {}',
    'f = ([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) => {}',
    '[{prop: 1}.prop] = []',
    '({__proto__: a, __proto__: b} = {});',
    'var {__proto__: a, __proto__: b} = {};',
    'var f3 = ({__proto__: a, __proto__: b} = {}) => {}',
    'var f2 = ({__proto__: a, __proto__: b}) => {}',
    'bar1 = ( {abcdef  = (((((a1)) = (30))))} = (b1 = 40) ) => { try { throw a1; } catch(a1) { } };',
    'var e = 1; ( {mnopqrs = (((  foo   = (1))))} = (e)) => {  try{ } catch(e) {}}',
    'var e = 1;       ( {ghijkl  = (((((foo)) =  1 )))} = (e)) => {  try{ } catch(e) {}}',
    'var e = 1;       ( {abcdef  = (((((foo)) = (1))))} = (e)) => {  try{ } catch(e) {}}',
    'var e = 1; ( {tuvwxy  = (((  {}   =  1 )))} = (e)) => {  try{ } catch(e) {}}',
    'var e = 1; ( {mnopqrs = (((  {}   = (1))))} = (e)) => {  try{ } catch(e) {}}',
    'bar4 = ( { b4 = ((xyz = 4) => a4) } = 1) => { b4 = 35; return b4; }; ',
    'function bar() { this.x = ({ y1: { z1:z1 = ((arguments)) } } = {}); { } }',
    '[[[] = [function () { }] ] = []]',
    'var a = ({x = 1}) => x;',
    'var a = (b, {x = 1}) => x;',
    'var a = ({x = 1}, b) => x;',
    'var {} = {};',
    '({} = {});',
    'var {x:y} = {};',
    'let {x:y} = {};',
    '({x:y} = {});',
    'var {x} = {}, {y} = {};',
    'var {x:x = 20} = {};',
    'let {x:x = 20} = {};',
    'var x; ({x:x = 20} = {});',
    'var z, y; ({x:z = 1, x1:y = 20} = {});',
    'function foo() { return {}; }; ({x:foo().x} = {});',
    "function foo() { return {}; }; ({x:foo()['x']} = {});",
    'var a = [1], i = 0; ({x:a[i++]} = {});',
    "var zee = 'x'; var {[zee]:x1} = {}",
    "var zee = 'x'; var x1; ({[zee]:x1} = {})",
    "var zee = 'x'; var {[zee + 'foo']:x1} = {}",
    "var zee = 'x'; var x1; ({[zee +'foo']:x1} = {})",
    'let a; [...[a]] = [[]];',
    'let a; [...{a}] = [{}];',
    "let obj = {x:1}; [...obj['x']] = [10];",
    'let obj = {x:1}; [...obj.x] = [10];',
    "function foo() { return {x:1}; }; [...foo()['x']] = [10];",
    'let [...[...[...a]]] = [[[]]];',
    'var {a:a, a:a} = {};',
    'let a; ({a:((((a1))))} = {a:20})',
    'let a, r1; ({a:a1 = r1 = 44} = {})',
    'var x, y; ({x, x1:y = 20} = {});',
    'var {x, x1:y = 20} = {};',
    'var {x:z = 1, x1:y = 20} = {};',
    '({x:y} = {});',
    'var {x} = {};',
    'var {x} = {}, {y} = {};',
    'var a; `${({a} = {})}`',
    'var a; [a = class aClass {}] = []',
    'var a; for ({x:x = class aClass {}} of []) {}',
    'var {x:[...y]} = {x:[1]}',
    '({a: [b = 1, c = 2][1]} = {a:[]});',
    '({a: [b = 1, c = 2].b} = {a:[]});',
    '({x = 1} = {});',
    '({x, y = 1, z = 2} = {});',
    'var a = 1; ({x = {a = 1} = {}} = {});',
    'var a = 1; var {x = {a = 1} = {}} = {};',
    '[{x : [{y:{z = 1}}] }] = [{x:[{y:{}}]}];',
    '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
    'var [{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
    '[...{x = 1}] = [{}]',
    'let a, r1; ({a:a1 = r1} = {})',
    outdent`
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
    outdent`
      ({
          x:{
              y:{
                  z:{
                      k:k2 = 31
                    } = {k:21}
                } = {z:{k:20}}
             } = {y:{z:{}}}
      } = {x:{y:{z:undefined}}});
    `,
    outdent`
      let {1:x1, 0:y1} = [11, 22];
      let {0:x2} = {"0":33};
      let {function:x3} = {function:44};
    `,
    '({[key]:x2} = {x:20});',
    '({[`abc${"def"}`]:x2} = {abcdef:30});',
    '({x:a.x} = {x:10});',
    ' ({x:a["x"]} = {x:20});',
    '({x:foo().x, y:foo().y} = {x:20, y:30});',
    '(((((({x:foo().x, y:foo().y} = {x:201, y:301}))))));',
    'let [...[a]] = [1, 2, 3];',
    'let [...{1:x1}] = [1, 2, 3];',
    ' let [...[,...[[x2]]]] = [[1, 2], [3, 4], 5];',
    'let {first:f1, second : [,{y}]} = {first:"first", second:[{y:20, z:30}, {y:21, z:31}, {y:22, z:32}]};',
    'let [{x}, {z}] = [{x:1, z:20}, {x:2, z:30}, {x:3,z:40}];',
    '[{x:x}, , {z:z}] = [{x:11, z:201}, {x:21, z:301}, {x:31,z:401}];',
    'while ({y:y2} = {y:y2-2}) {}',
    ' for (let {x, y} = {x:10, y:20}; x<y; {x:x} = {x:x+2}) {}',
    'for ({y:[item]} of data2().x) {}',
    ' function data2() {return {x:[{y:[20]}, {y:[30]}]};}',
    ' let {a, b, ...rest} = {a: 1, b: 2, c: 3, d: 4};',
    'var {a, b, ...rest} = {a: 1, b: 2, c: 3, d: 4};',
    'let {a, b, double: {c, ...rest}} = {a: 1, b: 2, double: {c: 3, d: 4}};',
    'bar = [{a: 1, b: 2, c: 3, d: 4}];',
    'let {a, ["b"]:b, ...rest} = {a: 1, b: 2, c: 3, d: 4};',
    'var {a, [foo(false)]:b, ...rest} = {a: 1, b: 2, c: 3, d: 4};',
    'let source = {get a() {val++; return 1;}, get b() {return val;}};',
    'let source = {get a() {val++; return 1;}, get b() {return val;}};',
    'let {...rest} = "edge";',
    '[a,b] = [10,20];',
    'var [,a] = 0;',
    'let [[]]=0',
    'var [[a]]=0;',
    'try {} catch ([e, ...a]) {}',
    '({b = (a,) => {}}) => {}',
    '({ a: obj["a"] } = {})',
    '({x} = 0)',
    '({x,y,} = 0)',
    '({0: y} = 0)',
    '({0: x, 1: x} = 0)',
    '({x: y = z = 0} = 1)',
    '({x: [y] = 0} = 1)',
    '({a:let} = 0);',
    '({let} = 0);',
    '({a:yield} = 0);',
    '({yield = 0} = 0);',
    '(function*() { [...{ x = yield }] = 0; })',
    '({} = 0);',
    '[a,a,,...a]=0;',
    '[[x]] = 0',
    '[...a[0]] = 0;',
    '[x, ...{0: y}] = 0',
    '[...[x]] = 0',
    '[x.a=a] = b',
    '[...[...a[x]]] = b',
    '[{a=0},{a=0}] = 0',
    '[a = 0, ...{b = 0}] = 0',
    '[{a=0}, ...b] = 0',
    '[a, b] = [b, a]',
    '({ a: {prop: 1}.prop } = {})',
    '[0 , ...a = 0]',
    '[,...a]',
    '[a, ...(b=c)]',
    '[ 0, ]',
    'var o = {p: 42, q: true};',
    'var {p: foo, q: bar} = o;',
    'var {a = 10, b = 5} = {a: 3};',
    'var {a: aa = 10, b: bb = 5} = {a: 3};',
    'function drawES2015Chart({size = "big", coords = {x: 0, y: 0}, radius = 25} = {}) {}',
    'for (var {name: n, family: {father: f}} of people) {}',
    'let {[key]: foo} = {z: "bar"};',
    'let {a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40}',
    'for (let [a = b] of [0, c = 0]);',
    'try {} catch ([e, ...a]) {}',
    'try {} catch ([e]) {}',
    'var [a, ...a] = 0;',
    'let foo = "bar";',
    'let foo2 = () => "bar";',
    'let {[foo]: bar} = {bar: "bar"};',
    'let {["bar"]: bar2} = {bar: "bar"};',
    'let {[11]: bar2_1} = {11: "bar"};',
    'let {[foo2()]: bar3} = {bar: "bar"};',
    'let [{[foo]: bar4}] = [{bar: "bar"}];',
    'let [{[foo2()]: bar5}] = [{bar: "bar"}];',
    '({[foo]: bar} = {bar: "bar"});',
    'let [{[foo.toExponential()]: bar7}] = [{bar: "bar"}];',
    '({[foo2()]: bar3} = {bar: "bar"});',
    '[{[foo]: bar4}] = [{bar: "bar"}];',
    '[{[foo2()]: bar5}] = [{bar: "bar"}];',
    '[{[foo()]: bar4}] = [{bar: "bar"}];',
    '[{[(1 + {})]: bar4}] = [{bar: "bar"}];',
    'let { [foo]: bar } = { bar: "bar" };',
    'let { ["bar"]: bar2 } = { bar: "bar" };',
    'let foo2 = () => "bar";',
    'let { [foo2()]: bar3 } = { bar: "bar" };',
    'let [{ [foo]: bar4 }] = [{ bar: "bar" }];',
    'let [{ [foo2()]: bar5 }] = [{ bar: "bar" }];',
    'function f4([{ [foo]: x }]) { }',
    'function f3({ [foo2()]: x }) { }',
    'function f5([{ [foo2()]: x }]) { }',
    'let [{ [foo()]: bar6 }] = [{ bar: "bar" }];',
    'let [{ [foo.toExponential()]: bar7 }] = [{ bar: "bar" }];',
    '({ [foo]: bar } = { bar: "bar" });',
    '({ ["bar"]: bar2 } = { bar: "bar" });',
    '({ [foo2()]: bar3 } = { bar: "bar" });',
    '[{ [foo]: bar4 }] = [{ bar: "bar" }];',
    '[{ [foo2()]: bar5 }] = [{ bar: "bar" }];',
    '[{ [foo()]: bar4 }] = [{ bar: "bar" }];',
    '[{ [(1 + {})]: bar4 }] = [{ bar: "bar" }];',
    'var [, a, , ] = [3, 4, 5];',
    'var _a, _b, _c, _d, _e, _f;',
    'var _g = foo, bar = { bar: "bar" }[_g];',
    'var bar2 = { bar: "bar" }["bar"];',
    'var foo2 = function () { return "bar"; };',
    'var _j = foo, bar4 = [{ bar: "bar" }][0][_j];',
    'var _k = foo2(), bar5 = [{ bar: "bar" }][0][_k];',
    'var _b = foo2(), x = _a[0][_b];',
    'var _l = foo(), bar6 = [{ bar: "bar" }][0][_l];',
    '(_a = foo, bar = { bar: "bar" }[_a]);',
    '(bar2 = { bar: "bar" }["bar"]);',
    '(_b = foo2(), bar3 = { bar: "bar" }[_b]);',
    '_c = foo, bar4 = [{ bar: "bar" }][0][_c];',
    '_d = foo2(), bar5 = [{ bar: "bar" }][0][_d];',
    '_e = foo(), bar4 = [{ bar: "bar" }][0][_e];',
    '_f = (1 + {}), bar4 = [{ bar: "bar" }][0][_f];sss',
    '(_a = foo, foo = _a.foo, bar = _a.bar);',
    'var _b = foo, foo = _b.foo, baz = _b.baz;',
    '({ foo, bar } = foo);',
    'var [a, ...a] = 0;',
    '_a = [1, 2], M.a = _a[0], M.b = _a[1];',
    '({ ...bar } = {});',
    'var _c = [3, 5, [0, 1]], _d = _c[2], b = _d[1];',
    'var [, , [, b, ]] = [3,5,[0, 1]];',
    'var [, , z] = [1, 2, 4];',
    "let {a, b = a} = {a: '', b: 1};",
    't[p[i]] = s[p[i]];',
    'var { x } = (foo());',
    'var x = (foo()).x;',
    'var x = foo().x;',
    'var x = 0..x;',
    'for (var [a, b] in []) {}',
    'var x = (new Foo).x;',
    'var toExponential = 0..toExponential;',
    'var [a3, b3] = [[x13, y13], { x: x13, y: y13 }];',
    'var _b = [1, 2, 3], x15 = _b[0], y15 = _b[1], a7 = _b.slice(2);',
    'var [x19, y19, z19, ...a13] = [1, "hello", true];',
    'var a5 = [1, 2, 3].slice(0);',
    '[{ x: 1 }].map(({ x }) => x );',
    '[{ x: 1 }].map(function (_a) { var x = _a.x; return x; });',
    'var a = [1].map(function (_) { return _; });',
    "const [, a = ''] = ''.match('') || [];",
    "var _a = ''.match('') || [], _b = _a[1], a = _b === void 0 ? '' : _b;",
    '(_a = a.x, x = _a === void 0 ? 1 : _a);',
    'var foo = { set foo(_a) { var start = _a[0], end = _a[1]; void start; void end; }, };',
    'p = { prop: p } = p;',
    "var _a = { a: '', b: 1 }, a = _a.a, _b = _a.b, b = _b === void 0 ? a : _b;",
    'var i1 = { i1: 2 }.i1;',
    'var _a = {}, _b = _a.a, a = _b === void 0 ? 1 : _b, _c = _a.b, b = _c === void 0 ? 2 : _c, _d = _a.c, c = _d === void 0 ? b : _d',
    'var foo = _b.foo, bar = _b.bar;',
    'var private = [["hello"]][0][0];',
    "test({ method: 'one', nested: { p: 'a' } })",
    'function takeFirstTwoEntries(...[[k1, v1], [k2, v2]]) { }',
    '  if ((b === undefined && c === undefined) || (this.b === undefined && this.c === undefined)) {}',
    'function f5([a1] = [undefined], {b1} = { b1: null }, c1 = undefined, d1 = null) {}',
    'var _a = (void 0)[0], a1 = _a === void 0 ? undefined : _a, _b = (void 0).b1, b1 = _b === void 0 ? null : _b, c1 = undefined, d1 = null;',
    'var x = _a[0], y = _a[1], z = _a[2];',
    'var [z_a, z_b, z_c] = [z.getA(), z.getB(), z.getC()];',
    'var aFoo = { bar: 3, baz: "b", nested: { a: 1, b: "y" } };',
    ' ({ ["x" + ""]: x } = 0);',
    '({ ["x"]: x } = 0); ',
    'let [{[foo()]: bar6}] = [{bar: "bar"}];',
    '(({ q }) => q)({ q : 13 });',
    '(({ p = 14 }) => p)({ p : 15 });',
    '((first, ...rest) => first ? [] : rest.map(n => n > 0))(8,9,10);',
    'var [...[a, b]] = [0, 1];',
    'var [...{0: a, b }] = [0, 1];',
    'let { toString } = 1;',
    'var [a, b] = { 0: "", 1: true }; ',
    'const [[k1, v1], [k2, v2]] = new Map([["", true], ["hello", true]])',
    'function f({} = {a: 1, b: "2", c: true}) {}',
    'function takeFirstTwoEntries(...[[k1, v1], [k2, v2]]) { }',
    'var { a: x11, b: { a: y11, b: { a: z11 }}} = { a: 1, b: { a: "hello", b: { a: true } } };',
    'let [] = null;',
    '[((((((x.y))))))] = obj',
    '[((((((x))))))] = obj',
    '[(x.y)] = obj',
    '[(x)] = obj',
    '[x] = obj',
    'function f({[x]: {y = z}}) {}',
    'function f({[x]: [y = z]}) {}',
    'function f({x: {y = z}}) {}',
    'function f({x: [y = z]}) {}',
    '({[a]: {}})',
    '({[a = b]: {}})',
    '({[a = (b)]: {}})',
    '({[(a)()]: {}})',
    '({[(a)(x = (y))]: {}})',
    '({[(a)()]: {}})',
    '({[(a)()]: {}})',
    '({"a": "b"})',
    '({["a"]: "b"})',
    '({a = [b]} = c)',
    '({a = [b]} = 1)',
    '({a = [b]} = 1)',
    '({a = [b]} = "a")',
    '({a = [b]} = 1 / (c = d))',
    '({a = [b]} = 1 / (d = (e)))',
    '({"a": [b]} = 1 / (d = (e)))',
    '({["a"]: [b]} = 1 / (d = (e)))',
    '({["a"]: [b]} = 1 / (d = (a	)  => a))',
    '({["a"]: [b]} = 1 / (d = ((a)) = a))',
    '({"a": [b]} = 1 / (d = ((a)) = a))',
    '({a: [b]} = 1 / (d = ((a)) = a))',
    '({"a": [b.c]} = 1 / (d = ((a)) = a))',
    '({"a": [b.c = x]} = 1 / (d = ((a)) = a))',
    '({1: [b.c = x]} = 1 / (d = ((a)) = a))',
    '({1: [b.c = x]} = 2 / (dd = ((a)) = 3))',
    '({1: a})',
    '({1: (a)})',
    '({1: {a: (a)}})',
    '({"string": {a: (a)}})',
    '({a: {b: (c)}})',
    '({a: "string"})',
    '({a: ("string") / 3 })',
    '({a: ("string") / a[3] })',
    '({a: ("string") / a[3](a = b) })',
    '({a: ("string") / a[3](a = b.c) })',
    '({a: ("string") / a[3](((((a = b.c))))) })',
    '({a: ("string") / a[3](((((a /= b.c))))) })  ',
    '({a: ("string") / a[3](((((a /= [b.c] = x))))) })',
    '({a: ("string") / a[3](((((a /= [b.c] = (x)))))) })',
    '({a: {}})',
    'function f1({a} = {a:1}, b, [c] = [2]) {}',
    'function f1(a = 1, b = function () { return 2; }, c = 3) {}',
    '({a2} = {a2:2});',
    '{{ { d;} }; var c = {d};}',
    '{{{ { d;} }; var c = {d}; {var d = [];}}}',
    'function foo () {  true ? e => {} : 1};',
    'new bar(...(new Array(2**16+1)))',
    'new Array(2**16-2)',
    'var bar = foo.bind({}, 1);',
    'var tests = [0, 0];  ',
    'var {x} = {};',
    'let {x} = {}, y = 1, {z} = {};',
    'let {x} = {}; [x] = [1]',
    'obj[17] = 222;',
    '({x} = {x:3});',
    '({x, y:[y]} = {x:5, y:[6]});',
    '[y, {z}]',
    'let [y, {z}] = foo;',
    'let {x} = [y = 10, {z:z = 11}]',
    'for ( let {x:item} of [{x:20}, {x:30}]) {}',
    'function data2() { return {x:[{y:[20]}, {y:[30]}]};}',
    'try { throw {x:10, z:["this is z"]}; }  catch({x, y, z:[z]}) {x;}',
    'var {x, y:[y]} = {x:1, y:[]}, {x1, y1:[y1]} = {x1:1, y1:[]};',
    'function foo( {x} = {x:10}, a, [y = 1] = [2]) {}',
    'function foo( {x = 10} , a, [y = 1] = [2]) {}',
    'for (let x in { a: 1, b: 2, c: 3 }) { a[i++] = function () { return x; }; }',
    'for (let x of [ 1, 2, 3 ]) { a[i++] = function () { return x; }; }',
    'for (const x of [ 1, 2, 3 ]) { a[i++] = function () { return x; }; }',
    'function f1( a = 10, b = arguments, c = ()=> a ) {function arguments() {return 100;}var d = b;b; }',
    'for (let x in { a: a[i++] = () => x }) { b[j++] = () => x; }',
    'for (let x in { a: a[i++] = () => x }) { b[j++] = () => x; }',
    'for (const x in { a: a[i++] = () => x }) { b[j++] = () => x; }',
    'for (let x of [ a[i++] = () => x ]) { b[j++] = () => x; }',
    'for (const x of [ a[i++] = () => x ]) { b[j++] = () => x; }',
    'for (let x in { a: a[i++] = () => eval("x") }) { b[j++] = () => eval("x"); }',
    'for (const x in { a: a[i++] = () => eval("x") }) { b[j++] = () => eval("x"); }',
    'for (let x of [ a[i++] = () => eval("x") ]) { b[j++] = () => eval("x"); }',
    'for (const x of [ a[i++] = () => eval("x") ]) { b[j++] = () => eval("x"); }',
    '((a, { b = 0, c = 3 }) => { return a === 1 && b === 2 && c === 3; })(1, { b: 2 });',
    '((a, x) => { let { b = 0, c = 3 } = y; return a === 1 && b === 2 && c === 3; })(1, { b: 2 });',
    '({ [key]: y, z, ...x } = {2: "two", z: "zee"});',
    '({...x}[y])',
    '[[[] = [function () { }] ] = []]',
    'for ([]; ;) { break; }',
    '(function () { var x; for ({x:x}.x of [1,2]) {}; })();',
    'var a = ({x = 1}) => x;',
    'var a = (b, {x = 1}) => x;',
    'var a = ({x = 1}, b) => x;',
    'bar3 = ( {aa3 = a3, bb3 = b3, abcdef  = (((((a3)) = (30))))} = (b3 = 40) ) => {}',
    'bar2 = ( {abcdef  = (((((a2)) = (30))))} = (b2 = 40) ) => { try { throw a2; } catch(a2) { } };',
    'bar1 = ( {abcdef  = (((((a1)) = (30))))} = (b1 = 40) ) => { try { throw a1; } catch(a1) { } };',
    'bar4 = ( { b4 = ((xyz = 4) => a4) } = 1) => { b4 = 35; return b4; }; ',
    'var d4 = (function( { a4, b4 } = { a4 : 20, b4 : 25 }) { return a4;})();',
    '[...((a5))] = [1, 2, 3];',
    '({} = undefined);',
    '[[a]=[1]] = [];',
    'function foo(x = [a, b = 2, ...c] = [1,,3,4,5,6,7]) {}',
    '`${[a = 5, b, ...c] = [, 1, 3, 5, 7, 9]}`;',
    'function f({}){}; f();',
    'function f({}){}; f(null);',
    '({a, b,...rest} = obj)',
    '({a, b,...rest} = {a, b,...rest} = obj)',
    'for ({a, b,...rest} = obj; i < 10; i++) {}',
    'for ({a, b,...rest} = {a, b,...rest} = obj; i < 10; i++) {}',
    'var a = {b, ...c, d, ...e};',
    'a += (b + c)',
    'a + (b += c)',
    'a -= b -= c',
    'a -= (b + c)',
    '({ }).x',
    'if (0) new a(b+c).d = 5',
    String.raw`function f() { if (0) obj.foo\u03bb;  }`,
    '({a:a}=1)()',
    'function f() { ([1 || 1].a = 1) }',
    '([1 || 1].a = 1)',
    '({a: 1 || 1}.a = 1)',
    '[((((vrh190 )))) = 5184] = []',
    'var a; `${[a] = [1]}`',
    '[((((vrh190 )))) = 5184] = []',
    'var [[...a], ...b] = [[],];',
    'let a; [[[...a]]] = [[[]]];',
    'const [a = 1] = [];',
    'let [[a]] = [[]];',
    'let a, b; [a = 1, b] = [];',
    'let a = [1], i = 0; [a[(() => 1 + i)()]] = [];',
    'let a, b; [a, b] = [1];',
    'function f() { if (0) new a(b+c).d = 5 }',
    'function f(){ ++a; ++a()[b]; }',
    'var obj = { a: { b: ext.b, c: ext["c"], d: { set v(val) { ext.d = val; } }.v } = { b: "b", c: "c", d: "d" } };',
    'var obj = [...[ ext.b, ext["c"], { set v(val) { ext.d = val; } }.v ] = ["b", "c", "d" ]  ];',
    outdent`
      ({
        obj: {
          x: result.a = 10,
          [computePropertyName("y")]: result.b = false,
        } = {}
      } = { obj: {
        get x() { return loadValue(".temp.obj.x", undefined); },
        set x(value) { assertUnreachable(); },
        get y() { return loadValue(".temp.obj.y", undefined); },
        set y(value) { assertUnreachable(); }
      }});
    `,
    '[ a = (initialized = true, initializer) ] = value',
    '[ obj.a = (initialized2 = true, initializer) ] = value',
    '[ x = "x" in {} ] = value',
    '[ a = x += 1, b = x *= 2 ] = value',
    'it = (function*() { result = [ x = yield ] = value; })();',
    'var x; [ [ x ] ] = [ null ];',
    'var x; [ [ x ] ] = [ ];',
    'var x; [ { x } ] = [ ];',
    'var x, value = [ { a: "zap", b: "blonk" } ];',
    '[...{ 1: x }] = value',
    '[...x] = it',
    '(it, { a: [...z] } = it)',
    '() => ({} = undefined)',
    '() => { [ [ c ] ]  = [ [ "string" ] ]; }',
    '() => { [ { c } ]  = [ { c: "string" } ]; }',
    '() => { ({ c } = { c: "string" }); }',
    '() => { ({ a: { c } } = { a: { c: "string" } }); }',
    '() => { ({ a: [ c ] } = { a: [ "string" ] }); }',
    '[a.x] = g()',
    'function f(){ "use strict"; a = 0; a()[b] = 0; }',
    'for (var {z} = { z : 3 }; z != 0; z--) {}',
    'var {[foo("abc")]:x} = {abc:42};',
    'var [a, b, c, ...rest] = f();',
    'function f2({c, d}, {a, b}) { return c - d + a - b; }',
    'function f3([{a, b}]) { return a - b; }',
    'function f5({a = x}) { function x() {}; return a; }',
    'function f92({a = () => { "use strict"; return eval("x") }}) { var x; return a(); }',
    'var g = ({a, b}) => { return a - b; };',
    'var g2 = ({c, d}, {a, b}) => { return c - d + a - b; };',
    "var { [f('x')]:x, [f('y')]:y } = o;",
    'var g2 = ({a = x}) => { function x() {}; return a; };',
    'var g61 = ({a = eval("x")}) => { var x; return a; };',
    'var f12 = function f({x = f}) { function f() {}; return x; }',
    'x({a: 4}, {b: 5})',
    'function f34({x = function() { return a }}, ...a) { return x()[0] }',
    'function f35({x = () => a}, ...a) { return x()[0] }',
    'a = [ x = "x" in {} ] = value;',
    'a = [ a = x += 1, b = x *= 2 ] = value',
    'a = [arguments = 4, eval = 5] = value;',
    'y = [ x = yield ] = value;',
    '[[ x ]] = [null];',
    '[[ x ]] = [ , ];',
    '[[ x ]] = [undefined];',
    'x = [[x[yield]]] = value;',
    '[[x[yield]]] = value;',
    'a = [[x[yield]]] = value;',
    '[[x[async]]] = value;',
    'a = [[x[async]]] = value;',
    'a = [[x[await]]] = value;',
    'a = [[x]] = value;',
    '[{ x = yield }] = [{}];',
    '[{ x = async }] = [{}];',
    'a = [{ x = yield }] = value;',
    'a = [x.y] = value;',
    '[ x ] = [];',
    'a = [arguments, eval] = value;',
    '[x, ...y] = [1, 2, 3];',
    'a = [, , x, , ...y] = value;',
    'a = [...x] = iter;',
    'a = [...[x, y]] = value;',
    'x = [...[x[yield]]] = value;',
    'a = [...{ 0: x, length }] = value;',
    'a = [...{ x = yield }] = value;',
    'a = [...{ 1: x }] = value;',
    '[ ...x ] = [];',
    'a = [...x.y] = value;',
    '[...x[yield]] = [];',
    'a = [,] = "string literal";',
    'a = { x, y } = value;',
    'value = { x: 4 };',
    'a = { x = flag = true } = value;',
    '({ x = y } = {});',
    'a = { a = x += 1, b = x *= 2 } = value;',
    'a = { eval = 3, arguments = 4 } = value;',
    'a = { x = yield } = value;',
    'a = { x = async } = value;',
    '0, { x = yield } = {};',
    ' ({ c } = { c: 1 });',
    '({ eval } = {});',
    ' ({ x: x = y } = {});',
    '0, { x: x[yield] } = {};',
    'a = { x: x[yield] } = value;',
    '({ [a.b]: x } = {});',
    "a = { ['x' + 'y']: x } = value;",
    '({ x: [ x ] } = { x: null });',
    '({ x: [ x ] } = { x: undefined });',
    '({ x: [ x ] } = {});',
    '0, { x: [x = yield] } = { x: [] };',
    'a = { x: [x = yield] } = value;',
    '({ x: { x } } = { x: null });',
    '({ x: { x } } = { x: undefined });',
    '({ x: { x } } = {});',
    '0, { x: { x = yield } } = { x: {} };',
    'a = { x: { y } } = value;',
    '({ a: x } = {});',
    'a = { a: x.y } = value;',
    'a = { xy: x.y } = value;',
    ' ({ x: y } = {});',
    'a = {} = true;',
    'var f = ([[x]] = [null]) => {};',
    'f = ([x = 23] = []) => {}',
    'f = ([cls = class {}, xCls = class X {}] = []) => {}',
    'f = ([fn = function () {}, xFn = function x() {}] = []) => {}',
    '[ _ = flag1 = true, _ = flag2 = true ]',
    '[ xCls = class x {},cls = class {} ]',
    '[ xCover = (0, function() {}), cover = (function() {}) ]',
    '[ xGen = function* x() {}, gen = function*() {} ]',
    '[ a = x += 1, b = x *= 2 ]',
    '[arguments = 4, eval = 5]',
    '[ x = yield ]',
    '[ x = async ]',
    '[ {}[ yield ] ]  ',
    '[ {}[x()] ]',
    '[[(x, y)]]',
    '[[ _ ]]',
    '[[ x ]]',
    '[[x[yield]]]',
    '[{ get x() {} }]',
    '[{ x }]',
    '[x.y]',
    '[4]',
    '[ x , , ]',
    '[ {}[x()] , ]',
    '[ x , ...y ]',
    '[ x , ...{}[yield] ]',
    '[...x, y]',
    '[...x,]',
    '[...x, ...y]',
    '[ , ...x]',
    '[, , x, , ...y]',
    '[...x = 1]',
    '[...{ 1: x }]',
    '[...x.y]',
    '{ xCls = class x {}, cls = class {} }',
    '{ xCover = (0, function() {}), cover = (function() {}) }',
    '{ xGen = function* x() {}, gen = function*() {} }',
    '{ a = x += 1, b = x *= 2 }',
    '{ eval = 3, arguments = 4 }',
    '0, [...x.y] = [23];',
    'a = [...x[yield]] = [33, 44, 55];',
    '0, {} = undefined;',
    'y = { w, x } = { x: 4 };',
    'var vals = { yield: 3 };',
    'a = { x = flag1 = true, y = flag2 = true } = vals;',
    "'use strict'; let x, y, z; for (x in x =  x = { arrow = () => {} } = z = {});",
    'var x, y, z; for (x in x = { arrow = () => {} }  = z = {});',
    'x = { y = function* x() {}, z = function*() {} } = {};',
    'a = { a: x, y } = { a: 3 };',
    'x = { a: x.y } = { a: 3 };',
    'a = { x: x = yield } = {};',
    'a = { "x": x = yield } = {};',
    'for ({ yield } in [{}]) ;',
    'for ({ yield } in [{}]) ;',
    'for ({ x: x = yield } in [{}]) ;',
    'for ([ arrow = () => {} ] of [[]]) {}',
    'for ([ xFn = function x() {}, fn = function() {} ] of [[]]) {}',
    'for ({ a: x.y } of [{ a: 23 }]) {}',
    'for ({ a: c } of [{ a: 2 }]) {}',
    'for ({ x: y } of [{}]) {}',
    'for ({} of [0]) {}',
    'for ({ x: { x = yield } } in [{ x: {} }]) ;',
    'for ([{ x }] of [[ , ]]) {}',
    'for ({ x } of [{ x: 1 }]) {}',
    'for ({ x: { x } } of [{ x: null }]) {}',
    'a = { x: x = flag1 = true, y: y = flag2 = true } = { y: 1 };',
    '[x = 23]',
    '[_, x]',
    'a = { w: { x, y, z } = { x: 4, y: 5, z: 6 } }',
    'y = { w: null }',
    'var f = ([x = (function() {})()]) => {};',
    'f = ([x = 23]) => {}',
    'var f = ([ x = y ]) => {};',
    'var f = ([x]) => {};',
    'f = ([{ x, y, z } = { x: 44, y: 55, z: 66 }]) => {}',
    'var f = ([{ x }]) => {};',
    'f = ([...[x, y, z]]) => {}',
    'var f = ([, ...x]) => {};',
    'var f = ([...x]) => {};',
    'var f = ({}) => {};',
    'var { x: [y], } = { x: [45] };',
    'var { w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] };',
    'var { x: y = 33 } = { };',
    'var { w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined };',
    ' var { w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: null };',
    'var { w: { x, y, z } = undefined } = { };',
    'var { w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: { x: undefined, z: 7 } };',
    'var f = ({ x = y() }) => {};',
    'f = ({ x, }) => {}',
    'f = ({ x: [y], }) => {}',
    'var f = ({ w: [x, y, z] = [4, 5, 6] }) => {};',
    'f({ s: null, u: 0, w: false, y: "" });',
    'f = ({ x: y = 33 }) => {}',
    'var f = ({ w: { x, y, z } = { x: 4, y: 5, z: 6 } }) => {};',
    'var f = ({ w: { x, y, z } = undefined }) => {};',
    'var C = class { static method([arrow = () => {}]) {}}',
    'f = function*([...x]) {}',
    'f = function*({ gen = function* () {}, xGen = function* x() {} }) {}',
    'var f = function*({ [y()]: x }) {};',
    'f = function*({ x: y = 33 }) {}',
    'var obj = { *method([[x, y, z] = [4, 5, 6]]) {}}',
    'class C { static *method([[x, y, z] = [4, 5, 6]]) {}}',
    'for (let [cls = class {}, xCls = class X {}] of [[]]) {}',
    'for (let { x = y } of [{}]) {}',
    'for (var [x] = []; Y < 1; ) {}',
    'f = async function*([arrow = () => {}]) {}',
    'f = async function*([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) {}',
    'f = async function*([cover = (function () {}), xCover = (0, function() {})]) {}',
    'f = async function*([fn = function () {}, xFn = function x() {}]) {}',
    'f = async function*([x]) {}',
    'f = async function*([x, y, z]) {}',
    'f = async function*([x] = []) {}',
    'f = async function*([{ x, y, z } = { x: 44, y: 55, z: 66 }] = []) {}',
    'f = async function*([{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]) {}',
    'f = async function*([{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] = [{ u: 777, w: 888, y: 999 }]) {}',
    'f = async function*({a, b, ...rest} = {x: 1, y: 2, a: 5, b: 3}) {}',
    'f = async function* g([x]) {}',
    'f = async function* g([x, y, z]) {}',
    'f = async function* g([[x, y, z] = [4, 5, 6]]) {}',
    'f = async function* g([[x, y, z] = [4, 5, 6]]) {}',
    'f = async function* g([[...x] = [2, 1, 3]]) {}',
    'f = async function* g([fn = function () {}, xFn = function x() {}]) {}',
    'f = async function* g([_, x]) {}',
    'f = async function* g([{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }]) {}',
    'f = async function* g([, , ...x]) {}',
    '[(x) = y] = z',
    '[(x) = y]',
    'f = async function* g([[] = function() { initCount += 1; }()] = [[23]]) {}',
    'var C = class { static async *method({ w: [x, y, z] = [4, 5, 6] }) {}}',
    'class C { async *method([x, y, z] = [1, 2, 3]) {}}',
    'var o = Object.create({ x: 1, y: 2 });',
    'o.z = 3;',
    'let {[a]: b, ...rest} = { foo: 2, bar: 3};',
    '({[a]:b, ...rest})',
    'a = {...b.c} = d;',
    'for ({[a]:b, ...rest} of [{ foo: 1, bar: 2, baz: 3 }]) {}',
    'C.method({x: 1, y: 2, a: 5, b: 3}).next().then(() => {})',
    'f = async function*([arrow = () => {}]) {}',
    'class foo { method() { ({x:super.x} = {}); } }',
    "class foo { method() { ({x:super['x']} = {}); } }",
  ]) {
    it(`  ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
    it(`  ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, lexical: true });
      });
    });

    it(`  ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, webcompat: true });
      });
    });
  }
});
