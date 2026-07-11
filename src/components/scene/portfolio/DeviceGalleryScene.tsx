import { ContactShadows, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { ProjectShowcaseItem } from '../../../data/siteContent';
import { getProjectThemeColor } from './projectThemeColors';

export type DeviceGallerySceneProps = {
  readonly hoverTilt: number;
  readonly progress: number;
  readonly project: ProjectShowcaseItem;
};

function WebDevice({
  hoverTilt,
  progress,
  texture,
}: {
  readonly hoverTilt: number;
  readonly progress: number;
  readonly texture: THREE.Texture;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0.52);
  const targetScale = useRef(0.9);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    targetRotation.current = THREE.MathUtils.lerp(0.52, 0.06 + hoverTilt * 0.08, progress);
    targetScale.current = THREE.MathUtils.lerp(0.9, 1, progress);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      1 - Math.exp(-4.5 * delta),
    );
    const nextScale = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      targetScale.current,
      1 - Math.exp(-4.5 * delta),
    );
    groupRef.current.scale.setScalar(nextScale);
  });

  return (
    <group position={[0.42, 0.02, 0]} ref={groupRef}>
      <mesh castShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[2.55, 0.12, 1.72]} />
        <meshStandardMaterial color="#d9d9d9" metalness={0.58} roughness={0.34} />
      </mesh>
      <group position={[0, 0.72, -0.82]} rotation={[-0.24, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.45, 1.52, 0.06]} />
          <meshStandardMaterial color="#171818" metalness={0.42} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[2.2, 1.28]} />
          <meshStandardMaterial map={texture} metalness={0.05} roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
}

function MobileDevice({
  hoverTilt,
  progress,
  texture,
}: {
  readonly hoverTilt: number;
  readonly progress: number;
  readonly texture: THREE.Texture;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    const targetRotation = THREE.MathUtils.lerp(-0.42, -0.1 - hoverTilt * 0.1, progress);
    const targetScale = THREE.MathUtils.lerp(0.86, 1, progress);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      1 - Math.exp(-4.5 * delta),
    );
    const nextScale = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      targetScale,
      1 - Math.exp(-4.5 * delta),
    );
    groupRef.current.scale.setScalar(nextScale);
  });

  return (
    <group position={[-1.02, 0.12, 0.42]} ref={groupRef}>
      <mesh castShadow>
        <boxGeometry args={[0.44, 0.88, 0.05]} />
        <meshStandardMaterial color="#121212" metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0, 0.028]}>
        <planeGeometry args={[0.37, 0.75]} />
        <meshStandardMaterial map={texture} metalness={0.05} roughness={0.92} />
      </mesh>
    </group>
  );
}

export function DeviceGalleryScene({ hoverTilt, progress, project }: DeviceGallerySceneProps) {
  const [webTexture, mobileTexture] = useTexture([
    project.screenshots.web.src,
    project.screenshots.mobile.src,
  ]);
  const accentColor = getProjectThemeColor(project.id);

  webTexture.colorSpace = THREE.SRGBColorSpace;
  mobileTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <ambientLight intensity={0.68} />
      <directionalLight castShadow intensity={1.08} position={[3.4, 4.8, 2.6]} />
      <directionalLight color={accentColor} intensity={0.28} position={[-2.2, 1.8, -1.4]} />
      <pointLight color={accentColor} intensity={0.42} position={[0.4, 1.2, 1.8]} />

      <mesh position={[0, -0.18, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.85, 48]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.12}
          metalness={0.18}
          roughness={0.72}
        />
      </mesh>

      <WebDevice hoverTilt={hoverTilt} progress={progress} texture={webTexture} />
      <MobileDevice hoverTilt={hoverTilt} progress={progress} texture={mobileTexture} />

      <ContactShadows blur={2.2} far={4} opacity={0.32} position={[0, -0.17, 0]} scale={4.4} />
    </>
  );
}
