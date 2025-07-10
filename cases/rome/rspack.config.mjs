// @ts-check
import { defineConfig } from '@rspack/cli';
import path from 'node:path';

export default defineConfig({
  entry: './src/entry.ts',
  devtool: false,
  target: ['node', 'es2022'],
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
            target: 'es2022',
            parser: {
              syntax: 'typescript',
            },
          },
        },
      },
    ],
  },
});
