import path from "node:path";
import { defineConfig } from "@farmfe/core";

const isProduction = process.env.NODE_ENV === "production";
const caseName = process.env.CASE ?? 'medium';

export default defineConfig({
  compilation: {
    sourcemap: !isProduction,
    presetEnv: false,
    input: {
      index: path.resolve(__dirname, "src", caseName, "index.jsx"),
    }
  },
  plugins: ["@farmfe/plugin-react"],
});
