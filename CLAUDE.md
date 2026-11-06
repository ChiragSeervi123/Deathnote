# CLAUDE.md — working agreement for this repository

**Project:** DEATH NOTE — THE JUDGMENT. An unofficial, cinematic, scroll-driven 3D fan
tribute (main experience at `/`) plus a separate creator tribute (`/tribute`).
**Master spec:** [`SPEC.md`](SPEC.md) — read it before any significant change. It wins over
everything else in this repo.
**Status & handoff:** [`PROGRESS.md`](PROGRESS.md) — read first, update last, every session.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `npm run dev` (http://localhost:5173) |
| Type-check | `npm run typecheck` |
| Lint | `npm run lint` (zero warnings allowed) |
| Unit tests | `npm test` (Vitest, jsdom) |
| E2E tests | `npm run test:e2e` (Playwright, uses installed Chrome; builds + previews on :4173) |
| Production build | `npm run build` |
| Everything | `npm run check` |
| Visual review | `node scripts/shoot.mjs <url-path> [options]` — screenshots into `.artifacts/` (see script header) |

Debug overlay: append `?debug` to any URL (FPS, draw calls, geometries/textures, quality tier;
the prologue also publishes `window.__DN_CAM__`). Force a fallback: `?webgl=0`. Force a quality
tier: `?quality=high|balanced|performance`. Disable film grain: `?grain=0`.

Screenshots: build, run `npx vite preview --port 4173`, then e.g.
`MSYS_NO_PATHCONV=1 node scripts/shoot.mjs --path /tribute --query gate=0 --shots top,y:1200`.
In Git Bash, `MSYS_NO_PATHCONV=1` is required or `/paths` are rewritten to Windows paths.

Gotchas learned the hard way:
- The post-processing composer turns `renderer.autoClear` off; `SceneLayer` clears its target
  explicitly. Don't remove that clear.
- Never hash an interpolated varying (e.g. an instance id) without `floor(x + 0.5)` first —
  interpolation error becomes per-pixel static.
- Files differing only in case collide on Windows (`ryukShapes.ts` vs `RyukSilhouette.tsx`).

## Stack (verified 2026-11-06)

React 19.3 · Vite 8 (Rolldown) · TypeScript **6.0** (not 7 — typescript-eslint supports `<6.1`) ·
three 0.187 · @react-three/fiber 9.8 · drei 10.7 · @react-three/postprocessing 3.2 · GSAP 3.15
(+ScrollTrigger) · Lenis 1.3 · React Router 8 · Zustand 5 · Vitest 5 · Playwright 1.65 ·
ESLint **9** (jsx-a11y does not support 10) · Prettier 3. Fonts are self-hosted via Fontsource (OFL).

## Architecture in one paragraph

One fixed, shared WebGL canvas (`src/scenes/shared/Stage.tsx`) sits behind the DOM. Each
chapter maps to a **scene key**; the `SceneDirector` mounts at most the active scene and its
neighbours, each rendered off-screen into its own render target through a React Three Fiber
portal (`SceneLayer`). A `Compositor` blends the outgoing and incoming targets with a
narrative transition shader (ink, smoke, page turn, red→blue, silhouette, close), then
post-processing (bloom, grain, vignette, tone mapping) runs once. Scroll is native (Lenis
smooths it unless reduced motion is on); `src/animation/scroll` writes per-frame values into a
**mutable** `scrollState` that scenes read inside `useFrame` — never React state per frame.
DOM text beats are choreographed by the same per-frame loop. All story text lives in the DOM, so
the site reads fine without WebGL. Details: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Where things live

```
src/app/           App shell, router, providers, error boundaries
src/routes/        Route components: MainExperience, Tribute, NotFound
src/chapters/      chapterData.ts (scene keys, lengths, beats, transitions) + section layouts
src/data/          Pure content: types.ts, rules, timeline, episodes, characters, creators
src/scenes/shared/ Stage, SceneDirector, SceneLayer, Compositor, PostFX, quality, materials
src/scenes/<key>/  One folder per scene (prologue, notebook, realm, …, tribute)
src/scenes/props/  Reusable 3D props (NotebookModel, Apple, Pencil, …)
src/characters/    2.5D "ink figure" character system + per-character layer art
src/animation/     scroll/ (Lenis, scrollState, chapter tracker), camera/, transitions/
src/components/    navigation/, typography/, loading/, interactive/, accessibility/
src/encyclopedia/  Rulebook, timeline, character archive, relationship UI
src/audio/         Procedural WebAudio sound design (off by default)
src/shaders/       Shared GLSL chunks (noise, paper, ink, grading)
src/styles/        tokens.css, global.css
docs/              Design system, scene specs, content reference, assets, perf, tests
e2e/               Playwright specs        scripts/   tooling (screenshots, perf probes)
```

## Rules of engagement (from SPEC §16 — non-negotiable)

1. **Never fake completion.** A feature is done only when it has real content, its visual
   treatment, working interactions, responsive behaviour, browser testing, and updated docs
   (SPEC §20). A static image with a camera zoom is not an animated character.
2. **Test in a real browser** after meaningful changes (`scripts/shoot.mjs`, Playwright).
   Look at the screenshots. Check the console. Scroll both directions.
3. **Content accuracy:** anime canon first; label manga-only material; never invent rules,
   quotes, or creator details. Sources go in `docs/content/*` and `src/data/*`.
4. **Rights:** only original or properly licensed assets. Every asset (including procedural
   ones and fonts) is recorded in [`docs/ASSET_REGISTER.md`](docs/ASSET_REGISTER.md).
   No anime footage, soundtrack, manga panels, official art, logos, or signatures.
5. **Accessibility:** sound off by default; respect `prefers-reduced-motion`; keyboard
   reachable; visible focus; no flashing; every 3D interaction has a DOM equivalent.
6. **Performance:** no React state updates per frame; dispose GPU resources; instancing
   for repeats; every effect must respect the active quality tier.
7. Placeholders only during explicitly marked prototyping, recorded in PROGRESS.md and the
   asset register, never in a scene described as finished.

## Coding conventions

- TypeScript strict + `noUncheckedIndexedAccess`. Type-only imports (`import type`).
- Path alias `@/` → `src/`.
- Content is data (`src/data`, `src/chapters/chapterData.ts`); components never hard-code
  story text that belongs in data.
- Frame-loop code: mutate refs/objects inside `useFrame`; read scroll via `scrollState`.
- GPU resources created imperatively must be disposed in an effect cleanup (`useDisposable`).
- Shaders: GLSL in `src/shaders/*.glsl` imported with `?raw`, or co-located `*.glsl.ts`.
- CSS: plain CSS with design tokens from `src/styles/tokens.css`; component styles as
  `*.css` next to the component. No CSS frameworks.
- Keep files focused (< ~400 lines); extract helpers rather than growing god-components.

## Known environment facts

- Windows 11, Node 24, npm 11, Git Bash + PowerShell. No Blender installed — 3D assets are
  procedural (code-built geometry, shader materials). See risk register.
- GPU: RTX 3050 Laptop (6 GB) + Intel UHD; 1920×1080 display. Headless Chrome screenshots
  run through ANGLE; see `docs/PERFORMANCE.md` for how perf is measured.
- `.gitignore` currently contains only `node_modules` (changed outside this agent); build
  output (`dist/`, `test-results/`, `.artifacts/`) must not be committed.
