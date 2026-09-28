import { useState, type MouseEvent } from "react";
import { Glyph } from "./CardIcons";
import { siteContent } from "../data/siteContent";

export function FeaturedWork({
  projectsLink,
}: {
  projectsLink: {
    href: string;
    onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  };
}) {
  const [featured, setFeatured] = useState(0);
  const project = siteContent.projectsPage.projects[featured];
  return (
    <article className="orbit-card work-card">
      <div className="card-topline">
        <span className="eyebrow">
          <Glyph name="code" /> SELECTED WORK
        </span>
        <a
          className="icon-button"
          {...projectsLink}
          aria-label="View all projects"
        >
          <Glyph name="arrow" />
        </a>
      </div>
      <a
        className="featured-project"
        key={project.id}
        href={project.href}
        target="_blank"
        rel="noreferrer"
      >
        <div className="featured-text">
          <h3>{project.name}</h3>
          <p>{project.category}, thoughtfully built.</p>
        </div>
        <div className="project-preview">
          <div className="browser-chrome">
            <i />
            <i />
            <i />
            <span>{new URL(project.href).hostname}</span>
          </div>
          <img
            src={project.screenshots.web.src}
            alt={project.screenshots.web.alt}
          />
        </div>
      </a>
      <div className="project-selector" aria-label="Featured projects">
        {siteContent.projectsPage.projects.map((item, index) => (
          <button
            key={item.id}
            aria-label={`Show ${item.name}`}
            aria-pressed={featured === index}
            className={featured === index ? "selected" : ""}
            onClick={() => setFeatured(index)}
          />
        ))}
        <span>
          0{featured + 1} / 0{siteContent.projectsPage.projects.length}
        </span>
      </div>
    </article>
  );
}
