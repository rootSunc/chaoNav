import { useEffect, useState } from 'react';
import { DestinationTabs } from './components/DestinationTabs';
import { ProjectsPage } from './components/ProjectsPage';
import { TerminalPanel } from './components/TerminalPanel';
import { VinylPlayer } from './components/VinylPlayer';
import { MUSIC_LIBRARY } from './data/musicLibrary';
import { siteContent, type NavigationId } from './data/siteContent';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import type { CssVars } from './lib/cssVars';

type PageId = 'home' | 'projects';

const PROJECTS_PATH = '/projects';

function getPageFromLocation(): PageId {
  return window.location.pathname.replace(/\/$/, '') === PROJECTS_PATH ? 'projects' : 'home';
}

export default function App() {
  const { initialLinkId, links, profile } = siteContent;
  const [selectedLinkId, setSelectedLinkId] = useState<NavigationId>(initialLinkId);
  const [currentPage, setCurrentPage] = useState<PageId>(() => getPageFromLocation());
  const player = useMusicPlayer(MUSIC_LIBRARY.length);

  const activeLink = links.find((link) => link.id === selectedLinkId) ?? links[0];
  const activeTrack = MUSIC_LIBRARY[player.trackIndex] ?? MUSIC_LIBRARY[0];
  const projectsLink = links.find((link) => link.id === 'projects') ?? activeLink;

  useEffect(() => {
    const handlePopState = () => setCurrentPage(getPageFromLocation());

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.body.dataset.page = currentPage;

    return () => {
      delete document.body.dataset.page;
    };
  }, [currentPage]);

  const navigateToPage = (page: PageId) => {
    const nextPath = page === 'projects' ? PROJECTS_PATH : '/';

    if (window.location.pathname !== nextPath) {
      window.history.pushState({ page }, '', nextPath);
    }

    if (page === 'projects') {
      setSelectedLinkId(projectsLink.id);
    }

    setCurrentPage(page);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <div className={`page-shell ${currentPage === 'projects' ? 'page-shell-projects' : ''}`}>
      <audio
        aria-label="Classical music player"
        autoPlay
        onEnded={() => player.selectRelativeTrack(1)}
        playsInline
        preload="auto"
        ref={player.audioRef}
        src={activeTrack.src}
      />

      {currentPage === 'projects' ? (
        <ProjectsPage
          content={siteContent.projectsPage}
          onBackHome={() => navigateToPage('home')}
        />
      ) : (
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
              <a
                className="action-button action-button-primary"
                href="mailto:chao.sun.me@gmail.com"
              >
                Email
              </a>
              <button
                aria-label="Open projects page"
                className="action-button action-button-secondary"
                onClick={() => navigateToPage('projects')}
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
      )}

      <footer className="site-footer">
        <p>© 2026 Software designed by Chao</p>
      </footer>
    </div>
  );
}
