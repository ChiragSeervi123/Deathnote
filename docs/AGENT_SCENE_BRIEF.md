# Scene builder brief (for parallel scene agents)

You are building one or more 3D chapter scenes for DEATH NOTE — THE JUDGMENT, an unofficial,
non-commercial fan tribute. Other agents are building other scenes **at the same time in the
same working tree**. Follow this brief exactly.

## 1. Read first
1. `CLAUDE.md` (working agreement) and `SPEC.md` §4 (characters), §5 (visual identity), §9 (3D & motion).
2. `docs/SCENE_SPECIFICATIONS.md` — the entries for your chapters.
3. `docs/content/story-reference.md` — the fact sheets for your chapters. Only depict what they support.
4. `src/chapters/chapterData.ts` — your chapters' **beats** (text windows `at: [in, out]` in chapter
   progress, and `anchor`). The DOM text appears at those anchors during those windows.
5. Reference implementations: `src/scenes/notebook/NotebookScene.tsx`, `src/scenes/prologue/*`
   (camera keyframes, `useSceneFrame`, reduced-motion `quantize`, quality tiers, disposal),
   `src/scenes/props/*` (reusable: `NotebookModel` + `notebookState`, `Apple`, `Pencil`, `Motes`,
   `RainWindow`), `src/characters/shared/{shapes.ts,InkFigure.tsx}`, `src/characters/ryuk/*`
   (`RyukSilhouette` is reusable as-is for silhouette shots).

## 2. Contract
- Your scene is the default export of `src/scenes/<folder>/<Name>Scene.tsx` (a stub exists and is
  already registered). It renders inside an R3F portal into its own render target:
  - include `<PerspectiveCamera makeDefault … />` (drei) — the scene's camera;
  - set your own `<color attach="background" />` and fog;
  - animate **only** inside `useSceneFrame((f, state) => …)` from `../shared/sceneFrame`:
    `f.progress` 0→1 through the chapter's pinned track, `f.enter`/`f.exit` (hand-off windows),
    `f.chapter` (which chapter drives you if your scene serves two), `f.reduced`, `f.pointer`
    (eased −1..1), `f.time`, `f.delta`. Everything must be a **pure function of progress** so
    scrolling up reverses it exactly (time may drive only ambient idle motion).
  - Quality: `const tier = useRuntime((s) => s.tier); const profile = QUALITY_PROFILES[tier];` —
    scale particle/instance counts by `profile.particles`, cast shadows only if `profile.shadows`,
    texture sizes from `profile.textureSize`.
  - Reduced motion: replace camera travel with held compositions (see `quantize` in the prologue);
    idle motion off.
  - Colour grade: edit `src/scenes/<folder>/grade.ts` (yours).
- Fonts for canvas textures: `await ensureCanvasFonts()` via React `use()` like `NotebookModel`.

## 3. File ownership (hard rule)
- You own only: `src/scenes/<your folders>/**` and new folders `src/characters/<your names>/**`.
- **Do not edit any other file** (registry, chapterData, shared, props, styles, routes, docs, tests,
  package.json). Do not install packages. If you need a shared change (e.g. a beat anchor), put it
  in your final report.
- Do not commit, push, run `vite build`, or run Playwright e2e (they share `dist/` and ports).

## 4. Art direction
- Dark psychological thriller; elegant, tense, cinematic. Palette tokens (SPEC §5.2): obsidian
  `#080808`, charcoal `#151515`, deep crimson `#4A0A10`, blood red `#9F171F`, paper `#E8E3D8`,
  ash `#858585`, cold blue `#526A91`. Colour carries meaning: red = Kira, blue = L/investigation.
- **Composition rule:** text beats sit on one side (left/right anchors take the outer ~32 % of a
  1920-wide frame; centre anchors the middle). Never put the subject or bright detail under the
  text. On portrait/mobile (aspect < 0.9) beats sit in the lower third — frame subjects higher.
- Restraint over clutter. One clear idea per shot. Slow, deliberate camera; no rolls > 6°; no
  flashing (no luminance strobing); avoid red-glow overuse.
- Lighting does the work: key + rim + negative space; fog for depth; bloom only on real light
  sources (emissive > 1 values).

## 5. Characters (InkFigure)
- Build **original** 2.5D figures with `InkFigure` (parts tree + ink silhouette + flat colour
  layers + rim light + emissive eyes). Anime-faithful silhouette, proportions, hair and costume;
  cel-flat colour; strong value contrast. Recognisable in pure black first.
- Faces: stylised and minimal — eye shapes, brow line, mouth line, a shadow plane. Use chiaroscuro
  (half the face in shadow, rim light on the edge) instead of detailed rendering. Avoid anything
  uncanny or broken. 3/4 or profile views with dramatic lighting read best.
- Idle life: breathing (scale.y ±1 %), slight head drift, blinks (scale an eye layer's y), gaze
  shifts. Expressions by swapping/morphing layers driven by progress.
- Never copy official artwork or trace screenshots. Never draw a logo or signature.

## 6. Assets & research
- Procedural only: geometry, shaders, canvas/data textures created in code. No downloaded models,
  textures, HDRIs, fonts or audio.
- You may use WebSearch/WebFetch for *reference descriptions* (what a location or costume looks
  like) to inform an original design.

## 7. Performance
- High tier: ≤ ~150 draw calls, 60+ FPS on an RTX 3050 at 1080p. Use `InstancedMesh` for repeats,
  merge static geometry, reuse materials, no per-frame allocations, no React state per frame.
- Dispose everything you create imperatively (`useEffect` cleanup), like the props do.

## 8. Verification (required — iterate until it is genuinely good)
1. Start your own dev server in the background: `npx vite --port <PORT> --strictPort`.
2. Screenshot: `MSYS_NO_PATHCONV=1 node scripts/shoot.mjs --base http://localhost:<PORT> --shots
   <chapterId>:0.02,<chapterId>:0.25,<chapterId>:0.5,<chapterId>:0.8 --prefix <yourprefix> --wait 2500`
   (`chapterId:progress`; add `--vw 390 --vh 844` for mobile). The script prints FPS/draw calls,
   camera debug and console problems. PNGs land in `.artifacts/`.
3. **Look at every screenshot with the Read tool**, critique composition, lighting, character
   quality, text overlap, and iterate. At least three review passes per scene.
4. `npx tsc -p tsconfig.app.json --noEmit` and `npx eslint src/scenes/<folder> src/characters/<name> --max-warnings=0` must pass.
5. Stop your dev server when finished.

## 9. Final report (≤ 300 words)
Per scene: what each beat window shows; characters built; measured FPS/draw calls; known
weaknesses; requested shared-file changes; paths of your 2–3 best screenshots.
