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
  },
  module: {
    rules: [
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
    !isProd && new ReactRefreshPlugin(),
    new RsdoctorRspackPlugin({
      features: ['bundle'],
      output: {
            mode: 'brief',
            options: {
              type: ['json'],
            },
          }
        
    }),
  ],
});
