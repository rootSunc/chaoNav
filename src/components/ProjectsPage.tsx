import { Suspense, lazy, useEffect } from 'react';
import type { ProjectShowcaseItem, ProjectsPageContent } from '../data/siteContent';
import type { SceneQuality } from '../hooks/useSceneQuality';
import { preloadProjectTextures } from '../lib/sceneTextures';
import type { CssVars } from '../lib/cssVars';
import { ExternalMark } from './ExternalMark';
import { SceneErrorBoundary } from './scene/SceneErrorBoundary';

const ProjectDeviceView = lazy(() =>
  import('./scene/shared/ProjectDeviceView').then((module) => ({
    default: module.ProjectDeviceView,
  })),
);

type ProjectsPageProps = {
  readonly content: ProjectsPageContent;
  readonly onBackHome: () => void;
  readonly projectStage: boolean;
  readonly sceneQuality: SceneQuality;
};

function ClassicProjectScreens({ project }: { readonly project: ProjectShowcaseItem }) {
  return (
    <div aria-label={`${project.name} screenshots`} className="portfolio-screens">
      <a
        aria-label={`${project.name} web screenshot opens project`}
        className="portfolio-screen portfolio-screen-web"
        href={project.href}
        rel={project.external ? 'noreferrer' : undefined}
        target={project.external ? '_blank' : undefined}
      >
        <span aria-hidden="true">Web</span>
        <img
          alt={project.screenshots.web.alt}
          decoding="async"
          loading="lazy"
          src={project.screenshots.web.src}
        />
      </a>
      <a
        aria-label={`${project.name} mobile screenshot opens project`}
        className="portfolio-screen portfolio-screen-mobile"
        href={project.href}
        rel={project.external ? 'noreferrer' : undefined}
        target={project.external ? '_blank' : undefined}
      >
        <span aria-hidden="true">Mobile</span>
        <img
          alt={project.screenshots.mobile.alt}
          decoding="async"
          loading="lazy"
          src={project.screenshots.mobile.src}
        />
      </a>
    </div>
  );
}

function ProjectScreens({
  project,
  projectStage,
  sceneQuality,
  viewIndex,
}: {
  readonly project: ProjectShowcaseItem;
  readonly projectStage: boolean;
  readonly sceneQuality: SceneQuality;
  readonly viewIndex: number;
}) {
  const showDeviceStage = projectStage && sceneQuality !== 'off';

  if (showDeviceStage) {
    return (
      <div
        aria-label={`${project.name} screenshots`}
        className="portfolio-screens has-device-stage"
      >
        <Suspense fallback={<ClassicProjectScreens project={project} />}>
          <SceneErrorBoundary
            fallback={<ClassicProjectScreens project={project} />}
            label={`project-${project.id}`}
          >
            <ProjectDeviceView project={project} viewIndex={viewIndex} />
          </SceneErrorBoundary>
        </Suspense>
      </div>
    );
  }

  return <ClassicProjectScreens project={project} />;
}

function ProjectItem({
  project,
  index,
  projectStage,
  sceneQuality,
}: {
  readonly project: ProjectShowcaseItem;
  readonly index: number;
  readonly projectStage: boolean;
  readonly sceneQuality: SceneQuality;
}) {
  return (
    <article className="portfolio-project" style={{ '--project-index': index } as CssVars}>
      <div className="portfolio-project-copy">
        <p className="project-category">{project.category}</p>
        <h2>{project.name}</h2>
        <p className="project-headline">{project.headline}</p>
        <p className="project-summary">{project.summary}</p>
        <ul className="project-highlights">
          {project.highlights.map((highlight) => (
            <li key={`${project.id}-${highlight}`}>{highlight}</li>
          ))}
        </ul>
        {project.note ? <p className="project-note">{project.note}</p> : null}
        <a
          aria-label={`${project.ctaLabel} opens external site`}
          className="project-link"
          href={project.href}
          rel={project.external ? 'noreferrer' : undefined}
          target={project.external ? '_blank' : undefined}
        >
          <span>{project.ctaLabel}</span>
          <ExternalMark show={project.external} />
        </a>
      </div>

      <ProjectScreens
        project={project}
        projectStage={projectStage}
        sceneQuality={sceneQuality}
        viewIndex={index + 1}
      />
    </article>
  );
}

export function ProjectsPage({
  content,
  onBackHome,
  projectStage,
  sceneQuality,
}: ProjectsPageProps) {
  useEffect(() => {
    if (!projectStage || sceneQuality === 'off') {
      return;
    }

    preloadProjectTextures();
  }, [projectStage, sceneQuality]);

  return (
    <main className="projects-page" id="projects">
      <header className="projects-topbar">
        <button className="projects-brand" onClick={onBackHome} type="button">
          <span>Chao</span>
          <span>portfolio</span>
        </button>
        <nav aria-label="Projects page navigation" className="projects-nav">
          <button className="projects-nav-button" onClick={onBackHome} type="button">
            Home
          </button>
          <a className="projects-nav-button projects-nav-button-primary" href="mailto:chao.sun.me@gmail.com">
            Email
          </a>
        </nav>
      </header>

      <section aria-labelledby="projects-title" className="projects-hero">
        {content.eyebrow ? <p className="projects-eyebrow">{content.eyebrow}</p> : null}
        <h1 id="projects-title">{content.title}</h1>
        {content.intro ? <p className="projects-lede">{content.intro}</p> : null}
      </section>

      <section aria-label="Project portfolio" className="portfolio-list">
        {content.projects.map((project, index) => (
          <ProjectItem
            index={index}
            key={project.id}
            project={project}
            projectStage={projectStage}
            sceneQuality={sceneQuality}
          />
        ))}
      </section>
    </main>
  );
}
