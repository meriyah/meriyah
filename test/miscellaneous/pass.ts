import { Context } from '../../src/common';
import * as t from 'assert';
import { parseSource } from '../../src/parser';

// DO NOT REMOVE OR MODIFY THIS TESTS!!!

describe('Miscellaneous - Pass', () => {
  for (const arg of [
    `({} + 1);`,
    `async ({} + 1);`,
    `[({a: 1}.c)] = [];`,
    'do ; while(0) i++',
    'do if (a) x; else y; while(z)',
    `({}.length);`,
    'switch (((("Mr" || (``).rlv ? ("^") : ((([`` / (() => 0)])))())))) {}',
    'function f() { ((((a))((b)()).l))() }',
    'function f() { (a)[b + (c) / (d())].l-- }',
    "function f() { new (f + 5)(6, (g)() - 'l'() - true(false)) }",
    'function f() { function f() {} }',
    'function f(a,b) {}',
    `class x extends {} {}`,
    `for (;;);`,
    `for (a+b;;) c;`,
    `for (var x of y);`,
    `for (var x;;);`,
    `for (;;);`,
    `for (x in y);`,
    `for (x of y);`,
    'for (var x of y);',
    `for (var x;;);`,
    `for (let x of y);`,
    `for (let x;;);`,
    `for (let x of y);`,
    `for (let x of y);`,
    `for (let [x] in y);`,
    `for (let {x} of y);`,
    `for (let x of y);`,
    `for (let {x} = x;;);`,
    `for (let [x] = x;;);`,
    `for (let x;;);`,
    `for (let {x} of y);`,
    `for (let [x] in y);`,
    `for (let in x);`,
    `for (let in x) {}`,
    `for (let x of y);`,
    `for (let[x] in y);`,
    `for (let[x] of y);`,
    `for (let , x;;);`,
    `for (let + x;;);`,
    `for (let.x;;);`,
    `for (let.foo in x);`,
    `for (let();;);`,
    `for (let().foo in x);`,
    `for (let=10;;);`,
    `for (let.foo;;);`,
    `for (let;;);`,
    `for (const x of y);`,
    `for (let.x in y);`,
    `(a,) => {}`,
    `(a,b,) => {}`,
    `(a = b,) => {}`,
    '++/b/.c',
    '--/b/.c',
    'var [x] = v;',
    'var {x} = v;',
    'for (let().x in y);',
    `([x],) => {}`,
    `({a},) => {}`,
    `({"x": [y].slice(0)})`,
    `[...{a: b.b}.d] = c`,
    `[...{a: b}.c] = []`,
    'a\rb',
    'a\nb',
    `(x = delete ((yield) = f)) => {}`,
    `[...[{a: b}.c]] = [];`,
    `[...[{prop: 1}.prop]] = []`,
    '(x=(await)=y)',
    'async function f(){    function g(x=(await)=y){}   }',
    'function f(x=(await)=y){}',
    '(x=(await)=y)=>z',
    `([x] = y,) => {}`,
    `({a} = b,) => {}`,
    `foo({c=3} = {})`,
    `async({c=3} = {})`,
    `yield({c=3} = {})`,
    `log({foo: [bar]} = obj);`,
    `({a:(b) = c} = 1)`,
    `for ({x} = z;;);`,
    `({...[].x} = x);`,
    `result = [...{ x = await }] = y;`,
    `async r => result = [...{ x = await x }] = y;`,
    `result = [...{ x = yield }] = y;`,
    `function* g() {   [...{ x = yield }] = y   }`,
    `([{x = y}] = z)`,
    `[{x = y}] = z`,
    `new await()()`,
    '`a${b=c}d`',
    '`a${await foo}d`',
    `(x) = (y) += z`,
    `(x) = (y) = z`,
    `(x) += (y) = z`,
    `(foo.x)`,
    `(foo[x])`,
    `(foo) += 3`,
    `(x = delete ((await) = f)) => {}`,
    'const [a] = b;',
    'a = { ["foo"]: n / 1 }',
    `[(a)] = x`,
    `[(a) = x] = x`,
    `[a, {[b]:d}, c] = obj`,
    `[(a)] = x`,
    `[...{}]`,
    `({a:(b) = c} = 1)`,
    `for (a=>b;;);`,
    `async x => delete (((((foo(await x)))))).bar`,
    `a.b = x`,
    `a = x`,
    `a = b = x`,
    `x = x + yield`,
    'log(eval)',
    'eval',
    'eval.foo',
    'eval[foo]',
    'eval.foo = bar',
    'eval[foo] = bar',
    '++x ? b : c',
    'let x = () => ++a;',
    'if (++a);',
    'this.x++',
    'let x = () => a--;',
    'if (a--);',
    '(this.x--)',
    'a\n++b',
    '++(x);',
    '++(((x)));',
    '++\na',
    'if (++\na);',
    '++x + y',
    '++this.x',
    '(++this.x)',
    '++x ? b : c',
    'let x = () => --a;',
    'if (--a);',
    'if (a) --a;',
    '--(((x)));',
    'if (--\na);',
    '--\n(x);',
    '--this.x',
    '(--this.x)',
    'let x = () => a++;',
    '(((x)))++;',
    'while ({"a": 2e308.b = function* u() {}} = 8381.11);',
    'function a () { new.target, (new.target); }',
    '(delete new function f(){} + function(a,b){}(5)(6))',
    'function f() { [] in [5,6] * [,5,] / [,,5,,] || [a,] && new [,b] % [,,] }',
    '1 + {get get(){}, set set(a){}, get1:4, set1:get-set, }',
    'function f() { 1 + {get get(){}, set set(a){}, get1:4, set1:get-set, } }',
    'function f() { (4,(5,a(3,4))),f[4,a-6] }',
    '{ a[5],6; {} ++b-new (-5)() } c().l++',
    'function f() { { a[5],6; {} ++b-new (-5)() } c().l++ }',
    '({} = (--x), of, a) => (a)',
    'for (; ([ypcrjcqd, bw, bxdcnmy = satlphhplourwfs], [{j, [(((t)))]: g = "N	¯Sú", c, o} = class u extends `1Víy` {}], bgtqklnssucfqsm, ka) => `p¢Ó­${([, ] ** delete 2e308.static ++), arguments}`;) hnjtmujeg: for (ikdgsltnabvjnk of false) var y = /([])*?|K\x78B\b/gu',
    '({"d": [] & (null) });',
    `( of => {})`,
    `of => {}`,
    `for ({"a": ((~2e308)).eq = ((((t)[2e308] = (4.940161093774018e132[(null)] --)))), kdfkqmskrvjte, [(function* (nrxyvtaethhssc) {
    })]: fcxveed} of (2969)) debugger;`,
    `let [weli, [...[]], [, , ...[]], , {a}, ...[]] = (eval), kqwys = ((((((-2e308)))).if)(...((this)), ...((r)), ((of => {
    }))));`,
    'const a = (((({})))`æhq` / (b))',
    '(t[(((2e308)))] in /[-�-]/gi)',
    `const ugqbnmejypjehf = this;
    function ayovbngutpnhsdko(bgpprfjxtwuxp, duppwvgsavsr, pxvd, orkgviwaske, igaaskiqfje) {
      "use strict";
      for (; null;) switch (new.target) {
        case false:
          /(?=9*?)/y;
        case new.target:
          debugger;
          try {} finally {}
          for (arguments.t in l = true) return;
          throw () => {
            "94";
          };
      }
      switch (++ecvhomri) {
        case eyruiqi ++:
          {
            break;
          }
          for ([] in s *= {}) try {} catch (m) {}
          for ((() => {}).void of 2e308) for (let b = 2e308; 2e308; () => m ^= this) try {} catch (f) {}
        case new.target:
          while (class {
            [new.target]() {}
            static get [new.target]() {
              "use strict";
            }
            static set [/(?=(?:()))/imu] (t = /(?:)/giuy) {}
          }) try {} catch (b) {}
          debugger;
          ;
          debugger;
        case ywdvm:
          do while (2e308.s) if (false) return; else break; while ([, ]);
          return true;
          do if (new.target) break
     while ([](o));
          switch (class {}) {
            case null[null]:
              debugger;
              var i = this;
            default:
              true;
              {}
          }
        default:
          class jnhwtndcw extends null[-3.9701885463648657e220] {}
        case (y = new.target)["i=É"] ^= "ø"()[(y, x, p, h) => {
          "l";
          "use strict";
          "váHOb";
          "use strict";
        }]:
          debugger;
          for (; -function f() {}; ([], v = null, v, []) => jdiri) "4";
      }
      try {
        for (const s of null ^ eval) debugger;
        delete new true;
        if (class extends null {
          static get [/^/imuy]() {}
          static [""]() {
            "use strict";
          }
          static set [2e308] (j) {
            "use strict";
          }
          get [new.target]() {}
          set [null] (w = null) {}
        }) switch (6782) {
          case arguments:
        }
      } finally {
        function* gmmcwctn([] = new.target, {ITå: d, h6ñæ: y}, dhpn, t = r = /(\B;\u8ACf\u0361)/imy, {[/(?![^*-+-])/iu]: m}, ...qqalnmcwo) {
          let m = arguments;
          while (this()) new.target
        }
        oqnoy: if (true) debugger; else arguments: while (false) continue arguments
        uqpvlflscdnwq: for (const x in "") try {} catch (l) {}
        ;
      }
      if ("G") throw riwwucphdoifbmw ++
     else ;
      do culcdyrlivoi: for (let u in new (true())(2e308, "¹Ö" != false, ...new.target, new this, [])) try {} finally {} while ([...[] = /[-]/u, ...[, null, f = g, , ], , um]);
    }
    `,
    //'for (((((false))["ë®Ú"] **= eval[null]) && null)[((2e308))(((((x = `7í`)))) ? 2e308 : 2e308() ? eval in null : ([]), ...null, ...t[(((2e308)))] in /[-\uDcCa-]/gi)] of 2e308) try {} finally {;}',
    '({} = (x), of, a) => (a)',
    `(class {
      [null](t, a) {
        "use strict";
        "ÉPJÜ";
        "íÖtãR";
        "J";
        "use strict";
      }
      static *ñÕD(j, p, a, c, y) {
        "use strict";
      }
      set [(a)()] (ubv) {
        "C1>";
        ".º7«_";
        "use strict";
        for (var n in null) continue;
        if (2603) return; else ;
        switch ("Ê÷") {}
        for (m of "") ;
        debugger;
      }
    })`,
    'throw (b = function* eo() { yield; }, [a]) => 2e308',
    '( of => {})',
    '(eval), kqwys = ((((((-2e308)))).if)(...((this)), ...((r)), (( of => {}))));',
    '{ l1: l2: l3: { this } a = 32 ; { i++ ; { { { } } ++i } } }',
    'function f() { { l1: l2: l3: { this } a = 32 ; { i++ ; { { { } } ++i } } } }',
    'x: s: if (a) ; else b',
    'for (;; (k = x)) throw (null)',
    'function f() { if (a) if (b) y; else {} else ; }',
    'do if (a) with (b) continue; else debugger; while (false)',
    'function f() { if (a) function f() {} else function g() {} }',
    'throw a',
    'while (0) var a, b, c=6, d, e, f=5*6, g=f*h, h',
    '({a: 1 || 1}.a = 1)',
    'if (0) foo$; ',
    'function a({ [(b)]: {} = new.target}, c) {}',
    'function* shcpfmvhkavl({"a": {} = (new (((new.target)))), odxxoxrrv = a, [(this)]: {} = new.target}, miwkeaa) {}',
    '(((2e308)).i)',
    `[function* (...{}) {  switch (yield) {}  }]
    a = (u) => {}`,
    'for (;; ({} = (--x), of, ...nsujmqrnwd) => (a)) {}',
    'throw ((arguments))',
    '(class extends a { constructor() {}  *i() {}  })',
    '(class extends a { constructor() {}  *[i]() {}  })',
    'if (new (2e308)) try {} finally {} else do debugger; while (((6.98114699124408e222)));',
    `function f() {
      do do if ((new.target) & (/([]+|[^]|\Y^||[]*)/gy)) {} else return; while (((new 2e308(...new.target, ...null, ...new.target, ...((2e308)), ...null)))); while (ickwccysjjyv = 0);
    }`,
    `try {
      for (const i of r &= true) ((true))
    } catch ([h = e]) {
      true
      if ((2e308)) debugger;
      for (;;) break
      for (;;) debugger;
    }
    if (as ++) {
      function* p(j, x, c) {
        "use strict"
      }
    } else try {
      if (this) ;
    } catch (g) {} finally {
      switch (true) {}
      try {} catch (g) {}
      switch (this) {}
      try {} catch (n) {}
    }`,
    '[function* (...{}) {  switch (yield) {}  }] ',
    'for (let q in ((((...{}) => eval)))) try {} catch (r) {}',
    'do for (var x;; (((e = (true))))) {} while (({}));',
    `(class t extends ((/[=Z-\uE5Bd*-\[$-)(-]/gmu)) {
      set [(false)] (d) {
        "use strict";
      }
      static get [(true)]() {}
      static set [null] (h) {}
      static [(eval)]() {}
      constructor() {
        "use strict";
      }
    })`,
    'for (o of ((946090429347418))[("")]) try {} finally {}',
    `  class khoqm {
      set [0] ({}) {
        "îV@"
        "Ã";
        "9M¤í"
        "!^Æ"
        "i».";
      }
      static get [1694.31]() {
        "¶"
        "]"
        "ïp"
        "use strict"
      }
      static get [((/[?-\uD357)]/giy))]() {
        "use strict"
        "use strict"
      }
      static *"tè® "() {
        "use strict"
      }
      static set [(2e308)] (v) {
        "»ÕÊÓ";
        "use strict";
      }
    }`,
    `if (0xE201433785892) eval: for (;;) try {
      arguments: debugger;
      debugger;
      while ((("I@"))) debugger;
      do break eval; while (true);
    } catch (a) {}`,
    '(`Î${(aewdwm, [, ...{}] = {s}, bsm, e) => new (/(?:)/guy === [`template`, , u /= false, ...""])(new (y = 0).await(...() => 1199), ...eval, ....94, ...{eval})}`)',
    '{(this / s)}',
    '[{y} = /a/ ]',
    '[(((((/[^(-\x8F/$!-[(]/my).n = class {}))))]',
    'while ((p /= ({}))) for (let q in (`õP`)) while (((2e308))) break;',
    `for (;;) if (class {}) switch (0xB1F7CA471C3A8) {
      case /(?=)?/iu:
      default:
      case /[(-o[-\uA9cb-]/my:
      case 2e308:
      case "'J":
    } else new /[-\x7d#-.?-]+/g;`,
    'false ? null : (eval)',
    '"use strict"; false ? null : (eval)',
    '"use strict"; false ? null : (eval)',
    '(this / s)',
    'function a({ [(b)]: {} = new.target}, c) {}',
    `function* a(b, c, d) {
      try {
      } finally {}
      throw {a, [(yield)]: j, [0x1B7E316905B86C]: u = ((false)), s, [(new.target)]: i} = (([, , , , ]))
    }
    typeof (a >= ((h, k = (+("string")), b) => (null)));
    `,
    `function* yx(snjbfaalocyob) {
      switch (((-((class {}))))) {
            case (yield* /\,+?/iy):
          }
      }`,
    'class cteuognrbclmu extends (([, /(?=(?!))/gi, [], , ])) {}',
    `throw 1344;
    /[^{?c\x60-|5-8]?/gimu;`,
    "function f() { 'use strict'; function __proto__(){} }",
    'function f() { switch (l) { case 1: a: with(g) switch (g) { case 2: default: } default: } }',
    'switch (l) { case 1: a: with(g) switch (g) { case 2: default: } default: }',
    'function f() { switch (sw) { case a ? b - 7[1] ? [c,,] : d = 6 : { } : } }',
    'switch (l) { case a = b ? c : d : }',
    'switch (g() - h[5].l) { case 1 + 6: a: b: c: ++f }',
    "function f() { switch (f()) { case 5 * f(): default: case '6' - 9: ++i } }",
    "switch (f()) { case 5 * f(): default: case '6' - 9: ++i }",
    'function f() { for (a in b) break }',
    'function f() { for (var a = b, b = a ; ; ) break }',
    'function f() { for (var a, b ; ; ) { break }  }',
    'function f() { for ( ; a ; a ) break }',
    'function f() { for ( a ; a ; ) break }',
    'for ( ; ; a ) { break }',
    'function f() { for ( ; ; a ) { break } }',
    'function f() { for ( a ; ; ) { break } }',
    'for ( ; ; ) { break }',
    'for (a,b in c ;;) break',
    '{ { do do do ; while(0) while(0) while(0) } }',
    '{ a[5],6; {} ++b-new (-5)() } c().l++',
    'function f() { { a[5],6; {} ++b-new (-5)() } c().l++ }',
    '{ l1: l2: l3: { this } a = 32 ; { i++ ; { { { } } ++i } } }',
    'function f() { { l1: l2: l3: { this } a = 32 ; { i++ ; { { { } } ++i } } } }',
    'function f() { a: { ; } }',
    '{ ; ; ; }',
    'throw a + b in void c',
    'function f() { (4,(5,a(3,4))),f[4,a-6] }',
    '(4,(5,a(3,4))),f[4,a-6]',
    'a: +~!new a',
    '(a)++',
    'a[2] += 7;',
    'a[2] = 15;',
    'a[2] += 2;',
    'z += 4;',
    'foo(17, a[2]);',
    'function test_assign(x, y) { if (x = y) return x; }',
    'delete void 0',
    'obj = Object.defineProperty(new ConstrG3(), "getterProperty", { get: getter3 });',
    'if (accessorCallCount == 4) { 123 in null; }',
    'foo("0,1,2,3", forInNames.join());',
    'a(5,)',
    '1 + {get get(){}, set set(a){}, get1:4, set1:get-set, }',
    'function f() { 1 + {get get(){}, set set(a){}, get1:4, set1:get-set, } }',
    'function f() { [] in [5,6] * [,5,] / [,,5,,] || [a,] && new [,b] % [,,] }',
    'function f() { (delete new function f(){} + function(a,b){}(5)(6)) }',
    '(delete new function f(){} + function(a,b){}(5)(6))',
    'function f() { function f() {} + function g() {} }',
    'function g(arguments, eval) {}',
    'function f() { function f(a,b) {} }',
    'function f() { for (of of y) { } }',
    'function f() { for (let of of y) { } }',
    'function f() { for (var of of y) { } }',
    'function f() { ((((a))((b)()).l))() }',
    'function f() { a(b[7], c <d> e.l, new a() > b) }',
    'function f() { s: eval(a.apply(), b.call(c[5] - f[7])) }',
    'a: b: c[a /= f[a %= b]].l[c[x] = 7] -= a ? b <<= f : g',
    'function f() { a: b: c[a /= f[a %= b]].l[c[x] = 7] -= a ? b <<= f : g }',
    "-void+x['y'].l == x.l != 5 - f[7]",
    'function f() { a in b instanceof delete -c }',
    "function f() { s: a[1].l ? b.l['s'] ? c++ : d : true }",
    'a = b ? b = c : d = e',
    'a + + typeof this',
    'function f() { function f(a,) {} }',
    '((((a))((b)()).l))()',
    'for (var a in b in c) break',
    'for (var a = (b in c) in d) break',
    'try {} catch {}',
    '(a = []) => {}',
    '({...{}})',
    'async () => { let b = async () => []; for (a in await b()); }',
    'if (a) try {} finally {} else b;',
    "switch (f()) { case 5 * f(): default: case '6' - 9: ++i }",
    'switch (l) { case a = b ? c : d : }',
    'switch (sw) { case a ? b - 7[1] ? [c,,] : d = 6 : { } : }',
    'function __proto__(){}',
    '(function __proto__(){})',
    "'use strict'; function __proto__(){}",
    "'use strict'; (function __proto__(){})",
    '(({x = {} = {}}) => {})({});',
    'let a0 = ({x = {} = {}}) => {};',
    'for (const var1 in {a: 6}) { function foo() { var1 = 0; } }',
    'for ([var1, var2] of [[1, 1], [2, 2]]) { }',
    'if (0) $foo; ',
    'if (0) _foo; ',
    'if (0) foo$; ',
    'if (0) foo_; ',
    'if (0) obj.$foo; ',
    'if (0) obj._foo; ',
    'if (0) obj.foo$; ',
    'if (0) obj.foo_; ',
    'if (0) obj.foo\\u03bb; ',
    '({...{b: 0}.x} = {});',
    '({...[0].x} = {});',
    'if (0) new a(b+c).d = 5',
    '([1 || 1].a = 1)',
    '({a: 1 || 1}.a = 1)',
    'for (a in b) break',
    'for (a().l[4] in b) break',
    'var a = a in b in c instanceof d',
    'const a = 7; with({}) a+=1',
    'const a = 7; eval(""); a-=1',
    'const a = 7; with({}) a++',
    'var a, b = null',
    'if (a) var a,b; else { const b = 1, c = 2; }',
    'var varr = 3 in 1',
    'while (1) break',
    'do if (a) with (b) continue; else debugger; while (false)',
    '{ { do do do ; while(0) while(0) while(0) } }',
    'do while (0) if (a) {} else y; while(0)',
    'while (a() - new b) ;',
    '{} f; { 6 + f() }',
    '{ a[5],6; {} ++b-new (-5)() } c().l++',
    '{ l1: l2: l3: { this } a = 32 ; { i++ ; { { { } } ++i } } }',
    'if (a) ;',
    '1 + {get get(){}, set set(a){}, get1:4, set1:get-set, }',
    '(4,(5,a(3,4))),f[4,a-6]',
    'function g(arguments, eval) {}',
    'function f() {} + function g() {}',
    'a()()()',
    's: eval(a.apply(), b.call(c[5] - f[7]))',
    'a: b: c[a /= f[a %= b]].l[c[x] = 7] -= a ? b <<= f : g',
    "-void+x['y'].l == x.l != 5 - f[7]",
    'a = b ? b = c : d = e',
    "s: a[1].l ? b.l['s'] ? c++ : d : true",
    'a ? b + 1 ? c + 3 * d.l : d[5][6] : e',
    'a in b instanceof delete -c',
    'new (-1)',
    '(a)++',
    '({a:b,...obj}) => {}',
    '({a,...obj}) => {}',
    '({...obj} = {}) => {}',
    '({a:b,...obj} = foo)',
    '(x) = 1;',
    '((b), a=1)',
    '(1 + 2 ) * 3',
    'foo = ("foo");',
    'let foo = (async bar => bar);',
    'var h = tempFun `${ (x => x) } ${ (((x => x))) } ${ undefined }`',
    'var c = (myRandBool ? "foo" : ("foo"));',
    '(x = 23)',
    'x = [, , 42]',
    'for ((foo = []).bar in {}) {}',
    '(function parenthesized() { var b; })()\n',
    '!function exclaimed() { var c; }() \n',
    'function normal2() { var d; }\n',
    '(function parenthesized2() { var e; })()\n',
    'function normal3() { var f; }\n',
    '!function exclaimed2() { var g; }() \n',
    'function normal4() { var h; }\n',
    'function f() {}',
    'function f(a,b) {}',
    "var g21 = ({[eval('y')]: x}) => { var y = 'b'; return x; };",
    'var {x} = {}, {y} = {};',
    '/p/;',
    'new (class {})();',
    `// Valid
    class A { foo() {} foo() {} }
    class B { get foo() {} get foo() {} }
    class C { set foo(x) {} set foo(x) {} }
    class D { get foo() {} set foo(x) {} }
    class E { static foo() {} static foo() {} }
    class F { static get foo() {} static get foo() {} }
    class G { static set foo(x) {} static set foo(x) {} }
    class H { static get foo() {} static set foo(x) {} }
    class I { foo() {} get foo() {} set foo(x) {}}
    class J { static get foo() {} static set foo(x) {} get foo() {} set foo(x) {} }
    class K { static foo() {} static get foo() {} static set foo(x) {}}
    class L { static foo() {} foo() {} }
    class M { static foo() {} get foo() {} set foo(x) {}}
    class N { foo() {} static get foo() {} static set foo(x) {}}`,
    `{;}
    a();
    {};
    {
        {};
    };
    b();
    {}`,
    'for (var {a, b} in c);',
    'a(() => {})',
    'function a({b} = {b: 1}) {}',
    `'use strict';
    var a = {
        '0': 'b'
    };`,
    `let a = (x => (x, x * 2), 3);
  let b = ((x, y) => (x, x * y), 1);
  let c = (x => x * x)(2);
  let d = (1, 2, 3);`,
    `{
        const x = i;
        temp_x = x;
        first = 1;
        undefined;
        outer: for (;;) {
          const x = temp_x;
          {{ if (first == 1) {
               first = 0;
             } else {
               next;
             }
             flag = 1;
             if (!cond) break;
          }}
          labels: for (; flag == 1; flag = 0, temp_x = x) {
            body
          }
          {{ if (flag == 1)  // Body used break.
               break;
          }}
        }
      }`,

    'دیوانه , دیوانه = 123;',
    'class دیوانه { /* icefapper */ }',
    `class 𢭃 { /* 𢭃 */ }`,
    'var \\u0052oo = 0;',
    'var \\u{0052}oo = 0;',
    'var \\u{52}oo = 0;',
    'var \\u{00000000052}oo = 0;',
    'var foob\\uc481r = 0;',
    'var foob\\u{c481}r = 0;',
    '"foob\\uc481r"',
    '"foob\\{uc481}r"',
    '"foo\\u{10e6d}"',
    '"\\u{10ffff}"',
    `"T\\u203F = []"`,
    '"T\\u200C";',
    '"\\u2163\\u2161"',
    'var isHtml = /.html$/;',
    '"\\u2163\\u2161\\u200A; \\u2009"',
    'var source = "\\u{00000000034}";',
    '"\\u{20BB7}\\u{91CE}\\u{5BB6}"',
    'class C { constructor() { this._x = 45; } get foo() { return this._x;} } class D extends C { x(y = () => super.foo) { return y(); } }',
    'class C { constructor() { this._x = 45; } get foo() { return this._x;} } class D extends C { x(y = () => {return super.foo}) { return y(); } }',
    'class C { constructor() { this._x = 45; } get foo() { return this._x;} } class D extends C { x(y = () => {return () => super.foo}) { return y()(); } }',
    'class C { constructor() { this._x = 45; } get foo() { return this._x;} } class D extends C { constructor(x = () => super.foo) { super(); this._x_f = x; } x() { return this._x_f(); } }',
    'var f = cond ? x=>{x.foo } : x=>x + x + x + x + x + x + (x =>x) ',
    'var f = cond ? x=>x*2 : x=>2',
    'var f = cond ? x=>x : x=>2',
    'var f = cond ? ()=>20 : ()=>20',
    'foo(({x = 30}, [y], z) => x)',
    "s: a[1].l ? b.l['s'] ? c++ : d : true",
    'a ? b + 1 ? c + 3 * d.l : d[5][6] : e',
    'a in b instanceof delete -c',
    '- - true % 5',
    'a(b[7], c <d> e.l, new a() > b)',
    '~new new a(1)(i++)(c[l])',
    'a[2] = b.l += c /= 4 * 7 ^ !6',
    'a: b: c[a /= f[a %= b]].l[c[x] = 7] -= a ? b <<= f : g',
    "new (f + 5)(6, (g)() - 'l'() - true(false))",
    'function g(arguments, eval) {}',
    'function f() {} + function g() {}',
    '(delete new function f(){} + function(a,b){}(5)(6))',
    '6 - function (m) { function g() {} }',
    "const a = 7; eval(''); a=1",
    'const a = 7; with({}) a=1',
    'const a = 7; with({}) a=1',
    'for ( ; ; ) { break }',
    'for ( a ; ; ) { break }',
    'for ( ; a ; ) { break }',
    'for ( ; ; a ) { break }',
    'for ( a ; a ; ) break',
    'for ( a ; ; a ) break',
    'for ( ; a ; a ) break',
    'for (var a, b ; ; ) { break } ',
    'for (var a = b, b = a ; ; ) break',
    'for (var a = b, c, d, b = a ; x in b ; ) { break }',
    'for (var a = b, c, d ; ; 1 in a()) break',
    'for (var a in b in c) break',
    'for (var a = foo("should be hit") in b) break',
    'for (const x = 20; ; ) break',
    'for (const x of []) break',
    'for (const x in {}) break',
    'for (const x = 20; ; ) { const x = 20; break; }',
    'for (const x of []) { const x = 20; break; }',
    'for (const x in {}) { const x = 20; break; }',
    'for (a,(b in c) ;;) break',
    'function x(i) { for (let i in {}) { } }',
    'function x(i) { for (let i of []) { } }',
    'function x(i) { for (let i; false; ) { } }',
    'let f = (i) => { for (let i in {}) { } }',
    'let f = (i) => { for (let i of []) { } }',
    'let f = (i) => { for (let i of []) { } }',
    'let f = (i) => { for (let i; false; ) { } }',
    'function* x(i) { for (let i in {}) { } }',
    'function* x(i) { for (let i of []) { } }',
    'function* x(i) { for (let i of []) { } }',
    'function* x(i) { for (let i; false; ) { } }',
    'function x(i) { for (const i in {}) { } }',
    'function x(i) { for (const i of []) { } }',
    'function x(i) { for (const i of []) { } }',
    'function x(i) { for (const i = 20; false; ) { } }',
    'let f = (i) => { for (const i in {}) { } }',
    'let f = (i) => { for (const i of []) { } }',
    'let f = (i) => { for (const i of []) { } }',
    'let f = (i) => { for (const i = 20; false; ) { } }',
    'function* x(i) { for (const i in {}) { } }',
    'function* x(i) { for (const i of []) { } }',
    'function* x(i) { for (const i of []) { } }',
    'function* x(i) { for (const i = 20; false; ) { } }',
    'switch (f()) { case 5 * f(): default: case "6" - 9: ++i }',
    'try {} catch {}',
    'if (a) try {} finally {} else b;',
    ' let foo; if (true) function foo() { };',
    '{ if (true) function foo() { }; } let foo;',
    'function baz() { let foo; if (true) function foo() { }; }',
    'function bar() { label: label2: label3: function baz() { } }',
    'yield: function foo() { }',
    'yield: let: function foo() { }',
    'var str = "\'use strict\'; function f1(a) { function f2(b) { return b; } return f2(a); } return f1(arguments[0]);"; var foo = new Function(str); foo(5);',
    'var str = "\'use strict\'; function f1(a) { if (a) { function f2(b) { return b; } return f2(a); } else return a; } return f1(arguments[0]);"; var foo = new Function(str); foo(5);',
    'function foo() { switch("foo") { case 1: function foo() {}; break; case 2: function foo() {}; break; case 3: { let foo; } } }',
    '"use strict"; function f1(a) { function f2(b) { return b; } return f2(a); } f1(5);',
    '"use strict"; function f1(a) { function f2(b) { function f3(c) { return c; } return f3(b); } return f2(a); } f1(5);',
    '"use strict"; function f1(a) { if (a) { function f2(b) { return b; } return f2(a); } else return a; } f1(5);',
    '"use strict"; function f1(a) { function f2(b) { if (b) { function f3(c) { return c; } return f3(b); } else return b; } return f2(a); } f1(5);',
    '"use strict"; function f1(a) {}; function f1(a) {};',
    'if (0) $foo; ',
    'if (0) _foo; ',
    'if (0) foo$; ',
    'if (0) foo_; ',
    'if (0) obj.$foo; ',
    'if (0) obj._foo; ',
    'if (0) obj.foo$; ',
    'if (0) obj.foo_; ',
    'if (0) obj.foo\\u03bb; ',
    'if (0) new a(b+c).d = 5',
    '([1 || 1].a = 1)',
    '({a: 1 || 1}.a = 1)',
    'for (of of of){}',
    'for (of; of; of){}',
    'for (var of of of){}',
    'for (var of; of; of){}',
    'for (of.of of of){}',
    'for (of[of] of of){}',
    'for (var [of] of of){}',
    'for (var {of} of of){}',
    'for (of in of){}',
    'for (var of in of){}',
    'for (var [of] in of){}',
    'for (var {of} in of){}',
    'for ([of] in of){}',
    'for ({of} in of){}',
    'foo(a,...bar)',
    'o.foo(a,...bar)',
    'o[foo](a,...bar)',
    'foo(...bar, a)',
    'o.foo(...bar, a)',
    'o[foo](...bar, a)',
    '[...bar]',
    '[a, ...bar]',
    '[...bar, a]',
    '[...bar,,,,]',
    '[,,,,...bar]',
    '({1: x})',
    '({1: x}=1)',
    '({1: x}=null)',
    '({1: x})',
    '({1: x}=1)',
    '({1: x}=null)',
    '({a: b}=null)',
    '"use strict"; ({1: x})',
    '"use strict"; ({1: x}=1)',
    '"use strict"; ({1: x}=null)',
    '"use strict"; ({a: b}=null)',
    'var {1:x}=1',
    'var {x}=1',
    'var {x, y}=1',
    'var [x]=1',
    'var [x, y]=1',
    '[x]=1',
    'var [x]=1',
    '({[x]: 1})',
    'delete ({a}=1)',
    'delete ({a:a}=1)',
    'let var1; var1 = 5; function f() { var1; }',
    'let var1; function f() { var1 = 5; }',
    'const var1 = 5; function f() { var1; }',
    'let var1 = function f1() { let var2; };',
    'const var1 = function() { let var2; };',
    'if (true) { var var1; var var1; }',
    'var var1; if (true) { var var1; }',
    'var var1; var var1; var1 = 5;',
    'var var1; var var1;',
    'var var1; var var1; function f() { var1; }',
    'var var1; var var1; function f() { var1 = 5; }',
    'var var1; if (true) { var var1; }',
    'var var1; if (true) { let var1; }',
    'let var1; if (true) { let var1; }',
    'var var1; if (true) { const var1 = 0; }',
    'const var1 = 0; if (true) { const var1 = 0; }',
    'if (true) { if (true) { function f() { var var1 = 5; } } }',
    'if (true) { arguments = 5; }',
    'var1, var2, var3',
    'if (true) { this; }',
    'if (true) { var arguments; arguments = 5; }',
    '({a}=1)()',
    '({a:a}=1)()',
    '({get x(){}})',
    '({set x(x){}})',
    'class Foo { set v(z) { } }',
    'class Foo { set v(z) { "use strict"; } }',
    'function f(a, b = 20) {}',
    'function f(a = 20, b = a) {}',
    'function f({a = 20} = {a: 40}, b = a) {}',
    'function f([a,b,c] = [1,2,3]) {}',
    'var [...x] = 20;',
    'var [...[...x]] = 20;',
    'var [...[...{x}]] = 20;',
    'var [...[x = 20, ...y]] = 20;',
    'var [...[{x} = 20, ...y]] = 20;',
    'var {x: [y, ...[...[...{z: [...z]}]]]} = 20',
    'var {x: [y, {z: {z: [...z]}}]} = 20',
    '(({a, b, ...r}) => {})({a: 1, b: 2, c: 3, d: 4});',
    '(function ({a, b, ...r}) {})({a: 1, b: 2, c: 3, d: 4});',
    'var a, b, c; ({a, b, ...r} = {a: 1, b: 2, c: 3, d: 4});',
    'try { throw {a:2} } catch({...rest}) {}',
    'let c = {}; let o = {a: 1, b: 2, ...c};',
    'let o = {a: 1, b: 3, ...{}};',
    'let o = {a: 1, b: 2, ...null, c: 3};',
    'let o = {a: 1, b: 2, ...undefined, c: 3};',
    'let o = {a: 1, b: 2, ...{...{}}, c: 3};',
    'let c = {}; let o = {a: 1, b: 2, ...c, d: 3, ...c, e: 5};',
    'let o = {a: 1, b: 2, ...d = {e: 2}, c: 3};',
    'let p = true; let o = {a: 1, b: 2, ...d = p ? {e: 2} : {f: 4}, c: 3};',
    'let o = {a: 1, b: 2, ...(a) => 3, c: 3};',
    'function * foo() { return {a: 1, b: 2, ...yield, c: 3}; }',
    'function foo(...a) { }',
    'function foo(a, ...b) { }',
    'function foo(a = 20, ...b) { }',
    'function foo(a, b, c, d, e, f, g, ...h) { }',
    'function foo(...abc123) { }',
    'function foo(...let) { }',
    'function outer() { "use strict"; function foo(...restParam) {  } }',
    'function outer() { "use strict"; function foo(a,b,c,...restParam) {  } }',
    'function outer() { "use strict"; function foo(a = 20,b,c,...restParam) {  } }',
    'function outer() { "use strict"; function foo(a = 20,{b},c,...restParam) {  } }',
    'function outer() { "use strict"; function foo(a = 20,{b},[c] = 5,...restParam) {  } }',
    'function outer() { "use strict"; function foo(a = 20) {  } }',
    'function outer() { "use strict"; function foo(a,b,c,{d} = 20) {  } }',
    'var x = (x) => x;',
    'var x = (x, y, z) => x;',
    'var x = ({x}, [y], z) => x;',
    'var x = ({x = 30}, [y], z) => x;',
    'var x = (x = 20) => x;',
    'var x = ([x] = 20, y) => x;',
    'var x = ([x = 20] = 20) => x;',
    'var x = foo => x;',
    'var x = foo => x => x => x => x;',
    'var x = foo => x => (x = 20) => (x = 20) => x;',
    'var x = foo => x => x => x => {x};',
    'var x = ([x = 25]) => x => x => ({x} = {});',
    '({ foo(a, ...b){} });',
    '({ foo({a}, ...b){} });',
    '({ foo({a, ...b}){} });',
    '({ foo({b, ...a}, ...c){} });',

    "-void+x['y'].l == x.l != 5 - f[7]",
    '1 .l',
    '0',
    '00',
    '𠮷野家',
    '+{} / 2',
    'var [ a, , b ] = list',
    'while (1) /foo/',
    '(1) / 2',
    '+x++ / 2',
    `/* empty */
    {}
    /* emptyAdd */
    {let z = 7;}
    /* before */
    {
        let x = 5;
        let y = 6;
    }
    /* newElementAtEnd */
    {
        let x = 5;
        let y = 6;
        let z = 7;
    }
    /* newElementAtStart */
    {
        let z = 7;
        let x = 5;
        let y = 6;
    }
    /* newElementAtMiddle */
    {
        let x = 5;
        let z = 7;
        let y = 6;
    }
    /* newElementAtEndHasComment */
    {
        let x = 5;
        let y = 6;
        let z = 7; /* ima comment */
    }
    /* newElementAtStartHasComment */
    {
        let z = 7; /* ima comment */
        let x = 5;
        let y = 6;
    }
    /* newElementInMiddleHasComment */
    {
        let x = 5;
        let z = 7; /* ima comment */
        let y = 6;
    }
    /* size 0 */
    {
    }
    /* size 1 */
    {
        let x = 5;
    }
    /* size 3 */
    {
        let x = 5;
        let z = 7;
        let y = 6;
    }`,
    `/* simple */
    while(false) break;
    /* has id */
    loop1:
    while(false) break loop1;`,
    `/* basic */
    if (a == 5) a = 6;
    /* multiple expression */
    if (a == 5, a == 7) a = 6;
    /* three expressions */
    if (a == 5, b == 7, c == 9) d = 6;
    /* empty expression */
    if (a == 5, a == 7) a = 6;
    /* else */
    if (a == 5) a = 6;
    else a = 5;
    /* else if */
    if (a == 5) a = 6;
    else if (a == 0) a = 0;
    else a = 5;
    /* formatted */
    if (a == 5){
        a = 6;
    } else
        a = 5;
    /* formatted statement */
    {
        a = 6;
    }`,
    `((a, { b = 0, c = 3 }) => {
      return a === 1 && b === 2 && c === 3;
    })(1, { b: 2 });`,
    `((a, _ref) => {
      let {
        b = 0,
        c = 3
      } = _ref;
      return a === 1 && b === 2 && c === 3;
    })(1, {
      b: 2
    });`,
    'for (a,b in c ;;) break',
    'a[foo].c = () => { throw Error(); };',
    'console.info({ toString: () => {throw new Error("exception");} })',
    'null',
    `/* simple */
    with (list) clear();
    /* setExpression0 */
    with (myList()) clear();
    /* setValidStatement */
    with (list) x = 5;
    /* block statement */
    with (list){
        clear();
    }`,
    `/* simple */
    function f(){}
    /* changeIdentifier0 */
    function g(){}
    /* simple parameters */
    function h(a, b){}
    /* all parameters */
    function a(a, {}, [], b = 0, {} = {}, [] = [], ... c){}`,
    `/* base */
    let x = y + f(4);
    /* simple */
    let x;
    /* compound */
    let x;
    "use strict";`,
    `/* empty */
    f();
    /* single */
    f(0);`,
    `/* basic */
    if (a == 5) a = 6;
    /* multiple expression */
    if (a == 5, a == 7) a = 6;
    /* three expressions */
    if (a == 5, b == 7, c == 9) d = 6;
    /* empty expression */
    if (a == 5, a == 7) a = 6;
    /* else */
    if (a == 5) a = 6;
    else a = 5;
    /* else if */
    if (a == 5) a = 6;
    else if (a == 0) a = 0;
    else a = 5;
    /* formatted */
    if (a == 5){
        a = 6;
    } else
        a = 5;
    /* formatted statement */
    {
        a = 6;
    }`,
    `/* base */
    let x = y + f(4);
    /* simple */
    let x;
    /* compound */
    let x;
    "use strict";
    /* block */
        {
            let x = 5;
        }`,
    `/* simple */
        switch(x){
            case 0:
                global.x = 5;
            break;
            case 1:
            default:
        }
        /* empty */
        switch(null){}
        /* caseNames */
        switch(x){
            case "apple":
            break;
            case 1:
            default:
        }
        /* empty */
        switch(0){

        }`,
    `/* simple */
        while(false) continue;
        /* has id */
        loop1:
        while(false) continue loop1;`,
    'function foo() { do;while(0)return }',
    'function foo() { do;while(0)return /foo/ }',
    'function foo() { do;while(0) /foo/ }',
    'x = {foo: function x() {} / divide}',
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
    `/}?/u;`,
    `/{*/u;`,
    `/.{.}/;`,
    `/[\\w-\\s]/;`,
    `/[\\s-\\w]/;`,
    `/(?!.){0,}?/;`,
    `/(?!.){0,}?/u;`,
    `/{/;`,
    `004`,
    `076`,
    `02`,
    `/*
    */--> foo`,
    `var foo = [23]
    -->[0];`,
    `var x = 0;
    x = -1 <!--x;`,
    '-->the comment extends to these characters',
    'try {  throw null; } catch (f) { if (true) function f() { return 123; } else function _f() {} }',
    'switch (0) { default:  let f;  if (true) function f() {  } else ;  }',
    'var init = f;  if (true) function f() {  } else ;',
    'if (true) function f() { initialBV = f; f = 123; currentBV = f; return "decl"; }',
    'try {  throw {};  } catch ({ f }) {  if (true) function f() {  } else ;  }',
    'switch (0) { default:  let f; if (true) function f() {  }  }',
    '  try {  throw {};  } catch ({ f }) {  if (true) function f() {  }  }',
    '{  let f = 123;  if (false) ; else function f() {  }  }',
    'switch (0) { default:  let f; switch (1) {  case 1:   function f() {  }  }  }',
    'try {  throw {};  } catch ({ f }) {  switch (1) {  case 1:  function f() {  }  }  }',
    'try { throw null;} catch (f) {switch (1) { default: function f() { return 123; } } }',
    'let f = 123; switch (1) { default: function f() {  } }',
    'var init = f;  switch (1) { default:   function f() {  }  }',
    'var init = f; if (false) function _f() {} else function f() {  }',
    '{  let f = 123; if (false) function _f() {} else function f() {  }  }',
    'function arguments() {}',
    'try {  throw null;  } catch (f) {  {   function f() { return 123; }  }  }',
    'var outer = (function*() { yield* iter; })();',
    `try {
  throw 'exception';
} catch (err) {
  before = err;
  for (var err = 'loop initializer'; err !== 'increment'; err = 'increment') {
    during = err;
  }
  after = err;
}`,
    `try {
  throw 'exception';
} catch (err) {
  before = err;
  for (var err in { propertyName: null }) {
    during = err;
  }
  after = err;
}`,
    ` try {
  throw new Error();
}
catch (foo) {
  var foo = "initializer in catch";
}`,
    `try {
  throw 'exception';
  } catch (err) {
before = err;
for (var err = 'loop initializer'; err !== 'increment'; err = 'increment') {
during = err;
}
after = err;
}`,
    'o = { __proto__: 1 };',
    'o = {  __proto__: proto };',
    'o = { __proto__: null };',
    `label: function g() {}`,
    `label1: label2: function f() {}`,
    '000',
    '073',
    '004',
    '074',
    '004',
    '004',
    '004',
    '077',
    '00',
    '00',
    '05',
    '078',
    '0708',
    '019',
    '0719',
    '0782',
    '0790',
    '"\\0"',
    '"\\x05"',
    '"\\x06"',
    '"\\18"',
    '"\\00"',
    '"\\218"',
    '"\\66"',
    '"\\210"',
    `'\\48'`,
    `'\\07'`,
    `'\\168'`,
    `'\\318'`,
    `'\\500'`,
    `'\\160'`,
    `'\\301'`,
    `'\\377'`,
    'if (x) function f() { return 23; } else function f() { return 42; }',
    'if (x) function f() {}',
    `var foo = [23]
                    -->[0];`,
    'x = -1 <!--x;',
    'if (true) function f() {  } else function _f() {}',
    'if (true) function f() { return "foo"; } else function _f() {}',
    'for (let f of [0]) {}',
    'for (let f; ; ) {}',
    'for (let f; ; ) {}',
    ' function  a(b,) {}',
    ' function* a(b,) {}',
    '(function  a(b,) {});',
    '(function* a(b,) {});',
    '(function   (b,) {});',
    '(function*  (b,) {});',
    ' function  a(b,c,d,) {}',
    ' function* a(b,c,d,) {}',
    '(function  a(b,c,d,) {});',
    '(function* a(b,c,d,) {});',
    '(function   (b,c,d,) {});',
    '(function*  (b,c,d,) {});',
    'class Foo { bar(a,) { } }',
    '({"oink"(that, ugly, icefapper) {}})',
    '({"moo"() {}})',
    '({3() {}})',
    '({[6+3]() {}})',
    'var yield;',
    'var yield = 1',
    'var object = {yield}',
    'const yield = yield;',
    'let foo, yield;',
    'var foo, yield;',
    'try { } catch (yield) { }',
    'function yield() { }',
    '(function yield() { })',
    'function foo(yield) { }',
    'function foo(bar, yield) { }',
    'yield = 1;',
    'var foo = yield = 1;',
    'yield * 2;',
    '++yield;',
    'yield++;',
    'yield++ - 1;',
    'yield: 34',
    '(yield) => {}',
    'var let;',
    'var foo, let;',
    'try { } catch (let) { }',
    'function let() { }',
    '(function let() { })',
    'function foo(let) { }',
    'function foo(bar, let) { }',
    'let = 1;',
    'var foo = let = 1;',
    'let * 2;',
    '++let;',
    'let++;',
    'let: 34',
    'function let(let) { let: let(let + let(0)); }',
    '({ let: 1 })',
    '({ get let() { 1 } })',
    'let(100)',
    'L: let\nx',
    'L: let\n{x}',
    'let',
    'let = 1',
    '[(a)] = 0',
    '[(a) = 0] = 1',
    '[(a.b)] = 0',
    '({a:(b)} = 0)',
    'a || b && c | d ^ e & f == g < h >>> i + j * k',
    'a + (b < (c * d)) + e',
    '([a,b])=>0;',
    '([a,...b])=>0;',
    '([[[[[[[[[[[[[[[[[[[[{a=b}]]]]]]]]]]]]]]]]]]]])=>0;',
    '({a,b=b,a:c,[a]:[d]})=>0;',
    '({x = 0}, {y = 0}, {z = 0})=>0',
    '(a, {x = 0})=>0',
    '(...a) => 0',
    'for (() => { x in y };;);',
    'arguments => 42',
    '(eval, a) => 42',
    '(eval = 10) => 42',
    '(x) => ((y, z) => (x, y, z))',
    'foo(() => {})',
    '(a,b) => 0 + 1',
    '(a,b,...c) => 0 + 1',
    '() => (a) = 0',
    "(x)=>{'use strict';}",
    '([x=0], [])=>0',
    'yield => 0',
    '([a]) => [0];',
    '([a,b])=>0;',
    'e => ({ property: 42 })',
    '(a, b) => { 42; }',
    '({a:(b) = 0} = 1)',
    '({a:(b.c)} = 0)',
    '({a:(b = 0)})',
    'for (let = 1; let < 1; let++) {}',
    'for (let in {}) {}',
    'for (var let = 1; let < 1; let++) {}',
    'for (var let in {}) {}',
    'for (var [let] = 1; let < 1; let++) {}',
    'for (var [let] in {}) {}',
    'var let',
    'var [let] = []',
    '() => yield',
    'var a℮;',
    'var a፰;',
    'var A\\u{42}C;',
    'let ℮',
    `a123`,
    '\\u{00069} = i + \\u{00069};',
    `this.\\u0069`,
    'var $\\u{20BB7} = "b";',
    'var _\\u0524 = "a";',
    'var $00xxx\\u0069\\u0524\\u{20BB7} = "c";',
    'var a\\u2118;',
    'var a\\u309C;',
    'var \\u1886;',
    'function yield(yield) { yield: yield (yield + yield(0)); }',
    '({ yield: 1 })',
    '({ get yield() { 1 } })',
    'yield(100)',
    `await;`,
    'class await {}',
    `function await(yield) {}`,
    'var await = 1',
    'async(await)',
    '({ await: async })',
    'await => {}',
    'await => async',
    'class X { await(){} }',
    'f(x, await(y, z))',
    'class X { static await(){} }',
    'x = await(y);',
    'class X { await() {} }',
    'let async = await;',
    'x = { await: false }',
    'yield[100]',
    `async
      function f() {}`,
    'x = { async: false }',
    `a = async
      function f(){}`,
    'async => 42;',
    'const answer = async => 42;',
    'async function await() {}',
    'class X { async await(){} }',
    'f(x, async(y, z))',
    'class X { static async await(){} }',
    'x = async(y);',
    'class X { async() {} }',
    'let async = await;',
    'x = { async: false }',
    '({get [6+3]() {}, set [5/4](x) {}})',
    '({[2*308]:0})',
    '({["nUmBeR"+9]:"nein"})',
    '({get __proto__() {}, set __proto__(x) {}})',
    '({set __proto__(x) {}})',
    '({get __proto__() {}})',
    '({__proto__:0})',
    '({set c(x) {}})',
    '({get b() {}})',
    '({2e308:0})',
    '({0x0:0})',
    '(1, y)',
    '0, f(n - 1);',
    '(b,) => {};',
    '(b,c,d,) => {};',
    'a(1,);',
    'a(1,2,3,);',
    'a(...[],);',
    'a(1, 2, ...[],);',
    'a(...[], 2, ...[],);',
    'a, b => 0',
    'a, b, (c, d) => 0',
    '(a, b, (c, d) => 0)',
    '(a, b) => 0, (c, d) => 1',
    '(a, b => {}, a => a + 1)',
    '((a, b) => {}, (a => a + 1))',
    '(a, (a, (b, c) => 0))',
    'async (a, (a, (b, c) => 0))',
    '[...a,]',
    '[...a, ,]',
    '[, ...a]',
    '[...[...a]]',
    '[, ...a]',
    '[, , ...a]',
    'for (let f in { key: 0 }) {}',
    `(function(f) {
                        init = f;
                        switch (1) {
                          case 1:
                            function f() {  }
                        }
                        after = f;
                      }(123));`,
    ` try {
                        throw {};
                      } catch ({ f }) {
                      switch (1) {
                        default:
                          function f() {  }
                      }
                      }
                    `,
    `{
                        function f() {
                          return 'first declaration';
                        }
                      }`,
    `{
                        function f() { return 'declaration'; }
                      }`,
    'if (true) function f() {} else function _f() {}',
    'if (false) function _f() {} else function f() { }',
    `for (let f; ; ) {
                        if (false) ; else function f() {  }
                          break;
                        }`,
    `try {
  throw {};
} catch ({ f }) {
switch (1) {
  case 1:
    function f() {  }
}
}`,
    'if (true) function f() {  } else function _f() {}',
    'if (true) function f() {  } else function _f() {}',
    `switch (1) {
  default:
    function f() {  }
}`,
    `try {
  throw {};
} catch ({ f }) {
switch (1) {
  case 1:
    function f() {  }
}
}`,
    `{
  let f = 123;
  switch (1) {
    case 1:
      function f() {  }
  }
  }`,
    `
  for (let f in { key: 0 }) {
  switch (1) {
    case 1:
      function f() {  }
  }
  }`,

    `if (a > b) {} else {}
  if (c != d) {}
  var a = b > c ? d : e;
  let b = (c = 1) ? d : e;
  switch (a) {
    case b:
      break;
    case "c":
      break;
    case 42:
      break;
    case d:
      if (a < b) {}
      break;
    default:
      break;
  }
  while (a > b) {
    if (c == d) {
      break;
    }
  }
  do {
    if (e === f) {
      continue;
    }
  } while (g < h);
  label: if (a === b) {
    if (b = c) {
      break label;
    }
  }
  if (a != b) {}
  endingLabel: {}`,
    `var a, b, c, d, e, f, g, x, y, z;
  a = 1 + 2 * 3 / 5;
  b = (1 + 2) * 3 / 5;
  c = (1 + 2) * (3 - 5);
  d = x | y ^ z;
  e = (x | y) ^ z;
  f = "a" + (1 + 2) + "b";
  g = "a" + (1 - 2) + "b";
  a = true || false && null;
  b = c == d || e != f;
  c = x instanceof y || x instanceof z;
  d = x == y && y != z;
  a = !false;
  b = !x instanceof Number;
  c = !(x instanceof Number);
  d = typeof a === 'boolean';
  e = !typeof a === 'boolean';
  f = !(typeof a === 'boolean');
  a = (1.1).toString();
  b = new A().toString();
  c = new x.A().toString();
  d = new x.y().z();
  var r = (/ab+c/i).exec('abc');
  a = b ** 2 * 3;
  c = (d ** 2) ** 3;
  e = f ** 2 ** 3;
  f = a + (b = 3);
  g = 1 && (() => {});
  g = (() => {}) && 1;`,
    `({});[];
        this.nan;
        1 < 2 > 3 <= 4 >= 5 == 6 != 7 === 8 !== 9;
        1 + 2 - 3 * 4 % 5 / 6 << 7 >> 8 >>> 9;
        this.nan++; ++this.nan; this.nan--; --this.nan;
        1 & 2 | 3 ^ 4 && !5 || ~6;
        1 ? 2 : 3;
        this.nan = 1; this.nan += 2; this.nan -= 3; this.nan *= 4; this.nan /= 5;
        this.nan %= 6; this.nan <<= 7; this.nan >>= 8; this.nan >>>= 9;
        this.nan &= 1; this.nan |= 2; this.nan ^= 3;`,
    `
function a() {
				var e, i, n, a, o = this._tween,
					l = o.vars.roundProps,
					h = {},
					_ = o._propLookup.roundProps;
				if ("object" != (void 0 === l ? "undefined" : t(l)) || l.push) for ("string" == typeof l && (l = l.split(",")), n = l.length; --n > -1;) h[l[n]] = Math.round;
				else for (a in l) h[a] = s(l[a]);
				for (a in h) for (e = o._firstPT; e;) i = e._next, e.pg ? e.t._mod(h) : e.n === a && (2 === e.f && e.t ? r(e.t._firstPT, h[a]) : (this._add(e.t, a, e.s, e.c, h[a]), i && (i._prev = e._prev), e._prev ? e._prev._next = i : o._firstPT === e && (o._firstPT = i), e._next = e._prev = null, o._propLookup[a] = _)), e = i;
				return !1
			}
`,
    `var await;
async function foo() {
  function bar() {
    await = 1;
  }
  bar();
}
foo();`,
    `
if (a) {
  for(f(); false;) {}
} else
  for(x in y) {
    g()
  }
`,
    `var await;
async function foo() {
  function bar() {
    await = 1;
  }
  bar();
}
foo();`,
    `function testArgs3(x, y, z) {
  // Properties of the arguments object are enumerable.
  var a = Object.keys(arguments);
  if (a.length === 3 && a[0] in arguments && a[1] in arguments && a[2] in arguments)
    return true;
}`,
    `function testArgs4(x, y, z) {
  // Properties of the arguments object are enumerable.
  var a = Object.keys(arguments);
  if (a.length === 4 && a[0] in arguments && a[1] in arguments && a[2] in arguments && a[3] in arguments)
    return true;
}`,
    `function testArgs2(x, y, z) {
  // Properties of the arguments object are enumerable.
  var a = Object.keys(arguments);
  if (a.length === 2 && a[0] in arguments && a[1] in arguments)
    return true;
}`,
    `var s2 = new Subclass2(3, 4);`,

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
}
`,
    `function a(t) {
  var result = [];
  for (var i in t) {
    result.push([i, t[i]]);
  }
  return result;
}

// Check that we correctly deoptimize on map check.
function b(t) {
  var result = [];
  for (var i in t) {
    result.push([i, t[i]]);
    delete t[i];
  }
  return result;
}

// Check that we correctly deoptimize during preparation step.
function c(t) {
  var result = [];
  for (var i in t) {
    result.push([i, t[i]]);
  }
  return result;
}

// Check that we deoptimize to the place after side effect in the right state.
function d(t) {
  var result = [];
  var o;
  for (var i in (o = t())) {
    result.push([i, o[i]]);
  }
  return result;
}

// Check that we correctly deoptimize on map check inserted for fused load.
function e(t) {
  var result = [];
  for (var i in t) {
    delete t[i];
    t[i] = i;
    result.push([i, t[i]]);
  }
  return result;
}

// Nested for-in loops.
function f(t) {
  var result = [];
  for (var i in t) {
    for (var j in t) {
      result.push([i, j, t[i], t[j]]);
    }
  }
  return result;
}

// Deoptimization from the inner for-in loop.
function g(t) {
  var result = [];
  for (var i in t) {
    for (var j in t) {
      result.push([i, j, t[i], t[j]]);
      var v = t[i];
      delete t[i];
      t[i] = v;
    }
  }
  return result;
}


// Break from the inner for-in loop.
function h(t, deopt) {
  var result = [];
  for (var i in t) {
    for (var j in t) {
      result.push([i, j, t[i], t[j]]);
      break;
    }
  }
  deopt.deopt;
  return result;
}

// Continue in the inner loop.
function j(t, deopt) {
  var result = [];
  for (var i in t) {
    for (var j in t) {
      result.push([i, j, t[i], t[j]]);
      continue;
    }
  }
  deopt.deopt;
  return result;
}

// Continue of the outer loop.
function k(t, deopt) {
  var result = [];
  outer: for (var i in t) {
    for (var j in t) {
      result.push([i, j, t[i], t[j]]);
      continue outer;
    }
  }
  deopt.deopt;
  return result;
}

// Break of the outer loop.
function l(t, deopt) {
  var result = [];
  outer: for (var i in t) {
    for (var j in t) {
      result.push([i, j, t[i], t[j]]);
      break outer;
    }
  }
  deopt.deopt;
  return result;
}

// Test deoptimization from inlined frame (currently it is not inlined).
function m0(t, deopt) {
  for (var i in t) {
    for (var j in t) {
      deopt.deopt;
      return [i, j,  t[i], t[j]];
    }
  }
}

function m(t, deopt) {
  return m0(t, deopt);
}`,
    `function osr_inner(t, limit) {
  var r = 1;
  for (var x in t) {
    if (t.hasOwnProperty(x)) {
      for (var i = 0; i < t[x].length; i++) {
        r += t[x][i];
        if (i === limit) OptimizeOsr();
      }
      r += x;
    }
  }
  return r;
}

function osr_outer(t, osr_after) {
  var r = 1;
  for (var x in t) {
    for (var i = 0; i < t[x].length; i++) {
      r += t[x][i];
    }
    if (x === osr_after) OptimizeOsr();
    r += x;
  }
  return r;
}

function osr_outer_and_deopt(t, osr_after) {
  var r = 1;
  for (var x in t) {
    r += x;
    if (x == osr_after) OptimizeOsr();
  }
  return r;
}`,
    `let global = this;
let p = {};
let q = {};

let g1 = function() {
  assertEq(this, global);
  assertEq(arguments.callee, g1);
};
g1(...[]);

let g2 = x => {
  assertEq(this, global);
  // arguments.callee is unbound function object, and following assertion fails.
  // see Bug 889158
  //assertEq(arguments.callee, g2);
};
g2(...[]);

let g3 = function() {
  assertEq(this, p);
  assertEq(arguments.callee, g3);
};
g3.apply(p, ...[]);
g3.call(p, ...[]);

g2.apply(p, ...[]);
g2.call(p, ...[]);

let o = {
  f1: function() {
    assertEq(this, o);
    assertEq(arguments.callee, o.f1);

    let g1 = function() {
      assertEq(this, global);
      assertEq(arguments.callee, g1);
    };
    g1(...[]);

    let g2 = x => {
      assertEq(this, o);
      //assertEq(arguments.callee, g2);
    };
    g2(...[]);

    let g3 = function() {
      assertEq(this, q);
      assertEq(arguments.callee, g3);
    };
    g3.apply(q, ...[]);
    g3.call(q, ...[]);

    let g4 = x => {
      assertEq(this, o);
      //assertEq(arguments.callee, g4);
    };
    g4.apply(q, ...[]);
    g4.call(q, ...[]);
  },
  f2: x => {
    assertEq(this, global);
    //assertEq(arguments.callee, o.f2);
    let g1 = function() {
      assertEq(this, global);
      assertEq(arguments.callee, g1);
    };
    g1(...[]);

    let g2 = x => {
      assertEq(this, global);
      //assertEq(arguments.callee, g2);
    };
    g2(...[]);

    let g3 = function() {
      assertEq(this, q);
      assertEq(arguments.callee, g3);
    };
    g3.apply(q, ...[]);
    g3.call(q, ...[]);

    let g4 = x => {
      assertEq(this, global);
      //assertEq(arguments.callee, g4);
    };
    g4.apply(q, ...[]);
    g4.call(q, ...[]);
  },
  f3: function() {
    assertEq(this, p);
    assertEq(arguments.callee, o.f3);

    let g1 = function() {
      assertEq(this, global);
      assertEq(arguments.callee, g1);
    };
    g1(...[]);

    let g2 = x => {
      assertEq(this, p);
      //assertEq(arguments.callee, g2);
    };
    g2(...[]);

    let g3 = function() {
      assertEq(this, q);
      assertEq(arguments.callee, g3);
    };
    g3.apply(q, ...[]);
    g3.call(q, ...[]);

    let g4 = x => {
      assertEq(this, p);
      //assertEq(arguments.callee, g4);
    };
    g4.apply(q, ...[]);
    g4.call(q, ...[]);
  }
};
o.f1(...[]);
o.f2(...[]);
o.f3.apply(p, ...[]);
o.f2.apply(p, ...[]);`,
    `function zeroArguments () {
  arguments[1] = '0';
  actual += arguments[1];
}

function oneArgument (x) {
  arguments[1] = '1';
  actual += arguments[1];
}

function twoArguments (x,y) {
  arguments[1] = '2';
  actual += arguments[1];
}`,
    `for (var i = 1; i < arguments.length; i++) {
  var o = arguments[i];
  if (typeof(o) != 'undefined' && o !== null) {
      for (var k in o) {
          self[k] = o[k];
      }
  }
}`,
    'function dumpArgs(i) { if (i == 90) return funapply.arguments.length; return [i]; }',
    `function foo() {
   switch (arguments.length) {
  default: return new orig_date(arguments[0], arguments[1],
     arguments.length >= 3 ? arguments[2] : 1,
     arguments.length >= 4 ? arguments[3] : 0,
     arguments.length >= 5 ? arguments[4] : 0,
     arguments.length >= 6 ? arguments[5] : 0,
     arguments.length >= 7 ? arguments[6] : 0);
  }}`,
    'var { [key++]: y, ...x } = { 1: 1, a: 1 };',
    'var { [++key]: y, [++key]: z, ...rest} = {2: 2, 3: 3};',
    '({ [key]: y, z, ...x } = {2: "two", z: "zee"});',
    'var { [fn()]: x, ...y } = z;',
    `var z = {};
var { ...x } = z;
var { x, ...y } = z;
var { [x]: x, ...y } = z;
(function({ x, ...y }) { });

({ x, y, ...z } = o);

var [state, dispatch] = useState();`,
    '() => { [a, b] = [1, 2] }',
    'function foo(...{ length }) {}',
    `const foo = {
	bar: 10,
}

let bar = 0;

if (foo) {
  ({ bar } = foo);
}
`,
    `var o = {};
var a = [];
let i = "outer_i";
let s = "outer_s";
for (let i = 0x0020; i < 0x01ff; i+=2) {
  let s = 'char:' + String.fromCharCode(i);
  a.push(s);
  o[s] = i;
}`,
    `(function forInPrototype() {
  // Fast properties + fast elements
  var obj = {a:true, 3:true, 4:true};
  obj.__proto__ = {c:true, b:true, 2:true, 1:true, 5:true};
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("34a125cb".split(""), props(obj));
  }
  // Fast properties + dictionary elements
  delete obj.__proto__[2];
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("34a15cb".split(""), props(obj));
  }
  // Slow properties + dictionary elements
  delete obj.__proto__.c;
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("34a15b".split(""), props(obj));
  }
  // Slow properties on the receiver as well
  delete obj.a;
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("3415b".split(""), props(obj));
  }
  delete obj[3];
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("415b".split(""), props(obj));
  }
})();`,
    `(function forInShadowing() {
  var obj = {a:true, 3:true, 4:true};
  obj.__proto__ = {
    c:true, b:true, x:true,
    2:true, 1:true, 5:true, 9:true};
  Object.defineProperty(obj, 'x', {value:true, enumerable:false, configurable:true});
  Object.defineProperty(obj, '9', {value:true, enumerable:false, configurable:true});
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("34a125cb".split(""), props(obj));
  }
  // Fast properties + dictionary elements
  delete obj.__proto__[2];
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("34a15cb".split(""), props(obj));
  }
  // Slow properties + dictionary elements
  delete obj.__proto__.c;
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("34a15b".split(""), props(obj));
  }
  // Remove the shadowing properties
  delete obj.x;
  delete obj[9];
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("34a159bx".split(""), props(obj));
  }
  // Slow properties on the receiver as well
  delete obj.a;
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("34159bx".split(""), props(obj));
  }
  delete obj[3];
  for (var i = 0; i < 3; i++) {
    assertArrayEquals("4159bx".split(""), props(obj));
  }
})();

(function forInShadowingSlowReceiver() {
  // crbug 688307
  // Make sure we track all non-enumerable keys on a slow-mode receiver.
  let receiver = {a:1};
  delete receiver.a;
  let proto = Object.create(null);
  let enumProperties = [];
  for (let i = 0; i < 10; i++) {
    let key = "property_"+i;
    enumProperties.push(key);
    receiver[key] = i;
    proto[key] = i;
  }
  for (let i = 0; i < 1000; i++) {
    let nonEnumKey = "nonEnumerableProperty_"+ i;
    Object.defineProperty(receiver, nonEnumKey, {});
    // Add both keys as enumerable to the prototype.
    proto[nonEnumKey] = i;
  }
  receiver.__proto__ = proto;
  // Only the enumerable properties from the receiver should be visible.
  for (let key in receiver) {
    assertEquals(key, enumProperties.shift());
  }
})();

(function forInCharCodes() {
  var o = {};
  var a = [];
  for (var i = 0x0020; i < 0x01ff; i+=2) {
    var s = 'char:' + String.fromCharCode(i);
    a.push(s);
    o[s] = i;
  }
  assertArrayEquals(a, props(o), "charcodes");
})();

(function forInArray() {
  var a = [];
  assertEquals(0, props(a).length, "proplen0");
  a[Math.pow(2,30)-1] = 0;
  assertEquals(1, props(a).length, "proplen1");
  a[Math.pow(2,31)-1] = 0;
  assertEquals(2, props(a).length, "proplen2");
  a[1] = 0;
  assertEquals(3, props(a).length, "proplen3");
})();

(function forInInitialize() {
  for (var hest = 'hest' in {}) { }
  assertEquals('hest', hest, "empty-no-override");

  // Lexical variables are disallowed
  assertThrows("for (const x = 0 in {});", SyntaxError);
  assertThrows("for (let x = 0 in {});", SyntaxError);

  // In strict mode, var is disallowed
  assertThrows("'use strict'; for (var x = 0 in {});", SyntaxError);
})();

(function forInObjects() {
  var result = '';
  for (var p in {a : [0], b : 1}) { result += p; }
  assertEquals('ab', result, "ab");

  var result = '';
  for (var p in {a : {v:1}, b : 1}) { result += p; }
  assertEquals('ab', result, "ab-nodeep");

  var result = '';
  for (var p in { get a() {}, b : 1}) { result += p; }
  assertEquals('ab', result, "abget");

  var result = '';
  for (var p in { get a() {}, set a(x) {}, b : 1}) { result += p; }
  assertEquals('ab', result, "abgetset");
})();


// Test that for-in in the global scope works with a keyed property as "each".
// Test outside a loop and in a loop for multiple iterations.
a = [1,2,3,4];
x = {foo:5, bar:6, zip:7, glep:9, 10:11};
delete x.bar;
y = {}

for (a[2] in x) {
  y[a[2]] = x[a[2]];
}

assertEquals(5, y.foo, "y.foo");
assertEquals("undefined", typeof y.bar, "y.bar");
assertEquals(7, y.zip, "y.zip");
assertEquals(9, y.glep, "y.glep");
assertEquals(11, y[10], "y[10]");
assertEquals("undefined", typeof y[2], "y[2]");
assertEquals("undefined", typeof y[0], "y[0]");

for (i=0 ; i < 3; ++i) {
  y = {}

  for (a[2] in x) {
    y[a[2]] = x[a[2]];
  }

  assertEquals(5, y.foo, "y.foo");
  assertEquals("undefined", typeof y.bar, "y.bar");
  assertEquals(7, y.zip, "y.zip");
  assertEquals(9, y.glep, "y.glep");
  assertEquals(11, y[10], "y[10]");
  assertEquals("undefined", typeof y[2], "y[2]");
  assertEquals("undefined", typeof y[0], "y[0]");
}

(function testLargeElementKeys() {
  // Key out of SMI range but well within safe double representaion.
  var large_key = 2147483650;
  var o = [];
  // Trigger dictionary elements with HeapNumber keys.
  o[large_key] = 0;
  o[large_key+1] = 1;
  o[large_key+2] = 2;
  o[large_key+3] = 3;
  var keys = [];
  for (var k in o) {
    keys.push(k);
  }
  assertEquals(["2147483650", "2147483651", "2147483652", "2147483653"], keys);
})();

(function testLargeElementKeysWithProto() {
  var large_key = 2147483650;
  var o = {__proto__: {}};
  o[large_key] = 1;
  o.__proto__[large_key] = 1;
  var keys = [];
  for (var k in o) {
    keys.push(k);
  }
  assertEquals(["2147483650"], keys);
})();

(function testNonEnumerableArgumentsIndex() {
  Object.defineProperty(arguments, 0, {enumerable:false});
  for (var k in arguments) {
    assertUnreachable();
  }
})();

(function testNonEnumerableSloppyArgumentsIndex(a) {
  Object.defineProperty(arguments, 0, {enumerable:false});
  for (var k in arguments) {
    assertUnreachable();
  }
})(true);`,
    `function destructObject() {
  var a, b, c, d;
  ({a, x: b, y: {c, z: [,d]}} = {
    a: 7,  // field with shorthand a => a: a syntax
    x: 8,  // typical syntax
    y: {   // nested object destructuring
           // missing binding 'c'
      z: [10, 11, 12]  // nested array destructuring
    }
  });
  return {
    a: a,
    b: b,
    c: c,
    d: d
  };
}`,
    `var {0: x, '1': y, length: z} = [0, 1, 2, 3];`,
    `var {x: y,} = {x: 5};`,
    `({x = 6} = {});`,
    `({x: {y = 7}, z = 8} = {x: {}});`,
    `function destructNestedScopeArguments(x) { [(function () { return arguments[1]; })(null, x)[0]] = [42];}`,
    `function* fib() {
  var fn1 = 1;
  var fn2 = 1;
  var reset;
  while (1) {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    reset = yield current;
    if (reset) {
      fn1 = 1;
      fn2 = 1;
    }
  }
}

// var
function* fibVar() {
  var fn1 = 1;
  var fn2 = 1;
  while (1) {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    var reset = yield current;
    if (reset) {
      fn1 = 1;
      fn2 = 1;
    }
  }
}

// destructuring
function* fibD() {
  var fn1 = 1;
  var fn2 = 1;
  var reset;
  var tmp;
  while (1) {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    [reset, tmp] = yield current;
    assert.equal(reset, tmp);
    if (reset) {
      fn1 = 1;
      fn2 = 1;
    }
  }
}

// destructuring with var
function* fibVarD() {
  var fn1 = 1;
  var fn2 = 1;
  var tmp;
  while (1) {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    var [reset, tmp] = yield current;
    assert.equal(reset, tmp);
    if (reset) {
      fn1 = 1;
      fn2 = 1;
    }
  }
}

function next(g) {
  return g.next();
}

function send(g, v) {
  return g.next(v);
}

function nextD(g) {
  return g.next([]);
}

function sendD(g, v) {
  return g.next([v, v]);
}
`,
    'var {a, ...b} = c;',
    'for (var a = void 0 in obj) {}',
    'var x = 1; { var {x: x$__0, y} = {}; }',
    'let x = 1; { let {y, x} = {}; }',
    'let x = 1; { let {x: x, y} = {}; }',
    'var x = 1; { var {x: x$__0, y} = {}; }',
    'let x = 1; { let {x, y = x} = {}; }',
    'var x = 1; { var {x: x$__0, y = x$__0} = {}; }',
    `function x(next) {
      try {
        y();
      }
      catch({stack}) {
        this.something = 4; // ESLint error
        next = 4;
      }
      return next;
    }`,
    `let { aprop, ...other } = this.props`,
    'const foo = {a: 1, b: 2, c: 3}',
    'const { a, ...bar } = foo;',
    'var x = (a, ...b) => {};',
    'function b({a, ...b}) {}',
    'function c({a, ...b}) {}',
    'const { a, ...bar } = foo;',
    'const [ a, ...bar ] = foo;',
    '([x = 10]) => x ',
    '({x = 10}) => x ',
    'var [x = 10, y = 5, z = 1] = a; ',
    'var {x: x, y: y, z: { a: a = 10} } = b; ',
    'var [x = 10, y, z] = a; ',
    'var [x = 10, [ z = 10]] = a; ',
    'var [x = 10, [ z ]] = a; ',
    '[x=10] = x ',
    'var {x = 10, y = 5, z = 1} = a; ',
    'var { x: x = 10 } = x; ',
    'var {x, y: y = 10, z} = a; ',
    'var {x = 10, y: { z = 10}} = a; ',
    'var {x = 10, y: { z }} = a; ',
    'function a([x = 10]) {} ',
    'function a({x = 10, y: { z = 10 }}) {}; ',
    'function a({x = 10}) {} ',

    `var [a, b] = [foo(), bar];
var [a, b] = [clazz.foo(), bar];
var [a, b] = [clazz.foo, bar];
var [a, b] = [, 2];
[a, b] = [1, 2];
[a, b] = [, 2];`,
    `var a = false;
function f() {
  console.log('f called');
}
function g() {
  console.log('g called');
}
var c = 0;
var e = 1;
var y = [1];
if (a) {
  for(f(); false;) {}
} else
  for(x in y) {
    g()
}`,
    'var AsyncGeneratorFunction = Object.getPrototypeOf(async function* () {}).constructor;',
    `var x = {
	a: "asdf",
	b: "qwerty",
	...(1 > 0 ? { c: "zxcv" } : ""),
	d: 1234
};`,
    '[a, b] = [b, a]',
    'async(async(async(async(async(async())))))',
    'for (var [a, b] in c);',
    'price_9̶9̶_89',
    `while (true) { break /* Multiline
      Comment */a; }`,
    '/(()(?:\\2)((\\4)))/;',
    `typeof (1, a)  // Don't transform to 0,typeof ident`,
    'var ℘;',
    '(a) => 1',
    '\\u0AF9',
    'ૹ\n\n',
    `// TODO(Constellation):
    // This transformation sometimes make script bigger size.
    // So we should handle it in post processing pass.
    (function () {
        while (!a || !b()) {
            c();
        }
    }());`,
    `(function () {
      var a;
      (1, a)();
  }());`,
    'for (var {a, b} of c);',
    `function a() {
      (class b { });
      class c {};
  }`,
    `function a() {
    }
    function b() {
        return c;
    }
    function d() {
        return void 1;
    }
    function e() {
        return void 2;
    }
    function f() {
        return;
    }
    function g(h, i) {
        j.k(h, i);
        l(h);
        return;
    }
    function m(h, i) {
        j.k(h, i);
        if (h) {
            n(i);
            l(h);
            return h + i;
        }
        return c;
    }
    function o(h, i) {
        j.k(h, i);
        if (h) {
            n(i);
            l(h);
            return void 3;
        }
        return h + i;
    }
    function p(h, i) {
        n(h);
        q(i);
        return void 4;
    }
    function r(h, i) {
        n(h);
        q(i);
        return c;
    }
    function s() {
        return false;
    }
    function t() {
        return null;
    }
    function u() {
        return 5;
    }`,
    `// adapted from http://asmjs.org/spec/latest/
    function a(b, c, d) {
      "use asm";
      var e = b.f.e;
      var g = b.f.g;
      var h = new b.i(d);
      function j(k, l) {
        k = k|1;
        l = l|2;
        var m = 0.0, n = 3, o = 4;
        // asm.js forces byte addressing of the heap by requiring shifting by 3
        for (n = k << 5, o = l << 6; (n|7) < (o|8); n = (n + 9)|10) {
          m = m + +g(h[n>>11]);
        }
        return +m;
      }
      function p(k, l) {
        k = k|12;
        l = l|13;
        return +e(+j(k, l) / +((l - k)|14));
      }
      return { p: p };
    }
    function q(b, c, d) {
      var e = b.f.e;
      var g = b.f.g;
      var h = new b.i(d);
      function j(k, l) {
        k = k|15;
        l = l|16;
        var m = 0.0, n = 17, o = 18;
        // asm.js forces byte addressing of the heap by requiring shifting by 3
        for (n = k << 19, o = l << 20; (n|21) < (o|22); n = (n + 23)|24) {
          m = m + +g(h[n>>25]);
        }
        return +m;
      }
      function p(k, l) {
        k = k|26;
        l = l|27;
        return +e(+j(k, l) / +((l - k)|28));
      }
      return { p: p };
    }`,
    `(function () {
      var a;
      with (b) {
          a.c = (d(), e());
      }
  }());`,
    `(function () {
      if (a != true) {
          b();
      }
      if (a != false) {
          b();
      }
  }());`,
    'class a {;b(){};c(){};}',
    '({ set null(a) { a } })',
    'var eval = 1, arguments = 2',
    'a = {}',
    '((a))()',
    'function *a(){yield null}',
    '({ a: b } = c)',
    'a > b',
    `a(
      b(c + 'd'),
      b('d' + c)
    );`,
    '({*a(){}})',
    '{ a }',

    `function a() {
      if (false) {
        var a = (1);
      }
    }`,
    `a: for (;;) continue a;`,

    `((1), a)();
   ((2), (b.a))();`,
    `function* a() {
      yield (/=3/);
    }`,
    `((function () {
      a();
    })());`,
    `"use strict";
    a = ({b: 1, b: 2});`,
    `((function () {
      var a;
      eval("a");
      function b() {
        a = (a += (1));
      }
    })());`,
    `new a("aa, [bb]", "return aa;");
    new a("aa, {bb}", "return aa;");
    new a("[[aa]], [{bb}]", "return aa;");`,
    '((1), (a.a))();',
    '[a, ...{0: b}] = (1);',
    `("a");`,
    `function a() {
      var b = (1);
      c();
      {
        c();
        c();
      }
    }`,
    `class a extends b {
      c() {
        return super.d;
      }
    }`,
    `for (var a = (1);;) {
      let a;
    }`,
    'a = ([1]);',
    'a = ({b(...c) {}});',
    `((function () {
      return 1;
      var a = (2);
    })());`,
    `function a() {
      return ({}) / (1);
    }`,
    'void (/test/);',
    `do {} while (false);
    a();`,
    `function* a() {
      (class extends (yield) {});
    }`,
    `((function () {
      if (a) {
        b();
      } else {
        return 1;
        c();
      }
      return 2;
    })());`,
    '(a = (a + (1))), (b = (b in c));',
    'for (let a in b) c(a);',
    '!(/test/);',
    `"use strict";
    {
      var a = (1);
      b();
      {
        b();
        b();
      }
    }`,
    '!(a = b);',
    `{
      {
        a;
      }
    }
    {
      b;
    }`,
    '(a, {b = 1}) => (2);',
    '({[("a") + ("b")]: 1});',
    `a["b"] = ("c");
    a["if"] = ("if");
    a["*"] = ("d");
    a["ຳ"] = ("e");
    a[""] = ("f");`,
    'a = ({__proto__: 1});',
    `class a {
      constructor() {}
      b() {}
    }
    ;
    class c {
      constructor(...d) {}
      b() {}
    }
    ;
    class e extends a {}
    ;
    var f = (class g {});
    var h = (class {});`,
    '({a: 1});',
    '({get true() {}});',
    '(a[1]).b;',
    '({a = 1}, {}) => (2);',
    '[a, a, , ...a] = (1);',
    'eval = (1);',
    `function a() {
      "use strict";
      "\\0";
    }`,
    '(a = (b("100"))) <= a;',
    'function a([b] = [1]) {}',
    'for(let a in a);',
    '(function({a}){})',
    `(function () { 'use\\nstrict'; with (a); }())`,
    `if (a) {
      // optimize it
      (function () {
        b('c');
      }());
      try {
        b("d");
      } catch (e) {
      }
    }`,
    'while (a < 1) { a++; b--; }',
    `(function () {
      var a = {};
      a.b = (c(), 1);  // ok
  }());`,
    ' /****/',
    '({set a(b=1){}})',
    `"use strict"; ({ yield() {} })`,
    'var [,a] = 1;',
    'for(let a in [1,2]) 3',
    '({ get if() {} })',
    'let {a} = {}',
    `function a() {
      return (a, void 1);
  }`,
    '(function a(b, c) { })',
    `// Surpress reducing because of alternate
    for (;;) {
        if (a) {
            if (b) {
                continue;
            } else {
                ;
            }
        } else {
            ;
        }
    }`,
    '__proto__: while (true) { continue __proto__; }',
    'function a() { new new.target; }',
    `(a)=>{'use strict';}`,
    '([a,...b])=>1;',
    '1 /* the * answer */',
    'function a() { return "<!--HTML-->comment in<!--string literal-->"; }',
    `('\\1111')`,
    `(function () {
      var a = 1;  // should not hoist this
      arguments[2] = 3;
      (function () {
          eval('');
      }());
  }());`,
    'a.b',
    'while (true) { break }',
    '({0: a, 1: a} = 1)',
    `(function () {
      do {
        a();
      } while (false);
    }());`,
    // `T‍ = []`,
    `function a(b, c) {
      function d() {
          e();
      }
      return b + c;
  }`,
    `(function () {
      var a = 1;  // should not hoist to parameter
      eval('');
  }());`,
    '// line comment',
    `a(
      b(c, c),
      d(c, c),
      e(c, c)
    );`,
    '𐀀',
    `var a = {};
    a.b = 1;
    a.c = 2;
    d.e(a.c);`,
    `(class {set a(b) {'use strict';}})`,
    '(function(){ return })',
    `function a() {
      for (var b = 1, c = 2; b < 3; ++b) {
      }
  }`,
    '0B0',
    'for (const a of b) c(a);',
    'a ^= 1',
    'a || b && c',
    '/* header */ (function(){ var a = 1; }).b(this)',
    'class a { static *[b]() {} }',
    'a << b << c',
    '(function a() { b; c() });',
    'for ({a, b} of c);',
    'eval => 1',
    '1.492417830e-10',
    'function a([ b, c ]){}',
    'var { yield: a } = b;',
    `(function () {
      null!=(a?void 1:b)
  }());`,
    '(function a([ b, c ]){})',
    '"\\u{00000000034}"',
    `switch (a) {
      default:
        // do not optimize it
        (function () {
          b('c');
        }());
      }`,
    'class a {set(b) {};}',
    `class a extends b {
      c() {
          return super[1]
      }
  }`,
    `{
      var a = 1;
      b();
      {
          b();
          b();
      }
  }`,
    `with({}) {
    };`,
    `d: while (a) {
      b();
      c();
      break d;
      e();
      f();
  }`,
    'class a {static [b](){};}',
    '/(?=.)*/;',
    `'use strict';
    a.static();`,
    'a = { set null(b) { c = b } }',
    '0o2',
    `1
    ;`,
    '(class {3() {}})',
    '(function yield(){})',
    '(a) => ((b, c) => (a, b, c))',
    'try {} catch (a) { if(1) function a(){} }',
    'function a() { new["b"]; }',
    'a => ({ b: 1 })',
    'function a() { b(); }',
    'try {} catch ([a, ...b]) {}',
    `// ContinueStatement should not be removed.
    a: while (true) while (true) continue a;`,
    'try {} catch ([a]) {}',
    `void ('a' + 'a')`,
    'a && b ? 1 : 2',
    '1e100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    'let [{a}] = 1',
    'a.b(b, c)',
    'a = { true: 1 }',
    'if (!a || b());',
    `(function (a) {
      switch (a) {
      case 1:
      default:
          b("c");
      }
  }());`,
    'var a = function b() { c() };',
    'a = a + 1, b = b in c',
    'for(a,b,c;;);',
    'var ℘\\u2118',
    `switch (a) {
      case 1:
        // optimize it
        (function () {
          b("c");
        }());
        b("d");
      }`,
    'class a {static b(){};}',
    'var a = 1<!--foo',
    `while (true) { continue // Comment
      a; }`,
    'a(...b, c, ...d)',
    'for(a = 1;;);',
    '(a) = 1',
    '(new a).b()',
    'for (var a of b);',
    '({ set a(b) { }, set a(b) { } })',
    'var 𫠝_ = 1;',
    'debugger',
    'function a(b, c) { return b < !--c; }',
    `(function() {
      var a = 1;
      a;
      var b = 2;
      with (c) {
        b;
      }
    }());`,
    'let [a,] = 1;',
    '([[[[[[[[[[[[[[[[[[[[{a=b}]]]]]]]]]]]]]]]]]]]])=>1;',
    `(/* comment */{
      a: null,
      b: null
  })`,
    '!(a=b)',
    '(a, {b = 1})=>2',
    'var [] = 1;',
    'function a(b = 1) {}',
    `// ContinueStatement should be removed.
    // And label is not used, then label also should be removed.
    a: while(true) continue a;`,
    'a(...b, ...c, ...d);',
    `a["b"] = "c";
    a["if"] = "if";
    a["*"] = "d";
    a["\\u0EB3"] = "e";
    a[""] = "f";`,
    `(function () {
      ((a) ? 1 : b) != null;
  }());`,
    'a = { get false() {} }',
    'let.let = a',
    '() => "a"',
    `if (a) {
      with (b) {
          if (c) {
              d();
          }
      }
  } else {
      d();
  }`,
    'var [a, ...a] = 1;',
    'function* a(){ (function yield(){}); }',
    `/*a
    c*/ 1`,
    '(a) => { yield + a };',
    '({a = 1} = 2)',
    '(function(yield) {})',
    'for (var a of b) c(a);',
    '[{a=b}=1]',
    `(a = b('100')) <= a `,
    `var a = {};
    a.b = 1;
    a.c = 2;
    d.e(a.b);`,
    'a(.0)',
    '({[1*2]:3})',
    'a + b + c',
    'a = { b(c=1) {} }',
    `(function () {
      while (!a || b()) {
          c();
      }
  }());`,
    'function a([b] = [1]) {}',
    `var a = !b &&       // should not touch this one
    (!c || d) &&
    (!e || f) &&
    g();`,
    `function a() {
      var b = function c() { }
  }`,
    'var abc;;',
    'var abc = 5;',
    '/* */',
    '/** **/',
    'var f = function(){;};',
    'hi; // moo',
    'var varwithfunction;',
    'a + b;',
    '"a\\n"',
    '500.',
    '500;',
    '500.432',
    '(a,b,c)',
    `(async \n ());`,
    'function a(...[]) { }',
    '(a,b,c);',
    `function foo() {
      ; 'use strict';
      with (a) {}
    }`,
    'async function f2({x}) { { var x = 2; } return x; }',
    "; 'use strict'; with ({}) {}",
    '[1,2,abc]',
    '[1,2,abc];',
    `async function *isiah(){ await (yield)}`,
    `async function *isiah(){ await (yield x)}`,
    `async function *isiah(){ yield await x}`,
    `async function *isiah(){ yield yield}`,
    `async function *isiah(){ yield yield x}`,
    'x(a,b,)',
    '(/x/);',
    'o.__proto__ = {}',
    'function* a(){({yield:a}=0)}',
    'for (; false; ) let\n{}',
    'for(let\n{} = {};;);',
    'function* a(){(class extends (yield) {});}',
    'function* a(){(class {[yield](){}})};',
    'var o = {a:1,"b":2,c:c};',
    'var x;\nvar y;',
    'var x;\nfunction n(){ }',
    'var x;\nfunction n(abc){ }',
    'var x;\nfunction n(abc, def){ }',
    'function n(){ "hello"; }',
    '/a/;',
    '++x;',
    '"variable";',
    'var o = {c:c};',
    '/a/ / /b/;',
    'a/b/c;',
    '+function(){/regex/;};',
    '\r\n',
    '\r',
    '\r\n\n\u2028\u2029\r',
    'a\r\n\r\nb',
    'a\r\n\r\nba\r\n  \r\nb',
    'a\n\rb',
    //'throw \\t\\u000b\\u000c\\u00a0\\ufeffb',
    `var foo = {bar: -2};
    function crash() {
      return !(foo.bar++);
    }`,
    `function outer () {
      var val = 0;

      function foo () {
        val = 0;
        val;
        var z = false;
        var y = true;
        if (!z) {
          while (z = !z) {
            if (y) val++;
          }
        }
        return val++;
      }

      return foo;
    }


    var foo = outer();`,
    `function inFunction() {
      for (var i = 0; i < 10; i++) {
        // in loop.
        var ja = JSON.parse('[1,2,3,4]');
        var jo = JSON.parse('{"bar": 10, "foo": 20}')
        var jop = JSON.parse('{"bar": 10, "__proto__": { }, "foo": 20}')
        var a = [1,2,3,4];
        var o = { bar: 10, foo: 20 };
        var op = { __proto__: { set bar(v) { assertUnreachable("bset"); } },
                   bar: 10 };
      }
    }

    for (var i = 0; i < 10; i++) {
      // In global scope.
      var ja = JSON.parse('[1,2,3,4]');
      var jo = JSON.parse('{"bar": 10, "foo": 20}')
      var jop = JSON.parse('{"bar": 10, "__proto__": { }, "foo": 20}')
      var a = [1,2,3,4];
      var o = { bar: 10, foo: 20 };
      var op = { __proto__: { set bar(v) { assertUnreachable("bset"); } },
                 bar: 10 };
      // In function scope.
      inFunction();
    }`,
    `0x80000000 >>> 0`,
    `function foo(a) {
      delete a[1];
      delete a[2];
      delete a[3];
      delete a[4];
      delete a[5];
      return void 0;
    }

    function call_and_deopt() {
      var b = [1,2,3];
      foo(b);
      foo(b);
    }`,
    `Array.prototype.__proto__ = { 77e4  : null };
function continueWithinLoop() {
    for (var key in [(1.2)]) {  }
};`,
    `try {
  eval("/foo/\\u0069")
} catch (e) {
  assertEquals(
      "SyntaxError: Invalid regular expression flags",
      e.toString());
}`,
    `var global = this;
function non_strict(){ assertEquals(global, this); }
function strict(){ "use strict"; assertEquals(void 0, this); }
function strict_null(){ "use strict"; assertEquals(null, this); }
`,
    `function test(x) {
  arguments[10] = 0;
  var arr = [];
  for (var p in arguments) arr.push(p);
  return arr;
}`,
    `function test(x) {
  try {
    throw new Error();
  } catch (e) {
    var y = {f: 1};
    var f = function () {
      var z = y;
      var g = function () {
        if (y.f === z.f) return x;
      };
      OptimizeFunctionOnNextCall(g);
      return g;
    }
    assertEquals(3, f()());
  }
}`,
    `var p = Object.create({}, {
  a : { value : 42, enumerable : true },
  b : { value : 42, enumerable : false },
  1 : { value : 42, enumerable : true },
  2 : { value : 42, enumerable : false },
  f : { get: function(){}, enumerable: true },
  g : { get: function(){}, enumerable: false },
  11 : { get: function(){}, enumerable: true },
  12 : { get: function(){}, enumerable: false }
});
var o = Object.create(p, {
  c : { value : 42, enumerable : true },
  d : { value : 42, enumerable : false },
  3 : { value : 42, enumerable : true },
  4 : { value : 42, enumerable : false },
  h : { get: function(){}, enumerable: true },
  k : { get: function(){}, enumerable: false },
  13 : { get: function(){}, enumerable: true },
  14 : { get: function(){}, enumerable: false }
});`,
    `var str = Array(10000).join("X");
str.replace(/^|X/g, function(m, i, s) {
  if (i > 0) assertEquals("X", m, "at position 0x" + i.toString(16));
});`,
    `var cases = [
  [0.0, 0.0, 0.0, 0,0],
  [undefined, 0.0, NaN, NaN],
  [0.0, undefined, NaN, NaN],
  [NaN, 0.0, NaN, NaN],
  [0.0, NaN, NaN, NaN],
  [-NaN, 0.0, NaN, NaN],
  [0.0, -NaN, NaN, NaN],
  [Infinity, 0.0, Infinity, 0.0],
  [0.0, Infinity, Infinity, 0.0],
  [-Infinity, 0.0, 0.0, -Infinity],
  [0.0, -Infinity, 0.0, -Infinity]
];`,
    `var x = 0;
x[0] = 0;
x[0] = 1;
x[0] = 2;`,
    `function test0() { with({}) for(var x in {}) return; }
test0();


function test1() { with({}) try { } finally { with({}) return; } }
test1();`,
    `function continueWithinLoop() {
  var result;
  for (var key in [0]) {
    result = "hopla";
    continue;
  }
  return result;
};

assertEquals("hopla", continueWithinLoop());

function breakWithinLoop() {
  var result;
  for (var key in [0]) {
    result = "hopla";
    break;
  }
  return result;
};
`,
    `function foo(a) {
  return (a[0] >>> 0) > 0;
}

var a = new Uint32Array([4]);
var b = new Uint32Array([0x80000000]);
assertTrue(foo(a));
assertTrue(foo(a));
OptimizeFunctionOnNextCall(foo);
assertTrue(foo(b))`,
    `f();
f();`,
    ` new class extends Object {
  constructor() { (() => delete super[super()])(); }
}`,
    `(function sloppyPackedArguments() {
  function f(a) {
    for (var i = 0; i < 2; i++) {
      a[i] = 0;
    }
  }
  var boom;
  function g() {
    var a = arguments;
    f(a);
    boom = a[5];
    assertEquals(undefined, boom);
  }

  f([]);
  g(1);
})();

(function strictPackedArguments() {
  "use strict";
  function f(a) {
    for (var i = 0; i < 2; i++) {
      a[i] = 0;
    }
  }
  var boom;
  function g() {
    var a = arguments;
    f(a);
    boom = a[5];
    assertEquals(undefined, boom);
  }

  f([]);
  g(1);
})();`,
    `function foo(x) {
  x = x | 2147483648;
  return Number.parseInt(x + 65535, 8);
}`,
    `(function() { ((s = 17, y = s) => s)() })();`,
    `function function_with_n_strings(n) {
  var source = '(function f(){';
  for (var i = 0; i < n; i++) {
    if (i != 0) source += ';';
    source += '"x"';
  }
  source += '})()';
  eval(source);
}

var i;
for (i = 500; i < 600; i++) {
  function_with_n_strings(i);
}
for (i = 1100; i < 1200; i++) {
  function_with_n_strings(i);
}`,
    `function f(a) {
  a.foo = {};
  a[0] = 1;
  a.__defineGetter__('foo', function() {});
  a[0] = {};
  a.bar = 0;
}
f(new Array());`,
    `var i = 500000
var a = new Array(i)
for (var j = 0; j < i; j++) { var o = {}; o.x = 42; delete o.x; a[j] = o; }`,
    `function foo(a) {
  a++;
  a = Math.max(0, a);
  a++;
  return a;
}

foo(0);
foo(0);`,
    `testEscapes("\\/\\/\\/\\/", new RegExp("\\//\\//"));
testEscapes("(?:)", new RegExp(""));

// Read-only property.
var r = /\/\//;
testEscapes("\\/\\/", r);
r.source = "garbage";
testEscapes("\\/\\/", r);`,
    `{
  const o = {
    get foo() { return 666 },
    foo: 42,
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').value);
}

{
  const o = {
    set foo(_) { },
    foo: 42,
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').value);
}

{
  const o = {
    get foo() { return 666 },
    set foo(_) { },
    foo: 42,
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').value);
}

{
  const o = {
    get foo() { return 666 },
    set ['foo'.slice()](_) { },
    foo: 42,
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').value);
}

{
  const o = {
    get ['foo'.slice()]() { return 666 },
    set ['foo'.slice()](_) { },
    foo: 42,
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').value);
}


// Data property first.

{
  const o = {
    foo: 666,
    get foo() { return 42 },
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').get());
}

{
  const o = {
    foo: 666,
    set foo(_) { },
  };
  assertEquals(undefined, Object.getOwnPropertyDescriptor(o, 'foo').get);
  assertEquals(undefined, Object.getOwnPropertyDescriptor(o, 'foo').value);
}

{
  const o = {
    foo: 666,
    get foo() { return 42 },
    set foo(_) { },
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').get());
}

{
  const o = {
    foo: 666,
    get ['foo'.slice()]() { return 42 },
    set foo(_) { },
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').get());
}

{
  const o = {
    foo: 666,
    get ['foo'.slice()]() { return 42 },
    set ['foo'](_) { },
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').get());
}


// Data property in the middle.

{
  const o = {
    get foo() { return 42 },
    foo: 666,
    set foo(_) { },
  };
  assertEquals(undefined, Object.getOwnPropertyDescriptor(o, 'foo').get);
  assertEquals(undefined, Object.getOwnPropertyDescriptor(o, 'foo').set());
}

{
  const o = {
    set foo(_) { },
    foo: 666,
    get foo() { return 42 },
  };
  assertEquals(42, Object.getOwnPropertyDescriptor(o, 'foo').get());
}`,
    `() => (([b = !b]) => { })([])`,
    `assertTrue(/(?:text)/.test("text"));
assertEquals(["text"], /(?:text)/.exec("text"));`,
    `for (var i = 0; i < 10000; i++){
  (i + "\\0").split(/(.)\\1/i);
}

for (var i = 0; i < 10000; i++){
  (i + "\\u1234\\0").split(/(.)\\1/i);
}`,
    '//foo!@#^&$1234\nbar;',
    '/* abcd!@#@$* { } && null*/;',
    '/*foo\nbar*/;',
    '/*x*x*/;',
    '/**/;',
    'x;',
    '_x;',
    'xyz;',
    '$x;',
    'x5;',
    'x_y;',
    'x1y1z1;',
    'f\\u00d8\\u00d8bar;',
    '5.5;',
    '0.001;',
    '55.55e10;',
    '0x01;',
    '0x1234ABCD;',
    '"!@#$%^&*()_+{}[]";',
    '"\\u0001";',
    '"\\x55";',
    '/a/;',
    '/abc/;',
    '/foo(.*)/g;',
    '[\n\f\r\t\u0020];',
    '[1];',
    `function v_2(
      v_3 = class v_4 {
          get [[] = ';']() { }
      }
      ) { }
      v_2();

      // Test object inside a class in a parameter list
      (function f(
      v_3 = class v_4 {
          get [{} = ';']() { }
      }
      ) { })();

      // Test destructuring of class in parameters
      (function f( {p, q} = class C { get [[] = ';']() {} } ) {})();

      // Test array destructuring of class in parameters
      class C {};
      C[Symbol.iterator] = function() {
        return {
          next: function() { return { done: true }; },
          _first: true
        };
      };
      (function f1([p, q] = class D extends C { get [[]]() {} }) { })();`,
    `(({x = {} = {}}) => {})({});

      // ... and without the parens.
      let a0 = ({x = {} = {}}) => {};
      a0({});`,
    `global_side_assignment = undefined;
      (({x = {myprop: global_side_assignment} = {myprop: 2115}}) => {
        assertEquals(3000, x);
        called = true;
      })({x: 3000});
      assertTrue(called);
      // Global side assignment doesn't happen, since the default value was not used.
      assertEquals(undefined, global_side_assignment);

      // Different kinds of lazy arrow functions (it's actually a bit weird that the
      // above functions are lazy, since they are parenthesized).
      called = false;
      global_side_assignment = undefined;
      let a1 = ({x = {myprop: global_side_assignment} = {myprop: 2115}}) => {
        assertTrue('myprop' in x);
        assertEquals(2115, x.myprop);
        called = true;
      }
      a1({});
      assertTrue(called);
      assertEquals(2115, global_side_assignment);

      called = false;
      global_side_assignment = undefined;
      let a2 = ({x = {myprop: global_side_assignment} = {myprop: 2115}}) => {
        assertEquals(3000, x);
        called = true;
      }
      a2({x: 3000});
      assertTrue(called);
      assertEquals(undefined, global_side_assignment);

      // We never had a problem with non-arrow functions, but testing them too for
      // completeness.
      called = false;
      global_side_assignment = undefined;
      function f1({x = {myprop: global_side_assignment} = {myprop: 2115}}) {
        assertTrue('myprop' in x);
        assertEquals(2115, x.myprop);
        assertEquals(2115, global_side_assignment);
        called = true;
      }
      f1({});
      assertTrue(called);
      assertEquals(2115, global_side_assignment);

      called = false;
      global_side_assignment = undefined;
      function f2({x = {myprop: global_side_assignment} = {myprop: 2115}}) {
        assertEquals(3000, x);
        called = true;
      }
      f2({x: 3000});
      assertTrue(called);
      assertEquals(undefined, global_side_assignment);`,
    `(function testVariableDeclarationsFunction() {
        'use strict';
        var a = function(){};
        assertEquals('a', a.name);
        let b = () => {};
        assertEquals('b', b.name);
        const c = ((function(){}));
        assertEquals('c', c.name);

        var x = function(){}, y = () => {}, z = function withName() {};
        assertEquals('x', x.name);
        assertEquals('y', y.name);
        assertEquals('withName', z.name);
      })();
      (function testVariableDeclarationsClass() {
        'use strict';
        var a = class {};
        assertEquals('a', a.name);
        let b = ((class {}));
        assertEquals('b', b.name);
        // Should not overwrite name property.
        const c = class { static name() { } }
        assertEquals('function', typeof c.name);

        var x = class {}, y = class NamedClass {};
        assertEquals('x', x.name);
        assertEquals('NamedClass', y.name);
      })();

      (function testObjectProperties() {
        'use strict';
        var obj = {
          a: function() {},
          b: () => {},
          c() { },
          get d() { },
          set d(val) { },
          x: function withName() { },
          y: class { },
          z: class ClassName { },
          ''() {},
          42: function() {},
          4.2: function() {},
        };
        assertEquals('a', obj.a.name);
        assertEquals('b', obj.b.name);
        assertEquals('c', obj.c.name);
        var dDescriptor = Object.getOwnPropertyDescriptor(obj, 'd');
        assertEquals('get d', dDescriptor.get.name);
        assertEquals('set d', dDescriptor.set.name);
        assertEquals('withName', obj.x.name);
        assertEquals('y', obj.y.name);
        assertEquals('ClassName', obj.z.name);
        assertEquals('', obj[''].name);
        assertEquals('42', obj[42].name);
        assertEquals('4.2', obj[4.2].name);
        assertEquals('', obj.__proto__.name);
      })();

      (function testClassProperties() {
        'use strict';
        class C {
          a() { }
          static b() { }
          get c() { }
          set c(val) { }
          ''() { }
          static ''() { }
          42() { }
          static 43() { }
          get 44() { }
          set 44(val) { }
          static get constructor() { }
          static set constructor(val) { }
        };

        assertEquals('a', C.prototype.a.name);
        assertEquals('b', C.b.name);
        var descriptor = Object.getOwnPropertyDescriptor(C.prototype, 'c');
        assertEquals('get c', descriptor.get.name);
        assertEquals('set c', descriptor.set.name);
        assertEquals('', C.prototype[''].name);
        assertEquals('', C[''].name);
        assertEquals('42', C.prototype[42].name);
        assertEquals('43', C[43].name);
        var descriptor = Object.getOwnPropertyDescriptor(C.prototype, '44');
        assertEquals('get 44', descriptor.get.name);
        assertEquals('set 44', descriptor.set.name);
        var descriptor = Object.getOwnPropertyDescriptor(C, 'constructor');
        assertEquals('get constructor', descriptor.get.name);
        assertEquals('set constructor', descriptor.set.name);
      })();

      (function testComputedProperties() {
        'use strict';
        var a = 'a';
        var b = 'b';
        var sym1 = Symbol('1');
        var sym2 = Symbol('2');
        var sym3 = Symbol('3');
        var symNoDescription = Symbol();
        var proto = "__proto__";
        var obj = {
          ['']: function() {},
          [a]: function() {},
          [sym1]: function() {},
          [sym2]: function withName() {},
          [symNoDescription]: function() {},
          [proto]: function() {},

          get [sym3]() {},
          set [b](val) {},
        };

        assertEquals('', obj[''].name);
        assertEquals('a', obj[a].name);
        assertEquals('[1]', obj[sym1].name);
        assertEquals('withName', obj[sym2].name);
        assertEquals('', obj[symNoDescription].name);
        assertEquals('__proto__', obj[proto].name);

        assertEquals('get [3]', Object.getOwnPropertyDescriptor(obj, sym3).get.name);
        assertEquals('set b', Object.getOwnPropertyDescriptor(obj, 'b').set.name);

        var objMethods = {
          ['']() {},
          [a]() {},
          [sym1]() {},
          [symNoDescription]() {},
          [proto]() {},
        };

        assertEquals('', objMethods[''].name);
        assertEquals('a', objMethods[a].name);
        assertEquals('[1]', objMethods[sym1].name);
        assertEquals('', objMethods[symNoDescription].name);
        assertEquals('__proto__', objMethods[proto].name);

        class C {
          ['']() { }
          static ''() {}
          [a]() { }
          [sym1]() { }
          static [sym2]() { }
          [symNoDescription]() { }

          get [sym3]() { }
          static set [b](val) { }
        }

        assertEquals('', C.prototype[''].name);
        assertEquals('', C[''].name);
        assertEquals('a', C.prototype[a].name);
        assertEquals('[1]', C.prototype[sym1].name);
        assertEquals('[2]', C[sym2].name);
        assertEquals('', C.prototype[symNoDescription].name);

        assertEquals('get [3]', Object.getOwnPropertyDescriptor(C.prototype, sym3).get.name);
        assertEquals('set b', Object.getOwnPropertyDescriptor(C, 'b').set.name);
      })();


      (function testAssignment() {
        var basicFn, arrowFn, generatorFn, classLit;

        basicFn = function() { return true; };
        assertEquals('basicFn', basicFn.name);
        var basicFn2 = basicFn;
        assertEquals('basicFn', basicFn2.name);
        basicFn = function functionWithName() { };
        assertEquals("functionWithName", basicFn.name);

        arrowFn = x => x;
        assertEquals('arrowFn', arrowFn.name);
        var arrowFn2 = arrowFn;
        assertEquals('arrowFn', arrowFn2.name);

        generatorFn = function*() { yield true; };
        assertEquals('generatorFn', generatorFn.name);
        var generatorFn2 = generatorFn;
        assertEquals('generatorFn', generatorFn2.name);
        generatorFn = function* generatorWithName() { };
        assertEquals("generatorWithName", generatorFn.name);

        classLit = class { constructor() {} };
        assertEquals('classLit', classLit.name);
        var classLit2 = classLit;
        assertEquals('classLit', classLit2.name);
        classLit = class classWithName { constructor() {} };
        assertEquals('classWithName', classLit.name);
        classLit = class { constructor() {} static name() {} };
        assertEquals('function', typeof classLit.name);
        classLit = class { constructor() {} static get name() { return true; } };
        assertTrue(classLit.name);
        classLit = class { constructor() {} static ['name']() {} };
        assertEquals('function', typeof classLit.name);
        classLit = class { constructor() {} static get ['name']() { return true; } };
        assertTrue(classLit.name);
      })();
      (function testObjectBindingPattern() {
        var {
          a = function() {},
          b = () => {},
          x = function withName() { },
          y = class { },
          z = class ClassName { },
          q = class { static name() { return 42 } },
          foo: bar = function() {},
          inParens = (() => {}),
          inManyParens = ((((() => {})))),
        } = {};
        assertEquals('a', a.name);
        assertEquals('b', b.name);
        assertEquals('withName', x.name);
        assertEquals('y', y.name);
        assertEquals('ClassName', z.name);
        assertEquals('function', typeof q.name);
        assertEquals('bar', bar.name);
        assertEquals('inParens', inParens.name)
        assertEquals('inManyParens', inManyParens.name)
      })();

      (function testArrayBindingPattern() {
        var [
          a = function() {},
          b = () => {},
          x = function withName() { },
          y = class { },
          z = class ClassName { },
          q = class { static name() { return 42 } },
          inParens = (() => {}),
          inManyParens = ((((() => {})))),
        ] = [];
        assertEquals('a', a.name);
        assertEquals('b', b.name);
        assertEquals('withName', x.name);
        assertEquals('y', y.name);
        assertEquals('ClassName', z.name);
        assertEquals('function', typeof q.name);
        assertEquals('inParens', inParens.name)
        assertEquals('inManyParens', inManyParens.name)
      })();

      (function testObjectAssignmentPattern() {
        var a, b, x, y, z, q;
        ({
          a = function() {},
          b = () => {},
          x = function withName() { },
          y = class { },
          z = class ClassName { },
          q = class { static name() { return 42 } },
          foo: bar = function() {},
          inParens = (() => {}),
          inManyParens = ((((() => {})))),
        } = {});
        assertEquals('a', a.name);
        assertEquals('b', b.name);
        assertEquals('withName', x.name);
        assertEquals('y', y.name);
        assertEquals('ClassName', z.name);
        assertEquals('function', typeof q.name);
        assertEquals('bar', bar.name);
        assertEquals('inParens', inParens.name)
        assertEquals('inManyParens', inManyParens.name)
      })();

      (function testArrayAssignmentPattern() {
        var a, b, x, y, z, q;
        [
          a = function() {},
          b = () => {},
          x = function withName() { },
          y = class { },
          z = class ClassName { },
          q = class { static name() { return 42 } },
          inParens = (() => {}),
          inManyParens = ((((() => {})))),
        ] = [];
        assertEquals('a', a.name);
        assertEquals('b', b.name);
        assertEquals('withName', x.name);
        assertEquals('y', y.name);
        assertEquals('ClassName', z.name);
        assertEquals('function', typeof q.name);
        assertEquals('inParens', inParens.name)
        assertEquals('inManyParens', inManyParens.name)
      })();

      (function testParameterDestructuring() {
        (function({ a = function() {},
                    b = () => {},
                    x = function withName() { },
                    y = class { },
                    z = class ClassName { },
                    q = class { static name() { return 42 } },
                    foo: bar = function() {},
                    inParens = (() => {}),
                    inManyParens = ((((() => {})))) }) {
          assertEquals('a', a.name);
          assertEquals('b', b.name);
          assertEquals('withName', x.name);
          assertEquals('y', y.name);
          assertEquals('ClassName', z.name);
          assertEquals('function', typeof q.name);
          assertEquals('bar', bar.name);
          assertEquals('inParens', inParens.name)
          assertEquals('inManyParens', inManyParens.name)
        })({});

        (function([ a = function() {},
                    b = () => {},
                    x = function withName() { },
                    y = class { },
                    z = class ClassName { },
                    q = class { static name() { return 42 } },
                    inParens = (() => {}),
                    inManyParens = ((((() => {})))) ]) {
          assertEquals('a', a.name);
          assertEquals('b', b.name);
          assertEquals('withName', x.name);
          assertEquals('y', y.name);
          assertEquals('ClassName', z.name);
          assertEquals('function', typeof q.name);
          assertEquals('inParens', inParens.name)
          assertEquals('inManyParens', inManyParens.name)
        })([]);
      })();

      (function testDefaultParameters() {
        (function(a = function() {},
                  b = () => {},
                  x = function withName() { },
                  y = class { },
                  z = class ClassName { },
                  q = class { static name() { return 42 } },
                  inParens = (() => {}),
                  inManyParens = ((((() => {}))))) {
          assertEquals('a', a.name);
          assertEquals('b', b.name);
          assertEquals('withName', x.name);
          assertEquals('y', y.name);
          assertEquals('ClassName', z.name);
          assertEquals('function', typeof q.name);
          assertEquals('inParens', inParens.name)
          assertEquals('inManyParens', inManyParens.name)
        })();
      })();

      (function testComputedNameNotShared() {
        function makeClass(propName) {
          return class {
            static [propName]() {}
          }
        }

        var sym1 = Symbol('1');
        var sym2 = Symbol('2');
        var class1 = makeClass(sym1);
        assertEquals('[1]', class1[sym1].name);
        var class2 = makeClass(sym2);
        assertEquals('[2]', class2[sym2].name);
        assertEquals('[1]', class1[sym1].name);
      })();


      (function testComputedNamesOnlyAppliedSyntactically() {
        function factory() { return () => {}; }

        var obj = { ['foo']: factory() };
        assertEquals('', obj.foo.name);
      })();


      (function testNameNotReflectedInToString() {
        var f = function () {};
        var g = function* () {};
        var obj = {
          ['h']: function () {},
          i: () => {}
        };
        assertEquals('function () {}', f.toString());
        assertEquals('function* () {}', g.toString());
        assertEquals('function () {}', obj.h.toString());
        assertEquals('() => {}', obj.i.toString());
      })();

      (function testClassNameOrder() {
        assertEquals(['length', 'prototype'], Object.getOwnPropertyNames(class {}));

        var tmp = {'': class {}};
        var Tmp = tmp[''];
        assertEquals(['length', 'prototype', 'name'], Object.getOwnPropertyNames(Tmp));

        var name = () => '';
        var tmp = {[name()]: class {}};
        var Tmp = tmp[name()];
        assertEquals(['length', 'prototype', 'name'], Object.getOwnPropertyNames(Tmp));

        class A { }
        assertEquals(['length', 'prototype', 'name'], Object.getOwnPropertyNames(A));

        class B { static foo() { } }
        assertEquals(['length', 'prototype', 'foo', 'name'], Object.getOwnPropertyNames(B));

        class C { static name() { } static foo() { } }
        assertEquals(['length', 'prototype', 'name', 'foo'], Object.getOwnPropertyNames(C));
      })();

      (function testStaticName() {
        class C { static name() { return 42; } }
        assertEquals(42, C.name());
        assertEquals(undefined, new C().name);

        class D { static get name() { return 17; } }
        assertEquals(17, D.name);
        assertEquals(undefined, new D().name);

        var c = class { static name() { return 42; } }
        assertEquals(42, c.name());
        assertEquals(undefined, new c().name);

        var d = class { static get name() { return 17; } }
        assertEquals(17, d.name);
        assertEquals(undefined, new d().name);
      })();

      (function testNonStaticName() {
        class C { name() { return 42; } }
        assertEquals('C', C.name);
        assertEquals(42, new C().name());

        class D { get name() { return 17; } }
        assertEquals('D', D.name);
        assertEquals(17, new D().name);

        var c = class { name() { return 42; } }
        assertEquals('c', c.name);
        assertEquals(42, new c().name());

        var d = class { get name() { return 17; } }
        assertEquals('d', d.name);
        assertEquals(17, new d().name);
      })();`,
    `(function TestObjectLiteralPattern() {
        var { x : x, y : y, get, set } = { x : 1, y : 2, get: 3, set: 4 };
        assertEquals(1, x);
        assertEquals(2, y);
        assertEquals(3, get);
        assertEquals(4, set);

        var {z} = { z : 3 };
        assertEquals(3, z);


        var sum = 0;
        for (var {z} = { z : 3 }; z != 0; z--) {
          sum += z;
        }
        assertEquals(6, sum);


        var log = [];
        var o = {
          get x() {
            log.push("x");
            return 0;
          },
          get y() {
            log.push("y");
            return {
              get z() { log.push("z"); return 1; }
            }
          }
        };
        var { x : x0, y : { z : z1 }, x : x1 } = o;
        assertSame(0, x0);
        assertSame(1, z1);
        assertSame(0, x1);
        assertArrayEquals(["x", "y", "z", "x"], log);
      }());


      (function TestObjectLiteralPatternInitializers() {
        var { x : x, y : y = 2 } = { x : 1 };
        assertEquals(1, x);
        assertEquals(2, y);

        var {z = 3} = {};
        assertEquals(3, z);

        var sum = 0;
        for (var {z = 3} = {}; z != 0; z--) {
          sum += z;
        }
        assertEquals(6, sum);

        var log = [];
        var o = {
          get x() {
            log.push("x");
            return undefined;
          },
          get y() {
            log.push("y");
            return {
              get z() { log.push("z"); return undefined; }
            }
          }
        };
        var { x : x0 = 0, y : { z : z1 = 1}, x : x1 = 0} = o;
        assertSame(0, x0);
        assertSame(1, z1);
        assertSame(0, x1);
        assertArrayEquals(["x", "y", "z", "x"], log);
      }());


      (function TestObjectLiteralPatternLexicalInitializers() {
        'use strict';
        let { x : x, y : y = 2 } = { x : 1 };
        assertEquals(1, x);
        assertEquals(2, y);

        let {z = 3} = {};
        assertEquals(3, z);

        let log = [];
        let o = {
          get x() {
            log.push("x");
            return undefined;
          },
          get y() {
            log.push("y");
            return {
              get z() { log.push("z"); return undefined; }
            }
          }
        };

        let { x : x0 = 0, y : { z : z1 = 1 }, x : x1 = 5} = o;
        assertSame(0, x0);
        assertSame(1, z1);
        assertSame(5, x1);
        assertArrayEquals(["x", "y", "z", "x"], log);

        let sum = 0;
        for (let {x = 0, z = 3} = {}; z != 0; z--) {
          assertEquals(0, x);
          sum += z;
        }
        assertEquals(6, sum);
      }());
      (function TestObjectLiteralPatternLexical() {
        'use strict';
        let { x : x, y : y } = { x : 1, y : 2 };
        assertEquals(1, x);
        assertEquals(2, y);

        let {z} = { z : 3 };
        assertEquals(3, z);

        let log = [];
        let o = {
          get x() {
            log.push("x");
            return 0;
          },
          get y() {
            log.push("y");
            return {
              get z() { log.push("z"); return 1; }
            }
          }
        };
        let { x : x0, y : { z : z1 }, x : x1 } = o;
        assertSame(0, x0);
        assertSame(1, z1);
        assertSame(0, x1);
        assertArrayEquals(["x", "y", "z", "x"], log);

        let sum = 0;
        for (let {x, z} = { x : 0, z : 3 }; z != 0; z--) {
          assertEquals(0, x);
          sum += z;
        }
        assertEquals(6, sum);
      }());
      `,
    `(function testExpressionTypes() {
        "use strict";
        ((x, y = x) => assertEquals(42, y))(42);

        ((x, y = (x)) => assertEquals(42, y))(42);
        ((x, y = x = x + 1) => assertEquals(43, y))(42);
        ((x, y = x()) => assertEquals(42, y))(() => 42);
        ((x, y = new x()) => assertEquals(42, y.z))(function() { this.z = 42 });
        ((x, y = -x) => assertEquals(-42, y))(42);
        ((x, y = ++x) => assertEquals(43, y))(42);
        ((x, y = x === 42) => assertTrue(y))(42);
        ((x, y = (x == 42 ? x : 0)) => assertEquals(42, y))(42);

        ((x, y = function() { return x }) => assertEquals(42, y()))(42);
        ((x, y = () => x) => assertEquals(42, y()))(42);

        // Literals
        ((x, y = {z: x}) => assertEquals(42, y.z))(42);
        ((x, y = {[x]: x}) => assertEquals(42, y[42]))(42);
        ((x, y = [x]) => assertEquals(42, y[0]))(42);
        ((x, y = [...x]) => assertEquals(42, y[0]))([42]);

        ((x, y = class {
          static [x]() { return x }
        }) => assertEquals(42, y[42]()))(42);
        ((x, y = (new class {
          z() { return x }
        })) => assertEquals(42, y.z()))(42);

        ((x, y = (new class Y {
          static [x]() { return x }
          z() { return Y[42]() }
        })) => assertEquals(42, y.z()))(42);

        ((x, y = (new class {
          constructor() { this.z = x }
        })) => assertEquals(42, y.z))(42);
        ((x, y = (new class Y {
          constructor() { this.z = x }
        })) => assertEquals(42, y.z))(42);

        ((x, y = (new class extends x {
        })) => assertEquals(42, y.z()))(class { z() { return 42 } });

        // Defaults inside destructuring
        ((x, {y = x}) => assertEquals(42, y))(42, {});
        ((x, [y = x]) => assertEquals(42, y))(42, []);
      })();


      (function testMultiScopeCapture() {
        "use strict";
        var x = 1;
        {
          let y = 2;
          ((x, y, a = x, b = y) => {
            assertEquals(3, x);
            assertEquals(3, a);
            assertEquals(4, y);
            assertEquals(4, b);
          })(3, 4);
        }
      })();


      (function testSuper() {
        "use strict";
        class A {
          x() { return 42; }
        }

        class B extends A {
          y() {
            ((q = super.x()) => assertEquals(42, q))();
          }
        }

        new B().y();

        class C {
          constructor() { return { prop: 42 } }
        }

        class D extends C{
          constructor() {
            ((q = super()) => assertEquals(42, q.prop))();
          }
        }

        new D();
      })();


      (function testScopeFlags() {
        ((x, y = eval('x')) => assertEquals(42, y))(42);
        ((x, {y = eval('x')}) => assertEquals(42, y))(42, {});
      })();`,
    '({x:5,y:6});',
    '[1,2,3,,,];',
    '({ set y(a) {1;} });',
    '({ get x() {42;} });',
    'o.m;',
    "o['n']['m'];",
    'o.n.m;',
    'o.if;',
    'f();',
    "o['m']();",
    'o.m(x);',
    "o['m'](x);",
    'o.m(x,y);',
    "o['m'](x,y);",
    'f(x)(y);',
    "eval('x');",
    "(eval)('x');",
    "(1,eval)('x');",
    'eval(x,y);',
    'new o.m(x,y);',
    'new o.m;',
    'x ++;',
    'x--;',
    'delete x;',
    '++ /* comment */ x;',
    'x /* comment */ ++;',
    'x ++;',
    '!x;',
    'x, y;',
    'new\nX',
    '+x++;',
    '1 / 2;',
    '1 * 2 + 3;',
    'x<=y;',
    'x|y;',
    'x<y?z:w;',
    'x += y;',
    'x |= y;',
    '{x;y;};',
    '{x;};',
    '{};',
    'var x=1,y=2;',
    '\n;',
    '5;',
    'if (c) x; else y;',
    'if (c) x;',
    'if (c) {} else {};',
    'if (c1) if (c2) s1; else s2;',
    'do { s; } while (e);',
    'do s; while (e);',
    'while (e) { s; };',
    'for (;c;x++) x;',
    'for (i;i<len;++i){};',
    'for (var x in a){};',
    'for (x in a, b, c);',
    'somewhere:while(true)break somewhere;',
    'while(true)break;',
    'while(true)continue /* comment */ ;',
    'while(true)continue \n;',
    'function f(){return;}',
    'class X { static y() {} }',
    'function f(){return 0;}',
    'function f(){return 0 + \n 1;}',
    'switch (e) { case x: s1; case y: s2; };',
    'foo : x;',
    'try { s1; } catch (e) { s2; } finally { s3; };',
    'foo;bar;',
    'foo;',
    'foo',
    'foo\nbar',
    '\\u{65}xxx',
    'xxx\\u0065',
    'xxx\\u0065xxx',
    '\\u0065xxx',
    'this',
    'pa\\u0073s();',
    'null',
    'x;"foo"',
    '123',
    '0o123',
    'this',
    'a/b',
    'let foo, bar;',
    'let foo, bar',
    'let foo = bar;',
    // 'let\nfoo()',
    'let [,foo] = arr;',
    'let [foo,,bar] = arr;',
    'let foo = arr, [bar] = arr2;',
    'let {x} = obj;',
    'for (let [,foo] = arr;;);',
    'for (let {x} = a, obj;;);',
    'for (let x = a, {y} = obj;;);',
    'for (let {x = y} = obj;;);',
    'for (let {x} in obj);',
    'for (let [...[foo, bar]] of obj);',
    'for (let {[x]: y} of obj);',
    'for (let {a, [x]: y} of obj);',
    'typeof x + typeof y',
    'typeof a.b\n/foo',
    'typeof a.b\n/foo/g',
    'void a\n/foo/g',
    'a=b\n++c',
    '{b\n++c};',
    'let {x : y = z} = obj;',
    'let [] = x;',
    'let [foo] = arr;',
    'try { s1; } catch (e) { s2; };',
    'debugger;',
    'function f(x,y) { var z; return x; };',
    'function f(x) { e; return x; };',
    'var x; function f(){;}; null;',
    '{ x; y; z; }',
    'x;\n/*foo*/\n\t;',
    'while(true)continue \n foo;',
    'var x; { 1 \n 2 } 3',
    'function f(){return\nfoo;}',
    'while(true)continue /* wtf \n busta */ foo;',
    'function foo(a,a){}',
    '/* */',
    '/abc/g/*f*/\n\t',
    '/abc/g//f',
    'for (x;function(){ a\nb };z) x;',
    'd\nd()',
    'trimLeft = /^\\s+/;\n\ttrimRight = /\\s+$/;',
    '({get:5});',
    'l !== "px" && (d.style(h, c, (k || 1) + l), j = (k || 1) / f.cur() * j, d.style(h, c, j + l)), i[1] && (k = (i[1] === "-=" ? -1 : 1) * k + j), f.custom(j, k, l)',
    'c:a:while(true){continue a}',
    'function f(){return c}',
    'this.charsX = Gui.getSize(this.textarea).w / this.fontSize.w;',
    'x=y.a/z;',
    '(x)/ (y);',
    '+{x:/y/};',
    'if(/x/)y;',
    '{/foo/}',
    'if(x){/foo/;}',
    ';/x/;',
    '[/x/];',
    'x=x,x=/y/;',
    'x=x,/y/;',
    'x?/y/:z;',
    'x?y:/z/;',
    '/=/;',
    'function f(){ return /foo/; }',
    'switch(x){}/foo/;',
    'function x(){}/foo/;',
    'try{}catch(e){}/foo/;',
    'try{}finally{}/foo/;',
    'throw /foo/;',
    '(x)\n/y;',
    'x\n/y/\nz;',
    'n = 1\n/1*"\\/\\//.test(n + \'"//\')',
    '{x;/x/;}',
    'if(x)/y/;;',
    'for(;;)/y/;',
    'for(/x/;;);',
    'for(;/x/;);',
    'for(;;/x/);',
    'for(/x/;;/x/);',
    'for(/x/;/x/;/x/);',
    'for(x in y)/y/;',
    'for(var a=/x/ in y)/y/;',
    'for(x in /y/)/z/;',
    'function f(){return /foo/;}',
    'do{}while(/foo/);',
    'if(x)y;else /z/;',
    'foo:/bar/;',
    '!++foo;',
    'for(var i=x?y:z;;);',
    'switch(x){case 1,2:}',
    'X/R>=0',
    'a/*\n*/b;',
    '/**/',
    '//\nfoo;',
    'for (x in y=(a?b:c))z;',
    'x?y:z=5;',
    'for(x=5;;);',
    'for(x in y)foo:continue;',
    'while(true)continue\nx;',
    '{while(true)continue}',
    'function f(){return\nx;}',
    '.0',
    'function f(){}/1/;',
    'for(;function(){}/1;)break',
    'var x=\n/5/',
    'var x=5\n/5',
    'for (a.x.y in b);',
    'for (a([x in y]).b in c);',
    'for (var a=f({k:x in y}) in b);',
    'for (((a[x])) in b);',
    'for ((x = [x in y]).foo in z);',
    'for ((x = {x:x in y}).bar in z);',
    'for (var a=b in c ? d : e in f);',
    "for (var a='5' in {key:5} ? 5 : bar in {key:5});",
    'for (var a=b?c:d in e in f);',
    'for (var a=b=c in d);',
    'for (new a().b in c);',
    'for (undefined in {});',
    'new A().b = c;',
    'new A()[b] = c;',
    'new A.B().b = c;',
    'new A[B]().b = c;',
    '(new A().b) = c;',
    '(new A.B().b) = c;',
    '(new A[B]().b) = c;',
    '(new A[B]()[b]) = c;',
    '(new A.B[B]().b) = c;',
    'foo:foobar:x;',
    'bar:foobar:x;',
    'foobar:foo:x;',
    'foobar:bar:x;',
    'a:break a;',
    'a:for(;;)for(;;)continue a;',
    'a:for(;;)for(;;)break a;',
    'a:{switch(1){case 1:break a;}}',
    'a:{for(;;)break a;}',
    // 'var\u1680x;',
    // 'var\u180ex;',
    // 'var\u2000x;',
    'function f(){return foo\n/bar/g}',
    'function f(){}\n/bar/',
    'function f(){}\n/bar/g',
    'f=function(){}\n/bar/g',
    'foo:for(;;)break foo\n/bar/',
    'foo:for(;;)break foo\n/bar/g',
    'foo:for(;;)continue foo\n/bar/',
    'foo:for(;;)continue foo\n/bar/g',
    'do{}while(x)\n/foo/;',
    'do{}while(x)\n/foo/g;',
    '({get if(){}})',
    '({set while(x){}})',
    '({get false(){}})',
    '({set true(x){}})',
    "a?'b'.c:d;",
    'a\n.1;',
    'debugger\n/foo/;',
    '/foo/\n--x',
    '/foo/g\n--x',
    '/foo/\n++x',
    '/foo/g\n++x',
    '.5+/=>>>=ex/g/bar--;',
    '/foo/',
    '(a)',
    'a.b',
    '[a]',
    'new[]',
    'new a',
    '++a',
    'a++',
    '--a',
    'a--',
    '!a',
    '~a',
    '1 - 2',
    '/p/;',
    'for (var {a, b} in c);',
    'a = { get: 1 }',
    // 'T‌',
    'a: while (true) { break a }',
    `var a;
    if (b()) {
        new a(1);
    } else {
        a(2);
    }`,
    'a: for(;;) continue a;',
    `c: {
      a();
      switch (1) {
        case 2:
          b();
          if (a) break c;
          d();
        case 3+4:
          e();
          break;
        default:
          f();
      }
  }`,
    'function *a(){yield/=3/}',
    '"use\\x20strict"; with (a) b = c;',
    '(1, a.a)();',
    '[...a] = b',
    `var a, b, c, d;
    a = (b(), c(), d()) ? 1 : 2;`,
    'let {a:{}} = 1',
    'new (function () { var a = 1; });',
    'function a(){return {} / 1}',
    'var [a]=[1];',
    'void /test/',
    '(function a({ b: { c, a }, d: [e, f] }, ...[b, d, g]){})',
    '({ __proto__: null, get __proto__(){} })',
    '!function(){a()}(),!function(){b()}(),c()+1',
    'function a(b, ...c) { }',
    'a();',
    'for (var [a, b] in c);',
    'class a { ; }',
    'class X { static x() {} }',
    'abc\nfunction foo() {}',
    'async\nfunction\nfoo() {}',
    "'foo\\'bar'",
    'await +123',
    `if (x) {
      foo();
  }

  if (x) {
      foo();
  } else {
      baz();
  }

  if (x) {
      foo();
  } else if (y) {
      bar();
  } else {
      baz();
  }

  if (x) {
      if (y) {
          foo();
      } else {
          bar();
      }
  } else {
      baz();
  }

  if (x) {
      foo();
  } else if (y) {
      bar();
  } else if (z) {
      baz();
  } else {
      moo();
  }

  function f() {
      if (x) {
          foo();
      }
      if (x) {
          foo();
      } else {
          baz();
      }
      if (x) {
          foo();
      } else if (y) {
          bar();
      } else {
          baz();
      }
      if (x) {
          if (y) {
              foo();
          } else {
              bar();
          }
      } else {
          baz();
      }
      if (x) {
          foo();
      } else if (y) {
          bar();
      } else if (z) {
          baz();
      } else {
          moo();
      }
  }`,
    `if (x) foo();

  if (x) foo(); else baz();

  if (x) foo(); else if (y) bar(); else baz();

  if (x) if (y) foo(); else bar(); else baz();

  if (x) foo(); else if (y) bar(); else if (z) baz(); else moo();

  function f() {
      if (x) foo();
      if (x) foo(); else baz();
      if (x) foo(); else if (y) bar(); else baz();
      if (x) if (y) foo(); else bar(); else baz();
      if (x) foo(); else if (y) bar(); else if (z) baz(); else moo();
  }`,
    `if (x) foo();
  if (x) foo(); else baz();
  if (x) foo(); else if (y) bar(); else baz();
  if (x) if (y) foo(); else bar(); else baz();
  if (x) foo(); else if (y) bar(); else if (z) baz(); else moo();
  function f() {
  if (x) foo();
  if (x) foo(); else baz();
  if (x) foo(); else if (y) bar(); else baz();
  if (x) if (y) foo(); else bar(); else baz();
  if (x) foo(); else if (y) bar(); else if (z) baz(); else moo();
  }`,
    `function f(x) {
    return function() {
        function n(a) {
            return a * a;
        }
        return x(n);
    };
}

function g(op) {
    return op(1) + op(2);
}

console.log(f(g)() == 5);`,
    `"use strict";

var foo = function foo(x) {
  return "foo " + x;
};
console.log(foo("bar"));

//# sourceMappingURL=simple.js.map`,
    `function bar(x) {
  var triple = x * (2 + 1);
  return triple;
}`,
    `function baz(x) {
  var half = x / 2;
  return half;
}`,
    '/*!one\r\n2\r\n3*///comment\r\nfunction f(x) {\r\n if (x)\r\n//comment\r\n  return 3;\r\n}\r\n',
    '/*!one\r2\r3*///comment\rfunction f(x) {\r if (x)\r//comment\r  return 3;\r}\r',
    'function eval() { function a() { "use strict" } }',
    'function f() { { { var x; } let x; } }',
    'function g() { { var x; let x; } }',
    `var x = bar(1+2);
var y = baz(3+9);
print('q' + 'u' + 'x', x, y);
foo(5+6);`,
    `function f() {
  "aaaaaaaaaa";
  var o = {
      prop: 1,
      _int: 2,
  };
  return o.prop + o._int;
}`,
    `var Foo = function Foo(){console.log(1+2);}; new Foo();`,
    `function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i]}return arr2}else{return Array.from(arr)}}var _require=require("bar"),foo=_require.foo;var _require2=require("world"),hello=_require2.hello;foo.x.apply(foo,_toConsumableArray(foo.y(hello.z)));`,
    `function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require("bar"),
    foo = _require.foo;

var _require2 = require("world"),
    hello = _require2.hello;

foo.x.apply(foo, _toConsumableArray(foo.y(hello.z)));`,
    `var assert = require("assert");
var UglifyJS = require("../..");

describe("let", function() {
    this.timeout(30000);
    it("Should not produce reserved keywords as variable name in mangle", function() {
        // Produce a lot of variables in a function and run it through mangle.
        var s = '"dddddeeeeelllllooooottttt"; function foo() {';
        for (var i = 0; i < 18000; i++) {
            s += "var v" + i + "=0;";
        }
        s += '}';
        var result = UglifyJS.minify(s, {
            compress: false
        }).code;

        // Verify that select keywords and reserved keywords not produced
        [
            "do",
            "let",
            "var",
        ].forEach(function(name) {
            assert.strictEqual(result.indexOf("var " + name + "="), -1);
        });

        // Verify that the variable names that appeared immediately before
        // and after the erroneously generated variable name still exist
        // to show the test generated enough symbols.
        [
            "to", "eo",
            "eet", "fet",
            "rar", "oar",
        ].forEach(function(name) {
            assert.notStrictEqual(result.indexOf("var " + name + "="), -1);
        });
    });
    it("Should quote mangled properties that are reserved keywords", function() {
        var s = '"rrrrrnnnnniiiiiaaaaa";';
        for (var i = 0; i < 18000; i++) {
            s += "v.b" + i + ";";
        }
        var result = UglifyJS.minify(s, {
            compress: false,
            ie8: true,
            mangle: {
                properties: true,
            }
        }).code;
        [
            "in",
            "var",
        ].forEach(function(name) {
            assert.notStrictEqual(result.indexOf(name), -1);
            assert.notStrictEqual(result.indexOf('v["' + name + '"]'), -1);
        });
    });
});`,
    `var assert = require("assert");
var UglifyJS = require("../node");

describe("Number literals", function() {
    it("Should not allow legacy octal literals in strict mode", function() {
        var inputs = [
            '"use strict";00;',
            '"use strict"; var foo = 00;'
        ];
        var test = function(input) {
            return function() {
                UglifyJS.parse(input);
            }
        };
        var error = function(e) {
            return e instanceof UglifyJS.JS_Parse_Error
                && e.message === "Legacy octal literals are not allowed in strict mode";
        };
        for (var i = 0; i < inputs.length; i++) {
            assert.throws(test(inputs[i]), error, inputs[i]);
        }
    });
});`,
    `function foo() { 0003; }`,
    '"\\76";',
    '"\\0"',
    '"\\008"',
    '"\\0008"',
    '"use\\\n strict";\n"\\07";',

    'function test() {"use strict"; 0o0; }',
    '0o2',
    '0O12',
    '(eval = 10) => 42',
    'eval => 42',
    'do foo\nwhile(0)',
    'function foo(y) {} / 100 /',
    'var x = 1;',
    'arguments => 42',
    'f = ([,] = g()) => {};',
    `var C = class { async *gen() {
      yield [...yield];
  }}`,
    '({}?0:1)&&x();',
    '(function(){}).name;',
    '++a + + --b',
    '++a + ++b',
    '++a+ ++b',
    '++a + --b',
    '++a+--b',
    '++a + b',
    '++a+b',
    '++a + b--',
    '++a+b--',
    '++a + b++',
    '++a+b++',
    '++a + + ++b',
    '++a+ + ++b',
    '++a + + --b',
    '++a+ +--b',
    '++a + + b',
    '++a+ +b',
    '++a + + b--',
    '++a+ +b--',
    '++a + + b++',
    '++a+ +b++',
    '++a + - ++b',
    '++a+-++b',
    '++a + - --b',
    '++a+- --b',
    '++a + - b',
    '++a+-b',
    '++a + - b--',
    '++a+-b--',
    '++a + - b++',
    '++a+-b++',
    '++a - ++b',
    '++a-++b',
    '++a - --b',
    '++a- --b',
    '++a - b',
    '++a-b',
    '++a - b--',
    '++a-b--',
    '++a - b++',
    '++a-b++',
    '++a - + ++b',
    '++a-+ ++b',
    '++a - + --b',
    '++a-+--b',
    '++a - + b',
    '++a-+b',
    '++a - + b--',
    '++a-+b--',
    '++a - + b++',
    '++a-+b++',
    '++a - - ++b',
    '++a- -++b',
    '++a - - --b',
    '++a- - --b',
    '++a - - b',
    '++a- -b',
    '++a - - b--',
    '++a- -b--',
    '++a - - b++',
    '++a- -b++',
    '--a + ++b',
    '--a+ ++b',
    '--a + --b',
    '--a+--b',
    '--a + b',
    '--a+b',
    '--a + b--',
    '--a+b--',
    '--a + b++',
    '--a+b++',
    '--a + + ++b',
    '--a+ + ++b',
    '--a + + --b',
    '--a+ +--b',
    '--a + + b',
    '--a+ +b',
    '--a + + b--',
    '--a+ +b--',
    '--a + + b++',
    '--a+ +b++',
    '--a + - ++b',
    '--a+-++b',
    '--a + - --b',
    '--a+- --b',
    '--a + - b',
    '--a+-b',
    '--a + - b--',
    '--a+-b--',
    '--a + - b++',
    '--a+-b++',
    '--a - ++b',
    '--a-++b',
    '--a - --b',
    '--a- --b',
    '--a - b',
    '--a-b',
    '--a - b--',
    '--a-b--',
    '--a - b++',
    '--a-b++',
    '--a - + ++b',
    '--a-+ ++b',
    '--a - + --b',
    '--a-+--b',
    '--a - + b',
    '--a-+b',
    '--a - + b--',
    '--a-+b--',
    '--a - + b++',
    '--a-+b++',
    '--a - - ++b',
    '--a- -++b',
    '--a - - --b',
    '--a- - --b',
    '--a - - b',
    '--a- -b',
    '--a - - b--',
    '--a- -b--',
    '--a - - b++',
    '--a- -b++',
    'a + ++b',
    'a+ ++b',
    'a + --b',
    'a+--b',
    'a + b',
    'a+b',
    'a + b--',
    'a+b--',
    'a + b++',
    'a+b++',
    'a + + ++b',
    'a+ + ++b',
    'a + + --b',
    'a+ +--b',
    'a + + b',
    'a+ +b',
    'a + + b--',
    'a+ +b--',
    'a + + b++',
    'a+ +b++',
    'a + - ++b',
    'a+-++b',
    'a + - --b',
    'a+- --b',
    'a + - b',
    'a+-b',
    'a + - b--',
    'a+-b--',
    'a + - b++',
    'a+-b++',
    'a - ++b',
    'a-++b',
    'a - --b',
    'a- --b',
    'a - b',
    'a-b',
    'a - b--',
    'a-b--',
    'a - b++',
    'a-b++',
    'a - + ++b',
    'a-+ ++b',
    'a - + --b',
    'a-+--b',
    'a - + b',
    'a-+b',
    'a - + b--',
    'a-+b--',
    'a - + b++',
    'a-+b++',
    'a - - ++b',
    'a- -++b',
    'a - - --b',
    'a- - --b',
    'a - - b',
    'a- -b',
    'a - - b--',
    'a- -b--',
    'a - - b++',
    'a- -b++',
    'a-- + ++b',
    'a--+ ++b',
    'a-- + --b',
    'a--+--b',
    'a-- + b',
    'a--+b',
    'a-- + b--',
    'a--+b--',
    'a-- + b++',
    'a--+b++',
    'a-- + + ++b',
    'a--+ + ++b',
    'a-- + + --b',
    'a--+ +--b',
    'a-- + + b',
    'a--+ +b',
    'a-- + + b--',
    'a--+ +b--',
    'a-- + + b++',
    'a--+ +b++',
    'a-- + - ++b',
    'a--+-++b',
    'a-- + - --b',
    'a--+- --b',
    'a-- + - b',
    'a--+-b',
    'a-- + - b--',
    'a--+-b--',
    'a-- + - b++',
    'a--+-b++',
    'a-- - ++b',
    'a---++b',
    'a-- - --b',
    'a--- --b',
    'a-- - b',
    'a---b',
    'a-- - b--',
    'a---b--',
    'a-- - b++',
    'a---b++',
    'a-- - + ++b',
    'a---+ ++b',
    'a-- - + --b',
    'a---+--b',
    'a-- - + b',
    'a---+b',
    'a-- - + b--',
    'a---+b--',
    'a-- - + b++',
    'a---+b++',
    'a-- - - ++b',
    'a--- -++b',
    'a-- - - --b',
    'a--- - --b',
    'a-- - - b',
    'a--- -b',
    'a-- - - b--',
    'a--- -b--',
    'a-- - - b++',
    'a--- -b++',
    'a++ + ++b',
    'a+++ ++b',
    'a++ + --b',
    'a+++--b',
    'a++ + b',
    'a+++b',
    'a++ + b--',
    'a+++b--',
    'a++ + b++',
    'a+++b++',
    'a++ + + ++b',
    'a+++ + ++b',
    'a++ + + --b',
    'a+++ +--b',
    'a++ + + b',
    'a+++ +b',
    'a++ + + b--',
    'a+++ +b--',
    'a++ + + b++',
    'a+++ +b++',
    'a++ + - ++b',
    'a+++-++b',
    'a++ + - --b',
    'a+++- --b',
    'a++ + - b',
    'a+++-b',
    'a++ + - b--',
    'a+++-b--',
    'a++ + - b++',
    'a+++-b++',
    'a++ - ++b',
    'a++-++b',
    'a++ - --b',
    'a++- --b',
    'a++ - b',
    'a++-b',
    'a++ - b--',
    'a++-b--',
    'a++ - b++',
    'a++-b++',
    'a++ - + ++b',
    'a++-+ ++b',
    'a++ - + --b',
    'a++-+--b',
    'a++ - + b',
    'a++-+b',
    'a++ - + b--',
    'a++-+b--',
    'a++ - + b++',
    'a++-+b++',
    'a++ - - ++b',
    'a++- -++b',
    'a++ - - --b',
    'a++- - --b',
    'a++ - - b',
    'a++- -b',
    'a++ - - b--',
    'a++- -b--',
    'a++ - - b++',
    'a++- -b++',
    '+ ++a + ++b',
    '+ ++a+ ++b',
    '+ ++a + --b',
    '+ ++a+--b',
    '+ ++a + b',
    '+ ++a+b',
    '+ ++a + b--',
    '+ ++a+b--',
    '+ ++a + b++',
    '+ ++a+b++',
    '+ ++a + + ++b',
    '+ ++a+ + ++b',
    '+ ++a + + --b',
    '+ ++a+ +--b',
    '+ ++a + + b',
    '+ ++a+ +b',
    '+ ++a + + b--',
    '+ ++a+ +b--',
    '+ ++a + + b++',
    '+ ++a+ +b++',
    '+ ++a + - ++b',
    '+ ++a+-++b',
    '+ ++a + - --b',
    '+ ++a+- --b',
    '+ ++a + - b',
    '+ ++a+-b',
    '+ ++a + - b--',
    '+ ++a+-b--',
    '+ ++a + - b++',
    '+ ++a+-b++',
    '+ ++a - ++b',
    '+ ++a-++b',
    '+ ++a - --b',
    '+ ++a- --b',
    '+ ++a - b',
    '+ ++a-b',
    '+ ++a - b--',
    '+ ++a-b--',
    '+ ++a - b++',
    '+ ++a-b++',
    '+ ++a - + ++b',
    '+ ++a-+ ++b',
    '+ ++a - + --b',
    '+ ++a-+--b',
    '+ ++a - + b',
    '+ ++a-+b',
    '+ ++a - + b--',
    '+ ++a-+b--',
    '+ ++a - + b++',
    '+ ++a-+b++',
    '+ ++a - - ++b',
    '+ ++a- -++b',
    '+ ++a - - --b',
    '+ ++a- - --b',
    '+ ++a - - b',
    '+ ++a- -b',
    '+ ++a - - b--',
    '+ ++a- -b--',
    '+ ++a - - b++',
    '+ ++a- -b++',
    '+ --a + ++b',
    '+--a+ ++b',
    '+ --a + --b',
    '+--a+--b',
    '+ --a + b',
    '+--a+b',
    '+ --a + b--',
    '+--a+b--',
    '+ --a + b++',
    '+--a+b++',
    '+ --a + + ++b',
    '+--a+ + ++b',
    '+ --a + + --b',
    '+--a+ +--b',
    '+ --a + + b',
    '+--a+ +b',
    '+ --a + + b--',
    '+--a+ +b--',
    '+ --a + + b++',
    '+--a+ +b++',
    '+ --a + - ++b',
    '+--a+-++b',
    '+ --a + - --b',
    '+--a+- --b',
    '+ --a + - b',
    '+--a+-b',
    '+ --a + - b--',
    '+--a+-b--',
    '+ --a + - b++',
    '+--a+-b++',
    '+ --a - ++b',
    '+--a-++b',
    '+ --a - --b',
    '+--a- --b',
    '+ --a - b',
    '+--a-b',
    '+ --a - b--',
    '+--a-b--',
    '+ --a - b++',
    '+--a-b++',
    '+ --a - + ++b',
    '+--a-+ ++b',
    '+ --a - + --b',
    '+--a-+--b',
    '+ --a - + b',
    '+--a-+b',
    '+ --a - + b--',
    '+--a-+b--',
    '+ --a - + b++',
    '+--a-+b++',
    '+ --a - - ++b',
    '+--a- -++b',
    '+ --a - - --b',
    '+--a- - --b',
    '+ --a - - b',
    '+--a- -b',
    '+ --a - - b--',
    '+--a- -b--',
    '+ --a - - b++',
    '+--a- -b++',
    '+ a + ++b',
    '+a+ ++b',
    '+ a + --b',
    '+a+--b',
    '+ a + b',
    '+a+b',
    '+ a + b--',
    '+a+b--',
    '+ a + b++',
    '+a+b++',
    '+ a + + ++b',
    '+a+ + ++b',
    '+ a + + --b',
    '+a+ +--b',
    '+ a + + b',
    '+a+ +b',
    '+ a + + b--',
    '+a+ +b--',
    '+ a + + b++',
    '+a+ +b++',
    '+ a + - ++b',
    '+a+-++b',
    '+ a + - --b',
    '+a+- --b',
    '+ a + - b',
    '+a+-b',
    '+ a + - b--',
    '+a+-b--',
    '+ a + - b++',
    '+a+-b++',
    '+ a - ++b',
    '+a-++b',
    '+ a - --b',
    '+a- --b',
    '+ a - b',
    '+a-b',
    '+ a - b--',
    '+a-b--',
    '+ a - b++',
    '+a-b++',
    '+ a - + ++b',
    '+a-+ ++b',
    '+ a - + --b',
    '+a-+--b',
    '+ a - + b',
    '+a-+b',
    '+ a - + b--',
    '+a-+b--',
    '+ a - + b++',
    '+a-+b++',
    '+ a - - ++b',
    '+a- -++b',
    '- a++ - - b--',
    '-a++- -b--',
    '- a++ - - b++',
    '-a++- -b++',
    `class C { async *gen() {
    yield {
        ...yield,
        y: 1,
        ...yield yield,
      };
}}`,
    `var C = class { static async *gen() {
    yield {
        ...yield,
        y: 1,
        ...yield yield,
      };
}}`,
    '(eval, a) => 42',
    '(x => x)',
    'x => y => 42',
    '(x) => ((y, z) => (x, y, z))',
    'foo(() => {})',
    'class A { foo() {} get foo() {} }',
    'class Semicolon { ; }',
    '({[x]: 10})',
    '({["x" + "y"]: 10})',
    '({[x]: function() {}})',
    '({[x]: 10, y: 20})',
    '({get [x]() {}, set [x](v) {}})',
    'function x(a, { a }){}',
    'function x({ a: { w, x }, b: [y, z] }, ...[a, b, c]){}',
    '(function x(...[ a, b ]){})',
    '(function x({ a: { w, x }, b: [y, z] }, ...[a, b, c]){})',
    '({ x({ a: { w, x }, b: [y, z] }, ...[a, b, c]){} })',
    '(...[a, b]) => {}',
    '(a, ...[b]) => {}',
    'var ℘;',
    '004',
    '077',
    '00',
    '05',
    '078',
    '0708',
    '019',
    '0719',
    'var x = 42;',
    'var x = function () { this.foo = 42 };',
    '"use strict"; while (true) { let x; this, arguments; }',
    'while (true) { this.f() }',
    'this.foo();',
    '"use strict"; if (foo()) { let x; this.f() }',
    'function foo(x, y) { return x + y; }',
    'with ({}) { block; }',
    '  try {} catch(e) { block; }',
    'var arguments',
    'var foo, eval;',
    'try { } catch (eval) { }',
    'try { } catch (arguments) { }',
    'function foo(arguments) { }',
    'eval = 1;',
    'var foo = eval = 1;',
    '++arguments;',
    'arguments++',
    'var yield;',
    'var foo, yield;',
    'try { } catch (yield) { }',
    'function yield() { }',
    '(function yield() { })',
    'function foo(yield) { }',
    'function foo(bar, yield) { }',
    'yield = 1;',
    'var foo = yield = 1;',
    'yield * 2;',
    '++yield;',
    'yield++;',
    'yield: 34',
    'function yield(yield) { yield: yield (yield + yield(0)); }',
    '({ yield: 1 })',
    '({ get yield() { 1 } })',
    'yield(100)',
    'yield[100]',
    'function not_gen() {var yield;}',
    'function not_gen() {var foo, yield;}',
    'function not_gen() {try { } catch (yield) { }}',
    'function not_gen() {function yield() {}}',
    'function not_gen() {(function yield() { })}',
    'function not_gen() {function foo(yield) { }}',
    'function not_gen() {function foo(bar, yield) { }}',
    'function not_gen() {yield = 1;}',
    'function not_gen() { var foo = yield = 1;}',
    '(function not_gen() {yield * 2;})',
    '(function not_gen() {++yield;})',
    '(function not_gen() {yield++;})',
    '(function not_gen() {function yield(yield) { yield: yield (yield + yield(0)); }})',
    '(function not_gen() {({ yield: 1 })})',
    '(function not_gen() {({ get yield() { 1 } })})',
    '(function not_gen() {yield(100)})',
    '(function not_gen() {yield[100]})',
    'function * gen() { function not_gen() {var yield;} }',
    'function * gen() { function not_gen() {var foo, yield;} }',
    'function * gen() { function not_gen() {try { } catch (yield) { }} }',
    'function * gen() { function not_gen() {function yield() { }} }',
    'function * gen() { function not_gen() {(function yield() { })} }',
    'function * gen() { function not_gen() {function foo(yield) { }} }',
    'function * gen() { function not_gen() {function foo(bar, yield) { }} }',
    'function * gen() { function not_gen() {function * yield() { }} }',
    '(function * gen() { (function not_gen() {yield = 1;}) })',
    '(function * gen() { (function not_gen() {var foo = yield = 1;}) })',
    '(function * gen() { (function not_gen() {yield * 2;}) })',
    '(function * gen() { (function not_gen() {++yield;}) })',
    '(function * gen() { (function not_gen() {yield++;}) })',
    '(function * gen() { (function not_gen() {yield: 34}) })',
    '(function * gen() { (function not_gen() {function yield(yield) { yield: yield (yield + yield(0)); }}) })',
    '(function * gen() { (function not_gen() {({ yield: 1 })}) })',
    '(function * gen() { (function not_gen() {({ get yield() { 1 } })}) })',
    '(function * gen() { (function not_gen() {yield(100)}) })',
    '(function * gen() { (function not_gen() {yield[100]}) })',
    'function * gen() {yield yield 1;}',
    'function * gen() {yield * yield * 1;}',
    'function * gen() {yield 3 + (yield 4);}',
    'function * gen() {yield * 3 + (yield * 4);}',
    'function * gen() {(yield * 3) + (yield * 4);}',
    'function * gen() {({ yield: 1 })}',
    'function * gen() {({ get yield() { } })}',
    // And in assignment pattern computed properties
    'function * gen() {({ [yield]: x } = { })}',
    // Yield without RHS.
    'function * gen() {yield /* comment */}',
    'function * gen() {yield // comment\n}',
    '(function * () {(yield)})',
    '(function * () {[yield]})',
    '(function * () {{yield}})',
    // If there is a newline before the next token, we don't look for RHS.
    '(function * () {yield\nfor (;;) {}})',
    '(function * () {x = class extends (yield) {}})',
    '(function * () {x = class extends f(yield) {}})',
    '(function * () {x = class extends (null, yield) { }})',
    '(function * () {x = class extends (a ? null : yield) { }})',
    'let foo; ',
    'let foo = 0; ',
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
    'function* foo() {}; ',
    'async function foo() {}; ',
    'class foo {}; ',
    'class foo extends null {}; ',
    'function bar() {foo = 42}; ext(bar); ext(foo)',
    'ext(function() {foo++}); ext(foo)',
    'bar = () => --foo; ext(bar); ext(foo)',
    'function* bar() {eval(ext)}; ext(bar); ext(foo)',
    '',
    "'use strict';(function(...args){ return args;})",
    "'use strict';(function(a, ...args){ return args;})",
    "'use strict';(function(...   args){ return args;})",
    "'use strict';(function(a, ...   args){ return args;})",
    "'use strict';(function(...\targs){ return args;})",
    "'use strict';(function(a, ...\targs){ return args;})",
    "'use strict';(function(...\r\nargs){ return args;})",
    "'use strict';(function(a, ...\r\nargs){ return args;})",
    "'use strict';(function(...\rargs){ return args;})",
    "'use strict';(function(a, ...\rargs){ return args;})",
    "'use strict';(function(...\t\n\t\t\n  args){ return args;})",
    "'use strict';(function(a, ...  \n  \n  args){ return args;})",
    "'use strict';(function(...{ length, 0: a, 1: b}){ return args;})",
    "'use strict';(function(...{}){ return args;})",
    "'use strict';(function(...[a, b]){ return args;})",
    "'use strict';(function(...[]){ return args;})",
    'function f() {} function f() {}',
    'function foo() {function  a(b,) {}}',
    'function foo() {function* a(b,) {}}',
    'my_var;',
    'if (true) { let my_var; } my_var;',
    "eval('foo');",
    'function inner2() { my_var; }',
    "function inner2() { eval('foo'); }",
    'var {my_var : a} = {my_var};',
    'let {my_var : a} = {my_var};',
    'const {my_var : a} = {my_var};',
    'var [a, b = my_var] = [1, 2];',
    'var [a, b = my_var] = [1, 2]; my_var;',
    'let [a, b = my_var] = [1, 2];',
    'let [a, b = my_var] = [1, 2]; my_var;',
    'const [a, b = my_var] = [1, 2];',
    'const [a, b = my_var] = [1, 2]; my_var;',
    'var {a = my_var} = {}',
    'var {a: b = my_var} = {}',
    'let {a = my_var} = {}',
    'let {a: b = my_var} = {}',
    'const {a = my_var} = {}',
    'const {a: b = my_var} = {}',
    'a = my_var',
    '',
    'a = my_var',
    'let my_var;',
    'function inner2(a = my_var) { }',
    '(a = my_var) => { }',
    'function inner2({a} = {a: my_var}) { }',
    '[a] = [my_var]',
    '',
    `//////////////////////////////////////////////////////////////////////////////
    //CHECK#1
    if (!__func("A","B",1,2)) {
      $ERROR('#1: Since arguments property has attribute { DontDelete }, but elements of arguments can be deleted');
    }
    //
    //////////////////////////////////////////////////////////////////////////////`,
    'function inner2([a] = [my_var]) { }',
    'const NORMAL_ZERO = "function f() { return arguments; }";',
    'if (typeof(o) != "undefined" && o !== null) {}',
    'if (self === null || self === undefined) { self = {}; }',
    '(function f() { function arguments() {}; arguments = 3; assertEq(arguments, 3) })();',
    '(function f() { arguments = 3; function arguments() {}; assertEq(arguments, 3) })();',
    '([a] = [my_var]) => { }',
    `x = 0;
    y = 1;
    result = (x / y);
    check = 0;
    if(result != check) { fail(test, check, result); } ++test;

    // Test 1: both arguments constants
    result = (0 / 1)
    check = 0
    if(result != check) {{ fail(test, check, result); }} ++test; `,
    `// Test 0: both arguments variables
    x = 0.4;
    y = 0;
    result = (x >> y);
    check = 0;
    if(result != check) { fail(test, check, result); } ++test;

    // Test 1: both arguments constants
    result = (0.4 >> 0)
    check = 0
    if(result != check) {{ fail(test, check, result); }} ++test; `,
    "function inner2(a = eval('')) { }",
    'result = (0.4 >>> 0)',
    'result = (4n >>> 0)',
    'result = (4n >>> 0n)',
    'result = (4 >>> 0n)',
    'result = (0 >>> 0)',
    '1n',
    `var scenario = [
      ["Assign to Arguments", "arguments=1"],
      ["Post ++   Arguments", "arguments++"],
      ["Post --   Arguments", "arguments--"],
      ["Pre  ++   Arguments", "++arguments"],
      ["Pre  --   Arguments", "--arguments"]
  ];

  var count = 0;

  (function test1() {
      write("Changing Arguments...");

      for (var i=0;i<scenario.length;++i) {
          var str = "function f" + i + "() { " + scenario[i][1] + "; }";
          try {
              eval(str);
          } catch (e) {
              write("Exception: " + str + " :: " + scenario[i][0]);
              continue;
          }
          write("Return: " + str + " :: " + scenario[i][0]);
      }
  })();`,
    "write('f1      : ' + Array.prototype.join.call(arguments) + '. x:' + x + ' y:' + y + ' z:' + z);",
    '(a, b) => a - 2*b',
    "(a = eval('')) => { }",
    `[
      {
        "this": "Object {...}",
        "arguments": "Object {...}",
        "locals": {
          "a": "undefined undefined"
        }
      },
      {
        "this": "Object {...}",
        "arguments": "Object {...}",
        "functionCallsReturn": {
          "[Date returned]": "string <large string>"
        },
        "locals": {
          "a": "string <large string>"
        }
      },
      {
        "this": "Object {...}",
        "arguments": "Object {...}",
        "[Return value]": "undefined undefined",
        "functionCallsReturn": {
          "[Echo returned]": "undefined undefined",
          "[SetTimeout returned]": "number 1"
        },
        "locals": {
          "a": "string <large string>"
        }
      },
      {
        "this": "Object {...}",
        "arguments": "Object {...}",
        "locals": {
          "arr": "undefined undefined",
          "str": "undefined undefined",
          "str1": "undefined undefined"
        }
      },
      {
        "this": "Object {...}",
        "arguments": "Object {...}",
        "functionCallsReturn": {
          "[Array returned]": "Array [a,b]"
        },
        "locals": {
          "arr": "Array [a,b]",
          "str": "undefined undefined",
          "str1": "undefined undefined"
        }
      },
      {
        "this": "Object {...}",
        "arguments": "Object {...}",
        "functionCallsReturn": {
          "[push returned]": "number 3"
        },
        "locals": {
          "arr": "Array [a,b,c]",
          "str": "undefined undefined",
          "str1": "undefined undefined"
        }
      },
      {
        "this": "Object {...}",
        "arguments": "Object {...}",
        "functionCallsReturn": {
          "[join returned]": "string a,b,c"
        },
        "locals": {
          "arr": "Array [a,b,c]",
          "str": "string a,b,c",
          "str1": "undefined undefined"
        }
      },
      {
        "this": "Object {...}",
        "arguments": "Object {...}",
        "functionCallsReturn": {
          "[Array.prototype.ucase returned]": "undefined undefined"
        },
        "locals": {
          "arr": "Array [A,B,C]",
          "str": "string a,b,c",
          "str1": "undefined undefined"
        }
      },
      {
        "this": "Object {...}",
        "arguments": "Object {...}",
        "[Return value]": "undefined undefined",
        "functionCallsReturn": {
          "[join returned]": "string A,B,C"
        },
        "locals": {
          "arr": "Array [A,B,C]",
          "str": "string a,b,c",
          "str1": "string All caps A,B,C"
        }
      }
    ]`,
    'try { } catch (my_var) { } my_var;',
    'for (my_var in {}) { my_var; }',
    'for (my_var in {}) { }',
    'for (my_var of []) { my_var; }',
    'for (my_var of []) { }',
    'for ([a, my_var, b] in {}) { my_var; }',
    'for ([a, my_var, b] of []) { my_var; }',
    'for ({x: my_var} in {}) { my_var; }',
    'for ({x: my_var} of []) { my_var; }',
    'for ({my_var} in {}) { my_var; }',
    'for ({my_var} of []) { my_var; }',
    'for ({y, x: my_var} in {}) { my_var; }',
    'for ({y, x: my_var} of []) { my_var; }',
    'for ({a, my_var} in {}) { my_var; }',
    'for ({a, my_var} of []) { my_var; }',
    'for (let my_var in {}) { } my_var;',
    'for (let my_var of []) { } my_var;',
    'for (let [a, my_var, b] in {}) { } my_var;',
    'for (let [a, my_var, b] of []) { } my_var;',
    'for (let {x: my_var} in {}) { } my_var;',
    'for (let {x: my_var} of []) { } my_var;',
    'for (let {my_var} in {}) { } my_var;',
    'for (let {my_var} of []) { } my_var;',
    'for (let {y, x: my_var} in {}) { } my_var;',
    'for (let {y, x: my_var} of []) { } my_var;',
    'for (let {a, my_var} in {}) { } my_var;',
    'for (let {a, my_var} of []) { } my_var;',
    'for (let my_var = 0; my_var < 1; ++my_var) { } my_var;',
    "'use strict'; if (true) { function my_var() {} } my_var;",
    'function inner2(a = my_var) {}',
    'function inner2(a = my_var) { let my_var; }',
    '(a = my_var) => {}',
    '(a = my_var) => { let my_var; }',
    'var my_var; my_var;',
    'var my_var;',
    'var my_var = 0;',
    'if (true) { var my_var; } my_var;',
    'let my_var; my_var;',
    'let my_var;',
    'let my_var = 0;',
    'const my_var = 0; my_var;',
    'const my_var = 0;',
    'echo(a2, arguments[0], typeof arguments, typeof f1);',
    'f2("a2");',
    '[].push.apply(this, arguments);',
    `function bar(){
      return (arguments[0] == 1 &&
           arguments[1] == 2 &&
           arguments[2] == "check");
    }`,
    'foo(...a);',
    'A.B.call(this, arguments);',
    `function f() {
      ({a = () => {
          let arguments;
      }} = 1);

      arguments.x;
  }`,
    'test.apply(null, ["val1", "val2", "val3"]);',
    'foo([1]);',
    'const txt = `test0(${Array(limit).fill(0).map((_, i) => i).join(",")})`;',
    ' console.log(`arguments[${limit - 1}] == ${val1}`);',
    'this.p = a ? a : 0;',
    `function safeCall(f) {
    var args = [];
    for (var a = 1; a < arguments.length; ++a)
        args.push(arguments[a]);
        echo(sb.join(""));
    }
`,
    'var [a, my_var] = [1, 2]; my_var;',
    'let [a, my_var] = [1, 2]; my_var;',
    'const [a, my_var] = [1, 2]; my_var;',
    'var {a: my_var} = {a: 3}; my_var;',
    'let {a: my_var} = {a: 3}; my_var;',
    'const {a: my_var} = {a: 3}; my_var;',
    'var {my_var} = {my_var: 3}; my_var;',
    'let {my_var} = {my_var: 3}; my_var;',
    'const {my_var} = {my_var: 3}; my_var;',
    'my_var',
    'my_var;',
    'my_var',
    '',
    'my_var = 5',
    'my_var;',
    'my_var = 5',
    '',
    '[a, my_var, b]',
    'my_var;',
    '[a, my_var, b]',
    '',
    '[a, my_var, b] = [1, 2, 3]',
    'my_var;',
    '[a, my_var, b] = [1, 2, 3]',
    '',
    '{x: my_var}',
    'my_var;',
    '{x: my_var}',
    '',
    '{my_var}',
    'my_var;',
    '{my_var}',
    '',
    `function assert(a, e) {
      if (a !== e)
          throw new Error("Expected: " + e + " but got: " + a);
  }
  function bitAnd(a, b) {
      return a & b;
  }
  noInline(bitAnd);
  var o = { valueOf: () => 0b1101 };
  for (var i = 0; i < 10000; i++)
      assert(bitAnd(0b11, o), 0b1);
  assert(numberOfDFGCompiles(bitAnd) <= 1, true);
  function bitOr(a, b) {
      return a | b;
  }
  noInline(bitOr);
  for (var i = 0; i < 10000; i++)
      assert(bitOr(0b11, o), 0b1111);
  assert(numberOfDFGCompiles(bitOr) <= 1, true);
  function bitXor(a, b) {
      return a ^ b;
  }
  noInline(bitXor);
  for (var i = 0; i < 10000; i++)
      assert(bitXor(0b0011, o), 0b1110);
  assert(numberOfDFGCompiles(bitXor) <= 1, true);`,
    `for (var i = 0; i < 1e6; ++i)
    foo();
for (var i = 0; i < 1e6; ++i)
    shouldBe(get(), 4);
`,
    `function foo() {
      bar = 4;
  }
  function get() {
      return bar;
  }`,
    `var invokeCount = 0;
     Object.defineProperty(Function.prototype, 'prototype', {
         get: function () {
             invokeCount++;
         }
     });
     new Promise(resolve => {
         for (var i = 0; i < 10000; ++i)
             new resolve();
         if (invokeCount != 10000)
             $vm.crash();
     });`,
    `forEach({ length: 5 }, function() {
      for (var i = 0; i < 10; i++) {
          forEach([1], function() {});
      }
  });
  function forEach(a, b) {
      for (var c = 0; c < a.length; c++)
          b();
  }`,
    `function shouldBe(actual, expected)
     {
         if (actual !== expected)
             throw new Error('bad value: ' + actual);
     }
     noInline(shouldBe);
     function test(value)
     {
         return Object.prototype.toString.call(value);
     }
     noInline(test);
     for (var i = 0; i < 1e6; ++i) {
         switch (i % 3) {
         case 0:
             shouldBe(test(null), "[object Null]");
             break;
         case 1:
             shouldBe(test(undefined), "[object Undefined]");
             break;
         case 2:
             shouldBe(test(true), "[object Boolean]");
             break;
         }
     }`,
    `for (var i = 0; i < 1e6; ++i) {
      if (i & 0x1)
          shouldBe(test(null), "[object Null]");
      else
          shouldBe(test(undefined), "[object Undefined]");
  }`,
    `function f(x, y) {
      x.y = y;
  };
  function g(x) {
      return x.y + 42;
  }
  noInline(f);
  noInline(g);
  var x = {};
  var y = {};
  f(x, 42);
  f(y, {});
  while (!numberOfDFGCompiles(g)) {
      optimizeNextInvocation(g);
      if (typeof g(x) !== 'number')
          throw 'failed warming up';
  }
  if (typeof g(y) !== 'string')
      throw 'failed after compilation';`,
    `function __isPropertyOfType(obj, name, type) {
      desc = Object.getOwnPropertyDescriptor(obj, name)
      return typeof type === 'undefined' || typeof desc.value === type;
  }
  function __getProperties(obj, type) {
      let properties = [];
      for (let name of Object.getOwnPropertyNames(obj)) {
          if (__isPropertyOfType(obj, name, type)) properties.push(name);
      }
      let proto = Object.getPrototypeOf(obj);
      while (proto && proto != Object.prototype) {
          Object.getOwnPropertyNames(proto).forEach(name => {
          });
          proto = Object.getPrototypeOf(proto);
      }
      return properties;
  }
  function* __getObjects(root = this, level = 0) {
      if (level > 4) return;
      let obj_names = __getProperties(root, 'object');
      for (let obj_name of obj_names) {
          let obj = root[obj_name];
          yield* __getObjects(obj, level + 1);
      }
  }
  function __getRandomObject() {
      for (let obj of __getObjects()) {
      }
  }
  var theClass = class {
      constructor() {
          if (242487 != null && typeof __getRandomObject() == "object") try {
          } catch (e) {}
      }
  };
  var childClass = class Class extends theClass {
      constructor() {
          var arrow = () => {
              try {
                  super();
              } catch (e) {}
              this.idValue
          };
          arrow()()();
      }
  };
  for (var counter = 0; counter < 1000; counter++) {
      try {
          new childClass();
      } catch (e) {}
  }`,
    `function Hello(y) {
    this.y = y;
    this.x = foo(this.y);
  }
  function foo(z) {
    try {
      for (var i = 0; i < 1; i++) {
        z[i];
      }
    } catch {
    }
  }
  new Hello('a');
  new Hello('a');
  for (let i = 0; i < 100; ++i) {
    new Hello();
  }
  // Busy loop to let the crash reporter have a chance to capture the crash log for the Compiler thread.
  for (let i = 0; i < 1000000; ++i) {
      $vm.ftlTrue();
  }`,
    `function foo(o) {
    for (var i = 0; i < 100; ++i) {
        o.f = o.f;
    }
}
let typedArrays = [
    Uint8Array,
    Uint32Array,
    Uint8Array,
];
for (let constructor of typedArrays) {
    let a = new constructor(0);
    for (let i = 0; i < 10000; i++) {
        foo(a);
    }
}`,
    '[ b, a ] = [ a, b ]',
    `var list = [ 1, 2, 3 ]
var [ a, , b ] = list
[ b, a ] = [ a, b ]`,
    `var obj = { a: 1 }
var list = [ 1 ]
var { a, b = 2 } = obj
var [ x, y = 2 ] = list`,
    `var list = [ 7, 42 ]
var [ a = 1, b = 2, c = 3, d ] = list
a === 7
b === 42
c === 3
d === undefined`,
    `function f ([ name, val ]) {
  console.log(name, val)
}
function g ({ name: n, val: v }) {
  console.log(n, v)
}
function h ({ name, val }) {
  console.log(name, val)
}
f([ "bar", 42 ])
g({ name: "foo", val:  7 })
h({ name: "bar", val: 42 })`,

    'let [a] = [];',

    'let {a:b} = {};',
    'function f([x] = [1]) {};',
    '({f: function({x} = {x: 10}) {}});',
    'f = function({x} = {x: 10}) {};',
    '[a, b] = [b, a];',
    '[ok.v] = 20;',
    'var [x = 10, y, z] = a;',
    '[x = 10, [ z = 10]] = a;',
    'var {x = 10, y = 5, z = 1} = a;',
    'var {x: x = 10, y: y = 10, z: z = 10} = a;',
    'var { x: x = 10 } = x;',
    'var {x, y: y = 10, z} = a;',
    'var {x = 10, y: { z = 10}} = a;',
    'var {x = 10, y: { z }} = a;',
    `function x({a}) {
  try {
    var {b} = a;
  }
  catch([stack]) {
  }
};`,
    '({ responseText: text } = res);',
    'var {x: y, z: { a: b } } = { x: "3", z: { a: "b" } };',
    'function a({x = 10}) {}',
    'function x([ a, b ]){};',
    'function a([x, , [, z]]) {};',
    '(function x({ a, b }){});',
    'function x({ a, b }){};',
    '[a,,b] = array;',
    'var let = a;',
    '(let[a] = b);',
    `(x=1) => x * x;`,
    'for (const {a} of /b/) {}',
    '({ a = 42, [b]: c.d } = e);',
    `const test = ({ t, ...v }) => {
  console.log(t, v);
};`,

    'switch (answer) { case 42: let t = 42; break; }',
    'e => { 42; }',
    'e => ({ property: 42 })',
    '(a, b) => { 42; }',
    '([a, , b]) => 42',
    '(() => {})()',
    '(x=1) => x * x',
    '(a) => 00',
    '(eval = 10) => 42',
    '(eval, a = 10) => 42',
    '(x) => ((y, z) => (x, y, z))',
    'foo((x, y) => {})',
    'x = { method() { } }',
    'x = { method(test) { } }',
    'x = { "method"() { } }',
    'x = { set() { } }',
    'x = { y, z }',
    '[a.r] = b',
    'let [a,,b] = c',
    '({ responseText: text } = res)',
    'const {a} = {}',
    'const [a] = []',
    'let [a] = []',
    'var [a] = []',
    'var {a:b} = {}',
    'class A {get() {}}',
    'class A extends B { static get foo() {}}',
    'class A {set a(v) {}}',
    'class A { static set(v) {};}',
    'class A {*gen(v) { yield v; }}',
    '(class { *static() {} })',
    "class A { get ['constructor']() {} }",
    'class A { foo() {} bar() {}}',
    'class A { get foo() {} set foo(v) {}}',
    'class A { static get foo() {} get foo() {}}',
    'class A { static get foo() {} static set foo(v) {} get foo() {} set foo(v) {}}',
    'var {[x]: y} = {y}',
    'function f({[x]: y}) {}',
    'var x = {*[test]() { yield *v; }}',
    'class A {[x]() {}}',
    'function f([x] = [1]) {}',
    'function f({x} = {x: 10}) {}',
    'f = function({x} = {x: 10}) {}',
    '({f: function({x} = {x: 10}) {}})',
    '({f({x} = {x: 10}) {}})',
    '(class {f({x} = {x: 10}) {}})',
    '(({x} = {x: 10}) => {})',
    'x = function(y = 1) {}',
    'x = { f: function(a=1) {} }',
    'x = { f(a=1) {} }',
    'function f(a, ...b) {}',
    'function x([ a, b ]){}',
    'function x({ a, b }){}',
    '(function x([ a, b ]){})',
    '({ x([ a, b ]){} })',
    '({ a }) => {}',
    '({ a }, ...b) => {}',
    '({ a: [a, b] }, ...c) => {}',
    '({ a: b, c }, [d, e], ...f) => {}',
    '[...a] = b',
    '[a, ...b] = c',
    '[{ a, b }, ...c] = d',
    '[a, ...[b, c]] = d',
    'var [a, ...b] = c',
    'var [{ a, b }, ...c] = d',
    'var [a, ...[b, c]] = d',
    'func(...a)',
    'func(...a, b)',
    '/[a-z]/u',
    'e => yield* 10',
    'var {get} = obj;',
    'var {propName: localVar = defaultValue} = obj',
    'var {propName = defaultValue} = obj',
    'var {get = defaultValue} = obj',
    'var [localVar = defaultValue] = obj',
    '({x = 0} = obj)',
    '({x = 0}) => x',
    '[a, {b: {c = 1}}] = arr',
    'for ({x = 0} in arr);',
    'try {} catch ({message}) {}',
    'class A { static() {} }',
    '`${/\\d/.exec("1")[0]}`',
    'let [x,] = [1]',
    'for (var [name, value] in obj) {}',
    'function foo() { new.target; }',
    '(([,]) => 0)',
    '(x, /y/);',
    'async("foo".bar);',
    'async(a);',
    '(foo[x])',
    '(foo.x)',
    'async (foo = yield) => foo',
    'async (foo = yield)',
    'function foo() { return {arguments} }',
    'function foo() { return {eval} }',
    'function foo() { "use strict"; return {arguments} }',
    'function foo() { return {yield} }',
    'function* foo(a = function*(b) { yield b }) { }',
    'function* foo(a = function* foo() { yield b }) {}',
    'async function f() { for await (x of xs); }',
    'async function f() { for await (var x of xs); }',
    'async function f() { for await (let x of xs); }',
    'async function f() { for\nawait (x of xs); }',
    'f = async function() { for await (x of xs); }',
    'f = async() => { for await (x of xs); }',
    'obj = { async f() { for await (x of xs); } }',
    'class A { async f() { for await (x of xs); } }',
    'for (x of xs);',
    'async function* f() { await a; yield b; }',
    'f = async function*() { await a; yield b; }',
    'obj = { async* f() { await a; yield b; } }',
    'class A { async* f() { await a; yield b; } }',
    'class A { static async* f() { await a; yield b; } }',
    'var gen = { async *method() {} }',
    'function *f(){ async (foo = yield) }',
    'function *f(){ async (foo = yield x) }',
    'async yield => foo',
    'async (yield) => foo',
    'async \n (a, b, c);',
    'async (a, b, c);',
    '(...[destruct]) => x',
    '(...{destruct}) => x',
    'async(...ident) => x',
    'async(...[destruct]) => x',
    'async(...{destruct}) => x',
    'const [a] = b;',
    'function b([a]){};',
    'function b([a] = b){};',
    '([a]) => b;',
    '([a] = b) => c;',
    '[a] = b;',
    '[{x: y.z}]',
    '[{x: y.z}] = a',
    `[x = y]`,
    `[x = y, z]`,
    `[await = x]`,
    `[x = true]`,
    '[{}]',
    '[{}.foo] = x',
    '[{}[foo]] = x',
    `[x]`,
    `[x, y]`,
    `[x = y]`,
    `[x.y]`,
    `[x.y = z]`,
    `[x + y]`,
    `[this]`,
    '([...x]);',
    '([...x, y]);',
    '([...x+y]);',
    '([...x.y] = z)',
    'properties += (prop + "=" + obj[prop] + ";");',
    'while (i++ < 10) ;  // nothing in the body',
    'var kMinRangeLength = 0.0005;',
    'with (b) { f = function(a) { return a*x; } }',
    'for (g in P) {}',
    'var f2 = function () { for (var j = 1; j < 10; ++j) {}  }',
    'function f1() { for (var j in []) {}  }',
    'var f4 = function () { for (var j;;) {}  }',
    "var unevalf = function(x) { return '(' + x.toString() + ')'; }",
    'for (var x in [1,2,3]) {}',
    `function Crash() {
      for (var key in [0]) {
        try { } finally { continue; }
      }
    }`,
    `function Y(x) {
      var slot = "bar";
      return function (a) {
        x.apply(this, arguments);
        return slot === 'bar';
      };
    }`,
    `function Test() {
      var left  = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
      var right = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY";
      for (var i = 0; i < 100000; i++) {
        var cons = left + right;
        var substring = cons.substring(20, 80);
        var index = substring.indexOf('Y');
        assertEquals(34, index);
      }
    }`,
    `for (var i = 1000; i < 1000000; i += 19703) {
      new Array(i);
    }`,
    `function generate(n) {
      var s = '{';
      for (var i = 0; i < n; i++) {
         if (i > 0) s += ', ';
         s += key(random() % 10 + 7);
         s += ':';
         s += value();
      }
      s += '}';
      return s;
    }`,
    `function bar() {
      var __v_45;
        for (__v_45 = 0; __v_45 < 64; __v_63++) {
        }
        for (__v_45 = 0; __v_45 < 128; __v_36++) {
        }
        for (__v_45 = 128; __v_45 < 256; __v_45++) {
        }
      }`,
    `var bar = foo.replace('x', 'y', 'z');`,
    `for (var i = 0; i < 10; i++) { ({})[h]; }`,
    `delete a.__proto__.__proto__[Symbol.iterator];`,
    `f(x=>x, [x,y] = [1,2]);`,
    `[2, 3].reduceRight(non_strict);`,
    `SKIP_STRICT_OUTER = 1 << 1`,
    'if (true) { var arguments; }',
    'var arguments; arguments = 5; function f() { arguments; }',
    'var arguments; function f() { arguments = 5; }',
    'let arguments; function f() { arguments; }',
    'var [var1, var2, [var3, var4]] = [1, 2, [3, 4]];',
    'var [{var1: var2}, {var3: var4}] = [{var1: 1}, {var3: 2}];',
    'var [var1, ...var2] = [1, 2, 3];',
    'var var1; if (true) { var var1; }',
    'var var1; if (true) { let var1; }',
    'let var1; if (true) { let var1; }',
    'var {var1: var2, var3: var4} = {var1: 1, var3: 2};',
    'var {var1: var2, var3: {var4: var5}} = {var1: 1, var3: {var4: 2}};',
    'var {var1: var2, var3: [var4, var5]} = {var1: 1, var3: [2, 3]};',
    'let [var1, var2] = [1, 2];',
    'let [var1, var2, [var3, var4]] = [1, 2, [3, 4]];',
    'let [{var1: var2}, {var3: var4}] = [{var1: 1}, {var3: 2}];',
    'let [var1, ...var2] = [1, 2, 3];',
    'let {var1: var2, var3: var4} = {var1: 1, var3: 2};',
    'let {var1: var2, var3: {var4: var5}} = {var1: 1, var3: {var4: 2}};',
    'let {var1: var2, var3: [var4, var5]} = {var1: 1, var3: [2, 3]};',
    'const [var1, var2] = [1, 2];',
    'const [var1, var2, [var3, var4]] = [1, 2, [3, 4]];',
    'const [{var1: var2}, {var3: var4}] = [{var1: 1}, {var3: 2}];',
    'const [var1, ...var2] = [1, 2, 3];',
    'const {var1: var2, var3: var4} = {var1: 1, var3: 2};',
    'const {var1: var2, var3: {var4: var5}} = {var1: 1, var3: {var4: 2}};',
    'const {var1: var2, var3: [var4, var5]} = {var1: 1, var3: [2, 3]};',
    'function arguments() {} arguments = 8;',
    'function f1() { f1; } f1 = 3;',
    'function f1() {} f1 = 3; function f1() {}',
    "var var1; function f1() { eval(''); }",
    'for (const var1 = 0; var1 < 10; ++var1) { function foo() { var1; } }',
    'for (var var1 = 0; var1 < 10; ++var1) { function foo() { var1; } }',
    'for (let var1 = 0; var1 < 10; ++var1) { function foo() { var1; } }',
    'for (var1 of [1, 2]) { }',
    'function f1() { f1 = 3; }',
    "let var1; function f1() { eval(''); }",
    "const var1 = 10; eval('');",
    'for (var var1 of [1, 2]) { function foo() { var1; } }',
    'for (var1 of [1, 2]) { function foo() { var1; } }',
    'for (var var1 of [1, 2]) { function foo() { var1; } }',
    'for (let var1 of [1, 2]) { function foo() { var1; } }',
    'for (const var1 of [1, 2]) { function foo() { var1; } }',
    'for (var1 of [1, 2]) { function foo() { var1 = 0; } }',
    'for (var var1 of [1, 2]) { function foo() { var1 = 0; } }',
    'for (let var1 of [1, 2]) { function foo() { var1 = 0; } }',
    'for (const var1 of [1, 2]) { function foo() { var1 = 0; } }',
    'for (var1 in {a: 6}) { }',
    'for (var var1 in {a: 6}) { }',
    'for (let var1 in {a: 6}) { }',
    'for (const var1 in {a: 6}) { }',
    'for (var1 in {a: 6}) { var1; }',
    'for (var var1 in {a: 6}) { var1; }',
    'for (let var1 in {a: 6}) { var1; }',
    'for (const var1 in {a: 6}) { var1; }',
    'for (var1 in {a: 6}) { var1 = 0; }',
    'for (var var1 in {a: 6}) { var1 = 0; }',
    'for (let var1 in {a: 6}) { var1 = 0; }',
    'for (const var1 in {a: 6}) { var1 = 0; }',
    'for (var1 in {a: 6}) { function foo() { var1; } }',
    'for (var var1 in {a: 6}) { function foo() { var1; } }',
    'for (let var1 in {a: 6}) { function foo() { var1; } }',
    'for (const var1 in {a: 6}) { function foo() { var1; } }',
    '[var1, [var2, var3], {var4, name5: [var5, var6]}]',
    'try { } catch([var1, var2]) { function f() { var1 = 3; } }',
    'for (var1 in {a: 6}) { function foo() { var1 = 0; } }',
    'for (var var1 in {a: 6}) { function foo() { var1 = 0; } }',
    'for (let var1 in {a: 6}) { function foo() { var1 = 0; } }',
    'for (const var1 in {a: 6}) { function foo() { var1 = 0; } }',
    'for (var1 in {a: 6}) { function foo() { var1 = 0; } }',
    'for (var var1 in {a: 6}) { function foo() { var1 = 0; } }',
    'for (let var1 in {a: 6}) { function foo() { var1 = 0; } }',
    'for (const var1 in {a: 6}) { function foo() { var1 = 0; } }',
    'for ([var1, var2] of [[1, 1], [2, 2]]) { }',
    'for (var [var1, var2] of [[1, 1], [2, 2]]) { }',
    'for (let [var1, var2] of [[1, 1], [2, 2]]) { }',
    'for (const [var1, var2] of [[1, 1], [2, 2]]) { }',
    'for ([var1, var2] of [[1, 1], [2, 2]]) { var2 = 3; }',
    'for (var [var1, var2] of [[1, 1], [2, 2]]) { var2 = 3; }',
    'for (let [var1, var2] of [[1, 1], [2, 2]]) { var2 = 3; }',
    'for (const [var1, var2] of [[1, 1], [2, 2]]) { var2 = 3; }',
    'for ([var1, var2] of [[1, 1], [2, 2]]) { () => { var2 = 3; } }',
    'for (var [var1, var2] of [[1, 1], [2, 2]]) { () => { var2 = 3; } }',
    'for (let [var1, var2] of [[1, 1], [2, 2]]) { () => { var2 = 3; } }',
    'for (const [var1, var2] of [[1, 1], [2, 2]]) { () => { var2 = 3; } }',
    'for (let [var1, var2 = function() { }] of [[1]]) { function f() { var1; } }',
    'for (let [var1, var2 = function() { }] of [[1]]) { function f() {var2; } }',
    'for (let [var1, var2 = function() { }] of [[1]]) { function f() {var1; var2; } }',
    'for (let [var1, var2 = function() { }] of [[1]]) { function f() {var1 = 0; } }',
    'for (let [var1, var2 = function() { }] of [[1]]) { function f() {var2 = 0; } }',
    'for (let [var1, var2 = function() { }] of [[1]]) { function f() {var1 = 0; var2 = 0; } }',
    'for (let [var1, var2 = function() { var1; }] of [[1]]) { function f() { var1; } }',
    'for (let [var1, var2 = function() { var1; }] of [[1]]) { function f() { var2; } }',
    'for (let [var1, var2 = function() { var1; }] of [[1]]) { function f() { var1; var2; } }',
    'for (let [var1, var2 = function() { var2; }] of [[1]]) { function f() { var1; } }',
    'for (let [var1, var2 = function() { var2; }] of [[1]]) { function f() { var2; } }',
    'for (let [var1, var2 = function() { var2; }] of [[1]]) { function f() { var1; var2; } }',
    'var var1 = 0; for ( ; var1 < 2; ++var1) { }',
    'var var1 = 0; for ( ; var1 < 2; ++var1) { function foo() { var1; } }',
    'var var1 = 0; for ( ; var1 > 2; ) { }',
    'var var1 = 0; for ( ; var1 > 2; ) { function foo() { var1; } }',
    'var var1 = 0; for ( ; var1 > 2; ) { function foo() { var1 = 6; } }',
    'var var1 = 0; for(var1; var1 < 2; ++var1) { }',
    'var var1 = 0; for (var1; var1 < 2; ++var1) { function foo() { var1; }}',
    'var var1 = 0; for (var1; var1 > 2; ) { }',
    'var var1 = 0; for (var1; var1 > 2; ) { function foo() { var1; } }',
    'var var1 = 0; for (var1; var1 > 2; ) { function foo() { var1 = 6; } }',
    'with ({}) let\n{}',
    'with ({}) let\nx = 0',
    'while (false) let\n{}',
    'while (false) let\nx = 0',
    'for (var x of []) let\nx = 0',
    'for (var x in null) let\n{}',
    'for (; false; ) let\n{}',
    'for (var x in null) let\nx = 0;',
    'for(let a in b, c);',
    'for(a in b, c);',
    'for([{a=0}] in b);',
    'let {[a]: c} = v;',
    'let {[a.b]: c} = v;',
    'var {[a]: c} = v;',
    'async in x',
    `async instanceof x`,
    'const {[a.b]: c} = v;',
    'if (true) { function f1() {} }',
    'if (true) { function f1() {} function foo() { f1; } }',
    'if (true) { function f1() {} } function foo() { f1; }',
    'if (true) { function f1() {} f1 = 3; function foo() { f1; } }',
    'if (true) { function f1() {} f1 = 3; } function foo() { f1; }',
    'if (true) { function *f1() {} }',
    'if (true) { async function f1() {} }',
    '[var1, var2]',
    'var var1 = 16; () => { var1 = 17; };',
    'class MyClass extends MyBase { m() { var var1 = 11; } }',
    'try { } catch(var1) { function f() { var1 = 3; } }',
    'try { } catch(var1) { var var1 = 3; function f() { var1 = 3; } }',
    'var var1 = class {};',
    'class MyClass { static m() { var var1 = 11; } }',
    'class MyClass extends MyBase { static m() { var var1; } }',
    'class MyClass extends MyBase { static m() { var var1 = 11; } }',
    ' for (var k in arr) { all.push(k); }',
    '() => { this; };',
    '() => { arguments; };',
    'if (true) { arguments; }',
    'if (true) { if (true) { function f() { var var1 = 5; } } }',
    ` x = (tmp = -1500000000, tmp)+(tmp = -2000000000, tmp);`,
    ` x = -1500000000 + -2000000000;`,
    ` new class extends Object {
        constructor() {
          super();
          delete this;
        }
      }`,
    `function store(o, i, v) { o[i] = v; }`,
    `function f() { ++(this.foo) }`,
    `var a = o[o ^= 1];`,
    `var o = { f: "x" ? function () {} : function () {} };`,
    `var a = new p(1), b = new p(2);`,
    `o.__defineGetter__('foo', function () { return null; });`,
    `function break_from_for_in() {
      L: {
        try {
          for (var x in [1,2,3]) {
            break L;
          }
        } finally {}
      }
    }

    function break_from_finally() {
      L: {
        try {
        } finally {
          break L;
        }
      }
    }

    for (var i = 0; i < 10; i++) {
      break_from_for_in();
      gc();
    }

    for (var j = 0; j < 10; j++) {
      break_from_finally();
      gc();
    }`,
    `function for_var() {
      for (var x;;) {
        if (!x) break;
      }
      for (var x; x < 2;) {
        if (!x) break;
      }
      for (var x = 1;; x++) {
        if (x == 2) break;
      }
    }
    function for_let() {
      for (let x;;) {
        if (!x) break;
      }
      for (let x; x < 2;) {
        if (!x) break;
      }
      for (let x = 1;; x++) {
        if (x == 2) break;
      }
    }
    for (const x = 1;;) {
      if (x == 1) break;
    }
    for (const x = 1; x < 2;) {
      if (x == 1) break;
    }
    for (const x = 1;; 0) {
      if (x == 1) break;
    }`,
    'x = function(y = 1) {}',
    'function inner2(my_var) { my_var; }',
    'function inner2(my_var) { }',
    'function inner2(my_var = 5) { my_var; }',
    'function inner2(my_var = 5) { }',
    'function inner2(...my_var) { my_var; }',
    'function inner2(...my_var) { }',
    'function inner2([a, my_var, b]) { my_var; }',
    'function inner2([a, my_var, b]) { }',
    'function inner2([a, my_var, b] = [1, 2, 3]) { my_var; }',
    'function inner2([a, my_var, b] = [1, 2, 3]) { }',
    'function inner2({x: my_var}) { my_var; }',
    'function inner2({x: my_var}) { }',
    'function inner2({x: my_var} = {x: 0}) { my_var; }',
    'function inner2({x: my_var} = {x: 0}) { }',
    'function inner2({my_var}) { my_var; }',
    'function inner2({my_var}) { }',
    'function inner2({my_var} = {my_var: 8}) { my_var; } ',
    'function inner2({my_var} = {my_var: 8}) { }',
    'my_var => my_var;',
    'my_var => { }',
    '(a) = b;',
    '((a)) = b;',
    'a = ((b)) = c;',
    '(await())',
    '(x);',
    '(a) = 1;',
    '(a.b) = 1;',
    '(a[b]) = 1;',
    '(a.b().c().d) = 1;',
    '[x, y] = z;',
    '([x, y] = z);',
    '([x, y] = z) => x;',
    '([[x, y] = z]);',
    '([[x, y] = z]) => x;',
    '([[x, y] = z]) => x;',
    '({x, y} = z);',
    '(a) += 1;',
    '(a.b) += 1;',
    '(a[b]) += 1;',
    '(a.b().c().d) += 1;',
    '(this.a) += 1;',
    '(this[b]) += 1;',
    '(new x);',
    '(delete foo.bar);',
    '({});',
    '(a / b);',
    '(a \n/b/g);',
    '(delete /a/.x);',
    '(delete /a/g.x);',
    '(foo /=g/m.x);',
    '(void /=g/m.x);',
    '(void /=/g/m.x);',
    '([new x]);',
    '([delete foo.bar]);',
    '([{}]);',
    '([a / b]);',
    '([a \n/b/g]);',
    '([delete /a/.x]);',
    '([delete /a/g.x]);',
    '([foo /=g/m.x]);',
    '([void /=g/m.x]);',
    '([void /=/g/m.x]);',
    '(++x);',
    '(++x, y);',
    '(this.a) = 1;',
    '(this[b]) = 1;',
    '(my_var = 5) => my_var;',
    "x({'a':b}=obj);",
    "x({'a':b, 'c':d}=obj);",
    'x({"a":b}=obj);',
    "x({'a':b, c:d}=obj);",
    "x({a:b, 'c':d}=obj);",
    '({"x": y+z})',
    '({ident: [foo, bar].join("")})',
    '({ident: [foo, bar]/x})',
    '({ident: [foo, bar]/x/g})',
    '[...[x].map(y, z)];',
    '(foo, [bar, baz] = doo);',
    '[...[x]/y]',
    '[...{x}/y]',
    '[.../x//y]',
    'function x([a, b]){};',
    'function f([a, {b: []}]) {}',
    'function f({x: [a, {b: []}]}) {}',
    'try {} catch({e=x}){}',
    'try {} catch([e=x]){}',
    'new Foo.Bar',
    'new a.b.c.d',
    'new x().y',
    'new x()();',
    'new x().y + z',
    'new x()[y] = z',
    'new x().y++',
    'delete new x()',
    'delete new x().y',
    'typeof new x()',
    'typeof new x().y',
    'new x().y++',
    'new Foo`bar`',
    'function f([...bar]){}',
    'function f([...bar] = obj){}',
    'function f([foo, ...bar]){}',
    'function f([foo, ...bar] = obj){}',
    'function f([...[a, b]]){}',
    'function f([...[a, b]] = obj){}',
    'function f([x, ...[a, b]]){}',
    'function f([x, ...[a, b]] = obj){}',
    'function f( [a=[...b], ...c]){}',
    'function f( [a=[...b], ...c] = obj){}',
    'function f(a){}',
    'function f(a,b){}',
    'function f([foo,]){}',
    'function f([,]){}',
    'function f([,] = x){}',
    'function f([foo] = x){}',
    'function f([foo,,]){}',
    'function f([foo,,bar] = x){}',
    'function f([foo] = x, b){}',
    'function f([foo], b = y){}',
    'function f([foo] = x, b = y){}',
    'function f(x, [foo]){}',
    'function f(x, [foo] = y){}',
    '[(a)] = 0',
    '[(a) = 0] = 1',
    '[(a.b)] = 0',
    '[a = (b = c)] = 0',
    '[(a = 0)]',
    '({a:(b)} = 0)',
    '({a:(b) = 0} = 1)',
    '({a:(b.c)} = 0)',
    '({a:(b = 0)})',

    'a = { b(c=1) {} }',

    `(function () {
  while (!a || b()) {
      c();
  }
}());`,
    'a = []',
    `(function () {
  a(typeof b === 'c');
}());`,
    '(let[let])',
    '({[1*2]:3})',
    'a = { set b (c) {} }',
    '(function(){ return a * b })',
    '[a] = 1',
    '({ false: 1 })',
    '({*yield(){}})',
    `var a = {
  'arguments': 1,
  'eval': 2
};`,
    'var {a} = 1;',
    'var [a = b] = c',
    'for(a; a < 1;);',
    '(function a() {"use strict";return 1;});',
    `(function(){ return // Comment
  a; })`,
    '/*42*/',
    'function *a(){yield ~1}',
    `with (a)
// do not optimize it
(function () {
  b('c');
}());`,
    '(a,b) => 1 + 2',
    'a = { set true(b) { c = b } }',
    'function a(b, c) { return b-- > c; }',
    `(function () {
  a();
  function a() {
      b.c('d');
  }
  function a() {
      b.c('e');
  }
}());`,
    'do a(); while (true)',
    'do continue; while(1);',
    `'use strict';
var a = {
    '10': 1,
    '0x20': 2
};`,
    `class a {
  constructor() {
  };
  b() {};
};
class c {
  constructor(...d) {
  }
  b() {}
};
class e extends a {};
var f = class g {};
var h = class {};`,
    '((((((((((((((((((((((((((((((((((((((((a.a)))))))))))))))))))))))))))))))))))))))) = 1',
    'a = a += 1',
    '(function*() { yield 1; })',
    'var a, b;',
    '({ a: 1, get a() { } })',
    'a = { __proto__: 1 }',
    '{do ; while(false); false}',
    '/* assignment */\n a = b',
    'function* a(){(class extends (yield) {});}',
    'function* a(){(class {[yield](){}})};',
    'function f(x = y, [foo] = z){}',
    'function f(x = y, [foo]){}',
    'function f([foo=a]){}',
    'function f([foo=a] = c){}',
    'function f([foo=a,bar]){}',
    'function f([foo=a,bar] = x){}',
    'function f([foo,bar=b]){}',
    'function f([foo,bar=b] = x){}',
    'function f([foo=a,bar=b]){}',
    'function f([a = b = c] = arr){}',
    'call(yield)',
    'function* f(){ yield; }',
    'function* f(){ yield x + y; }',
    'function* f(){ call(yield); }',
    'function* f(){ call(yield x); }',
    'function* f(){ call(yield x + y); }',
    'function f(){ yield; }',
    '5 + yield',
    `function* g() { let x = yield 3; }`,
    `function* g(x) { yield x = 3; }`,
    `function* g(x) { yield x = yield 3; }`,
    '++(x);',
    '++\n(x);',
    '++\n(((x)));',
    '--(x);',
    '--(((x)));',
    '--\n(x);',
    '--\n(((x)));',
    '(x)++;',
    '(x)--;',
    '(((x)))--;',
    'x *\n++y',
    'async function f(){ await\n++c; }',
    'a().b',
    '[.../x/g/y]',
    '(x--);',
    '(x--, y);',
    '(a = 1, b = 2) => x;',
    'wrap({a=b}=c);',
    'foo(.200)',
    '({[x]:y} = z);',
    '(...x) => x',
    '(x, ...y) => x',
    '(x.y)=z',
    '([...x=y])',
    '([x].foo)',
    '([x].foo) = x',
    'log({foo: [bar]});',
    '[...{a = b} = c];',
    'foo, async()',
    'foo(async(), x)',
    'foo(async(x,y,z), a, b)',
    'log(async().foo);',
    '(my_var = 5) => { }',
    '({} + 1);',
    '(x + y) >= z',
    '({"x": 600..xyz} = x)',
    'const [...x] = y',
    '({"x": 600})',
    '({"x": 600..xyz})',
    'async ({} + 1);',
    'const { [eval]: []} = a;',
    'for (let=10;;);',
    '[{}.x] = y',
    '[{}[x]] = y',
    '[[][x]] = y',
    '[[].x] = y',
    'for (foo=10;;);',
    '({a,b=b,a:c,[a]:[d]})=>0;',
    'var {[a]: [b]} = c',
    'var {[a]: b} = c',
    'var {a: [b]} = c',
    `let {[foo]: [bar]} = baz`,
    'var {a,b=0,c:d,e:f=0,[g]:[h]}=0',
    "var m = 'foo'; var {[m]:[z]} = {foo:[1]}",
    '({a, a:a, a:a=a, [a]:{a}, a:some_call()[a], a:this.a} = 0);',
    'var [let] = x;',
    '({ x: x[Y] } = x);',
    'result = [x[yield]] = vals;',
    'for ((1?2:"3"in{}).foo in {key:1});',
    '(...my_var) => my_var;',
    'for ({x=y} in a) b',
    'for ({x=y} of a) b',
    '(...my_var) => { }',
    '([a, my_var, b]) => my_var;',
    'function *g() {x={     ...yield,    };}',
    'function *g() {x={     ...yield yield    };}',
    'function *g() {yield {     ...yield yield    };}',
    'function *g() {x={     ...yield yield,    };}',
    'function *g() {yield {     ...yield yield,    };}',
    'function *g() { yield {...(x,y),}}',
    `for ({x=y} in a) b;`,
    `for ({x=y} of a) b;`,
    '([a, my_var, b]) => { }',
    '([a, my_var, b] = [1, 2, 3]) => my_var;',
    '([a, my_var, b] = [1, 2, 3]) => { }',
    '({x: my_var}) => my_var;',
    'function f() {var f}',
    'function f(x) {{let x}}',
    'function f() {{let f}}',
    'var x; { let x; }',
    '{ let x; } var x;',
    'function *f(){ let f }',
    'x=function *f(){ var f }',
    'x=function *f(){ let f }',
    'x={*f(){ var f }}',
    'x={*f(){ let f }}',
    'async function *f(){ var f }',
    'async function *f(){ let f }',
    'x=async function *f(){ var f }',
    'x=async function *f(){ let f }',
    'x={async *f(){ var f }}',
    'x={async *f(){ let f }}',
    'o = {f(f) { }}',
    'o = {f(x) { function x() {} }}',
    'o = {f(x) { var x; }}',
    'o = {f(){ function x(){} var x = y; }}',
    'class o {f(x) { function x() {} }}',
    'class o {f(f) { }}',
    'class o {f(){ function x(){} var x = y; }}',
    'function f() {{var f}}',
    '({x: my_var}) => { }',
    '[[x = true] = true] = y',
    '[x = true] = y',
    '[[x] = true] = y',
    '[[x = true] = true] = y',
    '({a: x = true} = y)',
    '({"foo": 15..foo}=y)',
    '({a: {x = true} = true} = y)',
    'function *f(){   s = {foo: yield}   }',
    'f = ([xCls = class X {}]) => {}',
    'f = ([cls = class {}]) => {}',
    'f = ([xCls2 = class { name() {} }]) => {}',
    'f = ([xCls2 = class { static name() {} }]) => {}',
    'f = ([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) => {}',
    'function* g() {   [...{ x = yield }] = y   }',
    '({x: my_var} = {x: 0}) => my_var;',
    '({x: my_var} = {x: 0}) => { }',
    '({my_var}) => my_var;',
    '({my_var}) => { }',
    '({my_var} = {my_var: 5}) => my_var;',
    '({my_var} = {my_var: 5}) => { }',
    '({a, my_var}) => my_var;',
    '({a, my_var}) => { }',
    '({a, my_var} = {a: 0, my_var: 5}) => my_var;',
    '({a, my_var} = {a: 0, my_var: 5}) => { }',
    '({y, x: my_var}) => my_var;',
    '({y, x: my_var}) => { }',
    '({y, x: my_var} = {y: 0, x: 0}) => my_var;',
    '({y, x: my_var} = {y: 0, x: 0}) => { }',
    'try { } catch (my_var) { my_var; }',
    'try { } catch ([a, my_var, b]) { my_var; }',
    'try { } catch ({x: my_var}) { my_var; }',
    'try { } catch ({y, x: my_var}) { my_var; }',
    'try { } catch ({my_var}) { my_var; }',
    'for (let my_var in {}) { my_var; }',
    'for (let my_var in {}) { }',
    'for (let my_var of []) { my_var; }',
    'for (let my_var of []) { }',
    'for (let [a, my_var, b] in {}) { my_var; }',
    'for (let [a, my_var, b] of []) { my_var; }',
    'for (let {x: my_var} in {}) { my_var; }',
    'for (let {x: my_var} of []) { my_var; }',
    'for (let {my_var} in {}) { my_var; }',
    'for (let {my_var} of []) { my_var; }',
    'for (let {y, x: my_var} in {}) { my_var; }',
    'for (let {y, x: my_var} of []) { my_var; }',
    'for (let {a, my_var} in {}) { my_var; }',
    'for (let {a, my_var} of []) { my_var; }',
    'for (var my_var in {}) { my_var; }',
    'for (var my_var in {}) { }',
    'for (var my_var of []) { my_var; }',
    'for (var my_var of []) { }',
    'for (var [a, my_var, b] in {}) { my_var; }',
    'for (var [a, my_var, b] of []) { my_var; }',
    'for (var {x: my_var} in {}) { my_var; }',
    'for (var {x: my_var} of []) { my_var; }',
    'for (var {my_var} in {}) { my_var; }',
    'for (var {my_var} of []) { my_var; }',
    'for (var {y, x: my_var} in {}) { my_var; }',
    'for (var {y, x: my_var} of []) { my_var; }',
    'for (var {a, my_var} in {}) { my_var; }',
    'for (var {a, my_var} of []) { my_var; }',
    'for (var my_var in {}) { } my_var;',
    'for (var my_var of []) { } my_var;',
    'for (var [a, my_var, b] in {}) { } my_var;',
    'for (var [a, my_var, b] of []) { } my_var;',
    'for (var {x: my_var} in {}) { } my_var;',
    'for (var {x: my_var} of []) { } my_var;',
    'for (var {my_var} in {}) { } my_var;',
    'for (var {my_var} of []) { } my_var;',
    'for (var {y, x: my_var} in {}) { } my_var;',
    'for (var {y, x: my_var} of []) { } my_var;',
    'for (var {a, my_var} in {}) { } my_var;',
    'for (var {a, my_var} of []) { } my_var;',
    'for (let my_var = 0; my_var < 1; ++my_var) { my_var; }',
    'for (var my_var = 0; my_var < 1; ++my_var) { my_var; }',
    'for (var my_var = 0; my_var < 1; ++my_var) { } my_var; ',
    'for (let a = 0, my_var = 0; my_var < 1; ++my_var) { my_var }',
    'for (var a = 0, my_var = 0; my_var < 1; ++my_var) { my_var }',
    'class my_var {}; my_var; ',
    'function my_var() {} my_var;',
    'if (true) { function my_var() {} }  my_var;',
    'function inner2() { if (true) { function my_var() {} }  my_var; }',
    '() => { if (true) { function my_var() {} }  my_var; }',
    'if (true) { var my_var; if (true) { function my_var() {} } }  my_var;',

    ' function  a(b,) {}',
    ' function* a(b,) {}',
    '(function  a(b,) {});',
    '(function* a(b,) {});',
    '(function   (b,) {});',
    '(function*  (b,) {});',
    ' function  a(b,c,d,) {}',
    ' function* a(b,c,d,) {}',
    '(function  a(b,c,d,) {});',
    '(function* a(b,c,d,) {});',
    '(function   (b,c,d,) {});',
    '(function*  (b,c,d,) {});',
    '(b,) => {};',
    '(b,c,d,) => {};',
    'a(1,);',
    'a(1,2,3,);',
    'a(...[],);',
    'a(1, 2, ...[],);',
    'a(...[], 2, ...[],);',
    "'use strict';(function(...[...[a, b, ...c]]){ return args;})",
    "function fn() { 'use strict';} fn(...([1, 2, 3]));",
    "function fn() { 'use strict';} fn(...'123', ...'456');",
    "function fn() { 'use strict';} fn(...new Set([1, 2, 3]), 4);",
    "function fn() { 'use strict';} fn(1, ...[2, 3], 4);",
    "function fn() { 'use strict';} fn(...Array(...[1,2,3,4]));",
    "function fn() { 'use strict';} fn(...NaN);",
    "function fn() { 'use strict';} fn(0, 1, ...[2, 3, 4], 5, 6, 7, ...'89');",
    "function fn() { 'use strict';} fn(0, 1, ...[2, 3, 4], 5, 6, 7, ...'89', 10);",
    "function fn() { 'use strict';} fn(...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9);",
    "function fn() { 'use strict';} fn(...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9, ...[10]);",
    '{ function foo() {}; }; ',
    '{ function* foo() {}; }; ',
    '{ async function foo() {}; }; ',
    'eval++;',
    '(function let() { })',
    'var let;',
    'var foo, let;',
    'try { } catch (let) { }',
    'function foo(let) { }',
    'function foo(bar, let) { }',
    'let = 1;',
    'var foo = let = 1;',
    'let * 2;',
    'function f() { let = 1; }',
    'function f() { var foo = let = 1; }',
    '++let;',
    'let++;',
    'let: 34',
    'function let(let) { let: let(let + let(0)); }',
    '({ let: 1 })',
    '({ get let() { 1 } })',
    'let(100)',
    'L: let\nx',
    'L: let\n{x}',
    'function arguments() { }',
    'function arguments() { }',
    'function foo(bar, eval) { }',
    'function arguments() { }',
    '(function f() { 0, function g() { var a; } })();',
    '(function f() { 0, { g() { var a; } } })();',
    '(function f() { 0, class c { g() { var a; } } })();',
    '(function f() { function g() { var a; } })();',
    '(function f() { function g() { { function h() { } } } })();',
    "var x = new new Function('this.x = 42');",
    'var f = (x, y) => x + y;',
    //    '0790',
    `var a, b, c, d;
a = (b(), c(), d()) ? 1 : 2;`,
    '(a) => b',
    'function *a(){({get b(){yield}})}',
    '({ *a() {} })',
    'a["b"] = "c";',
    '[, a,,] = 1',
    'class a { ; }',
    `function a() {
}
function b() {
    return c;
}
function d() {
    return void 1;
}
function e() {
    return void 2;
}
function f() {
    return;
}
function g(h, i) {
    j.k(h, i);
    l(h);
    return;
}
function m(h, i) {
    j.k(h, i);
    if (h) {
        n(i);
        l(h);
        return h + i;
    }
    return c;
}
function o(h, i) {
    j.k(h, i);
    if (h) {
        n(i);
        l(h);
        return void 3;
    }
    return h + i;
}
function p(h, i) {
    n(h);
    q(i);
    return void 4;
}
function r(h, i) {
    n(h);
    q(i);
    return c;
}
function s() {
    return false;
}
function t() {
    return null;
}
function u() {
    return 5;
}`,
    `for (var a in b)
// do not optimize it
(function () {
  c('d');
}());`,
    '[a, {b}, c] = obj',
    '[a, {b:d}, c] = obj',
    '[a, {[b]:d}, c] = obj',
    '[a, {[b]: c}, d] = e',
    'null',
    'false',
    'x;"foo"',
    '0x123',
    '0o123',
    '0b1010',
    '0456',
    'this',
    'null\n/foo;',
    'null\n/foo/g;',
    'a<b',
    'a>=b',
    '{b\n++c};',
    'while (true) {b\n++c};',
    '() => b\n++c;',
    'x *\n++y',
    'async function f(){ await\n++c; }',
    'async function f(){ await b\n++c; }',
    'typeof b\n++c;',
    'new b\n++c;',
    'a=b?c:d',
    'a?b:c=d',
    'true\n/foo;',
    'true\n/foo/g;',
    'void a\n/foo/g',
    'x("" + y)',
    'a+b',
    'a-b',
    'a*b',
    'a**b',
    'a|b',
    'a||b',
    'a *= b',
    'yield',
    '5 + yield',
    'log({foo: [bar]} = obj);',
    `switch (true) { default: function g() {} }`,
    'class a extends b { constructor() { super.c } }',
    '(a)=>{"use strict";}',
    'function* a() {}',
    'while (true) { break }',
    `(function () {
  var a = 1;  // should not hoist this
  arguments[2] = 3;
  (function () {
      eval('');
  }());
}());`,
    '(class {set a(b) {"use strict";}})',
    `var a = {};
a.b = 1;
a.c = 2;
d.e(a.c);`,
    `(function () {
  (function () {
  }());
}());`,
    '(a) => ((b, c) => (a, b, c))',
    '(class {3() {}})',
    'a !== b',
    '({ __proto__() { return 1 }, __proto__: 2 })',
    'if (a) { b() /* Some comment */ }',
    'for(a; a < 1; a++) b(a);',
    'a => ({ b: 1 })',
    'let [{a}] = 1',
    '+ /test/',
    'let {} = 1',
    `(class {;;;
  ;a(){}})`,
    'true;false',
    '({ get "a"() {} })',
    '[a, a] = 1',
    `stream.end = function (data) {
  if(ended) return
  ended = true
  if(arguments.length) stream.write(data)
  _end() // will emit or queue
  return stream
}
`,
    'a instanceof b',
    'a in b',
    '[a, {b:d}, c] = obj',
    '[a, {[b]:d}, c] = obj',
    'function f({b: []}) {}',
    'function f([{b}]) {}',
    'function fk({x: [a, {b: []}]}) {}',
    'function f([a, [b], c]) {}',
    'function f([...bar] = obj){}',
    'function f([foo, ...bar] = obj){}',
    'let f = function f(await) {}',
    'let f = function *f(await) {}',
    'class A {*f(await) {}}',
    'o = {f(yield) {}}',
    'o = {f(await) {}}',
    'async function *f() { return yield 100; }',
    'async function f() { return await foo; }',
    'async function *f() { return await foo; }',

    '[a, {[b]: c}, d] = e',
    'eval; log(eval); eval.foo; eval[foo]; eval.foo = bar; eval[foo] = bar;',
    '[a = [b] = c, {[d]: e}, f] = g',
    'log({foo: [bar]});',
    'log({foo: [bar]} = obj);',
    'a<b',
    'a>=b',
    'function f(){   return;    }',
    '[...{a = b} = c];',
    'arguments; log(arguments); arguments.foo; arguments[foo]; arguments.foo = bar; arguments[foo] = bar;',
    'class a extends b { c() { [super.d] = e } }',
    '1 + (a(), b(), c())',
    '(a) => a * yield;',
    'a - b',
    'new a()',
    'switch (x) { default: class X {} }',
    'switch (x) { case x: class X {} }',
    'try { } finally { class X {} }',
    'try { class X {} } finally {}',
    '{ const y = x }',
    'switch (x) { case x: const y = x }',
    'try { } catch (e) { const y = x }',
    'try { } finally { let y = x }',
    'switch (x) { default: function * f() {} }',
    'switch (x) { case x: function * f() {} }',
    'try { } finally { function * f() {} }',
    'try { } catch (e) { function * f() {} }',
    'switch (x) { default: async function f() {} }',
    'try { } catch (e) { async function f() {} }',
    'switch (x) { default: function f() {} }',
    'switch (x) { case x: function f() {} }',
    'try { } catch (e) { function f() {} }',
    '(a)--',
    `for (;;) {
  if (a) {
      if (b) {
          continue;
      }
      c()  // This should not removed and translation should not occur.
  }
}`,
    'a(....0)',
    'delete (1, a, 2)',
    '1 instanceof 2',
    '(a = b("100")) != a ',
    'var let',
    `
var a;
// compress these
a = true     && b;
a = 1        && c.d("a");
a = 2 * 3    && 4 * b;
a = 5 == 6   && b + 7;
a = "e" && 8 - b;
a = 9 + ""   && b / 10;
a = -4.5     && 11 << b;
a = 12        && 13;
a = false     && b;
a = NaN       && c.d("f");
a = 14         && c.d("g");
a = h && 15 * b;
a = null      && b + 16;
a = 17 * 18 - 19 && 20 - b;
a = 21 == 22   && b / 23;
a = !"e" && 24 % b;
a = 25         && 26;
// don't compress these
a = b        && true;
a = c.d("a") && 27;
a = 28 - b    && "e";
a = 29 << b   && -4.5;
a = b        && false;
a = c.d("f") && NaN;
a = c.d("g") && 30;
a = 31 * b    && h;
a = b + 32    && null;`,
    'function a() {} function a() {}',
    `(/* comment */{
  a: null
})`,
    `function parseArrayInitializer() {
  var elements = [], node = new Node(), restSpread;
  expect('[');
  while (!match(']')) {
      if (match(',')) {
          lex();
          elements.push(null);
          if(match(']')) {
              elements.push(null);
          }
      } else if (match('...')) {
          restSpread = new Node();
          lex();
          restSpread.finishSpreadElement(inheritCoverGrammar(parseAssignmentExpression));
          if (!match(']')) {
              isAssignmentTarget = isBindingElement = false;
              expect(',');
          }
          elements.push(restSpread);
      } else {
          elements.push(inheritCoverGrammar(parseAssignmentExpression));
          if (!match(']')) {
              expect(',');
              if(match(']')) {
                  elements.push(null);
              }
          }
      }
  }
  lex();
  return node.finishArrayExpression(elements);
}`,
    `var funky =
  {
    toString: function()
    {
      Array.prototype[1] = "chorp";
      Object.prototype[3] = "fnord";
      return "funky";
    }
  };
var trailingHoles = [0, funky, /* 2 */, /* 3 */,];
assertEq(trailingHoles.join(""), "0funkyfnord");`,
    `var x = {
	a: "asdf",
	b: "qwerty",
	...(1 > 0 ? { c: "zxcv" } : ""),
	d: 1234
};`,
    `query = {
  ...query,
  $or: [
    {_id: { $in: req.jwt.var}},
    {owner: req.jwt.var2}
  ]
};`,
    'f(a/b,a/b,a.of/b)',
    'yield : 1',
    `if (statement & FUNC_STATEMENT) {
  node.id = (statement & FUNC_NULLABLE_ID) && this.type !== tt.name ? null : this.parseIdent()
  if (node.id && !(statement & FUNC_HANGING_STATEMENT))
    this.checkLVal(node.id, this.inModule && !this.inFunction ? BIND_LEXICAL : BIND_FUNCTION)
}`,
    `/* BEFORE */
pp.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next()
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync)
}
/* AFTER */
pp.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next()
  let statementFlags = {isStatement: true, isHanging: !declarationPosition}
  return this.parseFunction(node, statementFlags, false, isAsync)
}`,
    'var AsyncGeneratorFunction = Object.getPrototypeOf(async function* () {}).constructor;',
    `var [ a, , b ] = list
[ b, a ] = [ a, b ]`,
    'for (const {a} of /b/) {}',
    '({ a = 42, [b]: c.d } = e);',
    `const test = ({ t, ...v }) => {
  console.log(t, v);
};`,
    `function a() {
  var e, i, n, a, o = this._tween,
    l = o.vars.roundProps,
    h = {},
    _ = o._propLookup.roundProps;
  if ("object" != (void 0 === l ? "undefined" : t(l)) || l.push) for ("string" == typeof l && (l = l.split(",")), n = l.length; --n > -1;) h[l[n]] = Math.round;
  else for (a in l) h[a] = s(l[a]);
  for (a in h) for (e = o._firstPT; e;) i = e._next, e.pg ? e.t._mod(h) : e.n === a && (2 === e.f && e.t ? r(e.t._firstPT, h[a]) : (this._add(e.t, a, e.s, e.c, h[a]), i && (i._prev = e._prev), e._prev ? e._prev._next = i : o._firstPT === e && (o._firstPT = i), e._next = e._prev = null, o._propLookup[a] = _)), e = i;
  return !1
}`,
    `() => { [a, b] = [1, 2] }`,
    `() => [a, b] = [1, 2]`,
    `() => {
  var _ref = [1, 2];
  a = _ref[0];
  b = _ref[1];
  return _ref;
};`,
    `const { [(() => 1)()]: a, ...rest } = { 1: "a" };`,
    `const foo = {
  1: "a",
  2: "b",
  3: "c",
}`,
    `function isBetween(x, a, b) {
  if (a > b) [a, b] = [b, a];
  return x > a && x < b;
}`,
    `let a = 1;
let b = 2;
[a, b] = [b, a];
  `,
    `function test() {
    let a = 1;
    let b = 2;
    [a, b] = [b, a];
    console.log(a); // 2
    console.log(b); // 2
  }
  `,
    `function foo(...{ length }) {
    return length;
  }`,
    `function foo() {
    for (var _len = arguments.length, _ref = new Array(_len), _key = 0; _key < _len; _key++) {
      _ref[_key] = arguments[_key];
    }
    var a = _ref[0];
  }`,
    `(function(...[x]) {})`,
    `(function () {
    x;
  });`,
    `const foo = {
    bar: 10,
  }
  let bar = 0;
  if (foo) ({ bar } = foo); // throws an error (see stacktrace below)
  console.log(bar); // should print 10`,
    `const foo = {
    bar: 10,
  }
  let bar = 0;
  if (foo) {
    ({ bar } = foo);
  }
  console.log(bar); // prints 10 `,
    `({i: {...j}} = k);`,
    `({i: [...j]} = k);`,
    `const {
    [({ ...rest }) => {
      let { ...b } = {};
    }]: a,
    [({ ...d } = {})]: c,
  } = {}; `,
    `const {
    a = ({ ...rest }) => {
      let { ...b } = {};
    },
    c = ({ ...d } = {}),
  } = {}; `,
    `var result = "";
  var obj = {
    get foo() {
      result += "foo"
    },
    a: {
      get bar() {
        result += "bar";
      }
    },
    b: {
      get baz() {
        result += "baz";
      }
    }
  };
  `,
    `var { a: { ...bar }, b: { ...baz }, ...foo } = obj;`,
    'a||(b||(c||(d||(e||f))))',
    'for(let a of [1,2]) 3',
    '({})=>1;',
    `var a;
    (a) = {};
    (a.b) = {};
    (a['c']) = {};`,
    `(foo++).test(), (foo++)[0]`,
    `(++a)();
    (a++)();
    new (++a)();
    new (a++)();
    new (++a);
    new (a++);`,
    `(++a)();
    (a++)();
    new (++a)();
    new (a++)();
    new (++a)();
    new (a++)(); `,
    `; 'use strict'; with ({}) {}`,
    '({ "a": 1 })',
    `// mangle to the same name 'a'
    c: {
              a("b");
              break c;
    }
    c: {
              a("b");
              break c;
    }`,
    'if (!a) debugger;',
    'a ** b',
    `// One
    (1);
    /* Two */
    (2);
    (
      // Three
      3
    );
    (/* Four */ 4);`,
    'new a(...b, ...c, ...d);',
    'a = { set b (c) {} } ',
    ` class Empty { }
    class EmptySemi { ; }
    class OnlyCtor { constructor() { p('ctor') } }
    class OnlyMethod { method() { p('method') } }
    class OnlyStaticMethod { static method() { p('smethod') } }
    class OnlyGetter { get getter() { p('getter') } }
    class OnlyStaticGetter { static get getter() { p('sgetter') } }
    class OnlySetter { set setter(x) { p('setter ' + x) } }
    class OnlyStaticSetter { static set setter(x) { p('ssetter ' + x) } }`,
    ` class Empty { }
    class EmptySemi { ; }
    class OnlyCtor { constructor() { p('ctor') } }
    class OnlyMethod { method() { p('method') } }
    class OnlyStaticMethod { static method() { p('smethod') } }
    class OnlyGetter { get getter() { p('getter') } }
    class OnlyStaticGetter { static get getter() { p('sgetter') } }
    class OnlySetter { set setter(x) { p('setter ' + x) } }
    class OnlyStaticSetter { static set setter(x) { p('ssetter ' + x) } }
    class OnlyComputedMethod { ["cmethod"]() { p('cmethod') } }
    class OnlyStaticComputedMethod { static ["cmethod"]() { p('scmethod') } }
    class OnlyComputedGetter { get ["cgetter"]() { p('cgetter') } }
    class OnlyStaticComputedGetter { static get ["cgetter"]() { p('scgetter') } }
    class OnlyComputedSetter { set ["csetter"](x) { p('csetter ' + x) } }
    class OnlyStaticComputedSetter { static set ["csetter"](x) { p('scsetter ' + x) } }
    `,
    ` testFlat([2, 3, [4, 5]], [2, 3, 4, 5]);
    testFlat([2, 3, [4, [5, 6]]], [2, 3, 4, [5, 6]]);
    testFlat([2, 3, [4, [5, 6]]], [2, 3, 4, 5, 6], 2);
    testFlat([], []);
    testFlat([[], [], 1], [1]);
    const typedArr = new Int32Array(3);
    const typedArr2 = new Int32Array(3);`,
    ` testFlatMap([2, 3, 4, 5], [2, 4, 3, 6, 4, 8, 5, 10], function (a) { return [a, a * 2]});
    const thisArg = { count : 0 };
    testFlatMap([2, 3, 4], [2, 3, 3, 4, 4, 5], function (a) { this.count += a; return [ a, a + 1]}, thisArg);
    testFlatMap([2, 3, 4], [[2], [3], [4]], function (a) { return [[a]]});`,
    `  testFlatMap([2, 3], [null, null], function () { return [this]}, null);
    testFlatMap([2, 3], [undefined, undefined], function () { return [this]}, undefined);
    testFlatMap([2, 3], [undefined, undefined], function () { return [this]});
    testFlatMap([2, 3], ["", ""], function () { return [this]}, "");
    testFlatMap([2, 3], ["Test", "Test"], function () { return [this]}, "Test");
    const boo = {};
    testFlatMap([2, 3], [boo, boo], function () { return [this]}, boo);`,
    ` var FloatArr0 = [];
    var VarArr0 = [];
    var b = VarArr0;
    for (var __loopvar1 = 0; b < FloatArr0;) {
        for (var v319132 = 0; v319132; v319132++) {
            FloatArr0[1];
        }
        while (v319133) {
            FloatArr0[1];
        }
    }`,
    '[ 1 ]',
    'for([a,b[a],{c,d=e,[f]:[g,h().a,(1).i,...j[2]]}] in 3);',
    'var h1 = async (x = 0 ? 1 : a => {}) => { return x; };',
    'function f2(m, x = 0 ? 1 : a => {}) { return x; }',
    'var g2 = (m, x = 0 ? 1 : a => {}) => { return x; };',
    'var h2 = async (m, x = 0 ? 1 : a => {}) => { return x; };',
    'var g3 = (x = 0 ? 1 : a => {}, q) => { return x; };',
    'var h3 = async (x = 0 ? 1 : a => {}, q) => { return x; };',
    'var { [0 ? 1 : a => {}]: h } = { "a => {}": "boo-urns!" };',
    '1 - 2',
    `// Yield statements.
    function* g() { yield 3; yield 4; }

    // Yield expressions.
    function* g() { (yield 3) + (yield 4); }

    // Yield without a RHS.
    function* g() { yield; }
    function* g() { yield }
    function* g() {
        yield
    }
    function* g() { (yield) }
    function* g() { [yield] }
    function* g() { {yield} }
    function* g() { (yield), (yield) }
    function* g() { yield; yield }
    function* g() { (yield) ? yield : yield }
    function* g() {
        (yield)
        ? yield
        : yield
    }

    // If yield has a RHS, it needs to start on the same line.  The * in a
    // yield* counts as starting the RHS.
    function* g() {
        yield *
        foo
    }

    // You can have a generator in strict mode.
function* g() { "use strict"; yield 3; yield 4; }

// Generators can have return statements also, which internally parse to a kind
// of yield expression.
function* g() { yield 1; return; }
function* g() { yield 1; return 2; }
function* g() { yield 1; return 2; yield "dead"; }

// Generator expression.
(function* () { yield 3; });

// Named generator expression.
(function* g() { yield 3; });

// Generators do not have to contain yield expressions.
function* g() { }

// YieldExpressions can occur in the RHS of a YieldExpression.
function* g() { yield yield 1; }
function* g() { yield 3 + (yield 4); }
function* g() { yield ({ yield: 1 }) }
function* g() { yield ({ get yield() { return 1; }}) }
function yield(yield) { yield: yield (yield + yield (0)); }
function f() { function yield() {} }
function f() { function* yield() {} }
function* yield() { (yield 3) + (yield 4); }`,
    `function f() {
  var x = 3;
  if (x > 0) {
    let {a:x} = {a:7};
    if (x != 7)
      throw "fail";
  }
  if (x != 3)
    throw "fail";
}

function g() {
  for (var [a,b] in {x:7}) {
    if (a !== "x" || typeof b !== "undefined")
      throw "fail";
  }

  {
    for (let [a,b] in {y:8}) {
      if (a !== "y" || typeof b !== "undefined")
        throw "fail";
    }
  }

  if (a !== "x" || typeof b !== "undefined")
    throw "fail";
}

f();
g();

if (typeof a != "undefined" || typeof b != "undefined" || typeof x != "undefined")
  throw "fail";

function h() {
  for ([a,b] in {z:9}) {
    if (a !== "z" || typeof b !== "undefined")
      throw "fail";
  }
}

h();

if (a !== "z" || typeof b !== "undefined")
  throw "fail";`,
    `function t()
    {
      var x = y => z => {} // ASI occurs here
      /Q/;
      return 42;
    }`,
    'var a = /undefined/.exec();',
    'a = /undefined/.exec(undefined);',
    '/aaaa/.exec(undefined), null',
    '/aaaa/.test(undefined), false',
    'var re = /aaa/',
    'function f([a], [b]=[1], ...[c]) {}',
    '(function () {1;})',
    'var a = /undefined/.exec();',
    'var a = /undefined/.exec();',
    'a: while (true) { continue a }',
    '({ if: 1 })',
    '!a',
    `{;}
    a();
    {};
    {
        {};
    };
    b();
    {}`,
    'x = [] = y;',
    '[] = 5;',
    '!(x)',
    '++(x)',
    '1e+05',
    'for (const x of xs) {}',
    'for (const x in xs) {}',
    '({x, ...rest});',
    'let {x=y} = {}',
    '({x:[]}={x})',
    'var x = build("&&")();',
    'let {x:y=z} = {}',
    'let {p:{q=0,...o}={r:0}} = {p:{r:""}}',
    'let [x=y] = []',
    'let [x=y, z] = []',
    '0o110/2',
    '0O644/2, 210',
    `var N = 70*1000;
    var counter;

    counter = 0;
    var x = build("&&")();
    if (x !== true)
      throw "Unexpected result: x="+x;
    if (counter != N)
      throw "Unexpected counter: counter="+counter;

    counter = 0;
    var x = build("||")();
    if (x !== true)
      throw "Unexpected result: x="+x;
    if (counter != 1)
      throw "Unexpected counter: counter="+counter;

    function build(operation)
    {
      var counter;
      var a = [];
      a.push("return f()");
      for (var i = 1; i != N - 1; ++i)
        a.push("f()");
      a.push("f();");
      return new Function(a.join(operation));
    }

    function f()
    {
      ++counter;
      return true;
    }`,
    '7 * 64 + 5 * 8 + 5',
    'eval("0" + v + i + j + k), i * 64 + j * 8 + k',
    'var {b:{c:x}}={b:{c:1}}',
    `var summary = 'Do not assert: (pnkey)->pn_arity == PN_NULLARY && ' +
    '((pnkey)->pn_type == TOK_NUMBER || (pnkey)->pn_type == TOK_STRING || ' +
    '(pnkey)->pn_type == TOK_NAME)';
  var actual = 'No Crash';
  var expect = 'No Crash';`,
    'let x = /x/* 5 */y/;',
    `const id = /*pre*/ {
      a: 1,
    }/*post*/;`,
    'const id = /*pre*/1/*post*/;',
    'class Kind { get "a"() {} }',
    'class Kind { set "a"(x) {} }',
    'let {x=y} = {}',
    'function f(yield, let) { return yield+let; }',
    '(function(){yield = 1;})',
    'var obj = { prop: "obj", f: function() { return this.prop; } };',
    'x = {} = y;',
    '({a,...b}) => 0;',
    'function x(...[ a, b ]){}',
    '\n    42\n\n',
    '/foobar/',
    '/[a-z]/g',
    '(1 + 2 ) * 3',
    '(1 + 2 ) * 3',
    '(x = 23)',
    'x = []',
    'x = [ ]',
    'x = [ 42 ]',
    'x = [ 42, ]',
    'x = [ ,, 42 ]',
    'x = [ 1, 2, 3, ]',
    '日本語 = []',
    'T‿ = []',
    //"T‌ = []",
    'ⅣⅡ = []',
    'function f() { return { f() {}, *g() {}, r: /a/ }; }',
    'function* g() { return { f() {}, *g() {}, r: /b/ }; }',
    '() => { return { f() {}, *g() {}, r: /c/ }; }',
    'function fna({x: y}) {}',
    'function fnb({x: y = 42}) {}',
    'function fnc({x: {}}) {}',
    'function fnd({x: {y}}) {}',
    'function fne({x: {} = 42}) {}',
    'function fnf({x: {y} = 42}) {}',
    '() => { return { f() {}, *g() {}, r: /c/ }; }',
    'function spreadOpt(...[r]){ return spreadTarget(...r); }',
    'function spreadOpt2(...[...r]){ return spreadTarget(...r); }',
    'function spreadOpt3(r, ...[]){ return spreadTarget(...r); }',
    'spreadOpt3([]), 0',
    '({...x})',
    '({...f()})',
    '({...123})',
    '({...x, ...obj.p})',

    '({p, ...x})',
    '({p: a, ...x})',
    '({...x, p: a})',
    '({...x,})',
    '({...__proto__})',
    '({...__proto__, ...__proto__})',
    'function argsLengthRestArrayWithDefault(...[a = 0]) {}',
    'function argsLengthEmptyRestObject(...{}) {}',
    'function argsLengthRestObject(...{a}) {}',
    'function argsLengthRestObjectWithDefault(...{a = 0}) {}',
    'function argsAccessEmptyRestArray(...[]) {}',
    'function arrayRestWithDefault(...[a, b = 1]) {}',
    'function objectRestWithDefault(...{0: a, 1: b = 1}) {}',
    'function arrayRestWithNestedRest(...[...r]) {}',
    'function arrayRestTDZ(...[a = a]) { }',
    'function objectRestTDZ(...{a = a}) { }',
    'function f1(a, bIs, [b]=[3], ...rest) {}',
    '[, ...rest]',
    'let [...[...x]] = (() => { throw "foo"; } )();',
    '[, ...(o.prop)]',
    '[, ...(o.call().prop)]',
    '[, ...[...(o.prop)]]',
    '[, ...[...(o.call().prop)]]',
    '{a: [, ...rest]}',
    '[, ...[...rest]]',
    '[, ...[...rest]]',
    '[, [, ...[...rest]]]',
    '{a: [, ...[...rest]]}',
    '[, ...{0: a, 1: b}]',
    '[, ...{0: a, 1: b}]',
    '[, [, ...{0: a, 1: b}]]',
    'it => { var [a] = it; return [a]; }',
    '() => { [a, b, c] = {0: 0, 1: 1, 2: 2} }',
    'it => { var [a,b,...rest] = it; return [a,b,...rest]; }',
    'it => { var [,,...rest] = it; return rest; }',
    'loop(() => { doneafter = 4; var [a] = iterable; return a; });',
    'loop(() => { doneafter = 4; var [a,b,...[...rest]] = iterable; return rest; });',
    '[a, , b, ...c] = obj;',
    'result = {[a]:b, ...rest} = { foo: 1, bar: 2, baz: 3 };',
    'async function* f() { let a = function(a = await) {}; }',
    'async function* f(a = async function*() { await 1; }) {}',
    'async function f(a = async function() { await 1; }) {}',
    "function a() { 'use strict'; var await = 3; }",
    "'use strict'; var await = 3;",
    'var await = 3; async function a() { await 4; }',
    'async function a() { await 4; } var await = 5',
    'async function a() { function b() { return await; } }',
    'function a() { await: 4 }',
    '(async function() {})()',
    'var k = async function() {}',
    'async function a() {}',
    `function assertSyntaxError(str) {
      var msg;
      var evil = eval;
      try {
          // Non-direct eval.
          evil(str);
      } catch (exc) {
          if (exc instanceof SyntaxError)
              return;
          msg = "Assertion failed: expected SyntaxError, got " + exc;
      }
      if (msg === undefined)
          msg = "Assertion failed: expected SyntaxError, but no exception thrown";
      throw new Error(msg + " - " + str);
  }

  // Yield statements.
  function* g() { yield 3; yield 4; }

  // Yield expressions.
  function* g() { (yield 3) + (yield 4); }

  // Yield without a RHS.
  function* g() { yield; }
  function* g() { yield }
  function* g() {
      yield
  }
  function* g() { (yield) }
  function* g() { [yield] }
  function* g() { {yield} }
  function* g() { (yield), (yield) }
  function* g() { yield; yield }
  function* g() { (yield) ? yield : yield }
  function* g() {
      (yield)
      ? yield
      : yield
  }

  // If yield has a RHS, it needs to start on the same line.  The * in a
  // yield* counts as starting the RHS.
  function* g() {
      yield *
      foo
  }

  // You can have a generator in strict mode.
  function* g() { "use strict"; yield 3; yield 4; }

  // Generators can have return statements also, which internally parse to a kind
  // of yield expression.
  function* g() { yield 1; return; }
  function* g() { yield 1; return 2; }
  function* g() { yield 1; return 2; yield "dead"; }

  // Generator expression.
  (function* () { yield 3; });

  // Named generator expression.
  (function* g() { yield 3; });

  // Generators do not have to contain yield expressions.
  function* g() { }

  // YieldExpressions can occur in the RHS of a YieldExpression.
  function* g() { yield yield 1; }
  function* g() { yield 3 + (yield 4); }

  // Generator definitions with a name of "yield" are not specifically ruled out
  // by the spec, as the yield name is outside the generator itself.  However,
  // in strict-mode, "yield" is an invalid identifier.
  function* yield() { (yield 3) + (yield 4); }
  assertSyntaxError("function* yield() { 'use strict'; (yield 3) + (yield 4); }");

  // In classic mode, yield is a normal identifier, outside of generators.
  function yield(yield) { yield: yield (yield + yield (0)); }

  // Yield is always valid as a key in an object literal.
  ({ yield: 1 });
  function* g() { yield ({ yield: 1 }) }
  function* g() { yield ({ get yield() { return 1; }}) }

  // Yield is a valid property name.
  function* g(obj) { yield obj.yield; }

  // Checks that yield is a valid label in classic mode, but not valid in a strict
  // mode or in generators.
  function f() { yield: 1 }
  assertSyntaxError("function f() { 'use strict'; yield: 1 }")
  assertSyntaxError("function* g() { yield: 1 }")

  // Yield is only a keyword in the body of the generator, not in nested
  // functions.
  function* g() { function f(yield) { yield (yield + yield (0)); } }

  // Yield in a generator is not an identifier.
  assertSyntaxError("function* g() { yield = 10; }");

  // Yield binds very loosely, so this parses as "yield (3 + yield 4)", which is
  // invalid.
  assertSyntaxError("function* g() { yield 3 + yield 4; }");

  // Yield is still a future-reserved-word in strict mode
  assertSyntaxError("function f() { 'use strict'; var yield = 13; }");

  // The name of the NFE isn't let-bound in F/G, so this is valid.
  function f() { (function yield() {}); }
  function* g() { (function yield() {}); }

  // The name of the NFE is let-bound in the function/generator expression, so this is invalid.
  assertSyntaxError("function f() { (function* yield() {}); }");
  assertSyntaxError("function* g() { (function* yield() {}); }");

  // The name of the declaration is let-bound in F, so this is valid.
  function f() { function yield() {} }
  function f() { function* yield() {} }

  // The name of the declaration is let-bound in G, so this is invalid.
  assertSyntaxError("function* g() { function yield() {} }");
  assertSyntaxError("function* g() { function* yield() {} }");

  // In generators, yield is invalid as a formal argument name.
  assertSyntaxError("function* g(yield) { yield (10); }");

  if (typeof reportCompare == "function")
      reportCompare(true, true);`,
    'x = {}',
    'x = { }',
    `let x = 0;
    for (let i = 0, a = () => i; i < 4; i++) {
      assertEq(i, x++);
      assertEq(a(), 0);
    }
    assertEq(x, 4);

    x = 11;
    let q = 0;
    for (let {[++q]: r} = [0, 11, 22], s = () => r; r < 13; r++) {
      assertEq(r, x++);
      assertEq(s(), 11);
    }`,
    '() => f2({x: 1})',
    ' assertEqualsAsync(1, () => g6({x: 1}));',
    'async function f61(a = () => { "use strict"; return eval("x") }) { var x; return a(); }',
    '() => f1(4, 5);',
    'var f3 = (...let) => let + 42;',
    'function a(x, ...eval){return eval + x;}',
    'function b(x, ...let){return let + x;}',
    'function c(x, ...yield){return yield + x;}',
    '({}, y = { ...1 });',
    '({0: 0, 1: 1}, y = { ...[0, 1] });',
    '({}, { ...new Proxy({}, {}) });',
    '({a: 2}, y = { ...x, a: 2 });',
    '({a: 1, b: 1}, y = { ...x, b: 1 });',
    '({a: 1}, y = { a: 2, ...x });',
    '({a: 3}, y = { a: 2, ...x, a: 3 });',
    '({a: 1, b: 1}, y = { a:2, ...x, b: 1 });',
    '({a: 1, b: 1}, y = { ...x, ...z });',
    '({a: 2, b: 2}, y = { ...x, ...z, a:2, b: 2 });',
    '({a: 1, b: 1}, y = { a: 1, ...x, b: 2, ...z });',
    '({ a: 1 }, y = { ...x });',
    '() => { y = { ...p } }',
    'var { y, ...x } = { y: 1, a: 1 };',
    'var { z, y, ...x } = { z:1, y: 1, a: 1, b: 1 };',
    '({ a, ...b } = { a: 1, b: 2 });',
    '(({x, ...z}) => { assertEquals({y: 1}, z); })({ x: 1, y: 1});',
    '({ ...x[0] } = { a: 1 });',
    '({ ...x.f } = { a: 1 });',
    '({ foo: "foo", p0: "0", p1: "1", p2: "2", p3: "3" }, f(src));',
    'function f3(i,o){for(var x=i in o)parseInt(o[x]); return x}',
    'function f4(i,o){with(this)for(var x=i in o)parseInt(o[x]); return x}',
    '(function(){for(var x = arguments in []){} function x(){}})();',
    `var called = 0;
function reset() {
  called = 0;
}
var obj = {
  [Symbol.iterator]() {
    return {
      next() {
        return { value: 10, done: false };
      },
      return() {
        called++;
        return {};
      }
    };
  }
};

var a = (function () {
    for (var x in [0]) {
        try {} finally {
            return 11;
        }
    }
})();
assertEq(a, 11);

reset();
var b = (function () {
    for (var x of obj) {
        try {} finally {
            return 12;
        }
    }
})();

var c = (function () {
    for (var x in [0]) {
        for (var y of obj) {
            try {} finally {
                return 13;
            }
        }
    }
})();

var d = (function () {
    for (var x in [0]) {
        for (var y of obj) {
            try {} finally {
                for (var z in [0]) {
                    for (var w of obj) {
                        try {} finally {
                            return 14;
                        }
                    }
                }
            }
        }
    }
})();`,
    'let a = { async };',
    'let { async } = { async: 12 };',
    'let { async, other } = { async: 15, other: 16 };',
    `class X {
      constructor() {
        this.value = 42;
      }
      async getValue() {
        return this.value;
      }
      setValue(value) {
        this.value = value;
      }
      async increment() {
        var value = await this.getValue();
        this.setValue(value + 1);
        return this.getValue();
      }
      async getBaseClassName() {
        return 'X';
      }
      static async getStaticValue() {
        return 44;
      }
      async 10() {
        return 46;
      }
      async ["foo"]() {
        return 47;
      }
    }`,
    'function f({a = 0}, ...r){}',
    'function f(x = 0, {p: a = 0}){}',
    '(function(x = 0, {a = 0}){})',
    '(function(x = 0, {[0]: a}){})',
    '(function([a = 0], ...r){}.length, 1)',
    'function f({[0]: a}){}',
    'let a = { async() {} };',
    'let a = { async() {} };',
    'let a = { async() {} };',
    'let a = { async() {} };',
    'let a = { async() {} };',
    `var f1 = (...yield) => yield + 42;
assertEq(f1(), "42");
assertEq(f1(1), "142");

var f2 = (...eval) => eval + 42;
assertEq(f2(), "42");
assertEq(f2(1), "142");

var f3 = (...let) => let + 42;
assertEq(f3(), "42");
assertEq(f3(1), "142");

function g1(x, ...yield)
{
  return yield + x;
}
assertEq(g1(0, 42), "420");

function g2(x, ...eval)
{
  return eval + x;
}
assertEq(g2(0, 42), "420");

function g3(x, ...let)
{
  return let + x;
}`,
    'x = { answer: 42 }',
    'x = { true: 42 }',
    'x = { false: 42 }',
    'x = { x: 1, x: 2 }',
    'x = { get width() { return m_width } }',
    'x = { get undef() {} }',
    'x = { set width(w) { m_width = w } }',
    'x = { set if(w) { m_if = w } }',
    'x = { set true(w) { m_true = w } }',
    'x = { set 10(w) { m_null = w } }',
    '/* block comment */ 42',
    '42 /*The*/ /*Answer*/',
    '0e+100',
    '100',
    '0xabc',
    '0X1A',
    '"Hello\\412World"',
    //"\"Hello\\\r\nworld\"",
    '"Hello\\1World"',
    'var x = /[x-z]/i',
    'var x = /[a-c]/g',
    'var x = /[a-c]/u',
    'var x = /=([^=\\s])+/g',
    'universe(42).galaxies',
    'universe.true',
    'universe.false',
    'universe.null',
    'x++',
    '!x',
    'x << y',
    'x > y',
    'x * y / z',
    'x << y << z',
    'x || y ^ z',
    'eval = 42',
    'x /= 42',
    'x &= 42',
    '{ doThis(); doThat(); }',
    'var x',
    ';',
    'x, y',
    '\\u0061',
    'a\\u0061',
    'if (morning) goodMorning()',
    'do keep(); while (true)',
    'do keep(); while (true);',
    '{ do { } while (false);false }',
    'while (x < 10) { x++; y--; }',
    'for(;;);',
    'for(;;){}',
    'for(x = 0;;);',
    'for(var x = 0;;);',
    'for(x = 0; x < 42;);',
    'for(x = 0; x < 42; x++);',
    'for(x = 0; x < 42; x++) process(x);',
    'done: while (true) { break done }',
    'done: while (true) { break done; }',
    '"use\\x20strict"; with (x) foo = bar;',
    'switch (x) {}',
    'switch (answer) { case 42: hi(); break; }',
    'switch (answer) { case 42: hi(); break; default: break }',
    'done: switch (a) { default: break done }',
    'for(var x = 0, y = 1;;);',
    'start: for (;;) break start',
    'throw x;',
    'try { doThat(); } catch (e) { say(e) }',
    '(function test(t, t) { })',
    'function hello(a, ...rest) { }',
    'var hi = function() { sayHi() };',
    '{ x\n++y }',
    'var x /* comment */;',
    '{ throw error\nerror; }',
    '{ throw error// Comment\nerror; }',
    '123..toString(10)',
    'foo: 10; foo: 20;',
    'var x = function f() {} / 3;',
    '+function f() {} / 3;',
    'foo: function x() {} /regexp/',
    'x = {foo: function x() {} / divide}',
    'foo; function f() {} /regexp/',
    'let x, y;',
    'let eval = 42, arguments = 42',
    'let x = 14, y = 3, z = 1977',
    'for(let x = 0;;);',
    'for(let x = 0, y = 1;;);',
    'for (let x in list) process(x);',
    'var x = (1 + 2)',
    '(function () {} / 1)',
    'function f() {} / 1 /',
    'do /x/; while (false);',
    '0123. in/foo/i',
    '(foo = [])[0] = 4;',
    'for ((foo = []).bar in {}) {}',
    '((b), a=1)',
    '(x) = 1',
    'try {} catch (foo) { var foo; }',
    'try {} catch (foo) { try {} catch (_) { var foo; } }',
    'try {} catch (foo) { if (1) function foo() {} }',
    'try {} catch (foo) {} var foo;',
    'try {} catch (foo) {} let foo;',
    'try {} catch (foo) { { let foo; } }',
    'try {} catch (foo) { function x() { var foo; } }',
    'try {} catch (foo) { function x(foo) {} }',
    "'use strict'; let foo = function foo() {}",
    //'/**/ --> comment\n',
    'x.class++',
    '{function f() {} /regexp/}',
    'async function as(){ o = {f(await) {}} }',
    'async function as(){ o = {*f(await) {}} }',
    'async function as(){ o = {f(await) {}} }',
    'async function as(){ class A {*f(await) {}} }',
    'async function as(){ class A {f(await) {}} }',
    `function g8(h = () => arguments) {
  var arguments = 0;
  assertEq(arguments, 0);
  assertEq(arguments === h(), false);
}
g8();

function g9(h = () => arguments) {
  var arguments;
  assertEq(void 0 === arguments, false);
  assertEq(h(), arguments);
  arguments = 0;
  assertEq(arguments, 0);
  assertEq(arguments === h(), false);
}
g9();`,
    `var E;
(function (E) {
    E[E["e"] = -3] = "e";
})(E || (E = {}));`,
    '/*1*/(/*2*/ "foo" /*3*/)/*4*/',
    `//// [parenthesizedExpressionInternalComments.ts]
/*1*/(/*2*/ "foo" /*3*/)/*4*/
;

// open
/*1*/(
    // next
    /*2*/"foo"
    //close
    /*3*/)/*4*/
;


//// [parenthesizedExpressionInternalComments.js]
/*1*/ ( /*2*/"foo" /*3*/) /*4*/;
// open
/*1*/ (
// next
/*2*/ "foo"
//close
/*3*/ ) /*4*/;`,
    'var c = true ? (a) : function () { };',
    'const c = true ? (a) : function() {};',
    'const x1 = async (i) => await someOtherFunction(i);',
    'const x = (i) => __awaiter(this, void 0, void 0, function* () { return yield someOtherFunction(i); });',
    'const x1 = (i) => __awaiter(this, void 0, void 0, function* () { return yield someOtherFunction(i); });',
    ' var x = yield `abc${x}def`;',
    's = map("", ("", identity));',
    's = map("", (identity));',
    'let foo = (async bar => bar);',
    'var a = fun(function (x) { return x; }, 10);',
    ' if ("a" in (x)) {}',
    'function* gen() { var x = `abc${ yield 10 }def`;}',
    'var v = (a, b, c, d, e)',
    'const [a, b = a] = [1];',
    'let [a, b, c] = [1, 2, 3]; // no error',
    'var [x10, [y10, [z10]]] = [1, ["hello", [true]]];',
    'var { a: x11, b: { a: y11, b: { a: z11 }}} = { a: 1, b: { a: "hello", b: { a: true } } };',
    'var [x14, ...a6] = [1, 2, 3];',
    'var [[a0], [[a1]]] = []',
    'var { } = { x: 5, y: "hello" };',
    'var [] = [1, "hello"];',
    'var [x1, y1] = [1, "hello"]; ',
    'var a = [] = [1].map(_ => _);',
    `class B extends A {
  // async method with only call/get on 'super' does not require a binding
  async simple() {
      // call with property access
      super.x();
      // call additional property.
      super.y();

      // call with element access
      super["x"]();

      // property access (read)
      const a = super.x;

      // element access (read)
      const b = super["x"];
  }

  // async method with assignment/destructuring on 'super' requires a binding
  async advanced() {
      const f = () => {};

      // call with property access
      super.x();

      // call with element access
      super["x"]();

      // property access (read)
      const a = super.x;

      // element access (read)
      const b = super["x"];

      // property access (assign)
      super.x = f;

      // element access (assign)
      super["x"] = f;

      // destructuring assign with property access
      ({ f: super.x } = { f });

      // destructuring assign with element access
      ({ f: super["x"] } = { f });
  }
}

class A {
  x() {
  }
  y() {
  }
}
class B extends A {
  // async method with only call/get on 'super' does not require a binding
  async simple() {
      // call with property access
      super.x();
      // call additional property.
      super.y();
      // call with element access
      super["x"]();
      // property access (read)
      const a = super.x;
      // element access (read)
      const b = super["x"];
  }
  // async method with assignment/destructuring on 'super' requires a binding
  async advanced() {
      const f = () => { };
      // call with property access
      super.x();
      // call with element access
      super["x"]();
      // property access (read)
      const a = super.x;
      // element access (read)
      const b = super["x"];
      // property access (assign)
      super.x = f;
      // element access (assign)
      super["x"] = f;
      // destructuring assign with property access
      ({ f: super.x } = { f });
      // destructuring assign with element access
      ({ f: super["x"] } = { f });
  }
}`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }
});
