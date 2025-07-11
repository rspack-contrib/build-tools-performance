// @ts-check
import { defineConfig } from '@rspack/cli';
import path from 'node:path';
import { target } from '../../shared/constants.mjs';

export default defineConfig({
  extends: '../../shared/rspack.config.mjs',
  target: ['node', target],
  entry: './src/entry.ts',
  resolve: {
    extensions: ['.ts', '.js'],
    tsConfig: path.resolve(import.meta.dirname, 'src/tsconfig.json'),
  },
  module: {
    parser: {
      javascript: {
        exportsPresence: false,
      },
    },
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            target,
            parser: {
              syntax: 'typescript',
            },
          },
        },
      },
    ],
  },
});
