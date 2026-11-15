import { useEffect } from "react";
import { Chapter } from "./components/Chapter";
import { Closing } from "./components/Closing";
import { Intro } from "./components/Intro";
import { Masthead } from "./components/Masthead";
import { Sourced } from "./components/Sourced";
import { LakeGrid } from "./components/specimens/LakeGrid";
import { Morphology } from "./components/specimens/Morphology";
import { Signals } from "./components/specimens/Signals";
import { TierLine } from "./components/specimens/TierLine";
import { copy, projects, type GroupId, type ProjectId } from "./content";
import { MUSIC_LIBRARY } from "./data/musicLibrary";
import { useHelsinki } from "./hooks/useHelsinki";
import { useLang } from "./hooks/useLang";
import { useLiveSources } from "./hooks/useLiveSources";
import { useMusicPlayer } from "./hooks/useMusicPlayer";
import { useTheme } from "./hooks/useTheme";

const GROUPS: readonly GroupId[] = ["markets", "finland"];

export default function App() {
  const { lang, toggleLang } = useLang();
  const t = copy[lang];
  const solar = useHelsinki();
  const { mode, cycleMode } = useTheme(solar.altitudeDeg);
  const live = useLiveSources();
  const player = useMusicPlayer(MUSIC_LIBRARY.length);
  const track = MUSIC_LIBRARY[player.trackIndex];

  // The site used to have /projects and /notes. Old links land on the page.
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, "");
    if (path === "/projects" || path === "/notes") {
      window.history.replaceState({}, "", "/");
      if (path === "/projects") {
        document.getElementById(projects[0].id)?.scrollIntoView();
      }
    }
  }, []);

  const number = (value: number | null) =>
    value === null ? "—" : value.toLocaleString("en-US");

  const counts: Partial<Record<ProjectId, React.ReactNode>> = {
    cnequity: (
      <span>
        <Sourced provenance={live.cneStars} t={t}>
          {number(live.cneStars.value)} {t.stars}
        </Sourced>
        {" · "}
        <Sourced provenance={live.cneForks} t={t}>
          {number(live.cneForks.value)} {t.forks}
        </Sourced>
      </span>
    ),
    arkiwatch: (
      <span>
        <Sourced provenance={live.arkiStars} t={t}>
          {number(live.arkiStars.value)} {t.stars}
        </Sourced>
      </span>
    ),
  };

  const specimens: Record<ProjectId, React.ReactNode> = {
    cnequity: <LakeGrid t={t} />,
    usequity: <TierLine t={t} />,
    suomeksi: <Morphology t={t} lang={lang} />,
    arkiwatch: <Signals t={t} live={live} solar={solar} />,
  };

  return (
    <>
      <a className="skip-link" href={`#${projects[0].id}`}>
        {t.skip}
      </a>

      <main>
        <div className="opening">
          <Masthead
            t={t}
            helsinkiTime={solar.helsinkiTimeLabel}
            mode={mode}
            onCycleMode={cycleMode}
            onToggleLang={toggleLang}
          />
          <Intro t={t} lang={lang} />
        </div>

        {GROUPS.map((group) => (
          <section key={group} className="group" aria-label={t.groups[group]}>
            <p className="group-label wrap">
              <span>{t.groups[group]}</span>
            </p>
            {projects
              .filter((project) => project.group === group)
              .map((project, index) => (
                <Chapter
                  key={project.id}
                  project={project}
                  emphasis={index === 0 ? "poster" : "follow"}
                  lang={lang}
                  counts={counts[project.id]}
                  specimen={specimens[project.id]}
                />
              ))}
          </section>
        ))}

        <aside className="aside wrap">
          <p>
            <strong>{t.aside.lead}</strong> {t.aside.body}
          </p>
        </aside>

        <Closing t={t} live={live} solar={solar} player={player} track={track} />
      </main>

      <footer className="footer wrap">
        <span>© {new Date().getFullYear()} Chao Sun</span>
        <span>
          {t.footer.set} {t.footer.sky}
        </span>
      </footer>

      <audio
        aria-label={t.music.title}
        ref={player.audioRef}
        onEnded={() => player.selectRelativeTrack(1)}
        preload="auto"
        playsInline
      >
        {track.sources.map((source) => (
          <source key={source.src} {...source} />
        ))}
      </audio>
    </>
  );
}
