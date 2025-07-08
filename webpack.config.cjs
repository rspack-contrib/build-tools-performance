const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const caseName = process.env.CASE ?? 'medium';
const caseDir = path.join(__dirname, './src', caseName);

module.exports = {
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
          loader: 'swc-loader',
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
  devServer: {
    port: 8082,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(caseDir, 'index-rspack.html'),
    }),
    isProd ? null : new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  optimization: {
    minimize: isProd,
    minimizer: isProd
      ? [
          new CssMinimizerPlugin({
            minify: CssMinimizerPlugin.swcMinify,
          }),
          new TerserPlugin({
            minify: TerserPlugin.swcMinify,
          }),
        ]
      : [],
  },
  experiments: {
    css: true,
  },
};
