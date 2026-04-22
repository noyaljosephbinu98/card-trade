import { create } from 'zustand';

import { DEFAULT_FILTERS, type Filters } from './types';

type FiltersState = {
  filters: Filters;
  setFilters: (next: Partial<Filters>) => void;
  replaceFilters: (next: Filters) => void;
};

export const useFiltersStore = create<FiltersState>(set => ({
  filters: DEFAULT_FILTERS,
  setFilters: next => set(s => ({ filters: { ...s.filters, ...next } })),
  replaceFilters: next => set({ filters: next }),
}));
