import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { Features } from '../../../src/features.ts';
import { parseSource } from '../../../src/parser.ts';
import { fail, pass } from '../../test-utils.ts';

describe('Next - Decorators', () => {
  for (const text of [
    'var foo = @dec class Bar { bam() { f(); } }',
    'class A { @dec *m(){} }',
    'class A { @a.b.c.d(e, f)     m(){}}',
    'class Bar{ @outer( @classDec class { @inner innerMethod() {} } ) outerMethod() {} }',
    '@(foo().bar) class Foo { @(member[expression]) method() {} @(foo + bar) method2() {} }',
    outdent`
      @foo('bar')
      class Foo {}
    `,
    '(class A { @foo get getter(){} })',
    'class A { @foo get getter(){} }',
    'class A { @foo set setter(bar){} }',
    'class A { @foo async bar(){} }', // allowed?
    '@foo class Foo {}',
    outdent`
      @outer({
        store: @inner class Foo {}
      })
      class Bar {
      }
    `,
    outdent`
      @({
        store: @inner class Foo {}
      })
      class Bar {
      }
    `,
    outdent`
      @foo(@bar class Bar{})
      class Foo {}
    `,
    'class Foo { @foo @bar bar() {} }',
    'class Foo { @foo bar() {} }',
    'var foo = class Bar { @foo Zoo() {} }',
    outdent`
      @foo('bar')
      class Foo {}
    `,
    '@abc class Foo {}',
    outdent`
      class A {
        @dec *m(){}
      }
    `,
    outdent`
      (class A {
        @dec *m(){}
      })
    `,
    outdent`
      class A {
        @a.b.c.d(e, f)
        m(){}
      }
    `,
    'class A { @foo async a(){} }',
    outdent`
      class Foo {
        @dec
        static bar() {}
      }
    `,
    'class A { accessor = 1}',
    'class A { accessor x}',
    'class A { accessor x = 1}',
    'class A { @a.b accessor = 1}',
    'class A { @dec accessor x}',
    'class A { @dec accessor x = 1}',
    '(class { @a.b accessor = 1})',
    '(class { @dec accessor x})',
    '(class { @dec accessor x = 1})',
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { features: Features.Decorators });
      });
    });
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { features: Features.Decorators, webcompat: true });
      });
    });
  }

  fail('Next - Decorators (fail)', [
    { code: 'class A { accessor a() {}}', options: { sourceType: 'module', features: Features.Decorators } },
    { code: 'class A { @dec accessor a() {}}', options: { sourceType: 'module', features: Features.Decorators } },
    { code: 'class A { accessor @dec a}', options: { sourceType: 'module', features: Features.Decorators } },
    { code: 'class A {  constructor(@foo x) {} }', options: { sourceType: 'module', features: Features.Decorators } },
    { code: '@decorate', options: { features: Features.Decorators } },
    { code: 'class A { @abc constructor(){} }', options: { sourceType: 'module', features: Features.Decorators } },
    { code: 'export default @decorator class Foo {}', options: { sourceType: 'module' } },
    { code: 'class Foo {@abc constructor(){}', options: { features: Features.Decorators } },
    { code: 'class A { @dec }', options: { features: Features.Decorators } },
    { code: 'class A { @dec ;}', options: { features: Features.Decorators } },
    { code: 'var obj = { method(@foo x) {} };', options: { features: Features.Decorators } },
    { code: 'class Foo { constructor(@foo x) {} }', options: { features: Features.Decorators } },
    { code: 'class Foo { @abc constructor(){} }', options: { features: Features.Decorators } },
    { code: 'class Foo {  @a; m(){}}', options: { features: Features.Decorators } },
    { code: 'class Foo { @abc constructor(){} }', options: { features: Features.Decorators } },
    { code: 'class A { @foo && bar method() {}  }', options: { features: Features.Decorators } },
    { code: 'class A { @foo && bar; method() {}  }', options: { features: Features.Decorators } },
    { code: '@bar export const foo = 1;', options: { features: Features.Decorators, sourceType: 'module' } },
    { code: '@bar export {Foo};', options: { features: Features.Decorators, sourceType: 'module' } },
    { code: '@bar export * from "./foo";', options: { features: Features.Decorators, sourceType: 'module' } },
    { code: '@bar export default function foo() {}', options: { features: Features.Decorators, sourceType: 'module' } },
    {
      code: '@bar export const lo = {a: class Foo {}};',
      options: { features: Features.Decorators, sourceType: 'module' },
    },
    { code: '@bar const foo = 1;', options: { features: Features.Decorators } },
    { code: '@bar function foo() {}', options: { features: Features.Decorators } },
    { code: '(@bar const foo = 1);', options: { features: Features.Decorators } },
    { code: '(@bar function foo() {})', options: { features: Features.Decorators } },
    { code: '@bar;', options: { features: Features.Decorators } },
    { code: '@bar();', options: { features: Features.Decorators } },
    { code: '@foo export @bar class A {}', options: { features: Features.Decorators, sourceType: 'module' } },
    { code: '@foo export default @bar class A {}', options: { features: Features.Decorators, sourceType: 'module' } },
  ]);

  pass('Next - Decorators (pass)', [
    { code: 'class A { @dec name = 0; }', options: { features: Features.Decorators, ranges: true, loc: true } },
    { code: 'class A {  @deco #prop; #foo = 2; test() {  this.#foo; }}', options: { features: Features.Decorators } },
    { code: '(class A { @foo get getter(){} })', options: { sourceType: 'module', features: Features.Decorators } },
    {
      code: outdent`
        export default @id class Sample {
          method() {
            class Child {}
          }
        }
      `,
      options: { sourceType: 'module', features: Features.Decorators },
    },
    {
      code: outdent`
        @bar export default
        class Foo { }
      `,
      options: { features: Features.Decorators, sourceType: 'module', ranges: true, loc: true },
    },
    {
      code: outdent`
        export default
        @bar class Foo { }
      `,
      options: { features: Features.Decorators, sourceType: 'module', ranges: true, loc: true },
    },
    {
      code: outdent`
        export default @bar
        class Foo { }
      `,
      options: { sourceType: 'module', features: Features.Decorators },
    },
    {
      code: outdent`
        @pushElement({
          kind: "initializer",
          placement: "own",
          initializer() {
            self = this;
          }
        })
        class A {}
        new A();
      `,
      options: { sourceType: 'module', features: Features.Decorators },
    },
    {
      code: outdent`
        @decorator
        class Foo {
          async f1() {}
          *f2() {}
          async *f3() {}
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: 'export default (@decorator class Foo {})',
      options: { sourceType: 'module', features: Features.Decorators },
    },
    {
      code: outdent`
        class Foo {
          @A * b() {}
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        function deco() {}

        class Foo {
          @deco
          *generatorMethod() {}
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: '@deco1 @deco2() @deco3(foo, bar) @deco4({foo, bar}) class Foo {}',
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        @foo('bar')
        class Foo {}
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        @foo('bar')
        class Foo {}
      `,
      options: { features: Features.Decorators, sourceType: 'module' },
    },
    {
      code: outdent`
        (@foo('bar')
        class Foo {})
      `,
      options: { features: Features.Decorators, ranges: true, loc: true },
    },
    {
      code: outdent`
        (@foo('bar')
        class Foo {})
      `,
      options: { features: Features.Decorators, sourceType: 'module' },
    },
    {
      code: outdent`
        class Foo {
          @dec
          static bar() {}
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        class A {
          @(({ key }) => { pn = key; })
          #x = 1;

          getX() {
            return this.#x;
          }
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        @deco
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
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        @deco
        class A {
          static #foo() {}

          test() {
            A.#foo();
          }
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        class A {
          @(({ key }) => { pn = key; })
          #x;
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        function writable(w) {
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
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        class A {
          @(_ => el = _)
          static foo() {}
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        @foo(class Bar{})
        class Foo {}
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        class A {
          @foo get getter(){}
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        @outer({
          store: @inner class Foo {}
        })
        class Bar {

        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        class Bar{
          @outer(
            @classDec class {
              @inner
              innerMethod() {}
            }
          )
          outerMethod() {}
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        @({
          store: @inner class Foo {}
        })
        class Bar {

        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        class A {
          @dec #name = 0
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        class Foo {
          @dec
          static bar() {}
        }
      `,
      options: { features: Features.Decorators },
    },
    {
      code: outdent`
        class A {
          @dec static #name = 0
        }
      `,
      options: { features: Features.Decorators },
    },
    { code: 'class Foo { @foo @bar bar() {} }', options: { features: Features.Decorators } },
    { code: 'var Foo = @foo class Foo {}', options: { features: Features.Decorators } },
    { code: 'class Foo { @foo set bar(f) {} }', options: { features: Features.Decorators } },
    { code: '@a(@b class C {}) @d(@e() class F {}) class G {}', options: { features: Features.Decorators } },
    {
      code: '@a(@b class C {}) @d(@e() class F {}) class G {}',
      options: { features: Features.Decorators, sourceType: 'module' },
    },
    { code: '@a class G {}', options: { features: Features.Decorators, ranges: true, loc: true } },
    { code: 'class A { @dec accessor a }', options: { features: Features.Decorators, ranges: true, loc: true } },
    { code: 'class A { @dec accessor #a }', options: { features: Features.Decorators } },
    { code: '@\n dec() class C {}', options: { features: Features.Decorators, ranges: true, loc: true } },
    { code: '(@\n dec() class C {})', options: { features: Features.Decorators, ranges: true, loc: true } },
    { code: '@\n x.y class D {}', options: { features: Features.Decorators, ranges: true, loc: true } },
    {
      code: '@\n (dec()) class C {}',
      options: { features: Features.Decorators, ranges: true, loc: true, preserveParens: true },
    },
    {
      code: '@\n (x.y) class D {}',
      options: { features: Features.Decorators, ranges: true, loc: true, preserveParens: true },
    },
    { code: 'class A { @dec\nx }', options: { features: Features.Decorators, ranges: true, loc: true } },
    { code: 'class A { @dec\nx(){} }', options: { features: Features.Decorators, ranges: true, loc: true } },
    {
      code: '@dec export class E {};',
      options: { features: Features.Decorators, sourceType: 'module', ranges: true, loc: true },
    },
    {
      code: '@dec export default class {};',
      options: { features: Features.Decorators, sourceType: 'module', ranges: true, loc: true },
    },
    {
      code: 'export @dec class E {};',
      options: { features: Features.Decorators, sourceType: 'module', ranges: true, loc: true },
    },
    {
      code: 'export default @dec class {};',
      options: { features: Features.Decorators, sourceType: 'module', ranges: true, loc: true },
    },
    {
      code: outdent`
        class C {
          @dec method() {}
          @dec static method() {}
          @dec field;
          @dec static field;
        }
      `,
      options: { features: Features.Decorators, ranges: true, loc: true },
    },
  ]);
});
