import { defineConfig } from "@farmfe/core";

export default defineConfig({
  compilation: {
    presetEnv: false,
  },
  plugins: ["@farmfe/plugin-react"],
});
