import { useSavedStore } from '@/features/saved/store';

describe('useSavedStore', () => {
  beforeEach(() => {
    useSavedStore.getState().clear();
  });

  it('toggles ids on and off', () => {
    const { toggle, isSaved } = useSavedStore.getState();
    expect(isSaved('x')).toBe(false);
    toggle('x');
    expect(useSavedStore.getState().isSaved('x')).toBe(true);
    useSavedStore.getState().toggle('x');
    expect(useSavedStore.getState().isSaved('x')).toBe(false);
  });

  it('tracks multiple ids independently', () => {
    const { toggle } = useSavedStore.getState();
    toggle('a');
    toggle('b');
    expect(useSavedStore.getState().ids.size).toBe(2);
    toggle('a');
    expect(useSavedStore.getState().ids.size).toBe(1);
    expect(useSavedStore.getState().isSaved('b')).toBe(true);
  });
});
