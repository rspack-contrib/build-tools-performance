import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  root: path.resolve(__dirname, "src", process.env.CASE ?? "5000"),
  plugins: [react()],
});
