import { describe } from 'vitest';
import { pass, fail } from '../../test-utils';

describe('Statements - Do while', () => {
  fail('Statements - Do while (fail)', [
    'do foo while (bar);',
    'do async \n f(){}; while (y)',
    'do async \n () => x; while(y)',
    'do async () \n => x; while(y)',
    'do let x = 1; while (false)',
    'do x, y while (z)',
    'do foo while (bar);',
    'do ()=>x while(c)',
    `do
    a
    b
  while(c);`,
    'do let {} = y',
    'do debugger while(x) x',
    'do x: function s(){}while(y)',
    `do throw function (v, h) {
      "use strict"
    } while ((""))`,
  ]);

  pass('Statements - Do while (pass)', [
    `do;while(0) 0;`,
    {
      code: `do x
    while ({ [y]: {} ? null : false  })`,
      options: { ranges: true },
    },
    'do async \n while (y)',
    'do async \n () \n while (y)',
    'do while (x) continue \n while (x);',
    {
      code: `do if(x=>{});else n
      while(y)`,
      options: { ranges: true },
    },
    {
      code: `do
      if(x=>{});
    while(y)`,
      options: { ranges: true },
    },
    {
      code: `do
      for((function(){});;)x
    while(x);`,
      options: { ranges: true },
    },
    {
      code: `do
        (function(){})
      while(y)`,
      options: { ranges: true },
    },
    { code: 'do h(function(){});while(x)', options: { webcompat: true } },
    { code: 'do if(8)function s(){}while(y)', options: { webcompat: true } },
    {
      code: `
do if(8)function s(){}
while(y)
`,
      options: { webcompat: true },
    },

    {
      code: `do
      ()=>x
    while(c)`,
      options: { webcompat: true, ranges: true },
    },
    { code: 'do foo; while (bar);', options: { webcompat: true, ranges: true } },
    { code: 'do {} while (false) false', options: { webcompat: true } },
    { code: 'do { } while (a); /^.*$/.test(b)', options: { webcompat: true } },
  ]);
});
