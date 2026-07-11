import { useEffect, useRef, useState } from 'react';

type UseInViewProgressOptions = {
  readonly rootMargin?: string;
  readonly threshold?: number;
};

export function useInViewProgress({
  rootMargin = '0px 0px -12% 0px',
  threshold = 0.42,
}: UseInViewProgressOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (!entry.isIntersecting) {
          setProgress(0);
          return;
        }

        setProgress(Math.min(1, entry.intersectionRatio / threshold));
      },
      {
        rootMargin,
        threshold: [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 1],
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { progress, ref };
}
