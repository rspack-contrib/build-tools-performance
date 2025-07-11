// @ts-check
import { defineConfig } from '@rspack/cli';
import path from 'node:path';
import { config } from '../../shared/rspack.config.mjs';
import { target } from '../../shared/constants.mjs';

export default defineConfig({
  ...config,
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
