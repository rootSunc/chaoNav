import { useCallback, useEffect, useState } from "react";
import type { Lang } from "../content";

export const LANG_STORAGE_KEY = "chaonav-lang";

function initialLang(): Lang {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "en" || stored === "zh") return stored;
  } catch {
    // Fall through to the browser's language.
  }
  return typeof navigator !== "undefined" &&
    navigator.language?.toLowerCase().startsWith("zh")
    ? "zh"
    : "en";
}

export function useLang() {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((current) => {
      const next: Lang = current === "en" ? "zh" : "en";
      try {
        window.localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch {
        // The choice just won't survive a reload.
      }
      return next;
    });
  }, []);

  return { lang, toggleLang };
}
