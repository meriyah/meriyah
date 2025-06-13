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
    [
      `switch (X) {
        case k:
          foo: bar: function f(){}
      }`,
      Context.OptionsWebCompat,
    ],
    [
      `for (let i = 0; i < 1; ++i) {
        switch (a) {
          case 2:
              foo:a = 3;
              break;
        }
    }`,
      Context.OptionsRanges,
    ],
    ['switch(foo) {}', Context.OptionsRanges],
    ['switch (A) {default: D; case B: C; }', Context.OptionsRanges],
    ['switch(a){case 1:default:}', Context.None],
    ['switch(a){default:case 2:}', Context.None],
    ['switch (answer) { case 0: hi(); break; default: break }', Context.OptionsRanges],
    ['switch(a){case 1:}', Context.OptionsRanges],
    ['switch (a) { case b: let [x] = y }', Context.OptionsRanges | Context.OptionsRaw],
    ['switch (answer) { case 0: let a; }', Context.OptionsRanges | Context.OptionsRaw],
    ['switch (A) {default: B;}', Context.None],
    ['switch (0) { case 1: var f; default: var f }', Context.OptionsRanges | Context.OptionsRaw],
    ['switch (A) {default: B; break;}', Context.None],
    ['switch (A) {case B: C; break; case D: E; break;}', Context.None],
    ['switch (A) {default: D; case B: C; }', Context.None],
    ['switch (A) {case B: C; default: D;}', Context.None],
    ['switch (A) {default: B;}', Context.None],
  ]);
});
