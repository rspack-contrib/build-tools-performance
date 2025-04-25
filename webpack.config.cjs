const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const caseName = process.env.CASE ?? 'medium';

// webpack.config.js
module.exports = {
  entry: path.join(__dirname, './src', caseName, 'index.jsx'),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|jsx)$/,
        use: {
          loader: 'swc-loader',
          options: {
            sourceMap: true,
            jsc: {
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
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.svg$/,
        type: 'asset',
      },
    ],
  },
  devServer: {
    port: 8082,
    hot: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin(),
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
};
