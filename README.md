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
