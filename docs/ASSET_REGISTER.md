# Asset register

Every asset shipped (or temporarily used) by the site. SPEC §14: if rights are unclear, the
asset is not used in the published version. **No anime footage, soundtrack, manga scans,
official artwork, logos or signatures are used anywhere.**

Status: `final` · `proto` (temporary, must be replaced before calling the scene done) · `removed`.

## Fonts

| Asset | Source | License | Attribution | Use | Status |
| --- | --- | --- | --- | --- | --- |
| Cormorant Garamond (variable) | Fontsource `@fontsource-variable/cormorant-garamond` (Christian Thalmann) | SIL OFL 1.1 | Not required on site; noted here | Display | final |
| Inter (variable) | Fontsource `@fontsource-variable/inter` (Rasmus Andersson) | SIL OFL 1.1 | — | Body/UI | final |
| IBM Plex Mono | Fontsource `@fontsource/ibm-plex-mono` (IBM) | SIL OFL 1.1 | — | Labels | final |
| Nothing You Could Do | Fontsource `@fontsource/nothing-you-could-do` (Kimberly Geswein) | SIL OFL 1.1 | — | Notebook handwriting | final |
| Caveat (variable) | Fontsource `@fontsource-variable/caveat` (Impallari Type) | SIL OFL 1.1 | — | Annotations | final |
| UnifrakturMaguntia | Fontsource `@fontsource/unifrakturmaguntia` (J. 'mach' wust) | SIL OFL 1.1 | — | Notebook cover lettering prop | final |
| Noto Serif JP (variable) | Fontsource `@fontsource-variable/noto-serif-jp` (Google) | SIL OFL 1.1 | — | Japanese names | final |

## 3D, textures, illustration, audio

All created for this project in code (procedural) unless listed otherwise.

| Asset | Type | Origin | Rights | Status |
| --- | --- | --- | --- | --- |
| Notebook (cover, pages, lettering) | Procedural geometry + canvas textures | Original, this repo | Project-owned | in development |
| Apple, pencil, desk, lamp | Procedural geometry | Original | Project-owned | in development |
| Shinigami realm terrain, bone spires, ash | Procedural geometry/shaders | Original | Project-owned | in development |
| City (towers, windows, rain), clouds | Procedural/instanced + shaders | Original | Project-owned | in development |
| Character figures (Light, L, Ryuk, …) | Original 2.5D vector illustration (fan art of the characters) | Original, this repo | Fan work; character designs © Tsugumi Ohba, Takeshi Obata / Shueisha — used non-commercially in a clearly unofficial tribute | in development |
| Sound design (drone, wind, rain, paper, pencil, close) | WebAudio synthesis at runtime | Original | Project-owned | in development |
| Favicon | SVG | Original | Project-owned | final |

## Third-party code (runtime)

three (MIT), React (MIT), @react-three/* (MIT), postprocessing (Zlib), GSAP (GreenSock
standard "no charge" license, free for this use since 3.13), Lenis (MIT), react-router (MIT),
zustand (MIT).

## Placeholders currently in use

None yet. Any placeholder must be listed here with the scene it belongs to.
