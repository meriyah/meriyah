#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { rollup } from 'rollup';
import typescript2 from 'rollup-plugin-typescript2';
import * as ts from 'typescript';

const { dirname } = import.meta;
const ENTRY = path.join(dirname, '../src/meriyah.ts');
const TSCONFIG = path.join(dirname, '../tsconfig.bundle.json');
const DIST = path.join(dirname, '../dist/');

function getRollupOutputOptions(format, minified) {
  const filename = [
    'meriyah',
    format === 'umd' ? '.umd' : '',
    minified ? '.min' : '',
    format === 'esm' ? '.mjs' : format === 'cjs' ? '.cjs' : '.js',
  ].join('');

  return {
    name: 'meriyah',
    format,
    file: path.join(DIST, filename),
    plugins: minified ? [terser()] : [],
  };
}

function* getEntries() {
  for (const format of [
    // ESM
    'esm',
    // UMD supports AMD, CommonJS, and IIFE
    'umd',
    // CommonJS
    'cjs',
  ]) {
    yield getRollupOutputOptions(format, false);

    // CommonJS version don't need minify
    if (format === 'cjs') {
      continue;
    }

    // Minified
    yield getRollupOutputOptions(format, true);
  }
}

// Clean up `dist/`
await fs.rm(DIST, { force: true, recursive: true });

const bundle = await rollup({
  input: ENTRY,
  plugins: [
    typescript2({
      typescript: ts,
      clean: true,
      useTsconfigDeclarationDir: true,
      tsconfig: TSCONFIG,
    }),
    json(),
  ],
});

for (const options of getEntries()) {
  console.log(`writing ${path.relative(process.cwd(), options.file).replaceAll('\\', '/')}`);
  await bundle.write(options);
}
