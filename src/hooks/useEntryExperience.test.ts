import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ENTRY_GATE_STORAGE_KEY } from '../lib/entryGate';
import { useEntryExperience } from './useEntryExperience';

describe('useEntryExperience', () => {
  afterEach(() => {
    sessionStorage.removeItem(ENTRY_GATE_STORAGE_KEY);
    vi.useRealTimers();
  });

  it('skips the gate when scene quality is off', () => {
    const onEnter = vi.fn();
    const { result } = renderHook(() => useEntryExperience('off', 'home', onEnter));

    expect(result.current.entryOpen).toBe(false);
    expect(result.current.entryVisible).toBe(false);
  });

  it('skips the gate on the projects page', () => {
    const onEnter = vi.fn();
    const { result } = renderHook(() => useEntryExperience('high', 'projects', onEnter));

    expect(result.current.entryOpen).toBe(false);
    expect(result.current.entryVisible).toBe(false);
  });

  it('shows the gate once, then dismisses with audio and marks the session', () => {
    vi.useFakeTimers();
    const onEnter = vi.fn();
    const { result } = renderHook(() => useEntryExperience('high', 'home', onEnter));

    expect(result.current.entryOpen).toBe(true);
    expect(result.current.entryVisible).toBe(true);

    act(() => {
      result.current.dismissWithAudio();
    });

    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(result.current.entryOpen).toBe(false);
    expect(sessionStorage.getItem(ENTRY_GATE_STORAGE_KEY)).toBe('1');

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(result.current.entryVisible).toBe(false);
  });

  it('dismisses silently without starting audio', () => {
    const onEnter = vi.fn();
    const { result } = renderHook(() => useEntryExperience('high', 'home', onEnter));

    act(() => {
      result.current.dismissSilent();
    });

    expect(onEnter).not.toHaveBeenCalled();
    expect(result.current.entryOpen).toBe(false);
  });
});
