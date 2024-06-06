const { join } = require('path');
const { copyFile } = require('fs').promises;
const rollup = require('rollup');
const typescript2 = require('rollup-plugin-typescript2');
const terser = require('@rollup/plugin-terser');
const json = require('@rollup/plugin-json');
const ts = require('typescript');
const project = require('./project');

bundle();

async function bundle() {
  if (process.argv.slice(2)[0] === 'bench') {
    await bunldeCJS();
  } else {
    await bundleES6();
    await bundleES5();
    await copyFile('./dist/meriyah.esm.js', './dist/meriyah.esm.mjs');
    await copyFile('./dist/meriyah.esm.min.js', './dist/meriyah.esm.min.mjs');
    await copyFile('./dist/meriyah.cjs.js', './dist/meriyah.cjs');
    await copyFile('./dist/meriyah.cjs.min.js', './dist/meriyah.min.cjs');
    await copyFile('./dist/meriyah.umd.js', './dist/meriyah.umd.cjs');
    await copyFile('./dist/meriyah.umd.min.js', './dist/meriyah.umd.min.cjs');
  }
}

// bundle cjs(es6)
async function bunldeCJS() {
  console.log(`creating cjs bundle`);

  const bundle = await rollup.rollup({
    input: project.entry.path,
    plugins: [
      typescript2({
        tsconfig: project['tsconfig.json'].path,
        typescript: ts,
        clean: true
      }),
      json()
    ]
  });

  const fileName = join(project.dist.path, `meriyah.cjs.js`);

  console.log(`writing ${fileName}`);

  await bundle.write({
    file: fileName,
    name: 'meriyah',
    format: 'cjs'
  });
  console.log(`done`);
}

// bundle es6()
async function bundleES6() {
  for (const type of ['normal', 'minified']) {
    console.log(`creating ${type} bundle`);

    const bundle = await rollup.rollup({
      input: project.entry.path,
      plugins: [
        typescript2({
          tsconfig: project['tsconfig.json'].path,
          typescript: ts,
          clean: true
        }),
        json(),
        ...(type === 'minified' ? [terser()] : [])
      ]
    });

    const suffix = type === 'minified' ? '.min' : '';

    //'amd' | 'cjs' | 'system' | 'es' | 'esm' | 'iife' | 'umd'

    for (const format of ['esm', 'system', 'cjs']) {
      const fileName = join(project.dist.path, `meriyah.${format}${suffix}.js`);

      console.log(`writing ${fileName}`);

      await bundle.write({
        file: fileName,
        name: 'meriyah',
        format
      });
    }

    for (const format of ['umd', 'amd', 'iife']) {
      const fileName = join(project.dist.path, `meriyah.${format}${suffix}.js`);

      console.log(`writing ${fileName}`);

      await bundle.write({
        file: fileName,
        exports: 'named',
        name: 'meriyah',
        format
      });
    }
  }
}

// bundle es5(umd)
async function bundleES5() {
  for (const type of ['normal', 'minified']) {
    console.log(`creating ${type} es5 bundle`);

    const bundle = await rollup.rollup({
      input: project.entry.path,
      plugins: [
        typescript2({
          tsconfig: project['tsconfig.json'].path,
          tsconfigOverride: { compilerOptions: { target: 'es5' } },
          typescript: ts,
          clean: true
        }),
        json(),
        ...(type === 'minified' ? [terser()] : [])
      ]
    });

    const suffix = type === 'minified' ? '.min' : '';

    for (const format of ['umd']) {
      const fileName = join(project.dist.path, `meriyah.${format}.es5${suffix}.js`);

      console.log(`writing ${fileName}`);

      await bundle.write({
        file: fileName,
        exports: 'named',
        name: 'meriyah',
        format
      });
    }
  }
}
