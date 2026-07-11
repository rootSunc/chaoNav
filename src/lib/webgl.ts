export function hasWebGLSupport(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl2', { powerPreference: 'high-performance' }) ??
      canvas.getContext('webgl', { powerPreference: 'high-performance' });

    return context !== null;
  } catch {
    return false;
  }
}

export function getGpuTier(): 0 | 1 | 2 {
  if (!hasWebGLSupport()) {
    return 0;
  }

  const canvas = document.createElement('canvas');
  const context =
    canvas.getContext('webgl2') ??
    canvas.getContext('webgl');

  if (!context) {
    return 0;
  }

  const maxTextureSize = context.getParameter(context.MAX_TEXTURE_SIZE) as number;

  if (maxTextureSize < 4096) {
    return 1;
  }

  const isMobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (isMobileAgent) {
    return 1;
  }

  return 2;
}
