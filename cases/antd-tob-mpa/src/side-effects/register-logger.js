/**
 * Side-effect-only module: installs a global logger.
 * Typically imported as `import './register-logger'` for its side effects.
 */
const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

class Logger {
  constructor(prefix) {
    this.prefix = prefix;
    this.history = [];
  }

  _log(level, ...args) {
    const entry = { level, timestamp: Date.now(), args };
    this.history.push(entry);
    if (typeof console !== 'undefined' && console[level]) {
      console[level](`[${this.prefix}]`, ...args);
    }
  }

  debug(...args) { this._log('debug', ...args); }
  info(...args) { this._log('info', ...args); }
  warn(...args) { this._log('warn', ...args); }
  error(...args) { this._log('error', ...args); }

  getHistory() { return this.history; }
}

globalThis.__APP_LOGGER__ = new Logger('antd-tob-mpa');
globalThis.__APP_LOGGER__.info('Logger initialized');

export { Logger, LOG_LEVELS };
