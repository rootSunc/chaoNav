import { useRef, type PointerEvent } from "react";
import {
  formatMinutesAsClock,
  type HelsinkiSolarState,
} from "../lib/helsinkiSolar";

type SolarHorizonBarProps = {
  readonly solar: HelsinkiSolarState;
  readonly onScrubMinutes: (minutes: number | null) => void;
};

const SVG_W = 240;
const SVG_H = 28;

function altitudeToY(altDeg: number): number {
  // Map [-65, +65] deg to [25, 3], with 0 deg horizon at y = 14
  const clamped = Math.max(-65, Math.min(65, altDeg));
  return 14 - (clamped / 65) * 11;
}

export function SolarHorizonBar({
  solar,
  onScrubMinutes,
}: SolarHorizonBarProps) {
  const trackRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef(false);

  const pathD = solar.curve
    .map((sample, idx) => {
      const x = (sample.minute / 1440) * SVG_W;
      const y = altitudeToY(sample.altitudeDeg);
      return `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const dotX = (solar.minutesOfDay / 1440) * SVG_W;
  const dotY = altitudeToY(solar.altitudeDeg);
  const altSign = solar.altitudeDeg >= 0 ? "+" : "−";
  const altText = `${altSign}${Math.abs(solar.altitudeDeg).toFixed(1)}°`;

  function pointerToMinutes(event: PointerEvent<SVGSVGElement>) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width),
    );
    onScrubMinutes(Math.round(ratio * 1439));
  }

  return (
    <div
      className="solar-ephemeris"
      role="region"
      aria-label="Helsinki solar ephemeris"
    >
      <div className="solar-readout">
        <span className="solar-coord">60°10′N · 24°56′E</span>
        <span className="solar-sep" aria-hidden="true">
          /
        </span>
        <span className="solar-place">
          Helsinki{" "}
          <time className="solar-clock">{solar.helsinkiTimeLabel}</time>
        </span>
        <span className="solar-sep" aria-hidden="true">
          ·
        </span>
        <span className="solar-alt" title="Solar elevation above horizon">
          ☉ ALT {altText}
        </span>
        <span className="solar-phase">{solar.phaseLabel}</span>
      </div>

      <div className="solar-dial-wrap">
        <span className="solar-daylight" title="Daylight window today">
          {solar.sunriseMinutes !== null && solar.sunsetMinutes !== null
            ? `${formatMinutesAsClock(solar.sunriseMinutes)}–${formatMinutesAsClock(solar.sunsetMinutes)} (${solar.daylightLabel})`
            : `Daylight ${solar.daylightLabel}`}
        </span>
        <svg
          ref={trackRef}
          className="solar-curve-svg"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          role="slider"
          tabIndex={0}
          aria-label="Scrub Helsinki time of day"
          aria-valuemin={0}
          aria-valuemax={1439}
          aria-valuenow={solar.minutesOfDay}
          aria-valuetext={`${solar.helsinkiTimeLabel} Helsinki (${altText} solar altitude)`}
          onPointerDown={(event) => {
            draggingRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            pointerToMinutes(event);
          }}
          onPointerMove={(event) => {
            if (!draggingRef.current) return;
            pointerToMinutes(event);
          }}
          onPointerUp={() => {
            draggingRef.current = false;
          }}
          onPointerCancel={() => {
            draggingRef.current = false;
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              onScrubMinutes((solar.minutesOfDay + 30) % 1440);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              onScrubMinutes((solar.minutesOfDay + 1410) % 1440);
            } else if (event.key === "Escape" || event.key === "Home") {
              event.preventDefault();
              onScrubMinutes(null);
            }
          }}
        >
          <line
            x1="0"
            y1="14"
            x2={SVG_W}
            y2="14"
            className="solar-horizon-line"
          />
          <path d={pathD} className="solar-curve-path" fill="none" />
          <line
            x1={dotX.toFixed(1)}
            y1="0"
            x2={dotX.toFixed(1)}
            y2={SVG_H}
            className="solar-cursor-hairline"
          />
          <circle
            cx={dotX.toFixed(1)}
            cy={dotY.toFixed(1)}
            r="3.2"
            className={`solar-sun-dot ${solar.altitudeDeg >= -0.83 ? "is-above" : "is-below"}`}
          />
        </svg>
        {solar.isScrubbed ? (
          <button
            type="button"
            className="solar-reset-btn"
            onClick={() => onScrubMinutes(null)}
            aria-label="Return to live Helsinki time"
          >
            Live
          </button>
        ) : (
          <span className="solar-live-tag">LIVE</span>
        )}
      </div>
    </div>
  );
}
