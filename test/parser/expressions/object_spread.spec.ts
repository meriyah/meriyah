import { Context } from '../../../src/common';
import { describe, it, expect } from 'bun:test';
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
      expect(() => {
        parseSource(`x = ${arg};`, undefined, Context.None);
      }).toThrow();
    });

    it(`function fn() { 'use strict';${arg}} fn();`, () => {
      expect(() => {
        parseSource(`function fn() { 'use strict';${arg}} fn();`, undefined, Context.None);
      }).toThrow();
    });

    it(`function fn() { ${arg}} fn();`, () => {
      expect(() => {
        parseSource(`function fn() { ${arg}} fn();`, undefined, Context.None);
      }).toThrow();
    });

    it(`"use strict"; x = ${arg}`, () => {
      expect(() => {
        parseSource(`x = ${arg};`, undefined, Context.None);
      }).toThrow();
    });
  }

  // Spread Array

  for (const arg of ['[...]', '[a, ...]', '[..., ]', '[..., ...]', '[ (...a)]']) {
    it(`${arg}`, () => {
      expect(() => {
        parseSource(`${arg};`, undefined, Context.OptionsWebCompat);
      }).toThrow();
    });

    it(`${arg}`, () => {
      expect(() => {
        parseSource(`${arg};`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      }).toThrow();
    });

    it(`"use strict"; ${arg}`, () => {
      expect(() => {
        parseSource(`"use strict"; ${arg};`, undefined, Context.None);
      }).toThrow();
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
      expect(() => {
        parseSource(`x = ${arg};`, undefined, Context.None);
      }).not.toThrow();
    });
    it(`x = ${arg}`, () => {
      expect(() => {
        parseSource(`x = ${arg};`, undefined, Context.OptionsLexical);
      }).not.toThrow();
    });
    it(`x = ${arg}`, () => {
      expect(() => {
        parseSource(`x = ${arg};`, undefined, Context.OptionsNext | Context.Module);
      }).not.toThrow();
    });

    it(`"use strict"; x = ${arg}`, () => {
      expect(() => {
        parseSource(`x = ${arg};`, undefined, Context.None);
      }).not.toThrow();
    });
  }
});
