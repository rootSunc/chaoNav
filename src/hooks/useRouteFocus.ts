import { useEffect, useRef } from 'react';

type PageId = 'home' | 'projects';

export function useRouteFocus(page: PageId) {
  useEffect(() => {
    const targetId = page === 'projects' ? 'projects-title' : 'site-title';

    requestAnimationFrame(() => {
      document.getElementById(targetId)?.focus({ preventScroll: true });
    });
  }, [page]);
}

export function useTerminalFocus(page: PageId, activeLinkId: string) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (page !== 'home') {
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById('terminal-output')?.focus({ preventScroll: true });
    });
  }, [activeLinkId, page]);
}
