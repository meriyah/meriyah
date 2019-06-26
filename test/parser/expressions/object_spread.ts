import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';
describe('Expressions - Rest', () => {
  for (const arg of [
    '{ ...var z = y}',
    '{ ...var}',
    //  '{ ...foo bar}',
    '{* ...foo}',
    '{get ...foo}',
    '{set ...foo}',
    '{async ...foo}',
    'return ...[1,2,3];',
    'var ...x = [1,2,3];',
    'var [...x,] = [1,2,3];',
    'var [...x, y] = [1,2,3];',
    'var { x } = {x: ...[1,2,3]}'
  ]) {
    it(`x = ${arg}`, () => {
      t.throws(() => {
        parseSource(`x = ${arg};`, undefined, Context.None);
      });
    });

    it(`function fn() { 'use strict';${arg}} fn();`, () => {
      t.throws(() => {
        parseSource(`function fn() { 'use strict';${arg}} fn();`, undefined, Context.None);
      });
    });

    it(`function fn() { ${arg}} fn();`, () => {
      t.throws(() => {
        parseSource(`function fn() { ${arg}} fn();`, undefined, Context.None);
      });
    });

    it(`"use strict"; x = ${arg}`, () => {
      t.throws(() => {
        parseSource(`x = ${arg};`, undefined, Context.None);
      });
    });
  }

  // Spread Array

  for (const arg of ['[...]', '[a, ...]', '[..., ]', '[..., ...]', '[ (...a)]']) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg};`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg};`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg};`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    '[...a]',
    '[a, ...b]',
    '[...a,]',
    '[...a, ,]',
    '[, ...a]',
    '[...a, ...b]',
    '[...a, , ...b]',
    '[...[...a]]',
    '[, ...a]',
    '[, , ...a]',
    '{ ...y }',
    '{ a: 1, ...y }',
    '{ b: 1, ...y }',
    '{ y, ...y}',
    '{ ...z = y}',
    '{ ...y, y }',
    '{ ...y, ...y}',
    '{ a: 1, ...y, b: 1}',
    '{ ...y, b: 1}',
    '{ ...1}',
    '{ ...null}',
    '{ ...undefined}',
    '{ ...1 in {}}',
    '{ ...[]}',
    '{ ...async function() { }}',
    '{ ...async () => { }}',
    '{ ...new Foo()}'
  ]) {
    it(`x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg};`, undefined, Context.None);
      });
    });
    it(`x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg};`, undefined, Context.OptionsLexical);
      });
    });
    it(`x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg};`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`"use strict"; x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg};`, undefined, Context.None);
      });
    });
  }
});
