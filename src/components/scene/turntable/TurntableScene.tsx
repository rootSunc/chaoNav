import { useTexture } from '@react-three/drei';
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
const GRAMOPHONE_TEXTURE = '/images/gramophone.png';

function GramophoneBackdrop() {
  const texture = useTexture(GRAMOPHONE_TEXTURE);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={[0.02, 0.72, -0.02]}>
      <planeGeometry args={[2.35, 2.35]} />
      <meshBasicMaterial alphaTest={0.04} map={texture} toneMapped={false} transparent />
    </mesh>
  );
}

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
    <group position={[0.04, 0.34, 0.18]} ref={discRef} rotation={[-Math.PI / 2, 0, -0.07]}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.018, 64]} />
        <meshStandardMaterial color="#101010" metalness={0.58} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.11, 32]} />
        <meshStandardMaterial map={labelTexture} metalness={0.15} roughness={0.62} />
      </mesh>
    </group>
  );
}

function ToneArm({ isPlaying }: { readonly isPlaying: boolean }) {
  const armRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(isPlaying ? -0.22 : -0.88);

  useEffect(() => {
    targetRotation.current = isPlaying ? -0.22 : -0.88;
  }, [isPlaying]);

  useFrame((_, delta) => {
    if (!armRef.current) {
      return;
    }

    armRef.current.rotation.z = THREE.MathUtils.lerp(
      armRef.current.rotation.z,
      targetRotation.current,
      1 - Math.exp(-3.6 * delta),
    );
  });

  return (
    <group position={[0.72, 0.52, 0.22]} ref={armRef} rotation={[0, -0.18, -0.88]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
        <meshStandardMaterial color="#8f8f8f" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh castShadow position={[0.22, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 0.46, 12]} />
        <meshStandardMaterial color="#d2d2d2" metalness={0.92} roughness={0.12} />
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
      hoverTilt * 0.06,
      1 - Math.exp(-5 * delta),
    );
    stageRef.current.rotation.y = THREE.MathUtils.lerp(
      stageRef.current.rotation.y,
      hoverTilt * -0.1,
      1 - Math.exp(-5 * delta),
    );
  });

  return (
    <group ref={stageRef}>
      <ambientLight intensity={0.78} />
      <directionalLight intensity={0.95} position={[2.4, 4.2, 3.2]} />
      <directionalLight color="#ffd2d6" intensity={0.28} position={[-2.2, 2.4, 1.4]} />
      <pointLight color={accentColor} intensity={0.35} position={[0.2, 0.8, 1.2]} />

      <GramophoneBackdrop />
      <VinylDisc
        accentColor={accentColor}
        activeLinkLabel={activeLinkLabel}
        isPlaying={isPlaying}
      />
      <ToneArm isPlaying={isPlaying} />
    </group>
  );
}
