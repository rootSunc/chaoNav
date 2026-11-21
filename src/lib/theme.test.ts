import { describe, expect, it } from "vitest";
import { computeHelsinkiSolar } from "./helsinkiSolar";
import {
  duskGlow,
  NIGHT_GLOW_FLOOR,
  nightGlow,
  resolveTheme,
  skyTheme,
} from "./theme";

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

  it("warms the page as the afternoon sun sets, never in the morning", () => {
    expect(duskGlow(20, 220)).toBe(0);
    expect(duskGlow(3, 230)).toBeCloseTo(0.5);
    expect(duskGlow(-2, 240)).toBe(1);
    expect(duskGlow(-10, 250)).toBe(0);
    expect(duskGlow(-2, 120)).toBe(0);
  });

  it("keeps an afterglow on the night page, strongest just after dark", () => {
    expect(nightGlow(-5, 240)).toBeGreaterThan(0.9);
    expect(nightGlow(-11, 250)).toBeCloseTo(0.7);
    expect(nightGlow(-30, 300)).toBe(NIGHT_GLOW_FLOOR);
    expect(nightGlow(-10, 120)).toBe(NIGHT_GLOW_FLOOR);
  });

  it("stays light through civil twilight and goes dark after it", () => {
    expect(skyTheme(-3)).toBe("light");
    expect(skyTheme(-5)).toBe("dark");
  });
});
