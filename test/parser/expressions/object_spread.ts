import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
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
    'var { x } = {x: ...[1,2,3]}',
  ]) {
    it(`x = ${arg}`, () => {
      t.throws(() => {
        parseSource(`x = ${arg};`);
      });
    });

    it(`function fn() { 'use strict';${arg}} fn();`, () => {
      t.throws(() => {
        parseSource(`function fn() { 'use strict';${arg}} fn();`);
      });
    });

    it(`function fn() { ${arg}} fn();`, () => {
      t.throws(() => {
        parseSource(`function fn() { ${arg}} fn();`);
      });
    });

    it(`"use strict"; x = ${arg}`, () => {
      t.throws(() => {
        parseSource(`x = ${arg};`);
      });
    });
  }

  // Spread Array

  for (const arg of ['[...]', '[a, ...]', '[..., ]', '[..., ...]', '[ (...a)]']) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg};`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg};`, { webcompat: true, lexical: true });
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg};`);
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
    '{ ...new Foo()}',
  ]) {
    it(`x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg};`);
      });
    });
    it(`x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg};`, { lexical: true });
      });
    });
    it(`x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg};`, { next: true, sourceType: 'module' });
      });
    });

    it(`"use strict"; x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg};`);
      });
    });
  }
});
