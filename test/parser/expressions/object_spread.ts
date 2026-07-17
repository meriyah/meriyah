import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
describe('Expressions - Rest', () => {
  for (const text of [
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
    it(`x = ${text}`, () => {
      t.throws(() => {
        parseSource(`x = ${text};`);
      });
    });

    it(`function fn() { 'use strict';${text}} fn();`, () => {
      t.throws(() => {
        parseSource(`function fn() { 'use strict';${text}} fn();`);
      });
    });

    it(`function fn() { ${text}} fn();`, () => {
      t.throws(() => {
        parseSource(`function fn() { ${text}} fn();`);
      });
    });

    it(`"use strict"; x = ${text}`, () => {
      t.throws(() => {
        parseSource(`x = ${text};`);
      });
    });
  }

  // Spread Array

  for (const text of ['[...]', '[a, ...]', '[..., ]', '[..., ...]', '[ (...a)]']) {
    it(text, () => {
      t.throws(() => {
        parseSource(`${text};`, { webcompat: true });
      });
    });

    it(text, () => {
      t.throws(() => {
        parseSource(`${text};`, { webcompat: true, lexical: true });
      });
    });

    it(`"use strict"; ${text}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${text};`);
      });
    });
  }

  for (const text of [
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
    it(`x = ${text}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${text};`);
      });
    });
    it(`x = ${text}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${text};`, { lexical: true });
      });
    });
    it(`x = ${text}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${text};`, { next: true, sourceType: 'module' });
      });
    });

    it(`"use strict"; x = ${text}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${text};`);
      });
    });
  }
});
