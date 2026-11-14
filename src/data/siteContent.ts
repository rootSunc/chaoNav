import type { NoteId } from "./notes";

type NonEmptyArray<T> = readonly [T, ...T[]];

export type ProjectId =
  | "cnequity"
  | "arkiwatch"
  | "suomeksi"
  | "daisynotice"
  | "qparking";

export type CadenceArtifactId = NoteId | "score" | "coast";

export type Profile = {
  readonly name: string;
  readonly fullName: string;
  readonly coordinates: string;
  readonly place: string;
  readonly inscription: string;
  readonly subInscription: string;
  readonly email: string;
  readonly githubUrl: string;
  readonly linkedinUrl: string;
};

export type ProjectShowcaseItem = {
  readonly id: ProjectId;
  readonly index: string;
  readonly name: string;
  readonly category: string;
  readonly stackMark: string;
  readonly headline: string;
  readonly summary: string;
  readonly resonanceLine: string;
  readonly resonances: readonly CadenceArtifactId[];
  readonly href: string;
  readonly ctaLabel: string;
  readonly external: boolean;
  readonly screenshots: {
    readonly web: {
      readonly src: string;
      readonly alt: string;
    };
  };
  readonly highlights: readonly [string, string];
  readonly note: string;
};

export type ProjectsPageContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly intro: string;
  readonly projects: NonEmptyArray<ProjectShowcaseItem>;
};

export type SiteContent = {
  readonly profile: Profile;
  readonly projectsPage: ProjectsPageContent;
};

export const siteContent = {
  profile: {
    name: "Chao Sun",
    fullName: "Chao Sun",
    coordinates: "60°10′N · 24°56′E",
    place: "Helsinki",
    inscription:
      "Systems built for permanence; instruments shaped by everyday life in the north.",
    subInscription:
      "Software architect and builder working across local-first data infrastructure, civic telemetry, and quiet daily tools.",
    email: "chao.sun.me@gmail.com",
    githubUrl: "https://github.com/rootSunc",
    linkedinUrl: "https://www.linkedin.com/in/chaosun526/",
  },
  projectsPage: {
    eyebrow: "I. SYSTEMS LEDGER / 2024–2026",
    title: "Systems",
    lead: "Local-first infrastructure, civic telemetry, and calm daily instruments.",
    intro:
      "Five working systems—each represented first by how it thinks, with full interface plates and live deployments beneath.",
    projects: [
      {
        id: "cnequity",
        index: "01",
        name: "CNEquity",
        category: "Data infrastructure · MCP",
        stackMark: "Parquet · DuckDB · Python · MCP",
        headline:
          "Open-source China A-share local data lake and point-in-time quant research stack.",
        summary:
          "Self-hosted columnar data lake covering 86 daily-updated datasets with strict point-in-time adjustments, historical constituents, row-level lineage, and a native MCP server—paired with EquityLab for factor research.",
        resonanceLine:
          "Temporal discipline: history held invariant, like measures in a score.",
        resonances: ["note-pit", "score"],
        href: "https://github.com/rootSunc/CNEquity",
        ctaLabel: "Explore CNEquity",
        external: true,
        screenshots: {
          web: {
            src: "/images/projects/ashare-web.jpg",
            alt: "CNEquity and EquityLab quant research workbench screenshot",
          },
        },
        highlights: [
          "86 daily Parquet/DuckDB datasets with strict point-in-time lineage",
          "Native MCP server + EquityLab factor & walk-forward backtest workbench",
        ],
        note: "1,000+ GitHub stars—token-free, single-machine data infrastructure for research and agents.",
      },
      {
        id: "arkiwatch",
        index: "02",
        name: "ArkiWatch",
        category: "Civic telemetry",
        stackMark: "Go · Next.js · Open APIs",
        headline:
          "Live Finland public-data workspace turning municipal signals into one morning view.",
        summary:
          "Aggregates weather warnings, air quality, HSL transit disruptions, electricity spot prices, and city events across Finland into a single calm operational surface.",
        resonanceLine:
          "Born from checking wind, air, and rail before heading out into Helsinki.",
        resonances: ["note-civic", "coast"],
        href: "https://arkiwatch.chaosun.xyz/",
        ctaLabel: "Open ArkiWatch",
        external: true,
        screenshots: {
          web: {
            src: "/images/projects/arkiwatch-web.jpg",
            alt: "ArkiWatch live dashboard web screenshot",
          },
        },
        highlights: [
          "Weather, HSL transit, air quality, and NordPool spot energy feeds",
          "Go ingestion pipeline + calm morning operating view",
        ],
        note: "Public endpoints distilled into one glance—signal clarity over dashboard sprawl.",
      },
      {
        id: "suomeksi",
        index: "03",
        name: "Suomeksi",
        category: "Language workspace",
        stackMark: "TypeScript · Morphology · SRS",
        headline:
          "Self-hostable Finnish dictionary, morphological analyzer, and study workspace.",
        summary:
          "Places morphological inflection lookup, grammar reference, bilingual context, and Anki-ready flashcards onto one quiet study desk at sanakirja.chaosun.xyz.",
        resonanceLine:
          "Unpacking an agglutinative language one root at a time, without streak noise.",
        resonances: ["note-study"],
        href: "https://sanakirja.chaosun.xyz/",
        ctaLabel: "Open Suomeksi",
        external: true,
        screenshots: {
          web: {
            src: "/images/projects/sanakirja-web.jpg",
            alt: "Suomeksi Finnish dictionary and study workspace screenshot",
          },
        },
        highlights: [
          "Morphological stem & case lookup paired with grammar context",
          "Spaced-repetition flashcards & personal notebook without gamification",
        ],
        note: "Evolved from Sanakirja—steady comprehension over daily notification pressure.",
      },
      {
        id: "daisynotice",
        index: "04",
        name: "DaisyNotice",
        category: "Zero-VPS automation",
        stackMark: "Playwright · GitHub Actions · Webhooks",
        headline:
          "Daycare bulletin monitor with Finnish-to-English translation and deduplicated fanout.",
        summary:
          "Polls Pilke DaisyFamily on a serverless schedule via headless Playwright, translates notices into English, and dispatches deduplicated alerts with attachments to Telegram, Email, and WeChat Work.",
        resonanceLine:
          "Quiet domestic reliability so a rain-gear note never slips past a busy morning.",
        resonances: ["note-family"],
        href: "https://github.com/rootSunc/DaisyNotice",
        ctaLabel: "View DaisyNotice",
        external: true,
        screenshots: {
          web: {
            src: "/images/projects/daisynotice-web.jpg",
            alt: "DaisyNotice message monitor and translation pipeline screenshot",
          },
        },
        highlights: [
          "Headless Playwright polling with deterministic state deduplication",
          "Automatic FI→EN translation & multi-channel family fanout",
        ],
        note: "Runs entirely on scheduled GitHub Actions—zero servers to babysit.",
      },
      {
        id: "qparking",
        index: "05",
        name: "QParking",
        category: "Urban utility",
        stackMark: "GeoJSON · Capital Region · PWA",
        headline:
          "Helsinki, Espoo, and Vantaa parking-zone lookup with instant rate comparison.",
        summary:
          "A compact urban instrument for the Finnish capital region that makes municipal and commercial parking zones, hourly rates, and map handoff effortless to scan curbside.",
        resonanceLine:
          "Scoped strictly to the ten seconds between pulling over and locking the door.",
        resonances: ["note-pace", "coast"],
        href: "https://qparking.chaosun.xyz/",
        ctaLabel: "Open QParking",
        external: true,
        screenshots: {
          web: {
            src: "/images/projects/qparking-web.jpg",
            alt: "QParking web screenshot",
          },
        },
        highlights: [
          "Helsinki, Espoo & Vantaa municipal zone and tariff comparison",
          "Errand-scale mobile flow with instant map handoff",
        ],
        note: "Small on purpose: scan capital-region zones, decide, and move on.",
      },
    ],
  },
} satisfies SiteContent;
