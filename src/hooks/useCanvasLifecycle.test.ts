import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCanvasLifecycle } from './useCanvasLifecycle';

describe('useCanvasLifecycle', () => {
  it('starts active when the canvas container is mounted', () => {
    const { result } = renderHook(() => useCanvasLifecycle<HTMLDivElement>());

    expect(result.current.isActive).toBe(true);
  });
});
