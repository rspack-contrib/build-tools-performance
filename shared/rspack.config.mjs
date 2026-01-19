// @ts-check
import { defineConfig } from '@rspack/cli';
import { isProd, target, targetBrowser } from './constants.mjs';
import { rspack } from '@rspack/core';

export default defineConfig({
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
  module: {
    defaultRules: [
      '...',
      // compat rspack2.0
      {
        test: /\.css$/,
        type: 'css/auto',
      },
    ],
  },
  cache: true,
  experiments: {
    css: true,
    cache: {
      type: 'persistent',
    },
  },
});
