import { useCallback, useEffect, useRef, useState } from "react";

type TrackDirection = 1 | -1;

function isAutoplayBlocked(error: unknown) {
  return error instanceof DOMException && error.name === "NotAllowedError";
}

function isFromMusicControl(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest('[data-music-control="true"]')
  );
}

export function useMusicPlayer(trackCount: number) {
  const safeTrackCount = Math.max(trackCount, 1);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [needsUserActivation, setNeedsUserActivation] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playAttemptRef = useRef(0);
  const didLoadInitialTrackRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  const progressBarRef = useRef<HTMLSpanElement | null>(null);
  const playheadRef = useRef<SVGLineElement | null>(null);
  const lastReportedSecondRef = useRef(-1);

  const applyProgressRatio = useCallback((ratio: number) => {
    const clamped = Math.max(0, Math.min(1, ratio));
    const pct = `${(clamped * 100).toFixed(2)}%`;
    if (progressBarRef.current) {
      progressBarRef.current.style.width = pct;
    }
    if (playheadRef.current) {
      const x = (clamped * 320).toFixed(2);
      playheadRef.current.setAttribute("x1", x);
      playheadRef.current.setAttribute("x2", x);
    }
  }, []);

  const resetProgress = useCallback(() => {
    applyProgressRatio(0);
    lastReportedSecondRef.current = 0;
    setElapsedSeconds(0);
  }, [applyProgressRatio]);

  const tickProgress = useCallback(() => {
    const audio = audioRef.current;
    const current = audio?.currentTime ?? 0;
    const total =
      audio?.duration && Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : 120;

    applyProgressRatio(current / total);

    const wholeSec = Math.floor(current);
    if (wholeSec !== lastReportedSecondRef.current) {
      lastReportedSecondRef.current = wholeSec;
      setElapsedSeconds(wholeSec);
      if (audio?.duration && Number.isFinite(audio.duration)) {
        setDurationSeconds(Math.floor(audio.duration));
      }
    }

    animationFrameRef.current = requestAnimationFrame(tickProgress);
  }, [applyProgressRatio]);

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
      setTrackIndex(
        (currentIndex) =>
          (currentIndex + direction + safeTrackCount) % safeTrackCount,
      );
    },
    [safeTrackCount],
  );

  const selectTrack = useCallback(
    (nextIndex: number) => {
      const normalized =
        ((Math.trunc(nextIndex) % safeTrackCount) + safeTrackCount) %
        safeTrackCount;
      setTrackIndex(normalized);
    },
    [safeTrackCount],
  );

  const seekToRatio = useCallback(
    (ratio: number) => {
      const clamped = Math.max(0, Math.min(1, ratio));
      const audio = audioRef.current;
      if (
        audio &&
        audio.duration &&
        Number.isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        audio.currentTime = clamped * audio.duration;
        setElapsedSeconds(Math.floor(audio.currentTime));
      }
      applyProgressRatio(clamped);
    },
    [applyProgressRatio],
  );

  const togglePlaying = useCallback(() => {
    if (isPlayingRef.current) {
      playAttemptRef.current += 1;
      setNeedsUserActivation(false);
      setIsPlaying(false);
      audioRef.current?.pause();
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

      // play() has to run inside the gesture. A later effect is too late.
      requestAudioPlay(audioRef.current);
    };

    document.addEventListener("pointerdown", resumeFromGesture, true);
    document.addEventListener("keydown", resumeFromGesture, true);

    return () => {
      document.removeEventListener("pointerdown", resumeFromGesture, true);
      document.removeEventListener("keydown", resumeFromGesture, true);
    };
  }, [needsUserActivation, requestAudioPlay]);

  useEffect(() => {
    setTrackIndex((currentIndex) => Math.min(currentIndex, safeTrackCount - 1));
  }, [safeTrackCount]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = 0.72;
    }

    if (isPlaying) {
      requestAudioPlay(audio);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(tickProgress);
    } else {
      playAttemptRef.current += 1;
      audio?.pause();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, requestAudioPlay, tickProgress]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!didLoadInitialTrackRef.current) {
      didLoadInitialTrackRef.current = true;
      return;
    }

    resetProgress();
    setDurationSeconds(0);
    audio?.load();

    if (isPlayingRef.current) {
      requestAudioPlay(audio);
    }
  }, [trackIndex, requestAudioPlay, resetProgress]);

  return {
    audioRef,
    durationSeconds,
    elapsedSeconds,
    isPlaying,
    playheadRef,
    progressBarRef,
    seekToRatio,
    selectRelativeTrack,
    selectTrack,
    togglePlaying,
    trackIndex,
  };
}
