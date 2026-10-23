# Four games for one tablet

Goal: add the four games explicitly selected by the user to «Мы рядом», quickly, with existing React/TypeScript styling and no new dependencies or accounts.

Design: a local game hub alongside the current drawing/laugh/dubbing games. Court has three cases, alternating prosecution/defence and a chosen funny verdict. Heist has four generated locks, separate guide/solver screens, a 20-minute clock, penalties and a real success/failure. Bluff has six rounds of hidden choices, explicit payoff rules and automatic scoring. Remote has four rounds: secretly choose each other's character, reveal the pair, play a two-minute scene with a midpoint twist, choose a shared outcome.

Architecture: lib/together-extra.ts owns deterministic content, validated transitions, deadlines, scoring and replay-based restore. app/together-extra.tsx owns the shared tablet overlay and game views. app/together-extra.css reuses the existing visual language. app/nearby.tsx embeds the new hub. Progress stays in this browser and survives reload.

Constraints: large touch targets; no second device; hidden choices behind handoff screens; no real money; pause/resume; no unrelated changes. The user has opted out of approval questions and asked for fast implementation; execute inline and publish after verification.

- [x] Write failing tests for court progression, four-lock heist, penalties/expiry, hidden bluff scoring, remote role assignment, pause/reload and corrupt snapshots.
- [x] Implement the model and run tests.
- [x] Add the four-game interface, connect it to Nearby, and browser-check the main flows.
- [ ] Run full suite, TypeScript, build and integration; save/publish and sync GitHub.

Review focus: double actions, wrong-role handoffs, elapsed timers after reload, invalid saved data, final-round completion.

Review: independent review identified a first-lock information leak; shuffled the guide legend independently and verified the regression test RED→GREEN. Court completed through all three cases in browser; heist first lock opened with the computed code; bluff concealed/revealed choices and scored 5/2; remote correctly assigned roles and restored a paused scene after reload.
