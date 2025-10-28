import { create } from 'zustand';
import type { Page, Section } from '@/types';

interface PageEditorState {
  page: Page | null;
  originalPage: Page | null;
  hasUnsavedChanges: boolean;

  // Actions
  setPage: (page: Page) => void;
  updatePage: (updates: Partial<Page>) => void;
  addSection: (section: Section) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (sections: Section[]) => void;
  updateBlock: (sectionId: string, blockId: string, data: any) => void;
  addBlock: (sectionId: string, block: any) => void;
  deleteBlock: (sectionId: string, blockId: string) => void;
  markAsSaved: () => void;
  reset: () => void;
}

export const usePageEditorStore = create<PageEditorState>((set) => ({
  page: null,
  originalPage: null,
  hasUnsavedChanges: false,

  setPage: (page) => set({
    page,
    originalPage: JSON.parse(JSON.stringify(page)), // Deep clone
    hasUnsavedChanges: false
  }),

  updatePage: (updates) => set((state) => {
    if (!state.page) return state;
    return {
      page: { ...state.page, ...updates },
      hasUnsavedChanges: true
    };
  }),

  addSection: (section) => set((state) => {
    if (!state.page) return state;
    return {
      page: {
        ...state.page,
        sections: [...state.page.sections, section]
      },
      hasUnsavedChanges: true
    };
  }),

  updateSection: (sectionId, updates) => set((state) => {
    if (!state.page) return state;
    return {
      page: {
        ...state.page,
        sections: state.page.sections.map(s =>
          s.id === sectionId ? { ...s, ...updates } : s
        )
      },
      hasUnsavedChanges: true
    };
  }),

  deleteSection: (sectionId) => set((state) => {
    if (!state.page) return state;
    return {
      page: {
        ...state.page,
        sections: state.page.sections.filter(s => s.id !== sectionId)
      },
      hasUnsavedChanges: true
    };
  }),

  reorderSections: (sections) => set((state) => {
    if (!state.page) return state;
    return {
      page: {
        ...state.page,
        sections
      },
      hasUnsavedChanges: true
    };
  }),

  updateBlock: (sectionId, blockId, data) => set((state) => {
    if (!state.page) return state;

    return {
      page: {
        ...state.page,
        sections: state.page.sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                blocks: s.blocks.map(b =>
                  b.id === blockId ? { ...b, ...data } : b
                )
              }
            : s
        )
      },
      hasUnsavedChanges: true
    };
  }),

  addBlock: (sectionId, block) => set((state) => {
    if (!state.page) return state;
    return {
      page: {
        ...state.page,
        sections: state.page.sections.map(s =>
          s.id === sectionId
            ? { ...s, blocks: [...s.blocks, block] }
            : s
        )
      },
      hasUnsavedChanges: true
    };
  }),

  deleteBlock: (sectionId, blockId) => set((state) => {
    if (!state.page) return state;
    return {
      page: {
        ...state.page,
        sections: state.page.sections.map(s =>
          s.id === sectionId
            ? { ...s, blocks: s.blocks.filter(b => b.id !== blockId) }
            : s
        )
      },
      hasUnsavedChanges: true
    };
  }),

  markAsSaved: () => set((state) => ({
    originalPage: state.page ? JSON.parse(JSON.stringify(state.page)) : null,
    hasUnsavedChanges: false
  })),

  reset: () => set({
    page: null,
    originalPage: null,
    hasUnsavedChanges: false
  }),
}));
