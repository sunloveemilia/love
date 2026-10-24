# Social Nearby Implementation Plan

> **For agentic workers:** Use inline superpowers:executing-plans; one whole-change code review.

**Goal:** Add conversation-first games and make the Games/Nearby split real.
**Architecture:** Shared pure social session model and seeded banks; local React overlay; explicit catalogue module for remote modes and migrated local IDs.
**Tech Stack:** Existing TypeScript, React and Sites; no dependencies.
**Spec:** docs/superpowers/specs/2026-10-24-social-nearby-design.md

## Global Constraints
Preserve old online sessions and history; user authorizes publication. No new accounts needed for Nearby. Speech outcomes are self-reported; no recording. Source helper owns packaging and push.

## Review Focus
Secret leakage on handoff/resume; duplicate scoring or skipped rounds; pause/deadline fairness; restored malformed events; moved modes leaking through home/favourites/random invites.

### Task 1: Models and catalogue
- [x] RED tests: catalog separation and deterministic random invite, alternating roles, hidden target/reveal, timed expiry/pause, skipped rounds, all eight games finish, save replay and corrupt rejection.
- [x] Implement lib/game-catalog.ts, lib/nearby-social-content.ts, lib/nearby-social.ts; adjust lib/engine.ts invite set. Run focused/full tests.

### Task 2: Interface and migration
- [x] Add app/nearby-social.tsx/css with rules, privacy gates, large controls, spoken answers, optional deeper questions, timer/results/replay, local saves.
- [x] Update app/page.tsx and app/nearby.tsx catalogue, labels, navigation, names and conversation-first layout. Keep arcade/board games accessible lower down.
- [x] TypeScript, whole-suite and independent review; fix blockers.

### Task 3: Publish
- [ ] Build and HTTP integration via source helper; save/deploy public version; sync changed source to existing GitHub branch.

Verification before packaging: all155tests pass;13focused social tests cover ordinary completion of every game with replay at every intermediate state, secret-view gates, deterministic remote invitation membership, deadline/pause, duplicate rejection and corrupt events. TypeScript passes. Independent review completed: private Taboo verdict stage fixed RED→GREEN; unmount now pauses/saves and remote game arrival no longer navigates away from Nearby. Timer-boundary verdict is retained (RED→GREEN). The source checklist records pre-publication state; native deployment and final message report publication. Browser QA remains unavailable under the existing preview policy block; no workaround attempted.
