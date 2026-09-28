import { useRef, useState } from "react";
import { siteContent } from "../data/siteContent";
import { Glyph } from "./CardIcons";

export function MobileWorkCarousel() {
  const projects = siteContent.projectsPage.projects;
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function goTo(index: number) {
    const element = track.current;
    const card = element?.children[index] as HTMLElement | undefined;
    if (element && card)
      element.scrollTo({
        left: card.offsetLeft,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  function onScroll() {
    const element = track.current;
    if (!element) return;
    const positions = Array.from(element.children, (child) =>
      Math.abs((child as HTMLElement).offsetLeft - element.scrollLeft),
    );
    setActive(positions.indexOf(Math.min(...positions)));
  }
  return (
    <section className="mobile-work" aria-label="Selected work carousel">
      <div className="mobile-work-heading">
        <span className="eyebrow">SELECTED WORK</span>
        <span>
          Swipe to explore <span aria-hidden="true">↔</span>
        </span>
      </div>
      <div
        className="mobile-work-track"
        ref={track}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Swipe through five projects"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(
              Math.max(
                0,
                Math.min(
                  projects.length - 1,
                  active + (event.key === "ArrowRight" ? 1 : -1),
                ),
              ),
            );
          }
        }}
      >
        {projects.map((project, index) => (
          <a
            className="mobile-project"
            key={project.id}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.name} — ${project.category}`}
          >
            <div className="mobile-project-image">
              <img
                src={project.screenshots.web.src}
                alt={project.screenshots.web.alt}
                loading={index ? "lazy" : "eager"}
              />
              <span className="mobile-project-number">0{index + 1}</span>
            </div>
            <div className="mobile-project-copy">
              <div>
                <h3>{project.name}</h3>
                <p>{project.category}</p>
              </div>
              <span className="mobile-project-arrow">
                <Glyph name="arrow" />
              </span>
            </div>
          </a>
        ))}
      </div>
      <div className="mobile-carousel-controls">
        <span aria-live="polite">
          0{active + 1} <span>/ 05</span>
        </span>
        <div className="carousel-dots" aria-hidden="true">
          {projects.map((project, index) => (
            <i key={project.id} className={active === index ? "active" : ""} />
          ))}
        </div>
        <div>
          <button
            className="icon-button"
            aria-label="Previous project"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
          >
            <Glyph name="chevron" className="chevron-back" />
          </button>
          <button
            className="icon-button"
            aria-label="Next project"
            disabled={active === projects.length - 1}
            onClick={() => goTo(active + 1)}
          >
            <Glyph name="chevron" />
          </button>
        </div>
      </div>
    </section>
  );
}
