# Personal Card Navigation Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static developer-focused personal card navigation page matching the approved terminal-first design.

**Architecture:** Use a small Vite React TypeScript app with page content stored in a typed data module and presentation split into one page component plus CSS. Keep the app static, deployable from `dist/`, and avoid UI libraries.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, plain CSS.

---

## File Structure

- Create `package.json`: scripts and dependencies for Vite, React, TypeScript, Vitest, Testing Library.
- Create `index.html`: Vite entry HTML.
- Create `src/main.tsx`: React root bootstrap.
- Create `src/App.tsx`: personal card page layout.
- Create `src/profile.ts`: typed editable profile, navigation, and terminal content.
- Create `src/App.test.tsx`: behavior tests for identity, navigation, terminal content, and reduced-noise structure.
- Create `src/test/setup.ts`: test-dom setup.
- Create `src/styles.css`: visual system, responsive layout, motion, and reduced-motion handling.
- Create `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`: build and test configuration.

## Visual Working Model

- Visual thesis: quiet monochrome developer homepage with one terminal block as the page's main artifact.
- Content plan: centered identity, compact navigation, terminal `open now` block, direct contact/project links.
- Interaction thesis: staggered page entrance, terminal command reveal, link hover/focus affordance with reduced-motion support.

## Tasks

### Task 1: Scaffold App And Test Harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Add package and config files**

Create the project scripts for `dev`, `build`, `preview`, and `test`. Configure Vitest with jsdom and Testing Library setup.

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: `package-lock.json` is generated and dependencies install successfully.

- [ ] **Step 3: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json src/test/setup.ts
git commit -m "chore: scaffold vite react app"
```

### Task 2: Write Failing Page Tests

**Files:**
- Create: `src/App.test.tsx`
- Create: `src/profile.ts`

- [ ] **Step 1: Write tests before production UI**

Add tests that expect:

- The configured name and developer role render.
- The primary navigation contains `Email`, `Blog`, `Profile`, `Projects`, `GitHub`, `LinkedIn`, `Resume`, and `Now`.
- External links expose an accessible label containing `opens external site`.
- The terminal block renders command `open now` and at least one project/contact line.

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test -- --run`

Expected: FAIL because `src/App.tsx` and `src/main.tsx` are not implemented yet.

### Task 3: Implement Data And React Layout

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Modify: `src/profile.ts`

- [ ] **Step 1: Implement typed profile data**

Define profile, links, and terminal lines in `src/profile.ts`.

- [ ] **Step 2: Implement the page component**

Render the identity, navigation, and terminal panel from profile data. Use semantic landmarks and accessible labels.

- [ ] **Step 3: Run tests to verify GREEN**

Run: `npm test -- --run`

Expected: PASS.

- [ ] **Step 4: Commit behavior**

Run:

```bash
git add src/App.test.tsx src/App.tsx src/main.tsx src/profile.ts
git commit -m "feat: add personal card page content"
```

### Task 4: Implement Visual Design

**Files:**
- Create: `src/styles.css`
- Modify: `src/main.tsx`

- [ ] **Step 1: Add CSS visual system**

Implement monochrome page styling, centered identity, inline wrapping navigation, black terminal panel, accent link color, hover/focus states, responsive layout, entrance motion, and `prefers-reduced-motion`.

- [ ] **Step 2: Import styles**

Import `src/styles.css` from `src/main.tsx`.

- [ ] **Step 3: Run tests and build**

Run: `npm test -- --run`

Expected: PASS.

Run: `npm run build`

Expected: TypeScript and Vite build complete with exit code 0.

- [ ] **Step 4: Commit styling**

Run:

```bash
git add src/styles.css src/main.tsx
git commit -m "feat: style terminal-first personal card"
```

### Task 5: Browser Verification And Final Review

**Files:**
- No required source file changes unless verification reveals issues.

- [ ] **Step 1: Run local app**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints a local URL.

- [ ] **Step 2: Inspect in browser**

Open the local URL and verify:

- Desktop composition matches the approved reference direction.
- Navigation wraps and remains readable on mobile viewport.
- Terminal panel has no horizontal overflow.
- Focus styles are visible.

- [ ] **Step 3: Run final verification**

Run: `npm test -- --run`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Review git diff**

Run: `git status --short` and `git log --oneline --max-count=5`.

Expected: only intended files changed; commits exist for scaffold, content, and styling.
