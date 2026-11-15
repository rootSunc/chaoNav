import { useEffect, useState, type CSSProperties } from "react";
import { FINNISH_WORDS, type Copy, type Lang } from "../../content";
import { prefersReducedMotion, useSeen } from "../../hooks/useInView";

const HOLD_WHOLE_MS = 900;
const HOLD_SPLIT_MS = 5200;

type MorphologyProps = { readonly t: Copy; readonly lang: Lang };

/** A Finnish word, whole and then taken apart: the thing Suomeksi does. */
export function Morphology({ t, lang }: MorphologyProps) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const [split, setSplit] = useState(false);
  const [hands, setHands] = useState(false); // the reader took over
  const [paused, setPaused] = useState(false);

  const entry = FINNISH_WORDS[index];

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      setSplit(true);
      return;
    }
    setSplit(false);
    const timer = window.setTimeout(() => setSplit(true), HOLD_WHOLE_MS);
    return () => window.clearTimeout(timer);
  }, [seen, index]);

  useEffect(() => {
    if (!seen || !split || hands || paused || prefersReducedMotion()) return;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % FINNISH_WORDS.length),
      HOLD_SPLIT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [seen, split, hands, paused, index]);

  return (
    <div
      className="morph"
      ref={ref}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        className="morph-stage"
        style={{ "--chars": entry.word.length } as CSSProperties}
      >
        <p
          className="morph-word"
          lang="fi"
          data-split={split ? "true" : undefined}
          key={entry.word}
          aria-label={entry.word}
        >
          {entry.parts.map((part, partIndex) => (
            <span
              className="morph-part"
              key={partIndex}
              style={{ "--i": partIndex } as CSSProperties}
            >
              <span className="morph-text" aria-hidden="true">
                {part.text}
              </span>
              <span className="morph-gloss" lang={lang === "zh" ? "zh-Hans" : "en"}>
                {part.gloss[lang]}
              </span>
            </span>
          ))}
        </p>
        <p
          className="morph-meaning"
          data-split={split ? "true" : undefined}
          style={{ "--i": entry.parts.length } as CSSProperties}
        >
          “{entry.meaning[lang]}”
        </p>
      </div>

      <div className="morph-picker" role="group" aria-label={t.morph.pick}>
        {FINNISH_WORDS.map((candidate, candidateIndex) => (
          <button
            key={candidate.word}
            type="button"
            lang="fi"
            className="text-button"
            aria-pressed={candidateIndex === index}
            onClick={() => {
              setHands(true);
              setIndex(candidateIndex);
            }}
          >
            {candidate.word}
          </button>
        ))}
      </div>
    </div>
  );
}
