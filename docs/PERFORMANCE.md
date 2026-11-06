# Performance

Targets (SPEC §11.1, goals to measure): ~60 FPS on capable desktop; never sustained < 30 FPS
on supported desktop; small initial download; scenes and heavy assets loaded on demand; no
memory growth over long sessions; useful content before 3D is ready.

## Reference hardware

NVIDIA RTX 3050 Laptop 6 GB (+ Intel UHD iGPU), i5-13450HX, 16 GB, 1920×1080 @ DPR 1,
Chrome 156, Windows 11.

## How we measure

- `?debug` overlay: FPS (1 s window), frame-time p95, draw calls, triangles, geometries,
  textures, programs, active quality tier, mounted scenes.
- `scripts/perf.mjs`: launches headed Chrome on the real GPU, auto-scrolls the main route at a
  fixed speed, samples `requestAnimationFrame` deltas per chapter, and prints avg FPS / p95
  frame time per chapter. Results are logged below with date and commit.
- Headless screenshots use ANGLE; their frame rates are **not** representative and are never
  reported as performance numbers.

## Budgets

| Item | Budget |
| --- | --- |
| Initial JS (gzip) before first scene | ≤ 250 kB app shell; three/R3F chunk loaded after first paint |
| Per-scene chunk | ≤ 120 kB gzip (procedural assets keep this small) |
| Draw calls per scene | ≤ 150 (high), ≤ 80 (performance) |
| Render targets | 2 scene layers + composer buffers |
| Texture memory per scene | ≤ 64 MB (high) |

## Measurements log

_No measurements yet._
