import { ContactShadows } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLabelTexture } from './useLabelTexture';

export type TurntableSceneProps = {
  readonly accentColor: string;
  readonly activeLinkLabel: string;
  readonly hoverTilt: number;
  readonly isPlaying: boolean;
};

const ROTATION_SPEED = (33.333 * Math.PI * 2) / 60;

function VinylDisc({
  accentColor,
  activeLinkLabel,
  isPlaying,
}: {
  readonly accentColor: string;
  readonly activeLinkLabel: string;
  readonly isPlaying: boolean;
}) {
  const discRef = useRef<THREE.Group>(null);
  const labelTexture = useLabelTexture(activeLinkLabel, accentColor);

  useFrame((_, delta) => {
    if (isPlaying && discRef.current) {
      discRef.current.rotation.y += delta * ROTATION_SPEED;
    }
  });

  return (
    <group position={[0, 0.43, 0]} ref={discRef}>
      <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.96, 0.96, 0.07, 64]} />
        <meshStandardMaterial color="#1d1d1d" metalness={0.42} roughness={0.34} />
      </mesh>
      <mesh castShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.038, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.02, 64]} />
        <meshStandardMaterial color="#101010" metalness={0.58} roughness={0.22} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.052, 0]}>
        <circleGeometry args={[0.24, 32]} />
        <meshStandardMaterial map={labelTexture} metalness={0.15} roughness={0.62} />
      </mesh>
    </group>
  );
}

function ToneArm({ isPlaying }: { readonly isPlaying: boolean }) {
  const armRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(isPlaying ? -0.18 : -0.92);

  useEffect(() => {
    targetRotation.current = isPlaying ? -0.18 : -0.92;
  }, [isPlaying]);

  useFrame((_, delta) => {
    if (!armRef.current) {
      return;
    }

    armRef.current.rotation.y = THREE.MathUtils.lerp(
      armRef.current.rotation.y,
      targetRotation.current,
      1 - Math.exp(-3.6 * delta),
    );
  });

  return (
    <group position={[0.98, 0.5, 0]} ref={armRef} rotation={[0, -0.92, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.09, 20]} />
        <meshStandardMaterial color="#8f8f8f" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh castShadow position={[0.34, 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.024, 0.024, 0.72, 12]} />
        <meshStandardMaterial color="#d2d2d2" metalness={0.92} roughness={0.12} />
      </mesh>
      <mesh castShadow position={[0.69, 0.015, 0]}>
        <boxGeometry args={[0.13, 0.06, 0.09]} />
        <meshStandardMaterial color="#242424" metalness={0.72} roughness={0.28} />
      </mesh>
    </group>
  );
}

function GramophoneHorn() {
  return (
    <group position={[-0.62, 0.98, 0.12]} rotation={[0.28, 0.45, -0.18]}>
      <mesh castShadow>
        <coneGeometry args={[0.58, 0.92, 36, 1, true]} />
        <meshStandardMaterial
          color="#c7a06a"
          metalness={0.68}
          roughness={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.46, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.18, 16]} />
        <meshStandardMaterial color="#9a784f" metalness={0.55} roughness={0.42} />
      </mesh>
    </group>
  );
}

export function TurntableScene({
  accentColor,
  activeLinkLabel,
  hoverTilt,
  isPlaying,
}: TurntableSceneProps) {
  const stageRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!stageRef.current) {
      return;
    }

    stageRef.current.rotation.x = THREE.MathUtils.lerp(
      stageRef.current.rotation.x,
      hoverTilt * 0.08,
      1 - Math.exp(-5 * delta),
    );
    stageRef.current.rotation.y = THREE.MathUtils.lerp(
      stageRef.current.rotation.y,
      hoverTilt * -0.12,
      1 - Math.exp(-5 * delta),
    );
  });

  return (
    <group ref={stageRef}>
      <ambientLight intensity={0.62} />
      <directionalLight castShadow intensity={1.05} position={[3.2, 5.4, 2.4]} />
      <directionalLight color="#c9dfd9" intensity={0.34} position={[-2.4, 2.6, -1.2]} />

      <mesh castShadow position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[2.45, 0.36, 1.55]} />
        <meshStandardMaterial color="#76563f" metalness={0.12} roughness={0.78} />
      </mesh>

      <mesh castShadow position={[0, 0.39, 0]}>
        <cylinderGeometry args={[1.02, 1.02, 0.05, 48]} />
        <meshStandardMaterial color="#2f2f2f" metalness={0.35} roughness={0.48} />
      </mesh>

      <VinylDisc
        accentColor={accentColor}
        activeLinkLabel={activeLinkLabel}
        isPlaying={isPlaying}
      />
      <ToneArm isPlaying={isPlaying} />
      <GramophoneHorn />

      <ContactShadows blur={2.4} far={4.2} opacity={0.34} position={[0, 0.01, 0]} scale={4.2} />
    </group>
  );
}
