# Implementation plan, milestones & risk register

Derived from SPEC §17. Each milestone lists measurable exit criteria. Status lives in
[`PROGRESS.md`](../PROGRESS.md); this file is the plan.

## Milestones

### M0 — Audit & production plan (SPEC Phase 0)
Docs: CLAUDE.md, PROGRESS.md, ARCHITECTURE.md, this plan, DESIGN_SYSTEM.md,
SCENE_SPECIFICATIONS.md, CONTENT_REFERENCE.md, ASSET_REGISTER.md, PERFORMANCE.md, TEST_PLAN.md.
Content research delegated to two research agents (rules/creators; story/characters).
**Exit:** docs exist and agree with each other; no destructive changes.

### M1 — Foundation (Phase 1)
Vite/React/TS scaffold · `/` and `/tribute` routes (lazy) · 404 · tokens & fonts · chapter data
model (20 chapters) · TopBar, ChapterRail, NotebookIndex dialog, back-to-top, sound toggle
(off) · spoiler gate · skip link · loading & error states · lint/typecheck/test/build/e2e.
**Exit:** both routes load in Chrome; chapter jump works and focuses the heading; typecheck,
lint (0 warnings), unit tests and build pass; layout holds at 1920, 1366, 768 and 390 px wide.

### M2 — Visual prototype & design system (Phase 2)
Opening hero composition · notebook prototype · lighting/material direction · type & spacing
system applied · scroll progress · first transitions · mobile direction.
**Exit:** opening screenshots reviewed at 3 viewports; FPS measured (not guessed) and logged.

### M3 — Core 3D framework (Phase 3)
Shared Stage · SceneDirector/SceneLayer/Compositor · transition shader library · PostFX ·
quality tiers + PerformanceMonitor · reduced motion · WebGL fallback · debug overlay.
**Exit:** jumping 00→15→00 mounts/unmounts scenes and `renderer.info.memory` returns to
baseline (±2); scroll both directions correct; `?webgl=0` fully usable; e2e green.

### M4 — Signature opening (Phase 4) — *first major quality milestone*
Chapter 00 (realm → hole → fall through clouds → night city → schoolyard) and Chapter 01
(hero notebook: cover, opening, page turns, ink-written rules, inspect mode with DOM
controls) · Ryuk silhouette introduction · procedural sound design · loading sequence.
**Exit:** opening reviewed frame-by-frame at 1920×1080 and 390×844; no placeholders; ≥ 50 FPS
average on the RTX 3050 at 1080p `high`; skip-intro works; reduced-motion variant works.

### M5 — Character quality benchmark (Phase 5)
Ink-figure renderer · Light (4 expression states) · L (posture, gaze, stillness) · Ryuk (scale,
eyes, grin, wings) · interaction (gaze follow, hover reaction) · character QA checklist.
**Exit:** side-by-side review against the checklist in SCENE_SPECIFICATIONS §Characters;
recorded as *benchmark pending user sign-off* — the user decides whether 2.5D meets the bar.

### M6 — Story chapters 02–09 (Phase 6)  ·  M7 — Story chapters 10–15 (Phase 7)
One scene per chapter per SCENE_SPECIFICATIONS, shared environment kits, beats written from
the verified fact sheets. **Exit:** continuity checked against `docs/content/story-reference.md`;
each chapter has a distinct composition; scroll/jump reliability re-tested.

### M8 — Encyclopedia 16–19 (Phase 8)
Interactive rulebook (filters, search, canon labels, sources) · Eyes mechanics diagrams ·
character archive (exhibition layout, search, spoiler guards) · timeline & relationships ·
psychology/legacy essay chapter → closing notebook → tribute link.
**Exit:** facts trace to sources; manga-only items labelled; keyboard-only navigation works.

### M9 — Creator tribute (Phase 9)
Independent `/tribute` with its own scene (blank page, pencil, paper light), Ohba / Obata /
collaboration / thank-you sections, verified facts, disclaimer.
**Exit:** works by direct URL with no main-site state; reviewed for tone; no forged signatures.

### M10 — Polish & QA (Phase 10)  ·  M11 — Release (Phase 11)
Viewport matrix, perf profiling, leak checks, axe + manual a11y, reduced motion, SEO/meta,
README, deployment (Vercel — only after the user approves publishing).

## Prioritisation inside this session

1. M0 docs → M1 foundation → M3 framework (needed by everything) → M4 opening.
2. Ship all chapter **content** early (DOM layer) so the site is complete as a reading
   experience while scenes are built; chapters without their final scene are listed as
   *in progress* in PROGRESS.md and use the designed 2D backdrop — never a fake 3D stand-in.
3. M5 characters, then M6/M7 scenes (parallelisable per scene once the contract is proven).
4. M8 encyclopedia UIs and M9 tribute are DOM-heavy and can proceed in parallel.

## Risk register

| # | Risk | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R1 | **Character quality.** No rigged anime-faithful 3D models, no artist, no Blender; hand-authored vector characters may not reach the bar. | High | Critical | 2.5D ink-figure system (SPEC §4.1 fallback) designed around silhouette, lighting and restraint; iterate with screenshot review; benchmark gate M5 needs user sign-off; renderer-agnostic `CharacterPresenter` allows dropping in commissioned GLBs later. | Lead |
| R2 | **Rights.** Temptation to use official art, logos, music. | Medium | Critical | Original/procedural assets only; asset register; disclaimer in footer and tribute; no official logo recreation (title set in Cormorant, not the series logo). | Lead |
| R3 | **Content accuracy** (rule numbering, episode order, anime vs manga). | Medium | High | Two research agents with sources; data-integrity unit tests; canon labels in the type system. | Research |
| R4 | **Performance** of multi-target compositing + post FX on laptops/mobile. | Medium | High | Render only weighted layers; tiered quality; PerformanceMonitor; instancing; measure on RTX 3050 and with CPU/GPU throttling. | Perf |
| R5 | **Scroll fragility** (sticky + smooth scroll + lazy content shifting offsets). | Medium | High | Native scroll truth; ResizeObserver re-measure; no GSAP pin spacers; e2e tests for jump/up/down. | Lead |
| R6 | **Shader compile stalls** when a scene mounts mid-scroll. | Medium | Medium | Mount neighbours ahead of time; `gl.compile` warm-up on mount; keep shader variants few. | 3D |
| R7 | **Memory growth** over long sessions. | Medium | Medium | Unmount distant scenes; dispose imperatively created textures/targets; leak e2e check. | Perf |
| R8 | **Headless testing can't represent GPU perf.** | High | Medium | Visual checks headless; FPS measured in headed Chrome on the real GPU via `scripts/perf.mjs`. | QA |
| R9 | **Scope.** 20 chapters + tribute + archive is very large. | High | High | Strict priorities above; reusable kits; honest PROGRESS.md; parallel agents for well-bounded scenes. | Lead |
| R10 | **Fonts/i18n weight** (Noto Serif JP). | Low | Low | Fontsource unicode-range subsets; JP used only for a few names. | Lead |
| R11 | `.gitignore` reduced to `node_modules` outside this agent. | — | Low | Flagged to the user; don't stage build output. | Lead |
