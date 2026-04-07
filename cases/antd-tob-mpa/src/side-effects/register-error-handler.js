/**
 * Side-effect-only module: installs a global error handler.
 * Imported purely for its side effects — sets up window error listeners.
 */
const errorBuffer = [];

function handleError(event) {
  errorBuffer.push({
    type: 'error',
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    timestamp: Date.now(),
  });
}

function handleUnhandledRejection(event) {
  errorBuffer.push({
    type: 'unhandledrejection',
    reason: String(event.reason),
    timestamp: Date.now(),
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
}

globalThis.__ERROR_BUFFER__ = errorBuffer;

export function getErrorBuffer() {
  return errorBuffer;
}

export function clearErrorBuffer() {
  errorBuffer.length = 0;
}
