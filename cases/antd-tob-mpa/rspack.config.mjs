// @ts-check
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { target, isProd } from '../../shared/constants.mjs';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

const makeHtml = (/** @type {string[]} */ chunks, /** @type {string} */ filename, /** @type {string} */ title) =>
  new rspack.HtmlRspackPlugin({
    template: 'index-rspack.html',
    filename,
    chunks,
    templateParameters: { title },
  });

export default defineConfig({
  extends: '../../shared/rspack.config.mjs',
  entry: {
    dashboard: './src/pages/dashboard/index.jsx',
    charts: './src/pages/charts/index.jsx',
    orders: './src/pages/orders/index.jsx',
    'product-detail': './src/pages/product-detail/index.jsx',
    'create-order': './src/pages/create-order/index.jsx',
    'new-feature': './src/pages/new-feature/index.jsx',
    'feature-duplicate-1': './src/pages/feature-duplicate-1/index.jsx',
    'feature-duplicate-2': './src/pages/feature-duplicate-2/index.jsx',
    'feature-duplicate-3': './src/pages/feature-duplicate-3/index.jsx',
    'feature-duplicate-4': './src/pages/feature-duplicate-4/index.jsx',
    'feature-duplicate-5': './src/pages/feature-duplicate-5/index.jsx',
    'side-effects-only-imports': './src/pages/side-effects-only-imports/index.jsx',
    'esm-resolved-to-cjs': './src/pages/esm-resolved-to-cjs/index.jsx',
    'large-assets': './src/pages/large-assets/index.jsx',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        type: 'css',
      },
      {
        test: /\.(js|ts|tsx|jsx)$/,
        use: {
          loader: 'builtin:swc-loader',
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
    makeHtml(['dashboard'], 'index.html', 'Dashboard'),
    makeHtml(['charts'], 'charts.html', 'Charts'),
    makeHtml(['orders'], 'orders.html', 'Orders'),
    makeHtml(['product-detail'], 'product-detail.html', 'Product Detail'),
    makeHtml(['create-order'], 'create-order.html', 'Create Order'),
    makeHtml(['new-feature'], 'new-feature.html', 'New Feature'),
    makeHtml(['side-effects-only-imports'], 'side-effects-only-imports.html', 'Side-Effects-Only Imports'),
    makeHtml(['esm-resolved-to-cjs'], 'esm-resolved-to-cjs.html', 'ESM Resolved To CJS'),
    makeHtml(['large-assets'], 'large-assets.html', 'Large Assets'),
    !isProd && new ReactRefreshPlugin(),
    new RsdoctorRspackPlugin({
      features: ['bundle', 'treeShaking'],
      linter: {
        rules: {
          'esm-resolved-to-cjs': 'off'
        }
      },
      output: {
        mode: 'brief',
        options: {
          type: ['json'],
        },
      },
    }),
  ],
});
