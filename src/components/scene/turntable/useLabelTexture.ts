import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export function useLabelTexture(label: string, color: string): THREE.CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    if (!context) {
      return new THREE.CanvasTexture(canvas);
    }

    context.fillStyle = color;
    context.beginPath();
    context.arc(128, 128, 128, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#f2f0f0';
    context.font = '700 30px Inter, ui-sans-serif, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label.toUpperCase(), 128, 132);

    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    return nextTexture;
  }, [color, label]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return texture;
}
