import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SavedState = {
  ids: ReadonlySet<string>;
  hasHydrated: boolean;
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
  _setHasHydrated: (v: boolean) => void;
};

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      ids: new Set<string>(),
      hasHydrated: false,
      isSaved: id => get().ids.has(id),
      toggle: id => {
        const next = new Set(get().ids);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        set({ ids: next });
      },
      clear: () => set({ ids: new Set<string>() }),
      _setHasHydrated: v => set({ hasHydrated: v }),
    }),
    {
      name: 'altlite-saved',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ ids: Array.from(state.ids) as unknown as ReadonlySet<string> }),
      merge: (persisted, current) => {
        const persistedIds = (persisted as { ids?: unknown } | undefined)?.ids;
        const ids = Array.isArray(persistedIds)
          ? new Set(persistedIds as string[])
          : new Set<string>();
        return { ...current, ids };
      },
      onRehydrateStorage: () => state => {
        state?._setHasHydrated(true);
      },
    },
  ),
);

export function useIsSaved(id: string): boolean {
  return useSavedStore(s => s.ids.has(id));
}

export function useSavedCount(): number {
  return useSavedStore(s => s.ids.size);
}
