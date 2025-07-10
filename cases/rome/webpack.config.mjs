// @ts-check
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import path from 'node:path';

export default {
  entry: './src/entry.ts',
  devtool: false,
  target: ['node', 'es2022'],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(import.meta.dirname, 'src/tsconfig.json'),
      }),
    ],
  },
  ignoreWarnings: [/ESModulesLinkingWarning/],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'swc-loader',
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
};
