import { useMemo } from "react";
import { useSeen } from "../hooks/useInView";

type ScribbleProps = {
  readonly className?: string;
  /** Same seed, same line: each rule keeps its own hand across renders. */
  readonly seed: number;
  /** Viewbox height; the line wanders inside it. */
  readonly height?: number;
  /** How far the pen strays from straight, in viewbox units. */
  readonly wobble?: number;
  /** How much the line climbs from left to right. */
  readonly rise?: number;
};

/** A ballpoint line that draws itself the first time it scrolls into view. */
export function Scribble({
  className,
  seed,
  height = 6,
  wobble = 1.6,
  rise = 0,
}: ScribbleProps) {
  const [ref, seen] = useSeen<SVGSVGElement>("0px");
  const d = useMemo(
    () => scribblePath(seed, height, wobble, rise),
    [seed, height, wobble, rise],
  );

  return (
    <svg
      ref={ref}
      className={className ? `scribble ${className}` : "scribble"}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-drawn={seen ? "true" : undefined}
    >
      <path d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A wandering line through jittered points, smoothed with Catmull-Rom curves. */
export function scribblePath(
  seed: number,
  height: number,
  wobble: number,
  rise: number,
) {
  const next = random(seed);
  const count = 14;
  const phase = next() * Math.PI * 2;
  const mid = height / 2;

  const points = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const x = t * 100 + (i > 0 && i < count - 1 ? (next() - 0.5) * 3 : 0);
    const drift = Math.sin(t * Math.PI * 1.4 + phase) * wobble * 0.6;
    const y = mid + rise * (0.5 - t) + drift + (next() - 0.5) * wobble;
    return [x, y] as const;
  });

  const f = (n: number) => n.toFixed(2);
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < count - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d +=
      ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)}` +
      ` ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** A stable seed from a string, so a chapter's rule keeps its shape. */
export function seedOf(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}
