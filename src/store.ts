import { create } from 'zustand';

type Section = 'about' | 'projects' | null;

interface StoreState {
  currentSection: Section;
  setSection: (section: Section) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentSection: null,
  setSection: (section) => set({ currentSection: section }),
}));
