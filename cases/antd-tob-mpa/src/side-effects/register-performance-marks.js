/**
 * Side-effect-only module: records performance marks on load.
 * Typically imported without any specifiers for its side effects.
 */
const PERF_MARKS = {
  APP_INIT: 'app:init',
  LAYOUT_READY: 'app:layout-ready',
  DATA_LOADED: 'app:data-loaded',
};

if (typeof performance !== 'undefined' && performance.mark) {
  performance.mark(PERF_MARKS.APP_INIT);
}

globalThis.__PERF_MARKS__ = PERF_MARKS;

export { PERF_MARKS };

export function markLayoutReady() {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(PERF_MARKS.LAYOUT_READY);
  }
}

export function markDataLoaded() {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(PERF_MARKS.DATA_LOADED);
  }
}
