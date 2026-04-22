import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedMode = 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  hasHydrated: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: (currentResolved: ResolvedMode) => void;
  _setHasHydrated: (v: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      mode: 'system',
      hasHydrated: false,
      setMode: mode => set({ mode }),
      toggle: currentResolved => set({ mode: currentResolved === 'dark' ? 'light' : 'dark' }),
      _setHasHydrated: v => set({ hasHydrated: v }),
    }),
    {
      name: 'altlite-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ mode: state.mode }),
      onRehydrateStorage: () => state => {
        state?._setHasHydrated(true);
      },
    },
  ),
);
