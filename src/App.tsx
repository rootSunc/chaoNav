import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { Glyph } from "./components/CardIcons";
import { ConnectionBar } from "./components/ConnectionBar";
import { ContactSheet } from "./components/ContactSheet";
import { HomeView } from "./components/HomeView";
import { NotesView } from "./components/NotesView";
import { ProjectsView } from "./components/ProjectsView";
import { SiteHeader, type Page } from "./components/SiteHeader";
import { MUSIC_LIBRARY } from "./data/musicLibrary";
import { siteContent } from "./data/siteContent";
import { useMobileLayout } from "./hooks/useMobileLayout";
import { useMusicPlayer } from "./hooks/useMusicPlayer";
import { useTheme } from "./hooks/useTheme";
import { computeHelsinkiSolar } from "./lib/helsinkiSolar";

const route = (): Page => {
  const path = window.location.pathname.replace(/\/$/, "");
  if (path === "/projects") return "projects";
  if (path === "/notes") return "notes";
  return "home";
};

export default function App() {
  const mobile = useMobileLayout();
  const [contactOpen, setContactOpen] = useState(false);
  const [page, setPage] = useState<Page>(route);
  const [now, setNow] = useState(() => new Date());
  const [scrubbedMinutes, setScrubbedMinutes] = useState<number | null>(null);

  const heading = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  const scrollPositions = useRef<Partial<Record<Page, number>>>({});
  const currentPage = useRef(page);

  const { theme, toggleTheme } = useTheme();
  const player = useMusicPlayer(MUSIC_LIBRARY.length);
  const track = MUSIC_LIBRARY[player.trackIndex];
  const { email } = siteContent.profile;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const solar = useMemo(
    () => computeHelsinkiSolar(now, scrubbedMinutes),
    [now, scrubbedMinutes],
  );

  useEffect(() => {
    document.documentElement.dataset.lightPhase = solar.phase;
  }, [solar.phase]);

  useEffect(() => {
    const onPopState = () => {
      scrollPositions.current[currentPage.current] = window.scrollY;
      hasNavigated.current = true;
      setPage(route());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useLayoutEffect(() => {
    currentPage.current = page;
    if (hasNavigated.current) {
      window.scrollTo({
        top: scrollPositions.current[page] ?? 0,
        behavior: "instant",
      });
    }
  }, [page]);

  useEffect(() => {
    document.title =
      page === "home"
        ? "Chao Sun — 60°10′N Workbench"
        : `${page === "projects" ? "Systems" : "Cadence"} — Chao Sun`;
    if (hasNavigated.current) heading.current?.focus({ preventScroll: true });
  }, [page]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, next: Page) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    if (page === next) return;
    scrollPositions.current[page] = window.scrollY;
    window.history.pushState({}, "", next === "home" ? "/" : `/${next}`);
    hasNavigated.current = true;
    setPage(next);
  }

  const pageLink = (next: Page) => ({
    href: next === "home" ? "/" : `/${next}`,
    onClick: (event: MouseEvent<HTMLAnchorElement>) => navigate(event, next),
  });

  const showMobileMiniPlayer = mobile && page === "projects" && player.isPlaying;

  return (
    <div
      className={`workbench-shell phase-${solar.phase} ${showMobileMiniPlayer ? "has-mini-player" : ""}`}
    >
      <div className="northern-horizon-glow" aria-hidden="true" />

      <a className="skip-link" href="#site-title">
        Skip to main content
      </a>

      <SiteHeader
        page={page}
        mobile={mobile}
        theme={theme}
        solar={solar}
        onScrubMinutes={setScrubbedMinutes}
        isPlaying={player.isPlaying}
        activeTrackLabel={`${track.composer} · ${track.catalogue}`}
        pageLink={pageLink}
        onOpenContact={() => setContactOpen(true)}
        onToggleTheme={toggleTheme}
        onTogglePlaying={player.togglePlaying}
      />

      <audio
        aria-label="Classical music player"
        ref={player.audioRef}
        onEnded={() => player.selectRelativeTrack(1)}
        preload="none"
        playsInline
      >
        {track.sources.map((source) => (
          <source key={source.src} {...source} />
        ))}
      </audio>

      <main key={page} className={`lens-main lens-${page}`}>
        {page === "home" ? (
          <HomeView
            headingRef={heading}
            mobile={mobile}
            player={player}
            pageLink={pageLink}
            onOpenContact={() => setContactOpen(true)}
          />
        ) : page === "projects" ? (
          <ProjectsView headingRef={heading} />
        ) : (
          <NotesView headingRef={heading} player={player} />
        )}
        <ConnectionBar />
      </main>

      {showMobileMiniPlayer && (
        <aside
          className="mobile-mini-player"
          aria-label="Playing music"
          data-music-control="true"
        >
          <Glyph name="headphones" />
          <div>
            <strong>{track.composer}</strong>
            <span>{track.title}</span>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Pause classical music"
            onClick={player.togglePlaying}
          >
            <Glyph name="pause" />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Next track"
            onClick={() => player.selectRelativeTrack(1)}
          >
            <Glyph name="next" />
          </button>
        </aside>
      )}

      <ContactSheet
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        email={email}
      />

      <footer className="workbench-footer">
        <span>© {new Date().getFullYear()} Chao Sun</span>
        <span className="footer-center">60°10′12″ N, 24°56′18″ E · Helsinki</span>
        <button
          type="button"
          className="footer-correspondence"
          onClick={() => setContactOpen(true)}
        >
          chao.sun.me@gmail.com
        </button>
      </footer>
    </div>
  );
}
