import { outdent } from 'outdent';
import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Statements  Switch', () => {
  fail('Statements  Switch (fail)', [
    'switch(x) { default: default: }',
    'switch(x) { default: break; default: break; }',
    'switch(x) { case y: break; case z: break; default: default: }',
    'switch(x) { default: default: case y: break; case z: break; }',
    'switch(0) { case 0: !function(){ break; }; }',
    'switch (a) { case b: let [x] }',
    'switch(0) { case 0: function f(){ break; } }',
    'switch(0) { default: !function(){ break; }; }',
    'switch(0) { default: function f(){ break; } }',
    'switch(x) { default: break; case y: break; case z: break; default: break; }',
  ]);

  pass('Statements  Switch (pass)', [
    {
      code: outdent`
        switch (X) {
          case k:
            foo: bar: function f(){}
        }
      `,
      options: { webcompat: true },
    },
    {
      code: outdent`
        for (let i = 0; i < 1; ++i) {
            switch (a) {
              case 2:
                  foo:a = 3;
                  break;
            }
        }
      `,
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
