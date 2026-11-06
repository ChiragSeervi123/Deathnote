# Scene specifications

Each scene has a single visual idea. Scroll progress `p` is the chapter's sticky progress
(0→1); `enter`/`exit` are the hand-off windows (see ARCHITECTURE §3.1). Camera numbers are
starting points for art direction, tuned by screenshot review.

Legend — **Status:** `spec` (designed) · `proto` (prototype, marked) · `built` (implemented,
not yet reviewed) · `done` (implemented + browser-tested + reviewed).

---

## 00 · Prologue — A World of Boredom  · scene `prologue` · Status: spec

**Idea:** one unbroken vertical shot. The camera begins in the realm of the gods of death,
watches a bored Ryuk let a notebook fall through a hole in the ground, and follows it down
through cloud into the night of the human world.

World layout (y up, metres): realm floor at y = 400, clouds 260–330, city at y = 0.

| p | Shot | Beat (DOM) |
| --- | --- | --- |
| 0.00–0.08 | Black. Ash motes drift in a single cold shaft of light. Title fades up in Cormorant: DEATH NOTE / THE JUDGMENT. | Title + "Scroll to begin" + Skip intro |
| 0.08–0.30 | Slow crane down into the realm: grey dunes, crooked bone spires, a dead dim sun behind haze. Ryuk revealed as a backlit silhouette on a rock beside a hole in the ground; only his eyes catch the light. | "In the realm of the gods of death, nothing ever changes." / "Ryuk is bored." |
| 0.30–0.42 | Close on Ryuk's silhouette; the notebook slips from his hand into the hole. | "So he lets a notebook fall." |
| 0.42–0.70 | Camera dives through the hole (signature *camera passes through environment*), tumbling notebook leads the frame, cloud layers rush past, lightning-free (no flashing), the city lights resolve below. | "It falls toward a world full of rot." |
| 0.70–0.92 | Night Tokyo from above: instanced towers with warm windows, cold street-light grid, light rain. The notebook drops toward a school courtyard. | "Into an ordinary afternoon." (anime: daytime classroom — we stay in dusk for continuity; recorded as artistic choice) |
| 0.92–1.00 | Notebook lands in wet grass; camera settles low; hand-off to Chapter 01 via ink transition. | — |

Materials/lighting: realm — desaturated cool grey, fog exp2, rim light from the dead sun;
city — sodium/amber windows vs cold blue sky. Particles: ash (realm), cloud planes, rain
(city). Audio: low drone (realm) → wind (fall) → rain/room tone (city).
Reduced motion: camera path replaced by 4 held compositions cross-faded by beat.
Mobile: same path, performance tier, fewer instances, no rain on `performance`.

## 01 · The Death Note · scene `notebook` · Status: spec

**Idea:** the notebook as an artefact under a desk lamp — the most detailed object on the site.
Environment: dark bedroom desk, warm lamp pool, rain-streaked window with city bokeh, an apple,
a pencil. Notebook: black cover with leather grain and worn edges, gothic cover lettering
(original typeset, not the series logo), page block, cover hinge, curling pages.

| p | Shot | Beat |
| --- | --- | --- |
| 0.00–0.20 | Top-down macro over the closed cover; lamp light rakes across the grain. | "A black notebook. Its owner can kill anyone whose name and face they know." |
| 0.20–0.40 | Cover opens on its hinge (scroll-scrubbed), revealing "How to use it" on the inside cover. | Rule I · 1 |
| 0.40–0.85 | Pages turn one by one; each rule writes itself in ink (ink-reveal shader); DOM rule cards mirror them for screen readers. | Rules: 40 seconds, heart attack default, 6 min 40 s, ownership, Shinigami visibility |
| 0.85–1.00 | Camera pulls back; the notebook becomes the navigation motif ("Explore the notebook" → inspect mode). | — |

Inspect mode: drag/arrow keys/buttons turn pages; focusable DOM controls; Esc exits.

## 02 · The Shinigami Realm · scene `realm` · Status: spec
Wide desolate plain; Shinigami silhouettes gambling with bones around a fire-less pit; Ryuk full
reveal (scale against camera, wings, grin, eyes) and Rem's pale stillness; lifespan numerals
floating above distant human silhouettes seen through the hole (Eyes concept, explained in Ch 17).
Transition in: smoke.

## 03 · Light Yagami · scene `light` · Status: spec
Light's room by day (paper-white, warm) → night (red). Ink-figure Light with 4 expression
states: ordinary student → calculating → public mask vs private Kira → (collapse reserved for
Ch 15). Turning point: the first name written; the room's light turns from white to crimson.
Transition in: page turn.

## 04 · Birth of Kira · scene `kira` · Status: spec
Night city canyon of screens: news tickers, death counter, split public opinion. Event timeline
rail (DOM) synced to the camera dolly. Red ink spreads across screens. Transition in: ink.

## 05 · L · scene `l-room` · Status: spec
Dark investigation room, wall of monitors (cold blue), sugar cubes stacked, negative space.
Ink-figure L crouched on a chair, thumb to lip; stillness, gaze that tracks the visitor.
Transition in: red→blue.

## 06 · First Battle · scene `investigation` · Status: spec
Evidence board assembles itself: Lind L. Tailor broadcast, Kanto map narrowing, FBI agent
files, surveillance camera grid, To-Oh University. Light and L as opposing chess-like columns.
Transition in: evidence-board assembly.

## 07 · Misa Amane · scene `misa` · Status: spec
Gothic monochrome stage; Misa figure (gothic lolita silhouette, cross motifs), Rem looming pale
behind; Eyes deal visualised as names/numerals appearing over crowd silhouettes.
Transition in: silhouette reveal.

## 08 · Confinement & Memory · scene `confinement` · Status: spec
Three monitored cells; ownership chain diagram (notebook → Light → Misa → buried → Higuchi);
memories dissolving as ink washes off pages. Transition in: smoke.

## 09 · Yotsuba · scene `yotsuba` · Status: spec
Glass boardroom high above the city; eight chairs, one weekly "Kira meeting"; Higuchi's chair
lit red. Light and L handcuffed (silhouette of the chain). Transition in: camera through glass.

## 10 · The End of L · scene `rain` · Status: spec
Restraint: rain on a rooftop, church bells implied by rhythm (no audio clip), L barefoot in the
rain, Rem's dust. Minimal motion; long holds; muted palette. Transition in: slow fade.

## 11 · Successors · scene `wammy` · Status: spec
Split composition: Near (white, puzzle pieces, controlled) vs Mello (black, chocolate foil,
high contrast). Wammy's House window light. Transition in: split wipe.

## 12 · The New Kira Era · scene `new-kira` · Status: spec
Kira's Kingdom broadcast studio, crowds, Mikami's pen strokes ("delete"), Takada's broadcasts.
Transition in: ink.

## 13 · Final Strategy · scene `strategy` · Status: spec
Two notebooks (real/fake) under scanning light; relationship graph of plans; Mello's move with
Takada. Transition in: evidence.

## 14 · Final Confrontation · scene `warehouse` · Status: spec
Yellow Box warehouse (original design): corrugated walls, high windows, dust in light shafts,
a door ajar. Light, Near and the task force; the notebook reveal. Transition in: camera through door.

## 15 · The Fall of Kira · scene `fall` · Status: spec
Dusk stairs; Ryuk writing; time dilates; the world after Kira. Closing composition.
Transition in: smoke → close.

## 16–19 · Encyclopedia · scenes `archive`, `eyes`, `legacy` · Status: spec
Calm ambient backdrops behind DOM-first interfaces (text never over busy scenes). 19 ends with
the notebook closing (signature transition) and the tribute invitation.

## Tribute · scene `tribute` (separate route) · Status: spec
Blank manga page on a drafting table, pencil, morning-paper light, slow dust. Sections:
blank page → story (words branching like plot lines) → art (ink strokes becoming forms, no
copied panels) → collaboration (word + line converge) → thank-you (notebook closes, quiet).

---

## Characters — quality checklist (M5 gate)

For each Tier 1/2 figure:
1. Silhouette recognisable at thumbnail size (black fill test).
2. Proportions consistent with the anime design language; no broken anatomy.
3. Hair, eyes, clothing and accessory details present at hero framing.
4. Lighting reacts to the scene key/rim lights; no flat "sticker" look.
5. Idle motion subtle (breath ≤ 1.2 % scale, sway ≤ 2°), no visible loop seams.
6. Gaze clamps naturally; blinks irregular (3–7 s); no uncanny eye movement.
7. Expressions read clearly and match the narrative stage.
8. Parallax layering never reveals gaps between layers.
9. Holds up at 1440p; texture resolution follows the quality tier.
10. Reduced motion: idle motion off, expressions still change.
