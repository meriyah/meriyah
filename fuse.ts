import { sparky, fusebox } from 'fuse-box';
import * as fs from 'fs';

class Context {
  isProduction: boolean;
  runServer: boolean;
  getConfig() {
    return fusebox({
      target: 'browser',

      entry: 'repl-src/index.tsx',
      webIndex: {
        publicPath: this.isProduction ? '/meriyah/docs/' : '/',
        template: 'repl-src/index.html',
        // This doesn't work in fusebox v4.
        // https://github.com/fuse-box/fuse-box/issues/1977
        embedIndexedBundles: this.isProduction
      },
      resources: {
        resourceFolder: './resources',
        resourcePublicRoot: '/resources'
      },

      hmr: true,
      devServer: this.runServer
    });
  }
}
const { rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  rm('docs');
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev({ bundles: { distRoot: 'docs' } });
});

task('preview', async ctx => {
  rm('docs');
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true, bundles: { distRoot: 'docs' } });
});

task('dist', async ctx => {
  rm('docs');
  rm('index.html');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true, bundles: { distRoot: 'docs' } });
  fs.renameSync('./docs/index.html', './index.html');
});
