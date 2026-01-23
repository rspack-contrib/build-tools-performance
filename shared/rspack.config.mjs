// @ts-check
import { defineConfig } from '@rspack/cli';
import { isProd, target } from './constants.mjs';

export default defineConfig({
  devtool: isProd ? false : undefined,
  target: ['web', target],
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
