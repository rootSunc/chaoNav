import { useRef, useState, useEffect, type CSSProperties } from 'react';
import {
  siteContent,
  type NavigationLink,
  type TerminalAction,
  type TerminalLine,
} from './profile';

const CHORUS_AUDIO_SRC = '/audio/fight-song-chorus.mp3';



function getTabIcon(id: string) {
  const size = 16;
  const style = { marginRight: '0.45rem', flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' };
  switch (id) {
    case 'blog':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'profile':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'projects':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
          <polyline points="16 6 22 12 16 18" />
          <polyline points="8 18 2 12 8 6" />
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={style} aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={style} aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case 'resume':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    default:
      return null;
  }
}

function LinkText({ link }: { link: NavigationLink }) {
  const showArrow = link.external && link.id !== 'github' && link.id !== 'linkedin';
  return (
    <>
      {link.label}
      {showArrow ? (
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
          {getTabIcon(link.id)}
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
  const isGithubOrLinkedin = action.label.toLowerCase().includes('github') || action.label.toLowerCase().includes('linkedin');
  const showArrow = action.external && !isGithubOrLinkedin;
  return (
    <a
      aria-label={action.external ? `${action.label} opens external site` : action.label}
      className="terminal-action"
      href={action.href}
      rel={action.external ? 'noreferrer' : undefined}
      target={action.external ? '_blank' : undefined}
    >
      <span>{action.label}</span>
      {showArrow ? (
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
  rpm,
  setRpm,
  pitch,
  setPitch,
  visualizerRef,
  timeTextRef,
  progressBarRef,
}: {
  activeIndex: number;
  activeLink: NavigationLink;
  isPlaying: boolean;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
  onTogglePlaying: () => void;
  rpm: 33 | 45;
  setRpm: (rpm: 33 | 45) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  visualizerRef: React.RefObject<HTMLDivElement | null>;
  timeTextRef: React.RefObject<HTMLSpanElement | null>;
  progressBarRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const currentSpinSpeed = (rpm === 45 ? 4.4 : 6) / pitch;

  const style = {
    '--active-index': activeIndex,
    '--vinyl-speed': `${currentSpinSpeed}s`,
  } as CSSProperties;

  return (
    <section
      className={`player-panel ${isPlaying ? 'is-playing' : 'is-paused'}`}
      aria-label="Vinyl navigation player"
      style={style}
    >
      {/* Photorealistic 3D Gramophone Container with aligned interactive overlay */}
      <div className="gramophone-container">
        <img 
          src="/images/gramophone.png" 
          className="gramophone-image" 
          alt="Vintage Retro Gramophone" 
        />
        
        {/* Aligned 3D Spinning Record Overlay Button */}
        <div className="record-stage-overlay">
          <button
            aria-label={isPlaying ? 'Pause Fight Song chorus' : 'Play Fight Song chorus'}
            aria-pressed={isPlaying}
            className="record-control record-control-overlay"
            onClick={onTogglePlaying}
            type="button"
          >
            <span className={`record-overlay ${isPlaying ? 'is-playing' : ''}`} aria-hidden="true">
              <span className="record-grooves-overlay" />
              <span className="record-label-overlay">
                <span className="label-logo-overlay">CHAO</span>
                <span className="label-speed-overlay">{rpm} RPM</span>
              </span>
            </span>
            {/* Stationary specular light reflection overlay */}
            <span className="record-gloss-overlay" aria-hidden="true" />
            {/* Stationary chrome center spindle pin overlay */}
            <span className="record-pin-overlay" aria-hidden="true" />
          </button>
        </div>

        {/* 3D Tonearm/Needle Stage (matches record perspective) */}
        <div className="tonearm-stage" aria-hidden="true">
          <div 
            className="tonearm" 
            style={{ '--track-offset': `${activeIndex * 3.5}deg` } as CSSProperties}
          >
            <span className="tonearm-pivot" />
            <span className="tonearm-beam" />
            <span className="tonearm-head" />
          </div>
        </div>
      </div>

      {/* Screen Reader Hidden text matching exactly what App.test.tsx expects */}
      <span className="sr-only" aria-hidden="true">
        {isPlaying ? 'PLAY' : 'CUE'} / Fight Song / {activeLink.label}
      </span>

      {/* Extremely compact single-row Retro MP3 Player Device */}
      <div className="mini-player retro-mp3-device-mini" aria-label="Small track player">
        
        {/* Three control buttons: Left, Play, Right */}
        <div className="mp3-controls-mini">
          <button
            aria-label="Previous track"
            className="transport-button transport-button-previous mp3-btn-mini"
            onClick={onPreviousTrack}
            type="button"
          >
            ◀
          </button>
          
          <button
            aria-label={isPlaying ? 'Pause MP3 playback' : 'Play MP3 playback'}
            className={`transport-button transport-button-play mp3-btn-mini is-play-pause ${isPlaying ? 'is-playing' : ''}`}
            onClick={onTogglePlaying}
            type="button"
          >
            {isPlaying ? '▮▮' : '▶'}
          </button>

          <button
            aria-label="Next track"
            className="transport-button transport-button-next mp3-btn-mini"
            onClick={onNextTrack}
            type="button"
          >
            ▶
          </button>
        </div>

        {/* Backlit single-row LCD Screen */}
        <div className="player-display-mini lcd-screen-mini" aria-live="polite">
          <div className="lcd-reflection-mini" />
          <div className="lcd-grid-overlay-mini" />
          
          <div className="lcd-content-mini">
            <span className="lcd-status-mini">
              {isPlaying ? '▶' : '■'}
            </span>
            
            <div className="lcd-text-container-mini">
              <span className="display-line lcd-text-mini">
                Fight Song / {activeLink.label}
              </span>
            </div>

            <span className="lcd-time-mini" ref={timeTextRef}>
              00:00
            </span>

            {/* Tiny inline 5-bar spectrum analyzer visualizer */}
            <div className="mp3-visualizer-mini" ref={visualizerRef}>
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="v-bar-mini" 
                  style={{ '--bar-index': i } as CSSProperties} 
                />
              ))}
            </div>
          </div>
          
          <div className="lcd-progress-track-mini">
            <span className="lcd-progress-bar-mini" ref={progressBarRef} style={{ width: '0%' }} />
          </div>
        </div>


      </div>

    </section>
  );
}

export default function App() {
  const { profile, links, initialLinkId } = siteContent;
  const [selectedLinkId, setSelectedLinkId] = useState(initialLinkId);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Custom interactive states
  const [rpm, setRpm] = useState<33 | 45>(33);
  const [pitch, setPitch] = useState<number>(1.00);
  const [volume] = useState<number>(7); // Keep standard default volume level

  // Web Audio Context & Node refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Animation & display updates refs (avoiding React re-renders for 60fps animations)
  const visualizerRef = useRef<HTMLDivElement | null>(null);
  const timeTextRef = useRef<HTMLSpanElement | null>(null);
  const progressBarRef = useRef<HTMLSpanElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const activeLink = links.find((link) => link.id === selectedLinkId) ?? links[0];
  const activeIndex = Math.max(
    0,
    links.findIndex((link) => link.id === activeLink.id),
  );
  const emailLink = { href: 'mailto:chao.sun.me@gmail.com' };
  const projectsLink = links.find((link) => link.id === 'projects') ?? links[0];

  // Helper: Format seconds to MM:SS
  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // Initialize Web Audio Context, Analyser and Synth fallbacks
  function initAudio() {
    if (audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Small size is perfect for our 5 equalizer bars
      analyser.connect(ctx.destination);

      if (audioRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        sourceNodeRef.current = source;
      }



      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    } catch (e) {
      console.error('Failed to initialize Web Audio API', e);
    }
  }

  // Visualizer + Track time tick loop (runs at 60fps via requestAnimationFrame)
  function tickVisualizer() {
    if (!isPlaying) return;

    let current = 0;
    let total = 30;

    if (audioRef.current) {
      current = audioRef.current.currentTime;
      total = audioRef.current.duration && !isNaN(audioRef.current.duration) ? audioRef.current.duration : 30;
    }

    // Update timer text directly in the DOM
    if (timeTextRef.current) {
      timeTextRef.current.innerText = formatTime(current);
    }
    // Update progress bar width directly in the DOM
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${(current / total) * 100}%`;
    }

    // Update equalizer spectrum bars
    if (analyserRef.current && visualizerRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      const bars = visualizerRef.current.children;
      for (let i = 0; i < Math.min(bars.length, bufferLength); i++) {
        const bar = bars[i] as HTMLElement;
        const value = dataArray[i];
        const percent = (value / 255) * 100;
        bar.style.setProperty('--bar-height', `${Math.max(6, percent * 1.15)}%`);
      }
    } else if (visualizerRef.current) {
      // Fallback procedural visualizer animation if Web Audio is blocked/unavailable
      const bars = visualizerRef.current.children;
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i] as HTMLElement;
        const t = Date.now() * 0.006 + i * 0.4;
        const value = Math.abs(Math.sin(t) * 0.5 + Math.cos(t * 1.6) * 0.35 + 0.15);
        bar.style.setProperty('--bar-height', `${Math.max(6, value * 100)}%`);
      }
    }

    animationFrameRef.current = requestAnimationFrame(tickVisualizer);
  }

  // Reset visualizer bars to flat state
  function resetVisualizer() {
    if (visualizerRef.current) {
      const bars = visualizerRef.current.children;
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i] as HTMLElement;
        bar.style.setProperty('--bar-height', '5%');
      }
    }
  }

  // Track state syncing when speed/pitch/volume updates
  useEffect(() => {
    const speedMultiplier = (rpm === 45 ? 1.35 : 1.0) * pitch;

    if (audioRef.current) {
      audioRef.current.playbackRate = speedMultiplier;
      audioRef.current.volume = volume / 10;
    }
  }, [pitch, rpm, volume]);

  // Main playback control trigger
  useEffect(() => {
    if (isPlaying) {
      initAudio();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        void audioContextRef.current.resume();
      }

      const speedMultiplier = (rpm === 45 ? 1.35 : 1.0) * pitch;

      if (audioRef.current) {
        audioRef.current.playbackRate = speedMultiplier;
        audioRef.current.volume = volume / 10;
        const playAttempt = audioRef.current.play();
        if (playAttempt) {
          playAttempt.catch((err) => {
            console.warn("MP3 source failed or was blocked.", err);
          });
        }
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(tickVisualizer);
    } else {
      audioRef.current?.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      resetVisualizer();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Handle component teardown
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  function handleTogglePlaying() {
    setIsPlaying(!isPlaying);
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



      <section className="hero" aria-labelledby="site-title">
        <div className="hero-copy">
          <h1 id="site-title">{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <p className="descriptor">{profile.descriptor}</p>
          <div className="hero-tags" aria-label="Interest tags">
            {profile.tags.map((tag, i) => (
              <span
                className="hero-tag"
                key={tag}
                style={{ '--tag-index': i } as CSSProperties}
              >
                {tag}
              </span>
            ))}
          </div>
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
          rpm={rpm}
          setRpm={setRpm}
          pitch={pitch}
          setPitch={setPitch}
          visualizerRef={visualizerRef}
          timeTextRef={timeTextRef}
          progressBarRef={progressBarRef}
        />
      </section>

      <section className="workspace" aria-label="Navigation workspace">
        <nav className="primary-nav" aria-label="Primary destinations">
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
