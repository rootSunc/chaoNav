# Personal Card Navigation Page Design

Date: 2026-05-20
Status: Draft approved for planning

## Goal

Create a single-page personal electronic business card for a developer. The page should feel like a minimal academic/engineering homepage: direct, monochrome, terminal-adjacent, and optimized for quick trust and navigation.

The first version should not become a full portfolio site. It should act as a durable index that points to deeper surfaces such as blog posts, projects, GitHub, LinkedIn, resume, and contact.

## Audience

Primary visitors:

- People who received the link and need to understand who this developer is in under 10 seconds.
- Recruiters, collaborators, engineers, and readers looking for code, writing, projects, or contact details.

Primary user outcomes:

- Identify the person and role quickly.
- Open the right destination quickly.
- See enough developer-specific context to trust the page is maintained and intentional.

## Visual Direction

Visual thesis: a quiet developer homepage that looks like a printed academic card with a single terminal window embedded below it.

The design should be close to the provided reference:

- White or near-white background.
- Centered top identity area.
- Small square avatar or image block with rounded corners.
- Large monospace name.
- One or two short descriptor lines.
- Compact inline navigation.
- A black terminal-style panel below the navigation.
- One accent color for command prompt and links.

Avoid:

- Generic SaaS cards.
- Dense icon grids.
- Purple gradient defaults.
- Decorative social media chrome.
- Large marketing copy.

## Content Plan

### Hero Identity

The top area contains:

- Avatar or placeholder image.
- Name.
- Short role line, for example: `Developer`.
- Short descriptor line, for example: `Building web tools, writing notes, and shipping small useful systems.`

The copy should be editable in one data/config location.

### Primary Navigation

The first version uses no more than 8 primary links:

- `Email`
- `Blog`
- `Profile`
- `Projects`
- `GitHub↗`
- `LinkedIn↗`
- `Resume↗`
- `Now`

External links should include an arrow marker. Internal or same-site links should not.

### Terminal Panel

Default terminal command:

```text
> open now
```

Default terminal content:

- Current focus.
- Preferred stack or working style.
- One or two featured project links.
- Direct contact line.

The terminal panel is content, not a fake shell. It should not require command input in version one.

### Optional Future Links

Good later additions if needed:

- `Uses`: hardware, editor, stack, and services.
- `Notes`: shorter writing separate from blog.
- `Open Source`: maintained packages or contributions.
- `Talks`: presentations and recordings.
- `RSS`: feed for blog or notes.
- `PGP`: public key if relevant.
- `Calendar`: booking link if the user wants scheduled contact.

These should not be in the first version unless there is real content behind them.

## Interaction Thesis

Motion should stay restrained and useful:

- Initial load: avatar, name, nav, and terminal enter with a short stagger.
- Terminal: command line appears first, then content fades or types in quickly.
- Links: hover should sharpen affordance through underline, slight color shift, or arrow movement.

Motion must respect `prefers-reduced-motion`.

## Information Architecture

Version one is a single route/page.

Recommended content structure:

- `profile`: name, avatar, role, descriptor, location/timezone if desired.
- `links`: ordered list of primary nav links.
- `terminal`: command label and terminal lines.

The data should be separated from layout so the page can be edited without touching presentation code.

## Technical Direction

Because the project is empty, implementation can use a small static frontend stack. The recommended default is Vite with React and TypeScript, unless the user requests a different stack.

Implementation should include:

- A single page app.
- Plain CSS or CSS modules.
- No UI component library.
- No backend.
- No analytics in version one unless explicitly requested.

The page should be deployable as static assets.

## Accessibility

Requirements:

- Links must be keyboard focusable.
- Focus states must be visible.
- Color contrast must pass for body text, terminal text, and accent links.
- Avatar must have useful alt text or be marked decorative if it is only ornamental.
- Motion must be disabled or reduced under `prefers-reduced-motion`.

## Responsive Behavior

Desktop:

- Centered column.
- Terminal panel has a generous fixed max width.
- Navigation appears inline and wraps naturally if needed.

Mobile:

- Avatar and identity remain centered.
- Navigation wraps into two or more balanced rows.
- Terminal panel uses full available width with comfortable padding.
- Text remains readable without horizontal scrolling.

## Out Of Scope For Version One

- Interactive command input.
- Multi-page routing.
- CMS integration.
- Blog rendering.
- Project detail pages.
- Theme switcher.
- Animation-heavy terminal simulation.
- Contact form backend.

## Acceptance Criteria

- The page visually matches the reference direction: minimal, centered, monochrome, terminal panel as the main content block.
- The page includes developer-focused navigation with the agreed primary links.
- All visible content can be edited from a small data/config module.
- The page works on desktop and mobile.
- The page has visible keyboard focus states and reduced-motion handling.
- The implementation has a basic verification path such as build/lint or equivalent project checks.
