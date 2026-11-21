import type { ReactNode } from "react";
import type { Lang, Project } from "../content";
import { useCentered, useSeen } from "../hooks/useInView";
import { FitName } from "./FitName";
import { Scribble, seedOf } from "./Scribble";

type ChapterProps = {
  readonly project: Project;
  readonly lang: Lang;
  /** Poster names span the page. Follow names sit on the text column. */
  readonly emphasis: "poster" | "follow";
  /** Sourced star and fork counts, when the repository is public. */
  readonly counts?: ReactNode;
  readonly specimen: ReactNode;
};

export function Chapter({
  project,
  lang,
  emphasis,
  counts,
  specimen,
}: ChapterProps) {
  const [bodyRef, seen] = useSeen<HTMLDivElement>();
  const [chapterRef, current] = useCentered<HTMLElement>();
  const facts = [...project.stack, ...(project.license ? [project.license] : [])];

  return (
    <article
      className="chapter wrap"
      aria-labelledby={project.id}
      ref={chapterRef}
      data-current={current ? "true" : undefined}
      data-emphasis={emphasis}
    >
      <header className="chapter-meta">
        <Scribble className="meta-rule" seed={seedOf(project.id)} />
        <p className="chapter-kind">{project.kind[lang]}</p>
        <p className="chapter-facts">
          {counts}
          <span>{facts.join(" · ")}</span>
        </p>
      </header>

      <FitName id={project.id} text={project.name} />

      <div
        className="chapter-body"
        ref={bodyRef}
        data-seen={seen ? "true" : undefined}
      >
        <div className="chapter-text">
          <p className="chapter-pitch">{project.pitch[lang]}</p>
          <p className="chapter-links">
            {project.links.map((link) => (
              <a
                key={link.href}
                className="out-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label[lang]}
              </a>
            ))}
            {project.note && (
              <span className="chapter-note">{project.note[lang]}</span>
            )}
          </p>
        </div>

        <figure className="specimen">{specimen}</figure>
      </div>
    </article>
  );
}
