/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// Based on similar script in Jest
// https://github.com/facebook/jest/blob/a7acc5ae519613647ff2c253dd21933d6f94b47f/scripts/prettier.js

/*eslint no-process-exit:0*/
const chalk = require('chalk');
const glob = require('glob');
const prettier = require('prettier');
const fs = require('fs');
const listChangedFiles = require('./list-changed-files');
const prettierConfigPath = require.resolve('../prettier.config.js');
const prettierIgnorePath = require.resolve('../.prettierignore');

const mode = process.argv[2] || 'check';
const shouldWrite = mode === 'write' || mode === 'write-changed';
const onlyChanged = mode === 'check-changed' || mode === 'write-changed';

const changedFiles = onlyChanged ? listChangedFiles() : null;
let didWarn = false;
let didError = false;

const files = glob
  .sync('**/*.{ts,js}', { ignore: '**/node_modules/**' })
  .filter(f => !onlyChanged || changedFiles.has(f));

if (!files.length) {
  return;
}

files.forEach(file => {
  const options = prettier.resolveConfig.sync(file, {
    config: prettierConfigPath
  });
  try {
    const fileInfo = prettier.getFileInfo.sync(file, { ignorePath: prettierIgnorePath });
    if (fileInfo.ignored) {
      return;
    }

    const input = fs.readFileSync(file, 'utf8');
    const withParserOptions = {
      ...options,
      parser: fileInfo.inferredParser
    };

    if (shouldWrite) {
      const output = prettier.format(input, withParserOptions);
      if (output !== input) {
        fs.writeFileSync(file, output, 'utf8');
      }
    } else {
      if (!prettier.check(input, withParserOptions)) {
        if (!didWarn) {
          console.log(
            '\n' +
              chalk.red(`  This project uses prettier to format all ts/js code.\n`) +
              chalk.dim(`  Please run `) +
              chalk.reset('npm run prettier') +
              chalk.dim(` and add changes to files listed below to your commit:`) +
              `\n\n`
          );
          didWarn = true;
        }
        console.log(file);
      }
    }
  } catch (error) {
    didError = true;
    console.log('\n\n' + error.message);
    console.log(file);
  }
});

if (didWarn || didError) {
  process.exit(1);
}
