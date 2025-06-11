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
    [
      `do;while(0) 0;`,
      Context.None,
      
    ],
    [
      `do x
    while ({ [y]: {} ? null : false  })`,
      Context.OptionsRanges,
      
    ],
    [
      'do async \n while (y)',
      Context.None,
      
    ],
    [
      'do async \n () \n while (y)',
      Context.None,
      
    ],
    [
      'do while (x) continue \n while (x);',
      Context.None,
      
    ],
    [
      `do if(x=>{});else n
      while(y)`,
      Context.OptionsRanges,
      
    ],
    [
      `do
      if(x=>{});
    while(y)`,
      Context.OptionsRanges,
      
    ],
    [
      `do
      for((function(){});;)x
    while(x);`,
      Context.OptionsRanges,
      
    ],
    [
      `do
        (function(){})
      while(y)`,
      Context.OptionsRanges,
      
    ],
    [
      'do h(function(){});while(x)',
      Context.OptionsWebCompat,
      
    ],
    [
      'do if(8)function s(){}while(y)',
      Context.OptionsWebCompat,
      
    ],
    [
      `
do if(8)function s(){}
while(y)
`,
      Context.OptionsWebCompat,
      
    ],

    [
      `do
      ()=>x
    while(c)`,
      Context.OptionsWebCompat | Context.OptionsRanges,
      
    ],
    [
      'do foo; while (bar);',
      Context.OptionsWebCompat | Context.OptionsRanges,
      
    ],
    [
      'do {} while (false) false',
      Context.OptionsWebCompat,
      
    ],
    [
      'do { } while (a); /^.*$/.test(b)',
      Context.OptionsWebCompat,
      
    ],
  ]);
});
