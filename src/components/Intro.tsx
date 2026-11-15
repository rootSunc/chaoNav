import type { CSSProperties } from "react";
import { projects, type Copy, type Lang } from "../content";
import { Seal } from "./Seal";

type IntroProps = { readonly t: Copy; readonly lang: Lang };

/** The greeting, an English line, then the four names. */
export function Intro({ t, lang }: IntroProps) {
  let order = 0;
  const step = () => ({ "--i": order++ }) as CSSProperties;

  // English animates word by word; Chinese has no spaces, so it goes by phrase.
  const pieces = (text: string) =>
    lang === "en"
      ? text.split(/(\s+)/)
      : text.split(/(?<=[，。：；])/).filter(Boolean);

  return (
    <section className="intro wrap" aria-labelledby="intro-text">
      <h1 id="intro-text" className="intro-text" key={lang}>
        {pieces(t.introLead).map((piece, pieceIndex) =>
          /^\s+$/.test(piece) ? (
            " "
          ) : (
            <span key={pieceIndex} className="ink-in" style={step()}>
              {piece}
            </span>
          ),
        )}
      </h1>

      <blockquote className="intro-line" lang="en">
        {t.introVerse.map((verse) => (
          <span key={verse}>{verse}</span>
        ))}
        <footer className="intro-cite">{t.introCite}</footer>
      </blockquote>

      <nav className="intro-nav" aria-label={t.projectsNav}>
        {projects.map((project) => (
          <a key={project.id} className="intro-link" href={`#${project.id}`}>
            {project.name}
          </a>
        ))}
      </nav>

      <div className="intro-foot">
        <Seal className="intro-seal" />
      </div>
    </section>
  );
}
