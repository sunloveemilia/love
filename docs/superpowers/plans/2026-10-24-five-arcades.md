# Improve every shared-device arcade

User requests improving all current games; focus on the five Mini-arena games and retain the cup. Existing no-confirmation authorization remains in force.

Deliverables: race boost pads with per-lap pickup and saved counters; sumo press-to-dash with cooldown; tank shells bouncing once off walls, three symmetric cover layouts and hit feedback; amber reaction decoys that never award points; hockey puck anti-stall, speed cap and motion trail. Update instructions and game-specific touch labels/feedback. No new packages. Preserve old snapshots and deterministic equal-input races.

Files: lib/arcade.ts model/restore; app/arcade.tsx controls/status; app/arcade-canvas.tsx rendering; app/arcade-race.tsx pads; tests/arcade-upgrades.test.ts.

Verification: RED→GREEN focused gameplay tests, full suite, TypeScript, independent review, build and HTTP integration. Browser QA only through supported preview; do not bypass a browser policy block. Save/publish and sync GitHub.

Completed model/render integration. Independent review identified the sumo dash being cancelled by the ordinary speed cap; fixed with a short higher cap and RED→GREEN regression. Also added RED→GREEN legacy tank-layout migration coverage. Full suite128passes, TypeScript passes. Browser QA remains unavailable after the prior preview browser URL-policy rejection; no workaround attempted. Build and server integration run before publication.
