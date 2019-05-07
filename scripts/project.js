const { join, resolve } = require('path');
const packageJson = require('../package.json');

const root = resolve(__dirname, '..');

module.exports = {
  path: root,
  pkg: packageJson,
  coverage: { path: join(root, 'coverage') },
  src: { path: join(root, 'src') },
  entry: { path: join(root, 'src', 'meriyah.ts') },
  dist: { path: join(root, 'dist') },
  node_modules: { path: join(root, 'node_modules') },
  scripts: { path: join(root, 'scripts') },
  test: { path: join(root, 'test') },
  'tsconfig.json': { path: join(root, 'tsconfig.json') },
  'package.json': { path: join(root, 'package.json') },
  'package-lock.json': { path: join(root, 'package-lock.json') }
};
