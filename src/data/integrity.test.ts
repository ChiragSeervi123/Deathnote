import { describe, expect, it } from 'vitest';
import { CHAPTERS } from '@/chapters/chapterData';
import { CHARACTERS } from './characters';
import { CREATORS, WORK_FACTS } from './creators';
import { EPISODES } from './episodes';
import { RULES } from './rules';
import { TIMELINE } from './timeline';
import { CHAPTER_IDS, CHARACTER_IDS } from './types';

const chapterSet = new Set<string>(CHAPTER_IDS);
const characterSet = new Set<string>(CHARACTER_IDS);
const unique = (xs: readonly string[]) => new Set(xs).size === xs.length;

describe('chapters', () => {
  it('cover chapter ids 00–19 in order, each exactly once', () => {
    expect(CHAPTERS.map((c) => c.id)).toEqual([...CHAPTER_IDS]);
    CHAPTERS.forEach((c, i) => expect(c.number).toBe(i));
  });
  it('cinematic chapters open with a title beat and keep beats inside 0..1', () => {
    for (const c of CHAPTERS.filter((ch) => ch.layout === 'cinematic')) {
      expect(c.beats[0]?.kind, c.id).toBe('title');
      for (const b of c.beats) {
        expect(b.at[0]).toBeGreaterThanOrEqual(0);
        expect(b.at[1]).toBeLessThanOrEqual(1);
        expect(b.at[0]).toBeLessThan(b.at[1]);
      }
    }
  });
});

describe('rules', () => {
  it('have unique kebab-case ids and at least one source', () => {
    expect(unique(RULES.map((r) => r.id))).toBe(true);
    for (const r of RULES) {
      expect(r.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(r.sources.length, r.id).toBeGreaterThan(0);
    }
  });
  it('label the fake rules as fake', () => {
    const fake = RULES.filter((r) => r.fake);
    expect(fake.length).toBe(2);
    expect(fake.every((r) => r.category === 'fake')).toBe(true);
  });
});

describe('episodes', () => {
  it('list every anime episode 1–37 once, each mapped to a chapter', () => {
    expect(EPISODES.map((e) => e.number)).toEqual(Array.from({ length: 37 }, (_, i) => i + 1));
    for (const e of EPISODES) expect(chapterSet.has(e.chapter), `${e.number}`).toBe(true);
  });
});

describe('timeline', () => {
  it('references valid chapters and characters and cites sources', () => {
    expect(unique(TIMELINE.map((e) => e.id))).toBe(true);
    for (const e of TIMELINE) {
      expect(chapterSet.has(e.chapter), e.id).toBe(true);
      for (const c of e.characters) expect(characterSet.has(c), `${e.id} → ${c}`).toBe(true);
      expect(e.sources.length, e.id).toBeGreaterThan(0);
    }
  });
});

describe('characters', () => {
  it('profile every CHARACTER_ID exactly once', () => {
    expect(CHARACTERS.map((c) => c.id).sort()).toEqual([...CHARACTER_IDS].sort());
  });
  it('only relate to known characters and cite sources', () => {
    for (const c of CHARACTERS) {
      for (const r of c.relationships)
        expect(characterSet.has(r.to), `${c.id} → ${r.to}`).toBe(true);
      expect(c.sources.length, c.id).toBeGreaterThan(0);
      expect(chapterSet.has(c.introduced.chapter), c.id).toBe(true);
    }
  });
});

describe('creators', () => {
  it('back every fact with a source', () => {
    for (const f of [...CREATORS.flatMap((c) => c.facts), ...WORK_FACTS])
      expect(f.sources.length).toBeGreaterThan(0);
    expect(CREATORS.map((c) => c.id).sort()).toEqual(['obata', 'ohba']);
  });
});
