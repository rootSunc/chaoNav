import { useEffect, useMemo, useState } from "react";
import { LAKE_TIERS, type Copy } from "../../content";
import { prefersReducedMotion, useSeen } from "../../hooks/useInView";

const TOTAL = LAKE_TIERS.reduce((sum, tier) => sum + tier.length, 0);
const STEP_MS = 30;

/** CNEquity's whole registry as a unit chart: `cne run daily` fills the lake. */
export function LakeGrid({ t }: { readonly t: Copy }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const [run, setRun] = useState(0);
  const [filled, setFilled] = useState(0);
  const [pointed, setPointed] = useState<string | null>(null);

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      setFilled(TOTAL);
      return;
    }
    setFilled(0);
    let count = 0;
    let timer = 0;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        count += 1;
        setFilled(count);
        if (count >= TOTAL) window.clearInterval(timer);
      }, STEP_MS);
    }, 650);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [seen, run]);

  const offsets = useMemo(() => {
    let sum = 0;
    return LAKE_TIERS.map((tier) => {
      const start = sum;
      sum += tier.length;
      return start;
    });
  }, []);

  const summary = LAKE_TIERS.map(
    (tier, index) => `${t.lake.tiers[index]} ${tier.length}`,
  ).join(", ");

  return (
    <div className="lake" ref={ref} data-running={seen ? "true" : undefined}>
      <div className="lake-head mono">
        <span className="lake-cmd" key={run} aria-hidden="true">
          <span className="lake-prompt">$</span>
          <span className="lake-typed">cne run daily</span>
        </span>
        <span className="lake-readout" aria-live="off">
          {pointed ?? (filled >= TOTAL ? t.lake.done : t.lake.count(filled))}
        </span>
      </div>

      <div
        className="lake-rows"
        role="img"
        aria-label={`${t.lake.done}: ${summary}`}
        onPointerLeave={() => setPointed(null)}
      >
        {LAKE_TIERS.map((tier, tierIndex) => (
          <div className="lake-row" key={tierIndex}>
            <span className="lake-tier mono">L{tierIndex}</span>
            <span className="lake-tier-name">{t.lake.tiers[tierIndex]}</span>
            <span className="lake-cells">
              {tier.map((name, cellIndex) => {
                const order = offsets[tierIndex] + cellIndex;
                const label = `L${tierIndex} · ${name}`;
                return (
                  <i
                    key={name}
                    className="lake-cell"
                    data-on={order < filled ? "true" : undefined}
                    data-fresh={order === filled - 1 && filled < TOTAL ? "true" : undefined}
                    data-pointed={pointed === label ? "true" : undefined}
                    onPointerEnter={() => setPointed(label)}
                    onPointerDown={() => setPointed(label)}
                  />
                );
              })}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="text-button"
        onClick={() => setRun((n) => n + 1)}
        disabled={!seen || filled < TOTAL}
      >
        {t.lake.run}
      </button>
    </div>
  );
}
