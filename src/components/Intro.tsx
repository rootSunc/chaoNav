import type { CSSProperties } from "react";
import { projects, type Copy, type Lang } from "../content";
import { PenGreeting } from "./PenGreeting";
import { Seal } from "./Seal";

type IntroProps = { readonly t: Copy; readonly lang: Lang };

/** The greeting, an English line, then the four names. */
export function Intro({ t, lang }: IntroProps) {
  // The greeting is the first word (English) or phrase (Chinese).
  const pieces = (text: string) =>
    lang === "en"
      ? text.split(/(\s+)/)
      : text.split(/(?<=[，。：；])/).filter(Boolean);

  const lead = pieces(t.introLead);

  // After the pen, the rest of the line is typed out one character at a time,
  // at an uneven human pace, with the caret riding the newest letter.
  const TYPE_START_MS = 1650;
  const CARET_LINGER_MS = 1100;
  const typeOut = (text: string) => {
    const chars = [...text];
    const at: number[] = [];
    let ms = TYPE_START_MS;
    chars.forEach((char, i) => {
      at.push(ms);
      ms += char === " " ? 140 : 62 + ((i * 37) % 5) * 13;
    });
    const end = at[at.length - 1] ?? TYPE_START_MS;
    const nodes = chars.map((char, i) => {
      if (char === " ") return " ";
      const next = at.slice(i + 1).find((_, j) => chars[i + 1 + j] !== " ");
      const last = next === undefined;
      return (
        <span
          key={i}
          className={last ? "type-ch type-last" : "type-ch"}
          style={
            {
              "--d": `${at[i]}ms`,
              "--life": `${(last ? end + CARET_LINGER_MS : next) - at[i]}ms`,
            } as CSSProperties
          }
        >
          {char}
        </span>
      );
    });
    return { nodes, end };
  };
  const body = lead.slice(1).join("");
  const typed = typeOut(body.trimStart());

  return (
    <section
      className="intro wrap"
      aria-labelledby="intro-text"
      style={{ "--typed-end": `${typed.end}ms` } as CSSProperties}
    >
      <h1 id="intro-text" className="intro-text" key={lang}>
        <PenGreeting text={lead[0]} />
        {/^\s/.test(body) ? " " : null}
        <span className="typed">
          {typed.nodes}
        </span>
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
