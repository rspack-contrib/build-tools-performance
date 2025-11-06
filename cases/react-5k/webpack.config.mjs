// @ts-check
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { target, isProd } from '../../shared/constants.mjs';

export default {
  extends: '../../shared/webpack.config.mjs',
  entry: './src/index.jsx',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|jsx)$/,
        use: {
          loader: 'swc-loader',
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
    new HtmlWebpackPlugin({ template: 'index-rspack.html' }),
    isProd ? null : new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
};
