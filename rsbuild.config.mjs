// @ts-check
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: {
      watchOptions: {
        ignored: /[\\/](?:\.git|node_modules)[\\/]/,
      },
    },
  },
});
