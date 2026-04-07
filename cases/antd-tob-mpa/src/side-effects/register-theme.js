/**
 * Side-effect-only module: injects theme CSS variables into the document.
 * Imported for its side effects — modifies the DOM style.
 */
const themeTokens = {
  '--primary-color': '#1677ff',
  '--success-color': '#52c41a',
  '--warning-color': '#faad14',
  '--error-color': '#ff4d4f',
  '--font-size-base': '14px',
  '--border-radius-base': '6px',
  '--layout-header-height': '56px',
  '--layout-sider-width': '220px',
};

if (typeof document !== 'undefined') {
  const style = document.documentElement.style;
  for (const [key, value] of Object.entries(themeTokens)) {
    style.setProperty(key, value);
  }
}

globalThis.__THEME_TOKENS__ = themeTokens;

export { themeTokens };

export function updateThemeToken(key, value) {
  themeTokens[key] = value;
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(key, value);
  }
}
