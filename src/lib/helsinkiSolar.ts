// Deterministic solar ephemeris for Helsinki (60°10′12″ N, 24°56′18″ E).
// Pure math on client clock — zero external API dependencies.

export type LightPhase = "night" | "twilight" | "low-sun" | "daylight";

export type SolarSample = {
  readonly minute: number;
  readonly altitudeDeg: number;
};

export type HelsinkiSolarState = {
  readonly helsinkiTimeLabel: string;
  readonly minutesOfDay: number;
  readonly isScrubbed: boolean;
  readonly altitudeDeg: number;
  readonly azimuthDeg: number;
  readonly sunriseMinutes: number | null;
  readonly sunsetMinutes: number | null;
  readonly daylightLabel: string;
  readonly phase: LightPhase;
  readonly phaseLabel: string;
  readonly curve: readonly SolarSample[];
};

const HELSINKI_LAT_DEG = 60.1699;
const HELSINKI_LON_DEG = 24.9384;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function getHelsinkiDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Helsinki",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "shortOffset",
  }).formatToParts(date);

  const lookup = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "0";

  const year = Number(lookup("year"));
  const month = Number(lookup("month"));
  const day = Number(lookup("day"));
  const hour = Number(lookup("hour")) % 24;
  const minute = Number(lookup("minute"));
  const tzOffsetRaw = lookup("timeZoneName"); // e.g. "GMT+2" or "GMT+3"
  const offsetMatch = tzOffsetRaw.match(/([+-]\d+)(?::(\d+))?/);
  const tzOffsetHours = offsetMatch
    ? Number(offsetMatch[1]) +
      (offsetMatch[2] ? Number(offsetMatch[2]) / 60 : 0)
    : 2;

  const startOfYearUtc = Date.UTC(year, 0, 0);
  const currentDayUtc = Date.UTC(year, month - 1, day);
  const dayOfYear = Math.floor((currentDayUtc - startOfYearUtc) / 86_400_000);

  return {
    dayOfYear,
    minutesOfDay: hour * 60 + minute,
    tzOffsetHours,
  };
}

export function formatMinutesAsClock(minutes: number): string {
  const wrapped = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function solarPositionAtMinute(
  dayOfYear: number,
  minutesOfDay: number,
  tzOffsetHours: number,
): { altitudeDeg: number; azimuthDeg: number } {
  const gamma =
    ((2 * Math.PI) / 365) * (dayOfYear - 1 + (minutesOfDay / 60 - 12) / 24);

  // Spencer (1971) equation of time (minutes) and solar declination (radians)
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const timeOffset = eqTime + 4 * HELSINKI_LON_DEG - 60 * tzOffsetHours;
  const trueSolarTime = minutesOfDay + timeOffset;
  const hourAngleDeg = trueSolarTime / 4 - 180;
  const hourAngle = hourAngleDeg * DEG_TO_RAD;
  const lat = HELSINKI_LAT_DEG * DEG_TO_RAD;

  const sinAlt =
    Math.sin(lat) * Math.sin(decl) +
    Math.cos(lat) * Math.cos(decl) * Math.cos(hourAngle);
  const clampedSinAlt = Math.max(-1, Math.min(1, sinAlt));
  const altRad = Math.asin(clampedSinAlt);
  const altitudeDeg = altRad * RAD_TO_DEG;

  const cosZenith = clampedSinAlt;
  const sinZenith = Math.sqrt(Math.max(0, 1 - cosZenith * cosZenith));
  let azimuthDeg = 180;
  if (sinZenith > 1e-4) {
    const cosAz =
      (Math.sin(lat) * cosZenith - Math.sin(decl)) /
      (Math.cos(lat) * sinZenith);
    const clampedCosAz = Math.max(-1, Math.min(1, cosAz));
    const azBase = Math.acos(clampedCosAz) * RAD_TO_DEG;
    azimuthDeg = hourAngleDeg > 0 ? (azBase + 180) % 360 : (540 - azBase) % 360;
  }

  return { altitudeDeg, azimuthDeg };
}

function classifyLightPhase(altitudeDeg: number): {
  phase: LightPhase;
  phaseLabel: string;
} {
  if (altitudeDeg < -12) {
    return { phase: "night", phaseLabel: "Astronomical night" };
  }
  if (altitudeDeg < -0.83) {
    return { phase: "twilight", phaseLabel: "Northern twilight" };
  }
  if (altitudeDeg < 10) {
    return { phase: "low-sun", phaseLabel: "Low slant light" };
  }
  return { phase: "daylight", phaseLabel: "Clear northern day" };
}

export function computeHelsinkiSolar(
  date: Date,
  overrideMinutes?: number | null,
): HelsinkiSolarState {
  const { dayOfYear, minutesOfDay: liveMinutes, tzOffsetHours } =
    getHelsinkiDateParts(date);

  const isScrubbed =
    typeof overrideMinutes === "number" && Number.isFinite(overrideMinutes);
  const activeMinutes = isScrubbed
    ? Math.max(0, Math.min(1439, Math.round(overrideMinutes)))
    : liveMinutes;

  const { altitudeDeg, azimuthDeg } = solarPositionAtMinute(
    dayOfYear,
    activeMinutes,
    tzOffsetHours,
  );

  // Sample 49 points across 24 hours (every 30 min) for the horizon curve
  const curve: SolarSample[] = [];
  for (let m = 0; m <= 1440; m += 30) {
    curve.push({
      minute: m,
      altitudeDeg: solarPositionAtMinute(dayOfYear, m, tzOffsetHours)
        .altitudeDeg,
    });
  }

  // Estimate sunrise & sunset (-0.833 deg atmospheric refraction horizon)
  const horizonDeg = -0.833;
  let sunriseMinutes: number | null = null;
  let sunsetMinutes: number | null = null;
  let aboveMinutes = 0;

  for (let m = 0; m < 1440; m += 5) {
    const a0 = solarPositionAtMinute(dayOfYear, m, tzOffsetHours).altitudeDeg;
    const a1 = solarPositionAtMinute(
      dayOfYear,
      m + 5,
      tzOffsetHours,
    ).altitudeDeg;
    if (a0 >= horizonDeg) aboveMinutes += 5;
    if (a0 < horizonDeg && a1 >= horizonDeg && sunriseMinutes === null) {
      const t = (horizonDeg - a0) / (a1 - a0);
      sunriseMinutes = Math.round(m + t * 5);
    }
    if (a0 >= horizonDeg && a1 < horizonDeg) {
      const t = (a0 - horizonDeg) / (a0 - a1);
      sunsetMinutes = Math.round(m + t * 5);
    }
  }

  const daylightHours = Math.floor(aboveMinutes / 60);
  const daylightRemainder = aboveMinutes % 60;
  const daylightLabel = `${daylightHours}h ${String(daylightRemainder).padStart(2, "0")}m`;
  const { phase, phaseLabel } = classifyLightPhase(altitudeDeg);

  return {
    helsinkiTimeLabel: formatMinutesAsClock(activeMinutes),
    minutesOfDay: activeMinutes,
    isScrubbed,
    altitudeDeg,
    azimuthDeg,
    sunriseMinutes,
    sunsetMinutes,
    daylightLabel,
    phase,
    phaseLabel,
    curve,
  };
}
