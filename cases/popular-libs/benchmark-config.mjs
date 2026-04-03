export const config = {
  supportedTools: [
    'rspack',
    'rsbuild',
    'vite',
    'rolldown',
    'webpack',
    'esbuild',
    'farm',
    // Parcel cannot bundle Zod
    // https://github.com/parcel-bundler/parcel/issues/10175
    // 'parcel',
  ],
  dev: false,
};
