import { PerspectiveCamera, View } from '@react-three/drei';
import { Suspense, useState } from 'react';
import type { ProjectShowcaseItem } from '../../../data/siteContent';
import { useInViewProgress } from '../../../hooks/useInViewProgress';
import { DeviceGalleryScene } from '../portfolio/DeviceGalleryScene';

export type ProjectDeviceViewProps = {
  readonly project: ProjectShowcaseItem;
  readonly viewIndex: number;
};

export function ProjectDeviceView({ project, viewIndex }: ProjectDeviceViewProps) {
  const { isActive, progress, ref } = useInViewProgress({
    rootMargin: '160px 0px 160px 0px',
  });
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
      {isActive ? (
        <View className="project-device-view" index={viewIndex}>
          <PerspectiveCamera makeDefault fov={34} position={[0, 1.05, 4.15]} />
          <Suspense fallback={null}>
            <DeviceGalleryScene hoverTilt={hoverTilt} progress={progress} project={project} />
          </Suspense>
        </View>
      ) : (
        <div aria-hidden="true" className="project-device-stage-placeholder">
          <img alt="" decoding="async" loading="lazy" src={project.screenshots.web.src} />
        </div>
      )}

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
