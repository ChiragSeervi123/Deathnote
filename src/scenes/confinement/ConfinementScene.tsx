import { use } from 'react';
import { ensureCanvasFonts } from '@/app/fonts';
import { BoardRig } from '../shared/board/BoardRig';
import { EvidenceBoard, type BoardCard, type BoardString } from '../shared/board/EvidenceBoard';
import { focusCard, type Shot } from '../shared/board/shots';

/**
 * Chapter 08 — Confinement & Memory. The ownership chain laid out as a case
 * board under cold light (facts: docs/content/rules-and-mechanics.md §3.4).
 */
const CARDS: readonly BoardCard[] = [
  {
    id: 'cells',
    at: [-3.4, 1.0],
    width: 1.7,
    appear: 0.12,
    spec: { kind: 'feeds', title: 'CELL' },
  },
  {
    id: 'misa',
    at: [-3.6, -1.3],
    width: 0.8,
    rot: 0.03,
    appear: 0.15,
    spec: { kind: 'portrait', name: 'Misa Amane', role: 'detained', tone: 'light' },
  },
  {
    id: 'misa-nb',
    at: [-1.9, -1.0],
    width: 1.1,
    rot: -0.03,
    appear: 0.2,
    spec: {
      kind: 'file',
      ref: 'NOTEBOOK · MISA',
      title: 'Given up',
      lines: ['Ownership renounced', 'in custody.', 'Memories: gone.'],
    },
  },
  {
    id: 'light',
    at: [-1.5, 1.2],
    width: 0.8,
    rot: -0.02,
    appear: 0.28,
    spec: { kind: 'portrait', name: 'Light Yagami', role: 'confined', tone: 'dark' },
  },
  {
    id: 'light-nb',
    at: [0.1, 1.0],
    width: 1.1,
    rot: 0.03,
    appear: 0.32,
    spec: {
      kind: 'file',
      ref: 'NOTEBOOK · LIGHT',
      title: 'Given up',
      lines: ['Renounced in his', 'cell. Memories of', 'Kira: gone.'],
    },
  },
  {
    id: 'rule',
    at: [0.3, -1.2],
    width: 1.5,
    rot: -0.02,
    appear: 0.42,
    spec: { kind: 'note', text: 'Give it up: forget. Touch it again: remember.' },
  },
  {
    id: 'buried',
    at: [1.9, 1.1],
    width: 1.0,
    rot: 0.05,
    appear: 0.58,
    spec: { kind: 'stamp', text: 'BURIED', sub: 'Misa’s notebook' },
  },
  {
    id: 'new',
    at: [3.4, -0.6],
    width: 1.2,
    rot: -0.02,
    appear: 0.7,
    spec: {
      kind: 'file',
      ref: 'NEW OWNER',
      title: 'Yotsuba Group',
      lines: ['A notebook reaches', 'a new hand.', 'The killings resume.'],
    },
  },
];

const STRINGS: readonly BoardString[] = [
  { from: 'misa', to: 'misa-nb', appear: 0.22 },
  { from: 'light', to: 'light-nb', appear: 0.34 },
  { from: 'light-nb', to: 'rule', appear: 0.44 },
  { from: 'misa-nb', to: 'rule', appear: 0.46 },
  { from: 'light-nb', to: 'buried', appear: 0.6 },
  { from: 'rule', to: 'new', appear: 0.72 },
];

const SHOTS: readonly Shot[] = [
  { t: 0, tgt: [0, 0, 0], pos: [0, 0.3, 8.5] },
  focusCard(CARDS, 'cells', 1, 0.18),
  focusCard(CARDS, 'light', -1, 0.33),
  focusCard(CARDS, 'rule', 1, 0.47),
  focusCard(CARDS, 'buried', -1, 0.61),
  focusCard(CARDS, 'new', 1, 0.76),
  { t: 1, tgt: [0.4, 0, 0], pos: [0.4, 0.2, 7.8] },
];

let fontsPromise: Promise<void> | null = null;

export default function ConfinementScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  return (
    <>
      <BoardRig shots={SHOTS} light="#cfe0ff" ambient={0.3} background="#04060a" />
      <EvidenceBoard cards={CARDS} strings={STRINGS} size={[11, 6.5]} boardColor="#0f1217" />
    </>
  );
}
