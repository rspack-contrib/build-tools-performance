// @ts-check
import { defineConfig } from '@rspack/cli';
import { isProd, targetBrowser } from './constants.mjs';

export default defineConfig({
  devtool: isProd ? false : undefined,
  target: ['web', `browserslist:${targetBrowser}`],
  resolve: {
    extensions: ['...', '.tsx', '.ts', '.jsx'],
  },
  module: {
    defaultRules: [
      '...',
      {
        test: /\.css$/,
        type: 'css/auto',
      },
    ],
  },
  cache: {
    type: 'persistent',
  },
});
