import { useEffect } from 'react';
import type { NavigationId } from '../data/siteContent';
import { getLinkAccentColor } from '../lib/linkTheme';

export function useSessionAccent(activeLinkId: NavigationId) {
  useEffect(() => {
    const accent = getLinkAccentColor(activeLinkId);

    document.documentElement.style.setProperty('--session-accent', accent);
    document.body.dataset.activeLink = activeLinkId;
  }, [activeLinkId]);

  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty('--session-accent');
      delete document.body.dataset.activeLink;
    };
  }, []);
}
