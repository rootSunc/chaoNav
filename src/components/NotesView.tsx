import { useState, type RefObject } from "react";
import type { NoteId } from "../data/notes";
import type { useMusicPlayer } from "../hooks/useMusicPlayer";
import { CoastalContour } from "./CoastalContour";
import { FieldNotesLedger } from "./FieldNotesLedger";
import { ScorePlayer } from "./ScorePlayer";

export function NotesView({
  headingRef,
  player,
}: {
  readonly headingRef: RefObject<HTMLHeadingElement | null>;
  readonly player: ReturnType<typeof useMusicPlayer>;
}) {
  const [openNoteId, setOpenNoteId] = useState<NoteId | null>(null);

  return (
    <>
      <section className="lens-masthead" aria-labelledby="site-title">
        <div className="inscription-kicker">
          <span>II. CADENCE & MARGINALIA</span>
        </div>
        <h1 id="site-title" ref={headingRef} tabIndex={-1}>
          Cadence
        </h1>
        <p className="lens-lead">
          Field notes, chamber recordings, and coastal geometry.{" "}
          <span>
            Observations on local-first architecture, everyday tools, and
            keeping a sustainable human pace in Helsinki.
          </span>
        </p>
      </section>

      <div className="cadence-lens-layout">
        <div className="cadence-lens-notes">
          <FieldNotesLedger
            openNoteId={openNoteId}
            onToggleNote={(id) =>
              setOpenNoteId((curr) => (curr === id ? null : id))
            }
          />
        </div>

        <aside className="cadence-lens-companions" aria-label="Sound and place">
          <ScorePlayer player={player} />
          <CoastalContour />
        </aside>
      </div>
    </>
  );
}
