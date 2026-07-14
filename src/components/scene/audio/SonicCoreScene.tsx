import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { SceneQuality } from '../../../hooks/useSceneQuality';

export type SonicCoreSceneProps = {
  readonly accentColor: string;
  readonly hovered: boolean;
  readonly isPlaying: boolean;
  readonly pointer: readonly [number, number];
  readonly quality: Exclude<SceneQuality, 'off'>;
};

const ADDITIVE = THREE.AdditiveBlending;

const COSMIC_SWATCHES = ['#22d3ee', '#a78bfa', '#f472b6', '#fbbf24', '#60a5fa'] as const;

function EnergyCore({
  accentColor,
  hovered,
  isPlaying,
}: Pick<SonicCoreSceneProps, 'accentColor' | 'hovered' | 'isPlaying'>) {
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const energy = isPlaying ? 1 : hovered ? 0.72 : 0.46;
    const pulse = 1 + Math.sin(elapsed * (isPlaying ? 3.6 : 1.7)) * 0.045 * energy;

    if (coreRef.current) {
      coreRef.current.rotation.x += delta * (isPlaying ? 0.34 : 0.12);
      coreRef.current.rotation.y += delta * (isPlaying ? 0.52 : 0.18);
      coreRef.current.scale.setScalar(pulse);
    }

    if (shellRef.current) {
      shellRef.current.rotation.x -= delta * 0.08;
      shellRef.current.rotation.y += delta * 0.13;
      shellRef.current.scale.setScalar(1 + Math.sin(elapsed * 2.1) * 0.018);
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.15 + energy * 0.22 + Math.sin(elapsed * 2.4) * 0.04);
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.47, 32, 32]} />
        <meshBasicMaterial
          blending={ADDITIVE}
          color={accentColor}
          depthWrite={false}
          opacity={isPlaying ? 0.11 : 0.065}
          transparent
        />
      </mesh>

      <mesh ref={shellRef}>
        <icosahedronGeometry args={[0.43, 2]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.08}
          color="#111416"
          emissive={accentColor}
          emissiveIntensity={isPlaying ? 0.18 : 0.07}
          metalness={0.76}
          opacity={0.8}
          roughness={0.18}
          transparent
          transmission={0.18}
          wireframe
        />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.3, 4]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.04}
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={isPlaying ? 0.9 : hovered ? 0.54 : 0.32}
          metalness={0.18}
          roughness={0.12}
          thickness={0.8}
          transmission={0.28}
        />
      </mesh>

      <mesh scale={0.62}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshBasicMaterial
          blending={ADDITIVE}
          color="#f7ffff"
          depthWrite={false}
          opacity={isPlaying ? 0.55 : 0.32}
          transparent
        />
      </mesh>
    </group>
  );
}

function OrbitalSystem({
  accentColor,
  isPlaying,
}: Pick<SonicCoreSceneProps, 'accentColor' | 'isPlaying'>) {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.z += delta * (isPlaying ? 0.22 : 0.065);
      outerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.42) * 0.18;
    }

    if (innerRef.current) {
      innerRef.current.rotation.z -= delta * (isPlaying ? 0.38 : 0.1);
      innerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.55) * 0.12;
    }
  });

  return (
    <>
      <group ref={outerRef} rotation={[1.06, 0.2, 0.18]}>
        <mesh>
          <torusGeometry args={[0.78, 0.009, 10, 128]} />
          <meshBasicMaterial
            blending={ADDITIVE}
            color={accentColor}
            depthWrite={false}
            opacity={0.62}
            transparent
          />
        </mesh>
        <mesh position={[0.78, 0, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#f4ffff" toneMapped={false} />
        </mesh>
      </group>

      <group ref={innerRef} rotation={[0.28, 0.72, -0.34]}>
        <mesh>
          <torusGeometry args={[0.61, 0.006, 8, 128]} />
          <meshBasicMaterial
            blending={ADDITIVE}
            color="#d5fffa"
            depthWrite={false}
            opacity={0.34}
            transparent
          />
        </mesh>
        <mesh position={[-0.61, 0, 0]}>
          <octahedronGeometry args={[0.025, 0]} />
          <meshBasicMaterial color={accentColor} toneMapped={false} />
        </mesh>
      </group>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.93, 0.004, 8, 160]} />
        <meshBasicMaterial
          blending={ADDITIVE}
          color={accentColor}
          depthWrite={false}
          opacity={0.18}
          transparent
        />
      </mesh>
    </>
  );
}

function WaveformHalo({
  accentColor,
  hovered,
  isPlaying,
  quality,
}: Pick<SonicCoreSceneProps, 'accentColor' | 'hovered' | 'isPlaying' | 'quality'>) {
  const groupRef = useRef<THREE.Group>(null);
  const barsRef = useRef<Array<THREE.Mesh | null>>([]);
  const count = quality === 'high' ? 48 : 32;

  const bars = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        return {
          angle,
          position: [Math.cos(angle) * 1.05, Math.sin(angle) * 1.05, 0] as const,
        };
      }),
    [count],
  );

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const energy = isPlaying ? 1 : hovered ? 0.55 : 0.24;

    if (groupRef.current) {
      groupRef.current.rotation.z += delta * (isPlaying ? 0.04 : 0.012);
    }

    barsRef.current.forEach((bar, index) => {
      if (!bar) {
        return;
      }

      const wave =
        Math.sin(elapsed * (isPlaying ? 4.2 : 1.5) + index * 0.62) * 0.5 +
        Math.sin(elapsed * 2.1 - index * 0.27) * 0.24;
      const height = 0.045 + energy * (0.07 + Math.abs(wave) * 0.18);
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, height / 0.12, 0.16);
    });
  });

  return (
    <group ref={groupRef}>
      {bars.map((bar, index) => (
        <mesh
          key={index}
          position={bar.position}
          ref={(mesh) => {
            barsRef.current[index] = mesh;
          }}
          rotation={[0, 0, bar.angle - Math.PI / 2]}
        >
          <boxGeometry args={[0.012, 0.12, 0.012]} />
          <meshBasicMaterial
            blending={ADDITIVE}
            color={index % 4 === 0 ? '#ecffff' : accentColor}
            depthWrite={false}
            opacity={index % 3 === 0 ? 0.78 : 0.46}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({
  isPlaying,
  quality,
}: Pick<SonicCoreSceneProps, 'isPlaying' | 'quality'>) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = quality === 'high' ? 140 : 72;
  const { positions, colors } = useMemo(() => {
    const positionValues = new Float32Array(count * 3);
    const colorValues = new Float32Array(count * 3);
    const swatch = new THREE.Color();

    for (let index = 0; index < count; index += 1) {
      const radius = 0.72 + ((index * 37) % 100) / 100 * 1.05;
      const angle = index * 2.399963;
      positionValues[index * 3] = Math.cos(angle) * radius;
      positionValues[index * 3 + 1] = Math.sin(angle) * radius;
      positionValues[index * 3 + 2] = ((index * 53) % 100) / 100 * 0.9 - 0.45;

      swatch.set(COSMIC_SWATCHES[index % COSMIC_SWATCHES.length]);
      colorValues[index * 3] = swatch.r;
      colorValues[index * 3 + 1] = swatch.g;
      colorValues[index * 3 + 2] = swatch.b;
    }

    return { positions: positionValues, colors: colorValues };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.z += delta * (isPlaying ? -0.055 : -0.014);
    pointsRef.current.rotation.y += delta * 0.018;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        blending={ADDITIVE}
        depthWrite={false}
        opacity={isPlaying ? 0.82 : 0.46}
        size={quality === 'high' ? 0.028 : 0.036}
        sizeAttenuation
        transparent
        vertexColors
      />
    </points>
  );
}

function HolographicBase({
  accentColor,
  isPlaying,
}: Pick<SonicCoreSceneProps, 'accentColor' | 'isPlaying'>) {
  const baseRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (baseRef.current) {
      baseRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.018);
    }
  });

  return (
    <group position={[0, -1.02, 0]} ref={baseRef} rotation={[Math.PI / 2, 0, 0]}>
      {[0.46, 0.68, 0.9].map((radius, index) => (
        <mesh key={radius}>
          <ringGeometry args={[radius - 0.006, radius, 96]} />
          <meshBasicMaterial
            blending={ADDITIVE}
            color={accentColor}
            depthWrite={false}
            opacity={(isPlaying ? 0.28 : 0.14) / (index + 0.5)}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

export function SonicCoreScene({
  accentColor,
  hovered,
  isPlaying,
  pointer,
  quality,
}: SonicCoreSceneProps) {
  const sculptureRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!sculptureRef.current) {
      return;
    }

    const targetX = pointer[1] * -0.16;
    const targetY = pointer[0] * 0.22;
    sculptureRef.current.rotation.x = THREE.MathUtils.damp(
      sculptureRef.current.rotation.x,
      targetX,
      5.2,
      delta,
    );
    sculptureRef.current.rotation.y = THREE.MathUtils.damp(
      sculptureRef.current.rotation.y,
      targetY,
      5.2,
      delta,
    );
    sculptureRef.current.position.y = THREE.MathUtils.damp(
      sculptureRef.current.position.y,
      Math.sin(state.clock.elapsedTime * 1.35) * (isPlaying ? 0.035 : 0.018),
      4,
      delta,
    );
  });

  return (
    <>
      <ambientLight intensity={0.36} />
      <directionalLight color="#eaf2ff" intensity={1.35} position={[2.6, 3.2, 3.8]} />
      <pointLight
        color={accentColor}
        decay={2}
        distance={6}
        intensity={isPlaying ? 2.1 : hovered ? 1.3 : 0.82}
        position={[0, 0.2, 1.5]}
      />
      <pointLight color="#a78bfa" decay={2} distance={7} intensity={0.7} position={[-2.1, 0.9, 0.6]} />
      <pointLight color="#f472b6" decay={2} distance={7} intensity={0.55} position={[2, -1.2, 0.4]} />

      <group ref={sculptureRef} scale={1.08}>
        <EnergyCore accentColor={accentColor} hovered={hovered} isPlaying={isPlaying} />
        <OrbitalSystem accentColor={accentColor} isPlaying={isPlaying} />
        <WaveformHalo
          accentColor={accentColor}
          hovered={hovered}
          isPlaying={isPlaying}
          quality={quality}
        />
        <ParticleField isPlaying={isPlaying} quality={quality} />
        <HolographicBase accentColor={accentColor} isPlaying={isPlaying} />
      </group>
    </>
  );
}
