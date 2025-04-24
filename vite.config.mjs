import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: path.resolve(__dirname, "src", process.env.CASE ?? "medium"),
  experimental: {
    enableNativePlugin: true,
  },
  esbuild: false,
});
