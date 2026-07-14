import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

const GROOVE_SIZE = 512;

export function useGrooveTexture(): THREE.CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = GROOVE_SIZE;
    canvas.height = GROOVE_SIZE;
    const context = canvas.getContext('2d');

    if (!context) {
      return new THREE.CanvasTexture(canvas);
    }

    const center = GROOVE_SIZE / 2;
    const maxRadius = center - 2;

    context.fillStyle = '#070707';
    context.beginPath();
    context.arc(center, center, maxRadius, 0, Math.PI * 2);
    context.fill();

    for (let radius = 28; radius < maxRadius; radius += 2.4) {
      const groove = radius % 12 === 0 ? '#222222' : '#141414';
      context.strokeStyle = groove;
      context.lineWidth = radius % 12 === 0 ? 1.1 : 0.65;
      context.beginPath();
      context.arc(center, center, radius, 0, Math.PI * 2);
      context.stroke();
    }

    const sheen = context.createLinearGradient(0, 0, GROOVE_SIZE, GROOVE_SIZE);
    sheen.addColorStop(0, 'rgb(255 255 255 / 14%)');
    sheen.addColorStop(0.42, 'rgb(255 255 255 / 0%)');
    sheen.addColorStop(1, 'rgb(255 255 255 / 6%)');
    context.fillStyle = sheen;
    context.beginPath();
    context.arc(center, center, maxRadius, 0, Math.PI * 2);
    context.fill();

    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.anisotropy = 4;
    return nextTexture;
  }, []);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return texture;
}
