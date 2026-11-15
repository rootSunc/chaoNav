import { useEffect, useState } from "react";
import type { Copy } from "../../content";
import type { LiveSources, Reading } from "../../hooks/useLiveSources";
import { formatMinutesAsClock, type HelsinkiSolarState } from "../../lib/helsinkiSolar";

type SignalsProps = {
  readonly t: Copy;
  readonly live: LiveSources;
  readonly solar: HelsinkiSolarState;
};

const MINUS = "−";
const signed = (value: number) =>
  `${value < 0 ? MINUS : ""}${Math.abs(value).toFixed(1)}`;

export function formatWeather(
  weather: { tempC: number; windMs: number },
  t: Copy,
) {
  return `${signed(weather.tempC)} °C · ${t.signals.wind} ${weather.windMs.toFixed(1)} m/s`;
}

export function formatAqi(aqi: number, t: Copy) {
  const band = Math.max(0, Math.min(5, Math.floor(aqi / 20)));
  return `AQI ${Math.round(aqi)} · ${t.signals.aqi[band]}`;
}

export function formatDaylight(solar: HelsinkiSolarState) {
  const { sunriseMinutes, sunsetMinutes, daylightLabel } = solar;
  const span =
    sunriseMinutes !== null && sunsetMinutes !== null
      ? ` · ${formatMinutesAsClock(sunriseMinutes)}–${formatMinutesAsClock(sunsetMinutes)}`
      : "";
  return `${daylightLabel.replace("h", " h").replace("m", " min")}${span}`;
}

function Freshness({
  reading,
  t,
  now,
}: {
  readonly reading: Reading<unknown>;
  readonly t: Copy;
  readonly now: number;
}) {
  if (reading.state === "live" && reading.at) {
    const seconds = Math.max(0, Math.round((now - reading.at.getTime()) / 1000));
    return (
      <span className="signal-fresh" data-state="live">
        <i aria-hidden="true" />
        {t.ledger.live} · {t.signals.ago(seconds)}
      </span>
    );
  }
  return (
    <span className="signal-fresh" data-state={reading.state}>
      {reading.state === "loading" ? t.ledger.loading : t.ledger.unavailable}
    </span>
  );
}

/** Three public signals for Helsinki, each with its source and its age. */
export function Signals({ t, live, solar }: SignalsProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const sunIsUp = solar.altitudeDeg >= -0.833;
  const nextStep =
    sunIsUp && solar.sunsetMinutes !== null
      ? t.signals.sunUp(formatMinutesAsClock(solar.sunsetMinutes))
      : !sunIsUp && solar.sunriseMinutes !== null
        ? t.signals.sunDown(formatMinutesAsClock(solar.sunriseMinutes))
        : null;

  return (
    <div className="signals">
      <p className="signals-head mono">
        <span>{t.signals.title}</span>
        <span>{solar.helsinkiTimeLabel}</span>
      </p>

      {nextStep && <p className="signals-step">{nextStep}</p>}

      <dl className="signals-rows">
        <div className="signal">
          <dt>{t.signals.weather}</dt>
          <dd className="signal-value" key={live.weather.state}>
            {live.weather.value ? formatWeather(live.weather.value, t) : "—"}
          </dd>
          <dd className="signal-source mono">Open-Meteo</dd>
          <dd className="signal-age mono">
            <Freshness reading={live.weather} t={t} now={now} />
          </dd>
        </div>
        <div className="signal">
          <dt>{t.signals.air}</dt>
          <dd className="signal-value" key={live.aqi.state}>
            {live.aqi.value !== null ? formatAqi(live.aqi.value, t) : "—"}
          </dd>
          <dd className="signal-source mono">Open-Meteo · CAMS</dd>
          <dd className="signal-age mono">
            <Freshness reading={live.aqi} t={t} now={now} />
          </dd>
        </div>
        <div className="signal">
          <dt>{t.signals.daylight}</dt>
          <dd className="signal-value">{formatDaylight(solar)}</dd>
          <dd className="signal-source mono">60.17°N 24.94°E</dd>
          <dd className="signal-age mono">
            <span className="signal-fresh" data-state="computed">
              {t.ledger.computed}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
