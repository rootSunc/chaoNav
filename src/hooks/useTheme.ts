import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  readStoredMode,
  resolveTheme,
  storeMode,
  type ThemeMode,
} from "../lib/theme";

const ORDER: readonly ThemeMode[] = ["sky", "day", "night"];

export function useTheme(sunAltitudeDeg: number) {
  const [mode, setMode] = useState<ThemeMode>(readStoredMode);
  const theme = resolveTheme(mode, sunAltitudeDeg);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const cycleMode = useCallback(() => {
    setMode((current) => {
      const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
      storeMode(next);
      return next;
    });
  }, []);

  return { mode, theme, cycleMode };
}
