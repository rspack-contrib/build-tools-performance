import { isProd } from './constants.mjs';

// Bun is a native binary, so the benchmark runner cannot inject the memory
// logging into its bin file. Instead we log it directly from the build script,
// which is executed by the Bun runtime.
process.on('exit', () => {
  console.log('Memory Usage:', process.memoryUsage().rss);
});

export default async (options) => {
  const result = await Bun.build({
    outdir: 'dist',
    target: 'browser',
    splitting: true,
    minify: isProd,
    sourcemap: isProd ? 'none' : 'linked',
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        isProd ? 'production' : 'development',
      ),
    },
    ...options,
  });

  if (!result.success) {
    for (const message of result.logs) {
      console.error(message);
    }
    process.exit(1);
  }
};
