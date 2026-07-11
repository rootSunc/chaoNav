import { useEffect, useState } from 'react';

export type PointerParallax = {
  readonly x: number;
  readonly y: number;
};

const INITIAL_POINTER: PointerParallax = { x: 0, y: 0 };

export function usePointerParallax(enabled: boolean): PointerParallax {
  const [pointer, setPointer] = useState<PointerParallax>(INITIAL_POINTER);

  useEffect(() => {
    if (!enabled) {
      setPointer(INITIAL_POINTER);
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      setPointer({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [enabled]);

  return pointer;
}
