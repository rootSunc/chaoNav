import { useEffect, useRef, useState } from 'react';

type UseInViewProgressOptions = {
  readonly rootMargin?: string;
  readonly threshold?: number;
};

function isDocumentVisible(): boolean {
  return typeof document === 'undefined' || document.visibilityState === 'visible';
}

export function useInViewProgress({
  rootMargin = '0px 0px -12% 0px',
  threshold = 0.42,
}: UseInViewProgressOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let isIntersecting = false;

    const sync = () => {
      const active = isIntersecting && isDocumentVisible();
      setIsActive(active);

      if (!active) {
        setProgress(0);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        isIntersecting = entry.isIntersecting;

        if (!entry.isIntersecting || !isDocumentVisible()) {
          sync();
          return;
        }

        setIsActive(true);
        setProgress(Math.min(1, entry.intersectionRatio / threshold));
      },
      {
        rootMargin,
        threshold: [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 1],
      },
    );

    observer.observe(element);

    const handleVisibilityChange = () => {
      sync();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [rootMargin, threshold]);

  return { isActive, progress, ref };
}
