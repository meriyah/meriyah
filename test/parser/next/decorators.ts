import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
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
        parseSource(`${arg}`, {"next":true} );
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, {"next":true,"webcompat":true} );
      });
    });
  }

  fail('Next - Decorators (fail)', [
    { code: 'class A { accessor a() {}}', options: { module: true, next: true } },
    { code: 'class A { @dec accessor a() {}}', options: { module: true, next: true } },
    { code: 'class A { accessor @dec a}', options: { module: true, next: true } },
    { code: `class A {  constructor(@foo x) {} }`, options: { module: true, next: true } },
    { code: `@decorate`, options: { next: true } },
    { code: `class A { @abc constructor(){} }`, options: { module: true, next: true } },
    { code: 'export default @decorator class Foo {}', options: { module: true } },
    { code: 'class Foo {@abc constructor(){}', options: { next: true } },
    { code: 'class A { @dec }', options: { next: true } },
    { code: 'class A { @dec ;}', options: { next: true } },
    { code: 'var obj = { method(@foo x) {} };', options: { next: true } },
    { code: 'class Foo { constructor(@foo x) {} }', options: { next: true } },
    { code: 'class Foo { @abc constructor(){} }', options: { next: true } },
    { code: 'class Foo {  @a; m(){}}', options: { next: true } },
    { code: 'class Foo { @abc constructor(){} }', options: { next: true } },
    { code: 'class A { @foo && bar method() {}  }', options: { next: true } },
    { code: 'class A { @foo && bar; method() {}  }', options: { next: true } },
    { code: '@bar export const foo = 1;', options: { next: true }, context: Context.Module },
    { code: '@bar export {Foo};', options: { next: true }, context: Context.Module },
    { code: '@bar export * from "./foo";', options: { next: true }, context: Context.Module },
    { code: '@bar export default function foo() {}', options: { next: true }, context: Context.Module },
    { code: '@bar export const lo = {a: class Foo {}};', options: { next: true }, context: Context.Module },
    { code: '@bar const foo = 1;', options: { next: true } },
    { code: '@bar function foo() {}', options: { next: true } },
    { code: '(@bar const foo = 1);', options: { next: true } },
    { code: '(@bar function foo() {})', options: { next: true } },
    { code: '@bar;', options: { next: true } },
    { code: '@bar();', options: { next: true } },
    { code: '@foo export @bar class A {}', options: { next: true }, context: Context.Module },
    { code: '@foo export default @bar class A {}', options: { next: true }, context: Context.Module },
  ]);

  pass('Next - Decorators (pass)', [
    { code: `class A { @dec name = 0; }`, options: { next: true, ranges: true, loc: true } },
    { code: `class A {  @deco #prop; #foo = 2; test() {  this.#foo; }}`, options: { next: true } },
    { code: `(class A { @foo get getter(){} })`, options: { module: true, next: true } },
    {
      code: `export default @id class Sample {
        method() {
          class Child {}
        }
      }`,
      options: { module: true, next: true },
    },
    {
      code: `@bar export default
          class Foo { }`,
      options: { next: true, module: true, ranges: true, loc: true },
    },
    {
      code: `export default
          @bar class Foo { }`,
      options: { next: true, module: true, ranges: true, loc: true },
    },
    {
      code: `export default @bar
          class Foo { }`,
      options: { module: true, next: true },
    },
    {
      code: `@pushElement({
        kind: "initializer",
        placement: "own",
        initializer() {
          self = this;
        }
      })
      class A {}
      new A();`,
      options: { module: true, next: true },
    },
    {
      code: `@decorator
           class Foo {
            async f1() {}
            *f2() {}
            async *f3() {}
          }`,
      options: { next: true },
    },
    { code: `export default (@decorator class Foo {})`, options: { module: true, next: true } },
    {
      code: `class Foo {
        @A * b() {}
      }`,
      options: { next: true },
    },
    {
      code: `function deco() {}

      class Foo {
        @deco
        *generatorMethod() {}
      }`,
      options: { next: true },
    },
    { code: `@deco1 @deco2() @deco3(foo, bar) @deco4({foo, bar}) class Foo {}`, options: { next: true } },
    {
      code: `@foo('bar')
  class Foo {}`,
      options: { next: true },
    },
    {
      code: `@foo('bar')
  class Foo {}`,
      options: { next: true, module: true },
    },
    {
      code: `(@foo('bar')
  class Foo {})`,
      options: { next: true, ranges: true, loc: true },
    },
    {
      code: `(@foo('bar')
  class Foo {})`,
      options: { next: true, module: true },
    },
    {
      code: `class Foo {
    @dec
    static bar() {}
  }`,
      options: { next: true },
    },
    {
      code: `class A {
        @(({ key }) => { pn = key; })
        #x = 1;

        getX() {
          return this.#x;
        }
      }`,
      options: { next: true },
    },
    {
      code: `@deco
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
      options: { next: true },
    },
    {
      code: `@deco
          class A {
            static #foo() {}

            test() {
              A.#foo();
            }
          }`,
      options: { next: true },
    },
    {
      code: `class A {
              @(({ key }) => { pn = key; })
              #x;
            }`,
      options: { next: true },
    },
    {
      code: `function writable(w) {
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
      options: { next: true },
    },
    {
      code: `class A {
                  @(_ => el = _)
                  static foo() {}
                }`,
      options: { next: true },
    },
    {
      code: `@foo(class Bar{})
    class Foo {}`,
      options: { next: true },
    },
    {
      code: `class A {
          @foo get getter(){}
        }`,
      options: { next: true },
    },
    {
      code: `@outer({
            store: @inner class Foo {}
          })
          class Bar {

          }`,
      options: { next: true },
    },
    {
      code: `class Bar{
              @outer(
                @classDec class {
                  @inner
                  innerMethod() {}
                }
              )
              outerMethod() {}
            }`,
      options: { next: true },
    },
    {
      code: `@({
                store: @inner class Foo {}
              })
              class Bar {

              }`,
      options: { next: true },
    },
    {
      code: `class A {
                    @dec #name = 0
                  }`,
      options: { next: true },
    },
    {
      code: `class Foo {
                      @dec
                      static bar() {}
                    }`,
      options: { next: true },
    },
    {
      code: `class A {
                        @dec static #name = 0
                      }`,
      options: { next: true },
    },
    { code: `class Foo { @foo @bar bar() {} }`, options: { next: true } },
    { code: `var Foo = @foo class Foo {}`, options: { next: true } },
    { code: `class Foo { @foo set bar(f) {} }`, options: { next: true } },
    { code: '@a(@b class C {}) @d(@e() class F {}) class G {}', options: { next: true } },
    { code: '@a(@b class C {}) @d(@e() class F {}) class G {}', options: { next: true, module: true } },
    { code: '@a class G {}', options: { next: true, ranges: true, loc: true } },
    { code: 'class A { @dec accessor a }', options: { next: true, ranges: true, loc: true } },
    { code: 'class A { @dec accessor #a }', options: { next: true } },
    { code: '@\n dec() class C {}', options: { next: true, ranges: true, loc: true } },
    { code: '(@\n dec() class C {})', options: { next: true, ranges: true, loc: true } },
    { code: '@\n x.y class D {}', options: { next: true, ranges: true, loc: true } },
    { code: '@\n (dec()) class C {}', options: { next: true, ranges: true, loc: true, preserveParens: true } },
    { code: '@\n (x.y) class D {}', options: { next: true, ranges: true, loc: true, preserveParens: true } },
    { code: `class A { @dec\nx }`, options: { next: true, ranges: true, loc: true } },
    { code: `class A { @dec\nx(){} }`, options: { next: true, ranges: true, loc: true } },
    { code: '@dec export class E {};', options: { next: true, module: true, ranges: true, loc: true } },
    { code: '@dec export default class {};', options: { next: true, module: true, ranges: true, loc: true } },
    { code: 'export @dec class E {};', options: { next: true, module: true, ranges: true, loc: true } },
    { code: 'export default @dec class {};', options: { next: true, module: true, ranges: true, loc: true } },
  ]);
});
