# Together Visual Implementation Plan

> **For agentic workers:** Execute inline and request one whole-change review.

**Goal:** Improve Together lobby and local-game presentation without changing game rules.
**Architecture:** Shared native SVG illustrations; lobby markup and section navigation; scoped visual stylesheet imported by Nearby; small social catalogue view filter.
**Tech Stack:** Existing React/TypeScript/CSS; no dependencies.
**Spec:** docs/superpowers/specs/2026-10-24-together-visual-design.md

## Global Constraints
Preserve all engines, secrets, input capture, timers and saves. All existing local games remain reachable. Do not introduce image/network dependencies. User authorizes publication.

## Review Focus
Mobile overflow, SVG ID collisions, wrong privacy-stage decoration, hidden controls, reduced-motion/pointer input regression.

### Task 1
- [x] Add app/together-art.tsx native hero and eight game illustrations; render art locally for composition inspection.
- [x] Update Nearby lobby hero, section links, shared-name panel and section IDs; remove duplicate name fields.
- [x] Update social game cards, duration labels and filter; preserve active session on filter changes.

### Task 2
- [x] Add app/together-visual.css with responsive lobby/cards and coherent local-game overlays; retain focus/contrast/touch behavior.
- [x] TypeScript, full155test suite, diff check and independent review. Visual-only changes use existing behavior tests; no CSS-mirroring tests.

### Task 3
- [ ] Package with build/integration; publish existing public Site and sync GitHub; state browser verification limit.

Pre-packaging evidence:155/155existing tests pass; TypeScript and diff checks pass. Hero, eight social-game and four roleplay illustrations rendered to PNG in isolation with React DOM server and Sharp, visually inspected. Whole-page browser QA remains blocked; no alternate browser path attempted. Independent review confirmed responsive cascade, stable filter/session separation, native-details opening, touch/focus/reduced-motion and unchanged privacy/game logic. Fixed the inherited flex-start art sizing with align-self:stretch; strengthened hero SVG selector. The final packaging step reruns TypeScript after the home-teaser markup update.
