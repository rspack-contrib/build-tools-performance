import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

const isCI = process.env.CI === 'true';

export const RsdoctorPluginConfig = [
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
  ]