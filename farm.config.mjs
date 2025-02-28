import { defineConfig } from "@farmfe/core";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  compilation: {
    sourcemap: !isProduction,
    presetEnv: false,
  },
  plugins: ["@farmfe/plugin-react"],
});
