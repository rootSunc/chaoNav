import { useState } from 'react';
import { DestinationTabs } from './components/DestinationTabs';
import { TerminalPanel } from './components/TerminalPanel';
import { VinylPlayer } from './components/VinylPlayer';
import { MUSIC_LIBRARY } from './data/musicLibrary';
import { siteContent, type NavigationId } from './data/siteContent';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import type { CssVars } from './lib/cssVars';

export default function App() {
  const { initialLinkId, links, profile } = siteContent;
  const [selectedLinkId, setSelectedLinkId] = useState<NavigationId>(initialLinkId);
  const player = useMusicPlayer(MUSIC_LIBRARY.length);

  const activeLink = links.find((link) => link.id === selectedLinkId) ?? links[0];
  const activeTrack = MUSIC_LIBRARY[player.trackIndex] ?? MUSIC_LIBRARY[0];
  const projectsLink = links.find((link) => link.id === 'projects') ?? activeLink;

  return (
    <div className="page-shell">
      <audio
        aria-label="Classical music player"
        autoPlay
        onEnded={() => player.selectRelativeTrack(1)}
        playsInline
        preload="auto"
        ref={player.audioRef}
        src={activeTrack.src}
      />

      <main className="home-grid" id="profile">
        <section aria-labelledby="site-title" className="hero-copy">
          <h1 id="site-title">{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <p className="descriptor">{profile.descriptor}</p>

          <div aria-label="Interest tags" className="tag-cloud">
            {profile.tags.map((tag, index) => (
              <span className="tag-pill" key={tag} style={{ '--tag-index': index } as CssVars}>
                {tag}
              </span>
            ))}
          </div>

          <div aria-label="Primary actions" className="hero-actions">
            <a className="action-button action-button-primary" href="mailto:chao.sun.me@gmail.com">
              Email
            </a>
            <button
              className="action-button action-button-secondary"
              onClick={() => setSelectedLinkId(projectsLink.id)}
              type="button"
            >
              Projects
            </button>
          </div>
        </section>

        <VinylPlayer
          activeLink={activeLink}
          activeTrack={activeTrack}
          isPlaying={player.isPlaying}
          onNextTrack={() => player.selectRelativeTrack(1)}
          onPreviousTrack={() => player.selectRelativeTrack(-1)}
          onTogglePlaying={player.togglePlaying}
          progressBarRef={player.progressBarRef}
          timeTextRef={player.timeTextRef}
          visualizerRef={player.visualizerRef}
        />

        <DestinationTabs
          links={links}
          onSelect={setSelectedLinkId}
          selectedLinkId={activeLink.id}
        />

        <TerminalPanel activeLink={activeLink} />
      </main>

      <footer className="site-footer">
        <p>© 2026 Software designed by Chao</p>
      </footer>
    </div>
  );
}
