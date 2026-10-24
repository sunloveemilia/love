# Nearby New Games Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for inline execution and one final review.

**Goal:** Publish three playable tablet games in Рядом.
**Architecture:** Pure TypeScript models; React overlay and SVG golf course; scoped CSS; versioned local snapshot.
**Tech Stack:** Existing React 19, TypeScript and Sites.
**Spec:** docs/superpowers/specs/2026-10-24-nearby-new-games-design.md

## Global Constraints
No packages, no account needed, two players on one tablet, preserve existing games and hosting audience. Source helper owns Git packaging. User authorizes inline execution and publication.

## Review Focus
Fast duplicate taps must not score twice; two-cell capture must keep turn; golf cannot tunnel through walls or shoot mid-motion; interrupted golf must not take phantom shots; corrupt snapshots must fail safely.

### Task 1: Game models
Files: lib/nearby-boards.ts; tests/nearby-boards.test.ts.
- [x] Write and run failing tests for duplicate edges, double capture, complete board, memory pairing/turns, golf collision/capture/stroke limit, restore validation.
- [x] Implement exported createDots/drawEdge, createMemory/flipMemory/closeMemory, createGolf/shootGolf/stepGolf/nextGolf, restoreBoard. Run focused and full tests.

### Task 2: Tablet collection
Files: app/nearby-boards.tsx, app/nearby-golf.tsx, app/nearby-boards.css; integrate app/nearby.tsx.
- [x] Add lobby cards, names, rules, scoreboard, save/resume and rematch.
- [x] Add golf drag + accessible controls, pause on hide, dots edge buttons, memory cards and explicit mismatch close.
- [x] TypeScript and complete tests, review.
- [ ] Build and server integration through the source packaging helper.

### Task 3: Publication
- [ ] Package source through Sites, save and deploy public version, sync changed files to GitHub branch two-universe, report verification limits.

Publication result is reported by the native deployment tool and final user message; source checklist records the state at packaging time.

Progress: 14 focused model tests pass, including full matches, wall collision, double capture, moving-save resume and malformed storage. Whole suite142passed; TypeScript passed. Independent whole-change review found no remaining blockers; ninth-stroke restoration edge case fixed with a RED→GREEN regression. Native summary element included in focus trap so rules remain keyboard-accessible. Root cause fixes after RED tests: finite but enormous shot angles could overflow conversion; golf restore did not reject a completed current player or velocity on the other ball. Both now reject invalid input.
