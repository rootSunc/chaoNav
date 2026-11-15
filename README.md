# Chao Sun — `chaosun.xyz`

A one-page personal site built with React, Vite and TypeScript. One sentence introduces four open-source projects; each gets a chapter with a small working specimen.

## Commands

```sh
pnpm install
pnpm dev
pnpm test --run
pnpm build
```

## How it is put together

- `src/content.ts` holds every word and fact on the page, in English and Chinese, plus the CNEquity dataset registry and the Finnish words used by the specimens.
- `src/App.tsx` composes the page: masthead, intro, four chapters in two groups, the EquityLab aside, and the closing section.
- `src/components/FitName.tsx` sets a project name as wide as the page and gives it weight as it scrolls up the viewport.
- `src/components/specimens/` has one miniature per project: `LakeGrid` (CNEquity), `TierLine` (USEquity), `Morphology` (Suomeksi), `Signals` (ArkiWatch).
- `src/hooks/useLiveSources.ts` fetches GitHub star counts and Helsinki weather and air quality (Open-Meteo) in the visitor's browser. A value that cannot be fetched is shown as a dated snapshot or as unavailable.
- `src/lib/helsinkiSolar.ts` computes the sun over Helsinki locally. With no stored choice the page is light while the sun is above -4° and dark otherwise (`src/lib/theme.ts`, mirrored by the inline script in `index.html`).
- `src/styles.css` is the whole visual system: one typeface (Recursive, self-hosted), one ink colour per theme, one red seal.

## Verification

`pnpm build` writes `dist/`, with `/projects` and `/notes` kept as copies of the page so old links still land.
Run `pnpm test --run` for unit tests and `PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e` for interaction, phone and first-screen visual checks.
