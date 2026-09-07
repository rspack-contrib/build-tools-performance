// @ts-check
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { target, isProd } from '../../shared/constants.mjs';

export default {
  extends: '../../shared/webpack.config.mjs',
  entry: './index.html',
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
    isProd ? null : new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
};
