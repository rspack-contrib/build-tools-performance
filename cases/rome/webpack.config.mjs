// @ts-check
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import path from 'node:path';
import { target } from '../../shared/constants.mjs';

export default {
  entry: './src/entry.ts',
  devtool: false,
  target: ['node', target],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(import.meta.dirname, 'src/tsconfig.json'),
      }),
    ],
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
        loader: 'swc-loader',
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
};
