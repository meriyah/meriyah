import { describe } from 'vitest';
import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements  Switch', () => {
  fail('Statements  Switch (fail)', [
    ['switch(x) { default: default: }', Context.None],
    ['switch(x) { default: break; default: break; }', Context.None],
    ['switch(x) { case y: break; case z: break; default: default: }', Context.None],
    ['switch(x) { default: default: case y: break; case z: break; }', Context.None],
    ['switch(0) { case 0: !function(){ break; }; }', Context.None],
    ['switch (a) { case b: let [x] }', Context.None],
    ['switch(0) { case 0: function f(){ break; } }', Context.None],
    ['switch(0) { default: !function(){ break; }; }', Context.None],
    ['switch(0) { default: function f(){ break; } }', Context.None],
    ['switch(x) { default: break; case y: break; case z: break; default: break; }', Context.None],
  ]);

  pass('Statements  Switch (pass)', [
    {
      code: `switch (X) {
        case k:
          foo: bar: function f(){}
      }`,
      options: { webcompat: true },
    },
    {
      code: `for (let i = 0; i < 1; ++i) {
        switch (a) {
          case 2:
              foo:a = 3;
              break;
        }
    }`,
      options: { ranges: true },
    },
    { code: 'switch(foo) {}', options: { ranges: true } },
    { code: 'switch (A) {default: D; case B: C; }', options: { ranges: true } },
    'switch(a){case 1:default:}',
    'switch(a){default:case 2:}',
    { code: 'switch (answer) { case 0: hi(); break; default: break }', options: { ranges: true } },
    { code: 'switch(a){case 1:}', options: { ranges: true } },
    { code: 'switch (a) { case b: let [x] = y }', options: { ranges: true, raw: true } },
    { code: 'switch (answer) { case 0: let a; }', options: { ranges: true, raw: true } },
    'switch (A) {default: B;}',
    { code: 'switch (0) { case 1: var f; default: var f }', options: { ranges: true, raw: true } },
    'switch (A) {default: B; break;}',
    'switch (A) {case B: C; break; case D: E; break;}',
    'switch (A) {default: D; case B: C; }',
    'switch (A) {case B: C; default: D;}',
    'switch (A) {default: B;}',
  ]);
});
