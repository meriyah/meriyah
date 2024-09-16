const { join } = require('path');
const fs = require('fs').promises;
const rollup = require('rollup');
const typescript2 = require('rollup-plugin-typescript2');
const terser = require('@rollup/plugin-terser');
const json = require('@rollup/plugin-json');
const ts = require('typescript');
const project = require('./project');

async function bundleDist(format, minified) {
  const bundle = await rollup.rollup({
    input: project.entry.path,
    plugins: [
      typescript2({
        tsconfig: project['tsconfig.json'].path,
        typescript: ts,
        clean: true
      }),
      json(),
      ...(minified ? [terser()] : [])
    ]
  });

  let suffix = format === 'umd' ? '.umd' : '';
  suffix += minified ? '.min' : '';
  suffix += format === 'esm' ? '.mjs' : format === 'cjs' ? '.cjs' : '.js';

  const fileName = join(project.dist.path, `meriyah${suffix}`);
  console.log(`writing ${fileName}`);
  const options = { file: fileName, name: 'meriyah', format };
  if (format === 'umd') {
    // For IIFE
    options.exports = 'named';
  }
  await bundle.write(options);
}

async function bundleAll(cjsOnly) {
  // CommonJS
  await bundleDist('cjs', false);
  if (cjsOnly) return;

  // ESM
  await bundleDist('esm', true);
  await bundleDist('esm', false);

  // UMD supports AMD, CommonJS, and IIFE
  await bundleDist('umd', true);
  await bundleDist('umd', false);
}

async function bundle() {
  await fs.rm(project.dist.path, { force: true, recursive: true });

  const cjsOnly = process.argv.slice(2)[0] === 'bench';
  await bundleAll(cjsOnly);
}

bundle();
