import type { NavigationId } from '../data/siteContent';

const LINK_ACCENT_COLORS: Record<NavigationId, string> = {
  profile: '#5eead4',
  projects: '#ff4d5a',
  github: '#a78bfa',
  linkedin: '#60a5fa',
  resume: '#ff8a93',
  blog: '#b8bcba',
};

export function getLinkAccentColor(linkId: NavigationId): string {
  return LINK_ACCENT_COLORS[linkId];
}
