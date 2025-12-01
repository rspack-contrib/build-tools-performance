// @ts-check
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

const isCI = process.env.CI === 'true';

export default defineConfig({
  extends: '../../shared/rspack.config.mjs',
  plugins: [
    new rspack.HtmlRspackPlugin({ template: 'index-rspack.html' }),
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
