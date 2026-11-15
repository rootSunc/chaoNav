import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/useInView";

const MIN_WEIGHT = 300;
const MAX_WEIGHT = 900;
const PROBE_PX = 100;

type FitNameProps = {
  readonly text: string;
  readonly as?: "h2" | "p";
  readonly id?: string;
  readonly href?: string;
};

/**
 * One word set as wide as its box. It arrives thin and takes on ink as it
 * scrolls up the viewport, so at full weight it touches both edges of that box.
 */
export function FitName({ text, as: Tag = "h2", id, href }: FitNameProps) {
  const boxRef = useRef<HTMLElement | null>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;

    const fit = () => {
      const probes = box.querySelectorAll<HTMLElement>(".fit-probe");
      let widest = 0;
      probes.forEach((probe) => {
        widest = Math.max(widest, probe.getBoundingClientRect().width);
      });
      const room = box.clientWidth;
      if (widest > 0 && room > 0) {
        setFontSize(Math.floor((room / widest) * PROBE_PX * 0.992 * 10) / 10);
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    // The first pass may have measured a fallback face: fit again once the
    // real one is in, however late it arrives.
    const fonts = document.fonts;
    void fonts?.load('900 100px "Recursive Variable"', text).then(fit, fit);
    fonts?.addEventListener?.("loadingdone", fit);
    return () => {
      observer.disconnect();
      fonts?.removeEventListener?.("loadingdone", fit);
    };
  }, [text]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    if (prefersReducedMotion()) {
      box.style.setProperty("--w", String(MAX_WEIGHT - 40));
      return;
    }

    let frame = 0;
    const ink = () => {
      frame = 0;
      const rect = box.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // 0 when the word's top is at the bottom edge, 1 once it is 70% up.
      const raw = (viewport - rect.top) / (viewport * 0.7);
      const p = Math.max(0, Math.min(1, raw));
      const eased = p * p * (3 - 2 * p);
      box.style.setProperty(
        "--w",
        (MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * eased).toFixed(0),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(ink);
    };

    ink();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [fontSize]);

  const word = <span className="fit-text">{text}</span>;

  return (
    <Tag
      id={id}
      ref={(node: HTMLElement | null) => {
        boxRef.current = node;
      }}
      className="fit-name"
      style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
      data-descends={/[gjpqy]/.test(text) ? "true" : undefined}
    >
      {href ? <a href={href}>{word}</a> : word}
      <span className="fit-probe" aria-hidden="true">
        {text}
      </span>
      <span className="fit-probe fit-probe-casual" aria-hidden="true">
        {text}
      </span>
    </Tag>
  );
}
