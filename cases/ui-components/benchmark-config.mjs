export const config = {
  supportedTools: [
    'rspack',
    'rsbuild',
    'vite',
    // Rollup timeout on GitHub Actions
    // 'rollup',
    // Failed to bundle CSS
    // 'rolldown',
    'webpack',
    'esbuild',
    'farm',
    'parcel',
  ],
  dev: false,
};
