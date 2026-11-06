# DEATH NOTE --- THE JUDGMENT

## Master Product, Creative & Engineering Specification

**Document:** `SPEC.md`\
**Project type:** Cinematic, long-form, interactive 3D fan tribute
experience\
**Primary target:** Desktop browsers\
**Secondary target:** Mobile and tablet, with a deliberately simplified
experience\
**Audience:** Death Note fans and, ideally, the original manga creators\
**Creative ambition:** A premium, art-directed digital experience
comparable in finish and polish to a high-budget commissioned
interactive website\
**Status:** Master specification --- implementation should proceed in
phases, with quality gates

------------------------------------------------------------------------

# 1. Mission

Create an extraordinary, immersive website celebrating the world and
story of *Death Note*. It must feel like an interactive cinematic
exhibition, not a conventional fan wiki, blog, portfolio, game, or SaaS
dashboard.

The main experience should take visitors through the anime's story,
characters, themes, supernatural rules, and most memorable moments using
carefully art-directed storytelling, sophisticated motion, atmospheric
environments, and interactive character presentations.

A **separate tribute page** must be dedicated exclusively to the two
original manga creators:

-   **Tsugumi Ohba** --- original story and writing.
-   **Takeshi Obata** --- original manga art and character illustration.

The tribute page is not another chapter in the encyclopedia. It is a
distinct, emotionally sincere expression of appreciation for the two
creators and the work they made together.

The project is being built for passion and creative ambition. It is not
primarily a commercial product, job application, or internship project.
Its success is measured by the quality of the experience, visual
execution, emotional impact, technical craftsmanship, and respect for
the source material.

## Core creative principle

**Make the visitor feel as if they have entered the world of Death Note.
Make the tribute feel like a thank-you letter expressed through an
interactive digital exhibition.**

Do not settle for a template website with anime images, gradients,
cards, and scroll animations. Every major section must have a clear
visual idea and a reason to exist.

------------------------------------------------------------------------

# 2. Product Definition

## 2.1 Main website

A very long, scroll-driven cinematic experience covering the Death Note
anime story and world, including the ending and full spoilers.

It combines:

1.  Cinematic storytelling.
2.  Interactive character experiences.
3.  Detailed lore and encyclopedia content.
4.  A visual timeline of major events.
5.  An interactive Death Note rulebook.
6.  Psychological and thematic interpretation.
7.  A polished ending that leads naturally to the separate creator
    tribute.

## 2.2 Separate creator tribute page

A standalone route/page with its own art direction and emotional arc,
dedicated only to Tsugumi Ohba and Takeshi Obata.

It should communicate appreciation for: - The premise and central
concept. - The psychological storytelling and moral conflict. - The
memorable characters and relationships. - The manga's visual identity
and artwork. - The lasting emotional and cultural impression of the
work.

Do not turn this page into a general credits page. Do not make
unsupported claims about the creators' personal lives, intentions, or
opinions. Keep factual biographical information concise and verified.

## 2.3 What this project is not

-   Not a playable Death Note game.
-   Not a generic anime wiki.
-   Not an ecommerce or merchandise website.
-   Not a simple sequence of static screenshots.
-   Not a collection of copied anime scenes.
-   Not a conventional landing page with repeated cards.
-   Not an official Death Note, Shueisha, Madhouse, or creator website.

------------------------------------------------------------------------

# 3. Quality Bar and Creative Ambition

The target is a premium experience that could plausibly be commissioned
at a high five-figure-quality level in terms of creative ambition and
finish. This is a quality target, not a claim about actual project cost
or a guarantee that a particular tool can deliver it automatically.

Every important page and scene should demonstrate: - Intentional
composition and visual hierarchy. - Distinct art direction. -
Sophisticated lighting and material treatment. - Purposeful, smooth
animation. - Carefully choreographed camera movement. - Excellent
typography and spacing. - Strong content writing and narrative pacing. -
Responsive interaction and reliable navigation. - Performance that
remains usable on real hardware.

**Do not confuse visual complexity with quality.** A restrained,
perfectly executed scene is better than an overloaded scene with dozens
of effects.

The characters are the most important visual assets. They must never
feel like small, static decorations pasted onto backgrounds.

------------------------------------------------------------------------

# 4. Character Art Direction

## 4.1 Recommended visual approach: hybrid cinematic style

Use anime-faithful character designs integrated into detailed, cinematic
3D environments.

The ideal treatment is a hybrid: - Characters retain recognizable anime
proportions, silhouettes, hairstyles, costumes, and expressions. -
Environments, props, lighting, atmosphere, particles, depth, and camera
movement use high-quality 3D. - Use fully rigged 3D character models
when the model quality, rigging, facial expressions, and animation are
genuinely strong. - If a fully animated 3D model cannot meet the quality
bar, use a high-quality 2.5D or layered composition with carefully
controlled parallax and lighting rather than a visibly poor model.

Do not force every character into the same rendering technique. Choose
the best technique per scene while preserving visual consistency.

## 4.2 Character quality requirements

For featured characters, aim for: - High-quality, recognizable
silhouette and proportions. - Detailed hair, skin, eyes, clothing, and
accessories. - Expressive facial poses and eye direction. - Subtle idle
motion: breathing, posture shifts, hair or clothing movement where
appropriate. - Deliberate gestures and scene-specific animation. -
Carefully controlled camera framing and lighting. - A range of
expressions that reflect the character's personality. - No uncanny
facial movement, broken anatomy, clipping, or distracting loops.

When using 3D models, investigate: - Rig quality and deformation. -
Facial blendshapes or equivalent expression system. - Eye controls and
gaze. - Hair and cloth solutions appropriate to the performance
budget. - Animation retargeting and consistency. - Level of detail and
asset optimization.

Do not claim a character is fully animated if the implementation is only
a static image with a camera zoom.

## 4.3 Character-specific art direction

### Light Yagami

-   Precise, composed, intelligent, increasingly unsettling.
-   Use controlled red lighting, hard shadows, strong compositions, and
    visual motifs of judgment and control.
-   Expressions should evolve with the narrative: ordinary student,
    calculating strategist, public Kira persona, collapse.
-   Avoid reducing the character to a generic villain pose.

### L Lawliet

-   Cold, analytical, unusual, observant.
-   Use blue-grey lighting, negative space, monitor glow, detective-room
    compositions, and restrained movement.
-   Emphasize posture, gaze, stillness, and the feeling of constant
    observation.
-   Avoid exaggerated comedic animation.

### Ryuk

-   Supernatural, imposing, unsettling, curious, and occasionally
    amused.
-   Use scale, silhouette, shadows, atmospheric depth, and dramatic
    framing.
-   The Shinigami realm should feel alien and bleak.
-   Use carefully designed animation and lighting to make Ryuk feel
    present rather than merely decorative.

### Misa Amane

-   Strong gothic fashion identity and expressive presence.
-   Use deliberate composition and lighting that distinguish her from
    Light and L.
-   Treat her motivations and role with nuance.

### Rem

-   Quiet, solemn, otherworldly.
-   Use restrained movement, pale/cold atmosphere, and compositions that
    communicate emotional weight.

### Near and Mello

-   Give them distinct visual languages and compositions.
-   Near: controlled, quiet, analytical, minimal.
-   Mello: intense, volatile, high-contrast, restless.

### Other characters

Mikami, Takada, Soichiro, Matsuda, Aizawa, Mogi, Ide, Watari, Naomi
Misora, Raye Penber, Sayu, Sachiko, Gevanni, Lidner, and other relevant
characters should appear where the story or archive requires them. Do
not create elaborate 3D assets for every minor character if it harms the
quality or schedule. Use a tiered asset strategy.

## 4.4 Character presentation tiers

-   **Tier 1 --- Hero characters:** Light, L, Ryuk. Highest asset and
    animation investment.
-   **Tier 2 --- Major characters:** Misa, Rem, Near, Mello, Mikami.
    High-quality featured presentation.
-   **Tier 3 --- Supporting characters:** Profiles, portraits,
    relationship diagrams, or scene appearances as appropriate.

------------------------------------------------------------------------

# 5. Visual Identity

## 5.1 Mood

Dark psychological thriller. Elegant, tense, intellectual, supernatural,
and cinematic.

The visual experience should move between: - Oppressive darkness. -
Stark paper-white spaces. - Deep crimson and blood-red accents. - Cold
blue detective environments. - Ash, smoke, rain, dust, and controlled
atmospheric particles. - Occasional warm city lights and human
environments.

## 5.2 Suggested palette

Treat these as starting tokens, not rigid restrictions:

  Token          Suggested value   Use
  -------------- ----------------- ----------------------------------
  Obsidian       `#080808`         Main background
  Charcoal       `#151515`         Secondary surfaces
  Deep crimson   `#4A0A10`         Kira-related atmosphere
  Blood red      `#9F171F`         Accent and emphasis
  Paper white    `#E8E3D8`         Text and notebook pages
  Ash grey       `#858585`         Secondary text
  Cold blue      `#526A91`         L and investigation environments

Use color to support narrative meaning, not as decoration.

## 5.3 Typography

Use a deliberate typography system: - Elegant high-contrast serif or
cinematic display face for chapter titles. - Highly readable sans-serif
for body content. - Handwriting-inspired type only for notebook writing
and selected annotations. - Monospaced typography for evidence labels,
case IDs, dates, and technical details.

Check font licensing and load fonts efficiently.

## 5.4 Visual rules

-   Avoid generic purple/blue gradient backgrounds.
-   Avoid generic glassmorphism.
-   Avoid repetitive rounded cards.
-   Avoid unnecessary floating UI.
-   Avoid overusing red glow.
-   Avoid visual clutter and excessive particles.
-   Avoid placing large amounts of text over busy scenes.
-   Use negative space intentionally.
-   Each chapter should have its own composition while remaining part of
    one coherent experience.
-   Use transitions that support story and meaning, not transitions for
    their own sake.

------------------------------------------------------------------------

# 6. Experience and Navigation

## 6.1 Main navigation

Create a minimal, unobtrusive navigation system: - A floating Death
Note/notebook-inspired navigation control. - A chapter index with
chapter numbers and names. - A clear scroll progress indicator. - Direct
chapter navigation. - A visible way to return to the top. -
Keyboard-accessible controls. - Sound control, with sound off by
default.

Navigation should not dominate the cinematic experience.

## 6.2 Scroll behavior

Scrolling is the primary storytelling input.

Support: - Scroll-triggered camera movement. - Scene transitions. -
Character reveals. - Notebook page turns. - Lighting changes. -
Environment transformations. - Timeline progression. - Text and visual
synchronization.

Requirements: - All scroll animations must be reversible. - Scrolling
upward must work correctly. - Users must not be trapped in pinned
sections. - Avoid excessive scroll hijacking. - Provide chapter jump
navigation. - Provide reduced-motion behavior. - Ensure essential text
is accessible even if 3D scenes fail to load. - Do not require a mouse
to read or navigate the site.

## 6.3 Interaction language

Interactions can include: - Hover-based character or object reactions. -
Subtle pointer parallax. - Object rotation. - Notebook page turning. -
Evidence highlighting. - Timeline exploration. - Character relationship
exploration. - Rulebook interactions. - Scene-specific camera changes.

Every interactive object must communicate that it is interactive. Do not
make users guess.

------------------------------------------------------------------------

# 7. Main Website: Chapter Structure

The experience should be long and substantial, but each chapter must
have a clear purpose and strong pacing. The following is the intended
content map. Chapters may be combined or split if usability and pacing
improve, but do not silently remove important story coverage.

## Chapter 00 --- Prologue: A World of Boredom

-   Begin in darkness.
-   Establish the human world and its atmosphere.
-   Introduce Ryuk's boredom and the Shinigami realm.
-   Show the notebook falling toward Earth.
-   Create a memorable opening sequence.

## Chapter 01 --- The Death Note

-   Introduce the notebook as the central object.
-   Show its cover, pages, writing, texture, and rules.
-   Reveal the first key rules gradually.
-   Make the notebook a recurring visual and navigation motif.

## Chapter 02 --- The Shinigami Realm

-   Explore the Shinigami world.
-   Introduce Ryuk and Rem.
-   Explain Shinigami society, lifespan, and the Eyes concept.
-   Establish the supernatural atmosphere.

## Chapter 03 --- Light Yagami

-   Introduce Light's ordinary life and intelligence.
-   Explore his worldview and response to the notebook.
-   Show the psychological turning point.
-   Establish the contrast between his public identity and private
    ambition.

## Chapter 04 --- Birth of Kira

-   Cover the first killings and public reaction.
-   Show the rise of Kira through news, public debate, and fear.
-   Use a visual event timeline.
-   Explore the idea of justice and social response.

## Chapter 05 --- L: The World's Greatest Detective

-   Introduce L and his methods.
-   Create a distinctive detective-room environment.
-   Explore deduction, observation, and uncertainty.
-   Establish the contrast between Light and L.

## Chapter 06 --- First Battle: Light vs L

-   Lind L. Tailor.
-   The geographic investigation.
-   Early deductions and narrowing the suspect pool.
-   Surveillance and the university encounter.
-   Make the cat-and-mouse structure understandable.

## Chapter 07 --- Misa Amane: The Second Kira

-   Introduce Misa.
-   Explain her notebook and relationship with Rem.
-   Explain the Shinigami Eyes deal.
-   Explore the consequences of introducing a second Kira.

## Chapter 08 --- Confinement and Memory Loss

-   Explain ownership and memory mechanics.
-   Cover confinement and the loss of memories.
-   Visualize the notebook's ownership chain.
-   Clearly explain the rules involved.

## Chapter 09 --- Yotsuba Arc

-   Introduce the corporate Kira investigation.
-   Explore the Yotsuba group and the investigation.
-   Show Light and L cooperating.
-   Explain the strategic complexity without overwhelming the visitor.

## Chapter 10 --- The End of L

-   Cover Rem's decision and its consequences.
-   Show L's death and the aftermath.
-   Handle the sequence with restraint and emotional weight.
-   Avoid sensationalizing the scene.

## Chapter 11 --- Successors: Near and Mello

-   Introduce Wammy's House.
-   Explain Near and Mello's different approaches.
-   Establish the successor conflict.
-   Give each character a distinct visual identity.

## Chapter 12 --- The New Kira Era

-   Introduce Teru Mikami and Kiyomi Takada.
-   Show the growth of Kira's influence.
-   Explore the public and ideological consequences.
-   Explain the changing investigation.

## Chapter 13 --- Final Strategy

-   Cover Near and Mello's plans.
-   Explain notebook manipulation and preparations.
-   Visualize key relationships, clues, and strategic moves.
-   Make complex developments understandable.

## Chapter 14 --- Final Confrontation

-   Recreate the atmosphere of the Yellow Box warehouse through an
    original environment.
-   Show the final confrontation between Light and Near.
-   Explain the plan, the notebook, and the revelations.
-   Preserve suspense while clearly communicating events.

## Chapter 15 --- The Fall of Kira

-   Cover Light's exposure and final moments.
-   Include Ryuk's role.
-   Show the aftermath and the world after Kira.
-   End the main story with a carefully composed cinematic sequence.

## Chapter 16 --- The Complete Death Note Rulebook

Create an interactive rule archive covering: - Writing a name and the
face requirement. - Causes and times of death. - Default conditions. -
Ownership. - Memory mechanics. - Notebook transfer. - Shinigami Eyes. -
Lifespan. - Shinigami restrictions. - Other relevant rules and
exceptions.

Rules must be accurate, sourced, and explained in plain language.
Clearly distinguish anime-canon material from manga-only details or
differences.

## Chapter 17 --- Shinigami Eyes and Supernatural Mechanics

-   Explain the Eyes deal.
-   Explain lifespan visibility and limitations.
-   Explain the lifespan consequences.
-   Explain relevant Shinigami mechanics.
-   Use clear visual diagrams and examples.

## Chapter 18 --- Character Archive

Provide searchable or navigable profiles for major and supporting
characters.

Each profile may include: - Name and role. - Story introduction. -
Personality and motivations. - Relationships. - Important events. -
Narrative significance. - Spoiler warning where appropriate.

The archive should feel like a designed exhibition, not a generic
database table.

## Chapter 19 --- Psychology, Philosophy and Legacy

Explore: - Justice and morality. - The god complex. - Power and
corruption. - Manipulation and psychological warfare. - Light and L as
contrasting minds. - The role of fear and public opinion. - Character
motivations. - Anime and manga differences where relevant. - Why the
story remains memorable.

End with a transition that closes the notebook and introduces the
separate creator tribute.

------------------------------------------------------------------------

# 8. Separate Creator Tribute Page

## 8.1 Purpose

This page is the emotional centre of the project. It must be a
standalone experience dedicated only to Tsugumi Ohba and Takeshi Obata.

Suggested route: `/tribute`

Suggested title:

**DEATH NOTE --- A TRIBUTE TO ITS CREATORS**

Possible supporting line:

**To the minds that imagined it. To the hands that brought it to life.**

The wording should feel sincere, restrained, and personal. Avoid
exaggerated claims, fake quotations, or invented messages from the
creators.

## 8.2 Suggested tribute sequence

### Tribute opening --- The blank page

-   A quiet, minimal scene.
-   A blank manga page or notebook.
-   A pencil, subtle paper texture, and carefully controlled light.
-   A slow reveal of the tribute title.
-   The visitor should immediately understand that this page is a
    thank-you.

### The story --- Tsugumi Ohba

-   Focus on the premise, psychological conflict, moral ambiguity,
    pacing, and narrative construction.
-   Explain the storytelling elements that make Death Note distinctive.
-   Use visual metaphors such as written words, branching choices, and
    the notebook.

### The art --- Takeshi Obata

-   Celebrate the manga's visual language, character design,
    expressions, composition, and atmosphere.
-   Use original or properly licensed artwork only.
-   If licensed artwork is unavailable, create original visual
    compositions inspired by broad visual qualities without copying
    specific panels.

### The collaboration

-   Celebrate the combination of story and visual art.
-   Show how narrative and illustration work together.
-   Do not invent details about their private creative process.

### The final page --- A thank-you

-   A notebook closes.
-   The environment becomes quiet.
-   A short, sincere dedication appears.
-   Finish with a subtle signature-like visual treatment, but do not
    forge either creator's signature.

Suggested original dedication (may be refined):

> Some stories entertain us.
>
> Some stories challenge the way we think.
>
> And some remain with us long after the final page.
>
> Thank you, Tsugumi Ohba and Takeshi Obata, for creating Death Note.

The page should feel personal, respectful, and emotionally memorable.

## 8.3 Tribute navigation

-   Link to it from the main website's final chapter.
-   Also provide a discreet direct link in the main navigation or
    footer.
-   It must be accessible independently by URL.
-   Do not make the tribute dependent on completing the entire main
    experience.

------------------------------------------------------------------------

# 9. 3D and Motion Direction

## 9.1 Core 3D motifs

-   Death Note notebook.
-   Individual pages and writing.
-   Apple.
-   Pencil and desk objects.
-   Shinigami realm.
-   Earth and city environments.
-   Detective room.
-   University and public spaces.
-   Corporate office.
-   Evidence boards and screens.
-   Yellow Box warehouse.
-   Atmospheric particles, smoke, rain, dust, and light.

## 9.2 Signature transitions

Develop a reusable transition library: - Notebook page turn. - Ink
spread or ink reveal. - Smoke or shadow transition. - Red-to-blue
lighting transition. - Character silhouette reveal. - Camera passing
through an object or environment. - Evidence-board assembly. - Page
becoming a new environment. - Notebook closing.

Do not use every transition everywhere. Assign transitions based on
narrative context.

## 9.3 Camera direction

-   Camera motion should be cinematic, smooth, and controlled.
-   Use depth and parallax intentionally.
-   Avoid disorienting rotation or constant camera movement.
-   Never make reading difficult because of moving text.
-   Support reduced motion.
-   Provide a way to skip or bypass cinematic sequences.

## 9.4 Shader direction

Potential effects: - Paper and ink shaders. - Subtle film grain. -
Controlled bloom. - Volumetric-looking light where performant. -
Dissolve and particle transitions. - Fresnel/rim lighting. - Atmospheric
depth and fog. - Screen distortion only when narratively justified.

Effects must be tested on target hardware. Do not add a shader simply
because it looks impressive in isolation.

------------------------------------------------------------------------

# 10. Technical Architecture

## 10.1 Preferred stack

Use current stable versions and verify compatibility before
installation.

-   React.
-   Vite.
-   TypeScript.
-   Three.js.
-   React Three Fiber.
-   Drei.
-   GSAP and ScrollTrigger.
-   Lenis or another smooth-scroll solution only if it does not
    interfere with accessibility and browser behavior.
-   `@react-three/postprocessing` where useful.
-   GLSL shaders for custom visual effects.
-   Blender for custom 3D asset production.
-   glTF/GLB for runtime models.
-   Draco and KTX2/Basis compression where appropriate.
-   Playwright for end-to-end browser testing.
-   ESLint and Prettier.

Use WebGPU only where supported and beneficial, with a reliable WebGL
fallback. Do not make WebGPU a requirement for the site to function.

## 10.2 Architecture principles

-   Use a shared renderer where practical rather than creating multiple
    unnecessary WebGL contexts.
-   Separate content data from presentation components.
-   Build reusable scene, camera, transition, and interaction systems.
-   Lazy-load chapter scenes and large assets.
-   Dispose of geometries, materials, textures, and render targets when
    no longer needed.
-   Avoid React state updates on every animation frame.
-   Use refs and frame-loop mechanisms for high-frequency animation.
-   Use instancing for repeated objects.
-   Use LOD and adaptive quality.
-   Keep the site navigable if WebGL initialization fails.
-   Provide meaningful loading states.
-   Use route-level code splitting.
-   Keep the architecture understandable and maintainable.

## 10.3 Suggested folder structure

Adapt this to the existing repository rather than blindly replacing it.

``` text
/
├── public/
│   ├── models/
│   ├── textures/
│   ├── images/
│   ├── audio/
│   └── fonts/
├── src/
│   ├── app/
│   ├── routes/
│   ├── components/
│   │   ├── navigation/
│   │   ├── typography/
│   │   ├── transitions/
│   │   ├── loading/
│   │   ├── interactive/
│   │   └── accessibility/
│   ├── scenes/
│   │   ├── shared/
│   │   ├── prologue/
│   │   ├── notebook/
│   │   ├── shinigami/
│   │   ├── light/
│   │   ├── investigation/
│   │   ├── misa/
│   │   ├── yotsuba/
│   │   ├── successors/
│   │   ├── warehouse/
│   │   └── tribute/
│   ├── chapters/
│   │   ├── chapterData.ts
│   │   └── sections/
│   ├── encyclopedia/
│   │   ├── characters/
│   │   ├── rules/
│   │   ├── timeline/
│   │   ├── relationships/
│   │   └── lore/
│   ├── animation/
│   │   ├── scroll/
│   │   ├── camera/
│   │   └── transitions/
│   ├── hooks/
│   ├── shaders/
│   ├── styles/
│   ├── data/
│   └── utils/
├── docs/
│   ├── DESIGN_SYSTEM.md
│   ├── SCENE_SPECIFICATIONS.md
│   ├── CONTENT_REFERENCE.md
│   ├── ASSET_REGISTER.md
│   ├── PERFORMANCE.md
│   └── TEST_PLAN.md
├── SPEC.md
├── CLAUDE.md
├── PROGRESS.md
└── README.md
```

------------------------------------------------------------------------

# 11. Performance and Reliability

This is a visually ambitious website, but it must remain usable.

## 11.1 Performance targets

Treat these as goals to measure, not promises: - Fast first meaningful
content on a reasonable broadband connection. - Aim for approximately 60
FPS on capable desktop hardware. - Avoid sustained frame rates below 30
FPS on supported desktop configurations. - Keep initial downloads small
through progressive loading. - Load high-detail models only when
needed. - Avoid loading all chapters and assets at startup. - Avoid
memory growth during long scroll sessions. - Avoid shader compilation
stalls where possible. - Display useful content before heavy 3D assets
finish loading.

## 11.2 Adaptive quality

Provide quality levels: - High. - Balanced. - Performance.

Automatically choose a reasonable default, but allow the visitor to
change it.

Reduce: - Particle counts. - Shadow resolution. - Post-processing
passes. - Render resolution. - Model detail. - Expensive transparency
and volumetric effects.

## 11.3 Device targets

Test at minimum: - 1920 × 1080. - 1440 × 900. - 1366 × 768. - Ultrawide
desktop. - Smaller laptop viewport. - High-DPI display. - Tablet. -
Mobile.

Mobile must have a deliberate fallback: simplified scenes, lighter
effects, readable content, usable navigation, and no broken desktop-only
interactions.

## 11.4 Failure handling

-   If WebGL is unavailable, show a graceful static/2D version of the
    content.
-   If an asset fails to load, show a designed fallback rather than a
    broken canvas.
-   If audio fails, the website must remain fully usable.
-   If a chapter scene fails, navigation and other chapters must still
    work.

------------------------------------------------------------------------

# 12. Accessibility and User Control

-   Sound is off by default.
-   All sound can be muted immediately.
-   Respect `prefers-reduced-motion`.
-   Provide pause/stop controls for sustained motion where appropriate.
-   Provide keyboard-accessible navigation.
-   Maintain readable contrast.
-   Ensure focus states are visible.
-   Do not communicate information through color alone.
-   Provide text alternatives for essential visual content.
-   Keep body text readable and selectable.
-   Provide skip-to-content and chapter jump options.
-   Avoid flashing effects.
-   Avoid motion that causes discomfort.
-   Do not trap keyboard focus.

------------------------------------------------------------------------

# 13. Content Accuracy and Research

The project covers the complete anime, so spoilers are expected. Add a
clear spoiler notice before the visitor enters the main experience.

Content rules: - Use anime canon as the primary continuity. - Clearly
label manga-only information and anime/manga differences. - Do not
invent Death Note rules. - Do not present fan theories as canon. -
Verify names, events, order, and relationships. - Keep plot summaries
concise enough to support the visual experience. - Write original
explanatory text; do not copy large blocks of manga or anime dialogue. -
Do not fabricate quotations from characters, creators, or staff. - Do
not invent creator biographies, private details, or statements. -
Maintain a source/reference document for factual content.

------------------------------------------------------------------------

# 14. Copyright, Fan Work and Respect

This is an unofficial fan-made tribute.

-   Clearly state that the website is unofficial and not affiliated with
    or endorsed by the rights holders or creators.
-   Do not imply that the creators have seen, approved, or commissioned
    the project.
-   Do not rip or redistribute anime episodes, footage, soundtrack,
    manga scans, or other copyrighted material.
-   Use original 3D models, original compositions, properly licensed
    assets, or assets for which permission has been obtained.
-   Do not reproduce manga panels or official promotional artwork
    without appropriate rights.
-   Do not clone official logos or signatures in a way that suggests
    endorsement.
-   Use the Death Note name only to identify the subject of the fan
    tribute, with appropriate disclaimers.
-   Maintain an asset register with source, license, attribution
    requirements, and usage notes.
-   If an asset's rights are unclear, do not use it in the published
    version.

The tribute must be respectful and must not impersonate either creator.

------------------------------------------------------------------------

# 15. Sound Design

Sound should enhance the atmosphere, never obstruct the experience.

Potential original sound design: - Paper movement. - Pencil writing. -
Notebook closing. - Subtle room tone. - Wind and distant city
ambience. - Low atmospheric drones. - Restrained impact sounds for
transitions.

Do not use ripped anime soundtrack or unlicensed music. Use original or
properly licensed sound. Sound is off by default, and the site must
remain excellent with sound disabled.

------------------------------------------------------------------------

# 16. Development Workflow for Claude Code

Claude should operate as a senior cross-functional product and
engineering team, not as a one-shot code generator.

## 16.1 General operating instructions

1.  Read this entire `SPEC.md` before making changes.
2.  Inspect the repository, current branch, existing files,
    dependencies, and current implementation.
3.  Preserve useful existing work. Do not overwrite or restructure the
    project without understanding it.
4.  Create and maintain `CLAUDE.md`, `PROGRESS.md`, and the
    documentation listed in this specification.
5.  Convert this specification into a concrete implementation plan and
    task breakdown.
6.  Identify technical risks early, especially character assets,
    animation, performance, and content rights.
7.  Implement in small, verifiable phases.
8.  Run the application and inspect it in a real browser after
    meaningful changes.
9.  Fix errors rather than hiding or ignoring them.
10. Never claim that a feature is complete unless it has been
    implemented and tested.
11. Do not replace a required 3D scene with a static image and mark it
    complete.
12. Use placeholder assets only during explicitly marked prototyping;
    record them in the asset register and do not call the relevant scene
    finished.
13. Keep code clean, typed, modular, and documented where necessary.
14. Prefer robust implementation over impressive-looking but fragile
    hacks.
15. Continue autonomously through the agreed task list. Do not stop
    after producing a plan when implementation is clearly the next task.
16. Ask the user only when a genuinely blocking decision, permission,
    credential, asset, or irreversible action is required. Make sensible
    documented decisions for non-blocking details.

## 16.2 Use available Claude capabilities effectively

When available in the user's configured Claude Code environment: - Use
the strongest available Opus model for architecture, complex reasoning,
and difficult implementation. - Use Plan Mode before major architectural
changes. - Use specialized subagents for independent research, code
review, testing, asset analysis, performance analysis, and content
verification. - Use parallel agents only for tasks with clear boundaries
and low file-conflict risk. - Use skills for repeatable workflows. - Use
hooks for reliable formatting, linting, or validation where
appropriate. - Use Chrome/browser integration to inspect the actual
running site. - Use terminal tools for build, test, type-check, and
asset optimization workflows. - Use context management and concise
progress records so long-running work can resume reliably.

Do not create agents merely to create agents. Assign each one a concrete
deliverable and review its output.

Do not assume a capability is available. Check the installed tools and
environment first. If a capability is unavailable, use a reliable
alternative and document the limitation.

## 16.3 Suggested specialist roles

Use these as task roles or subagents where useful: - Creative director /
visual researcher. - Frontend and application architect. - Three.js /
React Three Fiber engineer. - Character asset and animation
specialist. - Shader and lighting specialist. - GSAP / scroll
choreography specialist. - Content researcher and continuity checker. -
Performance engineer. - Accessibility reviewer. - QA and browser-testing
engineer.

The main agent is responsible for integration, consistency, and final
quality.

------------------------------------------------------------------------

# 17. Phased Implementation Plan

Do not attempt the entire website in one enormous implementation pass.
Build a complete, high-quality foundation and then expand.

## Phase 0 --- Repository Audit and Production Plan

Deliverables: - Repository and environment audit. - Architecture
proposal. - Dependency and compatibility assessment. - Scene and asset
strategy. - Content research plan. - Risk register. - Milestone
breakdown. - Updated `PROGRESS.md`.

Exit criteria: - Existing project is understood. - Technical decisions
are documented. - No destructive changes have been made without
justification.

## Phase 1 --- Foundation

Deliverables: - React/Vite/TypeScript setup or verified existing
setup. - Routing for main site and `/tribute`. - Global design tokens
and typography. - Chapter data model. - Basic navigation. - Loading and
error states. - Accessibility foundations. - Lint, type-check, build,
and test scripts.

Exit criteria: - Both routes load. - Navigation works. - Build and
type-check pass. - Responsive base layout works.

## Phase 2 --- Visual Prototype and Design System

Deliverables: - High-fidelity opening hero prototype. - Notebook model
or prototype asset. - Lighting and material direction. - Typography and
spacing system. - Scroll progress and chapter navigation. - Initial
transition library. - Desktop and mobile layout direction.

Exit criteria: - The opening feels art-directed and coherent. - The
visual system can be reused. - Performance has been measured, not
guessed.

## Phase 3 --- Core 3D and Animation Framework

Deliverables: - Shared Three.js renderer architecture. - Camera and
scroll synchronization. - Scene loading/unloading. - Asset management. -
Transition system. - Adaptive quality controls. - Reduced-motion
behavior. - WebGL fallback.

Exit criteria: - A test scene can load, animate, unload, and reload
without memory leaks. - Scrolling both directions works. - The system
supports chapter-level scenes.

## Phase 4 --- Signature Opening

Deliverables: - Complete Chapter 00 and Chapter 01. - Earth / notebook
fall sequence. - Notebook hero model and page interaction. - Ryuk
introduction. - Cinematic transitions. - Sound controls and loading
sequence.

Exit criteria: - Opening sequence is complete and browser-tested. - No
obvious placeholder assets remain in the finished opening. - Scene
performance is acceptable.

## Phase 5 --- Character Quality Benchmark

Deliverables: - A high-quality Light presentation. - A high-quality L
presentation. - A high-quality Ryuk presentation. - Character
interaction and animation framework. - Asset pipeline and character
quality checklist.

Exit criteria: - Featured characters meet the agreed visual quality
bar. - Animation looks intentional and stable. - The chosen hybrid
approach is validated before scaling to other characters.

## Phase 6 --- Story Chapters 02--09

Deliverables: - Shinigami realm. - Light's development. - Birth of
Kira. - L introduction and investigation. - Light vs L. - Misa and
second Kira. - Confinement and memory. - Yotsuba arc.

Exit criteria: - Story continuity is correct. - Chapters have distinct
visual identities. - Navigation and scroll behavior remain reliable.

## Phase 7 --- Story Chapters 10--15

Deliverables: - End of L. - Near and Mello. - New Kira era. - Final
strategy. - Yellow Box confrontation. - Fall of Kira.

Exit criteria: - Full anime story is covered. - Ending is emotionally
and visually complete. - No unresolved story placeholders.

## Phase 8 --- Encyclopedia Chapters 16--19

Deliverables: - Interactive rulebook. - Shinigami mechanics. - Character
archive. - Timeline and relationship exploration. - Psychology,
philosophy, and legacy.

Exit criteria: - Facts are verified. - Anime/manga differences are
labeled. - Archive navigation works.

## Phase 9 --- Separate Creator Tribute

Deliverables: - Independent `/tribute` route. - Dedicated visual
identity. - Ohba section. - Obata section. - Collaboration section. -
Original thank-you sequence. - Factual references and fan-work
disclaimer.

Exit criteria: - Tribute works independently. - It is emotionally
coherent and respectful. - It does not feel like a generic credits page.

## Phase 10 --- Polish, Performance and Quality Assurance

Deliverables: - Browser testing across target viewports. - Performance
profiling. - Asset compression. - Memory leak checks. - Accessibility
review. - Reduced-motion testing. - Mobile fallback. - SEO and
metadata. - Error and loading-state review. - Final documentation.

Exit criteria: - No critical bugs. - No broken navigation. - No
unhandled runtime errors. - No major performance regressions. - All
major features are tested.

## Phase 11 --- Release

Deliverables: - Production build. - Deployment instructions. - Final
README. - Asset/license register. - Known limitations. - Final
`PROGRESS.md`. - Final review report.

Exit criteria: - Production build succeeds. - Main and tribute routes
work in production. - Project can be maintained and resumed.

------------------------------------------------------------------------

# 18. Testing Requirements

Use automated and manual testing.

## Automated

-   TypeScript checks.
-   Lint.
-   Production build.
-   Unit tests for important logic.
-   Playwright tests for routes and navigation.
-   Tests for chapter navigation and scroll controls.
-   Tests for reduced-motion and sound controls where practical.

## Manual browser review

After each major phase: - Open the actual running website. - Inspect at
desktop and mobile sizes. - Scroll slowly and quickly. - Scroll both
down and up. - Jump directly between chapters. - Test keyboard
navigation. - Test with sound off. - Test reduced motion. - Check
loading and error behavior. - Check for clipping, layout shifts,
unreadable text, and broken animations. - Inspect console errors and
network failures. - Verify that assets unload correctly during long
sessions.

## Visual quality review

Review: - Character fidelity and expression. - Lighting and material
quality. - Camera composition. - Animation timing. - Typography. -
Negative space. - Transition continuity. - Narrative pacing. - Visual
consistency.

A passing build is not the same as a finished experience.

------------------------------------------------------------------------

# 19. Progress Management

Maintain `PROGRESS.md` throughout the project.

Use this structure:

``` md
# Project Progress

## Current phase
## Overall status

## Completed
- [x] ...

## In progress
- [ ] ...

## Not started
- [ ] ...

## Known bugs
- ...

## Missing assets
- ...

## Performance observations
- ...

## Browser testing
- ...

## Decisions made
- ...

## Risks / blockers
- ...

## Next actions
1. ...
2. ...
3. ...
```

Rules: - Update it after every meaningful work session. - Mark work
complete only after testing. - Record temporary assets and
placeholders. - Record any deviation from this specification with its
reason. - Keep a short handoff note so another session can resume
without repeating repository discovery. - Do not hide unfinished work by
marking entire phases complete.

------------------------------------------------------------------------

# 20. Definition of Done

The project is not complete merely because all chapter headings exist.

A feature is done only when: - It has real content. - Its visual
treatment is implemented. - Its interactions work. - It is responsive
enough for its target. - It has been tested in a browser. - It does not
introduce serious performance or accessibility problems. - Any required
assets have appropriate usage rights. - Documentation and progress
status are updated.

The full project is done only when: - The main experience covers the
full anime story. - The character archive and rulebook are functional. -
The separate creator tribute page is complete. - The main visual
identity is consistent. - Featured characters meet the visual quality
benchmark. - Navigation and scroll behavior work in both directions. -
Desktop experience is polished. - Mobile fallback is usable. -
Performance and accessibility have been reviewed. - Copyright and
fan-work disclaimers are present. - Production build and deployment have
been verified.

------------------------------------------------------------------------

# 21. First Instruction to Claude Code

**Begin by reading this complete specification and auditing the
repository.**

Do not immediately generate the entire website. First: 1. Inspect the
repository and report its current state. 2. Identify the current
framework, dependencies, scripts, and existing work. 3. Propose the
architecture and explain any changes needed. 4. Identify the most
difficult technical risks. 5. Propose the character asset strategy and
how to reach the required quality. 6. Create or update `CLAUDE.md`,
`PROGRESS.md`, and the supporting documentation. 7. Produce a
prioritized implementation plan with measurable exit criteria. 8.
Identify which capabilities, tools, and subagents are actually available
in this environment.

Then begin Phase 1 unless a genuinely blocking decision is required. Do
not stop at planning or ask for approval for routine implementation
details. Keep the work incremental, test it, and update progress
continuously.

**The first major quality milestone is not a long page. It is one
extraordinary opening sequence with a convincing Death Note notebook, a
cinematic environment, excellent motion, and a clear technical
foundation.**

------------------------------------------------------------------------

# 22. Final Creative Standard

The visitor should remember: - The atmosphere. - The characters. - The
transitions. - The storytelling. - The feeling of moving through the
Death Note world. - The sincerity of the creator tribute.

The site should never feel like a student project trying to look
expensive. It should feel like a carefully art-directed digital
exhibition made by people who genuinely love the source material.

**Build with ambition. Execute with restraint. Test everything. Never
fake completion.**
