import { useEffect, useState } from "react";

// The page's promise: every live number says where it came from, and a number
// that could not be fetched is shown as a dated snapshot or as missing.

export type ReadingState = "loading" | "live" | "snapshot" | "unavailable";

export type Reading<T> = {
  readonly value: T | null;
  readonly state: ReadingState;
  readonly source: string;
  readonly at: Date | null;
};

export type Weather = { readonly tempC: number; readonly windMs: number };

export type LiveSources = {
  readonly cneStars: Reading<number>;
  readonly cneForks: Reading<number>;
  readonly arkiStars: Reading<number>;
  readonly weather: Reading<Weather>;
  readonly aqi: Reading<number>;
};

const SNAPSHOT_AT = new Date("2026-11-14T22:30:00Z");
const GITHUB = "api.github.com";
const OPEN_METEO = "api.open-meteo.com";
const OPEN_METEO_AIR = "air-quality-api.open-meteo.com";
const HELSINKI = "latitude=60.17&longitude=24.94";
const REFRESH_MS = 10 * 60_000;

const snapshot = (value: number): Reading<number> => ({
  value,
  state: "snapshot",
  source: GITHUB,
  at: SNAPSHOT_AT,
});

const loading = <T,>(source: string): Reading<T> => ({
  value: null,
  state: "loading",
  source,
  at: null,
});

const INITIAL: LiveSources = {
  cneStars: snapshot(1033),
  cneForks: snapshot(115),
  arkiStars: snapshot(17),
  weather: loading(OPEN_METEO),
  aqi: loading(OPEN_METEO_AIR),
};

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${response.status}`);
  return response.json();
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function field(obj: unknown, key: string): unknown {
  return obj && typeof obj === "object"
    ? (obj as Record<string, unknown>)[key]
    : undefined;
}

export function useLiveSources(): LiveSources {
  const [sources, setSources] = useState<LiveSources>(INITIAL);

  useEffect(() => {
    if (typeof fetch !== "function") return;
    let cancelled = false;
    const patch = (next: Partial<LiveSources>) => {
      if (!cancelled) setSources((current) => ({ ...current, ...next }));
    };

    const loadRepo = async (
      repo: string,
      apply: (stars: number, forks: number, at: Date) => Partial<LiveSources>,
    ) => {
      try {
        const data = await getJson(`https://${GITHUB}/repos/${repo}`);
        const stars = num(field(data, "stargazers_count"));
        const forks = num(field(data, "forks_count"));
        if (stars !== null && forks !== null) {
          patch(apply(stars, forks, new Date()));
        }
      } catch {
        // Rate-limited or offline: the dated snapshot stays, labelled as one.
      }
    };

    const live = <T,>(value: T, source: string): Reading<T> => ({
      value,
      state: "live",
      source,
      at: new Date(),
    });
    const missing = <T,>(source: string): Reading<T> => ({
      value: null,
      state: "unavailable",
      source,
      at: null,
    });

    const loadWeather = async () => {
      try {
        const data = await getJson(
          `https://${OPEN_METEO}/v1/forecast?${HELSINKI}&current=temperature_2m,wind_speed_10m&wind_speed_unit=ms`,
        );
        const current = field(data, "current");
        const tempC = num(field(current, "temperature_2m"));
        const windMs = num(field(current, "wind_speed_10m"));
        patch({
          weather:
            tempC !== null && windMs !== null
              ? live({ tempC, windMs }, OPEN_METEO)
              : missing(OPEN_METEO),
        });
      } catch {
        patch({ weather: missing(OPEN_METEO) });
      }
    };

    const loadAir = async () => {
      try {
        const data = await getJson(
          `https://${OPEN_METEO_AIR}/v1/air-quality?${HELSINKI}&current=european_aqi`,
        );
        const aqi = num(field(field(data, "current"), "european_aqi"));
        patch({
          aqi: aqi !== null ? live(aqi, OPEN_METEO_AIR) : missing(OPEN_METEO_AIR),
        });
      } catch {
        patch({ aqi: missing(OPEN_METEO_AIR) });
      }
    };

    void loadRepo("rootSunc/CNEquity", (stars, forks, at) => ({
      cneStars: { value: stars, state: "live", source: GITHUB, at },
      cneForks: { value: forks, state: "live", source: GITHUB, at },
    }));
    void loadRepo("rootSunc/ArkiWatch", (stars, _forks, at) => ({
      arkiStars: { value: stars, state: "live", source: GITHUB, at },
    }));

    const loadSignals = () => {
      void loadWeather();
      void loadAir();
    };
    loadSignals();
    const timer = window.setInterval(loadSignals, REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return sources;
}
