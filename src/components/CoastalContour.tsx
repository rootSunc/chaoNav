import { useState } from "react";
import type { CadenceArtifactId } from "../data/siteContent";

type CoastalContourProps = {
  readonly isResonant?: boolean;
  readonly isDimmed?: boolean;
  readonly onHoverCadence?: (id: CadenceArtifactId | null) => void;
  readonly registerRef?: (el: HTMLElement | null) => void;
};

const WAYPOINTS = [
  {
    id: "ruoholahti",
    name: "Ruoholahti canal bridge",
    km: "0.0 km",
    note: "Leaving city grid toward open western water",
    x: 248,
    y: 86,
  },
  {
    id: "lauttasaari",
    name: "Vattuniemi granite point",
    km: "7.8 km",
    note: "Southernmost headland — unobstructed Gulf of Finland wind",
    x: 168,
    y: 112,
  },
  {
    id: "kaskisaari",
    name: "Kaskisaari — Lehtisaari bridges",
    km: "14.2 km",
    note: "Low wooden crossings flush with Baltic chop",
    x: 76,
    y: 66,
  },
  {
    id: "seurasaari",
    name: "Seurasaari pine causeway",
    km: "20.6 km",
    note: "Sheltered bay gravel before gliding back via Hietaniemi",
    x: 184,
    y: 28,
  },
] as const;

export function CoastalContour({
  isResonant = false,
  isDimmed = false,
  onHoverCadence,
  registerRef,
}: CoastalContourProps) {
  const [activeIdx, setActiveIdx] = useState(1);
  const wp = WAYPOINTS[activeIdx];

  return (
    <section
      ref={registerRef}
      data-cadence-id="coast"
      aria-label="Helsinki western islands cycling loop"
      className={`cadence-specimen coast-specimen ${isResonant ? "is-resonant" : ""} ${isDimmed ? "is-dimmed" : ""}`}
      onPointerEnter={() => onHoverCadence?.("coast")}
      onPointerLeave={() => onHoverCadence?.(null)}
    >
      <div className="cadence-topline">
        <span className="specimen-mono-label">COASTAL CADENCE · 26.4 KM</span>
        <span className="specimen-catalogue">60°09′N — 60°11′N</span>
      </div>

      <div className="coast-canvas-wrap">
        <svg
          className="coast-svg"
          viewBox="0 0 320 132"
          role="img"
          aria-label="Vector coastline trace of Lauttasaari, Kaskisaari, and Seurasaari loop"
        >
          {/* Subtle latitude / longitude graticule */}
          <line x1="0" y1="44" x2="320" y2="44" className="coast-graticule" />
          <line x1="0" y1="92" x2="320" y2="92" className="coast-graticule" />
          <line x1="106" y1="0" x2="106" y2="132" className="coast-graticule" />
          <line x1="214" y1="0" x2="214" y2="132" className="coast-graticule" />

          {/* Simplified island landmasses (Lauttasaari, Lehtisaari/Kuusisaari, Seurasaari, Mainland edge) */}
          <path
            d="M132,76 C148,68 178,70 192,82 C198,94 186,116 166,118 C146,118 130,104 126,90 Z"
            className="coast-island"
          />
          <path
            d="M52,44 C68,38 92,46 98,60 C100,72 82,78 66,72 C52,66 46,54 52,44 Z"
            className="coast-island"
          />
          <path
            d="M166,16 C182,12 200,20 202,34 C198,46 178,48 166,38 C158,30 158,20 166,16 Z"
            className="coast-island"
          />
          <path
            d="M232,6 L316,6 L316,104 C290,102 264,96 244,88 C236,72 238,52 226,38 C222,24 226,12 232,6 Z"
            className="coast-mainland"
          />

          {/* Closed 26.4 km cycling loop */}
          <path
            d="M248,86 C224,94 202,106 168,112 C136,114 114,92 76,66 C60,52 94,32 140,26 C164,23 176,26 184,28 C214,34 236,56 248,86 Z"
            className="coast-route-loop"
            fill="none"
          />

          {WAYPOINTS.map((point, idx) => (
            <g
              key={point.id}
              className={`coast-waypoint ${activeIdx === idx ? "is-active" : ""}`}
              onClick={() => setActiveIdx(idx)}
            >
              <circle cx={point.x} cy={point.y} r={activeIdx === idx ? 5.5 : 3} />
              <circle
                cx={point.x}
                cy={point.y}
                r="11"
                className="waypoint-hit"
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="coast-footer">
        <div className="coast-waypoint-copy" aria-live="polite">
          <strong>
            {wp.name} <span>· {wp.km}</span>
          </strong>
          <p>{wp.note}</p>
        </div>

        <div
          className="coast-pills"
          role="group"
          aria-label="Coastal loop waypoints"
        >
          {WAYPOINTS.map((point, idx) => (
            <button
              key={point.id}
              type="button"
              aria-label={`Waypoint ${idx + 1}: ${point.name}`}
              aria-pressed={activeIdx === idx}
              className={activeIdx === idx ? "is-active" : ""}
              onClick={() => setActiveIdx(idx)}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
