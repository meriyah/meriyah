import { describe } from 'vitest';
import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Do while', () => {
  fail('Statements - Do while (fail)', [
    ['do foo while (bar);', Context.None],
    ['do async \n f(){}; while (y)', Context.None],
    ['do async \n () => x; while(y)', Context.None],
    ['do async () \n => x; while(y)', Context.None],
    ['do let x = 1; while (false)', Context.None],
    ['do x, y while (z)', Context.None],
    ['do foo while (bar);', Context.None],
    ['do ()=>x while(c)', Context.None],
    [
      `do
    a
    b
  while(c);`,
      Context.None,
    ],
    ['do let {} = y', Context.None],
    ['do debugger while(x) x', Context.None],
    ['do x: function s(){}while(y)', Context.None],
    [
      `do throw function (v, h) {
      "use strict"
    } while ((""))`,
      Context.None,
    ],
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
