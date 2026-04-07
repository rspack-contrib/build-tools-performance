# Install Rsdoctor Plugin for Rspack Projects

This guide covers installation for Rspack-based projects, including:

- Rspack CLI
- Rsbuild
- Modern.js
- Rslib
- Rspress

## Step 1: Install Dependencies

For projects based on Rspack, such as Rsbuild or Rslib:

**Note:** Prefer using the latest versions of the above dependencies when available.

```bash
npm add @rsdoctor/rspack-plugin -D
pnpm add @rsdoctor/rspack-plugin -D
```

## Step 2: Register Plugin

After the dependency installation, you need to integrate the Rsdoctor plugin into your project. Below are configuration examples for different Rspack-based frameworks:

:::important
**Important:** To generate `rsdoctor-data.json` file that can be analyzed by AI tools, you must configure the plugin with:

- `output.mode: 'brief'`
- `output.options.type: ['json']`

This configuration ensures that only JSON data is generated, which is suitable for analysis without starting the Rsdoctor server.
:::

### Rspack CLI

Initialize the plugin in the [plugins](https://www.rspack.rs/config/plugins.html#plugins) of `rspack.config.ts`:

```ts title="rspack.config.ts"
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

export default {
  plugins: [
    // Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
    process.env.RSDOCTOR &&
      new RsdoctorRspackPlugin({
        disableClientServer: true,
        // Generate JSON data only (suitable for AI tools analysis)
        output: {
          mode: 'brief',
          options: {
            type: ['json'],
          },
        },
      }),
  ],
};
```

### Rsbuild/Rslib/Modern.js

See [Rsbuild - Use Rsdoctor](https://rsbuild.rs/guide/debug/rsdoctor) for more details.
If this is Modern.js project can see [tools.rspack](https://modernjs.dev/configure/app/tools/rspack) of `modern.config.ts`:

To generate JSON data for AI tools analysis, configure it in `rsbuild.config.ts`:

```ts title="rsbuild.config.ts"
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

export default {
  tools: {
    rspack: {
      plugins: [
        process.env.RSDOCTOR === 'true' &&
          new RsdoctorRspackPlugin({
            disableClientServer: true, // Required: Prevent starting local server
            output: {
              mode: 'brief', // Required: Use brief mode
              options: {
                type: ['json'], // Required: Only generate JSON data
              },
            },
          }),
      ],
    },
  },
};
```

### Rspress

For Rspress projects, configure the plugin in `builderConfig.tools.rspack`:

```ts title="rspress.config.ts"
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  builderConfig: {
    tools: {
      rspack: {
        plugins: [
          process.env.RSDOCTOR === 'true' &&
            new RsdoctorRspackPlugin({
              disableClientServer: true, // Required: Prevent starting local server
              output: {
                mode: 'brief', // Required: Use brief mode
                options: {
                  type: ['json'], // Required: Only generate JSON data
                },
              },
            }),
        ],
      },
    },
  },
});
```

## Step 3 & 4: Locate and Use rsdoctor-data.json

For steps on locating the `rsdoctor-data.json` file and using it for analysis, see the [common installation guide](./install-rsdoctor-common.md).
