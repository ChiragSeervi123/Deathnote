# DEATH NOTE — The Judgment

An unofficial, non-commercial, cinematic fan tribute to *Death Note*: a long scroll-driven
3D experience through the story, its rules and its people, and a separate page thanking its
creators, Tsugumi Ohba and Takeshi Obata.

> Made by fans. Not affiliated with, endorsed by, or connected to Tsugumi Ohba, Takeshi Obata,
> Shueisha, Madhouse, VAP, Viz Media or any rights holder. DEATH NOTE © Tsugumi Ohba,
> Takeshi Obata / SHUEISHA. All illustration, 3D scenes and sound in this project are original
> fan work; no anime footage, soundtrack, manga pages or official artwork are used.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # typecheck + lint + unit tests + production build
npx playwright test  # end-to-end (builds and previews on :4173; uses installed Chrome)
```

Useful URL switches: `?debug` (renderer stats), `?webgl=0` (2D version),
`?quality=high|balanced|performance`, `?motion=reduce`, `?gate=0` (skip the spoiler notice).

## Routes

- `/` — the main experience: 20 chapters (story 00–15, archive 16–19).
- `/tribute` — a standalone thank-you to the creators.

## Deploying

Static build (`npm run build` → `dist/`). Any static host works if unknown paths fall back to
`index.html`; `vercel.json` already does this for Vercel.

## Project documents

`SPEC.md` (master spec) · `CLAUDE.md` (working agreement) · `PROGRESS.md` (status) ·
`docs/` (architecture, plan & risks, design system, scenes, content reference, assets,
performance, tests). Content sources: `docs/content/`.
