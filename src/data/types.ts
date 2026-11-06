/**
 * Content data contract for DEATH NOTE — THE JUDGMENT.
 *
 * Content (what is said) lives in `src/data/*`. Presentation (how it looks)
 * lives in `src/chapters`, `src/scenes`, `src/encyclopedia`. Nothing in this
 * file may import React or Three.js.
 *
 * Canon policy (see docs/CONTENT_REFERENCE.md):
 *  - The anime (Madhouse, 2006–2007, 37 episodes) is the primary continuity.
 *  - Manga-only material and anime/manga differences are always labelled.
 *  - All prose is original wording. No verbatim dialogue blocks, no
 *    fabricated quotations, no fan theories presented as canon.
 */

/** Which continuity a fact belongs to. */
export type Canon =
  /** Shown or stated consistently in both the anime and the manga. */
  | 'both'
  /** Anime-only, or the anime version differs from the manga. */
  | 'anime'
  /** Manga-only (including the official guidebook "How to Read 13"). */
  | 'manga';

export interface SourceRef {
  /** Human-readable citation, e.g. "Manga, How to Use I" or "Anime, Ep. 1". */
  label: string;
  /** URL used to verify the fact (reference only; never hot-linked media). */
  url?: string;
}

/* ------------------------------------------------------------------ */
/* Identifiers                                                         */
/* ------------------------------------------------------------------ */

export const CHAPTER_IDS = [
  'prologue',
  'notebook',
  'shinigami',
  'light',
  'kira',
  'l',
  'first-battle',
  'misa',
  'confinement',
  'yotsuba',
  'end-of-l',
  'successors',
  'new-kira',
  'final-strategy',
  'confrontation',
  'fall',
  'rulebook',
  'eyes',
  'archive',
  'legacy',
] as const;
export type ChapterId = (typeof CHAPTER_IDS)[number];

export const CHARACTER_IDS = [
  // Tier 1
  'light',
  'l',
  'ryuk',
  // Tier 2
  'misa',
  'rem',
  'near',
  'mello',
  'mikami',
  // Tier 3
  'takada',
  'soichiro',
  'matsuda',
  'aizawa',
  'mogi',
  'ide',
  'ukita',
  'watari',
  'naomi',
  'raye',
  'sayu',
  'sachiko',
  'gevanni',
  'lidner',
  'rester',
  'matt',
  'higuchi',
  'roger',
  'wedy',
  'aiber',
  'lind-tailor',
  'gelus',
  'sidoh',
] as const;
export type CharacterId = (typeof CHARACTER_IDS)[number];

export type ArcId =
  | 'origin'
  | 'investigation'
  | 'second-kira'
  | 'confinement'
  | 'yotsuba'
  | 'end-of-l'
  | 'successors'
  | 'new-kira'
  | 'finale';

/* ------------------------------------------------------------------ */
/* Rules                                                               */
/* ------------------------------------------------------------------ */

export type RuleCategory =
  | 'writing' // names, faces, spelling, what counts as "writing"
  | 'death' // causes, timing, circumstances, defaults
  | 'ownership' // who owns a notebook, how ownership is gained or lost
  | 'memory' // forgetting and regaining memories
  | 'transfer' // lending, passing on, pages and scraps
  | 'eyes' // the Shinigami Eyes deal
  | 'lifespan' // lifespans of humans and Shinigami
  | 'shinigami' // what Shinigami can and cannot do
  | 'limits' // exceptions, immunities, restrictions
  | 'fake'; // the fake rules Light had written in the notebook

export interface Rule {
  /** kebab-case, unique. */
  id: string;
  category: RuleCategory;
  /** Short plain-language title (original wording). */
  title: string;
  /** Plain-language explanation (original wording — never a verbatim quote). */
  plain: string;
  /** Optional elaboration, example, or edge case. */
  detail?: string;
  /** Canonical numbering, e.g. "How to Use I · 1". Use "—" if unnumbered. */
  ref: string;
  canon: Canon;
  /** True for rules that are false in-universe (the 13-day rule, etc.). */
  fake?: boolean;
  /** How the rule mattered to the plot (spoilers allowed). */
  storyRelevance?: string;
  sources: SourceRef[];
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

export interface TimelineEvent {
  /** kebab-case, unique. */
  id: string;
  arc: ArcId;
  /** Anime episode or inclusive episode range. */
  episode: number | [number, number];
  /** In-story date (ISO, partial allowed: "2004", "2004-11") — omit if uncertain. */
  date?: string;
  title: string;
  /** 1–3 sentences, original wording. */
  summary: string;
  characters: CharacterId[];
  /** Site chapter that covers this event. */
  chapter: ChapterId;
  canon: Canon;
  /** Anime/manga difference notes, if any. */
  note?: string;
  sources: SourceRef[];
}

/* ------------------------------------------------------------------ */
/* Episodes                                                            */
/* ------------------------------------------------------------------ */

export interface Episode {
  number: number;
  /** Official English title. */
  title: string;
  /** Original Japanese title (romanised or kana), if verified. */
  titleJa?: string;
  /** Original Japanese air date (ISO), if verified. */
  aired?: string;
  /** One sentence, original wording. */
  summary: string;
  chapter: ChapterId;
}

/* ------------------------------------------------------------------ */
/* Characters                                                          */
/* ------------------------------------------------------------------ */

export type CharacterTier = 1 | 2 | 3;

export type Affiliation =
  | 'kira' // Kira and those who serve or follow Kira
  | 'task-force' // Japanese Kira investigation task force
  | 'l' // L, Watari and L's direct network
  | 'spk' // Near's SPK
  | 'mafia' // Mello and associates
  | 'shinigami'
  | 'fbi'
  | 'yotsuba'
  | 'civilian'
  | 'wammy'; // Wammy's House

export type RelationshipKind =
  | 'ally'
  | 'rival'
  | 'family'
  | 'shinigami-bond'
  | 'devotion'
  | 'colleague'
  | 'manipulates'
  | 'successor'
  | 'adversary'
  | 'romance';

export interface Relationship {
  to: CharacterId;
  kind: RelationshipKind;
  /** Short original description, e.g. "Rivals who become uneasy partners". */
  label: string;
}

export interface CharacterProfile {
  id: CharacterId;
  /** Western order, e.g. "Light Yagami". */
  name: string;
  /** Japanese name, e.g. "夜神 月" — only if verified. */
  nameJa?: string;
  aliases?: string[];
  /** One-line role. */
  role: string;
  affiliation: Affiliation;
  tier: CharacterTier;
  introduced: { episode: number; chapter: ChapterId };
  /** Story introduction (2–4 sentences). */
  summary: string;
  /** Personality and motivations (2–4 sentences). */
  personality: string;
  /** Narrative significance (1–3 sentences). */
  significance: string;
  /** Important events, short phrases in story order. */
  keyEvents: string[];
  relationships: Relationship[];
  /** How their story ends (spoiler). */
  fate?: string;
  /** True if the profile reveals major plot spoilers. */
  spoiler: boolean;
  /** Anime/manga differences relevant to this character. */
  canonNotes?: string;
  sources: SourceRef[];
}

/* ------------------------------------------------------------------ */
/* Creators                                                            */
/* ------------------------------------------------------------------ */

export interface CreatorFact {
  /** Plain statement (original wording), verified against `sources`. */
  text: string;
  sources: SourceRef[];
}

export interface Creator {
  id: 'ohba' | 'obata';
  name: string;
  nameJa: string;
  /** "Story" or "Art". */
  craft: string;
  /** Concise, verified facts only. No personal details, no speculation. */
  facts: CreatorFact[];
}
