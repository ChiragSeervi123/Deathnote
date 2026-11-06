import type { ChapterId } from '@/data/types';

/** Visual environments. Consecutive chapters may share one (no transition between them). */
export type SceneKey =
  | 'prologue'
  | 'notebook'
  | 'realm'
  | 'light'
  | 'kira'
  | 'l-room'
  | 'investigation'
  | 'misa'
  | 'confinement'
  | 'yotsuba'
  | 'rain'
  | 'wammy'
  | 'new-kira'
  | 'strategy'
  | 'warehouse'
  | 'fall'
  | 'archive'
  | 'eyes'
  | 'legacy';

/** Signature transitions (SPEC §9.2), assigned by narrative context. */
export type TransitionKind =
  'cut' | 'fade' | 'ink' | 'smoke' | 'pageTurn' | 'redToBlue' | 'silhouette' | 'close' | 'split';

/** Narrative palette — used by the 2D fallback, UI accents and grading. */
export type Palette = 'obsidian' | 'crimson' | 'cold' | 'paper' | 'ash' | 'dusk' | 'gold';

export type BeatAnchor =
  | 'left'
  | 'right'
  | 'center'
  | 'upper-left'
  | 'upper-right'
  | 'lower-left'
  | 'lower-right'
  | 'lower-center';

export type BeatKind = 'title' | 'line' | 'statement' | 'rule' | 'caption' | 'aside';

export interface Beat {
  /** Visible window in the chapter's local progress [in, out]. 0 / 1 tie to enter / exit. */
  at: readonly [number, number];
  anchor: BeatAnchor;
  kind: BeatKind;
  text: string;
  /** Small mono label above the text (rule reference, episode, case id…). */
  meta?: string;
  /** Canon badge when a beat is manga-only or anime-specific. */
  canon?: 'manga' | 'anime';
}

export interface DossierFact {
  label: string;
  value: string;
}

export interface Dossier {
  /** e.g. "Episodes 1–2". */
  episodes: string;
  paragraphs: readonly string[];
  facts?: readonly DossierFact[];
  /** Optional anime/manga difference note. */
  canonNote?: string;
}

export interface ChapterDef {
  id: ChapterId;
  number: number;
  /** "Prologue", "Chapter 03", "Archive" … */
  kicker: string;
  title: string;
  /** One line for the index and meta description. */
  subtitle: string;
  layout: 'cinematic' | 'longform';
  /** Sticky track length in viewport heights (cinematic layout). */
  length: number;
  scene: SceneKey;
  /** Transition used when this chapter's scene takes over from the previous one. */
  transition: TransitionKind;
  palette: Palette;
  /** Text alternative for the 3D scene (SPEC §12). */
  sceneDescription: string;
  beats: readonly Beat[];
  dossier?: Dossier;
}
