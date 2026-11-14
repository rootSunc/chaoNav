import { useState } from "react";
import type {
  CadenceArtifactId,
  ProjectId,
  ProjectShowcaseItem,
} from "../data/siteContent";
import { Glyph } from "./CardIcons";
import { ProjectMicroSpecimen } from "./specimens/ProjectSpecimens";

type SystemArtifactProps = {
  readonly item: ProjectShowcaseItem;
  readonly defaultPlateOpen?: boolean;
  readonly isResonant?: boolean;
  readonly isDimmed?: boolean;
  readonly onHoverProject?: (id: ProjectId | null) => void;
  readonly onSelectCadence?: (target: CadenceArtifactId) => void;
  readonly registerRef?: (el: HTMLElement | null) => void;
};

export function SystemArtifact({
  item,
  defaultPlateOpen = false,
  isResonant = false,
  isDimmed = false,
  onHoverProject,
  onSelectCadence,
  registerRef,
}: SystemArtifactProps) {
  const [plateOpen, setPlateOpen] = useState(defaultPlateOpen);
  const plateId = `plate-${item.id}`;

  return (
    <article
      ref={registerRef}
      data-project-id={item.id}
      className={`system-specimen ${isResonant ? "is-resonant" : ""} ${isDimmed ? "is-dimmed" : ""}`}
      onPointerEnter={() => onHoverProject?.(item.id)}
      onPointerLeave={() => onHoverProject?.(null)}
      onFocus={() => onHoverProject?.(item.id)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onHoverProject?.(null);
        }
      }}
    >
      <header className="specimen-header">
        <div className="specimen-meta-line">
          <span className="specimen-index">{item.index}</span>
          <span className="specimen-category">{item.category}</span>
          <span className="specimen-stack">{item.stackMark}</span>
        </div>

        <div className="specimen-title-row">
          <h2>
            <a href={item.href} target="_blank" rel="noreferrer">
              <span>{item.name}</span>
              <Glyph name="arrow" />
            </a>
          </h2>
        </div>

        <p className="specimen-summary">{item.summary}</p>
      </header>

      <ProjectMicroSpecimen projectId={item.id} />

      <div className="specimen-footer">
        <button
          type="button"
          className="resonance-cue"
          onClick={() => {
            if (item.resonances[0]) {
              onSelectCadence?.(item.resonances[0]);
            }
          }}
          title="Highlight paired cadence note"
        >
          <span className="resonance-node" aria-hidden="true" />
          <span className="resonance-line-copy">{item.resonanceLine}</span>
        </button>

        <div className="specimen-actions">
          <button
            type="button"
            className="plate-toggle-btn"
            aria-expanded={plateOpen}
            aria-controls={plateId}
            onClick={() => setPlateOpen((v) => !v)}
          >
            <span>{plateOpen ? "Close plate" : "Interface plate"}</span>
            <Glyph name="plus" className={plateOpen ? "is-rotated" : ""} />
          </button>

          <a
            className="specimen-direct-link"
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            <span>{item.ctaLabel}</span>
            <Glyph name="arrow" />
          </a>
        </div>
      </div>

      <div className="specimen-plate" id={plateId} hidden={!plateOpen}>
        <div className="plate-frame">
          <img
            src={item.screenshots.web.src}
            alt={item.screenshots.web.alt}
            loading={defaultPlateOpen ? "eager" : "lazy"}
          />
        </div>
        <div className="plate-details">
          <ul className="plate-highlights">
            {item.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="plate-note">{item.note}</p>
        </div>
      </div>
    </article>
  );
}
