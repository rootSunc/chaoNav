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

/** Sun altitude (degrees) below which the afternoon light starts to warm. */
export const GLOW_ALTITUDE_DEG = 6;

/**
 * How warm the late-afternoon light is, 0 to 1. It rises as the sun sinks
 * toward the horizon, holds through sunset, and fades out well after the page
 * has gone dark. Mornings stay cool.
 */
export function duskGlow(altitudeDeg: number, azimuthDeg: number): number {
  if (azimuthDeg < 180) return 0;
  if (altitudeDeg >= GLOW_ALTITUDE_DEG) return 0;
  if (altitudeDeg > 0) return (GLOW_ALTITUDE_DEG - altitudeDeg) / GLOW_ALTITUDE_DEG;
  if (altitudeDeg >= DUSK_ALTITUDE_DEG) return 1;
  return Math.max(0, 1 - (DUSK_ALTITUDE_DEG - altitudeDeg) / 4);
}

/** Sun altitude (degrees) at which astronomical twilight ends. */
export const NIGHT_ALTITUDE_DEG = -18;
/** The afterglow never quite leaves a night page. */
export const NIGHT_GLOW_FLOOR = 0.4;

/**
 * How bright the afterglow on the night page is, from the floor to 1. It is
 * strongest just after the page goes dark in the evening and settles to the
 * floor once the sky is fully dark (and for the rest of the night).
 */
export function nightGlow(altitudeDeg: number, azimuthDeg: number): number {
  if (azimuthDeg < 180 || altitudeDeg > DUSK_ALTITUDE_DEG) return NIGHT_GLOW_FLOOR;
  if (altitudeDeg <= NIGHT_ALTITUDE_DEG) return NIGHT_GLOW_FLOOR;
  const t = (DUSK_ALTITUDE_DEG - altitudeDeg) / (DUSK_ALTITUDE_DEG - NIGHT_ALTITUDE_DEG);
  return 1 - t * (1 - NIGHT_GLOW_FLOOR);
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
