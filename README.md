# Chao Navi

A compact personal navigation page built with React, Vite, and TypeScript.

## Commands

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

## Structure

- `src/App.tsx` wires the page-level state and layout.
- `src/components/` contains presentational UI pieces.
- `src/data/` contains profile/navigation content and music metadata.
- `src/hooks/` contains browser-facing stateful behavior.
- `src/lib/` contains small pure utilities and shared types.
- `public/` contains static media served by Vite.

Music source and license metadata lives with each track in `src/data/musicLibrary.ts`.

## Personal card

The site has three static entry routes: `/`, `/projects`, and `/notes`.
`pnpm build` produces each route in `dist/` for static hosting.

The active visual system is `src/styles/card.css`, including light and dark
palettes, responsive layouts, and reduced-motion support. The hero sculpture
is generated as SVG, so the new pages do not require WebGL. Featured work,
notes, and music are editable under `src/data/`.

Run `pnpm test --run` for unit tests and `pnpm test:e2e` for browser and visual
checks. Install Chromium with `pnpm exec playwright install chromium` first,
or use `PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e` with an installed Chrome.
