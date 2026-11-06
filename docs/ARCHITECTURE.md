# Architecture

Status: **Phase 0 proposal, being implemented.** Update this file when a decision changes.

## 1. Repository audit (2026-11-06)

- Git repo on `main`, one commit (`6e0ebbf first commit`) containing only `SPEC.md`.
- No framework, no dependencies, no existing code or assets → greenfield. Nothing to preserve
  except the spec.
- Environment: Windows 11, Node 24.18, npm 11.16, Python 3.13, Chrome 156 + Edge installed,
  Playwright Chromium cached. **No Blender.** GPU: NVIDIA RTX 3050 Laptop 6 GB + Intel UHD,
  i5-13450HX (16 threads), 16 GB RAM, 1920×1080 panel.
- Claude capabilities actually available in this session: Opus model, subagents (general-
  purpose, Explore, Plan), background tasks, web search/fetch, Playwright (local) for browser
  automation and screenshots, Vercel MCP (deployment — requires explicit go-ahead). **Not
  available:** Claude-in-Chrome / built-in browser tools, Blender, image generation. Browser
  testing therefore uses Playwright driving the installed Chrome, with screenshots reviewed
  visually.

## 2. Dependency decisions

| Package | Version | Why / compatibility notes |
| --- | --- | --- |
| react / react-dom | ~19.3.1 | R3F 9.8 peer range is `>=19 <19.4` — pinned with `~`. |
| vite | ^8.3 | Rolldown-based. `build.rolldownOptions` replaces `rollupOptions`. |
| typescript | ~6.0.3 | TS 7 (native) is `latest`, but typescript-eslint supports `<6.1.0`. |
| three / @types/three | ~0.187 | Pinned minor: three has no semver; drei/postprocessing tested against it. |
| @react-three/fiber | ^9.8 | React 19 renderer. Portals give each scene its own scene/camera. |
| @react-three/drei | ^10.7 | Helpers: PerformanceMonitor, useFBO, PerspectiveCamera, Instances. |
| @react-three/postprocessing + postprocessing | ^3.2 / ^6.39 | Bloom (mipmap), Noise, Vignette, ToneMapping. |
| gsap + @gsap/react | ^3.15 | ScrollTrigger + SplitText (all plugins free since 3.13). |
| lenis | ^1.3 | Smooth scroll on native scroll position (keyboard, anchors, a11y intact). Disabled under reduced motion. |
| react-router | ^8.5 | `createBrowserRouter` + route `lazy` for route-level code splitting. |
| zustand | ^5 | Low-frequency UI/runtime state. Per-frame values live in a plain mutable object. |
| eslint | ^9.39 | eslint-plugin-jsx-a11y does not yet support ESLint 10. |
| vitest / playwright | ^5.1 / ^1.65 | Unit + E2E. Playwright uses `channel: 'chrome'` (installed Chrome 156). |

## 3. Runtime architecture

```
index.html → main.tsx → App (RouterProvider)
  ├─ RootLayout: SkipLink · global providers · <Outlet/> · route error boundary
  ├─ "/"        MainExperience (lazy)
  │    ├─ SpoilerGate (first visit; remembered)
  │    ├─ Stage (fixed canvas, only if WebGL OK)  ──┐  else FallbackBackdrop (2D art per chapter)
  │    ├─ Navigation: TopBar · ChapterRail · NotebookIndex dialog · Settings (sound/quality/motion)
  │    ├─ <main> ChapterSection × 20  (DOM text, beats, encyclopedia UIs)
  │    └─ SiteFooter (disclaimer, tribute link)
  ├─ "/tribute" Tribute (lazy) — own Stage instance & art direction
  └─ "*"        NotFound
```

### 3.1 Scroll system (`src/animation/scroll`)

- Native document scroll is the single source of truth. Lenis (when motion is allowed) only
  interpolates it; ScrollTrigger is updated from Lenis' scroll event and shares GSAP's ticker.
- `scrollState` (plain mutable object) is written once per frame: `y`, `velocity`,
  `viewportH`, overall `progress`, and per chapter `{ progress, enter, exit, visible }`:
  - `progress` 0→1 while the chapter's sticky stage is pinned (section top at viewport top →
    section bottom at viewport bottom);
  - `enter` 0→1 while the section's top travels from the viewport bottom to the top;
  - `exit` 0→1 while its bottom travels from the viewport bottom to the top.
- Offsets are measured on resize/ResizeObserver, never per frame (no layout thrash).
- `activeChapter` (React-visible) changes only when the chapter under the viewport centre
  changes → navigation re-renders a handful of times per session, not per frame.
- Chapter jumps: `scrollToChapter(id)` → Lenis `scrollTo` (or `window.scrollTo` with
  `behavior: 'auto'` under reduced motion), then focus moves to the chapter heading.
- Sticky stages use CSS `position: sticky` (robust, reversible, no pin-spacer reflow).
  Nothing traps scroll: there is no scroll-jacking beyond Lenis' interpolation.

### 3.2 Shared renderer (`src/scenes/shared`)

- **One `<Canvas>` per route** (main, tribute). WebGL2 required for the canvas; detection runs
  first and the DOM-only fallback is used otherwise or on context loss.
- **Scene keys.** `chapterData` maps each chapter to a scene key (consecutive chapters may share
  one, e.g. the realm). `SceneDirector` derives the visible set every frame from `scrollState`:
  the incoming chapter (largest index with `enter > 0`) and the previous one; `mix = enter`.
- **Mount policy.** Scenes for the active chapter ±1 are mounted (preload & shader warm-up);
  others are unmounted, which disposes everything they own. Each scene is a `React.lazy` chunk
  wrapped in Suspense + an error boundary (a failing scene degrades to the 2D backdrop; the rest
  of the site keeps working).
- **SceneLayer.** `createPortal(scene, new THREE.Scene())` with its own camera (drei
  `PerspectiveCamera makeDefault` inside the portal). A priority −1 `useFrame` renders the portal
  into a HalfFloat render target (MSAA per quality tier) — only while the layer's weight > 0.
- **Compositor.** A full-screen triangle samples up to two layer targets and applies the
  transition (`cut`, `fade`, `ink`, `smoke`, `pageTurn`, `redToBlue`, `silhouette`, `close`)
  plus per-scene colour grading (tint, contrast, saturation, lift), so lighting moods
  interpolate across chapters.
- **PostFX** (one composer for the whole stage): Bloom (mipmap blur), film grain, vignette,
  ACES/AgX tone mapping. Each effect is gated by the quality tier.
- **Events.** The canvas sits behind the DOM; `eventSource=document.body` lets 3D objects receive
  hover/click while DOM text stays on top. Every 3D interaction has a DOM control equivalent.

### 3.3 Quality & adaptivity

`high` (DPR ≤ 2, MSAA 4, bloom, full particles, 2048 shadows) · `balanced` (DPR ≤ 1.5, MSAA 2,
lighter bloom, 60 % particles, 1024 shadows) · `performance` (DPR 1, no MSAA, no bloom,
30 % particles, no shadows). `auto` picks an initial tier from device heuristics (coarse pointer
+ small viewport → performance; low memory/cores → balanced) then drei's `PerformanceMonitor`
steps down on sustained low FPS. The visitor can override in Settings (persisted).

### 3.4 Characters — the "ink figure" system (`src/characters`)

Decision (SPEC §4.1 fallback, recorded as a deviation risk): **2.5D layered illustration**, not
rigged 3D, because no character artist, Blender or licensed models are available and a poor 3D
model would fail the quality bar. Each figure is authored as original layered vector art
(back hair / body / head / face / front hair / accessories), rasterised to textures at runtime
at a tier-dependent resolution, and rendered as depth-separated planes with a custom shader:

- silhouette-derived pseudo-normals → rim light / key light that respond to scene lights;
- idle motion: breathing (pivoted vertex scale), hair/cloth sway masks, blinks, micro head drift;
- gaze: pupils follow a target (pointer or scripted), clamped and eased;
- expressions: per-character state sets (e.g. Light: ordinary / calculating / Kira / collapse),
  cross-faded by narrative state;
- parallax: layer depth separation reacts to camera motion.

This is honest 2.5D. It must never be described as a rigged 3D model. Commissioned rigged GLB
characters remain a documented upgrade path (`src/characters` exposes a renderer-agnostic
`CharacterPresenter` interface so a GLB implementation can replace a figure per scene).

### 3.5 Procedural assets

Without Blender, props and environments are built in code: notebook (rounded cover, leather
normal detail, debossed gothic lettering on a canvas texture, page block, curl-deforming
pages), apple (lathe + clearcoat), pencil, desk, city (instanced buildings + emissive window
shader), Shinigami realm (displaced terrain, instanced bone spires, ash), clouds (layered fbm
planes), rain (instanced streaks), warehouse (modular shell + light shafts). Sound is generated
with WebAudio (no recorded assets). Everything is listed in the asset register.

### 3.6 Failure handling

- No WebGL2 / context creation failure / `?webgl=0` → `FallbackBackdrop` (designed CSS/SVG
  composition per chapter palette) — all text, navigation and encyclopedia features remain.
- Context lost → stage hidden, fallback shown, restore attempted.
- Scene chunk/asset failure → error boundary per scene → fallback art for that chapter only.
- Audio failure → sound toggle disabled with an explanation; nothing else changes.
- Route-level error boundary with a designed error page.

## 4. Testing architecture

- Vitest: pure logic (scroll maths, transition scheduling, quality heuristics, data integrity:
  unique ids, valid references, sources present, chapter numbering).
- Playwright (Chrome): routes, spoiler gate, chapter jump + active indicator, scroll both
  directions, reduced-motion emulation, sound default off, WebGL-disabled fallback, no console
  errors, axe accessibility scan, mobile viewport.
- `scripts/shoot.mjs`: deterministic screenshots at chosen scroll positions/viewports for
  visual review; `?debug` exposes `window.__DN__` (renderer info) for leak checks.
