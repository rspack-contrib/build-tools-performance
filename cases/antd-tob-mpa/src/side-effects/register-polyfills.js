/**
 * Side-effect-only module: registers polyfills on the global scope.
 * Importing this module without any specifiers is intentional.
 */
if (typeof globalThis.__POLYFILL_REGISTRY__ === 'undefined') {
  globalThis.__POLYFILL_REGISTRY__ = {};
}

globalThis.__POLYFILL_REGISTRY__.arrayAt = true;
globalThis.__POLYFILL_REGISTRY__.structuredClone = true;
globalThis.__POLYFILL_REGISTRY__.objectGroupBy = true;

export const POLYFILL_VERSION = '1.0.0';
export function getPolyfillStatus() {
  return globalThis.__POLYFILL_REGISTRY__;
}
