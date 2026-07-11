import { useEffect, useRef, useState } from 'react';

import { SESSION_TRANSITION_MS } from '../lib/sessionTiming';

export function useGatherPulse(triggerKey: string): number {
  const [gather, setGather] = useState(0);
  const previousKey = useRef(triggerKey);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (previousKey.current === triggerKey) {
      return;
    }

    previousKey.current = triggerKey;

    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / SESSION_TRANSITION_MS);
      const nextGather = 1 - progress;

      setGather(nextGather);

      if (nextGather > 0) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [triggerKey]);

  return gather;
}
