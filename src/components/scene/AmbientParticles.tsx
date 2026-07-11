import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export type AmbientParticlesProps = {
  readonly count: number;
  readonly gather: number;
  readonly isPlaying: boolean;
  readonly pointer: {
    readonly x: number;
    readonly y: number;
  };
};

type ParticleData = {
  readonly positions: Float32Array;
  readonly velocities: Float32Array;
  readonly seeds: Float32Array;
};

const GATHER_TARGET = new THREE.Vector3(2.4, -0.85, 0);
const BOUNDS = {
  x: 7.2,
  y: 4.4,
  z: 2.2,
};

function createParticleData(count: number): ParticleData {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;

    positions[offset] = (Math.random() - 0.5) * BOUNDS.x * 2;
    positions[offset + 1] = (Math.random() - 0.5) * BOUNDS.y * 2;
    positions[offset + 2] = (Math.random() - 0.5) * BOUNDS.z * 2;
    velocities[offset] = (Math.random() - 0.5) * 0.018;
    velocities[offset + 1] = (Math.random() - 0.5) * 0.014;
    velocities[offset + 2] = (Math.random() - 0.5) * 0.01;
    seeds[index] = Math.random();
  }

  return { positions, velocities, seeds };
}

function wrapAxis(value: number, limit: number): number {
  if (value > limit) {
    return -limit;
  }

  if (value < -limit) {
    return limit;
  }

  return value;
}

export function AmbientParticles({ count, gather, isPlaying, pointer }: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const pointerRef = useRef(pointer);
  const gatherRef = useRef(gather);
  const playingRef = useRef(isPlaying);

  pointerRef.current = pointer;
  gatherRef.current = gather;
  playingRef.current = isPlaying;

  const particleData = useMemo(() => createParticleData(count), [count]);

  useFrame((state) => {
    const points = pointsRef.current;
    const material = materialRef.current;

    if (!points) {
      return;
    }

    const positions = points.geometry.attributes.position.array as Float32Array;
    const elapsed = state.clock.elapsedTime;
    const currentPointer = pointerRef.current;
    const currentGather = gatherRef.current;
    const playing = playingRef.current;
    const pulse = playing ? 0.55 + Math.sin(elapsed * 2.8) * 0.18 : 0;

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const seed = particleData.seeds[index];

      positions[offset] +=
        particleData.velocities[offset] + Math.sin(elapsed * 0.34 + seed * 6.2) * 0.0018;
      positions[offset + 1] +=
        particleData.velocities[offset + 1] + Math.cos(elapsed * 0.28 + seed * 5.4) * 0.0014;
      positions[offset + 2] +=
        particleData.velocities[offset + 2] + Math.sin(elapsed * 0.22 + seed * 4.8) * 0.001;

      positions[offset] += currentPointer.x * 0.0045;
      positions[offset + 1] += currentPointer.y * 0.0035;

      if (currentGather > 0.01) {
        positions[offset] += (GATHER_TARGET.x - positions[offset]) * currentGather * 0.014;
        positions[offset + 1] += (GATHER_TARGET.y - positions[offset + 1]) * currentGather * 0.014;
        positions[offset + 2] += (GATHER_TARGET.z - positions[offset + 2]) * currentGather * 0.01;
      }

      positions[offset] = wrapAxis(positions[offset], BOUNDS.x);
      positions[offset + 1] = wrapAxis(positions[offset + 1], BOUNDS.y);
      positions[offset + 2] = wrapAxis(positions[offset + 2], BOUNDS.z);
    }

    points.geometry.attributes.position.needsUpdate = true;

    if (material) {
      material.opacity = 0.16 + currentGather * 0.05 + pulse * 0.07;
      material.size = 0.042 + pulse * 0.01 + currentGather * 0.004;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        blending={THREE.AdditiveBlending}
        color="#4a938c"
        depthWrite={false}
        opacity={0.2}
        size={0.045}
        sizeAttenuation
        transparent
      />
    </points>
  );
}
