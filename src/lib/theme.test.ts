import { describe, expect, it } from "vitest";
import { computeHelsinkiSolar } from "./helsinkiSolar";
import { resolveTheme, skyTheme } from "./theme";

describe("theme", () => {
  it("follows the Helsinki sky unless the reader chose otherwise", () => {
    const novemberNoon = computeHelsinkiSolar(new Date("2026-11-14T10:00:00Z"));
    const novemberNight = computeHelsinkiSolar(new Date("2026-11-14T20:00:00Z"));

    expect(skyTheme(novemberNoon.altitudeDeg)).toBe("light");
    expect(skyTheme(novemberNight.altitudeDeg)).toBe("dark");
    expect(resolveTheme("sky", novemberNight.altitudeDeg)).toBe("dark");
    expect(resolveTheme("day", novemberNight.altitudeDeg)).toBe("light");
    expect(resolveTheme("night", novemberNoon.altitudeDeg)).toBe("dark");
  });

  it("stays light through civil twilight and goes dark after it", () => {
    expect(skyTheme(-3)).toBe("light");
    expect(skyTheme(-5)).toBe("dark");
  });
});
