import { parseScript, parseModule } from '../../src/meriyah';
import { readdirSync, readFileSync } from 'fs';
import * as t from 'assert';

const Test262Dir = 'node_modules/test262-parser-tests';

const expectations = {
  pass: [
    'ba00173ff473e7da.js',
    '946bee37652a31fa.js',
    '8b8edcb36909900b.js',
    '6a220df693ce521c.js',
    '5d5b9de6d9b95f3e.js',
    '5a2a8e992fa4fe37.js',
    '4f5419fe648c691b.js',
    '44f31660bd715f05.js',
    '08a39e4289b0c3f3.js',
    '046a0bb70d03d0cc.js',
    '0e3ca454ddfb4729.js',
    '300a638d978d0f2c.js',
    '110fa1efdd0868b8.js',
    '1a1c717109ab67e1.js',
    '206ebb4e67a6daa9.js',
    '4ad6e3a59e27e9b1.js',
    'a62c6323a3696fa8.js',
    'fc020c065098cbd5.js'
  ],
  explicit: [
    '44f31660bd715f05.js',
    '300a638d978d0f2c.js',
    '0e3ca454ddfb4729.js',
    '08a39e4289b0c3f3.js',
    '046a0bb70d03d0cc.js',
    '110fa1efdd0868b8.js',
    '1a1c717109ab67e1.js',
    '206ebb4e67a6daa9.js',
    'fc020c065098cbd5.js',
    '4ad6e3a59e27e9b1.js'
  ],
  fail: [
    'b9422ea5edcddf0b.js',
    'e4a43066905a597b.js',
    'f872cf801765a723.js',
    'bf49ec8d96884562.js',
    'b7b057684207633b.js',
    '9f5a6dae7645976a.js',
    '8af69d8f15295ed2.js',
    '84633c379e4010bf.js',
    '7fc173197c3cc75d.js',
    '78c215fabdf13bae.js',
    '66e383bfd18e66ab.js',
    '647e21f8f157c338.js',
    '3dbb6e166b14a6c0.js',
    '324ab48c6d89125d.js',
    '2687d6d9043bd5cb.js',
    '1395e3a9d2acf65c.js',
    'fd2a45941e114896.js',
    '7b876ca5139f1ca8.js',
    '3bc2b27a7430f818.js',
    'e3fbcf63d7e43ead.js',
    '15a6123f6b825c38.js',
    '1acada3c651821cf.js',
    '147fa078a7436e0e.js'
  ],
  early: []
};

const parse = (src: string, module: boolean) => (module ? parseModule : parseScript)(src, { webCompat: true });

const isModule = (val: string) => /\.module\.js/.test(val);

describe('Test262 Parser tests', () => {
  describe('Pass', () => {
    for (const f of readdirSync(`${Test262Dir}/pass`)) {
      if (expectations.pass.indexOf(f) !== -1) continue;
      it(`Should pass -  [${f}]`, () => {
        const passSrc = readFileSync(`${Test262Dir}/pass/${f}`, 'utf8');
        t.doesNotThrow(() => {
          parse(passSrc, isModule(f));
        });
      });
    }
  });

  describe('Pass explicit', () => {
    for (const f of readdirSync(`${Test262Dir}/pass-explicit`)) {
      if (expectations.explicit.indexOf(f) !== -1) continue;
      it(`Should pass -  [${f}]`, () => {
        const passSrc = readFileSync(`${Test262Dir}/pass-explicit/${f}`, 'utf8');
        t.doesNotThrow(() => {
          parse(passSrc, isModule(f));
        });
      });
    }
  });

  describe('Fail', () => {
    for (const f of readdirSync(`${Test262Dir}/fail`)) {
      if (expectations.fail.indexOf(f) !== -1) continue;
      it(`Should fail on - [${f}]`, () => {
        const passSrc = readFileSync(`${Test262Dir}/fail/${f}`, 'utf8');
        t.throws(() => {
          parse(passSrc, isModule(f));
        });
      });
    }
  });
});
