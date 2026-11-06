# Test plan

## Automated (run before every handoff: `npm run check` then `npm run test:e2e`)

| Layer | Tool | Coverage |
| --- | --- | --- |
| Types | `tsc -b` | whole project, strict + noUncheckedIndexedAccess |
| Lint | ESLint 9 + typescript-eslint + react-hooks + jsx-a11y | 0 warnings |
| Unit | Vitest (jsdom) | scroll maths (`progress/enter/exit`), scene scheduling (visible set, mix, mount window), quality heuristics, settings persistence, data integrity (unique ids, valid cross-refs, sources, canon labels, chapter numbering 00–19, every CHARACTER_ID profiled) |
| E2E | Playwright (Chrome channel) | see below |
| A11y | @axe-core/playwright | `/` (gate + first chapters), `/tribute`, 404 — no serious/critical violations |

### E2E scenarios (`e2e/`)

1. `/` loads; spoiler gate shown on first visit; "Enter" dismisses and is remembered.
2. `/tribute` loads directly (fresh context, no prior state) and shows the dedication.
3. Unknown route renders the designed 404 with links home and to the tribute.
4. Chapter index: open via keyboard, choose a chapter → page scrolls there, heading focused,
   active chapter label updates; Escape closes the dialog and focus returns.
5. Scroll down through several chapters then back up: active chapter updates both ways.
6. Sound toggle: default `aria-pressed="false"`; toggling works; no audio errors.
7. Reduced motion (`reducedMotion: 'reduce'`): Lenis disabled (`html` lacks `lenis` class),
   beats don't translate.
8. WebGL unavailable (`?webgl=0` and a stubbed `getContext`): fallback backdrop present, no
   canvas, all chapters readable.
9. No console errors or failed requests on load and after a full scroll.
10. Mobile viewport (Pixel 7): navigation usable, no horizontal scroll.
11. Leak check (`?debug`): jump 00→15→00; geometries/textures return to baseline ±2.

## Manual browser review (after each major phase — SPEC §18)

Checklist per review, recorded in PROGRESS.md › Browser testing:
desktop 1920×1080, 1440×900, 1366×768, ultrawide 2560×1080, small laptop 1280×720, high-DPI
(DPR 2), tablet 820×1180, mobile 390×844 · slow and fast scroll · up and down · chapter jumps ·
keyboard only · sound off/on · reduced motion · loading & error states · clipping, layout
shift, unreadable text, broken animation · console & network · long-session memory.

## Visual quality review

Character fidelity & expression · lighting & materials · composition · animation timing ·
typography · negative space · transition continuity · pacing · consistency. Screenshots via
`scripts/shoot.mjs` are saved under `.artifacts/` (not committed).
