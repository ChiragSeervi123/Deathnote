# Project Progress

## Current phase
Phases 0, 1 and 3 complete; Phase 4 (signature opening) built and browser-reviewed with a
first quality pass; Phase 8 (archive chapters) built and tested; Phase 9 (tribute) DOM version
built. **Phase 5 (character benchmark) and Phases 6–7 (story-chapter 3D scenes) not started.**

## Overall status
The site is a complete, navigable reading experience end to end: all 20 chapters have real,
verified content; the archive chapters are interactive; the tribute route stands alone. Two of
the planned 16 3D environments exist (Ch 00 prologue, Ch 01 notebook). Every other chapter
currently shows the designed 2D backdrop — by design, not as a fake 3D stand-in — and is
listed below as not started.

## Completed (implemented + browser-tested)
- [x] Phase 0: repo/environment audit, architecture, plan + risk register, all docs
- [x] Toolchain: React 19.3, Vite 8, TS 6.0, three 0.187, R3F 9.8, drei 10.7, postprocessing,
      GSAP 3.15, Lenis 1.3, React Router 8, Zustand 5, Vitest 5, Playwright 1.65, ESLint 9
- [x] Routes `/`, `/tribute`, designed 404 and route error page (route-level code splitting)
- [x] Design tokens, typography system (self-hosted OFL fonts), global styles
- [x] Chapter data model (20 chapters, beats, scene keys, transitions, palettes)
- [x] Scroll system: native scroll + Lenis (off under reduced motion), mutable per-frame
      `scrollState`, chapter tracker, single ordered frame loop (GSAP ticker)
- [x] Beat choreography (reversible, fade-only under reduced motion), unit-tested maths
- [x] Navigation: top bar, floating notebook index (`<dialog>`, Escape, focus return),
      chapter rail, skip intro / back to top, settings (sound, motion, quality), tribute link
- [x] Spoiler gate (remembered), skip link, footer disclaimer on every route
- [x] Shared renderer: one canvas, SceneDirector (mount active ±1), SceneLayer portals into
      HDR targets, Compositor with 9 transition shaders + per-scene grading, PostFX (bloom,
      AgX, vignette, grain), adaptive quality (auto + PerformanceMonitor + manual tiers)
- [x] WebGL fallback (`?webgl=0` / no WebGL2 / context loss → designed 2D backdrop)
- [x] Procedural sound design (WebAudio drone, wind, rain, room, hum, page cues), off by default
- [x] Ch 01 notebook scene: procedural notebook (leather normal map, worn edges, gothic cover
      type, inside-cover instructions, ruled paper, ink-atlas handwriting that writes itself,
      CPU page curl), desk, lamp, rain window, apple, pencil, dust — scroll-choreographed
- [x] Ch 00 prologue scene: realm (displaced terrain, hole with throat, bone spires, boulders,
      ash), dead-sun sky blending to night, animated Ryuk silhouette (breath, head, arm, eyes)
      releasing the notebook, fall through cloud decks, instanced night city (window shader,
      sodium streets, rain), courtyard landing
- [x] Content research: 65 rules, 37 episodes, 61 timeline events, 31 character profiles,
      creator/production facts — all sourced (docs/content/*); chapter copy checked against
      the fact sheets (one factual error fixed: Soichiro's death)
- [x] Story chapter case files (episodes + key events from data, canon labels)
- [x] Ch 16 rulebook (search, topic + source filters, canon badges, sources)
- [x] Ch 17 Eyes (original diagrams, worked examples, related rules)
- [x] Ch 18 archive (search, tiers, profile dialog with relationship navigation, spoiler
      reveal) + timeline view (61 events by arc)
- [x] Ch 19 legacy essays + closing notebook + tribute invitation
- [x] Tribute DOM version: paper art direction, Ohba / Obata / collaboration / thank-you,
      verified "on record" facts with sources, disclaimer
- [x] Tests: 28 unit (scroll maths, beats, scheduling, data integrity); 14 Playwright e2e
      (gate, index + focus, Escape, scroll both ways, sound, reduced motion, no-WebGL,
      rulebook, archive, axe, GPU leak check, tribute direct URL, 404, mobile)

## In progress
- [ ] Opening polish (Phase 4): the fall's city vista and the realm close-ups can be pushed
      further; notebook "inspect mode" (drag/keys to turn pages) not yet built

## Not started
- [ ] Phase 5 character benchmark: ink-figure renderer; Light, L, Ryuk full presentations
- [ ] Phase 6–7 3D scenes for Ch 02–15 (realm, light, kira, l-room, investigation, misa,
      confinement, yotsuba, rain, wammy, new-kira, strategy, warehouse, fall) — currently 2D
- [ ] Ambient scenes for Ch 16–19 (`archive`, `eyes`, `legacy`) — currently 2D
- [ ] Tribute 3D scene (blank page, pencil, paper light)
- [ ] Viewport matrix review beyond 1920×1080 / 1440×900 / Pixel 7; tablet; ultrawide; DPR 2
- [ ] Headed-GPU perf script (`scripts/perf.mjs`); SEO/OG image; deployment (needs approval)

## Known bugs
- Debug overlay stats freeze on DOM-only chapters (stats update only while the canvas renders).
- `THREE.Clock` deprecation warning originates inside @react-three/fiber 9.8 (not our code).
- Long-form chapters: the archive search block repeats a border line under the tabs (cosmetic).

## Missing assets
- Rigged anime-faithful 3D characters (none available; see R1). Tier 1/2 character
  presentations beyond the prologue silhouette do not exist yet.

## Performance observations (RTX 3050 Laptop, Chrome 156, 1920×1080, tier high)
- Notebook scene: 120 FPS (vsync cap), ~45–55 draw calls, ~10k tris.
- Prologue scene: 120 FPS throughout, 38–64 draw calls, ~140–170k tris.
- Bundles (gzip): app shell 102 kB; main route 85 kB (all verified data); stage chunk
  (three/R3F/drei/postprocessing) 276 kB, only when WebGL2 is available; prologue 9 kB;
  notebook 29 kB.
- GPU leak check: geometries/textures return to baseline after unmount → remount (e2e).

## Browser testing
- 2026-11-07: Chrome 156 (headless, ANGLE D3D11 on RTX 3050) at 1920×1080 — prologue,
  notebook, rulebook, eyes, archive, tribute reviewed frame by frame; console clean apart
  from the R3F `THREE.Clock` warning. Playwright: 1440×900 desktop + Pixel 7 mobile.
- Fixed from review: stale render targets (composer disables autoClear), page winding,
  cover clipping, spine ridge, rain-window polka dots, window-shader static (interpolated
  seed + hash), inverted street glow, framing under DOM text, contrast of accent red (axe).

## Decisions made
- TypeScript 6.0 (not 7), ESLint 9 (not 10) for plugin compatibility.
- One canvas; scenes in portals → render targets → transition compositor → one PostFX chain.
- Sticky CSS tracks, no GSAP pinning; one ordered frame loop; R3F `frameloop="never"`.
- Characters: 2.5D/silhouette approach (SPEC §4.1 fallback). Prologue Ryuk is a deliberate
  backlit silhouette; full presentations remain Phase 5.
- All 3D assets procedural; all sound synthesised; fonts OFL via Fontsource.
- Site title in Cormorant Garamond; the series logo is not recreated.
- Accent red raised to #e2525a for AA contrast.
- Data dates use the manga calendar; the anime runs three years later (noted in UI).

## Risks / blockers
- R1 character quality remains the top risk; needs the Phase 5 benchmark and user sign-off.
- R9 scope: 14 story scenes + characters + tribute scene remain.
- `.gitignore` contains only `node_modules` (changed outside this agent) — `dist/`,
  `test-results/`, `.artifacts/` are untracked build/test output and must not be committed.

## Next actions
1. Phase 5: build the ink-figure character renderer and the Light / L / Ryuk benchmark;
   get the user's verdict on the 2.5D approach before scaling.
2. Phase 6: realm (Ch 02) and Light's room (Ch 03) scenes, reusing prologue/notebook kits.
3. Notebook inspect mode; tribute 3D scene; full viewport matrix; perf script.

## Handoff note
Read CLAUDE.md, then this file. `npm run check` and `npx playwright test` are green.
Visual review: `npm run build && npx vite preview --port 4173` then
`MSYS_NO_PATHCONV=1 node scripts/shoot.mjs --shots prologue:0.45,notebook:0.4` (Git Bash
rewrites `/paths` without that variable). Scenes are registered in `src/scenes/registry.ts`;
a scene with `Component: null` shows the 2D backdrop.
