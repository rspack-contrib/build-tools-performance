// @ts-check
import { defineConfig } from '@rspack/cli';
import path from 'node:path';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { target } from '../../shared/constants.mjs';

const isCI = process.env.CI === 'true';

export default defineConfig({
  extends: '../../shared/rspack.node.config.mjs',
  entry: './src/entry.ts',
  resolve: {
    extensions: ['.ts', '.js'],
    tsConfig: path.resolve(import.meta.dirname, 'src/tsconfig.json'),
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
        loader: 'builtin:swc-loader',
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
  plugins: [
    process.env.RSDOCTOR && new RsdoctorRspackPlugin({
      features: ['bundle'],
      output: isCI
      ? {
          mode: 'brief',
          options: {
            type: ['json'],
          },
        }
      : {},
    }),
  ].filter(Boolean),
});
