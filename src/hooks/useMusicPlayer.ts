import { useCallback, useEffect, useRef, useState } from 'react';
import { formatTime } from '../lib/time';

type TrackDirection = 1 | -1;

function isAutoplayBlocked(error: unknown) {
  return error instanceof DOMException && error.name === 'NotAllowedError';
}

function isFromMusicControl(target: EventTarget | null) {
  return target instanceof Element && target.closest('[data-music-control="true"]');
}

export function useMusicPlayer(trackCount: number) {
  const safeTrackCount = Math.max(trackCount, 1);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [needsUserActivation, setNeedsUserActivation] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playAttemptRef = useRef(0);
  const didLoadInitialTrackRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  const progressBarRef = useRef<HTMLSpanElement | null>(null);
  const timeTextRef = useRef<HTMLSpanElement | null>(null);
  const visualizerRef = useRef<HTMLDivElement | null>(null);

  const resetVisualizer = useCallback(() => {
    if (!visualizerRef.current) {
      return;
    }

    for (const bar of visualizerRef.current.children) {
      (bar as HTMLElement).style.setProperty('--bar-height', '18%');
    }
  }, []);

  const resetPlaybackDisplay = useCallback(() => {
    if (timeTextRef.current) {
      timeTextRef.current.innerText = '00:00';
    }

    if (progressBarRef.current) {
      progressBarRef.current.style.width = '0%';
    }

    resetVisualizer();
  }, [resetVisualizer]);

  const tickVisualizer = useCallback(() => {
    const audio = audioRef.current;
    const current = audio?.currentTime ?? 0;
    const total = audio?.duration && Number.isFinite(audio.duration) ? audio.duration : 30;

    if (timeTextRef.current) {
      timeTextRef.current.innerText = `${formatTime(current)} / ${formatTime(total)}`;
    }

    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.min(100, (current / total) * 100)}%`;
    }

    if (visualizerRef.current) {
      const bars = Array.from(visualizerRef.current.children) as HTMLElement[];

      bars.forEach((bar, index) => {
        const motion = Math.abs(Math.sin(Date.now() * 0.006 + index * 0.7));
        bar.style.setProperty('--bar-height', `${Math.max(18, motion * 100)}%`);
      });
    }

    animationFrameRef.current = requestAnimationFrame(tickVisualizer);
  }, []);

  const requestAudioPlay = useCallback((audio: HTMLAudioElement | null) => {
    const playAttempt = playAttemptRef.current + 1;
    playAttemptRef.current = playAttempt;

    if (!audio) {
      return;
    }

    void audio
      .play()
      .then(() => {
        if (playAttemptRef.current === playAttempt) {
          setNeedsUserActivation(false);
          setIsPlaying(true);
        }
      })
      .catch((error: unknown) => {
        if (playAttemptRef.current === playAttempt) {
          setNeedsUserActivation(isAutoplayBlocked(error));
          setIsPlaying(false);
        }
      });
  }, []);

  const selectRelativeTrack = useCallback(
    (direction: TrackDirection) => {
      setTrackIndex((currentIndex) => {
        return (currentIndex + direction + safeTrackCount) % safeTrackCount;
      });
    },
    [safeTrackCount],
  );

  const togglePlaying = useCallback(() => {
    if (isPlayingRef.current) {
      playAttemptRef.current += 1;
      setNeedsUserActivation(false);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    requestAudioPlay(audioRef.current);
  }, [requestAudioPlay]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!needsUserActivation) {
      return;
    }

    const resumeFromGesture = (event: Event) => {
      if (isFromMusicControl(event.target)) {
        return;
      }

      setIsPlaying(true);
      requestAudioPlay(audioRef.current);
    };

    document.addEventListener('pointerdown', resumeFromGesture, true);
    document.addEventListener('keydown', resumeFromGesture, true);

    return () => {
      document.removeEventListener('pointerdown', resumeFromGesture, true);
      document.removeEventListener('keydown', resumeFromGesture, true);
    };
  }, [needsUserActivation, requestAudioPlay]);

  useEffect(() => {
    setTrackIndex((currentIndex) => Math.min(currentIndex, safeTrackCount - 1));
  }, [safeTrackCount]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = 0.7;
    }

    if (isPlaying) {
      requestAudioPlay(audio);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(tickVisualizer);
    } else {
      playAttemptRef.current += 1;
      audio?.pause();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      resetVisualizer();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, requestAudioPlay, resetVisualizer, tickVisualizer]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!didLoadInitialTrackRef.current) {
      didLoadInitialTrackRef.current = true;
      return;
    }

    resetPlaybackDisplay();
    audio?.load();

    if (isPlayingRef.current) {
      requestAudioPlay(audio);
    }
  }, [trackIndex, requestAudioPlay, resetPlaybackDisplay]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    audioRef,
    isPlaying,
    progressBarRef,
    selectRelativeTrack,
    timeTextRef,
    togglePlaying,
    trackIndex,
    visualizerRef,
  };
}
