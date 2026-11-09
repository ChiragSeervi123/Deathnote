# Scene specifications

Each scene has a single visual idea. Scroll progress `p` is the chapter's sticky progress
(0→1); `enter`/`exit` are the hand-off windows (see ARCHITECTURE §3.1). Camera numbers are
starting points for art direction, tuned by screenshot review.

Legend — **Status:** `spec` (designed) · `proto` (prototype, marked) · `built` (implemented,
not yet reviewed) · `done` (implemented + browser-tested + reviewed).

---

## 00 · Prologue — A World of Boredom  · scene `prologue` · Status: built (browser-reviewed, first quality pass)

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

## 01 · The Death Note · scene `notebook` · Status: built (browser-reviewed; explore mode built)

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

## 02 · The Shinigami Realm · scene `realm` · Status: built
Wide desolate plain; Shinigami silhouettes gambling with bones around a fire-less pit; Ryuk full
reveal (scale against camera, wings, grin, eyes) and Rem's pale stillness; lifespan numerals
floating above distant human silhouettes seen through the hole (Eyes concept, explained in Ch 17).
Transition in: smoke.
As built: Ryuk full figure on the plateau (wings, grin, glowing eyes, apple), Rem with her pale halo, the hole with an Eyes vision texture (bars for names, invented numerals, one blank).

## 03 · Light Yagami · scene `light` · Status: built
Light's room by day (paper-white, warm) → night (red). Ink-figure Light with 4 expression
states: ordinary student → calculating → public mask vs private Kira → (collapse reserved for
Ch 15). Turning point: the first name written; the room's light turns from white to crimson.
Transition in: page turn.
As built: Light bust with expression parts (eyes open/narrow, brows calm/sharp, mouth neutral/smirk, irises brown/red); room white → crimson; TV only lit in its beat.

## 04 · Birth of Kira · scene `kira` · Status: built
Night city canyon of screens: news tickers, death counter, split public opinion. Event timeline
rail (DOM) synced to the camera dolly. Red ink spreads across screens. Transition in: ink.
As built: Street canyon of screens with news/counter textures, red ink spread, the final screen revealing the letter L.

## 05 · L · scene `l-room` · Status: built
Dark investigation room, wall of monitors (cold blue), sugar cubes stacked, negative space.
Ink-figure L crouched on a chair, thumb to lip; stillness, gaze that tracks the visitor.
Transition in: red→blue.
As built: Crouched L before a monitor wall; gaze follows the visitor.

## 06 · First Battle · scene `investigation` · Status: built
Evidence board assembles itself: Lind L. Tailor broadcast, Kanto map narrowing, FBI agent
files, surveillance camera grid, To-Oh University. Light and L as opposing chess-like columns.
Transition in: evidence-board assembly.
As built: Evidence board (shared board kit: cards, pins, red strings, travelling spotlight).

## 07 · Misa Amane · scene `misa` · Status: built
Gothic monochrome stage; Misa figure (gothic lolita silhouette, cross motifs), Rem looming pale
behind; Eyes deal visualised as names/numerals appearing over crowd silhouettes.
Transition in: silhouette reveal.
As built: Gothic stage with arches and a spotlight cone; original Misa figure (pigtails sway, red Eyes part); TV with the second Kira's tape; Rem lit in her beat; Misa's-eye view of a labelled crowd where one lifespan is blank; final three-figure tableau.

## 08 · Confinement & Memory · scene `confinement` · Status: built
Three monitored cells; ownership chain diagram (notebook → Light → Misa → buried → Higuchi);
memories dissolving as ink washes off pages. Transition in: smoke.
As built: Ownership board on the shared board rig.

## 09 · Yotsuba · scene `yotsuba` · Status: built
Glass boardroom high above the city; eight chairs, one weekly "Kira meeting"; Higuchi's chair
lit red. Light and L handcuffed (silhouette of the chain). Transition in: camera through glass.
As built: Glass boardroom, eight seated executives (yaw-billboarded), Higuchi's red rim and Eyes, the chained pair, the seized notebook.

## 10 · The End of L · scene `rain` · Status: built
Restraint: rain on a rooftop, church bells implied by rhythm (no audio clip), L barefoot in the
rain, Rem's dust. Minimal motion; long holds; muted palette. Transition in: slow fade.
As built: Grey rooftop in rain, the lone figure at the railing, pale dust, then absence.

## 11 · Successors · scene `wammy` · Status: built
Split composition: Near (white, puzzle pieces, controlled) vs Mello (black, chocolate foil,
high contrast). Wammy's House window light. Transition in: split wipe.
As built: White set on the right, black set on the left (DOM text always lands on dark). Near sits with a blank jigsaw that assembles with scroll; Mello snaps a square of chocolate, then walks out of the light; the white side dims during Mello's beat.

## 12 · The New Kira Era · scene `new-kira` · Status: built
Kira's Kingdom broadcast studio, crowds, Mikami's pen strokes ("delete"), Takada's broadcasts.
Transition in: ink.
As built: Candle plaza (instanced crowd + candle points) under a KIRA screen; cut to Mikami writing at his desk; cut to Takada's studio.

## 13 · Final Strategy · scene `strategy` · Status: built
Two notebooks (real/fake) under scanning light; relationship graph of plans; Mello's move with
Takada. Transition in: evidence.
As built: Strategy board with the forged notebook.

## 14 · Final Confrontation · scene `warehouse` · Status: built
Yellow Box warehouse (original design): corrugated walls, high windows, dust in light shafts,
a door ajar. Light, Near and the task force; the notebook reveal. Transition in: camera through door.
As built: Corrugated warehouse, high windows with light shafts and dust, Near seated, both teams, Light apart (red rim in the proof beat), the door ajar with Mikami's silhouette in the gap, the forged notebook on the floor.

## 15 · The Fall of Kira · scene `fall` · Status: built
Dusk stairs; Ryuk writing; time dilates; the world after Kira. Closing composition.
Transition in: smoke → close.
As built: A dark room (Light bust: defiant → a single soft flash → shaken, looking up at Ryuk; Ryuk writes in his notebook) and an iron stairway at dusk (Light collapsed on the steps, a pale figure on the landing in the anime beat; city windows light up at the end). No blood is shown.

## 16–19 · Encyclopedia · scenes `archive`, `eyes`, `legacy` · Status: built
Calm ambient backdrops behind DOM-first interfaces (text never over busy scenes). 19 ends with
the notebook closing (signature transition) and the tribute invitation.
As built: Archive: records-room aisle, one beam, dust. Eyes: the labelled crowd under a red glow, drifting slowly. Legacy: the notebook closes as the page is read; ash; one loose page keeps its light.

## Tribute · scene `tribute` (separate route) · Status: built
Blank manga page on a drafting table, pencil, morning-paper light, slow dust. Sections:
blank page → story (words branching like plot lines) → art (ink strokes becoming forms, no
copied panels) → collaboration (word + line converge) → thank-you (notebook closes, quiet).
As built: DOM sections plus a 3D drafting-table layer.

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
