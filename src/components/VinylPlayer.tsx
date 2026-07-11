import { Suspense, lazy } from 'react';
import type { RefObject } from 'react';
import type { MusicTrack } from '../data/musicLibrary';
import type { NavigationLink } from '../data/siteContent';
import type { SceneQuality } from '../hooks/useSceneQuality';
import { SceneErrorBoundary } from './scene/SceneErrorBoundary';

const VinylStageCanvas = lazy(() =>
  import('./scene/VinylStageCanvas').then((module) => ({
    default: module.VinylStageCanvas,
  })),
);

type VinylPlayerProps = {
  readonly activeLink: NavigationLink;
  readonly activeTrack: MusicTrack;
  readonly isPlaying: boolean;
  readonly onNextTrack: () => void;
  readonly onPreviousTrack: () => void;
  readonly onTogglePlaying: () => void;
  readonly progressBarRef: RefObject<HTMLSpanElement | null>;
  readonly sceneQuality: SceneQuality;
  readonly timeTextRef: RefObject<HTMLSpanElement | null>;
  readonly vinylStage: boolean;
  readonly visualizerRef: RefObject<HTMLDivElement | null>;
};

function ClassicGramophoneStage({
  isPlaying,
  onTogglePlaying,
}: {
  readonly isPlaying: boolean;
  readonly onTogglePlaying: () => void;
}) {
  return (
    <div className="gramophone-frame">
      <img
        alt="Vintage gramophone with a record player base"
        className="gramophone-image"
        src="/images/gramophone.png"
      />
      <div className="record-stage">
        <button
          aria-label={isPlaying ? 'Pause classical music' : 'Play classical music'}
          aria-pressed={isPlaying}
          className="record-control"
          data-music-control="true"
          onClick={onTogglePlaying}
          type="button"
        />
      </div>
    </div>
  );
}

export function VinylPlayer({
  activeLink,
  activeTrack,
  isPlaying,
  onNextTrack,
  onPreviousTrack,
  onTogglePlaying,
  progressBarRef,
  sceneQuality,
  timeTextRef,
  vinylStage,
  visualizerRef,
}: VinylPlayerProps) {
  const showVinylStage = vinylStage && sceneQuality !== 'off';

  return (
    <section
      aria-label="Vinyl navigation player"
      className={`player-panel ${isPlaying ? 'is-playing' : 'is-paused'}${showVinylStage ? ' has-vinyl-stage' : ''}`}
    >
      <div className="player-card">
        {showVinylStage ? (
          <Suspense fallback={<ClassicGramophoneStage isPlaying={isPlaying} onTogglePlaying={onTogglePlaying} />}>
            <SceneErrorBoundary
              fallback={<ClassicGramophoneStage isPlaying={isPlaying} onTogglePlaying={onTogglePlaying} />}
              label="vinyl-stage"
            >
              <VinylStageCanvas
                activeLinkId={activeLink.id}
                activeLinkLabel={activeLink.label}
                isPlaying={isPlaying}
                onTogglePlaying={onTogglePlaying}
                quality={sceneQuality}
              />
            </SceneErrorBoundary>
          </Suspense>
        ) : (
          <ClassicGramophoneStage isPlaying={isPlaying} onTogglePlaying={onTogglePlaying} />
        )}

        <div aria-label="Small track player" className="mini-player">
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
              aria-label={isPlaying ? 'Pause track playback' : 'Play track playback'}
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
        </div>
      </div>

      <span className="sr-only">
        {isPlaying ? 'PLAY' : 'CUE'} / {activeTrack.title} / {activeLink.label}
      </span>
    </section>
  );
}
