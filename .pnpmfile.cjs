module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === 'rolldown-vite') {
        if (pkg.bin && pkg.bin.vite) {
          pkg.bin['rolldown-vite'] = pkg.bin.vite;
          delete pkg.bin.vite;
        }
      }
      return pkg;
    },
  },
};
