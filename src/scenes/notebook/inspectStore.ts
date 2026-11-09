import { create } from 'zustand';

/** Interactive "explore the notebook" mode for Chapter 01 (DOM controls ↔ 3D pages). */
interface InspectState {
  active: boolean;
  /** Number of pages turned to the left (0 = first rule page on the right). */
  page: number;
  pageCount: number;
  open: () => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

export const useNotebookInspect = create<InspectState>()((set, get) => ({
  active: false,
  page: 0,
  pageCount: 5,
  open: () => set({ active: true, page: 0 }),
  close: () => set({ active: false }),
  next: () => set({ page: Math.min(get().pageCount - 1, get().page + 1) }),
  prev: () => set({ page: Math.max(0, get().page - 1) }),
}));
