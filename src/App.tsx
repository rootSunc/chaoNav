import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { DestinationTabs } from './components/DestinationTabs';
import { DraggablePlayerDock } from './components/DraggablePlayerDock';
import { HeroWaveStrip } from './components/HeroWaveStrip';
import { ProjectsPage } from './components/ProjectsPage';
import { SceneErrorBoundary } from './components/scene/SceneErrorBoundary';
import { TerminalPanel } from './components/TerminalPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { VinylPlayer } from './components/VinylPlayer';
import { MUSIC_LIBRARY } from './data/musicLibrary';
import { siteContent, type NavigationId } from './data/siteContent';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import { useRouteFocus, useTerminalFocus } from './hooks/useRouteFocus';
import { useSceneQuality } from './hooks/useSceneQuality';
import { useSessionAccent } from './hooks/useSessionAccent';
import type { CssVars } from './lib/cssVars';

const SharedHomeScene = lazy(() =>
  import('./components/scene/shared/SharedHomeScene').then((module) => ({
    default: module.SharedHomeScene,
  })),
);

const SharedProjectsScene = lazy(() =>
  import('./components/scene/shared/SharedProjectsScene').then((module) => ({
    default: module.SharedProjectsScene,
  })),
);

const CosmicStage = lazy(() =>
  import('./components/scene/shared/CosmicStage').then((module) => ({
    default: module.CosmicStage,
  })),
);

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
  const sceneQuality = useSceneQuality();
  const pageShellRef = useRef<HTMLDivElement>(null);
  const emailAnchorRef = useRef<HTMLAnchorElement>(null);

  const activeLink = links.find((link) => link.id === selectedLinkId) ?? links[0];
  useSessionAccent(activeLink.id);
  const activeTrack = MUSIC_LIBRARY[player.trackIndex] ?? MUSIC_LIBRARY[0];
  const projectsLink = links.find((link) => link.id === 'projects') ?? activeLink;
  const showSharedHomeScene =
    sceneQuality.quality !== 'off' && currentPage === 'home' && sceneQuality.projectStage;
  const showSharedProjectsScene =
    sceneQuality.quality !== 'off' && currentPage === 'projects' && sceneQuality.projectStage;
  const showCosmicStage =
    sceneQuality.quality !== 'off' && currentPage === 'home' && sceneQuality.audioStage;
  const cosmicQuality = sceneQuality.quality === 'off' ? 'low' : sceneQuality.quality;

  useRouteFocus(currentPage);
  useTerminalFocus(currentPage, activeLink.id);

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

  useEffect(() => {
    if (sceneQuality.quality === 'off') {
      delete document.body.dataset.scene;
      return;
    }

    document.body.dataset.scene = sceneQuality.quality;

    return () => {
      delete document.body.dataset.scene;
    };
  }, [sceneQuality.quality]);

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
    <div
      className={`page-shell ${currentPage === 'projects' ? 'page-shell-projects' : ''}`}
      ref={pageShellRef}
    >
      <a
        className="skip-link"
        href={currentPage === 'projects' ? '#projects-title' : '#site-title'}
      >
        Skip to main content
      </a>

      <div className="theme-toggle-shell">
        <ThemeToggle />
      </div>

      {showSharedHomeScene ? (
        <Suspense fallback={null}>
          <SceneErrorBoundary fallback={null} label="shared-home-scene">
            <SharedHomeScene
              activeLinkId={activeLink.id}
              containerRef={pageShellRef}
              isPlaying={player.isPlaying}
              particleCount={sceneQuality.particleCount}
              quality={sceneQuality.quality}
            />
          </SceneErrorBoundary>
        </Suspense>
      ) : null}

      {showSharedProjectsScene ? (
        <Suspense fallback={null}>
          <SharedProjectsScene containerRef={pageShellRef} quality={sceneQuality.quality} />
        </Suspense>
      ) : null}

      {showCosmicStage ? (
        <Suspense fallback={null}>
          <SceneErrorBoundary fallback={null} label="cosmic-stage">
            <CosmicStage
              activeLinkId={activeLink.id}
              isPlaying={player.isPlaying}
              quality={cosmicQuality}
            />
          </SceneErrorBoundary>
        </Suspense>
      ) : null}

      <audio
        aria-label="Classical music player"
        onEnded={() => player.selectRelativeTrack(1)}
        playsInline
        preload="auto"
        ref={player.audioRef}
      >
        {activeTrack.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </audio>

      {currentPage === 'projects' ? (
        <ProjectsPage
          content={siteContent.projectsPage}
          onBackHome={() => navigateToPage('home')}
          projectStage={sceneQuality.projectStage}
          sceneQuality={sceneQuality.quality}
        />
      ) : (
        <main className="command-deck" id="profile">
          <div className="hero-wing">
            <section aria-labelledby="site-title" className="hero-copy">
              <p className="hero-eyebrow">{profile.heroEyebrow}</p>
              <h1 id="site-title" tabIndex={-1}>{profile.name}</h1>
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
                  ref={emailAnchorRef}
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

              <div className="deck-player-slot">
                <DraggablePlayerDock anchorRef={emailAnchorRef}>
                  {(dock) => (
                    <VinylPlayer
                      activeLink={activeLink}
                      activeTrack={activeTrack}
                      dockRef={dock.dockRef}
                      dockStyle={dock.dockStyle}
                      isFloating={dock.isFloating}
                      isPlaying={player.isPlaying}
                      onDragHandlePointerCancel={dock.onDragHandlePointerCancel}
                      onDragHandlePointerDown={dock.onDragHandlePointerDown}
                      onDragHandlePointerMove={dock.onDragHandlePointerMove}
                      onDragHandlePointerUp={dock.onDragHandlePointerUp}
                      onNextTrack={() => player.selectRelativeTrack(1)}
                      onPreviousTrack={() => player.selectRelativeTrack(-1)}
                      onTogglePlaying={player.togglePlaying}
                      progressBarRef={player.progressBarRef}
                      timeTextRef={player.timeTextRef}
                      visualizerRef={player.visualizerRef}
                    />
                  )}
                </DraggablePlayerDock>
              </div>
            </section>

            <HeroWaveStrip isPlaying={player.isPlaying} />
          </div>

          <section aria-label="Command interface" className="command-stage">
            <DestinationTabs
              links={links}
              onSelect={setSelectedLinkId}
              selectedLinkId={activeLink.id}
            />

            <TerminalPanel activeLink={activeLink} />
          </section>
        </main>
      )}

      <footer className="site-footer">
        <p>
          <span aria-hidden="true" className="footer-cube" />
          © 2026 Software designed by Chao
        </p>
      </footer>
    </div>
  );
}
