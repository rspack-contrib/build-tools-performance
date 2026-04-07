// @ts-check
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { isProd, target } from '../../shared/constants.mjs';

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
    main: './src/index.js',
    // [E1001] Duplicate Packages — antd 与 @mui/@chakra 的传递依赖版本冲突（@emotion/hash, @emotion/unitless）
    'duplicate-packages': './src/entries/duplicate-packages.js',
    // [E1002] Cross Chunks Package — 两个入口共享大量相同依赖，未做 splitChunks
    'cross-chunks-a': './src/entries/cross-chunks-a.js',
    'cross-chunks-b': './src/entries/cross-chunks-b.js',
    // [E1006] Module Mixed Chunks — 同一模块同时出现在 initial 和 async chunk
    'module-mixed-chunks': './src/entries/module-mixed-chunks.js',
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
  // 故意不配置 splitChunks，使跨 chunk 重复包问题更明显
  optimization: {
    splitChunks: false,
  },
  plugins: [
    makeHtml(['main'], 'index.html', 'UI Components'),
    makeHtml(['duplicate-packages'], 'duplicate-packages.html', 'Duplicate Packages'),
    makeHtml(['cross-chunks-a'], 'cross-chunks-a.html', 'Cross Chunks A'),
    makeHtml(['cross-chunks-b'], 'cross-chunks-b.html', 'Cross Chunks B'),
    makeHtml(['module-mixed-chunks'], 'module-mixed-chunks.html', 'Module Mixed Chunks'),
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
