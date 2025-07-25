import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Miscellaneous - Escaped keywords', () => {
  for (const arg of [
    String.raw`(\u0069mplements = 1);`,
    String.raw`var impl\u0065ments = 1;`,
    String.raw`var { impl\u0065ments  } = {};`,
    String.raw`(\u0069nterface = 1);`,
    String.raw`({ def\u0061ult: 0 })`,
    String.raw`({ def\u{61}ult: 0 })`,
    String.raw`foo = {}; foo?.def\u{61}ult + 3;`,
    String.raw`foo = {}; foo.def\u{61}ult = 3;`,
    String.raw`var int\u0065rface = 1;`,
    String.raw`var { int\u0065rface  } = {};`,
    String.raw`(p\u0061ckage = 1);`,
    String.raw`var packa\u0067e = 1;`,
    String.raw`var { packa\u0067e  } = {};`,
    String.raw`(p\u0072ivate = 1);`,
    String.raw`var p\u0072ivate;`,
    String.raw`var { p\u0072ivate } = {};`,
    String.raw`(prot\u0065cted);`,
    String.raw`var prot\u0065cted = 1;`,
    String.raw`var { prot\u0065cted  } = {};`,
    String.raw`(publ\u0069c);`,
    String.raw`var publ\u0069c = 1;`,
    String.raw`var { publ\u0069c } = {};`,
    String.raw`(st\u0061tic);`,
    String.raw`var st\u0061tic = 1;`,
    String.raw`var { st\u0061tic } = {};`,
    'l\\u0065t\na',
    String.raw`if (true) l\u0065t: ;`,
    String.raw`function l\u0065t() { }`,
    String.raw`(function l\u0065t() { })`,
    String.raw`async function l\u0065t() { }`,
    String.raw`(async function l\u0065t() { })`,
    String.raw`(class { get st\u0061tic() {}})`,
    String.raw`(class { set st\u0061tic(x){}});`,
    String.raw`(class { *st\u0061tic() {}});`,
    String.raw`(class { st\u0061tic(){}});`,
    String.raw`(class { static get st\u0061tic(){}});`,
    String.raw`(class { static set st\u0061tic(x) {}});`,
    String.raw`l\u0065t => 42`,
    String.raw`(\u0061sync ())`,
    String.raw`async l\u0065t => 42`,
    String.raw`function packag\u0065() {}`,
    String.raw`function impl\u0065ments() {}`,
    String.raw`function privat\u0065() {}`,
    String.raw`(y\u0069eld);`,
    String.raw`var impl\u0065ments = 1;`,
    String.raw`var { impl\u0065ments  } = {};`,
    String.raw`(\u0069nterface = 1);`,
    String.raw`var int\u0065rface = 1;`,
    String.raw`var { int\u0065rface  } = {};`,
    String.raw`(p\u0061ckage = 1);`,
    String.raw`var packa\u0067e = 1;`,
    String.raw`var { packa\u0067e  } = {};`,
    String.raw`(p\u0072ivate = 1);`,
    String.raw`var p\u0072ivate;`,
    String.raw`var { p\u0072ivate } = {};`,
    String.raw`(prot\u0065cted);`,
    String.raw`var prot\u0065cted = 1;`,
    String.raw`var { prot\u0065cted  } = {};`,
    String.raw`(publ\u0069c);`,
    String.raw`var C = class { get "def\u{61}ult"() { return "get string"; } set "def\u{61}ult"(param) { stringSet = param; } };`,
    String.raw`var publ\u0069c = 1;`,
    String.raw`var { publ\u0069c } = {};`,
    String.raw`(st\u0061tic);`,
    String.raw`var st\u0061tic = 1;`,
    String.raw`var { st\u0061tic } = {};`,
    String.raw`var y\u0069eld = 1;`,
    String.raw`var { y\u0069eld } = {};`,
    String.raw`class aw\u0061it {}`,
    String.raw`aw\u0061it: 1;`,
    String.raw`function *a(){({yi\u0065ld: 0})}`,
    String.raw`\u0061sync`,
    'l\\u0065t\na',
    String.raw`l\u0065t`,
    outdent`
      function a() {
        \\u0061sync
        p => {}
      }
    `,
    outdent`
      (function a() {
        \\u0061sync
        p => {}
      })
    `,
    outdent`
      async function a() {
        \\u0061sync
        p => {}
      }
    `,
    String.raw`obj.bre\u0061k = 42;`,
    String.raw`for (\u0061sync of [7]);`,
    String.raw`0, { def\u{61}ult: x } = { default: 42 };`,
    String.raw`var y = { bre\u0061k: x } = { break: 42 };`,
    String.raw`var y = { c\u0061se: x } = { case: 42 };`,
    String.raw`var y = { c\u0061tch: x } = { catch: 42 };`,
    String.raw`var y = { \u0063onst: x } = { const: 42 };`,
    String.raw`var y = { \u0064ebugger: x } = { debugger: 42 };`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
  }

  for (const arg of [String.raw`obj.bre\u0061k = 42;`, String.raw`for (\u0061sync of [7]);`]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });
  }
  //
  fail('Miscellaneous - Escaped identifiers (failures)', [
    String.raw`(x === n\u0075ll);`,
    String.raw`var x = n\u0075ll;`,
    { code: String.raw`var x = { interf\u0061ce } = { interface: 42 };`, options: { sourceType: 'module' } },
    String.raw`var x = ({ w\u0069th }) => {};`,
    String.raw`var n\u0075ll = 1;`,
    String.raw`var { n\u0075ll } = { 1 };`,
    String.raw`n\u0075ll = 1;`,
    String.raw`(x === tr\u0075e);`,
    String.raw`var x = tr\u0075e;`,
    String.raw`var tr\u0075e = 1;`,
    String.raw`({ def\u0061ult })`,
    String.raw`var { tr\u0075e } = {};`,
    String.raw`tr\u0075e = 1;`,
    String.raw`(x === f\u0061lse);`,
    String.raw`var x = f\u0061lse;`,
    String.raw`var f\u0061lse = 1;`,
    String.raw`var { f\u0061lse } = {};`,
    String.raw`f\u0061lse = 1;`,
    String.raw`switch (this.a) { c\u0061se 6: break; }`,
    String.raw`try { } c\u0061tch (e) {}`,
    String.raw`switch (this.a) { d\u0065fault: break; }`,
    String.raw`class C \u0065xtends function B() {} {}`,
    String.raw`for (var a i\u006e this) {}`,
    String.raw`if (this \u0069nstanceof Array) {}`,
    String.raw`(n\u0065w function f() {})`,
    String.raw`(typ\u0065of 123)`,
    { code: String.raw`(function() {for (let l\u0065t in {}) {}})()`, options: { impliedStrict: true } },
    String.raw`cl\u0061ss Foo {}`,
    { code: String.raw`export function br\u0065ak() {}`, options: { sourceType: 'module' } },
    { code: String.raw`class aw\u0061it {}`, options: { sourceType: 'module' } },
    { code: String.raw`class l\u0065t {}`, options: { impliedStrict: true } },
    { code: String.raw`class st\u0061tic {}`, options: { impliedStrict: true } },
    String.raw`class st\u0061tic {}`,
    { code: String.raw`class yi\u0065ld {}`, options: { impliedStrict: true } },
    { code: String.raw`aw\u0061it: 1;`, options: { sourceType: 'module' } },
    String.raw`a(1,2\u0063onst foo = 1;`,
    { code: String.raw`let l\u0065t = 1`, options: { impliedStrict: true } },
    { code: String.raw`const l\u0065t = 1`, options: { impliedStrict: true } },
    { code: String.raw`let [l\u0065t] = 1`, options: { impliedStrict: true } },
    { code: String.raw`for (let l\u0065t in {}) {}`, options: { impliedStrict: true } },
    String.raw`(async ()=>{\u0061wait 100})()`,
    String.raw`(async ()=>{var \u0061wait = 100})()`,
    String.raw`\u0063o { } while(0)`,
    String.raw`v\u0061r`,
    String.raw`({\u0067et get(){}})`,
    String.raw`({\u0073et set(){}})`,
    { code: String.raw`import* \u0061s foo from "./icefapper.js";`, options: { sourceType: 'module' } },
    { code: String.raw`void \u0061sync function* f(){};`, options: { sourceType: 'module' } },
    String.raw`a(1,2\u0063onst foo = 1;`,
    String.raw`\u0063o { } while(0)`,
    String.raw`cl\u0061ss Foo {}`,
    String.raw`var {var:v\u0061r} = obj`,
    String.raw`[v\u{0061}r] = obj`,
    String.raw`function a({var:v\u{0061}r}) { }`,
    String.raw`(function v\u0061r() { })`,
    String.raw`(function a(v\u0061r) { })`,
    String.raw`(function a({v\u{0061}r}) { })`,
    String.raw`(function a([{v\u{0061}r}]) { })`,
    String.raw`(function a([[v\u{0061}r]]) { })`,
    String.raw`(function a({ hello: [v\u{0061}r]}) { })`,
    String.raw`(function a({ 0: {var:v\u{0061}r}}) { })`,
    String.raw`v\u0061r`,
    String.raw`var v\u0061r = 2000000;`,
    String.raw`var v\u{0061}r = 2000000`,
    String.raw`try { } catch(v\u{0061}r) { }`,
    { code: String.raw`var obj = { async method() { void \u0061wait; } };`, options: { impliedStrict: true } },
    String.raw`class C { async *gen() { void \u0061wait; }}`,
    String.raw`async() => { void \u0061wait; };`,
    String.raw`{for(o i\u006E {}){}}`,
    String.raw`class X { se\u0074 x(value) {} }`,
    String.raw`class X { st\u0061tic y() {} }`,
    String.raw`(function* () { y\u0069eld 10 })`,
    String.raw`({ \u0061sync x() { await x } })`,
    { code: String.raw`export \u0061sync function y() { await x }`, options: { sourceType: 'module' } },
    String.raw`{for(o i\u006E {}){}}`,
    { code: String.raw`impleme\u{006E}ts`, options: { impliedStrict: true } },
    { code: String.raw`impleme\u{006E}ts`, options: { sourceType: 'module' } },
    String.raw`'use strict'; impleme\u{006E}ts`,
    String.raw`[th\u{69}s] = []`,
    String.raw`th\u{69}s`,
    String.raw`[f\u0061lse] = []`,
    String.raw`f\u0061lse`,
    String.raw`class C { static async method() { void \u0061wait; }}`,
    String.raw`while (i < 10) { if (i++ & 1) c\u006fntinue; this.x++; }`,
    String.raw`(function a({ hello: {var:v\u{0061}r}}) { })`,
    String.raw`[v\u{0061}r] = obj`,
    String.raw`t\u0072y { true } catch (e) {}`,
    String.raw`var x = typ\u0065of "blah"`,
    String.raw`v\u0061r a = true`,
    String.raw`thi\u0073 = 123;`,
    String.raw`i\u0066 (false) {}`,
    String.raw`for (var i = 0; i < 100; ++i) { br\u0065ak; }`,
    String.raw`cl\u0061ss Foo {}`,
    String.raw`var f = f\u0075nction() {}`,
    String.raw`thr\u006fw 'boo';`,
    String.raw`var x = { n\u0065w } = { new: 42 };`,
    { code: String.raw`var x = { privat\u0065 } = { private: 42 };`, options: { sourceType: 'module' } },
    { code: String.raw`var x = { sup\u0065r } = { super: 42 };`, options: { sourceType: 'module' } },
    { code: String.raw`var x = { v\u0061r } = { var: 42 };`, options: { sourceType: 'module' } },
    { code: String.raw`var x = { privat\u0065 } = { private: 42 };`, options: { sourceType: 'module' } },
    String.raw`w\u0069th (this.scope) { }`,
    String.raw`n\u0075ll = 1;`,
    String.raw`(x === tr\u0075e);`,
    String.raw`do { ; } wh\u0069le (true) { }`,
    String.raw`class X { st\u0061tic y() {} }`,
    String.raw`class C { st\u0061tic set bar() {} }`,
    String.raw`class C { st\u0061tic *bar() {} }`,
    String.raw`if ("foo" \u0069n this) {}`,
    String.raw`if (this \u0069nstanceof Array) {}`,
    String.raw`(n\u0065w function f() {})`,
    String.raw`(typ\u0065of 123)`,
    String.raw`({ def\u{61}ult }) => 42;`,
    String.raw`0, { def\u{61}ult } = { default: 42 };`,
    String.raw`var x = ({ bre\u0061k }) => {};`,
    String.raw`var x = ({ tr\u0079 }) => {};`,
    String.raw`var x = ({ typ\u0065of }) => {};`,
    String.raw`def\u0061ult`,
    { code: String.raw`var x = { \u0069mport } = { import: 42 };`, options: { sourceType: 'module' } },
    String.raw`(v\u006fid 0)`,
    { code: String.raw`aw\u0061it: 1;`, options: { sourceType: 'module' } },
    String.raw`var \u{65}\u{6e}\u{75}\u{6d} = 123;`,
    String.raw`do { ; } wh\u0069le (true) { }`,
    String.raw`(function*() { return (n++, y\u0069eld 1); })()`,
    String.raw`var \u0064elete = 123;`,
    String.raw`var \u{62}\u{72}\u{65}\u{61}\u{6b} = 123;`,
    String.raw`var \u0062\u0072\u0065\u0061\u006b = 123;;`,
    String.raw`var \u{63}ase = 123;`,
    String.raw`var \u{63}atch = 123;`,
    String.raw`var x = { \u0066unction } = { function: 42 };`,
    String.raw`var \u{63}ontinue = 123;`,
    String.raw`var fina\u{6c}ly = 123;`,
    String.raw`var \u{64}\u{6f} = 123;`,
    String.raw`var gen = async function *g() { yi\u0065ld: ; };`,
    String.raw`function *gen() { yi\u0065ld: ; }`,
    String.raw`(function *gen() { yi\u0065ld: ; })`,
    String.raw`i\u0066 (0)`,
    String.raw`var i\u0066`,
    { code: String.raw`export {a \u0061s b} from "";`, options: { sourceType: 'module' } },
    { code: String.raw`export {} fr\u006fm "";`, options: { sourceType: 'module' } },
    String.raw`for (a o\u0066 b);`,
    String.raw`class a { st\u0061tic m(){} }`,
    String.raw`var \u{64}\u{6f} = 123;`,
    String.raw`(\u0061sync function() { await x })`,
    String.raw`(\u0061sync () => { await x })`,
    String.raw`\u0061sync x => { await x }`,
    String.raw`class X { \u0061sync x() { await x } }`,
    String.raw`class X { static \u0061sync x() { await x } }`,
    { code: String.raw`export \u0061sync function y() { await x }`, options: { sourceType: 'module' } },
    { code: String.raw`export default \u0061sync function () { await x }`, options: { sourceType: 'module' } },
    String.raw`for (x \u006ff y) {}`,
    String.raw`(async function() { aw\u0061it x })`,
    String.raw`(function*() { var y\u0069eld = 1; })()`,
    String.raw`(function*() { y\u0069eld 1; })()`,
    String.raw`wh\u0069le (true) { }`,
    String.raw`n\u0065w function f() {}`,
    String.raw`async () => { aw\u{61}it: x }`,
    String.raw`f\u006fr (var i = 0; i < 10; ++i);`,
    String.raw`try { } catch (e) {} f\u0069nally { }`,
    String.raw`d\u0065bugger;`,
    String.raw`if (d\u006f { true }) {}`,
    String.raw`\u{74}rue`,
    String.raw`var \u{64}\u{6f} = 123;`,
    { code: String.raw`var \u{64}\u{6f} = 123;`, options: { sourceType: 'module' } },
    { code: String.raw`a\u{0022}b=1`, options: { impliedStrict: true } },
    { code: String.raw`function impl\u0065ments() {}`, options: { impliedStrict: true } },
    { code: String.raw`function impl\u0065ments() {}`, options: { sourceType: 'module' } },
    { code: String.raw`var gen = function *() { void yi\u0065ld; };`, options: { sourceType: 'module' } },
    { code: String.raw`var gen = async function *g() { void \u0061wait; };`, options: { sourceType: 'module' } },
    { code: String.raw`var gen = async function *g() { void \u0061wait; };`, options: { sourceType: 'module' } },
    { code: String.raw`\u0061sync function* f(){}`, options: { sourceType: 'module' } },
    { code: String.raw`class l\u0065t {}`, options: { sourceType: 'module' } },
    { code: String.raw`class yi\u0065ld {}`, options: { sourceType: 'module' } },
    { code: String.raw`class l\u0065t {}`, options: { impliedStrict: true } },
    { code: String.raw`class yi\u0065ld {}`, options: { impliedStrict: true } },
    String.raw`class l\u0065t {}`,
    String.raw`class yi\u0065ld {}`,
    String.raw`class C { st\u0061tic m() {} }`,
    { code: String.raw`var C = class aw\u0061it {};`, options: { sourceType: 'module' } },
    String.raw`var gen = async function *() { var yi\u0065ld; };`,
    String.raw`var obj = { *method() { void yi\u0065ld; } };`,
    String.raw`var gen = function *g() { yi\u0065ld: ; };`,
    String.raw`({ \u0061sync* m(){}});`,
  ]);
});
