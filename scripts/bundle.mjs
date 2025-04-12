#!/usr/bin/env node
import { join } from 'node:path';
import fs from 'node:fs/promises';
import { rollup } from 'rollup';
import typescript2 from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import * as ts from 'typescript';

// eslint-disable-next-line n/no-unsupported-features/node-builtins
const { dirname } = import.meta;
const ENTRY = join(dirname, '../src/meriyah.ts');
const TSCONFIG = join(dirname, '../tsconfig.json');
const DIST = join(dirname, '../dist/');

function getRollupOutputOptions(format, minified) {
  let suffix = format === 'umd' ? '.umd' : '';
  suffix += minified ? '.min' : '';
  suffix += format === 'esm' ? '.mjs' : format === 'cjs' ? '.cjs' : '.js';

  return {
    name: 'meriyah',
    format,
    file: join(DIST, `meriyah${suffix}`)
  };
}

await fs.rm(DIST, { force: true, recursive: true });

for (const { formats, minified } of [
  { formats: ['esm', 'umd', 'cjs'], minified: false },
  { formats: ['esm', 'umd'], minified: true }
]) {
  const bundle = await rollup({
    input: ENTRY,
    plugins: [
      typescript2({
        tsconfig: TSCONFIG,
        typescript: ts,
        clean: true
      }),
      json(),
      ...(minified ? [terser()] : [])
    ]
  });

  await Promise.all(
    formats.map((format) => {
      const options = getRollupOutputOptions(format, minified);
      console.log(`writing ${options.file}`);
      return bundle.write(options);
    })
  );
}
