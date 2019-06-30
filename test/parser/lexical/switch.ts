import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - Switch', () => {
  fail('Lexical - Switch (fail)', [
    ['switch (x) {case a: function f(){}; break; case b: let f; break; }', Context.OptionsLexical],
    ['switch (x) { case a: let foo; break; case b: let foo; break; }', Context.OptionsLexical],
    ['switch (x) { case a: let foo; break; default: let foo; break; }', Context.OptionsLexical],
    ['switch (x) { case a: let foo; break; case b: var foo; break; }', Context.OptionsLexical],
    ['switch (x) { case a: var foo; break; case b: let foo; break; }', Context.OptionsLexical],
    ['switch (x) { case a: let foo; break; case b: const foo = x; break; }', Context.OptionsLexical],
    ['switch (x) { case a: const foo = x; break; case b: let foo; break; }', Context.OptionsLexical],
    ['switch (x) { case a: const foo = x; break; case b: const foo = x; break; }', Context.OptionsLexical],
    ['switch (x) { case a: const foo = x; break; case b: var foo = x; break; }', Context.OptionsLexical],
    ['switch (x) { case a: var foo = x; break; case b: const foo = x; break; }', Context.OptionsLexical],
    ['switch (x) { case 0: var foo = 1 } let foo = 1;', Context.OptionsLexical],
    ['switch (x) {case a: const f = x; break; case b: function f(){}; break; }', Context.OptionsLexical],
    ['switch (x) {case a: async function f(){}; break; case b: let f; break; }', Context.OptionsLexical],
    ['switch (0) { case 1: async function* f() {} default: async function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function* f() {} default: async function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function* f() {} default: let f }', Context.OptionsLexical],
    ['switch (0) { case 1: class f {} default: async function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function f() {} default: async function f() {} }', Context.OptionsLexical],
    ['switch (x) {case a: function f(){}; break; case b: async function f(){} }', Context.OptionsLexical],
    ['switch (x) {case a: async function f(){}; break; case b: async function f(){} }', Context.OptionsLexical],
    ['switch (x) {case a: async function *f(){}; break; case b: function f(){} }', Context.OptionsLexical],
    ['switch (x) {case a: function *f(){}; break; case b: async function f(){} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function f() {} default: async function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function f() {} default: class f {} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function f() {} default: var f }', Context.OptionsLexical],
    ['switch (0) { case 1: async function* f() {} default: const f = 0 }', Context.OptionsLexical],
    ['switch (0) { case 1: async function* f() {} default: let f }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: var f }', Context.OptionsLexical],
    ['switch (0) { case 1: function f() {} default: function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: function* f() {} default: class f {} }', Context.OptionsLexical],
    ['switch (0) { case 1: let f; default: async function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: const f = 0 }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: let f }', Context.OptionsLexical],
    ['switch (0) { case 1: function* f() {} default: async function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: function f() {} default: var f }', Context.OptionsLexical],
    ['switch (0) { case 1: function f() {} default: function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: function f() {} default: const f = 0 }', Context.OptionsLexical],
    ['switch (0) { case 1: function f() {} default: class f {} }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: let f }', Context.OptionsLexical],
    ['switch (0) { case 1: class f {} default: function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: class f {} default: const f = 0 }', Context.OptionsLexical],
    ['switch (0) { case 1: async function* f() {} default: class f {} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function f() {} default: function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: let f; default: class f {} }', Context.OptionsLexical],
    ['switch (0) { case 1: let f; default: const f = 0 }', Context.OptionsLexical],
    ['switch (0) { case 1: let f; default: function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: let f; default: let f }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: async function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: class f {} }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: let f }', Context.OptionsLexical],
    ['switch (0) { case 1: function* f() {} default: function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: function f() {} default: async function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: function f() {} default: async function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: class f {} }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: async function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: class f {} default: class f {} }', Context.OptionsLexical],
    ['switch (0) { case 1: class f {} default: async function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function* f() {} default: var f }', Context.OptionsLexical],
    ['switch (0) { case 1: async function* f() {} default: async function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function f() {} default: let f }', Context.OptionsLexical],
    ['switch (0) { case 1: async function f() {} default: const f = 0 }', Context.OptionsLexical],
    ['switch (x) {case a: function f(){}; break; case b: function f(){}; break; }', Context.OptionsLexical],
    ['switch (0) { default: let f; if (false) ; else function f() {  } }', Context.OptionsLexical],
    ['switch (0) { case 1: async function* f() {} default: var f; }', Context.OptionsLexical],
    ['switch (0) { case 1: class f {} default: class f {}; }', Context.OptionsLexical],
    ['switch (0) { case 1: class f {} default: const f = 0; }', Context.OptionsLexical],
    ['switch (0) { case 1: class f {} default: function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: async function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: class f {}; }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: const f = 0; }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: let f; }', Context.OptionsLexical],
    ['switch (0) { case 1: const f = 0; default: var f; }', Context.OptionsLexical],
    ['switch (0) { case 1: function* f() {} default: async function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: function* f() {} default: var f; }', Context.OptionsLexical],
    ['switch (0) { case 1: let f; default: class f {}; }', Context.OptionsLexical],
    ['switch (0) { case 1: let f; default: var f; }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: async function* f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: class f {}; }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: const f = 0; }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: var f; default: function* f() {} }', Context.OptionsLexical],
    ['switch (0) { default: let f; if (false) ; else function f() {  } }', Context.OptionsLexical],
    ['switch(0) { case 0: let a; case 1: let a; }', Context.OptionsLexical],
    ['switch(0) { case 0: let a; default: let a; }', Context.OptionsLexical],
    ['switch(0) { default: let a; case 0: let a; }', Context.OptionsLexical],
    ['switch(0) { case 0: let a; case 1: var a; }', Context.OptionsLexical],
    ['switch(0) { case 0: var a; case 1: let a; }', Context.OptionsLexical],
    ['switch(0) { case 0: var a; default: let a; }', Context.OptionsLexical],
    ['switch(0) { default: let a; case 0: var a; }', Context.OptionsLexical],
    ['switch(0) { case 0: var a; case 1: const a = 0; }', Context.OptionsLexical],
    ['switch(0) { case 0: const a = 0; default: var a; }', Context.OptionsLexical],
    ['switch(0) { case 0: var a; default: const a = 0; }', Context.OptionsLexical],
    ['switch(0) { default: const a = 0; case 0: var a; }', Context.OptionsLexical],
    ['switch(0) { default: var a; case 0: const a = 0; }', Context.OptionsLexical]
  ]);

  for (const arg of [
    'switch (0) { case 1: var f; default: var f }',
    'switch (x) { case a: var foo; break; default: var foo; break; }',
    'switch (0) { case 1: var f; default: var f }',
    'switch (0) { case 1: var f; default: var f; }',
    'switch (x) { case a: var foo; break; default: var foo; break; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    'switch (0) { case 1: var f; default: var f }',
    'switch (x) { case a: var foo; break; default: var foo; break; }',
    'switch (x) {case a: function f(){}; break; case b: function f(){}; break; }',
    'switch (0) { case 1: function f() {} default: var f }',
    'switch (0) { case 1: function f() {} default: async function f() {} }',
    'switch (0) { case 1: async function f() {} default: function f() {} }',
    'switch (0) { default: let f; if (false) ; else function f() {  } }',
    'switch (0) { case 1: var f; default: var f; }',
    'for (let f of [0]) { switch (1) { case 1:function f() {  } }}'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }
});
