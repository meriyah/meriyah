import { outdent } from 'outdent';
import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Statements - Continue', () => {
  fail('Declarations - Continue', [
    'continue;',
    '{ continue }',
    'if (x) continue;',
    'continue y',
    'if (x) continue y',
    'function f(){    continue    }',
    'function f(){   { continue }   }',
    'function f(){    if (x) continue   }',
    'function f(){    continue y   }',
    'function f(){    if (x) continue y   }',
    '() =>     continue',
    '() => {    continue    }',
    '() => {   { continue }   }',
    '() => {    continue y   }',
    '() => {    if (x) continue y   }',
    'continue',
    'while (true) continue x;',
    'function f(){ do        if (x) continue y   ; while(true);}',
    'do     continue y   ; while(true);',
    'do     if (x) continue y   ; while(true);',
    'function f(){ while (true)       if (x) continue y   }',
    'function f(){ for (;;)       if (x) continue y   }',
    'for (;;)    continue y ',
    'function f(){    if (x) continue   }',
    'function f(){    continue y   }',
    'function f(){    if (x) continue y   }',
    'switch (x) { case x: continue foo; }',
    'switch (x) { default: continue foo; }',
    'switch (x) { case x: if (foo) {continue foo;} }',
    'function f(){ for (;;)       if (x) continue y   }}',
    'while (true)    if (x) continue y   }',
    'function f(){ while (true)       if (x) continue y   }}',
    'do     if (x) continue y   ; while(true);',
    'function f(){ do        if (x) continue y   ; while(true);}',
    'continue foo',
    'continue; continue;',
    'continue\ncontinue;',
    'continue foo;continue;',
    'continue foo\ncontinue;',
    'do {  test262: {  continue test262; } } while (a)',
    'ce: while(true) { continue fapper; }',
    'oop1: while (true) { loop2: function a() { continue loop2; } }',
    'loop1: while (true) { loop2: function a() { continue loop1; } }',
    'loop1: while (true) { loop1: function a() { continue loop1; } }',
    'oop1: while (true) { loop2: function a() { continue loop2; } }',
    'oop1: while (true) { loop2: function a() { continue loop2; } }',
    'oop1: while (true) { loop2: function a() { continue loop2; } }',
    outdent`
      LABEL1 : do {
      x++;
      (function(){continue LABEL1;})();
      y++;
      } while(0);
    `,
    outdent`
      try{
      LABEL1 : do {
        x++;
        throw "gonna leave it";
        y++;
      } while(0);
      $ERROR('#1: throw "gonna leave it" lead to throwing exception');
      } catch(e){
      continue LABEL2;
      LABEL2 : do {
        x++;
        y++;
      } while(0);
      };
    `,
    outdent`
      try{
      LABEL1 : do {
        x++;
        throw "gonna leave it";
        y++;
      } while(0);
      $ERROR('#1: throw "gonna leave it" lead to throwing exception');
      } catch(e){
      continue;
      LABEL2 : do {
        x++;
        y++;
      } while(0);
      };
    `,
    'switch (x){ case z:    continue   }',
    'switch (x){ case z:    { continue }  }',
    'switch (x){ case z:    if (x) continue   }',
    'switch (x){ case z:    continue y   }',
    'switch (x){ case z:    if (x) continue y   }',
  ]);

  pass('Statements - Continue', [
    'while (x) continue',
    'do continue; while(foo);',
    'foo: do continue foo; while(foo);',
    '__proto__: while (true) { continue __proto__; }',
    'a: do continue a; while(1);',
    'a: while (0) { continue \r b; }',
    'a: while (0) { continue /*\n*/ b; }',
    'a: while (0) { continue /*\u2029*/ b; }',
    '() => { do        if (x) continue   ; while(true);}',
    'for (;;)  {  continue   }',
    'for (;;)  { if (x) continue   }',
    'function f(){ for (;;)  {     continue    }}',
    'while (true) {  continue   }',
    'foo: while(true)continue foo;',
    'foo: while (true) { if (x) continue foo; }',
  ]);
});
