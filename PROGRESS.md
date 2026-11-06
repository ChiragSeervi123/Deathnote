# Project Progress

## Current phase
Phase 0 complete → Phase 1 (Foundation) in progress.

## Overall status
Greenfield repository (only SPEC.md existed). Planning docs written; toolchain installed and
verified; content research running in parallel (two research agents). No feature is complete yet.

## Completed
- [x] Repository & environment audit (docs/ARCHITECTURE.md §1)
- [x] Dependency compatibility assessment and install (React 19.3, Vite 8, TS 6.0, three 0.187,
      R3F 9.8, drei 10.7, GSAP 3.15, Lenis 1.3, React Router 8, ESLint 9, Vitest 5, Playwright 1.65)
- [x] CLAUDE.md, docs/ARCHITECTURE.md, docs/IMPLEMENTATION_PLAN.md (milestones + risk register),
      docs/SCENE_SPECIFICATIONS.md, docs/DESIGN_SYSTEM.md, docs/ASSET_REGISTER.md,
      docs/PERFORMANCE.md, docs/TEST_PLAN.md, docs/CONTENT_REFERENCE.md
- [x] Content data contract `src/data/types.ts`

## In progress
- [ ] Phase 1 foundation: routing, tokens, fonts, chapter data, navigation, gate, loading/error
- [ ] Content research: rules/creators (agent A), story/episodes/characters (agent B)

## Not started
- [ ] Phase 2–3: shared renderer, scene director, compositor/transitions, quality tiers, fallback
- [ ] Phase 4: signature opening (Ch 00–01)
- [ ] Phase 5: character benchmark (Light, L, Ryuk)
- [ ] Phase 6–7: story chapters 02–15 scenes
- [ ] Phase 8: rulebook, eyes, archive, legacy
- [ ] Phase 9: creator tribute
- [ ] Phase 10–11: QA, performance, release

## Known bugs
- None recorded yet.

## Missing assets
- Rigged 3D character models (not available; 2.5D ink-figure approach chosen — see R1).

## Performance observations
- None measured yet.

## Browser testing
- Not yet run.

## Decisions made
- TypeScript 6.0 instead of 7.0 (typescript-eslint compatibility).
- ESLint 9 instead of 10 (eslint-plugin-jsx-a11y compatibility).
- Single shared canvas per route; scenes rendered via portals into render targets and composited
  with a transition shader (docs/ARCHITECTURE.md §3.2).
- CSS `position: sticky` for chapter stages instead of GSAP pinning (reversibility, robustness).
- Characters as 2.5D layered original illustration ("ink figures") — SPEC §4.1 fallback, since no
  rigged models/artist/Blender are available. Must be validated at the M5 gate.
- All 3D props/environments procedural (no Blender); all sound synthesised with WebAudio.
- Site title typeset in Cormorant Garamond — the series logo is not recreated.

## Risks / blockers
- See docs/IMPLEMENTATION_PLAN.md risk register. Top: R1 character quality, R9 scope.
- `.gitignore` was reduced to `node_modules` by a change outside this agent; left as-is and
  flagged to the user.

## Next actions
1. Finish Phase 1 foundation and verify both routes in Chrome.
2. Build the shared renderer + scene director + transitions (Phase 3).
3. Build the signature opening (Phase 4).

## Handoff note
Read CLAUDE.md, then this file. Commands are in CLAUDE.md. The data contract is
`src/data/types.ts`; research output lands in `docs/content/` and `src/data/`.
