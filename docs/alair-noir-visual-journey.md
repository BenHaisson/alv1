# ALAIR NOIR — Visual Journey Production Doc

A creative production pipeline, not a bag of prompts. Claude acts as **creative
director + frontend architect**; **OpenART AI MCP** is the **visual asset
generator**; the site is built on the existing **Vite + React 19 + Tailwind v4 +
`motion` (Framer Motion)** stack. GSAP is intentionally not added — `motion`'s
`useScroll` + CSS `position: sticky` deliver the pinned scroll storytelling
without a new dependency.

- Skill: `.claude/skills/alair-noir-visual-journey/SKILL.md`
- Subagent: `.claude/agents/alair-motion-director.md`

## Pipeline roles

```
Claude            → creative director + frontend architect
OpenART AI MCP    → image generator (GPT Image 2)
Vite / React      → website builder
motion (Framer)   → animation engine (scroll, cards, transitions)
```

Workflow: inspect repo → storyboard → OpenART prompts → generate → select →
build components → wire in → verify desktop + mobile → refine.

## The journey (Arrival → Recognition → Selection → Privacy → Movement → Destination → Booking)

| # | Beat | Feeling | Component (live) | Status |
|---|------|---------|------------------|--------|
| 01 | Hero Arrival | "This is composed." | `HeroCommandDeck` | existing |
| 02 | **Not for everyone. For you.** | "This is for me." | **`NotForEveryone` (new)** | **added** |
| 03 | The Standard | "Nothing is improvised." | `StandardsSection` | existing |
| 04 | Fleet Reveal | "The tools match the standard." | `FleetControlSlider` | existing |
| 05 | Zürich to wherever | "It goes where my day goes." | `SwissRouteIntelligence`, `JourneyCardRail` | existing |
| 06 | Private Interval | "The cabin is mine." | `PrivateAccessScene`, `CabinExperience`* | existing / orphaned* |
| 07 | Booking | "No pressure. Just availability." | `RequestDispatchConsole` | existing |

\* `CabinExperience` / `PrivateOffice` exist in `src/components` but are not
currently wired into `App.tsx`. See "Next candidates" below.

### Gap analysis (what this change addressed)

The live journey already covered beats 01 and 03–07. The signature beat the brief
leads with — **"NOT FOR EVERYONE. FOR YOU."** as scroll-controlled 3D stacked
identity cards — was missing. That is what was built and wired in (Section 02,
between the brand intro and Services).

## Section 02 — `NotForEveryone` (built)

- **File:** `src/components/NotForEveryone.tsx`
- **Data:** `ACCESS_CLASSES` in `src/data.ts` (5 client classes, each with
  `number`, `title`, `tagline`, `description`, `image`).
- **Pattern:** a tall section (`height: count * 62vh`) with a `sticky top-0`
  full-height stage — the same proven pin used by `CinematicOpeningPortal`.
- **Scroll → active card:** `useScroll({ offset: ["start start","end end"] })`
  maps progress to an `activeIndex`; cards animate between 3D states.
- **3D stack:** active card front (scale 1); upcoming cards scaled down, nudged
  down/right, slightly blurred, lower z; past cards slide left and fade.
- **Controls:** vertical scroll (all devices), clickable index list (desktop),
  progress dots (mobile), and horizontal drag/swipe on the active card — all
  route through one `goTo(i)` that scrolls the page, so nothing fights the
  scroll position.
- **Reduced motion:** `useReducedMotionPref()` swaps the pinned 3D stage for a
  quiet responsive grid — no pin, no transforms.
- **Verified:** active card advances 01→05 on desktop (1366) and mobile (390);
  **zero horizontal overflow** at every scroll depth on both.

## OpenART prompt system (assets generated for Section 02)

Model **`gpt-image-2`**, mode `text2image`, `aspectRatio: 4:5`,
`resolutionTier: 2k`, `quality: high`. One frame per client class. Negative
constraints are folded into each prompt (GPT Image 2 exposes no separate
negative field): *no visible faces, no logos, no readable text, no license
plate, no neon, no blue/red lighting, no heavy gold, no crowd.*

Every prompt is website-specific: it names the use case (identity card), camera,
lighting, vehicle, location, mood, and **empty copy space** for the card text.

| Class | historyId | Result URL |
|-------|-----------|------------|
| CEO & Founders | `14902JtNxPVvPZYjaVPI` | `…/gpt-image-2-1_1783070571537_07b7b367.png` |
| Family Offices | `3pn9kpl8Q9uwxMdH7iR4` | `…/gpt-image-2-1_1783070554252_31467e70.png` |
| Diplomatic Guests | `kX1TvpCcGLyvzqpcU0bG` | `…/gpt-image-2-1_1783070575433_f5eb6de1.png` |
| Premium Hospitality | `sXJUcYNz9lUH4hWQFOZp` | `…/gpt-image-2-1_1783070568191_60e3c54b.png` |
| Private Clients | `9kFbUsmpZrLUYI557M6A` | `…/gpt-image-2-1_1783070825105_1ce866c1.png` |

Full URLs and the exact prompt text live in
`src/assets/images/identity/README.md`.

> **Integration note.** These frames were generated successfully and live in the
> OpenART account (visible as result cards). The organization egress policy on
> this environment blocks `cdn.openart.ai` (HTTP 403 at the proxy), so the binary
> files could **not** be committed automatically from here — and that block must
> not be routed around. Until the files are dropped in, the five identity cards
> map to existing on-brand assets so the section ships and looks premium. See the
> drop-in guide to activate the bespoke frames in ~2 minutes.

### Prompt templates for the remaining beats

Reusable OpenART prompts for the hero, standards, fleet, destinations and cabin
beats are catalogued in the brief and can be generated the same way (same model,
brand palette, empty copy space, folded negatives) when those sections are
refreshed.

## Animation specification

- **Global easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (already the app default).
- **Stacked cards:** active `scale 1 / opacity 1 / highest z`; each upcoming card
  `scale −0.05`, `y +22px`, slight blur; previous cards slide left, `opacity ~0.25`.
- **Transitions:** slow (0.9s), no bounce, no spin. Card copy fades up when active.
- **Motion discipline:** one hero motion per section; scroll progress drives state
  intentionally; pinned sections only where they earn it.

## How to edit later

- **Copy / classes:** edit `ACCESS_CLASSES` in `src/data.ts` (title, tagline,
  description). Add/remove entries — the stack and index adapt to the count.
- **Images:** repoint the five `identity*` keys in `src/assets.ts` (see drop-in
  guide).
- **Motion speed:** the `0.9`s durations and `EASE` constant in
  `NotForEveryone.tsx`; stack geometry lives in the `cardTransform()` helper.
- **Placement:** the section is inserted in `src/App.tsx` after `WhatWeAre`,
  deliberately **not** wrapped in `ChapterReveal` (its transform would break the
  sticky pin).

## Next candidates (not built here, to avoid disturbing the live design)

- Wire `CabinExperience` / `PrivateOffice` in as an explicit **Private Interval**
  beat (06) with a bespoke rear-cabin OpenART frame.
- Optional 3D **Destination Stack** variant of `SwissRouteIntelligence` reusing
  this same pinned-stack mechanism.
