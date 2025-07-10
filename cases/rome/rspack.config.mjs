// @ts-check
import { defineConfig } from '@rspack/cli';
import path from 'node:path';
import { target } from '../../shared.mjs';

export default defineConfig({
  entry: './src/entry.ts',
  devtool: false,
  target: ['node', target],
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
