import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Statements - For in', () => {
  for (const arg of [
    'for (x+b in y);',
    'for (b++ in y);',
    'for ([...x,] in [[]]);',
    'for (x = 0 in {});',
    'for(o[0] = 0 in {});',
    'for ((a++) in c);',
    'for (+a().b in c);',
    'for (void a.b in c);',
    'for (/foo/ in {});',
    `for ("foo".x = z in y);`,
    `for ("foo" in y);`,
    'for ([...[a]] = 0 in   {});',
    'for ([] = 0 in {});',
    'for ([...[a]] = 0 in {});',
    'for ({x} = 0 in {});',
    'for ({p: x = 0} = 0 in {});',
    'for ([] = 0 of {});',
    'for ({x} = 0 of {});',
    'for([0] in 0);',
    'for({a: 0} in 0);',
    `for ({}.x);`,
    'for(const let in 0);',
    'for(let let of 0);',
    'for((0) of 0);',
    'for((0) in 0);',
    'for(([0]) in 0);',
    'for(({a: 0}) in 0);',
    'for(0 in 0);',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }
  // ForInOfLoopInitializer only applies in strict mode when webCompat is off
  for (const arg of [
    'for(var x=1 in [1,2,3]) 0',
    'for (var x = 1 in y) {}',
    'for (var a = 0 in {});',
    'for (var a = ++b in c);',
    'for (var a = b in c);',
    'for (var a = 0 in stored = a, {});',
    'for (var a = (++effects, -1) in x);',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.Strict);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict);
      });
    });
  }

  for (const arg of [
    '"use strict";\nfor (var a = 0 in {});',
    'for(var [] = 0 in {});',
    'for(var [,] = 0 in {});',
    'for(var [a] = 0 in {});',
    'for (([x])=y in z);',
    'for (a = 0 in {});',
    'for ([...x,] in [[]]) ;',
    'for(var [a = 0] = 0 in {});',
    'for(var [...a] = 0 in {});',
    'for(var [...[]] = 0 in {});',
    'for(var [...[a]] = 0 in {});',
    'for(var {} = 0 in {});',
    'for(var {p: x} = 0 in {});',
    'for(var {p: x = 0} = 0 in {});',
    'for(var {x} = 0 in {});',
    'for(var {x = 0} = 0 in {});',
    'for(let x = 0 in {});',
    'for(let [] = 0 in {});',
    'for(let [,] = 0 in {});',
    'for(let [a] = 0 in {});',
    'for(let [a = 0] = 0 in {});',
    'for(let [...a] = 0 in {});',
    'for(let [...[]] = 0 in {});',
    'for(let [...[a]] = 0 in {});',
    'for(let {} = 0 in {});',
    'for(let {p: x} = 0 in {});',
    'for(let {p: x = 0} = 0 in {});',
    'for(let {x} = 0 in {});',
    'for(let {x = 0} = 0 in {});',
    'for(const x = 0 in {});',
    'for(const [] = 0 in {});',
    'for(const [,] = 0 in {});',
    'for(const [a] = 0 in {});',
    'for(const [a = 0] = 0 in {});',
    'for(const [...a] = 0 in {});',
    'for(const [...[]] = 0 in {});',
    'for(const [...[a]] = 0 in {});',
    'for(const {} = 0 in {});',
    'for(const {p: x} = 0 in {});',
    'for(const {p: x = 0} = 0 in {});',
    'for(const {x} = 0 in {});',
    'for(const {x = 0} = 0 in {});',
    'for ([...x,] in [[]]);',
    'for ((x in b) in u) {};',
    'for (3in {});',
    'for (x = 5 in y) ;',
    'for (a?b:(c in y) in d)z;',
    'for (a,b in c);',
    'for (var a,b in c);',
    'for (var a=1,b in c);',
    'for (x+b++ in y);',
    'for (key instanceof bar in foo);',
    'for (a && b in c);',
    'for (~a[b] in c);',
    'for ((x=5)in y);',
    'for (x+b in y);',
    'for (b++ in y);',
    'for ((a,b) in c);',
    'for (((a,b)) in c);',
    'for (((a),b) in c);',
    'for ((a?b:c) in y)z;',
    'for (~a().b in c);',
    'for (~a()[b] in c);',
    'for (++a().b in c);',
    'for (++a()[b] in c);',
    'for (+a in c);',
    'for (+a.b in c);',
    'for (+a[b] in c);',
    'for (+a().b in c);',
    'for (+a()[b] in c);',
    'for (--a in c);',
    'for (--a.b in c);',
    'for (--a[b] in c);',
    'for (--a().b in c);',
    'for (--a()[b] in c);',
    'for (void a in c);',
    'for (void a.b in c);',
    'for (void a[b] in c);',
    'for ((a++) in c);',
    'for ((++a) in c);',
    'for ((--a) in c);',
    'for ((a--) in c);',
    'for ((x=a?b:c) in y)z;',
    'for ((x = [x in y]) in z);',
    'for ((x = {x:x in y}) in z);',
    'for (new a.b in c);',
    'for (5 in {});',
    "for ('x' in {});",
    'for (true in {});',
    'for (false in {});',
    'for (null in {});',
    'for (/foo/ in {});',
    'for (x = 0 in {});',
    'for(o[0] = 0 in {});',
    'for ((a++) in c);',
    'for (void a.b in c);',
    'for (/foo/ in {});',
    'for([...[]] = 0 in {});',
    'for([...[a]] = 0 in {});',
    'for({} = 0 in {});',
    'for({p: x} = 0 in {});',
    'for({p: x = 0} = 0 in {});',
    'for({x} = 0 in {});',
    'for({x = 0} = 0 in {});',
    'for(o.p = 0 in {});',
    'for(o[0] = 0 in {});',
    'for(f() = 0 in {});',
    'for(let a = 0 in b);',
    'for(const a = 0 in b);',
    'for(({a}) in 0);',
    'for(([a]) in 0);',
    'for(var [] = 0 in b);',
    'for(var {} = 0 in b);',
    'for(let a = 0 in b);',
    'for(const a = 0 in b);',
    '"use strict"; for(var a = 0 in b);',
    `for ("foo".x = y in y) {}`,
    `for ({}.x = y in y) {}`,
    'for ("foo".x in y',
    `for ([].x = y in y) {}`,
    'for (a() in b) break',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'for (var a = b, c, d, b = a ; x in b ; ) { break }',
    `for ([].x in y) {}`,
    'for (var {j} in x) { foo = j }',
    'for (var {j} in x) { [foo] = [j] }',
    'for (var {j} in x) { [[foo]=[42]] = [] }',
    'for (var {j} in x) { var foo = j }',
    'for (var {j} in x) { var [foo] = [j] }',
    'for (var {j} in x) { var [[foo]=[42]] = [] }',
    'for (var {j} in x) { var foo; foo = j }',
    `for ("foo".x in y) {}`,
    `for ("foo".x in y) {}`,
    `for ({}.x in y) {}`,
    'for (a[b in c] in d);',
    'for (var {j} in x) { var foo; [foo] = [j] }',
    'for (var {j} in x) { var foo; [[foo]=[42]] = [] }',
    'for (var {j} in x) { let foo; foo = j }',
    'for (var {j} in x) { let foo; [foo] = [j] }',
    'for (var {j} in x) { let foo; [[foo]=[42]] = [] }',
    'for (var {j} in x) { let foo = j }',
    'for (var {j} in x) { let [foo] = [j] }',
    'for (var {j} in x) { const foo = j }',
    'for (var {j} in x) { const [foo] = [j] }',
    'for (var {j} in x) { function foo() {return j} }',
    'for (let j in x) { foo = j }',
    'for (let j in x) { [foo] = [j] }',
    'for (let j in x) { [[foo]=[42]] = [] }',
    'for (let j in x) { var foo = j }',
    'for (let j in x) { var [foo] = [j] }',
    'for (let j in x) { var [[foo]=[42]] = [] }',
    'for (let j in x) { var foo; foo = j }',
    'for (let j in x) { var foo; [foo] = [j] }',
    'for (let j in x) { var foo; [[foo]=[42]] = [] }',
    'for (let j in x) { let foo; foo = j }',
    'for (let j in x) { let foo; [foo] = [j] }',
    'for (let j in x) { let foo; [[foo]=[42]] = [] }',
    'for (let j in x) { let foo = j }',
    'for (let j in x) { let [foo] = [j] }',
    'for (let j in x) { const foo = j }',
    'for (let j in x) { const [foo] = [j] }',
    'for (let j in x) { function foo() {return j} }',
    'for (let {j} in x) { foo = j }',
    'for (let {j} in x) { [foo] = [j] }',
    'for (let {j} in x) { [[foo]=[42]] = [] }',
    'for (let {j} in x) { var foo = j }',
    'for (let {j} in x) { var [foo] = [j] }',
    'for (let {j} in x) { var [[foo]=[42]] = [] }',
    'for (let {j} in x) { var foo; foo = j }',
    'for (let {j} in x) { var foo; [foo] = [j] }',
    'for (let {j} in x) { var foo; [[foo]=[42]] = [] }',
    'for (let {j} in x) { let foo; foo = j }',
    'for (let {j} in x) { let foo; [foo] = [j] }',
    'for (let {j} in x) { let foo; [[foo]=[42]] = [] }',
    'for (let {j} in x) { let foo = j }',
    'for (let {j} in x) { let [foo] = [j] }',
    'for (let {j} in x) { const foo = j }',
    'for (let {j} in x) { const [foo] = [j] }',
    'for (let {j} in x) { function foo() {return j} }',
    'for (const j in x) { foo = j }',
    'for (const j in x) { [foo] = [j] }',
    'for (const j in x) { [[foo]=[42]] = [] }',
    'for (const j in x) { var foo = j }',
    'for (const j in x) { var [foo] = [j] }',
    'for (const j in x) { var [[foo]=[42]] = [] }',
    'for (const j in x) { var foo; foo = j }',
    'for (const j in x) { var foo; [foo] = [j] }',
    'for (const j in x) { var foo; [[foo]=[42]] = [] }',
    'for (const j in x) { let foo; foo = j }',
    'for (const j in x) { let foo; [foo] = [j] }',
    'for (const j in x) { let foo; [[foo]=[42]] = [] }',
    'for (const j in x) { let foo = j }',
    'for (j in x) { foo = j }',
    'for (j in x) { [foo] = [j] }',
    'for (j in x) { [[foo]=[42]] = [] }',
    'for (j in x) { var foo = j }',
    'for (j in x) { var [foo] = [j] }',
    'for (j in x) { var [[foo]=[42]] = [] }',
    'for (j in x) { var foo; foo = j }',
    'for (j in x) { var foo; [foo] = [j] }',
    'for (j in x) { var foo; [[foo]=[42]] = [] }',
    'for (j in x) { let foo; foo = j }',
    'for (j in x) { let foo; [foo] = [j] }',
    'for (j in x) { let foo; [[foo]=[42]] = [] }',
    'for (j in x) { let foo = j }',
    'for (j in x) { let [foo] = [j] }',
    'for (j in x) { const foo = j }',
    'for (j in x) { const [foo] = [j] }',
    'for (j in x) { function foo() {return j} }',
    'for ({j} in x) { foo = j }',
    'for ({j} in x) { [foo] = [j] }',
    'for ({j} in x) { [[foo]=[42]] = [] }',
    'for ({j} in x) { var foo = j }',
    'for ({j} in x) { var [foo] = [j] }',
    'for ({j} in x) { var [[foo]=[42]] = [] }',
    'for ({j} in x) { var foo; foo = j }',
    'for ({j} in x) { var foo; [foo] = [j] }',
    'for ({j} in x) { var foo; [[foo]=[42]] = [] }',
    'for ({j} in x) { let foo; foo = j }',
    'for ({j} in x) { let foo; [foo] = [j] }',
    'for ({j} in x) { let foo; [[foo]=[42]] = [] }',
    'for ({j} in x) { let foo = j }',
    'for ({j} in x) { let [foo] = [j] }',
    'for ({j} in x) { const foo = j }',
    'for ({j} in x) { const [foo] = [j] }',
    'for ({j} in x) { function foo() {return j} }',
    'for (var j in x) { foo = j }',
    'for (var j in x) { [foo] = [j] }',
    'for (var j in x) { [[foo]=[42]] = [] }',
    'for (var j in x) { var foo = j }',
    'for (var j in x) { var [foo] = [j] }',
    'for (var j in x) { var [[foo]=[42]] = [] }',
    'for (var j in x) { var foo; foo = j }',
    'for (var j in x) { var foo; [foo] = [j] }',
    'for (var j in x) { var foo; [[foo]=[42]] = [] }',
    'for (var j in x) { let foo; foo = j }',
    'for (var j in x) { let foo; [foo] = [j] }',
    'for (var j in x) { let foo; [[foo]=[42]] = [] }',
    'for (var j in x) { let foo = j }',
    'for (var j in x) { let [foo] = [j] }',
    'for (var j in x) { const foo = j }',
    'for (var j in x) { const [foo] = [j] }',
    'for (var j in x) { function foo() {return j} }',
    'for (var {j} in x) { foo = j }',
    'for (let in {}) {}',
    'for (var let = 1; let < 1; let++) {}',
    'for (var let in {}) {}',
    'for (var [let] = 1; let < 1; let++) {}',
    'for (var [let] in {}) {}',
    'for (var {j} in x) { [foo] = [j] }',
    'for (var {j} in x) { [[foo]=[42]] = [] }',
    'for (var {j} in x) { var foo = j }',
    'for (var {j} in x) { var [foo] = [j] }',
    'for(var a in b);',
    'for(a in b);',
    'for(let of in of);',
    'for(const a in b);',
    'for (var {j} in x) { var [[foo]=[42]] = [] }',
    'for (var {j} in x) { var foo; foo = j }',
    'for (var {j} in x) { var foo; [foo] = [j] }',
    'for (var {j} in x) { var foo; [[foo]=[42]] = [] }',
    'for (var {j} in x) { let foo; foo = j }',
    'for (var {j} in x) { let foo; [foo] = [j] }',
    'for (var {j} in x) { let foo; [[foo]=[42]] = [] }',
    'for (var {j} in x) { let foo = j }',
    'for (var {j} in x) { let [foo] = [j] }',
    'for (var {j} in x) { const foo = j }',
    'for (var {j} in x) { const [foo] = [j] }',
    'for (var {j} in x) { function foo() {return j} }',
    'for (let j in x) { foo = j }',
    'for (let j in x) { [foo] = [j] }',
    'for (let j in x) { [[foo]=[42]] = [] }',
    'for (const j in x) { let [foo] = [j] }',
    'for (const j in x) { const foo = j }',
    'for (const j in x) { const [foo] = [j] }',
    'for (const j in x) { function foo() {return j} }',
    'for (const {j} in x) { foo = j }',
    'for (const {j} in x) { [foo] = [j] }',
    'for (const {j} in x) { [[foo]=[42]] = [] }',
    'for (const {j} in x) { var foo = j }',
    'for (const {j} in x) { var [foo] = [j] }',
    'for (const {j} in x) { var [[foo]=[42]] = [] }',
    'for (const {j} in x) { var foo; foo = j }',
    'for (const {j} in x) { var foo; [foo] = [j] }',
    'for (const {j} in x) { var foo; [[foo]=[42]] = [] }',
    'for (const {j} in x) { let foo; foo = j }',
    'for (const {j} in x) { let foo; [foo] = [j] }',
    'for (const {j} in x) { let foo; [[foo]=[42]] = [] }',
    'for (const {j} in x) { let foo = j }',
    'for (const {j} in x) { let [foo] = [j] }',
    'for (const {j} in x) { const foo = j }',
    'for (const {j} in x) { const [foo] = [j] }',
    'for (const {j} in x) { function foo() {return j} }',
    '2; for (var b in { x: 0 }) { 3; }',
    '2; for (const b in { x: 0 }) { 3; }',
    '2; for (let b in { x: 0 }) { 3; }',
    'for ( [let][1] in obj ) ;',
    'for (x.y in { attr: null }) {}',
    'for ((x) in { attr: null }) {}',
    'for ( let[x] in obj ) {}',
    'for ((a in b).x in {});',
    'for (x in null, { key: 0 }) {}',
    'for ((let.x) of []) {}',
    'for (let a = b => { return b in c; }; ;);',
    'for (let a = (b in c); ;);',
    'for (let a = (b in c && d); ;);',
    'for (let a = b => (b in c); ;);',
    'for (let a = ((b in c) && (d in e)); ;);',
    'for (let a = (b && c in d); ;);',
    'for (let a = (b => c => b in c); ;);',
    'for (/foo/g[x] in c) d;',
    'for (/foo/g.x in c) d;',
    'for (456[x] in c) d;',
    'for (456..x in c) d;',
    'for (/foo/[x] in c) d;',
    'for (/foo/.x in c) d;',
    'for ("foo"[x] in c) d;',
    'for ("foo".x in c) d;',
    'for (true.x in c) d;',
    'for ([][y] <<= p;;) x;',
    'for ([].w ^= s;;) x;',
    'for(function(){};;)x',
    'for(function(){if(x in 3);};;)x',
    'for ([].w ^= s;;) x;',
    'for ([][y] <<= p;;) x;',
    'for ([].u |= c;;) x;',
    'for ({}[y] ^= x;;) x;',
    'for ({}.u |= c;;) x;',
    'for ({}[y] ^= x;;) x;',
    'for (function(){ }[foo] in x);',
    'for (function(){ }[x in y] in x);',
    'for (function(){ if (a in b); }.prop in x);',
    'for (function(){ a in b; }.prop in x);',
    'for(function(){do;while(x in t)};;)x',
    'for(function(){while(x in y)t};;)x',
    'for (function(){};;);',
    'for (function(){ }[foo];;);',
    'for (function(){ }[x in y];;);',
    'for (function(){ if (a in b); };;);',
    'for (function(){ a in b; };;);',
    'for (function(){ a in b; }.foo;;);',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`async(); ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async(); ${arg}`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg} }`, undefined, Context.None);
      });
    });
  }

  fail('Statements - For in (fail)', [
    ['for (var x in {}) function* g() {}', Context.None],
    ['for ([(x, y)] in {}) {}', Context.None],
    ['for ({ m() {} } in {}) {}', Context.None],
    ['for (var x in {}) label1: label2: function f() {}', Context.None],
    ['for (x in {}) label1: label2: function f() {}', Context.None],
    ['for (let x in {}) label1: label2: function f() {}', Context.None],
    ['for (let x in {}) label1: label2: function f() {}', Context.None],
    ['for ([...x = 1] in [[]]) ;', Context.None],
    ['for ({ yield } in [{}]) ; });', Context.None],
    ['for ([...{ get x() {} }] in [[[]]]) ;', Context.None],
    ['for ({ x: [x = yield] } in [{ x: [] }]) ;', Context.Strict],
    ['for ({ x = yield } in [{}]) ;', Context.Strict],
    ['for(var {x = 0} = 0 in {});', Context.None],
    ['for ({ x: { x = yield } } in [{ x: {} }]) ;', Context.Strict],
    ['for ({...rest, b} in [{}]) ;', Context.None],
    ['for(let x = 0 in {});', Context.None],
    ['for ([...x,] in [[]]) ;', Context.None],
    ['for (const a = 0 in {});', Context.None],
    ['for (let a = 0 in {});', Context.None],
    ['for ({ m() {} } in {}) {}', Context.None],
    [`for (a=>b in c);`, Context.None],
    [`for ("foo" in y);`, Context.None],
    [`for ("foo".x = z in y);`, Context.None],
    [`for (()=>x in y);`, Context.None],
    [`for (()=>(x) in y);`, Context.None],
    ['for(([0]) in 0);', Context.None],
    ['for(({a: 0}) in 0);', Context.None],
    [`for ((()=>x) in y);`, Context.None],
    ['for (const [x,y,z] = 22 in foo);', Context.None],
    ['for (true ? 0 : 0 in {}; false; ) ;', Context.None],
    ['for (x = 22 in foo);', Context.None],
    ['for ({a:x,b:y,c:z} = 22 in foo);', Context.None],
    ['for ([x,y,z] = 22 in foo);', Context.None],
    ['for (const x = 22 in foo);', Context.None],
    ['for (const {a:x,b:y,c:z} = 22 in foo);', Context.None],
    [`for (0 = 0 in {});`, Context.None],
    [`for (i++ = 0 in {});`, Context.None],
    [`for (new F() = 0 in {});`, Context.None],
    [`for ("foo".x += z in y);`, Context.None],
    ['for (function () {} in a)', Context.None],
    ['for ([]);', Context.None],
    ['for (var [a] = 0 in {});', Context.None],
    ['for (var {a} = 0 in {});', Context.None],
    ['for(var [a = 0] = 0 in {});', Context.None],
    ['for (let in o) { }', Context.Strict],
    ['for(var [...a] = 0 in {});', Context.None],
    ['for (var a = () => { return "a"} in {});', Context.None],
    ['for (const ...x in y){}', Context.None],
    ['for (...x in y){}', Context.None],
    ['for (let a = b => b in c; ;);', Context.None],
    ['for(let x = 0 in {});', Context.None],
    ['for(let [] = 0 in {});', Context.None],
    ['for(let [,] = 0 in {});', Context.None],
    ['for (let x = 3 in {}) { }', Context.None],
    ['for (let x = 3, y in {}) { }', Context.None],
    ['for (let x = 3, y = 4 in {}) { }', Context.None],
    ['for (let x, y = 4 in {}) { }', Context.None],
    ['for (let x, y in {}) { }', Context.None],
    ['for(let [a] = 0 in {});', Context.None],
    ['for(const {x = 0} = 0 in {});', Context.None],
    ['for([,] = 0 in {});', Context.None],
    ['for([a] = 0 in {});', Context.None],
    ['for (let.x in {}) {}', Context.Strict],
    ['for (let in {}) { }', Context.Strict],
    ['"use strict"; for (let.x of []) {}', Context.Strict],
    ['"use strict"; for (let.x of []) {}', Context.None],
    ['for await (let.x of []) {}', Context.None],
    ['for (let + x in y);', Context.None],
    ['for (let => {} in y);', Context.None],
    ['for (let() in y);', Context.None],
    ['for (let, x in y);', Context.None],
    ['for await (let.x of []) {}', Context.Strict],
    ['"use strict"; for (let.x in {}) {}', Context.None],
    ['for([a] = 0 in {});', Context.None],
    ['for([a = 0] = 0 in {});', Context.None],
    ['for([...a] = 0 in {});', Context.None],
    ['for([...[a]] = 0 in {});', Context.None],
    ['for({} = 0 in {});', Context.None],
    ['for({p: x} = 0 in {});', Context.None],
    ['for({p: x = 0} = 0 in {});', Context.None],
    ['for({x} = 0 in {});', Context.None],
    ['for({x = 0} = 0 in {});', Context.None],
    ['for(f() = 0 in {});', Context.None],
    ['for(let [a = 0] = 0 in {});', Context.None],
    ['for(let [...a] = 0 in {});', Context.None],
    ['for(let [...[]] = 0 in {});', Context.None],
    ['for(let [...[a]] = 0 in {});', Context.None],
    ['for(let {} = 0 in {});', Context.None],
    ['for(let {p: x} = 0 in {});', Context.None],
    ['for(let {p: x = 0} = 0 in {});', Context.None],
    ['for(let {x} = 0 in {});', Context.None],
    ['for(let {x = 0} = 0 in {});', Context.None],
    ['for(const x = 0 in {});', Context.None],
    ['for(const [] = 0 in {});', Context.None],
    ['for(const [,] = 0 in {});', Context.None],
    ['for(const [a] = 0 in {});', Context.None],
    ['for ({ x: [(x, y)] } in [{ x: [] }]) ;', Context.None],
    ['for(let ? b : c in 0);', Context.None],
    ['for ({ eval } in [{}]) ;', Context.Strict],
    ['for ({ eval } in [{}]) ;', Context.OptionsWebCompat | Context.Strict],
    ['for (var i, j = void 0 in [1, 2, 3]) {}', Context.None],
    ['function foo() { for (var i, j of {}) {} }', Context.None],
    ['"use strict"; for ([ x = yield ] in [[]]) ;', Context.None],
    ['for ([[(x, y)]] in [[[]]]) ;', Context.None],
    ['"use strict"; for ([[x[yield]]] in [[[]]]) ;', Context.None],
    ['"use strict"; for ([{ x = yield }] in [[{}]]) ;', Context.None],
    ['for ([...x,] in [[]]) ;', Context.None],
    ['for ([...{ get x() {} }] in [[[]]]) ;', Context.None],
    ['for ([...{ get x() {} }] in [[[]]]) ;', Context.None],
    ['"use strict"; for ({ x = yield } in [{}]) ;', Context.None],
    ['for (let x in {}) label1: label2: function f() {}', Context.None],
    ['for (x in {}) label1: label2: function f() {}', Context.None],
    ['for (var [a] = 0 in {});', Context.None],
    ['"use strict"; for (var i=0 in j);', Context.None],
    ['for (var {x}=0 in y);', Context.None],
    ['"use strict"; for (var {x}=0 in y);', Context.None],
    ['or (var [p]=0 in q);', Context.None],
    ['"use strict"; for (var [p]=1 in q);', Context.None],
    ['for (const x = 0 in {});', Context.None],
    ['for (let x = 0 in {});', Context.None],
    ['for ((a--) in c);', Context.None],
    ['for (this in {}; ;);', Context.None],
    ['for (this in {});', Context.None],
    ['for (x = y in z) ;', Context.None],
    ['for (function(){} in x);', Context.None],
    ['for ((x = y) in z) ;', Context.None],
    ['for ([x + y] in obj);', Context.None],
    ['for ([x] = z in obj);', Context.None],
    ['for ([x.y] = z in obj);', Context.None],
    ['for ([x + y] = z in obj);', Context.None],
    ['for ({a: x + y} in obj);', Context.None],
    ['for ({x} = z in obj);', Context.None],
    ['for ({a: x.y} = z in obj);', Context.None],
    ['for ({a: x + y} = z in obj);', Context.None],
    ['for (let [let] in obj);', Context.None],
    ['for ("foo".bar = x in obj);', Context.None],
    ['for ({}.bar = x in obj);', Context.None],
    ['for ([].bar = x in obj);', Context.None],
    ['for ([]=1 in x);', Context.None],
  ]);
  pass('Statements - For in (pass)', [
    [
      'for ({x: a.b} in obj);',
      Context.None,
      
    ],

    [
      'for ("foo".bar in obj);',
      Context.None,
      
    ],
    [
      'for ({}.bar in obj);',
      Context.None,
      
    ],
    [
      'for ([].bar in obj);',
      Context.None,
      
    ],
    [
      'for (var {x : y} in obj);',
      Context.None,
      
    ],
    [
      'for(var x=1 in [1,2,3]) 0',
      Context.None,
      
    ],
    [
      'for (var [foo, bar=b] of arr);',
      Context.None,
      
    ],
    [
      'for (function* y() { new.target in /(?:()|[]|(?!))/iuy };; (null))  {}',
      Context.None,
      
    ],
    [
      'for (var {[x]: y} of obj);',
      Context.None,
      
    ],

    [
      'for (var {x = y} in obj);',
      Context.None,
      
    ],
    [
      'for (var [] in x);',
      Context.None,
      
    ],
    [
      'for (var [foo,] in arr);',
      Context.None,
      
    ],
    [
      'for (var a = b in c);',
      Context.None,
      
    ],
    [
      'for (var [foo,bar] in arr);',
      Context.OptionsRanges,
      
    ],
    [
      'for (let.x in {}) {}',
      Context.OptionsRanges,
      
    ],
    [
      'for (var [foo,,] in arr);',
      Context.OptionsRanges,
      
    ],
    [
      'for (var [foo=a, bar=b] in arr);',
      Context.OptionsRanges,
      
    ],
    [
      'for (var [,] in x);',
      Context.OptionsRanges,
      
    ],
    [
      'for (var [foo] in arr);',
      Context.None,
      
    ],
    [
      'for (var [foo=a] in arr);',
      Context.None,
      
    ],
    [
      'for (var [foo=a, bar] in arr);',
      Context.OptionsRanges,
      
    ],
    [
      'for (var [foo, bar=b] in arr);',
      Context.None,
      
    ],
    [
      'for (var [...foo] in obj);',
      Context.OptionsRanges,
      
    ],
    [
      'for (var {} in obj);',
      Context.None,
      
    ],
    [
      'for (var {x,} in obj);',
      Context.None,
      
    ],
    [
      'for (var {x, y} in obj);',
      Context.OptionsRanges,
      
    ],
    [
      'for (var {x} in obj);',
      Context.None,
      
    ],
    [
      'for (var {x = y} in obj);',
      Context.OptionsRanges,
      
    ],
    [
      'for (a in b);',
      Context.None,
      
    ],
    [
      'for (a in b); for (a in b); for (a in b);',
      Context.OptionsRanges,
      
    ],
    [
      'for (let a in b);',
      Context.None,
      
    ],
    [
      'for ([a,b] in x) a;',
      Context.OptionsRanges,
      
    ],
    [
      'for ([a,b] of x) a;',
      Context.OptionsRanges,
      
    ],
    [
      'for ({a,b} in x) a;',
      Context.None,
      
    ],
    [
      'for ({a,b} of x) a;',
      Context.OptionsRanges,
      
    ],
    [
      'for (const [...x] in y){}',
      Context.OptionsRanges,
      
    ],
    [
      'for (const {...x} in y){}',
      Context.OptionsRanges,
      
    ],
    [
      'for (var a=1;;);',
      Context.OptionsRanges,
      
    ],
    [
      'for (var a in b);',
      Context.None,
      
    ],
    [
      'for (let a in b);',
      Context.None,
      
    ],
    [
      'for (const a in b);',
      Context.None,
      
    ],
    [
      'for (a in b=c);',
      Context.None,
      
    ],
    [
      'for (var a = ++b in c);',
      Context.None,
      
    ],
    [
      'for (var a = 0 in stored = a, {});',
      Context.None,
      
    ],
    [
      'for (var a = (++effects, -1) in x);',
      Context.None,
      
    ],
    [
      'for (var a in stored = a, {a: 0, b: 1, c: 2});',
      Context.None,
      
    ],
    [
      'for (var a = (++effects, -1) in stored = a, {a: 0, b: 1, c: 2});',
      Context.OptionsWebCompat | Context.OptionsRanges,
      
    ],
    [
      'for ([a.b] in c) d',
      Context.None,
      
    ],
    [
      'for ([a.b].foo in c) d',
      Context.None,
      
    ],
    [
      'for ({a: b.c} in d) e',
      Context.None,
      
    ],
    [
      'for ({a: b.c}.foo in d) e',
      Context.None,
      
    ],
    [
      'for(let {a} in []) {}',
      Context.None,
      
    ],
    [
      'for(let [a = 1, ...b] in []) {}',
      Context.None,
      
    ],
    [
      'for(const {[Symbol.iterator]: a} in []){}',
      Context.None,
      
    ],
    [
      'for({a: a} in []){}',
      Context.None,
      
    ],
    [
      'for({"a": a} in []){}',
      Context.None,
      
    ],
    [
      'for({a=0} in b);',
      Context.None,
      
    ],
    [
      'for ({j} in x) { var [foo] = [j] }',
      Context.None,
      
    ],
    [
      'for (const {j} in x) { function foo() {return j} }',
      Context.None,
      
    ],
    [
      'for (const j in x) { let [foo] = [j] }',
      Context.None,
      
    ],
    [
      'for(ind in (hash={2:"b",1:"a",4:"d",3:"c"}))__str+=hash[ind]',
      Context.None,
      
    ],
    [
      'for ([arguments] in [[]]) ;',
      Context.None,
      
    ],
    [
      'for (let x in null, { key: 0 }) {}',
      Context.None,
      
    ],

    [
      'for(let [a=b in c] in null);',
      Context.None,
      
    ],
    [
      'for([{a=0}] in b);',
      Context.None,
      
    ],
    /*[
      'for(var a = 0 in b, c);',
      Context.None,
      {
        "type": "Program",
        "sourceType": "script",
        "body": [
          {
            "type": "ForInStatement",
            "body": {
              "type": "EmptyStatement"
            },
            "left": {
              "type": "VariableDeclaration",
              "kind": "var",
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "init": {
                    "type": "Literal",
                    "value": 0
                  },
                  "id": {
                    "type": "Identifier",
                    "name": "a"
                  }
                }
              ]
            },
            "right": {
              "type": "SequenceExpression",
              "expressions": [
                {
                  "type": "Identifier",
                  "name": "b"
                },
                {
                  "type": "Identifier",
                  "name": "c"
                }
              ]
            }
          }
        ]
      }],*/
    [
      'for(var a in b, c);',
      Context.None,
      
    ],
    [
      'for ([...{ x = yield }] in [[{}]]) ;',
      Context.None,
      
    ],
    [
      'for ( [let][1] in obj ) ;',
      Context.None,
      
    ],
    [
      'for ((x) in { attr: null }) {}',
      Context.None,
      
    ],
    [
      '2; for (var b in { x: 0 }) { 3; }',
      Context.None,
      
    ],
    [
      `for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
          if (p === "prop1") {
              countProp1++;
          }
          if (p === "prop2") {
              countProp2++;
          }
          if (p === "prop3") {
              countProp3++;
          }
      }
  }`,
      Context.None,
      
    ],
    [
      'for(x in list) process(x);',
      Context.None,
      
    ],
    [
      'for (var x in list) process(x);',
      Context.None,
      
    ],
    [
      'for ([...x] in {ab: a}) {}',
      Context.None,
      
    ],
    [
      'for (let {j} in x) { var [foo] = [j] }',
      Context.None,
      
    ],
    [
      'for(x of "foo" in {}) {}',
      Context.None,
      
    ],
    [
      'for (x in {a: b}) {}',
      Context.None,
      
    ],
    [
      'function foo(){ "use strict"; for(x in {}, {}) {} }',
      Context.None,
      
    ],
    [
      'for(const x in [1,2,3]) {}',
      Context.None,
      
    ],
  ]);
});
