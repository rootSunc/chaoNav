import { useEffect, useMemo, useState } from "react";
import type { Copy } from "../../content";
import { prefersReducedMotion, useSeen } from "../../hooks/useInView";

type Tier = "A" | "B" | "C";
type Segment = { readonly from: number; readonly to: number; readonly tier: Tier };

const W = 600;
const H = 200;
const N = 120;
const SEGMENTS: readonly Segment[] = [
  { from: 0, to: 43, tier: "A" },
  { from: 43, to: 66, tier: "B" },
  { from: 79, to: 103, tier: "A" },
  { from: 103, to: N - 1, tier: "C" },
];
const GAP = { from: 66, to: 79 };
const DRAW_MS = 2200;

// A fixed synthetic walk. It is a drawing of the idea, not a price series.
function walk(): readonly number[] {
  let seed = 20261115;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const raw: number[] = [];
  let y = 0;
  for (let i = 0; i < N; i += 1) {
    y += random() - 0.44;
    raw.push(y);
  }
  // Light smoothing, then stretch to fill the plot from 10% to 90%.
  const smooth = raw.map(
    (_, i) => (raw[Math.max(0, i - 1)] + raw[i] + raw[Math.min(N - 1, i + 1)]) / 3,
  );
  const low = Math.min(...smooth);
  const high = Math.max(...smooth);
  return smooth.map((value) => 0.1 + (0.8 * (value - low)) / (high - low));
}

const x = (i: number) => (i / (N - 1)) * W;

export function TierLine({ t }: { readonly t: Copy }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const [progress, setProgress] = useState(0);
  const [focusTier, setFocusTier] = useState<Tier | null>(null);

  const values = useMemo(walk, []);
  const y = (i: number) => H - 24 - values[i] * (H - 56);

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const started = performance.now() + 250;
    const tick = (now: number) => {
      const k = Math.max(0, Math.min(1, (now - started) / DRAW_MS));
      setProgress(k);
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen]);

  const path = ({ from, to }: Segment) => {
    let d = "";
    for (let i = from; i <= to; i += 1) {
      d += `${i === from ? "M" : "L"}${x(i).toFixed(1)} ${y(i).toFixed(1)}`;
    }
    return d;
  };

  const gapX0 = x(GAP.from);
  const gapX1 = x(GAP.to);
  const gapShown = progress * W > gapX1;

  const pct = (value: number, of: number) => `${((value / of) * 100).toFixed(2)}%`;

  return (
    <div className="tierline" ref={ref}>
      <div
        className="tierline-plot"
        role="img"
        aria-label={`${t.tiers.rows.map((row) => `${row.tier}: ${row.name}`).join(", ")}. ${t.tiers.gap}.`}
      >
        <div
          className="tierline-layer"
          style={{ clipPath: `inset(-20px ${((1 - progress) * 100).toFixed(2)}% -20px 0)` }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <line className="tierline-base" x1="0" x2={W} y1={H - 10} y2={H - 10} />
            {SEGMENTS.map((segment) => (
              <g
                key={segment.from}
                className="tierline-seg"
                data-tier={segment.tier}
                data-dim={
                  focusTier && focusTier !== segment.tier ? "true" : undefined
                }
              >
                <line
                  className="tierline-tick"
                  x1={x(segment.from)}
                  x2={x(segment.from)}
                  y1={26}
                  y2={H - 10}
                />
                <path d={path(segment)} />
              </g>
            ))}
          </svg>
          {SEGMENTS.map((segment) => (
            <span
              key={segment.from}
              className="tierline-mark mono"
              style={{ left: pct(x(segment.from), W) }}
              data-dim={
                focusTier && focusTier !== segment.tier ? "true" : undefined
              }
            >
              {segment.tier}
            </span>
          ))}
          {[GAP.from, GAP.to].map((i) => (
            <i
              key={i}
              className="tierline-end"
              style={{ left: pct(x(i), W), top: pct(y(i), H) }}
            />
          ))}
        </div>

        <span
          className="tierline-gap mono"
          data-shown={gapShown ? "true" : undefined}
          style={{ left: pct(gapX0, W), width: pct(gapX1 - gapX0, W) }}
        >
          <span>{t.tiers.gap}</span>
        </span>
      </div>

      <ul className="tierline-legend">
        {t.tiers.rows.map((row) => (
          <li
            key={row.tier}
            data-tier={row.tier}
            tabIndex={0}
            onPointerEnter={() => setFocusTier(row.tier as Tier)}
            onPointerLeave={() => setFocusTier(null)}
            onFocus={() => setFocusTier(row.tier as Tier)}
            onBlur={() => setFocusTier(null)}
          >
            <svg viewBox="0 0 44 8" aria-hidden="true" className="tierline-key">
              <path d="M1 4H43" data-tier={row.tier} />
            </svg>
            <span className="tierline-grade mono">{row.tier}</span>
            <span className="tierline-name">{row.name}</span>
            <span className="tierline-body">{row.body}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
