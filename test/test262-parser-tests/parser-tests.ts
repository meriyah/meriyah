import { parseScript, parseModule } from '../../src/meriyah';
import { readdirSync, readFileSync } from 'fs';
import * as t from 'assert';

const Test262Dir = 'node_modules/test262-parser-tests';

const skipped = {
  fail: [
    // https://github.com/tc39/test262-parser-tests/issues/26
    '8af69d8f15295ed2.js',
    '647e21f8f157c338.js',

    // Seems nothing wrong with the code
    'e3fbcf63d7e43ead.js',

    // https://github.com/tc39/test262-parser-tests/issues/25
    '0d5e450f1da8a92a.js',
    '748656edbfb2d0bb.js',
    '79f882da06f88c9f.js',
    '92b6af54adef3624.js',

    // class fields
    '98204d734f8c72b3.js',
    'ef81b93cf9bdb4ec.js',

    // FIXME: "use strict" should be preflighted
    '147fa078a7436e0e.js',
    '15a6123f6b825c38.js',
    '3bc2b27a7430f818.js',

    // FIXME
    '2687d6d9043bd5cb.js',
    '84633c379e4010bf.js',
    'f4467d719dcee086.js',
    '7b876ca5139f1ca8.js',
    'fd2a45941e114896.js'
  ],
  early: [
    // Seems nothing wrong with the code
    '06593c3474233eca.js',

    // FIXME: if possible
    'be7329119eaa3d47.js',
    '9d893d3b185cdca0.js',
    'de9d9a6cd61407f5.js',
    'cc0122b6d261427b.js',
    'e25b19185b3988dc.js',
    'e262ea7682c36f92.js',
    'ec31fa5e521c5df4.js',
    'eeb5ffaafa815bb2.js',
    'f3943346692438ba.js',
    '587f8eba459c585c.js',
    '811e434afe688eb4.js',
    '8f2d88f14f125b42.js',
    '3644a964c2a8522c.js',
    '1aff49273f3e3a98.js',
    '12a74c60f52a60de.js',
    '0f5f47108da5c34e.js',

    // FIXME
    'b4994b656f8c8e75.js'
  ]
};

const parse = (src: string, module: boolean) =>
  (module ? parseModule : parseScript)(src, { webcompat: true, lexical: true });

const isModule = (val: string) => /\.module\.js/.test(val);

describe('Test262 Parser tests', () => {
  describe('Pass', () => {
    for (const f of readdirSync(`${Test262Dir}/pass`)) {
      // if (skipped.pass.indexOf(f) !== -1) continue;
      it(`Should pass -  [${f}]`, () => {
        t.doesNotThrow(() => {
          parse(readFileSync(`${Test262Dir}/pass/${f}`, 'utf8'), isModule(f));
        });
      });
    }
  });

  describe('Pass explicit', () => {
    for (const f of readdirSync(`${Test262Dir}/pass-explicit`)) {
      // if (skipped.explicit.indexOf(f) !== -1) continue;
      it(`Should pass -  [${f}]`, () => {
        t.doesNotThrow(() => {
          parse(readFileSync(`${Test262Dir}/pass-explicit/${f}`, 'utf8'), isModule(f));
        });
      });
    }
  });

  describe('Fail', () => {
    for (const f of readdirSync(`${Test262Dir}/fail`)) {
      if (skipped.fail.indexOf(f) !== -1) continue;
      it(`Should fail on - [${f}]`, () => {
        t.throws(() => {
          parse(readFileSync(`${Test262Dir}/fail/${f}`, 'utf8'), isModule(f));
        });
      });
    }
  });

  describe('Early errors', () => {
    for (const f of readdirSync(`${Test262Dir}/early`)) {
      if (skipped.early.indexOf(f) !== -1) continue;
      it(`should fail on early error [${f}]`, () => {
        t.throws(() => {
          parse(readFileSync(`${Test262Dir}/early/${f}`, 'utf8'), isModule(f));
        });
      });
    }
  });
});
