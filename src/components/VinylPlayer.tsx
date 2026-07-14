import type { CSSProperties, PointerEvent, RefObject } from 'react';
import type { MusicTrack } from '../data/musicLibrary';
import type { NavigationLink } from '../data/siteContent';

type VinylPlayerProps = {
  readonly activeLink: NavigationLink;
  readonly activeTrack: MusicTrack;
  readonly isPlaying: boolean;
  readonly onNextTrack: () => void;
  readonly onPreviousTrack: () => void;
  readonly onTogglePlaying: () => void;
  readonly progressBarRef: RefObject<HTMLSpanElement | null>;
  readonly timeTextRef: RefObject<HTMLSpanElement | null>;
  readonly visualizerRef: RefObject<HTMLDivElement | null>;
  readonly dockRef?: RefObject<HTMLElement | null>;
  readonly dockStyle?: CSSProperties;
  readonly isFloating?: boolean;
  readonly onDragHandlePointerDown?: (event: PointerEvent<HTMLButtonElement>) => void;
  readonly onDragHandlePointerMove?: (event: PointerEvent<HTMLButtonElement>) => void;
  readonly onDragHandlePointerUp?: (event: PointerEvent<HTMLButtonElement>) => void;
  readonly onDragHandlePointerCancel?: (event: PointerEvent<HTMLButtonElement>) => void;
};

export function VinylPlayer({
  activeLink,
  activeTrack,
  isPlaying,
  onNextTrack,
  onPreviousTrack,
  onTogglePlaying,
  progressBarRef,
  timeTextRef,
  visualizerRef,
  dockRef,
  dockStyle,
  isFloating = false,
  onDragHandlePointerDown,
  onDragHandlePointerMove,
  onDragHandlePointerUp,
  onDragHandlePointerCancel,
}: VinylPlayerProps) {
  return (
    <section
      aria-label="Interactive resonance audio player"
      className={`player-dock ${isPlaying ? 'is-playing' : 'is-paused'}${isFloating ? ' is-floating' : ''}`}
      ref={dockRef}
      style={dockStyle}
    >
      <button
        aria-label="Drag audio player"
        className="player-dock-handle"
        onPointerCancel={onDragHandlePointerCancel}
        onPointerDown={onDragHandlePointerDown}
        onPointerMove={onDragHandlePointerMove}
        onPointerUp={onDragHandlePointerUp}
        type="button"
      >
        <span aria-hidden="true">⋮⋮</span>
      </button>

      <div className="transport-controls">
        <button
          aria-label="Previous track"
          className="transport-button"
          data-music-control="true"
          onClick={onPreviousTrack}
          type="button"
        >
          <span aria-hidden="true">◀</span>
        </button>
        <button
          aria-label={isPlaying ? 'Pause classical music' : 'Play classical music'}
          aria-pressed={isPlaying}
          className="transport-button transport-button-play"
          data-music-control="true"
          onClick={onTogglePlaying}
          type="button"
        >
          <span aria-hidden="true">{isPlaying ? 'II' : '▶'}</span>
        </button>
        <button
          aria-label="Next track"
          className="transport-button"
          data-music-control="true"
          onClick={onNextTrack}
          type="button"
        >
          <span aria-hidden="true">▶</span>
        </button>
      </div>

      <div aria-live="polite" className="player-display">
        <div className="player-display-top">
          <span className="player-kicker">{isPlaying ? 'NOW SPINNING' : 'READY TO SPIN'}</span>
          <span className="player-time" ref={timeTextRef}>
            00:00
          </span>
        </div>
        <div className="player-display-bottom">
          <span className="display-line">
            {activeTrack.composer} / {activeTrack.title}
          </span>
          <div aria-hidden="true" className="visualizer" ref={visualizerRef}>
            {Array.from({ length: 5 }, (_, index) => (
              <span className="visualizer-bar" key={index} />
            ))}
          </div>
        </div>
        <span className="player-progress">
          <span ref={progressBarRef} />
        </span>
      </div>

      <span className="sr-only">
        {isPlaying ? 'LIVE' : 'IDLE'} / {activeTrack.title} / {activeLink.label}
      </span>
    </section>
  );
}
