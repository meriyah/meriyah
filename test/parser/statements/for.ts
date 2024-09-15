import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Statements - For', () => {
  for (const arg of [
    `for (a,b;;);`,
    'for (const [,foo] = arr;;);',
    'for (let [[x] = [1]] = []; i < 1; i++) {}',
    'for (var {j}=x; j<10; ++j) { const foo = j }',
    `        for ("boolean" == typeof a && (l = a, a = arguments[s] ||
          {}, s++), "object" == typeof a ||
          g(a) || (a = {}), s === u && (a = this, s--); s < u; s++)
  if (null != (e = arguments[s]))
      for (t in e) n = a[t], a !== (r = e[t]) && (l && r && (w.isPlainObject(r) ||
      (i = Array.isArray(r))) ? (i ? (i = !1, o = n && Array.isArray(n)
      ? n : [])
      : o = n && w.isPlainObject(n)
      ? n : {}, a[t] = w.extend(l, o, r))
      : void 0 !== r && (a[t] = r));`,
    'for (let m in ((yield))) foo; (r = a) => {}',
    `for(x, y;;);`,
    'for (const { x, } = { x: 23 }; a < 1; ) {}; for (const { x, } = { x: 23 }; a < 1; ) {};',
    `for (let [a]=x;;);
    for (let [a]=x;;);`,
    'for (let { x, } = { x: 23 }; a < 1; ) {}; for (let { x, } = { x: 23 }; a < 1; ) {};',
    'for ([] in (class {})) for (;;) continue',
    'for (var o in ((false)) ^ 2.7262799875259632e293) do ; while ((((eval))))',
    `for(x = 0;;);`,
    `for(x; x < 0;);`,
    `for(x; x < 0; x++);`,
    'for ({x = y} = (z);;) {}',
    `for(var x = 0;;);`,
    `for(let x = 0;;);`,
    'for(delete(x in y);;)x',
    `for(var a = 0;;) { let a; }`,
    `for (var { w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined }; a < 1; ) {}`,
    `for (var [[] = function() { a += 1; }()] = [[23]]; b < 1; ) {}`,
    `for (let { w = a(), x = b(), y = c(), z = d() } = { w: null, x: 0, y: false, z: '' }; e < 1; ) {}`,
    `for (let [,] = a(); b < 1; ) {}`,
    `for (const [ x, ] = y; a < 1; ) {};
     for (const [ x, ] =  z; a < 1; ) {};`,
    `for (let i = 0; i < 10; ++i) {
      console.log(i);
  }
  for (let i = 0; i < 10; ++i) {
      console.log(i);
  }`,
    'for (x(x in t);;) x',
    'for (((x)=>{}).x of y);',
    `for (const {} = obj; a < 1; ) {}`,
    'for (j=x; j<10; ++j) { [foo] = [j] }',
    'for (j=x; j<10; ++j) { let foo = j }',
    'for (j=x; j<10; ++j) { function foo() {return j} }',
    'for ({j}=x; j<10; ++j) { var [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { let foo = j }',
    'for ({j}=x; j<10; ++j) { const [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { function foo() {return j} }',
    'for (var j=x; j<10; ++j) { foo = j }',
    'for (var {j}=x; j<10; ++j) { var [foo] = [j] }',
    'for (let {j}=x; j<10; ++j) { function foo(){return j} }',
    'for (let j=x; j<10; ++j) { const foo = j }',
    'for (let j=x; j<10; ++j) { let [foo] = [j] }',
    'for (j=x; j<10; ++j) { foo = j }',
    'for (const {x,} of obj);',
    'for (const [a=[...b], ...c] of obj);',
    'for (const [x, ...[foo, bar]] of obj);',
    'for (const [...[foo, bar]] of obj);',
    'for (const [foo, ...bar] of obj);',
    'for (const [...foo] of obj);',
    'for (const {[x]: y = z} in obj);',
    'for (const [foo,bar] of arr);',
    'for (const [,,foo] of arr);',
    'for (const [,foo] of arr);',
    'for (const [foo,,] of arr);',
    'for (const [foo] of arr);',
    'for (const {x = y, z = a} = obj;;);',
    'for (const {x, y = z} = obj;;);',
    'for (const {x = y, z} = obj;;);',
    'for (const {x} = a, {y} = obj;;);',
    'for (const {x, y} = obj;;);',
    'for (const {} of obj);',
    'for (const [,,] of x);',
    'for (const [foo=a, bar=b] of arr);',
    'for (const [foo, bar=b] of arr);',
    'for (const [foo=a, bar] of arr);',
    'for (const [foo=a] of arr);',
    'for (const [foo,,bar] of arr);',
    'for (C = class { get ["x" in empty]() { return "via get"; } }; ; ) { break; }',
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
    `for ([] + x;;);`,
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
    'for (const [,] of x);',
    'for (const {a, [x]: y} in obj);',
    'for (const {[x]: y} in obj);',
    'for (const {x : y, z, a : b = c} in obj);',
    'for (const {x} of obj);',
    'for (const [foo,] in arr);',
    'for (const [] in x);',
    'for (const {a, [x]: y} = a;;);',
    'for (const {[x]: y = z} = a;;);',
    'for (const {[x]: y} = z;;);',
    'for (const {x : y, z, a : b = c} = obj;;);',
    'for (const {x : y = z} = obj;;);',
    'for (const {x, y : z} = obj;;);',
    'for (const {x : y, z} = obj;;);',
    'for (const {x : y} = obj;;);',
    'for (const {x : y = z} in obj);',
    'for (const {x : y, z : a} in obj);',
    'for (const {x, y : z} in obj);',
    'for (const {x : y, z} in obj);',
    'for (const {x : y} in obj);',
    'for (const {x = y, z = a} in obj);',
    'for (const {x, y = z} in obj);',
    'for (const {x = y, z} in obj);',
    'for (const {x = y} in obj);',
    'for (const [a=[...b], ...c] in obj);',
    'for (const [...[foo, bar]] in obj);',
    'for (const [foo, ...bar] in obj);',
    'for (const [...foo] in obj);',
    'for (const [foo=a, bar=b] in arr);',
    'for (const [foo, bar=b] in arr);',
    'for (const [foo=a, bar] in arr);',
    'for (const [foo=a] in arr);',
    'for (const [foo,,bar] in arr);',
    'for (const [,,foo] in arr);',
    'for (const [,foo] in arr);',
    'for (const [foo,,] in arr);',
    'for (const {x,} in obj);',
    'for (const {x, y} in obj);',
    `for (const {} in obj);`,
    'for (const {x,} = obj;;);',
    'for (const {x} = obj;;);',
    'for (const [foo, ...bar] = obj;;);',
    'for (const [foo=a, bar=b] = arr;;);',
    'for (const [foo=a, bar] = arr;;);',
    'for (const [foo=a] = arr;;);',
    'for (const foo = arr, [bar] = arr2;;);',
    'for (const [foo] = arr, bar = arr2;;);',
    'for (const [foo,bar] = arr;;);',
    'for (j=x; j<10; ++j) { [foo] = [j] }',
    'for (j=x; j<10; ++j) { [[foo]=[42]] = [] }',
    'for (j=x; j<10; ++j) { var foo = j }',
    'for (j=x; j<10; ++j) { var [foo] = [j] }',
    'for (j=x; j<10; ++j) { var [[foo]=[42]] = [] }',
    'for (j=x; j<10; ++j) { var foo; foo = j }',
    'for (j=x; j<10; ++j) { var foo; [foo] = [j] }',
    'for (j=x; j<10; ++j) { var foo; [[foo]=[42]] = [] }',
    'for (j=x; j<10; ++j) { let foo; foo = j }',
    'for (j=x; j<10; ++j) { let foo; [foo] = [j] }',
    'for (j=x; j<10; ++j) { let foo; [[foo]=[42]] = [] }',
    'for (j=x; j<10; ++j) { let foo = j }',
    'for (j=x; j<10; ++j) { let [foo] = [j] }',
    'for (j=x; j<10; ++j) { const foo = j }',
    'for (j=x; j<10; ++j) { const [foo] = [j] }',
    'for (j=x; j<10; ++j) { function foo() {return j} }',
    'for ([...x] in {ab: 1}) {}',
    'for (j=x; j<10; ++j) { foo = j }',
    'for (j=x; j<10; ++j) { [foo] = [j] }',
    'for (j=x; j<10; ++j) { let foo = j }',
    'for (j=x; j<10; ++j) { function foo() {return j} }',
    'for ({j}=x; j<10; ++j) { var [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { const [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { function foo() {return j} }',
    'for (var j=x; j<10; ++j) { foo = j }',
    'for (var {j}=x; j<10; ++j) { var [foo] = [j] }',
    'for (let {j}=x; j<10; ++j) { function foo(){return j} }',
    'for (let j=x; j<10; ++j) { const foo = j }',
    'for (let j=x; j<10; ++j) { let [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { foo = j }',
    'for ({j}=x; j<10; ++j) { [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { [[foo]=[42]] = [] }',
    'for ({j}=x; j<10; ++j) { var foo = j }',
    'for ({j}=x; j<10; ++j) { var [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { var [[foo]=[42]] = [] }',
    'for ({j}=x; j<10; ++j) { var foo; foo = j }',
    'for ({j}=x; j<10; ++j) { var foo; [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { var foo; [[foo]=[42]] = [] }',
    'for ({j}=x; j<10; ++j) { let foo; foo = j }',
    'for ({j}=x; j<10; ++j) { let foo; [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { let foo; [[foo]=[42]] = [] }',
    'for ({j}=x; j<10; ++j) { let foo = j }',
    'for ({j}=x; j<10; ++j) { let [foo] = [j] }',
    'for ({j}=x; j<10; ++j) { const foo = j }',
    'for ({j}=x; j<10; ++j) { const [foo] = [j] }',
    'for (var j=x; j<10; ++j) { foo = j }',
    'for (var j=x; j<10; ++j) { [foo] = [j] }',
    'for (var j=x; j<10; ++j) { [[foo]=[42]] = [] }',
    'for (var j=x; j<10; ++j) { var foo = j }',
    'for (var j=x; j<10; ++j) { var [foo] = [j] }',
    'for (var j=x; j<10; ++j) { var [[foo]=[42]] = [] }',
    'for (var j=x; j<10; ++j) { var foo; foo = j }',
    'for (var j=x; j<10; ++j) { var foo; [foo] = [j] }',
    'for (var j=x; j<10; ++j) { var foo; [[foo]=[42]] = [] }',
    'for (var j=x; j<10; ++j) { let foo; foo = j }',
    'for (var j=x; j<10; ++j) { let foo; [foo] = [j] }',
    'for (var j=x; j<10; ++j) { let foo; [[foo]=[42]] = [] }',
    'for (var j=x; j<10; ++j) { let foo = j }',
    'for (var j=x; j<10; ++j) { let [foo] = [j] }',
    'for (var j=x; j<10; ++j) { const foo = j }',
    'for (var j=x; j<10; ++j) { const [foo] = [j] }',
    'for (var j=x; j<10; ++j) { function foo() {return j} }',
    'for (var {j}=x; j<10; ++j) { foo = j }',
    'for (var {j}=x; j<10; ++j) { [foo] = [j] }',
    'for (var {j}=x; j<10; ++j) { [[foo]=[42]] = [] }',
    'for (var {j}=x; j<10; ++j) { var foo = j }',
    'for (var {j}=x; j<10; ++j) { var [foo] = [j] }',
    'for (var {j}=x; j<10; ++j) { var [[foo]=[42]] = [] }',
    'for (var {j}=x; j<10; ++j) { var foo; foo = j }',
    'for (var {j}=x; j<10; ++j) { var foo; [foo] = [j] }',
    'for (var {j}=x; j<10; ++j) { var foo; [[foo]=[42]] = [] }',
    'for (var {j}=x; j<10; ++j) { let foo; foo = j }',
    'for (var {j}=x; j<10; ++j) { let foo; [foo] = [j] }',
    'for (var {j}=x; j<10; ++j) { let foo; [[foo]=[42]] = [] }',
    'for (var {j}=x; j<10; ++j) { let foo = j }',
    'for (var {j}=x; j<10; ++j) { let [foo] = [j] }',
    'for (var {j}=x; j<10; ++j) { const foo = j }',
    'for (var {j}=x; j<10; ++j) { const [foo] = [j] }',
    'for (var {j}=x; j<10; ++j) { function foo() {return j} }',
    'for (let j=x; j<10; ++j) { foo = j }',
    'for (let j=x; j<10; ++j) { [foo] = [j] }',
    'for (let j=x; j<10; ++j) { [[foo]=[42]] = [] }',
    'for (let j=x; j<10; ++j) { var foo = j }',
    'for (let j=x; j<10; ++j) { var [foo] = [j] }',
    'for (let j=x; j<10; ++j) { var [[foo]=[42]] = [] }',
    'for (let j=x; j<10; ++j) { var foo; foo = j }',
    'for (let j=x; j<10; ++j) { var foo; [foo] = [j] }',
    'for (let j=x; j<10; ++j) { var foo; [[foo]=[42]] = [] }',
    'for (let j=x; j<10; ++j) { let foo; foo = j }',
    'for (let j=x; j<10; ++j) { let foo; [foo] = [j] }',
    'for (let j=x; j<10; ++j) { let foo; [[foo]=[42]] = [] }',
    'for (let j=x; j<10; ++j) { let foo = j }',
    'for (let j=x; j<10; ++j) { let [foo] = [j] }',
    'for (let j=x; j<10; ++j) { const foo = j }',
    'for (let j=x; j<10; ++j) { const [foo] = [j] }',
    'for (let j=x; j<10; ++j) { function foo() {return j} }',
    'for (let {j}=x; j<10; ++j) { foo = j }',
    'for (let {j}=x; j<10; ++j) { [foo] = [j] }',
    'for (let {j}=x; j<10; ++j) { [[foo]=[42]] = [] }',
    'for (let {j}=x; j<10; ++j) { var foo = j }',
    'for (let {j}=x; j<10; ++j) { var [foo] = [j] }',
    'for (let {j}=x; j<10; ++j) { var [[foo]=[42]] = [] }',
    'for (let {j}=x; j<10; ++j) { var foo; foo = j }',
    'for (let {j}=x; j<10; ++j) { var foo; [foo] = [j] }',
    'for (let {j}=x; j<10; ++j) { var foo; [[foo]=[42]] = [] }',
    'for (let {j}=x; j<10; ++j) { let foo; foo = j }',
    'for (let {j}=x; j<10; ++j) { let foo; [foo] = [j] }',
    'for (let {j}=x; j<10; ++j) { let foo; [[foo]=[42]] = [] }',
    'for (let {j}=x; j<10; ++j) { let foo = j }',
    'for (let {j}=x; j<10; ++j) { let [foo] = [j] }',
    'for (let {j}=x; j<10; ++j) { const foo = j }',
    'for (let {j}=x; j<10; ++j) { const [foo] = [j] }',
    'for ({a: b.c}[x] of d) e',
    'for ([a.b][foo] of c) d',
    'for (let {j}=x; j<10; ++j) { function foo(){return j} }',
    'for ({}.bar ;;);',
    `for ({}.bar = x ;;);`,
    `for ({a: b.c}.foo in d) e`,
    `for ({}.bar in obj);`,
    `for ({a: b.c}.foo of d) e`,
    'while (j) { foo = j }',
    'while (j) { [foo] = [j] }',
    'while (j) { [[foo]=[42]] = [] }',
    'while (j) { var foo = j }',
    'while (j) { var [foo] = [j] }',
    'while (j) { var [[foo]=[42]] = [] }',
    'while (j) { var foo; foo = j }',
    'while (j) { var foo; [foo] = [j] }',
    'while (j) { var foo; [[foo]=[42]] = [] }',
    'while (j) { let foo; foo = j }',
    'while (j) { let foo; [foo] = [j] }',
    'while (j) { let foo; [[foo]=[42]] = [] }',
    'while (j) { let foo = j }',
    'while (j) { let [foo] = [j] }',
    'while (j) { const foo = j }',
    'while (j) { const [foo] = [j] }',
    'while (j) { function foo() {return j} }',
    'do { foo = j } while (j)',
    'do { [foo] = [j] } while (j)',
    'do { [[foo]=[42]] = [] } while (j)',
    'do { var foo = j } while (j)',
    'do { var [foo] = [j] } while (j)',
    'do { var [[foo]=[42]] = [] } while (j)',
    'do { var foo; foo = j } while (j)',
    'do { var foo; [foo] = [j] } while (j)',
    'do { var foo; [[foo]=[42]] = [] } while (j)',
    'do { let foo; foo = j } while (j)',
    'do { let foo; [foo] = [j] } while (j)',
    'do { let foo; [[foo]=[42]] = [] } while (j)',
    'do { let foo = j } while (j)',
    'do { let [foo] = [j] } while (j)',
    'do { const foo = j } while (j)',
    'do { const [foo] = [j] } while (j)',
    'do { function foo() {return j} } while (j)',
    'for (const [[...x] = [2, 1, 3]] = []; a < 1; ) {}',
    'for (const [cover = (function () {}), xCover = (0, function() {})] = []; a < 1; ) {}',
    'for (const [x = 23] = [undefined]; a < 1; ) {}',
    'for (const [{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]; a < 1; ) {}',
    'for (const [...[,]] = g(); a < 1; ) {}',
    `var __str, index, index_n;
    __str="";
    outer : for(index=0; index<4; index+=1) {
        nested : for(index_n=0; index_n<=index; index_n++) {
      if (index*index_n >= 4)break nested;
      __str+=""+index+index_n;
        }
    }`,
    `__str="";
    outer : for(index=0; index<4; index+=1) {
        nested : for(index_n=0; index_n<=index; index_n++) {
      if (index*index_n >= 4)break outer;
      __str+=""+index+index_n;
        }
    }`,
    `__str="";
    outer : for(index=0; index<4; index+=1) {
        nested : for(index_n=0; index_n<=index; index_n++) {
      if (index*index_n >= 4)break ;
      __str+=""+index+index_n;
        }
    }`,
    `let z = 1;
    let s = 0;
    for (const x = 1; z < 2; z++) {
      s += x + z;
    }`,
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
    `let x = 'outside';
    var probeBefore = function() { return x; };
    var probeDecl, probeTest, probeIncr, probeBody;
    var run = true;
    for (
        let x = 'inside', _ = probeDecl = function() { return x; };
        run && (probeTest = function() { return x; });
        probeIncr = function() { return x; }
      )
      probeBody = function() { return x; }, run = false;`,
    `var probeFirst;
    var probeSecond = null;
    for (let x = 'first'; probeSecond === null; x = 'second')
      if (!probeFirst)
        probeFirst = function() { return x; };
      else
        probeSecond = function() { return x; };`,
    'for (var {j}=x; j<10; ++j) { const foo = j }',
    `        for ("boolean" == typeof a && (l = a, a = arguments[s] ||
             {}, s++), "object" == typeof a ||
             g(a) || (a = {}), s === u && (a = this, s--); s < u; s++)
     if (null != (e = arguments[s]))
         for (t in e) n = a[t], a !== (r = e[t]) && (l && r && (w.isPlainObject(r) ||
         (i = Array.isArray(r))) ? (i ? (i = !1, o = n && Array.isArray(n)
         ? n : [])
         : o = n && w.isPlainObject(n)
         ? n : {}, a[t] = w.extend(l, o, r))
         : void 0 !== r && (a[t] = r));`,
    'for ({j}=x; j<10; ++j) { function foo() {return j} }',
    `let = 1;
      for ( let; ; )
        break;`,
    'for (x of [1,2,3]) {}',
    'for(var a;b;c);',
    'for(var a = 0;;) { let a; }',
    'for(;b;c);',
    'for(let of;;);',
    'for(let a;;); let a;',
    'for(x; x < 0; x++) process(x);',
    'for(x; x < 0; x++) process(x);',
    'for(delete((1)?y:x in y);;)x',
    'for ([x];;);',
    'for ([x.y];;);',
    'for ([x] = z;;);',
    'for ([x.y] = z;;);',
    'for ({x};;);',
    'for ({x: a.b};;);',
    'for ({a: x + y};;);',
    'for ({x} = z;;);',
    'for ({a: x.y} = z;;);',
    'for ("foo".bar;;);',
    'for ("foo".bar = x ;;);',
    'for ({}.bar ;;);',
    'for ({}.bar = x ;;);',
    'for ([].bar ;;);',
    'for ([].bar = x ;;);',
    'for (const [[x]] = [null]; ; ) {}',
    'for (const [[x]] = [null]; ; ) {}',
    'for (const [{ x }] = [null]; ; ) {}',
    'for (const [...[]] = iter; a < 1; ) {}',
    'for (const [...x] = values; a < 1; ) {}',
    'for (let [x] = iter; a < 1; ) {}',
    'for (let [arrow = () => {}] = []; a < 1; ) {}',
    'for (let [{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] = [{ u: 777, w: 888, y: 999 }]; a < 1; ) {}',
    'for (let [,] = g(); a < 1; ) {}',
    'for (let [ , , ...x] = values; a < 1; ) {}',
    'for (let { cover = (function () {}), xCover = (0, function() {})  } = {}; a < 1; ) {}',
    'for (let { gen = function* () {}, xGen = function* x() {} } = {}; a < 1; ) {}',
    'for (let { w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] }; a < 1; ) {}',
    'for (let {...x} = { get v() { count++; return 2; } }; a < 1; ) {}',
    'for (var [x, y, z] = [1, 2, 3]; a < 1; ) {}',
    'for (var [[x]] = [null]; a < 1; ) {}',
    'for (var [,] = g(); a < 1; ) {}',
    'for (var [...x] = values; a < 1; ) {}',
    'for (var { x, } = { x: 23 }; a < 1; ) {}',
    'for (var { x: y } = { x: 23 }; a < 1; ) {}',
    'for (var {...x} = { get v() { count++; return 2; } }; a < 1; ) {}',
    'for (x=>{};;);',
    'for ((x)=>{};;);',
    'for (((x)=>{}) ;;);',
    'for (((x)=>{}).x ;;);',
    'function *f(){ for (yield;;); }',
    'for (x=>{x in y};;);',
    'function *f(){   for (yield;;);   }',
    'function *f(){   for (yield x;;);   }',
    'for (;; (g &= {})) do switch ((/z+/)) {} while (((class {})))',
    'for (;;) debugger;',
    'function z() { for (let c in new.target) for (let o in (--((b)).debugger)) debugger; }',
    'for (a ? b : c;;);',
    'for (a = b;;);',
    'for (a += b;;);',
    'for (((x)=>{}).x in y);',
    'for (((x)=>{}).x of y);',
    `var let;

    let = 1;
    for ( let; ; )
      break;

    let = 2;
    for ( let = 3; ; )
      break;

      let = 4;
    for ( [let][0]; ; )
      break;
    `
  ]) {
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
  }

  fail('Statements - For (pass)', [
    ['for ([{__proto__: 1, __proto__: 2}];;);', Context.None],
    ['for ({__proto__: 1, __proto__: 2};;);', Context.None],
    [`for ({x=y} ;;) b;`, Context.Strict],
    ['for({a=0};;);', Context.None],
    ['for (let=10;;);', Context.Strict],
    ['for (const a;;);', Context.None],
    ['for (const a,b,c;;);', Context.None],
    ['for (var [foo] = arr, [bar] = arr2);', Context.None],
    ['for (var [foo,,bar] = arr);', Context.None],
    ['for (var [foo,bar] = arr);', Context.None],
    ['for (var [,,foo] = arr);', Context.None],
    ['for (var [,foo] = arr);', Context.None],
    ['for (var [foo,,] = arr);', Context.None],
    ['for (var [foo,] = arr);', Context.None],
    ['for (var [foo] = arr);', Context.None],
    ['for ([a.b](foo) of c) d', Context.None],
    ['for ([a.b]`foo` of c) d', Context.None],
    ['for ([a.b]++ of c) d', Context.None],
    ['for ({a: b.c}() of d) e', Context.None],
    ['for ({a: b.c}`z` of d) e', Context.None],
    ['for ({a: b.c}-- of d) e', Context.None],
    ['for (let x of a,b) c', Context.None],
    ['for (var [,,] = x);', Context.None],
    ['for (let x of y, z) {}', Context.None],
    ['for (var [,] = x);', Context.None],
    ['for (var [] = x);', Context.None],
    ['for (x=>x in y;;);', Context.None],
    [`for ({}.bar = x in obj);`, Context.None],
    ['for (yield;;);', Context.Strict],
    ['function *f(){   for (yield x in y;;);', Context.Strict],
    ['for ([...{ get x() {} }] in [[[]]]) ;', Context.None],
    ['for (var [foo] = arr, [bar] = arr2);', Context.None],
    ['for (var [foo] = arr, bar);', Context.None],
    ['for (var [foo] = arr, bar = arr2);', Context.None],
    ['for (var foo = arr, [bar] = arr2);', Context.None],
    ['for (var [foo=a] = arr);', Context.None],
    ['for (var [foo=a, bar] = arr);', Context.None],
    ['for (var [foo, bar=b] = arr);', Context.None],
    ['for (var [foo=a, bar=b] = arr);', Context.None],
    ['for (var [foo]);', Context.None],
    ['for (x of y) foo: bar: function f(){}', Context.None],
    ['for (x of y) foo: function f(){}', Context.None],
    ['for (var [foo = x]);', Context.None],
    ['for (var [foo], bar);', Context.None],
    ['for (var foo, [bar]);', Context.None],
    ['for (var [...foo] = obj);', Context.None],
    ['for (var [foo, ...bar] = obj);', Context.None],
    ['for (var [...foo, bar] = obj);', Context.None],
    ['for (var [...foo,] = obj);', Context.None],
    ['for (var [...foo,,] = obj);', Context.None],
    ['for (var [...[foo, bar]] = obj);', Context.None],
    ['for (var [...[foo, bar],] = obj);', Context.None],
    ['for (var [...[foo, bar],,] = obj);', Context.None],
    ['for (var [x, ...[foo, bar]] = obj);', Context.None],
    ['for (var [...bar = foo] = obj);', Context.None],
    ['for (var [...] = obj);', Context.None],
    ['for (var {} = obj);', Context.None],
    ['for (var {,} = obj);', Context.None],
    ['for (var {,,} = obj);', Context.None],
    ['for (var {x} = obj);', Context.None],
    ['for (var {x,} = obj);', Context.None],
    ['for (var {x,,} = obj);', Context.None],
    ['for (var {,x} = obj);', Context.None],
    ['for (var {,,x} = obj);', Context.None],
    ['for (a, b);', Context.None],
    ['for (var {,,x} = obj);', Context.None],
    ['for(delete(x in y) in z)x', Context.None],
    ['for(delete((1)?y:x in y) in z)x', Context.None],
    ['for (a + b);', Context.None],
    ['for (a);', Context.None],
    ['for ({});', Context.None],
    ['for (const [z, z]; ; ) ;', Context.None],
    ['for (const [z]; ; ) ;', Context.None],
    ['for (const x = 5, y; ; ) ;', Context.None],
    ['for (const x; ; ) ;', Context.None],
    ['for (let [z, z]; ; ) ;', Context.None],
    ['for (var {,,x} = obj);', Context.None],
    ['for (var {,,x} = obj);', Context.None],
    ['for (var {x, y} = obj);', Context.None],
    ['for (var {x,, y} = obj);', Context.None],
    ['for (var {x} = a, {y} = obj);', Context.None],
    ['for (var {x} = a, y = obj);', Context.None],
    ['for (var {x} = a, obj);', Context.None],
    ['for (var x = a, {y} = obj);', Context.None],
    ['for (var x, {y} = obj);', Context.None],
    ['for (var {x = y} = obj);', Context.None],
    ['for (var {x = y, z} = obj);', Context.None],
    ['for (var {x, y = z} = obj);', Context.None],
    ['for (var {x = y, z = a} = obj);', Context.None],
    ['for (var {x}, {y} = z);', Context.None],
    ['for (var {x}, y);', Context.None],
    ['for (var x = y, {z});', Context.None],
    ['for (var {x}, y);', Context.None],
    ['for (var {x=y});', Context.None],
    ['for (var {x:y=z});', Context.None],
    ['for (var {x:y=z} = obj, {a:b=c});', Context.None],
    ['for (var {x:y=z}, {a:b=c} = obj);', Context.None],
    ['for (var {a:=c} = z);', Context.None],
    ['for (var {[x]: y} = z);', Context.None],
    ['for (var {[x]} = z);', Context.None],
    ['for(x of 3)break/', Context.None],
    ['for(x of 3)continue/', Context.None],
    ['for(x of 3)p/', Context.None],
    ['for (var {[x]: y});', Context.None],
    ['for (var {[x]: y = z});', Context.None],
    ['for (var {[x]: y = z} = a);', Context.None],
    ['for (var {a, [x]: y} = a);', Context.None],
    ['for ({a: x + y} = z;;);', Context.None],
    ['for ([x + y] = z;;);', Context.None],
    ['for(index=0; index<10; index+=4; index++; index--) ;', Context.None],
    ['for({var index=0; index+=1;} index++<=10; index*2;) {	[].add(""+index);};', Context.None],
    ['for ( ; false; ) class C {}', Context.None],
    [`for ( ; false; ) function f() {}`, Context.None],
    ['for ( ; false; ) label1: label2: function f() {}', Context.None],
    ['for ( ; false; ) label1: label2: function f() {}', Context.None],
    ['for ((i in {}));', Context.None],
    ['for (let [];;);', Context.None],
    ['for (let [a = 0];;);', Context.None],
    ['for (let a = 0, [];;);', Context.None],
    ['for (let [] = 0, [];;);', Context.None],
    ['for (let {};;);', Context.None],
    ['for (let {a = 0};;);', Context.None],
    ['for (let a = 0, {};;);', Context.None],
    ['for (let [] = 0, {};;);', Context.None],
    ['for (let [...x = []] = []; a < 1; ) {}', Context.None],
    ['for (let [...{ x } = []] = []; a < 1; ) {}', Context.None],
    ['for (var a in arr;1;){ break; }', Context.None],
    ['for ( ; false; ) class C {}', Context.None],
    ['for ( ; false; ) function f() {}', Context.None],
    ['for ( ; false; ) function* g() {}', Context.None],
    ['for (const [...{ x }, y] = [1, 2, 3]; a < 1; ) {}', Context.None],
    ['for (var [...[ x ] = []] = []; a < 1; ) {}', Context.None],
    ['for (var a in arr;1;){ break; }', Context.None],
    ['for (let [...x = []] = []; a < 1; ) {}', Context.None],
    ['for (a = b of x);', Context.None],
    ['for (a += b of x);', Context.None],
    ['for (a ? b : c of x);', Context.None],
    ['for (a ? b : c of x);', Context.None],
    ['function *f(){   for (yield x in y of z);   }', Context.None],
    ['function *f(){   for (yield x of y);   }', Context.None],
    ['function *f(){   for (yield of y);   }', Context.None],
    ['function *f(){ for (yield of obj); }', Context.None],
    ['for ((x)=>{}.x of y);', Context.None],
    ['for (((x)=>{}) of y);', Context.None],
    ['for ((x)=>{} of y);', Context.None],
    ['for (x=>{}.x of y);', Context.None],
    ['for (x=>{} of y);', Context.None],
    ['for (const [...[foo, bar],,] = obj);', Context.None],
    ['for (const [... ...foo] = obj);', Context.Module],
    ['for (const [...] = obj);', Context.None],
    ['for (const [...,] = obj);', Context.None],
    ['for (const [..x] = obj);', Context.None],
    ['for (const [a=[...b], ...c] = obj);', Context.None],
    ['for (const {,} = obj);', Context.None],
    ['for (const {x} = obj);', Context.None],
    ['for (const {,x} = obj);', Context.None],
    ['for (const {x,, y} = obj);', Context.None],
    ['for (const {x, y} = obj);', Context.None],
    ['for (const {x} = a, y = obj);', Context.None],
    ['for (const {x} = a, obj);', Context.None],
    ['for (const {x = y} = obj);', Context.None],
    ['for (const x, {y} = obj);', Context.None],
    ['for (const {x = y, z = a} = obj);', Context.None],
    ['for (const foo;;);', Context.None],
    ['for (const\nfoo();;);', Context.None],
    ['for (const foo);', Context.None],
    ['for (const [...,] = obj;;);', Context.None],
    ['for (const foo, bar);', Context.None],
    ['for (const foo = bar, zoo = boo);', Context.None],
    ['for (const\nfoo);', Context.None],
    ['for (const foo = bar in x);', Context.None],
    ['for (const foo = bar, zoo = boo in x);', Context.None],
    ['for (const foo, bar of x);', Context.None],
    ['for (let a = b in c) {}', Context.None],
    ['for (a = b in c) {}', Context.None],
    ['for (const foo = bar of x);', Context.None],
    ['for (const foo = bar, zoo = boo of x);', Context.None],
    ['for (const foo, zoo of x);', Context.None],
    ['for (const foo, [bar] = arr2;;);', Context.None],
    ['for (const [foo];;);', Context.None],
    ['for (const [foo = x];;);', Context.None],
    ['for (const [foo], bar;;);', Context.None],
    ['for (const foo, [bar];;);', Context.None],
    ['for (const [...foo, bar] = obj;;);', Context.None],
    ['for (const [...foo,] = obj;;);', Context.None],
    ['for (const [...[foo, bar],,] = obj;;);', Context.None],
    ['for (const [...[foo, bar],] = obj;;);', Context.None],
    ['for (const [...bar = foo] = obj;;);', Context.None],
    ['for (const [... ...foo] = obj;;);', Context.None],
    ['for (const [...] = obj;;);', Context.None],
    ['for (const [...,] = obj;;);', Context.None],
    ['for (const {x : y} = obj);', Context.None],
    ['for (const {x : y, z : a} = obj);', Context.None],
    ['for (const {x : y = z} = obj);', Context.None],
    ['for (const {x : y, z, a : b = c} = obj);', Context.None],
    ['for (const {x});', Context.None],
    ['for (const {x}, {y} = z);', Context.None],
    ['for (const {x}, y);', Context.None],
    ['for (const {x}, y);', Context.None],
    ['for (const {x=y});', Context.None],
    ['for (const {x:y=z} = obj, {a:b=c});', Context.None],
    ['for (const {x:y=z}, {a:b=c} = obj);', Context.None],
    ['for (const {a:=c} = z);', Context.None],
    ['for (const {[x]: y} = z);', Context.None],
    ['for (const {[x]} = z);', Context.None],
    ['let {...{a,b}} = foo', Context.None],
    ['for (const [.x] = obj;;);', Context.None],
    ['for (const [..x] = obj;;);', Context.None],
    ['for (const {,} = obj;;);', Context.None],
    ['for (const {,,} = obj;;);', Context.None],
    ['for (const {x,,} = obj;;);', Context.None],
    ['for (const {,x} = obj;;);', Context.None],
    ['for (const {,,x} = obj;;);', Context.None],
    ['for (const {x,, y} = obj;;);', Context.None],
    ['for (const {x} = a, obj;;);', Context.None],
    ['for (const x, {y} = obj;;);', Context.None],
    ['for (const {x}, {y} = z;;);', Context.None],
    ['for (const x, {y};;);', Context.None],
    ['for (const {x}, y;;);', Context.None],
    ['for (const x = y, {z};;);', Context.None],
    ['for (const {x:y};;);', Context.None],
    ['for (const {x:y=z};;);', Context.None],
    ['for (const {x:y=z} = obj, {a:b=c};;);', Context.None],
    ['for (const {x:y=z}, {a:b=c} = obj;;);', Context.None],
    ['for (const {a:=c} = z;;);', Context.None],
    ['for (const {[x]} = z;;);', Context.None],
    ['for (const {[x]};;);', Context.None],
    ['for (const {[x]: y};;);', Context.None],
    ['for (const {[x] = y} = z;;);', Context.None],
    ['for (const {[x]: y = z};;);', Context.None],
    ['for (const [,,] = x);', Context.None],
    ['for (const [foo,,] = arr);', Context.None],
    ['for (const [,foo] = arr);', Context.None],
    ['for (const [foo,bar] = arr);', Context.None],
    ['for (const [foo] = arr, bar);', Context.None],
    ['for (const foo, [bar] = arr2);', Context.None],
    ['for (const foo = arr, [bar] = arr2);', Context.None],
    ['for (const [foo=a, bar] = arr);', Context.None],
    ['for (const [foo = x]);', Context.None],
    ['for (const [foo]);', Context.None],
    ['for (const {[x] = y} = z);', Context.None],
    ['for (const {[x]: y = z});', Context.None],
    ['for (const [foo], bar in arr);', Context.None],
    ['for (const foo, [bar] in arr);', Context.None],
    ['for (const [foo]);', Context.None],
    ['for (const [foo = x]);', Context.None],
    ['for (const [foo], bar);', Context.None],
    ['for (const foo, [bar]);', Context.None],
    ['for (const [...foo, bar] in obj);', Context.None],
    ['for (const [...foo,] in obj);', Context.None],
    ['for (const [...foo,,] in obj);', Context.None],
    ['for (const [...[foo, bar],] in obj);', Context.None],
    ['for (const [...[foo, bar],,] in obj);', Context.None],
    ['for (const [...] in obj);', Context.None],
    ['for (const [...,] in obj);', Context.None],
    ['for (const [.x] in obj);', Context.None],
    ['for (const [..x] in obj);', Context.None],
    ['for (const {,} in obj);', Context.None],
    ['for (const {,,} in obj);', Context.None],
    ['for (const {x,,} in obj);', Context.None],
    ['for (const {,x} in obj);', Context.None],
    ['for (const {x,, y} in obj);', Context.None],
    ['for (const x, {y} in obj);', Context.None],
    ['for (const {x}, y);', Context.None],
    ['for (const x = y, {z});', Context.None],
    ['for (const {x:y});', Context.None],
    ['for (const {x:y=z});', Context.None],
    ['for (const {x:y=z} = obj, {a:b=c});', Context.None],
    ['for (const {x:y=z}, {a:b=c} in obj);', Context.None],
    ['for (const {[x] = y} in obj);', Context.None],
    ['for (const foo, [bar] of arr);', Context.None],
    ['for (const [foo = x]);', Context.None],
    ['for (const [...foo] = obj);', Context.None],
    ['for (const [foo, ...bar] = obj);', Context.None],
    ['for (const [...foo, bar] = obj);', Context.None],
    ['for (const [...foo,,] = obj);', Context.None],
    ['for (const [..x] of obj);', Context.None],
    ['for (const [.x] of obj);', Context.None],
    ['for (const {,,} of obj);', Context.None],
    ['for (const {,} of obj);', Context.None],
    ['for (const {,,x} of obj);', Context.None],
    ['for (const {x,, y} of obj);', Context.None],
    ['for (a = b in x);', Context.None],
    ['for (a ? b : c in x);', Context.None],
    ['function *f(){   for (yield x in y in z);   }', Context.None],
    ['for ((x)=>{}.x in y);', Context.None],
    ['for (((x)=>{}) in y);', Context.None],
    ['for ((x)=>{} in y);', Context.None],
    ['for (x=>{}.x in y);', Context.None]
  ]);

  pass('Statements - For (pass)', [
    [
      'for (let [,] = x;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ArrayPattern',
                    elements: [null]
                  },
                  init: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for(()=>{a in b};;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      operator: 'in'
                    }
                  }
                ]
              },
              params: [],

              async: false,
              expression: false
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      `let = 4;
      for ( [let][0]; ; )
        break;
      `,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'let'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 4
              }
            }
          },
          {
            type: 'ForStatement',
            body: {
              type: 'BreakStatement',
              label: null
            },
            init: {
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
                value: 0
              }
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (let\nfoo;;);',
      Context.None,
      {
        body: [
          {
            body: {
              type: 'EmptyStatement'
            },
            init: {
              declarations: [
                {
                  id: {
                    name: 'foo',
                    type: 'Identifier'
                  },
                  init: null,
                  type: 'VariableDeclarator'
                }
              ],
              kind: 'let',
              type: 'VariableDeclaration'
            },
            test: null,
            type: 'ForStatement',
            update: null
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'for (let [] = x;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ArrayPattern',
                    elements: []
                  },
                  init: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let [foo] = arr, bar;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
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
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    name: 'arr'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (() => { this in null };;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'ThisExpression'
                      },
                      right: {
                        type: 'Literal',
                        value: null
                      },
                      operator: 'in'
                    }
                  }
                ]
              },
              params: [],

              async: false,
              expression: false
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (`<${new arguments(++r.function[eval], () => {}, function () {""}, (a)in this, true)}`; x ^= arguments;) {}',
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
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'arguments'
                  },
                  arguments: [
                    {
                      type: 'UpdateExpression',
                      argument: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'r'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'function'
                          }
                        },
                        computed: true,
                        property: {
                          type: 'Identifier',
                          name: 'eval'
                        }
                      },
                      operator: '++',
                      prefix: true
                    },
                    {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      params: [],

                      async: false,
                      expression: false
                    },
                    {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'Literal',
                              value: ''
                            },
                            directive: ''
                          }
                        ]
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'ThisExpression'
                      },
                      operator: 'in'
                    },
                    {
                      type: 'Literal',
                      value: true
                    }
                  ]
                }
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '<',
                    raw: '<'
                  },
                  tail: false
                },
                {
                  type: 'TemplateElement',
                  value: {
                    cooked: '',
                    raw: ''
                  },
                  tail: true
                }
              ]
            },
            test: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '^=',
              right: {
                type: 'Identifier',
                name: 'arguments'
              }
            },
            update: null
          }
        ]
      }
    ],
    [
      'for (let [foo, ...bar] = obj;;);',
      Context.None,
      {
        body: [
          {
            body: {
              type: 'EmptyStatement'
            },
            init: {
              declarations: [
                {
                  id: {
                    elements: [
                      {
                        name: 'foo',
                        type: 'Identifier'
                      },
                      {
                        argument: {
                          name: 'bar',
                          type: 'Identifier'
                        },
                        type: 'RestElement'
                      }
                    ],
                    type: 'ArrayPattern'
                  },
                  init: {
                    name: 'obj',
                    type: 'Identifier'
                  },
                  type: 'VariableDeclarator'
                }
              ],
              kind: 'let',
              type: 'VariableDeclaration'
            },
            test: null,
            type: 'ForStatement',
            update: null
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'for (let {x} = obj;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
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
                  init: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for ({x = y} = (z);;) {}',
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
              type: 'AssignmentExpression',
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
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (let [foo, bar=b] in arr);',
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
              kind: 'let'
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
      'for (var a;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (var a,b,c;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  init: null
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  init: null
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var x = 0; x < 1000000; x++);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                    name: 'x'
                  }
                }
              ]
            },
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'Literal',
                value: 1000000
              },
              operator: '<'
            },
            update: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '++',
              prefix: false
            }
          }
        ]
      }
    ],
    [
      'for (let a;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let a,b,c;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  init: null
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  init: null
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (var a;;) { let a; }',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            test: null,
            update: null,
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      init: null
                    }
                  ],
                  kind: 'let'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let foo in x);',
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
                    name: 'foo'
                  },
                  init: null
                }
              ],
              kind: 'let'
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
      'for (let foo;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: null,
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (a;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'Identifier',
              name: 'a'
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (;b;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: null,
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (;;c);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: null,
            test: null,
            update: {
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
      'for (a;b;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'Identifier',
              name: 'a'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (a;;c);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'Identifier',
              name: 'a'
            },
            test: null,
            update: {
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
      'for (;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: null,
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (let [foo=a, bar=b] in arr);',
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
              kind: 'let'
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
      'for (let [...foo] = obj;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let [foo=a, bar=b] = arr;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
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
                  init: {
                    type: 'Identifier',
                    name: 'arr'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let [foo, bar=b] = arr;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
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
                  init: {
                    type: 'Identifier',
                    name: 'arr'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let [foo=a] = arr;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
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
                  },
                  init: {
                    type: 'Identifier',
                    name: 'arr'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let foo = arr, [bar] = arr2;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  init: {
                    type: 'Identifier',
                    name: 'arr'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    name: 'arr2'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (a * b + c * d;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '*'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '*'
              },
              operator: '+'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for ((a * b + c) * d;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '*'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '+'
              },
              right: {
                type: 'Identifier',
                name: 'd'
              },
              operator: '*'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (const [...x] in y){}',
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
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'y'
            }
          }
        ]
      }
    ],
    [
      'for (const [...x] in y){}',
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
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'y'
            }
          }
        ]
      }
    ],
    [
      'for (const {...x} in y){}',
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
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'y'
            }
          }
        ]
      }
    ],
    [
      'for (var a=1;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                    name: 'a'
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (var a=1, b;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                    name: 'a'
                  }
                },
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
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (var a, b=1;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                },
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Literal',
                    value: 1
                  },
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (var a=1, b=2;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                    name: 'a'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Literal',
                    value: 2
                  },
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            test: null,
            update: null
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
      'for (var a = b in c);',
      Context.OptionsWebCompat,
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
                    type: 'Identifier',
                    name: 'b'
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
      'for (var a = ++b in c);',
      Context.OptionsWebCompat,
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
      Context.OptionsWebCompat,
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
      Context.OptionsWebCompat,
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
      Context.OptionsWebCompat,
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
      'for (let a of b);',
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
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (a of b=c);',
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
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ([a.b] of c) d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
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
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ([a.b].foo of c) d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
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
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ({a: b.c} of d) e',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
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
            },
            await: false
          }
        ]
      }
    ],
    [
      'for ({a: b.c}.foo of d) e',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
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
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [,,] = x;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ArrayPattern',
                    elements: [null, null]
                  },
                  init: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let [foo] = arr;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
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
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    name: 'arr'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let [foo,] = arr;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
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
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    name: 'arr'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let [foo] = arr, [bar] = arr2;;);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ForStatement',
            init: {
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
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    name: 'arr'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    name: 'arr2'
                  }
                }
              ],
              kind: 'let'
            },
            test: null,
            update: null,
            body: {
              type: 'EmptyStatement'
            }
          }
        ],
        sourceType: 'script'
      }
    ],

    [
      'for (a + b * c * d;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  operator: '*'
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '*'
              },
              operator: '+'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: null,
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (a;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'Identifier',
              name: 'a'
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (;b;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: null,
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: null
          }
        ]
      }
    ],
    [
      'for (foo=10;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'foo'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 10
              }
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (let=10;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'let'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 10
              }
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (;;) let \n {}',
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                name: 'let',
                type: 'Identifier'
              },
              type: 'ExpressionStatement'
            },
            init: null,
            test: null,
            type: 'ForStatement',
            update: null
          },
          {
            body: [],
            type: 'BlockStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'for (;;) let \n x = 1',
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                name: 'let',
                type: 'Identifier'
              },
              type: 'ExpressionStatement'
            },
            init: null,
            test: null,
            type: 'ForStatement',
            update: null
          },
          {
            expression: {
              left: {
                name: 'x',
                type: 'Identifier'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 1
              },
              type: 'AssignmentExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'for (let a, { b } = {};;) { let a, { b } = {}; { let a, { b } = {}; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
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
                    },
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ObjectExpression',
                        properties: []
                      },
                      id: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'b'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'b'
                            },
                            method: false,
                            shorthand: true
                          }
                        ]
                      }
                    }
                  ]
                },
                {
                  type: 'BlockStatement',
                  body: [
                    {
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
                        },
                        {
                          type: 'VariableDeclarator',
                          init: {
                            type: 'ObjectExpression',
                            properties: []
                          },
                          id: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                kind: 'init',
                                key: {
                                  type: 'Identifier',
                                  name: 'b'
                                },
                                computed: false,
                                value: {
                                  type: 'Identifier',
                                  name: 'b'
                                },
                                method: false,
                                shorthand: true
                              }
                            ]
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            init: {
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
                },
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'ObjectExpression',
                    properties: []
                  },
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (true ? a in b : {}; false; ) ;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'ConditionalExpression',
              test: {
                type: 'Literal',
                value: true
              },
              consequent: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: 'in'
              },
              alternate: {
                type: 'ObjectExpression',
                properties: []
              }
            },
            test: {
              type: 'Literal',
              value: false
            },
            update: null
          }
        ]
      }
    ],
    [
      'for (a;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'Identifier',
              name: 'a'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (a * b + c * d;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '*'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '*'
              },
              operator: '+'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (var a;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (let a;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
            test: null,
            update: null
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
      'for (a of b);',
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
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'Identifier',
              name: 'b'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let a of b);',
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
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let in x) y',
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
                name: 'y'
              }
            },
            left: {
              type: 'Identifier',
              name: 'let'
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
      'for (;;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: null,
            test: null,
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (a;b;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'Identifier',
              name: 'a'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: null
          }
        ]
      }
    ],
    [
      'for (a;;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'Identifier',
              name: 'a'
            },
            test: null,
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: null,
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (a;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'Identifier',
              name: 'a'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (a * b + c * d;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '*'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '*'
              },
              operator: '+'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for ((a * b + c) * d;b;c);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '*'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '+'
              },
              right: {
                type: 'Identifier',
                name: 'd'
              },
              operator: '*'
            },
            test: {
              type: 'Identifier',
              name: 'b'
            },
            update: {
              type: 'Identifier',
              name: 'c'
            }
          }
        ]
      }
    ],
    [
      'for (var a,b,c;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                },
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'c'
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (let a,b,c;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                },
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'c'
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (const [...x] in y){}',
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
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'y'
            }
          }
        ]
      }
    ],
    [
      'for (var a=1, b;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                    name: 'a'
                  }
                },
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
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (var a, b=1;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                },
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Literal',
                    value: 1
                  },
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (var a=1, b=2;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
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
                    name: 'a'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Literal',
                    value: 2
                  },
                  id: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    /*  [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],
    [ 'for (a in b);', Context.None, {}],*/

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
    ]
  ]);
});
