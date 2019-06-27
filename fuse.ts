import { sparky, fusebox } from 'fuse-box';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      target: 'browser',

      entry: 'repl-src/index.tsx',
      output: this.isProduction ? './' : './repl-dev/$name.js',
      webIndex: {
        template: 'repl-src/index.html',
        embedIndexedBundles: this.isProduction
      },
      resources: {
        resourceFolder: './resources',
        resourcePublicRoot: './resources'
      },

      watch: { ignored: ['dist'] },
      hmr: true,
      devServer: this.runServer
    });
  }
}
const { task } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true });
});
