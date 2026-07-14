import { ContactShadows, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { SceneQuality } from '../../../hooks/useSceneQuality';
import { useGrooveTexture } from './useGrooveTexture';
import { useLabelTexture } from './useLabelTexture';

export type TurntableSceneProps = {
  readonly accentColor: string;
  readonly activeLinkLabel: string;
  readonly hoverTilt: number;
  readonly isPlaying: boolean;
  readonly quality: Exclude<SceneQuality, 'off'>;
};

const ROTATION_SPEED = (33.333 * Math.PI * 2) / 60;

function TurntablePlinth({
  accentColor,
  isPlaying,
}: {
  readonly accentColor: string;
  readonly isPlaying: boolean;
}) {
  const ledIntensity = isPlaying ? 0.85 : 0.28;

  return (
    <group position={[0, 0.02, 0]}>
      <mesh castShadow position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.62, 0.11, 1.08]} />
        <meshPhysicalMaterial
          clearcoat={0.92}
          clearcoatRoughness={0.18}
          color="#1a1b1c"
          metalness={0.78}
          roughness={0.34}
        />
      </mesh>

      <mesh castShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.56, 0.58, 0.045, 64]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.12}
          color="#242628"
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      <mesh castShadow position={[0, 0.125, 0.02]}>
        <cylinderGeometry args={[0.54, 0.54, 0.012, 64]} />
        <meshStandardMaterial color="#090909" metalness={0.42} roughness={0.58} />
      </mesh>

      <mesh position={[0, 0.115, 0.48]}>
        <boxGeometry args={[0.92, 0.018, 0.04]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={ledIntensity}
          metalness={0.35}
          roughness={0.42}
        />
      </mesh>

      <mesh position={[-0.62, 0.115, -0.18]}>
        <boxGeometry args={[0.08, 0.05, 0.08]} />
        <meshStandardMaterial color="#303234" metalness={0.72} roughness={0.28} />
      </mesh>
    </group>
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
  const grooveTexture = useGrooveTexture();
  const labelTexture = useLabelTexture(activeLinkLabel, accentColor);
  const emissiveIntensity = isPlaying ? 0.14 : 0.04;

  useFrame((_, delta) => {
    if (isPlaying && discRef.current) {
      discRef.current.rotation.y += delta * ROTATION_SPEED;
    }
  });

  return (
    <group position={[0, 0.16, 0]} ref={discRef}>
      <mesh castShadow rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.022, 96]} />
        <meshPhysicalMaterial
          clearcoat={0.95}
          clearcoatRoughness={0.08}
          color="#050505"
          emissive={accentColor}
          emissiveIntensity={emissiveIntensity}
          metalness={0.72}
          roughness={0.14}
        />
      </mesh>

      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.495, 96]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.06}
          map={grooveTexture}
          metalness={0.82}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.115, 48]} />
        <meshStandardMaterial map={labelTexture} metalness={0.22} roughness={0.52} />
      </mesh>

      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.028, 24]} />
        <meshStandardMaterial color="#d8d8d8" metalness={0.95} roughness={0.12} />
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

    armRef.current.rotation.z = THREE.MathUtils.lerp(
      armRef.current.rotation.z,
      targetRotation.current,
      1 - Math.exp(-4.2 * delta),
    );
  });

  return (
    <group position={[0.58, 0.19, -0.08]} ref={armRef} rotation={[0, 0.08, -0.92]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.042, 0.048, 0.07, 20]} />
        <meshStandardMaterial color="#8a8c8e" metalness={0.9} roughness={0.16} />
      </mesh>

      <mesh castShadow position={[0.24, 0.028, 0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.014, 0.018, 0.52, 16]} />
        <meshStandardMaterial color="#d4d6d8" metalness={0.94} roughness={0.1} />
      </mesh>

      <mesh castShadow position={[0.48, 0.03, 0.04]}>
        <boxGeometry args={[0.09, 0.04, 0.05]} />
        <meshStandardMaterial color="#2a2b2c" metalness={0.82} roughness={0.24} />
      </mesh>

      <mesh castShadow position={[0.52, 0.022, 0.06]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.014, 0.05, 12]} />
        <meshStandardMaterial color="#ececec" metalness={0.96} roughness={0.08} />
      </mesh>

      <mesh castShadow position={[-0.12, 0.02, -0.02]}>
        <cylinderGeometry args={[0.028, 0.034, 0.05, 16]} />
        <meshStandardMaterial color="#666a6c" metalness={0.88} roughness={0.2} />
      </mesh>
    </group>
  );
}

function TurntableLights({
  accentColor,
  isPlaying,
  quality,
}: {
  readonly accentColor: string;
  readonly isPlaying: boolean;
  readonly quality: Exclude<SceneQuality, 'off'>;
}) {
  const accentIntensity = isPlaying ? (quality === 'high' ? 0.62 : 0.42) : 0.22;
  const spotIntensity = isPlaying ? (quality === 'high' ? 0.32 : 0.18) : 0.08;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        color="#fff8f2"
        intensity={1.15}
        position={[2.2, 4.4, 2.8]}
        shadow-mapSize={[512, 512]}
      />
      <directionalLight color="#ffd8dc" intensity={0.38} position={[-2.4, 2.6, 1.2]} />
      <directionalLight color="#a8fff0" intensity={0.16} position={[0.4, 1.2, -2.6]} />
      <pointLight
        color={accentColor}
        decay={2}
        distance={5}
        intensity={accentIntensity}
        position={[0, 0.55, 0.85]}
      />
      <spotLight
        angle={0.38}
        color={accentColor}
        intensity={spotIntensity}
        penumbra={0.85}
        position={[0.15, 1.45, 1.05]}
      />
    </>
  );
}

export function TurntableScene({
  accentColor,
  activeLinkLabel,
  hoverTilt,
  isPlaying,
  quality,
}: TurntableSceneProps) {
  const stageRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!stageRef.current) {
      return;
    }

    stageRef.current.rotation.x = THREE.MathUtils.lerp(
      stageRef.current.rotation.x,
      hoverTilt * 0.05,
      1 - Math.exp(-5 * delta),
    );
    stageRef.current.rotation.y = THREE.MathUtils.lerp(
      stageRef.current.rotation.y,
      hoverTilt * -0.08,
      1 - Math.exp(-5 * delta),
    );
  });

  return (
    <group ref={stageRef}>
      <TurntableLights accentColor={accentColor} isPlaying={isPlaying} quality={quality} />

      {quality === 'high' ? (
        <Environment environmentIntensity={0.42} preset="city" />
      ) : null}

      <TurntablePlinth accentColor={accentColor} isPlaying={isPlaying} />
      <VinylDisc
        accentColor={accentColor}
        activeLinkLabel={activeLinkLabel}
        isPlaying={isPlaying}
      />
      <ToneArm isPlaying={isPlaying} />

      <ContactShadows
        blur={2.4}
        far={3.2}
        opacity={0.36}
        position={[0, 0.01, 0]}
        scale={2.4}
      />
    </group>
  );
}
