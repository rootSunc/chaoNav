export type Theme = "dark" | "light";
/** "sky" follows the sun over Helsinki; the other two are explicit choices. */
export type ThemeMode = "sky" | "day" | "night";

export const THEME_STORAGE_KEY = "chaonav-theme";

/** Sun altitude (degrees) below which the page goes dark: mid civil twilight. */
export const DUSK_ALTITUDE_DEG = -4;

const THEME_COLORS: Record<Theme, string> = {
  dark: "#0a0e2a",
  light: "#f4f3ee",
};

export function skyTheme(altitudeDeg: number): Theme {
  return altitudeDeg > DUSK_ALTITUDE_DEG ? "light" : "dark";
}

export function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "sky";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light") return "day";
    if (stored === "dark") return "night";
  } catch {
    // Storage can be blocked; the sky is a fine default.
  }
  return "sky";
}

export function storeMode(mode: ThemeMode) {
  try {
    if (mode === "sky") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        mode === "day" ? "light" : "dark",
      );
  } catch {
    // Nothing to do: the choice just won't survive a reload.
  }
}

export function resolveTheme(mode: ThemeMode, altitudeDeg: number): Theme {
  if (mode === "day") return "light";
  if (mode === "night") return "dark";
  return skyTheme(altitudeDeg);
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}
