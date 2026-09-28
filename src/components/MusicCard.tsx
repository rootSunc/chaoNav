import { Glyph } from "./CardIcons";
import { MUSIC_LIBRARY } from "../data/musicLibrary";
import type { useMusicPlayer } from "../hooks/useMusicPlayer";

export function MusicCard({
  player,
}: {
  player: ReturnType<typeof useMusicPlayer>;
}) {
  const track = MUSIC_LIBRARY[player.trackIndex];
  return (
    <section
      className={`orbit-card music-card ${player.isPlaying ? "is-playing" : ""}`}
      aria-label="Music player"
      data-music-control="true"
    >
      <div className="card-topline">
        <span className="eyebrow">
          <Glyph name="headphones" />{" "}
          {player.isPlaying ? "NOW PLAYING" : "ON REPEAT"}
        </span>
        <span className="equalizer" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="record-wrap">
        <div className="vinyl-record">
          <div className="record-label">
            <span>c.</span>
            <small>SIDE A</small>
          </div>
        </div>
      </div>
      <div className="music-meta" aria-live="polite">
        <h3>{track.composer}</h3>
        <p title={track.title}>{track.title}</p>
      </div>
      <div className="music-controls">
        <button
          className="icon-button"
          aria-label="Previous track"
          onClick={() => player.selectRelativeTrack(-1)}
        >
          <Glyph name="previous" />
        </button>
        <button
          className="play-button"
          aria-label={
            player.isPlaying ? "Pause classical music" : "Play classical music"
          }
          aria-pressed={player.isPlaying}
          onClick={player.togglePlaying}
        >
          <Glyph name={player.isPlaying ? "pause" : "play"} />
        </button>
        <button
          className="icon-button"
          aria-label="Next track"
          onClick={() => player.selectRelativeTrack(1)}
        >
          <Glyph name="next" />
        </button>
      </div>
      <div className="music-progress">
        <span ref={player.progressBarRef} />
      </div>
    </section>
  );
}
