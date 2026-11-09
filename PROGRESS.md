# Project Progress

## Current phase
Phases 0–9 implemented. Every chapter (00–19) and the tribute route has a built,
browser-reviewed 3D scene. The WIP gate (`WIP_SCENES` in `src/scenes/registry.ts`) is empty.
Remaining work is polish and wider device testing (see Next actions).

## Overall status
The site is a complete, navigable experience end to end: 20 chapters with verified content,
16 story/ambient scene keys plus the tribute scene, interactive archive chapters, and a
designed 2D fallback for no-WebGL. `npm run check` and `npx playwright test` (15 tests) are
green as of 2026-11-10.

## Completed (implemented + browser-tested)
- [x] Phase 0: repo/environment audit, architecture, plan + risk register, all docs
- [x] Toolchain: React 19.3, Vite 8, TS 6.0, three 0.187, R3F 9.8, drei 10.7, postprocessing,
      GSAP 3.15, Lenis 1.3, React Router 8, Zustand 5, Vitest 5, Playwright 1.65, ESLint 9
- [x] Routes `/`, `/tribute`, designed 404 and route error page (route-level code splitting)
- [x] Design tokens, typography (self-hosted OFL fonts), global styles
- [x] Chapter data model (20 chapters, beats, scene keys, transitions, palettes)
- [x] Scroll system (native + Lenis, mutable `scrollState`, chapter tracker, one frame loop)
- [x] Beat choreography (reversible, fade-only under reduced motion)
- [x] Navigation: top bar, notebook index dialog, chapter rail, skip intro / back to top,
      settings (sound, motion, quality), tribute link; spoiler gate; skip link; footer
- [x] Shared renderer: one canvas, SceneDirector (active ±1), SceneLayer → HDR targets,
      Compositor (9 transitions + per-scene grade), PostFX, adaptive quality tiers
- [x] WebGL fallback; procedural sound design (off by default)
- [x] Character system: InkFigure (ink silhouette, flat colour layers, rim offset copy,
      emissive eyes, per-part pivots for animation, tint/rim/glow controls) + parametric
      generic figures. Original figures: Ryuk (silhouette + full), Rem, Light bust with
      expression parts, L crouched, Misa, Near, Mello
- [x] Scenes (all browser-reviewed at 1920×1080 at several beat positions):
  - 00 prologue — realm, Ryuk releases the notebook, fall through clouds, night city
  - 01 notebook — procedural notebook that writes itself; keyboard explore mode
  - 02 realm — Ryuk full, Rem, the hole and the Eyes vision
  - 03 light — Light's room white → crimson, expression arc
  - 04 kira — canyon of screens, counter, ink, the letter L
  - 05 l-room — crouched L, monitor wall, gaze follows the visitor
  - 06 investigation, 08 confinement, 13 strategy — shared evidence-board rig
  - 07 misa — gothic stage, tape, Rem, red Eyes, labelled crowd with one blank lifespan
  - 09 yotsuba — boardroom, eight executives, the red chair, the chain
  - 10 rain — rooftop in rain, the lone figure, dust, absence
  - 11 wammy — split white/black set, Near's assembling jigsaw, Mello's chocolate and exit
  - 12 new-kira — candle plaza, Mikami writing, Takada's studio
  - 14 warehouse — shafts of light, the door ajar with Mikami behind it, forged notebook
  - 15 fall — the room (exposure, one soft flash, Ryuk writes) and the dusk stairway
  - 16/18 archive, 17 eyes, 19 legacy — calm backdrops behind reading pages
  - tribute — DOM sections + 3D drafting-table layer
- [x] Content research: 65 rules, 37 episodes, 61 timeline events, 31 character profiles,
      creator/production facts — all sourced (docs/content/*)
- [x] Encyclopedia: rulebook (search/filters), Eyes, character archive + timeline, legacy
- [x] Tests: 28 unit; 15 Playwright e2e (gate, index + focus, Escape, scroll both ways,
      sound, reduced motion, no-WebGL, rulebook, archive, notebook explore, axe, GPU leak
      check across scene unmount/remount, tribute direct URL, 404, mobile)

## In progress
- [ ] Nothing mid-flight. Polish candidates are listed under Next actions.

## Known bugs / rough edges
- `THREE.Clock` deprecation warning originates inside @react-three/fiber 9.8 (not our code).
- Debug overlay stats freeze on DOM-only stretches (stats update only while the canvas renders).
- Archive (Ch 16/18) backdrop is very dark behind the cards; intentionally quiet, could be
  lifted slightly.
- Generic figures' faces are blank by design; Misa's lash line reads slightly stern in the
  Eyes close-up.

## Missing assets
- None required. All characters are original 2.5D vector figures (SPEC §4.1 fallback);
  no rigged 3D models are used.

## Performance observations (RTX 3050 Laptop, Chrome headless/ANGLE D3D11, 1920×1080, tier high)
- All story scenes hold the 120 FPS vsync cap in review captures.
- Draw calls 22–90 per frame; triangles ≤ ~170k (prologue), ≤ ~17k for the newer scenes.
- GPU leak check: geometries/textures return to baseline after unmount → remount (e2e).
- Bundles: app shell ~102 kB gzip; stage chunk (three/R3F/drei/postprocessing) loads only
  with WebGL2; each scene is its own lazy chunk.

## Browser testing
- 2026-11-07: prologue, notebook, rulebook, eyes, archive, tribute reviewed frame by frame.
- 2026-11-08 → 11-10: every story scene reviewed at 4–7 beat positions; framing rule
  (subject opposite the DOM text anchor) checked per beat; console clean apart from the R3F
  `THREE.Clock` warning.
- Fixed from review this session: New Kira dark desk/studio leak; Misa red-eye layer depth,
  bangs over eyes, tail/sleeve z-fighting, label clutter, NaN seam on the spotlight cone;
  Successors hair over Mello's face and white-on-white Near; warehouse door gap framing;
  Fall room backdrop, flash duration, distant skyline scale.

## Decisions made
- TypeScript 6.0 (not 7), ESLint 9 (not 10) for plugin compatibility.
- One canvas; scenes in portals → render targets → transition compositor → one PostFX chain.
- Sticky CSS tracks, no GSAP pinning; one ordered frame loop; R3F `frameloop="never"`.
- Characters are 2.5D ink figures; flat figures are yaw-billboarded where cameras orbit.
- Distant scene sets live at large x offsets and are joined by near-instant camera cuts.
- Where a set is bright (Successors white side), it is placed and dimmed so DOM text always
  lands on dark.
- The shot in Ch 15 is one soft flash (scroll-driven, off under reduced motion); no blood.
- Names seen through the Eyes are redacted bars and numerals are invented; only Light's name
  is shown, because the beat is about his blank lifespan.
- All 3D assets procedural; all sound synthesised; fonts OFL via Fontsource.

## Risks / blockers
- R1 character fidelity: the 2.5D figures are stylised fan illustration, not anime-accurate
  models; acceptable for the brief but the main subjective risk.
- `.gitignore` contains only `node_modules` (changed outside this agent) — `dist/`,
  `test-results/`, `.artifacts/` are untracked output and must not be committed.
- Deployment not done (outward-facing; needs an explicit go-ahead and a target).

## Next actions
1. Wider viewport review: 1440×900, 2560×1440, ultrawide, tablet, DPR 2, Pixel 7 for the new scenes.
2. Character polish pass (faces of generic figures, Misa's expression, Light full-body figure for Ch 14/15).
3. Headed-GPU perf script (`scripts/perf.mjs`) and a performance-tier sweep.
4. SEO/OG image; deployment when approved.

## Handoff note
Read CLAUDE.md, then this file. Type-check with `npm run typecheck` (`tsc -b`) — plain
`tsc --noEmit -p .` does not check the app project. Visual review: run the dev server or
`npm run build && npx vite preview --port 4173`, then
`MSYS_NO_PATHCONV=1 node scripts/shoot.mjs --base http://localhost:4173 --query gate=0 --shots misa:0.6,fall:0.3`.
Scenes are registered in `src/scenes/registry.ts`; adding a key to `WIP_SCENES` hides it
unless `?wip` is in the URL.
