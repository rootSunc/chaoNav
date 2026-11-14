# Chao Sun — Contrapuntal Workbench (`chaosun.xyz`)

A personal space and engineering workbench built with React, Vite, and TypeScript—set in Helsinki (`60°10′N, 24°56′E`).

## Commands

```sh
pnpm install
pnpm dev
pnpm test --run
pnpm build
```

## Architecture

- `src/lib/helsinkiSolar.ts` computes deterministic solar elevation, azimuth, sunrise/sunset, and northern sky light phases for Helsinki directly on the client clock (with a 24-hour scrubbable horizon curve in `SolarHorizonBar.tsx`).
- `src/App.tsx` wires route lenses (`/` Field, `/projects` Systems, `/notes` Cadence), persistent classical audio playback, and Northern Slate / Daylight Paper polarity.
- `src/components/HomeView.tsx` composes the two-voice **Contrapuntal Workbench** (`I. Systems` and `II. Cadence`) bridged by a live `ResizeObserver`-measured SVG Bézier resonance spine.
- `src/components/specimens/ProjectSpecimens.tsx` & `SystemArtifact.tsx` pair working miniature instruments (`CNEquity`, `ArkiWatch`, `Suomeksi`, `DaisyNotice`, `QParking`) with optional deep-inspection interface plates.
- `src/components/ScorePlayer.tsx`, `CoastalContour.tsx`, and `FieldNotesLedger.tsx` house chamber recordings, the 26.4 km western Helsinki islands coastal loop, and expandable field notes.
- `src/styles/workbench.css` and `src/styles/mobile.css` define the visual system, northern horizon atmosphere, responsive breakpoints, thumb-level mobile lens bar (`<= 600px`), and `prefers-reduced-motion` support.

## Verification

`pnpm build` produces static prerendered routes (`/`, `/projects`, `/notes`) in `dist/`.
Run `pnpm test --run` for unit tests and `PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e` (or `pnpm exec playwright install chromium && pnpm test:e2e`) for interaction, mobile touch, and visual regression checks.
