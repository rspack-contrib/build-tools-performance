// @ts-check
import path from 'node:path';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';

const isProduction = process.env.NODE_ENV === 'production';
const caseName = process.env.CASE ?? 'medium';
const caseDir = path.join(import.meta.dirname, './src', caseName);

export default defineConfig({
  target: ['web', 'es2022'],
  devtool: isProduction ? false : undefined,
  entry: path.join(caseDir, 'index.jsx'),
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
              target: 'es2022',
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: !isProduction,
                  refresh: !isProduction,
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: path.join(caseDir, 'index-rspack.html'),
    }),
    !isProduction && new ReactRefreshPlugin(),
  ],
  experiments: {
    css: true,
    // lazyCompilation should only be enabled in development mode
    lazyCompilation: Boolean(process.env.LAZY) && !isProduction,
  },
});
