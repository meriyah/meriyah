import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
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
    'for(0 in 0);'
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
    'for (var a = (++effects, -1) in x);'
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
    'for (a() in b) break'
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
    'for (function(){ a in b; }.foo;;);'
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
    ['for ([]=1 in x);', Context.None]
  ]);
  pass('Statements - For in (pass)', [
    [
      'for ({x: a.b} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],

    [
      'for ("foo".bar in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'MemberExpression',
              object: {
                type: 'Literal',
                value: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'bar'
              }
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for ({}.bar in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'MemberExpression',
              object: {
                type: 'ObjectExpression',
                properties: []
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'bar'
              }
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for ([].bar in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'MemberExpression',
              object: {
                type: 'ArrayExpression',
                elements: []
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'bar'
              }
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (var {x : y} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for(var x=1 in [1,2,3]) 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Literal',
                value: 0
              }
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Literal',
                    value: 1
                  },
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Literal',
                  value: 2
                },
                {
                  type: 'Literal',
                  value: 3
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'for (var [foo, bar=b] of arr);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForOfStatement',
            await: false,
            left: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            },
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (function* y() { new.target in /(?:()|[]|(?!))/iuy };; (null))  {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            init: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {
                        meta: {
                          type: 'Identifier',
                          name: 'new'
                        },
                        type: 'MetaProperty',
                        property: {
                          type: 'Identifier',
                          name: 'target'
                        }
                      },
                      right: {
                        type: 'Literal',
                        // eslint-disable-next-line no-empty-character-class
                        value: /(?:()|[]|(?!))/iuy,
                        regex: {
                          pattern: '(?:()|[]|(?!))',
                          flags: 'iuy'
                        }
                      },
                      operator: 'in'
                    }
                  }
                ]
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'y'
              }
            },
            test: null,
            update: {
              type: 'Literal',
              value: null
            }
          }
        ]
      }
    ],
    [
      'for (var {[x]: y} of obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: true,
                        value: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            },
            await: false
          }
        ]
      }
    ],

    [
      'for (var {x = y} in obj);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForInStatement',
            left: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        },
                        kind: 'init',
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var [] in x);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForInStatement',
            left: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ArrayPattern',
                    elements: []
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var [foo,] in arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        ]
      }
    ],
    [
      'for (var a = b in c);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForInStatement',
            left: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  init: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              name: 'c'
            },
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var [foo,bar] in arr);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        range: [0, 27],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 27,
            range: [0, 27],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 18,
              range: [5, 18],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 18,
                  range: [9, 18],
                  id: {
                    type: 'ArrayPattern',
                    start: 9,
                    end: 18,
                    range: [9, 18],
                    elements: [
                      {
                        type: 'Identifier',
                        start: 10,
                        end: 13,
                        range: [10, 13],
                        name: 'foo'
                      },
                      {
                        type: 'Identifier',
                        start: 14,
                        end: 17,
                        range: [14, 17],
                        name: 'bar'
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              start: 22,
              end: 25,
              range: [22, 25],
              name: 'arr'
            },
            body: {
              type: 'EmptyStatement',
              start: 26,
              end: 27,
              range: [26, 27]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let.x in {}) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        range: [0, 20],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 20,
            range: [0, 20],
            left: {
              type: 'MemberExpression',
              start: 5,
              end: 10,
              range: [5, 10],
              object: {
                type: 'Identifier',
                start: 5,
                end: 8,
                range: [5, 8],
                name: 'let'
              },
              property: {
                type: 'Identifier',
                start: 9,
                end: 10,
                range: [9, 10],
                name: 'x'
              },
              computed: false
            },
            right: {
              type: 'ObjectExpression',
              start: 14,
              end: 16,
              range: [14, 16],
              properties: []
            },
            body: {
              type: 'BlockStatement',
              start: 18,
              end: 20,
              range: [18, 20],
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var [foo,,] in arr);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 25,
            range: [0, 25],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 16,
              range: [5, 16],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 16,
                  range: [9, 16],
                  id: {
                    type: 'ArrayPattern',
                    start: 9,
                    end: 16,
                    range: [9, 16],
                    elements: [
                      {
                        type: 'Identifier',
                        start: 10,
                        end: 13,
                        range: [10, 13],
                        name: 'foo'
                      },
                      null
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              start: 20,
              end: 23,
              range: [20, 23],
              name: 'arr'
            },
            body: {
              type: 'EmptyStatement',
              start: 24,
              end: 25,
              range: [24, 25]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var [foo=a, bar=b] in arr);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 32,
        range: [0, 32],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 32,
            range: [0, 32],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 23,
              range: [5, 23],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 23,
                  range: [9, 23],
                  id: {
                    type: 'ArrayPattern',
                    start: 9,
                    end: 23,
                    range: [9, 23],
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        start: 10,
                        end: 15,
                        range: [10, 15],
                        left: {
                          type: 'Identifier',
                          start: 10,
                          end: 13,
                          range: [10, 13],
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          start: 14,
                          end: 15,
                          range: [14, 15],
                          name: 'a'
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        start: 17,
                        end: 22,
                        range: [17, 22],
                        left: {
                          type: 'Identifier',
                          start: 17,
                          end: 20,
                          range: [17, 20],
                          name: 'bar'
                        },
                        right: {
                          type: 'Identifier',
                          start: 21,
                          end: 22,
                          range: [21, 22],
                          name: 'b'
                        }
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              start: 27,
              end: 30,
              range: [27, 30],
              name: 'arr'
            },
            body: {
              type: 'EmptyStatement',
              start: 31,
              end: 32,
              range: [31, 32]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var [,] in x);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 12,
              range: [5, 12],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 12,
                  range: [9, 12],
                  id: {
                    type: 'ArrayPattern',
                    start: 9,
                    end: 12,
                    range: [9, 12],
                    elements: [null]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              start: 16,
              end: 17,
              range: [16, 17],
              name: 'x'
            },
            body: {
              type: 'EmptyStatement',
              start: 18,
              end: 19,
              range: [18, 19]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var [foo] in arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        ]
      }
    ],
    [
      'for (var [foo=a] in arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        ]
      }
    ],
    [
      'for (var [foo=a, bar] in arr);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 30,
        range: [0, 30],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 30,
            range: [0, 30],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 21,
              range: [5, 21],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 21,
                  range: [9, 21],
                  id: {
                    type: 'ArrayPattern',
                    start: 9,
                    end: 21,
                    range: [9, 21],
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        start: 10,
                        end: 15,
                        range: [10, 15],
                        left: {
                          type: 'Identifier',
                          start: 10,
                          end: 13,
                          range: [10, 13],
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          start: 14,
                          end: 15,
                          range: [14, 15],
                          name: 'a'
                        }
                      },
                      {
                        type: 'Identifier',
                        start: 17,
                        end: 20,
                        range: [17, 20],
                        name: 'bar'
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              start: 25,
              end: 28,
              range: [25, 28],
              name: 'arr'
            },
            body: {
              type: 'EmptyStatement',
              start: 29,
              end: 30,
              range: [29, 30]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var [foo, bar=b] in arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            }
          }
        ]
      }
    ],
    [
      'for (var [...foo] in obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 26,
            range: [0, 26],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 17,
              range: [5, 17],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 17,
                  range: [9, 17],
                  id: {
                    type: 'ArrayPattern',
                    start: 9,
                    end: 17,
                    range: [9, 17],
                    elements: [
                      {
                        type: 'RestElement',
                        start: 10,
                        end: 16,
                        range: [10, 16],
                        argument: {
                          type: 'Identifier',
                          start: 13,
                          end: 16,
                          range: [13, 16],
                          name: 'foo'
                        }
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              start: 21,
              end: 24,
              range: [21, 24],
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement',
              start: 25,
              end: 26,
              range: [25, 26]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var {} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: []
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (var {x,} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (var {x, y} in obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        range: [0, 24],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 24,
            range: [0, 24],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 15,
              range: [5, 15],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 15,
                  range: [9, 15],
                  id: {
                    type: 'ObjectPattern',
                    start: 9,
                    end: 15,
                    range: [9, 15],
                    properties: [
                      {
                        type: 'Property',
                        start: 10,
                        end: 11,
                        range: [10, 11],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'x'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'x'
                        }
                      },
                      {
                        type: 'Property',
                        start: 13,
                        end: 14,
                        range: [13, 14],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 13,
                          end: 14,
                          range: [13, 14],
                          name: 'y'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 13,
                          end: 14,
                          range: [13, 14],
                          name: 'y'
                        }
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              start: 19,
              end: 22,
              range: [19, 22],
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement',
              start: 23,
              end: 24,
              range: [23, 24]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var {x} in obj);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForInStatement',
            left: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        kind: 'init',
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var {x = y} in obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 25,
            range: [0, 25],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 16,
              range: [5, 16],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 16,
                  range: [9, 16],
                  id: {
                    type: 'ObjectPattern',
                    start: 9,
                    end: 16,
                    range: [9, 16],
                    properties: [
                      {
                        type: 'Property',
                        start: 10,
                        end: 15,
                        range: [10, 15],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'x'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 10,
                          end: 15,
                          range: [10, 15],
                          left: {
                            type: 'Identifier',
                            start: 10,
                            end: 11,
                            range: [10, 11],
                            name: 'x'
                          },
                          right: {
                            type: 'Identifier',
                            start: 14,
                            end: 15,
                            range: [14, 15],
                            name: 'y'
                          }
                        }
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'Identifier',
              start: 20,
              end: 23,
              range: [20, 23],
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement',
              start: 24,
              end: 25,
              range: [24, 25]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (a in b);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'Identifier',
              name: 'b'
            }
          }
        ]
      }
    ],
    [
      'for (a in b); for (a in b); for (a in b);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 41,
        range: [0, 41],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            left: {
              type: 'Identifier',
              start: 5,
              end: 6,
              range: [5, 6],
              name: 'a'
            },
            right: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'b'
            },
            body: {
              type: 'EmptyStatement',
              start: 12,
              end: 13,
              range: [12, 13]
            }
          },
          {
            type: 'ForInStatement',
            start: 14,
            end: 27,
            range: [14, 27],
            left: {
              type: 'Identifier',
              start: 19,
              end: 20,
              range: [19, 20],
              name: 'a'
            },
            right: {
              type: 'Identifier',
              start: 24,
              end: 25,
              range: [24, 25],
              name: 'b'
            },
            body: {
              type: 'EmptyStatement',
              start: 26,
              end: 27,
              range: [26, 27]
            }
          },
          {
            type: 'ForInStatement',
            start: 28,
            end: 41,
            range: [28, 41],
            left: {
              type: 'Identifier',
              start: 33,
              end: 34,
              range: [33, 34],
              name: 'a'
            },
            right: {
              type: 'Identifier',
              start: 38,
              end: 39,
              range: [38, 39],
              name: 'b'
            },
            body: {
              type: 'EmptyStatement',
              start: 40,
              end: 41,
              range: [40, 41]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let a in b);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            }
          }
        ]
      }
    ],
    [
      'for ([a,b] in x) a;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            left: {
              type: 'ArrayPattern',
              start: 5,
              end: 10,
              range: [5, 10],
              elements: [
                {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'b'
                }
              ]
            },
            right: {
              type: 'Identifier',
              start: 14,
              end: 15,
              range: [14, 15],
              name: 'x'
            },
            body: {
              type: 'ExpressionStatement',
              start: 17,
              end: 19,
              range: [17, 19],
              expression: {
                type: 'Identifier',
                start: 17,
                end: 18,
                range: [17, 18],
                name: 'a'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for ([a,b] of x) a;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ForOfStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            await: false,
            left: {
              type: 'ArrayPattern',
              start: 5,
              end: 10,
              range: [5, 10],
              elements: [
                {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'b'
                }
              ]
            },
            right: {
              type: 'Identifier',
              start: 14,
              end: 15,
              range: [14, 15],
              name: 'x'
            },
            body: {
              type: 'ExpressionStatement',
              start: 17,
              end: 19,
              range: [17, 19],
              expression: {
                type: 'Identifier',
                start: 17,
                end: 18,
                range: [17, 18],
                name: 'a'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for ({a,b} in x) a;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'a'
              }
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'for ({a,b} of x) a;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ForOfStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            await: false,
            left: {
              type: 'ObjectPattern',
              start: 5,
              end: 10,
              range: [5, 10],
              properties: [
                {
                  type: 'Property',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    range: [6, 7],
                    name: 'a'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    range: [6, 7],
                    name: 'a'
                  }
                },
                {
                  type: 'Property',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    range: [8, 9],
                    name: 'b'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    range: [8, 9],
                    name: 'b'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              start: 14,
              end: 15,
              range: [14, 15],
              name: 'x'
            },
            body: {
              type: 'ExpressionStatement',
              start: 17,
              end: 19,
              range: [17, 19],
              expression: {
                type: 'Identifier',
                start: 17,
                end: 18,
                range: [17, 18],
                name: 'a'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (const [...x] in y){}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 25,
            range: [0, 25],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 17,
              range: [5, 17],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 11,
                  end: 17,
                  range: [11, 17],
                  id: {
                    type: 'ArrayPattern',
                    start: 11,
                    end: 17,
                    range: [11, 17],
                    elements: [
                      {
                        type: 'RestElement',
                        start: 12,
                        end: 16,
                        range: [12, 16],
                        argument: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
                          range: [15, 16],
                          name: 'x'
                        }
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'const'
            },
            right: {
              type: 'Identifier',
              start: 21,
              end: 22,
              range: [21, 22],
              name: 'y'
            },
            body: {
              type: 'BlockStatement',
              start: 23,
              end: 25,
              range: [23, 25],
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (const {...x} in y){}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 25,
            range: [0, 25],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 17,
              range: [5, 17],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 11,
                  end: 17,
                  range: [11, 17],
                  id: {
                    type: 'ObjectPattern',
                    start: 11,
                    end: 17,
                    range: [11, 17],
                    properties: [
                      {
                        type: 'RestElement',
                        start: 12,
                        end: 16,
                        range: [12, 16],
                        argument: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
                          range: [15, 16],
                          name: 'x'
                        }
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'const'
            },
            right: {
              type: 'Identifier',
              start: 21,
              end: 22,
              range: [21, 22],
              name: 'y'
            },
            body: {
              type: 'BlockStatement',
              start: 23,
              end: 25,
              range: [23, 25],
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var a=1;;);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ForStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            init: {
              type: 'VariableDeclaration',
              start: 5,
              end: 12,
              range: [5, 12],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 12,
                  range: [9, 12],
                  id: {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'a'
                  },
                  init: {
                    type: 'Literal',
                    start: 11,
                    end: 12,
                    range: [11, 12],
                    value: 1
                  }
                }
              ],
              kind: 'var'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement',
              start: 15,
              end: 16,
              range: [15, 16]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var a in b);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            }
          }
        ]
      }
    ],
    [
      'for (let a in b);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            }
          }
        ]
      }
    ],
    [
      'for (const a in b);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            }
          }
        ]
      }
    ],
    [
      'for (a in b=c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'b'
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ]
      }
    ],
    [
      'for (var a = ++b in c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'UpdateExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    operator: '++',
                    prefix: true
                  },
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (var a = 0 in stored = a, {});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Literal',
                    value: 0
                  },
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'stored'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'a'
                  }
                },
                {
                  type: 'ObjectExpression',
                  properties: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'for (var a = (++effects, -1) in x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'UpdateExpression',
                        argument: {
                          type: 'Identifier',
                          name: 'effects'
                        },
                        operator: '++',
                        prefix: true
                      },
                      {
                        type: 'UnaryExpression',
                        operator: '-',
                        argument: {
                          type: 'Literal',
                          value: 1
                        },
                        prefix: true
                      }
                    ]
                  },
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'for (var a in stored = a, {a: 0, b: 1, c: 2});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'stored'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'a'
                  }
                },
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        value: 0
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'Literal',
                        value: 1
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      value: {
                        type: 'Literal',
                        value: 2
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'for (var a = (++effects, -1) in stored = a, {a: 0, b: 1, c: 2});',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 64,
        range: [0, 64],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 64,
            range: [0, 64],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 28,
              range: [5, 28],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 28,
                  range: [9, 28],
                  id: {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'a'
                  },
                  init: {
                    type: 'SequenceExpression',
                    start: 14,
                    end: 27,
                    range: [14, 27],
                    expressions: [
                      {
                        type: 'UpdateExpression',
                        start: 14,
                        end: 23,
                        range: [14, 23],
                        operator: '++',
                        prefix: true,
                        argument: {
                          type: 'Identifier',
                          start: 16,
                          end: 23,
                          range: [16, 23],
                          name: 'effects'
                        }
                      },
                      {
                        type: 'UnaryExpression',
                        start: 25,
                        end: 27,
                        range: [25, 27],
                        operator: '-',
                        prefix: true,
                        argument: {
                          type: 'Literal',
                          start: 26,
                          end: 27,
                          range: [26, 27],
                          value: 1
                        }
                      }
                    ]
                  }
                }
              ],
              kind: 'var'
            },
            right: {
              type: 'SequenceExpression',
              start: 32,
              end: 62,
              range: [32, 62],
              expressions: [
                {
                  type: 'AssignmentExpression',
                  start: 32,
                  end: 42,
                  range: [32, 42],
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 32,
                    end: 38,
                    range: [32, 38],
                    name: 'stored'
                  },
                  right: {
                    type: 'Identifier',
                    start: 41,
                    end: 42,
                    range: [41, 42],
                    name: 'a'
                  }
                },
                {
                  type: 'ObjectExpression',
                  start: 44,
                  end: 62,
                  range: [44, 62],
                  properties: [
                    {
                      type: 'Property',
                      start: 45,
                      end: 49,
                      range: [45, 49],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 45,
                        end: 46,
                        range: [45, 46],
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        start: 48,
                        end: 49,
                        range: [48, 49],
                        value: 0
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 51,
                      end: 55,
                      range: [51, 55],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 51,
                        end: 52,
                        range: [51, 52],
                        name: 'b'
                      },
                      value: {
                        type: 'Literal',
                        start: 54,
                        end: 55,
                        range: [54, 55],
                        value: 1
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 57,
                      end: 61,
                      range: [57, 61],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 57,
                        end: 58,
                        range: [57, 58],
                        name: 'c'
                      },
                      value: {
                        type: 'Literal',
                        start: 60,
                        end: 61,
                        range: [60, 61],
                        value: 2
                      },
                      kind: 'init'
                    }
                  ]
                }
              ]
            },
            body: {
              type: 'EmptyStatement',
              start: 63,
              end: 64,
              range: [63, 64]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for ([a.b] in c) d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'd'
              }
            },
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for ([a.b].foo in c) d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'd'
              }
            },
            left: {
              type: 'MemberExpression',
              object: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  }
                ]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'foo'
              }
            },
            right: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for ({a: b.c} in d) e',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'e'
              }
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'c'
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'd'
            }
          }
        ]
      }
    ],
    [
      'for ({a: b.c}.foo in d) e',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'e'
              }
            },
            left: {
              type: 'MemberExpression',
              object: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'c'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'foo'
              }
            },
            right: {
              type: 'Identifier',
              name: 'd'
            }
          }
        ]
      }
    ],
    [
      'for(let {a} in []) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            }
          }
        ]
      }
    ],
    [
      'for(let [a = 1, ...b] in []) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        right: {
                          type: 'Literal',
                          value: 1
                        }
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            }
          }
        ]
      }
    ],
    [
      'for(const {[Symbol.iterator]: a} in []){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'Symbol'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'iterator'
                          }
                        },
                        computed: true,
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            }
          }
        ]
      }
    ],
    [
      'for({a: a} in []){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            }
          }
        ]
      }
    ],
    [
      'for({"a": a} in []){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: []
            }
          }
        ]
      }
    ],
    [
      'for({a=0} in b);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      value: 0
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            }
          }
        ]
      }
    ],
    [
      'for ({j} in x) { var [foo] = [j] }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'j'
                          }
                        ]
                      },
                      id: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'foo'
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            },
            left: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'j'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'j'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'for (const {j} in x) { function foo() {return j} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: {
                          type: 'Identifier',
                          name: 'j'
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'j'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'j'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'for (const j in x) { let [foo] = [j] }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'j'
                          }
                        ]
                      },
                      id: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'foo'
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'j'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'for(ind in (hash={2:"b",1:"a",4:"d",3:"c"}))__str+=hash[ind]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: '__str'
                },
                operator: '+=',
                right: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'hash'
                  },
                  computed: true,
                  property: {
                    type: 'Identifier',
                    name: 'ind'
                  }
                }
              }
            },
            left: {
              type: 'Identifier',
              name: 'ind'
            },
            right: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'hash'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 2
                    },
                    value: {
                      type: 'Literal',
                      value: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 1
                    },
                    value: {
                      type: 'Literal',
                      value: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 4
                    },
                    value: {
                      type: 'Literal',
                      value: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 3
                    },
                    value: {
                      type: 'Literal',
                      value: 'c'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'for ([arguments] in [[]]) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'Identifier',
                  name: 'arguments'
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'for (let x in null, { key: 0 }) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            },
            right: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'Literal',
                  value: null
                },
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'key'
                      },
                      value: {
                        type: 'Literal',
                        value: 0
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],

    [
      'for(let [a=b in c] in null);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        right: {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'c'
                          },
                          operator: 'in'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Literal',
              value: null
            }
          }
        ]
      }
    ],
    [
      'for([{a=0}] in b);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        right: {
                          type: 'Literal',
                          value: 0
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'b'
            }
          }
        ]
      }
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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            },
            right: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'b'
                },
                {
                  type: 'Identifier',
                  name: 'c'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'for ([...{ x = yield }] in [[{}]]) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'RestElement',
                  argument: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'yield'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'for ( [let][1] in obj ) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'MemberExpression',
              object: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'let'
                  }
                ]
              },
              computed: true,
              property: {
                type: 'Literal',
                value: 1
              }
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for ((x) in { attr: null }) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'Identifier',
              name: 'x'
            },
            right: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'attr'
                  },
                  value: {
                    type: 'Literal',
                    value: null
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '2; for (var b in { x: 0 }) { 3; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 2
            }
          },
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Literal',
                    value: 3
                  }
                }
              ]
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            right: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'Literal',
                    value: 0
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'IfStatement',
                  test: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'obj'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'hasOwnProperty'
                      }
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        name: 'p'
                      }
                    ]
                  },
                  consequent: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'IfStatement',
                        test: {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'p'
                          },
                          right: {
                            type: 'Literal',
                            value: 'prop1'
                          },
                          operator: '==='
                        },
                        consequent: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'UpdateExpression',
                                argument: {
                                  type: 'Identifier',
                                  name: 'countProp1'
                                },
                                operator: '++',
                                prefix: false
                              }
                            }
                          ]
                        },
                        alternate: null
                      },
                      {
                        type: 'IfStatement',
                        test: {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'p'
                          },
                          right: {
                            type: 'Literal',
                            value: 'prop2'
                          },
                          operator: '==='
                        },
                        consequent: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'UpdateExpression',
                                argument: {
                                  type: 'Identifier',
                                  name: 'countProp2'
                                },
                                operator: '++',
                                prefix: false
                              }
                            }
                          ]
                        },
                        alternate: null
                      },
                      {
                        type: 'IfStatement',
                        test: {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'p'
                          },
                          right: {
                            type: 'Literal',
                            value: 'prop3'
                          },
                          operator: '==='
                        },
                        consequent: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'UpdateExpression',
                                argument: {
                                  type: 'Identifier',
                                  name: 'countProp3'
                                },
                                operator: '++',
                                prefix: false
                              }
                            }
                          ]
                        },
                        alternate: null
                      }
                    ]
                  },
                  alternate: null
                }
              ]
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'p'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for(x in list) process(x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'process'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              }
            },
            left: {
              type: 'Identifier',
              name: 'x'
            },
            right: {
              type: 'Identifier',
              name: 'list'
            }
          }
        ]
      }
    ],
    [
      'for (var x in list) process(x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'process'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              }
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'list'
            }
          }
        ]
      }
    ],
    [
      'for ([...x] in {ab: a}) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            },
            right: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'ab'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'for (let {j} in x) { var [foo] = [j] }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'j'
                          }
                        ]
                      },
                      id: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'foo'
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'j'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'j'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'for(x of "foo" in {}) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'Identifier',
              name: 'x'
            },
            right: {
              type: 'BinaryExpression',
              left: {
                type: 'Literal',
                value: 'foo'
              },
              right: {
                type: 'ObjectExpression',
                properties: []
              },
              operator: 'in'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (x in {a: b}) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'Identifier',
              name: 'x'
            },
            right: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function foo(){ "use strict"; for(x in {}, {}) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Literal',
                    value: 'use strict'
                  },
                  directive: 'use strict'
                },
                {
                  type: 'ForInStatement',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'ObjectExpression',
                        properties: []
                      },
                      {
                        type: 'ObjectExpression',
                        properties: []
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'for(const x in [1,2,3]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Literal',
                  value: 2
                },
                {
                  type: 'Literal',
                  value: 3
                }
              ]
            }
          }
        ]
      }
    ]
  ]);
});
