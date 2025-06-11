import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Next - Decorators', () => {
  for (const arg of [
    'var foo = @dec class Bar { bam() { f(); } }',
    'class A { @dec *m(){} }',
    'class A { @a.b.c.d(e, f)     m(){}}',
    'class Bar{ @outer( @classDec class { @inner innerMethod() {} } ) outerMethod() {} }',
    `@(foo().bar) class Foo { @(member[expression]) method() {} @(foo + bar) method2() {} }`,
    `@foo('bar')
      class Foo {}`,
    `(class A { @foo get getter(){} })`,
    `class A { @foo get getter(){} }`,
    `class A { @foo set setter(bar){} }`,
    `class A { @foo async bar(){} }`, // allowed?
    '@foo class Foo {}',
    `@outer({
        store: @inner class Foo {}
      })
      class Bar {
      }`,
    `@({
        store: @inner class Foo {}
      })
      class Bar {
      }`,
    `@foo(@bar class Bar{})
      class Foo {}`,
    'class Foo { @foo @bar bar() {} }',
    'class Foo { @foo bar() {} }',
    'var foo = class Bar { @foo Zoo() {} }',
    `@foo('bar')
    class Foo {}`,
    `@abc class Foo {}`,
    `class A {
        @dec *m(){}
      }`,
    `(class A {
        @dec *m(){}
     })`,
    `class A {
      @a.b.c.d(e, f)
      m(){}
    }`,
    `class A { @foo async a(){} }`,
    `class Foo {
      @dec
      static bar() {}
    }`,
    `class A { accessor = 1}`,
    `class A { accessor x}`,
    `class A { accessor x = 1}`,
    `class A { @a.b accessor = 1}`,
    `class A { @dec accessor x}`,
    `class A { @dec accessor x = 1}`,
    `(class { @a.b accessor = 1})`,
    `(class { @dec accessor x})`,
    `(class { @dec accessor x = 1})`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });
  }

  fail('Next - Decorators (fail)', [
    ['class A { accessor a() {}}', Context.OptionsNext | Context.Module | Context.Strict],
    ['class A { @dec accessor a() {}}', Context.OptionsNext | Context.Module | Context.Strict],
    ['class A { accessor @dec a}', Context.OptionsNext | Context.Module | Context.Strict],
    ['export @bar class Foo { }', Context.OptionsNext | Context.Module | Context.Strict],
    [`class A {  constructor(@foo x) {} }`, Context.OptionsNext | Context.Module | Context.Strict],
    //[`@decorate`, Context.OptionsNext],
    [`class A { @abc constructor(){} }`, Context.OptionsNext | Context.Module | Context.Strict],
    ['export @bar class Foo { }', Context.OptionsNext | Context.Module | Context.Strict],
    ['export default @decorator class Foo {}', Context.Module | Context.Strict],
    ['class Foo {@abc constructor(){}', Context.OptionsNext],
    ['class A { @dec }', Context.OptionsNext],
    ['class A { @dec ;}', Context.OptionsNext],
    ['var obj = { method(@foo x) {} };', Context.OptionsNext],
    ['class Foo { constructor(@foo x) {} }', Context.OptionsNext],
    ['class Foo { @abc constructor(){} }', Context.OptionsNext],
    ['class Foo {  @a; m(){}}', Context.OptionsNext],
    ['class Foo { @abc constructor(){} }', Context.OptionsNext],
    ['class A { @foo && bar method() {}  }', Context.OptionsNext],
    ['class A { @foo && bar; method() {}  }', Context.OptionsNext],
    ['@bar export const foo = 1;', Context.OptionsNext | Context.Module],
    ['@bar export {Foo};', Context.OptionsNext | Context.Module],
    ['@bar export * from "./foo";', Context.OptionsNext | Context.Module],
    ['@bar export default function foo() {}', Context.OptionsNext | Context.Module],
    ['@bar export const lo = {a: class Foo {}};', Context.OptionsNext | Context.Module],
    ['@bar const foo = 1;', Context.OptionsNext],
    ['@bar function foo() {}', Context.OptionsNext],
    ['(@bar const foo = 1);', Context.OptionsNext],
    ['(@bar function foo() {})', Context.OptionsNext],
    ['@bar;', Context.OptionsNext],
    ['@bar();', Context.OptionsNext],
  ]);

  pass('Next - Decorators (pass)', [
    [`class A { @dec name = 0; }`, Context.OptionsNext | Context.OptionsRanges | Context.OptionsLoc],
    [`class A {  @deco #prop; #foo = 2; test() {  this.#foo; }}`, Context.OptionsNext],
    [`(class A { @foo get getter(){} })`, Context.OptionsNext | Context.Module | Context.Strict],
    [
      `export default @id class Sample {
        method() {
          class Child {}
        }
      }`,
      Context.OptionsNext | Context.Module | Context.Strict,
    ],
    [
      `@bar export default
          class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict | Context.OptionsRanges | Context.OptionsLoc,
    ],
    [
      `export default
          @bar class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict | Context.OptionsRanges | Context.OptionsLoc,
    ],
    [
      `export default @bar
          class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict,
    ],
    [
      `@lo export default @bar
          class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict,
    ],
    [
      `@pushElement({
        kind: "initializer",
        placement: "own",
        initializer() {
          self = this;
        }
      })
      class A {}
      new A();`,
      Context.OptionsNext | Context.Module | Context.Strict,
    ],
    [
      `@decorator
           class Foo {
            async f1() {}
            *f2() {}
            async *f3() {}
          }`,
      Context.OptionsNext,
    ],
    [`export default (@decorator class Foo {})`, Context.OptionsNext | Context.Module | Context.Strict],
    [
      `class Foo {
        @A * b() {}
      }`,
      Context.OptionsNext,
    ],
    [
      `function deco() {}

      class Foo {
        @deco
        *generatorMethod() {}
      }`,
      Context.OptionsNext,
    ],
    [`@deco1 @deco2() @deco3(foo, bar) @deco4({foo, bar}) class Foo {}`, Context.OptionsNext],
    [
      `@foo('bar')
  class Foo {}`,
      Context.OptionsNext,
    ],
    [
      `@foo('bar')
  class Foo {}`,
      Context.OptionsNext | Context.Module,
    ],
    [
      `(@foo('bar')
  class Foo {})`,
      Context.OptionsNext | Context.OptionsRanges | Context.OptionsLoc,
    ],
    [
      `(@foo('bar')
  class Foo {})`,
      Context.OptionsNext | Context.Module,
    ],
    [
      `class Foo {
    @dec
    static bar() {}
  }`,
      Context.OptionsNext,
    ],
    [
      `class A {
        @(({ key }) => { pn = key; })
        #x = 1;

        getX() {
          return this.#x;
        }
      }`,
      Context.OptionsNext,
    ],
    [
      `@deco
        class A {
          get #get() {}

          set #set(_) {}

          get #getset() {}
          set #getset(_) {}

          test() {
            this.#get;
            this.#set = 2;
            this.#getset;
            this.#getset = 2;
          }
        }`,
      Context.OptionsNext,
    ],
    [
      `@deco
          class A {
            static #foo() {}

            test() {
              A.#foo();
            }
          }`,
      Context.OptionsNext,
    ],
    [
      `class A {
              @(({ key }) => { pn = key; })
              #x;
            }`,
      Context.OptionsNext,
    ],
    [
      `function writable(w) {
                return desc => {
                  desc.descriptor.writable = w;
                }
              }

              class A {
                @writable(false)
                #x = 2;

                @writable(true)
                @writable(false)
                #y = 2;

                testX() {
                  this.#x = 1;
                }

                testY() {
                  this.#y = 1;
                }
              }`,
      Context.OptionsNext,
    ],
    [
      `class A {
                  @(_ => el = _)
                  static foo() {}
                }`,
      Context.OptionsNext,
    ],
    [
      `@foo(class Bar{})
    class Foo {}`,
      Context.OptionsNext,
    ],
    [
      `class A {
          @foo get getter(){}
        }`,
      Context.OptionsNext,
    ],
    [
      `@outer({
            store: @inner class Foo {}
          })
          class Bar {

          }`,
      Context.OptionsNext,
    ],
    [
      `class Bar{
              @outer(
                @classDec class {
                  @inner
                  innerMethod() {}
                }
              )
              outerMethod() {}
            }`,
      Context.OptionsNext,
    ],
    [
      `@({
                store: @inner class Foo {}
              })
              class Bar {

              }`,
      Context.OptionsNext,
    ],
    [
      `class A {
                    @dec #name = 0
                  }`,
      Context.OptionsNext,
    ],
    [
      `class Foo {
                      @dec
                      static bar() {}
                    }`,
      Context.OptionsNext,
    ],
    [
      `class A {
                        @dec static #name = 0
                      }`,
      Context.OptionsNext,
    ],
    [`class Foo { @foo @bar bar() {} }`, Context.OptionsNext],
    [`var Foo = @foo class Foo {}`, Context.OptionsNext],
    [`class Foo { @foo set bar(f) {} }`, Context.OptionsNext],
    ['@a(@b class C {}) @d(@e() class F {}) class G {}', Context.OptionsNext],
    ['@a(@b class C {}) @d(@e() class F {}) class G {}', Context.OptionsNext | Context.Module],
    ['@a class G {}', Context.OptionsNext | Context.OptionsRanges | Context.OptionsLoc],
    ['class A { @dec accessor a }', Context.OptionsNext | Context.OptionsLoc],
    ['class A { @dec accessor #a }', Context.OptionsNext],
  ]);
});
