import { useRef, type PointerEvent } from "react";
import { MUSIC_LIBRARY } from "../data/musicLibrary";
import type { CadenceArtifactId } from "../data/siteContent";
import type { useMusicPlayer } from "../hooks/useMusicPlayer";
import { Glyph } from "./CardIcons";

type ScorePlayerProps = {
  readonly player: ReturnType<typeof useMusicPlayer>;
  readonly isResonant?: boolean;
  readonly isDimmed?: boolean;
  readonly onHoverCadence?: (id: CadenceArtifactId | null) => void;
  readonly registerRef?: (el: HTMLElement | null) => void;
};

function formatDuration(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function buildHarmonicStems(seed: number): readonly {
  readonly x: number;
  readonly y1: number;
  readonly y2: number;
}[] {
  return Array.from({ length: 48 }, (_, i) => {
    const t = i / 47;
    const waveA = Math.sin(t * Math.PI * (3 + seed * 0.9) + seed);
    const waveB = Math.cos(t * Math.PI * (7 + seed * 1.3) - seed * 0.6);
    const envelope = 0.35 + 0.65 * Math.sin(t * Math.PI);
    const amp = (6 + ( Math.abs(waveA) * 11 + Math.abs(waveB) * 7 )) * envelope;
    const center = 28 + waveA * 4;
    return {
      x: 6 + i * (308 / 47),
      y1: Math.max(4, center - amp),
      y2: Math.min(52, center + amp),
    };
  });
}

const SHORT_NAMES = [
  "Bach",
  "Rachmaninoff",
  "Vivaldi",
  "Beethoven",
  "Swan Lake",
  "Nutcracker",
] as const;

export function ScorePlayer({
  player,
  isResonant = false,
  isDimmed = false,
  onHoverCadence,
  registerRef,
}: ScorePlayerProps) {
  const track = MUSIC_LIBRARY[player.trackIndex];
  const stems = buildHarmonicStems(track.contourSeed);
  const svgRef = useRef<SVGSVGElement | null>(null);

  function handleScoreClick(event: PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const ratio = (event.clientX - rect.left) / rect.width;
    player.seekToRatio(ratio);
    if (!player.isPlaying) {
      player.togglePlaying();
    }
  }

  return (
    <section
      ref={registerRef}
      data-cadence-id="score"
      data-music-control="true"
      aria-label="Music player"
      className={`cadence-specimen score-specimen ${player.isPlaying ? "is-playing" : ""} ${isResonant ? "is-resonant" : ""} ${isDimmed ? "is-dimmed" : ""}`}
      onPointerEnter={() => onHoverCadence?.("score")}
      onPointerLeave={() => onHoverCadence?.(null)}
    >
      <div className="cadence-topline">
        <span className="specimen-mono-label">
          ACOUSTIC SCORE · {player.isPlaying ? "IN MOTION" : "AT REST"}
        </span>
        <span className="specimen-catalogue">
          {track.catalogue} ·{" "}
          {player.durationSeconds > 0
            ? `${formatDuration(player.elapsedSeconds)} / ${formatDuration(player.durationSeconds)}`
            : formatDuration(player.elapsedSeconds)}
        </span>
      </div>

      <div className="score-header" aria-live="polite">
        <div className="score-meta">
          <h3>{track.composer}</h3>
          <p>{track.title}</p>
          <span className="score-tempo">{track.tempo}</span>
        </div>

        <div className="score-transport">
          <button
            type="button"
            className="transport-icon-btn"
            aria-label="Previous track"
            onClick={() => player.selectRelativeTrack(-1)}
          >
            <Glyph name="previous" />
          </button>
          <button
            type="button"
            className="transport-play-btn"
            aria-label={
              player.isPlaying
                ? "Pause classical music"
                : "Play classical music"
            }
            aria-pressed={player.isPlaying}
            onClick={player.togglePlaying}
          >
            <Glyph name={player.isPlaying ? "pause" : "play"} />
          </button>
          <button
            type="button"
            className="transport-icon-btn"
            aria-label="Next track"
            onClick={() => player.selectRelativeTrack(1)}
          >
            <Glyph name="next" />
          </button>
        </div>
      </div>

      <div className="score-staff-frame">
        <svg
          ref={svgRef}
          className="score-staff-svg"
          viewBox="0 0 320 56"
          onPointerDown={handleScoreClick}
          aria-hidden="true"
        >
          {[12, 20, 28, 36, 44].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="320"
              y2={y}
              className="staff-rule"
            />
          ))}
          {[80, 160, 240].map((barX) => (
            <line
              key={barX}
              x1={barX}
              y1="10"
              x2={barX}
              y2="46"
              className="staff-measure-bar"
            />
          ))}
          {stems.map((s, idx) => (
            <line
              key={idx}
              x1={s.x.toFixed(1)}
              y1={s.y1.toFixed(1)}
              x2={s.x.toFixed(1)}
              y2={s.y2.toFixed(1)}
              className="staff-stem"
            />
          ))}
          <line
            ref={player.playheadRef}
            x1="0"
            y1="4"
            x2="0"
            y2="52"
            className="staff-playhead"
          />
        </svg>
        <div className="score-progress-rail" aria-hidden="true">
          <span ref={player.progressBarRef} />
        </div>
      </div>

      <div className="score-repertoire" role="group" aria-label="Repertoire">
        {MUSIC_LIBRARY.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={player.trackIndex === idx}
            className={player.trackIndex === idx ? "is-selected" : ""}
            onClick={() => player.selectTrack(idx)}
          >
            {SHORT_NAMES[idx] ?? item.composer}
          </button>
        ))}
      </div>
    </section>
  );
}
