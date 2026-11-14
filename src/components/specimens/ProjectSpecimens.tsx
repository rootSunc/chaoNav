import { useState } from "react";
import type { ProjectId } from "../../data/siteContent";

// 01 / CNEquity — Point-in-Time vs Naive Backfill Scrubber
const PIT_QUARTERS = [
  {
    label: "2023 Q4",
    asOf: "2023-12-29",
    pitClose: "¥48.20",
    naiveClose: "¥9.64",
    constituent: "CSI 300: Out",
    naiveLeak: "Leaks 2024 5× split + future CSI inclusion",
    pitNote: "Unadjusted raw trade + exact T₀ constituent state preserved",
    pitY: [44, 41, 39, 36, 38, 35],
    naiveY: [54, 52, 50, 48, 22, 18],
  },
  {
    label: "2024 Q2 (Split)",
    asOf: "2024-06-14",
    pitClose: "¥9.85 (adj factor 5.0)",
    naiveClose: "¥9.85",
    constituent: "CSI 300: Added T+1",
    naiveLeak: "Retroactively rewrites pre-split liquidity rank",
    pitNote: "Row-level PIT factor applied only from ex-date forward",
    pitY: [44, 41, 39, 26, 23, 20],
    naiveY: [44, 41, 39, 26, 22, 18],
  },
  {
    label: "2025 Q3",
    asOf: "2025-09-30",
    pitClose: "¥11.40",
    naiveClose: "¥11.40",
    constituent: "CSI 300: Active",
    naiveLeak: "Drops 14 delisted peers from historical universe",
    pitNote: "Delisted tickers retained in historical cross-section",
    pitY: [44, 41, 39, 26, 21, 16],
    naiveY: [44, 41, 39, 26, 21, 16],
  },
] as const;

function CnEquitySpecimen() {
  const [step, setStep] = useState(0);
  const snap = PIT_QUARTERS[step];
  const xs = [12, 68, 124, 180, 236, 292];
  const toPath = (ys: readonly number[]) =>
    ys.map((y, i) => `${i === 0 ? "M" : "L"}${xs[i]},${y}`).join(" ");

  return (
    <div className="micro-specimen" aria-label="Point-in-time lineage specimen">
      <div className="specimen-toolbar">
        <span className="specimen-mono-label">AS_OF SNAPSHOT</span>
        <div className="specimen-seg" role="group" aria-label="Observation date">
          {PIT_QUARTERS.map((q, idx) => (
            <button
              key={q.label}
              type="button"
              aria-pressed={step === idx}
              className={step === idx ? "is-active" : ""}
              onClick={() => setStep(idx)}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <svg
        className="specimen-chart"
        viewBox="0 0 304 64"
        aria-hidden="true"
      >
        <line x1="0" y1="32" x2="304" y2="32" className="chart-grid-line" />
        <line x1="180" y1="4" x2="180" y2="60" className="chart-event-line" />
        <text x="184" y="12" className="chart-annotation">
          ex-split T₀
        </text>
        <path d={toPath(snap.naiveY)} className="chart-line-naive" fill="none" />
        <path d={toPath(snap.pitY)} className="chart-line-pit" fill="none" />
        <circle
          cx={xs[step * 2 + 1] ?? 180}
          cy={snap.pitY[step * 2 + 1] ?? 26}
          r="3"
          className="chart-node-pit"
        />
      </svg>

      <div className="specimen-metrics">
        <div>
          <span className="metric-key">PIT ({snap.asOf})</span>
          <strong className="metric-val">{snap.pitClose}</strong>
          <small className="metric-sub">{snap.pitNote}</small>
        </div>
        <div>
          <span className="metric-key is-warn">Naive overwrite</span>
          <strong className="metric-val is-muted">{snap.naiveClose}</strong>
          <small className="metric-sub">{snap.naiveLeak}</small>
        </div>
      </div>
    </div>
  );
}

// 02 / ArkiWatch — Helsinki Civic Signal Strip
const ARKI_SIGNALS = [
  {
    id: "weather",
    label: "FMI Weather",
    reading: "+2.4°C · WSW 6 m/s",
    status: "Dry asphalt · light coastal gust",
    bars: [28, 26, 24, 22, 19, 17, 18, 21, 24, 27, 29, 30],
  },
  {
    id: "transit",
    label: "HSL Transit",
    reading: "Tram 4 / Metro · Normal",
    status: "1 minor diversion on Coastal Rail",
    bars: [14, 14, 15, 29, 16, 14, 14, 15, 22, 15, 14, 14],
  },
  {
    id: "energy",
    label: "NordPool FI",
    reading: "3.18 c/kWh",
    status: "Off-peak wind surplus window 22:00–06:00",
    bars: [11, 10, 12, 24, 31, 26, 20, 22, 33, 25, 14, 10],
  },
  {
    id: "air",
    label: "HSY Air",
    reading: "AQI 16 · Good",
    status: "PM2.5 4.1 µg/m³ across Mannerheimintie",
    bars: [15, 16, 16, 18, 19, 17, 16, 15, 16, 15, 14, 14],
  },
] as const;

function ArkiWatchSpecimen() {
  const [channelIdx, setChannelIdx] = useState(0);
  const channel = ARKI_SIGNALS[channelIdx];

  return (
    <div className="micro-specimen" aria-label="Helsinki morning signal specimen">
      <div className="specimen-toolbar">
        <span className="specimen-mono-label">07:30 BRIEF</span>
        <div className="specimen-seg" role="group" aria-label="Telemetry feed">
          {ARKI_SIGNALS.map((sig, idx) => (
            <button
              key={sig.id}
              type="button"
              aria-pressed={channelIdx === idx}
              className={channelIdx === idx ? "is-active" : ""}
              onClick={() => setChannelIdx(idx)}
            >
              {sig.label}
            </button>
          ))}
        </div>
      </div>

      <div className="arki-strip">
        <div className="arki-bars" aria-hidden="true">
          {channel.bars.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}px` }}
              className={i === 3 || i === 8 ? "is-peak" : ""}
            />
          ))}
        </div>
        <div className="arki-readout">
          <strong>{channel.reading}</strong>
          <span>{channel.status}</span>
        </div>
      </div>
    </div>
  );
}

// 03 / Suomeksi — Finnish Morphological Root Inflector
const ROOTS = [
  {
    stem: "talo",
    gloss: "house",
    caseSuffix: "ssa",
    caseGloss: "inessive · in",
    possSuffix: "ni",
    possGloss: "1sg · my",
    clitic: "kin",
    cliticGloss: "clitic · even/too",
  },
  {
    stem: "kirja",
    gloss: "book",
    caseSuffix: "sta",
    caseGloss: "elative · from",
    possSuffix: "nsa",
    possGloss: "3p · their",
    clitic: "kaan",
    cliticGloss: "clitic · either",
  },
] as const;

function SuomeksiSpecimen() {
  const [rootIdx, setRootIdx] = useState(0);
  const [hasCase, setHasCase] = useState(true);
  const [hasPoss, setHasPoss] = useState(false);
  const [hasClitic, setHasClitic] = useState(false);

  const r = ROOTS[rootIdx];
  const segments = [
    { part: r.stem, role: `stem (${r.gloss})` },
    ...(hasCase ? [{ part: r.caseSuffix, role: r.caseGloss }] : []),
    ...(hasPoss ? [{ part: r.possSuffix, role: r.possGloss }] : []),
    ...(hasClitic ? [{ part: r.clitic, role: r.cliticGloss }] : []),
  ];

  const englishParts: string[] = [];
  if (hasClitic) {
    englishParts.push(rootIdx === 0 ? "even" : "not even");
  }
  if (hasCase) {
    englishParts.push(rootIdx === 0 ? "in" : "from");
  }
  if (hasPoss) {
    englishParts.push(rootIdx === 0 ? "my" : "their");
  } else {
    englishParts.push("the");
  }
  englishParts.push(r.gloss);

  return (
    <div className="micro-specimen" aria-label="Morphological stem composer">
      <div className="specimen-toolbar">
        <div className="specimen-seg" role="group" aria-label="Choose Finnish stem">
          {ROOTS.map((item, idx) => (
            <button
              key={item.stem}
              type="button"
              aria-pressed={rootIdx === idx}
              className={rootIdx === idx ? "is-active" : ""}
              onClick={() => setRootIdx(idx)}
            >
              {item.stem}
            </button>
          ))}
        </div>
        <div className="specimen-seg" role="group" aria-label="Inflection suffixes">
          <button
            type="button"
            aria-pressed={hasCase}
            className={hasCase ? "is-active" : ""}
            onClick={() => setHasCase((v) => !v)}
          >
            +{r.caseSuffix}
          </button>
          <button
            type="button"
            aria-pressed={hasPoss}
            className={hasPoss ? "is-active" : ""}
            onClick={() => setHasPoss((v) => !v)}
          >
            +{r.possSuffix}
          </button>
          <button
            type="button"
            aria-pressed={hasClitic}
            className={hasClitic ? "is-active" : ""}
            onClick={() => setHasClitic((v) => !v)}
          >
            +{r.clitic}
          </button>
        </div>
      </div>

      <div className="morphology-stage">
        <div className="morphology-word">
          {segments.map((seg, idx) => (
            <span
              key={`${seg.part}-${idx}`}
              className={`morpheme morpheme-${idx}`}
            >
              {idx > 0 ? "·" : ""}
              {seg.part}
            </span>
          ))}
        </div>
        <div className="morphology-gloss">
          <span>“{englishParts.join(" ")}”</span>
          <small>{segments.map((s) => s.role).join(" + ")}</small>
        </div>
      </div>
    </div>
  );
}

// 04 / DaisyNotice — Deterministic Dedup & Translation Fanout
function DaisyNoticeSpecimen() {
  const [duplicateRun, setDuplicateRun] = useState(false);

  return (
    <div className="micro-specimen" aria-label="Notice deduplication pipeline">
      <div className="specimen-toolbar">
        <span className="specimen-mono-label">CRON POLL · 06:45</span>
        <div className="specimen-seg" role="group" aria-label="Poll state">
          <button
            type="button"
            aria-pressed={!duplicateRun}
            className={!duplicateRun ? "is-active" : ""}
            onClick={() => setDuplicateRun(false)}
          >
            New notice
          </button>
          <button
            type="button"
            aria-pressed={duplicateRun}
            className={duplicateRun ? "is-active" : ""}
            onClick={() => setDuplicateRun(true)}
          >
            Repeat poll
          </button>
        </div>
      </div>

      <div className="pipeline-trace">
        <div className="pipeline-node">
          <span className="metric-key">PILKE [FI]</span>
          <p>“Muistutus: metsäretki perjantaina, sadevaatteet mukaan.”</p>
        </div>
        <div className="pipeline-arrow" aria-hidden="true">
          →
        </div>
        <div className="pipeline-node">
          <span className="metric-key">
            {duplicateRun ? "SHA-256 SEEN · HALT" : "FI→EN · DISPATCHED"}
          </span>
          <p>
            {duplicateRun
              ? "Digest 9f3c…81a matches state ledger. Zero duplicate pings."
              : "“Forest excursion Friday—pack rain gear.” → Telegram · Mail"}
          </p>
        </div>
      </div>
    </div>
  );
}

// 05 / QParking — Capital-Region Errand Tariff Scale
const DURATIONS = [
  { label: "30 min", hours: 0.5 },
  { label: "1 hr", hours: 1 },
  { label: "2 hr", hours: 2 },
] as const;

const ZONES = [
  { zone: "HKI Zone 1", area: "Kamppi / Kruununhaka", rate: 4.0 },
  { zone: "HKI Zone 2", area: "Töölö / Kallio", rate: 2.0 },
  { zone: "Espoo / Vantaa", area: "Tapiola / Tikkurila", rate: 1.0 },
] as const;

function QParkingSpecimen() {
  const [durIdx, setDurIdx] = useState(1);
  const duration = DURATIONS[durIdx];

  return (
    <div className="micro-specimen" aria-label="Parking zone rate comparison">
      <div className="specimen-toolbar">
        <span className="specimen-mono-label">ERRAND WINDOW</span>
        <div className="specimen-seg" role="group" aria-label="Parking duration">
          {DURATIONS.map((d, idx) => (
            <button
              key={d.label}
              type="button"
              aria-pressed={durIdx === idx}
              className={durIdx === idx ? "is-active" : ""}
              onClick={() => setDurIdx(idx)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="parking-zones">
        {ZONES.map((z) => (
          <div key={z.zone} className="parking-zone-row">
            <div>
              <strong>{z.zone}</strong>
              <span>{z.area}</span>
            </div>
            <span className="parking-cost">
              €{(z.rate * duration.hours).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectMicroSpecimen({ projectId }: { projectId: ProjectId }) {
  switch (projectId) {
    case "cnequity":
      return <CnEquitySpecimen />;
    case "arkiwatch":
      return <ArkiWatchSpecimen />;
    case "suomeksi":
      return <SuomeksiSpecimen />;
    case "daisynotice":
      return <DaisyNoticeSpecimen />;
    case "qparking":
      return <QParkingSpecimen />;
  }
}
