// @ts-check
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import path from 'node:path';
import { target } from '../../shared/constants.mjs';

export default {
  extends: '../../shared/webpack.config.mjs',
  entry: './src/entry.ts',
  resolve: {
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
