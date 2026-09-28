import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { ContactSheet } from "./components/ContactSheet";
import { MobileWorkCarousel } from "./components/MobileWorkCarousel";
import { useMobileLayout } from "./hooks/useMobileLayout";
import { notes } from "./data/notes";
import { MusicCard } from "./components/MusicCard";
import { FeaturedWork } from "./components/FeaturedWork";
import { Glyph } from "./components/CardIcons";
import { Icon } from "./components/Icon";
import { SignatureSculpture } from "./components/SignatureSculpture";
import { siteContent } from "./data/siteContent";
import { MUSIC_LIBRARY } from "./data/musicLibrary";
import { useMusicPlayer } from "./hooks/useMusicPlayer";
import { useTheme } from "./hooks/useTheme";

type Page = "home" | "projects" | "notes";
const route = (): Page =>
  window.location.pathname.replace(/\/$/, "") === "/projects"
    ? "projects"
    : window.location.pathname.replace(/\/$/, "") === "/notes"
      ? "notes"
      : "home";
const email = "chao.sun.me@gmail.com";

function LocalTime() {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Helsinki",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(format()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span className="local-time">
      Helsinki, FI <span className="time-divider">/</span> <time>{time}</time>
    </span>
  );
}

export default function App() {
  const mobile = useMobileLayout();
  const [contactOpen, setContactOpen] = useState(false);
  const [page, setPage] = useState<Page>(route);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [openNote, setOpenNote] = useState<number | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  const scrollPositions = useRef<Partial<Record<Page, number>>>({});
  const currentPage = useRef(page);
  const { theme, toggleTheme } = useTheme();
  const player = useMusicPlayer(MUSIC_LIBRARY.length);
  const track = MUSIC_LIBRARY[player.trackIndex];

  useEffect(() => {
    const onPopState = () => {
      scrollPositions.current[currentPage.current] = window.scrollY;
      hasNavigated.current = true;
      setPage(route());
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      clearTimeout(copyTimer.current);
    };
  }, []);
  useLayoutEffect(() => {
    currentPage.current = page;
    if (hasNavigated.current)
      window.scrollTo({
        top: scrollPositions.current[page] ?? 0,
        behavior: "instant",
      });
  }, [page]);
  useEffect(() => {
    document.title =
      page === "home"
        ? "Chao — Software Architect & Maker"
        : `${page === "projects" ? "Projects" : "Notes"} — Chao`;
    if (hasNavigated.current) heading.current?.focus({ preventScroll: true });
  }, [page]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, next: Page) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    if (page === next) return;
    scrollPositions.current[page] = window.scrollY;
    window.history.pushState({}, "", next === "home" ? "/" : `/${next}`);
    hasNavigated.current = true;
    setPage(next);
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError(false);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }
  const pageLink = (next: Page) => ({
    href: next === "home" ? "/" : `/${next}`,
    onClick: (event: MouseEvent<HTMLAnchorElement>) => navigate(event, next),
  });

  return (
    <div
      className={`site-shell ${mobile && page !== "home" && player.isPlaying && !mobile ? "has-mini-player" : ""}`}
    >
      <a className="skip-link" href="#site-title">
        Skip to main content
      </a>
      <header className="site-header">
        <a {...pageLink("home")} className="brand" aria-label="Chao — Home">
          <span className="brand-symbol">
            c<span>·</span>
          </span>
          <span>
            chao<span className="brand-slash"> / </span>
            <span className="brand-caption">personal space</span>
          </span>
        </a>
        <nav aria-label="Primary destinations" className="main-nav">
          {(["home", "projects", "notes"] as const).map((item) => (
            <a
              key={item}
              {...pageLink(item)}
              aria-current={page === item ? "page" : undefined}
            >
              <Glyph
                className="mobile-nav-icon"
                name={
                  item === "home"
                    ? "profile"
                    : item === "projects"
                      ? "code"
                      : "book"
                }
              />
              {item === "home"
                ? "About"
                : item === "projects"
                  ? "Work"
                  : "Notes"}
              <span className="nav-dot" />
            </a>
          ))}
          {mobile && (
            <button
              className="nav-contact"
              onClick={() => setContactOpen(true)}
              aria-label="Contact Chao"
            >
              <Glyph name="mail" />
              <span>Connect</span>
            </button>
          )}
        </nav>
        <div className="header-actions">
          {page !== "home" && player.isPlaying ? (
            <button
              className="icon-button"
              data-music-control="true"
              aria-label="Pause classical music"
              onClick={player.togglePlaying}
            >
              <Glyph name="pause" />
            </button>
          ) : null}
          <button
            className="icon-button theme-switch"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <Glyph name={theme === "dark" ? "sun" : "moon"} />
          </button>
          <a className="header-contact" href={`mailto:${email}`}>
            Let’s talk <Glyph name="arrow" />
          </a>
        </div>
      </header>

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

      <main key={page} className={`page-content page-${page}`}>
        {page === "home" ? (
          <>
            <section className="hero" aria-labelledby="site-title">
              <div className="hero-copy">
                <div className="eyebrow availability">
                  <span className="status-dot" /> OPEN TO THOUGHTFUL
                  COLLABORATIONS
                </div>
                <h1 id="site-title" ref={heading} tabIndex={-1}>
                  Chao<span className="name-period">.</span>
                </h1>
                <div className="hero-role">
                  <span>Software Architect</span>
                  <span className="role-line" />
                  <span className="maker">& curious human</span>
                </div>
                <h2 className="hero-statement">
                  Thoughtful software.
                  <br />
                  <span>A little more human.</span>
                </h2>
                <p className="hero-description">
                  {siteContent.profile.descriptor}
                </p>
                <div className="hero-actions">
                  <a
                    className="button button-primary"
                    href={`mailto:${email}`}
                    onClick={(event) => {
                      if (mobile) {
                        event.preventDefault();
                        setContactOpen(true);
                      }
                    }}
                  >
                    <Glyph name="mail" /> Say hello <Glyph name="arrow" />
                  </a>
                  <a className="text-link" {...pageLink("projects")}>
                    {mobile ? "View work" : "Explore my work"}{" "}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <div className="hero-location">
                  <Glyph name="pin" />
                  <LocalTime />
                  <span className="location-dot">·</span>
                  <span>Building for everywhere</span>
                </div>
              </div>
              <SignatureSculpture />
            </section>

            <section
              className="glimpse-section"
              aria-labelledby="glimpse-title"
            >
              <div className="section-heading">
                <h2 id="glimpse-title">A FEW THINGS IN MY ORBIT</h2>
                <span>THE WORK. THE PERSON. THE SOUNDTRACK.</span>
              </div>
              <div className="orbit-grid">
                {mobile ? (
                  <MobileWorkCarousel />
                ) : (
                  <FeaturedWork projectsLink={pageLink("projects")} />
                )}
                <article className="orbit-card person-card">
                  <div className="card-topline">
                    <span className="eyebrow">
                      <Glyph name="plus" /> BEYOND THE KEYBOARD
                    </span>
                    <span className="tiny-spark">✳</span>
                  </div>
                  <h3>
                    Curiosity doesn’t <br />
                    clock out.
                  </h3>
                  <p>
                    Good coffee. Long bike rides.
                    <br />A new word in Finnish.
                    <br />
                    Finding the interesting in the everyday.
                  </p>
                  <div className="interest-tags">
                    <span>Coffee</span>
                    <span>Cycling</span>
                    <span>Finnish life</span>
                  </div>
                  <a className="card-bottom-link" {...pageLink("notes")}>
                    Notes on life & building <Glyph name="arrow" />
                  </a>
                </article>
                <MusicCard player={player} />
              </div>
            </section>
          </>
        ) : page === "projects" ? (
          <>
            <section className="inner-hero">
              <span className="eyebrow">SELECTED WORK / 2024–2026</span>
              <h1 id="site-title" ref={heading} tabIndex={-1}>
                Projects<span className="name-period">.</span>
              </h1>
              <p>
                Small ideas, made real.
                <br />
                <span>
                  Useful products, considered interfaces, and a little
                  curiosity.
                </span>
              </p>
            </section>
            <div className="projects-grid">
              {siteContent.projectsPage.projects.map((item, index) => (
                <article
                  className="portfolio-card"
                  key={item.id}
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio-image"
                    aria-label={item.ctaLabel}
                  >
                    <img
                      src={item.screenshots.web.src}
                      alt={item.screenshots.web.alt}
                      loading={index > 1 ? "lazy" : "eager"}
                    />
                    <span className="project-open">
                      <Glyph name="arrow" />
                    </span>
                  </a>
                  <div className="portfolio-copy">
                    <div className="portfolio-category">
                      <span>{item.category}</span>
                      <span>0{index + 1}</span>
                    </div>
                    <h2>
                      <a href={item.href} target="_blank" rel="noreferrer">
                        {item.name}
                        <Glyph name="arrow" />
                      </a>
                    </h2>
                    <p>{item.summary}</p>
                    <div className="portfolio-note">{item.note}</div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <>
            <section className="inner-hero">
              <span className="eyebrow">A DIGITAL NOTEBOOK</span>
              <h1 id="site-title" ref={heading} tabIndex={-1}>
                Notes<span className="name-period">.</span>
              </h1>
              <p>
                Thinking out loud.
                <br />
                <span>Short notes on making things and making a life.</span>
              </p>
            </section>
            <div className="notes-list">
              {notes.map((note, index) => (
                <article
                  className={`note ${openNote === index ? "note-open" : ""}`}
                  key={note.title}
                >
                  <button
                    className="note-toggle"
                    aria-expanded={openNote === index}
                    aria-controls={`note-${index}`}
                    onClick={() =>
                      setOpenNote(openNote === index ? null : index)
                    }
                  >
                    <span className="note-date">{note.date}</span>
                    <span className="note-summary">
                      <span className="note-title">{note.title}</span>
                      <span>{note.text}</span>
                    </span>
                    <Glyph name="plus" />
                  </button>
                  <div
                    className="note-body"
                    id={`note-${index}`}
                    hidden={openNote !== index}
                  >
                    <p>{note.body}</p>
                    <a
                      className="text-link"
                      href={`mailto:${email}?subject=${encodeURIComponent(`Essay request: ${note.title}`)}`}
                    >
                      Ask for the longer essay <Glyph name="arrow" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
        <section className="connection-bar" aria-label="Connect with Chao">
          <div className="connection-intro">
            <span className="status-dot" />
            <span>Good things start with a conversation.</span>
          </div>
          <div className="social-links">
            <a
              href="https://github.com/rootSunc"
              target="_blank"
              rel="noreferrer"
            >
              <Icon id="github" />
              GitHub
              <Glyph name="arrow" />
            </a>
            <a
              href="https://www.linkedin.com/in/chaosun526/"
              target="_blank"
              rel="noreferrer"
            >
              <Icon id="linkedin" />
              LinkedIn
              <Glyph name="arrow" />
            </a>
            <a href={`mailto:${email}?subject=Resume%20request`}>
              <Icon id="resume" />
              Résumé
              <Glyph name="arrow" />
            </a>
            <button onClick={copyEmail} aria-label="Copy email address">
              <Glyph name={copied ? "check" : "copy"} />
              <span>{copied ? "Copied!" : "Email"}</span>
            </button>
          </div>
          <span className="copy-status" role="status">
            {copyError
              ? `Please copy: ${email}`
              : copied
                ? "Email address copied."
                : ""}
          </span>
        </section>
      </main>
      {mobile && page !== "home" && player.isPlaying && (
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
            className="icon-button"
            aria-label="Pause classical music"
            onClick={player.togglePlaying}
          >
            <Glyph name="pause" />
          </button>
          <button
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
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Chao Sun</span>
        <span className="footer-note">
          Made with intention. Always evolving.
        </span>
        <span className="footer-signoff">
          Thanks for stopping by <span>↗</span>
        </span>
      </footer>
    </div>
  );
}
