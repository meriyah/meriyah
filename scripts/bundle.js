const { join } = require('path');
const rollup = require('rollup');
const typescript2 = require('rollup-plugin-typescript2');
const { terser } = require('rollup-plugin-terser');
const ts = require('typescript');
const project = require('./project');

async function createBundle() {
  if (process.argv.slice(2)[0] === 'bench') {
    console.log(`creating cjs bundle`);

    const bundle = await rollup.rollup({
      input: project.entry.path,
      plugins: [
        typescript2({
          tsconfig: project['tsconfig.json'].path,
          typescript: ts
        })
      ]
    });

    const fileName = join(project.dist.path, `meriyah.cjs.js`);

    console.log(`writing ${fileName}`);

    await bundle.write({
      file: fileName,
      name: 'meriyah',
      format: 'cjs'
    });
  } else {
    for (const type of ['normal', 'minified']) {
      console.log(`creating ${type} bundle`);

      const bundle = await rollup.rollup({
        input: project.entry.path,
        plugins: [
          typescript2({
            tsconfig: project['tsconfig.json'].path,
            typescript: ts
          }),
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

  console.log(`done`);
}

createBundle();
