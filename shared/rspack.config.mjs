// @ts-check
import { defineConfig } from '@rspack/cli';
import { isProd, target, targetBrowser } from './constants.mjs';
import { rspack } from '@rspack/core';

export const config = defineConfig({
  devtool: isProd ? false : undefined,
  target: ['web', target],
  resolve: {
    extensions: ['...', '.tsx', '.ts', '.jsx'],
  },
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: {
          targets: [targetBrowser],
        },
      }),
    ],
  },
  experiments: {
    css: true,
    // lazyCompilation should only be enabled in development mode
    lazyCompilation: Boolean(process.env.LAZY) && !isProd,
  },
});
