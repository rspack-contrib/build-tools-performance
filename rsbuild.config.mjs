// @ts-check
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: {
      experiments: {
        // lazyCompilation should only be enabled in development mode
        lazyCompilation: Boolean(process.env.LAZY) && !isProduction,
        incremental:
          Boolean(process.env.INCREMENTAL) && !isProduction ? true : undefined,
      },
    },
  },
});
