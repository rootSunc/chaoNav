import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { notes, type NoteId } from "../data/notes";
import {
  siteContent,
  type CadenceArtifactId,
  type ProjectId,
} from "../data/siteContent";
import type { useMusicPlayer } from "../hooks/useMusicPlayer";
import { CoastalContour } from "./CoastalContour";
import { FieldNotesLedger } from "./FieldNotesLedger";
import { Glyph } from "./CardIcons";
import { ScorePlayer } from "./ScorePlayer";
import type { Page, PageLinkProps } from "./SiteHeader";
import { SystemArtifact } from "./SystemArtifact";

type HomeViewProps = {
  readonly headingRef: RefObject<HTMLHeadingElement | null>;
  readonly mobile: boolean;
  readonly player: ReturnType<typeof useMusicPlayer>;
  readonly pageLink: (next: Page) => PageLinkProps;
  readonly onOpenContact: () => void;
};

type ThreadPath = {
  readonly key: string;
  readonly projectId: ProjectId;
  readonly cadenceId: CadenceArtifactId;
  readonly d: string;
  readonly yLeft: number;
  readonly yRight: number;
  readonly xRight: number;
};

export function HomeView({
  headingRef,
  mobile,
  player,
  pageLink,
  onOpenContact,
}: HomeViewProps) {
  const { profile, projectsPage } = siteContent;
  const [hoveredProject, setHoveredProject] = useState<ProjectId | null>(null);
  const [hoveredCadence, setHoveredCadence] =
    useState<CadenceArtifactId | null>(null);
  const [openNoteId, setOpenNoteId] = useState<NoteId | null>("note-pit");

  const stageRef = useRef<HTMLDivElement | null>(null);
  const spineRef = useRef<SVGSVGElement | null>(null);
  const projectEls = useRef<Map<ProjectId, HTMLElement>>(new Map());
  const cadenceEls = useRef<Map<CadenceArtifactId, HTMLElement>>(new Map());
  const [threads, setThreads] = useState<readonly ThreadPath[]>([]);
  const [spineHeight, setSpineHeight] = useState(800);

  const registerProjectRef = useCallback(
    (id: ProjectId, el: HTMLElement | null) => {
      if (el) projectEls.current.set(id, el);
      else projectEls.current.delete(id);
    },
    [],
  );

  const registerCadenceRef = useCallback(
    (id: CadenceArtifactId, el: HTMLElement | null) => {
      if (el) cadenceEls.current.set(id, el);
      else cadenceEls.current.delete(id);
    },
    [],
  );

  // Derive active resonance sets from whichever side is hovered/focused
  const { activeProjects, activeCadences, hasActiveResonance } = useMemo(() => {
    const projSet = new Set<ProjectId>();
    const cadSet = new Set<CadenceArtifactId>();

    if (hoveredProject) {
      projSet.add(hoveredProject);
      const found = projectsPage.projects.find((p) => p.id === hoveredProject);
      found?.resonances.forEach((c) => cadSet.add(c));
    }

    if (hoveredCadence) {
      cadSet.add(hoveredCadence);
      for (const proj of projectsPage.projects) {
        if (
          (proj.resonances as readonly CadenceArtifactId[]).includes(
            hoveredCadence,
          )
        ) {
          projSet.add(proj.id);
        }
      }
    }

    return {
      activeProjects: projSet,
      activeCadences: cadSet,
      hasActiveResonance: projSet.size > 0 || cadSet.size > 0,
    };
  }, [hoveredCadence, hoveredProject, projectsPage.projects]);

  const recomputeThreads = useCallback(() => {
    if (mobile) return;
    const spine = spineRef.current;
    const stage = stageRef.current;
    if (!spine || !stage) return;

    const spineRect = spine.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    if (spineRect.width <= 0 || stageRect.height <= 0) return;

    const width = spineRect.width;
    const nextHeight = Math.max(400, Math.round(stageRect.height));
    setSpineHeight(nextHeight);

    const computed: ThreadPath[] = [];

    for (const proj of projectsPage.projects) {
      const leftEl = projectEls.current.get(proj.id);
      if (!leftEl) continue;
      const leftRect = leftEl.getBoundingClientRect();
      const yLeft = leftRect.top - stageRect.top + Math.min(76, leftRect.height * 0.32);

      for (const cadId of proj.resonances) {
        const rightEl = cadenceEls.current.get(cadId);
        if (!rightEl) continue;
        const rightRect = rightEl.getBoundingClientRect();
        const yRight =
          rightRect.top - stageRect.top + Math.min(52, rightRect.height * 0.42);

        const c1x = width * 0.44;
        const c2x = width * 0.56;
        const d = `M 0 ${yLeft.toFixed(1)} C ${c1x.toFixed(1)} ${yLeft.toFixed(1)}, ${c2x.toFixed(1)} ${yRight.toFixed(1)}, ${width.toFixed(1)} ${yRight.toFixed(1)}`;

        computed.push({
          key: `${proj.id}->${cadId}`,
          projectId: proj.id,
          cadenceId: cadId,
          d,
          yLeft,
          yRight,
          xRight: Math.max(4, width - 2),
        });
      }
    }

    setThreads(computed);
  }, [mobile, projectsPage.projects]);

  useLayoutEffect(() => {
    recomputeThreads();
  }, [recomputeThreads, openNoteId]);

  useEffect(() => {
    if (mobile) return;
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      recomputeThreads();
    });
    observer.observe(stage);
    projectEls.current.forEach((el) => observer.observe(el));
    cadenceEls.current.forEach((el) => observer.observe(el));

    window.addEventListener("resize", recomputeThreads);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recomputeThreads);
    };
  }, [mobile, recomputeThreads]);

  function focusCadenceArtifact(target: CadenceArtifactId) {
    if (notes.some((n) => n.id === target)) {
      setOpenNoteId(target as NoteId);
    }
    setHoveredCadence(target);
    const el = cadenceEls.current.get(target);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function focusProjectArtifact(projectId: ProjectId) {
    setHoveredProject(projectId);
    const el = projectEls.current.get(projectId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <section className="workbench-inscription" aria-labelledby="site-title">
        <div className="inscription-lead">
          <div className="inscription-kicker">
            <span>CONTRAPUNTAL WORKBENCH</span>
            <span className="kicker-rule" aria-hidden="true" />
            <span>{profile.place.toUpperCase()}</span>
          </div>

          <h1 id="site-title" ref={headingRef} tabIndex={-1}>
            {profile.inscription}
          </h1>
        </div>

        <aside className="inscription-colophon" aria-label="Identity summary">
          <p>{profile.subInscription}</p>
          <div className="inscription-links">
            <a {...pageLink("projects")} className="quiet-inline-link">
              <span>Inspect all 5 plates</span>
              <Glyph name="arrow" />
            </a>
            <button
              type="button"
              className="quiet-inline-link"
              onClick={onOpenContact}
            >
              <span>Leave a note</span>
              <Glyph name="arrow" />
            </button>
          </div>
        </aside>
      </section>

      <div ref={stageRef} className="workbench-stage">
        <section
          className="voice-column voice-systems"
          aria-labelledby="voice-systems-heading"
        >
          <div className="voice-header">
            <h2 id="voice-systems-heading">I. Systems</h2>
            <span>Architecture · Working micro-specimens</span>
          </div>

          <div className="systems-stack">
            {projectsPage.projects.map((item) => {
              const isResonant = activeProjects.has(item.id);
              const isDimmed = hasActiveResonance && !isResonant;
              return (
                <SystemArtifact
                  key={item.id}
                  item={item}
                  isResonant={isResonant}
                  isDimmed={isDimmed}
                  onHoverProject={setHoveredProject}
                  onSelectCadence={focusCadenceArtifact}
                  registerRef={(el) => registerProjectRef(item.id, el)}
                />
              );
            })}
          </div>
        </section>

        {!mobile && (
          <div className="resonance-spine" aria-hidden="true">
            <div className="spine-axis-label">RESONANCE</div>
            <svg
              ref={spineRef}
              className="resonance-svg"
              style={{ height: `${spineHeight}px` }}
            >
              {threads.map((thread) => {
                const isLit =
                  activeProjects.has(thread.projectId) &&
                  activeCadences.has(thread.cadenceId);
                const isFaded = hasActiveResonance && !isLit;
                return (
                  <g
                    key={thread.key}
                    className={`resonance-thread ${isLit ? "is-lit" : ""} ${isFaded ? "is-faded" : ""}`}
                  >
                    <path d={thread.d} fill="none" />
                    <circle cx="2" cy={thread.yLeft} r="2.2" />
                    <circle cx={thread.xRight} cy={thread.yRight} r="2.2" />
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        <section
          className="voice-column voice-cadence"
          aria-labelledby="voice-cadence-heading"
        >
          <div className="voice-header">
            <h2 id="voice-cadence-heading">II. Cadence</h2>
            <span>Sound · Coastline · Marginalia</span>
          </div>

          <div className="cadence-stack">
            <ScorePlayer
              player={player}
              isResonant={activeCadences.has("score")}
              isDimmed={hasActiveResonance && !activeCadences.has("score")}
              onHoverCadence={setHoveredCadence}
              registerRef={(el) => registerCadenceRef("score", el)}
            />

            <CoastalContour
              isResonant={activeCadences.has("coast")}
              isDimmed={hasActiveResonance && !activeCadences.has("coast")}
              onHoverCadence={setHoveredCadence}
              registerRef={(el) => registerCadenceRef("coast", el)}
            />

            <FieldNotesLedger
              openNoteId={openNoteId}
              onToggleNote={(id) =>
                setOpenNoteId((curr) => (curr === id ? null : id))
              }
              activeCadenceIds={activeCadences}
              hasActiveFilter={hasActiveResonance}
              onHoverCadence={setHoveredCadence}
              onSelectProject={focusProjectArtifact}
              registerNoteRef={registerCadenceRef}
            />
          </div>
        </section>
      </div>
    </>
  );
}
