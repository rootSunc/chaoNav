import type { ProjectId } from "./siteContent";

export type NoteId =
  | "note-pit"
  | "note-family"
  | "note-study"
  | "note-civic"
  | "note-pace";

export type NoteItem = {
  readonly id: NoteId;
  readonly index: string;
  readonly date: string;
  readonly title: string;
  readonly text: string;
  readonly body: string;
  readonly linkedProject: ProjectId;
};

export const notes: readonly NoteItem[] = [
  {
    id: "note-pit",
    index: "N.01",
    date: "OCT 2026",
    title: "Point-in-time data lakes on a single machine",
    text: "Why CNEquity uses Parquet, DuckDB, and row-level lineage instead of cloud wrappers.",
    body: "Backtests fail quietly when corporate actions, delistings, and index constituent changes leak across time. Building an 86-dataset local A-share data lake with strict point-in-time semantics and a native MCP server showed how far zero-daemon columnar storage can go on a single laptop—faster to verify, free of API quotas, and honest about what was actually known on any given Tuesday.",
    linkedProject: "cnequity",
  },
  {
    id: "note-family",
    index: "N.02",
    date: "AUG 2026",
    title: "Serverless glue for everyday family ops",
    text: "Headless browser polling, Finnish-to-English translation, and zero-VPS alerting with DaisyNotice.",
    body: "Not every automation needs a cluster. When daycare notices lived behind a web portal without push notifications, a scheduled Playwright workflow, deterministic state deduplication, and multi-channel webhooks turned a daily point of friction into a silent background utility that costs nothing to keep alive.",
    linkedProject: "daisynotice",
  },
  {
    id: "note-study",
    index: "N.03",
    date: "DEC 2025",
    title: "Calmer study tools",
    text: "Fewer surfaces, tighter loops, steady language progress without streak pressure.",
    body: "Most learning software optimizes for return notifications rather than comprehension. Evolving Sanakirja into Suomeksi meant placing morphological inflection, grammar context, and Anki-ready cards onto one quiet desk—built to be closed as soon as the word makes sense.",
    linkedProject: "suomeksi",
  },
  {
    id: "note-civic",
    index: "N.04",
    date: "OCT 2025",
    title: "Public data in daily life",
    text: "Weather, air, spot power, and commute distilled into one morning glance.",
    body: "Cities already publish remarkable telemetry, scattered across a dozen municipal endpoints. Piping Finnish weather warnings, HSL transit disruptions, air quality, and electricity prices through a Go + Next.js workspace turned noisy raw feeds into thirty seconds of calm before stepping out the door.",
    linkedProject: "arkiwatch",
  },
  {
    id: "note-pace",
    index: "N.05",
    date: "JUN 2025",
    title: "Shipping without burnout",
    text: "Errand-scale scope, clear architectural tradeoffs, and sustainable pace.",
    body: "Good software rarely requires heroic nights; it requires knowing where the boundary of the problem sits. Whether it is an 86-table market lake or a ten-second parking zone lookup, keeping dependencies thin and automated checks honest leaves room for the rest of life.",
    linkedProject: "qparking",
  },
];
