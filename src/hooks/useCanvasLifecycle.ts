import { useEffect, useRef, useState } from 'react';

function isDocumentVisible(): boolean {
  return typeof document === 'undefined' || document.visibilityState === 'visible';
}

export function useCanvasLifecycle<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let isIntersecting = true;

    const sync = () => {
      setIsActive(isIntersecting && isDocumentVisible());
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = Boolean(entry?.isIntersecting);
        sync();
      },
      {
        rootMargin: '10% 0px',
        threshold: 0,
      },
    );

    observer.observe(element);

    const handleVisibilityChange = () => {
      sync();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isActive, ref };
}
