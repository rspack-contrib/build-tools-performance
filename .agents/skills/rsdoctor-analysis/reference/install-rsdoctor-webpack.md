# Install Rsdoctor Plugin for Webpack Projects

This guide covers installation for Webpack projects (webpack >= 5).

## Step 1: Install Dependencies

Rsdoctor only supports webpack >= 5.

For projects based on webpack:

```bash
npm add @rsdoctor/webpack-plugin -D
pnpm add @rsdoctor/webpack-plugin -D
```

## Step 2: Register Plugin

After the dependency installation, you need to integrate the Rsdoctor plugin into your project.

:::important
**Important:** To generate `rsdoctor-data.json` file that can be analyzed by AI tools, you must configure the plugin with:

- `output.mode: 'brief'`
- `output.options.type: ['json']`

This configuration ensures that only JSON data is generated, which is suitable for analysis without starting the Rsdoctor server.
:::

### Webpack

Initialize the plugin in the [plugins](https://webpack.js.org/configuration/plugins/#plugins) of `webpack.config.js`:

```js title="webpack.config.js"
const { RsdoctorWebpackPlugin } = require('@rsdoctor/webpack-plugin');

module.exports = {
  // ...
  plugins: [
    // Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
    process.env.RSDOCTOR &&
      new RsdoctorWebpackPlugin({
        disableClientServer: true,
        // Generate JSON data only (suitable for AI tools analysis)
        output: {
          mode: 'brief',
          options: {
            type: ['json'],
          },
        },
      }),
  ].filter(Boolean),
};
```

## Step 3 & 4: Locate and Use rsdoctor-data.json

For steps on locating the `rsdoctor-data.json` file and using it for analysis, see the [common installation guide](./install-rsdoctor-common.md).
