# Design system

Source of truth for values: [`src/styles/tokens.css`](../src/styles/tokens.css). This document
explains intent. Colour supports narrative meaning (SPEC §5.2), never decoration.

## Colour

| Token | Value | Meaning / use |
| --- | --- | --- |
| `--c-obsidian` | `#080808` | Default background; the dark between scenes |
| `--c-charcoal` | `#151515` | Raised surfaces (dialogs, archive plates) |
| `--c-graphite` | `#232323` | Hairlines on dark, inactive ticks |
| `--c-crimson` | `#4a0a10` | Kira atmosphere, deep shadows of judgment |
| `--c-blood` | `#9f171f` | Accent: active state, the written name, emphasis (sparingly) |
| `--c-blood-bright` | `#e2525a` | Accent text (AA: 4.9:1 on charcoal, 5.3:1 on obsidian — raised from #c92a32 after an axe audit) |
| `--c-paper` | `#e8e3d8` | Primary text on dark; notebook pages |
| `--c-paper-dim` | `#b9b3a7` | Secondary text on dark (AA on obsidian) |
| `--c-ash` | `#858585` | Tertiary labels, metadata (AA 5.4:1 on obsidian) |
| `--c-cold` | `#526a91` | L / investigation; informational accents |
| `--c-cold-bright` | `#8ea6cf` | Cold accent text on dark |
| `--c-ink` | `#0d0c0b` | Text on paper surfaces |

Rules: never use red glow as wallpaper; red marks consequence. Blue marks observation. Paper
white marks the notebook and the tribute. No purple/blue gradients, no glassmorphism.

## Typography

| Role | Family | Use |
| --- | --- | --- |
| Display | Cormorant Garamond (variable) | Chapter titles, hero lines, numerals |
| Body | Inter (variable) | Reading text, UI |
| Mono | IBM Plex Mono | Case IDs, dates, rule refs, evidence labels, episode numbers |
| Hand | Nothing You Could Do / Caveat | Notebook writing, rare annotations only |
| Gothic | UnifrakturMaguntia | The notebook prop's cover lettering only |
| Japanese | Noto Serif JP (subset on demand) | Creators' and characters' Japanese names |

Fluid scale (`--step--2` … `--step-8`), 1.25 ratio at 360 px growing to 1.333 at 1440 px.
Display sizes use tight leading (0.9–1.0) and slight negative tracking; mono labels use
+0.12em tracking, uppercase, `--step--2`. Body measure 60–72ch, line-height 1.6.

## Space & layout

8-point base with fluid steps `--space-3xs` … `--space-4xl`. Cinematic stages use a 12-column
safe-area grid with generous negative space; text beats sit in one of five anchor zones
(`left`, `right`, `center`, `lower-left`, `lower-right`) chosen per shot so text never sits on
the busiest part of a frame. Long-form chapters (16–19) use a reading column on a solid surface.

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Camera-linked UI |
| `--dur-fast` / `--dur-med` / `--dur-slow` | 160 / 420 / 900 ms | UI / beats / titles |

Beats fade and rise ≤ 24 px; under reduced motion they only fade. Nothing flashes (no luminance
change > 3 per second). Camera never rolls more than 6°; no constant motion behind text.

## Components

- **TopBar** — mark (home), current chapter label (mono), sound toggle, index button.
- **ChapterRail** — right-edge progress line with 20 ticks (buttons with labels).
- **NotebookIndex** — `<dialog>` styled as a notebook page: ruled lines, chapter numbers in
  mono, titles in display serif, the current chapter marked in blood red with a text label
  (never colour alone). Contains settings (sound, quality, motion) and the tribute link.
- **Beat** — a short line of cinematic text; kinds: `title`, `line`, `rule`, `caption`, `aside`.
- **SpoilerGate** — first-visit notice; two clear choices.
- **Plate** — archive/rulebook surface: charcoal, hairline border, square corners (no rounded
  cards).

## Focus & interaction

Focus ring: 2 px `--c-paper` outline + 2 px offset, on every interactive element. Interactive
3D objects show a cursor change, a subtle highlight and a DOM label/button equivalent.
