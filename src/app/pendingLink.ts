import { create } from 'zustand';

type State = {
  pendingUrl: string | null;
  setPending: (url: string | null) => void;
  consume: () => string | null;
};

export const usePendingLinkStore = create<State>((set, get) => ({
  pendingUrl: null,
  setPending: url => set({ pendingUrl: url }),
  consume: () => {
    const { pendingUrl } = get();
    if (pendingUrl) set({ pendingUrl: null });
    return pendingUrl;
  },
}));
