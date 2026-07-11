import { Suspense, useState } from 'react';
import type { ProjectShowcaseItem } from '../../data/siteContent';
import { useInViewProgress } from '../../hooks/useInViewProgress';
import type { SceneQuality } from '../../hooks/useSceneQuality';
import { EmbeddedSceneCanvas } from './EmbeddedSceneCanvas';
import { DeviceGalleryScene } from './portfolio/DeviceGalleryScene';

export type ProjectDeviceStageProps = {
  readonly project: ProjectShowcaseItem;
  readonly quality: Exclude<SceneQuality, 'off'>;
};

export function ProjectDeviceStage({ project, quality }: ProjectDeviceStageProps) {
  const { isActive, progress, ref } = useInViewProgress();
  const [hoverTilt, setHoverTilt] = useState(0);

  return (
    <div
      className="project-device-stage"
      onPointerLeave={() => setHoverTilt(0)}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;

        setHoverTilt(normalizedX);
      }}
      ref={ref}
    >
      <EmbeddedSceneCanvas
        camera={{ fov: 34, position: [0, 1.05, 4.15] }}
        isActive={isActive}
        quality={quality}
      >
        <Suspense fallback={null}>
          <DeviceGalleryScene hoverTilt={hoverTilt} progress={progress} project={project} />
        </Suspense>
      </EmbeddedSceneCanvas>

      <a
        aria-label={`${project.name} web screenshot opens project`}
        className="project-device-link project-device-link-web"
        href={project.href}
        rel={project.external ? 'noreferrer' : undefined}
        target={project.external ? '_blank' : undefined}
      />
      <a
        aria-label={`${project.name} mobile screenshot opens project`}
        className="project-device-link project-device-link-mobile"
        href={project.href}
        rel={project.external ? 'noreferrer' : undefined}
        target={project.external ? '_blank' : undefined}
      />
    </div>
  );
}
