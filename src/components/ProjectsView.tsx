import type { RefObject } from "react";
import { siteContent } from "../data/siteContent";
import { SystemArtifact } from "./SystemArtifact";

export function ProjectsView({
  headingRef,
}: {
  readonly headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const { eyebrow, title, lead, intro, projects } = siteContent.projectsPage;

  return (
    <>
      <section className="lens-masthead" aria-labelledby="site-title">
        <div className="inscription-kicker">
          <span>{eyebrow}</span>
        </div>
        <h1 id="site-title" ref={headingRef} tabIndex={-1}>
          {title}
        </h1>
        <p className="lens-lead">
          {lead} <span>{intro}</span>
        </p>
      </section>

      <div className="systems-ledger-grid">
        {projects.map((item) => (
          <SystemArtifact key={item.id} item={item} defaultPlateOpen={true} />
        ))}
      </div>
    </>
  );
}
