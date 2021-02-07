import { sparky, fusebox } from 'fuse-box';

class Context {
  isProduction: boolean;
  runServer: boolean;
  getConfig() {
    return fusebox({
      target: 'browser',

      entry: 'repl-src/index.tsx',
      webIndex: {
        publicPath: this.isProduction ? '/meriyah/' : '/',
        template: 'repl-src/index.html',
        embedIndexedBundles: this.isProduction
      },
      resources: {
        resourceFolder: './resources',
        resourcePublicRoot: this.isProduction ? '/meriyah/resources' : '/resources'
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
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true, bundles: { distRoot: 'docs' } });
});
