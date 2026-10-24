# Nearby arcade improvements

User steered away from films and authorized autonomous game development/publication. Restore the published source after workspace maintenance; do not publish unfinished local film work (not present in the source repository).

Scope: robust shared-input ownership across multiple pointers and keyboard; preserve simulation speed on 10–20fps tablets and pause on long interruptions; readable per-player race cameras and progress standings; a quick three-game cup (reaction, sumo, race in seeded shuffled order), one decisive win each, cumulative points, validated recovery.

Files: lib/arcade-input.ts (input ownership and frame delta), lib/arcade-cup.ts (cup generation/results/restore), lib/arcade.ts (optional win target and race standings), app/arcade-race.tsx (split cameras), app/arcade.tsx/css (UI integration), tests/arcade-cup.test.ts. Preserve old saves and individual games. No new dependencies.

TDD: pointer cancellation and mixed sources; low-frame-rate elapsed time; tied standings; cup one-win target, tied winners, stale result rejection, resume/invalid snapshot; full suite/TypeScript/build/HTTP integration. Browser QA if available; report limitations honestly. Publish and sync GitHub.

Implemented and checked:120model tests pass, TypeScript passes, diff has no whitespace errors. Independent review found an accepted partial-recovery edge (completed current cup leg not yet credited); recoverCup now reconciles it once and a RED→GREEN regression test covers it. Old save without winTarget restores its original goal. Browser QA could not complete: after preview connection failure, browser URL policy blocked observing the internal error page. No browser bypass was attempted. Build and HTTP integration are run by the publication workflow.
