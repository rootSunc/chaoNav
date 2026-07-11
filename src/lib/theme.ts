export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'chaonav-theme';

const THEME_COLORS: Record<Theme, string> = {
  dark: '#0a0b0c',
  light: '#f2f0f0',
};

export function resolveTheme(storedTheme: string | null): Theme {
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return 'dark';
}

export function readStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  return resolveTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');

  if (themeColor) {
    themeColor.setAttribute('content', THEME_COLORS[theme]);
  }
}
