/**
 * Rsdoctor analysis configuration file
 * This configuration is to support the CI process of the Rspack repository diff actions.
 */
import { defineConfig } from '@rspack/cli';
import { RsdoctorPluginConfig } from '../../shared/rsdoctor.mjs'

const configs = defineConfig({
  extends: './rspack.config.mjs',
  plugins: [
    ...RsdoctorPluginConfig,
  ].filter(Boolean),
});

export default configs;

