import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/useInView";

/**
 * "Moi," written by hand: a ballpoint traces each stroke and the letters
 * appear behind its tip. Strokes are centerlines in a 145 × 100 box with the
 * baseline at y = 80, in the order a hand would write them.
 */
const STROKES = [
  // M, run straight into o, then up and over into the i stem with an exit flick.
  "M10 82 C12 60 15 30 20 12 C26 30 32 50 36 62 C42 45 48 25 54 12" +
    " C58 35 60 60 62 80 C66 66 80 46 92 48 C84 48 79 56 79 64" +
    " C79 73 85 80 92 80 C99 80 105 73 105 64 C105 55 99 47 90 49" +
    " C100 46 110 47 116 48 C116 60 115 72 117 80 C119 83 124 79 128 74",
  // The dot on the i: a quick dab.
  "M116.5 31.5 C117.3 30.6 118.3 30.4 119.2 30.6",
  // The comma.
  "M139 73 C142 78 140 88 132 96",
] as const;

/** Pen speed in viewbox units per millisecond, and the lift between strokes. */
const SPEED = 0.32;
const LIFT_MS = 170;

const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

type PenGreetingProps = { readonly text: string };

export function PenGreeting({ text }: PenGreetingProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const pen = penRef.current;
    if (!svg || !pen) return;
    const paths = [...svg.querySelectorAll<SVGPathElement>(".pen-stroke")];

    const finish = () => {
      for (const path of paths) path.style.strokeDasharray = "none";
      pen.style.opacity = "0";
    };

    if (prefersReducedMotion() || typeof paths[0]?.getTotalLength !== "function") {
      finish();
      return;
    }

    const lengths = paths.map((path) => path.getTotalLength());
    paths.forEach((path, i) => {
      path.style.strokeDasharray = `${lengths[i]} ${lengths[i]}`;
      path.style.strokeDashoffset = `${lengths[i]}`;
    });

    // The timeline: write a stroke, lift and travel to the next, then put the pen away.
    type Leg =
      | { kind: "write"; index: number; ms: number }
      | { kind: "travel"; from: DOMPoint; to: DOMPoint; ms: number };
    const legs: Leg[] = [];
    paths.forEach((path, i) => {
      if (i > 0) {
        legs.push({
          kind: "travel",
          from: paths[i - 1].getPointAtLength(lengths[i - 1]),
          to: path.getPointAtLength(0),
          ms: LIFT_MS,
        });
      }
      legs.push({ kind: "write", index: i, ms: Math.max(140, lengths[i] / SPEED) });
    });

    const place = (x: number, y: number, lift = 0) => {
      pen.setAttribute("transform", `translate(${x + lift * 6} ${y - lift * 10})`);
    };
    const start = paths[0].getPointAtLength(0);
    place(start.x, start.y, 1);

    let frame = 0;
    let begun = 0;
    const total = legs.reduce((sum, leg) => sum + leg.ms, 0);
    const AWAY_MS = 520;

    const tick = (now: number) => {
      if (!begun) begun = now;
      let elapsed = now - begun;

      if (elapsed >= total) {
        const t = Math.min(1, (elapsed - total) / AWAY_MS);
        const end = paths[paths.length - 1].getPointAtLength(lengths[lengths.length - 1]);
        place(end.x + t * 18, end.y, easeInOut(t) * 3);
        pen.style.opacity = String(1 - t);
        if (t < 1) frame = requestAnimationFrame(tick);
        else finish();
        return;
      }

      for (const leg of legs) {
        if (elapsed > leg.ms) {
          if (leg.kind === "write") paths[leg.index].style.strokeDashoffset = "0";
          elapsed -= leg.ms;
          continue;
        }
        const t = elapsed / leg.ms;
        if (leg.kind === "write") {
          const drawn = easeInOut(t) * lengths[leg.index];
          paths[leg.index].style.strokeDashoffset = `${lengths[leg.index] - drawn}`;
          const tip = paths[leg.index].getPointAtLength(drawn);
          place(tip.x, tip.y);
        } else {
          const e = easeInOut(t);
          place(
            leg.from.x + (leg.to.x - leg.from.x) * e,
            leg.from.y + (leg.to.y - leg.from.y) * e,
            Math.sin(Math.PI * t),
          );
        }
        break;
      }
      frame = requestAnimationFrame(tick);
    };

    // Wait for the typeface, like the rest of the opening, then a breath.
    const root = document.documentElement;
    const waitForReady = () => {
      if (root.classList.contains("ready")) {
        pen.style.opacity = "1";
        window.setTimeout(() => {
          frame = requestAnimationFrame(tick);
        }, 260);
      } else frame = requestAnimationFrame(waitForReady);
    };
    frame = requestAnimationFrame(waitForReady);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <span className="greet">
      <span className="visually-hidden">{text}</span>
      <svg
        ref={svgRef}
        className="pen-greeting"
        viewBox="0 0 145 100"
        aria-hidden="true"
      >
        {STROKES.map((d) => (
          <path key={d} className="pen-stroke" d={d} />
        ))}
        <g ref={penRef} className="pen" style={{ opacity: 0 }}>
          <g transform="rotate(-58)">
            <path className="pen-tip" d="M0 0 L9 -2.6 L9 2.6 Z" />
            <rect className="pen-grip" x="9" y="-4.2" width="17" height="8.4" rx="1.5" />
            <rect className="pen-body" x="26" y="-4.6" width="62" height="9.2" rx="2" />
            <rect className="pen-clip" x="62" y="-7.4" width="22" height="2.6" rx="1.2" />
          </g>
        </g>
      </svg>
    </span>
  );
}
