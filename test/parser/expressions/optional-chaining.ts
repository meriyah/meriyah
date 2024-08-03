import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Optional chaining', () => {
  for (const arg of [
    'func?.()',
    'obj?.prop',
    'obj?.def\\u{61}ult',
    'func?.(...args)',
    'a?.[x]',
    'a?.()',
    'x?.1:y',
    'a?.[++x]',
    'a?.b.c(++x).d',
    'a?.b[3].c?.(x).d',
    '(a?.b).c',
    'delete a?.b',
    'func?.(a, b)',
    'a?.func?.()',
    'a?.func?.(a, b)',
    'null?.valueOf()',
    'a.func?.()',
    'obj?.[expr]',
    'obj?.[expr]?.[other]',
    `obj?.[true]`,
    'obj?.[true]?.[true]',
    'obj.a?.[expr]',
    `obj.a?.[true]`,
    `foo.bar?.baz`,
    `foo?.bar?.baz`,
    `foo?.bar`,
    'a.b?.c()',
    '(a?.b).c;',
    '(a?.b).c();',
    '(a?.b)?.c.d?.e;',
    `a?.b.c.d.e?.f`,
    `a.b.c?.d.e.f`,
    `if (a?.b?.c) {
      console.log(a?.b?.c);
    } else if (a?.b.c?.d?.e.f) {
      console.log(a?.b.c?.d?.e.f);
    }`,
    'true?.valueOf()',
    '0?.valueOf()',
    'false?.()',
    '0?.()',
    '({})?.()',
    '[]?.()',
    `class A {
      a () {}
    }
    class B extends A {
      dot () {
        return super.a?.name;
      }
      expr () {
        return super['a'].name;
      }
      undf () {
        return super.b?.c;
      }
    }`,
    '({})?.a["b"]',
    'delete null?.foo',
    '({})?.constructor',
    '({ x: "hi" })?.x',
    '[]?.length',
    'true?.["valueOf"]()',
    'null?.["valueOf"]()',
    'undefined?.["valueOf"]()',
    'const a = b.map(p => p.d?.e?.f);',
    'const a = b.map(p => p.c?.d?.e ?? "(string)");',
    'f?.(arg0, arg1)',
    'true?.(123)',
    'true?.(123??x?.3:5)',
    'true?.(123)',
    `function isInvoked(obj) {
      let invoked = false;
      obj?.a.b.m(invoked = true);
      return invoked;
    }`,
    'a.b?.c?.d',
    'obj ? ["a", "b", "c"].map(x => x+x) : []',
    'const a = b?.c?.[d]?.e;',
    'const a = b?.c();',
    'const { a, b } = c.d?.e;',
    '1?.["valueOf"]()',
    '() => 0?.()',
    '() => 1?.()',
    '() => "hi"?.()',
    '() => ({})?.a["b"]',
    '() => (() => {})?.()()',
    '(() => {})?.()?.()',
    'null?.()().a["b"]',
    'delete undefined?.()',
    'delete null?.()',
    'x?.([...[function f() {}.prop]] = [])',
    'x?.({ a: obj.a } = {})',
    'value = { x: 4 };',
    'for (let [a = b?.a] of [0, c = 0]);',
    '({x: y = z = 0} = 1)?.(a??b)',
    '({x: y = z = 0} = 1)?.(a?.(a??b))',
    '({let} = 0);',
    '([x.y = a] = ([x.y = a?.y] = ([x.y = a] = z)))',
    '({..."x".x} = x?.y);',
    '({...{}.x} = x??y?.(a=b?.a));',
    '([...[([...[].x] = x??y?.z)].x] = x);',
    '([...{}.x] = x);',
    '({..."x"[x]} = x);',
    '({...[][x?.y]} = x);',
    '({...[][x?.y]} = x = y);',
    '({...[][x?.y]} = x = (y?.y??z));',
    '({...{}[x?.y]} = x?.y??z);',
    'undefined?.(...a)',
    '[a, b] = [b, a];',
    '[a, b.c] = [d?.e, f?.g];',
    '[a, b.c] = [d?.e, (f.g) = h];',
    '[a, b] = f?.(); ',
    'var [a, , b] = f();',
    '[a, ...b] = [1, 2?.a, 3];',
    'null?.(1, ...a)',
    '({}).a?.(...a)',
    '({ a: null }).a?.(...a)',
    'undefined?.(...a)?.(1, ...a)',
    '() => 5?.(...[])',
    'delete o1?.x',
    'o2.x',
    'greet.call?.({ suffix: "!" }, "world")',
    'null.call?.({ suffix: "!" }, "world")',
    '({}).call?.({ suffix: "!" }, "world")',
    'greet?.apply({ suffix: "?" }, "world")',
    'masquerader?.()',
    'greet.call?.({ suffix: "!" }, "world")',
    'greet.call?.({ suffix: "!" }, "world")',
    'o2.x?.["y"];',
    'a?.[foo(a)]',
    'a ?? a.b ?? (a?.b).c();',
    'a ?? foo.bar?.baz ?? a.c',
    'a ?? aobj?.[expr]?.[other] ?? foo.bar?.baz',
    'a?.b[3].c?.(x).d ?? aobj?.[expr]?.[other] ?? foo.bar?.baz',
    'const x = a?.b.c',
    '(null)?.b === null',
    'let a = b?.c',
    'a?.b',
    '!a ? a : a.b',
    'foo(null?.x)',
    'let a = b?? "default";',
    'let a = b.c ?? "default";',
    'let xn = x?.normalize("NFC")',
    'a?.b === undefined',
    'null?.foo === null',
    'var v = a?.b?.c?.d',
    'var v = (((a?.b)?.c)?.d)',
    'a?.b?.c?.d === undefined',
    'o3?.a === o4?.a === undefined',
    'o3?.a?.b === o4?.a?.b === undefined',
    'o3?.a?.b?.c === o4?.a?.b?.c === undefined',
    'x in (o3?.a)',
    'obj.func?.[arg].property;',
    'obj.func?.[arg.property];',
    'a?.b.c.e?.f.g?.h.t.c?.d()?.e;',
    'a?.d().f?.b',
    '(fn()?.a)?.b',
    'a?.[++x]',
    'a?.b.c(++x).d;',
    'undefined?.[++x]',
    'undefined?.b.c(++x).d; ',
    'undefined?.b',
    'obj.func?.[arg];',
    'a?.trim()?.indexOf("hello")',
    'foo?.x?.y?.z?()=>{foo}:bar;',
    `if (a?.b?.c === 'foobar') {}
     if (a?.b()?.c) {}
     if (a?.b?.()?.c) {}`,
    'yield?.(yield())',
    'yield?.(yield())',
    'async?.(package())',
    'async?.(async())',
    'async?.(async?.a, async?.a)',
    'async?.(async?.a, async?.(x))',
    'async?.(async?.(), async?.[x])',
    'async?.(async?.a, async?.a)',
    'async?.("string", async?.a, async?.a)',
    'async?.(123, async?.a, async?.a)',
    'async?.(async?.a, "string", a=>x?.z)',
    'async?.("string", async=>x?.z, x=>async?.z)',
    'async?.(async=>x?.z, "string", async(yield)=>x?.z)',
    'async?.(async=>x?.z, "string", async(x)=>x?.z)',
    'async?.(async(x)=>x?.z, "string", async(x)=>x?.z)',
    'async?.(async()=>x?.await)',
    'new async(async()=>x?.await)',
    'new yield(async()=>x?.await)',
    'new new class {}().constructor();',
    'System.global.navigator?.toString()',
    '(a?.b).async?.[await??async]',
    '"hello"?.a',
    'null?.a',
    '[1, 2]?.[1]',
    '(function a () {}?.name)',
    '(class Foo {}?.name)',
    '(function * a () {}?.name)',
    '(async function a () {}?.name)',
    '(async function * a () {}?.name)',
    '/[a-z]/?.test("a")',
    '`hello`?.[0]',
    '({a: 33}, null)?.a',
    '({a: 33})?.a',
    '(undefined, {a: 33})?.a',
    'arr?.[i + 1]',
    'arr[0]?.a',
    'arr[1]?.a',
    'false?.4:5',
    'delete o2?.x',
    'greet.call?.({ suffix: "!" }, "world")',
    '({ undefined: 3 })?.[null?.a]',
    '(() => 3)?.(null?.a)',
    '({})?.["i"]?.()',
    '() => ({})?.["i"]()',
    '0?.()',
    '1?.()',
    '[]?.()',
    '({})?.["constructor"]',
    '[]?.length',
    '1?.valueOf()',
    '0?.valueOf()',
    'o1.x?.["y"];',
    'o1.x?.();',
    'null?.(o1.x);',
    'obj?.c(10)',
    'obj?.d();',
    '(a?.b).c',
    `a?.b(...args);`,
    '(obj?.a)?.b',
    '(fn()?.a)?.b',
    `a?.b(...args).c;`,
    'const value = true ?.30 : false;',
    'undf?.b',
    '[x.y = 1] = [42]',
    '({ x: 1 }).x?.y.z;',
    `a?.b(...args).c(...args);`,
    'let a = b?.c;',
    'o.x?[y]+z:t',
    '({ x: y?.z })',
    'var a = b.c("string")?.d.e || 0;',
    'x?.void',
    'x?.voi\\u0064',
    'x?.protected',
    'x?.prot\\u0065cted',
    'class C { #m = 1; static m(obj) { return obj?.#m; } }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsLexical);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });
  }

  fail('Expressions - Optional chaining (fail)', [
    ['a = { x = flag?.[] = true } = value;', Context.None],
    ['a?.fn`hello`;', Context.None],
    ['({x: [y]?.a = 0} = 1)', Context.None],
    ['async(x?.x)=>x?.z', Context.None],
    ['[a, x?.z] = f(() => { [a, b.c] = [d.e, (f.g) = h]; }); ', Context.None],
    ['([a, b] = f?.x(() => { [a, b?.c] = [d.e, (f.g) = h]; }));', Context.None],
    ['[a, ...b?.a] = [1, 2, ...c];', Context.None],
    ['({..."x"?.x} = x);', Context.None],
    ['([x.y = a] = ([x.y = a?.y] = ([x.y?.y = a] = z)))', Context.None],
    ['([...[]?.x] = x);', Context.None],
    ['({...[][x?.y]} = (x?.i) = (y));', Context.None],
    ['({0: y?.a} = 0)', Context.None],
    ['({0: x?.a, 1: x} = 0)', Context.None],
    ['({a:let?.foo} = 0);', Context.None],
    ['x?.[y] = foo', Context.None],
    ['0, [{ set y(val) {}}?.y] = [23];', Context.None],
    ['0, { x: y?.z = 42 } = { x: 23 };', Context.None],
    ['0, { x: y?.z = 42 } = { x: 23 };', Context.OptionsWebCompat],
    ['0, { x: y?.z } = { x: 23 };', Context.None],
    ['0, { x: { set y(val) { }}?.y = 42} = {x: 42};', Context.None],
    ['0, { x: { set y(val) {}}?.y} = {x: 42};', Context.None],
    ['for ([x?.y = 42] in [[23]]) ;', Context.OptionsWebCompat],
    ['for ([x?.y = 42] in [[23]]) ;', Context.None],
    ['for ([x?.y] in [[23]]) ;', Context.None],
    ['for ([x?.y] in [[23]]) ;', Context.OptionsWebCompat],
    ['for ([{ set y(val) {}}?.y = 42] in [[23]]) ;', Context.None],
    ['for ([{ set y(val) {}}?.y] in [[23]]) ;', Context.None],
    ['for ({ x: y?.z = 42 } in [{ x: 23 }]) ;', Context.None],
    ['for ({ x: y?.z } in [{ x: 23 }]) ;', Context.None],
    ['for ({ x: { set y(val) { }}?.y = 42} in [{x: 42}]) ;', Context.None],
    ['for ({ x: { set y(val) {} }?.y} in [{x: 42}]) ;', Context.None],
    ['for ([x?.y = 42] of [[23]]) ;', Context.None],
    ['for ([x?.y] of [[23]]) ;', Context.None],
    ['for ([{ set y(val) {}}?.y = 42] of [[23]]) ;', Context.None],
    ['for ([{ set y(val) { }}?.y] of [[23]]) ;', Context.None],
    ['for ({ x: y?.z = 42 } of [{ x: 23 }]) ;', Context.None],
    ['for ({ x: y?.z } of [{ x: 23 }]) ;', Context.None],
    ['for ({ x: {set y(val) { }}?.y = 42} of [{x: 42}]) ;', Context.None],
    ['for ({ x: { set y(val) {}}?.y} of [{x: 42}]) ;', Context.None],
    ['0, [x?.y] = [23];', Context.None],
    ['0, [x?.y = 42] = [23];', Context.None],
    ['0, { x: { set y(val) {}}?.y} = {x: 42};', Context.None],
    ['0, [{ set y(val) {}}?.y] = [23];', Context.None],
    ['async?.(async?.(), async?.[])', Context.None],
    ['yield?.await = foo', Context.None],
    ['async?.await = foo', Context.None],
    ['async?.[x] = foo', Context.None],
    ['async?.() = foo', Context.None],
    ['a.?2.3', Context.None],
    ['a.?.2', Context.None],
    ['a.?2.n', Context.None],
    ['a.?2.3', Context.None],
    ['class C {} class D extends C { foo() { return super?.["bar"]; } }', Context.None],
    ['const o = { C: class {} }; new o?.C();', Context.None],
    ['const o = { C: class {} }; new o?.["C"]();', Context.None],
    ['class C {} new C?.();', Context.None],
    ['function foo() { new?.target; }', Context.None],
    ['function tag() {} tag?.``;', Context.None],
    ['const o = { tag() {} }; o?.tag``;', Context.None],
    ['a.?2.?n', Context.None],
    ['obj?.a = 33;', Context.None],
    ['a.? (?) [?]', Context.None],
    ['a.?2.3', Context.None],
    ['{a: 44}?.a', Context.None],
    ['let obj = {x:x?.1}; [...obj["x"]] = [10];', Context.None],
    ['let [...[...[...x?.a]]] = [x?.[[]]];', Context.None],
    ['let [...[...[...x?.a]]] = [[[]]];', Context.None],
    ['let [...[...[...x]]] = [?.a[[]]];', Context.None],
    ['try {} catch ([e?.a, ...a]) {}', Context.None],
    ['try {} catch (a?.[e]) {}', Context.None],
    ['[...[{x?.prop: 1}.prop]] = []', Context.None],
    ['[...[{prop?.a: 1}.prop]] = []', Context.None],
    ['[...[{prop: 1}.prop]] = x?.[]', Context.None],
    ['obj?.[expr] func?.(...args) new C?.(...args)', Context.None],
    ['o.x?[y]+z', Context.None],
    ['obj:?.prop', Context.None],
    ['obj:?[expr]', Context.None],
    ['func:?(...args)', Context.None],
    ['a === null: a?.b.c === undefined', Context.None],
    ['a === null: a?.b.c === undefined', Context.None],
    ['?.a?.b?.c', Context.None],
    ['?.(a.b.c)', Context.None],
    ['?. ?[] ?() ?:', Context.None],
    ['var b = condition ? a?.x.?y : a?.y?.z;', Context.None],
    ['a.?[b.c].d', Context.None],
    ['a[?b[c]]', Context.None],
    ['delete ?a.b.c', Context.None],
    ['delete ?a.b.c', Context.None],
    ['[x?.y = 1]', Context.None],
    ['[x?.x?.y = 1]', Context.None],
    ['[x?.?.y = 1]', Context.None],
    ['[x?.y = 1]', Context.None],
    ['a?.b => (a == null ? a : a.b)', Context.None],
    ['foo?.x?.y?.z?()=>foo;', Context.None],
    ['const a = { b(){ return super?.c; } }', Context.None],
    ['class A{ b(){ return super?.b; } }', Context.OptionsWebCompat],
    ['new a?.();', Context.Module | Context.Strict],
    ['new C?.b.d()', Context.OptionsWebCompat],
    ['a.?b.?()', Context.OptionsWebCompat],
    ['a.?()', Context.OptionsWebCompat],
    ['a?.b = c', Context.OptionsWebCompat],
    ['a?.{a} = c', Context.OptionsWebCompat],
    ['a?.(a) = c', Context.OptionsWebCompat],
    ['o3?.a in ()', Context.OptionsWebCompat],
    ['a?.b => (a == null ? void 0 : a.b) a?.b.c => (a == null ? void 0 : a.b.c)', Context.OptionsWebCompat],
    // FIXME: current implementation does not invalidate destructuring.
    // ["({ a: x?.obj['a'] } = {})", Context.OptionsWebCompat],
    // ['[...[x?.this[0], ...x?.this[1]]] = []', Context.OptionsWebCompat],
    ['class C {} class D extends C { foo() { return super?.bar; } }', Context.OptionsWebCompat],
    ['class C {} class D extends C { foo() { return super?.["bar"]; }', Context.OptionsWebCompat],
    ['class C {} class D extends C { constructor() { super?.(); } }', Context.OptionsWebCompat],
    ['const o = { C: class {} }; new o?.C();', Context.OptionsWebCompat],
    ['const o = { C: class {} }; new o?.["C"]();', Context.OptionsWebCompat],
    ['class C {} new C?.();', Context.OptionsWebCompat],
    ['function tag() {} tag?.``', Context.OptionsWebCompat],
    ['const o = { tag() {} }; o?.tag``', Context.OptionsWebCompat],
    ['import?.("foo")', Context.OptionsWebCompat],
    ['new new class {}()?.constructor?.();', Context.OptionsWebCompat],
    ['a?.{a} = c', Context.None],
    ['a.?()', Context.None]
  ]);

  pass('Optional chaining (pass)', [
    [
      `a?.b`,
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a',
                  start: 0,
                  end: 1,
                  range: [0, 1]
                },
                computed: false,
                optional: true,
                property: {
                  type: 'Identifier',
                  name: 'b',
                  start: 3,
                  end: 4,
                  range: [3, 4]
                },
                start: 0,
                end: 4,
                range: [0, 4]
              },
              start: 0,
              end: 4,
              range: [0, 4]
            },
            start: 0,
            end: 4,
            range: [0, 4]
          }
        ],
        start: 0,
        end: 4,
        range: [0, 4]
      }
    ],
    [
      'obj.aaa.bbb',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'obj',
                  start: 0,
                  end: 3,
                  range: [0, 3]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'aaa',
                  start: 4,
                  end: 7,
                  range: [4, 7]
                },
                start: 0,
                end: 7,
                range: [0, 7]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'bbb',
                start: 8,
                end: 11,
                range: [8, 11]
              },
              start: 0,
              end: 11,
              range: [0, 11]
            },
            start: 0,
            end: 11,
            range: [0, 11]
          }
        ],
        start: 0,
        end: 11,
        range: [0, 11]
      }
    ],
    [
      'obj.aaa?.bbb',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'obj',
                    start: 0,
                    end: 3,
                    range: [0, 3]
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'aaa',
                    start: 4,
                    end: 7,
                    range: [4, 7]
                  },
                  start: 0,
                  end: 7,
                  range: [0, 7]
                },
                computed: false,
                optional: true,
                property: {
                  type: 'Identifier',
                  name: 'bbb',
                  start: 9,
                  end: 12,
                  range: [9, 12]
                },
                start: 0,
                end: 12,
                range: [0, 12]
              },
              start: 0,
              end: 12,
              range: [0, 12]
            },
            start: 0,
            end: 12,
            range: [0, 12]
          }
        ],
        start: 0,
        end: 12,
        range: [0, 12]
      }
    ],
    [
      'obj?.aaa.bbb',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'obj',
                    start: 0,
                    end: 3,
                    range: [0, 3]
                  },
                  computed: false,
                  optional: true,
                  property: {
                    type: 'Identifier',
                    name: 'aaa',
                    start: 5,
                    end: 8,
                    range: [5, 8]
                  },
                  start: 0,
                  end: 8,
                  range: [0, 8]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'bbb',
                  start: 9,
                  end: 12,
                  range: [9, 12]
                },
                start: 0,
                end: 12,
                range: [0, 12]
              },
              start: 0,
              end: 12,
              range: [0, 12]
            },
            start: 0,
            end: 12,
            range: [0, 12]
          }
        ],
        start: 0,
        end: 12,
        range: [0, 12]
      }
    ],
    [
      'obj?.aaa?.bbb',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'obj',
                    start: 0,
                    end: 3,
                    range: [0, 3]
                  },
                  computed: false,
                  optional: true,
                  property: {
                    type: 'Identifier',
                    name: 'aaa',
                    start: 5,
                    end: 8,
                    range: [5, 8]
                  },
                  start: 0,
                  end: 8,
                  range: [0, 8]
                },
                computed: false,
                optional: true,
                property: {
                  type: 'Identifier',
                  name: 'bbb',
                  start: 10,
                  end: 13,
                  range: [10, 13]
                },
                start: 0,
                end: 13,
                range: [0, 13]
              },
              start: 0,
              end: 13,
              range: [0, 13]
            },
            start: 0,
            end: 13,
            range: [0, 13]
          }
        ],
        start: 0,
        end: 13,
        range: [0, 13]
      }
    ],
    [
      '(obj.aaa).bbb',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'obj',
                  start: 1,
                  end: 4,
                  range: [1, 4]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'aaa',
                  start: 5,
                  end: 8,
                  range: [5, 8]
                },
                start: 1,
                end: 8,
                range: [1, 8]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'bbb',
                start: 10,
                end: 13,
                range: [10, 13]
              },
              start: 0,
              end: 13,
              range: [0, 13]
            },
            start: 0,
            end: 13,
            range: [0, 13]
          }
        ],
        start: 0,
        end: 13,
        range: [0, 13]
      }
    ],
    [
      '(obj.aaa)?.bbb',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'obj',
                    start: 1,
                    end: 4,
                    range: [1, 4]
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'aaa',
                    start: 5,
                    end: 8,
                    range: [5, 8]
                  },
                  start: 1,
                  end: 8,
                  range: [1, 8]
                },
                computed: false,
                optional: true,
                property: {
                  type: 'Identifier',
                  name: 'bbb',
                  start: 11,
                  end: 14,
                  range: [11, 14]
                },
                start: 0,
                end: 14,
                range: [0, 14]
              },
              start: 0,
              end: 14,
              range: [0, 14]
            },
            start: 0,
            end: 14,
            range: [0, 14]
          }
        ],
        start: 0,
        end: 14,
        range: [0, 14]
      }
    ],
    [
      '(obj?.aaa).bbb',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'ChainExpression',
                expression: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'obj',
                    start: 1,
                    end: 4,
                    range: [1, 4]
                  },
                  computed: false,
                  optional: true,
                  property: {
                    type: 'Identifier',
                    name: 'aaa',
                    start: 6,
                    end: 9,
                    range: [6, 9]
                  },
                  start: 1,
                  end: 9,
                  range: [1, 9]
                },
                start: 1,
                end: 9,
                range: [1, 9]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'bbb',
                start: 11,
                end: 14,
                range: [11, 14]
              },
              start: 0,
              end: 14,
              range: [0, 14]
            },
            start: 0,
            end: 14,
            range: [0, 14]
          }
        ],
        start: 0,
        end: 14,
        range: [0, 14]
      }
    ],
    [
      '(obj?.aaa)?.bbb',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'ChainExpression',
                  expression: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'obj',
                      start: 1,
                      end: 4,
                      range: [1, 4]
                    },
                    computed: false,
                    optional: true,
                    property: {
                      type: 'Identifier',
                      name: 'aaa',
                      start: 6,
                      end: 9,
                      range: [6, 9]
                    },
                    start: 1,
                    end: 9,
                    range: [1, 9]
                  },
                  start: 1,
                  end: 9,
                  range: [1, 9]
                },
                computed: false,
                optional: true,
                property: {
                  type: 'Identifier',
                  name: 'bbb',
                  start: 12,
                  end: 15,
                  range: [12, 15]
                },
                start: 0,
                end: 15,
                range: [0, 15]
              },
              start: 0,
              end: 15,
              range: [0, 15]
            },
            start: 0,
            end: 15,
            range: [0, 15]
          }
        ],
        start: 0,
        end: 15,
        range: [0, 15]
      }
    ],
    [
      'a?.[x]',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        body: [
          {
            end: 6,
            expression: {
              end: 6,
              expression: {
                computed: true,
                end: 6,
                object: {
                  end: 1,
                  name: 'a',
                  range: [0, 1],
                  start: 0,
                  type: 'Identifier'
                },
                optional: true,
                property: {
                  end: 5,
                  name: 'x',
                  range: [4, 5],
                  start: 4,
                  type: 'Identifier'
                },
                range: [0, 6],
                start: 0,
                type: 'MemberExpression'
              },
              range: [0, 6],
              start: 0,
              type: 'ChainExpression'
            },
            range: [0, 6],
            start: 0,
            type: 'ExpressionStatement'
          }
        ],
        end: 6,
        range: [0, 6],
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'a?.import("string")?.import.meta??(a)',
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        body: [
          {
            end: 37,
            expression: {
              end: 37,
              left: {
                end: 32,
                expression: {
                  computed: false,
                  end: 32,
                  object: {
                    computed: false,
                    end: 27,
                    object: {
                      arguments: [
                        {
                          end: 18,
                          range: [10, 18],
                          start: 10,
                          type: 'Literal',
                          value: 'string'
                        }
                      ],
                      callee: {
                        computed: false,
                        end: 9,
                        object: {
                          end: 1,
                          name: 'a',
                          range: [0, 1],
                          start: 0,
                          type: 'Identifier'
                        },
                        optional: true,
                        property: {
                          end: 9,
                          name: 'import',
                          range: [3, 9],
                          start: 3,
                          type: 'Identifier'
                        },
                        range: [0, 9],
                        start: 0,
                        type: 'MemberExpression'
                      },
                      end: 19,
                      range: [0, 19],
                      start: 0,
                      type: 'CallExpression'
                    },
                    optional: true,
                    property: {
                      end: 27,
                      name: 'import',
                      range: [21, 27],
                      start: 21,
                      type: 'Identifier'
                    },
                    range: [0, 27],
                    start: 0,
                    type: 'MemberExpression'
                  },
                  property: {
                    end: 32,
                    name: 'meta',
                    range: [28, 32],
                    start: 28,
                    type: 'Identifier'
                  },
                  range: [0, 32],
                  start: 0,
                  type: 'MemberExpression'
                },
                range: [0, 32],
                start: 0,
                type: 'ChainExpression'
              },
              operator: '??',
              range: [0, 37],
              right: {
                end: 36,
                name: 'a',
                range: [35, 36],
                start: 35,
                type: 'Identifier'
              },
              start: 0,
              type: 'LogicalExpression'
            },
            range: [0, 37],
            start: 0,
            type: 'ExpressionStatement'
          }
        ],
        end: 37,
        range: [0, 37],
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      `a?.()`,
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'a',
                  start: 0,
                  end: 1,
                  range: [0, 1]
                },
                arguments: [],
                optional: true,
                start: 0,
                end: 5,
                range: [0, 5]
              },
              start: 0,
              end: 5,
              range: [0, 5]
            },
            start: 0,
            end: 5,
            range: [0, 5]
          }
        ],
        start: 0,
        end: 5,
        range: [0, 5]
      }
    ],
    [
      `a?.b[3].c?.(x).d`,
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'MemberExpression',
                      object: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'a',
                          start: 0,
                          end: 1,
                          range: [0, 1]
                        },
                        computed: false,
                        optional: true,
                        property: {
                          type: 'Identifier',
                          name: 'b',
                          start: 3,
                          end: 4,
                          range: [3, 4]
                        },
                        start: 0,
                        end: 4,
                        range: [0, 4]
                      },
                      computed: true,
                      property: {
                        type: 'Literal',
                        value: 3,
                        start: 5,
                        end: 6,
                        range: [5, 6]
                      },
                      start: 0,
                      end: 7,
                      range: [0, 7]
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'c',
                      start: 8,
                      end: 9,
                      range: [8, 9]
                    },
                    start: 0,
                    end: 9,
                    range: [0, 9]
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      name: 'x',
                      start: 12,
                      end: 13,
                      range: [12, 13]
                    }
                  ],
                  optional: true,
                  start: 0,
                  end: 14,
                  range: [0, 14]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'd',
                  start: 15,
                  end: 16,
                  range: [15, 16]
                },
                start: 0,
                end: 16,
                range: [0, 16]
              },
              start: 0,
              end: 16,
              range: [0, 16]
            },
            start: 0,
            end: 16,
            range: [0, 16]
          }
        ],
        start: 0,
        end: 16,
        range: [0, 16]
      }
    ],
    [
      `({})?.a["b"]`,
      Context.OptionsRanges | Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ChainExpression',
              expression: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'ObjectExpression',
                    properties: [],
                    start: 1,
                    end: 3,
                    range: [1, 3]
                  },
                  computed: false,
                  optional: true,
                  property: {
                    type: 'Identifier',
                    name: 'a',
                    start: 6,
                    end: 7,
                    range: [6, 7]
                  },
                  start: 0,
                  end: 7,
                  range: [0, 7]
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 'b',
                  start: 8,
                  end: 11,
                  range: [8, 11]
                },
                start: 0,
                end: 12,
                range: [0, 12]
              },
              start: 0,
              end: 12,
              range: [0, 12]
            },
            start: 0,
            end: 12,
            range: [0, 12]
          }
        ],
        start: 0,
        end: 12,
        range: [0, 12]
      }
    ]
  ]);
});
