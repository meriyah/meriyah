#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import { rollup } from 'rollup';
import typescript2 from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import * as ts from 'typescript';

// eslint-disable-next-line n/no-unsupported-features/node-builtins
const { dirname } = import.meta;
const ENTRY = path.join(dirname, '../src/meriyah.ts');
const TSCONFIG = path.join(dirname, '../tsconfig.json');
const DIST = path.join(dirname, '../dist/');

function createRollupOutputOptions(format, minified) {
  let suffix = format === 'umd' ? '.umd' : '';
  suffix += minified ? '.min' : '';
  suffix += format === 'esm' ? '.mjs' : format === 'cjs' ? '.cjs' : '.js';

  return {
    name: 'meriyah',
    format,
    file: path.join(DIST, `meriyah${suffix}`),
    plugins: minified ? [terser()] : []
  };
}

function* getRollupOutputOptions() {
  for (const format of ['esm', 'umd', 'cjs']) {
    yield createRollupOutputOptions(format, false);

    // CommonJS version don't need minify
    if (format === 'cjs') {
      continue;
    }

    // Minified
    yield createRollupOutputOptions(format, true);
  }
}

// Clean up `dist/`
await fs.rm(DIST, { force: true, recursive: true });

const bundle = await rollup({
  input: ENTRY,
  plugins: [
    typescript2({
      tsconfig: TSCONFIG,
      typescript: ts,
      clean: true
    }),
    json()
  ]
});

for (const options of getRollupOutputOptions()) {
  console.log(`writing ${path.relative(process.cwd(), options.file)}`);
  await bundle.write(options);
}
