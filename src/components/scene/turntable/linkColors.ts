import type { NavigationId } from '../../../data/siteContent';

const LINK_ACCENT_COLORS: Record<NavigationId, string> = {
  profile: '#286d68',
  projects: '#f1414d',
  github: '#6e5494',
  linkedin: '#0a66c2',
  resume: '#92001c',
  blog: '#686c6a',
};

export function getLinkAccentColor(linkId: NavigationId): string {
  return LINK_ACCENT_COLORS[linkId];
}
