import { describe } from 'vitest';
import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - While', () => {
  fail('Statements - While (fail)', [
    ['while 1 break;', Context.None],
    ['while "hood" break;', Context.None],
    ['while (false) function f() {}', Context.None],
    ['while (false) let x = 1;', Context.None],
    ['while 1 break;', Context.None],
    [`while '' break;`, Context.None],
    [`while '' break;`, Context.OptionsWebCompat],
    ['while(0) !function(){ break; };', Context.None],
    ['while(0) { function f(){ break; } }', Context.None],
    ['while (false) label1: label2: function f() {}', Context.None],
    ['while (false) async function f() {}', Context.None],
    ['while (false) const x = null;', Context.None],
    ['while (false) function* g() {}', Context.None],
    ['while true break;', Context.None],
    ['while({1}){ break ; };', Context.None],
    ['while({1}){ break ; };', Context.OptionsWebCompat],
  ]);

  pass('Statements - While (pass)', [
    'while (1) /foo/',
    `var i = 0;
      woohoo:{
        while(true){
          i++;
          if ( i == 10 ) {
            break woohoo;
          }
        }
      }`,
    `while (false) let // ASI
      x = 1;`,
    `while (false) let // ASI
  {}`,
    'while (x < 10) { x++; y--; }',
    'while (i-->1) {}',
    'a: while (true) continue a;',
    'while (this) try {} catch (h) {}',
    'while (foo) bar;',
  ]);
});
