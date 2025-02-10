import { defineConfig } from "rolldown";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  input: {
    main: "./src/index.tsx",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  output: {
    minify: isProduction,
  },
});
