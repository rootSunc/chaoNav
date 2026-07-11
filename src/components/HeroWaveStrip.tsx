import type { CssVars } from '../lib/cssVars';

const BAR_COUNT = 12;

type HeroWaveStripProps = {
  readonly isPlaying: boolean;
};

export function HeroWaveStrip({ isPlaying }: HeroWaveStripProps) {
  return (
    <div
      aria-hidden="true"
      className={`hero-wave-strip${isPlaying ? ' is-playing' : ''}`}
    >
      {Array.from({ length: BAR_COUNT }, (_, index) => (
        <span
          className="hero-wave-bar"
          key={index}
          style={{ '--bar-index': index } as CssVars}
        />
      ))}
    </div>
  );
}
