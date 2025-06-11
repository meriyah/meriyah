import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Next - Import Attributes', () => {
  for (const arg of [
    `import 'bar' with { type: 'what' };`,
    `import foo from 'bar' with { type: 'json' };`,
    `import foo from 'bar' with { type: 'json', 'data-type': 'json' };`,
    `import foo from 'bar' with { "type": 'json' };`,
    `import foo from 'bar' with { "type": 'json', 'data-type': 'json' };`,
    `import {default as viaStaticImport2} from './json-idempotency_FIXTURE.json' with { type: 'json' };`,
    `import {default as viaStaticImport2} from './json-idempotency_FIXTURE.json' with { "type": 'json' };`,
    `import * as ns from './json-via-namespace_FIXTURE.json' with { type: 'json' };`,
    `import * as ns from './json-via-namespace_FIXTURE.json' with { "type": 'json' };`,
    `import { random } from './random.ts' with { type: 'macro' };`,
    `import { random } from './random.ts' with { "type": 'macro' };`,
    `import { random as foo } from './random.ts' with { type: 'macro' };`,
    `import { "random" as foo } from './random.ts' with { type: 'macro' };`,
    `import('module', { type: 'json' });`,
    `import('module', { lazy: true });`,
    `import('module', { dynamic: false });`,
    `import('module', { 'data-type': 'json' });`,
    `import('module', { 'data-version': '1.0' });`,
    `import('module', { type: 'text/javascript', version: '2.0' });`,
    `import('module', { 'type': 'module', 'import-attr': true });`,
    `'use strict'; import('module', { type: 'json' });`,
    `async function load() { return import('module', { type: 'json' }); }`,
    `(() => import('module', { type: 'json' }))()`,
    `let dynamicImport = import('module', { type: 'json' });`,
    `let dynamicImport = import('module', { "type": 'json' });`,
    `const importWithAttributes = import('module', { type: 'json' });`,
    `({ async load() { return import('module', { type: 'json' }); } })`,
    `({ async load() { return import('module', { "type": 'json' }); } })`,
    `function* gen() { yield import('module', { type: 'json' }); }`,
    `function* gen() { yield import('module', { "type": 'json' }); }`,
    `for await (let module of [import('module', { type: 'json' })]) {}`,
    `for await (let module of [import('module', { "type": 'json' })]) {}`,
    `import('module', { type: 'json' }).then(module => { /* ... */ });`,
    `import('module', { 'data-type': 'json' }).then(module => { /* ... */ });`,
    `const result = await import('module', { type: 'json' });`,
    `const result = await import('module', { "type": 'json' });`,
    `import x from './import-attribute-1_FIXTURE.js' with {};`,
    `import './import-attribute-2_FIXTURE.js' with {};`,
    `export * from './import-attribute-3_FIXTURE.js' with {};`,
    `(async function () { return import('./2nd-param_FIXTURE.js', await undefined);}())`,
    `var iter = function*() { beforeCount += 1, import('', yield), afterCount += 1;}();`,
    `var promise; for (promise = import('./2nd-param_FIXTURE.js', 'test262' in {} || undefined); false; );`,
    `export {default as viaStaticImport2} from './json-idempotency_FIXTURE.json' with { type: 'json' };`,
    `export {default as viaStaticImport2} from './json-idempotency_FIXTURE.json' with { "type": 'json' };`,
    `export * as foo from './foo.json' with { "type": 'json' };`,
    // TODO: to follow up with spec
    // Current JSON modules spec didn't prevent following line.
    `export * from './foo.json' with { "type": 'json' };`,
    `export { random } from './random.ts' with { type: 'macro' };`,
    `export { random } from './random.ts' with { "type": 'macro' };`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Strict | Context.Module);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `${arg}`,
          undefined,
          Context.OptionsNext | Context.OptionsWebCompat | Context.Strict | Context.Module,
        );
      });
    });
  }

  fail('Expressions - Import Attributes (fail)', [
    ['import("module", { type: "json" }, "extra")', Context.OptionsNext],
    ['import("module", { type: "json" }, "extra")', Context.None],
    ['import("module", { type: "json", "extra": })', Context.OptionsNext | Context.Strict | Context.Module],
    ['import("module", ...extra)', Context.OptionsNext | Context.Strict | Context.Module],
    ['import("module", { type: "json", "extra": "value" ', Context.OptionsNext | Context.Strict | Context.Module],
    [
      'import("module", { type: "json", "extra": "value" }, "another")',
      Context.OptionsNext | Context.Strict | Context.Module,
    ],
    ['import("module", { type: "json" }, "extra")', Context.OptionsNext | Context.Strict | Context.Module],
    [
      'import foo from "bar" with { type: "json", "data-type": "json"',
      Context.OptionsNext | Context.Strict | Context.Module,
    ],
    ['import foo from "bar" with { type: ', Context.OptionsNext | Context.Strict | Context.Module],
    ['import foo from "bar" with { type: "json", ', Context.OptionsNext | Context.Strict | Context.Module],
    ['import foo from "bar" with { type: "json", "data-type": ', Context.OptionsNext | Context.Strict | Context.Module],
    [
      'import foo from "bar" with { type: "json", "data-type": "json" ',
      Context.OptionsNext | Context.Strict | Context.Module,
    ],
    [
      `import {name} from './json-named-bindings_FIXTURE.json' with { type: 'json' };`,
      Context.OptionsNext | Context.Strict | Context.Module,
    ],
    [
      `import {name} from './json-named-bindings_FIXTURE.json' with { "type": 'json' };`,
      Context.OptionsNext | Context.Strict | Context.Module,
    ],
    [
      `import x from './import-attribute-1_FIXTURE.js' with {
      type: 'json',
      'typ\u0065': ''
    };`,
      Context.OptionsNext | Context.Strict | Context.Module,
    ],
    [
      'import { default as a, foo } from "./foo.json" with { type: "json" };',
      Context.OptionsNext | Context.Strict | Context.Module,
    ],
    [
      'import a, { foo } from "./foo.json" with { type: "json" };',
      Context.OptionsNext | Context.Strict | Context.Module,
    ],
    [`import 'bar' with { type: 'json' };`, Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { 1: "foo" };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: 1 };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: [1] };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: null };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: undefined };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: "json", foo: {} };', Context.OptionsNext | Context.Module],
    [`export { foo } from './foo.json' with { type: 'json' };`, Context.OptionsNext | Context.Module],
    [`export foo, { foo2 } from './foo.json' with { "type": 'json' };`, Context.OptionsNext | Context.Module],
  ]);

  pass('Next - Import Attributes (pass)', [
    [
      `import('module', { type: 'json' });`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      `import('module', { 'data-type': 'json' });`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      `async function load() { return import('module', { type: 'json' }); }`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      `for await (let module of [import('module', { type: 'json' })]) {}`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      'import foo from "bar" with { type: "json" };',
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      'import foo from "bar" with { type: "json", "data-type": "json" };',
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      `var promise; for (promise = import('./2nd-param_FIXTURE.js', 'test262' in {} || undefined); false; );`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      `export * from './foo' with { type: 'json' }`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      `export * as foo from './foo' with { type: 'json' };`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      `export {} from './foo' with { type: 'html' };`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      `export { foo } from './foo' with { type: 'html' }`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      `export { foo, } from './foo' with { type: 'html' };`,
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
  ]);
});
