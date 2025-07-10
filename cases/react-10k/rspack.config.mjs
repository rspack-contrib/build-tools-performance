// @ts-check
import path from 'node:path';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { target, isProd } from '../../shared.mjs';

export default defineConfig({
  target: ['web', target],
  devtool: isProd ? false : undefined,
  entry: path.join(import.meta.dirname, 'src', 'index.jsx'),
  resolve: {
    extensions: ['...', '.tsx', '.ts', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          /** @type {import('@rspack/core').SwcLoaderOptions} */
          options: {
            jsc: {
              target,
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: !isProd,
                  refresh: !isProd,
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: 'index-rspack.html' }),
    !isProd && new ReactRefreshPlugin(),
  ],
  experiments: {
    css: true,
    // lazyCompilation should only be enabled in development mode
    lazyCompilation: Boolean(process.env.LAZY) && !isProd,
  },
});
