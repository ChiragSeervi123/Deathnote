# Content reference

The factual backbone of the site. Prose on the site is original; facts must trace to the
sources listed in the documents below.

## Canon policy (SPEC §13)

1. **Primary continuity:** the TV anime (Madhouse; 37 episodes).
2. **Manga-only material** (including the guidebook *Death Note 13: How to Read*) is labelled
   `manga` in data and shown with a "Manga" badge on the site.
3. **Differences** between anime and manga are noted where relevant (`note`/`canonNotes`).
4. **Never** invent rules, dialogue, quotations, or creator statements; never present fan
   theories as canon; never invent biographical details.
5. Plot summaries are concise and serve the visual experience.

## Documents

| Document | Contents | Data files |
| --- | --- | --- |
| [content/rules-and-mechanics.md](content/rules-and-mechanics.md) | Every rule with reference numbering, canon label, sources; Eyes and Shinigami mechanics; anime vs manga rule differences; "do not claim" list | `src/data/rules.ts` |
| [content/story-reference.md](content/story-reference.md) | Episode guide, chapter fact sheets (00–15), anime vs manga differences, "do not claim" list | `src/data/episodes.ts`, `src/data/timeline.ts`, `src/data/characters.ts` |
| [content/creators-and-production.md](content/creators-and-production.md) | Verified creator and production facts; "not verified — do not use" list | `src/data/creators.ts` |

## Integrity checks

`src/data/integrity.test.ts` verifies: unique ids; every timeline event and relationship
references a valid character and chapter; every rule, event and profile has at least one
source; every `CHARACTER_IDS` entry has exactly one profile; episodes 1–37 present once.

## Site copy

Chapter beats and section prose live in `src/chapters/chapterData.ts` and are written from the
chapter fact sheets. When a beat states a fact, the fact must appear in the fact sheet.
