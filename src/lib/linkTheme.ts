import type { NavigationId } from '../data/siteContent';

const LINK_ACCENT_COLORS: Record<NavigationId, string> = {
  profile: '#22d3ee',
  projects: '#f472b6',
  github: '#a78bfa',
  linkedin: '#60a5fa',
  resume: '#fbbf24',
  blog: '#2dd4bf',
};

export function getLinkAccentColor(linkId: NavigationId): string {
  return LINK_ACCENT_COLORS[linkId];
}
