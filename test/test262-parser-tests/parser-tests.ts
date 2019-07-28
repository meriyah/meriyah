import { parseScript, parseModule } from '../../src/meriyah';
import { readdirSync, readFileSync } from 'fs';
import * as t from 'assert';

const Test262Dir = 'node_modules/test262-parser-tests';

const expectations = {
  pass: [
    '110fa1efdd0868b8.js',
    '1a1c717109ab67e1.js',
    '206ebb4e67a6daa9.js',
    '4ad6e3a59e27e9b1.js',
    'a62c6323a3696fa8.js',
    'fc020c065098cbd5.js',
    '77a541b0502d0bde.js',
    '3b36d546985cd9cb.js',
    'ac09566949f0db57.js',
    '116cacc3c80a5a3e.js',
    '10f0ef998c05c611.js',
    'bf1db420b006027f.js'
  ],
  explicit: [
    '3b36d546985cd9cb.js',
    '110fa1efdd0868b8.js',
    '1a1c717109ab67e1.js',
    '206ebb4e67a6daa9.js',
    'fc020c065098cbd5.js',
    '4ad6e3a59e27e9b1.js'
  ],
  fail: [
    'e4a43066905a597b.js',
    'f872cf801765a723.js',
    'bf49ec8d96884562.js',
    '8af69d8f15295ed2.js',
    '84633c379e4010bf.js',
    '7fc173197c3cc75d.js',
    '78c215fabdf13bae.js',
    'f4467d719dcee086.js',
    '66e383bfd18e66ab.js',
    '647e21f8f157c338.js',
    '324ab48c6d89125d.js',
    '2687d6d9043bd5cb.js',
    '7b876ca5139f1ca8.js',
    '3bc2b27a7430f818.js',
    'e3fbcf63d7e43ead.js',
    '15a6123f6b825c38.js',
    '147fa078a7436e0e.js',
    'fd2a45941e114896.js'
  ],
  early: [
    'eeb5ffaafa815bb2.js',
    'ec31fa5e521c5df4.js',
    'e262ea7682c36f92.js',
    'cc0122b6d261427b.js',
    'be7329119eaa3d47.js',
    '9d893d3b185cdca0.js',
    'f3943346692438ba.js',
    'e25b19185b3988dc.js',
    'b4994b656f8c8e75.js',
    '8f2d88f14f125b42.js',
    '587f8eba459c585c.js',
    '811e434afe688eb4.js',
    '4de83a7417cd30dd.js',
    '3644a964c2a8522c.js',
    '1aff49273f3e3a98.js',
    '12a74c60f52a60de.js',
    '0f5f47108da5c34e.js',
    '06593c3474233eca.js',
    // Need a fix
    'de9d9a6cd61407f5.js'
  ]
};

const parse = (src: string, module: boolean) =>
  (module ? parseModule : parseScript)(src, { webcompat: true, lexical: true });

const isModule = (val: string) => /\.module\.js/.test(val);

describe('Test262 Parser tests', () => {
  describe('Pass', () => {
    for (const f of readdirSync(`${Test262Dir}/pass`)) {
      if (expectations.pass.indexOf(f) !== -1) continue;
      it(`Should pass -  [${f}]`, () => {
        t.doesNotThrow(() => {
          parse(readFileSync(`${Test262Dir}/pass/${f}`, 'utf8'), isModule(f));
        });
      });
    }
  });

  describe('Pass explicit', () => {
    for (const f of readdirSync(`${Test262Dir}/pass-explicit`)) {
      if (expectations.explicit.indexOf(f) !== -1) continue;
      it(`Should pass -  [${f}]`, () => {
        t.doesNotThrow(() => {
          parse(readFileSync(`${Test262Dir}/pass-explicit/${f}`, 'utf8'), isModule(f));
        });
      });
    }
  });

  describe('Fail', () => {
    for (const f of readdirSync(`${Test262Dir}/fail`)) {
      if (expectations.fail.indexOf(f) !== -1) continue;
      it(`Should fail on - [${f}]`, () => {
        t.throws(() => {
          parse(readFileSync(`${Test262Dir}/fail/${f}`, 'utf8'), isModule(f));
        });
      });
    }
  });

  describe('Early errors', () => {
    for (const f of readdirSync(`${Test262Dir}/early`)) {
      if (expectations.early.indexOf(f) !== -1) continue;
      it(`should fail on early error [${f}]`, () => {
        t.throws(() => {
          parse(readFileSync(`${Test262Dir}/early/${f}`, 'utf8'), isModule(f));
        });
      });
    }
  });
});
