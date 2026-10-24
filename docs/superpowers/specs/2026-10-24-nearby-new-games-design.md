# Three new games for Рядом

User delegates design, implementation, checks and publication without stepwise confirmation. Add three short games for a couple sharing one tablet, building on the current React/TypeScript site. No packages or account/server requirements.

Mini-golf: three courses shared by both players, alternate shots, circular ball collisions against course walls, drag-to-aim plus angle/power controls. Maximum eight strokes per hole. Lower total wins; ties allowed. Course completes only after both players finish. Explicit next-course action and rematch.

Захват клеток: classic dots and boxes, 5×4 cells. Close a cell to score and keep your turn; a double capture awards both. Finish at 20 cells and allow ties. Large tappable edges with keyboard focus and player-coloured ownership.

Память на двоих: a shared shuffled deck of ten pairs, alternate attempts, remember mismatches until both are ready to close them, then continue. Cooperative result counts attempts and pair completion, no time pressure.

Approach: separate pure game models, one new section and full-screen game overlay, scoped CSS. Extending the existing continuous arcade engine would mix turn-based and continuous lifecycles; a separate nearby board-game collection keeps both simple. Preserve current games and backend. Save the active game after actions; pause golf and cancel aiming when hidden or on menu exit. Safe bounded restore for malformed storage.

Author choices: three games, fixed two-player mode, three golf courses, shared co-op memory rather than competitive memory. Existing user authorization covers these choices. Browser QA is currently blocked by the preview environment; continue supported non-browser verification and publication without bypassing it.
