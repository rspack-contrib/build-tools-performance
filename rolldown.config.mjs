import { defineConfig } from "rolldown";
import path from 'path';
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  
  input: {
    main: path.resolve(import.meta.dirname,"./src/index.tsx"),
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  output: {
    minify: isProduction,
  },
});
