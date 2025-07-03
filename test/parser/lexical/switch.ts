import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Lexical - Switch', () => {
  fail('Lexical - Switch (fail)', [
    { code: 'switch (x) {case a: function f(){}; break; case b: let f; break; }', options: { lexical: true } },
    { code: 'switch (x) { case a: let foo; break; case b: let foo; break; }', options: { lexical: true } },
    { code: 'switch (x) { case a: let foo; break; default: let foo; break; }', options: { lexical: true } },
    { code: 'switch (x) { case a: let foo; break; case b: var foo; break; }', options: { lexical: true } },
    { code: 'switch (x) { case a: var foo; break; case b: let foo; break; }', options: { lexical: true } },
    { code: 'switch (x) { case a: let foo; break; case b: const foo = x; break; }', options: { lexical: true } },
    { code: 'switch (x) { case a: const foo = x; break; case b: let foo; break; }', options: { lexical: true } },
    { code: 'switch (x) { case a: const foo = x; break; case b: const foo = x; break; }', options: { lexical: true } },
    { code: 'switch (x) { case a: const foo = x; break; case b: var foo = x; break; }', options: { lexical: true } },
    { code: 'switch (x) { case a: var foo = x; break; case b: const foo = x; break; }', options: { lexical: true } },
    { code: 'switch (x) { case 0: var foo = 1 } let foo = 1;', options: { lexical: true } },
    { code: 'switch (x) {case a: const f = x; break; case b: function f(){}; break; }', options: { lexical: true } },
    { code: 'switch (x) {case a: async function f(){}; break; case b: let f; break; }', options: { lexical: true } },
    {
      code: 'switch (0) { case 1: async function* f() {} default: async function f() {} }',
      options: { lexical: true },
    },
    {
      code: 'switch (0) { case 1: async function* f() {} default: async function* f() {} }',
      options: { lexical: true },
    },
    { code: 'switch (0) { case 1: async function* f() {} default: let f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: async function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function f() {} default: async function f() {} }', options: { lexical: true } },
    { code: 'switch (x) {case a: function f(){}; break; case b: async function f(){} }', options: { lexical: true } },
    {
      code: 'switch (x) {case a: async function f(){}; break; case b: async function f(){} }',
      options: { lexical: true },
    },
    { code: 'switch (x) {case a: async function *f(){}; break; case b: function f(){} }', options: { lexical: true } },
    { code: 'switch (x) {case a: function *f(){}; break; case b: async function f(){} }', options: { lexical: true } },
    {
      code: 'switch (0) { case 1: async function f() {} default: async function* f() {} }',
      options: { lexical: true },
    },
    { code: 'switch (0) { case 1: async function f() {} default: class f {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function f() {} default: var f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function* f() {} default: const f = 0 }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function* f() {} default: let f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: var f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function* f() {} default: class f {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: let f; default: async function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: const f = 0 }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: let f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function* f() {} default: async function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: var f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: const f = 0 }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: class f {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: let f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: const f = 0 }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function* f() {} default: class f {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function f() {} default: function f() {} }', options: { lexical: true } },
    {
      code: 'switch (0) { case 1: async function f() {} default: function f() {} }',
      options: { webcompat: true, lexical: true },
    },
    { code: 'switch (0) { case 1: async function* f() {} default: const f = 0; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function* f() {} default: function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function* f() {} default: function* f() {} }', options: { lexical: true } },
    {
      code: 'switch (0) { case 1: async function* f() {} default: let f; }',
      options: { webcompat: true, lexical: true },
    },
    { code: 'switch (0) { case 1: class f {} default: let f; }', options: { webcompat: true, lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: var f; }', options: { webcompat: true, lexical: true } },
    {
      code: 'switch (0) { case 1: function f() {} default: const f = 0; }',
      options: { webcompat: true, lexical: true },
    },
    { code: 'switch (0) { case 1: function f() {} default: let f; }', options: { webcompat: true, lexical: true } },
    {
      code: 'switch (0) { case 1: async function* f() {} default: let f; }',
      options: { sourceType: 'module', lexical: true },
    },
    { code: 'switch (0) { case 1: class f {} default: let f; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: var f; }', options: { sourceType: 'module', lexical: true } },
    {
      code: 'switch (0) { case 1: function f() {} default: const f = 0; }',
      options: { sourceType: 'module', lexical: true },
    },
    {
      code: 'switch (0) { case 1: function f() {} default: let f; }',
      options: { sourceType: 'module', lexical: true },
    },
    { code: 'switch (0) { case 1: async function* f() {} default: let f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: let f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: var f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: const f = 0; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: let f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: var f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function* f() {} default: class f {}; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function* f() {} default: function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: let f; default: let f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: let f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: let f; default: class f {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: let f; default: const f = 0 }', options: { lexical: true } },
    { code: 'switch (0) { case 1: let f; default: function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: let f; default: let f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: async function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: class f {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: let f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function* f() {} default: function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: async function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: async function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: class f {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: async function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f = 0; default: async function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: let f = 0; default: var f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f = 0; default: let f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f = 0; ({f}) default: let x; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f = 0; const {f} = x; default: let x; }', options: { lexical: true } },
    {
      code: 'switch (0) { case 1: let f = 0; var {f} = x; default: let x; }',
      options: { webcompat: true, lexical: true },
    },
    {
      code: 'switch (0) { case 1: const f = 0; default: async function* f() {} }',
      options: { webcompat: true, lexical: true },
    },
    { code: 'switch (0) { case 1: let f = 0; var {f} = x; default: let x; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: async function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; x; default: let {f} = x; } var {f} = f', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: class f {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: async function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function* f() {} default: var f }', options: { lexical: true } },
    {
      code: 'switch (0) { case 1: async function* f() {} default: async function* f() {} }',
      options: { lexical: true },
    },
    { code: 'switch (0) { case 1: async function f() {} default: let f }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function f() {} default: const f = 0 }', options: { lexical: true } },
    { code: 'switch (x) {case a: function f(){}; break; case b: function f(){}; break; }', options: { lexical: true } },
    { code: 'switch (0) { default: let f; if (false) ; else function f() {  } }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function* f() {} default: var f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: class f {}; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: const f = 0; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: class f {} default: function f() {} }', options: { lexical: true } },
    {
      code: 'switch (0) { case 1: class f {} default: const f = 0; }',
      options: { impliedStrict: true, lexical: true },
    },
    { code: 'switch (0) { case 1: class f {} default: function f() {} }', options: { webcompat: true, lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: async function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: class f {}; }', options: { webcompat: true, lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: const f = 0; }', options: { webcompat: true, lexical: true } },
    {
      code: 'switch (0) { case 1: const f = 0; default: function f() {} }',
      options: { webcompat: true, lexical: true },
    },
    { code: 'switch (0) { case 1: const f = 0; default: class f {}; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: const f = 0; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: let f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: const f = 0; default: var f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function* f() {} default: async function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function* f() {} default: var f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: let f; default: class f {}; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: let f; default: var f; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: async function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: class f {}; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: const f = 0; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: var f; default: function* f() {} }', options: { lexical: true } },
    { code: 'switch (0) { default: let f; if (false) ; else function f() {  } }', options: { lexical: true } },
    { code: 'switch(0) { case 0: let a; case 1: let a; }', options: { lexical: true } },
    { code: 'switch (0) { case 1: function f() {} default: var f }', options: { lexical: true } },
    { code: 'switch(0) { case 0: let a; default: let a; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch(0) { default: let a; case 0: let a; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch(0) { case 0: let a; case 1: var a; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch(0) { case 0: let a; default: let a; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch(0) { default: let a; case 0: let a; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch(0) { case 0: let a; case 1: var a; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch(0) { case 0: var a; case 1: let a; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch(0) { case 0: var a; default: let a; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch(0) { default: let a; case 0: var a; }', options: { sourceType: 'module', lexical: true } },
    { code: 'switch(0) { case 0: let a; default: let a; }', options: { lexical: true } },
    { code: 'switch(0) { default: let a; case 0: let a; }', options: { lexical: true } },
    { code: 'switch(0) { case 0: let a; case 1: var a; }', options: { lexical: true } },
    { code: 'switch(0) { case 0: var a; case 1: let a; }', options: { lexical: true } },
    { code: 'switch(0) { case 0: var a; default: let a; }', options: { lexical: true } },
    { code: 'switch(0) { default: let a; case 0: var a; }', options: { lexical: true } },
    { code: 'switch(0) { case 0: var a; case 1: const a = 0; }', options: { webcompat: true, lexical: true } },
    { code: 'switch(0) { case 0: const a = 0; default: var a; }', options: { webcompat: true, lexical: true } },
    { code: 'switch(0) { case 0: var a; default: const a = 0; }', options: { webcompat: true, lexical: true } },
    { code: 'switch(0) { default: const a = 0; case 0: var a; }', options: { webcompat: true, lexical: true } },
    { code: 'switch(0) { default: var a; case 0: const a = 0; }', options: { webcompat: true, lexical: true } },
    { code: 'switch(0) { case 0: var a; case 1: const a = 0; }', options: { lexical: true } },
    { code: 'switch(0) { case 0: const a = 0; default: var a; }', options: { lexical: true } },
    { code: 'switch(0) { case 0: var a; default: const a = 0; }', options: { lexical: true } },
    { code: 'switch(0) { default: const a = 0; case 0: var a; }', options: { lexical: true } },
    { code: 'switch(0) { default: var a; case 0: const a = 0; }', options: { lexical: true } },
    { code: 'switch (x) { default: function(){} function(){} }', options: { lexical: true } },
    { code: 'switch (x) { case c: function(){} function(){} }', options: { lexical: true } },
    { code: 'switch (x) { case c: async function f(){} async function f(){} }', options: { lexical: true } },
    { code: 'switch (x) { default: async function f(){} async function f(){} }', options: { lexical: true } },
    {
      code: 'switch (x) { default: async function f(){} async function f(){} }',
      options: { webcompat: true, lexical: true },
    },
    { code: 'switch (x) { default: async function *f(){} async function *f(){} }', options: { lexical: true } },
    {
      code: 'switch (x) { default: async function *f(){} async function *f(){} }',
      options: { webcompat: true, lexical: true },
    },
    { code: 'switch (x) { default: function f(){} function f(){} }', options: { impliedStrict: true, lexical: true } },
    { code: 'switch (x) { default: function *f(){} function *f(){} }', options: { lexical: true } },
    { code: 'switch (x) { default: function *f(){} function *f(){} }', options: { webcompat: true, lexical: true } },
  ]);

  for (const arg of [
    'switch (0) { case 1: var f; default: var f }',
    'switch (x) { case a: var foo; break; default: var foo; break; }',
    'switch (0) { case 1: var f; default: var f }',
    'switch (0) { case 1: var f; default: var f; }',
    'switch (0) { case 1: let f = 0; default: [f] }',
    'switch (0) { case 1: let f = 0; x; default: let x; } var {f} = f',
    'switch (0) { case 1: var f = 0; x; default: var {f} = x; } var {f} = f',
    'switch (x) { case a: var foo; break; default: var foo; break; }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, lexical: true });
      });
    });
  }

  for (const arg of [
    'switch (0) { case 1: var f; default: var f }',
    'switch (x) { case a: var foo; break; default: var foo; break; }',
    'switch (0) { case 1: var f = 0; x; default: var {f} = x; } var {f} = f',
    'switch (x) {case a: function f(){}; break; case b: function f(){}; break; }',
    outdent`
      switch (0) { case 1: var f = 0; x; default: var {f} = x; } var {f} = f
      switch (0) { case 1: var f = 0; x; default: var {f} = x; } var {f} = f
    `,
    'switch (0) { case 1: let f = 0; x; default: let x; } var {f} = f',
    'switch (x) { case c: function f(){} function f(){} }',
    'switch (0) { case 1: let f = 0; default: [f] }',
    outdent`
      switch (0) { case 1: let f = 0; default: [f] }
      switch (0) { case 1: let f = 0; default: [f] }
    `,
    'switch (0) { default: let f; if (false) ; else function f() {  } }',
    'switch (0) { case 1: var f; default: var f; }',
    'switch (x) { case c: function f(){} function f(){} }',
    outdent`
      switch (0) { case 1: var f; default: var f; }
      switch (0) { case 1: var f; default: var f; }
    `,
    'for (let f of [0]) { switch (1) { case 1:function f() {  } }}',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, webcompat: true, lexical: true });
      });
    });
  }
});
