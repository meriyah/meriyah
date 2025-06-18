import { describe } from 'vitest';
import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Break', () => {
  fail('Declarations - Break', [
    ['break;', Context.None],
    //    ['break foo;', Context.None],
    ['switch (x){ case z:    break y   }', Context.None],
    ['switch (x){ case z:    if (x) break y   }', Context.None],
    ['function f(){ switch (x){ case z:       break y   }}', Context.None],
    ['function f(){ switch (x){ case z:       if (x) break y   }}', Context.None],
    ['for (;;)    if (x) break y   }', Context.None],
    ['function f(){ while (true)       break y   }', Context.None],
    ['do     break y   ; while(true);', Context.None],
    ['do     if (x) break y   ; while(true);', Context.None],
    ['function f(){ do        if (x) break y   ; while(true);}', Context.None],
    ['x: foo; break x;', Context.None],
    ['loop1: function a() {}  while (true) { continue loop1; }', Context.None],
    ['{  break foo; var y=2; }', Context.None],
    ['loop1: while (true) { loop2: function a() { break loop2; } }', Context.None],
    [
      `(function(){
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
  })();`,
      Context.None,
    ],
    [
      `LABEL1 : do {
      x++;
      (function(){break LABEL1;})();
      y++;
  } while(0);`,
      Context.None,
    ],
    [
      `(function(){
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
  })();`,
      Context.None,
    ],
    [
      `(function(){
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
  })();`,
      Context.None,
    ],
    [
      `(function(){
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
  })();`,
      Context.None,
    ],
    [
      `var x=0,y=0;
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
  }`,
      Context.None,
    ],
    ['loop1: while (true) { loop2: function a() { break loop1; } }', Context.None],
    ['loop; while (true) { break loop1; }', Context.None],
    ['function f(){ for (;;)       break y   }', Context.None],
    ['break', Context.None],
    ['{ break }', Context.None],
    ['if (x) break', Context.None],
    ['function f(){    break    }', Context.None],
    ['function f(){    if (x) break   }', Context.None],
    ['function f(){    break y   }', Context.None],
    ['break; break;', Context.None],
    ['break\nbreak;', Context.None],
    ['{ break }', Context.None],
    ['if (x) break', Context.None],
    ['function f(){    break    }', Context.None],
    //    ['function f(){    break y   }', Context.None],
    ['() => {    break    }', Context.None],
    ['() => {    if (x) break   }', Context.None],
    //  ['() => {    if (x) break y   }', Context.None],
  ]);

  pass('Statements - Break (pass)', [
    `a: if (true) b: { break a; break b; }
      else b: { break a; break b; }`,
    'foo: while (true) if (x) break foo;',
    'foo: while(true)break foo;',
    'function f(){ while (true)       if (x) break   }',
    'while (true)    { break }   ',
    'function f(){ for (;;)       if (x) break   }',
    'L: let\nx',
    `switch (a) { case 10 /* StringLiteral */:
        if (lookAhead(function () { return nextToken() !== 57 /* ColonToken */; })) {
            statement.expression = parseLiteralNode();
            break;
        }
}`,
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
