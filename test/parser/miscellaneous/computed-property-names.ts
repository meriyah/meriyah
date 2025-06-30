import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Computed property names', () => {
  describe('Failure', () => {
    for (const arg of ['({[1,2]:3})', '({ *a })', '({ *a: 0 })', '({ *[0]: 0 })']) {
      it(`${arg}`, () => {
        t.throws(() => {
          parseSource(`${arg}`);
        });
      });
    }
  });

  describe('Pass', () => {
    for (const arg of [
      '({"oink"(that, ugly, icefapper) {}})',
      '({"moo"() {}})',
      '({3() {}})',
      '({[6+3]() {}})',
      '({get [6+3]() {}, set [5/4](x) {}})',
      '({[2*308]:0})',
      '({["nUmBeR"+9]:"nein"})',
      '({get __proto__() {}, set __proto__(x) {}})',
      '({set __proto__(x) {}})',
      '({get __proto__() {}})',
      '({__proto__:0})',
      '({set c(x) {}})',
      '({get b() {}})',
      '({2e308:0})',
      '({0x0:0})',
    ]) {
      it(`${arg}`, () => {
        t.doesNotThrow(() => {
          parseSource(`${arg}`);
        });
      });
    }
  });
});
