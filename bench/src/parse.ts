import * as Benchmark from 'benchmark';
import * as path from 'path';
import * as fs from 'fs';
import { master, local } from './cherow/index';

const optionNames = process.argv.slice(2)[0];
const options = optionNames.split(',').reduce((acc, cur) => {
  acc[cur] = true;
  return acc;
}, {});

const node_modules = path.resolve('node_modules');
const files = {
  typescript: fs.readFileSync(path.join(node_modules, 'typescript', 'lib', 'tsc.js')).toString(),
  angular: fs.readFileSync(path.join(node_modules, 'angular', 'angular.js')).toString(),
  react: fs.readFileSync(path.join(node_modules, 'react', 'umd', 'react.development.js')).toString(),
  jquery: fs.readFileSync(path.join(node_modules, 'jquery', 'dist', 'jquery.js')).toString(),
  vue: fs.readFileSync(path.join(node_modules, 'vue', 'dist', 'vue.js')).toString(),
  inferno: fs.readFileSync(path.join(node_modules, 'inferno', 'dist', 'index.esnext.js')).toString(),
  aurelia: fs
    .readFileSync(path.join(node_modules, '@aurelia', 'jit-html-browser', 'dist', 'index.iife.full.js'))
    .toString()
};

type Result = { name: string; hz: number };
const results: {
  1: Result[];
  2: Result[];
} = {
  1: [],
  2: []
};

const format = function format(hz: number): string {
  return (~~(hz * 100) / 100)
    .toString()
    .padEnd(4, ' ')
    .padStart(6, ' ');
};

const onCycle = function onCycle(event: any): void {
  const { name, hz } = event.target;
  const version = name.slice(1, 2);
  results[version].push({ name: name.slice(3), hz });

  console.log(event.target.toString());
};

const onComplete = function onComplete(): void {
  console.log('-'.repeat(72));
  console.log(`${' '.repeat(42)} cherow${' '.repeat(20)} meriyah${' '.repeat(10)}`);
  for (let i = 0; i < results[1].length; ++i) {
    const v1 = results[1][i];
    const v2 = results[2][i];

    const diff = ~~((Math.max(v1.hz, v2.hz) / Math.min(v1.hz, v2.hz) - 1) * 100);
    const diffText = `${v1.hz < v2.hz ? '\x1b[32m' : '\x1b[31m'}${diff}%\x1b[0m`;

    console.log(
      `${v1.name.padEnd(32)} ${format(v1.hz)} ops/sec${' '.repeat(8)} ${format(v2.hz)} ops/sec${' '.repeat(
        8
      )}${diffText}`
    );
  }
};

const suite = new Benchmark.Suite(optionNames, { onCycle, onComplete });

for (const name in files) {
  const source = files[name];
  suite.add(`v1 ${name.padEnd(14, ' ')} ${optionNames}`, function() {
    master.cherow.parse(source, options);
  });
}
for (const name in files) {
  const source = files[name];
  suite.add(`v2 ${name.padEnd(14, ' ')} ${optionNames}`, function() {
    local.cherow.parse(source, options);
  });
}

suite.run();
