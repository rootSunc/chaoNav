import type { CSSProperties } from "react";

type GlyphName =
  | "profile"
  | "chevron"
  | "arrow"
  | "mail"
  | "copy"
  | "check"
  | "sun"
  | "moon"
  | "pin"
  | "play"
  | "pause"
  | "next"
  | "previous"
  | "code"
  | "book"
  | "headphones"
  | "plus";
const paths: Record<GlyphName, React.ReactNode> = {
  profile: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
    </>
  ),
  chevron: <path d="m9 5 7 7-7 7" />,
  arrow: (
    <>
      <path d="M5 19 19 5M5 5h14v14" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V4H4v12h4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  moon: <path d="M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z" />,
  pin: (
    <>
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  play: <path d="m9 5 11 7-11 7Z" />,
  pause: (
    <>
      <path d="M9 5v14M16 5v14" />
    </>
  ),
  next: (
    <>
      <path d="m5 5 10 7-10 7ZM19 5v14" />
    </>
  ),
  previous: (
    <>
      <path d="m19 5-10 7 10 7ZM5 5v14" />
    </>
  ),
  code: (
    <>
      <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18" />
    </>
  ),
  book: (
    <>
      <path d="M12 6C8 3 4 4 3 5v14c3-2 6-1 9 1 3-2 6-3 9-1V5c-3-2-6-1-9 1Zm0 0v14" />
    </>
  ),
  headphones: (
    <>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="12" width="4" height="8" rx="2" />
      <rect x="17" y="12" width="4" height="8" rx="2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
};
export function Glyph({
  name,
  className = "",
  style,
}: {
  name: GlyphName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={`glyph ${className}`}
      style={style}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
