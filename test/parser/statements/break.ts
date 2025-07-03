import { outdent } from 'outdent';
import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Statements - Break', () => {
  fail('Declarations - Break', [
    'break;',
    //    ['break foo;', Context.None],
    'switch (x){ case z:    break y   }',
    'switch (x){ case z:    if (x) break y   }',
    'function f(){ switch (x){ case z:       break y   }}',
    'function f(){ switch (x){ case z:       if (x) break y   }}',
    'for (;;)    if (x) break y   }',
    'function f(){ while (true)       break y   }',
    'do     break y   ; while(true);',
    'do     if (x) break y   ; while(true);',
    'function f(){ do        if (x) break y   ; while(true);}',
    'x: foo; break x;',
    'loop1: function a() {}  while (true) { continue loop1; }',
    '{  break foo; var y=2; }',
    'loop1: while (true) { loop2: function a() { break loop2; } }',
    outdent`
      (function(){
          OuterLabel : var x=0, y=0;
          LABEL_DO_LOOP : do {
              LABEL_IN : x++;
              if(x===10)
                  return;
              break LABEL_ANOTHER_LOOP;
              LABEL_IN_2 : y++;
              function IN_DO_FUNC(){}
          } while(0);
          LABEL_ANOTHER_LOOP : do {
              ;
          } while(0);
          function OUT_FUNC(){}
      })();
    `,
    outdent`
      LABEL1 : do {
          x++;
          (function(){break LABEL1;})();
          y++;
      } while(0);
    `,
    outdent`
      (function(){
        OuterLabel : var x=0, y=0;
        LABEL_DO_LOOP : do {
            LABEL_IN : x++;
            if(x===10)
                return;
            break IN_DO_FUNC;
            LABEL_IN_2 : y++;
            function IN_DO_FUNC(){}
        } while(0);
        LABEL_ANOTHER_LOOP : do {
            ;
        } while(0);
        function OUT_FUNC(){}
      })();
    `,
    outdent`
      (function(){
        OuterLabel : var x=0, y=0;
        LABEL_DO_LOOP : do {
            LABEL_IN : x++;
            if(x===10)
                return;
            break LABEL_IN;
            LABEL_IN_2 : y++;
            function IN_DO_FUNC(){}
        } while(0);
        LABEL_ANOTHER_LOOP : do {
            ;
        } while(0);
        function OUT_FUNC(){}
      })();
    `,
    outdent`
      (function(){
        OuterLabel : var x=0, y=0;
        LABEL_DO_LOOP : do {
            LABEL_IN : x++;
            if(x===10)
                return;
            break LABEL_IN;
            LABEL_IN_2 : y++;
            function IN_DO_FUNC(){}
        } while(0);
        LABEL_ANOTHER_LOOP : do {
            ;
        } while(0);
        function OUT_FUNC(){}
      })();
    `,
    outdent`
      var x=0,y=0;
      try{
        LABEL1 : do {
          x++;
          throw "gonna leave it";
          y++;
        } while(0);
        $ERROR('#1: throw "gonna leave it" lead to throwing exception');
      } catch(e){
        break;
        LABEL2 : do {
          x++;
          y++;
        } while(0);
      }
    `,
    'loop1: while (true) { loop2: function a() { break loop1; } }',
    'loop; while (true) { break loop1; }',
    'function f(){ for (;;)       break y   }',
    'break',
    '{ break }',
    'if (x) break',
    'function f(){    break    }',
    'function f(){    if (x) break   }',
    'function f(){    break y   }',
    'break; break;',
    'break\nbreak;',
    '{ break }',
    'if (x) break',
    'function f(){    break    }',
    //    ['function f(){    break y   }', Context.None],
    '() => {    break    }',
    '() => {    if (x) break   }',
    //  ['() => {    if (x) break y   }', Context.None],
  ]);

  pass('Statements - Break (pass)', [
    outdent`
      a: if (true) b: { break a; break b; }
      else b: { break a; break b; }
    `,
    'foo: while (true) if (x) break foo;',
    'foo: while(true)break foo;',
    'function f(){ while (true)       if (x) break   }',
    'while (true)    { break }   ',
    'function f(){ for (;;)       if (x) break   }',
    'L: let\nx',
    outdent`
      switch (a) { case 10 /* StringLiteral */:
              if (lookAhead(function () { return nextToken() !== 57 /* ColonToken */; })) {
                  statement.expression = parseLiteralNode();
                  break;
              }
      }
    `,
    { code: 'switch (a) { case 123: { if (a) {} break } }', options: { ranges: true } },

    { code: 'ding: foo: bar: while (true) break foo;', options: { ranges: true, raw: true } },
    'switch (x) { default: break; }',
    'switch (x) { case x: if (foo) break; }',
    'switch (x) { case x: {break;} }',
    { code: 'foo: switch (x) { case x: break foo; }', options: { ranges: true, raw: true } },
    { code: 'this', options: { ranges: true } },
    'foo: switch (x) { case x: if (foo) {break foo;} }',
    { code: 'switch (x) { case x: break; }', options: { ranges: true } },
  ]);
});
