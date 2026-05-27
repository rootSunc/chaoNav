import type { ReactNode } from 'react';
import type { NavigationId } from '../data/siteContent';

const iconPaths = {
  blog: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </>
  ),
  profile: (
    <>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  projects: (
    <>
      <path d="m16 6 6 6-6 6" />
      <path d="m8 18-6-6 6-6" />
    </>
  ),
  github: (
    <>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.36-1.17-3.36-1.17-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.64.35-1.08.63-1.33-2.21-.25-4.54-1.1-4.54-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0 1 12 6.03c.85 0 1.7.11 2.5.33 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v2" />
      <rect x="2" y="8" width="4" height="13" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  resume: (
    <>
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v4h4" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </>
  ),
} satisfies Record<NavigationId, ReactNode>;

export function Icon({ id }: { id: NavigationId }) {
  return (
    <svg aria-hidden="true" className="ui-icon" fill="none" viewBox="0 0 24 24">
      <g
        fill={id === 'github' ? 'currentColor' : 'none'}
        stroke={id === 'github' ? 'none' : 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        {iconPaths[id]}
      </g>
    </svg>
  );
}
