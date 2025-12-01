/**
 * Rsdoctor analysis configuration file
 * This file provides the settings used for CI diff workflows in the Rspack repository.
 */
import { defineConfig } from '@rspack/cli';
import { rsdoctorPluginConfig } from '../../shared/rsdoctor.mjs';

export default defineConfig({
  extends: './rspack.config.mjs',
  plugins: [...rsdoctorPluginConfig],
});
