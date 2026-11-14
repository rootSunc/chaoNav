import { notes, type NoteId } from "../data/notes";
import {
  siteContent,
  type CadenceArtifactId,
  type ProjectId,
} from "../data/siteContent";
import { Glyph } from "./CardIcons";

type FieldNotesLedgerProps = {
  readonly openNoteId: NoteId | null;
  readonly onToggleNote: (id: NoteId) => void;
  readonly activeCadenceIds?: ReadonlySet<CadenceArtifactId>;
  readonly hasActiveFilter?: boolean;
  readonly onHoverCadence?: (id: CadenceArtifactId | null) => void;
  readonly onSelectProject?: (projectId: ProjectId) => void;
  readonly registerNoteRef?: (id: NoteId, el: HTMLElement | null) => void;
};

export function FieldNotesLedger({
  openNoteId,
  onToggleNote,
  activeCadenceIds,
  hasActiveFilter = false,
  onHoverCadence,
  onSelectProject,
  registerNoteRef,
}: FieldNotesLedgerProps) {
  const { email } = siteContent.profile;
  const projectMap = new Map(
    siteContent.projectsPage.projects.map((p) => [p.id, p]),
  );

  return (
    <section className="field-notes-ledger" aria-label="Field notes">
      <div className="ledger-section-head">
        <span className="specimen-mono-label">MARGINALIA · FIELD NOTES</span>
        <span className="specimen-catalogue">2025–2026</span>
      </div>

      <div className="notes-stack">
        {notes.map((note) => {
          const isOpen = openNoteId === note.id;
          const isResonant = activeCadenceIds?.has(note.id) ?? false;
          const isDimmed = hasActiveFilter && !isResonant;
          const pairedProject = projectMap.get(note.linkedProject);

          return (
            <article
              key={note.id}
              ref={(el) => registerNoteRef?.(note.id, el)}
              data-cadence-id={note.id}
              className={`note-slip ${isOpen ? "is-open" : ""} ${isResonant ? "is-resonant" : ""} ${isDimmed ? "is-dimmed" : ""}`}
              onPointerEnter={() => onHoverCadence?.(note.id)}
              onPointerLeave={() => onHoverCadence?.(null)}
            >
              <button
                type="button"
                className="note-slip-toggle"
                aria-expanded={isOpen}
                aria-controls={`body-${note.id}`}
                onClick={() => onToggleNote(note.id)}
              >
                <span className="note-slip-meta">
                  <span className="note-slip-index">{note.index}</span>
                  <span className="note-slip-date">{note.date}</span>
                </span>

                <span className="note-slip-heading">
                  <span className="note-slip-title">{note.title}</span>
                  <span className="note-slip-dek">{note.text}</span>
                </span>

                <Glyph
                  name="plus"
                  className={`note-slip-glyph ${isOpen ? "is-rotated" : ""}`}
                />
              </button>

              <div
                id={`body-${note.id}`}
                className="note-slip-body"
                hidden={!isOpen}
              >
                <p>{note.body}</p>
                <div className="note-slip-links">
                  {pairedProject && onSelectProject ? (
                    <button
                      type="button"
                      className="note-counterpart-btn"
                      onClick={() => onSelectProject(pairedProject.id)}
                    >
                      <span className="resonance-node" aria-hidden="true" />
                      <span>Counterpart: {pairedProject.name}</span>
                    </button>
                  ) : pairedProject ? (
                    <a
                      className="note-counterpart-btn"
                      href={pairedProject.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="resonance-node" aria-hidden="true" />
                      <span>Counterpart: {pairedProject.name}</span>
                      <Glyph name="arrow" />
                    </a>
                  ) : null}

                  <a
                    className="note-essay-link"
                    href={`mailto:${email}?subject=${encodeURIComponent(`Essay request: ${note.title}`)}`}
                  >
                    <span>Ask for the longer essay</span>
                    <Glyph name="arrow" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
