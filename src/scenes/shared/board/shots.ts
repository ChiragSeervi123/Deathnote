import type { BoardCard } from './EvidenceBoard';

export type V3 = readonly [number, number, number];
export interface Shot {
  t: number;
  tgt: V3;
  pos: V3;
}

/** Frame a card so it sits opposite the side its beat text appears on. */
export function focusCard(cards: readonly BoardCard[], id: string, textSide: 1 | -1, t: number, dist = 3.9): Shot {
  const c = cards.find((x) => x.id === id);
  if (!c) throw new Error(`board card ${id} missing`);
  const tx = c.at[0] + textSide * 0.95;
  return { t, tgt: [tx, c.at[1], 0], pos: [tx - textSide * 0.25, c.at[1] + 0.15, dist] };
}

export function shotTracks(shots: readonly Shot[]) {
  return {
    pos: shots.map((s) => ({ t: s.t, v: s.pos })),
    tgt: shots.map((s) => ({ t: s.t, v: s.tgt })),
  };
}
