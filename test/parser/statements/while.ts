import { outdent } from 'outdent';
import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Statements - While', () => {
  fail('Statements - While (fail)', [
    'while 1 break;',
    'while "hood" break;',
    'while (false) function f() {}',
    'while (false) let x = 1;',
    'while 1 break;',
    "while '' break;",
    { code: "while '' break;", options: { webcompat: true } },
    'while(0) !function(){ break; };',
    'while(0) { function f(){ break; } }',
    'while (false) label1: label2: function f() {}',
    'while (false) async function f() {}',
    'while (false) const x = null;',
    'while (false) function* g() {}',
    'while true break;',
    'while({1}){ break ; };',
    { code: 'while({1}){ break ; };', options: { webcompat: true } },
  ]);

  pass('Statements - While (pass)', [
    'while (1) /foo/',
    outdent`
      var i = 0;
      woohoo:{
        while(true){
          i++;
          if ( i == 10 ) {
            break woohoo;
          }
        }
      }
    `,
    outdent`
      while (false) let // ASI
      x = 1;
    `,
    outdent`
      while (false) let // ASI
      {}
    `,
    'while (x < 10) { x++; y--; }',
    'while (i-->1) {}',
    'a: while (true) continue a;',
    'while (this) try {} catch (h) {}',
    'while (foo) bar;',
  ]);
});
