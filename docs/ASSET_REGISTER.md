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
| Notebook: leather normal/roughness, cover lettering, inside cover, ruled paper, ink atlas, page curl (`src/scenes/props/notebook`) | Procedural geometry + canvas/data textures | Original, this repo | Project-owned | final (v1) |
| Apple, pencil, desk wood, rain-window shader, dust motes (`src/scenes/props`, `notebook/`) | Procedural geometry/shaders | Original | Project-owned | final (v1) |
| Realm terrain, hole, bone spires, boulders, ash, sky dome, cloud decks (`src/scenes/prologue`) | Procedural geometry/shaders | Original | Project-owned | final (v1) |
| Night city: instanced towers, window shader, sodium streets, school, courtyard, rain | Procedural/instanced + shaders | Original | Project-owned | final (v1) |
| Ryuk silhouette (`src/characters/ryuk`) | Original vector silhouette (fan art of the character design) | Original, this repo | Fan work; character design © Tsugumi Ohba, Takeshi Obata / Shueisha — non-commercial, clearly unofficial tribute | final for the prologue silhouette shot |
| Ryuk full figure (`src/characters/ryuk-full`), Rem (`rem/`), Light bust with expression parts (`light/`), L crouched (`l/`), Misa (`misa/`), Near and Mello (`successors/`) | Original 2.5D vector illustration (InkFigure: ink silhouette, flat colour layers, rim, emissive eyes) | Original, this repo | Fan work of the character designs (as above) | final (v1) |
| Generic figures — task force, executives, crowds, witnesses, Mikami/Takada silhouettes (`src/characters/shared/people.ts`) | Parametric vector figures | Original | Project-owned | final (v1) |
| Eyes diagrams, closing notebook, tribute page/pencil (DOM/SVG/CSS) | Original SVG/CSS | Original | Project-owned | final (v1) |
| Story-scene sets (Ch 02–15): realm plateau and hole vision; Light's room; screen canyon and news/counter textures; L's monitor wall; evidence/ownership/strategy boards and cards; boardroom; rooftop; gothic stage, arches, tape screen, Eyes label atlas; split white/black set and jigsaw; candle plaza, KIRA screen, studio; corrugated warehouse, concrete, light shafts; dusk sky, skyline, iron stairway (`src/scenes/*`) | Procedural geometry, canvas textures, shaders | Original | Project-owned | final (v1) |
| Ambient backdrops Ch 16–19: records-room shelving, Eyes crowd, closing notebook with ash (`src/scenes/archive`, `eyes`, `legacy`) | Procedural | Original | Project-owned | final (v1) |
| Tribute drafting table, paper, pencil, light (`src/scenes/tribute`) | Procedural | Original | Project-owned | final (v1) |
| On-screen invented text (lifespan numerals, redacted name bars, "TAPE RECEIVED", "SPECIAL BROADCAST", "A MESSAGE IN KIRA'S NAME") | Canvas text | Original wording | Project-owned | final |
| Sound design (drone, wind, rain, room, hum, page/pencil/close cues) | WebAudio synthesis at runtime | Original | Project-owned | final (v1) |
| Favicon | SVG | Original | Project-owned | final |

Factual text comes from the sources listed in `docs/content/*`; all prose is original wording.

## Third-party code (runtime)

three (MIT), React (MIT), @react-three/* (MIT), postprocessing (Zlib), GSAP (GreenSock
standard "no charge" license, free for this use since 3.13), Lenis (MIT), react-router (MIT),
zustand (MIT).

## Placeholders currently in use

None yet. Any placeholder must be listed here with the scene it belongs to.
