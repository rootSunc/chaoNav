import { useCallback, useEffect, useRef, useState } from 'react';
import { hasSeenEntryGate, markEntryGateSeen } from '../lib/entryGate';
import type { SceneQuality } from './useSceneQuality';

const INTRO_DECAY_MS = 1200;
const GATE_FADE_MS = 700;

export type EntryExperienceState = {
  readonly entryOpen: boolean;
  readonly entryVisible: boolean;
  readonly introPhase: number;
  readonly dismissWithAudio: () => void;
  readonly dismissSilent: () => void;
};

function shouldSkipEntryGate(quality: SceneQuality, page: 'home' | 'projects'): boolean {
  if (page !== 'home') {
    return true;
  }

  if (quality === 'off') {
    return true;
  }

  return hasSeenEntryGate();
}

export function useEntryExperience(
  quality: SceneQuality,
  page: 'home' | 'projects',
  onEnterWithAudio: () => void,
): EntryExperienceState {
  const [entryOpen, setEntryOpen] = useState(() => !shouldSkipEntryGate(quality, page));
  const [entryVisible, setEntryVisible] = useState(() => !shouldSkipEntryGate(quality, page));
  const [introPhase, setIntroPhase] = useState(0);
  const fadeTimerRef = useRef<number | null>(null);
  const introFrameRef = useRef<number | null>(null);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (shouldSkipEntryGate(quality, page)) {
      setEntryOpen(false);
      setEntryVisible(false);
    }
  }, [page, quality]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
      }

      if (introFrameRef.current !== null) {
        cancelAnimationFrame(introFrameRef.current);
      }
    };
  }, []);

  const runIntroBurst = useCallback(() => {
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / INTRO_DECAY_MS);
      // Rise quickly, then ease out — peak energy early in the dismiss.
      const phase = progress < 0.22 ? progress / 0.22 : 1 - (progress - 0.22) / 0.78;
      setIntroPhase(Math.max(0, phase));

      if (progress < 1) {
        introFrameRef.current = requestAnimationFrame(tick);
      } else {
        setIntroPhase(0);
        introFrameRef.current = null;
      }
    };

    if (introFrameRef.current !== null) {
      cancelAnimationFrame(introFrameRef.current);
    }

    introFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const dismiss = useCallback(
    (withAudio: boolean) => {
      if (dismissedRef.current || !entryOpen) {
        return;
      }

      dismissedRef.current = true;
      markEntryGateSeen();

      if (withAudio) {
        onEnterWithAudio();
      }

      setEntryOpen(false);
      runIntroBurst();

      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
      }

      fadeTimerRef.current = window.setTimeout(() => {
        setEntryVisible(false);
        fadeTimerRef.current = null;
      }, GATE_FADE_MS);
    },
    [entryOpen, onEnterWithAudio, runIntroBurst],
  );

  const dismissWithAudio = useCallback(() => dismiss(true), [dismiss]);
  const dismissSilent = useCallback(() => dismiss(false), [dismiss]);

  return {
    entryOpen,
    entryVisible,
    introPhase,
    dismissWithAudio,
    dismissSilent,
  };
}
