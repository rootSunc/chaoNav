import type { ReactNode } from "react";
import type { Copy } from "../content";
import type { ReadingState } from "../hooks/useLiveSources";

export type Provenance = {
  readonly state: ReadingState | "computed";
  readonly source: string;
  readonly at: Date | null;
};

export function describeProvenance(
  { state, source, at }: Provenance,
  t: Copy,
): string {
  if (state === "computed") return t.ledger.computed;
  if (state === "loading") return `${source} · ${t.ledger.loading}`;
  if (state === "unavailable") return `${source} · ${t.ledger.unavailable}`;
  const when = at
    ? state === "live"
      ? at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : at.toISOString().slice(0, 10)
    : "";
  return `${source} · ${t.ledger[state]}${when ? ` · ${when}` : ""}`;
}

type SourcedProps = {
  readonly provenance: Provenance;
  readonly t: Copy;
  readonly children: ReactNode;
};

/** A number that carries its receipt: hover or focus to see where it came from. */
export function Sourced({ provenance, t, children }: SourcedProps) {
  return (
    <span className="sourced" data-state={provenance.state} tabIndex={0}>
      {children}
      <span className="sourced-note" role="note">
        {describeProvenance(provenance, t)}
      </span>
    </span>
  );
}
