import { describe, expect, it } from "vitest";
import {
  computeHelsinkiSolar,
  formatMinutesAsClock,
} from "./helsinkiSolar";

describe("computeHelsinkiSolar", () => {
  it("computes high solar altitude and long daylight near Helsinki summer solstice", () => {
    const midsummerNoon = new Date("2026-06-21T10:20:00Z"); // 13:20 EEST
    const state = computeHelsinkiSolar(midsummerNoon);

    expect(state.altitudeDeg).toBeGreaterThan(50);
    expect(state.phase).toBe("daylight");
    expect(state.sunriseMinutes).not.toBeNull();
    expect(state.sunsetMinutes).not.toBeNull();
    expect(state.sunsetMinutes! - state.sunriseMinutes!).toBeGreaterThan(
      18 * 60,
    );
  });

  it("computes low winter sun at midday and deep night in November evening", () => {
    const winterEvening = new Date("2026-11-14T18:54:00Z"); // 20:54 EET
    const eveningState = computeHelsinkiSolar(winterEvening);
    expect(eveningState.altitudeDeg).toBeLessThan(-12);
    expect(eveningState.phase).toBe("night");
    expect(eveningState.helsinkiTimeLabel).toBe("20:54");

    const scrubbedNoon = computeHelsinkiSolar(winterEvening, 12 * 60 + 15);
    expect(scrubbedNoon.isScrubbed).toBe(true);
    expect(scrubbedNoon.altitudeDeg).toBeGreaterThan(8);
    expect(scrubbedNoon.altitudeDeg).toBeLessThan(15);
    expect(scrubbedNoon.helsinkiTimeLabel).toBe("12:15");
  });

  it("formats clock minutes cleanly across midnight boundaries", () => {
    expect(formatMinutesAsClock(0)).toBe("00:00");
    expect(formatMinutesAsClock(515)).toBe("08:35");
    expect(formatMinutesAsClock(1440)).toBe("00:00");
  });
});
