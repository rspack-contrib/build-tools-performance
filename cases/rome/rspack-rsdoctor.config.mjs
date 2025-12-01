
import { defineConfig } from '@rspack/cli';
import { RsdoctorPluginConfig } from '../../shared/rsdoctor.mjs'

const configs = defineConfig({
  extends: './rspack.config.mjs',
  plugins: [
    ...RsdoctorPluginConfig,
  ].filter(Boolean),
});
export default configs;

