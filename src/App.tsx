import { useRef, useState, type CSSProperties } from 'react';
import {
  siteContent,
  type NavigationLink,
  type TerminalAction,
  type TerminalLine,
} from './profile';

const CHORUS_AUDIO_SRC = '/audio/fight-song-chorus.mp3';

function LinkText({ link }: { link: NavigationLink }) {
  return (
    <>
      {link.label}
      {link.external ? (
        <span className="external-mark" aria-hidden="true">
          ↗
        </span>
      ) : null}
    </>
  );
}

function DestinationTab({
  index,
  link,
  selected,
  onSelect,
}: {
  index: number;
  link: NavigationLink;
  selected: boolean;
  onSelect: () => void;
}) {
  const style = { '--item-index': index } as CSSProperties;

  return (
    <button
      aria-controls="terminal-output"
      aria-label={link.label}
      aria-selected={selected}
      className="track-tab"
      data-command={link.command}
      id={`tab-${link.id}`}
      onClick={onSelect}
      role="tab"
      style={style}
      type="button"
    >
      <span className="tab-index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="tab-copy">
        <span className="tab-label">
          <LinkText link={link} />
        </span>
        <span className="tab-command" aria-hidden="true">
          {link.command}
        </span>
      </span>
      <span className="tab-cue" aria-hidden="true" />
    </button>
  );
}

function TerminalEntry({ line, index }: { line: TerminalLine; index: number }) {
  const style = { '--line-index': index } as CSSProperties;

  if (line.kind === 'link') {
    return (
      <p className="terminal-line" style={style}>
        <a
          aria-label={line.external ? `${line.label} opens external site` : line.label}
          href={line.href}
          rel={line.external ? 'noreferrer' : undefined}
          target={line.external ? '_blank' : undefined}
        >
          {line.text}
        </a>
      </p>
    );
  }

  return (
    <p className="terminal-line" style={style}>
      {line.text}
    </p>
  );
}

function TerminalActionLink({ action }: { action: TerminalAction }) {
  return (
    <a
      aria-label={action.external ? `${action.label} opens external site` : action.label}
      className="terminal-action"
      href={action.href}
      rel={action.external ? 'noreferrer' : undefined}
      target={action.external ? '_blank' : undefined}
    >
      <span>{action.label}</span>
      {action.external ? (
        <span className="external-mark" aria-hidden="true">
          ↗
        </span>
      ) : null}
    </a>
  );
}

function VinylPlayer({
  activeIndex,
  activeLink,
  isPlaying,
  onNextTrack,
  onPreviousTrack,
  onTogglePlaying,
}: {
  activeIndex: number;
  activeLink: NavigationLink;
  isPlaying: boolean;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
  onTogglePlaying: () => void;
}) {
  const style = {
    '--active-index': activeIndex,
    '--tonearm-rotation': `${-20 + activeIndex * 4.7}deg`,
  } as CSSProperties;

  return (
    <section
      className={isPlaying ? 'player-panel is-playing' : 'player-panel is-paused'}
      aria-label="Vinyl navigation player"
      style={style}
    >
      <div className="turntable">
        <div className="record-stage">
          <button
            aria-label={isPlaying ? 'Pause Fight Song chorus' : 'Play Fight Song chorus'}
            aria-pressed={isPlaying}
            className="record-control"
            onClick={onTogglePlaying}
            type="button"
          >
            <span className={isPlaying ? 'record is-playing' : 'record'} aria-hidden="true">
              <span className="record-highlight" />
              <span className="record-label" />
              <span className="record-pin" />
            </span>
          </button>
        </div>
        <div className="tonearm" aria-hidden="true">
          <span className="tonearm-pivot" />
          <span className="tonearm-beam" />
          <span className="tonearm-head" />
        </div>
        <span className="deck-line deck-line-top" aria-hidden="true" />
        <span className="deck-line deck-line-bottom" aria-hidden="true" />
      </div>

      <div className="mini-player" aria-label="Small track player">
        <button
          aria-label="Previous track"
          className="transport-button transport-button-previous"
          onClick={onPreviousTrack}
          type="button"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div className="player-display" aria-live="polite">
          <span className="display-line">
            {isPlaying ? 'PLAY' : 'CUE'} / Fight Song / {activeLink.label}
          </span>
        </div>
        <button
          aria-label="Next track"
          className="transport-button transport-button-next"
          onClick={onNextTrack}
          type="button"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="player-meta" aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        <span>{activeLink.command}</span>
      </div>
    </section>
  );
}

export default function App() {
  const { profile, links, initialLinkId } = siteContent;
  const [selectedLinkId, setSelectedLinkId] = useState(initialLinkId);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeLink = links.find((link) => link.id === selectedLinkId) ?? links[0];
  const activeIndex = Math.max(
    0,
    links.findIndex((link) => link.id === activeLink.id),
  );
  const emailLink = links.find((link) => link.id === 'email') ?? links[0];
  const projectsLink = links.find((link) => link.id === 'projects') ?? links[0];

  function handleTogglePlaying() {
    const audio = audioRef.current;

    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    const playAttempt = audio?.play();

    if (playAttempt) {
      void playAttempt.catch(() => undefined);
    }
  }

  function selectRelativeTrack(direction: 1 | -1) {
    const nextIndex = (activeIndex + direction + links.length) % links.length;
    setSelectedLinkId(links[nextIndex].id);
  }

  return (
    <main className="experience-shell" id="profile">
      <audio
        aria-label="Fight Song chorus background audio"
        loop
        preload="auto"
        ref={audioRef}
        src={CHORUS_AUDIO_SRC}
      />
      <div className="ambient-scene" aria-hidden="true">
        <span className="ambient-grid" />
        <span className="ambient-sweep" />
      </div>

      <header className="site-header" aria-label="Site header">
        <a className="wordmark" href="#profile" aria-label="Chao home">
          Chao
        </a>
        <span className="header-status">Personal navigator</span>
        <a className="header-contact" href={emailLink.href}>
          Contact
        </a>
      </header>

      <section className="hero" aria-labelledby="site-title">
        <div className="hero-copy">
          <p className="eyebrow">Personal index</p>
          <h1 id="site-title">{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <p className="descriptor">{profile.descriptor}</p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="hero-action hero-action-primary" href={emailLink.href}>
              Email
            </a>
            <button
              className="hero-action hero-action-secondary"
              onClick={() => setSelectedLinkId(projectsLink.id)}
              type="button"
            >
              Projects
            </button>
          </div>
        </div>

        <VinylPlayer
          activeIndex={activeIndex}
          activeLink={activeLink}
          isPlaying={isPlaying}
          onNextTrack={() => selectRelativeTrack(1)}
          onPreviousTrack={() => selectRelativeTrack(-1)}
          onTogglePlaying={handleTogglePlaying}
        />
      </section>

      <section className="workspace" aria-label="Navigation workspace">
        <nav className="primary-nav" aria-label="Primary destinations">
          <div className="nav-heading" aria-hidden="true">
            <span>Tracks</span>
            <span>{String(links.length).padStart(2, '0')} destinations</span>
          </div>
          <div className="primary-tabs" role="tablist">
            {links.map((link, index) => (
              <DestinationTab
                index={index}
                key={link.id}
                link={link}
                onSelect={() => setSelectedLinkId(link.id)}
                selected={link.id === activeLink.id}
              />
            ))}
          </div>
        </nav>

        <section
          aria-label="Terminal output"
          aria-live="polite"
          className="terminal"
          id="terminal-output"
          role="region"
        >
          <div className="terminal-chrome">
            <p className="terminal-path">session://chao/{activeLink.id}</p>
            <p className="terminal-link-state">linked to {activeLink.label}</p>
          </div>
          <div className="terminal-content" key={activeLink.id}>
            <p className="terminal-command">
              <span aria-hidden="true">&gt;</span>
              <span className="command-text">{activeLink.command}</span>
            </p>
            <div className="terminal-body">
              <p className="terminal-target">target: {activeLink.target}</p>
              {activeLink.lines.map((line, index) => (
                <TerminalEntry key={line.text} line={line} index={index} />
              ))}
              {activeLink.actions.length > 0 ? (
                <div
                  className="terminal-actions"
                  style={{ '--line-index': activeLink.lines.length } as CSSProperties}
                >
                  {activeLink.actions.map((action) => (
                    <TerminalActionLink action={action} key={action.href} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
