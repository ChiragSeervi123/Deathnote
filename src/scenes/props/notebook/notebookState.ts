import { PAGE_RULES } from './notebookTextures';

/** Mutable animation state for a NotebookModel, written by the owning scene every frame. */
export interface NotebookState {
  /** 0 closed → 1 cover lying open to the left. */
  coverOpen: number;
  /** Per page: turn 0 (right) → 1 (left); write 0 → 1 reveals its handwriting. */
  pages: { turn: number; write: number }[];
  /** 0..1 subtle highlight when interactive and hovered. */
  hover: number;
}

export function createNotebookState(pageCount = PAGE_RULES.length + 1): NotebookState {
  return {
    coverOpen: 0,
    pages: Array.from({ length: pageCount }, () => ({ turn: 0, write: 0 })),
    hover: 0,
  };
}
